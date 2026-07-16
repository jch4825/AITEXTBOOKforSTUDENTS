import type { LessonId, ModuleId } from '../types';
import type { LessonRole, LessonRoleRecord } from '../features/studio/types';
import { MODULES, lessonIdsForModule, moduleIdFromLessonId } from './modules';

export const STUDIO_LESSON_IDS = [
  'm1-l1', 'm1-l4', 'm1-l10',
  'm2-l1', 'm2-l6', 'm2-l10',
  'm3-l1', 'm3-l5', 'm3-l9',
  'm4-l1', 'm4-l5', 'm4-l10',
  'm5-l1', 'm5-l6', 'm5-l11',
  'm6-l1', 'm6-l4', 'm6-l11',
] as const;

export const MODULE_CLOSE_LESSON_IDS = [
  'm1-l11', 'm2-l11', 'm3-l11', 'm4-l11', 'm5-l12', 'm6-l12',
] as const;

const studioSet = new Set<string>(STUDIO_LESSON_IDS);
const closeSet = new Set<string>(MODULE_CLOSE_LESSON_IDS);

export const SUPPORT_LESSON_COUNT = 68 - STUDIO_LESSON_IDS.length - MODULE_CLOSE_LESSON_IDS.length;

export function getLessonRole(lessonId: LessonId): LessonRole {
  if (studioSet.has(lessonId)) return 'studio';
  if (closeSet.has(lessonId)) return 'module-close';
  return 'support';
}

export const LESSON_ROLE_RECORDS: LessonRoleRecord[] = MODULES.flatMap((module) =>
  lessonIdsForModule(module.id).map((lessonId) => ({
    lessonId,
    moduleId: moduleIdFromLessonId(lessonId) as ModuleId,
    role: getLessonRole(lessonId),
  })),
);
