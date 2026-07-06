import { useEffect, useState } from 'react';
import { useSpeak } from '../../hooks/useSpeak';

export interface CardChoice {
  label: string;
  isCorrect: boolean;
}

interface Props {
  question: string;
  choices: CardChoice[];
  onComplete: () => void;
}

export default function CardPick({ question, choices, onComplete }: Props) {
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const { speak } = useSpeak();

  // Auto-read the question when this step mounts.
  useEffect(() => { speak(question); }, [speak, question]);

  function pick(i: number) {
    if (pickedIdx !== null) return;
    setPickedIdx(i);
    speak(choices[i].isCorrect ? '잘했어요!' : '아쉬워요, 다른 답을 골라봐요.');
  }

  const picked = pickedIdx !== null ? choices[pickedIdx] : null;

  return (
    <div className="my-6">
      <div className="flex items-start gap-2 mb-4">
        <p className="text-xl font-semibold flex-1">{question}</p>
        <button
          type="button"
          onClick={() => speak(question)}
          aria-label="문제 다시 들려주기"
          className="shrink-0 h-10 w-10 rounded-full border-2 text-lg"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'white' }}
        >🔊</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {choices.map((c, i) => {
          const selected = i === pickedIdx;
          const bg = selected ? (c.isCorrect ? 'var(--ok-bg)' : 'var(--bad-bg)') : 'white';
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={pickedIdx !== null}
              className="min-h-16 p-4 rounded-lg border-4 text-lg font-semibold text-left disabled:opacity-60"
              style={{ background: bg, borderColor: 'var(--accent)' }}
            >
              {selected ? (c.isCorrect ? '✅ ' : '❌ ') : ''}{c.label}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-6 text-center">
          <p className="text-lg font-bold">
            {picked.isCorrect ? '🎉 정답!' : '💡 다시 한번 생각해봐요.'}
          </p>
          <button
            onClick={onComplete}
            className="mt-4 px-6 py-3 rounded font-bold text-white"
            style={{ background: 'var(--accent)' }}
          >다음 ▶</button>
        </div>
      )}
    </div>
  );
}
