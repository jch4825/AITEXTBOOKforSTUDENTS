import type { LessonId } from '../../types';
import type { StudioDefinition } from '../../features/studio/types';
import { M1_STUDIOS } from './m1';
import { M5_STUDIOS } from './m5';

const READY_STUDIOS = new Map<LessonId, StudioDefinition>(
  [...M1_STUDIOS, ...M5_STUDIOS].map((studio) => [studio.lessonId, studio]),
);

export function getStudioDefinition(lessonId: LessonId): StudioDefinition | undefined {
  return READY_STUDIOS.get(lessonId);
}
