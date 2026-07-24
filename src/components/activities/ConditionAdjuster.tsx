import React, { useState } from 'react';
import type { AdjustActivity } from '../../data/canonicalLessons/types';

interface ConditionAdjusterProps {
  activity: AdjustActivity;
  onAdjust?: (state: any) => void;
}

export const ConditionAdjuster: React.FC<ConditionAdjusterProps> = ({ activity, onAdjust }) => {
  const [controlValues, setControlValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    for (const ctrl of activity.controls) {
      if (ctrl.type === 'slider') init[ctrl.id] = ctrl.min ?? 0;
      else if (ctrl.type === 'toggle') init[ctrl.id] = false;
      else if (ctrl.type === 'select') init[ctrl.id] = ctrl.options?.[0]?.value ?? '';
    }
    return init;
  });

  const handleChange = (id: string, val: any) => {
    const next = { ...controlValues, [id]: val };
    setControlValues(next);
    onAdjust?.(next);
  };

  // Find matching state or fallback
  const matchedState = activity.states[0];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">조건 변경 조절기</div>
        {activity.controls.map(ctrl => (
          <div key={ctrl.id} className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex justify-between">
              <span>{ctrl.label}</span>
              <span className="text-indigo-600 font-bold">{String(controlValues[ctrl.id])}</span>
            </label>
            {ctrl.type === 'slider' && (
              <input
                type="range"
                min={ctrl.min ?? 0}
                max={ctrl.max ?? 100}
                value={controlValues[ctrl.id] ?? 0}
                onChange={e => handleChange(ctrl.id, Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            )}
            {ctrl.type === 'toggle' && (
              <button
                type="button"
                onClick={() => handleChange(ctrl.id, !controlValues[ctrl.id])}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition border ${
                  controlValues[ctrl.id]
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {controlValues[ctrl.id] ? 'ON (켜짐)' : 'OFF (꺼짐)'}
              </button>
            )}
            {ctrl.type === 'select' && ctrl.options && (
              <select
                value={controlValues[ctrl.id]}
                onChange={e => handleChange(ctrl.id, e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800"
              >
                {ctrl.options.map(o => (
                  <option key={String(o.value)} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {matchedState && (
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900">결과 관찰</span>
            {matchedState.confidence !== undefined && (
              <span className="text-[11px] font-semibold text-indigo-700">
                가능성: {matchedState.confidence}%
              </span>
            )}
          </div>
          <p className="text-sm text-slate-800 font-medium">{matchedState.resultText}</p>
        </div>
      )}
    </div>
  );
};
