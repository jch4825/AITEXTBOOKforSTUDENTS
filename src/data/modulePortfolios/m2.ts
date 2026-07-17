import type { ModulePortfolioDefinition } from './types';

export const M2_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm2-l11',
  moduleId: 'm2',
  crumb: '2단원 · 내 뜻을 전하고 고쳐 묻기',
  kicker: '2단원 성장 포트폴리오',
  title: 'AI와 요청을 함께 만듭니다',
  description: '빠진 정보를 찾고, 요청을 조립하고, AI 답을 고쳐 물은 과정을 돌아봅니다.',
  studioLessonIds: ['m2-l1', 'm2-l6', 'm2-l10'],
  nextChoices: [
    { id: 'add-information', emoji: '➕', label: '필요한 정보를 한 가지씩 더할 것입니다.' },
    { id: 'show-example', emoji: '🧩', label: '원하는 답의 예시와 모양을 알려 줄 것입니다.' },
    { id: 'repair-answer', emoji: '🔄', label: '답이 다르면 고쳐 묻거나 사용하지 않을 것입니다.' },
  ],
};
