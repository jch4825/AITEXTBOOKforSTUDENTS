import React from 'react';

const N = 16;
// 축하 색 팔레트 — 저채도 파스텔 대신 밝고 경쾌하게
const FESTIVE = ['#ccf200', '#4fc3e8', '#ffb703', '#ff6b9d', '#8ed081', '#b388ff'];

export default function Burst({ color }: { color?: string }) {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return null;
  }

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
    >
      {Array.from({ length: N }).map((_, i) => {
        const a = (i / N) * Math.PI * 2 + (i % 2) * 0.2;
        const dist = 30 + (i % 3) * 14;          // 30·44·58px — 층을 이루며 퍼짐
        const size = 6 + (i % 3) * 3;            // 6·9·12px 혼합
        const square = i % 4 === 0;              // 일부는 네모 조각
        const rot = 180 + (i % 5) * 90;
        const style = {
          '--dx': `${Math.cos(a) * dist}px`,
          '--dy': `${Math.sin(a) * dist}px`,
          '--rot': `${rot}deg`,
          width: `${size}px`,
          height: `${size}px`,
          background: color ?? FESTIVE[i % FESTIVE.length],
          borderRadius: square ? '2px' : '999px',
          animationDelay: `${(i % 3) * 40}ms`,
        } as React.CSSProperties;
        return (
          <span
            key={i}
            className="answer-burst-dot absolute"
            style={style}
          />
        );
      })}
    </span>
  );
}
