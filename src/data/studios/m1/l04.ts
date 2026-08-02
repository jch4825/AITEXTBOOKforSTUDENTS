import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';

export const M1_L4_STUDIO: StudioDefinition = {
    id: 'm1-image-recognition-lab',
    lessonId: 'm1-l4',
    moduleId: 'm1',
    title: 'AI의 눈 실험실',
    subtitle: '사진 조건을 바꾸어 AI의 답이 달라지는지 살펴보고 원본과 다시 비교해 봐요.',
    format: 'B',
    decisionTitle: '아이미와 직접 실험해봐요.',
    suggestedQuestions: [
      '이 사진은 뭘 찍은 거지?',
      '사진 속 물체를 인공지능이 어떻게 알아봐?',
      '이미지 인식은 어떻게 작동해?',
    ],
    visualNovel: {
      title: '가려진 여우 사진',
      objective: '사진의 가림·밝기를 바꾸며 아이미의 답이 달라지는 모습을 실험하고, 답이 달라진 까닭을 골라요.',
      seasonTag: '[아이미가 왔다 · 4화] 사진 속 동물 맞히기',
      nextEpisodeHook: '다음 시간 — 체험회 안내가 이상하게 적혔대요.',
      scenes: [
        {
          id: 'covered-fox',
          label: '장면 1 · 가려진 사진',
          imageSrc: '/lessons/story/m1/m1-l4-scene-01.webp',
          alt: '얼굴 일부가 가려진 여우 사진을 윤아가 살펴보는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '동아리방에서 아이미의 눈을 시험했어요. 윤아: "이 사진 속 동물이 뭐게? 조금 가려져 있어."',
            '동아리방에서 아이미의 눈을 시험해 보기로 했습니다. 윤아: "아이미야, 이 사진 속 동물이 뭐게? 조금 가려져 있긴 해."',
            '동아리방에서 아이미의 사진 인식을 시험해 보기로 했습니다. 윤아: "이 사진 속 동물이 뭐게? 조금 가려져 있긴 해." 귀와 얼굴 일부만 보이는 사진이었습니다.',
            '가려진 사진은 사람과 AI 모두 판단하기 어려울 수 있어요.',
          ),
        },
        {
          id: 'first-answer',
          label: '장면 2 · 첫 번째 답',
          imageSrc: '/lessons/story/m1/m1-l4-scene-02.webp',
          alt: '아이미가 가려진 여우 사진을 고양이라고 답하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미: "간단해요! 귀 모양을 보니 고양이입니다!" 아주 자신 있는 말투였어요.',
            '아이미: "간단해요! 귀 모양을 보니 고양이입니다. 확률 87%!" 자신 있는 말투였습니다.',
            '아이미: "간단해요! 귀 모양을 보니 고양이입니다. 확률 87%!" 가려진 부분은 보지 못한 채 자신 있게 답했습니다.',
            'AI의 첫 답은 정답이 아니라 확인할 결과예요.',
          ),
        },
        {
          id: 'change-conditions',
          label: '장면 3 · 조건 바꾸기',
          imageSrc: '/lessons/story/m1/m1-l4-scene-03.webp',
          alt: '윤아가 사진의 가림, 밝기, 각도를 바꾸어 다시 시험하는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '진우: "틀렸네!" 윤아: "가린 걸 줄이고 다시 보여 주면?" 아이미: "여우입니다!"',
            '진우: "틀렸네!" 윤아: "잠깐, 가린 걸 줄이고 다시 보여 주면?" 다시 보여 주자 아이미가 "여우입니다!"라고 답을 바꿨습니다.',
            '진우가 "틀렸네!"라고 하려 하자 윤아가 멈췄습니다. "가린 걸 줄이고 다시 보여 주면 어떻게 될까?" 다시 보여 주자 아이미는 "여우입니다!"라고 답을 바꿨습니다.',
            '조건을 하나씩 바꾸면 무엇이 결과에 영향을 주었는지 찾기 쉬워요.',
          ),
        },
        {
          id: 'reveal-original',
          label: '장면 4 · 어느 답을 믿지?',
          imageSrc: '/lessons/story/m1/m1-l4-scene-04.webp',
          alt: '고양이와 여우로 엇갈린 답 앞에서 진우가 학생에게 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '진우: "고양이랬다가 여우랬다가… 어느 답을 믿어야 해?"',
            '진우: "고양이랬다가 여우랬다가… 그럼 우리는 어느 답을 믿어야 해?"',
            '진우: "고양이랬다가 여우랬다가… 그럼 우리는 어느 답을 믿어야 해? 조건마다 다른 답이 나왔는데."',
            '결과를 판단할 때는 원본과 확인 근거가 필요해요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '보이는 특징을 찾아요',
          core: '이미지 인식 AI는 사진에서 보이는 특징을 바탕으로 결과를 고릅니다.',
          detail: {
            full: '귀, 모양, 색처럼 보이는 부분을 살펴봐요.',
            light: 'AI는 사진에서 찾은 특징과 배운 자료를 비교해 가능성이 높은 결과를 고릅니다.',
            challenge: 'AI는 입력 이미지의 특징을 학습한 자료와 비교해 가능성이 높은 분류 결과를 제시합니다.',
          },
        },
        {
          title: '조건에 따라 달라져요',
          core: '가림, 밝기, 각도가 달라지면 AI 답도 달라질 수 있습니다.',
          detail: {
            full: '사진을 바꾸면 답도 바뀔 수 있어요.',
            light: '같은 대상도 사진 조건이 달라지면 AI가 볼 수 있는 특징이 달라집니다.',
            challenge: '입력 조건은 AI가 사용할 수 있는 특징의 양과 선명도에 영향을 줍니다.',
          },
          flow: { input: '조건이 다른 사진', process: '보이는 특징 비교', output: '달라진 분류 결과' },
        },
        {
          title: '원본과 다시 비교해요',
          core: 'AI 답은 원본과 사람이 확인한 근거를 함께 살펴봅니다.',
          detail: {
            full: '처음 답만 믿지 않고 다시 봐요.',
            light: '조건을 바꾸어 다시 시험하고 마지막에는 원본을 확인합니다.',
            challenge: '조건별 결과를 기록하고 원본과 대조해 최종 판단의 근거를 남깁니다.',
          },
        },
      ],
    },
    encounter: {
      title: '가려진 여우 사진',
      description: '일부가 가려진 여우 사진을 본 아이미가 고양이라고 답했습니다. 아직 원본은 공개되지 않았습니다.',
      facts: [
        '사진에서 귀와 얼굴 일부만 보입니다.',
        '아이미의 첫 답은 고양이입니다.',
        '윤아는 사진 조건을 바꾸어 다시 시험할 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '아이미의 첫 답을 본 지금, 무엇을 먼저 하겠습니까?',
      choices: [
        { id: 'change-one-condition', emoji: '🔬', label: '사진의 가림, 밝기, 각도 등 조건을 하나씩 바꾸어 다시 시험합니다.', isCorrect: true, reaction: '아이미: "좋아요! 밝은 사진이면 저도 더 잘 볼 수 있어요."' },
        { id: 'check-original', emoji: '🖼️', label: 'AI 판정 결과와 실물 원본 사진을 꼼꼼하게 비교합니다.', isCorrect: true, reaction: '윤아가 원본 사진을 꺼내며 반겼습니다. "이걸로 비교해 보자!"' },
        { id: 'accept-first', emoji: '📄', label: 'AI의 첫 답이 어두운 사진이라도 바로 정답으로 사용합니다.', isCorrect: false, reaction: '고양이라고 적었다가 원본이 여우로 밝혀져 진우가 머쓱해졌습니다.' },
        { id: 'ignore-conditions', emoji: '❌', label: '사진이 얼마나 잘렸든 AI는 무조건 알아본다고 생각합니다.', isCorrect: false, reaction: '아이미: "가려진 사진은 저도 헷갈려요…"' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '어떤 사진 조건을 먼저 바꾸고 싶나요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '가린 부분을 줄이자 아이미는 여우라고 답했습니다. 사진을 어둡게 하자 다시 고양이라고 답했습니다.',
      facts: [
        '가림을 줄이자 더 많은 얼굴 특징이 보였습니다.',
        '사진이 어두워지자 털과 얼굴 경계가 흐려졌습니다.',
        '같은 여우 사진도 조건에 따라 AI 답이 달라졌습니다.',
        '원본 사진에는 여우의 얼굴과 몸이 분명하게 보입니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 실험 의견',
      text: '처음에는 보이는 귀와 얼굴 모양이 고양이와 비슷해서 고양이라고 답했어요. 더 많은 특징이 보이자 여우라고 답을 바꿨어요.',
      question: '아이미의 설명을 받아들일까요, 다른 조건도 더 시험할까요?',
    },
    artifact: {
      kind: 'visual-plan',
      title: '이미지 인식 실험 기록',
      prompt: '입력 조건, AI의 답, 내가 원본에서 확인한 근거를 차례로 적어 봐요.',
    },
    transfer: {
      title: '흐린 분리배출 표지판',
      description: '빛이 반사되어 흐릿한 분리배출 표지판을 AI가 “일반 쓰레기”라고 읽었습니다. 어떻게 확인하겠습니까?',
      prompt: '나만의 표현으로 흐릿한 표지판 사진을 AI가 잘못 읽었을 때 어떻게 할지 설명해보자.',
      choices: [
        { id: 'change-sign-angle', emoji: '📐', label: '빛 반사를 줄이도록 표지판 사진의 각도와 밝기를 바꾸어 다시 인식해 봅니다.', isCorrect: true, reaction: '각도를 바꾸자 표지판 글자가 선명하게 다시 보였습니다.' },
        { id: 'ask-staff', emoji: '👤', label: '실제 표지판을 눈으로 보거나 담당자 안내와 비교합니다.', isCorrect: true, reaction: '실제 표지판을 보니 답이 분명해졌습니다.' },
        { id: 'follow-first-sign', emoji: '➡️', label: 'AI가 처음 잘못 읽은 말대로 쓰레기를 버립니다.', isCorrect: false, reaction: '분리배출을 잘못해 다시 확인해야 했습니다.' },
        { id: 'believe-all-images', emoji: '🖼️', label: '사진 상태와 상관없이 AI는 언제나 정답만 말한다고 믿습니다.', isCorrect: false, reaction: '흐린 사진에서는 AI도 헷갈릴 수 있었습니다.' },
      ],
    },
    safetyNote: '수업용 사진만 사용하며 학생의 얼굴 사진은 입력하지 않습니다.',
  };
