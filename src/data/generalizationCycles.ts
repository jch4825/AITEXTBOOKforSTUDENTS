import type { JudgmentMainBlock, JudgmentPreviewBlock, ModuleId } from '../types';

export interface GeneralizationCycleContent {
  cycleId: string;
  moduleId: ModuleId;
  preview: JudgmentPreviewBlock;
  main: JudgmentMainBlock;
}

const EXPRESSION_MODES = ['choice', 'aac', 'speech', 'draw'] as const;

export const GENERALIZATION_CYCLES: Record<ModuleId, GeneralizationCycleContent> = {
  m1: {
    cycleId: 'm1-everyday-judgment',
    moduleId: 'm1',
    preview: {
      kind: 'judgment-preview',
      id: 'judgment_preview_m1_l6',
      cycleId: 'm1-everyday-judgment',
      moduleId: 'm1',
      scenario: {
        title: '새로운 기계 앞에서',
        description: '동아리방에 새 기계가 왔어요. 말을 걸면 대답하지만 인터넷이 꺼지면 대답하지 않아요. 처음 본 나는 어떻게 해 볼까요?',
      },
      choices: [
        { id: 'observe', emoji: '🔎', label: '어떤 일을 스스로 하는지 더 살펴봐요' },
        { id: 'ask', emoji: '👩‍🏫', label: '선생님이나 가족에게 함께 물어봐요' },
        { id: 'pause', emoji: '⏸️', label: '잘 모르겠으면 잠깐 멈춰요' },
      ],
      reasonCards: [
        { id: 'clue', emoji: '🧩', label: '보이는 단서를 더 보고 싶어요' },
        { id: 'safety', emoji: '🛡️', label: '안전하게 확인하고 싶어요' },
        { id: 'unsure', emoji: '🤔', label: '아직 잘 모르겠어요' },
      ],
      expressionModes: [...EXPRESSION_MODES],
      closing: '첫 생각을 저장했어요. 단원 마지막에 조건이 달라진 장면으로 다시 만나요.',
    },
    main: {
      kind: 'judgment-main',
      id: 'judgment_main_m1_l11',
      cycleId: 'm1-everyday-judgment',
      moduleId: 'm1',
      changedScenario: {
        title: '집에 온 새 추천 기계',
        description: '집에 새 기계가 왔어요. 이름표는 없고, 가족은 AI라고 말해요. 인터넷이 꺼진 동안에는 대답이 멈췄고, 인터넷이 켜지자 지난번에 고른 음료를 추천했어요.',
        changedConditions: ['장소가 동아리방에서 집으로 바뀜', '인터넷 연결이 달라짐', '가족의 설명이 추가됨'],
      },
      importantInfo: [
        { id: 'network', emoji: '🌐', label: '인터넷이 꺼지면 대답이 멈춰요' },
        { id: 'memory', emoji: '🥤', label: '지난번 선택을 보고 추천해요' },
        { id: 'label', emoji: '🏷️', label: '이름표가 아직 없어요' },
        { id: 'adult', emoji: '👪', label: '가족이 AI라고 말했어요' },
      ],
      methods: [
        { id: 'observe', emoji: '🔎', label: '어떤 정보를 보고 달라지는지 살펴보기' },
        { id: 'ask', emoji: '👩‍🏫', label: '가족에게 함께 확인하기' },
        { id: 'pause', emoji: '⏸️', label: '모르는 기능은 잠깐 멈추기' },
        { id: 'try', emoji: '💬', label: '다른 말을 해 보고 대답 비교하기' },
      ],
      aiContribution: {
        title: '아이미의 다른 생각',
        text: '이름표만 보고 정하지 말고, 어떤 자료를 보고 대답이 달라지는지 살펴보는 방법도 있어요.',
        alternativeMethodId: 'try',
        question: '인터넷이 꺼졌을 때와 켜졌을 때 무엇이 달라졌나요?',
      },
      finalChoices: [
        { id: 'observe', emoji: '🔎', label: '기능과 단서를 더 살펴봐요' },
        { id: 'ask', emoji: '👪', label: '가족과 함께 확인해요' },
        { id: 'pause', emoji: '⏸️', label: '모르면 잠깐 멈춰요' },
      ],
      reasonCards: [
        { id: 'clue', emoji: '🧩', label: '단서를 비교했어요' },
        { id: 'safety', emoji: '🛡️', label: '안전하게 확인했어요' },
        { id: 'same', emoji: '🔁', label: '처음 생각과 같은 방법이에요' },
      ],
      transfer: {
        title: '새 장면',
        description: '무인 주문기가 지난번 주문을 보고 메뉴를 추천하지만, 오늘은 다른 메뉴가 먹고 싶어요.',
        choices: [
          { id: 'check', emoji: '🔎', label: '추천 이유와 다른 메뉴를 함께 살펴봐요' },
          { id: 'ask', emoji: '👪', label: '옆 사람이나 직원에게 물어봐요' },
          { id: 'stop', emoji: '⏸️', label: '모르면 주문을 잠깐 멈춰요' },
        ],
      },
      expressionModes: [...EXPRESSION_MODES],
    },
  },

  m2: {
    cycleId: 'm2-clear-request',
    moduleId: 'm2',
    preview: {
      kind: 'judgment-preview',
      id: 'judgment_preview_m2_l6',
      cycleId: 'm2-clear-request',
      moduleId: 'm2',
      scenario: {
        title: 'AI가 다르게 써 줬을 때',
        description: '친구 생일 초대장을 써 달라고 했더니 AI가 너무 길고 딱딱하게 써 주었어요. 나는 어떻게 다시 말해 볼까요?',
      },
      choices: [
        { id: 'condition', emoji: '📏', label: '짧고 따뜻한 말로 써 달라고 조건을 넣어요' },
        { id: 'example', emoji: '💡', label: '원하는 예시를 하나 보여 줘요' },
        { id: 'retry', emoji: '🔄', label: '내가 원하는 모양을 다시 말해요' },
      ],
      reasonCards: [
        { id: 'length', emoji: '📏', label: '길이를 바꾸고 싶어요' },
        { id: 'tone', emoji: '🙂', label: '말투를 바꾸고 싶어요' },
        { id: 'example', emoji: '💡', label: '예시를 보여 주고 싶어요' },
      ],
      expressionModes: [...EXPRESSION_MODES],
      closing: '첫 생각을 저장했어요. 단원 마지막에 조건이 달라진 장면으로 다시 만나요.',
    },
    main: {
      kind: 'judgment-main',
      id: 'judgment_main_m2_l11',
      cycleId: 'm2-clear-request',
      moduleId: 'm2',
      changedScenario: {
        title: '동아리 모집 문구를 다시 부탁해요',
        description: '이번에는 친구에게 보내는 초대장이 아니라 학교 동아리 모집 문구를 만들어요. 한 문장으로 짧게 써야 하고, 게시판에 붙일 글이에요.',
        changedConditions: ['받는 사람이 친구에서 여러 학생으로 바뀜', '한 문장으로 짧아짐', '게시판에 붙이는 글이 됨'],
      },
      importantInfo: [
        { id: 'audience', emoji: '👥', label: '여러 학생이 읽어요' },
        { id: 'length', emoji: '📏', label: '한 문장만 필요해요' },
        { id: 'place', emoji: '📌', label: '게시판에 붙여요' },
        { id: 'tone', emoji: '🙂', label: '친절한 말투가 좋아요' },
      ],
      methods: [
        { id: 'condition', emoji: '📏', label: '길이와 대상을 조건으로 말하기' },
        { id: 'example', emoji: '💡', label: '원하는 예시를 보여 주기' },
        { id: 'retry', emoji: '🔄', label: '빠진 조건을 넣어 다시 묻기' },
        { id: 'step', emoji: '1️⃣', label: '한 단계씩 부탁하기' },
      ],
      aiContribution: {
        title: '아이미의 다른 생각',
        text: '누가 읽는지, 몇 문장인지, 어디에 붙일지를 한 번에 알려 주면 원하는 글에 더 가까워져요.',
        alternativeMethodId: 'condition',
        question: '읽는 사람과 글의 길이를 말했나요?',
      },
      finalChoices: [
        { id: 'condition', emoji: '📏', label: '대상과 길이를 먼저 말해요' },
        { id: 'example', emoji: '💡', label: '예시를 보여 주고 부탁해요' },
        { id: 'retry', emoji: '🔄', label: '빠진 조건을 넣어 다시 물어요' },
      ],
      reasonCards: [
        { id: 'clear', emoji: '📌', label: '조건을 더 분명히 했어요' },
        { id: 'example', emoji: '💡', label: '예시가 도움이 됐어요' },
        { id: 'same', emoji: '🔁', label: '처음 방법을 유지했어요' },
      ],
      transfer: {
        title: '새 장면',
        description: 'AI에게 급식 안내를 부탁했는데, 친구가 읽기 쉽게 짧은 문장 세 개가 필요해요.',
        choices: [
          { id: 'ask', emoji: '📏', label: '문장 수와 읽는 사람을 말해요' },
          { id: 'example', emoji: '💡', label: '비슷한 안내문 예시를 보여 줘요' },
          { id: 'retry', emoji: '🔄', label: '빠진 조건을 넣어 다시 물어요' },
        ],
      },
      expressionModes: [...EXPRESSION_MODES],
    },
  },

  m3: {
    cycleId: 'm3-study-help',
    moduleId: 'm3',
    preview: {
      kind: 'judgment-preview',
      id: 'judgment_preview_m3_l6',
      cycleId: 'm3-study-help',
      moduleId: 'm3',
      scenario: {
        title: '공부가 막혔을 때',
        description: '수학 문제를 풀다가 막혔어요. AI에게 도움을 받을 수 있다면 어떤 방법을 먼저 써 볼까요?',
      },
      choices: [
        { id: 'hint', emoji: '💡', label: '정답 말고 힌트를 달라고 해요' },
        { id: 'example', emoji: '🧩', label: '비슷한 문제를 한 단계씩 보여 달라고 해요' },
        { id: 'adult', emoji: '👩‍🏫', label: '선생님이나 가족에게 함께 물어봐요' },
      ],
      reasonCards: [
        { id: 'think', emoji: '🧠', label: '내가 먼저 생각하고 싶어요' },
        { id: 'step', emoji: '1️⃣', label: '한 단계씩 보고 싶어요' },
        { id: 'help', emoji: '🙋', label: '도움을 함께 받고 싶어요' },
      ],
      expressionModes: [...EXPRESSION_MODES],
      closing: '첫 생각을 저장했어요. 단원 마지막에 조건이 달라진 장면으로 다시 만나요.',
    },
    main: {
      kind: 'judgment-main',
      id: 'judgment_main_m3_l11',
      cycleId: 'm3-study-help',
      moduleId: 'm3',
      changedScenario: {
        title: '풀이를 설명해야 하는 문제',
        description: '내일 수학 문제 풀이를 설명해야 해요. 계산기는 없고, 지금 시간이 많지 않아요. 답만 받으면 왜 그렇게 되었는지 설명하기 어려워요.',
        changedConditions: ['내일 설명해야 함', '계산기를 사용할 수 없음', '풀이 과정을 말해야 함'],
      },
      importantInfo: [
        { id: 'explain', emoji: '🗣️', label: '풀이 과정을 설명해야 해요' },
        { id: 'tool', emoji: '🧮', label: '계산기가 없어요' },
        { id: 'time', emoji: '⏰', label: '시간이 많지 않아요' },
        { id: 'own', emoji: '🧠', label: '내가 생각한 방법도 있어요' },
      ],
      methods: [
        { id: 'hint', emoji: '💡', label: '정답 대신 힌트를 부탁하기' },
        { id: 'example', emoji: '🧩', label: '비슷한 문제를 한 단계씩 보기' },
        { id: 'adult', emoji: '👩‍🏫', label: '선생님이나 가족과 풀이 확인하기' },
        { id: 'check', emoji: '✅', label: '내 풀이와 AI 설명을 비교하기' },
      ],
      aiContribution: {
        title: '아이미의 다른 생각',
        text: '답만 받기보다 첫 단계의 힌트를 받고, 내가 한 풀이와 비교하는 방법도 있어요.',
        alternativeMethodId: 'check',
        question: '내가 먼저 해 본 과정과 AI의 설명이 같은가요?',
      },
      finalChoices: [
        { id: 'hint', emoji: '💡', label: '힌트를 받아 내가 먼저 풀어요' },
        { id: 'example', emoji: '🧩', label: '한 단계씩 설명을 부탁해요' },
        { id: 'adult', emoji: '👩‍🏫', label: '어른과 풀이를 함께 확인해요' },
      ],
      reasonCards: [
        { id: 'think', emoji: '🧠', label: '내가 먼저 생각했어요' },
        { id: 'explain', emoji: '🗣️', label: '설명할 수 있어야 해요' },
        { id: 'same', emoji: '🔁', label: '처음 방법을 유지했어요' },
      ],
      transfer: {
        title: '새 장면',
        description: '긴 글을 읽고 중요한 한 문장을 찾아야 해요. AI에게 공부 도움을 받을 수 있어요.',
        choices: [
          { id: 'hint', emoji: '💡', label: '중요한 부분을 찾는 힌트를 부탁해요' },
          { id: 'example', emoji: '🧩', label: '한 문장씩 나누어 설명해 달라고 해요' },
          { id: 'adult', emoji: '👩‍🏫', label: '선생님과 내가 찾은 내용을 비교해요' },
        ],
      },
      expressionModes: [...EXPRESSION_MODES],
    },
  },

  m4: {
    cycleId: 'm4-safe-choice',
    moduleId: 'm4',
    preview: {
      kind: 'judgment-preview',
      id: 'judgment_preview_m4_l6',
      cycleId: 'm4-safe-choice',
      moduleId: 'm4',
      scenario: {
        title: '낯선 계정의 부탁',
        description: '학교 이름이 보이는 낯선 계정이 사진을 보내 달라고 해요. 나는 어떤 방법을 먼저 써 볼까요?',
      },
      choices: [
        { id: 'dont-share', emoji: '🛡️', label: '사진을 바로 보내지 않아요' },
        { id: 'adult', emoji: '👩‍🏫', label: '믿을 만한 어른에게 보여 줘요' },
        { id: 'verify', emoji: '🔎', label: '다른 방법으로 진짜인지 확인해요' },
      ],
      reasonCards: [
        { id: 'privacy', emoji: '🔒', label: '내 정보와 사진을 지키고 싶어요' },
        { id: 'help', emoji: '🙋', label: '어른의 도움을 받고 싶어요' },
        { id: 'unsure', emoji: '🤔', label: '진짜인지 모르겠어요' },
      ],
      expressionModes: [...EXPRESSION_MODES],
      closing: '첫 생각을 저장했어요. 단원 마지막에 조건이 달라진 장면으로 다시 만나요.',
    },
    main: {
      kind: 'judgment-main',
      id: 'judgment_main_m4_l11',
      cycleId: 'm4-safe-choice',
      moduleId: 'm4',
      changedScenario: {
        title: '진짜처럼 보이는 메시지',
        description: '친구 이름과 학교 로고가 있는 계정이 방과 후에 사진을 보내 달라는 링크를 보냈어요. 링크를 누르기 전에 무엇을 살펴볼까요?',
        changedConditions: ['친구 이름과 학교 로고가 보임', '방과 후에 연락이 옴', '링크가 함께 있음'],
      },
      importantInfo: [
        { id: 'link', emoji: '🔗', label: '사진을 보내는 링크가 있어요' },
        { id: 'time', emoji: '🌙', label: '방과 후에 연락이 왔어요' },
        { id: 'logo', emoji: '🏫', label: '학교 로고가 보여요' },
        { id: 'adult', emoji: '👩‍🏫', label: '확인할 수 있는 어른이 있어요' },
      ],
      methods: [
        { id: 'dont-share', emoji: '🛡️', label: '사진과 개인정보를 보내지 않기' },
        { id: 'adult', emoji: '👩‍🏫', label: '믿을 만한 어른에게 보여 주기' },
        { id: 'verify', emoji: '🔎', label: '다른 연락 방법으로 확인하기' },
        { id: 'stop', emoji: '⏸️', label: '링크를 누르지 않고 멈추기' },
      ],
      aiContribution: {
        title: '아이미의 다른 생각',
        text: '로고나 이름만 보고 믿지 말고, 링크를 누르기 전에 어른에게 보여 주거나 다른 방법으로 확인할 수 있어요.',
        alternativeMethodId: 'verify',
        question: '사진을 보내기 전에 확인할 수 있는 사람과 방법이 있나요?',
      },
      finalChoices: [
        { id: 'dont-share', emoji: '🛡️', label: '사진을 보내지 않고 멈춰요' },
        { id: 'adult', emoji: '👩‍🏫', label: '어른에게 먼저 보여 줘요' },
        { id: 'verify', emoji: '🔎', label: '다른 방법으로 진짜인지 확인해요' },
      ],
      reasonCards: [
        { id: 'privacy', emoji: '🔒', label: '개인정보를 지키고 싶어요' },
        { id: 'verify', emoji: '🔎', label: '진짜인지 비교했어요' },
        { id: 'same', emoji: '🔁', label: '처음 방법을 유지했어요' },
      ],
      transfer: {
        title: '새 장면',
        description: '배송 안내처럼 보이는 메시지가 비밀번호를 확인해야 한다고 해요.',
        choices: [
          { id: 'stop', emoji: '⏸️', label: '비밀번호를 입력하지 않고 멈춰요' },
          { id: 'adult', emoji: '👩‍🏫', label: '어른에게 메시지를 보여 줘요' },
          { id: 'verify', emoji: '🔎', label: '공식 앱에서 배송을 확인해요' },
        ],
      },
      expressionModes: [...EXPRESSION_MODES],
    },
  },

  m5: {
    cycleId: 'm5-plan-b',
    moduleId: 'm5',
    preview: {
      kind: 'judgment-preview',
      id: 'judgment_preview_m5_l6',
      cycleId: 'm5-plan-b',
      moduleId: 'm5',
      scenario: {
        title: '버스가 늦게 왔을 때',
        description: '약속 장소로 가는 버스가 늦게 오고 있어요. 나는 어떤 방법을 먼저 생각해 볼까요?',
      },
      choices: [
        { id: 'wait', emoji: '🚌', label: '조금 더 기다려요' },
        { id: 'call', emoji: '📱', label: '약속한 사람에게 늦는다고 알려요' },
        { id: 'route', emoji: '🗺️', label: '다른 길이나 버스를 찾아봐요' },
      ],
      reasonCards: [
        { id: 'time', emoji: '⏰', label: '시간을 살펴보고 싶어요' },
        { id: 'help', emoji: '🙋', label: '누군가에게 알려야 해요' },
        { id: 'choice', emoji: '🧭', label: '다른 방법도 비교하고 싶어요' },
      ],
      expressionModes: [...EXPRESSION_MODES],
      closing: '첫 생각을 저장했어요. 단원 마지막에 조건이 달라진 장면으로 다시 만나요.',
    },
    main: {
      kind: 'judgment-main',
      id: 'judgment_main_m5_l12',
      cycleId: 'm5-plan-b',
      moduleId: 'm5',
      changedScenario: {
        title: '약속 시간이 가까워졌어요',
        description: '버스가 20분 늦었고 약속 시간까지 15분 남았어요. 휴대전화 배터리는 얼마 남지 않았고, 지금 혼자 있어요.',
        changedConditions: ['약속까지 15분 남음', '휴대전화 배터리가 적음', '지금 혼자 있음'],
      },
      importantInfo: [
        { id: 'time', emoji: '⏰', label: '약속까지 15분 남았어요' },
        { id: 'battery', emoji: '🔋', label: '휴대전화 배터리가 적어요' },
        { id: 'alone', emoji: '🧍', label: '지금 혼자 있어요' },
        { id: 'route', emoji: '🗺️', label: '다른 길을 알아볼 수 있어요' },
      ],
      methods: [
        { id: 'wait', emoji: '🚌', label: '버스를 조금 더 기다리기' },
        { id: 'call', emoji: '📱', label: '약속한 사람에게 늦는다고 알리기' },
        { id: 'route', emoji: '🗺️', label: '다른 버스나 길을 확인하기' },
        { id: 'adult', emoji: '👩‍🏫', label: '가족이나 어른에게 도움을 요청하기' },
      ],
      aiContribution: {
        title: '아이미의 다른 생각',
        text: '시간과 배터리를 함께 생각하면, 먼저 약속한 사람에게 알리고 안전한 다른 방법을 확인할 수 있어요.',
        alternativeMethodId: 'call',
        question: '혼자 다른 길로 가도 안전한지 확인했나요?',
      },
      finalChoices: [
        { id: 'call', emoji: '📱', label: '약속한 사람에게 먼저 알려요' },
        { id: 'route', emoji: '🗺️', label: '안전한 다른 길을 확인해요' },
        { id: 'adult', emoji: '👩‍🏫', label: '가족이나 어른에게 도움을 요청해요' },
      ],
      reasonCards: [
        { id: 'time', emoji: '⏰', label: '시간을 비교했어요' },
        { id: 'safe', emoji: '🛡️', label: '안전한 방법을 골랐어요' },
        { id: 'same', emoji: '🔁', label: '처음 방법을 유지했어요' },
      ],
      transfer: {
        title: '새 장면',
        description: '평소 가던 길이 공사로 막혔고 약속 시간까지 30분 남았어요.',
        choices: [
          { id: 'call', emoji: '📱', label: '약속한 사람에게 상황을 알려요' },
          { id: 'route', emoji: '🗺️', label: '안전한 다른 길을 확인해요' },
          { id: 'adult', emoji: '👩‍🏫', label: '어른에게 함께 방법을 물어봐요' },
        ],
      },
      expressionModes: [...EXPRESSION_MODES],
    },
  },

  m6: {
    cycleId: 'm6-daily-alternative',
    moduleId: 'm6',
    preview: {
      kind: 'judgment-preview',
      id: 'judgment_preview_m6_l6',
      cycleId: 'm6-daily-alternative',
      moduleId: 'm6',
      scenario: {
        title: '원하는 물건이 품절됐을 때',
        description: '사고 싶었던 물건이 가게에 없어요. 나는 어떤 방법을 먼저 생각해 볼까요?',
      },
      choices: [
        { id: 'alternative', emoji: '🔁', label: '다른 물건을 찾아봐요' },
        { id: 'ask', emoji: '🙋', label: '직원에게 다른 방법을 물어봐요' },
        { id: 'wait', emoji: '⏳', label: '다음에 다시 살 수 있는지 기다려요' },
      ],
      reasonCards: [
        { id: 'need', emoji: '🎯', label: '꼭 필요한지 생각해요' },
        { id: 'help', emoji: '🙋', label: '도움을 부탁하고 싶어요' },
        { id: 'time', emoji: '⏰', label: '언제 필요한지 생각해요' },
      ],
      expressionModes: [...EXPRESSION_MODES],
      closing: '첫 생각을 저장했어요. 단원 마지막에 조건이 달라진 장면으로 다시 만나요.',
    },
    main: {
      kind: 'judgment-main',
      id: 'judgment_main_m6_l12',
      cycleId: 'm6-daily-alternative',
      moduleId: 'm6',
      changedScenario: {
        title: '오늘 꼭 필요한 선물',
        description: '오늘 친구에게 줄 선물이 필요한데 원하는 물건이 품절됐어요. 예산은 정해져 있고, 직원은 다른 손님을 돕고 있어요.',
        changedConditions: ['오늘 꼭 필요함', '예산이 정해짐', '직원이 바쁨'],
      },
      importantInfo: [
        { id: 'today', emoji: '⏰', label: '오늘 선물이 필요해요' },
        { id: 'budget', emoji: '💰', label: '예산이 정해져 있어요' },
        { id: 'staff', emoji: '🙋', label: '직원이 다른 손님을 돕고 있어요' },
        { id: 'alternative', emoji: '🔁', label: '비슷한 물건이 있을 수 있어요' },
      ],
      methods: [
        { id: 'alternative', emoji: '🔁', label: '예산 안에서 다른 물건 찾기' },
        { id: 'ask', emoji: '🙋', label: '직원에게 재고나 다른 방법 묻기' },
        { id: 'wait', emoji: '⏳', label: '재입고 시기를 확인하고 기다리기' },
        { id: 'compare', emoji: '🔎', label: '비슷한 물건의 차이 비교하기' },
      ],
      aiContribution: {
        title: '아이미의 다른 생각',
        text: '오늘 필요한지와 예산을 먼저 생각하고, 비슷한 물건의 차이를 비교하거나 직원에게 짧게 물어볼 수 있어요.',
        alternativeMethodId: 'compare',
        question: '예산과 필요한 날짜를 모두 생각했나요?',
      },
      finalChoices: [
        { id: 'alternative', emoji: '🔁', label: '예산 안에서 다른 물건을 찾아요' },
        { id: 'ask', emoji: '🙋', label: '직원에게 짧게 물어봐요' },
        { id: 'wait', emoji: '⏳', label: '재입고 시기를 확인해요' },
      ],
      reasonCards: [
        { id: 'budget', emoji: '💰', label: '예산을 생각했어요' },
        { id: 'need', emoji: '🎯', label: '필요한 날짜를 생각했어요' },
        { id: 'same', emoji: '🔁', label: '처음 방법을 유지했어요' },
      ],
      transfer: {
        title: '새 장면',
        description: '무인 주문기에서 고르려던 메뉴가 품절됐고, 다른 메뉴 두 개가 남아 있어요.',
        choices: [
          { id: 'alternative', emoji: '🔁', label: '예산과 비슷한 메뉴를 비교해요' },
          { id: 'ask', emoji: '🙋', label: '직원에게 다른 메뉴를 물어봐요' },
          { id: 'wait', emoji: '⏳', label: '주문을 잠깐 멈추고 다시 생각해요' },
        ],
      },
      expressionModes: [...EXPRESSION_MODES],
    },
  },
};
