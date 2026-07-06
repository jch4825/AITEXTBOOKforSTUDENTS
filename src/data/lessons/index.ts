import type { LessonContent, LessonId } from '../../types';
import { M1_LESSONS } from './m1';
import { M2_LESSONS } from './m2';
import { M3_LESSONS } from './m3';
import { M4_LESSONS } from './m4';
import { M5_LESSONS } from './m5';
import { M6_LESSONS } from './m6';

/**
 * Aggregate registry of every implemented lesson across modules.
 * A lesson only exists in the app if it appears here — otherwise
 * LessonView falls back to the "곧 열려요" placeholder.
 */
export const ALL_LESSONS: LessonContent[] = [
  ...M1_LESSONS,
  ...M2_LESSONS,
  ...M3_LESSONS,
  ...M4_LESSONS,
  ...M5_LESSONS,
  ...M6_LESSONS,
];

const LESSON_MAP = new Map(ALL_LESSONS.map(l => [l.id, l]));

export function getLesson(lessonId: LessonId): LessonContent | undefined {
  return LESSON_MAP.get(lessonId);
}
