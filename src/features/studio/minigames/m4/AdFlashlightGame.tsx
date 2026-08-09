import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'bag', label: '기본', product: '추천 가방' },
  { id: 'game', label: '1단계', product: '추천 게임' },
  { id: 'snack', label: '2단계', product: '추천 간식' },
];
const SIGNS = [
  { x: 18, y: 24, label: '협찬' },
  { x: 76, y: 23, label: '구매 링크' },
  { x: 32, y: 72, label: '무조건 최고' },
  { x: 75, y: 68, label: '빠진 가격' },
];

export default function AdFlashlightGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const [light, setLight] = useState({ x: 50, y: 50 });
  const [found, setFound] = useState<number[]>([]);
  useEffect(() => setFound([]), [game.round, game.stageIndex]);
  const lit = (sign: (typeof SIGNS)[number]) => Math.hypot(sign.x - light.x, sign.y - light.y) < 27;
  const focusSign = (sign: (typeof SIGNS)[number]) => setLight({ x: sign.x, y: sign.y });

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setLight({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <MiniGameFrame
      badge="광고 단서 손전등"
      instruction="어두운 추천 화면에 손전등을 움직여 협찬·구매 링크·과장·빠진 정보를 찾아 누르세요. 끌기 어렵다면 아래 단서 버튼으로 손전등을 옮길 수 있어요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].product)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton
            onClick={() =>
              found.length === SIGNS.length
                ? game.succeed('추천 화면에 숨은 광고 단서를 모두 밝혔어요!')
                : game.fail('손전등을 화면 가장자리까지 더 비춰 봐요.')
            }
            emoji="🔍"
            label="단서 확인"
            variant="primary"
          />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 비추기" />
        )
      }
    >
      <div
        className="relative min-h-[255px] flex-1 touch-none overflow-hidden rounded-xl border-4 border-slate-600 bg-violet-950"
        onPointerMove={move}
        onPointerDown={move}
      >
        <p className="absolute inset-x-0 top-[42%] text-center text-[21px] font-black text-white">
          ⭐ 모두에게 최고인 {STAGES[game.stageIndex].product}! ⭐
        </p>
        {SIGNS.map((sign, index) => (
          <button
            key={sign.label}
            type="button"
            onClick={() => lit(sign) && setFound((items) => (items.includes(index) ? items : [...items, index]))}
            className={`absolute min-h-11 min-w-16 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 px-2 text-[14px] font-black transition-opacity ${
              found.includes(index)
                ? 'border-emerald-200 bg-emerald-700 text-white opacity-100'
                : lit(sign)
                  ? 'border-amber-200 bg-amber-800 text-white opacity-100'
                  : 'opacity-0'
            }`}
            style={{ left: `${sign.x}%`, top: `${sign.y}%` }}
          >
            {found.includes(index) ? `✓ ${sign.label}` : sign.label}
          </button>
        ))}
        <div
          className="board-spotlight-mask pointer-events-none absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-amber-100 bg-amber-100/10"
          style={{ left: `${light.x}%`, top: `${light.y}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5" aria-label="손전등 위치 대체 버튼">
        {SIGNS.map((sign) => <button key={sign.label} type="button" onClick={() => focusSign(sign)} className="min-h-11 rounded-lg border-2 border-amber-200 bg-amber-950 px-2 text-[14px] font-black text-white">🔦 {sign.label} 비추기</button>)}
      </div>
    </MiniGameFrame>
  );
}
