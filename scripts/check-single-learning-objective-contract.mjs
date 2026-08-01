import fs from 'node:fs';

const MODULE_COUNTS = { m1: 11, m2: 11, m3: 11, m4: 11, m5: 12, m6: 12 };

const EXPECTED_OBJECTIVES = new Map(`
m1-l1\tAI(인공지능)의 뜻과 할 수 있는 일을 찾아요.
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

const M1_OBJECTIVES = new Map([
  ['m1-l1', '어려운 말로 인사한 아이미 대신, AI(인공지능)의 뜻과 AI가 돕는 일 두 가지를 내 말로 소개해요.'],
  ['m1-l2', '버튼 선풍기·센서 자동문·추천 앱이 받는 정보를 비교해, AI 기능이 쓰인 것을 이유와 함께 골라요.'],
  ['m1-l3', '다음 낱말 잇기 놀이로 아이미가 답을 만드는 방법을 겪어 보고, 아이미의 답에서 꼭 확인할 문장을 골라요.'],
  ['m1-l4', '사진의 가림·밝기를 바꾸며 아이미의 답이 달라지는 모습을 실험하고, 답이 달라진 까닭을 골라요.'],
  ['m1-l5', '시끄러운 곳에서 아이미가 잘못 받아 적은 말을, 조건을 바꾸거나 다른 입력 방법을 골라 바르게 전해요.'],
  ['m1-l6', '세모 카드만 잔뜩 배운 AI가 왜 자꾸 틀리는지 배움 상자를 확인하고, 자료를 골고루 바꿔 결과를 비교해요.'],
  ['m1-l7', '아이미가 1초 만에 만든 요약·번역을 원문과 나란히 놓고, 빠지거나 달라진 부분을 찾아 고쳐요.'],
  ['m1-l8', '아이미가 받은 네 가지 부탁을 사실 확인·AI의 1차 판단·사람의 최종 판단으로 나누고, 왜 그렇게 나눴는지 말해요.'],
  ['m1-l9', '하려는 일과 넣을 수 있는 정보를 아이미에게 말하고, 일마다 알맞은 AI 도구를 이유와 함께 골라요.'],
  ['m1-l10', '개인정보 없이 아이미에게 음악을 부탁하고, 받은 결과를 확인해 쓰기·고치기·안 쓰기 중에서 골라요.'],
  ['m1-l11', '오늘은 새 AI 상황에서 입력·결과·확인할 점을 찾아 나만의 AI 사용 설명서를 완성해 봐요.'],
]);

const M2_OBJECTIVES = new Map([
  ['m2-l1', '아이미가 엉뚱하게 알아들은 부탁에서 빠진 정보를 찾아, 개인정보 없이 채워 다시 부탁해요.'],
  ['m2-l2', '한 문장에 섞인 여러 부탁을 하나씩 나누고, 마감이 빠른 것부터 아이미에게 차례로 부탁해요.'],
  ['m2-l3', '`그거`, `아무거나` 대신 이름·종류·개수를 넣어 부탁하고, 아이미의 답이 어떻게 달라지는지 비교해요.'],
  ['m2-l4', '원하는 답의 예시를 하나 만들어 아이미에게 보여 주고, 예시를 주기 전과 후의 답을 비교해요.'],
  ['m2-l5', '답을 읽을 사람과 말투를 아이미에게 알려 주고, 사실(시간·장소·준비물)이 맞는지는 따로 확인해요.'],
  ['m2-l6', '큰 부탁을 작은 단계로 나누고, 앞 단계에서 받은 아이미의 답을 다음 부탁에 이어 써요.'],
  ['m2-l7', '아이미의 첫 답에서 부족한 곳을 찾고, 지킬 사실을 정해서 구체적으로 다시 부탁해요.'],
  ['m2-l8', '할 일에 맞는 형식(표·번호 목록·한 문장)을 골라 아이미에게 부탁하고, 답이 형식과 내용을 지켰는지 확인해요.'],
  ['m2-l9', '아이미 답의 주장 하나를 골라, 아이미에게 다시 묻는 대신 최신 학교 공지와 비교해 확인해요.'],
  ['m2-l10', '내가 정한 목적으로 아이미에게 부탁하고, 답을 고쳐 묻고, 근거를 확인해 마지막 사용을 결정해요.'],
  ['m2-l11', '오늘은 실제 목적 하나를 정하고 요청·수정·확인·최종 판단이 담긴 프롬프트 노트를 완성해 봐요.'],
]);

const M3_OBJECTIVES = new Map([
  ['m3-l1', '같은 주제를 세 가지 질문으로 바꿔 아이미에게 묻고, 과제에 가장 도움이 되는 답을 이유와 함께 골라요.'],
  ['m3-l2', '모르는 낱말의 뜻을 먼저 짐작하고, 아이미의 설명과 학생 사전을 비교해 내 말로 뜻을 적어요.'],
  ['m3-l3', '아이미의 쉬운 설명에서 빠진 사실을 찾고, 꼭 남을 내용을 정해 다시 설명해 달라고 해요.'],
  ['m3-l4', '낱말의 뜻·반대말과 아이미의 예문을 장면과 비교하고, 그 낱말이 어울리는 내 문장을 만들어요.'],
  ['m3-l5', '내 이야기의 결말을 먼저 정하고, 아이미의 세 가지 제안을 골라 고쳐 내 결말을 완성해요.'],
  ['m3-l6', '간식 합계를 먼저 예상하고 계산기로 확인해, 아이미 풀이에서 틀린 줄을 찾아 고쳐요.'],
  ['m3-l7', '긴 글에서 꼭 남길 내용을 내가 먼저 고르고, 아이미의 세 문장 요약에서 빠진 것을 찾아 채워요.'],
  ['m3-l8', '먼저 풀고 나중에 정답을 보는 양면 퀴즈 카드를, 아이미가 만든 문제를 고쳐서 완성해요.'],
  ['m3-l9', '그림에서 직접 보이는 사실과 아이미가 덧붙인 추측을 나누고, 근거 있는 설명으로 고쳐요.'],
  ['m3-l10', '자료를 덮고 배운 것을 먼저 떠올린 뒤, 아이미의 요약과 비교해 내 말로 다시 설명해요.'],
  ['m3-l11', '오늘은 공부할 때 AI에게 맡길 일과 내가 직접 할 일을 정해 나의 공부 도구함을 완성해 봐요.'],
]);

const M4_OBJECTIVES = new Map([
  ['m4-l1', '자신 있게 답한 아이미의 시간을 오늘의 공식 시간표와 비교해, 맞는 부분과 고칠 부분을 나눠요.'],
  ['m4-l2', '같은 소식을 말하는 세 자료의 출처와 날짜를 비교해, 더 믿을 만한 자료를 이유와 함께 골라요.'],
  ['m4-l3', '아이미에게 보낼 글에서 나를 알아볼 수 있는 정보를 찾아 가리고, 필요한 조건만 남겨 안전한 부탁으로 고쳐요.'],
  ['m4-l4', '비밀번호·인증 코드를 묻는 요청을 알아채면 거절하고, 믿을 만한 어른과 공식 절차를 확인해요.'],
  ['m4-l5', '사진을 보내기 전 얼굴·이름·위치·다른 사람을 확인하고, 그대로 보내기·가리기·보내지 않기 중에서 골라요.'],
  ['m4-l6', '불편한 화면의 위험 신호를 아이미와 함께 이름 붙이고, 거리를 둔 뒤 믿을 만한 사람에게 알리는 연습을 해요.'],
  ['m4-l7', '같은 부탁을 거친 말과 존중하는 말로 아이미에게 해 보고, 사람에게도 쓸 분명한 표현을 골라요.'],
  ['m4-l8', '나의 사용 기록을 보고 멈춤 신호와 다음 행동을 정해, 아이미와 함께 나만의 멈춤 계획을 만들어요.'],
  ['m4-l9', '아이미가 보여 주는 대화에서 사진·비밀번호·선물·만남 요구 신호를 알아채고, 누구에게 어떻게 알릴지 연습해요.'],
  ['m4-l10', '아이미가 모은 추천 게시물에서 광고 표시·구매 링크·과장을 찾아 표시하고, 내 필요·예산과 비교해요.'],
  ['m4-l11', '오늘은 확인할 때·보내기 전·위험할 때의 행동과 도움 요청 문장을 안전 여권에 완성해 봐요.'],
]);

const M5_OBJECTIVES = new Map([
  ['m5-l1', '물품이 안 온 상황에서 지금 모습과 원하는 모습을 나눠 적고, 아이미와 함께 진짜 문제를 한 문장으로 만들어요.'],
  ['m5-l2', '`부스 설치`라는 큰 일을 작은 과제로 나누고, 아이미의 목록에서 빠진 과제와 필요 없는 과제를 찾아 고쳐요.'],
  ['m5-l3', '아이미가 추천한 설치 순서를 모의 실행으로 시험하고, 먼저 해야 하는 이유가 있는 순서로 다시 조립해요.'],
  ['m5-l4', '한꺼번에 온 세 가지 일에 안전·마감·도움 기준을 붙이고, 아이미와 함께 먼저 할 일을 정해 이유를 말해요.'],
  ['m5-l5', '막힌 문제에서 완성 답 대신, 아이미에게 필요한 만큼의 힌트만 골라 받아 내 방법을 고쳐요.'],
  ['m5-l6', '아이미가 다르게 알아들은 까닭을 찾고, 개인정보 없이 필요한 단서만 더해 다시 요청해요.'],
  ['m5-l7', '아이미에게 한 단계씩 부탁하고, 끝났다는 표시를 확인한 다음에 다음 단계로 넘어가요.'],
  ['m5-l8', '아이미가 완성했다는 결과를 처음 조건표와 나란히 대조하고, 빠진 것을 찾아 채워요.'],
  ['m5-l9', '처음 방법이 막혔을 때 아이미와 다른 방법을 두 가지 넘게 만들고, 시간·안전·도움 기준으로 비교해 골라요.'],
  ['m5-l10', '안내 순서를 같은 조건으로 다시 시험해 오류 지점을 찾고, 고친 뒤 처음부터 확인해요.'],
  ['m5-l11', '도구가 없고 안전 정보가 확인되지 않았을 때, 계획을 멈추고 어른과 확인해 안전한 새 계획으로 고쳐요.'],
  ['m5-l12', '오늘은 새 생활 문제 하나를 골라 현재·목표·작은 과제·순서·대안·확인을 한 장에 완성해 봐요.'],
]);

const M6_OBJECTIVES = new Map([
  ['m6-l1', '아이미의 장보기 목록을 재고·가격·예산·알레르기와 비교해, 빼거나 바꿔서 안전한 목록으로 고쳐요.'],
  ['m6-l2', '아이미가 계산한 금액을 믿기 전에, 가격표를 보고 계산기로 합계와 거스름돈을 확인해요.'],
  ['m6-l3', '연습 지도에서 출발점과 목적지를 찾고, 아이미의 길 안내를 지도·표지와 대조해 안전한 길을 골라요.'],
  ['m6-l4', '버스 번호·방향·정류장을 오늘 공지와 확인하고, 헷갈리면 타기 전에 안전하게 도움을 요청해요.'],
  ['m6-l5', '공식 예보의 기온·비·바람을 확인하고, 아이미의 한마디 대신 활동과 내 감각에 맞는 준비물을 골라요.'],
  ['m6-l6', '재료·알레르기·도구·도움 조건을 확인해, 아이미의 요리 초안을 안전한 순서로 고쳐 조립해요.'],
  ['m6-l7', '아이미의 빽빽한 일정에 쉬는 시간과 도움 시간을 넣어 고치고, 출발이 늦어지면 계획을 다시 맞춰요.'],
  ['m6-l8', '몸이 불편할 때 말·그림 카드로 상태를 표현하는 연습을 아이미와 하고, 믿을 만한 어른에게 먼저 알려요.'],
  ['m6-l9', '인사·도움 요청·거절·다시 말해 달라는 표현을, 말·글·그림 카드 중 편한 방법으로 아이미와 연습해요.'],
  ['m6-l10', '아이미가 예상한 직업의 모습과 실제 직업인의 이야기를 비교하고, 나의 흥미·강점·필요한 도움을 적어요.'],
  ['m6-l11', '내가 먼저 쓴 자기소개에 아이미의 제안을 골라 반영해, 교실용과 온라인용 두 버전을 완성해요.'],
  ['m6-l12', '오늘은 예산·이동·날씨·소통이 연결된 하루 계획을 만들고 나의 AI 생활 원칙과 함께 발표해 봐요.'],
]);

for (const [lessonId, objective] of [...M1_OBJECTIVES, ...M2_OBJECTIVES, ...M3_OBJECTIVES, ...M4_OBJECTIVES, ...M5_OBJECTIVES, ...M6_OBJECTIVES]) {
  EXPECTED_OBJECTIVES.set(lessonId, objective);
}

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

// 68차시를 끝까지 훑고 어긋난 것을 한 번에 보고한다. 첫 건에서 throw하면 나머지가 가려지고,
// 스택 트레이스만 보여서 스크립트가 죽은 것처럼 읽힌다.
const objectiveMismatches = [];
for (const [lessonId, expected] of EXPECTED_OBJECTIVES) {
  const actual = objectiveByLesson.get(lessonId);
  const formalExpected = ['m1-', 'm2-', 'm3-', 'm4-', 'm5-', 'm6-'].some((prefix) => lessonId.startsWith(prefix)) ? expected : expected
    .replaceAll('해 봐요', '해 보십시오')
    .replaceAll('봐요', '봅니다')
    .replaceAll('해요', '합니다')
    .replaceAll('알아요', '압니다')
    .replaceAll('않아요', '않습니다')
    .replaceAll('찾아요', '찾습니다')
    .replaceAll('정해요', '정합니다')
    .replaceAll('요청해요', '요청합니다')
    .replaceAll('말해요', '말합니다')
    .replaceAll('지켜요', '지킵니다')
    .replaceAll('확인해요', '확인합니다')
    .replaceAll('알아봐요', '알아봅니다')
    .replaceAll('알려요', '알립니다');
  if (actual !== formalExpected) {
    objectiveMismatches.push({ lessonId, expected: formalExpected, actual });
  }
}

if (objectiveMismatches.length > 0) {
  console.error(
    `Single learning objective contract failed: ${objectiveMismatches.length} lesson(s) off the canonical objective.`,
  );
  for (const mismatch of objectiveMismatches) {
    console.error(`- ${mismatch.lessonId}`);
    console.error(`    expected: ${mismatch.expected}`);
    console.error(`    actual  : ${mismatch.actual}`);
  }
  process.exit(1);
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
