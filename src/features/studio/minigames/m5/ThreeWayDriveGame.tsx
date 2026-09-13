import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, approach, centerText, clamp, createRandom, drawBar,
  drawPanel, drawPop, drawSegments, drawShape, drawTag, paintBoard, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m5-l9 · 세 갈래 길 달리기 (장르 31 · 스티어링)
 *
 * 길이 세 갈래로 갈라진다. 멀리서부터 어느 갈래가 막혔는지 보이고, 갈래에 들어서면 그
 * 갈래를 끝까지 달려야 한다. **막힌 갈래일수록 연료 조각이 많이 놓여 있다.** 연료는 계속
 * 줄어서 조각을 하나도 안 먹으면 도착하지 못하고, 욕심껏 막힌 갈래로 들어가면 부딪힌다.
 * 판 전체가 "어느 길로 갈까"를 되풀이해서 묻는다.
 *
 * 차시와는 소재로만 잇는다 — 처음 길이 막히면 다른 길로 돌아간다. 비교표를 채우게 하던
 * 처음 설계는 걷어냈다. 같은 코스를 세 번 달려 표를 채우는 것은 놀이가 아니라 숙제였다.
 *
 * 갈래 사이의 벽은 부딪혀도 다치지 않고 제 갈래 안으로 밀어낼 뿐이다. 벽에 스친 것으로
 * 기회를 잃으면 판단이 아니라 손끝 정확도가 승부를 가른다. 다치는 것은 막힌 갈래를 고른
 * 판단뿐이다.
 *
 * 같은 장르를 쓰는 m2-l5(말투 도로 운전)와 조작이 다르다. m2-l5는 구불구불한 한 길에서
 * 두 벽 사이를 계속 지키며 사실 카드를 줍는 판이라, 핸들을 고쳐 잡는 손이 전부다. 여기는
 * 길이 실제로 갈라지고, 들어서기 전에 어느 갈래로 갈지 고르는 순간이 되풀이된다. 연료라는
 * 줄어드는 자원도 m2-l5에는 없다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

/** 차는 아래쪽에 고정하고 길이 위에서 내려온다. 위로 430 단위 앞까지 보인다. */
const CAR_Y = 430;
const CAR_SIZE = 40;
const CAR_R = CAR_SIZE / 2;

const ROAD_L = 200;
const ROAD_R = 760;
/** 갈래를 가르는 벽 두 개의 가운데와 두께 */
const DIVIDERS = [387, 573];
const DIVIDER_W = 18;
const BRANCHES: Array<[number, number]> = [
  [ROAD_L, DIVIDERS[0] - DIVIDER_W / 2],
  [DIVIDERS[0] + DIVIDER_W / 2, DIVIDERS[1] - DIVIDER_W / 2],
  [DIVIDERS[1] + DIVIDER_W / 2, ROAD_R],
];

/** 처음 갈림길까지의 거리, 갈래 구간 길이, 갈림길 사이의 트인 길 */
const OPEN_START = 480;
const FORK_LEN = 380;
const GAP = 420;
/** 갈래 끝에서 이만큼 앞에 막힘이 있다 */
const BLOCK_BEFORE_END = 40;

const TOKEN_SIZE = 28;
/** 조각 하나가 채우는 연료 */
const TOKEN_FUEL = 0.17;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  forks: number;
  /** 갈림길마다 막히는 갈래 수. 뒤 갈림길로 갈수록 이 수를 쓴다. */
  blocked: number[];
  pace: number;
}

/*
 * 판 셋은 조작이 같고 길이·막힘이 다르다. 뒤로 갈수록 갈림길이 늘고 두 갈래가 막히는
 * 자리가 섞인다. 두 갈래가 막히면 열린 길은 하나뿐이라 욕심낼 틈이 줄어든다.
 */
