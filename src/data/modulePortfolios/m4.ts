import type { ModulePortfolioDefinition } from './types';

export const M4_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm4-l11',
  moduleId: 'm4',
  crumb: '4단원 · 안전하고 책임 있게 사용하기',
  kicker: '4단원 성장 포트폴리오',
  title: '확인하고 보호하고 도움을 요청합니다',
  description: 'AI 답의 근거를 확인하고, 사진 속 정보를 보호하고, 광고 단서를 찾은 판단 과정을 돌아봅니다.',
  studioLessonIds: ['m4-l1', 'm4-l5', 'm4-l10'],
  nextChoices: [
    { id: 'verify-source', emoji: '🔎', label: '중요한 정보는 최신 근거와 비교할 것입니다.' },
    { id: 'protect-info', emoji: '🛡️', label: '사진과 개인정보를 보내기 전에 멈출 것입니다.' },
    { id: 'ask-trusted-adult', emoji: '🙋', label: '어려우면 믿을 만한 어른에게 도움을 요청할 것입니다.' },
  ],
};
