import React from 'react';

/**
 * 프레임 쪽(DOM)에서 이모지를 대신하는 기하 마크.
 *
 * 캔버스 안은 `drawMark`가 맡고, 버튼·HUD·배너처럼 DOM으로 그리는 자리는 여기가 맡는다.
 * 같은 뜻이 판 안과 판 밖에서 같은 모양으로 보여야 학생이 그 모양을 신호로 배운다.
 *
 * 모두 24×24 좌표계로 그리고 `size`로 키운다. 색은 `currentColor`를 따르므로 부모의
 * 글자 색을 그대로 물려받는다.
 */

export type MarkKind =
  | 'arrow' | 'check' | 'cross' | 'retry' | 'sound'
  | 'life' | 'dot' | 'bang'
  /* 캔버스의 도형 어휘와 같은 모양들. 판 안에서 본 것을 판 밖 설명에서 다시 만난다. */
  | 'circle' | 'square' | 'triangle' | 'diamond' | 'bar' | 'plus' | 'semicircle';

interface Props {
  kind: MarkKind;
  size?: number;
  /** 라디안이 아니라 도(度). 화살표 방향을 돌릴 때 쓴다. */
  rotate?: number;
  className?: string;
}

function paths(kind: MarkKind): React.ReactNode {
  switch (kind) {
    case 'arrow':
      return (
        <>
          <rect x="2" y="10" width="12" height="4" fill="currentColor" />
          <polygon points="22,12 12,5 12,19" fill="currentColor" />
        </>
      );
    case 'check':
      return (
        <polyline
          points="3,12 9.5,18.5 21,5.5"
          fill="none" stroke="currentColor" strokeWidth="4"
          strokeLinecap="butt" strokeLinejoin="miter"
        />
      );
    case 'cross':
      return (
        <>
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="4" />
          <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="4" />
        </>
      );
    case 'retry':
      return (
        <>
          <path
            d="M 20 12 A 8 8 0 1 1 14.5 4.4"
            fill="none" stroke="currentColor" strokeWidth="3.6"
          />
          <polygon points="21,2 21,10 13.5,6" fill="currentColor" />
        </>
      );
    case 'sound':
      return (
        <>
          <rect x="2" y="9" width="5" height="6" fill="currentColor" />
          <polygon points="7,9 13,4 13,20 7,15" fill="currentColor" />
          <path d="M 16 8 A 5 5 0 0 1 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <path d="M 19 5 A 9 9 0 0 1 19 19" fill="none" stroke="currentColor" strokeWidth="2.4" />
        </>
      );
    case 'life':
    case 'square':
      return <rect x="4" y="4" width="16" height="16" fill="currentColor" />;
    case 'circle':
      return <circle cx="12" cy="12" r="8" fill="currentColor" />;
    case 'triangle':
      return <polygon points="12,3 21,19 3,19" fill="currentColor" />;
    case 'diamond':
      return <polygon points="12,3 21,12 12,21 3,12" fill="currentColor" />;
    case 'bar':
      return <rect x="3" y="8" width="18" height="8" fill="currentColor" />;
    case 'plus':
      return (
        <>
          <rect x="3" y="9" width="18" height="6" fill="currentColor" />
          <rect x="9" y="3" width="6" height="18" fill="currentColor" />
        </>
      );
    case 'semicircle':
      return <path d="M 3 16 A 9 9 0 0 1 21 16 Z" fill="currentColor" />;
    case 'dot':
      return <circle cx="12" cy="12" r="5" fill="currentColor" />;
    case 'bang':
      return (
        <>
          <rect x="10" y="3" width="4" height="11" fill="currentColor" />
          <circle cx="12" cy="19" r="2.4" fill="currentColor" />
        </>
      );
    default:
      return null;
  }
}

export default function BauhausMark({ kind, size = 20, rotate = 0, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      {paths(kind)}
    </svg>
  );
}
