import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, randInt, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m5-l10 · 새는 곳 고치기 (장르 16 · 파이프 연결)
 *
 * m1-l9와 달리 길은 이미 이어져 있다. 이 차시의 핵심은 **재시험 고리**다.
 * 흘려 보면 처음 새는 곳에서 멈추고, 그 자리를 고친 뒤에는 반드시 처음부터
 * 다시 흘려야 한다. 앞부분이 여전히 성한지 확인하는 일이 여기서 조작이 된다.
 */

const COLS = 7;
const ROWS = 4;
const DR = [-1, 0, 1, 0];
const DC = [0, 1, 0, -1];

type PieceKind = 'I';
const BASE_DIRS: Record<PieceKind, number[]> = { I: [0, 2] };

interface Cell {
  kind: PieceKind;
  rotation: number;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  title: string;
  steps: string[];
  leaks: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'guide',
    label: '기본',
    spoken: '안내 순서에서 새는 곳을 찾아 고쳐요.',
    title: '도서관 이용 안내',
    steps: ['들어가기', '학생증 내기', '책 고르기', '빌리기', '나가기'],
    leaks: 2,
  },
  {
    id: 'cook',
    label: '1단계',
    spoken: '조리 순서에서 새는 곳을 찾아 고쳐요.',
    title: '간단 요리 순서',
    steps: ['손 씻기', '재료 꺼내기', '데우기', '담기', '치우기'],
    leaks: 3,
  },
  {
    id: 'trip',
    label: '2단계',
    spoken: '이동 순서에서 새는 곳을 찾아 고쳐요.',
    title: '버스 타는 순서',
    steps: ['정류장 찾기', '번호 확인', '방향 확인', '타기', '내리기'],
    leaks: 4,
  },
];

/** 가로로 곧게 이어진 길을 만들고, 그중 몇 칸만 어긋나게 돌려 둔다. */
function buildLine(seed: number, leaks: number): { cells: Cell[]; broken: number[] } {
  const random = createRandom(seed);
  const cells: Cell[] = Array.from({ length: COLS }, () => ({ kind: 'I' as PieceKind, rotation: 1 }));
  const broken: number[] = [];
  const spots = Array.from({ length: COLS - 2 }, (_, i) => i + 1);
  for (let i = 0; i < leaks && spots.length > 0; i += 1) {
    const pick = spots.splice(randInt(random, 0, spots.length), 1)[0];
    broken.push(pick);
    /* 어긋난 칸도 곧은 관(I)으로만 둔다. 꺾인 관(L)을 섞으면 아무리 돌려도 가로가
       되지 않아 학생이 고칠 방법이 없는 판이 나온다. 돌리기만으로 반드시 고쳐져야 한다. */
    cells[pick] = { kind: 'I', rotation: 0 };
  }
  return { cells, broken: broken.sort((a, b) => a - b) };
}

function openDirs(cell: Cell): number[] {
  return BASE_DIRS[cell.kind].map((d) => (d + cell.rotation) % 4);
}

