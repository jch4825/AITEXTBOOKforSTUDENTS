import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, approach, centerText, clamp, createRandom,
  fillRoundRect, panel, randRange, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m1-l6 · 배움 상자 골고루 (장르 50 · 재활용 분류)
 *
 * "자료가 치우치면 AI도 치우친다"를 손으로 겪게 만든다. 많이 받는 것이 이기는 길이
 * 아니라는 점이 이 게임의 전부다. 세모 카드가 훨씬 많이 떨어지지만 세모 상자만
 * 불어나면 위쪽 아이미의 눈이 흐려지고 "세모만 자꾸 보여요"라고 말한다.
 *
 * 그래서 학생이 익히는 조작은 '받기'가 아니라 '흘려보내기'다. 놓친 카드는 바닥에
 * 조용히 쌓일 뿐 벌점이 없다. 안 받는 것이 실력이 되는 규칙이라야 편향이라는 말이
 * 설명이 아니라 손끝의 감각으로 남는다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
/** 손수레가 카드를 받는 높이. 낙하 거리를 넉넉히 남겨 두려고 화면 아래 3분의 2 지점에 둔다. */
const CART_TOP = 368;
const FLOOR_Y = 444;
const BOX_TOP = 460;
const CARD_R = 22;
/** 손수레 속도는 지원 수준과 상관없이 같다. 느린 손수레는 도움이 아니라 방해가 되기 때문이다. */
const CART_SPEED = 430;
/** 가장 많은 상자와 가장 적은 상자의 차이가 이만큼 벌어지면 아이미의 눈이 흐려진다. */
const GAP_LIMIT = 4;

type ShapeName = 'triangle' | 'square' | 'circle' | 'star';

interface Kind {
  id: string;
  name: string;
  shape: ShapeName;
  fill: string;
  edge: string;
  /** 떨어지는 비율. 일부러 치우쳐 두어야 학생이 '골라 받기'를 하게 된다. */
  weight: number;
}

interface StageConfig {
  id: string;
  label: string;
  title: string;
  /** 상자 하나가 가득 차는 장수 */
  target: number;
  kinds: Kind[];
}

const STAGES: StageConfig[] = [
  {
    id: 'shapes',
    label: '기본',
    title: '모양 세 가지',
    target: 6,
    kinds: [
      { id: 'tri', name: '세모', shape: 'triangle', fill: PLAY.hero, edge: PLAY.heroEdge, weight: 5.2 },
      { id: 'squ', name: '네모', shape: 'square', fill: PLAY.info, edge: PLAY.infoEdge, weight: 2.2 },
      { id: 'cir', name: '동그라미', shape: 'circle', fill: PLAY.goal, edge: PLAY.goalEdge, weight: 1.8 },
    ],
  },
  {
    /* 모양이 같아도 색이 다르면 다른 상자다. 자료를 나누는 기준이 하나가 아니라는 것을
       조작으로 겪게 하려고 상자를 늘리는 대신 목표 장수를 5로 낮췄다. 총 장수를 비슷하게
       유지해야 같은 제한 시간 안에서 세 스테이지가 모두 이길 수 있다. */
    id: 'colors',
    label: '1단계',
    title: '모양과 색',
    target: 5,
    kinds: [
      { id: 'rt', name: '빨간 세모', shape: 'triangle', fill: PLAY.hazard, edge: PLAY.hazardEdge, weight: 5 },
      { id: 'bt', name: '파란 세모', shape: 'triangle', fill: PLAY.info, edge: PLAY.infoEdge, weight: 2.2 },
      { id: 'rs', name: '빨간 네모', shape: 'square', fill: PLAY.hazard, edge: PLAY.hazardEdge, weight: 1.9 },
      { id: 'bs', name: '파란 네모', shape: 'square', fill: PLAY.info, edge: PLAY.infoEdge, weight: 1.6 },
    ],
  },
  {
    id: 'four',
    label: '2단계',
    title: '모양 네 가지',
    target: 5,
    kinds: [
      { id: 'tri', name: '세모', shape: 'triangle', fill: PLAY.hero, edge: PLAY.heroEdge, weight: 5.6 },
      { id: 'squ', name: '네모', shape: 'square', fill: PLAY.info, edge: PLAY.infoEdge, weight: 2.1 },
      { id: 'cir', name: '동그라미', shape: 'circle', fill: PLAY.goal, edge: PLAY.goalEdge, weight: 1.8 },
      { id: 'sta', name: '별', shape: 'star', fill: PLAY.extra, edge: PLAY.extraEdge, weight: 1.5 },
    ],
  },
];

