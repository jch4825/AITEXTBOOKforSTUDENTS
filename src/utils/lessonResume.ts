import { MODULES, lessonIdsForModule } from '../data/modules';
import { getLesson } from '../data/lessons';
import type { LessonId } from '../types';

/**
 * 다음에 이어서 할 차시 — 구현된 차시 중 아직 완료하지 않은 첫 차시.
 * (모두 끝났으면 첫 차시부터 다시.)
 */
export function pickResumeLesson(completed: LessonId[]): LessonId {
  const done = new Set(completed);
  for (const mod of MODULES) {
    for (const lid of lessonIdsForModule(mod.id)) {
      if (done.has(lid)) continue;
      if (getLesson(lid)) return lid;
    }
  }
  return 'm1-l1';
}
