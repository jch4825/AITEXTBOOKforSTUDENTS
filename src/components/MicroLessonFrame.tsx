import { useState, type ReactNode } from 'react';
import SidebarTree from './SidebarTree';
import TopBar from './TopBar';
import DictionaryPanel from './DictionaryPanel';
import ProgressDots from './ProgressDots';
import type { LessonId } from '../types';

interface Props {
  lessonId: LessonId;
  crumb: string;
  totalSteps: number;
  currentStep: number;
  onPrev: () => void;
  onNext: () => void;
  onPickLesson: (id: LessonId) => void;
  onGoHome: () => void;
  children: ReactNode;
}

export default function MicroLessonFrame({
  lessonId, crumb, totalSteps, currentStep,
  onPrev, onNext, onPickLesson, onGoHome, children,
}: Props) {
  const [dictOpen, setDictOpen] = useState(false);
  const [dictQuery, setDictQuery] = useState<string | null>(null);

  function openTerm(term: string) {
    setDictQuery(term);
    setDictOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        crumb={crumb}
        onOpenDictionary={() => { setDictQuery(null); setDictOpen(true); }}
        onGoHome={onGoHome}
      />
      <div className="flex flex-1 min-h-0">
        <SidebarTree currentLessonId={lessonId} onPickLesson={onPickLesson} />
        <main className="flex-1 p-8 overflow-y-auto" data-open-term={undefined}>
          {/* expose openTerm to children via a custom event */}
          <div onClickCapture={(e) => {
            const target = e.target as HTMLElement;
            const termBtn = target.closest('[data-dict-term]') as HTMLElement | null;
            if (termBtn) {
              const term = termBtn.getAttribute('data-dict-term');
              if (term) openTerm(term);
            }
          }}>
            {children}
          </div>
        </main>
        <DictionaryPanel
          open={dictOpen}
          query={dictQuery}
          onClose={() => setDictOpen(false)}
          onSearch={setDictQuery}
        />
      </div>
      <footer className="h-20 shrink-0 border-t border-[color:var(--border)] bg-white px-6 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="h-12 px-6 rounded border-2 font-semibold disabled:opacity-40"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
        >◀ 이전</button>
        <ProgressDots total={totalSteps} current={currentStep} />
        <button
          onClick={onNext}
          className="h-12 px-6 rounded font-semibold text-white"
          style={{ background: 'var(--accent)' }}
        >{currentStep + 1 >= totalSteps ? '끝내기 ✓' : '다음 ▶'}</button>
      </footer>
    </div>
  );
}
