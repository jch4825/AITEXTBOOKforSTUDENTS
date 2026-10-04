import type { DictionaryEntry } from '../types';

/**
 * 본문 속 사전 낱말 찾기 — 밑줄을 칠 자리를 정한다.
 *
 * 예전에는 사전 낱말을 글자 조각으로만 찾았다. 그래서 `계산대`의 `계산`, `무조건`의 `조건`,
 * `장보기`의 `보기`, `틀렸다`의 `틀`처럼 다른 낱말의 한 조각에도 밑줄이 붙었고, `확인합니다`는
 * `확인`에만 밑줄이 쳐져 서술어 한가운데서 끊겼다. 밑줄은 이제 어절 하나를 단위로 아래 규칙으로만 친다.
 *
 *  1. 낱말은 어절의 맨 앞에서 시작한다. 바로 앞이 글자나 숫자면 다른 낱말의 한 조각이다.
 *     (문장부호·가운뎃점·빗금·화살표는 낱말 사이의 경계다. `입력·결과`는 낱말 둘이다.)
 *  2. 낱말 뒤에 아무것도 없거나 조사·서술격 조사만 이어지면 낱말에만 밑줄을 친다. (확인을 → 확인)
 *  3. `verbal` 낱말 뒤에 하다·되다·시키다·받다 활용이 이어지면 서술어 전체에 밑줄을 친다.
 *     (확인합니다 → 확인합니다) 조사가 아니므로 떼어 내면 서술어가 둘로 갈라진다.
 *  4. 그 밖의 글자가 이어지면 파생·합성어(계산대, 결과물, 도구함, 컴퓨터실)이므로 밑줄을 치지 않는다.
 *     그 낱말이 학생에게 필요하면 사전에 별칭이나 항목으로 따로 올린다.
 *
 * 순수 함수만 있다. 데이터(사전 항목)는 받아서 쓰고, 어떤 항목도 직접 가져오지 않는다.
 */

export interface DictionarySpan {
  /** 밑줄이 시작하는 자리. */
  start: number;
  /** 밑줄이 끝나는 자리(포함하지 않는다). */
  end: number;
  /** 뜻풀이를 찾을 올림말(사전 항목의 `term`). */
  term: string;
  /** 본문에서 맞은 사전의 낱말(`term` 또는 `aliases` 가운데 하나, 사전에 적힌 그대로). */
  key: string;
  /** 서술어(하다·되다…)까지 밑줄이 늘어났는가. */
  predicate: boolean;
}

export interface DictionaryMatcher {
  /** 글 하나에서 밑줄을 칠 자리를 앞에서부터 차례로 돌려준다. 서로 겹치지 않는다. */
  spans(text: string): DictionarySpan[];
  /** 학생이 사전에 쳐 넣은 낱말 하나(조사·서술어가 붙어도 된다)에 맞는 항목을 찾는다. */
  lookup(word: string): DictionaryEntry | null;
}

export interface MatcherOptions {
  /** 본문에서는 밑줄을 치지 않는 낱말(term 또는 alias). 직접 찾아보는 일에는 영향이 없다. */
  excludedKeys?: readonly string[];
  /** 앞에 숫자가 붙어도 되는 낱말(1단계, 4요소). */
  numeralKeys?: readonly string[];
}

const WORD_CHAR = /[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9]/;
const DIGIT = /[0-9]/;

/**
 * 격조사·보조사와, 낱말의 뜻을 바꾸지 않고 붙는 말(대로·별·임). 길게 맞추려고 긴 것을 앞에 둔다.
 * `별`(단계별)은 접미사이지만 "~마다"처럼 어느 낱말에나 같은 뜻으로 붙어 새 낱말을 만들지 않는다.
 * 새 물건·장소·사람을 가리키는 접미사(계산대, 도구함, 컴퓨터실, 결과물, 직업인)는 넣지 않는다.
 */
const CASE_PARTICLES = [
  '에게서', '한테서', '으로부터', '로부터', '으로서', '으로써', '이라고', '이라는', '이라도', '이든지',
  '에서', '에게', '한테', '께서', '으로', '로서', '로써', '이란', '라고', '라는', '라도', '든지', '이든', '이나', '이랑', '하고', '보다',
  '처럼', '같이', '만큼', '마다', '조차', '마저', '밖에', '부터', '까지', '대로',
  '께', '로', '란', '든', '나', '랑', '과', '와', '씩', '뿐', '은', '는', '이', '가', '을', '를', '의', '에', '엔', '도', '만', '아', '야',
  '별', '임',
];

