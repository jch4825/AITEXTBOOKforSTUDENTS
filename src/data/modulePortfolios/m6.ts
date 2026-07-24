import type { ModulePortfolioDefinition } from './types';

export const M6_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm6-l12',
  moduleId: 'm6',
  crumb: '6단원 · AI와 생활하기',
  kicker: '6단원 졸업 포트폴리오',
  title: '나의 AI 생활 포트폴리오',
  description:
    '장보기, 계산, 길과 교통, 날씨, 음식 계획, 일정, 건강, 소통, 직업, 자기소개 기록을 연결해 마을 행사 하루를 계획하고 나의 AI 생활 원칙을 발표합니다.',
  storyHeading: '마을 생활 미션을 마친 나에게',
  artifactHeading: '생활 포트폴리오에 넣을 기록을 3개 이상 골라요',
  artifactDescription: '1차시부터 11차시까지 만든 모든 생활 판단 기록을 하루 계획에 연결할 수 있어요.',
  guideHeading: '나의 하루를 지키는 세 가지 생활 원칙',
  printLabel: '나의 AI 생활 포트폴리오 인쇄하기',
  completionRequirement:
    '탐구 기록 3개, 생활 원칙 세 칸, 잘한 과정 1개, 새 하루의 방법을 모두 남기면 졸업할 수 있어요.',
  closingStory: [
    {
      id: 'm6-close-town-day',
      label: '마을 행사 하루 계획',
      imageSrc: '',
      alt: '진우와 윤아가 예산 이동 날씨 소통 카드를 하루 타임라인에 놓는 장면을 위한 빈 이미지 자리',
      copy: 'AI 동아리의 마지막 미션은 친구와 마을 행사에 다녀오는 하루를 계획하는 일이었습니다. 학생들은 목적과 예산을 정하고 장보기, 이동, 공식 예보, 휴식, 도움 요청에 필요한 기록을 골라 시간 순서로 연결했습니다.',
    },
    {
      id: 'm6-close-condition-change',
      label: '조건이 바뀐 하루',
      imageSrc: '',
      alt: '교통 운행 변경과 비 예보가 나타나 학생들이 공식 정보와 사람 도움으로 계획을 고치는 장면을 위한 빈 이미지 자리',
      copy: '출발 직전 버스 운행과 오후 비 예보가 바뀌었습니다. 학생들은 AI의 처음 답을 고집하지 않고 최신 공식 공지와 현장 표지를 확인했습니다. 건강이나 안전이 불편할 때는 AI보다 가까운 어른에게 먼저 알리는 경로도 지도에 표시했습니다.',
    },
    {
      id: 'm6-close-graduation',
      label: '생활 원칙 졸업 발표',
      imageSrc: '',
      alt: '학생들이 완성한 하루 계획과 AI 생활 원칙을 발표하고 여섯 단원 졸업 책을 드는 장면을 위한 빈 이미지 자리',
      copy: '마지막 발표에서 학생들은 AI가 도운 초안, 실제 자료와 사람에게 확인한 내용, 자신이 고친 선택을 차례로 설명했습니다. “공식 자료로 확인하기, 건강과 안전은 사람에게 먼저 알리기, 내 정보와 마지막 선택은 내가 정하기”가 졸업 책의 생활 원칙이 되었습니다.',
    },
  ],
  studioLessonIds: [
    'm6-l1',
    'm6-l2',
    'm6-l3',
    'm6-l4',
    'm6-l5',
    'm6-l6',
    'm6-l7',
    'm6-l8',
    'm6-l9',
    'm6-l10',
    'm6-l11',
  ],
  artifactChoices: [
    { lessonId: 'm6-l1', label: '장보기 조건', artifact: '장보기 판단표와 최종 목록' },
    { lessonId: 'm6-l2', label: '돈 검산', artifact: '계산·검산 기록' },
    { lessonId: 'm6-l3', label: '지도 확인', artifact: '안전 경로 카드' },
    { lessonId: 'm6-l4', label: '교통 확인', artifact: '교통 확인 기록과 도움 요청 문장' },
    { lessonId: 'm6-l5', label: '날씨 준비', artifact: '나의 외출 준비 카드' },
    { lessonId: 'm6-l6', label: '음식 안전', artifact: '안전 음식 계획 카드' },
    { lessonId: 'm6-l7', label: '하루 계획', artifact: '전후 하루 계획표와 알림' },
    { lessonId: 'm6-l8', label: '건강 알림', artifact: '증상 전달 카드와 도움 요청 표현' },
    { lessonId: 'm6-l9', label: '자기옹호 소통', artifact: '생활 표현 카드 4종' },
    { lessonId: 'm6-l10', label: '직업 탐색', artifact: '나의 직업 탐색 카드' },
    { lessonId: 'm6-l11', label: '자기소개', artifact: '초안·변경 기록·최종 소개 2종' },
  ],
  guideSections: [
    {
      id: 'purpose-budget-plan',
      title: '목적·예산·하루 계획',
      prompt: '마을 행사에서 하고 싶은 일, 사용할 예산, 장보기와 휴식·도움 시간을 어떻게 확인할지 적어 보세요.',
      placeholder: '예: 필요한 간식만 목록에 남기고 계산기로 합계를 확인한 뒤 점심과 쉬는 시간을 넣을 거야.',
    },
    {
      id: 'movement-weather-check',
      title: '이동·날씨·조건 변화',
      prompt: '고정 지도와 공식 교통·날씨 정보에서 확인할 항목과 상황이 달라질 때 고칠 계획을 적어 보세요.',
      placeholder: '예: 번호와 방향, 오늘 운행 공지를 보고 비 시간이 바뀌면 이동과 준비물을 다시 정할 거야.',
    },
    {
      id: 'health-communication-boundary',
      title: '건강·소통·정보 범위',
      prompt: '몸이 불편하거나 설명이 어렵거나 개인정보를 물을 때 누구에게 어떤 방식으로 표현할지 적어 보세요.',
      placeholder: '예: 몸 상태는 AAC로 선생님께 먼저 알리고, 온라인에는 별칭과 취미만 소개할 거야.',
    },
  ],
  transferPrompt:
    '친구와 마을 행사에 가는 새 하루를 계획해 보세요. 예산 1만 5천 원, 버스 방향 변경, 오후 비, 간식 건강 조건, 휴식 시간, 도움 요청과 온라인 자기소개가 필요합니다. 어떤 AI 초안을 쓸지, 어떤 공식 자료와 사람에게 확인할지, 무엇을 내가 고칠지 연결하세요.',
  nextChoices: [
    { id: 'verify-life-info', emoji: '🔎', label: '돈·이동·날씨는 실제 자료와 공식 정보로 확인할게요.' },
    { id: 'human-first-safety', emoji: '🙋', label: '건강과 안전이 불편하면 AI보다 사람에게 먼저 알릴게요.' },
    { id: 'own-choice-and-boundary', emoji: '🛡️', label: '내 정보의 범위와 마지막 선택은 내가 정할게요.' },
  ],
};
