import type { VisualNovelStory } from '../../../features/studio/types';

export const M2_L1_VISUAL_STORY: VisualNovelStory = {
  title: '“그거”가 무엇일까?',
  objective: '프롬프트에 들어갈 세 가지 요소를 알아봅니다.',
  scenes: [
    {
      id: 'wonder-about-lunch',
      label: '장면 1 · 급식이 궁금한 날',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l1-vn-01.webp',
      alt: '진우가 교실에서 오늘 급식이 궁금해 급식 안내판과 아이미를 바라보는 장면',
      knowledgeStep: 0,
      copy: {
        full: { text: '진우는 오늘 급식이 궁금합니다. 진우는 아이미에게 물어보기로 합니다.' },
        light: {
          text: '점심시간이 다가옵니다. 진우는 오늘 급식 메뉴가 궁금하여 아이미에게 물어보기로 합니다.',
          perspective: 'AI에게 하는 질문이나 부탁을 프롬프트라고 합니다.',
        },
        challenge: {
          text: '진우는 오늘 학교 급식 메뉴를 미리 알고 싶습니다. 질문의 목적은 분명하지만 아직 아이미에게 어떤 말로 전달할지는 정하지 않았습니다.',
          perspective: '프롬프트는 내가 원하는 일을 AI가 이해하도록 전달하는 입력입니다.',
        },
      },
    },
    {
      id: 'say-that',
      label: '장면 2 · “그거 알려 줘”라고 말하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l1-vn-02.webp',
      alt: '진우가 아이미에게 그거 알려 달라고 말하고 아이미가 날씨 그림을 보여 주는 장면',
      knowledgeStep: 1,
      copy: {
        full: { text: '진우가 “그거 알려 줘.”라고 말합니다. 아이미는 오늘 날씨를 알려 줍니다.' },
        light: {
          text: '진우가 아이미에게 말합니다. “아이미야, 그거 알려 줘.” 아이미는 맑은 오늘 날씨를 알려 줍니다. 진우가 원한 급식 메뉴가 아닙니다.',
          perspective: '“그거”만으로는 무엇을 원하는지 AI가 알기 어렵습니다.',
        },
        challenge: {
          text: '진우의 프롬프트에는 알아볼 대상, 필요한 날짜, 원하는 답의 모양이 들어 있지 않습니다. 아이미는 가능한 뜻 가운데 날씨를 묻는 말로 이해합니다.',
          perspective: '맥락이 빠진 표현은 사람과 AI가 서로 다른 대상을 생각하게 만들 수 있습니다.',
        },
      },
    },
    {
      id: 'add-three-parts',
      label: '장면 3 · 세 가지 요소 넣기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l1-vn-03.webp',
      alt: '진우가 급식, 오늘, 짧은 목록 그림 카드를 가리키며 아이미에게 다시 질문하는 장면',
      knowledgeStep: 1,
      copy: {
        full: { text: '진우는 “오늘 학교 급식 메뉴를 짧게 알려 줘.”라고 다시 묻습니다.' },
        light: {
          text: '진우는 알고 싶은 일과 필요한 정보를 넣습니다. “오늘 학교 급식 메뉴를 한 줄씩 짧게 알려 줘.” 아이미는 새 프롬프트를 듣습니다.',
          perspective: '무엇을 할지, 필요한 상황, 답의 모양을 넣으면 뜻이 분명해집니다.',
        },
        challenge: {
          text: '진우는 지시인 급식 메뉴 알려 주기, 맥락인 오늘 우리 학교, 형식인 한 줄씩 짧게를 넣어 프롬프트를 수정합니다.',
          perspective: '지시·맥락·형식은 AI가 원하는 일을 구체적으로 이해하도록 돕는 세 요소입니다.',
        },
      },
    },
    {
      id: 'check-menu',
      label: '장면 4 · 급식표와 확인하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l1-vn-04.webp',
      alt: '진우와 아이미가 새로 받은 급식 답을 교실 급식표 그림과 비교하는 장면',
      knowledgeStep: 2,
      copy: {
        full: { text: '진우는 아이미의 새 답을 급식표와 비교합니다. 원하는 답인지 확인합니다.' },
        light: {
          text: '아이미는 오늘 급식 메뉴를 짧은 목록으로 알려 줍니다. 진우는 교실의 급식표와 같은지 확인합니다.',
          perspective: '분명하게 물어도 AI의 답은 실제 자료와 비교하여 확인합니다.',
        },
        challenge: {
          text: '새 답은 진우가 요청한 대상과 형식에 맞습니다. 진우는 내용까지 맞는지 학교 급식표와 비교한 뒤 필요한 정보를 사용합니다.',
          perspective: '좋은 프롬프트는 원하는 형태의 답을 돕지만, 답의 사실성까지 보장하지는 않습니다.',
        },
      },
    },
  ],
  knowledge: [
    {
      title: '프롬프트는 무엇입니까?',
      core: 'AI에게 하는 질문이나 부탁을 프롬프트라고 합니다.',
      detail: {
        full: 'AI에게 원하는 일을 말합니다.',
        light: '프롬프트는 AI가 할 일을 알려 주는 말이나 글입니다.',
        challenge: '프롬프트는 AI가 답을 만들 때 사용하는 질문, 지시, 상황 정보입니다.',
      },
    },
    {
      title: '세 가지 요소는 무엇입니까?',
      core: '지시, 맥락, 형식을 넣어 프롬프트를 만듭니다.',
      detail: {
        full: '할 일, 필요한 정보, 답의 모양을 말합니다.',
        light: '무엇을 할지, 어떤 상황인지, 어떻게 답할지를 말합니다.',
        challenge: '지시는 할 일, 맥락은 목적과 상황, 형식은 답의 길이·개수·모양을 정합니다.',
      },
      flow: { input: '지시와 맥락', process: '프롬프트', output: '원하는 형식의 답' },
    },
    {
      title: '답을 받은 뒤 무엇을 합니까?',
      core: '원한 답인지 보고 실제 자료와 비교합니다.',
      detail: {
        full: '답이 맞는지 확인합니다.',
        light: '프롬프트에 맞는지와 내용이 맞는지를 확인합니다.',
        challenge: '답의 관련성과 사실성을 나누어 살펴보고 필요한 경우 프롬프트를 다시 고칩니다.',
      },
    },
  ],
};

