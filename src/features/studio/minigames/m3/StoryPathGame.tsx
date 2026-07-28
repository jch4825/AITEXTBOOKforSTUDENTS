import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'forest', label: '기본', start: '숲에서 길을 잃었어요', icon: '🌲' },
  { id: 'school', label: '1단계', start: '교실에 작은 로봇이 왔어요', icon: '🏫' },
  { id: 'sea', label: '2단계', start: '바닷가에서 상자를 찾았어요', icon: '🌊' },
];
const PIECES = [
  ['친구와 함께', '혼자 용기 내어'],
  ['지도를 펼치고', '소리를 따라가고'],
  ['도움을 찾아 끝', '새 길을 만들어 끝'],
];

export default function StoryPathGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [path, setPath] = useState<(string | null)[]>([null, null, null]);
  useEffect(() => setPath([null, null, null]), [game.round, game.stageIndex]);

  const choose = (slot: number, value: string) => {
    if (game.status !== 'playing') return;
    const next = path.map((piece, index) => (index === slot ? value : piece));
    setPath(next);
    if (next.every(Boolean)) {
      window.setTimeout(() => game.succeed('AI의 조각에 내 선택을 더해 나만의 이야기 길을 만들었어요!'), 150);
    }
  };

  return (
    <MiniGameFrame
      badge="이야기 길 놓기"
      instruction="각 갈림길에서 마음에 드는 돌을 하나씩 놓아 시작부터 나만의 결말까지 길을 이어 보세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].start)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🧩" label="다른 이야기" />}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="text-[32px]" aria-hidden="true">
            {stage.icon}
          </span>
          {path.map((piece, index) => (
            <React.Fragment key={index}>
              <span className="text-[22px] text-amber-300" aria-hidden="true">
                ➡️
              </span>
              <span className="grid min-h-16 flex-1 place-items-center rounded-xl border-2 border-amber-300 bg-slate-800 px-2 text-[14px] font-black text-white">
                {piece ?? '빈 돌'}
              </span>
            </React.Fragment>
          ))}
          <span className="text-[29px]" aria-hidden="true">
            🏁
          </span>
        </div>
        {PIECES.map((choices, slot) => (
          <div key={slot} className="flex gap-2">
            {choices.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => choose(slot, choice)}
                className={`min-h-12 flex-1 rounded-xl border-2 px-2 text-[14px] font-black ${
                  path[slot] === choice
                    ? 'border-emerald-300 bg-emerald-900 text-white'
                    : 'border-slate-500 bg-slate-800 text-slate-100'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        ))}
      </div>
    </MiniGameFrame>
  );
}
