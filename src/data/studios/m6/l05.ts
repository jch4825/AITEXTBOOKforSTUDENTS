import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_LIFE_NOTE } from './shared';

export const M6_L5_STUDIO: StudioDefinition = {
    id: 'm6-official-weather-prep',
    lessonId: 'm6-l5',
    moduleId: 'm6',
    title: '공식 예보로 옷 준비하기',
    subtitle: '지역·날짜가 있는 최신 예보와 활동·내 감각을 함께 보고 준비해요.',
    format: 'B',
    visualNovel: {
      title: '지역과 날짜가 빠진 “따뜻한 날”',
      objective: '공식 예보의 기온·비·바람을 확인하고, 아이미의 한마디 대신 활동과 내 감각에 맞는 준비물을 골라요.',
      seasonTag: '[나 혼자 일주일 · 5화] 따뜻한 날의 함정',
      nextEpisodeHook: '다음 시간 — 간식 만들기, 그대로 해도 될까.',
      scenes: [
        {
          id: 'm6-l5-vague-weather',
          label: '빠진 지역과 날짜',
          imageSrc: '/lessons/story/m6/m6-l5-scene-01.webp',
          alt: '아이미가 오늘은 따뜻하다고 말하고 진우가 얇게 입자고 하다 윤아가 지역과 날짜를 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '오후 야외 활동 준비물을 정해요. 아이미: "오늘은 따뜻해요!" 윤아: "어디가? 언제?"',
            '오후 야외 활동 준비물을 정하는 중이었습니다. 아이미: "오늘은 따뜻해요!" 진우: "얇게 입자!" 윤아: "…어디가? 언제?"',
            '오후 야외 활동 준비물을 정하는 중이었습니다. 아이미: "오늘은 따뜻해요!" 윤아: "…어디가? 언제? 그 말엔 지역도 날짜도 없는데."',
            '윤아는 지역과 날짜가 있는 공식 예보를 찾아보고 싶었습니다.',
          ),
        },
        {
          id: 'm6-l5-first-outfit',
          label: '첫 준비',
          imageSrc: '/lessons/story/m6/m6-l5-scene-02.webp',
          alt: '진우는 얇은 옷만 윤아는 겉옷과 우산을 고르며 같은 답에도 준비가 다른 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우는 얇은 옷만, 윤아는 겉옷과 우산을 골랐어요. 같은 답인데 준비가 달랐어요.',
            '진우는 얇은 옷만, 윤아는 겉옷과 우산을 골랐습니다. 같은 예보를 들어도 느끼는 정도가 달랐습니다.',
            '진우는 얇은 옷만, 윤아는 겉옷과 우산을 골랐습니다. 같은 예보를 들어도 느끼는 정도가 달랐습니다. 누가 맞는지는 아직 몰랐습니다.',
            '진우는 서로 다른 준비가 둘 다 이유 있을 수 있다고 생각했습니다.',
          ),
        },
        {
          id: 'm6-l5-official-card',
          label: '공식 예보 카드',
          imageSrc: '/lessons/story/m6/m6-l5-scene-03.webp',
          alt: '지역 날짜 기온 14도 오후 비 강한 바람이 표시된 공식 예보 카드를 확인하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '공식 예보 카드에서 지역, 날짜, 낮 14도, 오후 비, 강한 바람을 확인했어요.',
            '공식 예보 카드에는 오늘 지역, 날짜, 낮 14도, 오후 비, 강한 바람이 표시되었습니다.',
            '공식 예보 카드에는 오늘 지역, 날짜, 낮 14도, 오후 비, 강한 바람이 표시되었습니다. 마을 활동은 오후 야외였습니다.',
            '윤아는 이 정보라면 준비를 정할 수 있겠다고 생각했습니다.',
          ),
        },
        {
          id: 'm6-l5-personal-prep',
          label: '너라면 무엇을 챙기겠어?',
          imageSrc: '/lessons/story/m6/m6-l5-scene-04.webp',
          alt: '윤아가 예보는 같아도 준비는 다를 수 있다며 오후 야외 활동에 무엇을 챙길지 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "예보는 같아도 준비는 달라. 오후 야외 활동, 무엇을 챙기겠어?"',
            '윤아: "예보는 같아도 준비는 다를 수 있어. 오후 야외 활동, 너라면 무엇을 챙기겠어?"',
            '윤아: "예보는 같아도 준비는 다를 수 있어. 오후 야외 활동, 너라면 무엇을 챙기겠어? 네 감각도 함께 생각해 봐."',
            '윤아는 같은 옷을 입어야 정답인 것이 아니라 근거를 보고 나에게 맞게 준비하는 것이 중요하다고 느꼈습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '지역과 날짜가 있는 공식 예보를 봐요',
          core: '어느 곳의 언제 정보인지 확인하고 최신 공식 자료를 사용합니다.',
          detail: {
            full: '지역과 날짜 표시를 찾아요.',
            light: '출처와 업데이트 시간을 확인해요.',
            challenge: '예보의 지역, 시간, 출처가 맞는지 먼저 확인합니다.',
          },
        },
        {
          title: '기온·비·바람과 활동을 연결해요',
          core: '활동 시간과 장소에 영향을 주는 예보 요소를 고릅니다.',
          detail: {
            full: '오후 활동에 필요한 준비를 찾아요.',
            light: '비와 바람 카드를 준비물에 연결해요.',
            challenge: '예보 변수를 활동 노출 시간과 강도에 매핑합니다.',
          },
          flow: { input: '공식 예보·활동·내 감각', process: '공통 조건과 개인 조건 비교', output: '나의 외출 준비' },
        },
        {
          title: '내 감각에 맞게 선택해요',
          core: '같은 예보에서도 덥고 춥게 느끼는 정도에 따라 준비가 달라질 수 있습니다.',
          detail: {
            full: '내가 편한 겉옷을 고르고 이유를 말해요.',
            light: '다른 사람과 달라도 근거가 있으면 괜찮아요.',
            challenge: '안전하게 준비하면서 내 더위·추위 느낌과 좋아하는 옷도 함께 봅니다.',
          },
        },
      ],
    },
    encounter: {
      title: '“따뜻해요”만 듣고 준비해도 될까',
      description: '지역과 날짜가 없는 AI 답과 서로 다른 첫 준비가 있습니다.',
      facts: [
        'AI 답에는 지역과 날짜가 없습니다.',
        '활동은 오늘 오후 야외에서 진행됩니다.',
        '공식 예보에는 14도, 오후 비, 강한 바람이 있습니다.',
        '사람마다 덥고 춥게 느끼는 정도가 다릅니다.',
      ],
    },
    firstAttempt: {
      prompt: '외출 준비를 정하는 방법을 골라 보세요.',
      choices: [
        { id: 'use-vague-weather', emoji: '💬', label: '지역과 날짜가 없는 “따뜻해요” 답만 보고 골라요.', reaction: '오후 비에 우산 없이 서 있게 됐습니다.' },
        { id: 'official-forecast', emoji: '🌦️', label: '공식 예보의 지역·날짜·기온·비·바람과 내 감각을 함께 봐요.', reaction: '아이미: "공식 예보와 자기 몸을 함께 보셨네요. 그게 제 한마디보다 정확해요!"' },
        { id: 'copy-friend-outfit', emoji: '👕', label: '내 감각은 보지 않고 친구와 똑같이 입어요.', reaction: '추위를 타는 정도가 달라 친구와 같은 옷이 불편했습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '예보 근거, 활동 시간, 내 감각, 고른 준비물을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '지역·날짜가 있는 공식 예보와 오후 활동 조건이 공개됩니다.',
      facts: [
        '오늘 낮 기온은 14도입니다.',
        '오후에는 비와 강한 바람이 예상됩니다.',
        '활동은 오후 야외에서 진행됩니다.',
        '겉옷의 두께는 개인 감각에 따라 다르게 고를 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '공식 예보 확인을 권하는 AI',
      text: '제가 처음 말한 “따뜻해요”에는 지역과 날짜가 없어 사용할 수 없습니다. 공식 예보에는 오후 비와 바람이 있으니 우산을 준비하고, 겉옷은 활동과 각자의 감각에 맞게 고르세요.',
      question: '모두에게 필요한 준비와 나에게 맞게 달라질 수 있는 준비는 각각 무엇인가요?',
    },
    artifact: {
      kind: 'choice-board',
      title: '나의 외출 준비 카드',
      prompt: '공식 예보의 지역·날짜·기온·비·바람, 활동 조건, 내 감각, 고른 옷과 준비물, 이유를 적어 보세요.',
    },
    transfer: {
      title: '오후 예보가 바뀌었을 때',
      description: '오후 비 시작 시간이 빨라졌다는 공식 업데이트가 나왔습니다. 어떻게 하겠어요?',
      choices: [
        { id: 'keep-morning-plan', emoji: '☀️', label: '아침에 정한 준비는 바꾸지 않아요.', reaction: '빨라진 비 시작 시간에 우산 없이 젖을 뻔했습니다.' },
        { id: 'update-afternoon-prep', emoji: '🔄', label: '최신 공식 예보와 활동 시간을 다시 보고 준비를 고쳐요.', reaction: '바뀐 시간에 맞춰 준비를 미리 조정할 수 있었습니다.' },
        { id: 'ask-ai-without-place', emoji: '🤖', label: '지역 없이 AI에게 다시 한마디로 물어요.', reaction: '지역과 날짜 없이는 여전히 쓸 수 없는 답이었습니다.' },
      ],
    },
    safetyNote: PREPARED_LIFE_NOTE,
  };
