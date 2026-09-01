import type { SupportLevel } from '../../types';

/**
 * 지원 수준별 난이도 조절값.
 *
 * 지원 수준 셋은 뼈대가 같고 요구 수준만 다르다(CLAUDE.md 제품 계약). 그래서
 * `충분한 지원`이라고 게임을 다른 게임으로 바꾸거나 단계를 덜어 내지 않는다.
 * 같은 판, 같은 조작에서 속도·크기·허용 오차만 바꾼다.
 *
 * 게임은 이 배율을 자기 단위에 곱해서 쓴다. 예를 들어 공 속도를
 * `기본속도 * tuning.speed`로, 발판 폭을 `기본폭 * tuning.size`로 쓴다.
 */
export interface GameTuning {
  /** 움직이는 것들의 속도 배율 */
  speed: number;
  /** 목표·발판·판정 영역 크기 배율 */
  size: number;
  /** 타이밍·조준 허용 오차 배율 */
  tolerance: number;
  /** 실수해도 이어 할 수 있는 횟수 */
  lives: number;
  /** 제한 시간 배율 */
  time: number;
  /** 동시에 나오는 물체 수 배율 */
  density: number;
}

const TUNING: Record<SupportLevel, GameTuning> = {
  // 충분한 지원 — 느리고 크고 넉넉하다. 실패해도 다섯 번까지 이어 한다.
  full: { speed: 0.68, size: 1.32, tolerance: 1.7, lives: 5, time: 1.5, density: 0.7 },
  // 중학 — 기준값
  light: { speed: 1, size: 1, tolerance: 1, lives: 3, time: 1, density: 1 },
  // 고등 — 빠르고 좁고 촘촘하다. 같은 조작으로 더 정확해야 한다.
  challenge: { speed: 1.32, size: 0.84, tolerance: 0.72, lives: 2, time: 0.8, density: 1.35 },
};

export function tuningFor(level: SupportLevel): GameTuning {
  return TUNING[level] ?? TUNING.light;
}
