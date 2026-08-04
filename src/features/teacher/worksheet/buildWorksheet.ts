import { getCanonicalLesson } from '../../../data/canonicalLessons';
import type { CanonicalLessonDesign, CanonicalStage } from '../../../data/canonicalLessons/types';
import { getLessonObjective } from '../../../data/lessonObjectives';
import { getLesson } from '../../../data/lessons';
import { getModulePortfolioDefinition } from '../../../data/modulePortfolios';
import type { ModulePortfolioDefinition } from '../../../data/modulePortfolios/types';
import { getModule } from '../../../data/modules';
import { getStudioDefinition } from '../../../data/studios';
import type { StudioDefinition } from '../../studio/types';
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

function illustrationFromAsset(asset: { src?: string; alt: string; purpose: string } | undefined): WorksheetIllustration | undefined {
  if (!asset?.src) return undefined;
  return {
    src: publicAssetUrl(asset.src),
    alt: cleanText(asset.alt),
    caption: cleanText(asset.purpose),
  };
}

function illustrationFromStudio(studio: StudioDefinition | undefined): WorksheetIllustration | undefined {
  const scene = studio?.visualNovel?.scenes.find((item) => item.imageSrc);
  if (!scene) return undefined;
  return {
    src: publicAssetUrl(scene.imageSrc),
    alt: cleanText(scene.alt),
    caption: cleanText(scene.label),
  };
}

