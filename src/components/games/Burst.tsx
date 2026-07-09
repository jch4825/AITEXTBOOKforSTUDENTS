import React from 'react';

const N = 8;

export default function Burst({ color = 'var(--ok)' }: { color?: string }) {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return null;
  }

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {Array.from({ length: N }).map((_, i) => {
        const a = (i / N) * Math.PI * 2;
        const style = {
          '--dx': `${Math.cos(a) * 34}px`,
          '--dy': `${Math.sin(a) * 34}px`,
          background: color,
        } as React.CSSProperties;
        return (
          <span
            key={i}
            className="answer-burst-dot absolute h-2 w-2 rounded-full"
            style={style}
          />
        );
      })}
    </span>
  );
}
