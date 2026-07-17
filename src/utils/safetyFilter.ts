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
const MAX_CHARS = 200;

export interface FilterResult {
  safe: boolean;
  text: string;
}

export function filterAiResponse(raw: string): FilterResult {
  const trimmed = raw.trim();
  for (const rx of BAD_TERMS) {
    if (rx.test(trimmed)) {
      return { safe: false, text: FALLBACK_TEXT };
    }
  }
  if (trimmed.length > MAX_CHARS) {
    return { safe: true, text: trimmed.slice(0, MAX_CHARS).trimEnd() + '…' };
  }
  return { safe: true, text: trimmed };
}
