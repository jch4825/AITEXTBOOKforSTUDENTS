export interface ModuleTheme {
  accent: string;
  accentSoft: string;
  gradient: string;
  emoji: string;
  glowA: string;
  glowB: string;
}

export const MODULE_THEMES: Record<string, ModuleTheme> = {
  m0: {
    accent: '#9A6F45',
    accentSoft: 'rgba(154,111,69,0.16)',
    gradient: 'from-stone-300/45 via-amber-100/30 to-white',
    emoji: '▣',
    glowA: 'rgba(154,111,69,0.18)',
    glowB: 'rgba(180,145,90,0.10)',
  },
  m1: {
    accent: '#4E718F',
    accentSoft: 'rgba(78,113,143,0.16)',
    gradient: 'from-blue-200/48 via-slate-100/32 to-white',
    emoji: '◇',
    glowA: 'rgba(78,113,143,0.18)',
    glowB: 'rgba(116,139,170,0.10)',
  },
  m2: {
    accent: '#7360A0',
    accentSoft: 'rgba(115,96,160,0.16)',
    gradient: 'from-violet-200/50 via-purple-100/30 to-white',
    emoji: '✦',
    glowA: 'rgba(115,96,160,0.18)',
    glowB: 'rgba(150,130,190,0.10)',
  },
  m3: {
    accent: '#4F8378',
    accentSoft: 'rgba(79,131,120,0.16)',
    gradient: 'from-teal-200/50 via-emerald-100/28 to-white',
    emoji: '●',
    glowA: 'rgba(79,131,120,0.18)',
    glowB: 'rgba(110,165,150,0.10)',
  },
  m4: {
    accent: '#5F6F91',
    accentSoft: 'rgba(95,111,145,0.16)',
    gradient: 'from-indigo-200/46 via-slate-100/34 to-white',
    emoji: '■',
    glowA: 'rgba(95,111,145,0.18)',
    glowB: 'rgba(125,135,170,0.10)',
  },
  m5: {
    accent: '#8A7A45',
    accentSoft: 'rgba(138,122,69,0.16)',
    gradient: 'from-amber-200/50 via-lime-100/22 to-white',
    emoji: '◆',
    glowA: 'rgba(138,122,69,0.18)',
    glowB: 'rgba(170,150,80,0.10)',
  },
};

export const getTheme = (moduleId: string): ModuleTheme =>
  MODULE_THEMES[moduleId] || MODULE_THEMES.m1;

export const moduleIdFromLesson = (lessonId: string): string => {
  const match = lessonId.match(/^l(\d+)/);
  return match ? `m${match[1]}` : 'm1';
};
