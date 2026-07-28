import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m1-l1 「아이미와 처음 만난 날」 — 배터리 나누기.
 *
 * 아이미의 세 기능(듣기·보기·생각하기)에 배터리를 나눠 담아 임무를 해낸다. 배터리 총량이
 * 정해져 있어 한 곳을 올리면 다른 곳이 줄어든다. 그래서 "듣기에 얼마를 줄까"의 답이 혼자
 * 정해지지 않고 임무와 나머지 배분에 함께 달려 있다.
 *
 * 임무마다 필요한 기능이 다른 것이 차시의 핵심(번역·추천·분류는 각각 다른 입력을 쓴다).
 */

type AbilityId = 'hear' | 'see' | 'think';

interface Ability {
  id: AbilityId;
  emoji: string;
  name: string;
  input: string;
}

interface Mission {
  id: string;
  tab: string;
  emoji: string;
  name: string;
  battery: number;
  need: Record<AbilityId, number>;
  done: string;
}

const ABILITIES: Ability[] = [
  { id: 'hear', emoji: '👂', name: '듣기', input: '말' },
  { id: 'see', emoji: '👁️', name: '보기', input: '사진' },
  { id: 'think', emoji: '🧠', name: '생각하기', input: '글' },
];

const MISSIONS: Mission[] = [
  {
    id: 'translate',
    tab: '번역',
    emoji: '🗣️',
    name: '친구 말을 다른 나라 말로 바꾸기',
    battery: 10,
    need: { hear: 4, see: 1, think: 4 },
    done: '아이미가 친구 말을 알아듣고 다른 나라 말로 바꿨어요!',
  },
  {
    id: 'recommend',
    tab: '추천',
    emoji: '🎵',
    name: '내가 좋아할 음악 골라 주기',
    battery: 10,
    need: { hear: 3, see: 1, think: 5 },
    done: '아이미가 내 취향을 살펴 노래를 골라 줬어요!',
  },
  {
    id: 'sort',
    tab: '분류',
    emoji: '📷',
    name: '사진 속 물건을 찾아 나누기',
    battery: 10,
    need: { hear: 3, see: 4, think: 3 },
    done: '아이미가 사진에서 물건을 찾아 종류대로 나눴어요!',
  },
];

export default function AimiBatteryGame({ supportLevel }: MiniGameProps) {
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
  } = useMiniGameStage({ supportLevel, stageCount: MISSIONS.length });

  const mission = MISSIONS[stageIndex];
  const [give, setGive] = useState<Record<AbilityId, number>>({ hear: 0, see: 0, think: 0 });

  useEffect(() => {
    setGive({ hear: 0, see: 0, think: 0 });
  }, [round, stageIndex]);

  const used = ABILITIES.reduce((sum, a) => sum + give[a.id], 0);
  const leftOver = mission.battery - used;
  const metCount = ABILITIES.filter((a) => give[a.id] >= mission.need[a.id]).length;

  const change = (id: AbilityId, delta: number) => {
    if (status !== 'playing') return;
    setGive((prev) => {
      const next = Math.max(0, prev[id] + delta);
      const others = ABILITIES.reduce((s, a) => (a.id === id ? s : s + prev[a.id]), 0);
      if (others + next > mission.battery) return prev; // 총량을 넘길 수 없다
      return { ...prev, [id]: next };
    });
  };

  const handleHint = () => {
    setGive({ ...mission.need });
  };

  const handleStart = () => {
    if (metCount === ABILITIES.length) {
      succeed(mission.done);
    } else {
      const short = ABILITIES.filter((a) => give[a.id] < mission.need[a.id])
        .map((a) => a.name)
        .join('·');
      fail(`${short}에 배터리가 모자라요.`);
    }
  };

  return (
    <MiniGameFrame
      badge="아이미 깨우기 — 배터리 나누기"
      instruction="배터리를 아이미의 세 기능에 나눠 담아요. 아래 임무에 필요한 만큼 채워야 하는데, 총량이 정해져 있어 한 곳을 올리면 다른 곳이 줄어들어요."
      accent="var(--brand-glow)"
      progress={{ label: '남은 배터리', value: leftOver, max: mission.battery }}
      stages={MISSIONS.slice(0, visibleStageCount).map((m) => ({ id: m.id, label: m.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, MISSIONS[index].name)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="다시" />
          {hintAllowed && (
            <MiniGameButton onClick={handleHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={handleStart}
            disabled={status !== 'playing'}
            emoji="⚡"
            label="아이미 켜기!"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 임무 */}
        <div className="rounded-lg border-2 border-amber-400/50 bg-amber-400/10 px-2 py-1.5">
          <p className="text-[14px] font-black text-amber-300">오늘의 임무</p>
          <p className="text-[14px] font-bold text-slate-100">
            {mission.emoji} {mission.name}
          </p>
        </div>

        {/* 배터리 칸 */}
        <div className="flex items-center gap-1">
          {Array.from({ length: mission.battery }).map((_, i) => (
            <span
              key={i}
              className="h-4 flex-1 rounded-sm"
              style={{ background: i < used ? '#4FC3E8' : 'rgba(148,163,184,0.25)' }}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="text-center text-[14px] font-black text-slate-300">
          쓴 배터리 {used} / {mission.battery}
        </p>

        {/* 기능별 배분 */}
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ABILITIES.map((a) => {
            const need = mission.need[a.id];
            const val = give[a.id];
            const ok = val >= need;
            return (
              <div
                key={a.id}
                className="rounded-lg border-2 px-2 py-1.5"
                style={{
                  background: ok ? 'rgba(22,163,74,0.22)' : 'rgba(30,41,59,0.9)',
                  borderColor: ok ? '#4ade80' : 'rgba(148,163,184,0.45)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none">{a.emoji}</span>
                  <span className="flex flex-1 flex-col leading-tight">
                    <span className="text-[14px] font-black text-slate-100">{a.name}</span>
                    <span className="text-[14px] font-bold text-slate-400">
                      {a.input} 입력 · {need}칸 필요
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => change(a.id, -1)}
                    disabled={status !== 'playing'}
                    aria-label={`${a.name} 배터리 줄이기`}
                    className="h-11 w-11 rounded-lg border-2 border-slate-500/60 bg-slate-800 text-base font-black text-slate-100 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-base font-black text-slate-100">{val}</span>
                  <button
                    type="button"
                    onClick={() => change(a.id, 1)}
                    disabled={status !== 'playing' || leftOver <= 0}
                    aria-label={`${a.name} 배터리 늘리기`}
                    className="h-11 w-11 rounded-lg border-2 border-slate-500/60 bg-slate-800 text-base font-black text-slate-100 disabled:opacity-40"
                  >
                    ＋
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[14px] font-black text-slate-400">
          채운 기능 {metCount} / 3
        </p>
      </div>
    </MiniGameFrame>
  );
}
