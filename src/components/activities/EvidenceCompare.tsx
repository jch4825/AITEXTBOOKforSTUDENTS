import React from 'react';
import type { CompareActivity, AiCompareActivity } from '../../data/canonicalLessons/types';

interface EvidenceCompareProps {
  activity: CompareActivity | AiCompareActivity;
  onDecision?: (decision: any) => void;
  selectedDecision?: any;
}

export const EvidenceCompare: React.FC<EvidenceCompareProps> = ({
  activity,
  onDecision,
  selectedDecision,
}) => {
  if (activity.kind === 'ai-compare') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 mb-1">{activity.source.title}</div>
            <div className="text-sm text-slate-800 whitespace-pre-wrap">{activity.source.text}</div>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-700">{activity.response.title}</span>
              {activity.response.isPrepared ? (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full">
                  수업용 예시 응답
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                  실시간 AI 응답
                </span>
              )}
            </div>
            <div className="text-sm text-slate-800 whitespace-pre-wrap">{activity.response.text}</div>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-xs font-semibold text-slate-700 mb-2">무엇을 결정할까요?</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'accept', label: '그대로 쓰기', emoji: '✅' },
              { id: 'modify', label: '수정 후 사용', emoji: '✏️' },
              { id: 'reject', label: '거절 (사용 안 함)', emoji: '❌' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => onDecision?.(item.id)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium transition flex items-center space-x-2 border ${
                  selectedDecision === item.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // CompareActivity
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 mb-1">{activity.left.title}</div>
          <div className="text-sm text-slate-800">{activity.left.content}</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 mb-1">{activity.right.title}</div>
          <div className="text-sm text-slate-800">{activity.right.content}</div>
        </div>
      </div>

      {activity.criteria && activity.criteria.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-700">비교 점검 항목</div>
          {activity.criteria.map(c => (
            <div key={c.id} className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-0 text-xs text-slate-700">
              <span>{c.label}</span>
              <span className="font-medium text-indigo-600">비교 완료</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
