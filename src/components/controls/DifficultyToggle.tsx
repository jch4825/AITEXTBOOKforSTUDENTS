import { useSettings } from '../../context/SettingsContext';
import type { Difficulty } from '../../types';

// 내부 Difficulty 값은 기존 진도·설정 하위 호환을 위해 유지하고 학생용 명칭만 지원 수준으로 표시한다.
const NEXT: Record<Difficulty, Difficulty> = { hard: 'normal', normal: 'easy', easy: 'hard' };
const LABEL: Record<Difficulty, string> = {
  easy: '충분한 지원',
  normal: '약한 지원',
  hard: '도전적',
};

export default function DifficultyToggle() {
  const { difficulty, setDifficulty } = useSettings();
  return (
    <button
      onClick={() => setDifficulty(NEXT[difficulty])}
      className="btn btn-secondary px-3 flex-col gap-0"
      style={{ color: 'var(--fg)' }}
      title="지원 수준 바꾸기"
      aria-label={`지원 수준 바꾸기 (지금: ${LABEL[difficulty]})`}
    >
      <span className="block text-[11px] leading-none font-normal text-[color:var(--muted)]">지원 수준</span>
      <span className="block leading-none">{LABEL[difficulty]}</span>
    </button>
  );
}
