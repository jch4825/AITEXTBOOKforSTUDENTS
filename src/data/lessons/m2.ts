import type { LessonContent } from '../../types';

/**
 * 단원 2 — AI랑 말해보기 (프롬프트 잘 쓰는 법)
 *
 * 11차시. 학생이 "AI한테 어떻게 물어봐야 원하는 답이 나오는지"를
 * 실전 감각으로 익히는 것이 목표. real-ai 스텝 4회 (l3/l5/l8/l10).
 */
export const M2_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm2-l1',
    moduleId: 'm2',
    number: 1,
    kind: 'concept',
    title: '잘 물어봐야 잘 답해줘',
    objective: '프롬프트가 AI에게 하는 질문이나 부탁임을 말할 수 있다.',
    standards: [
      '[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
      '[9정통01-04] 필요한 정보를 수집하고, 타인과 정보를 주고받는다.',
    ],
    wrapUpEasy: 'AI한테 하는 질문을 프롬프트라고 해요. 잘 물으면 좋은 답이 와요.',
    wrapUpNormal: 'AI한테 던지는 질문이나 부탁을 프롬프트라고 해요. 어떻게 묻느냐에 따라 답이 달라져요.',
    bodyEasy: 'AI한테 잘 물어보면 좋은 답이 와요. 이걸 프롬프트라고 해요.',
    bodyNormal:
      'AI한테 어떻게 물어보는지에 따라 답이 달라져요. AI한테 던지는 질문이나 부탁을 프롬프트라고 해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['프롬프트'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '어느 게 더 잘 물어본 걸까요?',
          choices: [
            { label: '"강아지 이름 세 개 추천해줘"', isCorrect: true },
            { label: '"음..."', isCorrect: false },
            { label: '"어"', isCorrect: false },
            { label: '"뭐"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"뭘 해줘"만 말하면 AI가 뭘 해야 할지 알까요?',
              answer: 'X',
              feedback: '무엇을 원하는지 구체적으로 말해줘야 해요.',
            },
            {
              question: '프롬프트는 AI한테 하는 질문이나 부탁이에요?',
              answer: 'O',
              feedback: '맞아요! 잘 만든 프롬프트가 좋은 답을 데려와요.',
            },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '"강아지 이름 추천해줘"', right: '이름들을 알려줘요' },
            { left: '"..."', right: 'AI가 뭘 원하는지 몰라요' },
            { left: '"영어로 안녕이 뭐야?"', right: '"Hello" 라고 답해줘요' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm2-l2',
    moduleId: 'm2',
    number: 2,
    kind: 'concept',
    title: '짧게 물어보기',
    objective: '한 문장으로 짧게 묻는 프롬프트를 고를 수 있다.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    wrapUpEasy: '한 문장으로 짧게 물어봐요.',
    wrapUpNormal: '프롬프트는 짧고 분명할수록 좋아요. 한 번에 하나씩 물어봐요.',
    bodyEasy: '너무 길게 말하지 않아도 돼요. 한 문장으로 짧게 물어봐요.',
    bodyNormal:
      '프롬프트는 짧고 명확할수록 좋아요. 한 문장으로 원하는 걸 콕 집어 말하면 AI가 더 잘 답해줘요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['프롬프트'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '짧게 콕 집어 물어보면 답이 더 정확해요?',
              answer: 'O',
              feedback: '맞아요! 짧고 분명하게 물어봐요.',
            },
            {
              question: '한 문장에 여러 질문을 다 넣어도 괜찮을까요?',
              answer: 'X',
              feedback: '한 번에 하나씩 물어보는 게 답이 잘 나와요.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '"기린 소개해줘" 라고 짧게 물어봐요.',
          userInput: '기린 소개해줘',
          aiResponse: '기린은 목이 아주 긴 동물이에요! 나뭇잎을 먹고, 아프리카에 살아요.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '어느 쪽이 더 짧고 분명한 프롬프트일까요?',
          choices: [
            { label: '"코끼리 사진 그려줘"', isCorrect: true },
            { label: '"음 그러니까 뭐랄까 그림을 좀 그리는데 코끼리를…"', isCorrect: false },
            { label: '"안녕"', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm2-l3',
    moduleId: 'm2',
    number: 3,
    kind: 'concept',
    title: '궁금한 걸 콕 집어서',
    objective: '원하는 것을 콕 집어 묻는 프롬프트를 만들 수 있다.',
    standards: [
      '[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
      '[9정통02-02] 인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.',
    ],
    wrapUpEasy: '궁금한 걸 콕 집어서 물어봐요.',
    wrapUpNormal: '"아무거나" 대신 원하는 걸 콕 집어 물으면 AI가 정확하게 답해줘요.',
    bodyEasy: '"이거 알려줘" 처럼 콕 집어서 물으면 AI가 알아듣기 쉬워요.',
    bodyNormal:
      '"뭐든지 좋아" 대신 "떡볶이 만드는 법 알려줘" 처럼 궁금한 걸 콕 집으면 AI가 정확히 답해줘요.',
    steps: [
      { kind: 'text', data: {} },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '"아무거나"', right: 'AI가 뭘 골라야 할지 몰라요' },
            { left: '"떡볶이 만드는 법"', right: '순서를 알려줘요' },
            { left: '"영어 자기소개"', right: '문장을 만들어줘요' },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '어느 쪽이 더 콕 집은 질문일까요?',
          choices: [
            { label: '"바다 동물 하나 알려줘"', isCorrect: true },
            { label: '"뭐 하나 알려줘"', isCorrect: false },
            { label: '"몰라"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 콕 집어 물어봐요. 아래 글을 그대로 보내도 되고, 🎤 로 내 목소리로 바꿔서 보내도 돼요.',
          userInput: '친구한테 소개할 만한 재미있는 놀이 하나 알려줘',
          fallbackResponse:
            '"제기차기" 어때요? 콩주머니나 둥근 물건을 발로 차서 몇 번 오래 차는지 세는 놀이예요!',
          allowFreeInput: true,
        },
      },
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm2-l4',
    moduleId: 'm2',
    number: 4,
    kind: 'concept',
    title: '예시를 하나 보여줘요',
    objective: '예시를 넣은 프롬프트가 더 좋은 답을 가져온다는 것을 말할 수 있다.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    wrapUpEasy: '예시를 보여주면 AI가 더 잘 만들어요.',
    wrapUpNormal: '원하는 모양을 예시로 하나 보여주면 AI가 그 모양대로 만들어줘요.',
    bodyEasy: '"이런 식으로 해줘" 하고 예시를 보여주면 AI가 더 잘 만들어요.',
    bodyNormal:
      '원하는 답 모양을 하나 예시로 먼저 보여주면 AI가 그 모양대로 만들어줘요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['예시'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '예시가 들어간 프롬프트는 어느 것일까요?',
          choices: [
            { label: '"이런 식으로 세 개 만들어줘: 사과는 빨개요"', isCorrect: true },
            { label: '"뭐 좀 만들어줘"', isCorrect: false },
            { label: '"음..."', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '"동물 이름으로 짧은 문장을 만들어줘. 예: 강아지가 뛰어요"',
          userInput: '동물 이름으로 짧은 문장을 만들어줘. 예: 강아지가 뛰어요',
          aiResponse: '고양이가 자요. 토끼가 뛰어요. 사자가 웃어요.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '예시를 보여주면 AI가 모양을 따라 만들 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 예시 하나가 큰 힌트가 돼요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm2-l5',
    moduleId: 'm2',
    number: 5,
    kind: 'concept',
    title: '역할을 정해줘요',
    objective: 'AI에게 역할을 정해주는 프롬프트를 사용할 수 있다.',
    standards: ['[9국어01-04] 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.'],
    wrapUpEasy: '"친구처럼 말해줘" 하면 말투가 바뀌어요.',
    wrapUpNormal: 'AI한테 역할을 정해주면 그 역할의 말투로 답해줘요.',
    bodyEasy: '"친구처럼 말해줘" 하면 AI가 친구처럼 답해줘요.',
    bodyNormal:
      'AI한테 "이렇게 말해줘" 하고 역할을 정해주면 그 성격으로 답해줘요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['역할'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '"친구처럼 말해줘"', right: '반말로 친근하게 답해요' },
            { left: '"선생님처럼 말해줘"', right: '차분히 설명해줘요' },
            { left: '"동화 작가처럼 말해줘"', right: '이야기 느낌으로 답해요' },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '"동화 작가처럼 말해줘. 강아지가 산책 가는 이야기를 한 줄로."',
          userInput: '동화 작가처럼 말해줘. 강아지가 산책 가는 이야기를 한 줄로.',
          fallbackResponse:
            '해가 반짝 웃던 어느 날, 뽀삐는 꼬리를 살랑살랑 흔들며 마을 골목길을 산책했답니다.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"친구처럼 말해줘"라고 하면 AI가 다르게 답할까요?',
              answer: 'O',
              feedback: '맞아요! 역할에 따라 말투가 달라져요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm2-l6',
    moduleId: 'm2',
    number: 6,
    kind: 'concept',
    title: '단계를 나눠 물어보기',
    objective: '큰 질문을 작은 단계로 나누어 물을 수 있다.',
    standards: [
      '[9정통02-03] 순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.',
      '[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
    ],
    wrapUpEasy: '큰 질문은 작게 나눠서 하나씩 물어봐요.',
    wrapUpNormal: '큰 질문을 작은 단계로 나눠 하나씩 물으면 답이 훨씬 분명해져요.',
    bodyEasy: '큰 질문은 작게 나눠 물어봐요. 한 걸음씩 물으면 답이 잘 나와요.',
    bodyNormal:
      '한 번에 다 물어보면 답이 흐릿할 수 있어요. 큰 질문을 작은 단계로 나눠 하나씩 물어봐요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['단계'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '큰 질문: "여행 계획 다 짜줘"', right: '너무 넓어요' },
            { left: '작게: "제주도 놀 만한 곳 3개"', right: 'AI가 딱 답해요' },
            { left: '작게: "그 중 하나 자세히 알려줘"', right: '이어서 답해요' },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '한 걸음씩 물어보는 예는 어느 것일까요?',
          choices: [
            { label: '"먼저 재료 알려줘 → 그 다음 순서 알려줘"', isCorrect: true },
            { label: '"모든 걸 다 한 번에 알려줘"', isCorrect: false },
            { label: '"음.."', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '큰 질문을 작게 나누면 답이 더 분명할까요?',
              answer: 'O',
              feedback: '맞아요! 한 걸음씩이 더 정확해요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm2-l7',
    moduleId: 'm2',
    number: 7,
    kind: 'concept',
    title: '다시 물어봐도 돼요',
    objective: '답이 마음에 들지 않을 때 다시 부탁하는 말을 할 수 있다.',
    standards: ['[9국어01-04] 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.'],
    wrapUpEasy: '답이 마음에 안 들면 다시 부탁해도 돼요.',
    wrapUpNormal: '"다르게 해줘", "더 쉽게 해줘"처럼 다시 부탁하면 AI가 고쳐서 답해줘요.',
    bodyEasy: '답이 마음에 안 들면 다시 물어봐도 돼요.',
    bodyNormal:
      'AI 답이 원하는 게 아니면 "다르게 해줘", "좀 더 짧게 해줘" 하고 다시 부탁해도 괜찮아요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['부탁'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '"이 답을 좀 더 짧게 해줘" 라고 부탁해봐요.',
          userInput: '좀 더 짧게 해줘',
          aiResponse: '알겠어요! 한 줄로 줄여볼게요.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '한 번 물으면 다시 물어보면 안 될까요?',
              answer: 'X',
              feedback: '여러 번 물어봐도 돼요! 다시 부탁해도 괜찮아요.',
            },
            {
              question: '"조금 다른 답을 줘" 라고 부탁할 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 마음에 안 들면 다시 부탁해봐요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '답이 어려우면 뭐라고 부탁하면 좋을까요?',
          choices: [
            { label: '"더 쉽게 설명해줘"', isCorrect: true },
            { label: '가만히 있어요', isCorrect: false },
            { label: '"화나!"', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm2-l8',
    moduleId: 'm2',
    number: 8,
    kind: 'concept',
    title: '답을 짧게 해달라고 부탁',
    objective: '답의 길이를 정해서 부탁하는 프롬프트를 사용할 수 있다.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    wrapUpEasy: '"세 줄로 알려줘" 하면 짧게 답해줘요.',
    wrapUpNormal: '"한 문장으로", "세 줄로"처럼 답의 길이를 정해서 부탁할 수 있어요.',
    bodyEasy: '"세 줄로 알려줘" 하면 짧게 답해줘요.',
    bodyNormal:
      '답이 길면 "짧게 세 줄로", "한 문장으로" 처럼 길이를 정해서 부탁해봐요.',
    steps: [
      { kind: 'text', data: {} },
      {
        kind: 'card-pick',
        data: {
          question: '짧게 부탁하는 말은 어느 것일까요?',
          choices: [
            { label: '"세 줄로 알려줘"', isCorrect: true },
            { label: '"아주 길게 다 알려줘"', isCorrect: false },
            { label: '"음"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 "고양이 특징을 세 줄로 알려줘" 라고 부탁해봐요.',
          userInput: '고양이 특징을 세 줄로 알려줘',
          fallbackResponse:
            '고양이는 소리 없이 잘 걸어요. 어둠 속에서도 눈이 잘 보여요. 혼자 있는 걸 좋아해요.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"짧게" 라고 부탁하면 AI가 답을 줄여줄까요?',
              answer: 'O',
              feedback: '맞아요! 길이도 부탁할 수 있어요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm2-l9',
    moduleId: 'm2',
    number: 9,
    kind: 'concept',
    title: '답이 이상하면?',
    objective: 'AI의 답이 이상할 때 확인하는 방법을 말할 수 있다.',
    standards: ['[9정통01-01] 정보통신의 의미를 이해하고, 다양한 형태와 방법으로 제공되는 정보를 살펴본다.'],
    wrapUpEasy: '답이 이상하면 다시 물어보고, 선생님께 확인해요.',
    wrapUpNormal: 'AI도 틀릴 수 있어요. 이상하면 "정말이야?" 하고 다시 묻거나 선생님께 확인해요.',
    bodyEasy: '답이 이상하면 선생님께 물어보고, 다시 부탁해요.',
    bodyNormal:
      'AI가 가끔 틀린 답을 줄 수 있어요. 답이 이상하면 "정말이야?" 하고 다시 물어보거나 선생님께 확인해봐요.',
    steps: [
      { kind: 'text', data: {} },
      {
        kind: 'card-pick',
        data: {
          question: 'AI 답이 이상할 때 뭘 하면 좋을까요?',
          choices: [
            { label: '"정말이야?" 하고 다시 물어봐요', isCorrect: true },
            { label: '그냥 다 믿어요', isCorrect: false },
            { label: '화면을 꺼요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 가끔 틀린 답을 줄 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 그래서 확인이 필요해요.',
            },
            {
              question: '답이 이상해도 무조건 다 믿어야 할까요?',
              answer: 'X',
              feedback: '이상하면 선생님께 물어봐요.',
            },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '답이 이상함', right: '"정말이야?" 다시 물어봐요' },
            { left: '답이 어려움', right: '"쉽게 알려줘" 부탁해요' },
            { left: '답이 너무 김', right: '"짧게 해줘" 부탁해요' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm2-l10',
    moduleId: 'm2',
    number: 10,
    kind: 'experience',
    title: '진짜 AI랑 놀아보기',
    objective: '배운 프롬프트 방법을 사용해 실제 AI와 대화할 수 있다.',
    standards: [
      '[9정통01-04] 필요한 정보를 수집하고, 타인과 정보를 주고받는다.',
      '[9국어01-04] 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.',
    ],
    wrapUpEasy: '진짜 AI랑 이야기해봤어요. 짧게, 콕 집어 물어봐요.',
    wrapUpNormal: '오늘은 배운 대로 진짜 AI랑 이야기했어요. 짧게, 콕 집어, 필요하면 다시 부탁해요.',
    bodyEasy: '오늘은 진짜 AI랑 여러 번 이야기해봐요.',
    bodyNormal:
      '오늘은 배운 대로 진짜 AI랑 여러 번 이야기해봐요. 짧게, 콕 집어, 필요하면 다시 부탁해봐요.',
    steps: [
      { kind: 'text', data: {} },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 내가 좋아하는 색에 어울리는 이름을 지어달라고 해봐요. 좋아하는 색으로 글을 고쳐 보내거나, 🎤 를 눌러 말해봐요.',
          userInput: '내가 좋아하는 색이 파랑이야. 파랑 강아지 이름 하나 지어줘.',
          fallbackResponse:
            '"바다" 어때요? 파란 바다처럼 시원하고 예쁜 이름이에요!',
          allowFreeInput: true,
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 짧은 수수께끼를 하나 내달라고 해봐요.',
          userInput: '아주 짧은 수수께끼 하나 내줘',
          fallbackResponse:
            '"눈이 오면 나타났다가 봄이면 사라지는 건? 정답은 눈사람!"',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '진짜 AI랑 이야기할 때 가장 좋은 태도는요?',
          choices: [
            { label: '짧고 콕 집어 물어봐요', isCorrect: true },
            { label: '아무 말이나 마구 쳐요', isCorrect: false },
            { label: '화를 내요', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm2-l11',
    moduleId: 'm2',
    number: 11,
    kind: 'activity',
    title: '다 배웠어요! (마무리 퀴즈)',
    objective: '단원 2에서 배운 프롬프트 방법 네 가지를 퀴즈로 확인할 수 있다.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    wrapUpEasy: '단원 2를 다 배웠어요! 물어보는 방법을 알게 됐어요.',
    wrapUpNormal: '단원 2를 마쳤어요! 짧게, 콕 집어, 예시 주기, 역할 정하기 — 네 가지 방법을 배웠어요.',
    bodyEasy: '지금까지 배운 프롬프트 잘 쓰는 법을 확인해봐요.',
    bodyNormal:
      '단원 2에서 배운 것들 — 짧게, 콕 집어, 예시 주기, 역할 정하기 — 을 짧은 퀴즈로 확인해봐요.',
    steps: [
      { kind: 'text', data: {} },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '프롬프트는 AI한테 던지는 질문이나 부탁이에요?',
              answer: 'O',
              feedback: '맞아요! 잘 만든 프롬프트가 좋은 답을 데려와요.',
            },
            {
              question: '짧고 콕 집어 물어보는 게 좋을까요?',
              answer: 'O',
              feedback: '맞아요! 명확한 게 최고예요.',
            },
            {
              question: 'AI 답이 이상하면 무조건 다 믿어야 할까요?',
              answer: 'X',
              feedback: '이상하면 다시 물어보거나 선생님께 확인해요.',
            },
            {
              question: '"동화 작가처럼 말해줘" 같은 역할 정하기가 가능해요?',
              answer: 'O',
              feedback: '맞아요! 역할에 따라 말투가 달라져요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '가장 잘 만든 프롬프트는 어느 것일까요?',
          choices: [
            { label: '"강아지 이름 세 개를 짧게 알려줘"', isCorrect: true },
            { label: '"음 뭐 좀"', isCorrect: false },
            { label: '"뭐든지 아무거나 다 알려줘 지금 바로 다"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '짧게 물어보기', right: '한 문장으로 콕 집어' },
            { left: '예시 보여주기', right: '"이런 식으로 해줘"' },
            { left: '역할 정하기', right: '"친구처럼 말해줘"' },
            { left: '다시 부탁하기', right: '"좀 더 짧게 해줘"' },
          ],
        },
      },
    ],
  },
];
