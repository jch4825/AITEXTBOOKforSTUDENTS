import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, approach, centerText, circleRectHit, clamp,
  drawContain, fillRoundRect, lerp, panel, useGameImages, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l5 · 말투 도로 운전 (장르 31 · 스티어링)
 *
 * "답을 읽을 사람에 맞춰 말투를 고른다"를 도로를 따라가는 일로 만든다. 왼쪽 벽은 너무
 * 딱딱한 말, 오른쪽 벽은 너무 편한 말이고, 그 사이의 좁은 길만 그 사람에게 어울리는
 * 말투다. 읽을 사람이 바뀌면 길 자체가 좌우로 옮겨 가므로, 학생은 정답표를 고르는 대신
 * 핸들을 계속 고쳐 잡으며 "사람이 바뀌면 말투도 옮겨 간다"를 몸으로 겪는다.
 *
 * 말투만 맞으면 끝이 아니라는 것이 이 차시의 다른 절반이다. 그래서 길 위에 시간·장소·
 * 준비물 카드를 두고, 하나라도 지나쳐 버리면 그 자리로 되돌아가 다시 줍게 한다.
 * 사실을 싣지 않은 답장은 말투가 아무리 고와도 도착으로 치지 않는다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
/** 차는 아래쪽에 고정하고 길이 위에서 내려온다. 준비 안내판과 겹치지 않는 높이다. */
const CAR_Y = 398;
const CAR_HW = 27;
const CAR_HH = 34;
/** 읽을 사람에 따라 길이 옮겨 가는 거리. 벽이 화면 밖으로 나가지 않는 선에서 최대로 잡았다. */
const BIAS_SHIFT = 104;
const MIN_CENTER = 312;
const MAX_CENTER = 648;
const ROAD_HALF_BASE = 128;
const SCROLL_BASE = 135;
const STEER_BASE = 340;
const ITEM_R_BASE = 30;

const LEFT_WALL_LABEL = '너무 딱딱한 말';
const RIGHT_WALL_LABEL = '너무 편한 말';

interface Audience {
  name: string;
  emoji: string;
  /** -1이면 딱딱한 쪽, +1이면 편한 쪽으로 길이 옮겨 간다. */
  bias: number;
}

const PRINCIPAL: Audience = { name: '교장 선생님께', emoji: '🎓', bias: -1 };
const FRIEND: Audience = { name: '친구에게', emoji: '🙂', bias: 1 };
const PARENT: Audience = { name: '학부모님께', emoji: '👪', bias: -0.42 };

/** 반드시 실어야 하는 사실 세 가지. 순서가 곧 위쪽 띠의 칸 순서다. */
const FACT_KINDS = [
  { name: '시간', emoji: '🕐' },
  { name: '장소', emoji: '🚩' },
  { name: '준비물', emoji: '🎒' },
];

interface StageConfig {
  id: string;
  label: string;
  topic: string;
  spoken: string;
  /** 코스 길이(가상 단위). 단계가 오를수록 길어진다. */
  length: number;
  /** 굽이의 좌우 폭 */
  curveAmp: number;
  /** 코스 전체에 들어가는 굽이 수 */
  curves: number;
  audiences: Audience[];
  /** at은 코스 길이 대비 위치, side는 길 반폭 대비 좌우 치우침이다. */
  facts: { at: number; side: number }[];
}

