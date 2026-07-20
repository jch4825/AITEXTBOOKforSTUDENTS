import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import type { Difficulty } from '../../types';

const NEXT: Record<Difficulty, Difficulty> = { hard: 'normal', normal: 'easy', easy: 'hard' };
const LABEL: Record<Difficulty, string> = {
  easy: '충분한 지원',
  normal: '보통',
  hard: '도전적',
};
const EMOJI: Record<Difficulty, string> = {
  easy: '🌱',
  normal: '🌿',
  hard: '🌳',
};
const BADGE_BG: Record<Difficulty, string> = {
  easy: '#37b24d',
  normal: '#fcc419',
  hard: '#f76707',
};
const BORDER_COLOR: Record<Difficulty, string> = {
  easy: '#b2f2bb',
  normal: '#ffec99',
  hard: '#ffd8a8',
};
const SHADOW_COLOR: Record<Difficulty, string> = {
  easy: '#8ce99a',
  normal: '#ffe066',
  hard: '#ffc078',
};

export default function DifficultyToggle() {
  const { difficulty, setDifficulty } = useSettings();

  return (
    <button
      onClick={() => setDifficulty(NEXT[difficulty])}
      className="nav-jelly-btn"
      style={{
        '--border-color': BORDER_COLOR[difficulty],
        '--shadow-color': SHADOW_COLOR[difficulty],
      } as React.CSSProperties}
      title="지원 수준 바꾸기"
      aria-label={`지원 수준 바꾸기 (지금: ${LABEL[difficulty]})`}
    >
      <span className="nav-jelly-badge text-[16px]" style={{ background: BADGE_BG[difficulty] }}>
        {EMOJI[difficulty]}
      </span>
      <span className="font-extrabold text-[color:var(--brand-ink)]">
        {LABEL[difficulty]}
      </span>
    </button>
  );
}
