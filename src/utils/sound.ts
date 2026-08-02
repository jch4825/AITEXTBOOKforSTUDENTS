/**
 * 스튜디오 효과음 재생 (05-ENGINE-SPEC §7).
 *
 * 소리는 "지금 무슨 일이 일어났는가"를 알리는 신호다. 같은 사건에는 늘 같은 소리가
 * 나야 학생이 그 소리를 신호로 배운다. 그래서 이름을 사건 단위로 고정해 두고,
 * 화면 쪽에서는 `playSound('scene-next')`처럼 사건만 부른다.
 *
 * 지키는 규칙 세 가지:
 * - **오답 소리는 없다.** 정답과 오답 모두 `select`·`confirm`으로 똑같이 울린다.
 *   틀린 순간 소리가 달라지면 학생은 소리만으로 틀렸음을 알게 되고, 이는 벌점 없는
 *   재선택 구조(05-ENGINE-SPEC §3)를 소리로 되돌리는 셈이다.
 * - **말소리를 덮지 않는다.** TTS가 읽는 중이면 건너뛴다. 듣기로 이해하는 학생에게
 *   대사 위에 얹힌 효과음은 대사를 통째로 뭉갠다.
 * - **연타로 겹치지 않는다.** 같은 소리는 300ms 안에 다시 울리지 않는다.
 */
import { publicAssetUrl } from './publicAssetUrl';

export type SoundName =
  | 'select'
  | 'confirm'
  | 'scene-next'
  | 'fill'
  | 'stamp'
  | 'stage-advance'
  | 'stage-back'
  | 'artifact-done'
  | 'lesson-complete';

const SOUND_NAMES: SoundName[] = [
  'select', 'confirm', 'scene-next', 'fill', 'stamp',
  'stage-advance', 'stage-back', 'artifact-done', 'lesson-complete',
];

const REPEAT_GUARD_MS = 300;
/**
 * 아직 안 받은 소리를 기다려 주는 한계. 첫 조작에서는 미리 받기와 첫 클릭이 같은
 * 순간에 일어나 소리가 통째로 사라진다. 그렇다고 한없이 기다리면 한참 뒤에 뜬금없이
 * 울려 무슨 소리인지 알 수 없게 되므로, 늦게 온 소리는 버린다.
 */
const LATE_PLAY_LIMIT_MS = 500;

let enabled = true;
let context: AudioContext | null = null;
const buffers = new Map<SoundName, AudioBuffer>();
const loading = new Map<SoundName, Promise<void>>();
const lastPlayedAt = new Map<SoundName, number>();

/** 교사 설정과 동기화한다. 끄면 이후 재생 요청은 조용히 무시된다. */
export function setSoundEnabled(next: boolean): void {
  enabled = next;
}

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined' || typeof window.AudioContext !== 'function') return null;
  if (!context) context = new window.AudioContext();
  return context;
}

function load(name: SoundName): Promise<void> {
  const existing = loading.get(name);
  if (existing) return existing;

  const task = (async () => {
    const audio = audioContext();
    if (!audio) return;
    try {
      const response = await fetch(publicAssetUrl(`/sounds/${name}.m4a`));
      if (!response.ok) return;
      const bytes = await response.arrayBuffer();
      buffers.set(name, await audio.decodeAudioData(bytes));
    } catch {
      // 소리는 보조 신호다. 못 읽으면 조용히 넘어가고 학습은 그대로 진행한다.
    }
  })();

  loading.set(name, task);
  return task;
}

/**
 * 첫 사용자 조작에서 부른다. 브라우저 자동재생 정책 때문에 AudioContext는 조작
 * 이후에만 소리를 낼 수 있고, 미리 받아 두지 않으면 첫 소리가 눈에 띄게 늦는다.
 */
export function primeSounds(): void {
  const audio = audioContext();
  if (!audio) return;
  if (audio.state === 'suspended') void audio.resume();
  for (const name of SOUND_NAMES) void load(name);
}

export function playSound(name: SoundName): void {
  if (!enabled) return;
  const audio = audioContext();
  if (!audio) return;

  // 읽어 주는 중에는 울리지 않는다.
  if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) return;

  const now = performance.now();
  if (now - (lastPlayedAt.get(name) ?? Number.NEGATIVE_INFINITY) < REPEAT_GUARD_MS) return;
  lastPlayedAt.set(name, now);

  const buffer = buffers.get(name);
  if (!buffer) {
    void load(name).then(() => {
      const ready = buffers.get(name);
      if (!ready || !enabled) return;
      if (performance.now() - now > LATE_PLAY_LIMIT_MS) return;
      emit(audio, ready);
    });
    return;
  }

  emit(audio, buffer);
}

function emit(audio: AudioContext, buffer: AudioBuffer): void {
  if (audio.state === 'suspended') void audio.resume();
  const source = audio.createBufferSource();
  source.buffer = buffer;
  source.connect(audio.destination);
  source.start();
}
