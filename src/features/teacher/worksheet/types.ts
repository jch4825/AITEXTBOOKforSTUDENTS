import type { LessonId, ModuleId } from '../../../types';

export type WorksheetLevel = 'high' | 'middle' | 'low';

export type WorksheetActivityKind = 'write' | 'trace' | 'cut-paste' | 'match' | 'connect';

export interface WorksheetPair {
  left: string;
  right: string;
}

export interface WorksheetActivity {
  id: string;
  kind: WorksheetActivityKind;
  title: string;
  instruction: string;
  prompt?: string;
  lines?: number;
  items?: string[];
  pairs?: WorksheetPair[];
  traceText?: string;
  shape?: 'circle' | 'square' | 'triangle' | 'star';
}

export interface WorksheetVariant {
  level: WorksheetLevel;
  label: string;
  subtitle: string;
  instruction: string;
  activities: WorksheetActivity[];
}

export interface LessonWorksheet {
  lessonId: LessonId;
  moduleId: ModuleId;
  moduleTitle: string;
  lessonTitle: string;
  objective: string;
  accent: string;
  accentSoft: string;
  variants: Record<WorksheetLevel, WorksheetVariant>;
}
