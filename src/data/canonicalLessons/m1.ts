import type { CanonicalLessonDesign } from './types';
import { STANDARD_CODES } from './shared';

export const M1_CANONICAL_LESSONS: CanonicalLessonDesign[] = [
  // ============================================================
  // m1-l1 플래그십: 아이미와 처음 만난 날
  // ============================================================
  {
    lessonId: 'm1-l1',
    moduleId: 'm1',
    number: 1,
    role: 'flagship',
    title: '아이미와 처음 만난 날',
    masterObjective: 'AI(인공지능)의 뜻과 할 수 있는 일을 찾아요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['AI(인공지능)는 사람의 생각하는 방식을 비슷하게 만들어 내어 문제 해결을 돕는 기술이며, 입력을 받아 다양한 결과와 도움을 줄 수 있다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'aimi', 'minjun'],
      location: '동아리방',
      purpose: '새 로봇 아이미를 만나 AI(인공지능)의 뜻과 할 수 있는 일을 알아보기',
      mismatch: '아이미의 기계 용어 설명을 듣고 AI의 뜻과 할 수 있는 일이 무엇인지 궁금해함',
      evidence: ['스마트폰 음악 추천', '자동 번역', '사진 속 동물 찾기'],
      resolution: '생활 속 사례를 통해 AI(인공지능)의 뜻과 할 수 있는 일을 쉽게 정의함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '아이미와의 첫 만남',
        instruction: '진우가 동아리방에서 새 로봇 아이미를 만났어요. 아이미가 들려주는 인공지능 이야기를 들어볼까요?',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '아이미가 말한 인공지능(AI)은 무슨 뜻일까요?',
          choices: [
            { id: 'human-tool', label: '사람의 생각하는 방식을 비슷하게 만들어 내어 문제 해결을 돕는 기술이라는 뜻이에요', emoji: '🤖' },
            { id: 'magic-robot', label: '스스로 태어난 마법 로봇이라는 뜻이에요', emoji: '🪄' },
          ],
        },
        assetIds: ['m1-l1-story-01'],
        support: {
          full: { hint: '인공지능은 사람의 생각하는 방식을 비슷하게 만들어 내어 문제 해결을 도와주는 도구예요.' },
        },
      },
      {
        id: 's2-first-attempt',
        phase: 'first-attempt',
        title: 'AI가 할 수 있는 일 찾기',
        instruction: '우리가 일상에서 만나는 AI는 어떤 일을 할 수 있을까요?',
        activity: {
          id: 'act-s2',
          kind: 'multi-choice',
          prompt: 'AI가 우리 생활 속에서 도와줄 수 있는 일을 모두 골라보세요.',
          choices: [
            { id: 'music', label: '내가 좋아하는 음악 추천하기', emoji: '🎵' },
            { id: 'translate', label: '다른 나라 말을 빠르게 번역하기', emoji: '🔤' },
            { id: 'photo', label: '사진 속 강아지 모습 찾아내기', emoji: '🐶' },
          ],
        },
        assetIds: ['m1-l1-story-02', 'm1-l1-story-03'],
        support: {},
      },
      {
        id: 's3-concept',
        phase: 'concept',
        title: 'AI가 일을 해내는 과정',
        instruction: 'AI는 사람이 준 입력(소리, 글, 사진)을 바탕으로 할 수 있는 일(결과)을 만들어냅니다.',
        activity: {
          id: 'act-s3',
          kind: 'sort',
          prompt: 'AI가 답을 만드는 과정(입력 -> AI -> 결과)을 알맞게 놓아보세요.',
          bins: [
            { id: 'input', label: '1. 입력 (주는 정보)', emoji: '📥' },
            { id: 'ai', label: '2. AI 과정', emoji: '🤖' },
            { id: 'output', label: '3. 결과 (만드는 도움)', emoji: '📤' },
          ],
          cards: [
            { id: 'c1', label: '사진 보여주기', binId: 'input' },
            { id: 'c2', label: '자료 비교하고 처리하기', binId: 'ai' },
            { id: 'c3', label: '동물 이름 알려주기', binId: 'output' },
          ],
        },
        assetIds: ['m1-l1-concept-01'],
        support: {},
      },
      {
        id: 's4-decision',
        phase: 'decision',
        title: '나만의 AI 정의 카드 조립',
        instruction: 'AI(인공지능)의 뜻과 할 수 있는 일을 쉬운 문장으로 완성해보세요.',
        activity: {
          id: 'act-s4',
          kind: 'expression',
          prompt: 'AI(인공지능)는 어떤 도구인가요?',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'def1', label: '사람의 생각하는 방식을 비슷하게 만들어 내어 번역과 추천을 도와줘요', emoji: '💡' },
            { id: 'def2', label: '자료를 학습하고 판단하여 필요한 답과 결과를 찾아주는 프로그램이에요', emoji: '🔍' },
          ],
        },
        assetIds: ['m1-l1-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm1-l1-artifact',
      title: 'AI 정의 카드',
      portfolioLabel: '내가 정의한 AI 개념 카드',
      fields: [
        { id: 'myDefinition', label: 'AI는 무슨 뜻이고 어떤 일을 할 수 있나요?', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '새로운 생활 도구 적용',
      scenario: '스마트폰의 음성 안내 기능을 만났을 때 이 기능이 AI 도구인지 판단해봐요.',
      activity: {
        id: 'act-transfer-m1-l1',
        kind: 'single-choice',
        prompt: '음성 안내 기능도 AI일까요?',
        choices: [
          { id: 'yes', label: '네, 음성 입력을 받아 결과를 알려주는 인공지능 도구예요', emoji: '⭕' },
        ],
      },
    },
    assets: [
      { id: 'm1-l1-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l1-story-01.webp', alt: '첫 만남', required: true, purpose: '스토리 컷 1' },
      { id: 'm1-l1-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l1-story-02.webp', alt: '어려운 설명', required: true, purpose: '스토리 컷 2' },
      { id: 'm1-l1-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l1-story-03.webp', alt: '생활 속 AI 사례', required: true, purpose: '스토리 컷 3' },
      { id: 'm1-l1-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l1-story-04.webp', alt: '자기 정의 발표', required: true, purpose: '스토리 컷 4' },
      { id: 'm1-l1-concept-01', kind: 'concept', renderAs: 'html', alt: '입력 -> AI -> 결과 개념도', required: false, purpose: '개념도' },
    ],
    wrapUp: 'AI(인공지능)는 컴퓨터가 사람의 생각하는 방식을 비슷하게 학습하고 판단하는 기술로, 입력된 정보로 번역·추천·분류 같은 일을 해냅니다.',
  },

  // ============================================================
  // m1-l2 안내 연습: 기계와 AI는 어떻게 다를까?
  // ============================================================
  {
    lessonId: 'm1-l2',
    moduleId: 'm1',
    number: 2,
    role: 'guided',
    title: '기계와 AI는 어떻게 다를까?',
    masterObjective: '오늘은 기계가 결과를 바꾸는 데 어떤 정보를 쓰는지 살펴보고 AI가 쓰인 기능을 찾아봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['자동화·센서·AI는 겹칠 수 있으며, 기기 전체가 아니라 기능과 입력을 보고 판단한다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '선풍기, 자동문, 음악 추천 앱의 입력 정보와 작동 방식 구분하기',
      mismatch: '모든 기기가 똑같이 똑똑한 AI처럼 보임',
      evidence: ['버튼 조작', '센서 감지', '사용 기록 추천'],
      resolution: '기능별 입력 정보를 확인하여 AI 활용 기능을 구분함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '세 도구 관찰하기',
        instruction: '선풍기, 자동문, 음악 추천 앱은 각각 무엇을 보고 작동할까요?',
        activity: {
          id: 'act-s1',
          kind: 'sort',
          prompt: '각 기기와 필요한 입력 정보를 연결해보세요.',
          bins: [
            { id: 'fan', label: '선풍기', emoji: '🌀' },
            { id: 'door', label: '자동문', emoji: '🚪' },
            { id: 'app', label: '음악 추천 앱', emoji: '📱' },
          ],
          cards: [
            { id: 'c1', label: '사람이 누른 버튼 신호', binId: 'fan' },
            { id: 'c2', label: '사람이 앞에 서는 센서 감지', binId: 'door' },
            { id: 'c3', label: '내가 자주 듣는 음악 추천 기록', binId: 'app' },
          ],
        },
        assetIds: ['m1-l2-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '기능과 입력으로 판단하기',
        instruction: '기기 전체가 아니라 그 기능이 무엇을 입력받는지 봐야 합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '음악 추천 앱처럼 나의 사용 패턴 자료를 바탕으로 예측하는 기능은 무엇일까요?',
          choices: [
            { id: 'ai-feat', label: '자료를 분석해 추천하는 AI 기능이에요', emoji: '🤖' },
            { id: 'button-feat', label: '단순히 누르면 켜지는 자동화 버튼이에요', emoji: '🔘' },
          ],
        },
        assetIds: ['m1-l2-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm1-l2-artifact',
      title: '기능 설계 카드',
      portfolioLabel: '도구별 입력과 기능 분석표',
      fields: [
        { id: 'toolAnalysis', label: 'AI 기능이 포함된 도구와 이유', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '로봇청소기 기능 분석',
      scenario: '로봇청소기가 장애물을 피하고 먼지가 많은 곳을 찾아 청소할 때 쓰인 기능을 찾아봐요.',
      activity: {
        id: 'act-transfer-m1-l2',
        kind: 'single-choice',
        prompt: '장애물 감지와 먼지 예측 청소는 어떤 기능인가요?',
        choices: [
          { id: 'sensor-ai', label: '센서 감지와 AI 분석이 함께 쓰였어요', emoji: '🧹' },
        ],
      },
    },
    assets: [
      { id: 'm1-l2-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l2-story-01.webp', alt: '세 도구 관찰', required: true, purpose: '스토리 컷 1' },
      { id: 'm1-l2-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l2-story-02.webp', alt: '기능 표 완성', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '기기 전체가 아니라 입력되는 정보와 동작 방식을 보면 AI 기능인지 알 수 있습니다.',
  },

  // ============================================================
  // m1-l3 안내 연습: AI는 어떻게 답을 만들까?
  // ============================================================
  {
    lessonId: 'm1-l3',
    moduleId: 'm1',
    number: 3,
    role: 'guided',
    title: 'AI는 어떻게 답을 만들까?',
    masterObjective: '오늘은 AI가 다음 말을 이어 답을 만드는 모습을 보고, 확인할 문장을 찾아봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['생성형 AI는 배운 자료에서 다음 표현을 예측해 답을 만들며 사실을 보장하지 않는다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '아이미가 작성한 동아리 소개 문장의 정확성 점검하기',
      mismatch: '자연스러운 문장이지만 행사 날짜가 실제 안내와 다름',
      evidence: ['아이미 작성 문장', '학교 공식 행사 공지'],
      resolution: '그럴듯한 문장 속에서 사실 확인이 필요한 부분을 골라냄',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '이어지는 단어 예측하기',
        instruction: '아이미가 동아리 소개 문장을 단어 단위로 완성해 나갑니다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '아이미는 문장을 어떻게 만드나요?',
          choices: [
            { id: 'predict', label: '배운 글에서 다음에 올 가장 어울리는 말을 이어 붙여요', emoji: '🔗' },
            { id: 'perfect', label: '모든 사실을 완벽히 검증해서 완성해요', emoji: '❌' },
          ],
        },
        assetIds: ['m1-l3-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '확인해야 할 정보 밑줄 치기',
        instruction: '자연스럽게 보이는 글도 진짜 날짜와 장소는 사람 학교 공지와 대조해야 합니다.',
        activity: {
          id: 'act-s2',
          kind: 'ai-compare',
          prompt: '아이미의 소개글 중 학교 공지와 비교해서 확인할 부분(날짜)을 찾아보세요.',
          source: { title: '학교 공식 공지', text: 'AI 동아리 체험회는 5월 10일 강당에서 열립니다.' },
          response: { title: '아이미가 만든 소개문', text: '즐거운 AI 동아리 체험회가 5월 15일 교실에서 열립니다!', isPrepared: true },
          criteria: [{ id: 'date', label: '날짜 및 장소 정확성' }],
          decisions: ['modify'],
        },
        assetIds: ['m1-l3-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm1-l3-artifact',
      title: '검토 기록표',
      portfolioLabel: '그대로 쓸 부분 / 확인할 부분 구분표',
      fields: [
        { id: 'checkItem', label: 'AI 답에서 사람이 꼭 확인해야 할 정보', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '날씨 소개글 검토',
      scenario: '아이미가 작성한 "오늘 서울 날씨는 따뜻한 화창한 봄날입니다" 글을 만났을 때 어떻게 할까요?',
      activity: {
        id: 'act-transfer-m1-l3',
        kind: 'single-choice',
        prompt: '그럴듯한 날씨 소개글을 보고 무엇을 해야 할까요?',
        choices: [
          { id: 'check-real', label: '기상청 공식 예보를 확인해서 진짜 맞는지 비교해요', emoji: '☀️' },
        ],
      },
    },
    assets: [
      { id: 'm1-l3-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l3-story-01.webp', alt: '문장을 만드는 아이미', required: true, purpose: '스토리 컷 1' },
      { id: 'm1-l3-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l3-story-02.webp', alt: '공지와 답 대조', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: 'AI는 그럴듯한 문장을 이어 만들지만, 중요한 날짜와 사실은 사람이 직접 확인해야 합니다.',
  },

  // ============================================================
  // m1-l4 플래그십: AI의 눈 실험실
  // ============================================================
  {
    lessonId: 'm1-l4',
    moduleId: 'm1',
    number: 4,
    role: 'flagship',
    title: 'AI의 눈 실험실',
    masterObjective: '오늘은 사진 조건을 바꾸어 AI의 답이 달라지는지 살펴보고 원본과 다시 비교해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['이미지 인식은 보이는 특징을 바탕으로 가능성이 높은 결과를 고르며 가림·각도·밝기에 영향을 받는다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '여우 사진 조건(가림막, 밝기, 각도)을 바꾸며 AI 인식 결과 시험하기',
      mismatch: '풀에 가려진 여우 사진을 아이미가 고양이로 오인함',
      evidence: ['원본 여우 사진', '가려진 여우 사진', '각도가 바뀐 사진'],
      resolution: '조건을 바꾸어 인식률이 달라짐을 확인하고 사람의 재확인이 필요함을 파악함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '가려진 여우 사진과 아이미의 오답',
        instruction: '윤아가 숲속 풀에 반쯤 가려진 동물 사진을 보여주자 아이미가 "고양이"라고 대답했어요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '아이미는 왜 고양이라고 답했을까요?',
          choices: [
            { id: 'hidden', label: '얼굴 일부가 가려져 뾰족한 귀 특징만 보고 고양이로 예측했어요', emoji: '🐱' },
            { id: 'lie', label: '아이미가 의도적으로 거짓말을 했어요', emoji: '❌' },
          ],
        },
        assetIds: ['m1-l4-story-01', 'm1-l4-story-02'],
        support: {},
      },
      {
        id: 's2-condition-change',
        phase: 'condition-change',
        title: '사진 조건 바꿔보기 실험',
        instruction: '가림막을 치우고 각도와 밝기를 조절해보세요.',
        activity: {
          id: 'act-s2',
          kind: 'adjust',
          prompt: '사진 가림 정도를 조절하며 AI의 인식 결과를 관찰해보세요.',
          controls: [
            { id: 'coverage', label: '사진 가림 정도', type: 'slider', min: 0, max: 100 },
          ],
          states: [
            { conditions: { coverage: 0 }, resultText: '여우 (가능성 95%)', confidence: 95 },
            { conditions: { coverage: 70 }, resultText: '고양이 (가능성 60%)', confidence: 60 },
          ],
        },
        assetIds: ['m1-l4-story-03'],
        support: {},
      },
      {
        id: 's3-compare',
        phase: 'compare',
        title: '원본과 비교 기록하기',
        instruction: '실험 결과를 정리해볼까요?',
        activity: {
          id: 'act-s3',
          kind: 'annotate',
          prompt: '사진에서 AI가 헷갈려했던 특징 부분(가려진 주둥이, 귀 모양)을 선택해보세요.',
          targetId: 'fox-photo',
          markers: [
            { id: 'm-ear', x: 40, y: 30, label: '뾰족한 귀 (고양이와 비슷)' },
            { id: 'm-tail', x: 70, y: 60, label: '풍성한 꼬리 (여우의 특징)' },
          ],
        },
        assetIds: ['m1-l4-story-04'],
        support: {},
      },
      {
        id: 's4-decision',
        phase: 'decision',
        title: '사진 인식 결과 확인 원칙',
        instruction: 'AI의 사진 인식 결과를 다룰 때 사람이 할 일은 무엇인가요?',
        activity: {
          id: 'act-s4',
          kind: 'single-choice',
          prompt: '흐리거나 가려진 사진을 AI가 판단했을 때의 올바른 행동을 고르세요.',
          choices: [
            { id: 'recheck', label: '선명한 원본을 사람이 직접 보고 결과를 확인해요', emoji: '👁️' },
          ],
        },
        assetIds: ['m1-l4-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm1-l4-artifact',
      title: '이미지 인식 실험 기록',
      portfolioLabel: '사진 조건별 AI 인식 변화 실험표',
      fields: [
        { id: 'conditionResult', label: '가림 조건에 따른 AI 결과 차이', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '흐린 분리배출 표지판 인식',
      scenario: '비닐에 구겨진 표지판 사진을 찍어 AI에게 물어보았을 때 어떻게 해야 할까요?',
      activity: {
        id: 'act-transfer-m1-l4',
        kind: 'single-choice',
        prompt: '구겨진 표지판 인식 결과를 만났을 때 올바른 선택은?',
        choices: [
          { id: 'flatten', label: '표지판을 펴서 다시 찍고 사람이 눈으로 한번 더 확인해요', emoji: '♻️' },
        ],
      },
    },
    assets: [
      { id: 'm1-l4-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l4-story-01.webp', alt: '가려진 여우 사진', required: true, purpose: '스토리 컷 1' },
      { id: 'm1-l4-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l4-story-02.webp', alt: '아이미의 오답', required: true, purpose: '스토리 컷 2' },
      { id: 'm1-l4-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l4-story-03.webp', alt: '조건 변경 실험', required: true, purpose: '스토리 컷 3' },
      { id: 'm1-l4-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l4-story-04.webp', alt: '실험 기록 확인', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '사진이 가려지거나 각도가 바뀌면 AI 답이 달라지므로 사람의 확인이 필요합니다.',
  },

  // ============================================================
  // m1-l5 안내 연습: AI의 귀는 어떻게 들을까?
  // ============================================================
  {
    lessonId: 'm1-l5',
    moduleId: 'm1',
    number: 5,
    role: 'guided',
    title: 'AI의 귀는 어떻게 들을까?',
    masterObjective: '오늘은 같은 말을 다른 조건에서 들려주고 인식된 글자를 비교해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['음성 인식은 소리를 글자로 바꾸며 소음·거리·마이크 상태의 영향을 받는다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'aimi'],
      location: '복도',
      purpose: '소음이 있는 복도에서 녹음된 음성 인식 결과 검토하기',
      mismatch: '주변 소음 때문에 인식된 글자가 일부 틀림',
      evidence: ['깨끗한 소리 녹음', '소음 섞인 소리 녹음'],
      resolution: '소음 조건의 영향을 이해하고 상황에 맞는 입력(글자, AAC, 가깝게 말하기)을 활용함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '소음 조건과 음성 인식',
        instruction: '시끄러운 복도에서 녹음한 소리와 조용한 곳의 소리를 비교해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'compare',
          prompt: '주변 소음이 음성 인식에 주는 영향을 비교해보세요.',
          left: { title: '조용한 방 녹음', content: '"AI 동아리 체험회에 오세요" -> 정확히 인식' },
          right: { title: '시끄러운 복도 녹음', content: '"AI 동아리... 체... 오세요" -> 일부 빠짐' },
          criteria: [{ id: 'noise', label: '소음 환경에 따른 음성 인식 명확성' }],
        },
        assetIds: ['m1-l5-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '내가 쓰기 편한 입력 방법 선택',
        instruction: '소음이 심할 때는 글자 입력이나 AAC 카드를 사용하는 것이 더 정확할 수 있습니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '내가 상황에 따라 쓰기 편한 입력 방법을 골라보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'mic-close', label: '마이크에 가깝게 다시 말하기', emoji: '🎙️' },
            { id: 'text-in', label: '글자로 직접 입력하기', emoji: '⌨️' },
            { id: 'aac-in', label: 'AAC 그림 카드로 전달하기', emoji: '🖼️' },
          ],
        },
        assetIds: ['m1-l5-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm1-l5-artifact',
      title: '입력 방법 카드',
      portfolioLabel: '상황별 편한 입력 방법 전략',
      fields: [
        { id: 'preferredInput', label: '소음이 있을 때 내가 선택할 입력 방식', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '지하철역 입력 상황',
      scenario: '지하철 소음이 시끄러울 때 길을 찾기 위해 스마트폰에 입력하는 가장 좋은 방법은?',
      activity: {
        id: 'act-transfer-m1-l5',
        kind: 'single-choice',
        prompt: '시끄러운 공간에서 정확한 입력을 위해 선택할 방법은?',
        choices: [
          { id: 'text-type', label: '텍스트 글자로 목적지를 직접 검색해요', emoji: '📱' },
        ],
      },
    },
    assets: [
      { id: 'm1-l5-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l5-story-01.webp', alt: '녹음하는 진우', required: true, purpose: '스토리 컷 1' },
      { id: 'm1-l5-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l5-story-02.webp', alt: '여러 입력 방법 활용', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '음성 인식은 주변 소음의 영향을 받으므로 필요할 때 글자나 AAC 입력을 함께 사용합니다.',
  },

  // ============================================================
  // m1-l6 안내 연습: AI는 자료로 배워요
  // ============================================================
  {
    lessonId: 'm1-l6',
    moduleId: 'm1',
    number: 6,
    role: 'guided',
    title: 'AI는 자료로 배워요',
    masterObjective: '오늘은 학습 자료가 달라지면 AI 결과가 어떻게 달라지는지 시험해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['학습 데이터의 양과 다양성은 결과에 영향을 준다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'aimi'],
      location: '동아리방',
      purpose: '모양 카드로 간단한 분류 AI 학습시키기',
      mismatch: '동그라미 카드만 많이 가르쳐서 네모 카드를 잘 구분하지 못함',
      evidence: ['동그라미 위주 카드 묶음', '다양한 모양 카드 묶음'],
      resolution: '다양한 학습 데이터를 보완하여 인식을 개선함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '치우친 학습 데이터 시험',
        instruction: '동그라미 카드만 보여주고 학습시킨 AI에게 네모 카드를 보여주면 어떻게 될까요?',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '한 가지 자료만 배운 AI의 오답 이유를 골라보세요.',
          choices: [
            { id: 'lack-data', label: '네모 카드를 배운 적이 없어서 헷갈려해요', emoji: '❓' },
          ],
        },
        assetIds: ['m1-l6-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '다양한 자료 보완하기',
        instruction: '골고루 다양한 학습 카드를 보여주면 AI가 새 모양도 잘 구분합니다.',
        activity: {
          id: 'act-s2',
          kind: 'sort',
          prompt: '공정한 학습을 위해 필요한 모양 카드를 골고루 상자에 담아보세요.',
          bins: [
            { id: 'learn-box', label: '학습 데이터 상자', emoji: '📦' },
          ],
          cards: [
            { id: 'c-circle', label: '동그라미 카드', binId: 'learn-box' },
            { id: 'c-square', label: '네모 카드', binId: 'learn-box' },
            { id: 'c-triangle', label: '세모 카드', binId: 'learn-box' },
          ],
        },
        assetIds: ['m1-l6-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm1-l6-artifact',
      title: '학습 자료 결과표',
      portfolioLabel: '자료 다양성에 따른 AI 결과 비교표',
      fields: [
        { id: 'dataVariety', label: '좋은 AI 결과를 위해 학습 자료에 필요한 점', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '과일 분류 AI 개선',
      scenario: '사과 사진만 배운 AI가 포도를 못 맞힐 때 어떻게 도울까요?',
      activity: {
        id: 'act-transfer-m1-l6',
        kind: 'single-choice',
        prompt: '포도를 구분하지 못하는 AI를 돕는 방법은?',
        choices: [
          { id: 'add-grape', label: '다양한 포도 사진 자료를 추가해서 학습시켜요', emoji: '🍇' },
        ],
      },
    },
    assets: [
      { id: 'm1-l6-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l6-story-01.webp', alt: '치우친 카드 묶음', required: true, purpose: '스토리 컷 1' },
      { id: 'm1-l6-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l6-story-02.webp', alt: '보완된 카드 묶음', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: 'AI는 배우는 자료의 다양성에 따라 결과가 달라지므로 골고루 다양한 자료가 필요합니다.',
  },

  // ============================================================
  // m1-l7 안내 연습: AI가 빠르게 도와주는 일
  // ============================================================
  {
    lessonId: 'm1-l7',
    moduleId: 'm1',
    number: 7,
    role: 'guided',
    title: 'AI가 빠르게 도와주는 일',
    masterObjective: '오늘은 AI가 만든 요약과 번역을 원문과 비교하고 빠진 부분을 찾아봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['AI는 많은 글을 빠르게 처리하지만 빠르다는 것이 정확하다는 뜻은 아니다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'aimi'],
      location: '동아리방',
      purpose: '체험회 안내문의 AI 요약 및 번역 결과 검토하기',
      mismatch: 'AI 요약문이 빠르지만 핵심 장소 정보 하나가 빠져 있음',
      evidence: ['긴 안내문 원문', 'AI 요약문', 'AI 번역문'],
      resolution: '빠른 처리의 이점을 활용하되 빠진 핵심 정보는 사람이 원문과 대조하여 복원함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '원문과 AI 요약 대조',
        instruction: '원문의 중요한 내용 3가지 중 AI 요약에서 빠진 부분을 찾아보세요.',
        activity: {
          id: 'act-s1',
          kind: 'compare',
          prompt: '원문과 AI 요약을 대조해보고 누락된 핵심을 찾아보세요.',
          left: { title: '원문 안내', content: '일시: 5월 10일 / 장소: 3층 강당 / 내용: 로봇 체험' },
          right: { title: 'AI 3줄 요약', content: '5월 10일에 로봇 체험 행사가 열립니다.' },
          criteria: [{ id: 'place', label: '장소(3층 강당) 포함 여부' }],
        },
        assetIds: ['m1-l7-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '빠진 핵심 복원하기',
        instruction: 'AI 결과를 사용할 때는 꼭 원문과 비교해서 고쳐 써야 합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '빠진 장소 정보를 발견했을 때 어떻게 해야 할까요?',
          choices: [
            { id: 'fix-summary', label: '요약문에 "3층 강당" 장소 정보를 사람이 직접 써넣어요', emoji: '✏️' },
          ],
        },
        assetIds: ['m1-l7-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm1-l7-artifact',
      title: '검토 비교지',
      portfolioLabel: '원문-요약-번역 비교 및 검토 기록',
      fields: [
        { id: 'summaryReview', label: 'AI 요약에서 빠져서 사람이 직접 보완한 내용', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '긴 뉴스 요약 검토',
      scenario: 'AI가 요약해준 긴 기사 글을 읽고 발표자료를 만들 때 주의할 점은?',
      activity: {
        id: 'act-transfer-m1-l7',
        kind: 'single-choice',
        prompt: 'AI 기사 요약을 사용할 때 할 일은?',
        choices: [
          { id: 'check-original', label: '원문과 비교해서 빠진 중요 내용이 없는지 확인해요', emoji: '📰' },
        ],
      },
    },
    assets: [
      { id: 'm1-l7-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l7-story-01.webp', alt: '긴 안내문 확인', required: true, purpose: '스토리 컷 1' },
      { id: 'm1-l7-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l7-story-02.webp', alt: '빠진 장소 발견', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: 'AI의 요약과 번역은 매우 빠르지만 중요한 사실이 빠질 수 있으므로 원문 확인이 필요합니다.',
  },

  // ============================================================
  // m1-l8 안내 연습: AI에게 맡기기 어려운 일
  // ============================================================
  {
    lessonId: 'm1-l8',
    moduleId: 'm1',
    number: 8,
    role: 'guided',
    title: 'AI에게 맡기기 어려운 일',
    masterObjective: '오늘은 AI가 혼자 결정하기 어려운 일을 찾고 누구와 함께 확인할지 골라봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['AI 종류와 연결된 도구에 따라 할 수 있는 일이 다르며 감정·건강·안전·책임 판단은 사람과 함께 확인한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'minjun'],
      location: '동아리방',
      purpose: '여러 가지 부탁(친구 마음 위로, 약 복용, 행사 시간, 상자 옮기기)을 기준별로 분류하기',
      mismatch: '모든 고민을 AI에게 전부 해결해 달라고 부탁하려 함',
      evidence: ['부탁 카드 4종', 'AI 경계 지침'],
      resolution: '감정·건강·책임 관련 부탁은 사람(선생님/보호자)과 함께 확인해야 함을 판단함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '부탁 카드 분류하기',
        instruction: '진우의 부탁 카드를 AI에게 맡길 일과 사람이 결정할 일로 나누어보세요.',
        activity: {
          id: 'act-s1',
          kind: 'sort',
          prompt: '각 부탁 카드를 알맞은 경계 상자에 놓아보세요.',
          bins: [
            { id: 'ai-help', label: 'AI 도움 가능 (정보 정리)', emoji: '🤖' },
            { id: 'human-check', label: '사람 확인 필요 (감정/건강/책임)', emoji: '👥' },
          ],
          cards: [
            { id: 'c-time', label: '행사 안내문 오타 찾기', binId: 'ai-help' },
            { id: 'c-feeling', label: '속상한 친구 마음 달래주기', binId: 'human-check' },
            { id: 'c-health', label: '아플 때 먹을 약 고르기', binId: 'human-check' },
          ],
        },
        assetIds: ['m1-l8-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '도움 경계 지도 작성',
        instruction: '건강, 마음, 안전 판단은 선생님이나 보호자 등 믿을 수 있는 사람과 함께 결정합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '몸이 아프거나 마음에 고민이 생겼을 때 올바른 결정자는?',
          choices: [
            { id: 'human-first', label: '선생님이나 보호자 등 믿을 만한 사람과 상의해요', emoji: '❤️' },
          ],
        },
        assetIds: ['m1-l8-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm1-l8-artifact',
      title: '도움 경계 지도',
      portfolioLabel: 'AI 사용과 사람 결정 분리 지도',
      fields: [
        { id: 'boundaryRule', label: 'AI 대신 사람이 판단하고 결정해야 하는 일', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '친구와의 갈등 상황',
      scenario: '친구가 화가 났을 때 AI에게 사과 방법을 물어보고 그대로 보낼까요?',
      activity: {
        id: 'act-transfer-m1-l8',
        kind: 'single-choice',
        prompt: '친구와의 소통에서 AI 도움을 쓸 때의 올바른 태도는?',
        choices: [
          { id: 'my-heart', label: 'AI 제안은 참고만 하고 내 솔직한 마음으로 직접 전해요', emoji: '🤝' },
        ],
      },
    },
    assets: [
      { id: 'm1-l8-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l8-story-01.webp', alt: '여러 부탁 카드', required: true, purpose: '스토리 컷 1' },
      { id: 'm1-l8-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l8-story-02.webp', alt: '도움 경계 지도', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '감정, 건강, 안전에 관한 중요한 결정은 AI가 아닌 사람과 함께 확인하고 판단해야 합니다.',
  },

  // ============================================================
  // m1-l9 안내 연습: 일에 맞는 AI 도구 고르기
  // ============================================================
  {
    lessonId: 'm1-l9',
    moduleId: 'm1',
    number: 9,
    role: 'guided',
    title: '일에 맞는 AI 도구 고르기',
    masterObjective: '오늘은 원하는 결과와 필요한 입력을 보고 알맞은 AI 도구를 골라봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['한 서비스가 여러 입력을 받을 수 있으므로 이름보다 입력·출력·근거·개인정보 조건을 본다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '안내문, 포스터 그림, 음성 자막 등 필요한 작업에 맞는 AI 도구 선택하기',
      mismatch: '모든 작업에 똑같은 챗봇 하나만 쓰려 함',
      evidence: ['작업 목적 카드 3종', 'AI 도구 기능 카드'],
      resolution: '입력과 결과물 종류에 맞춰 알맞은 AI 도구 조합을 설계함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '세 가지 필요한 작업',
        instruction: '체험회에 필요한 3가지 작업(글 작성, 그림 그리기, 자막 만들기)을 살펴보세요.',
        activity: {
          id: 'act-s1',
          kind: 'sort',
          prompt: '각 작업에 필요한 출력 결과물 종류를 짝지어보세요.',
          bins: [
            { id: 'text-job', label: '홍보문 작성', emoji: '📝' },
            { id: 'img-job', label: '포스터 제작', emoji: '🎨' },
            { id: 'audio-job', label: '안내 방송 자막', emoji: '🎬' },
          ],
          cards: [
            { id: 'c-text', label: '글자 텍스트 결과물', binId: 'text-job' },
            { id: 'c-img', label: '이미지 그림 결과물', binId: 'img-job' },
            { id: 'c-sub', label: '음성 인식 자막 결과물', binId: 'audio-job' },
          ],
        },
        assetIds: ['m1-l9-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '도구 조합 설계하기',
        instruction: '작업의 목적과 입력/출력 조건에 맞는 도구를 골라 연결합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '포스터 그림이 필요할 때 가장 적절한 AI 도구의 입력/출력은?',
          choices: [
            { id: 'txt2img', label: '글로 설명을 넣고 그림 결과를 만드는 이미지 생성 도구', emoji: '🖼️' },
          ],
        },
        assetIds: ['m1-l9-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm1-l9-artifact',
      title: '도구 선택 계획서',
      portfolioLabel: '목적별 AI 도구 조합 설계표',
      fields: [
        { id: 'toolCombination', label: '내 과제에 알맞게 선택한 AI 도구 조합', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '발표 영상 자막 작업',
      scenario: '선생님 말씀 녹음 파일로 자막을 만들 때 어떤 도구를 골라야 할까요?',
      activity: {
        id: 'act-transfer-m1-l9',
        kind: 'single-choice',
        prompt: '녹음 소리를 글자로 바꿔주는 알맞은 도구는?',
        choices: [
          { id: 'stt-tool', label: '음성을 받아 텍스트 자막으로 바꾸는 음성인식 도구', emoji: '🎙️' },
        ],
      },
    },
    assets: [
      { id: 'm1-l9-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l9-story-01.webp', alt: '세 작업 살펴보기', required: true, purpose: '스토리 컷 1' },
      { id: 'm1-l9-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l9-story-02.webp', alt: '도구 조합 보드', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '원하는 결과물과 필요한 입력 종류를 보면 내 작업에 꼭 맞는 AI 도구를 고를 수 있습니다.',
  },

  // ============================================================
  // m1-l10 플래그십: AI 결과를 사용할까?
  // ============================================================
  {
    lessonId: 'm1-l10',
    moduleId: 'm1',
    number: 10,
    role: 'flagship',
    title: 'AI 결과를 사용할까?',
    masterObjective: '오늘은 AI에게 안전한 요청을 한 뒤 결과를 확인하고 사용·수정·거절을 골라봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['AI 사용의 마지막 결정과 책임은 사람에게 있다. 실제 AI와 준비된 응답을 화면에서 명확히 구분한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'aimi'],
      location: '동아리방',
      purpose: '체험회 배경음악 목록을 부탁하고 AI 결과의 수용/수정/거절 판단하기',
      mismatch: '아이미가 행사 분위기에 맞지 않는 곡 및 확인되지 않은 정보 제안',
      evidence: ['행사 조건표', '공식 추천 곡 목록', '아이미 제안 음악 목록'],
      resolution: '수정 요청을 통해 분위기에 맞는 음악으로 조정한 뒤 사람의 최종 결정을 남김',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '첫 음악 목록과 문제 발견',
        instruction: '체험회 음악을 요청하자 아이미가 조용하고 우울한 곡들을 제안했어요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '행사 조건(신나고 밝은 분위기)과 AI 결과를 비교한 첫 느낌은?',
          choices: [
            { id: 'not-match', label: '우리 행사 분위기와 맞지 않아서 수정이 필요해요', emoji: '🎵' },
          ],
        },
        assetIds: ['m1-l10-story-01', 'm1-l10-story-02'],
        support: {},
      },
      {
        id: 's2-compare',
        phase: 'compare',
        title: '조건 대조 및 수정 요청',
        instruction: '행사 조건표와 대조하여 "밝고 신나는 분위기의 곡"으로 다시 요청해보세요.',
        activity: {
          id: 'act-s2',
          kind: 'ai-compare',
          prompt: '수정 요청 후 아이미가 새로 제안한 음악 목록을 점검해보세요.',
          source: { title: '행사 조건표', text: '조건: 학생 체험회용, 신나고 조용한 소음 없는 경쾌한 곡' },
          response: { title: '아이미 수정 목록', text: '1. 신나는 동요 리믹스\n2. 경쾌한 클래식 소나타', isPrepared: true },
          criteria: [{ id: 'mood', label: '행사 분위기 적합성' }],
          decisions: ['accept', 'modify'],
        },
        assetIds: ['m1-l10-story-03'],
        support: {},
      },
      {
        id: 's3-decision',
        phase: 'decision',
        title: '최종 사용 판단하기',
        instruction: 'AI 결과물을 어떻게 처리할지 결정하세요 (수용 / 수정 / 거절).',
        activity: {
          id: 'act-s3',
          kind: 'single-choice',
          prompt: '수정된 음악 목록에 대한 나의 최종 판단은?',
          choices: [
            { id: 'use-modified', label: '수정된 목록 중 경쾌한 곡을 선택해서 사용해요 (수용)', emoji: '✅' },
            { id: 'reject-all', label: '다시 사람 추천 목록으로 변경해요 (거절)', emoji: '❌' },
          ],
        },
        assetIds: ['m1-l10-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm1-l10-artifact',
      title: '사용 판단 기록',
      portfolioLabel: 'AI 결과 수용/수정/거절 최종 판단표',
      fields: [
        { id: 'finalDecision', label: 'AI 결과에 대한 나의 최종 결정과 이유', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '체험회 포스터 문구 검토',
      scenario: 'AI가 작성해준 포스터 홍보 문구를 최종 인쇄하기 직전에 무엇을 할까요?',
      activity: {
        id: 'act-transfer-m1-l10',
        kind: 'single-choice',
        prompt: '인쇄 전 마지막 사용 판단 행동은?',
        choices: [
          { id: 'human-final', label: '사람이 오타와 사실을 최종 검토하고 사용할지 결정해요', emoji: '📌' },
        ],
      },
    },
    assets: [
      { id: 'm1-l10-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l10-story-01.webp', alt: '음악 요청', required: true, purpose: '스토리 컷 1' },
      { id: 'm1-l10-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l10-story-02.webp', alt: '첫 결과 대조', required: true, purpose: '스토리 컷 2' },
      { id: 'm1-l10-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l10-story-03.webp', alt: '조건 비교 및 수정', required: true, purpose: '스토리 컷 3' },
      { id: 'm1-l10-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l10-story-04.webp', alt: '최종 선택 발표', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: 'AI 결과를 사용하는 최종 결정과 책임은 사람에게 있으므로 수용·수정·거절을 명확히 판단합니다.',
  },

  // ============================================================
  // m1-l11 프로젝트: 아이미 사용 설명서
  // ============================================================
  {
    lessonId: 'm1-l11',
    moduleId: 'm1',
    number: 11,
    role: 'project',
    title: '아이미 사용 설명서',
    masterObjective: '오늘은 새 AI 상황에서 입력·결과·확인할 점을 찾아 나만의 AI 사용 설명서를 완성해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01, STANDARD_CODES.SPEC_AI_02, STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['AI는 자료와 입력을 바탕으로 결과를 만들며 사람의 확인과 결정이 필요하다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'aimi'],
      location: '동아리방',
      purpose: '동아리 첫 주 마무리, 새 동아리원을 위한 아이미 안전 사용 설명서 조립하기',
      mismatch: '새 친구가 AI를 어떻게 안전하고 올바르게 써야 하는지 모름',
      evidence: ['l1~l10 탐구 수행 증거 묶음'],
      resolution: '모듈 1 탐구 기록 중 3가지를 선택하여 최종 사용 설명서를 완성하고 전달함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '새 친구의 질문과 기록 모으기',
        instruction: '동아리에 새로 온 친구를 위해 모듈 1에서 우리가 배운 10가지 탐구 기록을 모아봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '사용 설명서에 담을 핵심 원칙 3가지를 정리해볼까요?',
          choices: [
            { id: 'start-project', label: '배운 내용으로 아이미 사용 설명서를 완성해요!', emoji: '📘' },
          ],
        },
        assetIds: ['m1-l11-story-01', 'm1-l11-story-02'],
        support: {},
      },
      {
        id: 's2-artifact',
        phase: 'artifact',
        title: '아이미 사용 설명서 완성하기',
        instruction: '잘 도와주는 일, 조건에 따라 달라지는 일, 사람이 확인할 점 3가지 항목을 채워 설명서를 만드세요.',
        activity: {
          id: 'act-s2',
          kind: 'build',
          prompt: '각 설명서 구역에 올바른 사용 규칙을 놓아보세요.',
          slots: [
            { id: 'slot-good', label: '1. AI가 잘 도와주는 일' },
            { id: 'slot-change', label: '2. 조건에 따라 달라지는 일' },
            { id: 'slot-human', label: '3. 사람이 꼭 확인할 일' },
          ],
          pieces: [
            { id: 'p1', label: '많은 글 요약하기와 빠른 정보 검색', slotId: 'slot-good' },
            { id: 'p2', label: '가려진 사진이나 소음 속 음성 인식', slotId: 'slot-change' },
            { id: 'p3', label: '중요한 날짜, 사실, 건강 및 안전 판단', slotId: 'slot-human' },
          ],
        },
        assetIds: ['m1-l11-story-03'],
        support: {},
      },
    ],
    artifact: {
      id: 'm1-l11-artifact',
      title: '아이미 사용 설명서',
      portfolioLabel: '모듈 1 통합 아이미 사용 설명서',
      fields: [
        { id: 'goodJob', label: '1. AI가 잘 도와주는 일', input: 'text', required: true },
        { id: 'changeCondition', label: '2. 조건에 따라 결과가 달라지는 일', input: 'text', required: true },
        { id: 'humanCheck', label: '3. 사람이 꼭 확인하고 판단할 일', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '설명서 전달 및 발표',
      scenario: '완성한 설명서를 새 친구에게 전달하며 동아리 약속을 정해봐요.',
      activity: {
        id: 'act-transfer-m1-l11',
        kind: 'single-choice',
        prompt: '새 친구에게 설명서를 전달할 준비가 되었나요?',
        choices: [
          { id: 'share-manual', label: '네, 아이미 사용 설명서를 전달하고 자랑스럽게 공유해요!', emoji: '🎓' },
        ],
      },
    },
    assets: [
      { id: 'm1-l11-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l11-story-01.webp', alt: '새 친구의 질문', required: true, purpose: '스토리 컷 1' },
      { id: 'm1-l11-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l11-story-02.webp', alt: '기록 조립', required: true, purpose: '스토리 컷 2' },
      { id: 'm1-l11-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m1/m1-l11-story-03.webp', alt: '설명서 전달 발표', required: true, purpose: '스토리 컷 3' },
    ],
    wrapUp: 'AI는 멋진 도움 도구이지만, 최종 확인과 결정은 항상 사람이 함께합니다.',
  },
];
