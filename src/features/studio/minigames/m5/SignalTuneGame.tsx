import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

interface Stage {
  id: string;
  label: string;
  said: string;
  place: string;
  time: string;
  targets: [number, number];
}

const STAGES: Stage[] = [
  { id: 'meet', label: '기본', said: '내일 거기서 만나자', place: '도서관 앞', time: '오후 3시', targets: [2, 1] },
  { id: 'bring', label: '1단계', said: '그 물건 좀 챙겨 줘', place: '파란 상자', time: '두 개', targets: [1, 3] },
  { id: 'show', label: '2단계', said: '아까 그거 다시 보여 줘', place: '행사 사진', time: '오늘 아침', targets: [3, 2] },
];
const TURNS = [0, 90, 180, 270];

export default function SignalTuneGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [wheels, setWheels] = useState<[number, number]>([0, 0]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setWheels([0, 0]);
    setOpen(false);
  }, [game.round, game.stageIndex]);

  const turn = (index: 0 | 1) =>
    setWheels((values) => {
      const next: [number, number] = [values[0], values[1]];
      next[index] = (next[index] + 1) % TURNS.length;
      return next;
    });

  const unlock = () => {
    if (wheels[0] === stage.targets[0] && wheels[1] === stage.targets[1]) {
      setOpen(true);
      game.succeed('빠진 장소와 시간 단서가 홈에 맞아 뜻 자물쇠가 열렸어요!');
    } else {
      game.fail('자물쇠 홈이 아직 어긋나 있어요. 두 단서를 돌려 그림 홈에 맞춰요.');
    }
  };

  return (
    <MiniGameFrame
      badge="뜻 자물쇠 열기"
      instruction="빠진 장소와 시간 바퀴를 눌러 돌리고, 두 홈이 초록 표시와 나란해지면 자물쇠를 여세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].said)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={unlock} emoji="🔐" label="자물쇠 열기" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 맞추기" />
        )
      }
    >
      <div className="rounded-xl border-2 border-amber-300/50 bg-amber-950 px-3 py-2 text-center">
        <p className="text-[15px] font-black text-white">🗣️ “{stage.said}”</p>
        <p className="text-[14px] font-bold text-amber-200">어디와 언제가 빠져 자물쇠가 잠겼어요</p>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center gap-5">
        {([
          ['장소', stage.place],
          ['시간·수량', stage.time],
        ] as const).map(([label, value], index) => {
          const wheelIndex = index as 0 | 1;
          const aligned = wheels[wheelIndex] === stage.targets[wheelIndex];
          return (
            <button
              key={label}
              type="button"
              onClick={() => turn(wheelIndex)}
              disabled={game.status !== 'playing'}
              className={`relative grid h-32 w-32 place-items-center rounded-full border-[8px] text-center text-[14px] font-black text-white transition-transform ${
                aligned ? 'border-emerald-300 bg-emerald-900' : 'border-slate-400 bg-slate-800'
              }`}
              style={{ transform: `rotate(${TURNS[wheels[wheelIndex]]}deg)` }}
              aria-label={`${label} 바퀴 돌리기`}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[28px]" aria-hidden="true">▼</span>
              <span style={{ transform: `rotate(${-TURNS[wheels[wheelIndex]]}deg)` }}>
                <span className="block text-[23px]" aria-hidden="true">{index === 0 ? '📍' : '⏰'}</span>
                {label}
                {aligned && <span className="block text-emerald-200">{value}</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-center text-[54px]" aria-hidden="true">{open ? '🔓' : '🔒'}</div>
    </MiniGameFrame>
  );
}
