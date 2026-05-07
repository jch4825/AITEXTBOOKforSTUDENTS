// 모듈별 컬러 테마. Tutorial 화면 / QuickTools 메달 등 여러 곳에서 재사용.

export interface ModuleTheme {
  accent: string;
  accentSoft: string;
  gradient: string;
  emoji: string;
  glowA: string;
  glowB: string;
}

export const MODULE_THEMES: Record<string, ModuleTheme> = {
  m0: { accent: '#2563eb', accentSoft: 'rgba(37,99,235,0.12)', gradient: 'from-blue-500/25 via-cyan-500/10 to-transparent', emoji: '🌐', glowA: 'rgba(37,99,235,0.20)', glowB: 'rgba(0,196,204,0.12)' },
  m1: { accent: '#8b3dff', accentSoft: 'rgba(139,61,255,0.12)', gradient: 'from-violet-500/25 via-fuchsia-500/10 to-transparent', emoji: '🧠', glowA: 'rgba(139,61,255,0.18)', glowB: 'rgba(0,196,204,0.10)' },
  m2: { accent: '#00c4cc', accentSoft: 'rgba(0,196,204,0.12)', gradient: 'from-cyan-500/25 via-teal-500/10 to-transparent', emoji: '✍️', glowA: 'rgba(0,196,204,0.20)', glowB: 'rgba(139,61,255,0.10)' },
  m3: { accent: '#f59e0b', accentSoft: 'rgba(245,158,11,0.12)', gradient: 'from-amber-500/25 via-orange-500/10 to-transparent', emoji: '🎓', glowA: 'rgba(245,158,11,0.20)', glowB: 'rgba(236,72,153,0.10)' },
  m4: { accent: '#ec4899', accentSoft: 'rgba(236,72,153,0.12)', gradient: 'from-rose-500/25 via-pink-500/10 to-transparent', emoji: '🏫', glowA: 'rgba(236,72,153,0.20)', glowB: 'rgba(139,61,255,0.10)' },
  m5: { accent: '#10b981', accentSoft: 'rgba(16,185,129,0.12)', gradient: 'from-emerald-500/25 via-green-500/10 to-transparent', emoji: '⚖️', glowA: 'rgba(16,185,129,0.20)', glowB: 'rgba(0,196,204,0.10)' },
};

export const getTheme = (moduleId: string): ModuleTheme =>
  MODULE_THEMES[moduleId] || MODULE_THEMES.m1;

/** 레슨 ID(예: 'l3-2')에서 모듈 ID(예: 'm3')를 뽑아낸다 */
export const moduleIdFromLesson = (lessonId: string): string => {
  const match = lessonId.match(/^l(\d+)/);
  return match ? `m${match[1]}` : 'm1';
};
