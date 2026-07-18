import type { VisualNovelStory } from '../../../features/studio/types';

export const M5_L1_VISUAL_STORY: VisualNovelStory = {
  title: '버스가 오지 않는다면 무엇이 문제입니까?',
  objective: '지금 상황과 내가 바라는 것이 다를 때 이것이 문제임을 압니다.',
  scenes: [
    { id: 'plan-trip', label: '장면 1 · 약속 장소로 출발하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l1-vn-01.webp', alt: '윤아가 낮의 안전한 버스 정류장에서 약속 장소 그림과 버스 도착 정보를 보는 장면', knowledgeStep: 0, copy: {
      full: { text: '윤아는 약속 시간에 맞추어 버스를 타려고 합니다.' },
      light: { text: '윤아는 도서관에서 친구를 만나기로 했습니다. 버스를 타면 약속 시간 전에 도착할 수 있다고 생각합니다.', perspective: '문제를 찾으려면 내가 바라는 결과를 먼저 알고 있어야 합니다.' },
      challenge: { text: '윤아의 목표는 정해진 시간까지 도서관에 안전하게 도착하는 것입니다. 처음 계획은 예정된 버스를 이용하는 것입니다.', perspective: '목표와 현재 계획을 구분해 두면 상황이 바뀌었을 때 문제를 더 분명히 찾을 수 있습니다.' },
    } },
    { id: 'wait-for-bus', label: '장면 2 · 오지 않는 버스 기다리기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l1-vn-02.webp', alt: '윤아가 정류장에서 예정 시간이 지났지만 오지 않는 버스를 기다리는 장면', knowledgeStep: 0, copy: {
      full: { text: '예정 시간이 지났지만 버스가 오지 않습니다.' },
      light: { text: '버스 도착 예정 시간이 지났는데도 버스가 보이지 않습니다. 윤아는 조금 더 기다리면 되는지 생각합니다.', perspective: '지금 상황이 내가 바라는 도착과 달라지기 시작했습니다.' },
      challenge: { text: '예정된 교통수단이 도착하지 않아 계획대로 이동하기 어려운 상태입니다. 아직 지연 시간과 약속에 미치는 영향은 확실하지 않습니다.', perspective: '문제는 불편한 기분만이 아니라 현재 상태와 목표 상태 사이의 차이입니다.' },
    } },
    { id: 'notice-changes', label: '장면 3 · 달라진 조건 확인하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l1-vn-03.webp', alt: '윤아가 늦어진 버스 정보와 가까워진 약속 시간과 보호자 연락 카드를 비교하는 장면', knowledgeStep: 1, copy: {
      full: { text: '버스는 더 늦어지고 약속 시간은 가까워집니다.' },
      light: { text: '새 도착 정보에는 버스가 더 늦는다고 표시됩니다. 그대로 기다리면 약속 시간에 도착하기 어렵습니다.', perspective: '시간과 이동 정보가 바뀌면 처음 계획이 아직 가능한지 다시 봅니다.' },
      challenge: { text: '윤아는 예상 도착, 남은 시간, 현재 위치, 연락 가능 수단을 함께 확인합니다. 목표와 현재 상황의 차이가 분명해집니다.', perspective: '문제를 구체적으로 표현하면 가능한 해결 방법의 조건도 찾기 쉬워집니다.' },
    } },
    { id: 'choose-safe-plan', label: '장면 4 · 안전한 다음 방법 고르기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l1-vn-04.webp', alt: '윤아가 보호자에게 연락하며 다음 버스를 기다리기와 안전한 다른 이동 방법을 비교하는 장면', knowledgeStep: 2, copy: {
      full: { text: '윤아는 친구와 보호자에게 알리고 안전한 다음 방법을 고릅니다.' },
      light: { text: '윤아는 늦는다고 연락합니다. 밝고 안전한 정류장에서 다음 버스를 기다릴지 보호자와 다른 방법을 고를지 결정합니다.', perspective: '목표를 꼭 같은 방법으로 이루어야 하는 것은 아닙니다.' },
      challenge: { text: '윤아는 도착 시간, 안전, 연락 가능성을 기준으로 여러 대안을 비교합니다. 상황에 따라 기다리기 또는 보호자 도움을 선택할 수 있습니다.', perspective: '해결은 하나의 정답보다 목표와 조건에 맞게 계획을 조정하는 과정입니다.' },
    } },
  ],
  knowledge: [
    { title: '문제는 언제 생깁니까?', core: '지금 상황과 내가 바라는 결과가 서로 다를 때 문제가 생깁니다.', detail: { full: '지금과 바라는 것이 다르면 문제입니다.', light: '버스가 오지 않는 지금과 제시간에 도착하려는 목표를 비교합니다.', challenge: '현재 상태와 목표 상태의 차이를 구체적인 시간, 장소, 행동으로 표현합니다.' } },
    { title: '어떤 정보를 찾아봅니까?', core: '시간, 장소, 사람, 사용할 수 있는 방법처럼 달라진 조건을 찾습니다.', detail: { full: '무엇이 달라졌는지 봅니다.', light: '버스 도착과 남은 시간과 연락 방법을 확인합니다.', challenge: '문제 해결에 영향을 주는 제약과 이용 가능한 자원을 구분합니다.' }, flow: { input: '현재 상황과 목표', process: '달라진 조건 찾기', output: '구체적인 문제' } },
    { title: '다음 방법은 어떻게 고릅니까?', core: '여러 방법의 시간과 안전을 비교하고 새 조건에 맞게 계획을 바꿉니다.', detail: { full: '안전한 다른 방법도 생각합니다.', light: '기다리기, 연락하기, 도움받기를 비교합니다.', challenge: '목표는 유지하되 조건에 맞지 않는 수단은 수정하고 안전한 대안을 선택합니다.' } },
  ],
};

