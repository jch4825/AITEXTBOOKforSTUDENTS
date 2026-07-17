import React from 'react';
import type { VowBlock } from '../../../types';
import Icon from '../../Icon';
import { useSpeak } from '../../../hooks/useSpeak';

interface Props {
  key?: any;
  block: VowBlock;
  value: string | undefined; // blank input value
  onChange: (value: string) => void;
  studentName: string;
  accent: string;
}

/** 다짐 문장 — {이름}은 자동, {빈칸}은 학생 입력. 완성 문장을 소리 내어 들을 수 있다. */
export default function Vow({ block, value = '', onChange, studentName, accent }: Props) {
  const { speakNow } = useSpeak();
  const parts = block.template.split(/(\{이름\}|\{빈칸\})/g);
  const name = studentName.trim() || '나';

  const speakVow = () => {
    const sentence = block.template
      .replace('{이름}', name)
      .replace('{빈칸}', value.trim() || '빈칸');
    speakNow(sentence);
  };

  return (
    <div
      className="w-full p-5 rounded-[var(--r-md)] border-[2.5px] border-dashed story-fade-in text-center"
      style={{ borderColor: accent, background: 'var(--paper-1)' }}
    >
      <p className="t-label mb-3" style={{ color: accent }}>나의 다짐</p>
      <div className="inline-flex flex-wrap items-center justify-center gap-1.5 text-lg sm:text-xl font-bold leading-loose" style={{ color: 'var(--brand-ink)' }}>
        {parts.map((part, idx) => {
          if (part === '{이름}') {
            return (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-[var(--r-sm)] font-extrabold"
                style={{ background: 'var(--paper-2)', border: `2px solid ${accent}`, color: accent }}
              >
                {name}
              </span>
            );
          } else if (part === '{빈칸}') {
            return (
              <input
                key={idx}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="여기에 써 보십시오"
                className="w-40 text-center border-b-[3px] font-bold px-1 py-1 text-lg select-text rounded-t"
                style={{ borderColor: accent, background: 'var(--paper-0)', color: 'var(--brand-ink)' }}
                aria-label="빈칸 채우기"
              />
            );
          } else {
            return <span key={idx}>{part}</span>;
          }
        })}
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={speakVow}
          className="btn btn-secondary px-4 text-base"
          style={{ borderColor: accent, color: accent }}
        >
          <Icon name="speaker" size={18} /> 내 다짐 들어보기
        </button>
      </div>
    </div>
  );
}
