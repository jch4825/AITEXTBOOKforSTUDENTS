import type { StudioChoice } from '../../features/studio/types';
import type { LessonId, ModuleId } from '../../types';

export interface ModulePortfolioDefinition {
  lessonId: LessonId;
  moduleId: ModuleId;
  crumb: string;
  kicker: string;
  title: string;
  description: string;
  studioLessonIds: readonly LessonId[];
  nextChoices: StudioChoice[];
}
