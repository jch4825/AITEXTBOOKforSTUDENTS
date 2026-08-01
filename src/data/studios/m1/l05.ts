import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';

export const M1_L5_STUDIO: StudioDefinition = {
    id: 'm1-speech-recognition-lab',
    lessonId: 'm1-l5',
    moduleId: 'm1',
    title: 'AI의 귀 실험실',
    subtitle: '소리가 글자로 바뀌는 과정을 살펴보고 나에게 맞는 입력 방법을 골라봐요.',
    format: 'C',
    decisionTitle: '아이미와 소음 조건과 입력 방법을 직접 실험해봐요.',
    suggestedQuestions: [
      '시끄러운 곳에서 말하면 글자가 왜 다르게 적혀?',
      '마이크를 입에 가까이 대고 말하면 더 정확해져?',
      '소음이 심할 때는 글자나 그림 카드로 입력하는 게 더 좋을까?',
    ],
    visualNovel: {
      title: '복도 방송이 다르게 적혔어요',
      objective: '시끄러운 곳에서 아이미가 잘못 받아 적은 말을, 조건을 바꾸거나 다른 입력 방법을 골라 바르게 전해요.',
      seasonTag: '[아이미가 왔다 · 5화] 채소회 오이 사건',
      nextEpisodeHook: '다음 시간 — 세모만 아는 분류기가 온대요.',
      scenes: [
        {
          id: 'noisy-announcement',
          label: '장면 1 · 시끄러운 복도',
          imageSrc: '/lessons/story/m1/m1-l5-scene-01.webp',
          alt: '진우가 시끄러운 복도에서 체험회에 놀러 오라고 외치는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우: "체험회에 놀러 오세요!"',
            '진우: "체험회에 놀러 오세요!" 복도는 친구들 소리로 가득했습니다.',
            '진우: "체험회에 놀러 오세요!" 여러 소리가 겹치는 복도에서 아이미가 음성 인식 기능으로 기록하고 있었습니다.',
            '음성 인식 AI는 마이크로 들어온 소리를 글자로 바꾸어요.',
          ),
        },
        {
          id: 'wrong-transcript',
          label: '장면 2 · 달라진 글자',
          imageSrc: '/lessons/story/m1/m1-l5-scene-02.webp',
          alt: '화면에 채소회 오이 사세요라고 적힌 것을 보고 놀라는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아: "화면에 이상한 글자가 적혔는데?"',
            '윤아: "잠깐, 화면에 \'채소회 오이 사세요!\'라고 적혔는데?" 아이미: "제 귀에는 분명 그렇게 들렸어요!"',
            '윤아: "잠깐, 화면에 \'채소회 오이 사세요!\'라고 적혔는데?" 아이미: "제 귀에는 분명 그렇게 들렸어요!" 진우가 오이를 사러 가려는 듯 두리번거렸습니다.',
            'AI가 만든 글은 들은 소리와 다를 수 있으므로 원래 정보와 비교해야 해요.',
          ),
        },
        {
          id: 'change-listening-condition',
          label: '장면 3 · 듣는 조건 바꾸기',
          imageSrc: '/lessons/story/m1/m1-l5-scene-03.webp',
          alt: '윤아의 확인 질문으로 소음 마이크 거리 속도를 하나씩 바꿔 보는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "조용한 곳에서 다시 해 보면?"',
            '윤아: "조용한 곳에서, 마이크를 가까이, 천천히 다시 말해 보면 어떨까?" 하나씩 바꾸며 시험해 보기로 했습니다.',
            '윤아: "조용한 곳에서, 마이크를 가까이, 천천히 다시 말해 보면 어떨까?" 소음, 거리, 속도를 하나씩 바꾸며 결과가 달라지는지 시험해 보기로 했습니다.',
            '조건을 하나씩 바꾸면 어떤 조건이 결과에 영향을 주었는지 찾기 쉬워요.',
          ),
        },
        {
          id: 'choose-input-method',
          label: '장면 4 · 어떤 방법으로 전할까?',
          imageSrc: '/lessons/story/m1/m1-l5-scene-04.webp',
          alt: '윤아가 여러 입력 방법 중 무엇을 고를지 학생에게 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "너라면 어떤 방법을 쓰겠어?"',
            '윤아: "방법이 여러 가지네. 너라면 어떤 방법으로 안내를 바르게 전하겠어?"',
            '윤아: "방법이 여러 가지네. 너라면 어떤 방법으로 안내를 바르게 전하겠어? 말, 글자, 그림 중에서 말이야."',
            '좋은 입력 방법은 사람과 상황에 따라 달라질 수 있어요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '소리를 글자로 바꾸어요',
          core: '음성 인식 AI는 마이크로 들어온 소리의 특징을 찾아 글자로 바꿉니다.',
          detail: {
            full: '말소리를 듣고 글자로 적어요.',
            light: 'AI는 들어온 소리를 작은 특징으로 나누어 가장 비슷한 글자를 찾습니다.',
            challenge: '음성 인식 AI는 입력된 음향 특징을 학습한 말소리 자료와 비교해 가능성이 높은 글자 배열을 만듭니다.',
          },
          flow: { input: '마이크로 들어온 소리', process: '소리 특징 비교', output: '변환된 글자' },
        },
        {
          title: '듣는 조건이 결과를 바꾸어요',
          core: '소음, 거리, 말하는 속도가 달라지면 변환 결과도 달라질 수 있습니다.',
          detail: {
            full: '주변이 시끄러우면 다르게 들을 수 있어요.',
            light: '여러 소리가 겹치거나 마이크가 멀면 말소리 특징을 찾기 어려워집니다.',
            challenge: '입력 신호의 선명도와 학습 자료의 범위는 음성 인식 결과의 정확성에 영향을 줍니다.',
          },
        },
        {
          title: '입력 방법은 선택할 수 있어요',
          core: '음성 입력이 불편하거나 부정확할 때는 글자, 그림, 다시 듣기 같은 방법을 선택할 수 있습니다.',
          detail: {
            full: '말하기 말고 다른 방법도 골라요.',
            light: '정확하고 편안하게 뜻을 전할 수 있는 방법을 상황에 맞게 고릅니다.',
            challenge: '접근 가능한 입력 방법을 함께 제공하면 사용자가 자신의 표현 방식과 환경에 맞게 참여할 수 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '체험회가 채소회 오이로 적혔어요',
      description: '시끄러운 복도에서 진우가 "체험회에 놀러 오세요!"라고 외쳤더니 아이미의 음성 인식 화면에 <채소회 오이 사세요!>라고 적혔습니다!',
      facts: [
        '시끄러운 복도 소음 때문에 말소리가 뭉개졌습니다.',
        '원래 말한 문장은 "체험회에 놀러 오세요!"입니다.',
        '아이미 화면에는 "채소회 오이 사세요!"라고 적혔습니다.',
      ],
      stimuli: [
        {
          id: 'm1-l5-noisy-announcement',
          kind: 'image',
          src: '/lessons/story/m1/m1-l5-scene-01.webp',
          alt: '진우가 시끄러운 복도에서 학교 방송을 듣는 모습',
          caption: '시끄러운 복도에서의 음성 인식 (채소회 오이)',
        },
      ],
    },
    firstAttempt: {
      prompt: '원래 말한 문장과 다르게 인공지능이 글자를 썼을 때 무엇을 먼저 하겠습니까?',
      choices: [
        { id: 'listen-again', emoji: '🔁', label: '조용한 곳에서 원래 목소리를 다시 들려주거나 글자로 직접 입력합니다.', isCorrect: true, reaction: '아이미: "이제 또렷하게 들려요. \'체험회에 놀러 오세요!\' 맞지요?"' },
        { id: 'choose-another-input', emoji: '📊', label: '마이크 거리, 배경 소음, 그림 카드 등 입력 방법의 조건을 비교합니다.', isCorrect: true, reaction: '윤아: "조건을 바꾸니 결과가 달라지네."' },
        { id: 'trust-transcript', emoji: '📜', label: '화면의 “채소회 오이” 글자를 확인 없이 믿습니다.', isCorrect: false, reaction: '오이를 사러 가려던 진우를 윤아가 붙잡았습니다. "잠깐, 그거 잘못 적힌 거야!"' },
        { id: 'shout-loudly', emoji: '🗣️', label: '소음 환경을 개선하지 않고 무작정 소리만 크게 지릅니다.', isCorrect: false, reaction: '더 크게 외치자 화면에는 더 이상한 글자가 나타났습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그 방법이 진우와 윤아에게 어떤 도움을 줄까요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '조용한 교실에서 마이크를 가까이 대고 말하거나 텍스트 및 그림 카드로 입력하자 정확한 글자가 나왔습니다.',
      facts: [
        '복도 소음이 사라지면 소리 특징을 더 선명하게 찾을 수 있습니다.',
        '마이크와의 거리가 가까워지면 소음의 영향이 줄어듭니다.',
        '글자나 그림 카드 보조공학 입력은 소음 환경에서도 정확하게 뜻을 전달합니다.',
        '나에게 편하고 정확한 입력 방법을 상황에 맞게 고를 수 있습니다.',
      ],
      stimuli: [
        {
          id: 'm1-l5-change-listening-condition',
          kind: 'image',
          src: '/lessons/story/m1/m1-l5-scene-03.webp',
          alt: '진우가 조용한 곳과 가까운 거리에서 음성 인식을 다시 시험하는 모습',
          caption: '듣는 조건 바꾸기 (조용한 곳, 가까운 거리)',
        },
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 입력 방법 제안',
      text: '조용한 곳에서 다시 말하면 음성 인식이 더 잘될 수 있어요. 하지만 꼭 말로 입력하지 않아도 돼요. 글자나 그림으로 뜻을 전한 뒤 원래 방송과 비교해도 좋아요.',
      question: '아이미의 제안 중 진우에게 맞는 방법은 무엇일까요?',
    },
    artifact: {
      kind: 'choice-board',
      title: '나에게 편한 입력 방법 카드',
      prompt: '상황, 내가 고른 입력 방법, 편한 점, 결과를 확인할 방법을 한 장에 정리해 봐요.',
    },
    transfer: {
      title: '체육관 안내가 잘 들리지 않는다면',
      description: '넓은 체육관에서 다음 활동 장소를 알려 주는 음성 안내가 화면에 다르게 적혔습니다.',
      prompt: '나만의 표현으로 주변이 시끄러울 때 음성 인식 결과를 어떻게 확인할지 설명해보자.',
      stimuli: [
        {
          id: 'm1-l5-gym-announcement',
          kind: 'image',
          src: '/lessons/story/m1/m1-l5-scene-05.jpg',
          alt: '체육관 스피커 소리를 듣고 아이미가 혼란스러워하는 장면',
          caption: '체육관 스피커 소리와 아이미의 음성 인식 (잘못된 적힘)',
        },
      ],
      choices: [
        { id: 'replay-gym-audio', emoji: '🎧', label: '안내 방송을 조용한 곳에서 다시 듣고 장소 표지와 비교합니다.', isCorrect: true, reaction: '다시 들으니 정확한 장소를 확인할 수 있었습니다.' },
        { id: 'use-accessible-option', emoji: '♿', label: '타자 입력, 그림 안내판, 또는 선생님의 도움을 요청합니다.', isCorrect: true, reaction: '그림 안내판으로도 장소를 정확히 알 수 있었습니다.' },
        { id: 'follow-gym-text', emoji: '🚶', label: '시끄러운 소음 속에서 잘못 인식된 글자만 믿고 바로 이동합니다.', isCorrect: false, reaction: '엉뚱한 장소로 갔다가 되돌아와야 했습니다.' },
        { id: 'ignore-noise-condition', emoji: '📢', label: '소음 조건이 바뀌어도 음성 인식 결과는 무조건 정확하다고 봅니다.', isCorrect: false, reaction: '시끄러운 체육관에서도 똑같이 잘못 적히는 일이 생겼습니다.' },
      ],
    },
    safetyNote: '실제 학생의 목소리를 저장하지 않고 수업용 음성만 사용합니다.',
  };
