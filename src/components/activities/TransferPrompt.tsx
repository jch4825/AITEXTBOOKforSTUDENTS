import React from 'react';
import type { TransferTask } from '../../data/canonicalLessons/types';

interface TransferPromptProps {
  transfer: TransferTask;
  onCompleteTransfer?: (data: any) => void;
}

export const TransferPrompt: React.FC<TransferPromptProps> = ({ transfer, onCompleteTransfer }) => {
  return (
    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
      <div className="flex items-center space-x-2">
        <span className="text-xl" role="img" aria-label="새 상황에 써 보기">🚀</span>
        <h4 className="text-sm font-bold text-emerald-900">{transfer.title}</h4>
      </div>
      <p className="text-xs text-emerald-800 leading-relaxed">{transfer.scenario}</p>

      <div className="pt-2">
        <button
          onClick={() => onCompleteTransfer?.({ mode: 'choice', text: '새 상황에 써 보기 완료' })}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition depth-paper flex items-center space-x-2"
        >
          <span>새 생활 장상에 적용 완료</span>
          <span>✓</span>
        </button>
      </div>
    </div>
  );
};
