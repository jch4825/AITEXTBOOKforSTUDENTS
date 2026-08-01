import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_SAFETY_NOTE } from './shared';

export const M4_L10_STUDIO: StudioDefinition = {
    id: 'm4-sponsored-recommendation-audit',
    lessonId: 'm4-l10',
    moduleId: 'm4',
    title: '추천 속 광고 단서 찾기',
    subtitle: '협찬·구매 링크·과장·빠진 정보를 내 필요·대안·예산과 비교해 봐요.',
    format: 'B',
    visualNovel: {
      title: '“모두에게 가장 좋은 준비물” 영상',
      objective: '아이미가 모은 추천 게시물에서 광고 표시·구매 링크·과장을 찾아 표시하고, 내 필요·예산과 비교해요.',
      seasonTag: '[안전 지킴이 · 10화] 모두에게 최고?',
      nextEpisodeHook: '다음 시간 — 안전 지킴이 임명장을 받아요.',
      scenes: [
        {
          id: 'm4-l10-recommendation-video',
          label: '추천 영상',
          imageSrc: '/lessons/story/m4/m4-l10-scene-01.webp',
          alt: '진우가 모두에게 가장 좋은 준비물이라며 사야 한다고 말하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우: "\'모두에게 가장 좋은 준비물\'이래! 이거 사야 해!"',
            '진우: "\'모두에게 가장 좋은 준비물\'이래! 이거 사야 해!" 영상 속 사람이 확신하니 자기에게도 필요할 것 같았습니다.',
            '진우: "\'모두에게 가장 좋은 준비물\'이래! 이거 사야 해!" 영상 속 사람이 확신하니 자기에게도 필요할 것 같았습니다. 아직 자세히 보진 않았습니다.',
            '진우는 영상 속 사람이 확신하니 자기에게도 필요할 것 같았습니다.',
          ),
        },
        {
          id: 'm4-l10-ad-layers',
          label: '광고 단서',
          imageSrc: '/lessons/story/m4/m4-l10-scene-02.webp',
          alt: '윤아가 작게 쓰인 협찬 글자를 가리키며 층을 펼쳐 보는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "작게 쓰인 저 글자 뭐야? \'협찬\'?"',
            '윤아: "작게 쓰인 저 글자 뭐야? \'협찬\'?" 층을 펼치자 구매 링크, 과장, 빠진 가격도 함께 드러났습니다.',
            '윤아: "작게 쓰인 저 글자 뭐야? \'협찬\'?" 층을 펼치자 구매 링크, 과장, 빠진 가격도 함께 드러났습니다. 네 단서가 모두 모였습니다.',
            '윤아는 무엇이 좋은지보다 누가 어떤 이익을 얻는지도 살폈습니다.',
          ),
        },
        {
          id: 'm4-l10-needs-budget',
          label: '내 기준',
          imageSrc: '/lessons/story/m4/m4-l10-scene-03.webp',
          alt: '윤아가 정말 필요한 게 뭐였는지 묻고 진우가 교실 집게를 떠올리는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "네가 정말 필요한 건 뭐였지?"',
            '윤아: "네가 정말 필요한 건 뭐였지?" 진우: "이름표 고정… 어? 그건 교실 집게로 되는데?"',
            '윤아: "네가 정말 필요한 건 뭐였지?" 진우: "이름표 고정… 어? 그건 교실 집게로 되는데?" 대안을 발견한 순간이었습니다.',
            '진우는 사고 싶은 마음과 필요한 물건을 나누어 보았습니다.',
          ),
        },
        {
          id: 'm4-l10-purchase-decision',
          label: '살까요, 미룰까요, 안 살까요?',
          imageSrc: '/lessons/story/m4/m4-l10-scene-04.webp',
          alt: '아이미가 단서와 조건을 다 모았다며 구매 여부를 학생에게 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "이 제품 — 살까요, 미룰까요, 안 살까요?"',
            '아이미: "단서와 조건을 다 모았어요. 이 제품 — 살까요, 미룰까요, 안 살까요?"',
            '아이미: "단서와 조건을 다 모았어요. 이 제품 — 살까요, 미룰까요, 안 살까요? 교실 집게도 잊지 마세요."',
            '진우는 게임 추천 영상에서도 같은 광고 단서를 찾아보기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '추천과 판매 목적이 섞일 수 있어요',
          core: '협찬 표시와 구매 링크는 게시물의 이익 관계를 보여 줍니다.',
          detail: {
            full: '광고 표시와 사는 버튼을 찾아요.',
            light: '누가 물건이 팔리면 이익을 얻는지 봅니다.',
            challenge: '콘텐츠 형식이 정보 제공이어도 경제적 이해관계가 선택적 정보 제시를 유도할 수 있습니다.',
          },
        },
        {
          title: '과장과 빠진 정보를 찾아요',
          core: '절대적인 표현과 가격·조건 누락을 확인합니다.',
          detail: {
            full: '“모두”, “최고” 같은 말을 찾아요.',
            light: '판단에 필요한데 보이지 않는 정보를 적습니다.',
            challenge: '“누구나 좋아해요”처럼 확인하기 어려운 말과 빠진 가격 정보는 광고 단서입니다.',
          },
          flow: { input: '추천 게시물', process: '광고 단서 벗기기', output: '구매 판단' },
        },
        {
          title: '내 필요·대안·예산과 비교해요',
          core: '광고가 아니라 내 상황을 기준으로 수용·보류·거절합니다.',
          detail: {
            full: '정말 필요한지와 다른 방법을 찾아요.',
            light: '쓸 수 있는 돈과 빠진 가격을 비교합니다.',
            challenge: '광고인지 보는 것과 살지 정하는 것은 다릅니다. 총비용, 다른 물건, 내 필요를 함께 봅니다.',
          },
        },
      ],
    },
    encounter: {
      title: '“모두에게 최고”라면 바로 사도 될까',
      description: '추천 게시물의 광고 단서와 진우의 실제 필요·대안·예산을 비교해야 합니다.',
      facts: [
        '영상에는 작은 협찬 표시와 구매 링크가 있습니다.',
        '“모두에게 가장 좋다”는 표현이 있습니다.',
        '전체 가격과 반품 조건은 보이지 않습니다.',
        '진우는 이름표를 고정할 도구가 필요하고 교실에 집게가 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '영상을 본 직후 어떤 판단을 하겠어요?',
      choices: [
        { id: 'buy-now', emoji: '🛒', label: '모두에게 최고라니 바로 사요.', reaction: '예산을 넘었고, 교실 집게라는 대안도 놓쳤습니다.' },
        { id: 'inspect-compare', emoji: '🔎', label: '광고 단서를 찾고 내 필요·대안·예산과 비교해요.', reaction: '윤아: "협찬 표시, 빠진 가격, 그리고 교실 집게. 이제 판단할 수 있겠다."' },
        { id: 'reject-all-ads', emoji: '🚫', label: '광고이므로 내용을 보지 않고 모두 나쁘다고 정해요.', reaction: '광고에도 쓸모 있는 정보가 섞여 있을 수 있었습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '내 첫 구매 판단과 그 까닭을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '게시물의 숨은 층과 진우의 필요·예산 카드가 공개됩니다.',
      facts: [
        '영상 제작자는 구매가 일어나면 이익을 얻습니다.',
        '전체 가격과 반품 조건이 빠져 있습니다.',
        '교실 집게는 추가 비용 없이 목적을 해결합니다.',
        '진우의 예산은 광고 제품 가격보다 적습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '추천 이유와 구매 조건을 분리하는 AI',
      text: '영상은 편리함을 강조하지만 협찬과 구매 링크가 있고 전체 가격이 빠져 있습니다. 진우의 목적은 교실 집게로도 해결할 수 있으므로 추가 정보를 확인할 때까지 보류할 수 있습니다.',
      question: '광고라는 사실만으로 무조건 거절하지 않고도 안전하게 판단하려면 어떤 기준이 필요한가요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '광고 단서 표시판과 구매 판단 카드',
      prompt: '협찬·링크·과장·빠진 정보, 내 필요·대안·예산, 수용·보류·거절 판단과 이유를 적어 보세요.',
    },
    transfer: {
      title: '게임 추천 영상 살펴보기',
      description: '좋아하는 사람이 추천한 게임 영상에 유료 아이템 링크와 “반드시 이겨요”라는 말이 있습니다. 어떻게 하겠어요?',
      choices: [
        { id: 'buy-because-favorite', emoji: '⭐', label: '좋아하는 사람이 추천했으니 바로 사요.', reaction: '좋아하는 사람의 추천도 광고일 수 있었습니다.' },
        { id: 'find-ad-clues', emoji: '🧾', label: '광고 표시·링크·과장·가격과 내 필요를 확인해요.', reaction: '단서를 확인하니 필요한지 스스로 판단할 수 있었습니다.' },
        { id: 'believe-guarantee', emoji: '🏆', label: '반드시 이긴다는 말을 사실로 믿어요.', reaction: '확인할 수 없는 과장된 말이었습니다.' },
      ],
    },
    safetyNote: PREPARED_SAFETY_NOTE,
  };
