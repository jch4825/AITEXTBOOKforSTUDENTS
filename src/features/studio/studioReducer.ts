import type { StudioAction, StudioExpression, StudioSessionState, StudioStage, SupportLevel } from './types';

export const STUDIO_STAGES: StudioStage[] = [
  'encounter', 'first-attempt', 'condition-change', 'ai-compare', 'decision', 'artifact', 'transfer', 'complete',
];

export function createInitialStudioSession(
  supportLevel: SupportLevel,
  startedAt = new Date().toISOString(),
): StudioSessionState {
  return {
    stage: 'encounter',
    startedAt,
    supportLevel,
    supportModesUsed: [],
  };
}

function isExpressionComplete(expression?: StudioExpression): boolean {
  if (!expression) return false;
  if (expression.mode === 'choice' || expression.mode === 'aac') {
    return Boolean(expression.choiceIds?.length);
  }
  if (expression.mode === 'text' || expression.mode === 'speech') {
    return Boolean(expression.text?.trim());
  }
  return Boolean(expression.drawing);
}

export function canAdvance(state: StudioSessionState): boolean {
  if (state.stage === 'first-attempt') return isExpressionComplete(state.firstAttempt);
  if (state.stage === 'decision') return Boolean(state.aiDecision) && isExpressionComplete(state.finalExpression);
  if (state.stage === 'artifact') return Boolean(state.artifactSummary?.trim());
  if (state.stage === 'transfer') return isExpressionComplete(state.transferExpression);
  return true;
}

export function studioReducer(state: StudioSessionState, action: StudioAction): StudioSessionState {
  if (action.type === 'set-first-attempt') return { ...state, firstAttempt: action.value };
  if (action.type === 'set-reason') return { ...state, reason: action.value.slice(0, 300) };
  if (action.type === 'record-support-mode') {
    return state.supportModesUsed.includes(action.value)
      ? state
      : { ...state, supportModesUsed: [...state.supportModesUsed, action.value] };
  }
  if (action.type === 'set-ai-decision') return { ...state, aiDecision: action.value };
  if (action.type === 'set-final-expression') return { ...state, finalExpression: action.value };
  if (action.type === 'set-artifact') return { ...state, artifactSummary: action.value.slice(0, 300) };
  if (action.type === 'set-transfer') return { ...state, transferExpression: action.value };
  if (action.type === 'reset') return createInitialStudioSession(action.supportLevel);

  const index = STUDIO_STAGES.indexOf(state.stage);
  if (action.type === 'previous') {
    return index <= 0 ? state : { ...state, stage: STUDIO_STAGES[index - 1] };
  }
  if (action.type === 'next') {
    if (!canAdvance(state) || index >= STUDIO_STAGES.length - 1) return state;
    return { ...state, stage: STUDIO_STAGES[index + 1] };
  }
  return state;
}
