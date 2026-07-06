import { useState } from 'react';
import { useSpeak } from '../../hooks/useSpeak';

export interface SequenceItem {
  label: string;
}

interface Props {
  instruction: string; // 예: "라면 끓이는 순서대로 눌러봐요"
  items: SequenceItem[]; // 정답 순서대로 전달 — 컴포넌트가 섞어서 보여줌
  onComplete: () => void;
}

/**
 * 순서 맞추기 게임 — 섞인 카드를 "다음 차례"라고 생각하는 순서대로 클릭.
 * 드래그 없음(접근성), 색+아이콘+TTS 3중 피드백. Matching과 동일한 상호작용 철학.
 */
export default function Sequence({ instruction, items, onComplete }: Props) {
  const [placedCount, setPlacedCount] = useState(0);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  // shuffle once per mount; 우연히 정답 순서 그대로면 한 번 더 섞는다.
  const [shuffleOrder] = useState<number[]>(() => shuffleAvoidingIdentity(items.length));
  const { speak } = useSpeak();

  const done = placedCount === items.length;

  function clickCard(shuffleIdx: number) {
    if (done) return;
    const origIdx = shuffleOrder[shuffleIdx];
    if (origIdx < placedCount) return; // 이미 놓인 카드
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

      {/* 위쪽: 번호 슬롯 — 맞춘 순서대로 채워진다 */}
      <ol className="space-y-2 mb-6">
        {items.map((item, i) => (
          <li
            key={item.label}
            className="p-3 rounded-lg border-2 text-lg"
            style={
              i < placedCount
                ? { borderColor: 'var(--ok)', background: 'var(--ok-bg)' }
                : { borderColor: 'var(--border)', borderStyle: 'dashed', color: 'var(--muted)' }
            }
          >
            {i < placedCount ? `✅ ${i + 1}. ${item.label}` : `${i + 1}. ─`}
          </li>
        ))}
      </ol>

      {/* 아래쪽: 섞인 카드 — 다음 차례라고 생각하는 카드를 눌러요 */}
      {!done && (
        <div className="grid grid-cols-2 gap-3">
          {shuffleOrder.map((origIdx, shuffleIdx) => {
            const used = origIdx < placedCount;
            const isWrong = wrongIdx === shuffleIdx;
            return (
              <button
                key={items[origIdx].label}
                onClick={() => clickCard(shuffleIdx)}
                disabled={used}
                className="p-4 rounded-lg border-4 text-lg font-semibold disabled:opacity-40 min-h-[64px]"
                style={{
                  borderColor: isWrong ? 'var(--warn)' : 'var(--accent)',
                  background: used ? 'var(--done-bg)' : isWrong ? 'var(--warn-bg)' : 'white',
                  color: 'var(--fg)',
                }}
              >{isWrong ? '🤔 ' : ''}{items[origIdx].label}</button>
            );
          })}
        </div>
      )}

      {done && (
        <p className="text-xl font-bold text-center" style={{ color: 'var(--ok)' }}>
          🎉 순서를 다 맞췄어요!
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
