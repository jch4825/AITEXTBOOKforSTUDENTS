import type { LessonId, ModuleId } from '../../types';

export type LessonRole = 'studio' | 'support' | 'module-close';
export type StudioStage = 'encounter' | 'first-attempt' | 'condition-change' | 'ai-compare' | 'decision' | 'artifact' | 'transfer' | 'complete';
export type SupportLevel = 'full' | 'light' | 'challenge';
export type ExpressionMode = 'choice' | 'aac' | 'text' | 'speech' | 'draw';
export type AiDecision = 'accept' | 'modify' | 'reject';
export type AiSource = 'prepared' | 'live';

export interface LessonRoleRecord {
  lessonId: LessonId;
  moduleId: ModuleId;
  role: LessonRole;
}
