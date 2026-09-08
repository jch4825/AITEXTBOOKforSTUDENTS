import React, { useEffect, useMemo, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, shuffle, useCountdown } from '../engine';
import { useSpeak } from '../../../../hooks/useSpeak';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m4-l7 · 가로세로 낱말 (장르 43 · 가로세로 낱말 퍼즐)
 *
 * 앞선 게임은 흔들리는 팔로 물건을 건네는 물리 놀이였다. 손과 결과 사이에 층이 세 겹
 * 있어서(마우스가 목표점을, 목표점이 스프링으로 팔을, 팔의 속도 평활값이 판정을 끌었다)
 * 학생이 방금 한 일과 화면에서 일어난 일이 같은 순간에 있지 않았다. 게다가 승패는
 * "천천히 움직이기"로만 갈려, 화면의 학습 문구를 한 글자도 읽지 않아도 이길 수 있었다.
 *
 * 여기서는 간접층을 없앤다. 손끝이 있는 자리에 글자가 있고, 놓는 그 순간 그 칸 하나만
 * 판정한다. 그리고 힌트를 읽지 않으면 어느 칸에 무엇이 들어가는지 정할 수 없다.
 *
 * 낱말 넷은 이 차시가 가르치는 부탁의 네 칸이다 — 목적(중요), 행동(요약), 조건(약속),
 * 존중 표현(존중). 방해 글자는 진우가 급하게 던진 "빨리 그거 제대로 해!"에서 떨어져
 * 나온 것이라, 그 글자를 골라내는 일이 곧 이 차시의 판단이다.
 */

type Dir = 'across' | 'down';

interface WordSpec {
  word: string;
  row: number;
  col: number;
  dir: Dir;
  /** ○○ 자리를 남긴 힌트 문장. 낱말을 맞히면 그 자리에 낱말이 인쇄된다. */
  hint: string;
  /** 이 낱말이 부탁의 어느 칸인지. 게임과 차시 학습 내용을 잇는 끈이다. */
  slot: string;
  color: string;
}

/*
 * 판(3×3). 한 글자를 두 낱말이 나눠 쓴다.
 *
 *   존 중 ·
 *   ·  요 약
 *   ·  ·  속
 *
 * 가로 존중 = (0,0)(0,1) · 세로 중요 = (0,1)(1,1)
 * 가로 요약 = (1,1)(1,2) · 세로 약속 = (1,2)(2,2)
 * 겹치는 칸은 중·요·약 셋이다. 다섯 칸 중 셋이 두 낱말에 동시에 걸린다.
 */
const WORDS: WordSpec[] = [
  {
    word: '존중', row: 0, col: 0, dir: 'across', color: '#60A5FA',
    hint: '아이미에게도 친구에게도 ○○하는 말로 부탁해요.', slot: '존중 표현 칸',
  },
  {
    word: '중요', row: 0, col: 1, dir: 'down', color: '#4ADE80',
    hint: '왜 필요한지, 무엇이 가장 ○○한지를 먼저 밝혀요.', slot: '목적 칸',
  },
  {
    word: '요약', row: 1, col: 1, dir: 'across', color: '#FBBF24',
    hint: '긴 안내문을 세 줄로 ○○해 주세요.', slot: '행동 칸',
  },
  {
    word: '약속', row: 1, col: 2, dir: 'down', color: '#C084FC',
    hint: '오후 한 시까지라고 시간을 ○○했어요.', slot: '조건 칸',
  },
];

/** 급하게 던진 말 "빨리 그거 제대로 해!"에서 떨어져 나온 글자. 정답과 하나도 겹치지 않는다. */
const DECOYS = ['빨', '리', '그', '거', '제', '대', '로', '해'];

