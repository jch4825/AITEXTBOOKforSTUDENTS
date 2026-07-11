import { useSettings } from '../../context/SettingsContext';
import type { Difficulty } from '../../types';

// 하향식 교수 흐름 — 기본에서 시작, 학생 반응 보며 한 단계씩 내린다 (spec §2).
// 표시 이름만 기본/기초로 바꿈 — 내부 Difficulty 값(hard/normal/easy)은 그대로 유지.
const NEXT: Record<Difficulty, Difficulty> = { hard: 'normal', normal: 'easy', easy: 'hard' };
const LABEL: Record<Difficulty, string> = { hard: '기본', normal: '기초', easy: '쉬움' };

export default function DifficultyToggle() {
  const { difficulty, setDifficulty } = useSettings();
  return (
    <button
      onClick={() => setDifficulty(NEXT[difficulty])}
      className="btn btn-secondary px-3 flex-col gap-0"
      style={{ color: 'var(--fg)' }}
      title="난이도 바꾸기 (기본 → 기초 → 쉬움)"
      aria-label={`난이도 바꾸기 (지금: ${LABEL[difficulty]})`}
    >
      <span className="block text-[11px] leading-none font-normal text-[color:var(--muted)]">난이도</span>
      <span className="block leading-none">{LABEL[difficulty]}</span>
    </button>
  );
}
