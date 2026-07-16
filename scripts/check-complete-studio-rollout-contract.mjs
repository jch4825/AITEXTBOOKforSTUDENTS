import fs from 'node:fs';

const MODULES = {
  M3: {
    studioFile: 'src/data/studios/m3.ts',
    studioSymbol: 'M3_STUDIOS',
    studioIds: ['m3-question-detective', 'm3-story-coauthor', 'm3-image-description-review'],
    lessonIds: ['m3-l1', 'm3-l5', 'm3-l9'],
    bridgeFile: 'src/data/supportBridges/m3.ts',
    bridgeSymbol: 'M3_SUPPORT_BRIDGES',
    bridgeIds: ['m3-l2', 'm3-l3', 'm3-l4', 'm3-l6', 'm3-l7', 'm3-l8', 'm3-l10'],
    portfolioFile: 'src/data/modulePortfolios/m3.ts',
    portfolioSymbol: 'M3_PORTFOLIO',
    portfolioLessonId: 'm3-l11',
    artifactTitles: ['나의 질문 설계 카드', 'AI와 나의 이야기 보드', '그림 설명 확인표'],
  },
  M4: {
    studioFile: 'src/data/studios/m4.ts',
    studioSymbol: 'M4_STUDIOS',
    studioIds: ['m4-answer-verification', 'm4-photo-sharing-safety', 'm4-ad-clue-detective'],
    lessonIds: ['m4-l1', 'm4-l5', 'm4-l10'],
    bridgeFile: 'src/data/supportBridges/m4.ts',
    bridgeSymbol: 'M4_SUPPORT_BRIDGES',
    bridgeIds: ['m4-l2', 'm4-l3', 'm4-l4', 'm4-l6', 'm4-l7', 'm4-l8', 'm4-l9'],
    portfolioFile: 'src/data/modulePortfolios/m4.ts',
    portfolioSymbol: 'M4_PORTFOLIO',
    portfolioLessonId: 'm4-l11',
    artifactTitles: ['AI 답 확인 기록', '사진 공유 전 확인 카드', '광고 단서 표시판'],
  },
  M6: {
    studioFile: 'src/data/studios/m6.ts',
    studioSymbol: 'M6_STUDIOS',
    studioIds: ['m6-shopping-choice', 'm6-transit-change', 'm6-safe-self-introduction'],
    lessonIds: ['m6-l1', 'm6-l4', 'm6-l11'],
    bridgeFile: 'src/data/supportBridges/m6.ts',
    bridgeSymbol: 'M6_SUPPORT_BRIDGES',
    bridgeIds: ['m6-l2', 'm6-l3', 'm6-l5', 'm6-l6', 'm6-l7', 'm6-l8', 'm6-l9', 'm6-l10'],
    portfolioFile: 'src/data/modulePortfolios/m6.ts',
    portfolioSymbol: 'M6_PORTFOLIO',
    portfolioLessonId: 'm6-l12',
    artifactTitles: ['나의 장보기 판단표', '안전 이동 계획 카드', '상대에 맞춘 자기소개 카드'],
  },
};

function readRequired(path) {
  if (!fs.existsSync(path)) throw new Error(`${path} is missing`);
  return fs.readFileSync(path, 'utf8');
}

function requireToken(source, token, message) {
  if (!source.includes(token)) throw new Error(`${message}: ${token}`);
}

const studioIndex = readRequired('src/data/studios/index.ts');
const bridgeIndex = readRequired('src/data/supportBridges/index.ts');
const portfolioIndex = readRequired('src/data/modulePortfolios/index.ts');

