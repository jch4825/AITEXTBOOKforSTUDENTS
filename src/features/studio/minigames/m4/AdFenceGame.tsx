import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel,
  createRandom, randInt, useGameKeys,
} from '../engine';
import type { MiniGameProps } from '../types';

/**
 * m4-l10 · 광고 구역 두르기 (장르 35 · 땅따먹기)
 *
 * "광고를 알아본다"를 고르기가 아니라 **두르기**로 만든다. 판 전체가 아이미가 모아 온
 * 추천 게시물 담벼락이고, 학생은 가장자리에서 안으로 선을 그어 광고 단서가 몰린 쪽을
 * 잘라 낸다. 어느 쪽을 어떤 모양으로 두를지는 학생이 정하므로 성공 경로가 하나가 아니다.
 *
 * 긋는 도중에는 안전하지 않다는 점이 이 게임의 핵심이다. 광고 문구를 뜻하는 적이
 * 아직 긋는 중인 선에 닿으면 선이 통째로 지워진다. "일단 크게 두르고 싶다"와
 * "짧게 끊어 안전하게 가져가자" 사이의 저울질이 곧 광고를 살펴보는 태도가 된다.
 *
 * 다 두르지 않아도 된다. 광고 단서의 70%만 확보하면 끝나고, 남은 담벼락에는 내 필요와
 * 예산에 맞는 게시물이 그대로 남는다. 광고를 걷어 낸 뒤에 무엇이 남는지가 보이게 하려는 것이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
/** 읽을 글은 이 위쪽 띠 한 곳에만 둔다. 판 안의 칸에는 그림만 있다. */
const AREA_X = 16;
const AREA_Y = 80;
const AREA_W = 928;
const AREA_H = 448;

const WALL = 0;
const OWNED = 1;
const TRAIL = 2;

/** 적의 반지름(칸 단위). 확보한 칸과 겹치지 않게 하는 계산에 그대로 쓴다. */
const FOE_R = 0.38;
const FOE_SPEED = 2.3;
/** 한 칸 옮겨 가는 데 걸리는 초. 판 세로를 건너는 데 2초 넘게 걸리도록 느리게 잡았다. */
const STEP_SEC = 0.16;
const BASE_TIME = 90;

const AD_MARKS = [
  { emoji: '🏷️', name: '광고 표시' },
  { emoji: '🛒', name: '구매 링크' },
  { emoji: '💥', name: '과장 문구' },
];
const GOOD_MARKS = [
  { emoji: '✅', name: '필요와 맞음' },
  { emoji: '💰', name: '예산과 맞음' },
];

interface Marker {
  col: number;
  row: number;
  kind: number;
  ad: boolean;
}