/**
 * 서술격 조사와 그 어미. 받침 없는 낱말은 `이`가 줄어(예요·였다·라서) 둘 다 받는다.
 * `인`은 홀로일 때만 받는다. `인` 뒤에 조사가 이어지면(직업인의, 직업인을) 사람을 뜻하는 접미사다.
 * 다만 `인지`는 뒤에 조사를 받을 수 있다(사실인지는, 정보인지뿐).
 */
const COPULA_ENDINGS = [
  '입니다', '입니까', '이에요', '예요', '이어서', '여서', '이므로', '므로', '이니까', '니까', '이니', '니',
  '인데요', '인데', '인가요', '인가', '일까요', '일까', '일지도', '일지', '일', '인', '네요', '네', '군요', '구나', '죠', '지요',
  '이었습니다', '였습니다', '이었어요', '였어요', '이었던', '였던', '이었지만', '였지만', '이었고', '였고', '이었다', '였다',
  '이랍니다', '랍니다', '이라니', '라니', '이거나', '거나', '이어야', '여야', '이지', '이지만', '지만', '이라면', '라면',
  '이라서', '라서', '이라', '라', '이고', '고', '이며', '며', '이면', '면', '이다', '다',
];

const CASE_ALTERNATION = CASE_PARTICLES.join('|');
const JOSA_TAIL = new RegExp(
  `^(?:들)?(?:(?:${CASE_ALTERNATION}){1,3})?(?:인지(?:${CASE_ALTERNATION}){1,2}|${COPULA_ENDINGS.join('|')}|인지)?$`,
);

/** 하다·되다·시키다·받다를 붙여 서술어로 쓰는 낱말 뒤에 이어지는 활용. `한테`는 조사다. */
const PREDICATE_TAIL = /^(?!한테)(?:하|해|함|합|했|한|할|되|돼|됨|됩|됐|된|될|시키|시켜|시킵|시켰|시킨|받)[가-힣]*$/;

