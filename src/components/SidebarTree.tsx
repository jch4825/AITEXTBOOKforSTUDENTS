import { MODULES, lessonIdsForModule } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import { useProgress } from '../context/ProgressContext';
import { getLesson } from '../data/lessons';
import type { LessonId } from '../types';

interface Props {
  currentLessonId: LessonId | null;
  onPickLesson: (id: LessonId) => void;
}

export default function SidebarTree({ currentLessonId, onPickLesson }: Props) {
  const { isCompleted } = useProgress();

  return (
    <nav className="w-64 shrink-0 md:border-r border-[color:var(--border)] bg-white p-4 md:overflow-y-auto">
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
    </nav>
  );
}
