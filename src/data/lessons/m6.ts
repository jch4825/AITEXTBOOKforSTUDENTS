import type { LessonContent } from '../../types';

const LIFE_STANDARD =
  '[12정통02-04] 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.';
const CHOICE_STANDARD =
  '[6사회01-02] 일상생활에서 활동이나 물건을 선택하고 나의 선택을 중요하게 여기는 태도를 기른다.';
const MONEY_STANDARDS = [
  '[9수학01-14] 대용 화폐를 활용하여 상품을 교환한다.',
  '[12수학01-14] 실생활의 다양한 상황에서 필요한 화폐를 활용한다.',
];
const ROUTE_STANDARDS = [
  '[12진로04-03] 집에서 직장까지 교통 수단을 활용하여 이동한다.',
  '[9보건04-03] 교통사고의 위험 요인을 알고 사고 예방을 위한 안전 수칙을 실천한다.',
];
const DIALOG_STANDARD =
  '[9국어01-04] 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.';
const CAREER_STANDARDS = [
  '[9진로02-02] 직업의 세계에 관심을 가지고 가족, 이웃 등 주변 사람들의 직업에 대하여 탐색한다.',
  '[12정통03-04] 디지털 사회에서의 다양한 직업을 탐색하고 체험한다.',
];
const INTRO_STANDARD =
  '[9진로01-02] 흥미, 적성, 장점과 단점, 성격 등 자신의 특성을 파악하여 자신을 소개한다.';

