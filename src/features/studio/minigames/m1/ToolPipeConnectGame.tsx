import React, { useEffect, useMemo, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { clamp, createRandom, randInt, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m1-l9 · 도구 관 잇기 (장르 16 · 파이프 연결)
 *
 * "일에 맞는 도구를 고른다"를 관을 잇는 일로 만든다. 고르기만 해서는 아무 일도
 * 일어나지 않고, 일에서 도구까지 실제로 길이 이어져야 물이 흐른다. 길이 엉뚱한
 * 도구로 이어지면 그 도구가 물을 받는 모습이 그대로 보인다.
 *
 * 정답 조회가 아니라 학생이 만든 배치에서 결과가 나온다. 같은 판에도 물이 지나는
 * 길은 여러 가지라 정답이 하나가 아니다.
 */

const COLS = 5;
const ROWS = 5;
/** 방향 — 0 위, 1 오른쪽, 2 아래, 3 왼쪽 */
const DR = [-1, 0, 1, 0];
const DC = [0, 1, 0, -1];

type PieceKind = 'I' | 'L' | 'T';
const BASE_DIRS: Record<PieceKind, number[]> = { I: [0, 2], L: [0, 1], T: [0, 1, 2] };

interface Cell {
  kind: PieceKind | null;
  rotation: number;
}

interface Tool {
  row: number;
  name: string;
  emoji: string;
}

interface StageConfig {
  id: string;
  label: string;
  job: string;
  jobEmoji: string;
  startRow: number;
  tools: Tool[];
  /** tools 중 이 일에 맞는 도구의 배열 위치 */
  correct: number;
  /** 입구 칸부터 출구 칸까지의 길. 각 원소는 [행, 열] */
  path: number[][];
}

const STAGES: StageConfig[] = [
  {
    id: 'summary',
    label: '기본',
    job: '긴 안내문을 짧게 만들기',
    jobEmoji: '📄',
    startRow: 2,
    tools: [
      { row: 0, name: '그림 만들기 도구', emoji: '🎨' },
      { row: 2, name: '요약 도구', emoji: '✂️' },
      { row: 4, name: '길 찾기 도구', emoji: '🗺️' },
    ],
    correct: 1,
    path: [[2, 0], [2, 1], [1, 1], [1, 2], [1, 3], [2, 3], [2, 4]],
  },
  {
    id: 'translate',
    label: '1단계',
    job: '외국에서 온 편지를 우리말로 읽기',
    jobEmoji: '✉️',
    startRow: 4,
    tools: [
      { row: 0, name: '번역 도구', emoji: '🌐' },
      { row: 2, name: '계산 도구', emoji: '🧮' },
      { row: 4, name: '노래 만들기 도구', emoji: '🎵' },
    ],
    correct: 0,
    path: [[4, 0], [3, 0], [3, 1], [2, 1], [2, 2], [1, 2], [1, 3], [0, 3], [0, 4]],
  },
  {
    id: 'photo',
    label: '2단계',
    job: '사진 속 글자를 글로 옮기기',
    jobEmoji: '📷',
    startRow: 0,
    tools: [
      { row: 0, name: '일정 관리 도구', emoji: '📅' },
      { row: 2, name: '글자 읽기 도구', emoji: '🔍' },
      { row: 4, name: '음악 추천 도구', emoji: '🎧' },
    ],
    correct: 1,
    path: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [3, 4], [2, 4]],
  },
];

/** 두 방향의 조합을 만들 수 있는 조각 종류와 회전값을 찾는다. */
function fitPiece(dirs: number[]): Cell {
  for (const kind of ['I', 'L', 'T'] as PieceKind[]) {
    for (let rotation = 0; rotation < 4; rotation += 1) {
      const open = BASE_DIRS[kind].map((d) => (d + rotation) % 4);
      if (dirs.every((d) => open.includes(d)) && open.length === dirs.length) {
        return { kind, rotation };
      }
    }
  }
  return { kind: 'I', rotation: 0 };
}

function openDirs(cell: Cell): number[] {
  if (!cell.kind) return [];
  return BASE_DIRS[cell.kind].map((d) => (d + cell.rotation) % 4);
}

/** 길을 따라 필요한 조각을 놓고, 나머지 칸에는 헷갈리게 하는 조각을 흩뿌린다. */
function buildGrid(stage: StageConfig, seed: number, decoyRate: number): Cell[][] {
  const random = createRandom(seed);
  const grid: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ kind: null, rotation: 0 })),
  );

  const path = stage.path;
  for (let i = 0; i < path.length; i += 1) {
    const [r, c] = path[i];
    const dirs: number[] = [];
    if (i === 0) dirs.push(3);
    else {
      const [pr, pc] = path[i - 1];
      dirs.push(DR.findIndex((dr, d) => pr === r + dr && pc === c + DC[d]));
    }
    if (i === path.length - 1) dirs.push(1);
    else {
      const [nr, nc] = path[i + 1];
      dirs.push(DR.findIndex((dr, d) => nr === r + dr && nc === c + DC[d]));
    }
    const unique = [...new Set(dirs)].sort();
    const piece = fitPiece(unique);
    // 처음에는 회전이 어긋나 있어야 학생이 맞출 일이 생긴다.
    grid[r][c] = { kind: piece.kind, rotation: (piece.rotation + 1 + randInt(random, 0, 3)) % 4 };
  }

  const onPath = new Set(path.map(([r, c]) => `${r}-${c}`));
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (onPath.has(`${r}-${c}`)) continue;
      if (random() < decoyRate) {
        const kinds: PieceKind[] = ['I', 'L', 'L', 'T'];
        grid[r][c] = {
          kind: kinds[randInt(random, 0, kinds.length)],
          rotation: randInt(random, 0, 4),
        };
      }
    }
  }
  return grid;
}

