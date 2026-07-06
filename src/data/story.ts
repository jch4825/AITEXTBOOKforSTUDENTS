import type { ModuleId } from '../types';
import type { CharacterId } from './characters';

/**
 * 관통 시나리오 — "AI 동아리" 사회상황이야기 레이어.
 *
 * 작법 규칙 (spec 2026-07-07):
 * - 서술 문장 위주 + 관점 문장(감정) 포함, 지시 문장은 부드럽게.
 * - introEasy 1~2문장, introNormal 2~3문장. 캐릭터 실명으로 이입 유도.
 * - 기존 차시 데이터(m1~m6.ts)는 건드리지 않는다 — lessonId로 결합하는 옵션 레이어.
 */

export interface LessonStory {
  /** 장면 카드에 세울 캐릭터 (1~2명) */
  scene: CharacterId[];
  introEasy: string;
  introNormal: string;
  /** 정리 화면에 붙는 캐릭터 반응 한 마디 */
  reaction: { speaker: CharacterId; text: string };
}

export const MODULE_EPISODES: Record<ModuleId, { title: string; synopsis: string }> = {
  m1: { title: '동아리 첫날 — 아이미를 만나다', synopsis: '진우와 윤아가 AI 동아리에서 로봇 친구 아이미를 처음 만나요.' },
  m2: { title: '아이미랑 말하는 법', synopsis: '아이미에게 어떻게 물어봐야 좋은 답이 오는지 연습해요.' },
  m3: { title: '아이미랑 공부하기', synopsis: '아이미가 공부 도우미가 되어 함께 배워요.' },
  m4: { title: '우리들의 안전 약속', synopsis: '민준쌤과 함께 AI를 안전하게 쓰는 약속을 배워요.' },
  m5: { title: '문제해결 대작전', synopsis: '문제를 작게 나누고 순서를 세우는 힘을 길러요.' },
  m6: { title: '아이미와 마을로', synopsis: '배운 것을 들고 마을로! 생활 속에서 AI를 활용해요.' },
};

