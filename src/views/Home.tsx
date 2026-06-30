import { useProgress } from '../context/ProgressContext';
import { MODULES } from '../data/modules';

interface Props {
  onStart: () => void;
}

export default function Home({ onStart }: Props) {
  const { completedLessons } = useProgress();
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessonCount, 0);
  const doneCount = completedLessons.length;

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
          onClick={onStart}
          className="px-8 py-4 rounded-xl text-2xl font-bold text-white shadow-lg"
          style={{ background: 'var(--accent)' }}
        >
          🚀 공부 시작!
        </button>
      </div>
    </main>
  );
}
