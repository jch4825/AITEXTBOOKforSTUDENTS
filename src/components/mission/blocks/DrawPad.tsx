import React, { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { DrawBlock } from '../../../types';
import Icon from '../../Icon';
import { useSpeak } from '../../../hooks/useSpeak';

interface Props {
  key?: any;
  block: DrawBlock;
  value: string | undefined; // base64 dataURL
  onChange: (value: string) => void;
  accent: string;
}

interface FloatingTextItem {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  isEditing: boolean;
}

type ToolMode = 'pen' | 'eraser' | 'text';

const COLORS = [
  { name: '흰색', value: '#FFFFFF' },
  { name: '검정', value: '#0F172A' },
  { name: '노랑', value: '#FACC15' },
  { name: '하늘', value: '#38BDF8' },
  { name: '분홍', value: '#FB7185' },
  { name: '주황', value: '#FB923C' },
];

const WIDTHS = [3, 8];

export default function DrawPad({ block, value = '', onChange, accent }: Props) {
  const { speakNow } = useSpeak();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [color, setColor] = useState(COLORS[0].value); // 디폴트 흰색
  const [width, setWidth] = useState(WIDTHS[1]); // 디폴트 굵게 (8px)
  const [mode, setMode] = useState<ToolMode>('pen');

  // Text items for dragging & editing
  const [textItems, setTextItems] = useState<FloatingTextItem[]>([]);
  const draggingIdRef = useRef<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const isEraser = mode === 'eraser';

  // Initialize and resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, []);

  function saveCanvasWithTexts(updatedItems = textItems) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Rasterize committed text items into canvas
    updatedItems.forEach((item) => {
      if (!item.isEditing && item.text.trim()) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = item.color;
        ctx.font = `bold ${item.fontSize}px sans-serif, "Segoe UI Emoji"`;
        ctx.fillText(item.text, item.x + 8, item.y + item.fontSize);
      }
    });

    onChange(canvas.toDataURL());
  }

  function getPoint(e: ReactPointerEvent<HTMLCanvasElement> | React.PointerEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    const point = getPoint(e);
    if (mode === 'text') {
      // Create a new draggable text box at clicked location
      const newItem: FloatingTextItem = {
        id: `text-${Date.now()}`,
        x: Math.max(10, Math.min(point.x, 260)),
        y: Math.max(10, Math.min(point.y, 200)),
        text: '',
        color: color === '#FFFFFF' ? '#FFFFFF' : color,
        fontSize: width === 8 ? 22 : 16,
        isEditing: true,
      };
      setTextItems((prev) => [...prev, newItem]);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = point;
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (draggingIdRef.current) {
      const point = getPoint(e);
      const dx = point.x - dragStartRef.current.x;
      const dy = point.y - dragStartRef.current.y;
      dragStartRef.current = point;

      setTextItems((prev) =>
        prev.map((item) =>
          item.id === draggingIdRef.current
            ? { ...item, x: Math.max(0, item.x + dx), y: Math.max(0, item.y + dy) }
            : item
        )
      );
      return;
    }

    if (!drawingRef.current || mode === 'text') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const currentPoint = getPoint(e);
    const lastPoint = lastPointRef.current;

    if (lastPoint) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);

      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = width * 3;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
      ctx.stroke();
    }
    lastPointRef.current = currentPoint;
  }

  function handlePointerUp() {
    if (draggingIdRef.current) {
      draggingIdRef.current = null;
      saveCanvasWithTexts();
      return;
    }

    if (mode === 'text') return;
    drawingRef.current = false;
    lastPointRef.current = null;

    saveCanvasWithTexts();
  }

  function handleTextDragStart(id: string, e: React.PointerEvent) {
    e.stopPropagation();
    draggingIdRef.current = id;
    dragStartRef.current = getPoint(e);
  }

  function commitItemText(id: string) {
    setTextItems((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, isEditing: false } : item));
      saveCanvasWithTexts(next);
      return next;
    });
  }

  function removeItem(id: string) {
    setTextItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveCanvasWithTexts(next);
      return next;
    });
  }

  function clearAll() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onChange('');
    }
    setTextItems([]);
  }

  return (
    <div className="w-full space-y-3 story-fade-in select-none">
      <div className="flex items-start gap-2">
        <p className="text-xl font-semibold flex-1">{block.prompt}</p>
        <button
          type="button"
          onClick={() => speakNow(block.prompt)}
          aria-label="문제 다시 들려주기"
          className="shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center cursor-pointer"
          style={{ borderColor: accent, color: accent, background: 'var(--paper-0)' }}
        >
          <Icon name="speaker" size={20} />
        </button>
      </div>

      {/* 통합 그림판 카드 (Unified Drawing Board Container) */}
      <div className="rounded-[var(--r-md)] overflow-hidden border border-emerald-700 shadow-md">
        {/* 초록색 팔레트 패널 (Green Palette Header) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-600 text-white border-b border-white/30">
          {/* Colors Selection */}
          <div className="flex items-center gap-2">
            {COLORS.map((col, idx) => {
              const isSelected = mode === 'pen' && color === col.value;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setColor(col.value);
                    setMode('pen');
                  }}
                  className="w-9 h-9 rounded-full border-2 transition-transform hover:scale-105 cursor-pointer relative shadow-2xs"
                  style={{
                    backgroundColor: col.value,
                    borderColor: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                    boxShadow: isSelected ? '0 0 0 2px #047857' : undefined,
                  }}
                  title={col.name}
                  aria-label={col.name}
                >
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center" style={{ color: col.value === '#FFFFFF' ? '#047857' : '#FFFFFF' }}>
                      <Icon name="check" size={16} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
            {/* Eraser */}
            <button
              type="button"
              onClick={() => setMode('eraser')}
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white"
              style={{
                borderColor: mode === 'eraser' ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                boxShadow: mode === 'eraser' ? '0 0 0 2px #047857' : undefined,
              }}
              title="지우개"
              aria-label="지우개"
            >
              <Icon name="eraser" size={18} color="#FFFFFF" />
            </button>

            {/* Text Box Tool ('T') */}
            <button
              type="button"
              onClick={() => setMode('text')}
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-black text-base transition-all cursor-pointer shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white"
              style={{
                borderColor: mode === 'text' ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                boxShadow: mode === 'text' ? '0 0 0 2px #047857' : undefined,
              }}
              title="텍스트 상자 입력 & 이동 (T)"
              aria-label="텍스트 상자 입력 및 이동"
            >
              T
            </button>
          </div>

          {/* Thickness & Clear */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border border-emerald-500 rounded-[var(--r-sm)] p-1 bg-emerald-700/60">
              {WIDTHS.map((w, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setWidth(w)}
                  className="px-2.5 h-8 rounded-[4px] font-bold text-xs flex items-center justify-center cursor-pointer transition"
                  style={{
                    background: width === w ? '#FFFFFF' : 'transparent',
                    color: width === w ? '#047857' : '#FFFFFF',
                  }}
                >
                  {w === WIDTHS[0] ? '얇게' : '굵게'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="px-3 h-9 rounded-[var(--r-sm)] border border-emerald-400 font-bold text-xs flex items-center gap-1 cursor-pointer bg-white text-rose-600 hover:bg-rose-50 transition shadow-2xs"
            >
              <Icon name="refresh" size={14} color="currentColor" /> 전체 지우기
            </button>
          </div>
        </div>

        {/* Canvas Area (칠판 감성의 딥 그린 캔버스) */}
        <div
          className="w-full h-64 relative overflow-hidden"
          style={{ background: '#064E3B' }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ touchAction: 'none', cursor: mode === 'text' ? 'crosshair' : 'default' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          {/* Draggable & Editable Text Items Layer */}
          {textItems.map((item) => (
            <div
              key={item.id}
              className="absolute z-20 flex items-center gap-1 bg-emerald-950/90 border border-emerald-300/80 px-2 py-1 rounded-lg shadow-xl cursor-move touch-none group"
              style={{
                left: item.x,
                top: item.y,
              }}
              onPointerDown={(e) => handleTextDragStart(item.id, e)}
            >
              {/* Drag Handle Icon */}
              <span className="text-emerald-400 text-xs font-mono cursor-grab active:cursor-grabbing select-none pr-1">
                ⋮⋮
              </span>

              {item.isEditing ? (
                <input
                  type="text"
                  autoFocus
                  value={item.text}
                  onChange={(e) =>
                    setTextItems((prev) =>
                      prev.map((t) => (t.id === item.id ? { ...t, text: e.target.value } : t))
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitItemText(item.id);
                  }}
                  onBlur={() => commitItemText(item.id)}
                  placeholder="글자 입력..."
                  className="bg-transparent font-bold outline-none border-b border-emerald-400 w-28 sm:w-40"
                  style={{ color: item.color, fontSize: `${item.fontSize}px` }}
                />
              ) : (
                <span
                  className="font-bold cursor-pointer select-none"
                  style={{ color: item.color, fontSize: `${item.fontSize}px` }}
                  onDoubleClick={() =>
                    setTextItems((prev) =>
                      prev.map((t) => (t.id === item.id ? { ...t, isEditing: true } : t))
                    )
                  }
                >
                  {item.text || '(빈 텍스트)'}
                </span>
              )}

              {/* Delete button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                aria-label="텍스트 삭제"
                className="text-emerald-300 hover:text-rose-400 font-bold text-sm ml-1 px-1 cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
