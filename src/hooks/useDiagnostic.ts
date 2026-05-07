import { DiagnosticAnswers, DiagnosticPurpose, Persona } from '../types';

export const DIAGNOSTIC_STORAGE_KEYS = {
  onboarded: 'ai-bridge-onboarded',
  persona: 'ai-bridge-persona',
  purpose: 'ai-bridge-purpose',
  score: 'ai-bridge-diagnostic-score',
  answers: 'ai-bridge-diagnostic-answers',
  legacyFontScale: 'ai-bridge-font-size',
  fontScale: 'ai-bridge-font-scale',
} as const;

export interface DiagnosticResult {
  persona: Persona;
  purpose: DiagnosticPurpose;
  score: number;
}

export function calculateDiagnosticResult(answers: Required<DiagnosticAnswers>): DiagnosticResult {
  let score = answers.q2 + answers.q3 + answers.q4 + answers.q5 + answers.q6;

  if (answers.q3 === 0) {
    score = Math.min(score, 6);
  }

  if (answers.q5 === 2 && answers.q3 === 4) {
    score = Math.max(score, 7);
  }

  const persona: Persona =
    score <= 2 ? 'novice' :
    score <= 6 ? 'newbie' :
    score <= 9 ? 'lead' :
    'expert';

  return {
    persona,
    purpose: answers.q1,
    score,
  };
}

export function loadPersona(): Persona | null {
  try {
    const value = localStorage.getItem(DIAGNOSTIC_STORAGE_KEYS.persona);
    return value === 'novice' || value === 'newbie' || value === 'lead' || value === 'expert'
      ? value
      : null;
  } catch {
    return null;
  }
}

export function saveDiagnostic(answers: Required<DiagnosticAnswers>) {
  const result = calculateDiagnosticResult(answers);
  localStorage.setItem(DIAGNOSTIC_STORAGE_KEYS.onboarded, 'true');
  localStorage.setItem(DIAGNOSTIC_STORAGE_KEYS.persona, result.persona);
  localStorage.setItem(DIAGNOSTIC_STORAGE_KEYS.purpose, result.purpose);
  localStorage.setItem(DIAGNOSTIC_STORAGE_KEYS.score, String(result.score));
  localStorage.setItem(DIAGNOSTIC_STORAGE_KEYS.answers, JSON.stringify(answers));

  if (result.persona === 'novice') {
    localStorage.setItem(DIAGNOSTIC_STORAGE_KEYS.legacyFontScale, 'large');
    localStorage.setItem(DIAGNOSTIC_STORAGE_KEYS.fontScale, 'large');
    window.dispatchEvent(new Event('storage'));
  }

  window.dispatchEvent(new Event('ai-bridge-persona-changed'));
  return result;
}

export function skipDiagnostic() {
  localStorage.setItem(DIAGNOSTIC_STORAGE_KEYS.onboarded, 'true');
  localStorage.removeItem(DIAGNOSTIC_STORAGE_KEYS.persona);
  localStorage.removeItem(DIAGNOSTIC_STORAGE_KEYS.purpose);
  localStorage.removeItem(DIAGNOSTIC_STORAGE_KEYS.score);
  localStorage.removeItem(DIAGNOSTIC_STORAGE_KEYS.answers);
  window.dispatchEvent(new Event('ai-bridge-persona-changed'));
}

