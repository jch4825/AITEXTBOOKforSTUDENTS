import React, { useState } from 'react';
import type { MultiChoiceActivity } from '../../data/canonicalLessons/types';
import Burst from '../games/Burst';

interface MultiChoiceProps {
  activity: MultiChoiceActivity;
  onSelect?: (choiceIds: string[]) => void;
  selectedIds?: string[];
}

export const MultiChoiceActivityView: React.FC<MultiChoiceProps> = ({
  activity,
  onSelect,
  selectedIds = [],
}) => {
  const [selected, setSelected] = useState<string[]>(selectedIds);

  const togglePick = (id: string) => {
    const next = selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id];
    setSelected(next);
    onSelect?.(next);
  };

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-700">{activity.prompt}</div>
      <div className="grid grid-cols-1 gap-2">
        {activity.choices.map((c) => {
          const isChosen = selected.includes(c.id);
          const isCorrect = c.isCorrect;

          let cardStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 font-medium';
          if (isChosen) {
            if (isCorrect === true) {
              cardStyle = 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 shadow-md font-bold answer-pop';
            } else if (isCorrect === false) {
              cardStyle = 'bg-red-50 text-red-900 border-2 border-red-500 shadow-md font-bold answer-shake';
            } else {
              cardStyle = 'bg-indigo-50 text-indigo-900 border-indigo-400 font-semibold';
            }
          }

          return (
            <button
              key={c.id}
              onClick={() => togglePick(c.id)}
              className={`relative min-h-[48px] p-3 rounded-xl text-left transition flex items-center justify-between border ${cardStyle}`}
            >
              {isChosen && isCorrect === true && <Burst />}
              <div className="flex items-center space-x-2 z-10">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                  isChosen
                    ? (isCorrect === true ? 'bg-emerald-600 text-white' : isCorrect === false ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white')
                    : 'border border-slate-300'
                }`}>
                  {isChosen ? (isCorrect === false ? '✕' : '✓') : ''}
                </span>
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
