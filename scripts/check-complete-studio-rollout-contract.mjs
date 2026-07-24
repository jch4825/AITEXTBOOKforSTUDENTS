import fs from 'node:fs';

const MODULES = {
  M3: {
    studioFile: 'src/data/studios/m3.ts',
    studioSymbol: 'M3_STUDIOS',
    studioIds: [
      'm3-question-depth-lab',
      'm3-word-evidence-lab',
      'm3-accurate-simple-explanation-lab',
      'm3-word-in-context-studio',
      'm3-story-choice-studio',
      'm3-calculation-verification-lab',
      'm3-evidence-summary-lab',
      'm3-delayed-answer-quiz-studio',
      'm3-image-evidence-review',
      'm3-self-explanation-review-studio',
    ],
    lessonIds: ['m3-l1', 'm3-l2', 'm3-l3', 'm3-l4', 'm3-l5', 'm3-l6', 'm3-l7', 'm3-l8', 'm3-l9', 'm3-l10'],
    portfolioFile: 'src/data/modulePortfolios/m3.ts',
    portfolioSymbol: 'M3_PORTFOLIO',
    portfolioLessonId: 'm3-l11',
    artifactTitles: [
      '질문 계단과 답 비교 기록',
      '뜻-근거-예문-그림 낱말 카드',
      '정확성을 지킨 쉬운 설명 카드',
      '뜻-그림-내 문장 낱말 카드',
      '3컷 이야기 보드와 선택 이유',
      '계산·검산·오류 수정 기록',
      '근거가 연결된 3문장 요약',
      '문제-정답-해설 양면 카드',
      '그림 근거 표시와 수정 설명',
      '자기 설명과 다음 복습 카드',
    ],
    preparedCount: 10,
  },
  M4: {
    studioFile: 'src/data/studios/m4.ts',
    studioSymbol: 'M4_STUDIOS',
    studioIds: [
      'm4-confident-answer-audit',
      'm4-source-trust-lab',
      'm4-privacy-clue-redaction',
      'm4-password-refusal-route',
      'm4-photo-sharing-check',
      'm4-uncomfortable-content-stop',
      'm4-respectful-request-rewrite',
      'm4-stop-time-plan',
      'm4-risk-request-help-network',
      'm4-sponsored-recommendation-audit',
    ],
    lessonIds: ['m4-l1', 'm4-l2', 'm4-l3', 'm4-l4', 'm4-l5', 'm4-l6', 'm4-l7', 'm4-l8', 'm4-l9', 'm4-l10'],
    portfolioFile: 'src/data/modulePortfolios/m4.ts',
    portfolioSymbol: 'M4_PORTFOLIO',
    portfolioLessonId: 'm4-l11',
    artifactTitles: [
      'AI 답 확인 기록',
      '출처 비교 카드',
      '가리기 전후 안전 요청',
      '거절·도움 요청 대화 카드',
      '사진 공유 전 확인 카드와 가린 이미지',
      '도움 요청 문장과 안전 행동 순서',
      '전후 요청과 바꾼 이유 카드',
      '개인 사용·휴식 계획',
      '도움 요청 표현과 개인 도움망',
      '광고 단서 표시판과 구매 판단 카드',
    ],
    preparedCount: 10,
  },
  M6: {
    studioFile: 'src/data/studios/m6.ts',
    studioSymbol: 'M6_STUDIOS',
    studioIds: ['m6-shopping-choice', 'm6-transit-change', 'm6-safe-self-introduction'],
    lessonIds: ['m6-l1', 'm6-l4', 'm6-l11'],
    portfolioFile: 'src/data/modulePortfolios/m6.ts',
    portfolioSymbol: 'M6_PORTFOLIO',
    portfolioLessonId: 'm6-l12',
    artifactTitles: ['나의 장보기 판단표', '안전 이동 계획 카드', '상대에 맞춘 자기소개 카드'],
    preparedCount: 3,
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
const portfolioIndex = readRequired('src/data/modulePortfolios/index.ts');

function checkModule(label, config) {
  const studio = readRequired(config.studioFile);
  const portfolio = readRequired(config.portfolioFile);

  for (const id of config.studioIds) requireToken(studio, `id: '${id}'`, `${label} studio id missing`);
  for (const id of config.lessonIds) requireToken(studio, `lessonId: '${id}'`, `${label} studio lesson missing`);
  for (const title of config.artifactTitles) requireToken(studio, title, `${label} artifact missing`);

  const preparedCount = (studio.match(/source: 'prepared'/g) ?? []).length;
  if (preparedCount !== config.preparedCount) {
    throw new Error(`${label} must have ${config.preparedCount} prepared AI contributions, got ${preparedCount}`);
  }

  requireToken(portfolio, `lessonId: '${config.portfolioLessonId}'`, `${label} portfolio lesson missing`);
  for (const id of config.lessonIds) requireToken(portfolio, `'${id}'`, `${label} portfolio studio reference missing`);

  requireToken(studioIndex, `import { ${config.studioSymbol} }`, `${label} studio registry import missing`);
  requireToken(studioIndex, `...${config.studioSymbol}`, `${label} studio registry spread missing`);
  requireToken(portfolioIndex, `import { ${config.portfolioSymbol} }`, `${label} portfolio registry import missing`);
  requireToken(
    portfolioIndex,
    `[${config.portfolioSymbol}.lessonId, ${config.portfolioSymbol}]`,
    `${label} portfolio registry entry missing`,
  );

  if (label === 'M3') {
    if ((studio.match(/imageSrc: ''/g) ?? []).length !== 40) {
      throw new Error('M3 must expose 40 pending story image slots');
    }
    if (studio.includes('/AITEXTBOOKforSTUDENTS/lessons/m3-l')) {
      throw new Error('M3 must not reuse retired lesson images');
    }
  }
  if (label === 'M4') {
    if ((studio.match(/imageSrc: ''/g) ?? []).length !== 40) {
      throw new Error('M4 must expose 40 pending story image slots');
    }
    if (studio.includes('/AITEXTBOOKforSTUDENTS/lessons/m4-l')) {
      throw new Error('M4 must not reuse retired lesson images');
    }
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

  const studioCount = allStudioFiles.reduce((sum, source) => sum + (source.match(/lessonId: 'm\d-l\d+'/g) ?? []).length, 0);
  const portfolioCount = (portfolioIndex.match(/\[M\d_PORTFOLIO\.lessonId, M\d_PORTFOLIO\]/g) ?? []).length;
  const preparedCount = allStudioFiles.reduce((sum, source) => sum + (source.match(/source: 'prepared'/g) ?? []).length, 0);

  if (studioCount !== 46) throw new Error(`module 4 remodel rollout needs 46 studios, got ${studioCount}`);
  if (portfolioCount !== 6) throw new Error(`complete rollout needs 6 portfolios, got ${portfolioCount}`);
  if (preparedCount !== 46) throw new Error(`module 4 remodel rollout needs 46 prepared AI contributions, got ${preparedCount}`);

  const teacherCopy = [
    readRequired('src/features/teacher/TeacherHub.tsx'),
    readRequired('docs/teacher-guide/m3-m4-m6-studio-expansion.md'),
  ].join('\n');
  for (const text of ['1~6단원', '46개', '준비된 AI 예시', '카메라·마이크 권한 없이']) {
    requireToken(teacherCopy, text, 'complete teacher guidance missing');
  }

  console.log('module 4 remodel rollout: 46 studios, 6 portfolios ready');
}
