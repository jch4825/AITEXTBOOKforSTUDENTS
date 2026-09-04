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

/* 장르 배정표와의 대조.

   앞선 판의 미니게임은 "버튼 세 개를 아무 순서로 누르면 성공"이라 게임이 아니었다.
   60차시를 서로 다른 장르의 진짜 게임으로 다시 만들면서, 어떤 차시가 어떤 장르를 맡는지를
   genres.ts에 단일 진실 원천으로 두었다. 여기서 registry·실제 파일·학생 화면 이름표가
   그 표와 어긋나지 않는지 함께 본다. */
const genresPath = path.join(minigameRoot, 'genres.ts');
if (!fs.existsSync(genresPath)) {
  errors.push('장르 배정표가 없습니다: src/features/studio/minigames/genres.ts');
} else {
  const genresSource = fs.readFileSync(genresPath, 'utf8');
  const assignments = [...genresSource.matchAll(
    /lessonId:\s*'(m[1-6]-l\d+)',\s*genre:\s*(\d+),\s*genreName:\s*'([^']+)',\s*badge:\s*'([^']+)',\s*component:\s*'(\w+)'/g,
  )].map((match) => ({
    lessonId: match[1], genre: Number(match[2]), genreName: match[3], badge: match[4], component: match[5],
  }));

  const keptIds = [...genresSource.matchAll(/KEPT_LESSON_IDS[^=]*=\s*\[([^\]]*)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/'(m[1-6]-l\d+)'/g)].map((inner) => inner[1]));

  const covered = new Set([...assignments.map((a) => a.lessonId), ...keptIds]);
  const uncovered = studioIds.filter((id) => !covered.has(id));
  if (uncovered.length > 0) {
    errors.push(`장르 배정이 없는 스튜디오: ${uncovered.join(', ')}`);
  }

  /* 한 장르를 세 차시가 나눠 쓰면 같은 조작이 세 번 나온다. 두 번까지만 허용한다. */
  const genreUse = new Map();
  for (const entry of assignments) {
    genreUse.set(entry.genre, (genreUse.get(entry.genre) ?? 0) + 1);
  }
  for (const [genre, count] of genreUse) {
    if (count > 2) errors.push(`장르 ${genre}번을 ${count}개 차시가 씁니다. 최대 2개까지입니다.`);
  }

  const importByLesson = new Map(entries.map((entry) => [entry.lessonId, entry.importPath]));
  for (const entry of assignments) {
    const importPath = importByLesson.get(entry.lessonId);
    if (!importPath) continue;
    if (!importPath.endsWith(`/${entry.component}`)) {
      errors.push(`${entry.lessonId} registry가 ${importPath}를 가리키는데 배정표는 ${entry.component}입니다.`);
      continue;
    }
    const componentPath = path.resolve(minigameRoot, `${importPath}.tsx`);
    if (!fs.existsSync(componentPath)) continue;
    const source = fs.readFileSync(componentPath, 'utf8');
    if (!source.includes(`badge="${entry.badge}"`)) {
      errors.push(`${entry.lessonId}의 학생 화면 이름표가 배정표의 "${entry.badge}"와 다릅니다.`);
    }
    /* 공용 엔진을 쓰지 않으면 프레임 루프·난이도 배율이 게임마다 갈라진다. */
    if (!/from '\.\.\/engine'/.test(source)) {
      errors.push(`${entry.lessonId}가 공용 게임 엔진(../engine)을 쓰지 않습니다.`);
    }
    /* 지원 수준 셋은 스테이지 수만이 아니라 요구 수준이 달라야 한다. */
    if (!/tuning\.(speed|size|tolerance|lives|time|density)/.test(source)) {
      errors.push(`${entry.lessonId}가 지원 수준 배율(tuning)을 쓰지 않습니다.`);
    }
    const stageLabels = [...source.matchAll(/label:\s*'(기본|1단계|2단계)'/g)].length;
    if (stageLabels !== 3) {
      errors.push(`${entry.lessonId}의 스테이지 탭이 기본·1단계·2단계 3개가 아닙니다(${stageLabels}개).`);
    }
  }
}

/* 세 단계는 지원 수준과 상관없이 모두 열려 있어야 한다.
   지원 수준 셋은 뼈대가 같고 요구 수준만 다르다는 것이 제품 계약이다. 예전에는 지원
   수준별로 노출할 스테이지 수를 잘랐고, 그래서 충분한 지원을 쓰는 학생은 뒤쪽 두 판을
   아예 만나지 못했다. 요구 수준의 차이는 tuning이 맡는다. */
const stageHookPath = path.join(minigameRoot, 'useMiniGameStage.ts');
if (!fs.existsSync(stageHookPath)) {
  errors.push('스테이지 훅이 없습니다: src/features/studio/minigames/useMiniGameStage.ts');
} else {
  const hookSource = fs.readFileSync(stageHookPath, 'utf8');
  const capped = /visibleStageCount\s*=\s*[^;]*supportLevel/.test(hookSource);
  if (capped) {
    errors.push('스테이지 노출 수를 지원 수준으로 자르고 있습니다. 세 단계는 모두 열려야 합니다.');
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
