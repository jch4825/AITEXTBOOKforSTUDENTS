/**
 * Gemini API key stored locally by the teacher (spec §4.2 방식 B).
 * Never bundled — teacher enters it once per browser via TeacherView.
 * Students share the same physical machine as the teacher; the key never
 * leaves that browser's localStorage.
 */

const STORAGE_KEY = 'ai-students-gemini-key';
const CHANGE_EVENT = 'ai-students-api-key-changed';

function notifyKeyChanged(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * 키가 저장되거나 지워지면 알려 준다(같은 쪽은 직접, 다른 탭은 storage 이벤트).
 * 상단 바의 인공지능 연결 표시가 교사가 키를 넣고 빼는 순간 바로 바뀌게 한다.
 */
export function subscribeApiKey(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function getApiKey(): string | null {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v && v.trim().length > 0 ? v.trim() : null;
}

export function setApiKey(key: string): void {
  const trimmed = key.trim();
  if (trimmed.length === 0) {
    clearApiKey();
    return;
  }
  localStorage.setItem(STORAGE_KEY, trimmed);
  notifyKeyChanged();
}

export function clearApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
  notifyKeyChanged();
}

export function hasApiKey(): boolean {
  return getApiKey() !== null;
}

/** Mask a key for display: first 4 + last 4 chars. */
export function maskApiKey(key: string): string {
  if (key.length <= 8) return '••••';
  return `${key.slice(0, 4)}${'•'.repeat(Math.max(4, key.length - 8))}${key.slice(-4)}`;
}
