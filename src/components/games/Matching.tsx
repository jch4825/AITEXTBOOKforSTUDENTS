import { useState } from 'react';
import { useSpeak } from '../../hooks/useSpeak';

export interface MatchingPair {
  left: string;
  right: string; // correct pair
}

interface Props {
  pairs: MatchingPair[];
  onComplete: () => void;
}

interface PickedState {
  leftIdx: number | null;
  rightIdx: number | null;
}

export default function Matching({ pairs, onComplete }: Props) {
  const [matched, setMatched] = useState<boolean[]>(() => pairs.map(() => false));
  const [picked, setPicked] = useState<PickedState>({ leftIdx: null, rightIdx: null });
  // shuffle right column once per mount
  const [rightOrder] = useState<number[]>(() => {
    const order = pairs.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  });
  const { speak } = useSpeak();

  function tryMatch(left: number, rightShuffleIdx: number) {
    const right = rightOrder[rightShuffleIdx];
    if (left === right) {
      setMatched(m => { const next = [...m]; next[left] = true; return next; });
      setPicked({ leftIdx: null, rightIdx: null });
      speak('잘 맞췄어요!');
      const allDone = matched.filter((_, i) => i !== left).every(Boolean);
      if (allDone) setTimeout(onComplete, 800);
    } else {
      speak('다시 골라볼까요?');
      setTimeout(() => setPicked({ leftIdx: null, rightIdx: null }), 600);
    }
  }

  function clickLeft(i: number) {
    if (matched[i]) return;
    if (picked.rightIdx !== null) {
      tryMatch(i, picked.rightIdx);
    } else {
      setPicked({ leftIdx: i, rightIdx: null });
    }
  }

  function clickRight(i: number) {
    const right = rightOrder[i];
    if (matched[right]) return;
    if (picked.leftIdx !== null) {
      tryMatch(picked.leftIdx, i);
    } else {
      setPicked({ leftIdx: null, rightIdx: i });
    }
  }

  return (
    <div className="my-6 grid grid-cols-2 gap-6">
      <div className="space-y-2">
        {pairs.map((p, i) => (
          <button
            key={p.left}
            onClick={() => clickLeft(i)}
            disabled={matched[i]}
            className="block w-full p-4 rounded-lg border-4 text-lg font-semibold disabled:opacity-50"
            style={{
              borderColor: 'var(--accent)',
              background: matched[i] ? 'var(--ok-bg)' : picked.leftIdx === i ? 'var(--accent)' : 'white',
              color: picked.leftIdx === i ? 'white' : 'var(--fg)',
            }}
          >{matched[i] ? '✅ ' : ''}{p.left}</button>
        ))}
      </div>
      <div className="space-y-2">
        {rightOrder.map((origIdx, shuffleIdx) => (
          <button
            key={pairs[origIdx].right}
            onClick={() => clickRight(shuffleIdx)}
            disabled={matched[origIdx]}
            className="block w-full p-4 rounded-lg border-4 text-lg font-semibold disabled:opacity-50"
            style={{
              borderColor: 'var(--accent)',
              background: matched[origIdx] ? 'var(--ok-bg)' : picked.rightIdx === shuffleIdx ? 'var(--accent)' : 'white',
              color: picked.rightIdx === shuffleIdx ? 'white' : 'var(--fg)',
            }}
          >{matched[origIdx] ? '✅ ' : ''}{pairs[origIdx].right}</button>
        ))}
      </div>
    </div>
  );
}
