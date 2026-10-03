/**
 * 읽기 지원 계약.
 *
 * 글을 못 읽는 학생도 핵심 학습을 끝까지 마칠 수 있게 하는 길이다(data/readingSupport.ts).
 * 켜진 단원에서는 선택지·반응·AI 의견마다 듣기 단추가 있고, 판단 단추가 그림 카드이며, 상단 바에
 * 소리 칩이 있다. 이 계약은 세 가지를 지킨다.
 *
 *  1. 데이터: 켜진 단원의 그림 카드 판에 판단 카드 셋이 있고 파일이 있으며, 카드에 인쇄된 글자(PECS_LABELS)와
 *     화면 판단 단추의 글자가 같다. 모든 선택지에 반응이 있다(고르는 일이 조용하므로 반응이 곧 피드백이다).
 *  2. 읽기용 글: 기호(가운뎃점·곱셈·영문 AI)를 풀어 쓰고, 구형 사파리가 모듈 전체를 못 읽게 하는
 *     lookbehind 문법을 쓰지 않는다.
 *  3. 읽는 소리: 차례 읽기·멈추기·끼어들기·실패·긴 글 끊어 읽기·소리를 낼 수 없는 기기가 단추 상태를
 *     남기지 않는다(가짜 음성 합성기로 실행한다).
 *  4. 소스: 고르는 일은 조용하고(자동 읽기를 켠 교실만 예외), 듣기 단추는 카드 단추 안이 아니라 곁에 있으며,
 *     소리 칩은 읽기 지원 단원에만 있다. 자동 읽기의 기본값은 꺼짐이다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

async function loadBundled(entryPoint) {
  const result = await build({
    entryPoints: [entryPoint],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    write: false,
    define: { 'import.meta.env.BASE_URL': '"/AITEXTBOOKforSTUDENTS/"' },
  });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
}

/** 줄 머리의 주석만 지운다. */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

const read = (file) => fs.readFileSync(file, 'utf8');

const support = await loadBundled('src/data/readingSupport.ts');
const pecs = await loadBundled('src/data/pecs.ts');
const studios = await loadBundled('src/data/studios/index.ts');
const roles = await loadBundled('src/data/lessonRoles.ts');
const speechText = await loadBundled('src/utils/speechText.ts');
const decisionCards = await loadBundled('src/features/studio/decisionCards.ts');

// ───── 1. 데이터 ─────
const modules = support.READING_SUPPORT_MODULES;
assert(Array.isArray(modules) && modules.length > 0, '읽기 지원이 켜진 단원이 하나도 없다');

