import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const lessons = read('src/data/lessons/m5.ts');
const hardLessons = read('src/data/lessons/hard/m5.ts');
const stories = read('src/data/story.ts');
const studios = read('src/data/studios/m5.ts');
const portfolio = read('src/data/modulePortfolios/m5.ts');
const roles = read('src/data/lessonRoles.ts');
const visualNovel = read('src/features/studio/components/VisualNovelExperience.tsx');
const portfolioView = read('src/features/studio/ModuleCloseLessonView.tsx');
const portfolioTypes = read('src/data/modulePortfolios/types.ts');
const lessonView = read('src/views/LessonView.tsx');
const styles = read('src/index.css');
const moduleFiveStories = stories.slice(
  stories.indexOf("'m5-l1'"),
  stories.indexOf("'m6-l1'"),
);

const lessonContracts = [
  ['m5-l1', '문제를 정확히 찾기', '오늘은 현재 상황과 원하는 모습을 비교하고 문제·모르는 정보·도움을 나누어 적어 봐요.'],
  ['m5-l2', '큰 일을 작은 과제로 나누기', '오늘은 큰 일에 필요한 작은 과제를 만들고 빠진 과제와 불필요한 과제를 찾아봐요.'],
  ['m5-l3', '이유가 있는 순서 만들기', '오늘은 어떤 단계가 먼저 필요한지 살펴보고 이유가 있는 순서를 만들어 봐요.'],
  ['m5-l4', '무엇부터 할지 기준으로 정하기', '오늘은 안전·마감·필요·도움 가능성을 보고 먼저 할 일을 정해 봐요.'],
  ['m5-l5', '답 대신 필요한 만큼 도움받기', '오늘은 먼저 내 방법을 시도하고 필요한 힌트의 정도를 골라 답을 고쳐 봐요.'],
  ['m5-l6', 'AI가 다르게 알아들었을 때', '오늘은 AI가 추정한 내용과 내가 준 정보를 비교하고 개인정보 없이 필요한 단서를 더해 다시 요청해 봐요.'],
  ['m5-l7', '한 단계 실행하고 확인하기', '오늘은 한 단계를 부탁하고 끝났는지 확인한 뒤 다음 단계로 넘어가 봐요.'],
  ['m5-l8', '목표와 결과를 비교하기', '오늘은 처음 원한 조건과 결과를 나란히 보고 독립된 방법으로 확인해 봐요.'],
  ['m5-l9', '대안을 기준으로 비교하기', '오늘은 가능한 방법을 두 가지 이상 만들고 시간·안전·비용·도움 필요를 비교해 골라봐요.'],
  ['m5-l10', '오류를 찾아 다시 시험하기', '오늘은 잘못된 순서·요청·결과에서 오류를 찾아 고치고 다시 시험해 봐요.'],
  ['m5-l11', '조건이 바뀌면 계획도 바꾸기', '오늘은 준비물·도구·시간·안전 조건이 바뀌었을 때 처음 계획을 멈추고 안전한 새 계획으로 고쳐 봐요.'],
  ['m5-l12', '나는 문제 해결사', '오늘은 새 생활 문제 하나를 골라 현재·목표·작은 과제·순서·대안·확인을 한 장에 완성해 봐요.'],
];

for (const [lessonId, title, objective] of lessonContracts) {
  assert(lessons.includes(`id: '${lessonId}'`), `${lessonId}: lesson data is missing`);
  assert(lessons.includes(`title: '${title}'`), `${lessonId}: canonical title is missing`);
  assert(lessons.includes(`objective: '${objective}'`), `${lessonId}: fixed objective is missing`);
  assert(hardLessons.includes(`'${lessonId}':`), `${lessonId}: challenge support is missing`);
  assert(moduleFiveStories.includes(`'${lessonId}':`), `${lessonId}: story entry is missing`);
}

const experienceLessonIds = Array.from({ length: 11 }, (_, index) => `m5-l${index + 1}`);

for (const lessonId of experienceLessonIds) {
  assert(studios.includes(`lessonId: '${lessonId}'`), `${lessonId}: studio definition is missing`);
  assert(roles.includes(`'${lessonId}'`), `${lessonId}: studio role mapping is missing`);
}

const studioMatches = [...studios.matchAll(/lessonId: '(m5-l(?:10|11|[1-9]))'/g)];
assert(studioMatches.length === 11, `module 5 must have 11 studio definitions, found ${studioMatches.length}`);