interface Foe {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface StageConfig {
  id: string;
  label: string;
  title: string;
  cols: number;
  rows: number;
  ads: number;
  goods: number;
  foes: number;
}

/** 같은 조작, 판만 넓어지고 광고 문구가 늘어난다. */
const STAGES: StageConfig[] = [
  { id: 'bag', label: '기본', title: '추천 게시물 담벼락 · 새 가방', cols: 12, rows: 8, ads: 6, goods: 3, foes: 1 },
  { id: 'shoes', label: '1단계', title: '추천 게시물 담벼락 · 운동화', cols: 15, rows: 9, ads: 8, goods: 4, foes: 2 },
  { id: 'tablet', label: '2단계', title: '추천 게시물 담벼락 · 태블릿', cols: 18, rows: 11, ads: 10, goods: 5, foes: 3 },
];

interface World {
  cells: Uint8Array;
  markers: Marker[];
  markerCells: Set<number>;
  foes: Foe[];
  col: number;
  row: number;
  dirX: number;
  dirY: number;
  /** 0~1. 칸과 칸 사이 어디쯤인지. 그림만 부드럽게 하고 판정은 칸 단위로 한다. */
  step: number;
  trail: number[];
  anchorCol: number;
  anchorRow: number;
  found: number;
  owned: number;
  lives: number;
  timeLeft: number;
  shake: number;
  phase: 'ready' | 'move';
  /** 손을 뗐다가 다시 눌러야 재출발한다. 누른 채로 부딪히면 곧바로 또 당하기 때문이다. */
  armed: boolean;
  finished: boolean;
}

/** 광고 단서와 좋은 게시물을 가로로 고르게 흩는다. 한 번에 다 가져가지 못하게 하려는 것이다. */
function placeMarkers(
  random: () => number,
  cols: number, rows: number,
  count: number, ad: boolean,
  taken: Set<number>,
): Marker[] {
  const out: Marker[] = [];
  const span = (cols - 2) / count;
  for (let i = 0; i < count; i += 1) {
    for (let attempt = 0; attempt < 14; attempt += 1) {
      const col = clamp(1 + Math.floor(i * span + random() * span), 1, cols - 2);
      const row = 1 + randInt(random, 0, rows - 2);
      const key = row * cols + col;
      if (taken.has(key)) continue;
      taken.add(key);
      out.push({ col, row, kind: i % (ad ? 3 : 2), ad });
      break;
    }
  }
  return out;
}

function buildWorld(stage: StageConfig, seed: number, lives: number, foeCount: number, seconds: number): World {
  const { cols, rows } = stage;
  const cells = new Uint8Array(cols * rows);
  // 가장자리 한 줄은 처음부터 확보돼 있다. 여기가 학생이 안전하게 서 있을 수 있는 유일한 자리다.
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) cells[r * cols + c] = OWNED;
    }
  }

  const random = createRandom(seed);
  const taken = new Set<number>();
  const markers = [
    ...placeMarkers(random, cols, rows, stage.ads, true, taken),
    ...placeMarkers(random, cols, rows, stage.goods, false, taken),
  ];

  const foes: Foe[] = [];
  for (let k = 0; k < foeCount; k += 1) {
    const t = (k + 1) / (foeCount + 1);
    foes.push({
      x: 1.5 + t * (cols - 3),
      y: rows / 2 + (k % 2 === 0 ? -1.1 : 1.1),
      vx: k % 2 === 0 ? 1 : -1,
      vy: k % 3 === 0 ? 1 : -1,
    });
  }

  return {
    cells,
    markers,
    markerCells: new Set(markers.map((m) => m.row * cols + m.col)),
    foes,
    col: Math.floor(cols / 2),
    row: rows - 1,
    dirX: 0, dirY: 0, step: 0,
    trail: [],
    anchorCol: Math.floor(cols / 2),
    anchorRow: rows - 1,
    found: 0, owned: 0,
    lives,
    timeLeft: seconds,
    shake: 0,
    phase: 'ready',
    armed: false,
    finished: false,
  };
}

/**
 * 선을 가장자리에 다시 붙였을 때의 정산.
 *
 * 선만 확보하는 것이 아니라, 그 선으로 갈라진 담벼락 조각 중 광고 문구가 들어 있지 않은
 * 쪽을 통째로 가져간다. 그래야 "둘렀다"는 말이 학생 눈에 보이는 그대로가 된다.
 */
function settle(world: World, cols: number, rows: number): void {
  for (const i of world.trail) world.cells[i] = OWNED;
  world.trail = [];

  const busy = new Set<number>();
  for (const foe of world.foes) {
    for (const dx of [-FOE_R, FOE_R]) {
      for (const dy of [-FOE_R, FOE_R]) {
        const c = clamp(Math.floor(foe.x + dx), 0, cols - 1);
        const r = clamp(Math.floor(foe.y + dy), 0, rows - 1);
        busy.add(r * cols + c);
      }
    }
  }

  const seen = new Uint8Array(cols * rows);
  for (let start = 0; start < world.cells.length; start += 1) {
    if (world.cells[start] !== WALL || seen[start]) continue;
    const region: number[] = [];
    const queue = [start];
    seen[start] = 1;
    let free = true;
    while (queue.length > 0) {
      const cur = queue.pop() as number;
      region.push(cur);
      if (busy.has(cur)) free = false;
      const c = cur % cols;
      const r = (cur - c) / cols;
      const around = [
        c > 0 ? cur - 1 : -1,
        c < cols - 1 ? cur + 1 : -1,
        r > 0 ? cur - cols : -1,
        r < rows - 1 ? cur + cols : -1,
      ];
      for (const next of around) {
        if (next < 0 || seen[next] || world.cells[next] !== WALL) continue;
        seen[next] = 1;
        queue.push(next);
      }
    }
    if (free) for (const cellIndex of region) world.cells[cellIndex] = OWNED;
  }

  world.found = world.markers.filter((m) => m.ad && world.cells[m.row * cols + m.col] === OWNED).length;
  let owned = 0;
  for (let r = 1; r < rows - 1; r += 1) {
    for (let c = 1; c < cols - 1; c += 1) if (world.cells[r * cols + c] === OWNED) owned += 1;
  }
  world.owned = owned;
}

