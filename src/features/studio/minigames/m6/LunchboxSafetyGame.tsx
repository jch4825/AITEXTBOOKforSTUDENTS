import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'nut', label: '기본', allergy: '🥜 견과류', blocked: ['쿠키'] },
  { id: 'milk', label: '1단계', allergy: '🥛 우유', blocked: ['치즈'] },
  { id: 'heat', label: '2단계', allergy: '🔥 불 사용 안 함', blocked: ['구운빵'] },
];
const FOODS = [
  { name: '과일', icon: '🍎' },
  { name: '채소', icon: '🥕' },
  { name: '주먹밥', icon: '🍙' },
  { name: '물', icon: '💧' },
  { name: '쿠키', icon: '🍪' },
  { name: '치즈', icon: '🧀' },
  { name: '구운빵', icon: '🍞' },
];

export default function LunchboxSafetyGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [box, setBox] = useState<string[]>([]);
  useEffect(() => setBox([]), [game.round, game.stageIndex]);
  const add = (name: string) => {
    if (box.length >= 4 || box.includes(name)) return;
    setBox((items) => [...items, name]);
  };
  const check = () => {
    if (box.length < 4) game.fail('도시락 칸이 비어 있어요. 안전한 재료를 더 담아요.');
    else if (box.some((name) => stage.blocked.includes(name))) game.fail('알레르기나 도구 조건에 맞지 않는 재료가 들어 있어요.');
    else game.succeed('알레르기·도구·사람 도움 조건에 맞는 안전한 도시락을 완성했어요!');
  };

  return (
    <MiniGameFrame
      badge="안전 도시락 담기"
      instruction="위의 안전 조건을 보고 음식 단추를 눌러 도시락 네 칸에 담은 뒤 뚜껑을 닫으세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].allergy)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => setBox((items) => items.slice(0, -1))} emoji="↩️" label="하나 빼기" />
          <MiniGameButton onClick={check} emoji="🍱" label="뚜껑 닫기" variant="primary" />
        </>
      }
    >
      <div className="rounded-xl border-4 border-red-300 bg-red-950 p-2 text-center text-[16px] font-black text-white">
        안전 조건: {stage.allergy}
      </div>
      <div className="grid grid-cols-4 gap-1 py-3">
        {Array.from({ length: 4 }).map((_, index) => {
          const food = FOODS.find((item) => item.name === box[index]);
          return (
            <div key={index} className="grid min-h-20 place-items-center rounded-xl border-4 border-amber-400 bg-amber-950 text-center text-[14px] font-black text-white">
              <span className="text-[29px]" aria-hidden="true">{food?.icon ?? '⬜'}</span>{food?.name}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {FOODS.map((food) => (
          <button key={food.name} type="button" onClick={() => add(food.name)} className="min-h-11 rounded-lg border-2 border-slate-400 bg-slate-800 px-3 text-[14px] font-black text-white">
            {food.icon} {food.name}
          </button>
        ))}
      </div>
    </MiniGameFrame>
  );
}
