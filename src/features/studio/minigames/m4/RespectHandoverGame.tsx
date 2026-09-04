import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, circleRectHit, clamp, dist,
  fillRoundRect, lerp, panel, pointInRect, useGameKeys, useReducedMotion,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m4-l7 · 흔들 팔로 건네기 (장르 10 · 물리 흔들기)
 *
 * "거친 말과 존중하는 말"을 손의 속도로 만든다. 말투는 낱말만의 문제가 아니라 속도와
 * 결의 문제라서, 고르고 느린 손은 존중하는 말이 되고 홱 잡아채는 손은 거친 말이 된다.
 * 학생은 어느 표현이 맞는지 고르는 대신, 자기가 움직인 속도가 위쪽 두 표현 중 하나를
 * 켜는 것을 보며 몸으로 겪는다.
 *
 * 팔은 두 마디 스프링이라 목표를 곧바로 따라오지 않고 관성으로 흔들린다. 그래서 빨리
 * 가려 할수록 팔이 출렁이고, 물건은 떨어진다. 정답표가 없고 결과가 전부 학생이 만든
 * 움직임에서 나온다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

/** 어깨는 고정점이다. 팔 두 마디는 여기에서 뻗어 나간다. */
const SHOULDER = { x: 100, y: 288 };
const UPPER = 320;
const FORE = 320;
/** 완전히 펴진 팔은 뻣뻣해 보이므로 닿는 거리를 조금 줄여 늘 살짝 굽어 있게 한다. */
const REACH = UPPER + FORE - 16;

const TABLE_X = 176;
const TABLE_W = 392;
const TABLE_TOP = 396;
const GROUND_Y = 462;
const PED_TOP = 330;
/** 물건이 탁자에서 쉬는 자리. 셋이 나란히 놓여 어느 것부터 집을지 학생이 고른다. */
const HOME_X = [232, 336, 440];

interface ItemDef {
  name: string;
  emoji: string;
  /** 무거울수록 팔의 되돌아오는 힘이 약해져 더 크게 출렁인다. */
  weight: number;
}

interface StageConfig {
  id: string;
  label: string;
  receiver: string;
  receiverEmoji: string;
  /** 같은 부탁을 두 가지로 적은 것. 손이 빠르면 왼쪽, 고르면 오른쪽이 켜진다. */
  rough: string;
  kind: string;
  spoken: string;
  pedestalX: number;
  limitMul: number;
  items: ItemDef[];
}

const STAGES: StageConfig[] = [
  {
    id: 'aimi-near',
    label: '기본',
    receiver: '아이미',
    receiverEmoji: '🤖',
    rough: '야! 이거!',
    kind: '이것 좀 건네주시겠어요?',
    spoken: '아이미에게 세 가지를 건넵니다.',
    pedestalX: 566,
    limitMul: 1.18,
    items: [
      { name: '책', emoji: '📕', weight: 1 },
      { name: '컵', emoji: '☕', weight: 1.05 },
      { name: '연필', emoji: '✏️', weight: 1 },
    ],
  },
  {
    id: 'aimi-heavy',
    label: '1단계',
    receiver: '아이미',
    receiverEmoji: '🤖',
    rough: '빨리 받아!',
    kind: '이것도 받아 주시겠어요?',
    spoken: '물건이 무거워지고 받침대가 멀어집니다.',
    pedestalX: 620,
    limitMul: 1,
    items: [
      { name: '두꺼운 책', emoji: '📚', weight: 1.18 },
      { name: '가득 찬 컵', emoji: '🥤', weight: 1.28 },
      { name: '연필통', emoji: '🖊️', weight: 1.1 },
    ],
  },
  {
    id: 'person',
    label: '2단계',
    receiver: '옆 반 친구',
    receiverEmoji: '🧑',
    rough: '야, 그냥 가져가!',
    kind: '이것 좀 전해 주시겠어요?',
    spoken: '이번에는 사람에게 건넵니다. 더 고른 손이 필요합니다.',
    pedestalX: 664,
    limitMul: 0.86,
    items: [
      { name: '무거운 책', emoji: '📗', weight: 1.34 },
      { name: '뜨거운 컵', emoji: '🍵', weight: 1.46 },
      { name: '필통', emoji: '🖍️', weight: 1.22 },
    ],
  },
];

