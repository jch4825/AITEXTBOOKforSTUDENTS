import React, { useState } from 'react';
import type { MultiChoiceActivity } from '../../data/canonicalLessons/types';

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
        {activity.choices.map(c => {
          const isChosen = selected.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => togglePick(c.id)}
              className={`min-h-[48px] p-3 rounded-xl text-left transition flex items-center justify-between border ${
                isChosen
                  ? 'bg-indigo-50 text-indigo-900 border-indigo-400 font-semibold'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${isChosen ? 'bg-indigo-600 text-white' : 'border border-slate-300'}`}>
                  {isChosen ? '✓' : ''}
                </span>
                {c.emoji && <span className="text-base">{c.emoji}</span>}
                <span className="text-sm">{c.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
