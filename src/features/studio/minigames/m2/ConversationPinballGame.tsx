import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, approach, centerText, clamp, panel, useGameKeys,
} from '../engine';
import type { MiniGameProps } from '../types';

/**
 * m2-l10 · 대화 핀볼 (장르 29 · 핀볼)
 *
 * 부탁하기의 순서(목적 → 구체 → 근거 → 결정)를 범퍼 네 개로 세운다. 네 곳을 아무렇게나
 * 맞혀서는 아무 일도 없고, 앞 칸이 켜져 있어야 다음 칸에 불이 들어온다. 순서를 크게
 * 건너뛰면 켜 둔 불이 하나 꺼진다 — 근거도 없이 결정부터 하면 앞으로 되돌아가는 일과 같다.
 *
 * 넷이 다 켜져야 가운데 문이 열린다. "묻고 고쳐 묻고 확인한 다음에야 쓸지 정한다"를
 * 규칙 자체로 만든 것이라, 주제를 입힌 껍데기가 아니라 게임의 승리 조건이 곧 학습 내용이다.
 *
 * 공은 일부러 느리다. 중력과 반사 계수를 낮게 잡아 화면을 가로지르는 데 1.5초 넘게 걸린다.
 * 눈으로 따라갈 수 없는 공은 조작할 수도 없기 때문이다.
 */

const W = 960;
const H = 540;

/* 판 좌표. 세로 핀볼 판을 캔버스 가운데에 두고 양옆을 읽는 자리로 쓴다. */
const TOP = 76;
const LEFT = 276;
const DIV = 654;
const RIGHT = 698;
const DIV_TOP = 200;
const DEFLECT_X = 612;
const DEFLECT_Y = 140;
const LANE_FLOOR = 512;
const LANE_X = 676;
const SLANT_Y = 392;
const PIVOT_Y = 452;
const PIVOT_L = 330;
const PIVOT_R = 600;
const DRAIN_Y = 536;

const FLIP_REST = 0.5;
const FLIP_UP = -0.42;
const FLIP_SWING = 13;

/** 정적인 벽. 각 원소는 선분 [x1, y1, x2, y2]다. */
const WALLS: number[][] = [
  [LEFT, TOP, DEFLECT_X, TOP],
  // 오른쪽 위 비스듬한 벽 — 발사대에서 곧게 올라온 공을 판 안쪽으로 꺾어 준다.
  [DEFLECT_X, TOP, RIGHT, DEFLECT_Y],
  [RIGHT, DEFLECT_Y, RIGHT, LANE_FLOOR],
  [RIGHT, LANE_FLOOR, DIV, LANE_FLOOR],
  [DIV, LANE_FLOOR, DIV, DIV_TOP],
  [LEFT, TOP, LEFT, SLANT_Y],
  // 아래 양옆 경사 — 옆으로 새는 길을 막아 공이 반드시 날개 앞으로 모이게 한다.
  [LEFT, SLANT_Y, PIVOT_L, PIVOT_Y],
  [DIV, SLANT_Y, PIVOT_R, PIVOT_Y],
];

const STEPS = ['목적', '구체', '근거', '결정'];
const NUMS = ['①', '②', '③', '④'];

