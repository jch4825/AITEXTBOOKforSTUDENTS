import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/** 두 면이 위아래로 쌓이는 구간. 아래의 `lg:grid-cols-2`(1024px)와 같은 경계다. */
const STACKED_QUERY = '(max-width: 1023px)';

function useStacked(enabled: boolean): boolean {
  const [stacked, setStacked] = useState<boolean>(
    () => enabled && typeof window !== 'undefined' && window.matchMedia(STACKED_QUERY).matches,
  );
  useEffect(() => {
    if (!enabled) {
      setStacked(false);
      return undefined;
    }
    const query = window.matchMedia(STACKED_QUERY);
    const sync = () => setStacked(query.matches);
    sync();
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, [enabled]);
  return stacked;
}

interface Props {
  left: ReactNode;
  /** 비우면 왼쪽 면이 지면 전체를 쓴다(이야기 풀블리드). */
  right?: ReactNode;
  reverse?: boolean;
  label?: string;
  accent?: string;
  className?: string;
  /**
   * 면이 위아래로 쌓이는 좁은 창에서 오른쪽(조작) 면을 먼저 놓는다.
   * CSS order가 아니라 DOM 순서를 바꾼다 — 화면에 보이는 순서와 키보드 이동 순서가 달라지지 않게 한다.
   */
  taskFirstWhenStacked?: boolean;
}

export default function LessonSpread({
  left,
  right,
  reverse = false,
  label,
  accent,
  className = '',
  taskFirstWhenStacked = false,
}: Props) {
  const full = right == null;
  const swapped = useStacked(taskFirstWhenStacked && !full);

  const leftPage = (
    <div
      key="left"
      className={`lesson-page lesson-page-left ${reverse && !full ? 'lg:col-start-2 lg:row-start-1' : ''}`}
    >
      {left}
    </div>
  );
  const gutter = (
    <div key="gutter" className="lesson-gutter" aria-hidden>
      <span />
    </div>
  );
  const rightPage = (
    <div
      key="right"
      className={`lesson-page lesson-page-right ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}
    >
      {right}
    </div>
  );

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
        {full ? leftPage : swapped ? [rightPage, gutter, leftPage] : [leftPage, gutter, rightPage]}
      </div>
    </section>
  );
}
