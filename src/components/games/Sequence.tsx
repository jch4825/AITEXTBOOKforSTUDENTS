import React, { useEffect, useState, useMemo } from 'react';
import { useSpeak } from '../../hooks/useSpeak';
import Icon from '../Icon';
import ActivityIcon from '../ActivityIcon';
import Burst from './Burst';
import { activityColor } from '../../utils/activityPalette';
import type { Difficulty } from '../../types';

export interface SequenceItem {
  label: string;
  icon?: string;
}

interface Props {
  instruction: string;
  items: SequenceItem[];
  difficulty: Difficulty;
  onComplete: () => void;
}

export default function Sequence({ instruction, items, difficulty, onComplete }: Props) {
  const [placedCount, setPlacedCount] = useState(0);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  
  // Sync state when items change
  useEffect(() => {
    setPlacedCount(0);
    setWrongIdx(null);
  }, [items]);

  // shuffle once per mount / items change
  const shuffleOrder = useMemo(() => shuffleAvoidingIdentity(items.length), [items]);

  const { speak } = useSpeak();

  const done = placedCount === items.length;

  function clickCard(shuffleIdx: number) {
    if (done) return;
    const origIdx = shuffleOrder[shuffleIdx];
    if (origIdx < placedCount) return; // already placed
    
    if (origIdx === placedCount) {
      const next = placedCount + 1;
      setPlacedCount(next);
      setWrongIdx(null);
      if (next === items.length) {
        speak('와, 순서를 다 맞췄어요!');
        setTimeout(onComplete, 800);
      } else {
        speak('맞아요!');
      }
    } else {
      speak('다시 생각해봐요.');
      setWrongIdx(shuffleIdx);
      setTimeout(() => setWrongIdx(null), 600);
    }
  }

  return (
    <div className="my-6">
      <p className="text-lg font-semibold mb-4">{instruction}</p>

      {/* Slots */}
      <ol className="space-y-2 mb-6">
        {items.map((item, i) => {
          const isFilled = i < placedCount;
          const palette = isFilled ? activityColor(item.icon ?? item.label) : null;
          return (
            <li
              key={item.label}
              className="p-3 rounded-[var(--r-md)] border-2 text-lg font-bold flex items-center justify-between"
              style={
                isFilled
                  ? { borderColor: 'var(--ok)', background: palette?.tint, color: 'var(--brand-ink)' }
                  : { borderColor: 'var(--border)', borderStyle: 'dashed', color: 'var(--muted)' }
              }
            >
              {isFilled ? (
                <span className="inline-flex items-center gap-2">
                  <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs">{i + 1}</span>
                  {difficulty === 'easy' && item.icon && (
                    <ActivityIcon icon={item.icon} size={28} />
                  )}
                  {item.label}
                </span>
              ) : (
                <span>{i + 1}. ─</span>
              )}
              {isFilled && <Icon name="check" size={18} strokeWidth={2.5} />}
            </li>
          );
        })}
      </ol>

      {/* Shuffled choices */}
      {!done && (
        <div className="grid grid-cols-2 gap-3">
          {shuffleOrder.map((origIdx, shuffleIdx) => {
            const item = items[origIdx];
            if (!item) return null; // Safe guard
            const used = origIdx < placedCount;
            const isWrong = wrongIdx === shuffleIdx;
            const palette = activityColor(item.icon ?? item.label);

            let borderStyle = `2.5px solid ${palette.accent}`;
            let extraClass = '';
            
            if (isWrong) {
              borderStyle = '4px solid var(--warn)';
              extraClass = 'answer-shake';
            } else if (used) {
              borderStyle = '2px solid var(--ok)';
            }

            return (
              <button
                key={item.label}
                onClick={() => clickCard(shuffleIdx)}
                disabled={used}
                className={`card3d relative rounded-[var(--r-md)] p-5 text-lg font-bold flex flex-col items-center justify-center gap-2 disabled:opacity-40 min-h-[150px] ${extraClass}`}
                style={{
                  background: 'var(--paper-0)',
                  color: 'var(--brand-ink)',
                  border: borderStyle,
                  ['--edge' as string]: palette.accent,
                }}
              >
                {difficulty === 'easy' && item.icon && (
                  <ActivityIcon icon={item.icon} size={92} className="mb-1" />
                )}
                <span>{item.label}</span>

                {/* Badges */}
                {used && (
                  <span
                    className="answer-pop absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-white shadow"
                    style={{ background: 'var(--ok)' }}
                  >
                    <Icon name="check" size={16} strokeWidth={3} />
                  </span>
                )}
                {isWrong && (
                  <span
                    className="absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-white shadow"
                    style={{ background: 'var(--warn)' }}
                  >
                    <Icon name="close" size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {done && (
        <p className="text-xl font-bold flex items-center justify-center gap-2" style={{ color: 'var(--ok)' }}>
          <Burst />
          <Icon name="sparkles" size={24} filled /> 순서를 다 맞췄어요!
        </p>
      )}
    </div>
  );
}

function shuffleAvoidingIdentity(n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  if (n < 2) return order;
  do {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  } while (order.every((v, i) => v === i));
  return order;
}
