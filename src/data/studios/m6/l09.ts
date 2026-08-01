import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_LIFE_NOTE } from './shared';

export const M6_L9_STUDIO: StudioDefinition = {
    id: 'm6-self-advocacy-expression',
    lessonId: 'm6-l9',
    moduleId: 'm6',
    title: '인사·도움·거절을 내 방식으로 표현하기',
    subtitle: '인사뿐 아니라 도움 요청·거절·재설명을 말·글·그림 카드 중 편한 방법으로 연습해요.',
    format: 'D',
    visualNovel: {
      title: '친절하게 말해도 거절할 수 있어요',
      objective: '인사·도움 요청·거절·다시 말해 달라는 표현을, 말·글·그림 카드 중 편한 방법으로 아이미와 연습해요.',
      seasonTag: '[나 혼자 일주일 · 9화] 아니요, 괜찮습니다',
      nextEpisodeHook: '다음 시간 — 사서 선생님을 만나러 가요.',
      scenes: [
        {
          id: 'm6-l9-store-help',
          label: '물건 위치 묻기',
          imageSrc: '/lessons/story/m6/m6-l9-scene-01.webp',
          alt: '아이미가 말로도 글로도 그림으로도 되고 편한 방법이 정답이라고 안내하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미: "말로 해도, 글로 써도, 그림을 보여 줘도 돼요. 당신에게 편한 방법이 정답이에요."',
            '아이미: "말로 해도, 글로 써도, 그림을 보여 줘도 돼요. 당신에게 편한 방법이 정답이에요." 가게 연습이 시작됐습니다.',
            '아이미: "말로 해도, 글로 써도, 그림을 보여 줘도 돼요. 당신에게 편한 방법이 정답이에요." 가게 연습이 시작됐습니다. 윤아는 필요한 물건을 찾지 못했습니다.',
            '윤아는 편한 방법을 고를 자유가 있다고 느꼈습니다.',
          ),
        },
        {
          id: 'm6-l9-misunderstanding',
          label: '다른 물건을 안내받음',
          imageSrc: '/lessons/story/m6/m6-l9-scene-02.webp',
          alt: '상대가 다른 물건을 가리키고 윤아가 그림 카드로 다시 맞추는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '상대가 다른 물건을 가리켜 그림으로 다시 맞췄어요.',
            '상대는 윤아가 찾는 것과 다른 물건을 가리켰습니다. 윤아는 그림 카드를 다시 보여주며 "제가 찾는 것은 이 그림이에요"라고 표현했습니다.',
            '상대는 윤아가 찾는 것과 다른 물건을 가리켰습니다. 윤아는 그림 카드를 다시 보여주며 "제가 찾는 것은 이 그림이에요"라고 표현했습니다. 오해는 실패가 아니었습니다.',
            '윤아는 다시 표현하는 것이 자연스러운 과정이라고 느꼈습니다.',
          ),
        },
        {
          id: 'm6-l9-unwanted-offer',
          label: '원하지 않는 권유',
          imageSrc: '/lessons/story/m6/m6-l9-scene-03.webp',
          alt: '윤아가 아니요 괜찮습니다 필요한 것만 살게요 라고 분명하게 거절하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "아니요, 괜찮습니다. 필요한 것만 살게요."',
            '윤아: "아니요, 괜찮습니다. 필요한 것만 살게요." 아이미: "완벽한 거절이었어요."',
            '윤아: "아니요, 괜찮습니다. 필요한 것만 살게요." 아이미: "완벽한 거절이었어요. 상대가 웃어도, 내 뜻이 전해졌는지가 더 중요해요."',
            '윤아는 상대가 웃는지가 아니라 내 뜻이 정확히 전달되었는지가 중요하다고 느꼈습니다.',
          ),
        },
        {
          id: 'm6-l9-repeat-request',
          label: '네 가지 표현 만들기',
          imageSrc: '/lessons/story/m6/m6-l9-scene-04.webp',
          alt: '아이미가 네 가지 표현을 학생의 방법으로 만들어 보자며 도움 표현부터 청하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "이제 네 가지 표현을 당신의 방법으로 만들어 봐요."',
            '아이미: "이제 네 가지 표현을 당신의 방법으로 만들어 봐요. 첫 번째 — 도움이 필요할 때, 뭐라고 하겠어요?"',
            '아이미: "이제 네 가지 표현을 당신의 방법으로 만들어 봐요. 첫 번째 — 도움이 필요할 때, 뭐라고 하겠어요? 말, 글, 그림 다 좋아요."',
            '진우는 재설명 요청과 이해 확인도 중요한 표현이라고 생각했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '편한 표현 방법을 골라요',
          core: '말·글·그림 카드 중 상황에서 사용하기 편한 방법을 선택합니다.',
          detail: {
            full: '같은 뜻을 여러 방식으로 표현해 봐요.',
            light: '목소리를 내기 어려우면 카드나 글을 써요.',
            challenge: '말, 글, 그림 카드 중 어떤 방법을 써도 내 뜻과 권리는 같습니다.',
          },
        },
        {
          title: '도움·거절·재설명을 모두 연습해요',
          core: '부탁뿐 아니라 원하지 않을 때 거절하고 이해하기 어려울 때 다시 요청합니다.',
          detail: {
            full: '네 상황에 맞는 문장을 골라요.',
            light: '거절해도 나쁜 사람이 아니에요.',
            challenge: '괜찮다고 말하기, 거절하기, 천천히 말해 달라고 하기 모두 중요한 소통입니다.',
          },
          flow: { input: '상황·내 의도', process: '표현 방식·문장 선택', output: '도움·거절·재설명 표현' },
        },
        {
          title: '오해가 생기면 다시 맞춰요',
          core: '이름, 그림, 예시를 더해 내가 원하는 뜻을 다시 표현합니다.',
          detail: {
            full: '다른 물건이면 “이것이 아니에요”라고 말해요.',
            light: '상대가 이해했는지 확인해요.',
            challenge: '상호 이해를 확인하고 필요하면 표현 방식이나 정보 단서를 바꿉니다.',
          },
        },
      ],
    },
    encounter: {
      title: '인사만 잘하면 모든 소통이 끝날까',
      description: '도움 요청, 오해 수정, 원하지 않는 권유 거절, 재설명 요청이 모두 필요합니다.',
      facts: [
        '학생은 말·글·그림 카드 중 편한 방법을 고를 수 있습니다.',
        '상대가 다른 물건을 안내할 수 있습니다.',
        '원하지 않는 권유는 거절할 수 있습니다.',
        '어려운 설명은 천천히 다시 요청할 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '내 뜻을 가장 잘 지키는 소통 방법을 골라 보세요.',
      choices: [
        { id: 'always-say-yes-politely', emoji: '🙂', label: '친절해야 하므로 모든 권유에 예라고 말해요.', reaction: '원하지 않는 물건까지 사게 됐습니다.' },
        { id: 'use-own-expression', emoji: '💬', label: '말·글·그림 카드 중 편한 방법으로 도움·거절·재설명을 표현해요.', reaction: '아이미: "그 방법이면 충분히 전해져요. 소통에 한 가지 정답은 없어요."' },
        { id: 'leave-without-expression', emoji: '🚪', label: '오해가 생겨도 아무 표현 없이 떠나요.', reaction: '오해가 풀리지 않은 채 남았습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '도움을 요청하거나 거절할 상황과 사용할 표현 방법을 보여 주세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '상대의 오해, 원하지 않는 권유, 빠른 안내가 차례로 제시됩니다.',
      facts: [
        '상대가 다른 물건을 가리켰습니다.',
        '학생은 추가 상품을 원하지 않습니다.',
        '정류장 안내가 너무 빨라 이해하기 어렵습니다.',
        '말, 글, 그림 카드 표현을 모두 사용할 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '자기옹호 표현을 제안하는 AI',
      text: '인사만이 좋은 소통은 아닙니다. “이 그림의 물건을 찾고 있어요”, “아니요, 필요한 것만 살게요”, “천천히 다시 말해 주세요”를 말·글·그림 카드 중 편한 방법으로 사용해 보세요.',
      question: '상대가 이해하지 못하거나 내가 원하지 않을 때 어떤 표현을 사용할 수 있나요?',
    },
    artifact: {
      kind: 'action-card',
      title: '생활 표현 카드 4종',
      prompt: '인사, 도움 요청, 거절, 다시 말해 달라는 표현을 말·글·그림 카드 중 편한 방식으로 각각 만들어 보세요.',
    },
    transfer: {
      title: '정류장 안내가 어려울 때',
      description: '직원이 빠르게 설명해 이해하기 어렵습니다. 어떻게 하겠어요?',
      choices: [
        { id: 'pretend-understood', emoji: '🤐', label: '이해한 척하고 아무 방향으로 가요.', reaction: '잘못된 방향으로 가고 말았습니다.' },
        { id: 'ask-repeat-at-stop', emoji: '🔁', label: '천천히 다시 말해 달라고 요청하고 목적지를 다시 확인해요.', reaction: '다시 물으니 정확한 방향을 알 수 있었습니다.' },
        { id: 'agree-with-all-directions', emoji: '👍', label: '친절하게 보이려고 모든 방향에 맞다고 해요.', reaction: '정작 내가 가려던 목적지는 사라졌습니다.' },
      ],
    },
    safetyNote: PREPARED_LIFE_NOTE,
  };
