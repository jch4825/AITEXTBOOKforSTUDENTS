import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, randRange, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l7 · 모호한 말 베기 (장르 25 · 슬라이싱)
 *
 * "첫 답에서 부족한 곳을 찾아 구체적으로 다시 부탁한다"를 베고 남기는 일로 만든다.
 * 고쳐 쓰기의 어려움은 '무엇을 지울까'가 아니라 '무엇을 남길까'를 함께 정하는 데 있다.
 * 그래서 이 게임은 두 손을 동시에 요구한다 — 회색 구름(모호한 말)은 베어 없애고,
 * 초록 자물쇠(지킬 사실)는 손대지 않고 지나가게 두어야 한다.
 *
 * 지킨 사실은 위쪽 띠에 하나씩 쌓여 다시 부탁할 문장이 된다. 사실을 베어 버리면 그
 * 자리가 빈칸으로 돌아가므로, 문장이 무너지는 모습이 점수보다 먼저 보인다.
 * 놓친 모호한 말에는 벌점이 없다. 서두르다 사실까지 베는 쪽이 더 큰 실수이기 때문이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
/** 위쪽 '다시 부탁' 띠가 차지하는 높이. 조각은 이 아래에서만 논다. */
const BAND_H = 104;
const TARGET_VAGUE = 10;
const FACT_COUNT = 4;
const TRAIL_LIFE = 0.4;
const CUT_LIFE = 0.55;
/** 회색 슬레이트 계열. 형광색을 쓰지 않으면서 어두운 판 위에서 구름이 떠 보이는 밝기다. */
const CLOUD_FILL = '#334155';
const LOCK_FILL = '#14532D';

interface StageConfig {
  id: string;
  label: string;
  ask: string;
  spoken: string;
  /** 사실 넷을 모두 지켰을 때 완성되는 부탁 문장 */
  sentence: string;
  facts: string[];
  vague: string[];
  /** 동시에 떠 있을 수 있는 조각의 기본 수 */
  alive: number;
  /** 새 조각이 튀어 오르는 기본 간격(초) */
  interval: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'homework',
    label: '기본',
    ask: '숙제를 도와 달라고 다시 부탁합니다',
    spoken: '숙제 부탁으로 바꿨어요.',
    sentence: '금요일 2시에 도서관에서 3장을 정리해 주세요',
    facts: ['금요일', '2시', '도서관', '3장'],
    vague: ['그거', '적당히', '아무때나', '많이', '좀'],
    alive: 2,
    interval: 1.1,
  },
  {
    id: 'intro',
    label: '1단계',
    ask: '우리 반 소개 글을 다시 부탁합니다',
    spoken: '반 소개 부탁으로 바꿨어요.',
    sentence: '목요일까지 우리 반을 존댓말 5줄로 소개해 주세요',
    facts: ['목요일', '우리 반', '존댓말', '5줄'],
    vague: ['이따가', '대충', '조금', '알아서', '빨리'],
    alive: 3,
    interval: 0.95,
  },
  {
    id: 'notice',
    label: '2단계',
    ask: '학급 안내문을 다시 부탁합니다',
    spoken: '학급 안내문 부탁으로 바꿨어요.',
    sentence: '화요일 체육관 행사에 20명이 실내화를 챙기도록 안내해 주세요',
    facts: ['화요일', '체육관', '20명', '실내화'],
    vague: ['나중에', '아무거나', '잘', '그쯤', '여러 개'],
    alive: 4,
    interval: 0.82,
  },
];

interface Piece {
  kind: 'vague' | 'fact';
  text: string;
  /** fact이면 띠의 칸 번호, vague이면 -1 */
  slot: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  rot: number;
  /** 0이면 아직 성한 조각, 0보다 크면 베인 뒤 흐른 시간 */
  cut: number;
  cutAngle: number;
}

interface TrailPoint {
  x: number;
  y: number;
  life: number;
  /** 이 점까지의 칼날 두께. 손 궤적보다 스페이스 휘두르기를 두껍게 준다. */
  pad: number;
  /** false면 앞 점과 이어지지 않는다. 새 획의 첫 점이라는 뜻이다. */
  join: boolean;
  checked: boolean;
}

