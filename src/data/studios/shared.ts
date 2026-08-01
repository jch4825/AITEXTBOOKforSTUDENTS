import type { StudioDefinition, SupportLevel, VisualNovelCopy } from '../../features/studio/types';

export const STUDIO_SUPPORT_PROFILES = {
  full: {
    visibleFactCount: 2,
    choiceLimit: 2,
    hint: '중요한 정보 두 가지부터 함께 찾아봅니다.',
    aiRoleDepth: 'direct',
  },
  light: {
    visibleFactCount: 3,
    choiceLimit: 3,
    hint: '달라진 조건을 보고 내 방법을 다시 살펴봅니다.',
    aiRoleDepth: 'prompting',
  },
  challenge: {
    visibleFactCount: 4,
    choiceLimit: 4,
    hint: 'AI 의견에서 좋은 점과 조심할 점을 찾아 내 생각을 말해 보십시오.',
    aiRoleDepth: 'counterpoint',
  },
} satisfies StudioDefinition['supportProfiles'];

export const STUDIO_EXPRESSION_MODES = ['choice', 'text', 'speech', 'draw'] as const;

// 장면 텍스트를 지원 수준별 사본으로 만드는 공용 헬퍼. 분할 전에는 각 모듈 파일에 중복 정의되어 있었다.
export function sceneCopy(
  full: string,
  light: string,
  challenge: string,
  perspective?: string,
): Record<SupportLevel, VisualNovelCopy> {
  return {
    full: { text: full, perspective },
    light: { text: light, perspective },
    challenge: { text: challenge, perspective },
  };
}
