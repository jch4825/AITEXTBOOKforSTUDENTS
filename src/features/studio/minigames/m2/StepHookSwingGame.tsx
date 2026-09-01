import React, { useEffect, useMemo, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, dist, panel, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l6 · 단계 갈고리 타기 (장르 9 · 와이어 갈고리)
 *
 * "큰 부탁을 작은 단계로 나눈다"를 몸으로 겪게 만든다. 한 번에 도착대까지 날아가는
 * 길은 없다. 공중에 뜬 단계 갈고리를 하나씩 걸어 타야만 오른쪽 끝에 닿는다.
 *
 * 규칙의 모양이 학습목표의 모양과 같다. 줄은 **다음 순서의 갈고리에만** 걸린다.
 * 3번을 건너뛰고 4번에 걸려고 하면 줄이 허공을 스치고 지나가 그대로 떨어진다.
 * 앞 단계에서 받은 답이 있어야 다음 부탁을 할 수 있다는 규칙 그대로다.
 *
 * 조작은 하나뿐이다 — 누르고 있으면 걸려서 진자처럼 돌고, 놓으면 그 순간의 속도로
 * 날아간다. 어느 각도에서 놓느냐가 다음 거리를 정한다. 이 손맛이 이 게임의 전부라
 * 줄과 도는 궤적을 반드시 눈에 보이게 그린다.
 */

const VIEW_W = 960;
const VIEW_H = 540;
/** 발판 윗면과 바닥 띠. 갈고리에 가장 길게 매달려도 바닥에 닿지 않도록 잡은 값이다. */
const PAD_TOP = 424;
const GROUND_TOP = 486;
const HERO_R = 22;
const ROPE_MIN = 70;
const ROPE_MAX = 170;
const START_PAD_W = 190;
const GOAL_PAD_W = 340;

interface StageConfig {
  id: string;
  label: string;
  title: string;
  /** 갈고리 여섯 개분의 단계 이름. 지원 수준에 따라 앞쪽을 잘라 쓰되 마지막은 늘 남긴다. */
  steps: string[];
  /** 갈고리 사이 기본 거리와 높낮이 차. 단계가 올라갈수록 둘 다 커진다. */
  gap: number;
  rise: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'snack',
    label: '기본',
    title: '간식 만들기 부탁',
    steps: [
      '무엇을 만들지 정하기', '재료 목록 받기', '순서 만들기',
      '확인 목록 받기', '고칠 곳 찾기', '마무리 문장 받기',
    ],
    gap: 250,
    rise: 30,
  },
  {
    id: 'news',
    label: '1단계',
    title: '학급 신문 만들기 부탁',
    steps: [
      '무엇을 알릴지 정하기', '물어볼 말 받기', '취재 순서 만들기',
      '사진 자리 정하기', '빠진 곳 찾기', '제목 문장 받기',
    ],
    gap: 275,
    rise: 55,
  },
  {
    id: 'trip',
    label: '2단계',
    title: '소풍 계획 세우기 부탁',
    steps: [
      '어디로 갈지 정하기', '준비물 목록 받기', '하루 순서 만들기',
      '시간 나누어 적기', '빠뜨린 것 찾기', '안내 문장 받기',
    ],
    gap: 300,
    rise: 80,
  },
];

interface Anchor {
  x: number;
  y: number;
  name: string;
}

interface Layout {
  anchors: Anchor[];
  goalX: number;
  worldW: number;
}

/**
 * 갈고리 수를 줄일 때 앞쪽만 잘라 낸다. 마지막 단계는 "받은 답으로 마무리하기"라
 * 어느 지원 수준에서도 이야기가 끝나야 하기 때문이다.
 */
function pickSteps(all: string[], count: number): string[] {
  if (count >= all.length) return all.slice();
  return [...all.slice(0, count - 1), all[all.length - 1]];
}

function buildLayout(stage: StageConfig, gap: number, count: number): Layout {
  const names = pickSteps(stage.steps, count);
  const anchors = names.map((name, index) => ({
    x: 300 + index * gap,
    // 높낮이는 사인 곡선으로 오르내리게 한다. 규칙 없이 흩으면 어느 쪽으로 날지 읽을 수 없다.
    y: clamp(250 - Math.sin(index * 0.95) * stage.rise, 150, 270),
    name,
  }));
  const goalX = anchors[anchors.length - 1].x + gap * 0.85;
  return { anchors, goalX, worldW: goalX + GOAL_PAD_W };
}

