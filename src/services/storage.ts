import { DiagnosticAnswers, DiagnosticPurpose, Persona } from '../types';
import type { FontScale } from '../utils/a11y';

type Pos = { x: number; y: number };

export const STORAGE_KEYS = {
  diagnostic: {
    onboarded: 'ai-bridge-onboarded',
    persona: 'ai-bridge-persona',
    purpose: 'ai-bridge-purpose',
    score: 'ai-bridge-diagnostic-score',
    answers: 'ai-bridge-diagnostic-answers',
    legacyFontScale: 'ai-bridge-font-size',
    fontScale: 'ai-bridge-font-scale',
  },
  geminiApiKey: 'gemini-api-key',
  lessonProgress: 'ai-teachers-progress',
  sidebarCollapsed: 'ai-bridge-sidebar-collapsed',
  accessibilityWidgetPos: 'ai-bridge-widget-pos',
  accessibilityWidgetCollapsed: 'ai-bridge-widget-collapsed',
  accessibilityWidgetHintSeen: 'ai-bridge-widget-hint-seen',
  resourceFavorites: 'ai-teachers-resource-favorites',
  metaPromptL26: 'meta-prompt-l2-6',
  l11TourSeen: 'l1-1-tour-seen',
  m0WelcomeShown: 'ai-bridge-m0-welcome-shown',
} as const;

function getItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {}
}

