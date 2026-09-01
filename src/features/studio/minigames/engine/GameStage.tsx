import React, { useRef } from 'react';

export interface StagePointer {
  /** 0~100 가로 비율 */
  x: number;
  /** 0~100 세로 비율 */
  y: number;
  phase: 'down' | 'move' | 'up';
}

interface Props {
  onPointer?: (pointer: StagePointer) => void;
  /** 화면 낭독기용 장면 설명 */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * DOM 게임판.
 *
 * 캔버스가 필요 없는 게임(밀기 퍼즐·연결·정돈)은 실제 글자와 버튼을 쓰는 편이
 * 화면 낭독기와 글자 크기 설정에 훨씬 낫다. 그런 게임들이 좌표를 다루는 방법을
 * 여기서 하나로 맞춘다.
 *
 * 좌표는 0~100 비율이다. 픽셀을 쓰면 창 크기에 따라 배치가 무너지지만, 비율이면
 * 1280px에서도 768px에서도 같은 그림이 된다. 자식은 `left: x%`처럼 배치한다.
 */
export default function GameStage({ onPointer, ariaLabel, className = '', style, children }: Props) {
  const boxRef = useRef<HTMLDivElement | null>(null);

  const emit = (event: React.PointerEvent<HTMLDivElement>, phase: StagePointer['phase']) => {
    if (!onPointer) return;
    const box = boxRef.current?.getBoundingClientRect();
    if (!box || box.width === 0 || box.height === 0) return;
    onPointer({
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 100,
      phase,
    });
  };

  return (
    <div
      ref={boxRef}
      aria-label={ariaLabel}
      onPointerDown={onPointer ? (event) => {
        // 포인터 붙잡기는 실패할 수 있다. 실패해도 조작은 이어져야 한다.
        try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* 무시 */ }
        emit(event, 'down');
      } : undefined}
      onPointerMove={onPointer ? (event) => emit(event, 'move') : undefined}
      onPointerUp={onPointer ? (event) => {
        try { event.currentTarget.releasePointerCapture?.(event.pointerId); } catch { /* 무시 */ }
        emit(event, 'up');
      } : undefined}
      onPointerCancel={onPointer ? (event) => emit(event, 'up') : undefined}
      className={`relative min-h-0 w-full flex-1 overflow-hidden rounded-xl ${className}`}
      style={{
        background: 'var(--board-surface)',
        border: '2px solid var(--board-line)',
        touchAction: onPointer ? 'none' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
