import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'poster', label: '기본', task: '포스터 대화' },
  { id: 'notice', label: '1단계', task: '안내문 대화' },
  { id: 'plan', label: '2단계', task: '계획표 대화' },
];
const CARS = [
  { id: 'ask', label: '요청', icon: '📝', color: 'border-sky-300 bg-sky-900' },
  { id: 'result', label: '결과', icon: '▶️', color: 'border-violet-300 bg-violet-900' },
  { id: 'fix', label: '수정', icon: '✏️', color: 'border-amber-300 bg-amber-900' },
  { id: 'evidence', label: '근거', icon: '📚', color: 'border-emerald-300 bg-emerald-900' },
  { id: 'decide', label: '결정', icon: '✅', color: 'border-rose-300 bg-rose-900' },
];

export default function ConversationBudgetGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const [train, setTrain] = useState<string[]>([]);
  useEffect(() => setTrain([]), [game.round, game.stageIndex]);

  const couple = (id: string) => {
    if (game.status !== 'playing' || train.includes(id)) return;
    const expected = CARS[train.length].id;
    if (id !== expected) {
      game.fail(`${CARS[train.length].label} 칸이 비어 기차가 이어지지 않아요. 대화가 실제로 흐르는 순서를 봐요.`);
      return;
    }
    const next = [...train, id];
    setTrain(next);
    if (next.length === CARS.length) game.succeed('요청부터 결정까지 다섯 칸이 연결된 한 번의 진짜 대화를 완성했어요!');
  };

  return (
    <MiniGameFrame
      badge="진짜 대화 기차"
      instruction="기관차 뒤에 요청·결과·수정·근거·결정 객차를 실제 대화가 흐르는 순서로 연결하세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].task)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🚂" label="기차 다시 연결" />}
    >
      <div className="flex flex-wrap justify-center gap-2">
        {[...CARS].reverse().map((car) => (
          <button
            key={car.id}
            type="button"
            onClick={() => couple(car.id)}
            disabled={train.includes(car.id) || game.status !== 'playing'}
            className={`min-h-12 rounded-xl border-2 px-3 text-[14px] font-black text-white disabled:opacity-35 ${car.color}`}
          >
            {car.icon} {car.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex min-h-0 flex-1 items-center overflow-x-auto rounded-xl border-4 border-slate-500 bg-slate-950 px-3">
        <div className="grid min-h-24 min-w-28 place-items-center rounded-xl border-4 border-red-300 bg-red-900 text-[15px] font-black text-white">
          <span className="text-[32px]" aria-hidden="true">🚂</span>
          {STAGES[game.stageIndex].task}
        </div>
        {train.map((id) => {
          const car = CARS.find((item) => item.id === id)!;
          return (
            <React.Fragment key={id}>
              <span className="h-3 min-w-5 bg-slate-400" />
              <div className={`grid min-h-20 min-w-24 place-items-center rounded-xl border-4 text-[15px] font-black text-white ${car.color}`}>
                <span className="text-[27px]" aria-hidden="true">{car.icon}</span>{car.label}
              </div>
            </React.Fragment>
          );
        })}
        <span className="ml-3 text-[35px]" aria-hidden="true">{train.length === CARS.length ? '🏁' : '🛤️'}</span>
      </div>
    </MiniGameFrame>
  );
}
