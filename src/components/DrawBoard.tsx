import React, { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import Icon from './Icon';

interface ActiveText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
}

type ToolMode = 'pen' | 'eraser' | 'text';

const PEN_COLORS = [
  { name: '흰색', value: '#FFFFFF' },
  { name: '검정', value: '#0F172A' },
  { name: '노랑', value: '#FACC15' },
  { name: '하늘', value: '#38BDF8' },
  { name: '분홍', value: '#FB7185' },
  { name: '주황', value: '#FB923C' },
];
const STROKE_WIDTHS = [4, 10];

interface Props {
  onClose: () => void;
}

/**
 * 전체화면 필기 오버레이 — 도크와 독립된 z-50 레이어. 칠판 감성의 딥 그린 배경 & AutoDraw 텍스트 지원.
 */
export default function DrawBoard({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [color, setColor] = useState(PEN_COLORS[0].value); // 디폴트 흰색
  const [width, setWidth] = useState(STROKE_WIDTHS[1]); // 디폴트 굵게
  const [mode, setMode] = useState<ToolMode>('pen');

  const [activeText, setActiveText] = useState<ActiveText | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const isDraggingTextRef = useRef(false);
  const textDragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const isEraser = mode === 'eraser';

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  function selectToolMode(newMode: ToolMode, newColor?: string) {
    if (activeText) {
      if (activeText.text.trim()) {
        commitActiveText();
      } else {
        setActiveText(null);
      }
    }
    if (newColor) setColor(newColor);
    setMode(newMode);
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
      if (activeText && activeText.text.trim()) {
        commitActiveText();
      }
      const fontSize = width === 10 ? 28 : 20;
      setActiveText({
        id: `text-${Date.now()}`,
        x: Math.max(10, Math.min(point.x, window.innerWidth - 180)),
        y: Math.max(10, Math.min(point.y, window.innerHeight - 80)),
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
      const newX = Math.max(0, Math.min(point.x - textDragOffsetRef.current.x, window.innerWidth - 120));
      const newY = Math.max(0, Math.min(point.y - textDragOffsetRef.current.y, window.innerHeight - 50));
      textContainerRef.current.style.left = `${newX}px`;
      textContainerRef.current.style.top = `${newY}px`;
      return;
    }

    if (!drawingRef.current || mode === 'text') return;
    const ctx = canvasRef.current?.getContext('2d');
    const last = lastPointRef.current;
    if (!ctx || !last) return;
    const point = getPoint(e);

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);

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
    lastPointRef.current = point;
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
    }

    setActiveText(null);
  }

  function clearAll() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setActiveText(null);
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#064E3B]" role="dialog" aria-label="칠판 판서">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: 'none', cursor: mode === 'text' ? 'text' : 'crosshair' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {/* AutoDraw Text Overlay */}
      {activeText && mode === 'text' && (
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
              if (e.key === 'Escape') setActiveText(null);
            }}
            placeholder="글자를 적으세요..."
            className="bg-transparent font-bold outline-none border-b-2 border-dashed border-white/70 px-1 py-0.5 tracking-wide text-white"
            style={{
              color: activeText.color,
              fontSize: `${activeText.fontSize}px`,
              width: `${Math.max(140, activeText.text.length * (activeText.fontSize * 0.8) + 40)}px`,
            }}
          />
          <button
            type="button"
            onClick={commitActiveText}
            title="칠판에 고정 (Enter)"
            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs rounded cursor-pointer shadow-xs transition shrink-0"
          >
            확인
          </button>
        </div>
      )}

      {/* 칠판 팔레트 제어 바 */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2.5 rounded-[var(--r-pill)] flex-wrap justify-center max-w-[95vw] bg-emerald-700 text-white border border-emerald-500 shadow-2xl"
      >
        {PEN_COLORS.map((p) => {
          const isSelected = mode === 'pen' && color === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => selectToolMode('pen', p.value)}
              aria-label={`펜 색 ${p.name}`}
              className="h-9 w-9 rounded-full shrink-0 relative transition-transform hover:scale-105 cursor-pointer"
              style={{
                background: p.value,
                outline: isSelected ? '3px solid #FFFFFF' : 'none',
                outlineOffset: 2,
              }}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center" style={{ color: p.value === '#FFFFFF' ? '#047857' : '#FFFFFF' }}>
                  <Icon name="check" size={16} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
        <div className="w-px h-8 mx-1 bg-emerald-500/50" />
        
        {/* Eraser */}
        <button
          type="button"
          onClick={() => selectToolMode('eraser')}
          aria-label="지우개"
          className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 border transition-all cursor-pointer"
          style={{
            background: mode === 'eraser' ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
            borderColor: mode === 'eraser' ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
            color: mode === 'eraser' ? '#047857' : '#FFFFFF',
          }}
        >
          <Icon name="eraser" size={18} color="currentColor" />
        </button>

        {/* Text Tool ('T') */}
        <button
          type="button"
          onClick={() => {
            if (mode === 'text') selectToolMode('pen');
            else selectToolMode('text');
          }}
          aria-label="AutoDraw 텍스트 도구 (T)"
          className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 font-black text-base border transition-all cursor-pointer"
          style={{
            background: mode === 'text' ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
            borderColor: mode === 'text' ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
            color: mode === 'text' ? '#047857' : '#FFFFFF',
          }}
        >
          T
        </button>

        <div className="w-px h-8 mx-1 bg-emerald-500/50" />
        
        {/* Widths */}
        {STROKE_WIDTHS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setWidth(w)}
            aria-label={w === STROKE_WIDTHS[0] ? '굵기 얇게' : '굵기 굵게'}
            className="px-2.5 h-8 rounded-[4px] font-bold text-xs flex items-center justify-center cursor-pointer transition"
            style={{
              background: width === w ? '#FFFFFF' : 'transparent',
              color: width === w ? '#047857' : '#FFFFFF',
            }}
          >
            {w === STROKE_WIDTHS[0] ? '얇게' : '굵게'}
          </button>
        ))}

        <div className="w-px h-8 mx-1 bg-emerald-500/50" />
        
        <button
          type="button"
          onClick={clearAll}
          aria-label="전체 지우기"
          className="h-9 px-3 rounded-[var(--r-pill)] shrink-0 text-xs font-bold bg-white text-rose-600 hover:bg-rose-50 cursor-pointer shadow-xs"
        >
          전체 지우기
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="판서 닫기"
          className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer"
        >
          <Icon name="close" size={18} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
}
