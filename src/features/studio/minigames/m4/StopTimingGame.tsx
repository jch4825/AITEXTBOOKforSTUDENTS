import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m4-l8 · 멈춤 타이밍 (장르 30 · 타이밍 액션)
 *
 * "멈출 시간을 정한다"를 말이 아니라 손으로 겪게 만든다. 시계 위의 초록 칸이 내가 정한
 * 멈춤 시간이고, 바늘이 그 칸에 있을 때 눌러야 멈춘다. 지나쳐서 누르면 기회가 준다.
 *
 * 회차가 갈수록 바늘은 빨라지고 초록 칸은 좁아진다. "조금만 더" 하고 싶어지는 마음을
 * 문장으로 설명하지 않고 속도로 겪게 하려는 것이다. 화면 아래 사용 시간 막대는 바늘이
 * 도는 동안에만 차오르고 멈추는 순간 함께 멈춘다 — 멈추는 일이 곧 시간을 아끼는 일이라는
 * 것이 막대의 움직임만으로 보인다.
 *
 * 성공 한 번에 다음 행동 카드가 한 장 열린다. 멈춘 다음에 무엇을 할지가 함께 정해져야
 * 계획이 되기 때문이다. 다섯 장을 채우면 나만의 멈춤 계획이 완성된다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const TAU = Math.PI * 2;

/** 한 판의 목표 수. 감각 조율 기준(한 판 3~6개)의 가운데 값이다. */
const ROUNDS = 5;

/** 시계 자리. 왼쪽은 시계, 오른쪽은 계획 카드로 나눠 읽을 곳을 섞지 않는다. */
const CX = 262;
const CY = 262;
const CR = 118;
const RING = 26;

interface RoundPlan {
  /** 이 회차의 멈춤 신호. 판 위쪽 띠 한 곳에만 크게 적는다. */
  signal: string;
  emoji: string;
  action: string;
}

interface StageConfig {
  id: string;
  label: string;
  title: string;
  spoken: string;
  /** 첫 회차 바늘 속도(라디안/초). 한 바퀴에 최소 2.5초가 걸리도록 낮게 잡았다. */
  baseSpeed: number;
  speedStep: number;
  /** 첫 회차 초록 칸의 폭(라디안) */
  baseArc: number;
  arcStep: number;
  rounds: RoundPlan[];
}

const STAGES: StageConfig[] = [
  {
    id: 'video',
    label: '기본',
    title: '영상 보기',
    spoken: '영상 보기 기록으로 바꿨어요.',
    baseSpeed: 1.28,
    speedStep: 0.17,
    baseArc: 1.32,
    arcStep: 0.16,
    rounds: [
      { signal: '눈이 뻑뻑해졌어요', emoji: '💧', action: '물 마시기' },
      { signal: '어깨가 뻐근해졌어요', emoji: '🙆', action: '몸 펴기' },
      { signal: '밥 먹을 시간이 됐어요', emoji: '🍚', action: '밥 먹으러 가기' },
      { signal: '창밖이 어두워졌어요', emoji: '🚶', action: '밖에 나가기' },
      { signal: '다음 영상이 또 떴어요', emoji: '🧩', action: '다른 놀이 하기' },
    ],
  },
  {
    id: 'game',
    label: '1단계',
    title: '게임 하기',
    spoken: '게임 하기 기록으로 바꿨어요.',
    baseSpeed: 1.44,
    speedStep: 0.18,
    baseArc: 1.12,
    arcStep: 0.15,
    rounds: [
      { signal: '정한 시간이 다 됐어요', emoji: '⏰', action: '시계 확인하기' },
      { signal: '손목이 아파졌어요', emoji: '💧', action: '물 마시기' },
      { signal: '숙제가 그대로 남았어요', emoji: '📒', action: '숙제 먼저 하기' },
      { signal: '한 판만 더 하고 싶어졌어요', emoji: '🚶', action: '밖에 나가기' },
      { signal: '잘 시간이 가까워졌어요', emoji: '🛏️', action: '잠자리 준비하기' },
    ],
  },
  {
    id: 'shorts',
    label: '2단계',
    title: '짧은 영상 넘기기',
    spoken: '짧은 영상 넘기기 기록으로 바꿨어요.',
    baseSpeed: 1.58,
    speedStep: 0.19,
    baseArc: 0.95,
    arcStep: 0.13,
    rounds: [
      { signal: '같은 영상이 계속 나와요', emoji: '🧩', action: '다른 놀이 하기' },
      { signal: '머리가 아파졌어요', emoji: '💧', action: '물 마시기' },
      { signal: '친구가 저를 부르고 있어요', emoji: '💬', action: '친구와 이야기하기' },
      { signal: '손가락이 저려요', emoji: '🙆', action: '몸 펴기' },
      { signal: '약속 시간이 다가와요', emoji: '🚶', action: '밖에 나가기' },
    ],
  },
];

