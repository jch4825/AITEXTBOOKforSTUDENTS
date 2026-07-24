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
for (const token of ['이미지를 불러오지 못했습니다', '소리 듣기', 'speakNow(stimulus.text)']) {
  if (!panel.includes(token)) throw new Error(`prepared stimulus fallback missing: ${token}`);
}
if (!experience.includes('<PreparedStimulusPanel')) throw new Error('studio does not render prepared stimuli');
if (panel.includes('useEffect')) throw new Error('prepared speech must not auto-play');

const studioSharedPath = 'src/data/studios/shared.ts';
if (!fs.existsSync(studioSharedPath)) throw new Error(`shared studio registry file missing: ${studioSharedPath}`);
const studioShared = fs.readFileSync(studioSharedPath, 'utf8');
const rootLesson = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
for (const token of ['STUDIO_SUPPORT_PROFILES', 'STUDIO_EXPRESSION_MODES']) {
  if (!studioShared.includes(token)) throw new Error(`shared studio constant missing: ${token}`);
}

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
for (const id of [
  'm1-aimi-introduction',
  'm1-feature-investigation',
  'm1-answer-making-lab',
  'm1-image-recognition-lab',
  'm1-speech-recognition-lab',
  'm1-training-data-lab',
  'm1-fast-help-review',
  'm1-help-boundary-map',
  'm1-tool-selection-studio',
  'm1-ai-result-decision',
]) {
  if (!m1.includes(`id: '${id}'`)) throw new Error(`M1 studio missing: ${id}`);
}
for (const lessonId of Array.from({ length: 10 }, (_, index) => `m1-l${index + 1}`)) {
  if (!m1.includes(`lessonId: '${lessonId}'`)) throw new Error(`M1 lesson mapping missing: ${lessonId}`);
}
if ((m1.match(/source: 'prepared'/g) ?? []).length !== 10) throw new Error('M1 AI source must be prepared');
for (const artifact of ['AI 정의 카드', '이미지 인식 실험 기록', 'AI 결과 사용 판단 기록']) {
  if (!m1.includes(artifact)) throw new Error(`M1 artifact missing: ${artifact}`);
}
if (!m1.includes("imageSrc: ''") || m1.includes('/lessons/remodel/')) {
  throw new Error('M1 visual stories must use pending image slots until new assets exist');
}

const m1PortfolioPath = 'src/data/modulePortfolios/m1.ts';
if (!fs.existsSync(m1PortfolioPath)) throw new Error(`M1 learning connection missing: ${m1PortfolioPath}`);
const m1Portfolio = fs.readFileSync(m1PortfolioPath, 'utf8');
for (const token of ["lessonId: 'm1-l11'", "'m1-l1'", "'m1-l10'", '아이미 사용 설명서']) {
  if (!m1Portfolio.includes(token)) throw new Error(`M1 portfolio missing: ${token}`);
}

const m2StudioPath = 'src/data/studios/m2.ts';
if (!fs.existsSync(m2StudioPath)) throw new Error('M2 studio definitions are missing');
const m2 = fs.readFileSync(m2StudioPath, 'utf8');
for (const id of [
  'm2-missing-information-lab',
  'm2-one-purpose-at-a-time',
  'm2-specific-target-lab',
  'm2-example-comparison-lab',
  'm2-audience-tone-studio',
  'm2-stepwise-request-workshop',
  'm2-revision-criteria-lab',
  'm2-output-format-studio',
  'm2-independent-verification-lab',
  'm2-complete-dialogue-studio',
]) {
  if (!m2.includes(`id: '${id}'`)) throw new Error(`M2 studio missing: ${id}`);
}
for (const lessonId of Array.from({ length: 10 }, (_, index) => `m2-l${index + 1}`)) {
  if (!m2.includes(`lessonId: '${lessonId}'`)) throw new Error(`M2 lesson mapping missing: ${lessonId}`);
}
if ((m2.match(/source: 'prepared'/g) ?? []).length !== 10) throw new Error('M2 AI source must be prepared');
for (const artifact of [
  '요청 수정 카드',
  '분할 요청 대화선',
  '전후 요청-결과 체크표',
  '나의 좋은 예시 카드',
  '대상별 안내문 2종',
  '단계별 요청 제작 기록',
  '수정 전후 차이와 수정 기준표',
  '형식 규칙 체크 결과물',
  '주장-근거 확인표',
  '전체 대화·검증 기록',
]) {
  if (!m2.includes(artifact)) throw new Error(`M2 artifact missing: ${artifact}`);
}
for (const disclosure of ['준비된 AI 예시', '실제 AI 연결이 아닌']) {
  if (!m2.includes(disclosure)) throw new Error(`prepared AI disclosure missing: ${disclosure}`);
}

