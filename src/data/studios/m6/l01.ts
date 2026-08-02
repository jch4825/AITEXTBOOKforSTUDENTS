import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_LIFE_NOTE } from './shared';

export const M6_L1_STUDIO: StudioDefinition = {
    id: 'm6-shopping-choice',
    lessonId: 'm6-l1',
    moduleId: 'm6',
    title: '조건에 맞는 장보기',
    subtitle: 'AI 목록을 실제 재고·가격·예산·알레르기 조건과 비교해 고쳐요.',
    format: 'C',
    visualNovel: {
      title: '조건을 모르는 아이미의 첫 장보기 목록',
      objective: '아이미의 장보기 목록을 재고·가격·예산·알레르기와 비교해, 빼거나 바꿔서 안전한 목록으로 고쳐요.',
      seasonTag: '[나 혼자 일주일 · 1화] 첫 장보기',
      nextEpisodeHook: '다음 시간 — 계산대에서 얼마를 내야 할까?',
      scenes: [
        {
          id: 'm6-l1-snack-purpose',
          label: '간식 준비 목적',
          imageSrc: '/lessons/story/m6/m6-l1-scene-01.webp',
          alt: '아이미가 자립 챌린지 첫 과제로 3초 만에 만든 장보기 목록을 자랑하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미: "자립 챌린지 첫 과제, 장보기! 목록은 제가 3초 만에 만들었어요. 요거트, 사과, 바나나, 견과류!"',
            '아이미: "자립 챌린지 첫 과제, 장보기! 목록은 제가 3초 만에 만들었어요. 요거트, 사과, 바나나, 견과류!"',
            '아이미: "자립 챌린지 첫 과제, 장보기! 목록은 제가 3초 만에 만들었어요. 요거트, 사과, 바나나, 견과류!" 인원만 보고 만든 목록이었습니다.',
            '윤아는 목록이 빨리 만들어져 편했지만 그대로 사도 되는지는 아직 모른다고 생각했습니다.',
          ),
        },
        {
          id: 'm6-l1-first-cart',
          label: '첫 장바구니',
          imageSrc: '/lessons/story/m6/m6-l1-scene-02.webp',
          alt: '진우가 아이미가 만들었으니 다 담자고 하고 윤아가 멈칫하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우: "아이미가 만들었으니 다 담자!" 윤아는 잠깐 멈칫했어요.',
            '진우: "아이미가 만들었으니 다 담자!" 윤아는 잠깐 멈칫했습니다. 무엇이 집에 있는지 아직 보지 않았습니다.',
            '진우: "아이미가 만들었으니 다 담자!" 윤아는 잠깐 멈칫했습니다. 무엇이 이미 있고 누구에게 안전하지 않은지 아직 확인하지 않았습니다.',
            '윤아는 장바구니를 채우기 전에 확인할 것이 있다고 느꼈습니다.',
          ),
        },
        {
          id: 'm6-l1-condition-cards',
          label: '실제 조건',
          imageSrc: '/lessons/story/m6/m6-l1-scene-03.webp',
          alt: '윤아가 바나나는 집에 있고 견과류 못 먹는 친구가 있다고 말하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "바나나는 집에 있어. 견과류 못 먹는 친구도 있잖아." 아이미: "그 정보는 없었어요!"',
            '윤아: "잠깐 — 바나나는 집에 있어. 그리고… 견과류 못 먹는 친구가 있잖아." 아이미: "아, 그 정보는 저한테 없었어요!"',
            '윤아: "바나나는 집에 있어. 견과류 못 먹는 친구가 있잖아." 아이미: "아, 그 정보는 저한테 없었어요!" 예산도 다시 봐야 했습니다.',
            '윤아는 AI 목록이 여전히 쓸모 있는 출발점이라고 생각했습니다.',
          ),
        },
        {
          id: 'm6-l1-revised-cart',
          label: '무엇을 빼고 바꾸시겠어요?',
          imageSrc: '/lessons/story/m6/m6-l1-scene-04.webp',
          alt: '아이미가 조건을 알았으니 다시 정하자며 무엇을 빼고 바꿀지 학생에게 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "조건을 알았으니 다시 정해요. 무엇을 빼고 바꾸시겠어요?"',
            '아이미: "조건을 알았으니 다시 정해요. 무엇을 빼고, 무엇을 바꾸시겠어요?"',
            '아이미: "조건을 알았으니 다시 정해요. 무엇을 빼고, 무엇을 바꾸시겠어요? 예산도 함께 봐 주세요."',
            '윤아는 AI가 목록을 도와도 마지막 구매 결정은 생활 조건을 아는 사람이 해야 한다고 느꼈습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '먼저 목적과 필요한 것을 확인해요',
          core: '사고 싶은 것과 활동에 꼭 필요한 것을 나눕니다.',
          detail: {
            full: '간식 준비에 꼭 필요한 품목을 찾아요.',
            light: '목적에 맞는지 한 품목씩 봐요.',
            challenge: '꼭 사야 할 것과 좋아해서 사고 싶은 것을 나누어 목록을 정합니다.',
          },
        },
        {
          title: '실제 조건과 항목별로 비교해요',
          core: '재고, 가격, 예산, 알레르기를 품목마다 확인합니다.',
          detail: {
            full: '이미 있음, 살 것, 바꿀 것을 표시해요.',
            light: '가격표와 안전 카드를 함께 봐요.',
            challenge: '각 항목에 보유 여부, 비용, 건강 제약을 연결해 충족 여부를 판정합니다.',
          },
          flow: { input: 'AI 초안 목록', process: '재고·가격·예산·건강 비교', output: '고친 최종 목록' },
        },
        {
          title: '삭제·대체·수량 수정을 결정해요',
          core: '맞지 않는 품목은 빼거나 안전한 대체품으로 바꿉니다.',
          detail: {
            full: '바꾼 이유를 목록 옆에 적어요.',
            light: '최종 합계를 계산기로 확인해요.',
            challenge: '무엇을 왜 고쳤는지 남겨 마지막 선택의 이유를 설명합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '아이미의 목록을 그대로 사도 될까',
      description: '간식 목적은 정했지만 실제 재고·가격·예산·알레르기 조건은 아직 반영되지 않았습니다.',
      facts: [
        'AI 초안에는 요거트, 사과, 바나나, 견과류가 있습니다.',
        '바나나는 이미 준비되어 있습니다.',
        '쓸 수 있는 예산은 1만 2천 원입니다.',
        '한 친구는 견과류 알레르기가 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '첫 장보기 목록을 어떻게 다룰지 골라 보세요.',
      choices: [
        { id: 'buy-ai-list', emoji: '🛒', label: 'AI가 골랐으니 네 품목을 모두 바로 사요.', reaction: '이미 있던 바나나가 두 배가 되고 위험한 견과류가 그대로 남았습니다.' },
        { id: 'revise-shopping-list', emoji: '📋', label: '재고·가격·예산·알레르기를 확인해 목록을 고쳐요.', reaction: '아이미: "항목마다 조건을 대 보니 목록이 훨씬 안전해졌어요!"' },
        { id: 'choose-cheapest-only', emoji: '🏷️', label: '필요와 안전은 보지 않고 가장 싼 것만 골라요.', reaction: '가격만 보고 고르니 정작 필요한 것과 안전은 놓쳤습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '빼거나 바꿀 품목과 그 이유를 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '실제 재고, 가격표, 예산, 알레르기 정보가 공개됩니다.',
      facts: [
        '바나나는 이미 있습니다.',
        '견과류는 한 친구에게 안전하지 않습니다.',
        '가격표의 실제 합계는 AI 예상과 다릅니다.',
        '대체 재료는 교사와 건강 정보를 확인한 뒤 고릅니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '목록 수정을 돕는 AI',
      text: '제 목록은 실제 재고와 건강 조건을 몰랐던 초안입니다. 이미 있는 바나나와 견과류를 빼고, 확인된 대체 재료와 필요한 수량을 넣은 뒤 계산기로 합계를 확인해 주세요.',
      question: '각 품목을 남기거나 바꾼 근거는 어떤 실제 자료에서 찾았나요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '장보기 판단표와 최종 목록',
      prompt: '품목, 필요한 이유, 재고, 실제 가격, 건강 조건, 삭제·대체·수량 수정, 최종 합계를 적어 보세요.',
    },
    transfer: {
      title: '학교 준비물을 산다면',
      description: 'AI가 공책, 색연필, 풀을 추천했지만 교실에 있는 물건과 예산은 아직 모릅니다. 어떻게 하겠어요?',
      choices: [
        { id: 'buy-school-list', emoji: '🎒', label: '추천된 준비물을 모두 바로 사요.', reaction: '교실에 이미 있던 물건까지 다시 사게 됐습니다.' },
        { id: 'check-school-supplies', emoji: '✅', label: '교실 재고·필요 수량·가격·예산을 확인해 목록을 고쳐요.', reaction: '확인해 보니 꼭 필요한 것만 사면 충분했습니다.' },
        { id: 'pick-brightest-supplies', emoji: '🌈', label: '가장 눈에 띄는 물건만 골라요.', reaction: '눈에 띄는 것과 필요한 것은 다를 수 있었습니다.' },
      ],
    },
    safetyNote: PREPARED_LIFE_NOTE,
  };