function checkModule(label, config) {
  const studio = readRequired(config.studioFile);
  const bridge = readRequired(config.bridgeFile);
  const portfolio = readRequired(config.portfolioFile);

  for (const id of config.studioIds) requireToken(studio, `id: '${id}'`, `${label} studio id missing`);
  for (const id of config.lessonIds) requireToken(studio, `lessonId: '${id}'`, `${label} studio lesson missing`);
  for (const title of config.artifactTitles) requireToken(studio, title, `${label} artifact missing`);

  const preparedCount = (studio.match(/source: 'prepared'/g) ?? []).length;
  if (preparedCount !== 3) throw new Error(`${label} must have 3 prepared AI contributions, got ${preparedCount}`);

  for (const id of config.bridgeIds) requireToken(bridge, `lessonId: '${id}'`, `${label} bridge missing`);
  requireToken(portfolio, `lessonId: '${config.portfolioLessonId}'`, `${label} portfolio lesson missing`);
  for (const id of config.lessonIds) requireToken(portfolio, `'${id}'`, `${label} portfolio studio reference missing`);

  requireToken(studioIndex, `import { ${config.studioSymbol} }`, `${label} studio registry import missing`);
  requireToken(studioIndex, `...${config.studioSymbol}`, `${label} studio registry spread missing`);
  requireToken(bridgeIndex, `import { ${config.bridgeSymbol} }`, `${label} bridge registry import missing`);
  requireToken(bridgeIndex, `...${config.bridgeSymbol}`, `${label} bridge registry spread missing`);
  requireToken(portfolioIndex, `import { ${config.portfolioSymbol} }`, `${label} portfolio registry import missing`);
  requireToken(
    portfolioIndex,
    `[${config.portfolioSymbol}.lessonId, ${config.portfolioSymbol}]`,
    `${label} portfolio registry entry missing`,
  );

  if (label === 'M3') {
    requireToken(studio, "kind: 'image'", 'M3 image review stimulus missing');
    requireToken(studio, '/AITEXTBOOKforSTUDENTS/lessons/m3-l9.webp', 'M3 image path missing');
  }
  if (label === 'M4') {
    const imageCount = (studio.match(/kind: 'image'/g) ?? []).length;
    if (imageCount < 2) throw new Error(`M4 needs 2 prepared image stimuli, got ${imageCount}`);
    requireToken(studio, '믿을 만한 어른', 'M4 trusted-adult safety wording missing');
  }
  if (label === 'M6') {
    requireToken(studio, '준비된 시뮬레이션', 'M6 transit simulation disclosure missing');
    requireToken(studio, '실시간 길 안내', 'M6 live-route disclaimer missing');
  }

  console.log(`${label} rollout contract passed`);
}

const requested = process.argv[2]?.toUpperCase();
if (requested && !MODULES[requested]) {
  throw new Error(`unknown module ${requested}; use M3, M4, or M6`);
}

const selected = requested ? [[requested, MODULES[requested]]] : Object.entries(MODULES);
for (const [label, config] of selected) checkModule(label, config);

if (!requested) {
  const allStudioFiles = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'].map((id) => readRequired(`src/data/studios/${id}.ts`));
  const allBridgeFiles = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'].map((id) => readRequired(`src/data/supportBridges/${id}.ts`));

  const studioCount = allStudioFiles.reduce((sum, source) => sum + (source.match(/lessonId: 'm\d-l\d+'/g) ?? []).length, 0);
  const bridgeCount = allBridgeFiles.reduce((sum, source) => sum + (source.match(/lessonId: 'm\d-l\d+'/g) ?? []).length, 0);
  const portfolioCount = (portfolioIndex.match(/\[M\d_PORTFOLIO\.lessonId, M\d_PORTFOLIO\]/g) ?? []).length;
  const preparedCount = allStudioFiles.reduce((sum, source) => sum + (source.match(/source: 'prepared'/g) ?? []).length, 0);

  if (studioCount !== 18) throw new Error(`complete rollout needs 18 studios, got ${studioCount}`);
  if (bridgeCount !== 44) throw new Error(`complete rollout needs 44 bridges, got ${bridgeCount}`);
  if (portfolioCount !== 6) throw new Error(`complete rollout needs 6 portfolios, got ${portfolioCount}`);
  if (preparedCount !== 18) throw new Error(`complete rollout needs 18 prepared AI contributions, got ${preparedCount}`);

  const teacherCopy = [
    readRequired('src/features/teacher/TeacherHub.tsx'),
    readRequired('docs/teacher-guide/m3-m4-m6-studio-expansion.md'),
  ].join('\n');
  for (const text of ['1~6단원', '18개', '준비된 AI 예시', '카메라·마이크 권한 없이']) {
    requireToken(teacherCopy, text, 'complete teacher guidance missing');
  }

  console.log('complete studio rollout: 18 studios, 44 bridges, 6 portfolios ready');
}
