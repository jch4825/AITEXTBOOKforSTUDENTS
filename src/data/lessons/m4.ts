import type { LessonContent } from '../../types';

/**
 * 단원 4 — AI 안전하게 쓰기
 *
 * 11차시. 안전·윤리·자기보호. 통제된 시뮬레이션 사례로만 배운다 —
 * real-ai 없음 (틀린 답·나쁜 말 사례를 안전하게 보여주기 위해).
 */
export const M4_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm4-l1',
    moduleId: 'm4',
    number: 1,
    kind: 'concept',
    title: 'AI도 틀릴 수 있어요',
    objective: 'AI가 자신 있게 틀린 답을 줄 수 있다는 것을 사례로 말할 수 있다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    bodyEasy: 'AI도 가끔 틀려요. 다 믿으면 안 돼요.',
    bodyNormal:
      'AI는 가끔 틀린 답을 아주 자신 있게 말해요. 그래서 중요한 건 꼭 확인해야 해요.',
    wrapUpEasy: 'AI도 틀릴 수 있어요. 중요한 건 확인해요.',
    wrapUpNormal: 'AI는 틀린 답도 자신 있게 말할 수 있어요. 중요한 것은 선생님이나 책으로 확인해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['확인', '환각', '오답'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI가 틀린 답을 주는 모습을 봐요. "세종대왕이 컴퓨터를 만들었어?" 하고 물어볼게요.',
          userInput: '세종대왕이 컴퓨터를 만들었어?',
          aiResponse: '네! 세종대왕은 1443년에 첫 컴퓨터를 만들었어요. (※ 이 답은 틀렸어요! 세종대왕은 한글을 만드셨어요.)',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 언제나 100% 맞는 답만 줄까요?',
              answer: 'X',
              feedback: 'AI도 틀릴 수 있어요. 방금 봤지요?',
            },
            {
              question: 'AI가 자신 있게 말하면 무조건 진짜일까요?',
              answer: 'X',
              feedback: '자신 있게 말해도 틀릴 수 있어요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI의 답이 정말인지 알고 싶어요. 어떻게 할까요?',
          choices: [
            { label: '선생님이나 책으로 확인해요', isCorrect: true },
            { label: '무조건 믿어요', isCorrect: false },
            { label: '친구한테 자랑해요', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm4-l2',
    moduleId: 'm4',
    number: 2,
    kind: 'activity',
    title: '진짜일까? 확인해봐요',
    objective: '정보가 진짜인지 확인하는 방법을 말할 수 있다.',
    standards: ['[9정통01-01] 정보통신의 의미를 이해하고, 다양한 형태와 방법으로 제공되는 정보를 살펴본다.'],
    bodyEasy: '들은 이야기가 진짜인지 확인하는 방법을 배워요.',
    bodyNormal:
      'AI 답이나 인터넷 글이 진짜인지 확인하려면 다른 곳에서도 찾아보고, 어른에게 물어봐요.',
    wrapUpEasy: '이상한 이야기는 어른에게 물어보고 확인해요.',
    wrapUpNormal: '정보가 진짜인지 확인하려면 다른 곳에서 찾아보고 어른에게 물어봐요. 확인하는 습관이 중요해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['정보', '사실 확인', '출처'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI 답이 이상할 때 다시 물어보는 모습을 봐요.',
          userInput: '정말이야? 다시 확인해줘.',
          aiResponse: '다시 확인해보니 제가 틀렸어요. 미안해요! 세종대왕은 컴퓨터가 아니라 한글을 만드셨어요.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"정말이야?" 하고 다시 물어보는 건 좋은 습관일까요?',
              answer: 'O',
              feedback: '맞아요! 다시 물으면 AI가 고쳐서 답하기도 해요.',
            },
            {
              question: '이상한 정보는 다른 곳에서도 찾아보면 좋을까요?',
              answer: 'O',
              feedback: '맞아요! 여러 곳에서 확인하면 더 정확해요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '"초콜릿을 먹으면 하늘을 날 수 있대!" 이 말을 들으면?',
          choices: [
            { label: '이상하니까 어른에게 물어봐요', isCorrect: true },
            { label: '바로 믿고 친구에게 알려요', isCorrect: false },
            { label: '지붕에 올라가봐요', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm4-l3',
    moduleId: 'm4',
    number: 3,
    kind: 'concept',
    title: '내 정보는 소중해요',
    objective: '개인정보가 무엇인지 알고 AI에게 말하면 안 되는 것을 구별할 수 있다.',
    standards: ['[9정통03-02] 개인 정보 보호의 중요성을 알고, 안전하게 관리하는 습관을 기른다.'],
    bodyEasy: '내 이름, 집 주소, 전화번호는 소중해요. 함부로 말하지 않아요.',
    bodyNormal:
      '이름, 집 주소, 전화번호, 학교 이름 같은 것을 개인정보라고 해요. AI나 인터넷에 함부로 알려주면 안 돼요.',
    wrapUpEasy: '내 이름, 주소, 전화번호는 함부로 말하지 않아요.',
    wrapUpNormal: '개인정보는 나를 알아볼 수 있는 소중한 정보예요. AI나 인터넷에 함부로 알려주지 않아요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['개인정보'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '내 집 주소를 AI한테 알려줘도 될까요?',
              answer: 'X',
              feedback: '집 주소는 소중한 개인정보예요. 알려주지 않아요.',
            },
            {
              question: '"좋아하는 색이 뭐야?"는 말해도 될까요?',
              answer: 'O',
              feedback: '좋아하는 색은 괜찮아요. 나를 찾아낼 수 없거든요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI한테 말하면 안 되는 것은 무엇일까요?',
          choices: [
            { label: '우리 집 주소와 전화번호', isCorrect: true },
            { label: '좋아하는 동물', isCorrect: false },
            { label: '좋아하는 계절', isCorrect: false },
            { label: '좋아하는 노래', isCorrect: false },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '집 주소', right: '말하면 안 돼요' },
            { left: '전화번호', right: '말하면 안 돼요 (소중!)' },
            { left: '좋아하는 과일', right: '말해도 괜찮아요' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm4-l4',
    moduleId: 'm4',
    number: 4,
    kind: 'activity',
    title: '비밀번호는 비밀!',
    objective: '비밀번호를 다른 사람에게 알려주면 안 된다는 것을 말할 수 있다.',
    standards: ['[9정통03-02] 개인 정보 보호의 중요성을 알고, 안전하게 관리하는 습관을 기른다.'],
    bodyEasy: '비밀번호는 아무한테도 알려주지 않아요.',
    bodyNormal:
      '비밀번호는 내 물건을 지키는 열쇠예요. 친구한테도, AI한테도 알려주지 않아요. 부모님과 선생님만 예외예요.',
    wrapUpEasy: '비밀번호는 비밀! 아무한테도 알려주지 않아요.',
    wrapUpNormal: '비밀번호는 내 것을 지키는 열쇠예요. 부모님 말고는 누구에게도 알려주지 않아요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['비밀번호', '계정'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '친한 친구가 물어보면 비밀번호를 알려줘도 될까요?',
              answer: 'X',
              feedback: '친한 친구여도 비밀번호는 비밀이에요.',
            },
            {
              question: '비밀번호는 내 물건을 지키는 열쇠 같은 거예요?',
              answer: 'O',
              feedback: '맞아요! 열쇠를 아무한테나 주지 않는 것처럼요.',
            },
            {
              question: '모르는 사람이 "비밀번호 알려줘" 하면 알려줘야 할까요?',
              answer: 'X',
              feedback: '절대 안 돼요! 어른에게 바로 알려요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '누가 비밀번호를 물어봐요. 어떻게 할까요?',
          choices: [
            { label: '알려주지 않고 어른에게 말해요', isCorrect: true },
            { label: '착한 사람 같으니 알려줘요', isCorrect: false },
            { label: '반만 알려줘요', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm4-l5',
    moduleId: 'm4',
    number: 5,
    kind: 'concept',
    title: '사진을 함부로 보내지 않아요',
    objective: '내 사진과 가족 사진을 함부로 보내면 안 된다는 것을 말할 수 있다.',
    standards: ['[9정통03-02] 개인 정보 보호의 중요성을 알고, 안전하게 관리하는 습관을 기른다.'],
    bodyEasy: '내 얼굴 사진은 함부로 보내지 않아요.',
    bodyNormal:
      '내 얼굴, 우리 집, 가족이 나온 사진도 개인정보예요. 인터넷이나 AI에 함부로 올리거나 보내지 않아요.',
    wrapUpEasy: '내 사진은 함부로 보내지 않아요.',
    wrapUpNormal: '얼굴이나 집이 나온 사진도 소중한 개인정보예요. 보내기 전에 부모님이나 선생님께 물어봐요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['개인정보', '초상권'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '누가 사진을 보내달라고 하면 어떻게 하는지 봐요.',
          userInput: '(모르는 사람) 네 사진 보내줄래?',
          aiResponse: '이럴 땐 보내지 않아요! 그리고 바로 부모님이나 선생님께 말해요. "모르는 사람이 사진을 달래요" 하고요.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '모르는 사람이 사진을 보내달라고 하면 보내야 할까요?',
              answer: 'X',
              feedback: '절대 안 돼요! 어른에게 바로 알려요.',
            },
            {
              question: '사진을 올리기 전에 어른에게 물어보면 좋을까요?',
              answer: 'O',
              feedback: '맞아요! 물어보고 올리는 게 안전해요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '함부로 보내면 안 되는 사진은 무엇일까요?',
          choices: [
            { label: '내 얼굴이 크게 나온 사진', isCorrect: true },
            { label: '하늘 구름 사진', isCorrect: false },
            { label: '길가의 꽃 사진', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm4-l6',
    moduleId: 'm4',
    number: 6,
    kind: 'activity',
    title: '기분 나쁜 말을 만나면',
    objective: '기분 나쁜 말을 만났을 때 대처하는 방법을 말할 수 있다.',
    standards: ['[9정통03-01] 디지털 공간에서 올바른 예절을 익혀 실천한다.'],
    bodyEasy: '기분 나쁜 말을 보면 어른에게 알려요. 내 잘못이 아니에요.',
    bodyNormal:
      '인터넷에서 기분 나쁜 말이나 무서운 것을 보면, 바로 화면을 닫고 어른에게 알려요. 그건 내 잘못이 아니에요.',
    wrapUpEasy: '기분 나쁜 말을 보면 닫고, 어른에게 알려요.',
    wrapUpNormal: '기분 나쁜 말이나 무서운 것을 보면 화면을 닫고 어른에게 알려요. 절대 내 잘못이 아니에요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['유해 콘텐츠', '신고'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI가 이상한 말을 하면 어떻게 하는지 봐요.',
          userInput: '(AI가 이상한 답을 했어요)',
          aiResponse: '이럴 땐 이렇게 해요: ① 그만 보기 ② 선생님이나 부모님께 "이상한 말이 나왔어요" 하고 알리기. 잘했어요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '기분 나쁜 말을 봤어요. 첫 번째로 할 일은요?',
          choices: [
            { label: '화면을 닫고 어른에게 알려요', isCorrect: true },
            { label: '나도 나쁜 말로 대답해요', isCorrect: false },
            { label: '혼자 끙끙 앓아요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '나쁜 말을 본 건 내 잘못일까요?',
              answer: 'X',
              feedback: '절대 내 잘못이 아니에요. 알린 게 잘한 거예요!',
            },
            {
              question: '나쁜 말에는 나쁜 말로 되갚아야 할까요?',
              answer: 'X',
              feedback: '나쁜 말로 대답하면 나도 힘들어져요. 어른에게 알려요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm4-l7',
    moduleId: 'm4',
    number: 7,
    kind: 'activity',
    title: '고운 말로 물어봐요',
    objective: 'AI와 사람에게 고운 말을 사용할 수 있다.',
    standards: [
      '[6국어01-05] 바르고 고운 말을 사용하여 대화한다.',
      '[9정통03-01] 디지털 공간에서 올바른 예절을 익혀 실천한다.',
    ],
    bodyEasy: 'AI한테도 고운 말을 써요. 고운 말이 좋은 답을 데려와요.',
    bodyNormal:
      'AI한테도 사람한테 하듯 고운 말을 써요. 고운 말을 쓰는 습관이 어디서든 나를 멋진 사람으로 만들어요.',
    wrapUpEasy: 'AI한테도 고운 말을 써요.',
    wrapUpNormal: 'AI한테도 고운 말을 쓰는 습관을 길러요. 고운 말 습관은 사람에게도 그대로 나와요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['예절'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '어느 쪽이 고운 말일까요?',
          choices: [
            { label: '"동물 이야기 하나 들려줄래?"', isCorrect: true },
            { label: '"야! 빨리 내놔!"', isCorrect: false },
            { label: '"바보야 알려줘"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '부탁할 때', right: '"~해줄래?" / "~해줘"' },
            { left: '고마울 때', right: '"고마워!"' },
            { left: '틀렸을 때', right: '"다시 알려줄래?"' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 기계니까 나쁜 말을 해도 괜찮을까요?',
              answer: 'X',
              feedback: '나쁜 말 습관은 사람에게도 나와요. 고운 말을 써요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm4-l8',
    moduleId: 'm4',
    number: 8,
    kind: 'concept',
    title: '너무 오래 쓰지 않아요',
    objective: '스마트폰과 AI를 정해진 시간만큼만 사용하는 습관을 말할 수 있다.',
    standards: ['[12정통03-02] 디지털 중독 및 디지털 범죄 사례를 살펴보고, 예방하는 방법을 실천한다.'],
    bodyEasy: '스마트폰은 약속한 시간만큼만 써요.',
    bodyNormal:
      '스마트폰이나 AI를 너무 오래 쓰면 눈도 아프고 잠도 안 와요. 시간을 정해놓고 쓰는 게 좋아요.',
    wrapUpEasy: '약속한 시간만큼만 쓰고, 다른 놀이도 해요.',
    wrapUpNormal: '스마트폰은 시간을 정해서 쓰고, 끝나면 몸을 움직이는 놀이도 해요. 그래야 몸도 마음도 건강해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['스마트폰', '과의존'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '스마트폰을 밤새 계속 봐도 괜찮을까요?',
              answer: 'X',
              feedback: '눈도 아프고 잠도 못 자요. 시간을 정해서 써요.',
            },
            {
              question: '시간을 정해놓고 쓰면 더 건강하게 쓸 수 있을까요?',
              answer: 'O',
              feedback: '맞아요! 약속 시간을 지키는 게 멋진 거예요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '스마트폰 시간이 끝났어요. 어떻게 할까요?',
          choices: [
            { label: '끄고 다른 놀이를 해요', isCorrect: true },
            { label: '몰래 계속 봐요', isCorrect: false },
            { label: '5분만 더, 5분만 더 계속해요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '건강하게 쓰는 순서대로 눌러봐요.',
          items: [
            { label: '쓰기 전에 시간을 약속해요' },
            { label: '약속한 시간만큼 써요' },
            { label: '시간이 되면 스스로 꺼요' },
            { label: '몸을 움직이는 다른 놀이를 해요' },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm4-l9',
    moduleId: 'm4',
    number: 9,
    kind: 'activity',
    title: '이상하면 어른에게 알려요',
    objective: '이상하거나 무서운 일이 생기면 즉시 어른에게 알릴 수 있다.',
    standards: ['[12정통03-02] 디지털 중독 및 디지털 범죄 사례를 살펴보고, 예방하는 방법을 실천한다.'],
    bodyEasy: '이상한 일이 생기면 바로 어른에게 말해요.',
    bodyNormal:
      '모르는 사람이 말을 걸거나, 이상한 선물을 준다고 하거나, 무서운 게 나오면 바로 어른에게 알려요.',
    wrapUpEasy: '이상하면 바로 어른에게 알려요. 알리는 게 용감한 거예요.',
    wrapUpNormal: '이상한 일은 혼자 해결하지 않아요. 어른에게 알리는 것이 가장 용감하고 똑똑한 방법이에요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['도움 요청'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '모르는 사람이 이상한 말을 걸어온 상황이에요.',
          userInput: '(모르는 사람) 공짜 게임 아이템 줄게. 만날래?',
          aiResponse: '이건 위험한 말이에요! 답하지 말고 바로 부모님이나 선생님께 보여드려요. "모르는 사람이 만나재요" 하고요.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '모르는 사람이 "만나자"고 해요. 어떻게 할까요?',
          choices: [
            { label: '답하지 않고 어른에게 바로 알려요', isCorrect: true },
            { label: '공짜라니까 나가봐요', isCorrect: false },
            { label: '비밀로 해요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '어른에게 알리는 건 고자질일까요?',
              answer: 'X',
              feedback: '아니에요! 나를 지키는 용감한 행동이에요.',
            },
            {
              question: '이상한 일은 혼자 해결하는 게 좋을까요?',
              answer: 'X',
              feedback: '혼자 하지 말고 꼭 어른과 함께 해결해요.',
            },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm4-l10',
    moduleId: 'm4',
    number: 10,
    kind: 'concept',
    title: '광고와 진짜를 구별해요',
    objective: '광고와 일반 정보를 구별할 수 있다.',
    standards: ['[9정통01-01] 정보통신의 의미를 이해하고, 다양한 형태와 방법으로 제공되는 정보를 살펴본다.'],
    bodyEasy: '"공짜!" "최고!" 하는 광고를 조심해요.',
    bodyNormal:
      '인터넷에는 물건을 팔려고 만든 광고가 많아요. "공짜", "100% 최고" 같은 말은 한 번 더 의심해봐요.',
    wrapUpEasy: '"공짜", "최고"라는 말은 한 번 더 생각해요.',
    wrapUpNormal: '광고는 물건을 팔기 위한 글이에요. "공짜", "100%" 같은 말은 그대로 믿지 말고 어른과 확인해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['광고', '추천 알고리즘'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"100% 공짜!"라는 말은 다 진짜일까요?',
              answer: 'X',
              feedback: '공짜라면서 나중에 돈을 달라고 할 수 있어요.',
            },
            {
              question: '광고는 물건을 팔려고 만든 것일까요?',
              answer: 'O',
              feedback: '맞아요! 그래서 좋은 말만 써 있어요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '광고에서 자주 보이는 말은 어느 것일까요?',
          choices: [
            { label: '"지금 당장! 100% 공짜!"', isCorrect: true },
            { label: '"오늘 날씨는 맑아요"', isCorrect: false },
            { label: '"내일은 학교 가는 날"', isCorrect: false },
          ],
        },
      },
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm4-l11',
    moduleId: 'm4',
    number: 11,
    kind: 'concept',
    title: '우리의 안전 약속 (마무리)',
    objective: '단원 4에서 배운 안전 수칙을 정리하여 말할 수 있다.',
    standards: ['[12정통03-01] 디지털 윤리를 이해하고, 디지털 공간에서 타인을 존중하고 배려하는 태도를 기른다.'],
    bodyEasy: '배운 안전 약속을 확인해봐요.',
    bodyNormal:
      '단원 4에서 배운 안전 약속 — 확인하기, 개인정보 지키기, 고운 말, 시간 지키기, 어른에게 알리기 — 를 확인해봐요.',
    wrapUpEasy: '단원 4를 다 배웠어요! 안전 약속을 지켜요.',
    wrapUpNormal: '단원 4를 마쳤어요! 확인하기, 개인정보 지키기, 고운 말 쓰기, 시간 지키기, 어른에게 알리기 — 다섯 가지 안전 약속을 기억해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['개인정보', '환각', '신고', '비밀번호'] } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: 'AI가 틀린 답을 주면', right: '선생님이나 책으로 확인해요' },
            { left: '누가 주소를 물으면', right: '알려주지 않아요' },
            { left: '기분 나쁜 말을 보면', right: '닫고 어른에게 알려요' },
            { left: '쓰는 시간이 끝나면', right: '끄고 다른 놀이를 해요' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI 답은 무조건 다 믿어도 될까요?',
              answer: 'X',
              feedback: 'AI도 틀려요. 중요한 건 확인해요.',
            },
            {
              question: '비밀번호는 친한 친구한테는 알려줘도 될까요?',
              answer: 'X',
              feedback: '비밀번호는 누구에게도 비밀이에요.',
            },
            {
              question: '이상한 일이 생기면 어른에게 알리는 게 좋을까요?',
              answer: 'O',
              feedback: '맞아요! 그게 가장 용감한 행동이에요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '우리의 안전 약속으로 가장 알맞은 것은요?',
          choices: [
            { label: '확인하고, 지키고, 알려요', isCorrect: true },
            { label: '다 믿고, 다 말해요', isCorrect: false },
            { label: '혼자 몰래 해결해요', isCorrect: false },
          ],
        },
      },
    ],
  },
];
