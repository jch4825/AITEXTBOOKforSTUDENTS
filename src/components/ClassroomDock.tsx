import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import type { IconName } from './Icon';
import DrawBoard from './DrawBoard';
import ClassTimer, { formatTime } from './ClassTimer';
import PecsBoard from './PecsBoard';
import { moduleIdFromLessonId } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import { TEACHER_RESOURCES } from '../data/teacherResources';
import type { LessonId } from '../types';

type ToolId = 'draw' | 'timer' | 'pecs' | 'worksheet' | 'resources';
type PanelId = Exclude<ToolId, 'draw'>;

const TOOLS: { id: ToolId; label: string; icon: IconName }[] = [
  { id: 'draw', label: '판서', icon: 'pen' },
  { id: 'timer', label: '타이머', icon: 'timer' },
  { id: 'pecs', label: 'PECS', icon: 'cards' },
  { id: 'worksheet', label: '학습지', icon: 'printer' },
  { id: 'resources', label: '교사 자료', icon: 'link' },
];

const DOCK_COLLAPSED_KEY = 'ai-students-dock-collapsed';

interface Props {
  lessonId: LessonId;
}

/**
 * 교실 도구 도크 — 차시 화면 한정, 전부 공개(게이팅 없음).
 * 이전/다음 푸터 바의 중앙 위에 사각으로 붙는다(호버링 X → 본문 버튼과 겹치지 않음).
 * 접기/펼치기 토글(선택은 기기에 기억). §2~3 설계 참고.
 */
export default function ClassroomDock({ lessonId }: Props) {
  const [open, setOpen] = useState<ToolId | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(
    () => { try { return localStorage.getItem(DOCK_COLLAPSED_KEY) === '1'; } catch { return false; } },
  );
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const moduleId = moduleIdFromLessonId(lessonId) ?? 'm1';
  const theme = themeFor(moduleId);
  const resources = TEACHER_RESOURCES[moduleId];

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

  function toggle(id: ToolId) {
    setOpen((cur) => (cur === id ? null : id));
  }

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem(DOCK_COLLAPSED_KEY, next ? '1' : '0'); } catch { /* ignore */ }
    if (next) setOpen(null); // 접을 때 열린 패널 닫기
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

  return (
    <>
      {/* 이전/다음 바(footer, h-20) 중앙 위에 붙는 도구 바 */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-20 z-30 flex flex-col items-center gap-2 pointer-events-none">
        {!collapsed && panelTool && (
          <div
            className="rounded-[var(--r-md)] overflow-hidden pointer-events-auto max-h-[60vh] overflow-y-auto"
            style={{ background: 'var(--paper-0)', boxShadow: 'var(--e-2)', border: '1px solid var(--border)' }}
          >
            <div className="flex justify-end p-1">
              <button
                onClick={() => setOpen(null)}
                aria-label="패널 닫기"
                className="h-8 w-8 rounded-[var(--r-sm)] hover:bg-[color:var(--paper-2)] flex items-center justify-center"
              ><Icon name="close" size={16} /></button>
            </div>
            <div className="px-1 pb-2">
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
              {panelTool === 'worksheet' && (
                <div className="p-4 w-64 text-center">
                  <p className="text-[color:var(--muted)]">학습지는 준비 중이에요.</p>
                </div>
              )}
              {panelTool === 'resources' && (
                <div className="p-4 w-64">
                  <h3 className="text-lg font-bold mb-2" style={{ color: theme.accent }}>교사 자료</h3>
                  {resources.length === 0 ? (
                    <p className="text-[color:var(--muted)]">자료 준비 중이에요.</p>
                  ) : (
                    <ul className="space-y-2">
                      {resources.map((r) => (
                        <li key={r.url}>
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener"
                            className="underline"
                            style={{ color: theme.accent }}
                          >{r.label}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 사각 도구 바 — 위 모서리만 둥글게, 아래는 footer에 붙는 느낌 */}
        <div
          className="pointer-events-auto flex items-center gap-1 px-1.5 py-1 rounded-t-[var(--r-md)] border border-b-0"
          style={{ background: 'var(--paper-0)', boxShadow: 'var(--e-2)', borderColor: 'var(--border)' }}
        >
          {collapsed ? (
            <button
              onClick={toggleCollapsed}
              aria-label="교사 도구 펼치기"
              aria-expanded={false}
              title="교사 도구 펼치기"
              className="h-10 px-3 inline-flex items-center gap-1.5 rounded-[var(--r-sm)] text-sm font-semibold hover:bg-[color:var(--paper-2)]"
              style={{ color: 'var(--muted)' }}
            >
              <Icon name="pen" size={16} /> 교사 도구 <Icon name="chevron-up" size={16} />
              {timerChip}
            </button>
          ) : (
            <>
              {TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => toggle(tool.id)}
                  aria-label={tool.label}
                  aria-pressed={open === tool.id}
                  title={tool.label}
                  className="h-11 w-11 rounded-full flex items-center justify-center"
                  style={{
                    background: open === tool.id ? theme.accentSoft : 'transparent',
                    color: open === tool.id ? theme.accent : 'var(--ink-1)',
                  }}
                ><Icon name={tool.icon} size={22} /></button>
              ))}
              {open !== 'timer' && timerChip}
              <span className="w-px h-6 mx-0.5 shrink-0" style={{ background: 'var(--border)' }} aria-hidden />
              <button
                onClick={toggleCollapsed}
                aria-label="교사 도구 접기"
                aria-expanded
                title="교사 도구 접기"
                className="h-11 w-9 rounded-[var(--r-sm)] flex items-center justify-center hover:bg-[color:var(--paper-2)]"
                style={{ color: 'var(--muted)' }}
              ><Icon name="chevron-down" size={20} /></button>
            </>
          )}
        </div>
      </div>
      {open === 'draw' && <DrawBoard onClose={() => setOpen(null)} />}
    </>
  );
}
