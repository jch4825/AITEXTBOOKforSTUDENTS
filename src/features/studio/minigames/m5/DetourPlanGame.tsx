import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'tool', label: '기본', change: '필요한 도구가 사라짐' },
  { id: 'time', label: '1단계', change: '마감 시간이 당겨짐' },
  { id: 'safety', label: '2단계', change: '새 안전 정보가 생김' },
];

export default function DetourPlanGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const [started, setStarted] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [detour, setDetour] = useState<'help' | 'replace' | null>(null);
  useEffect(() => {
    setStarted(false);
    setStopped(false);
    setDetour(null);
  }, [game.round, game.stageIndex]);

  const chooseDetour = (choice: 'help' | 'replace') => {
    if (!stopped) {
      game.fail('바뀐 조건 앞에서 먼저 멈춰야 새 길을 고를 수 있어요.');
      return;
    }
    setDetour(choice);
    game.succeed('중요한 조건이 바뀌자 멈추고 도움·대체가 있는 새 길로 계획을 고쳤어요!');
  };

  return (
    <MiniGameFrame
      badge="계획 길 우회하기"
      instruction="출발하면 길이 막혀요. 먼저 브레이크로 멈춘 뒤 도움 길이나 대체 길로 우회하세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].change)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          started ? (
            <MiniGameButton onClick={() => setStopped(true)} disabled={stopped} emoji="🛑" label="멈추기" variant="primary" />
          ) : (
            <MiniGameButton onClick={() => setStarted(true)} emoji="🚗" label="처음 계획 출발" variant="primary" />
          )
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 출발" />
        )
      }
    >
      <div className="relative min-h-[245px] flex-1 overflow-hidden rounded-xl border-4 border-slate-500 bg-emerald-950">
        <div className="absolute left-[8%] right-[8%] top-1/2 h-8 -translate-y-1/2 bg-slate-600" />
        <span
          className="absolute top-[43%] text-[32px] transition-[left] duration-500"
          style={{ left: started ? (stopped ? '42%' : '46%') : '8%' }}
          aria-hidden="true"
        >
          🚗
        </span>
        {started && (
          <div className="absolute left-[55%] top-[38%] grid h-20 w-20 place-items-center rounded-xl border-4 border-red-300 bg-red-800 text-center text-[14px] font-black text-white">
            🚧
            <span>{STAGES[game.stageIndex].change}</span>
          </div>
        )}
        {stopped && (
          <>
            <button
              type="button"
              onClick={() => chooseDetour('help')}
              className="absolute left-[56%] top-[8%] min-h-14 rounded-xl border-2 border-sky-300 bg-sky-900 px-3 text-[14px] font-black text-white"
            >
              ↗️ 도움 요청 길
            </button>
            <button
              type="button"
              onClick={() => chooseDetour('replace')}
              className="absolute bottom-[8%] left-[56%] min-h-14 rounded-xl border-2 border-amber-300 bg-amber-900 px-3 text-[14px] font-black text-white"
            >
              ↘️ 대체 방법 길
            </button>
          </>
        )}
        {detour && <span className="absolute right-[8%] top-[43%] text-[35px]" aria-hidden="true">🏁</span>}
      </div>
    </MiniGameFrame>
  );
}
