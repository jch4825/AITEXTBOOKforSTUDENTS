import type { ModuleId } from '../types';

export interface ModuleTheme {
  accent: string;        // 본문 강조색 (text/border)
  accentSoft: string;    // 배경 강조 (옅게)
  emoji: string;         // 차시 아이콘 fallback
}

export const MODULE_THEMES: Record<ModuleId, ModuleTheme> = {
  m1: { accent: '#5A7DA0', accentSoft: 'rgba(90,125,160,0.12)', emoji: '🌱' },
  m2: { accent: '#7560A0', accentSoft: 'rgba(117,96,160,0.12)', emoji: '💬' },
  m3: { accent: '#4F9E8B', accentSoft: 'rgba(79,158,139,0.12)', emoji: '📚' },
  m4: { accent: '#B07A4F', accentSoft: 'rgba(176,122,79,0.12)', emoji: '🛡️' },
  m5: { accent: '#9A6CA0', accentSoft: 'rgba(154,108,160,0.12)', emoji: '🧩' },
  m6: { accent: '#5A9A6E', accentSoft: 'rgba(90,154,110,0.12)', emoji: '🏠' },
};

export function themeFor(moduleId: ModuleId): ModuleTheme {
  return MODULE_THEMES[moduleId];
}
