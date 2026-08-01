import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_LEARNING_NOTE } from './shared';

export const M3_L2_STUDIO: StudioDefinition = {
    id: 'm3-word-evidence-lab',
    lessonId: 'm3-l2',
    moduleId: 'm3',
    title: '모르는 낱말 확인하기',
    subtitle: '문맥에서 뜻을 짐작하고 AI 설명과 학생 사전을 비교해 내 말로 적어 봐요.',
    format: 'B',
    visualNovel: {
      title: '전시 안내에서 만난 “생태계”',
      objective: '모르는 낱말의 뜻을 먼저 짐작하고, 아이미의 설명과 학생 사전을 비교해 내 말로 뜻을 적어요.',
      seasonTag: '[공부 짝꿍 · 2화] 낱말 「생태계」',
      nextEpisodeHook: '다음 시간 — 식물이 햇빛을 먹는다고?',
      scenes: [
        {
          id: 'm3-l2-word-found',
          label: '낱말 발견',
          imageSrc: '/lessons/story/m3/m3-l2-scene-01.webp',
          alt: '윤아가 전시 안내문에서 생태계라는 낱말을 발견하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아: "생태계? 이게 무슨 뜻이지?"',
            '윤아: "연못 생태계를 관찰해요… 생태계? 잠깐, 이게 무슨 뜻이지?"',
            '윤아: "연못 생태계를 관찰해요… 생태계? 잠깐, 이게 무슨 뜻이지?" 앞뒤 문장과 그림을 다시 살펴보았습니다.',
            '윤아는 모른다고 숨기지 않고 무엇을 확인할지 정했습니다.',
          ),
        },
        {
          id: 'm3-l2-first-guess',
          label: '뜻 짐작',
          imageSrc: '/lessons/story/m3/m3-l2-scene-02.webp',
          alt: '윤아가 연못 그림과 앞뒤 문장을 보고 생태계 뜻을 짐작하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "여러 생물이 함께 사는 곳 아닐까?"',
            '윤아: "그림엔 물, 풀, 물고기가 같이 있네. \'여러 생물이 함께 사는 곳\' 아닐까? 틀려도 괜찮아, 짐작이니까."',
            '윤아: "그림엔 물, 풀, 물고기가 같이 있네. \'여러 생물이 함께 사는 곳\' 아닐까? 틀려도 괜찮아, 짐작이니까." 근거도 함께 적어 두었습니다.',
            '윤아는 틀릴까 걱정하기보다 짐작과 근거를 나누어 적었습니다.',
          ),
        },
        {
          id: 'm3-l2-definition-compare',
          label: 'AI와 사전 비교',
          imageSrc: '/lessons/story/m3/m3-l2-scene-03.webp',
          alt: '진우가 아이미 설명과 사전이 조금 다르다며 무엇이 맞는지 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '진우: "아이미 말이랑 사전이 좀 다른데?"',
            '진우: "어? 아이미 말이랑 사전이 좀 다른데? 뭐가 맞는 거야?"',
            '진우: "어? 아이미 말이랑 사전이 좀 다른데? 뭐가 맞는 거야?" 두 설명에서 같이 나온 말을 찾기 시작했습니다.',
            '윤아는 한 설명을 고르는 대신 두 자료가 함께 지지하는 뜻을 찾았습니다.',
          ),
        },
        {
          id: 'm3-l2-word-card',
          label: '너라면 뭐라고 적겠어?',
          imageSrc: '/lessons/story/m3/m3-l2-scene-04.webp',
          alt: '윤아가 생태계를 뭐라고 적을지 학생에게 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "너라면 \'생태계\'를 뭐라고 적겠어?"',
            '윤아: "두 설명에서 같이 나온 말을 찾아보자. 너라면 \'생태계\'를 뭐라고 적겠어?"',
            '윤아: "두 설명에서 같이 나온 말을 찾아보자. 너라면 \'생태계\'를 뭐라고 적겠어? 예문이랑 그림도 같이 붙여 보자."',
            '윤아는 다음 낱말도 짐작, 비교, 자기 설명 순서로 확인하기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '문맥에서 먼저 뜻을 짐작해요',
          core: '앞뒤 문장과 그림은 낱말 뜻을 짐작하는 단서가 됩니다.',
          detail: {
            full: '낱말 주변에서 보이는 단서를 골라요.',
            light: '첫 짐작과 그 까닭을 함께 적습니다.',
            challenge: '앞뒤 말로 한 첫 짐작은 아직 정답이 아닙니다. 사전과 원문을 보고 다시 확인합니다.',
          },
        },
        {
          title: 'AI 설명은 시작점이에요',
          core: 'AI의 낱말 설명은 학생 사전이나 교과서와 비교합니다.',
          detail: {
            full: '두 설명에서 같은 말을 찾아요.',
            light: '공통점과 차이점을 나누어 봅니다.',
            challenge: '정의의 표현뿐 아니라 포함하는 대상과 제외하는 범위가 같은지도 확인합니다.',
          },
          flow: { input: '첫 짐작', process: 'AI·사전 비교', output: '확인한 뜻' },
        },
        {
          title: '뜻과 쓰임을 내 말로 연결해요',
          core: '확인한 뜻을 예문과 그림에 연결하면 낱말의 쓰임을 알 수 있습니다.',
          detail: {
            full: '뜻에 맞는 예문과 그림을 골라요.',
            light: '내 말로 뜻을 적고 문장을 만듭니다.',
            challenge: '내 말 설명은 사전 문장을 조금 바꾸는 일이 아닙니다. 뜻을 알고 새 장면에 맞게 말합니다.',
          },
        },
      ],
    },
    encounter: {
      title: 'AI 설명과 사전 설명이 조금 달라요',
      description: '전시 안내문의 “생태계”를 문맥에서 짐작하고 두 설명의 공통 핵심을 찾아야 합니다.',
      facts: [
        '원문은 “연못 생태계를 관찰해요”입니다.',
        '그림에는 물, 식물, 물고기, 곤충이 있습니다.',
        'AI 설명은 생물들이 함께 사는 관계를 강조합니다.',
        '학생 사전은 생물과 환경이 서로 영향을 주는 범위를 포함합니다.',
      ],
    },
    firstAttempt: {
      prompt: '문장과 그림만 보고 “생태계”의 뜻을 먼저 짐작해 보세요.',
      choices: [
        { id: 'only-animals', emoji: '🐟', label: '동물이 많이 모인 곳이에요.', reaction: '아이미: "가까워요! 그림을 다시 보면 동물 말고도 있는 게 있어요."' },
        { id: 'living-and-environment', emoji: '🌿', label: '생물과 주변 환경이 함께 이어진 모습이에요.', reaction: '아이미: "오, 그림의 물과 햇빛까지 보셨군요!"' },
        { id: 'exhibition-tool', emoji: '🧰', label: '전시에 쓰는 관찰 도구예요.', reaction: '문장에 다시 넣어 보니 뜻이 어색하게 들렸습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '내 짐작을 도운 문장이나 그림 단서를 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: 'AI 설명과 학생 사전 정의를 함께 확인합니다.',
      facts: [
        'AI 설명에는 “생물들이 서로 관계를 맺는 모습”이 있습니다.',
        '학생 사전에는 “생물과 환경이 서로 영향을 주는 체계”가 있습니다.',
        '두 설명 모두 생물 사이의 관계를 포함합니다.',
        '사전은 물과 햇빛 같은 환경까지 범위를 넓힙니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '낱말 뜻을 한 가지 방식으로 설명하는 AI',
      text: '생태계는 여러 생물이 서로 도움을 주거나 영향을 주며 함께 살아가는 모습이에요.',
      question: '학생 사전과 비교했을 때 이 설명에 더해야 할 핵심은 무엇인가요?',
    },
    artifact: {
      kind: 'review-sheet',
      title: '뜻-근거-예문-그림 낱말 카드',
      prompt: '첫 짐작, AI와 사전의 공통 핵심, 내 말 뜻, 예문, 그림을 한 카드에 정리해 보세요.',
    },
    transfer: {
      title: '새 낱말 “서식지” 확인하기',
      description: '“여우의 서식지를 보호해요”라는 문장에서 같은 방법을 사용해 보세요.',
      choices: [
        { id: 'guess-context', emoji: '🦊', label: '문장과 그림으로 뜻을 먼저 짐작해요.', reaction: '좋은 첫걸음이에요! 이제 짐작을 확인할 차례예요.' },
        { id: 'compare-dictionary', emoji: '📖', label: 'AI 설명과 학생 사전을 비교해요.', reaction: '두 설명의 공통점이 뜻을 더 분명하게 해 줬어요.' },
        { id: 'own-example', emoji: '✍️', label: '확인한 뜻으로 내 예문을 만들어요.', reaction: '내 예문으로 뜻을 확실히 익힐 수 있었어요.' },
      ],
    },
    safetyNote: PREPARED_LEARNING_NOTE,
  };
