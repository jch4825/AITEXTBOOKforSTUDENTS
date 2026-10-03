import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import type { IconName } from './Icon';
import DrawBoard from './DrawBoard';
import ClassTimer from './ClassTimer';
import { formatTime } from '../utils/time';
import PecsBoard from './PecsBoard';
import { moduleIdFromLessonId } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import { getTeacherResources } from '../data/teacherResources';
import { isTeacherSessionActive } from '../utils/teacherMode';
import type { LessonId } from '../types';
import WorksheetPanel from '../features/teacher/worksheet/WorksheetPanel';

type ToolId = 'draw' | 'timer' | 'pecs' | 'worksheet' | 'resources';
type PanelId = Exclude<ToolId, 'draw'>;

const TOOLS: { id: ToolId; label: string; icon: IconName }[] = [
  { id: 'draw', label: '판서', icon: 'pen' },
  { id: 'timer', label: '타이머', icon: 'timer' },
  { id: 'pecs', label: '그림 카드', icon: 'cards' },
  { id: 'worksheet', label: '학습지', icon: 'book' },
  { id: 'resources', label: '교사 자료', icon: 'link' },
];

/**
 * 교사 자료는 외부 사이트로 나가는 링크라 교사 모드에서만 연다.
 * 학생이 수업 도중 통제할 수 없는 광고나 관련 영상 추천을 만나지 않게 하기 위해서다.
 * 학생에게 보이는 도움 영상은 이 도크가 아니라 정리 노트의 LessonVideoCard가 맡는다
 * (누르기 전에는 외부 요청이 없고, 끝나면 플레이어를 떼어 추천이 뜨지 않게 한다).
 */
const TEACHER_ONLY_TOOLS = new Set<ToolId>(['resources']);

interface Props {
  lessonId: LessonId;
  /** 도구 시트를 열었는지. 데스크톱은 상단 바 아래 팝오버, 모바일은 아래 시트로 같은 시트가 뜬다. */
  open: boolean;
  onClose: () => void;
  onTimerLabelChange?: (label: string | null) => void;
}

/**
 * 교실 도구 — 판서·타이머·그림 카드·학습지·교사 자료. 차시 화면 한정, 전부 공개(게이팅 없음).
 *
 * 예전에는 푸터 위에 떠 있는 도크였다. 흐름 밖(absolute)이라 스크롤하는 본문 위에 겹쳐
 * 이야기 대사 한 줄이나 `그대로 쓰기` 단추를 가렸다(1366×657·1024×768 실측).
 * 가리지 않게 본문 아래에 여백을 잡으면 낮은 화면(657px)에서 본문 높이의 약 12%를 잃는다.
 * 그래서 상단 바의 "도구" 단추가 여는 시트로 옮겼다. 시트는 연 동안에만 뜨고 본문 위에
 * 상시 떠 있지 않다. 모바일은 처음부터 같은 시트(메뉴 → 교사 도구)를 쓰고 있었다.
 */
