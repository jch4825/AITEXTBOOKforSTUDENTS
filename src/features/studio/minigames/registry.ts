import { lazy } from 'react';
import type { LessonId } from '../../../types';

/**
 * 차시별 미니게임 등록부.
 *
 * 스튜디오 62차시의 마무리 단계(complete) 왼쪽 패널에 들어가는 게임을 여기서만 연결한다.
 * 등록이 없는 차시는 기존 "오늘 배운 핵심 이야기" 정리 패널이 그대로 나온다.
 *
 * 반드시 lazy로 등록한다. 62개를 정적 import하면 첫 화면 번들에 전부 실려
 * 홈·목차 진입 속도가 무너진다. 게임 하나당 gzip 15KB를 예산으로 잡는다.
 *
 * 등록 조건(게임성 5원칙) — 다섯 가지를 모두 만족해야 한다.
 *  1) 조작이 공간적·연속적이다 (드래그·그리기·조준·타이밍). "선택지 N개 중 택1"은 불가
 *  2) 결과가 정답표 조회가 아니라 학생이 만든 상태에서 파생된다
 *  3) 성공 경로가 둘 이상이거나 점수가 연속값이다
 *  4) 성패가 움직임·색으로 먼저 보이고 글자는 보조다
 *  5) 실패 메시지는 읽을 때까지 유지하고, 학생이 직접 다시 시도할 수 있다
 */
export const MINI_GAME_REGISTRY: Record<string, ReturnType<typeof lazy>> = {
  'm1-l1': lazy(() => import('./m1/AiSpotHuntGame')),
  'm1-l2': lazy(() => import('./m1/RobotVacuumPathGame')),
  'm1-l3': lazy(() => import('./m1/NextWordRunnerGame')),
  'm1-l4': lazy(() => import('./m1/LensAngleTurnGame')),
  'm1-l5': lazy(() => import('./m1/VoiceRhythmGame')),
  'm1-l6': lazy(() => import('./m1/DataBalanceSortGame')),
  'm1-l7': lazy(() => import('./m1/SummaryDiffGame')),
  'm1-l8': lazy(() => import('./m1/JudgmentCratePushGame')),
  'm1-l9': lazy(() => import('./m1/ToolPipeConnectGame')),
  'm1-l10': lazy(() => import('./m1/SongMatchGame')),
  'm2-l1': lazy(() => import('./m2/InfoBlockDropGame')),
  'm2-l2': lazy(() => import('./m2/OneCounterQueueGame')),
  'm2-l3': lazy(() => import('./m2/PreciseAimGame')),
  'm2-l4': lazy(() => import('./m2/ExampleGridGame')),
  'm2-l5': lazy(() => import('./m2/ToneRoadDriveGame')),
  'm2-l7': lazy(() => import('./m2/VagueSliceGame')),
  'm2-l6': lazy(() => import('./m2/StepHookSwingGame')),
  'm2-l8': lazy(() => import('./m2/FormatPourPathGame')),
  'm2-l9': lazy(() => import('./m2/EvidenceLinkGame')),
  'm2-l10': lazy(() => import('./m2/ConversationPinballGame')),
  'm3-l1': lazy(() => import('./m3/QuestionClimbGame')),
  'm3-l2': lazy(() => import('./m3/WordLockRoomGame')),
  'm3-l3': lazy(() => import('./m3/HardWordBreakGame')),
  'm3-l4': lazy(() => import('./m3/WordStrengthFlyGame')),
  'm3-l5': lazy(() => import('./m3/StoryJumpMapGame')),
  'm3-l6': lazy(() => import('./m3/SumCannonGame')),
  'm3-l7': lazy(() => import('./m3/SummaryMatchGame')),
  'm3-l8': lazy(() => import('./m3/QuizCardMemoryGame')),
  'm3-l9': lazy(() => import('./m3/GuessMoleGame')),
  'm3-l10': lazy(() => import('./m3/RecallSnakeGame')),
  'm4-l1': lazy(() => import('./m4/CheckTowerGame')),
  'm4-l2': lazy(() => import('./m4/SourceClimbGame')),
  'm4-l3': lazy(() => import('./m4/PrivacyScrubGame')),
  'm4-l4': lazy(() => import('./m4/CodeRequestPushGame')),
  'm4-l5': lazy(() => import('./m4/PhotoCheckDeskGame')),
  'm4-l6': lazy(() => import('./m4/UncomfortableDodgeGame')),
  'm4-l7': lazy(() => import('./m4/RespectHandoverGame')),
  'm4-l8': lazy(() => import('./m4/StopTimingGame')),
  'm4-l9': lazy(() => import('./m4/ChatMazeGame')),
  'm4-l10': lazy(() => import('./m4/AdFenceGame')),
  'm5-l1': lazy(() => import('./m5/ProblemRigBuildGame')),
  'm5-l2': lazy(() => import('./m5/TaskSplitFactoryGame')),
  'm5-l3': lazy(() => import('./m5/BoothStackBuildGame')),
  'm5-l4': lazy(() => import('./m5/PriorityDispatchGame')),
  'm5-l5': lazy(() => import('./m5/KnotUntieGame')),
  'm5-l6': lazy(() => import('./m5/ClueMergeGame')),
  'm5-l7': lazy(() => import('./m5/StepFlipGame')),
  'm5-l8': lazy(() => import('./m5/ResultCheckDiffGame')),
  'm5-l9': lazy(() => import('./m5/PlanRaceSimGame')),
  'm5-l10': lazy(() => import('./m5/LeakFixPipeGame')),
  'm5-l11': lazy(() => import('./m5/PlanChangeRunGame')),
  'm6-l1': lazy(() => import('./m6/ShoppingStockGame')),
  'm6-l2': lazy(() => import('./m6/CoinMergeGame')),
  'm6-l3': lazy(() => import('./m6/MapSignMazeGame')),
  'm6-l4': lazy(() => import('./m6/BusBoardTimingGame')),
  'm6-l5': lazy(() => import('./m6/WeatherCardGame')),
  'm6-l6': lazy(() => import('./m6/SafeCookingGame')),
  'm6-l7': lazy(() => import('./m6/DayGardenGame')),
  'm6-l8': lazy(() => import('./m6/SymptomClinicGame')),
  'm6-l9': lazy(() => import('./m6/ExpressionDeskGame')),
  'm6-l10': lazy(() => import('./m6/JobDayRigGame')),
  'm6-l11': lazy(() => import('./m6/TwoViewIntroGame')),
};

