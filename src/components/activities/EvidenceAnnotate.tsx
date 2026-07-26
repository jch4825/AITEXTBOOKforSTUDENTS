import React, { useState } from 'react';
import type { AnnotateActivity } from '../../data/canonicalLessons/types';
import { publicAssetUrl } from '../../utils/publicAssetUrl';

interface EvidenceAnnotateProps {
  activity: AnnotateActivity;
  onAnnotate?: (markers: string[]) => void;
  selectedMarkerIds?: string[];
}

export const EvidenceAnnotate: React.FC<EvidenceAnnotateProps> = ({
  activity,
  onAnnotate,
  selectedMarkerIds = [],
}) => {
  const [selected, setSelected] = useState<string[]>(selectedMarkerIds);

  const toggleMarker = (id: string) => {
    const next = selected.includes(id) ? selected.filter(m => m !== id) : [...selected, id];
    setSelected(next);
    onAnnotate?.(next);
  };

  return (
    <div className="space-y-4">
      {activity.targetImage && (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img src={publicAssetUrl(activity.targetImage)} alt="관찰 대상" className="w-full object-cover max-h-[320px]" />
          {activity.markers.map(m => {
            const isChecked = selected.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleMarker(m.id)}
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] rounded-full p-2 text-xs font-bold transition flex items-center justify-center shadow-md ${
                  isChecked
                    ? 'bg-amber-500 text-white ring-4 ring-amber-200'
                    : 'bg-white/90 text-slate-800 border border-slate-300 hover:bg-white'
                }`}
                title={m.label}
              >
                📍 {m.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">확인할 점선/마커 선택하기</div>
        <div className="flex flex-wrap gap-2">
          {activity.markers.map(m => {
            const isChecked = selected.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleMarker(m.id)}
                className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium border transition ${
                  isChecked
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isChecked ? '✓ ' : '+ '}
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
