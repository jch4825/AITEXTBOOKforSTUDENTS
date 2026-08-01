import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_PROBLEM_NOTE } from './shared';

export const M5_L8_STUDIO: StudioDefinition = {
    id: 'm5-goal-result-verification',
    lessonId: 'm5-l8',
    moduleId: 'm5',
    title: '목표와 결과를 비교하기',
    subtitle: '처음 정한 조건과 완성 결과를 나란히 놓고 독립된 방법으로 확인해요.',
    format: 'B',
    visualNovel: {
      title: '한 가지가 빠진 완성 안내문',
      objective: '아이미가 완성했다는 결과를 처음 조건표와 나란히 대조하고, 빠진 것을 찾아 채워요.',
      seasonTag: '[체험회 D-2 · 8화] 한 가지가 빠진 안내문',
      nextEpisodeHook: '다음 시간 — 프린터가 멈췄다!',
      scenes: [
        {
          id: 'm5-l8-finished-guide',
          label: '완성처럼 보이는 안내문',
          imageSrc: '/lessons/story/m5/m5-l8-scene-01.webp',
          alt: '아이미가 안내문 완성을 자랑하고 진우가 바로 붙이자며 좋아하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미: "안내문 완성! 제목도 장소도 멋지게 넣었어요!"',
            '아이미: "안내문 완성! 제목도 장소도 멋지게 넣었어요!" 진우: "오, 진짜 멋있다. 바로 붙이자!"',
            '아이미: "안내문 완성! 제목도 장소도 멋지게 넣었어요!" 진우: "오, 진짜 멋있다. 바로 붙이자!" 완성처럼 보이는 것의 유혹이었습니다.',
            '진우는 멋있어 보이는 결과를 바로 믿고 싶었습니다.',
          ),
        },
        {
          id: 'm5-l8-original-conditions',
          label: '처음 정한 조건',
          imageSrc: '/lessons/story/m5/m5-l8-scene-02.webp',
          alt: '윤아가 처음에 뭘 부탁했는지 요청 카드를 다시 펴 보자고 말하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아: "잠깐. 우리가 처음에 뭘 부탁했더라? 요청 카드를 다시 펴 보자."',
            '윤아: "잠깐. 우리가 처음에 뭘 부탁했더라? 요청 카드를 다시 펴 보자." 제목, 장소, 10시 시작 세 조건이 다시 보였습니다.',
            '윤아: "잠깐. 우리가 처음에 뭘 부탁했더라? 요청 카드를 다시 펴 보자." 제목, 장소, 10시 시작 세 조건이 다시 보였습니다. 완성 느낌과는 별개였습니다.',
            '윤아는 결과를 보기 전에 처음 조건부터 다시 확인하려 했습니다.',
          ),
        },
        {
          id: 'm5-l8-independent-check',
          label: '나란히 대조',
          imageSrc: '/lessons/story/m5/m5-l8-scene-03.webp',
          alt: '진우가 아이미한테 완성 맞냐고 물으려 하고 윤아가 조건표에 직접 표시하자고 말하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '진우: "아이미한테 완성 맞냐고 물어볼까?" 윤아: "아니, 조건표에 대고 우리가 직접 표시하자."',
            '진우: "아이미한테 완성 맞냐고 물어볼까?" 윤아: "아니, 조건표에 대고 우리가 직접 표시하자."',
            '진우: "아이미한테 완성 맞냐고 물어볼까?" 윤아: "아니, 조건표에 대고 우리가 직접 표시하자." 답을 만든 쪽의 "맞다"는 말만으로는 충분하지 않아 원래 자료나 다른 도구로 한 번 더 확인하려 했습니다.',
            '윤아는 만든 쪽에게 다시 묻는 대신 조건표로 직접 확인하려 했습니다.',
          ),
        },
        {
          id: 'm5-l8-corrected-result',
          label: '무엇이 빠졌지?',
          imageSrc: '/lessons/story/m5/m5-l8-scene-04.webp',
          alt: '윤아가 조건표와 안내문을 나란히 놓고 한 줄씩 대조해 보자고 청하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "조건표와 안내문을 나란히 놓았어. 한 줄씩 대조해 봐."',
            '윤아: "조건표와 안내문을 나란히 놓았어. 한 줄씩 대조해 봐 — 무엇이 빠졌지?"',
            '윤아: "조건표와 안내문을 나란히 놓았어. 한 줄씩 대조해 봐 — 무엇이 빠졌지? 제목, 장소, 시간 순서로 봐."',
            '민준쌤은 결과를 의심하는 것이 아니라 약속한 목표를 지키는 확인이라고 설명했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '처음 목표를 다시 펼쳐요',
          core: '완성 결과를 보기 전에 정한 조건을 검토 기준으로 사용합니다.',
          detail: {
            full: '처음 필요하다고 적은 것을 찾아요.',
            light: '결과와 목표를 나란히 놓아요.',
            challenge: '끝난 뒤 느낌만 보지 않습니다. 처음 정한 조건을 다시 꺼내 봅니다.',
          },
        },
        {
          title: '같음·빠짐·다름을 표시해요',
          core: '조건마다 결과가 맞는지 하나씩 확인합니다.',
          detail: {
            full: '맞는 것과 빠진 것을 표시해요.',
            light: '조건을 한 줄씩 확인해요.',
            challenge: '조건마다 결과에서 확인한 부분을 표에 적습니다.',
          },
          flow: { input: '처음 목표·완성 결과', process: '조건별 독립 확인', output: '수정·완료 판단' },
        },
        {
          title: '다른 방법으로 확인해요',
          core: '원래 카드, 계산기, 체크리스트, 사람의 확인처럼 결과 생성과 다른 근거를 씁니다.',
          detail: {
            full: '확인에 쓸 다른 자료를 골라요.',
            light: 'AI에게 같은 질문만 반복하지 않아요.',
            challenge: '같은 실수가 또 맞다고 넘어가지 않게 다른 자료로 확인합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '보기 좋은 안내문은 정말 완성일까',
      description: '원래 요청 카드와 결과를 조건별로 비교하고 빠진 정보를 찾아야 합니다.',
      facts: [
        '원래 조건은 제목, 장소, 시작 시간입니다.',
        '결과에는 제목과 장소가 있습니다.',
        '결과에는 시작 시간이 없습니다.',
        'AI의 “완성” 의견과 별도로 원래 조건표를 확인할 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '완료 여부를 가장 잘 확인하는 방법을 골라 보세요.',
      choices: [
        { id: 'trust-finished-message', emoji: '💬', label: 'AI가 완성했다고 했으니 바로 사용해요.', reaction: '10시 시작을 모르는 방문객이 생길 뻔했습니다.' },
        { id: 'use-checklist', emoji: '📋', label: '처음 조건표와 결과를 한 줄씩 나란히 확인해요.', reaction: '아이미: "대조해 보니… 아, 시작 시간이 빠졌네요! 알려 주셔서 고마워요."' },
        { id: 'judge-by-look', emoji: '✨', label: '보기 좋으면 필요한 내용도 모두 있다고 생각해요.', reaction: '멋진 디자인과 필요한 내용은 서로 다른 문제였습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '처음 조건 중 결과에 있는 것과 빠진 것을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '시작 시간이 빠졌다는 사실과 원래 요청 카드가 공개됩니다.',
      facts: [
        '제목 “AI 체험회”는 결과와 같습니다.',
        '장소 “도서관 앞”은 결과와 같습니다.',
        '시작 시간 “오전 10시”는 결과에 없습니다.',
        '수정 뒤 세 조건 전체를 다시 확인해야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '목표와 결과 비교를 돕는 AI',
      text: '제가 완성했다고 말했지만 원래 조건표와 비교하면 시작 시간이 빠졌습니다. 시간을 추가한 뒤 제목, 장소, 시간 세 항목을 모두 다시 확인해 주세요.',
      question: '결과를 만든 AI의 말과 별도로 어떤 자료를 확인 근거로 사용할 수 있나요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '목표-결과 검토표',
      prompt: '처음 조건, 결과에서 찾은 증거, 맞음·빠짐·다름, 수정 내용, 다시 확인한 방법을 적어 보세요.',
    },
    transfer: {
      title: '체험 인원 합계 확인',
      description: 'AI가 여러 모둠의 인원을 더해 합계를 제시했습니다. 어떻게 확인하겠어요?',
      choices: [
        { id: 'ask-ai-same-total', emoji: '🔁', label: '같은 AI에게 합계가 맞는지 다시 물어요.', reaction: '재질문은 확인이 아니라는 걸 8화에서도 배웠습니다. 같은 답이 그대로 돌아왔습니다.' },
        { id: 'calculator-check', emoji: '🧮', label: '원래 인원표를 보고 계산기나 직접 계산으로 확인해요.', reaction: '다른 방법으로 확인하니 차이가 바로 보였습니다.' },
        { id: 'choose-neat-number', emoji: '🎯', label: '보기 좋은 숫자를 맞는 답으로 골라요.', reaction: '보기 좋다고 맞는 숫자는 아니었습니다.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  };
