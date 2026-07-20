import type { StudioDefinition } from '../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES } from './shared';
import { M1_L10_VISUAL_STORY, M1_L4_VISUAL_STORY } from './visualStories/m1';

export const M1_STUDIOS: StudioDefinition[] = [
  {
    id: 'm1-daily-ai-finder',
    lessonId: 'm1-l1',
    moduleId: 'm1',
    title: 'AI 친구 아이미와의 첫 만남',
    subtitle: 'AI가 무엇인지 알고, AI가 쉽게 답변하도록 요청할 수 있습니다.',
    visualNovel: {
      title: '아이미와의 첫 만남',
      objective: 'AI가 무엇인지 알고, AI가 쉽게 답변하도록 요청할 수 있습니다.',
      scenes: [
        {
          id: 'arrive',
          label: '장면 1 · 처음 등교한 날',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-01.webp',
          alt: '처음 학교에 등교한 진우가 AI 아이미를 만나 인사를 나누는 장면',
          knowledgeStep: 0,
          copy: {
            full: {
              text: '진우는 학교에 처음 왔습니다. 그때 로봇 친구 아이미가 나타나 반갑게 인사했습니다. “안녕! 나는 오늘부터 너의 학교 생활을 도와줄 인공지능 아이미야.”',
            },
            light: {
              text: '진우는 설레는 마음으로 학교에 처음 등교했습니다. 교실에 들어서자 반가운 목소리가 진우를 환영했습니다. “안녕, 진우야! 나는 오늘부터 너의 즐거운 학교 생활을 친절하게 도와줄 인공지능 아이미야. 만나서 반가워.”',
              perspective: '새로운 학교와 교실에 처음 오면 긴장되거나 낯설 수 있습니다.',
            },
            challenge: {
              text: '진우가 긴장과 설렘을 안고 학교에 처음 등교한 날이었습니다. 교실을 둘러보던 진우 앞에 분홍색의 예쁜 로봇 친구가 나타나서 반갑게 인사했습니다. “안녕! 나는 오늘부터 너의 학교 생활 전반을 안내하고 도와줄 인공지능 아이미라고 해.”',
              perspective: '학교 생활을 돕는 인공지능 아이미는 앞으로 진우의 든든한 학교 생활 안내자가 되어 줄 것입니다.',
            },
          },
        },
        {
          id: 'ask-aimi',
          label: '장면 2 · 아이미에게 질문하기',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-02.webp',
          alt: '진우가 인공지능 아이미에게 인공지능이 무슨 뜻인지 묻는 장면',
          knowledgeStep: 1,
          copy: {
            full: {
              text: '진우는 아이미가 말한 단어가 궁금했습니다. 그래서 머리를 갸우뚱하며 물었습니다. “인공지능이 무슨 뜻이지?”',
            },
            light: {
              text: '진우는 아이미가 자신을 ‘인공지능’이라고 소개한 것이 궁금해졌습니다. 호기심 어린 눈빛으로 아이미에게 질문했습니다. “아이미야, 인공지능이 무슨 뜻이야?”',
              perspective: '처음 듣거나 낯선 단어가 나오면 무엇인지 물어보는 태도가 중요합니다.',
            },
            challenge: {
              text: '진우는 자신을 ‘인공지능’이라 소개하는 아이미를 보며 의문을 가졌습니다. 새로운 기술에 대한 호기심을 품고 질문을 던집니다. “아이미야, 그런데 네가 말한 인공지능은 정확히 무슨 뜻이니?”',
              perspective: '단어의 정확한 뜻을 알고 사용하는 것은 디지털 도구를 다루는 첫걸음입니다.',
            },
          },
        },
        {
          id: 'compare-information',
          label: '장면 3 · 어려운 설명',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-03.webp',
          alt: '인공지능 아이미가 복잡하고 어려운 기계 용어로 인공지능에 대해 답하자 진우가 곤란해하는 장면',
          knowledgeStep: 1,
          copy: {
            full: {
              text: '아이미가 어려운 영어와 컴퓨터 과학 단어로 길게 설명했습니다. “인공지능은 artificial intelligence로 인간의 지능을 모방하여 최적의 의사결정을 내리는 수학적 시스템...” 진우는 무슨 뜻인지 이해하기 너무 어려웠습니다.',
            },
            light: {
              text: '아이미가 어려운 용어들로 대답해 줍니다. “인공지능은 artificial intelligence로 인간의 지능을 모방한 프로그램입니다. 데이터를 기반으로 최적의 의사결정을 내리는 수학적·컴퓨터과학적 시스템으로...” 진우는 너무 어렵고 복잡한 말들이라 이해하기 힘들었습니다.',
              perspective: '인공지능이 너무 전문적이고 어려운 용어로만 답해주면 이해하기 어려울 수 있습니다.',
            },
            challenge: {
              text: '아이미가 기계적인 전문 용어를 쏟아내며 답변하기 시작했습니다. “인공지능은 artificial intelligence로서 인간의 인지 능력을 모방한 소프트웨어 프로그램입니다. 대용량 데이터를 기반으로 알고리즘 연산을 거쳐 최적의 의사결정을 내리는 수학적이고 컴퓨터과학적 시스템으로...” 진우는 도무지 이해할 수 없어 당황했습니다.',
              perspective: '인공지능은 때로 복잡한 정보를 그대로 출력하기 때문에, 사용자의 수준에 맞는 쉬운 설명이 필요합니다.',
            },
          },
        },
        {
          id: 'confirm-today',
          label: '장면 4 · 선생님의 도움',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-04.webp',
          alt: '선생님이 진우에게 친절하고 쉬운 말로 인공지능의 뜻을 설명해주시는 장면',
          knowledgeStep: 1,
          copy: {
            full: {
              text: '박민준 선생님이 다가와 진우에게 친절하고 쉽게 말씀해 주셨습니다. “인공지능은 컴퓨터가 사람처럼 생각하고, 배우고, 문제를 해결하도록 만든 기술이란다.” 진우는 고개를 끄덕이며 이제야 이해했습니다.',
            },
            light: {
              text: '진우의 곤란한 표정을 본 박민준 선생님이 다가와 쉬운 말로 설명해 주셨습니다. “인공지능은 컴퓨터가 사람처럼 스스로 생각하고, 공부하고, 어려운 문제를 해결할 수 있게 만든 기술이란다.” 진우는 그제야 활짝 웃으며 고개를 끄덕였습니다.',
              perspective: '이해하기 어려울 때는 선생님이나 부모님께 도움을 받아 쉬운 설명으로 배울 수 있습니다.',
            },
            challenge: {
              text: '진우의 찌푸려진 표정을 눈치챈 박민준 선생님이 다가와 눈높이에 맞게 차근차근 다듬어 주셨습니다. “인공지능은 컴퓨터 프로그램이 사람처럼 스스로 정보를 공부하고 생각해서, 여러 문제를 해결할 수 있게 돕는 기술이란다.” 진우는 그제야 고개를 끄덕이며 의미를 확실하게 깨달았습니다.',
              perspective: '사용자 눈높이에 맞는 설명은 인공지능이 가진 복잡함을 걷어내고 유용한 도구로 다가가게 해 줍니다.',
            },
          },
        },
      ],
      knowledge: [
        {
          title: 'AI(에이아이)는 무엇입니까?',
          core: 'AI(에이아이)는 컴퓨터가 사람처럼 생각하고, 배우고, 문제를 해결하는 기술입니다. 우리나라 말로 인공지능이라고도 부릅니다.',
          detail: {
            full: '',
            light: '',
            challenge: '',
          },
        },
        {
          title: 'AI가 생각하는 방법',
          core: 'AI는 공부한 말과 글을 바탕으로, 단어들을 알맞게 연결하여 답을 만듭니다.',
          detail: {
            full: 'AI는 아주 많은 글을 읽고 배웠습니다. 앞 단어 뒤에 올 가장 잘 어울리는 단어를 이어서 말해 줍니다.',
            light: 'AI는 사람들의 말과 글을 많이 공부하였습니다. 그래서 앞의 단어를 보고 그 뒤에 나올 단어 중 가장 그럴듯한 단어를 찾아서 연결합니다.',
            challenge: 'AI는 사람들이 쓴 방대한 말과 글을 미리 학습하였습니다. 질문으로 입력된 앞 단어들을 분석하여, 그 뒤에 이어질 확률이 가장 높고 자연스러운 단어들을 차례대로 찾아 연결해 나갑니다.',
          },
          flow: {
            input: '질문 단어',
            process: '어울리는 단어 찾기',
            output: '연결된 답변',
          },
        },
        {
          title: 'AI를 공부하는 이유',
          core: '우리가 배운 인공지능 기술이 어떤 일들을 잘하는지 이해하고 올바르게 활용하기 위해서입니다.',
          detail: {
            full: '인공지능의 특징과 장점, 한계를 알고 알맞은 상황에 사용하기 위해 배웁니다.',
            light: 'AI가 잘하는 일과 못하는 일을 명확히 이해하고 실생활의 문제를 스스로 해결하는 능력을 키우기 위해 배웁니다.',
            challenge: '다양한 인공지능 도구들의 아키텍처 한계와 기능을 명확히 인지하고, 실무 상황에 맞춰 최선의 도구를 선별 활용하기 위해 공부합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '아이미와의 첫 만남',
      description: '처음 등교한 진우가 AI 아이미에게 인공지능이 무슨 뜻인지 묻고 어려운 설명을 듣자, 선생님이 쉬운 말로 다시 설명해 주십니다.',
      facts: [
        '진우는 학교에 처음 등교하여 인공지능 아이미를 만났습니다.',
        '진우가 인공지능의 뜻을 물어보자, 아이미는 매우 어렵고 복잡한 영어와 기계적인 단어로 설명했습니다.',
        '진우는 대답을 이해하기 어려워 곤란해했습니다.',
        '선생님이 오셔서 컴퓨터가 사람처럼 생각하고, 배우고, 문제를 해결하는 기술이라고 쉽게 설명해 주셨습니다.',
      ],
    },
    firstAttempt: {
      prompt: '다른 날, 진우가 아이미에게 “토스터는 뭐하는 물건이야?”라고 묻자 아이미는 “토스터는 전기 저항 필라멘트의 열에너지를 이용하여 식빵의 표면에 마이야르 반응 및 탄화 과정을 진행시키는 열전달 가열 기구입니다.”라고 매우 어렵게 답합니다. 진우는 토스터가 빵을 구워 주는 기계라는 쉬운 뜻을 알고 싶었습니다. 먼저 어떻게 하겠습니까?',
      choices: [
        { id: 'ask-clearly', emoji: '💬', label: '“어려운 말 말고, 토스터가 무슨 기계인지 쉽게 말해 줘.”라고 다시 물어봅니다.' },
        { id: 'ask-person', emoji: '🙋', label: '선생님에게 다가가 토스터가 무슨 기계인지 쉬운 말로 여쭤봅니다.' },
        { id: 'guess-from-answer', emoji: '🤖', label: '이해하기 어려운 복잡한 답만 계속 읽어보며 뜻을 짐작합니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: 'AI의 답변이 어려울 때 누구에게 어떻게 도움을 구할지 적어 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '진우는 아이미에게 토스터에 대해 물어보았습니다.',
      facts: [
        '아이미의 대답에는 사용하기 어려운 복잡하고 딱딱한 과학 단어들이 많았습니다.',
        '진우가 알고 싶었던 것은 토스터가 하는 일이었습니다.',
        'AI가 이해하기 어려운 말을 할 때는 쉬운 대답을 다시 요구할 수 있습니다.',
        '이해하기 어려운 중요한 정보는 주변 사람에게 다시 물어보는 것이 좋습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미에게',
      text: '토스터는 뭐하는 거야? 쉽게 말해줘.',
      question: '진우가 어떻게 물어봐야 아이미가 쉽게 대답해 줄까요?',
    },
    artifact: {
      kind: 'action-card',
      title: '나만의 질문 만들기',
      prompt: '내가 알고 싶은 내용과 알맞은 질문 단어를 써서 나만의 멋진 질문 카드를 완성해 보세요.',
    },
    transfer: {
      title: '인공지능은 무엇일까요?',
      description: '인공지능(AI)은 컴퓨터 프로그램이 사람처럼 스스로 정보를 공부하고 생각해서, 여러 문제를 해결할 수 있게 돕는 기술입니다.',
      choices: [
        { id: 'ai-definition-correct', emoji: '🤖', label: '사람처럼 배우고 대답해 주는 똑똑한 컴퓨터 프로그램' },
        { id: 'ai-definition-toaster', emoji: '🍞', label: '식빵을 맛있게 구워 주는 토스터 기계' },
        { id: 'ai-definition-aircon', emoji: '❄️', label: '바람을 불어 시원하게 해 주는 에어컨 기계' },
      ],
    },
  },
  {
    id: 'm1-eyes-ears-lab',
    lessonId: 'm1-l4',
    moduleId: 'm1',
    title: 'AI의 눈과 귀 실험실',
    subtitle: 'AI가 알아본 결과와 실제 장면을 다시 비교합니다',
    visualNovel: M1_L4_VISUAL_STORY,
    encounter: {
      title: '그림과 안내 문장을 알아본 AI',
      description: 'AI가 그림을 고양이라고 보고, 안내 문장을 도서관으로 갑니다라고 들었다고 합니다. 실제 자료와 같겠습니까?',
      facts: [
        '교과서에 준비된 그림을 살펴봅니다.',
        '소리 버튼은 내가 누를 때만 재생됩니다.',
        'AI가 말한 결과도 함께 확인합니다.',
      ],
      stimuli: [
        {
          id: 'cat-card',
          kind: 'image',
          src: '/AITEXTBOOKforSTUDENTS/lessons/pecs/cat.webp',
          alt: '고양이 그림 카드',
          caption: '귀와 꼬리가 있는 고양이 그림입니다.',
        },
        {
          id: 'library-speech',
          kind: 'speech',
          text: '도서관으로 갑니다',
          label: '깨끗한 안내 문장',
        },
      ],
    },
    firstAttempt: {
      prompt: 'AI가 그림과 소리를 맞게 알아봤는지 어떻게 확인하겠습니까?',
      choices: [
        { id: 'trust-ai', emoji: '🤖', label: 'AI가 말한 것만 믿습니다.' },
        { id: 'check-source', emoji: '👀', label: '실제 그림이나 소리를 다시 확인합니다.' },
        { id: 'change-condition', emoji: '💡', label: '보이는 조건과 들리는 조건을 바꾸어 살펴봅니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '무엇을 다시 보고 듣고 싶은지 표현해 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: 'AI가 알아보기 어려운 조건이 새로 생겼습니다.',
      facts: [
        '그림의 일부가 가려졌습니다.',
        '모양이 비슷한 다른 동물이 옆에 있습니다.',
        '안내 문장 주변에 큰 소음이 있습니다.',
        'AI는 확실하지 않은데도 하나의 답을 말할 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '다시 확인을 권하는 AI',
      text: '그림을 더 잘 보이게 하고 소음이 적은 곳에서 다시 들은 뒤, 사람의 눈과 귀로도 결과를 비교해 주십시오.',
      question: 'AI가 헷갈렸을 가능성을 알려 주는 조건은 무엇입니까?',
    },
    artifact: {
      kind: 'visual-plan',
      title: 'AI 인식 실험 기록',
      prompt: '입력 조건, AI가 말한 것, 내가 확인한 것을 세 칸으로 나누어 적어 보십시오.',
    },
    transfer: {
      title: '흐린 표지판과 잘 안 들리는 안내라면',
      description: '길에서 표지판이 흐리고 안내 방송도 잘 들리지 않습니다. 무엇을 확인하겠습니까?',
      choices: [
        { id: 'follow-once', emoji: '➡️', label: 'AI가 처음 말한 방향으로 바로 갑니다.' },
        { id: 'check-again', emoji: '🔁', label: '표지판과 안내를 다시 확인합니다.' },
        { id: 'ask-person', emoji: '🙋', label: '안전한 곳에서 담당자에게 물어봅니다.' },
      ],
    },
    safetyNote: '교과서에 준비된 그림과 문장만 사용합니다. 얼굴 사진이나 내 목소리를 보내지 않습니다.',
  },
  {
    id: 'm1-ability-test',
    lessonId: 'm1-l10',
    moduleId: 'm1',
    title: 'AI 능력 시험소',
    subtitle: 'AI에게 맡길 일과 사람이 확인할 일을 나누습니다',
    visualNovel: M1_L10_VISUAL_STORY,
    encounter: {
      title: 'AI에게 어떤 일을 맡길까습니다',
      description: '번역, 영상 추천, 친구의 마음 알아맞히기, 약 복용 판단처럼 서로 다른 일이 있습니다.',
      facts: [
        'AI는 많은 문장을 빠르게 번역할 수 있습니다.',
        'AI 추천은 내가 원하는 것과 다를 수 있습니다.',
        'AI는 사람의 진짜 마음을 직접 느끼지 못합니다.',
      ],
    },
    firstAttempt: {
      prompt: 'AI에게 맡길 일은 어떻게 정하겠습니까?',
      choices: [
        { id: 'delegate-all', emoji: '🤖', label: '빠른 AI에게 모든 일을 맡겨습니다.' },
        { id: 'use-and-check', emoji: '✅', label: 'AI 답을 확인하고 사용할 일을 골라습니다.' },
        { id: 'ask-human', emoji: '🙋', label: '마음과 안전에 관한 일은 사람에게 부탁합니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: 'AI에게 맡겨도 되는 일과 어려운 일을 표현해 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: 'AI가 빠르게 답했지만 더 살펴볼 조건이 생겼습니다.',
      facts: [
        'AI가 답의 근거를 보여 주지 않았습니다.',
        '더 자세한 답을 위해 개인정보를 요구합니다.',
        '선택에 따라 실제 건강과 안전이 달라질 수 있습니다.',
        'AI 답과 전문가의 안내가 서로 다릅니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: 'AI의 한계를 말하는 AI',
      text: '제가 빠르게 정리하는 일은 도울 수 있지만, 마음과 건강과 안전에 관한 결정은 믿을 수 있는 사람과 함께 확인해야 합니다.',
      question: '이 일은 틀렸을 때 어떤 문제가 생길 수 있습니까?',
    },
    artifact: {
      kind: 'action-card',
      title: 'AI 사용 판단 설명서',
      prompt: 'AI에게 맡기기, 확인하고 쓰기, 사람에게 부탁하기 세 칸으로 나누어 정리해 보십시오.',
    },
    transfer: {
      title: '처음 보는 AI 기능을 만난다면',
      description: '새 앱이 공부 계획과 건강 조언을 모두 해 준다고 광고합니다. 어떻게 사용하겠습니까?',
      choices: [
        { id: 'try-everything', emoji: '🚀', label: '광고를 믿고 모든 기능을 바로 사용합니다.' },
        { id: 'test-and-check', emoji: '🧪', label: '위험이 적은 기능부터 시험하고 결과를 확인합니다.' },
        { id: 'human-for-safety', emoji: '🩺', label: '건강과 안전 조언은 믿을 수 있는 사람과 확인합니다.' },
      ],
    },
  },
];
