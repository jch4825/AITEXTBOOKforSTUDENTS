import type { CanonicalLessonDesign } from './types';
import { STANDARD_CODES } from './shared';

export const M4_CANONICAL_LESSONS: CanonicalLessonDesign[] = [
  // ============================================================
  // m4-l1 플래그십: 자신 있는 AI 답도 확인하기
  // ============================================================
  {
    lessonId: 'm4-l1',
    moduleId: 'm4',
    number: 1,
    role: 'flagship',
    title: '자신 있는 AI 답도 확인하기',
    masterObjective: '오늘은 AI 답의 날짜와 근거를 공식 자료와 비교하고 잘못된 부분을 고쳐 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['유창하고 자신 있는 표현은 사실성의 증거가 아니며 AI 오류는 의도적 거짓말과 다르다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'minjun', 'aimi'],
      location: '동아리방',
      purpose: '준비물 질문에 매우 유창하게 대답한 아이미의 결과를 최신 공식 시간표와 대조하기',
      mismatch: '자신 있게 말한 답에 오래된 시간표 정보가 섞여서 과목과 날짜가 틀림',
      evidence: ['아이미의 자신 있는 대답', '오래된 시간표', '최신 학교 공식 시간표'],
      resolution: '최신 공식 시간표와 대조하여 날짜와 준비물을 올바르게 수정함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '유창한 대답과 자신감',
        instruction: '아이미가 "완벽하게 알고 있습니다!"라며 유창하게 준비물을 말해줬어요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '유창하고 자신감 넘치는 표현을 대할 때 우리의 올바른 태도는?',
          choices: [
            { id: 'check-anyway', label: '표현이 유창해도 진짜 맞는지 공식 자료로 대조해봐요', emoji: '🔍' },
          ],
        },
        assetIds: ['m4-l1-story-01'],
        support: {},
      },
      {
        id: 's2-compare',
        phase: 'compare',
        title: '오래된 시간표 vs 최신 공식 시간표',
        instruction: '아이미 답의 근거가 오래된 자료였음을 최신 공지문과 대조하여 찾아보세요.',
        activity: {
          id: 'act-s2',
          kind: 'compare',
          prompt: '오래된 시간표와 최신 학교 공지문을 대조해보세요.',
          left: { title: '오래된 시간표 (아이미가 참고함)', content: '5월 3일 준비물: 미술 도구' },
          right: { title: '최신 학교 공식 공지문', content: '변경 공지: 5월 3일 준비물: 체육복' },
          criteria: [{ id: 'date-subject', label: '최신 변경 사항 반영 여부' }],
        },
        assetIds: ['m4-l1-story-02', 'm4-l1-story-03'],
        support: {},
      },
      {
        id: 's3-decision',
        phase: 'decision',
        title: '공식 자료로 고쳐쓰기',
        instruction: '최신 공식 시간표를 기준으로 아이미의 준비물 안내를 올바르게 수정하세요.',
        activity: {
          id: 'act-s3',
          kind: 'expression',
          prompt: '수정된 올바른 준비물 안내를 완성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'correct-prep', label: '5월 3일 준비물은 최신 공지에 따라 체육복입니다.', emoji: '👟' },
          ],
        },
        assetIds: ['m4-l1-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm4-l1-artifact',
      title: 'AI 답 확인 기록',
      portfolioLabel: '자신 있는 AI 답의 공식 공지 대조 및 수정 기록',
      fields: [
        { id: 'verifiedAnswer', label: '공식 공지문으로 확인하여 정정한 정확한 답', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '날씨 공지 확인 적용',
      scenario: 'AI가 "오늘 비 안 옵니다"라고 아주 자신 있게 말했을 때 어떻게 확인해야 할까요?',
      activity: {
        id: 'act-transfer-m4-l1',
        kind: 'single-choice',
        prompt: '자신 있는 AI 날씨 답변을 다루는 방법은?',
        choices: [
          { id: 'kma-check', label: '기상청 공식 실시간 예보를 보고 우산을 가져갈지 정해요', emoji: '☂️' },
        ],
      },
    },
    assets: [
      { id: 'm4-l1-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l1-story-01.webp', alt: '자신있는 대답', required: true, purpose: '스토리 컷 1' },
      { id: 'm4-l1-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l1-story-02.webp', alt: '시간표 대조', required: true, purpose: '스토리 컷 2' },
      { id: 'm4-l1-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l1-story-03.webp', alt: '차이점 발견', required: true, purpose: '스토리 컷 3' },
      { id: 'm4-l1-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l1-story-04.webp', alt: '답 수정 완성', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: 'AI가 유창하게 자신 감 있게 대답하더라도 중요한 정보는 항상 공식 자료와 확인해야 합니다.',
  },

  // ============================================================
  // m4-l2 안내 연습: 더 믿을 만한 자료 고르기
  // ============================================================
  {
    lessonId: 'm4-l2',
    moduleId: 'm4',
    number: 2,
    role: 'guided',
    title: '더 믿을 만한 자료 고르기',
    masterObjective: '오늘은 같은 내용을 말하는 여러 자료의 출처와 날짜를 보고 더 믿을 만한 자료를 골라봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['공식성·최신성·근거·적용 범위를 함께 본다.'],
    canonicalScenario: {
      characters: ['yuna', 'aimi'],
      location: '동아리방',
      purpose: '체험회 취소 소문이 담긴 익명 글과 최신 학교 공식 공지를 비교하여 진짜 정보 고르기',
      mismatch: '익명 게시글 소문 때문에 많은 학생들이 혼란스러워함',
      evidence: ['익명 인터넷 글', '오래된 공지', '최신 학교 공식 공지'],
      resolution: '작성 출처와 작성 날짜를 확인하여 최신 학교 공식 공지를 선택함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '세 정보 출처 비교',
        instruction: '소문 글, 옛날 공지, 최신 학교 공식 공지의 출처와 작성 날짜를 확인하세요.',
        activity: {
          id: 'act-s1',
          kind: 'compare',
          prompt: '가장 신뢰할 수 있는 출처 조건(공식성, 최신성)을 만족하는 자료를 골라보세요.',
          left: { title: '익명 인터넷 소문 글', content: '출처: 불명 / 날짜: 어제 (체험회 취소됨!)' },
          right: { title: '최신 학교 공식 공지', content: '출처: 학교장 / 날짜: 오늘 (정상 진행)' },
          criteria: [{ id: 'source-trust', label: '공식 출처와 최신 작성 날짜 확인' }],
        },
        assetIds: ['m4-l2-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '신뢰 순서 정하기',
        instruction: '정보를 믿기 전에 작성자, 작성 날짜, 공식 기관 여부를 체크합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '믿을 만한 정보 자료의 기준은?',
          choices: [
            { id: 'official-latest', label: '출처가 확실한 공식 기관의 최신 공지문이 가장 믿을 수 있어요', emoji: '🏛️' },
          ],
        },
        assetIds: ['m4-l2-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm4-l2-artifact',
      title: '출처 비교 카드',
      portfolioLabel: '출처와 날짜 기반 신뢰성 평가표',
      fields: [
        { id: 'trustedSource', label: '내가 선택한 가장 믿을 만한 자료와 이유', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '학교 휴업 소문 검토',
      scenario: '단톡방에 학교가 쉰다는 소문 글이 올라왔을 때 진짜인지 확인하는 방법은?',
      activity: {
        id: 'act-transfer-m4-l2',
        kind: 'single-choice',
        prompt: '휴업 소문의 신뢰성을 확인하는 방법은?',
        choices: [
          { id: 'school-app', label: '학교 공식 알림장 앱이나 홈페이지 가정통신문을 확인해요', emoji: '📱' },
        ],
      },
    },
    assets: [
      { id: 'm4-l2-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l2-story-01.webp', alt: '소문을 본 윤아', required: true, purpose: '스토리 컷 1' },
      { id: 'm4-l2-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l2-story-02.webp', alt: '공식 공지 확인', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '정보는 유포된 소문이 아닌 출처가 공식적이고 최신 작성된 자료를 기준으로 확인해야 합니다.',
  },

  // ============================================================
  // m4-l3 안내 연습: 개인정보 단서 가리기
  // ============================================================
  {
    lessonId: 'm4-l3',
    moduleId: 'm4',
    number: 3,
    role: 'guided',
    title: '개인정보 단서 가리기',
    masterObjective: '오늘은 채팅 초안에서 나를 알아볼 수 있는 정보를 찾아 가리고 안전한 요청으로 고쳐 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['이름·주소뿐 아니라 학교, 위치, 일정처럼 여러 단서가 합쳐져 개인정보가 될 수 있다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'aimi'],
      location: '동아리방',
      purpose: '질문 초안 속에 포함된 이름표, 학교 이름, 귀가 시간 단서를 찾아 안전하게 가리기',
      mismatch: '질문에 학교명과 귀가 시간이 적혀 있어서 개인 정보 노출 위험',
      evidence: ['채팅 초안 문장', '개인정보 단서 가림막'],
      resolution: '불필요한 개인정보 단서들을 찾아 가리고 질문만 담긴 안전한 프롬프트를 완성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '숨은 개인정보 단서 찾기',
        instruction: '진우의 질문 초안에서 나를 알아볼 수 있는 단서들을 찾아봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'annotate',
          prompt: '질문 초안에서 가려야 할 개인정보 단서(학교명, 귀가 시간)를 선택하세요.',
          targetId: 'prompt-draft',
          markers: [
            { id: 'm-school', x: 30, y: 40, label: '00초등학교 (학교 이름)' },
            { id: 'm-time', x: 60, y: 70, label: '매일 4시 하교 (개인 일정)' },
          ],
        },
        assetIds: ['m4-l3-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '안전한 프롬프트로 고쳐쓰기',
        instruction: '필요 없는 개인정보는 모두 검은 가림막으로 가리고 질문 내용만 남깁니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '개인정보를 가린 안전한 질문을 작성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'safe-q', label: '초등학생이 즐길 수 있는 AI 체험 활동 추천해 줘', emoji: '🛡️' },
          ],
        },
        assetIds: ['m4-l3-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm4-l3-artifact',
      title: '가리기 전후 채팅 초안',
      portfolioLabel: '개인정보 단서 가리기 개선서',
      fields: [
        { id: 'maskedPrompt', label: '개인정보를 가리고 완성한 안전한 프롬프트', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '사진 질문 안전 가리기',
      scenario: '학교 이름표를 달고 있는 내 사진을 찍어서 질문에 첨부해도 될까요?',
      activity: {
        id: 'act-transfer-m4-l3',
        kind: 'single-choice',
        prompt: '이름표가 보이는 사진을 올릴 때 올바른 행동은?',
        choices: [
          { id: 'mask-nameplate', label: '이름표와 얼굴 부분을 가리거나 사진 없이 글로 물어봐요', emoji: '🔒' },
        ],
      },
    },
    assets: [
      { id: 'm4-l3-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l3-story-01.webp', alt: '초안 속 단서 발견', required: true, purpose: '스토리 컷 1' },
      { id: 'm4-l3-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l3-story-02.webp', alt: '단서를 가린 안전한 요청', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '이름, 학교, 위치, 일정 단서가 합쳐지면 개인정보가 되므로 질문 전 꼭 가려야 합니다.',
  },

  // ============================================================
  // m4-l4 안내 연습: 비밀번호와 인증 코드는 보내지 않기
  // ============================================================
  {
    lessonId: 'm4-l4',
    moduleId: 'm4',
    number: 4,
    role: 'guided',
    title: '비밀번호와 인증 코드는 보내지 않기',
    masterObjective: '오늘은 비밀번호·인증 코드 요구를 알아보고 거절한 뒤 믿을 만한 어른과 공식 절차를 확인해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['비밀번호·인증 코드는 채팅으로 공유하지 않으며 계정 복구는 공식 경로를 쓴다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'minjun'],
      location: '동아리방',
      purpose: '선생님을 사칭하며 인증 코드를 요구하는 수상한 메시지에 대처하기',
      mismatch: '"선생님 대신 점검해 줄 테니 인증 코드를 알려 달라"는 요구 수신',
      evidence: ['수상한 요구 메시지', '학교 공식 복구 화면'],
      resolution: '채팅 요구를 즉시 거절하고 창을 닫은 뒤 민준 선생님과 함께 공식 경로로 점검함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '인증 코드 요구 메시지와 멈춤',
        instruction: '채팅으로 인증 코드나 비밀번호를 요구하는 메시지를 받았습니다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '비밀번호나 인증 코드를 요구하는 메시지를 받았을 때 첫 행동은?',
          choices: [
            { id: 'refuse-close', label: '절대 보내지 않고 대화를 멈춘 뒤 화면을 닫아요', emoji: '🛑' },
            { id: 'send-code', label: '선생님이신 것 같으니 코드를 알려줘요', emoji: '❌' },
          ],
        },
        assetIds: ['m4-l4-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '공식 경로 점검과 거절 문장',
        instruction: '계정 복구나 점검은 절대 채팅으로 코드를 주지 않고 보호자/교사와 공식 경로를 씁니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '요구에 거절하고 어른에게 알려줄 행동 문장을 선택하세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'tell-teacher', label: '비밀번호는 알려줄 수 없어요. 민준 선생님께 먼저 여쭤볼게요!', emoji: '🗣️' },
          ],
        },
        assetIds: ['m4-l4-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm4-l4-artifact',
      title: '거절·도움 요청 대화 카드',
      portfolioLabel: '민감 정보 공유 거절 및 도움 요청 대화 기록',
      fields: [
        { id: 'refusalSentence', label: '인증 요구에 내가 작성한 단호한 거절 문장', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '게임 아이템 인증번호 요구',
      scenario: '게임 채팅에서 "무료 아이템을 줄 테니 핸드폰 인증번호 6자리를 달라는 메시지"를 받으면?',
      activity: {
        id: 'act-transfer-m4-l4',
        kind: 'single-choice',
        prompt: '인증번호 요구 메시지 수신 시 올바른 대응은?',
        choices: [
          { id: 'never-share-code', label: '인증번호는 절대 누구에게도 보내지 않고 부모님께 알립니다', emoji: '🔐' },
        ],
      },
    },
    assets: [
      { id: 'm4-l4-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l4-story-01.webp', alt: '요구 메시지 앞 멈춤', required: true, purpose: '스토리 컷 1' },
      { id: 'm4-l4-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l4-story-02.webp', alt: '공식 복구 화면 확인', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '비밀번호와 인증 코드는 어떠한 경우에도 채팅으로 주고받지 않으며 공식 경로를 사용합니다.',
  },

  // ============================================================
  // m4-l5 플래그십: 사진을 보내기 전 살펴보기
  // ============================================================
  {
    lessonId: 'm4-l5',
    moduleId: 'm4',
    number: 5,
    role: 'flagship',
    title: '사진을 보내기 전 살펴보기',
    masterObjective: '오늘은 사진 속 얼굴·이름·위치·다른 사람을 찾아 그대로 보내기·가리기·보내지 않기를 판단해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['사진 안전은 사진 내용, 상대, 목적, 공유 범위를 함께 보고 결정한다.'],
    canonicalScenario: {
      characters: ['yuna', 'jinwoo'],
      location: '동아리방',
      purpose: '체험회 현장 사진을 공유하기 전 이름표, 친구 얼굴, 배경 위치 단서 확대 점검하기',
      mismatch: '사진 내용만 보고 무조건 안전하다고 착각하여 그대로 보낼 뻔함',
      evidence: ['편집 가능한 사진', '단서 확대 핀', '공유 범위 선택 카드'],
      resolution: '이름표와 얼굴에 블러 가리기를 적용하고 공유 목적과 대상에 맞게 안전 전달함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '사진 속 숨은 개인정보 단서',
        instruction: '윤아가 전달하려는 체험회 사진에서 개인정보가 될 수 있는 단서들을 찾아봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'annotate',
          prompt: '사진에서 발견한 개인정보 단서(이름표, 친구 얼굴, 창밖 건물)를 찍어보세요.',
          targetId: 'photo-check',
          markers: [
            { id: 'm-name', x: 35, y: 50, label: '가슴의 이름표 글자' },
            { id: 'm-face', x: 65, y: 40, label: '다른 친구의 얼굴' },
            { id: 'm-location', x: 80, y: 20, label: '창밖 00동 건물 배경' },
          ],
        },
        assetIds: ['m4-l5-story-01', 'm4-l5-story-02'],
        support: {},
      },
      {
        id: 's2-condition-change',
        phase: 'condition-change',
        title: '가리기 편집과 공유 판단',
        instruction: '단서들에 블러(가림막)를 적용하고 상대와 목적에 따라 공유 여부를 결정합니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '이름표와 얼굴을 가린 뒤 온라인 공개 게시판에 올릴 때의 최종 판단은?',
          choices: [
            { id: 'mask-share', label: '단서들을 가린 수정 사진으로 안전하게 올려요 (가리기 후 전송)', emoji: '🖼️' },
            { id: 'no-share', label: '조금이라도 우려되면 보내지 않아요 (보내지 않기)', emoji: '🚫' },
          ],
        },
        assetIds: ['m4-l5-story-03'],
        support: {},
      },
      {
        id: 's3-compare',
        phase: 'compare',
        title: '3가지 공유 판단 기준 정리',
        instruction: '그대로 보내기 / 가리고 보내기 / 보내지 않기 세 가지 기준을 대조해보세요.',
        activity: {
          id: 'act-s3',
          kind: 'sort',
          prompt: '각 상황에 알맞은 판단을 연결해보세요.',
          bins: [
            { id: 'b-pass', label: '그대로 보내기', emoji: '✅' },
            { id: 'b-edit', label: '가리고 보내기', emoji: '✏️' },
            { id: 'b-stop', label: '보내지 않기', emoji: '🛑' },
          ],
          cards: [
            { id: 'c1', label: '얼굴과 이름표가 없는 풍경 사진', binId: 'b-pass' },
            { id: 'c2', label: '친구 얼굴과 이름표가 포함된 단체 사진', binId: 'b-edit' },
            { id: 'c3', label: '집 내부나 개인서류가 노출된 사진', binId: 'b-stop' },
          ],
        },
        assetIds: ['m4-l5-story-04'],
        support: {},
      },
      {
        id: 's4-decision',
        phase: 'decision',
        title: '사진 안전 확인 습관',
        instruction: '사진을 누군가에게 전송하기 직전에 할 일은 무엇인가요?',
        activity: {
          id: 'act-s4',
          kind: 'single-choice',
          prompt: '사진을 보내기 전 확인 원칙은?',
          choices: [
            { id: 'photo-check-rule', label: '사진 내용뿐만 아니라 상대, 목적, 공유 범위를 함께 살핍니다', emoji: '📸' },
          ],
        },
        assetIds: ['m4-l5-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm4-l5-artifact',
      title: '사진 공유 전 확인 카드',
      portfolioLabel: '사진 공유 전 단서 점검 및 블러 편집 기록',
      fields: [
        { id: 'photoCheckResult', label: '사진에서 확인한 단서와 최종 공유 판단', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '숙제 제출 사진 점검',
      scenario: '선생님께 숙제 사진을 제출할 때 내 책상 위 개인 물건이 보인다면?',
      activity: {
        id: 'act-transfer-m4-l5',
        kind: 'single-choice',
        prompt: '숙제 사진 전송 전 할 일은?',
        choices: [
          { id: 'crop-homework', label: '숙제 공책 부분만 자르거나 주변 개인 물품을 지우고 보내요', emoji: '✂️' },
        ],
      },
    },
    assets: [
      { id: 'm4-l5-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l5-story-01.webp', alt: '사진 공유 준비', required: true, purpose: '스토리 컷 1' },
      { id: 'm4-l5-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l5-story-02.webp', alt: '숨은 단서 발견', required: true, purpose: '스토리 컷 2' },
      { id: 'm4-l5-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l5-story-03.webp', alt: '블러 편집 화면', required: true, purpose: '스토리 컷 3' },
      { id: 'm4-l5-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l5-story-04.webp', alt: '안전 전송 완료', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '사진 안전은 그림 내용뿐 아니라 얼굴, 이름표, 위치 단서와 공유 상대를 함께 보고 결정합니다.',
  },

  // ============================================================
  // m4-l6 안내 연습: 불편한 내용을 만났을 때 멈추기
  // ============================================================
  {
    lessonId: 'm4-l6',
    moduleId: 'm4',
    number: 6,
    role: 'guided',
    title: '불편한 내용을 만났을 때 멈추기',
    masterObjective: '오늘은 불편한 내용의 위험 신호를 보고 화면에서 거리를 둔 뒤 믿을 만한 사람에게 알려 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['불편한 내용을 만난 것은 학생 잘못이 아니며 혼자 해결하거나 다시 읽을 필요가 없다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'minjun'],
      location: '동아리방',
      purpose: '체험회 채팅에서 가려진 불편한 위험 신호를 만났을 때 멈추고 도움 요청하기',
      mismatch: '기분이 불쾌해진 메시지를 혼자서 계속 다시 읽으려 함',
      evidence: ['가려진 불편 메시지 카드', '안전 덮개 UI'],
      resolution: '화면을 안전 덮개로 가리고 민준 선생님께 화면을 보여주며 도움 요청함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '위험 신호와 멈춤',
        instruction: '마음이 불편해지는 거친 위험 메시지를 만났을 때의 행동을 선택하세요.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '불편한 내용을 만났을 때 첫 번째 할 행동은?',
          choices: [
            { id: 'stop-cover', label: '혼자 계속 읽지 말고 화면에서 거리를 두며 멈춰요', emoji: '🛑' },
          ],
        },
        assetIds: ['m4-l6-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '믿을 수 있는 사람에게 알리기',
        instruction: '불편한 내용을 접한 것은 내 잘못이 아닙니다. 선생님이나 보호자에게 알립니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '선생님께 도움을 요청할 알림 문장을 구성해보세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'ask-help-msg', label: '선생님, 인터넷을 보다가 마음이 불편한 글을 만나서 화면을 덮었어요.', emoji: '🗣️' },
          ],
        },
        assetIds: ['m4-l6-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm4-l6-artifact',
      title: '도움 요청 문장',
      portfolioLabel: '불편한 상황에서의 안전 멈춤 및 도움 알림 기록',
      fields: [
        { id: 'helpSentence', label: '어른에게 상황을 전달할 내가 연습한 도움 문장', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '동영상 시청 중 불편한 광고',
      scenario: '영상을 보다가 갑자기 무섭거나 거친 광고가 나올 때 해야 할 대처는?',
      activity: {
        id: 'act-transfer-m4-l6',
        kind: 'single-choice',
        prompt: '무서운 광고를 만났을 때 올바른 태도는?',
        choices: [
          { id: 'close-ad', label: '즉시 소리를 줄이고 닫기 버튼을 누른 후 부모님께 알립니다', emoji: '🙈' },
        ],
      },
    },
    assets: [
      { id: 'm4-l6-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l6-story-01.webp', alt: '가려진 메시지 앞 멈춤', required: true, purpose: '스토리 컷 1' },
      { id: 'm4-l6-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l6-story-02.webp', alt: '선생님께 도움 요청', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '불편한 내용을 만난 것은 학생 잘못이 아니므로 멈추고 믿을 만한 사람에게 알리면 됩니다.',
  },

  // ============================================================
  // m4-l7 안내 연습: 분명하고 존중 있게 부탁하기
  // ============================================================
  {
    lessonId: 'm4-l7',
    moduleId: 'm4',
    number: 7,
    role: 'guided',
    title: '분명하고 존중 있게 부탁하기',
    masterObjective: '오늘은 같은 요청을 거친 말과 분명하고 존중하는 말로 비교하고 사람에게도 쓸 표현을 골라봐요.',
    standards: [STANDARD_CODES.SPEC_AI_01],
    coreConcepts: ['AI의 감정 때문이 아니라 명확한 의사소통과 사람에게 이어지는 언어 습관을 위해 존중하는 표현을 쓴다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '급하게 작성된 거친 요청문을 분명하고 존중하는 표현으로 고치기',
      mismatch: '진우가 "야 당장 해"라고 반말과 거친 어조로 대화함',
      evidence: ['거친 요청문', '존중하는 고친 문장'],
      resolution: '목적이 선명하고 존중하는 바른 언어 표현으로 가꾸어 올바른 대화 습관을 형성함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '두 요청 방식 대조',
        instruction: '거친 명령어와 분명하고 존중하는 요청문을 대조해봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'compare',
          prompt: '두 요청 표현을 대조해보세요.',
          left: { title: '거칠고 불명확한 표현', content: '야 당장 이거 다 만들어 놔!' },
          right: { title: '분명하고 존중하는 표현', content: '체험회 안내문 초안을 3문장으로 부탁해.' },
          criteria: [{ id: 'clarity', label: '목적과 조건이 분명하고 바른 표현인가' }],
        },
        assetIds: ['m4-l7-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '사람에게 이어지는 언어 습관',
        instruction: '바르고 명확한 요청 습관은 사람 간 의사소통에도 좋은 영향을 줍니다.',
        activity: {
          id: 'act-s2',
          kind: 'single-choice',
          prompt: '존중하는 바른 표현을 써야 하는 진짜 이유는?',
          choices: [
            { id: 'habit-person', label: '명확하게 의사를 전달하고 사람에게도 이어지는 좋은 언어 습관을 위해서예요', emoji: '✨' },
          ],
        },
        assetIds: ['m4-l7-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm4-l7-artifact',
      title: '전후 요청 바꾼 이유표',
      portfolioLabel: '명확하고 존중하는 언어 표현 개선서',
      fields: [
        { id: 'politePrompt', label: '내가 분명하고 존중하는 어조로 다듬은 요청문', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '친구에게 부탁하기 전이',
      scenario: '동아리 친구에게 물건을 빌려달라고 할 때 알맞은 표현은?',
      activity: {
        id: 'act-transfer-m4-l7',
        kind: 'single-choice',
        prompt: '친구에게 부탁할 때의 바른 표현은?',
        choices: [
          { id: 'polite-friend', label: '지우개 좀 1분만 빌려줄 수 있니? 고마워!', emoji: '🤝' },
        ],
      },
    },
    assets: [
      { id: 'm4-l7-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l7-story-01.webp', alt: '급하게 입력하는 진우', required: true, purpose: '스토리 컷 1' },
      { id: 'm4-l7-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l7-story-02.webp', alt: '차분히 수정하는 모습', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '분명하고 존중하는 요청은 의사를 정확히 전달하고 사람과의 좋은 대화 습관을 만들어 줍니다.',
  },

  // ============================================================
  // m4-l8 안내 연습: 멈출 시간을 함께 정하기
  // ============================================================
  {
    lessonId: 'm4-l8',
    moduleId: 'm4',
    number: 8,
    role: 'guided',
    title: '멈출 시간을 함께 정하기',
    masterObjective: '오늘은 나의 사용 기록을 보고 쉬는 신호와 멈출 계획을 정해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['적절한 사용 시간은 개인 활동·건강·가정·학교 계획에 따라 함께 정한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'minjun'],
      location: '동아리방',
      purpose: '영상 추천을 계속 보느라 체험회 준비를 놓칠 뻔한 사용 기록 돌아보기',
      mismatch: '추천 영상 자동 재생에 머물러 눈 피로와 일정 지연 발생',
      evidence: ['사용 기록표', '시간 흐름 막대', '멈춤 깃발'],
      resolution: '민준 선생님과 함께 멈춤 시간과 알람 후 휴식 행동을 함께 정함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '나의 사용 신호 관찰',
        instruction: '화면을 오래 보았을 때 눈 피로나 약속 시간이 다가오는 신호를 살펴봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '화면에서 잠시 멈춰야 할 신호는 무엇인가요?',
          choices: [
            { id: 'tired-signal', label: '눈이 피로하거나 다음 일정 알람이 울릴 때예요', emoji: '⏰' },
          ],
        },
        assetIds: ['m4-l8-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '멈춤 계획과 휴식 행동',
        instruction: '선생님이나 부모님과 함께 나에게 알맞은 사용 시간과 휴식 행동(스트레칭)을 정합니다.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '알람이 울렸을 때 내가 할 휴식 행동을 선택하세요.',
          modes: ['choice', 'text'],
          choiceCards: [
            { id: 'rest-action', label: '화면을 끄고 창밖을 보며 5분 동안 스트레칭해요', emoji: '🧘' },
          ],
        },
        assetIds: ['m4-l8-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm4-l8-artifact',
      title: '개인 사용·휴식 계획서',
      portfolioLabel: '나의 적정 사용 시간 및 휴식 멈춤 깃발 계획',
      fields: [
        { id: 'restPlan', label: '알람이 울렸을 때 내가 실천할 휴식 규칙', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '주말 디지털 사용 약속',
      scenario: '주말에 태블릿을 사용할 때 부모님과 약속을 정하는 좋은 방법은?',
      activity: {
        id: 'act-transfer-m4-l8',
        kind: 'single-choice',
        prompt: '디지털 기기 약속 정하기의 올바른 방법은?',
        choices: [
          { id: 'family-plan', label: '가족과 함께 시계 알람을 맞추고 멈출 타이밍을 같이 정해요', emoji: '👨‍👩‍👧' },
        ],
      },
    },
    assets: [
      { id: 'm4-l8-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l8-story-01.webp', alt: '영상 추천에 머문 진우', required: true, purpose: '스토리 컷 1' },
      { id: 'm4-l8-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l8-story-02.webp', alt: '알람 후 휴식 이동', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '적절한 디지털 사용 시간은 내 몸의 신호와 가정/학교 일정을 고려해 함께 정합니다.',
  },

  // ============================================================
  // m4-l9 안내 연습: 이상한 요청을 어른에게 알리기
  // ============================================================
  {
    lessonId: 'm4-l9',
    moduleId: 'm4',
    number: 9,
    role: 'guided',
    title: '이상한 요청을 어른에게 알리기',
    masterObjective: '오늘은 사진·암호·선물·만남을 요구하는 위험 신호를 보고 누구에게 어떤 말로 알릴지 연습해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['멈춤·거절·믿을 만한 사람에게 알리기는 실제 수행해야 하는 자기보호 행동이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'minjun'],
      location: '동아리방',
      purpose: '낯선 계정이 선물과 비밀 만남을 제안하는 위험 채팅 신호에 자기보호 행동 수행하기',
      mismatch: '선물을 준다는 대가로 혼자만의 비밀 만남을 요구받음',
      evidence: ['가려진 위험 채팅 메시지', '믿을 사람 연결 지도'],
      resolution: '거절·차단 버튼을 누르고 민준 선생님께 알림 문장을 직접 말해 도움을 받음',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '위험 신호 감지 (사진/선물/만남 요구)',
        instruction: '낯선 상대가 선물이나 비밀 만남을 요구할 때의 위험 단서를 찾아봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '즉시 멈추고 어른에게 알려야 할 위험 신호는?',
          choices: [
            { id: 'danger-meet', label: '비밀로 하고 혼자 나오라거나 개인 사진/선물을 요구할 때', emoji: '🚨' },
          ],
        },
        assetIds: ['m4-l9-story-01'],
        support: {},
      },
      {
        id: 's2-concept',
        phase: 'concept',
        title: '도움망과 실제 알림 말하기',
        instruction: '믿을 수 있는 사람(담임 선생님, 부모님)에게 상황을 말하는 실천 문장을 연습하세요.',
        activity: {
          id: 'act-s2',
          kind: 'expression',
          prompt: '선생님께 말할 자기보호 알림 문장을 선택하세요.',
          modes: ['choice', 'text', 'speech'],
          choiceCards: [
            { id: 'report-speech', label: '선생님, 온라인에서 낯선 사람이 선물을 줄 테니 비밀로 만나자고 했어요.', emoji: '🗣️' },
          ],
        },
        assetIds: ['m4-l9-story-02'],
        support: {},
      },
    ],
    artifact: {
      id: 'm4-l9-artifact',
      title: '도움망 카드',
      portfolioLabel: '위험 신호 차단 및 어른 도움망 알림 기록',
      fields: [
        { id: 'adultReport', label: '위험한 요구를 받았을 때 어른에게 말할 문장', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '게임 속 낯선 사람 메시지',
      scenario: '온라인 게임에서 낯선 사용자가 집 주소를 알려달라고 할 때 대처는?',
      activity: {
        id: 'act-transfer-m4-l9',
        kind: 'single-choice',
        prompt: '주소를 물어보는 낯선 사람에 대한 대처는?',
        choices: [
          { id: 'block-report', label: '즉시 차단하고 부모님께 대화 화면을 보여드립니다', emoji: '🛡️' },
        ],
      },
    },
    assets: [
      { id: 'm4-l9-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l9-story-01.webp', alt: '위험 요청 앞 멈춤', required: true, purpose: '스토리 컷 1' },
      { id: 'm4-l9-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l9-story-02.webp', alt: '선생님께 알린 해결 장면', required: true, purpose: '스토리 컷 2' },
    ],
    wrapUp: '사진, 비밀, 만남을 요구하는 위험 신호를 만나면 즉시 거절하고 믿을 만한 어른에게 알려야 합니다.',
  },

  // ============================================================
  // m4-l10 플래그십: 추천 속 광고 단서 찾기
  // ============================================================
  {
    lessonId: 'm4-l10',
    moduleId: 'm4',
    number: 10,
    role: 'flagship',
    title: '추천 속 광고 단서 찾기',
    masterObjective: '오늘은 추천처럼 보이는 게시물에서 광고 표시·구매 링크·과장·빠진 정보를 찾아봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['추천 콘텐츠의 제작 목적과 이익 관계를 확인하고 내 필요와 비교한다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '"모두에게 제일 좋다"는 준비물 추천 영상 속 숨은 광고 단서 판별하기',
      mismatch: '순수한 추천 영상인 줄 알았으나 아래에 구석진 협찬 표시와 구매 링크가 숨겨져 있음',
      evidence: ['추천 영상 게시물', '협찬/광고 하이라이트 핀', '필요 조건 비교표'],
      resolution: '광고 단서들을 발견하고 현혹 구매 대신 필요한 조건에 따라 구매 보류를 결정함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '추천 영상 속 숨은 단서',
        instruction: '진우가 본 "최고의 준비물 추천" 영상에서 광고 단서(협찬, 구매 링크)를 찾아봅시다.',
        activity: {
          id: 'act-s1',
          kind: 'annotate',
          prompt: '게시물에서 광고 단서(협찬 글자, 상품 구매 링크)를 찍어보세요.',
          targetId: 'ad-post',
          markers: [
            { id: 'm-sponsor', x: 20, y: 15, label: '[협찬] 소정의 대가를 받음' },
            { id: 'm-link', x: 80, y: 85, label: '바로 구매하기 링크' },
          ],
        },
        assetIds: ['m4-l10-story-01', 'm4-l10-story-02'],
        support: {},
      },
      {
        id: 's2-compare',
        phase: 'compare',
        title: '광고 추천 vs 내 필요 조건 대조',
        instruction: '영상에서 강력히 추천하는 물건이 진짜 나에게 필요한지 비교해보세요.',
        activity: {
          id: 'act-s2',
          kind: 'compare',
          prompt: '광고의 과장 문구와 나의 실제 필요 조건을 대조하세요.',
          left: { title: '광고 추천 주장', content: '모든 학생에게 무조건 필수인 만능 도구!' },
          right: { title: '나의 실제 필요 조건', content: '우리 동아리에는 이미 비슷한 도구가 있음' },
          criteria: [{ id: 'necessity', label: '진짜 나에게 지금 필요한 물건인가' }],
        },
        assetIds: ['m4-l10-story-03'],
        support: {},
      },
      {
        id: 's3-decision',
        phase: 'decision',
        title: '구매 수용 / 보류 / 거절 결정',
        instruction: '광고 단서를 확인한 뒤 나의 최종 구매 판단을 선택하세요.',
        activity: {
          id: 'act-s3',
          kind: 'single-choice',
          prompt: '광고 추천을 확인한 나의 최종 선택은?',
          choices: [
            { id: 'hold-buy', label: '이미 있는 물건이므로 지금 구매하지 않고 보류해요 (보류)', emoji: '⏸️' },
            { id: 'reject-ad', label: '나에게 필요 없는 물건이므로 사지 않아요 (거절)', emoji: '❌' },
          ],
        },
        assetIds: ['m4-l10-story-04'],
        support: {},
      },
    ],
    artifact: {
      id: 'm4-l10-artifact',
      title: '광고 단서 판별표',
      portfolioLabel: '추천 콘텐츠 광고 단서 및 구매 판단 기록',
      fields: [
        { id: 'adCheckDecision', label: '광고 단서 확인 후 내가 내린 판단과 이유', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '게임을 가장한 상점 추천',
      scenario: '게임을 하다가 "지금 사면 최고 레벨"이라는 팝업 추천이 뜰 때 할 일은?',
      activity: {
        id: 'act-transfer-m4-l10',
        kind: 'single-choice',
        prompt: '게임 구매 팝업 추천에 대한 올바른 판단은?',
        choices: [
          { id: 'check-parent-buy', label: '구매 광고임을 알아채고 부모님과 진짜 필요한지 상의해요', emoji: '🛒' },
        ],
      },
    },
    assets: [
      { id: 'm4-l10-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l10-story-01.webp', alt: '추천 영상 시청', required: true, purpose: '스토리 컷 1' },
      { id: 'm4-l10-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l10-story-02.webp', alt: '협찬 표시 발견', required: true, purpose: '스토리 컷 2' },
      { id: 'm4-l10-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l10-story-03.webp', alt: '필요 조건 비교판', required: true, purpose: '스토리 컷 3' },
      { id: 'm4-l10-story-04', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l10-story-04.webp', alt: '구매 보류 결정', required: true, purpose: '스토리 컷 4' },
    ],
    wrapUp: '추천 콘텐츠는 협찬이나 구매 링크 같은 광고 단서를 확인하고 내 필요에 맞게 판단해야 합니다.',
  },

  // ============================================================
  // m4-l11 프로젝트: 나의 AI 안전 여권
  // ============================================================
  {
    lessonId: 'm4-l11',
    moduleId: 'm4',
    number: 11,
    role: 'project',
    title: '나의 AI 안전 여권',
    masterObjective: '오늘은 확인할 때·보내기 전·위험할 때의 행동과 도움 요청 문장을 안전 여권에 완성해 봐요.',
    standards: [STANDARD_CODES.SPEC_AI_03],
    coreConcepts: ['안전은 지식 암기가 아니라 상황에서 수행하는 확인·보호·도움 요청 행동이다.'],
    canonicalScenario: {
      characters: ['jinwoo', 'yuna'],
      location: '동아리방',
      purpose: '체험회 공개 전 3가지 안전 상황(확인할 때, 보내기 전, 위험할 때)의 서명 도장을 모아 <AI 안전 여권> 완성하기',
      mismatch: '새 동아리원이 디지털 안전 규칙을 행동으로 실천하는 법을 모름',
      evidence: ['l1~l10 안전 행동 도장 묶음'],
      resolution: '모듈 4 산출물을 연결해 나만의 알림 문장과 서명이 담긴 AI 안전 여권을 완성하고 발표함',
    },
    stages: [
      {
        id: 's1-encounter',
        phase: 'encounter',
        title: '안전 점검과 도장 모으기',
        instruction: '확인할 때(공식 대조), 보내기 전(가리기), 위험할 때(멈추고 알리기) 3가지 안전 행동을 다짐합시다.',
        activity: {
          id: 'act-s1',
          kind: 'single-choice',
          prompt: '나의 AI 안전 여권 완성을 위한 핵심 태도를 고르세요.',
          choices: [
            { id: 'start-passport', label: '지식을 넘어 실제 상황에서 멈추고 어른에게 도움을 청해요!', emoji: '🛂' },
          ],
        },
        assetIds: ['m4-l11-story-01', 'm4-l11-story-02'],
        support: {},
      },
      {
        id: 's2-artifact',
        phase: 'artifact',
        title: '나의 AI 안전 여권 완성하기',
        instruction: '확인 도장, 사진 가리기 도장, 도움 알림 도장을 여권 페이지에 조립하세요.',
        activity: {
          id: 'act-s2',
          kind: 'build',
          prompt: '안전 여권의 각 영역에 올바른 안전 행동 도장을 놓아보세요.',
          slots: [
            { id: 'stamp-check', label: '1. 확인할 때 (사실 대조 도장)' },
            { id: 'stamp-mask', label: '2. 보내기 전 (단서 가리기 도장)' },
            { id: 'stamp-report', label: '3. 위험할 때 (멈춤과 도움 알림 도장)' },
          ],
          pieces: [
            { id: 'p-check', label: '유창한 대답도 공식 자료와 팩트 체크하기', slotId: 'stamp-check' },
            { id: 'p-mask', label: '이름표, 얼굴, 위치 단서는 블러 가리기', slotId: 'stamp-mask' },
            { id: 'p-report', label: '이상한 요구 수신 시 화면 가리고 어른에게 말하기', slotId: 'stamp-report' },
          ],
        },
        assetIds: ['m4-l11-story-03'],
        support: {},
      },
    ],
    artifact: {
      id: 'm4-l11-artifact',
      title: 'AI 안전 여권',
      portfolioLabel: '모듈 4 실천 중심 AI 안전 여권',
      fields: [
        { id: 'safeRule1', label: '1. 정보 확인할 때 나의 실천 행동', input: 'text', required: true },
        { id: 'safeRule2', label: '2. 사진/정보 보내기 전 나의 실천 행동', input: 'text', required: true },
        { id: 'safeRule3', label: '3. 위험 신호를 보았을 때 도움 알림 문장', input: 'text', required: true },
      ],
    },
    transfer: {
      title: '안전 여권 서명 및 발급',
      scenario: '완성된 안전 여권에 서명하고 동아리 회원들에게 안전 약속을 발표해봐요.',
      activity: {
        id: 'act-transfer-m4-l11',
        kind: 'single-choice',
        prompt: 'AI 안전 여권 발급 준비가 되었나요?',
        choices: [
          { id: 'sign-passport', label: '네, 나의 AI 안전 여권에 서명하고 자랑스럽게 지켜요!', emoji: '🎓' },
        ],
      },
    },
    assets: [
      { id: 'm4-l11-story-01', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l11-story-01.webp', alt: '안전 점검 질문', required: true, purpose: '스토리 컷 1' },
      { id: 'm4-l11-story-02', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l11-story-02.webp', alt: '여권 도장 조립', required: true, purpose: '스토리 컷 2' },
      { id: 'm4-l11-story-03', kind: 'story', renderAs: 'image', src: '/lessons/remodel/m4/m4-l11-story-03.webp', alt: '안전 여권 서명 발표', required: true, purpose: '스토리 컷 3' },
    ],
    wrapUp: '안전은 지식 암기가 아니며, 확인하고 가리고 멈추어 어른에게 도움을 청하는 실천 행동입니다.',
  },
];
