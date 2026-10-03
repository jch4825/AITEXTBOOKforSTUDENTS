/**
 * 선택지 그림 카드(AAC) 계약.
 *
 * 글을 못 읽는 학생이 그림과 듣기로 답하는 '그림 카드' 방식의 자료와 화면을 지킨다(data/choiceCards/).
 *
 *  1. 완전성: 읽기 지원 단원의 모든 선택지(스튜디오 첫 생각·적용, 단원 마무리 다음 방법)에 카드가 하나씩 있고,
 *     선택지에 없는 카드가 남아 있지 않다. 한 목록 안에서 카드의 그림과 글자가 겹치지 않는다.
 *  2. 글자: 카드 글자는 공백을 빼고 12자, 3어절 이내이고 해요체나 명사형이다. 그림 카드 판의 카드를 쓰면
 *     글자가 카드에 인쇄된 낱말(PECS_LABELS)과 같고 그림 파일이 있다. 그림 카드 판에 있는 낱말을
 *     이모지 카드의 글자로 따로 쓰지 않는다(그림이 있는데 그림 없는 카드가 되는 것을 막는다).
 *  3. 화면: 카드 단추 안에서 소리를 내지 않고(고르는 일은 조용하다), 듣기 단추는 카드 곁에 있으며,
 *     그림 카드 방식은 카드가 있는 차시에서만 보이고, 교사가 정한 기본 화면이 학생 설정에서 지켜진다.
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

const read = (file) => fs.readFileSync(file, 'utf8');

const cardsModule = await loadBundled('src/data/choiceCards/index.ts');
const support = await loadBundled('src/data/readingSupport.ts');
const pecs = await loadBundled('src/data/pecs.ts');
const studios = await loadBundled('src/data/studios/index.ts');
const roles = await loadBundled('src/data/lessonRoles.ts');
const portfolios = await loadBundled('src/data/modulePortfolios/index.ts');

const ALL = cardsModule.ALL_CHOICE_CARDS;

// 해요체나 명사형이 아닌 끝맺음(합니다체·반말·물음 끝·권유 "-자"). 명사로 끝나는 낱말(숫자 같은)은 걸리지 않게 좁혀 둔다.
const BAD_ENDING = /(다|니다|까|냐|야|[하가보먹쓰읽찾]자|라|해|줘|봐|써|네|래)$/;
const ALLOWED_ENDING = new Set([]);
// 이모지·그림 문자. 카드 글자 안에는 글자만 둔다(그림은 따로 그린다).
const PICTOGRAPH = /[\u{1F000}-\u{1FFFF}\u{2190}-\u{2BFF}\u{FE0F}\u{200D}]/u;

/** 한 목록(첫 생각·적용·단원 마무리 다음 방법)의 카드를 본다. */
function checkList(where, moduleId, lessonId, choices) {
  const board = pecs.PECS_BY_MODULE[moduleId] ?? [];
  const boardLabels = new Set(board.map((id) => pecs.PECS_LABELS[id]));
  const labels = new Map();
  const pictures = new Map();
  for (const choice of choices) {
    totalChoices += 1;
    const card = ALL[lessonId]?.[choice.id];
    assert(Boolean(card), `${where}: 선택지 ${choice.id}에 카드가 없다`);
    if (!card) continue;
    const label = card.label ?? '';
    const compact = label.replace(/\s+/g, '');
    const words = label.trim().split(/\s+/).filter(Boolean);
    assert(label.trim() === label && label.length > 0, `${where}/${choice.id}: 카드 글자 앞뒤에 공백이 있거나 비어 있다 ("${label}")`);
    assert(compact.length <= 12, `${where}/${choice.id}: 카드 글자 "${label}"가 12자를 넘는다(${compact.length}자)`);
    assert(words.length <= 3, `${where}/${choice.id}: 카드 글자 "${label}"가 3어절을 넘는다(${words.length}어절)`);
    assert(!PICTOGRAPH.test(label), `${where}/${choice.id}: 카드 글자 "${label}"에 그림 문자가 들어 있다 — 그림은 emoji 칸에 둔다`);
    assert(!/[“”"'‘’?!…·.]/.test(label.replace(/(\d),(\d)/g, '$1$2')), `${where}/${choice.id}: 카드 글자 "${label}"에 따옴표·물음표·마침표가 있다`);
    assert(
      !BAD_ENDING.test(label) || ALLOWED_ENDING.has(label),
      `${where}/${choice.id}: 카드 글자 "${label}"가 해요체나 명사형이 아니다(합니다체·반말·물음 끝)`,
    );
    assert(!/(합니다|입니다|습니다)/.test(label), `${where}/${choice.id}: 카드 글자 "${label}"에 합니다체가 있다`);

    let picture;
    if (card.cardId) {
      pecsCards += 1;
      assert(board.includes(card.cardId), `${where}/${choice.id}: 카드 ${card.cardId}가 ${moduleId} 그림 카드 판에 없다`);
      assert(
        pecs.PECS_LABELS[card.cardId] === card.label,
        `${where}/${choice.id}: 카드 글자 "${card.label}"와 카드 ${card.cardId}에 인쇄된 글자 "${pecs.PECS_LABELS[card.cardId]}"가 다르다 — 한쪽만 바꾸지 않는다`,
      );
      const file = path.join('public', 'lessons', 'pecs', moduleId, `${card.cardId}.webp`);
      assert(fs.existsSync(file), `${file}: 카드 그림 파일이 없다`);
      assert(card.emoji === undefined, `${where}/${choice.id}: 그림 카드 판의 카드에 emoji가 같이 있다`);
      picture = `pecs:${card.cardId}`;
    } else {
      emojiCards += 1;
      const emoji = card.emoji ?? choice.emoji;
      assert(Boolean(emoji?.trim()), `${where}/${choice.id}: 이모지 카드인데 그릴 그림이 없다`);
      assert(
        !boardLabels.has(card.label),
        `${where}/${choice.id}: "${card.label}"는 ${moduleId} 그림 카드 판에 있는 낱말이다 — 이모지 카드로 쓰지 말고 그 카드를 쓴다`,
      );
      picture = `emoji:${emoji}`;
      emojiCardList.push({ where, id: choice.id, label: card.label, emoji });
    }
    if (labels.has(label)) assert(false, `${where}: 카드 글자 "${label}"가 ${labels.get(label)}와 ${choice.id}에서 겹친다`);
    labels.set(label, choice.id);
    if (pictures.has(picture)) assert(false, `${where}: 카드 그림 ${picture}가 ${pictures.get(picture)}와 ${choice.id}에서 겹친다`);
    pictures.set(picture, choice.id);
  }
}

let totalChoices = 0;
let pecsCards = 0;
let emojiCards = 0;
const emojiCardList = [];

// ───── 1·2. 자료 ─────
const modules = support.READING_SUPPORT_MODULES;
assert(modules.length > 0, '읽기 지원이 켜진 단원이 없다');
const expectedLessons = new Set();
for (const moduleId of modules) {
  const lessonIds = roles.STUDIO_LESSON_IDS.filter((id) => id.startsWith(`${moduleId}-`));
  for (const lessonId of lessonIds) {
    expectedLessons.add(lessonId);
    const studio = studios.getStudioDefinition(lessonId);
    assert(studio, `${lessonId}: 스튜디오 정의가 없다`);
    if (!studio) continue;
    const firstIds = new Set(studio.firstAttempt.choices.map((choice) => choice.id));
    const transferIds = new Set(studio.transfer.choices.map((choice) => choice.id));
    for (const id of firstIds) assert(!transferIds.has(id), `${lessonId}: 선택지 id ${id}가 첫 생각과 적용에 함께 있다 — 카드가 차시 단위라 두 곳에서 다른 뜻이 될 수 없다`);
    checkList(`${lessonId} 첫 생각`, moduleId, lessonId, studio.firstAttempt.choices);
    checkList(`${lessonId} 적용`, moduleId, lessonId, studio.transfer.choices);
    const known = new Set([...firstIds, ...transferIds]);
    for (const id of Object.keys(ALL[lessonId] ?? {})) {
      assert(known.has(id), `${lessonId}: 카드 ${id}에 맞는 선택지가 없다 — 지워지거나 이름이 바뀐 선택지의 카드가 남았다`);
    }
  }
  for (const lessonId of roles.MODULE_CLOSE_LESSON_IDS.filter((id) => id.startsWith(`${moduleId}-`))) {
    expectedLessons.add(lessonId);
    const portfolio = portfolios.getModulePortfolioDefinition(lessonId);
    assert(portfolio, `${lessonId}: 단원 마무리 정의가 없다`);
    if (!portfolio) continue;
    checkList(`${lessonId} 다음 방법`, moduleId, lessonId, portfolio.nextChoices);
    const known = new Set(portfolio.nextChoices.map((choice) => choice.id));
    for (const id of Object.keys(ALL[lessonId] ?? {})) {
      assert(known.has(id), `${lessonId}: 카드 ${id}에 맞는 선택지가 없다`);
    }
  }
}
for (const lessonId of Object.keys(ALL)) {
  assert(expectedLessons.has(lessonId), `${lessonId}: 카드 모음에 있는데 읽기 지원 단원의 차시가 아니다`);
}

// getChoiceCardSet은 카드가 있는 차시만 돌려주고 단원 id를 같이 준다.
const sample = cardsModule.getChoiceCardSet('m1-l4');
assert(sample?.moduleId === 'm1' && sample.cards['change-one-condition'], 'getChoiceCardSet("m1-l4")가 카드와 단원을 돌려주지 않는다');
assert(cardsModule.getChoiceCardSet('m9-l1') === undefined, '없는 차시에 카드 모음을 돌려준다');
assert(cardsModule.getChoiceCardSet(undefined) === undefined, 'lessonId 없는 호출에 카드 모음을 돌려준다');
assert(
  cardsModule.choiceCardImageSrc('m2', 'be_specific') === '/AITEXTBOOKforSTUDENTS/lessons/pecs/m2/be_specific.webp',
  `choiceCardImageSrc 주소가 이상하다: ${cardsModule.choiceCardImageSrc('m2', 'be_specific')}`,
);

// ───── 3. 화면 ─────
const stripComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const shared = read('src/data/studios/shared.ts');
assert(
  /STUDIO_EXPRESSION_MODES\s*=\s*\['choice',\s*'aac',/.test(shared),
  "studios/shared.ts: STUDIO_EXPRESSION_MODES에 'aac'(그림 카드)가 '문장 고르기' 바로 뒤에 없다",
);
const close = stripComments(read('src/features/studio/ModuleCloseLessonView.tsx'));
assert(/NEXT_MODES[^=]*=\s*\['choice',\s*'aac',/.test(close), "ModuleCloseLessonView: 다음 방법의 표현 방식에 'aac'가 없다");

const input = stripComments(read('src/components/mission/blocks/ExpressionInput.tsx'));
const studioInput = stripComments(read('src/features/studio/components/StudioExpressionInput.tsx'));
assert(/getChoiceCardSet/.test(studioInput), 'StudioExpressionInput: 차시의 카드 모음을 가져오지 않는다');
assert(
  /modes\.filter\(\s*\(?\s*\w+\s*\)?\s*=>\s*\w+\s*!==\s*'aac'\s*\)/.test(studioInput),
  "StudioExpressionInput: 카드가 없는 차시에서 'aac' 방식을 걸러 내지 않는다 — 빈 탭이 생긴다",
);
assert(/AacChoiceGrid/.test(input), 'ExpressionInput: 그림 카드 방식이 AacChoiceGrid를 쓰지 않는다');

const grid = stripComments(read('src/components/mission/blocks/AacChoiceGrid.tsx'));
// 카드 단추(onClick이 있는 button) 안에서 소리를 내지 않는다. 듣기 단추는 카드 단추 바깥(곁)에 있다.
const cardButton = grid.match(/<button[\s\S]*?<\/button>/);
assert(cardButton, 'AacChoiceGrid: 카드 단추를 찾지 못했다');
if (cardButton) {
  assert(!/\bspeak(Now)?\s*\(|<Listen|useSpeak\b/.test(cardButton[0]), 'AacChoiceGrid: 카드 단추 안에서 소리를 내거나 듣기 단추를 품고 있다 — 고르는 일은 조용하고 듣기는 곁의 단추다');
}
assert(/<ListenButton/.test(grid), 'AacChoiceGrid: 카드마다 듣기 단추가 없다');
assert(
  /<ListenButton[^>]*?\btext=\{choice\.label\}/.test(grid),
  'AacChoiceGrid: 듣기 단추가 선택지 문장 전체(choice.label)를 읽지 않는다 — 카드의 짧은 글만 읽으면 뜻이 서로 다른 카드가 같은 소리로 들린다',
);
assert(/aria-pressed/.test(grid), 'AacChoiceGrid: 카드 단추에 aria-pressed가 없다');

// 먼저 해 보기(포맷 C)도 같은 카드를 쓴다. 그 답은 기록하지 않으므로 카드를 썼다는 사실도 남기지 않는다(기록 호출이 없다).
const cold = stripComments(read('src/features/studio/components/ColdOpenView.tsx'));
assert(/<AacChoiceGrid/.test(cold) && /getChoiceCardSet/.test(cold), '먼저 해 보기: 그림 카드 방식을 쓰지 않는다');
assert(!/record-support-mode|dispatch\(/.test(cold), '먼저 해 보기: 카드를 썼다는 사실을 기록하려 한다 — 이 답은 기록하지 않는 설계다');
// 스튜디오는 카드로 답한 사실을 과정 기록의 '사용한 지원'에 남긴다.
const experience = stripComments(read('src/features/studio/components/StudioExperience.tsx'));
assert(/type:\s*'record-support-mode',\s*value:\s*'aac-cards'/.test(experience), "StudioExperience: 그림 카드로 답한 사실('aac-cards')을 사용한 지원에 남기지 않는다");
assert((experience.match(/lessonId=\{definition\.lessonId\}/g) ?? []).length >= 2, 'StudioExperience: 첫 생각·적용의 표현 입력에 lessonId를 넘기지 않아 카드가 붙지 않는다');
// 교사가 기기마다 처음 열리는 화면을 정한다.
const hub = read('src/features/teacher/TeacherHub.tsx');
const teacherSetting = read('src/features/teacher/TeacherAnswerModeSetting.tsx');
assert(/<TeacherAnswerModeSetting/.test(hub), "TeacherHub: '답하는 방식' 설정이 교사 화면에 없다");
assert(/setAnswerMode/.test(teacherSetting) && /answerMode/.test(teacherSetting), "TeacherAnswerModeSetting: 설정을 저장하지 않는다");
const settingsContext = read('src/context/SettingsContext.tsx');
assert(/setAnswerMode/.test(settingsContext), 'SettingsContext: setAnswerMode가 없다');

const types = read('src/types.ts');
assert(/answerMode:\s*'choice'\s*\|\s*'aac'/.test(types), "types.ts: SettingsState.answerMode('choice' | 'aac')가 없다");
const storage = read('src/utils/storage.ts');
assert(/answerMode:\s*'choice'/.test(storage), "storage.ts: answerMode의 기본값이 'choice'(문장 고르기)가 아니다");
assert(/parsed\?\.answerMode\s*===\s*'aac'/.test(storage), "storage.ts: 옛 설정(answerMode 없음)과 잘못된 값이 'choice'로 돌아가지 않는다");

if (failures.length > 0) {
  console.error(`선택지 그림 카드 계약 위반 ${failures.length}건`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`선택지 그림 카드 계약 통과: 선택지 ${totalChoices}개 = 그림 카드 ${pecsCards}장 + 이모지 카드 ${emojiCards}장`);
if (process.argv.includes('--list-emoji')) {
  for (const item of emojiCardList) console.log(`${item.where}\t${item.id}\t${item.emoji}\t${item.label}`);
}
