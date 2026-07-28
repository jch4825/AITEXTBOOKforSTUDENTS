import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m2-l4 「좋은 예시를 보여 줘요」 — 예시 팔레트.
 *
 * 아이미에게 예시를 몇 장 보여 주면 그 예시들을 닮은 결과가 나온다. 결과는 고른 예시들의
 * 평균이라 한 장의 좋고 나쁨이 혼자 정해지지 않는다. 어떤 예시는 다른 예시와 짝을 지어야
 * 견본에 가까워지고, 담을 수 있는 장수도 정해져 있다.
 */

interface Example {
  id: string;
  emoji: string;
  label: string;
  /** 색·모양·크기 세 가지 성질 */
  v: [number, number, number];
}

interface Stage {
  id: string;
  tab: string;
  goal: string;
  target: [number, number, number];
  slots: number;
  need: number;
  examples: Example[];
}

const STAGES: Stage[] = [
  {
    id: 'poster',
    tab: '기본',
    goal: '견본 포스터를 닮은 포스터',
    target: [80, 30, 60],
    slots: 3,
    need: 88,
    examples: [
      { id: 'a', emoji: '🟥', label: '빨간 큰 포스터', v: [95, 15, 45] },
      { id: 'b', emoji: '🟧', label: '주황 네모 포스터', v: [85, 45, 55] },
      { id: 'c', emoji: '🟨', label: '노랑 둥근 포스터', v: [60, 30, 80] },
      { id: 'd', emoji: '🟫', label: '갈색 각진 포스터', v: [75, 25, 70] },
      { id: 'e', emoji: '🟦', label: '파랑 작은 포스터', v: [40, 80, 30] },
      { id: 'f', emoji: '🟪', label: '보라 무늬 포스터', v: [95, 70, 20] },
    ],
  },
  {
    id: 'card',
    tab: '1단계',
    goal: '견본 초대 카드를 닮은 카드',
    target: [45, 65, 50],
    slots: 3,
    need: 88,
    examples: [
      { id: 'a', emoji: '💌', label: '분홍 둥근 카드', v: [35, 55, 40] },
      { id: 'b', emoji: '📗', label: '초록 네모 카드', v: [55, 70, 45] },
      { id: 'c', emoji: '📘', label: '파랑 긴 카드', v: [45, 70, 65] },
      { id: 'd', emoji: '📙', label: '주황 작은 카드', v: [70, 40, 35] },
      { id: 'e', emoji: '🖤', label: '검정 큰 카드', v: [10, 90, 90] },
      { id: 'f', emoji: '🤍', label: '흰 민무늬 카드', v: [90, 20, 20] },
    ],
  },
  {
    id: 'badge',
    tab: '2단계',
    goal: '견본 이름표를 닮은 이름표',
    target: [60, 50, 35],
    slots: 3,
    need: 90,
    examples: [
      { id: 'a', emoji: '🏷️', label: '연노랑 넓은 표', v: [75, 40, 25] },
      { id: 'b', emoji: '🎫', label: '하늘 둥근 표', v: [50, 55, 30] },
      { id: 'c', emoji: '🪪', label: '회색 네모 표', v: [55, 55, 50] },
      { id: 'd', emoji: '📛', label: '빨강 작은 표', v: [85, 30, 20] },
      { id: 'e', emoji: '🟩', label: '초록 큰 표', v: [30, 85, 85] },
      { id: 'f', emoji: '⬛', label: '검정 긴 표', v: [15, 25, 95] },
    ],
  },
];

