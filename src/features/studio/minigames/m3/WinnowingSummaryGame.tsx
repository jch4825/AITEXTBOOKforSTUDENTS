import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'notice', label: '기본', title: '체험회 안내', chaff: 5 },
  { id: 'story', label: '1단계', title: '긴 이야기', chaff: 7 },
  { id: 'report', label: '2단계', title: '조사 보고서', chaff: 9 },
];

export default function WinnowingSummaryGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [chaff, setChaff] = useState(stage.chaff);
  const [side, setSide] = useState<'left' | 'right' | null>(null);
  useEffect(() => {
    setChaff(stage.chaff);
    setSide(null);
  }, [game.round, game.stageIndex, stage.chaff]);

  const shake = (next: 'left' | 'right') => {
    if (game.status !== 'playing' || side === next) return;
    setSide(next);
    setChaff((amount) => {
      const value = Math.max(0, amount - 1);
      if (value === 0) window.setTimeout(() => game.succeed('가벼운 곁가지는 날아가고 핵심 알맹이가 남았어요!'), 180);
      return value;
    });
  };

  return (
    <MiniGameFrame
      badge="핵심 키질하기"
      instruction="키를 왼쪽과 오른쪽으로 번갈아 흔들어 가벼운 곁가지는 날리고 핵심 알맹이를 남기세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].title)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <>
            <MiniGameButton onClick={() => shake('left')} emoji="⬅️" label="왼쪽으로" />
            <MiniGameButton onClick={() => shake('right')} emoji="➡️" label="오른쪽으로" />
          </>
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 키질" />
        )
      }
    >
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-x-0 top-2 flex flex-wrap justify-center gap-2" aria-hidden="true">
          {Array.from({ length: chaff }).map((_, index) => (
            <span key={index} className="animate-pulse text-[24px]">
              🍂
            </span>
          ))}
        </div>
        <div
          className="mt-10 flex min-h-36 w-[80%] items-end justify-center gap-3 rounded-b-[60px] border-4 border-amber-500 bg-amber-900 p-5 transition-transform"
          style={{ transform: side === 'left' ? 'rotate(-5deg)' : side === 'right' ? 'rotate(5deg)' : 'none' }}
        >
          {['시간', '장소', '준비물'].map((fact) => (
            <span key={fact} className="rounded-full border-2 border-amber-200 bg-amber-300 px-3 py-2 text-[14px] font-black text-amber-950">
              🌾 {fact}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[15px] font-black text-slate-200">
          {chaff > 0 ? '곁가지 잎을 바람에 날려요' : '핵심 세 알만 남았어요'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
