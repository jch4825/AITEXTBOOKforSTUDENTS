import type { StudioExpression, StudioSessionState } from './types';

export function isMeaningfulStudioExpression(expression: StudioExpression | undefined): boolean {
  if (!expression) return false;
  if (expression.mode === 'choice' || expression.mode === 'aac') {
    return expression.choiceIds?.some((id) => id.trim().length > 0) ?? false;
  }
  if (expression.mode === 'text' || expression.mode === 'speech') {
    return Boolean(expression.text?.trim());
  }
  if (expression.mode === 'draw') {
    return Boolean(expression.drawing?.trim());
  }
  return false;
}

export function hasStudentProcessEvidence(state: StudioSessionState): boolean {
  return Boolean(
    isMeaningfulStudioExpression(state.firstAttempt)
    || state.aiDecision
    || isMeaningfulStudioExpression(state.finalExpression)
    || state.artifactSummary?.trim()
    || isMeaningfulStudioExpression(state.transferExpression),
  );
}