const STAGES: StageConfig[] = [
  {
    id: 'notice',
    label: '기본',
    topic: '체험학습 안내에 답장하기',
    spoken: '체험학습 안내에 답장하는 길입니다.',
    length: 3000,
    curveAmp: 34,
    curves: 3,
    audiences: [PRINCIPAL, FRIEND, PARENT],
    facts: [{ at: 0.22, side: -0.45 }, { at: 0.52, side: 0.5 }, { at: 0.8, side: -0.35 }],
  },
  {
    id: 'invite',
    label: '1단계',
    topic: '학교 행사에 초대하기',
    spoken: '학교 행사에 초대하는 길입니다.',
    length: 3900,
    curveAmp: 44,
    curves: 5,
    audiences: [FRIEND, PRINCIPAL, PARENT, FRIEND],
    facts: [{ at: 0.18, side: 0.5 }, { at: 0.46, side: -0.55 }, { at: 0.76, side: 0.45 }],
  },
  {
    id: 'trip',
    label: '2단계',
    topic: '현장 체험 학습을 알리기',
    spoken: '현장 체험 학습을 알리는 길입니다.',
    length: 4800,
    curveAmp: 54,
    curves: 8,
    audiences: [PARENT, FRIEND, PRINCIPAL, FRIEND, PRINCIPAL],
    facts: [{ at: 0.16, side: -0.5 }, { at: 0.44, side: 0.55 }, { at: 0.78, side: -0.5 }],
  },
];

/**
 * 코스 위치 s에서 길 한가운데가 어디인지.
 *
 * 읽을 사람마다 구간 한가운데에 못을 박고 그 사이를 부드럽게 잇는다. 이렇게 하면 사람이
 * 바뀌는 순간 길이 꺾이지 않고 한 구간에 걸쳐 서서히 옮겨 가서, 학생이 핸들을 조금씩
 * 고쳐 잡을 시간이 생긴다.
 */
function roadCenter(stage: StageConfig, curves: number, amp: number, s: number): number {
  const segLen = stage.length / stage.audiences.length;
  const p = clamp(s / segLen - 0.5, 0, stage.audiences.length - 1);
  const i = Math.floor(p);
  const j = Math.min(stage.audiences.length - 1, i + 1);
  const raw = p - i;
  const eased = raw * raw * (3 - 2 * raw);
  const bias = lerp(stage.audiences[i].bias, stage.audiences[j].bias, eased);
  const wave = Math.sin((s / stage.length) * curves * Math.PI * 2) * amp;
  return clamp(WORLD_W / 2 + bias * BIAS_SHIFT + wave, MIN_CENTER, MAX_CENTER);
}

/** 위쪽 띠에 이름이 뜨는 사람. 길이 옮겨 가기 시작하는 지점에서 이름도 함께 바뀐다. */
function audienceIndexAt(stage: StageConfig, s: number): number {
  const segLen = stage.length / stage.audiences.length;
  return clamp(Math.floor(s / segLen + 0.5), 0, stage.audiences.length - 1);
}

interface Item {
  s: number;
  side: number;
  kind: number;
  taken: boolean;
}

interface World {
  traveled: number;
  carX: number;
  lives: number;
  items: Item[];
  taken: number;
  shake: number;
  bob: number;
  finished: boolean;
  /** ready면 아직 출발하지 않았다. 첫 조작 전에는 길이 한 칸도 흐르지 않는다. */
  phase: 'ready' | 'driving';
  /** 손을 떼었다가 다시 눌러야 재출발한다. 누른 채로 벽에 닿으면 곧바로 또 부딪히기 때문이다. */
  armed: boolean;
  /** 멈춘 까닭 한 줄. 읽을 글은 위쪽 한 곳에만 둔다. */
  notice: string;
}

function buildWorld(stage: StageConfig, curves: number, amp: number, lives: number): World {
  return {
    traveled: 0,
    carX: roadCenter(stage, curves, amp, 0),
    lives,
    items: stage.facts.map((fact, index) => ({
      s: stage.length * fact.at,
      side: fact.side,
      kind: index,
      taken: false,
    })),
    taken: 0,
    shake: 0,
    bob: 0,
    finished: false,
    phase: 'ready',
    armed: false,
    notice: '',
  };
}

/** 벽에 세로로 적는 글자. 한 자씩 아래로 쌓아 도로 옆을 따라 흐르게 한다. */
function drawWallLabel(
  ctx: CanvasRenderingContext2D, text: string, x: number, topY: number, color: string,
): void {
  for (let i = 0; i < text.length; i += 1) {
    centerText(ctx, text[i], x, topY + i * 30, 25, color);
  }
}

