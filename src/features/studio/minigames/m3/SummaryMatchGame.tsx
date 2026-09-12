import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { BauhausMark, GameHud, clamp, createRandom, randInt } from '../engine';
import type { BauhausMarkKind } from '../engine';
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
  mark: BauhausMarkKind;
  label: string;
  color: string;
}

/*
 * 판에 깔리는 뜻. 앞에서부터 kinds개만 쓴다.
 *
 * 그래서 차례가 곧 계약이다. 요약이 요구하는 뜻이 이 목록 뒤쪽에 있으면 판에 아예
 * 나오지 않아 그 판은 이길 수 없다. 실제로 기본 스테이지가 '조심할 것'을 요구하는데
 * 앞의 넷만 깔려서, 아무리 이어 붙여도 요약 칸이 채워지지 않았다.
 * 아래 useMiniGameStage 옆의 kinds 계산이 이 관계를 강제한다.
 */
/*
 * 뜻 다섯에는 저마다 다른 도형을 준다.
 *
 * 톤은 넷뿐이라 색은 한 번 돌아오지만 도형은 다섯이 모두 다르다. 색을 구별하지
 * 못하는 학생도 같은 도형 셋을 잇는 것으로 놀이가 성립한다.
 */
const KINDS: Kind[] = [
  { key: 'when', mark: 'circle', label: '언제', color: 'var(--game-board-blue)' },
  { key: 'where', mark: 'square', label: '어디서', color: 'var(--game-board-yellow)' },
  { key: 'what', mark: 'diamond', label: '무엇을', color: 'var(--game-board-grey)' },
  { key: 'care', mark: 'triangle', label: '조심할 것', color: 'var(--game-board-red)' },
  { key: 'who', mark: 'plus', label: '누가', color: 'var(--game-board-blue)' },
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
      { key: 'where', count: 6, sentence: '학교 앞에서 모여 도서관에 갑니다.' },
      { key: 'what', count: 6, sentence: '물병과 필기구를 챙깁니다.' },
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
      { key: 'what', count: 6, sentence: '모둠별로 그림을 그립니다.' },
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

/** 한 장면. 터지는 칸을 밝히거나, 빈자리를 보여 주거나, 내려온 판을 보여 준다. */
interface Scene {
  grid: Grid;
  hits: Set<string>;
  hold: number;
}

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

/** 이 칸이 지금 값으로 셋 이상 줄을 세우는가. */
function makesRun(grid: Grid, r: number, c: number): boolean {
  const value = grid[r][c];
  if (value < 0) return false;
  let across = 1;
  for (let i = c - 1; i >= 0 && grid[r][i] === value; i -= 1) across += 1;
  for (let i = c + 1; i < COLS && grid[r][i] === value; i += 1) across += 1;
  if (across >= 3) return true;
  let down = 1;
  for (let i = r - 1; i >= 0 && grid[i][c] === value; i -= 1) down += 1;
  for (let i = r + 1; i < ROWS && grid[i][c] === value; i += 1) down += 1;
  return down >= 3;
}

/**
 * 남은 칸을 아래로 내리고 빈자리를 위에서 채운다.
 *
 * 채우는 값은 그 자리에서 바로 줄이 서지 않는 것으로 고른다. 아무 값이나 넣었더니
 * 새로 내려온 칸이 또 줄을 서고, 그 연쇄가 판을 통째로 쓸어 첫 수에 요약 열여덟 칸이
 * 한꺼번에 찼다. 학생이 놓은 수가 아니라 우연이 판을 끝낸 셈이다.
 */
function collapse(grid: Grid, kinds: number, random: () => number) {
  for (let c = 0; c < COLS; c += 1) {
    const column: number[] = [];
    for (let r = ROWS - 1; r >= 0; r -= 1) if (grid[r][c] >= 0) column.push(grid[r][c]);
    for (let r = ROWS - 1; r >= 0; r -= 1) {
      const value = column[ROWS - 1 - r];
      grid[r][c] = value === undefined ? -1 : value;
    }
  }
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (grid[r][c] >= 0) continue;
      let value = randInt(random, 0, kinds);
      for (let tryCount = 0; tryCount < kinds; tryCount += 1) {
        grid[r][c] = value;
        if (!makesRun(grid, r, c)) break;
        value = (value + 1) % kinds;
      }
      grid[r][c] = value;
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
  /* 요약이 요구하는 뜻은 반드시 판에 깔려야 한다. 안 깔리는 뜻을 요구하면 그 판은
     이길 수 없고, 학생은 왜 안 채워지는지 알 길이 없다. 종류 수를 지원 수준으로 줄이더라도
     요구한 뜻까지는 남긴다. */
  const needFloor = Math.max(...stage.needs.map((need) => KINDS.findIndex((k) => k.key === need.key))) + 1;
  /* 종류가 셋뿐이면 아무 데나 바꿔도 줄이 서고, 연쇄가 판을 통째로 쓸어 한 번에 끝난다.
     실제로 그렇게 두었더니 첫 수에 요약 18칸이 다 찼다. 넷을 아래 끝으로 잡는다. */
  const kinds = clamp(
    Math.max(Math.round(stage.kinds * clamp(tuning.density, 0.85, 1.1)), needFloor),
    4, KINDS.length,
  );

  const [grid, setGrid] = useState<Grid>(() => buildGrid(kinds, game.seed));
  const [picked, setPicked] = useState<[number, number] | null>(null);
  const [left, setLeft] = useState(moves);
  const [filled, setFilled] = useState<number[]>(stage.needs.map(() => 0));
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  /** 지금 터지는 중인 칸. 비어 있으면 학생이 조작할 수 있는 상태다. */
  const [burst, setBurst] = useState<Set<string>>(() => new Set());
  const [busy, setBusy] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  useEffect(() => {
    setGrid(buildGrid(kinds, game.seed));
    setPicked(null);
    setLeft(moves);
    setFilled(stage.needs.map(() => 0));
    setNote('');
    setDone(false);
    setBurst(new Set());
    setBusy(false);
    clearTimers();
  }, [game.round, game.stageIndex, stage, game.seed, kinds, moves]);

  /**
   * 이어진 칸을 지우고 위에서 채우는 과정을 장면으로 나눈다.
   *
   * 예전에는 계산을 한 번에 끝내고 마지막 판만 보여 줬다. 세 개가 터지는 것도, 새 칸이
   * 내려오는 것도 눈에 보이지 않아 소리와 숫자로만 성공을 알 수 있었다. 3매치는 터지는
   * 장면이 곧 보상인데 그 보상이 없었다.
   */
  const resolve = (start: Grid) => {
    const random = createRandom(game.seed + left * 31);
    const next = start.map((row) => row.slice());
    const gained = stage.needs.map(() => 0);
    const scenes: Scene[] = [];
    for (let guard = 0; guard < 20; guard += 1) {
      const hits = findMatches(next);
      if (hits.size === 0) break;
      // 1) 터질 칸을 먼저 밝힌다
      scenes.push({ grid: next.map((row) => row.slice()), hits: new Set(hits), hold: 380 });
      for (const key of hits) {
        const [r, c] = key.split('-').map(Number);
        const kindKey = KINDS[next[r][c]].key;
        const needIndex = stage.needs.findIndex((need) => need.key === kindKey);
        if (needIndex >= 0) gained[needIndex] += 1;
        next[r][c] = -1;
      }
      // 2) 빈자리를 보여 준다
      scenes.push({ grid: next.map((row) => row.slice()), hits: new Set(), hold: 220 });
      collapse(next, kinds, random);
      // 3) 위에서 내려와 채워진 판
      scenes.push({ grid: next.map((row) => row.slice()), hits: new Set(), hold: 260 });
    }
    return { next, gained, scenes };
  };

  const swap = (a: [number, number], b: [number, number]) => {
    if (!game.playing || done || busy) return;
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
    const { next, gained, scenes } = resolve(test);
    setPicked(null);
    const remaining = left - 1;
    setLeft(remaining);

    // 바꾼 판을 먼저 보여 주고, 터지는 장면을 차례로 넘긴다
    setGrid(test);
    setBusy(true);
    let delay = 140;
    for (const scene of scenes) {
      const at = delay;
      timers.current.push(window.setTimeout(() => {
        setGrid(scene.grid);
        setBurst(scene.hits);
        if (scene.hits.size > 0) playSound('fill');
      }, at));
      delay += scene.hold;
    }
    timers.current.push(window.setTimeout(() => {
      setBurst(new Set());
      setBusy(false);
    }, delay));

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
    if (!game.playing || done || busy) return;
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
      instruction="칸을 눌러 자리를 바꾸며 같은 뜻을 가진 말 세 개를 이어 보세요. 요약에 꼭 필요한 핵심 내용이 차곡차곡 채워집니다."
      progress={{ label: '채운 요약', value: totalFilled, max: totalNeeded }}
      hud={<GameHud score={left} scoreLabel="남은 바꾸기" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <p
          className="px-3 py-1.5 text-[15px] font-bold leading-snug"
          style={{
            background: 'var(--game-board)',
            border: 'var(--game-line) solid var(--game-board-blue)',
            color: 'var(--game-board-ink)',
          }}
        >
          원래 글 · {stage.source}
        </p>
        <div className="flex min-h-0 flex-1 gap-2">
          <div
            className="grid min-w-0 flex-1 gap-1 p-1.5"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
              background: 'var(--game-board)',
              border: 'var(--game-line) solid var(--game-board-grey)',
            }}
          >
            {grid.map((row, r) => row.map((value, c) => {
              // 빈자리. 터진 뒤 위에서 내려오기 전까지 잠깐 이 모습이다.
              if (value < 0) {
                return (
                  <div
                    key={`${r}-${c}`}
                    aria-hidden="true"
                    className="min-h-0"
                    style={{
                      background: 'var(--game-board)',
                      border: 'var(--game-hair) dashed var(--game-board-grey)',
                    }}
                  />
                );
              }
              const kind = KINDS[value];
              const on = picked?.[0] === r && picked?.[1] === c;
              const popping = burst.has(`${r}-${c}`);
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => tap(r, c)}
                  disabled={!game.playing || done || busy}
                  aria-label={`${r + 1}행 ${c + 1}열 ${kind.label}${popping ? ', 이어졌어요' : ''}`}
                  className="flex min-h-0 flex-col items-center justify-center gap-0.5 text-[14px] font-black transition"
                  style={{
                    /* 이어진 칸은 테두리가 굵어지고 살짝 커진다. 터지는 장면이 3매치의
                       보상이라 여기서 확실히 보여 줘야 한다. 새 색은 들이지 않는다. */
                    background: on || popping ? kind.color : 'var(--game-board-surface)',
                    border: `${popping ? 'var(--game-heavy)' : 'var(--game-hair)'} solid ${kind.color}`,
                    color: on || popping ? 'var(--game-board)' : 'var(--game-board-ink)',
                    transform: popping ? 'scale(1.08)' : 'none',
                  }}
                >
                  <BauhausMark kind={kind.mark} size={18} />
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
                  className="flex flex-1 flex-col justify-center p-1.5"
                  style={{
                    background: full ? kind.color : 'var(--game-board)',
                    border: `var(--game-line) solid ${kind.color}`,
                    color: full ? 'var(--game-board)' : 'var(--game-board-ink)',
                  }}
                >
                  <span className="flex items-center gap-1.5 text-[14px] font-black">
                    <BauhausMark kind={kind.mark} size={14} />
                    {kind.label} {value}/{need.count}
                  </span>
                  {full && (
                    <span className="text-[14px] font-bold leading-tight">
                      {need.sentence}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
