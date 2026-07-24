import type { StudioChoice } from '../../features/studio/types';
import type { LessonId, ModuleId } from '../../types';

export interface ModulePortfolioDefinition {
  lessonId: LessonId;
  moduleId: ModuleId;
  crumb: string;
  kicker: string;
  title: string;
  description: string;
  storyHeading?: string;
  artifactHeading?: string;
  artifactDescription?: string;
  guideHeading?: string;
  printLabel?: string;
  completionRequirement?: string;
  studioLessonIds: readonly LessonId[];
  nextChoices: StudioChoice[];
  artifactChoices?: {
    lessonId: LessonId;
    label: string;
    artifact: string;
  }[];
  guideSections?: {
    id: string;
    title: string;
    prompt: string;
    placeholder: string;
  }[];
  closingStory?: {
    id: string;
    label: string;
    imageSrc: string;
    alt: string;
    copy: string;
  }[];
  transferPrompt?: string;
}
