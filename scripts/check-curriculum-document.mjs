/**
 * 교육과정 문서 계약.
 *
 * 2022 개정 특수교육 기본 교육과정의 교과 문서는 과목 목표, 내용 체계,
 * 단원(영역)별 핵심 내용, 교수·학습, 평가를 모두 갖춘다. 교사 화면의 과목
 * 명세는 그동안 내용 체계까지만 있었고 단원별 핵심 내용이 없었으며,
 * 교수·학습과 평가는 항목 세 줄로만 적혀 운영 지침으로 쓸 수 없었다.
 *
 * 이 검사는 다음을 강제한다.
 *  1. 여섯 단원 모두 핵심 내용이 있고, 차시 묶음이 실제 차시를 빠짐없이 한 번씩 덮는다.
 *  2. 단원 마무리 차시는 묶음에 넣지 않고 closing으로 따로 서술한다.
 *  3. 교수·학습과 평가는 방향과 방법을 나누어 각각 최소 항목 수를 채우고,
 *     (가)(나)(다)… 표기가 모자라지 않는다.
 *  4. 서술은 교사용 문어체이며 학생용 해요체를 쓰지 않는다.
 *  5. 교사 화면이 이 항목들을 실제로 렌더한다.
 */
import fs from 'node:fs';
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

const { MODULE_CORE_CONTENTS } = await loadBundled('src/data/moduleCoreContents.ts');
const { MODULES } = await loadBundled('src/data/modules.ts');
const {
  TEACHING_DIRECTIONS,
  TEACHING_METHODS,
  ASSESSMENT_DIRECTIONS,
  ASSESSMENT_METHODS,
  KOREAN_ITEM_MARKERS,
} = await loadBundled('src/data/curriculumTeachingAssessment.ts');

/** 교사용 문어체 종결. 학생 화면의 해요체가 섞이면 문서의 격이 어긋난다. */
const WRITTEN_ENDING = /(?:다|음)\.$/;
const STUDENT_POLITE = /[가-힣](?:해요|어요|아요|예요|에요|세요)\.?$/;

// 1~2. 단원별 핵심 내용이 실제 차시를 덮는다.
for (const module of MODULES) {
  const core = MODULE_CORE_CONTENTS[module.id];
  assert(core, `${module.id}: 단원별 핵심 내용이 없다`);
  if (!core) continue;

  assert(core.items.length >= 3, `${module.id}: 차시 묶음이 ${core.items.length}개뿐이다(최소 3개)`);

  const covered = [];
  for (const item of core.items) {
    const match = /^(\d+)(?:~(\d+))?차시$/.exec(item.lessonRange);
    assert(match, `${module.id}: 차시 범위 표기가 규칙에 맞지 않는다 — ${item.lessonRange}`);
    if (!match) continue;
    const from = Number(match[1]);
    const to = match[2] ? Number(match[2]) : from;
    assert(from <= to, `${module.id}: 차시 범위가 거꾸로다 — ${item.lessonRange}`);
    for (let n = from; n <= to; n += 1) covered.push(n);

    assert(item.title.length <= 24, `${module.id} ${item.lessonRange}: 핵심 내용 이름이 너무 길다`);
    assert(
      WRITTEN_ENDING.test(item.description) && !STUDENT_POLITE.test(item.description),
      `${module.id} ${item.lessonRange}: 서술이 교사용 문어체가 아니다`,
    );
  }

  // 스튜디오 차시는 1번부터 (전체 - 1)번까지이고 마지막 한 차시가 단원 마무리다.
  const expected = Array.from({ length: module.lessonCount - 1 }, (_, index) => index + 1);
  const sorted = [...covered].sort((a, b) => a - b);
  assert(
    JSON.stringify(sorted) === JSON.stringify(expected),
    `${module.id}: 차시 묶음이 1~${module.lessonCount - 1}차시를 빠짐없이 한 번씩 덮지 않는다 — ${sorted.join(',')}`,
  );
  assert(
    !covered.includes(module.lessonCount),
    `${module.id}: 단원 마무리 ${module.lessonCount}차시는 묶음이 아니라 closing으로 서술한다`,
  );
  assert(
    WRITTEN_ENDING.test(core.overview) && WRITTEN_ENDING.test(core.closing),
    `${module.id}: 단원 개요와 마무리 서술이 교사용 문어체가 아니다`,
  );
}

// 3~4. 교수·학습과 평가.
for (const [label, items, minimum] of [
  ['교수·학습의 방향', TEACHING_DIRECTIONS, 7],
  ['교수·학습 방법', TEACHING_METHODS, 7],
  ['평가의 방향', ASSESSMENT_DIRECTIONS, 6],
  ['평가 방법', ASSESSMENT_METHODS, 6],
]) {
  assert(items.length >= minimum, `${label}: 항목이 ${items.length}개뿐이다(최소 ${minimum}개)`);
  assert(
    items.length <= KOREAN_ITEM_MARKERS.length,
    `${label}: 항목이 ${items.length}개라 (가)(나)(다)… 표기가 모자란다`,
  );
  assert(new Set(items).size === items.length, `${label}: 같은 항목이 두 번 있다`);
  for (const text of items) {
    assert(WRITTEN_ENDING.test(text), `${label}: 문어체가 아닌 항목이 있다 — ${text.slice(0, 24)}…`);
    assert(!STUDENT_POLITE.test(text), `${label}: 학생용 해요체 항목이 있다 — ${text.slice(0, 24)}…`);
  }
}

// 5. 교사 화면이 실제로 렌더한다.
const guide = fs.readFileSync('src/features/teacher/TeacherCurriculumGuide.tsx', 'utf8');
for (const marker of [
  '나. 과목 목표',
  '가. 내용 체계',
  '나. 단원별 핵심 내용',
  '핵심 아이디어',
  '성취기준 해설',
  '가. 교수·학습의 방향',
  '나. 교수·학습 방법',
  '가. 평가의 방향',
  '나. 평가 방법',
  'MODULE_CORE_CONTENTS',
  'TEACHING_DIRECTIONS',
  'ASSESSMENT_METHODS',
]) {
  assert(guide.includes(marker), `TeacherCurriculumGuide.tsx: '${marker}'가 없다`);
}

// 문서가 접힌 서랍 뒤에 숨으면 교사가 찾지 못한다. 탭을 열면 바로 보여야 한다.
const hub = fs.readFileSync('src/features/teacher/TeacherHub.tsx', 'utf8');
const guideUse = hub.indexOf('<TeacherCurriculumGuide />');
assert(guideUse !== -1, 'TeacherHub.tsx: 과목 교육과정 문서를 렌더하지 않는다');
if (guideUse !== -1) {
  // 앞쪽에 열린 <details>가 닫히지 않은 채 남아 있으면 문서가 그 안에 들어 있다는 뜻이다.
  const before = hub.slice(0, guideUse);
  const opened = (before.match(/<details\b/g) ?? []).length;
  const closed = (before.match(/<\/details>/g) ?? []).length;
  assert(
    opened === closed,
    'TeacherHub.tsx: 교육과정 문서를 접힌 서랍 안에 넣지 않는다',
  );
}

if (failures.length > 0) {
  console.error('교육과정 문서 계약 실패:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `교육과정 문서 계약 통과: 단원 ${MODULES.length}개 핵심 내용, `
  + `교수·학습 ${TEACHING_DIRECTIONS.length + TEACHING_METHODS.length}항목, `
  + `평가 ${ASSESSMENT_DIRECTIONS.length + ASSESSMENT_METHODS.length}항목.`,
);
