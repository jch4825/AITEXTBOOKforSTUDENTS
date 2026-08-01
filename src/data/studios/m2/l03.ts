import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_AI_NOTE } from './shared';

export const M2_L3_STUDIO: StudioDefinition = {
    id: 'm2-specific-target-lab',
    lessonId: 'm2-l3',
    moduleId: 'm2',
    title: '대상을 정확히 말해요',
    subtitle: '모호한 말을 이름·종류·개수와 필요한 조건으로 바꾸어 봐요.',
    format: 'D',
    visualNovel: {
      title: '체험회 놀이가 너무 어려워요',
      objective: '`그거`, `아무거나` 대신 이름·종류·개수를 넣어 부탁하고, 아이미의 답이 어떻게 달라지는지 비교해요.',
      seasonTag: '[부탁의 달인 · 3화] 아무거나의 함정',
      nextEpisodeHook: '다음 시간 — 말로만 설명하면 안 통할 때.',
      scenes: [
        {
          id: 'any-game-request',
          label: '장면 1 · 넓은 요청',
          imageSrc: '/lessons/story/m2/m2-l3-scene-01.webp',
          alt: '윤아가 체험회 놀이를 아무거나 추천해 달라고 요청하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아: "아무거나 추천해 줘!"',
            '윤아: "아이미야, 체험회 놀이 아무거나 추천해 줘!" 아이미: "아무거나요? 알겠습니다! 제일 유명한 걸로 골라 올게요!"',
            '윤아는 대상과 인원, 시간, 공간을 말하지 않고 넓은 범위의 요청을 보냈습니다. 윤아: "아이미야, 체험회 놀이 아무거나 추천해 줘!" 아이미: "아무거나요? 알겠습니다! 제일 유명한 걸로 골라 올게요!"',
            '모호한 표현은 결과의 범위를 크게 만들어요.',
          ),
        },
        {
          id: 'unsuitable-game-result',
          label: '장면 2 · 맞지 않는 놀이',
          imageSrc: '/lessons/story/m2/m2-l3-scene-02.webp',
          alt: '아이미가 어린 참가자에게 어렵고 긴 놀이를 추천하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미: "90분짜리 놀이예요!"',
            '아이미: "추천 완료! 90분짜리 전략 보드게임입니다!" 진우: "체험 시간이 20분인데?!"',
            '아이미의 결과는 참가자의 연령, 여섯 명이라는 인원, 20분이라는 시간 조건을 충족하지 못했습니다. 아이미: "추천 완료! 90분짜리 전략 보드게임입니다!" 진우: "체험 시간이 20분인데?!"',
            '결과가 누구와 어떤 상황을 위한 것인지 확인해요.',
          ),
        },
        {
          id: 'select-game-conditions',
          label: '장면 3 · 되묻는 아이미',
          imageSrc: '/lessons/story/m2/m2-l3-scene-03.webp',
          alt: '아이미가 대상 인원 시간 공간을 하나씩 되묻는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '아이미: "누가, 몇 명, 몇 분, 어디서 하나요?"',
            '아이미: "그럼 여쭤볼게요. 누가, 몇 명이서, 몇 분 동안, 어디에서 하나요?"',
            '아이미: "그럼 여쭤볼게요. 누가, 몇 명이서, 몇 분 동안, 어디에서 하나요? 조건을 알아야 딱 맞는 답을 드릴 수 있어요." 윤아는 조건을 하나씩 정리해 보기로 했습니다.',
            '조건이 많기보다 목적에 필요한 조건인지가 중요해요.',
          ),
        },
        {
          id: 'matching-game-result',
          label: '장면 4 · 어떤 조건부터?',
          imageSrc: '/lessons/story/m2/m2-l3-scene-04.webp',
          alt: '아이미가 학생에게 어떤 조건부터 알려줄지 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "어떤 조건부터 알려주시겠어요?"',
            '아이미: "조건을 알려 주시면 다시 골라 올게요. 어떤 조건부터 넣으시겠어요?"',
            '아이미: "조건을 알려 주시면 다시 골라 올게요. 대상, 인원, 시간, 공간 중에서 어떤 조건부터 넣으시겠어요?"',
            '조건을 정하면 결과도 달라져요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '모호한 말을 구체적으로 바꿔요',
          core: '`그거`, `아무거나` 대신 대상의 이름, 종류, 개수를 말합니다.',
          detail: {
            full: '무엇인지 정확히 말해요.',
            light: '정확한 대상 표현은 AI가 살펴볼 결과 범위를 좁힙니다.',
            challenge: '대상 범주와 수량을 명시하면 요청의 해석 범위를 줄여 목적에 맞는 결과를 비교하기 쉬워집니다.',
          },
        },
        {
          title: '목적에 필요한 조건을 골라요',
          core: '연령, 인원, 시간, 공간 중 결과를 바꾸는 조건을 선택합니다.',
          detail: {
            full: '필요한 조건만 넣어요.',
            light: '조건이 결과 선택에 어떤 영향을 주는지 생각합니다.',
            challenge: '모든 정보를 나열하지 않고 의사결정에 영향을 주는 조건을 선별해야 요청이 명확하고 안전합니다.',
          },
          flow: { input: '대상과 필요한 조건', process: '결과 범위 좁히기', output: '조건에 맞는 후보' },
        },
        {
          title: '전후 결과를 조건표로 비교해요',
          core: '첫 결과와 수정 결과가 필요한 조건을 충족했는지 항목별로 확인합니다.',
          detail: {
            full: '조건마다 맞는지 표시해요.',
            light: '요청이 구체적이어도 새 결과를 바로 정답으로 사용하지 않습니다.',
            challenge: '조건별 충족 여부를 같은 기준으로 비교하면 요청 수정의 효과와 남은 문제를 확인할 수 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '체험회 놀이가 너무 어려워요',
      description: '윤아가 체험회 놀이를 아무거나 추천해 달라고 하자 아이미는 참가자에게 맞지 않는 긴 활동을 제안했습니다.',
      facts: [
        '참가자는 초등학생 여섯 명입니다.',
        '활동 시간은 20분입니다.',
        '비가 와서 교실 안에서 진행해야 합니다.',
      ],
    },
    firstAttempt: {
      prompt: '첫 결과를 바꾸려면 어떤 정보를 먼저 넣겠습니까?',
      choices: [
        { id: 'say-fun-only', emoji: '🎉', label: '“재미있는 걸로”만 더 말합니다.', reaction: '아이미: "재미의 기준을 몰라 또 헤맸어요… 비슷한 놀이를 또 골랐네요."' },
        { id: 'add-target-conditions', emoji: '📋', label: '대상, 인원, 시간, 공간을 넣습니다.', reaction: '아이미: "이제 알겠어요! 여섯 명이 20분 안에 교실에서 할 수 있는 놀이 말이군요!"' },
        { id: 'accept-hard-game', emoji: '📄', label: 'AI가 골랐으니 그대로 사용합니다.', reaction: '90분짜리 놀이를 20분 만에 급히 접어야 했습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그 조건이 결과를 어떻게 바꿀까요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '참가자는 초등학생 여섯 명이고, 비가 오는 날 교실에서 20분 동안 해야 한다는 조건이 공개되었습니다.',
      facts: [
        '어린 참가자가 이해할 수 있는 쉬운 규칙이 필요합니다.',
        '여섯 명이 모두 참여할 수 있어야 합니다.',
        '준비와 정리를 포함해 20분 안에 끝나야 합니다.',
        '넓은 운동장이나 위험한 도구를 사용할 수 없습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 조건 점검',
      text: '“초등학생 여섯 명이 비 오는 날 교실에서 20분 안에 할 수 있는 쉬운 협동 놀이 두 가지를 추천해 줘”라고 바꿀 수 있어요.',
      question: '이 요청에는 목적에 필요하지 않은 정보가 섞여 있지 않나요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '전후 요청-결과 체크표',
      prompt: '모호한 말, 추가한 조건, 첫 결과, 수정 결과의 조건 충족 여부를 비교해 봐요.',
    },
    transfer: {
      title: '“그거 정리해 줘”를 바꾼다면',
      description: '친구에게 받은 긴 준비물 메모를 AI로 정리하려고 합니다.',
      choices: [
        { id: 'repeat-organize-that', emoji: '👉', label: '“그거 정리해 줘”라고만 요청합니다.', reaction: '아이미: "그거요? 무엇을 정리할지 저에게 알려 주시겠어요?"' },
        { id: 'name-note-format', emoji: '📋', label: '준비물 메모를 종류별 표로 정리해 달라고 합니다.', reaction: '아이미: "종류별 표로 깔끔하게 정리했어요!"' },
        { id: 'add-unneeded-name', emoji: '👤', label: '친구의 전체 이름과 연락처를 넣습니다.', reaction: '아이미: "이름과 연락처는 몰라도 정리할 수 있어요. 넣지 말아 주세요."' },
      ],
    },
    safetyNote: PREPARED_AI_NOTE,
  };
