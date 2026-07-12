import React, { useState, useRef, useEffect } from 'react';
import type { DragSortBlock } from '../../../types';
import Icon from '../../Icon';

interface Props {
  key?: any;
  block: DragSortBlock;
  value: Record<string, number> | undefined; // maps card index (as string) to bin index
  onChange: (value: Record<string, number>) => void;
  accent: string;
}

export default function DragSort({ block, value = {}, onChange, accent }: Props) {
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
    } else {
      // Wrong! Shake animation
      setErrorCardIdx(selectedCardIdx);
      setTimeout(() => setErrorCardIdx(null), 500);
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
      } else {
        // Fail: Shake
        setErrorCardIdx(originalIdx);
        setTimeout(() => setErrorCardIdx(null), 500);
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
      <p className="text-lg font-bold text-neutral-800">{block.prompt}</p>

      {/* Bins Container */}
      <div className={`grid gap-3 ${block.bins.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {block.bins.map((bin, idx) => {
          const isTargetGlow = selectedCardIdx !== null && draggingIdx === null;
          return (
            <div
              key={idx}
              ref={(el) => { binRefs.current[idx] = el; }}
              onClick={() => handleBinClick(idx)}
              className="border-2 border-dashed rounded-[var(--r-md)] p-4 flex flex-col items-center min-h-[160px] bg-neutral-100/50 transition-all cursor-pointer relative"
              style={{
                borderColor: isTargetGlow ? accent : 'var(--border)',
                background: 'var(--paper-1)',
              }}
            >
              <span className="text-3xl mb-1">{bin.emoji}</span>
              <span className="text-sm font-bold text-neutral-800 mb-3">{bin.label}</span>
              
              {/* Sorted items in this bin */}
              <div className="w-full flex flex-col gap-1.5 mt-auto">
                {sortedByBin[idx].map((card, cIdx) => (
                  <div
                    key={cIdx}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-[var(--r-sm)] text-xs text-emerald-800 font-semibold shadow-sm"
                  >
                    <span>{card.emoji}</span>
                    <span>{card.label}</span>
                    <Icon name="star" size={12} filled color="var(--ok)" className="ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unsorted Cards Pile */}
      {!isAllSorted && (
        <div className="bg-neutral-100/30 border border-[color:var(--line)] rounded-[var(--r-md)] p-4 flex flex-col items-center gap-3 bg-[color:var(--paper-0)]">
          <p className="text-xs font-semibold text-neutral-500">
            👇 카드를 알맞은 상자로 끌어다 놓거나, 카드를 누른 후 상자를 눌러보세요!
          </p>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {unsortedCards.map((card) => {
              const isSelected = selectedCardIdx === card.originalIdx;
              const isDragging = draggingIdx === card.originalIdx;
              const isError = errorCardIdx === card.originalIdx;
              
              return (
                <div
                  key={card.originalIdx}
                  ref={(el) => { cardRefs.current[card.originalIdx] = el; }}
                  onPointerDown={(e) => handlePointerDown(e, card.originalIdx)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={(e) => handlePointerUp(e, card.originalIdx)}
                  onClick={() => handleCardClick(card.originalIdx)}
                  className={`flex items-center gap-2 px-4 py-2.5 bg-[color:var(--paper-0)] border-2 rounded-[20px] shadow-sm font-bold text-sm select-none transition-all cursor-grab active:cursor-grabbing shrink-0 touch-none
                    ${isDragging ? 'z-50 shadow-lg scale-105' : ''}
                    ${isError ? 'answer-shake' : ''}
                  `}
                  style={{
                    borderColor: isSelected ? accent : 'var(--border)',
                    boxShadow: isSelected ? 'var(--e-2)' : 'var(--e-1)',
                    transform: isDragging 
                      ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` 
                      : 'none',
                    backgroundColor: isError ? 'var(--bad-bg)' : undefined,
                  }}
                >
                  <span className="text-xl">{card.emoji}</span>
                  <span>{card.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isAllSorted && (
        <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-800 rounded-[var(--r-md)] border border-emerald-200 font-bold">
          <Icon name="sparkles" size={20} filled color="var(--ok)" />
          모든 카드를 알맞게 분류했습니다!
        </div>
      )}
    </div>
  );
}
