import { DiagnosticAnswers, DiagnosticPurpose, Persona } from '../types';
import {
  loadPersonaValue,
  saveDiagnosticResult,
  skipDiagnosticStorage,
  STORAGE_KEYS,
} from '../services/storage';

export const DIAGNOSTIC_STORAGE_KEYS = STORAGE_KEYS.diagnostic;

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
  return loadPersonaValue();
}

export function saveDiagnostic(answers: Required<DiagnosticAnswers>) {
  const result = calculateDiagnosticResult(answers);
  saveDiagnosticResult(result, answers);
  return result;
}

export function skipDiagnostic() {
  skipDiagnosticStorage();
}
