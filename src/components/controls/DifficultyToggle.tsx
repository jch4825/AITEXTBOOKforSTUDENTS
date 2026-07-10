import { useSettings } from '../../context/SettingsContext';
import type { Difficulty } from '../../types';

// 하향식 교수 흐름 — 어려움에서 시작, 학생 반응 보며 한 단계씩 내린다 (spec §2).
const NEXT: Record<Difficulty, Difficulty> = { hard: 'normal', normal: 'easy', easy: 'hard' };
const LABEL: Record<Difficulty, string> = { hard: '어려움', normal: '보통', easy: '쉬움' };

export default function DifficultyToggle() {
  const { difficulty, setDifficulty } = useSettings();
  return (
    <button
      onClick={() => setDifficulty(NEXT[difficulty])}
      className="btn btn-secondary px-3 flex-col gap-0"
      style={{ color: 'var(--fg)' }}
      title="난이도 바꾸기 (어려움 → 보통 → 쉬움)"
      aria-label={`난이도 바꾸기 (지금: ${LABEL[difficulty]})`}
    >
      <span className="block text-[11px] leading-none font-normal text-[color:var(--muted)]">난이도</span>
      <span className="block leading-none">{LABEL[difficulty]}</span>
    </button>
  );
}
