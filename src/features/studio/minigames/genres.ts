import type { LessonId } from '../../../types';

/**
 * 차시별 게임 장르 배정표 (단일 진실 원천).
 *
 * 앞선 판의 미니게임 상당수는 "버튼 세 개를 순서와 상관없이 누르면 성공"이었다.
 * 조작이 공간적이지도, 실패가 실제로 일어나지도 않아 게임이라 부를 수 없었다.
 * 그래서 62차시 중 60차시를 서로 다른 장르의 진짜 게임으로 다시 만들었다.
 *
 * 배정 원칙:
 *  1. 장르가 학습목표의 **모양**과 같아야 한다. 예를 들어 "한 단계 실행하고 확인"은
 *     확인 발판을 밟아야 다음 뒤집기가 열리는 중력 반전이지, 주제를 입힌 퀴즈가 아니다.
 *  2. 한 장르를 두 차시가 나눠 쓸 수 있지만, 그때는 조작이 실제로 달라야 한다.
 *     (예: 미로 두 개 — 하나는 함정 회피, 하나는 지도와 현장 표지의 어긋남 수정)
 *  3. `m1-l2`(한 붓 그리기)와 `m1-l3`(다음 낱말 잇기)은 이미 게임으로 성립해 그대로 둔다.
 *     그래서 이 표에는 60개만 있고, 19번 한 붓 그리기는 m1-l2가 계속 맡는다.
 *
 * `npm run check:minigames`가 이 표와 registry, 실제 파일을 함께 검사한다.
 */
export interface GenreAssignment {
  lessonId: LessonId;
  /** 장르 번호 (1~52) */
  genre: number;
  /** 장르 이름 — 교사 화면과 검사 보고에 쓴다. 학생 화면에는 badge를 쓴다. */
  genreName: string;
  /** 학생에게 보이는 게임 이름표. MiniGameFrame의 badge와 같아야 한다. */
  badge: string;
  /** 컴포넌트 파일 이름(확장자 제외) */
  component: string;
}

