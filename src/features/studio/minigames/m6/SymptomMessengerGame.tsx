import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'belly', label: '기본', situation: '배가 불편해요' },
  { id: 'head', label: '1단계', situation: '머리가 어지러워요' },
  { id: 'breath', label: '2단계', situation: '숨쉬기 불편해요' },
];
const ZONES = ['머리', '가슴', '배', '다리'];
const FEELINGS = ['아파요', '어지러워요', '답답해요', '뜨거워요'];
const ADULTS = ['선생님', '보건 선생님', '가족'];

export default function SymptomMessengerGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const [zone, setZone] = useState('');
  const [feeling, setFeeling] = useState('');
  const [adult, setAdult] = useState('');
  useEffect(() => {
    setZone('');
    setFeeling('');
    setAdult('');
  }, [game.round, game.stageIndex]);
  const send = () => {
    if (!zone || !feeling || !adult) game.fail('몸 위치·느낌·알릴 사람 카드가 모두 필요해요.');
    else game.succeed(`${adult}에게 “${zone}가 ${feeling}”라고 관찰한 상태를 먼저 알렸어요!`);
  };

  return (
    <MiniGameFrame
      badge="몸 상태 구조 메시지"
      instruction="몸 그림에서 위치를 누르고 느낌과 믿을 만한 어른 카드를 골라 구조 메시지를 보내세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].situation)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={send} emoji="🛟" label="사람에게 알리기" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 표현" />
        )
      }
    >
      <div className="grid min-h-0 flex-1 grid-cols-[110px_1fr] gap-3">
        <div className="flex flex-col justify-center gap-1 rounded-[45px] border-4 border-sky-300 bg-sky-950 p-2">
          {ZONES.map((item) => (
            <button key={item} type="button" onClick={() => setZone(item)} className={`min-h-11 rounded-full border-2 text-[14px] font-black text-white ${zone === item ? 'border-red-300 bg-red-800' : 'border-sky-400 bg-sky-900'}`}>
              {item === '머리' ? '🙂' : item === '가슴' ? '🫁' : item === '배' ? '🟠' : '🦵'} {item}
            </button>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-2">
          <p className="text-[15px] font-black text-white">느낌</p>
          <div className="grid grid-cols-2 gap-1">
            {FEELINGS.map((item) => (
              <button key={item} type="button" onClick={() => setFeeling(item)} className={`min-h-11 rounded-lg border-2 text-[14px] font-black text-white ${feeling === item ? 'border-amber-300 bg-amber-800' : 'border-slate-500 bg-slate-800'}`}>{item}</button>
            ))}
          </div>
          <p className="text-[15px] font-black text-white">알릴 사람</p>
          <div className="flex gap-1">
            {ADULTS.map((item) => (
              <button key={item} type="button" onClick={() => setAdult(item)} className={`min-h-11 flex-1 rounded-lg border-2 px-1 text-[14px] font-black text-white ${adult === item ? 'border-emerald-300 bg-emerald-800' : 'border-slate-500 bg-slate-800'}`}>{item}</button>
            ))}
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