const safeVisibleChoices = {
  'm5-l1': ['define-gap', 'check-missing-item'],
  'm5-l2': ['list-needed-tasks', 'separate-presentation-tasks'],
  'm5-l3': ['dependencies-first', 'safe-projector-order'],
  'm5-l4': ['safety-first', 'recheck-criteria'],
  'm5-l5': ['small-hint', 'choose-process-question'],
  'm5-l6': ['safe-location-clues', 'use-building-clues'],
  'm5-l7': ['check-each-step', 'upload-checkpoints'],
  'm5-l8': ['use-checklist', 'calculator-check'],
  'm5-l9': ['compare-options', 'switch-non-screen'],
  'm5-l10': ['reproduce-error', 'test-other-user'],
  'm5-l11': ['stop-and-replan', 'check-new-conditions'],
};

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

  const firstAttemptChoices = definition.match(/firstAttempt:\s*\{[\s\S]*?choices:\s*\[([\s\S]*?)\]\s*,\s*modes:/)?.[1] ?? '';
  const transferChoices = definition.match(/transfer:\s*\{[\s\S]*?choices:\s*\[([\s\S]*?)\]\s*,?\s*\}/)?.[1] ?? '';
  const firstTwoAttemptIds = [...firstAttemptChoices.matchAll(/id: '([^']+)'/g)].slice(0, 2).map((match) => match[1]);
  const firstTwoTransferIds = [...transferChoices.matchAll(/id: '([^']+)'/g)].slice(0, 2).map((match) => match[1]);
  const [safeAttemptId, safeTransferId] = safeVisibleChoices[lessonId];
  assert(
    firstTwoAttemptIds.includes(safeAttemptId),
    `${lessonId}: full-support first attempt hides the productive choice`,
  );
  assert(
    firstTwoTransferIds.includes(safeTransferId),
    `${lessonId}: full-support transfer hides the productive choice`,
  );
}

const artifactTitles = [
  '현재-목표-정보-행동 문제 정의 카드',
  '과제 분해 보드',
  '이유 연결선이 있는 절차표',
  '우선순위 판단표',
  '첫 시도-힌트-수정 결과 기록',
  '요청 수정과 외부 확인 기록',
  '체크포인트가 있는 단계별 대화',
  '목표-결과 검토표',
  '대안 비교표',
  '오류 전후 테스트 기록',
  '처음 계획-바뀐 계획-수정 이유',
];
for (const title of artifactTitles) {
  assert(studios.includes(`title: '${title}'`), `module 5 artifact is missing: ${title}`);
}

assert(!studios.includes('visualStories/m5'), 'module 5 must not reuse the retired three-story imports');
assert(!studios.includes('/lessons/m5-l'), 'module 5 story images must stay blank until new assets exist');
assert(visualNovel.includes('scene.imageSrc ?'), 'visual novel must render deliberate blank image slots');

assert(portfolio.includes("lessonId: 'm5-l12'"), 'm5-l12: portfolio definition is missing');
assert(portfolio.includes("title: '문제 해결 지도'"), 'm5-l12: portfolio title is not canonical');
for (const lessonId of experienceLessonIds) {
  assert(portfolio.includes(`lessonId: '${lessonId}'`), `${lessonId}: portfolio artifact choice is missing`);
}
const studioLessonIds = portfolio.match(/studioLessonIds:\s*\[([^\]]+)\]/s)?.[1] ?? '';
for (const lessonId of experienceLessonIds) {
  assert(studioLessonIds.includes(`'${lessonId}'`), `${lessonId}: portfolio does not collect studio evidence`);
}
assert(
  (portfolio.match(/imageSrc: ''/g) ?? []).length === 3,
  'm5-l12: closing story must reserve exactly three image slots',
);
assert(
  portfolioView.includes('selectedArtifacts.length < 3')
    && portfolioView.includes('isMeaningfulStudioExpression(nextMethod)'),
  'm5-l12: explicit completion requirements are missing',
);
for (const field of ['storyHeading', 'artifactHeading', 'artifactDescription', 'guideHeading', 'printLabel', 'completionRequirement']) {
  assert(portfolioTypes.includes(`${field}?: string`), `m5-l12: portfolio copy field is missing: ${field}`);
  assert(portfolio.includes(`${field}:`), `m5-l12: custom portfolio copy is missing: ${field}`);
  assert(portfolioView.includes(`definition.${field}`), `m5-l12: portfolio view ignores custom copy: ${field}`);
}
assert(
  lessonView.includes('key={lessonId}') || lessonView.includes('key={definition.lessonId}'),
  'module-close and studio route state must reset when the lesson changes',
);
assert(
  /@media \(max-width: 767px\)[\s\S]*?\.comic-frame-footer \.btn\s*\{[^}]*font-size:\s*1rem;/.test(styles),
  'mobile 125% footer buttons must use a fitting explicit font size',
);

for (const retiredCopy of [
  '문제를 찾습니다',
  '문제를 작게 나눠습니다',
  '숙제가 먼저입니다',
  'AI가 못 알아듣는 것은 보통 내 질문이 애매하기 때문입니다',
  '컴퓨터를 부수',
  '라면 끓이기 대작전',
]) {
  assert(!lessons.includes(retiredCopy), `legacy module 5 lesson copy remains: ${retiredCopy}`);
  assert(!studios.includes(retiredCopy), `legacy module 5 studio copy remains: ${retiredCopy}`);
  assert(!hardLessons.includes(retiredCopy), `unsafe module 5 challenge copy remains: ${retiredCopy}`);
  assert(!moduleFiveStories.includes(retiredCopy), `unsafe module 5 story copy remains: ${retiredCopy}`);
}

console.log('PASS: module 5 remodel contract');
