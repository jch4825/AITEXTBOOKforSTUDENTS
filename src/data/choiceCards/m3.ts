import { pecsCard as c, type AacModuleCards } from './types';

/**
 * 3단원 그림 카드. 선택지(`data/studios/m3/`) 하나에 카드 하나.
 * `c('...')`는 그림 카드 판의 카드이고, 나머지는 이모지 카드다.
 */
export const M3_AAC_CARDS: AacModuleCards = {
  'm3-l1': {
    'repeat-yes-no': { label: '맞냐고 또 물어요' },
    'open-why': c('ask_why'),
    'specific-flight': { label: '못 나는 까닭' },
    'habitat-yes-no': { label: '맞냐고 또 물어요' },
    'habitat-meaning': { label: '뜻을 물어봐요' },
    'habitat-example': { label: '예시로 물어봐요' },
  },
  'm3-l2': {
    'only-animals': { label: '동물이 모인 곳' },
    'living-and-environment': { label: '생물과 환경이 함께' },
    'exhibition-tool': { label: '전시 관찰 도구' },
    'guess-context': { label: '그림으로 짐작해요' },
    'compare-dictionary': c('dictionary'),
    'own-example': c('example_sentence'),
  },
  'm3-l3': {
    'sun-only': { label: '햇빛만 남겨요' },
    'materials-result': c('keep_facts'),
    'green-color': { label: '초록색만 남겨요' },
    'keep-cycle': c('keep_facts'),
    'rain-only': { label: '결과만 남겨요' },
    'check-diagram': c('original_source'),
  },
  'm3-l4': {
    'clear-photo': { label: '또렷한 사진' },
    'blur-photo': { label: '흐린 사진' },
    'quiet-hall': { label: '조용한 복도' },
    'library': { label: '도서관 장면' },
    'sports-day': { label: '운동회 장면' },
    'own-context': c('example_sentence'),
  },
  'm3-l5': {
    'find-umbrella': { label: '우산을 찾아요' },
    'mystery-map': { label: '신기한 지도' },
    'own-ending': { label: '내 결말 만들기' },
    'joyful-version': { label: '즐거운 이야기' },
    'curious-version': { label: '궁금한 이야기' },
    'quiet-version': { label: '조용한 이야기' },
  },
  'm3-l6': {
    'under-4000': { label: '4,000원보다 작아요' },
    'around-6000': { label: '6,000원보다 조금 커요' },
    'over-10000': { label: '10,000원보다 커요' },
    'estimate-change': c('think_first'),
    'calculator-change': c('calculator'),
    'compare-receipt': c('original_source'),
  },
  'm3-l7': {
    'place': { label: '장소를 남겨요' },
    'activity': { label: '체험을 남겨요' },
    'arrival': c('time'),
    'decoration': { label: '장식 색을 남겨요' },
    'mark-required': c('keep_facts'),
    'compare-source': c('evidence'),
    'restore-missing': { label: '빠진 것 넣어요' },
  },
  'm3-l8': {
    'answer-first': c('answer_key'),
    'respond-first': c('think_first'),
    'only-score': { label: '점수만 봐요' },
    'hide-answer': c('think_first'),
    'explain-reason': c('own_words'),
    'retry': { label: '다시 풀어요' },
  },
  'm3-l9': {
    'fact': c('fact'),
    'inference': c('guess'),
    'unknown': c('unknown'),
    'visible-facts': c('fact'),
    'avoid-feeling': c('guess'),
    'ask-context': c('check_answer'),
  },
  'm3-l10': {
    'word-card-recall': { label: '낱말 뜻 말하기' },
    'calculation-recall': c('calculator'),
    'summary-recall': c('summarize'),
    'story-recall': { label: '이야기 떠올리기' },
    'recall-first': c('think_first'),
    'check-source': c('original_source'),
    'explain-own-words': c('own_words'),
  },
  'm3-l11': {
    'think-first': c('think_first'),
    'check-source': c('check_answer'),
    'own-expression': c('own_words'),
  },
};
