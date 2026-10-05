/**
 * 다음 낱말 이어 말하기(m1-l3)의 세 단계.
 *
 * 낱말을 더하거나 고치면 `npm run test:next-word-balloons`로 새 낱말도 풍선 안에 들어가는지
 * 확인한다. 풍선 크기와 글자 맞춤은 `nextWordBalloons.ts`가 맡는다.
 */

export interface StepConfig {
  balloons: { word: string; probability: number }[];
}

export interface StageConfig {
  id: string;
  title: string;
  initialPrompt: string;
  steps: StepConfig[];
  factCheckSource: string;
  realFact: string;
}

export const GAME_STAGES: StageConfig[] = [
  {
    id: 'lunch',
    title: '1단계 · 오늘 급식 메뉴 만들기',
    initialPrompt: '오늘 급식은',
    factCheckSource: '학교 게시판 주간 식단표',
    realFact: '오늘의 진짜 급식 메뉴는 제육볶음과 미역국입니다.',
    steps: [
      {
        balloons: [
          { word: '맛있는', probability: 85 },
          { word: '달콤한', probability: 55 },
          { word: '엉뚱한', probability: 25 },
        ],
      },
      {
        balloons: [
          { word: '무지개', probability: 90 },
          { word: '얼큰한', probability: 50 },
          { word: '따뜻한', probability: 30 },
        ],
      },
      {
        balloons: [
          { word: '아이스크림 떡볶이야!', probability: 95 },
          { word: '제육볶음이야!', probability: 65 },
          { word: '피자 치킨이야!', probability: 40 },
        ],
      },
    ],
  },
  {
    id: 'school',
    title: '2단계 · 학교 소식 만들기',
    initialPrompt: '우리 학교 운동장에서',
    factCheckSource: '학교 공식 가정통신문',
    realFact: '오늘 운동장에서는 체육 수업이 진행됩니다.',
    steps: [
      {
        balloons: [
          { word: '신나는', probability: 80 },
          { word: '조용한', probability: 40 },
        ],
      },
      {
        balloons: [
          { word: '우주비행사', probability: 90 },
          { word: '공룡 친구들의', probability: 45 },
        ],
      },
      {
        balloons: [
          { word: '아이돌 콘서트가 열려!', probability: 95 },
          { word: '로봇 축제가 시작돼!', probability: 60 },
        ],
      },
    ],
  },
  {
    id: 'weather',
    title: '3단계 · 오늘 날씨 예보 만들기',
    initialPrompt: '오늘 날씨는',
    factCheckSource: '기상청 공식 일기예보',
    realFact: '오늘 서울 지역은 맑고 기온은 22도입니다.',
    steps: [
      {
        balloons: [
          { word: '햇살 쨍쨍한', probability: 85 },
          { word: '바람 쌩쌩', probability: 45 },
        ],
      },
      {
        balloons: [
          { word: '무지개 구름과', probability: 80 },
          { word: '초콜릿 비가 내려', probability: 35 },
        ],
      },
      {
        balloons: [
          { word: '소풍 가기 딱 좋아!', probability: 95 },
          { word: '우산 꼭 챙겨요!', probability: 50 },
        ],
      },
    ],
  },
];
