import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, randRange, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l3 · 레이저로 고르기 (장르 27 · 조준 슈팅)
 *
 * "구체적으로 말할수록 아이미가 정확히 찾아 준다"를 **보이는 정도**로 만든다.
 * 말 조각을 하나도 붙이지 않으면 내려오는 물건이 모두 흐릿해 무엇인지 알 수 없고,
 * 종류·색·개수를 붙일수록 맞는 물건만 또렷해진다.
 *
 * 레이저는 언제든 쏠 수 있다. 어려운 것은 조준이 아니라 "무엇을 쏠지 알아보는 일"이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const GUN_Y = WORLD_H - 54;

interface Item {
  id: number;
  x: number;
  y: number;
  vy: number;
  kind: string;
  label: string;
  color: string;
  target: boolean;
  hit: boolean;
}

interface Chip {
  id: string;
  text: string;
  /** 이 말을 붙이면 또렷해지는 물건의 조건 */
  reveals: (kind: string) => boolean;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  goal: string;
  targetKind: string;
  need: number;
  pool: { kind: string; label: string; color: string }[];
  chips: Chip[];
}

const STAGES: StageConfig[] = [
  {
    id: 'pencil',
    label: '기본',
    spoken: '빨간 색연필만 골라 쏘세요.',
    goal: '빨간 색연필',
    targetKind: 'red-pencil',
    need: 5,
    pool: [
      { kind: 'red-pencil', label: '빨간 색연필', color: '#F87171' },
      { kind: 'blue-pencil', label: '파란 색연필', color: '#60A5FA' },
      { kind: 'crayon', label: '크레파스', color: '#4ADE80' },
      { kind: 'eraser', label: '지우개', color: '#FCD34D' },
    ],
    chips: [
      { id: 'kind', text: '색연필', reveals: (k) => k.endsWith('pencil') },
      { id: 'color', text: '빨간', reveals: (k) => k === 'red-pencil' },
    ],
  },
  {
    id: 'milk',
    label: '1단계',
    spoken: '작은 우유만 골라 쏘세요.',
    goal: '작은 우유',
    targetKind: 'small-milk',
    need: 6,
    pool: [
      { kind: 'small-milk', label: '작은 우유', color: '#E2E8F0' },
      { kind: 'big-milk', label: '큰 우유', color: '#94A3B8' },
      { kind: 'juice', label: '주스', color: '#FB923C' },
      { kind: 'bread', label: '빵', color: '#D6A347' },
    ],
    chips: [
      { id: 'kind', text: '우유', reveals: (k) => k.endsWith('milk') },
      { id: 'size', text: '작은', reveals: (k) => k === 'small-milk' },
    ],
  },
  {
    id: 'book',
    label: '2단계',
    spoken: '노란 그림책만 골라 쏘세요.',
    goal: '노란 그림책',
    targetKind: 'yellow-picture',
    need: 7,
    pool: [
      { kind: 'yellow-picture', label: '노란 그림책', color: '#FCD34D' },
      { kind: 'blue-picture', label: '파란 그림책', color: '#60A5FA' },
      { kind: 'yellow-note', label: '노란 공책', color: '#FDE68A' },
      { kind: 'story', label: '이야기책', color: '#C4B5FD' },
    ],
    chips: [
      { id: 'kind', text: '그림책', reveals: (k) => k.endsWith('picture') },
      { id: 'color', text: '노란', reveals: (k) => k === 'yellow-picture' },
    ],
  },
];

interface World {
  items: Item[];
  gunX: number;
  beam: number;
  spawn: number;
  nextId: number;
  got: number;
  lives: number;
  phase: 'ready' | 'play';
  finished: boolean;
}

