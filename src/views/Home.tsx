import { useProgress } from '../context/ProgressContext';
import { MODULES, lessonIdsForModule } from '../data/modules';
import { getLesson } from '../data/lessons/m1';
import type { LessonId } from '../types';

interface Props {
  onStart: (lessonId: LessonId) => void;
}

/**
 * Order: m1-l1, m1-l2, ..., m6-l12. Only lessons that actually have content
 * (getLesson returns something) are eligible as a "next" target — otherwise
 * the resume button would jump into the "coming soon" placeholder.
 */
function pickResumeLesson(completed: LessonId[]): LessonId {
  const done = new Set(completed);
  for (const mod of MODULES) {
    for (const lid of lessonIdsForModule(mod.id)) {
      if (done.has(lid)) continue;
      if (getLesson(lid)) return lid;
    }
  }
  return 'm1-l1'; // fallback: everything implemented is done, start over
}

export default function Home({ onStart }: Props) {
  const { completedLessons } = useProgress();
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessonCount, 0);
  const doneCount = completedLessons.length;
  const resumeLesson = pickResumeLesson(completedLessons);
  const isResume = doneCount > 0;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--accent)' }}>
          AI 교과서
        </h1>
        <p className="text-xl mb-2">발달장애 학생을 위한 AI 학습</p>
        <p className="text-base text-[color:var(--muted)] mb-8">
          지금까지 <strong>{doneCount}</strong> / {totalLessons} 차시 끝났어요
        </p>
        <button
          onClick={() => onStart(resumeLesson)}
          className="px-8 py-4 rounded-xl text-2xl font-bold text-white shadow-lg"
          style={{ background: 'var(--accent)' }}
        >
          {isResume ? '📖 이어서 하기' : '🚀 공부 시작!'}
        </button>
      </div>
    </main>
  );
}
