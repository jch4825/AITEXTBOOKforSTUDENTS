import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m1-l10 「AI 결과를 사용할까?」 — 확인 시간 배분.
 *
 * 아이미가 만든 결과를 그냥 내보내지 않고 사람이 확인한다. 확인 버튼을 누르고 있는 동안
 * 확인 막대가 차고, 필요한 만큼 채운 뒤 내보내야 한다. 필요량은 카드에 보이게 적어 두었으므로
 * 판단은 공짜다(어느 것이 정답인지 고르는 문제가 아니다).
 *
 * 난이도는 전체 시간이다. 이 결과에 오래 쓰면 다음 결과에 쓸 시간이 사라진다. 그래서
 * 카드 하나의 정답이 혼자 정해지지 않고 남은 카드와 남은 시간에 함께 달려 있다.
 */

interface Card {
  id: string;
  emoji: string;
  label: string;
  /** 사람이 확인해야 하는 시간(초) */
  need: number;
  note: string;
}

interface Stage {
  id: string;
  tab: string;
  name: string;
  limit: number;
  cards: Card[];
}

const STAGES: Stage[] = [
  {
    id: 's1',
    tab: '기본',
    name: '결과 3개 확인하기',
    limit: 6.5,
    cards: [
      { id: 'song', emoji: '🎵', label: '추천 곡 목록', need: 1.0, note: '공식 목록과 맞나?' },
      { id: 'time', emoji: '🕐', label: '행사 시간', need: 1.8, note: '확인 안 된 정보!' },
      { id: 'title', emoji: '📝', label: '안내 문구 제목', need: 0.8, note: '가볍게 훑기' },
    ],
  },
  {
    id: 's2',
    tab: '1단계',
    name: '결과 4개 확인하기',
    limit: 8.5,
    cards: [
      { id: 'song', emoji: '🎵', label: '추천 곡 목록', need: 1.2, note: '공식 목록과 맞나?' },
      { id: 'time', emoji: '🕐', label: '행사 시간', need: 2.0, note: '확인 안 된 정보!' },
      { id: 'title', emoji: '📝', label: '안내 문구 제목', need: 0.8, note: '가볍게 훑기' },
      { id: 'place', emoji: '📍', label: '행사 장소', need: 1.6, note: '바뀌었을 수 있음' },
    ],
  },
  {
    id: 's3',
    tab: '2단계',
    name: '결과 5개 확인하기',
    limit: 11,
    cards: [
      { id: 'song', emoji: '🎵', label: '추천 곡 목록', need: 1.4, note: '공식 목록과 맞나?' },
      { id: 'time', emoji: '🕐', label: '행사 시간', need: 2.2, note: '확인 안 된 정보!' },
      { id: 'title', emoji: '📝', label: '안내 문구 제목', need: 1.0, note: '가볍게 훑기' },
      { id: 'place', emoji: '📍', label: '행사 장소', need: 1.8, note: '바뀌었을 수 있음' },
      { id: 'who', emoji: '🙋', label: '담당 선생님 이름', need: 1.2, note: '사람에게 확인' },
    ],
  },
];

