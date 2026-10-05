import { BAUHAUS } from '../engine/bauhaus';
import { clamp } from '../engine/gameMath';

/**
 * 다음 낱말 이어 말하기(m1-l3)의 풍선.
 *
 * 풍선 안 글자는 풍선 안에 다 들어와야 한다. 풍선 밖으로 나간 글자는 판 위에 놓이는데, 판도
 * 글자(검정)도 어두워서 그 부분이 사라진다. 파랑 면 위의 검정 글자도 대비가 3.35라 읽히지
 * 않는다. 그래서 이 파일이 ① 글자를 원 안에 맞추고 ② 면 색에 맞는 글자 색을 고르고
 * ③ 풍선이 서로 겹치거나 판 밖으로 나가지 않게 놓는다.
 *
 * 캔버스를 모르는 순수 계산이다. 글자 너비는 부르는 쪽이 `measure`로 건넨다. 좌표는 판의
 * 실제 크기(CSS 픽셀)이고, 캔버스도 그 크기로 그리므로 그대로 쓴다.
 */

const B = BAUHAUS.board;

export type MeasureText = (text: string, fontPx: number) => number;

export interface BalloonSpec {
  word: string;
  probability: number;
}

export interface BoardSize {
  width: number;
  height: number;
}

export interface LabelRow {
  text: string;
  font: number;
  /** 줄 가운데의 세로 위치. 풍선 중심이 0이다. */
  y: number;
}

export interface BalloonPlacement {
  /** 자리 잡은 풍선의 중심 */
  x: number;
  y: number;
  radius: number;
  wordFont: number;
  pctFont: number;
  /** 낱말을 줄바꿈한 결과. 맨 위의 어울림 % 줄은 따로 붙는다. */
  lines: string[];
}

export interface BalloonLayout {
  placements: BalloonPlacement[];
  /** 기준 크기(1)에 대한 배율 */
  scale: number;
  /** false면 이 판에는 겹침 없이 담기지 않는다. 가장 작은 배율로 놓은 값을 돌려준다. */
  fits: boolean;
}

/**
 * 풍선 면 색. 어울림이 큰 낱말일수록 노랑, 작을수록 회색이다. 크기(반지름)와 색이 같은
 * 방향으로 움직이므로 색을 구별하지 못해도 큰 것이 더 어울리는 낱말이라는 것은 남는다.
 */
export const BALLOON_FACES = [B.yellow, B.blue, B.grey] as const;

/** 아이미 몸의 반지름. 그리는 쪽(지름 48)과 같아야 한다. */
export const HERO_RADIUS = 24;
/** 풍선 아래로 늘어지는 줄의 길이 */
export const STRING_LENGTH = 10;
/** 풍선이 제자리에서 흔들리는 폭(가로·세로). 배치의 여유가 이 값에서 나온다. */
export const SWAY_X = 4;
export const SWAY_Y = 3;

/** 아이미의 가로 위치. 좁은 판에서도 몸이 잘리지 않게 아래를 막는다. */
export function heroX(width: number): number {
  return clamp(width * 0.13, 36, 78);
}

/* 기준 크기(배율 1)의 반지름. 어울림 20%가 가장 작고 100%가 가장 크다. */
const RADIUS_MIN = 46;
const RADIUS_MAX = 62;
/* 글자 크기. 낱말은 클수록 좋지만 14px 밑으로는 내리지 않는다(캔버스 글자 바닥). */
const WORD_FONT = 17;
const PCT_FONT = 14;
const FONT_FLOOR = 14;
export const LINE_HEIGHT = 1.2;
/* 줄 상자의 가로·세로 끝과 풍선 둘레 사이의 여유 */
const PAD_X = 6;
const PAD_Y = 3;
/* 풍선 사이 최소 간격. 두 풍선이 서로를 향해 흔들려도 닿지 않는 폭(양쪽 합쳐 8)에 여유 2를 더했다. */
export const BALLOON_GAP = 2 * SWAY_X + 2;
/* 위아래로 이웃한 풍선의 가장자리 사이. 판이 넉넉하면 이만큼만 띄워 모아 놓는다. */
const EDGE_GAP = 22;
/* 이웃한 풍선을 가로로 어긋나게 놓는 최소 폭 */
const STAGGER = 30;
/* 판 가장자리 여유. 흔들려도 판 밖으로 나가지 않는 폭에 5를 더했고, 아래에는 줄이 들어간다. */
export const BOARD_MARGIN = {
  top: SWAY_Y + 5,
  right: SWAY_X + 6,
  bottom: SWAY_Y + 5 + STRING_LENGTH,
};
/* 남는 가로 폭을 두 풍선 무리의 어디에 둘지. 1이면 오른쪽 끝에 붙는다. */
const RIGHT_BIAS = 0.6;

const SCALE_MAX = 1.35;
const SCALE_MIN = 0.7;
const SCALE_STEP = 0.025;
const EPS = 0.01;

const pctFontFor = (wordFont: number): number =>
  Math.max(FONT_FLOOR, Math.round((wordFont * PCT_FONT) / WORD_FONT));

