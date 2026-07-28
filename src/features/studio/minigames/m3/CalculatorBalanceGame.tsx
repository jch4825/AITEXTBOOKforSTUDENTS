import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'snack', label: '기본', target: 4500, title: '간식 합계' },
  { id: 'book', label: '1단계', target: 7200, title: '책과 공책 합계' },
  { id: 'trip', label: '2단계', target: 9800, title: '체험 준비 합계' },
];
const COINS = [100, 500, 1000, 2000];

export default function CalculatorBalanceGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [coins, setCoins] = useState<number[]>([]);
  useEffect(() => setCoins([]), [game.round, game.stageIndex]);
  const total = coins.reduce((sum, coin) => sum + coin, 0);
  const tilt = Math.max(-12, Math.min(12, ((total - stage.target) / stage.target) * 24));

  const check = () => {
    if (total === stage.target) game.succeed('예상한 합계와 계산기 쪽 저울이 정확히 맞았어요!');
    else if (total < stage.target) game.fail('계산기 쪽이 가벼워요. 빠진 금액을 더 올려요.');
    else game.fail('계산기 쪽이 너무 무거워요. 마지막 금액을 덜어 내요.');
  };

  return (
    <MiniGameFrame
      badge="계산 확인 저울"
      instruction="금액 단추를 여러 번 눌러 계산기 접시에 올리고, 예상 합계와 저울이 수평이 되게 하세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].title)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => setCoins((values) => values.slice(0, -1))} emoji="↩️" label="하나 빼기" />
          <MiniGameButton onClick={check} emoji="⚖️" label="저울 확인" variant="primary" />
        </>
      }
    >
      <p className="text-center text-[18px] font-black text-amber-300">
        예상 합계 {stage.target.toLocaleString()}원
      </p>
      <div className="flex justify-center gap-1 py-2">
        {COINS.map((coin) => (
          <button
            key={coin}
            type="button"
            onClick={() => setCoins((values) => [...values, coin])}
            className="min-h-12 flex-1 rounded-full border-2 border-amber-300 bg-amber-700 text-[14px] font-black text-white"
          >
            +{coin.toLocaleString()}
          </button>
        ))}
      </div>
      <div className="relative mt-4 min-h-[145px] flex-1">
        <div
          className="absolute left-[10%] right-[10%] top-12 h-3 rounded bg-slate-300 transition-transform"
          style={{ transform: `rotate(${tilt}deg)` }}
        >
          <div className="absolute -left-5 top-2 grid min-h-16 w-32 place-items-center rounded-b-3xl border-4 border-slate-300 bg-slate-800 text-[15px] font-black text-white">
            🧾 {stage.target.toLocaleString()}원
          </div>
          <div className="absolute -right-5 top-2 grid min-h-16 w-32 place-items-center rounded-b-3xl border-4 border-slate-300 bg-slate-800 px-1 text-center text-[14px] font-black text-white">
            🧮 {total.toLocaleString()}원
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 h-20 w-5 -translate-x-1/2 bg-slate-400" />
      </div>
    </MiniGameFrame>
  );
}
