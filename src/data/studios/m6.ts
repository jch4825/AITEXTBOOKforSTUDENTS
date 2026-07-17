import type { StudioDefinition } from '../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES } from './shared';

const PREPARED_LIFE_NOTE = '이 활동의 AI 의견은 안전하게 준비한 연습 예시입니다. 실제 돈·건강·이동·개인정보 판단은 믿을 만한 사람과 공식 정보를 함께 확인합니다.';

export const M6_STUDIOS: StudioDefinition[] = [
  {
    id: 'm6-shopping-choice',
    lessonId: 'm6-l1',
    moduleId: 'm6',
    title: '장보기 선택 스튜디오',
    subtitle: '사고 싶은 것과 필요한 것, 예산과 안전 정보를 함께 살펴봅니다',
    encounter: {
      title: '무엇부터 살까?',
      description: '생활용품과 간식을 함께 사러 마트에 왔습니다. 사고 싶은 물건은 많지만 아직 예산과 꼭 필요한 물건을 확인하지 않았습니다.',
      facts: [
        '생활용품과 간식이 목록에 함께 있습니다.',
        '쓸 수 있는 돈이 얼마인지 아직 확인하지 않았습니다.',
      ],
      stimuli: [
        {
          id: 'm6-shopping-scene',
          kind: 'image',
          src: '/AITEXTBOOKforSTUDENTS/lessons/m6-l1.webp',
          alt: '학생이 마트에서 장보기 목록과 진열된 물건을 비교하는 교과서 장면',
          caption: '필요한 물건, 가격, 수량을 하나씩 찾아보십시오.',
        },
      ],
    },
    firstAttempt: {
      prompt: '장보기를 시작할 때 무엇을 먼저 하겠습니까?',
      choices: [
        { id: 'favorite-first', emoji: '🍪', label: '먹고 싶은 간식부터 담습니다.' },
        { id: 'check-list', emoji: '📝', label: '필요한 물건과 예산을 확인합니다.' },
        { id: 'ask-support', emoji: '🙋', label: '어려우면 함께 온 사람에게 물어봅니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '먼저 사고 싶은 것과 꼭 필요한 것을 표현해 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '장보기 조건을 확인하니 선택을 바꿀 정보가 생겼습니다.',
      facts: [
        '예산은 10,000원입니다.',
        '치약과 우유는 꼭 필요합니다.',
        '원래 고른 우유는 품절입니다.',
        '대체품은 알레르기 표시를 확인해야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '대체품을 하나 제안하는 AI',
      text: '같은 크기의 다른 우유를 살펴볼 수 있습니다. 다만 가격과 알레르기 표시를 확인하고, 맞지 않으면 사지 않는 방법도 있습니다.',
      question: '대체품을 고르기 전에 가격·필요·안전 중 무엇을 확인하겠습니까?',
    },
    artifact: {
      kind: 'visual-plan',
      title: '나의 장보기 판단표',
      prompt: '꼭 살 물건, 살 수 있는 대체품, 이번에는 사지 않을 물건을 나누어 정리해 보십시오.',
    },
    transfer: {
      title: '학교 준비물을 산다면',
      description: '준비물 세 가지를 사야 하지만 가진 돈으로 모두 사기 어렵습니다. 어떻게 조정하겠습니까?',
      choices: [
        { id: 'must-first', emoji: '✅', label: '내일 꼭 필요한 준비물부터 골라습니다.' },
        { id: 'compare-price', emoji: '💰', label: '가격과 집에 있는 물건을 확인합니다.' },
        { id: 'buy-all', emoji: '🛍️', label: '돈이 부족해도 모두 계산대로 가져갑니다.' },
      ],
    },
    safetyNote: PREPARED_LIFE_NOTE,
  },
  {
    id: 'm6-transit-change',
    lessonId: 'm6-l4',
    moduleId: 'm6',
    title: '교통 변수 대응실',
    subtitle: '버스와 지하철 상황이 달라져도 안전한 확인과 도움 요청을 먼저 합니다',
    encounter: {
      title: '오지 않는 버스',
      description: '약속 장소로 가려고 정류장에 왔는데 타려던 버스가 예정 시간보다 늦게 옵니다.',
      facts: [
        '타려던 버스가 아직 오지 않았습니다.',
        '약속한 사람에게 늦는다고 알릴 수 있습니다.',
      ],
      stimuli: [
        {
          id: 'm6-transit-scene',
          kind: 'image',
          src: '/AITEXTBOOKforSTUDENTS/lessons/m6-l4.webp',
          alt: '학생이 버스 정류장에서 노선 안내와 주변 도움 표지를 확인하는 교과서 장면',
          caption: '버스 번호, 정류장 이름, 도움을 요청할 사람을 찾아보십시오.',
        },
      ],
    },
    firstAttempt: {
      prompt: '버스가 늦게 올 때 먼저 무엇을 하겠습니까?',
      choices: [
        { id: 'wait-silently', emoji: '🕐', label: '아무에게도 말하지 않고 계속 기다립니다.' },
        { id: 'tell-and-check', emoji: '📣', label: '늦는다고 알리고 교통 정보를 확인합니다.' },
        { id: 'ask-safe-person', emoji: '🙋', label: '직원이나 보호자에게 도움을 요청합니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '지금 확인할 정보와 연락할 사람을 표현해 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '기다리는 동안 이동 계획을 바꿀 정보가 더 생겼습니다.',
      facts: [
        '버스 노선이 임시로 바뀌었다는 안내가 있습니다.',
        '휴대전화 배터리가 10%입니다.',
        '지금 있는 장소가 익숙하지 않습니다.',
        '연락할 보호자와 정류장 직원이 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '확인 순서를 제안하는 AI',
      text: '배터리를 아끼면서 보호자에게 현재 정류장 이름을 알리고, 정류장 직원에게 바뀐 노선을 확인하는 방법이 있습니다.',
      question: '새 경로를 정하기 전에 누구에게 어떤 정보를 확인하겠습니까?',
    },
    artifact: {
      kind: 'action-card',
      title: '안전 이동 계획 카드',
      prompt: '현재 위치를 확인할 단서, 연락할 사람, 안전하게 기다릴 장소, 다음 행동을 정리해 보십시오.',
    },
    transfer: {
      title: '지하철 운행이 멈췄다면',
      description: '지하철 안내 방송에서 운행이 잠시 멈췄다고 했습니다. 처음 가는 역이라면 어떻게 하겠습니까?',
      choices: [
        { id: 'follow-stranger', emoji: '🚶', label: '낯선 사람이 가는 길을 바로 따라갑니다.' },
        { id: 'check-staff', emoji: '🚉', label: '역무원과 공식 안내를 확인합니다.' },
        { id: 'contact-trusted', emoji: '📱', label: '보호자에게 상황과 역 이름을 알립니다.' },
      ],
    },
    safetyNote: '이 활동은 교실에서 하는 준비된 시뮬레이션이며 실시간 길 안내가 아닙니다. 실제 이동에서는 공식 안내와 보호자·직원의 도움을 먼저 확인합니다.',
  },
  {
    id: 'm6-safe-self-introduction',
    lessonId: 'm6-l11',
    moduleId: 'm6',
    title: '안전한 자기소개 연구소',
    subtitle: '만나는 사람과 장소에 맞게 소개할 정보의 범위를 정합니다',
    encounter: {
      title: '새 동아리 친구에게 나를 소개하기',
      description: '새로 만난 동아리 친구에게 내 이름과 좋아하는 활동을 소개하려고 합니다.',
      facts: [
        '학교에서 직접 만난 동아리 친구입니다.',
        '함께할 활동을 위해 좋아하는 것을 말할 수 있습니다.',
      ],
      stimuli: [
        {
          id: 'm6-introduction-speech',
          kind: 'speech',
          text: '안녕하세요. 저는 그림 그리기를 좋아합니다. 만나서 반갑습니다.',
          label: '안전한 소개 예시 들어 보기',
        },
      ],
    },
    firstAttempt: {
      prompt: '새 동아리 친구에게 무엇을 소개하고 싶습니까?',
      choices: [
        { id: 'name-interest', emoji: '🎨', label: '부를 이름과 좋아하는 활동을 말합니다.' },
        { id: 'strength', emoji: '⭐', label: '내가 잘하거나 함께하고 싶은 일을 말합니다.' },
        { id: 'all-private', emoji: '🏠', label: '집 주소와 전화번호까지 모두 말합니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '상대에게 알려 주고 싶은 것과 말하지 않을 것을 표현해 보십시오.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '자기소개를 하는 상대와 장소가 달라졌습니다.',
      facts: [
        '공개 온라인 공간에서는 모르는 사람도 볼 수 있습니다.',
        '주소·전화번호·비밀번호는 소개에 필요하지 않습니다.',
        '지금 있는 장소를 실시간으로 말하지 않습니다.',
        '불편하면 소개하는 정보의 범위를 줄일 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '소개 범위를 확인하는 AI',
      text: '온라인에서는 실제 이름 대신 별명과 좋아하는 활동만 소개할 수 있습니다. 주소, 전화번호, 비밀번호, 지금 있는 장소는 말하지 않습니다.',
      question: '이 소개의 목적에 꼭 필요한 정보는 무엇이고 빼야 할 정보는 무엇입니까?',
    },
    artifact: {
      kind: 'repair-card',
      title: '상대에 맞춘 자기소개 카드',
      prompt: '교실에서 말할 소개와 공개 온라인 공간에서 말할 소개를 나누어 정리해 보십시오.',
    },
    transfer: {
      title: '온라인 게임 채팅에서 묻는다면',
      description: '게임에서 처음 만난 사람이 학교와 사는 곳을 물어봤습니다. 어떻게 답하겠습니까?',
      choices: [
        { id: 'give-location', emoji: '📍', label: '학교 이름과 사는 곳을 자세히 말합니다.' },
        { id: 'limit-info', emoji: '🛡️', label: '개인정보는 말하지 않고 게임 이야기만 합니다.' },
        { id: 'stop-and-tell', emoji: '🙋', label: '계속 물으면 대화를 멈추고 어른에게 알립니다.' },
      ],
    },
    safetyNote: PREPARED_LIFE_NOTE,
  },
];
