import type { VisualNovelStory } from '../../../features/studio/types';

export const M4_L1_VISUAL_STORY: VisualNovelStory = {
  title: '내일 체육복이 필요합니까?',
  objective: 'AI가 거짓말처럼 틀린 답을 자신 있게 할 수 있음을 압니다.',
  scenes: [
    { id: 'ask-schedule', label: '장면 1 · 내일 준비물 묻기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l1-vn-01.webp', alt: '진우가 열린 가방과 내일 시간표 카드를 앞에 두고 아이미에게 준비물을 묻는 장면', knowledgeStep: 0, copy: {
      full: { text: '진우는 아이미에게 내일 체육복이 필요한지 묻습니다.' },
      light: { text: '진우는 내일 수업 준비를 하며 아이미에게 체육복이 필요한지 묻습니다. 아이미가 어떤 시간표를 보는지는 아직 모릅니다.', perspective: 'AI는 질문에 답하지만 가지고 있는 정보가 최신인지 알 수 없을 때가 있습니다.' },
      challenge: { text: '진우는 내일 준비에 직접 영향을 주는 질문을 합니다. 답의 근거와 자료의 날짜는 아직 확인되지 않았습니다.', perspective: '행동으로 옮길 정보는 답의 자신감과 별도로 근거와 시점을 살펴야 합니다.' },
    } },
    { id: 'hear-confident-answer', label: '장면 2 · 자신 있는 답 듣기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l1-vn-02.webp', alt: '아이미가 체육복 그림을 자신 있게 보여 주고 진우가 가방에 넣으려는 장면', knowledgeStep: 0, copy: {
      full: { text: '아이미는 체육복이 꼭 필요하다고 자신 있게 말합니다.' },
      light: { text: '아이미는 매주 같은 요일에 체육 수업이 있다며 체육복을 가져가라고 말합니다. 진우는 체육복을 가방에 넣으려고 합니다.', perspective: 'AI는 틀린 답도 자연스럽고 자신 있게 말할 수 있습니다.' },
      challenge: { text: '아이미는 과거의 반복 일정에 근거한 듯 단정적으로 답합니다. 정확한 출처를 밝히지 않았지만 말투는 확신에 차 있습니다.', perspective: '유창함과 확신은 정보의 정확성을 보장하지 않습니다.' },
    } },
    { id: 'find-new-schedule', label: '장면 3 · 최신 시간표 찾기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l1-vn-03.webp', alt: '진우가 체육 그림이 있는 오래된 카드와 미술 그림이 있는 최신 시간표 카드를 비교하는 장면', knowledgeStep: 1, copy: {
      full: { text: '진우는 최신 시간표에서 내일 미술 수업을 발견합니다.' },
      light: { text: '교실의 최신 시간표에는 내일 미술 수업이 표시되어 있습니다. 아이미가 사용한 체육 시간표는 지난 학기 자료였습니다.', perspective: '정보가 다르면 자료의 날짜와 만든 곳을 확인합니다.' },
      challenge: { text: '진우는 두 자료의 과목뿐 아니라 게시 시점과 학교 공식 표시를 비교합니다. 최신 공식 시간표가 현재 상황에 더 맞습니다.', perspective: '검증은 다른 답을 하나 더 찾는 것이 아니라 근거의 최신성과 신뢰성을 비교하는 과정입니다.' },
    } },
    { id: 'verify-with-teacher', label: '장면 4 · 공식 안내로 확인하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l1-vn-04.webp', alt: '진우와 민준 선생님이 최신 시간표를 확인하고 미술도구를 가방에 넣는 장면', knowledgeStep: 2, copy: {
      full: { text: '진우는 선생님과 확인하고 미술도구를 챙깁니다.' },
      light: { text: '민준 선생님은 최신 학교 시간표가 맞다고 확인해 줍니다. 진우는 체육복 대신 필요한 미술도구를 챙깁니다.', perspective: '중요한 선택은 믿을 수 있는 자료와 사람으로 확인한 뒤 결정합니다.' },
      challenge: { text: '진우는 AI 답을 무조건 버리는 대신 틀린 근거를 찾아 수정합니다. 최종 행동은 최신 공식 자료와 담당 교사의 확인에 따릅니다.', perspective: 'AI의 오류를 발견하고 바로잡는 것은 AI를 책임 있게 사용하는 능력입니다.' },
    } },
  ],
  knowledge: [
    { title: 'AI는 어떻게 틀릴 수 있습니까?', core: 'AI는 그럴듯하고 자신 있는 말투로 틀린 정보를 만들 수 있습니다.', detail: { full: 'AI도 자신 있게 틀릴 수 있습니다.', light: '말이 자연스럽다고 항상 사실인 것은 아닙니다.', challenge: '응답의 유창성과 정확성은 별개이므로 사실 주장에는 근거 확인이 필요합니다.' } },
    { title: '어떤 근거를 살펴봅니까?', core: '자료를 만든 곳, 날짜, 현재 상황과의 일치 여부를 봅니다.', detail: { full: '누가 언제 만든 자료인지 봅니다.', light: '최신 학교 시간표처럼 믿을 수 있는 자료를 찾습니다.', challenge: '출처의 권한, 정보의 시점, 적용 범위를 비교하여 현재 상황에 맞는 근거를 고릅니다.' }, flow: { input: 'AI의 답', process: '출처와 날짜 비교', output: '확인된 정보' } },
    { title: '중요한 정보는 어떻게 확인합니까?', core: '최신 공식 자료와 믿을 수 있는 사람에게 다시 확인합니다.', detail: { full: '자료와 사람에게 확인합니다.', light: '학교 안내와 선생님의 설명을 함께 살펴봅니다.', challenge: '행동의 영향이 클수록 독립된 공식 근거와 책임 있는 사람의 확인을 거칩니다.' } },
  ],
};

