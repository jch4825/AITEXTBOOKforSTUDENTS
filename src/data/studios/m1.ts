import type { StudioDefinition } from '../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES } from './shared';

export const M1_STUDIOS: StudioDefinition[] = [
  {
    id: 'm1-daily-ai-finder',
    lessonId: 'm1-l1',
    moduleId: 'm1',
    title: 'AI 친구 아이미에게 내 자리를 물어봅니다',
    subtitle: 'AI가 무엇인지 알고, 알맞게 질문하고 답을 확인하는 방법을 배웁니다',
    visualNovel: {
      title: '내 자리가 어디일까?',
      objective: 'AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.',
      scenes: [
        {
          id: 'arrive',
          label: '장면 1 · 처음 등교한 날',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-01.webp',
          alt: '처음 학교에 등교한 진우가 교실에서 자신의 자리를 찾다가 AI 아이미를 만나는 장면',
          knowledgeStep: 0,
          copy: {
            full: {
              speaker: '이야기와 아이미',
              text: '오늘은 진우가 학교에 처음 가는 날입니다. 진우는 자기 자리를 찾습니다. 그때 아이미가 인사합니다. “안녕! 나는 AI(에이아이) 아이미라고 해.”',
            },
            light: {
              speaker: '이야기와 아이미',
              text: '오늘은 진우가 처음으로 학교에 등교하는 날입니다. 진우는 처음 온 교실에서 자기 자리를 찾고 있습니다. 그때 인공지능인 아이미가 인사합니다. “안녕! 나는 너를 도와줄 AI(에이아이) 아이미라고 해. 뭔가 궁금하거나 불편한 것이 있니?”',
              perspective: '처음 온 학교에서는 교실과 자기 자리를 모를 수 있습니다.',
            },
            challenge: {
              speaker: '이야기와 아이미',
              text: '처음 등교한 진우는 교실에서 자기 자리를 찾지 못해 두리번거립니다. 그때 인공지능 아이미가 자신을 진우를 도와줄 AI라고 소개하며 필요한 도움이 있는지 묻습니다.',
              perspective: 'AI는 사람이 만든 컴퓨터 기술이며, 아이미는 그 기술을 사용해 사람의 질문에 답합니다.',
            },
          },
        },
        {
          id: 'ask-aimi',
          label: '장면 2 · 아이미에게 자리 묻기',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-02.webp',
          alt: '진우가 AI 아이미에게 자신의 자리를 묻고 아이미가 창가 쪽 자리를 추천하는 장면',
          knowledgeStep: 1,
          copy: {
            full: {
              speaker: '진우와 아이미',
              text: '진우는 아이미에게 묻습니다. “내 자리는 어디일까?” 아이미는 “창가 쪽 자리가 좋겠어.”라고 대답합니다.',
            },
            light: {
              speaker: '진우와 아이미',
              text: '진우는 아이미에게 자리를 물어봅니다. “안녕, 아이미. 반가워. 나 처음이라 그러는데, 내 자리는 어디일까?” 아이미는 대답합니다. “창가 쪽 자리가 좋겠어.”',
              perspective: '진우는 자기 자리를 물었지만, 아이미는 진우에게 좋은 자리를 추천했습니다.',
            },
            challenge: {
              speaker: '진우와 아이미',
              text: '진우는 “내 자리는 어디일까?”라고 묻습니다. 이 질문에는 진우의 이름이나 반, 자리표를 확인해 달라는 말이 없습니다. 아이미는 “창가 쪽 자리가 좋겠어.”라고 자리를 추천합니다.',
              perspective: 'AI는 질문에 들어 있는 말을 바탕으로 답하므로, 질문이 모호하면 원하는 것과 다른 답을 만들 수 있습니다.',
            },
          },
        },
        {
          id: 'compare-information',
          label: '장면 3 · 이상한 점 발견하기',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-03.webp',
          alt: '진우가 아이미가 추천한 창가 쪽 자리에 앉았다가 자기 자리가 아닌 것 같다고 느끼는 장면',
          knowledgeStep: 2,
          copy: {
            full: {
              speaker: '진우',
              text: '진우는 창가 쪽 자리에 앉습니다. 그런데 자기 자리가 아닌 것 같습니다. “내 자리가 아닌 것 같은데?”',
            },
            light: {
              speaker: '이야기와 진우',
              text: '진우는 아이미의 추천을 듣고 창가 쪽 자리에 가서 앉았습니다. 그런데 조금 이상합니다. “내 자리가 아닌 것 같은데?”',
              perspective: 'AI의 답이 이상하거나 상황과 다르면 다른 사람에게 다시 확인할 수 있습니다.',
            },
            challenge: {
              speaker: '진우',
              text: '아이미의 답은 진우의 실제 자리를 알려 준 답이 아니라 좋은 자리를 추천한 답입니다. 진우는 창가 쪽에 앉은 뒤 자기 자리가 아닐 수 있다는 점을 알아차립니다.',
              perspective: '원한 답과 실제로 받은 답이 같은지 살펴보고, 중요한 정보는 사람이나 공식 자료로 다시 확인할 수 있습니다.',
            },
          },
        },
        {
          id: 'confirm-today',
          label: '장면 4 · 선생님에게 확인하기',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-04.webp',
          alt: '진우가 선생님에게 자신의 자리를 확인하고 AI에게 질문하는 방법을 배우는 장면',
          knowledgeStep: 2,
          copy: {
            full: {
              speaker: '민준 선생님',
              text: '진우는 선생님에게 묻습니다. 선생님은 복도 쪽이 진우의 자리라고 알려 줍니다. “AI도 잘못 대답할 수 있어. 바르게 물어보고 다시 확인해야 해.”',
            },
            light: {
              speaker: '민준 선생님',
              text: '진우는 선생님에게 묻습니다. 선생님은 대답합니다. “맞아. 네 자리는 복도 쪽에 있어. 그 자리가 아니야. 아이미가 잘못 대답한 거야. 인공지능 아이미는 잘 대답해 준단다. 그런데 바르게 물어봐야 바른 대답을 해 주지. 아이미를 잘 사용하려면 사용법을 알고 있어야 해.”',
              perspective: 'AI에게 원하는 것을 분명하게 물어보고, 중요한 답은 사람에게 다시 확인할 수 있습니다.',
            },
            challenge: {
              speaker: '민준 선생님',
              text: '선생님은 진우의 자리가 복도 쪽이라고 알려 줍니다. 아이미는 질문의 뜻을 정확히 알지 못해 실제 자리 대신 좋은 자리를 추천했습니다. 선생님은 AI에게 원하는 것과 필요한 정보를 분명하게 말해야 한다고 설명합니다.',
              perspective: 'AI의 답은 언제나 맞는 것이 아니므로, 질문을 구체적으로 하고 중요한 답은 사람이나 공식 정보로 확인합니다.',
            },
          },
        },
      ],
      knowledge: [
        {
          title: 'AI는 무엇입니까?',
          core: 'AI는 사람이 만든 컴퓨터 기술입니다.',
          detail: {
            full: 'AI는 로봇의 이름이 아니라 컴퓨터 기술입니다.',
            light: 'AI는 글·말·사진 같은 자료를 이용하는 컴퓨터 기술입니다.',
            challenge: '로봇의 겉모습과 AI 기능은 같지 않습니다. AI는 기계 안에서 자료를 처리하는 기술입니다.',
          },
        },
        {
          title: 'AI에게 어떻게 물어봅니까?',
          core: 'AI는 질문에 들어 있는 말을 보고 답을 만듭니다.',
          detail: {
            full: '알고 싶은 것을 분명하게 말합니다.',
            light: '이름, 반, 알고 싶은 것을 넣어 분명하게 물어봅니다.',
            challenge: '질문의 목적과 필요한 정보를 분명하게 말하면 AI가 원하는 답을 만들기 쉬워집니다.',
          },
          flow: {
            input: '궁금한 것',
            process: '분명한 질문',
            output: 'AI의 답',
          },
        },
        {
          title: 'AI의 답은 언제나 맞습니까?',
          core: 'AI도 틀릴 수 있으므로 사람이 다시 확인합니다.',
          detail: {
            full: '답이 이상하면 사람에게 물어봅니다.',
            light: 'AI의 답이 상황과 다르면 선생님이나 공식 정보로 다시 확인합니다.',
            challenge: '질문이 모호하거나 정보가 부족하면 AI의 답이 원하는 것과 다를 수 있으므로 다른 근거와 비교합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '진우의 첫 등교',
      description: '처음 등교한 진우가 AI 아이미에게 자기 자리를 묻고 선생님에게 다시 확인합니다.',
      facts: [
        '처음 온 학교에서는 자기 자리를 모를 수 있습니다.',
        '진우는 아이미에게 자기 자리를 물었지만 필요한 정보를 자세히 말하지 않았습니다.',
        '아이미는 진우의 실제 자리 대신 창가 쪽 자리를 추천했습니다.',
        '진우는 답이 이상하다는 것을 알고 선생님에게 다시 확인했습니다.',
      ],
    },
    firstAttempt: {
      prompt: '다른 날, 진우가 아이미에게 “오늘 도서관은 어때?”라고 묻자 아이미는 “조용하고 좋습니다.”라고 답합니다. 진우가 알고 싶은 것은 문을 닫는 시간입니다. 먼저 무엇을 해 보겠습니까?',
      choices: [
        { id: 'ask-clearly', emoji: '💬', label: '“오늘 도서관은 몇 시에 문을 닫습니까?”라고 다시 묻습니다.' },
        { id: 'ask-person', emoji: '🙋', label: '도서관 담당자에게 오늘 시간을 확인합니다.' },
        { id: 'guess-from-answer', emoji: '🤖', label: '처음 받은 답만 듣고 문 닫는 시간을 짐작합니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '질문에 어떤 정보를 더 넣을지 표현해 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '진우가 알고 싶은 것과 AI가 이해한 질문의 뜻이 서로 다릅니다.',
      facts: [
        '“오늘 도서관은 어때?”에는 문을 닫는 시간을 묻는 말이 없습니다.',
        '아이미는 도서관의 분위기를 묻는 질문으로 이해했습니다.',
        '진우가 알고 싶은 것은 오늘 도서관이 문을 닫는 시간입니다.',
        '알고 싶은 것과 필요한 정보를 넣어 다시 물어볼 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 확인 질문',
      text: '진우가 알고 싶은 것은 도서관의 분위기입니까, 오늘 문을 닫는 시간입니까? 원하는 정보를 분명하게 말해 주면 다시 답하겠습니다.',
      question: '진우는 날짜와 궁금한 정보를 어떻게 넣어 다시 물어볼 수 있습니까?',
    },
    artifact: {
      kind: 'action-card',
      title: 'AI 질문 확인 카드',
      prompt: '내가 알고 싶은 것, 질문에 넣을 정보, 답을 다시 확인할 사람이나 자료를 한 장에 정리해 보십시오.',
    },
    transfer: {
      title: '버스 도착 시간을 물어본다면',
      description: 'AI에게 “버스 언제 와?”라고 물었더니 가까운 다른 정류장의 시간을 알려 줍니다. 어떤 방법으로 다시 물어보겠습니까?',
      choices: [
        { id: 'add-bus-details', emoji: '🚌', label: '버스 번호·정류장 이름·가는 방향을 넣어 다시 묻습니다.' },
        { id: 'check-live-info', emoji: '👀', label: '정류장 안내판이나 교통 앱에서 현재 정보를 확인합니다.' },
        { id: 'trust-first-time', emoji: '⏰', label: '처음 받은 시간만 믿고 기다립니다.' },
      ],
    },
  },
  {
    id: 'm1-eyes-ears-lab',
    lessonId: 'm1-l4',
    moduleId: 'm1',
    title: 'AI의 눈과 귀 실험실',
    subtitle: 'AI가 알아본 결과와 실제 장면을 다시 비교합니다',
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
