import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, circleHit, clamp, createRandom, dist, panel,
  randRange, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m4-l6 · 불편한 화면 피하기 (장르 24 · 탄막 피하기)
 *
 * "불편한 화면을 만나면 거리를 두고 믿을 만한 사람에게 알린다"를 몸으로 만든다.
 * 조각은 느리고 크며 피할 길이 늘 있다. 맞서 없애는 것이 아니라 닿지 않는 것이 규칙이다.
 *
 * 한 파도를 넘기려면 안전지대에 3초 머물러야 한다. 안전지대는 파도마다 자리를 옮긴다 —
 * 어른에게 알리는 일이 한 번으로 끝나지 않음을 조작으로 남긴다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

/*
 * 위험 신호는 글자가 아니라 도형으로 구분한다.
 *
 * 앞서는 조각 안에 신호 이름을 20px로 적었다. 그런데 조각의 지름은 84~116px인데
 * '사진을 보내라는 말'은 200px이라 글자가 조각 밖으로 한참 삐져나왔고, 조각 여럿이
 * 겹치면 어느 글자가 어느 조각의 것인지도 알 수 없었다.
 *
 * 신호의 이름은 판 아래 띠에서 읽고, 판 위에서는 모양으로만 구분한다. 색만으로
 * 나누지 않는 것은 색을 구별하기 어려운 학생도 모양은 셀 수 있기 때문이다.
 */
type ShapeKind = 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'star';

const SHAPE_KINDS: ShapeKind[] = ['triangle', 'square', 'pentagon', 'hexagon', 'star'];

/** 꼭짓점이 적을수록 같은 반지름에서 작아 보인다. 눈에 비슷한 크기로 맞추는 배율. */
const SHAPE_SCALE: Record<ShapeKind, number> = {
  triangle: 1.15, square: 1.06, pentagon: 1.02, hexagon: 1, star: 1.12,
};

/** 판정 반지름 배율. 도형 안쪽에 들어오는 원의 크기라, 모서리 밖은 닿아도 봐준다. */
const SHAPE_HIT: Record<ShapeKind, number> = {
  triangle: 0.55, square: 0.7, pentagon: 0.76, hexagon: 0.8, star: 0.5,
};

/** 도형의 꼭짓점. 캔버스와 판 아래 띠의 작은 표시가 같은 계산을 쓴다. */
function shapePoints(kind: ShapeKind, cx: number, cy: number, r: number): Array<[number, number]> {
  const start = -Math.PI / 2;
  if (kind === 'star') {
    return Array.from({ length: 10 }, (_, i) => {
      const radius = i % 2 === 0 ? r : r * 0.46;
      const a = start + (i * Math.PI) / 5;
      return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius] as [number, number];
    });
  }
  const sides = kind === 'triangle' ? 3 : kind === 'square' ? 4 : kind === 'pentagon' ? 5 : 6;
  // 사각형만 반 칸 돌린다. 꼭짓점을 위로 두면 마름모로 서서 '네모'로 읽히지 않는다.
  const turn = kind === 'square' ? Math.PI / 4 : 0;
  return Array.from({ length: sides }, (_, i) => {
    const a = start + turn + (i * Math.PI * 2) / sides;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number];
  });
}

function traceShape(ctx: CanvasRenderingContext2D, kind: ShapeKind, cx: number, cy: number, r: number): void {
  const pts = shapePoints(kind, cx, cy, r * SHAPE_SCALE[kind]);
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

/** 판 아래 띠에 붙는 작은 도형. 판 위의 조각과 같은 모양이라 눈으로 이어진다. */
function ShapeMark({ kind }: { kind: ShapeKind }) {
  const pts = shapePoints(kind, 11, 11, 9.5 * SHAPE_SCALE[kind])
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
      <polygon points={pts} fill="#3F1D2B" stroke="#F87171" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** stage.signals의 몇 번째 신호인가. 모양과 이름표가 여기서 함께 나온다. */
  signal: number;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  signals: string[];
  waves: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'scary',
    label: '기본',
    spoken: '무서운 화면에서 거리를 두어요.',
    waves: 3,
    signals: ['무서운 그림', '큰 소리', '갑자기 뜬 창'],
  },
  {
    id: 'mean',
    label: '1단계',
    spoken: '놀리는 말에서 거리를 두어요.',
    waves: 3,
    signals: ['놀리는 말', '욕이 섞인 글', '괴롭히는 사진', '이상한 별명'],
  },
  {
    id: 'ask',
    label: '2단계',
    spoken: '이상한 요구에서 거리를 두어요.',
    waves: 3,
    signals: ['이상한 요구', '비밀로 하라는 말', '만나자는 말', '돈을 달라는 말', '사진을 보내라는 말'],
  },
];

interface World {
  x: number;
  y: number;
  shards: Shard[];
  wave: number;
  safeX: number;
  safeY: number;
  hold: number;
  lives: number;
  timer: number;
  phase: 'ready' | 'dodge';
  finished: boolean;
  named: string[];
}

