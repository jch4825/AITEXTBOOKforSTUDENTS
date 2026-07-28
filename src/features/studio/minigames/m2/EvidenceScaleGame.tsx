import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m2-l9 「다시 묻기와 확인하기는 달라요」 — 증거 저울.
 *
 * 주장은 무거운 돌이다. 저울을 넘기려면 근거를 쌓아야 한다.
 * 아이미에게 다시 묻기는 깃털이라 아무리 올려도 저울이 꿈쩍하지 않고, 물을수록 더 가벼워진다.
 * 독립된 자료는 묵직한 돌이라 몇 개만 올려도 저울이 넘어간다.
 *
 * 숫자를 읽고 판단하는 게 아니라 저울이 기우는 것을 보고 안다. 성공은 임계값이 아니라
 * "저울이 넘어갔다"는 장면이다.
 */

interface Stage {
  id: string;
  tab: string;
  claim: string;
  /** 주장 돌의 무게 */
  claimWeight: number;
  /** 쓸 수 있는 시간(분) */
  budget: number;
}

const STAGES: Stage[] = [
  { id: 'festival', tab: '기본', claim: '축제가 다음 주 금요일이래!', claimWeight: 5, budget: 9 },
  { id: 'bus', tab: '1단계', claim: '3번 버스가 안 다닌대!', claimWeight: 7, budget: 12 },
  { id: 'menu', tab: '2단계', claim: '내일 급식에 못 먹는 게 나온대!', claimWeight: 9, budget: 15 },
];

const ASK_COST = 1;
const SOURCE_COST = 3;
const SOURCE_WEIGHT = 3;

/** 같은 곳에 다시 물으면 새 근거가 없어 점점 더 가벼워진다. */
function featherWeight(timesAsked: number): number {
  return [0.5, 0.25, 0.1, 0][Math.min(3, timesAsked)];
}

