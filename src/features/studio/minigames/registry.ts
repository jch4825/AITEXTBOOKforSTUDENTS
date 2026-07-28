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
 *  5) 실패해도 벌칙 없이 즉시 다시 할 수 있다
 */
export const MINI_GAME_REGISTRY: Record<string, ReturnType<typeof lazy>> = {
  'm1-l1': lazy(() => import('./m1/AimiScanLensGame')),
  'm1-l2': lazy(() => import('./m1/RobotVacuumPathGame')),
  'm1-l3': lazy(() => import('./m1/NextWordRunnerGame')),
  'm1-l4': lazy(() => import('./m1/RecognitionTimingGame')),
  'm1-l5': lazy(() => import('./m1/SttAudioCleanerGame')),
  'm1-l6': lazy(() => import('./m1/TrainingMixerGame')),
  'm1-l7': lazy(() => import('./m1/ConveyorQualityGame')),
  'm1-l8': lazy(() => import('./m1/HumanHandoffStampGame')),
  'm1-l9': lazy(() => import('./m1/ToolWarmupSchedulingGame')),
  'm1-l10': lazy(() => import('./m1/ResultCheckBudgetGame')),
  'm2-l1': lazy(() => import('./m2/RequestSlotGame')),
  'm2-l2': lazy(() => import('./m2/OneAtATimeStackGame')),
  'm2-l3': lazy(() => import('./m2/TargetRangeGame')),
  'm2-l4': lazy(() => import('./m2/ExamplePaletteGame')),
  'm2-l5': lazy(() => import('./m2/AudienceToneGame')),
  'm2-l7': lazy(() => import('./m2/SculptRefineGame')),
  'm2-l6': lazy(() => import('./m2/RelayRequestGame')),
  'm2-l8': lazy(() => import('./m2/ShapeMoldPourGame')),
  'm2-l9': lazy(() => import('./m2/EvidenceScaleGame')),
  'm2-l10': lazy(() => import('./m2/ConversationBudgetGame')),
  'm3-l1': lazy(() => import('./m3/QuestionDrillGame')),
  'm3-l2': lazy(() => import('./m3/FogWordRevealGame')),
  'm3-l3': lazy(() => import('./m3/ExplanationPressGame')),
  'm3-l4': lazy(() => import('./m3/WordIntensityDialGame')),
  'm3-l5': lazy(() => import('./m3/StoryPathGame')),
  'm3-l6': lazy(() => import('./m3/CalculatorBalanceGame')),
  'm3-l7': lazy(() => import('./m3/WinnowingSummaryGame')),
  'm3-l8': lazy(() => import('./m3/ThinkThenRevealGame')),
  'm3-l9': lazy(() => import('./m3/FactAnchorGame')),
  'm3-l10': lazy(() => import('./m3/RecallPassGame')),
  'm4-l1': lazy(() => import('./m4/EvidenceTowerGame')),
  'm4-l2': lazy(() => import('./m4/SourceLighthouseGame')),
  'm4-l3': lazy(() => import('./m4/PrivacyStickerGame')),
  'm4-l4': lazy(() => import('./m4/SecureRoutingGateGame')),
  'm4-l5': lazy(() => import('./m4/PhotoMagnifierGame')),
  'm4-l6': lazy(() => import('./m4/SafetyCoverReactionGame')),
  'm4-l7': lazy(() => import('./m4/RequestSandingGame')),
  'm4-l8': lazy(() => import('./m4/BreakClockGame')),
  'm4-l9': lazy(() => import('./m4/HelpRopeGame')),
  'm4-l10': lazy(() => import('./m4/AdFlashlightGame')),
  'm5-l1': lazy(() => import('./m5/ProblemGapBridgeGame')),
  'm5-l2': lazy(() => import('./m5/TaskCrateBreakGame')),
  'm5-l3': lazy(() => import('./m5/DependencyBuildGame')),
  'm5-l4': lazy(() => import('./m5/FirePriorityGame')),
  'm5-l5': lazy(() => import('./m5/HelpLadderGame')),
  'm5-l6': lazy(() => import('./m5/SignalTuneGame')),
  'm5-l7': lazy(() => import('./m5/SteppingStoneGame')),
  'm5-l8': lazy(() => import('./m5/SilhouetteMatchGame')),
  'm5-l9': lazy(() => import('./m5/AlternativeRaceGame')),
  'm5-l10': lazy(() => import('./m5/LeakRetestGame')),
  'm5-l11': lazy(() => import('./m5/DetourPlanGame')),
  'm6-l1': lazy(() => import('./m6/ShoppingConditionCartGame')),
  'm6-l2': lazy(() => import('./m6/CheckoutRegisterGame')),
  'm6-l3': lazy(() => import('./m6/MapSignRouteGame')),
  'm6-l4': lazy(() => import('./m6/BusDirectionGame')),
  'm6-l5': lazy(() => import('./m6/WeatherOutfitGame')),
  'm6-l6': lazy(() => import('./m6/LunchboxSafetyGame')),
  'm6-l7': lazy(() => import('./m6/DayBlockPlannerGame')),
  'm6-l8': lazy(() => import('./m6/SymptomMessengerGame')),
  'm6-l9': lazy(() => import('./m6/ExpressionSwitchboardGame')),
  'm6-l10': lazy(() => import('./m6/JobDayAllocationGame')),
  'm6-l11': lazy(() => import('./m6/AudienceCurtainGame')),
};

/** 해당 차시에 등록된 미니게임. 없으면 null. */
export function getMiniGame(lessonId: LessonId | undefined) {
  if (!lessonId) return null;
  return MINI_GAME_REGISTRY[lessonId] ?? null;
}

export function hasMiniGame(lessonId: LessonId | undefined): boolean {
  return getMiniGame(lessonId) !== null;
}
