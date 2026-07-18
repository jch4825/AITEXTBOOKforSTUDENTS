import type { StudioDefinition } from '../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES } from './shared';
import { M3_L1_VISUAL_STORY, M3_L5_VISUAL_STORY, M3_L9_VISUAL_STORY } from './visualStories/m3';

const PREPARED_LEARNING_NOTE = '이 활동의 AI 답은 안전하게 준비한 연습 예시입니다. 실제 공부에서는 교과서와 선생님에게 한 번 더 확인합니다.';

export const M3_STUDIOS: StudioDefinition[] = [
  {
    id: 'm3-question-detective',
    lessonId: 'm3-l1',
    moduleId: 'm3',
    title: '질문 탐정 실험실',
    subtitle: '넓은 질문에 필요한 단서를 더해 나에게 맞는 질문을 만듭니다',
    visualNovel: M3_L1_VISUAL_STORY,
    encounter: {
      title: '너무 넓은 질문',
      description: '공부하다가 동물이 궁금해서 “동물에 대해 알려 줘”라고 물었더니 준비된 AI가 아주 긴 답을 했습니다.',
      facts: [
        '궁금한 동물의 이름을 말하지 않았습니다.',
        '무엇을 알고 싶은지 정하지 않았습니다.',
      ],
      stimuli: [
        {
          id: 'm3-wide-question',
          kind: 'speech',
          text: '동물에 대해 알려 줘.',
          label: '처음 질문 들어 보기',
        },
      ],
    },
    firstAttempt: {
      prompt: 'AI의 긴 답을 받았다면 먼저 어떻게 해 보겠습니까?',
      choices: [
        { id: 'use-long-answer', emoji: '📚', label: '긴 답을 그대로 읽습니다.' },
        { id: 'add-topic', emoji: '🐧', label: '궁금한 동물과 내용을 더 말합니다.' },
        { id: 'ask-for-easy', emoji: '💬', label: '짧고 쉬운 말로 부탁합니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '질문에 무엇을 더 넣고 싶은지 표현해 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '과제의 목적과 시간이 더 분명해졌습니다.',
      facts: [
        '알아볼 동물은 펭귄입니다.',
        '사는 곳과 먹이를 알고 싶습니다.',
        '발표까지 5분 남았습니다.',
        '두 문장의 쉬운 설명이 필요합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '질문을 함께 좁히는 AI',
      text: '“펭귄은 어디에 살고 무엇을 먹는지 두 문장으로 쉽게 알려 줘”라고 질문해 보는 방법이 있습니다.',
      question: '이 질문에서 대상, 알고 싶은 것, 답의 길이는 각각 무엇입니까?',
    },
    artifact: {
      kind: 'repair-card',
      title: '나의 질문 설계 카드',
      prompt: '처음 질문과 새로 더한 단서를 정리해 보십시오.',
    },
    transfer: {
      title: '모르는 낱말을 묻는다면',
      description: '책에서 “서식지”라는 낱말을 만났습니다. 어떤 단서를 더하면 나에게 맞는 설명을 받겠습니까?',
      choices: [
        { id: 'word-only', emoji: '🔤', label: '“서식지”만 말합니다.' },
        { id: 'sentence-and-level', emoji: '📝', label: '문장 속 쓰임과 쉬운 설명을 부탁합니다.' },
        { id: 'example-request', emoji: '💡', label: '뜻과 함께 예시도 부탁합니다.' },
      ],
    },
    safetyNote: PREPARED_LEARNING_NOTE,
  },
  {
    id: 'm3-story-coauthor',
    lessonId: 'm3-l5',
    moduleId: 'm3',
    title: '이야기 공동창작소',
    subtitle: 'AI 제안을 그대로 따르지 않고 내 생각으로 이야기를 완성합니다',
    visualNovel: M3_L5_VISUAL_STORY,
    encounter: {
      title: '비 오는 날의 작은 로봇',
      description: '“비가 많이 오는 날, 작은 로봇이 학교에 혼자 남았습니다.”라는 문장으로 이야기를 시작했습니다.',
      facts: [
        '주인공은 작은 로봇입니다.',
        '장소는 비 오는 날의 학교입니다.',
        '아직 다음 장면과 결말은 정해지지 않았습니다.',
      ],
      stimuli: [
        {
          id: 'm3-story-scene',
          kind: 'image',
          src: '/AITEXTBOOKforSTUDENTS/lessons/m3-l5.webp',
          alt: '학생들이 AI와 함께 이야기의 인물과 장면을 고르는 교과서 그림',
          caption: '그림을 보고 이야기에서 일어날 수 있는 일을 자유롭게 떠올려 보십시오.',
        },
      ],
    },
    firstAttempt: {
      prompt: '작은 로봇에게 다음에는 어떤 일이 생기면 좋겠습니까?',
      choices: [
        { id: 'find-friend', emoji: '🤝', label: '친구를 만나 함께 방법을 찾습니다.' },
        { id: 'explore-school', emoji: '🔦', label: '조용한 학교를 탐험합니다.' },
        { id: 'draw-own', emoji: '🎨', label: '내가 생각한 다른 장면을 만듭니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '내 이야기에서 꼭 넣고 싶은 인물이나 사건을 표현해 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '함께 지켜야 할 이야기 조건이 생겼습니다.',
      facts: [
        '무서운 장면은 넣지 않습니다.',
        '작은 로봇과 친구가 모두 등장합니다.',
        '이야기는 세 문장 이내로 만듭니다.',
        '마지막 결말은 내가 정합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '한 가지 다음 장면을 제안하는 AI',
      text: '로봇은 복도에서 우산을 잃어버린 친구를 만났습니다. 둘은 창가에 있는 큰 상자를 발견했습니다.',
      question: '이 제안에서 마음에 드는 부분과 바꾸고 싶은 부분은 무엇입니까?',
    },
    artifact: {
      kind: 'visual-plan',
      title: 'AI와 나의 이야기 보드',
      prompt: 'AI 제안과 내가 만든 결말을 말·글·그림으로 정리해 보십시오.',
    },
    transfer: {
      title: '같은 시작, 다른 이야기',
      description: '같은 작은 로봇 이야기의 분위기를 즐겁거나 신기하게 바꿔 보십시오.',
      choices: [
        { id: 'happy-ending', emoji: '🌈', label: '함께 우산을 찾아 즐겁게 돌아갑니다.' },
        { id: 'mystery-ending', emoji: '✨', label: '상자에서 신기한 학교 지도를 찾습니다.' },
        { id: 'new-ending', emoji: '✍️', label: '나만의 다른 결말을 만듭니다.' },
      ],
    },
    safetyNote: 'AI가 만든 이야기는 준비된 창작 예시입니다. 마음에 들지 않는 제안은 바꾸거나 사용하지 않아도 됩니다.',
  },
  {
    id: 'm3-image-description-review',
    lessonId: 'm3-l9',
    moduleId: 'm3',
    title: '이미지 설명 검토소',
    subtitle: '그림에서 보이는 사실과 AI가 추측한 내용을 나누어 살펴봅니다',
    visualNovel: M3_L9_VISUAL_STORY,
    encounter: {
      title: '그림보다 앞서간 설명',
      description: '준비된 AI가 그림을 보고 “두 학생은 소풍을 가서 매우 행복합니다”라고 설명했습니다.',
      facts: [
        '그림에서 사람과 사물은 직접 확인할 수 있습니다.',
        '마음이나 장소는 그림만 보고 확실하지 않을 수 있습니다.',
      ],
      stimuli: [
        {
          id: 'm3-picture',
          kind: 'image',
          src: '/AITEXTBOOKforSTUDENTS/lessons/m3-l9.webp',
          alt: '학생들이 그림을 살펴보며 보이는 내용을 설명하는 교과서 장면',
          caption: '그림에서 직접 확인할 수 있는 것만 먼저 찾아보십시오.',
        },
      ],
    },
    firstAttempt: {
      prompt: '준비된 AI 설명을 듣고 어떻게 확인하겠습니까?',
      choices: [
        { id: 'believe-all', emoji: '✅', label: 'AI가 말한 내용을 모두 사실로 생각합니다.' },
        { id: 'compare-picture', emoji: '🖼️', label: '그림과 설명을 하나씩 비교합니다.' },
        { id: 'mark-uncertain', emoji: '❓', label: '확실하지 않은 말에 물음표를 붙입니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그림에서 직접 본 것과 아직 모르는 것을 표현해 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '그림을 다시 크게 보고 설명의 종류를 나누어 봤습니다.',
      facts: [
        '사람의 수와 들고 있는 물건은 볼 수 있습니다.',
        '어디로 가는지는 표지판이 없으면 확실하지 않습니다.',
        '표정만으로 마음을 단정할 수 없습니다.',
        '보이지 않는 내용은 “~인 것 같습니다”라고 말할 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '설명을 고쳐 말하는 AI',
      text: '그림에는 가방을 든 두 학생이 함께 서 있습니다. 두 학생이 어디에 가는지와 기분은 그림만으로 확실히 알 수 없습니다.',
      question: '고친 설명에서 사실과 조심해서 말한 부분을 찾아 보겠습니까?',
    },
    artifact: {
      kind: 'action-card',
      title: '그림 설명 확인표',
      prompt: '보이는 사실과 확인할 수 없는 추측을 나누어 적어 보십시오.',
    },
    transfer: {
      title: '새로운 그림 설명 확인하기',
      description: '새 그림을 본 AI가 “이 사람은 길을 잃어서 슬퍼요”라고 말했습니다. 어떻게 확인하겠습니까?',
      choices: [
        { id: 'fact-first', emoji: '👀', label: '먼저 보이는 사람·사물·행동을 말합니다.' },
        { id: 'state-as-fact', emoji: '💭', label: '마음과 까닭도 모두 사실로 말합니다.' },
        { id: 'ask-context', emoji: '🔍', label: '알 수 없는 내용은 더 확인합니다.' },
      ],
    },
    safetyNote: '준비된 이미지 설명에도 실수나 추측이 섞일 수 있습니다. 중요한 내용은 그림과 다른 사람의 설명을 함께 확인합니다.',
  },
];
