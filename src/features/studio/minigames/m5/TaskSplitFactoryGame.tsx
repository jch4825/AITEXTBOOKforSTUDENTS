import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m5-l2 · 과제 분해 공장 (장르 52 · 방치형 공장)
 *
 * "큰 일을 작은 과제로 나눈다"를 기계 놓기로 만든다. 큰 덩어리는 그대로는 출고구를
 * 지날 수 없고, 분해기를 지나야 작은 과제 세 개가 된다.
 *
 * 아이미 목록에는 딴 일이 섞여 있다. 검수대를 어디에 둘지가 "필요 없는 과제 빼기"다.
 */

const COLS = 6;
const ROWS = 5;

type Machine = 'belt' | 'split' | 'check' | null;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  big: string;
  small: string[];
  junk: string[];
  need: number;
  budget: { belt: number; split: number; check: number };
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'booth',
    label: '기본',
    spoken: '부스 설치를 작은 과제로 나눠요.',
    big: '부스 설치',
    small: ['자리 정하기', '천막 세우기', '책상 놓기'],
    junk: ['노래 고르기'],
    need: 6,
    budget: { belt: 8, split: 2, check: 1 },
    seconds: 100,
  },
  {
    id: 'show',
    label: '1단계',
    spoken: '발표 준비를 작은 과제로 나눠요.',
    big: '발표 준비',
    small: ['자료 모으기', '차례 정하기', '연습하기'],
    junk: ['간식 사기', '사진 찍기'],
    need: 9,
    budget: { belt: 9, split: 2, check: 2 },
    seconds: 95,
  },
  {
    id: 'clean',
    label: '2단계',
    spoken: '대청소를 작은 과제로 나눠요.',
    big: '교실 대청소',
    small: ['쓸기', '닦기', '정리하기'],
    junk: ['게임하기', '노래 틀기', '낮잠 자기'],
    need: 9,
    budget: { belt: 9, split: 2, check: 2 },
    seconds: 90,
  },
];

interface Item {
  id: number;
  c: number;
  r: number;
  big: boolean;
  text: string;
  junk: boolean;
}

const DIRS: Record<number, { c: number; r: number; arrow: string }> = {
  0: { c: 1, r: 0, arrow: '→' },
  1: { c: 0, r: 1, arrow: '↓' },
  2: { c: -1, r: 0, arrow: '←' },
  3: { c: 0, r: -1, arrow: '↑' },
};

