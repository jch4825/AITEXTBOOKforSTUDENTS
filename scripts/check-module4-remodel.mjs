import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const lessons = read('src/data/lessons/m4.ts');
const hardLessons = read('src/data/lessons/hard/m4.ts');
const stories = read('src/data/story.ts');
const studios = read('src/data/studios/m4.ts');
const portfolio = read('src/data/modulePortfolios/m4.ts');
const roles = read('src/data/lessonRoles.ts');
const visualNovel = read('src/features/studio/components/VisualNovelExperience.tsx');
const portfolioView = read('src/features/studio/ModuleCloseLessonView.tsx');
const moduleFourStories = stories.slice(
  stories.indexOf("'m4-l1'"),
  stories.indexOf("'m5-l1'"),
);

const lessonContracts = [
  ['m4-l1', '자신 있는 AI 답도 확인하기', '오늘은 AI 답의 날짜와 근거를 공식 자료와 비교하고 잘못된 부분을 고쳐 봐요.'],
  ['m4-l2', '더 믿을 만한 자료 고르기', '오늘은 같은 내용을 말하는 여러 자료의 출처와 날짜를 보고 더 믿을 만한 자료를 골라봐요.'],
  ['m4-l3', '개인정보 단서 가리기', '오늘은 채팅 초안에서 나를 알아볼 수 있는 정보를 찾아 가리고 안전한 요청으로 고쳐 봐요.'],
  ['m4-l4', '비밀번호와 인증 코드는 보내지 않기', '오늘은 비밀번호·인증 코드 요구를 알아보고 거절한 뒤 믿을 만한 어른과 공식 절차를 확인해 봐요.'],
  ['m4-l5', '사진을 보내기 전 살펴보기', '오늘은 사진 속 얼굴·이름·위치·다른 사람을 찾아 그대로 보내기·가리기·보내지 않기를 판단해 봐요.'],
  ['m4-l6', '불편한 내용을 만났을 때 멈추기', '오늘은 불편한 내용의 위험 신호를 보고 화면에서 거리를 둔 뒤 믿을 만한 사람에게 알려 봐요.'],
  ['m4-l7', '분명하고 존중 있게 부탁하기', '오늘은 같은 요청을 거친 말과 분명하고 존중하는 말로 비교하고 사람에게도 쓸 표현을 골라봐요.'],
  ['m4-l8', '멈출 시간을 함께 정하기', '오늘은 나의 사용 기록을 보고 쉬는 신호와 멈출 계획을 정해 봐요.'],
  ['m4-l9', '이상한 요청을 어른에게 알리기', '오늘은 사진·암호·선물·만남을 요구하는 위험 신호를 보고 누구에게 어떤 말로 알릴지 연습해 봐요.'],
  ['m4-l10', '추천 속 광고 단서 찾기', '오늘은 추천처럼 보이는 게시물에서 광고 표시·구매 링크·과장·빠진 정보를 찾아봐요.'],
  ['m4-l11', '나의 AI 안전 여권', '오늘은 확인할 때·보내기 전·위험할 때의 행동과 도움 요청 문장을 안전 여권에 완성해 봐요.'],
];

for (const [lessonId, title, objective] of lessonContracts) {
  assert(lessons.includes(`id: '${lessonId}'`), `${lessonId}: lesson data is missing`);
  assert(lessons.includes(`title: '${title}'`), `${lessonId}: canonical title is missing`);
  assert(lessons.includes(`objective: '${objective}'`), `${lessonId}: fixed objective is missing`);
  assert(hardLessons.includes(`'${lessonId}':`), `${lessonId}: challenge support is missing`);
  assert(moduleFourStories.includes(`'${lessonId}':`), `${lessonId}: story entry is missing`);
}

const experienceLessonIds = Array.from({ length: 10 }, (_, index) => `m4-l${index + 1}`);

for (const lessonId of experienceLessonIds) {
  assert(studios.includes(`lessonId: '${lessonId}'`), `${lessonId}: studio definition is missing`);
  assert(roles.includes(`'${lessonId}'`), `${lessonId}: studio role mapping is missing`);
}

