import type { StudioChoice, StudioExpression, StudioSessionState } from './types';

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

export function sanitizeExpressionForEvidence(
  expression: StudioExpression | undefined,
): StudioExpression | undefined {
  if (!isMeaningfulStudioExpression(expression)) return undefined;
  if (expression.mode === 'choice' || expression.mode === 'aac') {
    return {
      mode: expression.mode,
      choiceIds: expression.choiceIds
        ?.map((id) => id.trim())
        .filter(Boolean)
        .slice(0, 4),
    };
  }
  if (expression.mode === 'text' || expression.mode === 'speech') {
    return { mode: expression.mode, text: expression.text?.trim().slice(0, 300) };
  }
  if (expression.mode === 'draw') return { mode: 'draw' };
  return undefined;
}

export function formatPersistedStudioExpression(
  expression: StudioExpression | undefined,
  choices: StudioChoice[] | undefined,
): string | undefined {
  if (!expression) return undefined;
  if (expression.mode === 'choice' || expression.mode === 'aac') {
    const choiceIds = expression.choiceIds?.filter((id) => id.trim().length > 0) ?? [];
    if (choiceIds.length === 0) return undefined;
    const labels = choiceIds
      .map((id) => choices?.find((choice) => choice.id === id)?.label)
      .filter((label): label is string => Boolean(label));
    return labels.join(' / ') || '카드로 표현함';
  }
  if (expression.mode === 'draw') return '그림으로 표현함';
  if (expression.mode === 'text' || expression.mode === 'speech') {
    return expression.text?.trim() || undefined;
  }
  return undefined;
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