export const M2_L6_VISUAL_STORY: VisualNovelStory = {
  title: '내일 준비를 어떻게 부탁할까?',
  objective: '큰 질문을 작은 단계로 쪼개서 하나씩 물어봅니다.',
  scenes: [
    {
      id: 'many-things',
      label: '장면 1 · 할 일이 많은 저녁',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l6-vn-01.webp',
      alt: '윤아가 집 책상에서 다음 날 수업과 준비물과 알람을 한꺼번에 생각하는 장면',
      knowledgeStep: 0,
      copy: {
        full: { text: '윤아는 내일 학교 준비를 하려고 합니다. 확인할 일이 많습니다.' },
        light: {
          text: '윤아는 집에서 내일 학교 준비를 하고 있습니다. 시간표, 준비물, 일어날 시간을 한꺼번에 생각하니 무엇부터 할지 어렵습니다.',
          perspective: '큰 부탁에는 여러 가지 작은 일이 함께 들어 있을 수 있습니다.',
        },
        challenge: {
          text: '윤아는 내일의 수업, 과목별 준비물, 아침 알람을 모두 확인해야 합니다. 서로 다른 정보가 한꺼번에 떠올라 요청을 만들기 어렵습니다.',
          perspective: '복잡한 과제는 필요한 결과를 작은 단계로 나누면 시작 지점이 분명해집니다.',
        },
      },
    },
    {
      id: 'ask-everything',
      label: '장면 2 · 한꺼번에 부탁하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l6-vn-02.webp',
      alt: '윤아가 아이미에게 여러 학교 준비를 한꺼번에 부탁하고 화면에 복잡한 카드가 가득한 장면',
      knowledgeStep: 0,
      copy: {
        full: { text: '윤아는 아이미에게 모든 준비를 한 번에 부탁합니다. 답이 길고 복잡합니다.' },
        light: {
          text: '윤아가 “내일 학교 준비를 전부 도와줘.”라고 말합니다. 아이미는 수업, 준비물, 알람을 섞어 긴 답을 만듭니다.',
          perspective: '여러 일을 한 번에 물으면 어떤 답부터 봐야 할지 어려울 수 있습니다.',
        },
        challenge: {
          text: '“학교 준비를 전부 도와줘.”라는 요청에는 서로 다른 세 가지 결과가 들어 있습니다. 아이미의 답도 여러 정보가 섞여 확인 순서가 분명하지 않습니다.',
          perspective: '한 프롬프트에 목적이 여러 개이면 일부 조건이 빠지거나 결과가 뒤섞일 수 있습니다.',
        },
      },
    },
    {
      id: 'split-steps',
      label: '장면 3 · 작은 질문으로 나누기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l6-vn-03.webp',
      alt: '윤아가 시간표, 준비물, 알람 세 장의 그림 카드를 순서대로 놓고 아이미에게 하나씩 묻는 장면',
      knowledgeStep: 1,
      copy: {
        full: { text: '윤아는 시간표, 준비물, 알람으로 나눕니다. 한 가지씩 아이미에게 묻습니다.' },
        light: {
          text: '윤아는 큰 부탁을 세 단계로 나눕니다. 먼저 내일 시간표를 확인하고, 다음에 준비물을 묻고, 마지막에 알람 시간을 정합니다.',
          perspective: '한 번에 한 가지씩 물으면 답을 확인하고 다음 질문으로 갈 수 있습니다.',
        },
        challenge: {
          text: '윤아는 앞 단계의 답을 다음 질문에 사용할 수 있도록 시간표 확인→과목별 준비물→기상 시간 결정의 순서로 요청을 나눕니다.',
          perspective: '단계 사이의 관계를 생각해 순서를 정하면 불필요한 질문을 줄이고 결과를 이어서 사용할 수 있습니다.',
        },
      },
    },
    {
      id: 'pack-bag',
      label: '장면 4 · 하나씩 확인하고 준비하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l6-vn-04.webp',
      alt: '윤아가 세 단계 그림 목록을 보며 가방을 챙기고 알람을 확인하는 장면',
      knowledgeStep: 2,
      copy: {
        full: { text: '윤아는 받은 답을 하나씩 확인합니다. 준비물을 가방에 넣고 알람을 맞춥니다.' },
        light: {
          text: '윤아는 학교 시간표와 아이미의 답을 비교합니다. 확인한 준비물을 가방에 넣고 마지막으로 알람을 맞춥니다.',
          perspective: '작은 단계가 끝날 때마다 결과를 확인하면 빠진 일을 찾기 쉽습니다.',
        },
        challenge: {
          text: '윤아는 각 단계의 답을 학교 시간표와 준비물 안내에 대조합니다. 확인된 정보만 사용해 가방과 알람을 준비하고 전체 과정을 마칩니다.',
          perspective: '단계별 확인은 잘못된 답이 다음 단계까지 이어지는 것을 막는 데 도움이 됩니다.',
        },
      },
    },
  ],
  knowledge: [
    {
      title: '큰 질문은 왜 나눕니까?',
      core: '여러 일이 섞인 질문은 작은 일로 나눌 수 있습니다.',
      detail: {
        full: '할 일을 하나씩 나눕니다.',
        light: '큰 질문을 나누면 무엇부터 할지 알기 쉽습니다.',
        challenge: '서로 다른 결과가 필요한 복잡한 요청은 목적별로 나누어야 조건 누락을 줄일 수 있습니다.',
      },
    },
    {
      title: '어떤 순서로 묻습니까?',
      core: '먼저 필요한 것부터 한 번에 한 가지씩 묻습니다.',
      detail: {
        full: '첫 질문이 끝나면 다음 질문을 합니다.',
        light: '앞의 답이 필요한 일을 먼저 묻고 다음 단계로 갑니다.',
        challenge: '앞 단계의 결과를 다음 단계에 사용할 수 있도록 질문 사이의 관계를 보고 순서를 정합니다.',
      },
      flow: { input: '큰 질문', process: '작은 질문과 순서', output: '단계별 답' },
    },
    {
      title: '각 단계에서 무엇을 확인합니까?',
      core: '한 단계의 답을 확인한 뒤 다음으로 갑니다.',
      detail: {
        full: '답이 맞는지 보고 다음으로 갑니다.',
        light: '빠진 정보나 이상한 답이 없는지 살펴봅니다.',
        challenge: '각 결과를 근거와 비교해 오류가 다음 단계로 이어지지 않도록 확인합니다.',
      },
    },
  ],
};

