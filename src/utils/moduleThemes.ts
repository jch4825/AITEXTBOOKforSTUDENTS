import type { ModuleId } from '../types';

export interface ModuleTheme {
  accent: string;        // 강조색 — 큰 제목(18px+)·테두리 전용. 3:1 이상.
  accentText: string;    // 어두운 변형 — 14px 이하 소형 텍스트 전용. 4.5:1 이상 (WCAG AA).
  secondary: string;     // 보조색 — 장식·배지·도형 전용. 작은 본문 글자에는 사용하지 않는다.
  accentSoft: string;    // 배경 강조 — 종이 톤에 맞춘 솔리드 파스텔 면색 (토큰 v2 §3.1)
  emoji: string;         // 차시 아이콘 fallback
}

export const MODULE_THEMES: Record<ModuleId, ModuleTheme> = {
  m1: { accent: '#5D4C8A', accentText: '#5D4C8A', secondary: '#E07A65', accentSoft: '#EEEAF6', emoji: '🌱' },
  m2: { accent: '#A44943', accentText: '#A44943', secondary: '#526FA7', accentSoft: '#F8E8E5', emoji: '💬' },
  m3: { accent: '#416AA8', accentText: '#416AA8', secondary: '#D6A347', accentSoft: '#E8EEF7', emoji: '📚' },
  m4: { accent: '#93601E', accentText: '#93601E', secondary: '#46586C', accentSoft: '#F5EAD9', emoji: '🛡️' },
  m5: { accent: '#2F7773', accentText: '#2F7773', secondary: '#E58A6B', accentSoft: '#E3F0EE', emoji: '🧩' },
  m6: { accent: '#76516F', accentText: '#76516F', secondary: '#6C9986', accentSoft: '#EFE7ED', emoji: '🏠' },
};

export function themeFor(moduleId: ModuleId): ModuleTheme {
  return MODULE_THEMES[moduleId];
}
