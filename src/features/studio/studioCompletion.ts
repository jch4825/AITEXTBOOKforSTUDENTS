import type { StudioSessionState } from './types';

export function hasStudentProcessEvidence(state: StudioSessionState): boolean {
  return Boolean(
    state.firstAttempt
    || state.aiDecision
    || state.finalExpression
    || state.artifactSummary?.trim()
    || state.transferExpression,
  );
}
