import { toSpeechText } from './speechText';

/** Strip markdown-ish syntax so TTS doesn't read backticks/asterisks aloud. */
export function stripForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  /** 이 소리를 낸 단추의 이름. 단추가 "내가 지금 읽히는 중인가"를 알아보는 데 쓴다. */
  key?: string;
  /** 읽기 시작 신호를 이만큼 기다려도 없으면 소리를 낼 수 없는 기기로 보고 접는다(기본 4초). */
  startTimeoutMs?: number;
}

export interface SpeakingState {
  /** 지금 읽는 소리의 이름. 읽지 않거나 이름 없는 소리면 null. */
  key: string | null;
  /** 차례대로 읽는 중이면 그 묶음의 이름. 낱개 소리나 읽지 않을 때는 null. */
  group: string | null;
}

export interface SequenceItem {
  text: string;
  key: string;
}

/**
 * 한 번에 읽는 글의 길이 상한. 크롬의 인터넷 목소리는 15초쯤 읽다가 끝 신호 없이 멈추는 일이 있다.
 * 우리말은 1초에 대여섯 글자쯤 읽으니 90자면 15초 안에 든다. 긴 글은 문장 단위로 끊어 이어 읽는다.
 */
const CHUNK_MAX_CHARS = 90;
/** 읽기 시작 신호를 기다리는 시간. 인터넷 목소리는 시작이 1~2초 늦기도 한다. */
const START_TIMEOUT_MS = 4000;
/** 끝 신호가 끝내 오지 않을 때 읽기를 마친 것으로 치는 한계: 3초 + 글자당 0.3초. */
const END_BASE_MS = 3000;
const END_PER_CHAR_MS = 300;

let activeUtterance: SpeechSynthesisUtterance | null = null;
// 지금 읽는 조각의 안전장치 타이머를 걷는 함수. 새 소리나 멈춤이 오면 먼저 걷는다.
let clearActiveTimers: (() => void) | null = null;
let speakingState: SpeakingState = { key: null, group: null };
const listeners = new Set<() => void>();
// 차례 읽기가 새 소리나 멈춤에 밀려났는지 가르는 번호. 번호가 바뀌면 이어 읽지 않는다.
let sequenceToken = 0;

function supported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function setSpeakingState(next: SpeakingState): void {
  if (next.key === speakingState.key && next.group === speakingState.group) return;
  speakingState = next;
  listeners.forEach((listener) => listener());
}

