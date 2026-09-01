import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, randInt } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m5-l6 · 단서 합치기 (장르 41 · 합성 머지)
 *
 * "아이미가 다르게 알아들었을 때 필요한 단서만 더한다"를 합치기로 만든다.
 * 같은 단계의 단서 두 개를 겹치면 한 단계 위의 더 정확한 요청이 된다.
 *
 * 판에는 개인정보 조각이 섞여 들어온다. 합치면 그 자리가 잠기므로 휴지통으로
 * 버려야 한다 — 더할 단서와 빼야 할 정보를 가르는 것이 이 게임의 판단이다.
 */

const COLS = 4;
const ROWS = 4;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  /** 단계별 단서 이름. 0단계부터 목표 단계까지 */
  levels: string[];
  goalLevel: number;
  privacy: string[];
  moves: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'poster',
    label: '기본',
    spoken: '포스터 요청을 더 정확하게 키워요.',
    levels: ['무엇을', '무엇을 언제', '무엇을 언제 누구에게'],
    goalLevel: 2,
    privacy: ['내 이름', '우리 집 주소'],
    moves: 22,
  },
  {
    id: 'notice',
    label: '1단계',
    spoken: '안내문 요청을 더 정확하게 키워요.',
    levels: ['무엇을', '무엇을 언제', '무엇을 언제 누구에게', '무엇을 언제 누구에게 어떤 모양으로'],
    goalLevel: 3,
    privacy: ['내 이름', '전화번호', '학교 이름'],
    moves: 26,
  },
  {
    id: 'plan',
    label: '2단계',
    spoken: '계획 요청을 더 정확하게 키워요.',
    levels: ['무엇을', '무엇을 언제', '무엇을 언제 누구에게', '무엇을 언제 누구에게 어떤 모양으로', '조건까지 갖춘 요청'],
    goalLevel: 4,
    privacy: ['내 이름', '전화번호', '집 주소', '반과 번호'],
    moves: 30,
  },
];

/** 타일 값 — 0 이상은 단서 단계, -1은 빈 칸, -2는 개인정보, -3은 잠긴 칸 */
type Cell = number;
const EMPTY = -1;
const PRIVACY = -2;
const LOCKED = -3;

function buildBoard(seed: number): Cell[][] {
  const random = createRandom(seed);
  const board: Cell[][] = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => EMPTY));
  for (let i = 0; i < 6; i += 1) {
    const r = randInt(random, 0, ROWS);
    const c = randInt(random, 0, COLS);
    board[r][c] = 0;
  }
  return board;
}

