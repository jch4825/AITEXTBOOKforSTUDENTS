import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import GradeBandChangeDialog from './GradeBandChangeDialog';
import type { Difficulty, GradeBand } from '../../types';

const LABEL: Record<Difficulty, string> = {
  easy: '충분한 지원',
  normal: '중학',
  hard: '고등',
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

/** 충분한 지원에서 한 번 더 눌렀을 때 건너갈 학년군. */
const OTHER_BAND: Record<GradeBand, GradeBand> = { normal: 'hard', hard: 'normal' };

/**
 * 지원 수준 스티커.
 *
 * 학년군(중학·고등)은 표지에서 고르는 운영 결정이므로 차시 화면에서 중학과 고등을
 * 곧바로 맞바꿀 수 없다. 누르면 언제나 충분한 지원으로 한 칸 내려가고, 충분한 지원에서
 * 한 번 더 눌러 확인 창에 답해야 반대쪽 학년군으로 건너간다.
 *
 *   중학 → 충분한 지원 → [고등으로 바꿀까요?] → 예 → 고등
 *   고등 → 충분한 지원 → [중학으로 바꿀까요?] → 예 → 중학
 *
 * 아니요를 고르면 충분한 지원에 그대로 머문다.
 */
export default function DifficultyToggle() {
  const { difficulty, gradeBand, setDifficulty } = useSettings();
  const [pendingBand, setPendingBand] = useState<GradeBand | null>(null);

  // 충분한 지원에 있을 때만 학년군이 바뀔 수 있다. 그 밖에는 늘 충분한 지원으로 내려간다.
  const nextBand = OTHER_BAND[gradeBand];
  const asksBefore = difficulty === 'easy';
  const nextLabel = asksBefore ? LABEL[nextBand] : LABEL.easy;

  const handleClick = () => {
    if (asksBefore) {
      setPendingBand(nextBand);
      return;
    }
    setDifficulty('easy');
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="chrome-sticker"
        style={{ '--chrome-tint': TINT[difficulty] } as React.CSSProperties}
        title={`지원 수준 바꾸기 (다음: ${nextLabel})`}
        aria-label={`지원 수준 바꾸기 (지금: ${LABEL[difficulty]}, 다음: ${nextLabel})`}
      >
        <span className="chrome-sticker-badge text-[16px]" aria-hidden>
          {EMOJI[difficulty]}
        </span>
        <span className="font-extrabold text-[color:var(--brand-ink)]">
          {LABEL[difficulty]}
        </span>
      </button>

      <GradeBandChangeDialog
        target={pendingBand}
        onCancel={() => setPendingBand(null)}
        onConfirm={() => {
          if (pendingBand) setDifficulty(pendingBand);
          setPendingBand(null);
        }}
      />
    </>
  );
}