export default function ClassroomDock({
  lessonId,
  open: sheetOpen,
  onClose,
  onTimerLabelChange,
}: Props) {
  const [open, setOpen] = useState<ToolId | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  // onClose는 부모가 렌더마다 새로 만든다. 효과의 의존성에 넣으면 시트가 열린 동안 포커스를 계속 되돌린다.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const moduleId = moduleIdFromLessonId(lessonId) ?? 'm1';
  const theme = themeFor(moduleId);
  const teacherMode = isTeacherSessionActive();
  const visibleTools = TOOLS.filter((tool) => !TEACHER_ONLY_TOOLS.has(tool.id) || teacherMode);
  const resources = teacherMode ? getTeacherResources(lessonId) : [];

  useEffect(() => {
    if (!timerRunning) return;
    intervalRef.current = window.setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setTimerRunning(false);
          return prev === null ? null : 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  useEffect(() => {
    onTimerLabelChange?.(timerRemaining === null ? null : formatTime(timerRemaining));
  }, [onTimerLabelChange, timerRemaining]);

  // 시트가 열리면 닫기 단추로 포커스를 옮기고 Esc로 닫는다. 키보드·스위치 사용자가 시트 밖에 남지 않게 한다.
  useEffect(() => {
    if (!sheetOpen) return;
    closeButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') dismiss();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sheetOpen]);

  /** 시트를 닫고 포커스를 연 단추로 돌려준다. 판서·학습지처럼 다른 면을 여는 경우에는 쓰지 않는다. */
  function dismiss() {
    onCloseRef.current();
    window.setTimeout(() => {
      document.querySelector<HTMLElement>('[data-teacher-tools-trigger]')?.focus();
    }, 0);
  }

  function startTimer(minutes: number) {
    setTimerRemaining(minutes * 60);
    setTimerRunning(true);
    setOpen('timer');
  }
  function toggleTimer() {
    setTimerRunning((r) => !r);
  }
  function resetTimer() {
    setTimerRemaining(null);
    setTimerRunning(false);
  }

  function chooseTool(id: ToolId) {
    setOpen((cur) => (cur === id ? null : id));
    // 판서와 학습지는 화면 전체를 쓰는 면이라 시트를 닫고 연다.
    if (id === 'draw' || id === 'worksheet') onCloseRef.current();
  }

  const panelTool = open && open !== 'draw' ? (open as PanelId) : null;

  const timerChip = timerRemaining !== null && (
    <span
      className="h-8 px-2 rounded-[var(--r-pill)] text-sm font-bold tabular-nums flex items-center shrink-0"
      style={{
        background: timerRemaining === 0 ? 'var(--warn-bg)' : 'var(--paper-2)',
        color: timerRemaining === 0 ? 'var(--warn)' : 'var(--ink-1)',
      }}
    >{formatTime(timerRemaining)}</span>
  );

  const panelContent = panelTool && (
    <>
      {panelTool === 'timer' && (
        <ClassTimer
          remainingSec={timerRemaining}
          running={timerRunning}
          onStart={startTimer}
          onToggle={toggleTimer}
          onReset={resetTimer}
        />
      )}
      {panelTool === 'pecs' && <PecsBoard moduleId={moduleId} />}
      {panelTool === 'resources' && (
        <div className="p-4 w-64 max-w-full">
          <h3 className="text-lg font-bold mb-2" style={{ color: theme.accent }}>교사 자료</h3>
          {resources.length === 0 ? (
            <p className="text-[color:var(--muted)]">자료 준비 중입니다.</p>
          ) : (
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.url} className="rounded-[var(--r-sm)] border border-[color:var(--border)] bg-[color:var(--paper-1)] p-3">
                  <span className="mb-1 inline-block rounded-[var(--r-pill)] bg-[color:var(--paper-2)] px-2 py-0.5 text-xs font-bold text-[color:var(--muted)]">
                    {resource.kind === 'video' ? '영상' : '도구'}
                  </span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-bold underline underline-offset-4"
                    style={{ color: theme.accent }}
                  >{resource.label}</a>
                  {/* m4가 출처와 날짜 확인을 가르치므로 교재 자신의 링크도 그것을 밝힌다. */}
                  <p className="mt-1 text-xs text-[color:var(--muted)]">
                    {resource.source} · {resource.checkedAt} 확인 · 외부 사이트로 이동합니다
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">{resource.description}</p>
                  <p className="mt-2 border-t border-dashed border-[color:var(--border)] pt-2 text-xs leading-relaxed text-[color:var(--muted)]">
                    안 열릴 때 · {resource.fallback}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {sheetOpen && (
        <div className="mobile-teacher-tools-backdrop fixed inset-0 z-[60]" onClick={dismiss}>
          <section
            className="mobile-teacher-tools-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="교사 도구"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-teacher-tools-heading">
              <div>
                <strong>교사 도구</strong>
                {timerChip}
              </div>
              <button ref={closeButtonRef} type="button" onClick={dismiss} aria-label="교사 도구 닫기">
                <Icon name="close" size={22} />
              </button>
            </div>
            <div className="mobile-teacher-tools-grid">
              {visibleTools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  data-tool-id={tool.id}
                  aria-pressed={open === tool.id}
                  onClick={() => chooseTool(tool.id)}
                  style={{
                    background: open === tool.id ? theme.accentSoft : 'var(--paper-1)',
                    color: open === tool.id ? theme.accent : 'var(--ink-1)',
                    borderColor: open === tool.id ? theme.accent : 'var(--border)',
                  }}
                ><Icon name={tool.icon} size={22} /><span>{tool.label}</span></button>
              ))}
            </div>
            {panelTool && panelTool !== 'worksheet' && (
              <div className="mobile-teacher-tools-panel">{panelContent}</div>
            )}
          </section>
        </div>
      )}
      {open === 'worksheet' && (
        <WorksheetPanel lessonId={lessonId} onClose={() => setOpen(null)} />
      )}
      {open === 'draw' && <DrawBoard onClose={() => setOpen(null)} />}
    </>
  );
}
