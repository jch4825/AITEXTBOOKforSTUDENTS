import { useState } from 'react';
import { PECS_COMMON, PECS_BY_MODULE, PECS_LABELS } from '../data/pecs';
import type { ModuleId } from '../types';

interface Props {
  moduleId: ModuleId;
}

export default function PecsBoard({ moduleId }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const moduleWords = PECS_BY_MODULE[moduleId].filter((w) => !PECS_COMMON.includes(w));
  const words = [...PECS_COMMON, ...moduleWords];

  if (expanded) {
    const label = PECS_LABELS[expanded] ?? expanded;
    return (
      <div className="p-3 w-64 flex flex-col items-center">
        <button
          onClick={() => setExpanded(null)}
          className="w-full aspect-square rounded-[var(--r-md)] flex flex-col items-center justify-center gap-2"
          style={{ background: 'var(--paper-2)' }}
          aria-label={`${label} 카드 닫기`}
        >
          <img
            src={`${import.meta.env.BASE_URL}lessons/pecs/${expanded}.webp`}
            alt=""
            className="w-32 h-32 object-contain"
          />
          <span className="text-xl font-bold">{label}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 w-72">
      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--accent)' }}>PECS 카드</h3>
      <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
        {words.map((w) => (
          <button
            key={w}
            onClick={() => setExpanded(w)}
            className="aspect-square rounded-[var(--r-sm)] flex flex-col items-center justify-center gap-1 p-1"
            style={{ background: 'var(--paper-2)' }}
            aria-label={PECS_LABELS[w] ?? w}
          >
            <img
              src={`${import.meta.env.BASE_URL}lessons/pecs/${w}.webp`}
              alt=""
              className="w-9 h-9 object-contain"
            />
            <span className="text-[10px] font-semibold text-center leading-tight">{PECS_LABELS[w] ?? w}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
