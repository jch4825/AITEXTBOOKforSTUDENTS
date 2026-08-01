import fs from 'node:fs';
import ts from 'typescript';
import { readStudioSource } from './lib/studio-source.mjs';

/**
 * 학습목표 단일 진실 원천 검사 (docs/remodel2/05-ENGINE-SPEC.md §6).
 *
 * 목표 문자열은 studios(visualNovel.objective)·lessons(objective) 두 곳에 실려 학생 화면에
 * 뜨고, 검사 스크립트에도 박혀 있다. 한 곳만 고치면 화면과 기록이 서로 다른 목표를 말하게
 * 되므로 src/data/lessonObjectives.ts를 기준으로 두고 나머지가 따라오는지 확인한다.
 */

const MODULES = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];

/** 활동을 서술하지 않고 뭉개는 서술어. 목표가 "무엇을 해냈는지" 말하지 못하게 만든다. */
const VAGUE_PREDICATES = ['알아봐요', '살펴봐요', '시험해 봐요', '느껴 봐요'];

const failures = [];
function assert(condition, message) {
  if (!condition) failures.push(message);
}

function loadObjectives() {
  const source = fs.readFileSync('src/data/lessonObjectives.ts', 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
}

/** `lessonId: '...'` 다음에 오는 첫 `objective: '...'`를 짝지어 읽는다. */
function readObjectives(source) {
  const found = new Map();
  const pattern = /lessonId:\s*'(m\d-l\d+)'[\s\S]*?objective:\s*'((?:[^'\\]|\\.)*)'/g;
  for (const hit of source.matchAll(pattern)) {
    if (!found.has(hit[1])) {
      found.set(hit[1], hit[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
    }
  }
  return found;
}

function readLessonObjectives(source) {
  const found = new Map();
  const pattern = /id:\s*'(m\d-l\d+)'[\s\S]*?objective:\s*'((?:[^'\\]|\\.)*)'/g;
  for (const hit of source.matchAll(pattern)) {
    if (!found.has(hit[1])) {
      found.set(hit[1], hit[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
    }
  }
  return found;
}

const { LESSON_OBJECTIVES } = await loadObjectives();

const studioObjectives = new Map();
const lessonObjectives = new Map();
for (const moduleId of MODULES) {
  for (const [id, text] of readObjectives(readStudioSource(`src/data/studios/${moduleId}.ts`))) {
    studioObjectives.set(id, text);
  }
  for (const [id, text] of readLessonObjectives(fs.readFileSync(`src/data/lessons/${moduleId}.ts`, 'utf8'))) {
    lessonObjectives.set(id, text);
  }
}

const seen = new Set();
let enforced = 0;

for (const entry of LESSON_OBJECTIVES) {
  assert(!seen.has(entry.lessonId), `${entry.lessonId}: SSOT에 중복 등록`);
  seen.add(entry.lessonId);

  assert(entry.studentMission.trim().length > 0, `${entry.lessonId}: studentMission이 비어 있음`);
  assert(entry.teacherObjective.trim().length > 0, `${entry.lessonId}: teacherObjective가 비어 있음`);
  assert(entry.standards.length > 0, `${entry.lessonId}: 성취기준 코드가 없음`);

  for (const predicate of VAGUE_PREDICATES) {
    assert(
      !entry.studentMission.includes(predicate),
      `${entry.lessonId}: studentMission에 금지 서술어 "${predicate}"가 있음 — 학생이 해낸 일로 바꿔야 한다`,
    );
  }

  // 아직 적용하지 않은 차시는 강제하지 않는다. Wave 진행 중 부분 적용을 허용한다.
  if (entry.status !== 'applied') continue;
  enforced += 1;

  const studio = studioObjectives.get(entry.lessonId);
  const lesson = lessonObjectives.get(entry.lessonId);

  assert(studio !== undefined, `${entry.lessonId}: studios에 objective가 없음`);
  assert(lesson !== undefined, `${entry.lessonId}: lessons에 objective가 없음`);

  if (studio !== undefined) {
    assert(
      studio === entry.studentMission,
      `${entry.lessonId}: studios의 objective가 SSOT와 다름\n    SSOT   : ${entry.studentMission}\n    studios: ${studio}`,
    );
  }
  if (lesson !== undefined) {
    assert(
      lesson === entry.studentMission,
      `${entry.lessonId}: lessons의 objective가 SSOT와 다름\n    SSOT   : ${entry.studentMission}\n    lessons: ${lesson}`,
    );
  }
}

// 스튜디오 62차시는 모두 SSOT에 있어야 한다. 빠지면 그 차시만 조용히 어긋날 수 있다.
const roles = fs.readFileSync('src/data/lessonRoles.ts', 'utf8');
const studioLessonIds = [...roles.matchAll(/lessonId:\s*'(m\d-l\d+)',\s*moduleId:\s*'m\d',\s*role:\s*'studio'/g)]
  .map((hit) => hit[1]);
for (const lessonId of studioLessonIds) {
  assert(seen.has(lessonId), `${lessonId}: 스튜디오 차시인데 SSOT에 없음`);
}

if (failures.length > 0) {
  for (const message of failures) console.error(` - ${message}`);
  throw new Error(`learning objective SSOT contract failed: ${failures.length} problem(s)`);
}

console.log(
  `learning objective SSOT: ${LESSON_OBJECTIVES.length} objectives, ${enforced} enforced across studios and lessons`,
);
