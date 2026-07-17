import type { StudioDefinition } from '../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES } from './shared';

export const M1_STUDIOS: StudioDefinition[] = [
  {
    id: 'm1-daily-ai-finder',
    lessonId: 'm1-l1',
    moduleId: 'm1',
    title: '오늘 하루의 AI 찾기',
    subtitle: '겉모습이 아니라 결과가 달라지는 근거를 찾습니다',
    encounter: {
      title: '아침부터 학교에 올 때까지',
      description: '알람시계, 휴대전화 추천, 자동문처럼 오늘 만난 물건을 떠올려 봅니다. 모두 AI입니까?',
      facts: [
        '알람시계는 정한 시간에 울렸습니다.',
        '휴대전화는 내가 자주 보는 영상을 추천했습니다.',
        '학교 자동문은 사람이 가까이 가자 열렸습니다.',
      ],
    },
    firstAttempt: {
      prompt: '어떤 단서를 보고 AI인지 먼저 판단해 보겠습니까?',
      choices: [
        { id: 'looks-smart', emoji: '✨', label: '겉모습이 똑똑해 보여서 AI라고 합니다.' },
        { id: 'changing-result', emoji: '🔄', label: '사용자나 입력에 따라 결과가 달라지는지 살펴봅니다.' },
        { id: 'nothing-ai', emoji: '🚫', label: '생활 물건은 무조건 AI가 아니라고 합니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '내가 찾은 AI 단서나 궁금한 점을 표현해 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '겉으로 비슷한 물건에도 서로 다른 조건이 있다는 것을 알게 되었습니다.',
      facts: [
        '인터넷이 끊겨도 알람은 같은 시간에 울립니다.',
        '휴대전화 추천은 사람마다 다릅니다.',
        '자동문은 가까이 오면 정해진 방식으로 열립니다.',
        '이름에 스마트가 있어도 AI가 아닐 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '근거를 묻는 AI',
      text: '물건 이름보다 무엇을 입력받고 결과가 사람이나 상황에 따라 달라지는지 살펴보는 방법이 있습니다.',
      question: '이 물건은 배운 자료나 사용자의 선택에 따라 다른 결과를 보여 주습니까?',
    },
    artifact: {
      kind: 'action-card',
      title: '나의 AI 발견 카드',
      prompt: '물건 이름, AI라고 생각한 단서, 더 확인할 점을 한 장에 정리해 보십시오.',
    },
    transfer: {
      title: '교실과 도서관에서도 찾아본다면',
      description: '전자칠판, 도서 검색, 센서 조명 중 어떤 것이 AI인지 근거를 살펴봅니다.',
      choices: [
        { id: 'compare-input-output', emoji: '🔍', label: '입력과 결과가 어떻게 달라지는지 비교합니다.' },
        { id: 'judge-by-name', emoji: '🏷️', label: '제품 이름에 AI가 있으면 바로 AI라고 합니다.' },
        { id: 'ask-and-check', emoji: '🙋', label: '모르면 질문하고 실제 기능을 확인합니다.' },
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
