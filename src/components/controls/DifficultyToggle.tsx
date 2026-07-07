import { useSettings } from '../../context/SettingsContext';

export default function DifficultyToggle() {
  const { difficulty, setDifficulty } = useSettings();
  return (
    <button
      onClick={() => setDifficulty(difficulty === 'normal' ? 'easy' : 'normal')}
      className="btn btn-secondary px-3 flex-col gap-0"
      style={{ color: 'var(--fg)' }}
      title="난이도 바꾸기"
      aria-label={`난이도 바꾸기 (지금: ${difficulty === 'easy' ? '쉬움' : '보통'})`}
    >
      <span className="block text-[11px] leading-none font-normal text-[color:var(--muted)]">난이도</span>
      <span className="block leading-none">{difficulty === 'easy' ? '쉬움' : '보통'}</span>
    </button>
  );
}
