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
  /**
   * 장면 각본. 배열의 한 칸이 화면에 한 번에 뜨는 대사 묶음이다.
   *
   * 한 장면을 한 칸으로만 쓰면 그림 옆 대사창(높이가 그림에 묶여 있다)에 들어가는
   * 분량이 곧 이야기 전체 분량이 되어, 한 차시 이야기가 200~300자로 끝났다.
   * 배경도 인물의 이유도 들어갈 자리가 없어 무슨 말인지 알기 어려웠다.
   * 칸을 나눠 넘겨 읽으면 「한 화면에 한 가지 정보」를 지키면서도 이야기 분량을
   * 그림 추가 없이 늘릴 수 있다. 칸이 하나인 옛 각본도 그대로 동작한다.
   */
  copy: Record<SupportLevel, VisualNovelCopy[]>;
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
  /**
   * 마지막 장면 진입 때 완료 연출을 재생할지 여부. 기본값은 켜짐이고, 연출 종류는
   * 차시 아이디에 따라 다섯 가지 풀에서 결정된다(FinalSceneCelebration.tsx).
   * 특정 차시에서 빼야 할 사정이 있을 때만 false로 끈다.
   */
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
  aiDecisionText?: string;
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
  aiDecisionText?: string;
  finalExpression?: StudioExpression;
  artifactSummary?: string;
  transferExpression?: StudioExpression;
}

export type StudioAction =
  | { type: 'set-first-attempt'; value: StudioExpression }
  | { type: 'set-reason'; value: string }
  | { type: 'record-support-mode'; value: string }
  | { type: 'set-ai-decision'; value: AiDecision }
  | { type: 'set-ai-decision-text'; value: string }
  | { type: 'set-final-expression'; value: StudioExpression }
  | { type: 'set-artifact'; value: string }
  | { type: 'set-transfer'; value: StudioExpression }
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'reset'; supportLevel: SupportLevel };