export const M6_LESSONS: LessonContent[] = [
  {
    id: 'm6-l1',
    moduleId: 'm6',
    number: 1,
    kind: 'experience',
    title: '조건에 맞는 장보기',
    objective: '아이미의 장보기 목록을 재고·가격·예산·알레르기와 비교해, 빼거나 바꿔서 안전한 목록으로 고쳐요.',
    standards: [CHOICE_STANDARD],
    bodyEasy: 'AI 목록과 실제 재고·가격·건강 조건을 비교해 필요한 것만 남겨요.',
    bodyNormal:
      '동아리 간식 준비 목록을 집에 있는 재료, 가격표, 예산, 알레르기 정보와 비교하고 삭제·대체·수량 수정을 결정합니다.',
    wrapUpEasy: 'AI 목록은 초안이에요. 실제 조건은 내가 확인해요.',
    wrapUpNormal: '목적과 실제 조건을 확인해 장보기 목록을 고치고 최종 구매 여부를 내가 판단했습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['목록', '예산'], imagePlaceholder: true } }],
  },
  {
    id: 'm6-l2',
    moduleId: 'm6',
    number: 2,
    kind: 'experience',
    title: '돈은 계산기로 확인하기',
    objective: '아이미가 계산한 금액을 믿기 전에, 가격표를 보고 계산기로 합계와 거스름돈을 확인해요.',
    standards: MONEY_STANDARDS,
    bodyEasy: '먼저 예상하고 가격표·계산기·영수증으로 확인해요.',
    bodyNormal:
      'AI의 합계나 거스름돈을 그대로 사용하지 않고 가격표와 수량으로 식을 만들고 계산기와 영수증으로 검산합니다.',
    wrapUpEasy: '돈 계산은 계산기와 영수증으로 다시 확인해요.',
    wrapUpNormal: '예상값, AI 풀이, 계산기 결과를 비교해 합계와 거스름돈의 오류를 고쳤습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['거스름돈', '예산', '검산'], imagePlaceholder: true } }],
  },
  {
    id: 'm6-l3',
    moduleId: 'm6',
    number: 3,
    kind: 'experience',
    title: '지도와 현장 표지로 길 확인하기',
    objective: '연습 지도에서 출발점과 목적지를 찾고, 아이미의 길 안내를 지도·표지와 대조해 안전한 길을 골라요.',
    standards: [ROUTE_STANDARDS[0]],
    bodyEasy: '고정된 연습 지도와 현장 표지를 보고 안전한 길을 확인해요.',
    bodyNormal:
      '개인 위치를 보내지 않는 고정된 연습 지도에서 출발점과 목적지를 찾고 표지와 공식 안내로 경로를 확인합니다.',
    wrapUpEasy: '지도와 표지가 다르면 멈추고 믿을 사람에게 물어요.',
    wrapUpNormal: 'AI가 만든 길 대신 고정 지도와 현장 표지를 근거로 경로와 도움 요청을 정했습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['지도', '위치 정보'], imagePlaceholder: true } }],
  },
  {
    id: 'm6-l4',
    moduleId: 'm6',
    number: 4,
    kind: 'experience',
    title: '교통 정보와 방향 확인하기',
    objective: '버스 번호·방향·정류장을 오늘 공지와 확인하고, 헷갈리면 타기 전에 안전하게 도움을 요청해요.',
    standards: ROUTE_STANDARDS,
    bodyEasy: '번호가 비슷해도 방향과 목적지를 공식 안내로 다시 확인해요.',
    bodyNormal:
      '버스 번호, 가는 방향, 정류장 표지, 운행 변경 공지를 함께 보고 기다리기·다른 노선·직원 도움 중 안전한 행동을 고릅니다.',
    wrapUpEasy: '교통은 공식 정보와 현장 안내를 먼저 봐요.',
    wrapUpNormal: 'AI의 일반 안내를 참고하되 공식 공지와 현장 표지로 방향을 확인하고 도움 요청 문장을 만들었습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['실시간 정보'], imagePlaceholder: true } }],
  },
  {
    id: 'm6-l5',
    moduleId: 'm6',
    number: 5,
    kind: 'experience',
    title: '공식 예보로 옷 준비하기',
    objective: '공식 예보의 기온·비·바람을 확인하고, 아이미의 한마디 대신 활동과 내 감각에 맞는 준비물을 골라요.',
    standards: [LIFE_STANDARD],
    bodyEasy: '지역과 날짜가 있는 공식 예보를 보고 나에게 맞는 준비를 골라요.',
    bodyNormal:
      '기온·비·바람뿐 아니라 활동 시간과 내가 덥고 춥게 느끼는 정도를 함께 보며 여러 타당한 외출 준비 중 하나를 고릅니다.',
    wrapUpEasy: '공식 예보와 내 감각을 함께 보고 준비해요.',
    wrapUpNormal: '지역·날짜가 있는 최신 예보를 근거로 활동과 내 감각에 맞는 옷과 준비물을 정했습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['예보'], imagePlaceholder: true } }],
  },
  {
    id: 'm6-l6',
    moduleId: 'm6',
    number: 6,
    kind: 'experience',
    title: '조건에 맞게 음식 계획 바꾸기',
    objective: '재료·알레르기·도구·도움 조건을 확인해, 아이미의 요리 초안을 안전한 순서로 고쳐 조립해요.',
    standards: ['[9정통03-03] 가정생활에서 디지털 기술이 적용된 사례를 살펴보고 경험한다.'],
    bodyEasy: '실제 조리 대신 카드로 안전한 음식 계획과 대체 재료를 골라요.',
    bodyNormal:
      '불을 쓰지 않는 과일 요거트 컵 계획을 재료, 알레르기, 도구, 성인 도움 카드와 비교하고 안전한 대체 순서를 만듭니다.',
    wrapUpEasy: '음식 계획은 건강과 도구 조건을 사람과 확인해요.',
    wrapUpNormal: 'AI 조리법을 초안으로 보고 맞지 않는 재료와 단계를 바꾸어 안전 음식 계획을 완성했습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['조리법'], imagePlaceholder: true } }],
  },
  {
    id: 'm6-l7',
    moduleId: 'm6',
    number: 7,
    kind: 'experience',
    title: '나에게 맞는 하루 계획',
    objective: '아이미의 빽빽한 일정에 쉬는 시간과 도움 시간을 넣어 고치고, 출발이 늦어지면 계획을 다시 맞춰요.',
    standards: [LIFE_STANDARD],
    bodyEasy: '할 일과 쉼, 도움 시간을 함께 넣어 나에게 맞는 계획을 만들어요.',
    bodyNormal:
      '마을 활동의 시간 블록을 배치하고 선호, 휴식, 필요한 도움, 걸리는 시간을 확인한 뒤 비로 출발 시간이 바뀌면 계획을 고칩니다.',
    wrapUpEasy: '계획은 내 필요와 바뀐 조건에 맞게 고칠 수 있어요.',
    wrapUpNormal: '알림을 명령이 아닌 도구로 사용하고 일정과 도움 조건이 달라졌을 때 계획을 다시 조정했습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['루틴'], imagePlaceholder: true } }],
  },
  {
    id: 'm6-l8',
    moduleId: 'm6',
    number: 8,
    kind: 'experience',
    title: '아픈 상태를 사람에게 알리기',
    objective: '몸이 불편할 때 말·그림 카드로 상태를 표현하는 연습을 아이미와 하고, 믿을 만한 어른에게 먼저 알려요.',
    standards: [LIFE_STANDARD],
    bodyEasy: '어디가 언제부터 어떻게 불편한지 표현하고 사람에게 먼저 알려요.',
    bodyNormal:
      '몸 위치, 느낌, 시작 시점, 위급 신호를 말·그림 카드 중 편한 방식으로 조립하고 믿을 만한 어른에게 전달합니다.',
    wrapUpEasy: 'AI보다 사람에게 먼저 알리고 급하면 바로 도움을 받아요.',
    wrapUpNormal: 'AI에게 진단을 맡기지 않고 관찰한 사실을 표현해 믿을 만한 어른과 전문 도움에 연결했습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['증상', '응급'], imagePlaceholder: true } }],
  },
  {
    id: 'm6-l9',
    moduleId: 'm6',
    number: 9,
    kind: 'experience',
    title: '인사·도움·거절을 내 방식으로 표현하기',
    objective: '인사·도움 요청·거절·다시 말해 달라는 표현을, 말·글·그림 카드 중 편한 방법으로 아이미와 연습해요.',
    standards: [DIALOG_STANDARD],
    bodyEasy: '도움, 거절, 다시 설명을 내게 편한 방법으로 표현해요.',
    bodyNormal:
      '가게와 정류장에서 인사뿐 아니라 물건 위치 묻기, 원하지 않는 권유 거절, 어려운 설명을 다시 요청하는 표현을 연습합니다.',
    wrapUpEasy: '좋은 소통에는 거절과 다시 말해 달라는 표현도 있어요.',
    wrapUpNormal: '상황과 상대 응답을 살피고 말·글·그림 카드 중 편한 방식으로 자기옹호 표현을 완성했습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['소통'], imagePlaceholder: true } }],
  },
  {
    id: 'm6-l10',
    moduleId: 'm6',
    number: 10,
    kind: 'experience',
    title: '직업을 실제 사람과 함께 알아보기',
    objective: '아이미가 예상한 직업의 모습과 실제 직업인의 이야기를 비교하고, 나의 흥미·강점·필요한 도움을 적어요.',
    standards: CAREER_STANDARDS,
    bodyEasy: 'AI의 예상과 실제 직업인의 설명을 비교하고 내 질문을 만들어요.',
    bodyNormal:
      '마을 직업인을 만나기 전에 질문을 준비하고 실제 자료와 인터뷰 설명을 AI 예상과 비교해 나의 흥미·강점·필요한 도움을 적습니다.',
    wrapUpEasy: '직업은 실제 자료와 사람에게 물어보고 나와 연결해요.',
    wrapUpNormal: '직업을 하나의 도구나 고정된 모습으로 단정하지 않고 실제 사람의 설명과 개인차를 확인했습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['직업', '자동화'], imagePlaceholder: true } }],
  },
  {
    id: 'm6-l11',
    moduleId: 'm6',
    number: 11,
    kind: 'experience',
    title: '상대에 맞는 자기소개 만들기',
    objective: '내가 먼저 쓴 자기소개에 아이미의 제안을 골라 반영해, 교실용과 온라인용 두 버전을 완성해요.',
    standards: [INTRO_STANDARD],
    bodyEasy: '내가 먼저 소개를 만들고 상대와 장소에 맞게 공개 범위를 바꿔요.',
    bodyNormal:
      '졸업 발표 자기소개를 먼저 쓴 뒤 AI 표현 제안을 쓰거나, 고치거나, 거절하고 개인정보 범위가 다른 교실용과 온라인용 소개를 완성합니다.',
    wrapUpEasy: '자기소개는 내 목소리로 시작하고 공개 범위는 내가 정해요.',
    wrapUpNormal: 'AI 제안을 그대로 복사하지 않고 내 표현과 개인정보 기준에 맞게 두 가지 자기소개로 고쳤습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['자기소개', '퇴고'], imagePlaceholder: true } }],
  },
  {
    id: 'm6-l12',
    moduleId: 'm6',
    number: 12,
    kind: 'activity',
    title: 'AI와 함께하는 나의 하루',
    objective: '오늘은 예산·이동·날씨·소통이 연결된 하루 계획을 만들고 나의 AI 생활 원칙과 함께 발표해 봐요.',
    standards: [LIFE_STANDARD, CHOICE_STANDARD],
    bodyEasy: '마을 행사 하루를 계획하고 내가 확인하고 결정할 생활 원칙을 발표해요.',
    bodyNormal:
      '장보기, 돈, 길, 교통, 날씨, 건강, 소통 기록을 골라 조건이 바뀌어도 확인하고 고칠 수 있는 하루 계획과 AI 생활 원칙을 완성합니다.',
    wrapUpEasy: 'AI는 초안을 돕고 실제 자료와 사람을 확인해 마지막 선택은 내가 해요.',
    wrapUpNormal: '열한 가지 생활 기록을 연결해 나의 AI 생활 포트폴리오와 졸업 발표를 완성했습니다.',
    steps: [{ kind: 'text', data: { dictionaryTerms: ['예산', '위치 정보', '응급'], imagePlaceholder: true } }],
  },
];
