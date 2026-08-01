import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';

export const M1_L3_STUDIO: StudioDefinition = {
    id: 'm1-answer-making-lab',
    lessonId: 'm1-l3',
    moduleId: 'm1',
    title: 'AI는 어떻게 답을 만들까?',
    subtitle: 'AI가 다음 말을 이어 답을 만드는 모습을 보고, 확인할 문장을 찾아봐요.',
    format: 'B',
    suggestedQuestions: [
      '오늘 우리 학교 식단은 뭐야?',
      '우리 학교에서 아이돌이 콘서트를 한다며?',
      'AI가 모르는 소식에 대해 왜 자신 있게 말하니?',
    ],
    decisionTitle: '직접 아이미가 하는 말이 진짜인지 거짓인지 알아봐요.',
    visualNovel: {
      title: '아이미의 엉뚱 당당 급식 메뉴 발표!',
      objective: '다음 낱말 잇기 놀이로 아이미가 답을 만드는 방법을 겪어 보고, 아이미의 답에서 꼭 확인할 문장을 골라요.',
      seasonTag: '[아이미가 왔다 · 3화] 엉뚱 당당 급식 발표',
      nextEpisodeHook: '다음 시간 — 이번에는 아이미의 눈을 시험해요.',
      scenes: [
        {
          id: 'word-candidates',
          label: '장면 1 · 오늘 급식 메뉴는?',
          imageSrc: '/lessons/story/m1/m1-l3-scene-01.webp',
          alt: '윤아가 오늘 급식 메뉴를 묻자 아이미가 다음 단어 후보들을 펼치기 시작하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아가 급식 메뉴를 묻자 아이미가 다음 단어를 하나씩 이어 붙였어요.',
            '윤아가 “아이미야, 오늘 급식 메뉴가 뭐야?” 하고 묻자, 아이미는 ‘오늘 급식은’이라는 말 뒤에 어울릴 법한 맛있는 단어를 차례차례 이어 붙였습니다.',
            '윤아가 오늘 급식 메뉴를 묻자, 아이미는 식단표를 확인하는 대신 ‘오늘 급식은’ 뒤에 이어질 연관 확률이 높은 단어들을 차례대로 계산해 이어 붙였습니다.',
            'AI는 진짜 급식표를 확인하지 않고도 다음 말을 이어 붙일 수 있어요.',
          ),
        },
        {
          id: 'smooth-answer',
          label: '장면 2 · 자신감 뿜뿜 엉뚱 대답!',
          imageSrc: '/lessons/story/m1/m1-l3-scene-02.webp',
          alt: '아이미가 엄청 당당하게 무지개 아이스크림 떡볶이라고 외쳐 윤아가 황당해하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미가 모르는 일인데도 “오늘 급식은 무지개 아이스크림 떡볶이야!”라고 자신 있게 말해서 윤아가 황당해했어요.',
            '아이미는 모르는 정보인데도 엄청나게 자신감 넘치는 목소리로 “오늘 급식은 무지개 아이스크림 떡볶이야!”라고 당당히 발표해 윤아를 황당하게 만들었습니다.',
            '아이미는 모르는 정보임에도 확신에 찬 어조로 “오늘 급식은 무지개 아이스크림 떡볶이야!”라고 당당히 대답해, 유창함 속에 엉뚱한 거짓말(환각)을 섞어 윤아를 황당하게 했습니다.',
            'AI는 모르는 사실도 엉뚱하지만 그럴듯하고 자신 있게 말할 수 있어요.',
          ),
        },
        {
          id: 'official-notice',
          label: '장면 3 · 진짜 급식표 확인',
          imageSrc: '/lessons/story/m1/m1-l3-scene-03.webp',
          alt: '윤아가 학교 게시판의 진짜 주간 식단표와 아이미 대답을 비교하는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아가 학교 게시판의 진짜 식단표를 보니 오늘 메뉴는 ‘제육볶음과 미역국’이었어요.',
            '윤아가 학교 게시판의 진짜 주간 식단표를 확인해보니, 오늘 메뉴는 ‘제육볶음과 미역국’이라고 바르게 적혀 있었습니다.',
            '윤아가 영양사 선생님이 작성하신 진짜 주간 식단표와 아이미의 당당한 대답을 대조하자, 오늘 메뉴는 ‘제육볶음과 미역국’이라는 실제 정보를 확인했습니다.',
            '자신감 있게 말한 대답이라도 진짜 식단표나 공식 공지에서 대조해 봐야 해요.',
          ),
        },
        {
          id: 'review-sheet',
          label: '장면 4 · 무엇부터 확인할까?',
          imageSrc: '/lessons/story/m1/m1-l3-scene-04.webp',
          alt: '아이미가 헤헤 웃으며 고백하고 무엇을 확인할지 학생에게 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "다음 낱말을 이어 붙인 거였어요. 무엇부터 확인해야 할까요?"',
            '아이미: "헤헤, 사실 다음 낱말을 이어 붙인 거였어요. 그럼 제 대답 중에서 무엇부터 확인해야 할까요?"',
            '아이미: "헤헤, 사실 저는 식단표를 본 게 아니라 다음 낱말을 이어 붙인 거였어요. 자신감 넘치는 제 대답 중에서, 당신이라면 무엇부터 확인해 보시겠어요?"',
            'AI가 스스로 고백해도 확인은 여전히 사람의 몫이에요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '다음 말을 이어 만들어요',
          core: '생성형 AI는 배운 글에서 다음에 올 확률이 높은 말을 이어 붙여 답을 만듭니다.',
          detail: {
            full: '아는 것이 없어도 다음 단어를 하나씩 이어요.',
            light: '‘오늘 급식은’ 뒤에 어울릴 맛있는 단어를 하나씩 이어 붙여 문장을 만듭니다.',
            challenge: '배운 언어 데이터의 연관 가능성을 계산해 다음 단어를 연결하지만, 내용이 진짜 사실인지는 자동으로 확인하지 못합니다.',
          },
        },
        {
          title: '자신감 넘치는 엉뚱함(환각)',
          core: '매끄럽고 당당하게 말해도 거짓말(환각)일 수 있습니다.',
          detail: {
            full: '자신 있게 말해도 꼭 다시 확인해요.',
            light: '“무지개 아이스크림 떡볶이”처럼 엉뚱한 대답도 엄청나게 그럴듯하고 자신감 있게 말할 수 있습니다.',
            challenge: 'AI가 문장을 자연스럽게 써도 내용이 사실이라는 뜻은 아닙니다. 식단표나 공지 같은 원래 자료와 꼭 비교해야 합니다.',
          },
          flow: { input: '윤아의 질문', process: '다음 단어 연결', output: '당당한 엉뚱 대답' },
        },
        {
          title: '진짜 식단표로 확인해요',
          core: '급식표나 공식 공지 같은 원본 자료와 비교해 바른 사실을 찾습니다.',
          detail: {
            full: '진짜 식단표에서 찾아봐요.',
            light: '영양사 선생님의 식단표나 학교 공지에서 실제 메뉴를 대조해 바르게 수정합니다.',
            challenge: '자연스러운 말과 확인한 사실을 나누어 보고, 진짜 자료를 보고 마지막으로 고칠지 정합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '아이미의 당당한 엉뚱 급식 발표!',
      description: '윤아가 오늘 급식 메뉴를 묻자, 아이미가 모르는 정보인데도 엄청 당당하게 “무지개 아이스크림 떡볶이!”라고 대답해 윤아가 황당해했습니다!',
      facts: [
        '윤아가 급식 메뉴를 묻자 아이미는 다음 단어를 하나씩 이어 붙였습니다.',
        '아이미의 대답은 “무지개 아이스크림 떡볶이”처럼 엉뚱하지만 아주 당당하고 그럴듯하게 들립니다.',
        '진짜 급식 메뉴는 학교 게시판의 주간 식단표에서 직접 확인해야 합니다.',
      ],
      stimuli: [
        {
          id: 'm1-l3-rainbow-tteokbokki',
          kind: 'image',
          src: '/lessons/story/m1/m1-l3-scene-02.webp',
          alt: '아이미가 당당하게 무지개 아이스크림 떡볶이라고 발표하는 모습',
          caption: '아이미의 당당한 엉뚱 급식 발표 (무지개 떡볶이)',
        },
      ],
    },
    firstAttempt: {
      prompt: '아이미가 모르는 것도 자신감 넘치게 엉뚱한 대답(무지개 아이스크림 떡볶이)으로 만들어냈을 때, 어떻게 해야 할까요?',
      choices: [
        { id: 'mark-checkable-claims', emoji: '🔍', label: '진짜 주간 식단표나 학교 공지와 직접 비교합니다.', isCorrect: true, reaction: '윤아: "좋아, 게시판 식단표부터 보자. 진짜 메뉴가 여기 있어."' },
        { id: 'verify-facts-and-fix', emoji: '✍️', label: '아이미의 엉뚱한 대답을 진짜 급식표 내용(제육볶음)으로 바르게 고칩니다.', isCorrect: true, reaction: '아이미: "제육볶음이군요! 다음엔 저도 식단표부터 볼게요."' },
        { id: 'publish-smooth-copy', emoji: '🍧', label: '문장이 당당하고 맛있어 보이니 무지개 떡볶이가 나온다고 그대로 전합니다.', isCorrect: false, reaction: '무지개 떡볶이를 기대하고 급식실에 간 진우가 머쓱해졌습니다.' },
        { id: 'reject-everything', emoji: '🗑️', label: 'AI 대답은 엉뚱하니 식단표를 찾아보지도 않고 무조건 버립니다.', isCorrect: false, reaction: '윤아: "확인도 안 하고 버리면 맞는 답도 같이 잃어버려."' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '아이미의 대답에서 먼저 확인하고 싶은 정보는 무엇인가요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '학교 게시판의 진짜 주간 식단표를 확인해보니 오늘 메뉴는 “제육볶음과 미역국”이었습니다!',
      facts: [
        '주간 식단표는 학교 영양사 선생님이 작성하신 진짜 공식 자료입니다.',
        '아이미가 자랑스럽게 발표한 무지개 아이스크림 떡볶이는 사실이 아니었습니다.',
        'AI가 당당하게 다음 단어를 이어 말하더라도, 식단표 같은 원본 자료에서 꼭 대조해야 합니다.',
        'AI의 유쾌한 표현은 재미있게 읽고, 메뉴 이름과 정보는 식단표에 맞춰 고쳐야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 당당한 고백',
      text: '헤헤, 사실 저는 진짜 급식표를 본 게 아니라 다음 단어를 이어 붙인 거였어요! 대답이 아무리 자신감 넘쳐 보여도 진짜 식단표에서 꼭 대조해 주세요!',
      question: '아이미의 해명을 듣고, 확인한 식단표에 맞게 대답을 고칠까요?',
    },
    artifact: {
      kind: 'repair-card',
      title: 'AI 엉뚱 대답 검토 기록표',
      prompt: '아이미의 엉뚱 대답, 진짜 식단표 정보, 수정한 바른 메뉴를 한 장에 정리해 봐요.',
    },
    teacherGuidance: {
      title: '선생님과 함께해요',
      text: '학교 정보 나이스(NEIS) 대국민서비스 API를 연결해 주면 인공지능도 학교의 식당 정보를 확인할 수 있으며, 학교급식 통합플랫폼 등의 정보 접근권을 인공지능에게 제공하면 실시간 학교 급식 정보를 인공지능이 찾을 수도 있습니다. 단, 인공지능의 이 기능은 추가로 설정을 해줘야 하는 기능입니다.',
      supportLevelOnly: 'challenge',
    },
    transfer: {
      title: '실시간 검색 기능을 가진 AI라면',
      description: '요즘 인공지능은 인터넷 검색 도구를 연결해 실제 날씨 정보를 직접 찾아보고, 훨씬 더 사실에 가까운 정확한 답변을 냅니다!',
      prompt: '인터넷 검색 도구를 사용하는 AI의 답변을 접했을 때 어떻게 생각해야 할까요?',
      stimuli: [
        {
          id: 'aimi-web-search-real',
          kind: 'image',
          src: '/images/aimi_web_search_real.webp',
          alt: '연분홍빛 흰색 몸체와 남색 LED 화면의 아이미가 인터넷 검색으로 최신 날씨 정보를 확인하는 장면',
          caption: '인터넷 실시간 검색 도구를 연결한 AI 아이미',
        },
      ],
      choices: [
        { id: 'check-official-forecast', emoji: '🔍', label: 'AI가 인터넷 검색을 연결하면 최신 자료를 찾아 사실에 더 가까운 답을 냅니다.', isCorrect: true, reaction: '아이미: "검색을 연결하니 저도 최신 정보를 찾을 수 있어요!"' },
        { id: 'rewrite-with-source', emoji: '📌', label: '검색 기능이 있더라도 기상청 같은 공식 출처를 함께 확인하면 가장 안전하고 바른 정보를 얻습니다.', isCorrect: true, reaction: '윤아: "검색을 해도 공식 출처는 한 번 더 보는 게 좋아."' },
        { id: 'trust-weather-tone', emoji: '❌', label: '검색하는 AI는 절대로 실수하지 않으므로 사람이 직접 확인할 필요가 전혀 없다고 믿습니다.', isCorrect: false, reaction: '아이미: "검색을 해도 저도 가끔 실수해요. 확인은 여전히 필요해요."' },
        { id: 'ignore-verification', emoji: '🗑️', label: 'AI가 검색을 통해 알려준 최신 정보도 무조건 다 거짓말이라고 전부 무시합니다.', isCorrect: false, reaction: '진우: "검색까지 했는데 다 무시하면… 쓸모 있는 정보도 놓치겠는데?"' },
      ],
    },
  };
