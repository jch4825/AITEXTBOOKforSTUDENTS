import type { ModulePortfolioDefinition } from './types';

export const M4_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm4-l11',
  moduleId: 'm4',
  crumb: '4단원 · 안전하고 책임 있게 사용하기',
  kicker: '4단원 성장 포트폴리오',
  title: '나의 AI 안전 여권',
  description:
    '학교 AI 체험회 공개 전 안전 감사에서 모은 열 가지 기록을 꺼내 확인할 때, 보내기 전, 위험할 때 실제로 사용할 행동과 도움 요청 문장을 하나의 안전 여권으로 완성합니다.',
  closingStory: [
    {
      id: 'm4-close-final-audit',
      label: '최종 안전 점검',
      imageSrc: '/lessons/story/module-close/m4/m4-close-scene-01.webp',
      alt: '진우와 윤아가 체험회 공개 전 열 가지 안전 기록을 펼쳐 최종 점검하는 장면',
      copy: '체험회 공개를 앞두고 진우와 윤아는 시간표 확인 기록, 가린 요청과 사진, 거절 문장, 사용 계획, 도움망, 광고 판단 카드를 한자리에 펼쳤습니다. 각 기록에는 확인하기, 가리기, 거절하기, 믿을 만한 사람에게 알리기 도장이 남아 있었습니다.',
    },
    {
      id: 'm4-close-new-member',
      label: '새 동아리원 안내',
      imageSrc: '/lessons/story/module-close/m4/m4-close-scene-02.webp',
      alt: '새 동아리원이 세 가지 안전 상황을 묻고 학생이 기록을 근거로 안내하는 장면',
      copy: '새 동아리원이 자신 있는 AI 답, 정보가 보이는 사진, 비밀을 요구하는 메시지를 어떻게 해야 하는지 물었습니다. 두 학생은 정답 구호만 외우지 않고 각 상황에 맞는 확인 자료, 보호 행동, 도움 경로를 골라 실제 문장으로 설명했습니다.',
    },
    {
      id: 'm4-close-passport',
      label: '안전 여권 전달',
      imageSrc: '/lessons/story/module-close/m4/m4-close-scene-03.webp',
      alt: '학생이 안전 도장과 개인 도움망이 담긴 AI 안전 여권에 서명해 발표하는 장면',
      copy: '마지막으로 학생은 개인 도움망과 “같이 확인하고 도와주세요”라는 알림 문장을 적고 안전 여권에 서명했습니다. 보호막 문양이 완성되자 체험회는 지식을 아는 행사가 아니라 안전 행동을 실제로 수행하는 공간이 되었습니다.',
    },
  ],
  studioLessonIds: [
    'm4-l1',
    'm4-l2',
    'm4-l3',
    'm4-l4',
    'm4-l5',
    'm4-l6',
    'm4-l7',
    'm4-l8',
    'm4-l9',
    'm4-l10',
  ],
  artifactChoices: [
    { lessonId: 'm4-l1', label: '답 확인', artifact: 'AI 답 확인 기록' },
    { lessonId: 'm4-l2', label: '출처 비교', artifact: '출처 비교 카드' },
    { lessonId: 'm4-l3', label: '단서 가리기', artifact: '가리기 전후 안전 요청' },
    { lessonId: 'm4-l4', label: '보안 정보 거절', artifact: '거절·도움 요청 대화 카드' },
    { lessonId: 'm4-l5', label: '사진 점검', artifact: '사진 공유 전 확인 카드와 가린 이미지' },
    { lessonId: 'm4-l6', label: '불편한 내용 멈춤', artifact: '도움 요청 문장과 안전 행동 순서' },
    { lessonId: 'm4-l7', label: '존중하는 부탁', artifact: '전후 요청과 바꾼 이유 카드' },
    { lessonId: 'm4-l8', label: '사용·휴식 계획', artifact: '개인 사용·휴식 계획' },
    { lessonId: 'm4-l9', label: '위험 요청 알림', artifact: '도움 요청 표현과 개인 도움망' },
    { lessonId: 'm4-l10', label: '광고 판단', artifact: '광고 단서 표시판과 구매 판단 카드' },
  ],
  guideSections: [
    {
      id: 'verify',
      title: '확인할 때',
      prompt: 'AI 답이나 온라인 정보가 중요할 때 무엇을 어떤 독립 자료와 비교할지 적어 보세요.',
      placeholder: '예: AI 답의 날짜와 근거를 오늘 학교 공식 공지와 비교할 거야.',
    },
    {
      id: 'before-sharing',
      title: '보내기 전',
      prompt: '채팅이나 사진을 보내기 전에 가리거나 동의를 확인하거나 보내지 않을 정보를 적어 보세요.',
      placeholder: '예: 얼굴, 이름, 위치, 일정과 다른 사람이 보이는지 먼저 확인할 거야.',
    },
    {
      id: 'risk-and-help',
      title: '위험할 때·도움 요청',
      prompt: '멈춤·거절 뒤 연결할 사람과 실제로 말할 도움 요청 문장을 적어 보세요.',
      placeholder: '예: “불편한 요청을 받아서 화면을 멈췄어요. 같이 확인하고 도와주세요.”',
    },
  ],
  transferPrompt:
    '새 동아리원이 세 상황을 만났습니다. ① AI 답과 오늘 공지가 다름 ② 친구 얼굴과 위치가 보이는 사진을 공개하려 함 ③ 낯선 계정이 비밀 선물을 제안함. 각 상황에 확인·보호·도움 요청 행동과 실제 문장을 하나씩 연결해 보세요.',
  nextChoices: [
    { id: 'verify-official', emoji: '🔎', label: '중요한 답은 최신 공식 자료와 비교할게요.' },
    { id: 'protect-before-send', emoji: '🛡️', label: '보내기 전에 정보와 공유 범위를 살필게요.' },
    { id: 'stop-and-ask', emoji: '🙋', label: '위험하면 멈추고 도움망에 구체적으로 알릴게요.' },
  ],
};
