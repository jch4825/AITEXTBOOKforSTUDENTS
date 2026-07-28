import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'desk', label: '기본', title: '책상 사진' },
  { id: 'walk', label: '1단계', title: '산책 사진' },
  { id: 'club', label: '2단계', title: '동아리 사진' },
];
const CLUES = [
  { label: '내 얼굴', icon: '🙂', risk: true, pos: 'left-[12%] top-[16%]' },
  { label: '이름표', icon: '📛', risk: true, pos: 'right-[14%] top-[20%]' },
  { label: '학교 로고', icon: '🏫', risk: true, pos: 'left-[25%] bottom-[16%]' },
  { label: '집 번호', icon: '🔢', risk: true, pos: 'right-[22%] bottom-[12%]' },
  { label: '화분', icon: '🪴', risk: false, pos: 'left-[48%] top-[48%]' },
];

export default function PrivacyStickerGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const [covered, setCovered] = useState<number[]>([]);
  useEffect(() => setCovered([]), [game.round, game.stageIndex]);
  const scan = () => {
    const missed = CLUES.some((clue, index) => clue.risk && !covered.includes(index));
    if (missed) game.fail('레이더가 아직 개인정보 단서를 찾았어요. 사진을 더 살펴봐요.');
    else game.succeed('나를 알아볼 수 있는 단서를 스티커로 모두 가렸어요!');
  };

  return (
    <MiniGameFrame
      badge="개인정보 스티커 붙이기"
      instruction="사진 속에서 나를 알아볼 수 있는 단서를 찾아 눌러 스티커로 가린 뒤 레이더를 돌리세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].title)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={scan} emoji="📡" label="레이더 검사" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 가리기" />
        )
      }
    >
      <div className="relative min-h-[250px] flex-1 overflow-hidden rounded-xl border-4 border-slate-400 bg-gradient-to-br from-sky-800 to-emerald-900">
        {CLUES.map((clue, index) => {
          const hidden = covered.includes(index);
          return (
            <button
              key={clue.label}
              type="button"
              onClick={() => {
                if (!clue.risk) return;
                setCovered((items) => [...items, index]);
              }}
              className={`absolute ${clue.pos} grid min-h-14 min-w-14 place-items-center rounded-xl border-2 px-2 text-[14px] font-black ${
                hidden
                  ? 'border-fuchsia-200 bg-fuchsia-600 text-white'
                  : clue.risk
                    ? 'border-amber-200 bg-slate-800 text-white'
                    : 'border-emerald-200 bg-emerald-800 text-white'
              }`}
              aria-label={hidden ? `${clue.label} 가림` : clue.label}
            >
              {hidden ? '⭐ 가림' : `${clue.icon} ${clue.label}`}
            </button>
          );
        })}
      </div>
    </MiniGameFrame>
  );
}
