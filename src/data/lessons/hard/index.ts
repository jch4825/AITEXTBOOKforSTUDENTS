import type { HardLessonContent, LessonId } from '../../../types';
import { HARD_M1 } from './m1';
import { HARD_M2 } from './m2';
import { HARD_M3 } from './m3';
import { HARD_M4 } from './m4';
import { HARD_M5 } from './m5';
import { HARD_M6 } from './m6';

const ALL: Partial<Record<LessonId, HardLessonContent>> = {
  ...HARD_M1, ...HARD_M2, ...HARD_M3, ...HARD_M4, ...HARD_M5, ...HARD_M6,
};

/** 어려움 콘텐츠 조회 — 없으면 undefined (호출부는 보통으로 폴백, spec §4). */
export function getHardContent(id: LessonId): HardLessonContent | undefined {
  return ALL[id];
}