function getJson<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  const raw = getItem(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function setJson(key: string, value: unknown): boolean {
  return setItem(key, JSON.stringify(value));
}

export function dispatchApiKeyChanged() {
  window.dispatchEvent(new Event('api-key-changed'));
}

export function dispatchDiagnosticChanged() {
  window.dispatchEvent(new Event('ai-bridge-persona-changed'));
}

export function dispatchFontScaleChanged(scale: FontScale | null) {
  window.dispatchEvent(new StorageEvent('storage', {
    key: STORAGE_KEYS.diagnostic.fontScale,
    newValue: scale,
  }));
}

export function getGeminiApiKey(): string {
  return getItem(STORAGE_KEYS.geminiApiKey) ?? '';
}

export function hasGeminiApiKey(): boolean {
  return getGeminiApiKey().length > 10;
}

export function saveGeminiApiKey(value: string): boolean {
  const ok = setItem(STORAGE_KEYS.geminiApiKey, value);
  if (ok) dispatchApiKeyChanged();
  return ok;
}

export function clearGeminiApiKey() {
  removeItem(STORAGE_KEYS.geminiApiKey);
  dispatchApiKeyChanged();
}

export function getSidebarCollapsed(): boolean {
  return getItem(STORAGE_KEYS.sidebarCollapsed) === 'true';
}

export function saveSidebarCollapsed(value: boolean) {
  setItem(STORAGE_KEYS.sidebarCollapsed, String(value));
}

export function getLessonProgress(): string[] {
  return getJson<string[]>(STORAGE_KEYS.lessonProgress, [], (value): value is string[] =>
    Array.isArray(value) && value.every(item => typeof item === 'string'),
  );
}

export function saveLessonProgress(value: string[]) {
  setJson(STORAGE_KEYS.lessonProgress, value);
}

export function clearLessonProgress() {
  removeItem(STORAGE_KEYS.lessonProgress);
}

export function getResourceFavorites(): string[] {
  return getJson<string[]>(STORAGE_KEYS.resourceFavorites, [], (value): value is string[] =>
    Array.isArray(value) && value.every(item => typeof item === 'string'),
  );
}

export function saveResourceFavorites(value: string[]) {
  setJson(STORAGE_KEYS.resourceFavorites, value);
}

export function loadWidgetPos(): Pos | null {
  return getJson<Pos | null>(
    STORAGE_KEYS.accessibilityWidgetPos,
    null,
    (value): value is Pos | null =>
      value === null ||
      (typeof value === 'object' &&
        value !== null &&
        typeof (value as Pos).x === 'number' &&
        typeof (value as Pos).y === 'number'),
  );
}

export function saveWidgetPos(value: Pos) {
  setJson(STORAGE_KEYS.accessibilityWidgetPos, value);
}

export function getWidgetCollapsed(): boolean {
  return getItem(STORAGE_KEYS.accessibilityWidgetCollapsed) === 'true';
}

export function saveWidgetCollapsed(value: boolean) {
  setItem(STORAGE_KEYS.accessibilityWidgetCollapsed, String(value));
}

export function hasSeenWidgetHint(): boolean {
  return getItem(STORAGE_KEYS.accessibilityWidgetHintSeen) === 'true';
}

export function markWidgetHintSeen() {
  setItem(STORAGE_KEYS.accessibilityWidgetHintSeen, 'true');
}

export function loadFontScaleValue(): FontScale {
  const saved = getItem(STORAGE_KEYS.diagnostic.fontScale) as FontScale | null;
  return saved === 'normal' || saved === 'large' || saved === 'xlarge' ? saved : 'normal';
}

export function saveFontScaleValue(scale: FontScale) {
  setItem(STORAGE_KEYS.diagnostic.fontScale, scale);
}

export function clearFontScaleValue() {
  removeItem(STORAGE_KEYS.diagnostic.legacyFontScale);
  removeItem(STORAGE_KEYS.diagnostic.fontScale);
  dispatchFontScaleChanged(null);
}

export function hasCompletedOnboarding(): boolean {
  return getItem(STORAGE_KEYS.diagnostic.onboarded) === 'true';
}

export function loadPersonaValue(): Persona | null {
  const value = getItem(STORAGE_KEYS.diagnostic.persona);
  return value === 'novice' || value === 'newbie' || value === 'lead' || value === 'expert'
    ? value
    : null;
}

export function loadPurposeValue(): DiagnosticPurpose | null {
  const value = getItem(STORAGE_KEYS.diagnostic.purpose);
  return value === 'class' || value === 'admin' || value === 'share' || value === 'ethics' || value === 'explore'
    ? value
    : null;
}

export function saveDiagnosticResult(
  result: { persona: Persona; purpose: DiagnosticPurpose; score: number },
  answers: Required<DiagnosticAnswers>,
) {
  setItem(STORAGE_KEYS.diagnostic.onboarded, 'true');
  setItem(STORAGE_KEYS.diagnostic.persona, result.persona);
  setItem(STORAGE_KEYS.diagnostic.purpose, result.purpose);
  setItem(STORAGE_KEYS.diagnostic.score, String(result.score));
  setJson(STORAGE_KEYS.diagnostic.answers, answers);

  if (result.persona === 'novice') {
    setItem(STORAGE_KEYS.diagnostic.legacyFontScale, 'large');
    setItem(STORAGE_KEYS.diagnostic.fontScale, 'large');
    dispatchFontScaleChanged('large');
  }

  dispatchDiagnosticChanged();
}

export function skipDiagnosticStorage() {
  setItem(STORAGE_KEYS.diagnostic.onboarded, 'true');
  removeItem(STORAGE_KEYS.diagnostic.persona);
  removeItem(STORAGE_KEYS.diagnostic.purpose);
  removeItem(STORAGE_KEYS.diagnostic.score);
  removeItem(STORAGE_KEYS.diagnostic.answers);
  clearFontScaleValue();
  dispatchDiagnosticChanged();
}

export function resetDiagnosticStorage() {
  removeItem(STORAGE_KEYS.diagnostic.onboarded);
  removeItem(STORAGE_KEYS.diagnostic.persona);
  removeItem(STORAGE_KEYS.diagnostic.purpose);
  removeItem(STORAGE_KEYS.diagnostic.score);
  removeItem(STORAGE_KEYS.diagnostic.answers);
  clearFontScaleValue();
  dispatchDiagnosticChanged();
}

export function getMetaPromptL26(): string {
  return getItem(STORAGE_KEYS.metaPromptL26) ?? '';
}

export function saveMetaPromptL26(value: string) {
  setItem(STORAGE_KEYS.metaPromptL26, value);
}

export function hasSeenL11Tour(): boolean {
  return getItem(STORAGE_KEYS.l11TourSeen) === '1';
}

export function markL11TourSeen() {
  setItem(STORAGE_KEYS.l11TourSeen, '1');
}

export function hasSeenM0Welcome(): boolean {
  return getItem(STORAGE_KEYS.m0WelcomeShown) === '1';
}

export function markM0WelcomeSeen() {
  setItem(STORAGE_KEYS.m0WelcomeShown, '1');
}
