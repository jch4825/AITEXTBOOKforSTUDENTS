import type { CSSProperties, JSX } from 'react';
import type { ModuleId } from '../types';
import { themeFor } from '../utils/moduleThemes';

/**
 * 모듈 미니 일러스트 (D3) — 이모지 fallback을 대체하는 자체 SVG 6종.
 * 각 모듈 세계관: 새싹(입문)·말풍선(대화)·책더미(학습)·방패(안전)·퍼즐(문제해결)·집(일상).
 * 모듈 accent색으로 그린 2톤(면+선). 24×24.
 */

interface Props {
  moduleId: ModuleId;
  size?: number;
  className?: string;
  title?: string;
  style?: CSSProperties;
  /** 미획득 배지 등 — 모듈색 대신 회색으로 그린다 */
  muted?: boolean;
}

export default function ModuleIcon({ moduleId, size = 24, className, title, style, muted }: Props) {
  const theme = themeFor(moduleId);
  const accent = muted ? 'var(--ink-3)' : theme.accent;
  const accentSoft = muted ? 'var(--paper-2)' : theme.accentSoft;
  const a11y = title
    ? { role: 'img' as const, 'aria-label': title }
    : { 'aria-hidden': true };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={accent}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ ...style, display: 'inline-block', verticalAlign: 'text-bottom', flexShrink: 0 }}
      {...a11y}
    >
      {title && <title>{title}</title>}
      {GLYPHS[moduleId](accentSoft)}
    </svg>
  );
}

const GLYPHS: Record<ModuleId, (soft: string) => JSX.Element> = {
  // m1 — 새싹 (화분 위 떡잎)
  m1: (soft) => (
    <>
      <path d="M8 20h8l-1-4H9z" fill={soft} />
      <path d="M12 16v-4" />
      <path d="M12 12c0-2.4-1.7-4-4.2-4C7.8 10.4 9.5 12 12 12z" fill={soft} />
      <path d="M12 11c0-2.6 1.7-4.3 4.4-4.3C16.4 9.3 14.7 11 12 11z" fill={soft} />
    </>
  ),
  // m2 — 말풍선
  m2: (soft) => (
    <>
      <path d="M20 5H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v4l5-4h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" fill={soft} />
      <path d="M8 10.5h8M8 13h5" />
    </>
  ),
  // m3 — 책더미
  m3: (soft) => (
    <>
      <rect x="4" y="15" width="16" height="4" rx="0.8" fill={soft} />
      <rect x="5.5" y="11" width="13" height="4" rx="0.8" fill={soft} />
      <rect x="7" y="7" width="10" height="4" rx="0.8" fill={soft} />
    </>
  ),
  // m4 — 방패
  m4: (soft) => (
    <>
      <path d="M12 3l7 2.5v5c0 4.8-3 7.8-7 9.5-4-1.7-7-4.7-7-9.5v-5z" fill={soft} />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </>
  ),
  // m5 — 퍼즐 조각
  m5: (soft) => (
    <path
      d="M9.5 4a2 2 0 0 1 4 0c0 .6-.3 1-.3 1.4 0 .4.4.6.9.6H16v2.1c0 .5.2.9.6.9.4 0 .8-.3 1.4-.3a2 2 0 0 1 0 4c-.6 0-1-.3-1.4-.3-.4 0-.6.4-.6.9V20h-2.9c-.5 0-.9-.2-.9-.6 0-.4.3-.8.3-1.4a2 2 0 0 0-4 0c0 .6.3 1 .3 1.4 0 .4-.4.6-.9.6H4v-2.9c0-.5.2-.9.6-.9.4 0 .8.3 1.4.3a2 2 0 0 0 0-4c-.6 0-1 .3-1.4.3-.4 0-.6-.4-.6-.9V6h4.6c.5 0 .7-.2.7-.6 0-.4-.3-.8-.3-1.4z"
      fill={soft}
    />
  ),
  // m6 — 집
  m6: (soft) => (
    <>
      <path d="M4 11l8-6 8 6" />
      <path d="M6 10v9h12v-9" fill={soft} />
      <path d="M10 19v-4.5h4V19" />
    </>
  ),
};
