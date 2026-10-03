import type { ModuleId } from '../../types';
import { PECS_LABELS } from '../pecs';

/**
 * 선택지 하나를 그림 카드(AAC)로 나타낸 것.
 *
 * 학생이 카드를 고르는 일은 그 선택지를 고르는 일과 같다(기록되는 것은 선택지 id 하나다).
 * 카드는 선택지 문장을 줄여 보여 주는 상징이므로, 평가가 아니라 **학생이 고르는 행동**을 나타낸다.
 * "AI 길로 가요"는 되지만 "위험해요"는 안 된다 — 학생은 위험하다고 말하려고 카드를 집지 않는다.
 *
 * 같은 행동에는 단원이 달라도 같은 그림 카드를 쓴다("그대로 쓰기"는 어디서나 AI 말을 확인 없이 받는 것).
 * 학생이 그림과 뜻을 한 번 익히면 다른 차시에서도 읽지 않고 알아보게 하려는 것이다.
 */
export interface AacCard {
  /**
   * 카드에 쓰는 짧은 말(공백을 빼고 열두 글자 이내, 세 어절 이내). 해요체나 명사형으로 쓴다.
   * `cardId`가 있으면 카드 그림에 인쇄된 글자(PECS_LABELS)와 같아야 한다.
   */
  label: string;
  /** 그 단원 그림 카드 판(`public/lessons/pecs/{단원}/`)의 카드 이름. 없으면 이모지로 그린다. */
  cardId?: string;
  /** 이모지 카드의 그림. 없으면 선택지의 emoji를 쓴다. 선택지의 이모지가 뜻을 흐릴 때만 바꾼다. */
  emoji?: string;
}

/** 선택지 id → 카드. */
export type AacLessonCards = Record<string, AacCard>;

/** 차시 id → 그 차시의 카드. */
export type AacModuleCards = Record<string, AacLessonCards>;

/** 한 차시의 카드와, 그 카드 그림이 들어 있는 단원. */
export interface ChoiceCardSet {
  moduleId: ModuleId;
  cards: AacLessonCards;
}

/**
 * 그림 카드 판의 카드를 쓴다. 글자는 카드에 인쇄된 낱말(PECS_LABELS)에서 가져와
 * 인쇄된 글자와 화면 글자가 어긋나지 않게 한다.
 */
export function pecsCard(cardId: string): AacCard {
  return { label: PECS_LABELS[cardId] ?? cardId, cardId };
}
