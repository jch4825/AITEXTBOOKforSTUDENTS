import type { VisualNovelStory } from '../../../features/studio/types';

export const M3_L1_VISUAL_STORY: VisualNovelStory = {
  title: '동물 중에서 무엇이 궁금합니까?',
  objective: '예나 아니오로 끝나지 않는 질문을 만들어 물어봅니다.',
  scenes: [
    {
      id: 'start-animal-task',
      label: '장면 1 · 동물 과제 시작하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l1-vn-01.webp',
      alt: '윤아가 교실에서 여러 동물 그림이 있는 과제를 바라보는 장면',
      knowledgeStep: 0,
      copy: {
        full: { text: '윤아는 동물에 관해 궁금한 것을 아이미에게 물어보려고 합니다.' },
        light: { text: '윤아는 동물 소개 과제를 시작합니다. 여러 동물 중 무엇을 질문할지 아직 정하지 못했습니다.', perspective: '질문하기 전에는 내가 정말 알고 싶은 것을 생각하면 좋습니다.' },
        challenge: { text: '윤아 앞에는 여러 동물 자료가 있습니다. 과제의 주제는 동물이지만 대상, 궁금한 내용, 답의 길이는 아직 정해지지 않았습니다.', perspective: '넓은 주제는 질문의 출발점이지만 그 자체만으로는 필요한 답의 범위를 정하기 어렵습니다.' },
      },
    },
    {
      id: 'ask-wide-question',
      label: '장면 2 · 넓게 질문하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l1-vn-02.webp',
      alt: '윤아가 아이미에게 동물을 물어보고 많은 동물 자료가 한꺼번에 나타난 장면',
      knowledgeStep: 0,
      copy: {
        full: { text: '윤아가 동물에 관해 알려 달라고 하자 아이미는 아주 많은 내용을 보여 줍니다.' },
        light: { text: '윤아는 “동물에 관해 알려 줘.”라고 질문합니다. 아이미는 여러 동물의 특징을 길게 말합니다.', perspective: '질문이 넓으면 AI의 답도 넓고 길어질 수 있습니다.' },
        challenge: { text: '예나 아니오로 끝나지는 않지만 대상과 목적이 빠진 질문입니다. 아이미는 가능한 내용을 넓게 제시하고 윤아는 과제에 쓸 답을 찾기 어렵습니다.', perspective: '열린 질문도 필요한 범위가 드러나야 학습 목적에 맞는 답을 얻기 쉽습니다.' },
      },
    },
    {
      id: 'choose-clues',
      label: '장면 3 · 질문 단서 고르기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l1-vn-03.webp',
      alt: '윤아가 펭귄과 사는 곳과 먹이 그림 카드를 골라 질문을 만드는 장면',
      knowledgeStep: 1,
      copy: {
        full: { text: '윤아는 펭귄, 사는 곳, 먹이라는 단서를 고릅니다.' },
        light: { text: '윤아는 궁금한 동물을 펭귄으로 정합니다. 사는 곳과 먹이를 두 문장으로 쉽게 알려 달라는 질문을 만듭니다.', perspective: '대상, 알고 싶은 내용, 답의 모습을 넣으면 질문이 분명해집니다.' },
        challenge: { text: '윤아는 과제 목적에 맞게 대상을 펭귄으로 좁히고, 서식지와 먹이, 두 문장의 쉬운 설명이라는 조건을 선택합니다.', perspective: '조건은 많이 넣는 것이 목적이 아니라 필요한 답을 구분할 만큼 구체적으로 고르는 것이 중요합니다.' },
      },
    },
    {
      id: 'check-new-answer',
      label: '장면 4 · 질문과 답 비교하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l1-vn-04.webp',
      alt: '윤아가 아이미의 짧은 펭귄 설명과 자신의 질문 카드를 나란히 확인하는 장면',
      knowledgeStep: 2,
      copy: {
        full: { text: '윤아는 새 답이 자신의 질문에 맞는지 확인합니다.' },
        light: { text: '아이미는 펭귄의 사는 곳과 먹이를 짧게 설명합니다. 윤아는 자신이 물은 내용이 모두 들어 있는지 살펴봅니다.', perspective: '질문을 잘 만들었어도 받은 답이 질문과 맞는지 마지막에 확인합니다.' },
        challenge: { text: '윤아는 새 답에서 대상, 두 가지 정보, 설명 길이가 요청과 일치하는지 항목별로 비교합니다. 빠진 내용이 있으면 한 번 더 묻기로 합니다.', perspective: '질문 설계와 답 검토를 연결하면 AI의 응답을 학습 자료로 더 책임 있게 사용할 수 있습니다.' },
      },
    },
  ],
  knowledge: [
    { title: '넓은 질문과 좁은 질문은 무엇이 다릅니까?', core: '넓은 질문은 많은 답이 가능하고, 좁은 질문은 필요한 답의 범위를 알려 줍니다.', detail: { full: '궁금한 것을 골라 질문합니다.', light: '주제가 너무 넓으면 대상과 알고 싶은 내용을 정합니다.', challenge: '열린 질문의 장점은 유지하되 학습 목적에 맞는 탐색 범위를 구체화합니다.' } },
    { title: '질문에는 어떤 단서를 넣습니까?', core: '대상, 목적, 필요한 내용, 답의 모습을 골라 넣습니다.', detail: { full: '누구와 무엇인지 말합니다.', light: '어떤 대상을 왜 알아보는지와 원하는 답의 길이를 말합니다.', challenge: '과제 목적에 직접 필요한 맥락과 출력 조건만 선택하여 질문을 설계합니다.' }, flow: { input: '넓은 궁금증', process: '대상과 조건 고르기', output: '나에게 맞는 질문' } },
    { title: '답을 받은 뒤에는 무엇을 합니까?', core: '받은 답이 질문의 대상과 내용에 맞는지 확인합니다.', detail: { full: '질문과 답을 비교합니다.', light: '물어본 내용이 모두 들어 있는지 살펴봅니다.', challenge: '응답의 관련성, 빠진 정보, 요청한 형식을 비교하고 필요하면 후속 질문을 만듭니다.' } },
  ],
};

