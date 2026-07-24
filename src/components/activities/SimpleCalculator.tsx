import React, { useState } from 'react';
import type { CalculateActivity } from '../../data/canonicalLessons/types';

interface SimpleCalculatorProps {
  activity: CalculateActivity;
  onCalculate?: (res: number) => void;
}

export const SimpleCalculator: React.FC<SimpleCalculatorProps> = ({ activity, onCalculate }) => {
  const [display, setDisplay] = useState('0');
  const [lastOp, setLastOp] = useState<string | null>(null);

  const handleNum = (n: number) => {
    setDisplay(prev => (prev === '0' ? String(n) : prev + n));
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleEqual = () => {
    const val = Number(display);
    onCalculate?.(val);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 max-w-sm mx-auto shadow-md">
        <div className="text-right text-2xl font-mono tracking-wider px-2 py-1 bg-slate-800 rounded border border-slate-700 min-h-[44px] flex items-center justify-end">
          {display} {activity.unit || ''}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map(n => (
            <button
              key={n}
              onClick={() => handleNum(n)}
              className="min-h-[44px] rounded bg-slate-800 hover:bg-slate-700 font-bold text-lg text-white"
            >
              {n}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="min-h-[44px] rounded bg-rose-600 hover:bg-rose-500 font-bold text-sm text-white"
          >
            C
          </button>
          <button
            onClick={handleEqual}
            className="min-h-[44px] rounded bg-indigo-600 hover:bg-indigo-500 font-bold text-lg text-white col-span-2"
          >
            = (확인)
          </button>
        </div>
      </div>

      {activity.aiProposedResult !== undefined && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="font-bold">🤖 AI가 제시한 풀이 결과: {activity.aiProposedResult} {activity.unit || ''}</div>
          <div>계산기로 계산한 결과와 같은지 꼭 확인해 보세요!</div>
        </div>
      )}
    </div>
  );
};
