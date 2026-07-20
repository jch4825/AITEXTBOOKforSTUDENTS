import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function FontSizeToggle() {
  const { fontSize, setFontSize } = useSettings();
  const isLarge = fontSize === 'large';

  return (
    <button
      onClick={() => setFontSize(isLarge ? 'normal' : 'large')}
      className="nav-jelly-btn"
      style={{
        '--border-color': '#74c0fc',
        '--shadow-color': '#a5d8ff',
      } as React.CSSProperties}
      title="글자 크기"
      aria-label={`글자 크기 (지금: ${isLarge ? '크게' : '보통'})`}
    >
      <span className="nav-jelly-badge" style={{ background: '#339af0' }}>
        {isLarge ? 'A+' : 'A-'}
      </span>
      <span className="font-extrabold text-[color:var(--brand-ink)]">
        글자 {isLarge ? '크게' : '보통'}
      </span>
    </button>
  );
}