export const M4_L5_VISUAL_STORY: VisualNovelStory = {
  title: '이 사진을 보내도 됩니까?',
  objective: '사진을 보내기 전에 한번 더 생각하는 약속을 지킵니다.',
  scenes: [
    { id: 'receive-request', label: '장면 1 · 사진 부탁 받기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l5-vn-01.webp', alt: '윤아가 학교 활동 사진을 보내 달라는 온라인 요청을 보고 멈춰 생각하는 장면', knowledgeStep: 0, copy: {
      full: { text: '윤아는 온라인에서 학교 활동 사진을 보내 달라는 부탁을 받습니다.' },
      light: { text: '온라인에서 최근 알게 된 사람이 윤아에게 학교 활동 사진을 보내 달라고 합니다. 상대가 누구이고 왜 필요한지는 분명하지 않습니다.', perspective: '사진을 부탁받아도 바로 보내지 않고 상대와 목적을 먼저 살펴봅니다.' },
      challenge: { text: '요청자는 실제 신원, 사용 목적, 공유 범위를 밝히지 않았습니다. 윤아는 전송 버튼을 누르기 전에 요청의 맥락을 확인합니다.', perspective: '사진 공유 판단은 내용뿐 아니라 상대, 목적, 이후의 유통 범위를 함께 고려합니다.' },
    } },
    { id: 'choose-photo', label: '장면 2 · 보낼 사진 고르기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l5-vn-02.webp', alt: '윤아가 교실에서 찍은 활동 사진을 선택하려다가 자세히 들여다보는 장면', knowledgeStep: 0, copy: {
      full: { text: '윤아는 활동 사진을 고르다가 잠시 멈춥니다.' },
      light: { text: '사진에는 윤아와 친구, 교실 창문, 교복이 함께 보입니다. 겉보기에는 평범하지만 더 살펴볼 정보가 있습니다.', perspective: '사진에는 내가 말하지 않은 정보도 함께 찍힐 수 있습니다.' },
      challenge: { text: '윤아는 사진의 주인공뿐 아니라 배경, 복장, 다른 사람의 얼굴까지 확인합니다. 한 장의 사진이 여러 개인정보를 결합할 수 있습니다.', perspective: '시각 정보는 직접 보이는 정보와 위치를 추론하게 하는 간접 단서를 모두 담을 수 있습니다.' },
    } },
    { id: 'find-private-clues', label: '장면 3 · 개인정보 단서 찾기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l5-vn-03.webp', alt: '윤아가 사진 속 이름표와 친구 얼굴과 창밖 위치 단서를 찾아 표시하는 장면', knowledgeStep: 1, copy: {
      full: { text: '윤아는 이름표, 사람의 얼굴, 위치 단서를 발견합니다.' },
      light: { text: '사진을 확대하자 교복 이름표와 친구의 얼굴, 학교 근처를 알 수 있는 배경이 보입니다. 윤아는 그대로 보내지 않기로 합니다.', perspective: '이름, 얼굴, 장소를 알 수 있는 단서는 개인정보가 될 수 있습니다.' },
      challenge: { text: '윤아는 직접 식별 정보인 이름과 얼굴, 위치를 추론하게 하는 배경 단서를 구분합니다. 사진에 나온 친구의 동의도 필요하다는 점을 생각합니다.', perspective: '나의 사진이라도 다른 사람의 정보가 포함되면 혼자 공유 범위를 결정하기 어렵습니다.' },
    } },
    { id: 'share-safely', label: '장면 4 · 가리고 안전하게 공유하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l5-vn-04.webp', alt: '윤아와 민준 선생님이 개인정보를 가린 사진을 학교의 제한된 과제 공간에서 확인하는 장면', knowledgeStep: 2, copy: {
      full: { text: '윤아는 선생님과 확인하고 개인정보를 가린 사진만 정해진 공간에 올립니다.' },
      light: { text: '윤아는 낯선 상대에게 사진을 보내지 않습니다. 선생님과 상의해 이름과 얼굴과 위치 단서를 가리고 학교 과제 공간에만 올립니다.', perspective: '보내지 않기, 가리기, 믿을 수 있는 어른에게 도움 요청하기를 선택할 수 있습니다.' },
      challenge: { text: '윤아는 불분명한 요청을 거절하고, 교육 목적과 접근 범위가 확인된 공간에서만 비식별화한 사진을 공유합니다.', perspective: '안전한 공유는 전송 전 최소화, 동의, 목적 제한, 접근 범위 확인을 포함합니다.' },
    } },
  ],
  knowledge: [
    { title: '사진에는 어떤 정보가 담깁니까?', core: '얼굴과 이름뿐 아니라 교복, 배경, 위치 단서도 담길 수 있습니다.', detail: { full: '사진에도 개인정보가 있습니다.', light: '사람과 이름과 장소를 알 수 있는 부분을 찾습니다.', challenge: '직접 식별 정보와 배경을 통한 간접 추론 정보를 모두 점검합니다.' } },
    { title: '보내기 전에 무엇을 봅니까?', core: '상대가 누구인지, 왜 필요한지, 누가 볼 수 있는지 확인합니다.', detail: { full: '상대와 목적을 확인합니다.', light: '믿을 수 있는 사람인지와 사진을 어디에 쓰는지 봅니다.', challenge: '요청자의 신원, 이용 목적, 재공유 가능성, 접근 범위를 종합해 판단합니다.' }, flow: { input: '사진 공유 요청', process: '사람·목적·범위 확인', output: '안전한 선택' } },
    { title: '위험한 정보가 보이면 어떻게 합니까?', core: '보내지 않거나 정보를 가리고 믿을 수 있는 어른에게 도움을 요청합니다.', detail: { full: '멈추고 어른에게 묻습니다.', light: '이름과 얼굴과 위치를 가리거나 사진을 보내지 않습니다.', challenge: '필요 최소한으로 비식별화하고 다른 사람의 동의와 안전한 공유 공간을 확인합니다.' } },
  ],
};

