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

export interface TeacherRecordingSettings {
  learnerAlias: string;
  progressPersistence: boolean;
  processRecording: boolean;
  portfolioMedia: boolean;
  aiText: boolean;
  aiVision: boolean;
  aiImageGeneration: boolean;
  acknowledgedAt?: string;
}

export type ObservationLevel = 'not-observed' | 'with-support' | 'independent';

export interface StudioObservation {
  importantInformation: ObservationLevel;
  firstAttempt: ObservationLevel;
  aiComparison: ObservationLevel;
  conditionAdjustment: ObservationLevel;
  note: string;
}

export interface StudioEvidenceV2 {
  version: 2;
  id: string;
  learnerAlias: string;
  studioId: string;
  lessonId: LessonId;
  firstAttempt?: StudioExpression;
  supportLevel: SupportLevel;
  supportModesUsed: string[];
  aiSource: AiSource;
  aiRole: string;
  aiDecision?: AiDecision;
  finalExpression?: StudioExpression;
  artifactSummary?: string;
  transferExpression?: StudioExpression;
  observation: StudioObservation;
  startedAt: string;
  completedAt: string;
  updatedAt: string;
}

export interface StudioSessionState {
  stage: StudioStage;
  startedAt: string;
  supportLevel: SupportLevel;
  supportModesUsed: string[];
  firstAttempt?: StudioExpression;
  reason?: string;
  aiDecision?: AiDecision;
  finalExpression?: StudioExpression;
  artifactSummary?: string;
  transferExpression?: StudioExpression;
}

export type StudioAction =
  | { type: 'set-support'; value: SupportLevel }
  | { type: 'set-first-attempt'; value: StudioExpression }
  | { type: 'set-reason'; value: string }
  | { type: 'record-support-mode'; value: string }
  | { type: 'set-ai-decision'; value: AiDecision }
  | { type: 'set-final-expression'; value: StudioExpression }
  | { type: 'set-artifact'; value: string }
  | { type: 'set-transfer'; value: StudioExpression }
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'reset'; supportLevel: SupportLevel };
