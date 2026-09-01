import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, randInt } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m3-l7 · 같은 뜻 세 개 (장르 13 · 3매치 퍼즐)
 *
 * "긴 글에서 꼭 남길 것을 고른다"를 지우기로 만든다. 세 칸을 이으면 그 뜻이 요약
 * 문장으로 옮겨 간다. 그런데 이동 횟수가 정해져 있어 아무 뜻이나 지우면 정작 필요한
 * 뜻을 채우지 못한다 — 무엇을 남길지 고르는 일이 곧 조작이 된다.
 */

const COLS = 6;
const ROWS = 6;

interface Kind {
  key: string;
  emoji: string;
  label: string;
  color: string;
}

const KINDS: Kind[] = [
  { key: 'when', emoji: '🕘', label: '언제', color: '#38BDF8' },
  { key: 'where', emoji: '📍', label: '어디서', color: '#4ADE80' },
  { key: 'what', emoji: '🎒', label: '무엇을', color: '#FBBF24' },
  { key: 'who', emoji: '👥', label: '누가', color: '#C4B5FD' },
  { key: 'care', emoji: '⚠️', label: '조심할 것', color: '#FB7185' },
];

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  source: string;
  /** 요약 칸이 요구하는 뜻과 개수 */
  needs: { key: string; count: number; sentence: string }[];
  kinds: number;
  moves: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'trip',
    label: '기본',
    spoken: '현장학습 안내의 핵심만 남겨요.',
    source: '금요일 9시에 학교 앞에서 모여 도서관에 갑니다. 물병과 필기구를 챙기고 길에서는 손을 잡습니다.',
    needs: [
      { key: 'when', count: 6, sentence: '금요일 9시에 모입니다.' },
      { key: 'what', count: 6, sentence: '물병과 필기구를 챙깁니다.' },
      { key: 'care', count: 6, sentence: '길에서는 손을 잡습니다.' },
    ],
    kinds: 4,
    moves: 22,
  },
  {
    id: 'club',
    label: '1단계',
    spoken: '동아리 안내의 핵심만 남겨요.',
    source: '수요일 방과 후에 미술실에서 모둠별로 그림을 그립니다. 앞치마를 입고 물감은 나눠 씁니다.',
    needs: [
      { key: 'where', count: 6, sentence: '미술실에서 모입니다.' },
      { key: 'who', count: 6, sentence: '모둠별로 함께합니다.' },
      { key: 'care', count: 6, sentence: '앞치마를 입고 물감을 나눠 씁니다.' },
    ],
    kinds: 5,
    moves: 20,
  },
  {
    id: 'fair',
    label: '2단계',
    spoken: '축제 안내의 핵심만 남겨요.',
    source: '토요일 오후 1시에 강당에서 학년별로 발표합니다. 이름표를 달고 무대 뒤에서는 뛰지 않습니다.',
    needs: [
      { key: 'when', count: 6, sentence: '토요일 오후 1시에 시작합니다.' },
      { key: 'where', count: 6, sentence: '강당에서 발표합니다.' },
      { key: 'care', count: 6, sentence: '무대 뒤에서는 뛰지 않습니다.' },
    ],
    kinds: 5,
    moves: 18,
  },
];

type Grid = number[][];

function fillGrid(grid: Grid, kinds: number, random: () => number) {
  for (let c = 0; c < COLS; c += 1) {
    for (let r = ROWS - 1; r >= 0; r -= 1) {
      if (grid[r][c] >= 0) continue;
      grid[r][c] = randInt(random, 0, kinds);
    }
  }
}