interface World {
  pieces: Piece[];
  trail: TrailPoint[];
  timer: number;
  sliced: number;
  lives: number;
  kept: boolean[];
  /** 사실을 베였을 때 그 칸을 빨갛게 비워 보여 주는 시간 */
  flash: number[];
  shake: number;
  swing: number;
  bladeX: number;
  bladeY: number;
  factCursor: number;
  phase: 'ready' | 'slicing';
  /** 손을 뗐다가 다시 눌러야 재출발한다. 누른 채로 실수하면 곧바로 또 베기 때문이다. */
  armed: boolean;
  finished: boolean;
}

function buildWorld(lives: number): World {
  return {
    pieces: [],
    trail: [],
    timer: 0,
    sliced: 0,
    lives,
    kept: Array.from({ length: FACT_COUNT }, () => false),
    flash: Array.from({ length: FACT_COUNT }, () => 0),
    shake: 0,
    swing: 0,
    bladeX: WORLD_W / 2,
    bladeY: 330,
    factCursor: 0,
    phase: 'ready',
    armed: false,
    finished: false,
  };
}

/** 점에서 선분까지의 거리. 칼자국은 점이 아니라 획이라 이 거리로 판정해야 한다. */
function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / len2, 0, 1);
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}

function drawCloud(ctx: CanvasRenderingContext2D, r: number): void {
  const blobs = [
    [-r * 0.58, r * 0.06, r * 0.6],
    [0, -r * 0.24, r * 0.76],
    [r * 0.6, r * 0.06, r * 0.58],
    [0, r * 0.3, r * 0.58],
  ];
  // 테두리를 전부 먼저 긋고 나중에 채우면 겹친 안쪽 선이 채움에 덮여 바깥 실루엣만 남는다.
  // 원마다 칠하고 긋는 순서로는 구름 속에 동그라미 자국이 비쳐 글자를 읽기 어렵다.
  ctx.strokeStyle = BOARD.line;
  ctx.lineWidth = 6;
  for (const [bx, by, br] of blobs) {
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = CLOUD_FILL;
  for (const [bx, by, br] of blobs) {
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLock(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.strokeStyle = PLAY.goal;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(0, -r * 0.36, r * 0.46, Math.PI, 0);
  ctx.stroke();
  panel(ctx, -r * 1.15, -r * 0.3, r * 2.3, r * 1.24, LOCK_FILL, PLAY.goal, 12);
}

function drawPiece(ctx: CanvasRenderingContext2D, piece: Piece, cx: number, cy: number, withText: boolean): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(piece.rot);
  if (piece.kind === 'vague') drawCloud(ctx, piece.r);
  else drawLock(ctx, piece.r);
  if (withText) {
    // 글자는 크게 유지하되 조각 밖으로 넘치지 않는 선에서만 줄인다.
    const size = clamp(piece.r * 0.55, 20, 27);
    centerText(ctx, piece.text, 0, piece.kind === 'fact' ? piece.r * 0.32 : 0, size, BOARD.ink);
  }
  ctx.restore();
}

export default function VagueSliceGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  // 조각이 화면을 가로지르는 데 최소 2초 넘게 걸리도록 속도 배율에 아래 위 한계를 둔다.
  const speedF = clamp(tuning.speed, 0.78, 1.3);
  const gravity = 320 * speedF * speedF;
  const pieceR = 46 * tuning.size;
  const maxAlive = clamp(Math.round(stage.alive * tuning.density), 2, 6);
  const interval = stage.interval / clamp(tuning.density, 0.85, 1.4);
  const pointerPad = 10 * tuning.tolerance;
  const swingPad = 26 * tuning.tolerance;
  const swingHalf = 140 * clamp(tuning.size, 0.85, 1.3);

  const worldRef = useRef<World>(buildWorld(tuning.lives));
  const randomRef = useRef<() => number>(createRandom(game.seed));
  const downRef = useRef(false);
  const [hud, setHud] = useState({ lives: tuning.lives, sliced: 0, keptMask: 0 });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    worldRef.current = buildWorld(tuning.lives);
    randomRef.current = createRandom(game.seed);
    downRef.current = false;
    setHud({ lives: tuning.lives, sliced: 0, keptMask: 0 });
  }, [game.round, game.stageIndex, stage, tuning.lives, game.seed]);

  /** 조각 하나를 아래에서 튀어 오르게 한다. 남은 사실이 있으면 사실을 먼저 챙긴다. */
  const spawn = (world: World) => {
    const random = randomRef.current;
    const unkept: number[] = [];
    for (let i = 0; i < FACT_COUNT; i += 1) if (!world.kept[i]) unkept.push(i);
    const factFlying = world.pieces.some((piece) => piece.kind === 'fact' && piece.cut === 0);
    // 모호한 말을 다 벤 뒤에는 사실만 올려 보낸다. 그래야 판이 반드시 끝난다.
    const wantFact = unkept.length > 0 && !factFlying
      && (world.sliced >= TARGET_VAGUE || random() < 0.4);

    const slot = wantFact ? unkept[world.factCursor % unkept.length] : -1;
    if (wantFact) world.factCursor += 1;

    const x = randRange(random, 140, WORLD_W - 140);
    const landX = randRange(random, 140, WORLD_W - 140);
    const apexY = randRange(random, BAND_H + 46, 300);
    const rise = WORLD_H + pieceR - apexY;
    const vy = -Math.sqrt(2 * gravity * rise);
    const air = (-2 * vy) / gravity;

    world.pieces.push({
      kind: wantFact ? 'fact' : 'vague',
      text: wantFact ? stage.facts[slot] : stage.vague[Math.floor(random() * stage.vague.length)],
      slot,
      x,
      y: WORLD_H + pieceR,
      vx: (landX - x) / air,
      vy,
      r: pieceR,
      phase: random() * Math.PI * 2,
      rot: 0,
      cut: 0,
      cutAngle: 0,
    });
  };

  /** 칼자국이 조각에 닿았을 때. 사실을 베면 판이 준비 상태로 돌아간다. */
  const sliceHit = (world: World, piece: Piece, angle: number) => {
    piece.cut = 0.0001;
    piece.cutAngle = angle;
    if (piece.kind === 'vague') {
      world.sliced += 1;
      return;
    }
    world.lives -= 1;
    world.kept[piece.slot] = false;
    world.flash[piece.slot] = 1.2;
    world.shake = 0.8;
    world.phase = 'ready';
    world.armed = false;
    world.trail = [];
    // 베인 조각만 남겨 무엇을 잘랐는지 보이게 하고, 나머지는 치워 연속 실수를 막는다.
    world.pieces = world.pieces.filter((item) => item === piece);
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    const pressing = downRef.current || keys.held.current.action;

    if (dt > 0 && !world.finished) {
      // 칼 위치는 어느 상태에서나 옮길 수 있다. 시작 전에 미리 자리를 잡게 하려는 것이다.
      const bladeStep = 430 * speedF * dt;
      if (keys.held.current.left) world.bladeX -= bladeStep;
      if (keys.held.current.right) world.bladeX += bladeStep;
      if (keys.held.current.up) world.bladeY -= bladeStep;
      if (keys.held.current.down) world.bladeY += bladeStep;
      world.bladeX = clamp(world.bladeX, 90, WORLD_W - 90);
      world.bladeY = clamp(world.bladeY, BAND_H + 46, WORLD_H - 70);
      world.swing = Math.max(0, world.swing - dt);
      for (let i = 0; i < FACT_COUNT; i += 1) world.flash[i] = Math.max(0, world.flash[i] - dt);
    }

    if (dt > 0 && !world.finished && world.phase === 'ready') {
      world.shake = Math.max(0, world.shake - dt * 1.5);
      if (!pressing) world.armed = true;
      if (pressing && world.armed && world.shake <= 0) {
        world.phase = 'slicing';
        world.armed = false;
        world.timer = 0;
        // 시작을 알린 그 누름이 곧바로 휘두르기가 되지 않게 한 번 비운다.
        keys.consumePress('action');
      }
      for (const piece of world.pieces) if (piece.cut > 0) piece.cut += dt;
      world.pieces = world.pieces.filter((piece) => piece.cut < CUT_LIFE);
    } else if (dt > 0 && !world.finished) {
      world.timer += dt;
      const alive = world.pieces.filter((piece) => piece.cut === 0).length;
      if (world.timer >= interval && alive < maxAlive) {
        world.timer = 0;
        spawn(world);
      }

      for (const piece of world.pieces) {
        if (piece.cut > 0) {
          piece.cut += dt;
          continue;
        }
        piece.vy += gravity * dt;
        piece.x += piece.vx * dt;
        piece.y += piece.vy * dt;
        // 글자가 읽혀야 하므로 회전은 돌리지 않고 좌우로 살짝 흔들기만 한다.
        piece.phase += dt * 1.6;
        piece.rot = Math.sin(piece.phase) * 0.2;
      }

      // 손대지 않고 내려간 사실은 지켜진 것이다. 지키는 일은 '아무것도 하지 않기'다.
      for (const piece of world.pieces) {
        if (piece.cut > 0 || piece.y < WORLD_H + piece.r + 40) continue;
        if (piece.kind === 'fact' && !world.kept[piece.slot]) {
          world.kept[piece.slot] = true;
          playSound('confirm');
        }
        piece.cut = CUT_LIFE;
      }
      world.pieces = world.pieces.filter((piece) => piece.cut === 0 || piece.cut < CUT_LIFE);

      if (keys.consumePress('action')) {
        // 키보드 휘두르기도 손 궤적과 같은 칼자국 목록에 넣어 판정을 한 곳으로 모은다.
        world.swing = 0.22;
        world.trail.push({ x: world.bladeX - swingHalf, y: world.bladeY, life: TRAIL_LIFE, pad: swingPad, join: false, checked: false });
        world.trail.push({ x: world.bladeX + swingHalf, y: world.bladeY, life: TRAIL_LIFE, pad: swingPad, join: true, checked: false });
      }

      for (let i = 0; i < world.trail.length; i += 1) {
        const point = world.trail[i];
        if (point.checked) continue;
        point.checked = true;
        if (!point.join || i === 0) continue;
        const prev = world.trail[i - 1];
        for (const piece of world.pieces) {
          if (piece.cut > 0) continue;
          if (segDist(piece.x, piece.y, prev.x, prev.y, point.x, point.y) > piece.r + point.pad) continue;
          sliceHit(world, piece, Math.atan2(point.y - prev.y, point.x - prev.x));
          break;
        }
        if (world.phase === 'ready') break;
      }

      for (const point of world.trail) point.life -= dt;
      world.trail = world.trail.filter((point) => point.life > 0);

      if (world.lives <= 0) {
        world.finished = true;
        game.fail('지킬 사실을 베어 기회를 다 썼어요. 초록 자물쇠는 그냥 지나가게 두고 회색 구름만 베어요.');
      } else if (world.sliced >= TARGET_VAGUE && world.kept.every(Boolean)) {
        world.finished = true;
        game.succeed(`모호한 말을 베고 지킬 사실을 남겼어요. 이제 "${stage.sentence}"라고 다시 부탁할 수 있어요.`);
      }
    }

    const keptMask = world.kept.reduce((mask, kept, i) => (kept ? mask | (1 << i) : mask), 0);
    if (world.lives !== hud.lives || world.sliced !== hud.sliced || keptMask !== hud.keptMask) {
      setHud({ lives: world.lives, sliced: world.sliced, keptMask });
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    ctx.save();
    if (world.shake > 0) ctx.translate(Math.sin(world.shake * 44) * 11, Math.cos(world.shake * 37) * 5);

    // 칼 높이 안내선 — 키보드로 하는 학생이 어디를 베는지 알아야 한다.
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 14]);
    ctx.beginPath();
    ctx.moveTo(0, world.bladeY);
    ctx.lineTo(WORLD_W, world.bladeY);
    ctx.stroke();
    ctx.setLineDash([]);

    for (const piece of world.pieces) {
      if (piece.cut === 0) {
        drawPiece(ctx, piece, piece.x, piece.y, true);
        continue;
      }
      const t = Math.min(1, piece.cut / CUT_LIFE);
      const nx = Math.cos(piece.cutAngle + Math.PI / 2) * t * 46;
      const ny = Math.sin(piece.cutAngle + Math.PI / 2) * t * 46;
      ctx.globalAlpha = 1 - t;
      drawPiece(ctx, piece, piece.x + nx, piece.y + ny, false);
      drawPiece(ctx, piece, piece.x - nx, piece.y - ny, false);
      ctx.globalAlpha = 1;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 1; i < world.trail.length; i += 1) {
      const point = world.trail[i];
      if (!point.join) continue;
      const prev = world.trail[i - 1];
      const alpha = Math.max(0, point.life / TRAIL_LIFE);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = PLAY.hero;
      ctx.lineWidth = 6 + alpha * 10;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // 칼 표시 — 키보드 조작의 현재 자리
    ctx.fillStyle = PLAY.hero;
    ctx.beginPath();
    ctx.moveTo(world.bladeX, world.bladeY - 16);
    ctx.lineTo(world.bladeX + 13, world.bladeY);
    ctx.lineTo(world.bladeX, world.bladeY + 16);
    ctx.lineTo(world.bladeX - 13, world.bladeY);
    ctx.closePath();
    ctx.fill();

    // 다시 부탁 띠 — 지금까지 지킨 사실이 모여 문장이 된다. 읽을 글은 여기 한 곳뿐이다.
    panel(ctx, 10, 8, WORLD_W - 20, BAND_H - 14, BOARD.overlay, PLAY.info, 14);
    centerText(ctx, stage.ask, WORLD_W / 2, 32, 24, BOARD.inkDim);
    for (let i = 0; i < FACT_COUNT; i += 1) {
      const x = 26 + i * 228;
      const lost = world.flash[i] > 0;
      const fill = world.kept[i] ? LOCK_FILL : BOARD.surface;
      const edge = lost ? PLAY.hazard : world.kept[i] ? PLAY.goal : BOARD.line;
      panel(ctx, x, 50, 216, 40, fill, edge, 10);
      centerText(
        ctx,
        lost ? '＿＿＿' : stage.facts[i],
        x + 108, 70, 24,
        lost ? PLAY.hazard : world.kept[i] ? BOARD.ink : BOARD.inkDim,
      );
    }

    if (world.swing > 0) {
      ctx.globalAlpha = world.swing / 0.22;
      ctx.strokeStyle = PLAY.hero;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(world.bladeX - swingHalf, world.bladeY);
      ctx.lineTo(world.bladeX + swingHalf, world.bladeY);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    if (world.phase === 'ready' && !world.finished) {
      panel(ctx, WORLD_W / 2 - 190, WORLD_H - 104, 380, 62, BOARD.overlay, PLAY.hero, 16);
      centerText(
        ctx,
        world.armed
          ? (world.lives < tuning.lives ? '누르면 다시 시작합니다' : '누르면 시작합니다')
          : '손을 떼었다가 다시 누르세요',
        WORLD_W / 2, WORLD_H - 73, 26, BOARD.ink,
      );
    }

    ctx.restore();
  };

  const keptCount = STAGES[0].facts.filter((_, i) => (hud.keptMask & (1 << i)) !== 0).length;

  return (
    <MiniGameFrame
      badge="모호한 말 베기"
      instruction="알기 어려운 모호한 말(회색 구름)만 가볍게 베어 보세요. 꼭 지켜야 할 중요한 사실(초록 자물쇠)은 다치지 않게 그대로 두어야 해요."
      progress={{ label: '벤 모호한 말', value: Math.min(hud.sliced, TARGET_VAGUE), max: TARGET_VAGUE }}
      hud={<GameHud lives={hud.lives} maxLives={tuning.lives} score={keptCount} scoreLabel="지킨 사실" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 베기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              const world = worldRef.current;
              if (pointer.phase === 'up') {
                downRef.current = false;
                return;
              }
              if (pointer.phase === 'down') {
                downRef.current = true;
                world.trail.push({ x: pointer.x, y: pointer.y, life: TRAIL_LIFE, pad: pointerPad, join: false, checked: false });
                return;
              }
              if (!downRef.current) return;
              const last = world.trail[world.trail.length - 1];
              // 가만히 누르고만 있으면 새 점이 생기지 않아 아무것도 베이지 않는다.
              // 베려면 반드시 손을 움직여야 한다는 규칙을 여기서 만든다.
              if (last && Math.hypot(pointer.x - last.x, pointer.y - last.y) < 7) return;
              if (world.trail.length > 40) world.trail.shift();
              world.trail.push({ x: pointer.x, y: pointer.y, life: TRAIL_LIFE, pad: pointerPad, join: true, checked: false });
            }}
            ariaLabel={`모호한 말은 베고 지킬 사실은 남기는 놀이. 남은 기회 ${hud.lives}개, 벤 모호한 말 ${hud.sliced}개, 지킨 사실 ${keptCount}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
