import React, { useState } from 'react';
import type { SingleChoiceActivity } from '../../data/canonicalLessons/types';

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
        {activity.choices.map(c => {
          const isChosen = selected === c.id;
          return (
            <button
              key={c.id}
              onClick={() => handlePick(c.id)}
              className={`min-h-[48px] p-3 rounded-xl text-left transition flex items-center justify-between border ${
                isChosen
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-semibold'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center space-x-2">
                {c.emoji && <span className="text-base">{c.emoji}</span>}
                <span className="text-sm">{c.label}</span>
              </div>
              {isChosen && <span className="text-xs">✓ 선택됨</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
