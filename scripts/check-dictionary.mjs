/**
 * 쉬운 사전 계약.
 *
 * 밑줄 낱말은 AI가 없어도 살아 있어야 하는 사전의 기본 길이고, AI는 사전에 없는 낱말을 학생이 직접 써서
 * 찾을 때만 보태는 길이다. 이 검사는 두 길을 지킨다.
 *
 *  1. 밑줄 자리: 밑줄은 낱말(어절) 하나를 통째로 친다. 다른 낱말의 한 조각(계산대의 계산, 무조건의 조건,
 *     장보기의 보기, 틀렸다의 틀)에는 치지 않고, 서술어(확인합니다)는 한가운데서 끊지 않는다.
 *     — 고정 예문 표와, 교재 본문 전체(학생이 읽는 모든 글)를 훑는 검사로 지킨다.
 *  2. 사전 자료: 모든 풀이는 합니다체로 끝맺고, 한 글자 낱말은 허용 목록에만 있으며, 제외 구절은 낱말을
 *     품고 있다. 서술어로 쓰이는 낱말은 `verbal`로 밝힌다.
 *  3. 찾아보기: 조사·서술어가 붙은 낱말(확인을, 확인합니다)도 항목을 찾고, 낱말이 아닌 글은 찾지 않는다.
 *  4. AI 풀이: 사전 화면은 사전에 없는 낱말에만 AI를 부르고, 학생 화면에 키·모델·기술 오류를 보이지 않으며,
 *     AI가 지은 풀이임을 밝힌다. (낱말 걸러내기·답 읽기는 tests/unit/dictionaryAi.test.mjs가 지킨다.)
 *  5. 인공지능 연결 표시: 상단 바에 연결됨/연결 안됨이 있고, 교사가 키를 넣고 빼면 바로 따라가며, 키·모델은 보이지 않는다.
 *  6. 인공지능 정의: AI가 무엇인지는 사전(`AI_DEFINITION`)에서 한 번 정하고, 정의를 말하는 글(차시 본문·개념 카드·
 *     정식 콘텐츠)은 그것을 그대로 쓴다. 사람처럼 생각하고 배우는 존재로 말하는 정의와, 센서 자동문과 가려지지 않는
 *     "스스로 보고 듣고 알아본다"는 기준이 코드 어디에도 다시 생기지 않는다.
 */
import fs from 'node:fs';
import { build } from 'esbuild';

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

async function loadBundled(entry) {
  const result = await build({
    stdin: { contents: entry, resolveDir: process.cwd(), sourcefile: 'check-dictionary-entry.ts', loader: 'ts' },
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    write: false,
    logLevel: 'error',
    define: { 'import.meta.env.BASE_URL': '"/AITEXTBOOKforSTUDENTS/"' },
  });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
}

const mod = await loadBundled(`
import { ALL_LESSONS } from './src/data/lessons/index.ts';
import { getStudioDefinition } from './src/data/studios/index.ts';
import { getModulePortfolioDefinition } from './src/data/modulePortfolios/index.ts';
import { getHardContent } from './src/data/lessons/hard/index.ts';
import { LESSON_STORIES } from './src/data/story.ts';
import { ALL_CANONICAL_LESSONS } from './src/data/canonicalLessons/index.ts';
import { HIGH_SCHOOL_TASKS } from './src/data/highSchoolTasks.ts';
import { LESSON_OBJECTIVES } from './src/data/lessonObjectives.ts';
export * from './src/data/studentDictionary.ts';
export const content = {
  lessons: ALL_LESSONS,
  studios: Object.fromEntries(ALL_LESSONS.map((l) => [l.id, getStudioDefinition(l.id) ?? null])),
  portfolios: Object.fromEntries(ALL_LESSONS.map((l) => [l.id, getModulePortfolioDefinition(l.id) ?? null])),
  hard: Object.fromEntries(ALL_LESSONS.map((l) => [l.id, getHardContent(l.id) ?? null])),
  stories: LESSON_STORIES,
  canonical: ALL_CANONICAL_LESSONS,
  highTasks: HIGH_SCHOOL_TASKS,
  objectives: LESSON_OBJECTIVES,
};
`);

