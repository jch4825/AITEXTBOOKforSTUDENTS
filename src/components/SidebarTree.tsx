import { MODULES, lessonIdsForModule } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import { useProgress } from '../context/ProgressContext';
import { getLesson } from '../data/lessons';
import { hasApiKey } from '../utils/apiKey';
import type { LessonId } from '../types';

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

  return (
    <nav className="w-64 shrink-0 md:h-full md:border-r border-[color:var(--border)] bg-white p-4 md:overflow-y-auto md:flex md:flex-col">
      <div className="md:flex-1">
      {MODULES.map(mod => {
        const theme = themeFor(mod.id);
        const lessons = lessonIdsForModule(mod.id);
        const doneInModule = lessons.filter(isCompleted).length;
        return (
          <section key={mod.id} className="mb-5">
            <h3 className="text-sm font-bold mb-2 flex items-baseline gap-1" style={{ color: theme.accentText }}>
              <span>{theme.emoji}</span>
              <span>모듈 {mod.number}. {mod.title}</span>
              <span className="ml-auto text-xs font-semibold text-[color:var(--muted)]" aria-label={`${lessons.length}차시 중 ${doneInModule}차시 완료`}>
                {doneInModule}/{lessons.length}
              </span>
            </h3>
            <ul className="flex flex-wrap">
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
                    {/* 히트 영역 32px — 시각적 점은 그 안의 16px */}
                    <button
                      onClick={() => onPickLesson(lid)}
                      title={label}
                      aria-label={label}
                      aria-current={current ? 'page' : undefined}
                      className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[color:var(--bg)]"
                    >
                      <span
                        aria-hidden
                        className="h-4 w-4 rounded-full border-2 block transition"
                        style={{
                          background: done ? theme.accent : current ? theme.accentSoft : 'white',
                          borderColor: theme.accent,
                          outline: current ? `2px solid ${theme.accent}` : 'none',
                          outlineOffset: '2px',
                        }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      </div>

      {/* 교사용 진입점 — 키 입력 UI는 비번 게이트 뒤(TeacherView)에만 존재한다 */}
      <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
        <button
          onClick={goTeacherMode}
          className="w-full h-12 px-3 rounded-lg border-2 flex items-center gap-2 text-sm font-semibold bg-white hover:bg-[color:var(--bg)]"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          title="교사 모드에서 Gemini API 키를 연결해요 (비밀번호 필요)"
        >
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ background: aiConnected ? 'var(--ok)' : 'var(--warn)' }}
          />
          <span className="truncate">
            ⚙️ 선생님 · AI {aiConnected ? '연결됨' : '연결하기'}
          </span>
        </button>
      </div>
    </nav>
  );
}
