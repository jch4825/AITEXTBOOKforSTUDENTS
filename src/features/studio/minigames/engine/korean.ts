/**
 * 조사 고르기.
 *
 * 게임 문구는 판마다 바뀌는 낱말을 안는다. "완전히 망함"과 "게으른 택배"에 같은 조사를
 * 붙이면 한쪽이 반드시 틀린다 — 받침이 있으면 은/을/이, 없으면 는/를/가다.
 *
 * 학생이 읽는 글이므로 틀린 조사를 그냥 둘 수 없다. 읽어주기(TTS)도 이 문구를 그대로
 * 소리 내므로 귀로도 어긋난다.
 */

/** 마지막 글자에 받침이 있는가. 한글이 아니면 없는 것으로 본다. */
function hasFinalConsonant(word: string): boolean {
  const last = word.trim().slice(-1);
  if (!last) return false;
  const code = last.charCodeAt(0);
  /* 한글 음절 영역(가~힣)에서 (코드 - 가) % 28이 0이면 받침이 없다. */
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

/**
 * 조사만 돌려준다.
 *
 * 따옴표로 감싼 낱말에 쓸 때 필요하다. `josa('"새 현수막 주문"', ...)`처럼 따옴표째
 * 넘기면 마지막 글자가 따옴표라 받침을 못 본다. 낱말만 보고 고른 조사를 바깥에서
 * 붙인다.
 *
 *   `"${text}"${particleFor(text, '은', '는')}`  →  "새 현수막 주문"은
 */
export function particleFor(word: string, withFinal: string, withoutFinal: string): string {
  return hasFinalConsonant(word) ? withFinal : withoutFinal;
}

/**
 * 낱말 뒤에 붙는 조사를 골라 낱말과 함께 돌려준다.
 *
 *   josa('완전히 망함', '은', '는')  →  '완전히 망함은'
 *   josa('게으른 택배', '은', '는')  →  '게으른 택배는'
 */
export function josa(word: string, withFinal: string, withoutFinal: string): string {
  return word + (hasFinalConsonant(word) ? withFinal : withoutFinal);
}

/** 주제 조사. "무엇은 / 무엇는" */
export const topicOf = (word: string) => josa(word, '은', '는');

/** 목적격 조사. "무엇을 / 무엇를" */
export const objectOf = (word: string) => josa(word, '을', '를');

/** 주격 조사. "무엇이 / 무엇가" */
export const subjectOf = (word: string) => josa(word, '이', '가');
