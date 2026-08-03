import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m3-l10 「오늘 배운 것을 내 말로 복습하기」 — 열람권.
 *
 * 떠올리는 데는 시간이 걸리고 전체 시간은 모자란다. 자료를 여는 열람권을 쓰면 그 항목은
 * 곧바로 끝나지만 스스로 떠올린 것으로 세어 주지 않는다. 열람권은 몇 장뿐이다.
 *
 * 그래서 "지금 열까"의 답이 혼자 정해지지 않는다 — 남은 시간, 남은 열람권, 뒤에 남은
 * 항목들이 함께 정한다. 차시의 "자료를 보기 전에 먼저 떠올린다"를 비용으로 겪게 한다.
 */

interface Point {
  id: string;
  emoji: string;
  label: string;
  /** 스스로 떠올리는 데 걸리는 시간(초) */
  think: number;
}

interface Stage {
  id: string;
  tab: string;
  limit: number;
  passes: number;
  needRecall: number;
  points: Point[];
}

const STAGES: Stage[] = [
  {
    id: 's1',
    tab: '기본',
    limit: 4.5,
    passes: 2,
    needRecall: 2,
    points: [
      { id: 'a', emoji: '🤖', label: 'AI가 하는 일', think: 1.2 },
      { id: 'b', emoji: '🎧', label: 'AI가 받는 입력', think: 1.6 },
      { id: 'c', emoji: '✅', label: '사람이 확인할 것', think: 1.0 },
      { id: 'd', emoji: '🛡️', label: '안전하게 쓰는 법', think: 2.0 },
    ],
  },
  {
    id: 's2',
    tab: '1단계',
    limit: 5.0,
    passes: 2,
    needRecall: 3,
    points: [
      { id: 'a', emoji: '🤖', label: 'AI가 하는 일', think: 1.2 },
      { id: 'b', emoji: '🎧', label: 'AI가 받는 입력', think: 1.6 },
      { id: 'c', emoji: '✅', label: '사람이 확인할 것', think: 1.1 },
      { id: 'd', emoji: '🛡️', label: '안전하게 쓰는 법', think: 2.0 },
      { id: 'e', emoji: '📚', label: '근거를 찾는 곳', think: 1.8 },
    ],
  },
  {
    id: 's3',
    tab: '2단계',
    limit: 5.5,
    passes: 2,
    needRecall: 4,
    points: [
      { id: 'a', emoji: '🤖', label: 'AI가 하는 일', think: 1.2 },
      { id: 'b', emoji: '🎧', label: 'AI가 받는 입력', think: 1.5 },
      { id: 'c', emoji: '✅', label: '사람이 확인할 것', think: 1.1 },
      { id: 'd', emoji: '🛡️', label: '안전하게 쓰는 법', think: 1.9 },
      { id: 'e', emoji: '📚', label: '근거를 찾는 곳', think: 1.7 },
      { id: 'f', emoji: '🙋', label: '도움을 청할 사람', think: 1.3 },
    ],
  },
];