const {
  STUDENT_DICTIONARY: dictionary,
  STUDENT_DICTIONARY_MATCHER: matcher,
  DICTIONARY_UNDERLINE_EXCLUDED_KEYS: excludedKeys,
  DICTIONARY_NUMERAL_KEYS: numeralKeys,
  findDictionaryEntry,
  content,
} = mod;

const underlined = (text) => matcher.spans(text).map((span) => text.slice(span.start, span.end));

/* ── 1-a. 고정 예문: 밑줄이 칠 자리 ─────────────────────────────────────────── */
// [본문, 밑줄이 쳐질 글자들(앞에서부터)]. 사용자가 짚은 사례(계산대, 무조건)와 전수 조사에서 찾은 사례.
const FIXTURES = [
  // 다른 낱말의 한 조각에는 치지 않는다.
  ['마트 계산대에서 계산했어요.', ['계산대', '계산했어요']],
  ['무조건 확인합니다.', ['확인합니다']],
  ['장보기를 해요.', []],
  ['겉보기에 매끄러워도 돋보기로 알아보기', []],
  ['틀렸다고 넘기지 말고 틀린 곳을 찾아요.', []],
  ['자장가를 틀면 전교생이 잠들어요.', []],
  ['구분해서 충분해요.', []],
  ['두근거림이 느껴져요.', []],
  ['필요한지도 모르고 올지도 몰라요.', []],
  ['화면을 초기화했습니다.', []],
  ['일정의 날짜와 과정의 핵심', ['핵심']],
  ['문제 해결과 연결과 비교', ['문제', '비교']],
  ['컴퓨터실에서 도구함을 열어요.', []],
  ['직업인의 이야기를 들어요.', []],
  ['신호등과 신호를 봐요.', ['신호']],
  ['항목표와 가사실', []],
  ['늑대처럼 울어요.', []],
  // 숫자·영문 코드 안은 낱말이 아니다.
  ['[2022특수-기본-AI01] 코드', []],
  ['비AI로 나누지 않아요.', []],
  ['2단계에서 3~4단계까지', ['단계', '단계']],
  // 조사는 떼고 낱말에만 친다.
  ['확인을 합니다.', ['확인']],
  ['정보와 자료에서', ['정보', '자료']],
  ['사실인지는 확인하지 않아요.', ['사실', '확인하지']],
  ['광고임을 확인합니다.', ['광고', '확인합니다']],
  ['순서대로 단계별로 나눠요.', ['순서', '단계']],
  // 서술어는 어절 끝까지 한 번에 친다.
  ['설명해 주십시오. 설명합니다.', ['설명해', '설명합니다']],
  ['대처해야 합니다. 유연하게 계획했던 일', ['대처해야', '유연하게', '계획했던']],
  ['도움받을 사람과 도움을 요청해요.', ['도움받을', '도움']],
  ['복잡한데 방대한 자료', ['복잡한데', '방대한', '자료']],
  ['결정합니다. 최종 결정은 내가 해요.', ['결정합니다', '결정']],
  // 별칭과 띄어 쓰지 않는 합성어는 낱말 전체에 친다.
  ['일기예보를 보고 의사소통을 해요.', ['일기예보', '의사소통']],
  ['음성인식은 어렵습니다.', ['음성인식']],
  ['원자료와 자료를 비교해요.', ['원자료', '자료', '비교해요']],
  // 사전에 올린 합성어는 낱말 전체에 친다.
  ['결과물과 설명서와 도움망과 계산대', ['결과물', '설명서', '도움망', '계산대']],
  // 목록 기호로 이은 낱말은 각각 낱말이다.
  ['입력·결과·확인', ['입력', '결과', '확인']],
  ['표/목록/한 문장', ['목록']],
  // 본문에서 밑줄을 치지 않는 낱말.
  ['인공지능과 기계는 표로 인지해요.', []],
  // 다른 뜻으로 쓰인 구절(제외 구절)에는 치지 않는다.
  ['컴퓨터 프로그램을 만들고 문화 프로그램도 열어요.', ['컴퓨터', '프로그램']],
];

