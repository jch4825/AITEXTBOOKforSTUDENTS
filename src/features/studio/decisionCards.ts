import type { ModuleId } from '../../types';
import { publicAssetUrl } from '../../utils/publicAssetUrl';
import type { AiDecision } from './types';

/**
 * 판단 단계(AI 의견을 그대로 쓸지, 고칠지, 쓰지 않을지)의 단추를 그림 카드로 그릴 때 쓰는 대응.
 *
 * 세 카드는 모든 단원의 그림 카드 판에 같은 이름·같은 인쇄 글자로 들어 있다(data/pecs.ts).
 * 카드 이미지에 인쇄된 글자와 화면의 글자는 늘 같아야 하므로 화면 글자는 PECS_LABELS에서 가져온다.
 */
export const DECISION_CARD_IDS: Record<AiDecision, string> = {
  accept: 'use_as_is',
  modify: 'fix_and_use',
  reject: 'dont_use',
};

export function decisionCardSrc(moduleId: ModuleId, decision: AiDecision): string {
  return publicAssetUrl(`/lessons/pecs/${moduleId}/${DECISION_CARD_IDS[decision]}.webp`);
}

const prefetched = new Set<string>();

/**
 * 카드 그림은 한 장에 300KB 안팎이다. 판단 단계에 닿아서야 받으면 느린 교실 망에서 단추가
 * 한참 빈 채로 있으므로, 차시를 열 때 미리 받아 둔다. 같은 단원의 차시는 같은 파일을
 * 쓰므로 브라우저 캐시가 두 번째 차시부터 받아 준다.
 */
export function prefetchDecisionCards(moduleId: ModuleId): void {
  if (typeof Image === 'undefined') return;
  for (const decision of Object.keys(DECISION_CARD_IDS) as AiDecision[]) {
    const src = decisionCardSrc(moduleId, decision);
    if (prefetched.has(src)) continue;
    prefetched.add(src);
    const image = new Image();
    image.src = src;
  }
}