const HOLD_NEED = 3;

export default function UncomfortableDodgeGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 조각의 속도·수·내 몸 크기로 나타난다. 파도 수와 신호는 같다. */
  const shardSpeed = 78 * clamp(tuning.speed, 0.6, 1.35);
  const shardCount = clamp(Math.round(4 * tuning.density), 2, 8);
  const heroR = 20 * clamp(tuning.size, 0.85, 1.3);
  const safeR = 74 * clamp(tuning.size, 0.9, 1.25);
  const maxLives = tuning.lives;

  const worldRef = useRef<World>({
    x: WORLD_W / 2, y: WORLD_H / 2, shards: [], wave: 0, safeX: 140, safeY: 140,
    hold: 0, lives: maxLives, timer: 0, phase: 'ready', finished: false, named: [],
  });
  const randomRef = useRef(createRandom(game.seed));
  const [hud, setHud] = useState({ wave: 0, lives: maxLives, hold: 0, named: [] as string[] });
  const keys = useGameKeys(game.playing);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const spawnWave = (w: World) => {
    const random = randomRef.current;
    w.shards = Array.from({ length: shardCount + w.wave }, () => {
      const side = Math.floor(random() * 4);
      const along = randRange(random, 60, side % 2 === 0 ? WORLD_W - 60 : WORLD_H - 60);
      const x = side === 0 ? along : side === 1 ? WORLD_W + 60 : side === 2 ? along : -60;
      const y = side === 0 ? -60 : side === 1 ? along : side === 2 ? WORLD_H + 60 : along;
      const tx = randRange(random, 200, WORLD_W - 200);
      const ty = randRange(random, 140, WORLD_H - 140);
      const d = Math.max(1, dist(x, y, tx, ty));
      return {
        x, y,
        vx: ((tx - x) / d) * shardSpeed,
        vy: ((ty - y) / d) * shardSpeed,
        r: randRange(random, 42, 58),
        signal: Math.floor(random() * stage.signals.length),
      };
    });
    w.safeX = randRange(random, 140, WORLD_W - 140);
    w.safeY = randRange(random, 120, WORLD_H - 120);
    w.hold = 0;
  };

  useEffect(() => {
    randomRef.current = createRandom(game.seed);
    const w: World = {
      x: WORLD_W / 2, y: WORLD_H / 2, shards: [], wave: 0, safeX: 160, safeY: 150,
      hold: 0, lives: maxLives, timer: 0, phase: 'ready', finished: false, named: [],
    };
    spawnWave(w);
    worldRef.current = w;
    setHud({ wave: 0, lives: maxLives, hold: 0, named: [] });
    dragRef.current = null;
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      const moving = keys.held.current.left || keys.held.current.right
        || keys.held.current.up || keys.held.current.down || dragRef.current !== null;
      if (w.phase === 'ready') {
        if (moving) w.phase = 'dodge';
      } else {
        if (dragRef.current) {
          w.x += (dragRef.current.x - w.x) * Math.min(1, dt * 9);
          w.y += (dragRef.current.y - w.y) * Math.min(1, dt * 9);
        } else {
          const dx = (keys.held.current.left ? -1 : 0) + (keys.held.current.right ? 1 : 0);
          const dy = (keys.held.current.up ? -1 : 0) + (keys.held.current.down ? 1 : 0);
          w.x += dx * 300 * dt;
          w.y += dy * 300 * dt;
        }
        w.x = clamp(w.x, heroR, WORLD_W - heroR);
        w.y = clamp(w.y, heroR, WORLD_H - heroR);

        for (const shard of w.shards) {
          shard.x += shard.vx * dt;
          shard.y += shard.vy * dt;
          if (shard.x < -120) shard.x = WORLD_W + 100;
          if (shard.x > WORLD_W + 120) shard.x = -100;
          if (shard.y < -120) shard.y = WORLD_H + 100;
          if (shard.y > WORLD_H + 120) shard.y = -100;
          const hitR = shard.r * SHAPE_HIT[SHAPE_KINDS[shard.signal % SHAPE_KINDS.length]];
          if (w.timer <= 0 && circleHit(w.x, w.y, heroR, shard.x, shard.y, hitR)) {
            w.lives -= 1;
            w.timer = 1.4;
            playSound('select');
          }
        }
        w.timer = Math.max(0, w.timer - dt);

        if (dist(w.x, w.y, w.safeX, w.safeY) < safeR) {
          w.hold += dt;
          if (w.hold >= HOLD_NEED) {
            /* 이 파도에 실제로 떠 있던 신호 가운데 아직 기록하지 않은 것을 남긴다.
               앞서는 0번 조각의 신호를 그대로 썼는데, 그 조각은 학생이 피한 것과 아무
               상관이 없고 같은 신호가 거듭 뽑히면 세 파도를 넘겨도 기록이 하나뿐이었다. */
            const present = w.shards.map((s) => stage.signals[s.signal % stage.signals.length]);
            const named = present.find((n) => !w.named.includes(n))
              ?? stage.signals.find((n) => !w.named.includes(n));
            if (named) w.named.push(named);
            w.wave += 1;
            playSound('stamp');
            if (w.wave >= stage.waves) {
              w.finished = true;
              game.succeed('불편한 화면과 거리를 두고 믿을 만한 어른에게 알렸어요. 위험 신호에 이름도 붙였습니다.');
            } else {
              spawnWave(w);
              w.phase = 'ready';
            }
          }
        } else {
          w.hold = Math.max(0, w.hold - dt * 0.7);
        }

        if (w.lives <= 0 && !w.finished) {
          w.finished = true;
          game.fail('불편한 화면에 닿았어요. 멀리 돌아 안전지대로 가 봐요.');
        }
      }

      if (w.wave !== hud.wave || w.lives !== hud.lives
        || Math.abs(w.hold - hud.hold) > 0.12 || w.named.length !== hud.named.length) {
        setHud({ wave: w.wave, lives: w.lives, hold: w.hold, named: [...w.named] });
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 안전지대
    ctx.beginPath();
    ctx.arc(w.safeX, w.safeY, safeR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 222, 128, 0.14)';
    ctx.fill();
    ctx.strokeStyle = PLAY.goal;
    ctx.lineWidth = 4;
    ctx.stroke();
    /* 이름표는 원 위에 올린다.
       원 안에 맞추려면 고등 수준(반지름 66.6)에서 글자를 20 단위 아래로 줄여야 하는데,
       캔버스 글자의 하한은 20 단위다(engine/palette.ts). 원 밖으로 올리면 폭 제약이
       사라지고, 안전지대는 화면 안쪽에만 놓이므로 이름표가 판을 벗어나지도 않는다. */
    centerText(ctx, '믿을 만한 어른', w.safeX, w.safeY - safeR - 18, 22, PLAY.goal);
    centerText(ctx, `${Math.max(0, HOLD_NEED - w.hold).toFixed(1)}초`, w.safeX, w.safeY, 26, BOARD.ink);

    for (const shard of w.shards) {
      const kind = SHAPE_KINDS[shard.signal % SHAPE_KINDS.length];
      traceShape(ctx, kind, shard.x, shard.y, shard.r);
      ctx.fillStyle = '#3F1D2B';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = PLAY.hazard;
      ctx.lineJoin = 'round';
      ctx.stroke();
      // 가운데의 작은 가위표. 어떤 모양이든 같은 자리에 같은 크기로 들어가 밖으로 넘지 않는다.
      const mark = shard.r * 0.26;
      ctx.strokeStyle = PLAY.hazard;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(shard.x - mark, shard.y - mark);
      ctx.lineTo(shard.x + mark, shard.y + mark);
      ctx.moveTo(shard.x + mark, shard.y - mark);
      ctx.lineTo(shard.x - mark, shard.y + mark);
      ctx.stroke();
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
    }

    ctx.globalAlpha = w.timer > 0 ? 0.45 : 1;
    ctx.beginPath();
    ctx.arc(w.x, w.y, heroR, 0, Math.PI * 2);
    ctx.fillStyle = PLAY.hero;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 250, WORLD_H - 88, 500, 56, BOARD.overlay, PLAY.hero, 14);
      centerText(ctx, '방향키나 끌기로 움직이면 시작합니다', WORLD_W / 2, WORLD_H - 60, 24, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="불편한 화면 피하기"
      instruction="빨간색 위험 구역을 피해 초록색 안전 구역으로 이동한 뒤 3초 동안 머물러 보세요."
      progress={{ label: '넘긴 파도', value: hud.wave, max: stage.waves }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} timeLeft={Math.max(0, HOLD_NEED - hud.hold)} timeTotal={HOLD_NEED} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="game-canvas-fit">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                if (pointer.phase === 'up') { dragRef.current = null; return; }
                dragRef.current = { x: pointer.x, y: pointer.y };
              }}
              ariaLabel={`불편한 화면을 피해 안전지대로 가는 놀이. 넘긴 파도 ${hud.wave}개, 남은 기회 ${hud.lives}개.`}
            />
          </div>
        </div>
        <p
          className="min-h-[38px] rounded-xl px-3 py-1.5 text-[15px] font-bold"
          style={{ background: 'var(--board-surface)', border: '2px solid #4ADE80', color: 'var(--board-ink)' }}
        >
          {hud.named.length > 0 ? (
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>어른에게 알린 위험 신호</span>
              {hud.named.map((name) => (
                <span key={name} className="inline-flex items-center gap-1.5">
                  <ShapeMark kind={SHAPE_KINDS[stage.signals.indexOf(name) % SHAPE_KINDS.length]} />
                  {name}
                </span>
              ))}
            </span>
          ) : (
            '판 위의 도형은 모두 피할 신호입니다. 안전지대에 머무르면 그 신호에 이름을 붙여 기록합니다.'
          )}
        </p>
      </div>
    </MiniGameFrame>
  );
}
