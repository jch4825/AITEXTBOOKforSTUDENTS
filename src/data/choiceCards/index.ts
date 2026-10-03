import type { LessonId, ModuleId } from '../../types';
import { publicAssetUrl } from '../../utils/publicAssetUrl';
import { moduleIdFromLessonId } from '../modules';
import { M1_AAC_CARDS } from './m1';
import { M2_AAC_CARDS } from './m2';
import { M3_AAC_CARDS } from './m3';
import { M4_AAC_CARDS } from './m4';
import { M5_AAC_CARDS } from './m5';
import { M6_AAC_CARDS } from './m6';
import type { AacModuleCards, ChoiceCardSet } from './types';

export type { AacCard, AacLessonCards, AacModuleCards, ChoiceCardSet } from './types';

/**
 * 선택지를 그림 카드로 그린 모음 — 62개 스튜디오(첫 생각·적용)와 6개 단원 마무리(다음 방법).
 * 글을 못 읽는 학생이 그림과 듣기로 답하는 '그림 카드' 방식이 쓴다(읽기 지원 2단계).
 * 선택지를 더하거나 고치면 여기도 한 장 더하거나 고친다. `npm run check:choice-cards`가 빠짐을 막는다.
 */
export const ALL_CHOICE_CARDS: AacModuleCards = {
  ...M1_AAC_CARDS,
  ...M2_AAC_CARDS,
  ...M3_AAC_CARDS,
  ...M4_AAC_CARDS,
  ...M5_AAC_CARDS,
  ...M6_AAC_CARDS,
};

/** 그 차시의 선택지 카드. 카드가 없는 차시는 undefined — 그러면 '그림 카드' 방식을 보이지 않는다. */
export function getChoiceCardSet(lessonId: LessonId | string | null | undefined): ChoiceCardSet | undefined {
  if (!lessonId) return undefined;
  const cards = ALL_CHOICE_CARDS[lessonId];
  const moduleId = moduleIdFromLessonId(lessonId);
  return cards && moduleId ? { moduleId, cards } : undefined;
}

/** 카드 그림(그림 + 인쇄 글자)의 주소. */
export function choiceCardImageSrc(moduleId: ModuleId, cardId: string): string {
  return publicAssetUrl(`/lessons/pecs/${moduleId}/${cardId}.webp`);
}

const prefetched = new Set<string>();

/**
 * 카드 그림은 한 장에 300KB 안팎이다. 그림 카드 방식에 닿아서야 받으면 느린 교실 망에서 카드가
 * 한참 빈 채로 있으므로, 이 방식을 켠 교실에서는 차시를 열 때 그 차시의 그림을 미리 받아 둔다.
 */
export function prefetchChoiceCards(set: ChoiceCardSet | undefined): void {
  if (!set || typeof Image === 'undefined') return;
  for (const card of Object.values(set.cards)) {
    if (!card.cardId) continue;
    const src = choiceCardImageSrc(set.moduleId, card.cardId);
    if (prefetched.has(src)) continue;
    prefetched.add(src);
    const image = new Image();
    image.src = src;
  }
}
