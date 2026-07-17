import fs from 'node:fs';

const MODULE_COUNTS = { m1: 11, m2: 11, m3: 11, m4: 11, m5: 12, m6: 12 };

const EXPECTED_OBJECTIVES = new Map(`
m1-l1\t우리 주변에서 AI를 찾아봐요.
m1-l2\t기계와 AI가 어떻게 다른지 알아봐요.
m1-l3\tAI가 어떻게 답을 만드는지 알아봐요.
m1-l4\tAI가 사진 속 물건을 알아보는 모습을 알아봐요.
m1-l5\tAI가 우리 목소리를 어떻게 알아듣는지 알아봐요.
m1-l6\tAI가 자료를 보고 배우는 과정을 알아봐요.
m1-l7\tAI가 잘하는 일들을 찾아봐요.
m1-l8\tAI가 못하는 일들을 찾아봐요.
m1-l9\t챗봇과 이미지 생성 AI가 무엇인지 알아봐요.
m1-l10\tAI에게 프롬프트로 물어보고 답을 확인해 봐요.
m1-l11\t이번 단원에서 배운 낱말들을 다시 알아봐요.
m2-l1\t프롬프트에 들어갈 세 가지 요소를 알아봐요.
m2-l2\t여러 부탁을 한 문장씩 나누어 물어봐요.
m2-l3\t"그거" 대신 정확한 이름으로 물어봐요.
m2-l4\t원하는 답 모양을 예시로 보여주며 부탁해 봐요.
m2-l5\tAI에게 역할을 주고 원하는 말투로 답을 들어 봐요.
m2-l6\t큰 질문을 작은 단계로 쪼개서 하나씩 물어봐요.
m2-l7\tAI의 답을 확인하고 부족한 부분을 다시 부탁해 봐요.
m2-l8\t"세 줄로", "표로"처럼 형식을 정해 부탁해 봐요.
m2-l9\tAI 답이 이상하면 "진짜야?" 하고 되물어 봐요.
m2-l10\t배운 방법대로 프롬프트를 만들어 AI와 대화해 봐요.
m2-l11\t단원 2에서 배운 좋은 질문 방법들을 다시 알아봐요.
m3-l1\t예나 아니오로 끝나지 않는 질문을 만들어 물어봐요.
m3-l2\tAI에게 단어 뜻을 물어보고 사전과 비교해 봐요.
m3-l3\t이해하기 쉽게 예를 들어 설명해 달라고 부탁해 봐요.
m3-l4\t배우고 싶은 낱말이 들어간 문장을 AI에게 만들어 달라고 해요.
m3-l5\t내가 생각한 줄거리를 AI에게 말하고 이야기를 만들어 봐요.
m3-l6\t계산은 계산기로 확인하고, 풀이 방법은 AI에게 물어봐요.
m3-l7\t긴 글을 세 문장으로 짧게 요약해 달라고 해 봐요.
m3-l8\tAI에게 문제를 만들어 달라고 해서 스스로 풀어 봐요.
m3-l9\tAI에게 그림을 보여주고 무슨 그림인지 설명해 달라고 해요.
m3-l10\tAI에게 오늘 배운 것을 짧게 줄여 달라고 하고 읽어 봐요.
m3-l11\t공부할 때 AI를 어떻게 쓸지 약속을 만들어 봐요.
m4-l1\tAI가 거짓말처럼 틀린 답을 자신 있게 할 수 있음을 알아요.
m4-l2\t정보를 그대로 믿지 않고 사실인지 확인해 봐요.
m4-l3\tAI에게 이름이나 주소 같은 개인정보를 말하지 않기로 해요.
m4-l4\t비밀번호를 묻는 말을 만나면 절대로 말하지 않아요.
m4-l5\t사진을 보내기 전에 한번 더 생각하는 약속을 지켜요.
m4-l6\t마음이 무서워지는 나쁜 내용을 만나면 화면을 끄고 알려요.
m4-l7\tAI에게 명령하는 대신 고운 말로 부탁해 봐요.
m4-l8\t폰을 너무 오래 하지 않도록 미리 시간을 정해요.
m4-l9\t무서운 일이 생기면 숨기지 않고 어른에게 도움을 요청해요.
m4-l10\t화면에서 진짜 정보와 파는 광고를 다른 점을 찾아요.
m4-l11\t그동안 배운 안전 약속을 다시 말해 봐요.
m5-l1\t지금 상황과 내가 바라는 것이 다를 때 이것이 문제임을 알아요.
m5-l2\t큰 일을 세 가지 작은 일들로 나누어 봐요.
m5-l3\t나눈 작은 일들을 먼저 할 것부터 순서대로 나열해요.
m5-l4\t여러 일 중 더 중요한 일을 먼저 하기로 정해요.
m5-l5\t정답 대신 살짝 도와주는 힌트만 달라고 부탁해 봐요.
m5-l6\tAI가 내 말을 오해하면 더 구체적인 이름으로 다시 말해요.
m5-l7\tAI에게 한 번에 하나씩 순서대로 실행해 달라고 부탁해 봐요.
m5-l8\t내가 얻은 결과가 처음에 원했던 목표와 같은지 확인해 봐요.
m5-l9\t이 방법 말고 다른 방법도 있는지 AI에게 물어봐요.
m5-l10\t틀린 부분을 찾아서 고치고 다시 도전해 봐요.
m5-l11\t라면 끓이는 일의 순서를 세워 차례대로 해 봐요.
m5-l12\t이전 시간에 공부한 문제 해결 4단계를 다시 알아봐요.
m6-l1\tAI에게 재료 목록을 짜 달라고 하고 확인해 봐요.
m6-l2\t살 물건들의 값을 알아보고 계산기로 직접 확인해 봐요.
m6-l3\t지도로 가는 길을 확인하고 내 위치 정보도 조심해요.
m6-l4\t버스나 지하철이 언제 도착하는지 앱으로 알아봐요.
m6-l5\t오늘 날씨 예보를 알아보고 어울리는 옷을 골라 봐요.
m6-l6\t요리하는 순서를 AI에게 물어보고 하나씩 알아봐요.
m6-l7\t오늘 할 일들의 알림을 맞추고 실천해 봐요.
m6-l8\t아플 때 내 상태를 어른에게 먼저 말하고 도와달라고 해요.
m6-l9\t고마운 상황에 어울리는 말을 소리 내어 연습해 봐요.
m6-l10\t내가 되고 싶은 직업이 무슨 일을 하는지 AI에게 물어봐요.
m6-l11\t내가 쓴 자기소개를 AI에게 보여주고 고쳐서 다시 써 봐요.
m6-l12\t그동안 배운 생활 약속을 다시 모아 확인해 봐요.
`.trim().split('\n').map((line) => {
  const [lessonId, objective] = line.split('\t');
  return [lessonId, objective];
}));

