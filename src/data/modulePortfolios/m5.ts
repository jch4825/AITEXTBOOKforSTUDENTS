import type { ModulePortfolioDefinition } from './types';

export const M5_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm5-l12',
  moduleId: 'm5',
  crumb: '5단원 · 나는 문제 해결사!',
  kicker: '5단원 마무리 포트폴리오',
  title: '나는 문제 해결사!',
  description: '세 장면에서 처음 생각하고, AI와 비교하고, 조건에 맞게 판단한 과정을 돌아봐요.',
  studioLessonIds: ['m5-l1', 'm5-l6', 'm5-l11'],
  nextChoices: [
    { id: 'find-info', emoji: '🔎', label: '중요한 정보를 먼저 찾아볼 거예요.' },
    { id: 'ask-ai', emoji: '💬', label: 'AI에게 다른 방법이나 확인 질문을 부탁할 거예요.' },
    { id: 'adjust', emoji: '🔄', label: '조건이 달라지면 계획을 다시 살펴볼 거예요.' },
  ],
};
