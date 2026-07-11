import React, { useEffect, useState } from 'react';
import { useSpeak } from '../../hooks/useSpeak';
import Button from '../Button';
import Icon from '../Icon';
import Burst from './Burst';

export interface OXQuestion {
  question: string;
  answer: 'O' | 'X';
  feedback: string;
}

interface Props {
  questions: OXQuestion[];
  onComplete: () => void;
}

export default function OXGame({ questions, onComplete }: Props) {
  const [currIdx, setCurrIdx] = useState(0);
  const [selected, setSelected] = useState<'O' | 'X' | null>(null);
  const { speak, speakNow } = useSpeak();

  const q = questions[currIdx];

  // Auto-read question on mount/change
  useEffect(() => {
    speak(q.question);
  }, [speak, q.question]);

  function choose(ans: 'O' | 'X') {
    if (selected !== null) return;
    setSelected(ans);
    const isCorrect = ans === q.answer;
    
    // Speak feedback
    const feedbackLine = q.feedback ? ` ${q.feedback}` : '';
    speak((isCorrect ? '정답이에요!' : '아쉬워요, 다시 생각해보세요.') + feedbackLine);
  }

  const isCorrect = selected === q.answer;

  function next() {
    setSelected(null);
    if (currIdx + 1 >= questions.length) {
      onComplete();
    } else {
      setCurrIdx(currIdx + 1);
    }
  }

  return (
    <div className="my-6">
      {/* Progress Dots */}
      <div className="flex gap-1.5 mb-4 justify-center">
        {questions.map((_, idx) => (
          <span
            key={idx}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background:
                idx === currIdx
                  ? 'var(--accent)'
                  : idx < currIdx
                  ? 'var(--ok-bg)'
                  : 'var(--paper-2)',
            }}
          />
        ))}
      </div>

      {/* Question Text */}
      <div className="flex items-start gap-2 mb-6">
        <p className="text-xl font-semibold flex-1">{q.question}</p>
        <button
          type="button"
          onClick={() => speakNow(q.question)}
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

      {/* O / X Big Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {(['O', 'X'] as const).map((choice) => {
          const isChoicePicked = selected === choice;
          // 종이 스티커 문법 — O 틸 / X 코랄 (활동 카드와 같은 팔레트 톤)
          const accent = choice === 'O' ? '#3FAE8C' : '#E8825E';

          let borderStyle = `2.5px solid ${accent}`;
          let extraClass = '';

          if (isChoicePicked) {
            borderStyle = isCorrect
              ? '4px solid var(--ok)'
              : '4px solid var(--warn)';
            if (!isCorrect) {
              extraClass = 'answer-shake';
            }
          }

          return (
            <button
              key={choice}
              onClick={() => choose(choice)}
              disabled={selected !== null}
              className={`card3d relative h-32 rounded-[var(--r-lg)] flex flex-col items-center justify-center font-black disabled:opacity-65 ${extraClass}`}
              style={{
                border: borderStyle,
                background: 'var(--paper-0)',
                ['--edge' as string]: accent,
              }}
            >
              {/* O or X Shape rendering */}
              {choice === 'O' ? (
                <Icon
                  name="circle"
                  size={64}
                  strokeWidth={4.5}
                  color={
                    isChoicePicked
                      ? isCorrect
                        ? 'var(--ok)'
                        : 'var(--warn)'
                      : accent
                  }
                />
              ) : (
                <Icon
                  name="cross"
                  size={64}
                  strokeWidth={4.5}
                  color={
                    isChoicePicked
                      ? isCorrect
                        ? 'var(--ok)'
                        : 'var(--warn)'
                      : accent
                  }
                />
              )}

              {/* Correctness Overlay Badges */}
              {isChoicePicked && (
                <>
                  {isCorrect ? (
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

      {/* Answer feedback panel */}
      {selected !== null && (
        <div className="mt-6 text-center">
          <p className="text-lg font-bold inline-flex items-center gap-1.5">
            {isCorrect ? (
              <>
                <Icon name="sparkles" size={22} filled color="var(--ok)" /> 정답!
              </>
            ) : (
              <>
                <Icon name="bulb" size={22} color="var(--warn)" /> 정답은{' '}
                <Icon
                  name={q.answer === 'O' ? 'circle' : 'cross'}
                  size={20}
                  strokeWidth={3}
                />
                입니다.
              </>
            )}
          </p>
          {q.feedback && <p className="mt-2 text-[color:var(--muted)]">{q.feedback}</p>}
          <div>
            <Button size="lg" onClick={next} className="mt-4 px-6">
              {currIdx + 1 >= questions.length ? (
                <>
                  완료 <Icon name="check" size={20} />
                </>
              ) : (
                <>
                  다음 <Icon name="chevron-right" size={20} />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
