import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import type { FontSize } from '../../types';

const FONT_SIZE_LABELS: Record<FontSize, string> = {
  small: '작게',
  normal: '보통',
  large: '크게',
};

const FONT_SIZE_BADGES: Record<FontSize, string> = {
  small: 'A-',
  normal: 'A',
  large: 'A+',
};

const NEXT_FONT_SIZE: Record<FontSize, FontSize> = {
  small: 'normal',
  normal: 'large',
  large: 'small',
};

export default function FontSizeToggle() {
  const { fontSize, setFontSize } = useSettings();
  const currentSize: FontSize = fontSize || 'normal';
  const label = FONT_SIZE_LABELS[currentSize];
  const badge = FONT_SIZE_BADGES[currentSize];
  const nextSize = NEXT_FONT_SIZE[currentSize];

  return (
    <button
      type="button"
      onClick={() => setFontSize(nextSize)}
      className="nav-jelly-btn"
      style={{
        '--border-color': '#74c0fc',
        '--shadow-color': '#a5d8ff',
      } as React.CSSProperties}
      title="글자 크기 변경 (작게 - 보통 - 크게)"
      aria-label={`글자 크기 (지금: ${label})`}
    >
      <span className="nav-jelly-badge" style={{ background: '#339af0' }}>
        {badge}
      </span>
      <span className="font-extrabold text-[color:var(--brand-ink)]">
        글자 {label}
      </span>
    </button>
  );
}
