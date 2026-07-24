import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
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
  ['m2-l1', '빠진 정보를 찾아요', '오늘은 AI가 다르게 알아들은 요청에서 빠진 정보를 찾아 안전하게 더해 봐요.'],
  ['m2-l2', '한 번에 한 가지 부탁', '오늘은 여러 부탁이 섞인 문장을 목적별로 나누어 두 번에 걸쳐 요청해 봐요.'],
  ['m2-l3', '대상을 정확히 말해요', '오늘은 `그거`, `아무거나` 대신 이름·종류·개수를 넣고 결과가 달라지는지 비교해 봐요.'],
  ['m2-l4', '좋은 예시를 보여 줘요', '오늘은 원하는 답의 예시를 하나 만들고 예시 전후 결과를 비교해 봐요.'],
  ['m2-l5', '누구에게 보여 줄 답인지 말해요', '오늘은 답을 볼 사람과 원하는 말투를 넣고 내용의 정확성은 따로 확인해 봐요.'],
  ['m2-l6', '요청 공동 제작소', '오늘은 큰 요청을 작은 단계로 나누고 앞 단계 결과를 다음 요청에 이어 써 봐요.'],
  ['m2-l7', '부족한 점을 다시 말해요', '오늘은 첫 답에서 부족한 점을 찾아 중요한 사실을 지키며 다시 요청해 봐요.'],
  ['m2-l8', '답의 모양을 정해요', '오늘은 할 일에 맞는 표·번호 목록·한 문장 형식을 고르고 결과가 형식을 지켰는지 확인해 봐요.'],
  ['m2-l9', '다시 묻기와 확인하기는 달라요', '오늘은 AI 답의 주장 하나를 골라 학교 공지나 믿을 수 있는 자료와 비교해 봐요.'],
  ['m2-l10', '한 번의 진짜 대화 완성하기', '오늘은 내가 정한 목적의 요청을 보내고, 결과를 고쳐 묻고, 근거를 확인해 최종 사용을 결정해 봐요.'],
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
    (definition.match(/imageSrc: ''/g) ?? []).length === 4,
    `${lessonId}: expected 4 blank story scenes`,
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
  '대상별 안내문 2종',
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
assert(!studios.includes('/lessons/m2-l'), 'module 2 story images must stay blank until new assets exist');
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
  (portfolio.match(/imageSrc: ''/g) ?? []).length === 3,
  'm2-l11: closing story must reserve exactly three image slots',
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
