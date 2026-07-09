import { useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import { PECS_COMMON, PECS_BY_MODULE, PECS_LABELS } from '../data/pecs';
import type { ModuleId } from '../types';

interface Props {
  moduleId: ModuleId;
}

/**
 * AAC 카드 보드 — 교실 도구 도크의 의사소통 카드.
 * 카드 이미지 안에 단어가 인쇄되어 있고, 밖의 라벨(PECS_LABELS)은 그 글자와 싱크되어 있다.
 * 카드를 키우면 그 자리에서 인쇄할 수 있다(A4의 1/4=A6 크기, 이미지만 — 단어 중복 방지).
 */
export default function PecsBoard({ moduleId }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const moduleWords = PECS_BY_MODULE[moduleId].filter((w) => !PECS_COMMON.includes(w));
  const words = [...PECS_COMMON, ...moduleWords];
  const src = (w: string) => `${import.meta.env.BASE_URL}lessons/pecs/${w}.webp`;

  if (expanded) {
    const label = PECS_LABELS[expanded] ?? expanded;
    return (
      <div className="p-3 w-64">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setExpanded(null)}
            className="btn btn-ghost h-9 px-2 text-sm"
          ><Icon name="chevron-left" size={18} /> 목록</button>
          <button
            onClick={() => window.print()}
            className="btn btn-secondary h-9 px-3 text-sm"
            aria-label={`${label} 카드 인쇄`}
          ><Icon name="printer" size={18} /> 인쇄</button>
        </div>
        <div
          className="rounded-[var(--r-md)] p-3 flex flex-col items-center gap-2"
          style={{ background: 'var(--paper-2)' }}
        >
          <img src={src(expanded)} alt="" className="w-40 h-40 object-contain" />
          <span className="text-xl font-bold">{label}</span>
        </div>

        {/* 인쇄 전용 — 화면엔 숨김, 인쇄 시 A6(=A4의 1/4)로 카드 이미지만 (단어는 이미지에 있음) */}
        {createPortal(
          <div className="aac-print-card">
            <img src={src(expanded)} alt={label} />
          </div>,
          document.body,
        )}
      </div>
    );
  }

  return (
    <div className="p-3 w-72">
      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--accent)' }}>AAC 카드</h3>
      <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
        {words.map((w) => (
          <button
            key={w}
            onClick={() => setExpanded(w)}
            className="aspect-square rounded-[var(--r-sm)] flex flex-col items-center justify-center gap-1 p-1"
            style={{ background: 'var(--paper-2)' }}
            aria-label={PECS_LABELS[w] ?? w}
          >
            <img src={src(w)} alt="" className="w-9 h-9 object-contain" />
            <span className="text-[10px] font-semibold text-center leading-tight">{PECS_LABELS[w] ?? w}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
