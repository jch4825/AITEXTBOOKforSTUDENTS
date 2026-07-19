import type { ProgressState, SettingsState, Difficulty, FontSize } from '../types';

export const STORAGE_KEYS = {
  progress: 'ai-students-progress',
  settings: 'ai-students-settings',
  teacherMode: 'ai-students-teacher-mode',
} as const;

const DEFAULT_PROGRESS: ProgressState = { completedLessons: [] };

const DEFAULT_SETTINGS: SettingsState = {
  difficulty: 'normal', // 새 사용자는 보통 지원 수준으로 시작한다.
  fontSize: 'normal',
  ttsEnabled: true,
};

function safeGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

function safeSet(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch { /* quota or denied */ }
}

export function loadProgress(): ProgressState {
  const raw = safeGet(STORAGE_KEYS.progress);
  if (!raw) return DEFAULT_PROGRESS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.completedLessons)) {
      return { completedLessons: parsed.completedLessons.filter((x: unknown) => typeof x === 'string') };
    }
  } catch { /* corrupt */ }
  return DEFAULT_PROGRESS;
}

export function saveProgress(state: ProgressState): void {
  safeSet(STORAGE_KEYS.progress, JSON.stringify(state));
}

export function loadSettings(): SettingsState {
  const raw = safeGet(STORAGE_KEYS.settings);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw);
    const difficulty: Difficulty =
      parsed?.difficulty === 'easy' ? 'easy'
      : parsed?.difficulty === 'hard' ? 'hard'
      : 'normal';
    const fontSize: FontSize = parsed?.fontSize === 'large' ? 'large' : 'normal';
    const ttsEnabled = parsed?.ttsEnabled !== false;
    return { difficulty, fontSize, ttsEnabled };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(state: SettingsState): void {
  safeSet(STORAGE_KEYS.settings, JSON.stringify(state));
}

export function loadTeacherMode(): boolean {
  return safeGet(STORAGE_KEYS.teacherMode) === '1';
}

export function setTeacherMode(enabled: boolean): void {
  safeSet(STORAGE_KEYS.teacherMode, enabled ? '1' : '0');
}
