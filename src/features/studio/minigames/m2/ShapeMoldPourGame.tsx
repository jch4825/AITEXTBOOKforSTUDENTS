import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m2-l8 「답의 모양을 정해요」 — 틀에 붓기.
 *
 * 틀마다 알맞은 양이 다르다. 누르고 있으면 차오르고 손을 떼면 멈춘다. 알맞은 구간에서
 * 떼야 하고, 넘치면 틀 밖으로 흘러 실패한다. 답이 한 점이 아니라 구간이라 여러 지점에서
 * 성공한다.
 *
 * 차오르는 양은 절대 시각으로 계산한다. 프레임 간 dt를 더하면 리렌더가 무거워질 때
 * 실제보다 느리게 차올라 구간이 어긋난다.
 */

interface Mold {
  id: string;
  emoji: string;
  name: string;
  hint: string;
  band: [number, number];
}

interface Stage {
  id: string;
  tab: string;
  /** 초당 차오르는 양 */
  rate: number;
  molds: Mold[];
}

const STAGES: Stage[] = [
  {
    id: 's1',
    tab: '기본',
    rate: 28,
    molds: [
      { id: 'list', emoji: '📋', name: '목록', hint: '짧게 몇 줄만', band: [30, 58] },
      { id: 'table', emoji: '📊', name: '표', hint: '칸을 채울 만큼', band: [52, 82] },
      { id: 'card', emoji: '🖼️', name: '그림 카드', hint: '가득 채워서', band: [70, 96] },
    ],
  },
  {
    id: 's2',
    tab: '1단계',
    rate: 36,
    molds: [
      { id: 'list', emoji: '📋', name: '목록', hint: '짧게 몇 줄만', band: [28, 52] },
      { id: 'table', emoji: '📊', name: '표', hint: '칸을 채울 만큼', band: [54, 78] },
      { id: 'card', emoji: '🖼️', name: '그림 카드', hint: '가득 채워서', band: [74, 96] },
    ],
  },
  {
    id: 's3',
    tab: '2단계',
    rate: 44,
    molds: [
      { id: 'list', emoji: '📋', name: '목록', hint: '짧게 몇 줄만', band: [26, 46] },
      { id: 'table', emoji: '📊', name: '표', hint: '칸을 채울 만큼', band: [56, 76] },
      { id: 'card', emoji: '🖼️', name: '그림 카드', hint: '가득 채워서', band: [78, 96] },
    ],
  },
];

