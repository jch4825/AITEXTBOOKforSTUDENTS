import type { LessonId } from '../../types';
import { M1_PORTFOLIO } from './m1';
import { M2_PORTFOLIO } from './m2';
import { M3_PORTFOLIO } from './m3';
import { M4_PORTFOLIO } from './m4';
import { M5_PORTFOLIO } from './m5';
import { M6_PORTFOLIO } from './m6';
import type { ModulePortfolioDefinition } from './types';

const PORTFOLIO_BY_LESSON = new Map<LessonId, ModulePortfolioDefinition>([
  [M1_PORTFOLIO.lessonId, M1_PORTFOLIO],
  [M2_PORTFOLIO.lessonId, M2_PORTFOLIO],
  [M3_PORTFOLIO.lessonId, M3_PORTFOLIO],
  [M4_PORTFOLIO.lessonId, M4_PORTFOLIO],
  [M5_PORTFOLIO.lessonId, M5_PORTFOLIO],
  [M6_PORTFOLIO.lessonId, M6_PORTFOLIO],
]);

export function getModulePortfolioDefinition(lessonId: LessonId): ModulePortfolioDefinition | undefined {
  return PORTFOLIO_BY_LESSON.get(lessonId);
}
