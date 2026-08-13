import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';

export const M1_L6_STUDIO: StudioDefinition = {
    id: 'm1-training-data-lab',
    lessonId: 'm1-l6',
    moduleId: 'm1',
    title: 'AI의 배움 재료 실험실',
    subtitle: '학습 자료가 달라지면 AI의 결과가 어떻게 달라지는지 비교해 봐요.',
    format: 'B',
    decisionTitle: '아이미에게 직접 물어봐요.',
    suggestedQuestions: [
      '인공지능이 학습한 자료가 한 쪽으로 치우치면?',
      '학습 데이터에 오류가 많으면 AI 대답은 어떻게 돼?',
      'AI 편향성이 왜 위험한지 쉽게 설명해줘',
    ],
    visualNovel: {
      title: '세모만 많이 본 분류기',
      objective: '세모 카드만 잔뜩 배운 AI가 왜 자꾸 틀리는지 배움 상자를 확인하고, 자료를 골고루 바꿔 결과를 비교해요.',
      seasonTag: '[아이미가 왔다 · 6화] 세모만 아는 분류기',
      nextEpisodeHook: '다음 시간 — 10페이지 안내문을 1초 만에?',
      scenes: [
        {
          id: 'shape-training-box',
          label: '장면 1 · 모양 카드 상자',
          imageSrc: '/lessons/story/m1/m1-l6-scene-01.webp',
          alt: '진우가 분류 AI가 자꾸 틀린다며 놀라는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '동아리방에 도형 분류 AI가 왔어요. 진우: "이 AI, 동그라미도 세모래! 고장 났나 봐."',
            '동아리방에 새 도형 분류 AI가 왔습니다. 모양 카드를 넣어 보던 진우가 놀랐습니다. "이 AI, 동그라미도 세모래! 고장 났나 봐."',
            '동아리방에 새 도형 분류 AI가 왔습니다. 모양 카드를 하나씩 넣어 보던 진우가 놀랐습니다. "동그라미도 세모래! 고장 났나 봐."',
            'AI는 사람이 준비한 학습 자료에서 특징과 규칙을 찾아요.',
          ),
        },
        {
          id: 'biased-shape-result',
          label: '장면 2 · 자꾸 세모라는 답',
          imageSrc: '/lessons/story/m1/m1-l6-scene-02.webp',
          alt: '윤아가 고장인지 자료 문제인지 확인해 보자고 묻는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아: "고장일까? 뭘 보고 배웠는지부터 보자." AI는 동그라미도 네모도 세모라고 답했어요.',
            '윤아: "고장일까? 이 AI가 뭘 보고 배웠는지부터 보자." AI는 낯선 동그라미와 네모도 여러 번 세모라고 답했습니다.',
            '윤아: "고장일까? 이 AI가 뭘 보고 배웠는지부터 보자." AI는 낯선 동그라미와 네모도 여러 번 세모라고 답했습니다. 진우는 잠시 멈칫했습니다.',
            '학습 자료가 한쪽에 치우치면 결과도 한쪽으로 치우칠 수 있어요.',
          ),
        },
        {
          id: 'diverse-shape-data',
          label: '장면 3 · 배움 상자 열기',
          imageSrc: '/lessons/story/m1/m1-l6-scene-03.webp',
          alt: '상자를 열어 보니 세모 카드투성이임을 발견하는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '아이미: "배움 상자를 열어 볼까요?" 상자 속에는 세모 카드가 대부분이었어요.',
            '아이미: "상자를 열어 볼까요? 배운 카드가 여기 다 있어요." 상자 속에는 세모 카드가 대부분이었습니다.',
            '아이미: "상자를 열어 볼까요? 배운 카드가 여기 다 있어요." 상자 속에는 세모 카드가 대부분이고 동그라미와 네모는 아주 적었습니다.',
            '자료의 수뿐 아니라 종류와 조건도 함께 살펴봐야 해요.',
          ),
        },
        {
          id: 'compare-before-after',
          label: '장면 4 · 어떻게 채울까?',
          imageSrc: '/lessons/story/m1/m1-l6-scene-04.webp',
          alt: '윤아가 상자를 어떻게 다시 채울지 학생에게 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "원인은 찾았어. 그럼 배움 상자를 어떻게 다시 채워야 할까?"',
            '윤아: "원인은 찾았어. 그럼 상자를 어떻게 다시 채워야 할까?"',
            '윤아: "원인은 찾았어. 그럼 상자를 어떻게 다시 채워야 할까? 세모, 동그라미, 네모를 어떤 비율로 넣어야 할까?"',
            '자료를 바꾼 뒤에는 같은 기준으로 다시 시험해야 변화를 알 수 있어요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '학습 자료에서 규칙을 찾아요',
          core: 'AI는 사람이 준비한 예시 자료를 살펴보며 특징과 규칙을 찾습니다.',
          detail: {
            full: 'AI는 많은 예시를 보고 배워요.',
            light: '도형의 모양, 색, 크기 같은 특징을 예시와 함께 비교합니다.',
            challenge: '학습 과정에서는 입력 자료와 정답 예시의 관계를 바탕으로 새로운 입력을 구별할 규칙을 조정합니다.',
          },
          flow: { input: '이름이 붙은 도형 카드', process: '특징과 규칙 찾기', output: '새 도형의 분류 결과' },
        },
        {
          title: '자료의 다양성이 중요해요',
          core: '한 종류의 자료만 많으면 AI가 새로운 조건을 잘 구별하지 못할 수 있습니다.',
          detail: {
            full: '여러 가지 예시가 필요해요.',
            light: '모양별 수와 색, 크기, 방향이 다양해야 여러 조건을 경험할 수 있습니다.',
            challenge: '대표성이 부족하거나 불균형한 학습 자료는 특정 조건에서 반복되는 오류와 편향을 만들 수 있습니다.',
          },
        },
        {
          title: '같은 시험으로 전후를 비교해요',
          core: '자료를 바꾸기 전과 후에 같은 시험 자료를 사용하면 변화를 확인할 수 있습니다.',
          detail: {
            full: '같은 카드로 다시 시험해요.',
            light: '맞은 수만 보지 않고 어떤 조건에서 틀렸는지도 기록합니다.',
            challenge: '동일한 평가 기준과 시험 자료를 사용해야 학습 자료 변화가 결과에 미친 영향을 비교할 수 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '동그라미 과자를 찌그러진 세모라고 불렀어요',
      description: '세모 카드만 가득 배운 AI 앞에 진우가 동그란 과자를 보여주자, AI가 "찌그러진 세모입니다!"라고 엉뚱하게 답했습니다!',
      facts: [
        'AI는 세모 카드만 가득 학습했습니다.',
        '새로 보여준 동그란 과자는 배운 적이 거의 없는 모양입니다.',
        'AI는 세모 자료만 배워서 낯선 모양도 가장 익숙한 세모로 오판했습니다.',
      ],
    },
    firstAttempt: {
      prompt: 'AI가 동그라미 과자를 찌그러진 세모라고 틀리게 부른 까닭을 어떻게 알아보겠습니까?',
      choices: [
        { id: 'inspect-data', emoji: '📦', label: 'AI가 이전에 어떤 모양 자료를 배워 왔는지 학습 데이터를 조사합니다.', isCorrect: true, reaction: '아이미: "상자를 열어 볼까요? 배운 카드가 여기 다 있어요."' },
        { id: 'balance-various-shapes', emoji: '📊', label: '세모, 동그라미, 네모 등 배움 재료의 비율과 다양성을 확인합니다.', isCorrect: true, reaction: '윤아가 카드 수를 세어 보니 치우침이 뚜렷했습니다.' },
        { id: 'blame-random', emoji: '🎲', label: '자료 조사 없이 AI의 기분이 나빠서 틀렸다고 생각합니다.', isCorrect: false, reaction: '아이미: "저는 기분이 없어요. 배운 자료가 전부예요."' },
        { id: 'change-test-only', emoji: '🧪', label: '자료 보완 없이 동그라미 과자를 치우고 세모 카드만 보여줍니다.', isCorrect: false, reaction: '문제는 그대로 남아 다음에도 같은 실수가 반복됐습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그 방법으로 무엇을 확인할 수 있을까요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '모양별 수를 맞추고 색, 크기, 방향이 다양한 카드를 더한 뒤 같은 시험을 다시 진행했습니다.',
      facts: [
        '세모, 동그라미, 네모 카드의 수가 비슷해졌습니다.',
        '각 모양에 여러 색과 크기의 카드가 포함되었습니다.',
        '같은 시험 카드를 사용해 바꾸기 전과 후를 비교했습니다.',
        '결과는 좋아졌지만 아주 작거나 겹친 도형에서는 실수가 남았습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 자료 점검 의견',
      text: '처음 자료에는 세모와 비슷한 카드가 너무 많았어요. 여러 모양과 조건을 골고루 넣으니 결과가 좋아졌지만, 아직 틀리는 조건도 따로 모아 살펴봐야 해요.',
      question: '자료가 좋아졌다는 말만 믿을까요, 전후 결과표에서 근거를 확인할까요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '학습 자료 전후 결과표',
      prompt: '자료의 구성, 같은 시험의 결과, 좋아진 점, 아직 틀리는 조건을 전후로 비교해 봐요.',
    },
    transfer: {
      title: '분리배출 모양을 배우는 AI라면',
      description: '원형 표시만 많이 배운 AI가 네모난 재활용 표지를 일반 쓰레기로 분류했습니다.',
      prompt: '나만의 표현으로 부족한 학습 자료를 바르게 보완하는 방법을 설명해보자.',
      choices: [
        { id: 'balance-recycle-data', emoji: '📚', label: '동그라미, 네모 등 다양한 모양과 재질의 표지 자료를 고르게 추가합니다.', isCorrect: true, reaction: '자료를 보완하자 네모 표지도 잘 구별했습니다.' },
        { id: 'compare-recycle-test', emoji: '🔍', label: '자료를 보완한 뒤 같은 시험용 자료로 판정 결과를 전후 비교합니다.', isCorrect: true, reaction: '같은 시험으로 비교하니 나아진 점이 분명히 보였습니다.' },
        { id: 'accept-recycle-result', emoji: '🏷️', label: '학습 자료가 한쪽으로 치우쳐 나타난 오판 결과를 그대로 받아들입니다.', isCorrect: false, reaction: '네모 표지가 계속 일반 쓰레기로 잘못 분류됐습니다.' },
        { id: 'stop-data-learning', emoji: '🚫', label: '자료를 더 모으지 않고 처음의 잘못된 기준을 그대로 둡니다.', isCorrect: false, reaction: '치우친 결과가 그대로 남았습니다.' },
      ],
    },
  };