interface Card {
  x: number;
  y: number;
  kind: number;
}

interface World {
  cartX: number;
  cards: Card[];
  /** 놓친 카드. 벌점이 아니라 '보내 준 카드'라서 바닥에 흐리게만 쌓는다. */
  pile: Card[];
  counts: number[];
  spawnLeft: number;
  /** 가장 적은 상자의 카드가 몇 번째 스폰까지 안 나왔는지. 굶으면 이길 수 없다. */
  sinceLag: number;
  warn: number;
  time: number;
  flash: number;
  finished: boolean;
  /** ready면 카드가 아직 떨어지지 않는다. 시작 전에 손수레 자리를 잡을 시간을 준다. */
  phase: 'ready' | 'running';
  random: () => number;
}

function buildWorld(stage: StageConfig, seed: number): World {
  return {
    cartX: WORLD_W / 2,
    cards: [],
    pile: [],
    counts: stage.kinds.map(() => 0),
    spawnLeft: 0.5,
    sinceLag: 0,
    warn: 0,
    time: 0,
    flash: 0,
    finished: false,
    phase: 'ready',
    random: createRandom(seed),
  };
}

/** 무게를 반영한 뽑기. 흔한 모양이 정말 흔하게 떨어져야 '일부러 놓치기'가 의미를 가진다. */
function pickKind(random: () => number, kinds: Kind[]): number {
  const total = kinds.reduce((sum, kind) => sum + kind.weight, 0);
  let roll = random() * total;
  for (let index = 0; index < kinds.length; index += 1) {
    roll -= kinds[index].weight;
    if (roll <= 0) return index;
  }
  return kinds.length - 1;
}

function starPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.46;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/** 카드·상자·아이미의 눈이 모두 같은 그림을 쓰도록 도형 그리기를 한 곳에 둔다. */
function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: ShapeName,
  x: number, y: number, r: number,
  fill: string, edge: string, alpha = 1,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fill;
  ctx.strokeStyle = edge;
  ctx.lineWidth = 3;
  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
  } else if (shape === 'square') {
    const side = r * 1.72;
    ctx.beginPath();
    ctx.rect(x - side / 2, y - side / 2, side, side);
  } else if (shape === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r * 0.94, y + r * 0.74);
    ctx.lineTo(x - r * 0.94, y + r * 0.74);
    ctx.closePath();
  } else {
    starPath(ctx, x, y, r);
  }
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export default function DataBalanceSortGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 낙하는 화면을 가로지르는 데 2.5초 넘게 걸리도록 잡았다. 흔한 낙하 게임 속도로는
     "무엇이 떨어지는지" 알아보기도 전에 바닥에 닿아 고르고 말고 할 여지가 없다. */
  const fallSpeed = 150 * tuning.speed;
  const cartHalf = 75 * tuning.size;
  const totalTime = 78 * tuning.time;
  const spawnInterval = 1.15 / tuning.density;
  const maxCards = Math.max(3, Math.round(4 * tuning.density));
  /** 흐린 눈이 이만큼 이어지면 실패한다. 기본 3초에서 지원 수준만큼 여유를 준다. */
  const warnLimit = 3 * tuning.tolerance;

  const worldRef = useRef<World>(buildWorld(stage, game.seed));
  const targetRef = useRef<number | null>(null);
  const keys = useGameKeys(game.playing);
  const [hud, setHud] = useState({ counts: stage.kinds.map(() => 0), sec: Math.ceil(totalTime) });

  useEffect(() => {
    worldRef.current = buildWorld(stage, game.seed);
    targetRef.current = null;
    setHud({ counts: stage.kinds.map(() => 0), sec: Math.ceil(totalTime) });
  }, [game.round, game.stageIndex, stage, game.seed, totalTime]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    const kinds = stage.kinds;
    const left = keys.held.current.left;
    const right = keys.held.current.right;

    if (dt > 0 && !world.finished) {
      // 손수레는 준비 상태에서도 움직인다. 시작 전에 자리를 고를 수 있어야 첫 카드를 놓치지 않는다.
      if (left && !right) {
        world.cartX -= CART_SPEED * dt;
        targetRef.current = null;
      } else if (right && !left) {
        world.cartX += CART_SPEED * dt;
        targetRef.current = null;
      } else if (targetRef.current !== null) {
        world.cartX = approach(world.cartX, targetRef.current, CART_SPEED * dt);
      }
      world.cartX = clamp(world.cartX, cartHalf + 10, WORLD_W - cartHalf - 10);
      world.flash = Math.max(0, world.flash - dt * 2.6);

      if (world.phase === 'ready') {
        if (left || right || keys.held.current.action || targetRef.current !== null) {
          world.phase = 'running';
        }
      } else {
        world.time += dt;

        world.spawnLeft -= dt;
        if (world.spawnLeft <= 0 && world.cards.length < maxCards) {
          /* 가장 적은 상자의 카드가 오래 안 나오면 아무리 잘해도 이길 수 없다.
             네 번 연속 지나갔으면 그 모양을 반드시 한 장 떨어뜨려 길을 열어 준다. */
          let lag = -1;
          for (let i = 0; i < kinds.length; i += 1) {
            if (world.counts[i] >= stage.target) continue;
            if (lag < 0 || world.counts[i] < world.counts[lag]) lag = i;
          }
          let kindIndex = pickKind(world.random, kinds);
          if (lag >= 0 && world.sinceLag >= 4) {
            kindIndex = lag;
            world.sinceLag = 0;
          } else if (kindIndex === lag) {
            world.sinceLag = 0;
          } else {
            world.sinceLag += 1;
          }
          world.cards.push({
            x: randRange(world.random, 90, WORLD_W - 90),
            y: -30,
            kind: kindIndex,
          });
          world.spawnLeft = spawnInterval * randRange(world.random, 0.82, 1.2);
        }

        for (let i = world.cards.length - 1; i >= 0; i -= 1) {
          const card = world.cards[i];
          card.y += fallSpeed * dt;
          const atCart = card.y >= CART_TOP - 8 && card.y <= CART_TOP + 30;
          if (atCart && Math.abs(card.x - world.cartX) <= cartHalf + 10) {
            world.counts[card.kind] += 1;
            world.cards.splice(i, 1);
            world.flash = 1;
            playSound('select');
          } else if (card.y > FLOOR_Y) {
            world.cards.splice(i, 1);
            // 바닥 더미는 계속 늘어나면 그림이 지저분해지므로 앞에서부터 밀어낸다.
            world.pile.push(card);
            if (world.pile.length > 22) world.pile.shift();
          }
        }

        const maxCount = Math.max(...world.counts);
        const minCount = Math.min(...world.counts);
        if (maxCount - minCount >= GAP_LIMIT) world.warn = Math.min(warnLimit, world.warn + dt);
        else world.warn = Math.max(0, world.warn - dt * 1.5);

        const secLeft = Math.ceil(Math.max(0, totalTime - world.time));
        if (secLeft !== hud.sec || world.counts.some((count, i) => count !== hud.counts[i])) {
          setHud({ counts: world.counts.slice(), sec: secLeft });
        }

        if (world.counts.every((count) => count >= stage.target)) {
          world.finished = true;
          game.succeed('배움 상자를 고르게 채웠어요. 아이미가 모든 모양을 또렷하게 알아봅니다!');
        } else if (world.warn >= warnLimit) {
          world.finished = true;
          const heavy = kinds[world.counts.indexOf(maxCount)].name;
          game.fail(`${heavy}만 잔뜩 배워서 아이미가 다른 모양을 놓쳤어요. 적게 담긴 상자부터 채워 주세요.`);
        } else if (world.time >= totalTime) {
          world.finished = true;
          game.fail('시간이 끝났어요. 흔한 모양은 흘려보내고 적은 상자를 먼저 채워 주세요.');
        }
      }
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    for (let i = 0; i < world.pile.length; i += 1) {
      const item = world.pile[i];
      const kind = kinds[item.kind];
      drawShape(ctx, kind.shape, item.x, FLOOR_Y - 14 - (i % 3) * 4, 10, kind.fill, kind.edge, 0.4);
    }

    for (const card of world.cards) {
      const kind = kinds[card.kind];
      drawShape(ctx, kind.shape, card.x, card.y, CARD_R, kind.fill, kind.edge);
    }

    // 손수레 — 받는 입을 밝게 그려 어디에 닿아야 들어가는지 눈으로 알게 한다.
    panel(ctx, world.cartX - cartHalf, CART_TOP, cartHalf * 2, 30, BOARD.surface, PLAY.hero, 10);
    panel(ctx, world.cartX - cartHalf + 6, CART_TOP - 7, cartHalf * 2 - 12, 11, PLAY.hero, PLAY.heroEdge, 5);
    centerText(ctx, '손수레', world.cartX, CART_TOP + 16, 22, BOARD.ink);
    for (const side of [-1, 1]) {
      ctx.fillStyle = BOARD.overlay;
      ctx.strokeStyle = PLAY.heroEdge;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(world.cartX + side * cartHalf * 0.55, CART_TOP + 36, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    if (world.flash > 0) {
      ctx.strokeStyle = PLAY.goal;
      ctx.lineWidth = 4;
      ctx.globalAlpha = world.flash;
      ctx.strokeRect(world.cartX - cartHalf - 5, CART_TOP - 12, cartHalf * 2 + 10, 48);
      ctx.globalAlpha = 1;
    }

    ctx.strokeStyle = 'rgba(100, 116, 139, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 12]);
    ctx.beginPath();
    ctx.moveTo(24, FLOOR_Y);
    ctx.lineTo(WORLD_W - 24, FLOOR_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    // 배움 상자 — 개수와 채움 막대가 이 게임의 진짜 점수판이다.
    const boxCount = kinds.length;
    const boxW = (912 - 12 * (boxCount - 1)) / boxCount;
    const lowest = Math.min(...world.counts);
    for (let i = 0; i < boxCount; i += 1) {
      const kind = kinds[i];
      const bx = 24 + i * (boxW + 12);
      const done = world.counts[i] >= stage.target;
      panel(ctx, bx, BOX_TOP, boxW, 74, BOARD.surface, done ? PLAY.goal : kind.edge, 12);
      drawShape(ctx, kind.shape, bx + 36, BOX_TOP + 32, 20, kind.fill, kind.edge);
      centerText(ctx, kind.name, bx + boxW / 2 + 24, BOX_TOP + 20, 22, BOARD.inkDim);
      centerText(
        ctx, `${world.counts[i]} / ${stage.target}`,
        bx + boxW / 2 + 24, BOX_TOP + 46, 26, done ? PLAY.goal : BOARD.ink,
      );
      panel(ctx, bx + 14, BOX_TOP + 60, boxW - 28, 10, BOARD.overlay, BOARD.line, 5);
      const ratio = clamp(world.counts[i] / stage.target, 0, 1);
      if (ratio > 0) {
        ctx.fillStyle = done ? PLAY.goal : kind.fill;
        fillRoundRect(ctx, bx + 16, BOX_TOP + 62, (boxW - 32) * ratio, 6, 3);
      }
      // 가장 적은 상자에 화살표를 세워 "지금 받을 것"을 글자 없이 알린다.
      if (!done && world.counts[i] === lowest) {
        centerText(ctx, '▲', bx + boxW / 2, BOX_TOP - 8, 26, PLAY.goal);
      }
    }

    // 아이미의 눈 — 상자가 치우치면 여기가 먼저 흐려진다. 이 게임의 유일한 읽을 글이다.
    const blurred = world.warn > 0;
    panel(ctx, 24, 10, 912, 84, BOARD.overlay, blurred ? PLAY.hazard : PLAY.info, 14);
    ctx.fillStyle = blurred ? '#334155' : BOARD.ink;
    ctx.strokeStyle = blurred ? PLAY.hazard : PLAY.info;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(74, 44, 30, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = BOARD.bg;
    ctx.beginPath();
    ctx.arc(74, 44, blurred ? 8 : 11, 0, Math.PI * 2);
    ctx.fill();
    centerText(ctx, '아이미의 눈', 74, 79, 20, BOARD.inkDim);

    const heavyIndex = world.counts.indexOf(Math.max(...world.counts));
    if (blurred) {
      /* 흐림은 캔버스 필터 대신 같은 도형을 조금씩 어긋나게 겹쳐 표현한다. 필터는 브라우저마다
         다르게 나오지만 겹쳐 그리기는 어디서나 같은 그림이 된다. */
      const heavy = kinds[heavyIndex];
      for (let i = 0; i < 3; i += 1) {
        const jitter = Math.sin(world.time * 6 + i) * 3;
        drawShape(ctx, heavy.shape, 146 + i * 46 + jitter, 46, 16, heavy.fill, heavy.edge, 0.4);
        drawShape(ctx, heavy.shape, 146 + i * 46 - jitter, 42, 16, heavy.fill, heavy.edge, 0.4);
      }
      centerText(ctx, `${heavy.name}만 자꾸 보여요`, 630, 46, 28, BOARD.ink);
    } else {
      kinds.forEach((kind, i) => drawShape(ctx, kind.shape, 146 + i * 46, 44, 16, kind.fill, kind.edge));
      centerText(ctx, '모든 모양을 알아봅니다', 630, 46, 28, BOARD.ink);
    }

    if (world.warn > 0) {
      panel(ctx, 24, 100, 912, 12, BOARD.overlay, BOARD.line, 6);
      ctx.fillStyle = PLAY.hazard;
      fillRoundRect(ctx, 26, 102, (908 * world.warn) / warnLimit, 8, 4);
    }

    if (world.phase === 'ready' && !world.finished) {
      panel(ctx, WORLD_W / 2 - 280, 200, 560, 74, BOARD.overlay, PLAY.hero, 16);
      centerText(ctx, '손수레를 움직이면 카드가 떨어집니다', WORLD_W / 2, 226, 26, BOARD.ink);
      centerText(ctx, '방향키 ← → 또는 화면 끌기', WORLD_W / 2, 254, 24, BOARD.inkDim);
    }
  };

  const filled = hud.counts.filter((count) => count >= stage.target).length;

  return (
    <MiniGameFrame
      badge="배움 상자 골고루"
      instruction={`손수레를 방향키나 끌기로 움직여 떨어지는 카드를 받으세요. 배움 상자 ${stage.kinds.length}개를 모두 ${stage.target}장으로 똑같이 채우면 성공하고, 이미 많은 모양은 일부러 흘려보냅니다.`}
      progress={{ label: '가득 찬 배움 상자', value: filled, max: stage.kinds.length }}
      hud={<GameHud timeLeft={hud.sec} timeTotal={totalTime} score={hud.counts.reduce((sum, count) => sum + count, 0)} scoreLabel="받은 카드" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].title} 판으로 바꿨어요.`)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 담기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase !== 'up') targetRef.current = pointer.x;
            }}
            ariaLabel={`떨어지는 모양 카드를 손수레로 받아 배움 상자를 고르게 채우는 놀이. 가득 찬 상자 ${filled}개, 남은 시간 ${hud.sec}초.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
