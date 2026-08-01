import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_AI_NOTE } from './shared';

export const M2_L2_STUDIO: StudioDefinition = {
    id: 'm2-one-purpose-at-a-time',
    lessonId: 'm2-l2',
    moduleId: 'm2',
    title: '한 번에 한 가지 부탁',
    subtitle: '여러 부탁을 목적과 순서에 따라 나누어 요청해 봐요.',
    format: 'B',
    visualNovel: {
      title: '세 가지 부탁이 한 문장에',
      objective: '한 문장에 섞인 여러 부탁을 하나씩 나누고, 마감이 빠른 것부터 아이미에게 차례로 부탁해요.',
      seasonTag: '[부탁의 달인 · 2화] 세 부탁이 한 문장에',
      nextEpisodeHook: '다음 시간 — 아무거나의 함정.',
      scenes: [
        {
          id: 'three-requests-one-sentence',
          label: '장면 1 · 긴 요청',
          imageSrc: '/lessons/story/m2/m2-l2-scene-01.webp',
          alt: '진우가 안내문 간식 목록 음악 추천을 한 문장에 부탁하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우: "안내문 쓰고 간식 고르고 음악도! 한 번에!"',
            '진우: "아이미야! 안내문 쓰고 간식 고르고 음악도 추천해 줘. 한 번에!"',
            '진우: "아이미야! 안내문 쓰고 간식 고르고 음악도 추천해 줘. 한 번에!" 목적과 마감이 다른 세 부탁이 한 문장에 담겼습니다.',
            '여러 목적이 섞이면 결과의 순서와 완성도가 흐려질 수 있어요.',
          ),
        },
        {
          id: 'mixed-request-result',
          label: '장면 2 · 뒤엉킨 결과',
          imageSrc: '/lessons/story/m2/m2-l2-scene-02.webp',
          alt: '아이미의 결과에서 안내문과 간식과 음악이 섞인 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미: "완성! 팝콘과 신나는 폴카를 넣어 두었어요!"',
            '아이미: "완성! 안내문 중간에 팝콘과 신나는 폴카를 넣어 두었어요!" 정작 마감 시간은 빠져 있었습니다.',
            '아이미: "완성! 안내문 중간에 팝콘과 신나는 폴카를 넣어 두었어요!" 세 목적이 한 문서에 섞였고, 가장 급한 마감 시간은 빠져 있었습니다.',
            '짧게 줄이기보다 목적을 나누는 일이 먼저예요.',
          ),
        },
        {
          id: 'order-purpose-cards',
          label: '장면 3 · 목적 카드 나누기',
          imageSrc: '/lessons/story/m2/m2-l2-scene-03.webp',
          alt: '윤아의 확인 질문으로 가장 급한 것과 나머지를 나누어 보는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "가장 급한 게 뭐지?"',
            '윤아: "가장 급한 게 뭐지? 간식 수는 언제 알 수 있지?" 세 부탁을 카드 세 장으로 나누어 보았습니다.',
            '윤아: "가장 급한 게 뭐지? 간식 수는 언제 알 수 있지?" 마감과 앞뒤 관계를 하나씩 짚어 카드 세 장으로 나누어 보았습니다.',
            '먼저 필요한 결과와 다음 결과의 관계를 살펴 순서를 정해요.',
          ),
        },
        {
          id: 'separated-dialogue',
          label: '장면 4 · 무엇부터, 어떤 차례로?',
          imageSrc: '/lessons/story/m2/m2-l2-scene-04.webp',
          alt: '윤아가 세 장의 카드를 어떤 순서로 부탁할지 학생에게 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "무엇부터, 어떤 차례로 부탁할까?"',
            '윤아: "카드 세 장이 됐어. 그럼 무엇부터, 어떤 차례로 부탁할까?"',
            '윤아: "카드 세 장이 됐어. 그럼 무엇부터, 어떤 차례로 부탁할까? 마감이랑 순서를 같이 생각해 보자."',
            '각 단계의 결과를 확인한 뒤 다음 요청으로 넘어가요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '한 단계에는 목적 하나',
          core: '한 대화 단계에서 먼저 해결할 목적을 하나 정합니다.',
          detail: {
            full: '부탁을 하나씩 나눠요.',
            light: '짧음보다 무엇을 먼저 해결할지 분명한 것이 중요합니다.',
            challenge: '목적 단위로 요청을 분할하면 각 결과의 누락과 완료 여부를 따로 검토할 수 있습니다.',
          },
        },
        {
          title: '마감과 관계로 순서를 정해요',
          core: '먼저 필요한 결과와 앞 단계가 있어야 할 수 있는 일을 살펴봅니다.',
          detail: {
            full: '급한 부탁을 먼저 해요.',
            light: '마감 시간과 앞뒤 관계를 기준으로 대화 순서를 정합니다.',
            challenge: '마감 시간과 먼저 필요한 일을 보면 여러 부탁의 순서를 이유 있게 정할 수 있습니다.',
          },
          flow: { input: '여러 목적의 부탁', process: '마감과 관계로 분할', output: '순서가 있는 요청 묶음' },
        },
        {
          title: '결과를 확인하고 이어 가요',
          core: '앞 요청의 결과를 확인한 뒤 다음 요청에 필요한 정보로 사용합니다.',
          detail: {
            full: '하나를 확인하고 다음으로 가요.',
            light: '각 단계의 결과가 목적에 맞는지 보고 다음 요청을 시작합니다.',
            challenge: '중간 결과를 검토하면 앞 단계의 오류가 다음 단계로 이어지는 것을 줄일 수 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '세 가지 부탁이 한 문장에',
      description: '진우가 안내문 작성, 간식 목록, 음악 추천을 한 문장에 부탁하자 결과가 서로 섞였습니다.',
      facts: [
        '안내문은 오늘 오후까지 먼저 완성해야 합니다.',
        '간식 목록은 참가 인원을 확인한 뒤 만들 수 있습니다.',
        '음악은 행사 분위기를 정한 뒤 추천받을 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '세 부탁 중 무엇을 어떻게 먼저 요청하겠습니까?',
      choices: [
        { id: 'repeat-all', emoji: '📦', label: '세 부탁을 더 짧은 한 문장에 다시 넣습니다.', reaction: '아이미: "또 섞여 나왔어요! 짧아져도 목적은 그대로 섞여 있네요."' },
        { id: 'start-deadline', emoji: '⏱️', label: '마감이 빠른 안내문부터 따로 요청합니다.', reaction: '아이미: "안내문 하나만요? 좋아요, 이건 자신 있어요!"' },
        { id: 'start-music', emoji: '🎵', label: '순서를 살피지 않고 음악부터 요청합니다.', reaction: '윤아: "마감인 안내문이 늦어질 뻔했잖아!"' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그 부탁을 먼저 처리해야 하는 근거는 무엇인가요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '안내문은 오늘 오후 3시까지 필요하고, 간식 수량은 참가 신청이 끝난 뒤에야 알 수 있습니다.',
      facts: [
        '안내문에는 시간, 장소, 신청 방법이 필요합니다.',
        '간식 목록은 최종 참가 인원에 따라 달라집니다.',
        '음악은 행사 분위기 조건이 정해져야 고를 수 있습니다.',
        '각 요청 뒤에는 결과를 확인하는 단계가 필요합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 대화 순서 제안',
      text: '오늘 마감인 안내문을 첫 요청으로 만들고 확인한 뒤, 참가 인원이 정해지면 간식 목록을 두 번째 요청으로 나누는 편이 좋아요.',
      question: '아이미의 순서가 마감과 앞뒤 관계에 맞나요?',
    },
    artifact: {
      kind: 'visual-plan',
      title: '분할 요청 대화선',
      prompt: '목적, 마감, 첫 요청, 결과 확인, 다음 요청을 시간 순서로 연결해 봐요.',
    },
    transfer: {
      title: '여행 준비 부탁을 나눈다면',
      description: 'AI에게 교통편, 준비물, 여행 소개 글을 한꺼번에 부탁하려고 합니다.',
      choices: [
        { id: 'travel-all-at-once', emoji: '📦', label: '세 부탁을 한 문장에 모두 넣습니다.', reaction: '결과가 이번에도 뒤섞여 나왔습니다.' },
        { id: 'travel-order', emoji: '📅', label: '날짜와 교통편을 먼저 확인한 뒤 준비물을 요청합니다.', reaction: '순서대로 요청하니 결과가 훨씬 분명했습니다.' },
        { id: 'travel-no-check', emoji: '⏭️', label: '앞 결과를 확인하지 않고 다음 요청으로 넘어갑니다.', reaction: '앞 단계의 실수가 다음 단계로 그대로 이어졌습니다.' },
      ],
    },
    safetyNote: PREPARED_AI_NOTE,
  };
