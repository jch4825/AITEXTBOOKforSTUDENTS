import { getCanonicalLesson } from '../../../data/canonicalLessons';
import type { CanonicalLessonDesign, CanonicalStage } from '../../../data/canonicalLessons/types';
import { getLesson } from '../../../data/lessons';
import { getModule } from '../../../data/modules';
import type { LessonId } from '../../../types';
import { themeFor } from '../../../utils/moduleThemes';
import { publicAssetUrl } from '../../../utils/publicAssetUrl';
import { worksheetPagesForVariant, worksheetVariantWithPages, type LessonWorksheet, type WorksheetBlock, type WorksheetBlockKind, type WorksheetIllustration, type WorksheetLevel, type WorksheetVariant } from './types';

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

function compactText(value: string | undefined | null, maxLength: number): string {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`;
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

function uniqueText(values: string[]): string[] {
  return [...new Set(values.map(value => cleanText(value)).filter(Boolean))];
}

function stagePrompt(stage: CanonicalStage | undefined, fallback: string, maxLength = 88): string {
  return compactText(stage?.activity.prompt || stage?.instruction || stage?.title || fallback, maxLength);
}

function stageChoices(stage: CanonicalStage | undefined): string[] {
  if (!stage) return [];
  const activity = stage.activity;
  switch (activity.kind) {
    case 'single-choice':
    case 'multi-choice':
      return activity.choices.map(choice => choice.label);
    case 'sort':
      return activity.cards.map(card => card.label);
    case 'sequence':
      return activity.items.map(item => item.label);
    case 'compare':
      return [activity.left.title, activity.right.title];
    case 'annotate':
      return activity.markers.map(marker => marker.label);
    case 'adjust':
      return activity.controls.map(control => control.label);
    case 'calculate':
      return [
        `${activity.values.join(` ${activity.operation} `)} = ?`,
        activity.unit ? `단위: ${activity.unit}` : '계산한 답',
      ];
    case 'build':
      return activity.pieces.map(piece => piece.label);
    case 'expression':
      return (activity.choiceCards ?? []).map(card => card.label);
    case 'ai-compare':
      return [activity.source.title, activity.response.title];
    default:
      return [];
  }
}

function lessonOptions(stage: CanonicalStage | undefined, fallback: string): string[] {
  const options = uniqueText(stageChoices(stage).map(value => compactText(value, 42))).slice(0, 3);
  if (options.length >= 2) return options;
  return uniqueText([
    ...options,
    compactText(fallback, 34),
    '배운 내용',
    '내 생각',
  ]).slice(0, 3);
}

function lessonPhrase(source: { objective: string; canonical?: CanonicalLessonDesign }, stage: CanonicalStage | undefined): string {
  return compactText(source.canonical?.coreConcepts?.[0] || stage?.title || source.objective, 38);
}

function lessonStages(source: { objective: string; canonical?: CanonicalLessonDesign }): CanonicalStage[] {
  return source.canonical?.stages ?? [];
}

function starterBlocksForLevel(level: WorksheetLevel, source: {
  title: string;
  objective: string;
  illustration?: WorksheetIllustration;
  canonical?: CanonicalLessonDesign;
}): WorksheetBlock[] {
  const frame = starterBlocks(source.title, source.objective);
  const stages = lessonStages(source);
  const optionStage = stages.find(stage => stageChoices(stage).length >= 2) ?? stages[0];
  const secondOptionStage = stages.find(stage => stage !== optionStage && stageChoices(stage).length >= 2)
    ?? stages[1]
    ?? optionStage;
  const writingStage = stages.find(stage => stage.phase === 'artifact' || stage.phase === 'transfer' || stage.phase === 'decision')
    ?? stages[0];
  const phrase = lessonPhrase(source, writingStage);
  const options = lessonOptions(optionStage, phrase);
  const cards = lessonOptions(secondOptionStage, phrase);
  const artifactField = source.canonical?.artifact.fields.find(field => field.input === 'text' || field.input === 'choice');
  const writingTopic = compactText(artifactField?.label || stagePrompt(writingStage, source.objective, 76), 84);
  const transferTopic = compactText(
    source.canonical?.transfer.title
      || source.canonical?.transfer.scenario
      || source.canonical?.artifact.title
      || source.objective,
    84,
  );

  if (level === 'high') {
    return [
      ...frame,
      {
        id: 'starter-high-writing',
        kind: 'sentence',
        title: '1. 핵심 내용을 써요',
        instruction: `배운 핵심 내용: ${writingTopic}`,
        lineCount: 2,
        fontSize: 15,
        image: source.illustration,
      },
      {
        id: 'starter-high-reason',
        kind: 'sentence',
        title: '2. 이유를 써요',
        instruction: stagePrompt(optionStage, source.objective),
        lineCount: 2,
        fontSize: 15,
      },
      {
        id: 'starter-high-transfer',
        kind: 'short-answer',
        title: '3. 생활에서 써요',
        instruction: compactText(`${transferTopic}에 배운 내용을 어떻게 써 볼까요?`, 96),
        lineCount: 1,
        fontSize: 15,
      },
    ];
  }

  if (level === 'middle') {
    return [
      ...frame,
      {
        id: 'starter-middle-trace',
        kind: 'trace',
        title: '1. 핵심 낱말 따라 쓰기',
        instruction: '연한 글자를 따라 천천히 써 보세요.',
        traceText: phrase,
        lineCount: 1,
        fontSize: 19,
        image: source.illustration,
      },
      {
        id: 'starter-middle-choice',
        kind: 'multiple-choice',
        title: '2. 알맞은 답 고르기',
        instruction: stagePrompt(optionStage, source.objective),
        options,
        fontSize: 14,
      },
      {
        id: 'starter-middle-cut',
        kind: 'cut-paste',
        title: '3. 카드 붙이기',
        instruction: compactText(stagePrompt(secondOptionStage, `알맞은 카드를 ${phrase}와 연결해 보세요.`, 52), 56),
        cards,
        fontSize: 13,
      },
    ];
  }

  return [
    ...frame,
    {
      id: 'starter-low-choice',
      kind: 'multiple-choice',
      title: '1. 알맞은 답 찾기',
      instruction: stagePrompt(optionStage, source.objective),
      options,
      fontSize: 14,
      image: source.illustration,
    },
    {
      id: 'starter-low-trace',
      kind: 'trace',
      title: '2. 핵심 낱말 따라 쓰기',
      instruction: '연한 글자를 따라 천천히 써 보세요.',
      traceText: phrase,
      lineCount: 1,
      fontSize: 18,
    },
    {
      id: 'starter-low-cut',
      kind: 'cut-paste',
      title: '3. 같은 것끼리 붙이기',
      instruction: compactText(`알맞은 곳에 카드를 붙여 보세요: ${phrase}`, 56),
      cards,
      fontSize: 13,
    },
  ];
}

function collectLessonSource(lessonId: LessonId): {
  title: string;
  objective: string;
  illustration?: WorksheetIllustration;
  canonical?: CanonicalLessonDesign;
} {
  const canonical = getCanonicalLesson(lessonId);
  const lesson = getLesson(lessonId);
  const title = cleanText(canonical?.title || lesson?.title || '오늘의 학습지');
  const objective = cleanText(canonical?.masterObjective || lesson?.objective || '오늘 배운 내용을 정리해요.');
  const illustration = illustrationFromAsset(
    (canonical?.assets ?? []).find(asset => asset.kind === 'story' && asset.renderAs === 'image' && asset.src)
      ?? (canonical?.assets ?? []).find(asset => asset.renderAs === 'image' && asset.src),
  );
  return { title, objective, illustration, canonical };
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
      high: { ...LEVELS.high, blocks: starterBlocksForLevel('high', source) },
      middle: { ...LEVELS.middle, blocks: starterBlocksForLevel('middle', source) },
      low: { ...LEVELS.low, blocks: starterBlocksForLevel('low', source) },
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
    && variant.blocks.every(isWorksheetBlock)
    && (variant.pages === undefined || (
      Array.isArray(variant.pages)
      && variant.pages.every(page => Boolean(page) && typeof page.id === 'string' && Array.isArray(page.blocks) && page.blocks.every(isWorksheetBlock))
    ));
}

export function mergeWorksheetDraft(base: LessonWorksheet, saved: unknown): LessonWorksheet {
  if (!saved || typeof saved !== 'object') return base;
  const value = saved as Partial<LessonWorksheet>;
  const variants = value.variants && typeof value.variants === 'object' ? value.variants : {};
  const mergedVariants = { ...base.variants };
  (['high', 'middle', 'low'] as const).forEach(level => {
    const savedVariant = variants[level];
    if (isWorksheetVariant(savedVariant)) {
      const savedPages = worksheetPagesForVariant(savedVariant);
      const savedBlocks = savedPages.flatMap(page => page.blocks);
      const isOldStarter = savedBlocks.length <= 2
        && savedBlocks.every(block => block.kind === 'heading' || block.kind === 'text');
      const basePages = worksheetPagesForVariant(base.variants[level]);
      const pages = isOldStarter
        ? basePages.map((page, pageIndex) => pageIndex === 0
          ? {
            ...page,
            blocks: page.blocks.map((block, index) => {
              if (index > 1) return block;
              const savedBlock = savedBlocks.find(candidate => candidate.kind === block.kind)
                ?? savedBlocks[index];
              return savedBlock ? { ...block, ...savedBlock, id: block.id, kind: block.kind } : block;
            }),
          }
          : page)
        : savedPages;
      mergedVariants[level] = {
        ...worksheetVariantWithPages(base.variants[level], pages),
        label: savedVariant.label,
        subtitle: savedVariant.subtitle,
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
  return `ai-students-worksheets-v5:${lessonId}`;
}
