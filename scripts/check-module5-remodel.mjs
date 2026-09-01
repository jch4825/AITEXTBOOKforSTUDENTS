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
  ['m5-l1', '문제를 정확히 찾기', '물품이 안 온 상황에서 지금 모습과 원하는 모습을 나눠 적고, 아이미와 함께 진짜 문제를 한 문장으로 만들어요.'],
  ['m5-l2', '큰 일을 작은 과제로 나누기', '`부스 설치`라는 큰 일을 작은 과제로 나누고, 아이미의 목록에서 빠진 과제와 필요 없는 과제를 찾아 고쳐요.'],
  ['m5-l3', '이유가 있는 순서 만들기', '아이미가 추천한 설치 순서를 모의 실행으로 시험하고, 먼저 해야 하는 이유가 있는 순서로 다시 조립해요.'],
  ['m5-l4', '무엇부터 할지 기준으로 정하기', '한꺼번에 온 세 가지 일에 안전·마감·도움 기준을 붙이고, 아이미와 함께 먼저 할 일을 정해 이유를 말해요.'],
  ['m5-l5', '답 대신 필요한 만큼 도움받기', '막힌 문제에서 완성 답 대신, 아이미에게 필요한 만큼의 힌트만 골라 받아 내 방법을 고쳐요.'],
  ['m5-l6', 'AI가 다르게 알아들었을 때', '아이미가 다르게 알아들은 까닭을 찾고, 개인정보 없이 필요한 단서만 더해 다시 요청해요.'],
  ['m5-l7', '한 단계 실행하고 확인하기', '아이미에게 한 단계씩 부탁하고, 끝났다는 표시를 확인한 다음에 다음 단계로 넘어가요.'],
  ['m5-l8', '목표와 결과를 비교하기', '아이미가 완성했다는 결과를 처음 조건표와 나란히 대조하고, 빠진 것을 찾아 채워요.'],
  ['m5-l9', '대안을 기준으로 비교하기', '처음 방법이 막혔을 때 아이미와 다른 방법을 두 가지 넘게 만들고, 시간·안전·도움 기준으로 비교해 골라요.'],
  ['m5-l10', '오류를 찾아 다시 시험하기', '안내 순서를 같은 조건으로 다시 시험해 오류 지점을 찾고, 고친 뒤 처음부터 확인해요.'],
  ['m5-l11', '조건이 바뀌면 계획도 바꾸기', '도구가 없고 안전 정보가 확인되지 않았을 때, 계획을 멈추고 어른과 확인해 안전한 새 계획으로 고쳐요.'],
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
    (definition.match(/imageSrc: '\/lessons\/story\/m5\/m5-l\d+-scene-\d{2}\.webp'/g) ?? []).length === 4,
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
  '먼저 할 일 판단표',
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
assert(studios.includes('/lessons/story/m5/'), 'module 5 story images must use the production assets');
assert(!studios.includes("imageSrc: ''"), 'module 5 story images must not retain blank slots');
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
  (portfolio.match(/imageSrc: '\/lessons\/story\/module-close\/m5\/m5-close-scene-\d{2}\.webp'/g) ?? []).length === 3,
  'm5-l12: closing story must connect exactly three images',
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
/**
 * 모바일 푸터 버튼의 글자 크기.
 *
 * 예전 계약은 `font-size: 0.875rem` 리터럴을 요구했는데, 앞선 `@media (max-width: 767px)`
 * 뒤에 오는 첫 `.comic-frame-footer .btn` 블록은 모바일 override가 아니라 기본 규칙이라
 * 애초에 엉뚱한 곳을 보고 있었다. 모바일 블록은 44px 터치 영역을 지정한 쪽이므로
 * 그것으로 특정한다. 값을 고정하지 않고 상한만 두어, 64px 바에 맞춘 정당한 조정은 허용한다.
 */
function mobileFooterButtonFontRem() {
  const blocks = [...styles.matchAll(/\.comic-frame-footer \.btn\s*\{([^}]*)\}/g)].map((m) => m[1]);
  const mobile = blocks.find((body) => /min-height:\s*44px/.test(body));
  if (!mobile) return null;
  const size = mobile.match(/font-size:\s*(?:calc\()?(\d*\.?\d+)rem/);
  return size ? Number(size[1]) : null;
}
const footerFontRem = mobileFooterButtonFontRem();
assert(
  // 125%(20px) 기준 0.9rem이면 18px이라 44px 버튼 안에서 두 글자와 아이콘이 넘치지 않는다.
  footerFontRem !== null && footerFontRem <= 0.9,
  `mobile 125% footer buttons must use a fitting explicit font size (현재 ${footerFontRem ?? '선언 없음'})`,
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
