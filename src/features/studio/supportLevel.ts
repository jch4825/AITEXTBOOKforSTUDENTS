import type { Difficulty } from '../../types';
import type { SupportLevel } from './types';

/**
 * 지원 수준은 학년군 운영 축을 겸한다.
 * 같은 68차시를 중·고가 공통으로 쓰되, 중학교는 `중학`, 고등학교는 `고등` 수준으로
 * 운영하여 9학년군과 12학년군 성취기준을 각각 평가한다(src/data/aiAchievementLevels.ts).
 * `충분한 지원`은 두 학년군 모두에서 필요한 학생에게 쓰는 하위 지원 단계다.
 */
export const SUPPORT_LABELS: Record<SupportLevel, string> = {
  full: '충분한 지원',
  light: '중학',
  challenge: '고등',
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
