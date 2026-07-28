import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'sky', label: '기본', question: '비가 온 뒤 하늘에 보이는 것은?', answer: '🌈 무지개' },
  { id: 'plant', label: '1단계', question: '식물이 자라려면 필요한 것은?', answer: '☀️ 햇빛과 💧 물' },
  { id: 'safety', label: '2단계', question: '길을 건너기 전에 할 일은?', answer: '👀 좌우 살피기' },
];

export default function ThinkThenRevealGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [thought, setThought] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    setThought(0);
    setRevealed(false);
  }, [game.round, game.stageIndex]);

  const start = () => {
    if (timer.current !== null || revealed) return;
    timer.current = window.setInterval(() => setThought((value) => Math.min(100, value + 5)), 80);
  };
  const stop = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
  };
  const reveal = () => {
    if (thought < 100) {
      game.fail('먼저 생각 풍선을 끝까지 키운 뒤 정답 문을 열어요.');
      return;
    }
    setRevealed(true);
    game.succeed('먼저 떠올린 뒤 정답과 해설을 확인했어요!');
  };

  return (
    <MiniGameFrame
      badge="생각 먼저, 정답 나중"
      instruction="생각하기를 누르고 풍선을 끝까지 키운 뒤에만 정답 문을 열 수 있어요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].question)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <>
            <button
              type="button"
              onPointerDown={start}
              onPointerUp={stop}
              onPointerCancel={stop}
              className="min-h-14 flex-1 touch-none rounded-xl border-2 border-sky-300 bg-sky-900 text-[15px] font-black text-white"
            >
              💭 생각하기
            </button>
            <MiniGameButton onClick={reveal} emoji="🚪" label="정답 열기" variant="primary" />
          </>
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다른 문제" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-[18px] font-black text-white">{stage.question}</p>
        <div
          className="grid place-items-center rounded-full border-4 border-sky-300 bg-sky-900 text-[15px] font-black text-white transition-all"
          style={{ width: 64 + thought * 1.05, height: 64 + thought * 0.55 }}
        >
          {thought >= 100 ? '내 답 준비!' : '생각 중…'}
        </div>
        <div className="grid min-h-20 w-[85%] place-items-center rounded-xl border-4 border-amber-400 bg-amber-950 text-[18px] font-black text-amber-100">
          {revealed ? stage.answer : '🔒 정답은 아직 닫혀 있어요'}
        </div>
      </div>
    </MiniGameFrame>
  );
}
