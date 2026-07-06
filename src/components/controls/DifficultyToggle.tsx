import { useSettings } from '../../context/SettingsContext';

export default function DifficultyToggle() {
  const { difficulty, setDifficulty } = useSettings();
  return (
    <button
      onClick={() => setDifficulty(difficulty === 'normal' ? 'easy' : 'normal')}
      className="h-12 px-3 rounded border-2 font-semibold bg-white leading-tight whitespace-nowrap"
      style={{ borderColor: 'var(--accent)', color: 'var(--fg)' }}
      title="난이도 바꾸기"
      aria-label={`난이도 바꾸기 (지금: ${difficulty === 'easy' ? '쉬움' : '보통'})`}
    >
      <span className="block text-[11px] font-normal text-[color:var(--muted)]">난이도</span>
      <span className="block">{difficulty === 'easy' ? '쉬움' : '보통'}</span>
    </button>
  );
}
