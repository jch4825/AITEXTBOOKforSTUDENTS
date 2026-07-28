import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m1-l4 「AI의 눈 실험실」 — 순발력(확정 타이밍).
 *
 * 가림막이 하나씩 걷히면서 아이미의 확신도가 오르고, 답이 고양이에서 여우로 바뀐다.
 * 학생은 "지금이면 맞힌다" 싶은 순간에 확정을 누른다. 고를 칸이 없고 답은 "언제"라는
 * 연속값 하나뿐이라, 항목마다 정답이 정해진 분류 문제가 되지 않는다.
 *
 * 중간에 사진이 어두워지면 확신도가 떨어져 답이 다시 고양이로 돌아간다. 차시의
 * "조건에 따라 달라져요"를 그대로 옮긴 것이며, 덕분에 마냥 기다리는 전략이 막힌다.
 */

interface Feature {
  at: number; // 초
  emoji: string;
  label: string;
  weight: number;
}

interface Stage {
  id: string;
  tab: string;
  name: string;
  limit: number;
  features: Feature[];
  /** 사진이 어두워지는 구간 [시작, 끝] */
  darkness: [number, number][];
}

/** 이 값을 넘으면 아이미가 여우라고 답한다. */
const THRESHOLD = 55;
const DARK_PENALTY = 40;

const STAGES: Stage[] = [
  {
    id: 'slow',
    tab: '기본',
    name: '천천히 걷혀요',
    limit: 8,
    features: [
      { at: 1.0, emoji: '👂', label: '귀', weight: 20 },
      { at: 2.2, emoji: '🐾', label: '얼굴', weight: 18 },
      { at: 3.4, emoji: '🦊', label: '꼬리', weight: 27 },
      { at: 4.6, emoji: '👀', label: '눈', weight: 20 },
    ],
    darkness: [[5.4, 7.0]],
  },
  {
    id: 'fast',
    tab: '1단계',
    name: '빨리 걷히고 빨리 어두워져요',
    limit: 6,
    features: [
      { at: 0.8, emoji: '👂', label: '귀', weight: 22 },
      { at: 1.8, emoji: '🐾', label: '얼굴', weight: 18 },
      { at: 2.8, emoji: '🦊', label: '꼬리', weight: 28 },
      { at: 3.8, emoji: '👀', label: '눈', weight: 18 },
    ],
    darkness: [[4.2, 5.2]],
  },
  {
    id: 'flicker',
    tab: '2단계',
    name: '어두워졌다 밝아졌다 해요',
    limit: 6,
    features: [
      { at: 0.7, emoji: '👂', label: '귀', weight: 20 },
      { at: 1.5, emoji: '🐾', label: '얼굴', weight: 16 },
      { at: 2.3, emoji: '🦊', label: '꼬리', weight: 26 },
      { at: 3.1, emoji: '👀', label: '눈', weight: 20 },
    ],
    darkness: [
      [2.6, 3.2],
      [4.0, 5.0],
    ],
  },
];

function isDark(stage: Stage, t: number): boolean {
  return stage.darkness.some(([from, to]) => t >= from && t < to);
}

function confidenceAt(stage: Stage, t: number): number {
  const revealed = stage.features.filter((f) => t >= f.at);
  const base = revealed.reduce((sum, f) => sum + f.weight, 0);
  const value = base - (isDark(stage, t) ? DARK_PENALTY : 0);
  return Math.max(0, Math.min(100, value));
}

