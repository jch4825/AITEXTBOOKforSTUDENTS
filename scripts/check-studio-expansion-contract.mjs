import fs from 'node:fs';

const lessonView = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
for (const forbidden of [
  'if (isWrapUp) speak(wrapUpText)',
  'speak(wrapUpText)',
]) {
  if (lessonView.includes(forbidden)) {
    throw new Error(`legacy wrap-up must not auto-start TTS: ${forbidden}`);
  }
}

const stimulusPanelPath = 'src/features/studio/components/PreparedStimulusPanel.tsx';
if (!fs.existsSync(stimulusPanelPath)) {
  throw new Error('prepared stimulus component is missing');
}

const types = fs.readFileSync('src/features/studio/types.ts', 'utf8');
const panel = fs.readFileSync(stimulusPanelPath, 'utf8');
const experience = fs.readFileSync('src/features/studio/components/StudioExperience.tsx', 'utf8');
for (const token of ['export type PreparedStimulus', "kind: 'image'", "kind: 'speech'", 'stimuli?: PreparedStimulus[]']) {
  if (!types.includes(token)) throw new Error(`prepared stimulus type missing: ${token}`);
}
for (const token of ['이미지를 불러오지 못했어요', '소리 듣기', 'speakNow(stimulus.text)']) {
  if (!panel.includes(token)) throw new Error(`prepared stimulus fallback missing: ${token}`);
}
if (!experience.includes('<PreparedStimulusPanel')) throw new Error('studio does not render prepared stimuli');
if (panel.includes('useEffect')) throw new Error('prepared speech must not auto-play');

const studioSharedPath = 'src/data/studios/shared.ts';
const bridgeIndexPath = 'src/data/supportBridges/index.ts';
const bridgeTypesPath = 'src/data/supportBridges/types.ts';
for (const required of [studioSharedPath, bridgeIndexPath, bridgeTypesPath]) {
  if (!fs.existsSync(required)) throw new Error(`shared studio registry file missing: ${required}`);
}
const studioShared = fs.readFileSync(studioSharedPath, 'utf8');
const bridgeIndex = fs.readFileSync(bridgeIndexPath, 'utf8');
const bridgeComponent = fs.readFileSync('src/features/studio/SupportLessonBridge.tsx', 'utf8');
const rootLesson = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
for (const token of ['STUDIO_SUPPORT_PROFILES', 'STUDIO_EXPRESSION_MODES']) {
  if (!studioShared.includes(token)) throw new Error(`shared studio constant missing: ${token}`);
}
for (const token of ['M5_SUPPORT_BRIDGES', 'getSupportBridge']) {
  if (!bridgeIndex.includes(token)) throw new Error(`generic bridge registry missing: ${token}`);
}
if (bridgeComponent.includes('supportBridges/m5')) throw new Error('bridge component must use the common type');
if (!rootLesson.includes("from '../data/supportBridges'")) throw new Error('LessonView must use the bridge registry');

const portfolioIndexPath = 'src/data/modulePortfolios/index.ts';
const portfolioTypesPath = 'src/data/modulePortfolios/types.ts';
const portfolioM5Path = 'src/data/modulePortfolios/m5.ts';
for (const required of [portfolioIndexPath, portfolioTypesPath, portfolioM5Path]) {
  if (!fs.existsSync(required)) throw new Error(`module portfolio file missing: ${required}`);
}
const portfolioIndex = fs.readFileSync(portfolioIndexPath, 'utf8');
const portfolioView = fs.readFileSync('src/features/studio/ModuleCloseLessonView.tsx', 'utf8');
for (const token of ['ModulePortfolioDefinition', 'getModulePortfolioDefinition']) {
  if (!portfolioIndex.includes(token) && !portfolioView.includes(token)) {
    throw new Error(`module portfolio interface missing: ${token}`);
  }
}
for (const forbidden of ["themeFor('m5')", "['m5-l1', 'm5-l6', 'm5-l11']", "lessonId === 'm5-l12'"]) {
  if (portfolioView.includes(forbidden) || rootLesson.includes(forbidden)) {
    throw new Error(`M5 portfolio hardcoding remains: ${forbidden}`);
  }
}

const m1StudioPath = 'src/data/studios/m1.ts';
if (!fs.existsSync(m1StudioPath)) throw new Error('M1 studio definitions are missing');
const m1 = fs.readFileSync(m1StudioPath, 'utf8');
for (const id of ['m1-daily-ai-finder', 'm1-eyes-ears-lab', 'm1-ability-test']) {
  if (!m1.includes(`id: '${id}'`)) throw new Error(`M1 studio missing: ${id}`);
}
for (const lessonId of ['m1-l1', 'm1-l4', 'm1-l10']) {
  if (!m1.includes(`lessonId: '${lessonId}'`)) throw new Error(`M1 lesson mapping missing: ${lessonId}`);
}
if ((m1.match(/source: 'prepared'/g) ?? []).length !== 3) throw new Error('M1 AI source must be prepared');
for (const artifact of ['나의 AI 발견 카드', 'AI 인식 실험 기록', 'AI 사용 판단 설명서']) {
  if (!m1.includes(artifact)) throw new Error(`M1 artifact missing: ${artifact}`);
}
if (!m1.includes("kind: 'image'") || !m1.includes("kind: 'speech'")) {
  throw new Error('M1 recognition studio needs image and speech stimuli');
}

