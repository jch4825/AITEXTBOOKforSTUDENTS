import React, { useState } from 'react';
import type { BuildActivity } from '../../data/canonicalLessons/types';

interface PlanBuilderProps {
  activity: BuildActivity;
  onBuild?: (slots: Record<string, string>) => void;
}

export const PlanBuilder: React.FC<PlanBuilderProps> = ({ activity, onBuild }) => {
  const [slotMap, setSlotMap] = useState<Record<string, string>>({});

  const handlePlacePiece = (slotId: string, pieceId: string) => {
    const next = { ...slotMap, [slotId]: pieceId };
    setSlotMap(next);
    onBuild?.(next);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-700">슬롯에 맞는 조각 조립하기</div>
        <div className="space-y-2">
          {activity.slots.map(slot => {
            const placedPieceId = slotMap[slot.id];
            const placedPiece = activity.pieces.find(p => p.id === placedPieceId);
            return (
              <div key={slot.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs font-bold text-slate-700">{slot.label}</div>
                <div className="flex items-center space-x-2">
                  {placedPiece ? (
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-900 font-semibold text-xs border border-indigo-200">
                      {placedPiece.label}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium italic">조각 선택 필요</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
        <div className="text-xs font-semibold text-slate-700">사용 가능한 조각 카드</div>
        <div className="flex flex-wrap gap-2">
          {activity.pieces.map(piece => (
            <div key={piece.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-medium text-slate-800">{piece.label}</div>
              <div className="flex gap-1">
                {activity.slots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => handlePlacePiece(slot.id, piece.id)}
                    className={`min-h-[36px] px-2 text-[11px] rounded font-medium border transition ${
                      slotMap[slot.id] === piece.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot.label}에 놓기
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