function illustrationFromPortfolio(portfolio: ModulePortfolioDefinition | undefined): WorksheetIllustration | undefined {
  const scene = portfolio?.closingStory?.find((item) => item.imageSrc);
  if (!scene) return undefined;
  return {
    src: publicAssetUrl(scene.imageSrc),
    alt: cleanText(scene.alt),
    caption: cleanText(scene.label),
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

function stagePrompt(stage: CanonicalStage | undefined, fallback: string): string {
  return cleanText(stage?.activity.prompt || stage?.instruction || stage?.title || fallback);
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
  const options = uniqueText(stageChoices(stage)).slice(0, 3);
  if (options.length >= 2) return options;
  return uniqueText([
    ...options,
    fallback,
    '배운 내용',
    '내 생각',
  ]).slice(0, 3);
}

interface WorksheetLessonSource {
  title: string;
  objective: string;
  illustration?: WorksheetIllustration;
  studio?: StudioDefinition;
  portfolio?: ModulePortfolioDefinition;
  canonical?: CanonicalLessonDesign;
}

function lessonPhrase(source: WorksheetLessonSource, stage: CanonicalStage | undefined): string {
  return cleanText(
    source.studio?.visualNovel?.knowledge[0]?.core
      || source.portfolio?.guideSections?.[0]?.title
      || source.canonical?.coreConcepts?.[0]
      || stage?.title
      || source.objective,
  );
}

function lessonStages(source: WorksheetLessonSource): CanonicalStage[] {
  return source.canonical?.stages ?? [];
}

function starterBlocksForLevel(level: WorksheetLevel, source: WorksheetLessonSource): WorksheetBlock[] {
  const frame = starterBlocks(source.title, source.objective);
  const stages = lessonStages(source);
  const optionStage = stages.find(stage => stageChoices(stage).length >= 2) ?? stages[0];
  const secondOptionStage = stages.find(stage => stage !== optionStage && stageChoices(stage).length >= 2)
    ?? stages[1]
    ?? optionStage;
  const writingStage = stages.find(stage => stage.phase === 'artifact' || stage.phase === 'transfer' || stage.phase === 'decision')
    ?? stages[0];
  const phrase = lessonPhrase(source, writingStage);
  const studioOptions = uniqueText(source.studio?.firstAttempt.choices.map((choice) => choice.label) ?? []);
  const studioTransferCards = uniqueText(source.studio?.transfer.choices.map((choice) => choice.label) ?? []);
  const portfolioCards = uniqueText(source.portfolio?.nextChoices.map((choice) => choice.label) ?? []);
  const options = (studioOptions.length >= 2 ? studioOptions : lessonOptions(optionStage, phrase)).slice(0, 3);
  const cards = (
    studioTransferCards.length >= 2
      ? studioTransferCards
      : portfolioCards.length >= 2
        ? portfolioCards
        : lessonOptions(secondOptionStage, phrase)
  ).slice(0, 3);
  const artifactField = source.canonical?.artifact.fields.find(field => field.input === 'text' || field.input === 'choice');
  const writingTopic = cleanText(
    source.studio?.artifact.prompt
      || source.portfolio?.artifactDescription
      || source.portfolio?.guideSections?.[0]?.prompt
      || artifactField?.label
      || stagePrompt(writingStage, source.objective),
  );
  const transferTopic = cleanText(
    source.studio?.transfer.description
      || source.portfolio?.transferPrompt
      || source.canonical?.transfer.title
      || source.canonical?.transfer.scenario
      || source.canonical?.artifact.title
      || source.objective,
  );
  const choicePrompt = cleanText(
    source.studio?.firstAttempt.prompt
      || source.portfolio?.completionRequirement
      || stagePrompt(optionStage, source.objective),
  );
  const reasonPrompt = cleanText(
    source.studio?.firstAttempt.reasonPrompt
      || source.portfolio?.guideSections?.[0]?.prompt
      || stagePrompt(optionStage, source.objective),
  );
  const cardPrompt = cleanText(
    source.studio?.transfer.prompt
      || source.studio?.transfer.description
      || source.portfolio?.transferPrompt
      || stagePrompt(secondOptionStage, `알맞은 카드를 ${phrase}와 연결해 보세요.`),
  );
  const transferInstruction = cleanText(
    source.studio?.transfer.prompt
      || source.portfolio?.transferPrompt
      || `${transferTopic}에 배운 내용을 어떻게 써 볼까요?`,
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
        instruction: reasonPrompt,
        lineCount: 2,
        fontSize: 15,
      },
      {
        id: 'starter-high-transfer',
        kind: 'short-answer',
        title: '3. 생활에서 써요',
        instruction: transferInstruction,
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
        instruction: choicePrompt,
        options,
        fontSize: 14,
      },
      {
        id: 'starter-middle-cut',
        kind: 'cut-paste',
        title: '3. 카드 붙이기',
        instruction: cardPrompt,
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
      instruction: choicePrompt,
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
      instruction: `알맞은 곳에 카드를 붙여 보세요: ${phrase}`,
      cards,
      fontSize: 13,
    },
  ];
}

function collectLessonSource(lessonId: LessonId): WorksheetLessonSource {
  const canonical = getCanonicalLesson(lessonId);
  const lesson = getLesson(lessonId);
  const studio = getStudioDefinition(lessonId);
  const portfolio = getModulePortfolioDefinition(lessonId);
  const objectiveMeta = getLessonObjective(lessonId);
  const title = cleanText(studio?.title || portfolio?.title || lesson?.title || canonical?.title || '오늘의 학습지');
  const objective = cleanText(
    objectiveMeta?.studentMission
      || lesson?.objective
      || portfolio?.description
      || canonical?.masterObjective
      || '오늘 배운 내용을 정리해요.',
  );
  const illustration = illustrationFromStudio(studio)
    ?? illustrationFromPortfolio(portfolio)
    ?? illustrationFromAsset(
      (canonical?.assets ?? []).find(asset => asset.kind === 'story' && asset.renderAs === 'image' && asset.src)
        ?? (canonical?.assets ?? []).find(asset => asset.renderAs === 'image' && asset.src),
    );
  return {
    title,
    objective,
    illustration,
    studio,
    portfolio,
    canonical: studio || portfolio ? undefined : canonical,
  };
}

export function buildLessonWorksheet(lessonId: LessonId): LessonWorksheet {
  const source = collectLessonSource(lessonId);
  const canonical = getCanonicalLesson(lessonId);
  const moduleId = getLesson(lessonId)?.moduleId ?? canonical?.moduleId ?? 'm1';
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
