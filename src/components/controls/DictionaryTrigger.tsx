import React from 'react';

interface Props {
  onClick: () => void;
}

export default function DictionaryTrigger({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="nav-jelly-btn"
      style={{
        '--border-color': '#ff8787',
        '--shadow-color': '#ffc9c9',
      } as React.CSSProperties}
      title="쉬운 사전 열기"
      aria-label="쉬운 사전 열기"
    >
      <span className="nav-jelly-badge text-[16px]" style={{ background: '#fa5252' }}>
        📖
      </span>
      <span className="font-extrabold text-[color:var(--brand-ink)]">
        사전
      </span>
    </button>
  );
}
