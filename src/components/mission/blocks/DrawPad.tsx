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

interface ActiveText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
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

  // AutoDraw-style Active Text State
  const [activeText, setActiveText] = useState<ActiveText | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const isDraggingTextRef = useRef(false);
  const textDragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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

  function getPoint(e: ReactPointerEvent<HTMLCanvasElement> | React.PointerEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    const point = getPoint(e);
    if (mode === 'text') {
      // AutoDraw style: If active text already exists with content, commit it first
      if (activeText && activeText.text.trim()) {
        commitActiveText();
      }

      // Create new AutoDraw-style borderless text input at click location
      const fontSize = width === 8 ? 22 : 16;
      setActiveText({
        id: `text-${Date.now()}`,
        x: Math.max(10, Math.min(point.x, 260)),
        y: Math.max(10, Math.min(point.y, 200)),
        text: '',
        color: color === '#FFFFFF' ? '#FFFFFF' : color,
        fontSize,
      });

      setTimeout(() => textInputRef.current?.focus(), 50);
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = point;
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (isDraggingTextRef.current && activeText && textContainerRef.current) {
      const point = getPoint(e);
      const newX = Math.max(0, point.x - textDragOffsetRef.current.x);
      const newY = Math.max(0, point.y - textDragOffsetRef.current.y);

      // Direct DOM manipulation for silky smooth 60fps drag
      textContainerRef.current.style.left = `${newX}px`;
      textContainerRef.current.style.top = `${newY}px`;
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
    if (isDraggingTextRef.current && textContainerRef.current && activeText) {
      isDraggingTextRef.current = false;
      const finalX = parseFloat(textContainerRef.current.style.left) || activeText.x;
      const finalY = parseFloat(textContainerRef.current.style.top) || activeText.y;
      setActiveText((prev) => (prev ? { ...prev, x: finalX, y: finalY } : null));
      return;
    }

    if (mode === 'text') return;
    drawingRef.current = false;
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL());
    }
  }

  function handleTextContainerPointerDown(e: React.PointerEvent) {
    if (mode !== 'text') return;
    e.stopPropagation();
    isDraggingTextRef.current = true;
    const point = getPoint(e);
    const container = textContainerRef.current;
    if (container) {
      const currentX = parseFloat(container.style.left) || activeText?.x || 0;
      const currentY = parseFloat(container.style.top) || activeText?.y || 0;
      textDragOffsetRef.current = {
        x: point.x - currentX,
        y: point.y - currentY,
      };
    }
  }

  function commitActiveText() {
    if (!activeText || !activeText.text.trim()) {
      setActiveText(null);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && textContainerRef.current) {
      const finalX = parseFloat(textContainerRef.current.style.left) || activeText.x;
      const finalY = parseFloat(textContainerRef.current.style.top) || activeText.y;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = activeText.color;
      ctx.font = `bold ${activeText.fontSize}px sans-serif, "Segoe UI Emoji"`;
      ctx.fillText(activeText.text, finalX + 4, finalY + activeText.fontSize);
      onChange(canvas.toDataURL());
    }

    setActiveText(null);
  }

  function cancelActiveText() {
    setActiveText(null);
  }

  function clearAll() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onChange('');
    }
    setActiveText(null);
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

            {/* AutoDraw-style Text Tool ('T') */}
            <button
              type="button"
              onClick={() => setMode('text')}
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-black text-base transition-all cursor-pointer shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white"
              style={{
                borderColor: mode === 'text' ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                boxShadow: mode === 'text' ? '0 0 0 2px #047857' : undefined,
              }}
              title="AutoDraw 텍스트 도구 (T)"
              aria-label="AutoDraw 텍스트 도구"
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
            style={{ touchAction: 'none', cursor: mode === 'text' ? 'text' : 'crosshair' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          {/* AutoDraw-Style Frameless Text Tool Overlay */}
          {activeText && (
            <div
              ref={textContainerRef}
              className="absolute z-20 flex items-center gap-1.5 cursor-move touch-none"
              style={{
                left: `${activeText.x}px`,
                top: `${activeText.y}px`,
              }}
              onPointerDown={handleTextContainerPointerDown}
            >
              <input
                ref={textInputRef}
                type="text"
                value={activeText.text}
                onChange={(e) => setActiveText({ ...activeText, text: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitActiveText();
                  if (e.key === 'Escape') cancelActiveText();
                }}
                placeholder="글자를 적으세요..."
                className="bg-transparent font-bold outline-none border-b-2 border-dashed border-white/70 px-1 py-0.5 tracking-wide"
                style={{
                  color: activeText.color,
                  fontSize: `${activeText.fontSize}px`,
                  width: `${Math.max(130, activeText.text.length * (activeText.fontSize * 0.75) + 30)}px`,
                }}
              />
              <button
                type="button"
                onClick={commitActiveText}
                title="칠판에 고정 (Enter)"
                className="px-2 py-0.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs rounded cursor-pointer shadow-xs transition shrink-0"
              >
                확인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
