import React, { useState, useEffect } from 'react';
import type { SceneHuntBlock } from '../../../types';
import Icon from '../../Icon';
import { useSpeak } from '../../../hooks/useSpeak';

interface Props {
  key?: any;
  block: SceneHuntBlock;
  value: string[] | undefined; // list of found target labels
  onChange: (value: string[]) => void;
  accent: string;
}

export default function SceneHunt({ block, value = [], onChange, accent }: Props) {
  const { speak, speakNow } = useSpeak();
  const [srcIdx, setSrcIdx] = useState(0);

  const candidates = [
    `${import.meta.env.BASE_URL}lessons/${block.image}.webp`,
    `${import.meta.env.BASE_URL}lessons/png/${block.image}.png`,
  ];

  const handleTargetClick = (label: string) => {
    if (value.includes(label)) return; // Already found

    const nextValue = [...value, label];
    onChange(nextValue);
    const allDone = nextValue.length === block.targets.length;
    speak(allDone ? `${label}. 와, 모두 찾았습니다!` : `${label}. 찾았습니다!`);
  };

  const isAllFound = value.length === block.targets.length;

  return (
    <div className="w-full space-y-4 story-fade-in select-none">
      <div className="flex items-start gap-2">
        <p className="text-xl font-semibold flex-1">{block.prompt}</p>
        <span
          className="text-base font-bold shrink-0 px-3 py-1.5 rounded-[var(--r-pill)]"
          style={{ background: 'var(--paper-2)', color: 'var(--brand-ink)' }}
        >
          {value.length} / {block.targets.length}
        </span>
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

      {/* Target image with hotspot buttons */}
      <div
        className="relative w-full max-w-[500px] mx-auto aspect-square rounded-[var(--r-lg)] overflow-hidden border-2 border-[color:var(--line)]"
        style={{ background: 'var(--paper-2)', boxShadow: 'var(--e-2)' }}
      >
        <img
          src={candidates[srcIdx]}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover blur-md scale-105"
        />
        <img
          src={candidates[srcIdx]}
          alt="탐색할 이미지"
          onError={() => setSrcIdx((i) => Math.min(i + 1, candidates.length))}
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Hotspot buttons */}
        {block.targets.map((target, idx) => {
          const isFound = value.includes(target.label);
          return (
            <button
              key={idx}
              onClick={() => handleTargetClick(target.label)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer flex items-center justify-center transition-all"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.r * 2}%`,
                height: `${target.r * 2}%`,
                // Highlight found items. If not found, it is invisible/interactive.
                border: isFound ? '3px solid var(--ok)' : '2px dashed rgba(43, 58, 85, 0.3)',
                backgroundColor: isFound ? 'rgba(22, 163, 74, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                boxShadow: isFound ? '0 0 10px rgba(22, 163, 74, 0.5)' : 'none',
              }}
              title={target.label}
              aria-label={isFound ? `${target.label} (찾음)` : '여기를 찾아보십시오'}
            >
              {isFound && (
                <span className="answer-pop w-6 h-6 rounded-full bg-[color:var(--paper-0)] flex items-center justify-center shadow-md" style={{ border: '2px solid var(--ok)' }}>
                  <Icon name="star" size={14} filled color="var(--ok)" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Target status labels list */}
      <div className="flex flex-wrap gap-2 justify-center">
        {block.targets.map((target, idx) => {
          const isFound = value.includes(target.label);
          return (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--r-pill)] text-sm font-bold transition-all"
              style={
                isFound
                  ? { background: 'var(--ok-bg)', border: '1.5px solid var(--ok)', color: 'var(--brand-ink)' }
                  : { background: 'var(--paper-1)', border: '1.5px solid var(--line)', color: 'var(--muted)' }
              }
            >
              <Icon
                name="star"
                size={14}
                filled={isFound}
                color={isFound ? 'var(--ok)' : 'currentColor'}
              />
              <span>{target.label}</span>
            </div>
          );
        })}
      </div>

      {isAllFound && (
        <div
          className="answer-pop flex items-center justify-center gap-2 py-3 rounded-[var(--r-md)] font-bold text-lg text-center"
          style={{ background: 'var(--ok-bg)', border: '1px solid var(--ok)', color: 'var(--brand-ink)' }}
        >
          <Icon name="sparkles" size={22} filled color="var(--ok)" />
          찾을 것을 모두 찾았습니다! 대단합니다!
        </div>
      )}
    </div>
  );
}