export default function AdFenceGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const { cols, rows } = stage;
  const cellSize = Math.min(AREA_W / cols, AREA_H / rows);
  const originX = AREA_X + (AREA_W - cellSize * cols) / 2;
  const originY = AREA_Y + (AREA_H - cellSize * rows) / 2;
  const glyph = Math.max(24, cellSize * 0.56);

  const foeCount = Math.max(1, Math.round(stage.foes * tuning.density));
  const totalTime = Math.round(BASE_TIME * tuning.time);
  const stepSec = STEP_SEC / tuning.speed;
  const foeSpeed = FOE_SPEED * tuning.speed;
  /** 광고 단서를 전부 몰아내지 않아도 된다. 70%면 "광고 쪽을 알아봤다"로 본다. */
  const need = Math.ceil(stage.ads * 0.7);

  const worldRef = useRef<World>(buildWorld(stage, game.seed, tuning.lives, foeCount, totalTime));
  const [hud, setHud] = useState({ found: 0, owned: 0, lives: tuning.lives, seconds: totalTime });
  const keys = useGameKeys(game.playing);
  const pointerRef = useRef({ active: false, x: 0, y: 0 });

  useEffect(() => {
    worldRef.current = buildWorld(stage, game.seed, tuning.lives, foeCount, totalTime);
    setHud({ found: 0, owned: 0, lives: tuning.lives, seconds: totalTime });
    pointerRef.current = { active: false, x: 0, y: 0 };
  }, [game.round, game.stageIndex, stage, game.seed, tuning.lives, foeCount, totalTime]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    const at = (c: number, r: number) =>
      world.cells[clamp(Math.floor(r), 0, rows - 1) * cols + clamp(Math.floor(c), 0, cols - 1)];

    const px = originX + (world.col + world.dirX * world.step + 0.5) * cellSize;
    const py = originY + (world.row + world.dirY * world.step + 0.5) * cellSize;

    // 방향키가 먼저다. 손이 자유롭지 않은 학생도 끝까지 할 수 있어야 한다.
    let inX = 0;
    let inY = 0;
    if (keys.held.current.left) inX = -1;
    else if (keys.held.current.right) inX = 1;
    else if (keys.held.current.up) inY = -1;
    else if (keys.held.current.down) inY = 1;
    if (inX === 0 && inY === 0 && pointerRef.current.active) {
      // 끌어서 조작할 때는 손가락 쪽으로 한 칸씩 따라간다. 대각선은 두지 않아 선이 늘 곧다.
      const dx = pointerRef.current.x - px;
      const dy = pointerRef.current.y - py;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > cellSize * 0.4) inX = Math.sign(dx);
      } else if (Math.abs(dy) > cellSize * 0.4) inY = Math.sign(dy);
    }

    if (dt > 0 && !world.finished) {
      if (world.phase === 'ready') {
        world.shake = Math.max(0, world.shake - dt * 1.4);
        if (inX === 0 && inY === 0) world.armed = true;
        else if (world.armed && world.shake <= 0) {
          world.phase = 'move';
          world.armed = false;
        }
      }

      if (world.phase === 'move') {
        world.timeLeft = Math.max(0, world.timeLeft - dt);

        if (world.dirX === 0 && world.dirY === 0 && (inX !== 0 || inY !== 0)) {
          const nc = world.col + inX;
          const nr = world.row + inY;
          const inside = nc >= 0 && nc < cols && nr >= 0 && nr < rows;
          // 자기가 그은 선은 밟지 못하게 막기만 한다. 여기서 목숨을 깎으면 벌이 두 번이 된다.
          if (inside && world.cells[nr * cols + nc] !== TRAIL) {
            if (world.trail.length === 0 && world.cells[nr * cols + nc] === WALL) {
              world.anchorCol = world.col;
              world.anchorRow = world.row;
            }
            world.dirX = inX;
            world.dirY = inY;
            world.step = 0;
          }
        }

        if (world.dirX !== 0 || world.dirY !== 0) {
          world.step += dt / stepSec;
          if (world.step >= 1) {
            world.col += world.dirX;
            world.row += world.dirY;
            world.dirX = 0;
            world.dirY = 0;
            world.step = 0;
            const here = world.row * cols + world.col;
            if (world.cells[here] === WALL) {
              world.cells[here] = TRAIL;
              world.trail.push(here);
            } else if (world.trail.length > 0) {
              settle(world, cols, rows);
            }
          }
        }

        for (const foe of world.foes) {
          const nx = foe.x + foe.vx * foeSpeed * dt;
          if (at(nx + Math.sign(foe.vx) * FOE_R, foe.y) === OWNED) foe.vx = -foe.vx;
          else foe.x = nx;
          const ny = foe.y + foe.vy * foeSpeed * dt;
          if (at(foe.x, ny + Math.sign(foe.vy) * FOE_R) === OWNED) foe.vy = -foe.vy;
          else foe.y = ny;
        }

        let bumped = false;
        for (const foe of world.foes) {
          for (const dx of [-FOE_R, FOE_R]) {
            for (const dy of [-FOE_R, FOE_R]) if (at(foe.x + dx, foe.y + dy) === TRAIL) bumped = true;
          }
          if (world.trail.length > 0 && (world.dirX !== 0 || world.dirY !== 0)) {
            if (Math.floor(foe.x) === world.col + world.dirX && Math.floor(foe.y) === world.row + world.dirY) {
              bumped = true;
            }
          }
        }

        if (bumped) {
          world.lives -= 1;
          for (const i of world.trail) world.cells[i] = WALL;
          world.trail = [];
          world.col = world.anchorCol;
          world.row = world.anchorRow;
          world.dirX = 0;
          world.dirY = 0;
          world.step = 0;
          world.shake = 0.7;
          world.phase = 'ready';
          world.armed = false;
        }

        const seconds = Math.ceil(world.timeLeft);
        if (world.found !== hud.found || world.lives !== hud.lives
          || world.owned !== hud.owned || seconds !== hud.seconds) {
          setHud({ found: world.found, owned: world.owned, lives: world.lives, seconds });
        }

        if (world.found >= need) {
          world.finished = true;
          const left = world.markers.filter((m) => !m.ad && world.cells[m.row * cols + m.col] !== OWNED).length;
          game.succeed(`광고 단서 ${world.found}개를 둘렀어요. 내 필요와 예산에 맞는 게시물 ${left}개가 남았습니다!`);
        } else if (world.lives <= 0) {
          world.finished = true;
          game.fail('과장 문구가 선에 닿아 지워졌어요. 가장자리로 금방 돌아오는 짧은 길부터 그어 보세요.');
        } else if (world.timeLeft <= 0) {
          world.finished = true;
          game.fail('시간이 다 됐어요. 광고 표시가 몰려 있는 쪽을 먼저 작게 둘러 보세요.');
        }
      }
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    panel(ctx, 12, 8, 936, 62, BOARD.overlay, PLAY.info, 14);
    centerText(ctx, stage.title, 316, 26, 28, BOARD.ink);
    centerText(ctx, '🏷️ 광고 표시 · 🛒 구매 링크 · 💥 과장', 316, 54, 24, BOARD.inkDim);
    const risky = world.trail.length > 0;
    panel(ctx, 636, 14, 300, 50, BOARD.overlay, risky ? PLAY.hazard : PLAY.goal, 12);
    centerText(ctx, risky ? '가장자리로 돌아가세요' : '지금은 안전해요', 786, 39, 24, BOARD.ink);

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const state = world.cells[r * cols + c];
        const x = originX + c * cellSize;
        const y = originY + r * cellSize;
        ctx.fillStyle = state === OWNED ? '#14532D' : state === TRAIL ? PLAY.heroEdge : BOARD.surface;
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        // 아직 두르지 않은 칸에는 게시물 조각처럼 글줄 두 개만 흐리게 그린다.
        if (state === WALL && !world.markerCells.has(r * cols + c)) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
          ctx.fillRect(x + cellSize * 0.22, y + cellSize * 0.36, cellSize * 0.56, 3);
          ctx.fillRect(x + cellSize * 0.22, y + cellSize * 0.56, cellSize * 0.36, 3);
        }
      }
    }

    for (const marker of world.markers) {
      const x = originX + marker.col * cellSize;
      const y = originY + marker.row * cellSize;
      const owned = world.cells[marker.row * cols + marker.col] === OWNED;
      const set = marker.ad ? AD_MARKS[marker.kind] : GOOD_MARKS[marker.kind];
      if (marker.ad && owned) {
        ctx.strokeStyle = PLAY.goal;
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 3, y + 3, cellSize - 6, cellSize - 6);
      } else if (!marker.ad && !owned) {
        ctx.strokeStyle = PLAY.info;
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 3, y + 3, cellSize - 6, cellSize - 6);
      }
      centerText(ctx, set.emoji, x + cellSize / 2, y + cellSize / 2, glyph, BOARD.ink);
    }

    for (const foe of world.foes) {
      const fx = originX + foe.x * cellSize;
      const fy = originY + foe.y * cellSize;
      ctx.fillStyle = PLAY.hazardEdge;
      ctx.beginPath();
      ctx.arc(fx, fy, cellSize * FOE_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PLAY.hazard;
      ctx.lineWidth = 3;
      ctx.stroke();
      centerText(ctx, '💥', fx, fy, Math.max(24, cellSize * 0.5), BOARD.ink);
    }

    const shakeX = world.shake > 0 ? Math.sin(world.shake * 40) * 7 : 0;
    ctx.fillStyle = PLAY.hero;
    ctx.beginPath();
    ctx.arc(px + shakeX, py, cellSize * 0.33, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#3B2100';
    ctx.beginPath();
    ctx.arc(px + shakeX, py, cellSize * 0.12, 0, Math.PI * 2);
    ctx.fill();

    if (world.phase === 'ready' && !world.finished) {
      panel(ctx, WORLD_W / 2 - 245, 452, 490, 58, BOARD.overlay, PLAY.hero, 16);
      centerText(
        ctx,
        world.armed
          ? (world.lives < tuning.lives ? '방향키나 화면을 누르면 다시 시작합니다' : '방향키나 화면을 누르면 시작합니다')
          : '손을 떼었다가 다시 누르세요',
        WORLD_W / 2, 481, 26, BOARD.ink,
      );
    }
  };

  return (
    <MiniGameFrame
      badge="광고 구역 두르기"
      instruction="선을 그어 과장된 광고 게시물을 둘러싸 보세요. 지나친 과장 문구에 닿지 않게 조심하며 안전하게 영역을 확보해 봅시다."
      progress={{ label: '찾은 광고 단서', value: Math.min(hud.found, need), max: need }}
      hud={(
        <GameHud
          lives={hud.lives}
          maxLives={tuning.lives}
          score={hud.owned}
          scoreLabel="두른 칸"
          timeLeft={hud.seconds}
          timeTotal={totalTime}
        />
      )}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].title} 담벼락으로 바꿨어요.`)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 두르기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') pointerRef.current = { active: true, x: pointer.x, y: pointer.y };
              else if (pointer.phase === 'move' && pointerRef.current.active) {
                pointerRef.current = { active: true, x: pointer.x, y: pointer.y };
              } else if (pointer.phase === 'up') pointerRef.current.active = false;
            }}
            ariaLabel={`추천 게시물 담벼락에서 광고 단서를 선으로 두르는 놀이. 찾은 광고 단서 ${hud.found}개, 남은 기회 ${hud.lives}개, 남은 시간 ${hud.seconds}초.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