export const M2_L10_VISUAL_STORY: VisualNovelStory = {
  title: '내일 준비를 아이미와 이야기해 볼까?',
  objective: '배운 방법대로 프롬프트를 만들어 AI와 대화해 보십시오.',
  scenes: [
    {
      id: 'ask-supplies',
      label: '장면 1 · 무엇을 물을지 정하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l10-vn-01.webp',
      alt: '진우가 방과 후 교실에서 아이미에게 다음 날 준비물을 묻는 장면',
      knowledgeStep: 0,
      copy: {
        full: { text: '진우는 내일 준비물을 알아보기 위해 아이미와 대화를 시작합니다.' },
        light: {
          text: '방과 후, 진우는 내일 학교에 가져갈 준비물이 궁금합니다. 진우는 먼저 무엇을 알고 싶은지 생각한 뒤 아이미에게 말을 겁니다.',
          perspective: 'AI와 대화할 때는 내가 알고 싶은 내용을 먼저 정하면 좋습니다.',
        },
        challenge: {
          text: '진우는 내일 수업 준비라는 목적을 정합니다. 이제 아이미가 상황을 이해하도록 필요한 정보와 원하는 답의 모습을 프롬프트에 담아야 합니다.',
          perspective: '좋은 대화는 목적을 정하고 AI에게 필요한 맥락을 알려 주는 것에서 시작합니다.',
        },
      },
    },
    {
      id: 'confident-answer',
      label: '장면 2 · 첫 프롬프트와 답',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l10-vn-02.webp',
      alt: '아이미가 체육복과 미술도구 등 많은 준비물 그림을 보여 주고 진우가 시간표와 달라 이상하게 느끼는 장면',
      knowledgeStep: 0,
      copy: {
        full: { text: '진우가 짧게 묻자 아이미는 준비물을 많이 말합니다.' },
        light: {
          text: '진우가 “내일 준비물을 알려 줘.”라고 묻습니다. 아이미는 체육복, 미술도구, 과학 준비물을 한꺼번에 길게 말합니다.',
          perspective: '프롬프트에 상황과 원하는 답의 모습이 빠지면 너무 넓은 답이 나올 수 있습니다.',
        },
        challenge: {
          text: '첫 프롬프트에는 학교, 학년, 내일 시간표와 같은 맥락과 짧은 목록이라는 출력 조건이 없습니다. 아이미는 가능한 준비물을 넓게 제시합니다.',
          perspective: '첫 답이 원하는 것과 다르면 실패가 아닙니다. 빠진 정보를 찾아 다음 프롬프트를 만들 수 있습니다.',
        },
      },
    },
    {
      id: 'continue-conversation',
      label: '장면 3 · 프롬프트 고쳐 이어 말하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l10-vn-03.webp',
      alt: '진우가 자신의 시간표를 가리키며 필요한 준비물만 다시 알려 달라고 아이미와 대화를 이어 가는 장면',
      knowledgeStep: 1,
      copy: {
        full: { text: '진우는 시간표를 보여 주고 프롬프트를 고쳐 다시 묻습니다.' },
        light: {
          text: '진우는 “나는 중학생이고, 이것은 내일 시간표야. 필요한 준비물만 세 가지로 알려 줘.”라고 다시 말합니다. 이어서 “각 준비물은 어느 수업에 필요해?”라고 묻습니다.',
          perspective: '첫 답을 보고 정보를 더하거나 확인 질문을 하면 AI와 대화를 이어 갈 수 있습니다.',
        },
        challenge: {
          text: '진우는 대상, 자료, 요청 형식을 넣어 프롬프트를 구체화합니다. 새 답에서 아직 모호한 부분은 관련 질문으로 좁히며 한 차례 더 대화합니다.',
          perspective: 'AI와 함께 생각한다는 것은 한 번에 완벽하게 묻는 것이 아니라 답을 읽고 다음 질문을 조정하는 과정입니다.',
        },
      },
    },
    {
      id: 'verify-schedule',
      label: '장면 4 · 대화 결과 확인해 사용하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m2-l10-vn-04.webp',
      alt: '진우와 선생님이 교실의 다음 날 시간표와 준비물 안내를 확인하며 필요한 물건만 고르는 장면',
      knowledgeStep: 2,
      copy: {
        full: { text: '진우는 AI와 나눈 대화를 선생님과 확인하고 필요한 준비물을 챙깁니다.' },
        light: {
          text: '진우는 아이미와 나눈 대화 결과를 내일 시간표와 선생님의 안내로 확인합니다. 맞는 준비물만 골라 가방에 넣습니다.',
          perspective: 'AI와 대화해 얻은 답은 실제 자료나 사람과 확인한 뒤 사용합니다.',
        },
        challenge: {
          text: '진우는 대화에서 얻은 준비물 목록과 이유를 공식 시간표에 대조합니다. 확인된 정보만 행동으로 옮기고, 맞지 않는 항목은 제외합니다.',
          perspective: '프롬프트 만들기, 이어 말하기, 확인하기까지 거치면 AI 답을 책임 있게 활용할 수 있습니다.',
        },
      },
    },
  ],
  knowledge: [
    {
      title: '프롬프트는 어떻게 만듭니까?',
      core: '하고 싶은 일, 필요한 정보, 원하는 답의 모습을 담습니다.',
      detail: {
        full: '무엇을 원하는지 말합니다.',
        light: '무엇을 알고 싶은지와 필요한 상황을 함께 말합니다.',
        challenge: '목적, 대상, 맥락, 출력 조건을 학생에게 필요한 만큼 선택하여 프롬프트를 구성합니다.',
      },
    },
    {
      title: '어떻게 대화를 이어 갑니까?',
      core: '첫 답을 보고 정보를 더하거나 관련 질문을 합니다.',
      detail: {
        full: '빠진 내용을 다시 말합니다.',
        light: '답이 너무 넓으면 조건을 더하고 궁금한 내용을 이어서 묻습니다.',
        challenge: '첫 답을 평가한 뒤 맥락을 보완하거나 이유와 근거를 묻는 후속 프롬프트로 대화를 발전시킵니다.',
      },
      flow: { input: '첫 프롬프트', process: '답을 보고 이어 묻기', output: '더 알맞은 답' },
    },
    {
      title: '대화 결과는 어떻게 씁니까?',
      core: 'AI 답을 자료나 사람과 확인한 뒤 필요한 행동에 사용합니다.',
      detail: {
        full: '답을 확인하고 사용합니다.',
        light: '시간표, 안내문, 선생님의 설명과 비교한 뒤 사용합니다.',
        challenge: '대화 결과를 신뢰할 수 있는 정보와 대조하고, 확인된 내용만 실제 선택과 행동에 반영합니다.',
      },
    },
  ],
};
