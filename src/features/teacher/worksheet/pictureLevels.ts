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

/** 그림 카드 학습지를 쓰는 수준. 하는 틀릴 수 없는 붙이기와 낱말 따라 쓰기, 중은 고르기·분류에 문장 덧쓰기와 빈칸 채우기를 더한다. */
export type PictureLevel = 'low' | 'middle';

/**
 * 수준마다 기본 구성의 판.
 * 저장해 둔 편집본의 `template`이 그 수준의 값과 다르면 옛 구성이므로 그 수준만 새 구성으로 갈아 끼운다.
 * 한 수준의 구성을 새로 짜면 그 수준의 값만 올린다.
 *  - 하: v1 고르기와 맞아요·아니에요 분류 → v2 흐린 그림에 붙이기(무오류) → v3 따라 쓰기 둘째 줄도 연한 글자로 덧쓰기.
 *  - 중: v1 고르기와 맞아요·아니에요 분류 → v2 낱말 단서 붙이기(앞장의 고르기와 덧쓰기는 그대로).
 */
export const PICTURE_TEMPLATES: Record<PictureLevel, string> = { low: 'picture-v3', middle: 'picture-v2' };

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

const LOW_PASTE_HINT = '흐린 그림과 같은 카드를 붙여요';
const LOW_ORDER_HINT = '흐린 그림 위에 순서대로 붙여요';
const MID_PASTE_HINT = '흐린 낱말을 덧쓰고, 같은 낱말의 카드를 붙여요';
const MID_ORDER_HINT = '흐린 낱말을 덧쓰고, 순서에 맞게 붙여요';
const FREE_HINT = '마음에 드는 그림 한 장을 붙여요';

/** 붙이기 카드: 알맞다·아니다를 가르지 않으므로 정답 표시(`suitable`·`zone`)를 떼고 그림과 읽어 줄 말만 남긴다. */
function plainCard(card: WorksheetCard, slotLabel?: string): WorksheetCard {
  const plain: WorksheetCard = { id: card.id, label: card.label, src: card.src, emoji: card.emoji, printed: card.printed, say: card.say };
  return slotLabel ? { ...plain, slotLabel } : plain;
}

/**
 * 물음 문장(‘…했어요. 어떻게 할까요?’)에서 물음을 떼고 상황만 남긴다.
 * 붙이기에는 물을 것이 없다(붙일 카드가 흐린 자리로 이미 정해져 있다). 상황 글은 읽어 주는 사람을 위해 장면 곁에 작게 둔다.
 */
export function situationNote(text: string): string {
  const sentences = text.match(/[^.?!]+[.?!]+/g) ?? [text];
  return sentences.filter(sentence => !sentence.trim().endsWith('?')).join('').trim();
}

/**
 * 뒷장에 붙일 알맞은 카드. 칸이 정해진 목록(순서·분류)은 칸 순서대로 모든 카드를 자리 이름과 함께, ○·✕ 목록은 ○에 들어갈
 * 카드만 올린다. 알맞지 않은 카드는 어느 수준에도 올리지 않는다. 비어 있으면 정해진 답이 없는 열린 선택이다.
 */
function pasteCardsOf(spec: PictureWorksheetSpec, moduleId: ModuleId, transferAll: readonly WorksheetCard[]): WorksheetCard[] {
  if (spec.transfer.zones) {
    return zonesFor(spec.transfer, moduleId, true).flatMap(zone => {
      const card = transferAll.find(item => item.zone === zone.id);
      return card ? [plainCard(card, zone.label)] : [];
    });
  }
  return transferAll.filter(card => card.zone === YES_ZONE.id).map(card => plainCard(card));
}

const isOrdered = (cards: readonly WorksheetCard[]): boolean => cards.some(card => card.slotLabel && /^[①②③④⑤]/.test(card.slotLabel));

/**
 * 하 수준 두 장 — 무오류 학습이 바탕이다. 틀릴 수 있는 활동(고르기, 맞아요·아니에요 분류)을 두지 않는다.
 *  - 1. 붙여요: 첫 생각의 알맞은 카드만 오려, 장면 옆의 같은 그림(흐린 자리) 위에 붙인다.
 *  - 2. 따라 써요: 핵심 낱말을 큰 글자 위에 덧쓴다. 둘째 줄도 같은 글자를 더 연하게 보여 주어 비워 둔 줄이 없다.
 *  - 3. 붙여요: 적용 상황의 알맞은 카드만 오려 흐린 자리 위에 붙인다. 순서·분류 차시는 카드마다 자리 이름이 붙는다.
 * 오릴 카드는 붙일 카드뿐이고 알맞지 않은 카드는 어디에도 올리지 않는다. 정해진 답이 없는 열린 선택은 어느 카드를
 * 붙여도 알맞으므로, 마음에 드는 한 장을 빈 자리에 붙이는 활동으로 둔다.
 */
