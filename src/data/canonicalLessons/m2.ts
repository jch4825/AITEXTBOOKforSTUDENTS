import type { CanonicalLessonDesign } from './types';
import { STANDARD_CODES } from './shared';

export const M2_CANONICAL_LESSONS: CanonicalLessonDesign[] = [
  // ============================================================
  // m2-l1 플래그십: 빠진 정보를 찾아요
  // ============================================================
  {
    lessonId: 'm2-l1',
    moduleId: 'm2',
    number: 1,
    role: 'flagship',
    title: '빠진 정보를 찾아요',
    masterObjective: '오늘은 AI가 다르게 알아들은 요청에서 빠진 정보를 찾아 안전하게 더해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['좋은 요청은 목적·대상·필요한 조건을 포함하며 불필요한 개인정보는 넣지 않는다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '체험회 안내 요청에서 빠진 정보를 찾아 구체화하기',
      mismatch: '윤아가 "내일 안내 알려 줘"라고 하자 다른 행사의 모호한 안내를 보여 줌',
      evidence: ['행사 일정표', '빠진 조건 카드'],
      resolution: '날짜와 대상 조건을 추가하여 원하는 안내문을 얻음',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '다르게 알아들은 첫 대화',
        instruction: '윤아가 "내일 안내 알려 줘"라고 하자 아이미가 엉뚱한 행사 정보를 가져왔어요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '아이미가 다르게 알아들은 이유를 골라보세요.',
          choices: [
            { id: 'missing-info', label: '어떤 행사인지 대상과 내용이 빠져서 모호했어요', emoji: '❓' },
          ],
        },
        assetIds: ['m2-l1-story-01', 'm2-l1-story-02'],
        support: {},
      },
      {
        id: 's2-condition-change',
        phase: 'condition-change',
        title: '빠진 조건 퍼즐 채우기',
        instruction: '행사 일정표를 보고 요청에 필요한 조건들을 채워보세요.',
        activity: {
          id: 'act-s2',
          kind: 'build',
          prompt: '요청문 퍼즐 슬롯에 필요한 조건 카드만 골라 담으세요.',
          slots: [
            { id: 'target', label: '행사 대상' },
            { id: 'topic', label: '안내 목적' },
          ],
          pieces: [
            { id: 'p1', label: '학교 AI 체험회', slotId: 'target' },
            { id: 'p2', label: '준비물 및 시간표', slotId: 'topic' },
          ],
        },
        assetIds: ['m2-l1-story-03'],
        support: {},
      },
      {
        id: 's3-compare',
        phase: 'compare',
        title: '개선된 결과 비교하기',
        instruction: '조건을 보완한 뒤 새로 얻은 답을 원본 공지와 대조해봅시다.',
        activity: {
          id: 'act-s3',
          kind: 'compare',
          prompt: '첫 번째 답과 두 번째 개선본 결과를 비교해보세요.',
          left: { title: '첫 대화 결과', content: '전국 과학 축전 안내... (원하지 않음)' },
          right: { title: '조건 보완 결과', content: '학교 AI 체험회 준비물 안내 (원함)' },
          criteria: [{ id: 'match', label: '원하던 행사 안내와 일치하는가' }],
        },
        assetIds: ['m2-l1-story-04'],
        support: {},
      },
      {
        id: 's4-decision',
        phase: 'decision',
        title: '안전한 조건 추가 원칙',
        instruction: '요청을 고칠 때 꼭 기억할 점은 무엇인가요?',
        activity: {
          id: 'act-s4',
          kind: 'single-choice',
          prompt: '요청에 더할 정보로 알맞은 것은?',
          choices: [
            { id: 'safe-info', label: '행사 이름과 시간 등 필요한 조건만 넣고 개인정보는 뺍니다', emoji: '🔒' },
          ],
        },
        assetIds: ['m2-l1-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm2-l1-artifact',
      title: '요청 수정 카드',
      portfolioLabel: '빠진 조건을 보완한 요청 개선 카드',
      fields: [
        { id: 'improvedPrompt', label: '빠진 정보를 더해 수정한 요청문', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '분실물 요청에 적용',
      scenario: '이름 모르는 물건을 AI에게 물어볼 때 어떻게 부탁해야 할까요?',
      activity: {
        id: 'act-transfer-m2-l1',
        kind: 'single-choice',
        prompt: '분실물을 질문할 때 알맞은 구체적 요청은?',
        choices: [
          { id: 'detail-pick', label: '물건의 색상, 모양, 발견 장소를 구체적으로 적어서 물어봐요', emoji: '🔍' },
        ],
      },
    },
    assets: [
      { id: 'm2-l1-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l1-story-01.webp', alt: '모호한 첫 질문', required: true, purpose: '스토리 컷 1' },
      { id: 'm2-l1-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l1-story-02.webp', alt: '엉뚱한 결과', required: true, purpose: '스토리 컷 2' },
      { id: 'm2-l1-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l1-story-03.webp', alt: '빠진 조건 퍼즐', required: true, purpose: '스토리 컷 3' },
      { id: 'm2-l1-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l1-story-04.webp', alt: '완성된 결과', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '좋은 요청은 목적과 필요한 구체적 조건을 명확히 포함해야 합니다.',
  },

  // ============================================================
  // m2-l2 안내 연습: 한 번에 한 가지 부탁
  // ============================================================
  {
    lessonId: 'm2-l2',
    moduleId: 'm2',
    number: 2,
    role: 'guided',
    title: '한 번에 한 가지 부탁',
    masterObjective: '오늘은 여러 부탁이 섞인 문장을 목적별로 나누어 두 번에 걸쳐 요청해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['짧음 자체가 아니라 한 대화 단계에서 목적을 분명히 하는 것이 중요하다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'aimi'],
      location: '동아리방',
      purpose: '안내문, 간식, 음악 세 가지가 뒤엉킨 복잡한 요청 나누기',
      mismatch: '한꺼번에 3가지를 물어보아 결과가 섞여서 이상함',
      evidence: ['복잡한 요청 리본', '분할된 요청 카드'],
      resolution: '한 번에 하나씩 개별 대화로 나누어 깔끔한 결과를 얻음',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '뒤엉킨 대화 정리하기',
        instruction: '진우의 긴 요청에서 부탁 3가지를 찾아 나누어봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'sort',
          prompt: '뒤엉킨 문장에서 목적별 부탁을 분리해보세요.',
          bins: [
            { id: 'req1', label: '1차 요청 (안내문)', emoji: '📄' },
            { id: 'req2', label: '2차 요청 (간식 목록)', emoji: '🍪' },
          ],
          cards: [
            { id: 'c1', label: '체험회 안내 문장 만들기', binId: 'req1' },
            { id: 'c2', label: '학생들이 좋아하는 간식 추천하기', binId: 'req2' },
          ],
        },
        assetIds: ['m2-l2-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '목적별 대화 분할',
        instruction: '한 단계 대화에서 하나의 목적을 명확히 하면 결과가 훨씬 명확해집니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '여러 부탁을 할 때 가장 좋은 방법은?',
          choices: [
            { id: 'split-step', label: '첫 번째 부탁의 답을 확인한 뒤 두 번째 부탁을 이어해요', emoji: '💬' },
          ],
        },
        assetIds: ['m2-l2-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm2-l2-artifact',
      title: '분할된 요청서',
      portfolioLabel: '목적별로 나눈 대화 분할 기록',
      fields: [
        { id: 'splitRequest1', label: '첫 번째로 보낼 목적별 요청', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '숙제 준비 요청 나누기',
      scenario: '준비물, 숙제 주제, 발표 대본을 모두 물어보고 싶을 때 어떻게 할까요?',
      activity: {
        id: 'act-transfer-m2-l2',
        kind: 'single-choice',
        prompt: '세 가지 질문을 진행하는 순서는?',
        choices: [
          { id: 'one-by-one', label: '준비물부터 하나씩 물어보고 순서대로 진행해요', emoji: '1️⃣' },
        ],
      },
    },
    assets: [
      { id: 'm2-l2-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l2-story-01.webp', alt: '뒤엉킨 대화', required: true, purpose: '스토리 컷 1' },
      { id: 'm2-l2-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l2-story-02.webp', alt: '정리된 두 대화', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '한 번에 하나의 목적만 분명히 요청하면 훨씬 명확한 답을 얻을 수 있습니다.',
  },

  // ============================================================
  // m2-l3 안내 연습: 대상을 정확히 말해요
  // ============================================================
  {
    lessonId: 'm2-l3',
    moduleId: 'm2',
    number: 3,
    role: 'guided',
    title: '대상을 정확히 말해요',
    masterObjective: '오늘은 `그거`, `아무거나` 대신 이름·종류·개수를 넣고 결과가 달라지는지 비교해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['구체적인 대상과 조건은 원하는 결과의 범위를 좁힌다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '체험회 놀이 추천 요청을 구체적인 대상으로 다듬기',
      mismatch: '"아무거나 추천해 줘"라고 하자 고등학생용 놀이가 추천됨',
      evidence: ['모호한 질문 결과', '구체 조건 추가 결과'],
      resolution: '대상(초등학생), 인원(4명), 시간(10분)을 구체적으로 넣어 원하던 결과를 얻음',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '모호한 표현의 결과',
        instruction: '윤아가 "아무거나 알려 줘"라고 했을 때 어떤 문제가 생겼나요?',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '모호한 표현의 단점을 골라보세요.',
          choices: [
            { id: 'too-broad', label: '범위가 너무 넓어서 생각과 전혀 다른 결과가 나와요', emoji: '😮' },
          ],
        },
        assetIds: ['m2-l3-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '이름·종류·개수 더하기',
        instruction: '원하는 대상과 구체적 수치를 넣으면 알맞은 범위의 답을 해줍니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '구체적인 조건을 포함해 요청을 수정해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'c-specific', label: '초등학생 4명이 10분 동안 할 놀이 추천해 줘', emoji: '🎯' },
          ],
        },
        assetIds: ['m2-l3-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm2-l3-artifact',
      title: '전후 요청 체크표',
      portfolioLabel: '모호한 질문과 구체적 질문 대조표',
      fields: [
        { id: 'specificPrompt', label: '대상을 정확히 넣어 고쳐 쓴 요청문', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '간식 추천 요청 구체화',
      scenario: '친구들과 먹을 간식을 물어볼 때 모호하지 않게 말하는 방법은?',
      activity: {
        id: 'act-transfer-m2-l3',
        kind: 'single-choice',
        prompt: '구체적 간식 추천 요청으로 알맞은 것은?',
        choices: [
          { id: 'snack-detail', label: '3명이서 먹을 매운맛 없는 과자 2가지 추천해 줘', emoji: '🥨' },
        ],
      },
    },
    assets: [
      { id: 'm2-l3-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l3-story-01.webp', alt: '맞지 않는 놀이 결과', required: true, purpose: '스토리 컷 1' },
      { id: 'm2-l3-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l3-story-02.webp', alt: '조건에 맞는 놀이 결과', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '대상의 이름, 종류, 수량을 정확히 말하면 원하는 결과에 가까워집니다.',
  },

  // ============================================================
  // m2-l4 안내 연습: 좋은 예시를 보여 줘요
  // ============================================================
  {
    lessonId: 'm2-l4',
    moduleId: 'm2',
    number: 4,
    role: 'guided',
    title: '좋은 예시를 보여 줘요',
    masterObjective: '오늘은 원하는 답의 예시를 하나 만들고 예시 전후 결과를 비교해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['예시는 결과의 모양을 알려주지만 틀린 예시는 오류를 이끌 수 있다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'minjun', 'aimi'],
      location: '동아리방',
      purpose: '안내 문구 형식을 예시 한 줄과 함께 요청하여 정확한 모양 얻기',
      mismatch: '말로만 설명했더니 어색한 포맷으로 작성됨',
      evidence: ['예시 없는 결과', '좋은 예시 추가 결과', '틀린 예시 결과'],
      resolution: '정확한 한 줄 예시를 추가하여 원하는 모양의 결과를 받음',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '예시 유무에 따른 결과',
        instruction: '원하는 답의 모양 예시를 함께 전달했을 때 결과를 관찰해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'compare',
          prompt: '예시가 없을 때와 좋은 예시를 줬을 때의 결과를 비교하세요.',
          left: { title: '예시 없이 설명만 줌', content: '길고 장황한 텍스트로 응답함' },
          right: { title: '한 줄 예시 함께 줌 (예: [시간] - [할일])', content: '09:00 - 체험회 시작 (원하는 포맷)' },
          criteria: [{ id: 'format', label: '원하던 출력 포맷과 일치하는가' }],
        },
        assetIds: ['m2-l4-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '나만의 좋은 예시 작성',
        instruction: '내가 원하는 답의 한 줄 예시를 명확하게 작성해보세요.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '좋은 예시 문장을 하나 만들어보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'ex1', label: '예시: [장소] 3층 강당 - [일시] 5월 10일', emoji: '📝' },
          ],
        },
        assetIds: ['m2-l4-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm2-l4-artifact',
      title: '좋은 예시 기록',
      portfolioLabel: '원하는 답변 모양을 보여준 예시 작성표',
      fields: [
        { id: 'myExample', label: '내가 쓴 좋은 한 줄 예시', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '퀴즈 문제 양식 예시',
      scenario: 'AI에게 퀴즈 문제 3개를 만들어달라고 할 때 양식 예시를 제공해봐요.',
      activity: {
        id: 'act-transfer-m2-l4',
        kind: 'single-choice',
        prompt: '퀴즈 포맷을 위한 올바른 예시 포함 요청은?',
        choices: [
          { id: 'quiz-ex', label: '문제: ~ / 정답: ~ 형식 예시처럼 3개 만들어 줘', emoji: '❓' },
        ],
      },
    },
    assets: [
      { id: 'm2-l4-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l4-story-01.webp', alt: '세 결과 비교 칠판', required: true, purpose: '스토리 컷 1' },
      { id: 'm2-l4-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l4-story-02.webp', alt: '좋은 예시 완성', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '원하는 답의 예시를 보여주면 생각했던 모양과 포맷으로 결과를 받을 수 있습니다.',
  },

  // ============================================================
  // m2-l5 안내 연습: 누구에게 보여 줄 답인지 말해요
  // ============================================================
  {
    lessonId: 'm2-l5',
    moduleId: 'm2',
    number: 5,
    role: 'guided',
    title: '누구에게 보여 줄 답인지 말해요',
    masterObjective: '오늘은 답을 볼 사람과 원하는 말투를 넣고 내용의 정확성은 따로 확인해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['역할과 말투를 정하면 표현은 바뀌지만, 내용이 맞는지는 따로 확인해야 한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'aimi'],
      location: '동아리방',
      purpose: '어린 동생용과 학부모용 두 안내문의 말투와 대상 지정하기',
      mismatch: '똑같은 말투의 안내문으로는 읽는 이에 맞지 않음',
      evidence: ['동생용 쉬운 말투 안내문', '학부모용 정중한 안내문'],
      resolution: '독자를 지정하여 알맞은 말투를 적용하고 내용은 따로 사실 확인을 거침',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '읽는 사람에 따른 말투 변화',
        instruction: '어린 동생과 학부모님에게 보낼 안내문은 각각 어떤 말투가 좋을까요?',
        activity: {
          id: 'act-s1',
          kind: 'sort',
          prompt: '각 독자 카드와 어울리는 말투 카드를 짝지어보세요.',
          bins: [
            { id: 'kids', label: '어린 동생들', emoji: '👶' },
            { id: 'parents', label: '학부모님', emoji: '👨‍👩‍👧' },
          ],
          cards: [
            { id: 'c-friendly', label: '쉬운 낱말과 친근한 말투 (~해요)', binId: 'kids' },
            { id: 'c-polite', label: '정중하고 정돈된 말투 (~하십니다)', binId: 'parents' },
          ],
        },
        assetIds: ['m2-l5-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '말투와 내용의 독립성',
        instruction: '역할이나 말투를 바꾼다고 해서 내용이 저절로 맞아지는 것은 아닙니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '전문가 역할을 지정했을 때 기억할 사실은 무엇인가요?',
          choices: [
            { id: 'check-fact-anyway', label: '말투만 그럴듯해질 뿐 사실은 사람이 따로 확인해야 해요', emoji: '💡' },
          ],
        },
        assetIds: ['m2-l5-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm2-l5-artifact',
      title: '읽을 사람별 안내 글 2종',
      portfolioLabel: '읽는 이를 지정한 맞춤 말투 안내서',
      fields: [
        { id: 'audiencePrompt', label: '읽을 사람을 정해 고친 안내 글', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '동아리 발표 소개 대본',
      scenario: '친구들 앞에서 발표할 때 어울리는 독자 및 말투 지정 방법은?',
      activity: {
        id: 'act-transfer-m2-l5',
        kind: 'single-choice',
        prompt: '친구들 발표용 대본을 위한 요청 표현은?',
        choices: [
          { id: 'friend-tone', label: '초등학생 친구들이 쉽게 이해할 재미있는 말투로 써 줘', emoji: '🗣️' },
        ],
      },
    },
    assets: [
      { id: 'm2-l5-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l5-story-01.webp', alt: '서로 다른 독자 생각', required: true, purpose: '스토리 컷 1' },
      { id: 'm2-l5-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l5-story-02.webp', alt: '두 안내문 대조', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '답을 읽을 독자와 말투를 지정하면 알맞은 표현으로 써주지만, 내용은 사람이 따로 점검해야 합니다.',
  },

  // ============================================================
  // m2-l6 플래그십: 요청 공동 제작소
  // ============================================================
  {
    lessonId: 'm2-l6',
    moduleId: 'm2',
    number: 6,
    role: 'flagship',
    title: '요청 공동 제작소',
    masterObjective: '오늘은 큰 요청을 작은 단계로 나누고 앞 단계 결과를 다음 요청에 이어 써 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['복잡한 과제는 목적 확인->재료 모으기->초안->검토처럼 단계화할 수 있다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'aimi'],
      location: '동아리방',
      purpose: '체험회 준비 목록을 한 번에 다 하지 않고 3단계 대화로 나누어 완성하기',
      mismatch: '큰 과제를 한 번에 시도하다 빠진 항목 발생',
      evidence: ['장소도', '필요 물품 카드', '단계별 요청 레시피'],
      resolution: '앞 단계의 결과를 다음 단계 질문에 잇는 단계별 대화로 완벽하게 조립함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '막연한 큰 요청의 문제',
        instruction: '체험회 준비 전체를 한꺼번에 다 해달라고 하자 중요한 설치 단계가 빠졌어요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '복잡한 일을 한번에 부탁할 때의 문제를 골라보세요.',
          choices: [
            { id: 'skip-item', label: '양이 너무 많아 중요한 중간 항목을 빠뜨려요', emoji: '⚠️' },
          ],
        },
        assetIds: ['m2-l6-story-01'],
        support: {},
      },
      {
        id: 's2-condition-change',
        phase: 'condition-change',
        title: '3단계로 나누어 요청하기',
        instruction: '장소 확인 -> 필요 물품 -> 시간표 작성 순서로 대화를 나눠봅시다.',
        activity: {
          id: 'act-s2',
          kind: 'sequence',
          prompt: '단계별 요청 레시피를 순서대로 배열해보세요.',
          items: [
            { id: 'step1', label: '1단계: 장소에 필요한 기본 조건 물어보기', correctOrder: 1 },
            { id: 'step2', label: '2단계: 1단계 장소에 맞춘 필수 준비물 목록 만들기', correctOrder: 2 },
            { id: 'step3', label: '3단계: 준비물을 보고 마지막 시간표 만들기', correctOrder: 3 },
          ],
        },
        assetIds: ['m2-l6-story-02', 'm2-l6-story-03'],
        support: {},
      },
      {
        id: 's3-compare',
        phase: 'compare',
        title: '앞 단계 결과를 다음 단계에 연결',
        instruction: '1단계에서 얻은 "3층 강당" 결과를 2단계 질문에 이어 작성해보세요.',
        activity: {
          id: 'act-s3',
          kind: 'build',
          prompt: '앞 단계 결과를 다음 요청 슬롯에 연결하세요.',
          slots: [{ id: 'next-input', label: '2단계 요청에 이어붙일 1단계 결과' }],
          pieces: [{ id: 'p-place', label: '3층 강당 공간 정보', slotId: 'next-input' }],
        },
        assetIds: ['m2-l6-story-03'],
        support: {},
      },
      {
        id: 's4-decision',
        phase: 'decision',
        title: '단계별 대화 완수',
        instruction: '단계별 대화로 만들어낸 최종 체험회 준비표를 검토하세요.',
        activity: {
          id: 'act-s4',
          kind: 'single-choice',
          prompt: '단계별 대화로 완성한 결과물의 장점은?',
          choices: [
            { id: 'accurate-build', label: '중간 결과를 확인하며 빠짐없이 정확히 완성할 수 있어요', emoji: '🧩' },
          ],
        },
        assetIds: ['m2-l6-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm2-l6-artifact',
      title: '단계별 요청 기록',
      portfolioLabel: '단계별 대화와 결과가 이어진 제작 기록',
      fields: [
        { id: 'recipeChain', label: '1~3단계로 나누어 완성한 요청 레시피', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '주말 행사 준비 분할',
      scenario: '주말 야외 행사를 준비할 때 3단계 나누기 방법을 적용해봐요.',
      activity: {
        id: 'act-transfer-m2-l6',
        kind: 'single-choice',
        prompt: '야외 행사 준비를 단계별로 나누는 첫 번째 질문은?',
        choices: [
          { id: 'weather-first', label: '1단계로 행사 당일 날씨와 장소 조건부터 확인해요', emoji: '🌤️' },
        ],
      },
    },
    assets: [
      { id: 'm2-l6-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l6-story-01.webp', alt: '막연한 요청', required: true, purpose: '스토리 컷 1' },
      { id: 'm2-l6-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l6-story-02.webp', alt: '자료 수집', required: true, purpose: '스토리 컷 2' },
      { id: 'm2-l6-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l6-story-03.webp', alt: '단계별 제작', required: true, purpose: '스토리 컷 3' },
      { id: 'm2-l6-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l6-story-04.webp', alt: '완성표', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '큰 작업은 목적 확인 -> 재료 모으기 -> 단계별 작성으로 나누어 요청하면 훨씬 깔끔합니다.',
  },

  // ============================================================
  // m2-l7 안내 연습: 부족한 점을 다시 말해요
  // ============================================================
  {
    lessonId: 'm2-l7',
    moduleId: 'm2',
    number: 7,
    role: 'guided',
    title: '부족한 점을 다시 말해요',
    masterObjective: '오늘은 첫 답에서 부족한 점을 찾아 중요한 사실을 지키며 다시 요청해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['반복 개선은 `마음에 안 들어`가 아니라 기준과 부족한 점을 구체적으로 말하는 과정이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'aimi'],
      location: '동아리방',
      purpose: '첫 안내문에서 장소 정보가 누락된 것을 찾아 사실을 지키며 재요청하기',
      mismatch: '"더 쉽게 써줘"라고만 했더니 장소와 시간이 완전히 사라짐',
      evidence: ['1차 답', '유지할 사실 잠금 카드', '2차 개정 답'],
      resolution: '유지할 중요한 사실(장소)을 잠그고 고칠 점만 명확히 재요청함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '단순 재요청의 오해',
        instruction: '진우가 "더 쉽게 해줘"라고만 다시 말하자 중요한 장소 정보가 지워졌어요.',
        activity: {
          id: 'act-s1',
          kind: 'compare',
          prompt: '1차 답과 2차 답을 대조하고 지워진 중요한 사실을 찾아보세요.',
          left: { title: '1차 답', content: '일시: 5월 10일 / 장소: 3층 강당 / 내용: 로봇 체험' },
          right: { title: '2차 답 (단순 재요청)', content: '쉬운 내용: 5월 10일에 로봇 놀이해요!' },
          criteria: [{ id: 'keep-fact', label: '장소 정보가 유지되었는가' }],
        },
        assetIds: ['m2-l7-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '유지할 사실을 지키며 고치기',
        instruction: '재요청할 때는 지켜야 할 정확한 사실(장소, 시간)을 자물쇠로 고정해 전달합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '중요 사실을 지키는 올바른 재요청 문장을 완성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'lock-fact', label: '장소(3층 강당)는 꼭 남겨두고 문장만 더 쉽게 고쳐 줘', emoji: '🔒' },
          ],
        },
        assetIds: ['m2-l7-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm2-l7-artifact',
      title: '수정 기준표',
      portfolioLabel: '유지할 사실과 수정할 기준이 담긴 diff 기록',
      fields: [
        { id: 'refinePrompt', label: '중요한 사실을 지켜 다시 물은 말', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '그림 설명 재요청',
      scenario: 'AI가 만든 포스터 그림에서 제목 글씨 위치만 바꾸고 싶을 때 재요청 방법은?',
      activity: {
        id: 'act-transfer-m2-l7',
        kind: 'single-choice',
        prompt: '그림의 다른 부분은 유지하고 한 곳만 고치는 올바른 재요청은?',
        choices: [
          { id: 'keep-img', label: '그림 바탕과 캐릭터는 그대로 두고 제목 글씨 위치만 위로 올려 줘', emoji: '🖼️' },
        ],
      },
    },
    assets: [
      { id: 'm2-l7-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l7-story-01.webp', alt: '빠진 정보가 있는 안내', required: true, purpose: '스토리 컷 1' },
      { id: 'm2-l7-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l7-story-02.webp', alt: '사실을 지킨 개선본', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '다시 요청할 때는 유지해야 할 소중한 사실을 꼭 지정해 함께 전달해야 합니다.',
  },

  // ============================================================
  // m2-l8 안내 연습: 답의 모양을 정해요
  // ============================================================
  {
    lessonId: 'm2-l8',
    moduleId: 'm2',
    number: 8,
    role: 'guided',
    title: '답의 모양을 정해요',
    masterObjective: '오늘은 할 일에 맞는 표·번호 목록·한 문장 형식을 고르고 결과가 형식을 지켰는지 확인해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['답의 모양은 목적에 맞게 고르며 짧음만이 좋은 답의 기준은 아니다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '시간표, 설치 순서, 홍보문 3가지 과제에 어울리는 모양(표/목록/한문장) 지정하기',
      mismatch: '모든 결과가 길고 빽빽한 줄글 문단으로 나와서 보기 불편함',
      evidence: ['긴 줄글 응답', '표/목록/문장 변환 예시'],
      resolution: '과제 특성에 맞춰 표, 번호 목록, 한 문장 모양을 정해 깔끔하게 만듦',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '과제에 맞는 모양 매칭',
        instruction: '시간표, 순서, 홍보문은 각각 어떤 답의 모양이 가장 보기 좋을까요?',
        activity: {
          id: 'act-s1',
          kind: 'sort',
          prompt: '각 과제에 가장 어울리는 답의 모양을 연결해보세요.',
          bins: [
            { id: 'table', label: '표 형식', emoji: '📊' },
            { id: 'list', label: '번호 목록 형식', emoji: '🔢' },
            { id: 'one-line', label: '한 문장 요약 형식', emoji: '💬' },
          ],
          cards: [
            { id: 'c-schedule', label: '체험회 시간표 안내', binId: 'table' },
            { id: 'c-steps', label: '부스 설치 작업 순서', binId: 'list' },
            { id: 'c-slogan', label: '포스터에 넣을 한 줄 홍보문', binId: 'one-line' },
          ],
        },
        assetIds: ['m2-l8-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '형식 지킴 여부 확인',
        instruction: 'AI 결과가 내가 요청한 표나 번호 목록 형식을 잘 지켰는지 검토합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '순서 안내 결과를 검토할 때 체크할 점은?',
          choices: [
            { id: 'check-num-list', label: '1, 2, 3 번호 목록으로 순서대로 깔끔히 정리되었는지 확인해요', emoji: '✅' },
          ],
        },
        assetIds: ['m2-l8-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm2-l8-artifact',
      title: '형식 체크 결과물',
      portfolioLabel: '과제별 맞춤 답의 모양 지정 기록',
      fields: [
        { id: 'formatChoice', label: '내 과제에 선택한 답의 모양과 이유', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '준비물 목록 정리',
      scenario: '체험회에 가져갈 준비물 5가지를 보기 좋게 출력하고 싶을 때 선택할 형식은?',
      activity: {
        id: 'act-transfer-m2-l8',
        kind: 'single-choice',
        prompt: '준비물 정리용 알맞은 답의 모양은?',
        choices: [
          { id: 'check-list', label: '체크박스 기호가 있는 번호 목록으로 출력해 줘', emoji: '☑️' },
        ],
      },
    },
    assets: [
      { id: 'm2-l8-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l8-story-01.webp', alt: '긴 문단에 곤란한 윤아', required: true, purpose: '스토리 컷 1' },
      { id: 'm2-l8-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l8-story-02.webp', alt: '세 형식 정리 결과', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '표, 번호 목록, 한 문장 등 목적에 맞는 답의 모양을 함께 지정하면 훨씬 읽기 쉽습니다.',
  },

  // ============================================================
  // m2-l9 안내 연습: 다시 묻기와 확인하기는 달라요
  // ============================================================
  {
    lessonId: 'm2-l9',
    moduleId: 'm2',
    number: 9,
    role: 'guided',
    title: '다시 묻기와 확인하기는 달라요',
    masterObjective: '오늘은 AI 답의 주장 하나를 골라 학교 공지나 믿을 수 있는 자료와 비교해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['같은 AI에게 `정말이야?`라고 묻는 것은 다른 자료로 확인한 것이 아니다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'minjun'],
      location: '동아리방',
      purpose: '아이미의 체험회 종료 시간 답이 맞는지 독립된 학교 공식 공지 자료로 확인하기',
      mismatch: '아이미에게 "너 정말 확실해?"라고 물었더니 "네, 확실합니다"라고 거침없이 거짓 대답함',
      evidence: ['아이미의 자신 있는 대답', '최신 학교 공식 공지문', '누가 쓴지 모르는 인터넷 글'],
      resolution: '같은 AI에게 다시 묻는 대신 학교 공식 공지와 대조하여 진짜 대답을 확인 함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '다시 묻기의 한계',
        instruction: '아이미에게 "진짜 확실하니?"라고 다시 물었을 때의 반응을 살펴봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '같은 AI에게 다시 물어보는 것은 왜 검증이 아닐까요?',
          choices: [
            { id: 'same-memory', label: 'AI는 이전의 틀린 대답에 맞춰 또 그럴듯하게 거짓 우김을 할 수 있어요', emoji: '⚠️' },
          ],
        },
        assetIds: ['m2-l9-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '독립된 근거 대조하기',
        instruction: '학교 공식 공지문이나 민준 선생님께 물어보는 독립 확인을 거칩니다.',
        activity: {
          id: 'act-s2',
          kind: 'compare',
          prompt: '아이미 대답과 학교 공식 공지문의 종료 시간을 대조해보세요.',
          left: { title: '아이미 대답', content: '행사는 오후 5시에 종료됩니다! (틀림)' },
          right: { title: '학교 공식 공지문', content: '행사 안내: 오후 3시30분 정시 종료 (진짜)' },
          criteria: [{ id: 'time-check', label: '종료 시간이 일치하는가' }],
        },
        assetIds: ['m2-l9-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm2-l9-artifact',
      title: '주장-근거 확인표',
      portfolioLabel: 'AI 주장과 독립 외부 근거 확인 대조표',
      fields: [
        { id: 'independentEvidence', label: 'AI 답을 확인하려고 내가 직접 비교한 자료', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '행사 장소 확인',
      scenario: 'AI가 알려준 체험회 장소를 확실히 믿으려면 누구에게 확인해야 할까요?',
      activity: {
        id: 'act-transfer-m2-l9',
        kind: 'single-choice',
        prompt: '독립적인 장소 사실 확인 방법은?',
        choices: [
          { id: 'ask-teacher', label: '학교 가정통신문이나 담임 선생님께 직접 여쭤봐요', emoji: '🏫' },
        ],
      },
    },
    assets: [
      { id: 'm2-l9-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l9-story-01.webp', alt: '자신있게 말하는 아이미', required: true, purpose: '스토리 컷 1' },
      { id: 'm2-l9-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l9-story-02.webp', alt: '공식 공지 확인', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: 'AI에게 다시 묻는 것은 검증이 아니며, 공식 공지나 독립된 자료로 직접 확인해야 합니다.',
  },

  // ============================================================
  // m2-l10 플래그십: 한 번의 진짜 대화 완성하기
  // ============================================================
  {
    lessonId: 'm2-l10',
    moduleId: 'm2',
    number: 10,
    role: 'flagship',
    title: '한 번의 진짜 대화 완성하기',
    masterObjective: '오늘은 내가 정한 목적의 요청을 보내고, 결과를 고쳐 묻고, 근거를 확인해 최종 사용을 결정해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01, STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['실제 AI 답과 수업용 연습 답을 구분하며 대화 기록 전체가 활동 기록이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '홍보 문구, 준비 목록, 소개 대본 중 하나를 정해 첫 대화부터 수정 및 근거 확인까지 완성하기',
      mismatch: '첫 대화 결과에 빠진 정보와 확인 필요한 사실 존재',
      evidence: ['과제별 사실 카드', '독립 확인 공지', '전체 대화 타임라인'],
      resolution: '최초 요청 -> 결과 평가 -> 수정 요청 -> 다른 자료 확인 -> 최종 사용/수정/거절 결정을 해 봄',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '과제 선택 및 최초 요청',
        instruction: '오늘 완성할 과제(홍보 문구, 준비 목록, 소개 대본) 중 하나를 고르고 첫 요청을 작성하세요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '내가 도전할 대화 과제를 하나 고르세요.',
          choices: [
            { id: 'task-promo', label: '과제 1: 체험회 한 줄 홍보 문구 만들기', emoji: '📢' },
            { id: 'task-list', label: '과제 2: 필수 준비물 목록 만들기', emoji: '📋' },
          ],
        },
        assetIds: ['m2-l10-story-01'],
        support: {},
      },
      {
        id: 's2-compare',
        phase: 'compare',
        title: '결과 평가 및 다른 자료 확인',
        instruction: '첫 대화 결과에서 빠진 조건을 찾아 수정 요청을 보내고 다른 자료와 비교해봅시다.',
        activity: {
          id: 'act-s2',
          kind: 'ai-compare',
          prompt: '첫 결과와 공식 자료를 비교해 수정할 부분을 찾으세요.',
          source: { title: '공식 자료', text: '일시: 5월 10일 오후 2시 / 장소: 강당 / 무료 입장' },
          response: { title: 'AI 첫 응답 결과', text: '5월 15일에 참가비 1000원 행사로 열립니다.' },
          criteria: [{ id: 'date-fee', label: '날짜 및 참가비 정확성' }],
          decisions: ['modify'],
        },
        assetIds: ['m2-l10-story-02', 'm2-l10-story-03'],
        support: {},
      },
      {
        id: 's3-decision',
        phase: 'decision',
        title: '최종 사용 및 수용/거절 결정',
        instruction: '독립 근거로 수정한 최종 대화 결과를 사용할지 결정합니다.',
        activity: {
          id: 'act-s3',
          kind: 'single-choice',
          prompt: '최종 수정된 결과물에 대한 결정은?',
          choices: [
            { id: 'final-use', label: '다른 자료로 확인한 수정본을 사용합니다', emoji: '✅' },
          ],
        },
        assetIds: ['m2-l10-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm2-l10-artifact',
      title: '전체 대화 검증 기록',
      portfolioLabel: '요청-수정-근거확인-결정이 담긴 전체 대화 기록',
      fields: [
        { id: 'fullDialogHistory', label: '처음 요청부터 마지막 확인까지의 대화 기록', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '동아리 소식지 대화 적용',
      scenario: '동아리 소식지 글을 작성할 때 오늘 배운 요청-수정-확인 순서를 적용해봐요.',
      activity: {
        id: 'act-transfer-m2-l10',
        kind: 'single-choice',
        prompt: '진짜 대화 완수를 위한 올바른 순서는?',
        choices: [
          { id: 'flow-correct', label: '자세히 묻기 -> 결과 보기 -> 고쳐 묻기 -> 다른 자료 확인 -> 마지막 결정', emoji: '🔄' },
        ],
      },
    },
    assets: [
      { id: 'm2-l10-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l10-story-01.webp', alt: '과제 선택 및 첫 대화', required: true, purpose: '스토리 컷 1' },
      { id: 'm2-l10-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l10-story-02.webp', alt: '첫 결과 읽기', required: true, purpose: '스토리 컷 2' },
      { id: 'm2-l10-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l10-story-03.webp', alt: '근거 확인 대조', required: true, purpose: '스토리 컷 3' },
      { id: 'm2-l10-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l10-story-04.webp', alt: '최종 결과 발표', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '좋은 대화는 한번의 요청으로 끝나지 않고 결과를 확인하고 수정하며 완성됩니다.',
  },

  // ============================================================
  // m2-l11 프로젝트: 나의 프롬프트 노트
  // ============================================================
  {
    lessonId: 'm2-l11',
    moduleId: 'm2',
    number: 11,
    role: 'project',
    title: '나의 프롬프트 노트',
    masterObjective: '오늘은 실제 목적 하나를 정하고 요청·수정·확인·최종 판단이 담긴 프롬프트 노트를 완성해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01, STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['좋은 요청은 결과를 만든 뒤 확인하고 고치는 과정까지 포함한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '새 동아리원을 위한 요청 기술 가이드북 <나의 프롬프트 노트> 작성하기',
      mismatch: '새 동아리원이 모호하게 물어보고 틀린 대답을 그대로 사용하려 함',
      evidence: ['l1~l10 요청 조각 기록 묶음'],
      resolution: '모듈 2 결과물들을 모아 한 장짜리 프롬프트 노트를 조립하고 발표함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '새 동아리원의 고민과 기록 모으기',
        instruction: '새 동아리원에게 전해줄 모듈 2의 요청 기술 4가지(조건 더하기, 예시 주기, 단계 나누기, 외부 확인)를 살펴봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '나만의 프롬프트 노트에 담을 가장 중요한 원칙을 고르세요.',
          choices: [
            { id: 'prompt-note-start', label: '요청 -> 확인 -> 고치기 -> 마지막 결정이 담긴 노트를 만들어요!', emoji: '📒' },
          ],
        },
        assetIds: ['m2-l11-story-01', 'm2-l11-story-02'],
        support: {},
      },
      {
        id: 's2-artifact',
        phase: 'artifact',
        title: '나의 프롬프트 노트 조립하기',
        instruction: '최초 요청, 좋은 예시, 단계 나누기, 외부 근거 확인 항목을 채워 노트를 완성하세요.',
        activity: {
          id: 'act-s2',
          kind: 'build',
          prompt: '프롬프트 노트의 각 장에 알맞은 요청 기술 조각을 놓아보세요.',
          slots: [
            { id: 'slot-cond', label: '1장: 구체적 조건과 대상 말하기' },
            { id: 'slot-ex', label: '2장: 원하는 답의 한 줄 예시 주기' },
            { id: 'slot-check', label: '3장: 독립된 공식 근거 확인하기' },
          ],
          pieces: [
            { id: 'p-c', label: '이름, 수량, 시간 구체적 명시', slotId: 'slot-cond' },
            { id: 'p-e', label: '[시간] - [할일] 양식 예시 제공', slotId: 'slot-ex' },
            { id: 'p-k', label: '학교 공식 공지와 같은지 확인', slotId: 'slot-check' },
          ],
        },
        assetIds: ['m2-l11-story-03'],
        support: {},
      },
    ],
    artifact: {
      id: 'm2-l11-artifact',
      title: '나의 프롬프트 노트',
      portfolioLabel: '모듈 2 프롬프트 개선 가이드 노트',
      fields: [
        { id: 'promptRule1', label: '1. 구체적 조건 및 대상 지정 법칙', input: 'text', required: true },
        { id: 'promptRule2', label: '2. 원하는 양식 예시 제공 법칙', input: 'text', required: true },
        { id: 'promptRule3', label: '3. 외부 독립 근거 확인 법칙', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '프롬프트 노트 공유 및 발표',
      scenario: '완성한 노트를 동아리 게시판에 붙이고 올바른 요청 방법을 공유해봐요.',
      activity: {
        id: 'act-transfer-m2-l11',
        kind: 'single-choice',
        prompt: '노트 발표를 완료할 준비가 되었나요?',
        choices: [
          { id: 'share-note', label: '네, 나의 프롬프트 노트를 자신 있게 발표해요!', emoji: '🎉' },
        ],
      },
    },
    assets: [
      { id: 'm2-l11-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l11-story-01.webp', alt: '새 동아리원의 질문', required: true, purpose: '스토리 컷 1' },
      { id: 'm2-l11-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l11-story-02.webp', alt: '기록 조립', required: true, purpose: '스토리 컷 2' },
      { id: 'm2-l11-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m2/m2-l11-story-03.webp', alt: '완성 노트 공유 발표', required: true, purpose: '스토리 컷 3' },
    ],
    wrapUp: '좋은 요청은 나만의 구체적 조건, 예시, 그리고 독립된 사실 확인이 함께할 때 완성됩니다.',
  },
];
