import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_AI_NOTE } from './shared';

export const M2_L4_STUDIO: StudioDefinition = {
    id: 'm2-example-comparison-lab',
    lessonId: 'm2-l4',
    moduleId: 'm2',
    title: '좋은 예시를 보여 줘요',
    subtitle: '좋은 예시와 틀린 예시가 결과에 주는 영향을 비교해 봐요.',
    format: 'B',
    visualNovel: {
      title: '안내 문구의 모양이 제각각',
      objective: '원하는 답의 예시를 하나 만들어 아이미에게 보여 주고, 예시를 주기 전과 후의 답을 비교해요.',
      seasonTag: '[부탁의 달인 · 4화] 제각각 안내 문구',
      nextEpisodeHook: '다음 시간 — 같은 안내를 두 사람에게.',
      scenes: [
        {
          id: 'verbal-format-only',
          label: '장면 1 · 말로만 설명',
          imageSrc: '/lessons/story/m2/m2-l4-scene-01.webp',
          alt: '진우가 한 줄로 멋지게 써 달라고만 부탁하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '체험회 안내 문구를 만들어야 해요. 진우: "한 줄로 멋지게 써 줘!"',
            '체험회 안내 문구를 만들어야 했습니다. 진우: "한 줄로 멋지게 써 줘!" 아이미: "멋지게…요? 최선을 다해 볼게요!"',
            '체험회 안내 문구를 만들어야 했습니다. 진우: "한 줄로 멋지게 써 줘!" 아이미: "멋지게…요? 알겠습니다!" 부탁할 때마다 모양이 달랐습니다.',
            '예시는 결과의 모양을 눈에 보이게 알려 줄 수 있어요.',
          ),
        },
        {
          id: 'three-example-results',
          label: '장면 2 · 세 가지 결과',
          imageSrc: '/lessons/story/m2/m2-l4-scene-02.webp',
          alt: '예시 없음 좋은 예시 틀린 예시에 따른 결과 세 가지를 비교하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '예시에 따라 결과가 달라졌어요. 틀린 날짜 예시는 그대로 따라 했어요.',
            '예시가 없을 때와 좋은 예시, 틀린 예시를 넣을 때 결과가 달랐습니다. 윤아는 틀린 날짜를 그대로 따라 한 결과를 보고 멈칫했습니다.',
            '아이미는 예시의 표현과 오류를 함께 따라 세 가지 서로 다른 결과를 만들었습니다. 윤아는 틀린 날짜를 그대로 따라 한 결과를 보고 멈칫했습니다.',
            '예시는 형식뿐 아니라 잘못된 내용도 따라가게 할 수 있어요.',
          ),
        },
        {
          id: 'inspect-example-criteria',
          label: '장면 3 · 예시 기준 확인',
          imageSrc: '/lessons/story/m2/m2-l4-scene-03.webp',
          alt: '윤아가 모양만 좋으면 되는지 확인 질문을 던지는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "모양만 좋으면 될까? 날짜가 틀렸는데?"',
            '윤아: "모양만 좋으면 될까? 날짜가 틀렸는데?" 무엇을 기준으로 예시를 골라야 할까요?',
            '윤아: "모양만 좋으면 될까? 날짜가 틀렸는데?" 내용, 길이, 형식 중 무엇을 기준으로 예시를 골라야 할지 살펴보았습니다.',
            '좋은 예시는 목적과 사실에 맞아야 해요.',
          ),
        },
        {
          id: 'desired-format-result',
          label: '장면 4 · 어떤 예시를 주시겠어요?',
          imageSrc: '/lessons/story/m2/m2-l4-scene-04.webp',
          alt: '아이미가 예시를 하나 보여 달라고 학생에게 청하는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "예시를 하나 보여 주시면 그 모양대로 만들게요."',
            '아이미: "예시를 하나 보여 주시면 그 모양대로 만들게요. 어떤 예시를 주시겠어요?"',
            '아이미: "예시를 하나 보여 주시면 그 모양대로 만들게요. 어떤 예시를 주시겠어요? 내용도 함께 확인해 주세요."',
            '예시를 넣어도 결과의 사실은 따로 확인해요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '예시는 결과의 모양을 보여 줘요',
          core: '원하는 답과 비슷한 한 가지 예시로 내용, 길이, 형식을 알려 줍니다.',
          detail: {
            full: '보고 따라 할 예를 보여 줘요.',
            light: '예시는 말로 설명하기 어려운 결과 모양을 구체적으로 보여 줍니다.',
            challenge: '예시는 출력 패턴의 구체적 기준을 제공해 결과의 구조적 일관성을 높일 수 있습니다.',
          },
          flow: { input: '요청과 한 가지 예시', process: '예시의 패턴 참고', output: '비슷한 모양의 결과' },
        },
        {
          title: '틀린 예시는 오류도 이끌어요',
          core: '예시의 날짜나 사실이 틀리면 AI 결과에도 같은 오류가 나타날 수 있습니다.',
          detail: {
            full: '예시가 맞는지 먼저 봐요.',
            light: '좋은 모양만 보지 않고 예시의 내용과 사실도 확인합니다.',
            challenge: '예시는 형식과 내용 모두에 영향을 주므로 잘못된 패턴을 제공하면 오류가 반복될 수 있습니다.',
          },
        },
        {
          title: '세 결과를 같은 기준으로 비교해요',
          core: '예시 없음, 좋은 예시, 틀린 예시의 결과를 내용·길이·형식 기준으로 비교합니다.',
          detail: {
            full: '무엇이 달라졌는지 찾아요.',
            light: '예시를 넣은 뒤 좋아진 점과 새로 생긴 오류를 함께 찾습니다.',
            challenge: '동일한 요청 조건에서 예시만 바꾸어 비교하면 예시가 결과에 미친 영향을 구분할 수 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '안내 문구의 모양이 제각각',
      description: '한 줄 안내를 부탁했지만 예시가 없어 결과의 길이와 형식이 제각각이었습니다.',
      facts: [
        '안내에는 날짜, 시간, 장소가 들어가야 합니다.',
        '결과는 게시판에 들어갈 한 줄 문장이어야 합니다.',
        '비교할 좋은 예시와 날짜가 틀린 예시가 준비되어 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '세 결과 중 어떤 예시를 요청에 사용하겠습니까?',
      choices: [
        { id: 'no-example', emoji: '❌', label: '예시 없이 “잘 만들어 줘”라고 합니다.', reaction: '이번에도 결과의 길이와 모양이 제각각으로 나왔습니다.' },
        { id: 'verified-example', emoji: '✅', label: '내용과 형식이 확인된 한 줄 예시를 사용합니다.', reaction: '아이미: "이 모양이군요! 이제 헤매지 않고 만들 수 있어요."' },
        { id: 'wrong-date-example', emoji: '⚠️', label: '모양만 예쁜 틀린 날짜 예시를 사용합니다.', reaction: '윤아: "예시가 틀리니까 결과도 그대로 틀려서 나왔어."' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그 예시가 좋은 기준이라고 판단한 까닭은 무엇인가요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '모양이 좋은 예시 하나에는 행사 날짜가 하루 빠르게 적혀 있다는 사실이 드러났습니다.',
      facts: [
        '공식 일정의 날짜는 18일입니다.',
        '틀린 예시에는 17일이라고 적혀 있습니다.',
        '좋은 예시는 날짜·시간·장소를 한 줄에 표시합니다.',
        '결과의 사실은 공식 일정과 다시 비교해야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 예시 검토',
      text: '형식이 보기 좋아도 날짜가 틀린 예시는 사용하지 않는 편이 좋아요. 확인된 내용으로 한 줄 예시를 새로 만든 뒤 요청에 넣어 주세요.',
      question: '아이미의 제안대로 예시를 고칠 때 어떤 사실을 잠가 둘까요?',
    },
    artifact: {
      kind: 'choice-board',
      title: '나의 좋은 예시 카드',
      prompt: '예시의 목적, 반드시 맞아야 할 내용, 길이, 형식과 사용 전 확인을 한 장에 적어 봐요.',
    },
    transfer: {
      title: '표 제목 예시를 만든다면',
      description: '준비물 표의 열 제목을 AI에게 만들게 하려고 합니다.',
      choices: [
        { id: 'table-no-example', emoji: '❌', label: '“표를 예쁘게 해 줘”라고만 합니다.', reaction: '표의 열 제목이 매번 다르게 나왔습니다.' },
        { id: 'table-good-example', emoji: '📌', label: '“물건 | 수량 | 담당” 예시를 보여 줍니다.', reaction: '예시와 똑같은 모양의 표가 나왔습니다.' },
        { id: 'table-wrong-example', emoji: '🚫', label: '수량과 담당이 뒤바뀐 예시를 그대로 넣습니다.', reaction: '표의 열 순서가 뒤바뀐 채로 나왔습니다.' },
      ],
    },
    safetyNote: PREPARED_AI_NOTE,
  };
