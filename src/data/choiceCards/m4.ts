import { pecsCard as c, type AacModuleCards } from './types';

/**
 * 4단원 그림 카드. 선택지(`data/studios/m4/`) 하나에 카드 하나.
 * `c('...')`는 그림 카드 판의 카드이고, 나머지는 이모지 카드다.
 */
export const M4_AAC_CARDS: AacModuleCards = {
  'm4-l1': {
    'trust-tone': c('use_as_is'),
    'check-official': c('check_answer'),
    'ask-ai-again': { label: 'AI에게 또 물어요' },
    'follow-old-room': c('use_as_is'),
    'check-latest-board': c('check_answer'),
    'ask-same-answer': { label: 'AI에게 또 물어요' },
  },
  'm4-l2': {
    'anonymous-capture': { label: '출처 모를 캡처' },
    'latest-official': { label: '오늘 공식 공지' },
    'old-official': { label: '지난달 공지' },
    'realistic-photo': { label: '진짜 같은 사진' },
    'friend-message': { label: '친구 메시지' },
    'today-teacher': { label: '오늘 선생님 공지' },
    'yesterday-class': { label: '어제 반 공지' },
  },
  'm4-l3': {
    'hide-name-only': { label: '이름만 가려요' },
    'hide-identifiers': c('cover_up'),
    'hide-task': { label: '조건을 가려요' },
    'share-all-details': { label: '모두 공개해요' },
    'keep-item-details': { label: '물건 특징만 남겨요' },
    'remove-purpose': { label: '모두 지워요' },
  },
  'm4-l4': {
    'send-code': { label: '코드를 보내요' },
    'refuse-tell': c('tell_adult'),
    'ask-more': { label: '계속 물어봐요' },
    'open-message-link': { label: '링크를 열어요' },
    'official-route': c('tell_adult'),
    'send-old-password': c('password'),
  },
  'm4-l5': {
    'send-as-is': c('use_as_is'),
    'crop-redact': c('cover_up'),
    'wait-consent': { label: '동의부터 확인해요' },
    'safe-by-subject': c('use_as_is'),
    'check-reflection': c('cover_up'),
    'share-more': c('place'),
  },
  'm4-l6': {
    'read-again': { label: '끝까지 다시 봐요' },
    'stop-and-tell': c('stop_now'),
    'handle-alone': { label: '혼자 해결해요' },
    'watch-to-explain': { label: '끝까지 봐요' },
    'stop-distance-tell': c('stop_now'),
    'reopen-alone': { label: '혼자 다시 열어요' },
  },
  'm4-l7': {
    'polite-only': { label: '공손한 말만' },
    'clear-structure': c('be_specific'),
    'stronger-order': { label: '세게 말해요' },
    'rough-friend': { label: '거칠게 말해요' },
    'clear-friend': c('be_specific'),
    'no-action': { label: '부탁만 해요' },
  },
  'm4-l8': {
    'one-number': c('time'),
    'signal-action': c('stop_now'),
    'willpower-only': { label: '참겠다고만 해요' },
    'ignore-change': c('use_as_is'),
    'adjust-plan': c('fix_and_use'),
    'no-plan': { label: '계속 사용해요' },
  },
  'm4-l9': {
    'accept-gift': { label: '선물만 받아요' },
    'stop-block-tell': c('tell_adult'),
    'test-account': { label: '대화를 계속해요' },
    'send-photo': c('photo'),
    'refuse-and-alert': c('tell_adult'),
    'keep-chatting': { label: '계속 물어봐요' },
  },
  'm4-l10': {
    'buy-now': { label: '바로 사요' },
    'inspect-compare': c('check_answer'),
    'reject-all-ads': c('dont_use'),
    'buy-because-favorite': { label: '바로 사요' },
    'find-ad-clues': c('check_answer'),
    'believe-guarantee': { label: '광고를 믿어요' },
  },
  'm4-l11': {
    'verify-official': c('original_source'),
    'protect-before-send': c('cover_up'),
    'stop-and-ask': c('tell_adult'),
  },
};
