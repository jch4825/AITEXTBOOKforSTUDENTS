/**
 * 각본 문자열에 섞인 화자 표기(`진우: "..."`)를 말풍선 조각으로 나눈다.
 *
 * Wave 1 각본은 한 문자열 안에 대사와 서술을 함께 담는다(02-CHARACTERS §2-1).
 * 엔진은 그 표기를 읽어 화자 라벨을 붙이되, **표기를 찾지 못하면 통째로 서술 한 줄**로
 * 돌려준다. 포맷을 지정하지 않은 차시와 서술 위주 문장이 지금과 똑같이 보여야 하므로
 * 파싱 실패는 오류가 아니라 정상 경로다(05-ENGINE-SPEC §2).
 */

export interface SpeakerSegment {
  /** 화자 이름. 서술 문장은 null. */
  speaker: string | null;
  text: string;
}

/** 말풍선이 놓이는 바탕. 이야기 대사창은 어둡고, 반응 대사는 밝은 지면 위에 온다. */
export type SpeakerTone = 'dark' | 'light';

/**
 * 캐릭터 헌장(02-CHARACTERS §1)의 고정 배역과 색.
 * 같은 인물이라도 바탕에 따라 읽히는 명도가 달라 두 벌을 둔다.
 */
const CAST_COLORS: Record<string, Record<SpeakerTone, string>> = {
  진우: { dark: '#F7C67A', light: '#A96A12' },
  윤아: { dark: '#8FE0C8', light: '#0F7A63' },
  // 아이미의 LED 색. "AI가 실제로 말할 때"만 쓰라는 토큰 주석과 정확히 같은 쓰임이다.
  아이미: { dark: 'var(--brand-glow)', light: '#12708F' },
  '민준 선생님': { dark: '#E9B8DC', light: '#8B3F75' },
};

/** 배역표에는 없지만 각본에 실제로 등장하는 단역. 색은 중립색을 쓴다. */
const EXTRA_SPEAKERS = [
  '민준쌤',
  '새로 온 하린',
  '새 동아리원',
  '새 친구',
  '하린',
  '서준',
  '동생',
];

/** 긴 이름이 짧은 이름에 먹히지 않도록 길이 내림차순으로 시도한다. */
const SPEAKER_NAMES: string[] = [...Object.keys(CAST_COLORS), ...EXTRA_SPEAKERS].sort(
  (a, b) => b.length - a.length,
);

const NEUTRAL_SPEAKER_COLOR: Record<SpeakerTone, string> = {
  dark: '#CFE0E4',
  light: 'var(--ink-2)',
};

/** 이름 앞이 문장 경계여야 화자로 인정한다. 서술 한복판의 낱말이 화자로 오인되지 않게 한다. */
const BOUNDARY = /[\s.!?…"”'’」』)]/;

const OPEN_QUOTES = ['"', '“'];
const CLOSE_QUOTES = ['"', '”'];

export function speakerColor(speaker: string, tone: SpeakerTone = 'dark'): string {
  return CAST_COLORS[speaker]?.[tone] ?? NEUTRAL_SPEAKER_COLOR[tone];
}

interface SpeakerHit {
  start: number;
  end: number;
  speaker: string;
  quote: string;
}

/** index 자리에서 시작하는 화자 표기를 찾는다. 없으면 null. */
function findSpeakerAt(text: string, index: number): SpeakerHit | null {
  if (index > 0 && !BOUNDARY.test(text[index - 1])) return null;

  for (const name of SPEAKER_NAMES) {
    if (!text.startsWith(name, index)) continue;

    let cursor = index + name.length;
    if (text[cursor] !== ':') continue;
    cursor += 1;
    while (text[cursor] === ' ') cursor += 1;

    const opener = text[cursor];
    if (!OPEN_QUOTES.includes(opener)) continue;
    cursor += 1;

    const quoteStart = cursor;
    while (cursor < text.length && !CLOSE_QUOTES.includes(text[cursor])) cursor += 1;
    // 닫는 따옴표가 없으면 대사로 확정하지 않는다. 서술로 흘려보내는 편이 안전하다.
    if (cursor >= text.length) continue;

    return {
      start: index,
      end: cursor + 1,
      speaker: name,
      quote: text.slice(quoteStart, cursor),
    };
  }

  return null;
}

function pushNarration(segments: SpeakerSegment[], raw: string): void {
  const trimmed = raw.trim();
  if (trimmed) segments.push({ speaker: null, text: trimmed });
}

export function parseSpeakerLines(source: string | undefined): SpeakerSegment[] {
  const text = source ?? '';
  if (!text.trim()) return [];

  const segments: SpeakerSegment[] = [];
  let cursor = 0;
  let scan = 0;

  while (scan < text.length) {
    const hit = findSpeakerAt(text, scan);
    if (!hit) {
      scan += 1;
      continue;
    }
    pushNarration(segments, text.slice(cursor, hit.start));
    segments.push({ speaker: hit.speaker, text: hit.quote.trim() });
    cursor = hit.end;
    scan = hit.end;
  }

  pushNarration(segments, text.slice(cursor));

  // 화자 표기가 없으면 현행과 같은 한 문단으로 돌려준다.
  return segments.length > 0 ? segments : [{ speaker: null, text: text.trim() }];
}

/** 말풍선으로 그릴 값이 있는지(= 화자 표기를 하나라도 찾았는지). */
export function hasSpeakerLines(source: string | undefined): boolean {
  return parseSpeakerLines(source).some((segment) => segment.speaker !== null);
}
