import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'booth', label: '기본', title: '전시 부스', steps: ['전원선', '벽판', '장식'] },
  { id: 'screen', label: '1단계', title: '화면 설치', steps: ['받침대', '화면', '전원'] },
  { id: 'speaker', label: '2단계', title: '스피커 설치', steps: ['자리', '선 연결', '소리 점검'] },
];
const ICONS = ['🔌', '🧱', '🎀'];

export default function DependencyBuildGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const stage = STAGES[game.stageIndex];
  const [built, setBuilt] = useState<string[]>([]);
  useEffect(() => setBuilt([]), [game.round, game.stageIndex]);

  const build = (step: string) => {
    if (game.status !== 'playing' || built.includes(step)) return;
    const expected = stage.steps[built.length];
    if (step !== expected) {
      game.fail(`${expected} 자리가 막혔어요. 앞 단계가 필요한 이유를 보고 다시 설치해요.`);
      return;
    }
    const next = [...built, step];
    setBuilt(next);
    if (next.length === stage.steps.length) game.succeed('앞 단계가 만든 자리를 따라 막힘 없이 설치했어요!');
  };

  return (
    <MiniGameFrame
      badge="막히지 않는 설치 현장"
      instruction="부품을 눌러 현장에 설치하세요. 앞 부품이 만든 자리 위에 다음 부품을 놓아야 막히지 않아요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].title)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🏗️" label="처음부터 설치" />}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4">
        <div className="flex justify-center gap-2">
          {stage.steps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => build(step)}
              disabled={built.includes(step) || game.status !== 'playing'}
              className="min-h-14 flex-1 rounded-xl border-2 border-amber-300 bg-amber-900 text-[14px] font-black text-white disabled:opacity-45"
            >
              <span className="block text-[25px]" aria-hidden="true">{ICONS[index]}</span>
              {step}
            </button>
          ))}
        </div>
        <div className="relative mx-auto min-h-[170px] w-[88%] overflow-hidden rounded-xl border-4 border-slate-500 bg-slate-900">
          <div className="absolute inset-x-0 bottom-0 h-7 bg-stone-600" />
          {built.map((step, index) => (
            <div
              key={step}
              className="absolute left-1/2 grid h-14 w-40 -translate-x-1/2 place-items-center rounded-xl border-4 border-emerald-300 bg-emerald-900 text-[15px] font-black text-white"
              style={{ bottom: `${24 + index * 45}px` }}
            >
              {ICONS[index]} {step}
            </div>
          ))}
        </div>
      </div>
    </MiniGameFrame>
  );
}
