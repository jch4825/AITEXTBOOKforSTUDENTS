import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  accent?: string;
  className?: string;
  label?: string;
}

/** 웹툰의 한 컷을 표현하는 공통 학습 프레임. */
export default function ComicPanel({ children, accent, className = '', label }: Props) {
  return (
    <section
      className={`comic-panel ${className}`}
      style={accent ? ({ '--comic-accent': accent } as CSSProperties) : undefined}
      aria-label={label}
    >
      {children}
    </section>
  );
}
