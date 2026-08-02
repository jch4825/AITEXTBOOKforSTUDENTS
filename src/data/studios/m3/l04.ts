import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_LEARNING_NOTE } from './shared';

export const M3_L4_STUDIO: StudioDefinition = {
    id: 'm3-word-in-context-studio',
    lessonId: 'm3-l4',
    moduleId: 'm3',
    title: '낱말을 문장에서 써 보기',
    subtitle: '뜻과 반대말, 장면 단서를 살펴 낱말이 어울리는 내 문장을 만들어요.',
    format: 'B',
    visualNovel: {
      title: '“선명하다”가 어울리는 장면은',
      objective: '낱말의 뜻·반대말과 아이미의 예문을 장면과 비교하고, 그 낱말이 어울리는 내 문장을 만들어요.',
      seasonTag: '[공부 짝꿍 · 4화] 선명하다 소동',
      nextEpisodeHook: '다음 시간 — 비 오는 학교에 로봇이 혼자.',
      scenes: [
        {
          id: 'm3-l4-word-choice',
          label: '전시 낱말 발견',
          imageSrc: '/lessons/story/m3/m3-l4-scene-01.webp',
          alt: '윤아가 전시 제목에 선명하다를 써도 될지 고민하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '전시에 걸 사진 제목을 정하는 중이에요. 윤아: "‘선명하다’, 써도 될까?"',
            '전시에 걸 사진 제목을 정하는 중이었습니다. 윤아: "‘선명하다’… 멋진 말인데, 내 사진 제목에 써도 될까?"',
            '전시에 걸 사진 제목을 정하는 중이었습니다. 윤아: "‘선명하다’… 멋진 말인데 써도 될까?" 어떤 장면에 어울릴지 아직 확실하지 않았습니다.',
            '윤아는 멋있어 보이는 낱말을 바로 쓰지 않고 뜻과 장면을 확인했습니다.',
          ),
        },
        {
          id: 'm3-l4-scene-clues',
          label: '장면 첫 선택',
          imageSrc: '/lessons/story/m3/m3-l4-scene-02.webp',
          alt: '또렷한 사진과 흐린 사진을 비교해 반대말을 발견하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '또렷한 사진과 흐린 사진을 나란히 놓았어요. 반대말이 보이기 시작했어요.',
            '또렷한 사진과 흐린 사진을 나란히 놓자 "선명하다"의 반대말이 무엇인지 보이기 시작했습니다.',
            '또렷한 사진과 흐린 사진을 나란히 놓자 "선명하다"의 반대말이 무엇인지 보이기 시작했습니다. 눈에 보이는 차이가 단서였습니다.',
            '윤아는 눈에 보이는 차이를 이유로 첫 장면을 골랐습니다.',
          ),
        },
        {
          id: 'm3-l4-example-check',
          label: '예문 비교',
          imageSrc: '/lessons/story/m3/m3-l4-scene-03.webp',
          alt: '진우가 아이미의 예문 중 하나가 이상하다고 말하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미가 예문을 둘 만들었어요. 진우: "‘복도가 선명하게 조용하다’…? 이상한데?"',
            '아이미: "예문 둘을 만들었어요!" 진우: "‘복도가 선명하게 조용하다’…? 뭔가 이상한데?"',
            '아이미: "예문 둘을 만들었어요!" 진우: "‘복도가 선명하게 조용하다’…? 뭔가 이상한데?" 무엇이 이상한지는 아직 알 수 없었습니다.',
            '윤아는 AI 예문을 정답이 아니라 검토할 자료로 사용했습니다.',
          ),
        },
        {
          id: 'm3-l4-own-sentence',
          label: '어떤 문장을 만들겠어?',
          imageSrc: '/lessons/story/m3/m3-l4-scene-04.webp',
          alt: '윤아가 예문은 재료일 뿐이라며 학생에게 문장을 청하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "예문은 재료일 뿐이야. 너라면 어떤 문장을 만들겠어?"',
            '윤아: "예문은 재료일 뿐이야. 너라면 ‘선명하다’로 어떤 문장을 만들겠어?"',
            '윤아: "예문은 재료일 뿐이야. 너라면 ‘선명하다’로 어떤 문장을 만들겠어? 어울리는 장면도 함께 골라 봐."',
            '윤아는 문장을 소리 내어 읽고 장면과 뜻이 이어지는지 확인했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '낱말은 뜻과 쓰임을 함께 배워요',
          core: '사전 뜻을 실제 장면과 문장에 연결해야 낱말의 쓰임을 알 수 있습니다.',
          detail: {
            full: '낱말 뜻에 어울리는 그림을 찾아요.',
            light: '뜻, 장면, 문장을 함께 비교합니다.',
            challenge: '사전 뜻과 앞뒤 장면을 함께 봐야 낱말을 알맞게 쓸 수 있습니다.',
          },
        },
        {
          title: '반대말과 장면이 뜻의 경계를 보여 줘요',
          core: '반대말과 상황 그림은 낱말이 어울리는 범위를 찾는 단서입니다.',
          detail: {
            full: '또렷한 장면과 흐린 장면을 나누어요.',
            light: '낱말과 반대말이 어울리는 장면을 비교합니다.',
            challenge: '반대 관계는 문맥에 따라 달라질 수 있으므로 장면 속 대상과 상태를 함께 확인합니다.',
          },
        },
        {
          title: 'AI 예문도 문맥을 확인해요',
          core: 'AI가 만든 문장이 낱말 뜻과 실제 장면에 모두 맞는지 살펴봅니다.',
          detail: {
            full: '어울리는 예문과 어색한 예문을 골라요.',
            light: '어색한 부분을 고쳐 내 문장을 만듭니다.',
            challenge: '문장이 자연스러운지와 뜻이 장면에 맞는지를 따로 봅니다.',
          },
          flow: { input: '뜻·반대말·장면', process: '예문 비교', output: '내 문장' },
        },
      ],
    },
    encounter: {
      title: '멋진 낱말인데 이 장면에 맞을까',
      description: '“선명하다”의 뜻과 반대말, 세 장면, AI 예문을 비교해 전시 문장을 완성합니다.',
      facts: [
        '선명하다는 모양이나 색이 또렷하고 분명하다는 뜻입니다.',
        '흐릿하다는 반대되는 상태를 보여 줍니다.',
        '장면에는 또렷한 사진, 흐린 사진, 조용한 복도가 있습니다.',
        'AI 예문 중 하나는 뜻은 알지만 문맥에 어울리지 않습니다.',
      ],
    },
    firstAttempt: {
      prompt: '“선명하다”가 가장 잘 어울리는 장면을 먼저 골라 보세요.',
      choices: [
        { id: 'clear-photo', emoji: '📷', label: '나뭇잎 줄무늬가 또렷한 확대 사진이에요.', reaction: '아이미: "줄무늬가 또렷하게 보이는 장면이군요. \'선명하다\'와 딱 맞아요!"' },
        { id: 'blur-photo', emoji: '🌫️', label: '초점이 맞지 않아 흐린 운동장 사진이에요.', reaction: '이 장면엔 반대말 \'흐리다\'가 더 어울렸습니다.' },
        { id: 'quiet-hall', emoji: '🤫', label: '아무도 없어 조용한 복도예요.', reaction: '소리에는 \'조용하다\'라는 낱말의 자리가 따로 있었습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '내가 고른 장면의 어떤 단서가 낱말 뜻과 이어지는지 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '뜻, 반대말, 두 AI 예문을 실제 장면과 비교합니다.',
      facts: [
        '“사진이 선명하다”는 또렷한 장면과 맞습니다.',
        '“복도가 선명하게 조용하다”는 선명하다의 뜻과 맞지 않습니다.',
        '자연스럽게 들리는 문장도 의미가 어색할 수 있습니다.',
        '내 문장은 낱말이 가리키는 대상과 상태를 함께 담아야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '낱말 예문을 두 가지로 제안하는 AI',
      text: '예문 1은 “확대하니 나뭇잎 무늬가 선명하게 보였어요.”이고, 예문 2는 “복도가 선명하게 조용했어요.”입니다.',
      question: '어느 예문이 장면과 뜻에 맞으며, 어색한 예문은 어떻게 고치겠어요?',
    },
    artifact: {
      kind: 'action-card',
      title: '뜻-그림-내 문장 낱말 카드',
      prompt: '낱말 뜻, 반대말, 어울리는 그림, 고친 예문, 내 문장을 연결해 보세요.',
    },
    transfer: {
      title: '“조용하다”를 새 장면에 쓰기',
      description: '도서관, 운동회, 번개 사진 중 “조용하다”가 어울리는 장면과 문장을 만들어 보세요.',
      choices: [
        { id: 'library', emoji: '📚', label: '도서관 장면에 어울리는 문장을 만들어요.', reaction: '조용한 도서관에 딱 맞는 문장이 됐습니다.' },
        { id: 'sports-day', emoji: '📣', label: '응원 소리가 큰 운동회 장면과 비교해요.', reaction: '비교해 보니 운동회엔 어울리지 않는 낱말임이 분명해졌습니다.' },
        { id: 'own-context', emoji: '✍️', label: '내가 아는 조용한 상황으로 새 문장을 만들어요.', reaction: '내가 아는 장면이라 문장이 자연스러웠습니다.' },
      ],
    },
    safetyNote: PREPARED_LEARNING_NOTE,
  };
