import React from 'react';
import type { SinglePickBlock } from '../../../types';
import Icon from '../../Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import { activityColor } from '../../../utils/activityPalette';

interface Props {
  key?: any;
  block: SinglePickBlock;
  value: string | undefined;
  onChange: (value: string) => void;
  accent: string;
}

/** 단일선택 카드 — 취향·선택을 물을 때만 쓴다(정답 없음). 종이 스티커 문법 + 선택 TTS. */
export default function SinglePick({ block, value = '', onChange, accent }: Props) {
  const { speak, speakNow } = useSpeak();

  const handlePick = (label: string) => {
    onChange(label);
    speak(label); // 고른 카드를 읽어준다
  };

  return (
    <div className="w-full space-y-3 story-fade-in">
      <div className="flex items-start gap-2">
        <p className="text-xl font-semibold flex-1">{block.prompt}</p>
        <button
          type="button"
          onClick={() => speakNow(block.prompt)}
          aria-label="문제 다시 들려주기"
          className="shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: accent, color: accent, background: 'var(--paper-0)' }}
        >
          <Icon name="speaker" size={20} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="radiogroup" aria-label={block.prompt}>
        {block.items.map((item, idx) => {
          const isSelected = value === item.label;
          const palette = activityColor(item.label);
          return (
            <button
              key={idx}
              role="radio"
              aria-checked={isSelected}
              onClick={() => handlePick(item.label)}
              className="card3d relative flex flex-col items-center justify-center gap-2 p-4 rounded-[var(--r-md)] min-h-[120px] text-center select-none font-bold"
              style={{
                border: isSelected ? `4px solid ${palette.accent}` : `2.5px solid ${palette.accent}`,
                background: isSelected ? palette.tint : 'var(--paper-0)',
                color: 'var(--brand-ink)',
                ['--edge' as string]: palette.accent,
              }}
            >
              <span className="text-4xl" aria-hidden>{item.emoji}</span>
              <span className="text-base leading-tight">{item.label}</span>
              {isSelected && (
                <span
                  className="answer-pop absolute -top-2.5 -right-2.5 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-md z-10"
                  style={{ background: palette.accent }}
                >
                  <Icon name="check" size={18} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