export default function TaskSplitFactoryGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 놓을 수 있는 기계 수·흐름 속도·시간으로 나타난다. 나눌 일은 같다. */
  const budget = {
    belt: Math.round(stage.budget.belt * clamp(tuning.density, 0.9, 1.3)),
    split: stage.budget.split,
    check: stage.budget.check,
  };
  const tick = 0.6 / clamp(tuning.speed, 0.75, 1.3);
  const seconds = Math.round(stage.seconds * tuning.time);

  const [grid, setGrid] = useState<Machine[][]>(
    () => Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null as Machine)),
  );
  const [dirs, setDirs] = useState<number[][]>(
    () => Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => 0)),
  );
  const [tool, setTool] = useState<Exclude<Machine, null>>('belt');
  const [running, setRunning] = useState(false);
  const [shipped, setShipped] = useState(0);
  const [note, setNote] = useState('');
  const [left, setLeft] = useState(seconds);
  const itemsRef = useRef<Item[]>([]);
  const timerRef = useRef(0);
  const spawnRef = useRef(0);
  const nextId = useRef(1);
  const doneRef = useRef(false);
  const [, redraw] = useState(0);

  const reset = () => {
    setGrid(Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null as Machine)));
    setDirs(Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => 0)));
    setTool('belt');
    setRunning(false);
    setShipped(0);
    setNote('');
    setLeft(seconds);
    itemsRef.current = [];
    timerRef.current = 0;
    spawnRef.current = 0;
    nextId.current = 1;
    doneRef.current = false;
  };

  useEffect(reset, [game.round, game.stageIndex, stage, seconds]);

  const used = (kind: Exclude<Machine, null>) => grid.flat().filter((cell) => cell === kind).length;

  const place = (r: number, c: number) => {
    if (!game.playing || running) return;
    const current = grid[r][c];
    if (current === tool) {
      // 같은 기계를 다시 누르면 방향이 돈다
      setDirs((prev) => prev.map((row, ri) => row.map((value, ci) => (ri === r && ci === c ? (value + 1) % 4 : value))));
      playSound('select');
      return;
    }
    if (current === null && used(tool) >= budget[tool]) {
      setNote(`${tool === 'belt' ? '컨베이어' : tool === 'split' ? '분해기' : '검수대'}를 더 놓을 수 없어요.`);
      return;
    }
    playSound('select');
    setGrid((prev) => prev.map((row, ri) => row.map((value, ci) => (ri === r && ci === c ? tool : value))));
    setNote('');
  };

  const clearCell = (r: number, c: number) => {
    if (!game.playing || running) return;
    setGrid((prev) => prev.map((row, ri) => row.map((value, ci) => (ri === r && ci === c ? null : value))));
  };

  useGameLoop(running && game.playing, (dt) => {
    setLeft((value) => {
      const next = Math.max(0, value - dt);
      if (next <= 0 && !doneRef.current) {
        doneRef.current = true;
        game.fail('시간이 지났어요. 분해기와 검수대를 라인 위에 놓아 봐요.');
      }
      return next;
    });

    timerRef.current += dt;
    spawnRef.current += dt;

    if (spawnRef.current > tick * 2.2) {
      spawnRef.current = 0;
      itemsRef.current.push({ id: nextId.current++, c: 0, r: 2, big: true, text: stage.big, junk: false });
    }

    if (timerRef.current < tick) { redraw((n) => n + 1); return; }
    timerRef.current = 0;

    const next: Item[] = [];
    for (const item of itemsRef.current) {
      const machine = grid[item.r]?.[item.c] ?? null;

      if (machine === 'split' && item.big) {
        // 큰 일이 분해기를 지나면 작은 과제와 딴 일로 갈라진다
        const parts = [...stage.small, ...stage.junk.slice(0, 1)];
        parts.forEach((text, index) => {
          next.push({
            id: nextId.current++,
            c: item.c,
            r: clamp(item.r + index - 1, 0, ROWS - 1),
            big: false,
            text,
            junk: stage.junk.includes(text),
          });
        });
        continue;
      }

      if (machine === 'check' && item.junk) {
        // 검수대는 딴 일을 걸러 낸다
        continue;
      }

      const dir = DIRS[dirs[item.r]?.[item.c] ?? 0];
      const nc = item.c + (machine ? dir.c : 1);
      const nr = item.r + (machine ? dir.r : 0);

      if (nc >= COLS) {
        if (item.big) {
          setNote('큰 일이 그대로 나갔어요. 분해기를 라인 위에 놓아야 합니다.');
          if (!doneRef.current) {
            doneRef.current = true;
            game.fail('큰 일이 나뉘지 않은 채 출고됐어요. 분해기를 라인 위에 놓아 봐요.');
          }
          continue;
        }
        if (item.junk) {
          if (!doneRef.current) {
            doneRef.current = true;
            game.fail('필요 없는 과제가 나갔어요. 검수대를 라인 위에 놓아 걸러 봐요.');
          }
          continue;
        }
        setShipped((n) => {
          const value = n + 1;
          if (value >= stage.need && !doneRef.current) {
            doneRef.current = true;
            game.succeed('큰 일을 작은 과제로 나누고 필요 없는 것은 걸러 내보냈어요!');
          }
          return value;
        });
        continue;
      }

      if (nr < 0 || nr >= ROWS || nc < 0) continue;
      next.push({ ...item, c: nc, r: nr });
    }
    itemsRef.current = next.slice(0, 40);
    redraw((n) => n + 1);
  });

  const start = () => {
    if (!game.playing) return;
    setRunning(true);
    setNote('라인이 돌아갑니다.');
  };

  const label: Record<Exclude<Machine, null>, string> = {
    belt: '컨베이어',
    split: '분해기',
    check: '검수대',
  };
  const icon: Record<Exclude<Machine, null>, string> = { belt: '➡️', split: '✂️', check: '🔍' };

  return (
    <MiniGameFrame
      badge="과제 분해 공장"
      instruction="큰 일을 작은 단계로 나누어 주는 기계를 알맞게 놓고, 관계없는 일은 걸러내어 차례대로 완성해 보세요."
      progress={{ label: '내보낸 과제', value: shipped, max: stage.need }}
      hud={<GameHud timeLeft={left} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 놓기" />
          <MiniGameButton onClick={start} disabled={running || !game.playing} emoji="▶️" label="실행" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['belt', 'split', 'check'] as Exclude<Machine, null>[]).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setTool(kind)}
              aria-pressed={tool === kind}
              disabled={running}
              className="min-h-11 rounded-xl px-2.5 text-[15px] font-black transition"
              style={{
                background: tool === kind ? '#38BDF8' : 'var(--board-surface)',
                color: tool === kind ? '#0F172A' : 'var(--board-ink)',
                border: '2px solid #38BDF8',
              }}
            >
              {icon[kind]} {label[kind]} {used(kind)}/{budget[kind]}
            </button>
          ))}
          <span className="text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
            투입 · {stage.big}
          </span>
        </div>

        <div
          className="grid min-h-0 flex-1 gap-1 rounded-xl p-1.5"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
            background: 'var(--board-overlay)',
            border: '2px solid var(--board-line)',
          }}
        >
          {grid.map((row, r) => row.map((cell, c) => {
            const item = itemsRef.current.find((it) => it.c === c && it.r === r);
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => place(r, c)}
                onContextMenu={(event) => { event.preventDefault(); clearCell(r, c); }}
                disabled={running || !game.playing}
                aria-label={`${r + 1}행 ${c + 1}열 ${cell ? label[cell] : '빈 칸'}`}
                className="relative flex min-h-0 flex-col items-center justify-center rounded-lg text-[14px] font-black leading-tight"
                style={{
                  background: cell ? 'var(--board-surface)' : 'rgba(30, 41, 59, 0.5)',
                  border: `2px solid ${cell ? '#38BDF8' : 'rgba(100, 116, 139, 0.35)'}`,
                  color: 'var(--board-ink)',
                }}
              >
                {cell && <span aria-hidden="true">{icon[cell]}{DIRS[dirs[r][c]].arrow}</span>}
                {r === 2 && c === 0 && !cell && <span aria-hidden="true">📥</span>}
                {item && (
                  <span
                    className="absolute inset-x-0.5 bottom-0.5 rounded px-0.5 text-[14px]"
                    style={{
                      background: item.big ? '#7C3AED' : item.junk ? '#7F1D1D' : '#065F46',
                      color: 'var(--board-ink)',
                    }}
                  >
                    {item.text}
                  </span>
                )}
              </button>
            );
          }))}
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
          {note || '오른쪽 끝이 출고구입니다. 작은 과제만 내보내세요.'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
