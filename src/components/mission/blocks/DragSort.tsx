import React, { useState, useRef } from 'react';
import type { DragSortBlock } from '../../../types';
import Icon from '../../Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import { activityColor } from '../../../utils/activityPalette';

interface Props {
  key?: any;
  block: DragSortBlock;
  value: Record<string, number> | undefined; // maps card index (as string) to bin index
  onChange: (value: Record<string, number>) => void;
  accent: string;
}

export default function DragSort({ block, value = {}, onChange, accent }: Props) {
  const { speak, speakNow } = useSpeak();
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [errorCardIdx, setErrorCardIdx] = useState<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  
  const binRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Drag position states
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  // Get index of the first unsorted card
  const unsortedCards = block.cards
    .map((c, i) => ({ ...c, originalIdx: i }))
    .filter((c) => value[c.originalIdx] === undefined);

  // Click-to-move fallback selection
  const handleCardClick = (originalIdx: number) => {
    if (selectedCardIdx === originalIdx) {
      setSelectedCardIdx(null);
    } else {
      setSelectedCardIdx(originalIdx);
      setErrorCardIdx(null);
      speak(block.cards[originalIdx].label); // 잡은 카드를 읽어준다
    }
  };

  const handleBinClick = (binIdx: number) => {
    if (selectedCardIdx === null) return;

    const correctBin = block.cards[selectedCardIdx].bin;
    if (correctBin === binIdx) {
      // Correct!
      const newValue = { ...value, [selectedCardIdx]: binIdx };
      onChange(newValue);
      setSelectedCardIdx(null);
      speak(Object.keys(newValue).length === block.cards.length ? '와, 모두 나눴습니다!' : '잘 맞췄습니다!');
    } else {
      // Wrong! Shake animation
      setErrorCardIdx(selectedCardIdx);
      setTimeout(() => setErrorCardIdx(null), 500);
      speak('다시 골라 보겠습니까?');
    }
  };

  // Pointer Drag-and-Drop Implementation
  const handlePointerDown = (e: React.PointerEvent, originalIdx: number) => {
    e.preventDefault();
    setSelectedCardIdx(originalIdx);
    setDraggingIdx(originalIdx);
    startPos.current = { x: e.clientX, y: e.clientY };
    setDragOffset({ x: 0, y: 0 });
    
    // Capture pointer
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIdx === null) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent, originalIdx: number) => {
    if (draggingIdx === null) return;
    
    const target = e.currentTarget as HTMLElement;
    target.releasePointerCapture(e.pointerId);

    setDraggingIdx(null);

    // Get final card boundary
    const cardEl = cardRefs.current[originalIdx];
    if (!cardEl) return;
    const cardRect = cardEl.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    // Check collision with bins
    let droppedBinIdx = -1;
    for (let i = 0; i < block.bins.length; i++) {
      const binEl = binRefs.current[i];
      if (!binEl) continue;
      const binRect = binEl.getBoundingClientRect();
      
      if (
        cardCenterX >= binRect.left &&
        cardCenterX <= binRect.right &&
        cardCenterY >= binRect.top &&
        cardCenterY <= binRect.bottom
      ) {
        droppedBinIdx = i;
        break;
      }
    }

    if (droppedBinIdx !== -1) {
      const correctBin = block.cards[originalIdx].bin;
      if (correctBin === droppedBinIdx) {
        // Success
        const newValue = { ...value, [originalIdx]: droppedBinIdx };
        onChange(newValue);
        setSelectedCardIdx(null);
        speak(Object.keys(newValue).length === block.cards.length ? '와, 모두 나눴습니다!' : '잘 맞췄습니다!');
      } else {
        // Fail: Shake
        setErrorCardIdx(originalIdx);
        setTimeout(() => setErrorCardIdx(null), 500);
        speak('다시 골라 보겠습니까?');
      }
    }

    setDragOffset({ x: 0, y: 0 });
  };

  // Group sorted cards by bin
  const sortedByBin: Record<number, typeof block.cards> = {};
  block.bins.forEach((_, i) => {
    sortedByBin[i] = [];
  });
  Object.entries(value).forEach(([cardIdxStr, binIdx]) => {
    const idx = parseInt(cardIdxStr, 10);
    sortedByBin[binIdx].push(block.cards[idx]);
  });

  const isAllSorted = Object.keys(value).length === block.cards.length;

  return (
    <div className="w-full space-y-4 story-fade-in select-none">
      <div className="flex items-start gap-2">
        <p className="text-xl font-semibold flex-1">{block.prompt}</p>
        <button
          type="button"
          onClick={() => speakNow(block.prompt)}
          aria-label="문제 다시 들려주기"
          className="shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: accent, color: accent, background: 'var(--paper-0)' }}
        >
          <Icon name="speaker" size={20} />
        </button>
      </div>

      {/* Bins Container */}
      <div className={`grid gap-3 ${block.bins.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {block.bins.map((bin, idx) => {
          const isTargetGlow = selectedCardIdx !== null && draggingIdx === null;
          return (
            <div
              key={idx}
              ref={(el) => { binRefs.current[idx] = el; }}
              onClick={() => handleBinClick(idx)}
              className="border-[2.5px] border-dashed rounded-[var(--r-md)] p-4 flex flex-col items-center min-h-[170px] transition-all cursor-pointer relative"
              style={{
                borderColor: isTargetGlow ? accent : 'var(--border)',
                background: isTargetGlow ? 'var(--paper-2)' : 'var(--paper-1)',
              }}
            >
              <span className="text-3xl mb-1" aria-hidden>{bin.emoji}</span>
              <span className="text-base font-bold mb-3" style={{ color: 'var(--brand-ink)' }}>{bin.label}</span>

              {/* Sorted items in this bin */}
              <div className="w-full flex flex-col gap-1.5 mt-auto">
                {sortedByBin[idx].map((card, cIdx) => (
                  <div
                    key={cIdx}
                    className="answer-pop flex items-center gap-1.5 px-3 py-2 rounded-[var(--r-sm)] text-sm font-semibold"
                    style={{ background: 'var(--ok-bg)', border: '1px solid var(--ok)', color: 'var(--brand-ink)' }}
                  >
                    <span aria-hidden>{card.emoji}</span>
                    <span>{card.label}</span>
                    <Icon name="check" size={14} strokeWidth={3} color="var(--ok)" className="ml-auto shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unsorted Cards Pile */}
      {!isAllSorted && (
        <div className="border border-[color:var(--line)] rounded-[var(--r-md)] p-4 flex flex-col items-center gap-3 bg-[color:var(--paper-0)]">
          <p className="text-base font-semibold" style={{ color: 'var(--muted)' }}>
            카드를 알맞은 상자로 끌어다 놓거나, 카드를 누른 뒤 상자를 눌러 보십시오.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {unsortedCards.map((card) => {
              const isSelected = selectedCardIdx === card.originalIdx;
              const isDragging = draggingIdx === card.originalIdx;
              const isError = errorCardIdx === card.originalIdx;
              const palette = activityColor(card.label);

              return (
                <div
                  key={card.originalIdx}
                  ref={(el) => { cardRefs.current[card.originalIdx] = el; }}
                  onPointerDown={(e) => handlePointerDown(e, card.originalIdx)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={(e) => handlePointerUp(e, card.originalIdx)}
                  onClick={() => handleCardClick(card.originalIdx)}
                  className={`card3d flex items-center gap-2 px-5 py-3 rounded-[var(--r-md)] font-bold text-base select-none transition-all cursor-grab active:cursor-grabbing shrink-0 touch-none
                    ${isDragging ? 'z-50 scale-105' : ''}
                    ${isError ? 'answer-shake' : ''}
                  `}
                  style={{
                    border: isSelected ? `4px solid ${palette.accent}` : `2.5px solid ${palette.accent}`,
                    background: isError ? 'var(--bad-bg)' : isSelected ? palette.tint : 'var(--paper-0)',
                    color: 'var(--brand-ink)',
                    ['--edge' as string]: palette.accent,
                    transform: isDragging
                      ? `translate(${dragOffset.x}px, ${dragOffset.y}px)`
                      : 'none',
                  }}
                >
                  <span className="text-2xl" aria-hidden>{card.emoji}</span>
                  <span>{card.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isAllSorted && (
        <div
          className="answer-pop flex items-center justify-center gap-2 py-3 rounded-[var(--r-md)] font-bold text-lg"
          style={{ background: 'var(--ok-bg)', border: '1px solid var(--ok)', color: 'var(--brand-ink)' }}
        >
          <Icon name="sparkles" size={22} filled color="var(--ok)" />
          모든 카드를 알맞게 나눴습니다!
        </div>
      )}
    </div>
  );
}
