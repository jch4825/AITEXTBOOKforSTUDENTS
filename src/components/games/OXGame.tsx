import { useEffect, useState } from 'react';
import { useSpeak } from '../../hooks/useSpeak';
import Button from '../Button';
import Icon from '../Icon';
import Burst from './Burst';
import ActivitySpread from '../lesson/ActivitySpread';

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
    speak((isCorrect ? '정답입니다!' : '아쉽습니다, 다시 생각해 보십시오.') + feedbackLine);
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

  // 오답이어도 정답을 강제로 보여주지 않고, 다시 풀 수 있게 선택을 초기화한다.
  function retry() {
    setSelected(null);
    speakNow(q.question);
  }

  const questionNode = (
    <div className="space-y-4">
      {/* Progress Dots */}
      <div className="flex gap-1.5 justify-start">
        {questions.map((_, idx) => (
          <span
            key={idx}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background:
                idx === currIdx
                  ? 'var(--accent)'
                  : idx < currIdx
                  ? 'var(--ok)'
                  : 'var(--paper-2)',
            }}
          />
        ))}
      </div>

      {/* Problem Speak Button */}
      <button
        type="button"
        onClick={() => speakNow(q.question)}
        aria-label="문제 다시 들려주기"
        className="btn btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1 cursor-pointer"
        style={{
          borderColor: 'var(--accent)',
          color: 'var(--accent)',
        }}
      >
        <Icon name="speaker" size={16} /> 다시 들려줘
      </button>
    </div>
  );

  const characterReaction = {
    id: 'aimi' as const,
    expression: selected === null ? 'curious' as const : (isCorrect ? 'cheer' as const : 'thinking' as const),
    text: selected === null
      ? '어느 쪽이 정답일까? 잘 고민해봐!'
      : (isCorrect ? '정답이야! 참 잘했어!' : '아쉽네, 다시 생각해보자!')
  };

  return (
    <ActivitySpread
      kicker="같이 풀어봅니다!"
      title={q.question}
      accent="var(--accent)"
      character={characterReaction}
      questionNode={questionNode}
    >
      <div className="space-y-6">
        {/* O / X Big Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['O', 'X'] as const).map((choice) => {
            const isChoicePicked = selected === choice;
            const accentColor = choice === 'O' ? '#3FAE8C' : '#E8825E';

            let borderStyle = `1px solid color-mix(in srgb, ${accentColor} 30%, var(--line))`;
            let bgColor = 'var(--paper-0)';
            let extraClass = '';

            if (isChoicePicked) {
              borderStyle = isCorrect
                ? '2px solid var(--ok)'
                : '2px solid var(--warn)';
              bgColor = isCorrect
                ? 'color-mix(in srgb, var(--ok) 8%, var(--paper-0))'
                : 'color-mix(in srgb, var(--warn) 8%, var(--paper-0))';
              if (!isCorrect) {
                extraClass = 'answer-shake';
              }
            }

            return (
              <button
                key={choice}
                onClick={() => choose(choice)}
                disabled={selected !== null}
                className={`relative h-32 rounded-[var(--r-lg)] flex flex-col items-center justify-center font-black disabled:opacity-65 transition-all hover:bg-black/[0.02] cursor-pointer ${extraClass}`}
                style={{
                  border: borderStyle,
                  background: bgColor,
                }}
              >
                {choice === 'O' ? (
                  <Icon
                    name="circle"
                    size={64}
                    strokeWidth={4}
                    color={
                      isChoicePicked
                        ? isCorrect
                          ? 'var(--ok)'
                          : 'var(--warn)'
                        : accentColor
                    }
                  />
                ) : (
                  <Icon
                    name="cross"
                    size={64}
                    strokeWidth={4}
                    color={
                      isChoicePicked
                        ? isCorrect
                          ? 'var(--ok)'
                          : 'var(--warn)'
                        : accentColor
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
                          className="answer-pop absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-md z-10"
                          style={{ background: 'var(--ok)' }}
                        >
                          <Icon name="check" size={20} strokeWidth={3} />
                        </span>
                      </>
                    ) : (
                      <span
                        className="absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-md z-10"
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
          <div className="mt-4 text-center">
            {isCorrect ? (
              <>
                <p className="text-lg font-bold inline-flex items-center gap-1.5 text-[color:var(--ok)]">
                  <Icon name="sparkles" size={22} filled color="var(--ok)" /> 정답!
                </p>
                {q.feedback && <p className="mt-2 text-[color:var(--muted)] text-base">{q.feedback}</p>}
                <div>
                  <Button size="lg" onClick={next} className="mt-4 px-6 cursor-pointer">
                    {currIdx + 1 >= questions.length ? (
                      <>완료 <Icon name="check" size={20} /></>
                    ) : (
                      <>다음 문제 <Icon name="chevron-right" size={20} /></>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-bold inline-flex items-center gap-1.5 text-[color:var(--warn)]">
                  <Icon name="bulb" size={22} color="var(--warn)" /> 아쉽습니다, 다시 해 보겠습니까?
                </p>
                {q.feedback && <p className="mt-2 text-[color:var(--muted)] text-base">{q.feedback}</p>}
                <div>
                  <Button size="lg" variant="secondary" onClick={retry} className="mt-4 px-6 cursor-pointer">
                    <Icon name="refresh" size={20} /> 다시 하기
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ActivitySpread>
  );
}
