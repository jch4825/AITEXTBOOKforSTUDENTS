import type {
  PreparedStimulus,
  StudioDefinition,
  StudioStage,
  VisualNovelScene,
} from './types';

export type StudioIllustrationSource = 'prepared' | 'story' | 'none';

export interface StudioContextMedia {
  stimuli: PreparedStimulus[];
  source: StudioIllustrationSource;
}

const CONTEXT_STAGES: StudioStage[] = [
  'first-attempt',
  'condition-change',
  'ai-compare',
  'decision',
  'artifact',
  'transfer',
];

/**
 * M3~M6 장면의 과거 대체 텍스트에는 실제 이미지가 연결된 뒤에도
 * "빈 이미지 자리"라는 문구가 남아 있다. 학생에게는 실제 장면 설명만 읽어 준다.
 */
export function cleanStudioIllustrationAlt(alt: string): string {
  const cleaned = alt.replace(/\s*을 위한 빈 이미지 자리\s*$/, '').trim();
  return cleaned || '차시의 핵심 상황을 보여 주는 그림';
}

function contextStimuliForStage(
  definition: StudioDefinition,
  stage: StudioStage,
): PreparedStimulus[] | undefined {
  if (stage === 'first-attempt') return definition.encounter.stimuli;
  if (stage === 'transfer') return definition.transfer.stimuli;
  if (['condition-change', 'ai-compare', 'decision', 'artifact'].includes(stage)) {
    return definition.conditionChange.stimuli;
  }
  return undefined;
}

function sceneTitle(scene: VisualNovelScene): string {
  return scene.label.replace(/^장면\s*\d+\s*·\s*/, '').trim();
}

function storyStimulus(
  definition: StudioDefinition,
  stage: StudioStage,
): PreparedStimulus | undefined {
  const scenes = definition.visualNovel?.scenes ?? [];
  // 한 차시에 보통 두 장만 쓴다.
  // P02는 첫 판단 장면, P03~P07은 조건과 핵심 단서를 살펴보는 장면을 공유한다.
  const scene = stage === 'first-attempt'
    ? (scenes[1] ?? scenes[0])
    : (scenes[2] ?? scenes[1] ?? scenes[0]);

  if (!scene?.imageSrc) return undefined;

  const caption = stage === 'first-attempt'
    ? `처음 상황 · ${sceneTitle(scene)}`
    : stage === 'transfer'
      ? `핵심 장면 다시 보기 · ${sceneTitle(scene)}`
      : `달라진 조건 · ${sceneTitle(scene)}`;

  return {
    id: `${definition.lessonId}-${stage}-story-illustration`,
    kind: 'image',
    src: scene.imageSrc,
    alt: cleanStudioIllustrationAlt(scene.alt),
    caption,
  };
}

export function getStudioContextMedia(
  definition: StudioDefinition,
  stage: StudioStage,
): StudioContextMedia {
  if (!CONTEXT_STAGES.includes(stage)) {
    return { stimuli: [], source: 'none' };
  }

  const prepared = contextStimuliForStage(definition, stage);
  if (prepared?.some((stimulus) => stimulus.kind === 'image')) {
    return { stimuli: prepared, source: 'prepared' };
  }

  const fallback = storyStimulus(definition, stage);
  if (!fallback) {
    return {
      stimuli: prepared ?? [],
      source: prepared?.length ? 'prepared' : 'none',
    };
  }

  return {
    stimuli: prepared?.length ? [fallback, ...prepared] : [fallback],
    source: 'story',
  };
}
