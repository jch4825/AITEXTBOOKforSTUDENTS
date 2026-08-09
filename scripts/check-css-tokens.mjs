import fs from 'node:fs';
import path from 'node:path';

/**
 * CSS 토큰 소비 검사.
 *
 * `var(--없는변수)`는 폴백이 없으면 선언 전체가 무효가 되고, 그 속성은 unset으로 계산된다.
 * 조용히 사라지므로 빌드도 타입 검사도 잡지 못한다. 실제로 `.visual-novel-*:focus-visible`이
 * 정의된 적 없는 `--focus-ring`을 써서, 전역 포커스 링보다 구체적인 선택자가 그것을 덮어쓰고
 * 값은 무효가 되어 비주얼 노벨 조작 버튼에서 포커스 링이 통째로 사라져 있었다.
 *
 * 런타임에 인라인 style로 주입하는 변수는 CSS 안에 정의가 없는 것이 정상이므로,
 * 주입하는 컴포넌트를 함께 적어 예외로 둔다. 주입처가 사라지면 이 검사가 잡는다.
 */

const root = process.cwd();
const CSS_FILES = ['src/index.css', 'src/App.css'];

/**
 * 컴포넌트가 인라인 style로 주입하는 변수 → 무엇이 주입하는지에 대한 설명.
 * 경로를 박아 두면 파일이 옮겨질 때마다 검사가 헛돌므로, src 전체에서 주입 여부만 확인한다.
 */
const RUNTIME_INJECTED = {
  '--episode-accent': '단원 카드가 단원별 강조색을 주입',
  '--episode-soft': '단원 카드가 단원별 배경색을 주입',
  '--hero-accent': '단원 표지가 강조색을 주입',
  '--block-color': '교사 학습지 블록이 글자색을 주입',
  '--block-font-size': '교사 학습지 블록이 글자 크기를 주입',
  '--worksheet-accent': '교사 학습지 A4 면이 강조색을 주입',
  '--worksheet-soft': '교사 학습지 A4 면이 보조 배경색을 주입',
  '--sparkle-size': '마지막 장면 꽃가루가 크기를 주입',
  '--sparkle-duration': '마지막 장면 꽃가루가 재생 시간을 주입',
  '--sparkle-delay': '마지막 장면 꽃가루가 지연 시간을 주입',
  '--sparkle-rotation': '마지막 장면 꽃가루가 회전값을 주입',
  '--sparkle-rise': '마지막 장면 꽃가루가 이동 거리를 주입',
  '--dx': '폭죽 파티클이 좌표를 주입',
  '--dy': '폭죽 파티클이 좌표를 주입',
};

const defined = new Set();
const used = [];

for (const rel of CSS_FILES) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  const source = fs.readFileSync(full, 'utf8');
  for (const match of source.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)) defined.add(match[1]);
  for (const match of source.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)\s*([,)])/g)) {
    used.push({ file: rel, name: match[1], hasFallback: match[2] === ',' });
  }
}

if (defined.size === 0) {
  console.error('CSS에서 토큰 정의를 하나도 찾지 못했습니다. 경로를 확인하세요.');
  process.exit(1);
}

function walk(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full));
    else if (/\.tsx?$/.test(entry.name)) found.push(full);
  }
  return found;
}

const sourceFiles = walk(path.join(root, 'src'));
const errors = [];
const seen = new Set();

for (const use of used) {
  if (use.hasFallback || defined.has(use.name)) continue;
  if (seen.has(use.name)) continue;
  seen.add(use.name);

  const reason = RUNTIME_INJECTED[use.name];
  if (!reason) {
    errors.push(
      `${use.file}: var(${use.name})가 정의도 폴백도 없습니다. `
      + `선언이 통째로 무효가 되어 해당 속성이 조용히 사라집니다.`,
    );
    continue;
  }
  // 예외로 둔 변수라도 주입하는 코드가 아직 남아 있는지 확인한다.
  if (!sourceFiles.some((file) => fs.readFileSync(file, 'utf8').includes(use.name))) {
    errors.push(
      `${use.file}: var(${use.name})는 "${reason}"를 전제로 예외 처리했는데 `
      + `src 어디에서도 주입하지 않습니다. 이제 정의 없는 변수를 쓰고 있습니다.`,
    );
  }
}

if (errors.length > 0) {
  console.error('CSS token contract failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `CSS token contract passed: ${defined.size} tokens defined, `
  + `${seen.size} runtime-injected, no undefined var() without a fallback.`,
);
