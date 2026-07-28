import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m5-l8 「목표와 결과를 비교하기」 — 실루엣 겹치기.
 *
 * 처음 정한 조건(점선 실루엣) 위에 완성 결과를 올려 놓고 위치·기울기·크기를 맞춘다.
 * 세 가지를 모두 맞춰야 겹치고, 하나만 맞춰서는 일치율이 오르지 않는다.
 * 눈으로 겹쳐 보는 것 자체가 "나란히 놓고 확인하기"다.
 */

interface Stage {
  id: string;
  tab: string;
  name: string;
  emoji: string;
  /** 목표 — x, y(%), 기울기(도), 크기(%) */
  goal: { x: number; y: number; rot: number; scale: number };
  start: { x: number; y: number; rot: number; scale: number };
  need: number;
}

const STAGES: Stage[] = [
  {
    id: 'poster',
    tab: '기본',
    name: '완성한 포스터를 조건과 맞추기',
    emoji: '🖼️',
    goal: { x: 50, y: 48, rot: 0, scale: 100 },
    start: { x: 26, y: 68, rot: -18, scale: 68 },
    need: 88,
  },
  {
    id: 'badge',
    tab: '1단계',
    name: '만든 이름표를 조건과 맞추기',
    emoji: '🏷️',
    goal: { x: 56, y: 42, rot: 12, scale: 92 },
    start: { x: 28, y: 70, rot: -20, scale: 130 },
    need: 90,
  },
  {
    id: 'card',
    tab: '2단계',
    name: '만든 초대 카드를 조건과 맞추기',
    emoji: '💌',
    goal: { x: 44, y: 54, rot: -14, scale: 108 },
    start: { x: 72, y: 26, rot: 22, scale: 66 },
    need: 92,
  },
];

export default function SilhouetteMatchGame({ supportLevel }: MiniGameProps) {
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
  const [pos, setPos] = useState(stage.start);
  const [dragging, setDragging] = useState(false);
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPos({ ...STAGES[stageIndex].start });
    setDragging(false);
  }, [round, stageIndex]);

  const posGap = Math.hypot(pos.x - stage.goal.x, pos.y - stage.goal.y);
  const rotGap = Math.abs(pos.rot - stage.goal.rot);
  const scaleGap = Math.abs(pos.scale - stage.goal.scale);
  const match = Math.max(
    0,
    Math.round(100 - posGap * 1.6 - rotGap * 0.9 - scaleGap * 0.5),
  );

  const moveTo = (clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPos((p) => ({
      ...p,
      x: Math.max(6, Math.min(94, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(10, Math.min(90, ((clientY - rect.top) / rect.height) * 100)),
    }));
  };

  const nudge = (key: 'rot' | 'scale', delta: number) => {
    if (status !== 'playing') return;
    setPos((p) => ({ ...p, [key]: p[key] + delta }));
  };

  const handleHint = () => setPos({ ...stage.goal });

  const check = () => {
    if (status !== 'playing') return;
    if (match < stage.need) {
      const parts: string[] = [];
      if (posGap > 6) parts.push('자리');
      if (rotGap > 6) parts.push('기울기');
      if (scaleGap > 8) parts.push('크기');
      fail(parts.length > 0 ? `${parts.join('·')}가 아직 달라요.` : '조금 더 맞춰 보세요.');
      return;
    }
    setPos({ ...stage.goal });
    succeed('찰칵! 처음 정한 조건과 완성 결과가 빈틈없이 겹쳤어요.');
  };

  return (
    <MiniGameFrame
      badge="목표와 겹쳐 보기"
      instruction="점선이 처음 정한 조건이에요. 결과물을 끌어 옮기고 기울기와 크기를 맞춰 점선 위에 겹치세요. 세 가지를 모두 맞춰야 합니다."
      accent="var(--brand-ink)"
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, STAGES[i].name)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="다시" />
          {hintAllowed && (
            <MiniGameButton onClick={handleHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={check}
            disabled={status !== 'playing'}
            emoji="✅"
            label="맞는지 확인"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <p className="text-[14px] font-black text-slate-400">{stage.name}</p>

        <div
          ref={boardRef}
          onPointerDown={(e: any) => {
            if (status !== 'playing') return;
            setDragging(true);
            moveTo(e.clientX, e.clientY);
          }}
          onPointerMove={(e: any) => {
            if (dragging && status === 'playing') moveTo(e.clientX, e.clientY);
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
          style={{ touchAction: 'none' }}
          className="relative min-h-[190px] flex-1 overflow-hidden rounded-xl border-2 border-slate-600/40 bg-slate-950/60"
        >
          {/* 목표 실루엣 */}
          <div
            className="pointer-events-none absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border-2 border-dashed border-amber-300/80"
            style={{
              left: `${stage.goal.x}%`,
              top: `${stage.goal.y}%`,
              width: `${stage.goal.scale * 0.6}px`,
              height: `${stage.goal.scale * 0.6}px`,
              transform: `translate(-50%, -50%) rotate(${stage.goal.rot}deg)`,
            }}
          >
            <span className="text-[14px] font-black text-amber-300">조건</span>
          </div>

          {/* 내 결과물 */}
          <div
            className="pointer-events-none absolute grid place-items-center rounded-lg border-2 transition-colors"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: `${pos.scale * 0.6}px`,
              height: `${pos.scale * 0.6}px`,
              transform: `translate(-50%, -50%) rotate(${pos.rot}deg)`,
              borderColor: match >= stage.need ? '#4ade80' : '#4FC3E8',
              background:
                match >= stage.need ? 'rgba(22,163,74,0.28)' : 'rgba(79,195,232,0.22)',
            }}
          >
            <span className="text-xl leading-none" aria-hidden="true">
              {stage.emoji}
            </span>
          </div>

          <span className="absolute right-2 top-1 text-[24px]" aria-hidden="true">
            {match >= stage.need ? '🧲' : '↔️'}
          </span>
        </div>

        {/* 기울기·크기 조절 */}
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ['기울기', 'rot', 4, '↺', '↻'],
              ['크기', 'scale', 6, '−', '＋'],
            ] as const
          ).map(([label, key, step, minus, plus]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="w-9 text-[14px] font-black text-slate-400">{label}</span>
              <button
                type="button"
                onClick={() => nudge(key, -step)}
                disabled={status !== 'playing'}
                aria-label={`${label} 줄이기`}
                className="h-11 flex-1 rounded-lg border-2 border-slate-500/60 bg-slate-800 text-base font-black text-slate-100 disabled:opacity-40"
              >
                {minus}
              </button>
              <button
                type="button"
                onClick={() => nudge(key, step)}
                disabled={status !== 'playing'}
                aria-label={`${label} 늘리기`}
                className="h-11 flex-1 rounded-lg border-2 border-slate-500/60 bg-slate-800 text-base font-black text-slate-100 disabled:opacity-40"
              >
                {plus}
              </button>
            </div>
          ))}
        </div>
      </div>
    </MiniGameFrame>
  );
}
