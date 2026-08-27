import type { ProgressState, SettingsState, Difficulty, FontSize, GradeBand } from '../types';

export const STORAGE_KEYS = {
  progress: 'ai-students-progress',
  settings: 'ai-students-settings',
  teacherMode: 'ai-students-teacher-mode',
} as const;

const DEFAULT_PROGRESS: ProgressState = { completedLessons: [] };

const DEFAULT_SETTINGS: SettingsState = {
  difficulty: 'normal', // 새 사용자는 중학 학년군으로 시작한다.
  gradeBand: 'normal',
  fontSize: 'normal',
  ttsEnabled: true,
  soundEnabled: true,
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
    // 학년군은 difficulty와 어긋날 수 없다. 중학·고등을 쓰는 중이면 그것이 곧 학년군이고,
    // 충분한 지원에 머무는 중이면 저장된 학년군을 그대로 잇는다. gradeBand가 없던
    // 옛 설정은 difficulty에서 유도한다.
    const storedBand: GradeBand = parsed?.gradeBand === 'hard' ? 'hard' : 'normal';
    const gradeBand: GradeBand = difficulty === 'easy' ? storedBand : difficulty;
    const fontSize: FontSize =
      parsed?.fontSize === 'small' ? 'small'
      : parsed?.fontSize === 'large' ? 'large'
      : 'normal';
    const ttsEnabled = parsed?.ttsEnabled !== false;
    const soundEnabled = parsed?.soundEnabled !== false;
    return { difficulty, gradeBand, fontSize, ttsEnabled, soundEnabled };
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