export default function ResultCheckBudgetGame({ supportLevel }: MiniGameProps) {
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

  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState(0); // 현재 카드에 쌓인 확인 시간
  const [left, setLeft] = useState(stage.limit);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState<string[]>([]);

  const holdRef = useRef(false);
  const checkedRef = useRef(0);
  const leftRef = useRef(stage.limit);
  const indexRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  holdRef.current = holding;
  indexRef.current = index;

  useEffect(() => {
    setIndex(0);
    setChecked(0);
    setLeft(stage.limit);
    setHolding(false);
    setDone([]);
    checkedRef.current = 0;
    leftRef.current = stage.limit;
    holdRef.current = false;
  }, [round, stageIndex, stage.limit]);

  useEffect(() => {
    if (status !== 'running') return;
    let last = performance.now();
    let stopped = false;

    const frame = (now: number) => {
      if (stopped) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      leftRef.current = Math.max(0, leftRef.current - dt);
      setLeft(leftRef.current);

      if (holdRef.current) {
        checkedRef.current += dt;
        setChecked(checkedRef.current);
      }

      if (leftRef.current <= 0) {
        const remain = stage.cards.length - indexRef.current;
        fail(`시간이 끝났어요. ${remain}개를 못 내보냈어요.`);
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      stopped = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [status, stage.cards.length, fail]);

  const card = stage.cards[index];
  const ratio = card ? Math.min(1, checked / card.need) : 0;
  const enough = ratio >= 1;

  const startHold = () => {
    if (status === 'playing') {
      run('결과를 확인해서 내보내요. 시간이 정해져 있어요!');
      setHolding(true);
      holdRef.current = true;
      return;
    }
    if (status !== 'running') return;
    setHolding(true);
    holdRef.current = true;
  };

  const endHold = () => {
    setHolding(false);
    holdRef.current = false;
  };

  const handleSend = () => {
    if (status !== 'running' || !card) return;
    if (!enough) {
      fail(`${card.label}을(를) 덜 확인하고 내보냈어요. 오류가 섞여 나갔어요.`);
      return;
    }
    const nextIndex = index + 1;
    setDone((prev) => [...prev, card.id]);
    endHold();
    checkedRef.current = 0;
    setChecked(0);

    if (nextIndex >= stage.cards.length) {
      succeed(`결과 ${stage.cards.length}개를 모두 확인해서 내보냈어요!`);
      return;
    }
    setIndex(nextIndex);
  };

  return (
    <MiniGameFrame
      badge="확인하고 내보내기"
      instruction="🔍 버튼을 누르고 있으면 확인 막대가 차요. 카드에 적힌 만큼 채운 뒤 내보내야 합니다. 한 카드에 오래 쓰면 뒤 카드에 쓸 시간이 없어요."
      accent="var(--brand-ink)"
      progress={{ label: '내보낸 결과', value: done.length, max: stage.cards.length }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index2) => goToStage(index2, STAGES[index2].name)}
      status={status}
      message={message}
      actions={
        status === 'success' || status === 'fail' ? (
          <button
            type="button"
            onClick={retry}
            className="h-11 w-full rounded-xl border-2 text-[14px] font-black"
            style={{
              background: 'var(--paper-1)',
              borderColor: 'var(--line)',
              color: 'var(--ink-1)',
            }}
          >
            🔁 한 번 더
          </button>
        ) : (
          <>
            <button
              type="button"
              onPointerDown={startHold}
              onPointerUp={endHold}
              onPointerCancel={endHold}
              onPointerLeave={endHold}
              onKeyDown={(e: any) => {
                if (e.key === ' ' && !e.repeat) {
                  e.preventDefault();
                  startHold();
                }
              }}
              onKeyUp={(e: any) => {
                if (e.key === ' ') endHold();
              }}
              style={{ touchAction: 'none' }}
              className="flex h-12 flex-[2] items-center justify-center gap-1 rounded-xl border-2 text-[14px] font-black transition"
              aria-label="누르고 있으면 확인"
            >
              <span className="text-base leading-none">🔍</span>
              {holding ? '확인 중…' : '누르고 있기'}
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={status !== 'running'}
              className="flex h-12 flex-1 items-center justify-center gap-1 rounded-xl border-2 text-[14px] font-black transition disabled:opacity-45"
              style={{
                background: enough ? 'var(--ok-bg)' : 'var(--paper-1)',
                borderColor: enough ? 'var(--ok)' : 'var(--line)',
                color: enough ? '#14532d' : 'var(--ink-2)',
              }}
            >
              <span className="text-base leading-none">📤</span>
              내보내기
            </button>
          </>
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 남은 시간 */}
        <div>
          <div className="mb-1 flex items-center justify-between text-[14px] font-black text-slate-400">
            <span>남은 시간</span>
            <span className={left < 2.5 ? 'text-rose-300' : 'text-slate-300'}>
              {left.toFixed(1)}초
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(left / stage.limit) * 100}%`,
                background: left < 2.5 ? '#fb7185' : '#94a3b8',
              }}
            />
          </div>
        </div>

        {/* 지금 확인 중인 결과 */}
        {card && (
          <div className="rounded-xl border-2 border-slate-500/50 bg-slate-800/70 p-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{card.emoji}</span>
              <span className="flex flex-1 flex-col">
                <span className="text-[15px] font-black text-slate-100">{card.label}</span>
                <span className="text-[14px] font-bold text-amber-300">{card.note}</span>
              </span>
              <span className="text-[14px] font-black text-slate-400">
                {card.need.toFixed(1)}초 필요
              </span>
            </div>

            <div className="relative mt-2 h-4 overflow-hidden rounded-full bg-slate-950">
              <div
                className="h-full rounded-full transition-[width] duration-75"
                style={{
                  width: `${ratio * 100}%`,
                  background: enough ? '#34d399' : '#4FC3E8',
                }}
              />
              <span className="absolute inset-0 grid place-items-center text-[14px] font-black text-white">
                {enough ? '확인 완료 — 내보내도 좋아요' : '확인 중…'}
              </span>
            </div>
          </div>
        )}

        {/* 남은 결과 대기줄 */}
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-[14px] font-black text-slate-400">기다리는 결과</p>
          <div className="flex flex-wrap gap-1">
            {stage.cards.slice(index + 1).map((c) => (
              <span
                key={c.id}
                className="flex items-center gap-1 rounded-md border border-slate-600/60 bg-slate-900/70 px-1.5 py-1 text-[14px] font-bold text-slate-300"
              >
                {c.emoji} {c.label} · {c.need.toFixed(1)}초
              </span>
            ))}
            {index + 1 >= stage.cards.length && (
              <span className="text-[14px] font-bold text-slate-500">마지막 결과예요</span>
            )}
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