const STAGES: StageConfig[] = [
  { id: 'fair', label: '기본', scene: '체험회 가는 길', spoken: '막히지 않은 갈래로 달려 도착해요.',
    forks: 4, blocked: [1, 1, 1, 1], pace: 1 },
  { id: 'rain', label: '1단계', scene: '비 오는 날 가는 길', spoken: '막히지 않은 갈래로 달려 도착해요.',
    forks: 5, blocked: [1, 1, 2, 1, 2], pace: 1.08 },
  { id: 'works', label: '2단계', scene: '공사 중인 길', spoken: '막히지 않은 갈래로 달려 도착해요.',
    forks: 6, blocked: [1, 2, 1, 2, 2, 1], pace: 1.15 },
];

interface Fork {
  start: number;
  end: number;
  blocked: boolean[];
  /** 부딪힘을 이미 판정했는가 */
  resolved: boolean;
}

interface Token {
  s: number;
  x: number;
  taken: boolean;
}

interface World {
  traveled: number;
  carX: number;
  fuel: number;
  lives: number;
  forks: Fork[];
  tokens: Token[];
  /** 지금 들어선 갈림길과 갈래 */
  lockedFork: number;
  lockedBranch: number;
  invuln: number;
  phase: 'ready' | 'drive';
  finished: boolean;
  pop: { text: string; good: boolean; t: number } | null;
  length: number;
}

const POP_TIME = 0.8;

const BRANCH_NAMES = ['왼쪽', '가운데', '오른쪽'];

/**
 * 다음 갈림길에서 막힌 갈래를 말로 적는다.
 *
 * 막힘은 캔버스에 그린 삼각형이라 화면 읽기 도구가 읽지 못한다. 이 글이 없으면 소리로
 * 판을 따라가는 학생은 어느 갈래로 들어갈지 정할 방법이 없다.
 */
function nextForkText(world: World): string {
  const fork = world.forks.find((f) => world.traveled < f.end);
  if (!fork) return '남은 갈림길 없음';
  const names = fork.blocked.map((b, i) => (b ? BRANCH_NAMES[i] : '')).filter(Boolean);
  return `다음 갈림길은 ${names.join('·')} 막힘`;
}

function branchAt(x: number): number {
  if (x < DIVIDERS[0]) return 0;
  if (x < DIVIDERS[1]) return 1;
  return 2;
}

function buildWorld(stage: StageConfig, seed: number, lives: number): World {
  const random = createRandom(seed);
  const forks: Fork[] = [];
  const tokens: Token[] = [];
  let s = OPEN_START;
  for (let i = 0; i < stage.forks; i += 1) {
    const count = stage.blocked[i % stage.blocked.length];
    const order = [0, 1, 2].sort(() => random() - 0.5);
    const blocked = [false, false, false];
    for (let k = 0; k < count; k += 1) blocked[order[k]] = true;
    forks.push({ start: s, end: s + FORK_LEN, blocked, resolved: false });

    /* 막힌 갈래에는 조각을 둘, 열린 갈래에는 하나만 둔다. 욕심의 미끼다. */
    for (let b = 0; b < 3; b += 1) {
      const [lo, hi] = BRANCHES[b];
      const mid = (lo + hi) / 2;
      const offsets = blocked[b] ? [110, 230] : [170];
      for (const off of offsets) tokens.push({ s: s + off, x: mid, taken: false });
    }
    s += FORK_LEN;

    /* 갈림길 사이의 트인 길에도 조각을 흩어 둔다. 여기 조각이 연료의 바탕이다. */
    const between = 2;
    for (let k = 0; k < between; k += 1) {
      tokens.push({
        s: s + (GAP / (between + 1)) * (k + 1),
        /* 가운데 쪽에 모은다. 길 가장자리까지 흩으면 가운데로 달리는 학생이 못 줍고,
           막힘을 잘 피한 학생이 연료로 지는 판이 생긴다. */
        x: ROAD_L + 150 + random() * (ROAD_R - ROAD_L - 300),
        taken: false,
      });
    }
    s += GAP;
  }
  return {
    traveled: 0, carX: (ROAD_L + ROAD_R) / 2, fuel: 1, lives, forks, tokens,
    lockedFork: -1, lockedBranch: -1, invuln: 0, phase: 'ready', finished: false, pop: null,
    length: s,
  };
}

