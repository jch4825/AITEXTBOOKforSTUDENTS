import fs from 'node:fs';
import path from 'node:path';
import { readStudioSource } from './lib/studio-source.mjs';

const root = process.cwd();

function read(relativePath) {
  return readStudioSource(path.join(root, relativePath));
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
  ['m1-l1', '아이미와 처음 만난 날', '어려운 말로 인사한 아이미 대신, AI(인공지능)의 뜻과 AI가 돕는 일 두 가지를 내 말로 소개해요.'],
  ['m1-l2', '기계와 AI는 어떻게 다를까?', '버튼 선풍기·센서 자동문·추천 앱이 받는 정보를 비교해, AI 기능이 쓰인 것을 이유와 함께 골라요.'],
  ['m1-l3', 'AI는 어떻게 답을 만들까?', '다음 낱말 잇기 놀이로 아이미가 답을 만드는 방법을 겪어 보고, 아이미의 답에서 꼭 확인할 문장을 골라요.'],
  ['m1-l4', 'AI의 눈 실험실', '사진의 가림·밝기를 바꾸며 아이미의 답이 달라지는 모습을 실험하고, 답이 달라진 까닭을 골라요.'],
  ['m1-l5', 'AI의 귀는 어떻게 들을까?', '시끄러운 곳에서 아이미가 잘못 받아 적은 말을, 조건을 바꾸거나 다른 입력 방법을 골라 바르게 전해요.'],
  ['m1-l6', 'AI는 자료로 배워요', '세모 카드만 잔뜩 배운 AI가 왜 자꾸 틀리는지 배움 상자를 확인하고, 자료를 골고루 바꿔 결과를 비교해요.'],
  ['m1-l7', 'AI가 빠르게 도와주는 일', '아이미가 1초 만에 만든 요약·번역을 원문과 나란히 놓고, 빠지거나 달라진 부분을 찾아 고쳐요.'],
  ['m1-l8', '사실과 판단, 누가 결정할까?', '아이미가 받은 네 가지 부탁을 사실 확인·AI의 1차 판단·사람의 최종 판단으로 나누고, 왜 그렇게 나눴는지 말해요.'],
  ['m1-l9', '일에 맞는 AI 도구 고르기', '하려는 일과 넣을 수 있는 정보를 아이미에게 말하고, 일마다 알맞은 AI 도구를 이유와 함께 골라요.'],
  ['m1-l10', 'AI 결과를 사용할까?', '개인정보 없이 아이미에게 음악을 부탁하고, 받은 결과를 확인해 쓰기·고치기·안 쓰기 중에서 골라요.'],
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
