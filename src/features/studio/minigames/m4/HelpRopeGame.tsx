import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'gift', label: '기본', danger: '선물과 비밀을 말한 메시지' },
  { id: 'photo', label: '1단계', danger: '사진을 보내라는 메시지' },
  { id: 'meet', label: '2단계', danger: '혼자 만나자는 메시지' },
];
const STEPS = [
  { label: '멈춤', icon: '✋' },
  { label: '차단', icon: '🛡️' },
  { label: '어른에게 알림', icon: '🛟' },
];

export default function HelpRopeGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const [step, setStep] = useState(0);
  useEffect(() => setStep(0), [game.round, game.stageIndex]);
  const pull = (index: number) => {
    if (index !== step) {
      game.fail('구조 밧줄이 엉켰어요. 먼저 멈춘 뒤 차단하고 어른에게 알려요.');
      return;
    }
    const next = step + 1;
    setStep(next);
    if (next === STEPS.length) game.succeed('멈춤·차단·알리기 밧줄을 이어 믿을 만한 어른에게 닿았어요!');
  };

  return (
    <MiniGameFrame
      badge="도움 밧줄 잇기"
      instruction="위험한 메시지에서 멈춤, 차단, 어른에게 알리기 밧줄을 차례로 당겨 구조선을 완성하세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].danger)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🪢" label="밧줄 다시 잇기" />}
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
        <div className="rounded-xl border-4 border-red-400 bg-red-950 px-4 py-3 text-center text-[16px] font-black text-white">
          ⚠️ {STAGES[game.stageIndex].danger}
        </div>
        <div className="flex w-full items-center justify-center gap-1">
          <span className="text-[33px]" aria-hidden="true">📱</span>
          {STEPS.map((item, index) => (
            <React.Fragment key={item.label}>
              <span className={`h-2 flex-1 rounded ${index < step ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <button
                type="button"
                onClick={() => pull(index)}
                disabled={index < step || game.status !== 'playing'}
                className={`grid min-h-16 min-w-20 place-items-center rounded-xl border-4 text-[14px] font-black text-white ${
                  index < step ? 'border-emerald-300 bg-emerald-900' : 'border-amber-300 bg-slate-800'
                }`}
              >
                <span className="text-[25px]" aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            </React.Fragment>
          ))}
          <span className="text-[33px]" aria-hidden="true">👩‍🏫</span>
        </div>
      </div>
    </MiniGameFrame>
  );
}
