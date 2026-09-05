import type { ModuleId } from '../types';

export interface ModuleMeta {
  id: ModuleId;
  number: number;
  title: string;
  lessonCount: number;
}

export const MODULES: ModuleMeta[] = [
  { id: 'm1', number: 1, title: '인공지능 알아보기', lessonCount: 11 },
  { id: 'm2', number: 2, title: '인공지능과 대화하기', lessonCount: 11 },
  { id: 'm3', number: 3, title: '인공지능과 함께 공부하기', lessonCount: 11 },
  { id: 'm4', number: 4, title: '인공지능을 안전하게 사용하기', lessonCount: 11 },
  { id: 'm5', number: 5, title: '인공지능으로 문제 해결하기', lessonCount: 12 },
  { id: 'm6', number: 6, title: '인공지능과 함께하는 생활', lessonCount: 12 },
];

export function getModule(id: ModuleId): ModuleMeta | undefined {
  return MODULES.find(m => m.id === id);
}

/**
 * Lesson IDs follow the pattern `<moduleId>-l<n>` (1-indexed).
 * Returns the list of lesson IDs for a module — used by the sidebar tree
 * to render placeholder dots for lessons not yet implemented.
 */
export function lessonIdsForModule(id: ModuleId): string[] {
  const m = getModule(id);
  if (!m) return [];
  return Array.from({ length: m.lessonCount }, (_, i) => `${id}-l${i + 1}`);
}

export function moduleIdFromLessonId(lessonId: string): ModuleId | null {
  const prefix = lessonId.split('-')[0];
  const m = MODULES.find(m => m.id === prefix);
  return m ? m.id : null;
}
