import type { GeneralizationCycleRecord, ModuleId } from '../types';

export const GENERALIZATION_STORAGE_KEY = 'ai-students-generalization-v1';
export type GeneralizationRecords = Record<string, GeneralizationCycleRecord>;
export type GeneralizationRecordPatch = Partial<GeneralizationCycleRecord> & {
  moduleId: ModuleId;
  studentName: string;
};

function getStorage(): Storage | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return window.localStorage;
}

export function readGeneralizationRecords(): GeneralizationRecords {
  const storage = getStorage();
  if (!storage) return {};
  try {
    const raw = storage.getItem(GENERALIZATION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as GeneralizationRecords;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.error('Failed to read generalization records', error);
    return {};
  }
}

export function writeGeneralizationRecords(records: GeneralizationRecords): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(GENERALIZATION_STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Failed to save generalization records', error);
    return false;
  }
}

export function updateGeneralizationRecord(
  cycleId: string,
  patch: GeneralizationRecordPatch,
): GeneralizationCycleRecord {
  const records = readGeneralizationRecords();
  const previous = records[cycleId];
  const next: GeneralizationCycleRecord = {
    version: 1,
    cycleId,
    moduleId: patch.moduleId,
    studentName: patch.studentName,
    ...previous,
    ...patch,
    preview: patch.preview ?? previous?.preview,
    main: patch.main ?? previous?.main,
    observation: patch.observation ?? previous?.observation,
  };
  delete (next as Partial<GeneralizationCycleRecord>).version;
  next.version = 1;
  records[cycleId] = next;
  writeGeneralizationRecords(records);
  return next;
}

export function removeGeneralizationRecord(cycleId: string): void {
  const records = readGeneralizationRecords();
  delete records[cycleId];
  writeGeneralizationRecords(records);
}
