import { readStudioSource } from './lib/studio-source.mjs';

/**
 * 비주얼 노벨 장면의 지원 수준 기울기 검사.
 *
 * 한 장면의 각본은 지원 수준에 맞춰 세 벌로 쓴다. full은 가장 많은 지원이 필요한
 * 학생이 읽는 문장이므로 light보다 길어서는 안 된다.
 *
 * m3~m6 168개 장면에서 이 순서가 통째로 뒤집혀 있었고, 타입 검사도 다른 계약 검사도
 * 문자열 순서는 보지 않으므로 전부 통과했다. 같은 사고를 다시 내지 않기 위한 검사다.
 *
 * 두 가지를 고쳤다.
 *  1. 원문을 `src/data/studios/mN.ts`에서 직접 읽고 있었다. 그 파일들이 모듈 폴더 아래
 *     `lNN.ts`로 쪼개진 뒤로 대상 파일이 0개가 되어 "0 scenes 통과"를 계속 찍고 있었다.
 *     다른 검사들과 같이 readStudioSource로 폴더를 이어 붙여 읽는다.
 *  2. 각본이 `sceneCopy` 한 칸에서 `sceneBeats` 여러 칸으로 늘어났다. 칸마다 세 수준을
 *     쓰므로 칸 단위로 기울기를 본다.
 */

const MODULES = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];
const CHARACTERS = /진우|윤아|아이미|민준/;
const YOCHE = /요[.!?]?["”]*\s*$/;

/** 여는 괄호 자리에서 시작해 짝이 맞는 닫는 괄호까지의 구간을 돌려준다. */
function balancedWindow(source, openIndex, open, close) {
  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    if (source[index] === open) depth += 1;
    if (source[index] === close) {
      depth -= 1;
      if (depth === 0) return source.slice(openIndex, index + 1);
    }
  }
  return '';
}

const TRIPLET = /\[\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,?\s*\]/g;
const SINGLE = /sceneCopy\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'/g;

/**
 * 모듈 원문에서 대사 칸을 모두 뽑는다.
 * sceneBeats는 인자 구간 안에서만 세 짝 배열을 찾는다. 파일 어딘가의 문자열 3개짜리
 * 배열(추천 질문 등)을 각본으로 오인하지 않기 위해서다.
 */
function collectBeats(source) {
  const beats = [];

  let cursor = 0;
  while (true) {
    const marker = source.indexOf('sceneBeats(', cursor);
    if (marker < 0) break;
    const openIndex = source.indexOf('(', marker);
    const window = balancedWindow(source, openIndex, '(', ')');
    TRIPLET.lastIndex = 0;
    let triplet;
    while ((triplet = TRIPLET.exec(window)) !== null) {
      beats.push({ full: triplet[1], light: triplet[2], challenge: triplet[3], kind: 'beat' });
    }
    cursor = openIndex + Math.max(window.length, 1);
  }

  SINGLE.lastIndex = 0;
  let single;
  while ((single = SINGLE.exec(source)) !== null) {
    beats.push({ full: single[1], light: single[2], challenge: single[3], kind: 'single' });
  }

  return beats;
}

const errors = [];
const stats = [];

for (const moduleId of MODULES) {
  const source = readStudioSource(`src/data/studios/${moduleId}.ts`);
  const beats = collectBeats(source);

  if (beats.length === 0) {
    errors.push(`${moduleId}에서 각본을 하나도 찾지 못했습니다.`);
    continue;
  }

  let yoche = 0;
  let narrativeChallenge = 0;
  beats.forEach((beat, index) => {
    if (YOCHE.test(beat.full)) yoche += 1;
    if (CHARACTERS.test(beat.challenge)) narrativeChallenge += 1;

    if (beat.full.length > beat.light.length) {
      errors.push(
        `${moduleId} 대사 칸 ${index}: full(${beat.full.length}자)이 light(${beat.light.length}자)보다 깁니다. `
        + `인자 순서가 뒤바뀌었을 수 있습니다.\n      full : ${beat.full.slice(0, 50)}\n      light: ${beat.light.slice(0, 50)}`,
      );
    }
    if (beat.light.length > beat.challenge.length) {
      errors.push(
        `${moduleId} 대사 칸 ${index}: light(${beat.light.length}자)가 challenge(${beat.challenge.length}자)보다 깁니다.`
        + `\n      light    : ${beat.light.slice(0, 50)}\n      challenge: ${beat.challenge.slice(0, 50)}`,
      );
    }
  });

  stats.push({
    moduleId,
    beats: beats.length,
    rewritten: beats.filter((beat) => beat.kind === 'beat').length,
    yoche,
    narrativeChallenge,
  });
}

if (errors.length > 0) {
  console.error('Support gradient contract failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const total = stats.reduce((sum, item) => sum + item.beats, 0);
console.log(`Support gradient contract passed: ${total} beats, full ≤ light ≤ challenge.`);

// 아래 수치는 실패 조건이 아니라 남은 과제를 눈에 보이게 두는 용도다.
// challenge 슬롯이 서사가 아니라 해설 명제로 쓰인 모듈은 도전적 수준 학생만 이야기에서 빠진다.
for (const item of stats) {
  console.log(
    `  ${item.moduleId}: ${item.beats}칸(대사 칸으로 다시 쓴 것 ${item.rewritten})`
    + ` · full 요체 ${item.yoche}/${item.beats}`
    + ` · challenge 서사 ${item.narrativeChallenge}/${item.beats}`,
  );
}
