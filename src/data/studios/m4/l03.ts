import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_SAFETY_NOTE } from './shared';

export const M4_L3_STUDIO: StudioDefinition = {
    id: 'm4-privacy-clue-redaction',
    lessonId: 'm4-l3',
    moduleId: 'm4',
    title: '개인정보 단서 가리기',
    subtitle: '직접 정보와 함께 모이면 나를 알아볼 수 있는 간접 단서를 가려 봐요.',
    format: 'B',
    visualNovel: {
      title: '도움을 구하는 채팅 초안',
      objective: '아이미에게 보낼 글에서 나를 알아볼 수 있는 정보를 찾아 가리고, 필요한 조건만 남겨 안전한 부탁으로 고쳐요.',
      seasonTag: '[안전 지킴이 · 3화] 너무 많은 정보',
      nextEpisodeHook: '다음 시간 — 인증 코드를 달라는 메시지가?',
      scenes: [
        {
          id: 'm4-l3-draft',
          label: '초안 작성',
          imageSrc: '/lessons/story/m4/m4-l3-scene-01.webp',
          alt: '진우가 자세할수록 좋다며 이름 학교 하교 시간까지 다 적는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우: "자세할수록 좋겠지? 이름, 학교, 매일 혼자 나오는 시간까지 다 적었어!"',
            '진우: "자세할수록 좋겠지? 이름, 학교, 매일 혼자 나오는 시간까지 다 적었어!" 체험회 포스터 도움을 구하는 채팅이었습니다.',
            '진우: "자세할수록 좋겠지? 이름, 학교, 매일 혼자 나오는 시간까지 다 적었어!" 체험회 포스터 도움을 구하는 채팅이었습니다. 무엇이 꼭 필요한지는 아직 보지 않았습니다.',
            '진우는 자세히 쓸수록 좋은 요청이라고 생각했지만 윤아가 목적에 필요한지 물었습니다.',
          ),
        },
        {
          id: 'm4-l3-clue-layers',
          label: '정보 층 찾기',
          imageSrc: '/lessons/story/m4/m4-l3-scene-02.webp',
          alt: '윤아가 포스터 도움에 이름과 학교와 그 시간이 필요한지 하나씩 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "잠깐. 포스터 도움에 네 이름이 필요해? 학교는? 그 시간은?"',
            '윤아: "잠깐. 포스터 도움에 네 이름이 필요해? 학교는? 그 시간은?" 하나씩 짚어 보니 직접 단서와 간접 단서가 갈렸습니다.',
            '윤아: "잠깐. 포스터 도움에 네 이름이 필요해? 학교는? 그 시간은?" 하나씩 짚어 보니 직접 단서와 간접 단서가 갈렸습니다. 아직 무엇을 남길지는 정하지 않았습니다.',
            '윤아는 포스터 크기와 마감 시간만 있어도 도움을 받을 수 있다고 보았습니다.',
          ),
        },
        {
          id: 'm4-l3-minimum-needed',
          label: '필요한 만큼',
          imageSrc: '/lessons/story/m4/m4-l3-scene-03.webp',
          alt: '아이미가 크기와 오전이라는 조건만 있으면 도울 수 있다고 안내하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "A3 크기와 내일 오전이라는 조건만 있으면 저는 도울 수 있어요."',
            '아이미: "A3 크기와 내일 오전이라는 조건만 있으면 저는 도울 수 있어요. 나머지는 몰라도 돼요!"',
            '아이미: "A3 크기와 내일 오전이라는 조건만 있으면 저는 도울 수 있어요. 나머지는 몰라도 돼요!" 필요한 조건과 개인정보가 분리됐습니다.',
            '진우는 자세함과 안전함을 함께 지킬 수 있다는 것을 알았습니다.',
          ),
        },
        {
          id: 'm4-l3-before-after',
          label: '어떤 묶음을 가릴까?',
          imageSrc: '/lessons/story/m4/m4-l3-scene-04.webp',
          alt: '윤아가 이제 네 차례라며 어떤 묶음을 가리고 무엇을 남길지 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "이제 네 차례야. 어떤 묶음을 가리고, 무엇을 남기겠어?"',
            '윤아: "이제 네 차례야. 어떤 묶음을 가리고, 무엇을 남기겠어?"',
            '윤아: "이제 네 차례야. 어떤 묶음을 가리고, 무엇을 남기겠어? 부탁은 그대로 통해야 해."',
            '진우는 다음 요청에서도 보내기 전에 단서 층을 확인하기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '직접 단서와 간접 단서가 있어요',
          core: '이름뿐 아니라 학교, 위치, 반복 시간도 나를 알아볼 단서가 될 수 있습니다.',
          detail: {
            full: '이름과 장소, 시간을 찾아요.',
            light: '혼자 있을 때와 함께 모일 때 위험한 정보를 나눕니다.',
            challenge: '작은 정보도 여러 개가 모이면 누군지 알 수 있습니다.',
          },
        },
        {
          title: '목적에 필요한 정보만 남겨요',
          core: '요청을 처리하는 데 꼭 필요한 조건과 개인정보를 구분합니다.',
          detail: {
            full: '부탁과 관계없는 내 정보는 가려요.',
            light: '크기와 마감처럼 필요한 조건은 남깁니다.',
            challenge: '필요한 말은 남기고, 누군지 알 수 있는 정보는 줄입니다.',
          },
          flow: { input: '채팅 초안', process: '단서 가리기', output: '안전한 요청' },
        },
        {
          title: '보내기 전 조합을 다시 봐요',
          core: '각 항목이 안전해 보여도 함께 읽으면 나를 알아볼 수 있는지 확인합니다.',
          detail: {
            full: '가린 뒤 문장을 한 번 더 읽어요.',
            light: '누가 어디서 언제인지 알 수 있는지 확인합니다.',
            challenge: '마지막에는 어떤 정보인지뿐 아니라 누가 보고, 어디까지 퍼질지도 봅니다.',
          },
        },
      ],
    },
    encounter: {
      title: '포스터 도움 요청에 내 정보가 너무 많아요',
      description: '도움에 필요한 조건은 남기고 나를 알아볼 수 있는 단서는 가려야 합니다.',
      facts: [
        '초안에는 진우의 이름이 있습니다.',
        '학교 이름과 매일 하교하는 시간이 함께 있습니다.',
        '요청 목적은 포스터 글자 배치 도움입니다.',
        '포스터 크기와 마감 시간이 필요합니다.',
      ],
    },
    firstAttempt: {
      prompt: '먼저 가릴 정보 묶음을 골라 보세요.',
      choices: [
        { id: 'hide-name-only', emoji: '🙈', label: '이름만 가리고 학교와 반복 시간은 남겨요.', reaction: '학교와 반복 시간만 모여도 누군지 알아볼 수 있었습니다.' },
        { id: 'hide-identifiers', emoji: '🛡️', label: '이름, 학교, 반복 시간을 가려요.', reaction: '아이미: "가려도 부탁은 그대로 이해돼요. 안전과 도움, 둘 다 지켰어요!"' },
        { id: 'hide-task', emoji: '📝', label: '포스터 크기와 마감 조건을 가려요.', reaction: '정작 필요한 조건이 사라져 부탁이 통하지 않았습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그 정보를 가리는 까닭과 요청에 남길 내용을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '정보가 함께 모일 때 알 수 있는 생활 단서가 공개됩니다.',
      facts: [
        '이름은 개인을 직접 알아볼 수 있게 합니다.',
        '학교와 반복 시간은 만날 수 있는 장소와 때를 짐작하게 합니다.',
        '포스터 배치에는 학교 이름이 필요하지 않습니다.',
        '포스터 크기와 마감은 도움에 필요한 조건입니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '요청 목적과 개인정보를 분리하는 AI',
      text: '이름, 학교, 매일 하교 시간은 포스터 배치에 필요하지 않습니다. A3 크기와 내일 오전이라는 작업 조건만으로 요청을 이해할 수 있습니다.',
      question: '정보를 적게 남기면서도 부탁을 분명하게 만드는 방법은 무엇인가요?',
    },
    artifact: {
      kind: 'repair-card',
      title: '가리기 전후 안전 요청',
      prompt: '원래 초안, 가릴 직접·간접 단서, 남길 작업 조건, 고친 요청을 나란히 적어 보세요.',
    },
    transfer: {
      title: '분실물 문의 고치기',
      description: '분실물 사진을 찾으려고 집 주소와 혼자 있는 시간을 함께 쓰려 합니다. 어떻게 고치겠어요?',
      choices: [
        { id: 'share-all-details', emoji: '📣', label: '찾기 쉽도록 모든 정보를 공개해요.', reaction: '집 주소와 혼자 있는 시간까지 알려져 위험할 수 있었습니다.' },
        { id: 'keep-item-details', emoji: '🎒', label: '물건 특징과 잃어버린 공식 장소만 남겨요.', reaction: '필요한 정보만으로도 분실물을 찾을 수 있었습니다.' },
        { id: 'remove-purpose', emoji: '❌', label: '무엇을 잃어버렸는지도 모두 지워요.', reaction: '정작 무엇을 찾는지 알 수 없어 도움을 받지 못했습니다.' },
      ],
    },
    safetyNote: PREPARED_SAFETY_NOTE,
  };
