import React, { useEffect, useRef, useState } from 'react';
import { Type, GripVertical, X } from 'lucide-react';
import { FontScale, applyFontScale, loadFontScale } from '../utils/a11y';
import {
  getWidgetCollapsed,
  loadWidgetPos,
  saveWidgetCollapsed,
  saveWidgetPos,
  STORAGE_KEYS,
} from '../services/storage';

type Pos = { x: number; y: number };

function clampToViewport(p: Pos, w: number, h: number): Pos {
  const maxX = Math.max(0, window.innerWidth - w - 4);
  const maxY = Math.max(0, window.innerHeight - h - 4);
  return {
    x: Math.min(Math.max(4, p.x), maxX),
    y: Math.min(Math.max(4, p.y), maxY),
  };
}

export default function AccessibilityWidget() {
  const [scale, setScale] = useState<FontScale>(() => loadFontScale());
  const [pos, setPos] = useState<Pos | null>(() => loadWidgetPos());
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (window.innerWidth < 640) return true;
    return getWidgetCollapsed();
  });
  const expandedRef = useRef<HTMLDivElement>(null);
  const collapsedRef = useRef<HTMLButtonElement>(null);
  const dragStart = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);
  const getWidgetElement = () => (collapsed ? collapsedRef.current : expandedRef.current);

  const toggleCollapsed = (next: boolean) => {
    setCollapsed(next);
    saveWidgetCollapsed(next);
  };

  useEffect(() => {
    applyFontScale(scale);
  }, [scale]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.diagnostic.fontScale && e.newValue) {
        const next = e.newValue as FontScale;
        if (next in { normal: 1, large: 1, xlarge: 1 }) setScale(next);
      } else if (e.key === STORAGE_KEYS.diagnostic.fontScale && !e.newValue) {
        setScale('normal');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const element = getWidgetElement();
      if (!pos || !element) return;
      const rect = element.getBoundingClientRect();
      setPos(clampToViewport(pos, rect.width, rect.height));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [pos, collapsed]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const element = getWidgetElement();
      if (!dragStart.current || !element) return;
      const dx = e.clientX - dragStart.current.pointerX;
      const dy = e.clientY - dragStart.current.pointerY;
      const rect = element.getBoundingClientRect();
      const next = clampToViewport(
        { x: dragStart.current.x + dx, y: dragStart.current.y + dy },
        rect.width,
        rect.height,
      );
      setPos(next);
    };
    const onUp = () => {
      setDragging(false);
      dragStart.current = null;
      if (pos) saveWidgetPos(pos);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragging, pos]);

  const handleDragStart = (e: React.PointerEvent) => {
    const element = getWidgetElement();
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const startPos = pos ?? { x: rect.left, y: rect.top };
    dragStart.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      x: startPos.x,
      y: startPos.y,
    };
    
    // Modern way to handle dragging: capture the pointer
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    setPos(startPos);
    setDragging(true);
    e.preventDefault();
  };

  const options: { value: FontScale; label: string; size: string }[] = [
    { value: 'normal', label: '보통', size: 'text-xs' },
    { value: 'large', label: '크게', size: 'text-sm' },
    { value: 'xlarge', label: '더 크게', size: 'text-base' },
  ];

  const style: React.CSSProperties = {
    ...(pos
      ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto', transform: 'none' }
      : { right: 16, bottom: 16, left: 'auto', top: 'auto', transform: 'none' }),
    touchAction: 'none' // Prevent scrolling while dragging on mobile
  };

  if (collapsed) {
    return (
      <button
        ref={collapsedRef}
        style={style}
        onClick={() => toggleCollapsed(false)}
        aria-label="글자 크기 위젯 열기"
        title="글자 크기 위젯 열기"
        className="fixed z-[100] bg-white border border-gray-200 rounded-full shadow-lg w-9 h-9 flex items-center justify-center text-gray-400 hover:text-canva-purple hover:border-canva-purple transition-colors"
      >
        <Type size={16} />
      </button>
    );
  }

  return (
    <div
      ref={expandedRef}
      style={style}
      className={`fixed z-[100] bg-white border border-gray-200 rounded-full shadow-lg pl-1 pr-2 py-2 flex items-center gap-2 select-none ${
        dragging ? 'cursor-grabbing shadow-2xl' : ''
      }`}
    >
      <button
        onPointerDown={handleDragStart}
        aria-label="위젯 이동 (드래그)"
        title="드래그해서 위치 이동"
        style={{ touchAction: 'none' }}
        className={`flex items-center px-2 py-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <GripVertical size={16} />
      </button>
      <Type size={16} className="text-gray-500" aria-hidden />
      <span className="text-xs text-gray-500 font-medium hidden sm:inline">글자 크기</span>
      <div className="flex items-center gap-1" role="group" aria-label="글자 크기 조절">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => setScale(opt.value)}
            aria-pressed={scale === opt.value}
            className={`${opt.size} px-2 py-2 min-w-[2.75rem] rounded-full font-bold transition-colors ${
              scale === opt.value
                ? 'bg-canva-purple text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => toggleCollapsed(true)}
        aria-label="위젯 닫기"
        title="위젯 닫기"
        className="flex items-center px-1.5 py-1.5 rounded-full text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
