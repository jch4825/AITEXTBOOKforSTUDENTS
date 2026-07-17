import type { StudioDefinition } from '../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES } from './shared';

export const M1_STUDIOS: StudioDefinition[] = [
  {
    id: 'm1-daily-ai-finder',
    lessonId: 'm1-l1',
    moduleId: 'm1',
    title: '처음 온 교실에서 AI의 도움을 받습니다',
    subtitle: 'AI가 자료로 답을 만드는 과정과 다시 확인하는 방법을 배웁니다',
    visualNovel: {
      title: '처음 온 교실에서 자리를 찾습니다',
      objective: 'AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.',
      scenes: [
        {
          id: 'arrive',
          label: '장면 1 · 처음 온 교실',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-01.webp',
          alt: '진우가 처음 온 AI 동아리 교실에서 자신의 자리를 찾는 장면',
          knowledgeStep: 0,
          copy: {
            full: {
              speaker: '이야기',
              text: '진우는 처음 온 교실에서 자리를 찾습니다.',
            },
            light: {
              speaker: '이야기',
              text: '진우는 오늘 AI 동아리에 처음 왔습니다. 자리가 여러 개라서 어디에 앉아야 할지 모르겠습니다.',
              perspective: '처음 온 곳에서 자리를 모를 수 있습니다.',
            },
            challenge: {
              speaker: '진우',
              text: '책상마다 다른 표시가 있습니다. 어느 정보가 오늘 자리표인지 먼저 확인해야 합니다.',
              perspective: '비슷한 표시가 여러 개이면 기준과 날짜를 함께 살펴볼 수 있습니다.',
            },
          },
        },
        {
          id: 'ask-aimi',
          label: '장면 2 · 아이미에게 묻기',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-02.webp',
          alt: '진우가 아이미에게 자신의 자리를 묻고 아이미가 자리표 자료를 확인하는 장면',
          knowledgeStep: 1,
          copy: {
            full: {
              speaker: '진우와 아이미',
              text: '진우는 아이미에게 자리를 묻습니다. 아이미는 창가 쪽이라고 말합니다.',
            },
            light: {
              speaker: '진우와 아이미',
              text: '진우가 묻습니다. “아이미, 제 자리는 어디입니까?” 아이미는 저장된 자리표를 보고 창가 쪽이라고 안내합니다.',
            },
            challenge: {
              speaker: '진우와 아이미',
              text: '아이미는 진우의 말과 저장된 자리표를 이용해 창가 쪽이라는 답을 만듭니다.',
              perspective: 'AI의 답을 이해하려면 어떤 말과 자료가 들어갔는지 살펴볼 수 있습니다.',
            },
          },
        },
        {
          id: 'compare-information',
          label: '장면 3 · 다른 정보를 발견하기',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-03.webp',
          alt: '진우가 창가 책상의 표시와 아이미의 안내가 다르다는 것을 발견하고 비교하는 장면',
          knowledgeStep: 2,
          copy: {
            full: {
              speaker: '이야기',
              text: '아이미의 답과 오늘 책상 표시가 다릅니다.',
            },
            light: {
              speaker: '이야기',
              text: '진우가 창가로 가 보니 책상 표시가 다릅니다.',
              perspective: '정보가 다르면 바로 앉지 않고 다시 확인할 수 있습니다.',
            },
            challenge: {
              speaker: '진우',
              text: '아이미가 본 것은 어제 자리표이고 책상에는 오늘 표시가 있습니다.',
              perspective: '날짜와 현재 상황이 다르면 최신 정보를 기준으로 다시 판단할 수 있습니다.',
            },
          },
        },
        {
          id: 'confirm-today',
          label: '장면 4 · 오늘 정보를 확인하기',
          imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-04.webp',
          alt: '진우와 민준 선생님과 아이미가 오늘 자리표를 함께 확인하는 장면',
          knowledgeStep: 2,
          copy: {
            full: {
              speaker: '이야기',
              text: '진우는 선생님과 오늘 자리를 확인합니다.',
            },
            light: {
              speaker: '민준 선생님',
              text: '“오늘은 자리가 바뀌었습니다. 새 자리표를 함께 봅시다.” 진우는 알맞은 자리에 앉습니다.',
            },
            challenge: {
              speaker: '이야기',
              text: '진우는 오늘 자리표와 선생님의 안내를 비교해 현재 자리를 확인합니다.',
              perspective: 'AI의 도움을 사용하더라도 중요한 내용은 최신 정보나 사람에게 다시 확인할 수 있습니다.',
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
          title: 'AI는 어떻게 일합니까?',
          core: 'AI는 자료를 보고 답이나 추천을 만듭니다.',
          detail: {
            full: '진우의 말과 자리표를 보고 자리를 안내합니다.',
            light: '진우의 말과 저장된 자리표가 AI에 들어가 자리 안내가 나옵니다.',
            challenge: 'AI의 결과는 입력과 저장된 자료에 따라 달라집니다.',
          },
          flow: {
            input: '말·자리표',
            process: 'AI',
            output: '자리 안내',
          },
        },
        {
          title: 'AI의 답은 언제나 맞습니까?',
          core: 'AI도 틀릴 수 있으므로 사람이 다시 확인합니다.',
          detail: {
            full: '오늘 정보인지 다시 봅니다.',
            light: '자료가 오래되면 AI의 답이 지금 상황과 다를 수 있습니다.',
            challenge: 'AI가 사용한 자료의 날짜와 현재 정보를 비교해 답의 신뢰성을 판단합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '처음 온 AI 동아리 교실',
      description: '진우가 아이미에게 자리를 묻고 오늘 자리표와 다시 확인합니다.',
      facts: [
        '처음 온 곳에서 자리를 모를 수 있습니다.',
        '아이미는 진우의 말과 저장된 자리표를 보고 답을 만듭니다.',
        '진우는 현재 책상 표시와 선생님의 안내를 다시 확인합니다.',
      ],
    },
    firstAttempt: {
      prompt: '다른 날, AI는 동아리가 3시에 시작한다고 말하고 오늘 안내문에는 3시 30분이라고 적혀 있습니다. 먼저 무엇을 해 보겠습니까?',
      choices: [
        { id: 'check-today', emoji: '📅', label: '오늘 안내문과 날짜를 확인합니다.' },
        { id: 'ask-person', emoji: '🙋', label: '선생님에게 오늘 시간을 확인합니다.' },
        { id: 'follow-ai-only', emoji: '🤖', label: 'AI가 말한 시간만 보고 바로 결정합니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '먼저 확인하고 싶은 정보나 도움을 표현해 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: 'AI가 확인한 자료와 오늘 상황이 서로 다릅니다.',
      facts: [
        'AI는 어제 저장된 동아리 시간표를 확인했습니다.',
        '오늘 안내문에는 날짜와 3시 30분이 표시되어 있습니다.',
        '선생님은 오늘만 시작 시간이 바뀌었다고 설명합니다.',
        'AI의 답은 사용한 자료가 오래되면 현재 상황과 다를 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 설명',
      text: '저는 저장된 어제 시간표를 보고 3시라고 답했습니다. 오늘 안내문과 선생님의 설명을 함께 확인하면 현재 시간을 알 수 있습니다.',
      question: '지금 상황을 알려 주는 가장 최근 정보는 무엇입니까?',
    },
    artifact: {
      kind: 'action-card',
      title: 'AI 답 확인 카드',
      prompt: 'AI가 사용한 자료, 오늘 정보, 다시 확인할 사람이나 장소를 한 장에 정리해 보십시오.',
    },
    transfer: {
      title: '도서관 좌석 안내가 다르다면',
      description: 'AI는 빈자리라고 안내했지만 책상에는 사용 중 표시가 있습니다. 어떤 방법을 써 보겠습니까?',
      choices: [
        { id: 'check-seat-sign', emoji: '👀', label: '현재 책상의 사용 중 표시를 확인합니다.' },
        { id: 'ask-librarian', emoji: '🙋', label: '도서관 담당자에게 자리를 확인합니다.' },
        { id: 'sit-immediately', emoji: '🪑', label: 'AI의 안내만 보고 바로 앉습니다.' },
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
