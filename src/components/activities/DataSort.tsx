import React, { useState } from 'react';
import type { SortActivity, SequenceActivity } from '../../data/canonicalLessons/types';

interface DataSortProps {
  activity: SortActivity | SequenceActivity;
  onSort?: (data: any) => void;
}

export const DataSort: React.FC<DataSortProps> = ({ activity, onSort }) => {
  if (activity.kind === 'sequence') {
    const [items, setItems] = useState(() => activity.items);

    const moveItem = (index: number, direction: 'up' | 'down') => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return;
      const next = [...items];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      setItems(next);
      onSort?.(next.map(i => i.id));
    };

    return (
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-700">순서대로 정렬하기</div>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium text-slate-800">{item.label}</span>
              </div>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0}
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-slate-100 disabled:opacity-30 text-slate-700 hover:bg-slate-200 text-sm font-bold"
                  aria-label="위로 이동"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === items.length - 1}
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-slate-100 disabled:opacity-30 text-slate-700 hover:bg-slate-200 text-sm font-bold"
                  aria-label="아래로 이동"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // SortActivity
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const handleAssign = (cardId: string, binId: string) => {
    const next = { ...assignments, [cardId]: binId };
    setAssignments(next);
    onSort?.(next);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activity.bins.map(bin => (
          <div key={bin.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <span>{bin.emoji}</span>
              <span>{bin.label}</span>
            </div>
            <div className="min-h-[60px] p-2 bg-white rounded-lg border border-dashed border-slate-300 space-y-1">
              {activity.cards
                .filter(c => assignments[c.id] === bin.id)
                .map(c => (
                  <div key={c.id} className="px-2 py-1 bg-indigo-50 text-indigo-900 rounded text-xs font-medium border border-indigo-100">
                    {c.label}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
        <div className="text-xs font-semibold text-slate-700">분류할 카드</div>
        <div className="flex flex-wrap gap-2">
          {activity.cards.map(card => {
            const currentBin = assignments[card.id];
            return (
              <div key={card.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-medium text-slate-800">{card.label}</div>
                <div className="flex gap-1">
                  {activity.bins.map(bin => (
                    <button
                      key={bin.id}
                      onClick={() => handleAssign(card.id, bin.id)}
                      className={`min-h-[36px] px-2 text-[11px] rounded font-medium border transition ${
                        currentBin === bin.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {bin.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