export default function ShapeMoldPourGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    status,
    message,
    round,
    isLocked,
    goToStage,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length });

  const stage = STAGES[stageIndex];

  const [index, setIndex] = useState(0);
  const [fill, setFill] = useState(0);
  const [pouring, setPouring] = useState(false);
  const [doneCount, setDoneCount] = useState(0);

  const pressAtRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const fillRef = useRef(0);

  useEffect(() => {
    setIndex(0);
    setFill(0);
    setPouring(false);
    setDoneCount(0);
    fillRef.current = 0;
  }, [round, stageIndex]);

  const mold = stage.molds[index];

  useEffect(() => {
    if (!pouring || status !== 'playing') return;
    let stopped = false;

    const frame = (now: number) => {
      if (stopped) return;
      // 누르기 시작한 시각부터의 절대 경과로 계산한다.
      const amount = ((now - pressAtRef.current) / 1000) * stage.rate;
      const next = Math.min(120, amount);
      fillRef.current = next;
      setFill(next);
      if (next >= 120) return; // 넘쳐도 계속 그리지 않는다
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      stopped = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [pouring, status, stage.rate]);

  const startPour = () => {
    if (status !== 'playing' || !mold) return;
    pressAtRef.current = performance.now();
    fillRef.current = 0;
    setFill(0);
    setPouring(true);
  };

  const stopPour = () => {
    if (!pouring || status !== 'playing' || !mold) return;
    setPouring(false);
    const value = fillRef.current;

    if (value > 100) {
      fail(`${mold.name} 틀에서 넘쳤어요. 조금 일찍 손을 떼요.`);
      return;
    }
    if (value < mold.band[0]) {
      fail(`${mold.name} 틀이 덜 찼어요. 조금 더 부어요.`);
      return;
    }
    if (value > mold.band[1]) {
      fail(`${mold.name} 틀에 너무 많이 부었어요.`);
      return;
    }

    const nextIndex = index + 1;
    setDoneCount((n) => n + 1);
    if (nextIndex >= stage.molds.length) {
      succeed(`틀 ${stage.molds.length}개를 알맞게 채웠어요!`);
      return;
    }
    setIndex(nextIndex);
    setFill(0);
    fillRef.current = 0;
  };

  const inBand = mold && fill >= mold.band[0] && fill <= mold.band[1];
  const over = fill > 100;

  return (
    <MiniGameFrame
      badge="틀에 붓기"
      instruction="답의 모양마다 알맞은 양이 달라요. 버튼을 누르고 있으면 차오르고, 손을 떼면 멈춥니다. 알맞은 구간에서 떼세요. 넘치면 흘러요."
      accent="var(--brand-ink)"
      progress={{ label: '채운 틀', value: doneCount, max: stage.molds.length }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, `틀 ${STAGES[i].molds.length}개 채우기`)}
      status={status}
      message={message}
      actions={
        status === 'playing' ? (
          <button
            type="button"
            onPointerDown={startPour}
            onPointerUp={stopPour}
            onPointerCancel={stopPour}
            onPointerLeave={stopPour}
            onKeyDown={(e: any) => {
              if (e.key === ' ' && !e.repeat) {
                e.preventDefault();
                startPour();
              }
            }}
            onKeyUp={(e: any) => {
              if (e.key === ' ') stopPour();
            }}
            aria-label="누르고 있으면 부어집니다"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 text-[15px] font-black"
            style={{
              touchAction: 'none',
              background: pouring ? 'var(--ok-bg)' : 'var(--brand-ink)',
              borderColor: pouring ? 'var(--ok)' : 'var(--brand-ink)',
              color: pouring ? '#14532d' : 'var(--paper-0)',
            }}
          >
            🫗 {pouring ? '붓는 중… 알맞을 때 떼기' : '누르고 있기'}
          </button>
        ) : (
          <button
            type="button"
            onClick={retry}
            disabled={isLocked}
            className="h-11 w-full rounded-xl border-2 text-[14px] font-black"
            style={{ background: 'var(--paper-1)', borderColor: 'var(--line)', color: 'var(--ink-1)' }}
          >
            🔁 한 번 더
          </button>
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        {mold && (
          <>
            <div className="text-center">
              <span className="text-3xl leading-none" aria-hidden="true">
                {mold.emoji}
              </span>
              <p className="mt-1 text-[15px] font-black text-slate-100">{mold.name} 틀</p>
              <p className="text-[14px] font-bold text-slate-400">{mold.hint}</p>
            </div>

            {/* 틀 — 알맞은 구간이 표시된다 */}
            <div className="relative mx-auto h-40 w-24 overflow-hidden rounded-b-xl border-4 border-t-0 border-slate-500/70 bg-slate-950/70">
              <div
                className="pointer-events-none absolute inset-x-0 border-y-2 border-dashed border-emerald-300/70 bg-emerald-400/15"
                style={{
                  bottom: `${mold.band[0]}%`,
                  height: `${mold.band[1] - mold.band[0]}%`,
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 transition-none"
                style={{
                  height: `${Math.min(100, fill)}%`,
                  background: over ? '#fb7185' : inBand ? '#34d399' : '#4FC3E8',
                }}
              />
              {over && (
                <span className="absolute inset-x-0 top-1 text-center text-[14px] font-black text-rose-200">
                  넘쳤어요
                </span>
              )}
            </div>

            <p className="text-center text-[14px] font-black text-slate-300">
              {over ? '🌊 넘침' : inBand ? '✅ 지금 떼면 알맞아요' : '⬜ 알맞은 구간을 찾아요'}
            </p>
          </>
        )}
      </div>
    </MiniGameFrame>
  );
}
