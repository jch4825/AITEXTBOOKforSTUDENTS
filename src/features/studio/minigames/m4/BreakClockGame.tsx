import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'study', label: '기본', title: '공부 뒤 쉬기', screens: 4 },
  { id: 'game', label: '1단계', title: '게임 중 쉬기', screens: 5 },
  { id: 'video', label: '2단계', title: '영상 보며 쉬기', screens: 6 },
];

export default function BreakClockGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [breaks, setBreaks] = useState<number[]>([]);
  useEffect(() => setBreaks([]), [game.round, game.stageIndex]);

  const toggle = (gap: number) =>
    setBreaks((items) => (items.includes(gap) ? items.filter((item) => item !== gap) : [...items, gap]));

  const check = () => {
    let run = 0;
    let longest = 0;
    for (let index = 0; index < stage.screens; index += 1) {
      run += 1;
      longest = Math.max(longest, run);
      if (breaks.includes(index)) run = 0;
    }
    if (longest <= 2) game.succeed('화면 시간이 너무 길어지기 전에 쉼표를 넣었어요!');
    else game.fail('화면 블록이 너무 길게 붙어 있어요. 중간에 쉼표를 더 끼워요.');
  };

  return (
    <MiniGameFrame
      badge="멈춤 시계 쉼표"
      instruction="화면 블록 두 개가 이어지기 전에 빈 틈을 눌러 쉼표를 끼우고 시계를 돌려 보세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].title)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={check} emoji="⏰" label="시계 돌리기" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 놓기" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 items-center overflow-x-auto px-2">
        {Array.from({ length: stage.screens }).map((_, index) => (
          <React.Fragment key={index}>
            <div className="grid h-24 min-w-20 place-items-center rounded-xl border-4 border-sky-400 bg-sky-950 text-center text-[14px] font-black text-white">
              🖥️
              <span>화면</span>
            </div>
            {index < stage.screens - 1 && (
              <button
                type="button"
                onClick={() => toggle(index)}
                className={`mx-1 min-h-14 min-w-14 rounded-full border-2 text-[24px] ${
                  breaks.includes(index)
                    ? 'border-emerald-300 bg-emerald-800'
                    : 'border-dashed border-slate-500 bg-slate-900'
                }`}
                aria-label={`${index + 1}번 틈에 쉼표 ${breaks.includes(index) ? '빼기' : '넣기'}`}
              >
                {breaks.includes(index) ? '🧘' : '＋'}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </MiniGameFrame>
  );
}
