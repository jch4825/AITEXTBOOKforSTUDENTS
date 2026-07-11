import type { LessonContent } from '../../types';

/**
 * 단원 5 — AI로 문제해결하기
 *
 * 12차시. 문제를 알아차리고, 작게 나누고, 순서를 세우고, AI의 도움을 받아
 * 한 단계씩 해결하는 사고력 훈련. Sequence 위젯을 적극 사용.
 * real-ai 1회 (l6).
 */
export const M5_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm5-l1',
    moduleId: 'm5',
    number: 1,
    kind: 'concept',
    title: '문제가 뭐예요?',
    objective: '생활 속에서 해결해야 할 문제를 알아차릴 수 있다.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '문제는 "해결하고 싶은 일"이에요. 배고픈 것도 문제예요!',
    bodyNormal:
      '문제란 해결하고 싶은 일이에요. "배가 고파요", "길을 몰라요" — 이런 게 다 문제예요. 문제를 알아차리는 게 첫걸음이에요.',
    wrapUpEasy: '문제는 해결하고 싶은 일이에요. 먼저 알아차려요.',
    wrapUpNormal: '문제는 해결하고 싶은 일이에요. "지금 뭐가 어렵지?" 하고 알아차리는 것이 해결의 첫걸음이에요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['문제'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"배가 고픈데 뭘 먹을지 모르겠어요"도 문제일까요?',
              answer: 'O',
              feedback: '맞아요! 해결하고 싶은 일은 다 문제예요.',
            },
            {
              question: '문제는 나쁜 것이니까 모른 척해야 할까요?',
              answer: 'X',
              feedback: '문제는 나쁜 게 아니에요. 알아차리면 해결할 수 있어요!',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '다음 중 "문제"는 어느 것일까요?',
          choices: [
            { label: '숙제를 어떻게 시작할지 모르겠어요', isCorrect: true },
            { label: '밥을 맛있게 먹었어요', isCorrect: false },
            { label: '친구랑 재미있게 놀았어요', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm5-l2',
    moduleId: 'm5',
    number: 2,
    kind: 'concept',
    title: '문제를 작게 나눠요',
    objective: '큰 문제를 작은 문제로 나눌 수 있다.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '큰 문제는 작게 나누면 쉬워져요.',
    bodyNormal:
      '"방 청소"는 커 보여도, "책 정리 → 옷 정리 → 바닥 쓸기"로 나누면 하나씩 할 수 있어요.',
    wrapUpEasy: '큰 문제는 작게 나눠요. 그러면 쉬워져요.',
    wrapUpNormal: '큰 문제는 작은 조각으로 나눠요. 작은 것부터 하나씩 하면 큰 문제도 해결할 수 있어요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '"방 청소"를 작게 나누면 어떻게 될까요?',
          choices: [
            { label: '책 정리, 옷 정리, 바닥 쓸기', isCorrect: true },
            { label: '한 번에 다 하기', isCorrect: false },
            { label: '안 하고 자기', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '방 청소를 작게 나눴어요. 순서대로 눌러봐요.',
          items: [
            { label: '책을 책꽂이에 꽂아요' },
            { label: '옷을 옷장에 넣어요' },
            { label: '바닥을 쓸어요' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm5-l3',
    moduleId: 'm5',
    number: 3,
    kind: 'activity',
    title: '순서대로 생각해요',
    objective: '일의 순서를 차례대로 늘어놓을 수 있다.',
    standards: ['[9정통02-03] 순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.'],
    bodyEasy: '일에는 순서가 있어요. 순서대로 하면 잘 돼요.',
    bodyNormal:
      '많은 일에는 순서가 있어요. 세수를 하고 수건으로 닦지, 수건으로 닦고 세수하지 않지요? 순서대로 생각하는 연습을 해봐요.',
    wrapUpEasy: '일은 순서대로 해요. 순서를 생각하면 잘 돼요.',
    wrapUpNormal: '일의 순서를 먼저 생각하면 실수가 줄어요. "먼저 뭐, 그 다음 뭐" 하고 차례를 세워봐요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['순서'], imagePlaceholder: true } },
      {
        kind: 'sequence',
        data: {
          instruction: '아침에 학교 갈 준비! 순서대로 눌러봐요.',
          items: [
            { label: '일어나서 세수해요' },
            { label: '아침밥을 먹어요' },
            { label: '가방을 챙겨요' },
            { label: '신발을 신고 나가요' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '신발을 신고 나서 양말을 신는 게 맞을까요?',
              answer: 'X',
              feedback: '양말 먼저, 신발은 나중! 순서가 중요해요.',
            },
            {
              question: '순서를 생각하고 하면 실수가 줄어들까요?',
              answer: 'O',
              feedback: '맞아요! 순서대로 하면 잘 돼요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm5-l4',
    moduleId: 'm5',
    number: 4,
    kind: 'activity',
    title: '무엇부터 할까요?',
    objective: '여러 일 중에서 먼저 할 일을 고를 수 있다.',
    standards: ['[9정통02-03] 순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.'],
    bodyEasy: '할 일이 많으면 중요한 것부터 해요.',
    bodyNormal:
      '할 일이 여러 개면 "급하고 중요한 것"부터 해요. 숙제가 내일까지라면 게임보다 숙제 먼저!',
    wrapUpEasy: '중요한 일부터 먼저 해요.',
    wrapUpNormal: '할 일이 많을 때는 급하고 중요한 일부터 해요. 순서를 정하면 마음도 편해져요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '숙제는 내일까지예요. 지금 무엇부터 할까요?',
          choices: [
            { label: '숙제를 먼저 해요', isCorrect: true },
            { label: '게임을 밤까지 해요', isCorrect: false },
            { label: '아무것도 안 해요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '오늘 할 일이에요. 좋은 순서대로 눌러봐요.',
          items: [
            { label: '내일까지인 숙제를 해요' },
            { label: '내 방을 정리해요' },
            { label: '남는 시간에 놀아요' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm5-l5',
    moduleId: 'm5',
    number: 5,
    kind: 'activity',
    title: 'AI에게 힌트를 달라고 해요',
    objective: '문제가 어려울 때 AI에게 힌트를 요청할 수 있다.',
    standards: ['[9정통02-02] 인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.'],
    bodyEasy: '어려우면 답 말고 "힌트"를 달라고 해요.',
    bodyNormal:
      '문제가 어려울 때 바로 답을 묻지 말고 "힌트만 줘"라고 해봐요. 힌트로 스스로 풀면 진짜 실력이 돼요.',
    wrapUpEasy: '어려우면 "힌트 줘" 하고 부탁해요.',
    wrapUpNormal: '답을 바로 묻는 것보다 힌트를 받아 스스로 풀면 실력이 늘어요. "힌트만 줘"라고 부탁해봐요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['힌트'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '수수께끼가 어려워요. AI한테 힌트를 달라고 해봐요.',
          userInput: '답은 말하지 말고 힌트만 줘',
          aiResponse: '좋아요, 힌트! 이 동물은 아주 천천히 걷고, 등에 딱딱한 집을 지고 다녀요.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '힌트를 듣고 스스로 맞혀봐요. 등에 집을 지고 다니는 동물은?',
          choices: [
            { label: '거북이', isCorrect: true },
            { label: '치타', isCorrect: false },
            { label: '독수리', isCorrect: false },
            { label: '토끼', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm5-l6',
    moduleId: 'm5',
    number: 6,
    kind: 'experience',
    title: '못 알아들으면 다시 물어봐요',
    objective: 'AI가 내 말을 못 알아들었을 때 바꿔서 다시 물을 수 있다.',
    standards: ['[9국어01-04] 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.'],
    bodyEasy: 'AI가 못 알아들으면 다르게 다시 물어봐요.',
    bodyNormal:
      'AI가 엉뚱한 답을 하면 내 질문이 어려웠을 수 있어요. 짧게, 다른 말로 바꿔서 다시 물어봐요.',
    wrapUpEasy: '못 알아들으면 다른 말로 다시 물어봐요.',
    wrapUpNormal: 'AI가 엉뚱한 답을 하면 포기하지 말고 짧고 쉬운 말로 바꿔 다시 물어봐요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '질문을 바꿔서 다시 물어보는 모습을 봐요.',
          userInput: '(처음) 그거 있잖아 그거 뭐지 → (다시) 목이 긴 동물 이름이 뭐야?',
          aiResponse: '아, 목이 긴 동물이요? 기린이에요! 질문을 바꿔주니 바로 알았어요.',
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 물어봐요. 답이 이상하면 말을 바꿔서 한 번 더 보내봐요!',
          userInput: '다리가 여덟 개인 바다 동물이 뭐야?',
          fallbackResponse: '다리가 여덟 개인 바다 동물은 문어예요! 문어는 다리로 맛도 볼 수 있대요.',
          allowFreeInput: true,
        },
      },
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm5-l7',
    moduleId: 'm5',
    number: 7,
    kind: 'activity',
    title: '한 단계씩 부탁해요',
    objective: 'AI에게 한 번에 하나씩 차례대로 부탁할 수 있다.',
    standards: ['[9정통02-03] 순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.'],
    bodyEasy: '한 번에 하나씩 부탁하면 잘 돼요.',
    bodyNormal:
      '복잡한 일은 AI한테도 한 단계씩 부탁해요. "먼저 재료 알려줘" → "이제 순서 알려줘" 이렇게요.',
    wrapUpEasy: 'AI한테도 한 번에 하나씩 부탁해요.',
    wrapUpNormal: '복잡한 부탁은 한 단계씩 나눠서 해요. 하나가 끝나면 다음 것을 부탁하면 돼요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['단계'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '샌드위치 만들기를 한 단계씩 부탁해봐요.',
          userInput: '샌드위치 재료부터 알려줘',
          aiResponse: '좋아요! 재료는 식빵 2장, 치즈, 햄, 상추예요. 다 준비되면 "이제 순서 알려줘" 하고 말해주세요.',
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: 'AI한테 한 단계씩 부탁하는 순서예요. 차례대로 눌러봐요.',
          items: [
            { label: '"재료부터 알려줘"' },
            { label: '"이제 만드는 순서 알려줘"' },
            { label: '"마지막으로 조심할 것 알려줘"' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm5-l8',
    moduleId: 'm5',
    number: 8,
    kind: 'concept',
    title: '답이 맞는지 확인해요',
    objective: '문제를 푼 뒤 답이 맞는지 스스로 확인할 수 있다.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '다 하고 나면 맞는지 한 번 더 봐요.',
    bodyNormal:
      '문제를 풀고 나면 "정말 맞나?" 하고 한 번 더 확인해요. AI의 답도, 내 답도 확인하면 더 좋아져요.',
    wrapUpEasy: '다 한 다음에는 맞는지 확인해요.',
    wrapUpNormal: '풀고 나서 확인하는 습관이 실수를 줄여요. 내 답도, AI의 답도 한 번 더 확인해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['확인'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '문제를 다 풀면 확인 없이 바로 내는 게 좋을까요?',
              answer: 'X',
              feedback: '한 번 더 확인하면 실수를 찾을 수 있어요.',
            },
            {
              question: 'AI가 알려준 답도 확인하면 더 좋을까요?',
              answer: 'O',
              feedback: '맞아요! AI도 틀릴 수 있으니까요.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 내 답을 확인해달라고 해봐요.',
          userInput: '3 더하기 4는 7이 맞아?',
          aiResponse: '네, 맞아요! 3 더하기 4는 7이에요. 확인하는 습관, 아주 훌륭해요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '확인을 잘하는 방법은 어느 것일까요?',
          choices: [
            { label: '처음부터 천천히 다시 봐요', isCorrect: true },
            { label: '눈을 감고 넘겨요', isCorrect: false },
            { label: '빨리 끝내고 놀아요', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm5-l9',
    moduleId: 'm5',
    number: 9,
    kind: 'concept',
    title: '다른 방법도 있어요',
    objective: '한 가지 방법이 안 될 때 다른 방법을 찾을 수 있다.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '한 방법이 안 되면 다른 방법을 찾아봐요.',
    bodyNormal:
      '문을 밀어서 안 열리면? 당겨보면 돼요! 한 가지 방법이 안 될 때 다른 방법을 생각하는 게 문제 해결의 힘이에요.',
    wrapUpEasy: '안 되면 다른 방법을 생각해봐요.',
    wrapUpNormal: '방법은 하나가 아니에요. 안 되면 "다른 방법은 없을까?" 하고 생각해보는 힘을 길러요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '문을 밀었는데 안 열려요. 어떻게 할까요?',
          choices: [
            { label: '당겨봐요', isCorrect: true },
            { label: '더 세게 밀어요', isCorrect: false },
            { label: '포기하고 돌아가요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '풀로 안 붙어요', right: '테이프로 붙여봐요' },
            { left: '지우개가 없어요', right: '친구에게 빌려봐요' },
            { left: 'AI가 못 알아들어요', right: '다른 말로 물어봐요' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm5-l10',
    moduleId: 'm5',
    number: 10,
    kind: 'concept',
    title: '실수해도 괜찮아요',
    objective: '실수했을 때 다시 시도하는 태도를 말할 수 있다.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '실수해도 괜찮아요. 다시 하면 돼요.',
    bodyNormal:
      '실수는 배우는 과정이에요. 틀렸다고 끝이 아니에요. "다시 해보자!" 하는 마음이 문제를 해결해요.',
    wrapUpEasy: '실수해도 괜찮아요. 다시 해보면 돼요.',
    wrapUpNormal: '실수는 배우는 과정이에요. 틀려도 "다시 해보자!" 하고 일어나는 사람이 진짜 문제 해결사예요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '한 번 실수하면 다시는 못 할까요?',
              answer: 'X',
              feedback: '아니에요! 다시 하면 더 잘할 수 있어요.',
            },
            {
              question: '실수는 배우는 과정일까요?',
              answer: 'O',
              feedback: '맞아요! 실수하면서 배우는 거예요.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '실수해서 속상할 때 AI가 하는 말을 들어봐요.',
          userInput: '아까 퀴즈에서 틀려서 속상해',
          aiResponse: '괜찮아요! 틀린 건 배우고 있다는 뜻이에요. 다시 해보면 이번엔 더 잘할 수 있어요. 응원할게요!',
        },
      },
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm5-l11',
    moduleId: 'm5',
    number: 11,
    kind: 'experience',
    title: '라면 끓이기 대작전',
    objective: '배운 문제 해결 방법으로 요리 순서를 계획할 수 있다.',
    standards: [
      '[9정통02-03] 순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.',
      '[9진로03-01] 직군별 작업 과정의 순서를 익힌다.',
    ],
    bodyEasy: '배운 걸로 라면 끓이는 순서를 세워봐요.',
    bodyNormal:
      '오늘은 배운 것을 다 써봐요! 라면 끓이기를 작게 나누고, 순서를 세우고, 확인까지 해봐요.',
    wrapUpEasy: '작게 나누고, 순서대로 하고, 확인했어요. 최고!',
    wrapUpNormal: '라면 끓이기도 작게 나누고 순서대로 하면 어렵지 않아요. 배운 방법은 다른 일에도 쓸 수 있어요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '먼저 AI한테 라면 끓이는 순서를 물어봐요.',
          userInput: '라면 끓이는 순서를 짧게 알려줘',
          aiResponse: '물 끓이기 → 면과 수프 넣기 → 3분 더 끓이기 → 불 끄고 그릇에 담기! 뜨거우니까 꼭 어른과 함께 해요.',
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '라면 끓이는 순서대로 눌러봐요!',
          items: [
            { label: '냄비에 물을 넣고 끓여요' },
            { label: '면과 수프를 넣어요' },
            { label: '3분 더 끓여요' },
            { label: '불을 끄고 그릇에 담아요' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '뜨거운 라면은 어른과 함께 만드는 게 안전할까요?',
              answer: 'O',
              feedback: '맞아요! 뜨거운 것은 꼭 어른과 함께 해요.',
            },
            {
              question: '면을 넣고 나서 물을 끓이는 게 맞을까요?',
              answer: 'X',
              feedback: '물을 먼저 끓이고 면을 넣어요. 순서 기억하죠?',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l12 ───────────────────────────
  {
    id: 'm5-l12',
    moduleId: 'm5',
    number: 12,
    kind: 'concept',
    title: '나는 문제 해결사! (마무리)',
    objective: '단원 5에서 배운 문제 해결 단계를 정리하여 말할 수 있다.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '배운 문제 해결 방법을 확인해봐요.',
    bodyNormal:
      '단원 5에서 배운 것 — 알아차리기, 작게 나누기, 순서 세우기, 힌트 받기, 확인하기 — 를 정리해봐요.',
    wrapUpEasy: '단원 5를 다 배웠어요! 나는 문제 해결사예요.',
    wrapUpNormal: '단원 5를 마쳤어요! 문제를 알아차리고, 작게 나누고, 순서대로 하고, 확인하는 힘이 생겼어요.',
    steps: [
      { kind: 'text', data: {} },
      {
        kind: 'sequence',
        data: {
          instruction: '문제 해결 순서를 차례대로 눌러봐요!',
          items: [
            { label: '문제를 알아차려요' },
            { label: '작게 나눠요' },
            { label: '순서대로 해요' },
            { label: '맞는지 확인해요' },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '어려운 문제', right: '작게 나눠요' },
            { left: '막힐 때', right: '"힌트만 줘" 부탁해요' },
            { left: '다 풀었을 때', right: '맞는지 확인해요' },
            { left: '실수했을 때', right: '괜찮아요, 다시 해요' },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '문제 해결사의 마음가짐으로 가장 알맞은 것은요?',
          choices: [
            { label: '"어려워도 작게 나눠서 해보자!"', isCorrect: true },
            { label: '"어려우면 바로 포기하자"', isCorrect: false },
            { label: '"남이 다 해줄 거야"', isCorrect: false },
          ],
        },
      },
    ],
  },
];
