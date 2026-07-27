import type { SupportLevel } from './types';

export const SUPPORT_PROFILES: Record<SupportLevel, { label: string; description: string }> = {
  full: {
    label: '충분한 지원',
    description: '짧은 문장, 시각 힌트, AAC 및 단계별 안내를 제공합니다.',
  },
  light: {
    label: '보통',
    description: '기준 글과 고유 증거 활동을 합니다.',
  },
  challenge: {
    label: '도전적',
    description: '더 많은 증거와 예외 조건, 심도 있는 이유 표현을 다룹니다.',
  },
  easy: {
    label: '충분한 지원',
    description: '짧은 문장, 시각 힌트, AAC 및 단계별 안내를 제공합니다.',
  },
  normal: {
    label: '보통',
    description: '기준 글과 고유 증거 활동을 합니다.',
  },
  hard: {
    label: '도전적',
    description: '더 많은 증거와 예외 조건, 심도 있는 이유 표현을 다룹니다.',
  },
};

export const COMMON_EXPRESSION_MODES = ['choice', 'text', 'speech', 'draw', 'aac'] as const;

export const STANDARD_CODES = {
  SPEC_AI_01: '[2022특수-기본-AI01] 생활 속 AI 기능을 탐색하고 도구로서 활용한다.',
  SPEC_AI_02: '[2022특수-기본-AI02] AI의 정보 처리 과정과 한계를 이해한다.',
  SPEC_AI_03: '[2022특수-기본-AI03] 정보 보호와 윤리적 태도를 실천한다.',
} as const;
