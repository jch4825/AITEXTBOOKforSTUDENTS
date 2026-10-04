import FontSizeToggle from './controls/FontSizeToggle';
import DifficultyToggle from './controls/DifficultyToggle';
import DictionaryTrigger from './controls/DictionaryTrigger';
import ToolsTrigger from './controls/ToolsTrigger';
import SoundToggle from './controls/SoundToggle';
import AiStatus from './controls/AiStatus';
import Icon from './Icon';

interface Props {
  crumb: string;          // e.g. "단원 1 > AI가 뭐야?"
  onOpenDictionary: () => void;
  onGoHome: () => void;
  onOpenNav?: () => void; // 모바일 차례 드로어 열기
  mobileTimerLabel?: string | null;
  onOpenTeacherTools?: () => void;
  /** 읽기 지원 단원이면 학생이 쓰는 소리 칩을 둔다(data/readingSupport.ts). */
  readingSupport?: boolean;
}

export default function TopBar({
  crumb,
  onOpenDictionary,
  onGoHome,
  onOpenNav,
  mobileTimerLabel,
  onOpenTeacherTools,
  readingSupport = false,
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
        <AiStatus />
        <button
          type="button"
          onClick={onOpenDictionary}
          aria-label="쉬운 사전 열기"
          className="mobile-topbar-action mobile-topbar-dictionary"
        ><Icon name="book" size={22} /></button>
      </div>

      <div className="lesson-topbar-desktop hidden md:flex h-full w-full items-center gap-4 px-4 lg:px-6">
        {/* 좁은 태블릿 폭(1024 미만)에서는 글자를 감추고 집 모양만 둔다. 인공지능 연결 표시까지 넣어도
            글자 크기 125%에서 오른쪽 단추가 화면 밖으로 밀리지 않게 하려는 것이다. */}
        <button
          onClick={onGoHome}
          className="inline-flex shrink-0 items-center justify-center whitespace-nowrap min-h-11 min-w-11 px-2 -ml-2 rounded-[var(--r-sm)] text-lg font-bold hover:bg-[color:var(--paper-2)]"
          style={{ color: 'var(--accent)' }}
          aria-label="처음 화면으로"
          title="처음 화면으로"
        ><Icon name="home" size={22} /><span className="hidden lg:inline"> AI 교과서</span></button>
        {/* 폭이 모자라면 줄어드는 것은 위치 표시뿐이다. 단추는 줄어들지도 줄바꿈하지도 않는다. */}
        <span className="min-w-0 text-base text-[color:var(--muted)] truncate" aria-label="현재 위치">{crumb}</span>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <AiStatus />
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
          {readingSupport ? <SoundToggle /> : null}
          <FontSizeToggle />
          <DifficultyToggle />
          <DictionaryTrigger onClick={onOpenDictionary} />
        </div>
      </div>
    </header>
  );
}
