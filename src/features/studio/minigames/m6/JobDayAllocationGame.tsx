import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m6-l10 「직업을 실제 사람과 함께 알아보기」 — 하루 체험.
 *
 * 아이미는 사서가 책 정리만 한다고 예상했지만 실제로는 안내·행사·디지털 자료까지 있다.
 * 학생은 체력을 네 가지 일에 나눠 담아 하루를 돌려 본다. 어느 일도 최소만큼은 해야
 * 하루가 돌아가고, 체력은 모자라기 때문에 한 곳에 몰면 다른 곳이 무너진다.
 *
 * 맞는 직업을 고르는 문제가 아니다. 남는 체력을 어디에 더 쓰느냐에 따라 "나와 맞는 정도"가
 * 연속값으로 달라질 뿐, 정답 배분은 없다.
 */

interface Work {
  id: string;
  emoji: string;
  name: string;
  min: number;
  /** 이 일이 나의 흥미·강점과 얼마나 이어지는지 */
  fit: number;
  aiGuess?: boolean;
}

interface Job {
  id: string;
  tab: string;
  name: string;
  emoji: string;
  stamina: number;
  aiSays: string;
  works: Work[];
}

const JOBS: Job[] = [
  {
    id: 'librarian',
    tab: '사서',
    name: '도서관 사서',
    emoji: '📚',
    stamina: 10,
    aiSays: '사서는 하루 종일 책만 정리해요.',
    works: [
      { id: 'shelf', emoji: '📚', name: '책 정리', min: 2, fit: 1, aiGuess: true },
      { id: 'help', emoji: '🙋', name: '이용자 안내', min: 3, fit: 3 },
      { id: 'event', emoji: '🎉', name: '행사 준비', min: 2, fit: 2 },
      { id: 'digital', emoji: '💻', name: '디지털 자료 관리', min: 1, fit: 2 },
    ],
  },
  {
    id: 'cafe',
    tab: '카페',
    name: '카페 일하는 사람',
    emoji: '☕',
    stamina: 11,
    aiSays: '카페 직원은 커피만 만들어요.',
    works: [
      { id: 'drink', emoji: '☕', name: '음료 만들기', min: 3, fit: 2, aiGuess: true },
      { id: 'order', emoji: '🧾', name: '주문 받기', min: 2, fit: 3 },
      { id: 'clean', emoji: '🧽', name: '자리 정리', min: 2, fit: 1 },
      { id: 'stock', emoji: '📦', name: '재료 챙기기', min: 2, fit: 2 },
    ],
  },
  {
    id: 'petcare',
    tab: '동물 돌봄',
    name: '반려동물 돌보는 사람',
    emoji: '🐶',
    stamina: 12,
    aiSays: '동물 돌봄은 놀아 주기만 하면 돼요.',
    works: [
      { id: 'play', emoji: '🎾', name: '놀아 주기', min: 2, fit: 3, aiGuess: true },
      { id: 'feed', emoji: '🥣', name: '밥 챙기기', min: 3, fit: 2 },
      { id: 'clean', emoji: '🧼', name: '청소·목욕', min: 3, fit: 1 },
      { id: 'record', emoji: '📝', name: '건강 기록', min: 2, fit: 3 },
    ],
  },
];

