import type { LessonId } from '../../types';
import { M1_PORTFOLIO } from './m1';
import { M2_PORTFOLIO } from './m2';
import { M3_PORTFOLIO } from './m3';
import { M5_PORTFOLIO } from './m5';
import type { ModulePortfolioDefinition } from './types';

const PORTFOLIO_BY_LESSON = new Map<LessonId, ModulePortfolioDefinition>([
  [M1_PORTFOLIO.lessonId, M1_PORTFOLIO],
  [M2_PORTFOLIO.lessonId, M2_PORTFOLIO],
  [M3_PORTFOLIO.lessonId, M3_PORTFOLIO],
  [M5_PORTFOLIO.lessonId, M5_PORTFOLIO],
]);

export function getModulePortfolioDefinition(lessonId: LessonId): ModulePortfolioDefinition | undefined {
  return PORTFOLIO_BY_LESSON.get(lessonId);
}
