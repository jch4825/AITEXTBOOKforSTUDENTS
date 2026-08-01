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

const lessons = read('src/data/lessons/m2.ts');
const hardLessons = read('src/data/lessons/hard/m2.ts');
const stories = read('src/data/story.ts');
const studios = read('src/data/studios/m2.ts');
const portfolio = read('src/data/modulePortfolios/m2.ts');
const roles = read('src/data/lessonRoles.ts');
const visualNovel = read('src/features/studio/components/VisualNovelExperience.tsx');
const portfolioView = read('src/features/studio/ModuleCloseLessonView.tsx');
const moduleTwoStories = stories.slice(
  stories.indexOf("'m2-l1'"),
  stories.indexOf("'m3-l1'"),
);

const lessonContracts = [
  ['m2-l1', '빠진 정보를 찾아요', '아이미가 엉뚱하게 알아들은 부탁에서 빠진 정보를 찾아, 개인정보 없이 채워 다시 부탁해요.'],
  ['m2-l2', '한 번에 한 가지 부탁', '한 문장에 섞인 여러 부탁을 하나씩 나누고, 마감이 빠른 것부터 아이미에게 차례로 부탁해요.'],
  ['m2-l3', '대상을 정확히 말해요', '`그거`, `아무거나` 대신 이름·종류·개수를 넣어 부탁하고, 아이미의 답이 어떻게 달라지는지 비교해요.'],
  ['m2-l4', '좋은 예시를 보여 줘요', '원하는 답의 예시를 하나 만들어 아이미에게 보여 주고, 예시를 주기 전과 후의 답을 비교해요.'],
  ['m2-l5', '누구에게 보여 줄 답인지 말해요', '답을 읽을 사람과 말투를 아이미에게 알려 주고, 사실(시간·장소·준비물)이 맞는지는 따로 확인해요.'],
  ['m2-l6', '요청 공동 제작소', '큰 부탁을 작은 단계로 나누고, 앞 단계에서 받은 아이미의 답을 다음 부탁에 이어 써요.'],
  ['m2-l7', '부족한 점을 다시 말해요', '아이미의 첫 답에서 부족한 곳을 찾고, 지킬 사실을 정해서 구체적으로 다시 부탁해요.'],
  ['m2-l8', '답의 모양을 정해요', '할 일에 맞는 형식(표·번호 목록·한 문장)을 골라 아이미에게 부탁하고, 답이 형식과 내용을 지켰는지 확인해요.'],
  ['m2-l9', '다시 묻기와 확인하기는 달라요', '아이미 답의 주장 하나를 골라, 아이미에게 다시 묻는 대신 최신 학교 공지와 비교해 확인해요.'],
  ['m2-l10', '한 번의 진짜 대화 완성하기', '내가 정한 목적으로 아이미에게 부탁하고, 답을 고쳐 묻고, 근거를 확인해 마지막 사용을 결정해요.'],
  ['m2-l11', '나의 프롬프트 노트', '오늘은 실제 목적 하나를 정하고 요청·수정·확인·최종 판단이 담긴 프롬프트 노트를 완성해 봐요.'],
];

for (const [lessonId, title, objective] of lessonContracts) {
  assert(lessons.includes(`id: '${lessonId}'`), `${lessonId}: lesson data is missing`);
  assert(lessons.includes(`title: '${title}'`), `${lessonId}: canonical title is missing`);
  assert(lessons.includes(`objective: '${objective}'`), `${lessonId}: fixed objective is missing`);
  assert(hardLessons.includes(`'${lessonId}':`), `${lessonId}: challenge support is missing`);
  assert(moduleTwoStories.includes(`'${lessonId}':`), `${lessonId}: story entry is missing`);
}

const experienceLessonIds = Array.from({ length: 10 }, (_, index) => `m2-l${index + 1}`);

