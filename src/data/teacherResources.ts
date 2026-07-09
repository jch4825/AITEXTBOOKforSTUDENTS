import type { ModuleId } from '../types';

export interface TeacherLink { label: string; url: string }

// 나중에 동영상 링크 등을 채우면 ClassroomDock의 "교사 자료" 패널에 자동 노출된다.
export const TEACHER_RESOURCES: Record<ModuleId, TeacherLink[]> = {
  m1: [], m2: [], m3: [], m4: [], m5: [], m6: [],
};
