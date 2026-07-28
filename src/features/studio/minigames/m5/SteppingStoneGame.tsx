import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m5-l7 「한 단계 실행하고 확인하기」 — 징검다리 두드리기.
 *
 * 이끼 낀 돌은 흔들린다. 두드려 확인하고 밟으면 안전하지만, 그냥 밟으면 빠진다.
 * 강물이 차오르기 때문에 모든 돌을 두드릴 시간은 없다. 멀쩡한 돌까지 두드리면 늦는다.
 *
 * 어느 돌이 위험한지는 이끼로 대놓고 보인다(판단은 공짜). 난이도는 차오르는 물과의
 * 시간 싸움이고, 성패는 숫자가 아니라 건넜는지 빠졌는지로 보인다.
 */

interface Stone {
  mossy: boolean;
}

interface Stage {
  id: string;
  tab: string;
  name: string;
  limit: number;
  stones: Stone[];
}

const S = (pattern: string): Stone[] =>
  pattern.split('').map((c) => ({ mossy: c === 'M' }));

const STAGES: Stage[] = [
  { id: 's1', tab: '기본', name: '돌 6개', limit: 13, stones: S('.M..M.') },
  { id: 's2', tab: '1단계', name: '돌 8개', limit: 16, stones: S('.M.MM..M') },
  { id: 's3', tab: '2단계', name: '돌 10개', limit: 19, stones: S('M.MM..M.M.') },
];

const TAP_TIME = 0.9;
const STEP_TIME = 0.6;

