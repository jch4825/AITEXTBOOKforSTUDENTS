import { choiceCardImageSrc, getChoiceCardSet, type ChoiceCardSet } from '../../../data/choiceCards';
import type { ModulePortfolioDefinition } from '../../../data/modulePortfolios/types';
import { PECS_LABELS } from '../../../data/pecs';
import {
  PICTURE_WORKSHEET_SPECS,
  type PictureCustomCard,
  type PictureList,
  type PictureWorksheetSpec,
  type WorksheetPicRef,
} from '../../../data/pictureWorksheets';
import type { LessonId, ModuleId } from '../../../types';
import { publicAssetUrl } from '../../../utils/publicAssetUrl';
import type { StudioChoice, StudioDefinition } from '../../studio/types';
import type { WorksheetBlock, WorksheetCard, WorksheetIllustration, WorksheetPage, WorksheetZone } from './types';

/**
 * 그림 카드 학습지(하·중 수준)의 기본 구성의 판.
 * 저장해 둔 편집본의 `template`이 이 값과 다르면 옛 글자 위주 구성이므로 새 구성으로 갈아 끼운다.
 */
export const PICTURE_TEMPLATE = 'picture-v1';

/** 그림 카드 학습지를 쓰는 수준. 하는 낱말 따라 쓰기, 중은 문장 덧쓰기와 빈칸 채우기를 더한다. */
export type PictureLevel = 'low' | 'middle';

/** 한 장에 올리는 카드 수. 고르기·붙이기 모두 세 장이면 카드를 한 변 50mm 이상으로 키울 수 있다. */
export const PICTURE_CARD_COUNT = 3;

const YES_ZONE: WorksheetZone = { id: 'yes', label: '맞아요', mark: 'o' };
const NO_ZONE: WorksheetZone = { id: 'no', label: '아니에요', mark: 'x' };
const MINE_ZONE: WorksheetZone = { id: 'mine', label: '내가 고른 카드' };

const COUNT_WORD = ['', '한', '두', '세', '네'];

export interface PictureSource {
  lessonId: LessonId;
  moduleId: ModuleId;
  title: string;
  studio?: StudioDefinition;
  portfolio?: ModulePortfolioDefinition;
}

function hash(text: string): number {
  let value = 0;
  for (const ch of text) value = (value * 31 + ch.codePointAt(0)!) >>> 0;
  return value;
}

