import { DiagnosticAnswers, DiagnosticPurpose } from '../types';

type QuestionId = keyof DiagnosticAnswers;

export interface DiagnosticOption {
  label: string;
  value: DiagnosticPurpose | number;
}

export interface DiagnosticQuestion {
  id: QuestionId;
  title: string;
  options: DiagnosticOption[];
}

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 'q1',
    title: '이 도구를 어디에 가장 먼저 사용하고 싶으신가요?',
    options: [
      { label: '수업 준비와 진행', value: 'class' },
      { label: '행정 업무 효율화', value: 'admin' },
      { label: '동료 교사 연수 자료 마련', value: 'share' },
      { label: '인공지능 윤리 및 안전 교육', value: 'ethics' },
      { label: '일단 둘러보고 결정하기', value: 'explore' },
    ],
  },
  {
    id: 'q2',
    title: '평소 컴퓨터나 인터넷 도구를 어느 정도 사용하시나요?',
    options: [
      { label: 'NEIS, 검색, 간단한 문서 작성 정도만 합니다', value: 0 },
      { label: '학교 업무 대부분을 PC로 처리하고 새 프로그램도 시도해봅니다', value: 1 },
      { label: '단축키, 자동화, 새 도구를 비교적 익숙하게 사용합니다', value: 3 },
    ],
  },
  {
    id: 'q3',
    title: '생성형 AI나 챗봇 사용 경험은 어떠신가요?',
    options: [
      { label: '한 번도 써본 적이 없습니다', value: 0 },
      { label: '시험 삼아 한두 번 질문해본 정도입니다', value: 1 },
      { label: '가끔 업무나 개인 용도로 씁니다', value: 3 },
      { label: '거의 매일 사용합니다', value: 4 },
    ],
  },
  {
    id: 'q4',
    title: 'ChatGPT, Gemini, Claude 중 이름을 들어본 도구는 몇 개인가요?',
    options: [
      { label: '세 개 모두 들어봤습니다', value: 2 },
      { label: '두 개 정도 들어봤습니다', value: 1 },
      { label: '하나만 들어봤습니다', value: 0 },
      { label: '모두 처음 들어봅니다', value: 0 },
    ],
  },
  {
    id: 'q5',
    title: 'AI 도구 유료 구독 경험이 있으신가요?',
    options: [
      { label: '없습니다', value: 0 },
      { label: '과거에 써봤거나 무료 체험만 해봤습니다', value: 1 },
      { label: '현재 1개 이상 구독 중입니다', value: 2 },
    ],
  },
  {
    id: 'q6',
    title: '솔직히 AI를 직접 다루는 일이 어떻게 느껴지시나요?',
    options: [
      { label: '조금 어렵고 부담됩니다', value: -1 },
      { label: '보통입니다', value: 0 },
      { label: '재미있고 더 깊이 써보고 싶습니다', value: 1 },
    ],
  },
];
