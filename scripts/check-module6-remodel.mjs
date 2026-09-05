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

const lessons = read('src/data/lessons/m6.ts');
const hardLessons = read('src/data/lessons/hard/m6.ts');
const stories = read('src/data/story.ts');
const studios = read('src/data/studios/m6.ts');
const portfolio = read('src/data/modulePortfolios/m6.ts');
const roles = read('src/data/lessonRoles.ts');
const visualNovel = read('src/features/studio/components/VisualNovelExperience.tsx');
const portfolioView = read('src/features/studio/ModuleCloseLessonView.tsx');
const moduleSixStories = stories.slice(stories.indexOf("'m6-l1'"), stories.indexOf('\n};'));

const lessonContracts = [
  ['m6-l1', '조건과 예산에 맞추어 장보기', '아이미의 장보기 목록을 재고·가격·예산·알레르기와 비교해, 빼거나 바꿔서 안전한 목록으로 고쳐요.'],
  ['m6-l2', '계산기로 가격과 거스름돈 확인하기', '아이미가 계산한 금액을 믿기 전에, 가격표를 보고 계산기로 합계와 거스름돈을 확인해요.'],
  ['m6-l3', '지도와 표지판을 보며 길 찾기', '연습 지도에서 출발점과 목적지를 찾고, 아이미의 길 안내를 지도·표지와 대조해 안전한 길을 골라요.'],
  ['m6-l4', '버스 번호와 방향 확인하고 타기', '버스 번호·방향·정류장을 오늘 공지와 확인하고, 헷갈리면 타기 전에 안전하게 도움을 요청해요.'],
  ['m6-l5', '날씨 예보에 맞게 옷차림 준비하기', '공식 예보의 기온·비·바람을 확인하고, 아이미의 한마디 대신 활동과 내 감각에 맞는 준비물을 골라요.'],
  ['m6-l6', '안전하게 요리 순서 만들기', '재료·알레르기·도구·도움 조건을 확인해, 아이미의 요리 초안을 안전한 순서로 고쳐 조립해요.'],
  ['m6-l7', '나에게 알맞은 하루 생활 계획 세우기', '아이미의 빽빽한 일정에 쉬는 시간과 도움 시간을 넣어 고치고, 출발이 늦어지면 계획을 다시 맞춰요.'],
  ['m6-l8', '몸이 아프거나 불편할 때 어른에게 알리기', '몸이 불편할 때 말·그림 카드로 상태를 표현하는 연습을 아이미와 하고, 믿을 만한 어른에게 먼저 알려요.'],
  ['m6-l9', '상황에 맞게 내 마음 표현하기', '인사·도움 요청·거절·다시 말해 달라는 표현을, 말·글·그림 카드 중 편한 방법으로 아이미와 연습해요.'],
  ['m6-l10', '실제 일하는 사람들의 이야기 들어보기', '아이미가 예상한 직업의 모습과 실제 직업인의 이야기를 비교하고, 나의 흥미·강점·필요한 도움을 적어요.'],
  ['m6-l11', '읽는 사람에 어울리는 나만의 자기소개 만들기', '내가 먼저 쓴 자기소개에 아이미의 제안을 골라 반영해, 교실용과 온라인용 두 버전을 완성해요.'],
  ['m6-l12', '인공지능과 함께하는 건강한 하루', '오늘은 예산·이동·날씨·소통이 연결된 하루 계획을 만들고 나의 AI 생활 원칙과 함께 발표해 봐요.'],
];

for (const [lessonId, title, objective] of lessonContracts) {
  const start = lessons.indexOf(`id: '${lessonId}'`);
  assert(start >= 0, `${lessonId}: canonical lesson is missing`);
  const next = lessons.indexOf("id: 'm6-", start + 1);
  const definition = lessons.slice(start, next < 0 ? lessons.length : next);
  assert(definition.includes(`title: '${title}'`), `${lessonId}: canonical title is missing`);
  assert(definition.includes(`objective: '${objective}'`), `${lessonId}: canonical objective is missing`);
  if (lessonId === 'm6-l12') {
    assert(definition.includes("kind: 'activity'"), 'm6-l12: module close must remain an activity');
  } else {
    assert(definition.includes("kind: 'experience'"), `${lessonId}: must use the experience shell`);
  }
}

const experienceLessonIds = Array.from({ length: 11 }, (_, index) => `m6-l${index + 1}`);
const studioRoleBlock = roles.match(/STUDIO_LESSON_IDS[\s\S]*?as const;/)?.[0] ?? '';
for (const lessonId of experienceLessonIds) {
  assert(studioRoleBlock.includes(`'${lessonId}'`), `${lessonId}: studio role mapping is missing`);
}

const studioIds = [
  'm6-shopping-choice',
  'm6-money-calculator-check',
  'm6-fixed-map-route-check',
  'm6-transit-change',
  'm6-official-weather-prep',
  'm6-safe-food-plan',
  'm6-personal-day-plan',
  'm6-health-human-first',
  'm6-self-advocacy-expression',
  'm6-real-work-exploration',
  'm6-safe-self-introduction',
];
for (const studioId of studioIds) {
  assert(studios.includes(`id: '${studioId}'`), `module 6 studio is missing: ${studioId}`);
}