/**
 * 미니게임을 학습 역할별로 구분한다. 같은 등록부를 쓰더라도 교사 도구와
 * 품질 점검에서는 미니게임·AAC 표현 연습·판단 활동을 서로 다른 기준으로 본다.
 */
export type MiniGameCategory = 'minigame' | 'aac-practice' | 'judgment';

const AAC_PRACTICE_IDS = new Set([
  'm1-l3', 'm1-l5', 'm2-l5', 'm2-l6', 'm3-l4', 'm4-l7', 'm5-l6', 'm6-l8', 'm6-l9',
]);
const JUDGMENT_IDS = new Set([
  'm1-l8', 'm1-l10', 'm2-l4', 'm2-l9', 'm4-l3', 'm4-l4', 'm4-l10', 'm5-l4', 'm5-l9', 'm6-l6', 'm6-l11',
]);

export function getMiniGameCategory(lessonId: LessonId | undefined): MiniGameCategory | null {
  if (!lessonId || !hasMiniGame(lessonId)) return null;
  if (AAC_PRACTICE_IDS.has(lessonId)) return 'aac-practice';
  if (JUDGMENT_IDS.has(lessonId)) return 'judgment';
  return 'minigame';
}

/** 해당 차시에 등록된 미니게임. 없으면 null. */
export function getMiniGame(lessonId: LessonId | undefined) {
  if (!lessonId) return null;
  return MINI_GAME_REGISTRY[lessonId] ?? null;
}

export function hasMiniGame(lessonId: LessonId | undefined): boolean {
  return getMiniGame(lessonId) !== null;
}
