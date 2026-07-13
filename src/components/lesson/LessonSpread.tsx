import type { CSSProperties, ReactNode } from 'react';

interface Props {
  left: ReactNode;
  right: ReactNode;
  reverse?: boolean;
  label?: string;
  accent?: string;
  className?: string;
}

export default function LessonSpread({
  left,
  right,
  reverse = false,
  label,
  accent,
  className = '',
}: Props) {
  return (
    <section
      className={`lesson-spread w-full max-w-[1180px] mx-auto rounded-[var(--r-lg)] bg-[color:var(--paper-0)] shadow-[0_10px_34px_rgba(43,58,85,0.10)] border border-[color:var(--line)] overflow-hidden relative ${className}`}
      aria-label={label}
      style={accent ? { borderColor: `color-mix(in srgb, ${accent} 18%, var(--line))`, '--spread-accent': accent } as CSSProperties : undefined}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.028]"
        style={{
          backgroundImage: `radial-gradient(var(--ink-1) 0.5px, transparent 0.5px)`,
          backgroundSize: '4px 4px',
        }}
      />
      <div className="lesson-spread-pages relative z-10 grid grid-cols-1 lg:grid-cols-2">
        <div className={`lesson-page lesson-page-left ${reverse ? 'lg:col-start-2 lg:row-start-1' : ''}`}>
          {left}
        </div>
        <div className="lesson-gutter" aria-hidden>
          <span />
        </div>
        <div className={`lesson-page lesson-page-right ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
          {right}
        </div>
      </div>
    </section>
  );
}
