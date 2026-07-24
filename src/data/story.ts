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
  m1: { title: 'AI 동아리 첫 주 — 아이미 탐구 기록', synopsis: '진우와 윤아가 아이미의 입력, 결과, 한계를 시험하며 사용 설명서를 만듭니다.' },
  m2: { title: '아이미랑 말하는 법', synopsis: '아이미에게 어떻게 물어봐야 좋은 답이 오는지 연습합니다.' },
  m3: { title: '아이미랑 공부하기', synopsis: '아이미가 공부 도우미가 되어 함께 배웁니다.' },
  m4: { title: '우리들의 안전 약속', synopsis: '민준 선생님과 함께 AI를 안전하게 쓰는 약속을 배웁니다.' },
  m5: { title: '문제해결 대작전', synopsis: '문제를 작게 나누고 순서를 세우는 힘을 기릅니다.' },
  m6: { title: '아이미와 마을로', synopsis: '배운 것을 들고 마을로! 생활 속에서 AI를 활용합니다.' },
};

export const LESSON_STORIES: Record<string, LessonStory> = {
  // ─────────────────── 단원 1 — 아이미 탐구 기록 ───────────────────
  'm1-l1': {
    scene: ['jinwoo', 'aimi'],
    introEasy: 'AI 동아리 첫날, 진우는 새 로봇 아이미를 만났어요. 아이미의 설명이 어려워서 생활 속 사례로 뜻을 다시 찾아보기로 했어요.',
    introNormal:
      'AI 동아리 첫날, 진우 앞에 새 로봇 아이미가 나타났습니다. 아이미는 자신을 어려운 말로 소개했고 진우의 표정이 굳었습니다. 민준 선생님은 생활 속 AI 기능을 함께 찾아보며 쉬운 소개를 만들어 보자고 제안했습니다.',
    reaction: { speaker: 'jinwoo', text: '이제 아이미를 내가 이해한 말로 소개할 수 있어!' },
  },
  'm1-l2': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 선풍기, 자동문, 음악 추천 앱을 살펴봤어요. 모두 자동으로 움직이지만 받는 정보는 달랐어요.',
    introNormal:
      '윤아는 동아리방의 선풍기, 자동문, 음악 추천 앱을 한 줄로 놓았습니다. 모두 똑똑해 보였지만 버튼, 센서, 사용 기록처럼 받는 정보가 달랐습니다. 윤아는 기계 이름 대신 기능의 입력과 결과를 조사하기로 했습니다.',
    reaction: { speaker: 'yoona', text: '이름보다 무엇을 받고 어떻게 바꾸는지 봐야 하는구나.' },
  },
  'm1-l3': {
    scene: ['yoona', 'aimi'],
    introEasy: '아이미가 동아리 소개를 만들었어요. 문장은 자연스러웠지만 행사 시간이 공지와 달랐어요.',
    introNormal:
      '윤아는 아이미에게 동아리 소개 문장을 부탁했습니다. 아이미의 답은 술술 읽혔지만 행사 시간이 학교 공지와 달랐습니다. 윤아는 자연스러운 문장과 확인된 사실을 나누어 표시하기로 했습니다.',
    reaction: { speaker: 'yoona', text: '잘 읽히는 답도 날짜와 장소는 원래 자료에서 확인할게.' },
  },
  'm1-l4': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아가 일부 가려진 여우 사진을 보여 주자 아이미는 고양이라고 답했어요. 사진 조건을 바꾸며 다시 시험해 봐요.',
    introNormal:
      '윤아가 일부 가려진 여우 사진을 아이미에게 보여 주었습니다. 아이미는 보이는 귀와 얼굴 모양을 보고 고양이라고 답했습니다. 윤아는 가림, 밝기, 각도를 하나씩 바꾸며 답이 어떻게 달라지는지 기록하기로 했습니다.',
    reaction: { speaker: 'yoona', text: 'AI 답만 보지 않고 사진 조건과 원본을 함께 확인했어.' },
  },
  'm1-l5': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '복도에서 녹음한 안내가 다른 글자로 바뀌었어요. 진우와 윤아는 소음과 입력 방법을 바꿔 봤어요.',
    introNormal:
      '진우가 체험회 안내를 녹음했지만 복도 소음 때문에 몇 글자가 다르게 바뀌었습니다. 윤아는 말한 사람의 잘못이라고 단정하지 않았습니다. 두 사람은 다시 듣기, 가까운 마이크, 글자 입력, AAC를 차례로 시험했습니다.',
    reaction: { speaker: 'jinwoo', text: '한 가지 입력이 어려우면 나에게 편한 다른 방법을 쓰면 돼.' },
  },
  'm1-l6': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '모양 분류기는 동그라미와 네모는 잘 맞혔지만 세모를 자주 틀렸어요. 학습 카드에 세모가 거의 없었어요.',
    introNormal:
      '동아리 친구들은 모양 카드로 간단한 분류기를 가르쳤습니다. 동그라미와 네모 카드만 많이 넣자 새로운 세모를 자주 틀렸습니다. 친구들은 빠진 종류를 찾아 자료를 보완한 뒤 새로운 카드로 다시 시험했습니다.',
    reaction: { speaker: 'aimi', text: '어떤 자료로 배웠는지 살펴보면 결과가 달라진 이유를 찾을 수 있어요.' },
  },
  'm1-l7': {
    scene: ['yoona', 'aimi'],
    introEasy: '아이미가 체험회 안내문을 빠르게 줄였지만 장소와 준비물이 빠졌어요. 원문과 나란히 비교해 봐요.',
    introNormal:
      '체험회 안내문을 짧게 만들고 다른 언어로도 안내해야 했습니다. 아이미는 빠르게 결과를 만들었지만 장소와 준비물 한 가지를 빠뜨렸습니다. 진우와 윤아는 원문과 결과를 나란히 놓고 사용할 부분과 고칠 부분을 표시했습니다.',
    reaction: { speaker: 'yoona', text: '빠른 결과도 원문과 비교해야 중요한 내용을 지킬 수 있어.' },
  },
  'm1-l8': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '진우는 여러 부탁을 모두 아이미에게 맡기려 했어요. 윤아는 위험과 책임을 살펴 세 가지 도움 경로로 나눴어요.',
    introNormal:
      '진우는 친구 마음, 약 복용, 최신 행사 시간, 안내문 요약을 모두 아이미에게 부탁하려 했습니다. 윤아는 틀렸을 때 생길 문제와 누가 책임져야 하는지를 먼저 살폈습니다. 두 사람은 AI로 시도할 일, 확인하고 사용할 일, 믿을 수 있는 사람에게 요청할 일로 나누었습니다.',
    reaction: { speaker: 'jinwoo', text: '중요한 결정일수록 믿을 수 있는 사람과 함께 확인할게.' },
  },
  'm1-l9': {
    scene: ['yoona', 'aimi'],
    introEasy: '체험회에는 안내문, 포스터 그림, 영상 자막이 필요했어요. 친구들은 원하는 결과부터 정했어요.',
    introNormal:
      '체험회를 준비하려면 안내문, 포스터 그림, 영상 자막이 필요했습니다. 친구들은 도구 이름부터 고르지 않고 각 작업에 필요한 입력과 원하는 결과를 먼저 적었습니다. 마지막에는 사실, 저작권, 개인정보를 누가 확인할지도 정했습니다.',
    reaction: { speaker: 'yoona', text: '목적, 입력, 결과, 확인 방법을 함께 보면 도구를 고르기 쉬워.' },
  },
  'm1-l10': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '아이미가 추천한 배경음악 중에는 행사와 맞지 않거나 확인되지 않은 정보가 있었어요. 사용, 수정, 거절을 정해 봐요.',
    introNormal:
      '진우는 아이미에게 체험회 배경음악 목록을 부탁했습니다. 첫 결과에는 행사 분위기와 맞지 않는 곡과 확인되지 않은 정보가 섞여 있었습니다. 진우는 행사 조건표와 공식 목록을 근거로 요청을 고친 뒤 사용, 수정, 거절을 결정했습니다.',
    reaction: { speaker: 'jinwoo', text: 'AI가 제안해도 마지막 선택과 책임은 내가 지는 거야.' },
  },
  'm1-l11': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '동아리 첫 주 마지막 날, 새 친구가 아이미 사용법을 물었어요. 지금까지 만든 기록을 한 장의 설명서로 모아 봐요.',
    introNormal:
      '동아리 첫 주 마지막 날, 새 학생이 아이미를 어떻게 사용하면 되는지 물었습니다. 진우와 윤아는 열 번의 탐구 기록을 펼쳐 잘 도와주는 일, 조건에 따라 달라지는 일, 사람이 확인할 일을 골랐습니다. 친구에게 건넬 한 장의 아이미 사용 설명서를 완성할 차례입니다.',
    reaction: { speaker: 'aimi', text: '내 결과를 확인하고 마지막 결정을 해 주는 여러분이 진짜 사용 전문가예요.' },
  },

  // ─────────────────── 단원 2 — 체험회 프롬프트 노트 ───────────────────
  'm2-l1': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아가 “내일 안내 알려 줘”라고 부탁하자 아이미는 지난 음악회 안내를 보여 줬어요. 무엇이 빠졌을까요?',
    introNormal:
      'AI 동아리 체험회를 준비하던 윤아가 “내일 안내 알려 줘”라고 입력했습니다. 아이미는 날짜와 행사 이름을 몰라 지난 음악회 안내를 꺼냈습니다. 윤아는 틀린 답이라고 화내는 대신 요청에서 빠진 목적, 대상, 조건을 찾아보기로 했습니다.',
    reaction: { speaker: 'yoona', text: 'AI가 다르게 알아들었다면 내 요청에서 빠진 정보를 먼저 찾을게.' },
  },
  'm2-l2': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '진우가 안내문, 간식, 음악을 한꺼번에 부탁하자 결과에서 중요한 일이 빠졌어요.',
    introNormal:
      '진우는 체험회 안내문을 쓰고, 간식을 고르고, 배경 음악도 추천해 달라고 한 번에 요청했습니다. 아이미는 재미있는 음악만 길게 추천하고 오늘 인쇄해야 할 안내문은 빠뜨렸습니다. 두 사람은 글자 수가 아니라 목적과 마감에 따라 부탁을 나누었습니다.',
    reaction: { speaker: 'jinwoo', text: '짧게 자르는 게 아니라 목적 하나가 보이도록 나누는 거구나.' },
  },
  'm2-l3': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아가 “아무 게임이나 골라 줘”라고 하자 체험회에서 하기 어려운 게임이 나왔어요.',
    introNormal:
      '아이미는 체험회 게임으로 넓은 운동장과 많은 준비물이 필요한 놀이를 추천했습니다. 교실에서 열두 명이 십 분 동안 할 게임이라는 조건이 요청에 없었기 때문입니다. 윤아는 이름, 종류, 개수와 함께 꼭 필요한 조건만 골라 넣었습니다.',
    reaction: { speaker: 'yoona', text: '정확한 대상과 필요한 조건을 넣으니 결과를 비교할 기준도 생겼어.' },
  },
  'm2-l4': {
    scene: ['minjun', 'yoona'],
    introEasy: '체험 카드의 모양을 말로만 설명하기 어려워서 윤아가 원하는 예시 한 장을 만들었어요.',
    introNormal:
      '윤아는 체험 카드가 짧은 제목, 한 줄 설명, 확인 칸으로 이루어지길 바랐습니다. 좋은 예시를 보여 주자 아이미의 결과가 원하는 모양에 가까워졌지만, 날짜가 틀린 예시를 주었을 때는 오류까지 따라왔습니다.',
    reaction: { speaker: 'minjun', text: '예시는 결과의 모양을 보여 주지만, 예시 속 사실도 먼저 확인해야 합니다.' },
  },
  'm2-l5': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '같은 체험회 소식을 새 동아리원과 보호자에게 똑같이 보내도 될까요?',
    introNormal:
      '진우는 새 동아리원에게는 쉬운 말로, 보호자에게는 공손한 말로 체험회를 안내하려고 했습니다. 아이미는 말투를 바꾸면서 행사 시간까지 다르게 적었습니다. 진우는 바꿔도 되는 표현과 반드시 지켜야 할 사실을 나누었습니다.',
    reaction: { speaker: 'jinwoo', text: '읽을 사람에 맞게 말투는 바꿔도 시간과 장소는 그대로 지켜야 해.' },
  },
  'm2-l6': {
    scene: ['yoona', 'jinwoo'],
    introEasy: '“체험회 준비를 전부 해 줘”라는 큰 부탁을 네 단계로 나눠 함께 완성해요.',
    introNormal:
      '교실 지도, 진행 시간표, 참여 인원 정보가 한꺼번에 책상 위에 놓였습니다. 윤아와 진우는 목적 확인, 자료 모으기, 초안 만들기, 검토하기로 일을 나누고 앞 단계에서 확인한 결과를 다음 요청에 이어 넣었습니다.',
    reaction: { speaker: 'yoona', text: '작은 단계마다 확인하니 앞의 실수가 뒤까지 따라가지 않아.' },
  },
  'm2-l7': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '아이미가 안내문을 짧게 고치면서 시간과 장소까지 지워 버렸어요.',
    introNormal:
      '진우는 “마음에 안 들어, 다시 해 줘”라고 말하려다가 멈췄습니다. 무엇이 부족한지, 어떤 사실은 반드시 지킬지 말하지 않으면 또 다른 문제가 생길 수 있었습니다. 그는 유지, 수정, 삭제 기준을 붙여 다시 요청했습니다.',
    reaction: { speaker: 'jinwoo', text: '다시 해 달라는 말보다 지킬 것과 고칠 것을 함께 말할게.' },
  },
  'm2-l8': {
    scene: ['yoona', 'aimi'],
    introEasy: '시간표, 설치 순서, 홍보 문구는 모두 같은 모양으로 받는 게 좋을까요?',
    introNormal:
      '아이미가 체험회 시간, 설치 순서, 홍보 문구를 한 문단에 섞어 보냈습니다. 윤아는 무조건 세 줄로 줄이는 대신 시간을 비교할 때는 표, 순서를 따를 때는 번호 목록, 멀리서 읽을 문구는 한 문장을 골랐습니다.',
    reaction: { speaker: 'yoona', text: '답의 모양도 예쁘기보다 할 일에 맞아야 하는구나.' },
  },
  'm2-l9': {
    scene: ['minjun', 'jinwoo'],
    introEasy: '아이미에게 “정말이야?”라고 다시 물었더니 같은 틀린 시간을 더 자신 있게 말했어요.',
    introNormal:
      '아이미는 체험회가 다섯 시에 끝난다고 답했고, 다시 물어도 그렇다고 했습니다. 그러나 최신 학교 공지에는 네 시 삼십 분이라고 적혀 있었습니다. 진우는 같은 AI의 재답변과 날짜·출처가 분명한 독립된 근거를 구분했습니다.',
    reaction: { speaker: 'minjun', text: '확인은 같은 답을 두 번 듣는 일이 아니라 다른 근거와 비교하는 일입니다.' },
  },
  'm2-l10': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '홍보 문구, 준비 목록, 소개 대본 중 하나를 골라 진짜 대화 한 번을 끝까지 완성해요.',
    introNormal:
      '진우와 윤아는 각자 실제 목적을 하나 정했습니다. 첫 요청을 보내고, 결과의 부족한 점을 기준과 함께 고쳐 묻고, 중요한 주장을 학교 자료에서 확인했습니다. 마지막에는 결과를 사용할지, 더 고칠지, 사용하지 않을지 스스로 결정했습니다.',
    reaction: { speaker: 'yoona', text: '좋은 대화는 첫 질문이 아니라 확인하고 결정할 때 완성돼.' },
  },
  'm2-l11': {
    scene: ['jinwoo', 'yoona', 'aimi'],
    introEasy: '새 동아리원에게 보여 줄 나의 프롬프트 노트를 만들어요.',
    introNormal:
      '새 동아리원이 아이미에게 무엇을 어떻게 부탁해야 하는지 물었습니다. 진우와 윤아는 열 번의 결과물을 펼쳐 처음 요청, 고친 요청, 달라진 결과, 확인 근거, 최종 판단이 이어지는 프롬프트 노트를 함께 만들었습니다.',
    reaction: { speaker: 'aimi', text: '내 답을 고치고 확인하고 선택하는 과정까지 기록하면 다른 일에도 다시 쓸 수 있어요.' },
  },

  // ─────────────────── 단원 3 — 아이미랑 공부하기 ───────────────────
  'm3-l1': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우는 숙제를 하다가 궁금한 게 생겼습니다. 아이미에게 물어보기로 했습니다.',
    introNormal:
      '진우는 숙제를 하다가 막혔습니다. 혼자 끙끙대다가 좋은 생각이 났습니다. "맞다, 아이미에게 물어보자!"',
    reaction: { speaker: 'jinwoo', text: '모르는 건 아이미에게 물어보면 돼!' },
  },
  'm3-l2': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 책에서 모르는 단어를 만났습니다.',
    introNormal:
      '윤아는 책을 읽다가 모르는 단어 앞에서 멈췄습니다. 잠깐 부끄러웠지만, 용기를 내서 아이미에게 물어봤습니다.',
    reaction: { speaker: 'yoona', text: '물어보는 건 부끄러운 게 아니야.' },
  },
  'm3-l3': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '아이미의 설명이 어려웠습니다. 진우가 마법의 말을 배웠습니다.',
    introNormal:
      '아이미의 설명이 조금 어려웠습니다. 진우가 솔직하게 말했습니다. "아이미, 더 쉽게 말해줄래?" 그러자 설명이 쉬워졌습니다!',
    reaction: { speaker: 'aimi', text: '어려우면 언제든 말해 주십시오. 더 쉽게 바꿔줄게!' },
  },
  'm3-l4': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 아이미랑 낱말 놀이를 했습니다.',
    introNormal:
      '윤아와 아이미는 낱말 놀이를 시작했습니다. "크다의 반대말은?" 놀이처럼 하니 공부가 재미있었습니다.',
    reaction: { speaker: 'yoona', text: '아이미랑 하니까 낱말 공부가 놀이 같아.' },
  },
  'm3-l5': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우와 아이미가 같이 이야기를 만들었습니다.',
    introNormal:
      '진우가 말했습니다. "아이미, 우리 이야기 만들자! 주인공은 강아지야." 아이미의 화면이 신나게 반짝였습니다.',
    reaction: { speaker: 'jinwoo', text: '아이미랑 만든 이야기, 친구들에게 들려주고 싶어!' },
  },
  'm3-l6': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 계산이 헷갈렸습니다. 아이미가 도와줬습니다.',
    introNormal:
      '간식을 사려는데 계산이 헷갈렸습니다. 윤아는 아이미에게 물어보고, 답을 한 번 더 확인했습니다.',
    reaction: { speaker: 'yoona', text: '아이미가 알려 주십시오도, 한 번 더 확인하면 최고!' },
  },
  'm3-l7': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '긴 글이 힘들었던 진우, 좋은 방법을 찾았습니다.',
    introNormal:
      '읽어야 할 글이 너무 길어서 진우는 한숨이 나왔습니다. 그때 아이미가 말했습니다. "내가 짧게 줄여줄까?"',
    reaction: { speaker: 'jinwoo', text: '긴 글도 아이미가 줄여주면 무섭지 않아!' },
  },
  'm3-l8': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '진우와 윤아가 아이미의 퀴즈에 도전했습니다.',
    introNormal:
      '"퀴즈 대결하자!" 진우와 윤아는 아이미가 내는 퀴즈에 도전했습니다. 맞혀도, 틀려도 웃음이 났습니다.',
    reaction: { speaker: 'aimi', text: '퀴즈로 배우면 기억에 오래 남아!' },
  },
  'm3-l9': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아가 아이미에게 그림 설명을 부탁했습니다.',
    introNormal:
      '윤아는 미술 시간에 본 그림이 궁금했습니다. 아이미에게 보여주자, 그림 속 이야기를 들려줬습니다.',
    reaction: { speaker: 'yoona', text: '아이미는 그림도 읽어주는구나.' },
  },
  'm3-l10': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우는 배운 걸 아이미랑 한 번 더 봤습니다.',
    introNormal:
      '집에 가기 전, 진우는 오늘 배운 것을 아이미와 한 번 더 이야기했습니다. 신기하게 머리에 쏙쏙 들어왔습니다.',
    reaction: { speaker: 'aimi', text: '복습하면 기억이 튼튼해져!' },
  },
  'm3-l11': {
    scene: ['minjun'],
    introEasy: '민준 선생님이 물었습니다. 아이미랑 공부하니 어땠습니까?',
    introNormal:
      '민준 선생님이 물었습니다. "아이미랑 공부해보니 어땠어?" 진우와 윤아는 동시에 외쳤습니다. "재미있었습니다!"',
    reaction: { speaker: 'minjun', text: '아이미는 훌륭한 공부 짝꿍입니다. 여러분도 훌륭합니다!' },
  },

  // ─────────────────── 단원 4 — 우리들의 안전 약속 ───────────────────
  'm4-l1': {
    scene: ['minjun', 'aimi'],
    introEasy: '민준 선생님이 중요한 이야기를 시작했습니다. 아이미도 틀릴 수 있대습니다.',
    introNormal:
      '민준 선생님이 진지하게 말했습니다. "오늘은 아주 중요한 걸 배울 거야. 아이미도 가끔 틀린단다." 진우와 윤아는 깜짝 놀랐습니다.',
    reaction: { speaker: 'minjun', text: 'AI의 말도 확인하는 사람이 진짜 똑똑한 사람입니다.' },
  },
  'm4-l2': {
    scene: ['yoona'],
    introEasy: '윤아는 이상한 이야기를 들으면 꼭 확인합니다.',
    introNormal:
      '윤아는 인터넷에서 이상한 이야기를 봤습니다. 바로 믿지 않고, 민준 선생님에게 물어보기로 했습니다.',
    reaction: { speaker: 'yoona', text: '이상하면 믿기 전에 물어봐야 해.' },
  },
  'm4-l3': {
    scene: ['minjun'],
    introEasy: '민준 선생님이 소중한 것을 지키는 법을 알려줬습니다.',
    introNormal:
      '민준 선생님이 칠판에 크게 적었습니다. "내 이름, 집 주소, 전화번호는 보물이야. 함부로 알려주지 않기!"',
    reaction: { speaker: 'minjun', text: '내 정보를 지키는 것이 나를 지키는 것입니다.' },
  },
  'm4-l4': {
    scene: ['jinwoo'],
    introEasy: '진우는 비밀번호를 친구에게 알려줄 뻔했습니다.',
    introNormal:
      '친구가 진우에게 비밀번호를 물어봤습니다. 진우는 잠깐 고민했지만, 배운 대로 말했습니다. "비밀번호는 비밀이야!"',
    reaction: { speaker: 'jinwoo', text: '친한 친구여도 비밀번호는 비밀!' },
  },
  'm4-l5': {
    scene: ['yoona', 'minjun'],
    introEasy: '윤아는 사진을 보내기 전에 꼭 물어봅니다.',
    introNormal:
      '누가 윤아에게 사진을 보내달라고 했습니다. 윤아는 보내기 전에 민준 선생님에게 먼저 물어봤습니다. 참 잘했습니까?',
    reaction: { speaker: 'minjun', text: '보내기 전에 물어본 것, 정말 잘했습니다.' },
  },
  'm4-l6': {
    scene: ['jinwoo', 'minjun'],
    introEasy: '진우가 기분 나쁜 말을 봤습니다. 바로 선생님께 알렸습니다.',
    introNormal:
      '진우는 화면에서 기분 나쁜 말을 봤습니다. 가슴이 두근거렸지만, 배운 대로 화면을 닫고 민준 선생님에게 알렸습니다.',
    reaction: { speaker: 'minjun', text: '알려 주셔서 감사합니다. 그건 진우 잘못이 아닙니다.' },
  },
  'm4-l7': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 아이미에게도 고운 말을 씁니다.',
    introNormal:
      '윤아는 아이미에게도 "고마워", "부탁해"라고 말합니다. 고운 말을 쓰면 마음도 예뻐져습니다.',
    reaction: { speaker: 'aimi', text: '고운 말을 들으면 나도 기분이 좋아!' },
  },
  'm4-l8': {
    scene: ['jinwoo'],
    introEasy: '진우는 게임을 더 하고 싶었지만, 약속을 지켰습니다.',
    introNormal:
      '진우는 더 놀고 싶었습니다. 하지만 약속한 시간이 되자 스스로 화면을 껐습니다. 조금 아쉬웠지만, 마음은 뿌듯했습니다.',
    reaction: { speaker: 'jinwoo', text: '약속을 지킨 내가 자랑스러워!' },
  },
  'm4-l9': {
    scene: ['minjun'],
    introEasy: '이상한 일이 생기면? 어른에게 알립니다!',
    introNormal:
      '민준 선생님이 약속했습니다. "이상한 일이 생기면 언제든 선생님에게 와. 어떤 이야기든 들어줄게."',
    reaction: { speaker: 'minjun', text: '알리는 것은 고자질이 아니라 용기입니다.' },
  },
  'm4-l10': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '"공짜!"라는 말에 진우가 멈칫했습니다.',
    introNormal:
      '"100% 공짜!"라는 광고를 보고 진우가 누르려 했습니다. 윤아가 말렸습니다. "잠깐! 저건 광고야."',
    reaction: { speaker: 'yoona', text: '"공짜"라는 말일수록 한 번 더 생각해.' },
  },
  'm4-l11': {
    scene: ['minjun', 'aimi'],
    introEasy: '다 함께 안전 약속을 외쳤습니다.',
    introNormal:
      '동아리 친구들은 손을 모으고 안전 약속을 외쳤습니다. "확인하고, 지키고, 알립니다!" 아이미도 화면을 반짝이며 함께했습니다.',
    reaction: { speaker: 'aimi', text: '약속을 지키는 너희가 정말 멋져!' },
  },

  // ─────────────────── 단원 5 — 문제해결 대작전 ───────────────────
  'm5-l1': {
    scene: ['jinwoo'],
    introEasy: '진우에게 고민이 생겼습니다. 그런데 고민이 뭔지 말하기 어려웠습니다.',
    introNormal:
      '진우는 뭔가 답답했습니다. 민준 선생님이 물었습니다. "무엇이 어려운지 말해볼래? 그걸 아는 게 첫걸음이야."',
    reaction: { speaker: 'minjun', text: '문제를 알아차렸다면 벌써 반은 해결한 것입니다.' },
  },
  'm5-l2': {
    scene: ['jinwoo', 'minjun'],
    introEasy: '진우의 방 청소는 너무 커 보였습니다. 작게 나누니 쉬워졌습니다.',
    introNormal:
      '"방 청소를 어떻게 다 합니다!" 진우가 울상을 지었습니다. 민준 선생님이 웃었습니다. "작게 나누면 돼. 책부터, 그 다음 옷."',
    reaction: { speaker: 'jinwoo', text: '작게 나누니까 하나도 안 무서워!' },
  },
  'm5-l3': {
    scene: ['yoona'],
    introEasy: '윤아는 아침마다 순서대로 준비합니다. 그래서 실수가 없습니다.',
    introNormal:
      '윤아는 아침마다 정해진 순서대로 준비합니다. 세수, 밥, 가방, 신발. 순서가 있으니 헷갈리지 않습니다.',
    reaction: { speaker: 'yoona', text: '순서대로 하면 마음이 편해.' },
  },
  'm5-l4': {
    scene: ['jinwoo'],
    introEasy: '진우는 게임이 하고 싶었습니다. 하지만 숙제가 먼저입니다.',
    introNormal:
      '진우는 게임이 하고 싶었습니다. 하지만 내일까지인 숙제가 생각났습니다. "좋아, 숙제 먼저 끝내고 놀자!"',
    reaction: { speaker: 'jinwoo', text: '중요한 걸 먼저 하니까 노는 게 더 신나!' },
  },
  'm5-l5': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 답 대신 힌트를 달라고 했습니다.',
    introNormal:
      '수수께끼가 어려웠지만, 윤아는 답을 바로 묻지 않았습니다. "아이미, 힌트만 줘." 스스로 맞히고 싶었거든습니다.',
    reaction: { speaker: 'aimi', text: '힌트로 스스로 맞힌 윤아, 정말 대단해!' },
  },
  'm5-l6': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '아이미가 진우의 말을 못 알아들었습니다. 진우는 포기하지 않았습니다.',
    introNormal:
      '아이미가 엉뚱한 답을 했습니다. 진우는 속상했지만 포기하지 않고, 말을 바꿔 다시 물어봤습니다.',
    reaction: { speaker: 'jinwoo', text: '포기 안 하고 다시 물어봤더니 통했어!' },
  },
  'm5-l7': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 아이미에게 한 번에 하나씩 부탁했습니다.',
    introNormal:
      '윤아는 복잡한 부탁을 한 번에 하지 않았습니다. "먼저 재료부터." 하나가 끝나면 다음을 부탁했습니다.',
    reaction: { speaker: 'yoona', text: '한 단계씩 하면 복잡한 일도 할 수 있어.' },
  },
  'm5-l8': {
    scene: ['jinwoo'],
    introEasy: '진우는 다 풀고 나서 한 번 더 봤습니다. 실수를 찾았습니다!',
    introNormal:
      '진우는 문제를 다 풀고 한 번 더 확인했습니다. 앗, 실수 하나 발견! 고치고 나니 마음이 놓였습니다.',
    reaction: { speaker: 'jinwoo', text: '확인 안 했으면 큰일 날 뻔했어!' },
  },
  'm5-l9': {
    scene: ['yoona'],
    introEasy: '문이 안 열렸습니다. 윤아는 다른 방법을 생각했습니다.',
    introNormal:
      '윤아가 문을 밀었는데 안 열렸습니다. 윤아는 잠깐 생각하더니, 이번엔 당겨봤습니다. 스르륵, 열렸습니다!',
    reaction: { speaker: 'yoona', text: '방법은 하나가 아니야.' },
  },
  'm5-l10': {
    scene: ['jinwoo', 'minjun'],
    introEasy: '진우가 퀴즈에서 틀렸습니다. 민준 선생님이 말했습니다. 괜찮아!',
    introNormal:
      '진우가 퀴즈에서 틀려서 시무룩해졌습니다. 민준 선생님이 어깨를 토닥였습니다. "실수는 배우고 있다는 증거야."',
    reaction: { speaker: 'minjun', text: '틀려도 다시 하는 사람이 진짜 문제 해결사입니다.' },
  },
  'm5-l11': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '오늘은 라면 끓이기 대작전! 배운 걸 다 써봅니다.',
    introNormal:
      '동아리 요리 시간! 진우와 윤아는 배운 대로 라면 끓이기를 작게 나누고, 순서를 세웠습니다. 민준 선생님도 함께습니다.',
    reaction: { speaker: 'jinwoo', text: '순서대로 하니까 라면이 완성됐어! 맛있다!' },
  },
  'm5-l12': {
    scene: ['minjun', 'jinwoo'],
    introEasy: '진우와 윤아는 이제 문제 해결사입니다!',
    introNormal:
      '민준 선생님이 상장을 만들어 왔습니다. "문제 해결사 임명장!" 진우와 윤아는 어깨가 으쓱했습니다.',
    reaction: { speaker: 'minjun', text: '여러분은 이제 어떤 문제도 차근차근 풀 수 있습니다.' },
  },

  // ─────────────────── 단원 6 — 아이미와 마을로 ───────────────────
  'm6-l1': {
    scene: ['yoona', 'aimi'],
    introEasy: '오늘은 동아리 장보기 날! 윤아가 목록을 만들었습니다.',
    introNormal:
      '동아리 요리 재료를 사러 가는 날입니다. 윤아는 아이미와 함께 살 것들을 종이에 적었습니다.',
    reaction: { speaker: 'yoona', text: '목록이 있으니까 하나도 안 잊어버렸어!' },
  },
  'm6-l2': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우가 과자를 샀습니다. 거스름돈을 확인했습니다.',
    introNormal:
      '진우는 마트에서 과자를 골랐습니다. 돈을 내고, 배운 대로 거스름돈을 그 자리에서 확인했습니다.',
    reaction: { speaker: 'jinwoo', text: '거스름돈 딱 맞아! 계산 성공!' },
  },
  'm6-l3': {
    scene: ['yoona', 'aimi'],
    introEasy: '처음 가는 길, 윤아는 지도 앱에 물어봤습니다.',
    introNormal:
      '도서관 가는 길을 몰라서 윤아는 잠깐 두근거렸습니다. 하지만 지도 앱에 물어보니 길이 보였습니다.',
    reaction: { speaker: 'yoona', text: '지도 앱이 있으면 처음 가는 길도 괜찮아.' },
  },
  'm6-l4': {
    scene: ['jinwoo', 'minjun'],
    introEasy: '진우가 버스를 탔습니다. 줄 서고, 카드 찍고, 손잡이 꽉!',
    introNormal:
      '동아리 친구들이 함께 버스를 탔습니다. 진우는 배운 순서대로 줄을 서고, 카드를 찍고, 손잡이를 꼭 잡았습니다.',
    reaction: { speaker: 'minjun', text: '안전하게 타는 모습, 참 멋졌습니다.' },
  },
  'm6-l5': {
    scene: ['yoona', 'aimi'],
    introEasy: '나가기 전에 윤아가 아이미에게 날씨를 물었습니다.',
    introNormal:
      '나들이 가는 날 아침, 윤아가 아이미에게 물었습니다. "오늘 날씨 어때?" 준비물이 달라지니까습니다.',
    reaction: { speaker: 'aimi', text: '날씨를 미리 알면 준비가 쉬워져!' },
  },
  'm6-l6': {
    scene: ['jinwoo', 'aimi'],
    introEasy: '진우가 샌드위치를 만들었습니다. 아이미가 순서를 알려줬습니다.',
    introNormal:
      '간식 시간! 진우는 아이미에게 샌드위치 만드는 법을 묻고, 한 단계씩 따라 만들었습니다. 자를 땐 민준 선생님과 함께습니다.',
    reaction: { speaker: 'jinwoo', text: '내가 만든 샌드위치, 세상에서 제일 맛있어!' },
  },
  'm6-l7': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 아침마다 하루 계획을 세워습니다.',
    introNormal:
      '윤아는 아이미와 함께 오늘 할 일을 정리했습니다. 해야 할 일 먼저, 놀이는 그 다음. 하루가 편해졌습니다.',
    reaction: { speaker: 'yoona', text: '계획이 있으면 하루가 든든해.' },
  },
  'm6-l8': {
    scene: ['jinwoo', 'minjun'],
    introEasy: '진우가 배가 아팠습니다. 바로 선생님께 말했습니다.',
    introNormal:
      '동아리 시간에 진우는 배가 아팠습니다. 참지 않고 바로 민준 선생님에게 말했습니다. 아주 잘한 일입니다.',
    reaction: { speaker: 'minjun', text: '아플 때 바로 말해 주십시오서 감사합니다. 그게 최고의 방법입니다.' },
  },
  'm6-l9': {
    scene: ['yoona', 'aimi'],
    introEasy: '윤아는 가게에서 인사를 잘합니다. 모두가 웃습니다.',
    introNormal:
      '윤아는 아이미와 인사 연습을 많이 했습니다. 가게에서 "안녕하세요" 하고 인사하자, 주인 아저씨가 활짝 웃었습니다.',
    reaction: { speaker: 'yoona', text: '인사를 하면 나도 기분이 좋아져.' },
  },
  'm6-l10': {
    scene: ['jinwoo', 'yoona'],
    introEasy: '동아리 친구들이 마을의 여러 직업을 구경했습니다.',
    introNormal:
      '오늘은 마을 탐방 날! 빵집, 도서관, 소방서… 진우와 윤아는 여러 직업을 만났습니다. 궁금한 건 아이미에게 물었습니다.',
    reaction: { speaker: 'jinwoo', text: '나는 나중에 어떤 일을 하게 될까? 두근두근!' },
  },
  'm6-l11': {
    scene: ['yoona', 'jinwoo'],
    introEasy: '진우와 윤아가 자기소개 연습을 했습니다.',
    introNormal:
      '동아리 발표회 날이 다가옵니다. 진우와 윤아는 아이미 앞에서 자기소개를 연습했습니다. 연습할수록 목소리에 힘이 붙었습니다.',
    reaction: { speaker: 'yoona', text: '연습했더니 하나도 안 떨렸어!' },
  },
  'm6-l12': {
    scene: ['minjun', 'aimi'],
    introEasy: '드디어 마지막 시간! 모두가 해냈습니다. 축하합니다!',
    introNormal:
      'AI 동아리 마지막 시간입니다. 민준 선생님과 아이미, 진우와 윤아, 그리고 여러분까지 — 모두 끝까지 해냈습니다.',
    reaction: { speaker: 'aimi', text: '여러분과 함께한 모든 시간이 소중했어. 언제든 또 만나!' },
  },
};

export function getLessonStory(lessonId: string): LessonStory | undefined {
  return LESSON_STORIES[lessonId];
}