/** 충분한 지원에서 미리 인쇄해 두는 칸. 두 색으로 갈라진 칸을 처음부터 보여 준다. */
const SEED_CELL = '0-1';

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  /** 이 판에서 쓰는 낱말 수. 판은 셋 다 같은 3×3이고 벽만 열린다. */
  wordCount: number;
  decoyBase: number;
  seconds: number;
}

const STAGES: StageConfig[] = [
  { id: 'two', label: '기본', spoken: '낱말 두 개를 채워 봐요.', wordCount: 2, decoyBase: 2, seconds: 80 },
  { id: 'three', label: '1단계', spoken: '낱말 세 개를 채워 봐요.', wordCount: 3, decoyBase: 3, seconds: 100 },
  { id: 'four', label: '2단계', spoken: '낱말 네 개를 채워 봐요.', wordCount: 4, decoyBase: 4, seconds: 120 },
];

interface CellInfo {
  row: number;
  col: number;
  answer: string;
  /** 이 칸을 쓰는 낱말들. 둘이면 교차 칸이다. */
  words: number[];
}

function cellsFor(wordCount: number): Map<string, CellInfo> {
  const map = new Map<string, CellInfo>();
  WORDS.slice(0, wordCount).forEach((spec, index) => {
    for (let i = 0; i < spec.word.length; i += 1) {
      const row = spec.row + (spec.dir === 'down' ? i : 0);
      const col = spec.col + (spec.dir === 'across' ? i : 0);
      const key = `${row}-${col}`;
      const found = map.get(key);
      if (found) found.words.push(index);
      else map.set(key, { row, col, answer: spec.word[i], words: [index] });
    }
  });
  return map;
}

function cellKeysOf(spec: WordSpec): string[] {
  return Array.from({ length: spec.word.length }, (_, i) => {
    const row = spec.row + (spec.dir === 'down' ? i : 0);
    const col = spec.col + (spec.dir === 'across' ? i : 0);
    return `${row}-${col}`;
  });
}

interface Tile {
  id: number;
  letter: string;
  used: boolean;
}

