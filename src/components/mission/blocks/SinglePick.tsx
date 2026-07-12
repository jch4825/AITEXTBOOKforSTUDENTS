import React from 'react';
import type { SinglePickBlock } from '../../../types';

interface Props {
  key?: any;
  block: SinglePickBlock;
  value: string | undefined;
  onChange: (value: string) => void;
  accent: string;
}

export default function SinglePick({ block, value = '', onChange, accent }: Props) {
  return (
    <div className="w-full space-y-3 story-fade-in">
      <p className="text-lg font-bold text-neutral-800">{block.prompt}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {block.items.map((item, idx) => {
          const isSelected = value === item.label;
          return (
            <button
              key={idx}
              onClick={() => onChange(item.label)}
              className="flex flex-col items-center justify-center p-4 rounded-[var(--r-md)] border-2 transition-all cursor-pointer h-28 text-center select-none"
              style={{
                borderColor: isSelected ? accent : 'var(--border)',
                background: isSelected ? 'var(--paper-2)' : 'var(--paper-0)',
                boxShadow: isSelected ? 'var(--e-2)' : 'var(--e-1)',
              }}
            >
              <span className="text-3xl mb-2" role="img" aria-label={item.label}>
                {item.emoji}
              </span>
              <span className="text-sm font-bold text-neutral-800 leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
