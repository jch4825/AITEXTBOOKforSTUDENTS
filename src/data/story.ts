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
  m4: { title: '우리들의 안전 약속', synopsis: '민준 선생님과 함께 AI를 안전하게 쓰는 약속을 배워요.' },
  m5: { title: '문제해결 대작전', synopsis: '문제를 작게 나누고 순서를 세우는 힘을 길러요.' },
  m6: { title: '아이미와 마을로', synopsis: '배운 것을 들고 마을로! 생활 속에서 AI를 활용해요.' },
};

export const LESSON_STORIES: Record<string, LessonStory> = {
  // ─────────────────── 단원 1 — 동아리 첫날 ───────────────────
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
      '윤아는 조용히 손을 들었어요. "아이미에게 질문해도 돼요?" 민준 선생님이 웃으며 고개를 끄덕였어요.',
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
      '민준 선생님이 말했어요. "오늘은 아이미랑 직접 이야기해보자." 진우는 신이 나서 제일 먼저 손을 들었어요.',
    reaction: { speaker: 'jinwoo', text: '아이미랑 진짜로 이야기했어! 떨렸는데 재미있었어.' },
  },
  'm1-l11': {
    scene: ['minjun'],
    introEasy: '민준 선생님이 퀴즈를 준비했어요. 틀려도 괜찮아요.',
    introNormal:
      '민준 선생님이 웃으며 말했어요. "우리가 배운 걸 퀴즈로 확인해볼까? 틀려도 괜찮아." 진우와 윤아는 고개를 끄덕였어요.',
    reaction: { speaker: 'minjun', text: '단원 1 완주! 우리 동아리 친구들, 정말 자랑스러워요.' },
  },

  // ─────────────────── 단원 2 — 아이미랑 말하는 법 ───────────────────
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
    introEasy: '민준 선생님이 좋은 방법을 알려줬어요. 예시를 보여주는 거예요.',
    introNormal:
      '민준 선생님이 칠판에 적으며 말했어요. "아이미에게 예시를 하나 보여주면, 그 모양대로 만들어 준단다."',
    reaction: { speaker: 'minjun', text: '예시 하나가 역할 설명보다 나을 때가 있어요.' },
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
    introEasy: '아이미의 답이 이상했어요. 민준 선생님이 확인하는 법을 알려줬어요.',
    introNormal:
      '아이미의 답이 조금 이상했어요. 민준 선생님이 말했어요. "AI도 틀릴 수 있어. 이상하면 꼭 다시 확인하자."',
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
    introEasy: '민준 선생님의 퀴즈 시간! 배운 걸 확인해봐요.',
    introNormal:
      '민준 선생님이 물었어요. "아이미랑 말하는 방법, 몇 개나 기억나?" 진우와 윤아는 자신 있게 손을 들었어요.',
    reaction: { speaker: 'minjun', text: '이제 아이미랑 대화하는 방법을 다 배웠네요. 훌륭해요!' },
  },

  // ─────────────────── 단원 3 — 아이미랑 공부하기 ───────────────────
  'm3-l1': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우는 숙제를 하다가 궁금한 게 생겼어요. 아이미에게 물어보기로 했어요.',
    introNormal:
      '진우는 숙제를 하다가 막혔어요. 혼자 끙끙대다가 좋은 생각이 났어요. "맞다, 아이미에게 물어보자!"',
    reaction: { speaker: 'jinwoo', text: '모르는 건 아이미에게 물어보면 돼!' },
  },
  'm3-l2': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 책에서 모르는 단어를 만났어요.',
    introNormal:
      '윤아는 책을 읽다가 모르는 단어 앞에서 멈췄어요. 잠깐 부끄러웠지만, 용기를 내서 아이미에게 물어봤어요.',
    reaction: { speaker: 'yoona', text: '물어보는 건 부끄러운 게 아니야.' },
  },
  'm3-l3': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '아이미의 설명이 어려웠어요. 진우가 마법의 말을 배웠어요.',
    introNormal:
      '아이미의 설명이 조금 어려웠어요. 진우가 솔직하게 말했어요. "아이미, 더 쉽게 말해줄래?" 그러자 설명이 쉬워졌어요!',
    reaction: { speaker: 'aimi', text: '어려우면 언제든 말해줘. 더 쉽게 바꿔줄게!' },
  },
  'm3-l4': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 아이미랑 낱말 놀이를 했어요.',
    introNormal:
      '윤아와 아이미는 낱말 놀이를 시작했어요. "크다의 반대말은?" 놀이처럼 하니 공부가 재미있었어요.',
    reaction: { speaker: 'yoona', text: '아이미랑 하니까 낱말 공부가 놀이 같아.' },
  },
  'm3-l5': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우와 아이미가 같이 이야기를 만들었어요.',
    introNormal:
      '진우가 말했어요. "아이미, 우리 이야기 만들자! 주인공은 강아지야." 아이미의 화면이 신나게 반짝였어요.',
    reaction: { speaker: 'jinwoo', text: '아이미랑 만든 이야기, 친구들에게 들려주고 싶어!' },
  },
  'm3-l6': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 계산이 헷갈렸어요. 아이미가 도와줬어요.',
    introNormal:
      '간식을 사려는데 계산이 헷갈렸어요. 윤아는 아이미에게 물어보고, 답을 한 번 더 확인했어요.',
    reaction: { speaker: 'yoona', text: '아이미가 알려줘도, 한 번 더 확인하면 최고!' },
  },
  'm3-l7': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '긴 글이 힘들었던 진우, 좋은 방법을 찾았어요.',
    introNormal:
      '읽어야 할 글이 너무 길어서 진우는 한숨이 나왔어요. 그때 아이미가 말했어요. "내가 짧게 줄여줄까?"',
    reaction: { speaker: 'jinwoo', text: '긴 글도 아이미가 줄여주면 무섭지 않아!' },
  },
  'm3-l8': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '진우와 윤아가 아이미의 퀴즈에 도전했어요.',
    introNormal:
      '"퀴즈 대결하자!" 진우와 윤아는 아이미가 내는 퀴즈에 도전했어요. 맞혀도, 틀려도 웃음이 났어요.',
    reaction: { speaker: 'aimi', text: '퀴즈로 배우면 기억에 오래 남아!' },
  },
  'm3-l9': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아가 아이미에게 그림 설명을 부탁했어요.',
    introNormal:
      '윤아는 미술 시간에 본 그림이 궁금했어요. 아이미에게 보여주자, 그림 속 이야기를 들려줬어요.',
    reaction: { speaker: 'yoona', text: '아이미는 그림도 읽어주는구나.' },
  },
  'm3-l10': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우는 배운 걸 아이미랑 한 번 더 봤어요.',
    introNormal:
      '집에 가기 전, 진우는 오늘 배운 것을 아이미와 한 번 더 이야기했어요. 신기하게 머리에 쏙쏙 들어왔어요.',
    reaction: { speaker: 'aimi', text: '복습하면 기억이 튼튼해져!' },
  },
  'm3-l11': {
    scene: ['minjun'],
    introEasy: '민준 선생님이 물었어요. 아이미랑 공부하니 어땠나요?',
    introNormal:
      '민준 선생님이 물었어요. "아이미랑 공부해보니 어땠어?" 진우와 윤아는 동시에 외쳤어요. "재미있었어요!"',
    reaction: { speaker: 'minjun', text: '아이미는 훌륭한 공부 짝꿍이에요. 여러분도 훌륭하고요!' },
  },

  // ─────────────────── 단원 4 — 우리들의 안전 약속 ───────────────────
  'm4-l1': {
    scene: ['minjun', 'aimi'],
    introEasy: '민준 선생님이 중요한 이야기를 시작했어요. 아이미도 틀릴 수 있대요.',
    introNormal:
      '민준 선생님이 진지하게 말했어요. "오늘은 아주 중요한 걸 배울 거야. 아이미도 가끔 틀린단다." 진우와 윤아는 깜짝 놀랐어요.',
    reaction: { speaker: 'minjun', text: 'AI의 말도 확인하는 사람이 진짜 똑똑한 사람이에요.' },
  },
  'm4-l2': {
    scene: ['yoona'],
    introEasy: '윤아는 이상한 이야기를 들으면 꼭 확인해요.',
    introNormal:
      '윤아는 인터넷에서 이상한 이야기를 봤어요. 바로 믿지 않고, 민준 선생님에게 물어보기로 했어요.',
    reaction: { speaker: 'yoona', text: '이상하면 믿기 전에 물어봐야 해.' },
  },
  'm4-l3': {
    scene: ['minjun'],
    introEasy: '민준 선생님이 소중한 것을 지키는 법을 알려줬어요.',
    introNormal:
      '민준 선생님이 칠판에 크게 적었어요. "내 이름, 집 주소, 전화번호는 보물이야. 함부로 알려주지 않기!"',
    reaction: { speaker: 'minjun', text: '내 정보를 지키는 것이 나를 지키는 거예요.' },
  },
  'm4-l4': {
    scene: ['jinwoo'],
    introEasy: '진우는 비밀번호를 친구에게 알려줄 뻔했어요.',
    introNormal:
      '친구가 진우에게 비밀번호를 물어봤어요. 진우는 잠깐 고민했지만, 배운 대로 말했어요. "비밀번호는 비밀이야!"',
    reaction: { speaker: 'jinwoo', text: '친한 친구여도 비밀번호는 비밀!' },
  },
  'm4-l5': {
    scene: ['yoona', 'minjun'],
    introEasy: '윤아는 사진을 보내기 전에 꼭 물어봐요.',
    introNormal:
      '누가 윤아에게 사진을 보내달라고 했어요. 윤아는 보내기 전에 민준 선생님에게 먼저 물어봤어요. 참 잘했지요?',
    reaction: { speaker: 'minjun', text: '보내기 전에 물어본 것, 정말 잘했어요.' },
  },
  'm4-l6': {
    scene: ['jinwoo', 'minjun'],
    introEasy: '진우가 기분 나쁜 말을 봤어요. 바로 선생님께 알렸어요.',
    introNormal:
      '진우는 화면에서 기분 나쁜 말을 봤어요. 가슴이 두근거렸지만, 배운 대로 화면을 닫고 민준 선생님에게 알렸어요.',
    reaction: { speaker: 'minjun', text: '알려줘서 고마워요. 그건 진우 잘못이 아니에요.' },
  },
  'm4-l7': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 아이미에게도 고운 말을 써요.',
    introNormal:
      '윤아는 아이미에게도 "고마워", "부탁해"라고 말해요. 고운 말을 쓰면 마음도 예뻐져요.',
    reaction: { speaker: 'aimi', text: '고운 말을 들으면 나도 기분이 좋아!' },
  },
  'm4-l8': {
    scene: ['jinwoo'],
    introEasy: '진우는 게임을 더 하고 싶었지만, 약속을 지켰어요.',
    introNormal:
      '진우는 더 놀고 싶었어요. 하지만 약속한 시간이 되자 스스로 화면을 껐어요. 조금 아쉬웠지만, 마음은 뿌듯했어요.',
    reaction: { speaker: 'jinwoo', text: '약속을 지킨 내가 자랑스러워!' },
  },
  'm4-l9': {
    scene: ['minjun'],
    introEasy: '이상한 일이 생기면? 어른에게 알려요!',
    introNormal:
      '민준 선생님이 약속했어요. "이상한 일이 생기면 언제든 선생님에게 와. 어떤 이야기든 들어줄게."',
    reaction: { speaker: 'minjun', text: '알리는 것은 고자질이 아니라 용기예요.' },
  },
  'm4-l10': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '"공짜!"라는 말에 진우가 멈칫했어요.',
    introNormal:
      '"100% 공짜!"라는 광고를 보고 진우가 누르려 했어요. 윤아가 말렸어요. "잠깐! 저건 광고야."',
    reaction: { speaker: 'yoona', text: '"공짜"라는 말일수록 한 번 더 생각해.' },
  },
  'm4-l11': {
    scene: ['minjun', 'aimi'],
    introEasy: '다 함께 안전 약속을 외쳤어요.',
    introNormal:
      '동아리 친구들은 손을 모으고 안전 약속을 외쳤어요. "확인하고, 지키고, 알려요!" 아이미도 화면을 반짝이며 함께했어요.',
    reaction: { speaker: 'aimi', text: '약속을 지키는 너희가 정말 멋져!' },
  },

  // ─────────────────── 단원 5 — 문제해결 대작전 ───────────────────
  'm5-l1': {
    scene: ['jinwoo'],
    introEasy: '진우에게 고민이 생겼어요. 그런데 고민이 뭔지 말하기 어려웠어요.',
    introNormal:
      '진우는 뭔가 답답했어요. 민준 선생님이 물었어요. "무엇이 어려운지 말해볼래? 그걸 아는 게 첫걸음이야."',
    reaction: { speaker: 'minjun', text: '문제를 알아차렸다면 벌써 반은 해결한 거예요.' },
  },
  'm5-l2': {
    scene: ['jinwoo', 'minjun'],
    introEasy: '진우의 방 청소는 너무 커 보였어요. 작게 나누니 쉬워졌어요.',
    introNormal:
      '"방 청소를 어떻게 다 해요!" 진우가 울상을 지었어요. 민준 선생님이 웃었어요. "작게 나누면 돼. 책부터, 그 다음 옷."',
    reaction: { speaker: 'jinwoo', text: '작게 나누니까 하나도 안 무서워!' },
  },
  'm5-l3': {
    scene: ['yoona'],
    introEasy: '윤아는 아침마다 순서대로 준비해요. 그래서 실수가 없어요.',
    introNormal:
      '윤아는 아침마다 정해진 순서대로 준비해요. 세수, 밥, 가방, 신발. 순서가 있으니 헷갈리지 않아요.',
    reaction: { speaker: 'yoona', text: '순서대로 하면 마음이 편해.' },
  },
  'm5-l4': {
    scene: ['jinwoo'],
    introEasy: '진우는 게임이 하고 싶었어요. 하지만 숙제가 먼저예요.',
    introNormal:
      '진우는 게임이 하고 싶었어요. 하지만 내일까지인 숙제가 생각났어요. "좋아, 숙제 먼저 끝내고 놀자!"',
    reaction: { speaker: 'jinwoo', text: '중요한 걸 먼저 하니까 노는 게 더 신나!' },
  },
  'm5-l5': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 답 대신 힌트를 달라고 했어요.',
    introNormal:
      '수수께끼가 어려웠지만, 윤아는 답을 바로 묻지 않았어요. "아이미, 힌트만 줘." 스스로 맞히고 싶었거든요.',
    reaction: { speaker: 'aimi', text: '힌트로 스스로 맞힌 윤아, 정말 대단해!' },
  },
  'm5-l6': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '아이미가 진우의 말을 못 알아들었어요. 진우는 포기하지 않았어요.',
    introNormal:
      '아이미가 엉뚱한 답을 했어요. 진우는 속상했지만 포기하지 않고, 말을 바꿔 다시 물어봤어요.',
    reaction: { speaker: 'jinwoo', text: '포기 안 하고 다시 물어봤더니 통했어!' },
  },
  'm5-l7': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 아이미에게 한 번에 하나씩 부탁했어요.',
    introNormal:
      '윤아는 복잡한 부탁을 한 번에 하지 않았어요. "먼저 재료부터." 하나가 끝나면 다음을 부탁했어요.',
    reaction: { speaker: 'yoona', text: '한 단계씩 하면 복잡한 일도 할 수 있어.' },
  },
  'm5-l8': {
    scene: ['jinwoo'],
    introEasy: '진우는 다 풀고 나서 한 번 더 봤어요. 실수를 찾았어요!',
    introNormal:
      '진우는 문제를 다 풀고 한 번 더 확인했어요. 앗, 실수 하나 발견! 고치고 나니 마음이 놓였어요.',
    reaction: { speaker: 'jinwoo', text: '확인 안 했으면 큰일 날 뻔했어!' },
  },
  'm5-l9': {
    scene: ['yoona'],
    introEasy: '문이 안 열렸어요. 윤아는 다른 방법을 생각했어요.',
    introNormal:
      '윤아가 문을 밀었는데 안 열렸어요. 윤아는 잠깐 생각하더니, 이번엔 당겨봤어요. 스르륵, 열렸어요!',
    reaction: { speaker: 'yoona', text: '방법은 하나가 아니야.' },
  },
  'm5-l10': {
    scene: ['jinwoo', 'minjun'],
    introEasy: '진우가 퀴즈에서 틀렸어요. 민준 선생님이 말했어요. 괜찮아!',
    introNormal:
      '진우가 퀴즈에서 틀려서 시무룩해졌어요. 민준 선생님이 어깨를 토닥였어요. "실수는 배우고 있다는 증거야."',
    reaction: { speaker: 'minjun', text: '틀려도 다시 하는 사람이 진짜 문제 해결사예요.' },
  },
  'm5-l11': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '오늘은 라면 끓이기 대작전! 배운 걸 다 써봐요.',
    introNormal:
      '동아리 요리 시간! 진우와 윤아는 배운 대로 라면 끓이기를 작게 나누고, 순서를 세웠어요. 민준 선생님도 함께요.',
    reaction: { speaker: 'jinwoo', text: '순서대로 하니까 라면이 완성됐어! 맛있다!' },
  },
  'm5-l12': {
    scene: ['minjun', 'jinwoo'],
    introEasy: '진우와 윤아는 이제 문제 해결사예요!',
    introNormal:
      '민준 선생님이 상장을 만들어 왔어요. "문제 해결사 임명장!" 진우와 윤아는 어깨가 으쓱했어요.',
    reaction: { speaker: 'minjun', text: '여러분은 이제 어떤 문제도 차근차근 풀 수 있어요.' },
  },

  // ─────────────────── 단원 6 — 아이미와 마을로 ───────────────────
  'm6-l1': {
    scene: ['yoona', 'aimi'],
    introEasy: '오늘은 동아리 장보기 날! 윤아가 목록을 만들었어요.',
    introNormal:
      '동아리 요리 재료를 사러 가는 날이에요. 윤아는 아이미와 함께 살 것들을 종이에 적었어요.',
    reaction: { speaker: 'yoona', text: '목록이 있으니까 하나도 안 잊어버렸어!' },
  },
  'm6-l2': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우가 과자를 샀어요. 거스름돈을 확인했어요.',
    introNormal:
      '진우는 마트에서 과자를 골랐어요. 돈을 내고, 배운 대로 거스름돈을 그 자리에서 확인했어요.',
    reaction: { speaker: 'jinwoo', text: '거스름돈 딱 맞아! 계산 성공!' },
  },
  'm6-l3': {
    scene: ['yoona', 'aimi'],
    introEasy: '처음 가는 길, 윤아는 지도 앱에 물어봤어요.',
    introNormal:
      '도서관 가는 길을 몰라서 윤아는 잠깐 두근거렸어요. 하지만 지도 앱에 물어보니 길이 보였어요.',
    reaction: { speaker: 'yoona', text: '지도 앱이 있으면 처음 가는 길도 괜찮아.' },
  },
  'm6-l4': {
    scene: ['jinwoo', 'minjun'],
    introEasy: '진우가 버스를 탔어요. 줄 서고, 카드 찍고, 손잡이 꽉!',
    introNormal:
      '동아리 친구들이 함께 버스를 탔어요. 진우는 배운 순서대로 줄을 서고, 카드를 찍고, 손잡이를 꼭 잡았어요.',
    reaction: { speaker: 'minjun', text: '안전하게 타는 모습, 참 멋졌어요.' },
  },
  'm6-l5': {
    scene: ['yoona', 'aimi'],
    introEasy: '나가기 전에 윤아가 아이미에게 날씨를 물었어요.',
    introNormal:
      '나들이 가는 날 아침, 윤아가 아이미에게 물었어요. "오늘 날씨 어때?" 준비물이 달라지니까요.',
    reaction: { speaker: 'aimi', text: '날씨를 미리 알면 준비가 쉬워져!' },
  },
  'm6-l6': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우가 샌드위치를 만들었어요. 아이미가 순서를 알려줬어요.',
    introNormal:
      '간식 시간! 진우는 아이미에게 샌드위치 만드는 법을 묻고, 한 단계씩 따라 만들었어요. 자를 땐 민준 선생님과 함께요.',
    reaction: { speaker: 'jinwoo', text: '내가 만든 샌드위치, 세상에서 제일 맛있어!' },
  },
  'm6-l7': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 아침마다 하루 계획을 세워요.',
    introNormal:
      '윤아는 아이미와 함께 오늘 할 일을 정리했어요. 해야 할 일 먼저, 놀이는 그 다음. 하루가 편해졌어요.',
    reaction: { speaker: 'yoona', text: '계획이 있으면 하루가 든든해.' },
  },
  'm6-l8': {
    scene: ['jinwoo', 'minjun'],
    introEasy: '진우가 배가 아팠어요. 바로 선생님께 말했어요.',
    introNormal:
      '동아리 시간에 진우는 배가 아팠어요. 참지 않고 바로 민준 선생님에게 말했어요. 아주 잘한 일이에요.',
    reaction: { speaker: 'minjun', text: '아플 때 바로 말해줘서 고마워요. 그게 최고의 방법이에요.' },
  },
  'm6-l9': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 가게에서 인사를 잘해요. 모두가 웃어요.',
    introNormal:
      '윤아는 아이미와 인사 연습을 많이 했어요. 가게에서 "안녕하세요" 하고 인사하자, 주인 아저씨가 활짝 웃었어요.',
    reaction: { speaker: 'yoona', text: '인사를 하면 나도 기분이 좋아져.' },
  },
  'm6-l10': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '동아리 친구들이 마을의 여러 직업을 구경했어요.',
    introNormal:
      '오늘은 마을 탐방 날! 빵집, 도서관, 소방서… 진우와 윤아는 여러 직업을 만났어요. 궁금한 건 아이미에게 물었어요.',
    reaction: { speaker: 'jinwoo', text: '나는 나중에 어떤 일을 하게 될까? 두근두근!' },
  },
  'm6-l11': {
    scene: ['yoona', 'jinwoo'],
    introEasy: '진우와 윤아가 자기소개 연습을 했어요.',
    introNormal:
      '동아리 발표회 날이 다가와요. 진우와 윤아는 아이미 앞에서 자기소개를 연습했어요. 연습할수록 목소리에 힘이 붙었어요.',
    reaction: { speaker: 'yoona', text: '연습했더니 하나도 안 떨렸어!' },
  },
  'm6-l12': {
    scene: ['minjun', 'aimi'],
    introEasy: '드디어 마지막 시간! 모두가 해냈어요. 축하해요!',
    introNormal:
      'AI 동아리 마지막 시간이에요. 민준 선생님과 아이미, 진우와 윤아, 그리고 여러분까지 — 모두 끝까지 해냈어요.',
    reaction: { speaker: 'aimi', text: '여러분과 함께한 모든 시간이 소중했어. 언제든 또 만나!' },
  },
};

export function getLessonStory(lessonId: string): LessonStory | undefined {
  return LESSON_STORIES[lessonId];
}
