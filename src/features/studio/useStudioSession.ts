import { useCallback, useEffect, useReducer, useRef } from 'react';
import { loadTeacherRecordingSettings } from '../teacher/recordingSettings';
import { saveStudioEvidence } from './evidenceStorage';
import { hasStudentProcessEvidence } from './studioCompletion';
import { createInitialStudioSession, studioReducer } from './studioReducer';
import type { StudioDefinition, StudioEvidenceV2, SupportLevel } from './types';

const EMPTY_OBSERVATION: StudioEvidenceV2['observation'] = {
  importantInformation: 'not-observed',
  firstAttempt: 'not-observed',
  aiComparison: 'not-observed',
  conditionAdjustment: 'not-observed',
  note: '',
};

function makeEvidenceId(studioId: string): string {
  const suffix = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${studioId}-${suffix}`;
}

export function useStudioSession(
  definition: StudioDefinition,
  initialSupportLevel: SupportLevel,
  onComplete: () => void,
) {
  const [state, dispatch] = useReducer(
    studioReducer,
    initialSupportLevel,
    createInitialStudioSession,
  );
  const completedRef = useRef(false);
  const evidenceIdRef = useRef(makeEvidenceId(definition.id));
  const currentState = state.supportLevel === initialSupportLevel
    ? state
    : { ...state, supportLevel: initialSupportLevel };

  useEffect(() => {
    completedRef.current = false;
    evidenceIdRef.current = makeEvidenceId(definition.id);
    dispatch({ type: 'reset', supportLevel: initialSupportLevel });
  }, [definition.id]);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    const completedAt = new Date().toISOString();

    if (hasStudentProcessEvidence(state)) {
      const settings = loadTeacherRecordingSettings();
      const evidence: StudioEvidenceV2 = {
        version: 2,
        id: evidenceIdRef.current,
        learnerAlias: settings.learnerAlias,
        studioId: definition.id,
        lessonId: definition.lessonId,
        firstAttempt: state.firstAttempt,
        supportLevel: initialSupportLevel,
        supportModesUsed: state.supportModesUsed,
        aiSource: definition.aiContribution.source,
        aiRole: definition.aiContribution.role,
        aiDecision: state.aiDecision,
        finalExpression: state.finalExpression,
        artifactSummary: state.artifactSummary,
        transferExpression: state.transferExpression,
        observation: EMPTY_OBSERVATION,
        startedAt: state.startedAt,
        completedAt,
        updatedAt: completedAt,
      };
      saveStudioEvidence(evidence, settings.processRecording);
    }

    onComplete();
  }, [definition, initialSupportLevel, onComplete, state]);

  const goNext = useCallback(() => dispatch({ type: 'next' }), []);
  const goPrevious = useCallback(() => dispatch({ type: 'previous' }), []);
  const reset = useCallback(() => {
    completedRef.current = false;
    evidenceIdRef.current = makeEvidenceId(definition.id);
    dispatch({ type: 'reset', supportLevel: initialSupportLevel });
  }, [definition.id, initialSupportLevel]);

  return {
    state: currentState,
    dispatch,
    goNext,
    goPrevious,
    reset,
    finish,
  };
}
