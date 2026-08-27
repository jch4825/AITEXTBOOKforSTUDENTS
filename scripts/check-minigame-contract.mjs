import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const rolesPath = path.join(root, 'src', 'data', 'lessonRoles.ts');
const registryPath = path.join(root, 'src', 'features', 'studio', 'minigames', 'registry.ts');
const minigameRoot = path.dirname(registryPath);

const rolesSource = fs.readFileSync(rolesPath, 'utf8');
const registrySource = fs.readFileSync(registryPath, 'utf8');
const studioList = rolesSource.match(/STUDIO_LESSON_IDS\s*=\s*\[([\s\S]*?)\]\s*as const/);

if (!studioList) {
  throw new Error('STUDIO_LESSON_IDS를 읽지 못했습니다.');
}

const studioIds = [...studioList[1].matchAll(/'(m[1-6]-l\d+)'/g)].map((match) => match[1]);
const entries = [...registrySource.matchAll(/'(m[1-6]-l\d+)'\s*:\s*lazy\(\(\)\s*=>\s*import\('([^']+)'\)\)/g)]
  .map((match) => ({ lessonId: match[1], importPath: match[2] }));

const errors = [];
const registeredIds = entries.map((entry) => entry.lessonId);

if (studioIds.length !== 62) {
  errors.push(`스튜디오 차시 수가 62가 아닙니다: ${studioIds.length}`);
}

const duplicates = registeredIds.filter((id, index) => registeredIds.indexOf(id) !== index);
if (duplicates.length > 0) {
  errors.push(`registry 중복 차시: ${[...new Set(duplicates)].join(', ')}`);
}

const missing = studioIds.filter((id) => !registeredIds.includes(id));
const extra = registeredIds.filter((id) => !studioIds.includes(id));
if (missing.length > 0) errors.push(`미등록 스튜디오: ${missing.join(', ')}`);
if (extra.length > 0) errors.push(`스튜디오가 아닌 registry 항목: ${extra.join(', ')}`);

for (let moduleNumber = 1; moduleNumber <= 6; moduleNumber += 1) {
  const expected = studioIds.filter((id) => id.startsWith(`m${moduleNumber}-`)).length;
  const actual = registeredIds.filter((id) => id.startsWith(`m${moduleNumber}-`)).length;
  if (actual !== expected) {
    errors.push(`M${moduleNumber} 등록 수 불일치: ${actual}/${expected}`);
  }
}

if (/^import\s+.+from\s+['"]\.\/m[1-6]\//m.test(registrySource)) {
  errors.push('registry에 정적 게임 import가 있습니다. lazy import만 사용해야 합니다.');
}

const forbiddenMetric = /progress=\{\{\s*label:\s*'(?:일치도|일치율|겹침|선명도|완성도)'/;
const tooSmallClass = /text-\[(\d+)px\]|text-xs/g;

for (const entry of entries) {
  const componentPath = path.resolve(minigameRoot, `${entry.importPath}.tsx`);
  if (!fs.existsSync(componentPath)) {
    errors.push(`${entry.lessonId} 파일 없음: ${path.relative(root, componentPath)}`);
    continue;
  }

  const source = fs.readFileSync(componentPath, 'utf8');
  if (!/export default function|export default \w+/.test(source)) {
    errors.push(`${entry.lessonId}에 default export가 없습니다.`);
  }
  if (forbiddenMetric.test(source)) {
    errors.push(`${entry.lessonId}가 추상 숫자 임계값을 학생 화면에 표시합니다.`);
  }

  for (const match of source.matchAll(tooSmallClass)) {
    const px = match[1] ? Number(match[1]) : 12;
    if (px < 14) {
      errors.push(`${entry.lessonId}에 14px 미만 글자 클래스가 있습니다: ${match[0]}`);
      break;
    }
  }
}

/* 놀이는 태블릿·PC 크기에서만 연다.
   미니게임의 조작은 드래그·조준·타이밍이라 390px 휴대전화에서는 판과 손가락이 겹쳐
   조작 자체가 성립하지 않는다. 슬롯이 다시 무조건 게임을 그리면 이 계약이 깨지므로
   화면 크기 게이트가 슬롯 안에 남아 있는지 확인한다. */
const viewportGatePath = path.join(minigameRoot, 'useMiniGameViewport.ts');
const slotPath = path.join(minigameRoot, 'MiniGameSlot.tsx');
if (!fs.existsSync(viewportGatePath)) {
  errors.push('화면 크기 게이트가 없습니다: src/features/studio/minigames/useMiniGameViewport.ts');
} else {
  const gateSource = fs.readFileSync(viewportGatePath, 'utf8');
  if (!gateSource.includes('(max-width: 767px)')) {
    errors.push('화면 크기 게이트가 태블릿 하한(768px)을 잃었습니다.');
  }
}
const slotSource = fs.readFileSync(slotPath, 'utf8');
if (!slotSource.includes('useMiniGamePlayable')) {
  errors.push('MiniGameSlot이 화면 크기 게이트를 쓰지 않습니다.');
}
if (!slotSource.includes('if (!playable)')) {
  errors.push('MiniGameSlot이 좁은 화면에서 게임을 그리기 전에 빠져나오지 않습니다.');
}

if (errors.length > 0) {
  console.error('Mini-game contract failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Mini-game contract passed: ${registeredIds.length}/${studioIds.length} studios, all lazy-loaded, no abstract threshold labels, minimum declared text size 14px, tablet/PC-only viewport gate.`,
);
