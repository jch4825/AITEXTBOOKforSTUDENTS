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

export interface StudioChoice {
  id: string;
  emoji: string;
  label: string;
}

export interface StudioExpression {
  mode: ExpressionMode;
  choiceIds?: string[];
  text?: string;
  drawing?: string;
}

export interface SupportProfile {
  visibleFactCount: number;
  choiceLimit?: number;
  hint: string;
  aiRoleDepth: 'direct' | 'prompting' | 'counterpoint';
}

export interface StudioDefinition {
  id: string;
  lessonId: LessonId;
  moduleId: ModuleId;
  title: string;
  subtitle: string;
  encounter: {
    title: string;
    description: string;
    facts: string[];
  };
  firstAttempt: {
    prompt: string;
    choices: StudioChoice[];
    modes: ExpressionMode[];
    reasonPrompt: string;
  };
  supportProfiles: Record<SupportLevel, SupportProfile>;
  conditionChange: {
    description: string;
    facts: string[];
  };
  aiContribution: {
    source: AiSource;
    role: string;
    text: string;
    question?: string;
  };
  artifact: {
    kind: 'action-card' | 'repair-card' | 'visual-plan';
    title: string;
    prompt: string;
  };
  transfer: {
    title: string;
    description: string;
    choices: StudioChoice[];
  };
  safetyNote?: string;
}