for (const lessonId of experienceLessonIds) {
  assert(studios.includes(`lessonId: '${lessonId}'`), `${lessonId}: studio definition is missing`);
  assert(roles.includes(`'${lessonId}'`), `${lessonId}: studio role mapping is missing`);
}

const studioMatches = [...studios.matchAll(/lessonId: '(m2-l(?:10|[1-9]))'/g)];
assert(studioMatches.length === 10, `module 2 must have 10 studio definitions, found ${studioMatches.length}`);

for (let index = 0; index < studioMatches.length; index += 1) {
  const lessonId = studioMatches[index][1];
  const start = studioMatches[index].index ?? 0;
  const end = studioMatches[index + 1]?.index ?? studios.length;
  const definition = studios.slice(start, end);
  assert(
    (definition.match(/imageSrc: '\/lessons\/story\/m2\/m2-l\d+-scene-\d{2}\.webp'/g) ?? []).length === 4,
    `${lessonId}: expected 4 connected story scenes`,
  );
  for (const field of ['visualNovel:', 'encounter:', 'firstAttempt:', 'conditionChange:', 'aiContribution:', 'artifact:', 'transfer:']) {
    assert(definition.includes(field), `${lessonId}: missing ${field}`);
  }
  assert(definition.includes("source: 'prepared'"), `${lessonId}: prepared AI comparison is missing`);
}

const artifactTitles = [
  '요청 수정 카드',
  '분할 요청 대화선',
  '전후 요청-결과 체크표',
  '나의 좋은 예시 카드',
  '읽을 사람별 안내 글 2종',
  '단계별 요청 제작 기록',
  '수정 전후 차이와 수정 기준표',
  '형식 규칙 체크 결과물',
  '주장-근거 확인표',
  '전체 대화·검증 기록',
];
for (const title of artifactTitles) {
  assert(studios.includes(`title: '${title}'`), `module 2 artifact is missing: ${title}`);
}

assert(!studios.includes('visualStories/m2'), 'module 2 must not reuse the retired three-story imports');
assert(studios.includes('/lessons/story/m2/'), 'module 2 story images must use the production assets');
assert(!studios.includes("imageSrc: ''"), 'module 2 story images must not retain blank slots');
assert(visualNovel.includes('scene.imageSrc ?'), 'visual novel must render deliberate blank image slots');

assert(portfolio.includes("lessonId: 'm2-l11'"), 'm2-l11: portfolio definition is missing');
assert(portfolio.includes("title: '나의 프롬프트 노트'"), 'm2-l11: portfolio title is not canonical');
for (const lessonId of experienceLessonIds) {
  assert(portfolio.includes(`lessonId: '${lessonId}'`), `${lessonId}: portfolio artifact choice is missing`);
}
const studioLessonIds = portfolio.match(/studioLessonIds:\s*\[([^\]]+)\]/s)?.[1] ?? '';
for (const lessonId of experienceLessonIds) {
  assert(studioLessonIds.includes(`'${lessonId}'`), `${lessonId}: portfolio does not collect studio evidence`);
}
assert(
  (portfolio.match(/imageSrc: '\/lessons\/story\/module-close\/m2\/m2-close-scene-\d{2}\.webp'/g) ?? []).length === 3,
  'm2-l11: closing story must connect exactly three images',
);
assert(
  portfolioView.includes('selectedArtifacts.length < 3')
    && portfolioView.includes('isMeaningfulStudioExpression(nextMethod)'),
  'm2-l11: explicit completion requirements are missing',
);

for (const retiredCopy of [
  '잘 물어봐야 잘 답해 주십시오',
  '진짜 AI랑 놀아보기',
  '다 배웠습니다! (마무리 퀴즈)',
  '학교 준비를 도와 달라는 부탁',
]) {
  assert(!lessons.includes(retiredCopy), `legacy module 2 lesson copy remains: ${retiredCopy}`);
  assert(!studios.includes(retiredCopy), `legacy module 2 studio copy remains: ${retiredCopy}`);
}

console.log('PASS: module 2 remodel contract');
