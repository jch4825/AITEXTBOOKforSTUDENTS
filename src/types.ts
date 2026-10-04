export type Difficulty = 'easy' | 'normal' | 'hard';

/**
 * 학년군 운영 축. `충분한 지원`(easy)은 두 학년군 모두에서 쓰는 하위 단계이므로
 * 학년군이 될 수 없다. 학생이 충분한 지원에 머무는 동안에도 어느 학년군으로
 * 돌아갈지 알아야 해서 difficulty와 따로 기억한다.
 */
export type GradeBand = Extract<Difficulty, 'normal' | 'hard'>;
export type FontSize = 'small' | 'normal' | 'large';

export type ModuleId = 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6';
export type LessonId = string; // 'm1-l1', 'm1-l2', ...

export type ViewName = 'home' | 'contents' | 'lesson' | 'teacher';

export interface DictionaryEntry {
  term: string;
  aliases?: string[];
  shortExplanation: string;
  example?: string;
  ttsVersion?: string;
  /**
   * 하다·되다·시키다·받다를 붙여 서술어로도 쓰는 낱말(확인 → 확인합니다, 안전 → 안전한).
   * 본문에서 이런 서술어는 어절 전체에 밑줄을 친다. `-하다`로 끝나는 올림말은 따로 적지 않아도 된다.
   * 서술어로 쓰면 뜻이 달라지는 낱말(지도 → 지도하다)에는 켜지 않는다.
   */
  verbal?: boolean;
  /**
   * 이 낱말이 사전의 뜻과 다른 뜻으로 쓰인 구절. 이 구절 안에서는 밑줄을 치지 않는다
   * (예: 컴퓨터 프로그램이 아니라 행사의 "문화 프로그램"). 구절에는 그 낱말이 들어 있어야 한다.
   * 뜻풀이를 넓혀서 둘 다 맞게 할 수 있으면 그렇게 하고, 그러기 어려운 드문 자리에만 쓴다.
   */
  notIn?: string[];
}

export interface ScenarioResponse {
  userInput: string;
  aiResponse: string;
  teachingPoint?: string;
}

export interface ProgressState {
  completedLessons: LessonId[];
}

export interface SettingsState {
  difficulty: Difficulty;
  /** 표지에서 고른 학년군. difficulty가 easy일 때도 유지된다. */
  gradeBand: GradeBand;
  fontSize: FontSize;
  /**
   * 사전을 열 때 뜻을 읽어 주는 일, 놀이의 소리 안내 같은 `useSpeak().speak`의 자동 소리 토글.
   * 듣기 단추(`speakNow`)는 이 값과 상관없이 읽는다.
   */
  ttsEnabled: boolean;
  /**
   * 카드를 고를 때 그 글을 소리 내어 읽어 주는가(`data/readingSupport.ts`의 읽기 지원 단원).
   * 기본은 꺼짐이다. 여러 대를 함께 쓰는 교실에서 저절로 나는 말소리는 소음이 되므로 교사가 켠다.
   * ttsEnabled와 합치지 않은 까닭: 사전·놀이의 자동 소리는 학생이 직접 단어나 판을 건드린 뒤에 나는
   * 응답이라 기본이 켜짐이고, 선택지를 고르는 동안의 말소리는 기본이 꺼짐이어야 한다.
   */
  autoRead: boolean;
  /**
   * 선택지에 답하는 기본 화면. 'aac'이면 읽기 지원 단원에서 선택지를 그림 카드로 먼저 연다
   * (data/choiceCards/). 글을 못 읽는 학생은 '문장 고르기' 탭을 글자로 찾을 수 없어서, 그 기기를
   * 쓰는 교사가 미리 그림 카드로 열어 둔다. 학생은 탭으로 언제든 바꿀 수 있다. 기본은 문장 고르기다.
   */
  answerMode: 'choice' | 'aac';
  /** 스튜디오 효과음. 읽어 주기(ttsEnabled)와 별개 토글이다(05-ENGINE-SPEC §7). */
  soundEnabled: boolean;
}

