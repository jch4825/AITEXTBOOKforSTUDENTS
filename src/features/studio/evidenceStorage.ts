import { sanitizeExpressionForEvidence } from './studioCompletion';
import type { StudioEvidenceV2, StudioObservation } from './types';

export { sanitizeExpressionForEvidence } from './studioCompletion';

export const STUDIO_EVIDENCE_KEY = 'ai-students-studio-evidence-v2';
export const STUDIO_EVIDENCE_CHANGED = 'studio-evidence-changed';

function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function notify(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(STUDIO_EVIDENCE_CHANGED));
}

function isEvidence(value: unknown): value is StudioEvidenceV2 {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<StudioEvidenceV2>;
  return record.version === 2
    && typeof record.id === 'string'
    && typeof record.learnerAlias === 'string'
    && typeof record.studioId === 'string'
    && typeof record.lessonId === 'string';
}

export function loadStudioEvidence(): StudioEvidenceV2[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(STUDIO_EVIDENCE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isEvidence) : [];
  } catch {
    return [];
  }
}

export function saveStudioEvidence(record: StudioEvidenceV2, processRecording: boolean): boolean {
  if (!processRecording) return false;
  const storage = getStorage();
  if (!storage) return false;
  const sanitized: StudioEvidenceV2 = {
    ...record,
    learnerAlias: record.learnerAlias.trim().slice(0, 24) || '학생 1',
    firstAttempt: sanitizeExpressionForEvidence(record.firstAttempt),
    finalExpression: sanitizeExpressionForEvidence(record.finalExpression),
    artifactSummary: record.artifactSummary?.trim().slice(0, 300),
    transferExpression: sanitizeExpressionForEvidence(record.transferExpression),
    supportModesUsed: record.supportModesUsed.slice(0, 20),
    observation: { ...record.observation, note: record.observation.note.trim().slice(0, 300) },
  };
  try {
    const current = loadStudioEvidence();
    const next = current.some((item) => item.id === sanitized.id)
      ? current.map((item) => item.id === sanitized.id ? sanitized : item)
      : [...current, sanitized];
    storage.setItem(STUDIO_EVIDENCE_KEY, JSON.stringify(next));
    notify();
    return true;
  } catch {
    return false;
  }
}

export function updateStudioObservation(id: string, observation: StudioObservation): boolean {
  const storage = getStorage();
  if (!storage) return false;
  const current = loadStudioEvidence();
  if (!current.some((item) => item.id === id)) return false;
  const updatedAt = new Date().toISOString();
  const next = current.map((item) => item.id === id
    ? { ...item, observation: { ...observation, note: observation.note.trim().slice(0, 300) }, updatedAt }
    : item);
  try {
    storage.setItem(STUDIO_EVIDENCE_KEY, JSON.stringify(next));
    notify();
    return true;
  } catch {
    return false;
  }
}

export function deleteStudioEvidence(id: string): void {
  const storage = getStorage();
  if (!storage) return;
  const next = loadStudioEvidence().filter((item) => item.id !== id);
  storage.setItem(STUDIO_EVIDENCE_KEY, JSON.stringify(next));
  notify();
}

export function clearStudioEvidence(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(STUDIO_EVIDENCE_KEY);
  notify();
}
