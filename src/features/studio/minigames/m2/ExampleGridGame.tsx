import React, { useEffect, useMemo, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, PLAY, clamp, useCountdown, useGameKeys, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l4 · 예시 그림 채우기 (장르 20 · 노노그램)
 *
 * "예시를 하나 주면 답이 또렷해진다"를 규칙 자체로 만든다. 보통 노노그램은 숫자 힌트를
 * 다 보여 주고 시작하지만, 이 판은 힌트가 전부 가려진 채 시작한다. 학생은 원하는 그림이
 * 무엇인지만 알 뿐, 어디를 칠해야 하는지는 모른다. 예시를 한 번 보여 줄 때마다 한 줄의
 * 숫자가 드러나고 그 줄의 정답 칸이 잠깐 반짝인다. 즉 예시를 줄수록 판이 쉬워진다.
 *
 * 대신 "예시 없이 맞힌 칸"을 따로 세고, 예시를 연 줄의 칸은 그 수에서 빠진다. 그래서
 * 예시를 주기 전과 후가 한 화면에서 비교된다 — 예시 없이 맞힌 칸이 많으면 스스로 알아낸
 * 것이고, 예시를 많이 쓰면 그만큼 답을 받아 적은 것이다.
 *
 * 정답표 조회가 아니다. 판 위의 그림은 학생이 칠한 칸에서 그대로 생긴다.
 */

const SIZE = 5;
const CELL_TOTAL = SIZE * SIZE;
/** 줄은 가로 5줄 + 세로 5줄. 예시 한 번이 이 중 한 줄을 연다. */
const LINE_TOTAL = SIZE * 2;

interface StageConfig {
  id: string;
  label: string;
  /** 학생이 원하는 그림의 이름. 무엇을 얻고 싶은지는 처음부터 알고 시작한다. */
  title: string;
  emoji: string;
  /** 'X'가 칠할 칸. 손으로 적고 힌트 숫자는 여기서 계산한다. */
  rows: string[];
  /** 예시 버튼이 줄을 여는 순서. 도움이 큰 줄부터 열어 준다. */
  exampleOrder: string[];
}

const STAGES: StageConfig[] = [
  {
    id: 'star',
    label: '기본',
    title: '별',
    emoji: '⭐',
    rows: ['..X..', '.XXX.', 'XXXXX', '..X..', '.X.X.'],
    exampleOrder: ['r2', 'r1', 'c2', 'r4', 'r0', 'c1', 'c3', 'r3', 'c0', 'c4'],
  },
  {
    id: 'house',
    label: '1단계',
    title: '집',
    emoji: '🏠',
    rows: ['..X..', '.XXX.', 'XXXXX', 'XX.XX', 'XX.XX'],
    exampleOrder: ['r2', 'r3', 'c1', 'r1', 'r4', 'c3', 'r0', 'c0', 'c4', 'c2'],
  },
  {
    id: 'heart',
    label: '2단계',
    title: '하트',
    emoji: '💗',
    rows: ['XX.XX', 'XXXXX', 'XXXXX', '.XXX.', '..X..'],
    exampleOrder: ['r1', 'r2', 'c1', 'r0', 'r3', 'c3', 'r4', 'c0', 'c4', 'c2'],
  },
];

/** 한 줄에서 이어 칠한 칸의 길이들. 노노그램 숫자 힌트가 곧 이것이다. */
function runsOf(line: boolean[]): number[] {
  const out: number[] = [];
  let run = 0;
  for (const on of line) {
    if (on) run += 1;
    else if (run > 0) {
      out.push(run);
      run = 0;
    }
  }
  if (run > 0) out.push(run);
  return out.length > 0 ? out : [0];
}

function solutionOf(stage: StageConfig): boolean[] {
  return stage.rows.join('').split('').map((mark) => mark === 'X');
}

/** 줄 이름을 그 줄에 속한 칸 번호로 바꾼다. r2는 세 번째 가로줄, c0은 첫 세로줄이다. */
function cellsOfLine(lineId: string): number[] {
  const index = Number(lineId.slice(1));
  const cells: number[] = [];
  for (let k = 0; k < SIZE; k += 1) {
    cells.push(lineId[0] === 'r' ? index * SIZE + k : k * SIZE + index);
  }
  return cells;
}

/** 0 빈칸, 1 칠한 칸, 2 아니라고 밝혀진 칸 */
interface Board {
  key: string;
  cells: number[];
  lives: number;
  revealed: string[];
  /** 첫 조작 전에는 시간이 가지 않는다. 준비 상태를 두라는 감각 규칙이다. */
  started: boolean;
}

function emptyBoard(key: string, lives: number): Board {
  return { key, cells: new Array(CELL_TOTAL).fill(0), lives, revealed: [], started: false };
}

export default function ExampleGridGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const solution = useMemo(() => solutionOf(stage), [stage]);
  const totalFilled = useMemo(() => solution.filter(Boolean).length, [solution]);
  const rowHints = useMemo(
    () => Array.from({ length: SIZE }, (_, r) => runsOf(solution.slice(r * SIZE, r * SIZE + SIZE))),
    [solution],
  );
  const colHints = useMemo(
    () => Array.from({ length: SIZE }, (_, c) => runsOf(
      Array.from({ length: SIZE }, (_, r) => solution[r * SIZE + c]),
    )),
    [solution],
  );

  // 지원 수준은 같은 판의 요구 수준만 바꾼다 — 기회, 제한 시간, 예시 횟수와 반짝임 길이.
  const maxLives = tuning.lives + 2;
  const seconds = Math.round(95 * tuning.time);
  const flashMs = Math.round(1500 * tuning.tolerance);
  const exampleLimit = Math.max(
    1,
    Math.min(LINE_TOTAL, Math.round((game.hintAllowed ? 4 : 3) * tuning.tolerance)),
  );

  const boardKey = `${game.stageIndex}-${game.round}`;
  const [board, setBoard] = useState<Board>(() => emptyBoard(boardKey, maxLives));
  const [flash, setFlash] = useState<number[]>([]);
  const [shake, setShake] = useState<{ index: number; dx: number } | null>(null);
  const [cursor, setCursor] = useState(12);

  const boardRef = useRef(board);
  boardRef.current = board;
  const finishedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const dragRef = useRef<{ active: boolean; mode: 'fill' | 'clear'; done: Set<number> }>({
    active: false, mode: 'fill', done: new Set(),
  });
  const keys = useGameKeys(game.playing);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    setBoard(emptyBoard(boardKey, maxLives));
    setFlash([]);
    setShake(null);
    setCursor(12);
    dragRef.current = { active: false, mode: 'fill', done: new Set() };
    finishedRef.current = false;
    clearTimers();
  }, [boardKey, maxLives]);

  useEffect(() => clearTimers, []);

  const filledCount = useMemo(() => board.cells.filter((value) => value === 1).length, [board.cells]);

  // 예시를 연 줄의 칸은 "스스로 맞힌 칸"에서 빠진다. 예시 전과 후의 차이가 이 숫자에 보인다.
  const soloCount = useMemo(() => {
    let count = 0;
    for (let index = 0; index < CELL_TOTAL; index += 1) {
      if (board.cells[index] !== 1) continue;
      const r = Math.floor(index / SIZE);
      const c = index % SIZE;
      if (board.revealed.includes(`r${r}`) || board.revealed.includes(`c${c}`)) continue;
      count += 1;
    }
    return count;
  }, [board.cells, board.revealed]);

  const handleTimeout = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    game.fail('시간이 다 되었어요. 예시를 먼저 한 줄 열고 그 줄부터 채워 보세요.');
  };
  const timeLeft = useCountdown(
    game.playing && board.started,
    seconds,
    game.round * 10 + game.stageIndex,
    handleTimeout,
  );

  /** 틀린 칸을 옆으로 흔든다. 키프레임 없이도 되도록 짧은 시간 간격으로 어긋나게 그린다. */
  const triggerShake = (index: number) => {
    clearTimers();
    const steps = [-7, 7, -4, 3, 0];
    setShake({ index, dx: steps[0] });
    steps.slice(1).forEach((dx, order) => {
      timersRef.current.push(window.setTimeout(
        () => setShake(dx === 0 ? null : { index, dx }),
        (order + 1) * 70,
      ));
    });
  };

  const applyPaint = (index: number, mode: 'fill' | 'clear') => {
    const current = boardRef.current;
    if (current.key !== boardKey || finishedRef.current || !game.playing) return;
    const value = current.cells[index];

    if (mode === 'clear') {
      if (value !== 1) return;
      playSound('select');
      setBoard((prev) => {
        const cells = prev.cells.slice();
        cells[index] = 0;
        return { ...prev, cells, started: true };
      });
      return;
    }

    if (value !== 0) return;
    playSound('select');
    if (solution[index]) {
      setBoard((prev) => {
        const cells = prev.cells.slice();
        cells[index] = 1;
        return { ...prev, cells, started: true };
      });
      return;
    }
    // 칠하면 안 되는 칸이었다. 기회 하나를 쓰는 대신 그 자리는 "아니다"로 남아 다음 판단을 돕는다.
    triggerShake(index);
    dragRef.current.active = false;
    setBoard((prev) => {
      const cells = prev.cells.slice();
      cells[index] = 2;
      return { ...prev, cells, lives: prev.lives - 1, started: true };
    });
  };

  const cellAt = (clientX: number, clientY: number): number | null => {
    const element = document.elementFromPoint(clientX, clientY);
    const cell = element ? element.closest('[data-cell]') : null;
    if (!cell) return null;
    const raw = (cell as HTMLElement).dataset.cell;
    return raw === undefined ? null : Number(raw);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!game.playing) return;
    const index = cellAt(event.clientX, event.clientY);
    if (index === null) return;
    try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* 무시 */ }
    const mode: 'fill' | 'clear' = boardRef.current.cells[index] === 1 ? 'clear' : 'fill';
    dragRef.current = { active: true, mode, done: new Set([index]) };
    setCursor(index);
    applyPaint(index, mode);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || !game.playing) return;
    const index = cellAt(event.clientX, event.clientY);
    if (index === null || drag.done.has(index)) return;
    drag.done.add(index);
    setCursor(index);
    applyPaint(index, drag.mode);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    try { event.currentTarget.releasePointerCapture?.(event.pointerId); } catch { /* 무시 */ }
    dragRef.current.active = false;
  };

  // 마우스를 쥐기 어려운 학생도 판 전체를 다룰 수 있어야 한다. 방향키로 칸을 옮기고 스페이스로 칠한다.
  useGameLoop(game.playing, () => {
    const r = Math.floor(cursor / SIZE);
    const c = cursor % SIZE;
    let nr = r;
    let nc = c;
    if (keys.consumePress('left')) nc -= 1;
    if (keys.consumePress('right')) nc += 1;
    if (keys.consumePress('up')) nr -= 1;
    if (keys.consumePress('down')) nr += 1;
    if (nr !== r || nc !== c) {
      setCursor(clamp(nr, 0, SIZE - 1) * SIZE + clamp(nc, 0, SIZE - 1));
    }
    if (keys.consumePress('action')) {
      applyPaint(cursor, boardRef.current.cells[cursor] === 1 ? 'clear' : 'fill');
    }
  });

  const showExample = () => {
    const current = boardRef.current;
    if (!game.playing || finishedRef.current || current.key !== boardKey) return;
    if (current.revealed.length >= exampleLimit) return;
    const next = stage.exampleOrder.find((lineId) => !current.revealed.includes(lineId));
    if (!next) return;
    playSound('stamp');
    setBoard((prev) => ({ ...prev, revealed: [...prev.revealed, next], started: true }));
    setFlash(cellsOfLine(next).filter((index) => solution[index]));
    clearTimers();
    timersRef.current.push(window.setTimeout(() => setFlash([]), flashMs));
  };

  useEffect(() => {
    if (board.key !== boardKey || finishedRef.current || !game.playing) return;
    if (totalFilled === 0 || filledCount < totalFilled) return;
    finishedRef.current = true;
    const used = board.revealed.length;
    if (used === 0) {
      game.succeed(`예시 없이 ${stage.title} 그림을 완성했어요. 원하는 답을 스스로 그려 냈습니다!`);
    } else if (used <= 2) {
      game.succeed(`예시 ${used}번만 보고 ${stage.title} 그림을 완성했어요. 예시 하나가 답을 또렷하게 만듭니다.`);
    } else {
      game.succeed(`예시 ${used}번을 보고 ${stage.title} 그림을 완성했어요. 예시를 줄수록 답이 쉬워집니다.`);
    }
  }, [filledCount, totalFilled, board.key, board.revealed, boardKey, game.playing, game.succeed, stage.title]);

  useEffect(() => {
    if (board.key !== boardKey || finishedRef.current || !game.playing) return;
    if (board.lives > 0) return;
    finishedRef.current = true;
    game.fail('칠하면 안 되는 칸을 여러 번 칠했어요. 예시 보여 주기를 눌러 한 줄을 열고 그 줄부터 채워 보세요.');
  }, [board.lives, board.key, boardKey, game.playing, game.fail]);

  const remaining = Math.max(0, exampleLimit - board.revealed.length);
  const allRevealed = board.revealed.length >= stage.exampleOrder.length;

  return (
    <MiniGameFrame
      badge="예시 그림 채우기"
      instruction="칸을 눌러 칠하고, 누른 채로 끌면 지나간 칸이 한꺼번에 칠해집니다. 어디를 칠할지 모르겠으면 예시 보여 주기를 눌러 한 줄을 열어 보세요."
      progress={{ label: '채운 칸', value: filledCount, max: totalFilled }}
      hud={(
        <GameHud
          lives={board.lives}
          maxLives={maxLives}
          score={soloCount}
          scoreLabel="예시 없이 맞힌 칸"
          timeLeft={timeLeft}
          timeTotal={seconds}
        />
      )}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].title} 그림으로 바꿨어요.`)}
      status={game.status}
      message={game.message}
      actions={(
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 채우기" />
          <MiniGameButton
            onClick={showExample}
            disabled={!game.playing || remaining <= 0 || allRevealed}
            emoji="🖼️"
            label={`예시 보여 주기 ${remaining}`}
            variant="primary"
          />
        </>
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 원하는 그림과 남은 예시 — 읽을 글은 판 위 한 줄에만 둔다 */}
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl px-3 py-2"
          style={{ background: 'var(--board-overlay)', border: `2px solid ${PLAY.info}` }}
        >
          <span className="text-[22px] leading-none" aria-hidden="true">{stage.emoji}</span>
          <span className="text-[16px] font-black" style={{ color: 'var(--board-ink)' }}>
            원하는 그림: {stage.title}
          </span>
          <span className="ml-auto text-[15px] font-black" style={{ color: PLAY.info }}>
            남은 예시 {remaining}번
          </span>
          {!board.started && (
            <span className="w-full text-[15px] font-bold" style={{ color: 'var(--board-ink-dim, #CBD5E1)' }}>
              칸을 누르거나 예시를 열면 시간이 갑니다.
            </span>
          )}
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div
            role="group"
            aria-label={`5칸씩 5줄 판. 채운 칸 ${filledCount}개, 남은 기회 ${board.lives}개, 남은 예시 ${remaining}번.`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="grid aspect-square w-full max-w-[430px] gap-1"
            style={{
              gridTemplateColumns: '54px repeat(5, 1fr)',
              gridTemplateRows: '54px repeat(5, 1fr)',
              touchAction: 'none',
            }}
          >
            {/* 왼쪽 위 빈 자리 — 지금까지 연 줄 수를 적어 둔다 */}
            <div
              className="flex flex-col items-center justify-center rounded-lg text-[14px] font-black leading-tight"
              style={{ background: 'var(--board-overlay)', border: '2px solid var(--board-line)', color: PLAY.info }}
            >
              <span aria-hidden="true">연 줄</span>
              <span>{board.revealed.length}</span>
            </div>

            {colHints.map((hint, c) => {
              const open = board.revealed.includes(`c${c}`);
              return (
                <div
                  key={`col-${c}`}
                  className="flex flex-col items-center justify-end gap-0 rounded-lg pb-1 text-[14px] font-black leading-tight"
                  style={{
                    background: 'var(--board-overlay)',
                    border: `2px solid ${open ? PLAY.info : 'var(--board-line)'}`,
                    color: open ? 'var(--board-ink)' : 'var(--board-line)',
                  }}
                >
                  {open ? hint.map((n, i) => <span key={i}>{n}</span>) : <span>?</span>}
                </div>
              );
            })}

            {rowHints.map((hint, r) => {
              const open = board.revealed.includes(`r${r}`);
              return (
                <React.Fragment key={`row-${r}`}>
                  <div
                    className="flex items-center justify-end gap-1.5 rounded-lg pr-1.5 text-[14px] font-black"
                    style={{
                      gridColumn: 1,
                      background: 'var(--board-overlay)',
                      border: `2px solid ${open ? PLAY.info : 'var(--board-line)'}`,
                      color: open ? 'var(--board-ink)' : 'var(--board-line)',
                    }}
                  >
                    {open ? hint.map((n, i) => <span key={i}>{n}</span>) : <span>?</span>}
                  </div>
                  {Array.from({ length: SIZE }, (_, c) => {
                    const index = r * SIZE + c;
                    const value = board.cells[index];
                    const lit = flash.includes(index);
                    const here = cursor === index;
                    const dx = shake && shake.index === index ? shake.dx : 0;
                    let background = 'var(--board-surface)';
                    let edge = 'rgba(100, 116, 139, 0.6)';
                    if (value === 1) {
                      background = PLAY.hero;
                      edge = PLAY.heroEdge;
                    } else if (value === 2) {
                      background = 'rgba(251, 113, 133, 0.22)';
                      edge = PLAY.hazard;
                    }
                    if (lit && value !== 1) {
                      background = 'rgba(56, 189, 248, 0.38)';
                      edge = PLAY.info;
                    }
                    return (
                      <div
                        key={index}
                        data-cell={index}
                        aria-hidden="true"
                        className="rounded-lg transition-colors duration-150"
                        style={{
                          background,
                          border: `2px solid ${edge}`,
                          outline: here ? `3px solid ${PLAY.hero}` : 'none',
                          outlineOffset: '2px',
                          transform: dx === 0 ? undefined : `translateX(${dx}px)`,
                        }}
                      >
                        {value === 2 && (
                          <span
                            className="flex h-full w-full items-center justify-center text-[16px] font-black"
                            style={{ color: PLAY.hazard }}
                          >
                            ✕
                          </span>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
