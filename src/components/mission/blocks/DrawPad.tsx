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
  { name: '검정', value: '#2D2A26' },
  { name: '빨강', value: '#EF4444' },
  { name: '파랑', value: '#3B82F6' },
  { name: '초록', value: '#10B981' },
  { name: '노랑', value: '#F59E0B' },
];

const WIDTHS = [3, 8];

export default function DrawPad({ block, value = '', onChange, accent }: Props) {
  const { speakNow } = useSpeak();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [color, setColor] = useState(COLORS[0].value);
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
    // Omit value from dependency array to prevent infinite re-drawing loops
    // since we only want to load it once on mount.
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
    const last = lastPointRef.current;
    if (!canvas || !ctx || !last) return;

    const point = getPoint(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = isEraser ? width * 3 : width;
    ctx.strokeStyle = isEraser ? '#FDFCFA' : color; // Erase matches background paper-0
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    lastPointRef.current = point;
  }

  function handlePointerUp() {
    drawingRef.current = false;
    lastPointRef.current = null;

    // Save image to state
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
          className="shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: accent, color: accent, background: 'var(--paper-0)' }}
        >
          <Icon name="speaker" size={20} />
        </button>
      </div>

      {/* Editor Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-t-[var(--r-md)] border-t border-x border-[color:var(--line)]" style={{ background: 'var(--paper-1)' }}>
        {/* Colors Selection */}
        <div className="flex items-center gap-2">
          {COLORS.map((col, idx) => (
            <button
              key={idx}
              onClick={() => {
                setColor(col.value);
                setIsEraser(false);
              }}
              className="w-8 h-8 rounded-full border-2 transition-all cursor-pointer relative"
              style={{
                backgroundColor: col.value,
                borderColor: (!isEraser && color === col.value) ? 'var(--accent)' : 'transparent',
              }}
              title={col.name}
              aria-label={col.name}
            >
              {!isEraser && color === col.value && (
                <span className="absolute inset-0 flex items-center justify-center text-white">
                  <Icon name="check" size={14} strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
          {/* Eraser */}
          <button
            onClick={() => setIsEraser(true)}
            className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shrink-0"
            style={{
              background: 'var(--paper-2)',
              borderColor: isEraser ? accent : 'transparent',
            }}
            title="지우개"
            aria-label="지우개"
          >
            <Icon name="eraser" size={16} color={isEraser ? accent : 'var(--ink-2)'} />
          </button>
        </div>

        {/* Thickness & Clear */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-[color:var(--line)] rounded-[var(--r-sm)] p-1" style={{ background: 'var(--paper-0)' }}>
            {WIDTHS.map((w, idx) => (
              <button
                key={idx}
                onClick={() => setWidth(w)}
                className="px-2.5 h-9 rounded-[4px] font-bold text-sm flex items-center justify-center cursor-pointer"
                style={{
                  background: width === w ? 'var(--paper-2)' : 'transparent',
                  color: 'var(--brand-ink)',
                }}
              >
                {w === WIDTHS[0] ? '얇게' : '굵게'}
              </button>
            ))}
          </div>

          <button
            onClick={clearAll}
            className="px-3 h-9 rounded-[var(--r-sm)] border-2 font-bold text-sm flex items-center gap-1 cursor-pointer"
            style={{ borderColor: 'var(--warn)', color: 'var(--warn)', background: 'var(--paper-0)' }}
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