export const M5_L6_VISUAL_STORY: VisualNovelStory = {
  title: '아이미가 다른 도서관을 알려 주었다면?',
  objective: 'AI가 내 말을 오해하면 더 구체적인 이름으로 다시 말합니다.',
  scenes: [
    { id: 'ask-library', label: '장면 1 · 도서관 길 묻기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l6-vn-01.webp', alt: '진우가 학교 앞에서 아이미에게 중앙도서관으로 가는 길을 묻는 장면', knowledgeStep: 0, copy: {
      full: { text: '진우는 아이미에게 중앙도서관으로 가는 길을 묻습니다.' },
      light: { text: '진우는 학교 근처 중앙도서관에 가려고 합니다. 아이미에게 중앙도서관 가는 길을 알려 달라고 말합니다.', perspective: '같은 이름의 장소가 여러 곳에 있을 수 있습니다.' },
      challenge: { text: '진우는 장소 이름만 말하고 지역, 출발점, 건물 특징은 알려 주지 않았습니다. 질문의 대상이 하나로 정해지지 않을 수 있습니다.', perspective: 'AI의 오해는 사용자의 잘못이라기보다 필요한 구분 정보가 부족한 대화 상황일 수 있습니다.' },
    } },
    { id: 'wrong-branch', label: '장면 2 · 다른 지점 안내받기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l6-vn-02.webp', alt: '아이미가 멀리 있는 다른 중앙도서관 지점을 지도 그림으로 안내하고 진우가 낯설어하는 장면', knowledgeStep: 0, copy: {
      full: { text: '아이미는 멀리 있는 다른 중앙도서관을 안내합니다.' },
      light: { text: '아이미가 보여 준 도서관은 진우가 아는 건물과 다르고 버스로 아주 오래 걸립니다. 진우는 아이미가 다른 장소를 생각했다고 알아차립니다.', perspective: '답이 내 상황과 다르면 AI가 어떤 말을 다르게 이해했는지 찾습니다.' },
      challenge: { text: '안내 결과의 거리와 건물 모양이 진우의 예상과 일치하지 않습니다. 장소 이름은 같지만 지점이 다른 것으로 보입니다.', perspective: '오해를 확인할 때는 단순히 틀렸다고 말하기보다 일치하지 않는 구체적 단서를 찾습니다.' },
    } },
    { id: 'add-safe-clues', label: '장면 3 · 안전한 단서 더해 말하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l6-vn-03.webp', alt: '진우가 학교 앞 출발점과 공원 옆 벽돌 도서관 그림 카드를 아이미에게 보여 주는 장면', knowledgeStep: 1, copy: {
      full: { text: '진우는 학교 앞에서 출발하며 공원 옆 벽돌 도서관이라고 다시 말합니다.' },
      light: { text: '진우는 집 주소를 말하지 않고 학교 앞에서 출발하며 공원 옆 벽돌 건물인 중앙도서관이라고 구체적으로 말합니다.', perspective: '장소를 구분할 수 있는 안전한 이름과 특징을 더합니다.' },
      challenge: { text: '진우는 출발점, 지역 범위, 공공 건물의 특징을 보완하되 집 주소와 개인 위치 같은 불필요한 개인정보는 제외합니다.', perspective: '구체성은 개인정보를 많이 말하는 것이 아니라 대상을 안전하게 구분하는 단서를 선택하는 것입니다.' },
    } },
    { id: 'verify-destination', label: '장면 4 · 출발 전에 확인하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l6-vn-04.webp', alt: '진우가 공원 옆 벽돌 도서관 표지 그림과 버스 안내를 선생님과 확인하는 장면', knowledgeStep: 2, copy: {
      full: { text: '진우는 건물과 노선이 맞는지 확인한 뒤 출발합니다.' },
      light: { text: '새 안내에는 공원 옆 벽돌 도서관이 보입니다. 진우는 학교 안내와 선생님에게 목적지를 확인한 뒤 이동합니다.', perspective: 'AI가 다시 이해했어도 이동 전에는 공식 안내와 사람으로 확인합니다.' },
      challenge: { text: '진우는 장소 이미지, 지점 정보, 이동 노선을 학교의 공식 안내와 대조합니다. 목적지가 확정된 뒤 안전한 경로를 선택합니다.', perspective: '대화 수정과 실제 환경 확인을 연결하면 오해가 이동 위험으로 이어지는 것을 줄일 수 있습니다.' },
    } },
  ],
  knowledge: [
    { title: 'AI는 왜 다르게 이해합니까?', core: '같은 이름이 여러 곳에 있거나 말에 구분 단서가 부족할 수 있습니다.', detail: { full: '이름만으로는 헷갈릴 수 있습니다.', light: '장소 이름이 같으면 AI가 다른 지점을 고를 수 있습니다.', challenge: '표현이 여러 대상을 가리킬 때 AI는 맥락 없이 하나를 추정할 수 있습니다.' } },
    { title: '어떻게 다시 말합니까?', core: '정확한 이름, 출발점, 안전한 건물 특징을 더합니다.', detail: { full: '이름과 특징을 더 말합니다.', light: '학교 앞, 공원 옆, 벽돌 건물처럼 구분되는 단서를 말합니다.', challenge: '대상을 구별하는 최소한의 맥락만 보완하고 불필요한 개인정보는 제외합니다.' }, flow: { input: 'AI의 오해', process: '구체적인 단서 더하기', output: '다시 이해한 요청' } },
    { title: '새 답은 어떻게 확인합니까?', core: '지도, 표지, 공식 안내와 믿을 수 있는 사람을 함께 확인합니다.', detail: { full: '출발 전에 장소를 확인합니다.', light: '건물 모습과 노선이 맞는지 선생님에게도 묻습니다.', challenge: '목적지와 경로를 독립된 현장·공식 정보로 교차 확인합니다.' } },
  ],
};