/** 입구에서 관을 따라 실제로 물이 닿는 칸의 순서. 닿은 도구 번호도 함께 낸다. */
function flowFrom(grid: Cell[][], startRow: number, tools: Tool[]) {
  const order: string[] = [];
  const seen = new Set<string>();
  const queue: number[][] = [];
  const start = grid[startRow][0];
  const reachedTools: number[] = [];

  if (openDirs(start).includes(3)) {
    queue.push([startRow, 0]);
    seen.add(`${startRow}-0`);
  }

  while (queue.length > 0) {
    const [r, c] = queue.shift() as number[];
    order.push(`${r}-${c}`);
    const dirs = openDirs(grid[r][c]);
    if (c === COLS - 1 && dirs.includes(1)) {
      const index = tools.findIndex((tool) => tool.row === r);
      if (index >= 0 && !reachedTools.includes(index)) reachedTools.push(index);
    }
    for (const dir of dirs) {
      const nr = r + DR[dir];
      const nc = c + DC[dir];
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (seen.has(`${nr}-${nc}`)) continue;
      const neighbour = grid[nr][nc];
      if (!neighbour.kind) continue;
      if (!openDirs(neighbour).includes((dir + 2) % 4)) continue;
      seen.add(`${nr}-${nc}`);
      queue.push([nr, nc]);
    }
  }

  return { order, reachedTools };
}

function PipeGlyph({ cell, wet }: { cell: Cell; wet: boolean }) {
  if (!cell.kind) return null;
  const stroke = wet ? '#38BDF8' : '#94A3B8';
  const arms = BASE_DIRS[cell.kind];
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-full w-full transition-transform duration-200"
      style={{ transform: `rotate(${cell.rotation * 90}deg)` }}
      aria-hidden="true"
    >
      {arms.includes(0) && <line x1="24" y1="24" x2="24" y2="0" stroke={stroke} strokeWidth="10" strokeLinecap="round" />}
      {arms.includes(1) && <line x1="24" y1="24" x2="48" y2="24" stroke={stroke} strokeWidth="10" strokeLinecap="round" />}
      {arms.includes(2) && <line x1="24" y1="24" x2="24" y2="48" stroke={stroke} strokeWidth="10" strokeLinecap="round" />}
      {arms.includes(3) && <line x1="24" y1="24" x2="0" y2="24" stroke={stroke} strokeWidth="10" strokeLinecap="round" />}
      <circle cx="24" cy="24" r="7" fill={wet ? '#0EA5E9' : '#64748B'} />
    </svg>
  );
}