for (const [text, expected] of FIXTURES) {
  const actual = underlined(text);
  assert(
    JSON.stringify(actual) === JSON.stringify(expected),
    `밑줄 자리: "${text}" → ${JSON.stringify(actual)} (기대 ${JSON.stringify(expected)})`,
  );
}

/* ── 2. 사전 자료 ────────────────────────────────────────────────────────── */
const SINGLE_SYLLABLE_KEYS = new Set(['앱', '표']);
const keyOf = (entry) => [entry.term, ...(entry.aliases ?? [])];
const allKeys = new Set(dictionary.flatMap((entry) => keyOf(entry).map((k) => k.normalize('NFC'))));

for (const entry of dictionary) {
  assert(/[다요]\.$/.test(entry.shortExplanation), `풀이는 합니다체 한 문장 이상으로 끝맺는다: ${entry.term} → ${entry.shortExplanation}`);
  if (entry.ttsVersion) assert(/[다요]\.$/.test(entry.ttsVersion), `읽어 줄 풀이도 끝맺는다: ${entry.term}`);
  for (const key of keyOf(entry)) {
    const plain = key.replace(/\s/g, '');
    assert(plain.length >= 2 || SINGLE_SYLLABLE_KEYS.has(plain), `한 글자 낱말은 허용 목록에만 둔다: ${entry.term} / ${key}`);
  }
  for (const phrase of entry.notIn ?? []) {
    assert(
      keyOf(entry).some((key) => phrase.includes(key.endsWith('하다') ? key.slice(0, -2) : key)),
      `제외 구절은 그 낱말을 품고 있어야 한다: ${entry.term} / ${phrase}`,
    );
  }
  // 옛 풀이에서 찾은 오타·어긋난 말이 되살아나지 않게 한다.
  assert(!/나나 |누구나 무엇을|알려 주십시오\.$/.test(`${entry.shortExplanation} ${entry.example ?? ''}`), `고친 말이 되살아났다: ${entry.term}`);
}
for (const key of [...excludedKeys, ...numeralKeys]) {
  assert(allKeys.has(key), `밑줄 제외·숫자 허용 목록의 낱말이 사전에 없다: ${key}`);
}
// 서술어로 쓰는 낱말은 밝혀 둔다. 이 낱말들이 빠지면 서술어가 끊겨 보인다.
const MUST_BE_VERBAL = ['확인', '설명', '비교', '수정', '입력', '판단', '제안', '요약', '부탁', '계획', '표시', '안전', '도움', '기록', '검토', '평가'];
for (const term of MUST_BE_VERBAL) {
  const entry = dictionary.find((e) => e.term === term);
  assert(entry?.verbal === true, `서술어로 쓰는 낱말은 verbal로 밝힌다: ${term}`);
}
// 서술어로 쓰면 뜻이 달라지는 낱말에는 verbal을 켜지 않는다(지도 → 지도하다는 길 안내가 아니다).
for (const term of ['지도', '문제', '도구', '사실', '결과']) {
  const entry = dictionary.find((e) => e.term === term);
  assert(entry && entry.verbal !== true, `뜻이 달라지는 낱말에는 verbal을 켜지 않는다: ${term}`);
}

