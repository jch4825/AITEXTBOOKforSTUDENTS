import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'booth', label: '기본', task: '부스 설치', pieces: ['바닥', '책상', '전원', '표지', '점검'] },
  { id: 'show', label: '1단계', task: '학급 발표', pieces: ['주제', '자료', '역할', '연습', '확인'] },
  { id: 'trip', label: '2단계', task: '체험 준비', pieces: ['장소', '시간', '준비물', '도움', '안전'] },
];

export default function TaskCrateBreakGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [hits, setHits] = useState(0);
  useEffect(() => setHits(0), [game.round, game.stageIndex]);
  const hammer = () => {
    if (game.status !== 'playing') return;
    const next = Math.min(stage.pieces.length, hits + 1);
    setHits(next);
    if (next === stage.pieces.length) game.succeed('큰 일 상자를 필요한 작은 과제 조각으로 모두 나눴어요!');
  };

  return (
    <MiniGameFrame
      badge="큰 일 상자 쪼개기"
      instruction="큰 일 상자를 망치로 두드려 순서를 정하기 전 필요한 작은 과제 조각을 모두 꺼내세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].task)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={hammer} emoji="🔨" label="상자 두드리기" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다른 일 나누기" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
        <button
          type="button"
          onClick={hammer}
          className="grid min-h-32 w-52 place-items-center rounded-xl border-4 border-amber-300 bg-amber-800 text-[18px] font-black text-white transition-transform active:scale-95"
          aria-label={`${stage.task} 상자 두드리기`}
        >
          <span className="text-[42px]" aria-hidden="true">{hits === stage.pieces.length ? '💥' : '📦'}</span>
          {stage.task}
        </button>
        <div className="flex min-h-20 flex-wrap justify-center gap-2">
          {stage.pieces.slice(0, hits).map((piece, index) => (
            <span
              key={piece}
              className="grid min-h-14 min-w-20 place-items-center rounded-xl border-2 border-emerald-300 bg-emerald-900 px-3 text-[14px] font-black text-white"
              style={{ transform: `rotate(${index % 2 === 0 ? -3 : 3}deg)` }}
            >
              🧩 {piece}
            </span>
          ))}
        </div>
        <p className="text-center text-[15px] font-black text-slate-200">
          {hits === 0 ? '상자는 아직 너무 커요' : hits < stage.pieces.length ? '안에 과제가 더 있어요' : '필요한 조각이 모두 보여요'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