type ItemPhase = 'table' | 'carried' | 'falling' | 'done';

interface ItemState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: ItemPhase;
}

interface World {
  /** ready면 팔이 멈춰 있다. 누르기 전에는 아무것도 움직이지 않는다. */
  phase: 'ready' | 'play';
  hx: number; hy: number; hvx: number; hvy: number;
  ex: number; ey: number; evx: number; evy: number;
  tx: number; ty: number;
  /** 다듬은 손 속도. 이 값이 곧 말투다. */
  tone: number;
  /** 허용 속도를 넘긴 채 버틴 시간. 한 번의 흔들림으로 곧장 떨어뜨리지 않으려는 유예다. */
  rough: number;
  carry: number;
  carryTime: number;
  items: ItemState[];
  delivered: number;
  lives: number;
  timeLeft: number;
  shake: number;
  finished: boolean;
}

function buildWorld(stage: StageConfig, lives: number, itemR: number, seconds: number): World {
  return {
    phase: 'ready',
    hx: 300, hy: 336, hvx: 0, hvy: 0,
    ex: 240, ey: 420, evx: 0, evy: 0,
    tx: 300, ty: 336,
    tone: 0,
    rough: 0,
    carry: -1,
    carryTime: 0,
    items: stage.items.map((_, index) => ({
      x: HOME_X[index], y: TABLE_TOP - itemR, vx: 0, vy: 0, phase: 'table' as ItemPhase,
    })),
    delivered: 0,
    lives,
    timeLeft: seconds,
    shake: 0,
    finished: false,
  };
}

/** 한 점을 기준점에서 정해진 길이의 자리로 끌어당긴다. 팔 마디 길이를 지키는 장치다. */
function pinLength(px: number, py: number, ax: number, ay: number, len: number): number[] {
  const dx = px - ax;
  const dy = py - ay;
  const d = Math.hypot(dx, dy) || 1;
  return [ax + (dx / d) * len, ay + (dy / d) * len];
}