export default function RecognitionTimingGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    status,
    message,
    round,
    isLocked,
    goToStage,
    run,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length });

  const stage = STAGES[stageIndex];

  // 답이 바뀔 때만 다시 그린다. 확신도 막대와 가림막은 DOM을 직접 움직인다.
  const [guess, setGuess] = useState<'고양이' | '여우'>('고양이');
  const [dark, setDark] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);

  const startedAt = useRef(0);
  const elapsedRef = useRef(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const clockRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setGuess('고양이');
    setDark(false);
    setRevealCount(0);
    elapsedRef.current = 0;
    if (barRef.current) barRef.current.style.width = '0%';
  }, [round, stageIndex]);

  useEffect(() => {
    if (status !== 'running') return;
    startedAt.current = performance.now();
    let stopped = false;

    const frame = (now: number) => {
      if (stopped) return;
      const t = (now - startedAt.current) / 1000;
      elapsedRef.current = t;

      const conf = confidenceAt(stage, t);
      if (barRef.current) barRef.current.style.width = `${conf}%`;
      if (clockRef.current) {
        clockRef.current.textContent = `${Math.max(0, stage.limit - t).toFixed(1)}초`;
      }

      const nextGuess = conf >= THRESHOLD ? '여우' : '고양이';
      setGuess((prev) => (prev === nextGuess ? prev : nextGuess));
      const nextDark = isDark(stage, t);
      setDark((prev) => (prev === nextDark ? prev : nextDark));
      const nextReveal = stage.features.filter((f) => t >= f.at).length;
      setRevealCount((prev) => (prev === nextReveal ? prev : nextReveal));

      if (t >= stage.limit) {
        fail('시간이 끝났어요. 답이 여우일 때 확정을 눌러요.');
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      stopped = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [status, stage, fail]);

  const handleConfirm = () => {
    if (status === 'playing') {
      run('사진의 가림막이 걷힙니다. 아이미가 맞힐 수 있을 때 확정을 눌러요!');
      return;
    }
    // 끝난 뒤에는 같은 자리에서 바로 한 번 더 — 버튼이 죽은 채로 남지 않게 한다.
    if (status === 'success' || status === 'fail') {
      retry();
      return;
    }
    if (status !== 'running') return;

    const t = elapsedRef.current;
    const conf = confidenceAt(stage, t);
    if (conf >= THRESHOLD) {
      setBestTime((prev) => (prev === null || t < prev ? t : prev));
      succeed(`${t.toFixed(1)}초에 확정! 아이미가 여우를 맞혔어요.`);
    } else if (isDark(stage, t)) {
      fail('사진이 어두워 아이미가 다시 고양이라고 했어요.');
    } else {
      fail('아직 보이는 특징이 적어 고양이라고 했어요.');
    }
  };

  return (
    <MiniGameFrame
      badge="AI의 눈 — 확정 타이밍"
      instruction="가림막이 걷힐수록 아이미의 확신이 올라가요. 아이미가 여우라고 답하는 순간에 확정을 누릅니다. 너무 이르면 틀리고, 사진이 어두워지면 답이 되돌아가요."
      accent="var(--brand-glow)"
      progress={{ label: '보인 특징', value: revealCount, max: stage.features.length }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].name)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={status === 'running'} emoji="🔄" label="다시" />
          <MiniGameButton
            onClick={handleConfirm}
            emoji={status === 'playing' ? '▶️' : status === 'running' ? '✅' : '🔁'}
            label={
              status === 'playing' ? '실험 시작' : status === 'running' ? '지금 확정!' : '한 번 더'
            }
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 아이미의 현재 답 */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-black text-slate-400">아이미의 답</span>
          <span
            className="rounded-full px-3 py-1 text-[15px] font-black transition-colors"
            style={{
              background: guess === '여우' ? 'rgba(22,163,74,0.35)' : 'rgba(100,116,139,0.35)',
              color: guess === '여우' ? '#bbf7d0' : '#cbd5e1',
            }}
          >
            {guess === '여우' ? '🦊 여우!' : '🐱 고양이…'}
          </span>
        </div>

        {/* 가려진 사진 */}
        <div className="relative mx-auto aspect-square w-full max-w-[210px] overflow-hidden rounded-xl border-2 border-slate-600/50 bg-slate-800">
          <div className="absolute inset-0 grid place-items-center text-[86px] leading-none">
            🦊
          </div>

          {/* 아직 안 걷힌 가림막 */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {stage.features.map((f, i) => (
              <div
                key={f.label}
                className="flex flex-col items-center justify-center border border-slate-900/60 transition-opacity duration-500"
                style={{
                  background: '#0f172a',
                  opacity: i < revealCount ? 0 : 1,
                }}
              >
                <span className="text-lg opacity-60" aria-hidden="true">
                  {f.emoji}
                </span>
                <span className="text-[14px] font-bold text-slate-500">{f.label}</span>
              </div>
            ))}
          </div>

          {/* 어두워지는 구간 */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-200"
            style={{ background: '#000', opacity: dark ? 0.78 : 0 }}
          />
          {dark && (
            <span className="absolute inset-x-0 bottom-2 text-center text-[14px] font-black text-amber-300">
              🌑 사진이 어두워요
            </span>
          )}
        </div>

        {/* 확신도 막대 */}
        <div>
          <div className="mb-1 flex items-center justify-between text-[14px] font-black text-slate-400">
            <span>아이미의 확신</span>
            <span ref={clockRef}>{stage.limit.toFixed(1)}초</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              ref={barRef}
              className="h-full rounded-full"
              style={{ width: '0%', background: '#4FC3E8' }}
            />
            {/* 이 선을 넘으면 여우라고 답한다 */}
            <div
              className="absolute inset-y-0 w-0.5 bg-emerald-300"
              style={{ left: `${THRESHOLD}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {bestTime !== null && (
          <p className="text-center text-[14px] font-bold text-emerald-300">
            가장 빨랐던 확정: {bestTime.toFixed(1)}초
          </p>
        )}
      </div>
    </MiniGameFrame>
  );
}
