import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, randInt } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m3-l2 · 뜻 줄 밀기 (장르 13 · 3매치 퍼즐)
 *
 * "여러 가지로 말한 풀이가 결국 한 낱말의 뜻이다"를 조작으로 만든다. 판에 깔린 조각은
 * 저마다 다른 말이지만, 셋을 모으면 같은 낱말의 뜻이 된다. 무엇과 무엇이 같은 뜻인지
 * 읽어야 어디를 밀지 정할 수 있다.
 *
 * 조작은 줄 밀기다. m3-l7도 3매치지만 그쪽은 붙어 있는 두 칸을 바꾼다. 여기서는 가장자리
 * 화살표를 눌러 한 줄을 통째로 밀고, 밀려난 조각은 반대편으로 돌아온다. 조준이 필요 없어
 * 손이 불편한 학생도 하고, 한 줄이 통째로 움직이니 무엇이 바뀌었는지 눈에 남는다.
 *
 * 터진 자리는 제자리에서 새 조각으로 채운다. 아래로 무너뜨리지 않는 것도 m3-l7과 다른데,
 * 밀어서 맞추는 판에서 중력까지 끼면 방금 민 줄이 어디로 갔는지 알 수 없어진다.
 */

/* 칸 수. 5x5로 두었더니 한 칸이 70px뿐이라 "함부로 안 버려요"가 한 글자씩 끊겨
   세로로 흘렀다. 4x4로 줄여 한 칸을 95px 남짓으로 넓힌다. 풀이도 여섯 자를 넘기지 않는다. */
const COLS = 4;
const ROWS = 4;

interface WordSpec {
  key: string;
  name: string;
  color: string;
  /** 같은 뜻을 다르게 말한 풀이. 조각에 이 말이 적힌다. */
  phrases: string[];
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  words: WordSpec[];
  /**
   * 오늘 알아볼 낱말이 아닌 조각.
   *
   * 세 낱말만 깔았더니 아무 줄이나 밀어도 짝이 서서, 읽지 않고도 네 수 만에 끝났다.
   * 판단이 없으면 놀이가 아니다. 이 조각으로 짝을 지으면 뜻 칸은 그대로고 밀기만 준다.
   */
  filler: WordSpec;
  /** 낱말 하나마다 모아야 하는 조각 수 */
  need: number;
  moves: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'humble',
    label: '기본',
    spoken: '같은 뜻을 말한 조각을 셋씩 모아요.',
    need: 6,
    moves: 22,
    words: [
      { key: 'humble', name: '겸손', color: '#38BDF8', phrases: ['낮춰요', '안 뽐내요', '먼저 세워요'] },
      { key: 'thrift', name: '절약', color: '#4ADE80', phrases: ['아껴 써요', '덜 써요', '안 버려요'] },
      { key: 'yield', name: '양보', color: '#FBBF24', phrases: ['내줘요', '비켜 줘요', '넘겨 줘요'] },
    ],
    filler: { key: 'greet', name: '인사', color: '#94A3B8', phrases: ['안녕하세요', '반가워요', '고마워요'] },
  },
  {
    id: 'care',
    label: '1단계',
    spoken: '같은 뜻을 말한 조각을 셋씩 모아요.',
    need: 6,
    moves: 20,
    words: [
      { key: 'care', name: '배려', color: '#38BDF8', phrases: ['살펴요', '물어봐요', '챙겨 줘요'] },
      { key: 'honest', name: '정직', color: '#4ADE80', phrases: ['사실대로', '안 숨겨요', '그대로 말해요'] },
      { key: 'together', name: '협동', color: '#FBBF24', phrases: ['힘 모아요', '나눠 해요', '같이 해요'] },
    ],
    filler: { key: 'clean', name: '청소', color: '#94A3B8', phrases: ['쓸어요', '닦아요', '치워요'] },
  },
  {
    id: 'duty',
    label: '2단계',
    spoken: '같은 뜻을 말한 조각을 셋씩 모아요.',
    need: 6,
    moves: 18,
    words: [
      { key: 'duty', name: '책임', color: '#38BDF8', phrases: ['내 몫 끝내요', '맡은 일 해요', '끝까지 해요'] },
      { key: 'respect', name: '존중', color: '#4ADE80', phrases: ['다름 인정', '함부로 안 해요', '귀담아들어요'] },
      { key: 'patience', name: '인내', color: '#FBBF24', phrases: ['기다려요', '참고 견뎌요', '안 서둘러요'] },
    ],
    filler: { key: 'tidy', name: '정리', color: '#94A3B8', phrases: ['제자리에', '가지런히', '모아 둬요'] },
  },
];