/** 맨 위 % 줄과 낱말 줄을 풍선 중심에 맞춰 쌓는다. 그리는 쪽도 이 값으로 그린다. */
export function labelRows(pct: string, lines: string[], wordFont: number, pctFont: number): LabelRow[] {
  const rows = [{ text: pct, font: pctFont }, ...lines.map((text) => ({ text, font: wordFont }))];
  const total = rows.reduce((sum, row) => sum + row.font * LINE_HEIGHT, 0);
  let top = -total / 2;
  return rows.map((row) => {
    const height = row.font * LINE_HEIGHT;
    const y = top + height / 2;
    top += height;
    return { ...row, y };
  });
}

/** 글자 묶음이 원 안에 들어가려면 필요한 반지름. 줄 상자에서 중심으로부터 가장 먼 모서리가 기준이다. */
export function radiusNeeded(rows: LabelRow[], measure: MeasureText): number {
  let need = 0;
  for (const row of rows) {
    const reach = Math.abs(row.y) + (row.font * LINE_HEIGHT) / 2 + PAD_Y;
    need = Math.max(need, Math.hypot(measure(row.text, row.font) / 2 + PAD_X, reach));
  }
  return need;
}

/** 띄어쓰기에서만 끊어 나올 수 있는 줄바꿈을 모두 모은다(최대 세 줄). 낱말 한가운데는 끊지 않는다. */
function wrapCandidates(word: string): string[][] {
  const tokens = word.split(/\s+/).filter(Boolean);
  const out: string[][] = [];
  const split = (start: number, linesLeft: number, acc: string[]) => {
    if (linesLeft === 1) {
      out.push([...acc, tokens.slice(start).join(' ')]);
      return;
    }
    for (let end = start + 1; end <= tokens.length - (linesLeft - 1); end += 1) {
      split(end, linesLeft - 1, [...acc, tokens.slice(start, end).join(' ')]);
    }
  };
  for (let count = 1; count <= Math.min(3, tokens.length); count += 1) split(0, count, []);
  return out;
}

/** 이 글자 크기에서 가장 작은 원에 담기는 줄바꿈. */
function tightestWrap(word: string, pct: string, wordFont: number, measure: MeasureText) {
  const pctFont = pctFontFor(wordFont);
  let best = { lines: [word], need: Infinity };
  for (const lines of wrapCandidates(word)) {
    const need = radiusNeeded(labelRows(pct, lines, wordFont, pctFont), measure);
    if (need < best.need) best = { lines, need };
  }
  return { ...best, pctFont };
}

function place(specs: BalloonSpec[], board: BoardSize, measure: MeasureText, scale: number): BalloonLayout {
  const count = specs.length;
  const wordMax = Math.max(FONT_FLOOR, Math.round(WORD_FONT * scale));

  /* 반지름. 어울림이 클수록 크다. 긴 낱말 때문에 키운 풍선이 이 순서를 뒤집지 않게 마지막에 맞춘다. */
  const radii = specs.map((spec) => {
    const t = clamp((spec.probability - 20) / 80, 0, 1);
    const base = (RADIUS_MIN + (RADIUS_MAX - RADIUS_MIN) * t) * scale;
    const atFloor = tightestWrap(spec.word, `${spec.probability}%`, FONT_FLOOR, measure).need + 1;
    return Math.max(base, atFloor);
  });
  const ranked = specs.map((_, i) => i).sort((a, b) => specs[a].probability - specs[b].probability);
  for (let k = 1; k < ranked.length; k += 1) {
    const smaller = ranked[k - 1];
    const larger = ranked[k];
    if (specs[larger].probability > specs[smaller].probability && radii[larger] < radii[smaller] + 1.5) {
      radii[larger] = radii[smaller] + 1.5;
    }
  }

  /* 글자. 반지름이 허락하는 가장 큰 크기를 고른다. 바닥 크기는 위에서 보장했다. */
  const labels = specs.map((spec, i) => {
    const pct = `${spec.probability}%`;
    for (let font = wordMax; font > FONT_FLOOR; font -= 1) {
      const fit = tightestWrap(spec.word, pct, font, measure);
      if (fit.need <= radii[i]) return { wordFont: font, lines: fit.lines, pctFont: fit.pctFont };
    }
    const fit = tightestWrap(spec.word, pct, FONT_FLOOR, measure);
    return { wordFont: FONT_FLOOR, lines: fit.lines, pctFont: fit.pctFont };
  });

  /* 세로. 이웃한 풍선을 가장자리 EDGE_GAP 간격으로 모아 판 한가운데에 놓는다. 판이 낮으면
     간격을 줄여 담고, 그때 생기는 겹침은 아래에서 가로로 비껴 놓아 푼다. */
  const top = BOARD_MARGIN.top;
  const bottom = board.height - BOARD_MARGIN.bottom;
  const steps = radii.slice(1).map((r, i) => radii[i] + r + EDGE_GAP * scale);
  const idealSpan = steps.reduce((sum, step) => sum + step, 0);
  const room = bottom - top - radii[0] - radii[count - 1];
  const squeeze = idealSpan > 0 ? clamp(room / idealSpan, 0, 1) : 0;
  const ys = [count === 1 ? (top + bottom) / 2 : top + radii[0] + (room - idealSpan * squeeze) / 2];
  steps.forEach((step) => ys.push(ys[ys.length - 1] + step * squeeze));

  /* 가로. 위아래로 이웃한 풍선은 한 번씩 번갈아 왼쪽·오른쪽 줄에 선다. 간격이 모자라면 두 줄
     사이를 벌린다. 가운데 풍선이 오른쪽으로 삐져나오는 모양은 예전과 같다. */
  const left = heroX(board.width) + HERO_RADIUS + 12;
  const right = board.width - BOARD_MARGIN.right;
  const apart = (i: number, j: number) => {
    const reach = radii[i] + radii[j] + BALLOON_GAP;
    const dy = Math.abs(ys[i] - ys[j]);
    return dy >= reach ? 0 : Math.sqrt(reach * reach - dy * dy);
  };
  let shift = count > 1 ? STAGGER * scale : 0;
  for (let i = 0; i + 1 < count; i += 1) shift = Math.max(shift, apart(i, i + 1));
  const evenReach = Math.max(...radii.filter((_, i) => i % 2 === 0));
  const oddReach = count > 1 ? Math.max(...radii.filter((_, i) => i % 2 === 1)) : 0;
  const clusterWidth = count > 1 ? evenReach + shift + oddReach : 2 * evenReach;
  const slack = Math.max(0, right - left - clusterWidth);
  const evenX = left + slack * RIGHT_BIAS + evenReach;
  const xs = radii.map((_, i) => (i % 2 === 0 ? evenX : evenX + shift));

  let fits = true;
  for (let i = 0; i < count; i += 1) {
    if (xs[i] - radii[i] < left - EPS || xs[i] + radii[i] > right + EPS) fits = false;
    if (ys[i] - radii[i] < top - EPS || ys[i] + radii[i] > bottom + EPS) fits = false;
    for (let j = i + 1; j < count; j += 1) {
      if (Math.hypot(xs[i] - xs[j], ys[i] - ys[j]) < radii[i] + radii[j] + BALLOON_GAP - EPS) fits = false;
    }
  }

  return {
    scale,
    fits,
    placements: specs.map((_, i) => ({
      x: xs[i],
      y: ys[i],
      radius: radii[i],
      wordFont: labels[i].wordFont,
      pctFont: labels[i].pctFont,
      lines: labels[i].lines,
    })),
  };
}

