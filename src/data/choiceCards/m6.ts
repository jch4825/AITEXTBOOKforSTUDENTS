import { pecsCard as c, type AacModuleCards } from './types';

/**
 * 6단원 그림 카드. 선택지(`data/studios/m6/`) 하나에 카드 하나.
 * `c('...')`는 그림 카드 판의 카드이고, 나머지는 이모지 카드다.
 */
export const M6_AAC_CARDS: AacModuleCards = {
  'm6-l1': {
    'buy-ai-list': c('use_as_is'),
    'revise-shopping-list': c('fix_and_use'),
    'choose-cheapest-only': { label: '싼 것만 골라요' },
    'buy-school-list': c('use_as_is'),
    'check-school-supplies': c('fix_and_use'),
    'pick-brightest-supplies': { label: '눈에 띄는 것만' },
  },
  'm6-l2': {
    'trust-ai-money': c('use_as_is'),
    'calculator-check': c('calculator'),
    'guess-round-money': { label: '비슷하게 정해요' },
    'accept-new-ai-total': c('use_as_is'),
    'verify-new-purchase': c('calculator'),
    'pay-all-budget': c('budget'),
  },
  'm6-l3': {
    'follow-ai-shortcut': { label: '지름길로 가요' },
    'use-fixed-map': c('sign'),
    'share-live-location': c('personal_info'),
    'take-clinic-backroad': { label: '뒷길로 가요' },
    'check-clinic-map': c('sign'),
    'send-private-location': c('personal_info'),
  },
  'm6-l4': {
    'board-similar-number': { label: '비슷한 버스 타요' },
    'check-route-direction': c('check_answer'),
    'follow-old-ai-route': c('use_as_is'),
    'take-any-platform': { label: '가까운 곳으로' },
    'ask-station-staff': c('ask_question'),
    'guess-from-crowd': { label: '사람 따라가요' },
  },
  'm6-l5': {
    'use-vague-weather': { label: '따뜻하다는 말만' },
    'official-forecast': c('weather'),
    'copy-friend-outfit': c('friend'),
    'keep-morning-plan': c('use_as_is'),
    'update-afternoon-prep': c('fix_and_use'),
    'ask-ai-without-place': { label: 'AI에게 또 물어요' },
  },
  'm6-l6': {
    'follow-ai-recipe': c('use_as_is'),
    'check-food-conditions': c('check_answer'),
    'let-ai-guess-allergy': c('allergy'),
    'use-unknown-food': { label: '모르는 재료 넣기' },
    'substitute-missing-fruit': c('tell_adult'),
    'hide-missing-fruit': { label: '있는 척 표시해요' },
  },
  'm6-l7': {
    'pack-all-activities': { label: '모두 넣어요' },
    'balanced-personal-plan': c('fix_and_use'),
    'copy-friend-schedule': c('friend'),
    'ignore-help-time': c('use_as_is'),
    'revise-help-time': c('fix_and_use'),
    'remove-all-breaks': c('remove_item'),
  },
  'm6-l8': {
    'ask-ai-diagnosis': { label: 'AI에게 계속 물어요' },
    'tell-trusted-adult': c('tell_adult'),
    'hide-discomfort': { label: '아픈 걸 숨겨요' },
    'search-disease-name': { label: '혼자 검색해요' },
    'report-dizziness': c('tell_adult'),
    'walk-alone-away': { label: '말 없이 가요' },
  },
  'm6-l9': {
    'always-say-yes-politely': { label: '다 좋다고 해요' },
    'use-own-expression': { label: '내 방법으로 말해요' },
    'leave-without-expression': { label: '말없이 떠나요' },
    'pretend-understood': { label: '아는 척해요' },
    'ask-repeat-at-stop': c('say_again'),
    'agree-with-all-directions': c('same_as_source'),
  },
  'm6-l10': {
    'trust-job-stereotype': c('use_as_is'),
    'compare-real-worker': c('worker'),
    'pick-job-by-tool': { label: '도구만 보고 정해요' },
    'repeat-ai-job-answer': c('use_as_is'),
    'prepare-next-interview': c('ask_question'),
    'predict-job-disappears': { label: '미리 정해요' },
  },
  'm6-l11': {
    'copy-ai-introduction': c('use_as_is'),
    'audience-safe-intro': c('fix_and_use'),
    'share-same-everywhere': c('personal_info'),
    'share-school-location': c('personal_info'),
    'safe-game-intro': c('refuse'),
    'let-ai-send-profile': c('use_as_is'),
  },
  'm6-l12': {
    'verify-life-info': c('check_answer'),
    'human-first-safety': c('tell_adult'),
    'own-choice-and-boundary': c('human_decides'),
  },
};
