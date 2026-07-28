import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'printer', label: '기본', condition: '프린터 고장' },
  { id: 'screen', label: '1단계', condition: '화면 고장' },
  { id: 'rain', label: '2단계', condition: '야외에 비' },
];
const CARS = [
  { name: '손으로 쓰기', icon: '✍️', speed: 2, safe: 3, cost: 3 },
  { name: '다른 기기 빌리기', icon: '💻', speed: 3, safe: 2, cost: 2 },
  { name: '말로 안내하기', icon: '📣', speed: 4, safe: 1, cost: 4 },
];

export default function AlternativeRaceGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const [selected, setSelected] = useState<number[]>([]);
  const [racing, setRacing] = useState(false);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    setSelected([]);
    setRacing(false);
    setFinished(false);
  }, [game.round, game.stageIndex]);

  const race = () => {
    if (selected.length < 2) return;
    setRacing(true);
    window.setTimeout(() => {
      setRacing(false);
      setFinished(true);
      game.succeed('두 대안을 같은 거리와 같은 짐으로 달려 장단점을 눈으로 비교했어요!');
    }, 1100);
  };

  return (
    <MiniGameFrame
      badge="대안 같은 기준 경주"
      instruction="대안 자동차 두 대 이상을 골라 같은 거리와 같은 짐으로 달리게 하고 도착 모습을 비교하세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].condition)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={race} disabled={selected.length < 2 || racing} emoji="🏁" label="같이 출발" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다른 대안 경주" />
        )
      }
    >
      <p className="text-center text-[16px] font-black text-amber-300">상황: {STAGES[game.stageIndex].condition}</p>
      <div className="flex gap-2 py-2">
        {CARS.map((car, index) => (
          <button
            key={car.name}
            type="button"
            onClick={() =>
              setSelected((items) =>
                items.includes(index) ? items.filter((item) => item !== index) : [...items, index],
              )
            }
            className={`min-h-14 flex-1 rounded-xl border-2 px-1 text-[14px] font-black text-white ${
              selected.includes(index) ? 'border-emerald-300 bg-emerald-900' : 'border-slate-500 bg-slate-800'
            }`}
          >
            {car.icon} {car.name}
          </button>
        ))}
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-around gap-2">
        {selected.map((index) => {
          const car = CARS[index];
          const distance = racing ? 78 : finished ? `${50 + car.speed * 10}` : 4;
          return (
            <div key={car.name} className="relative h-14 rounded-xl border-2 border-dashed border-slate-500 bg-slate-900">
              <span
                className="absolute top-2 text-[28px] transition-[left] duration-1000"
                style={{ left: typeof distance === 'number' ? `${distance}%` : `${distance}%` }}
                aria-hidden="true"
              >
                {car.icon === '✍️' ? '🛒' : car.icon === '💻' ? '🚗' : '🏃'}
              </span>
              <span className="absolute right-2 top-3 text-[24px]" aria-hidden="true">🏁</span>
              {finished && (
                <span className="absolute left-2 top-4 text-[14px] font-black text-slate-200">
                  안정 {car.safe === 3 ? '●●●' : car.safe === 2 ? '●●○' : '●○○'} · 준비 {car.cost === 4 ? '●' : car.cost === 3 ? '●●' : '●●●'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </MiniGameFrame>
  );
}
