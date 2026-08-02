import { getCanonicalLesson } from '../../../data/canonicalLessons';
import type {
  CanonicalActivity,
  CanonicalLessonDesign,
  CanonicalStage,
} from '../../../data/canonicalLessons/types';
import { getLesson } from '../../../data/lessons';
import { getModule } from '../../../data/modules';
import type { LessonId } from '../../../types';
import { themeFor } from '../../../utils/moduleThemes';
import type {
  LessonWorksheet,
  WorksheetActivity,
  WorksheetPair,
  WorksheetVariant,
} from './types';

const LEVELS = {
  high: { label: '상', subtitle: '직접 써요', instruction: '배운 내용을 내 말로 설명하고, 근거를 적어 보세요.' },
  middle: { label: '중', subtitle: '덧쓰고 붙여요', instruction: '문장을 덧쓰고 낱말 카드를 오려 알맞은 곳에 붙여 보세요.' },
  low: { label: '하', subtitle: '오리고 찾아요', instruction: '같은 모양을 찾아 붙이고, 글자 선을 천천히 따라 그어 보세요.' },
} as const;

const FALLBACK_TOKENS = ['중요한 내용', '내가 해 본 일', '확인할 점', '도움이 되는 방법'];

function cleanText(value: string | undefined | null): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function unique(values: string[], limit = 8): string[] {
  const result: string[] = [];
  for (const value of values) {
    const cleaned = cleanText(value);
    if (cleaned && !result.includes(cleaned)) result.push(cleaned);
    if (result.length >= limit) break;
  }
  return result;
}

function activityLabels(activity: CanonicalActivity): string[] {
  switch (activity.kind) {
    case 'single-choice':
    case 'multi-choice':
      return activity.choices.map(choice => choice.label);
    case 'sort':
      return [...activity.bins.map(bin => bin.label), ...activity.cards.map(card => card.label)];
    case 'sequence':
      return activity.items.map(item => item.label);
    case 'compare':
      return [activity.left.title, activity.left.content, activity.right.title, activity.right.content, ...activity.criteria.map(c => c.label)];
    case 'annotate':
      return activity.markers.map(marker => marker.label);
    case 'adjust':
      return [...activity.controls.map(control => control.label), ...activity.states.map(state => state.resultText)];
    case 'calculate':
      return [activity.values.join(` ${activity.operation} `), activity.unit ? `단위: ${activity.unit}` : ''];
    case 'build':
      return [...activity.slots.map(slot => slot.label), ...activity.pieces.map(piece => piece.label)];
    case 'expression':
      return activity.choiceCards?.map(card => card.label) ?? [];
    case 'ai-compare':
      return [activity.source.title, activity.source.text, activity.response.title, activity.response.text, ...activity.criteria.map(c => c.label)];
    default:
      return [];
  }
}

function collectSource(lessonId: LessonId): {
  canonical?: CanonicalLessonDesign;
  title: string;
  objective: string;
  core: string;
  evidence: string[];
  labels: string[];
  prompts: string[];
  transfer: string;
  wrapUp: string;
} {
  const canonical = getCanonicalLesson(lessonId);
  const lesson = getLesson(lessonId);
  const title = cleanText(canonical?.title || lesson?.title || '오늘의 학습지');
  const objective = cleanText(canonical?.masterObjective || lesson?.objective || '오늘 배운 내용을 정리해요.');
  const core = cleanText(canonical?.coreConcepts[0] || objective);
  const evidence = unique([
    ...(canonical?.canonicalScenario.evidence ?? []),
    canonical?.canonicalScenario.purpose ?? '',
    canonical?.canonicalScenario.resolution ?? '',
    canonical?.canonicalScenario.conditionChange ?? '',
  ], 6);
  const stages = canonical?.stages ?? [];
  const labels = unique(stages.flatMap(stage => activityLabels(stage.activity)), 10);
  const prompts = unique(stages.flatMap(stage => [stage.instruction, stage.activity.prompt]), 6);
  const transfer = cleanText(canonical?.transfer.scenario || canonical?.transfer.title || '배운 방법을 다른 상황에도 사용해 보세요.');
  const wrapUp = cleanText(canonical?.wrapUp || lesson?.wrapUpNormal || lesson?.wrapUpEasy || '오늘 배운 내용을 다시 읽어 보세요.');
  return {
    canonical,
    title,
    objective,
    core,
    evidence: evidence.length > 0 ? evidence : [objective],
    labels: labels.length > 0 ? labels : FALLBACK_TOKENS,
    prompts: prompts.length > 0 ? prompts : [objective],
    transfer,
    wrapUp,
  };
}

function makePairs(labels: string[], evidence: string[]): WorksheetPair[] {
  const left = labels.slice(0, 4);
  const right = evidence.slice(0, 4);
  const pairs: WorksheetPair[] = [];
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    pairs.push({
      left: left[i] ?? `내용 ${i + 1}`,
      right: right[i] ?? `설명 ${i + 1}`,
    });
  }
  return pairs;
}