/* ── 3. 찾아보기 ─────────────────────────────────────────────────────────── */
const LOOKUPS = [
  ['확인', '확인'], ['확인을', '확인'], ['확인합니다', '확인'], ['AI', '인공지능'], ['ai', '인공지능'], ['인공지능', '인공지능'],
  ['분류했습니다', '분류'], ['도움받을', '도움'], ['음성 인식', '음성 인식'], ['음성인식', '음성 인식'], ['"계산대"', '계산대'],
  ['대처해야', '대처하다'], ['복잡한', '복잡하다'],
];
for (const [query, term] of LOOKUPS) {
  assert(findDictionaryEntry(query)?.term === term, `찾아보기: "${query}" → ${term}`);
}
for (const query of ['', '  ', '계산대에서', '무조건', '틀렸다', '확인 방법', '사과']) {
  const found = findDictionaryEntry(query);
  // '계산대에서'는 계산대에 조사가 붙은 낱말이므로 찾는다.
  if (query === '계산대에서') assert(found?.term === '계산대', `찾아보기: "${query}"는 계산대 항목이어야 한다`);
  else assert(found === null, `찾아보기: "${query}"는 항목이 없어야 한다 (${found?.term})`);
}

/* ── 1-b. 교재 본문 전체 훑기 ────────────────────────────────────────────── */
const SKIP_KEYS = new Set(['id', 'imageSrc', 'src', 'imageUrl', 'icon', 'emoji', 'moduleId', 'lessonId', 'kind', 'speaker', 'character', 'expression']);
const strings = [];
const seen = new WeakSet();
function walk(value, where) {
  if (typeof value === 'string') {
    if (/[가-힣]/.test(value) && value.length >= 2) strings.push({ where, text: value.normalize('NFC') });
    return;
  }
  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${where}[${i}]`));
    return;
  }
  for (const [k, v] of Object.entries(value)) {
    if (!SKIP_KEYS.has(k)) walk(v, `${where}.${k}`);
  }
}
for (const lesson of content.lessons) {
  const id = lesson.id;
  walk(lesson, `${id}:lesson`);
  walk(content.studios[id], `${id}:studio`);
  walk(content.portfolios[id], `${id}:portfolio`);
  walk(content.hard[id], `${id}:hard`);
  walk(content.stories[id], `${id}:story`);
  walk(content.highTasks[id], `${id}:highTask`);
}
content.canonical.forEach((c, i) => walk(c, `${c.lessonId ?? i}:canonical`));
content.objectives.forEach((o, i) => walk(o, `${o.lessonId ?? i}:objective`));

// 사용자가 짚었거나 전수 조사에서 찾은, 다른 낱말의 한 조각이라 밑줄이 붙으면 안 되는 낱말들.
// 본문에 이 낱말이 있다면 그 글자 범위와 겹치는 밑줄이 하나도 없어야 한다.
const WORDS_WITHOUT_FRAGMENT_UNDERLINE = [
  '계산대', '무조건', '장보기', '겉보기', '돋보기', '알아보기', '물어보기', '살펴보기', '더보기',
  '구분해', '충분해', '두근거', '초기화', '일정의', '과정의', '가정의', '해결과', '연결과', '컴퓨터실', '도구함', '직업인',
  '틀렸', '틀린', '틀리', '틀림', '틀어', '필요한지도', '있는지도', '올지도', '존재하지도', '항목표', '늑대', '가사실', '미확인', '오작동',
];
const isWordChar = (ch) => ch !== undefined && /[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9]/.test(ch);

let underlineCount = 0;
let predicateCount = 0;
const violations = { fragment: [], split: [], whitespace: [], excluded: [] };
const excluded = new Set(excludedKeys);

for (const { where, text } of strings) {
  const spans = matcher.spans(text);
  underlineCount += spans.length;

  for (const span of spans) {
    if (span.predicate) predicateCount += 1;
    const shown = text.slice(span.start, span.end);

    // 어절 안에서만: 안에 공백이 있다면 사전의 여러 낱말 항목(도움 요청 따위)이어야 한다.
    if (/\s/.test(shown) && !allKeys.has(span.key.normalize('NFC'))) violations.whitespace.push(`${where}: ${shown}`);
    // 밑줄을 치지 않기로 한 낱말.
    if (excluded.has(span.key)) violations.excluded.push(`${where}: ${shown}`);
    // 낱말의 시작이어야 한다(바로 앞이 글자·숫자면 다른 낱말의 한 조각).
    const prev = text[span.start - 1];
    if (isWordChar(prev) && !(/[0-9]/.test(prev) && numeralKeys.includes(span.key))) {
      violations.fragment.push(`${where}: …${text.slice(Math.max(0, span.start - 4), span.end + 2)}`);
    }
    // 서술어를 한가운데서 끊지 않는다: 밑줄 뒤에 하다·되다·받다 활용이 이어지면 안 된다(조사 `한테`는 제외).
    let wordEnd = span.end;
    while (wordEnd < text.length && isWordChar(text[wordEnd])) wordEnd += 1;
    const rest = text.slice(span.end, wordEnd);
    if (/^(하|해|함|합|했|한|할|되|돼|됨|됩|됐|된|될|시키|시켜|받)/.test(rest) && !/^한테/.test(rest)) {
      violations.split.push(`${where}: ${shown}|${rest}`);
    }
  }

  for (const word of WORDS_WITHOUT_FRAGMENT_UNDERLINE) {
    let from = text.indexOf(word);
    while (from >= 0) {
      const to = from + word.length;
      // 그 낱말을 온전히 덮는 밑줄(사전에 올린 합성어)은 괜찮다. 일부만 덮는 밑줄이 문제다.
      const hit = spans.find((s) => s.start < to && s.end > from && !(s.start <= from && s.end >= to));
      if (hit) violations.fragment.push(`${where}: "${word}" 안에 밑줄 ${text.slice(hit.start, hit.end)}`);
      from = text.indexOf(word, from + 1);
    }
  }
}

const show = (list) => list.slice(0, 12).join('\n    ');
assert(violations.fragment.length === 0, `다른 낱말의 한 조각에 밑줄이 붙었다 (${violations.fragment.length}건)\n    ${show(violations.fragment)}`);
assert(violations.split.length === 0, `서술어 한가운데서 밑줄이 끊겼다 (${violations.split.length}건) — 서술어로 쓰는 낱말이면 verbal로 밝힌다\n    ${show(violations.split)}`);
assert(violations.whitespace.length === 0, `밑줄이 어절 둘에 걸쳤다 (${violations.whitespace.length}건)\n    ${show(violations.whitespace)}`);
assert(violations.excluded.length === 0, `밑줄을 치지 않기로 한 낱말에 밑줄이 붙었다 (${violations.excluded.length}건)\n    ${show(violations.excluded)}`);
assert(underlineCount > 15000, `교재 본문의 밑줄이 갑자기 줄었다: ${underlineCount}`);

/* ── 4. AI 풀이: 사전 화면 ───────────────────────────────────────────────── */
const panel = fs.readFileSync('src/components/DictionaryPanel.tsx', 'utf8');
const aiModule = fs.readFileSync('src/utils/dictionaryAi.ts', 'utf8');
assert(/isAiDictionaryAvailable\(\)/.test(panel), '사전 화면은 AI가 연결된 때만 AI 길을 연다 (isAiDictionaryAvailable)');
assert(/if \(!aiReady \|\| entry \|\|/.test(panel), '사전 화면은 사전에 낱말이 있으면 AI를 부르지 않는다');
assert(/AI가 만든 설명/.test(panel), 'AI가 지은 풀이임을 화면에서 밝힌다');
for (const forbidden of ['technicalDetail', 'modelUsed', 'attemptLog', 'getApiKey', 'MODEL_FALLBACK', 'GeminiError']) {
  assert(!panel.includes(forbidden), `사전 화면에 기술 정보(${forbidden})를 내지 않는다`);
}
assert(!/askGemini\(/.test(panel), '사전 화면은 AI를 직접 부르지 않고 dictionaryAi를 거친다');
assert(/normalizeLookupWord/.test(aiModule) && /invalid-word/.test(aiModule), 'AI에게는 낱말만 보낸다 (normalizeLookupWord)');

/* ── 5. 인공지능 연결 표시 ───────────────────────────────────────────────── */
const aiStatus = fs.readFileSync('src/components/controls/AiStatus.tsx', 'utf8');
const apiKeySource = fs.readFileSync('src/utils/apiKey.ts', 'utf8');
assert(/연결됨/.test(aiStatus) && /연결 안됨/.test(aiStatus), '연결 표시는 "연결됨"과 "연결 안됨"을 밝힌다');
assert(/hasApiKey/.test(aiStatus) && /subscribeApiKey/.test(aiStatus), '연결 표시는 저장된 키를 읽고, 키가 바뀌면 바로 따라간다');
for (const forbidden of ['getApiKey', 'maskApiKey', 'MODEL_FALLBACK', 'modelUsed', 'technicalDetail']) {
  assert(!aiStatus.includes(forbidden), `연결 표시에 키·모델 정보(${forbidden})를 내지 않는다`);
}
// 정의 하나와 저장·삭제에서 부르는 곳 둘.
assert(apiKeySource.split('notifyKeyChanged()').length - 1 >= 3, '키를 저장하거나 지울 때 연결 표시에 알린다 (notifyKeyChanged)');
const topBarSource = fs.readFileSync('src/components/TopBar.tsx', 'utf8');
assert(topBarSource.split('<AiStatus />').length - 1 >= 2, '차시 화면 상단 바(데스크톱·모바일)에 연결 표시가 있다');
for (const file of ['src/views/Home.tsx', 'src/views/ContentsView.tsx', 'src/features/teacher/TeacherHub.tsx']) {
  assert(fs.readFileSync(file, 'utf8').includes('<AiStatus />'), `상단 영역에 연결 표시가 있다: ${file}`);
}

/* ── 6. 인공지능 정의: 사전 한 곳에서 정하고 나머지가 따른다 ─────────────────── */
const { AI_DEFINITION } = mod;
assert(Boolean(AI_DEFINITION), '사전에 인공지능 정의(AI_DEFINITION)가 있어야 한다');
if (AI_DEFINITION) {
  const easyText = `${AI_DEFINITION.whatEasy} ${AI_DEFINITION.does.easy}`;
  const normalText = `${AI_DEFINITION.what} ${AI_DEFINITION.does.normal}`;
  const challengeText = `${AI_DEFINITION.what} ${AI_DEFINITION.does.challenge}`;

  const aiEntry = dictionary.find((entry) => entry.term === '인공지능');
  assert(aiEntry?.shortExplanation === AI_DEFINITION.gloss, '사전의 인공지능 항목은 AI_DEFINITION.gloss를 그대로 쓴다');

  // 정의가 말해야 하는 셋. 수준마다 길이와 낱말은 달라도 이 셋이 빠지면 정의가 아니다.
  for (const [level, text] of [['사전', AI_DEFINITION.gloss], ['충분한 지원', easyText], ['중학', normalText], ['고등', challengeText]]) {
    assert(text.includes('사람이 만든 프로그램'), `AI 정의(${level})는 사람이 만든 프로그램이라고 말한다`);
    assert(/비슷한 점|규칙/.test(text), `AI 정의(${level})는 자료에서 비슷한 점·규칙을 찾는다고 말한다`);
    assert(/번역/.test(text) && /추천/.test(text) && /분류/.test(text), `AI 정의(${level})는 번역·추천·분류를 든다`);
  }

  // 1단원 1차시(AI의 뜻)의 글은 이 정의를 그대로 쓴다. 따로 쓴 정의가 다시 생기면 여기서 걸린다.
  const lesson1 = content.lessons.find((lesson) => lesson.id === 'm1-l1');
  const cards = content.studios['m1-l1']?.visualNovel?.knowledge ?? [];
  const hard1 = content.hard['m1-l1'];
  const canonical1 = content.canonical.find((entry) => entry.lessonId === 'm1-l1');
  assert(cards[0]?.core === AI_DEFINITION.what, 'm1-l1 개념 카드 1의 core는 정의의 첫 문장이다');
  assert(cards[0]?.detail?.full === easyText, 'm1-l1 개념 카드 1의 충분한 지원 글은 정의(쉬움)다');
  assert(cards[0]?.detail?.light === AI_DEFINITION.does.normal, 'm1-l1 개념 카드 1의 중학 글은 정의(보통)의 둘째 문장이다');
  assert(cards[0]?.detail?.challenge === AI_DEFINITION.does.challenge, 'm1-l1 개념 카드 1의 고등 글은 정의(어려움)의 둘째 문장이다');
  assert(/비슷한 점/.test(cards[1]?.flow?.process ?? ''), 'm1-l1 입력→처리→출력의 처리는 배운 자료와 비슷한 점 찾기다(학습과 추론을 섞지 않는다)');
  assert(lesson1?.bodyEasy === easyText && lesson1?.wrapUpEasy === easyText, 'm1-l1 본문·정리(충분한 지원)는 정의(쉬움)다');
  assert(lesson1?.bodyNormal?.startsWith(normalText) && lesson1?.wrapUpNormal === normalText, 'm1-l1 본문·정리(중학)는 정의(보통)다');
  assert(hard1?.concept?.[0] === challengeText && hard1?.wrapUpHard?.startsWith(AI_DEFINITION.what), 'm1-l1 고등 글은 정의(어려움)다');
  assert(canonical1?.wrapUp === normalText, 'm1-l1 정식 콘텐츠의 정리는 정의(보통)다');
}

// 사람처럼 생각하고 배우는 존재로 말하는 정의와, 센서 자동문과 가려지지 않는 "스스로 보고 듣고" 기준.
// "AI는 사람처럼 말해도 마음이 없다"처럼 부정하는 글은 걸리지 않도록 정의 자리의 서술만 본다.
const PERSONIFYING_DEFINITION = [
  [/사람처럼\s*(스스로\s*)?(생각|학습|배우|배워|판단)/, '사람처럼 생각하고 배우고 판단한다는 정의'],
  [/스스로\s*(보고|듣고|배우고\s*생각)/, '스스로 보고 듣고 알아본다는 기준'],
  [/생각하는\s*방식을\s*(비슷하게|모방)/, '사람이 생각하는 방식을 따라 한다는 정의'],
];
const stripSourceComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' ')).replace(/\/\/[^\n]*/g, '');
const personified = [];
for (const entry of fs.readdirSync('src', { recursive: true })) {
  const file = `src/${String(entry).replace(/\\/g, '/')}`;
  if (!/\.(ts|tsx)$/.test(file)) continue;
  stripSourceComments(fs.readFileSync(file, 'utf8')).split('\n').forEach((line, index) => {
    // 학생이 아이미에게 묻는 질문("컴퓨터는 사람처럼 생각할 수 있어?")은 정의가 아니다.
    if (/[?？]/.test(line)) return;
    for (const [pattern, label] of PERSONIFYING_DEFINITION) {
      if (pattern.test(line)) personified.push(`${file}:${index + 1} ${label} — ${line.trim().slice(0, 70)}`);
    }
  });
}
assert(personified.length === 0, `인공지능을 사람처럼 말하는 정의가 있다 (${personified.length}건) — AI_DEFINITION을 쓴다\n    ${show(personified)}`);

if (failures.length) {
  console.error('쉬운 사전 계약 위반');
  console.error(failures.map((f) => `- ${f}`).join('\n'));
  process.exit(1);
}

console.log(
  `쉬운 사전 계약 통과: 항목 ${dictionary.length}개, 예문 ${FIXTURES.length}개, 본문 ${strings.length}글 · 밑줄 ${underlineCount}곳` +
  `(서술어 ${predicateCount}곳), 조각 밑줄·끊긴 서술어 0건`,
);