export default function PoliteWordCrossGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;
  const { speakNow } = useSpeak();

  /* 지원 수준은 칸 크기·방해 글자 수·시간·기회·디딤 글자로 나타난다. 판과 조작은 같다. */
  const cellPx = Math.round(96 * clamp(tuning.size, 0.84, 1.32));
  const snapRadius = cellPx * 0.75;
  const dragThreshold = 8 * clamp(tuning.size, 0.84, 1.32);
  const decoyCount = Math.max(1, Math.round(stage.decoyBase * tuning.density));
  const seconds = Math.round(stage.seconds * clamp(tuning.time, 0.8, 1.5));
  const maxLives = tuning.lives;
  /* 충분한 지원에서만 교차 칸 하나를 미리 인쇄한다. */
  const seeded = Math.max(0, Math.round(tuning.tolerance) - 1) > 0;
  const holdMs = Math.round(450 * clamp(tuning.tolerance, 0.7, 1.7));
  const returnMs = Math.round(280 / clamp(tuning.speed, 0.7, 1.4));

  const cells = useMemo(() => cellsFor(stage.wordCount), [stage.wordCount]);
  const words = useMemo(() => WORDS.slice(0, stage.wordCount), [stage.wordCount]);

  const buildTray = (): Tile[] => {
    const random = createRandom(game.seed);
    const need: string[] = [];
    cells.forEach((info, key) => {
      if (seeded && key === SEED_CELL) return;
      need.push(info.answer);
    });
    const noise = shuffle(random, [...DECOYS]).slice(0, decoyCount);
    return shuffle(random, [...need, ...noise]).map((letter, id) => ({ id, letter, used: false }));
  };

  const [tray, setTray] = useState<Tile[]>(buildTray);
  const [filled, setFilled] = useState<Record<string, string>>(
    () => (seeded ? { [SEED_CELL]: cells.get(SEED_CELL)?.answer ?? '' } : {}),
  );
  const [done, setDone] = useState<number[]>([]);
  const [lives, setLives] = useState(maxLives);
  const [picked, setPicked] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [wrong, setWrong] = useState<{ cell: string; tile: number } | null>(null);
  const [note, setNote] = useState('');
  const [ghost, setGhost] = useState<{ letter: string; x: number; y: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const finishedRef = useRef(false);
  const dragRef = useRef<{ tile: number; x: number; y: number; moved: boolean } | null>(null);
  const rectsRef = useRef<Array<{ key: string; cx: number; cy: number }>>([]);
  /* 포인터로 처리한 조작 뒤에는 브라우저가 click을 한 번 더 보낸다. 그것까지 받으면
     고른 글자가 곧바로 풀린다. 키보드 Enter는 click만 오므로 그때는 받아야 한다. */
  const pointerHandledRef = useRef(false);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  };

  useEffect(() => {
    clearTimers();
    setTray(buildTray());
    setFilled(seeded ? { [SEED_CELL]: cells.get(SEED_CELL)?.answer ?? '' } : {});
    setDone([]);
    setLives(maxLives);
    setPicked(null);
    setFocus(null);
    setWrong(null);
    setGhost(null);
    setHover(null);
    setNote(seeded ? '한 글자는 미리 넣어 두었어요. 이어서 채워 보세요.' : '힌트를 읽고 알맞은 글자를 넣어 보세요.');
    finishedRef.current = false;
    dragRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.round, game.stageIndex]);

  useEffect(() => clearTimers, []);

  const timeLeft = useCountdown(
    game.playing && !finishedRef.current,
    seconds,
    game.round * 10 + game.stageIndex,
    () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      game.fail('시간이 지났어요. 힌트 카드를 누르면 그 낱말이 들어갈 칸이 밝아집니다.');
    },
  );

  /** 칸 하나에 글자를 놓는다. 맞았는지는 놓는 즉시 그 칸만 본다. */
  const drop = (cellKey: string, tileId: number) => {
    if (!game.playing || finishedRef.current) return;
    if (filled[cellKey] !== undefined) return;
    const info = cells.get(cellKey);
    const tile = tray.find((t) => t.id === tileId);
    if (!info || !tile || tile.used) return;

    setPicked(null);

    if (tile.letter !== info.answer) {
      const isDecoy = DECOYS.includes(tile.letter);
      setWrong({ cell: cellKey, tile: tileId });
      setLives((n) => {
        const left = n - 1;
        if (left <= 0 && !finishedRef.current) {
          finishedRef.current = true;
          game.fail('존중하는 말의 글자만 골라 넣어 보세요.');
        }
        return left;
      });
      playSound('select');
      setNote(isDecoy
        ? '급하게 던진 말에서 온 글자예요. 존중하는 말의 글자를 찾아보세요.'
        : '이 칸에 들어갈 글자가 아니에요.');
      timersRef.current.push(window.setTimeout(() => setWrong(null), holdMs + returnMs));
      return;
    }

    const next = { ...filled, [cellKey]: tile.letter };
    setFilled(next);
    setTray((prev) => prev.map((t) => (t.id === tileId ? { ...t, used: true } : t)));
    playSound('fill');

    const finished = words
      .map((spec, index) => ({ spec, index }))
      .filter(({ spec, index }) => !done.includes(index) && cellKeysOf(spec).every((k) => next[k] !== undefined))
      .map(({ index }) => index);

    if (finished.length === 0) {
      setNote('좋아요. 다음 칸을 채워 보세요.');
      return;
    }

    const after = [...done, ...finished];
    setDone(after);
    playSound('stamp');

    if (finished.length > 1) {
      setNote('두 낱말이 함께 완성됐어요.');
      speakNow('두 낱말이 함께 완성됐어요.');
    } else {
      const spec = words[finished[0]];
      setNote(`${spec.word}. ${spec.hint.replace('○○', spec.word)}`);
      speakNow(`${spec.word}. ${spec.hint.replace('○○', spec.word)}`);
    }

    if (after.length >= words.length && !finishedRef.current) {
      finishedRef.current = true;
      playSound('artifact-done');
      game.succeed(stage.wordCount >= 4
        ? '목적·행동·조건·존중 표현이 모두 모였어요.'
        : '존중하는 말로 부탁하는 낱말을 모두 채웠어요.');
    }
  };

  /** 드래그를 시작할 때 칸 중심 좌표를 한 번만 재 둔다. 손이 떨려도 판정이 튀지 않는다. */
  const cacheRects = () => {
    const board = boardRef.current;
    if (!board) return;
    const nodes = Array.from(board.querySelectorAll('[data-cell]')) as HTMLElement[];
    rectsRef.current = nodes.map((el) => {
      const rect = el.getBoundingClientRect();
      return { key: el.getAttribute('data-cell') ?? '', cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
    });
  };

  const nearestCell = (x: number, y: number): string | null => {
    let best: string | null = null;
    let bestDist = snapRadius;
    for (const rect of rectsRef.current) {
      if (filled[rect.key] !== undefined) continue;
      const d = Math.hypot(rect.cx - x, rect.cy - y);
      if (d < bestDist) { bestDist = d; best = rect.key; }
    }
    return best;
  };

  const onTilePointerDown = (event: React.PointerEvent<HTMLButtonElement>, tile: Tile) => {
    if (!game.playing || tile.used || finishedRef.current) return;
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* 잡지 못해도 진행한다 */ }
    dragRef.current = { tile: tile.id, x: event.clientX, y: event.clientY, moved: false };
    cacheRects();
  };

  const onTilePointerMove = (event: React.PointerEvent<HTMLButtonElement>, tile: Tile) => {
    const drag = dragRef.current;
    if (!drag || drag.tile !== tile.id) return;
    const moved = Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > dragThreshold;
    if (!moved && !drag.moved) return;
    drag.moved = true;
    setGhost({ letter: tile.letter, x: event.clientX, y: event.clientY });
    setHover(nearestCell(event.clientX, event.clientY));
  };

  /** 글자를 고른다. 고른 뒤 빈칸을 누르면 들어간다. 드래그가 어려운 학생의 길이다. */
  const selectTile = (tile: Tile) => {
    if (!game.playing || tile.used || finishedRef.current) return;
    setPicked((prev) => (prev === tile.id ? null : tile.id));
    setNote('이제 글자가 들어갈 빈칸을 눌러 보세요.');
  };

  const onTilePointerUp = (event: React.PointerEvent<HTMLButtonElement>, tile: Tile) => {
    const drag = dragRef.current;
    dragRef.current = null;
    setGhost(null);
    setHover(null);
    if (!drag || drag.tile !== tile.id) return;
    pointerHandledRef.current = true;
    if (!drag.moved) {
      selectTile(tile);
      return;
    }
    const target = nearestCell(event.clientX, event.clientY);
    if (target) drop(target, tile.id);
  };

  /* 키보드로 Enter·Space를 누르면 포인터 이벤트 없이 click만 온다. 그 길을 열어 둔다. */
  const onTileClick = (tile: Tile) => {
    if (pointerHandledRef.current) { pointerHandledRef.current = false; return; }
    selectTile(tile);
  };

  const onCellClick = (cellKey: string) => {
    if (picked !== null) { drop(cellKey, picked); return; }
    // 고른 글자가 없으면 그 칸이 속한 힌트를 밝힌다.
    const info = cells.get(cellKey);
    if (info) setFocus(info.words[0]);
  };

  const useHint = () => {
    if (!game.playing || finishedRef.current) return;
    const openWord = words.findIndex((spec, index) => !done.includes(index)
      && cellKeysOf(spec).some((k) => filled[k] === undefined));
    if (openWord < 0) return;
    const spec = words[openWord];
    const cellKey = cellKeysOf(spec).find((k) => filled[k] === undefined);
    if (!cellKey) return;
    const tile = tray.find((t) => !t.used && t.letter === cells.get(cellKey)?.answer);
    if (!tile) return;
    setLives((n) => Math.max(0, n - 1));
    setNote('한 글자를 넣어 드렸어요. 이어서 채워 보세요.');
    drop(cellKey, tile.id);
  };

  const rows = 3;
  const cols = 3;
  const cellFont = Math.round(cellPx * 0.42);

  return (
    <MiniGameFrame
      badge="가로세로 낱말"
      instruction="아래 글자 조각을 빈칸으로 끌어다 낱말을 완성해 보세요. 조각을 누른 뒤 빈칸을 눌러도 들어갑니다."
      progress={{ label: '맞춘 낱말', value: done.length, max: words.length }}
      hud={<GameHud lives={lives} maxLives={maxLives} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="text-[15px] font-bold leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          가운데 칸의 글자는 가로 낱말과 세로 낱말에 함께 들어갑니다. 한 칸을 맞히면 두 낱말이 같이 자랍니다.
        </p>
      }
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />
          {game.hintAllowed && (
            <MiniGameButton onClick={useHint} emoji="💡" label="한 글자 넣기" />
          )}
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        <div className="flex flex-wrap items-start gap-4">
          {/* 낱말 판 */}
          <div
            ref={boardRef}
            className="grid shrink-0 gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${cellPx}px)`,
              gridTemplateRows: `repeat(${rows}, ${cellPx}px)`,
            }}
          >
            {Array.from({ length: rows * cols }, (_, i) => {
              const row = Math.floor(i / cols);
              const col = i % cols;
              const key = `${row}-${col}`;
              const info = cells.get(key);
              /* 벽은 그리지 않는다. 어두운 판 위에 다시 어두운 사각형을 두면
                 무엇이 벽이고 무엇이 채울 칸인지 흐려진다. */
              if (!info) return <div key={key} aria-hidden="true" />;

              const letter = filled[key];
              const isWrong = wrong?.cell === key;
              const wrongTile = isWrong ? tray.find((t) => t.id === wrong.tile) : undefined;
              const solved = info.words.every((w) => done.includes(w));
              const lit = focus !== null && info.words.includes(focus);
              const across = words[info.words.find((w) => words[w].dir === 'across') ?? info.words[0]];
              const down = info.words.map((w) => words[w]).find((w) => w.dir === 'down');
              const label = `${info.words.map((w) => words[w].word).join('과 ')}가 지나가는 칸, ${
                letter ? `${letter}이(가) 들어 있음` : '비어 있음'
              }`;

              return (
                <button
                  key={key}
                  type="button"
                  data-cell={key}
                  onClick={() => onCellClick(key)}
                  disabled={!game.playing || letter !== undefined}
                  aria-label={label}
                  className="grid place-items-center rounded-lg font-black transition disabled:cursor-default"
                  style={{
                    width: cellPx,
                    height: cellPx,
                    fontSize: `${cellFont}px`,
                    background: solved ? 'var(--board-overlay)' : 'var(--board-surface)',
                    color: isWrong ? '#FCA5A5' : 'var(--board-ink)',
                    /* 교차 칸은 위·왼쪽이 가로 낱말 색, 아래·오른쪽이 세로 낱말 색이다.
                       세로 쪽은 점선으로 두어 색을 못 가려도 갈린 것이 보인다. */
                    borderTop: `${solved ? 3 : 2}px solid ${solved ? '#4ADE80' : across.color}`,
                    borderLeft: `${solved ? 3 : 2}px solid ${solved ? '#4ADE80' : across.color}`,
                    borderBottom: `${solved ? 3 : 2}px ${down ? 'dashed' : 'solid'} ${
                      solved ? '#4ADE80' : (down?.color ?? across.color)
                    }`,
                    borderRight: `${solved ? 3 : 2}px ${down ? 'dashed' : 'solid'} ${
                      solved ? '#4ADE80' : (down?.color ?? across.color)
                    }`,
                    outline: hover === key ? '3px solid #FACC15' : lit ? '3px solid #FDE68A' : 'none',
                    outlineOffset: '2px',
                    transform: isWrong ? 'translateX(-3px)' : 'none',
                  }}
                >
                  {isWrong ? wrongTile?.letter : letter}
                  {isWrong && <span className="sr-only">틀린 글자</span>}
                </button>
              );
            })}
          </div>

          {/* 힌트 카드 — 번호를 쓰지 않는다. 색과 화살표, 그리고 눌러서 판을 밝히는 것으로 잇는다. */}
          <ul className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
            {words.map((spec, index) => {
              const solved = done.includes(index);
              return (
                <li key={spec.word}>
                  <button
                    type="button"
                    onClick={() => { setFocus(index); speakNow(spec.hint.replace('○○', solved ? spec.word : '무엇')); }}
                    className="flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 text-left text-[15px] font-bold leading-snug transition"
                    style={{
                      background: focus === index ? 'var(--board-overlay)' : 'var(--board-surface)',
                      border: `2px solid ${solved ? '#4ADE80' : spec.color}`,
                      color: 'var(--board-ink)',
                    }}
                  >
                    <span aria-hidden="true" className="text-[17px]" style={{ color: solved ? '#4ADE80' : spec.color }}>
                      {solved ? '✓' : spec.dir === 'across' ? '→' : '↓'}
                    </span>
                    <span className="min-w-0">
                      {solved ? spec.hint.replace('○○', spec.word) : spec.hint}
                      <span className="ml-1 text-[14px] font-black" style={{ color: spec.color }}>{spec.slot}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 글자 보관함 */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tray.map((tile) => (
            <button
              key={tile.id}
              type="button"
              disabled={!game.playing || tile.used}
              aria-pressed={picked === tile.id}
              aria-label={`글자 ${tile.letter}`}
              onPointerDown={(event) => onTilePointerDown(event, tile)}
              onPointerMove={(event) => onTilePointerMove(event, tile)}
              onPointerUp={(event) => onTilePointerUp(event, tile)}
              onPointerCancel={() => { dragRef.current = null; setGhost(null); setHover(null); }}
              onClick={() => onTileClick(tile)}
              className="grid place-items-center rounded-lg font-black transition disabled:opacity-25"
              style={{
                width: Math.round(cellPx * 0.82),
                height: Math.round(cellPx * 0.82),
                fontSize: `${Math.round(cellFont * 0.9)}px`,
                touchAction: 'none',
                background: 'var(--board-surface)',
                border: `${picked === tile.id ? 3 : 2}px solid ${picked === tile.id ? '#FACC15' : 'var(--board-line)'}`,
                color: 'var(--board-ink)',
                opacity: wrong?.tile === tile.id ? 0.4 : undefined,
              }}
            >
              {tile.letter}
            </button>
          ))}
        </div>

        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>
      </div>

      {/* 끌고 있는 글자. 손끝을 그대로 따라온다. */}
      {ghost && (
        <span
          aria-hidden="true"
          className="pointer-events-none fixed z-50 grid place-items-center rounded-lg font-black"
          style={{
            left: 0,
            top: 0,
            width: Math.round(cellPx * 0.82),
            height: Math.round(cellPx * 0.82),
            fontSize: `${Math.round(cellFont * 0.9)}px`,
            transform: `translate3d(${ghost.x - cellPx * 0.41}px, ${ghost.y - cellPx * 0.41}px, 0)`,
            background: 'var(--board-surface)',
            border: '3px solid #FACC15',
            color: 'var(--board-ink)',
          }}
        >
          {ghost.letter}
        </span>
      )}
    </MiniGameFrame>
  );
}
