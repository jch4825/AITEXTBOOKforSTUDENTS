import React from 'react';
import type { LessonArtifact, LessonArtifactField } from '../../data/canonicalLessons/types';

interface LessonArtifactBuilderProps {
  artifact: LessonArtifact;
  fieldsData: Record<string, any>;
  onRecordField: (fieldId: string, resp: any) => void;
}

export const LessonArtifactBuilder: React.FC<LessonArtifactBuilderProps> = ({
  artifact,
  fieldsData,
  onRecordField,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-200/80 shadow-xs space-y-4">
      <div className="flex items-center space-x-2 border-b border-indigo-200/60 pb-3">
        <span className="text-2xl" role="img" aria-label="결과물">📜</span>
        <div>
          <h3 className="text-base font-bold text-indigo-950">{artifact.title}</h3>
          <span className="text-xs text-indigo-700 font-medium">포트폴리오 기록: {artifact.portfolioLabel}</span>
        </div>
      </div>

      <div className="space-y-3">
        {artifact.fields.map(field => {
          const currentVal = fieldsData[field.id]?.text || fieldsData[field.id]?.value || '';

          return (
            <div key={field.id} className="p-3 bg-white/90 rounded-xl border border-indigo-100 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex justify-between">
                <span>{field.label}</span>
                {field.required && <span className="text-rose-500 font-normal">*필수</span>}
              </label>

              {field.input === 'text' && (
                <input
                  type="text"
                  value={currentVal}
                  onChange={e => onRecordField(field.id, { mode: 'text', text: e.target.value })}
                  placeholder="내용을 입력하세요..."
                  className="w-full min-h-[44px] px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              )}

              {field.input === 'choice' && (
                <input
                  type="text"
                  value={currentVal}
                  onChange={e => onRecordField(field.id, { mode: 'choice', value: e.target.value, text: e.target.value })}
                  placeholder="선택한 항목을 확인하세요..."
                  className="w-full min-h-[44px] px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              )}

              {field.input === 'speech' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={currentVal}
                    onChange={e => onRecordField(field.id, { mode: 'speech', text: e.target.value })}
                    placeholder="음성 또는 텍스트 입력..."
                    className="flex-1 min-h-[44px] px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                  <button
                    onClick={() => onRecordField(field.id, { mode: 'speech', text: '음성 기록 완료' })}
                    className="min-h-[44px] px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg"
                  >
                    🎙️ 녹음
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
