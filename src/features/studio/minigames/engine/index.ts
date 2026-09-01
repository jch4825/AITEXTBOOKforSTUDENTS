/**
 * 미니게임 엔진 배럴.
 *
 * 게임 파일은 여기 하나만 가져오면 된다. 62개가 제각각 깊은 경로를 적으면
 * 폴더를 옮길 때 전부 손봐야 하고, 무엇이 공용이고 무엇이 그 게임만의 것인지도 흐려진다.
 */
export { default as GameCanvas } from './GameCanvas';
export type { CanvasPointer } from './GameCanvas';
export { default as GameStage } from './GameStage';
export type { StagePointer } from './GameStage';
export { default as GameHud } from './GameHud';
export { useGameLoop, useReducedMotion, useCountdown } from './useGameLoop';
export { useGameKeys } from './useGameKeys';
export type { GameKey, GameKeyState } from './useGameKeys';
export { BOARD, PLAY, fillRoundRect, roundRectPath, panel, centerText } from './palette';
export { useGameImages, drawCover, drawContain } from './useGameImages';
export type { GameImages, GameArt } from './useGameImages';
export { tuningFor } from './difficulty';
export type { GameTuning } from './difficulty';
export {
  clamp, lerp, approach, dist, circleHit, rectHit, pointInRect, circleRectHit,
  createRandom, randRange, randInt, pick, shuffle, toRadians,
} from './gameMath';
export type { Rect } from './gameMath';
