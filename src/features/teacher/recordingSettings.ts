import type { TeacherRecordingSettings } from '../studio/types';

export const TEACHER_SETTINGS_KEY = 'ai-students-teacher-settings-v2';
export const TEACHER_SETTINGS_CHANGED = 'teacher-recording-settings-changed';

export const DEFAULT_TEACHER_RECORDING_SETTINGS: TeacherRecordingSettings = {
  learnerAlias: '학생 1',
  progressPersistence: true,
  processRecording: false,
  portfolioMedia: false,
  aiText: false,
  aiVision: false,
  aiImageGeneration: false,
};

function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function normalizeSettings(value: Partial<TeacherRecordingSettings> | null | undefined): TeacherRecordingSettings {
  const alias = typeof value?.learnerAlias === 'string'
    ? value.learnerAlias.trim().slice(0, 24)
    : '';
  return {
    learnerAlias: alias || DEFAULT_TEACHER_RECORDING_SETTINGS.learnerAlias,
    progressPersistence: true,
    processRecording: value?.processRecording === true,
    portfolioMedia: false,
    aiText: false,
    aiVision: false,
    aiImageGeneration: false,
    acknowledgedAt: typeof value?.acknowledgedAt === 'string' ? value.acknowledgedAt : undefined,
  };
}

function notify(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(TEACHER_SETTINGS_CHANGED));
}

export function loadTeacherRecordingSettings(): TeacherRecordingSettings {
  const storage = getStorage();
  if (!storage) return DEFAULT_TEACHER_RECORDING_SETTINGS;
  try {
    const raw = storage.getItem(TEACHER_SETTINGS_KEY);
    if (!raw) return DEFAULT_TEACHER_RECORDING_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<TeacherRecordingSettings>;
    return normalizeSettings(parsed);
  } catch {
    return DEFAULT_TEACHER_RECORDING_SETTINGS;
  }
}

export function saveTeacherRecordingSettings(settings: TeacherRecordingSettings): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(TEACHER_SETTINGS_KEY, JSON.stringify(normalizeSettings(settings)));
  notify();
}

export function clearTeacherRecordingSettings(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(TEACHER_SETTINGS_KEY);
  notify();
}