/** 카드를 `offset`칸만큼 돌려 놓는다. 알맞은 카드가 늘 같은 자리에 놓이지 않게 한다. */
function rotate<T>(items: readonly T[], offset: number): T[] {
  if (items.length === 0) return [];
  const shift = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

type Picture = Pick<WorksheetCard, 'src' | 'emoji' | 'printed'> & { label?: string };

/** 그림 가리키는 말을 실제 그림으로 푼다. */
export function resolvePicture(ref: WorksheetPicRef, moduleId: ModuleId): Picture {
  if ('pecs' in ref) return { src: choiceCardImageSrc(moduleId, ref.pecs), printed: true, label: PECS_LABELS[ref.pecs] };
  if ('legacy' in ref) return { src: publicAssetUrl(`/lessons/pecs/${ref.legacy}.webp`), printed: true, label: PECS_LABELS[ref.legacy] };
  if ('image' in ref) return { src: publicAssetUrl(ref.image) };
  return { emoji: ref.emoji };
}

function choiceCard(choice: StudioChoice, set: ChoiceCardSet | undefined): WorksheetCard {
  const card = set?.cards[choice.id];
  if (card?.cardId && set) {
    return { id: choice.id, label: card.label, src: choiceCardImageSrc(set.moduleId, card.cardId), printed: true, say: choice.label };
  }
  return { id: choice.id, label: card?.label ?? choice.label, emoji: card?.emoji ?? choice.emoji, say: choice.label };
}

function customCard(card: PictureCustomCard, moduleId: ModuleId): WorksheetCard {
  const picture = resolvePicture(card.pic, moduleId);
  // 카드 글자는 구성에 적은 것이 기준이다(그림 카드면 그림에 인쇄된 글자와 같아야 하고, check:worksheet-picture가 맞춰 본다).
  return { id: card.id, ...picture, label: card.label, zone: card.zone, suitable: card.right, say: card.say };
}

/**
 * 한 목록의 카드. 선택지에서 만들거나(`show`) 따로 그린 카드(`cards`)를 쓴다.
 * 알맞은 카드(`right`)는 `suitable`로 표시하고, 붙이기에서는 알맞은 칸(yes/no)도 정해 준다.
 */
function listCards(
  list: PictureList,
  choices: readonly StudioChoice[],
  set: ChoiceCardSet | undefined,
  moduleId: ModuleId,
  place: 'choose' | 'sort',
): WorksheetCard[] {
  if (list.cards) {
    const cards = list.cards.map(card => customCard(card, moduleId));
    // 알맞은 카드를 정한 목록이면 나머지는 알맞지 않은 카드다.
    if (place === 'choose' && cards.some(card => card.suitable)) return cards.map(card => ({ ...card, suitable: Boolean(card.suitable) }));
    return cards;
  }
  const byId = new Map(choices.map(choice => [choice.id, choice]));
  const ids = list.show ?? choices.slice(0, PICTURE_CARD_COUNT).map(choice => choice.id);
  const right = list.right ? new Set(list.right) : undefined;
  return ids.map((id) => {
    const choice = byId.get(id);
    if (!choice) throw new Error(`pictureWorksheets: 선택지 ${id}를 찾을 수 없습니다.`);
    let card = choiceCard(choice, set);
    const swap = list.pics?.[id];
    if (swap) {
      const picture = resolvePicture(swap, moduleId);
      if (picture.printed && picture.label !== card.label) {
        throw new Error(`pictureWorksheets: ${id}의 카드 글자 “${card.label}”가 바꿀 그림에 인쇄된 “${picture.label}”와 다릅니다.`);
      }
      card = { ...card, src: picture.src, emoji: picture.emoji, printed: picture.printed };
    }
    // 칸을 따로 정해 둔 목록(순서 붙이기 등)은 카드마다 들어갈 칸이 곧 답이다.
    if (list.place) return { ...card, suitable: true, zone: list.place[id] };
    if (!right) return card;
    const suitable = right.has(id);
    return place === 'sort' ? { ...card, suitable, zone: suitable ? YES_ZONE.id : NO_ZONE.id } : { ...card, suitable };
  });
}

function illustration(src: string, alt: string, caption?: string): WorksheetIllustration {
  return { src: publicAssetUrl(src), alt, caption };
}

function sceneFor(source: PictureSource, number: number): WorksheetIllustration | undefined {
  const scenes = source.studio?.visualNovel?.scenes;
  if (scenes?.length) {
    const scene = scenes[Math.min(scenes.length, Math.max(1, number)) - 1];
    return illustration(scene.imageSrc, scene.alt);
  }
  const story = source.portfolio?.closingStory;
  if (story?.length) {
    const scene = story[Math.min(story.length, Math.max(1, number)) - 1];
    return illustration(scene.imageSrc, scene.alt);
  }
  return undefined;
}

/** 적용 상황 그림. 스튜디오의 적용 자극 그림을 먼저 쓰고, 없으면 마지막 이야기 장면을 쓴다. */
function transferScene(source: PictureSource): WorksheetIllustration | undefined {
  const stimulus = source.studio?.transfer.stimuli?.find(item => item.kind === 'image');
  if (stimulus && stimulus.kind === 'image') return illustration(stimulus.src, stimulus.alt);
  return sceneFor(source, 4);
}

function zonesFor(list: PictureList, moduleId: ModuleId, hasRight: boolean): WorksheetZone[] {
  if (list.zones) {
    return list.zones.map(zone => {
      if (!zone.pic) return { id: zone.id, label: zone.label };
      const picture = resolvePicture(zone.pic, moduleId);
      return { id: zone.id, label: zone.label, card: { id: `${zone.id}-card`, ...picture, label: picture.label ?? zone.label } };
    });
  }
  return hasRight ? [YES_ZONE, NO_ZONE] : [MINE_ZONE];
}

function choicesOf(source: PictureSource, which: 'first' | 'transfer'): readonly StudioChoice[] {
  if (source.studio) return which === 'first' ? source.studio.firstAttempt.choices : source.studio.transfer.choices;
  return source.portfolio?.nextChoices ?? [];
}

/** 고르기 머리줄 안내. 알맞은 카드가 몇 장인지 알려 준다(정해진 답이 없으면 마음대로 고른다). */
function chooseHint(rightCount: number): string {
  if (rightCount <= 0) return '마음에 드는 그림에 ○ 해요';
  if (rightCount === 1) return '알맞은 그림에 ○ 해요';
  return `알맞은 그림 ${COUNT_WORD[rightCount] ?? rightCount} 장에 ○ 해요`;
}

/**
 * 그림 카드 학습지 두 장: 1장은 보고 고르고 쓰는 면, 2장은 오려 붙이는 면. 구성이 없는 차시는 undefined.
 *
 * 하와 중은 같은 카드와 물음을 쓰고 아래만 다르다.
 *  - 2. 쓰기: 하는 핵심 낱말 하나를 따라 쓴다. 중은 핵심 문장을 따라 쓰고(첫 줄), 둘째 줄에서는 그 문장의 핵심 낱말만
 *    빈칸으로 둔 채 직접 쓴다(덧쓰기 → 채워 쓰기). 그림 카드의 낱말이 쓸 낱말의 본보기다.
 *  - 3. 붙이기: 중은 칸 이름도 연한 글자로 그려 덧쓰게 한다.
 */
export function buildPicturePages(level: PictureLevel, source: PictureSource): WorksheetPage[] | undefined {
  const spec: PictureWorksheetSpec | undefined = PICTURE_WORKSHEET_SPECS[source.lessonId];
  if (!spec) return undefined;
  const set = getChoiceCardSet(source.lessonId);
  const seed = hash(source.lessonId);

  const chooseCards = rotate(listCards(spec.first, choicesOf(source, 'first'), set, source.moduleId, 'choose'), seed % 3);
  const sortCards = rotate(listCards(spec.transfer, choicesOf(source, 'transfer'), set, source.moduleId, 'sort'), (seed >>> 3) % 3);
  const hasRight = sortCards.some(card => card.zone);
  const wordPicture = resolvePicture(spec.wordPic, source.moduleId);

  const middle = level === 'middle';
  const prefix = middle ? 'mid' : 'low';
  const choose: WorksheetBlock = {
    id: `${prefix}-choose`,
    kind: 'picture-choice',
    title: '1. 골라요',
    text: chooseHint(chooseCards.filter(card => card.suitable).length),
    instruction: spec.ask,
    image: sceneFor(source, spec.scene ?? 2),
    pictureCards: chooseCards,
  };
  const trace: WorksheetBlock = middle
    ? {
      id: `${prefix}-trace`,
      kind: 'word-trace',
      title: '2. 덧써요',
      text: '연한 글자를 따라 쓰고, 빈칸에 낱말을 써요',
      traceText: spec.sentence,
      traceBlank: spec.word,
      lineCount: 2,
      pictureCards: [{ id: 'word', ...wordPicture, label: spec.word }],
    }
    : {
      id: `${prefix}-trace`,
      kind: 'word-trace',
      title: '2. 따라 써요',
      text: '연한 글자를 따라 쓰고, 아래 줄에도 써요',
      traceText: spec.word,
      lineCount: 2,
      pictureCards: [{ id: 'word', ...wordPicture, label: spec.word }],
    };
  const sortHint = spec.transfer.hint ?? (hasRight ? '오려서 알맞은 칸에 붙여요' : '마음에 드는 그림 한 장을 붙여요');
  const sort: WorksheetBlock = {
    id: `${prefix}-sort`,
    kind: 'picture-sort',
    title: '3. 붙여요',
    // 중은 칸 이름도 덧쓴다(‘…붙여요’로 끝나는 안내를 ‘…붙이고, 칸 이름을 덧써요’로 잇는다).
    text: middle ? sortHint.replace(/붙여요$/, '붙이고, 칸 이름을 덧써요') : sortHint,
    instruction: spec.situation,
    image: transferScene(source),
    zones: zonesFor(spec.transfer, source.moduleId, hasRight),
    pictureCards: sortCards,
    traceZones: middle ? true : undefined,
  };
  return [
    { id: `${prefix}-page-1`, blocks: [choose, trace] },
    { id: `${prefix}-page-2`, blocks: [sort] },
  ];
}