export const M4_L10_VISUAL_STORY: VisualNovelStory = {
  title: '“꼭 사야 합니다”라는 말을 보았다면?',
  objective: '화면에서 진짜 정보와 파는 광고를 다른 점을 찾습니다.',
  scenes: [
    { id: 'see-recommendation', label: '장면 1 · 추천 게시물 보기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l10-vn-01.webp', alt: '진우가 화려한 음료 추천 게시물을 휴대 기기에서 보는 장면', knowledgeStep: 0, copy: {
      full: { text: '진우는 모두에게 좋다며 음료를 사라고 권하는 게시물을 봅니다.' },
      light: { text: '화려한 게시물은 한 음료가 모두에게 가장 좋고 지금 꼭 사야 한다고 소개합니다. 좋은 점만 크게 보입니다.', perspective: '추천처럼 보여도 물건을 팔기 위해 만든 광고일 수 있습니다.' },
      challenge: { text: '게시물은 보편적 효과와 긴급성을 강조하지만 작성 주체와 근거는 눈에 잘 띄지 않습니다.', perspective: '콘텐츠의 표현보다 누가 어떤 목적으로 만들었는지 확인해야 정보와 광고를 구분할 수 있습니다.' },
    } },
    { id: 'want-to-buy', label: '장면 2 · 바로 사려 하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l10-vn-02.webp', alt: '진우가 게시물 속 구매 그림을 누르려 하고 아이미가 함께 화면을 살피는 장면', knowledgeStep: 0, copy: {
      full: { text: '진우는 게시물만 믿고 음료를 바로 사려고 합니다.' },
      light: { text: '진우는 모두에게 좋다는 말을 믿고 구매 그림을 누르려 합니다. 자신의 필요와 제품 정보는 아직 확인하지 않았습니다.', perspective: '강한 추천과 서두르게 하는 말은 판단을 빠르게 만들 수 있습니다.' },
      challenge: { text: '진우는 사회적 증거와 긴급성을 이용한 표현에 영향을 받습니다. 게시물은 가격, 성분, 맞지 않는 사람에 관한 정보를 충분히 보여 주지 않습니다.', perspective: '광고가 만든 감정과 실제 구매 기준을 분리해 살펴볼 필요가 있습니다.' },
    } },
    { id: 'find-ad-clues', label: '장면 3 · 광고 단서 찾기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l10-vn-03.webp', alt: '진우가 게시물의 작은 광고 표시와 구매 연결 그림과 빠진 제품 정보 자리를 찾는 장면', knowledgeStep: 1, copy: {
      full: { text: '진우는 작은 광고 표시와 구매 연결 그림을 발견합니다.' },
      light: { text: '화면을 자세히 보니 작은 광고 표시와 바로 사는 연결 그림이 있습니다. 성분과 주의 정보는 잘 보이지 않습니다.', perspective: '광고 표시, 구매 연결, 좋은 점만 강조하는 표현은 광고 단서입니다.' },
      challenge: { text: '진우는 상업적 표시, 행동 유도 버튼, 선택적으로 제시된 장점을 찾고 빠진 근거와 위험 정보를 구분합니다.', perspective: '광고 판별은 표시를 찾는 데서 끝나지 않고 생략된 정보와 설득 목적을 함께 분석하는 과정입니다.' },
    } },
    { id: 'compare-needs', label: '장면 4 · 정보와 내 필요 비교하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m4-l10-vn-04.webp', alt: '진우와 민준 선생님이 음료 성분과 가격과 자신의 필요를 여러 자료로 비교하는 장면', knowledgeStep: 2, copy: {
      full: { text: '진우는 다른 자료와 자신의 필요를 비교한 뒤 살지 결정합니다.' },
      light: { text: '진우는 제품의 성분과 가격을 다른 자료에서 확인하고 선생님과 자신의 필요를 생각합니다. 광고만 보고 바로 사지 않습니다.', perspective: '여러 정보와 내 상황을 비교하면 사지 않는 선택도 할 수 있습니다.' },
      challenge: { text: '진우는 독립된 제품 정보, 비용, 자신의 건강과 필요를 비교합니다. 구매 여부는 광고의 권유가 아니라 확인된 기준에 따라 결정합니다.', perspective: '비판적 소비는 모든 광고를 거부하는 것이 아니라 목적과 근거를 알고 주체적으로 선택하는 것입니다.' },
    } },
  ],
  knowledge: [
    { title: '추천과 광고의 목적은 무엇입니까?', core: '광고는 관심을 끌고 물건이나 서비스를 선택하게 하려는 목적이 있습니다.', detail: { full: '광고는 물건을 사게 하려고 합니다.', light: '추천 글도 판매 목적이 있으면 광고일 수 있습니다.', challenge: '정보 제공과 상업적 설득이 함께 있을 수 있으므로 제작 주체와 이익 관계를 봅니다.' } },
    { title: '어떤 광고 단서를 찾습니까?', core: '광고 표시, 구매 연결, 좋은 점만 강조하는 말과 빠진 정보를 찾습니다.', detail: { full: '광고 표시와 사는 그림을 찾습니다.', light: '서두르게 하는 말과 작게 적힌 표시도 봅니다.', challenge: '상업적 표시, 긴급성, 과장, 선택적 정보 제시와 누락된 근거를 함께 분석합니다.' }, flow: { input: '추천처럼 보이는 글', process: '목적과 단서 찾기', output: '광고 여부 판단' } },
    { title: '구매는 어떻게 결정합니까?', core: '다른 자료, 가격, 제품 정보와 나의 필요를 비교합니다.', detail: { full: '정보와 내 필요를 비교합니다.', light: '광고 말만 믿지 않고 성분과 가격을 확인합니다.', challenge: '독립된 근거와 개인의 필요, 비용, 안전을 비교해 최종 선택을 내립니다.' } },
  ],
};
