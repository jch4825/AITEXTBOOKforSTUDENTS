import type { LessonContent } from '../../types';

/**
 * 단원 6 — AI랑 일상생활
 *
 * 12차시. 마트·길찾기·교통·요리·날씨·병원·직업 준비까지,
 * 생활 시나리오 속에서 AI를 도우미로 쓰는 실전 연습.
 * real-ai 2회 (l5/l11).
 */
export const M6_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm6-l1',
    moduleId: 'm6',
    number: 1,
    kind: 'activity',
    title: '마트에서 장보기',
    objective: 'AI의 도움을 받아 장보기 목록을 만들 수 있다.',
    standards: ['[6사회01-02] 일상생활에서 활동이나 물건을 선택하고 나의 선택을 중요하게 여기는 태도를 기른다.'],
    bodyEasy: '마트 가기 전에 살 것을 정해요. AI가 도와줘요.',
    bodyNormal:
      '마트에 가기 전에 살 물건 목록을 만들면 잊지 않아요. AI한테 "카레 재료 알려줘" 하고 물어볼 수도 있어요.',
    wrapUpEasy: '마트 가기 전에 살 것을 적어요. AI가 도와줘요.',
    wrapUpNormal: '장보기 전에 목록을 만들면 잊지 않고 살 수 있어요. 뭘 사야 할지 모르면 AI한테 물어봐요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['목록'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 카레 만들 때 필요한 재료를 물어봐요.',
          userInput: '카레 만들려면 뭘 사야 해?',
          aiResponse: '카레 가루, 감자, 당근, 양파, 그리고 고기가 필요해요. 다섯 가지를 적어 가면 돼요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '장보기 목록에 있는 것만 사면 좋은 점은요?',
          choices: [
            { label: '필요한 것을 잊지 않고 살 수 있어요', isCorrect: true },
            { label: '아무거나 다 사게 돼요', isCorrect: false },
            { label: '더 오래 걸려요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '장보기 순서대로 눌러봐요!',
          items: [
            { label: '살 물건 목록을 만들어요' },
            { label: '마트에서 물건을 찾아 담아요' },
            { label: '계산대에서 계산해요' },
            { label: '영수증과 물건을 확인해요' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm6-l2',
    moduleId: 'm6',
    number: 2,
    kind: 'activity',
    title: '얼마예요? 돈 계산',
    objective: '물건값을 계산할 때 AI의 도움을 받을 수 있다.',
    standards: [
      '[9수학01-14] 대용 화폐를 활용하여 상품을 교환한다.',
      '[12수학01-14] 실생활의 다양한 상황에서 필요한 화폐를 활용한다.',
    ],
    bodyEasy: '물건값이 얼마인지 계산해봐요.',
    bodyNormal:
      '물건을 살 때 얼마가 필요한지, 거스름돈은 얼마인지 계산해요. 어려우면 AI한테 물어볼 수 있어요.',
    wrapUpEasy: '물건값을 계산하고, 거스름돈도 확인해요.',
    wrapUpNormal: '물건값과 거스름돈은 계산으로 알 수 있어요. 어려우면 AI에게 묻고, 받은 돈은 꼭 확인해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['거스름돈'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '1,000원짜리 우유를 사는데 500원만 내면 될까요?',
              answer: 'X',
              feedback: '1,000원짜리는 1,000원이 있어야 살 수 있어요.',
            },
            {
              question: '거스름돈을 받으면 맞는지 확인하면 좋을까요?',
              answer: 'O',
              feedback: '맞아요! 받은 돈은 그 자리에서 확인해요.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '거스름돈 계산을 AI한테 물어봐요.',
          userInput: '1500원짜리 우유를 사고 2000원을 냈어. 거스름돈은 얼마야?',
          aiResponse: '2000 빼기 1500은 500! 거스름돈은 500원이에요.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '700원짜리 과자를 사고 1,000원을 냈어요. 거스름돈은요?',
          choices: [
            { label: '300원', isCorrect: true },
            { label: '700원', isCorrect: false },
            { label: '100원', isCorrect: false },
            { label: '1,000원', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm6-l3',
    moduleId: 'm6',
    number: 3,
    kind: 'activity',
    title: '길을 찾아요',
    objective: '길을 모를 때 AI 지도의 도움을 받는 방법을 말할 수 있다.',
    standards: ['[12진로04-03] 집에서 직장까지 교통 수단을 활용하여 이동한다.'],
    bodyEasy: '길을 모르면 지도 앱이 알려줘요.',
    bodyNormal:
      '길을 모를 때 지도 앱에 가고 싶은 곳을 말하면 가는 길을 알려줘요. 지도 앱에도 AI가 들어 있어요.',
    wrapUpEasy: '길을 모르면 지도 앱한테 물어봐요.',
    wrapUpNormal: '가고 싶은 곳을 지도 앱에 말하면 길을 알려줘요. 그래도 모르겠으면 어른에게 도움을 청해요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '지도 앱에 도서관 가는 길을 물어봐요.',
          userInput: '여기서 도서관까지 어떻게 가?',
          aiResponse: '앞으로 쭉 걸어가다가 편의점에서 오른쪽으로 도세요. 걸어서 5분이면 도착해요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '길을 잃었어요. 가장 좋은 방법은요?',
          choices: [
            { label: '지도 앱을 보거나 가게 어른에게 물어봐요', isCorrect: true },
            { label: '아무 길로나 막 뛰어가요', isCorrect: false },
            { label: '모르는 사람 차를 타요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '지도 앱은 가는 길을 알려줄 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 시간이 얼마나 걸리는지도 알려줘요.',
            },
            {
              question: '길을 잃으면 모르는 사람을 무조건 따라가야 할까요?',
              answer: 'X',
              feedback: '안 돼요! 가게처럼 안전한 곳의 어른에게 물어봐요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm6-l4',
    moduleId: 'm6',
    number: 4,
    kind: 'activity',
    title: '버스와 지하철 타기',
    objective: '버스 타는 순서를 차례대로 말할 수 있다.',
    standards: [
      '[12진로04-03] 집에서 직장까지 교통 수단을 활용하여 이동한다.',
      '[9보건04-03] 교통사고의 위험 요인을 알고 사고 예방을 위한 안전 수칙을 실천한다.',
    ],
    bodyEasy: '버스 타는 순서를 배워요.',
    bodyNormal:
      '버스와 지하철을 타면 멀리까지 갈 수 있어요. 몇 번 버스를 타는지 AI 지도에 물어보고, 안전하게 타는 순서를 익혀요.',
    wrapUpEasy: '버스는 순서대로, 안전하게 타요.',
    wrapUpNormal: '몇 번 버스를 탈지 미리 확인하고, 줄 서서 타고, 자리에 앉거나 손잡이를 잡아요. 안전이 최고예요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'sequence',
        data: {
          instruction: '버스 타는 순서대로 눌러봐요!',
          items: [
            { label: '몇 번 버스인지 확인해요' },
            { label: '정류장에서 줄을 서서 기다려요' },
            { label: '카드를 찍고 타요' },
            { label: '손잡이를 잡거나 자리에 앉아요' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI 지도한테 몇 번 버스를 타는지 물어봐요.',
          userInput: '시장에 가려면 몇 번 버스를 타야 해?',
          aiResponse: '3번 버스를 타면 돼요. 10분 뒤에 정류장에 도착한대요!',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '버스가 완전히 멈춘 다음에 타는 게 안전할까요?',
              answer: 'O',
              feedback: '맞아요! 버스가 멈춘 다음 차례대로 타요.',
            },
            {
              question: '버스 안에서 뛰어다녀도 될까요?',
              answer: 'X',
              feedback: '넘어질 수 있어요. 손잡이를 꼭 잡아요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm6-l5',
    moduleId: 'm6',
    number: 5,
    kind: 'experience',
    title: '오늘 날씨와 옷차림',
    objective: 'AI에게 날씨를 물어보고 알맞은 옷차림을 고를 수 있다.',
    standards: ['[12정통02-04] 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.'],
    bodyEasy: 'AI한테 날씨를 물어보고 옷을 골라요.',
    bodyNormal:
      '나가기 전에 AI한테 날씨를 물어보면 우산이 필요한지, 두꺼운 옷이 필요한지 알 수 있어요.',
    wrapUpEasy: '나가기 전에 날씨를 물어보고 옷을 골라요.',
    wrapUpNormal: '나가기 전에 AI한테 날씨를 물어보는 습관을 길러요. 비가 오면 우산, 추우면 두꺼운 옷!',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '비가 온대요. 무엇을 챙길까요?',
          choices: [
            { label: '우산', isCorrect: true },
            { label: '선글라스', isCorrect: false },
            { label: '부채', isCorrect: false },
            { label: '튜브', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 날씨에 맞는 옷차림을 물어봐요. 계절을 바꿔서 물어봐도 돼요!',
          userInput: '겨울에 밖에 나갈 때 뭘 입으면 좋아?',
          fallbackResponse: '겨울엔 두꺼운 외투와 목도리, 장갑이 좋아요. 손과 목을 따뜻하게 하면 덜 추워요!',
          allowFreeInput: true,
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '비 오는 날', right: '우산을 챙겨요' },
            { left: '추운 날', right: '두꺼운 옷을 입어요' },
            { left: '더운 날', right: '시원한 옷과 물을 챙겨요' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm6-l6',
    moduleId: 'm6',
    number: 6,
    kind: 'activity',
    title: '요리 도우미 AI',
    objective: 'AI의 도움을 받아 간단한 음식 만드는 순서를 익힐 수 있다.',
    standards: ['[9정통03-03] 가정생활에서 디지털 기술이 적용된 사례를 살펴보고 경험한다.'],
    bodyEasy: 'AI한테 만드는 법을 물어보고 샌드위치를 만들어요.',
    bodyNormal:
      '요리할 때 AI한테 만드는 순서를 물어보면 차례대로 알려줘요. 오늘은 샌드위치 만들기!',
    wrapUpEasy: 'AI한테 물어보고 순서대로 만들었어요.',
    wrapUpNormal: '요리도 순서예요. AI한테 만드는 법을 물어보고, 한 단계씩 따라 하면 돼요. 칼은 꼭 어른과 함께!',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 샌드위치 만드는 법을 물어봐요.',
          userInput: '샌드위치 만드는 법을 순서대로 알려줘',
          aiResponse: '① 식빵을 놓아요 ② 상추와 치즈, 햄을 올려요 ③ 식빵을 덮어요 ④ 반으로 잘라요. 자를 땐 어른과 함께!',
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '샌드위치 만드는 순서대로 눌러봐요!',
          items: [
            { label: '식빵 한 장을 놓아요' },
            { label: '상추, 치즈, 햄을 올려요' },
            { label: '식빵으로 덮어요' },
            { label: '어른과 함께 반으로 잘라요' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '칼을 쓸 때는 어른과 함께하는 게 안전할까요?',
              answer: 'O',
              feedback: '맞아요! 위험한 도구는 꼭 어른과 함께 써요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm6-l7',
    moduleId: 'm6',
    number: 7,
    kind: 'activity',
    title: '하루 계획 세우기',
    objective: 'AI의 도움을 받아 하루 일과 계획을 세울 수 있다.',
    standards: ['[12정통02-04] 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.'],
    bodyEasy: '오늘 할 일을 순서대로 계획해봐요.',
    bodyNormal:
      '하루를 계획하면 할 일을 잊지 않아요. AI한테 "오늘 계획 짜는 것 좀 도와줘" 하고 부탁할 수도 있어요.',
    wrapUpEasy: '하루 계획을 세우면 할 일을 잊지 않아요.',
    wrapUpNormal: '아침에 하루 계획을 세워봐요. 해야 할 일을 먼저, 놀이는 그 다음에 넣으면 하루가 잘 흘러가요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['계획'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 하루 계획을 도와달라고 해봐요.',
          userInput: '학교 다녀와서 할 일 계획 좀 도와줘. 숙제가 있어.',
          aiResponse: '이런 순서는 어때요? ① 간식 먹고 쉬기 ② 숙제 하기 ③ 놀기 ④ 저녁 먹고 일찍 자기!',
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '학교 다녀온 후! 좋은 순서대로 눌러봐요.',
          items: [
            { label: '간식을 먹고 잠깐 쉬어요' },
            { label: '숙제를 해요' },
            { label: '신나게 놀아요' },
            { label: '저녁 먹고 일찍 자요' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '계획을 세우면 할 일을 잊지 않을 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 계획은 하루의 지도예요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm6-l8',
    moduleId: 'm6',
    number: 8,
    kind: 'concept',
    title: '아플 때는 어떻게?',
    objective: '아플 때 어른에게 알리고 도움을 받는 방법을 말할 수 있다.',
    standards: ['[12정통02-04] 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.'],
    bodyEasy: '아프면 제일 먼저 어른에게 말해요.',
    bodyNormal:
      '아플 때 제일 중요한 건 어른에게 알리는 거예요. AI는 병원이 어디 있는지 찾는 걸 도와줄 수 있지만, 치료는 의사 선생님이 해요.',
    wrapUpEasy: '아프면 바로 어른에게 말해요.',
    wrapUpNormal: '아플 때는 먼저 어른에게 알려요. AI는 병원 위치를 찾아줄 수 있지만, 아픈 건 의사 선생님께 보여야 해요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '많이 아프면 제일 먼저 어른에게 말해야 할까요?',
              answer: 'O',
              feedback: '맞아요! 어른에게 알리는 게 첫 번째예요.',
            },
            {
              question: 'AI가 의사 선생님 대신 치료해줄 수 있을까요?',
              answer: 'X',
              feedback: '치료는 의사 선생님만 할 수 있어요.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '가까운 병원을 AI한테 물어보는 모습을 봐요.',
          userInput: '여기서 가까운 병원이 어디야?',
          aiResponse: '걸어서 10분 거리에 튼튼소아과가 있어요. 아플 땐 꼭 어른과 함께 가세요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '배가 많이 아파요. 제일 먼저 뭘 할까요?',
          choices: [
            { label: '부모님이나 선생님께 말해요', isCorrect: true },
            { label: '혼자 꾹 참아요', isCorrect: false },
            { label: '아무 약이나 먹어요', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm6-l9',
    moduleId: 'm6',
    number: 9,
    kind: 'activity',
    title: '인사와 부탁의 말',
    objective: '상황에 맞는 인사말과 부탁하는 말을 사용할 수 있다.',
    standards: ['[9국어01-04] 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.'],
    bodyEasy: '상황에 맞는 인사말을 연습해요.',
    bodyNormal:
      '가게에서, 버스에서, 병원에서 쓰는 인사말과 부탁의 말을 연습해요. AI랑 연습하면 실전에서 잘할 수 있어요.',
    wrapUpEasy: '"안녕하세요", "감사합니다"를 잘 쓰면 멋져요.',
    wrapUpNormal: '상황에 맞는 인사와 부탁의 말을 쓰면 어디서든 환영받아요. AI랑 미리 연습해두면 실전에서 술술 나와요.',
    steps: [
      { kind: 'text', data: { imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '가게에 들어갈 때', right: '"안녕하세요"' },
            { left: '물건을 받을 때', right: '"감사합니다"' },
            { left: '부탁할 때', right: '"~해 주세요"' },
            { left: '실수했을 때', right: '"죄송합니다"' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI랑 가게 놀이를 해봐요. 물건을 달라고 부탁해볼게요.',
          userInput: '안녕하세요, 우유 하나 주세요.',
          aiResponse: '(가게 주인 역할) 네, 우유 여기 있어요. 1,500원입니다. 인사를 참 예쁘게 하시네요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '버스에서 내려야 하는데 문 앞에 사람이 있어요. 뭐라고 말할까요?',
          choices: [
            { label: '"잠시만요, 내릴게요"', isCorrect: true },
            { label: '(말없이 밀어요)', isCorrect: false },
            { label: '"비켜!"', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm6-l10',
    moduleId: 'm6',
    number: 10,
    kind: 'concept',
    title: '여러 가지 직업 구경',
    objective: '여러 가지 직업과 하는 일을 짝지을 수 있다.',
    standards: [
      '[9진로02-02] 직업의 세계에 관심을 가지고 가족, 이웃 등 주변 사람들의 직업에 대하여 탐색한다.',
      '[12정통03-04] 디지털 사회에서의 다양한 직업을 탐색하고 체험한다.',
    ],
    bodyEasy: '세상에는 여러 가지 직업이 있어요. 구경해봐요.',
    bodyNormal:
      '세상에는 많은 직업이 있어요. 궁금한 직업이 있으면 AI한테 "그 직업은 무슨 일을 해?" 하고 물어봐요.',
    wrapUpEasy: '여러 직업을 구경했어요. 궁금하면 AI한테 물어봐요.',
    wrapUpNormal: '세상에는 다양한 직업이 있고, 저마다 하는 일이 달라요. 궁금한 직업은 AI한테 물어보며 탐색해봐요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['직업'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '요리사', right: '맛있는 음식을 만들어요' },
            { left: '운전기사', right: '버스나 트럭을 운전해요' },
            { left: '사서', right: '도서관에서 책을 관리해요' },
            { left: '농부', right: '채소와 과일을 길러요' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '궁금한 직업을 AI한테 물어봐요.',
          userInput: '제빵사는 무슨 일을 해?',
          aiResponse: '제빵사는 빵과 케이크를 만드는 사람이에요. 새벽부터 반죽을 만들고, 오븐에 구워서 맛있는 빵을 완성해요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '빵 만드는 일을 하는 사람은 누구일까요?',
          choices: [
            { label: '제빵사', isCorrect: true },
            { label: '소방관', isCorrect: false },
            { label: '수의사', isCorrect: false },
            { label: '화가', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm6-l11',
    moduleId: 'm6',
    number: 11,
    kind: 'experience',
    title: '나를 소개해요',
    objective: '자신의 이름(별명)과 좋아하는 것으로 자기소개를 할 수 있다.',
    standards: ['[9진로01-02] 흥미, 적성, 장점과 단점, 성격 등 자신의 특성을 파악하여 자신을 소개한다.'],
    bodyEasy: '내가 좋아하는 것으로 나를 소개해봐요.',
    bodyNormal:
      '"저는 그림 그리기를 좋아해요"처럼 나를 소개하는 연습을 해요. AI랑 연습하면 떨리지 않아요. 진짜 이름 대신 별명을 써요!',
    wrapUpEasy: '좋아하는 것으로 나를 소개할 수 있어요.',
    wrapUpNormal: '내가 좋아하는 것, 잘하는 것으로 나를 소개해봤어요. 연습할수록 자신 있게 말할 수 있어요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['소개'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '자기소개에서 말하면 좋은 것은요? (개인정보는 빼고!)',
          choices: [
            { label: '좋아하는 것과 잘하는 것', isCorrect: true },
            { label: '우리 집 주소', isCorrect: false },
            { label: '부모님 전화번호', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 나를 소개해봐요. 진짜 이름 말고 별명으로! 좋아하는 걸로 바꿔 써도 돼요.',
          userInput: '나는 그림 그리기를 좋아해. 내 소개를 멋지게 한 문장으로 만들어줘.',
          fallbackResponse: '"안녕하세요! 저는 색연필만 있으면 세상을 그려내는 꼬마 화가입니다!" 어때요, 멋지죠?',
          allowFreeInput: true,
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '자기소개를 연습하면 실전에서 덜 떨릴까요?',
              answer: 'O',
              feedback: '맞아요! 연습이 자신감을 만들어요.',
            },
            {
              question: 'AI한테 소개할 때 집 주소도 말해야 할까요?',
              answer: 'X',
              feedback: '개인정보는 빼고! 좋아하는 것만 말해요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l12 ───────────────────────────
  {
    id: 'm6-l12',
    moduleId: 'm6',
    number: 12,
    kind: 'concept',
    title: 'AI와 함께하는 나의 생활 (마무리)',
    objective: '전체 과정에서 배운 AI 활용법을 생활 장면과 연결하여 말할 수 있다.',
    standards: ['[12정통02-04] 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.'],
    bodyEasy: '지금까지 배운 것을 다 확인해봐요. 정말 잘했어요!',
    bodyNormal:
      '여섯 단원을 모두 배웠어요! AI가 뭔지, 어떻게 말 걸고, 안전하게 쓰고, 생활에서 활용하는지 — 마지막으로 확인해봐요.',
    wrapUpEasy: '전부 다 배웠어요! 이제 AI랑 똑똑하고 안전하게 지낼 수 있어요. 축하해요!',
    wrapUpNormal: '축하해요! AI 교과서를 끝까지 마쳤어요. AI를 알고, 잘 묻고, 안전하게 쓰고, 생활에 활용하는 힘 — 모두 여러분의 것이에요.',
    steps: [
      { kind: 'text', data: {} },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 우리 말을 알아듣고 대답해줄 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 단원 1에서 배웠어요.',
            },
            {
              question: '개인정보는 AI한테 다 말해도 될까요?',
              answer: 'X',
              feedback: '개인정보는 지켜요! 단원 4에서 배웠어요.',
            },
            {
              question: '어려운 문제는 작게 나누면 풀기 쉬워질까요?',
              answer: 'O',
              feedback: '맞아요! 단원 5에서 배웠어요.',
            },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '마트 갈 때', right: 'AI랑 장보기 목록을 만들어요' },
            { left: '길 모를 때', right: '지도 앱에 물어봐요' },
            { left: '나가기 전에', right: '날씨를 물어봐요' },
            { left: '요리할 때', right: '만드는 순서를 물어봐요' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '끝까지 해낸 나에게 AI가 하고 싶은 말이 있대요!',
          userInput: '나 오늘 다 배웠어!',
          aiResponse: '정말 축하해요! 처음부터 끝까지 해낸 여러분이 자랑스러워요. 이제 AI를 똑똑하고 안전하게 쓸 수 있는 멋진 사람이 됐어요. 앞으로도 궁금한 게 있으면 언제든 물어봐 주세요!',
        },
      },
    ],
  },
];
