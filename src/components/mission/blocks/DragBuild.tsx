import React, { useState, useRef, useEffect } from 'react';
import type { DragBuildBlock } from '../../../types';
import Icon from '../../Icon';
import SpeechBubble from '../../SpeechBubble';
import { useSpeak } from '../../../hooks/useSpeak';

interface Props {
  key?: any;
  block: DragBuildBlock;
  value: (number | null)[] | undefined; // maps slot index to piece index
  onChange: (value: (number | null)[]) => void;
  accent: string;
  accentSoft: string;
}

export default function DragBuild({ block, value, onChange, accent, accentSoft }: Props) {
  const { speak, speakNow } = useSpeak();
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
      speak(block.pieces[idx].label); // 잡은 조각을 읽어준다
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

  // 조립이 완성되는 순간 아이미의 답을 읽어준다 (복원 직후 재생 방지: 전이 시점만)
  const prevFilled = useRef(isFilled);
  useEffect(() => {
    if (isFilled && !prevFilled.current && responseText) {
      speakNow(responseText);
    }
    prevFilled.current = isFilled;
  }, [isFilled, responseText]);

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

      {/* Slots Builder Panel */}
      <div className="border-2 border-dashed rounded-[var(--r-md)] p-5" style={{ borderColor: accent, background: 'var(--paper-1)' }}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {block.slots.map((slot, idx) => {
            const pieceIdx = slotsValue[idx];
            const piece = pieceIdx !== null ? block.pieces[pieceIdx] : null;
            const isTargetGlow = selectedPieceIdx !== null && block.pieces[selectedPieceIdx].slot === idx;

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 w-full sm:w-auto">
                <span className="text-base font-bold" style={{ color: accent }}>{slot.label}</span>
                <div
                  ref={(el) => { slotRefs.current[idx] = el; }}
                  onClick={() => handleSlotClick(idx)}
                  className="w-full sm:w-48 h-16 rounded-[var(--r-sm)] border-2 border-dashed flex items-center justify-center bg-[color:var(--paper-0)] cursor-pointer transition-all relative overflow-hidden"
                  style={{
                    borderColor: isTargetGlow ? accent : 'var(--border)',
                    boxShadow: isTargetGlow ? 'var(--e-2)' : 'none',
                  }}
                >
                  {piece ? (
                    <div
                      className="answer-pop absolute inset-1 rounded-[var(--r-sm)] border-2 flex items-center justify-center font-bold text-base"
                      style={{
                        borderColor: piece.quality === 'good' ? 'var(--ok)' : 'var(--warn)',
                        background: piece.quality === 'good' ? 'var(--ok-bg)' : 'var(--warn-bg)',
                        color: 'var(--brand-ink)',
                      }}
                    >
                      {piece.label}
                      <Icon
                        name={piece.quality === 'good' ? 'check' : 'warning'}
                        size={14}
                        strokeWidth={3}
                        color={piece.quality === 'good' ? 'var(--ok)' : 'var(--warn)'}
                        className="ml-1.5 shrink-0"
                      />
                    </div>
                  ) : (
                    <span className="text-base font-medium" style={{ color: 'var(--muted)' }}>여기에 놓아요</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pieces Pool */}
      <div className="border border-[color:var(--line)] rounded-[var(--r-md)] p-4 flex flex-col items-center gap-3 bg-[color:var(--paper-0)]">
        <p className="text-base font-semibold" style={{ color: 'var(--muted)' }}>
          조각을 알맞은 칸으로 끌어다 놓거나, 조각을 누른 뒤 칸을 눌러 보세요.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
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
                className={`card3d flex items-center gap-1.5 px-5 py-3 rounded-[var(--r-md)] font-bold text-base select-none transition-all cursor-grab active:cursor-grabbing shrink-0 touch-none
                  ${isDragging ? 'z-50 scale-105' : ''}
                `}
                style={{
                  border: isSelected ? `4px solid ${accent}` : `2.5px solid ${accent}`,
                  background: isSelected ? accentSoft : 'var(--paper-0)',
                  color: 'var(--brand-ink)',
                  ['--edge' as string]: accent,
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

      {/* 아이미 응답 — 앱 공통 말풍선(SpeechBubble) 재사용, 읽어줘 버튼 포함 */}
      {isFilled && responseText && (
        <div className="mt-4">
          <SpeechBubble
            speaker="aimi"
            expression={isAllGood ? 'cheer' : 'thinking'}
            text={responseText}
            accent={accent}
            accentSoft={accentSoft}
            showSpeakButton
          />
        </div>
      )}
    </div>
  );
}
