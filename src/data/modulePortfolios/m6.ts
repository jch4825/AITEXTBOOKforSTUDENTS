import type { ModulePortfolioDefinition } from './types';

export const M6_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm6-l12',
  moduleId: 'm6',
  crumb: '6단원 · AI와 생활하기',
  kicker: '6단원 성장 포트폴리오',
  title: '생활의 조건을 살피고 내가 결정합니다',
  description: '장보기, 교통, 자기소개에서 달라진 조건을 확인하고 AI 의견을 내 생활에 맞게 조정한 과정을 돌아봅니다.',
  studioLessonIds: ['m6-l1', 'm6-l4', 'm6-l11'],
  nextChoices: [
    { id: 'check-conditions', emoji: '✅', label: '돈·시간·장소·안전 조건을 먼저 확인할 것입니다.' },
    { id: 'ask-people', emoji: '🙋', label: '중요한 생활 판단은 사람과 공식 정보에 확인할 것입니다.' },
    { id: 'limit-private-info', emoji: '🛡️', label: '상대에 맞게 개인정보의 범위를 정할 것입니다.' },
  ],
};
