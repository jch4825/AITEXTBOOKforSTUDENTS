import fs from 'node:fs';
import path from 'node:path';
import { readStudioSource } from './lib/studio-source.mjs';

const root = process.cwd();

function read(relativePath) {
  return readStudioSource(path.join(root, relativePath));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const lessons = read('src/data/lessons/m3.ts');
const hardLessons = read('src/data/lessons/hard/m3.ts');
const stories = read('src/data/story.ts');
const studios = read('src/data/studios/m3.ts');
const portfolio = read('src/data/modulePortfolios/m3.ts');
const roles = read('src/data/lessonRoles.ts');
const visualNovel = read('src/features/studio/components/VisualNovelExperience.tsx');
const portfolioView = read('src/features/studio/ModuleCloseLessonView.tsx');
const moduleThreeStories = stories.slice(
  stories.indexOf("'m3-l1'"),
  stories.indexOf("'m4-l1'"),
);

const lessonContracts = [
  ['m3-l1', '궁금한 점을 깊이 있게 묻기', '같은 주제를 세 가지 질문으로 바꿔 아이미에게 묻고, 과제에 가장 도움이 되는 답을 이유와 함께 골라요.'],
  ['m3-l2', '어려운 낱말 뜻 확인하기', '모르는 낱말의 뜻을 먼저 짐작하고, 아이미의 설명과 학생 사전을 비교해 내 말로 뜻을 적어요.'],
  ['m3-l3', '쉽고 정확하게 다시 설명하기', '아이미의 쉬운 설명에서 빠진 사실을 찾고, 꼭 남을 내용을 정해 다시 설명해 달라고 해요.'],
  ['m3-l4', '배운 낱말로 문장 만들기', '낱말의 뜻·반대말과 아이미의 예문을 장면과 비교하고, 그 낱말이 어울리는 내 문장을 만들어요.'],
  ['m3-l5', '인공지능과 함께 이야기 짓기', '내 이야기의 결말을 먼저 정하고, 아이미의 세 가지 제안을 골라 고쳐 내 결말을 완성해요.'],
  ['m3-l6', '계산 결과는 직접 확인하기', '간식 합계를 먼저 예상하고 계산기로 확인해, 아이미 풀이에서 틀린 줄을 찾아 고쳐요.'],
  ['m3-l7', '긴 글에서 중요한 내용 찾기', '긴 글에서 꼭 남길 내용을 내가 먼저 고르고, 아이미의 세 문장 요약에서 빠진 것을 찾아 채워요.'],
  ['m3-l8', '스스로 풀어보는 퀴즈 카드', '먼저 풀고 나중에 정답을 보는 양면 퀴즈 카드를, 아이미가 만든 문제를 고쳐서 완성해요.'],
  ['m3-l9', '그림에서 사실과 생각 구별하기', '그림에서 직접 보이는 사실과 아이미가 덧붙인 추측을 나누고, 근거 있는 설명으로 고쳐요.'],
  ['m3-l10', '오늘 배운 내용 스스로 복습하기', '자료를 덮고 배운 것을 먼저 떠올린 뒤, 아이미의 요약과 비교해 내 말로 다시 설명해요.'],
  ['m3-l11', '나만의 공부 도우미 도구함', '오늘은 공부할 때 AI에게 맡길 일과 내가 직접 할 일을 정해 나의 공부 도구함을 완성해 봐요.'],
];

for (const [lessonId, title, objective] of lessonContracts) {
  assert(lessons.includes(`id: '${lessonId}'`), `${lessonId}: lesson data is missing`);
  assert(lessons.includes(`title: '${title}'`), `${lessonId}: canonical title is missing`);
  assert(lessons.includes(`objective: '${objective}'`), `${lessonId}: fixed objective is missing`);
  assert(hardLessons.includes(`'${lessonId}':`), `${lessonId}: challenge support is missing`);
  assert(moduleThreeStories.includes(`'${lessonId}':`), `${lessonId}: story entry is missing`);
}

const experienceLessonIds = Array.from({ length: 10 }, (_, index) => `m3-l${index + 1}`);

for (const lessonId of experienceLessonIds) {
  assert(studios.includes(`lessonId: '${lessonId}'`), `${lessonId}: studio definition is missing`);
  assert(roles.includes(`'${lessonId}'`), `${lessonId}: studio role mapping is missing`);
}

const studioMatches = [...studios.matchAll(/lessonId: '(m3-l(?:10|[1-9]))'/g)];
assert(studioMatches.length === 10, `module 3 must have 10 studio definitions, found ${studioMatches.length}`);

for (let index = 0; index < studioMatches.length; index += 1) {
  const lessonId = studioMatches[index][1];
  const start = studioMatches[index].index ?? 0;
  const end = studioMatches[index + 1]?.index ?? studios.length;
  const definition = studios.slice(start, end);
  assert(
    (definition.match(/imageSrc: '\/lessons\/story\/m3\/m3-l\d+-scene-\d{2}\.webp'/g) ?? []).length === 4,
    `${lessonId}: expected 4 connected story scenes`,
  );
  for (const field of ['visualNovel:', 'encounter:', 'firstAttempt:', 'conditionChange:', 'aiContribution:', 'artifact:', 'transfer:']) {
    assert(definition.includes(field), `${lessonId}: missing ${field}`);
  }
  assert(definition.includes("source: 'prepared'"), `${lessonId}: prepared AI comparison is missing`);
}

const artifactTitles = [
  '질문 계단과 답 비교 기록',
  '뜻-근거-예문-그림 낱말 카드',
  '정확성을 지킨 쉬운 설명 카드',
  '뜻-그림-내 문장 낱말 카드',
  '3컷 이야기 보드와 선택 이유',
  '계산·검산·오류 수정 기록',
  '근거가 연결된 3문장 요약',
  '문제-정답-해설 양면 카드',
  '그림 근거 표시와 수정 설명',
  '자기 설명과 다음 복습 카드',
];
for (const title of artifactTitles) {
  assert(studios.includes(`title: '${title}'`), `module 3 artifact is missing: ${title}`);
}

assert(!studios.includes('visualStories/m3'), 'module 3 must not reuse the retired three-story imports');
assert(studios.includes('/lessons/story/m3/'), 'module 3 story images must use the production assets');
assert(!studios.includes("imageSrc: ''"), 'module 3 story images must not retain blank slots');
assert(visualNovel.includes('scene.imageSrc ?'), 'visual novel must render deliberate blank image slots');

assert(portfolio.includes("lessonId: 'm3-l11'"), 'm3-l11: portfolio definition is missing');
assert(portfolio.includes("title: '나만의 공부 도우미 도구함'"), 'm3-l11: portfolio title is not canonical');
for (const lessonId of experienceLessonIds) {
  assert(portfolio.includes(`lessonId: '${lessonId}'`), `${lessonId}: portfolio artifact choice is missing`);
}
const studioLessonIds = portfolio.match(/studioLessonIds:\s*\[([^\]]+)\]/s)?.[1] ?? '';
for (const lessonId of experienceLessonIds) {
  assert(studioLessonIds.includes(`'${lessonId}'`), `${lessonId}: portfolio does not collect studio evidence`);
}
assert(
  (portfolio.match(/imageSrc: '\/lessons\/story\/module-close\/m3\/m3-close-scene-\d{2}\.webp'/g) ?? []).length === 3,
  'm3-l11: closing story must connect exactly three images',
);
assert(
  portfolioView.includes('selectedArtifacts.length < 3')
    && portfolioView.includes('isMeaningfulStudioExpression(nextMethod)'),
  'm3-l11: explicit completion requirements are missing',
);

for (const retiredCopy of [
  'AI에게 궁금한 것 물어보기',
  '모르는 단어는 AI에게',
  '"쉽게 설명해 주십시오"라고 말합니다',
  'AI는 언제든 대답해주는 공부 도우미입니다',
]) {
  assert(!lessons.includes(retiredCopy), `legacy module 3 lesson copy remains: ${retiredCopy}`);
  assert(!studios.includes(retiredCopy), `legacy module 3 studio copy remains: ${retiredCopy}`);
}

console.log('PASS: module 3 remodel contract');