export default function ClueMergeGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 이동 횟수와 개인정보가 섞이는 비율로 나타난다. 목표 단계는 같다. */
  const moves = Math.round(stage.moves * clamp(tuning.tolerance, 0.8, 1.5));
  const privacyRate = clamp(0.24 * tuning.density, 0.1, 0.42);

  const [board, setBoard] = useState<Cell[][]>(() => buildBoard(game.seed));
  const [picked, setPicked] = useState<[number, number] | null>(null);
  const [left, setLeft] = useState(moves);
  const [best, setBest] = useState(0);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setBoard(buildBoard(game.seed));
    setPicked(null);
    setLeft(moves);
    setBest(0);
    setNote('');
    setDone(false);
    setStep(0);
  }, [game.round, game.stageIndex, stage, game.seed, moves]);

  const spawn = (next: Cell[][], seedOffset: number) => {
    const random = createRandom(game.seed + seedOffset * 977);
    const free: [number, number][] = [];
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) if (next[r][c] === EMPTY) free.push([r, c]);
    }
    if (free.length === 0) return false;
    const [r, c] = free[randInt(random, 0, free.length)];
    next[r][c] = random() < privacyRate ? PRIVACY : 0;
    return true;
  };

  const afterMove = (next: Cell[][], topLevel: number) => {
    const remaining = left - 1;
    setLeft(remaining);
    setStep((n) => n + 1);
    const grown = Math.max(best, topLevel);
    setBest(grown);

    if (grown >= stage.goalLevel) {
      setBoard(next);
      setDone(true);
      game.succeed(`필요한 단서만 더해 '${stage.levels[stage.goalLevel]}'까지 키웠어요!`);
      return;
    }

    const placed = spawn(next, step + 1);
    setBoard(next);

    if (remaining <= 0) {
      setDone(true);
      game.fail('옮길 횟수를 다 썼어요. 같은 단계 두 개를 겹쳐 단서를 키워 봐요.');
      return;
    }
    if (!placed && next.flat().every((cell) => cell !== EMPTY)) {
      setDone(true);
      game.fail('판이 가득 찼어요. 개인정보 조각은 휴지통으로 버려야 합니다.');
    }
  };

  const tap = (r: number, c: number) => {
    if (!game.playing || done) return;
    const value = board[r][c];
    if (value === EMPTY || value === LOCKED) { setPicked(null); return; }

    if (!picked) {
      playSound('select');
      setPicked([r, c]);
      setNote(value === PRIVACY ? '개인정보 조각이에요. 아래 휴지통으로 버리세요.' : '같은 단계 조각을 하나 더 누르세요.');
      return;
    }

    const [pr, pc] = picked;
    if (pr === r && pc === c) { setPicked(null); return; }
    const from = board[pr][pc];
    const next = board.map((row) => row.slice());

    if (from === PRIVACY || value === PRIVACY) {
      // 개인정보를 단서와 합치면 그 자리가 잠긴다
      next[r][c] = LOCKED;
      next[pr][pc] = EMPTY;
      setPicked(null);
      setNote('개인정보를 섞으면 그 자리를 쓸 수 없게 됩니다. 휴지통으로 버려야 해요.');
      afterMove(next, best);
      return;
    }

    if (from !== value) {
      setPicked([r, c]);
      setNote('단계가 다르면 합쳐지지 않아요. 같은 단계끼리 겹치세요.');
      return;
    }

    playSound('confirm');
    next[r][c] = value + 1;
    next[pr][pc] = EMPTY;
    setPicked(null);
    setNote(`'${stage.levels[Math.min(value + 1, stage.levels.length - 1)]}'로 커졌어요.`);
    const topLevel = Math.max(...next.flat().filter((cell) => cell >= 0), 0);
    afterMove(next, topLevel);
  };

  const trash = () => {
    if (!game.playing || done || !picked) return;
    const [r, c] = picked;
    const next = board.map((row) => row.slice());
    next[r][c] = EMPTY;
    setPicked(null);
    playSound('stamp');
    setNote('개인정보 조각을 버렸어요.');
    afterMove(next, best);
  };

  const label = (value: Cell) => {
    if (value === PRIVACY) return '개인정보';
    if (value === LOCKED) return '잠김';
    if (value === EMPTY) return '';
    return stage.levels[Math.min(value, stage.levels.length - 1)];
  };

  return (
    <MiniGameFrame
      badge="단서 합치기"
      instruction="같은 단계의 단서 두 개를 눌러 겹치면 더 정확한 요청이 됩니다. 개인정보 조각은 휴지통으로 버리세요."
      progress={{ label: '키운 단계', value: best, max: stage.goalLevel }}
      hud={<GameHud score={left} scoreLabel="남은 옮기기" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={trash} disabled={!picked} emoji="🗑️" label="휴지통에 버리기" />
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <p
          className="rounded-xl px-3 py-1.5 text-[15px] font-black"
          style={{ background: 'var(--board-surface)', border: '2px solid #4ADE80', color: 'var(--board-ink)' }}
        >
          목표 · {stage.levels[stage.goalLevel]}
        </p>
        <div
          className="grid min-h-0 flex-1 gap-1.5 rounded-xl p-1.5"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
            background: 'var(--board-overlay)',
            border: '2px solid var(--board-line)',
          }}
        >
          {board.map((row, r) => row.map((value, c) => {
            const on = picked?.[0] === r && picked?.[1] === c;
            const isPrivacy = value === PRIVACY;
            const isLocked = value === LOCKED;
            const empty = value === EMPTY;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => tap(r, c)}
                disabled={!game.playing || done || empty}
                aria-label={empty ? `${r + 1}행 ${c + 1}열 빈 칸` : `${label(value)} 조각`}
                className="min-h-0 rounded-lg px-1 text-[14px] font-black leading-tight transition"
                style={{
                  background: empty ? 'transparent'
                    : on ? '#38BDF8'
                      : isPrivacy ? '#7F1D1D'
                        : isLocked ? '#1F2937' : 'var(--board-surface)',
                  border: `2px solid ${
                    empty ? 'rgba(100, 116, 139, 0.3)'
                      : isPrivacy ? '#FB7185'
                        : isLocked ? '#4B5563' : '#38BDF8'
                  }`,
                  color: on ? '#0F172A' : 'var(--board-ink)',
                  opacity: isLocked ? 0.6 : 1,
                }}
              >
                {label(value)}
              </button>
            );
          }))}
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
