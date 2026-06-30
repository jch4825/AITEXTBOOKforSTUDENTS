import type { DemoLesson } from '../types';

/**
 * M1 demo lesson — exercises every infrastructure feature in one place.
 * Replaced in M2 with the full 11-lesson Module 1 content.
 */
export const DEMO_LESSON: DemoLesson = {
  id: 'm1-l1',
  moduleId: 'm1',
  title: 'AI가 뭐야?',
  bodyEasy: '인공지능은 컴퓨터가 사람처럼 생각하는 거예요.',
  bodyNormal: '인공지능(AI)은 컴퓨터가 사람처럼 생각하고 답해주게 만든 기술이에요. 우리가 묻는 질문에 답을 해줘요.',
  steps: [
    { kind: 'text', data: { showDictionaryTerms: true } },
    {
      kind: 'ox',
      data: {
        questions: [
          { question: '핸드폰의 음성비서(시리, 빅스비)는 AI일까요?', answer: 'O', feedback: '맞아요! AI가 우리 말을 알아듣고 답해줘요.' },
          { question: '냉장고는 AI일까요?', answer: 'X', feedback: '대부분의 냉장고는 그냥 차갑게 만드는 기계예요.' },
          { question: '챗봇은 AI일까요?', answer: 'O', feedback: '맞아요! 챗봇은 글로 대화하는 AI예요.' },
        ],
      },
    },
    {
      kind: 'card-pick',
      data: {
        question: 'AI가 가장 잘하는 일은 무엇일까요?',
        choices: [
          { label: '사람이 묻는 말에 답해주기', isCorrect: true },
          { label: '빨래를 개기', isCorrect: false },
          { label: '나무 심기', isCorrect: false },
          { label: '비 오게 하기', isCorrect: false },
        ],
      },
    },
    {
      kind: 'matching',
      data: {
        pairs: [
          { left: '시리·빅스비', right: '말로 대화하는 AI' },
          { left: '챗봇', right: '글로 대화하는 AI' },
          { left: '번역기', right: '말을 바꿔주는 AI' },
        ],
      },
    },
    {
      kind: 'sim-ai',
      data: {
        prompt: 'AI한테 "안녕!" 이라고 인사해봐요.',
        userInput: '안녕!',
        aiResponse: '안녕하세요! 만나서 반가워요. 오늘은 어떤 걸 배우고 싶어요?',
      },
    },
  ],
};
