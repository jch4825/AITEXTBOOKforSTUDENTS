/**
 * 고등 심화 과제 계약.
 *
 * 중학과 고등의 차이가 화면 텍스트 밀도와 사실·선택지 각 1개뿐이던 문제를
 * 실제 수행 차등으로 메우는 데이터다. 다음이 무너지면 다시 이름만 다른 같은
 * 수업으로 돌아간다.
 *
 *  1. 62개 스튜디오 차시가 모두 심화 과제를 가진다.
 *  2. 과제가 겨누는 성취기준은 그 차시가 실제로 태깅한 코드다.
 *  3. 과제가 그 차시의 전이 과제를 되풀이하지 않는다.
 *  4. 실시간 AI 연결을 요구하지 않는다(제품 계약: 키 없이 핵심 학습 완결).
 *  5. 교실 밖 수행은 단원마다 1~2차시로 제한한다.
 */

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

const tasksModule = await loadBundled('src/data/highSchoolTasks.ts');
const rolesModule = await loadBundled('src/data/lessonRoles.ts');
const objectivesModule = await loadBundled('src/data/lessonObjectives.ts');
const studiosModule = await loadBundled('src/data/studios/index.ts');

const TASKS = tasksModule.HIGH_SCHOOL_TASKS;
const STUDIO_LESSON_IDS = rolesModule.STUDIO_LESSON_IDS;
const standardsByLesson = new Map(
  objectivesModule.LESSON_OBJECTIVES.map((o) => [o.lessonId, o.standards ?? []]),
);

const MAX_TASK = 120;
const MAX_TITLE = 12;
const MAX_EVIDENCE = 60;
/** 제품 계약상 실시간 AI가 없어도 완결되어야 한다. */
const LIVE_AI_HINT = /(실시간 AI|API|키를 연결|아이미에게 물어보고 받은 답을 기다)/;

assert(
  Object.keys(TASKS).length === STUDIO_LESSON_IDS.length,
  `심화 과제는 스튜디오 ${STUDIO_LESSON_IDS.length}차시 전부에 있어야 한다 (현재 ${Object.keys(TASKS).length}개)`,
);

const communityByModule = new Map();

for (const lessonId of STUDIO_LESSON_IDS) {
  const task = TASKS[lessonId];
  if (!task) { failures.push(`${lessonId}: 심화 과제가 없다`); continue; }

  assert(task.lessonId === lessonId, `${lessonId}: lessonId 키와 값이 다르다`);
  assert(task.title && task.title.length <= MAX_TITLE, `${lessonId}: 과제 이름이 비었거나 ${MAX_TITLE}자를 넘는다`);
  assert(task.task && task.task.length <= MAX_TASK, `${lessonId}: 지시문이 비었거나 ${MAX_TASK}자를 넘는다 (${task.task?.length ?? 0}자)`);
  assert(task.evidence && task.evidence.length <= MAX_EVIDENCE, `${lessonId}: 남길 것이 비었거나 ${MAX_EVIDENCE}자를 넘는다`);

  const tagged = standardsByLesson.get(lessonId) ?? [];
  assert(
    tagged.includes(task.standard),
    `${lessonId}: 겨누는 성취기준 ${task.standard}가 이 차시의 태깅에 없다 (태깅: ${tagged.join(', ')})`,
  );

  assert(!LIVE_AI_HINT.test(task.task), `${lessonId}: 심화 과제가 실시간 AI 연결을 요구한다`);

  const studio = studiosModule.getStudioDefinition(lessonId);
  if (studio) {
    const transfer = `${studio.transfer.title} ${studio.transfer.description}`;
    assert(
      task.task !== studio.transfer.description && task.title !== studio.transfer.title,
      `${lessonId}: 심화 과제가 전이 과제와 같다 — 난도 상승이 없다`,
    );
    assert(transfer.length > 0, `${lessonId}: 전이 과제를 읽을 수 없다`);
  }

  if (task.community) {
    const moduleId = lessonId.split('-')[0];
    communityByModule.set(moduleId, (communityByModule.get(moduleId) ?? 0) + 1);
  }
}

for (const moduleId of ['m1', 'm2', 'm3', 'm4', 'm5', 'm6']) {
  const count = communityByModule.get(moduleId) ?? 0;
  assert(
    count >= 1 && count <= 2,
    `${moduleId}: 교실 밖 수행 과제가 ${count}개다 — 단원마다 1~2개여야 한다`,
  );
}

// 값 안에 작은따옴표가 있으면 TypeScript가 먼저 깨지지만, 이스케이프로 숨겨 들어오는
// 경우를 막기 위해 파싱된 값을 직접 본다. 소스 정규식은 항목 경계를 넘어 오탐한다.
for (const [lessonId, task] of Object.entries(TASKS)) {
  for (const field of ['title', 'task', 'evidence', 'community']) {
    const value = task[field];
    if (typeof value === 'string' && value.includes("'")) {
      failures.push(`${lessonId}.${field}: 작은따옴표가 들어 있다 — 홑낫표를 쓴다`);
    }
  }
}

if (failures.length) {
  console.error(`highschool task contract failed: ${failures.length}건`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

const communityTotal = [...communityByModule.values()].reduce((a, b) => a + b, 0);
console.log(`highschool tasks: ${STUDIO_LESSON_IDS.length}차시 심화 과제, 교실 밖 수행 ${communityTotal}차시`);
