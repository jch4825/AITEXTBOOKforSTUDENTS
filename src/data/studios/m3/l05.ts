import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';

export const M3_L5_STUDIO: StudioDefinition = {
    id: 'm3-story-choice-studio',
    lessonId: 'm3-l5',
    moduleId: 'm3',
    title: 'AI와 이야기를 함께 만들기',
    subtitle: 'AI의 제안을 재료로 보고 내 조건과 생각이 담긴 결말을 만들어요.',
    format: 'A',
    visualNovel: {
      title: '비 오는 학교에 남은 작은 로봇',
      objective: '내 이야기의 결말을 먼저 정하고, 아이미의 세 가지 제안을 골라 고쳐 내 결말을 완성해요.',
      seasonTag: '[공부 짝꿍 · 5화] 비 오는 날의 작은 로봇',
      nextEpisodeHook: '다음 시간 — 간식 합계가 두 가지로?',
      scenes: [
        {
          id: 'm3-l5-rainy-school',
          label: '이야기 시작',
          imageSrc: '/lessons/story/m3/m3-l5-scene-01.webp',
          alt: '비 오는 학교 복도에 작은 로봇이 혼자 남은 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우: "여기까지 썼는데… 다음이 안 떠올라."',
            '진우: "여기까지 썼는데… 다음이 안 떠올라." 비 오는 학교에 작은 로봇이 혼자 남은 장면까지 썼습니다.',
            '진우: "여기까지 썼는데… 다음이 안 떠올라." 비 오는 학교에 작은 로봇이 혼자 남은 장면까지 썼습니다. 다음 장면과 결말은 아직 정해지지 않았습니다.',
            '진우는 AI가 정하기 전에 자신이 원하는 이야기 느낌을 먼저 떠올렸습니다.',
          ),
        },
        {
          id: 'm3-l5-first-ending',
          label: '내 결말 먼저',
          imageSrc: '/lessons/story/m3/m3-l5-scene-02.webp',
          alt: '윤아가 원하는 기분부터 정하라고 하고 진우가 따뜻하게를 고르는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '진우: "따뜻하게. 로봇이 친구를 만나면 좋겠어."',
            '윤아: "아이미한테 묻기 전에, 네가 원하는 기분부터 정해. 무섭게? 따뜻하게?" 진우: "…따뜻하게. 로봇이 친구를 만나면 좋겠어."',
            '윤아: "아이미한테 묻기 전에, 네가 원하는 기분부터 정해. 무섭게? 따뜻하게?" 진우: "…따뜻하게. 로봇이 친구를 만나면 좋겠어." 창작의 방향을 먼저 정한 순간이었습니다.',
            '진우는 정답을 고르는 것이 아니라 자기 이야기의 방향을 정했습니다.',
          ),
        },
        {
          id: 'm3-l5-ai-endings',
          label: '결말 제안 비교',
          imageSrc: '/lessons/story/m3/m3-l5-scene-03.webp',
          alt: '진우가 무서운 제안을 거절해도 되는지 묻고 윤아가 당연하다고 답하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '진우: "1안은 무서워서 싫어. 거절해도 되지?"',
            '진우: "1안은 무서워서 싫어. 거절해도 되지?" 윤아: "당연하지. 네 이야기잖아."',
            '진우: "1안은 무서워서 싫어. 거절해도 되지?" 윤아: "당연하지. 네 이야기잖아." 아이미는 추격, 지도, 우산 세 결말을 제안했습니다.',
            '진우는 무서운 제안을 거절해도 창작을 잘못한 것이 아니라고 생각했습니다.',
          ),
        },
        {
          id: 'm3-l5-story-board',
          label: '작은 로봇은 어떻게 되나요?',
          imageSrc: '/lessons/story/m3/m3-l5-scene-04.webp',
          alt: '아이미가 마지막 장면을 부탁하며 로봇의 결말을 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "작은 로봇은 어떻게 되나요?"',
            '아이미: "그럼 마지막 장면을 부탁드려요. 작은 로봇은 어떻게 되나요?"',
            '아이미: "그럼 마지막 장면을 부탁드려요. 작은 로봇은 어떻게 되나요? 따뜻한 결말, 기대돼요!"',
            '진우는 이야기의 마지막 선택과 발표 책임이 자신에게 있음을 알았습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: 'AI 제안은 창작 재료예요',
          core: 'AI가 만든 장면과 결말은 여러 가능성 중 하나이며 그대로 따를 필요가 없습니다.',
          detail: {
            full: '마음에 드는 부분과 싫은 부분을 골라요.',
            light: 'AI 제안을 수용, 수정, 거절할 수 있습니다.',
            challenge: 'AI 제안이 잘 읽혀도 내가 원하는 이야기와 맞는지 따로 봅니다.',
          },
        },
        {
          title: '내 이야기 조건을 먼저 정해요',
          core: '분위기, 등장인물 목적, 안전 조건은 제안을 비교하는 기준이 됩니다.',
          detail: {
            full: '즐거움, 신기함, 조용함 중 원하는 느낌을 골라요.',
            light: '등장인물과 결말에 꼭 넣을 조건을 정합니다.',
            challenge: '내가 정한 조건은 생각을 줄이는 말이 아닙니다. 왜 골랐는지 분명하게 해 줍니다.',
          },
          flow: { input: '이야기 시작', process: '내 조건과 AI 제안 비교', output: '내 결말' },
        },
        {
          title: '선택 이유가 창작 과정을 보여 줘요',
          core: '어떤 제안을 고치고 왜 그렇게 결말을 정했는지 기록합니다.',
          detail: {
            full: '내가 고른 장면과 이유를 말해요.',
            light: 'AI 부분과 내가 만든 부분을 나눕니다.',
            challenge: '마지막 결과뿐 아니라 고르고, 고치고, 거절한 이유도 내 창작의 일부입니다.',
          },
        },
      ],
    },
    encounter: {
      title: '아직 결말이 없는 작은 로봇 이야기',
      description: '하나의 시작 사건에서 내 결말을 먼저 정하고 AI의 세 제안을 조건과 비교합니다.',
      facts: [
        '주인공은 작은 로봇입니다.',
        '장소는 비 오는 날의 학교입니다.',
        '친구가 등장해야 하고 무서운 장면은 넣지 않습니다.',
        '이야기는 시작, 가운데, 결말 세 장면으로 만듭니다.',
      ],
    },
    firstAttempt: {
      prompt: '작은 로봇 이야기의 결말을 AI 제안보다 먼저 골라 보세요.',
      choices: [
        { id: 'find-umbrella', emoji: '☂️', label: '친구와 우산을 찾아 함께 돌아가요.' },
        { id: 'mystery-map', emoji: '🗺️', label: '신기한 학교 지도를 발견해요.' },
        { id: 'own-ending', emoji: '✍️', label: '내가 생각한 다른 결말을 만들어요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '원하는 분위기와 결말에 꼭 들어갈 일을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: 'AI의 세 결말 제안과 함께 지킬 이야기 조건을 비교합니다.',
      facts: [
        '작은 로봇과 친구가 모두 등장해야 합니다.',
        '무서운 추격 장면은 넣지 않습니다.',
        '세 장면 안에서 사건이 이어져야 합니다.',
        'AI가 제안한 결말을 고치거나 사용하지 않아도 됩니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '서로 다른 세 결말을 제안하는 AI',
      text: '1안은 어두운 복도의 추격, 2안은 상자 속 신기한 지도, 3안은 친구와 우산을 찾아 함께 돌아가는 결말입니다.',
      question: '내 이야기 조건에 맞는 부분은 무엇이고 바꾸거나 거절할 부분은 무엇인가요?',
    },
    artifact: {
      kind: 'visual-plan',
      title: '3컷 이야기 보드와 선택 이유',
      prompt: '시작, 가운데, 결말을 세 칸에 놓고 AI 제안을 쓰거나, 고치거나, 거절한 이유를 적어 보세요.',
    },
    transfer: {
      title: '같은 시작을 다른 분위기로',
      description: '비 오는 학교와 작은 로봇은 그대로 두고 이야기 분위기만 바꿔 보세요.',
      choices: [
        { id: 'joyful-version', emoji: '🌈', label: '즐겁고 따뜻한 이야기로 바꿔요.' },
        { id: 'curious-version', emoji: '✨', label: '신기하고 궁금한 이야기로 바꿔요.' },
        { id: 'quiet-version', emoji: '🌙', label: '조용하고 편안한 이야기로 바꿔요.' },
      ],
    },
    safetyNote: '수업용 이야기 제안은 창작 재료입니다. 불편하거나 무서운 제안은 거절하고 내 생각에 맞게 바꿀 수 있습니다.',
  };