/** 판에 놓인 조각 하나. word는 짝을 맞추는 열쇠, phrase는 읽을 말이다. */
interface Piece {
  word: number;
  phrase: number;
}

type Grid = (Piece | null)[][];

/** 한 장면. 터질 칸을 밝히거나, 빈자리를 보여 주거나, 새로 채운 판을 보여 준다. */
interface Scene {
  grid: Grid;
  hits: Set<string>;
  hold: number;
}

/** 판에 깔리는 종류 = 오늘 낱말 셋 + 가짜 하나. 마지막 자리가 가짜다. */
function allWords(stage: StageConfig): WordSpec[] {
  return [...stage.words, stage.filler];
}

function pick(random: () => number, stage: StageConfig): Piece {
  const list = allWords(stage);
  const word = randInt(random, 0, list.length);
  return { word, phrase: randInt(random, 0, list[word].phrases.length) };
}

/** 이 칸이 지금 낱말로 셋 이상 줄을 세우는가. */
function makesRun(grid: Grid, r: number, c: number): boolean {
  const cell = grid[r][c];
  if (!cell) return false;
  let across = 1;
  for (let i = c - 1; i >= 0 && grid[r][i]?.word === cell.word; i -= 1) across += 1;
  for (let i = c + 1; i < COLS && grid[r][i]?.word === cell.word; i += 1) across += 1;
  if (across >= 3) return true;
  let down = 1;
  for (let i = r - 1; i >= 0 && grid[i][c]?.word === cell.word; i -= 1) down += 1;
  for (let i = r + 1; i < ROWS && grid[i][c]?.word === cell.word; i += 1) down += 1;
  return down >= 3;
}

function findMatches(grid: Grid): Set<string> {
  const hits = new Set<string>();
  for (let r = 0; r < ROWS; r += 1) {
    let run = 1;
    for (let c = 1; c <= COLS; c += 1) {
      const same = c < COLS && grid[r][c] && grid[r][c]?.word === grid[r][c - 1]?.word;
      if (same) run += 1;
      else {
        if (run >= 3) for (let k = 1; k <= run; k += 1) hits.add(`${r}-${c - k}`);
        run = 1;
      }
    }
  }
  for (let c = 0; c < COLS; c += 1) {
    let run = 1;
    for (let r = 1; r <= ROWS; r += 1) {
      const same = r < ROWS && grid[r][c] && grid[r][c]?.word === grid[r - 1][c]?.word;
      if (same) run += 1;
      else {
        if (run >= 3) for (let k = 1; k <= run; k += 1) hits.add(`${r - k}-${c}`);
        run = 1;
      }
    }
  }
  return hits;
}

/** 빈자리를 그 자리에서 바로 줄이 서지 않는 조각으로 채운다. */
function refill(grid: Grid, stage: StageConfig, random: () => number) {
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (grid[r][c]) continue;
      for (let tryCount = 0; tryCount < 12; tryCount += 1) {
        grid[r][c] = pick(random, stage);
        if (!makesRun(grid, r, c)) break;
      }
    }
  }
}

/** 그 줄을 그 방향으로 민 판. 실제로 밀지는 않고 결과만 만들어 본다. */
function shifted(grid: Grid, kind: 'row' | 'col', index: number, dir: number): Grid {
  const moved = grid.map((row) => row.slice());
  if (kind === 'row') {
    const line = moved[index];
    moved[index] = dir > 0
      ? [line[COLS - 1], ...line.slice(0, COLS - 1)]
      : [...line.slice(1), line[0]];
  } else {
    const line = moved.map((row) => row[index]);
    const next = dir > 0
      ? [line[ROWS - 1], ...line.slice(0, ROWS - 1)]
      : [...line.slice(1), line[0]];
    for (let r = 0; r < ROWS; r += 1) moved[r][index] = next[r];
  }
  return moved;
}

/**
 * 밀어서 짝을 지을 수 있는 자리가 하나라도 있는가.
 *
 * 없으면 학생은 무엇을 눌러도 "그렇게 밀면 이어지지 않아요"만 보게 된다. 자기 잘못이
 * 아닌데 막힌 것이라, 그때는 판을 새로 깔아 준다.
 */
function hasMove(grid: Grid): boolean {
  for (let r = 0; r < ROWS; r += 1) {
    for (const dir of [1, -1]) {
      if (findMatches(shifted(grid, 'row', r, dir)).size > 0) return true;
    }
  }
  for (let c = 0; c < COLS; c += 1) {
    for (const dir of [1, -1]) {
      if (findMatches(shifted(grid, 'col', c, dir)).size > 0) return true;
    }
  }
  return false;
}

