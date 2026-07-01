import { MODULES, lessonIdsForModule } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import { useProgress } from '../context/ProgressContext';
import type { LessonId } from '../types';

interface Props {
  currentLessonId: LessonId | null;
  onPickLesson: (id: LessonId) => void;
}

export default function SidebarTree({ currentLessonId, onPickLesson }: Props) {
  const { isCompleted } = useProgress();

  return (
    <nav className="w-64 shrink-0 border-r border-[color:var(--border)] bg-white p-4 overflow-y-auto">
      {MODULES.map(mod => {
        const theme = themeFor(mod.id);
        const lessons = lessonIdsForModule(mod.id);
        const doneInModule = lessons.filter(isCompleted).length;
        return (
          <section key={mod.id} className="mb-5">
            <h3 className="text-sm font-bold mb-2 flex items-baseline gap-1" style={{ color: theme.accent }}>
              <span>{theme.emoji}</span>
              <span>모듈 {mod.number}. {mod.title}</span>
              <span className="ml-auto text-xs font-semibold text-[color:var(--muted)]" aria-label={`${lessons.length}차시 중 ${doneInModule}차시 완료`}>
                {doneInModule}/{lessons.length}
              </span>
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {lessons.map(lid => {
                const done = isCompleted(lid);
                const current = lid === currentLessonId;
                return (
                  <li key={lid}>
                    <button
                      onClick={() => onPickLesson(lid)}
                      title={lid}
                      aria-current={current ? 'page' : undefined}
                      className="h-4 w-4 rounded-full border-2 transition"
                      style={{
                        background: done ? theme.accent : current ? theme.accentSoft : 'white',
                        borderColor: theme.accent,
                        outline: current ? `2px solid ${theme.accent}` : 'none',
                        outlineOffset: '2px',
                      }}
                    />
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
