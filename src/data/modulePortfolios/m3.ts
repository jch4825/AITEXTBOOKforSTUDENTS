import type { ModulePortfolioDefinition } from './types';

export const M3_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm3-l11',
  moduleId: 'm3',
  crumb: '3단원 · AI와 공부하기',
  kicker: '3단원 성장 포트폴리오',
  title: 'AI와 함께 배우고 확인해요',
  description: '질문을 고치고, 이야기를 함께 만들고, 그림 설명을 사실과 비교한 과정을 돌아봐요.',
  studioLessonIds: ['m3-l1', 'm3-l5', 'm3-l9'],
  nextChoices: [
    { id: 'clarify-question', emoji: '❓', label: '질문에 필요한 단서를 더할 거예요.' },
    { id: 'shape-idea', emoji: '✏️', label: 'AI 제안을 내 생각에 맞게 고칠 거예요.' },
    { id: 'check-evidence', emoji: '🔎', label: '그림과 설명을 직접 비교할 거예요.' },
  ],
};