export default function RespectHandoverGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;
  const reduced = useReducedMotion();

  const itemR = 26 * tuning.size;
  const pedW = 150 * tuning.size;
  const totalTime = Math.round(105 * tuning.time);
  /** 존중하는 말로 인정되는 손 속도의 위쪽 한계. 지원 수준과 단계가 함께 좁힌다. */
  const limit = 205 * tuning.tolerance * stage.limitMul;
  /* 방향키는 늘 허용 속도 안에서만 움직이게 한다. 손이 떨리거나 마우스를 잡기 어려운
     학생에게도 성공하는 길이 반드시 하나는 열려 있어야 하기 때문이다. 마우스는 그보다
     빠르게 따라갈 수 있어, 서두르면 거친 말이 켜지는 쪽을 학생이 스스로 겪는다. */
  const keySpeed = limit * 0.68;
  const pointerSpeed = limit * 2.4;
  const patience = 0.5 * tuning.tolerance;

  const worldRef = useRef<World>(buildWorld(stage, tuning.lives, itemR, totalTime));
  const pointerRef = useRef({ x: 300, y: 336 });
  const pressRef = useRef(false);
  const [hud, setHud] = useState({ delivered: 0, lives: tuning.lives, sec: totalTime });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    worldRef.current = buildWorld(stage, tuning.lives, itemR, totalTime);
    pointerRef.current = { x: 300, y: 336 };
    pressRef.current = false;
    setHud({ delivered: 0, lives: tuning.lives, sec: totalTime });
  }, [game.round, game.stageIndex, stage, tuning.lives, itemR, totalTime]);

  /** 물건을 놓쳐 떨어뜨린다. 준비 자세로 돌아가 학생이 다시 누를 때까지 기다린다. */
  const dropCarried = (world: World) => {
    const item = world.items[world.carry];
    item.phase = 'falling';
    item.vx = clamp(world.hvx * 0.3, -220, 220);
    item.vy = -60;
    world.carry = -1;
    world.rough = 0;
    world.lives -= 1;
    world.shake = 0.7;
    world.phase = 'ready';
    world.hvx = 0;
    world.hvy = 0;
    world.tx = world.hx;
    world.ty = world.hy;
    pointerRef.current = { x: world.hx, y: world.hy };
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    const pedX = stage.pedestalX;
    const pedRect = { x: pedX - pedW / 2, y: PED_TOP, w: pedW, h: GROUND_Y - PED_TOP };
    const zone = { x: pedX - pedW / 2 - 12, y: PED_TOP - 78, w: pedW + 24, h: 98 };

    const keyPress = keys.consumePress('action');
    const pointerPress = pressRef.current;
    pressRef.current = false;
    const pressed = keyPress || pointerPress;

    if (dt > 0 && !world.finished && world.phase === 'ready') {
      world.tone = lerp(world.tone, 0, Math.min(1, dt * 5));
      if (pressed) {
        world.phase = 'play';
        world.tx = world.hx;
        world.ty = world.hy;
        pointerRef.current = { x: world.hx, y: world.hy };
      }
    } else if (dt > 0 && !world.finished) {
      // 목표점 옮기기 — 방향키가 눌려 있으면 마우스보다 우선한다.
      const kx = (keys.held.current.right ? 1 : 0) - (keys.held.current.left ? 1 : 0);
      const ky = (keys.held.current.down ? 1 : 0) - (keys.held.current.up ? 1 : 0);
      if (kx !== 0 || ky !== 0) {
        const len = Math.hypot(kx, ky) || 1;
        world.tx += (kx / len) * keySpeed * dt;
        world.ty += (ky / len) * keySpeed * dt;
        pointerRef.current = { x: world.tx, y: world.ty };
      } else {
        const step = pointerSpeed * dt;
        const dx = pointerRef.current.x - world.tx;
        const dy = pointerRef.current.y - world.ty;
        const d = Math.hypot(dx, dy);
        if (d > step) {
          world.tx += (dx / d) * step;
          world.ty += (dy / d) * step;
        } else {
          world.tx = pointerRef.current.x;
          world.ty = pointerRef.current.y;
        }
      }
      world.tx = clamp(world.tx, 44, 916);
      world.ty = clamp(world.ty, 130, 500);
      const reachD = dist(SHOULDER.x, SHOULDER.y, world.tx, world.ty);
      if (reachD > REACH) {
        world.tx = SHOULDER.x + ((world.tx - SHOULDER.x) / reachD) * REACH;
        world.ty = SHOULDER.y + ((world.ty - SHOULDER.y) / reachD) * REACH;
      }

      /* 손은 목표에 붙어 있지 않고 스프링으로 끌려간다. 무거운 물건을 들면 되돌아오는
         힘과 감쇠가 함께 약해져, 같은 조작에도 더 크고 느리게 출렁인다. */
      const load = world.carry >= 0 ? stage.items[world.carry].weight : 1;
      const stiff = (9.5 * tuning.speed) / load;
      const damp = 4.4 / Math.sqrt(load);
      world.hvx += ((world.tx - world.hx) * stiff - world.hvx * damp) * dt;
      world.hvy += ((world.ty - world.hy) * stiff - world.hvy * damp) * dt;
      world.hvx = clamp(world.hvx, -900, 900);
      world.hvy = clamp(world.hvy, -900, 900);
      world.hx += world.hvx * dt;
      world.hy += world.hvy * dt;

      const handD = dist(SHOULDER.x, SHOULDER.y, world.hx, world.hy);
      if (handD > REACH) {
        world.hx = SHOULDER.x + ((world.hx - SHOULDER.x) / handD) * REACH;
        world.hy = SHOULDER.y + ((world.hy - SHOULDER.y) / handD) * REACH;
        world.hvx *= 0.4;
        world.hvy *= 0.4;
      }
      world.hx = clamp(world.hx, 40, 920);
      world.hy = clamp(world.hy, 126, 506);

      // 팔꿈치 — 아래로 처지려는 점을 두 마디 길이로 반복해 붙잡아 흐느적거림을 만든다.
      const prevEx = world.ex;
      const prevEy = world.ey;
      world.evy += 420 * dt;
      world.evx *= 0.96;
      world.evy *= 0.96;
      world.ex += world.evx * dt;
      world.ey += world.evy * dt;
      for (let i = 0; i < 3; i += 1) {
        const a = pinLength(world.ex, world.ey, SHOULDER.x, SHOULDER.y, UPPER);
        world.ex = a[0];
        world.ey = a[1];
        const b = pinLength(world.ex, world.ey, world.hx, world.hy, FORE);
        world.ex = b[0];
        world.ey = b[1];
      }
      world.evx = clamp((world.ex - prevEx) / Math.max(dt, 0.008), -900, 900) * 0.9;
      world.evy = clamp((world.ey - prevEy) / Math.max(dt, 0.008), -900, 900) * 0.9;

      world.tone = lerp(world.tone, Math.hypot(world.hvx, world.hvy), Math.min(1, dt * 6));
      const tooFast = world.tone > limit;

      if (world.carry >= 0) {
        const item = world.items[world.carry];
        item.x = world.hx;
        item.y = world.hy;
        world.carryTime += dt;
        world.rough = Math.max(0, world.rough + (tooFast ? dt : -dt * 0.9));

        /* 집자마자의 짧은 순간은 판정에서 빼 둔다. 탁자에 놓인 물건을 잡는 순간이
           곧바로 부딪힘으로 읽히면 학생은 이유를 알 수 없다. */
        const overTable = item.x > TABLE_X - itemR && item.x < TABLE_X + TABLE_W + itemR;
        const scraped = overTable && item.y + itemR > TABLE_TOP + 4;
        const bumpedPed = circleRectHit(item.x, item.y, itemR, pedRect);
        if (world.rough > patience || (world.carryTime > 0.32 && tooFast && (scraped || bumpedPed))) {
          dropCarried(world);
        }
      } else {
        world.rough = Math.max(0, world.rough - dt);
      }

      if (pressed && world.phase === 'play') {
        if (world.carry >= 0) {
          const item = world.items[world.carry];
          if (pointInRect(item.x, item.y, zone) && !tooFast) {
            // 존중하는 속도로 받침대에 놓았다. 놓인 물건은 받침대 위에 남는다.
            item.phase = 'done';
            item.x = pedX + (world.delivered - 1) * (pedW / 3);
            item.y = PED_TOP - itemR * 0.8 - 3;
            item.vx = 0;
            item.vy = 0;
            world.carry = -1;
            world.delivered += 1;
            world.rough = 0;
            playSound('confirm');
          } else if (pointInRect(item.x, item.y, zone)) {
            dropCarried(world);
          } else {
            item.phase = 'falling';
            item.vx = 0;
            item.vy = 0;
            world.carry = -1;
          }
        } else {
          let best = -1;
          let bestD = itemR + 24 * tuning.size;
          world.items.forEach((item, index) => {
            if (item.phase !== 'table') return;
            const d = dist(world.hx, world.hy, item.x, item.y);
            if (d < bestD) {
              bestD = d;
              best = index;
            }
          });
          if (best >= 0) {
            world.items[best].phase = 'carried';
            world.carry = best;
            world.carryTime = 0;
            playSound('select');
          }
        }
      }

      world.timeLeft = Math.max(0, world.timeLeft - dt);
    }

    // 떨어진 물건과 흔들림은 준비 상태에서도 이어져야 장면이 끊기지 않는다.
    if (dt > 0 && !world.finished) {
      for (const item of world.items) {
        if (item.phase !== 'falling') continue;
        item.vy += 900 * dt;
        item.x += item.vx * dt;
        item.y += item.vy * dt;
        if (item.y >= TABLE_TOP - itemR) {
          item.y = TABLE_TOP - itemR;
          // 손이 닿지 않는 곳에 떨어지면 판이 막히므로 반드시 탁자 위로 되돌린다.
          item.x = clamp(item.x, TABLE_X + itemR + 8, TABLE_X + TABLE_W - itemR - 8);
          item.vx = 0;
          item.vy = 0;
          item.phase = 'table';
        }
      }
      world.shake = Math.max(0, world.shake - dt);

      const sec = Math.ceil(world.timeLeft);
      if (sec !== hud.sec || world.delivered !== hud.delivered || world.lives !== hud.lives) {
        setHud({ delivered: world.delivered, lives: world.lives, sec });
      }

      if (world.delivered >= world.items.length) {
        world.finished = true;
        game.succeed(`세 가지를 모두 고른 손으로 ${stage.receiver}에게 건넸어요. 사람에게 부탁할 때도 이렇게 말합니다.`);
      } else if (world.lives <= 0) {
        world.finished = true;
        game.fail('물건이 떨어졌어요. 손을 더 천천히 고르게 움직여 오른쪽 표현을 켜 두세요.');
      } else if (world.timeLeft <= 0) {
        world.finished = true;
        game.fail('시간이 지났어요. 방향키로 옮기면 속도가 고르게 지켜집니다.');
      }
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    ctx.save();
    if (world.shake > 0 && !reduced) ctx.translate(Math.sin(world.shake * 46) * 6, 0);

    ctx.strokeStyle = BOARD.line;
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(WORLD_W, GROUND_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    panel(ctx, TABLE_X, TABLE_TOP, TABLE_W, GROUND_Y - TABLE_TOP, BOARD.surface, BOARD.line, 12);

    // 받침대 — 물건을 든 채 다가가면 테두리 색으로 지금 속도가 괜찮은지 먼저 알린다.
    const carried = world.carry >= 0 ? world.items[world.carry] : null;
    const nearZone = carried ? pointInRect(carried.x, carried.y, zone) : false;
    const fastNow = world.tone > limit;
    const pedEdge = nearZone ? (fastNow ? PLAY.hazard : PLAY.goal) : PLAY.info;
    panel(ctx, pedX - pedW / 2, PED_TOP, pedW, GROUND_Y - PED_TOP, BOARD.surface, pedEdge, 12);
    centerText(ctx, '받침대', pedX, GROUND_Y + 24, 22, BOARD.inkDim);

    // 받는 사람
    panel(ctx, 772, 336, 80, GROUND_Y - 336, BOARD.surface, PLAY.info, 16);
    ctx.fillStyle = BOARD.surface;
    ctx.beginPath();
    ctx.arc(812, 300, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PLAY.info;
    ctx.lineWidth = 3;
    ctx.stroke();
    centerText(ctx, stage.receiverEmoji, 812, 302, 34, BOARD.ink);
    centerText(ctx, stage.receiver, 812, GROUND_Y + 24, 22, BOARD.inkDim);

    // 몸통과 머리 — 팔보다 먼저 그려 팔이 앞으로 나오게 한다.
    panel(ctx, 48, 252, 104, GROUND_Y - 252, BOARD.surface, BOARD.line, 18);
    ctx.fillStyle = BOARD.surface;
    ctx.beginPath();
    ctx.arc(100, 218, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = BOARD.line;
    ctx.stroke();
    centerText(ctx, '🙂', 100, 220, 36, BOARD.ink);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(SHOULDER.x, SHOULDER.y);
    ctx.lineTo(world.ex, world.ey);
    ctx.lineTo(world.hx, world.hy);
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.lineWidth = 20;
    ctx.stroke();
    ctx.strokeStyle = PLAY.hero;
    ctx.lineWidth = 11;
    ctx.stroke();
    for (const joint of [[world.ex, world.ey, 13], [world.hx, world.hy, 18]]) {
      ctx.fillStyle = PLAY.hero;
      ctx.beginPath();
      ctx.arc(joint[0], joint[1], joint[2], 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PLAY.heroEdge;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    world.items.forEach((item, index) => {
      const r = item.phase === 'done' ? itemR * 0.8 : itemR;
      const edge = item.phase === 'done'
        ? PLAY.goal
        : item.phase === 'carried' ? (fastNow ? PLAY.hazard : PLAY.goal) : PLAY.extra;
      panel(ctx, item.x - r, item.y - r, r * 2, r * 2, BOARD.surface, edge, 10);
      centerText(ctx, stage.items[index].emoji, item.x, item.y + 1, r * 1.2, BOARD.ink);
      if (item.phase === 'table') {
        centerText(ctx, stage.items[index].name, item.x, item.y + r + 20, 20, BOARD.inkDim);
      }
    });

    // 손 속도 막대 — 숫자를 못 읽어도 색과 길이로 지금의 말투가 보인다.
    const gx = 44;
    const gy = 486;
    const gw = 340;
    const gh = 24;
    panel(ctx, gx, gy, gw, gh, BOARD.overlay, BOARD.line, 10);
    ctx.fillStyle = fastNow ? PLAY.hazard : PLAY.goal;
    fillRoundRect(ctx, gx + 4, gy + 4, (gw - 8) * clamp(world.tone / (limit * 1.6), 0, 1), gh - 8, 8);
    ctx.strokeStyle = BOARD.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(gx + 4 + (gw - 8) * 0.625, gy - 6);
    ctx.lineTo(gx + 4 + (gw - 8) * 0.625, gy + gh + 6);
    ctx.stroke();
    centerText(ctx, '손 속도', gx + 52, gy - 22, 22, BOARD.inkDim);

    if (world.phase === 'ready' && !world.finished) {
      panel(ctx, 300, 132, 420, 66, BOARD.overlay, PLAY.hero, 16);
      centerText(
        ctx,
        world.lives < tuning.lives ? '누르면 다시 시작합니다' : '누르면 시작합니다',
        510, 165, 26, BOARD.ink,
      );
    }
    ctx.restore();

    // 같은 부탁의 두 표현 — 읽을 글은 여기 한 곳에만 두고 흔들림에서도 제외한다.
    panel(ctx, 40, 12, 420, 82, BOARD.overlay, fastNow ? PLAY.hazard : BOARD.line, 14);
    ctx.fillStyle = fastNow ? PLAY.hazard : BOARD.line;
    ctx.beginPath();
    ctx.arc(74, 36, 12, 0, Math.PI * 2);
    ctx.fill();
    centerText(ctx, '거친 말', 136, 37, 22, fastNow ? BOARD.ink : BOARD.inkDim);
    centerText(ctx, stage.rough, 250, 70, 27, fastNow ? BOARD.ink : BOARD.inkDim);

    panel(ctx, 500, 12, 420, 82, BOARD.overlay, fastNow ? BOARD.line : PLAY.goal, 14);
    ctx.fillStyle = fastNow ? BOARD.line : PLAY.goal;
    ctx.beginPath();
    ctx.arc(534, 36, 12, 0, Math.PI * 2);
    ctx.fill();
    centerText(ctx, '존중하는 말', 616, 37, 22, fastNow ? BOARD.inkDim : BOARD.ink);
    centerText(ctx, stage.kind, 710, 70, 27, fastNow ? BOARD.inkDim : BOARD.ink);
  };

  return (
    <MiniGameFrame
      badge="흔들 팔로 건네기"
      instruction={`마우스를 천천히 움직이거나 방향키로 손을 옮기고, 스페이스나 클릭으로 물건을 집어 ${stage.receiver} 앞 받침대에 놓으세요. 손이 빠르면 왼쪽 거친 말이 켜집니다.`}
      progress={{ label: '건넨 물건', value: hud.delivered, max: stage.items.length }}
      hud={<GameHud lives={hud.lives} maxLives={tuning.lives} timeLeft={hud.sec} timeTotal={totalTime} />}
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
              pointerRef.current = { x: pointer.x, y: pointer.y };
              if (pointer.phase === 'down') pressRef.current = true;
            }}
            ariaLabel={`흔들리는 팔을 고르게 움직여 물건을 ${stage.receiver}에게 건네는 놀이. 남은 기회 ${hud.lives}개, 건넨 물건 ${hud.delivered}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
