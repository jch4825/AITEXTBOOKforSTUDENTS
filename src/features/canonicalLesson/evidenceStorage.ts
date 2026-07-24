import type { CanonicalLessonEvidenceV3 } from './types';
import { sanitizeEvidenceV3 } from './evidenceSanitizer';

const STORAGE_KEY_V3 = 'ai-students-lesson-evidence-v3';

export function loadAllEvidenceV3(): CanonicalLessonEvidenceV3[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V3);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeEvidenceV3).filter((e): e is CanonicalLessonEvidenceV3 => e !== null);
  } catch (err) {
    console.error('Failed to load canonical evidence v3:', err);
    return [];
  }
}

export function saveEvidenceV3(evidence: CanonicalLessonEvidenceV3): boolean {
  const sanitized = sanitizeEvidenceV3(evidence);
  if (!sanitized) return false;

  const current = loadAllEvidenceV3();
  const existingIdx = current.findIndex(e => e.id === sanitized.id || (e.lessonId === sanitized.lessonId && e.learnerAlias === sanitized.learnerAlias));

  if (existingIdx >= 0) {
    current[existingIdx] = sanitized;
  } else {
    current.push(sanitized);
  }

  try {
    localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(current));
    return true;
  } catch (err) {
    console.error('Failed to save canonical evidence v3:', err);
    return false;
  }
}

export function getEvidenceByLessonId(lessonId: string): CanonicalLessonEvidenceV3[] {
  return loadAllEvidenceV3().filter(e => e.lessonId === lessonId);
}

export function getEvidenceByModuleId(moduleId: string): CanonicalLessonEvidenceV3[] {
  return loadAllEvidenceV3().filter(e => e.moduleId === moduleId);
}

export function clearAllEvidenceV3(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(STORAGE_KEY_V3);
  }
}
