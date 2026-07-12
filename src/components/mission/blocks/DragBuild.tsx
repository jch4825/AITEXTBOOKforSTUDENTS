import React, { useState, useRef } from 'react';
import type { DragBuildBlock } from '../../../types';
import Icon from '../../Icon';
import CharacterAvatar from '../../CharacterAvatar';

interface Props {
  key?: any;
  block: DragBuildBlock;
  value: (number | null)[] | undefined; // maps slot index to piece index
  onChange: (value: (number | null)[]) => void;
  accent: string;
  accentSoft: string;
}

export default function DragBuild({ block, value, onChange, accent, accentSoft }: Props) {
  // Initialize slots
  const slotsValue = value || Array(block.slots.length).fill(null);
  
  const [selectedPieceIdx, setSelectedPieceIdx] = useState<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const startPos = useRef({ x: 0, y: 0 });
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pieceRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handlePieceClick = (idx: number) => {
    // If the piece is already placed in a slot, we can click it to return it to the pool
    const slotIdx = slotsValue.indexOf(idx);
    if (slotIdx !== -1) {
      const nextSlots = [...slotsValue];
      nextSlots[slotIdx] = null;
      onChange(nextSlots);
      setSelectedPieceIdx(null);
      return;
    }

    if (selectedPieceIdx === idx) {
      setSelectedPieceIdx(null);
    } else {
      setSelectedPieceIdx(idx);
    }
  };

  const handleSlotClick = (slotIdx: number) => {
    // If we have a selected piece that matches this slot's target slot type, place it
    if (selectedPieceIdx === null) {
      // If slot is occupied, clicking it removes the piece
      if (slotsValue[slotIdx] !== null) {
        const nextSlots = [...slotsValue];
        nextSlots[slotIdx] = null;
        onChange(nextSlots);
      }
      return;
    }

    const piece = block.pieces[selectedPieceIdx];
    if (piece.slot === slotIdx) {
      const nextSlots = [...slotsValue];
      // If slot is occupied by another piece, it returns to pool implicitly
      nextSlots[slotIdx] = selectedPieceIdx;
      onChange(nextSlots);
      setSelectedPieceIdx(null);
    }
  };

  // Pointer dragging
  const handlePointerDown = (e: React.PointerEvent, idx: number) => {
    e.preventDefault();
    // Check if piece is in pool or slot
    const slotIdx = slotsValue.indexOf(idx);
    if (slotIdx !== -1) {
      // Pulling it out of the slot
      const nextSlots = [...slotsValue];
      nextSlots[slotIdx] = null;
      onChange(nextSlots);
    }

    setSelectedPieceIdx(idx);
    setDraggingIdx(idx);
    startPos.current = { x: e.clientX, y: e.clientY };
    setDragOffset({ x: 0, y: 0 });

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIdx === null) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent, idx: number) => {
    if (draggingIdx === null) return;
    const target = e.currentTarget as HTMLElement;
    target.releasePointerCapture(e.pointerId);

    setDraggingIdx(null);

    // Collision check
    const pieceEl = pieceRefs.current[idx];
    if (!pieceEl) return;
    const pieceRect = pieceEl.getBoundingClientRect();
    const px = pieceRect.left + pieceRect.width / 2;
    const py = pieceRect.top + pieceRect.height / 2;

    let droppedSlotIdx = -1;
    for (let i = 0; i < block.slots.length; i++) {
      const slotEl = slotRefs.current[i];
      if (!slotEl) continue;
      const slotRect = slotEl.getBoundingClientRect();

      if (px >= slotRect.left && px <= slotRect.right && py >= slotRect.top && py <= slotRect.bottom) {
        droppedSlotIdx = i;
        break;
      }
    }

    const piece = block.pieces[idx];
    if (droppedSlotIdx !== -1 && piece.slot === droppedSlotIdx) {
      // Placed in slot
      const nextSlots = [...slotsValue];
      nextSlots[droppedSlotIdx] = idx;
      onChange(nextSlots);
      setSelectedPieceIdx(null);
    }

    setDragOffset({ x: 0, y: 0 });
  };

  // Check if all slots are filled
  const isFilled = slotsValue.every((s) => s !== null);

  // Check quality of built sentence
  const isAllGood = isFilled && slotsValue.every((pieceIdx) => {
    return block.pieces[pieceIdx!].quality === 'good';
  });

  const responseText = isFilled 
    ? (isAllGood ? block.response.good : block.response.weak)
    : null;

  return (
    <div className="w-full space-y-4 story-fade-in select-none">
      <p className="text-lg font-bold text-neutral-800">{block.prompt}</p>

      {/* Slots Builder Panel */}
      <div className="bg-neutral-100/50 border-2 border-dashed border-[color:var(--line)] rounded-[var(--r-md)] p-5 bg-[color:var(--paper-1)]">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {block.slots.map((slot, idx) => {
            const pieceIdx = slotsValue[idx];
            const piece = pieceIdx !== null ? block.pieces[pieceIdx] : null;
            const isTargetGlow = selectedPieceIdx !== null && block.pieces[selectedPieceIdx].slot === idx;

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 w-full sm:w-auto">
                <span className="text-xs font-semibold text-neutral-500">{slot.label}</span>
                <div
                  ref={(el) => { slotRefs.current[idx] = el; }}
                  onClick={() => handleSlotClick(idx)}
                  className="w-full sm:w-44 h-14 rounded-[var(--r-sm)] border-2 border-dashed flex items-center justify-center bg-[color:var(--paper-0)] cursor-pointer transition-all relative overflow-hidden"
                  style={{
                    borderColor: isTargetGlow ? accent : 'var(--border)',
                    boxShadow: isTargetGlow ? 'var(--e-2)' : 'none',
                  }}
                >
                  {piece ? (
                    <div
                      className="absolute inset-1 rounded-[var(--r-sm)] border flex items-center justify-center font-bold text-sm bg-neutral-50 shadow-sm"
                      style={{
                        borderColor: piece.quality === 'good' ? 'var(--ok)' : 'var(--warn)',
                        backgroundColor: piece.quality === 'good' ? 'rgba(22, 163, 74, 0.05)' : 'rgba(234, 88, 12, 0.05)',
                      }}
                    >
                      {piece.label}
                      <Icon 
                        name={piece.quality === 'good' ? 'star' : 'warning'} 
                        size={12} 
                        filled
                        color={piece.quality === 'good' ? 'var(--ok)' : 'var(--warn)'} 
                        className="ml-1.5 shrink-0" 
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-400 font-medium">여기에 놓으세요</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pieces Pool */}
      <div className="bg-neutral-100/30 border border-[color:var(--line)] rounded-[var(--r-md)] p-4 flex flex-col items-center gap-3 bg-[color:var(--paper-0)]">
        <p className="text-xs font-semibold text-neutral-500">
          👇 알맞은 슬롯으로 조각을 끌어다 놓거나, 조각을 누른 후 슬롯을 눌러 조립해 보세요!
        </p>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {block.pieces.map((piece, idx) => {
            const isPlaced = slotsValue.includes(idx);
            if (isPlaced) return null; // Hide from pool if placed

            const isSelected = selectedPieceIdx === idx;
            const isDragging = draggingIdx === idx;

            return (
              <button
                key={idx}
                ref={(el) => { pieceRefs.current[idx] = el; }}
                onPointerDown={(e) => handlePointerDown(e, idx)}
                onPointerMove={handlePointerMove}
                onPointerUp={(e) => handlePointerUp(e, idx)}
                onClick={() => handlePieceClick(idx)}
                className={`flex items-center gap-1.5 px-4 py-2 bg-[color:var(--paper-0)] border-2 rounded-[var(--r-sm)] shadow-sm font-bold text-sm select-none transition-all cursor-grab active:cursor-grabbing shrink-0 touch-none
                  ${isDragging ? 'z-50 shadow-lg scale-105' : ''}
                `}
                style={{
                  borderColor: isSelected ? accent : 'var(--border)',
                  boxShadow: isSelected ? 'var(--e-2)' : 'var(--e-1)',
                  transform: isDragging 
                    ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` 
                    : 'none',
                }}
              >
                <span>{piece.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aimi's Response Bubble */}
      {isFilled && responseText && (
        <div className="flex items-start gap-3 mt-4 p-4 rounded-[var(--r-md)] bg-[color:var(--paper-1)] border border-[color:var(--line)]">
          <div className="shrink-0">
            <CharacterAvatar character="aimi" expression={isAllGood ? 'cheer' : 'thinking'} size={40} idle={false} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-neutral-500">아이미</p>
            <p className="text-sm font-bold mt-0.5 leading-relaxed" style={{ color: isAllGood ? 'var(--ok)' : 'var(--warn)' }}>
              {isAllGood ? '🎉 완성된 프롬프트입니다!' : '💡 조금 더 다듬어 볼까요?'}
            </p>
            <p className="text-sm leading-relaxed mt-1 text-neutral-700">{responseText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
