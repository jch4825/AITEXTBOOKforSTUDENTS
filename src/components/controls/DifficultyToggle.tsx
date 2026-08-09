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
/* 지원 수준 색은 종이 팔레트의 도구색에서 가져온다. 세 단계가 서로 구분되되
   본문 종이 위에서 튀지 않는 채도 대역을 유지한다. */
const TINT: Record<Difficulty, string> = {
  easy: 'var(--chrome-support-full)',
  normal: 'var(--chrome-support-normal)',
  hard: 'var(--chrome-support-challenge)',
};

export default function DifficultyToggle() {
  const { difficulty, setDifficulty } = useSettings();

  return (
    <button
      onClick={() => setDifficulty(NEXT[difficulty])}
      className="chrome-sticker"
      style={{ '--chrome-tint': TINT[difficulty] } as React.CSSProperties}
      title="지원 수준 바꾸기"
      aria-label={`지원 수준 바꾸기 (지금: ${LABEL[difficulty]})`}
    >
      <span className="chrome-sticker-badge text-[16px]" aria-hidden>
        {EMOJI[difficulty]}
      </span>
      <span className="font-extrabold text-[color:var(--brand-ink)]">
        {LABEL[difficulty]}
      </span>
    </button>
  );
}
