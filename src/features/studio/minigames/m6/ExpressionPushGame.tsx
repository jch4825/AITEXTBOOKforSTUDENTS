import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, createRandom, drawBar, drawGhost, drawPop,
  drawShape, drawTag, paintBoard, particleFor, randRange, shuffle, useCountdown, useGameKeys,
} from '../engine';
import type { ShapeKind } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m6-l9 · 말 건네 보내기 (장르 33 · 밀쳐내기)
 *
 * 판의 네 벽에 문이 하나씩 있고, 문마다 모양이 하나 붙어 있다. 판 위의 말 조각에도 모양이
 * 그려져 있다. 판을 누르면 노랑 원이 그 자리로 달려가고, 가는 길에 부딪친 조각을 밀어낸다.
 * 조각을 같은 모양의 문으로 밀어 넣으면 보내진다. **당구처럼 어디서 부딪칠지가 실력이다.**
 *
 * 다른 문은 조각을 튕겨 낼 뿐 기회를 깎지 않는다. 처음에는 다른 문에 세게 부딪히면 기회를 하나
 * 잃게 했는데, 맞는 문을 노리고 쳐도 조각이 벽을 맞고 튀어 옆 문에 닿았다. 시험해 보니 네 조각
 * 가운데 셋을 보내는 사이에 기회 셋이 다 사라졌다. 솜씨가 아니라 튕김의 운으로 지는 판이라
 * 벌을 걷고 시간으로만 진다.
 *
 * 누르기 하나로 끝난다. 원을 끌고 다니게 하면 손가락이 원을 가려 조각이 어디로 튈지 안
 * 보이고, 누른 채로 있어야 하는 조작은 손이 불편한 학생에게 닫힌다. 누른 자리에는 점선 원이
 * 남아 원이 어디로 가는지 보인다.
 *
 * 차시와의 연결은 소재 수준이다. 문에는 네 가지 표현(인사·다시 말해 달라·도움 요청·거절)이,
 * 조각에는 그 말이 필요한 짧은 상황이 적혀 있다. 글을 못 읽어도 모양으로 맞춘다.
 *
 * 같은 장르를 쓰는 m4-l4(요구 밀어내기)와 조작이 다르다. m4-l4는 방향키로 몸을 몰아 위험한 공을
 * 판 밖으로 떨어뜨리고 안전한 공은 가운데 원에 남기는 판이다. 여기는 떨어뜨릴 곳이 없고 벽이
 * 공을 튕겨 낸다. 목표는 가장자리 전체가 아니라 모양이 맞는 좁은 문 하나다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

/** 판(벽 안쪽). 네 귀퉁이는 비스듬히 깎아 조각이 구석에 박혀 꼼짝 못 하는 일을 막는다. */
const AX = 150;
const AY = 84;
const AR = 810;
const AB = 456;
const CHAMFER = 56;
const CX = (AX + AR) / 2;
const CY = (AY + AB) / 2;

const PIECE_R = 50;
const PLAYER_R = 32;
const PLAYER_SPEED = 560;
/** 부딪친 조각은 원보다 조금 빠르게 튀어 나간다. 밀기가 아니라 치기의 손맛이 난다. */
const KICK = 1.15;
/** 1초 뒤 남는 속도의 비율. 조각은 300px쯤 미끄러지다 선다. */
const FRICTION = 0.12;
/** 맞는 문 가까이 온 조각을 문 쪽으로 끄는 거리와 힘. 문 앞에서 한 뼘 모자라 멈춘 조각을
    다시 치러 돌아가는 일이 반복되면 넣는 맛보다 헛걸음이 남는다. */
const PULL_RANGE = 130;
const PULL = 900;
const WALL_BOUNCE = 0.7;
const PIECE_BOUNCE = 0.9;
/** 이보다 세게 다른 문에 부딪혀야 "다른 문이에요"를 띄운다. 문에 기대어 멈춘 조각까지 알리지 않는다. */
const WRONG_HIT = 90;

type Side = 'left' | 'top' | 'right' | 'bottom';