interface World {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** ready는 첫 조작을 기다리는 멈춘 상태다. 누르기 전에는 아무것도 움직이지 않는다. */
  phase: 'ready' | 'swing' | 'flight';
  /** 지금 매달린 갈고리. -1이면 출발대 위다. */
  anchorIndex: number;
  ropeLen: number;
  angle: number;
  omega: number;
  /** 걸어 탄 단계 수. 곧 다음에 걸 수 있는 갈고리 번호이기도 하다. */
  cleared: number;
  lives: number;
  armed: boolean;
  finished: boolean;
  bob: number;
  flash: number;
  miss: number;
}

function makeWorld(lives: number): World {
  return {
    x: 120, y: PAD_TOP - HERO_R, vx: 0, vy: 0,
    phase: 'ready', anchorIndex: -1, ropeLen: 140, angle: -0.55, omega: 0,
    cleared: 0, lives, armed: false, finished: false, bob: 0, flash: 0, miss: 0,
  };
}

/** 줄에 매달린 자리를 각도에서 되돌린다. 각도가 진짜 상태고 좌표는 그 그림자다. */
function hangHero(world: World, anchor: Anchor): void {
  world.x = anchor.x + Math.sin(world.angle) * world.ropeLen;
  world.y = anchor.y + Math.cos(world.angle) * world.ropeLen;
}

