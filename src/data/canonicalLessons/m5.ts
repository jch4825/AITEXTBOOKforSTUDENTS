import type { CanonicalLessonDesign } from './types';
import { STANDARD_CODES } from './shared';

export const M5_CANONICAL_LESSONS: CanonicalLessonDesign[] = [
  // ============================================================
  // m5-l1 플래그십: 탐구 질문 만들기
  // ============================================================
  {
    lessonId: 'm5-l1',
    moduleId: 'm5',
    number: 1,
    role: 'flagship',
    title: '탐구 질문 만들기',
    masterObjective: '오늘은 내가 정한 탐구 주제에서 AI와 묻고 답하며 조사할 탐구 질문 3가지를 만들어 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['좋은 탐구 질문은 관찰 가능하고, 근거를 모을 수 있으며, 내 생각이 담긴 답으로 이어지는 질문이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'aimi'],
      location: '동아리방',
      purpose: '광범위한 "환경 조사"를 "우리 동네 재활용 분리배출 문제"로 좁히고 3가지 탐구 질문 완성하기',
      mismatch: '"환경 조사해 줘"라고 너무 넓게 물어 정보가 뒤섞임',
      evidence: ['광범위 주제 카드', '세부 탐구 질문 3종'],
      resolution: '동네 분리배출 관찰 가능 조건으로 질문 3가지를 구체화함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '너무 넓은 탐구 주제',
        instruction: '진우가 "환경 조사해 줘"라고 질문하자 정보가 너무 넓어서 무엇을 조사할지 알 수 없었어요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '넓은 질문을 구체적인 탐구 질문으로 바꿔야 하는 이유는?',
          choices: [
            { id: 'narrow-target', label: '우리 동네에서 직접 조사하고 답을 찾을 수 있는 범위로 좁혀야 해요', emoji: '🎯' },
          ],
        },
        assetIds: ['m5-l1-story-01'],
        support: {},
      },
      {
        id: 's2-condition-change',
        phase: 'condition-change',
        title: '탐구 질문 3가지 조립',
        instruction: '우리 동네 분리배출에 대해 조사할 3가지 세부 질문을 조립해봅시다.',
        activity: {
          id: 'act-s2',
          kind: 'sequence',
          prompt: '탐구 순서에 맞춰 3가지 질문을 배열해보세요.',
          items: [
            { id: 'q1', label: '1. 현황: 우리 동네 분리배출 수거함 위치와 수거 요일은 언제인가요?', correctOrder: 1 },
            { id: 'q2', label: '2. 문제: 사람들이 분리배출할 때 가장 많이 헷갈려하는 품목 2가지는 무엇인가요?', correctOrder: 2 },
            { id: 'q3', label: '3. 대안: 분리배출을 올바르게 돕기 위해 학교에서 할 수 있는 활동은 무엇인가요?', correctOrder: 3 },
          ],
        },
        assetIds: ['m5-l1-story-02', 'm5-l1-story-03'],
        support: {},
      },
      {
        id: 's3-compare',
        phase: 'compare',
        title: '좋은 탐구 질문의 조건',
        instruction: '단순 검색용 질문과 탐구 보고서용 질문의 차이를 비교해봅시다.',
        activity: {
          id: 'act-s3',
          kind: 'compare',
          prompt: '단순 질문과 좋은 탐구 질문을 대조해보세요.',
          left: { title: '단순 검색 질문', content: '분리배출이 뭐야?' },
          right: { title: '좋은 탐구 질문', content: '우리 동네 분리배출에서 가장 자주 발생하는 오류와 해결 방법은?' },
          criteria: [{ id: 'actionable', label: '직접 조사하고 대안을 제시할 수 있는가' }],
        },
        assetIds: ['m5-l1-story-03'],
        support: {},
      },
      {
        id: 's4-decision',
        phase: 'decision',
        title: '탐구 계획서 출발',
        instruction: '완성된 3가지 질문을 가지고 나만의 탐구 보고서 계획을 시작합니다.',
        activity: {
          id: 'act-s4',
          kind: 'single-choice',
          prompt: '좋은 탐구 질문이 완성된 후 할 일은?',
          choices: [
            { id: 'start-plan', label: '질문별로 필요한 공식 자료와 관찰 장소를 찾아 나섭니다', emoji: '🗺️' },
          ],
        },
        assetIds: ['m5-l1-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l1-artifact',
      title: '탐구 질문 3종 카드',
      portfolioLabel: '구체화된 3가지 탐구 질문 기록',
      fields: [
        { id: 'inquiryQuestions', label: '내가 완성한 3가지 구체적 탐구 질문', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '학교 급식 잔반 탐구 적용',
      scenario: '급식 잔반 문제에 대해 탐구하려 할 때 알맞은 구체적 질문은?',
      activity: {
        id: 'act-transfer-m5-l1',
        kind: 'single-choice',
        prompt: '급식 잔반 탐구 질문으로 가장 적절한 것은?',
        choices: [
          { id: 'food-waste-q', label: '우리 학교에서 가장 잔반이 많이 남는 요일과 음식 종류는 무엇일까?', emoji: '🍱' },
        ],
      },
    },
    assets: [
      { id: 'm5-l1-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l1-story-01.webp', alt: '막막한 질문', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l1-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l1-story-02.webp', alt: '주제 좁히기', required: true, purpose: '스토리 컷 2' },
      { id: 'm5-l1-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l1-story-03.webp', alt: '질문 3개 완성', required: true, purpose: '스토리 컷 3' },
      { id: 'm5-l1-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l1-story-04.webp', alt: '계획서 시작', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '좋은 탐구 질문은 직접 관찰하고 자료를 모아 내 대안을 만들 수 있도록 구체적이어야 합니다.',
  },

  // ============================================================
  // m5-l2 안내 연습: 조사할 곳 찾기
  // ============================================================
  {
    lessonId: 'm5-l2',
    moduleId: 'm5',
    number: 2,
    role: 'guided',
    title: '조사할 곳 찾기',
    masterObjective: '오늘은 내 탐구 질문에 답하기 위해 조사할 공식 자료와 관찰 장소를 골라봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['자료는 한 곳에만 의존하지 않고 공식 문서, 직접 관찰, 인터뷰를 함께 사용한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'aimi'],
      location: '동아리방',
      purpose: '구청 공식 문서, 동네 분리배출함 현장 관찰, 주민 인터뷰 3가지 교차 출처 고르기',
      mismatch: '인터넷 블로그 하나만 보고 조사를 끝내려 함',
      evidence: ['출처 지도 패널', '교차 검증 스티커'],
      resolution: '공식 문서와 직접 관찰 등 2개 이상의 교차 출처를 조사 계획에 반영함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '다양한 조사 출처',
        instruction: '공식 구청 홈페이지, 현장 관찰, 인터뷰 중 어떤 조합이 가장 신뢰도가 높을까요?',
        activity: {
          id: 'act-s1',
          kind: 'multi-choice',
          prompt: '탐구에 함께 활용할 2가지 이상의 신뢰 출처를 고르세요.',
          choices: [
            { id: 'c-gov', label: '구청 공식 재활용 안내 문서', emoji: '🏛️' },
            { id: 'c-obs', label: '우리 동네 수거함 직접 보기', emoji: '👁️' },
          ],
        },
        assetIds: ['m5-l2-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '교차 출처 선택 원칙',
        instruction: '인터넷 글 하나에만 의존하지 않고 교차 출처를 확인하면 정보가 훨씬 정확해집니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '조사할 곳을 정하는 바람직한 원칙은?',
          choices: [
            { id: 'multi-source-rule', label: '공식 문서와 직접 본 내용처럼 서로 다른 자료 2개 이상을 비교해요', emoji: '📌' },
          ],
        },
        assetIds: ['m5-l2-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l2-artifact',
      title: '출처 선택 카드',
      portfolioLabel: '2개 이상 교차 조사 출처 계획서',
      fields: [
        { id: 'selectedSources', label: '내가 선택한 2가지 이상의 조사 출처와 이유', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '동물 생태 조사 출처',
      scenario: '멸종위기 동물을 조사할 때 선택할 가장 좋은 조사 출처 조합은?',
      activity: {
        id: 'act-transfer-m5-l2',
        kind: 'single-choice',
        prompt: '멸종위기 동물 조사 출처 조합은?',
        choices: [
          { id: 'zoo-doc', label: '국립생태원 공식 보고서 + 사육사 선생님 인터뷰', emoji: '🦁' },
        ],
      },
    },
    assets: [
      { id: 'm5-l2-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l5-story-01.webp', alt: '출처 지도', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l2-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l2-story-02.webp', alt: '출처 스티커 붙이기', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '조사할 때는 한 가지 정보원에 의존하지 않고 공식 문서와 직접 관찰을 함께 교차 확인해야 합니다.',
  },

  // ============================================================
  // m5-l3 안내 연습: 자료 꼼꼼히 정리하기
  // ============================================================
  {
    lessonId: 'm5-l3',
    moduleId: 'm5',
    number: 3,
    role: 'guided',
    title: '자료 꼼꼼히 정리하기',
    masterObjective: '오늘은 모은 자료에서 중요한 사실을 고르고 조사 기록표에 남겨 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['자료 정리는 복사가 아니라 필요한 정보를 골라 출처와 함께 남기는 일이다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '긴 구청 재활용 가이드글에서 핵심 수치와 수거 규칙 하이라이트하여 정리하기',
      mismatch: '글 전체를 그대로 통째로 복사해 붙여넣으려 함',
      evidence: ['긴 가이드글 원문', '하이라이터 펜', '조사 기록표'],
      resolution: '핵심 수치와 중요 규칙만 골라 하이라이트하고 출처와 함께 정리함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '핵심 정보 하이라이트',
        instruction: '긴 가이드글에서 탐구 질문에 진짜 답이 되는 핵심 수치를 찾아봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '자료를 정리할 때 올바른 방법은?',
          choices: [
            { id: 'highlight-pick', label: '전체를 통복사하지 않고 필요한 핵심 사실만 골라 출처를 적어요', emoji: '🖍️' },
          ],
        },
        assetIds: ['m5-l3-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '조사 기록표 작성',
        instruction: '선택한 핵심 정보와 작성 날짜, 출처를 기록표에 적어 정리합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '정리한 핵심 조사 내용과 출처를 작성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'summary-record', label: '수거 요일: 화/목요일 / 출처: 00구청 안내글 (5월 10일 확인)', emoji: '📋' },
          ],
        },
        assetIds: ['m5-l3-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l3-artifact',
      title: '조사 기록표',
      portfolioLabel: '핵심 사실 하이라이트 및 출처 기록표',
      fields: [
        { id: 'factRecord', label: '내가 정리한 핵심 조사 사실과 출처', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '과학 기사 요약 정리',
      scenario: '긴 과학 기사를 읽고 탐구 노트에 정리할 때 할 일은?',
      activity: {
        id: 'act-transfer-m5-l3',
        kind: 'single-choice',
        prompt: '기사 정리의 바른 방법은?',
        choices: [
          { id: 'news-summary', label: '기사 제목, 핵심 수치 1개, 출처 언론사 이름을 노트에 남깁니다', emoji: '📰' },
        ],
      },
    },
    assets: [
      { id: 'm5-l3-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l3-story-01.webp', alt: '하이라이트 치기', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l3-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l3-story-02.webp', alt: '조사 기록표 작성', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '자료 정리는 전체 통복사가 아닌, 핵심 사실을 발췌해 출처와 함께 남기는 과정입니다.',
  },

  // ============================================================
  // m5-l4 안내 연습: 조사 결과 대조하기
  // ============================================================
  {
    lessonId: 'm5-l4',
    moduleId: 'm5',
    number: 4,
    role: 'guided',
    title: '조사 결과 대조하기',
    masterObjective: '오늘은 두 자료의 내용을 비교하고 서로 다른 부분을 찾아 확인해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['자료 간 차이는 오류일 수도 있고 관점 차이일 수도 있으므로 원본 공지를 대조한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '인터넷 블로그 글과 구청 공식 안내판의 수거 요일 차이점 대조하고 바로잡기',
      mismatch: '블로그에는 "월요일 수거"라고 되어있고 구청 공지에는 "화요일 수거"라고 됨',
      evidence: ['블로그 글 (A자료)', '구청 공지 (B자료)', '자료 대조표'],
      resolution: '공식 공지(B자료)를 우선 기준으로 삼아 수거 요일 오류를 수정함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '두 자료의 내용 어긋남',
        instruction: 'A자료(블로그)와 B자료(구청 공지)의 수거 요일 차이점을 찾아봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'compare',
          prompt: '두 자료를 대조하여 차이점을 확인하세요.',
          left: { title: 'A자료 (개인 블로그)', content: '우리 동네 페트병 수거 요일: 매주 월요일' },
          right: { title: 'B자료 (구청 공식 공지)', content: '우리 동네 페트병 수거 요일: 매주 화요일' },
          criteria: [{ id: 'day-check', label: '공식 수거 요일 정확성' }],
        },
        assetIds: ['m5-l4-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '오류 바로잡기',
        instruction: '두 자료가 다를 때는 공식 기관 원본 자료를 기준으로 내용을 수정합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '자료 간 내용이 서로 다를 때 해결 방법은?',
          choices: [
            { id: 'trust-official-diff', label: '공식 기관의 최신 안내판을 기준으로 틀린 정보를 고쳐요', emoji: '✅' },
          ],
        },
        assetIds: ['m5-l4-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l4-artifact',
      title: '자료 대조표',
      portfolioLabel: '자료 간 차이점 비교 및 바로잡기 기록',
      fields: [
        { id: 'correctedData', label: '비교한 뒤 내가 정한 맞는 조사 정보', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '박물관 휴관일 조사 대조',
      scenario: '인터넷 포털 지도의 휴관일과 박물관 공식 홈페이지 휴관일이 다를 때 확인법은?',
      activity: {
        id: 'act-transfer-m5-l4',
        kind: 'single-choice',
        prompt: '휴관일 대조 시 기준은?',
        choices: [
          { id: 'museum-official', label: '박물관 공식 홈페이지의 최신 공지를 기준으로 확인합니다', emoji: '🏛️' },
        ],
      },
    },
    assets: [
      { id: 'm5-l4-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l4-story-01.webp', alt: '두 자료 어긋남', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l4-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l4-story-02.webp', alt: '공식 안내판 확인', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '조사 자료 간 차이가 있을 때는 작성 주체와 최신성을 따져 공식 원본을 기준으로 잡아야 합니다.',
  },

  // ============================================================
  // m5-l5 안내 연습: 내 생각 덧붙이기
  // ============================================================
  {
    lessonId: 'm5-l5',
    moduleId: 'm5',
    number: 5,
    role: 'guided',
    title: '내 생각 덧붙이기',
    masterObjective: '오늘은 조사한 사실 위에 내 이유와 느낌을 덧붙여 내 주장을 만들어 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['보고서는 조사한 사실(Fact)과 나의 해석/주장(Opinion)이 모두 담겨야 한다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '조사한 사실(투명 페트병 라벨 미제거 비율 40%) 위에 나의 대안과 주장 덧붙이기',
      mismatch: '사실 수치만 단순 나열되어 주장과 대안이 없음',
      evidence: ['조사 사실 카드', '내 생각 카드'],
      resolution: '조사된 객관적 사실에 내 의견과 실천 제안을 더해 완전한 단락을 완성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '사실(Fact)과 의견(Opinion)의 연결',
        instruction: '조사한 사실 카드에 나의 이유와 생각을 덧붙여 주장을 만들어봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'sort',
          prompt: '각 문장을 객관적 사실과 나의 의견으로 나누어보세요.',
          bins: [
            { id: 'fact-bin', label: '조사한 사실 (Fact)', emoji: '📊' },
            { id: 'opinion-bin', label: '나의 주장/의견 (Opinion)', emoji: '💡' },
          ],
          cards: [
            { id: 'c-f1', label: '우리 동네 페트병 10개 중 4개는 라벨이 붙어있었다.', binId: 'fact-bin' },
            { id: 'c-o1', label: '따라서 학교에서 라벨 떼기 캠페인을 열어야 한다.', binId: 'opinion-bin' },
          ],
        },
        assetIds: ['m5-l5-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '사실+의견 보고서 문장 완성',
        instruction: '조사 사실에 내 생각 문장을 이어붙여 풍부한 탐구 결론을 작성합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '사실과 내 의견이 담긴 결론 단락을 완성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'fact-opinion-sent', label: '라벨 미제거 비율이 40%로 높으므로, 쉬운 라벨 제거 안내판을 수거함 옆에 붙여야 한다고 생각합니다.', emoji: '📝' },
          ],
        },
        assetIds: ['m5-l5-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l5-artifact',
      title: '사실+의견 문장 카드',
      portfolioLabel: '조사 사실 기반 내 생각 덧붙이기 기록',
      fields: [
        { id: 'factOpinionText', label: '조사 사실과 내 의견이 담긴 탐구 단락', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '독서 감상문 사실과 느낌',
      scenario: '책 보고서를 쓸 때 줄거리(사실)와 내 느낌(의견)을 연결하는 방법은?',
      activity: {
        id: 'act-transfer-m5-l5',
        kind: 'single-choice',
        prompt: '독서 보고서의 올바른 문단 구성은?',
        choices: [
          { id: 'book-fact-opinion', label: '주요 사건 장면을 간단히 소개한 뒤 내 생각과 깨달은 점을 덧붙여요', emoji: '📚' },
        ],
      },
    },
    assets: [
      { id: 'm5-l5-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l5-story-01.webp', alt: '사실과 의견 조각', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l5-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l5-story-02.webp', alt: '완성된 결론 단락', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '좋은 보고서는 조사된 객관적 사실 위에 내 생각과 대안 주장을 더해 완성해야 합니다.',
  },

  // ============================================================
  // m5-l6 플래그십: AI와 만든 첫 초안 검토하기
  // ============================================================
  {
    lessonId: 'm5-l6',
    moduleId: 'm5',
    number: 6,
    role: 'flagship',
    title: 'AI와 만든 첫 초안 검토하기',
    masterObjective: '오늘은 AI가 써 준 보고서 초안에서 내 조사 자료와 다른 곳을 찾아 바로잡아 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['AI 초안은 출발점이며, 실제 조사 자료와 다른 환각/오류를 수정해야 한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'minjun', 'aimi'],
      location: '동아리방',
      purpose: 'AI가 작성해 준 보고서 초안에 포함된 지어낸 장소(거짓 재활용 센터) 오류를 찾아 정정하기',
      mismatch: 'AI 초안에 우리 동네에 실제로 없는 "행복 재활용 종합 센터"가 적혀 있음',
      evidence: ['AI 첫 초안', '붉은 펜 하이라이트', '실제 동네 조사 자료'],
      resolution: '지어낸 거짓 장소를 삭제하고 실제 조사한 수거함 위치로 디프 교체함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '초안 속 지어낸 오류 발견',
        instruction: 'AI 초안을 읽던 중 실제로 없는 장소 이름이 들어간 것을 발견했습니다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: 'AI가 써준 초안을 대할 때 우리의 첫 번째 행동은?',
          choices: [
            { id: 'review-draft', label: '내 실제 조사 자료와 비교해 지어낸 엉뚱한 정보가 없는지 점검해요', emoji: '🧐' },
          ],
        },
        assetIds: ['m5-l6-story-01', 'm5-l6-story-02'],
        support: {},
      },
      {
        id: 's2-compare',
        phase: 'compare',
        title: 'AI 초안과 실제 자료 디프 대조',
        instruction: 'AI 초안 문장과 내 실제 조사 기록을 나란히 대조해보세요.',
        activity: {
          id: 'act-s2',
          kind: 'compare',
          prompt: 'AI 초안의 지어낸 정보와 실제 조사 자료를 대조하세요.',
          left: { title: 'AI 작성 초안 (오류)', content: '우리 동네 행복 재활용 종합 센터에서 매일 수거함 (지어냄)' },
          right: { title: '내 실제 조사 자료', content: '주민센터 앞 재활용 수거함에서 화/목요일 수거함 (진짜)' },
          criteria: [{ id: 'real-location', label: '실제 존재하는 장소 및 수거 규칙인가' }],
        },
        assetIds: ['m5-l6-story-02', 'm5-l6-story-03'],
        support: {},
      },
      {
        id: 's3-decision',
        phase: 'decision',
        title: '실제 자료로 초안 교체',
        instruction: '지어낸 거짓 장소 내용을 삭제하고 내 실제 조사 결과로 바르게 다듬습니다.',
        activity: {
          id: 'act-s3',
          kind: 'expression',
          prompt: '오류를 바로잡은 깨끗한 초안 문장을 작성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'clean-draft', label: '우리 동네 주민센터 앞 재활용 수거함에서 화요일과 목요일에 수거합니다.', emoji: '✨' },
          ],
        },
        assetIds: ['m5-l6-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l6-artifact',
      title: '초안 검토 디프 기록',
      portfolioLabel: 'AI 초안 오류 지우기 및 실제 자료 교체 기록',
      fields: [
        { id: 'diffCorrectedDraft', label: 'AI 초안의 오류를 지우고 내 자료로 바로잡은 문장', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '역사 보고서 초안 검토',
      scenario: 'AI가 작성해 준 삼국시대 역사 초안에서 인물 이름이 이상할 때 할 일은?',
      activity: {
        id: 'act-transfer-m5-l6',
        kind: 'single-choice',
        prompt: '역사 초안 오류 발견 시 대응은?',
        choices: [
          { id: 'history-textbook-check', label: '역사 교과서와 사전을 보고 인물 이름을 바르게 고칩니다', emoji: '📖' },
        ],
      },
    },
    assets: [
      { id: 'm5-l6-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l6-story-01.webp', alt: '초안 읽기', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l6-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l6-story-02.webp', alt: '붉은 펜 밑줄', required: true, purpose: '스토리 컷 2' },
      { id: 'm5-l6-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l6-story-03.webp', alt: '진짜 자료 교체', required: true, purpose: '스토리 컷 3' },
      { id: 'm5-l6-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l6-story-04.webp', alt: '검토 디프 발표', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: 'AI 초안은 탐구의 출발점일 뿐이며, 내 실제 조사 자료와 대조해 오류를 고쳐야 합니다.',
  },

  // ============================================================
  // m5-l7 안내 연습: 문장 깔끔히 다듬기
  // ============================================================
  {
    lessonId: 'm5-l7',
    moduleId: 'm5',
    number: 7,
    role: 'guided',
    title: '문장 깔끔히 다듬기',
    masterObjective: '오늘은 길고 복잡한 문장을 읽기 쉽고 명확하게 고쳐 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['좋은 보고서 문장은 주어-서술어가 맞고 뜻이 분명하다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '주어와 서술어가 꼬인 긴 복잡 문장을 두 개의 짧고 명확한 문장으로 나누어 다듬기',
      mismatch: '한 문장에 너무 많은 주어와 연결어가 얽혀 읽기 어려움',
      evidence: ['길고 복잡한 문장', '나눈 두 문장 카드'],
      resolution: '문장을 짧게 두 개로 나누고 주어-서술어 관계를 명확히 고침',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '복잡한 문장의 문제',
        instruction: '너무 길어서 무슨 뜻인지 한눈에 안 들어오는 문장을 다듬어봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'compare',
          prompt: '복잡한 긴 문장과 깔끔하게 다듬은 문장을 대조해보세요.',
          left: { title: '복잡하고 긴 문장', content: '우리 동네 분리배출은 요일이 화요일인데 라벨을 안 떼서 수거가 안 되니까 깨끗이 씻어야 해요.' },
          right: { title: '다듬은 두 문장', content: '우리 동네 수거 요일은 화요일입니다. 페트병은 라벨을 떼고 깨끗이 씻어 배출해야 합니다.' },
          criteria: [{ id: 'readability', label: '주어와 서술어가 잘 맞고 읽기 쉬운가' }],
        },
        assetIds: ['m5-l7-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '문장 다듬기 규칙',
        instruction: '긴 문장은 짧게 나누고 분명한 낱말을 사용할 때 읽는 이가 쉽게 이해합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '보고서 문장을 다듬을 때 좋은 원칙은?',
          choices: [
            { id: 'short-clear-rule', label: '한 문장에 하나의 생각을 담아 짧고 명확하게 나누어 써요', emoji: '✂️' },
          ],
        },
        assetIds: ['m5-l7-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l7-artifact',
      title: '다듬은 문장 카드',
      portfolioLabel: '읽기 쉽고 명확하게 고친 다듬은 문장 기록',
      fields: [
        { id: 'polishedText', label: '내가 깔끔하게 다듬어 완성한 문장', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '발표 원고 문장 다듬기',
      scenario: '발표 원고 문장이 너무 길어 말하다가 숨이 찰 때 어떻게 다듬어야 할까요?',
      activity: {
        id: 'act-transfer-m5-l7',
        kind: 'single-choice',
        prompt: '발표 원고 문장 다듬기 방법은?',
        choices: [
          { id: 'split-speech-sent', label: '문장을 두 개로 나누어 말하기 편하게 어조를 가다듬어요', emoji: '🎤' },
        ],
      },
    },
    assets: [
      { id: 'm5-l7-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l7-story-01.webp', alt: '복잡 문장 앞 고민', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l7-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l7-story-02.webp', alt: '다듬은 문장판', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '보고서 문장은 한 문장에 하나의 생각을 담아 짧고 명확하게 고쳐 써야 전달력이 높아집니다.',
  },

  // ============================================================
  // m5-l8 안내 연습: 발표 자료 모양 정하기
  // ============================================================
  {
    lessonId: 'm5-l8',
    moduleId: 'm5',
    number: 8,
    role: 'guided',
    title: '발표 자료 모양 정하기',
    masterObjective: '오늘은 한 줄 요약, 표, 그림 설명 중 발표 방식에 맞는 모양을 골라 정리해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['발표 자료는 듣는 이가 한눈에 이해할 수 있는 모양으로 구성한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '핵심 주제 한 줄 요약, 분리배출 수거표, 현장 사진 3 요소를 보기 좋게 패널 배치하기',
      mismatch: '줄글로만 가득 채워 멀리서 보는 친구들이 한눈에 읽기 어려움',
      evidence: ['3가지 모양 요소 패널', '발표 스크린 레이아웃'],
      resolution: '한 줄 요약(상단) + 표(중앙) + 그림(하단)으로 시각적 모양을 보기 좋게 배치함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '발표 상황과 모양 매칭',
        instruction: '한 줄 요약, 수거표, 현장 사진을 발표 패널의 어느 위치에 배치하는 것이 가장 좋을까요?',
        activity: {
          id: 'act-s1',
          kind: 'sort',
          prompt: '각 요소를 보기 좋은 발표 패널 위치에 배치해보세요.',
          bins: [
            { id: 'top-bin', label: '상단 (핵심 제목/요약)', emoji: '🔝' },
            { id: 'mid-bin', label: '중앙 (데이터 수거표)', emoji: '📊' },
            { id: 'bot-bin', label: '아래쪽 (직접 찍은 사진과 자료)', emoji: '🖼️' },
          ],
          cards: [
            { id: 'c-title', label: '한 줄 요약: 올바른 분리배출 3가지 규칙', binId: 'top-bin' },
            { id: 'c-table', label: '품목별 수거 요일 비교표', binId: 'mid-bin' },
            { id: 'c-img', label: '직접 본 수거함 사진', binId: 'bot-bin' },
          ],
        },
        assetIds: ['m5-l8-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '한눈에 들어오는 레이아웃',
        instruction: '듣는 이가 멀리서도 중요 내용을 바로 알아볼 수 있도록 모양을 정돈합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '발표 자료 모양 구성의 핵심 원칙은?',
          choices: [
            { id: 'visual-layout-rule', label: '글씨를 빽빽하게 넣지 않고 요약, 표, 그림을 균형 있게 배치해요', emoji: '📐' },
          ],
        },
        assetIds: ['m5-l8-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l8-artifact',
      title: '발표 레이아웃',
      portfolioLabel: '요약-표-그림 시각적 발표 패널 배치도',
      fields: [
        { id: 'presentationLayout', label: '내가 만든 보기 쉬운 발표판 배치', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '포스터 발표 디자인',
      scenario: '복도에 붙일 배움 포스터를 만들 때 선택할 모양 배치는?',
      activity: {
        id: 'act-transfer-m5-l8',
        kind: 'single-choice',
        prompt: '복도 포스터의 알맞은 배치는?',
        choices: [
          { id: 'poster-design', label: '큰 제목 아래에 3가지 행동 그림과 수치 표를 나란히 배치해요', emoji: '🖼️' },
        ],
      },
    },
    assets: [
      { id: 'm5-l8-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l8-story-01.webp', alt: '발표 패널 조립', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l8-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l8-story-02.webp', alt: '완성 레이아웃', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '발표 자료는 듣는 이가 멀리서도 한눈에 알아볼 수 있도록 요약, 표, 그림을 보기 좋게 정돈해야 합니다.',
  },

  // ============================================================
  // m5-l9 안내 연습: 쓰임새와 출처 밝히기
  // ============================================================
  {
    lessonId: 'm5-l9',
    moduleId: 'm5',
    number: 9,
    role: 'guided',
    title: '쓰임새와 출처 밝히기',
    masterObjective: '오늘은 AI 도움을 받은 부분과 조사 자료의 출처를 밝혀 써 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['정보의 출처와 AI 활용 범위를 솔직하게 밝히는 것이 연구 윤리이다.'],
    canonicalScenario: {
      characters: ['yuna', 'minjun'],
      location: '동아리방',
      purpose: '보고서 맨 아랫부분에 [참고 출처]와 [AI 도우미 활용 범위] 표기 스티커 작성하기',
      mismatch: '출처 표기를 빠뜨리고 자신이 직접 다 쓴 것처럼 하려 함',
      evidence: ['출처 스티커 템플릿', 'AI 활용 범위 체크표'],
      resolution: '구청 공지문 출처와 AI의 문장 다듬기 도움 범위를 정직하게 밝혀 정직한 보고서를 완성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '솔직한 출처 표기의 중요성',
        instruction: '보고서 작성에 도움 받은 공식 출처와 AI 도우미 활용 범위를 기록해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'multi-choice',
          prompt: '보고서 하단에 밝혀 적어야 할 필수 항목 2가지를 고르세요.',
          choices: [
            { id: 'r-src', label: '참고한 공식 자료 출처 (예: 00구청 공지문)', emoji: '📌' },
            { id: 'r-ai', label: 'AI 도우미 활용 범위 (예: 문장 교정 도움)', emoji: '🤖' },
          ],
        },
        assetIds: ['m5-l9-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '정직한 탐구 윤리',
        instruction: '출처와 도움 범위를 솔직히 밝히면 보고서의 신뢰성이 훨씬 높아집니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '보고서 맨 아래에 붙일 출처 표기 문장을 작성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'citation-tag', label: '[출처: 00구청 공지문 / AI 도우미: 초안 문장 다듬기 활용]', emoji: '🏷️' },
          ],
        },
        assetIds: ['m5-l9-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l9-artifact',
      title: '출처 및 도우미 표기 카드',
      portfolioLabel: '참고 출처 및 AI 활용 범위 솔직 표기서',
      fields: [
        { id: 'citationText', label: '내가 보고서에 적은 공식 자료와 AI를 쓴 부분', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '그림 숙제 출처 표기',
      scenario: '인터넷에서 구한 사진을 숙제에 넣을 때 밝혀야 할 정보는?',
      activity: {
        id: 'act-transfer-m5-l9',
        kind: 'single-choice',
        prompt: '사진 출처 표기 방법은?',
        choices: [
          { id: 'photo-citation', label: '사진 아래에 [출처: 00기관 박물관 사진]을 정확히 밝혀요', emoji: '🖼️' },
        ],
      },
    },
    assets: [
      { id: 'm5-l9-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l9-story-01.webp', alt: '출처 스티커 붙이기', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l9-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l9-story-02.webp', alt: '출처 완성 보고서', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '참고한 자료의 출처와 AI 활용 범위를 솔직하게 밝히는 것이 탐구의 기본 윤리입니다.',
  },

  // ============================================================
  // m5-l10 안내 연습: 친구 피드백 반영하기
  // ============================================================
  {
    lessonId: 'm5-l10',
    moduleId: 'm5',
    number: 10,
    role: 'guided',
    title: '친구 피드백 반영하기',
    masterObjective: '오늘은 친구의 조언을 듣고 보고서에서 고칠 점을 찾아 반영해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['피드백은 더 좋은 보고서를 만들기 위한 건설적인 의견이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '윤아의 피드백("수거 요일 표가 있으면 더 알아보기 좋겠어")을 받아들여 보고서 수정하기',
      mismatch: '친구 피드백을 내 보고서에 대한 비판으로 오해해 기분 나빠함',
      evidence: ['친구 조언 스티커', '피드백 반영 전후 보고서'],
      resolution: '건설적인 피드백을 수용하여 요일 안내표를 보완해 보고서를 개선함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '친구의 조언 듣기',
        instruction: '윤아가 건넨 "수거 요일 표를 추가하면 더 읽기 편하겠다"는 피드백을 읽어봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '친구 피드백을 대할 때 우리의 올바른 마음가짐은?',
          choices: [
            { id: 'accept-feedback', label: '보고서를 더 완성도 높게 발전시키는 좋은 조언으로 받아들여요', emoji: '💡' },
          ],
        },
        assetIds: ['m5-l10-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '보고서에 피드백 반영하기',
        instruction: '친구의 조언에 따라 수거 요일 요약표를 추가해 보고서를 보완합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '피드백을 반영해 고쳐 쓴 보고서 내용을 작성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'feedback-improved', label: '친구 조언을 보고 품목별 수거 요일을 표로 깔끔하게 고쳤습니다.', emoji: '📊' },
          ],
        },
        assetIds: ['m5-l10-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l10-artifact',
      title: '피드백 반영 기록',
      portfolioLabel: '친구 조언 수용 및 보고서 개선 기록',
      fields: [
        { id: 'improvedByFeedback', label: '친구 의견을 듣고 내가 고친 부분', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '짝과 보고서 서로 읽어주기',
      scenario: '짝과 보고서를 교환해 읽어줄 때 해줄 수 있는 좋은 피드백은?',
      activity: {
        id: 'act-transfer-m5-l10',
        kind: 'single-choice',
        prompt: '바람직한 피드백 전달 어조는?',
        choices: [
          { id: 'constructive-feedback', label: '잘한 부분을 먼저 칭찬하고 "이 그림이 더 크면 좋겠다"고 구체적 제안을 해요', emoji: '👏' },
        ],
      },
    },
    assets: [
      { id: 'm5-l10-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l10-story-01.webp', alt: '친구 메모 읽기', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l10-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l10-story-02.webp', alt: '표를 반영한 개선본', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '친구 피드백은 내 보고서를 더욱 이해하기 쉽게 만들어 주는 소중한 도움입니다.',
  },

  // ============================================================
  // m5-l11 플래그십: 우리 동네 AI 탐구 보고서 완성
  // ============================================================
  {
    lessonId: 'm5-l11',
    moduleId: 'm5',
    number: 11,
    role: 'flagship',
    title: '우리 동네 AI 탐구 보고서 완성',
    masterObjective: '오늘은 탐구 질문부터 출처 표기까지 포함된 우리 동네 탐구 보고서를 최종 완성해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01, STANDARD_CODES.SPEC_AI_02, STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['완성된 보고서는 사실, 내 생각, 검증, 출처가 하나로 연결된 결실이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '질문, 조사 자료, 내 의견, 출처 표시를 하나로 모아 마지막 탐구 보고서 만들기',
      mismatch: '흩어진 낱개 기록 조각들만 있고 통합 보고서 형태로 정돈되지 않음',
      evidence: ['탐구 질문 카드', '조사 기록표', '내 생각 단락', '출처 표기 태그'],
      resolution: '4개 핵심 요소를 통합 양식에 맞춰 조립하고 체크리스트 도장을 찍어 최종 완성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '보고서 4개 영역 통합',
        instruction: '탐구 질문, 조사 사실, 내 의견, 참고 출처 4가지 요소를 차례대로 확인해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '우리 동네 탐구 보고서에 반드시 들어가야 할 핵심 4요소는?',
          choices: [
            { id: 'all-4-elements', label: '탐구 질문 + 객관적 조사 사실 + 나의 주석/의견 + 솔직한 출처 표기', emoji: '📄' },
          ],
        },
        assetIds: ['m5-l11-story-01'],
        support: {},
      },
      {
        id: 's2-artifact',
        phase: 'artifact',
        title: '탐구 보고서 조립하기',
        instruction: '4단 보고서 양식의 각 슬롯에 내 공부 조각들을 조립하세요.',
        activity: {
          id: 'act-s2',
          kind: 'build',
          prompt: '4단 탐구 보고서 칸에 내 결과물 조각을 놓아 보세요.',
          slots: [
            { id: 'sec-q', label: '1단: 탐구 질문 (세부 3질문)' },
            { id: 'sec-f', label: '2단: 조사 사실 (확인한 수치)' },
            { id: 'sec-o', label: '3단: 내 생각과 대안 (주장)' },
            { id: 'sec-c', label: '4단: 참고 출처 및 AI 표기' },
          ],
          pieces: [
            { id: 'p-q', label: '우리 동네 분리배출 문제와 수거 요일 질문', slotId: 'sec-q' },
            { id: 'p-f', label: '구청 공지 기준 수거 요일 및 미제거 비율 40%', slotId: 'sec-f' },
            { id: 'p-o', label: '쉬운 라벨 제거 안내판 설치 제안', slotId: 'sec-o' },
            { id: 'p-c', label: '[출처: 00구청 공지문 / AI: 문장 다듬기]', slotId: 'sec-c' },
          ],
        },
        assetIds: ['m5-l11-story-02', 'm5-l11-story-03'],
        support: {},
      },
      {
        id: 's3-decision',
        phase: 'decision',
        title: '최종 검토 체크리스트',
        instruction: '완성된 탐구 보고서에 빠진 항목이 없는지 체크리스트 도장을 찍으세요.',
        activity: {
          id: 'act-s3',
          kind: 'multi-choice',
          prompt: '최종 보고서 검토 체크리스트 항목을 확인하세요.',
          choices: [
            { id: 'chk-fact', label: '지어낸 거짓 정보가 실제 자료로 고쳐졌는가?', emoji: '✅' },
            { id: 'chk-opinion', label: '조사 사실에 내 생각과 대안이 담겼는가?', emoji: '✅' },
          { id: 'chk-cite', label: '참고한 자료와 AI를 쓴 부분을 적었는가?', emoji: '✅' },
          ],
        },
        assetIds: ['m5-l11-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l11-artifact',
      title: '우리 동네 AI 탐구 보고서',
      portfolioLabel: '모듈 5 종합 탐구 보고서 최종 완성본',
      fields: [
        { id: 'reportTitle', label: '탐구 보고서 마지막 제목', input: 'text', required: true },
        { id: 'fullReportBody', label: '질문, 사실, 의견, 자료가 담긴 전체 보고서', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '학급 배움 게시판 등록',
      scenario: '완성된 우리 동네 탐구 보고서를 교실 뒤 배움 게시판에 올릴 준비를 해봐요.',
      activity: {
        id: 'act-transfer-m5-l11',
        kind: 'single-choice',
        prompt: '보고서 등록 준비완료 판단은?',
        choices: [
          { id: 'ready-to-post', label: '네, 4단계를 모두 마친 탐구 보고서를 자신 있게 올려요!', emoji: '🎉' },
        ],
      },
    },
    assets: [
      { id: 'm5-l11-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l11-story-01.webp', alt: '4단 보고서 조립', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l11-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l11-story-02.webp', alt: '체크리스트 도장', required: true, purpose: '스토리 컷 2' },
      { id: 'm5-l11-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l11-story-03.webp', alt: '보고서 완성 들기', required: true, purpose: '스토리 컷 3' },
      { id: 'm5-l11-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l11-story-04.webp', alt: '최종 검토 패널 걸기', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '탐구 보고서는 질문부터 사실 대조, 내 의견, 솔직한 출처까지 하나로 어우러질 때 완성됩니다.',
  },

  // ============================================================
  // m5-l12 프로젝트: 탐구 보고서 발표회
  // ============================================================
  {
    lessonId: 'm5-l12',
    moduleId: 'm5',
    number: 12,
    role: 'project',
    title: '탐구 보고서 발표회',
    masterObjective: '오늘은 내가 완성한 탐구 보고서를 발표하고 친구들의 질문에 답해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01, STANDARD_CODES.SPEC_AI_02, STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['발표는 내 탐구 과정을 공유하고 배움을 나누는 공동체 활동이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '학교 배움 발표회장',
      purpose: '전 모듈 5 결과물을 발표 보드로 완성하여 발표하고 친구들의 질문에 이유로 답변하기',
      mismatch: '발표 때 자료를 보지 않고 머뭇거리거나 당황함',
      evidence: ['l1~l11 M5 탐구 결과물 묶음'],
      resolution: '발표 보드를 완성하고 친구들의 질문에 내가 직접 조사한 출처 근거로 자신 있게 답변함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '탐구 발표 보드 준비',
        instruction: '모듈 5의 11개 차시에서 완성한 결과물들을 발표 보드로 정돈해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '발표회에서 조사 결과를 전달할 때 가장 중요한 발표 자세는?',
          choices: [
            { id: 'presentation-confidence', label: '내가 직접 확인한 자료 근거를 보며 자신 있게 답변해요!', emoji: '🎤' },
          ],
        },
        assetIds: ['m5-l12-story-01'],
        support: {},
      },
      {
        id: 's2-artifact',
        phase: 'artifact',
        title: '발표 보드 완성 및 질문 답변',
        instruction: '친구들의 "수거 요일 근거는 어디서 찾았나요?" 질문에 대조 자료로 답변하세요.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '친구들의 근거 질문에 답변할 성실한 답변 문장을 작성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'qna-answer', label: '네, 00구청 공식 홈페이지와 직접 본 수거함 자료로 확인했습니다!', emoji: '🗣️' },
          ],
        },
        assetIds: ['m5-l12-story-02', 'm5-l12-story-03'],
        support: {},
      },
    ],
    artifact: {
      id: 'm5-l12-artifact',
      title: '최종 탐구 발표 보드',
      portfolioLabel: '모듈 5 최종 탐구 발표 및 질의응답 기록',
      fields: [
        { id: 'presentationSummary', label: '발표 주요 내용과 친구들 질문에 답변한 핵심 기록', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '탐구 발표회 수료',
      scenario: '탐구 보고서 발표를 마치고 소감을 밝혀봐요.',
      activity: {
        id: 'act-transfer-m5-l12',
        kind: 'single-choice',
        prompt: '모듈 5 탐구 발표회를 완료할 준비가 되었나요?',
        choices: [
          { id: 'finish-m5-presentation', label: '네, 나만의 AI 탐구 보고서 발표회를 당당히 마쳤습니다!', emoji: '🎓' },
        ],
      },
    },
    assets: [
      { id: 'm5-l12-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l12-story-01.webp', alt: '발표 무대 등장', required: true, purpose: '스토리 컷 1' },
      { id: 'm5-l12-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l12-story-02.webp', alt: '자신있게 근거 답변', required: true, purpose: '스토리 컷 2' },
      { id: 'm5-l12-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m5/m5-l12-story-03.webp', alt: '칭찬 스티커 가득한 보드', required: true, purpose: '스토리 컷 3' },
    ],
    wrapUp: '스스로 조사하고 검증한 지식을 나누는 발표회는 진짜 배움을 완성하는 시간입니다.',
  },
];
