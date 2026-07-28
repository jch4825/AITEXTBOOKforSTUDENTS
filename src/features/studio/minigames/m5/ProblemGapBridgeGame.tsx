import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m5-l1 「문제를 정확히 찾기」 — 격차에 다리 놓기.
 *
 * 지금 상태와 목표 사이의 간격이 곧 문제의 크기다. 알아내야 할 것들을 다리 조각으로 이어
 * 그 간격을 정확히 채워야 한다. 모자라면 건너지 못하고, 넘치면 다리가 삐져나가 무너진다.
 *
 * 조각 하나의 옳고 그름이 혼자 정해지지 않는다. 이미 놓은 조각들과 남은 칸에 따라
 * 같은 조각이 맞기도 하고 넘치기도 한다. 정확히 채우는 방법은 여러 가지다.
 */

interface Piece {
  id: string;
  emoji: string;
  label: string;
  span: number;
}

interface Stage {
  id: string;
  tab: string;
  now: string;
  goal: string;
  width: number;
  maxPieces: number;
  pieces: Piece[];
}

const STAGES: Stage[] = [
  {
    id: 'delivery',
    tab: '기본',
    now: '택배가 아직 안 왔어요',
    goal: '내일까지 받아야 해요',
    width: 11,
    maxPieces: 3,
    pieces: [
      { id: 'where', emoji: '📦', label: '지금 어디 있는지', span: 6 },
      { id: 'when', emoji: '📅', label: '언제 도착하는지', span: 5 },
      { id: 'who', emoji: '📞', label: '누구에게 물어볼지', span: 4 },
      { id: 'home', emoji: '🏠', label: '받을 사람이 있는지', span: 3 },
      { id: 'cost', emoji: '💰', label: '배송비가 얼마인지', span: 2 },
      { id: 'color', emoji: '🎨', label: '상자 색이 무엇인지', span: 1 },
    ],
  },
  {
    id: 'trip',
    tab: '1단계',
    now: '버스를 놓쳤어요',
    goal: '수업 시작 전에 도착해야 해요',
    width: 13,
    maxPieces: 3,
    pieces: [
      { id: 'next', emoji: '🚌', label: '다음 차가 언제인지', span: 7 },
      { id: 'time', emoji: '⏰', label: '몇 분이 남았는지', span: 6 },
      { id: 'other', emoji: '🚶', label: '걸어가면 얼마나 걸리는지', span: 5 },
      { id: 'tell', emoji: '📱', label: '누구에게 알릴지', span: 4 },
      { id: 'money', emoji: '💳', label: '차비가 있는지', span: 3 },
      { id: 'seat', emoji: '💺', label: '자리가 있는지', span: 1 },
    ],
  },
  {
    id: 'broken',
    tab: '2단계',
    now: '준비물이 망가졌어요',
    goal: '오후 수업에 쓸 수 있어야 해요',
    width: 15,
    maxPieces: 3,
    pieces: [
      { id: 'what', emoji: '🔍', label: '어디가 망가졌는지', span: 8 },
      { id: 'fix', emoji: '🛠️', label: '고칠 수 있는지', span: 7 },
      { id: 'spare', emoji: '📦', label: '여분이 있는지', span: 6 },
      { id: 'ask', emoji: '🙋', label: '누구에게 빌릴지', span: 5 },
      { id: 'time', emoji: '⏳', label: '언제까지 필요한지', span: 4 },
      { id: 'price', emoji: '🏷️', label: '새로 사면 얼마인지', span: 2 },
    ],
  },
];