/**
 * 풍선 한 무리를 판에 놓는다.
 *
 * `maxScale`(기본은 가장 큰 배율)부터 내려가며 판에 담기는 배율을 찾는다. 큰 화면에서는 풍선과
 * 글자가 커지고, 좁고 낮은 판에서는 글자 바닥(14px)까지 줄어든다. 그래도 안 담기면 가장 작은
 * 배율의 결과를 돌려주고 `fits`를 false로 둔다.
 */
export function layoutBalloons(
  specs: BalloonSpec[],
  board: BoardSize,
  measure: MeasureText,
  maxScale: number = SCALE_MAX,
): BalloonLayout {
  if (specs.length === 0) return { placements: [], scale: 1, fits: true };
  const start = Math.min(maxScale, SCALE_MAX);
  let layout = place(specs, board, measure, start);
  for (let k = 1; !layout.fits; k += 1) {
    const scale = start - k * SCALE_STEP;
    if (scale < SCALE_MIN - EPS) break;
    layout = place(specs, board, measure, scale);
  }
  return layout;
}

/**
 * 여러 무리가 한 판에서 같이 쓸 배율. 무리마다 담기는 가장 큰 배율 가운데 가장 작은 값이다.
 *
 * 단계가 바뀔 때마다 같은 어울림이 다른 크기로 보이면 "큰 풍선일수록 어울린다"는 단서가
 * 흐려진다. 세 풍선이 긴 낱말을 들고 오는 단계가 판을 가장 많이 쓰므로 그 단계에 맞춘다.
 */
export function commonScale(groups: BalloonSpec[][], board: BoardSize, measure: MeasureText): number {
  const scales = groups.filter((specs) => specs.length > 0).map((specs) => layoutBalloons(specs, board, measure).scale);
  return Math.min(SCALE_MAX, ...scales);
}

/* ── 글자색 ────────────────────────────────────────────────────────────── */

function luminance(color: string): number {
  const value = parseInt(color.slice(1), 16);
  const channel = (shift: number) => {
    const c = ((value >> shift) & 255) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(16) + 0.7152 * channel(8) + 0.0722 * channel(0);
}

export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/**
 * 면 위에 올릴 글자 색. 판의 검정과 밝은 글자 색 가운데 대비가 큰 쪽이다.
 * 노랑·회색은 검정이, 파랑은 밝은 글자가 읽힌다(파랑 위 검정은 3.35, 밝은 글자는 4.87).
 */
export function inkOnFace(face: string): string {
  return contrastRatio(face, B.ground) >= contrastRatio(face, B.ink) ? B.ground : B.ink;
}
