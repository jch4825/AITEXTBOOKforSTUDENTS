import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { BauhausMark, GameHud, clamp, createRandom, randInt, useGameKeys, useGameLoop } from '../engine';
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

/*
 * 금액마다 다른 색을 두던 표를 걷었다.
 *
 * 일곱 색은 서로 뜻이 없는 색이라 학생이 색과 금액을 따로 외워야 했고, 색을 구별하지
 * 못하면 아무 도움도 되지 않았다. 금액은 칸에 이미 숫자로 적혀 있으므로 색은 숫자 대신
 * 역할만 진다 — 지금 판에서 가장 큰 칸은 노랑, 목표에 닿은 칸은 파랑, 나머지는 회색이다.
 * 셋 다 모양(원·확인 표시·없음)이 함께 갈려 색을 못 가려도 읽힌다.
 */

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
      instruction={`금액이 같은 동전 타일을 밀어 하나로 합치면서, ${stage.goal.toLocaleString()}원 타일을 만들어 보세요.`}
      progress={{ label: '가장 큰 금액', value: best, max: stage.goal }}
      hud={<GameHud score={left} scoreLabel="남은 밀기" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          {/* 네 방향은 화살표 하나를 돌려 쓴다. 방향마다 다른 그림을 두면 학생이 같은 뜻의
              그림 넷을 따로 익혀야 한다. */}
          <MiniGameButton onClick={() => push(0)} mark="arrow" markRotate={180} label="왼쪽" />
          <MiniGameButton onClick={() => push(2)} mark="arrow" label="오른쪽" />
          <MiniGameButton onClick={() => push(1)} mark="arrow" markRotate={270} label="위" />
          <MiniGameButton onClick={() => push(3)} mark="arrow" markRotate={90} label="아래" />
          {/* 주판 그림을 더하기 표로 바꾼다. 이 버튼이 하는 일이 값을 더해 보는 것이다. */}
          <MiniGameButton
            onClick={() => { setCalcOpen(true); playSound('confirm'); }}
            mark="plus"
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
              className="px-2 py-1 text-[15px] font-black"
              style={{
                background: 'var(--game-board-surface)',
                border: 'var(--game-line) solid var(--game-board-grey)',
                color: 'var(--game-board-ink)',
              }}
            >
              {item.name} {item.price.toLocaleString()}원 × {item.count}
            </span>
          ))}
          {/* 아이미의 금액과 계산기의 금액은 이 놀이에서 맞대는 두 값이다. 판 위에서
              빨강과 파랑의 밝기는 거의 같아 색만으로는 갈리지 않으므로, 틀린 쪽은 세모,
              맞는 쪽은 네모를 함께 진다. 계산기를 눌러 드러난 뒤에는 면을 통째로 뒤집어
              둘 중 어느 것을 믿어야 하는지 한눈에 보이게 한다. */}
          <span
            className="flex items-center gap-1.5 px-2 py-1 text-[15px] font-black"
            style={{
              background: calcOpen ? 'var(--game-board-red)' : 'var(--game-board-surface)',
              border: `var(--game-line) solid ${
                calcOpen ? 'var(--game-board-red)' : 'var(--game-board-grey)'}`,
              color: calcOpen ? 'var(--game-board)' : 'var(--game-board-ink)',
            }}
          >
            {calcOpen && <BauhausMark kind="triangle" size={14} />}
            아이미 · {stage.aimiSays.toLocaleString()}원{calcOpen ? ' (틀렸어요)' : ''}
          </span>
          {calcOpen && (
            <span
              className="flex items-center gap-1.5 px-2 py-1 text-[15px] font-black"
              style={{
                background: 'var(--game-board-blue)',
                border: 'var(--game-line) solid var(--game-board-blue)',
                color: 'var(--game-board)',
              }}
            >
              <BauhausMark kind="square" size={14} />
              계산기 · {realTotal.toLocaleString()}원
            </span>
          )}
        </div>

        <div
          className="grid min-h-0 flex-1 gap-1.5 p-1.5"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${SIZE}, minmax(0, 1fr))`,
            /* 판을 담는 틀은 중립 구조물이다. 회색 테두리만 두르고 안쪽을 어둡게 둔다. */
            background: 'var(--game-board)',
            border: 'var(--game-line) solid var(--game-board-grey)',
          }}
        >
          {grid.map((row, r) => row.map((value, c) => {
            const reached = value >= stage.goal;
            /* 지금 판에서 가장 큰 칸. 학생이 키워 가는 것이라 노랑 원을 진다.
               같은 금액이 둘이면 둘 다 노랑인데, 그 둘이 바로 붙여야 할 짝이다. */
            const growing = value > 0 && value === best && !reached;
            return (
              <div
                key={`${r}-${c}`}
                className="flex min-h-0 flex-col items-center justify-center gap-0.5 text-[17px] font-black"
                style={{
                  /* 목표에 닿은 칸은 면을 파랑으로 뒤집는다. 테두리만 바꾸면 다 왔다는 것이
                     빈 칸 열다섯 개 사이에서 묻힌다. */
                  background: reached ? 'var(--game-board-blue)'
                    : value === 0 ? 'var(--game-board)' : 'var(--game-board-surface)',
                  border: `${value === 0 ? 'var(--game-hair)' : 'var(--game-line)'} solid ${
                    reached ? 'var(--game-board-blue)'
                      : growing ? 'var(--game-board-yellow)' : 'var(--game-board-grey)'}`,
                  color: reached ? 'var(--game-board)' : 'var(--game-board-ink)',
                }}
              >
                {reached && <BauhausMark kind="check" size={13} />}
                {growing && (
                  <span style={{ color: 'var(--game-board-yellow)' }}>
                    <BauhausMark kind="circle" size={11} />
                  </span>
                )}
                {value === 0 ? '' : value.toLocaleString()}
              </div>
            );
          }))}
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>
          {note || (calcOpen ? '계산기와 아이미의 금액이 다릅니다. 계산기 값을 믿으세요.' : '계산기를 눌러 아이미의 금액을 확인해 보세요.')}
        </p>
      </div>
    </MiniGameFrame>
  );
}