const m2PortfolioPath = 'src/data/modulePortfolios/m2.ts';
if (!fs.existsSync(m2PortfolioPath)) throw new Error(`M2 learning connection missing: ${m2PortfolioPath}`);
const m2Portfolio = fs.readFileSync(m2PortfolioPath, 'utf8');
for (const token of ["lessonId: 'm2-l11'", "'m2-l1'", "'m2-l10'", '나의 프롬프트 노트']) {
  if (!m2Portfolio.includes(token)) throw new Error(`M2 portfolio missing: ${token}`);
}

const m3StudioPath = 'src/data/studios/m3.ts';
if (!fs.existsSync(m3StudioPath)) throw new Error('M3 studio definitions are missing');
const m3 = fs.readFileSync(m3StudioPath, 'utf8');
for (const id of [
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
]) {
  if (!m3.includes(`id: '${id}'`)) throw new Error(`M3 studio missing: ${id}`);
}
for (const lessonId of Array.from({ length: 10 }, (_, index) => `m3-l${index + 1}`)) {
  if (!m3.includes(`lessonId: '${lessonId}'`)) throw new Error(`M3 lesson mapping missing: ${lessonId}`);
}
if ((m3.match(/source: 'prepared'/g) ?? []).length !== 10) throw new Error('M3 AI source must be prepared');
for (const artifact of [
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
]) {
  if (!m3.includes(artifact)) throw new Error(`M3 artifact missing: ${artifact}`);
}
if ((m3.match(/imageSrc: ''/g) ?? []).length !== 40 || m3.includes('/lessons/m3-l')) {
  throw new Error('M3 visual stories must use 40 pending image slots');
}

const m3PortfolioPath = 'src/data/modulePortfolios/m3.ts';
if (!fs.existsSync(m3PortfolioPath)) throw new Error(`M3 learning connection missing: ${m3PortfolioPath}`);
const m3Portfolio = fs.readFileSync(m3PortfolioPath, 'utf8');
for (const token of ["lessonId: 'm3-l11'", "'m3-l1'", "'m3-l10'", '나의 공부 도우미 도구함']) {
  if (!m3Portfolio.includes(token)) throw new Error(`M3 portfolio missing: ${token}`);
}

const m4StudioPath = 'src/data/studios/m4.ts';
if (!fs.existsSync(m4StudioPath)) throw new Error('M4 studio definitions are missing');
const m4 = fs.readFileSync(m4StudioPath, 'utf8');
for (const id of [
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
]) {
  if (!m4.includes(`id: '${id}'`)) throw new Error(`M4 studio missing: ${id}`);
}
for (const lessonId of Array.from({ length: 10 }, (_, index) => `m4-l${index + 1}`)) {
  if (!m4.includes(`lessonId: '${lessonId}'`)) throw new Error(`M4 lesson mapping missing: ${lessonId}`);
}
if ((m4.match(/source: 'prepared'/g) ?? []).length !== 10) throw new Error('M4 AI source must be prepared');
for (const artifact of [
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
]) {
  if (!m4.includes(artifact)) throw new Error(`M4 artifact missing: ${artifact}`);
}
if ((m4.match(/imageSrc: ''/g) ?? []).length !== 40 || m4.includes('/lessons/m4-l')) {
  throw new Error('M4 visual stories must use 40 pending image slots');
}

const m4PortfolioPath = 'src/data/modulePortfolios/m4.ts';
if (!fs.existsSync(m4PortfolioPath)) throw new Error(`M4 learning connection missing: ${m4PortfolioPath}`);
const m4Portfolio = fs.readFileSync(m4PortfolioPath, 'utf8');
for (const token of ["lessonId: 'm4-l11'", "'m4-l1'", "'m4-l10'", '나의 AI 안전 여권']) {
  if (!m4Portfolio.includes(token)) throw new Error(`M4 portfolio missing: ${token}`);
}

