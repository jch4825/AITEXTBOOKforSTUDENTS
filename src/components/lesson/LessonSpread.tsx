import type { ReactNode } from 'react';

interface Props {
  left: ReactNode;
  right: ReactNode;
  reverse?: boolean; // If true, right side becomes first/left on wide screens
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
  // We use paper-0 bg, subtle page shadow, and rounded edges to resemble a book spread.
  // Gutter mimics the fold of an open book.
  return (
    <section
      className={`w-full max-w-[1180px] mx-auto rounded-[var(--r-lg)] bg-[color:var(--paper-0)] shadow-[0_8px_32px_rgba(43,58,85,0.12)] border border-[color:var(--line)] overflow-hidden relative ${className}`}
      aria-label={label}
      style={accent ? { borderColor: `color-mix(in srgb, ${accent} 20%, var(--line))` } : undefined}
    >
      {/* 옅은 종이 질감 효과 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(var(--ink-1) 0.5px, transparent 0.5px)`,
          backgroundSize: '4px 4px',
        }}
      />

      <div className="relative z-10 w-full h-full">
        {/* Responsive Grid Layout
            >=1024px: Two pages side-by-side with gutter. Columns can be 7fr/5fr or 5fr/7fr depending on reverse.
            768px~1023px: Stacked vertically with a dividing line.
            <768px: Simple stacked card. */}
        <div
          className={`grid grid-cols-1 md:grid-cols-1 lg:grid-flow-col
            ${reverse
              ? 'lg:grid-cols-[5fr_7fr]'
              : 'lg:grid-cols-[7fr_5fr]'
            }
          `}
        >
          {/* Left Page Column */}
          <div className={`p-4 md:p-6 lg:p-8 flex flex-col justify-center min-w-0 ${reverse ? 'lg:col-start-2 lg:row-start-1' : ''}`}>
            {left}
          </div>

          {/* Center Book Gutter (Book Fold Line)
              Shown only on >=1024px, replaces with a horizontal line on 768-1023px, hidden below 768px. */}
          <div
            className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-10 pointer-events-none z-20"
            style={{
              left: reverse ? 'calc(50% * (5 / 6))' : 'calc(50% * (7 / 6))', // Adjust gutter position based on ratio
            }}
          >
            {/* Gutter styling - smooth gradient shadow mimicking fold depth */}
            <div className="w-full h-full bg-gradient-to-r from-black/[0.04] via-black/[0.09] to-black/[0.04]" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/[0.12]" />
          </div>

          {/* Gutter fallback line for medium devices (768px - 1023px) */}
          <div className="hidden md:block lg:hidden border-t border-dashed border-[color:var(--line)] mx-6 my-2" />

          {/* Right Page Column */}
          <div className={`p-4 md:p-6 lg:p-8 flex flex-col justify-center min-w-0 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
            {right}
          </div>
        </div>
      </div>
    </section>
  );
}
