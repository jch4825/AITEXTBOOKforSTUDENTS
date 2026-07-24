import React, { useState } from 'react';
import type { SingleChoiceActivity } from '../../data/canonicalLessons/types';
import Burst from '../games/Burst';

interface SingleChoiceProps {
  activity: SingleChoiceActivity;
  onSelect?: (choiceId: string) => void;
  selectedId?: string;
}

export const SingleChoiceActivityView: React.FC<SingleChoiceProps> = ({
  activity,
  onSelect,
  selectedId,
}) => {
  const [selected, setSelected] = useState<string | undefined>(selectedId);

  const handlePick = (id: string) => {
    setSelected(id);
    onSelect?.(id);
  };

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-700">{activity.prompt}</div>
      <div className="grid grid-cols-1 gap-2">
        {activity.choices.map((c) => {
          const isChosen = selected === c.id;
          const isCorrect = c.isCorrect;

          let cardStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 font-medium';
          if (isChosen) {
            if (isCorrect === true) {
              cardStyle = 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 shadow-md font-bold answer-pop';
            } else if (isCorrect === false) {
              cardStyle = 'bg-red-50 text-red-900 border-2 border-red-500 shadow-md font-bold answer-shake';
            } else {
              cardStyle = 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-semibold';
            }
          }

          return (
            <button
              key={c.id}
              onClick={() => handlePick(c.id)}
              className={`relative min-h-[48px] p-3 rounded-xl text-left transition flex items-center justify-between border ${cardStyle}`}
            >
              {isChosen && isCorrect === true && <Burst />}
              <div className="flex items-center space-x-2 z-10">
                {c.emoji && <span className="text-base">{c.emoji}</span>}
                <span className="text-sm">{c.label}</span>
              </div>
              {isChosen && (
                <span className="text-xs font-bold z-10">
                  {isCorrect === true ? '🎉 정답!' : isCorrect === false ? '❌ 다시 생각해 보아요' : '✓ 선택됨'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