export default function ThreeWayDriveGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 달리는 빠르기, 연료가 주는 빠르기, 기회로 나타난다. 길 모양은 셋 모두 같다. */
  const maxLives = tuning.lives;
  const scroll = 150 * stage.pace * clamp(tuning.speed, 0.65, 1.3);
  /* 연료는 조각을 가끔 주워야 겨우 버틸 만큼 줄어든다. 0.05로 두었더니 막힘만 피하는 수가
     연료 90%를 남기고 도착해, "막힌 갈래에 조각이 더 많다"는 미끼가 아무 뜻이 없었다.
     0.075로 올리자 이번에는 막힘만 피하고 조각을 챙기지 않는 수가 판에 따라 연료로 졌다. */
  const drain = 0.065 * clamp(tuning.speed, 0.7, 1.25);
  const steer = 520;

  const keys = useGameKeys(game.playing);
  const pointerRef = useRef<{ down: boolean; x: number }>({ down: false, x: WORLD_W / 2 });
  const worldRef = useRef<World>(buildWorld(stage, game.seed, maxLives));
  const [view, setView] = useState({ lives: maxLives, part: 0, fuel: 10, next: '' });

  useEffect(() => {
    const built = buildWorld(stage, game.seed, maxLives);
    worldRef.current = built;
    pointerRef.current = { down: false, x: WORLD_W / 2 };
    setView({ lives: maxLives, part: 0, fuel: 10, next: nextForkText(built) });
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && w.pop) {
      w.pop.t -= dt;
      if (w.pop.t <= 0) w.pop = null;
    }

    if (dt > 0 && game.playing && !w.finished) {
      const held = keys.held.current;
      const moving = held.left || held.right || pointerRef.current.down;
      /* 학생이 처음 핸들을 잡을 때까지 차는 서 있다. 규칙을 읽는 사이에 연료가 주면
         시작하기도 전에 지는 판이 된다. */
      if (w.phase === 'ready' && moving) w.phase = 'drive';

      if (w.phase === 'drive') {
        w.traveled += scroll * dt;
        w.fuel -= drain * dt;
        w.invuln = Math.max(0, w.invuln - dt);

        if (pointerRef.current.down) {
          w.carX = approach(w.carX, pointerRef.current.x, steer * dt);
        } else {
          const dir = (held.left ? -1 : 0) + (held.right ? 1 : 0);
          w.carX += dir * steer * 0.7 * dt;
        }

        // 갈림길에 들어서는 순간 그 갈래에 묶인다
        const forkIndex = w.forks.findIndex((f) => w.traveled >= f.start && w.traveled < f.end);
        if (forkIndex !== w.lockedFork) {
          w.lockedFork = forkIndex;
          w.lockedBranch = forkIndex >= 0 ? branchAt(w.carX) : -1;
        }
        if (forkIndex >= 0) {
          /* 갈래 사이 벽은 다치게 하지 않고 제 갈래 안으로 밀어낸다. */
          const [lo, hi] = BRANCHES[w.lockedBranch];
          w.carX = clamp(w.carX, lo + CAR_R, hi - CAR_R);
          const fork = w.forks[forkIndex];
          if (!fork.resolved && w.traveled >= fork.end - BLOCK_BEFORE_END) {
            fork.resolved = true;
            if (fork.blocked[w.lockedBranch] && w.invuln <= 0) {
              w.lives -= 1;
              w.invuln = 1;
              w.pop = { text: '쾅!', good: false, t: POP_TIME };
              playSound('select');
            } else if (!fork.blocked[w.lockedBranch]) {
              w.pop = { text: '통과!', good: true, t: POP_TIME };
            }
          }
        } else {
          w.carX = clamp(w.carX, ROAD_L + CAR_R, ROAD_R - CAR_R);
        }

        // 연료 조각
        for (const token of w.tokens) {
          if (token.taken) continue;
          const y = CAR_Y - (token.s - w.traveled);
          if (Math.abs(y - CAR_Y) < CAR_R + TOKEN_SIZE / 2 && Math.abs(token.x - w.carX) < CAR_R + TOKEN_SIZE / 2) {
            token.taken = true;
            w.fuel = Math.min(1, w.fuel + TOKEN_FUEL);
            playSound('fill');
          }
        }

        const part = Math.min(10, Math.floor((w.traveled / w.length) * 10));
        const fuelCells = Math.max(0, Math.ceil(w.fuel * 10));
        const next = nextForkText(w);
        if (part !== view.part || w.lives !== view.lives || fuelCells !== view.fuel || next !== view.next) {
          setView({ lives: w.lives, part, fuel: fuelCells, next });
        }

        if (w.lives <= 0) {
          w.finished = true;
          game.fail('막힌 갈래에 너무 많이 부딪혔어요. 멀리서 막힘을 보고 열린 갈래로 들어가 봐요.');
        } else if (w.fuel <= 0) {
          w.finished = true;
          game.fail('연료가 떨어졌어요. 가는 길에 파랑 조각을 주워 연료를 채워 봐요.');
        } else if (w.traveled >= w.length) {
          w.finished = true;
          w.pop = { text: '도착!', good: true, t: 2 };
          game.succeed('막힌 길을 피해 돌아가며 끝까지 달렸어요. 도착했어요!');
        }
      }
    }

    const yOf = (s: number) => CAR_Y - (s - w.traveled);

    paintBoard(ctx, WORLD_W, WORLD_H);

    // 길 — 한 겹 뜬 면과 밝은 가장자리
    drawBar(ctx, ROAD_L, 0, ROAD_R - ROAD_L, WORLD_H, { fill: B.surface });
    drawBar(ctx, ROAD_L - 3, 0, 3, WORLD_H, { fill: B.keyline });
    drawBar(ctx, ROAD_R, 0, 3, WORLD_H, { fill: B.keyline });

    // 트인 길의 가운데 점선. 흘러내려 달리는 느낌을 만든다.
    for (let s = Math.floor((w.traveled - 200) / 60) * 60; s < w.traveled + CAR_Y + 60; s += 60) {
      const inFork = w.forks.some((f) => s >= f.start - 40 && s < f.end);
      if (inFork) continue;
      const y = yOf(s);
      drawBar(ctx, (ROAD_L + ROAD_R) / 2 - 3, y - 14, 6, 28, { fill: B.line });
    }

    // 갈림길
    for (const fork of w.forks) {
      const top = yOf(fork.end);
      const bottom = yOf(fork.start);
      if (bottom < -20 || top > WORLD_H + 20) continue;

      /* 갈라지기 전 40 단위는 점선으로 벽이 올 자리를 먼저 보인다. */
      ctx.save();
      ctx.setLineDash([10, 8]);
      ctx.strokeStyle = B.grey;
      ctx.lineWidth = STROKE.hair;
      for (const dx of DIVIDERS) {
        ctx.beginPath();
        ctx.moveTo(dx, bottom);
        ctx.lineTo(dx, bottom + 60);
        ctx.stroke();
      }
      ctx.restore();

      for (const dx of DIVIDERS) {
        drawBar(ctx, dx - DIVIDER_W / 2, top, DIVIDER_W, bottom - top, {
          fill: B.grey, stroke: B.shadow, width: 2, lift: 3,
        });
      }

      // 막힘 — 갈래를 가로지르는 빨강 삼각 셋과 꼬리표
      const blockY = yOf(fork.end - BLOCK_BEFORE_END);
      for (let b = 0; b < 3; b += 1) {
        if (!fork.blocked[b]) continue;
        const [lo, hi] = BRANCHES[b];
        const span = hi - lo;
        for (let k = 0; k < 3; k += 1) {
          drawShape(ctx, 'triangle', lo + span * (k + 0.5) / 3, blockY, 38, {
            fill: B.red, stroke: B.keyline, width: 2, lift: 2,
          });
        }
        if (blockY > 30) {
          drawTag(ctx, '막힘', (lo + hi) / 2, blockY - 42, { fill: B.red, ink: B.ink, align: 'center' });
        }
      }
    }

    // 도착 줄
    const finishY = yOf(w.length);
    if (finishY > -40 && finishY < WORLD_H + 40) {
      for (let k = 0; k < 14; k += 1) {
        drawBar(ctx, ROAD_L + k * 40, finishY - 10, 40, 20, { fill: k % 2 === 0 ? B.yellow : B.ground });
      }
      drawTag(ctx, '도착', (ROAD_L + ROAD_R) / 2, finishY - 40, { align: 'center' });
    }

    // 연료 조각 — 떠 있는 파랑 사각
    for (const token of w.tokens) {
      if (token.taken) continue;
      const y = yOf(token.s);
      if (y < -30 || y > WORLD_H + 30) continue;
      drawShape(ctx, 'square', token.x, y, TOKEN_SIZE, { fill: B.blue, stroke: B.keyline, width: 2, lift: 2 });
    }

    // 차 — 조종하는 것은 노랑 원이다. 맞은 뒤 잠깐은 깜빡인다.
    const blink = w.invuln > 0 && Math.floor(w.invuln * 10) % 2 === 0;
    if (!blink) {
      drawShape(ctx, 'circle', w.carX, CAR_Y, CAR_SIZE, { fill: B.yellow, stroke: B.keyline, width: STROKE.hair, lift: 3 });
      drawShape(ctx, 'triangle', w.carX, CAR_Y - 6, 14, { fill: B.ground });
    }

    // 왼쪽 패널 — 연료
    drawPanel(ctx, 16, 16, 168, 118, { header: '연료', accent: B.blue });
    drawSegments(ctx, 30, 74, 140, 26, w.fuel * 10, 10, { fill: w.fuel < 0.25 ? B.red : B.blue });
    centerText(ctx, w.fuel < 0.25 ? '조각을 주워요' : '파랑 조각 = 연료', 100, 116, 20, w.fuel < 0.25 ? B.redInk : B.grey);

    // 오른쪽 패널 — 지난 갈림길
    const passed = w.forks.filter((f) => w.traveled >= f.end).length;
    drawPanel(ctx, 776, 16, 168, 118, { header: '갈림길', accent: B.yellow });
    centerText(ctx, `${passed} / ${w.forks.length}`, 860, 94, 38, B.ink);

    if (w.pop) {
      const grow = Math.min(1, (POP_TIME - Math.min(POP_TIME, w.pop.t)) * 8);
      drawPop(ctx, w.pop.text, w.carX, CAR_Y - 80, {
        fill: w.pop.good ? B.yellow : B.red,
        ink: w.pop.good ? B.ground : B.ink,
        rotate: w.pop.good ? -0.06 : 0.05,
        scale: 0.8 + grow * 0.2,
      });
    }

    if (w.phase === 'ready' && !w.finished) {
      drawBar(ctx, WORLD_W / 2 - 210, 200, 420, 58, { fill: B.ground, stroke: B.yellow, width: STROKE.base, lift: 4 });
      centerText(ctx, '핸들을 잡으면 출발합니다', WORLD_W / 2, 229, 24, B.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="세 갈래 길 달리기"
      instruction="노랑 차를 좌우로 움직여 달려요. 길이 세 갈래로 갈라지면 빨강 막힘이 없는 갈래로 들어가세요. 파랑 조각을 주우면 연료가 찹니다."
      progress={{ label: '간 거리', value: view.part, max: 10 }}
      hud={<GameHud lives={view.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="px-1 text-[15px] font-bold" style={{ color: 'var(--game-ink)' }}>
          {stage.scene} · 막힌 갈래에는 조각이 더 많아요. 욕심낼까요, 돌아갈까요?
        </p>
      }
      actions={<MiniGameButton onClick={game.retry} mark="retry" label="다시 달리기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'up') { pointerRef.current = { down: false, x: pointer.x }; return; }
              pointerRef.current = { down: true, x: pointer.x };
            }}
            ariaLabel={`세 갈래 길을 달리는 놀이. ${view.next}. 간 거리 ${view.part * 10}퍼센트, 연료 ${view.fuel * 10}퍼센트, 남은 기회 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