export default function ProblemGapBridgeGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    hintAllowed,
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
  const [laid, setLaid] = useState<string[]>([]);
  const [crossing, setCrossing] = useState(false);

  useEffect(() => {
    setLaid([]);
    setCrossing(false);
  }, [round, stageIndex]);

  const byId = (id: string) => stage.pieces.find((p) => p.id === id)!;
  const span = laid.reduce((sum, id) => sum + byId(id).span, 0);
  const rest = stage.width - span;

  const toggle = (id: string) => {
    if (status !== 'playing') return;
    setLaid((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= stage.maxPieces) return prev;
      return [...prev, id];
    });
  };

  const handleHint = () => {
    // 정확히 채우는 조합 하나를 찾아 준다.
    const ids = stage.pieces.map((p) => p.id);
    let found: string[] | null = null;
    const walk = (start: number, cur: string[], sum: number) => {
      if (found) return;
      if (sum === stage.width) {
        found = [...cur];
        return;
      }
      if (sum > stage.width || cur.length >= stage.maxPieces) return;
      for (let i = start; i < ids.length; i += 1) {
        walk(i + 1, [...cur, ids[i]], sum + byId(ids[i]).span);
      }
    };
    walk(0, [], 0);
    if (found) setLaid(found);
  };

  const cross = () => {
    if (status !== 'playing') return;
    setCrossing(true);
    run('다리를 건너 봅니다!');
  };

  useEffect(() => {
    if (status !== 'running') return;
    const timer = setTimeout(() => {
      if (span < stage.width) {
        fail(`다리가 ${stage.width - span}칸 모자라요. 더 알아봐야 해요.`);
      } else if (span > stage.width) {
        fail(`${span - stage.width}칸이 남아 삐져나갔어요. 문제와 상관없는 걸 뺐어요.`);
      } else {
        succeed('간격을 정확히 채웠어요. 문제가 무엇인지 또렷해졌어요!');
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [status, span, stage.width, succeed, fail]);

  useEffect(() => {
    if (status === 'playing') setCrossing(false);
  }, [status]);

  return (
    <MiniGameFrame
      badge="문제의 크기 재기"
      instruction={`지금 상태와 목표 사이가 문제의 크기예요. 알아볼 것을 ${stage.maxPieces}개까지 이어 그 간격을 딱 맞게 채우세요. 모자라도, 넘쳐도 건너지 못해요.`}
      accent="var(--brand-ink)"
      progress={{ label: '놓은 다리', value: Math.min(span, stage.width), max: stage.width }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, STAGES[i].now)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="다시" />
          {hintAllowed && (
            <MiniGameButton onClick={handleHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={cross}
            disabled={status !== 'playing' || laid.length === 0}
            emoji="🚶"
            label={status === 'running' ? '건너는 중…' : '건너가기'}
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 지금 상태와 목표 */}
        <div className="flex items-stretch gap-1 text-[14px] font-bold">
          <div className="flex-1 rounded-lg border-2 border-slate-500/60 bg-slate-800/80 px-2 py-1">
            <p className="text-[14px] font-black text-slate-400">지금</p>
            <p className="text-slate-100">{stage.now}</p>
          </div>
          <div className="flex-1 rounded-lg border-2 border-amber-400/60 bg-amber-400/10 px-2 py-1">
            <p className="text-[14px] font-black text-amber-300">목표</p>
            <p className="text-slate-100">{stage.goal}</p>
          </div>
        </div>

        {/* 강과 다리 */}
        <div className="relative min-h-[92px] overflow-hidden rounded-xl border-2 border-slate-600/40 bg-slate-950/70 p-2">
          <div className="flex h-full items-end">
            <span className="text-xl leading-none" aria-hidden="true">
              🧍
            </span>
            <div className="mx-1 flex flex-1 items-end gap-[2px]">
              {Array.from({ length: stage.width }).map((_, i) => (
                <span
                  key={i}
                  className="h-3 flex-1 rounded-sm"
                  style={{
                    background:
                      i < Math.min(span, stage.width)
                        ? span === stage.width
                          ? '#34d399'
                          : '#4FC3E8'
                        : 'rgba(148,163,184,0.22)',
                  }}
                  aria-hidden="true"
                />
              ))}
              {span > stage.width && (
                <span
                  className="h-3 rounded-sm bg-rose-400"
                  style={{ width: `${((span - stage.width) / stage.width) * 100}%` }}
                  aria-hidden="true"
                />
              )}
            </div>
            <span className="text-xl leading-none" aria-hidden="true">
              🎯
            </span>
          </div>
          <p className="mt-1 text-center text-[14px] font-black text-slate-300">
            {rest > 0 ? `${rest}칸 모자라요` : rest < 0 ? `${-rest}칸 넘쳤어요` : '딱 맞아요!'}
          </p>
          {crossing && span === stage.width && (
            <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-lg" aria-hidden="true">
              ✨
            </span>
          )}
        </div>

        {/* 알아볼 것 고르기 */}
        <div className="flex-1">
          <p className="mb-1 text-[14px] font-black text-slate-400">
            알아볼 것 ({laid.length}/{stage.maxPieces})
          </p>
          <div className="flex flex-col gap-1">
            {stage.pieces.map((p) => {
              const on = laid.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.id)}
                  disabled={status !== 'playing' || (!on && laid.length >= stage.maxPieces)}
                  className="flex min-h-11 items-center gap-2 rounded-lg border-2 px-2 py-1 text-left disabled:opacity-40"
                  style={{
                    borderColor: on ? '#4ade80' : 'rgba(148,163,184,0.45)',
                    background: on ? 'rgba(22,163,74,0.2)' : 'rgba(30,41,59,0.9)',
                  }}
                >
                  <span className="text-base leading-none">{p.emoji}</span>
                  <span className="flex-1 text-[14px] font-bold text-slate-100">{p.label}</span>
                  <span className="text-[14px] font-black text-slate-400">{p.span}칸</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