export default function ToolPipeConnectGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];

  /* 지원 수준은 같은 판에서 요구만 바꾼다. 곁길 조각이 많을수록 진짜 길이 눈에 덜 띄고,
     물이 빨리 흐를수록 어디서 새는지 눈으로 좇기 어렵다. */
  const decoyRate = clamp(0.5 * game.tuning.density, 0.28, 0.78);
  const flowStep = 0.16 / Math.max(0.7, game.tuning.speed);

  const [grid, setGrid] = useState<Cell[][]>(() => buildGrid(stage, game.seed, decoyRate));
  const [wet, setWet] = useState<string[]>([]);
  const flowRef = useRef<{ order: string[]; reachedTools: number[]; step: number; timer: number }>({
    order: [], reachedTools: [], step: 0, timer: 0,
  });

  useEffect(() => {
    setGrid(buildGrid(stage, game.seed, decoyRate));
    setWet([]);
    flowRef.current = { order: [], reachedTools: [], step: 0, timer: 0 };
  }, [game.round, game.stageIndex, stage, game.seed, decoyRate]);

  // 진행 칸은 "지금 물이 닿을 수 있는 길 칸"의 수다. 곁가지로 새는 칸은 세지 않는다.
  const connectedCount = useMemo(() => {
    const reached = new Set(flowFrom(grid, stage.startRow, stage.tools).order);
    return stage.path.filter(([r, c]) => reached.has(`${r}-${c}`)).length;
  }, [grid, stage]);

  const rotate = (r: number, c: number) => {
    if (!game.playing || !grid[r][c].kind) return;
    playSound('select');
    setGrid((prev) => prev.map((row, ri) => row.map((cell, ci) => (
      ri === r && ci === c ? { ...cell, rotation: (cell.rotation + 1) % 4 } : cell
    ))));
  };

  const start = () => {
    const result = flowFrom(grid, stage.startRow, stage.tools);
    flowRef.current = { order: result.order, reachedTools: result.reachedTools, step: 0, timer: 0 };
    setWet([]);
    game.run('물을 흘려 봅니다.');
  };

  useGameLoop(game.status === 'running', (dt) => {
    const flow = flowRef.current;
    flow.timer += dt;
    if (flow.timer < flowStep) return;
    flow.timer = 0;

    if (flow.step < flow.order.length) {
      flow.step += 1;
      setWet(flow.order.slice(0, flow.step));
      return;
    }

    if (flow.reachedTools.includes(stage.correct)) {
      game.succeed(`${stage.tools[stage.correct].name}까지 길이 이어졌어요. 일에 맞는 도구로 물이 흘렀습니다!`);
    } else if (flow.reachedTools.length > 0) {
      game.fail(`${stage.tools[flow.reachedTools[0]].name}으로 흘렀어요. 이 일에 맞는 도구로 길을 다시 이어 봐요.`);
    } else {
      game.fail('길이 중간에 끊겼어요. 끊긴 관을 눌러 돌려 봐요.');
    }
  });

  const hint = () => {
    const fixed = buildGrid(stage, game.seed, decoyRate);
    for (const [r, c] of stage.path) {
      const dirs: number[] = [];
      const index = stage.path.findIndex(([pr, pc]) => pr === r && pc === c);
      if (index === 0) dirs.push(3);
      else {
        const [pr, pc] = stage.path[index - 1];
        dirs.push(DR.findIndex((dr, d) => pr === r + dr && pc === c + DC[d]));
      }
      if (index === stage.path.length - 1) dirs.push(1);
      else {
        const [nr, nc] = stage.path[index + 1];
        dirs.push(DR.findIndex((dr, d) => nr === r + dr && nc === c + DC[d]));
      }
      fixed[r][c] = fitPiece([...new Set(dirs)].sort());
    }
    setGrid(fixed);
  };

  return (
    <MiniGameFrame
      badge="도구 관 잇기"
      instruction="연결관을 눌러 알맞게 돌린 뒤, 왼쪽 일에서 오른쪽 도구까지 길을 이어 보세요. 길이 모두 이어졌으면 물 흘리기 단추를 눌러 봅시다."
      progress={{ label: '이어진 관', value: connectedCount, max: stage.path.length }}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].job)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 놓기" />
          {game.hintAllowed && (
            <MiniGameButton onClick={hint} disabled={game.isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={start}
            disabled={game.isLocked || !game.playing}
            emoji="💧"
            label={game.status === 'running' ? '흐르는 중…' : '물 흘리기'}
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 하려는 일 — 물이 들어오는 곳 */}
        <div
          className="flex items-center gap-2 rounded-xl px-2.5 py-1.5"
          style={{ background: 'var(--board-surface)', border: '2px solid #38BDF8' }}
        >
          <span className="text-[22px]" aria-hidden="true">{stage.jobEmoji}</span>
          <span className="text-[15px] font-black leading-snug" style={{ color: 'var(--board-ink)' }}>
            {stage.job}
          </span>
          <span className="ml-auto text-[18px]" aria-hidden="true">💧</span>
        </div>

        <div className="flex min-h-0 flex-1 items-stretch gap-2">
          {/* 관 격자 */}
          <div
            className="grid min-w-0 flex-1 grid-cols-5 grid-rows-5 gap-1 rounded-xl p-1.5"
            style={{ background: 'var(--board-overlay)', border: '2px solid var(--board-line)' }}
          >
            {grid.map((row, r) => row.map((cell, c) => {
              const isWet = wet.includes(`${r}-${c}`);
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => rotate(r, c)}
                  disabled={!cell.kind || game.isLocked}
                  aria-label={`${r + 1}행 ${c + 1}열 관 돌리기`}
                  className="relative min-h-0 rounded-lg p-0.5 transition-colors disabled:cursor-default"
                  style={{
                    background: isWet ? 'rgba(56, 189, 248, 0.18)' : 'var(--board-surface)',
                    border: `2px solid ${isWet ? '#38BDF8' : 'rgba(100, 116, 139, 0.5)'}`,
                  }}
                >
                  <PipeGlyph cell={cell} wet={isWet} />
                  {r === stage.startRow && c === 0 && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[15px]" aria-hidden="true">💧</span>
                  )}
                </button>
              );
            }))}
          </div>

          {/* 도구 출구 — 관 격자와 같은 5줄 눈금에 맞춰야 어느 줄로 물이 나오는지 보인다 */}
          <div className="grid w-[108px] shrink-0 grid-rows-5 gap-1 py-1.5">
            {stage.tools.map((tool) => {
              const filled = wet.includes(`${tool.row}-${COLS - 1}`);
              return (
                <div
                  key={tool.name}
                  style={{
                    gridRow: tool.row + 1,
                    background: filled ? 'rgba(56, 189, 248, 0.18)' : 'var(--board-surface)',
                    border: `2px solid ${filled ? '#38BDF8' : 'var(--board-line)'}`,
                  }}
                  className="flex min-h-0 flex-col items-center justify-center rounded-xl p-1 text-center"
                >
                  <span className="text-[18px] leading-none" aria-hidden="true">{tool.emoji}</span>
                  <span className="text-[14px] font-black leading-tight" style={{ color: 'var(--board-ink)' }}>
                    {tool.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
