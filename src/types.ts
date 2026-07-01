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

export type LessonStepKind = 'text' | 'ox' | 'card-pick' | 'matching' | 'sim-ai' | 'real-ai';

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
  bodyEasy: string;
  bodyNormal: string;
  steps: LessonStep[];
}