function buildLowPages(spec: PictureWorksheetSpec, source: PictureSource): WorksheetPage[] {
  const set = getChoiceCardSet(source.lessonId);
  const firstAll = listCards(spec.first, choicesOf(source, 'first'), set, source.moduleId, 'choose');
  const transferAll = listCards(spec.transfer, choicesOf(source, 'transfer'), set, source.moduleId, 'sort');
  const wordPicture = resolvePicture(spec.wordPic, source.moduleId);

  const firstRight = firstAll.filter(card => card.suitable === true);
  const first: WorksheetBlock = firstRight.length > 0
    ? {
      id: 'low-first',
      kind: 'picture-paste',
      title: '1. 붙여요',
      text: LOW_PASTE_HINT,
      instruction: situationNote(spec.ask) || undefined,
      image: sceneFor(source, spec.scene ?? 2),
      compact: true,
      pictureCards: firstRight.map(card => plainCard(card)),
    }
    : {
      id: 'low-first',
      kind: 'picture-paste',
      title: '1. 붙여요',
      text: FREE_HINT,
      instruction: spec.ask,
      image: sceneFor(source, spec.scene ?? 2),
      blankSlots: 1,
      compact: true,
      pictureCards: firstAll.map(card => plainCard(card)),
    };

  const trace: WorksheetBlock = {
    id: 'low-trace',
    kind: 'word-trace',
    title: '2. 따라 써요',
    text: '연한 글자를 따라 써요',
    traceText: spec.word,
    traceRepeat: true,
    lineCount: 2,
    pictureCards: [{ id: 'word', ...wordPicture, label: spec.word }],
  };

  const secondCards = pasteCardsOf(spec, source.moduleId, transferAll);
  const second: WorksheetBlock = secondCards.length > 0
    ? {
      id: 'low-second',
      kind: 'picture-paste',
      title: '3. 붙여요',
      text: isOrdered(secondCards) ? LOW_ORDER_HINT : LOW_PASTE_HINT,
      instruction: situationNote(spec.situation) || undefined,
      image: transferScene(source),
      pictureCards: secondCards,
    }
    : {
      id: 'low-second',
      kind: 'picture-paste',
      title: '3. 붙여요',
      text: FREE_HINT,
      instruction: spec.situation,
      image: transferScene(source),
      blankSlots: 1,
      pictureCards: transferAll.map(card => plainCard(card)),
    };

  return [
    { id: 'low-page-1', blocks: [first, trace] },
    { id: 'low-page-2', blocks: [second] },
  ];
}

/**
 * 그림 카드 학습지 두 장. 구성이 없는 차시는 undefined.
 *
 * 하는 무오류 붙이기(buildLowPages)다. 중은 하의 한 단계 위로, 본보기를 그림에서 글자로 바꾸고 판단을 앞장에 둔다.
 *  - 1. 골라요: 첫 생각 선택지 세 장 가운데 알맞은 카드에 ○ 한다(정해진 답이 없으면 마음에 드는 카드).
 *  - 2. 덧써요: 핵심 문장을 따라 쓰고(첫 줄), 둘째 줄에서는 그 문장의 핵심 낱말만 빈칸으로 둔 채 직접 쓴다.
 *    그림 카드의 낱말이 쓸 낱말의 본보기다.
 *  - 3. 붙여요: 적용 상황의 알맞은 카드만 오려 붙인다. 자리마다 카드에 쓰인 낱말이 연한 글자로 있어 덧쓰고, 같은 낱말의
 *    카드를 찾아 붙인다(오릴 카드는 순서가 섞여 있다). ○ 맞아요 / ✕ 아니에요 분류는 없다 — 그림이 추상적이고 물음에 정보가
 *    적어 글을 읽어도 가르기 어려웠다.
 */
export function buildPicturePages(level: PictureLevel, source: PictureSource): WorksheetPage[] | undefined {
  const spec: PictureWorksheetSpec | undefined = PICTURE_WORKSHEET_SPECS[source.lessonId];
  if (!spec) return undefined;
  if (level === 'low') return buildLowPages(spec, source);
  const set = getChoiceCardSet(source.lessonId);
  const seed = hash(source.lessonId);

  const chooseCards = rotate(listCards(spec.first, choicesOf(source, 'first'), set, source.moduleId, 'choose'), seed % 3);
  const transferAll = listCards(spec.transfer, choicesOf(source, 'transfer'), set, source.moduleId, 'sort');
  const wordPicture = resolvePicture(spec.wordPic, source.moduleId);

  const choose: WorksheetBlock = {
    id: 'mid-choose',
    kind: 'picture-choice',
    title: '1. 골라요',
    text: chooseHint(chooseCards.filter(card => card.suitable).length),
    instruction: spec.ask,
    image: sceneFor(source, spec.scene ?? 2),
    pictureCards: chooseCards,
  };
  const trace: WorksheetBlock = {
    id: 'mid-trace',
    kind: 'word-trace',
    title: '2. 덧써요',
    text: '연한 글자를 따라 쓰고, 빈칸에 낱말을 써요',
    traceText: spec.sentence,
    traceBlank: spec.word,
    lineCount: 2,
    pictureCards: [{ id: 'word', ...wordPicture, label: spec.word }],
  };
  const secondCards = pasteCardsOf(spec, source.moduleId, transferAll);
  const second: WorksheetBlock = secondCards.length > 0
    ? {
      id: 'mid-second',
      kind: 'picture-paste',
      title: '3. 붙여요',
      text: isOrdered(secondCards) ? MID_ORDER_HINT : MID_PASTE_HINT,
      instruction: situationNote(spec.situation) || undefined,
      image: transferScene(source),
      pasteCue: 'word',
      pictureCards: secondCards,
    }
    : {
      id: 'mid-second',
      kind: 'picture-paste',
      title: '3. 붙여요',
      text: FREE_HINT,
      instruction: spec.situation,
      image: transferScene(source),
      blankSlots: 1,
      pictureCards: transferAll.map(card => plainCard(card)),
    };
  return [
    { id: 'mid-page-1', blocks: [choose, trace] },
    { id: 'mid-page-2', blocks: [second] },
  ];
}
