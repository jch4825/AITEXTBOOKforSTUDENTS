import { useEffect, useState, useMemo } from 'react';
import { useSpeak } from '../../hooks/useSpeak';
import Icon from '../Icon';
import Button from '../Button';
import ActivityIcon from '../ActivityIcon';
import { activityColor } from '../../utils/activityPalette';
import { resolveActivityIcon } from '../../utils/activityIconResolver';
import type { Difficulty } from '../../types';
import ActivitySpread from '../lesson/ActivitySpread';

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

  // 처음부터 다시 — 맞춘 짝·선택·오답 표시를 모두 초기화한다.
  function restart() {
    setMatched(pairs.map(() => false));
    setPicked({ leftIdx: null, rightIdx: null });
    setWrongPair(null);
    setIsChecking(false);
  }

  const hasProgress = matched.some(Boolean) || picked.leftIdx !== null || picked.rightIdx !== null;
  const allDone = matched.every(Boolean);

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

  const questionNode = (
    <p className="text-base text-[color:var(--ink-2)]">
      왼쪽 열과 오른쪽 열에서 알맞은 짝을 하나씩 차례로 골라보세요.
    </p>
  );

  const characterReaction = {
    id: 'aimi' as const,
    expression: allDone ? 'cheer' as const : (picked.leftIdx !== null || picked.rightIdx !== null ? 'wink' as const : 'curious' as const),
    text: allDone
      ? '대단해! 모든 짝을 찾았어!'
      : (wrongPair ? '어라? 그 둘은 짝이 아닌가 봐. 다시 해보자!' : '서로 어울리는 짝을 찾아봐!')
  };

  return (
    <ActivitySpread
      kicker="짝을 맞춰봐요!"
      title="알맞은 짝을 찾아 연결해 볼까요?"
      accent="var(--accent)"
      character={characterReaction}
      questionNode={questionNode}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-3">
            {pairs.map((p, i) => {
              const icon = p.icon ?? resolveActivityIcon(undefined, p.left);
              const isPicked = picked.leftIdx === i;
              const isMatched = matched[i];
              const isWrong = wrongPair?.leftIdx === i;

              const palette = activityColor(icon ?? p.left);

              let borderStyle = `1px solid color-mix(in srgb, ${palette.accent} 30%, var(--line))`;
              let bgColor = 'var(--paper-0)';
              let extraClass = '';

              if (isPicked) {
                borderStyle = '2px solid var(--accent)';
              } else if (isMatched) {
                borderStyle = '2px solid var(--ok)';
                bgColor = 'color-mix(in srgb, var(--ok) 8%, var(--paper-0))';
              } else if (isWrong) {
                borderStyle = '2px solid var(--warn)';
                bgColor = 'color-mix(in srgb, var(--warn) 8%, var(--paper-0))';
                extraClass = 'answer-shake';
              }

              return (
                <button
                  key={p.left}
                  onClick={() => clickLeft(i)}
                  disabled={isMatched || isChecking}
                  className={`relative w-full p-4 min-h-[112px] rounded-[var(--r-md)] text-lg font-bold flex flex-col items-center justify-center gap-2 disabled:opacity-75 transition-all hover:bg-black/[0.01] cursor-pointer ${extraClass}`}
                  style={{
                    background: bgColor,
                    color: 'var(--brand-ink)',
                    border: borderStyle,
                  }}
                >
                  {difficulty === 'easy' && icon && (
                    <ActivityIcon icon={icon} size={64} className="mb-1" />
                  )}
                  <span>{p.left}</span>

                  {isMatched && (
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

          {/* Right Column */}
          <div className="space-y-3">
            {rightOrder.map((origIdx, shuffleIdx) => {
              const p = pairs[origIdx];
              if (!p) return null; // Safe guard
              const icon = p.icon ?? resolveActivityIcon(undefined, p.right);

              const isPicked = picked.rightIdx === shuffleIdx;
              const isMatched = matched[origIdx];
              const isWrong = wrongPair?.rightIdx === shuffleIdx;

              const palette = activityColor(icon ?? p.right);

              let borderStyle = `1px solid color-mix(in srgb, ${palette.accent} 30%, var(--line))`;
              let bgColor = 'var(--paper-0)';
              let extraClass = '';

              if (isPicked) {
                borderStyle = '2px solid var(--accent)';
              } else if (isMatched) {
                borderStyle = '2px solid var(--ok)';
                bgColor = 'color-mix(in srgb, var(--ok) 8%, var(--paper-0))';
              } else if (isWrong) {
                borderStyle = '2px solid var(--warn)';
                bgColor = 'color-mix(in srgb, var(--warn) 8%, var(--paper-0))';
                extraClass = 'answer-shake';
              }

              return (
                <button
                  key={p.right}
                  onClick={() => clickRight(shuffleIdx)}
                  disabled={isMatched || isChecking}
                  className={`relative w-full p-4 min-h-[112px] rounded-[var(--r-md)] text-lg font-bold flex flex-col items-center justify-center gap-2 disabled:opacity-75 transition-all hover:bg-black/[0.01] cursor-pointer ${extraClass}`}
                  style={{
                    background: bgColor,
                    color: 'var(--brand-ink)',
                    border: borderStyle,
                  }}
                >
                  {difficulty === 'easy' && icon && (
                    <ActivityIcon icon={icon} size={64} className="mb-1" />
                  )}
                  <span>{p.right}</span>

                  {isMatched && (
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
        </div>
        {hasProgress && (
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={restart} className="cursor-pointer">
              <Icon name="refresh" size={18} /> 처음부터 다시
            </Button>
          </div>
        )}
      </div>
    </ActivitySpread>
  );
}
