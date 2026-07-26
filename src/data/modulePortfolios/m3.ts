import type { ModulePortfolioDefinition } from './types';

export const M3_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm3-l11',
  moduleId: 'm3',
  crumb: '3단원 · AI와 공부하기',
  kicker: '3단원 성장 포트폴리오',
  title: '나의 공부 도우미 도구함',
  description:
    '배움 전시회에서 만든 열 가지 공부 기록을 꺼내 AI가 도울 일, 내가 직접 생각하고 표현할 일, 결과를 확인할 근거가 보이는 공부 도구함을 완성합니다.',
  closingStory: [
    {
      id: 'm3-close-question',
      label: '새 친구의 질문',
      imageSrc: '/lessons/story/module-close/m3/m3-close-scene-01.webp',
      alt: '새 친구가 숙제를 AI가 모두 해도 되는지 묻는 장면',
      copy: '배움 전시회에서 새 친구가 물었습니다. “AI가 질문에도 답하고 글도 줄여 주는데, 숙제를 전부 맡겨도 돼?” 진우와 윤아는 말로만 대답하지 않고 이번 단원에서 만든 공부 기록을 펼쳤습니다.',
    },
    {
      id: 'm3-close-tools',
      label: '공부 도구 고르기',
      imageSrc: '/lessons/story/module-close/m3/m3-close-scene-02.webp',
      alt: '질문 계단 낱말 카드 계산 기록 요약과 같은 공부 도구를 서랍에 나누어 넣는 장면',
      copy: '질문을 깊게 만들기, 사전과 비교하기, 핵심 사실 지키기, 계산기로 확인하기, 원문 근거 찾기, 내 말로 설명하기가 서로 다른 서랍에 들어갔습니다. 각 서랍에는 AI가 도울 범위와 사람이 확인할 규칙을 붙였습니다.',
    },
    {
      id: 'm3-close-presentation',
      label: '도구함 발표',
      imageSrc: '/lessons/story/module-close/m3/m3-close-scene-03.webp',
      alt: '학생이 완성한 공부 도우미 도구함을 배움 전시회에서 발표하는 장면',
      copy: '두 학생은 “AI는 질문, 설명, 연습을 도울 수 있지만 제출할 생각과 표현은 내가 만들고 결과는 다른 근거로 확인해요”라고 발표했습니다. 새 친구도 자신의 공부 문제에 맞는 도구를 골라 보았습니다.',
    },
  ],
  studioLessonIds: [
    'm3-l1',
    'm3-l2',
    'm3-l3',
    'm3-l4',
    'm3-l5',
    'm3-l6',
    'm3-l7',
    'm3-l8',
    'm3-l9',
    'm3-l10',
  ],
  artifactChoices: [
    { lessonId: 'm3-l1', label: '깊은 질문', artifact: '질문 계단과 답 비교 기록' },
    { lessonId: 'm3-l2', label: '낱말 확인', artifact: '뜻-근거-예문-그림 낱말 카드' },
    { lessonId: 'm3-l3', label: '쉬운 설명', artifact: '정확성을 지킨 쉬운 설명 카드' },
    { lessonId: 'm3-l4', label: '문맥 속 낱말', artifact: '뜻-그림-내 문장 낱말 카드' },
    { lessonId: 'm3-l5', label: '이야기 창작', artifact: '3컷 이야기 보드와 선택 이유' },
    { lessonId: 'm3-l6', label: '계산 검산', artifact: '계산·검산·오류 수정 기록' },
    { lessonId: 'm3-l7', label: '근거 요약', artifact: '근거가 연결된 3문장 요약' },
    { lessonId: 'm3-l8', label: '학습 퀴즈', artifact: '문제-정답-해설 양면 카드' },
    { lessonId: 'm3-l9', label: '그림 근거', artifact: '그림 근거 표시와 수정 설명' },
    { lessonId: 'm3-l10', label: '자기 설명', artifact: '자기 설명과 다음 복습 카드' },
  ],
  guideSections: [
    {
      id: 'ai-help',
      title: 'AI가 도울 수 있는 일',
      prompt: '내가 고른 결과물에서 AI가 질문, 설명, 아이디어, 연습을 어떻게 도왔는지 적어 보세요.',
      placeholder: '예: AI는 같은 주제의 세 질문에 서로 다른 답 예시를 보여 주었어.',
    },
    {
      id: 'student-work',
      title: '내가 직접 할 일',
      prompt: '내가 먼저 생각하고, 선택하고, 고치고, 자기 말로 완성한 부분을 적어 보세요.',
      placeholder: '예: 과제 목적에 맞는 질문을 고르고 답을 내 말로 다시 설명했어.',
    },
    {
      id: 'verification-rule',
      title: '결과를 확인하는 규칙',
      prompt: '사전, 교과서, 계산기, 원문, 그림 중 어떤 근거로 AI 결과를 확인할지 적어 보세요.',
      placeholder: '예: 계산은 계산기로, 낱말은 학생 사전으로, 요약은 원문으로 확인할 거야.',
    },
  ],
  transferPrompt:
    '새 친구가 과학 숙제에서 모르는 낱말과 긴 설명을 만났습니다. AI에게 맡길 일, 친구가 먼저 할 일, 결과를 확인할 자료를 나누어 세 단계 공부 계획을 만들어 보세요.',
  nextChoices: [
    { id: 'think-first', emoji: '🧠', label: 'AI를 보기 전에 내 생각을 먼저 남길게요.' },
    { id: 'check-source', emoji: '🔎', label: '사전·교과서·계산기·원문으로 확인할게요.' },
    { id: 'own-expression', emoji: '✍️', label: '제출할 생각과 표현은 내 말로 완성할게요.' },
  ],
};
