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
  const { speakNow } = useSpeak();
  const [srcIdx, setSrcIdx] = useState(0);

  const candidates = [
    `${import.meta.env.BASE_URL}lessons/${block.image}.webp`,
    `${import.meta.env.BASE_URL}lessons/png/${block.image}.png`,
  ];

  const handleTargetClick = (label: string) => {
    if (value.includes(label)) return; // Already found

    const nextValue = [...value, label];
    onChange(nextValue);
    speakNow(`${label}을 찾았습니다!`);
  };

  const isAllFound = value.length === block.targets.length;

  return (
    <div className="w-full space-y-4 story-fade-in select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-lg font-bold text-neutral-800">{block.prompt}</p>
        <span className="text-sm font-bold text-neutral-500 shrink-0">
          찾은 개수: {value.length} / {block.targets.length}
        </span>
      </div>

      {/* Target image with hotspot buttons */}
      <div 
        className="relative w-full max-w-[500px] mx-auto aspect-square rounded-[var(--r-lg)] overflow-hidden border-2 border-neutral-300 shadow-md bg-neutral-100"
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
              aria-label={isFound ? `${target.label} (찾음)` : '여기를 찾아보세요'}
            >
              {isFound && (
                <span className="w-5 h-5 rounded-full bg-[color:var(--paper-0)] border border-emerald-500 flex items-center justify-center shadow-md animate-scaleUp">
                  <Icon name="star" size={12} filled color="var(--ok)" />
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border transition-all
                ${isFound 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-neutral-50 border-neutral-200 text-neutral-400'
                }
              `}
            >
              <Icon 
                name={isFound ? 'star' : 'star'} 
                size={12} 
                filled={isFound} 
                color={isFound ? 'var(--ok)' : 'currentColor'} 
              />
              <span>{target.label}</span>
            </div>
          );
        })}
      </div>

      {isAllFound && (
        <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-800 rounded-[var(--r-md)] border border-emerald-200 font-bold text-center">
          <Icon name="sparkles" size={20} filled color="var(--ok)" />
          그림에서 찾을 것을 모두 찾았습니다! 대단해요!
        </div>
      )}
    </div>
  );
}
