import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_PROBLEM_NOTE } from './shared';

export const M5_L9_STUDIO: StudioDefinition = {
    id: 'm5-alternative-comparison',
    lessonId: 'm5-l9',
    moduleId: 'm5',
    title: '대안을 기준으로 비교하기',
    subtitle: '프린터를 쓸 수 없을 때 여러 방법을 만들고 같은 기준으로 비교해요.',
    format: 'C',
    visualNovel: {
      title: '멈춘 프린터와 세 가지 다른 길',
      objective: '처음 방법이 막혔을 때 아이미와 다른 방법을 두 가지 넘게 만들고, 시간·안전·도움 기준으로 비교해 골라요.',
      seasonTag: '[체험회 D-2 · 9화] 멈춘 프린터',
      nextEpisodeHook: '다음 시간 — 방문객이 자꾸 처음 화면으로.',
      scenes: [
        {
          id: 'm5-l9-printer-stopped',
          label: '멈춘 방법',
          imageSrc: '/lessons/story/m5/m5-l9-scene-01.webp',
          alt: '진우가 프린터가 안 되고 내일모레가 체험회인데 안내문을 못 뽑는다며 긴장하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '안내문을 뽑으려는데 프린터가 멈췄어요. 진우: "내일모레가 체험회인데!"',
            '안내문을 뽑으려는데 프린터가 멈췄습니다. 진우: "프린터가… 안 돼. 내일모레가 체험회인데 안내문을 못 뽑아!"',
            '안내문을 뽑으려는데 프린터가 멈췄습니다. 진우: "내일모레가 체험회인데 안내문을 못 뽑아!" 처음 방법만 붙잡으면 시간이 모자랐습니다.',
            '진우는 방법이 막혀도 목표는 남아 있다는 것을 아직 몰랐습니다.',
          ),
        },
        {
          id: 'm5-l9-three-options',
          label: '세 가지 대안',
          imageSrc: '/lessons/story/m5/m5-l9-scene-02.webp',
          alt: '윤아가 목표는 출력이 아니라 안내라며 안내할 다른 길이 뭐가 있을지 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아: "목표는 \'출력\'이 아니라 \'안내\'야." 손글씨, 다른 프린터, 화면 안내가 나왔어요.',
            '윤아: "목표는 \'출력\'이 아니라 \'안내\'야. 안내할 다른 길이 뭐가 있을까?" 손글씨, 다른 프린터, 화면 안내가 하나씩 나왔습니다.',
            '윤아: "목표는 \'출력\'이 아니라 \'안내\'야. 안내할 다른 길이 뭐가 있을까?" 손글씨, 다른 프린터, 화면 안내가 하나씩 나왔습니다. 아직 고르지는 않았습니다.',
            '윤아는 방법이 막혀도 목표를 이룰 다른 길이 있다고 믿었습니다.',
          ),
        },
        {
          id: 'm5-l9-criteria-table',
          label: '같은 기준',
          imageSrc: '/lessons/story/m5/m5-l9-scene-03.webp',
          alt: '아이미가 세 대안을 시간 안전 도움 기준으로 나란히 정리하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '아이미가 세 방법을 시간, 안전, 도움 기준으로 나란히 정리했어요.',
            '아이미는 시간, 안전, 도움 필요 기준으로 세 대안을 같은 표에 정리했습니다.',
            '아이미는 시간, 안전, 도움 필요 기준으로 세 대안을 같은 표에 정리했습니다. 각 방법의 장단이 보이기 시작했습니다.',
            '진우는 어떤 것이 좋고 나쁜지 아직 정하지 않았습니다.',
          ),
        },
        {
          id: 'm5-l9-context-choice',
          label: '어느 길을 고르겠어요?',
          imageSrc: '/lessons/story/m5/m5-l9-scene-04.webp',
          alt: '아이미가 비교표가 완성됐다며 지금 조건에서 어느 길을 고를지 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "비교표가 완성됐어요. 지금 조건에서 어느 길을 고르겠어요?"',
            '아이미: "비교표가 완성됐어요. 지금 조건에서 당신이라면 어느 길을 고르겠어요?"',
            '아이미: "비교표가 완성됐어요. 지금 조건에서 당신이라면 어느 길을 고르겠어요? 두 방법을 같이 써도 좋아요."',
            '진우는 한 가지 방법이 막혀도 목표까지 가는 다른 길이 있다는 사실에 안심했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '목표와 처음 방법을 나눠요',
          core: '프린터 사용은 방법이고, 방문객에게 알리는 것이 목표입니다.',
          detail: {
            full: '꼭 이루어야 할 목표를 찾아요.',
            light: '막힌 방법 말고 목표를 봐요.',
            challenge: '해결 수단을 목적과 분리해 탐색 공간을 다시 엽니다.',
          },
        },
        {
          title: '대안을 두 가지 이상 만들어요',
          core: '서로 다른 도구와 도움 수준을 쓰는 방법을 만듭니다.',
          detail: {
            full: '할 수 있는 다른 방법을 찾아요.',
            light: '바로 평가하지 말고 먼저 여러 방법을 만들어요.',
            challenge: '표면만 다른 변형이 아니라 자원과 실행 경로가 구별되는 대안을 생성합니다.',
          },
          flow: { input: '목표·현재 조건', process: '대안 생성·공통 기준 비교', output: '근거 있는 선택' },
        },
        {
          title: '같은 기준으로 비교해요',
          core: '시간, 안전, 비용, 도움 필요를 대안마다 살펴봅니다.',
          detail: {
            full: '방법마다 네 기준에 표시해요.',
            light: '좋아 보이는 것 하나만 고르지 않아요.',
            challenge: '의사결정 행렬로 기준별 장단점과 현재 상황의 가중치를 명시합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '프린터가 멈춰도 안내 목표는 남아요',
      description: '세 대안을 만들고 시간·안전·비용·도움 필요 기준으로 비교해야 합니다.',
      facts: [
        '체험회 시작까지 20분이 남았습니다.',
        '굵은 펜과 큰 종이를 사용할 수 있습니다.',
        '입구 화면은 교사의 도움을 받아 바로 사용할 수 있습니다.',
        '다른 교실 프린터는 허락과 이동 시간이 필요합니다.',
      ],
    },
    firstAttempt: {
      prompt: '상황에 맞는 방법을 고르는 과정을 선택해 보세요.',
      choices: [
        { id: 'wait-for-printer', emoji: '🖨️', label: '처음 프린터가 다시 될 때까지 다른 방법 없이 기다려요.', reaction: 'D-day까지 안내 준비가 되지 않을 뻔했습니다.' },
        { id: 'compare-options', emoji: '⚖️', label: '여러 방법을 만들고 같은 기준으로 비교한 뒤 골라요.', reaction: '윤아: "길이 세 개면 하나가 막혀도 두 개가 남아."' },
        { id: 'pick-favorite-tool', emoji: '⭐', label: '평소 가장 좋아하는 도구만 보고 정해요.', reaction: '지금 조건과는 잘 맞지 않는 선택이었습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '가능한 대안 두 가지와 비교할 기준을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '남은 시간, 사용할 수 있는 도구, 도움 가능성이 공개됩니다.',
      facts: [
        '체험회 시작까지 20분입니다.',
        '손글씨 재료는 바로 사용할 수 있습니다.',
        '입구 화면은 교사의 짧은 도움이 필요합니다.',
        '다른 교실 프린터는 이동과 허락에 시간이 듭니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '대안 비교를 돕는 AI',
      text: '손글씨 안내는 빠르고 비용이 적지만 읽기 쉽게 크게 써야 합니다. 입구 화면은 잘 보이지만 교사의 도움이 필요합니다. 다른 프린터는 깔끔하지만 시간이 더 걸립니다.',
      question: '지금 가장 중요한 기준은 무엇이며, 두 방법을 함께 쓰는 편이 더 나을까요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '대안 비교표',
      prompt: '목표, 가능한 대안, 시간·안전·비용·도움 필요 비교, 선택한 방법과 이유를 적어 보세요.',
    },
    transfer: {
      title: '입구 화면도 쓸 수 없을 때',
      description: '고른 화면 안내 방법을 갑자기 사용할 수 없습니다. 어떻게 하겠어요?',
      choices: [
        { id: 'stop-all-guidance', emoji: '🛑', label: '화면을 못 쓰니 안내 자체를 포기해요.', reaction: '목표인 안내는 여전히 남아 있었습니다.' },
        { id: 'switch-non-screen', emoji: '🪧', label: '손글씨 표지와 사람 안내처럼 화면이 필요 없는 대안을 다시 비교해요.', reaction: '다른 길을 다시 비교하니 여전히 안내를 할 수 있었습니다.' },
        { id: 'hide-screen-problem', emoji: '🙊', label: '화면이 안 된다는 사실을 알리지 않고 기다려요.', reaction: '알리지 않고 기다리는 동안 방문객이 안내를 못 받았습니다.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  };
