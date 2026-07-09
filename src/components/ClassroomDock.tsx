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

interface Props {
  lessonId: LessonId;
}

/**
 * 교실 도구 도크 — 차시 화면 한정, 전부 공개(게이팅 없음). §2~3 설계 참고.
 */
export default function ClassroomDock({ lessonId }: Props) {
  const [open, setOpen] = useState<ToolId | null>(null);
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

  const panelTool = open && open !== 'draw' ? (open as PanelId) : null;

  return (
    <>
      <div className="fixed left-3 md:left-6 z-30 flex flex-col items-start gap-2" style={{ bottom: '6rem' }}>
        {panelTool && (
          <div
            className="rounded-[var(--r-md)] overflow-hidden"
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
        <div
          className="flex items-center gap-1 p-1.5 rounded-[var(--r-pill)]"
          style={{ background: 'var(--paper-0)', boxShadow: 'var(--e-2)', border: '1px solid var(--border)' }}
        >
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
          {timerRemaining !== null && open !== 'timer' && (
            <span
              className="ml-1 h-8 px-2 rounded-[var(--r-pill)] text-sm font-bold tabular-nums flex items-center"
              style={{
                background: timerRemaining === 0 ? 'var(--warn-bg)' : 'var(--paper-2)',
                color: timerRemaining === 0 ? 'var(--warn)' : 'var(--ink-1)',
              }}
            >{formatTime(timerRemaining)}</span>
          )}
        </div>
      </div>
      {open === 'draw' && <DrawBoard onClose={() => setOpen(null)} />}
    </>
  );
}
