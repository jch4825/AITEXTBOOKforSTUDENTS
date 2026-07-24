import type { CanonicalLessonDesign } from './types';
import { STANDARD_CODES } from './shared';

export const M3_CANONICAL_LESSONS: CanonicalLessonDesign[] = [
  // ============================================================
  // m3-l1 플래그십: 궁금한 것을 깊게 묻기
  // ============================================================
  {
    lessonId: 'm3-l1',
    moduleId: 'm3',
    number: 1,
    role: 'flagship',
    title: '궁금한 것을 깊게 묻기',
    masterObjective: '오늘은 같은 주제를 여러 질문으로 바꾸어 보고 답의 차이를 비교해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['예·아니오 질문, 열린 질문, 구체화 질문은 서로 다른 정보를 얻는다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '동물 과제에서 펭귄 질문을 넓히고 좁히며 풍부한 정보 얻기',
      mismatch: '"펭귄은 새야?"라고 예/아니오만 물어서 짧은 답만 받음',
      evidence: ['예/아니오 질문 결과', '구체화 질문 계단 결과'],
      resolution: '목적에 맞춰 질문 계단을 만들어 펭귄의 생태 정보까지 깊게 이해함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '단순 질문과 짧은 답',
        instruction: '윤아가 "펭귄은 새야?"라고 물었더니 아이미가 "네, 새입니다"라고만 대답했어요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '예/아니오 질문의 한계점을 골라보세요.',
          choices: [
            { id: 'short-ans', label: '단순한 예/아니오 대답만 얻어 자세한 설명이 부족해요', emoji: '🧐' },
          ],
        },
        assetIds: ['m3-l1-story-01'],
        support: {},
      },
      {
        id: 's2-condition-change',
        phase: 'condition-change',
        title: '질문 계단 만들기',
        instruction: '원하는 목적과 과제 조건을 더해 질문을 계단처럼 넓히고 좁혀보세요.',
        activity: {
          id: 'act-s2',
          kind: 'sequence',
          prompt: '더 깊은 정보를 얻는 질문 계단을 순서대로 놓아보세요.',
          items: [
            { id: 'q1', label: '1단계 예/아니오: 펭귄은 새인가요?', correctOrder: 1 },
            { id: 'q2', label: '2단계 설명 질문: 펭귄은 날지 못하는데 왜 새인가요?', correctOrder: 2 },
            { id: 'q3', label: '3단계 구체화: 펭귄이 수영에 적합하게 진화한 신체 특징 2가지를 알려주세요', correctOrder: 3 },
          ],
        },
        assetIds: ['m3-l1-story-02'],
        support: {},
      },
      {
        id: 's3-compare',
        phase: 'compare',
        title: '질문 종류별 답 비교',
        instruction: '질문 계단 3단계에서 얻은 답변들을 나란히 비교해봅시다.',
        activity: {
          id: 'act-s3',
          kind: 'compare',
          prompt: '첫 번째 짧은 답과 구체화 질문의 풍부한 답을 대조해보세요.',
          left: { title: '1단계 짧은 질문 답', content: '네, 펭귄은 조류(새)에 속합니다.' },
          right: { title: '3단계 구체적 질문 답', content: '펭귄은 물속 헤엄에 알맞은 지느러미 모양 날개와 두꺼운 지방층을 가진 새입니다.' },
          criteria: [{ id: 'depth', label: '공부 과제에 유용한 정보가 담겼는가' }],
        },
        assetIds: ['m3-l1-story-03'],
        support: {},
      },
      {
        id: 's4-decision',
        phase: 'decision',
        title: '가장 도움 된 질문 선택',
        instruction: '배움 전시 발표 자료에 활용할 가장 유용한 질문 유형을 선택하세요.',
        activity: {
          id: 'act-s4',
          kind: 'single-choice',
          prompt: '공부할 때 가장 도움이 되는 질문 형태는?',
          choices: [
            { id: 'deep-q', label: '이유와 구체적 특징을 함께 묻는 구체화 질문이에요', emoji: '💡' },
          ],
        },
        assetIds: ['m3-l1-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm3-l1-artifact',
      title: '질문 계단 기록',
      portfolioLabel: '질문 구체화에 따른 답 비교표',
      fields: [
        { id: 'deepQuestion', label: '깊은 공부를 위해 내가 완성한 구체적 질문', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '우주 행성 질문 적용',
      scenario: '화성에 대해 궁금할 때 단순히 "화성은 행성이야?" 대신 어떻게 깊게 물어볼까요?',
      activity: {
        id: 'act-transfer-m3-l1',
        kind: 'single-choice',
        prompt: '화성에 대한 깊은 공부 질문으로 알맞은 것은?',
        choices: [
          { id: 'mars-deep', label: '화성이 붉게 보이는 이유와 사람이 살 수 없는 환경 특징을 알려줘', emoji: '🚀' },
        ],
      },
    },
    assets: [
      { id: 'm3-l1-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l1-story-01.webp', alt: '짧은 답만 받음', required: true, purpose: '스토리 컷 1' },
      { id: 'm3-l1-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l1-story-02.webp', alt: '질문 계단 만들기', required: true, purpose: '스토리 컷 2' },
      { id: 'm3-l1-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l1-story-03.webp', alt: '풍부한 답 받음', required: true, purpose: '스토리 컷 3' },
      { id: 'm3-l1-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l1-story-04.webp', alt: '질문 계단 발표', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '질문을 이유와 특징까지 구체적으로 적으면 공부에 훨씬 도움 되는 깊은 답을 얻을 수 있습니다.',
  },

  // ============================================================
  // m3-l2 안내 연습: 모르는 낱말 확인하기
  // ============================================================
  {
    lessonId: 'm3-l2',
    moduleId: 'm3',
    number: 2,
    role: 'guided',
    title: '모르는 낱말 확인하기',
    masterObjective: '오늘은 글에서 모르는 낱말을 골라 AI 설명과 사전 설명을 비교하고 내 말로 뜻을 적어 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['AI 설명은 시작점이며 사전·교과서와 비교해 뜻과 쓰임을 확인한다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '전시 안내문 속 모르는 낱말 "생태계" 뜻을 AI와 국어사전으로 비교해 이해하기',
      mismatch: 'AI 설명과 사전 정의가 조금 달라서 헷갈림',
      evidence: ['원문 안내글', 'AI 정의 카드', '국어사전 표준 정의'],
      resolution: '두 설명을 비교해 공통 핵심을 뽑아내어 내 쉬운 말로 낱말 카드를 완성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '두 사전 설명 대조하기',
        instruction: 'AI가 알려준 낱말 뜻과 국어사전의 뜻을 비교해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'compare',
          prompt: '생태계 낱말의 두 설명을 대조하고 공통 핵심어를 찾으세요.',
          left: { title: 'AI의 설명', content: '생물들과 환경이 서로 영향을 주며 어우러져 사는 세계예요.' },
          right: { title: '국어사전 표준 정의', content: '생물 공동체와 이를 둘러싼 비생물적 환경이 물질을 교환하는 시스템.' },
          criteria: [{ id: 'common-core', label: '생물과 환경이 서로 관계를 맺고 삶' }],
        },
        assetIds: ['m3-l2-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '나만의 낱말 카드 작성',
        instruction: '두 설명의 공통 핵심을 바탕으로 내 말로 쉽게 정리합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '내 쉬운 말로 "생태계" 뜻을 정리해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'my-def', label: '생물과 환경이 서로 도움을 주고받으며 함께 살아가는 자연 세계', emoji: '🌱' },
          ],
        },
        assetIds: ['m3-l2-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm3-l2-artifact',
      title: '나의 낱말 카드',
      portfolioLabel: 'AI-사전 대조 내 말 낱말 정의 카드',
      fields: [
        { id: 'myWordDef', label: '내가 쉬운 말로 정리한 낱말 뜻', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '새로운 과학 낱말 학습',
      scenario: '과학 책에서 "인공위성" 낱말을 보았을 때 올바른 확인 순서는?',
      activity: {
        id: 'act-transfer-m3-l2',
        kind: 'single-choice',
        prompt: '모르는 낱말을 학습하는 올바른 순서는?',
        choices: [
          { id: 'ai-dict-check', label: 'AI 설명을 듣고 사전을 대조한 뒤 내 말로 정리해요', emoji: '📖' },
        ],
      },
    },
    assets: [
      { id: 'm3-l2-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l2-story-01.webp', alt: '모르는 낱말 선택', required: true, purpose: '스토리 컷 1' },
      { id: 'm3-l2-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l2-story-02.webp', alt: '완성된 낱말 카드', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: 'AI 설명과 국어사전을 함께 대조하면 모르는 낱말의 정확한 뜻을 내 말로 이해할 수 있습니다.',
  },

  // ============================================================
  // m3-l3 안내 연습: 쉽지만 정확하게 다시 설명하기
  // ============================================================
  {
    lessonId: 'm3-l3',
    moduleId: 'm3',
    number: 3,
    role: 'guided',
    title: '쉽지만 정확하게 다시 설명하기',
    masterObjective: '오늘은 어려운 설명에서 꼭 남아야 할 사실을 찾고, 쉬운 예를 넣어 다시 요청해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['쉬운 설명은 핵심 사실을 지우지 않고 낯선 말을 풀어 쓴다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'aimi'],
      location: '동아리방',
      purpose: '식물의 광합성 어려운 설명에서 핵심 사실을 지키며 쉬운 예시 요청하기',
      mismatch: 'AI의 첫 쉬운 비유가 핵심 한 부분(햇빛)을 빠뜨림',
      evidence: ['어려운 학술 설명', '첫 쉬운 비유', '핵심 사실 유지 예시'],
      resolution: '핵심 사실(햇빛+물->영양분)을 지물쇠로 잠그고 정확한 쉬운 설명으로 고침',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '어려운 설명과 틀린 비유',
        instruction: '광합성의 첫 쉬운 비유에서 중요한 재료(햇빛)가 빠진 것을 찾아봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'compare',
          prompt: '어려운 원문과 첫 쉬운 설명을 대조하고 빠진 핵심을 찾으세요.',
          left: { title: '어려운 원문 설명', content: '식물이 빛에너지를 이용해 물과 이산화탄소로 양분을 합성하는 과정' },
          right: { title: '첫 쉬운 비유 (오류)', content: '식물이 흙에서 물만 먹고 자라는 조리법이에요' },
          criteria: [{ id: 'sunlight', label: '햇빛 에너지 역할 포함 여부' }],
        },
        assetIds: ['m3-l3-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '정확성을 지킨 쉬운 설명',
        instruction: '핵심 사실을 손상시키지 않는 정확한 쉬운 비유를 고르세요.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '핵심 사실을 잘 지킨 쉬운 설명은?',
          choices: [
            { id: 'correct-analogy', label: '식물이 햇빛과 물을 재료로 스스로 음식을 만들어 먹는 주방이에요', emoji: '☀️' },
          ],
        },
        assetIds: ['m3-l3-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm3-l3-artifact',
      title: '쉬운 설명 카드',
      portfolioLabel: '핵심 사실을 지킨 정확한 쉬운 설명서',
      fields: [
        { id: 'easyExplanation', label: '내가 고쳐 쓴 정확하고 쉬운 설명', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '중력 설명 수정',
      scenario: '중력 설명을 초등학생용으로 쉽게 바꿀 때 빠뜨리면 안 되는 핵심 사실은?',
      activity: {
        id: 'act-transfer-m3-l3',
        kind: 'single-choice',
        prompt: '중력 쉬운 설명에서 반드시 남겨야 할 사실은?',
        choices: [
          { id: 'gravity-pull', label: '지구가 물체를 중심으로 잡아당기는 힘이라는 점', emoji: '🌍' },
        ],
      },
    },
    assets: [
      { id: 'm3-l3-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l3-story-01.webp', alt: '복잡한 설명 앞 고민', required: true, purpose: '스토리 컷 1' },
      { id: 'm3-l3-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l3-story-02.webp', alt: '핵심 지킨 설명 완성', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '쉬운 설명은 핵심 사실을 빼는 것이 아니라, 중요한 사실을 지키며 풀어 쓰는 것입니다.',
  },

  // ============================================================
  // m3-l4 안내 연습: 낱말을 문장에서 써 보기
  // ============================================================
  {
    lessonId: 'm3-l4',
    moduleId: 'm3',
    number: 4,
    role: 'guided',
    title: '낱말을 문장에서 써 보기',
    masterObjective: '오늘은 낱말의 뜻·반대말·예문을 살펴보고 내 문장을 만들어 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['낱말은 뜻과 문맥 속 쓰임을 함께 배워야 한다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '전시 제목용 낱말 "선명하다"의 문맥 속 어울리는 예문 찾고 내 문장 만들기',
      mismatch: 'AI가 만들어준 예문 중 하나가 어색함 ("소리가 선명하게 달콤하다")',
      evidence: ['상황 그림 3종', '어울리는 예문 / 어색한 예문'],
      resolution: '문맥에 어울리는 예문을 판별하고 내 생각 문장을 직접 작성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '어색한 예문 판별하기',
        instruction: 'AI가 만든 "선명하다" 예문 중 상황에 어울리지 않는 문장을 찾아보세요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '낱말의 쓰임에 맞지 않는 어색한 예문은?',
          choices: [
            { id: 'wrong-context', label: '소리가 선명하게 달콤한 맛이 난다', emoji: '❌' },
            { id: 'right-context', label: '사진 속 글씨가 선명하게 잘 보인다', emoji: '⭕' },
          ],
        },
        assetIds: ['m3-l4-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '내 문장 직접 만들기',
        instruction: '낱말의 뜻과 어울리는 쓰임을 활용해 나만의 올바른 문장을 작성하세요.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '"선명하다" 낱말을 넣은 내 문장을 만들어보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'my-sentence', label: '비가 그치고 하늘에 무지개가 선명하게 떠올랐어요.', emoji: '🌈' },
          ],
        },
        assetIds: ['m3-l4-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm3-l4-artifact',
      title: '문맥 낱말 카드',
      portfolioLabel: '뜻과 내 문장이 담긴 문맥 낱말 카드',
      fields: [
        { id: 'mySentDef', label: '내가 낱말을 넣어 직접 만든 올바른 문장', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '풍부하다 낱말 활용',
      scenario: '"풍부하다" 낱말을 넣어 교실 전시 설명 문장을 만들 때 어울리는 표현은?',
      activity: {
        id: 'act-transfer-m3-l4',
        kind: 'single-choice',
        prompt: '"풍부하다"의 올바른 문장 표현은?',
        choices: [
          { id: 'rich-sent', label: '우리 동아리방에는 재미있는 과학 책이 풍부하게 있어요.', emoji: '📚' },
        ],
      },
    },
    assets: [
      { id: 'm3-l4-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l4-story-01.webp', alt: '상황 예문 비교', required: true, purpose: '스토리 컷 1' },
      { id: 'm3-l4-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l4-story-02.webp', alt: '전시 카드에 내 문장 붙이기', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '낱말은 단순 뜻뿐만 아니라 문맥에 어울리는 문장으로 써봐야 내 지식이 됩니다.',
  },

  // ============================================================
  // m3-l5 플래그십: AI와 이야기를 함께 만들기
  // ============================================================
  {
    lessonId: 'm3-l5',
    moduleId: 'm3',
    number: 5,
    role: 'flagship',
    title: 'AI와 이야기를 함께 만들기',
    masterObjective: '오늘은 AI의 이야기 제안을 골라 고치고 내 생각이 담긴 결말을 만들어 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['AI 제안은 재료이며 창작의 선택과 책임은 학생에게 있다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'aimi'],
      location: '비 오는 학교',
      purpose: '비 오는 학교에 남겨진 작은 로봇 이야기의 결말을 내 생각으로 완성하기',
      mismatch: '아이미가 무섭고 불안한 결말을 제안함',
      evidence: ['스토리 시작 1컷', 'AI 제안 결말 2종', '빈 3컷 보드'],
      resolution: '무서운 제안 대신 따뜻하고 밝은 해결 결말을 골라 3컷 만화 보드를 완성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '이야기 시작과 AI의 제안',
        instruction: '비 오는 날 교실에 남겨진 작은 로봇 이야기의 시작을 확인하세요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '아이미가 무서운 결말을 제안했을 때 진우의 반응은?',
          choices: [
            { id: 'change-end', label: '마음에 들지 않아서 따뜻하고 밝은 해결 결말로 바꾸고 싶어요', emoji: '☀️' },
          ],
        },
        assetIds: ['m3-l5-story-01', 'm3-l5-story-02'],
        support: {},
      },
      {
        id: 's2-condition-change',
        phase: 'condition-change',
        title: '이야기 분위기 수정',
        instruction: 'AI 제안은 아이디어 재료일 뿐입니다. 내 생각대로 결말 방향을 조정하세요.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '내가 원하는 이야기 결말 분위기를 선택하고 이유를 적어보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'warm-end', label: '친구들과 힘을 모아 로봇을 무사히 구해주는 따뜻한 결말', emoji: '🤗' },
            { id: 'clever-end', label: '로봇 스스로 전원을 끄고 우산을 펴며 기다리는 똑똑한 결말', emoji: '☂️' },
          ],
        },
        assetIds: ['m3-l5-story-03'],
        support: {},
      },
      {
        id: 's3-compare',
        phase: 'compare',
        title: '3컷 스토리보드 조립',
        instruction: '시작 - 중간 - 내가 정한 결말 카드를 3컷 스토리보드에 순서대로 놓으세요.',
        activity: {
          id: 'act-s3',
          kind: 'build',
          prompt: '3컷 이야기 보드를 조립해보세요.',
          slots: [
            { id: 'cut1', label: '1컷: 시작 (비 오는 학교의 작은 로봇)' },
            { id: 'cut2', label: '2컷: 진행 (로봇을 발견한 진우)' },
            { id: 'cut3', label: '3컷: 내 결말 (따뜻한 구조 성공)' },
          ],
          pieces: [
            { id: 'p1', label: '빗소리 속 작은 로봇', slotId: 'cut1' },
            { id: 'p2', label: '수건을 들고 달려오는 진우', slotId: 'cut2' },
            { id: 'p3', label: '따뜻하게 닦아주고 함께 웃는 결말', slotId: 'cut3' },
          ],
        },
        assetIds: ['m3-l5-story-04'],
        support: {},
      },
      {
        id: 's4-decision',
        phase: 'decision',
        title: '창작의 주체 확인',
        instruction: '이야기 창작에서 최종 결정과 선택을 하는 주인은 누구인가요?',
        activity: {
          id: 'act-s4',
          kind: 'single-choice',
          prompt: 'AI 제안과 나의 창작 관계는?',
          choices: [
            { id: 'human-creator', label: 'AI 제안은 재미있는 재료이고 최종 선택과 만들기는 내가 해요', emoji: '🎨' },
          ],
        },
        assetIds: ['m3-l5-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm3-l5-artifact',
      title: '3컷 이야기 보드',
      portfolioLabel: 'AI 제안을 수정해 완성한 3컷 창작 스토리',
      fields: [
        { id: 'storyEnding', label: '내가 직접 결정한 이야기 결말과 이유', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '동화 재구성 창작',
      scenario: '알라딘 동화 결말을 AI와 함께 바꿀 때 내 생각을 넣는 방법은?',
      activity: {
        id: 'act-transfer-m3-l5',
        kind: 'single-choice',
        prompt: 'AI 제안 동화 결말을 다룰 때 할 일은?',
        choices: [
          { id: 'my-ending-choice', label: 'AI 아이디어 중 마음에 드는 조각을 골라 내 결말로 완성해요', emoji: '📖' },
        ],
      },
    },
    assets: [
      { id: 'm3-l5-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l5-story-01.webp', alt: '비 오는 학교 작은 로봇', required: true, purpose: '스토리 컷 1' },
      { id: 'm3-l5-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l5-story-02.webp', alt: '무서운 제안 화면', required: true, purpose: '스토리 컷 2' },
      { id: 'm3-l5-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l5-story-03.webp', alt: '밝은 결말 선택', required: true, purpose: '스토리 컷 3' },
      { id: 'm3-l5-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l5-story-04.webp', alt: '완성된 만화 보드 발표', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: 'AI 제안은 좋은 아이디어 재료이며 이야기의 최종 결정과 창작은 학생의 생각으로 완성합니다.',
  },

  // ============================================================
  // m3-l6 안내 연습: 계산은 다른 도구로 확인하기
  // ============================================================
  {
    lessonId: 'm3-l6',
    moduleId: 'm3',
    number: 6,
    role: 'guided',
    title: '계산은 다른 도구로 확인하기',
    masterObjective: '오늘은 생활 계산을 먼저 예상하고 계산기로 확인한 뒤 AI 풀이에서 틀린 부분을 찾아봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['계산기는 정확한 계산에 적합하고 AI는 풀이 설명을 도울 수 있지만 둘의 결과를 구분해 확인한다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '전시 간식 구매 가격(500원+1200원+800원)을 계산기로 확인하고 AI 풀이 오류 찾기',
      mismatch: 'AI가 과정 설명은 그럴듯하게 썼으나 최종 합계 숫자 계산을 틀림 (2700원을 3000원으로 냄)',
      evidence: ['간식 가격표', '계산기 화면', 'AI 풀이 과정'],
      resolution: '수치 계산은 계산기로 정확히 구하고 AI 풀이의 계산 숫자를 수정함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '계산기와 AI 풀이 비교',
        instruction: '가격표(500원, 1200원, 800원)의 합계를 계산기로 직접 계산해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'calculate',
          prompt: '계산기로 정확한 합계를 계산해보세요.',
          values: [500, 1200, 800],
          operation: '+',
          unit: '원',
          expectedResult: 2500,
          aiProposedResult: 2800,
        },
        assetIds: ['m3-l6-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '오류 수정하기',
        instruction: '숫자 계산은 계산기를 우선하고, AI에는 풀이 단계 설명을 부탁하는 역할 분담을 합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '계산 업무에서 도구 선택 원칙으로 올바른 것은?',
          choices: [
            { id: 'calc-tool-first', label: '정확한 숫자 합계는 계산기로 구하고 AI 결과는 검산해요', emoji: '🔢' },
          ],
        },
        assetIds: ['m3-l6-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm3-l6-artifact',
      title: '계산-검산 기록',
      portfolioLabel: '계산기 합계 및 AI 풀이 오류 수정표',
      fields: [
        { id: 'correctSum', label: '계산기로 직접 확인한 정확한 합계', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '거스름돈 계산 확인',
      scenario: '10000원을 내고 6500원 물건을 샀을 때 거스름돈 확인 방법은?',
      activity: {
        id: 'act-transfer-m3-l6',
        kind: 'single-choice',
        prompt: '거스름돈 확인에 가장 적절한 도구는?',
        choices: [
          { id: 'calc-change', label: '계산기로 10000 - 6500 = 3500원을 정확히 검산해요', emoji: '💵' },
        ],
      },
    },
    assets: [
      { id: 'm3-l6-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l6-story-01.webp', alt: '가격표와 계산기 비교', required: true, purpose: '스토리 컷 1' },
      { id: 'm3-l6-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l6-story-02.webp', alt: '오류 풀이 수정', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '정확한 수치 계산은 계산기를 기본 도구로 사용하고 AI 풀이는 대조 확인합니다.',
  },

  // ============================================================
  // m3-l7 안내 연습: 긴 글의 핵심을 남기기
  // ============================================================
  {
    lessonId: 'm3-l7',
    moduleId: 'm3',
    number: 7,
    role: 'guided',
    title: '긴 글의 핵심을 남기기',
    masterObjective: '오늘은 긴 글에서 꼭 남길 내용을 고르고 세 문장 요약을 원문과 비교해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['요약은 주제와 중요한 정보를 남기고 세부 내용을 줄이는 일이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'aimi'],
      location: '동아리방',
      purpose: '긴 전시 설명문(7문장)에서 꼭 남길 핵심 3가지 선택해 요약 완성하기',
      mismatch: 'AI 요약에 중요한 준비 시간이 제외됨',
      evidence: ['원문 7문장', 'AI 3문장 요약'],
      resolution: '핵심 카드 3개를 고르고 빠진 준비 시간을 추가해 완벽한 3문장 요약판을 완성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '긴 글에서 핵심 선택하기',
        instruction: '긴 전시 설명문에서 꼭 남겨야 할 주요 정보 3가지를 골라보세요.',
        activity: {
          id: 'act-s1',
          kind: 'multi-choice',
          prompt: '원문에서 꼭 남길 핵심 3가지를 선택하세요.',
          choices: [
            { id: 'k1', label: '행사 주제 (AI 도움 배움 전시)', emoji: '📌' },
            { id: 'k2', label: '시작 및 준비 시간 (오후 1시)', emoji: '⏰' },
            { id: 'k3', label: '방문자 수칙 (차례대로 관람)', emoji: '🚶' },
          ],
        },
        assetIds: ['m3-l7-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '3문장 요약판 대조',
        instruction: 'AI 요약과 원문을 대조하여 빠진 준비 시간을 복원하세요.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '요약글 수정 시 할 일은?',
          choices: [
            { id: 'restore-time', label: '빠진 준비 시간 정보를 추가해 세 문장 요약을 완성해요', emoji: '📝' },
          ],
        },
        assetIds: ['m3-l7-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm3-l7-artifact',
      title: '3문장 요약판',
      portfolioLabel: '원문 근거가 연결된 3문장 핵심 요약문',
      fields: [
        { id: 'finalSummary', label: '내가 완성한 3문장 핵심 요약', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '동화책 요약 연습',
      scenario: '긴 동화책을 세 문장으로 줄여 친구에게 소개할 때 기억할 점은?',
      activity: {
        id: 'act-transfer-m3-l7',
        kind: 'single-choice',
        prompt: '좋은 요약의 기준은?',
        choices: [
          { id: 'keep-main', label: '자잘한 줄거리 대신 주인공과 가장 중요한 사건만 남겨요', emoji: '📖' },
        ],
      },
    },
    assets: [
      { id: 'm3-l7-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l7-story-01.webp', alt: '긴 글 앞 고민', required: true, purpose: '스토리 컷 1' },
      { id: 'm3-l7-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l7-story-02.webp', alt: '세 문장 안내판 완성', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '좋은 요약은 세부 내용은 줄이고 주제와 가장 중요한 정보 3가지를 정확히 남기는 것입니다.',
  },

  // ============================================================
  // m3-l8 안내 연습: 정답을 나중에 보는 퀴즈
  // ============================================================
  {
    lessonId: 'm3-l8',
    moduleId: 'm3',
    number: 8,
    role: 'guided',
    title: '정답을 나중에 보는 퀴즈',
    masterObjective: '오늘은 배운 내용으로 문제를 만들고 먼저 풀어 본 뒤 정답과 이유를 확인해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['퀴즈는 회상->응답->피드백->다시 풀기의 순서로 학습을 돕는다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'aimi'],
      location: '동아리방',
      purpose: '전시 방문자용 퀴즈 부스를 만들 때 정답이 미리 보이는 문제 해결하기',
      mismatch: 'AI 퀴즈가 문제와 정답을 한 화면에 같이 출력해버림',
      evidence: ['앞/뒤 퀴즈 카드 템플릿'],
      resolution: '정답 가림막을 적용하여 회상->응답->정답 확인 학습 루프를 완성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '정답 가림막과 회상',
        instruction: '정답이 미리 보이지 않도록 가린 상태에서 먼저 생각하고 답을 골라보세요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '퀴즈를 풀 때 올바른 순서는?',
          choices: [
            { id: 'recall-first', label: '1. 정답을 가리고 내가 먼저 푼다 -> 2. 뒤집어 정답과 이유 확인', emoji: '🎴' },
          ],
        },
        assetIds: ['m3-l8-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '친구에게 낼 문제 만들기',
        instruction: '오늘 배운 내용으로 문제, 정답, 해설 카드를 만들어보세요.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '친구에게 낼 퀴즈 문제 하나를 작성해봅시다.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'q-create', label: '문제: AI가 만든 요약은 무조건 사실일까요? (정답: X)', emoji: '❓' },
          ],
        },
        assetIds: ['m3-l8-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm3-l8-artifact',
      title: '퀴즈 카드',
      portfolioLabel: '문제-정답-해설이 분리된 복습 퀴즈 카드',
      fields: [
        { id: 'quizQuestion', label: '내가 직접 만든 복습 퀴즈 문제', input: 'text', required: true },
        { id: 'quizAnswer', label: '정답 및 이유 해설', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '시험 대비 자가 퀴즈',
      scenario: '단원 평가를 준비할 때 퀴즈 카드를 활용하는 가장 좋은 방법은?',
      activity: {
        id: 'act-transfer-m3-l8',
        kind: 'single-choice',
        prompt: '자가 퀴즈 학습법으로 옳은 것은?',
        choices: [
          { id: 'self-test', label: '정답 부분을 손으로 가리고 내가 스스로 답한 뒤 확인해요', emoji: '✍️' },
        ],
      },
    },
    assets: [
      { id: 'm3-l8-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l8-story-01.webp', alt: '정답이 먼저 보임', required: true, purpose: '스토리 컷 1' },
      { id: 'm3-l8-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l8-story-02.webp', alt: '완성된 퀴즈 부스', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '퀴즈는 정답을 가리고 스스로 먼저 생각해본 뒤 이유를 확인할 때 공부가 가장 잘 됩니다.',
  },

  // ============================================================
  // m3-l9 플래그십: 그림에서 사실과 추측 나누기
  // ============================================================
  {
    lessonId: 'm3-l9',
    moduleId: 'm3',
    number: 9,
    role: 'flagship',
    title: '그림에서 사실과 추측 나누기',
    masterObjective: '오늘은 그림에서 직접 보이는 사실과 AI가 덧붙인 추측을 나누고 설명을 고쳐 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['이미지 설명은 보이는 근거와 확실하지 않은 추측을 구분해야 한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'aimi'],
      location: '동아리방',
      purpose: '가방을 든 두 학생 사진에서 확실한 사실과 AI의 넘겨짚은 추측 구분하기',
      mismatch: 'AI가 "두 학생이 소풍을 가며 기뻐하고 있다"고 단정적으로 추측함',
      evidence: ['가방 든 학생 사진', 'AI 설명 문장 목록'],
      resolution: '눈에 보이는 관찰 사실(가방을 멺)과 확실치 않은 추측(소풍 감)을 구분해 설명을 고침',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '그림 관찰과 AI 설명의 어긋남',
        instruction: '가방을 든 두 학생 사진을 보고 AI가 한 설명을 관찰해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: 'AI 설명 "두 학생이 소풍을 간다"에서 이상한 점은?',
          choices: [
            { id: 'guess-over', label: '가방은 보이지만 소풍을 가는지 등교를 하는지는 확실하지 않은 추측이에요', emoji: '🧐' },
          ],
        },
        assetIds: ['m3-l9-story-01', 'm3-l9-story-02'],
        support: {},
      },
      {
        id: 's2-compare',
        phase: 'compare',
        title: '보이는 사실과 추측 나누기',
        instruction: 'AI 설명 문장들을 눈에 보이는 근거(사실)와 생각(추측)으로 분리하세요.',
        activity: {
          id: 'act-s2',
          kind: 'sort',
          prompt: '각 문장을 보이는 사실과 추측 상자에 나누어 놓으세요.',
          bins: [
            { id: 'b-fact', label: '눈에 보이는 사실', emoji: '👁️' },
            { id: 'b-guess', label: '불확실한 추측', emoji: '💭' },
          ],
          cards: [
            { id: 'c-bag', label: '두 학생이 가방을 메고 있다', binId: 'b-fact' },
            { id: 'c-trip', label: '오늘 소풍을 가는 길이다', binId: 'b-guess' },
            { id: 'c-smile', label: '기분이 아주 신나 보인다', binId: 'b-guess' },
          ],
        },
        assetIds: ['m3-l9-story-02', 'm3-l9-story-03'],
        support: {},
      },
      {
        id: 's3-decision',
        phase: 'decision',
        title: '그림 설명문 고치기',
        instruction: '추측을 빼고 눈에 보이는 확실한 사실만으로 그림 설명을 다듬어보세요.',
        activity: {
          id: 'act-s3',
          kind: 'expression',
          prompt: '사실에 기반한 올바른 그림 설명을 작성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'fact-desc', label: '가방을 멘 두 학생이 길을 걸어가고 있는 모습입니다.', emoji: '🎒' },
          ],
        },
        assetIds: ['m3-l9-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm3-l9-artifact',
      title: '사실-추측 분리표',
      portfolioLabel: '그림 관찰 근거에 따른 사실과 추측 구분표',
      fields: [
        { id: 'factOnlyDesc', label: '보이는 사실만으로 작성한 고쳐진 그림 설명', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '동물 사진 설명 구분',
      scenario: '강아지가 누워있는 사진을 보고 AI가 "강아지가 심심해서 슬퍼하고 있다"고 할 때 할 일은?',
      activity: {
        id: 'act-transfer-m3-l9',
        kind: 'single-choice',
        prompt: '동물 사진 AI 설명에서 지켜야 할 것은?',
        choices: [
          { id: 'dog-fact', label: '누워있다는 것은 사실이지만 슬프다는 것은 AI의 추측임을 구분해요', emoji: '🐶' },
        ],
      },
    },
    assets: [
      { id: 'm3-l9-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l9-story-01.webp', alt: '가방 든 학생 사진', required: true, purpose: '스토리 컷 1' },
      { id: 'm3-l9-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l9-story-02.webp', alt: '사실과 추측 구분', required: true, purpose: '스토리 컷 2' },
      { id: 'm3-l9-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l9-story-03.webp', alt: '근거 핀 꽂기', required: true, purpose: '스토리 컷 3' },
      { id: 'm3-l9-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l9-story-04.webp', alt: '완성된 그림 설명서', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '그림을 볼 때는 직접 눈에 보이는 확실한 사실과 AI의 넘겨짚은 추측을 명확히 구분해야 합니다.',
  },

  // ============================================================
  // m3-l10 안내 연습: 오늘 배운 것을 내 말로 복습하기
  // ============================================================
  {
    lessonId: 'm3-l10',
    moduleId: 'm3',
    number: 10,
    role: 'guided',
    title: '오늘 배운 것을 내 말로 복습하기',
    masterObjective: '오늘은 내가 배운 자료를 고르고 AI 요약을 내 말로 다시 설명해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['복습은 자료 선택->회상->확인->자기 설명으로 이루어진다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'aimi'],
      location: '동아리방',
      purpose: '이번 모듈에서 만든 낱말, 요약, 계산, 이야기 자료 중 하나를 골라 자기 말로 복습하기',
      mismatch: 'AI 요약만 읽는 것으로는 스스로 복습이 잘 되었는지 확인하기 어려움',
      evidence: ['이전 산출물 썸네일 묶음'],
      resolution: '보지 않고 스스로 먼저 설명해본 뒤 AI 요약과 비교하여 보완함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '복습할 산출물 선택',
        instruction: '모듈 3에서 작성한 나의 공부 기록 중 하나를 고르세요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '오늘 복습할 공부 산출물을 선택하세요.',
          choices: [
            { id: 'pick-word', label: '생태계 낱말 카드 복습하기', emoji: '🌱' },
            { id: 'pick-summary', label: '3문장 핵심 요약판 복습하기', emoji: '📄' },
          ],
        },
        assetIds: ['m3-l10-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '보지 않고 내 말로 회상하기',
        instruction: '자료를 보지 않고 핵심 내용을 내 말로 먼저 설명해본 뒤 AI 요약과 비교해봅시다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '선택한 배움을 보지 않고 내 말로 설명해보세요.',
          modes: ['choice', 'text', 'speech'],
          choiceCards: [
            { id: 'my-recall', label: '생물과 환경이 함께 살아가며 서로 영향을 주는 자연 세계예요!', emoji: '🗣️' },
          ],
        },
        assetIds: ['m3-l10-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm3-l10-artifact',
      title: '복습 카드',
      portfolioLabel: '자기 회상과 내 말 설명 복습 기록',
      fields: [
        { id: 'selfExplanation', label: '내가 보지 않고 직접 설명한 복습 내용', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '오늘 수업 복습 습관',
      scenario: '오늘 학교 수업이 끝나고 집에서 복습할 때 가장 좋은 방법은?',
      activity: {
        id: 'act-transfer-m3-l10',
        kind: 'single-choice',
        prompt: '효과적인 복습 방법은?',
        choices: [
          { id: 'explain-myself', label: '공책을 덮고 오늘 배운 핵심을 내 말로 가족에게 말해봐요', emoji: '🏠' },
        ],
      },
    },
    assets: [
      { id: 'm3-l10-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l10-story-01.webp', alt: '기록 썸네일 선택', required: true, purpose: '스토리 컷 1' },
      { id: 'm3-l10-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l10-story-02.webp', alt: '자기 말로 설명 복습', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '복습은 요약을 읽기만 하는 것이 아니라, 보지 않고 내 말로 직접 설명해볼 때 진짜 공부가 됩니다.',
  },

  // ============================================================
  // m3-l11 프로젝트: 나의 공부 도우미 도구함
  // ============================================================
  {
    lessonId: 'm3-l11',
    moduleId: 'm3',
    number: 11,
    role: 'project',
    title: '나의 공부 도우미 도구함',
    masterObjective: '오늘은 공부할 때 AI에게 맡길 일과 내가 직접 할 일을 정해 나의 공부 도구함을 완성해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01, STANDARD_CODES.SPEC_AI_02, STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['AI는 질문·설명·연습을 돕지만 제출할 생각과 표현은 학생의 것이며 결과를 확인해야 한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '학교 배움 전시회',
      purpose: '"숙제를 AI가 다 해줘도 돼?"라는 새 친구의 질문에 공부 도구함과 사용 규칙으로 답하기',
      mismatch: 'AI가 숙제를 다 해주면 공부가 된다고 오해함',
      evidence: ['l1~l10 공부 도구 산출물 묶음'],
      resolution: 'AI 도움 범위와 사람 직접 수행 규칙이 담긴 <나의 공부 도우미 도구함>을 완성해 전시 발표함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '새 친구의 질문과 공부 도구 모으기',
        instruction: '"숙제를 AI가 다 써줘도 돼?"라는 새 친구 질문에 모듈 3 공부 기록으로 답해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: 'AI 공부 도구함의 가장 중요한 원칙을 선택하세요.',
          choices: [
            { id: 'start-toolkit', label: 'AI는 설명과 힌트를 돕고, 제출할 생각과 글은 내가 완성해요!', emoji: '🧰' },
          ],
        },
        assetIds: ['m3-l11-story-01', 'm3-l11-story-02'],
        support: {},
      },
      {
        id: 's2-artifact',
        phase: 'artifact',
        title: '나의 공부 도우미 도구함 완성하기',
        instruction: 'AI 질문 도구, 계산 확인, 요약 대조 서랍에 나의 사용 규칙을 조립하세요.',
        activity: {
          id: 'act-s2',
          kind: 'build',
          prompt: '공부 도구함 서랍에 올바른 사용 규칙을 놓아보세요.',
          slots: [
            { id: 'drawer-q', label: '1서랍: AI 질문 및 힌트 도구' },
            { id: 'drawer-calc', label: '2서랍: 수치 계산 및 검산' },
            { id: 'drawer-write', label: '3서랍: 요약 및 글 작성' },
          ],
          pieces: [
            { id: 'p-q', label: '이유와 특징을 구체적으로 질문하기', slotId: 'drawer-q' },
            { id: 'p-c', label: '숫자 계산은 계산기로 직접 확인하기', slotId: 'drawer-calc' },
            { id: 'p-w', label: '원문과 대조하고 제출 글은 내 말로 고쳐 쓰기', slotId: 'drawer-write' },
          ],
        },
        assetIds: ['m3-l11-story-03'],
        support: {},
      },
    ],
    artifact: {
      id: 'm3-l11-artifact',
      title: '나의 공부 도우미 도구함',
      portfolioLabel: '모듈 3 올바른 AI 공부 활용 도구함',
      fields: [
        { id: 'toolRule1', label: '1. AI 질문 및 설명 활용 규칙', input: 'text', required: true },
        { id: 'toolRule2', label: '2. 수치 계산 및 외부 검산 규칙', input: 'text', required: true },
        { id: 'toolRule3', label: '3. 내 생각 직접 표현 및 작성 규칙', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '배움 전시회 발표',
      scenario: '완성한 공부 도구함을 전시하고 올바른 AI 공부 태도를 발표해봐요.',
      activity: {
        id: 'act-transfer-m3-l11',
        kind: 'single-choice',
        prompt: '배움 전시회 발표를 마칠 준비가 되었나요?',
        choices: [
          { id: 'present-toolkit', label: '네, 나의 공부 도우미 도구함을 자랑스럽게 발표해요!', emoji: '🎓' },
        ],
      },
    },
    assets: [
      { id: 'm3-l11-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l11-story-01.webp', alt: '새 친구의 질문', required: true, purpose: '스토리 컷 1' },
      { id: 'm3-l11-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l11-story-02.webp', alt: '도구 서랍 정리', required: true, purpose: '스토리 컷 2' },
      { id: 'm3-l11-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m3/m3-l11-story-03.webp', alt: '도구함 전시 발표', required: true, purpose: '스토리 컷 3' },
    ],
    wrapUp: 'AI는 공부를 도와주는 훌륭한 도우미이지만, 진짜 지식과 생각의 주인은 언제나 나 자신입니다.',
  },
];