export default function LeakFixPipeGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시험 횟수와 흐름 속도, 새는 곳 수로 나타난다. 재시험 규칙은 같다. */
  const maxRuns = Math.max(3, tuning.lives + 2);
  const flowStep = 0.34 / clamp(tuning.speed, 0.7, 1.35);
  const leaks = clamp(Math.round(stage.leaks * clamp(tuning.density, 0.7, 1.25)), 1, COLS - 2);

  const [cells, setCells] = useState<Cell[]>(() => buildLine(game.seed, leaks).cells);
  const [runs, setRuns] = useState(maxRuns);
  const [wet, setWet] = useState(0);
  const [leakAt, setLeakAt] = useState<number | null>(null);
  const [fixedLog, setFixedLog] = useState<number[]>([]);
  const [note, setNote] = useState('');
  const flowRef = useRef({ pos: 0, timer: 0, target: 0 });
  const doneRef = useRef(false);

  useEffect(() => {
    setCells(buildLine(game.seed, leaks).cells);
    setRuns(maxRuns);
    setWet(0);
    setLeakAt(null);
    setFixedLog([]);
    setNote('');
    flowRef.current = { pos: 0, timer: 0, target: 0 };
    doneRef.current = false;
  }, [game.round, game.stageIndex, stage, game.seed, leaks, maxRuns]);

  /** 왼쪽 입구부터 몇 칸까지 물이 이어지는가. 처음 끊긴 칸도 함께 준다. */
  const trace = (list: Cell[]) => {
    for (let i = 0; i < COLS; i += 1) {
      const dirs = openDirs(list[i]);
      const needsWest = i > 0;
      if (needsWest && !dirs.includes(3)) return { reach: i, leak: i };
      if (!dirs.includes(1)) return { reach: i + 1, leak: i };
    }
    return { reach: COLS, leak: -1 };
  };

  const rotate = (index: number) => {
    if (!game.playing || game.status === 'running') return;
    playSound('select');
    setCells((prev) => prev.map((cell, i) => (i === index ? { ...cell, rotation: (cell.rotation + 1) % 4 } : cell)));
    if (leakAt === index) {
      setFixedLog((prev) => (prev.includes(index) ? prev : [...prev, index]));
      setNote(`${index + 1}번 자리를 고쳤어요. 반드시 처음부터 다시 시험해 보세요.`);
    }
  };

  const runTest = () => {
    if (!game.playing) return;
    const { reach, leak } = trace(cells);
    flowRef.current = { pos: 0, timer: 0, target: reach };
    setWet(0);
    setLeakAt(null);
    setNote('');
    game.run('처음부터 다시 흘려 봅니다.');
    if (leak >= 0) window.setTimeout(() => setLeakAt(leak), 40);
  };

  useGameLoop(game.status === 'running', (dt) => {
    const flow = flowRef.current;
    flow.timer += dt;
    if (flow.timer < flowStep) return;
    flow.timer = 0;

    if (flow.pos < flow.target) {
      flow.pos += 1;
      setWet(flow.pos);
      return;
    }

    const left = runs - 1;
    setRuns(left);
    if (flow.target >= COLS) {
      doneRef.current = true;
      game.succeed('새는 곳을 하나씩 찾아 고치고, 처음부터 다시 시험해 끝까지 흘렸어요!');
      return;
    }
    if (left <= 0) {
      doneRef.current = true;
      game.fail('시험할 횟수를 다 썼어요. 붉게 표시된 자리를 눌러 돌린 뒤 다시 시험해 봐요.');
      return;
    }
    game.resume();
    setNote(`${(flow.target) + 1}번 자리에서 샜어요. 그 자리를 눌러 돌리고 다시 시험하세요.`);
  });

  const glyph = (cell: Cell) => {
    const dirs = openDirs(cell);
    const has = (d: number) => dirs.includes(d);
    if (has(1) && has(3)) return '━';
    if (has(0) && has(2)) return '┃';
    if (has(2) && has(1)) return '┏';
    if (has(3) && has(2)) return '┓';
    if (has(0) && has(1)) return '┗';
    if (has(0) && has(3)) return '┛';
    return '·';
  };

  return (
    <MiniGameFrame
      badge="새는 곳 고치기"
      instruction="물을 흘려 새는 곳을 찾고, 그 관을 눌러 돌린 다음 반드시 처음부터 다시 시험하세요."
      progress={{ label: '이어진 칸', value: wet, max: COLS }}
      hud={<GameHud lives={runs} maxLives={maxRuns} score={fixedLog.length} scoreLabel="고친 곳" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="처음으로" />
          <MiniGameButton
            onClick={runTest}
            disabled={game.isLocked || !game.playing}
            emoji="💧"
            label={game.status === 'running' ? '흐르는 중…' : '다시 시험'}
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        <p
          className="rounded-xl px-3 py-1.5 text-[15px] font-black"
          style={{ background: 'var(--board-surface)', border: '2px solid #38BDF8', color: 'var(--board-ink)' }}
        >
          {stage.title} · {stage.steps.join(' → ')}
        </p>

        <div className="flex items-stretch gap-1">
          <span
            className="flex w-12 shrink-0 items-center justify-center rounded-lg text-[20px]"
            style={{ background: 'var(--board-surface)', border: '2px solid #38BDF8', color: 'var(--board-ink)' }}
            aria-hidden="true"
          >
            💧
          </span>
          {cells.map((cell, index) => {
            const isWet = index < wet;
            const isLeak = leakAt === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => rotate(index)}
                disabled={game.isLocked || !game.playing}
                aria-label={`${index + 1}번 관 돌리기`}
                className="flex min-h-20 flex-1 flex-col items-center justify-center rounded-lg text-[28px] font-black transition"
                style={{
                  background: isLeak ? 'rgba(251, 113, 133, 0.2)'
                    : isWet ? 'rgba(56, 189, 248, 0.2)' : 'var(--board-surface)',
                  border: `2px solid ${isLeak ? '#FB7185' : isWet ? '#38BDF8' : 'var(--board-line)'}`,
                  color: 'var(--board-ink)',
                }}
              >
                <span aria-hidden="true">{glyph(cell)}</span>
                <span className="text-[14px]">{index + 1}</span>
              </button>
            );
          })}
          <span
            className="flex w-12 shrink-0 items-center justify-center rounded-lg text-[20px]"
            style={{
              background: wet >= COLS ? 'rgba(74, 222, 128, 0.2)' : 'var(--board-surface)',
              border: `2px solid ${wet >= COLS ? '#4ADE80' : 'var(--board-line)'}`,
              color: 'var(--board-ink)',
            }}
            aria-hidden="true"
          >
            🏁
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {fixedLog.map((index) => (
            <span
              key={index}
              className="rounded-lg px-2 py-0.5 text-[14px] font-black"
              style={{ background: 'rgba(74, 222, 128, 0.16)', border: '2px solid #4ADE80', color: 'var(--board-ink)' }}
            >
              {index + 1}번 고침
            </span>
          ))}
        </div>

        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
          {note || '먼저 다시 시험을 눌러 어디서 새는지 보세요.'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
