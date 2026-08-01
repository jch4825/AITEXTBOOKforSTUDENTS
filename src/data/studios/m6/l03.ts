import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_LIFE_NOTE } from './shared';

export const M6_L3_STUDIO: StudioDefinition = {
    id: 'm6-fixed-map-route-check',
    lessonId: 'm6-l3',
    moduleId: 'm6',
    title: '지도와 현장 표지로 길 확인하기',
    subtitle: '개인 위치를 보내지 않는 고정된 연습 지도에서 표지와 공식 안내로 경로를 확인해요.',
    format: 'C',
    visualNovel: {
      title: '지도에는 없는 지름길',
      objective: '연습 지도에서 출발점과 목적지를 찾고, 아이미의 길 안내를 지도·표지와 대조해 안전한 길을 골라요.',
      seasonTag: '[나 혼자 일주일 · 3화] 지도에 없는 지름길',
      nextEpisodeHook: '다음 시간 — 12번? 21번? 버스가 두 대.',
      scenes: [
        {
          id: 'm6-l3-practice-map',
          label: '고정된 연습 지도',
          imageSrc: '/lessons/story/m6/m6-l3-scene-01.webp',
          alt: '윤아가 고정된 연습 지도로 도서관 가는 길을 연습하며 출발점을 확인하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아: "고정된 연습 지도로 도서관 가는 길 연습이야. 출발점은 학교."',
            '윤아: "고정된 연습 지도로 도서관 가는 길 연습이야. 출발점은 학교." 실제 위치가 아닌 교실용 지도였습니다.',
            '윤아: "고정된 연습 지도로 도서관 가는 길 연습이야. 출발점은 학교." 실제 위치가 아닌 교실용 지도였습니다. 목적지는 마을 도서관이었습니다.',
            '윤아는 실제 위치를 보내지 않고도 길 찾기를 연습할 수 있다고 생각했습니다.',
          ),
        },
        {
          id: 'm6-l3-ai-shortcut',
          label: '지도에 없는 지름길',
          imageSrc: '/lessons/story/m6/m6-l3-scene-02.webp',
          alt: '아이미가 공원 뒤 골목이 더 빠르다고 제안하고 윤아가 지도에 없다며 의문을 갖는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미: "공원 뒤 골목이 더 빨라요!" 윤아: "…그런데 그 길, 지도에 없는데?"',
            '아이미: "공원 뒤 골목이 더 빨라요!" 진우: "오, 지름길!" 윤아: "…그런데 그 길, 지도에 없는데?"',
            '아이미: "공원 뒤 골목이 더 빨라요!" 진우: "오, 지름길!" 윤아: "…그런데 그 길, 지도에 없는데?" 확인할 표지도 없었습니다.',
            '윤아는 빠르다는 말보다 확인할 수 있는지가 먼저라고 생각했습니다.',
          ),
        },
        {
          id: 'm6-l3-sign-check',
          label: '지도와 표지 비교',
          imageSrc: '/lessons/story/m6/m6-l3-scene-03.webp',
          alt: '횡단보도 공원 입구 파란 표지 순서로 지도와 현장 표지를 대조하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '횡단보도, 공원 입구, 파란 표지 순서로 지도와 현장을 대조했어요.',
            '지도 기호와 현장 표지 카드를 연결하자 횡단보도, 공원 입구, 파란 도서관 표지가 지도 경로와 차례대로 같았습니다.',
            '지도 기호와 현장 표지 카드를 연결하자 횡단보도, 공원 입구, 파란 도서관 표지가 지도 경로와 차례대로 같았습니다. 대조 방법을 확인한 참이었습니다.',
            '윤아는 지도와 표지가 같은 길이 안전한 길이라고 생각했습니다.',
          ),
        },
        {
          id: 'm6-l3-safe-route',
          label: '어느 길을 고르겠어?',
          imageSrc: '/lessons/story/m6/m6-l3-scene-04.webp',
          alt: '윤아가 빠르다는 길과 확인되는 길 중 어느 쪽을 고를지, 표지가 다르면 어떻게 할지 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "빠르다는 길과 확인되는 길 — 너라면 어느 길을 고르겠어?"',
            '윤아: "빠르다는 길과 확인되는 길 — 너라면 어느 길을 고르겠어? 그리고 표지가 다르면 어떻게 할래?"',
            '윤아: "빠르다는 길과 확인되는 길 — 너라면 어느 길을 고르겠어? 그리고 표지가 다르면 어떻게 할래? 도움받을 곳도 생각해 봐."',
            '윤아는 길을 모르는 것이 부끄러운 일이 아니라 확인할 신호라고 느꼈습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '출발점·목적지·기준점을 찾아요',
          core: '지도에서 시작과 끝, 중간에 확인할 표지를 표시합니다.',
          detail: {
            full: '학교, 횡단보도, 공원, 도서관을 찾아요.',
            light: '지도 기호와 이름을 연결해요.',
            challenge: '길은 기준이 되는 장소 순서로 말합니다. 내 실시간 위치를 보내지 않아도 확인할 수 있습니다.',
          },
        },
        {
          title: '지도와 현장 표지를 비교해요',
          core: '지도 기호와 표지 카드가 같은 순서인지 확인합니다.',
          detail: {
            full: '같은 표지에 확인 표시를 해요.',
            light: '지도에 없는 길은 고르지 않아요.',
            challenge: '지도와 현장 표지가 같은 길을 말하는지 함께 봅니다.',
          },
          flow: { input: '고정 지도·표지 카드', process: '기준점 순서 비교', output: '안전 경로·도움 지점' },
        },
        {
          title: '다르면 멈추고 사람에게 물어요',
          core: '표지가 없거나 다르면 계속 가지 않고 공식 안내나 믿을 사람에게 확인합니다.',
          detail: {
            full: '도움받을 장소와 문장을 골라요.',
            light: '개인 위치를 낯선 채팅에 보내지 않아요.',
            challenge: '경로 불일치 시 실행 중단과 신뢰 가능한 확인 채널을 사전에 정합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '지도에 없는 지름길을 따라가도 될까',
      description: 'AI는 짧다고 말하지만 고정된 연습 지도와 표지 카드에는 그 길이 없습니다.',
      facts: [
        '활동은 실제 위치가 아닌 고정된 연습 지도입니다.',
        '확인 가능한 경로에는 횡단보도와 파란 도서관 표지가 있습니다.',
        'AI가 제안한 골목은 지도에 없습니다.',
        '표지가 다르면 안내소나 함께 있는 어른에게 물을 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '경로를 안전하게 고르는 방법을 선택해 보세요.',
      choices: [
        { id: 'follow-ai-shortcut', emoji: '↗️', label: 'AI가 빠르다고 한 지도 밖 길을 따라가요.', reaction: '확인할 표지가 없어 길을 잃기 쉬웠습니다. 아이미: "제 지름길 제안은 철회할게요."' },
        { id: 'use-fixed-map', emoji: '🗺️', label: '지도와 눈앞의 표지가 모두 맞는 길을 골라요.', reaction: '아이미: "맞아요. 확인할 수 있는 길이 안전한 길이에요."' },
        { id: 'share-live-location', emoji: '📍', label: '낯선 채팅에 현재 위치를 보내 길을 물어요.', reaction: '아이미: "개인 위치는 낯선 곳에 보내지 않아요."' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '출발점, 목적지, 확인할 표지, 도움받을 곳을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '확인 가능한 표지 순서와 지도에 없는 지름길 정보가 공개됩니다.',
      facts: [
        '확인 경로는 학교-횡단보도-공원 입구-도서관입니다.',
        '파란 도서관 표지가 마지막 기준점입니다.',
        'AI 지름길은 지도와 공식 안내에 없습니다.',
        '표지 불일치 시 안내소나 믿을 만한 어른에게 확인합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '근거 없는 경로를 철회하는 AI',
      text: '제가 제안한 골목은 고정 지도에 없는 길이라 사용하면 안 됩니다. 지도와 표지 카드가 모두 일치하는 횡단보도-공원 입구-파란 표지 경로를 사용하고, 다르면 멈춰 안내소에 물어보세요.',
      question: '경로가 맞다고 판단할 수 있는 지도와 현장 증거는 무엇인가요?',
    },
    artifact: {
      kind: 'visual-plan',
      title: '안전 경로 카드',
      prompt: '출발점, 목적지, 확인할 기준점, 지도 근거, 표지가 다를 때 멈출 곳과 도움 요청 문장을 적어 보세요.',
    },
    transfer: {
      title: '보건소 연습 지도 확인',
      description: '가상의 보건소 지도에서 AI가 표지에 없는 뒷길을 제안했습니다. 어떻게 하겠어요?',
      choices: [
        { id: 'take-clinic-backroad', emoji: '🚶', label: 'AI가 가깝다고 했으니 지도 밖 뒷길을 골라요.', reaction: '확인할 표지가 없어 불안했습니다.' },
        { id: 'check-clinic-map', emoji: '🏥', label: '고정 지도·공식 표지·안내소로 확인되는 경로를 골라요.', reaction: '표지가 모두 맞아 안심하고 갈 수 있었습니다.' },
        { id: 'send-private-location', emoji: '📲', label: '개인 위치를 공개 채팅에 올려요.', reaction: '개인 위치는 낯선 곳에 보내지 않는 편이 안전했습니다.' },
      ],
    },
    safetyNote: PREPARED_LIFE_NOTE,
  };
