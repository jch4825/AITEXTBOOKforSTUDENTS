import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'school', label: '기본', title: '학교 뒤 하루', slots: 6 },
  { id: 'weekend', label: '1단계', title: '주말 하루', slots: 7 },
  { id: 'event', label: '2단계', title: '행사 날', slots: 8 },
];
const BLOCKS = [
  { type: 'task', label: '해야 할 일', icon: '📝', size: 2 },
  { type: 'rest', label: '쉬기', icon: '🧘', size: 1 },
  { type: 'help', label: '도움받기', icon: '🤝', size: 1 },
  { type: 'meal', label: '먹기', icon: '🍚', size: 1 },
];

export default function DayBlockPlannerGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [blocks, setBlocks] = useState<(typeof BLOCKS)[number][]>([]);
  useEffect(() => setBlocks([]), [game.round, game.stageIndex]);
  const used = blocks.reduce((sum, block) => sum + block.size, 0);
  const add = (block: (typeof BLOCKS)[number]) => {
    if (used + block.size > stage.slots) return;
    setBlocks((items) => [...items, block]);
  };
  const check = () => {
    if (used < stage.slots) game.fail('하루 막대에 빈 시간이 있어요. 일·쉼·도움을 함께 넣어요.');
    else if (!['task', 'rest', 'help'].every((type) => blocks.some((block) => block.type === type))) game.fail('해야 할 일만 넣으면 막대가 버티지 못해요. 쉼과 도움도 넣어요.');
    else game.succeed('일·쉼·도움이 함께 들어간 나에게 맞는 하루 막대를 만들었어요!');
  };

  return (
    <MiniGameFrame
      badge="하루 막대 블록 끼우기"
      instruction="일·쉼·도움 블록을 눌러 하루 막대 안에 빈틈없이 끼우세요. 막대 밖으로 넘치면 들어가지 않아요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].title)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => setBlocks((items) => items.slice(0, -1))} emoji="↩️" label="마지막 빼기" />
          <MiniGameButton onClick={check} emoji="🌙" label="하루 확인" variant="primary" />
        </>
      }
    >
      <div className="flex justify-center gap-2">
        {BLOCKS.map((block) => (
          <button key={block.type} type="button" onClick={() => add(block)} className="min-h-14 flex-1 rounded-xl border-2 border-slate-400 bg-slate-800 text-[14px] font-black text-white">
            <span className="block text-[23px]" aria-hidden="true">{block.icon}</span>{block.label}
          </button>
        ))}
      </div>
      <div className="mt-5 flex min-h-24 overflow-hidden rounded-2xl border-4 border-amber-300 bg-slate-950 p-1">
        {blocks.map((block, index) => (
          <div
            key={`${block.type}-${index}`}
            className={`grid place-items-center rounded-xl border-2 text-center text-[14px] font-black text-white ${
              block.type === 'rest' ? 'border-emerald-300 bg-emerald-900' : block.type === 'help' ? 'border-sky-300 bg-sky-900' : 'border-amber-300 bg-amber-900'
            }`}
            style={{ width: `${(block.size / stage.slots) * 100}%` }}
          >
            {block.icon}<span>{block.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[15px] font-black text-slate-200">{used >= stage.slots ? '막대가 꽉 찼어요' : '블록을 더 끼울 자리가 보여요'}</p>
    </MiniGameFrame>
  );
}
