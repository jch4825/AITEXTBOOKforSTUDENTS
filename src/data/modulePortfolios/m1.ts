import type { ModulePortfolioDefinition } from './types';

export const M1_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm1-l11',
  moduleId: 'm1',
  crumb: '1단원 · AI를 찾아보고 판단하기',
  kicker: '1단원 성장 포트폴리오',
  title: 'AI를 근거로 판단합니다',
  description: '생활 속 AI를 찾고, AI가 보고 듣는 결과를 확인하고, 맡길 일을 판단한 과정을 돌아봅니다.',
  studioLessonIds: ['m1-l1', 'm1-l4', 'm1-l10'],
  nextChoices: [
    { id: 'look-for-clue', emoji: '🔎', label: 'AI라고 생각한 근거를 찾아볼 것입니다.' },
    { id: 'check-result', emoji: '✅', label: 'AI가 본 것과 실제 장면을 비교할 것입니다.' },
    { id: 'ask-person', emoji: '🙋', label: '중요한 일은 사람과 함께 확인할 것입니다.' },
  ],
};
