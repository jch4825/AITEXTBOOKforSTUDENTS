import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'seat', label: '기본', title: '자리 부탁' },
  { id: 'sound', label: '1단계', title: '소리 줄이기 부탁' },
  { id: 'help', label: '2단계', title: '도움 부탁' },
];
const STONES = [
  { rough: '야!', smooth: '친구야,' },
  { rough: '그거 해!', smooth: '소리를 줄여 줘.' },
  { rough: '당장!', smooth: '수업이 끝날 때까지 부탁해.' },
];

export default function RequestSandingGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const [smoothness, setSmoothness] = useState([0, 0, 0]);
  useEffect(() => setSmoothness([0, 0, 0]), [game.round, game.stageIndex]);

  const rub = (index: number) => {
    const next = smoothness.map((value, i) => (i === index ? Math.min(3, value + 1) : value));
    setSmoothness(next);
    if (next.every((value) => value >= 3)) game.succeed('거친 돌을 다듬어 목적·행동·조건이 보이는 부탁 다리를 만들었어요!');
  };

  return (
    <MiniGameFrame
      badge="부탁 돌 다듬기"
      instruction="거친 말 돌을 여러 번 문질러 목적·행동·조건이 보이는 매끈한 부탁 다리로 바꾸세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].title)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🧽" label="다른 부탁 다듬기" />}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        {STONES.map((stone, index) => {
          const done = smoothness[index] >= 3;
          return (
            <button
              key={stone.rough}
              type="button"
              onClick={() => rub(index)}
              disabled={done || game.status !== 'playing'}
              className={`min-h-16 rounded-2xl border-4 px-4 text-[16px] font-black transition-all ${
                done
                  ? 'border-emerald-300 bg-emerald-900 text-white'
                  : 'border-stone-400 bg-stone-800 text-stone-100'
              }`}
              style={{ borderRadius: done ? 18 : `${8 + smoothness[index] * 3}px` }}
            >
              {done ? `✨ ${stone.smooth}` : `🪨 ${stone.rough}`}
            </button>
          );
        })}
      </div>
    </MiniGameFrame>
  );
}
