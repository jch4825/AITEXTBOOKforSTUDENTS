import type { LessonId, ModuleId } from '../../../types';

export type WorksheetLevel = 'high' | 'middle' | 'low';

export type WorksheetBlockKind =
  | 'heading'
  | 'text'
  | 'short-answer'
  | 'sentence'
  | 'multiple-choice'
  | 'trace'
  | 'cut-paste'
  | 'draw'
  | 'image'
  | 'divider';

export interface WorksheetIllustration {
  src: string;
  alt: string;
  caption?: string;
}

export interface WorksheetBlock {
  id: string;
  kind: WorksheetBlockKind;
  title?: string;
  text?: string;
  instruction?: string;
  options?: string[];
  cards?: string[];
  traceText?: string;
  lineCount?: number;
  image?: WorksheetIllustration;
  fontSize?: number;
  fontFamily?: 'sans' | 'serif' | 'hand';
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export interface WorksheetVariant {
  level: WorksheetLevel;
  label: string;
  subtitle: string;
  blocks: WorksheetBlock[];
}

export interface LessonWorksheet {
  lessonId: LessonId;
  moduleId: ModuleId;
  moduleTitle: string;
  lessonTitle: string;
  objective: string;
  accent: string;
  accentSoft: string;
  illustration?: WorksheetIllustration;
  variants: Record<WorksheetLevel, WorksheetVariant>;
}
