import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'rain', label: '기본', weather: '비와 바람', icons: '🌧️💨', need: ['우산', '겉옷'] },
  { id: 'cold', label: '1단계', weather: '춥고 맑음', icons: '☀️🥶', need: ['목도리', '겉옷'] },
  { id: 'hot', label: '2단계', weather: '덥고 햇빛', icons: '☀️🥵', need: ['모자', '물'] },
];
const ITEMS = [
  { name: '우산', icon: '☂️' },
  { name: '겉옷', icon: '🧥' },
  { name: '목도리', icon: '🧣' },
  { name: '모자', icon: '🧢' },
  { name: '물', icon: '💧' },
];

export default function WeatherOutfitGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [worn, setWorn] = useState<string[]>([]);
  const [tested, setTested] = useState(false);
  useEffect(() => {
    setWorn([]);
    setTested(false);
  }, [game.round, game.stageIndex]);
  const test = () => {
    setTested(true);
    if (stage.need.every((item) => worn.includes(item))) game.succeed('지역·날짜가 있는 예보에 맞게 입고 밖에서도 편안해요!');
    else game.fail(stage.weather.includes('비') ? '밖에 나오니 젖거나 추워요. 예보 그림을 다시 봐요.' : '밖에서 덥거나 추워요. 예보와 내 감각에 맞게 더 준비해요.');
  };

  return (
    <MiniGameFrame
      badge="예보 보고 옷 입히기"
      instruction="공식 예보 그림을 보고 준비물을 눌러 입힌 뒤 밖으로 내보내 날씨에 맞는지 확인하세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].weather)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={test} emoji="🚪" label="밖으로 나가기" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 입히기" />
        )
      }
    >
      <div className="flex items-center justify-around rounded-xl border-4 border-sky-300 bg-sky-950 p-3">
        <span className="text-[42px]" aria-hidden="true">{stage.icons}</span>
        <span className="text-[16px] font-black text-white">오늘 공식 예보: {stage.weather}</span>
      </div>
      <div className="my-3 flex justify-center gap-2">
        {ITEMS.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() =>
              setWorn((items) => (items.includes(item.name) ? items.filter((name) => name !== item.name) : [...items, item.name]))
            }
            className={`min-h-14 flex-1 rounded-xl border-2 text-[14px] font-black text-white ${
              worn.includes(item.name) ? 'border-emerald-300 bg-emerald-900' : 'border-slate-500 bg-slate-800'
            }`}
          >
            <span className="block text-[24px]" aria-hidden="true">{item.icon}</span>{item.name}
          </button>
        ))}
      </div>
      <div className="grid min-h-32 flex-1 place-items-center rounded-xl border-4 border-slate-500 bg-gradient-to-b from-sky-800 to-emerald-900">
        <span className="text-[60px]" aria-hidden="true">
          {tested && game.status === 'success' ? '😊' : tested && game.status === 'fail' ? (stage.weather.includes('비') ? '🥶' : '😓') : '🧍'}
        </span>
        <span className="text-center text-[15px] font-black text-white">{worn.join(' · ') || '아직 준비하지 않았어요'}</span>
        <span className="text-center text-[13px] font-bold text-emerald-100">{tested ? (game.status === 'success' ? '밖에 나가도 편안해요. 예보와 준비물이 잘 맞았어요.' : '밖에 나가 보니 불편해요. 준비물을 다시 골라요.') : '준비물을 고르면 밖의 장면이 바뀌어요.'}</span>
      </div>
    </MiniGameFrame>
  );
}