function highVariant(source: ReturnType<typeof collectSource>): WorksheetVariant {
  const prompts = [
    `“${source.core}”를 내 말로 설명해 보세요.`,
    `오늘 배운 내용에서 기억에 남은 까닭을 써 보세요.`,
    `다른 상황에서 어떻게 사용할지 써 보세요.`,
  ];
  return {
    level: 'high',
    ...LEVELS.high,
    activities: [
      {
        id: 'high-explain',
        kind: 'write',
        title: '1. 내 말로 설명하기',
        instruction: source.prompts[0] || LEVELS.high.instruction,
        prompt: prompts[0],
        lines: 5,
      },
      {
        id: 'high-evidence',
        kind: 'write',
        title: '2. 근거와 까닭 쓰기',
        instruction: '활동에서 본 단서나 근거를 한 가지 이상 적어 보세요.',
        prompt: `${source.evidence[0]} — 왜 그렇게 생각했는지 써 보세요.`,
        lines: 4,
      },
      {
        id: 'high-transfer',
        kind: 'write',
        title: '3. 다른 상황에 써 보기',
        instruction: source.transfer,
        prompt: prompts[2],
        lines: 4,
      },
    ],
  };
}

function middleVariant(source: ReturnType<typeof collectSource>): WorksheetVariant {
  const traceText = source.core.length > 42 ? `${source.core.slice(0, 42)}…` : source.core;
  const items = unique([...source.labels.slice(0, 5), ...source.evidence.slice(0, 2)], 6);
  return {
    level: 'middle',
    ...LEVELS.middle,
    activities: [
      {
        id: 'middle-trace',
        kind: 'trace',
        title: '1. 문장 덧쓰기',
        instruction: '연한 글자를 따라 천천히 써 보세요.',
        traceText,
      },
      {
        id: 'middle-cut-paste',
        kind: 'cut-paste',
        title: '2. 낱말 카드 오려 붙이기',
        instruction: '아래 카드를 오려 알맞은 빈칸에 붙이거나 써 넣어 보세요.',
        prompt: `오늘 배운 내용: ${source.core}`,
        items: items.length > 0 ? items : FALLBACK_TOKENS.slice(0, 5),
      },
      {
        id: 'middle-match',
        kind: 'match',
        title: '3. 내용과 설명 잇기',
        instruction: '왼쪽 낱말과 알맞은 설명을 선으로 이어 보세요.',
        pairs: makePairs(source.labels, source.evidence),
      },
    ],
  };
}

function lowVariant(source: ReturnType<typeof collectSource>): WorksheetVariant {
  const items = unique([...source.labels.slice(0, 4), ...source.evidence.slice(0, 2)], 5);
  const traceItems = unique([source.core, ...source.labels.slice(0, 2)], 3);
  return {
    level: 'low',
    ...LEVELS.low,
    activities: [
      {
        id: 'low-cut-paste',
        kind: 'cut-paste',
        title: '1. 그림·낱말 카드 붙이기',
        instruction: '카드를 오려 같은 내용이 있는 칸에 붙여 보세요.',
        prompt: source.core,
        items: items.length > 0 ? items : FALLBACK_TOKENS.slice(0, 4),
        shape: 'star',
      },
      {
        id: 'low-shape-match',
        kind: 'connect',
        title: '2. 같은 모양 찾기',
        instruction: '같은 모양끼리 선으로 이어 보세요.',
        items: unique(source.labels.slice(0, 4), 4),
        shape: 'circle',
      },
      {
        id: 'low-trace',
        kind: 'trace',
        title: '3. 글자 선긋기',
        instruction: '연한 글자를 따라 선을 그어 보세요.',
        traceText: traceItems.join(' · '),
      },
    ],
  };
}

export function buildLessonWorksheet(lessonId: LessonId): LessonWorksheet {
  const source = collectSource(lessonId);
  const moduleId = source.canonical?.moduleId ?? getLesson(lessonId)?.moduleId ?? 'm1';
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
    variants: {
      high: highVariant(source),
      middle: middleVariant(source),
      low: lowVariant(source),
    },
  };
}

export function isWorksheetVariant(value: unknown): value is WorksheetVariant {
  if (!value || typeof value !== 'object') return false;
  const variant = value as Partial<WorksheetVariant>;
  return typeof variant.level === 'string'
    && typeof variant.label === 'string'
    && typeof variant.subtitle === 'string'
    && typeof variant.instruction === 'string'
    && Array.isArray(variant.activities);
}

export function mergeWorksheetDraft(base: LessonWorksheet, saved: unknown): LessonWorksheet {
  if (!saved || typeof saved !== 'object') return base;
  const value = saved as Partial<LessonWorksheet>;
  const variants = value.variants && typeof value.variants === 'object' ? value.variants : {};
  const mergedVariants = { ...base.variants };
  (['high', 'middle', 'low'] as const).forEach(level => {
    if (isWorksheetVariant(variants[level])) mergedVariants[level] = variants[level];
  });
  return {
    ...base,
    lessonTitle: typeof value.lessonTitle === 'string' ? value.lessonTitle : base.lessonTitle,
    objective: typeof value.objective === 'string' ? value.objective : base.objective,
    variants: mergedVariants,
  };
}

export function worksheetStorageKey(lessonId: LessonId): string {
  return `ai-students-worksheets-v1:${lessonId}`;
}