interface StageConfig {
  id: string;
  label: string;
  topic: string[];
  lines: string[];
  bumpers: number[][];
  gate: number[];
  /** 판 기울기 — 중력 배율과 옆으로 흐르는 힘 */
  tiltGravity: number;
  tiltDrift: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'notice',
    label: '기본',
    topic: ['학교 안내문을', '쉽게 바꾸기'],
    lines: [
      '무엇에 쓸 글인지 먼저 정해요',
      '몇 줄로, 누구를 위해 쓸지 말해요',
      '왜 그렇게 바꿨는지 물어봐요',
      '이대로 쓸지 마지막으로 정해요',
    ],
    bumpers: [[578, 150], [392, 158], [582, 312], [386, 320]],
    gate: [482, 240],
    tiltGravity: 1,
    tiltDrift: 0,
  },
  {
    id: 'club',
    label: '1단계',
    topic: ['동아리 모집 글', '부탁하기'],
    lines: [
      '어디에 붙일 글인지 정해요',
      '무슨 동아리인지 자세히 말해요',
      '어디서 온 내용인지 확인해요',
      '고칠 곳을 고른 뒤에 정해요',
    ],
    bumpers: [[594, 182], [378, 146], [396, 330], [580, 336]],
    gate: [486, 244],
    tiltGravity: 1.08,
    tiltDrift: -26,
  },
  {
    id: 'trip',
    label: '2단계',
    topic: ['체험학습 안내', '문자 부탁하기'],
    lines: [
      '누구에게 보낼 문자인지 정해요',
      '날짜와 준비물을 넣어 달라고 해요',
      '날짜가 맞는지 근거를 물어봐요',
      '보낼지 말지 마지막으로 정해요',
    ],
    bumpers: [[566, 178], [348, 220], [590, 296], [372, 352]],
    gate: [462, 248],
    tiltGravity: 1.16,
    tiltDrift: 30,
  },
];

interface World {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lit: number;
  lives: number;
  /** ready면 공이 발사대에 멈춰 있다. 첫 조작 전까지 판은 움직이지 않는다. */
  phase: 'ready' | 'live';
  /** 손을 떼었다가 다시 눌러야 발사된다. 누른 채로 빠지면 곧바로 또 발사되기 때문이다. */
  armed: boolean;
  charging: boolean;
  charge: number;
  flipL: number;
  flipR: number;
  wobble: number;
  still: number;
  finished: boolean;
}

function buildWorld(lives: number, ballR: number): World {
  return {
    x: LANE_X,
    y: LANE_FLOOR - ballR,
    vx: 0,
    vy: 0,
    lit: 0,
    lives,
    phase: 'ready',
    armed: false,
    charging: false,
    charge: 0,
    flipL: FLIP_REST,
    flipR: FLIP_REST,
    wobble: 0,
    still: 0,
    finished: false,
  };
}

/** 선분 위에서 점에 가장 가까운 자리. 벽 충돌은 전부 이 하나로 푼다. */
function closestOnSeg(px: number, py: number, seg: number[]): number[] {
  const dx = seg[2] - seg[0];
  const dy = seg[3] - seg[1];
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : clamp(((px - seg[0]) * dx + (py - seg[1]) * dy) / len2, 0, 1);
  return [seg[0] + dx * t, seg[1] + dy * t];
}

/** 한 점에서 minDist만큼 밀어내고 튕긴다. 닿았으면 밀어낸 방향을 돌려준다. */
function bounceOff(w: World, cx: number, cy: number, minDist: number, e: number): number[] | null {
  const dx = w.x - cx;
  const dy = w.y - cy;
  const d = Math.hypot(dx, dy);
  if (d >= minDist) return null;
  const safe = d < 0.001 ? 0.001 : d;
  const nx = dx / safe;
  const ny = dy / safe;
  w.x = cx + nx * minDist;
  w.y = cy + ny * minDist;
  const vn = w.vx * nx + w.vy * ny;
  if (vn < 0) {
    w.vx -= (1 + e) * vn * nx;
    w.vy -= (1 + e) * vn * ny;
  }
  return [nx, ny];
}

