import { getCanonicalLesson } from '../../../data/canonicalLessons';
import { getLesson } from '../../../data/lessons';
import { getModule } from '../../../data/modules';
import type { LessonId } from '../../../types';
import { themeFor } from '../../../utils/moduleThemes';
import { publicAssetUrl } from '../../../utils/publicAssetUrl';
import type { LessonWorksheet, WorksheetBlock, WorksheetBlockKind, WorksheetIllustration, WorksheetLevel, WorksheetVariant } from './types';

const LEVELS: Record<WorksheetLevel, Omit<WorksheetVariant, 'blocks'>> = {
  high: { level: 'high', label: '상', subtitle: '직접 써요' },
  middle: { level: 'middle', label: '중', subtitle: '덧쓰고 붙여요' },
  low: { level: 'low', label: '하', subtitle: '오리고 찾아요' },
};

const BLOCK_KINDS: WorksheetBlockKind[] = [
  'heading',
  'text',
  'short-answer',
  'sentence',
  'multiple-choice',
  'trace',
  'cut-paste',
  'draw',
  'image',
  'divider',
];

function cleanText(value: string | undefined | null): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function illustrationFromAsset(asset: { src?: string; alt: string; purpose: string } | undefined): WorksheetIllustration | undefined {
  if (!asset?.src) return undefined;
  return {
    src: publicAssetUrl(asset.src),
    alt: cleanText(asset.alt),
    caption: cleanText(asset.purpose),
  };
}

function starterBlocks(title: string, objective: string): WorksheetBlock[] {
  return [
    {
      id: 'starter-heading',
      kind: 'heading',
      title: '제목 상자',
      text: title,
      fontSize: 26,
    },
    {
      id: 'starter-objective',
      kind: 'text',
      title: '안내 문구 상자',
      text: `학습 목표: ${objective}`,
      fontSize: 14,
    },
  ];
}

function collectLessonSource(lessonId: LessonId): {
  title: string;
  objective: string;
  illustration?: WorksheetIllustration;
} {
  const canonical = getCanonicalLesson(lessonId);
  const lesson = getLesson(lessonId);
  const title = cleanText(canonical?.title || lesson?.title || '오늘의 학습지');
  const objective = cleanText(canonical?.masterObjective || lesson?.objective || '오늘 배운 내용을 정리해요.');
  const illustration = illustrationFromAsset(
    (canonical?.assets ?? []).find(asset => asset.kind === 'story' && asset.renderAs === 'image' && asset.src)
      ?? (canonical?.assets ?? []).find(asset => asset.renderAs === 'image' && asset.src),
  );
  return { title, objective, illustration };
}

export function buildLessonWorksheet(lessonId: LessonId): LessonWorksheet {
  const source = collectLessonSource(lessonId);
  const canonical = getCanonicalLesson(lessonId);
  const moduleId = canonical?.moduleId ?? getLesson(lessonId)?.moduleId ?? 'm1';
  const module = getModule(moduleId);
  const theme = themeFor(moduleId);
  return {
    lessonId,
    moduleId,
    moduleTitle: module?.title ?? 'AI 교실',
    lessonTitle: source.title,
    objective: source.objective,
    accent: theme.accent,
    accentSoft: theme.accentSoft,
    illustration: source.illustration,
    variants: {
      high: { ...LEVELS.high, blocks: starterBlocks(source.title, source.objective) },
      middle: { ...LEVELS.middle, blocks: starterBlocks(source.title, source.objective) },
      low: { ...LEVELS.low, blocks: starterBlocks(source.title, source.objective) },
    },
  };
}

export function isWorksheetBlock(value: unknown): value is WorksheetBlock {
  if (!value || typeof value !== 'object') return false;
  const block = value as Partial<WorksheetBlock>;
  return typeof block.id === 'string'
    && typeof block.kind === 'string'
    && BLOCK_KINDS.includes(block.kind as WorksheetBlockKind);
}

export function isWorksheetVariant(value: unknown): value is WorksheetVariant {
  if (!value || typeof value !== 'object') return false;
  const variant = value as Partial<WorksheetVariant>;
  return typeof variant.level === 'string'
    && typeof variant.label === 'string'
    && typeof variant.subtitle === 'string'
    && Array.isArray(variant.blocks)
    && variant.blocks.every(isWorksheetBlock);
}

export function mergeWorksheetDraft(base: LessonWorksheet, saved: unknown): LessonWorksheet {
  if (!saved || typeof saved !== 'object') return base;
  const value = saved as Partial<LessonWorksheet>;
  const variants = value.variants && typeof value.variants === 'object' ? value.variants : {};
  const mergedVariants = { ...base.variants };
  (['high', 'middle', 'low'] as const).forEach(level => {
    const savedVariant = variants[level];
    if (isWorksheetVariant(savedVariant)) {
      mergedVariants[level] = {
        ...base.variants[level],
        label: savedVariant.label,
        subtitle: savedVariant.subtitle,
        blocks: savedVariant.blocks,
      };
    }
  });
  return {
    ...base,
    lessonTitle: typeof value.lessonTitle === 'string' ? value.lessonTitle : base.lessonTitle,
    objective: typeof value.objective === 'string' ? value.objective : base.objective,
    illustration: base.illustration,
    variants: mergedVariants,
  };
}

export function worksheetStorageKey(lessonId: LessonId): string {
  return `ai-students-worksheets-v3:${lessonId}`;
}
