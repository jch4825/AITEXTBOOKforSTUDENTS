import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'room', label: '기본', title: '준비실', fires: [3, 1, 1], water: 7 },
  { id: 'booth', label: '1단계', title: '전시 부스', fires: [2, 4, 1], water: 10 },
  { id: 'hall', label: '2단계', title: '행사장', fires: [4, 2, 2], water: 12 },
];

export default function FirePriorityGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const stage = STAGES[game.stageIndex];
  const [fires, setFires] = useState(stage.fires);
  const [water, setWater] = useState(stage.water);
  const [sprays, setSprays] = useState(0);
  useEffect(() => {
    setFires(stage.fires);
    setWater(stage.water);
    setSprays(0);
  }, [game.round, game.stageIndex, stage.fires, stage.water]);

  const spray = (target: number) => {
    if (game.status !== 'playing' || water <= 0 || fires[target] <= 0) return;
    let next = fires.map((fire, index) => (index === target ? Math.max(0, fire - 1) : fire));
    const nextSprays = sprays + 1;
    if (nextSprays % 2 === 0) {
      const biggest = Math.max(...next);
      const spreadAt = next.findIndex((fire, index) => index !== target && fire === biggest && fire >= 2);
      if (spreadAt >= 0) next = next.map((fire, index) => (index === spreadAt ? fire + 1 : fire));
    }
    const nextWater = water - 1;
    setFires(next);
    setWater(nextWater);
    setSprays(nextSprays);
    if (next.every((fire) => fire === 0)) game.succeed('번지기 쉬운 큰불부터 잡아 물이 떨어지기 전에 모두 껐어요!');
    else if (nextWater <= 0) game.fail('물이 떨어졌는데 불이 남았어요. 번지는 큰불부터 먼저 줄여요.');
  };

  return (
    <MiniGameFrame
      badge="먼저 끌 불 찾기"
      instruction="물통 하나로 세 불을 끄세요. 큰불은 두 번 뿌리는 동안 더 번지니 먼저 줄여야 해요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].title)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🪣" label="물통 다시 채우기" />}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4">
        <div className="flex min-h-[170px] items-end justify-around rounded-xl border-4 border-stone-500 bg-stone-900 p-3">
          {fires.map((fire, index) => (
            <button
              key={index}
              type="button"
              onClick={() => spray(index)}
              disabled={fire <= 0 || game.status !== 'playing'}
              className="grid min-h-14 min-w-20 place-items-end rounded-xl border-2 border-slate-600 bg-slate-800 px-2 pb-2 disabled:opacity-50"
              aria-label={`${index + 1}번 불에 물 뿌리기`}
            >
              <span
                className="transition-all"
                style={{ fontSize: `${22 + fire * 12}px`, lineHeight: 1 }}
                aria-hidden="true"
              >
                {fire > 0 ? '🔥' : '💨'}
              </span>
              <span className="text-[14px] font-black text-white">물 뿌리기</span>
            </button>
          ))}
        </div>
        <div className="flex min-h-12 justify-center gap-1" aria-label="남은 물">
          {Array.from({ length: stage.water }).map((_, index) => (
            <span key={index} className={`text-[23px] ${index < water ? '' : 'opacity-20'}`} aria-hidden="true">💧</span>
          ))}
        </div>
      </div>
    </MiniGameFrame>
  );
}