const EDGE_PUNCTUATION = /^[\s"'“”‘’「」『』()[\]{}<>.,!?:;…·~—–\-/\\*#+=@&%_]+|[\s"'“”‘’「」『』()[\]{}<>.,!?:;…·~—–\-/\\*#+=@&%_]+$/g;

interface Key {
  /** 본문에서 찾는 글자. `-하다` 올림말은 어간만 남긴다. */
  text: string;
  /** 사전에 적힌 그대로의 낱말(term 또는 alias). 어느 낱말로 맞았는지 밝힐 때 쓴다. */
  source: string;
  term: string;
  verbal: boolean;
  numeral: boolean;
  /** 이 구절 안에서는 사전의 뜻과 달라 밑줄을 치지 않는다. */
  notIn: readonly string[];
}

function nfc(value: string): string {
  return value.normalize('NFC');
}

/** 찾아보기용 정규화. 대소문자·전각·안쪽 공백이 달라도 같은 낱말로 본다. */
function lookupForm(value: string): string {
  return nfc(value).trim().toLowerCase().normalize('NFKC').replace(/\s+/g, ' ');
}

function isWordChar(ch: string | undefined): boolean {
  return ch !== undefined && WORD_CHAR.test(ch);
}

/** 낱말이 시작할 수 있는 자리인가. 바로 앞이 글자·숫자면 다른 낱말의 한 조각이다. */
function startsWord(text: string, index: number, key: Key): boolean {
  if (index === 0) return true;
  const prev = text[index - 1];
  if (!isWordChar(prev)) return true;
  if (!key.numeral || !DIGIT.test(prev)) return false;
  let j = index - 1;
  while (j >= 0 && DIGIT.test(text[j])) j -= 1;
  return j < 0 || !isWordChar(text[j]);
}

/** [start, end)가 글 안의 어느 제외 구절 하나에 온전히 들어 있는가. */
function insideExcludedPhrase(text: string, start: number, end: number, phrases: readonly string[]): boolean {
  for (const phrase of phrases) {
    let from = text.indexOf(phrase);
    while (from >= 0) {
      if (start >= from && end <= from + phrase.length) return true;
      from = text.indexOf(phrase, from + 1);
    }
  }
  return false;
}

const CACHE_LIMIT = 2000;

export function createDictionaryMatcher(
  entries: readonly DictionaryEntry[],
  options: MatcherOptions = {},
): DictionaryMatcher {
  const excluded = new Set((options.excludedKeys ?? []).map(nfc));
  const numeralKeys = new Set((options.numeralKeys ?? []).map(nfc));
  const entryByTerm = new Map<string, DictionaryEntry>();
  const entryByForm = new Map<string, DictionaryEntry>();
  const keys: Key[] = [];

  for (const entry of entries) {
    entryByTerm.set(nfc(entry.term), entry);
    const entryVerbal = entry.verbal === true;
    for (const raw of [entry.term, ...(entry.aliases ?? [])]) {
      const text = nfc(raw);
      if (!entryByForm.has(lookupForm(text))) entryByForm.set(lookupForm(text), entry);
      if (excluded.has(text)) continue;
      // 사전형 `-하다`는 어간으로 찾는다. 활용(대처해야, 복잡한)이 모두 같은 항목으로 모인다.
      const dictionaryForm = text.endsWith('하다') && text.length > 2;
      keys.push({
        text: dictionaryForm ? text.slice(0, -2) : text,
        source: text,
        term: entry.term,
        verbal: entryVerbal || dictionaryForm,
        numeral: numeralKeys.has(text),
        notIn: (entry.notIn ?? []).map(nfc),
      });
    }
  }

  // 같은 자리에서는 가장 긴 낱말(도움 요청 > 도움)을 먼저 본다.
  keys.sort((a, b) => b.text.length - a.text.length);
  const keysByFirstChar = new Map<string, Key[]>();
  for (const key of keys) {
    const first = key.text[0];
    const bucket = keysByFirstChar.get(first);
    if (bucket) bucket.push(key);
    else keysByFirstChar.set(first, [key]);
  }

  const cache = new Map<string, DictionarySpan[]>();

  function scan(raw: string): DictionarySpan[] {
    const text = nfc(raw);
    const cached = cache.get(text);
    if (cached) return cached;

    const spans: DictionarySpan[] = [];
    let i = 0;
    while (i < text.length) {
      const candidates = keysByFirstChar.get(text[i]);
      let accepted: DictionarySpan | null = null;
      if (candidates) {
        for (const key of candidates) {
          if (!text.startsWith(key.text, i) || !startsWord(text, i, key)) continue;
          const keyEnd = i + key.text.length;
          let wordEnd = keyEnd;
          while (wordEnd < text.length && isWordChar(text[wordEnd])) wordEnd += 1;
          const tail = text.slice(keyEnd, wordEnd);

          let end = -1;
          let predicate = false;
          if (tail === '') {
            end = keyEnd;
          } else if (key.verbal && PREDICATE_TAIL.test(tail)) {
            end = wordEnd;
            predicate = true;
          } else if (JOSA_TAIL.test(tail)) {
            end = keyEnd;
          }
          if (end < 0) continue;
          if (key.notIn.length > 0 && insideExcludedPhrase(text, i, end, key.notIn)) continue;
          accepted = { start: i, end, term: key.term, key: key.source, predicate };
          break;
        }
      }
      if (accepted) {
        spans.push(accepted);
        i = accepted.end;
      } else {
        i += 1;
      }
    }

    if (cache.size >= CACHE_LIMIT) cache.clear();
    cache.set(text, spans);
    return spans;
  }

  function lookup(raw: string): DictionaryEntry | null {
    const query = nfc(raw).replace(EDGE_PUNCTUATION, '');
    if (!query) return null;
    const direct = entryByForm.get(lookupForm(query));
    if (direct) return direct;
    // 조사나 서술어가 붙은 낱말(확인을, 확인합니다)은 어절 하나가 통째로 맞을 때만 인정한다.
    const first = scan(query)[0];
    if (!first || first.start !== 0 || /\s/.test(query.slice(first.end))) return null;
    return entryByTerm.get(nfc(first.term)) ?? null;
  }

  return { spans: scan, lookup };
}
