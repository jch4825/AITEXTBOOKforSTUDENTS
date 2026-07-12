import React from 'react';
import type { VowBlock } from '../../../types';

interface Props {
  key?: any;
  block: VowBlock;
  value: string | undefined; // blank input value
  onChange: (value: string) => void;
  studentName: string;
  accent: string;
}

export default function Vow({ block, value = '', onChange, studentName, accent }: Props) {
  // Parse template by splitting on {이름} and {빈칸}
  const parts = block.template.split(/(\{이름\}|\{빈칸\})/g);

  return (
    <div className="w-full p-4 rounded-[var(--r-md)] border-2 border-dashed border-[color:var(--line)] bg-[color:var(--paper-1)] story-fade-in text-center">
      <div className="inline-flex flex-wrap items-center justify-center gap-1.5 text-base sm:text-lg font-bold text-neutral-800 leading-loose">
        {parts.map((part, idx) => {
          if (part === '{이름}') {
            return (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 border border-neutral-300 font-extrabold text-sm"
              >
                {studentName.trim() || '나'}
              </span>
            );
          } else if (part === '{빈칸}') {
            return (
              <input
                key={idx}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="꼭 / 한번 더"
                className="w-28 text-center border-b-2 focus:outline-none focus:border-neutral-800 font-bold px-1 select-text bg-white rounded-t"
                style={{ borderColor: accent }}
                aria-label="빈칸 채우기"
              />
            );
          } else {
            return <span key={idx}>{part}</span>;
          }
        })}
      </div>
    </div>
  );
}
