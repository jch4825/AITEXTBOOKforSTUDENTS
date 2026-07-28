import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'snack', label: '기본', items: [['🥛', 1800], ['🍞', 2200], ['🍎', 1000]] as const },
  { id: 'school', label: '1단계', items: [['📒', 2500], ['✏️', 1200], ['🧴', 1800]] as const },
  { id: 'trip', label: '2단계', items: [['🎫', 3000], ['🥪', 2800], ['💧', 1200]] as const },
];
const MONEY = [100, 500, 1000, 5000];

export default function CheckoutRegisterGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [scanned, setScanned] = useState<number[]>([]);
  const [paid, setPaid] = useState<number[]>([]);
  useEffect(() => {
    setScanned([]);
    setPaid([]);
  }, [game.round, game.stageIndex]);
  const total = scanned.reduce((sum, index) => sum + stage.items[index][1], 0);
  const payment = paid.reduce((sum, value) => sum + value, 0);

  const finish = () => {
    if (scanned.length < stage.items.length) {
      game.fail('계산대에 아직 찍지 않은 물건이 있어요.');
    } else if (payment !== total) {
      game.fail(payment < total ? '낼 돈이 모자라요. 가격표 합계를 다시 봐요.' : '너무 많이 냈어요. 마지막 돈을 빼요.');
    } else {
      game.succeed('가격표를 모두 찍고 계산한 금액과 낸 돈이 정확히 맞았어요!');
    }
  };

  return (
    <MiniGameFrame
      badge="계산대 찍고 맞추기"
      instruction="물건을 하나씩 계산대에 찍은 뒤 금액 단추로 정확한 돈을 올리고 영수증을 뽑으세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, '계산대로 이동합니다.')}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => setPaid((values) => values.slice(0, -1))} emoji="↩️" label="돈 하나 빼기" />
          <MiniGameButton onClick={finish} emoji="🧾" label="영수증 뽑기" variant="primary" />
        </>
      }
    >
      <div className="flex justify-center gap-2">
        {stage.items.map(([icon, price], index) => (
          <button
            key={`${icon}-${price}`}
            type="button"
            onClick={() => setScanned((items) => (items.includes(index) ? items : [...items, index]))}
            disabled={scanned.includes(index)}
            className="min-h-16 flex-1 rounded-xl border-2 border-sky-300 bg-sky-900 text-[14px] font-black text-white disabled:border-emerald-300 disabled:bg-emerald-900"
          >
            <span className="block text-[25px]" aria-hidden="true">{scanned.includes(index) ? '✅' : icon}</span>
            {price.toLocaleString()}원
          </button>
        ))}
      </div>
      <div className="my-3 flex items-center justify-between rounded-xl border-4 border-slate-500 bg-slate-950 px-4 py-3 text-[16px] font-black text-white">
        <span>🧮 합계 {total.toLocaleString()}원</span>
        <span>💵 낸 돈 {payment.toLocaleString()}원</span>
      </div>
      <div className="flex justify-center gap-1">
        {MONEY.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setPaid((values) => [...values, value])}
            className="min-h-12 flex-1 rounded-lg border-2 border-amber-300 bg-amber-800 text-[14px] font-black text-white"
          >
            +{value.toLocaleString()}
          </button>
        ))}
      </div>
    </MiniGameFrame>
  );
}