export default function SteppingStoneGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    status,
    message,
    round,
    goToStage,
    run,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length });

  const stage = STAGES[stageIndex];

  const [at, setAt] = useState(-1); // 서 있는 돌. -1은 출발 둑
  const [checked, setChecked] = useState<number[]>([]);
  const [left, setLeft] = useState(stage.limit);
  const [busy, setBusy] = useState<'tap' | 'step' | null>(null);

  const startedAtRef = useRef(0);
  const spentRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setAt(-1);
    setChecked([]);
    setLeft(stage.limit);
    setBusy(null);
    startedAtRef.current = 0;
    spentRef.current = 0;
  }, [round, stageIndex, stage.limit]);

  // 강물은 절대 시각으로 차오른다.
  useEffect(() => {
    if (status !== 'running') return;
    if (startedAtRef.current === 0) startedAtRef.current = performance.now();
    let stopped = false;

    const frame = (now: number) => {
      if (stopped) return;
      const elapsed = (now - startedAtRef.current) / 1000;
      const remaining = Math.max(0, stage.limit - elapsed);
      setLeft(remaining);
      if (remaining <= 0) {
        fail('강물이 다 차올랐어요. 멀쩡한 돌은 두드리지 않아도 돼요.');
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      stopped = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [status, stage.limit, fail]);

  const next = at + 1;
  const nextStone = stage.stones[next];

  const begin = () => {
    if (status !== 'playing') return;
    run('돌다리를 건너요. 이끼 낀 돌은 두드려 보고 밟아요!');
  };

  /** 한 동작에 시간이 걸린다. 그동안은 다른 조작을 막는다. */
  const doAction = (kind: 'tap' | 'step', seconds: number, done: () => void) => {
    if (status !== 'running' || busy) return;
    setBusy(kind);
    spentRef.current += seconds;
    setTimeout(() => {
      setBusy(null);
      done();
    }, seconds * 1000);
  };

  const tap = () => {
    if (!nextStone) return;
    doAction('tap', TAP_TIME, () => setChecked((prev) => [...prev, next]));
  };

  const step = () => {
    if (!nextStone) return;
    doAction('step', STEP_TIME, () => {
      if (nextStone.mossy && !checked.includes(next)) {
        fail('두드려 보지 않고 밟아서 빠졌어요. 이끼 낀 돌은 꼭 확인해요.');
        return;
      }
      const landed = next;
      setAt(landed);
      if (landed >= stage.stones.length - 1) {
        succeed('돌다리를 안전하게 다 건넜어요!');
      }
    });
  };

  const waterPct = Math.min(100, ((stage.limit - left) / stage.limit) * 100);

  return (
    <MiniGameFrame
      badge="징검다리 건너기"
      instruction="이끼 낀 돌은 흔들려요. 두드려 확인한 뒤 밟으세요. 그냥 밟으면 빠집니다. 강물이 차오르니 멀쩡한 돌은 그냥 밟아도 돼요."
      accent="var(--brand-ink)"
      progress={{ label: '건넌 돌', value: at + 1, max: stage.stones.length }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, STAGES[i].name)}
      status={status}
      message={message}
      actions={
        status === 'playing' ? (
          <button
            type="button"
            onClick={begin}
            className="min-h-14 w-full rounded-xl border-2 text-[15px] font-black"
            style={{
              background: 'var(--brand-ink)',
              borderColor: 'var(--brand-ink)',
              color: 'var(--paper-0)',
            }}
          >
            ▶️ 건너기 시작
          </button>
        ) : status === 'running' ? (
          <>
            <button
              type="button"
              onClick={tap}
              disabled={!!busy || !nextStone}
              className="flex min-h-14 flex-1 items-center justify-center gap-1 rounded-xl border-2 text-[15px] font-black disabled:opacity-45"
              style={{
                background: 'var(--paper-1)',
                borderColor: 'var(--line)',
                color: 'var(--ink-1)',
              }}
            >
              🪨 두드려 보기
            </button>
            <button
              type="button"
              onClick={step}
              disabled={!!busy || !nextStone}
              className="flex min-h-14 flex-1 items-center justify-center gap-1 rounded-xl border-2 text-[15px] font-black disabled:opacity-45"
              style={{
                background: 'var(--brand-ink)',
                borderColor: 'var(--brand-ink)',
                color: 'var(--paper-0)',
              }}
            >
              👣 밟고 건너기
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={retry}
            className="min-h-12 w-full rounded-xl border-2 text-[15px] font-black"
            style={{
              background: 'var(--paper-1)',
              borderColor: 'var(--line)',
              color: 'var(--ink-1)',
            }}
          >
            🔁 한 번 더
          </button>
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        {/* 강 */}
        <div className="relative min-h-[150px] flex-1 overflow-hidden rounded-xl border-2 border-slate-600/40 bg-slate-950/60">
          {/* 차오르는 물 */}
          <div
            className="absolute inset-x-0 bottom-0 transition-[height] duration-200"
            style={{ height: `${waterPct}%`, background: 'rgba(56,189,248,0.35)' }}
            aria-hidden="true"
          />

          {/* 돌과 사람 */}
          <div className="relative flex h-full items-center gap-1 overflow-x-auto px-2">
            <span className="text-[22px] leading-none" aria-hidden="true">
              🏞️
            </span>
            {stage.stones.map((stone, i) => {
              const done = i <= at;
              const isNext = i === next;
              const wasChecked = checked.includes(i);
              return (
                <div key={i} className="flex shrink-0 flex-col items-center gap-0.5">
                  <span className="h-6 text-[20px] leading-none" aria-hidden="true">
                    {at === i ? '🧍' : ''}
                  </span>
                  <span
                    className="grid h-11 w-11 place-items-center rounded-lg border-2 text-[18px]"
                    style={{
                      background: done
                        ? 'rgba(22,163,74,0.3)'
                        : stone.mossy
                          ? 'rgba(132,204,22,0.25)'
                          : 'rgba(100,116,139,0.3)',
                      borderColor: isNext
                        ? '#fbbf24'
                        : wasChecked
                          ? '#4ade80'
                          : 'rgba(148,163,184,0.5)',
                    }}
                    aria-label={`${i + 1}번 돌${stone.mossy ? ', 이끼 있음' : ''}`}
                  >
                    {stone.mossy ? '🟢' : '⬜'}
                  </span>
                  {wasChecked && (
                    <span className="text-[14px] font-black text-emerald-300">확인</span>
                  )}
                </div>
              );
            })}
            <span className="text-[22px] leading-none" aria-hidden="true">
              🎯
            </span>
          </div>
        </div>

        <p className="text-center text-[15px] font-black text-slate-200">
          {busy === 'tap'
            ? '🪨 두드려 보는 중…'
            : busy === 'step'
              ? '👣 발을 옮기는 중…'
              : !nextStone
                ? '다 건넜어요'
                : nextStone.mossy
                  ? checked.includes(next)
                    ? '확인했어요. 이제 밟아도 돼요'
                    : '⚠️ 다음 돌에 이끼가 있어요'
                  : '다음 돌은 멀쩡해 보여요'}
        </p>

        <p className="text-center text-[14px] font-bold text-slate-400">
          강물이 차오르기까지 {left.toFixed(1)}초
        </p>
      </div>
    </MiniGameFrame>
  );
}
