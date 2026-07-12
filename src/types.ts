export type Difficulty = 'easy' | 'normal' | 'hard';
export type FontSize = 'normal' | 'large';

export type ModuleId = 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6';
export type LessonId = string; // 'm1-l1', 'm1-l2', ...

export type ViewName = 'home' | 'contents' | 'lesson' | 'teacher';

export interface DictionaryEntry {
  term: string;
  aliases?: string[];
  shortExplanation: string;
  example?: string;
  ttsVersion?: string;
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
  fontSize: FontSize;
  ttsEnabled: boolean;
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
  /** 교사용 학습목표 — "~할 수 있다" 형식. 학생 화면에는 노출하지 않는다. */
  objective: string;
  /** 2022 개정 특수교육 기본교육과정 성취기준 — "[코드] 원문" 형식. */
  standards?: string[];
  bodyEasy: string;
  bodyNormal: string;
  /** 차시 정리 한 줄 — 마지막 정리 화면에 표시하고 TTS로 읽어준다. */
  wrapUpEasy: string;
  wrapUpNormal: string;
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
 * goal is used across all difficulties in the goal card.
 */
export interface HardLessonContent {
  goal: { easy: string; normal: string; hard: string };
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
  | VowBlock;

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
  items: { emoji: string; label: string }[];
}

export interface DragSortBlock {
  kind: 'drag-sort';
  id: string;
  prompt: string;
  bins: { label: string; emoji: string }[];
  cards: { label: string; emoji: string; bin: number }[];
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
