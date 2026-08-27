import fs from 'node:fs';

/**
 * 학년군 전환 잠금 계약.
 *
 * 학년군(중학·고등)은 표지에서 고르는 운영 결정이다. 어느 학년군 성취기준으로
 * 평가할지가 걸려 있으므로 차시 화면에서 스티커 한 번에 오갈 값이 아니다.
 *
 * 규약:
 *  1. 지원 수준 스티커는 중학과 고등 사이를 직접 잇지 않는다. 누르면 늘 충분한
 *     지원으로 내려가고, 충분한 지원에서 한 번 더 눌러야 반대쪽 학년군을 묻는다.
 *  2. 학년군을 바꾸는 길목에는 확인 창이 있고, 확인을 받은 뒤에만 값이 바뀐다.
 *  3. 확인 창은 학년군 차이를 설명한다. 뼈대는 같고 성취기준과 표현의 난이도가
 *     달라진다는 두 가지가 모두 들어가야 한다.
 *  4. 학년군은 difficulty와 따로 저장되며, 충분한 지원에 머무는 동안에도 유지된다.
 *
 * 예전에는 NEXT = { hard: 'normal', normal: 'easy', easy: 'hard' } 한 줄로
 * 세 값을 돌려서 고등에서 중학으로 아무 확인 없이 건너뛸 수 있었다.
 */

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const toggle = fs.readFileSync('src/components/controls/DifficultyToggle.tsx', 'utf8');
const dialog = fs.readFileSync('src/components/controls/GradeBandChangeDialog.tsx', 'utf8');
const storage = fs.readFileSync('src/utils/storage.ts', 'utf8');
const settings = fs.readFileSync('src/context/SettingsContext.tsx', 'utf8');
const types = fs.readFileSync('src/types.ts', 'utf8');

// 1. 스티커가 학년군끼리 직접 잇지 않는다.
assert(
  !/NEXT\s*:\s*Record<Difficulty,\s*Difficulty>/.test(toggle),
  '지원 수준 스티커가 세 값을 한 줄로 돌리고 있다 — 학년군끼리 직접 건너뛴다',
);
assert(
  /const\s+OTHER_BAND\s*:\s*Record<GradeBand,\s*GradeBand>\s*=\s*\{\s*normal:\s*'hard'\s*,\s*hard:\s*'normal'\s*,?\s*\}/.test(toggle),
  '충분한 지원에서 건너갈 학년군을 OTHER_BAND로 선언해야 한다',
);
// 확인을 거치지 않는 경로는 오직 충분한 지원으로 내려가는 것뿐이다.
// `.`는 개행을 넘지 못한다. 여러 줄로 쓴 setDifficulty 호출이 통째로 스캔에서 빠져
// 확인 없는 학년군 전환이 조용히 통과하던 구멍이 있었다. 후행 쉼표는 벗겨야
// 여러 줄로 쓴 정상 호출이 오탐으로 걸리지 않는다.
const directSets = [...toggle.matchAll(/setDifficulty\(([\s\S]*?)\)/g)]
  .map((m) => m[1].trim().replace(/,$/, ''));
assert(directSets.length > 0, '지원 수준 스티커가 setDifficulty를 부르지 않는다');
for (const argument of directSets) {
  assert(
    argument === "'easy'" || argument === 'pendingBand',
    `지원 수준 스티커가 setDifficulty(${argument})를 확인 없이 부른다 — 충분한 지원으로 내려가는 길만 허용된다`,
  );
}
assert(
  /setDifficulty\('easy'\)/.test(toggle),
  '중학·고등에서 누르면 충분한 지원으로 내려가야 한다',
);

