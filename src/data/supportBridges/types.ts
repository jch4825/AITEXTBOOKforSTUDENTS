import type { LessonId } from '../../types';

export interface SupportBridgeDefinition {
  lessonId: LessonId;
  recallLessonId: LessonId;
  recallPrompt: string;
  practicePurpose: string;
  nextStudioLessonId: LessonId;
  nextPreview: string;
}
