import { loadFontScaleValue, saveFontScaleValue } from '../services/storage';

export type FontScale = 'normal' | 'large' | 'xlarge';

const SCALE_TO_PX: Record<FontScale, string> = {
  normal: '16px',
  large: '18px',
  xlarge: '21px',
};

const SINO_KOREAN_DIGITS = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

function toSinoKoreanNumber(value: string): string {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 99) return value;
  if (number < 10) return SINO_KOREAN_DIGITS[number];
  const tens = Math.floor(number / 10);
  const ones = number % 10;
  return `${tens > 1 ? SINO_KOREAN_DIGITS[tens] : ''}십${ones > 0 ? SINO_KOREAN_DIGITS[ones] : ''}`;
}

function spokenLessonPrefix(moduleNumber: string, lessonNumber: string): string {
  return `${toSinoKoreanNumber(moduleNumber)} 장 ${toSinoKoreanNumber(lessonNumber)} 차시`;
}

export function applyFontScale(scale: FontScale) {
  document.documentElement.style.fontSize = SCALE_TO_PX[scale];
  saveFontScaleValue(scale);
}

export function loadFontScale(): FontScale {
  return loadFontScaleValue();
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/&ZeroWidthSpace;|\u200b/g, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/(?:^\s*\|.*\|\s*$\n?){2,}/gm, ' 표가 있습니다. 표는 눈으로 직접 확인하세요. ')
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

export function normalizeForSpeech(text: string): string {
  return text
    .replace(/\b(?:L|l)([0-9]+)-([0-9]+)\b/g, (_, moduleNumber, lessonNumber) => spokenLessonPrefix(moduleNumber, lessonNumber))
    .replace(/(^|\s)([0-5])-([0-9]{1,2})\.\s+(?=\S)/g, (_, prefix, moduleNumber, lessonNumber) => `${prefix}${spokenLessonPrefix(moduleNumber, lessonNumber)}, `)
    .replace(/(^|\s)([0-5])-([0-9]{1,2})\.(?=\s*$)/g, (_, prefix, moduleNumber, lessonNumber) => `${prefix}${spokenLessonPrefix(moduleNumber, lessonNumber)}`)
    .replace(/(^|[^A-Za-z0-9.])([0-5])-([0-9]{1,2})\s*차시/g, (_, prefix, moduleNumber, lessonNumber) => `${prefix}${spokenLessonPrefix(moduleNumber, lessonNumber)}`)
    .replace(/(^|[^A-Za-z0-9.])([0-5])-([0-9]{1,2})(?![\d.])/g, (_, prefix, moduleNumber, lessonNumber) => `${prefix}${spokenLessonPrefix(moduleNumber, lessonNumber)}`)
    .replace(/(\d+)\s*~\s*(\d+)\s*월에는/g, '$1월부터 $2월까지는')
    .replace(/(\d+)\s*~\s*(\d+)\s*월에/g, '$1월부터 $2월까지')
    .replace(/(\d+)\s*~\s*(\d+)\s*월[은는]/g, '$1월부터 $2월까지는')
    .replace(/(\d+)\s*~\s*(\d+)\s*월/g, '$1월부터 $2월까지')
    .replace(/(\d+)\s*~\s*(\d+)\s*(개|가지|명|분|시간|초)/g, '$1$3에서 $2$3')
    .replace(/\b([A-Z]{2,5})\/([A-Z]{2,5})\b/g, '$1와 $2')
    .replace(/(^|[^A-Za-z0-9_])LLM(?=$|[^A-Za-z0-9_])/g, '$1엘 엘 엠')
    .replace(/(^|[^A-Za-z0-9_])MCP(?=$|[^A-Za-z0-9_])/g, '$1엠 씨 피')
    .replace(/(^|[^A-Za-z0-9_])API(?=$|[^A-Za-z0-9_])/g, '$1에이 피 아이')
    .replace(/(^|[^A-Za-z0-9_])RAG(?=$|[^A-Za-z0-9_])/g, '$1랙')
    .replace(/(^|[^A-Za-z0-9_])TTS(?=$|[^A-Za-z0-9_])/g, '$1티 티 에스')
    .replace(/(^|[^A-Za-z0-9_])PDF(?=$|[^A-Za-z0-9_])/g, '$1피 디 에프')
    .replace(/(^|[^A-Za-z0-9_])DOCX(?=$|[^A-Za-z0-9_])/gi, '$1닥스')
    .replace(/(^|[^A-Za-z0-9_])HWPX(?=$|[^A-Za-z0-9_])/gi, '$1에이치 더블유 피 엑스')
    .replace(/(^|[^A-Za-z0-9_])HWP(?=$|[^A-Za-z0-9_])/gi, '$1에이치 더블유 피')
    .replace(/→/g, ' 다음 ')
    .replace(/·/g, ', ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function speak(text: string) {
  if (!('speechSynthesis' in window)) {
    alert('이 브라우저는 음성 읽기를 지원하지 않습니다. 크롬 또는 엣지를 사용해주세요.');
    return;
  }
  const clean = normalizeForSpeech(stripMarkdown(text));
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