if (EXPECTED_OBJECTIVES.size !== 68) {
  throw new Error(`objective baseline must contain 68 lessons, got ${EXPECTED_OBJECTIVES.size}`);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const hardSources = Object.keys(MODULE_COUNTS).map((moduleId) =>
  read(`src/data/lessons/hard/${moduleId}.ts`),
);
const hardGoalCount = hardSources.reduce(
  (count, source) => count + (source.match(/\bgoal:\s*\{/g) ?? []).length,
  0,
);
if (hardGoalCount !== 0) {
  throw new Error(`hard lesson content must not define support-level goals: found ${hardGoalCount}`);
}

const objectiveByLesson = new Map();
for (const [moduleId, expectedCount] of Object.entries(MODULE_COUNTS)) {
  const source = read(`src/data/lessons/${moduleId}.ts`);
  const matches = [...source.matchAll(/\bid:\s*'(m\d-l\d+)'[\s\S]*?\bobjective:\s*'((?:\\'|[^'])*)'/g)];
  if (matches.length !== expectedCount) {
    throw new Error(`${moduleId} must define ${expectedCount} objectives, got ${matches.length}`);
  }
  for (const match of matches) objectiveByLesson.set(match[1], match[2].replaceAll("\\'", "'"));
}

if (objectiveByLesson.size !== 68) {
  throw new Error(`regular lessons must define 68 objectives, got ${objectiveByLesson.size}`);
}

for (const [lessonId, expected] of EXPECTED_OBJECTIVES) {
  const actual = objectiveByLesson.get(lessonId);
  if (actual !== expected) {
    throw new Error(`${lessonId} must use the former weak-support objective\nexpected: ${expected}\nactual: ${actual}`);
  }
}

const types = read('src/types.ts');
const hardInterface = types.match(/export interface HardLessonContent\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
if (/\bgoal\s*:/.test(hardInterface)) {
  throw new Error('HardLessonContent must not contain a goal field');
}

const lessonView = read('src/views/LessonView.tsx');
const studioPanel = read('src/features/studio/components/StudioExplanationPanel.tsx');
const teacherPanel = read('src/features/teacher/LegacyTeacherPanels.tsx');
if (!lessonView.includes('const goalText = lesson.objective;')) {
  throw new Error('LessonView must use lesson.objective as the single goal');
}
if (!studioPanel.includes('const goal = lesson.objective;')) {
  throw new Error('StudioExplanationPanel must use lesson.objective as the single goal');
}
for (const [label, source] of [['LessonView', lessonView], ['StudioExplanationPanel', studioPanel]]) {
  if (/hard\??\.goal|goal\[difficulty\]|goal\.(easy|normal|hard)/.test(source)) {
    throw new Error(`${label} still branches the learning objective by support level`);
  }
}
if (!teacherPanel.includes('lesson.objective')) {
  throw new Error('teacher objective panel must use lesson.objective');
}

console.log('single learning objective contract: 68 canonical objectives, 0 support-level variants');
