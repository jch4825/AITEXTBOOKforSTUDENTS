import { useEffect, useState } from 'react';
import { useSpeak } from '../../hooks/useSpeak';

export interface OXQuestion {
  question: string;
  answer: 'O' | 'X';
  feedback?: string; // optional explanation shown after answer
}

interface Props {
  questions: OXQuestion[];
  onComplete: () => void;
}

export default function OXGame({ questions, onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<'O' | 'X' | null>(null);
  const { speak } = useSpeak();
  const q = questions[idx];
  const correct = picked !== null && picked === q.answer;

  // Auto-read the question when it appears (respects TTS toggle inside useSpeak).
  useEffect(() => { speak(q.question); }, [idx, speak, q.question]);

  function pick(choice: 'O' | 'X') {
    if (picked) return;
    setPicked(choice);
    const isCorrect = choice === q.answer;
    const feedbackLine = q.feedback ? ` ${q.feedback}` : '';
    speak((isCorrect ? '정답이에요!' : '아쉬워요, 다시 생각해봐요.') + feedbackLine);
  }

  function next() {
    if (idx + 1 < questions.length) {
      setIdx(i => i + 1);
      setPicked(null);
    } else {
      onComplete();
    }
  }

  return (
    <div className="my-6">
      <div className="flex items-start gap-2 mb-4">
        <p className="text-xl font-semibold flex-1">{q.question}</p>
        <button
          type="button"
          onClick={() => speak(q.question)}
          aria-label="문제 다시 들려주기"
          className="shrink-0 h-10 w-10 rounded-full border-2 text-lg"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'white' }}
        >🔊</button>
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => pick('O')}
          disabled={picked !== null}
          aria-label="맞아요"
          className="h-24 w-24 rounded-full text-5xl font-bold border-4 disabled:opacity-60"
          style={{
            background: picked === 'O' ? (correct ? 'var(--ok-bg)' : 'var(--bad-bg)') : 'white',
            borderColor: 'var(--accent)',
          }}
        >⭕</button>
        <button
          onClick={() => pick('X')}
          disabled={picked !== null}
          aria-label="아니에요"
          className="h-24 w-24 rounded-full text-5xl font-bold border-4 disabled:opacity-60"
          style={{
            background: picked === 'X' ? (correct ? 'var(--ok-bg)' : 'var(--bad-bg)') : 'white',
            borderColor: 'var(--accent)',
          }}
        >❌</button>
      </div>

      {picked !== null && (
        <div className="mt-6 text-center">
          <p className="text-lg font-bold">
            {correct ? '🎉 정답!' : `💡 정답은 ${q.answer === 'O' ? '⭕' : '❌'} 였어요.`}
          </p>
          {q.feedback && <p className="text-base mt-2">{q.feedback}</p>}
          <button
            onClick={next}
            className="mt-4 px-6 py-3 rounded font-bold text-white"
            style={{ background: 'var(--accent)' }}
          >{idx + 1 < questions.length ? '다음 ▶' : '끝내기 ✓'}</button>
        </div>
      )}
    </div>
  );
}
