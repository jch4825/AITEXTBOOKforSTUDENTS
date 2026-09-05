import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, randInt, useCountdown } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l4 · 예시 지뢰 찾기 (장르 20 → 지뢰 찾기)
 *
 * "예시를 보여 주면 답이 정확해진다"를 숫자 힌트로 만든다. 아무 예시도 없이 칸을 열면
 * 어디에 엉뚱한 답이 숨었는지 알 길이 없고, 한 칸을 열 때마다 나오는 숫자가 곧
 * "옆에 엉뚱한 답이 몇 개 있는지" 알려 주는 예시가 된다.
 *
 * [예시 보여 주기]는 안전한 칸을 하나 열어 준다. 편하지만 스스로 연 칸 수가 줄어
 * 결과 문구가 달라진다 — 예시를 얼마나 썼는지가 남는다.
 */

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  cols: number;
  rows: number;
  mines: number;
  seconds: number;
}

const STAGES: StageConfig[] = [
  { id: 'small', label: '기본', spoken: '엉뚱한 답을 피해 칸을 열어요.', cols: 7, rows: 6, mines: 6, seconds: 150 },
  { id: 'mid', label: '1단계', spoken: '엉뚱한 답을 피해 칸을 열어요.', cols: 8, rows: 7, mines: 9, seconds: 140 },
  { id: 'big', label: '2단계', spoken: '엉뚱한 답을 피해 칸을 열어요.', cols: 9, rows: 8, mines: 13, seconds: 130 },
];

interface Cell {
  mine: boolean;
  near: number;
  open: boolean;
  flag: boolean;
}

function buildBoard(cols: number, rows: number, mines: number, seed: number): Cell[][] {
  const random = createRandom(seed);
  const board: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, near: 0, open: false, flag: false })),
  );
  let placed = 0;
  while (placed < mines) {
    const r = randInt(random, 0, rows);
    const c = randInt(random, 0, cols);
    // 왼쪽 위 첫 칸 둘레는 비워 둔다. 첫 수부터 지뢰를 밟는 판은 학생이 배울 것이 없다.
    if (r <= 1 && c <= 1) continue;
    if (board[r][c].mine) continue;
    board[r][c].mine = true;
    placed += 1;
  }
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (board[r][c].mine) continue;
      let near = 0;
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (board[nr][nc].mine) near += 1;
        }
      }
      board[r][c].near = near;
    }
  }
  return board;
}

const NUM_COLOR = ['', '#38BDF8', '#4ADE80', '#FBBF24', '#FB923C', '#FB7185', '#C4B5FD', '#F472B6', '#E2E8F0'];

