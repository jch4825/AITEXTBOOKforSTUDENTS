import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

type Place = 'class' | 'online' | 'hidden';
const CARDS = [
  { id: 'nickname', label: '별명', icon: '🙂', correct: ['class', 'online'] as Place[] },
  { id: 'hobby', label: '좋아하는 활동', icon: '🎨', correct: ['class', 'online'] as Place[] },
  { id: 'school', label: '학교 이름', icon: '🏫', correct: ['class'] as Place[] },
  { id: 'contact', label: '연락처', icon: '📱', correct: ['hidden'] as Place[] },
];

export default function AudienceCurtainGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: 1 });
  const [selected, setSelected] = useState('');
  const [places, setPlaces] = useState<Record<string, Place[]>>({});
  useEffect(() => {
    setSelected('');
    setPlaces({});
  }, [game.round]);
  const place = (target: Place) => {
    if (!selected) return;
    setPlaces((value) => {
      const current = value[selected] ?? [];
      return { ...value, [selected]: current.includes(target) ? current.filter((item) => item !== target) : [...current, target] };
    });
  };
  const check = () => {
    const correct = CARDS.every((card) => {
      const actual = [...(places[card.id] ?? [])].sort();
      const expected = [...card.correct].sort();
      return actual.join('|') === expected.join('|');
    });
    if (correct) game.succeed('교실과 온라인 청중에 맞게 공개 범위를 달리한 자기소개를 만들었어요!');
    else game.fail('온라인에는 학교 이름과 연락처를 가리고, 별명과 활동만 보여 줘요.');
  };

  return (
    <MiniGameFrame
      badge="자기소개 공개 커튼"
      instruction="정보 카드를 고른 뒤 교실·온라인·가리기 커튼을 눌러 누구에게 보여 줄지 정하세요. 필요한 곳에는 둘 다 놓을 수 있어요."
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={check} emoji="🎭" label="커튼 열어 확인" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 배치" />
        )
      }
    >
      <div className="grid grid-cols-2 gap-2">
        {CARDS.map((card) => (
          <button key={card.id} type="button" onClick={() => setSelected(card.id)} className={`min-h-14 rounded-xl border-2 text-[14px] font-black text-white ${selected === card.id ? 'border-amber-300 bg-amber-900' : 'border-slate-500 bg-slate-800'}`}>
            {card.icon} {card.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid min-h-0 flex-1 grid-cols-3 gap-2">
        {([
          ['class', '🏫 교실'],
          ['online', '🌐 온라인'],
          ['hidden', '🔒 가리기'],
        ] as const).map(([target, label]) => (
          <button key={target} type="button" onClick={() => place(target)} className="rounded-t-[40px] border-4 border-violet-300 bg-violet-950 p-2 text-[15px] font-black text-white">
            {label}
            <span className="mt-2 flex flex-col gap-1">
              {CARDS.filter((card) => places[card.id]?.includes(target)).map((card) => (
                <span key={card.id} className="rounded-lg bg-white/15 px-1 py-2 text-[14px]">{card.icon} {card.label}</span>
              ))}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-2 rounded-xl border-2 border-emerald-300/60 bg-emerald-950/60 px-3 py-2 text-center" aria-live="polite">
        <p className="text-[14px] font-black text-emerald-200">공개 장면 미리 보기</p>
        <p className="text-[15px] font-black text-white">{selected ? `${CARDS.find((card) => card.id === selected)?.icon} ${CARDS.find((card) => card.id === selected)?.label}의 커튼을 고르는 중이에요.` : '정보 카드를 고르면 교실·온라인 사람들의 표정이 나타나요.'}</p>
      </div>
    </MiniGameFrame>
  );
}