export const LESSON_STORIES: Record<string, LessonStory> = {
  // ─────────────────── 모듈 1 — 동아리 첫날 ───────────────────
  'm1-l1': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우는 오늘 AI 동아리에 처음 왔어요. 작은 로봇 아이미가 반갑게 인사했어요.',
    introNormal:
      '진우는 오늘 AI 동아리에 처음 왔어요. 조금 떨렸지만 궁금한 마음이 더 컸어요. 그때 작은 로봇이 다가와 인사했어요. "안녕! 나는 아이미야."',
    reaction: { speaker: 'jinwoo', text: '아이미 같은 AI가 우리 곁에 이렇게 많다니, 신기해!' },
  },
  'm1-l2': {
    scene: ['jinwoo'],
    introEasy: '진우는 궁금했어요. 집에 있는 선풍기도 아이미 같은 AI일까요?',
    introNormal:
      '진우는 집에 있는 선풍기가 생각났어요. "선풍기도 아이미 같은 AI일까?" 진우는 오늘 그 답을 찾아보기로 했어요.',
    reaction: { speaker: 'aimi', text: '선풍기는 정해진 일만 해. 나는 네 말을 알아듣지!' },
  },
  'm1-l3': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아가 아이미에게 처음으로 질문해봤어요.',
    introNormal:
      '윤아는 조용히 손을 들었어요. "아이미에게 질문해도 돼요?" 민준쌤이 웃으며 고개를 끄덕였어요.',
    reaction: { speaker: 'yoona', text: '궁금한 걸 물어보니까 바로 답해줬어!' },
  },
  'm1-l4': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우가 아이미에게 강아지 사진을 보여줬어요.',
    introNormal:
      '진우는 강아지 사진을 아이미에게 보여줬어요. "아이미, 이게 뭔지 알아?" 아이미의 눈이 반짝였어요.',
    reaction: { speaker: 'aimi', text: '사진 속 강아지, 나도 알아볼 수 있어!' },
  },
  'm1-l5': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아가 아이미에게 말을 걸어봤어요. 아이미가 알아들었어요!',
    introNormal:
      '윤아가 작은 목소리로 아이미를 불렀어요. 아이미가 고개를 돌렸어요. 또박또박 말하니 더 잘 알아들었어요.',
    reaction: { speaker: 'yoona', text: '또박또박 말하면 아이미가 더 잘 알아들어.' },
  },
  'm1-l6': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '진우는 궁금했어요. 아이미는 어떻게 이렇게 똑똑해졌을까요?',
    introNormal:
      '진우가 물었어요. "아이미는 어떻게 이렇게 똑똑해?" 윤아도 궁금해서 귀를 기울였어요.',
    reaction: { speaker: 'aimi', text: '나도 너희처럼 많이 보고 연습해서 배웠어!' },
  },
  'm1-l7': {
    scene: ['aimi'],
    introEasy: '아이미가 잘하는 것을 보여주고 싶어 했어요.',
    introNormal:
      '오늘은 아이미가 자기가 잘하는 것을 보여주는 날이에요. 아이미의 화면이 신나게 반짝였어요.',
    reaction: { speaker: 'jinwoo', text: '아이미, 번역도 하고 요약도 하고, 정말 대단해!' },
  },
  'm1-l8': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우가 아이미에게 과자를 나눠주려 했어요. 아이미는 먹지 못해요.',
    introNormal:
      '간식 시간, 진우가 아이미에게 과자를 내밀었어요. "아이미도 먹을래?" 아이미는 웃으며 고개를 저었어요.',
    reaction: { speaker: 'aimi', text: '고마워, 진우야. 하지만 나는 밥 대신 전기를 먹지!' },
  },
  'm1-l9': {
    scene: ['yoona'],
    introEasy: '윤아는 아이미 말고도 여러 AI가 있다는 걸 알았어요.',
    introNormal:
      '윤아가 물었어요. "아이미, 너 말고도 AI 친구들이 있어?" 아이미가 신이 나서 친구들을 소개했어요.',
    reaction: { speaker: 'aimi', text: '세상엔 여러 AI 친구가 있어. 하는 일도 달라!' },
  },
  'm1-l10': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '오늘은 진우가 아이미랑 직접 이야기해보는 날이에요.',
    introNormal:
      '민준쌤이 말했어요. "오늘은 아이미랑 직접 이야기해보자." 진우는 신이 나서 제일 먼저 손을 들었어요.',
    reaction: { speaker: 'jinwoo', text: '아이미랑 진짜로 이야기했어! 떨렸는데 재미있었어.' },
  },
  'm1-l11': {
    scene: ['minjun'],
    introEasy: '민준쌤이 퀴즈를 준비했어요. 틀려도 괜찮아요.',
    introNormal:
      '민준쌤이 웃으며 말했어요. "우리가 배운 걸 퀴즈로 확인해볼까? 틀려도 괜찮아." 진우와 윤아는 고개를 끄덕였어요.',
    reaction: { speaker: 'minjun', text: '모듈 1 완주! 우리 동아리 친구들, 정말 자랑스러워요.' },
  },

  // ─────────────────── 모듈 2 — 아이미랑 말하는 법 ───────────────────
  'm2-l1': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아가 아이미에게 말을 걸었는데, 아이미가 고개를 갸웃했어요.',
    introNormal:
      '윤아가 "음… 그거…" 하고 말끝을 흐리자, 아이미가 고개를 갸웃했어요. "윤아야, 뭐가 궁금한지 말해줄래?"',
    reaction: { speaker: 'aimi', text: '잘 물어봐 주면 나도 잘 대답할 수 있어!' },
  },
  'm2-l2': {
    scene: ['jinwoo'],
    introEasy: '진우의 말이 너무 길어졌어요. 아이미가 헷갈려했어요.',
    introNormal:
      '진우가 한 번에 이것저것 다 물어봤어요. 아이미의 화면에 물음표가 떴어요. 윤아가 살짝 귀띔했어요. "짧게 물어봐."',
    reaction: { speaker: 'jinwoo', text: '짧게 물어보니까 답이 딱 나왔어!' },
  },
  'm2-l3': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 궁금한 걸 콕 집어 말하는 연습을 했어요.',
    introNormal:
      '윤아는 "아무거나 알려줘" 대신, 궁금한 걸 콕 집어 말해보기로 했어요. 아이미의 눈이 반짝였어요.',
    reaction: { speaker: 'yoona', text: '콕 집어 물어보면 원하는 답이 나와.' },
  },
  'm2-l4': {
    scene: ['minjun'],
    introEasy: '민준쌤이 좋은 방법을 알려줬어요. 예시를 보여주는 거예요.',
    introNormal:
      '민준쌤이 칠판에 적으며 말했어요. "아이미에게 예시를 하나 보여주면, 그 모양대로 만들어 준단다."',
    reaction: { speaker: 'minjun', text: '예시 하나가 열 마디 설명보다 나을 때가 있어요.' },
  },
  'm2-l5': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우가 아이미에게 "동화 작가처럼 말해줘" 하고 부탁했어요.',
    introNormal:
      '진우가 장난스럽게 말했어요. "아이미, 동화 작가처럼 말해봐!" 그러자 아이미의 목소리가 이야기꾼처럼 변했어요.',
    reaction: { speaker: 'aimi', text: '역할을 정해주면 나는 그 역할로 변신해!' },
  },
  'm2-l6': {
    scene: ['yoona'],
    introEasy: '윤아는 큰 질문을 작게 나눠서 물어봤어요.',
    introNormal:
      '윤아는 큰 질문을 한 번에 하지 않았어요. 하나씩, 한 걸음씩 물어봤어요. 아이미가 차근차근 대답했어요.',
    reaction: { speaker: 'yoona', text: '한 걸음씩 물어보니 하나도 안 헷갈려.' },
  },
  'm2-l7': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우는 답이 마음에 안 들었어요. 다시 부탁해도 괜찮아요.',
    introNormal:
      '아이미의 답이 진우 마음에 쏙 들지 않았어요. 진우는 잠깐 고민하다 말했어요. "아이미, 다르게 말해줄래?"',
    reaction: { speaker: 'aimi', text: '몇 번이든 다시 물어봐도 괜찮아. 나 안 지쳐!' },
  },
  'm2-l8': {
    scene: ['yoona', 'aimi'],
    introEasy: '아이미의 답이 너무 길었어요. 윤아가 좋은 방법을 썼어요.',
    introNormal:
      '아이미의 답이 길어서 읽기 힘들었어요. 윤아가 차분히 부탁했어요. "세 줄로 알려줄래?"',
    reaction: { speaker: 'yoona', text: '"세 줄로 알려줘" — 이 말 정말 편리해.' },
  },
  'm2-l9': {
    scene: ['minjun'],
    introEasy: '아이미의 답이 이상했어요. 민준쌤이 확인하는 법을 알려줬어요.',
    introNormal:
      '아이미의 답이 조금 이상했어요. 민준쌤이 말했어요. "AI도 틀릴 수 있어. 이상하면 꼭 다시 확인하자."',
    reaction: { speaker: 'minjun', text: '확인하는 습관이 여러분을 지켜줘요.' },
  },
  'm2-l10': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '오늘은 배운 방법으로 아이미랑 신나게 이야기하는 날!',
    introNormal:
      '오늘은 배운 방법을 다 써보는 날이에요. 진우와 윤아는 아이미 앞에 나란히 앉았어요. 두근두근!',
    reaction: { speaker: 'aimi', text: '너희랑 이야기하니까 정말 즐거워!' },
  },
  'm2-l11': {
    scene: ['minjun'],
    introEasy: '민준쌤의 퀴즈 시간! 배운 걸 확인해봐요.',
    introNormal:
      '민준쌤이 물었어요. "아이미랑 말하는 방법, 몇 개나 기억나?" 진우와 윤아는 자신 있게 손을 들었어요.',
    reaction: { speaker: 'minjun', text: '이제 아이미랑 대화하는 방법을 다 배웠네요. 훌륭해요!' },
  },
};

export function getLessonStory(lessonId: string): LessonStory | undefined {
  return LESSON_STORIES[lessonId];
}
