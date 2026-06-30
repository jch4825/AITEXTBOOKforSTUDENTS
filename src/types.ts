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

/**
 * Demo lesson schema for M1. M2 will introduce the full LessonContent type.
 */
export interface DemoLessonStep {
  kind: 'text' | 'ox' | 'card-pick' | 'matching' | 'sim-ai';
  data: Record<string, unknown>;
}

export interface DemoLesson {
  id: LessonId;
  moduleId: ModuleId;
  title: string;
  bodyEasy: string;
  bodyNormal: string;
  steps: DemoLessonStep[];
}
