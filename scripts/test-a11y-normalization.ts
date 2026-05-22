import { normalizeForSpeech } from '../src/utils/a11y';

function assertEqual(actual: string, expected: string, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nActual:   ${actual}`);
  }
}

assertEqual(
  normalizeForSpeech('0-1. Google Chrome 이해하기'),
  '영 장 일 차시, Google Chrome 이해하기',
  'lesson title prefixes should spell out numbers so Korean TTS does not read them as counters',
);

assertEqual(
  normalizeForSpeech('1-1차시: LLM 맛보기'),
  '일 장 일 차시: 엘 엘 엠 맛보기',
  'compact lesson labels should not be read as native Korean counters',
);

assertEqual(
  normalizeForSpeech('L2-6 프롬프트 만들기'),
  '이 장 육 차시 프롬프트 만들기',
  'L-prefixed lesson IDs should keep the existing spoken lesson format',
);

assertEqual(
  normalizeForSpeech('2-10. 학부모 상담 일지 작성'),
  '이 장 십 차시, 학부모 상담 일지 작성',
  'two-digit lesson numbers should use the same spoken lesson title format',
);
