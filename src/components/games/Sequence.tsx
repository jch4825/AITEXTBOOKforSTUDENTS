import { useEffect, useState, useMemo } from 'react';
import { useSpeak } from '../../hooks/useSpeak';
import Icon from '../Icon';
import Button from '../Button';
import ActivityIcon from '../ActivityIcon';
import Burst from './Burst';
import { activityColor } from '../../utils/activityPalette';
import { resolveActivityIcon } from '../../utils/activityIconResolver';
import type { Difficulty } from '../../types';
import ActivitySpread from '../lesson/ActivitySpread';

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

  // 처음부터 다시 — 지금까지 놓은 순서를 모두 지우고 처음부터 다시 놓는다.
  function restart() {
    setPlacedCount(0);
    setWrongIdx(null);
  }

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

  const questionNode = (
    <div className="space-y-4">
      {/* Slots */}
      <ol className="space-y-2">
        {items.map((item, i) => {
          const isFilled = i < placedCount;
          const icon = resolveActivityIcon(item.icon, item.label);
          const palette = isFilled ? activityColor(icon ?? item.label) : null;
          return (
            <li
              key={item.label}
              className="p-3 rounded-[var(--r-md)] border text-base font-bold flex items-center justify-between"
              style={
                isFilled
                  ? { borderColor: 'var(--ok)', background: `color-mix(in srgb, var(--ok) 8%, var(--paper-0))`, color: 'var(--brand-ink)' }
                  : { borderColor: 'var(--border)', borderStyle: 'dashed', color: 'var(--muted)' }
              }
            >
              {isFilled ? (
                <span className="inline-flex items-center gap-2">
                  <span className="bg-white/40 rounded-full w-6 h-6 flex items-center justify-center text-xs">{i + 1}</span>
                  {difficulty === 'easy' && icon && (
                    <ActivityIcon icon={icon} size={28} />
                  )}
                  {item.label}
                </span>
              ) : (
                <span className="opacity-70">{i + 1}. ─</span>
              )}
              {isFilled && <Icon name="check" size={18} strokeWidth={2.5} />}
            </li>
          );
        })}
      </ol>
    </div>
  );

  const characterReaction = {
    id: 'aimi' as const,
    expression: done ? 'cheer' as const : (placedCount > 0 ? 'wink' as const : 'curious' as const),
    text: done
      ? '대단해! 순서를 모두 맞췄어!'
      : (wrongIdx !== null ? '순서가 조금 다른 것 같아. 다시 생각해볼까?' : '알맞은 순서대로 카드를 눌러봐!')
  };

  return (
    <ActivitySpread
      kicker="순서대로 눌러봐요!"
      title={instruction}
      accent="var(--accent)"
      character={characterReaction}
      questionNode={questionNode}
    >
      <div className="space-y-6">
        {/* Shuffled choices */}
        {!done && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shuffleOrder.map((origIdx, shuffleIdx) => {
              const item = items[origIdx];
              if (!item) return null; // Safe guard
              const icon = resolveActivityIcon(item.icon, item.label);
              const used = origIdx < placedCount;
              const isWrong = wrongIdx === shuffleIdx;
              const palette = activityColor(icon ?? item.label);

              let borderStyle = `1px solid color-mix(in srgb, ${palette.accent} 30%, var(--line))`;
              let bgColor = 'var(--paper-0)';
              let extraClass = '';

              if (isWrong) {
                borderStyle = '2px solid var(--warn)';
                bgColor = 'color-mix(in srgb, var(--warn) 8%, var(--paper-0))';
                extraClass = 'answer-shake';
              } else if (used) {
                borderStyle = '1px solid var(--ok)';
                bgColor = 'color-mix(in srgb, var(--ok) 8%, var(--paper-0))';
              }

              return (
                <button
                  key={item.label}
                  onClick={() => clickCard(shuffleIdx)}
                  disabled={used}
                  className={`relative rounded-[var(--r-md)] p-5 text-lg font-bold flex flex-col items-center justify-center gap-2 disabled:opacity-40 min-h-[150px] transition-all hover:bg-black/[0.01] cursor-pointer ${extraClass}`}
                  style={{
                    background: bgColor,
                    color: 'var(--brand-ink)',
                    border: borderStyle,
                  }}
                >
                  {difficulty === 'easy' && icon && (
                    <ActivityIcon icon={icon} size={92} className="mb-1" />
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

        {!done && placedCount > 0 && (
          <div className="text-center">
            <Button variant="ghost" onClick={restart} className="cursor-pointer">
              <Icon name="refresh" size={18} /> 처음부터 다시
            </Button>
          </div>
        )}

        {done && (
          <div className="text-center py-4">
            <p className="text-xl font-bold flex items-center justify-center gap-2 text-[color:var(--ok)]">
              <Burst />
              <Icon name="sparkles" size={24} filled /> 순서를 다 맞췄어요!
            </p>
          </div>
        )}
      </div>
    </ActivitySpread>
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
