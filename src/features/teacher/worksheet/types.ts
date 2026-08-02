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

export interface WorksheetPage {
  id: string;
  blocks: WorksheetBlock[];
}

export interface WorksheetVariant {
  level: WorksheetLevel;
  label: string;
  subtitle: string;
  blocks: WorksheetBlock[];
  /** 기존 저장본과의 호환을 위해 blocks를 유지하면서 페이지 단위 편집을 지원한다. */
  pages?: WorksheetPage[];
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

export function worksheetPagesForVariant(variant: WorksheetVariant): WorksheetPage[] {
  const savedPages = Array.isArray(variant.pages)
    ? variant.pages.filter(page => page && typeof page.id === 'string' && Array.isArray(page.blocks))
    : [];
  if (savedPages.length > 0) return savedPages;
  return [{ id: `${variant.level}-page-1`, blocks: variant.blocks }];
}

export function worksheetVariantWithPages(variant: WorksheetVariant, pages: WorksheetPage[]): WorksheetVariant {
  return { ...variant, pages, blocks: pages.flatMap(page => page.blocks) };
}