export const M3_L5_VISUAL_STORY: VisualNovelStory = {
  title: '작은 로봇의 다음 이야기는 무엇입니까?',
  objective: '내가 생각한 줄거리를 AI에게 말하고 이야기를 만들어 봅니다.',
  scenes: [
    {
      id: 'make-first-line', label: '장면 1 · 첫 장면 만들기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l5-vn-01.webp', alt: '진우가 비 오는 학교에 남은 작은 로봇 그림 카드를 펼쳐 이야기 첫 장면을 만드는 모습', knowledgeStep: 0,
      copy: {
        full: { text: '진우는 비 오는 학교에 남은 작은 로봇 이야기의 첫 장면을 만듭니다.' },
        light: { text: '진우는 “비가 오는 날, 작은 로봇이 학교에 남았습니다.”라는 줄거리를 아이미에게 말합니다.', perspective: 'AI와 이야기를 만들 때도 인물과 사건의 시작은 내가 정할 수 있습니다.' },
        challenge: { text: '진우는 주인공, 장소, 처음 사건을 정해 이야기의 방향을 제시합니다. 다음 장면은 아이미의 아이디어를 받아 함께 만들기로 합니다.', perspective: '공동창작에서도 학생의 의도와 선택이 이야기의 기준이 됩니다.' },
      },
    },
    {
      id: 'receive-scary-idea', label: '장면 2 · 다른 분위기의 제안', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l5-vn-02.webp', alt: '아이미가 어두운 복도와 큰 그림자를 제안하고 진우가 걱정스러운 표정으로 보는 장면', knowledgeStep: 0,
      copy: {
        full: { text: '아이미는 어두운 복도의 큰 그림자 이야기를 제안합니다.' },
        light: { text: '아이미는 작은 로봇이 어두운 복도에서 무서운 그림자를 만나는 장면을 제안합니다. 진우가 원한 즐거운 이야기와는 다릅니다.', perspective: 'AI가 낸 아이디어를 반드시 그대로 사용할 필요는 없습니다.' },
        challenge: { text: '아이미의 제안은 첫 줄거리와 연결되지만 분위기와 결말의 방향은 진우의 의도와 다릅니다. 진우는 어떤 부분을 남기고 바꿀지 생각합니다.', perspective: '제안의 연결성과 나의 창작 의도는 따로 비교할 수 있습니다.' },
      },
    },
    {
      id: 'revise-idea', label: '장면 3 · 내 생각으로 바꾸기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l5-vn-03.webp', alt: '진우가 그림자 대신 우산을 잃은 친구와 밝은 복도 그림 카드를 고르는 장면', knowledgeStep: 1,
      copy: {
        full: { text: '진우는 무서운 그림자 대신 우산을 잃은 친구를 넣습니다.' },
        light: { text: '진우는 학교 복도라는 장소는 받아들이고 무서운 그림자는 거절합니다. 대신 로봇이 우산을 잃은 친구를 돕는 장면으로 고칩니다.', perspective: 'AI 의견은 받아들이거나, 고치거나, 사용하지 않을 수 있습니다.' },
        challenge: { text: '진우는 제안 요소를 장소, 인물, 사건, 분위기로 나누어 판단합니다. 장소는 수용하고 사건과 분위기는 즐겁고 협력적인 방향으로 수정합니다.', perspective: '부분적으로 수용하고 수정하는 선택도 분명한 창작 판단입니다.' },
      },
    },
    {
      id: 'finish-storyboard', label: '장면 4 · 이야기 보드 완성하기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l5-vn-04.webp', alt: '진우와 아이미가 작은 로봇과 친구가 함께 우산을 찾는 세 장면 이야기 보드를 완성한 모습', knowledgeStep: 2,
      copy: {
        full: { text: '진우와 아이미는 생각을 합쳐 즐거운 이야기 보드를 완성합니다.' },
        light: { text: '작은 로봇은 친구와 함께 우산을 찾고 안전하게 집으로 갑니다. 진우는 마지막 결말을 직접 골라 이야기 보드를 완성합니다.', perspective: 'AI와 함께 만들었어도 최종 이야기를 선택하는 사람은 나입니다.' },
        challenge: { text: '진우는 자신의 처음 줄거리, 아이미에게서 받은 장소 아이디어, 직접 수정한 사건과 결말을 연결해 세 장면으로 구성합니다.', perspective: '공동창작의 결과에는 AI의 제안뿐 아니라 학생의 선택과 수정 과정이 함께 드러나야 합니다.' },
      },
    },
  ],
  knowledge: [
    { title: 'AI는 창작에서 무엇을 합니까?', core: 'AI는 다음 장면, 인물, 사건 같은 아이디어를 제안할 수 있습니다.', detail: { full: 'AI가 이야기 생각을 냅니다.', light: '내 줄거리를 듣고 다음 장면의 한 가지 방법을 제안합니다.', challenge: 'AI의 제안은 가능한 선택지이며 창작 의도에 맞는지는 사용자가 판단합니다.' } },
    { title: 'AI 의견을 어떻게 판단합니까?', core: '마음에 드는 부분은 받고, 다른 부분은 고치거나 거절합니다.', detail: { full: '받기, 고치기, 거절하기를 고릅니다.', light: 'AI 제안을 내 생각과 비교한 뒤 사용할 부분을 정합니다.', challenge: '제안의 요소를 나누어 부분 수용, 변형, 제외하는 판단을 할 수 있습니다.' }, flow: { input: 'AI의 제안', process: '수용·수정·거절', output: '나의 다음 장면' } },
    { title: '함께 만든 결과는 누가 정합니까?', core: '최종 이야기와 표현은 내가 검토하고 결정합니다.', detail: { full: '내가 마지막 이야기를 고릅니다.', light: 'AI와 만든 내용을 읽고 마음에 맞게 완성합니다.', challenge: '학생은 이야기의 목적, 분위기, 안전성, 독자를 기준으로 최종 결과를 편집합니다.' } },
  ],
};