export default function JobDayAllocationGame({ supportLevel }: MiniGameProps) {
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
  } = useMiniGameStage({ supportLevel, stageCount: JOBS.length });

  const job = JOBS[stageIndex];
  const [give, setGive] = useState<Record<string, number>>({});

  useEffect(() => {
    setGive({});
  }, [round, stageIndex]);

  const valueOf = (id: string) => give[id] ?? 0;
  const used = job.works.reduce((sum, w) => sum + valueOf(w.id), 0);
  const leftOver = job.stamina - used;
  const metCount = job.works.filter((w) => valueOf(w.id) >= w.min).length;
  const fitScore = job.works.reduce((sum, w) => sum + valueOf(w.id) * w.fit, 0);
  const maxFit = job.stamina * Math.max(...job.works.map((w) => w.fit));

  const change = (id: string, delta: number) => {
    if (status !== 'playing') return;
    setGive((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      const others = job.works.reduce(
        (s, w) => (w.id === id ? s : s + (prev[w.id] ?? 0)),
        0,
      );
      if (others + next > job.stamina) return prev;
      return { ...prev, [id]: next };
    });
  };

  const handleHint = () => {
    const base: Record<string, number> = {};
    job.works.forEach((w) => {
      base[w.id] = w.min;
    });
    setGive(base);
  };

  const runDay = () => {
    if (status !== 'playing') return;
    if (metCount < job.works.length) {
      const short = job.works
        .filter((w) => valueOf(w.id) < w.min)
        .map((w) => w.name)
        .join('·');
      fail(`${short}에 힘이 모자라 하루가 안 돌아가요.`);
      return;
    }
    succeed(`${job.name}의 하루를 해냈어요! 나와 맞는 정도 ${fitScore}점.`);
  };

  return (
    <MiniGameFrame
      badge="직업 하루 체험"
      instruction="체력을 네 가지 일에 나눠 담고 하루를 돌려 봐요. 어느 일도 최소만큼은 해야 하루가 돌아갑니다. 남는 체력을 어디에 쓸지는 나에게 달렸어요."
      accent="var(--ok)"
      progress={{ label: '남은 체력', value: leftOver, max: job.stamina }}
      stages={JOBS.slice(0, visibleStageCount).map((j) => ({ id: j.id, label: j.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, JOBS[index].name)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="다시" />
          {hintAllowed && (
            <MiniGameButton onClick={handleHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={runDay}
            disabled={status !== 'playing'}
            emoji="🌅"
            label="하루 시작!"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 아이미의 예상 — 한 가지 일로 줄여 버린 예상 */}
        <div className="rounded-lg border-2 border-slate-600/50 bg-slate-900/60 px-2 py-1.5">
          <p className="text-[14px] font-black text-slate-400">
            🤖 아이미의 예상 {job.emoji} {job.name}
          </p>
          <p className="text-[14px] font-bold text-slate-200">“{job.aiSays}”</p>
          <p className="mt-0.5 text-[14px] font-black text-amber-300">
            실제로는 네 가지 일이 모두 있어요.
          </p>
        </div>

        {/* 일마다 체력 배분 */}
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {job.works.map((w) => {
            const val = valueOf(w.id);
            const ok = val >= w.min;
            return (
              <div
                key={w.id}
                className="rounded-lg border-2 px-2 py-1.5"
                style={{
                  background: ok ? 'rgba(22,163,74,0.2)' : 'rgba(30,41,59,0.9)',
                  borderColor: ok ? '#4ade80' : 'rgba(148,163,184,0.45)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none">{w.emoji}</span>
                  <span className="flex flex-1 flex-col leading-tight">
                    <span className="text-[14px] font-black text-slate-100">
                      {w.name}
                      {w.aiGuess && <span className="ml-1 text-[14px] text-slate-400">🤖 예상</span>}
                    </span>
                    <span className="text-[14px] font-bold text-slate-400">
                      최소 {w.min} · 나와 맞음 {'★'.repeat(w.fit)}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => change(w.id, -1)}
                    disabled={status !== 'playing'}
                    aria-label={`${w.name} 체력 줄이기`}
                    className="h-11 w-11 rounded-lg border-2 border-slate-500/60 bg-slate-800 text-base font-black text-slate-100 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-base font-black text-slate-100">{val}</span>
                  <button
                    type="button"
                    onClick={() => change(w.id, 1)}
                    disabled={status !== 'playing' || leftOver <= 0}
                    aria-label={`${w.name} 체력 늘리기`}
                    className="h-11 w-11 rounded-lg border-2 border-slate-500/60 bg-slate-800 text-base font-black text-slate-100 disabled:opacity-40"
                  >
                    ＋
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 나와 맞는 정도 — 정답이 아니라 결과 */}
        <div>
          <div className="mb-1 flex items-center justify-between text-[14px] font-black text-slate-400">
            <span>나와 맞는 정도</span>
            <span className="text-slate-300">{fitScore}점</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (fitScore / maxFit) * 100)}%`, background: '#34d399' }}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
