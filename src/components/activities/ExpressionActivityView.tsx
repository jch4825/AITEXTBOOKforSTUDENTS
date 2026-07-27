import React, { useState } from 'react';
import type { ExpressionActivity } from '../../data/canonicalLessons/types';

interface ExpressionActivityProps {
  activity: ExpressionActivity;
  onExpress?: (resp: { mode: string; text?: string; choiceIds?: string[] }) => void;
}

export const ExpressionActivityView: React.FC<ExpressionActivityProps> = ({
  activity,
  onExpress,
}) => {
  const [activeMode, setActiveMode] = useState<string>(activity.modes[0] || 'choice');
  const [text, setText] = useState('');
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  const handleSelectChoice = (id: string) => {
    const next = selectedChoices.includes(id) ? selectedChoices.filter(c => c !== id) : [...selectedChoices, id];
    setSelectedChoices(next);
    onExpress?.({ mode: 'choice', choiceIds: next });
  };

  const handleTextChange = (val: string) => {
    setText(val);
    onExpress?.({ mode: 'text', text: val });
  };

  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold text-slate-700">{activity.prompt}</div>

      {activity.modes.length > 1 && (
        <div className="flex border-b border-slate-200 gap-2 pb-2">
          {activity.modes.map(mode => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMode === mode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {mode === 'choice' && '카드 선택'}
              {mode === 'text' && '글 쓰기'}
              {mode === 'speech' && '말하기'}
              {mode === 'aac' && '그림 카드'}
              {mode === 'draw' && '그리기'}
            </button>
          ))}
        </div>
      )}

      {(activeMode === 'choice' || activeMode === 'aac') && activity.choiceCards && (
        <div className="grid grid-cols-2 gap-2">
          {activity.choiceCards.map(c => {
            const isSelected = selectedChoices.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => handleSelectChoice(c.id)}
                className={`min-h-[48px] p-3 rounded-xl border text-left flex items-center space-x-2 transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c.emoji && <span>{c.emoji}</span>}
                <span className="text-xs font-medium">{c.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {activeMode === 'text' && (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={e => handleTextChange(e.target.value)}
            placeholder="나만의 생각이나 말을 작성해 보세요..."
            maxLength={300}
            className="w-full min-h-[100px] p-3 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
          <div className="text-right text-[11px] text-slate-400">{text.length}/300자</div>
        </div>
      )}

      {activeMode === 'speech' && (
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-center space-y-2">
          <span className="text-3xl" role="img" aria-label="마이크">🎙️</span>
          <p className="text-xs text-indigo-900 font-medium">편하게 마이크로 생각을 말해 보세요.</p>
          <button
            onClick={() => handleTextChange('음성으로 표현함')}
            className="min-h-[44px] px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
          >
            말하기 완료 기록
          </button>
        </div>
      )}
    </div>
  );
};
