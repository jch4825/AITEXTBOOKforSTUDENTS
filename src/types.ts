export type Difficulty = 'easy' | 'normal';
export type FontSize = 'normal' | 'large';

export type ModuleId = 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6';
export type LessonId = string; // 'm1-l1', 'm1-l2', ...

export type ViewName = 'home' | 'lesson' | 'teacher';

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

export type LessonStepKind = 'text' | 'ox' | 'card-pick' | 'matching' | 'sequence' | 'sim-ai' | 'real-ai';

export interface LessonStep {
  kind: LessonStepKind;
  data: Record<string, unknown>;
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
