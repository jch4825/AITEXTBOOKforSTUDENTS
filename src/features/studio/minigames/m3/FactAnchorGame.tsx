import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'park', label: '기본', scene: '공원 그림' },
  { id: 'class', label: '1단계', scene: '교실 그림' },
  { id: 'station', label: '2단계', scene: '정류장 그림' },
];
const BUBBLES = [
  { text: '👁️ 빨간 가방이 보여요', fact: true },
  { text: '💭 가방 주인은 급해요', fact: false },
  { text: '👁️ 의자 두 개가 보여요', fact: true },
  { text: '💭 곧 비가 올 거예요', fact: false },
  { text: '👁️ 문이 열려 있어요', fact: true },
  { text: '💭 모두 기분이 좋아요', fact: false },
];

export default function FactAnchorGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const [anchored, setAnchored] = useState<number[]>([]);
  useEffect(() => setAnchored([]), [game.round, game.stageIndex]);

  const anchor = (index: number) => {
    if (game.status !== 'playing' || anchored.includes(index)) return;
    if (!BUBBLES[index].fact) {
      game.fail('생각 구름에는 닻을 내릴 수 없어요. 눈으로 직접 보이는 말만 잡아요.');
      return;
    }
    const next = [...anchored, index];
    setAnchored(next);
    if (next.length === BUBBLES.filter((bubble) => bubble.fact).length) {
      game.succeed('직접 보이는 사실 풍선에만 닻을 내려 단단히 붙잡았어요!');
    }
  };

  return (
    <MiniGameFrame
      badge="사실 풍선 닻 내리기"
      instruction="둥둥 떠다니는 말 중 눈 표시가 있는 직접 보이는 사실을 눌러 닻을 내리세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].scene)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="⚓" label="다시 띄우기" />}
    >
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2">
        {BUBBLES.map((bubble, index) => {
          const fixed = anchored.includes(index);
          return (
            <button
              key={bubble.text}
              type="button"
              onClick={() => anchor(index)}
              disabled={fixed || game.status !== 'playing'}
              className={`relative min-h-20 rounded-[50%] border-2 px-3 text-[14px] font-black transition-transform ${
                fixed
                  ? 'translate-y-2 border-emerald-300 bg-emerald-900 text-white'
                  : 'border-sky-300 bg-sky-900 text-sky-50 motion-safe:animate-pulse'
              }`}
            >
              {bubble.text}
              {fixed && <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[24px]">⚓</span>}
            </button>
          );
        })}
      </div>
    </MiniGameFrame>
  );
}
