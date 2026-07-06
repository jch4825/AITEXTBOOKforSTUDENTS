import type { LessonContent } from '../../types';

/**
 * 모듈 3 — AI랑 같이 배우기
 *
 * 11차시. 학생이 AI를 "공부 도우미"로 쓰는 감각을 익히는 것이 목표.
 * 모르는 것 묻기, 쉽게 설명 부탁하기, 요약·퀴즈·복습까지.
 * real-ai 스텝 3회 (l1/l5/l10).
 */
export const M3_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm3-l1',
    moduleId: 'm3',
    number: 1,
    kind: 'experience',
    title: 'AI에게 궁금한 것 물어보기',
    objective: '공부하다가 궁금한 것을 AI에게 질문하여 답을 얻을 수 있다.',
    standards: ['[9정통02-02] 인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.'],
    bodyEasy: '공부하다 궁금한 게 있으면 AI한테 물어봐요.',
    bodyNormal:
      '공부하다가 궁금한 게 생기면 AI한테 물어볼 수 있어요. AI는 우리의 공부 도우미가 될 수 있어요.',
    wrapUpEasy: '궁금한 건 AI한테 물어봐요. 공부 도우미가 돼요.',
    wrapUpNormal: '공부하다 궁금한 게 생기면 AI한테 물어봐요. AI는 언제든 대답해주는 공부 도우미예요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['도우미'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '공부하다 모르는 게 나오면 AI한테 물어봐도 될까요?',
              answer: 'O',
              feedback: '맞아요! AI는 공부 도우미예요.',
            },
            {
              question: '모르는 건 그냥 넘어가는 게 제일 좋을까요?',
              answer: 'X',
              feedback: '모르는 건 물어보면 돼요. AI도 선생님도 도와줘요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '공부 중에 AI한테 물어보기 좋은 것은 무엇일까요?',
          choices: [
            { label: '"공룡은 언제 살았어?"', isCorrect: true },
            { label: '아무 말 안 하기', isCorrect: false },
            { label: '"몰라 몰라"', isCorrect: false },
            { label: '화면 세게 누르기', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 궁금한 걸 물어봐요. 아래 글을 그대로 보내도 되고, 내가 궁금한 걸로 바꿔도 돼요.',
          userInput: '바다에서 제일 큰 동물이 뭐야?',
          fallbackResponse: '바다에서 제일 큰 동물은 흰긴수염고래예요! 버스 세 대를 이은 것보다 길어요.',
          allowFreeInput: true,
        },
      },
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm3-l2',
    moduleId: 'm3',
    number: 2,
    kind: 'activity',
    title: '모르는 단어는 AI에게',
    objective: '모르는 단어의 뜻을 AI에게 물어볼 수 있다.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    bodyEasy: '모르는 단어가 나오면 "이게 무슨 뜻이야?" 하고 물어봐요.',
    bodyNormal:
      '책이나 문제에서 모르는 단어가 나오면 AI한테 "이 단어가 무슨 뜻이야?" 하고 물어보면 돼요.',
    wrapUpEasy: '모르는 단어는 "무슨 뜻이야?" 하고 물어봐요.',
    wrapUpNormal: '모르는 단어가 나오면 AI한테 뜻을 물어봐요. 물어보는 건 부끄러운 게 아니에요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['단어'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '모르는 단어가 나왔어요. 뭐라고 물어볼까요?',
          choices: [
            { label: '"약속이 무슨 뜻이야?"', isCorrect: true },
            { label: '"음..."', isCorrect: false },
            { label: '그냥 책을 덮어요', isCorrect: false },
            { label: '"싫어"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '모르는 단어', right: '"무슨 뜻이야?" 물어봐요' },
            { left: '어려운 설명', right: '"쉽게 말해줘" 부탁해요' },
            { left: '더 알고 싶을 때', right: '"예를 들어줘" 부탁해요' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "용기가 무슨 뜻이야?" 하고 물어봐요.',
          userInput: '용기가 무슨 뜻이야?',
          aiResponse: '용기는 무섭거나 어려워도 씩씩하게 해보는 마음이에요. 발표할 때 손을 드는 것도 용기예요!',
        },
      },
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm3-l3',
    moduleId: 'm3',
    number: 3,
    kind: 'activity',
    title: '"쉽게 설명해줘"라고 말해요',
    objective: '설명이 어려울 때 "쉽게 설명해줘"라고 부탁할 수 있다.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    bodyEasy: '어려우면 "쉽게 설명해줘" 하고 부탁해요.',
    bodyNormal:
      'AI의 답이 어려울 때가 있어요. 그럴 땐 "더 쉽게 설명해줘" 하고 부탁하면 쉬운 말로 다시 알려줘요.',
    wrapUpEasy: '어려우면 "쉽게 설명해줘" 하고 말해요.',
    wrapUpNormal: '어려운 설명을 만나면 "더 쉽게 설명해줘"라고 부탁해요. AI가 쉬운 말로 바꿔줘요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['설명'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '답이 어려우면 "쉽게 설명해줘" 하고 부탁해도 될까요?',
              answer: 'O',
              feedback: '맞아요! 몇 번이든 부탁해도 돼요.',
            },
            {
              question: '어려운 말을 모르면 공부를 그만해야 할까요?',
              answer: 'X',
              feedback: '아니에요! 쉽게 바꿔달라고 하면 돼요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '설명이 너무 어려워요. 뭐라고 부탁할까요?',
          choices: [
            { label: '"일곱 살도 알게 쉽게 설명해줘"', isCorrect: true },
            { label: '"더 어렵게 해줘"', isCorrect: false },
            { label: '아무 말 안 해요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '"광합성을 쉽게 설명해줘" 하고 부탁해봐요.',
          userInput: '광합성을 쉽게 설명해줘',
          aiResponse: '식물이 햇빛을 먹고 밥을 만드는 거예요. 그래서 식물은 해를 좋아해요!',
        },
      },
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm3-l4',
    moduleId: 'm3',
    number: 4,
    kind: 'activity',
    title: 'AI랑 낱말 공부',
    objective: 'AI를 활용해 새로운 낱말을 익힐 수 있다.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    bodyEasy: 'AI랑 같이 새 낱말을 배워봐요.',
    bodyNormal:
      'AI한테 "과일 이름 알려줘", "반대말 알려줘" 하고 부탁하면 재미있게 낱말을 배울 수 있어요.',
    wrapUpEasy: 'AI랑 같이 낱말을 배웠어요.',
    wrapUpNormal: 'AI한테 낱말 뜻, 반대말, 비슷한 말을 물어보면서 재미있게 낱말 공부를 할 수 있어요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['낱말'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '"크다"의 반대말', right: '작다' },
            { left: '"기쁘다"와 비슷한 말', right: '즐겁다' },
            { left: '"아침"의 반대말', right: '저녁' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI한테 "반대말 알려줘" 하고 물어볼 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 낱말 공부도 AI가 도와줘요.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '"무겁다의 반대말이 뭐야?" 하고 물어봐요.',
          userInput: '무겁다의 반대말이 뭐야?',
          aiResponse: '"무겁다"의 반대말은 "가볍다"예요. 돌은 무겁고, 깃털은 가벼워요!',
        },
      },
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm3-l5',
    moduleId: 'm3',
    number: 5,
    kind: 'experience',
    title: 'AI랑 이야기 만들기',
    objective: 'AI와 함께 짧은 이야기를 만들 수 있다.',
    standards: ['[9정통01-04] 필요한 정보를 수집하고, 타인과 정보를 주고받는다.'],
    bodyEasy: 'AI랑 같이 재미있는 이야기를 만들어봐요.',
    bodyNormal:
      'AI한테 "토끼가 나오는 이야기를 만들어줘" 하고 부탁하면 함께 이야기를 만들 수 있어요.',
    wrapUpEasy: 'AI랑 같이 이야기를 만들어봤어요.',
    wrapUpNormal: '주인공과 장소를 정해서 부탁하면 AI가 재미있는 이야기를 만들어줘요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '이야기를 만들어달라고 할 때 더 좋은 부탁은요?',
          choices: [
            { label: '"토끼가 숲에서 모험하는 이야기 만들어줘"', isCorrect: true },
            { label: '"뭐든"', isCorrect: false },
            { label: '"이야기"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 이야기를 부탁해봐요. 주인공을 내가 좋아하는 동물로 바꿔도 돼요!',
          userInput: '강아지가 공원에서 친구를 만나는 이야기를 세 문장으로 만들어줘',
          fallbackResponse:
            '콩이는 공원에서 낯선 고양이를 만났어요. 처음엔 서로 멀뚱멀뚱 쳐다봤지요. 하지만 공을 같이 쫓다 보니 둘은 금세 친구가 되었답니다!',
          allowFreeInput: true,
        },
      },
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm3-l6',
    moduleId: 'm3',
    number: 6,
    kind: 'activity',
    title: '계산이 어려울 때',
    objective: '계산이 어려울 때 AI에게 도움을 요청할 수 있다.',
    standards: ['[12수학01-14] 실생활의 다양한 상황에서 필요한 화폐를 활용한다.'],
    bodyEasy: '계산이 어려우면 AI한테 도와달라고 해요.',
    bodyNormal:
      '계산이 어려울 때 AI한테 물어보면 답과 함께 어떻게 계산했는지도 알려줘요.',
    wrapUpEasy: '계산이 어려우면 AI한테 물어봐요.',
    wrapUpNormal: '계산이 어려울 때 AI한테 물어보면 계산 방법까지 알려줘요. 그래도 내가 한 번 더 확인해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['계산'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '계산이 어려울 때 AI한테 물어봐도 될까요?',
              answer: 'O',
              feedback: '맞아요! 어떻게 푸는지도 알려달라고 해요.',
            },
            {
              question: 'AI가 알려준 답은 확인 안 해도 될까요?',
              answer: 'X',
              feedback: 'AI도 가끔 틀려요. 한 번 더 확인하면 최고예요!',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '1,000원짜리 과자 2개를 사려면 얼마가 필요할까요?',
          choices: [
            { label: '2,000원', isCorrect: true },
            { label: '1,000원', isCorrect: false },
            { label: '500원', isCorrect: false },
            { label: '10,000원', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "1000원짜리 과자 2개면 얼마야?" 하고 물어봐요.',
          userInput: '1000원짜리 과자 2개면 얼마야?',
          aiResponse: '1000원이 2개니까 1000 더하기 1000, 모두 2000원이에요!',
        },
      },
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm3-l7',
    moduleId: 'm3',
    number: 7,
    kind: 'concept',
    title: '긴 글을 짧게 줄여줘요',
    objective: '긴 글을 AI에게 요약해달라고 부탁할 수 있다.',
    standards: ['[9정통02-02] 인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.'],
    bodyEasy: '긴 글이 힘들면 "짧게 줄여줘" 하고 부탁해요.',
    bodyNormal:
      '글이 너무 길어서 읽기 힘들면 AI한테 "짧게 요약해줘" 하고 부탁해요. 중요한 것만 남겨줘요.',
    wrapUpEasy: '긴 글은 "짧게 줄여줘" 하고 부탁해요.',
    wrapUpNormal: '긴 글은 AI한테 요약을 부탁해요. 중요한 내용만 짧게 정리해줘요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['요약'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '요약은 긴 글을 짧게 정리하는 거예요?',
              answer: 'O',
              feedback: '맞아요! 중요한 것만 남기는 거예요.',
            },
            {
              question: '요약하면 글이 더 길어질까요?',
              answer: 'X',
              feedback: '요약은 글을 짧게 만들어요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '긴 글을 짧게 만들고 싶어요. 뭐라고 부탁할까요?',
          choices: [
            { label: '"이 글을 두 줄로 요약해줘"', isCorrect: true },
            { label: '"더 길게 써줘"', isCorrect: false },
            { label: '"글자 크게 해줘"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '긴 동화를 "한 줄로 요약해줘" 하고 부탁해봐요.',
          userInput: '토끼와 거북이 이야기를 한 줄로 요약해줘',
          aiResponse: '빠른 토끼가 낮잠을 자는 동안, 느려도 끝까지 걸은 거북이가 이겼다는 이야기예요.',
        },
      },
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm3-l8',
    moduleId: 'm3',
    number: 8,
    kind: 'activity',
    title: 'AI랑 퀴즈 놀이',
    objective: 'AI에게 퀴즈를 내달라고 부탁하여 배운 내용을 연습할 수 있다.',
    standards: ['[9정통01-04] 필요한 정보를 수집하고, 타인과 정보를 주고받는다.'],
    bodyEasy: 'AI한테 퀴즈를 내달라고 해봐요. 재미있어요!',
    bodyNormal:
      'AI한테 "동물 퀴즈 내줘" 하고 부탁하면 퀴즈 놀이를 할 수 있어요. 놀면서 공부가 돼요.',
    wrapUpEasy: 'AI랑 퀴즈 놀이를 하면 공부가 재미있어요.',
    wrapUpNormal: 'AI한테 퀴즈를 내달라고 하면 놀면서 공부할 수 있어요. 배운 것도 퀴즈로 연습해봐요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['퀴즈'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI한테 "퀴즈 내줘" 하고 부탁할 수 있어요?',
              answer: 'O',
              feedback: '맞아요! AI는 퀴즈도 잘 내줘요.',
            },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '"동물 퀴즈 내줘"', right: '동물 문제를 내줘요' },
            { left: '"정답 알려줘"', right: '답을 알려줘요' },
            { left: '"한 문제 더!"', right: '새 문제를 내줘요' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "쉬운 동물 퀴즈 하나 내줘" 하고 부탁해봐요.',
          userInput: '쉬운 동물 퀴즈 하나 내줘',
          aiResponse: '문제! 목이 아주 길어서 높은 나뭇잎을 먹을 수 있는 동물은 무엇일까요? 정답은... 기린!',
        },
      },
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm3-l9',
    moduleId: 'm3',
    number: 9,
    kind: 'concept',
    title: '그림을 설명해줘요',
    objective: 'AI가 그림이나 사진을 설명해줄 수 있다는 것을 말할 수 있다.',
    standards: ['[9정통01-01] 정보통신의 의미를 이해하고, 다양한 형태와 방법으로 제공되는 정보를 살펴본다.'],
    bodyEasy: 'AI는 그림을 보고 설명해줄 수 있어요.',
    bodyNormal:
      'AI한테 사진이나 그림을 보여주면 "무엇이 있는지" 설명해줘요. 그림 공부에도 도움이 돼요.',
    wrapUpEasy: 'AI는 그림을 보고 설명해줘요.',
    wrapUpNormal: 'AI한테 그림을 보여주고 설명을 부탁하면 그림 속 내용을 말로 알려줘요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '그림 설명을 부탁하는 말은 어느 것일까요?',
          choices: [
            { label: '"이 그림에 뭐가 있는지 설명해줘"', isCorrect: true },
            { label: '"그림 지워줘"', isCorrect: false },
            { label: '"음..."', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 사진 속에 뭐가 있는지 말해줄 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 모듈 1에서 배운 이미지 인식이에요.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 그림 설명을 부탁해봐요.',
          userInput: '(그림) 이 그림을 설명해줘',
          aiResponse: '파란 하늘 아래 노란 해바라기가 세 송이 피어 있어요. 나비 한 마리가 날아다니고 있네요!',
        },
      },
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm3-l10',
    moduleId: 'm3',
    number: 10,
    kind: 'experience',
    title: '오늘 배운 것을 AI랑 복습해요',
    objective: '배운 내용을 AI와 함께 복습할 수 있다.',
    standards: ['[9정통02-02] 인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.'],
    bodyEasy: '배운 걸 AI랑 한 번 더 이야기하면 오래 기억나요.',
    bodyNormal:
      '오늘 배운 것을 AI한테 물어보거나 설명해보면 복습이 돼요. 한 번 더 보면 오래 기억나요.',
    wrapUpEasy: '배운 건 AI랑 한 번 더 복습해요.',
    wrapUpNormal: '배운 것을 AI랑 다시 이야기하면 복습이 돼요. 복습하면 오래 기억할 수 있어요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['복습'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '복습하면 배운 게 더 오래 기억날까요?',
              answer: 'O',
              feedback: '맞아요! 한 번 더 보면 기억이 튼튼해져요.',
            },
            {
              question: '복습은 한 번 배운 걸 다시 보는 거예요?',
              answer: 'O',
              feedback: '맞아요! 다시 보고, 다시 말해보는 거예요.',
            },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 배운 것에 대해 물어봐요. 우리가 배운 "AI가 뭐야?"를 물어봐도 좋아요!',
          userInput: 'AI가 뭔지 한 문장으로 알려줘',
          fallbackResponse: 'AI는 컴퓨터가 사람처럼 생각하고 대답할 수 있게 만든 기술이에요!',
          allowFreeInput: true,
        },
      },
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm3-l11',
    moduleId: 'm3',
    number: 11,
    kind: 'concept',
    title: '나만의 공부 도우미 (마무리)',
    objective: '모듈 3에서 배운 AI 공부 활용법을 정리하여 말할 수 있다.',
    standards: ['[12정통02-04] 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.'],
    bodyEasy: 'AI는 나의 공부 도우미예요. 배운 걸 확인해봐요.',
    bodyNormal:
      '모듈 3에서 AI로 공부하는 방법을 배웠어요. 물어보기, 쉽게 부탁하기, 요약, 퀴즈, 복습까지 확인해봐요!',
    wrapUpEasy: '모듈 3을 다 배웠어요! AI는 나의 공부 도우미예요.',
    wrapUpNormal: '모듈 3을 마쳤어요! 물어보기, 쉽게 설명 부탁하기, 요약, 퀴즈, 복습 — AI 공부 활용법을 배웠어요.',
    steps: [
      { kind: 'text', data: {} },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '모르는 단어', right: '"무슨 뜻이야?" 물어봐요' },
            { left: '어려운 설명', right: '"쉽게 설명해줘" 부탁해요' },
            { left: '긴 글', right: '"짧게 요약해줘" 부탁해요' },
            { left: '심심한 공부', right: '"퀴즈 내줘" 부탁해요' },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI 답이 이상할 때는 어떻게 해요?',
          choices: [
            { label: '다시 물어보고 선생님께 확인해요', isCorrect: true },
            { label: '무조건 다 믿어요', isCorrect: false },
            { label: '공부를 그만둬요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 마지막으로 인사해봐요. "오늘 공부 도와줘서 고마워!"',
          userInput: '오늘 공부 도와줘서 고마워!',
          aiResponse: '천만에요! 궁금한 게 생기면 언제든 또 물어봐 주세요. 같이 공부해서 즐거웠어요!',
        },
      },
    ],
  },
];
