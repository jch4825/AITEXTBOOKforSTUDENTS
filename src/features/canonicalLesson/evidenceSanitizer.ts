import type { PersistedLessonResponse, CanonicalLessonEvidenceV3 } from './types';

export function sanitizeResponse(resp?: PersistedLessonResponse): PersistedLessonResponse | undefined {
  if (!resp) return undefined;

  const mode = resp.mode || 'text';
  let sanitizedText = typeof resp.text === 'string' ? resp.text.trim().slice(0, 300) : undefined;

  let choiceIds = Array.isArray(resp.choiceIds)
    ? resp.choiceIds.slice(0, 8).map(id => String(id).trim())
    : undefined;

  if (mode === 'draw') {
    return {
      mode: 'draw',
      hasDrawing: Boolean(resp.hasDrawing || resp.value),
      capturedAt: resp.capturedAt || new Date().toISOString(),
    };
  }

  let value = resp.value;
  if (typeof value === 'string') {
    if (value.startsWith('data:image/')) {
      // Stripping data URL for privacy / storage efficiency
      value = undefined;
    } else {
      value = value.trim().slice(0, 300);
    }
  }

  return {
    mode,
    value,
    hasDrawing: resp.hasDrawing,
    choiceIds,
    text: sanitizedText,
    capturedAt: resp.capturedAt || new Date().toISOString(),
  };
}

export function sanitizeEvidenceV3(raw: any): CanonicalLessonEvidenceV3 | null {
  if (!raw || typeof raw !== 'object' || raw.version !== 3) {
    return null;
  }
  if (!raw.id || !raw.lessonId || !raw.moduleId) {
    return null;
  }

  const responses: Record<string, PersistedLessonResponse> = {};
  if (raw.responses && typeof raw.responses === 'object') {
    for (const [key, val] of Object.entries(raw.responses)) {
      const sanitized = sanitizeResponse(val as PersistedLessonResponse);
      if (sanitized) {
        responses[key] = sanitized;
      }
    }
  }

  const artifactFields: Record<string, PersistedLessonResponse> = {};
  if (raw.artifact && raw.artifact.fields && typeof raw.artifact.fields === 'object') {
    for (const [key, val] of Object.entries(raw.artifact.fields)) {
      const sanitized = sanitizeResponse(val as PersistedLessonResponse);
      if (sanitized) {
        artifactFields[key] = sanitized;
      }
    }
  }

  const supportModesUsed = Array.isArray(raw.supportModesUsed)
    ? raw.supportModesUsed.slice(0, 20).map((s: any) => String(s).trim())
    : [];

  return {
    version: 3,
    id: String(raw.id),
    learnerAlias: String(raw.learnerAlias || '익명 학생').slice(0, 50),
    lessonId: raw.lessonId,
    moduleId: raw.moduleId,
    role: raw.role || 'guided',
    supportLevel: raw.supportLevel || 'normal',
    supportModesUsed,
    responses,
    artifact: {
      artifactId: String(raw.artifact?.artifactId || raw.lessonId + '-artifact'),
      fields: artifactFields,
    },
    changedReason: sanitizeResponse(raw.changedReason),
    transfer: sanitizeResponse(raw.transfer),
    startedAt: raw.startedAt || new Date().toISOString(),
    completedAt: raw.completedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
