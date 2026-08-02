import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_AI_NOTE } from './shared';

export const M2_L8_STUDIO: StudioDefinition = {
    id: 'm2-output-format-studio',
    lessonId: 'm2-l8',
    moduleId: 'm2',
    title: '답의 모양을 정해요',
    subtitle: '목적에 맞는 표·번호 목록·한 문장 형식을 고르고 결과를 확인해 봐요.',
    format: 'B',
    visualNovel: {
      title: '모든 결과가 긴 문단으로 나왔어요',
      objective: '할 일에 맞는 형식(표·번호 목록·한 문장)을 골라 아이미에게 부탁하고, 답이 형식과 내용을 지켰는지 확인해요.',
      seasonTag: '[부탁의 달인 · 8화] 긴 문단 삼형제',
      nextEpisodeHook: '다음 시간 — 5시 종료? 진짜?',
      scenes: [
        {
          id: 'three-long-paragraphs',
          label: '장면 1 · 긴 문단 세 개',
          imageSrc: '/lessons/story/m2/m2-l8-scene-01.webp',
          alt: '진우가 시간표를 찾다가 긴 문단 속에서 헤매는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미가 만든 결과가 모두 긴 문단이었어요. 진우: "시간표 어디 있어?"',
            '아이미가 만든 결과가 모두 긴 문단이었습니다. 진우: "시간표 어디 있어?" 윤아: "이 긴 글 속 어딘가에…"',
            '아이미가 만든 세 결과가 모두 긴 문단이었습니다. 진우: "시간표 어디 있어?" 아이미: "정성껏 길게 써 보았습니다!"',
            '답의 모양은 일을 사용하는 방법에 맞아야 해요.',
          ),
        },
        {
          id: 'first-format-match',
          label: '장면 2 · 형식 첫 선택',
          imageSrc: '/lessons/story/m2/m2-l8-scene-02.webp',
          alt: '윤아가 시간표는 비교하려고 보는 거라며 어떤 모양이 좋을지 묻는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아: "시간표는 비교하려고 보는 거잖아. 어떤 모양이 좋지?"',
            '윤아: "시간표는 비교하려고 보는 거잖아. 그럼 어떤 모양이 좋지?"',
            '윤아: "시간표는 비교하려고 보는 거잖아. 그럼 어떤 모양이 좋지?" 표, 번호 목록, 한 문장 — 세 가지 모양이 있다는 걸 알게 됐습니다.',
            '짧은 답보다 목적에 맞는 구조가 중요해요.',
          ),
        },
        {
          id: 'compare-three-formats',
          label: '장면 3 · 세 형식 변환',
          imageSrc: '/lessons/story/m2/m2-l8-scene-03.webp',
          alt: '같은 내용을 표 목록 문장으로 바꾸어 비교하는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '같은 내용도 모양에 따라 다르게 읽혔어요. 표는 비교가, 번호 목록은 순서가 쉬웠어요.',
            '표는 시간을 비교하기 쉽고, 번호 목록은 순서를 따라 하기 쉬웠습니다.',
            '표는 시간을 비교하기 쉽고, 번호 목록은 순서를 따라 하기 쉬웠습니다. 한 문장은 기억하기 좋았습니다.',
            '형식을 바꾼 뒤 내용이 빠지지 않았는지 확인해요.',
          ),
        },
        {
          id: 'purpose-fit-results',
          label: '장면 4 · 어떤 모양으로 만들까요?',
          imageSrc: '/lessons/story/m2/m2-l8-scene-04.webp',
          alt: '아이미가 세 과제에 어떤 모양을 맡길지 학생에게 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "시간표, 설치 순서, 홍보 문구 — 어떤 모양으로 만들까요?"',
            '아이미: "시간표, 설치 순서, 홍보 문구 — 각각 어떤 모양으로 만들까요?"',
            '아이미: "시간표, 설치 순서, 홍보 문구 — 각각 어떤 모양으로 만들까요? 형식을 정하면 규칙도 함께 알려 주세요."',
            '형식을 지켰다는 것과 내용이 맞다는 것은 따로 확인해요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '목적에 맞는 형식을 골라요',
          core: '비교할 정보는 표, 실행 순서는 번호 목록, 기억할 문구는 한 문장을 활용할 수 있습니다.',
          detail: {
            full: '할 일에 맞는 답 모양을 골라요.',
            light: '읽는 사람이 결과로 무엇을 해야 하는지 생각합니다.',
            challenge: '정보 탐색, 순차 실행, 핵심 전달이라는 사용 목적에 따라 적절한 출력 구조가 달라집니다.',
          },
        },
        {
          title: '형식 규칙을 요청에 넣어요',
          core: '열 제목, 번호 수, 문장 길이처럼 확인할 수 있는 규칙을 말합니다.',
          detail: {
            full: '표와 목록의 규칙을 말해요.',
            light: '결과가 형식을 지켰는지 확인할 기준을 함께 정합니다.',
            challenge: '검증 가능한 형식 제약을 명시하면 결과의 준수 여부를 객관적으로 평가할 수 있습니다.',
          },
          flow: { input: '내용과 사용 목적', process: '형식 규칙 적용', output: '표·목록·한 문장' },
        },
        {
          title: '내용과 형식을 따로 확인해요',
          core: '원하는 모양이 나와도 중요한 정보가 빠지거나 달라지지 않았는지 확인합니다.',
          detail: {
            full: '모양과 내용을 모두 봐요.',
            light: '짧고 예쁜 결과만으로 좋은 답이라고 판단하지 않습니다.',
            challenge: '형식 준수와 내용 정확성은 독립된 평가 기준이므로 두 항목을 별도로 검토해야 합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '모든 결과가 긴 문단으로 나왔어요',
      description: '체험회 시간표, 설치 순서, 홍보 문구가 모두 긴 문단으로 나와 필요한 정보를 찾기 어렵습니다.',
      facts: [
        '시간표는 시간과 활동을 빠르게 비교해야 합니다.',
        '설치 순서는 차례대로 따라 해야 합니다.',
        '홍보 문구는 한눈에 기억할 수 있어야 합니다.',
      ],
    },
    firstAttempt: {
      prompt: '세 과제에 어떤 답의 모양을 연결하겠습니까?',
      choices: [
        { id: 'all-short-sentences', emoji: '✂️', label: '모두 가장 짧은 한 문장으로 만듭니다.', reaction: '시간표가 한 문장에 구겨져 시간 비교가 불가능해졌습니다.' },
        { id: 'match-purpose-format', emoji: '🎯', label: '시간표·번호 목록·한 문장을 목적에 맞게 나눕니다.', reaction: '윤아: "표는 비교, 번호는 순서, 한 문장은 홍보. 딱이야."' },
        { id: 'keep-long-paragraphs', emoji: '📌', label: '내용이 있으니 긴 문단을 그대로 둡니다.', reaction: '필요한 정보를 찾느라 한참 헤맸습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그 형식은 결과를 어떻게 사용하기 쉽게 만드나요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '시간표에는 세 활동의 시간 비교, 설치에는 네 단계의 순서, 홍보에는 20자 안의 핵심 문구가 필요합니다.',
      facts: [
        '시간표는 시간과 활동 두 열로 구성합니다.',
        '설치 목록은 1번부터 4번까지 번호를 붙입니다.',
        '홍보 문구는 20자 안의 한 문장으로 만듭니다.',
        '모든 결과에서 날짜와 장소가 유지되어야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 형식 비교',
      text: '시간표는 표, 설치는 번호 목록, 홍보는 한 문장으로 바꾸었어요. 형식은 맞지만 날짜와 장소가 모두 남았는지 따로 확인해 주세요.',
      question: '형식을 지킨 부분과 내용에서 수정할 부분은 무엇인가요?',
    },
    artifact: {
      kind: 'choice-board',
      title: '형식 규칙 체크 결과물',
      prompt: '과제 목적, 선택한 형식, 형식 규칙, 결과의 형식 준수와 내용 확인을 기록해 봐요.',
    },
    transfer: {
      title: '약속 일정을 알려 준다면',
      description: '세 번의 모임 날짜, 시간, 장소를 친구가 빠르게 비교할 수 있게 정리하려고 합니다.',
      choices: [
        { id: 'schedule-long-story', emoji: '📖', label: '모든 일정을 긴 이야기로 씁니다.', reaction: '세 번의 일정을 비교하기 어려웠습니다.' },
        { id: 'schedule-table', emoji: '📊', label: '날짜·시간·장소 열이 있는 표를 요청합니다.', reaction: '한눈에 비교되는 표가 나왔습니다.' },
        { id: 'schedule-one-word', emoji: '🔤', label: '짧게 만들기 위해 장소 이름만 남깁니다.', reaction: '날짜와 시간을 몰라 다시 물어봐야 했습니다.' },
      ],
    },
    safetyNote: PREPARED_AI_NOTE,
  };
