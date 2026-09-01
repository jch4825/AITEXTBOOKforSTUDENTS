/**
 * 미니게임 공용 수학.
 *
 * 62개 게임이 각자 clamp와 충돌 판정을 다시 쓰면 미묘하게 다른 규칙이 생긴다.
 * 여기 한 곳에 두어 "닿았다"의 뜻이 게임마다 달라지지 않게 한다.
 *
 * 좌표는 게임마다 정한 가상 공간(예: 0~100 또는 960x540)을 쓴다. 실제 픽셀 크기를
 * 재지 않으므로 창 크기가 바뀌어도 물리가 흔들리지 않고, ResizeObserver도 필요 없다.
 */

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** current를 target 쪽으로 최대 step만큼 옮긴다. 부드러운 추적에 쓴다. */
export function approach(current: number, target: number, step: number): number {
  if (current < target) return Math.min(current + step, target);
  if (current > target) return Math.max(current - step, target);
  return current;
}

export function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}

export function circleHit(
  ax: number, ay: number, ar: number,
  bx: number, by: number, br: number,
): boolean {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy <= (ar + br) * (ar + br);
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function rectHit(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function pointInRect(x: number, y: number, r: Rect): boolean {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

/** 원과 사각형의 충돌. 공-벽돌, 공-발판 판정에 쓴다. */
export function circleRectHit(cx: number, cy: number, cr: number, r: Rect): boolean {
  const nearestX = clamp(cx, r.x, r.x + r.w);
  const nearestY = clamp(cy, r.y, r.y + r.h);
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy <= cr * cr;
}

/**
 * 씨앗 난수(mulberry32).
 *
 * Math.random을 그대로 쓰면 같은 스테이지가 매번 달라져 교사가 "아까 그 판"을 다시
 * 보여 줄 수 없고, 어려운 배치가 우연히 나와도 재현이 안 된다. 스테이지 번호와
 * 시도 횟수로 씨앗을 만들면 판이 매번 바뀌면서도 재현 가능하다.
 */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randRange(random: () => number, min: number, max: number): number {
  return min + random() * (max - min);
}

export function randInt(random: () => number, min: number, maxExclusive: number): number {
  return Math.floor(randRange(random, min, maxExclusive));
}

export function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.min(items.length - 1, Math.floor(random() * items.length))];
}

/** 원본을 건드리지 않고 섞은 새 배열을 준다. */
export function shuffle<T>(random: () => number, items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const swap = out[i];
    out[i] = out[j];
    out[j] = swap;
  }
  return out;
}

/** 각도(도) → 라디안. 조준·포탄 게임이 학생에게는 도로 보여 주고 계산은 라디안으로 한다. */
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