const studioMatches = [...studios.matchAll(/lessonId: '(m4-l(?:10|[1-9]))'/g)];
assert(studioMatches.length === 10, `module 4 must have 10 studio definitions, found ${studioMatches.length}`);

const safeVisibleChoices = {
  'm4-l1': ['check-official', 'check-latest-board'],
  'm4-l2': ['latest-official', 'today-teacher'],
  'm4-l3': ['hide-identifiers', 'keep-item-details'],
  'm4-l4': ['refuse-tell', 'official-route'],
  'm4-l5': ['crop-redact', 'check-reflection'],
  'm4-l6': ['stop-and-tell', 'stop-distance-tell'],
  'm4-l7': ['clear-structure', 'clear-friend'],
  'm4-l8': ['signal-action', 'adjust-plan'],
  'm4-l9': ['stop-block-tell', 'refuse-and-alert'],
  'm4-l10': ['inspect-compare', 'find-ad-clues'],
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
    `${lessonId}: full-support first attempt hides the safe choice`,
  );
  assert(
    firstTwoTransferIds.includes(safeTransferId),
    `${lessonId}: full-support transfer hides the safe choice`,
  );
}

const artifactTitles = [
  'AI 답 확인 기록',
  '출처 비교 카드',
  '가리기 전후 안전 요청',
  '거절·도움 요청 대화 카드',
  '사진 공유 전 확인 카드와 가린 이미지',
  '도움 요청 문장과 안전 행동 순서',
  '전후 요청과 바꾼 이유 카드',
  '개인 사용·휴식 계획',
  '도움 요청 표현과 개인 도움망',
  '광고 단서 표시판과 구매 판단 카드',
];
for (const title of artifactTitles) {
  assert(studios.includes(`title: '${title}'`), `module 4 artifact is missing: ${title}`);
}

assert(!studios.includes('visualStories/m4'), 'module 4 must not reuse the retired three-story imports');
assert(!studios.includes('/lessons/m4-l'), 'module 4 story images must stay blank until new assets exist');
assert(visualNovel.includes('scene.imageSrc ?'), 'visual novel must render deliberate blank image slots');

assert(portfolio.includes("lessonId: 'm4-l11'"), 'm4-l11: portfolio definition is missing');
assert(portfolio.includes("title: '나의 AI 안전 여권'"), 'm4-l11: portfolio title is not canonical');
for (const lessonId of experienceLessonIds) {
  assert(portfolio.includes(`lessonId: '${lessonId}'`), `${lessonId}: portfolio artifact choice is missing`);
}
const studioLessonIds = portfolio.match(/studioLessonIds:\s*\[([^\]]+)\]/s)?.[1] ?? '';
for (const lessonId of experienceLessonIds) {
  assert(studioLessonIds.includes(`'${lessonId}'`), `${lessonId}: portfolio does not collect studio evidence`);
}
assert(
  (portfolio.match(/imageSrc: ''/g) ?? []).length === 3,
  'm4-l11: closing story must reserve exactly three image slots',
);
assert(
  portfolioView.includes('selectedArtifacts.length < 3')
    && portfolioView.includes('isMeaningfulStudioExpression(nextMethod)'),
  'm4-l11: explicit completion requirements are missing',
);

for (const retiredCopy of [
  'AI도 틀릴 수 있습니다',
  '고운 말을 들으면 나도 기분이 좋아',
  'AI는 가끔 틀린 답을 아주 자신 있게 말합니다',
  '하루 1시간',
  '꽃 사진은 안전',
  '믿을 수 있는 어른에게 비밀번호를 알려',
]) {
  assert(!lessons.includes(retiredCopy), `legacy module 4 lesson copy remains: ${retiredCopy}`);
  assert(!studios.includes(retiredCopy), `legacy module 4 studio copy remains: ${retiredCopy}`);
  assert(!hardLessons.includes(retiredCopy), `unsafe module 4 challenge copy remains: ${retiredCopy}`);
  assert(!moduleFourStories.includes(retiredCopy), `unsafe module 4 story copy remains: ${retiredCopy}`);
}

console.log('PASS: module 4 remodel contract');