export default function EvidenceScaleGame({ supportLevel }: MiniGameProps) {
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
  const [items, setItems] = useState<('feather' | 'rock')[]>([]);
  const [weight, setWeight] = useState(0);
  const [left, setLeft] = useState(stage.budget);
  const [asked, setAsked] = useState(0);

  useEffect(() => {
    setItems([]);
    setWeight(0);
    setLeft(STAGES[stageIndex].budget);
    setAsked(0);
  }, [round, stageIndex]);

  const tipped = weight >= stage.claimWeight;
  const nextFeather = featherWeight(asked);

  const ask = () => {
    if (status !== 'playing' || left < ASK_COST) return;
    setItems((prev) => [...prev, 'feather']);
    setWeight((w) => w + nextFeather);
    setLeft((t) => t - ASK_COST);
    setAsked((n) => n + 1);
  };

  const checkSource = () => {
    if (status !== 'playing' || left < SOURCE_COST) return;
    setItems((prev) => [...prev, 'rock']);
    setWeight((w) => w + SOURCE_WEIGHT);
    setLeft((t) => t - SOURCE_COST);
  };

  const decide = () => {
    if (status !== 'playing') return;
    if (tipped) {
      succeed('저울이 근거 쪽으로 넘어갔어요. 이제 결론을 낼 수 있어요!');
    } else {
      fail('저울이 아직 안 넘어갔어요. 묵직한 근거가 더 필요해요.');
    }
  };

  useEffect(() => {
    if (status !== 'playing') return;
    if (left < ASK_COST && !tipped) {
      fail('시간을 다 썼는데 저울이 그대로예요. 깃털만 쌓아서는 넘어가지 않아요.');
    }
  }, [left, tipped, status, fail]);

  // 저울 기울기 — 근거가 주장보다 무거워지면 완전히 넘어간다.
  const tilt = Math.max(-14, Math.min(14, (weight - stage.claimWeight) * 3.5));

  return (
    <MiniGameFrame
      badge="증거 저울"
      instruction="주장은 무거운 돌이에요. 저울을 넘기려면 묵직한 근거가 필요합니다. 아이미에게 다시 묻기는 깃털이라 아무리 쌓아도 잘 안 넘어가요."
      accent="var(--brand-ink)"
      progress={{ label: '남은 시간', value: left, max: stage.budget }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, STAGES[i].claim)}
      status={status}
      message={message}
      actions={
        status === 'playing' ? (
          <>
            <button
              type="button"
              onClick={ask}
              disabled={left < ASK_COST}
              className="flex min-h-14 flex-1 flex-col items-center justify-center rounded-xl border-2 text-[14px] font-black leading-tight disabled:opacity-40"
              style={{
                background: 'var(--paper-1)',
                borderColor: 'var(--line)',
                color: 'var(--ink-2)',
              }}
            >
              <span className="text-[17px] leading-none">🪶</span>
              다시 묻기
            </button>
            <button
              type="button"
              onClick={checkSource}
              disabled={left < SOURCE_COST}
              className="flex min-h-14 flex-1 flex-col items-center justify-center rounded-xl border-2 text-[14px] font-black leading-tight disabled:opacity-40"
              style={{
                background: 'var(--paper-1)',
                borderColor: 'var(--line)',
                color: 'var(--ink-2)',
              }}
            >
              <span className="text-[17px] leading-none">🪨</span>
              자료 확인
            </button>
            <MiniGameButton onClick={decide} emoji="✅" label="결론 내기" variant="primary" />
          </>
        ) : (
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔁" label="한 번 더" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        <div className="rounded-lg border-2 border-amber-400/50 bg-amber-400/10 px-2 py-1.5">
          <p className="text-[14px] font-black text-amber-300">확인할 이야기</p>
          <p className="text-[15px] font-bold text-slate-100">“{stage.claim}”</p>
        </div>

        {/* 저울 */}
        <div className="relative flex min-h-[170px] flex-1 flex-col items-center justify-center rounded-xl border-2 border-slate-600/40 bg-slate-950/60 p-2">
          <div
            className="flex w-full items-end justify-between px-1 transition-transform duration-500"
            style={{ transform: `rotate(${tilt}deg)` }}
          >
            {/* 주장 접시 */}
            <div className="flex w-[44%] flex-col items-center">
              <div className="flex min-h-[52px] w-full flex-col items-center justify-end rounded-lg border-2 border-slate-500/60 bg-slate-800/70 p-1">
                {Array.from({ length: stage.claimWeight }).map((_, i) => (
                  <span key={i} className="text-[14px] leading-[0.8]" aria-hidden="true">
                    🪨
                  </span>
                ))}
              </div>
              <span className="mt-1 text-[14px] font-black text-slate-300">주장</span>
            </div>

            {/* 근거 접시 */}
            <div className="flex w-[44%] flex-col items-center">
              <div
                className="flex min-h-[52px] w-full flex-wrap items-end justify-center gap-0.5 rounded-lg border-2 p-1 transition-colors"
                style={{
                  borderColor: tipped ? '#4ade80' : 'rgba(148,163,184,0.6)',
                  background: tipped ? 'rgba(22,163,74,0.25)' : 'rgba(30,41,59,0.7)',
                }}
              >
                {items.map((kind, i) => (
                  <span key={i} className="text-[14px] leading-[0.8]" aria-hidden="true">
                    {kind === 'rock' ? '🪨' : '🪶'}
                  </span>
                ))}
              </div>
              <span className="mt-1 text-[14px] font-black text-slate-300">내 근거</span>
            </div>
          </div>

          {/* 받침대 */}
          <div className="mt-1 h-6 w-1 bg-slate-500" aria-hidden="true" />
          <div className="h-1.5 w-24 rounded-full bg-slate-500" aria-hidden="true" />
        </div>

        <p className="text-center text-[15px] font-black text-slate-200">
          {tipped
            ? '⚖️ 저울이 근거 쪽으로 넘어갔어요'
            : asked >= 3
              ? '🪶 다시 물어도 더는 무거워지지 않아요'
              : '⚖️ 아직 주장 쪽이 무거워요'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