interface World {
  /** ready면 바늘이 멈춰 있고 학생이 누를 때까지 기다린다. */
  phase: 'ready' | 'spinning';
  angle: number;
  speed: number;
  zoneStart: number;
  zoneWidth: number;
  cleared: number;
  /** 빗나간 횟수. 초록 칸 자리를 새로 뽑는 씨앗에 섞어 같은 자리가 반복되지 않게 한다. */
  attempts: number;
  lives: number;
  usage: number;
  finished: boolean;
  /** 손을 떼었다가 다시 눌러야 다음 조작이 된다. 누른 채로는 시작과 멈춤이 한 번에 일어난다. */
  armed: boolean;
  flashGood: number;
  flashBad: number;
}

/**
 * 이번 회차의 속도와 초록 칸을 정한다.
 *
 * 칸 폭을 각도로만 정하면 빨라진 회차에서 사람이 반응할 수 없는 창이 된다. 그래서
 * "칸을 지나가는 데 걸리는 시간"의 하한을 두고, 그 하한도 지원 수준(tolerance)에 따라
 * 함께 움직이게 했다. 그래야 좁아지는 모습은 눈에 보이면서도 누를 수 있는 판이 된다.
 */
function setupRound(
  world: World,
  stage: StageConfig,
  speedScale: number,
  arcScale: number,
  seed: number,
): void {
  const index = Math.min(world.cleared, ROUNDS - 1);
  const random = createRandom(seed + index * 1013 + world.attempts * 37);
  const speed = (stage.baseSpeed + index * stage.speedStep) * speedScale;
  const minWidth = 0.28 * arcScale * speed;
  const wanted = (stage.baseArc - index * stage.arcStep) * arcScale;
  const width = clamp(Math.max(wanted, minWidth), 0.18, 2.1);
  // 초록 칸은 늘 바늘의 앞쪽에 놓는다. 멈춘 자리에 그대로 다시 뜨면 누를 일이 없어진다.
  const room = Math.max(0.4, TAU - 1.6 - width);
  world.speed = speed;
  world.zoneWidth = width;
  world.zoneStart = (world.angle + 0.8 + random() * room) % TAU;
}

function buildWorld(
  stage: StageConfig,
  speedScale: number,
  arcScale: number,
  lives: number,
  seed: number,
): World {
  const world: World = {
    phase: 'ready',
    angle: 0,
    speed: stage.baseSpeed * speedScale,
    zoneStart: 1.4,
    zoneWidth: 1,
    cleared: 0,
    attempts: 0,
    lives,
    usage: 0,
    finished: false,
    armed: false,
    flashGood: 0,
    flashBad: 0,
  };
  setupRound(world, stage, speedScale, arcScale, seed);
  return world;
}