export default function ToneRoadDriveGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const half = ROAD_HALF_BASE * tuning.size;
  const itemR = ITEM_R_BASE * tuning.size;
  const scroll = SCROLL_BASE * tuning.speed;
  const steer = STEER_BASE * tuning.speed;
  const curves = Math.max(2, Math.round(stage.curves * tuning.density));
  /* 길이 넓어지는 수준에서는 굽이도 함께 완만해져야 한다. 넓은 길에 큰 굽이를 그대로 두면
     화면 가장자리로 밀려 벽 글자가 가려진다. */
  const amp = stage.curveAmp * (2 - tuning.size);

  const worldRef = useRef<World>(buildWorld(stage, curves, amp, tuning.lives));
  const pointerRef = useRef({ down: false, x: WORLD_W / 2 });
  const [hud, setHud] = useState({ taken: 0, lives: tuning.lives });
  const keys = useGameKeys(game.playing);
  const art = useGameImages({ car: '/images/games/car-top.jpg' }, { cutoutWhite: true });

  useEffect(() => {
    worldRef.current = buildWorld(stage, curves, amp, tuning.lives);
    pointerRef.current = { down: false, x: WORLD_W / 2 };
    setHud({ taken: 0, lives: tuning.lives });
  }, [game.round, game.stageIndex, stage, curves, amp, tuning.lives]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    const pointer = pointerRef.current;
    const left = keys.held.current.left;
    const right = keys.held.current.right;
    const touching = left || right || keys.held.current.action || pointer.down;

    if (dt > 0 && !world.finished && world.phase === 'ready') {
      // 출발 전에는 차만 살짝 흔들리고 길은 멈춰 있다. 학생이 위쪽 띠를 읽을 시간을 준다.
      world.bob += dt * 3;
      world.shake = Math.max(0, world.shake - dt * 1.6);
      if (!touching) world.armed = true;
      if (touching && world.armed && world.shake <= 0) {
        world.phase = 'driving';
        world.armed = false;
        world.notice = '';
      }
    } else if (dt > 0 && !world.finished) {
      world.traveled += scroll * dt;
      if (pointer.down) world.carX = approach(world.carX, pointer.x, steer * dt);
      else if (left && !right) world.carX -= steer * dt;
      else if (right && !left) world.carX += steer * dt;
      world.carX = clamp(world.carX, 24, WORLD_W - 24);

      const center = roadCenter(stage, curves, amp, world.traveled);
      let notice = '';
      if (world.carX - CAR_HW < center - half) {
        notice = '너무 딱딱한 쪽 벽에 닿았어요';
        world.traveled = Math.max(0, world.traveled - 70);
      } else if (world.carX + CAR_HW > center + half) {
        notice = '너무 편한 쪽 벽에 닿았어요';
        world.traveled = Math.max(0, world.traveled - 70);
      } else {
        const carBox = { x: world.carX - CAR_HW, y: CAR_Y - CAR_HH, w: CAR_HW * 2, h: CAR_HH * 2 };
        for (const item of world.items) {
          if (item.taken) continue;
          const iy = CAR_Y - (item.s - world.traveled);
          const ix = roadCenter(stage, curves, amp, item.s) + item.side * half;
          if (circleRectHit(ix, iy, itemR, carBox)) {
            item.taken = true;
            world.taken += 1;
            playSound('confirm');
          } else if (item.s < world.traveled - 46 && !notice) {
            // 지나쳐 버린 사실은 되돌아가서 다시 줍는다. 사실 없는 답장은 도착이 아니기 때문이다.
            notice = `${FACT_KINDS[item.kind].name} 카드를 놓쳤어요`;
            world.traveled = Math.max(0, item.s - 260);
          }
        }
      }

      if (notice) {
        world.lives -= 1;
        world.phase = 'ready';
        world.armed = false;
        world.shake = 0.65;
        world.bob = 0;
        world.notice = notice;
        world.carX = roadCenter(stage, curves, amp, world.traveled);
      }

      if (world.taken !== hud.taken || world.lives !== hud.lives) {
        setHud({ taken: world.taken, lives: world.lives });
      }

      if (world.lives <= 0) {
        world.finished = true;
        game.fail('길에서 자꾸 벗어났어요. 위쪽 띠에서 읽을 사람을 먼저 보고 그 길을 따라가세요.');
      } else if (world.traveled >= stage.length && world.taken >= FACT_KINDS.length) {
        world.finished = true;
        game.succeed('읽을 사람에 맞게 말투를 지키고 시간·장소·준비물까지 실어서 도착했어요!');
      }
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.surface;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    const edges: { y: number; c: number }[] = [];
    for (let y = -20; y <= WORLD_H + 20; y += 12) {
      edges.push({ y, c: roadCenter(stage, curves, amp, world.traveled + (CAR_Y - y)) });
    }

    ctx.fillStyle = BOARD.overlay;
    ctx.beginPath();
    ctx.moveTo(edges[0].c - half, edges[0].y);
    for (const edge of edges) ctx.lineTo(edge.c - half, edge.y);
    for (let i = edges.length - 1; i >= 0; i -= 1) ctx.lineTo(edges[i].c + half, edges[i].y);
    ctx.closePath();
    ctx.fill();

    const nowCenter = roadCenter(stage, curves, amp, world.traveled);
    // 벽에 가까워지면 그 벽만 위험색으로 바뀐다. 글자보다 색이 먼저 보이게 하려는 것이다.
    const nearLeft = world.carX - CAR_HW - (nowCenter - half) < 26;
    const nearRight = (nowCenter + half) - (world.carX + CAR_HW) < 26;

    ctx.lineWidth = 6;
    ctx.strokeStyle = nearLeft ? PLAY.hazard : PLAY.info;
    ctx.beginPath();
    edges.forEach((edge, i) => (i === 0 ? ctx.moveTo(edge.c - half, edge.y) : ctx.lineTo(edge.c - half, edge.y)));
    ctx.stroke();
    ctx.strokeStyle = nearRight ? PLAY.hazard : PLAY.extra;
    ctx.beginPath();
    edges.forEach((edge, i) => (i === 0 ? ctx.moveTo(edge.c + half, edge.y) : ctx.lineTo(edge.c + half, edge.y)));
    ctx.stroke();

    const labelStep = 300;
    const firstLabel = Math.ceil((world.traveled - 150) / labelStep) * labelStep;
    for (let s = firstLabel; s < world.traveled + 470; s += labelStep) {
      const y = CAR_Y - (s - world.traveled);
      drawWallLabel(ctx, LEFT_WALL_LABEL, 44, y, PLAY.info);
      drawWallLabel(ctx, RIGHT_WALL_LABEL, WORLD_W - 44, y, PLAY.extra);
    }

    const dashStep = 110;
    const firstDash = Math.ceil((world.traveled - 130) / dashStep) * dashStep;
    ctx.fillStyle = BOARD.line;
    for (let s = firstDash; s < world.traveled + 470; s += dashStep) {
      const y = CAR_Y - (s - world.traveled);
      fillRoundRect(ctx, roadCenter(stage, curves, amp, s) - 4, y - 24, 8, 48, 4);
    }

    const goalY = CAR_Y - (stage.length - world.traveled);
    if (goalY > -60 && goalY < WORLD_H + 60) {
      const goalCenter = roadCenter(stage, curves, amp, stage.length);
      panel(ctx, goalCenter - half, goalY - 22, half * 2, 44, PLAY.goalEdge, PLAY.goal, 10);
      centerText(ctx, '도착', goalCenter, goalY, 28, BOARD.ink);
    }

    for (const item of world.items) {
      if (item.taken) continue;
      const iy = CAR_Y - (item.s - world.traveled);
      if (iy < -70 || iy > WORLD_H + 70) continue;
      const ix = roadCenter(stage, curves, amp, item.s) + item.side * half;
      ctx.fillStyle = PLAY.goalEdge;
      ctx.beginPath();
      ctx.arc(ix, iy, itemR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PLAY.goal;
      ctx.lineWidth = 4;
      ctx.stroke();
      centerText(ctx, FACT_KINDS[item.kind].emoji, ix, iy, 32, BOARD.ink);
    }

    const shakeX = world.shake > 0 ? Math.sin(world.shake * 46) * 9 : 0;
    const bobY = world.phase === 'ready' ? Math.sin(world.bob) * 3 : 0;
    ctx.save();
    ctx.translate(world.carX + shakeX, CAR_Y + bobY);
    // 흰 바탕은 받을 때 이미 지웠다. 여기서는 그대로 얹기만 한다.
    if (!drawContain(ctx, art.map.current.car, 0, 0, CAR_HW * 2.6, CAR_HH * 2.6)) {
      panel(ctx, -CAR_HW, -CAR_HH, CAR_HW * 2, CAR_HH * 2, PLAY.hero, PLAY.heroEdge, 12);
      panel(ctx, -CAR_HW + 8, -CAR_HH + 9, CAR_HW * 2 - 16, 22, BOARD.overlay, PLAY.heroEdge, 6);
      centerText(ctx, '✉️', 0, 16, 26, BOARD.ink);
    }
    ctx.restore();

    // 위쪽 띠 — 읽을 사람과 실어야 할 사실. 이 게임에서 학생이 읽는 글은 여기뿐이다.
    const audience = stage.audiences[audienceIndexAt(stage, world.traveled)];
    panel(ctx, 16, 12, 148, 58, BOARD.overlay, BOARD.line, 14);
    centerText(ctx, '읽을 사람', 90, 41, 24, BOARD.inkDim);
    panel(ctx, 172, 12, 300, 58, BOARD.overlay, PLAY.hero, 14);
    centerText(ctx, `${audience.emoji} ${audience.name}`, 322, 41, 30, BOARD.ink);

    panel(ctx, WORLD_W - 366, 12, 350, 58, BOARD.overlay, PLAY.goal, 14);
    centerText(ctx, '실을 사실', WORLD_W - 300, 41, 24, BOARD.inkDim);
    FACT_KINDS.forEach((kind, index) => {
      const x = WORLD_W - 200 + index * 70;
      const got = world.items.some((item) => item.kind === index && item.taken);
      panel(ctx, x - 30, 18, 60, 46, got ? PLAY.goalEdge : BOARD.surface, got ? PLAY.goal : BOARD.line, 10);
      centerText(ctx, kind.emoji, x, 41, 28, BOARD.ink);
    });

    if (world.phase === 'ready' && !world.finished) {
      if (world.notice) {
        panel(ctx, WORLD_W / 2 - 250, 84, 500, 52, BOARD.overlay, PLAY.hazard, 14);
        centerText(ctx, world.notice, WORLD_W / 2, 110, 26, BOARD.ink);
      }
      panel(ctx, WORLD_W / 2 - 235, WORLD_H - 92, 470, 58, BOARD.overlay, PLAY.hero, 16);
      centerText(
        ctx,
        world.armed
          ? (world.lives < tuning.lives ? '누르면 다시 출발합니다' : '누르면 출발합니다')
          : '손을 떼었다가 다시 누르세요',
        WORLD_W / 2, WORLD_H - 63, 26, BOARD.ink,
      );
    }
  };

  return (
    <MiniGameFrame
      badge="말투 도로 운전"
      instruction="도로를 따라 차를 운전하며, 설명문에 꼭 필요한 정보 상자를 모아 보세요."
      progress={{ label: '주운 사실', value: hud.taken, max: FACT_KINDS.length }}
      hud={<GameHud lives={hud.lives} maxLives={tuning.lives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 달리기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') {
                pointerRef.current.down = true;
                pointerRef.current.x = pointer.x;
              } else if (pointer.phase === 'move') {
                if (pointerRef.current.down) pointerRef.current.x = pointer.x;
              } else {
                pointerRef.current.down = false;
              }
            }}
            ariaLabel={`${stage.topic}. 읽을 사람에 맞춰 옮겨 가는 길을 따라 달리며 시간·장소·준비물 카드를 줍는 놀이. 남은 기회 ${hud.lives}개, 주운 사실 ${hud.taken}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
