import { useState, useEffect, useCallback } from 'react';
import type { CanonicalLessonDesign, SupportLevel } from '../../data/canonicalLessons/types';
import type { CanonicalLessonEvidenceV3, PersistedLessonResponse } from './types';
import { saveEvidenceV3, getEvidenceByLessonId } from './evidenceStorage';
import { sanitizeResponse } from './evidenceSanitizer';

export interface UseCanonicalLessonSessionOptions {
  lesson: CanonicalLessonDesign;
  supportLevel: SupportLevel;
  learnerAlias?: string;
}

export function useCanonicalLessonSession({
  lesson,
  supportLevel,
  learnerAlias = '학생',
}: UseCanonicalLessonSessionOptions) {
  const [stageIndex, setStageIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, PersistedLessonResponse>>({});
  const [artifactFields, setArtifactFields] = useState<Record<string, PersistedLessonResponse>>({});
  const [changedReason, setChangedReason] = useState<PersistedLessonResponse | undefined>(undefined);
  const [transferResponse, setTransferResponse] = useState<PersistedLessonResponse | undefined>(undefined);
  const [supportModesUsed, setSupportModesUsed] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState<string>(() => new Date().toISOString());

  // Reset state completely when lesson.lessonId changes
  useEffect(() => {
    setStageIndex(0);
    setResponses({});
    setArtifactFields({});
    setChangedReason(undefined);
    setTransferResponse(undefined);
    setSupportModesUsed([]);
    setStartedAt(new Date().toISOString());

    // Restore existing evidence if present
    const existing = getEvidenceByLessonId(lesson.lessonId);
    if (existing.length > 0) {
      const latest = existing[existing.length - 1];
      if (latest.responses) setResponses(latest.responses);
      if (latest.artifact?.fields) setArtifactFields(latest.artifact.fields);
      if (latest.changedReason) setChangedReason(latest.changedReason);
      if (latest.transfer) setTransferResponse(latest.transfer);
      if (latest.supportModesUsed) setSupportModesUsed(latest.supportModesUsed);
    }
  }, [lesson.lessonId]);

  const currentStage = lesson.stages[stageIndex] ?? lesson.stages[0];

  const recordResponse = useCallback((stageId: string, resp: PersistedLessonResponse) => {
    const sanitized = sanitizeResponse(resp);
    if (!sanitized) return;
    setResponses(prev => ({
      ...prev,
      [stageId]: sanitized,
    }));
  }, []);

  const recordArtifactField = useCallback((fieldId: string, resp: PersistedLessonResponse) => {
    const sanitized = sanitizeResponse(resp);
    if (!sanitized) return;
    setArtifactFields(prev => ({
      ...prev,
      [fieldId]: sanitized,
    }));
  }, []);

  const addSupportMode = useCallback((mode: string) => {
    setSupportModesUsed(prev => (prev.includes(mode) ? prev : [...prev, mode]));
  }, []);

  const goToNextStage = useCallback(() => {
    if (stageIndex < lesson.stages.length - 1) {
      setStageIndex(prev => prev + 1);
    }
  }, [stageIndex, lesson.stages.length]);

  const goToPrevStage = useCallback(() => {
    if (stageIndex > 0) {
      setStageIndex(prev => prev - 1);
    }
  }, [stageIndex]);

  const isCompleted = useCallback((): boolean => {
    const totalResponses = Object.keys(responses).length + Object.keys(artifactFields).length;
    if (lesson.role === 'project') {
      // Project requires mandatory artifact fields
      const requiredFields = lesson.artifact.fields.filter(f => f.required);
      for (const field of requiredFields) {
        if (!artifactFields[field.id]) return false;
      }
      return true;
    }
    // Guided / Flagship lessons cannot save empty responses as complete
    return totalResponses > 0;
  }, [responses, artifactFields, lesson]);

  const completeSession = useCallback((): boolean => {
    if (!isCompleted()) return false;

    const evidence: CanonicalLessonEvidenceV3 = {
      version: 3,
      id: `${lesson.lessonId}-${Date.now()}`,
      learnerAlias,
      lessonId: lesson.lessonId,
      moduleId: lesson.moduleId,
      role: lesson.role,
      supportLevel,
      supportModesUsed,
      responses,
      artifact: {
        artifactId: lesson.artifact.id,
        fields: artifactFields,
      },
      changedReason,
      transfer: transferResponse,
      startedAt,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return saveEvidenceV3(evidence);
  }, [isCompleted, lesson, learnerAlias, supportLevel, supportModesUsed, responses, artifactFields, changedReason, transferResponse, startedAt]);

  return {
    stageIndex,
    currentStage,
    totalStages: lesson.stages.length,
    responses,
    artifactFields,
    changedReason,
    transferResponse,
    supportModesUsed,
    recordResponse,
    recordArtifactField,
    setChangedReason,
    setTransferResponse,
    addSupportMode,
    goToNextStage,
    goToPrevStage,
    setStageIndex,
    isCompleted,
    completeSession,
  };
}