export default function PreciseAimGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 내려오는 속도·간격·기회로 나타난다. 물건과 말 조각은 같다. */
  const fallSpeed = 70 * clamp(tuning.speed, 0.6, 1.35);
  const spawnEvery = 1.25 / clamp(tuning.density, 0.7, 1.35);
  const maxLives = tuning.lives;
  const itemR = 34 * clamp(tuning.size, 0.9, 1.2);

  const [chips, setChips] = useState<string[]>([]);
  const worldRef = useRef<World>({
    items: [], gunX: WORLD_W / 2, beam: 0, spawn: 0, nextId: 1,
    got: 0, lives: maxLives, phase: 'ready', finished: false,
  });
  const randomRef = useRef(createRandom(game.seed));
  const [hud, setHud] = useState({ got: 0, lives: maxLives });
  const keys = useGameKeys(game.playing);
  const pointerRef = useRef<number | null>(null);

  useEffect(() => {
    randomRef.current = createRandom(game.seed);
    worldRef.current = {
      items: [], gunX: WORLD_W / 2, beam: 0, spawn: 0, nextId: 1,
      got: 0, lives: maxLives, phase: 'ready', finished: false,
    };
    setChips([]);
    setHud({ got: 0, lives: maxLives });
    pointerRef.current = null;
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  /** 붙인 말 조각으로 이 물건이 얼마나 또렷하게 보이는가. 0이면 무엇인지 알 수 없다. */
  const clarityOf = (kind: string) => {
    if (chips.length === 0) return 0;
    const matched = stage.chips.filter((chip) => chips.includes(chip.id) && chip.reveals(kind)).length;
    const applied = stage.chips.filter((chip) => chips.includes(chip.id)).length;
    return applied === 0 ? 0 : matched / applied;
  };

  const fire = () => {
    const w = worldRef.current;
    if (!game.playing || w.finished) return;
    if (w.phase === 'ready') { w.phase = 'play'; return; }
    w.beam = 0.16;
    playSound('select');

    // 레이저는 총구 바로 위 세로줄. 그 줄에 가장 가까운 물건 하나를 맞힌다.
    const target = w.items
      .filter((item) => !item.hit && Math.abs(item.x - w.gunX) <= itemR)
      .sort((a, b) => b.y - a.y)[0];
    if (!target) return;

    target.hit = true;
    if (target.target) {
      w.got += 1;
      playSound('confirm');
      setHud({ got: w.got, lives: w.lives });
      if (w.got >= stage.need) {
        w.finished = true;
        game.succeed(`${stage.goal}만 골라 담았어요. 말을 구체적으로 붙이니 무엇인지 또렷하게 보였습니다.`);
      }
    } else {
      w.lives -= 1;
      setHud({ got: w.got, lives: w.lives });
      if (w.lives <= 0) {
        w.finished = true;
        game.fail(`${stage.goal}이 아닌 것을 쐈어요. 말 조각을 붙여 또렷하게 만든 다음 쏴 봐요.`);
      }
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    const random = randomRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      if (pointerRef.current !== null) w.gunX = pointerRef.current;
      if (keys.held.current.left) w.gunX -= 460 * dt;
      if (keys.held.current.right) w.gunX += 460 * dt;
      w.gunX = clamp(w.gunX, 40, WORLD_W - 40);
      if (keys.consumePress('action')) fire();
      w.beam = Math.max(0, w.beam - dt);

      if (w.phase === 'play') {
        w.spawn -= dt;
        if (w.spawn <= 0) {
          w.spawn = spawnEvery;
          const spec = stage.pool[Math.floor(random() * stage.pool.length)];
          w.items.push({
            id: w.nextId += 1,
            x: randRange(random, 70, WORLD_W - 70),
            y: -itemR,
            vy: fallSpeed * randRange(random, 0.9, 1.15),
            kind: spec.kind,
            label: spec.label,
            color: spec.color,
            target: spec.kind === stage.targetKind,
            hit: false,
          });
        }
        for (const item of w.items) {
          if (item.hit) continue;
          item.y += item.vy * dt;
        }
        // 목표 물건을 놓치면 기회가 준다. 목표가 아닌 것은 그냥 지나가도 괜찮다.
        for (const item of w.items) {
          if (item.hit || item.y < WORLD_H + itemR) continue;
          item.hit = true;
          if (!item.target) continue;
          w.lives -= 1;
          setHud({ got: w.got, lives: w.lives });
          if (w.lives <= 0 && !w.finished) {
            w.finished = true;
            game.fail(`${stage.goal}을 놓쳤어요. 말 조각을 붙여 또렷하게 만든 다음 쏴 봐요.`);
          }
        }
        w.items = w.items.filter((item) => !item.hit || item.y < WORLD_H + 120);
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    panel(ctx, WORLD_W / 2 - 250, 12, 500, 46, BOARD.overlay, PLAY.goal, 12);
    centerText(ctx, `골라 담을 것 · ${stage.goal}`, WORLD_W / 2, 36, 24, BOARD.ink);

    for (const item of w.items) {
      if (item.hit) continue;
      const clarity = clarityOf(item.kind);
      ctx.globalAlpha = 0.28 + clarity * 0.72;
      ctx.beginPath();
      ctx.arc(item.x, item.y, itemR, 0, Math.PI * 2);
      ctx.fillStyle = clarity > 0 ? item.color : '#475569';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = clarity >= 1 ? PLAY.goal : BOARD.line;
      ctx.stroke();
      if (clarity > 0.4) centerText(ctx, item.label, item.x, item.y + itemR + 18, 20, BOARD.ink);
      else centerText(ctx, '?', item.x, item.y, 30, BOARD.ink);
      ctx.globalAlpha = 1;
    }

    if (w.beam > 0) {
      ctx.strokeStyle = PLAY.hero;
      ctx.lineWidth = 8;
      ctx.globalAlpha = w.beam / 0.16;
      ctx.beginPath();
      ctx.moveTo(w.gunX, GUN_Y - 20);
      ctx.lineTo(w.gunX, 70);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    panel(ctx, w.gunX - 44, GUN_Y - 20, 88, 44, BOARD.surface, PLAY.hero, 10);
    centerText(ctx, '🔫', w.gunX, GUN_Y + 2, 28, BOARD.ink);

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 250, WORLD_H / 2 - 34, 500, 68, BOARD.overlay, PLAY.hero, 14);
      centerText(ctx, '판을 누르거나 스페이스를 누르면 시작합니다', WORLD_W / 2, WORLD_H / 2, 24, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="레이저로 고르기"
      instruction="말 조각을 붙일수록 내려오는 물건이 또렷해집니다. 좌우로 옮겨 골라 담을 것만 쏘세요."
      progress={{ label: '담은 것', value: hud.got, max: stage.need }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={fire} disabled={!game.playing} emoji="⚡" label="쏘기" variant="primary" />
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {stage.chips.map((chip) => {
            const on = chips.includes(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  playSound('select');
                  setChips((prev) => (prev.includes(chip.id) ? prev.filter((x) => x !== chip.id) : [...prev, chip.id]));
                }}
                aria-pressed={on}
                disabled={!game.playing}
                className="min-h-11 rounded-xl px-3 text-[15px] font-black transition"
                style={{
                  background: on ? '#38BDF8' : 'var(--board-surface)',
                  color: on ? '#0F172A' : 'var(--board-ink)',
                  border: '2px solid #38BDF8',
                }}
              >
                {on ? '＋ ' : ''}{chip.text}
              </button>
            );
          })}
          <span className="text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
            말 조각을 붙이면 물건이 또렷해집니다
          </span>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="game-canvas-fit">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                pointerRef.current = pointer.x;
                if (pointer.phase === 'down') fire();
                if (pointer.phase === 'up') pointerRef.current = null;
              }}
              ariaLabel={`${stage.goal}만 골라 쏘는 놀이. 담은 것 ${hud.got}개, 남은 기회 ${hud.lives}개.`}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
