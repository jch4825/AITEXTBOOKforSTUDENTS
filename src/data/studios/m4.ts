import type { StudioDefinition } from '../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES } from './shared';

const PREPARED_SAFETY_NOTE = '이 활동의 AI 답과 온라인 장면은 안전하게 준비한 연습 예시예요. 실제로 이상하거나 불편한 일이 생기면 화면을 멈추고 믿을 만한 어른에게 알려요.';

export const M4_STUDIOS: StudioDefinition[] = [
  {
    id: 'm4-answer-verification',
    lessonId: 'm4-l1',
    moduleId: 'm4',
    title: 'AI 답 검증소',
    subtitle: '자신 있게 말하는 AI 답도 근거와 최신 정보를 확인해요',
    encounter: {
      title: '시간표와 다른 준비된 AI 답',
      description: '내일 준비물을 물었더니 준비된 AI가 “매주 화요일은 체육 수업이니 체육복을 가져가세요”라고 자신 있게 답했어요.',
      facts: [
        'AI는 아주 자신 있게 말했어요.',
        'AI가 어느 시간표를 보고 답했는지는 알 수 없어요.',
      ],
    },
    firstAttempt: {
      prompt: '자신 있게 말하는 AI 답을 받았다면 어떻게 할까요?',
      choices: [
        { id: 'trust-confident', emoji: '👍', label: '자신 있게 말했으니 그대로 믿어요.' },
        { id: 'check-notice', emoji: '📋', label: '학교 시간표와 알림장을 확인해요.' },
        { id: 'ask-adult', emoji: '🙋', label: '선생님이나 보호자에게 물어봐요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '어떤 자료나 사람에게 확인하고 싶은지 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: 'AI 답과 비교할 새로운 정보를 찾았어요.',
      facts: [
        'AI가 말한 시간표는 지난 학기 자료예요.',
        '이번 학기 학교 시간표에는 미술 수업이라고 적혀 있어요.',
        '오늘 받은 알림장에도 미술 준비물이 적혀 있어요.',
        '내일 수업 준비에 바로 영향을 주는 정보예요.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '틀릴 수 있음을 인정하는 AI',
      text: '제가 지난 자료를 바탕으로 잘못 답했을 수 있어요. 오늘 받은 학교 시간표와 알림장을 따라 주세요.',
      question: '이 상황에서 더 최신이고 믿을 만한 근거는 무엇인가요?',
    },
    artifact: {
      kind: 'repair-card',
      title: 'AI 답 확인 기록',
      prompt: 'AI의 첫 답, 비교한 근거, 마지막에 선택한 정보를 순서대로 정리해 보세요.',
    },
    transfer: {
      title: '날씨 정보가 다르다면',
      description: '준비된 AI는 맑다고 했지만 공식 날씨 알림에는 비가 온다고 적혀 있어요. 어떻게 할까요?',
      choices: [
        { id: 'follow-first', emoji: '☀️', label: '먼저 들은 AI 답만 따라요.' },
        { id: 'check-official', emoji: '🌧️', label: '최신 공식 날씨 정보를 확인해요.' },
        { id: 'prepare-safe', emoji: '☂️', label: '필요하면 어른과 확인하고 우산을 준비해요.' },
      ],
    },
    safetyNote: PREPARED_SAFETY_NOTE,
  },
  {
    id: 'm4-photo-sharing-safety',
    lessonId: 'm4-l5',
    moduleId: 'm4',
    title: '사진 공유 안전실',
    subtitle: '누구에게 왜 보내는지와 사진 속 정보를 살펴 공유 범위를 정해요',
    encounter: {
      title: '사진을 보내 달라는 메시지',
      description: '온라인에서 최근에 알게 된 사람이 “학교 활동 사진을 보내 줘”라고 말했어요.',
      facts: [
        '상대가 실제로 누구인지 확실하지 않아요.',
        '사진을 왜 필요한지 분명하지 않아요.',
      ],
      stimuli: [
        {
          id: 'm4-photo-scene',
          kind: 'image',
          src: '/AITEXTBOOKforSTUDENTS/lessons/m4-l5.webp',
          alt: '학생이 사진을 보내기 전에 사진 속 개인정보를 살펴보는 교과서 장면',
          caption: '사진을 보내기 전에 사람의 얼굴, 이름, 장소 단서를 찾아보세요.',
        },
      ],
    },
    firstAttempt: {
      prompt: '사진을 보내 달라는 부탁을 받았다면 먼저 무엇을 할까요?',
      choices: [
        { id: 'send-now', emoji: '📤', label: '부탁했으니 바로 보내요.' },
        { id: 'check-person-purpose', emoji: '🔎', label: '상대와 보내는 목적을 확인해요.' },
        { id: 'pause-ask', emoji: '🛑', label: '멈추고 믿을 만한 어른에게 물어봐요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '사진을 보내기 전에 확인하고 싶은 것을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '사진을 자세히 보니 새 정보가 보였어요.',
      facts: [
        '교복 이름표에 내 이름이 보여요.',
        '창밖 표지판으로 학교 근처 장소를 알 수 있어요.',
        '가족의 얼굴도 함께 나왔어요.',
        '상대는 사진을 어디에 쓸지 말하지 않았어요.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '사진 공유 전 확인을 제안하는 AI',
      text: '이름, 얼굴, 위치 단서가 보이는 사진은 바로 보내지 않는 편이 안전해요. 목적이 분명한지 믿을 만한 어른과 먼저 확인해 보세요.',
      question: '사진을 보내지 않고도 활동을 설명할 다른 방법이 있을까요?',
    },
    artifact: {
      kind: 'action-card',
      title: '사진 공유 전 확인 카드',
      prompt: '상대, 목적, 사진 속 정보, 어른과의 확인 여부를 짧게 표시해 보세요.',
    },
    transfer: {
      title: '학교 과제에 사진을 낸다면',
      description: '선생님이 알려 준 학교 과제 공간에 작품 사진을 올리려고 해요. 어떤 점을 확인할까요?',
      choices: [
        { id: 'official-space', emoji: '🏫', label: '정해진 학교 공간과 과제 목적을 확인해요.' },
        { id: 'remove-private', emoji: '✂️', label: '이름·얼굴·위치 단서가 없는 사진을 골라요.' },
        { id: 'post-public', emoji: '🌐', label: '누구나 보는 공개 공간에도 함께 올려요.' },
      ],
    },
    safetyNote: PREPARED_SAFETY_NOTE,
  },
  {
    id: 'm4-ad-clue-detective',
    lessonId: 'm4-l10',
    moduleId: 'm4',
    title: '광고 단서 탐정실',
    subtitle: '추천처럼 보이는 글에서 목적과 표시, 빠진 정보를 찾아봐요',
    encounter: {
      title: '모두에게 가장 좋다는 추천',
      description: '준비된 게시물이 “이 음료는 모두에게 가장 좋아요. 지금 꼭 사세요!”라고 소개했어요.',
      facts: [
        '좋은 점만 크게 적혀 있어요.',
        '누가 왜 이 글을 만들었는지는 바로 보이지 않아요.',
      ],
      stimuli: [
        {
          id: 'm4-ad-scene',
          kind: 'image',
          src: '/AITEXTBOOKforSTUDENTS/lessons/m4-l10.webp',
          alt: '학생들이 추천 글에 있는 광고 표시와 구매 단서를 찾는 교과서 장면',
          caption: '크게 쓰인 문장뿐 아니라 작은 표시와 연결 버튼도 함께 살펴보세요.',
        },
      ],
    },
    firstAttempt: {
      prompt: '이 추천 글을 봤을 때 어떻게 판단할까요?',
      choices: [
        { id: 'buy-now', emoji: '🛒', label: '모두에게 좋다고 했으니 바로 사요.' },
        { id: 'find-ad-clue', emoji: '🔍', label: '광고일 수 있는 단서를 찾아요.' },
        { id: 'compare-info', emoji: '⚖️', label: '다른 정보와 가격을 비교해요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '추천 글에서 더 확인하고 싶은 내용을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '게시물을 자세히 보니 광고일 수 있는 단서가 더 보였어요.',
      facts: [
        '글 아래에 작은 “광고” 표시가 있어요.',
        '누르면 바로 사는 구매 링크가 있어요.',
        '장점은 많지만 주의할 점은 없어요.',
        '가격과 다른 제품과의 비교가 빠져 있어요.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '광고 단서를 함께 찾는 AI',
      text: '작은 광고 표시와 구매 링크는 판매 목적을 알려 주는 단서예요. 한 가지 단서만 보지 말고 다른 정보도 함께 비교해 보세요.',
      question: '이 글이 무엇을 하게 만들려는지 알 수 있는 단서는 무엇인가요?',
    },
    artifact: {
      kind: 'visual-plan',
      title: '광고 단서 표시판',
      prompt: '광고 표시, 구매 링크, 과장된 말, 빠진 정보를 그림이나 짧은 말로 표시해 보세요.',
    },
    transfer: {
      title: '게임 영상 속 추천이라면',
      description: '좋아하는 영상에서 진행자가 게임 물건을 “꼭 사야 한다”고 말했어요. 어떻게 살펴볼까요?',
      choices: [
        { id: 'look-label', emoji: '🏷️', label: '유료 광고나 협찬 표시를 찾아요.' },
        { id: 'follow-creator', emoji: '🎮', label: '좋아하는 사람이니 바로 사요.' },
        { id: 'compare-need', emoji: '🤔', label: '정말 필요한지 다른 정보와 비교해요.' },
      ],
    },
    safetyNote: PREPARED_SAFETY_NOTE,
  },
];