function findMatches(grid: Grid): Set<string> {
  const hits = new Set<string>();
  for (let r = 0; r < ROWS; r += 1) {
    let run = 1;
    for (let c = 1; c <= COLS; c += 1) {
      if (c < COLS && grid[r][c] === grid[r][c - 1] && grid[r][c] >= 0) run += 1;
      else {
        if (run >= 3) for (let k = 1; k <= run; k += 1) hits.add(`${r}-${c - k}`);
        run = 1;
      }
    }
  }
  for (let c = 0; c < COLS; c += 1) {
    let run = 1;
    for (let r = 1; r <= ROWS; r += 1) {
      if (r < ROWS && grid[r][c] === grid[r - 1][c] && grid[r][c] >= 0) run += 1;
      else {
        if (run >= 3) for (let k = 1; k <= run; k += 1) hits.add(`${r - k}-${c}`);
        run = 1;
      }
    }
  }
  return hits;
}

function collapse(grid: Grid, kinds: number, random: () => number) {
  for (let c = 0; c < COLS; c += 1) {
    const column: number[] = [];
    for (let r = ROWS - 1; r >= 0; r -= 1) if (grid[r][c] >= 0) column.push(grid[r][c]);
    for (let r = ROWS - 1; r >= 0; r -= 1) {
      const value = column[ROWS - 1 - r];
      grid[r][c] = value === undefined ? randInt(random, 0, kinds) : value;
    }
  }
}

function buildGrid(kinds: number, seed: number): Grid {
  const random = createRandom(seed);
  const grid: Grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => -1));
  fillGrid(grid, kinds, random);
  // 시작부터 이미 이어져 있으면 학생이 한 일이 아니다. 처음에는 없앤다.
  for (let guard = 0; guard < 40; guard += 1) {
    const hits = findMatches(grid);
    if (hits.size === 0) break;
    for (const key of hits) {
      const [r, c] = key.split('-').map(Number);
      grid[r][c] = randInt(random, 0, kinds);
    }
  }
  return grid;
}

