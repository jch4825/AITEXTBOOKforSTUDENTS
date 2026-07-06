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
  const [navOpen, setNavOpen] = useState(false);

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
        onOpenNav={() => setNavOpen(true)}
      />
      <div className="flex flex-1 min-h-0">
        {/* PC: 고정 사이드바 / 모바일: 숨김 (아래 드로어로 대체) */}
        <div className="hidden md:block">
          <SidebarTree currentLessonId={lessonId} onPickLesson={onPickLesson} />
        </div>
        {navOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setNavOpen(false)}
          >
            <div
              className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="차례"
            >
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setNavOpen(false)}
                  aria-label="차례 닫기"
                  className="h-10 w-10 rounded hover:bg-gray-100 text-xl"
                >×</button>
              </div>
              <SidebarTree
                currentLessonId={lessonId}
                onPickLesson={(id) => { setNavOpen(false); onPickLesson(id); }}
              />
            </div>
          </div>
        )}
        <main className="flex-1 min-w-0 p-4 md:px-8 md:py-10 overflow-y-auto" data-open-term={undefined}>
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
        >{currentStep + 1 >= totalSteps ? '🎉 다 했어요!' : '다음 ▶'}</button>
      </footer>
    </div>
  );
}