export type LessonKind = 'concept' | 'activity' | 'experience';

export type LessonStepKind = 'text' | 'ox' | 'card-pick' | 'matching' | 'sequence' | 'sim-ai' | 'real-ai' | 'mission';

export interface LessonStep {
  kind: LessonStepKind;
  data: any;
}

/**
 * Canonical lesson schema (introduced M2). Each lesson belongs to a module,
 * carries both difficulty variants of the intro text, and a step sequence
 * mixing text + interactive widgets.
 */
export interface LessonContent {
  id: LessonId;
  moduleId: ModuleId;
  number: number;         // 1-indexed order within the module
  title: string;
  kind: LessonKind;
  /** 차시 공통 학습목표 — 지원 수준과 관계없이 학생·교사 화면에 동일하게 제시한다. */
  objective: string;
  /** 2022 개정 특수교육 기본교육과정 성취기준 — "[코드] 원문" 형식. */
  standards?: string[];
  bodyEasy: string;
  bodyNormal: string;
  /** 차시 정리 한 줄 — 마지막 정리 화면에 표시하고 TTS로 읽어준다. */
  wrapUpEasy: string;
  wrapUpNormal: string;
  wrapUpHard?: string;
  steps: LessonStep[];
}

/** '어려움' 레벨 — 오늘의 용어 항목. definition은 정확한 정의, example은 짧은 사용 예. */
export interface HardTerm {
  term: string;
  definition: string;
  example?: string;
}

/**
 * '어려움' 레벨 차시 콘텐츠 (spec: 2026-07-10-hard-difficulty-design.md §4).
 * 기존 LessonContent와 분리 — src/data/lessons/hard/ 모듈에 lessonId로 매핑.
 * 학습목표는 LessonContent.objective 하나만 사용하며, 이 구조에는 수준별 목표를 두지 않는다.
 */
export interface HardLessonContent {
  concept: string[];        // 개념 문단 (2~4개)
  terms: HardTerm[];        // 오늘의 용어 (2~4개)
  method?: string[];        // 어떻게 할까요 — 수행 절차 (해당 차시만)
  limits: string;           // 꼭 기억해요 — 한계·주의
  wrapUpHard: string;       // 어려움용 정리 한 줄 (정리 화면 자동 TTS)
}

// ============================================================
// 미션(학습지) 엔진 관련 데이터 모델 (spec: 2026-07-12)
// ============================================================

export interface MissionContent {
  title: string;              // 학습지 제목 (예: "AI 찾기 탐험대")
  intro?: string;             // 시작 안내 한 줄 (자동 TTS)
  askName?: boolean;          // 이름 입력 바 표시 (기본 true)
  chapters: MissionChapter[]; // 2~3개
  reward: MissionReward;
}

export interface MissionChapter {
  title: string;              // 탭 이름 (예: "1장 찾아보기")
  goal?: string;              // 이 장에서 하는 일 한 줄
  blocks: MissionBlock[];     // 1~2개
}

export interface MissionReward {
  printable: 'worksheet' | 'certificate'; // 학습지 / 수료증·배지판
  badgeLabel: string;         // 화면 보상 문구 (예: "AI 탐험가 배지 획득!")
}

export type MissionBlock =
  | MultiPickBlock
  | SinglePickBlock
  | DragSortBlock
  | DragBuildBlock
  | BranchChatBlock
  | SceneHuntBlock
  | DrawBlock
  | SummaryBlock
  | VowBlock
  | JudgmentPreviewBlock
  | JudgmentMainBlock;

export interface MultiPickBlock {
  kind: 'multi-pick';
  id: string;
  prompt: string;
  items: { emoji: string; label: string }[];
}

export interface SinglePickBlock {
  kind: 'single-pick';
  id: string;
  prompt: string;
  items: { emoji: string; label: string; image?: string }[];
}

