import type { Difficulty } from '../../types';
import type { SupportLevel } from './types';

export const SUPPORT_LABELS: Record<SupportLevel, string> = {
  full: '충분한 지원',
  light: '보통',
  challenge: '도전적',
};

export const DIFFICULTY_TO_SUPPORT: Record<Difficulty, SupportLevel> = {
  easy: 'full',
  normal: 'light',
  hard: 'challenge',
};

export const SUPPORT_TO_DIFFICULTY: Record<SupportLevel, Difficulty> = {
  full: 'easy',
  light: 'normal',
  challenge: 'hard',
};
