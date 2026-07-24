import React from 'react';
import type { PersistedLessonResponse } from './types';

interface LessonEvidencePanelProps {
  responses: Record<string, PersistedLessonResponse>;
  artifactFields: Record<string, PersistedLessonResponse>;
  changedReason?: PersistedLessonResponse;
}

export const LessonEvidencePanel: React.FC<LessonEvidencePanelProps> = ({
  responses,
  artifactFields,
  changedReason,
}) => {
  const totalCount = Object.keys(responses).length + Object.keys(artifactFields).length;

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <span className="font-bold text-slate-800 flex items-center space-x-1">
          <span>📋</span>
          <span>수행 증거 패널</span>
        </span>
        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
          기록 {totalCount}개
        </span>
      </div>

      <div className="space-y-2">
        {Object.entries(responses).map(([stageId, respObj]) => {
          const resp = respObj as PersistedLessonResponse;
          return (
            <div key={stageId} className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-slate-500 block text-[11px] mb-0.5">단계: {stageId}</span>
              <span className="text-slate-800 font-medium">
                {resp.text || (resp.choiceIds ? resp.choiceIds.join(', ') : String(resp.value ?? '응답 완료'))}
              </span>
            </div>
          );
        })}

        {changedReason && (
          <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
            <span className="font-bold text-amber-800 block text-[11px] mb-0.5">재판단/변경 이유</span>
            <span className="text-amber-950 font-medium">{changedReason.text || String(changedReason.value ?? '')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
