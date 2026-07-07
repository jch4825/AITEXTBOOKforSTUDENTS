import { useProgress } from '../context/ProgressContext';
import { MODULES, lessonIdsForModule } from '../data/modules';
import { getLesson } from '../data/lessons';
import CharacterAvatar from '../components/CharacterAvatar';
import Button from '../components/Button';
import Icon from '../components/Icon';
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
        {/* AI 동아리 친구들 — 아이미가 가운데에서 환영 */}
        <div className="flex justify-center items-end gap-1 mb-6 story-fade-in" aria-hidden>
          <CharacterAvatar character="jinwoo" expression="happy" size={64} />
          <CharacterAvatar character="aimi" expression="cheer" size={88} />
          <CharacterAvatar character="yoona" expression="happy" size={64} />
        </div>
        <h1 className="t-display mb-4" style={{ color: 'var(--accent)' }}>
          AI 교과서
        </h1>
        <p className="text-xl mb-2">
          {isResume
            ? '아이미가 기다리고 있었어요!'
            : '진우, 윤아랑 같이 AI 친구 아이미를 만나러 가요'}
        </p>
        <p className="text-base text-[color:var(--muted)] mb-8 nums">
          지금까지 <strong>{doneCount}</strong> / {totalLessons} 차시 끝났어요
        </p>
        <Button size="lg" onClick={() => onStart(resumeLesson)} className="text-2xl">
          {isResume
            ? <><Icon name="book" size={26} /> 이어서 하기</>
            : <><Icon name="rocket" size={26} /> 공부 시작!</>}
        </Button>
      </div>
    </main>
  );
}
