import React from 'react';

interface Props {
  onClick: () => void;
}

export default function DictionaryTrigger({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="chrome-sticker"
      style={{ '--chrome-tint': 'var(--chrome-dictionary)' } as React.CSSProperties}
      title="쉬운 사전 열기"
      aria-label="쉬운 사전 열기"
    >
      <span className="chrome-sticker-badge text-[16px]" aria-hidden>
        📖
      </span>
      <span className="font-extrabold text-[color:var(--brand-ink)]">
        사전
      </span>
    </button>
  );
}
