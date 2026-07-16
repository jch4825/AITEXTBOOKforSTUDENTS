import type { LessonId } from '../../types';
import { M5_PORTFOLIO } from './m5';
import type { ModulePortfolioDefinition } from './types';

const PORTFOLIO_BY_LESSON = new Map<LessonId, ModulePortfolioDefinition>([
  [M5_PORTFOLIO.lessonId, M5_PORTFOLIO],
]);

export function getModulePortfolioDefinition(lessonId: LessonId): ModulePortfolioDefinition | undefined {
  return PORTFOLIO_BY_LESSON.get(lessonId);
}
