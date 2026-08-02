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
  isCorrect?: boolean;
  /** 이 선택을 고른 직후 인물이 결과를 연기하는 반응 대사 1줄. (2차 리모델링 P4) */
  reaction?: string;
}

/** 차시 구조 포맷. docs/remodel2/01-FORMATS.md 의 A~E. 렌더링 분기는 Wave 2 엔진이 담당한다. */
export type StudioFormat = 'A' | 'B' | 'C' | 'D' | 'E';

export type PreparedStimulus =
  | {
      id: string;
      kind: 'image';
      src: string;
      alt: string;
      caption: string;
    }
  | {
      id: string;
      kind: 'speech';
      text: string;
      label: string;
    };

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

export interface VisualNovelCopy {
  text: string;
  perspective?: string;
}

export interface VisualNovelScene {
  id: string;
  label: string;
  imageSrc: string;
  alt: string;
  knowledgeStep: 0 | 1 | 2;
  copy: Record<SupportLevel, VisualNovelCopy>;
}

export interface VisualNovelKnowledge {
  title: string;
  core: string;
  detail: Record<SupportLevel, string>;
  flow?: {
    input: string;
    process: string;
    output: string;
  };
}

export interface VisualNovelStory {
  title: string;
  objective: string;
  scenes: VisualNovelScene[];
  knowledge: [VisualNovelKnowledge, VisualNovelKnowledge, VisualNovelKnowledge];
  /** 마지막 장면 진입 때 화면 전체에 완료 반짝이를 한 번 보여 줄지 여부. */
  celebrateFinalScene?: boolean;
  /** 시즌 오프닝 자막 1줄. 예: '[체험회 D-7 · 1화] 오늘의 사건 — 물품이 안 왔다' */
  seasonTag?: string;
  /** 기록 단계 뒤에 보여줄 다음 화 예고 1줄. 궁금하게, 불안하지 않게. */
  nextEpisodeHook?: string;
}

export interface TeacherGuidance {
  title?: string;
  text: string;
  supportLevelOnly?: SupportLevel;
}

export interface StudioDefinition {
  id: string;
  lessonId: LessonId;
  moduleId: ModuleId;
  title: string;
  subtitle: string;
  /** 2차 리모델링 구조 포맷 배정. 미지정이면 A(이야기 우선형)로 동작한다. */
  format?: StudioFormat;
  visualNovel?: VisualNovelStory;
  encounter: {
    title: string;
    description: string;
    facts: string[];
    stimuli?: PreparedStimulus[];
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
    stimuli?: PreparedStimulus[];
  };
  aiContribution: {
    source: AiSource;
    role: string;
    text: string;
    question?: string;
  };
  suggestedQuestions?: string[];
  decisionTitle?: string;
  artifact: {
    kind:
      | 'action-card'
      | 'repair-card'
      | 'visual-plan'
      | 'choice-board'
      | 'comparison-table'
      | 'review-sheet'
      | 'boundary-map'
      | 'workflow-plan';
    title: string;
    prompt: string;
  };
  teacherGuidance?: TeacherGuidance;
  transfer: {
    title: string;
    description: string;
    prompt?: string;
    choices: StudioChoice[];
    stimuli?: PreparedStimulus[];
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