const experience = read('src/features/studio/components/StudioExperience.tsx');
const screenLabels = [...experience.matchAll(/\{ id: '(accept|modify|reject)', emoji: '[^']*', label: '([^']+)' \}/g)]
  .reduce((map, m) => ({ ...map, [m[1]]: m[2] }), {});
for (const decision of ['accept', 'modify', 'reject']) {
  assert(screenLabels[decision], `StudioExperience: 판단 단추 ${decision}의 글자를 찾지 못했다`);
  const cardId = decisionCards.DECISION_CARD_IDS[decision];
  assert(cardId, `decisionCards: ${decision}에 맞는 카드가 없다`);
  assert(
    pecs.PECS_LABELS[cardId] === screenLabels[decision],
    `판단 단추 "${screenLabels[decision]}" 와 카드 ${cardId}에 인쇄된 글자 "${pecs.PECS_LABELS[cardId]}" 가 다르다 — 한쪽만 바꾸지 않는다`,
  );
}

let choiceCount = 0;
for (const moduleId of modules) {
  const board = pecs.PECS_BY_MODULE[moduleId] ?? [];
  for (const decision of ['accept', 'modify', 'reject']) {
    const cardId = decisionCards.DECISION_CARD_IDS[decision];
    assert(board.includes(cardId), `${moduleId}: 그림 카드 판에 판단 카드 ${cardId}가 없다`);
    const file = path.join('public', 'lessons', 'pecs', moduleId, `${cardId}.webp`);
    assert(fs.existsSync(file), `${file}: 판단 카드 그림 파일이 없다`);
    assert(
      decisionCards.decisionCardSrc(moduleId, decision).endsWith(`/lessons/pecs/${moduleId}/${cardId}.webp`),
      `${moduleId}/${decision}: 카드 그림 주소가 이상하다`,
    );
  }

  const lessonIds = roles.STUDIO_LESSON_IDS.filter((id) => id.startsWith(`${moduleId}-`));
  assert(lessonIds.length > 0, `${moduleId}: 스튜디오 차시가 없다`);
  for (const lessonId of lessonIds) {
    assert(support.hasReadingSupport(lessonId), `${lessonId}: 읽기 지원 단원인데 hasReadingSupport가 거짓이다`);
    const studio = studios.getStudioDefinition(lessonId);
    assert(studio, `${lessonId}: 스튜디오 정의가 없다`);
    if (!studio) continue;
    for (const [where, choices] of [['첫 생각', studio.firstAttempt.choices], ['적용', studio.transfer.choices]]) {
      const ids = new Set();
      for (const choice of choices) {
        choiceCount += 1;
        assert(!ids.has(choice.id), `${lessonId} ${where}: 선택지 id ${choice.id} 가 겹친다 — 읽는 소리의 이름이 겹친다`);
        ids.add(choice.id);
        assert(choice.label?.trim(), `${lessonId} ${where}: 비어 있는 선택지가 있다`);
        assert(
          choice.reaction?.trim(),
          `${lessonId} ${where}: 선택지 ${choice.id}에 반응이 없다 — 읽기 지원 단원은 고르는 일이 조용해서 반응이 곧 피드백이다`,
        );
        const spoken = speechText.toSpeechText(choice.label);
        assert(spoken.length > 0, `${lessonId} ${where}: 선택지 ${choice.id} 의 읽을 글이 비었다`);
        assert(!/[·ㆍ×÷]/.test(spoken), `${lessonId} ${where}: 선택지 ${choice.id} 의 읽을 글에 기호가 남았다: ${spoken}`);
        assert(
          !/(^|[^A-Za-z0-9])AI(?![A-Za-z0-9])/.test(spoken),
          `${lessonId} ${where}: 선택지 ${choice.id} 의 읽을 글에 영문 AI가 남았다: ${spoken}`,
        );
      }
    }
  }
}
// 목록에 없는 단원은 꺼져 있어야 한다(어느 단원을 켜 두었든 같은 규칙이다).
const unsupportedModule = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'].find((id) => !modules.includes(id));
if (unsupportedModule) {
  assert(
    !support.hasReadingSupport(`${unsupportedModule}-l1`),
    `읽기 지원이 켜지지 않은 단원(${unsupportedModule})이 켜진 것으로 나온다`,
  );
}
assert(!support.hasReadingSupport(undefined), 'lessonId 없는 호출이 켜진 것으로 나온다');

// ───── 2. 읽기용 글 ─────
const samples = [
  ['AI의 1차 판단', '에이아이의 1차 판단'],
  ['인공지능(AI) 도구', '인공지능(에이아이) 도구'],
  ['사용·수정·거절 결정', '사용, 수정, 거절 결정'],
  ['사용ㆍ수정', '사용, 수정'],
  ['가격×수량 식', '가격 곱하기 수량 식'],
  ['전체÷인원', '전체 나누기 인원'],
  ['AIMI와 KAI와 AI2', 'AIMI와 KAI와 AI2'],
  ['  두  칸   띄움 ', '두 칸 띄움'],
];
for (const [input, expected] of samples) {
  const actual = speechText.toSpeechText(input);
  assert(actual === expected, `toSpeechText("${input}") = "${actual}" — "${expected}" 이어야 한다`);
}
assert(
  !/\(\?<[=!]/.test(stripComments(read('src/utils/speechText.ts'))),
  'speechText.ts: lookbehind((?<=, (?<!)를 쓰면 구형 사파리가 모듈 전체를 읽지 못한다',
);

// ───── 3. 읽는 소리 ─────
async function simulateSpeech() {
  const bundle = await build({
    entryPoints: ['src/utils/tts.ts'],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    write: false,
  });
  const spoken = [];
  let current = null;
  let timer = null;
  const utteranceMs = 8;
  let failNext = false;
  // 소리를 낼 수 없는 기기: 읽기 시작 신호도 끝 신호도 오지 않는다(목소리·엔진이 없는 환경).
  let deadEngine = false;
  const synth = {
    speaking: false,
    speak(u) {
      spoken.push(u.text);
      current = u;
      this.speaking = true;
      if (deadEngine) return;
      queueMicrotask(() => { if (current === u) u.onstart?.({}); });
      timer = setTimeout(() => {
        if (current !== u) return;
        current = null;
        this.speaking = false;
        if (failNext) { failNext = false; u.onerror?.({}); } else u.onend?.({});
      }, utteranceMs);
    },
    cancel() {
      if (!current) return;
      const u = current;
      current = null;
      this.speaking = false;
      clearTimeout(timer);
      // 크롬은 끊긴 소리에 오류 콜백을 부른다. 브라우저에 따라 끝 콜백을 부르기도 한다.
      queueMicrotask(() => u.onerror?.({}));
    },
    resume() {},
    getVoices: () => [],
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.window = globalThis;
  globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  Object.defineProperty(globalThis, 'speechSynthesis', { value: synth, configurable: true });
  const tts = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const snapshot = () => ({ ...tts.getSpeakingState() });
  const clear = () => snapshot().key === null && snapshot().group === null;
  const seq = (n) => Array.from({ length: n }, (_, i) => ({ key: `c${i}`, text: `칸${i}` }));

  // 끊어 읽기: 긴 글은 문장 단위 조각으로, 한 조각은 90자 이하, 글자는 잃지 않는다.
  const sentence = '아이미는 사람이 만든 도구라서 모르는 것도 많고 틀릴 때도 있습니다.';
  const longText = Array.from({ length: 6 }, () => sentence).join(' ');
  const chunks = tts.splitForSpeech(longText);
  assert(chunks.length >= 3 && chunks.every((c) => c.length <= 90), `긴 글을 90자 이하 조각으로 끊지 못했다: ${chunks.map((c) => c.length).join(',')}`);
  assert(chunks.join('').replace(/\s/g, '') === longText.replace(/\s/g, ''), '끊어 읽기에서 글자를 잃었다');
  assert(tts.splitForSpeech('짧은 글입니다.').length === 1, '짧은 글은 한 조각이어야 한다');
  assert(tts.splitForSpeech('첫째입니다. 둘째입니다.').length === 1, '짧은 문장 둘은 한 조각으로 합쳐야 한다');
  // 소수점에서 끊었다 합치면 "3. 5"처럼 공백이 끼어든다. 조각 하나가 입력과 똑같아야 한다.
  assert(tts.splitForSpeech('값은 3.5배입니다.').join('|') === '값은 3.5배입니다.', '소수점을 문장의 끝으로 오인했다');
  assert(tts.splitForSpeech('가'.repeat(200)).every((c) => c.length <= 90), '공백 없는 긴 글을 자르지 못했다');

  // 끝까지 읽는다: 칸마다 강조가 옮겨 가고, 끝나면 상태가 비어야 한다.
  const keys = [];
  const unsubscribe = tts.subscribeSpeaking(() => keys.push(`${snapshot().key}/${snapshot().group}`));
  tts.speakSequence(seq(3), { group: 'g', gapMs: 6 });
  await wait(120);
  unsubscribe();
  assert(spoken.length === 3, `차례 읽기가 ${spoken.length}칸만 읽었다(3칸이어야 한다)`);
  assert(
    ['c0/g', 'c1/g', 'c2/g'].every((k) => keys.includes(k)),
    `차례 읽기에서 칸마다 강조가 옮겨 가지 않는다: ${keys.join(', ')}`,
  );
  assert(keys.includes('null/g'), '차례 읽기: 칸 사이를 기다리는 동안에도 묶음은 이어져야 한다');
  assert(clear(), `차례 읽기가 끝났는데 상태가 남았다: ${JSON.stringify(snapshot())}`);

  // 중간에 멈춘다: 멈춘 뒤에는 한 칸도 더 읽지 않고 상태가 비어야 한다.
  spoken.length = 0;
  tts.speakSequence(seq(4), { group: 'g', gapMs: 6 });
  await wait(4);
  tts.stopSpeaking();
  await wait(100);
  assert(spoken.length === 1, `멈춘 뒤에도 읽었다(${spoken.length}칸)`);
  assert(clear(), `멈춘 뒤 상태가 남았다: ${JSON.stringify(snapshot())}`);

  // 다른 소리가 끼어든다: 차례 읽기는 거기서 끝나고 새 소리가 이어받는다.
  spoken.length = 0;
  tts.speakSequence(seq(4), { group: 'g', gapMs: 6 });
  await wait(4);
  tts.speak('끼어든 소리', { key: 'x' });
  assert(snapshot().key === 'x' && snapshot().group === null, `끼어든 소리가 상태를 이어받지 못했다: ${JSON.stringify(snapshot())}`);
  await wait(100);
  assert(
    spoken.length === 2 && spoken[1] === '끼어든 소리',
    `끼어든 뒤 차례 읽기가 이어졌다: ${JSON.stringify(spoken)}`,
  );
  assert(clear(), `끼어든 소리가 끝났는데 상태가 남았다: ${JSON.stringify(snapshot())}`);

  // 읽다가 실패한다: 상태가 비고 뒤 칸을 읽지 않는다.
  spoken.length = 0;
  failNext = true;
  tts.speakSequence(seq(3), { group: 'g', gapMs: 6 });
  await wait(100);
  assert(spoken.length === 1, `실패한 뒤에도 이어 읽었다(${spoken.length}칸)`);
  assert(clear(), `실패한 뒤 상태가 남았다: ${JSON.stringify(snapshot())}`);

  // 낱개 소리는 끝나면 이름을 비운다.
  tts.speak('하나', { key: 'solo' });
  assert(snapshot().key === 'solo', '낱개 소리의 이름이 서지 않았다');
  await wait(60);
  assert(snapshot().key === null, '낱개 소리가 끝났는데 이름이 남았다');

  // 긴 글 한 단추: 조각으로 이어 읽는 동안 같은 이름이 서 있고, 끝나면 비어야 한다.
  spoken.length = 0;
  const longKeys = new Set();
  const unsubscribeLong = tts.subscribeSpeaking(() => longKeys.add(snapshot().key));
  tts.speak(longText, { key: 'long' });
  await wait(220);
  unsubscribeLong();
  assert(spoken.length === chunks.length, `긴 글이 ${spoken.length}조각으로 읽혔다(${chunks.length}조각이어야 한다)`);
  assert(spoken.every((c) => c.length <= 90), '읽은 조각이 90자를 넘었다');
  assert(longKeys.has('long'), '긴 글을 읽는 동안 이름이 서지 않았다');
  assert(clear(), `긴 글을 다 읽었는데 상태가 남았다: ${JSON.stringify(snapshot())}`);

  // 소리를 낼 수 없는 기기: 읽기 시작 신호가 없으면 단추가 "멈추기"로 남지 않고 접혀야 한다.
  spoken.length = 0;
  deadEngine = true;
  tts.speak('소리 없는 기기', { key: 'dead', startTimeoutMs: 40 });
  assert(snapshot().key === 'dead', '죽은 엔진에서도 읽기를 시작한 순간에는 이름이 서야 한다');
  await wait(120);
  assert(clear(), `읽기 시작 신호가 없는데 상태가 접히지 않았다: ${JSON.stringify(snapshot())}`);
  assert(synth.speaking === false, '읽기 시작 신호가 없는데 대기열에서 치우지 않았다');
  spoken.length = 0;
  tts.speakSequence(seq(3), { group: 'g', gapMs: 6, startTimeoutMs: 40 });
  await wait(200);
  assert(spoken.length === 1, `죽은 엔진에서 차례 읽기가 뒤 칸을 계속 시도했다(${spoken.length}칸)`);
  assert(clear(), `죽은 엔진의 차례 읽기가 끝났는데 상태가 남았다: ${JSON.stringify(snapshot())}`);
  deadEngine = false;
}
await simulateSpeech();

// ───── 4. 소스 ─────
const expression = stripComments(read('src/components/mission/blocks/ExpressionInput.tsx'));
const selectChoice = expression.slice(expression.indexOf('function selectChoice'), expression.indexOf('return (', expression.indexOf('function selectChoice')));
assert(/if \(readingSupport\)/.test(selectChoice), 'ExpressionInput: 읽기 지원일 때 고르는 동작을 따로 갈라야 한다');
assert(/if \(autoRead\)/.test(selectChoice), 'ExpressionInput: 읽기 지원에서 고를 때 읽는 일은 자동 읽기(autoRead)를 켠 교실에서만 해야 한다');
const supportBranch = selectChoice.slice(selectChoice.indexOf('if (readingSupport)'), selectChoice.indexOf('} else'));
assert(!/\bspeak\(/.test(supportBranch), 'ExpressionInput: 읽기 지원 가지에서 옛 자동 읽기 speak()를 부르면 안 된다');
assert(/<ListenAllButton\b/.test(expression), 'ExpressionInput: 물음과 선택지를 차례로 읽는 단추(ListenAllButton)가 없다');
assert(/<ListenButton\b/.test(expression), 'ExpressionInput: 선택지마다 듣기 단추(ListenButton)가 없다');
assert(/reading-choice-row/.test(expression), 'ExpressionInput: 선택지 줄(reading-choice-row)이 없다');
// 듣기 단추는 카드 단추 곁에 있어야 한다. 카드 <button> 안에 중첩하면 듣다가 답이 정해진다.
const cardBlock = expression.slice(expression.indexOf('const card = ('), expression.indexOf('if (!readingSupport) return card;'));
assert(cardBlock.length > 0 && !/<ListenButton\b/.test(cardBlock), 'ExpressionInput: 듣기 단추가 카드 단추 안에 들어갔다');

const reaction = read('src/features/studio/components/ChoiceReactionPanel.tsx');
assert(/readingSupport/.test(reaction) && /<ListenButton\b/.test(reaction), 'ChoiceReactionPanel: 반응 대사의 듣기 단추가 없다');

const studioSource = stripComments(experience);
assert(/hasReadingSupport\(definition\.lessonId\)/.test(studioSource), 'StudioExperience: 읽기 지원 여부를 data/readingSupport에서 받아야 한다');
assert(
  (studioSource.match(/<StudioExpressionInput[\s\S]*?readingSupport=\{readingSupport\}/g) ?? []).length === 2,
  'StudioExperience: 첫 생각과 적용의 선택지 목록 둘에 readingSupport를 넘겨야 한다',
);
assert(
  (studioSource.match(/<ChoiceReactionPanel[\s\S]*?readingSupport=\{readingSupport\}/g) ?? []).length === 2,
  'StudioExperience: 반응 패널 둘에 readingSupport를 넘겨야 한다',
);
assert(/decision-card/.test(studioSource) && /PECS_LABELS\[DECISION_CARD_IDS\[choice\.id\]\]/.test(studioSource), 'StudioExperience: 판단 단추의 그림 카드와 글자가 PECS_LABELS에서 나오지 않는다');
assert(/speakKey="decision:opinion"/.test(studioSource), 'StudioExperience: 판단할 AI 의견의 듣기 단추가 없다');
assert(/speakKey="artifact:prompt"/.test(studioSource), 'StudioExperience: 결과물 안내의 듣기 단추가 없다');

const closeView = read('src/features/studio/ModuleCloseLessonView.tsx');
assert(/readingSupport=\{moduleHasReadingSupport\(/.test(closeView), 'ModuleCloseLessonView: 단원 마무리의 선택지에도 읽기 지원을 넘겨야 한다');

const frame = read('src/components/MicroLessonFrame.tsx');
const topBar = read('src/components/TopBar.tsx');
assert(/hasReadingSupport\(lessonId\)/.test(frame), 'MicroLessonFrame: 읽기 지원 여부를 lessonId로 가려야 한다');
assert(/readingSupport \? <SoundToggle \/> : null/.test(frame), 'MicroLessonFrame: 모바일 메뉴의 소리 칩이 읽기 지원 단원에만 있어야 한다');
assert(/readingSupport \? <SoundToggle \/> : null/.test(topBar), 'TopBar: 소리 칩이 읽기 지원 단원에만 있어야 한다');

const storage = read('src/utils/storage.ts');
assert(/autoRead:\s*false/.test(storage), 'storage: 자동 읽기의 기본값은 꺼짐이어야 한다');
assert(/autoRead\s*=\s*parsed\?\.autoRead === true/.test(storage), 'storage: 옛 설정(autoRead 없음)은 꺼짐으로 읽어야 한다');

const toggle = stripComments(read('src/components/controls/SoundToggle.tsx'));
assert(/setSoundEnabled\(false\)[\s\S]*setTTSEnabled\(false\)[\s\S]*setAutoRead\(false\)[\s\S]*stopSpeaking\(\)/.test(toggle), 'SoundToggle: 끌 때 효과음·읽어 주기·자동 읽기를 함께 끄고 읽는 중인 소리를 멈춰야 한다');
assert(!/setAutoRead\(true\)/.test(toggle), 'SoundToggle: 학생이 자동 읽기를 켜면 안 된다(교사 설정이다)');

const listen = stripComments(read('src/components/controls/ListenButton.tsx'));
assert(/speakNow\(/.test(listen) && !/useSettings/.test(listen), 'ListenButton: 듣기 단추는 소리 설정과 상관없이 읽어야 한다');
assert(
  (listen.match(/useEffect\(\(\) => \(\) => \{/g) ?? []).length === 2 && (listen.match(/stopSpeaking\(\)/g) ?? []).length >= 4,
  'ListenButton: 단추가 사라질 때 자기가 시작한 소리(낱개·차례)를 멈추는 정리 효과가 둘 있어야 한다',
);

const tts = stripComments(read('src/utils/tts.ts'));
assert(
  (tts.match(/\+\+sequenceToken/g) ?? []).length >= 2 && /sequenceToken \+= 1/.test(tts),
  'tts: 새 소리(speak·speakSequence)와 멈춤(stopSpeaking)이 차례 읽기를 끊어야 한다(sequenceToken)',
);

// 듣기 단추는 44px 이상이어야 한다(2.75rem = 16px 기준 44px).
const css = read('src/index.css');
const listenRule = css.match(/\.listen-button\s*\{[^}]*\}/)?.[0] ?? '';
assert(/width:\s*2\.75rem/.test(listenRule) && /height:\s*2\.75rem/.test(listenRule), 'index.css: .listen-button 은 44px(2.75rem) 이상이어야 한다');
assert(/\.reading-choice-row\b/.test(css) && /\.decision-card\b/.test(css), 'index.css: 선택지 줄과 판단 카드의 규칙이 없다');

if (failures.length) {
  console.error(`reading support contract failed: ${failures.length}건`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `reading support: ${modules.map((id) => `${Number(id.slice(1))}단원`).join(', ')} 선택지 ${choiceCount}개에 듣기·반응, 판단 카드 셋과 인쇄 글자 일치, 차례 읽기·멈춤·끼어들기 통과`,
);