export default function RecallPassGame({ supportLevel }: MiniGameProps) {
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

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [left, setLeft] = useState(stage.limit);
  const [passesLeft, setPassesLeft] = useState(stage.passes);
  const [recalled, setRecalled] = useState<string[]>([]);
  const [opened, setOpened] = useState<string[]>([]);

  const indexRef = useRef(0);
  const recalledRef = useRef<string[]>([]);
  const rafRef = useRef<number | null>(null);
  // 프레임 간 dt를 더해 나가면 이펙트가 다시 붙을 때마다 기준이 초기화돼 시계가 멈춘다.
  // 시작 시각과 항목 시작 시각을 ref에 고정해 두고 매 프레임 절대 경과 시간으로 계산한다.
  const startedAtRef = useRef(0);
  const pointStartRef = useRef(0);

  indexRef.current = index;
  recalledRef.current = recalled;

  useEffect(() => {
    setIndex(0);
    setProgress(0);
    setLeft(stage.limit);
    setPassesLeft(stage.passes);
    setRecalled([]);
    setOpened([]);
    startedAtRef.current = 0;
    pointStartRef.current = 0;
  }, [round, stageIndex, stage.limit, stage.passes]);

  useEffect(() => {
    if (status !== 'running') return;
    if (startedAtRef.current === 0) startedAtRef.current = performance.now();
    let stopped = false;

    const frame = (now: number) => {
      if (stopped) return;
      const elapsed = (now - startedAtRef.current) / 1000;

      const remaining = Math.max(0, stage.limit - elapsed);
      setLeft(remaining);

      const point = stage.points[indexRef.current];
      if (point) {
        const spent = elapsed - pointStartRef.current;
        setProgress(spent);
        if (spent >= point.think) {
          // 스스로 떠올려 냈다
          pointStartRef.current = elapsed;
          setProgress(0);
          setRecalled((prev) => [...prev, point.id]);
          setIndex((i) => i + 1);
        }
      }

      if (remaining <= 0) {
        fail('시간이 끝났어요. 열람권을 아껴 두면 더 멀리 갈 수 있어요.');
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

  // 항목을 모두 마치면 결과를 낸다.
  useEffect(() => {
    if (status !== 'running') return;
    if (index < stage.points.length) return;
    if (recalled.length >= stage.needRecall) {
      succeed(`${recalled.length}가지를 스스로 떠올렸어요!`);
    } else {
      fail(`스스로 떠올린 것이 ${recalled.length}가지뿐이에요. ${stage.needRecall}가지는 필요해요.`);
    }
  }, [status, index, recalled.length, stage.points.length, stage.needRecall, succeed, fail]);

  const point = stage.points[index];
  const ratio = point ? Math.min(1, progress / point.think) : 0;

  const start = () => {
    if (status !== 'playing') return;
    run('오늘 배운 것을 떠올려 봐요. 막히면 열람권을 쓸 수 있어요.');
  };

  const usePass = () => {
    if (status !== 'running' || passesLeft <= 0 || !point) return;
    setPassesLeft((n) => n - 1);
    setOpened((prev) => [...prev, point.id]);
    pointStartRef.current = (performance.now() - startedAtRef.current) / 1000;
    setProgress(0);
    setIndex((i) => i + 1);
  };

  return (
    <MiniGameFrame
      badge="열람권 — 먼저 떠올리기"
      instruction={`오늘 배운 것을 스스로 떠올려요. 떠올리는 데 시간이 걸리고 전체 시간은 모자랍니다. 막히면 열람권으로 자료를 열 수 있지만 ${stage.passes}장뿐이고, 연 항목은 스스로 떠올린 것으로 세지 않아요.`}
      accent="var(--brand-ink)"
      progress={{ label: '스스로 떠올림', value: recalled.length, max: stage.needRecall }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, `${STAGES[i].points.length}가지 복습하기`)}
      status={status}
      message={message}
      actions={
        status === 'playing' ? (
          <button
            type="button"
            onClick={start}
            className="h-12 w-full rounded-xl border-2 text-[14px] font-black"
            style={{
              background: 'var(--brand-ink)',
              borderColor: 'var(--brand-ink)',
              color: 'var(--paper-0)',
            }}
          >
            ▶️ 복습 시작
          </button>
        ) : status === 'running' ? (
          <button
            type="button"
            onClick={usePass}
            disabled={passesLeft <= 0}
            className="flex h-12 w-full items-center justify-center gap-1 rounded-xl border-2 text-[14px] font-black disabled:opacity-40"
            style={{
              background: 'var(--warn-bg)',
              borderColor: 'var(--warn)',
              color: '#7c2d12',
            }}
          >
            📖 열람 카드 쓰기 {Array.from({ length: stage.passes }).map((_, index) => (
              <span key={index} className={index < passesLeft ? 'text-amber-700' : 'text-slate-400'} aria-label={index < passesLeft ? '남은 열람 카드' : '쓴 열람 카드'}>📖</span>
            ))}
          </button>
        ) : (
          <button
            type="button"
            onClick={retry}
            disabled={isLocked}
            className="h-11 w-full rounded-xl border-2 text-[14px] font-black"
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
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div>
          <div className="mb-1 flex items-center justify-between text-[14px] font-black text-slate-400">
            <span>복습 흐름</span>
            <span className={left < 1.5 ? 'text-rose-300' : 'text-slate-300'}>{left > 0 ? '생각할 시간이 남아 있어요' : '다음 장면으로 넘어가요'}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(left / stage.limit) * 100}%`,
                background: left < 1.5 ? '#fb7185' : '#94a3b8',
              }}
            />
          </div>
        </div>

        {point ? (
          <div className="rounded-xl border-2 border-slate-500/50 bg-slate-800/70 p-3 text-center">
            <span className="text-3xl leading-none" aria-hidden="true">
              {point.emoji}
            </span>
            <p className="mt-1 text-[15px] font-black text-slate-100">{point.label}</p>
            <p className="text-[14px] font-bold text-slate-400">먼저 머릿속에서 떠올리고, 막히면 자료 카드를 열어요.</p>
            <div className="mt-2 h-4 overflow-hidden rounded-full bg-slate-950">
              <div
                className="h-full rounded-full"
                style={{ width: `${ratio * 100}%`, background: '#4FC3E8' }}
              />
            </div>
          </div>
        ) : (
          <p className="rounded-xl border-2 border-slate-600/40 bg-slate-900/50 p-3 text-center text-[14px] font-black text-slate-300">
            모두 끝났어요
          </p>
        )}

        <div className="flex flex-1 flex-col gap-1">
          <p className="text-[14px] font-black text-slate-400">복습할 것</p>
          <div className="flex flex-wrap gap-1">
            {stage.points.map((p) => {
              const byMe = recalled.includes(p.id);
              const byBook = opened.includes(p.id);
              return (
                <span
                  key={p.id}
                  className="flex items-center gap-1 rounded-md border px-1.5 py-1 text-[14px] font-bold"
                  style={{
                    borderColor: byMe ? '#4ade80' : byBook ? '#fbbf24' : 'rgba(148,163,184,0.4)',
                    background: byMe
                      ? 'rgba(22,163,74,0.25)'
                      : byBook
                        ? 'rgba(251,191,36,0.2)'
                        : 'rgba(30,41,59,0.7)',
                    color: '#e2e8f0',
                  }}
                >
                  {p.emoji} {p.label} {byMe ? '🧠' : byBook ? '📖' : ''}
                </span>
              );
            })}
          </div>
        </div>
        <div className="rounded-xl border-2 border-emerald-300/60 bg-emerald-950/60 px-3 py-2 text-center" aria-live="polite">
          <p className="text-[14px] font-black text-emerald-200">복습 장면</p>
          <p className="text-[15px] font-black text-white">{recalled.length >= stage.needRecall ? '🧠 내가 떠올린 내용이 복습 노트에 남았어요.' : opened.length ? '📖 자료 카드를 열어 다음 장면의 단서를 얻었어요.' : '🧠 카드를 보고 먼저 내 기억을 꺼내 봐요.'}</p>
        </div>
      </div>
    </MiniGameFrame>
  );
}
