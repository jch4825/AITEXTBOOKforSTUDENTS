import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'bus', label: '기본', claim: '버스는 9시에 와요' },
  { id: 'meal', label: '1단계', claim: '내일 급식은 카레예요' },
  { id: 'event', label: '2단계', claim: '행사는 금요일이에요' },
];
const BLOCKS = [
  { label: '최신 공식 공지', solid: true, icon: '🧱' },
  { label: '오늘 현장 표지', solid: true, icon: '🧱' },
  { label: '담당자 확인', solid: true, icon: '🧱' },
  { label: '지난달 글', solid: false, icon: '🧊' },
  { label: '누가 썼는지 모름', solid: false, icon: '🧊' },
];

export default function EvidenceTowerGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const stage = STAGES[game.stageIndex];
  const [tower, setTower] = useState<number[]>([]);
  const [shaking, setShaking] = useState(false);
  useEffect(() => {
    setTower([]);
    setShaking(false);
  }, [game.round, game.stageIndex]);

  const shake = () => {
    if (tower.length < 3) return;
    setShaking(true);
    window.setTimeout(() => {
      setShaking(false);
      if (tower.every((index) => BLOCKS[index].solid)) game.succeed('최신 공식 근거로 쌓은 탑이 흔들어도 서 있어요!');
      else game.fail('약한 근거 블록이 녹아 탑이 무너졌어요. 최신 공식 근거로 다시 쌓아요.');
    }, 700);
  };

  return (
    <MiniGameFrame
      badge="근거 탑 흔들기"
      instruction="주장을 받칠 근거 블록 세 개를 쌓고 탑을 흔들어 보세요. 오래되거나 출처 없는 블록은 녹아요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].claim)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <>
            <MiniGameButton onClick={() => setTower([])} emoji="↩️" label="탑 비우기" />
            <MiniGameButton onClick={shake} disabled={tower.length < 3} emoji="🫨" label="흔들어 확인" variant="primary" />
          </>
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 쌓기" />
        )
      }
    >
      <p className="text-center text-[17px] font-black text-amber-300">“{stage.claim}”</p>
      <div className="grid grid-cols-2 gap-2 py-2">
        {BLOCKS.map((block, index) => (
          <button
            key={block.label}
            type="button"
            onClick={() => tower.length < 3 && setTower((items) => [...items, index])}
            disabled={tower.length >= 3 || game.status !== 'playing'}
            className="min-h-12 rounded-xl border-2 border-slate-500 bg-slate-800 px-2 text-[14px] font-black text-white disabled:opacity-50"
          >
            {block.icon} {block.label}
          </button>
        ))}
      </div>
      <div className={`flex min-h-[125px] flex-1 flex-col-reverse items-center justify-start ${shaking ? 'animate-bounce' : ''}`}>
        {tower.map((index, level) => (
          <div
            key={`${index}-${level}`}
            className={`grid h-12 w-44 place-items-center rounded-lg border-2 text-[14px] font-black text-white ${
              BLOCKS[index].solid ? 'border-emerald-300 bg-emerald-900' : 'border-sky-200 bg-sky-800'
            }`}
          >
            {BLOCKS[index].icon} {BLOCKS[index].label}
          </div>
        ))}
      </div>
    </MiniGameFrame>
  );
}