export default function StepHookSwingGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /**
   * 느린 화면을 만드는 방식. 속도만 줄이면 궤적이 가팔라져 다른 게임이 되어 버린다.
   * 속도는 배율대로, 중력은 배율의 제곱으로 줄여 같은 모양의 포물선을 더 오래 보여 준다.
   */
  const ts = tuning.speed;
  const gravity = 430 * ts * ts;
  const maxTangential = 400 * ts;
  const pump = 1.15 * ts * ts;
  const hopVx = 235 * ts;
  const hopVy = -250 * ts;
  const grabRadius = 170 * tuning.size;
  const anchorCount = clamp(Math.round(5 * tuning.density), 4, 6);
  // 걸림 반경이 좁아지는 수준일수록 갈고리도 멀어진다. 두 어려움이 같은 방향을 본다.
  const gap = clamp(stage.gap / Math.max(0.85, tuning.size), 170, 320);

  const layout = useMemo(
    () => buildLayout(stage, gap, anchorCount),
    [stage, gap, anchorCount],
  );

  const worldRef = useRef<World>(makeWorld(tuning.lives));
  const [hud, setHud] = useState({ cleared: 0, lives: tuning.lives });
  const keys = useGameKeys(game.playing);
  const pressRef = useRef(false);

  useEffect(() => {
    worldRef.current = makeWorld(tuning.lives);
    setHud({ cleared: 0, lives: tuning.lives });
    pressRef.current = false;
  }, [game.round, game.stageIndex, layout, tuning.lives]);

  /** 떨어졌을 때. 기회를 하나 쓰고 마지막으로 걸었던 갈고리에 다시 매달려 기다린다. */
  const respawn = (world: World) => {
    world.lives -= 1;
    world.phase = 'ready';
    world.armed = false;
    world.omega = 0;
    world.vx = 0;
    world.vy = 0;
    world.bob = 0;
    world.miss = 1.4;
    if (world.cleared > 0) {
      world.anchorIndex = world.cleared - 1;
      world.ropeLen = 140;
      world.angle = -0.55;
      hangHero(world, layout.anchors[world.anchorIndex]);
    } else {
      world.anchorIndex = -1;
      world.x = 120;
      world.y = PAD_TOP - HERO_R;
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    const anchors = layout.anchors;
    const held = pressRef.current || keys.held.current.action || keys.held.current.up;

    if (dt > 0 && !world.finished) {
      // 손을 뗐다가 다시 눌러야 다음 조작이 먹는다. 누른 채로 떨어지면 계속 떨어지기 때문이다.
      if (!held) world.armed = true;
      world.flash = Math.max(0, world.flash - dt);
      world.miss = Math.max(0, world.miss - dt);

      if (world.phase === 'ready') {
        world.bob += dt * 2.2;
        if (world.anchorIndex >= 0) {
          world.angle = -0.55 + Math.sin(world.bob) * 0.05;
          hangHero(world, anchors[world.anchorIndex]);
          if (held && world.armed) {
            world.phase = 'swing';
            world.omega = 0;
            world.armed = false;
          }
        } else {
          world.y = PAD_TOP - HERO_R + Math.sin(world.bob) * 3;
          if (held && world.armed) {
            world.phase = 'flight';
            world.vx = hopVx;
            world.vy = hopVy;
            world.armed = false;
          }
        }
      } else if (world.phase === 'swing') {
        const anchor = anchors[world.anchorIndex];
        world.omega += -(gravity / world.ropeLen) * Math.sin(world.angle) * dt;
        // 매달린 채 계속 누르고 있으면 조금씩 크게 돈다. 그네를 구르는 것과 같은 감각이고,
        // 이 힘이 있어야 위쪽 갈고리로도 올라갈 수 있다. 최고 속도는 막아 둔다.
        if (Math.abs(world.ropeLen * world.omega) < maxTangential) {
          world.omega += (world.omega >= 0 ? 1 : -1) * pump * dt;
        }
        world.angle += world.omega * dt;
        hangHero(world, anchor);
        world.vx = world.ropeLen * world.omega * Math.cos(world.angle);
        world.vy = -world.ropeLen * world.omega * Math.sin(world.angle);
        if (!held) {
          world.phase = 'flight';
          playSound('select');
        }
      } else {
        world.vy += gravity * dt;
        world.x += world.vx * dt;
        world.y += world.vy * dt;
        if (world.x < 24) {
          world.x = 24;
          world.vx = 0;
        }
        world.x = Math.min(world.x, layout.worldW - 24);

        // 다음 순서의 갈고리에만 줄이 걸린다. 나머지는 그냥 지나간다.
        const next = anchors[world.cleared];
        if (held && world.armed && next && world.y > next.y + 26) {
          const away = dist(world.x, world.y, next.x, next.y);
          if (away <= grabRadius) {
            const length = clamp(away, ROPE_MIN, ROPE_MAX);
            const angle = Math.atan2(world.x - next.x, world.y - next.y);
            world.ropeLen = length;
            world.angle = angle;
            world.omega = (world.vx * Math.cos(angle) - world.vy * Math.sin(angle)) / length;
            world.anchorIndex = world.cleared;
            world.cleared += 1;
            world.phase = 'swing';
            world.armed = false;
            world.flash = 0.6;
            hangHero(world, next);
            playSound('confirm');
          }
        }

        if (world.phase === 'flight') {
          const landing = world.y >= PAD_TOP - HERO_R && world.vy > 0;
          if (landing && world.x >= layout.goalX) {
            world.y = PAD_TOP - HERO_R;
            world.vx = 0;
            world.vy = 0;
            if (world.cleared >= anchors.length) {
              world.finished = true;
              game.succeed('단계를 하나씩 이어 타고 도착대까지 닿았어요!');
            } else {
              respawn(world);
            }
          } else if (landing && world.cleared === 0 && world.x <= 20 + START_PAD_W) {
            // 출발대 위로 되돌아온 것뿐이라 기회는 쓰지 않는다.
            world.phase = 'ready';
            world.anchorIndex = -1;
            world.y = PAD_TOP - HERO_R;
            world.vx = 0;
            world.vy = 0;
            world.armed = false;
          } else if (world.y > GROUND_TOP - HERO_R) {
            respawn(world);
          }
        }
      }

      if (world.cleared !== hud.cleared || world.lives !== hud.lives) {
        setHud({ cleared: world.cleared, lives: world.lives });
      }
      if (!world.finished && world.lives <= 0) {
        world.finished = true;
        game.fail('줄을 걸지 못하고 떨어졌어요. 빛나는 다음 단계 갈고리 가까이에서 눌러 줄을 거세요.');
      }
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    const camX = clamp(world.x - 320, 0, Math.max(0, layout.worldW - VIEW_W));
    ctx.save();
    ctx.translate(-camX, 0);

    panel(ctx, -60, GROUND_TOP, layout.worldW + 120, VIEW_H - GROUND_TOP + 40, BOARD.overlay, PLAY.hazard, 0);
    panel(ctx, 20, PAD_TOP, START_PAD_W, GROUND_TOP - PAD_TOP + 24, BOARD.surface, PLAY.info, 12);
    centerText(ctx, '출발', 20 + START_PAD_W / 2, PAD_TOP + 30, 26, BOARD.ink);
    const goalReady = world.cleared >= anchors.length;
    panel(ctx, layout.goalX, PAD_TOP, GOAL_PAD_W, GROUND_TOP - PAD_TOP + 24, BOARD.surface,
      goalReady ? PLAY.goal : BOARD.line, 12);
    centerText(ctx, '🚩 도착', layout.goalX + GOAL_PAD_W / 2, PAD_TOP + 30, 26,
      goalReady ? PLAY.goal : BOARD.inkDim);

    anchors.forEach((anchor, index) => {
      const done = index < world.cleared;
      const isNext = index === world.cleared;
      const tone = done ? PLAY.goal : isNext ? PLAY.hero : BOARD.line;

      // 천장에서 내려온 줄. 갈고리가 허공에 떠 있는 이유를 그림으로 알려 준다.
      ctx.strokeStyle = tone;
      ctx.lineWidth = isNext ? 3 : 2;
      ctx.globalAlpha = isNext ? 0.9 : 0.35;
      ctx.beginPath();
      ctx.moveTo(anchor.x, 0);
      ctx.lineTo(anchor.x, anchor.y);
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (isNext) {
        // 걸 수 있는 범위를 점선 원으로 보여 준다. "언제 눌러야 하나"의 답이 눈에 보인다.
        ctx.strokeStyle = PLAY.hero;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.45 + world.flash * 0.5;
        ctx.setLineDash([12, 14]);
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, grabRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = done ? '#14532D' : BOARD.surface;
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, isNext ? 26 : 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = tone;
      ctx.lineWidth = 4;
      ctx.stroke();
      centerText(ctx, done ? '✓' : String(index + 1), anchor.x, anchor.y + 1, 28, tone);

      // 단계 이름은 지금 걸 갈고리와 방금 지나온 갈고리에만 붙인다. 여섯 개에 다 붙이면
      // 글자가 겹쳐 아무것도 읽히지 않는다.
      if (isNext || index === world.cleared - 1) {
        const plateW = 250;
        panel(ctx, anchor.x - plateW / 2, anchor.y - 88, plateW, 48, BOARD.overlay, tone, 12);
        centerText(ctx, anchor.name, anchor.x, anchor.y - 64, 26, isNext ? BOARD.ink : BOARD.inkDim);
      }
    });

    if (world.phase === 'swing' && world.anchorIndex >= 0) {
      const anchor = anchors[world.anchorIndex];
      ctx.strokeStyle = PLAY.hero;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(anchor.x, anchor.y);
      ctx.lineTo(world.x, world.y);
      ctx.stroke();
    } else if (world.phase === 'flight' && held && !world.finished) {
      // 걸리지 않은 줄. 허공을 스치는 모습이 보여야 "왜 안 걸렸는지"를 알 수 있다.
      ctx.strokeStyle = BOARD.inkDim;
      ctx.lineWidth = 4;
      ctx.setLineDash([9, 11]);
      ctx.beginPath();
      ctx.moveTo(world.x, world.y);
      ctx.lineTo(world.x + 26, world.y - 76);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(world.x + 28, world.y - 82, 9, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = PLAY.hero;
    ctx.beginPath();
    ctx.arc(world.x, world.y, HERO_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.lineWidth = 4;
    ctx.stroke();
    centerText(ctx, '🧗', world.x, world.y + 2, 26, '#3B2100');
    ctx.restore();

    // 읽을 글은 화면에 붙은 위쪽 띠 한 곳에만 크게 둔다.
    panel(ctx, VIEW_W / 2 - 350, 12, 700, 58, BOARD.overlay, goalReady ? PLAY.goal : PLAY.info, 14);
    const nextAnchor = anchors[world.cleared];
    centerText(
      ctx,
      goalReady
        ? '단계를 모두 이었어요 · 오른쪽 도착대에 내려앉으세요'
        : `${world.cleared + 1}번 단계 — ${nextAnchor ? nextAnchor.name : ''}`,
      VIEW_W / 2, 41, 28, BOARD.ink,
    );

    if (world.phase === 'ready' && !world.finished) {
      const onPad = world.anchorIndex < 0;
      panel(ctx, VIEW_W / 2 - 250, VIEW_H - 96, 500, 62, BOARD.overlay, PLAY.hero, 16);
      centerText(
        ctx,
        !world.armed
          ? '손을 떼었다가 다시 누르세요'
          : world.miss > 0
            ? '떨어졌어요 · 누르면 다시 돕니다'
            : onPad ? '누르면 출발합니다' : '누르면 줄이 다시 돕니다',
        VIEW_W / 2, VIEW_H - 65, 26, BOARD.ink,
      );
    }
  };

  return (
    <MiniGameFrame
      badge="단계 갈고리 타기"
      instruction={`${stage.title}을 작은 단계로 나누어 갈고리를 탑니다. 누르고 있으면 다음 단계 갈고리에 줄이 걸려 돌고, 손을 떼면 그 힘으로 날아갑니다. 스페이스도 같습니다.`}
      progress={{ label: '걸어 탄 단계', value: hud.cleared, max: layout.anchors.length }}
      hud={<GameHud lives={hud.lives} maxLives={tuning.lives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].title}으로 바꿨어요.`)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 타기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="aspect-video max-h-full w-full max-w-[760px]">
          <GameCanvas
            active={game.playing}
            width={VIEW_W}
            height={VIEW_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') pressRef.current = true;
              if (pointer.phase === 'up') pressRef.current = false;
            }}
            ariaLabel={`${stage.title}을 단계마다 갈고리로 걸어 타고 건너가는 놀이. 걸어 탄 단계 ${hud.cleared}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
