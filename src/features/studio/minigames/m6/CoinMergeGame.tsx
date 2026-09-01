import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, randInt, useGameKeys, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m6-l2 · 동전 합치기 (장르 15 · 숫자 합치기)
 *
 * "아이미가 말한 금액을 믿기 전에 계산기로 확인한다"를 밀어서 합치기로 만든다.
 * 같은 금액 두 개가 만나면 두 배가 된다. 목표 금액 타일을 만들면 성공이다.
 *
 * 화면에는 아이미가 말한 금액이 함께 떠 있는데 틀려 있다. 계산기 버튼을 누르면
 * 판의 실제 합계가 나와 아이미의 말과 견줄 수 있다.
 */

const SIZE = 4;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  goal: number;
  aimiSays: number;
  moves: number;
  items: { name: string; price: number; count: number }[];
}

const STAGES: StageConfig[] = [
  {
    id: 'snack',
    label: '기본',
    spoken: '간식 값을 계산기로 확인하며 동전을 합쳐요.',
    goal: 800,
    aimiSays: 700,
    moves: 34,
    items: [{ name: '사탕', price: 200, count: 2 }, { name: '젤리', price: 400, count: 1 }],
  },
  {
    id: 'stationery',
    label: '1단계',
    spoken: '학용품 값을 계산기로 확인하며 동전을 합쳐요.',
    goal: 1600,
    aimiSays: 1500,
    moves: 40,
    items: [{ name: '공책', price: 600, count: 2 }, { name: '연필', price: 200, count: 2 }],
  },
  {
    id: 'party',
    label: '2단계',
    spoken: '잔치 준비 값을 계산기로 확인하며 동전을 합쳐요.',
    goal: 3200,
    aimiSays: 2800,
    moves: 46,
    items: [{ name: '풍선', price: 400, count: 4 }, { name: '컵', price: 800, count: 2 }],
  },
];

type Grid = number[][];

function spawn(grid: Grid, random: () => number) {
  const free: [number, number][] = [];
  for (let r = 0; r < SIZE; r += 1) for (let c = 0; c < SIZE; c += 1) if (grid[r][c] === 0) free.push([r, c]);
  if (free.length === 0) return false;
  const [r, c] = free[randInt(random, 0, free.length)];
  grid[r][c] = random() < 0.8 ? 100 : 200;
  return true;
}

function buildGrid(seed: number): Grid {
  const random = createRandom(seed);
  const grid: Grid = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0));
  spawn(grid, random);
  spawn(grid, random);
  return grid;
}

