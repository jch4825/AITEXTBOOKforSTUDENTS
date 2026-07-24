import type { CanonicalLessonDesign } from './types';
import { STANDARD_CODES } from './shared';

export const M6_CANONICAL_LESSONS: CanonicalLessonDesign[] = [
  // ============================================================
  // m6-l1 플래그십: 우리 부스 주제와 방문자 고르기
  // ============================================================
  {
    lessonId: 'm6-l1',
    moduleId: 'm6',
    number: 1,
    role: 'flagship',
    title: '우리 부스 주제와 방문자 고르기',
    masterObjective: '오늘은 배움 전시회 부스 주제와 방문자를 정하고, 방문자에게 알맞은 설명 방식을 정해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01, STANDARD_CODES.SPEC_AI_02, STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['전시 부스는 보여 줄 내용과 방문자(동생, 친구, 학부모)의 눈높이에 맞춰 기획한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'minjun'],
      location: '동아리방',
      purpose: '배움 전시회 부스 주제(탐구 보고서 및 안전 여권)를 정하고 대상별 3구역 기획하기',
      mismatch: '무엇을 보여줄지 정하지 않고 부스 테이블부터 펼치려 함',
      evidence: ['주제 카드 목록', '방문자 캐릭터 카드', '3구역 기획도'],
      resolution: '주제와 방문자 눈높이에 맞춰 전시-체험-안전 3구역 공간을 완벽하게 기획함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '부스 주제와 방문자 정하기',
        instruction: '모듈 1~5에서 완성한 배움 중 부스에서 선보일 주제와 방문자를 골라봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '우리 부스에서 선보일 주요 주제를 선택하세요.',
          choices: [
            { id: 'topic-report', label: '우리 동네 탐구 보고서 & 올바른 AI 검증 부스', emoji: '📊' },
            { id: 'topic-safety', label: '개인정보 가리기 & AI 안전 여권 체험 부스', emoji: '🛡️' },
          ],
        },
        assetIds: ['m6-l1-story-01', 'm6-l1-story-02'],
        support: {},
      },
      {
        id: 's2-condition-change',
        phase: 'condition-change',
        title: '3구역 공간 기획',
        instruction: '전시 구역, 체험 구역, 안전약속 구역 3곳을 기획해보세요.',
        activity: {
          id: 'act-s2',
          kind: 'build',
          prompt: '부스 공간의 3구역 슬롯에 알맞은 활동 카드를 연결하세요.',
          slots: [
            { id: 'zone-display', label: '1구역: 대표작 전시 존' },
            { id: 'zone-exp', label: '2구역: 팩트체크 체험 존' },
            { id: 'zone-safe', label: '3구역: 안전 약속 및 방명록 존' },
          ],
          pieces: [
            { id: 'p-d', label: 'M5 탐구 보고서 패널 전시', slotId: 'zone-display' },
            { id: 'p-e', label: '비교 대조 팩트체크 가림막 체험', slotId: 'zone-exp' },
            { id: 'p-s', label: '안전 약속 서명 & 스티커 방명록', slotId: 'zone-safe' },
          ],
        },
        assetIds: ['m6-l1-story-03'],
        support: {},
      },
      {
        id: 's3-compare',
        phase: 'compare',
        title: '방문자 눈높이 설명 방식 대조',
        instruction: '어린 동생과 학부모님 방문자에게 어울리는 설명 어조를 대조해봅시다.',
        activity: {
          id: 'act-s3',
          kind: 'compare',
          prompt: '어린 동생용과 학부모님용 설명 어조를 비교해보세요.',
          left: { title: '어린 동생 방문자', content: '쉬운 비유와 퀴즈로 흥미를 끌며 말하기' },
          right: { title: '학부모님 방문자', content: '탐구 절차와 안전 실천 결과를 정중하게 설명하기' },
          criteria: [{ id: 'audience-fit', label: '방문자 눈높이에 맞는 어조인가' }],
        },
        assetIds: ['m6-l1-story-03'],
        support: {},
      },
      {
        id: 's4-decision',
        phase: 'decision',
        title: '부스 기획서 완성',
        instruction: '완성된 부스 기획서를 바탕으로 전시회 준비를 본격적으로 시작합니다.',
        activity: {
          id: 'act-s4',
          kind: 'single-choice',
          prompt: '부스 기획서가 완성되었을 때의 자신감은?',
          choices: [
            { id: 'start-booth-plan', label: '방문자 눈높이에 맞춘 3구역 기획서로 준비를 시작해요!', emoji: '🚀' },
          ],
        },
        assetIds: ['m6-l1-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l1-artifact',
      title: '전시 부스 기획서',
      portfolioLabel: '주제-방문자-3구역 기획서',
      fields: [
        { id: 'boothPlanSummary', label: '내가 작성한 전시 부스 기획서 내용', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '학교 축제 부스 기획',
      scenario: '학교 축제에서 AI 체험 부스를 열 때 가장 먼저 할 일은?',
      activity: {
        id: 'act-transfer-m6-l1',
        kind: 'single-choice',
        prompt: '축제 부스 기획의 첫걸음은?',
        choices: [
          { id: 'fest-booth-target', label: '부스를 찾아올 손님과 보여줄 핵심 체험 1가지를 정해요', emoji: '🎪' },
        ],
      },
    },
    assets: [
      { id: 'm6-l1-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l1-story-01.webp', alt: '부스 주제 고르기', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l1-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l1-story-02.webp', alt: '방문자 캐릭터 카드', required: true, purpose: '스토리 컷 2' },
      { id: 'm6-l1-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l1-story-03.webp', alt: '3구역 공간 기획', required: true, purpose: '스토리 컷 3' },
      { id: 'm6-l1-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l1-story-04.webp', alt: '기획서 발표', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '좋은 부스 기획은 보여 줄 주제와 방문자의 눈높이에 맞춰 동선과 구역을 구성하는 것부터 시작합니다.',
  },

  // ============================================================
  // m6-l2 안내 연습: 체험 순서와 안내문 만들기
  // ============================================================
  {
    lessonId: 'm6-l2',
    moduleId: 'm6',
    number: 2,
    role: 'guided',
    title: '체험 순서와 안내문 만들기',
    masterObjective: '오늘은 방문자가 체험할 3단계 순서를 정하고 분명한 안내문을 써 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['체험은 시작->활동->확인 순서가 분명할 때 방문자가 쉽고 안전하게 참여한다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '체험 3단계(1.관찰 -> 2.대조체험 -> 3.안전서명) 동선 및 안내 표지판 완성하기',
      mismatch: '체험 순서가 안내되지 않아 방문자가 어디서 시작할지 헷갈려함',
      evidence: ['3단계 동선 화살표', '안내 표지판'],
      resolution: '시작-활동-확인 3단계 안내 표지판을 부스 앞에 잘 보이게 배치함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '3단계 체험 동선 배치',
        instruction: '방문자가 헤매지 않고 순서대로 참여할 수 있도록 3단계 동선을 배정해보세요.',
        activity: {
          id: 'act-s1',
          kind: 'sequence',
          prompt: '방문자 체험 3단계를 순서대로 놓아보세요.',
          items: [
            { id: 'st1', label: '1단계: 탐구 보고서 및 대표작 관찰하기', correctOrder: 1 },
            { id: 'st2', label: '2단계: AI 결과와 공식 공지문 대조 팩트체크 체험하기', correctOrder: 2 },
            { id: 'st3', label: '3단계: 안전 다짐 서명 및 방명록 스티커 붙이기', correctOrder: 3 },
          ],
        },
        assetIds: ['m6-l2-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '안내 표지판 문장 작성',
        instruction: '누구나 쉽고 명확하게 읽을 수 있는 부스 입구 안내 문장을 작성합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '부스 입구 안내 표지판 문장을 완성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'sign-text', label: '어서오세요! 1분 만에 경험하는 올바른 AI 팩트체크 체험 부스입니다.', emoji: '🪧' },
          ],
        },
        assetIds: ['m6-l2-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l2-artifact',
      title: '부스 동선 및 안내 표지판',
      portfolioLabel: '체험 3단계 동선 및 입구 안내표',
      fields: [
        { id: 'signBoardText', label: '내가 작성한 부스 입구 안내 표지판 문장', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '게임 부스 안내판 작성',
      scenario: '체육대회 게임 부스 안내 표지판을 만들 때 기억할 점은?',
      activity: {
        id: 'act-transfer-m6-l2',
        kind: 'single-choice',
        prompt: '안내 표지판 작성 원칙은?',
        choices: [
          { id: 'clear-step-sign', label: '1, 2, 3단계 참여 방법과 걸리는 시간을 크게 명시해요', emoji: '⏱️' },
        ],
      },
    },
    assets: [
      { id: 'm6-l2-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l2-story-01.webp', alt: '3단계 동선 배치', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l2-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l2-story-02.webp', alt: '안내 표지판 세우기', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '체험 순서와 분명한 안내 표지판이 있으면 방문자가 쉽고 안전하게 부스에 참여할 수 있습니다.',
  },

  // ============================================================
  // m6-l3 안내 연습: 전시할 대표 산출물 고르기
  // ============================================================
  {
    lessonId: 'm6-l3',
    moduleId: 'm6',
    number: 3,
    role: 'guided',
    title: '전시할 대표 산출물 고르기',
    masterObjective: '오늘은 모듈 1~5에서 완성한 내 작품 중 가장 잘한 것과 보완한 것을 골라 전시판을 꾸며 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['대표 산출물은 완벽한 결과뿐 아니라 발전 과정과 배운 점을 보여 주는 작품이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: 'M1~M5 완성작 중 대표작 2개(M4 안전 여권, M5 탐구 보고서)를 선정해 성장 비교판 꾸미기',
      mismatch: '어떤 작품을 보여줄지 고민하며 엉망으로 모두 펼쳐놓음',
      evidence: ['M1~M5 산출물 썸네일 묶음', '성장 비교 게시판'],
      resolution: '처음 만든 모습과 보완된 완성본을 함께 나열하여 나의 성장 과정을 보여주는 게시판을 구성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '대표 산출물 2종 선정',
        instruction: '모듈 1~5의 나의 공부 산출물 썸네일 중 전시판에 걸 대표작 2개를 선택하세요.',
        activity: {
          id: 'act-s1',
          kind: 'multi-choice',
          prompt: '우리 부스에 전시할 대표 산출물 2개를 고르세요.',
          choices: [
            { id: 'pick-m4', label: '모듈 4: AI 안전 여권 (개인정보 가리기 편집)', emoji: '🛡️' },
            { id: 'pick-m5', label: '모듈 5: 우리 동네 탐구 보고서 (오류 수정 디프)', emoji: '📊' },
          ],
        },
        assetIds: ['m6-l3-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '성장 과정 덧붙이기',
        instruction: '완성작 옆에 "처음에는 몰랐지만 이렇게 발전했어요"라는 성장 메모를 덧붙입니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '대표 산출물에 적을 나의 배움 성장 메모를 작성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'growth-memo', label: '처음엔 AI 대답을 다 믿었지만, 스스로 공식 공지와 대조하며 진짜 지식으로 발전시켰습니다!', emoji: '🌱' },
          ],
        },
        assetIds: ['m6-l3-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l3-artifact',
      title: '대표 산출물 전시판',
      portfolioLabel: '대표작 2종 및 배움 성장 기록판',
      fields: [
        { id: 'selectedWorks', label: '내가 고른 대표 산출물과 성장 소감 메모', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '미술 전시작 고르기',
      scenario: '미술 배움 발표회에 작품 2개를 제출할 때 고르는 바람직한 기준은?',
      activity: {
        id: 'act-transfer-m6-l3',
        kind: 'single-choice',
        prompt: '전시작 선정의 바람직한 기준은?',
        choices: [
          { id: 'growth-art-pick', label: '가장 맘에 드는 완성작 1개와 고쳐 그리며 실력이 늘어난 1개를 골라요', emoji: '🎨' },
        ],
      },
    },
    assets: [
      { id: 'm6-l3-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l3-story-01.webp', alt: '대표작 고르기', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l3-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l3-story-02.webp', alt: '성장 게시판 붙이기', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '대표 산출물 전시판은 완성된 모습뿐 아니라 내가 어떻게 배우고 성장했는지 보여 주는 자리입니다.',
  },

  // ============================================================
  // m6-l4 안내 연습: 설명 대본 작성하기
  // ============================================================
  {
    lessonId: 'm6-l4',
    moduleId: 'm6',
    number: 4,
    role: 'guided',
    title: '설명 대본 작성하기',
    masterObjective: '오늘은 내 대표 산출물을 1분 동안 설명할 대본을 목적·방법·배운 점 순서로 써 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['1분 설명은 주제, 사용한 AI 도우미, 사람이 확인한 방법, 배운 점을 알차게 담는다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'aimi'],
      location: '동아리방',
      purpose: '대표 산출물을 방문자에게 1분 동안 명확하게 설명하는 4단계 대본 작성하기',
      mismatch: '말이 너무 길어지거나 어떤 점을 강조해야 할지 갈팡질팡함',
      evidence: ['타이머 화면', '4단계 1분 대본 양식'],
      resolution: '주제 -> AI 활용 -> 사람의 검증 -> 배운 점 4단계로 알차게 정리된 1분 대본을 완성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '4단계 1분 대본 구조',
        instruction: '주제, AI 도우미 활용, 사람이 확인한 방법, 배운 점 4단계를 순서대로 맞춰봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'sequence',
          prompt: '1분 설명 대본의 4단계를 순서대로 놓아보세요.',
          items: [
            { id: 's1-topic', label: '1. 주제: 안녕하세요! 우리 동네 AI 탐구 보고서를 소개합니다.', correctOrder: 1 },
            { id: 's2-ai', label: '2. AI 도우미: AI로는 보고서의 초안 작성과 문장 다듬기 도움을 받았습니다.', correctOrder: 2 },
            { id: 's3-human', label: '3. 사람 검증: 지어낸 거짓 장소 오류를 구청 공식 공지문과 대조하여 직접 고쳤습니다.', correctOrder: 3 },
            { id: 's4-learn', label: '4. 배운 점: AI 대답을 스스로 확인하고 내 생각을 보완해야 진짜 배움이 됨을 깨달았습니다.', correctOrder: 4 },
          ],
        },
        assetIds: ['m6-l4-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '1분 연습과 시간 조절',
        instruction: '타이머로 1분을 재며 너무 빠르거나 늦지 않게 차분한 어조로 말하기를 연습합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '완성된 1분 부스 설명 대본을 완성해보세요.',
          modes: ['choice', 'text', 'speech'],
          choiceCards: [
            { id: 'one-min-script', label: '안녕하세요! 우리 부스는 AI 초안 오류를 직접 잡고 공식 공지와 대조한 탐구 보고서를 소개합니다. 직접 팩트체크를 체험해보세요!', emoji: '🎤' },
          ],
        },
        assetIds: ['m6-l4-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l4-artifact',
      title: '1분 부스 설명 대본',
      portfolioLabel: '4단계 구조 1분 발표 설명 대본',
      fields: [
        { id: 'scriptText', label: '내가 작성한 1분 부스 설명 대본 전문', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '자기소개 1분 대본',
      scenario: '동아리 새 회원들 앞에서 1분 자기소개를 할 때 적용할 구조는?',
      activity: {
        id: 'act-transfer-m6-l4',
        kind: 'single-choice',
        prompt: '1분 말하기의 핵심 원칙은?',
        choices: [
          { id: 'keep-1min-structure', label: '인사 -> 핵심 경험 1가지 -> 깨달은 점 순서로 1분 안에 알차게 전해요', emoji: '⏱️' },
        ],
      },
    },
    assets: [
      { id: 'm6-l4-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l4-story-01.webp', alt: '타이머 연습', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l4-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l4-story-02.webp', alt: '4단계 대본 완성', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '1분 설명 대본은 주제, AI 도움, 사람의 확인, 배운 점 4단계를 명확히 담아야 알차게 전달됩니다.',
  },

  // ============================================================
  // m6-l5 안내 연습: 안전과 예의 수칙 만들기
  // ============================================================
  {
    lessonId: 'm6-l5',
    moduleId: 'm6',
    number: 5,
    role: 'guided',
    title: '안전과 예의 수칙 만들기',
    masterObjective: '오늘은 우리 부스에서 지킬 AI 안전·개인정보·서로 존중 수칙 3가지를 만들어 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['부스 수칙은 방문자와 진행자 모두가 안전하고 즐겁게 참여하기 위한 약속이다.'],
    canonicalScenario: {
      characters: ['yuna', 'jinwoo'],
      location: '동아리방',
      purpose: '우리 부스 3대 안전 및 예의 약속판(1.개인정보 가리기 / 2.바른 언어 / 3.어른 알림) 만들기',
      mismatch: '수칙이 없어서 방문자가 개인정보가 찍힌 사진을 그대로 화면에 올리려 함',
      evidence: ['3대 안전 약속판'],
      resolution: '부스 입구에 보기 쉬운 3대 안전 약속판을 게시하여 모두가 안전하게 체험함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '부스 3대 안전 약속',
        instruction: '우리 부스 방문자가 함께 지킬 3가지 필수 안전 수칙을 연결해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'multi-choice',
          prompt: '우리 부스 3대 안전 약속에 포함할 규칙 3가지를 고르세요.',
          choices: [
            { id: 'r1', label: '1. 개인정보 단서(이름표, 얼굴) 가리고 공유하기', emoji: '🔒' },
            { id: 'r2', label: '2. AI와 친구에게 분명하고 존중하는 언어 쓰기', emoji: '✨' },
            { id: 'r3', label: '3. 불편하거나 이상한 요구를 만나면 멈추고 알려주기', emoji: '🛑' },
          ],
        },
        assetIds: ['m6-l5-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '안전 약속판 부스 게시',
        instruction: '부스 입구 가장 잘 보이는 곳에 안전 약속판을 세우고 함께 다짐합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '부스 입구 안전 약속 다짐 문장을 작성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'promise-text', label: '우리 부스는 개인정보를 보호하고 정직하게 팩트체크하는 안전한 배움 공간입니다!', emoji: '🛡️' },
          ],
        },
        assetIds: ['m6-l5-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l5-artifact',
      title: '부스 안전 약속판',
      portfolioLabel: '우리 부스 3대 안전 및 예의 약속판',
      fields: [
        { id: 'safetyRulesText', label: '내가 만든 부스 3대 안전 및 예의 수칙', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '컴퓨터실 사용 수칙',
      scenario: '학교 컴퓨터실을 이용할 때 지켜야 할 안전 약속은?',
      activity: {
        id: 'act-transfer-m6-l5',
        kind: 'single-choice',
        prompt: '컴퓨터실 안전 수칙은?',
        choices: [
          { id: 'lab-safety-rule', label: '로그아웃을 꼭 확인하고 개인정보를 입력하지 않으며 소중히 기기를 다뤄요', emoji: '🖥️' },
        ],
      },
    },
    assets: [
      { id: 'm6-l5-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l5-story-01.webp', alt: '수칙 문장 정하기', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l5-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l5-story-02.webp', alt: '안전 약속판 완성', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '안전 수칙은 방문자와 진행자 모두가 기분 좋고 안전하게 전시회를 즐기기 위한 약속입니다.',
  },

  // ============================================================
  // m6-l6 플래그십: 리허설과 부스 개선하기
  // ============================================================
  {
    lessonId: 'm6-l6',
    moduleId: 'm6',
    number: 6,
    role: 'flagship',
    title: '리허설과 부스 개선하기',
    masterObjective: '오늘은 친구와 방문자·진행자 역할을 바꾸어 리허설하고, 막히는 부분을 고쳐 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01, STANDARD_CODES.SPEC_AI_02, STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['리허설은 시간·동선·설명·안전 수칙이 실제 작동하는지 점검하는 과정이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'minjun'],
      location: '동아리방',
      purpose: '방문자-진행자 역할 교대 리허설 중 2단계 설명 지연으로 병목 현상이 발생한 점을 발견하고 고치기',
      mismatch: '2단계 체험 설명이 3분이나 걸려 뒤에 기다리는 방문자 줄이 꼬임',
      evidence: ['리허설 타이머', '동선 화살표 표지판', '수정된 3문장 대본'],
      resolution: '2단계 설명을 3문장으로 요약하고 대기 동선 화살표를 세워 원활하게 개선함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '리허설 중 막히는 지점 발견',
        instruction: '윤아가 방문자가 되어 진우의 2단계 체험을 하던 중 발생한 문제를 관찰해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '리허설에서 발견한 문제점은 무엇인가요?',
          choices: [
            { id: 'bottleneck-found', label: '2단계 설명이 길어 방문자가 기다리느라 동선이 막혔어요', emoji: '⚠️' },
          ],
        },
        assetIds: ['m6-l6-story-01', 'm6-l6-story-02'],
        support: {},
      },
      {
        id: 's2-compare',
        phase: 'compare',
        title: '리허설 전후 대본 및 동선 대조',
        instruction: '긴 설명 대본과 3문장 핵심 대본을 대조해보세요.',
        activity: {
          id: 'act-s2',
          kind: 'compare',
          prompt: '개선 전 긴 대본과 개선 후 3문장 대본을 대조하세요.',
          left: { title: '개선 전 (3분 걸림)', content: '모듈 1부터 5까지 모든 과정을 길게 장황하게 설명함' },
          right: { title: '개선 후 (1분 30초 걸림)', content: '팩트체크 가림막 체험 핵심 3문장만 명확하게 설명함' },
          criteria: [{ id: 'flow-speed', label: '방문자가 지루하지 않고 동선이 원활한가' }],
        },
        assetIds: ['m6-l6-story-02', 'm6-l6-story-03'],
        support: {},
      },
      {
        id: 's3-decision',
        phase: 'decision',
        title: '부스 동선 및 대본 최종 수정',
        instruction: '3문장 대본과 바닥 동선 표지판을 수정해 완벽한 리허설을 마칩니다.',
        activity: {
          id: 'act-s3',
          kind: 'expression',
          prompt: '리허설을 통해 개선한 최종 변경 사항을 정리해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'rehearsal-fixed', label: '2단계 설명 시간을 1분 30초로 단축하고 대기 라인 화살표를 바닥에 세웠습니다.', emoji: '✨' },
          ],
        },
        assetIds: ['m6-l6-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l6-artifact',
      title: '리허설 검토 및 수정 기록',
      portfolioLabel: '역할 교대 리허설 피드백 및 동선 개선 기록',
      fields: [
        { id: 'rehearsalFixText', label: '리허설을 통해 내가 발견하고 고친 문제점', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '연극 발표 리허설',
      scenario: '학급 연극 발표 전 리허설을 하는 가장 큰 목적은?',
      activity: {
        id: 'act-transfer-m6-l6',
        kind: 'single-choice',
        prompt: '리허설의 목적은?',
        choices: [
          { id: 'rehearsal-purpose', label: '실제 무대에서 생길 수 있는 타이밍과 이동 동선의 어색함을 미리 찾아 고쳐요', emoji: '🎭' },
        ],
      },
    },
    assets: [
      { id: 'm6-l6-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l6-story-01.webp', alt: '역할 교대 리허설', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l6-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l6-story-02.webp', alt: '설명 지연 발생', required: true, purpose: '스토리 컷 2' },
      { id: 'm6-l6-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l6-story-03.webp', alt: '대본 3문장 단축', required: true, purpose: '스토리 컷 3' },
      { id: 'm6-l6-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l6-story-04.webp', alt: '원활해진 리허설 성공', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '리허설은 실제 방문자를 맞이하기 전 설명 시간과 동선에 막힘이 없는지 점검하는 필수 과정입니다.',
  },

  // ============================================================
  // m6-l7 안내 연습: 방문자 질문 대비하기
  // ============================================================
  {
    lessonId: 'm6-l7',
    moduleId: 'm6',
    number: 7,
    role: 'guided',
    title: '방문자 질문 대비하기',
    masterObjective: '오늘은 방문자가 물어볼 수 있는 질문 3가지를 예상하고 자신 있는 답변을 준비해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_02],
    coreConcepts: ['예상 질문 준비는 AI 답의 확인 근거와 출처를 다시 점검하는 계기가 된다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '방문자의 돌발 질문("AI가 한 말이 진짜 맞나요?") 3가지에 대한 근거 답변 준비하기',
      mismatch: '"AI가 진짜 맞냐"는 질문을 받았을 때 머뭇거리며 답을 못함',
      evidence: ['Q&A 카드 3종', '학교 공식 공지 대조 근거'],
      resolution: '학교 공식 공지와 직접 조사 출처 근거 카드를 준비해 당당하게 답변함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '방문자 예상 질문 3가지',
        instruction: '방문자가 물어볼 수 있는 날카로운 예상 질문 3가지를 만들어봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'multi-choice',
          prompt: '방문자 예상 질문 3가지를 고르세요.',
          choices: [
            { id: 'q-real', label: '1. AI 대답이 지어낸 내용이 아니라는 걸 어떻게 아나요?', emoji: '❓' },
            { id: 'q-safe', label: '2. 사진을 올릴 때 개인정보는 어떻게 보호하나요?', emoji: '🔒' },
            { id: 'q-own', label: '3. 보고서에서 AI가 써준 것과 내 생각은 어떻게 구분하나요?', emoji: '💡' },
          ],
        },
        assetIds: ['m6-l7-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '근거 기반 답변 작성',
        instruction: '우리가 공부한 확인 대조, 개인정보 가리기, 출처 밝히기 근거로 답변을 준비합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '질문 1(AI 대답 확인)에 대한 자신 있는 답변을 작성해봅시다.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'answer-proof', label: 'AI 대답을 그대로 믿지 않고, 학교 공식 홈페이지의 공지문과 대조하여 직접 팩트체크했습니다!', emoji: '🗣️' },
          ],
        },
        assetIds: ['m6-l7-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l7-artifact',
      title: 'Q&A 예상 답변 카드',
      portfolioLabel: '방문자 질문 대비 근거 답변서',
      fields: [
        { id: 'qaPairsText', label: '내가 작성한 3가지 질문 및 근거 답변', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '면접 및 발표 질의응답',
      scenario: '동아리 면접이나 발표 질의응답을 준비할 때 좋은 자세는?',
      activity: {
        id: 'act-transfer-m6-l7',
        kind: 'single-choice',
        prompt: '질의응답 준비의 핵심은?',
        choices: [
          { id: 'evidence-qa-rule', label: '내 짐작이 아니라 내가 직접 확인한 구체적 근거와 출처를 들어 설명해요', emoji: '📌' },
        ],
      },
    },
    assets: [
      { id: 'm6-l7-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l7-story-01.webp', alt: '질문 카드 들기', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l7-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l7-story-02.webp', alt: '근거 답변 카드', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '방문자 예상 질문 대비는 내가 조사한 확인 근거와 출처를 다시금 점검해 신뢰도를 높여 줍니다.',
  },

  // ============================================================
  // m6-l8 안내 연습: 부스 꾸미기와 배치하기
  // ============================================================
  {
    lessonId: 'm6-l8',
    moduleId: 'm6',
    number: 8,
    role: 'guided',
    title: '부스 꾸미기와 배치하기',
    masterObjective: '오늘은 제목, 대표작, 체험 구역, 안전 수칙을 보기 좋게 배치해 부스를 완성해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['부스 배치는 방문자의 시선 이동과 이동 동선을 고려한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '전시 부스 테이블 위 요소 4가지(현수막, 대표작, 체험 태블릿, 안전약속판) 시각적 레이아웃 완성하기',
      mismatch: '물건들이 어질러져 방문자가 입구를 못 찾고 어색해함',
      evidence: ['4가지 부스 요소 카드', '부스 테이블 레이아웃 도면'],
      resolution: '시선 이동(좌->우)에 맞게 현수막->대표작->체험 태블릿->안전약속판을 정돈함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '4가지 부스 요소 배치',
        instruction: '부스 테이블 4가지 요소를 시선 이동 순서대로 배치해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'sort',
          prompt: '각 요소를 부스 테이블 어울리는 구역에 정돈해보세요.',
          bins: [
            { id: 'b-top', label: '상단 현수막', emoji: '🚩' },
            { id: 'b-left', label: '왼쪽 (전시 존)', emoji: '🖼️' },
            { id: 'b-right', label: '오른쪽 (체험 및 방명록 존)', emoji: '📱' },
          ],
          cards: [
            { id: 'c-title-banner', label: '부스 제목: AI 팩트체크 탐구 전시 부스', binId: 'b-top' },
            { id: 'c-works', label: 'M4 안전 여권 & M5 탐구 보고서 패널', binId: 'b-left' },
            { id: 'c-tablet', label: '팩트체크 체험 태블릿 & 방명록 스티커', binId: 'b-right' },
          ],
        },
        assetIds: ['m6-l8-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '원거리 점검과 정돈',
        instruction: '3미터 뒤에서 바라보며 멀리서도 제목과 동선이 잘 보이는지 점검합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '부스 배치를 마친 뒤 할 일은?',
          choices: [
            { id: 'check-3m-back', label: '멀리 떨어져서 바라보며 글씨가 잘 보이고 입구가 깔끔한지 확인해요', emoji: '👀' },
          ],
        },
        assetIds: ['m6-l8-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l8-artifact',
      title: '부스 완성 배치도',
      portfolioLabel: '시선 이동 고려 4요소 부스 배치도',
      fields: [
        { id: 'boothLayoutText', label: '내가 완정한 부스 테이블 배치도 및 정돈 상태', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '학급 게시판 꾸미기',
      scenario: '교실 뒤 배움 게시판을 꾸밀 때 깔끔하게 배치하는 방법은?',
      activity: {
        id: 'act-transfer-m6-l8',
        kind: 'single-choice',
        prompt: '게시판 꾸미기의 좋은 방법은?',
        choices: [
          { id: 'board-arrange', label: '중앙에 큰 제목을 두고 줄 맞춰 소주제별로 작품을 나누어 붙여요', emoji: '📌' },
        ],
      },
    },
    assets: [
      { id: 'm6-l8-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l8-story-01.webp', alt: '테이블 요소 배치', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l8-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l8-story-02.webp', alt: '완성된 부스 레이아웃', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '부스 배치는 방문자의 시선과 이동 동선을 고려해 한눈에 들어오도록 정돈해야 합니다.',
  },

  // ============================================================
  // m6-l9 안내 연습: 방명록과 피드백 준비하기
  // ============================================================
  {
    lessonId: 'm6-l9',
    moduleId: 'm6',
    number: 9,
    role: 'guided',
    title: '방명록과 피드백 준비하기',
    masterObjective: '오늘은 방문자의 소감과 피드백을 받을 방명록 카드를 만들고 수집 방법을 정해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['피드백 수집은 배움 전시회의 성과를 확인하고 다음 성장을 돕는다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '방문자 소감 스티커와 응원 한마디를 모을 방명록 거치대 양식 준비하기',
      mismatch: '전시회만 하고 소감을 들을 방법을 준비하지 않아 아쉬움',
      evidence: ['방명록 카드 템플릿', '칭찬/피드백 스티커'],
      resolution: '부스 퇴장로에 귀여운 방명록 거치대와 칭찬 스티커판을 준비함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '방명록 피드백 질문 2가지',
        instruction: '방문자에게 물어볼 2가지 핵심 소감 질문을 선택해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'multi-choice',
          prompt: '방명록 카드에 포함할 2가지 질문을 선택하세요.',
          choices: [
            { id: 'fb-q1', label: '1. 오늘 우리 부스에서 가장 유익했던 체험은 무엇인가요?', emoji: '💡' },
            { id: 'fb-q2', label: '2. 앞으로 AI를 사용할 때 지키고 싶은 다짐 한 가지는 무엇인가요?', emoji: '✨' },
          ],
        },
        assetIds: ['m6-l9-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '방명록 거치대 준비',
        instruction: '체험을 마친 방문자가 스티커를 붙이고 한마디를 남길 수 있는 거치대를 마련합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '방명록 거치대에 안내할 정중한 안내 문장을 작성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'guestbook-sign', label: '체험을 마친 후 느낀 점을 칭찬 스티커와 짧은 소감 글로 남아주세요! 큰 힘이 됩니다.', emoji: '📝' },
          ],
        },
        assetIds: ['m6-l9-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l9-artifact',
      title: '부스 방명록 양식',
      portfolioLabel: '칭찬 스티커 및 소감 수집 방명록',
      fields: [
        { id: 'guestbookFormatText', label: '내가 디자인한 부스 방명록 및 피드백 질문', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '수업 후 소감 나누기',
      scenario: '수업이 끝난 후 소감 한마디를 남기는 좋은 방법은?',
      activity: {
        id: 'act-transfer-m6-l9',
        kind: 'single-choice',
        prompt: '수업 소감 남기기의 방법은?',
        choices: [
          { id: 'sticky-note-feedback', label: '오늘 가장 배운 점 1가지를 포스트잇에 적어 교문 앞에 붙여요', emoji: '💌' },
        ],
      },
    },
    assets: [
      { id: 'm6-l9-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l9-story-01.webp', alt: '방명록 디자인', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l9-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l9-story-02.webp', alt: '방명록 거치대 세팅', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '방명록은 전시회 배움을 확인하고 다음 성장을 이끄는 소중한 피드백 창구입니다.',
  },

  // ============================================================
  // m6-l10 안내 연습: 배움 전시회 진행하기
  // ============================================================
  {
    lessonId: 'm6-l10',
    moduleId: 'm6',
    number: 10,
    role: 'guided',
    title: '배움 전시회 진행하기',
    masterObjective: '오늘은 우리 부스를 찾아온 방문자에게 설명하고, 체험을 안내하며, 피드백을 모아 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01, STANDARD_CODES.SPEC_AI_02, STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['실제 전시 진행은 존중하는 태도로 설명하고, 안내하며, 소감을 경청하는 실행 과정이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'minjun'],
      location: '배움 전시회장',
      purpose: '찾아온 동생, 친구, 학부모 방문객들에게 미소와 예의로 부스를 실제 진행하기',
      mismatch: '수줍어하며 말을 못 건네거나 딴청을 피움',
      evidence: ['진행 일지', '모인 방명록 스티커판'],
      resolution: '환한 미소로 방문객을 맞이하고 1분 설명과 팩트체크 체험을 성공적으로 완수함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '방문자 맞이와 1분 설명',
        instruction: '부스를 찾아온 방문객에게 따뜻한 인사와 함께 준비한 1분 설명을 전해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '방문객이 부스에 도착했을 때 가장 먼저 할 행동은?',
          choices: [
            { id: 'welcome-smile', label: '눈을 마주치며 환하게 인사하고 우리 부스 주제를 소개해요', emoji: '😊' },
          ],
        },
        assetIds: ['m6-l10-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '체험 안내와 방명록 수집',
        instruction: '팩트체크 체험을 안내하고 체험을 마친 후 방명록 스티커 작성을 경청하며 안내합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '실제 부스를 진행하며 작성한 진행 일지 한 줄 소감을 적어보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'run-booth-log', label: '방문한 동생들이 팩트체크 체험에 신기해하며 재미있게 참여하고 칭찬 스티커를 붙여주었습니다!', emoji: '🎉' },
          ],
        },
        assetIds: ['m6-l10-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l10-artifact',
      title: '부스 진행 완료 기록',
      portfolioLabel: '실제 부스 진행 일지 및 방명록 수집 기록',
      fields: [
        { id: 'boothRunLogText', label: '내가 직접 부스를 운영하고 느낀 실전 현장 일지', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '일일 안시 안내원 봉사',
      scenario: '교내 행사에서 방문객 안내 봉사를 할 때 갖추어야 할 자세는?',
      activity: {
        id: 'act-transfer-m6-l10',
        kind: 'single-choice',
        prompt: '안내원의 올바른 습관은?',
        choices: [
          { id: 'guide-polite', label: '친절하고 정확하게 동선을 안내하고 경청하는 자세를 유지해요', emoji: '🙋' },
        ],
      },
    },
    assets: [
      { id: 'm6-l10-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l10-story-01.webp', alt: '방문객 맞이', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l10-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l10-story-02.webp', alt: '성공적 부스 진행', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '실제 전시 진행은 친절함과 경청의 자세로 배움을 공유하는 멋진 순간입니다.',
  },

  // ============================================================
  // m6-l11 플래그십: 배움 소감과 나의 성장 기록
  // ============================================================
  {
    lessonId: 'm6-l11',
    moduleId: 'm6',
    number: 11,
    role: 'flagship',
    title: '배움 소감과 나의 성장 기록',
    masterObjective: '오늘은 전시회를 마치고 모인 방명록과 모듈 1~6의 성장을 돌아보며 나의 소감을 작성해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01, STANDARD_CODES.SPEC_AI_02, STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['성장은 AI 기술 사용력만이 아니라 확인, 안전, 내 생각, 책임의 발전을 포함한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'minjun'],
      location: '동아리방',
      purpose: '방명록 스티커와 M1~M6 포트폴리오를 돌아보며 성장 3영역(확인, 안전, 주체성) 평가 소감 작성하기',
      mismatch: 'AI 기능만 많이 안 것을 성장으로 착각함',
      evidence: ['모인 방명록 스티커판', 'M1~M6 포트폴리오 북', '성장 3영역 평가표'],
      resolution: '확인하는 습관, 안전을 지키는 태도, 내 생각을 세우는 주체성 성장을 깨닫고 발표함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '모인 방명록과 성장 성찰',
        instruction: '방명록에 모인 칭찬과 모듈 1~6의 배움 발자국을 하나씩 되돌아봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '디지털 교과서를 마치며 나의 가장 큰 진짜 성장은 무엇인가요?',
          choices: [
            { id: 'true-growth-mind', label: 'AI 대답을 무조건 믿지 않고, 내 생각을 주체적으로 세우게 된 점이에요', emoji: '🌱' },
          ],
        },
        assetIds: ['m6-l11-story-01', 'm6-l11-story-02'],
        support: {},
      },
      {
        id: 's2-compare',
        phase: 'compare',
        title: '성장 3영역 평가 (확인, 안전, 주체성)',
        instruction: '모듈 1(첫만남)과 모듈 6(전시회)의 내 모습 변화를 대조해보세요.',
        activity: {
          id: 'act-s2',
          kind: 'compare',
          prompt: '모듈 1의 내 모습과 모듈 6의 성숙해진 내 모습을 대조하세요.',
          left: { title: '모듈 1 첫 출발 때', content: 'AI가 주는 대답이 무조건 신기해서 그대로 다 믿으려 함' },
          right: { title: '모듈 6 현재 완성 모습', content: '공식 자료로 대조 확인하고, 개인정보를 가리며, 내 주장을 세움' },
          criteria: [{ id: 'digital-citizen', label: '주체적인 디지털 시민으로 성장했는가' }],
        },
        assetIds: ['m6-l11-story-02', 'm6-l11-story-03'],
        support: {},
      },
      {
        id: 's3-decision',
        phase: 'decision',
        title: '나의 배움 소감 발표',
        instruction: '68차시 전체 배움을 아우르는 나의 진솔한 배움 소감을 작성하고 공유합니다.',
        activity: {
          id: 'act-s3',
          kind: 'expression',
          prompt: '나의 최종 배움 소감 문장을 작성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'final-reflection', label: 'AI는 내 배움을 돕는 훌륭한 도구이며, 생각하고 확인하며 완성하는 주인은 나 자신임을 배웠습니다!', emoji: '🎓' },
          ],
        },
        assetIds: ['m6-l11-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l11-artifact',
      title: '배움 소감과 성장 포트폴리오',
      portfolioLabel: 'M1~M6 종합 성장 성찰 및 배움 소감문',
      fields: [
        { id: 'reflectionText', label: '내가 작성한 68차시 종합 배움 소감문', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '디지털 미래 다짐',
      scenario: '앞으로 새로운 AI 기술을 접할 때 나의 평생 약속은?',
      activity: {
        id: 'act-transfer-m6-l11',
        kind: 'single-choice',
        prompt: '앞으로의 디지털 주체성 다짐은?',
        choices: [
          { id: 'future-ai-promise', label: '항상 호기심을 갖고 쓰되, 사실을 대조 확인하고 안전하게 내 생각을 펼칩니다', emoji: '🌟' },
        ],
      },
    },
    assets: [
      { id: 'm6-l11-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l11-story-01.webp', alt: '칭찬 스티커 읽기', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l11-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l11-story-02.webp', alt: '성장 모습 돌아보기', required: true, purpose: '스토리 컷 2' },
      { id: 'm6-l11-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l11-story-03.webp', alt: '성장 카드 작성', required: true, purpose: '스토리 컷 3' },
      { id: 'm6-l11-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l11-story-04.webp', alt: '배움 소감 발표', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '진짜 성장은 기술 사용을 넘어 생각하고 검증하며 안전을 지키는 주체적인 태도에서 이루어집니다.',
  },

  // ============================================================
  // m6-l12 프로젝트: AI 동아리 총괄 수료식
  // ============================================================
  {
    lessonId: 'm6-l12',
    moduleId: 'm6',
    number: 12,
    role: 'project',
    title: 'AI 동아리 총괄 수료식',
    masterObjective: '오늘은 모듈 1~6의 모든 산출물이 담긴 포트폴리오를 완성하고 AI 교육 수료증을 받아요.',
    standards: [STANDARD_CODES.SPEC_AI_01, STANDARD_CODES.SPEC_AI_02, STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['수료는 68차시 배움의 완성이자 주체적인 디지털 시민으로 나아가는 시작이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna', 'minjun'],
      location: '학교 강당 수료식장',
      purpose: 'M1~M6 산출물 6종을 묶어 총괄 포트폴리오 북을 조립하고 수료증 수여받기',
      mismatch: '수료식 준비 미흡으로 마지막 회고가 없음',
      evidence: ['M1~M6 6종 완성 산출물 북', '수료증 템플릿'],
      resolution: '주체적인 AI 리더 수료증을 수여받고 68차시 대단원의 막을 완벽히 내림',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: 'M1~M6 6종 산출물 총집결',
        instruction: '모듈 1부터 6까지 완성한 6개 핵심 대표작을 총괄 포트폴리오 북에 묶어봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '총괄 포트폴리오 북 완성을 위한 나의 다짐은?',
          choices: [
            { id: 'complete-book', label: '6개 모듈 배움이 모두 담긴 자랑스러운 포트폴리오를 완성해요!', emoji: '📚' },
          ],
        },
        assetIds: ['m6-l12-story-01'],
        support: {},
      },
      {
        id: 's2-artifact',
        phase: 'artifact',
        title: '나만의 AI 학습 헌장 작성',
        instruction: '앞으로 주체적인 AI 사용자가 되기 위한 3가지 학습 헌장을 조립하고 서명하세요.',
        activity: {
          id: 'act-s2',
          kind: 'build',
          prompt: '나만의 AI 학습 헌장 3대 슬롯을 완성해보세요.',
          slots: [
            { id: 'c-check', label: '1헌장: 대조 확인의 원칙' },
            { id: 'c-safe', label: '2헌장: 개인정보 보호와 안전 원칙' },
            { id: 'c-think', label: '3헌장: 내 생각 주체성의 원칙' },
          ],
          pieces: [
            { id: 'p-1', label: '유창한 답변도 공식 자료로 항상 검증한다', slotId: 'c-check' },
            { id: 'p-2', label: '비밀번호와 단서를 절대 남에게 안 주고 가린다', slotId: 'c-safe' },
            { id: 'p-3', label: 'AI 제안에 의존 않고 내 주장을 당당히 세운다', slotId: 'c-think' },
          ],
        },
        assetIds: ['m6-l12-story-02'],
        support: {},
      },
      {
        id: 's3-decision',
        phase: 'decision',
        title: '수료증 수여 및 완주 발표',
        instruction: '민준 선생님으로부터 수료증을 전달받고 당당하게 완주를 발표합니다.',
        activity: {
          id: 'act-s3',
          kind: 'expression',
          prompt: '수료증을 받는 소감과 완주 선언을 적어보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'graduation-declaration', label: '68차시 디지털 배움을 완료하고 주체적인 AI 리더로 성장했습니다! 성실히 지켜나가겠습니다!', emoji: '🎓' },
          ],
        },
        assetIds: ['m6-l12-story-03'],
        support: {},
      },
    ],
    artifact: {
      id: 'm6-l12-artifact',
      title: 'AI 교육 수료 포트폴리오 및 수료증',
      portfolioLabel: '68차시 총괄 완주 포트폴리오 북 및 수료증',
      fields: [
        { id: 'charterRules', label: '내가 서명한 나만의 AI 3대 학습 헌장', input: 'text', required: true },
        { id: 'completionCertificate', label: '68차시 디지털 수료증 번호 및 소감', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '68차시 총괄 리모델링 완주',
      scenario: '전체 68차시 초등 AI 디지털 교과서 콘텐츠 전면 리모델링 완주 성공!',
      activity: {
        id: 'act-transfer-m6-l12',
        kind: 'single-choice',
        prompt: '68차시 리모델링 축하 완주 버튼을 누르세요!',
        choices: [
          { id: 'final-congratulations', label: '축하합니다! 68차시 초등 AI 교과서 전면 리모델링 완주 달성!', emoji: '🎉' },
        ],
      },
    },
    assets: [
      { id: 'm6-l12-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l12-story-01.webp', alt: '포트폴리오 북 완성', required: true, purpose: '스토리 컷 1' },
      { id: 'm6-l12-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l12-story-02.webp', alt: '수료증 전달', required: true, purpose: '스토리 컷 2' },
      { id: 'm6-l12-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m6/m6-l12-story-03.webp', alt: '기념사진 폭죽 축하', required: true, purpose: '스토리 컷 3' },
    ],
    wrapUp: '68차시의 배움을 바탕으로 스스로 생각하고 검증하며 성장하는 주체적인 디지털 리더가 되었습니다.',
  },
];