const safeVisibleChoices = {
  'm6-l1': ['revise-shopping-list', 'check-school-supplies'],
  'm6-l2': ['calculator-check', 'verify-new-purchase'],
  'm6-l3': ['use-fixed-map', 'check-clinic-map'],
  'm6-l4': ['check-route-direction', 'ask-station-staff'],
  'm6-l5': ['official-forecast', 'update-afternoon-prep'],
  'm6-l6': ['check-food-conditions', 'substitute-missing-fruit'],
  'm6-l7': ['balanced-personal-plan', 'revise-help-time'],
  'm6-l8': ['tell-trusted-adult', 'report-dizziness'],
  'm6-l9': ['use-own-expression', 'ask-repeat-at-stop'],
  'm6-l10': ['compare-real-worker', 'prepare-next-interview'],
  'm6-l11': ['audience-safe-intro', 'safe-game-intro'],
};

for (const lessonId of experienceLessonIds) {
  const start = studios.indexOf(`lessonId: '${lessonId}'`);
  assert(start >= 0, `${lessonId}: studio mapping is missing`);
  const next = studios.indexOf("lessonId: 'm6-", start + 1);
  const definition = studios.slice(start, next < 0 ? studios.length : next);
  assert(
    (definition.match(/imageSrc: '\/lessons\/story\/m6\/m6-l\d+-scene-\d{2}\.webp'/g) ?? []).length === 4,
    `${lessonId}: expected 4 connected story scenes`,
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
  assert(firstTwoAttemptIds.includes(safeAttemptId), `${lessonId}: full-support first attempt hides the productive choice`);
  assert(firstTwoTransferIds.includes(safeTransferId), `${lessonId}: full-support transfer hides the productive choice`);
}

const artifactTitles = [
  '장보기 판단표와 최종 목록',
  '계산·검산 기록',
  '안전 경로 카드',
  '교통 확인 기록과 도움 요청 문장',
  '나의 외출 준비 카드',
  '안전 음식 계획 카드',
  '전후 하루 계획표와 알림',
  '증상 전달 카드와 도움 요청 표현',
  '생활 표현 카드 4종',
  '나의 직업 탐색 카드',
  '초안·변경 기록·최종 소개 2종',
];
for (const title of artifactTitles) {
  assert(studios.includes(`title: '${title}'`), `module 6 artifact is missing: ${title}`);
}

assert(!studios.includes('visualStories/m6'), 'module 6 must not reuse the retired three-story imports');
assert(studios.includes('/lessons/story/m6/'), 'module 6 story images must use the production assets');
assert(!studios.includes("imageSrc: ''"), 'module 6 story images must not retain blank slots');
assert(visualNovel.includes('scene.imageSrc ?'), 'visual novel must render deliberate blank image slots');

assert(portfolio.includes("lessonId: 'm6-l12'"), 'm6-l12: portfolio definition is missing');
assert(portfolio.includes("title: '인공지능과 함께하는 생활 포트폴리오'"), 'm6-l12: portfolio title is not canonical');
for (const lessonId of experienceLessonIds) {
  assert(portfolio.includes(`lessonId: '${lessonId}'`), `${lessonId}: portfolio artifact choice is missing`);
}
const studioLessonIds = portfolio.match(/studioLessonIds:\s*\[([^\]]+)\]/s)?.[1] ?? '';
for (const lessonId of experienceLessonIds) {
  assert(studioLessonIds.includes(`'${lessonId}'`), `${lessonId}: portfolio does not collect studio evidence`);
}
assert(
  (portfolio.match(/imageSrc: '\/lessons\/story\/module-close\/m6\/m6-close-scene-\d{2}\.webp'/g) ?? []).length === 3,
  'm6-l12: closing story must connect exactly three images',
);
assert(
  portfolioView.includes('selectedArtifacts.length < 3')
    && portfolioView.includes('isMeaningfulStudioExpression(nextMethod)'),
  'm6-l12: explicit completion requirements are missing',
);

for (const requiredSafetyCopy of [
  '고정된 연습 지도',
  '공식 예보',
  '실제 진단',
  '믿을 만한 어른',
  '실제 직업인',
  '교실용',
  '온라인용',
]) {
  assert(studios.includes(requiredSafetyCopy), `module 6 safety copy is missing: ${requiredSafetyCopy}`);
}

for (const retiredCopy of [
  '지도 앱이 있으면 처음 가는 길도 괜찮아',
  '해야 할 일 먼저, 놀이는 그 다음',
  '주인 아저씨가 활짝 웃었습니다',
  '자동화 때문에 예전에 있던 직업이 줄어들',
  '병원 탐험과 의사 선생님',
  '나의 길찾기 안심 일기',
  '내가 만든 샌드위치, 세상에서 제일 맛있어',
  '3번 버스가 5분 뒤에 도착합니다',
]) {
  assert(!lessons.includes(retiredCopy), `legacy module 6 lesson copy remains: ${retiredCopy}`);
  assert(!studios.includes(retiredCopy), `legacy module 6 studio copy remains: ${retiredCopy}`);
  assert(!hardLessons.includes(retiredCopy), `unsafe module 6 challenge copy remains: ${retiredCopy}`);
  assert(!moduleSixStories.includes(retiredCopy), `unsafe module 6 story copy remains: ${retiredCopy}`);
}

console.log('PASS: module 6 remodel contract');
