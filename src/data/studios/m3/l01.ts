import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_LEARNING_NOTE } from './shared';

export const M3_L1_STUDIO: StudioDefinition = {
    id: 'm3-question-depth-lab',
    lessonId: 'm3-l1',
    moduleId: 'm3',
    title: '궁금한 것을 깊게 묻기',
    subtitle: '같은 주제를 세 가지 질문으로 바꾸고 답의 정보 범위를 비교해 봐요.',
    format: 'D',
    visualNovel: {
      title: '“펭귄은 새야?” 다음 질문은 무엇일까',
      objective: '같은 주제를 세 가지 질문으로 바꿔 아이미에게 묻고, 과제에 가장 도움이 되는 답을 이유와 함께 골라요.',
      seasonTag: '[공부 짝꿍 · 1화] 펭귄 과제',
      nextEpisodeHook: '다음 시간 — 모르는 낱말 「생태계」가 나타났어요.',
      scenes: [
        {
          id: 'm3-l1-short-answer',
          label: '짧은 답',
          imageSrc: '/lessons/story/m3/m3-l1-scene-01.webp',
          alt: '윤아가 펭귄은 새인지 묻고 아이미가 짧게만 답하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아: "펭귄은 새야?"',
            '윤아: "아이미야, 펭귄은 새야?" 아이미: "네! 새입니다!" 윤아: "…끝? 과제는 \'까닭\'을 써야 하는데."',
            '윤아: "아이미야, 펭귄은 새야?" 아이미: "네! 새입니다!" 윤아: "…끝? 과제는 \'까닭\'을 써야 하는데." 짧은 질문엔 짧은 답만 돌아왔습니다.',
            '윤아는 답이 틀린 것은 아니지만 과제에 쓸 정보가 부족하다고 느꼈습니다.',
          ),
        },
        {
          id: 'm3-l1-purpose',
          label: '궁금한 점 더하기',
          imageSrc: '/lessons/story/m3/m3-l1-scene-02.webp',
          alt: '아이미가 질문의 크기만큼 답한다고 스스로 밝히는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '아이미: "질문의 크기만큼 답해요!"',
            '아이미: "저는 질문의 크기만큼 답해요. 더 큰 질문을 주시면 더 큰 답을 드려요!"',
            '아이미: "저는 질문의 크기만큼 답해요. 더 큰 질문을 주시면 더 큰 답을 드려요!" 윤아는 과제에 필요한 까닭을 떠올렸습니다.',
            '윤아는 짧은 답이 나온 까닭을 AI가 아니라 질문의 범위에서 찾았습니다.',
          ),
        },
        {
          id: 'm3-l1-three-answers',
          label: '세 답 비교',
          imageSrc: '/lessons/story/m3/m3-l1-scene-03.webp',
          alt: '예 아니오 질문, 열린 질문, 구체화 질문의 답 카드를 비교하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '세 질문의 답이 서로 달랐어요.',
            '"새야?"엔 분류만, "왜 새야?"엔 까닭이, "왜 날지 못해?"엔 날개 이야기가 나왔습니다.',
            '"새야?"엔 분류만, "왜 새야?"엔 까닭이, "왜 날지 못해?"엔 날개 이야기가 나왔습니다. 정보의 종류가 질문마다 달랐습니다.',
            '윤아는 여러 답을 모으는 것보다 목적에 맞는 질문을 고르는 일이 중요하다고 생각했습니다.',
          ),
        },
        {
          id: 'm3-l1-question-stair',
          label: '가장 도움이 된 질문은?',
          imageSrc: '/lessons/story/m3/m3-l1-scene-04.webp',
          alt: '아이미가 세 답 중 어느 것이 가장 도움이 됐는지 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "가장 도움이 되는 질문은?"',
            '아이미: "세 가지 답을 모두 드렸어요. 과제에 가장 도움이 되는 질문은 무엇이었나요?"',
            '아이미: "세 가지 답을 모두 드렸어요. 과제에 가장 도움이 되는 질문은 무엇이었나요? 이유도 궁금해요!"',
            '윤아는 다음 과제에서도 먼저 궁금한 점을 정한 뒤 질문을 만들기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '질문 종류에 따라 얻는 정보가 달라요',
          core: '예·아니오 질문, 열린 질문, 구체화 질문은 서로 다른 정보를 얻습니다.',
          detail: {
            full: '짧은 확인, 까닭 설명, 특정 조건 확인 중 필요한 질문을 골라요.',
            light: '질문의 시작과 조건이 달라지면 답의 범위도 달라집니다.',
            challenge: '질문 유형은 답의 길이보다 주장, 이유, 사례 중 어떤 정보가 포함될 가능성이 큰지를 바꿉니다.',
          },
          flow: { input: '같은 주제', process: '세 질문으로 바꾸기', output: '답의 범위 비교' },
        },
        {
          title: '공부 목적을 질문에 연결해요',
          core: '무엇을 알고 왜 필요한지 정하면 질문에 넣을 단서를 고를 수 있습니다.',
          detail: {
            full: '과제에서 꼭 설명할 것을 먼저 찾아요.',
            light: '목적과 궁금한 점을 질문에 더합니다.',
            challenge: '목적은 질문을 무조건 넓히는 대신 필요한 주장과 근거에 맞게 범위를 조절하는 기준입니다.',
          },
        },
        {
          title: '답은 과제에 도움이 되는지 비교해요',
          core: '답의 길이보다 필요한 정보와 근거가 들어 있는지 확인합니다.',
          detail: {
            full: '과제에 쓸 수 있는 답에 표시해요.',
            light: '세 답의 같은 점과 다른 점을 비교합니다.',
            challenge: '서로 다른 질문의 답을 같은 과제 기준으로 비교해야 질문 변화의 효과를 판단할 수 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '“응, 새야”로 과제를 끝낼 수 있을까',
      description: '윤아는 펭귄 과제에 필요한 까닭과 특징을 얻기 위해 다음 질문을 만들어야 합니다.',
      facts: [
        '첫 질문은 “펭귄은 새야?”입니다.',
        '첫 답은 “응, 새야”입니다.',
        '과제에는 새인 까닭과 날지 못하는 까닭이 필요합니다.',
        '답은 자기 말로 다시 설명해야 합니다.',
      ],
    },
    firstAttempt: {
      prompt: '과제에 더 도움이 될 다음 질문을 먼저 골라 보세요.',
      choices: [
        { id: 'repeat-yes-no', emoji: '✅', label: '“정말 새가 맞아?”라고 다시 물어요.', reaction: '아이미: "네! 새입니다!" (같은 크기 질문엔 같은 크기 답이 돌아왔습니다.)' },
        { id: 'open-why', emoji: '🔎', label: '“펭귄이 새인 까닭은 무엇이야?”라고 물어요.', reaction: '아이미: "좋은 질문이에요! 깃털과 알에 대해 알려 드릴게요."' },
        { id: 'specific-flight', emoji: '🐧', label: '“펭귄은 새인데 왜 날지 못해?”라고 물어요.', reaction: '아이미: "이것도 좋은 질문이에요! 날개와 헤엄 이야기를 들려 드릴게요."' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '내가 고른 질문으로 어떤 정보를 얻고 싶은지 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '세 질문의 수업용 답을 같은 기준으로 비교합니다.',
      facts: [
        '예·아니오 답은 새라는 분류만 알려 줍니다.',
        '열린 답은 깃털과 알을 낳는 특징을 설명합니다.',
        '구체화 답은 날개가 수영에 알맞게 변한 점을 설명합니다.',
        '긴 답에도 과제와 관계없는 정보가 섞일 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '질문별 답의 범위를 보여 주는 AI',
      text: '“펭귄은 새야?”에는 분류를, “왜 새야?”에는 특징과 까닭을, “왜 날지 못해?”에는 날개와 생활 환경을 중심으로 답했습니다.',
      question: '세 답 중 과제에 필요한 정보를 가장 잘 채우는 질문은 무엇인가요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '질문 계단과 답 비교 기록',
      prompt: '첫 질문, 바꾼 질문, 답에서 얻은 정보, 최종 질문을 계단과 비교표로 정리해 보세요.',
    },
    transfer: {
      title: '모르는 낱말을 깊게 묻기',
      description: '책에서 “서식지”를 만났습니다. 뜻과 쓰임을 알기 위해 어떤 질문을 이어서 하겠어요?',
      choices: [
        { id: 'habitat-yes-no', emoji: '❔', label: '“서식지는 장소야?”라고 확인해요.', reaction: '아이미: "네, 장소예요!" (확인엔 확인만큼의 답이 돌아왔습니다.)' },
        { id: 'habitat-meaning', emoji: '📘', label: '“서식지는 무슨 뜻이고 어디에 쓰는 말이야?”라고 물어요.', reaction: '아이미: "뜻과 쓰임을 같이 알려 드릴게요!"' },
        { id: 'habitat-example', emoji: '🦊', label: '“여우의 서식지를 예로 들어 설명해 줘”라고 물어요.', reaction: '아이미: "여우를 예로 들면 훨씬 쏙쏙 들어올 거예요!"' },
      ],
    },
    safetyNote: PREPARED_LEARNING_NOTE,
  };
