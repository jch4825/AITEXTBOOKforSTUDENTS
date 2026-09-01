import type { ModulePortfolioDefinition } from './types';

export const M2_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm2-l11',
  moduleId: 'm2',
  crumb: '2단원 · 내 뜻을 전하고 고쳐 묻기',
  kicker: '2단원 성장 포트폴리오',
  title: '나의 프롬프트 노트',
  description:
    '체험회 준비 과정에서 남긴 열 번의 요청 기록을 바탕으로, 첫 요청부터 수정 요청, 근거 확인, 최종 결정까지 이어지는 나만의 프롬프트 노트를 완성해 봐요.',
  closingStory: [
    {
      id: 'm2-close-question',
      label: '새 동아리원의 질문',
      imageSrc: '/lessons/story/module-close/m2/m2-close-scene-01.webp',
      alt: '새 동아리원이 AI에게 무엇을 어떻게 부탁해야 하는지 묻는 장면',
      copy: '[부탁의 달인 · 최종화] 체험회가 끝나고 새 동아리원이 들어왔습니다. 새 동아리원: "머릿속에는 하고 싶은 일이 있는데, 어떻게 말해야 할지 모르겠어." 진우: "그거, 우리도 딱 그랬어." 시즌 첫날의 진우와 똑같은 말이었습니다.',
    },
    {
      id: 'm2-close-assemble',
      label: '열 번의 기록 조립',
      imageSrc: '/lessons/story/module-close/m2/m2-close-scene-02.webp',
      alt: '열 차시의 요청 결과물을 펼쳐 프롬프트 노트를 조립하는 장면',
      copy: '윤아: "지난달 음악회 소동 기억나? \'아무거나\'의 함정도, 구멍 난 준비표도, 5시 종료 미스터리도." 진우: "그때마다 요청을 고치는 법을 하나씩 배웠지." 열 번의 사건마다 배운 것이 하나씩 있었습니다.',
    },
    {
      id: 'm2-close-share',
      label: '완성 노트 공유',
      imageSrc: '/lessons/story/module-close/m2/m2-close-scene-03.webp',
      alt: '완성한 프롬프트 노트를 새 동아리원에게 건네는 장면',
      copy: '이제 그 방법들을 카드로 모을 차례입니다. 목적 적기, 조건 넣기, 예시 보여 주기, 근거 확인하기… 윤아: "우리가 찾은 부탁의 기술을 카드로 모으자. 너의 첫 카드는 무엇이야?"',
    },
  ],
  studioLessonIds: [
    'm2-l1',
    'm2-l2',
    'm2-l3',
    'm2-l4',
    'm2-l5',
    'm2-l6',
    'm2-l7',
    'm2-l8',
    'm2-l9',
    'm2-l10',
  ],
  artifactChoices: [
    { lessonId: 'm2-l1', label: '빠진 정보', artifact: '요청 수정 카드' },
    { lessonId: 'm2-l2', label: '한 번에 한 목적', artifact: '분할 요청 대화선' },
    { lessonId: 'm2-l3', label: '맞는 대상', artifact: '전후 요청-결과 체크표' },
    { lessonId: 'm2-l4', label: '좋은 예시', artifact: '나의 좋은 예시 카드' },
    { lessonId: 'm2-l5', label: '읽을 사람과 말투', artifact: '읽을 사람별 안내 글 2종' },
    { lessonId: 'm2-l6', label: '작은 단계', artifact: '단계별 요청 제작 기록' },
    { lessonId: 'm2-l7', label: '수정 기준', artifact: '수정 전후 차이와 수정 기준표' },
    { lessonId: 'm2-l8', label: '답의 모양', artifact: '형식 규칙 체크 결과물' },
    { lessonId: 'm2-l9', label: '독립된 확인', artifact: '주장-근거 확인표' },
    { lessonId: 'm2-l10', label: '완전한 대화', artifact: '전체 대화·검증 기록' },
  ],
  guideSections: [
    {
      id: 'first-request',
      title: '처음 요청과 목적',
      prompt: '내가 이루려는 목적과 처음 보낸 요청을 적어 보세요. AI가 다르게 알아들을 수 있는 부분도 표시해 보세요.',
      placeholder: '예: 체험회 입구 안내를 만들고 싶어. 처음에는 “안내 만들어 줘”라고 썼어.',
    },
    {
      id: 'repair-request',
      title: '고친 요청과 달라진 결과',
      prompt: '빠진 정보, 대상, 예시, 단계, 형식 중 무엇을 더했는지와 결과가 어떻게 달라졌는지 적어 보세요.',
      placeholder: '예: 읽을 사람과 한 문장 형식을 더했더니 입구에서 바로 읽을 수 있는 안내가 나왔어.',
    },
    {
      id: 'evidence-decision',
      title: '확인 근거와 최종 판단',
      prompt: 'AI 답에서 확인한 주장, 비교한 자료, 최종 사용·수정·사용하지 않기 결정을 적어 보세요.',
      placeholder: '예: 최신 학교 공지와 시간을 비교했어. 장소 표현만 고쳐서 사용하기로 했어.',
    },
  ],
  transferPrompt:
    '새로 들어온 동아리 친구가 첫 요청 작성부터 결과 검토, 근거 확인, 최종 판단까지 스스로 해낼 수 있도록 돕는 세 단계 안내서를 만들어 봐요.',
  nextChoices: [
    { id: 'purpose-first', emoji: '🎯', label: '무엇을 왜 만들지 먼저 말할게요.' },
    { id: 'repair-with-criteria', emoji: '🧩', label: '부족한 점을 기준과 함께 고쳐 물을게요.' },
    { id: 'verify-before-use', emoji: '🔎', label: '중요한 사실은 다른 자료로 확인할게요.' },
  ],
};