function buildGrid(stage: StageConfig, seed: number): Grid {
  const random = createRandom(seed);
  let grid: Grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
  refill(grid, stage, random);
  for (let attempt = 0; attempt < 40 && !hasMove(grid); attempt += 1) {
    grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
    refill(grid, stage, random);
  }
  return grid;
}

export default function MeaningShiftGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 밀 수 있는 횟수와 이름표로 나타난다. 낱말과 풀이는 셋 모두 같다. */
  const moves = Math.round(stage.moves * clamp(tuning.tolerance, 0.8, 1.6));

  const [grid, setGrid] = useState<Grid>(() => buildGrid(stage, game.seed));
  const [left, setLeft] = useState(moves);
  const [filled, setFilled] = useState<number[]>(stage.words.map(() => 0));
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const [burst, setBurst] = useState<Set<string>>(() => new Set());
  const [busy, setBusy] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  useEffect(() => {
    setGrid(buildGrid(stage, game.seed));
    setLeft(moves);
    setFilled(stage.words.map(() => 0));
    setNote('');
    setDone(false);
    setBurst(new Set());
    setBusy(false);
    clearTimers();
  }, [game.round, game.stageIndex, stage, game.seed, moves]);

  /** 터지고 다시 채우는 과정을 장면으로 나눈다. 터지는 장면이 곧 보상이다. */
  const resolve = (start: Grid) => {
    const random = createRandom(game.seed + left * 977);
    const next = start.map((row) => row.slice());
    const gained = stage.words.map(() => 0);
    const scenes: Scene[] = [];
    for (let guard = 0; guard < 12; guard += 1) {
      const hits = findMatches(next);
      if (hits.size === 0) break;
      scenes.push({ grid: next.map((row) => row.slice()), hits: new Set(hits), hold: 380 });
      for (const key of hits) {
        const [r, c] = key.split('-').map(Number);
        const cell = next[r][c];
        // 가짜 조각(마지막 자리)은 뜻 칸을 채우지 않는다. 밀기만 줄어든다.
        if (cell && cell.word < stage.words.length) gained[cell.word] += 1;
        next[r][c] = null;
      }
      scenes.push({ grid: next.map((row) => row.slice()), hits: new Set(), hold: 220 });
      refill(next, stage, random);
      scenes.push({ grid: next.map((row) => row.slice()), hits: new Set(), hold: 260 });
    }
    return { next, gained, scenes };
  };

  /** 한 줄을 통째로 민다. 밀려난 조각은 반대편으로 돌아온다. */
  const shift = (kind: 'row' | 'col', index: number, dir: number) => {
    if (!game.playing || done || busy) return;

    const moved = shifted(grid, kind, index, dir);

    if (findMatches(moved).size === 0) {
      /* 짝이 서지 않는 밀기 뒤에도 막힐 수 있다. 여기를 빼먹었더니 밀기가 스물다섯 번
         남았는데 어느 화살표를 눌러도 아무 일이 없는 판이 실제로 나왔다. */
      if (hasMove(moved)) {
        setGrid(moved);
        setNote('그렇게 밀면 같은 뜻이 셋으로 이어지지 않아요.');
      } else {
        setGrid(buildGrid(stage, game.seed + left * 31));
        setNote('밀어서 이을 곳이 없어 조각을 새로 깔았어요.');
      }
      return;
    }

    playSound('confirm');
    const { next, gained, scenes } = resolve(moved);
    const remaining = left - 1;
    setLeft(remaining);

    setGrid(moved);
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
      if (hasMove(next)) {
        setGrid(next);
      } else {
        setGrid(buildGrid(stage, game.seed + remaining * 31));
        setNote('밀어서 이을 곳이 없어 조각을 새로 깔았어요.');
      }
    }, delay));

    const nextFilled = filled.map((value, index2) => Math.min(stage.need, value + gained[index2]));
    setFilled(nextFilled);

    if (nextFilled.every((value) => value >= stage.need)) {
      setDone(true);
      game.succeed('여러 가지로 말한 풀이가 한 낱말의 뜻이라는 것을 찾았어요!');
      return;
    }
    if (remaining <= 0) {
      setDone(true);
      game.fail('밀 수 있는 횟수를 다 썼어요. 같은 뜻을 말한 조각부터 찾아 봐요.');
      return;
    }
    const useless = gained.every((value) => value === 0);
    setNote(useless
      ? `${stage.filler.name}은 오늘 알아볼 낱말이 아니에요. 오른쪽 뜻 칸에 있는 낱말을 찾아 보세요.`
      : '뜻 칸이 채워졌어요.');
  };

  const totalNeed = stage.words.length * stage.need;
  const totalFilled = filled.reduce((sum, value) => sum + value, 0);

  /** 가장자리 화살표 한 개. 판 둘레를 빙 둘러 놓는다. */
  const arrow = (key: string, label: string, aria: string, onPress: () => void) => (
    <button
      key={key}
      type="button"
      onClick={onPress}
      disabled={!game.playing || done || busy}
      aria-label={aria}
      className="grid min-h-0 place-items-center rounded text-[15px] font-black"
      style={{ background: 'var(--board-surface)', border: '2px solid var(--board-line)', color: 'var(--board-ink)' }}
    >
      {label}
    </button>
  );

  return (
    <MiniGameFrame
      badge="뜻 줄 밀기"
      instruction="가장자리 화살표를 누르면 그 줄이 통째로 밀립니다. 같은 뜻을 말한 조각을 셋으로 이어 보세요."
      progress={{ label: '채운 뜻', value: totalFilled, max: totalNeed }}
      hud={<GameHud score={left} scoreLabel="남은 밀기" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 gap-2">
        {/* 판 + 둘레 화살표. 바깥 한 칸이 화살표, 가운데 5x5가 조각이다. */}
        <div
          className="grid min-w-0 flex-1 gap-1 rounded-xl p-1.5"
          style={{
            gridTemplateColumns: `28px repeat(${COLS}, minmax(0, 1fr)) 28px`,
            gridTemplateRows: `24px repeat(${ROWS}, minmax(0, 1fr)) 24px`,
            background: 'var(--board-overlay)',
            border: '2px solid var(--board-line)',
          }}
        >
          <span />
          {Array.from({ length: COLS }, (_, c) => arrow(`t${c}`, '▼', `${c + 1}번 줄을 아래로 밀기`, () => shift('col', c, 1)))}
          <span />

          {Array.from({ length: ROWS }, (_, r) => (
            <React.Fragment key={`row-${r}`}>
              {arrow(`l${r}`, '◀', `${r + 1}번 줄을 왼쪽으로 밀기`, () => shift('row', r, -1))}
              {Array.from({ length: COLS }, (_, c) => {
                const cell = grid[r][c];
                if (!cell) {
                  return (
                    <div
                      key={`${r}-${c}`}
                      aria-hidden="true"
                      className="min-h-0 rounded-lg"
                      style={{ background: 'var(--board-bg)', border: '2px dashed var(--board-line)' }}
                    />
                  );
                }
                const word = allWords(stage)[cell.word];
                const popping = burst.has(`${r}-${c}`);
                return (
                  <div
                    key={`${r}-${c}`}
                    aria-label={`${r + 1}행 ${c + 1}열 ${word.phrases[cell.phrase]}`}
                    className="flex min-h-0 flex-col items-center justify-center rounded-lg px-0.5 text-center transition"
                    style={{
                      background: popping ? '#FFFFFF' : 'var(--board-surface)',
                      border: `${popping ? 4 : 2}px solid ${word.color}`,
                      color: popping ? '#0F172A' : 'var(--board-ink)',
                      transform: popping ? 'scale(1.06)' : 'none',
                    }}
                  >
                    <span className="text-[14px] font-black leading-tight">{word.phrases[cell.phrase]}</span>
                    {/* 낱말 이름은 충분한 지원·중학에서만 붙인다. 고등은 풀이만 읽고 찾는다. */}
                    {game.hintAllowed && (
                      <span className="text-[14px] font-bold leading-tight" style={{ color: word.color }}>
                        {word.name}
                      </span>
                    )}
                  </div>
                );
              })}
              {arrow(`r${r}`, '▶', `${r + 1}번 줄을 오른쪽으로 밀기`, () => shift('row', r, 1))}
            </React.Fragment>
          ))}

          <span />
          {Array.from({ length: COLS }, (_, c) => arrow(`b${c}`, '▲', `${c + 1}번 줄을 위로 밀기`, () => shift('col', c, -1)))}
          <span />
        </div>

        {/* 낱말마다 뜻이 얼마나 모였는지 */}
        <div className="flex w-[150px] shrink-0 flex-col gap-1">
          {stage.words.map((word, index) => {
            const value = filled[index];
            const full = value >= stage.need;
            return (
              <div
                key={word.key}
                className="flex flex-1 flex-col justify-center rounded-xl p-1.5"
                style={{
                  background: full ? 'rgba(74, 222, 128, 0.16)' : 'var(--board-surface)',
                  border: `2px solid ${full ? '#4ADE80' : word.color}`,
                }}
              >
                <span className="text-[15px] font-black" style={{ color: 'var(--board-ink)' }}>
                  {word.name} {value}/{stage.need}
                </span>
                <span className="text-[14px] font-bold leading-tight" style={{ color: '#CBD5E1' }}>
                  {full ? word.phrases.join(' · ') : '같은 뜻을 셋으로 이어요'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </MiniGameFrame>
  );
}
