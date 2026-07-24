import type { LessonId, ModuleId } from '../../types';
import type { CanonicalLessonDesign } from './types';
import { M1_CANONICAL_LESSONS } from './m1';
import { M2_CANONICAL_LESSONS } from './m2';
import { M3_CANONICAL_LESSONS } from './m3';
import { M4_CANONICAL_LESSONS } from './m4';
import { M5_CANONICAL_LESSONS } from './m5';
import { M6_CANONICAL_LESSONS } from './m6';

export const MIGRATED_MODULE_IDS: readonly ModuleId[] = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];

export const ALL_CANONICAL_LESSONS: CanonicalLessonDesign[] = [
  ...M1_CANONICAL_LESSONS,
  ...M2_CANONICAL_LESSONS,
  ...M3_CANONICAL_LESSONS,
  ...M4_CANONICAL_LESSONS,
  ...M5_CANONICAL_LESSONS,
  ...M6_CANONICAL_LESSONS,
];

export function getCanonicalLesson(lessonId: LessonId): CanonicalLessonDesign | undefined {
  return ALL_CANONICAL_LESSONS.find(l => l.lessonId === lessonId);
}

export function getCanonicalLessonSummary(lessonId: LessonId): {
  id: LessonId;
  title: string;
  objective: string;
  usesLiveAi: boolean;
} | undefined {
  const lesson = getCanonicalLesson(lessonId);
  if (!lesson) return undefined;
  return {
    id: lesson.lessonId,
    title: lesson.title,
    objective: lesson.masterObjective,
    usesLiveAi: lesson.stages.some(s => s.activity.kind === 'ai-compare'),
  };
}
