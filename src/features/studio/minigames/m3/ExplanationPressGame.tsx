import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'water', label: '기본', title: '물의 순환', facts: ['☀️', '☁️', '🌧️'] },
  { id: 'plant', label: '1단계', title: '식물 성장', facts: ['🌱', '☀️', '💧'] },
  { id: 'signal', label: '2단계', title: '신호 전달', facts: ['📡', '➡️', '📱'] },
];

export default function ExplanationPressGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const stage = STAGES[game.stageIndex];
  const [pressed, setPressed] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setPressed(0);
    if (timer.current !== null) window.clearInterval(timer.current);
  }, [game.round, game.stageIndex]);

  const start = () => {
    if (game.status !== 'playing' || timer.current !== null) return;
    timer.current = window.setInterval(() => setPressed((value) => Math.min(100, value + 3)), 70);
  };
  const stop = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
    if (pressed >= 38 && pressed <= 68) game.succeed('어려운 말은 줄이고 꼭 필요한 사실은 모두 남겼어요!');
    else if (pressed < 38) game.fail('아직 말풍선이 너무 커요. 어려운 말을 조금 더 눌러 줄여 봐요.');
    else game.fail('너무 세게 눌러 꼭 필요한 사실까지 깨졌어요. 조금 일찍 손을 떼요.');
  };

  const width = Math.max(38, 100 - pressed * 0.62);
  const factsVisible = pressed <= 76;

  return (
    <MiniGameFrame
      badge="쉬운 설명 압축기"
      instruction="압축 손잡이를 누르고 있다가 어려운 겉말만 빠지고 핵심 그림이 모두 남았을 때 손을 떼세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].title)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <button
            type="button"
            onPointerDown={start}
            onPointerUp={stop}
            onPointerCancel={stop}
            onKeyDown={(event) => {
              if ((event.key === ' ' || event.key === 'Enter') && timer.current === null) {
                event.preventDefault();
                start();
              }
            }}
            onKeyUp={(event) => {
              if (event.key === ' ' || event.key === 'Enter') stop();
            }}
            onBlur={stop}
            aria-keyshortcuts="Space Enter"
            aria-label="누르고 있다가 떼기. 키보드 스페이스와 엔터도 사용할 수 있어요."
            className="min-h-14 w-full touch-none rounded-xl border-2 border-amber-300 bg-amber-500 text-[15px] font-black text-slate-950"
          >
            🗜️ 누르고 있다가 떼기
          </button>
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 압축" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
        <p className="text-[17px] font-black text-white">{stage.title}</p>
        <div
          className={`flex min-h-[150px] items-center justify-center gap-3 rounded-[40px] border-4 p-4 transition-all ${
            pressed > 76
              ? 'border-red-400 bg-red-950'
              : pressed >= 38
                ? 'border-emerald-400 bg-emerald-950'
                : 'border-sky-400 bg-sky-950'
          }`}
          style={{ width: `${width}%` }}
        >
          {factsVisible ? (
            stage.facts.map((fact) => (
              <span key={fact} className="text-[34px]" aria-hidden="true">
                {fact}
              </span>
            ))
          ) : (
            <span className="text-[40px]" aria-hidden="true">
              💥
            </span>
          )}
        </div>
        <p className="text-center text-[15px] font-black text-slate-200">
          {pressed > 76
            ? '핵심이 깨지고 있어요!'
            : pressed >= 38
              ? '핵심 그림만 또렷하게 남았어요'
              : '어려운 겉말이 아직 부풀어 있어요'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
