import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, BauhausMark, GameCanvas, GameHud, STROKE, centerText, circleHit, clamp,
  createRandom, dist, drawBar, drawShape, randRange, useGameKeys,
} from '../engine';
import type { ShapeKind } from '../engine';
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
 * 앞서는 조각 안에 신호 이름을 20px로 적었다. 조각의 지름은 84~116px인데
 * '사진을 보내라는 말'은 200px이라 글자가 조각 밖으로 한참 삐져나왔다. 이름은 판 아래
 * 띠에서 읽고, 판 위에서는 모양으로만 구분한다.
 *
 * 도형은 바우하우스 어휘에서 고르되 **원과 사각형은 뺀다.** 그 둘은 학생(노랑 원)과
 * 안전지대(파랑 사각형)의 자리라, 위험 조각이 같은 모양을 쓰면 뜻이 겹친다.
 * 다섯 조각은 모두 빨강이다 — 색이 역할(위험)을 지고, 모양이 종류(어느 신호)를 진다.
 */
const SIGNAL_SHAPES: ShapeKind[] = ['triangle', 'diamond', 'cross', 'bar', 'semicircle'];

/** 판 아래 띠에 붙는 같은 모양. 판 위에서 본 것을 설명에서 다시 만난다. */
const SIGNAL_MARKS = ['triangle', 'diamond', 'plus', 'bar', 'semicircle'] as const;

/** 판정 반지름 배율. 도형 안쪽에 들어오는 원의 크기라 모서리 밖은 닿아도 봐준다. */
const SHAPE_HIT: Record<string, number> = {
  triangle: 0.55, diamond: 0.62, cross: 0.6, bar: 0.5, semicircle: 0.6,
};

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
          const hitR = shard.r * SHAPE_HIT[SIGNAL_SHAPES[shard.signal % SIGNAL_SHAPES.length]];
          if (w.timer <= 0 && circleHit(w.x, w.y, heroR, shard.x, shard.y, hitR)) {
            w.lives -= 1;
            w.timer = 1.4;
            playSound('select');
          }
        }
        w.timer = Math.max(0, w.timer - dt);

        /* 안전지대는 사각형이므로 사각형으로 잰다. 원으로 재면 모서리에 선 학생이
           그림상 안에 있는데도 세어지지 않는다. */
        if (Math.abs(w.x - w.safeX) <= safeR && Math.abs(w.y - w.safeY) <= safeR) {
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

    ctx.fillStyle = BAUHAUS.board.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    /* 안전지대는 파랑 사각형이다. 바우하우스 어휘에서 목표의 자리다. */
    drawShape(ctx, 'square', w.safeX, w.safeY, safeR * 2, {
      fill: BAUHAUS.board.blue, stroke: BAUHAUS.board.keyline, width: STROKE.hair,
    });
    /* 이름표는 사각형 위에 올린다. 안쪽에 맞추려면 글자를 20 단위 아래로 줄여야 하는데
       캔버스 글자의 하한이 20 단위라(engine/palette.ts) 안에 넣을 수 없다. */
    centerText(ctx, '믿을 만한 어른', w.safeX, w.safeY - safeR - 26, 22, BAUHAUS.board.blue);
    centerText(ctx, `${Math.max(0, HOLD_NEED - w.hold).toFixed(1)}초`, w.safeX, w.safeY, 30, BAUHAUS.board.ground);

    for (const shard of w.shards) {
      const kind = SIGNAL_SHAPES[shard.signal % SIGNAL_SHAPES.length];
      drawShape(ctx, kind, shard.x, shard.y, shard.r * 2, {
        fill: BAUHAUS.board.red, stroke: BAUHAUS.board.keyline, width: STROKE.hair,
      });
    }

    /* 학생은 노랑 원이다. 닿은 직후에는 얇게 그려 무적 상태를 알린다. */
    ctx.globalAlpha = w.timer > 0 ? 0.45 : 1;
    drawShape(ctx, 'circle', w.x, w.y, heroR * 2, {
      fill: BAUHAUS.board.yellow, stroke: BAUHAUS.board.keyline, width: STROKE.base,
    });
    ctx.globalAlpha = 1;

    if (w.phase === 'ready' && !w.finished) {
      drawBar(ctx, WORLD_W / 2 - 240, WORLD_H - 88, 480, 56, {
        fill: BAUHAUS.board.ground, stroke: BAUHAUS.board.yellow, width: STROKE.base,
      });
      centerText(ctx, '방향키나 끌기로 움직이면 시작합니다', WORLD_W / 2, WORLD_H - 60, 24, BAUHAUS.board.ink);
    }
  };

  return (
    <MiniGameFrame
      bauhaus
      badge="불편한 화면 피하기"
      instruction="빨간 도형을 피해 파란 사각형 안으로 들어간 뒤 3초 동안 머물러 보세요."
      progress={{ label: '넘긴 파도', value: hud.wave, max: stage.waves }}
      hud={<GameHud bauhaus lives={hud.lives} maxLives={maxLives} timeLeft={Math.max(0, HOLD_NEED - hud.hold)} timeTotal={HOLD_NEED} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" variant="primary" />}
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
          className="min-h-[38px] px-3 py-1.5 text-[15px] font-bold"
          style={{
            background: 'var(--game-board)',
            border: 'var(--game-line) solid var(--game-board-blue)',
            color: 'var(--game-board-ink)',
          }}
        >
          {hud.named.length > 0 ? (
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>어른에게 알린 위험 신호</span>
              {hud.named.map((name) => (
                <span key={name} className="inline-flex items-center gap-1.5">
                  <BauhausMark kind={SIGNAL_MARKS[stage.signals.indexOf(name) % SIGNAL_MARKS.length]} size={22} />
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
