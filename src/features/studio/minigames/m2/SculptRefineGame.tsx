import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m2-l7 「부족한 점을 다시 말해요」 — 조각상 다듬기.
 *
 * 아이미의 첫 결과는 울퉁불퉁하다. 문질러서 깎아 목표 모양에 맞춘다.
 * 깎기만 되고 되붙일 수는 없어서, 한 곳을 너무 깎으면 되돌릴 방법이 없다.
 * 그래서 "여기를 얼마나 깎을까"의 답이 남은 부분과 함께 정해진다.
 */

interface Stage {
  id: string;
  tab: string;
  name: string;
  /** 처음 높이 */
  start: number[];
  /** 목표 높이 */
  target: number[];
  tolerance: number;
}

const STAGES: Stage[] = [
  {
    id: 's1',
    tab: '기본',
    name: '삐죽한 안내 문구 다듬기',
    start: [92, 70, 88, 64, 84],
    target: [60, 55, 62, 50, 58],
    tolerance: 7,
  },
  {
    id: 's2',
    tab: '1단계',
    name: '들쭉날쭉한 소개 글 다듬기',
    start: [96, 62, 90, 78, 68, 94],
    target: [58, 48, 64, 52, 46, 60],
    tolerance: 6,
  },
  {
    id: 's3',
    tab: '2단계',
    name: '거친 발표 대본 다듬기',
    start: [98, 74, 92, 66, 88, 72, 96],
    target: [56, 50, 62, 44, 58, 48, 60],
    tolerance: 5,
  },
];

const SHAVE = 3;

export default function SculptRefineGame({ supportLevel }: MiniGameProps) {
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
  const [heights, setHeights] = useState<number[]>(stage.start);
  const [rubbing, setRubbing] = useState(false);
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHeights([...STAGES[stageIndex].start]);
    setRubbing(false);
  }, [round, stageIndex]);

  const shaveAt = (clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY);
    const col = el && (el as HTMLElement).closest?.('[data-col]');
    if (!col) return;
    const i = Number((col as HTMLElement).dataset.col);
    if (!Number.isFinite(i)) return;
    setHeights((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, next[i] - SHAVE);
      return next;
    });
  };

  const shaveColumn = (index: number) => {
    if (status !== 'playing') return;
    setHeights((prev) => {
      const next = [...prev];
      next[index] = Math.max(0, next[index] - SHAVE);
      return next;
    });
  };

  const cut = heights.filter((h, i) => h < stage.target[i] - stage.tolerance).length;
  const fit = heights.filter((h, i) => Math.abs(h - stage.target[i]) <= stage.tolerance).length;
  const rough = heights.filter((h, i) => h > stage.target[i] + stage.tolerance).length;

  const handleHint = () => setHeights(stage.target.map((t) => t));

  const check = () => {
    if (status !== 'playing') return;
    if (cut > 0) {
      fail(`${cut}군데를 너무 깎았어요. 깎은 건 되돌릴 수 없어요.`);
      return;
    }
    if (rough > 0) {
      fail(`${rough}군데가 아직 울퉁불퉁해요.`);
      return;
    }
    succeed('목표 모양에 딱 맞게 다듬었어요!');
  };

  return (
    <MiniGameFrame
      badge="다듬어 고치기"
      instruction="아이미의 첫 결과가 울퉁불퉁해요. 문질러서 깎거나 아래 기둥 버튼을 눌러 점선(목표)에 맞춰요. 깎은 것은 되붙일 수 없으니 조금씩 다듬으세요."
      accent="var(--brand-ink)"
      progress={{ label: '맞은 곳', value: fit, max: heights.length }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, STAGES[i].name)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="처음으로" />
          {hintAllowed && (
            <MiniGameButton onClick={handleHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={check}
            disabled={status !== 'playing'}
            emoji="✅"
            label="다 됐어요"
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
            setRubbing(true);
            shaveAt(e.clientX, e.clientY);
          }}
          onPointerMove={(e: any) => {
            if (rubbing && status === 'playing') shaveAt(e.clientX, e.clientY);
          }}
          onPointerUp={() => setRubbing(false)}
          onPointerCancel={() => setRubbing(false)}
          onPointerLeave={() => setRubbing(false)}
          style={{ touchAction: 'none' }}
          className="relative flex min-h-[210px] flex-1 items-end gap-1 rounded-xl border-2 border-slate-600/40 bg-slate-950/60 p-2"
        >
          {heights.map((h, i) => {
            const t = stage.target[i];
            const tooLow = h < t - stage.tolerance;
            const ok = Math.abs(h - t) <= stage.tolerance;
            return (
              <div
                key={i}
                data-col={i}
                className="relative flex h-full flex-1 cursor-pointer items-end"
              >
                {/* 목표 높이 점선 */}
                <div
                  className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-amber-300/80"
                  style={{ bottom: `${t}%` }}
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none w-full rounded-t-sm transition-[height] duration-75"
                  style={{
                    height: `${h}%`,
                    background: tooLow ? '#fb7185' : ok ? '#34d399' : '#64748b',
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-1.5" aria-label="기둥별 두드려 다듬기 대체 조작">
          {heights.map((_, index) => (
            <button key={index} type="button" onClick={() => shaveColumn(index)} disabled={status !== 'playing'} className="min-h-11 rounded-lg border-2 border-sky-300 bg-sky-950 text-[13px] font-black text-white disabled:opacity-45">
              {index + 1}번 기둥 한 번 다듬기
            </button>
          ))}
        </div>

        <p className="text-center text-[14px] font-black text-slate-300">
          {cut > 0
            ? `🔻 너무 깎은 곳 ${cut}군데`
            : rough > 0
              ? `⛏️ 더 다듬을 곳 ${rough}군데`
              : '✨ 모두 맞았어요'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
