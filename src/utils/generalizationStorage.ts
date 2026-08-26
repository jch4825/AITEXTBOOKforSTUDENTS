import type { GeneralizationCycleRecord, ModuleId } from '../types';

export const GENERALIZATION_STORAGE_KEY = 'ai-students-generalization-v1';

/**
 * 같은 탭에서 일어난 변경을 화면에 알린다.
 * 브라우저의 `storage` 이벤트는 다른 탭의 변경에만 발생하므로,
 * 교사가 같은 탭에서 기록을 지웠을 때 화면이 갱신되지 않는다.
 * 스튜디오 과정기록의 STUDIO_EVIDENCE_CHANGED와 같은 방식이다.
 */
export const GENERALIZATION_CHANGED = 'generalization-records-changed';

export type GeneralizationRecords = Record<string, GeneralizationCycleRecord>;
export type GeneralizationRecordPatch = Partial<GeneralizationCycleRecord> & {
  moduleId: ModuleId;
  studentName: string;
};

function getStorage(): Storage | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return window.localStorage;
}

function notify(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(GENERALIZATION_CHANGED));
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
    notify();
    return true;
  } catch (error) {
    console.error('Failed to save generalization records', error);
    return false;
  }
}

/**
 * 일반화 기록 전체 삭제.
 * 교사 화면의 과정기록 삭제는 스튜디오 과정기록만 지워 이 기록이 남아 있었다.
 */
export function clearGeneralizationRecords(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(GENERALIZATION_STORAGE_KEY);
  notify();
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
