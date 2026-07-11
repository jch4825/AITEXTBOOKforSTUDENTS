import TTSToggle from './controls/TTSToggle';
import FontSizeToggle from './controls/FontSizeToggle';
import DifficultyToggle from './controls/DifficultyToggle';
import DictionaryTrigger from './controls/DictionaryTrigger';
import Icon from './Icon';

interface Props {
  crumb: string;          // e.g. "단원 1 > AI가 뭐야?"
  onOpenDictionary: () => void;
  onGoHome: () => void;
  onOpenNav?: () => void; // 모바일 차례 드로어 열기
}

export default function TopBar({ crumb, onOpenDictionary, onGoHome, onOpenNav }: Props) {
  return (
    <header className="h-16 shrink-0 border-b border-[color:var(--border)] bg-[color:var(--paper-0)] px-3 md:px-6 flex items-center gap-1.5 md:gap-4">
      {onOpenNav && (
        <button
          onClick={onOpenNav}
          aria-label="차례 열기"
          className="md:hidden btn btn-secondary px-2.5"
          style={{ color: 'var(--fg)' }}
        ><Icon name="menu" size={20} /> 차례</button>
      )}
      <button
        onClick={onGoHome}
        className="inline-flex items-center min-h-11 px-2 -ml-2 rounded-[var(--r-sm)] text-lg font-bold hover:bg-[color:var(--paper-2)]"
        style={{ color: 'var(--accent)' }}
        aria-label="처음 화면으로"
      ><Icon name="home" size={22} /><span className="hidden sm:inline"> AI 교과서</span></button>
      <span className="hidden md:inline text-base text-[color:var(--muted)] truncate" aria-label="현재 위치">{crumb}</span>
      <div className="ml-auto flex items-center gap-1.5 md:gap-2">
        <TTSToggle />
        <FontSizeToggle />
        <DifficultyToggle />
        <DictionaryTrigger onClick={onOpenDictionary} />
      </div>
    </header>
  );
}