export const M5_L11_VISUAL_STORY: VisualNovelStory = {
  title: '라면을 끓이려는데 냄비가 없다면?',
  objective: '라면 끓이는 일의 순서를 세워 차례대로 해 보십시오.',
  scenes: [
    { id: 'make-plan', label: '장면 1 · 조리 순서 세우기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l11-vn-01.webp', alt: '진우가 가정실에서 라면과 물과 냄비 그림 카드로 조리 순서를 세우는 장면', knowledgeStep: 0, copy: {
      full: { text: '진우는 라면 끓이는 순서를 그림 카드로 세웁니다.' },
      light: { text: '진우는 재료 준비, 물 끓이기, 면 넣기, 불 끄기, 먹기 순서로 카드를 놓습니다. 민준 선생님이 함께 지켜봅니다.', perspective: '조리 계획에는 재료뿐 아니라 도구와 안전한 순서가 필요합니다.' },
      challenge: { text: '진우는 준비, 가열, 조리, 종료, 식사의 단계로 작업을 배열합니다. 뜨거운 조리는 성인의 감독 아래 진행하기로 합니다.', perspective: '순서는 행동의 나열이 아니라 필요한 조건과 위험을 함께 고려한 절차입니다.' },
    } },
    { id: 'find-no-pot', label: '장면 2 · 냄비가 없음을 발견하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l11-vn-02.webp', alt: '진우가 빈 냄비 보관장을 보고 준비한 순서 카드와 비교하는 장면', knowledgeStep: 0, copy: {
      full: { text: '조리를 시작하려는데 사용할 냄비가 없습니다.' },
      light: { text: '진우가 조리대를 확인하니 냄비 보관장이 비어 있습니다. 준비한 순서대로 라면을 끓일 수 없습니다.', perspective: '계획에 필요한 도구가 없으면 멈추고 조건을 다시 확인합니다.' },
      challenge: { text: '핵심 도구가 없어 가열 단계로 진행할 수 없습니다. 진우는 임의의 그릇을 불에 올리지 않고 절차를 멈춥니다.', perspective: '조건 변화가 생기면 다음 단계를 강행하지 않는 것도 안전한 문제 해결입니다.' },
    } },
    { id: 'compare-alternatives', label: '장면 3 · 가능한 방법 비교하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l11-vn-03.webp', alt: '진우와 민준 선생님이 냄비를 기다리기와 뜨겁지 않은 다른 음식 만들기 카드를 비교하는 장면', knowledgeStep: 1, copy: {
      full: { text: '진우는 선생님과 냄비를 기다리거나 다른 음식을 만드는 방법을 비교합니다.' },
      light: { text: '전자레인지용 그릇인지 확실하지 않아 사용하지 않습니다. 진우는 냄비가 생길 때까지 기다리기와 샌드위치 만들기를 비교합니다.', perspective: '다른 방법도 도구, 시간, 안전 조건에 맞는지 살펴야 합니다.' },
      challenge: { text: '진우는 대체 도구의 적합성을 추측하지 않고, 시간과 안전을 기준으로 연기 또는 비가열 음식 전환을 비교합니다.', perspective: '대안은 원래 목표와 똑같은 결과가 아니라 현재 조건에서 안전하게 가능한 결과일 수 있습니다.' },
    } },
    { id: 'revise-plan', label: '장면 4 · 안전하게 계획 바꾸기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m5-l11-vn-04.webp', alt: '진우가 선생님과 샌드위치를 만들며 라면 순서 카드는 다음 시간 상자에 보관하는 장면', knowledgeStep: 2, copy: {
      full: { text: '진우는 선생님과 샌드위치를 만들고 라면 조리는 다음으로 미룹니다.' },
      light: { text: '진우는 지금 가능한 샌드위치 만들기 순서를 새로 세웁니다. 라면은 냄비와 성인 도움을 준비한 다음에 만들기로 합니다.', perspective: '조건이 달라지면 순서를 고치거나 목표를 잠시 바꿀 수 있습니다.' },
      challenge: { text: '진우는 비가열 대안의 재료와 순서를 확인해 실행하고, 원래 조리 계획은 도구와 감독 조건을 갖춘 뒤 다시 사용하도록 보관합니다.', perspective: '안전한 계획 수정은 포기가 아니라 현재 조건에 맞춘 책임 있는 선택입니다.' },
    } },
  ],
  knowledge: [
    { title: '조리 순서에는 무엇이 필요합니까?', core: '재료, 도구, 행동 순서와 안전 조건이 모두 필요합니다.', detail: { full: '재료와 도구와 순서를 봅니다.', light: '시작 전에 필요한 것이 모두 있는지 확인합니다.', challenge: '각 단계의 선행 조건과 위험 요소까지 포함해 절차를 구성합니다.' } },
    { title: '조건이 달라지면 어떻게 합니까?', core: '멈추고 가능한 대안을 찾아 시간, 도구, 안전을 비교합니다.', detail: { full: '멈추고 다른 방법을 찾습니다.', light: '없는 도구 대신 안전하게 할 수 있는 방법을 비교합니다.', challenge: '부적절한 임시 도구는 제외하고 연기, 대체 활동, 도움 요청을 평가합니다.' }, flow: { input: '처음 조리 계획', process: '도구·시간·안전 다시 보기', output: '수정한 계획' } },
    { title: '뜨거운 조리는 무엇이 먼저입니까?', core: '알맞은 도구와 성인의 확인을 갖춘 뒤 안전하게 시작합니다.', detail: { full: '어른과 함께 안전을 확인합니다.', light: '임의의 그릇을 불에 올리지 않고 선생님이나 보호자에게 묻습니다.', challenge: '가열 기구와 용기의 적합성, 감독, 종료 절차를 확인한 뒤 실행합니다.' } },
  ],
};
