import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const lessons = read('src/data/lessons/m1.ts');
const stories = read('src/data/story.ts');
const studios = read('src/data/studios/m1.ts');
const portfolio = read('src/data/modulePortfolios/m1.ts');
const portfolioView = read('src/features/studio/ModuleCloseLessonView.tsx');
const roles = read('src/data/lessonRoles.ts');
const lessonView = read('src/views/LessonView.tsx');
const visualNovel = read('src/features/studio/components/VisualNovelExperience.tsx');
const studioExperience = read('src/features/studio/components/StudioExperience.tsx');
const studioReducer = read('src/features/studio/studioReducer.ts');
const moduleOneStories = stories.slice(
  stories.indexOf("'m1-l1'"),
  stories.indexOf("'m2-l1'"),
);

const lessonContracts = [
  ['m1-l1', '아이미와 처음 만난 날', 'AI(인공지능)의 뜻과 할 수 있는 일을 찾아요.'],
  ['m1-l2', '기계와 AI는 어떻게 다를까?', '오늘은 기계가 결과를 바꾸는 데 어떤 정보를 쓰는지 살펴보고 AI가 쓰인 기능을 찾아봐요.'],
  ['m1-l3', 'AI는 어떻게 답을 만들까?', '오늘은 AI가 다음 말을 이어 답을 만드는 모습을 보고, 확인할 문장을 찾아봐요.'],
  ['m1-l4', 'AI의 눈 실험실', '오늘은 사진 조건을 바꾸어 AI의 답이 달라지는지 살펴보고 원본과 다시 비교해 봐요.'],
  ['m1-l5', 'AI의 귀는 어떻게 들을까?', '오늘은 같은 말을 다른 조건에서 들려주고 인식된 글자를 비교해 봐요.'],
  ['m1-l6', 'AI는 자료로 배워요', '오늘은 학습 자료가 달라지면 AI 결과가 어떻게 달라지는지 시험해 봐요.'],
  ['m1-l7', 'AI가 빠르게 도와주는 일', '오늘은 AI가 만든 요약과 번역을 원문과 비교하고 빠진 부분을 찾아봐요.'],
  ['m1-l8', '사실과 판단, 누가 결정할까?', '오늘은 사실 확인, AI의 1차 판단, 사람의 최종 판단을 구분하고 결정의 책임을 알아봐요.'],
  ['m1-l9', '일에 맞는 AI 도구 고르기', '오늘은 원하는 결과와 필요한 입력을 보고 알맞은 AI 도구를 골라봐요.'],
  ['m1-l10', 'AI 결과를 사용할까?', '오늘은 AI에게 안전한 요청을 한 뒤 결과를 확인하고 사용·수정·거절을 골라봐요.'],
  ['m1-l11', '아이미 사용 설명서', '오늘은 새 AI 상황에서 입력·결과·확인할 점을 찾아 나만의 AI 사용 설명서를 완성해 봐요.'],
];

for (const [lessonId, title, objective] of lessonContracts) {
  assert(lessons.includes(`id: '${lessonId}'`), `${lessonId}: lesson data is missing`);
  assert(lessons.includes(`title: '${title}'`), `${lessonId}: canonical title is missing`);
  assert(lessons.includes(`objective: '${objective}'`), `${lessonId}: fixed objective is missing`);
  assert(moduleOneStories.includes(`'${lessonId}':`), `${lessonId}: story entry is missing`);
}

const experienceLessonIds = Array.from({ length: 10 }, (_, index) => `m1-l${index + 1}`);

for (const lessonId of experienceLessonIds) {
  assert(studios.includes(`lessonId: '${lessonId}'`), `${lessonId}: studio definition is missing`);
  assert(roles.includes(`'${lessonId}'`), `${lessonId}: studio role mapping is missing`);
}

const studioMatches = [...studios.matchAll(/lessonId: '(m1-l(?:10|[1-9]))'/g)];
assert(studioMatches.length === 10, `module 1 must have 10 studio definitions, found ${studioMatches.length}`);

