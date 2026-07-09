import React, { useEffect, useState, useMemo } from 'react';
import { useSpeak } from '../../hooks/useSpeak';
import Icon from '../Icon';
import ActivityIcon from '../ActivityIcon';
import { activityColor } from '../../utils/activityPalette';
import type { Difficulty } from '../../types';

export interface MatchingPair {
  left: string;
  right: string; // correct pair
  icon?: string;
}

interface Props {
  pairs: MatchingPair[];
  difficulty: Difficulty;
  onComplete: () => void;
}

interface PickedState {
  leftIdx: number | null;
  rightIdx: number | null;
}

export default function Matching({ pairs, difficulty, onComplete }: Props) {
  const [matched, setMatched] = useState<boolean[]>(() => pairs.map(() => false));
  const [picked, setPicked] = useState<PickedState>({ leftIdx: null, rightIdx: null });
  const [wrongPair, setWrongPair] = useState<{ leftIdx: number; rightIdx: number } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  // Sync state when pairs change (e.g. step navigation)
  useEffect(() => {
    setMatched(pairs.map(() => false));
    setPicked({ leftIdx: null, rightIdx: null });
    setWrongPair(null);
    setIsChecking(false);
  }, [pairs]);

  // Shuffle right column on mount/pairs change using useMemo
  const rightOrder = useMemo(() => {
    const order = pairs.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }, [pairs]);

  const { speak } = useSpeak();

  function tryMatch(left: number, rightShuffleIdx: number) {
    const right = rightOrder[rightShuffleIdx];
    if (left === right) {
      setIsChecking(true);
      
      // Update matched state and determine completion using the next array directly
      const nextMatched = [...matched];
      nextMatched[left] = true;
      setMatched(nextMatched);
      setPicked({ leftIdx: null, rightIdx: null });
      speak('잘 맞췄어요!');
      
      const allDone = nextMatched.every(Boolean);
      if (allDone) {
        setTimeout(onComplete, 800);
      } else {
        setIsChecking(false);
      }
    } else {
      setIsChecking(true);
      setWrongPair({ leftIdx: left, rightIdx: rightShuffleIdx });
      speak('다시 골라볼까요?');
      setTimeout(() => {
        setWrongPair(null);
        setPicked({ leftIdx: null, rightIdx: null });
        setIsChecking(false);
      }, 600);
    }
  }

  function clickLeft(i: number) {
    if (matched[i] || isChecking) return;
    if (picked.rightIdx !== null) {
      tryMatch(i, picked.rightIdx);
    } else {
      setPicked({ leftIdx: i, rightIdx: null });
    }
  }

  function clickRight(i: number) {
    const right = rightOrder[i];
    if (matched[right] || isChecking) return;
    if (picked.leftIdx !== null) {
      tryMatch(picked.leftIdx, i);
    } else {
      setPicked({ leftIdx: null, rightIdx: i });
    }
  }

  return (
    <div className="my-6 grid grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-3">
        {pairs.map((p, i) => {
          const isPicked = picked.leftIdx === i;
          const isMatched = matched[i];
          const isWrong = wrongPair?.leftIdx === i;
          
          const palette = activityColor(p.icon ?? p.left);
          
          let borderStyle = '2px solid var(--line)';
          let extraClass = '';
          
          if (isPicked) {
            borderStyle = '4px solid var(--accent)';
          } else if (isMatched) {
            borderStyle = '4px solid var(--ok)';
          } else if (isWrong) {
            borderStyle = '4px solid var(--warn)';
            extraClass = 'answer-shake';
          }

          return (
            <button
              key={p.left}
              onClick={() => clickLeft(i)}
              disabled={isMatched || isChecking}
              className={`relative btn btn-choice w-full p-4 min-h-[96px] text-lg font-bold flex flex-col items-center justify-center gap-2 disabled:opacity-75 transition-all ${extraClass}`}
              style={{
                background: palette.bg,
                color: palette.text,
                border: borderStyle,
                boxShadow: isPicked ? '0 0 12px rgba(43, 58, 85, 0.25)' : 'none',
              }}
            >
              {difficulty === 'easy' && p.icon && (
                <ActivityIcon icon={p.icon} size={48} className="mb-1" />
              )}
              <span>{p.left}</span>

              {isMatched && (
                <span
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-white shadow"
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

      {/* Right Column */}
      <div className="space-y-3">
        {rightOrder.map((origIdx, shuffleIdx) => {
          const p = pairs[origIdx];
          if (!p) return null; // Safe guard
          
          const isPicked = picked.rightIdx === shuffleIdx;
          const isMatched = matched[origIdx];
          const isWrong = wrongPair?.rightIdx === shuffleIdx;
          
          const palette = activityColor(p.icon ?? p.right);
          
          let borderStyle = '2px solid var(--line)';
          let extraClass = '';
          
          if (isPicked) {
            borderStyle = '4px solid var(--accent)';
          } else if (isMatched) {
            borderStyle = '4px solid var(--ok)';
          } else if (isWrong) {
            borderStyle = '4px solid var(--warn)';
            extraClass = 'answer-shake';
          }

          return (
            <button
              key={p.right}
              onClick={() => clickRight(shuffleIdx)}
              disabled={isMatched || isChecking}
              className={`relative btn btn-choice w-full p-4 min-h-[96px] text-lg font-bold flex flex-col items-center justify-center gap-2 disabled:opacity-75 transition-all ${extraClass}`}
              style={{
                background: palette.bg,
                color: palette.text,
                border: borderStyle,
                boxShadow: isPicked ? '0 0 12px rgba(43, 58, 85, 0.25)' : 'none',
              }}
            >
              {difficulty === 'easy' && p.icon && (
                <ActivityIcon icon={p.icon} size={48} className="mb-1" />
              )}
              <span>{p.right}</span>

              {isMatched && (
                <span
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-white shadow"
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
    </div>
  );
}