export const GENRE_ASSIGNMENTS: GenreAssignment[] = [
  // ── M1 · AI 이해 ─────────────────────────────────────────────
  { lessonId: 'm1-l1', genre: 11, genreName: '숨은 그림 찾기', badge: '생활 속 AI 찾기', component: 'AiSpotHuntGame' },
  { lessonId: 'm1-l4', genre: 22, genreName: '시점 조작 퍼즐', badge: '카메라 각도 돌리기', component: 'LensAngleTurnGame' },
  { lessonId: 'm1-l5', genre: 23, genreName: '리듬 액션', badge: '말 받아쓰기 리듬', component: 'VoiceRhythmGame' },
  { lessonId: 'm1-l6', genre: 50, genreName: '재활용 분류', badge: '배움 상자 골고루', component: 'DataBalanceSortGame' },
  { lessonId: 'm1-l7', genre: 12, genreName: '같은 말 짝짓기', badge: '같은 말 짝짓기', component: 'SummaryDiffGame' },
  { lessonId: 'm1-l8', genre: 17, genreName: '분류 매치', badge: '같은 모양 상자 옮기기', component: 'JudgmentCratePushGame' },
  { lessonId: 'm1-l9', genre: 16, genreName: '파이프 연결', badge: '도구 관 잇기', component: 'ToolPipeConnectGame' },
  { lessonId: 'm1-l10', genre: 42, genreName: '카드 짝맞추기', badge: '노래 짝 맞추기', component: 'SongMatchGame' },

  // ── M2 · 프롬프트 ────────────────────────────────────────────
  { lessonId: 'm2-l1', genre: 14, genreName: '낙하 블록 퍼즐', badge: '정보 블록 쌓기', component: 'InfoBlockDropGame' },
  { lessonId: 'm2-l2', genre: 32, genreName: '풍선 터뜨리기', badge: '급한 부탁 풍선', component: 'OneCounterQueueGame' },
  { lessonId: 'm2-l3', genre: 27, genreName: '레이저 슈팅', badge: '레이저로 고르기', component: 'PreciseAimGame' },
  { lessonId: 'm2-l4', genre: 20, genreName: '지뢰 찾기', badge: '예시 지뢰 찾기', component: 'ExampleGridGame' },
  { lessonId: 'm2-l5', genre: 31, genreName: '스티어링', badge: '말투 도로 운전', component: 'ToneRoadDriveGame' },
  { lessonId: 'm2-l6', genre: 36, genreName: '팩맨 먹이 모으기', badge: '단계 재료 모으기', component: 'StepHookSwingGame' },
  { lessonId: 'm2-l7', genre: 25, genreName: '슬라이싱', badge: '모호한 말 베기', component: 'VagueSliceGame' },
  { lessonId: 'm2-l8', genre: 6, genreName: '경로 그리기', badge: '형식 틀로 흘리기', component: 'FormatPourPathGame' },
  { lessonId: 'm2-l9', genre: 14, genreName: '낙하 블록 퍼즐', badge: '주장과 근거 잇기', component: 'EvidenceLinkGame' },
  { lessonId: 'm2-l10', genre: 29, genreName: '핀볼', badge: '대화 핀볼', component: 'ConversationPinballGame' },

  // ── M3 · 공부 도우미 ─────────────────────────────────────────
  { lessonId: 'm3-l1', genre: 2, genreName: '무한 계단', badge: '질문 계단 오르기', component: 'QuestionClimbGame' },
  { lessonId: 'm3-l2', genre: 18, genreName: '방탈출 퍼즐', badge: '낱말 자물쇠 방', component: 'WordLockRoomGame' },
  { lessonId: 'm3-l3', genre: 26, genreName: '벽돌깨기', badge: '어려운 말 벽 깨기', component: 'HardWordBreakGame' },
  { lessonId: 'm3-l4', genre: 8, genreName: '비행 플래피', badge: '낱말 세기 비행', component: 'WordStrengthFlyGame' },
  { lessonId: 'm3-l5', genre: 1, genreName: '횡스크롤 점프맵', badge: '이야기 길 뛰기', component: 'StoryJumpMapGame' },
  { lessonId: 'm3-l6', genre: 28, genreName: '포탄 각도', badge: '합계 대포', component: 'SumCannonGame' },
  { lessonId: 'm3-l7', genre: 13, genreName: '3매치 퍼즐', badge: '같은 뜻 세 개', component: 'SummaryMatchGame' },
  { lessonId: 'm3-l8', genre: 42, genreName: '카드 짝맞추기', badge: '양면 퀴즈 카드', component: 'QuizCardMemoryGame' },
  { lessonId: 'm3-l9', genre: 32, genreName: '두더지 잡기', badge: '추측만 두드리기', component: 'GuessMoleGame' },
  { lessonId: 'm3-l10', genre: 36, genreName: '뱀 키우기', badge: '떠올린 순서 뱀', component: 'RecallSnakeGame' },

  // ── M4 · 안전 ────────────────────────────────────────────────
  { lessonId: 'm4-l1', genre: 34, genreName: '타워 디펜스', badge: '확인 탑 세우기', component: 'CheckTowerGame' },
  { lessonId: 'm4-l2', genre: 5, genreName: '등반 클라이밍', badge: '출처 절벽 오르기', component: 'SourceClimbGame' },
  { lessonId: 'm4-l3', genre: 21, genreName: '정돈 클리닝', badge: '개인정보 지우기', component: 'PrivacyScrubGame' },
  { lessonId: 'm4-l4', genre: 33, genreName: '밀쳐내기', badge: '요구 밀어내기', component: 'CodeRequestPushGame' },
  { lessonId: 'm4-l5', genre: 11, genreName: '숨은 그림 찾기', badge: '사진 검사대', component: 'PhotoCheckDeskGame' },
  { lessonId: 'm4-l6', genre: 24, genreName: '탄막 피하기', badge: '불편한 화면 피하기', component: 'UncomfortableDodgeGame' },
  { lessonId: 'm4-l7', genre: 10, genreName: '물리 흔들기', badge: '흔들 팔로 건네기', component: 'RespectHandoverGame' },
  { lessonId: 'm4-l8', genre: 30, genreName: '타이밍 액션', badge: '멈춤 타이밍', component: 'StopTimingGame' },
  { lessonId: 'm4-l9', genre: 4, genreName: '미로 찾기', badge: '대화 미로', component: 'ChatMazeGame' },
  { lessonId: 'm4-l10', genre: 35, genreName: '땅따먹기', badge: '광고 구역 두르기', component: 'AdFenceGame' },

  // ── M5 · 문제 해결 ───────────────────────────────────────────
  { lessonId: 'm5-l1', genre: 48, genreName: '조립 개조', badge: '문제 수레 조립', component: 'ProblemRigBuildGame' },
  { lessonId: 'm5-l2', genre: 52, genreName: '방치형 공장', badge: '과제 분해 공장', component: 'TaskSplitFactoryGame' },
  { lessonId: 'm5-l3', genre: 47, genreName: '마을 건설', badge: '부스 세우기', component: 'BoothStackBuildGame' },
  { lessonId: 'm5-l4', genre: 40, genreName: '진지 점령', badge: '먼저 할 일 보내기', component: 'PriorityDispatchGame' },
  { lessonId: 'm5-l5', genre: 37, genreName: '키우기 클리커', badge: '매듭 풀기', component: 'KnotUntieGame' },
  { lessonId: 'm5-l6', genre: 41, genreName: '합성 머지', badge: '단서 합치기', component: 'ClueMergeGame' },
  { lessonId: 'm5-l7', genre: 7, genreName: '중력 반전', badge: '한 단계씩 뒤집기', component: 'StepFlipGame' },
  { lessonId: 'm5-l8', genre: 12, genreName: '틀린 그림 찾기', badge: '조건표와 대조', component: 'ResultCheckDiffGame' },
  { lessonId: 'm5-l9', genre: 38, genreName: '오토배틀러', badge: '두 방법 시험 경주', component: 'PlanRaceSimGame' },
  { lessonId: 'm5-l10', genre: 16, genreName: '파이프 연결', badge: '새는 곳 고치기', component: 'LeakFixPipeGame' },
  { lessonId: 'm5-l11', genre: 3, genreName: '무한 달리기', badge: '계획 바꿔 달리기', component: 'PlanChangeRunGame' },

  // ── M6 · 생활 적용 ───────────────────────────────────────────
  { lessonId: 'm6-l1', genre: 46, genreName: '매장 재고 관리', badge: '조건 맞춰 담기', component: 'ShoppingStockGame' },
  { lessonId: 'm6-l2', genre: 15, genreName: '숫자 합치기', badge: '동전 합치기', component: 'CoinMergeGame' },
  { lessonId: 'm6-l3', genre: 4, genreName: '미로 찾기', badge: '지도와 표지 미로', component: 'MapSignMazeGame' },
  { lessonId: 'm6-l4', genre: 30, genreName: '타이밍 액션', badge: '버스 타는 순간', component: 'BusBoardTimingGame' },
  { lessonId: 'm6-l5', genre: 39, genreName: '카드 배틀', badge: '날씨 옷 카드', component: 'WeatherCardGame' },
  { lessonId: 'm6-l6', genre: 44, genreName: '요리 타이쿤', badge: '안전 요리 주방', component: 'SafeCookingGame' },
  { lessonId: 'm6-l7', genre: 45, genreName: '농장 경영', badge: '하루 텃밭', component: 'DayGardenGame' },
  { lessonId: 'm6-l8', genre: 51, genreName: '진료 놀이', badge: '아픈 곳 짚기', component: 'SymptomClinicGame' },
  { lessonId: 'm6-l9', genre: 49, genreName: '손님 안내', badge: '표현 교환대', component: 'ExpressionDeskGame' },
  { lessonId: 'm6-l10', genre: 48, genreName: '조립 개조', badge: '직업 하루 조립', component: 'JobDayRigGame' },
  { lessonId: 'm6-l11', genre: 22, genreName: '시점 조작 퍼즐', badge: '두 방향 소개', component: 'TwoViewIntroGame' },
];

/** 다시 만들지 않고 그대로 둔 두 차시. 이미 조작과 실패가 있는 게임이다. */
export const KEPT_LESSON_IDS: LessonId[] = ['m1-l2', 'm1-l3'];

export function genreFor(lessonId: LessonId | undefined): GenreAssignment | null {
  if (!lessonId) return null;
  return GENRE_ASSIGNMENTS.find((entry) => entry.lessonId === lessonId) ?? null;
}
