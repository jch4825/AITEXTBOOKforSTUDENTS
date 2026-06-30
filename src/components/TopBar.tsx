import TTSToggle from './controls/TTSToggle';
import FontSizeToggle from './controls/FontSizeToggle';
import DifficultyToggle from './controls/DifficultyToggle';
import DictionaryTrigger from './controls/DictionaryTrigger';

interface Props {
  crumb: string;          // e.g. "모듈 1 > AI가 뭐야?"
  onOpenDictionary: () => void;
  onGoHome: () => void;
}

export default function TopBar({ crumb, onOpenDictionary, onGoHome }: Props) {
  return (
    <header className="h-16 shrink-0 border-b border-[color:var(--border)] bg-white px-6 flex items-center gap-4">
      <button
        onClick={onGoHome}
        className="text-lg font-bold hover:underline"
        style={{ color: 'var(--accent)' }}
      >🏠 AI 교과서</button>
      <span className="text-base text-[color:var(--muted)] truncate" aria-label="현재 위치">{crumb}</span>
      <div className="ml-auto flex gap-2">
        <TTSToggle />
        <FontSizeToggle />
        <DifficultyToggle />
        <DictionaryTrigger onClick={onOpenDictionary} />
      </div>
    </header>
  );
}
