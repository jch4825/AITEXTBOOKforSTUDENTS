/**
 * Post-response safety filter. Applied to AI text after receiving from
 * Gemini and before showing to the student. Not a substitute for the
 * upstream safety settings — just a last-resort net for the classroom.
 */

const BAD_TERMS: RegExp[] = [
  /자살|자해|목매|투신/i,
  /죽어|죽여|칼로|찌르|폭행/i,
  /섹스|성관계|성기|자위|음란/i,
  /수류탄|폭탄|테러|총기/i,
  /suicide|self[- ]harm|kill yourself/i,
  /porn|explicit sex/i,
];

const FALLBACK_TEXT = '다시 말해주겠습니다. 다른 질문 해 보십시오.';

export interface FilterResult {
  safe: boolean;
  text: string;
}

export function filterAiResponse(raw: string): FilterResult {
  let trimmed = raw.trim();

  // Strip English self-correction, thinking headers, or review prompts leaked by LLM models
  if (/Review and Refine|Self-Correction|vocabulary too hard|closing\./i.test(trimmed)) {
    const match = trimmed.match(/([가-힣ㄱ-ㅎㅏ-ㅣ][^]*)/);
    if (match) {
      trimmed = match[1].replace(/^["'“”]/, '').replace(/["'“”]$/, '').trim();
    }
  }

  // Remove any residual leading English evaluation lines
  trimmed = trimmed.replace(/^(?:[a-zA-Z0-9\s.,:*_\-()\n]+[:\n])+(?=[가-힣])/, '').trim();

  for (const rx of BAD_TERMS) {
    if (rx.test(trimmed)) {
      return { safe: false, text: FALLBACK_TEXT };
    }
  }

  const MAX_CHARS = 100;
  if (trimmed.length > MAX_CHARS) {
    const sub = trimmed.slice(0, MAX_CHARS);
    const lastPunct = Math.max(sub.lastIndexOf('.'), sub.lastIndexOf('!'), sub.lastIndexOf('?'));
    if (lastPunct > 30) {
      return { safe: true, text: sub.slice(0, lastPunct + 1).trim() };
    }
    return { safe: true, text: sub.trimEnd() + '…' };
  }
  return { safe: true, text: trimmed };
}