export default function SummaryMatchGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 이동 횟수와 타일 종류 수로 나타난다. 요약해야 할 내용은 셋 모두 같다. */
  const moves = Math.round(stage.moves * clamp(tuning.tolerance, 0.75, 1.5));
  const kinds = clamp(Math.round(stage.kinds * clamp(tuning.density, 0.85, 1.1)), 3, KINDS.length);

  const [grid, setGrid] = useState<Grid>(() => buildGrid(kinds, game.seed));
  const [picked, setPicked] = useState<[number, number] | null>(null);
  const [left, setLeft] = useState(moves);
  const [filled, setFilled] = useState<number[]>(stage.needs.map(() => 0));
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setGrid(buildGrid(kinds, game.seed));
    setPicked(null);
    setLeft(moves);
    setFilled(stage.needs.map(() => 0));
    setNote('');
    setDone(false);
  }, [game.round, game.stageIndex, stage, game.seed, kinds, moves]);

  const resolve = (start: Grid) => {
    const random = createRandom(game.seed + left * 31);
    const next = start.map((row) => row.slice());
    const gained = stage.needs.map(() => 0);
    for (let guard = 0; guard < 20; guard += 1) {
      const hits = findMatches(next);
      if (hits.size === 0) break;
      for (const key of hits) {
        const [r, c] = key.split('-').map(Number);
        const kindKey = KINDS[next[r][c]].key;
        const needIndex = stage.needs.findIndex((need) => need.key === kindKey);
        if (needIndex >= 0) gained[needIndex] += 1;
        next[r][c] = -1;
      }
      collapse(next, kinds, random);
    }
    return { next, gained };
  };

  const swap = (a: [number, number], b: [number, number]) => {
    if (!game.playing || done) return;
    const test = grid.map((row) => row.slice());
    const tmp = test[a[0]][a[1]];
    test[a[0]][a[1]] = test[b[0]][b[1]];
    test[b[0]][b[1]] = tmp;

    if (findMatches(test).size === 0) {
      setNote('그렇게 바꾸면 세 개가 이어지지 않아요.');
      setPicked(null);
      return;
    }

    playSound('confirm');
    const { next, gained } = resolve(test);
    setGrid(next);
    setPicked(null);
    const remaining = left - 1;
    setLeft(remaining);

    const nextFilled = filled.map((value, index) => Math.min(stage.needs[index].count, value + gained[index]));
    setFilled(nextFilled);

    const complete = nextFilled.every((value, index) => value >= stage.needs[index].count);
    if (complete) {
      setDone(true);
      game.succeed('꼭 남길 내용만 모아 요약 세 문장을 완성했어요!');
      return;
    }
    if (remaining <= 0) {
      setDone(true);
      game.fail('바꿀 횟수를 다 썼어요. 요약에 필요한 뜻부터 이어 봐요.');
      return;
    }
    const wasted = gained.every((value) => value === 0);
    setNote(wasted ? '요약에 필요 없는 뜻을 지웠어요. 오른쪽 칸이 바라는 뜻을 보세요.' : '요약 칸이 채워졌어요.');
  };

  const tap = (r: number, c: number) => {
    if (!game.playing || done) return;
    if (!picked) {
      playSound('select');
      setPicked([r, c]);
      return;
    }
    const [pr, pc] = picked;
    if (pr === r && pc === c) { setPicked(null); return; }
    if (Math.abs(pr - r) + Math.abs(pc - c) !== 1) {
      setPicked([r, c]);
      return;
    }
    swap(picked, [r, c]);
  };

  const totalNeeded = stage.needs.reduce((sum, need) => sum + need.count, 0);
  const totalFilled = filled.reduce((sum, value) => sum + value, 0);

  return (
    <MiniGameFrame
      badge="같은 뜻 세 개"
      instruction="옆에 있는 두 칸을 눌러 자리를 바꿔 같은 뜻 세 개를 이으세요. 오른쪽 요약 칸이 바라는 뜻만 채워집니다."
      progress={{ label: '채운 요약', value: totalFilled, max: totalNeeded }}
      hud={<GameHud score={left} scoreLabel="남은 바꾸기" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <p
          className="rounded-xl px-3 py-1.5 text-[15px] font-bold leading-snug"
          style={{ background: 'var(--board-surface)', border: '2px solid #38BDF8', color: 'var(--board-ink)' }}
        >
          원래 글 · {stage.source}
        </p>
        <div className="flex min-h-0 flex-1 gap-2">
          <div
            className="grid min-w-0 flex-1 gap-1 rounded-xl p-1.5"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
              background: 'var(--board-overlay)',
              border: '2px solid var(--board-line)',
            }}
          >
            {grid.map((row, r) => row.map((value, c) => {
              const kind = KINDS[value] ?? KINDS[0];
              const on = picked?.[0] === r && picked?.[1] === c;
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => tap(r, c)}
                  disabled={!game.playing || done}
                  aria-label={`${r + 1}행 ${c + 1}열 ${kind.label}`}
                  className="flex min-h-0 flex-col items-center justify-center rounded-lg text-[14px] font-black transition"
                  style={{
                    background: on ? kind.color : 'var(--board-surface)',
                    border: `2px solid ${kind.color}`,
                    color: on ? '#0F172A' : 'var(--board-ink)',
                  }}
                >
                  <span className="text-[17px] leading-none" aria-hidden="true">{kind.emoji}</span>
                  <span className="leading-tight">{kind.label}</span>
                </button>
              );
            }))}
          </div>
          <div className="flex w-[150px] shrink-0 flex-col gap-1">
            {stage.needs.map((need, index) => {
              const kind = KINDS.find((k) => k.key === need.key) as Kind;
              const value = filled[index];
              const full = value >= need.count;
              return (
                <div
                  key={need.key}
                  className="flex flex-1 flex-col justify-center rounded-xl p-1.5"
                  style={{
                    background: full ? 'rgba(74, 222, 128, 0.16)' : 'var(--board-surface)',
                    border: `2px solid ${full ? '#4ADE80' : kind.color}`,
                  }}
                >
                  <span className="text-[14px] font-black" style={{ color: 'var(--board-ink)' }}>
                    {kind.emoji} {kind.label} {value}/{need.count}
                  </span>
                  {full && (
                    <span className="text-[14px] font-bold leading-tight" style={{ color: 'var(--board-ink)' }}>
                      {need.sentence}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