const m5StudioPath = 'src/data/studios/m5.ts';
if (!fs.existsSync(m5StudioPath)) throw new Error('M5 studio definitions are missing');
const m5 = fs.readFileSync(m5StudioPath, 'utf8');
for (const id of [
  'm5-problem-definition-map',
  'm5-task-decomposition-board',
  'm5-reasoned-sequence',
  'm5-priority-criteria',
  'm5-adjustable-help',
  'm5-safe-clarification',
  'm5-step-checkpoints',
  'm5-goal-result-verification',
  'm5-alternative-comparison',
  'm5-error-retest',
  'm5-condition-change-plan',
]) {
  if (!m5.includes(`id: '${id}'`)) throw new Error(`M5 studio missing: ${id}`);
}
for (const lessonId of Array.from({ length: 11 }, (_, index) => `m5-l${index + 1}`)) {
  if (!m5.includes(`lessonId: '${lessonId}'`)) throw new Error(`M5 lesson mapping missing: ${lessonId}`);
}
if ((m5.match(/source: 'prepared'/g) ?? []).length !== 11) throw new Error('M5 AI source must be prepared');
for (const artifact of [
  '현재-목표-정보-행동 문제 정의 카드',
  '과제 분해 보드',
  '이유 연결선이 있는 절차표',
  '우선순위 판단표',
  '첫 시도-힌트-수정 결과 기록',
  '요청 수정과 외부 확인 기록',
  '체크포인트가 있는 단계별 대화',
  '목표-결과 검토표',
  '대안 비교표',
  '오류 전후 테스트 기록',
  '처음 계획-바뀐 계획-수정 이유',
]) {
  if (!m5.includes(artifact)) throw new Error(`M5 artifact missing: ${artifact}`);
}
if ((m5.match(/imageSrc: ''/g) ?? []).length !== 44 || m5.includes('/lessons/m5-l')) {
  throw new Error('M5 visual stories must use 44 pending image slots');
}

const m5Portfolio = fs.readFileSync('src/data/modulePortfolios/m5.ts', 'utf8');
for (const token of ["lessonId: 'm5-l12'", "'m5-l1'", "'m5-l11'", '문제 해결 지도']) {
  if (!m5Portfolio.includes(token)) throw new Error(`M5 portfolio missing: ${token}`);
}

const expansionGuidePath = 'docs/teacher-guide/m1-m2-studio-expansion.md';
if (!fs.existsSync(expansionGuidePath)) throw new Error('M1/M2 teacher expansion guide is missing');
const teacherHub = fs.readFileSync('src/features/teacher/TeacherHub.tsx', 'utf8');
const expansionGuide = [
  fs.readFileSync(expansionGuidePath, 'utf8'),
  fs.readFileSync('docs/teacher-guide/m3-m4-m6-studio-expansion.md', 'utf8'),
].join('\n');
for (const text of ['1~5단원 전면 리모델링', '준비된 AI 예시', '카메라·마이크 권한 없이']) {
  if (!teacherHub.includes(text) && !expansionGuide.includes(text)) {
    throw new Error(`teacher expansion guidance missing: ${text}`);
  }
}
for (const title of [
  '아이미와 처음 만난 날',
  'AI의 눈 실험실',
  'AI 결과를 사용할까?',
  '요청 공동 제작소',
  '한 번의 진짜 대화 완성하기',
  '궁금한 것을 깊게 묻기',
  '계산은 다른 도구로 확인하기',
  '오늘 배운 것을 내 말로 복습하기',
  '자신 있는 AI 답도 확인하기',
  '비밀번호와 인증 코드는 보내지 않기',
  '추천 속 광고 단서 찾기',
  '문제를 정확히 찾기',
  '조건이 바뀌면 계획도 바꾸기',
  '나는 문제 해결사',
]) {
  if (!expansionGuide.includes(title)) throw new Error(`teacher studio guide missing: ${title}`);
}

const studioIndex = fs.readFileSync('src/data/studios/index.ts', 'utf8');
for (const spread of ['...M1_STUDIOS', '...M2_STUDIOS', '...M3_STUDIOS', '...M4_STUDIOS', '...M5_STUDIOS']) {
  if (!studioIndex.includes(spread)) throw new Error(`ready studio group missing: ${spread}`);
}
for (const [source, expected, label] of [
  [m1, 10, 'M1'],
  [m2, 10, 'M2'],
  [m3, 10, 'M3'],
  [m4, 10, 'M4'],
  [m5, 11, 'M5'],
]) {
  const count = (source.match(/lessonId: 'm\d-l\d+'/g) ?? []).length;
  if (count !== expected) throw new Error(`${label} ready studio count must be ${expected}, got ${count}`);
}

for (const portfolio of ['M1_PORTFOLIO', 'M2_PORTFOLIO', 'M3_PORTFOLIO', 'M4_PORTFOLIO', 'M5_PORTFOLIO']) {
  if (!portfolioIndex.includes(portfolio)) throw new Error(`ready portfolio missing: ${portfolio}`);
}

console.log('studio expansion contract: 51 studios, 5 portfolios ready');
