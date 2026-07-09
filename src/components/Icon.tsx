import type { CSSProperties, JSX } from 'react';

/**
 * 커스텀 아이콘 세트 (D3) — OS 이모지 편차를 없애기 위한 자체 SVG.
 * Lucide 스타일: 24×24 viewBox, currentColor 스트로크, 둥근 캡/조인.
 * CDN 의존 없음 (GitHub Pages·오프라인 교실 대응). 색은 currentColor로
 * 상속되므로 부모의 color(또는 style.color)로 지정한다.
 *
 * 학습 기호(O/X/체크)는 "정답/오답"의 의미를 옮기므로 남기되, 이모지가 아닌
 * 자체 도형으로 그려 기기 편차를 제거한다.
 */

export type IconName =
  | 'speaker' | 'book' | 'home' | 'settings' | 'mic' | 'mic-on'
  | 'menu' | 'close' | 'chevron-left' | 'chevron-right' | 'chevron-up' | 'chevron-down'
  | 'chat' | 'check' | 'bulb' | 'rocket' | 'sparkles' | 'refresh'
  | 'star' | 'circle' | 'cross' | 'warning' | 'think' | 'hourglass'
  | 'pen' | 'timer' | 'printer' | 'cards' | 'link';

interface Props {
  name: IconName;
  size?: number;          // px (정사각)
  strokeWidth?: number;
  className?: string;
  color?: string;         // 없으면 currentColor 상속
  style?: CSSProperties;
  title?: string;         // 있으면 <title> + role=img, 없으면 aria-hidden
  filled?: boolean;       // star/sparkles/circle 등을 면으로 채울 때
}

export default function Icon({
  name, size = 24, strokeWidth = 2, className, color, style, title, filled,
}: Props) {
  const a11y = title
    ? { role: 'img' as const, 'aria-label': title }
    : { 'aria-hidden': true };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ ...style, ...(color ? { color } : {}), display: 'inline-block', verticalAlign: 'text-bottom', flexShrink: 0 }}
      {...a11y}
    >
      {title && <title>{title}</title>}
      {GLYPHS[name]({ filled, color })}
    </svg>
  );
}

type GlyphProps = { filled?: boolean; color?: string };

const GLYPHS: Record<IconName, (p: GlyphProps) => JSX.Element> = {
  speaker: () => (
    <>
      <path d="M4 9v6h3.5L13 19V5L7.5 9H4z" fill="currentColor" stroke="none" />
      <path d="M16.5 9a4 4 0 0 1 0 6" />
      <path d="M19 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  book: () => (
    <>
      <path d="M12 6.5C10.3 5.4 7.6 5 4 5v13c3.6 0 6.3.4 8 1.5 1.7-1.1 4.4-1.5 8-1.5V5c-3.6 0-6.3.4-8 1.5z" />
      <path d="M12 6.5v13" />
    </>
  ),
  home: () => (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5.5 9.5V19h13V9.5" />
    </>
  ),
  settings: () => (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9L19 19M19 5l-2.1 2.1M7.1 16.9L5 19" />
    </>
  ),
  mic: () => (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4M9 21h6" />
    </>
  ),
  'mic-on': () => (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4M9 21h6" />
    </>
  ),
  menu: () => <path d="M4 7h16M4 12h16M4 17h16" />,
  close: () => <path d="M6 6l12 12M18 6L6 18" />,
  'chevron-left': () => <path d="M15 5l-7 7 7 7" />,
  'chevron-right': () => <path d="M9 5l7 7-7 7" />,
  'chevron-up': () => <path d="M5 15l7-7 7 7" />,
  'chevron-down': () => <path d="M5 9l7 7 7-7" />,
  chat: () => (
    <path d="M20 4H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3v3.5L12 16h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
  ),
  check: () => <path d="M5 13l4.5 4.5L19 7" />,
  bulb: () => (
    <>
      <path d="M8.5 16.5C6.9 15.3 6 13.5 6 11.5a6 6 0 0 1 12 0c0 2-.9 3.8-2.5 5" />
      <path d="M9.5 17h5M10 20.5h4" />
    </>
  ),
  rocket: () => (
    <>
      <path d="M12 3c2.8 2 4.2 5 4.2 8.5L12 15.5l-4.2-4C7.8 8 9.2 5 12 3z" />
      <path d="M8 15l-2.5 2.5M16 15l2.5 2.5" />
      <circle cx="12" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  sparkles: ({ filled }) => (
    <>
      <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z" fill={filled ? 'currentColor' : 'none'} />
      <path d="M18 14l.9 2.1 2.1.9-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z" fill={filled ? 'currentColor' : 'none'} />
    </>
  ),
  refresh: () => (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v4h-4" />
    </>
  ),
  star: ({ filled }) => (
    <path d="M12 3.2l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.3l5.8-.8z" fill={filled ? 'currentColor' : 'none'} />
  ),
  circle: ({ filled }) => <circle cx="12" cy="12" r="8" fill={filled ? 'currentColor' : 'none'} />,
  cross: () => <path d="M7 7l10 10M17 7L7 17" />,
  warning: () => (
    <>
      <path d="M12 3.5L21.5 20H2.5z" />
      <path d="M12 10v4.5M12 17.5v.5" />
    </>
  ),
  think: () => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.2 9.3a2.8 2.8 0 0 1 5.4 1c0 1.8-2.6 2.2-2.6 3.7" />
      <path d="M12 17.2v.4" />
    </>
  ),
  hourglass: () => (
    <>
      <path d="M6 3h12M6 21h12" />
      <path d="M7 3c0 4 4 5.5 5 9-1 3.5-5 5-5 9M17 3c0 4-4 5.5-5 9 1 3.5 5 5 5 9" />
    </>
  ),
  pen: () => (
    <>
      <path d="M4 20l1-4.2L15.8 5l3.2 3.2L8.2 19H4z" />
      <path d="M13.5 6.5l3.2 3.2" />
    </>
  ),
  timer: () => (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 13V9.5" />
      <path d="M9.5 2h5" />
      <path d="M18 6.5l1.2-1.2" />
    </>
  ),
  printer: () => (
    <>
      <path d="M6 9V4h12v5" />
      <rect x="3" y="9" width="18" height="8" rx="1.5" />
      <path d="M6 14h12v7H6z" />
    </>
  ),
  cards: () => (
    <>
      <path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
      <rect x="3" y="7" width="14" height="14" rx="2" />
    </>
  ),
  link: () => (
    <>
      <path d="M9 15l6-6" />
      <path d="M10.5 6.5l1-1a4 4 0 0 1 5.7 5.7l-1.2 1.2" />
      <path d="M13.5 17.5l-1 1a4 4 0 0 1-5.7-5.7l1.2-1.2" />
    </>
  ),
};
