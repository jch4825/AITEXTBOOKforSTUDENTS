import type { ModuleId } from '../types';

export interface ModuleTheme {
  accent: string;        // 강조색 — 큰 제목(18px+)·테두리 전용. 3:1 이상.
  accentText: string;    // 어두운 변형 — 14px 이하 소형 텍스트 전용. 4.5:1 이상 (WCAG AA).
  accentSoft: string;    // 배경 강조 — 종이 톤에 맞춘 솔리드 파스텔 면색 (토큰 v2 §3.1)
  emoji: string;         // 차시 아이콘 fallback
}

export const MODULE_THEMES: Record<ModuleId, ModuleTheme> = {
  m1: { accent: '#5A7DA0', accentText: '#3D5F80', accentSoft: '#E4EAEF', emoji: '🌱' },
  m2: { accent: '#7560A0', accentText: '#57447E', accentSoft: '#E9E5F0', emoji: '💬' },
  m3: { accent: '#4F9E8B', accentText: '#2F7263', accentSoft: '#E0EDE8', emoji: '📚' },
  m4: { accent: '#B07A4F', accentText: '#8A5730', accentSoft: '#F3E7DB', emoji: '🛡️' },
  m5: { accent: '#9A6CA0', accentText: '#74487A', accentSoft: '#EFE4EE', emoji: '🧩' },
  m6: { accent: '#5A9A6E', accentText: '#3B7250', accentSoft: '#E3EEE5', emoji: '🏠' },
};

export function themeFor(moduleId: ModuleId): ModuleTheme {
  return MODULE_THEMES[moduleId];
}
