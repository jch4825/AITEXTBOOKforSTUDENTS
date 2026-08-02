import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';
import { AacCardVisual } from '../../../../components/AacCard';
import { EXPRESSION_MESSAGE_AAC_CARDS } from '../../../../data/aacCards';

const STAGES = [
  { id: 'help', label: '기본', message: '도와주세요' },
  { id: 'stop', label: '1단계', message: '싫어요. 멈춰 주세요' },
  { id: 'again', label: '2단계', message: '다시 쉽게 말해 주세요' },
];
const MODES = [
  { id: 'voice', label: '말', icon: '🗣️' },
  { id: 'text', label: '글', icon: '⌨️' },
  { id: 'card', label: '그림 카드', icon: '🖼️' },
];

export default function ExpressionSwitchboardGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const messageCard = EXPRESSION_MESSAGE_AAC_CARDS[stage.id];
  const [mode, setMode] = useState('');
  const [sent, setSent] = useState(false);
  useEffect(() => {
    setMode('');
    setSent(false);
  }, [game.round, game.stageIndex]);
  const send = () => {
    if (!mode) game.fail('나에게 편한 표현 방법 선을 먼저 연결해요.');
    else {
      setSent(true);
      game.succeed('말·글·그림 카드 중 나에게 편한 방법으로 뜻을 분명히 전했어요!');
    }
  };

  return (
    <MiniGameFrame
      badge="내 방식 표현 교환기"
      instruction="말·글·그림 카드 중 편한 선 하나를 연결하고 도움·거절·재설명 메시지를 보내세요. 어떤 방법도 괜찮아요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].message)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={send} emoji="📨" label="메시지 보내기" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다른 방법 써 보기" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
        <div className="flex w-full gap-2">
          {MODES.map((item) => (
            <button key={item.id} type="button" onClick={() => setMode(item.id)} className={`min-h-20 flex-1 rounded-xl border-4 text-[15px] font-black text-white ${mode === item.id ? 'border-emerald-300 bg-emerald-900' : 'border-slate-500 bg-slate-800'}`}>
              <span className="block text-[29px]" aria-hidden="true">{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
        <div className="flex w-full min-h-0 flex-1 items-center justify-center">
          {!mode && (
            <p className="rounded-xl border-2 border-dashed border-slate-500 px-4 py-5 text-center text-[15px] font-bold text-slate-200">
              위에서 편한 표현 방법을 먼저 골라요.
            </p>
          )}
          {mode === 'card' && <AacCardVisual card={messageCard} selected={sent} />}
          {mode === 'voice' && (
            <div className="flex items-center gap-3 rounded-[32px] border-4 border-sky-300 bg-sky-950 px-5 py-4 text-center text-[17px] font-black text-white">
              <span className="text-[30px]" aria-hidden="true">🗣️</span>
              <span>{sent ? `✅ ${stage.message}` : stage.message}</span>
            </div>
          )}
          {mode === 'text' && (
            <div className="rounded-xl border-4 border-slate-300 bg-white px-5 py-4 text-center text-[17px] font-black text-slate-900">
              {sent ? `✅ ${stage.message}` : stage.message}
            </div>
          )}
        </div>
      </div>
    </MiniGameFrame>
  );
}
