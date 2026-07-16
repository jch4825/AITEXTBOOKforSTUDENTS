import type { StudioDefinition } from '../../features/studio/types';

const SUPPORT_PROFILES = {
  full: {
    visibleFactCount: 2,
    choiceLimit: 2,
    hint: '중요한 정보 두 가지부터 함께 찾아봐요.',
    aiRoleDepth: 'direct',
  },
  light: {
    visibleFactCount: 3,
    choiceLimit: 3,
    hint: '달라진 조건을 보고 내 방법을 다시 살펴봐요.',
    aiRoleDepth: 'prompting',
  },
  challenge: {
    visibleFactCount: 4,
    hint: 'AI 의견의 장점과 한계를 비교해 내 판단을 설명해 봐요.',
    aiRoleDepth: 'counterpoint',
  },
} satisfies StudioDefinition['supportProfiles'];

const EXPRESSION_MODES = ['choice', 'aac', 'text', 'speech', 'draw'] as const;

export const M5_STUDIOS: StudioDefinition[] = [
  {
    id: 'm5-ambiguous-problem',
    lessonId: 'm5-l1',
    moduleId: 'm5',
    title: '버스가 늦게 온다면',
    subtitle: '달라지는 정보를 보고 내 방법을 조정해요',
    encounter: {
      title: '약속 장소로 가는 길',
      description: '친구와 만나기로 했는데 타려던 버스가 늦게 와요. 아직 모든 정보가 정해지지는 않았어요.',
      facts: [
        '친구와 만나기로 했어요.',
        '타려던 버스가 늦게 와요.',
      ],
    },
    firstAttempt: {
      prompt: '지금 나는 먼저 무엇을 해 볼까요?',
      choices: [
        { id: 'wait', emoji: '🕐', label: '그냥 계속 기다려요.' },
        { id: 'contact', emoji: '💬', label: '친구에게 늦는다고 알려요.' },
        { id: 'alternate', emoji: '🗺️', label: '다른 길을 찾아봐요.' },
      ],
      modes: [...EXPRESSION_MODES],
      reasonPrompt: '왜 그렇게 생각했나요? 말하고 싶으면 표현해 보세요.',
    },
    supportProfiles: SUPPORT_PROFILES,
    conditionChange: {
      description: '기다리는 동안 새로운 정보를 알게 되었어요.',
      facts: [
        '휴대전화 배터리가 8%예요.',
        '약속까지 20분 남았어요.',
        '연락할 친구가 있어요.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '확인 질문을 하는 AI',
      text: '다른 길을 찾기 전에 친구에게 늦는다고 알리고, 배터리를 아끼면서 정류장 안내를 확인하는 방법도 있어요.',
      question: '지금 가장 먼저 상황을 알려야 할 사람은 누구인가요?',
    },
    artifact: {
      kind: 'action-card',
      title: '나의 행동 카드',
      prompt: '지금 먼저 할 일과 그다음 할 일을 짧게 정리해 보세요.',
    },
    transfer: {
      title: '지하철도 멈췄다면',
      description: '중요한 일정이 있는데 지하철 운행이 갑자기 멈췄어요. 누구에게 무엇을 확인하고 알릴까요?',
      choices: [
        { id: 'tell-and-check', emoji: '📣', label: '상황을 알리고 다른 교통편을 확인해요.' },
        { id: 'wait-only', emoji: '🚇', label: '아무에게도 말하지 않고 계속 기다려요.' },
        { id: 'ask-staff', emoji: '🙋', label: '역무원에게 운행 정보를 물어봐요.' },
      ],
    },
  },
  {
    id: 'm5-clarify-request',
    lessonId: 'm5-l6',
    moduleId: 'm5',
    title: 'AI가 다르게 알아들었다면',
    subtitle: '개인정보 없이 내 뜻을 더 분명하게 전해요',
    encounter: {
      title: '다른 장소를 알려 준 AI',
      description: 'AI에게 가는 길을 물었는데 내가 가려던 곳과 다른 장소를 알려줬어요.',
      facts: [
        'AI에게 가는 길을 물었어요.',
        'AI가 다른 장소를 알려줬어요.',
      ],
    },
    firstAttempt: {
      prompt: 'AI가 다르게 알아들었을 때 어떻게 해 볼까요?',
      choices: [
        { id: 'repeat', emoji: '🔁', label: '같은 말을 그대로 반복해요.' },
        { id: 'add-clue', emoji: '🔎', label: '알고 있는 단서를 더 말해요.' },
        { id: 'follow', emoji: '➡️', label: 'AI 답을 그대로 따라가요.' },
      ],
      modes: [...EXPRESSION_MODES],
      reasonPrompt: '내가 고른 방법의 이유를 말하고 싶으면 표현해 보세요.',
    },
    supportProfiles: SUPPORT_PROFILES,
    conditionChange: {
      description: '목적지를 설명할 때 지켜야 할 조건도 생겼어요.',
      facts: [
        '정확한 장소 이름은 몰라요.',
        '주변 건물은 알아요.',
        '집 주소나 전화번호는 말하지 않아요.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '뜻을 확인하는 AI',
      text: '개인정보 대신 주변에 보이는 건물이나 표지판을 한 가지 더 말해 주세요.',
      question: '목적지 근처에서 볼 수 있는 건물이나 표지판이 있나요?',
    },
    artifact: {
      kind: 'repair-card',
      title: '다시 말하기 카드',
      prompt: '처음 말한 내용과 새로 덧붙일 안전한 단서를 한 문장으로 정리해 보세요.',
    },
    transfer: {
      title: '이름을 모르는 물건을 찾는다면',
      description: '가게에서 이름을 모르는 물건을 찾고 있어요. 물건의 쓰임과 모양을 어떻게 설명할까요?',
      choices: [
        { id: 'describe-use', emoji: '🧰', label: '무엇에 쓰는 물건인지 말해요.' },
        { id: 'describe-shape', emoji: '🔷', label: '색과 모양을 말해요.' },
        { id: 'give-private-info', emoji: '📱', label: '내 전화번호부터 말해요.' },
      ],
    },
  },
  {
    id: 'm5-changing-cooking-plan',
    lessonId: 'm5-l11',
    moduleId: 'm5',
    title: '계획과 조건이 달라진다면',
    subtitle: '재료·도구·시간·안전을 살펴 계획을 바꿔요',
    encounter: {
      title: '라면 계획 세우기',
      description: '라면을 만들 계획을 세우고 있어요. 먼저 필요한 재료와 도구를 살펴봐요.',
      facts: [
        '라면을 끓이려는 계획이 있어요.',
        '필요한 재료와 도구를 확인해야 해요.',
      ],
    },
    firstAttempt: {
      prompt: '계획을 시작하기 전에 무엇을 먼저 해 볼까요?',
      choices: [
        { id: 'start-now', emoji: '🏃', label: '있는 것부터 바로 시작해요.' },
        { id: 'check-items', emoji: '✅', label: '재료와 도구를 먼저 확인해요.' },
        { id: 'plan-with-teacher', emoji: '👩‍🏫', label: '교사에게 함께 계획해 달라고 해요.' },
      ],
      modes: [...EXPRESSION_MODES],
      reasonPrompt: '내가 먼저 확인하고 싶은 것을 표현해 보세요.',
    },
    supportProfiles: SUPPORT_PROFILES,
    conditionChange: {
      description: '처음 생각한 계획과 다른 조건이 생겼어요.',
      facts: [
        '계란이 없어요.',
        '냄비를 바로 쓸 수 없어요.',
        '시간이 10분뿐이에요.',
        '실제 조리는 교사와 함께해야 해요.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '다른 계획을 제안하는 AI',
      text: '지금은 실제로 끓이지 말고, 가능한 재료와 안전한 순서를 카드로 먼저 정리해 보는 방법이 있어요.',
      question: '바뀐 조건 때문에 빼거나 바꿔야 할 단계는 무엇인가요?',
    },
    artifact: {
      kind: 'visual-plan',
      title: '나의 시각적 조리 계획',
      prompt: '사용할 수 있는 재료와 안전하게 확인할 순서를 그림이나 짧은 말로 정리해 보세요.',
    },
    transfer: {
      title: '다른 간단한 음식을 계획한다면',
      description: '간단한 음식을 만들기 전에 재료·도구·시간·안전을 다시 확인해요.',
      choices: [
        { id: 'check-four', emoji: '📝', label: '재료·도구·시간·안전을 모두 확인해요.' },
        { id: 'skip-safety', emoji: '⚡', label: '시간이 없으니 안전 확인을 빼요.' },
        { id: 'change-plan', emoji: '🔄', label: '조건에 맞는 다른 계획을 세워요.' },
      ],
    },
    safetyNote: '이 활동에서는 실제 불이나 뜨거운 물을 사용하지 않아요. 그림과 카드로 계획하고, 실제 조리는 반드시 교사와 함께해요.',
  },
];
