export type FontScale = 'normal' | 'large' | 'xlarge';

const STORAGE_KEY = 'ai-bridge-font-scale';

const SCALE_TO_PX: Record<FontScale, string> = {
  normal: '16px',
  large: '18px',
  xlarge: '21px',
};

export function applyFontScale(scale: FontScale) {
  document.documentElement.style.fontSize = SCALE_TO_PX[scale];
  localStorage.setItem(STORAGE_KEY, scale);
}

export function loadFontScale(): FontScale {
  const saved = localStorage.getItem(STORAGE_KEY) as FontScale | null;
  return saved && saved in SCALE_TO_PX ? saved : 'normal';
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s+#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+[.)]\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/#{1,6}/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function speak(text: string) {
  if (!('speechSynthesis' in window)) {
    alert('이 브라우저는 음성 읽기를 지원하지 않습니다. 크롬 또는 엣지를 사용해주세요.');
    return;
  }
  const clean = stripMarkdown(text);
  if (!clean) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = 'ko-KR';
  utter.rate = 0.95;
  const voices = window.speechSynthesis.getVoices();
  const koVoice = voices.find(v => v.lang?.startsWith('ko'));
  if (koVoice) utter.voice = koVoice;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking;
}
