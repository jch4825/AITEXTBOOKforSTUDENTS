import { useSettings } from '../../context/SettingsContext';

export default function DifficultyToggle() {
  const { difficulty, setDifficulty } = useSettings();
  return (
    <button
      onClick={() => setDifficulty(difficulty === 'normal' ? 'easy' : 'normal')}
      className="h-12 px-4 rounded border-2 font-semibold bg-white"
      style={{ borderColor: 'var(--accent)', color: 'var(--fg)' }}
      title="난이도 바꾸기"
      aria-label={`난이도 바꾸기 (지금: ${difficulty === 'easy' ? '쉬움' : '보통'})`}
    >
      <span className="text-[color:var(--muted)] font-normal">난이도</span>{' '}
      {difficulty === 'easy' ? '쉬움' : '보통'}
    </button>
  );
}
