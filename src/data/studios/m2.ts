import type { StudioDefinition } from '../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES } from './shared';

const PREPARED_AI_NOTE = '화면의 답은 실제 AI 연결이 아닌 준비된 AI 예시예요. 안전한 연습 응답으로 판단과 고쳐 묻기를 연습해요.';

export const M2_STUDIOS: StudioDefinition[] = [
  {
    id: 'm2-misunderstood-request',
    lessonId: 'm2-l1',
    moduleId: 'm2',
    title: 'AI가 내 말을 못 알아들었어요',
    subtitle: '빠진 정보를 찾고 내 뜻을 안전하게 더해요',
    encounter: {
      title: '“그거 알려 줘”라고 했더니',
      description: 'AI에게 “그거 알려 줘”라고 말했는데 AI는 날씨를 알려줬어요. 나는 오늘 급식 메뉴가 궁금했어요.',
      facts: [
        '나는 오늘 급식 메뉴가 궁금해요.',
        '처음 요청에는 급식이라는 말이 없어요.',
        'AI는 날씨를 묻는 말로 이해했어요.',
      ],
    },
    firstAttempt: {
      prompt: 'AI가 다르게 알아들었을 때 먼저 어떻게 해 볼까요?',
      choices: [
        { id: 'repeat-same', emoji: '🔁', label: '같은 말을 그대로 반복해요.' },
        { id: 'add-information', emoji: '➕', label: '필요한 정보를 한 가지 더 말해요.' },
        { id: 'use-wrong-answer', emoji: '➡️', label: 'AI가 준 답을 그대로 사용해요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: 'AI에게 더 말하고 싶은 정보를 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '내가 원하는 답을 받으려면 새로 알려 줄 조건이 생겼어요.',
      facts: [
        '궁금한 대상은 오늘 학교 급식이에요.',
        '날짜는 오늘이에요.',
        '메뉴 이름만 짧게 알고 싶어요.',
        '학생 이름과 집 주소는 말할 필요가 없어요.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '뜻을 좁히는 AI',
      text: '궁금한 대상과 날짜, 원하는 답의 모양을 알려 주세요. 개인정보는 말하지 않아도 돼요.',
      question: '오늘 학교 급식 메뉴를 짧게 알려 달라는 뜻인가요?',
    },
    artifact: {
      kind: 'repair-card',
      title: '요청 고치기 카드',
      prompt: '처음 요청과 새로 덧붙인 안전한 정보를 나란히 정리해 보세요.',
    },
    transfer: {
      title: '이름을 모르는 물건을 부탁한다면',
      description: '교실에서 이름을 모르는 물건을 찾고 있어요. 쓰임과 모양을 어떻게 말할까요?',
      choices: [
        { id: 'repeat-that', emoji: '🔁', label: '“그거”라는 말만 다시 반복해요.' },
        { id: 'describe-use', emoji: '🧰', label: '무엇에 쓰고 어떻게 생겼는지 말해요.' },
        { id: 'share-address', emoji: '🏠', label: '내 집 주소를 먼저 말해요.' },
      ],
    },
    safetyNote: PREPARED_AI_NOTE,
  },
  {
    id: 'm2-request-workshop',
    lessonId: 'm2-l6',
    moduleId: 'm2',
    title: '요청 공동 제작소',
    subtitle: '목적·예시·순서·답의 모양을 조합해요',
    encounter: {
      title: '학교 준비를 도와 달라는 부탁',
      description: 'AI에게 내일 학교 준비를 도와 달라고 부탁하려고 해요. 한 번에 긴 문장으로 말하지 않아도 돼요.',
      facts: [
        '내일 준비할 일을 알고 싶어요.',
        '학생은 선택·AAC·글·말 중 편한 방법을 쓸 수 있어요.',
        'AI가 내 요청을 대신 결정하지는 않아요.',
      ],
    },
    firstAttempt: {
      prompt: '학교 준비 요청을 어떤 조각부터 만들어 볼까요?',
      choices: [
        { id: 'purpose-first', emoji: '🎯', label: '무엇을 도와 달라는지 목적부터 말해요.' },
        { id: 'example-steps', emoji: '🧩', label: '원하는 예시와 순서를 함께 정해요.' },
        { id: 'private-details', emoji: '🔐', label: '개인정보를 자세히 말해요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '내가 쓰기 편한 요청 방법과 첫 조각을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '요청을 만드는 동안 시간과 답의 형태가 달라졌어요.',
      facts: [
        '준비할 시간이 10분뿐이에요.',
        '준비물을 표로 보고 싶어요.',
        '한 번에 한 단계씩 확인하고 싶어요.',
        '체육 수업 준비물 예시를 하나 넣고 싶어요.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '빠진 조각을 묻는 AI',
      text: '목적은 분명해요. 먼저 과목과 꼭 필요한 준비물 한 가지를 알려 주면 짧은 표의 첫 줄부터 함께 만들 수 있어요.',
      question: '어떤 과목의 준비물부터 한 단계씩 확인할까요?',
    },
    artifact: {
      kind: 'visual-plan',
      title: '나의 요청 제작 레시피',
      prompt: '목적, 필요한 정보, 예시, 순서, 원하는 답의 모양을 카드로 정리해 보세요.',
    },
    transfer: {
      title: '주말 준비를 부탁한다면',
      description: '주말에 할 일을 정리해 달라는 요청을 같은 제작 순서로 만들어 봐요.',
      choices: [
        { id: 'purpose-and-time', emoji: '🎯', label: '목적과 사용할 시간을 먼저 말해요.' },
        { id: 'example-and-format', emoji: '📋', label: '예시와 원하는 답의 모양을 정해요.' },
        { id: 'ask-everything', emoji: '🌪️', label: '하고 싶은 말을 한꺼번에 모두 말해요.' },
      ],
    },
    safetyNote: PREPARED_AI_NOTE,
  },
  {
    id: 'm2-repair-dialogue',
    lessonId: 'm2-l10',
    moduleId: 'm2',
    title: 'AI 고쳐 묻기 실험실',
    subtitle: '첫 답과 수정된 답을 비교하고 최종 사용을 판단해요',
    encounter: {
      title: '길고 확실하지 않은 첫 연습 응답',
      description: '“준비물을 알려 줘”라고 했더니 연습용 AI가 근거 없이 여러 과목 준비물을 아주 긴 문장으로 답했어요.',
      facts: [
        '첫 응답은 너무 길어요.',
        '어느 과목인지 분명하지 않아요.',
        '사실인지 확인할 근거가 없어요.',
      ],
    },
    firstAttempt: {
      prompt: '첫 연습 응답을 보고 어떻게 고쳐 물을까요?',
      choices: [
        { id: 'use-as-is', emoji: '📋', label: '답을 그대로 써요.' },
        { id: 'short-and-easy', emoji: '✂️', label: '더 짧고 쉬운 말로 고쳐 달라고 해요.' },
        { id: 'check-or-reject', emoji: '🔍', label: '근거를 확인하거나 사용하지 않아요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '첫 답에서 바꾸고 싶은 점을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '수정 요청에는 읽기 수준과 시간, 사실 확인 조건도 필요해졌어요.',
      facts: [
        '한 줄씩 읽을 수 있는 짧은 답이 필요해요.',
        '수업 시작까지 5분 남았어요.',
        '학교 알림장과 비교해야 해요.',
        '확실하지 않은 내용은 모른다고 표시해야 해요.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '수정 뒤에도 확인을 부탁하는 AI',
      text: '체육복과 운동화를 준비하세요. 물병은 학교 알림장에서 한 번 더 확인해 주세요. 제가 모르는 준비물도 있을 수 있어요.',
      question: '두 번째 응답에서 좋아진 점과 아직 확인할 점은 무엇인가요?',
    },
    artifact: {
      kind: 'repair-card',
      title: '고쳐 묻기 대화 기록',
      prompt: '처음 요청, 첫 연습 응답의 문제, 수정 요청, 두 번째 응답, 최종 판단을 짧게 정리해 보세요.',
    },
    transfer: {
      title: '새로운 AI 답을 받는다면',
      description: '새 AI 답이 짧아졌지만 중요한 조건 하나가 빠졌어요. 어떻게 할까요?',
      choices: [
        { id: 'accept-anyway', emoji: '👍', label: '짧아졌으니 바로 받아들여요.' },
        { id: 'repair-again', emoji: '🔄', label: '빠진 조건을 말하고 다시 고쳐 달라고 해요.' },
        { id: 'reject-and-check', emoji: '🛑', label: '필요하면 사용하지 않고 다른 자료와 확인해요.' },
      ],
    },
    safetyNote: PREPARED_AI_NOTE,
  },
];
