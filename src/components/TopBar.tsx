import FontSizeToggle from './controls/FontSizeToggle';
import DifficultyToggle from './controls/DifficultyToggle';
import DictionaryTrigger from './controls/DictionaryTrigger';
import ToolsTrigger from './controls/ToolsTrigger';
import Icon from './Icon';

interface Props {
  crumb: string;          // e.g. "단원 1 > AI가 뭐야?"
  onOpenDictionary: () => void;
  onGoHome: () => void;
  onOpenNav?: () => void; // 모바일 차례 드로어 열기
  mobileTimerLabel?: string | null;
  onOpenTeacherTools?: () => void;
}

export default function TopBar({
  crumb,
  onOpenDictionary,
  onGoHome,
  onOpenNav,
  mobileTimerLabel,
  onOpenTeacherTools,
}: Props) {
  return (
    <header className="lesson-topbar shrink-0 border-b border-[color:var(--border)] bg-[color:var(--paper-0)]">
      <div className="mobile-lesson-topbar flex md:hidden">
        <button
          onClick={onOpenNav}
          aria-label="학습 메뉴 열기"
          className="mobile-topbar-action mobile-topbar-menu"
          type="button"
        ><Icon name="menu" size={22} /></button>
        <span className="mobile-topbar-title" aria-label={`현재 위치: ${crumb}`} title={crumb}>{crumb}</span>
        {mobileTimerLabel && (
          <button
            type="button"
            onClick={onOpenTeacherTools}
            className="mobile-timer-chip"
            aria-label={`타이머 ${mobileTimerLabel}. 교사 도구 열기`}
          ><Icon name="timer" size={16} /><span>{mobileTimerLabel}</span></button>
        )}
        <button
          type="button"
          onClick={onOpenDictionary}
          aria-label="쉬운 사전 열기"
          className="mobile-topbar-action mobile-topbar-dictionary"
        ><Icon name="book" size={22} /></button>
      </div>

      <div className="lesson-topbar-desktop hidden md:flex h-full w-full items-center gap-4 px-6">
        <button
          onClick={onGoHome}
          className="inline-flex shrink-0 items-center whitespace-nowrap min-h-11 px-2 -ml-2 rounded-[var(--r-sm)] text-lg font-bold hover:bg-[color:var(--paper-2)]"
          style={{ color: 'var(--accent)' }}
          aria-label="처음 화면으로"
        ><Icon name="home" size={22} /><span> AI 교과서</span></button>
        {/* 폭이 모자라면 줄어드는 것은 위치 표시뿐이다. 단추는 줄어들지도 줄바꿈하지도 않는다. */}
        <span className="min-w-0 text-base text-[color:var(--muted)] truncate" aria-label="현재 위치">{crumb}</span>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {mobileTimerLabel && (
            <button
              type="button"
              onClick={onOpenTeacherTools}
              className="mobile-timer-chip"
              aria-label={`타이머 ${mobileTimerLabel}. 교사 도구 열기`}
            ><Icon name="timer" size={16} /><span>{mobileTimerLabel}</span></button>
          )}
          {/* 교실 도구는 예전에 본문 위에 떠 있는 도크였다. 본문을 가리지 않도록 상단 바의 단추가 여는 시트로 옮겼다. */}
          <ToolsTrigger onClick={() => onOpenTeacherTools?.()} />
          <FontSizeToggle />
          <DifficultyToggle />
          <DictionaryTrigger onClick={onOpenDictionary} />
        </div>
      </div>
    </header>
  );
}
