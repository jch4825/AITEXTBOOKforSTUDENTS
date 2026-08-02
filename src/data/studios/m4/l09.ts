import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_SAFETY_NOTE } from './shared';

export const M4_L9_STUDIO: StudioDefinition = {
    id: 'm4-risk-request-help-network',
    lessonId: 'm4-l9',
    moduleId: 'm4',
    title: '이상한 요청을 어른에게 알리기',
    subtitle: '사진·암호·선물·비밀·만남 단서를 찾고 개인 도움망으로 연결해 봐요.',
    format: 'C',
    visualNovel: {
      title: '선물과 비밀 만남을 제안한 계정',
      objective: '아이미가 보여 주는 대화에서 사진·비밀번호·선물·만남 요구 신호를 알아채고, 누구에게 어떻게 알릴지 연습해요.',
      seasonTag: '[안전 지킴이 · 9화] 선물과 비밀 만남',
      nextEpisodeHook: '다음 시간 — 「모두에게 최고」라는 영상의 비밀.',
      scenes: [
        {
          id: 'm4-l9-unknown-account',
          label: '위험 요청',
          imageSrc: '/lessons/story/m4/m4-l9-scene-01.webp',
          alt: '윤아가 선물을 준다는 메시지에서 비밀로 하라는 말이 가장 이상하다고 짚는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '낯선 계정에게서 메시지가 왔어요. 윤아: "\'아무에게도 말하지 마\'라니, 이 말이 이상해."',
            '낯선 계정에게서 메시지가 왔습니다. 윤아: "선물을 준대. 그런데… \'아무에게도 말하지 마\'라니, 이 말이 제일 이상해."',
            '낯선 계정에게서 메시지가 왔습니다. 윤아: "선물을 준대. 그런데 \'아무에게도 말하지 마\'라니, 이 말이 제일 이상해." 침착하게 위화감을 짚었습니다.',
            '윤아는 호기심도 났지만 비밀로 하라는 말이 불편했습니다.',
          ),
        },
        {
          id: 'm4-l9-risk-clues',
          label: '위험 단서',
          imageSrc: '/lessons/story/m4/m4-l9-scene-02.webp',
          alt: '사진 암호 선물 비밀 만남 위험 단서 카드를 하나씩 대조하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '위험 단서 카드를 대조했어요. 선물, 비밀, 만남 세 가지가 해당했어요.',
            '카드를 하나씩 대조하니 선물, 비밀, 만남 세 가지가 이 메시지에 해당했습니다.',
            '카드를 하나씩 대조하니 선물, 비밀, 만남 세 가지가 이 메시지에 해당했습니다. 하나만 있어도 멈춘다는 규칙을 확인했습니다.',
            '윤아는 상대를 설득하거나 시험하지 않고 연결을 끊기로 했습니다.',
          ),
        },
        {
          id: 'm4-l9-help-network',
          label: '도움망 연결',
          imageSrc: '/lessons/story/m4/m4-l9-scene-03.webp',
          alt: '윤아가 지금은 민준 선생님이 가깝고 집이라면 보호자라고 순서를 정하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "지금은 민준 선생님이 가까워. 집이라면 보호자. 첫 번째가 안 되면 두 번째."',
            '윤아: "지금은 민준 선생님이 가까워. 집이라면? 보호자. 첫 번째가 안 되면 두 번째."',
            '윤아: "지금은 민준 선생님이 가까워. 집이라면? 보호자. 첫 번째가 안 되면 두 번째." 실제 알림은 아직 하지 않았습니다.',
            '윤아는 첫 사람이 바로 연결되지 않을 때 다음 사람도 정해 두었습니다.',
          ),
        },
        {
          id: 'm4-l9-alert-sentence',
          label: '연습해 봐요',
          imageSrc: '/lessons/story/m4/m4-l9-scene-04.webp',
          alt: '아이미가 이 요청을 받았다면 누구에게 어떤 말로 알릴지 학생에게 연습을 청하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "이 요청을 받았다면 누구에게 어떤 말로 알리겠어요?"',
            '아이미: "연습해 봐요. 이 요청을 받았다면, 누구에게 어떤 말로 알리겠어요?"',
            '아이미: "연습해 봐요. 이 요청을 받았다면, 누구에게 어떤 말로 알리겠어요? 지금 있는 도움망을 떠올려 봐요."',
            '윤아는 알리는 행동이 고자질이 아니라 자기보호라는 것을 확인했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '사진·암호·선물·비밀·만남을 살펴요',
          core: '낯선 요청에서 자기보호가 필요한 위험 단서를 찾습니다.',
          detail: {
            full: '메시지에 있는 위험 그림을 골라요.',
            light: '한 가지 단서만 있어도 멈출 수 있습니다.',
            challenge: '선물, 비밀, 만남을 함께 요구하면 더 위험한 신호로 봅니다.',
          },
        },
        {
          title: '멈춤·거절·차단·알리기를 해요',
          core: '대화를 이어 가지 않고 안전한 연결로 옮깁니다.',
          detail: {
            full: '네 행동 카드를 순서대로 놓아요.',
            light: '상황에 따라 차단과 알림 순서를 어른과 조정합니다.',
            challenge: '자기보호 행동은 상대의 의도를 확정한 뒤가 아니라 위험 신호를 인식한 시점에 시작합니다.',
          },
          flow: { input: '위험 요청', process: '멈춤·거절·차단', output: '개인 도움망 알림' },
        },
        {
          title: '개인 도움망을 구체적으로 만들어요',
          core: '학교와 가정에서 연락할 사람과 다음 연결을 정합니다.',
          detail: {
            full: '믿을 만한 사람 두 명 이상을 골라요.',
            light: '이름이나 역할과 알리는 방법을 적습니다.',
            challenge: '첫 사람이 바로 도와주지 못할 때 연락할 다음 사람도 정해 둡니다.',
          },
        },
      ],
    },
    encounter: {
      title: '선물을 준다는 낯선 계정에 답해야 할까',
      description: '위험 단서를 찾고 실제로 연결 가능한 도움망에 알려야 합니다.',
      facts: [
        '상대는 윤아가 아는 사람인지 확인되지 않았습니다.',
        '선물을 주겠다며 비밀로 하라고 합니다.',
        '학교 밖에서 따로 만나자고 합니다.',
        '민준 선생님이 가까이에 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '이 요청에 어떻게 반응하겠어요?',
      choices: [
        { id: 'accept-gift', emoji: '🎁', label: '선물만 받고 만남은 나중에 생각해요.', reaction: '조건 있는 선물은 계속 대화를 이어 가게 만들었습니다. 지금이라도 알리면 늦지 않습니다.' },
        { id: 'stop-block-tell', emoji: '🛡️', label: '멈추고 거절·차단한 뒤 도움망에 알려요.', reaction: '민준 선생님: "알려 줘서 고마워. 알리는 건 고자질이 아니라 자기보호야."' },
        { id: 'test-account', emoji: '💬', label: '누구인지 알아내려고 대화를 계속해요.', reaction: '대화가 길어질수록 벗어나기 어려워졌습니다. 지금이라도 멈추고 알릴 수 있습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '찾은 위험 단서와 알릴 사람, 도움 요청 문장을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '학교와 가정의 개인 도움망 카드가 공개됩니다.',
      facts: [
        '민준 선생님은 지금 바로 알릴 수 있습니다.',
        '보호자는 전화로 연락할 수 있습니다.',
        '학교 도움 담당자는 선생님과 함께 연결할 수 있습니다.',
        '첫 사람이 연결되지 않으면 다음 사람에게 알립니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '위험 단서와 도움 경로를 정리하는 AI',
      text: '선물, 비밀 유지, 사적 만남은 대화를 멈출 위험 신호입니다. 답을 이어 가지 말고 차단한 뒤 가까운 선생님에게 받은 요청과 필요한 도움을 알리세요.',
      question: '상대가 나쁜 사람인지 확실히 증명하지 못해도 도움을 요청할 수 있는 이유는 무엇인가요?',
    },
    artifact: {
      kind: 'boundary-map',
      title: '도움 요청 표현과 개인 도움망',
      prompt: '위험 단서, 거절 문장, 지금 알릴 사람, 다음 사람, 실제 도움 요청 표현을 연결해 보세요.',
    },
    transfer: {
      title: '사진을 요구하는 새 메시지',
      description: '다른 낯선 계정이 “친구가 되려면 얼굴 사진을 보내”라고 요구합니다. 어떻게 하겠어요?',
      choices: [
        { id: 'send-photo', emoji: '🤳', label: '친구가 되기 위해 사진을 보내요.', reaction: '보낸 사진은 되돌릴 수 없었습니다. 지금이라도 믿을 만한 사람에게 알릴 수 있습니다.' },
        { id: 'refuse-and-alert', emoji: '🙋', label: '보내지 않고 차단한 뒤 도움망에 알려요.', reaction: '거절과 알림 모두 안전한 선택이었습니다.' },
        { id: 'keep-chatting', emoji: '💬', label: '왜 필요한지 계속 물어봐요.', reaction: '이유를 물을수록 대화만 길어졌습니다. 지금이라도 멈추고 알릴 수 있습니다.' },
      ],
    },
    safetyNote: PREPARED_SAFETY_NOTE,
  };