export default function StopTimingGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;
  /** 사용 시간 막대의 길이(초). 바늘이 도는 동안에만 줄어드는 진짜 자원이다. */
  const usageMax = 26 * tuning.time;

  const worldRef = useRef<World>(
    buildWorld(stage, tuning.speed, tuning.tolerance, tuning.lives, game.seed),
  );
  const [hud, setHud] = useState({ cleared: 0, lives: tuning.lives });
  const keys = useGameKeys(game.playing);
  const pressRef = useRef(false);

  useEffect(() => {
    worldRef.current = buildWorld(stage, tuning.speed, tuning.tolerance, tuning.lives, game.seed);
    setHud({ cleared: 0, lives: tuning.lives });
    pressRef.current = false;
  }, [game.round, game.stageIndex, stage, tuning, game.seed]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    const held = pressRef.current || keys.held.current.action || keys.held.current.up;

    // 누름의 시작 순간만 조작으로 센다. 마우스와 키보드가 같은 규칙을 쓴다.
    let pressEdge = false;
    if (!held) {
      world.armed = true;
    } else if (world.armed) {
      world.armed = false;
      pressEdge = true;
    }

    if (dt > 0 && !world.finished) {
      world.flashGood = Math.max(0, world.flashGood - dt * 1.5);
      world.flashBad = Math.max(0, world.flashBad - dt * 1.5);

      if (world.phase === 'ready') {
        if (pressEdge) {
          world.phase = 'spinning';
          playSound('select');
        }
      } else {
        world.angle = (world.angle + world.speed * dt) % TAU;
        world.usage += dt;

        if (pressEdge) {
          playSound('select');
          const offset = ((world.angle - world.zoneStart) % TAU + TAU) % TAU;
          if (offset <= world.zoneWidth) {
            world.cleared += 1;
            world.flashGood = 1;
            world.phase = 'ready';
            if (world.cleared >= ROUNDS) {
              world.finished = true;
              game.succeed('멈출 시간을 다섯 번 지켰어요. 다음 행동까지 정해 나만의 멈춤 계획이 완성됐습니다!');
            } else {
              setupRound(world, stage, tuning.speed, tuning.tolerance, game.seed);
            }
          } else {
            world.lives -= 1;
            world.flashBad = 1;
            world.phase = 'ready';
            world.attempts += 1;
            if (world.lives <= 0) {
              world.finished = true;
              game.fail('초록 칸을 지나쳐 기회를 다 썼어요. 바늘이 초록 칸에 들어오는 순간을 보고 눌러 보세요.');
            } else {
              setupRound(world, stage, tuning.speed, tuning.tolerance, game.seed);
            }
          }
        } else if (world.usage >= usageMax) {
          world.finished = true;
          world.usage = usageMax;
          game.fail('사용 시간이 끝까지 찼어요. 다음에는 초록 칸이 오면 조금 더 일찍 멈춰 보세요.');
        }
      }

      if (world.cleared !== hud.cleared || world.lives !== hud.lives) {
        setHud({ cleared: world.cleared, lives: world.lives });
      }
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    const plan = stage.rounds[Math.min(world.cleared, ROUNDS - 1)];
    const bandDone = world.cleared >= ROUNDS;
    panel(ctx, 30, 10, 900, 58, BOARD.overlay, bandDone ? PLAY.goal : PLAY.info, 14);
    centerText(
      ctx,
      bandDone ? '멈춤 계획을 다 정했어요' : `멈춤 신호 · ${plan.signal}`,
      480, 39, 28, BOARD.ink,
    );

    // 빗나간 순간에는 시계가 흔들린다. 글보다 먼저 보이는 신호를 준다.
    const shake = world.flashBad > 0 ? Math.sin(world.flashBad * 38) * 7 : 0;
    const cx = CX + shake;

    ctx.fillStyle = BOARD.surface;
    ctx.beginPath();
    ctx.arc(cx, CY, CR, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = BOARD.line;
    ctx.lineWidth = 3;
    ctx.stroke();

    const ringR = CR - RING / 2 - 4;
    ctx.lineWidth = RING;
    ctx.strokeStyle = BOARD.overlay;
    ctx.beginPath();
    ctx.arc(cx, CY, ringR, 0, TAU);
    ctx.stroke();

    // 내가 정한 멈춤 시간 — 이 칸 안에서 눌러야 멈춘다.
    ctx.strokeStyle = PLAY.goal;
    ctx.beginPath();
    ctx.arc(cx, CY, ringR, world.zoneStart - Math.PI / 2, world.zoneStart + world.zoneWidth - Math.PI / 2);
    ctx.stroke();
    ctx.lineWidth = 3;

    for (let tick = 0; tick < 12; tick += 1) {
      const a = (tick / 12) * TAU - Math.PI / 2;
      ctx.strokeStyle = BOARD.line;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 82, CY + Math.sin(a) * 82);
      ctx.lineTo(cx + Math.cos(a) * 72, CY + Math.sin(a) * 72);
      ctx.stroke();
    }

    if (world.flashGood > 0 || world.flashBad > 0) {
      ctx.strokeStyle = world.flashGood > 0 ? PLAY.goal : PLAY.hazard;
      ctx.lineWidth = 4 + Math.max(world.flashGood, world.flashBad) * 9;
      ctx.beginPath();
      ctx.arc(cx, CY, CR + 12, 0, TAU);
      ctx.stroke();
    }

    const na = world.angle - Math.PI / 2;
    const tipX = cx + Math.cos(na) * (CR - RING - 14);
    const tipY = CY + Math.sin(na) * (CR - RING - 14);
    ctx.strokeStyle = PLAY.hero;
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(na) * 20, CY - Math.sin(na) * 20);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.fillStyle = PLAY.hero;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 11, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = BOARD.overlay;
    ctx.beginPath();
    ctx.arc(cx, CY, 15, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.stroke();
    centerText(ctx, `${Math.min(world.cleared + 1, ROUNDS)} / ${ROUNDS}`, cx, CY + 56, 24, BOARD.inkDim);

    // 지금 무엇을 하면 되는지 한 줄. 시계 안이 아니라 아래 한 곳에만 둔다.
    let guide = '초록 칸에서 멈추세요';
    if (world.finished) guide = bandDone ? '계획을 다 채웠어요' : '다시 하기를 눌러 주세요';
    else if (world.phase === 'ready') {
      if (!world.armed) guide = '손을 떼었다가 다시 누르세요';
      else guide = world.cleared > 0 || world.attempts > 0 ? '누르면 다시 돕니다' : '누르면 시계가 돕니다';
    }
    panel(ctx, 70, 400, 384, 52, BOARD.overlay, world.phase === 'ready' ? PLAY.hero : PLAY.goal, 14);
    centerText(ctx, guide, 262, 426, 24, BOARD.ink);

    // 나의 멈춤 계획 — 성공할 때마다 한 장씩 열린다.
    centerText(ctx, '나의 멈춤 계획', 710, 82, 26, BOARD.inkDim);
    for (let i = 0; i < ROUNDS; i += 1) {
      const y = 96 + i * 62;
      const open = i < world.cleared;
      const fresh = open && i === world.cleared - 1 && world.flashGood > 0;
      panel(
        ctx, 500, y, 420, 52,
        open ? BOARD.surface : BOARD.overlay,
        fresh ? PLAY.goal : open ? PLAY.goalEdge : BOARD.line,
        12,
      );
      if (open) {
        centerText(ctx, stage.rounds[i].emoji, 534, y + 26, 30, BOARD.ink);
        centerText(ctx, stage.rounds[i].action, 740, y + 26, 26, BOARD.ink);
      } else {
        centerText(ctx, '?', 740, y + 26, 26, BOARD.inkDim);
      }
    }

    // 오늘 사용 시간 — 바늘이 도는 동안에만 차오르고, 멈추면 함께 멈춘다.
    const ratio = clamp(world.usage / usageMax, 0, 1);
    panel(ctx, 30, 462, 900, 42, BOARD.overlay, BOARD.line, 12);
    ctx.fillStyle = ratio > 0.75 ? PLAY.hazard : PLAY.info;
    ctx.fillRect(34, 466, Math.max(0, 892 * ratio), 34);
    centerText(ctx, '오늘 사용 시간', 140, 483, 24, BOARD.ink);
  };

  return (
    <MiniGameFrame
      badge="멈춤 타이밍"
      instruction="시계 바늘이 돌아갈 때 잘 살펴보다가, 초록색 칸에 들어왔을 때 화면이나 스페이스 키를 눌러 멈추어 보세요."
      progress={{ label: '정한 다음 행동', value: hud.cleared, max: ROUNDS }}
      hud={<GameHud lives={hud.lives} maxLives={tuning.lives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') pressRef.current = true;
              if (pointer.phase === 'up') pressRef.current = false;
            }}
            ariaLabel={`${stage.title} 기록을 보고 멈출 시간을 정하는 놀이. 남은 기회 ${hud.lives}개, 정한 다음 행동 ${hud.cleared}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