/** 한 줄을 왼쪽으로 밀어 합친다. 합친 금액의 합도 함께 준다. */
function slideRow(row: number[]) {
  const values = row.filter((v) => v !== 0);
  const out: number[] = [];
  let moved = false;
  for (let i = 0; i < values.length; i += 1) {
    if (i + 1 < values.length && values[i] === values[i + 1]) {
      out.push(values[i] * 2);
      i += 1;
      moved = true;
    } else {
      out.push(values[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  if (!moved) moved = out.some((v, i) => v !== row[i]);
  return { row: out, moved };
}

function rotate(grid: Grid): Grid {
  const out: Grid = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0));
  for (let r = 0; r < SIZE; r += 1) for (let c = 0; c < SIZE; c += 1) out[c][SIZE - 1 - r] = grid[r][c];
  return out;
}

function move(grid: Grid, dir: number) {
  let work = grid.map((row) => row.slice());
  for (let i = 0; i < dir; i += 1) work = rotate(work);
  let moved = false;
  work = work.map((row) => {
    const result = slideRow(row);
    if (result.moved) moved = true;
    return result.row;
  });
  for (let i = dir; i < 4; i += 1) work = rotate(work);
  return { grid: work, moved };
}

const COLORS: Record<number, string> = {
  100: '#475569', 200: '#0369A1', 400: '#0F766E', 800: '#B45309',
  1600: '#7C3AED', 3200: '#BE123C', 6400: '#0E7490',
};

export default function CoinMergeGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 밀 수 있는 횟수로 나타난다. 목표 금액과 판 크기는 같다. */
  const moves = Math.round(stage.moves * clamp(tuning.tolerance, 0.8, 1.5));

  const [grid, setGrid] = useState<Grid>(() => buildGrid(game.seed));
  const [left, setLeft] = useState(moves);
  const [calcOpen, setCalcOpen] = useState(false);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const keys = useGameKeys(game.playing);

  const realTotal = stage.items.reduce((sum, item) => sum + item.price * item.count, 0);

  useEffect(() => {
    setGrid(buildGrid(game.seed));
    setLeft(moves);
    setCalcOpen(false);
    setNote('');
    setDone(false);
  }, [game.round, game.stageIndex, stage, game.seed, moves]);

  const push = (dir: number) => {
    if (!game.playing || done) return;
    const result = move(grid, dir);
    if (!result.moved) {
      setNote('그 방향으로는 움직이지 않아요.');
      return;
    }
    playSound('select');
    const random = createRandom(game.seed + left * 613);
    const next = result.grid.map((row) => row.slice());
    spawn(next, random);
    setGrid(next);
    const remaining = left - 1;
    setLeft(remaining);

    const best = Math.max(...next.flat());
    if (best >= stage.goal) {
      setDone(true);
      game.succeed(`${stage.goal.toLocaleString()}원 타일을 만들었어요. 계산기로 확인한 금액과 같습니다.`);
      return;
    }
    if (remaining <= 0) {
      setDone(true);
      game.fail('밀 횟수를 다 썼어요. 같은 금액끼리 붙여 두면 한 번에 합쳐집니다.');
      return;
    }
    const full = next.flat().every((v) => v !== 0);
    if (full) {
      const stuck = [0, 1, 2, 3].every((d) => !move(next, d).moved);
      if (stuck) {
        setDone(true);
        game.fail('판이 가득 차서 움직일 수 없어요. 같은 금액을 미리 모아 두면 좋습니다.');
      }
    }
  };

  useGameLoop(game.playing && !done, () => {
    if (keys.consumePress('left')) push(0);
    if (keys.consumePress('up')) push(1);
    if (keys.consumePress('right')) push(2);
    if (keys.consumePress('down')) push(3);
  });

  const best = Math.max(0, ...grid.flat());

  return (
    <MiniGameFrame
      badge="동전 합치기"
      instruction={`같은 금액 타일을 밀어 합치세요. ${stage.goal.toLocaleString()}원 타일을 만들면 됩니다. 방향키나 아래 버튼을 씁니다.`}
      progress={{ label: '가장 큰 금액', value: best, max: stage.goal }}
      hud={<GameHud score={left} scoreLabel="남은 밀기" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => push(0)} emoji="⬅️" label="왼쪽" />
          <MiniGameButton onClick={() => push(2)} emoji="➡️" label="오른쪽" />
          <MiniGameButton onClick={() => push(1)} emoji="⬆️" label="위" />
          <MiniGameButton onClick={() => push(3)} emoji="⬇️" label="아래" />
          <MiniGameButton
            onClick={() => { setCalcOpen(true); playSound('confirm'); }}
            emoji="🧮"
            label="계산기"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {stage.items.map((item) => (
            <span
              key={item.name}
              className="rounded-lg px-2 py-1 text-[15px] font-black"
              style={{ background: 'var(--board-surface)', border: '2px solid var(--board-line)', color: 'var(--board-ink)' }}
            >
              {item.name} {item.price.toLocaleString()}원 × {item.count}
            </span>
          ))}
          <span
            className="rounded-lg px-2 py-1 text-[15px] font-black"
            style={{
              background: 'var(--board-surface)',
              border: `2px solid ${calcOpen ? '#FB7185' : '#38BDF8'}`,
              color: 'var(--board-ink)',
            }}
          >
            아이미 · {stage.aimiSays.toLocaleString()}원{calcOpen ? ' (틀렸어요)' : ''}
          </span>
          {calcOpen && (
            <span
              className="rounded-lg px-2 py-1 text-[15px] font-black"
              style={{ background: 'rgba(74, 222, 128, 0.16)', border: '2px solid #4ADE80', color: 'var(--board-ink)' }}
            >
              계산기 · {realTotal.toLocaleString()}원
            </span>
          )}
        </div>

        <div
          className="grid min-h-0 flex-1 gap-1.5 rounded-xl p-1.5"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${SIZE}, minmax(0, 1fr))`,
            background: 'var(--board-overlay)',
            border: '2px solid var(--board-line)',
          }}
        >
          {grid.map((row, r) => row.map((value, c) => (
            <div
              key={`${r}-${c}`}
              className="flex min-h-0 items-center justify-center rounded-lg text-[17px] font-black"
              style={{
                background: value === 0 ? 'rgba(30, 41, 59, 0.6)' : COLORS[value] ?? '#0E7490',
                border: `2px solid ${value === 0 ? 'rgba(100, 116, 139, 0.35)' : 'var(--board-ink)'}`,
                color: 'var(--board-ink)',
              }}
            >
              {value === 0 ? '' : value.toLocaleString()}
            </div>
          )))}
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
          {note || (calcOpen ? '계산기와 아이미의 금액이 다릅니다. 계산기 값을 믿으세요.' : '계산기를 눌러 아이미의 금액을 확인해 보세요.')}
        </p>
      </div>
    </MiniGameFrame>
  );
}
