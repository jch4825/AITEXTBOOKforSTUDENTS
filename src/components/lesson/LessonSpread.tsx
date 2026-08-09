import type { CSSProperties, ReactNode } from 'react';

interface Props {
  left: ReactNode;
  /** 비우면 왼쪽 면이 지면 전체를 쓴다(이야기 풀블리드). */
  right?: ReactNode;
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
  const full = right == null;
  return (
    <section
      className={`lesson-spread surface-paper ${full ? 'lesson-spread--full' : ''} relative mx-auto w-full max-w-[min(96vw,110rem)] overflow-hidden rounded-[var(--r-lg)] 2xl:max-w-[min(94vw,148rem)] 3xl:max-w-[min(92vw,175rem)] ${className}`}
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
      <div className={`lesson-spread-pages relative z-10 grid grid-cols-1 ${full ? '' : 'lg:grid-cols-2'}`}>
        <div className={`lesson-page lesson-page-left ${reverse && !full ? 'lg:col-start-2 lg:row-start-1' : ''}`}>
          {left}
        </div>
        {full ? null : (
          <>
            <div className="lesson-gutter" aria-hidden>
              <span />
            </div>
            <div className={`lesson-page lesson-page-right ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              {right}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