interface DoorSpec {
  side: Side;
  say: string;
  shape: ShapeKind;
}

const DOORS: DoorSpec[] = [
  { side: 'left', say: '안녕하세요', shape: 'ring' },
  { side: 'top', say: '다시 말해 주세요', shape: 'semicircle' },
  { side: 'right', say: '도와주세요', shape: 'cross' },
  { side: 'bottom', say: '괜찮아요, 안 할래요', shape: 'bar' },
];

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  seconds: number;
  /** 문 번호별 상황. 조각 하나가 상황 하나다. */
  pieces: Array<[number, string]>;
  /** 판 가운데 기둥. 조각을 튕겨 돌려보내는 벽이 된다. */
  pillars: Array<{ x: number; y: number; s: number }>;
  playerStart: { x: number; y: number };
}

const STAGES: StageConfig[] = [
  {
    id: 'shop',
    label: '기본',
    scene: '가게에서',
    spoken: '조각의 모양과 같은 모양의 문으로 밀어 보내요.',
    seconds: 45,
    pieces: [[0, '들어갈 때'], [1, '빠른 설명'], [2, '못 찾음'], [3, '억지 권유']],
    pillars: [],
    playerStart: { x: CX, y: CY },
  },
  {
    id: 'stop',
    label: '1단계',
    scene: '정류장에서',
    spoken: '가운데 기둥에 튕기지 않게 밀어 보내요.',
    seconds: 70,
    pieces: [[0, '기사님께'], [1, '안내 방송'], [2, '길 모름'], [3, '낯선 부탁'], [2, '버스 모름'], [3, '같이 가재']],
    pillars: [{ x: CX, y: CY, s: 64 }],
    playerStart: { x: CX, y: AB - 60 },
  },
  {
    id: 'park',
    label: '2단계',
    scene: '공원에서',
    spoken: '조각이 여덟 개예요. 기둥 사이로 밀어 보내요.',
    seconds: 100,
    pieces: [
      [0, '친구 만남'], [0, '헤어질 때'], [1, '못 들음'], [1, '어려운 말'],
      [2, '다쳤을 때'], [2, '길 잃음'], [3, '싫은 놀이'], [3, '간식 권유'],
    ],
    pillars: [{ x: CX - 150, y: CY, s: 56 }, { x: CX + 150, y: CY, s: 56 }],
    playerStart: { x: CX, y: CY },
  },
];

interface Seg {
  ax: number; ay: number; bx: number; by: number;
  /** 문 판이면 그 문 번호. 맞는 조각에게는 열려 있다. */
  door: number;
}

interface Piece {
  x: number; y: number; vx: number; vy: number;
  door: number;
  label: string;
  sent: boolean;
  /** 다른 문에 부딪힌 뒤 다시 알리지 않는 시간이자 붉게 두르는 시간 */
  cool: number;
}

interface World {
  pieces: Piece[];
  px: number; py: number; pvx: number; pvy: number;
  target: { x: number; y: number } | null;
  /** 누른 자리로 가다가 막혀 가까워지지 못한 시간과, 그동안 가장 가까웠던 거리 */
  stuck: number;
  bestGap: number;
  walls: Seg[];
  flash: Array<number>;
  pops: Array<{ text: string; x: number; y: number; t: number; wrong: boolean }>;
  started: boolean;
  finished: boolean;
}

const POP_TIME = 0.8;

/** 문 판의 양 끝. 문 폭은 지원 수준에 따라 달라진다. */
function doorSpan(side: Side, scale: number) {
  const half = (side === 'top' || side === 'bottom' ? 100 : 82) * scale;
  switch (side) {
    case 'left': return { ax: AX, ay: CY - half, bx: AX, by: CY + half };
    case 'right': return { ax: AR, ay: CY - half, bx: AR, by: CY + half };
    case 'top': return { ax: CX - half, ay: AY, bx: CX + half, by: AY };
    default: return { ax: CX - half, ay: AB, bx: CX + half, by: AB };
  }
}

