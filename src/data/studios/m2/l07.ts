import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_AI_NOTE } from './shared';

export const M2_L7_STUDIO: StudioDefinition = {
    id: 'm2-revision-criteria-lab',
    lessonId: 'm2-l7',
    moduleId: 'm2',
    title: '부족한 점을 다시 말해요',
    subtitle: '첫 답에서 지킬 사실과 고칠 표현을 구체적으로 나누어 봐요.',
    format: 'C',
    visualNovel: {
      title: '쉬워졌지만 장소와 시간이 사라졌어요',
      objective: '아이미의 첫 답에서 부족한 곳을 찾고, 지킬 사실을 정해서 구체적으로 다시 부탁해요.',
      seasonTag: '[부탁의 달인 · 7화] 사라진 시간과 장소',
      nextEpisodeHook: '다음 시간 — 전부 긴 문단으로 나왔다!',
      scenes: [
        {
          id: 'first-difficult-notice',
          label: '장면 1 · 첫 안내',
          imageSrc: '/lessons/story/m2/m2-l7-scene-01.webp',
          alt: '진우가 길고 어려운 첫 체험회 안내문을 더 쉽게 고쳐 달라 부탁하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '첫 체험회 안내문이 길고 어려웠어요. 진우: "더 쉽게 고쳐 줘!"',
            '첫 체험회 안내문은 사실은 맞지만 길고 어려웠습니다. 진우: "아이미야, 더 쉽게 고쳐 줘!"',
            '첫 체험회 안내문은 사실은 맞지만 문장이 낯설고 길었습니다. 진우: "너무 길고 어려워… 아이미야, 더 쉽게 고쳐 줘!"',
            '수정할 때는 불편한 점과 지킬 정보를 함께 찾아요.',
          ),
        },
        {
          id: 'easy-but-missing-facts',
          label: '장면 2 · 정보 누락',
          imageSrc: '/lessons/story/m2/m2-l7-scene-02.webp',
          alt: '아이미가 쉽게 만들었다고 하고 윤아가 시간과 장소를 되묻는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미: "쉽게 만들었어요!" 윤아: "그런데… 몇 시에 어디로 오라는 거지?"',
            '아이미: "쉽게 만들었어요!" 윤아: "정말 쉬워졌네. 그런데… 몇 시에 어디로 오라는 거지?"',
            '아이미: "쉽게 만들었어요!" 윤아: "정말 쉬워졌네. 그런데… 몇 시에 어디로 오라는 거지?" 시간과 장소가 통째로 사라져 있었습니다.',
            '부족한 점과 유지할 기준을 구체적으로 말해요.',
          ),
        },
        {
          id: 'lock-facts-mark-edits',
          label: '장면 3 · 기준을 넣은 재요청',
          imageSrc: '/lessons/story/m2/m2-l7-scene-03.webp',
          alt: '윤아가 빠지면 안 되는 것이 무엇이었는지 확인하는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "빠지면 안 되는 게 뭐였지? 시간, 장소, 준비물 말이야."',
            '윤아: "빠지면 안 되는 게 뭐였지? 시간, 장소, 준비물 같은 거 말이야."',
            '윤아: "빠지면 안 되는 게 뭐였지? 시간, 장소, 준비물 같은 거 말이야." 지킬 것과 고칠 것을 나누어 보기 시작했습니다.',
            '수정 기준이 구체적이면 전후 차이를 확인하기 쉬워요.',
          ),
        },
        {
          id: 'verified-revised-notice',
          label: '장면 4 · 무엇을 남기고 무엇을 바꿀까요?',
          imageSrc: '/lessons/story/m2/m2-l7-scene-04.webp',
          alt: '아이미가 무엇을 남기고 무엇을 바꿀지 학생에게 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "다시 고쳐 볼게요. 무엇은 남기고, 무엇을 바꿀까요?"',
            '아이미: "다시 고쳐 볼게요. 무엇은 꼭 남기고, 무엇을 바꿀까요?"',
            '아이미: "다시 고쳐 볼게요. 무엇은 꼭 남기고, 무엇을 바꿀까요? 기준을 알려 주시면 정확히 반영할게요."',
            '개선된 결과도 수정 기준과 원래 자료로 검토해요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '부족한 점을 구체적으로 말해요',
          core: '`마음에 안 들어` 대신 길이, 단어, 빠진 정보처럼 고칠 점을 말합니다.',
          detail: {
            full: '무엇이 불편한지 말해요.',
            light: '수정할 부분을 찾을 수 있는 기준을 한 가지 이상 넣습니다.',
            challenge: '관찰 가능한 수정 기준을 제시하면 원하는 변화와 결과의 차이를 평가할 수 있습니다.',
          },
        },
        {
          title: '지킬 사실을 함께 잠가요',
          core: '시간, 장소, 준비물처럼 바뀌면 안 되는 내용을 재요청에 포함합니다.',
          detail: {
            full: '중요한 내용은 남겨 달라고 해요.',
            light: '표현을 바꾸는 동안 유지할 사실을 따로 표시합니다.',
            challenge: '불변 조건을 명시하면 스타일 수정 과정에서 핵심 정보가 누락되거나 왜곡되는 위험을 줄입니다.',
          },
          flow: { input: '첫 답과 수정 기준', process: '유지·수정·삭제', output: '검토 가능한 개선본' },
        },
        {
          title: '수정 전후 차이를 확인해요',
          core: '좋아진 점, 그대로인 점, 새로 생긴 문제를 같은 기준표에 표시합니다.',
          detail: {
            full: '전과 후를 나란히 봐요.',
            light: '쉬워졌다는 느낌만 보지 않고 사실이 남았는지 확인합니다.',
            challenge: '전후 비교는 요청 수정의 효과뿐 아니라 의도하지 않은 정보 손실도 발견하게 합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '쉬워졌지만 장소와 시간이 사라졌어요',
      description: '진우가 긴 안내를 “더 쉽게” 고쳐 달라고 하자 시간과 장소가 빠진 짧은 안내가 나왔습니다.',
      facts: [
        '첫 안내의 시간과 장소는 공식 일정과 같습니다.',
        '어려운 단어와 긴 문장은 고쳐야 합니다.',
        '두 번째 안내에서는 시간과 장소가 빠졌습니다.',
      ],
    },
    firstAttempt: {
      prompt: '두 번째 안내를 보고 어떻게 다시 요청하겠습니까?',
      choices: [
        { id: 'say-dislike-only', emoji: '💬', label: '“아직 마음에 안 들어”라고만 말합니다.', reaction: '아이미가 무엇을 고칠지 몰라 엉뚱한 곳을 바꿨습니다.' },
        { id: 'lock-and-revise', emoji: '🔒', label: '지킬 사실과 고칠 표현을 함께 말합니다.', reaction: '아이미: "시간과 장소는 그대로, 어려운 낱말만 바꾸라는 거군요. 확실해요!"' },
        { id: 'use-missing-notice', emoji: '📄', label: '짧아졌으니 빠진 정보가 있어도 사용합니다.', reaction: '시간을 몰라 헤매는 친구가 생겼습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '반드시 유지해야 할 사실은 무엇인가요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '공식 일정표에서 오후 2시, 도서관, 색연필 준비가 반드시 유지되어야 한다는 사실을 확인했습니다.',
      facts: [
        '오후 2시는 행동을 결정하는 중요한 사실입니다.',
        '도서관은 빠지면 참가자가 다른 장소로 갈 수 있습니다.',
        '색연필은 활동 참여에 필요한 준비물입니다.',
        '어려운 용어는 쉬운 말로 바꾸되 세 사실은 남겨야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 수정 기준 제안',
      text: '“오후 2시, 도서관, 색연필은 꼭 남기고 어려운 단어를 쉬운 말로 바꾸어 세 문장으로 써 줘”라고 구체적으로 다시 요청할 수 있어요.',
      question: '수정 결과에서 좋아진 점과 새로 확인할 점은 무엇인가요?',
    },
    artifact: {
      kind: 'review-sheet',
      title: '수정 전후 차이와 수정 기준표',
      prompt: '첫 답, 유지할 사실, 수정할 표현, 삭제할 내용, 개선본과 확인 근거를 나란히 기록해 봐요.',
    },
    transfer: {
      title: '길지만 정확한 준비물 안내라면',
      description: '준비물 안내가 정확하지만 너무 길어 한눈에 읽기 어렵습니다.',
      choices: [
        { id: 'shorten-anything', emoji: '✂️', label: '중요한 내용도 빼고 무조건 짧게 만듭니다.', reaction: '짧아졌지만 정작 준비물 목록이 사라졌습니다.' },
        { id: 'preserve-items', emoji: '🔒', label: '준비물과 날짜는 지키고 설명만 줄여 달라고 합니다.', reaction: '짧고 정확한 안내문이 완성됐습니다.' },
        { id: 'ignore-long-text', emoji: '⏭️', label: '길다는 이유로 안내 전체를 버립니다.', reaction: '정확했던 정보까지 함께 잃어버렸습니다.' },
      ],
    },
    safetyNote: PREPARED_AI_NOTE,
  };