export interface DragSortBlock {
  kind: 'drag-sort';
  id: string;
  prompt: string;
  bins: { label: string; emoji: string }[];
  cards: { label: string; emoji: string; bin: number; image?: string }[];
}

export interface DragBuildBlock {
  kind: 'drag-build';
  id: string;
  prompt: string;
  slots: { label: string }[];
  pieces: { label: string; slot: number; quality: 'good' | 'weak' }[];
  response: { good: string; weak: string };
}

export interface BranchChatBlock {
  kind: 'branch-chat';
  id: string;
  intro: string;
  turns: {
    aimi: string;
    choices: { label: string; reply: string; good?: boolean }[];
  }[];
}

export interface SceneHuntBlock {
  kind: 'scene-hunt';
  id: string;
  prompt: string;
  image: string;
  targets: { x: number; y: number; r: number; label: string }[];
}

export interface DrawBlock {
  kind: 'draw';
  id: string;
  prompt: string;
}

export interface SummaryBlock {
  kind: 'summary';
  id: string;
  title: string;
  rows: { label: string; from: string }[];
}

export interface VowBlock {
  kind: 'vow';
  id: string;
  template: string; // "나 {이름}는 AI의 답이 맞는지 {빈칸} 확인하겠습니다!"
}

export type GeneralizationExpressionMode = 'choice' | 'aac' | 'text' | 'speech' | 'draw';
export type GeneralizationAiDecision = 'accept' | 'modify' | 'keep';
export type GeneralizationHelpLevel = 'independent' | 'cue' | 'choice-support' | 'co-perform';
export type GeneralizationObservationStatus = 'unobserved' | 'prompted' | 'independent';

export interface GeneralizationExpression {
  mode: GeneralizationExpressionMode;
  choiceIds?: string[];
  text?: string;
  drawing?: string;
}

export interface GeneralizationObservation {
  importantInfo: GeneralizationObservationStatus;
  attemptedMethod: GeneralizationObservationStatus;
  comparedAi: GeneralizationObservationStatus;
  adjustedToCondition: GeneralizationObservationStatus;
  helpLevel: GeneralizationHelpLevel;
  note?: string;
}

export interface GeneralizationCycleRecord {
  version: 1;
  cycleId: string;
  moduleId: ModuleId;
  studentName: string;
  preview?: {
    firstThought: GeneralizationExpression;
    reason?: GeneralizationExpression;
    capturedAt: string;
    capturedAtMain?: boolean;
  };
  main?: {
    importantInfoIds: string[];
    exploredMethodIds: string[];
    aiDecision: GeneralizationAiDecision;
    finalThought: GeneralizationExpression;
    transferChoiceId: string;
    capturedAt: string;
  };
  observation?: GeneralizationObservation;
}

export interface JudgmentPreviewBlock {
  kind: 'judgment-preview';
  id: string;
  cycleId: string;
  moduleId: ModuleId;
  scenario: { title: string; description: string };
  choices: { id: string; emoji: string; label: string }[];
  reasonCards?: { id: string; emoji: string; label: string }[];
  expressionModes?: GeneralizationExpressionMode[];
  closing: string;
}

export interface JudgmentMainBlock {
  kind: 'judgment-main';
  id: string;
  cycleId: string;
  moduleId: ModuleId;
  changedScenario: { title: string; description: string; changedConditions: string[] };
  importantInfo: { id: string; emoji: string; label: string }[];
  methods: { id: string; emoji: string; label: string }[];
  aiContribution: { title: string; text: string; alternativeMethodId?: string; question?: string };
  finalChoices: { id: string; emoji: string; label: string }[];
  reasonCards?: { id: string; emoji: string; label: string }[];
  transfer: { title: string; description: string; choices: { id: string; emoji: string; label: string }[] };
  expressionModes?: GeneralizationExpressionMode[];
}
