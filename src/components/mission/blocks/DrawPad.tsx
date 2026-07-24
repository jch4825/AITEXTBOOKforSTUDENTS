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
  const [width, setWidth] = useState(WIDTHS[0]);
  const [isEraser, setIsEraser] = useState(false);

  // Initialize and resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Restore previous drawing if exists
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, []);

  function getPoint(e: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = getPoint(e);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
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
    drawingRef.current = false;
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL());
    }
  }

  function clearAll() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onChange('');
    }
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

      {/* 초록색 팔레트 패널 (Green Palette Header) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-t-[var(--r-md)] border-t border-x border-[color:var(--line)] bg-emerald-600 text-white shadow-xs">
        {/* Colors Selection */}
        <div className="flex items-center gap-2">
          {COLORS.map((col, idx) => {
            const isSelected = !isEraser && color === col.value;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setColor(col.value);
                  setIsEraser(false);
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
            onClick={() => setIsEraser(true)}
            className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white"
            style={{
              borderColor: isEraser ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
              boxShadow: isEraser ? '0 0 0 2px #047857' : undefined,
            }}
            title="지우개"
            aria-label="지우개"
          >
            <Icon name="eraser" size={18} color="#FFFFFF" />
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

      {/* Canvas Area */}
      <div
        className="w-full h-64 border-b border-x border-[color:var(--line)] rounded-b-[var(--r-md)] relative overflow-hidden"
        style={{ background: 'var(--paper-0)', boxShadow: 'var(--e-1)' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: 'none', cursor: 'crosshair' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    </div>
  );
}
