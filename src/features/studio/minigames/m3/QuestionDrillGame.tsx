import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'rain', label: '기본', topic: '비는 왜 올까?' },
  { id: 'plant', label: '1단계', topic: '식물은 어떻게 자랄까?' },
  { id: 'robot', label: '2단계', topic: '로봇은 어떻게 움직일까?' },
];
const TARGETS = [24, 54, 84];

export default function QuestionDrillGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [depths, setDepths] = useState<(number | null)[]>([null, null, null]);
  const [active, setActive] = useState<number | null>(null);
  const depthRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setDepths([null, null, null]);
    setActive(null);
    depthRef.current = 0;
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
  }, [game.round, game.stageIndex]);

  const start = (index: number) => {
    if (game.status !== 'playing' || active !== null) return;
    setActive(index);
    depthRef.current = 0;
    timerRef.current = window.setInterval(() => {
      depthRef.current = Math.min(100, depthRef.current + 4);
      setDepths((values) => values.map((value, i) => (i === index ? depthRef.current : value)));
      if (depthRef.current >= 100 && timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    }, 70);
  };

  const stop = (index: number) => {
    if (active !== index) return;
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    setActive(null);
    const next = depths.map((value, i) => (i === index ? depthRef.current : value));
    setDepths(next);
    if (next.every((value) => value !== null)) {
      const hit = next.every((value, i) => Math.abs((value ?? 0) - TARGETS[i]) <= 14);
      if (hit) game.succeed('겉모습·이유·방법까지 서로 다른 깊이의 질문을 찾았어요!');
      else game.fail('보석을 지나쳤어요. 세 질문이 서로 다른 깊이에 닿도록 다시 뚫어 봐요.');
    }
  };

  return (
    <MiniGameFrame
      badge="질문 땅속 탐사"
      instruction="드릴을 누르고 있다가 보석 깊이에서 떼세요. 겉모습·이유·방법을 묻는 세 깊이를 모두 찾습니다."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].topic)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔁" label="다시 탐사" />}
    >
      <p className="mb-2 text-center text-[17px] font-black text-white">“{stage.topic}”</p>
      <div className="flex min-h-0 flex-1 gap-2">
        {['무엇?', '왜?', '어떻게?'].map((label, index) => {
          const depth = depths[index] ?? 0;
          return (
            <button
              key={label}
              type="button"
              onPointerDown={() => start(index)}
              onPointerUp={() => stop(index)}
              onPointerCancel={() => stop(index)}
              onKeyDown={(event) => {
                if ((event.key === ' ' || event.key === 'Enter') && active === null) {
                  event.preventDefault();
                  start(index);
                }
              }}
              onKeyUp={(event) => {
                if (event.key === ' ' || event.key === 'Enter') stop(index);
              }}
              onBlur={() => stop(index)}
              aria-label={`${label} 질문 깊이. 스페이스나 엔터를 누르고 떼어 보세요.`}
              disabled={game.status !== 'playing'}
              className="relative min-h-[210px] flex-1 touch-none overflow-hidden rounded-xl border-2 border-amber-300/60 bg-gradient-to-b from-amber-800 to-stone-950 text-[14px] font-black text-white"
            >
              <span className="absolute inset-x-0 top-2">{label}</span>
              <span
                className="absolute left-1/2 -translate-x-1/2 text-[25px] transition-[top]"
                style={{ top: `${10 + depth * 0.78}%` }}
                aria-hidden="true"
              >
                ⛏️
              </span>
              <span
                className="absolute left-1/2 -translate-x-1/2 text-[23px]"
                style={{ top: `${10 + TARGETS[index] * 0.78}%` }}
                aria-hidden="true"
              >
                💎
              </span>
            </button>
          );
        })}
      </div>
    </MiniGameFrame>
  );
}
