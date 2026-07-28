import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'quiet', label: '기본', word: '고요하다', clue: '소리가 거의 없이 조용하다' },
  { id: 'careful', label: '1단계', word: '신중하다', clue: '서두르지 않고 깊이 생각하다' },
  { id: 'vivid', label: '2단계', word: '생생하다', clue: '눈앞에 있는 것처럼 또렷하다' },
];

export default function FogWordRevealGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [cleared, setCleared] = useState<number[]>([]);
  const dragging = useRef(false);

  useEffect(() => setCleared([]), [game.round, game.stageIndex]);

  const clearTile = (index: number) => {
    setCleared((tiles) => {
      if (tiles.includes(index)) return tiles;
      const next = [...tiles, index];
      if (next.length === 12) {
        window.setTimeout(() => game.succeed('문맥과 사전 뜻을 직접 확인해 낱말 안개를 걷었어요!'), 100);
      }
      return next;
    });
  };

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const tile = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('[data-fog-tile]');
    if (tile) clearTile(Number(tile.dataset.fogTile));
  };

  return (
    <MiniGameFrame
      badge="낱말 안개 닦기"
      instruction="손가락이나 마우스로 안개 낀 창을 문질러 문맥과 사전 뜻을 확인하세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].word)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🧽" label="다시 닦기" />}
    >
      <div
        className="relative min-h-[240px] flex-1 touch-none overflow-hidden rounded-xl border-4 border-sky-200 bg-sky-950"
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event);
        }}
        onPointerMove={move}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
          <p className="text-[25px] font-black text-amber-300">{stage.word}</p>
          <p className="text-[17px] font-black text-white">{stage.clue}</p>
          <p className="text-[15px] font-bold text-sky-200">
            문장: 교실이 {stage.word} 친구의 작은 말도 잘 들렸어요.
          </p>
        </div>
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <button
              key={index}
              type="button"
              data-fog-tile={index}
              onClick={() => clearTile(index)}
              aria-label={`안개 ${index + 1} 닦기`}
              className={`border border-white/20 transition-opacity ${
                cleared.includes(index) ? 'pointer-events-none opacity-0' : 'bg-slate-200/85'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-center text-[15px] font-black text-slate-200">
        {cleared.length === 12 ? '✨ 뜻이 또렷하게 보여요' : '창을 끝까지 문질러 보세요'}
      </p>
    </MiniGameFrame>
  );
}
