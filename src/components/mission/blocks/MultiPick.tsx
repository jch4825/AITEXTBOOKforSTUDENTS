import React from 'react';
import type { MultiPickBlock } from '../../../types';
import Icon from '../../Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import { activityColor } from '../../../utils/activityPalette';

interface Props {
  key?: any;
  block: MultiPickBlock;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  accent: string;
}

/** 복수선택 카드 — 게임(CardPick)과 같은 종이 스티커 문법. 선택은 정오가 아니라 "내 고름"이므로 배지 색은 카드 고유색. */
export default function MultiPick({ block, value = [], onChange, accent }: Props) {
  const { speak, speakNow } = useSpeak();

  const handleToggle = (label: string) => {
    const selecting = !value.includes(label);
    const next = selecting ? [...value, label] : value.filter((x) => x !== label);
    onChange(next);
    if (selecting) speak(label); // 고른 카드를 읽어준다 (자동읽기 토글 존중)
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {block.items.map((item, idx) => {
          const isSelected = value.includes(item.label);
          const palette = activityColor(item.label);
          return (
            <button
              key={idx}
              onClick={() => handleToggle(item.label)}
              aria-pressed={isSelected}
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
