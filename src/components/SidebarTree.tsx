import { useEffect, useState } from 'react';
import { MODULES, lessonIdsForModule, moduleIdFromLessonId } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import { useProgress } from '../context/ProgressContext';
import { getLesson } from '../data/lessons';
import { hasApiKey } from '../utils/apiKey';
import ModuleIcon from './ModuleIcon';
import Icon from './Icon';
import type { LessonId, ModuleId } from '../types';

/** ?teacher=1 로 이동 — base path를 유지한 채 교사 모드(비번 게이트)로 진입한다. */
function goTeacherMode() {
  const url = new URL(window.location.href);
  url.search = '?teacher=1';
  window.location.href = url.toString();
}

interface Props {
  currentLessonId: LessonId | null;
  onPickLesson: (id: LessonId) => void;
}

export default function SidebarTree({ currentLessonId, onPickLesson }: Props) {
  const { isCompleted } = useProgress();
  const aiConnected = hasApiKey();
  const currentModule = currentLessonId ? moduleIdFromLessonId(currentLessonId) : null;

  // 정보 과부하 방지 — 기본은 "지금 차시의 모듈"만 펼치고 나머지는 접어 둔다.
  const [openModules, setOpenModules] = useState<Set<ModuleId>>(
    () => new Set(currentModule ? [currentModule] : ['m1']),
  );

  // 다른 차시로 이동하면 그 모듈을 펼쳐 준다 (다른 모듈은 접힌 상태 유지).
  useEffect(() => {
    if (currentModule) setOpenModules(s => (s.has(currentModule) ? s : new Set(s).add(currentModule)));
  }, [currentModule]);

  function toggle(id: ModuleId) {
    setOpenModules(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  return (
    <nav className="w-64 shrink-0 md:h-full md:border-r border-[color:var(--border)] bg-[color:var(--paper-0)] p-4 md:overflow-y-auto md:flex md:flex-col">
      <div className="md:flex-1 space-y-1.5">
      {MODULES.map(mod => {
        const theme = themeFor(mod.id);
        const lessons = lessonIdsForModule(mod.id);
        const doneInModule = lessons.filter(isCompleted).length;
        const moduleDone = doneInModule === lessons.length && lessons.length > 0;
        const isOpen = openModules.has(mod.id);
        return (
          <section key={mod.id}>
            {/* 모듈 헤더 — 누르면 아래 도장판이 접혔다 펼쳐진다 (정보량 축소) */}
            <button
              onClick={() => toggle(mod.id)}
              aria-expanded={isOpen}
              className="w-full text-left rounded-[var(--r-sm)] px-1.5 py-1.5 flex items-center gap-1.5 hover:bg-[color:var(--paper-2)]"
              style={{ color: theme.accentText }}
            >
              <ModuleIcon moduleId={mod.id} size={20} />
              <span className="t-label truncate">모듈 {mod.number}. {mod.title}</span>
              <span
                className="ml-auto text-xs font-semibold text-[color:var(--muted)] nums inline-flex items-center gap-1 shrink-0"
                aria-label={`${lessons.length}차시 중 ${doneInModule}차시 완료${moduleDone ? ' — 모듈 완주!' : ''}`}
              >
                {moduleDone && <Icon name="star" size={13} filled color={theme.accent} />}
                {doneInModule}/{lessons.length}
              </span>
              <span
                aria-hidden
                className="shrink-0 transition-transform"
                style={{ transform: isOpen ? 'rotate(90deg)' : 'none', color: theme.accent }}
              >
                <Icon name="chevron-right" size={16} />
              </span>
            </button>

            {/* 도장판 — 완료한 차시마다 모듈색 별 도장 (§4.2). 접힘 시 숨김 */}
            {isOpen && (
              <ul className="flex flex-wrap pl-1 pt-1 pb-2">
                {lessons.map((lid, i) => {
                  const done = isCompleted(lid);
                  const current = lid === currentLessonId;
                  const title = getLesson(lid)?.title;
                  const label =
                    `${i + 1}차시${title ? `. ${title}` : ''}` +
                    (done ? ' (완료)' : '') +
                    (current ? ' — 지금 보는 중' : '');
                  return (
                    <li key={lid}>
                      {/* 히트 영역 32px — 도장/빈 칸은 그 안에 */}
                      <button
                        onClick={() => onPickLesson(lid)}
                        title={label}
                        aria-label={label}
                        aria-current={current ? 'page' : undefined}
                        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[color:var(--paper-2)]"
                        style={current ? { outline: `2px solid ${theme.accent}`, outlineOffset: '-2px' } : undefined}
                      >
                        {done ? (
                          <Icon name="star" size={18} filled color={theme.accent} />
                        ) : (
                          <span
                            aria-hidden
                            className="h-4 w-4 rounded-full border-2 block"
                            style={{
                              background: current ? theme.accentSoft : 'var(--paper-0)',
                              borderColor: theme.accent,
                            }}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
      </div>

      {/* 교사용 진입점 — 키 입력 UI는 비번 게이트 뒤(TeacherView)에만 존재한다 */}
      <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
        <button
          onClick={goTeacherMode}
          className="w-full h-12 px-3 rounded-[var(--r-sm)] border-2 flex items-center gap-2 text-sm font-semibold bg-[color:var(--paper-0)] hover:bg-[color:var(--paper-2)]"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          title="교사 모드에서 Gemini API 키를 연결해요 (비밀번호 필요)"
        >
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ background: aiConnected ? 'var(--ok)' : 'var(--warn)' }}
          />
          <Icon name="settings" size={18} />
          <span className="truncate">
            선생님 · AI {aiConnected ? '연결됨' : '연결하기'}
          </span>
        </button>
      </div>
    </nav>
  );
}
