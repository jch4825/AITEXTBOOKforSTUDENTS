import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_AI_NOTE } from './shared';

export const M2_L9_STUDIO: StudioDefinition = {
    id: 'm2-independent-verification-lab',
    lessonId: 'm2-l9',
    moduleId: 'm2',
    title: '다시 묻기와 확인하기는 달라요',
    subtitle: 'AI의 재답변이 아니라 독립된 최신 근거로 주장을 확인해 봐요.',
    format: 'C',
    visualNovel: {
      title: '체험회가 5시에 끝난다고?',
      objective: '아이미 답의 주장 하나를 골라, 아이미에게 다시 묻는 대신 최신 학교 공지와 비교해 확인해요.',
      seasonTag: '[부탁의 달인 · 9화] 5시 종료 미스터리',
      nextEpisodeHook: '다음 시간 — 이제 진짜 대화를 완성할 시간.',
      scenes: [
        {
          id: 'confident-wrong-time',
          label: '장면 1 · 아이미의 주장',
          imageSrc: '/lessons/story/m2/m2-l9-scene-01.webp',
          alt: '아이미가 체험회 종료 시간을 자신 있게 잘못 말하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '체험회가 몇 시에 끝나는지 물었어요. 아이미: "오후 5시에 끝납니다!"',
            '체험회가 몇 시에 끝나는지 아이미에게 물었습니다. 아이미: "체험회는 오후 5시에 끝납니다! 확실해요!"',
            '체험회가 몇 시에 끝나는지 아이미에게 물었습니다. 아이미: "오후 5시에 끝납니다! 확실해요!" 출처는 보여 주지 않았습니다.',
            '자신 있게 말하는 표현은 정확성의 근거가 아니에요.',
          ),
        },
        {
          id: 'ask-ai-again',
          label: '장면 2 · 같은 AI에게 다시 묻기',
          imageSrc: '/lessons/story/m2/m2-l9-scene-02.webp',
          alt: '진우가 정말이냐고 다시 묻고 아이미가 더 확신 있게 반복하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '같은 AI에게 다시 물어봤어요. 진우: "정말이야?" 아이미: "더 확실해요!"',
            '같은 AI에게 다시 물어봤습니다. 진우: "정말이야?" 아이미: "정말입니다! 아까보다 더 확실해요!"',
            '같은 AI에게 다시 물어봤습니다. 아이미: "정말입니다! 아까보다 더 확실해요!" 윤아: "…더 확실해진 근거가 뭐야?"',
            '재답변과 독립 확인은 서로 달라요.',
          ),
        },
        {
          id: 'compare-source-cards',
          label: '장면 3 · 근거 자료 탐색',
          imageSrc: '/lessons/story/m2/m2-l9-scene-03.webp',
          alt: '최신 공지와 오래된 공지의 시간이 다르다는 것을 발견하는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "최신 공지엔 4시, 오래된 공지엔 5시야." 두 자료가 서로 달랐어요.',
            '윤아: "최신 공지엔 4시라고 써 있는데, 오래된 공지엔 5시야." 두 자료의 시간이 서로 달랐습니다.',
            '윤아: "최신 공지엔 4시라고 써 있는데, 오래된 공지엔 5시야." 두 자료의 시간이 서로 달랐습니다. 게시 날짜도 한 달 차이가 났습니다.',
            '주장과 직접 연결되는 최신 공식 자료를 찾아요.',
          ),
        },
        {
          id: 'correct-claim-with-evidence',
          label: '장면 4 · 어느 쪽을 근거로 삼을까?',
          imageSrc: '/lessons/story/m2/m2-l9-scene-04.webp',
          alt: '윤아가 두 자료 중 어느 쪽을 근거로 삼을지 학생에게 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "자료가 두 개인데 시간이 달라. 어느 쪽을 근거로 삼을까?"',
            '윤아: "자료가 두 개인데 시간이 달라. 어느 쪽을 근거로 삼아야 할까?"',
            '윤아: "자료가 두 개인데 시간이 달라. 어느 쪽을 근거로 삼아야 할까? 날짜를 한번 비교해 볼래?"',
            '확인은 AI와 다른 독립된 근거를 사용하는 일이에요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '주장을 하나 골라요',
          core: 'AI 답에서 날짜, 시간, 장소처럼 확인할 수 있는 문장을 찾습니다.',
          detail: {
            full: '맞는지 볼 문장을 골라요.',
            light: '느낌이나 말투보다 자료와 비교할 수 있는 주장을 표시합니다.',
            challenge: '검증 가능한 주장을 구체적으로 분리해야 어떤 근거가 필요한지 결정할 수 있습니다.',
          },
        },
        {
          title: '같은 AI의 재답변은 독립 근거가 아니에요',
          core: '`정말이야?`라고 다시 묻는 것만으로 사실 확인을 끝내지 않습니다.',
          detail: {
            full: '다른 믿을 만한 자료를 찾아요.',
            light: '같은 답을 반복해도 새로운 출처가 생긴 것은 아닙니다.',
            challenge: '동일한 시스템의 반복 응답은 오류 원인이 공유될 수 있으므로 독립된 검증으로 보기 어렵습니다.',
          },
          flow: { input: 'AI의 확인할 주장', process: '독립된 출처·날짜 비교', output: '근거로 수정한 판단' },
        },
        {
          title: '출처와 날짜를 확인해요',
          core: '공식 자료인지, 최신 자료인지, 담당자가 분명한지 봅니다.',
          detail: {
            full: '누가 언제 쓴 자료인지 봐요.',
            light: '오래된 공식 자료와 최신 공식 자료가 다르면 최신 변경을 확인합니다.',
            challenge: '출처의 권위뿐 아니라 게시 날짜, 적용 시점, 담당 범위를 함께 평가해야 현재 상황의 근거가 됩니다.',
          },
        },
      ],
    },
    encounter: {
      title: '체험회가 5시에 끝난다고?',
      description: '아이미는 체험회 종료 시간이 오후 5시라고 자신 있게 말했지만 출처를 보여 주지 않았습니다.',
      facts: [
        '종료 시간은 귀가 계획에 영향을 주는 주장입니다.',
        '아이미에게 다시 물어도 새로운 출처는 생기지 않았습니다.',
        '최신 학교 공지, 오래된 공지, 누가 쓴지 모르는 글을 비교할 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '아이미의 종료 시간 주장을 무엇으로 확인하겠습니까?',
      choices: [
        { id: 'ask-ai-really', emoji: '❓', label: '같은 AI에게 “정말이야?”라고 다시 묻습니다.', reaction: '아이미: "정말이에요! 세 번째로 확인해 드렸어요!" (같은 답이 세 번째 반복됐습니다.)' },
        { id: 'check-latest-official', emoji: '📰', label: '최신 학교 공지의 날짜와 담당자를 확인합니다.', reaction: '윤아: "오늘 날짜 공지네. 담당 선생님 성함도 있어."' },
        { id: 'trust-confident-tone', emoji: '🙈', label: '자신 있게 말했으니 그대로 믿습니다.', reaction: '5시에 맞춰 온 친구가 이미 끝난 행사장을 보았습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그 자료가 독립된 근거인 까닭은 무엇인가요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '최신 학교 공지는 오늘 게시되어 오후 4시 종료라고 알리고, 오후 5시 공지는 지난달 자료였습니다.',
      facts: [
        '최신 공지는 오늘 학교 담당자가 게시했습니다.',
        '오래된 공식 공지는 지난달 행사에 적용된 자료입니다.',
        '누가 쓴지 모르는 글에는 쓴 사람과 날짜가 없습니다.',
        '현재 체험회 종료 시간은 최신 공지의 오후 4시입니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 근거 인정',
      text: '제가 지난 자료와 비슷한 내용을 말했어요. 오늘 게시된 학교 공지가 현재 행사에 적용되는 독립된 근거이므로 종료 시간을 오후 4시로 수정해야 해요.',
      question: '아이미의 인정도 근거인가요, 공식 공지가 근거인가요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '주장-근거 확인표',
      prompt: '확인할 주장, 후보 자료, 출처, 날짜, 적용 범위, 최종 수정 내용을 연결해 봐요.',
    },
    transfer: {
      title: '동아리 장소를 확인한다면',
      description: 'AI는 오늘 동아리 모임이 과학실이라고 말하지만 최근 교실 공사가 있었습니다.',
      choices: [
        { id: 'ask-ai-place-again', emoji: '❓', label: '같은 AI에게 장소가 맞는지 반복해 묻습니다.', reaction: '같은 답을 반복해서 들었을 뿐 새 근거는 없었습니다.' },
        { id: 'check-latest-place-notice', emoji: '🏛️', label: '오늘 날짜의 학교 공지나 담당자에게 확인합니다.', reaction: '공사로 장소가 바뀐 사실을 확인할 수 있었습니다.' },
        { id: 'use-old-place-post', emoji: '📜', label: '지난달 과학실 안내를 그대로 사용합니다.', reaction: '바뀐 장소를 몰라 헤맬 뻔했습니다.' },
      ],
    },
    safetyNote: PREPARED_AI_NOTE,
  };
