import React, { useEffect, useState } from 'react';
import { useSpeak } from '../../hooks/useSpeak';
import Button from '../Button';
import Icon from '../Icon';
import ActivityIcon from '../ActivityIcon';
import Burst from './Burst';
import { activityColor } from '../../utils/activityPalette';
import type { Difficulty } from '../../types';

export interface CardChoice {
  label: string;
  isCorrect: boolean;
  icon?: string;
}

interface Props {
  question: string;
  choices: CardChoice[];
  difficulty: Difficulty;
  onComplete: () => void;
}

export default function CardPick({ question, choices, difficulty, onComplete }: Props) {
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const { speak, speakNow } = useSpeak();

  // Auto-read the question when this step mounts.
  useEffect(() => {
    speak(question);
  }, [speak, question]);

  function pick(i: number) {
    if (pickedIdx !== null) return;
    setPickedIdx(i);
    speak(choices[i].isCorrect ? '잘했어요!' : '아쉬워요, 다른 답을 골라봐요.');
  }

  // 오답이어도 정답을 강제로 넘기지 않고, 다시 고를 수 있게 초기화한다.
  function retry() {
    setPickedIdx(null);
    speakNow(question);
  }

  const picked = pickedIdx !== null ? choices[pickedIdx] : null;

  return (
    <div className="my-6">
      <div className="flex items-start gap-2 mb-4">
        <p className="text-xl font-semibold flex-1">{question}</p>
        <button
          type="button"
          onClick={() => speakNow(question)}
          aria-label="문제 다시 들려주기"
          className="shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: 'var(--accent)',
            color: 'var(--accent)',
            background: 'var(--paper-0)',
          }}
        >
          <Icon name="speaker" size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {choices.map((c, i) => {
          const selected = i === pickedIdx;
          const palette = activityColor(c.icon ?? c.label);

          let borderStyle = `2.5px solid ${palette.accent}`;
          let extraClass = '';

          if (selected) {
            borderStyle = c.isCorrect
              ? '4px solid var(--ok)'
              : '4px solid var(--warn)';
            if (!c.isCorrect) {
              extraClass = 'answer-shake';
            }
          }

          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={pickedIdx !== null}
              className={`card3d relative rounded-[var(--r-md)] p-5 text-lg font-bold flex flex-col items-center justify-center gap-2 disabled:opacity-60 min-h-[150px] ${extraClass}`}
              style={{
                background: 'var(--paper-0)',
                color: 'var(--brand-ink)',
                border: borderStyle,
                ['--edge' as string]: palette.accent,
              }}
            >
              {/* Show icon only in easy difficulty */}
              {difficulty === 'easy' && c.icon && (
                <ActivityIcon icon={c.icon} size={92} className="mb-1" />
              )}
              
              <span>{c.label}</span>

              {/* Correctness Overlay Badges */}
              {selected && (
                <>
                  {c.isCorrect ? (
                    <>
                      <Burst />
                      <span
                        className="answer-pop absolute -top-2.5 -right-2.5 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-md z-10"
                        style={{ background: 'var(--ok)' }}
                      >
                        <Icon name="check" size={20} strokeWidth={3} />
                      </span>
                    </>
                  ) : (
                    <span
                      className="absolute -top-2.5 -right-2.5 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-md z-10"
                      style={{ background: 'var(--warn)' }}
                    >
                      <Icon name="close" size={18} strokeWidth={3} />
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-6 text-center">
          {picked.isCorrect ? (
            <>
              <p className="text-lg font-bold inline-flex items-center gap-1.5">
                <Icon name="sparkles" size={22} filled color="var(--ok)" /> 정답!
              </p>
              <div>
                <Button size="lg" onClick={onComplete} className="mt-4 px-6">
                  다음 <Icon name="chevron-right" size={20} />
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg font-bold inline-flex items-center gap-1.5">
                <Icon name="bulb" size={22} color="var(--warn)" /> 아쉬워요, 다시 해볼까요?
              </p>
              <div>
                <Button size="lg" variant="secondary" onClick={retry} className="mt-4 px-6">
                  <Icon name="refresh" size={20} /> 다시 하기
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
