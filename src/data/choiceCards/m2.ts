import { pecsCard as c, type AacModuleCards } from './types';

/**
 * 2단원 그림 카드. 선택지(`data/studios/m2/`) 하나에 카드 하나.
 * `c('...')`는 그림 카드 판의 카드이고, 나머지는 이모지 카드다.
 */
export const M2_AAC_CARDS: AacModuleCards = {
  'm2-l1': {
    'repeat-vague': { label: '똑같이 또 말해요' },
    'find-missing-info': { label: '빠진 정보를 찾아요' },
    'share-private-info': c('personal_info'),
    'say-that-object': c('vague_request'),
    'describe-object': c('be_specific'),
    'share-home-address': c('personal_info'),
  },
  'm2-l2': {
    'repeat-all': c('one_sentence'),
    'start-deadline': c('deadline'),
    'start-music': { label: '음악부터 해요' },
    'travel-all-at-once': c('one_sentence'),
    'travel-order': c('split_steps'),
    'travel-no-check': { label: '확인 없이 넘어가요' },
  },
  'm2-l3': {
    'say-fun-only': c('vague_request'),
    'add-target-conditions': c('be_specific'),
    'accept-hard-game': c('use_as_is'),
    'repeat-organize-that': c('vague_request'),
    'name-note-format': c('table'),
    'add-unneeded-name': c('personal_info'),
  },
  'm2-l4': {
    'no-example': { label: '예시 없이 말해요' },
    'verified-example': c('example_request'),
    'wrong-date-example': { label: '틀린 예시를 써요' },
    'table-no-example': { label: '예시 없이 말해요' },
    'table-good-example': c('example_request'),
    'table-wrong-example': { label: '틀린 예시를 써요' },
  },
  'm2-l5': {
    'same-notice-both': { label: '똑같이 보내요' },
    'two-tones-one-fact': c('tone'),
    'expert-role-trust': { label: '말투만 믿어요' },
    'same-request-both': { label: '같은 말만 써요' },
    'adapt-request-tone': c('tone'),
    'change-request-fact': { label: '내용도 바꿔요' },
  },
  'm2-l6': {
    'ask-whole-plan-again': { label: '큰 부탁 그대로' },
    'confirm-purpose-place': c('split_steps'),
    'decorate-table-first': { label: '표 색깔부터 정해요' },
    'outing-all-at-once': { label: '한꺼번에 맡겨요' },
    'outing-stepwise': c('split_steps'),
    'outing-skip-check': { label: '확인 없이 넘어가요' },
  },
  'm2-l7': {
    'say-dislike-only': c('vague_request'),
    'lock-and-revise': c('revise_request'),
    'use-missing-notice': c('use_as_is'),
    'shorten-anything': { label: '무조건 줄여요' },
    'preserve-items': c('keep_facts'),
    'ignore-long-text': c('dont_use'),
  },
  'm2-l8': {
    'all-short-sentences': c('one_sentence'),
    'match-purpose-format': { label: '목적에 맞게 골라요' },
    'keep-long-paragraphs': c('use_as_is'),
    'schedule-long-story': { label: '긴 이야기로 써요' },
    'schedule-table': c('table'),
    'schedule-one-word': { label: '장소만 남겨요' },
  },
  'm2-l9': {
    'ask-ai-really': { label: 'AI에게 또 물어요' },
    'check-latest-official': c('original_source'),
    'trust-confident-tone': c('use_as_is'),
    'ask-ai-place-again': { label: 'AI에게 또 물어요' },
    'check-latest-place-notice': c('original_source'),
    'use-old-place-post': c('use_as_is'),
  },
  'm2-l10': {
    'choose-promo-copy': { label: '홍보 문구 만들기' },
    'choose-activity-list': { label: '준비 목록 만들기' },
    'choose-intro-script': { label: '소개 대본 만들기' },
    'transfer-one-shot': c('use_as_is'),
    'transfer-full-cycle': { label: '고치고 확인해요' },
    'transfer-repeat-only': { label: '같은 요청만 해요' },
  },
  'm2-l11': {
    'purpose-first': c('purpose'),
    'repair-with-criteria': c('revise_request'),
    'verify-before-use': c('check_answer'),
  },
};
