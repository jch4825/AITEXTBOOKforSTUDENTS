import type { StudioDefinition } from '../../features/studio/types';

export const STUDIO_SUPPORT_PROFILES = {
  full: {
    visibleFactCount: 2,
    choiceLimit: 2,
    hint: '중요한 정보 두 가지부터 함께 찾아봐요.',
    aiRoleDepth: 'direct',
  },
  light: {
    visibleFactCount: 3,
    choiceLimit: 3,
    hint: '달라진 조건을 보고 내 방법을 다시 살펴봐요.',
    aiRoleDepth: 'prompting',
  },
  challenge: {
    visibleFactCount: 4,
    hint: 'AI 의견의 장점과 한계를 비교해 내 판단을 설명해 봐요.',
    aiRoleDepth: 'counterpoint',
  },
} satisfies StudioDefinition['supportProfiles'];

export const STUDIO_EXPRESSION_MODES = ['choice', 'aac', 'text', 'speech', 'draw'] as const;
