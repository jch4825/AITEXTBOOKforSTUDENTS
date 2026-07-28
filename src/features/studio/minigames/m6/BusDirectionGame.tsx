import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'bus', label: '기본', notice: '오늘 21번 → 동쪽', number: '21', direction: '→' },
  { id: 'metro', label: '1단계', notice: '오늘 3호선 ← 서쪽', number: '3', direction: '←' },
  { id: 'shuttle', label: '2단계', notice: '우회 12번 ↑ 북쪽', number: '12', direction: '↑' },
];

export default function BusDirectionGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [buses, setBuses] = useState([
    { number: stage.number.split('').reverse().join(''), direction: stage.direction },
    { number: stage.number, direction: stage.direction === '→' ? '←' : '→' },
    { number: stage.number, direction: stage.direction },
  ]);
  useEffect(() => {
    setBuses([
      { number: stage.number.split('').reverse().join(''), direction: stage.direction },
      { number: stage.number, direction: stage.direction === '→' ? '←' : '→' },
      { number: stage.number, direction: stage.direction },
    ]);
  }, [game.round, game.stageIndex, stage.number, stage.direction]);

  const board = (bus: (typeof buses)[number]) => {
    if (bus.number === stage.number && bus.direction === stage.direction) game.succeed('번호와 방향을 함께 보고 오늘 공식 공지와 맞는 차를 탔어요!');
    else game.fail('번호나 방향이 공지와 달라요. 타기 전에 두 표시를 함께 봐요.');
  };

  return (
    <MiniGameFrame
      badge="번호·방향 승강장"
      instruction="전광판의 오늘 공식 공지를 보고 같은 번호와 같은 방향이 붙은 차가 지나갈 때 누르세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].notice)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🚌" label="다시 기다리기" />}
    >
      <div className="rounded-xl border-4 border-amber-300 bg-slate-950 px-4 py-3 text-center text-[18px] font-black text-amber-200">
        📢 {stage.notice}
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-hidden">
        {buses.map((bus, index) => (
          <button
            key={`${bus.number}-${bus.direction}-${index}`}
            type="button"
            onClick={() => board(bus)}
            className="relative min-h-16 rounded-xl border-4 border-sky-300 bg-sky-800 text-[18px] font-black text-white motion-safe:animate-[pulse_1.8s_ease-in-out_infinite]"
            style={{ animationDelay: `${index * 0.25}s` }}
          >
            🚌 {bus.number}번 <span className="text-[28px]">{bus.direction}</span>
          </button>
        ))}
      </div>
    </MiniGameFrame>
  );
}
