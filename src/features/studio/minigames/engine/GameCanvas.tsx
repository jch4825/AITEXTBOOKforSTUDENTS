import React, { useEffect, useRef } from 'react';
import { useGameLoop } from './useGameLoop';

export interface CanvasPointer {
  x: number;
  y: number;
  phase: 'down' | 'move' | 'up';
}

interface Props {
  /** 그림 좌표계 가로. 기본 960 — 실제 화면 크기와 무관한 가상 단위다. */
  width?: number;
  /** 그림 좌표계 세로. 기본 540 (16:9) */
  height?: number;
  /** false면 프레임을 멈춘다. 성공·실패 배너를 읽는 동안 장면을 얼린다. */
  active: boolean;
  /** 매 프레임 호출. 여기서 상태를 갱신하고 곧바로 그린다. */
  onFrame: (ctx: CanvasRenderingContext2D, dt: number, elapsed: number) => void;
  /** 포인터 좌표는 이미 가상 단위로 바뀌어서 온다. */
  onPointer?: (pointer: CanvasPointer) => void;
  /** 화면 낭독기용 설명. 그림만으로 알 수 없는 장면을 한 줄로 밝힌다. */
  ariaLabel: string;
  className?: string;
}

/**
 * 미니게임 캔버스.
 *
 * 좌표계를 960x540 가상 단위로 고정한다. 창 크기를 재서 물리를 맞추면 창을 줄일 때
 * 공 속도와 점프 높이가 같이 변해 같은 게임이 다른 게임이 된다. 대신 CSS로만 늘려
 * 어느 크기에서도 같은 판이 되게 한다.
 *
 * 크기를 재지 않으므로 ResizeObserver도, 기기 화소비 계산도 없다. 포인터 좌표만
 * 그때그때 getBoundingClientRect로 가상 단위로 바꾼다.
 *
 * 캔버스는 그림이라 화면 낭독기에 아무 정보도 주지 않는다. ariaLabel을 반드시 받고,
 * 게임 쪽에서는 캔버스 밖에 조작 결과를 글로도 남긴다.
 */
export default function GameCanvas({
  width = 960,
  height = 540,
  active,
  onFrame,
  onPointer,
  ariaLabel,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const pointerRef = useRef(onPointer);
  pointerRef.current = onPointer;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext('2d');
  }, []);

  useGameLoop(active, (dt, elapsed) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    onFrame(ctx, dt, elapsed);
  });

  // 멈춰 있는 동안에도 한 장은 그려 둔다. 그러지 않으면 성공 순간의 장면이 사라진다.
  useEffect(() => {
    if (active) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    onFrame(ctx, 0, 0);
    // onFrame은 매 렌더 새 함수라 의존성에 넣으면 무한 루프가 된다. active 전환에만 반응한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const toLocal = (event: React.PointerEvent<HTMLCanvasElement>, phase: CanvasPointer['phase']) => {
    const canvas = canvasRef.current;
    if (!canvas || !pointerRef.current) return;
    const box = canvas.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return;
    pointerRef.current({
      x: ((event.clientX - box.left) / box.width) * width,
      y: ((event.clientY - box.top) / box.height) * height,
      phase,
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
      onPointerDown={(event) => {
        // 포인터 붙잡기는 실패할 수 있다(합성 이벤트·이미 놓인 포인터). 실패해도 조작은 이어져야 한다.
        try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* 무시 */ }
        toLocal(event, 'down');
      }}
      onPointerMove={(event) => toLocal(event, 'move')}
      onPointerUp={(event) => {
        try { event.currentTarget.releasePointerCapture?.(event.pointerId); } catch { /* 무시 */ }
        toLocal(event, 'up');
      }}
      onPointerCancel={(event) => toLocal(event, 'up')}
      style={{ touchAction: 'none' }}
      className={`h-full w-full min-h-0 rounded-xl ${className}`}
    />
  );
}
