import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';

export const M1_L1_STUDIO: StudioDefinition = {
    id: 'm1-aimi-introduction',
    lessonId: 'm1-l1',
    moduleId: 'm1',
    title: '아이미와 처음 만난 날',
    subtitle: 'AI(인공지능)의 뜻과 할 수 있는 일을 찾아봐요.',
    format: 'A',
    decisionTitle: '아이미에게 쉽게 물어봐요.',
    suggestedQuestions: [
      'AI는 어떤 일들을 할 수 있니?',
      'AI와 일반 프로그램은 어떻게 달라?',
      '번역기 앱도 AI 기능이야?',
    ],
    visualNovel: {
      title: '아이미의 어려운 자기소개',
      objective: '어려운 말로 인사한 아이미 대신, AI(인공지능)의 뜻과 AI가 돕는 일 두 가지를 내 말로 소개해요.',
      celebrateFinalScene: true,
      seasonTag: '[아이미가 왔다 · 1화] 어려운 자기소개',
      nextEpisodeHook: '다음 시간 — 아이미도 선풍기 같은 기계일까요?',
      scenes: [
        {
          id: 'club-room',
          label: '장면 1 · 첫 만남',
          imageSrc: '/lessons/story/m1/m1-l1-scene-01.webp',
          alt: 'AI 동아리방에서 진우가 아이미를 처음 만나는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '방과 후 AI 동아리방에 새 도구가 왔어요. 문이 열렸습니다. 아이미: "반갑습니다!"',
            '방과 후 AI 동아리방에 새 도구가 오는 날입니다. 문이 열렸습니다. 아이미: "반갑습니다! 저는 연산 엔진 알고리즘 도구입니다!"',
            '방과 후 AI 동아리방에 새 도구가 오는 날이었습니다. 문이 열리고 신형 로봇 아이미가 등장했습니다. 아이미: "반갑습니다! 저는 연산 엔진과 알고리즘이 결합된 인공지능입니다!"',
            '새로운 도구를 만나면 무엇을 도와주는지 궁금할 수 있어요.',
          ),
        },
        {
          id: 'difficult-introduction',
          label: '장면 2 · 어려운 설명',
          imageSrc: '/lessons/story/m1/m1-l1-scene-02.webp',
          alt: '아이미의 어려운 설명을 듣고 진우가 곤란해하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미의 설명에는 어려운 말이 많았어요. 진우: "하나도 못 알아들었어!"',
            '아이미의 설명에는 어려운 말이 많았어요. 진우: "아이미야, 방금 그 말… 나 하나도 못 알아들었어!"',
            '아이미의 설명에는 어려운 말이 많았어요. 낯선 기술 용어가 쏟아지자 진우의 눈이 커졌습니다. 진우: "방금 그 말… 나 하나도 못 알아들었어! 쉽게 말해 줄 수 있어?"',
            '설명이 어려우면 아는 말과 모르는 말을 나누어 볼 수 있어요.',
          ),
        },
        {
          id: 'daily-examples',
          label: '장면 3 · 생활 속 사례',
          imageSrc: '/lessons/story/m1/m1-l1-scene-03.webp',
          alt: '민준 선생님과 생활 속 AI 기능을 살펴보는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '민준 선생님과 생활 속 AI를 찾아봤어요. 윤아: "번역 앱, 음악 추천, 사진 찾기의 공통점은?"',
            '민준 선생님과 생활 속 AI를 찾아보았습니다. 윤아: "번역 앱이랑 음악 추천이랑 사진 찾기… 이것들의 공통점이 뭘까?"',
            '민준 선생님과 생활 속 AI 기능을 하나씩 살펴보았습니다. 윤아: "번역 앱이랑 음악 추천이랑 사진 찾기… 이것들의 공통점이 뭘까?"',
            '사례를 살펴보면 AI가 할 수 있는 일의 공통점을 찾을 수 있어요.',
          ),
        },
        {
          id: 'my-definition',
          label: '장면 4 · 너의 소개는?',
          imageSrc: '/lessons/story/m1/m1-l1-scene-04.webp',
          alt: '진우가 아이미를 소개할 AI 정의 카드를 앞에 두고 고민하는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '진우가 빈 카드를 들고 고민했어요. 아이미: "저를 친구에게 뭐라고 소개하실 건가요?"',
            '진우가 빈 카드를 손에 든 채 생각에 잠겼습니다. 아이미: "여러분이라면 저를 친구에게 뭐라고 소개하실 건가요?"',
            '진우는 빈 카드를 손에 든 채 무엇부터 적을지 고민했습니다. 아이미: "여러분이라면 저를 친구에게 뭐라고 소개하실 건가요? 제가 하는 일도 함께요."',
            '내가 이해한 말로 다시 설명해 보면 배운 내용을 확인할 수 있어요.',
          ),
        },
      ],
      knowledge: [
        {
          title: 'AI(인공지능)의 뜻',
          core: 'AI(인공지능)는 사람처럼 학습하고 판단하여 여러 가지 문제 해결을 도와주는 기술이나 프로그램입니다.',
          detail: {
            full: 'AI(인공지능)는 사람처럼 생각하고 배워서 여러 가지 일을 도와주는 프로그램이에요.',
            light: 'AI(인공지능)는 컴퓨터가 사람처럼 학습하고 판단하여, 우리가 필요한 번역·추천·분류 같은 일을 도와주는 기술입니다.',
            challenge: '인공지능(AI)은 사람의 생각하는 방식을 비슷하게 만들어 내어, 데이터 학습과 판단으로 다양한 문제 해결과 의사결정을 지원하는 기술을 뜻합니다.',
          },
        },
        {
          title: 'AI가 할 수 있는 일',
          core: 'AI는 말, 글, 사진 같은 입력을 받아 여러 가지 일을 할 수 있습니다.',
          detail: {
            full: '번역하기, 음악 추천하기, 사진 속 물건 찾기 등을 도와줘요.',
            light: '어떤 입력을 받았는지에 따라 AI가 도와줄 수 있는 결과가 달라집니다.',
            challenge: '입력의 종류와 상태는 AI가 참고할 수 있는 정보의 범위를 결정합니다.',
          },
          flow: { input: '말·글·사진', process: '자료에서 규칙 찾기', output: '번역·추천·분류' },
        },
        {
          title: 'AI가 할 수 있는 여러 가지 일',
          core: 'AI는 번역, 음악 추천, 사진 찾기 등 사람이 정한 다양한 목적을 도와줍니다.',
          detail: {
            full: '번역하기, 음악 추천, 사진 찾기처럼 다양한 일을 도와줘요.',
            light: '어떤 입력을 주느냐에 따라 AI가 도와줄 수 있는 기능과 결과가 달라집니다.',
            challenge: '넣는 정보의 종류와 모양에 따라 AI 도구가 할 수 있는 일이 달라집니다.',
          },
        },
      ],
    },
    encounter: {
      title: '아이미의 어려운 자기소개',
      description: '로봇 아이미가 어려운 기술 용어로 인사했습니다. 윤아와 함께 AI(인공지능)가 컴퓨터가 사람처럼 학습하고 판단하여 문제 해결을 돕는 기술임을 알고, 번역·추천·분류처럼 AI가 할 수 있는 일을 찾아봅시다.',
      facts: [
        'AI(인공지능)는 컴퓨터가 사람처럼 학습하고 판단하여 문제 해결을 돕는 기술입니다.',
        'AI는 말, 글, 사진 같은 입력을 받아 일을 처리할 수 있습니다.',
        'AI는 번역, 추천, 분류 같은 다양한 결과를 만들어 도와줍니다.',
      ],
    },
    firstAttempt: {
      prompt: '어려운 인사를 한 아이미를 만났습니다. 친구에게 AI(인공지능)의 뜻과 할 수 있는 일을 어떻게 소개해 볼까요?',
      choices: [
        { id: 'tool-with-input', emoji: '🛠️', label: '많은 자료에서 비슷한 점을 찾아 번역, 추천, 분류를 돕는 기술이라고 소개합니다.', isCorrect: true, reaction: '아이미: "네! 저는 자료에서 비슷한 점을 찾아 돕는 도구예요. 정확해요!"' },
        { id: 'magic-friend', emoji: '🪄', label: '모든 것을 알고 스스로 결정하는 마법 친구라고 소개합니다.', isCorrect: false, reaction: '아이미: "음… 저는 마법사가 아니라서 모르는 것도 많아요."' },
        { id: 'just-machine', emoji: '⚙️', label: '전기로 움직이는 기계는 모두 AI라고 소개합니다.', isCorrect: false, reaction: '윤아가 선풍기를 가리키며 고개를 갸웃했습니다. "이것도 전기로 움직이는데… AI인가?"' },
        { id: 'human-like-helper', emoji: '🤖', label: '대화를 통해 깊이 있는 생각을 이끌어내어 어려운 문제 해결을 도와주는 유용한 프로그램이라고 덧붙입니다.', isCorrect: true, reaction: '아이미: "맞아요! 저는 함께 생각을 다듬는 도구예요!"' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: 'AI(인공지능)의 뜻과 할 수 있는 일 중 꼭 말하고 싶은 내용은 무엇인가요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '번역 앱은 말을 받아 번역하고, 음악 앱은 감상 기록을 받아 노래를 추천합니다.',
      facts: [
        'AI(인공지능)는 입력받은 정보에 따라 할 수 있는 일이 달라집니다.',
        '번역, 음악 추천, 사진 속 동물 찾기는 모두 AI가 할 수 있는 일입니다.',
        '같은 AI라도 입력이 달라지면 결과가 달라질 수 있습니다.',
        'AI가 한 일의 결과는 사람이 다시 확인합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 쉬운 자기소개',
      text: '저는 사람이 만든 인공지능(AI) 도구예요! 말, 글, 사진을 받아 번역, 추천, 사진 찾기 같은 일을 도와줄 수 있어요.',
      question: '아이미의 소개를 그대로 쓸까요, 내 말에 맞게 고칠까요?',
    },
    artifact: {
      kind: 'action-card',
      title: '탐구 성찰 기록',
      prompt: '“AI(인공지능)는 …이며, …을 할 수 있는 도구예요” 문장을 내 말로 완성해 봐요.',
    },
    transfer: {
      title: '도서관에 새로운 인공지능 추천 기계가 생겼어요.',
      description: '도서관에 새로 설치된 인공지능 추천 기계는 나의 질문을 받아서 책을 추천해준다고 합니다.',
      prompt: '나만의 표현으로 도서관의 인공지능 추천 기계를 친구에게 설명해보자.',
      stimuli: [
        {
          id: 'library-ai-kiosk-image',
          kind: 'image',
          src: '/images/library_ai_kiosk.webp',
          alt: '도서관에서 인공지능 추천 기계와 대화하며 책을 추천받는 모습',
          caption: '도서관에 설치된 인공지능 책 추천 기계',
        },
      ],
      choices: [
        { id: 'describe-input-output', emoji: '🗺️', label: '질문을 입력받아 관련 책을 찾아 추천하는 인공지능(AI) 기능이라고 소개합니다.', isCorrect: true, reaction: '사서 선생님이 고개를 끄덕이셨습니다. "정확한 설명이네요."' },
        { id: 'call-all-knowing', emoji: '⭐', label: '도서관의 모든 일을 완벽하게 아는 친구라고 소개합니다.', isCorrect: false, reaction: '기계가 스스로 말했습니다. "저도 모르는 책이 많아요."' },
        { id: 'check-recommendation', emoji: '✅', label: '추천한 책이 내 목적에 맞는지는 사람이 확인한다고 덧붙입니다.', isCorrect: true, reaction: '윤아가 반겼습니다. "맞아, 확인은 사람 몫이지."' },
        { id: 'unrelated-machine', emoji: '🔌', label: '전기 스위치만 누르면 무조건 동작하는 일반 도서관 조명 기계라고 소개합니다.', isCorrect: false, reaction: '진우가 갸웃했습니다. "조명 스위치엔 질문을 못 넣잖아."' },
      ],
    },
  };
