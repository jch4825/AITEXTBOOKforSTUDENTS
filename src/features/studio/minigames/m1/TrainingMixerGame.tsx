import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

interface Ingredient {
  kind: 'circle' | 'triangle' | 'square';
  emoji: string;
  label: string;
}

const INGREDIENTS: Ingredient[] = [
  { kind: 'circle', emoji: '🔵', label: '동그라미 자료' },
  { kind: 'triangle', emoji: '🔺', label: '세모 자료' },
  { kind: 'square', emoji: '🟨', label: '네모 자료' },
];

const STAGES = [
  { id: 'snack', label: '기본', capacity: 5, needKinds: 2, name: '과자 모양 배우기' },
  { id: 'sign', label: '1단계', capacity: 6, needKinds: 3, name: '표지판 모양 배우기' },
  { id: 'parcel', label: '2단계', capacity: 7, needKinds: 3, name: '상자 모양 배우기' },
];

export default function TrainingMixerGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    status,
    message,
    round,
    goToStage,
    run,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[stageIndex];
  const [bowl, setBowl] = useState<Ingredient[]>([]);
  const [mixing, setMixing] = useState(false);

  useEffect(() => {
    setBowl([]);
    setMixing(false);
  }, [round, stageIndex]);

  const add = (ingredient: Ingredient) => {
    if (status !== 'playing' || bowl.length >= stage.capacity) return;
    setBowl((items) => [...items, ingredient]);
  };

  const mix = () => {
    if (status !== 'playing' || bowl.length < stage.capacity) return;
    run('믹서를 돌려 결과를 봅니다!');
    setMixing(true);
    window.setTimeout(() => {
      setMixing(false);
      const kinds = new Set(bowl.map((item) => item.kind)).size;
      const counts = INGREDIENTS.map(
        (ingredient) => bowl.filter((item) => item.kind === ingredient.kind).length,
      );
      const lopsided = Math.max(...counts) >= stage.capacity - 1;
      if (kinds >= stage.needKinds && !lopsided) {
        succeed('여러 모양을 골고루 배운 결과가 나왔어요!');
      } else {
        fail('한 모양만 너무 많이 들어가 이상한 결과가 나왔어요. 여러 재료를 섞어 봐요.');
      }
    }, 900);
  };

  return (
    <MiniGameFrame
      badge="배움 재료 믹서"
      instruction="빈 칸에 여러 모양 자료를 골고루 넣고 믹서를 돌리세요. 한 모양만 넣으면 결과가 찌그러져요."
      stages={STAGES.slice(0, visibleStageCount)}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].name)}
      status={status}
      message={message}
      actions={
        status === 'playing' ? (
          <>
            <MiniGameButton onClick={() => setBowl([])} emoji="🧺" label="비우기" />
            <MiniGameButton
              onClick={mix}
              disabled={bowl.length < stage.capacity}
              emoji="🌀"
              label="믹서 돌리기"
              variant="primary"
            />
          </>
        ) : (
          <MiniGameButton onClick={retry} emoji="🔁" label="다시 섞기" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        <div className="flex justify-center gap-2">
          {INGREDIENTS.map((ingredient) => (
            <button
              key={ingredient.kind}
              type="button"
              onClick={() => add(ingredient)}
              disabled={status !== 'playing' || bowl.length >= stage.capacity}
              className="min-h-14 flex-1 rounded-xl border-2 border-slate-500 bg-slate-800 text-[14px] font-black text-white disabled:opacity-45"
            >
              <span className="block text-[23px]" aria-hidden="true">
                {ingredient.emoji}
              </span>
              {ingredient.label}
            </button>
          ))}
        </div>

        <div
          className={`relative mx-auto flex min-h-[132px] w-[88%] flex-wrap content-center justify-center gap-2 overflow-hidden rounded-b-[46px] rounded-t-xl border-4 border-slate-400 bg-slate-700 p-4 ${
            mixing ? 'animate-pulse' : ''
          }`}
          aria-label={`믹서 그릇, 재료 ${bowl.length}개`}
        >
          <span className="absolute right-2 top-1 text-[24px]" aria-hidden="true">
            {mixing ? '🌀' : '🥣'}
          </span>
          {Array.from({ length: stage.capacity }).map((_, index) => (
            <span
              key={index}
              className="grid h-11 w-11 place-items-center rounded-lg border-2 border-dashed border-slate-500 bg-slate-900/50 text-[23px]"
              aria-hidden="true"
            >
              {bowl[index]?.emoji ?? ''}
            </span>
          ))}
        </div>

        <p className="text-center text-[15px] font-black text-slate-100">
          {bowl.length < stage.capacity
            ? '빈 칸을 모두 채워 주세요'
            : mixing
              ? '재료가 빙글빙글 섞여요!'
              : '믹서를 돌려 결과를 확인해요'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