function buildWalls(stage: StageConfig, scale: number): Seg[] {
  const segs: Seg[] = [];
  const add = (ax: number, ay: number, bx: number, by: number, door = -1) => segs.push({ ax, ay, bx, by, door });
  const left = doorSpan('left', scale);
  const right = doorSpan('right', scale);
  const top = doorSpan('top', scale);
  const bottom = doorSpan('bottom', scale);

  add(AX + CHAMFER, AY, top.ax, AY); add(top.bx, AY, AR - CHAMFER, AY);
  add(AR - CHAMFER, AY, AR, AY + CHAMFER);
  add(AR, AY + CHAMFER, AR, right.ay); add(AR, right.by, AR, AB - CHAMFER);
  add(AR, AB - CHAMFER, AR - CHAMFER, AB);
  add(AR - CHAMFER, AB, bottom.bx, AB); add(bottom.ax, AB, AX + CHAMFER, AB);
  add(AX + CHAMFER, AB, AX, AB - CHAMFER);
  add(AX, AB - CHAMFER, AX, left.by); add(AX, left.ay, AX, AY + CHAMFER);
  add(AX, AY + CHAMFER, AX + CHAMFER, AY);

  DOORS.forEach((door, index) => {
    const span = doorSpan(door.side, scale);
    add(span.ax, span.ay, span.bx, span.by, index);
  });

  for (const pillar of stage.pillars) {
    const h = pillar.s / 2;
    add(pillar.x - h, pillar.y - h, pillar.x + h, pillar.y - h);
    add(pillar.x + h, pillar.y - h, pillar.x + h, pillar.y + h);
    add(pillar.x + h, pillar.y + h, pillar.x - h, pillar.y + h);
    add(pillar.x - h, pillar.y + h, pillar.x - h, pillar.y - h);
  }
  return segs;
}

/** 원과 선분이 겹치면 밀어낼 방향과 깊이를 돌려준다. */
function segmentPush(seg: Seg, x: number, y: number, r: number) {
  const dx = seg.bx - seg.ax;
  const dy = seg.by - seg.ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 > 0 ? clamp(((x - seg.ax) * dx + (y - seg.ay) * dy) / len2, 0, 1) : 0;
  const qx = seg.ax + dx * t;
  const qy = seg.ay + dy * t;
  const d = Math.hypot(x - qx, y - qy);
  if (d >= r) return null;
  if (d < 0.001) {
    // 선분 위에 정확히 놓였으면 판 가운데 쪽으로 민다.
    const nx = CX - x;
    const ny = CY - y;
    const nd = Math.hypot(nx, ny) || 1;
    return { nx: nx / nd, ny: ny / nd, depth: r };
  }
  return { nx: (x - qx) / d, ny: (y - qy) / d, depth: r - d };
}

function crossedDoor(piece: Piece): number {
  if (piece.x < AX) return DOORS.findIndex((d) => d.side === 'left');
  if (piece.x > AR) return DOORS.findIndex((d) => d.side === 'right');
  if (piece.y < AY) return DOORS.findIndex((d) => d.side === 'top');
  if (piece.y > AB) return DOORS.findIndex((d) => d.side === 'bottom');
  return -1;
}

function doorCenter(index: number, scale: number) {
  const span = doorSpan(DOORS[index].side, scale);
  return { x: (span.ax + span.bx) / 2, y: (span.ay + span.by) / 2 };
}

