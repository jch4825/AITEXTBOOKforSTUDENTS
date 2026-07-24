import type { LessonId, ModuleId } from '../../types';
import type { CanonicalLessonRole, SupportLevel } from '../../data/canonicalLessons/types';

export interface PersistedLessonResponse {
  mode: 'choice' | 'text' | 'speech' | 'draw' | 'computed';
  value?: any;
  hasDrawing?: boolean;
  choiceIds?: string[];
  text?: string;
  capturedAt?: string;
}

export interface CanonicalLessonEvidenceV3 {
  version: 3;
  id: string;
  learnerAlias: string;
  lessonId: LessonId;
  moduleId: ModuleId;
  role: CanonicalLessonRole;
  supportLevel: SupportLevel;
  supportModesUsed: string[];
  responses: Record<string, PersistedLessonResponse>;
  artifact: {
    artifactId: string;
    fields: Record<string, PersistedLessonResponse>;
  };
  changedReason?: PersistedLessonResponse;
  transfer?: PersistedLessonResponse;
  startedAt: string;
  completedAt: string;
  updatedAt: string;
}
