import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'library', label: '기본', goal: '도서관', sign: 5, blocks: [6, 10] },
  { id: 'clinic', label: '1단계', goal: '보건소', sign: 9, blocks: [5, 6, 11] },
  { id: 'hall', label: '2단계', goal: '체육관', sign: 10, blocks: [2, 6, 7] },
];
const START = 0;
const GOAL = 15;

export default function MapSignRouteGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [path, setPath] = useState<number[]>([START]);
  useEffect(() => setPath([START]), [game.round, game.stageIndex]);

  const visit = (cell: number) => {
    if (game.status !== 'playing' || path.includes(cell) || stage.blocks.includes(cell)) return;
    const last = path[path.length - 1];
    const adjacent =
      Math.abs(Math.floor(last / 4) - Math.floor(cell / 4)) +
        Math.abs((last % 4) - (cell % 4)) ===
      1;
    if (!adjacent) return;
    const next = [...path, cell];
    setPath(next);
    if (cell === GOAL) {
      if (next.includes(stage.sign)) game.succeed('지도 길과 현장 표지를 함께 확인해 안전하게 도착했어요!');
      else game.fail('목적지에는 왔지만 현장 표지를 확인하지 않았어요. 표지 칸을 지나가요.');
    }
  };

  return (
    <MiniGameFrame
      badge="지도와 표지 길 그리기"
      instruction="현재 칸 옆의 길을 눌러 선을 이어 가세요. 막힌 지름길을 피하고 현장 표지 칸을 지나 목적지로 갑니다."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].goal)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🗺️" label="길 다시 그리기" />}
    >
      <div className="mx-auto grid min-h-0 w-full max-w-[330px] flex-1 grid-cols-4 gap-1">
        {Array.from({ length: 16 }).map((_, cell) => {
          const used = path.includes(cell);
          const blocked = stage.blocks.includes(cell);
          return (
            <button
              key={cell}
              type="button"
              onClick={() => visit(cell)}
              disabled={blocked || game.status !== 'playing'}
              className={`min-h-12 rounded-lg border-2 text-[20px] font-black ${
                used
                  ? 'border-sky-200 bg-sky-700 text-white'
                  : blocked
                    ? 'border-red-400 bg-red-950 text-white'
                    : 'border-slate-500 bg-slate-800 text-white'
              }`}
              aria-label={`${cell + 1}번 길 칸`}
            >
              {cell === START ? '🚶' : cell === GOAL ? '🏁' : cell === stage.sign ? '🚸' : blocked ? '🚧' : used ? '●' : ''}
            </button>
          );
        })}
      </div>
    </MiniGameFrame>
  );
}