export default function ExampleGridGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시간·기회·예시 횟수로 나타난다. 판 크기와 숨은 개수는 스테이지가 정한다. */
  const seconds = Math.round(stage.seconds * tuning.time);
  const maxLives = tuning.lives;
  const maxHints = Math.max(1, Math.round(tuning.lives * 0.8));

  const [board, setBoard] = useState<Cell[][]>(() => buildBoard(stage.cols, stage.rows, stage.mines, game.seed));
  const [flagMode, setFlagMode] = useState(false);
  const [lives, setLives] = useState(maxLives);
  const [hints, setHints] = useState(maxHints);
  const [selfOpen, setSelfOpen] = useState(0);
  const [done, setDone] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    setBoard(buildBoard(stage.cols, stage.rows, stage.mines, game.seed));
    setFlagMode(false);
    setLives(maxLives);
    setHints(maxHints);
    setSelfOpen(0);
    setDone(false);
    setNote('');
  }, [game.round, game.stageIndex, stage, game.seed, maxLives, maxHints]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    if (!done) game.fail('시간이 지났어요. 열린 칸의 숫자를 예시 삼아 안전한 칸을 찾아 봐요.');
  });

  const safeTotal = stage.cols * stage.rows - stage.mines;

  /** 0이 나온 칸은 둘레까지 함께 열어 준다. 한 칸씩 눌러야 한다면 숫자 예시가 쓸모없어진다. */
  const flood = (next: Cell[][], r: number, c: number) => {
    const queue: number[][] = [[r, c]];
    while (queue.length > 0) {
      const [cr, cc] = queue.shift() as number[];
      const cell = next[cr][cc];
      if (cell.open || cell.flag || cell.mine) continue;
      cell.open = true;
      if (cell.near !== 0) continue;
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (nr < 0 || nr >= stage.rows || nc < 0 || nc >= stage.cols) continue;
          if (!next[nr][nc].open) queue.push([nr, nc]);
        }
      }
    }
  };

  const finishIfCleared = (next: Cell[][], openedBySelf: number) => {
    const opened = next.flat().filter((cell) => cell.open).length;
    if (opened < safeTotal) return false;
    setDone(true);
    game.succeed(
      openedBySelf >= safeTotal
        ? '예시를 한 번도 받지 않고 엉뚱한 답을 모두 피했어요!'
        : `숫자 예시를 보고 엉뚱한 답을 모두 피했어요. 스스로 연 칸이 ${openedBySelf}개입니다.`,
    );
    return true;
  };

  const dig = (r: number, c: number) => {
    if (!game.playing || done) return;
    const cell = board[r][c];
    if (cell.open) return;

    if (flagMode) {
      playSound('select');
      setBoard((prev) => prev.map((row, ri) => row.map((item, ci) => (
        ri === r && ci === c ? { ...item, flag: !item.flag } : item
      ))));
      return;
    }
    if (cell.flag) {
      setNote('깃발을 먼저 빼야 열 수 있어요.');
      return;
    }

    if (cell.mine) {
      playSound('select');
      const left = lives - 1;
      setLives(left);
      setBoard((prev) => prev.map((row, ri) => row.map((item, ci) => (
        ri === r && ci === c ? { ...item, flag: true } : item
      ))));
      setNote('엉뚱한 답이 숨어 있었어요. 깃발로 표시해 둡니다.');
      if (left <= 0) {
        setDone(true);
        game.fail('엉뚱한 답을 여러 번 열었어요. 열린 칸의 숫자를 예시로 삼아 골라 봐요.');
      }
      return;
    }

    playSound('fill');
    const next = board.map((row) => row.map((item) => ({ ...item })));
    flood(next, r, c);
    const opened = next.flat().filter((item) => item.open).length;
    const bySelf = selfOpen + (opened - board.flat().filter((item) => item.open).length);
    setBoard(next);
    setSelfOpen(bySelf);
    setNote('');
    finishIfCleared(next, bySelf);
  };

  const showExample = () => {
    if (!game.playing || done || hints <= 0) return;
    const spots: number[][] = [];
    for (let r = 0; r < stage.rows; r += 1) {
      for (let c = 0; c < stage.cols; c += 1) {
        if (!board[r][c].mine && !board[r][c].open) spots.push([r, c]);
      }
    }
    if (spots.length === 0) return;
    // 숫자가 낮은 칸을 골라 준다. 주변이 넓게 열려 예시로 삼기 좋다.
    spots.sort((a, b) => board[a[0]][a[1]].near - board[b[0]][b[1]].near);
    const [r, c] = spots[0];
    const next = board.map((row) => row.map((item) => ({ ...item })));
    flood(next, r, c);
    setBoard(next);
    setHints(hints - 1);
    setNote('예시로 안전한 칸을 하나 열었어요. 옆 숫자를 보고 다음 칸을 골라 보세요.');
    playSound('confirm');
    finishIfCleared(next, selfOpen);
  };

  const opened = board.flat().filter((cell) => cell.open).length;

  return (
    <MiniGameFrame
      badge="예시 지뢰 찾기"
      instruction="칸을 눌러 열면서 숨어 있는 엉뚱한 답을 찾아보세요. 잘못된 예시가 숨어 있는 위험한 칸에는 깃발을 꽂아 표시해 봅시다."
      progress={{ label: '연 칸', value: opened, max: safeTotal }}
      hud={<GameHud lives={lives} maxLives={maxLives} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton
            onClick={() => setFlagMode((v) => !v)}
            emoji={flagMode ? '🚩' : '⛏️'}
            label={flagMode ? '깃발 모드' : '열기 모드'}
          />
          {game.hintAllowed && (
            <MiniGameButton onClick={showExample} disabled={hints <= 0} emoji="💡" label={`예시 ${hints}`} />
          )}
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div
          className="grid min-h-0 flex-1 gap-0.5 rounded-xl p-1.5"
          style={{
            gridTemplateColumns: `repeat(${stage.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${stage.rows}, minmax(0, 1fr))`,
            background: 'var(--board-overlay)',
            border: '2px solid var(--board-line)',
          }}
        >
          {board.map((row, r) => row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              onClick={() => dig(r, c)}
              onContextMenu={(event) => {
                event.preventDefault();
                if (!game.playing || done || cell.open) return;
                setBoard((prev) => prev.map((line, ri) => line.map((item, ci) => (
                  ri === r && ci === c ? { ...item, flag: !item.flag } : item
                ))));
              }}
              disabled={!game.playing || done}
              aria-label={`${r + 1}행 ${c + 1}열 ${cell.open ? `숫자 ${cell.near}` : cell.flag ? '깃발' : '닫힌 칸'}`}
              className="flex min-h-0 items-center justify-center rounded text-[16px] font-black"
              style={{
                background: cell.open ? 'var(--board-surface)' : '#334155',
                border: `2px solid ${cell.flag ? '#FB7185' : cell.open ? 'rgba(100,116,139,0.35)' : '#64748B'}`,
                color: cell.open ? NUM_COLOR[cell.near] : 'var(--board-ink)',
              }}
            >
              {cell.flag ? '🚩' : cell.open ? (cell.near > 0 ? cell.near : '') : ''}
            </button>
          )))}
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
          {note || '숫자는 그 칸 둘레에 숨은 엉뚱한 답의 개수입니다.'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
