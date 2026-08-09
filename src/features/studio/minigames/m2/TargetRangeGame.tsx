import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m2-l3 「대상을 정확히 말해요」 — 범위 좁히기.
 *
 * 요청 범위를 원으로 그린다. 원을 끌어 옮기고 크기를 줄여 찾는 대상만 들어오게 한다.
 * 너무 넓으면 엉뚱한 대상까지 들어오고, 너무 좁히면 대상을 놓친다.
 * 중심과 반지름이 모두 연속값이라 성공하는 조합이 무수히 많다.
 */

interface Person {
  id: string;
  emoji: string;
  label: string;
  x: number;
  y: number;
  target?: boolean;
}

interface Stage {
  id: string;
  tab: string;
  ask: string;
  people: Person[];
}

const STAGES: Stage[] = [
  {
    id: 's1',
    tab: '기본',
    ask: '빨간 모자 쓴 친구에게 전해 줘',
    people: [
      { id: 'a', emoji: '🧢', label: '빨간 모자', x: 26, y: 30, target: true },
      { id: 'b', emoji: '👕', label: '파란 옷', x: 70, y: 26 },
      { id: 'c', emoji: '🎒', label: '가방 든 친구', x: 68, y: 72 },
      { id: 'd', emoji: '👟', label: '운동화 친구', x: 30, y: 76 },
    ],
  },
  {
    id: 's2',
    tab: '1단계',
    ask: '안경 쓴 친구에게 전해 줘',
    people: [
      { id: 'a', emoji: '👓', label: '안경', x: 50, y: 32, target: true },
      { id: 'b', emoji: '🧢', label: '모자', x: 26, y: 26 },
      { id: 'c', emoji: '👕', label: '파란 옷', x: 74, y: 34 },
      { id: 'd', emoji: '🎒', label: '가방', x: 30, y: 74 },
      { id: 'e', emoji: '👟', label: '운동화', x: 70, y: 76 },
    ],
  },
  {
    id: 's3',
    tab: '2단계',
    ask: '노란 우산 든 친구에게 전해 줘',
    people: [
      { id: 'a', emoji: '☂️', label: '노란 우산', x: 52, y: 52, target: true },
      { id: 'b', emoji: '🧢', label: '모자', x: 30, y: 30 },
      { id: 'c', emoji: '👓', label: '안경', x: 72, y: 30 },
      { id: 'd', emoji: '🎒', label: '가방', x: 28, y: 72 },
      { id: 'e', emoji: '👟', label: '운동화', x: 74, y: 72 },
      { id: 'f', emoji: '📚', label: '책 든 친구', x: 52, y: 22 },
    ],
  },
];

const MIN_R = 8;
const MAX_R = 60;

export default function TargetRangeGame({ supportLevel }: MiniGameProps) {
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
  const [center, setCenter] = useState({ x: 50, y: 50 });
  const [radius, setRadius] = useState(MAX_R);
  const [dragging, setDragging] = useState(false);
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCenter({ x: 50, y: 50 });
    setRadius(MAX_R);
    setDragging(false);
  }, [round, stageIndex]);

  const inside = (p: Person) =>
    Math.hypot(p.x - center.x, p.y - center.y) <= radius;

  const target = stage.people.find((p) => p.target)!;
  const others = stage.people.filter((p) => !p.target);
  const targetIn = inside(target);
  const wrongIn = others.filter(inside).length;

  const moveTo = (clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setCenter({
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
    });
  };

  const handleHint = () => {
    setCenter({ x: target.x, y: target.y });
    const nearest = Math.min(...others.map((p) => Math.hypot(p.x - target.x, p.y - target.y)));
    setRadius(Math.max(MIN_R, Math.min(MAX_R, nearest / 2)));
  };
  const focusPerson = (person: Person) => setCenter({ x: person.x, y: person.y });

  const send = () => {
    if (status !== 'playing') return;
    if (!targetIn) {
      fail('찾는 친구가 범위 밖이에요. 범위를 옮기거나 넓혀요.');
      return;
    }
    if (wrongIn > 0) {
      fail(`엉뚱한 친구 ${wrongIn}명이 함께 들어왔어요. 범위를 좁혀요.`);
      return;
    }
    succeed('딱 그 친구에게만 전해졌어요!');
  };

  return (
    <MiniGameFrame
      badge="범위 좁혀 말하기"
      instruction="원을 끌어 옮기고 크기를 줄여, 찾는 친구만 원 안에 들어오게 하세요. 끌기 어렵다면 아래 친구 버튼으로 원을 옮길 수 있어요."
      accent="var(--brand-ink)"
      progress={{ label: '원 안', value: (targetIn ? 1 : 0) + wrongIn, max: 1 }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, STAGES[i].ask)}
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
            emoji="📨"
            label="이 친구에게!"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="rounded-lg border-2 border-amber-400/50 bg-amber-400/10 px-2 py-1.5">
          <p className="text-[14px] font-black text-amber-300">아이미에게 할 부탁</p>
          <p className="text-[14px] font-bold text-slate-100">“{stage.ask}”</p>
        </div>

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
          className="relative min-h-[210px] flex-1 overflow-hidden rounded-xl border-2 border-slate-600/40 bg-slate-950/60"
        >
          {/* 요청 범위 */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors"
            style={{
              left: `${center.x}%`,
              top: `${center.y}%`,
              width: `${radius * 2}%`,
              height: `${radius * 2}%`,
              borderColor: targetIn && wrongIn === 0 ? '#4ade80' : '#fbbf24',
              background:
                targetIn && wrongIn === 0 ? 'rgba(22,163,74,0.18)' : 'rgba(251,191,36,0.14)',
            }}
          />
          {stage.people.map((p) => {
            const on = inside(p);
            return (
              <div
                key={p.id}
                className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  {p.emoji}
                </span>
                <span
                  className="rounded px-1 text-[14px] font-bold"
                  style={{
                    color: p.target ? '#bbf7d0' : on ? '#fecaca' : '#94a3b8',
                    background: on ? 'rgba(15,23,42,0.8)' : 'transparent',
                  }}
                >
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5" aria-label="범위 중심 대체 조작">
          {stage.people.map((person) => <button key={person.id} type="button" onClick={() => focusPerson(person)} className="min-h-11 rounded-lg border-2 border-sky-300 bg-sky-950 px-2 text-[14px] font-black text-white">🎯 {person.label}로 이동</button>)}
        </div>

        {/* 범위 크기 */}
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-black text-slate-400">범위 크기</span>
          <button
            type="button"
            onClick={() => setRadius((r) => Math.max(MIN_R, r - 4))}
            disabled={status !== 'playing'}
            aria-label="범위 좁히기"
            className="h-11 w-11 rounded-lg border-2 border-slate-500/60 bg-slate-800 text-base font-black text-slate-100 disabled:opacity-40"
          >
            좁게
          </button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-sky-400"
              style={{ width: `${((radius - MIN_R) / (MAX_R - MIN_R)) * 100}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setRadius((r) => Math.min(MAX_R, r + 4))}
            disabled={status !== 'playing'}
            aria-label="범위 넓히기"
            className="h-11 w-11 rounded-lg border-2 border-slate-500/60 bg-slate-800 text-base font-black text-slate-100 disabled:opacity-40"
          >
            넓게
          </button>
        </div>
      </div>
    </MiniGameFrame>
  );
}
