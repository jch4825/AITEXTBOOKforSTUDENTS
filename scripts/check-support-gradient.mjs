import fs from 'node:fs';
import path from 'node:path';

/**
 * 비주얼 노벨 장면의 지원 수준 기울기 검사.
 *
 * sceneCopy(full, light, challenge)는 같은 사건을 지원 수준에 맞춰 세 벌로 쓴 것이다.
 * full은 가장 많은 지원이 필요한 학생이 읽는 문장이므로 light보다 길어서는 안 된다.
 *
 * m3~m6 168개 장면에서 이 순서가 통째로 뒤집혀 있었고, 타입 검사도 다른 계약 검사도
 * 문자열 순서는 보지 않으므로 전부 통과했다. 같은 사고를 다시 내지 않기 위한 검사다.
 */

const root = process.cwd();
const studiosDir = path.join(root, 'src', 'data', 'studios');

const SCENE = /sceneCopy\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'/g;
const CHARACTERS = /진우|윤아|아이미|민준/;
const YOCHE = /요[.!?]?["”]*\s*$/;

const files = fs
  .readdirSync(studiosDir)
  .filter((name) => /^m[1-6]\.ts$/.test(name))
  .sort();

const errors = [];
const stats = [];

for (const name of files) {
  const source = fs.readFileSync(path.join(studiosDir, name), 'utf8');
  let match;
  let index = 0;
  let scenes = 0;
  let yoche = 0;
  let narrativeChallenge = 0;

  while ((match = SCENE.exec(source)) !== null) {
    const [, full, light] = match;
    const challenge = match[3];
    scenes += 1;
    if (YOCHE.test(full)) yoche += 1;
    if (CHARACTERS.test(challenge)) narrativeChallenge += 1;

    if (full.length > light.length) {
      errors.push(
        `${name} 장면 ${index}: full(${full.length}자)이 light(${light.length}자)보다 깁니다. `
        + `인자 순서가 뒤바뀌었을 수 있습니다.\n      full : ${full.slice(0, 50)}\n      light: ${light.slice(0, 50)}`,
      );
    }
    index += 1;
  }

  if (scenes === 0) {
    errors.push(`${name}에서 sceneCopy를 하나도 찾지 못했습니다.`);
    continue;
  }
  stats.push({ name, scenes, yoche, narrativeChallenge });
}

if (errors.length > 0) {
  console.error('Support gradient contract failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const totalScenes = stats.reduce((sum, s) => sum + s.scenes, 0);
console.log(`Support gradient contract passed: ${totalScenes} scenes, full never longer than light.`);

// 아래 두 수치는 실패 조건이 아니라 남은 과제를 눈에 보이게 두는 용도다.
// challenge 슬롯이 서사가 아니라 해설 명제로 쓰인 모듈은 도전적 수준 학생만 이야기에서 빠진다.
for (const s of stats) {
  console.log(
    `  ${s.name}: ${s.scenes}장면 · full 요체 ${s.yoche}/${s.scenes}`
    + ` · challenge 서사 ${s.narrativeChallenge}/${s.scenes}`,
  );
}