export default function ExamplePaletteGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    hintAllowed,
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
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    setPicked([]);
  }, [round, stageIndex]);

  const byId = (id: string) => stage.examples.find((e) => e.id === id)!;

  // 결과는 고른 예시들의 평균이다. 아무것도 안 고르면 밋밋한 가운데 값.
  const result: [number, number, number] =
    picked.length === 0
      ? [50, 50, 50]
      : ([0, 1, 2].map(
          (i) => picked.reduce((sum, id) => sum + byId(id).v[i], 0) / picked.length,
        ) as [number, number, number]);

  const gap = [0, 1, 2].reduce((sum, i) => sum + Math.abs(result[i] - stage.target[i]), 0) / 3;
  const match = Math.max(0, Math.round(100 - gap));

  const toggle = (id: string) => {
    if (status !== 'playing') return;
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= stage.slots) return prev;
      return [...prev, id];
    });
  };

  const handleHint = () => {
    // 가능한 조합 중 견본에 가장 가까운 것을 찾아 준다.
    let best: string[] = [];
    let bestGap = Infinity;
    const ids = stage.examples.map((e) => e.id);
    const walk = (start: number, cur: string[]) => {
      if (cur.length === stage.slots) {
        const r = [0, 1, 2].map(
          (i) => cur.reduce((s, id) => s + byId(id).v[i], 0) / cur.length,
        );
        const g = [0, 1, 2].reduce((s, i) => s + Math.abs(r[i] - stage.target[i]), 0) / 3;
        if (g < bestGap) {
          bestGap = g;
          best = [...cur];
        }
        return;
      }
      for (let i = start; i < ids.length; i += 1) walk(i + 1, [...cur, ids[i]]);
    };
    walk(0, []);
    setPicked(best);
  };

  const send = () => {
    if (status !== 'playing') return;
    if (picked.length < stage.slots) {
      fail(`예시를 ${stage.slots}장 다 보여 줘야 해요.`);
      return;
    }
    if (match < stage.need) {
      fail(`아직 견본과 달라 보여요. 다른 예시로 바꿔 보세요.`);
      return;
    }
    succeed(`견본과 같아 보이는 결과가 나왔어요!`);
  };

  /**
   * 세 성질을 그대로 그림으로 그린다. 색은 색조, 모양은 모서리 둥글기, 크기는 지름이다.
   * 숫자를 읽는 대신 두 그림을 눈으로 견주게 하려는 것.
   */
  const shape = (v: [number, number, number], key: string) => (
    <div
      key={key}
      className="transition-all duration-300"
      style={{
        width: `${40 + (v[2] / 100) * 46}px`,
        height: `${40 + (v[2] / 100) * 46}px`,
        borderRadius: `${(1 - v[1] / 100) * 46}%`,
        background: `hsl(${Math.round(210 - (v[0] / 100) * 190)} 78% 58%)`,
        border: '3px solid rgba(255,255,255,0.55)',
      }}
      aria-hidden="true"
    />
  );

  return (
    <MiniGameFrame
      badge="예시 보여 주기"
      instruction={`예시를 ${stage.slots}장까지 보여 줄 수 있어요. 결과는 보여 준 예시들을 섞은 모습이 됩니다. 견본과 같아 보이게 골라 보세요.`}
      accent="var(--brand-ink)"
      progress={{ label: '고른 예시', value: picked.length, max: stage.slots }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, STAGES[i].goal)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="다시" />
          {hintAllowed && (
            <MiniGameButton onClick={handleHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={send}
            disabled={status !== 'playing'}
            emoji="✨"
            label="이 예시로!"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="rounded-lg border-2 border-amber-400/50 bg-amber-400/10 px-2 py-1.5">
          <p className="text-[14px] font-black text-amber-300">만들고 싶은 것</p>
          <p className="text-[14px] font-bold text-slate-100">{stage.goal}</p>
        </div>

        {/* 견본과 내 결과를 나란히 놓고 눈으로 견준다 */}
        <div
          className="flex items-center justify-around rounded-xl border-2 bg-slate-900/60 p-3 transition-colors"
          style={{ borderColor: match >= stage.need ? '#4ade80' : 'rgba(148,163,184,0.5)' }}
        >
          <div className="flex flex-col items-center gap-1">
            {shape(stage.target, 'goal')}
            <span className="text-[14px] font-black text-amber-300">견본</span>
          </div>
          <span className="text-[20px] leading-none" aria-hidden="true">
            {match >= stage.need ? '=' : '≠'}
          </span>
          <div className="flex flex-col items-center gap-1">
            {shape(result, 'mine')}
            <span className="text-[14px] font-black text-slate-300">내 결과</span>
          </div>
        </div>

        <p className="text-center text-[15px] font-black text-slate-200">
          {picked.length < stage.slots
            ? `예시를 ${stage.slots - picked.length}장 더 보여 주세요`
            : match >= stage.need
              ? '✨ 견본과 같아 보여요'
              : '아직 달라요. 다른 예시로 바꿔 보세요'}
        </p>

        {/* 예시 고르기 */}
        <div className="flex-1">
          <p className="mb-1 text-[14px] font-black text-slate-400">
            보여 줄 예시 ({picked.length}/{stage.slots})
          </p>
          <div className="grid grid-cols-2 gap-1">
            {stage.examples.map((e) => {
              const on = picked.includes(e.id);
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => toggle(e.id)}
                  disabled={status !== 'playing' || (!on && picked.length >= stage.slots)}
                  className="flex min-h-11 items-center gap-1 rounded-lg border-2 px-1.5 py-1 text-left disabled:opacity-40"
                  style={{
                    borderColor: on ? '#4ade80' : 'rgba(148,163,184,0.45)',
                    background: on ? 'rgba(22,163,74,0.22)' : 'rgba(30,41,59,0.9)',
                  }}
                >
                  <span className="text-base leading-none">{e.emoji}</span>
                  <span className="text-[14px] font-bold text-slate-100">{e.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
