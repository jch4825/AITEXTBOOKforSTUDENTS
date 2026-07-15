import { useCallback, useState } from 'react';
import type { GeneralizationCycleRecord, ModuleId } from '../../types';
import {
  readGeneralizationRecords,
  removeGeneralizationRecord,
  updateGeneralizationRecord,
  type GeneralizationRecordPatch,
} from '../../utils/generalizationStorage';

export function useGeneralizationCycle(cycleId: string, moduleId: ModuleId, studentName: string) {
  const [record, setRecord] = useState<GeneralizationCycleRecord | null>(
    () => readGeneralizationRecords()[cycleId] ?? null,
  );
  const [storageError, setStorageError] = useState(false);

  const update = useCallback((patch: Omit<GeneralizationRecordPatch, 'moduleId' | 'studentName'>) => {
    const next = updateGeneralizationRecord(cycleId, { ...patch, moduleId, studentName });
    setRecord(next);
    setStorageError(false);
    return next;
  }, [cycleId, moduleId, studentName]);

  const reset = useCallback(() => {
    removeGeneralizationRecord(cycleId);
    setRecord(null);
    setStorageError(false);
  }, [cycleId]);

  return { record, update, reset, storageError };
}
