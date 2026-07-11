import type { LessonContent } from '../../types';

/**
 * 단원 1 — AI가 뭐야?
 *
 * 11차시 개념 도입. 학생이 "AI가 우리 곁에 있고, 뭘 잘하고 못하는지"를
 * 감으로 잡는 것이 목표. 실제 Gemini 호출 없음 — 전부 시뮬레이션.
 */
export const M1_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm1-l1',
    moduleId: 'm1',
    number: 1,
    kind: 'concept',
    title: 'AI는 우리 곁에 있어요',
    objective: '생활 속에서 AI가 쓰이는 예를 찾아 말할 수 있다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: 'AI는 우리 곁에 있어요. 우리 말을 알아듣고 대답해줘요.',
    wrapUpNormal: '오늘은 AI가 우리 곁 어디에 있는지 알아봤어요. AI는 우리 말을 알아듣고 대답해주는 기술이에요.',
    bodyEasy: '인공지능은 컴퓨터가 사람처럼 생각하는 거예요.',
    bodyNormal:
      '인공지능(AI)은 컴퓨터가 사람처럼 생각하고 답해주게 만든 기술이에요. 우리가 묻는 질문에 답을 해줘요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['인공지능', '컴퓨터', '프로그램', '자료', '음성 비서', '번역', '앱', '도구'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '핸드폰의 음성비서(시리, 빅스비)는 AI일까요?',
              answer: 'O',
              feedback: '맞아요! AI가 우리 말을 알아듣고 답해줘요.',
            },
            {
              question: '냉장고는 AI일까요?',
              answer: 'X',
              feedback: '대부분의 냉장고는 그냥 차갑게 만드는 기계예요.',
            },
            {
              question: '챗봇은 AI일까요?',
              answer: 'O',
              feedback: '맞아요! 챗봇은 글로 대화하는 AI예요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI가 가장 잘하는 일은 무엇일까요?',
          choices: [
            { label: '사람이 묻는 말에 답해주기', isCorrect: true, icon: 'chatbot' },
            { label: '빨래를 개기', isCorrect: false, icon: 'clothes' },
            { label: '축구공 차기', isCorrect: false, icon: 'soccer_ball' },
            { label: '비 오게 하기', isCorrect: false, icon: 'rain' },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '시리·빅스비', right: '말로 대화하는 AI', icon: 'ai_speaker' },
            { left: '챗봇', right: '글로 대화하는 AI', icon: 'chatbot' },
            { left: '번역기', right: '말을 바꿔주는 AI', icon: 'translate' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "안녕!" 이라고 인사해봐요.',
          userInput: '안녕!',
          aiResponse: '안녕하세요! 만나서 반가워요. 오늘은 어떤 걸 배우고 싶어요?',
        },
      },
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm1-l2',
    moduleId: 'm1',
    number: 2,
    kind: 'concept',
    title: '기계랑 AI는 뭐가 달라?',
    objective: '정해진 일만 하는 기계와 말을 알아듣는 AI를 구별할 수 있다.',
    standards: [
      '[9정통01-02] 다양한 정보통신 기기의 종류를 알고, 기본 기능을 익힌다.',
      '[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.',
    ],
    wrapUpEasy: '그냥 기계는 정해진 일만 해요. AI는 말을 알아듣고 대답해요.',
    wrapUpNormal: '보통 기계는 정해진 일만 반복하지만, AI는 우리 질문을 알아듣고 스스로 답을 만들어요.',
    bodyEasy: '그냥 기계는 정해진 일만 해요. AI는 우리 말을 알아듣고 답해줘요.',
    bodyNormal:
      '보통 기계는 미리 정해진 일만 반복해요. 하지만 AI는 우리가 하는 질문을 알아듣고 스스로 답을 만들어줘요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['기계', '자동화', '학습', '자료'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '이 중에 AI를 쓰는 건 무엇일까요?',
          choices: [
            { label: '스마트폰 음성비서에게 노래 틀어달라고 말하기', isCorrect: true, icon: 'ai_speaker' },
            { label: '선풍기 버튼 누르기', isCorrect: false, icon: 'fan' },
            { label: '전등 스위치 켜기', isCorrect: false, icon: 'light_switch' },
            { label: '수도꼭지 돌리기', isCorrect: false, icon: 'faucet' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '토스터는 우리 말을 알아들을 수 있어요?',
              answer: 'X',
              feedback: '토스터는 그냥 빵을 굽는 기계예요. 말을 알아들을 수 없어요.',
            },
            {
              question: 'AI 스피커는 "음악 틀어줘"를 알아들어요?',
              answer: 'O',
              feedback: '맞아요! AI 스피커는 우리 말을 듣고 이해할 수 있어요.',
            },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '그냥 기계', right: '정해진 일만 반복', icon: 'fan' },
            { left: 'AI', right: '우리 말을 알아듣고 답해줌', icon: 'ai_speaker' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm1-l3',
    moduleId: 'm1',
    number: 3,
    kind: 'concept',
    title: 'AI는 어떻게 답해줄까?',
    objective: 'AI에게 궁금한 것을 질문하면 답을 받을 수 있다는 것을 말할 수 있다.',
    standards: [
      '[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
      '[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.',
    ],
    wrapUpEasy: '궁금한 게 있으면 AI한테 물어봐요. 답을 해줘요.',
    wrapUpNormal: 'AI한테 글이나 말로 물어보면 답을 만들어줘요. 궁금한 건 언제든 물어봐도 돼요.',
    bodyEasy: 'AI한테 물으면 답을 해줘요. 짧게 물어도 되고, 길게 물어도 돼요.',
    bodyNormal:
      'AI한테 궁금한 걸 글이나 말로 물어보면 답을 만들어줘요. 짧게 물어도 되고 자세하게 물어도 돼요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['생성형 AI', '자료', '확률', '예측', '특징', '환각'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "무지개는 몇 개 색이야?" 라고 물어봐요.',
          userInput: '무지개는 몇 개 색이야?',
          aiResponse: '무지개는 보통 7개 색이에요. 빨강, 주황, 노랑, 초록, 파랑, 남색, 보라!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI한테 물어보기 좋은 것은 무엇일까요?',
          choices: [
            { label: '"고양이는 왜 울어?"', isCorrect: true, icon: 'cat' },
            { label: '아무 말 안 하기', isCorrect: false, icon: 'sleep' },
            { label: '눈만 감고 기다리기', isCorrect: false, icon: 'sleep' },
            { label: '화면 두드리기', isCorrect: false, icon: 'faucet' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI한테는 궁금한 걸 아무 때나 물어봐도 될까요?',
              answer: 'O',
              feedback: '맞아요! 궁금할 때 언제든 물어봐도 돼요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm1-l4',
    moduleId: 'm1',
    number: 4,
    kind: 'concept',
    title: 'AI는 눈이 있어? (그림을 알아봐요)',
    objective: 'AI가 사진 속 사물을 알아볼 수 있다는 것을 예를 들어 말할 수 있다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: 'AI는 사진을 보고 뭐가 있는지 알아볼 수 있어요.',
    wrapUpNormal: 'AI는 사진을 보고 무엇이 있는지 알아볼 수 있어요. 이것을 이미지 인식이라고 해요.',
    bodyEasy: 'AI는 사진을 보고 "이게 뭐야"를 알 수 있어요.',
    bodyNormal:
      'AI는 사진을 보여주면 "이건 강아지야, 저건 자동차야" 하고 알아볼 수 있어요. 이걸 이미지 인식이라고 해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['이미지 인식', '학습', '패턴', '판단'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 사진을 보여주고 "이게 뭐야?" 하고 물어봐요.',
          userInput: '(강아지 사진) 이게 뭐야?',
          aiResponse: '귀여운 강아지네요! 갈색 털을 가진 작은 강아지예요.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 사진을 보고 "고양이야"라고 말해줄 수 있어요?',
              answer: 'O',
              feedback: '맞아요! AI는 사진 속 물건을 알아볼 수 있어요.',
            },
            {
              question: 'AI는 눈을 감으면 아무것도 못 봐요?',
              answer: 'X',
              feedback: 'AI는 사람 같은 눈이 아니라 카메라나 사진을 통해 봐요.',
            },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '사진 속 강아지', right: 'AI가 "강아지"라고 알아봐요', icon: 'dog' },
            { left: '사진 속 자동차', right: 'AI가 "자동차"라고 알아봐요', icon: 'car' },
            { left: '사진 속 사과', right: 'AI가 "사과"라고 알아봐요', icon: 'apple' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm1-l5',
    moduleId: 'm1',
    number: 5,
    kind: 'concept',
    title: 'AI는 귀가 있어? (말을 알아들어요)',
    objective: 'AI가 목소리를 알아듣는 음성 인식의 예를 말할 수 있다.',
    standards: [
      '[9정통01-02] 다양한 정보통신 기기의 종류를 알고, 기본 기능을 익힌다.',
      '[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.',
    ],
    wrapUpEasy: 'AI는 우리 목소리를 듣고 알아들어요.',
    wrapUpNormal: 'AI는 마이크로 우리 말을 듣고 알아들어요. 조용한 곳에서 또박또박 말하면 더 잘 알아들어요.',
    bodyEasy: 'AI는 우리가 하는 말을 듣고 알아들을 수 있어요.',
    bodyNormal:
      'AI는 마이크로 우리 목소리를 듣고 무슨 말을 했는지 알아들어요. 이걸 음성 인식이라고 해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['음성 인식', '마이크', '명령어'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 말로 "지금 몇 시야?" 라고 물어봐요.',
          userInput: '(마이크) 지금 몇 시야?',
          aiResponse: '지금은 오후 3시 30분이에요.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '말로 AI를 쓰는 예는 무엇일까요?',
          choices: [
            { label: '"시리야, 알람 맞춰줘"', isCorrect: true, icon: 'alarm_clock' },
            { label: '종이에 그림 그리기', isCorrect: false, icon: 'drawing' },
            { label: '창문 닫기', isCorrect: false, icon: 'window' },
            { label: '가만히 있기', isCorrect: false, icon: 'sleep' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 시끄러운 곳에서도 말을 잘 알아들을까요?',
              answer: 'X',
              feedback: '조용한 곳에서 또박또박 말하면 더 잘 알아들어요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm1-l6',
    moduleId: 'm1',
    number: 6,
    kind: 'concept',
    title: 'AI는 어떻게 배울까?',
    objective: 'AI가 많은 예시를 보고 배운다는 것을 말할 수 있다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: 'AI는 많은 예시를 보고 배워요. 우리가 연습하는 것처럼요.',
    wrapUpNormal: 'AI는 아주 많은 예시를 보면서 배워요. 우리가 연습을 많이 하면 잘하게 되는 것과 비슷해요.',
    bodyEasy: 'AI는 아주 많은 예시를 보고 배워요. 우리가 연습하는 것처럼요.',
    bodyNormal:
      'AI는 사람이 만든 아주 많은 예시(사진, 글, 소리)를 보면서 배워요. 우리가 자꾸 연습하면 잘하게 되는 것과 비슷해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['학습 데이터', '자료', '훈련', '편향'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '고양이 사진 100장 보여주기', right: 'AI가 고양이를 알아봐요', icon: 'cat' },
            { left: '노래 가사 많이 보여주기', right: 'AI가 노래를 만들어요', icon: 'music' },
            { left: '대화 많이 보여주기', right: 'AI가 대화를 잘해요', icon: 'chatbot' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 태어날 때부터 다 알까요?',
              answer: 'X',
              feedback: 'AI도 사람처럼 많이 보고 배워야 알 수 있어요.',
            },
            {
              question: 'AI에게 많은 예시를 보여주면 더 잘하게 될까요?',
              answer: 'O',
              feedback: '맞아요! 우리가 연습을 많이 하면 잘하는 것과 같아요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI는 어떤 것을 보고 배울까요?',
          choices: [
            { label: '많은 예시(사진, 글, 소리)', isCorrect: true, icon: 'book' },
            { label: '한 번만 스치듯 봐도 다 배움', isCorrect: false, icon: 'light_switch' },
            { label: '아무것도 안 보고 다 앎', isCorrect: false, icon: 'sleep' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm1-l7',
    moduleId: 'm1',
    number: 7,
    kind: 'concept',
    title: 'AI가 잘하는 것',
    objective: 'AI가 잘하는 일을 두 가지 이상 말할 수 있다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: 'AI는 빠르게 답하고, 번역하고, 그림을 알아봐요.',
    wrapUpNormal: 'AI는 빠르게 답하기, 번역하기, 사진 알아보기를 잘해요. 우리를 여러 가지로 도와줄 수 있어요.',
    bodyEasy: 'AI는 빠르게 답하기, 번역하기, 그림 알아보기를 잘해요.',
    bodyNormal:
      'AI는 아주 빠르게 답을 만들고, 다른 나라 말로 바꿔주고, 사진 속 물건을 알아봐요. 우리를 여러 가지로 도와줄 수 있어요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['요약', '번역'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: 'AI가 잘하는 일은 어떤 것일까요?',
          choices: [
            { label: '영어를 한국어로 바꿔주기', isCorrect: true, icon: 'translate' },
            { label: '기분 나빠 하기', isCorrect: false, icon: 'angry_face' },
            { label: '배고파 하기', isCorrect: false, icon: 'hungry' },
            { label: '잠자기', isCorrect: false, icon: 'sleep' },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '빠르게 답하기', right: '몇 초 만에 답해줘요', icon: 'chatbot' },
            { left: '번역하기', right: '다른 나라 말로 바꿔줘요', icon: 'translate' },
            { left: '요약하기', right: '긴 글을 짧게 정리해줘요', icon: 'book' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 사람보다 계산을 훨씬 빠르게 할 수 있어요?',
              answer: 'O',
              feedback: '맞아요! AI는 계산을 아주 빠르게 해요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm1-l8',
    moduleId: 'm1',
    number: 8,
    kind: 'concept',
    title: 'AI가 못하는 것',
    objective: 'AI가 할 수 없는 일을 두 가지 이상 말할 수 있다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: 'AI는 밥을 먹거나 진짜 마음을 느끼지 못해요.',
    wrapUpNormal: 'AI는 몸과 마음이 없어서 밥을 먹거나 진짜로 슬퍼하지 못해요. 사람만 할 수 있는 일이 있어요.',
    bodyEasy: 'AI는 밥을 먹거나, 마음을 느끼지 못해요. 사람만 하는 일이 있어요.',
    bodyNormal:
      'AI는 사람처럼 배고픔이나 슬픔 같은 마음을 진짜로 느끼지 못해요. 몸이 없어서 뛰거나 밥 먹는 것도 못 해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['최신 정보', '감정'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 배가 고파서 밥을 먹을까요?',
              answer: 'X',
              feedback: 'AI는 몸이 없어서 밥을 못 먹어요.',
            },
            {
              question: 'AI는 진짜로 슬퍼서 눈물을 흘릴까요?',
              answer: 'X',
              feedback: 'AI는 마음이 없어서 진짜로 슬퍼하지 못해요.',
            },
            {
              question: 'AI는 축구공을 발로 찰 수 있을까요?',
              answer: 'X',
              feedback: 'AI는 몸이 없어서 발로 찰 수가 없어요.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "너 배고파?" 라고 물어봐요.',
          userInput: '너 배고파?',
          aiResponse:
            '저는 컴퓨터라서 배가 고프거나 밥을 먹진 못해요. 하지만 궁금한 게 있으면 언제든 물어봐 주세요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI가 할 수 없는 것은 무엇일까요?',
          choices: [
            { label: '진짜로 슬퍼하며 울기', isCorrect: true, icon: 'sad_crying' },
            { label: '질문에 답해주기', isCorrect: false, icon: 'chatbot' },
            { label: '번역해주기', isCorrect: false, icon: 'translate' },
            { label: '사진 속 물건 알아보기', isCorrect: false, icon: 'dog' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm1-l9',
    moduleId: 'm1',
    number: 9,
    kind: 'concept',
    title: '여러 가지 AI 친구들',
    objective: '여러 가지 AI의 종류와 하는 일을 짝지을 수 있다.',
    standards: [
      '[9정통01-02] 다양한 정보통신 기기의 종류를 알고, 기본 기능을 익힌다.',
      '[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.',
    ],
    wrapUpEasy: 'AI는 여러 가지예요. 하는 일이 조금씩 달라요.',
    wrapUpNormal: '글로 대화하는 AI, 말로 대화하는 AI, 그림 그리는 AI처럼 AI는 종류마다 하는 일이 달라요.',
    bodyEasy: 'AI는 여러 가지가 있어요. 이름도 하는 일도 조금씩 달라요.',
    bodyNormal:
      'AI는 종류가 여러 가지예요. 어떤 AI는 글로 대화하고, 어떤 AI는 그림을 그려요. 이름도 하는 일도 조금씩 달라요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['이미지 생성 AI', '챗봇', '도구'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '챗GPT·제미나이', right: '글로 대화하는 AI', icon: 'chatbot' },
            { left: '시리·빅스비', right: '말로 대화하는 AI', icon: 'ai_speaker' },
            { left: '이미지 생성 AI', right: '그림을 그려주는 AI', icon: 'drawing' },
            { left: '번역 AI', right: '다른 나라 말로 바꿔주는 AI', icon: 'translate' },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '"이 강아지 사진을 그려줘"는 어떤 AI에게 물어볼까요?',
          choices: [
            { label: '그림을 그려주는 AI', isCorrect: true, icon: 'drawing' },
            { label: '말로만 대답하는 AI', isCorrect: false, icon: 'chatbot' },
            { label: '번역만 하는 AI', isCorrect: false, icon: 'translate' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '모든 AI는 다 똑같이 생겼고 이름도 같을까요?',
              answer: 'X',
              feedback: 'AI는 여러 가지가 있고 이름도 달라요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm1-l10',
    moduleId: 'm1',
    number: 10,
    kind: 'experience',
    title: 'AI랑 놀아본 사람?',
    objective: 'AI에게 짧은 질문을 보내고 답을 확인할 수 있다.',
    standards: [
      '[9정통01-04] 필요한 정보를 수집하고, 타인과 정보를 주고받는다.',
      '[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
    ],
    wrapUpEasy: '오늘 AI랑 이야기해봤어요. 또박또박 물어보면 돼요.',
    wrapUpNormal: '오늘 AI랑 진짜로 이야기해봤어요. 궁금한 걸 또박또박 물어보면 AI가 대답해줘요.',
    bodyEasy: 'AI랑 이야기해본 적 있어요? 오늘은 짧게 대화해봐요.',
    bodyNormal:
      'AI랑 이야기해본 적 있어요? 오늘은 짧은 대화를 해보면서 AI가 어떻게 답하는지 느껴봐요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['프롬프트'] } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "오늘 기분이 어때?" 라고 물어봐요.',
          userInput: '오늘 기분이 어때?',
          aiResponse:
            '저는 마음이 없어서 진짜로 기분을 느끼진 못해요. 그런데 여러분과 이야기할 수 있어서 반가워요!',
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '이번엔 진짜 AI한테 "노래 하나 추천해줘" 라고 부탁해봐요!',
          userInput: '노래 하나 추천해줘',
          fallbackResponse:
            '기분이 좋아지는 신나는 동요는 어때요? "곰 세 마리" 나 "숲속을 걸어요" 같은 노래를 추천해요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI랑 이야기할 때 어떻게 하면 좋을까요?',
          choices: [
            { label: '궁금한 걸 또박또박 물어봐요', isCorrect: true, icon: 'chatbot' },
            { label: '아무 말도 안 해요', isCorrect: false, icon: 'sleep' },
            { label: '큰 소리로 화내요', isCorrect: false, icon: 'angry_face' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm1-l11',
    moduleId: 'm1',
    number: 11,
    kind: 'activity',
    title: '다 배웠어요! (마무리 퀴즈)',
    objective: '단원 1에서 배운 AI의 특징을 퀴즈로 확인할 수 있다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: '단원 1을 다 배웠어요! AI가 뭔지 알게 됐어요.',
    wrapUpNormal: '단원 1을 마쳤어요! AI가 무엇이고, 뭘 잘하고 못하는지 알게 됐어요. 다음 단원에서 AI랑 직접 말해봐요.',
    bodyEasy: '지금까지 배운 걸 확인해봐요.',
    bodyNormal:
      '단원 1에서 배운 내용을 짧은 퀴즈로 확인해봐요. 틀려도 괜찮아요, 다시 보면서 배워봐요!',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['학습 데이터', '생성형 AI', '인공지능', '예측', '훈련', '환각', '도구'] } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 사람 말을 알아듣고 답해줄 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 그게 AI가 잘하는 일이에요.',
            },
            {
              question: 'AI는 진짜로 배가 고파서 밥을 먹을까요?',
              answer: 'X',
              feedback: 'AI는 몸이 없어서 밥을 못 먹어요.',
            },
            {
              question: 'AI는 많은 예시를 보고 배울까요?',
              answer: 'O',
              feedback: '맞아요! 우리가 연습하는 것처럼요.',
            },
            {
              question: '냉장고는 모두 다 AI일까요?',
              answer: 'X',
              feedback: '대부분의 냉장고는 그냥 차갑게 만드는 기계예요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '다음 중 AI를 사용하는 것은 무엇일까요?',
          choices: [
            { label: '스마트폰 음성비서', isCorrect: true, icon: 'ai_speaker' },
            { label: '연필', isCorrect: false, icon: 'pencil' },
            { label: '종이컵', isCorrect: false, icon: 'paper_cup' },
            { label: '지우개', isCorrect: false, icon: 'eraser' },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: 'AI가 잘하는 것', right: '빠르게 답하고, 번역하고, 그림 알아보기', icon: 'translate' },
            { left: 'AI가 못하는 것', right: '진짜로 슬퍼하거나, 밥 먹기', icon: 'sad_crying' },
            { left: 'AI가 배우는 방법', right: '많은 예시를 보고 배우기', icon: 'book' },
          ],
        },
      },
    ],
  },
];

