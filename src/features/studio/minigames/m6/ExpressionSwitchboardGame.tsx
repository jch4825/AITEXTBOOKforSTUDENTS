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
  { id: 'voice', label: '말', icon: '🗣️', reaction: '상대가 내 목소리를 듣고 고개를 끄덕여요.' },
  { id: 'text', label: '글', icon: '⌨️', reaction: '상대가 문장을 천천히 읽고 기다려 줘요.' },
  { id: 'card', label: '그림 카드', icon: '🖼️', reaction: '상대가 그림 뜻을 확인하고 바로 도와줘요.' },
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
    if (!mode) game.fail('나에게 편한 표현 방법 카드를 먼저 골라요.');
    else {
      setSent(true);
      const selectedMode = MODES.find((item) => item.id === mode);
      game.succeed(`메시지가 상대에게 도착했어요. ${selectedMode?.reaction ?? ''}`);
    }
  };

  return (
    <MiniGameFrame
      badge="내 방식 표현 교환기"
      instruction="말·글·그림 카드 중 편한 표현 카드를 골라 상대에게 전달하세요. 전달 방법이 바뀌면 상대의 반응 장면도 달라집니다."
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
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
        <div className="w-full rounded-xl border-2 border-amber-300/60 bg-amber-950/45 px-3 py-2 text-center">
          <p className="text-[14px] font-black text-amber-200">지금 전할 뜻</p>
          <p className="text-[16px] font-black text-white">{stage.message}</p>
        </div>
        <div className="flex w-full gap-2">
          {MODES.map((item) => (
            <button key={item.id} type="button" aria-pressed={mode === item.id} onClick={() => game.status === 'playing' && setMode(item.id)} className={`min-h-20 flex-1 rounded-xl border-4 text-[15px] font-black text-white ${mode === item.id ? 'border-emerald-300 bg-emerald-900' : 'border-slate-500 bg-slate-800'}`}>
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
        <div className={`w-full rounded-xl border-2 px-3 py-2 text-center ${sent ? 'border-emerald-300 bg-emerald-950/70' : 'border-slate-600 bg-slate-900/60'}`} aria-live="polite">
          <span className="block text-[14px] font-black text-slate-300">상대의 반응 장면</span>
          <span className="block text-[15px] font-black text-white">{sent ? MODES.find((item) => item.id === mode)?.reaction : '표현 방법을 고르면 상대가 기다릴 준비를 해요.'}</span>
        </div>
      </div>
    </MiniGameFrame>
  );
}
