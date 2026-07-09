import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import Icon from './Icon';

const PEN_COLORS = [
  { name: '남색', value: '#2B3A55' },
  { name: '파랑', value: '#5A7DA0' },
  { name: '초록', value: '#4F9E8B' },
  { name: '갈색', value: '#B07A4F' },
  { name: '보라', value: '#9A6CA0' },
];
const STROKE_WIDTHS = [4, 10];

interface Props {
  onClose: () => void;
}

/**
 * 전체화면 필기 오버레이 — 도크와 독립된 z-50 레이어 (§3.2). 휘발성: 저장 없음.
 */
export default function DrawBoard({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(PEN_COLORS[0].value);
  const [width, setWidth] = useState(STROKE_WIDTHS[0]);
  const [erasing, setErasing] = useState(false);

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
    const ctx = canvasRef.current?.getContext('2d');
    const last = lastPointRef.current;
    if (!ctx || !last) return;
    const point = getPoint(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = erasing ? width * 3 : width;
    ctx.strokeStyle = color;
    ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function handlePointerUp() {
    drawingRef.current = false;
    lastPointRef.current = null;
  }

  function clearAll() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="판서">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ touchAction: 'none', cursor: 'crosshair' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-[var(--r-pill)] flex-wrap justify-center max-w-[95vw]"
        style={{ background: 'var(--paper-0)', boxShadow: 'var(--e-2)' }}
      >
        {PEN_COLORS.map((p) => (
          <button
            key={p.value}
            onClick={() => { setColor(p.value); setErasing(false); }}
            aria-label={`펜 색 ${p.name}`}
            aria-pressed={!erasing && color === p.value}
            className="h-9 w-9 rounded-full shrink-0"
            style={{
              background: p.value,
              outline: !erasing && color === p.value ? '3px solid var(--accent)' : 'none',
              outlineOffset: 2,
            }}
          />
        ))}
        <div className="w-px h-8 mx-1" style={{ background: 'var(--border)' }} />
        {STROKE_WIDTHS.map((w) => (
          <button
            key={w}
            onClick={() => setWidth(w)}
            aria-label={w === STROKE_WIDTHS[0] ? '굵기 얇게' : '굵기 굵게'}
            aria-pressed={width === w}
            className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: width === w ? 'var(--paper-2)' : 'transparent' }}
          >
            <span className="rounded-full" style={{ width: w, height: w, background: 'var(--ink-1)' }} />
          </button>
        ))}
        <div className="w-px h-8 mx-1" style={{ background: 'var(--border)' }} />
        <button
          onClick={() => setErasing(true)}
          aria-label="지우개"
          aria-pressed={erasing}
          className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: erasing ? 'var(--paper-2)' : 'transparent' }}
        ><Icon name="cross" size={18} /></button>
        <button
          onClick={clearAll}
          aria-label="전체 지우기"
          className="h-9 px-3 rounded-[var(--r-pill)] shrink-0 text-sm font-semibold"
        >전체 지우기</button>
        <button
          onClick={onClose}
          aria-label="판서 닫기"
          className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'var(--paper-2)' }}
        ><Icon name="close" size={18} /></button>
      </div>
    </div>
  );
}
