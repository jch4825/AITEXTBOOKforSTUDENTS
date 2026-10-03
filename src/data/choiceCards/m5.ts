import { pecsCard as c, type AacModuleCards } from './types';

/**
 * 5단원 그림 카드. 선택지(`data/studios/m5/`) 하나에 카드 하나.
 * `c('...')`는 그림 카드 판의 카드이고, 나머지는 이모지 카드다.
 */
export const M5_AAC_CARDS: AacModuleCards = {
  'm5-l1': {
    'buy-immediately': { label: '바로 다시 사요' },
    'define-gap': { label: '현재와 목표 나눠요' },
    'cancel-event': { label: '행사를 취소해요' },
    'blame-preparer': { label: '잘못한 사람 찾기' },
    'check-missing-item': c('check_answer'),
    'stop-all-work': c('stop_now'),
  },
  'm5-l2': {
    'pick-random-order': { label: '순서부터 정해요' },
    'list-needed-tasks': c('split_steps'),
    'one-person-all': { label: '혼자 다 맡아요' },
    'start-slides-only': { label: '화면부터 만들어요' },
    'separate-presentation-tasks': c('split_steps'),
    'set-order-first': { label: '순서부터 정해요' },
  },
  'm5-l3': {
    'prettiest-first': { label: '예쁜 것부터 해요' },
    'dependencies-first': c('first_task'),
    'alphabetical': { label: '가나다순으로 해요' },
    'turn-on-first': { label: '전원부터 켜요' },
    'safe-projector-order': c('first_task'),
    'decorate-projector': { label: '장식부터 붙여요' },
  },
  'm5-l4': {
    'favorite-first': { label: '좋아하는 것부터' },
    'safety-first': { label: '안전부터 해요' },
    'random-first': { label: '아무거나 해요' },
    'keep-old-order': { label: '처음 순서대로' },
    'recheck-criteria': c('first_task'),
    'only-easy-task': { label: '쉬운 일만 해요' },
  },
  'm5-l5': {
    'complete-answer': { label: '정답을 봐요' },
    'small-hint': c('hint'),
    'start-over': { label: '처음부터 다시' },
    'show-full-order': { label: '정답을 봐요' },
    'choose-process-question': c('hint'),
    'quit-puzzle': { label: '퍼즐을 그만둬요' },
  },
  'm5-l6': {
    'add-school-address': c('personal_info'),
    'safe-location-clues': c('be_specific'),
    'blame-student': { label: '내 탓만 해요' },
    'share-home-route': c('personal_info'),
    'use-building-clues': c('be_specific'),
    'repeat-same-request': { label: '똑같이 또 말해요' },
  },
  'm5-l7': {
    'do-all-at-once': { label: '한꺼번에 해요' },
    'check-each-step': c('check_answer'),
    'skip-confusing-step': { label: '건너뛰어요' },
    'upload-all-fast': { label: '한꺼번에 올려요' },
    'upload-checkpoints': c('check_answer'),
    'skip-upload-check': { label: '확인 없이 넘어가요' },
  },
  'm5-l8': {
    'trust-finished-message': c('use_as_is'),
    'use-checklist': c('original_source'),
    'judge-by-look': { label: '보기 좋으면 돼요' },
    'ask-ai-same-total': { label: 'AI에게 또 물어요' },
    'calculator-check': { label: '계산해서 확인해요' },
    'choose-neat-number': { label: '보기 좋은 숫자' },
  },
  'm5-l9': {
    'wait-for-printer': { label: '그냥 기다려요' },
    'compare-options': c('different_way'),
    'pick-favorite-tool': { label: '좋아하는 것만' },
    'stop-all-guidance': c('stop_now'),
    'switch-non-screen': c('different_way'),
    'hide-screen-problem': { label: '알리지 않아요' },
  },
  'm5-l10': {
    'rewrite-everything': { label: '전부 새로 써요' },
    'reproduce-error': c('split_steps'),
    'assume-user-mistake': c('use_as_is'),
    'declare-fixed-once': { label: '한 번이면 돼요' },
    'test-other-user': { label: '친구가 해 봐요' },
    'remove-result-record': { label: '기록을 지워요' },
  },
  'm5-l11': {
    'continue-original-plan': c('use_as_is'),
    'stop-and-replan': c('stop_now'),
    'ask-ai-to-guess-allergy': { label: 'AI가 짐작해요' },
    'keep-plan-secretly': c('use_as_is'),
    'check-new-conditions': c('fix_and_use'),
    'ignore-time-change': { label: '시간은 상관없어요' },
  },
  'm5-l12': {
    'define-before-action': { label: '현재와 목표 나눠요' },
    'compare-and-check': c('different_way'),
    'revise-when-changed': c('fix_and_use'),
  },
};