const m1BridgePath = 'src/data/supportBridges/m1.ts';
const m1PortfolioPath = 'src/data/modulePortfolios/m1.ts';
for (const required of [m1BridgePath, m1PortfolioPath]) {
  if (!fs.existsSync(required)) throw new Error(`M1 learning connection missing: ${required}`);
}
const m1Bridges = fs.readFileSync(m1BridgePath, 'utf8');
for (const lessonId of ['m1-l2', 'm1-l3', 'm1-l5', 'm1-l6', 'm1-l7', 'm1-l8', 'm1-l9']) {
  if (!m1Bridges.includes(`lessonId: '${lessonId}'`)) throw new Error(`M1 bridge missing: ${lessonId}`);
}
const m1Portfolio = fs.readFileSync(m1PortfolioPath, 'utf8');
for (const token of ["lessonId: 'm1-l11'", "'m1-l1', 'm1-l4', 'm1-l10'", '1단원 성장 포트폴리오']) {
  if (!m1Portfolio.includes(token)) throw new Error(`M1 portfolio missing: ${token}`);
}

const m2StudioPath = 'src/data/studios/m2.ts';
if (!fs.existsSync(m2StudioPath)) throw new Error('M2 studio definitions are missing');
const m2 = fs.readFileSync(m2StudioPath, 'utf8');
for (const id of ['m2-misunderstood-request', 'm2-request-workshop', 'm2-repair-dialogue']) {
  if (!m2.includes(`id: '${id}'`)) throw new Error(`M2 studio missing: ${id}`);
}
for (const lessonId of ['m2-l1', 'm2-l6', 'm2-l10']) {
  if (!m2.includes(`lessonId: '${lessonId}'`)) throw new Error(`M2 lesson mapping missing: ${lessonId}`);
}
if ((m2.match(/source: 'prepared'/g) ?? []).length !== 3) throw new Error('M2 AI source must be prepared');
for (const artifact of ['요청 고치기 카드', '나의 요청 제작 레시피', '고쳐 묻기 대화 기록']) {
  if (!m2.includes(artifact)) throw new Error(`M2 artifact missing: ${artifact}`);
}
for (const disclosure of ['준비된 AI 예시', '안전한 연습 응답']) {
  if (!m2.includes(disclosure)) throw new Error(`prepared AI disclosure missing: ${disclosure}`);
}

const m2BridgePath = 'src/data/supportBridges/m2.ts';
const m2PortfolioPath = 'src/data/modulePortfolios/m2.ts';
for (const required of [m2BridgePath, m2PortfolioPath]) {
  if (!fs.existsSync(required)) throw new Error(`M2 learning connection missing: ${required}`);
}
const m2Bridges = fs.readFileSync(m2BridgePath, 'utf8');
for (const lessonId of ['m2-l2', 'm2-l3', 'm2-l4', 'm2-l5', 'm2-l7', 'm2-l8', 'm2-l9']) {
  if (!m2Bridges.includes(`lessonId: '${lessonId}'`)) throw new Error(`M2 bridge missing: ${lessonId}`);
}
const m2Portfolio = fs.readFileSync(m2PortfolioPath, 'utf8');
for (const token of ["lessonId: 'm2-l11'", "'m2-l1', 'm2-l6', 'm2-l10'", '2단원 성장 포트폴리오']) {
  if (!m2Portfolio.includes(token)) throw new Error(`M2 portfolio missing: ${token}`);
}

const expansionGuidePath = 'docs/teacher-guide/m1-m2-studio-expansion.md';
if (!fs.existsSync(expansionGuidePath)) throw new Error('M1/M2 teacher expansion guide is missing');
const teacherHub = fs.readFileSync('src/features/teacher/TeacherHub.tsx', 'utf8');
const expansionGuide = fs.readFileSync(expansionGuidePath, 'utf8');
for (const text of ['1·2·5단원', '준비된 AI 예시', '카메라·마이크 권한 없이']) {
  if (!teacherHub.includes(text) && !expansionGuide.includes(text)) {
    throw new Error(`teacher expansion guidance missing: ${text}`);
  }
}
for (const title of ['오늘 하루의 AI 찾기', 'AI의 눈과 귀 실험실', '요청 공동 제작소', 'AI 고쳐 묻기 실험실']) {
  if (!expansionGuide.includes(title)) throw new Error(`teacher studio guide missing: ${title}`);
}

const studioIndex = fs.readFileSync('src/data/studios/index.ts', 'utf8');
for (const spread of ['...M1_STUDIOS', '...M2_STUDIOS', '...M5_STUDIOS']) {
  if (!studioIndex.includes(spread)) throw new Error(`ready studio group missing: ${spread}`);
}
for (const [source, expected, label] of [
  [m1, 3, 'M1'],
  [m2, 3, 'M2'],
  [fs.readFileSync('src/data/studios/m5.ts', 'utf8'), 3, 'M5'],
]) {
  const count = (source.match(/lessonId: 'm\d-l\d+'/g) ?? []).length;
  if (count !== expected) throw new Error(`${label} ready studio count must be ${expected}, got ${count}`);
}

for (const spread of ['...M1_SUPPORT_BRIDGES', '...M2_SUPPORT_BRIDGES', '...M5_SUPPORT_BRIDGES']) {
  if (!bridgeIndex.includes(spread)) throw new Error(`ready bridge group missing: ${spread}`);
}
for (const [source, expected, label] of [
  [m1Bridges, 7, 'M1'],
  [m2Bridges, 7, 'M2'],
  [fs.readFileSync('src/data/supportBridges/m5.ts', 'utf8'), 8, 'M5'],
]) {
  const count = (source.match(/lessonId: 'm\d-l\d+'/g) ?? []).length;
  if (count !== expected) throw new Error(`${label} ready bridge count must be ${expected}, got ${count}`);
}

for (const portfolio of ['M1_PORTFOLIO', 'M2_PORTFOLIO', 'M5_PORTFOLIO']) {
  if (!portfolioIndex.includes(portfolio)) throw new Error(`ready portfolio missing: ${portfolio}`);
}

console.log('studio expansion contract: 9 studios, 22 bridges, 3 portfolios ready');
