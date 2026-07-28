import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m5-l10 「오류를 찾아 다시 시험하기」 — 누수 배관.
 *
 * 물을 틀어 봐야 어디서 새는지 드러난다. 새는 곳을 조이고 같은 조건에서 다시 틀어
 * 확인하는 일을 반복한다. 조임 횟수가 정해져 있어 짐작으로 아무 데나 조이면 모자란다.
 *
 * 어디를 조일지는 혼자 정해지지 않는다. 직전 시험에서 물이 멈춘 자리가 알려 준다.
 * 차시의 "재현하고 고친 뒤 같은 조건에서 다시 시험한다"를 그대로 손으로 돌린다.
 */

interface Stage {
  id: string;
  tab: string;
  name: string;
  pipes: number;
  /** 새는 칸의 위치(0부터) */
  leaks: number[];
  /** 조일 수 있는 횟수 */
  wrenches: number;
}

const STAGES: Stage[] = [
  { id: 's1', tab: '기본', name: '물길 6칸', pipes: 6, leaks: [2, 4], wrenches: 3 },
  { id: 's2', tab: '1단계', name: '물길 7칸', pipes: 7, leaks: [1, 3, 5], wrenches: 4 },
  { id: 's3', tab: '2단계', name: '물길 8칸', pipes: 8, leaks: [0, 3, 5, 6], wrenches: 5 },
];

export default function LeakRetestGame({ supportLevel }: MiniGameProps) {
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

  const [fixed, setFixed] = useState<number[]>([]);
  const [used, setUsed] = useState(0);
  const [water, setWater] = useState(-1);
  const [stoppedAt, setStoppedAt] = useState<number | null>(null);
  const [tests, setTests] = useState(0);

  useEffect(() => {
    setFixed([]);
    setUsed(0);
    setWater(-1);
    setStoppedAt(null);
    setTests(0);
  }, [round, stageIndex]);

  const leaking = (i: number) => stage.leaks.includes(i) && !fixed.includes(i);
  const firstLeak = stage.leaks.filter((i) => !fixed.includes(i)).sort((a, b) => a - b)[0];
  const wrenchesLeft = stage.wrenches - used;

  const openWater = () => {
    if (status !== 'playing') return;
    setWater(0);
    setStoppedAt(null);
    setTests((n) => n + 1);
    run('물을 틀어 같은 조건에서 다시 시험합니다!');
  };

  // 물이 한 칸씩 나아가다 새는 칸에서 멈춘다.
  useEffect(() => {
    if (status !== 'running') return;
    const stopAt = firstLeak === undefined ? stage.pipes : firstLeak;

    if (water < stopAt) {
      const timer = setTimeout(() => setWater((w) => w + 1), 260);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      if (firstLeak === undefined) {
        succeed(`${tests}번 시험해서 물길을 끝까지 이었어요!`);
      } else {
        setStoppedAt(firstLeak);
        fail(`${firstLeak + 1}번 칸에서 새요. 그 칸을 조이고 다시 시험해요.`);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [status, water, firstLeak, stage.pipes, tests, succeed, fail]);

  const tighten = (i: number) => {
    if (status !== 'playing' || wrenchesLeft <= 0) return;
    if (fixed.includes(i)) return;
    setUsed((n) => n + 1);
    setFixed((prev) => [...prev, i]);
  };

  // 조임을 다 쓰고도 새는 곳이 남으면 그대로 끝난다.
  useEffect(() => {
    if (status !== 'playing') return;
    if (wrenchesLeft <= 0 && firstLeak !== undefined) {
      fail('조임을 다 썼는데 아직 새는 곳이 있어요. 물을 틀어 확인하고 조여야 해요.');
    }
  }, [wrenchesLeft, firstLeak, status, fail]);

  return (
    <MiniGameFrame
      badge="새는 곳 찾아 고치기"
      instruction="물을 틀면 새는 칸에서 멈춰요. 멈춘 칸을 눌러 조이고 다시 틀어 확인합니다. 조임은 몇 번뿐이라 짐작으로 조이면 모자라요."
      accent="var(--brand-ink)"
      progress={{ label: '남은 조임', value: wrenchesLeft, max: stage.wrenches }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, STAGES[i].name)}
      status={status}
      message={message}
      actions={
        status === 'success' ? (
          <MiniGameButton onClick={retry} emoji="🔁" label="한 번 더" />
        ) : (
          <>
            <MiniGameButton onClick={retry} disabled={status === 'running'} emoji="🔄" label="처음으로" />
            <MiniGameButton
              onClick={openWater}
              disabled={status !== 'playing'}
              emoji="🚿"
              label={status === 'running' ? '물 흐르는 중…' : '물 틀어 시험'}
              variant="primary"
            />
          </>
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        <p className="text-[14px] font-black text-slate-400">
          {stage.name} · 시험한 횟수 {tests}번
        </p>

        {/* 배관 */}
        <div className="flex items-center gap-1">
          <span className="text-[20px] leading-none" aria-hidden="true">
            🚰
          </span>
          <div className="flex flex-1 items-stretch gap-1">
            {Array.from({ length: stage.pipes }).map((_, i) => {
              const wet = water >= i;
              const isFixed = fixed.includes(i);
              const showLeak = stoppedAt === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => tighten(i)}
                  disabled={status !== 'playing' || isFixed || wrenchesLeft <= 0}
                  aria-label={`${i + 1}번 칸 조이기${isFixed ? ', 이미 조임' : ''}`}
                  className="relative flex min-h-11 flex-1 flex-col items-center justify-center rounded-md border-2 transition-colors disabled:opacity-70"
                  style={{
                    background: showLeak
                      ? 'rgba(234,88,12,0.35)'
                      : wet
                        ? 'rgba(79,195,232,0.35)'
                        : 'rgba(30,41,59,0.9)',
                    borderColor: showLeak
                      ? '#fb923c'
                      : isFixed
                        ? '#4ade80'
                        : 'rgba(148,163,184,0.5)',
                  }}
                >
                  <span className="text-[15px] leading-none" aria-hidden="true">
                    {showLeak ? '💦' : isFixed ? '🔧' : wet ? '💧' : '␣'}
                  </span>
                  <span className="text-[14px] font-black text-slate-300">{i + 1}</span>
                </button>
              );
            })}
          </div>
          <span className="text-[20px] leading-none" aria-hidden="true">
            🪣
          </span>
        </div>

        <p className="text-center text-[15px] font-black text-slate-200">
          {stoppedAt !== null
            ? `💦 ${stoppedAt + 1}번 칸에서 물이 샜어요`
            : tests === 0
              ? '먼저 물을 틀어 어디서 새는지 봐요'
              : firstLeak === undefined
                ? '✨ 새는 곳이 없어요'
                : '조인 뒤 다시 틀어 확인해요'}
        </p>

        <div className="flex flex-wrap justify-center gap-1">
          {Array.from({ length: stage.wrenches }).map((_, i) => (
            <span
              key={i}
              className="rounded-md border-2 px-2 py-1 text-[14px] font-black"
              style={{
                borderColor: i < wrenchesLeft ? '#4ade80' : 'rgba(148,163,184,0.4)',
                color: i < wrenchesLeft ? '#bbf7d0' : '#64748b',
              }}
            >
              🔧
            </span>
          ))}
        </div>
      </div>
    </MiniGameFrame>
  );
}