export default function ConversationPinballGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const ballR = 13 * Math.min(1.15, tuning.size);
  const bumperR = 32 * tuning.size;
  const flipLen = 100 * Math.min(1.18, tuning.size);
  const flipR = 9;
  const gateW = 112;
  const gateH = 50;
  /* 다음에 맞혀야 할 범퍼만 눈에 띄게 크다. 허용 오차가 넉넉한 수준일수록 더 커진다. */
  const nextBonus = 1 + 0.16 * tuning.tolerance;
  /* 순서에 맞게 맞히면 다음 범퍼 쪽으로 살짝 방향을 돌려 준다. 도움의 세기도 지원 수준을 따른다. */
  const blend = clamp(0.28 * tuning.tolerance, 0.15, 0.55);

  const gravity = 300 * tuning.speed * stage.tiltGravity;
  /* 속도 상한과 발사 힘을 중력에서 거꾸로 구한다. 이렇게 해야 속도를 낮춰도
     "공이 올라갈 수 있는 높이"는 그대로라 어느 지원 수준에서나 같은 판이 된다. */
  const maxSpeed = Math.sqrt(2 * gravity * 600);
  const launchMin = Math.sqrt(2 * gravity * 470);
  const launchAdd = maxSpeed - launchMin;
  const vScale = Math.sqrt(tuning.speed);

  const worldRef = useRef<World>(buildWorld(tuning.lives, ballR));
  const pressRef = useRef({ left: false, right: false, plunger: false });
  const [view, setView] = useState({ lit: 0, lives: tuning.lives });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    worldRef.current = buildWorld(tuning.lives, ballR);
    pressRef.current = { left: false, right: false, plunger: false };
    setView({ lit: 0, lives: tuning.lives });
  }, [game.round, game.stageIndex, tuning.lives, ballR]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number, elapsed: number) => {
    const w = worldRef.current;
    const press = pressRef.current;
    const wantL = press.left || keys.held.current.left;
    const wantR = press.right || keys.held.current.right;
    const wantPlunge = press.plunger || keys.held.current.action || keys.held.current.down;
    const gate = stage.gate;
    const gx = gate[0] - gateW / 2;
    const gy = gate[1] - gateH / 2;

    if (dt > 0 && !w.finished) {
      // 날개는 준비 상태에서도 움직인다. 공이 나가기 전에 조작을 미리 익힐 수 있다.
      const prevL = w.flipL;
      const prevR = w.flipR;
      w.flipL = approach(w.flipL, wantL ? FLIP_UP : FLIP_REST, FLIP_SWING * dt);
      w.flipR = approach(w.flipR, wantR ? FLIP_UP : FLIP_REST, FLIP_SWING * dt);
      const omegaL = (w.flipL - prevL) / dt;
      const omegaR = (w.flipR - prevR) / dt;
      w.wobble = Math.max(0, w.wobble - dt);

      if (w.phase === 'ready') {
        if (!wantPlunge) {
          if (w.charging) {
            // 누르고 있던 시간이 그대로 힘이 된다.
            w.vy = -(launchMin + w.charge * launchAdd);
            w.vx = 0;
            w.phase = 'live';
            w.charging = false;
            w.charge = 0;
          } else {
            w.armed = true;
          }
        } else if (w.armed) {
          w.charging = true;
          w.charge = Math.min(1, w.charge + dt / 1.15);
        }
      } else {
        const sub = 4;
        const h = dt / sub;
        for (let s = 0; s < sub; s += 1) {
          w.vy += gravity * h;
          w.vx += stage.tiltDrift * h;
          const speed = Math.hypot(w.vx, w.vy);
          if (speed > 60) {
            w.vx -= w.vx * 0.05 * h;
            w.vy -= w.vy * 0.05 * h;
          }
          w.x += w.vx * h;
          w.y += w.vy * h;

          for (const seg of WALLS) {
            const p = closestOnSeg(w.x, w.y, seg);
            bounceOff(w, p[0], p[1], ballR, 0.62);
          }

          for (let i = 0; i < 4; i += 1) {
            const b = stage.bumpers[i];
            const rr = bumperR * (i === w.lit ? nextBonus : 1);
            const n = bounceOff(w, b[0], b[1], rr + ballR, 0.5);
            if (!n) continue;
            const correct = i === w.lit;
            const pop = (correct ? 130 : 80) * vScale;
            w.vx += n[0] * pop;
            w.vy += n[1] * pop;
            if (correct) {
              w.lit += 1;
              const nb = stage.bumpers[w.lit];
              if (nb) {
                const ax = nb[0] - w.x;
                const ay = nb[1] - w.y;
                const al = Math.hypot(ax, ay) || 1;
                const ux = ax / al;
                const uy = ay / al;
                // 범퍼 안쪽으로 되밀지 않을 때만 돌린다. 아니면 공이 범퍼를 뚫는다.
                if (ux * n[0] + uy * n[1] > 0) {
                  const sp = Math.hypot(w.vx, w.vy);
                  w.vx = w.vx * (1 - blend) + ux * sp * blend;
                  w.vy = w.vy * (1 - blend) + uy * sp * blend;
                }
              }
            } else if (i > w.lit + 1 && w.lit > 0) {
              // 순서를 크게 건너뛰면 켜 둔 불이 하나 꺼진다.
              w.lit -= 1;
              w.wobble = 0.8;
            }
          }

          if (w.lit >= 4) {
            if (w.x > gx && w.x < gx + gateW && w.y > gy && w.y < gy + gateH) {
              w.finished = true;
              game.succeed('목적과 구체를 말하고 근거를 확인한 뒤 마지막 사용까지 정했어요!');
              break;
            }
          } else {
            const cx = clamp(w.x, gx, gx + gateW);
            const cy = clamp(w.y, gy, gy + gateH);
            bounceOff(w, cx, cy, ballR, 0.55);
          }

          const flips: number[][] = [
            [PIVOT_L, PIVOT_Y, PIVOT_L + Math.cos(w.flipL) * flipLen, PIVOT_Y + Math.sin(w.flipL) * flipLen, omegaL],
            [PIVOT_R, PIVOT_Y, PIVOT_R - Math.cos(w.flipR) * flipLen, PIVOT_Y + Math.sin(w.flipR) * flipLen, omegaR],
          ];
          for (const f of flips) {
            const p = closestOnSeg(w.x, w.y, f);
            const arm = Math.hypot(p[0] - f[0], p[1] - f[1]);
            const n = bounceOff(w, p[0], p[1], ballR + flipR, 0.35);
            if (!n) continue;
            if (f[4] < -0.5) {
              // 날개가 위로 올라가는 중일 때만 공을 밀어 올린다.
              const kick = Math.min(320, Math.abs(f[4]) * arm * 0.5) * vScale;
              w.vx += n[0] * kick;
              w.vy += n[1] * kick;
            }
          }

          const sp2 = Math.hypot(w.vx, w.vy);
          if (sp2 > maxSpeed) {
            w.vx *= maxSpeed / sp2;
            w.vy *= maxSpeed / sp2;
          }
        }

        // 어딘가에 끼어 멈추면 살짝 밀어 준다. 판이 굳어 버리면 다시 할 방법이 없다.
        w.still = Math.hypot(w.vx, w.vy) < 18 ? w.still + dt : 0;
        if (w.still > 4) {
          w.vy += 90 * vScale;
          w.vx += (w.x < 464 ? 50 : -50) * vScale;
          w.still = 0;
        }

        if (!w.finished && w.y > DRAIN_Y) {
          w.lives -= 1;
          w.x = LANE_X;
          w.y = LANE_FLOOR - ballR;
          w.vx = 0;
          w.vy = 0;
          w.phase = 'ready';
          w.armed = false;
          w.charging = false;
          w.charge = 0;
          w.still = 0;
          if (w.lives <= 0) {
            w.finished = true;
            game.fail('공이 모두 빠졌어요. 날개를 조금 늦게 쳐서 공을 위쪽 범퍼로 올려 보세요.');
          }
        }
      }

      if (w.lit !== view.lit || w.lives !== view.lives) {
        setView({ lit: w.lit, lives: w.lives });
      }
    }

    // ── 그리기 ────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, W, H);

    // 읽을 글은 위쪽 띠 한 곳에만 크게 둔다.
    panel(ctx, 12, 8, 936, 56, BOARD.overlay, w.wobble > 0 ? PLAY.hazard : PLAY.info, 14);
    const banner = w.wobble > 0
      ? '순서를 건너뛰었어요. ①부터 차례로 켜요.'
      : (w.lit >= 4
        ? '문이 열렸어요. 공을 가운데 문에 넣으세요.'
        : `${NUMS[w.lit]} ${STEPS[w.lit]} — ${stage.lines[w.lit]}`);
    centerText(ctx, banner, 480, 37, 28, BOARD.ink);

    // 왼쪽 — 순서 등 네 칸
    panel(ctx, 12, 76, 246, 452, BOARD.surface, BOARD.line, 16);
    centerText(ctx, '순서대로 켜기', 135, 100, 24, BOARD.inkDim);
    for (let i = 0; i < 4; i += 1) {
      const y = 124 + i * 96;
      const on = i < w.lit;
      panel(ctx, 24, y, 222, 80, on ? '#14532D' : BOARD.overlay, on ? PLAY.goal : BOARD.line, 14);
      centerText(ctx, `${NUMS[i]} ${STEPS[i]}${on ? ' ✅' : ''}`, 135, y + 40, 28, on ? BOARD.ink : BOARD.inkDim);
    }

    // 판
    panel(ctx, 270, 70, 434, 466, BOARD.overlay, BOARD.line, 18);
    ctx.strokeStyle = BOARD.line;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    for (const seg of WALLS) {
      ctx.beginPath();
      ctx.moveTo(seg[0], seg[1]);
      ctx.lineTo(seg[2], seg[3]);
      ctx.stroke();
    }

    // 가운데 문 — 닫혔을 때는 부딪히는 벽, 열리면 넣는 자리
    const open = w.lit >= 4;
    panel(ctx, gx, gy, gateW, gateH, open ? BOARD.bg : PLAY.hazardEdge, open ? PLAY.goal : PLAY.hazard, 12);
    centerText(ctx, open ? '사용 ✅' : '사용 🔒', gate[0], gate[1], 26, open ? PLAY.goal : BOARD.ink);

    for (let i = 0; i < 4; i += 1) {
      const b = stage.bumpers[i];
      const on = i < w.lit;
      const isNext = i === w.lit;
      const rr = bumperR * (isNext ? nextBonus : 1);
      ctx.beginPath();
      ctx.arc(b[0], b[1], rr, 0, Math.PI * 2);
      ctx.fillStyle = on ? '#14532D' : BOARD.surface;
      ctx.fill();
      ctx.strokeStyle = on ? PLAY.goal : (isNext ? PLAY.hero : BOARD.line);
      ctx.lineWidth = isNext ? 6 : 4;
      ctx.stroke();
      if (isNext) {
        // 지금 맞힐 곳만 숨 쉬듯 커졌다 작아진다. 글자보다 움직임이 먼저 읽힌다.
        ctx.beginPath();
        ctx.arc(b[0], b[1], rr + 6 + Math.sin(elapsed * 3) * 5, 0, Math.PI * 2);
        ctx.strokeStyle = PLAY.hero;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      centerText(ctx, STEPS[i], b[0], b[1], 24, on ? PLAY.goal : BOARD.ink);
    }

    // 날개
    ctx.lineCap = 'round';
    ctx.lineWidth = flipR * 2;
    ctx.strokeStyle = PLAY.hero;
    ctx.beginPath();
    ctx.moveTo(PIVOT_L, PIVOT_Y);
    ctx.lineTo(PIVOT_L + Math.cos(w.flipL) * flipLen, PIVOT_Y + Math.sin(w.flipL) * flipLen);
    ctx.moveTo(PIVOT_R, PIVOT_Y);
    ctx.lineTo(PIVOT_R - Math.cos(w.flipR) * flipLen, PIVOT_Y + Math.sin(w.flipR) * flipLen);
    ctx.stroke();

    // 발사대 힘 막대
    if (w.charge > 0) {
      const barH = 250 * w.charge;
      panel(ctx, DIV + 8, LANE_FLOOR - 6 - barH, 30, barH, PLAY.hero, PLAY.heroEdge, 8);
    }

    // 공
    ctx.beginPath();
    ctx.arc(w.x, w.y, ballR, 0, Math.PI * 2);
    ctx.fillStyle = PLAY.extra;
    ctx.fill();
    ctx.strokeStyle = PLAY.extraEdge;
    ctx.lineWidth = 4;
    ctx.stroke();

    // 오른쪽 — 이번 판에서 부탁하는 일과 판 기울기
    panel(ctx, 716, 76, 232, 452, BOARD.surface, BOARD.line, 16);
    centerText(ctx, '부탁하는 일', 832, 108, 24, BOARD.inkDim);
    centerText(ctx, stage.topic[0], 832, 150, 26, BOARD.ink);
    centerText(ctx, stage.topic[1], 832, 184, 26, BOARD.ink);
    panel(ctx, 730, 220, 204, 66, BOARD.overlay, open ? PLAY.goal : BOARD.line, 12);
    centerText(ctx, open ? '문 열림' : '문 닫힘', 832, 253, 26, open ? PLAY.goal : BOARD.inkDim);
    centerText(ctx, '판 기울기', 832, 322, 24, BOARD.inkDim);
    centerText(ctx, stage.tiltDrift < 0 ? '⬅ 왼쪽' : (stage.tiltDrift > 0 ? '오른쪽 ➡' : '가운데'), 832, 358, 26, BOARD.ink);
    centerText(ctx, 'A 왼쪽 날개', 832, 434, 24, BOARD.inkDim);
    centerText(ctx, 'D 오른쪽 날개', 832, 470, 24, BOARD.inkDim);

    // 준비 안내 — 첫 조작 전과 공이 빠진 뒤에 나온다.
    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, 292, 392, 390, 62, BOARD.overlay, PLAY.hero, 16);
      centerText(
        ctx,
        w.armed ? '누르고 있다가 놓으면 공이 나갑니다' : '손을 떼었다가 다시 누르세요',
        487, 423, 26, BOARD.ink,
      );
    }
  };

  return (
    <MiniGameFrame
      badge="대화 핀볼"
      instruction="발사대를 누르고 있다가 놓아 공을 쏘고, A 키와 D 키(또는 화면 왼쪽·오른쪽 절반)로 날개를 쳐서 목적 → 구체 → 근거 → 결정 범퍼를 순서대로 켜세요. 넷이 다 켜지면 가운데 문이 열립니다."
      progress={{ label: '순서대로 켠 곳', value: view.lit, max: 4 }}
      hud={<GameHud lives={view.lives} maxLives={tuning.lives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].topic.join(' ')} 판으로 바꿨어요.`)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="aspect-video max-h-full w-full max-w-[760px]">
          <GameCanvas
            active={game.playing}
            width={W}
            height={H}
            onFrame={frame}
            onPointer={(pointer) => {
              const w = worldRef.current;
              if (pointer.phase === 'down') {
                // 공이 발사대에 있을 때는 어디를 눌러도 힘이 모인다. 누를 자리를 못 찾아
                // 아무 일도 일어나지 않는 상황을 만들지 않기 위해서다.
                if (w.phase === 'ready') pressRef.current.plunger = true;
                else if (pointer.x < W / 2) pressRef.current.left = true;
                else pressRef.current.right = true;
              }
              if (pointer.phase === 'up') {
                pressRef.current = { left: false, right: false, plunger: false };
              }
            }}
            ariaLabel={`부탁하는 순서를 범퍼로 켜는 핀볼. 켠 곳 ${view.lit}개, 남은 공 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