// 2. 학년군 변경은 확인 창을 거친다.
assert(/GradeBandChangeDialog/.test(toggle), '지원 수준 스티커가 확인 창을 쓰지 않는다');
assert(
  /setPendingBand\(nextBand\)/.test(toggle),
  '충분한 지원에서 한 번 더 누르면 반대쪽 학년군을 확인 창에 올려야 한다',
);
assert(
  /onConfirm=\{[\s\S]*?setDifficulty\(pendingBand\)/.test(toggle),
  '학년군은 확인 창의 예를 받은 뒤에만 바뀌어야 한다',
);
assert(/role="dialog"/.test(dialog) && /aria-modal="true"/.test(dialog), '확인 창은 대화 상자로 표시되어야 한다');
assert(/onCancel/.test(dialog) && /onConfirm/.test(dialog), '확인 창에는 예와 아니요가 모두 있어야 한다');
assert(/Escape/.test(dialog), 'Escape로 확인 창을 닫을 수 있어야 한다');

// 3. 확인 창이 학년군 차이를 설명한다.
// 확인 창은 키보드와 좁은 화면에서도 실제로 조작할 수 있어야 한다. 아래 네 가지는
// 모두 실측으로 확인된 결함을 고친 자리이며, 없으면 확인 게이트가 우회되거나 잘린다.
assert(
  /latestCancel/.test(dialog) && /\}, \[target\]\);/.test(dialog),
  '초점 effect가 onCancel에 의존하면 부모가 다시 그려질 때마다 초점이 튄다 — 최신 함수는 ref로 넘기고 target만 의존해야 한다',
);
assert(/restoreTo\?\.focus\?\.\(\)/.test(dialog), '창을 닫은 뒤 초점을 원래 자리로 돌려놓아야 한다');
{
  // 앞·뒤 두 방향 모두 '패널 밖' 조건을 가져야 반쪽 트랩이 되지 않는다.
  const outside = dialog.match(/!panelRef\.current\?\.contains\(active\)/g) ?? [];
  assert(outside.length >= 2, `Tab 가두기가 한쪽 방향에만 있다 (패널 밖 조건 ${outside.length}곳) — 앞으로 Tab을 누르면 배경으로 새어 나간다`);
}
assert(/pressedBackdrop/.test(dialog), '배경을 눌러 시작한 클릭만 취소로 쳐야 한다 — 글을 끌어서 선택하다 창이 닫힌다');
assert(
  /max-h-\[calc\(100dvh-2rem\)\]/.test(dialog) && /overflow-y-auto/.test(dialog),
  '확인 창에 높이 상한과 스크롤이 없으면 가로로 눕힌 휴대전화에서 버튼이 잘린다',
);

assert(/뼈대가 같/.test(dialog), '확인 창은 배우는 뼈대가 같다는 점을 알려야 한다');
assert(/성취기준의 난이도/.test(dialog), '확인 창은 성취기준의 난이도 차이를 알려야 한다');
assert(/표현의 난이도/.test(dialog), '확인 창은 표현 난이도 차이를 알려야 한다');
assert(/9학년군/.test(dialog) && /12학년군/.test(dialog), '확인 창은 두 학년군 평가 기준을 밝혀야 한다');

// 4. 학년군은 따로 저장되고 충분한 지원에서도 유지된다.
assert(/export type GradeBand/.test(types), 'GradeBand 타입이 없다');
assert(/gradeBand:\s*GradeBand;/.test(types), 'SettingsState에 gradeBand가 없다');
assert(
  /difficulty === 'easy' \? storedBand : difficulty/.test(storage),
  '저장된 학년군은 충분한 지원일 때만 이어받고, 그 밖에는 difficulty를 따라야 한다',
);
assert(
  /gradeBand:\s*d === 'easy' \? s\.gradeBand : d/.test(settings),
  '충분한 지원으로 내려갈 때 직전 학년군을 기억해야 한다',
);

if (failures.length) {
  console.error(`grade band guard contract failed: ${failures.length}건`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('grade band guard: 중학↔고등 직접 전환 차단, 확인 창 설명 4항목, 학년군 지속 저장 통과');