export const M3_L9_VISUAL_STORY: VisualNovelStory = {
  title: '그림에 정말 그렇게 보입니까?',
  objective: 'AI에게 그림을 보여주고 무슨 그림인지 설명해 달라고 합니다.',
  scenes: [
    {
      id: 'show-picture', label: '장면 1 · 그림 보여 주기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l9-vn-01.webp', alt: '윤아가 가방을 든 두 학생 그림을 아이미에게 보여 주는 장면', knowledgeStep: 0,
      copy: {
        full: { text: '윤아는 가방을 든 두 학생의 그림을 아이미에게 보여 줍니다.' },
        light: { text: '그림에는 가방을 든 두 학생이 함께 서 있습니다. 윤아는 아이미에게 그림을 설명해 달라고 합니다.', perspective: '그림 설명은 먼저 눈에 보이는 사람, 사물, 행동에서 시작합니다.' },
        challenge: { text: '윤아는 인물의 수, 가방, 서 있는 행동은 직접 확인할 수 있지만 장소와 목적, 감정은 아직 알 수 없는 그림을 제시합니다.', perspective: '시각 정보에는 직접 관찰한 사실과 맥락이 필요한 해석이 함께 존재합니다.' },
      },
    },
    {
      id: 'hear-guess', label: '장면 2 · 설명 속 추측 찾기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l9-vn-02.webp', alt: '아이미가 소풍 장면을 떠올리고 윤아가 원래 그림과 비교하는 모습', knowledgeStep: 0,
      copy: {
        full: { text: '아이미는 두 학생이 소풍을 가서 행복하다고 설명합니다.' },
        light: { text: '아이미는 “두 학생이 소풍을 가서 행복합니다.”라고 설명합니다. 그림에는 소풍 장소나 학생의 마음을 알려 주는 단서가 없습니다.', perspective: 'AI 설명에는 그림에서 보이는 것뿐 아니라 추측이 섞일 수 있습니다.' },
        challenge: { text: '아이미는 가방과 두 학생이라는 사실에 소풍이라는 목적과 행복이라는 감정을 덧붙였습니다. 윤아는 설명의 각 부분을 원본 그림과 대조합니다.', perspective: '그럴듯한 해석도 직접 확인되는 시각적 근거가 없다면 추측으로 구분해야 합니다.' },
      },
    },
    {
      id: 'sort-fact-guess', label: '장면 3 · 사실과 추측 나누기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l9-vn-03.webp', alt: '윤아가 보이는 사실 카드와 확실하지 않은 추측 카드를 서로 다른 색 영역에 놓는 장면', knowledgeStep: 1,
      copy: {
        full: { text: '윤아는 보이는 사실과 확실하지 않은 추측을 나눕니다.' },
        light: { text: '윤아는 두 학생, 가방, 서 있다는 내용을 사실 쪽에 놓습니다. 소풍과 행복은 확실하지 않은 내용 쪽에 놓습니다.', perspective: '그림에서 근거를 가리킬 수 있으면 사실로 설명하기 쉽습니다.' },
        challenge: { text: '윤아는 관찰 가능한 대상과 행동을 사실로, 목적과 내적 상태를 추론으로 분류합니다. 추측에는 단정 대신 가능성을 나타내는 표현을 붙입니다.', perspective: '사실과 추측을 구분하면 AI의 이미지 설명을 더 정확하게 고칠 수 있습니다.' },
      },
    },
    {
      id: 'revise-description', label: '장면 4 · 사실 중심으로 고치기', imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m3-l9-vn-04.webp', alt: '윤아와 아이미가 원본 그림 옆에 두 학생과 가방만 나타낸 사실 중심 설명 카드를 완성하는 장면', knowledgeStep: 2,
      copy: {
        full: { text: '윤아와 아이미는 그림에서 보이는 내용을 중심으로 설명을 고칩니다.' },
        light: { text: '설명은 “가방을 든 두 학생이 함께 서 있습니다.”로 고쳐집니다. 어디에 가는지와 기분은 그림만으로 알 수 없다고 덧붙입니다.', perspective: '확실하지 않은 부분을 모른다고 말하는 것도 정확한 설명입니다.' },
        challenge: { text: '윤아는 관찰 문장과 불확실성 문장을 분리해 최종 설명을 만듭니다. 추가 맥락이 필요하면 사진을 제공한 사람에게 확인하기로 합니다.', perspective: '정확한 이미지 설명은 모든 것을 단정하는 설명이 아니라 근거와 한계를 함께 밝히는 설명입니다.' },
      },
    },
  ],
  knowledge: [
    { title: '그림에서 보이는 사실은 무엇입니까?', core: '사람, 사물, 색, 위치, 행동처럼 직접 확인할 수 있는 내용입니다.', detail: { full: '눈으로 보이는 것을 말합니다.', light: '그림에서 손가락으로 가리킬 수 있는 내용을 먼저 말합니다.', challenge: '관찰 가능한 시각 특징과 행동을 해석이나 평가와 구분해 기술합니다.' } },
    { title: 'AI가 더한 추측은 무엇입니까?', core: '목적, 마음, 까닭처럼 그림만으로 확실히 알기 어려운 내용입니다.', detail: { full: '보이지 않는 마음은 추측일 수 있습니다.', light: '어디에 가는지와 왜 그런지는 다른 정보가 필요할 수 있습니다.', challenge: '맥락과 내적 상태에 대한 설명은 시각적 근거가 있는지 확인하고 불확실성을 표시합니다.' }, flow: { input: 'AI의 그림 설명', process: '사실과 추측 나누기', output: '근거 있는 설명' } },
    { title: '설명을 어떻게 확인합니까?', core: '원본 그림과 문장을 비교하고 확실하지 않은 내용은 조심해서 고칩니다.', detail: { full: '그림과 설명을 비교합니다.', light: '보이지 않는 내용은 빼거나 확실하지 않다고 말합니다.', challenge: '관찰 근거를 대조하고 필요한 경우 원자료 제공자나 다른 정보로 맥락을 확인합니다.' } },
  ],
};