export default function ExpressionPushGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 문의 폭과 시간으로 나타난다. 조각과 기둥의 자리는 셋 모두 같다. */
  const doorScale = clamp(tuning.size, 0.86, 1.2);
  const seconds = Math.round(stage.seconds * clamp(tuning.time, 0.8, 1.5));
  const total = stage.pieces.length;

  const keys = useGameKeys(game.playing);

  const build = (): World => {
    const random = createRandom(game.seed);
    const placed: Piece[] = [];
    const order = shuffle(random, stage.pieces);
    for (const [door, label] of order) {
      let x = CX;
      let y = CY;
      for (let tries = 0; tries < 60; tries += 1) {
        x = randRange(random, AX + PIECE_R + 40, AR - PIECE_R - 40);
        y = randRange(random, AY + PIECE_R + 30, AB - PIECE_R - 30);
        const clearOfPieces = placed.every((p) => Math.hypot(p.x - x, p.y - y) > PIECE_R * 2 + 24);
        const clearOfPlayer = Math.hypot(stage.playerStart.x - x, stage.playerStart.y - y) > PIECE_R + PLAYER_R + 50;
        const clearOfPillars = stage.pillars.every((pl) => Math.hypot(pl.x - x, pl.y - y) > PIECE_R + pl.s);
        const mouth = doorCenter(door, doorScale);
        const awayFromOwnDoor = Math.hypot(mouth.x - x, mouth.y - y) > PULL_RANGE + 60;
        if (clearOfPieces && clearOfPlayer && clearOfPillars && awayFromOwnDoor) break;
      }
      placed.push({ x, y, vx: 0, vy: 0, door, label, sent: false, cool: 0 });
    }
    return {
      pieces: placed,
      px: stage.playerStart.x, py: stage.playerStart.y, pvx: 0, pvy: 0,
      target: null,
      stuck: 0,
      bestGap: Infinity,
      walls: buildWalls(stage, doorScale),
      flash: DOORS.map(() => 0),
      pops: [],
      started: false,
      finished: false,
    };
  };

  const worldRef = useRef<World>(build());
  const [view, setView] = useState({ sent: 0, started: false, left: '' });

  const describe = (w: World) => w.pieces
    .filter((p) => !p.sent)
    .map((p) => `${p.label}${particleFor(p.label, '은', '는')} ${DOORS[p.door].say} 문`)
    .join(', ');

  useEffect(() => {
    const w = build();
    worldRef.current = w;
    setView({ sent: 0, started: false, left: describe(w) });
  }, [game.round, game.stageIndex, stage, game.seed, doorScale]);

  const timeLeft = useCountdown(game.playing && view.started, seconds, game.round * 10 + game.stageIndex, () => {
    const w = worldRef.current;
    if (w.finished) return;
    w.finished = true;
    game.fail('시간이 다 됐어요. 조각 뒤쪽을 눌러 문 쪽으로 밀어 봐요.');
  });

  const start = (w: World) => {
    if (w.started) return;
    w.started = true;
    setView((prev: { sent: number; started: boolean; left: string }) => ({ ...prev, started: true }));
  };

  const step = (w: World, dt: number) => {
    // 노랑 원 — 방향키가 눌려 있으면 그쪽으로, 아니면 누른 자리로 간다.
    const kx = (keys.held.current.left ? -1 : 0) + (keys.held.current.right ? 1 : 0);
    const ky = (keys.held.current.up ? -1 : 0) + (keys.held.current.down ? 1 : 0);
    let vx = 0;
    let vy = 0;
    if (kx !== 0 || ky !== 0) {
      start(w);
      w.target = null;
      const len = Math.hypot(kx, ky);
      vx = (kx / len) * PLAYER_SPEED;
      vy = (ky / len) * PLAYER_SPEED;
    } else if (w.target) {
      const dx = w.target.x - w.px;
      const dy = w.target.y - w.py;
      const d = Math.hypot(dx, dy);
      if (d < PLAYER_SPEED * dt) {
        w.px = w.target.x;
        w.py = w.target.y;
        w.target = null;
      } else {
        vx = (dx / d) * PLAYER_SPEED;
        vy = (dy / d) * PLAYER_SPEED;
      }
    }
    w.px += vx * dt;
    w.py += vy * dt;
    w.pvx = vx;
    w.pvy = vy;

    // 조각 — 미끄러지다 선다. 맞는 문 앞에서는 문으로 끌려 들어간다.
    const keep = Math.pow(FRICTION, dt);
    for (const p of w.pieces) {
      if (p.sent) continue;
      const mouth = doorCenter(p.door, doorScale);
      const toX = mouth.x - p.x;
      const toY = mouth.y - p.y;
      const gap = Math.hypot(toX, toY);
      if (gap < PULL_RANGE && gap > 0.001) {
        p.vx += (toX / gap) * PULL * dt;
        p.vy += (toY / gap) * PULL * dt;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= keep;
      p.vy *= keep;
      if (Math.hypot(p.vx, p.vy) < 6) { p.vx = 0; p.vy = 0; }
      p.cool = Math.max(0, p.cool - dt);
    }

    // 원이 조각을 친다.
    for (const p of w.pieces) {
      if (p.sent) continue;
      const dx = p.x - w.px;
      const dy = p.y - w.py;
      const d = Math.hypot(dx, dy) || 0.001;
      const overlap = PIECE_R + PLAYER_R - d;
      if (overlap <= 0) continue;
      const nx = dx / d;
      const ny = dy / d;
      p.x += nx * overlap;
      p.y += ny * overlap;
      const pieceN = p.vx * nx + p.vy * ny;
      const playerN = w.pvx * nx + w.pvy * ny;
      if (playerN > 0 && playerN * KICK > pieceN) {
        p.vx += nx * (playerN * KICK - pieceN);
        p.vy += ny * (playerN * KICK - pieceN);
        if (playerN > 200) playSound('select');
      } else if (pieceN < 0) {
        // 멈춘 원에 굴러와 부딪치면 튕겨 나간다.
        p.vx -= (1 + WALL_BOUNCE) * pieceN * nx;
        p.vy -= (1 + WALL_BOUNCE) * pieceN * ny;
      }
    }

    // 조각끼리
    const live = w.pieces.filter((p) => !p.sent);
    for (let i = 0; i < live.length; i += 1) {
      for (let j = i + 1; j < live.length; j += 1) {
        const a = live[i];
        const b = live[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const overlap = PIECE_R * 2 - d;
        if (overlap <= 0) continue;
        const nx = dx / d;
        const ny = dy / d;
        a.x -= nx * overlap / 2; a.y -= ny * overlap / 2;
        b.x += nx * overlap / 2; b.y += ny * overlap / 2;
        const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rel < 0) {
          const j2 = (-(1 + PIECE_BOUNCE) * rel) / 2;
          a.vx -= j2 * nx; a.vy -= j2 * ny;
          b.vx += j2 * nx; b.vy += j2 * ny;
        }
      }
    }

    // 벽과 문
    for (const p of live) {
      for (const seg of w.walls) {
        if (seg.door === p.door) continue; // 맞는 문은 열려 있다
        const hit = segmentPush(seg, p.x, p.y, PIECE_R);
        if (!hit) continue;
        p.x += hit.nx * hit.depth;
        p.y += hit.ny * hit.depth;
        const vn = p.vx * hit.nx + p.vy * hit.ny;
        if (vn < 0) {
          p.vx -= (1 + WALL_BOUNCE) * vn * hit.nx;
          p.vy -= (1 + WALL_BOUNCE) * vn * hit.ny;
          if (seg.door >= 0 && -vn > WRONG_HIT && p.cool <= 0) {
            p.cool = 1;
            w.flash[seg.door] = 0.7;
            const c = doorCenter(seg.door, doorScale);
            w.pops.push({ text: '다른 문이에요', x: clamp(c.x, 190, 770), y: clamp(c.y, 130, 410), t: POP_TIME, wrong: true });
            playSound('select');
          }
        }
      }
      const door = crossedDoor(p);
      if (door >= 0 && door === p.door) {
        p.sent = true;
        const c = doorCenter(door, doorScale);
        w.pops.push({ text: '딱 맞아요!', x: clamp(c.x, 190, 770), y: clamp(c.y, 130, 410), t: POP_TIME, wrong: false });
        playSound('stamp');
      }
    }

    // 원은 벽 안에 머문다. 조각과 벽 사이에 끼면 원이 물러난다.
    for (const seg of w.walls) {
      const hit = segmentPush(seg, w.px, w.py, PLAYER_R);
      if (hit) { w.px += hit.nx * hit.depth; w.py += hit.ny * hit.depth; }
    }
    for (const p of w.pieces) {
      if (p.sent) continue;
      const d = Math.hypot(p.x - w.px, p.y - w.py) || 0.001;
      const overlap = PIECE_R + PLAYER_R - d;
      if (overlap > 0) {
        w.px -= ((p.x - w.px) / d) * overlap;
        w.py -= ((p.y - w.py) / d) * overlap;
      }
    }

    /* 기둥이나 벽에 낀 조각에 막혀 누른 자리에 가까워지지 못하면 가던 자리를 내려놓는다. 두면
       원이 막힌 자리에서 떨고, 점선 원이 남아 "아직 가는 중"처럼 보인다. 한 걸음의 움직임으로
       재면 밀고 밀리며 떠는 원이 움직이는 것으로 잡혀서, 목표까지의 거리가 줄었는지로 잰다. */
    if (w.target) {
      const gap = Math.hypot(w.target.x - w.px, w.target.y - w.py);
      if (gap < w.bestGap - 4) {
        w.bestGap = gap;
        w.stuck = 0;
      } else {
        w.stuck += dt;
        if (w.stuck > 0.4) { w.target = null; w.stuck = 0; }
      }
    }

    for (let i = 0; i < w.flash.length; i += 1) w.flash[i] = Math.max(0, w.flash[i] - dt);
    w.pops = w.pops.filter((pop) => { pop.t -= dt; return pop.t > 0; });
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    if (dt > 0 && game.playing && !w.finished) {
      const parts = Math.ceil(dt / 0.012);
      for (let i = 0; i < parts; i += 1) step(w, dt / parts);

      const sent = w.pieces.filter((p) => p.sent).length;
      if (sent >= total) {
        w.finished = true;
        game.succeed('상황마다 알맞은 말의 문으로 조각을 모두 보냈어요!');
      }
      if (sent !== view.sent) {
        setView({ sent, started: w.started, left: describe(w) });
      }
    }

    paintBoard(ctx, WORLD_W, WORLD_H);

    // 판 바닥 — 깎은 귀퉁이까지 한 면으로 칠한다.
    ctx.beginPath();
    ctx.moveTo(AX + CHAMFER, AY);
    ctx.lineTo(AR - CHAMFER, AY);
    ctx.lineTo(AR, AY + CHAMFER);
    ctx.lineTo(AR, AB - CHAMFER);
    ctx.lineTo(AR - CHAMFER, AB);
    ctx.lineTo(AX + CHAMFER, AB);
    ctx.lineTo(AX, AB - CHAMFER);
    ctx.lineTo(AX, AY + CHAMFER);
    ctx.closePath();
    ctx.fillStyle = B.surface;
    ctx.fill();

    // 벽
    ctx.lineCap = 'square';
    for (const seg of w.walls) {
      if (seg.door >= 0) continue;
      ctx.beginPath();
      ctx.moveTo(seg.ax, seg.ay);
      ctx.lineTo(seg.bx, seg.by);
      ctx.lineWidth = STROKE.base;
      ctx.strokeStyle = B.grey;
      ctx.stroke();
    }
    for (const pillar of stage.pillars) {
      drawBar(ctx, pillar.x - pillar.s / 2, pillar.y - pillar.s / 2, pillar.s, pillar.s, {
        fill: B.grey, stroke: B.shadow, width: 2, lift: 4,
      });
    }

    // 문 — 점선이 열린 문, 붉은 실선은 방금 다른 조각을 튕겨 낸 문
    DOORS.forEach((door, index) => {
      const span = doorSpan(door.side, doorScale);
      const wrong = w.flash[index] > 0;
      ctx.save();
      if (!wrong) ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.moveTo(span.ax, span.ay);
      ctx.lineTo(span.bx, span.by);
      ctx.lineWidth = wrong ? STROKE.heavy : STROKE.base;
      ctx.strokeStyle = wrong ? B.red : B.blue;
      ctx.stroke();
      ctx.restore();
      // 문설주
      for (const [jx, jy] of [[span.ax, span.ay], [span.bx, span.by]]) {
        drawBar(ctx, jx - 9, jy - 9, 18, 18, { fill: B.blue, stroke: B.keyline, width: 2 });
      }

      const tagFill = wrong ? B.red : B.blue;
      const tagInk = B.ink;
      if (door.side === 'left' || door.side === 'right') {
        const x = door.side === 'left' ? AX / 2 : (AR + WORLD_W) / 2;
        drawShape(ctx, door.shape, x, CY - 40, 44, { fill: B.blue, stroke: B.keyline, width: 2, lift: 3 });
        drawTag(ctx, door.say, x, CY + 24, { fill: tagFill, ink: tagInk, align: 'center' });
      } else {
        const y = door.side === 'top' ? AY / 2 : (AB + WORLD_H) / 2;
        const tag = drawTag(ctx, door.say, CX + 26, y, { fill: tagFill, ink: tagInk, align: 'center' });
        drawShape(ctx, door.shape, CX + 26 - tag.w / 2 - 34, y, 40, { fill: B.blue, stroke: B.keyline, width: 2, lift: 3 });
      }
    });

    // 누른 자리
    if (w.target) drawGhost(ctx, 'circle', w.target.x, w.target.y, PLAYER_R * 2, B.yellow);

    // 조각
    for (const p of w.pieces) {
      if (p.sent) continue;
      drawShape(ctx, 'circle', p.x, p.y, PIECE_R * 2, {
        fill: B.high, stroke: p.cool > 0 ? B.red : B.grey, width: p.cool > 0 ? STROKE.base : STROKE.hair, lift: 4,
      });
      drawShape(ctx, DOORS[p.door].shape, p.x, p.y - 16, 30, { fill: B.blue, stroke: B.keyline, width: 1 });
      centerText(ctx, p.label, p.x, p.y + 20, 20, B.ink);
    }

    // 노랑 원
    drawShape(ctx, 'circle', w.px, w.py, PLAYER_R * 2, { fill: B.yellow, stroke: B.keyline, width: STROKE.base, lift: 4 });

    for (const pop of w.pops) {
      const grow = Math.min(1, (POP_TIME - pop.t) * 8);
      drawPop(ctx, pop.text, pop.x, pop.y, {
        scale: 0.8 + grow * 0.2, size: 24,
        fill: pop.wrong ? B.red : B.yellow, ink: pop.wrong ? B.ink : B.ground,
      });
    }

    if (!w.started && !w.finished) {
      drawBar(ctx, CX - 230, AY + 18, 460, 56, { fill: B.ground, stroke: B.yellow, width: STROKE.base, lift: 4 });
      centerText(ctx, '누른 곳으로 노랑 원이 달려가요', CX, AY + 46, 24, B.ink);
    }
  };

  const handleTap = (x: number, y: number) => {
    const w = worldRef.current;
    if (!game.playing || w.finished) return;
    start(w);
    w.target = { x: clamp(x, AX + PLAYER_R, AR - PLAYER_R), y: clamp(y, AY + PLAYER_R, AB - PLAYER_R) };
    w.stuck = 0;
    w.bestGap = Infinity;
  };

  return (
    <MiniGameFrame
      badge="말 건네 보내기"
      instruction="판을 누르면 노랑 원이 그곳으로 달려가며 부딪친 조각을 밀어냅니다. 조각에 그려진 모양과 같은 모양의 문으로 밀어 보내 보세요. 다른 문은 조각을 튕겨 냅니다."
      progress={{ label: '보낸 조각', value: view.sent, max: total }}
      hud={<GameHud timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="px-1 text-[15px] font-bold" style={{ color: 'var(--game-ink)' }}>
          {stage.scene} · 조각의 뒤쪽을 누르면 원이 조각을 문 쪽으로 쳐 내요.
        </p>
      }
      actions={<MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') handleTap(pointer.x, pointer.y);
            }}
            ariaLabel={`말 조각을 알맞은 문으로 밀어 보내는 놀이. 남은 조각: ${view.left || '없음'}. 보낸 조각 ${view.sent}개, 남은 시간 ${Math.ceil(timeLeft)}초.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