/** useSyncExternalStore용. 단추가 자기 차례인지 보고 모양을 바꾼다. */
export function subscribeSpeaking(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getSpeakingState(): SpeakingState {
  return speakingState;
}

/**
 * 글을 문장 단위로 끊어 한 조각이 `max`자를 넘지 않게 한다. 짧은 문장은 `max`자까지 합친다.
 * 마침표는 뒤가 공백이거나 글의 끝일 때만 문장의 끝으로 본다(3.5 같은 소수는 자르지 않는다).
 */
export function splitForSpeech(text: string, max = CHUNK_MAX_CHARS): string[] {
  const sentences: string[] = [];
  let buffer = '';
  for (let i = 0; i < text.length; i += 1) {
    buffer += text[i];
    const isEnd = '.!?。…'.includes(text[i]) && (i === text.length - 1 || /\s/.test(text[i + 1]));
    if (isEnd) {
      if (buffer.trim()) sentences.push(buffer.trim());
      buffer = '';
    }
  }
  if (buffer.trim()) sentences.push(buffer.trim());

  const merged: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (current && `${current} ${sentence}`.length > max) {
      merged.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) merged.push(current);

  // 마침표 없이 이어지는 긴 글은 max자 안쪽의 마지막 공백에서 자른다.
  return merged.flatMap((chunk) => {
    const parts: string[] = [];
    let rest = chunk;
    while (rest.length > max) {
      const cut = rest.lastIndexOf(' ', max);
      const at = cut > 0 ? cut : max;
      parts.push(rest.slice(0, at).trim());
      rest = rest.slice(at).trim();
    }
    if (rest) parts.push(rest);
    return parts;
  });
}

/**
 * 한 조각을 읽는다. 읽기가 끝나면 `onDone(true)`, 끊기거나 실패하면 `onDone(false)`를 부른다.
 * 다른 소리가 이미 이어받았거나 멈춘 뒤에 늦게 오는 콜백은 부르지 않는다.
 *
 * 두 가지 안전장치를 건다. 읽기 시작 신호가 끝내 없으면(목소리·엔진이 없는 기기) 대기열에서 치우고 실패로 접는다.
 * 그러지 않으면 듣기 단추가 "멈추기" 모양으로 영영 남는다. 끝 신호가 안 오는 브라우저에서는 한계 시간 뒤에
 * 읽은 것으로 치고 이어 간다.
 */
function utter(
  text: string,
  opts: SpeakOptions | undefined,
  group: string | null,
  onDone?: (finished: boolean) => void,
): void {
  clearActiveTimers?.();
  clearActiveTimers = null;
  // Resolve Google Chrome Speech Synthesis lock-up state
  window.speechSynthesis.resume();
  window.speechSynthesis.cancel();

  const cleanText = stripForSpeech(text);
  const u = new SpeechSynthesisUtterance(cleanText);

  // Hold active reference to block Chrome's Garbage Collection bug from muting voice mid-speech
  activeUtterance = u;

  u.lang = 'ko-KR';
  u.rate = opts?.rate ?? 1.0;
  u.pitch = opts?.pitch ?? 1.0;

  let startTimer = 0;
  let endTimer = 0;
  const finish = (finished: boolean) => {
    if (activeUtterance !== u) return;
    window.clearTimeout(startTimer);
    window.clearTimeout(endTimer);
    clearActiveTimers = null;
    activeUtterance = null;
    // 차례 읽기는 다음 칸을 기다리는 동안에도 묶음이 이어진다.
    setSpeakingState({ key: null, group });
    onDone?.(finished);
  };
  const alive = () => window.clearTimeout(startTimer);
  u.onstart = alive;
  u.onboundary = alive;
  u.onend = () => finish(true);
  u.onerror = () => finish(false);

  startTimer = window.setTimeout(() => {
    if (activeUtterance !== u) return;
    window.speechSynthesis.cancel();
    finish(false);
  }, opts?.startTimeoutMs ?? START_TIMEOUT_MS);
  endTimer = window.setTimeout(() => {
    if (activeUtterance !== u) return;
    window.speechSynthesis.cancel();
    finish(true);
  }, END_BASE_MS + cleanText.length * END_PER_CHAR_MS);

  clearActiveTimers = () => {
    window.clearTimeout(startTimer);
    window.clearTimeout(endTimer);
  };
  setSpeakingState({ key: opts?.key ?? null, group });
  window.speechSynthesis.speak(u);
}

interface Piece {
  text: string;
  key: string | null;
  /** 이 조각이 한 칸(항목)의 마지막인가. 칸 사이에만 쉰다. */
  last: boolean;
}

/** 조각들을 차례로 읽는다. 새 소리·멈춤·실패가 끼어들면 거기서 끝낸다. */
function playPieces(
  pieces: Piece[],
  token: number,
  group: string | null,
  opts: SpeakOptions | undefined,
  gapMs: number,
): void {
  const run = (index: number) => {
    if (token !== sequenceToken) return;
    if (index >= pieces.length) {
      setSpeakingState({ key: null, group: null });
      return;
    }
    const piece = pieces[index];
    utter(piece.text, { ...opts, key: piece.key ?? undefined }, group, (finished) => {
      if (token !== sequenceToken) return;
      if (!finished) {
        setSpeakingState({ key: null, group: null });
        return;
      }
      if (piece.last && gapMs > 0) window.setTimeout(() => run(index + 1), gapMs);
      else run(index + 1);
    });
  };
  run(0);
}

export function speak(text: string, opts?: SpeakOptions) {
  if (!supported()) return;
  const token = ++sequenceToken;
  const chunks = splitForSpeech(stripForSpeech(toSpeechText(text)));
  playPieces(
    chunks.map((chunk, index) => ({ text: chunk, key: opts?.key ?? null, last: index === chunks.length - 1 })),
    token,
    null,
    opts,
    0,
  );
}

/**
 * 여러 칸을 차례대로 읽는다(선택지 "모두 듣기"). 칸마다 이름(key)을 달아 두면 단추가
 * 지금 읽는 칸을 알아보고 강조할 수 있다. 칸 사이에 짧게 쉬어 한 칸이 끝났음을 귀로 알린다.
 * 다른 소리를 내거나 `stopSpeaking`을 부르면 거기서 끝난다.
 */
export function speakSequence(
  items: SequenceItem[],
  opts: { group: string; gapMs?: number; rate?: number; startTimeoutMs?: number },
): void {
  if (!supported() || items.length === 0) return;
  const token = ++sequenceToken;
  const pieces = items.flatMap((item) => {
    const chunks = splitForSpeech(stripForSpeech(toSpeechText(item.text)));
    return chunks.map((chunk, index) => ({ text: chunk, key: item.key, last: index === chunks.length - 1 }));
  });
  if (pieces.length === 0) return;
  playPieces(pieces, token, opts.group, { rate: opts.rate, startTimeoutMs: opts.startTimeoutMs }, opts.gapMs ?? 500);
}

export function stopSpeaking() {
  sequenceToken += 1;
  clearActiveTimers?.();
  clearActiveTimers = null;
  activeUtterance = null;
  if (supported()) window.speechSynthesis.cancel();
  setSpeakingState({ key: null, group: null });
}

/**
 * 이 기기에서 쓸 수 있는 한국어 목소리. 목소리 목록은 브라우저가 늦게 채워 주므로
 * 비어 있으면 `voiceschanged`를 잠깐 기다린다. 교사용 소리 점검이 쓴다.
 */
export function listKoreanVoices(timeoutMs = 1500): Promise<SpeechSynthesisVoice[]> {
  if (!supported()) return Promise.resolve([]);
  const synth = window.speechSynthesis;
  const pick = () => synth.getVoices().filter((voice) => voice.lang?.toLowerCase().startsWith('ko'));
  const ready = pick();
  if (ready.length > 0) return Promise.resolve(ready);
  return new Promise((resolve) => {
    const finish = () => {
      window.clearTimeout(timer);
      synth.removeEventListener('voiceschanged', onChange);
      resolve(pick());
    };
    const onChange = () => { if (pick().length > 0) finish(); };
    const timer = window.setTimeout(finish, timeoutMs);
    synth.addEventListener('voiceschanged', onChange);
  });
}

export function speechSynthesisSupported(): boolean {
  return supported();
}