for (let index = 0; index < studioMatches.length; index += 1) {
  const lessonId = studioMatches[index][1];
  const start = studioMatches[index].index ?? 0;
  const end = studioMatches[index + 1]?.index ?? studios.length;
  const definition = studios.slice(start, end);
  const connectedSceneCount = (
    definition.match(/imageSrc: '\/lessons\/story\/m1\/m1-l\d+-scene-\d{2}\.webp'/g) ?? []
  ).length;
  assert(connectedSceneCount === 4, `${lessonId}: expected 4 connected story scenes, found ${connectedSceneCount}`);
  for (const field of ['visualNovel:', 'encounter:', 'firstAttempt:', 'conditionChange:', 'aiContribution:', 'artifact:', 'transfer:']) {
    assert(definition.includes(field), `${lessonId}: missing ${field}`);
  }
  assert(definition.includes("source: 'prepared'"), `${lessonId}: prepared AI comparison is missing`);
}

for (const stage of [
  "'encounter'",
  "'first-attempt'",
  "'condition-change'",
  "'ai-compare'",
  "'decision'",
  "'artifact'",
  "'transfer'",
  "'complete'",
]) {
  assert(studioReducer.includes(stage), `shared studio renderer is missing stage ${stage}`);
}

assert(portfolio.includes("lessonId: 'm1-l11'"), 'm1-l11: portfolio definition is missing');
assert(portfolio.includes("title: '아이미 사용 설명서'"), 'm1-l11: portfolio title is not canonical');
for (const lessonId of experienceLessonIds) {
  assert(portfolio.includes(`lessonId: '${lessonId}'`), `${lessonId}: portfolio artifact choice is missing`);
}
const studioLessonIds = portfolio.match(/studioLessonIds:\s*\[([^\]]+)\]/s)?.[1] ?? '';
for (const lessonId of experienceLessonIds) {
  assert(studioLessonIds.includes(`'${lessonId}'`), `${lessonId}: portfolio does not collect studio evidence`);
}
assert(portfolio.includes('closingStory:'), 'm1-l11: closing story is missing');
assert(
  (portfolio.match(/imageSrc: '\/lessons\/story\/module-close\/m1\/m1-close-scene-\d{2}\.webp'/g) ?? []).length === 3,
  'm1-l11: closing story must connect exactly three images',
);
assert(
  portfolioView.includes('selectedArtifacts.length < 3')
    && portfolioView.includes('isMeaningfulStudioExpression(nextMethod)')
    && portfolioView.includes('completionMessage'),
  'm1-l11: explicit portfolio completion requirements are missing',
);
assert(studios.includes("title: '탐구 성찰 기록'"), 'm1-l1: artifact must be an inquiry reflection record');
assert(studios.includes("title: '이미지 인식 실험 기록'"), 'm1-l4: artifact must be an image experiment record');
assert(studios.includes("title: 'AI 결과 사용 판단 기록'"), 'm1-l10: artifact must be a use decision record');

assert(!studios.includes('/lessons/remodel/'), 'module 1 must not use generated remodel assets');
assert(studios.includes('/lessons/story/m1/'), 'module 1 studio scenes must use the production story assets');
assert(!studios.includes("imageSrc: ''"), 'module 1 studio scenes must not retain blank image slots');
assert(visualNovel.includes("scene.imageSrc ?"), 'visual novel must render a deliberate blank slot');

assert(!lessonView.includes('M1_L2_VISUAL_STORY'), 'hard mode must not bypass the preserved lesson shell');
assert(!lessonView.includes('vnStories'), 'hard mode must use the same canonical story as other support levels');
assert(!studioExperience.includes('m1-daily-ai-finder'), 'studio renderer must not hardcode the retired m1-l1 experience');
assert(!studioExperience.includes('토스터'), 'studio renderer must not contain retired lesson-specific toaster copy');

const forbiddenCopy = [
  '컴퓨터가 사람처럼 생각하고',
  '전기를 먹지',
  '명확히 깨달았습니다',
  '아키텍처 한계',
  '나눠습니다',
  '알려 주십시오도',
  '다 배웠습니다!',
];

for (const phrase of forbiddenCopy) {
  assert(!lessons.includes(phrase), `legacy lesson copy remains: ${phrase}`);
  assert(!moduleOneStories.includes(phrase), `legacy story copy remains: ${phrase}`);
  assert(!studios.includes(phrase), `legacy studio copy remains: ${phrase}`);
}

console.log('PASS: module 1 remodel contract');
