/**
 * Gemini API key stored locally by the teacher (spec §4.2 방식 B).
 * Never bundled — teacher enters it once per browser via TeacherView.
 * Students share the same physical machine as the teacher; the key never
 * leaves that browser's localStorage.
 */

const STORAGE_KEY = 'ai-students-gemini-key';

export function getApiKey(): string | null {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v && v.trim().length > 0 ? v : null;
}

export function setApiKey(key: string): void {
  const trimmed = key.trim();
  if (trimmed.length === 0) {
    clearApiKey();
    return;
  }
  localStorage.setItem(STORAGE_KEY, trimmed);
}

export function clearApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey(): boolean {
  return getApiKey() !== null;
}

/** Mask a key for display: first 4 + last 4 chars. */
export function maskApiKey(key: string): string {
  if (key.length <= 8) return '••••';
  return `${key.slice(0, 4)}${'•'.repeat(Math.max(4, key.length - 8))}${key.slice(-4)}`;
}
