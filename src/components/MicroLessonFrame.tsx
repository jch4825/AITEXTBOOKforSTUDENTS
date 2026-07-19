import { useState, type ReactNode } from 'react';
import SidebarTree from './SidebarTree';
import TopBar from './TopBar';
import DictionaryPanel from './DictionaryPanel';
import ProgressDots from './ProgressDots';
import Button from './Button';
import Icon from './Icon';
import ClassroomDock from './ClassroomDock';
import type { LessonId } from '../types';
import { formatDebugPageId, isDebugMode, type DebugSubPage } from '../utils/debugMode';

interface Props {
  lessonId: LessonId;
  crumb: string;
  totalSteps: number;
  currentStep: number;
  onPrev: () => void;
  onNext: () => void;
  onPickLesson: (id: LessonId) => void;
  onGoHome: () => void;
  pageKey?: string;
  subPage?: DebugSubPage;
  children: ReactNode;
}

const SIDEBAR_COLLAPSED_KEY = 'ai-students-sidebar-collapsed';

export default function MicroLessonFrame({
  lessonId, crumb, totalSteps, currentStep,
  onPrev, onNext, onPickLesson, onGoHome, pageKey, subPage, children,
}: Props) {
  const [dictOpen, setDictOpen] = useState(false);
  const [dictQuery, setDictQuery] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  // 데스크톱 사이드바 접기(집중 모드) — 선택을 기기에 기억한다.
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(
    () => { try { return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'; } catch { return false; } },
  );
  const debugPageId = isDebugMode()
    ? formatDebugPageId({
        lessonId,
        current: currentStep + 1,
        total: totalSteps,
        pageKey,
        subPage,
      })
    : null;

  function toggleSidebar() {
    setSidebarCollapsed(v => {
      const next = !v;
      try { localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  }

  function openTerm(term: string) {
    setDictQuery(term);
    setDictOpen(true);
  }

  return (
    // h-dvh 고정 — 푸터(다음/이전)가 항상 보이고, 본문·사이드바가 각자 내부 스크롤된다.
    // dvh(동적 뷰포트): 모바일 주소창이 보여도 푸터가 화면 밖으로 밀리지 않는다(vh는 밀림).
    // relative: 교사 도구 도크(absolute)의 앵커 — 프레임 기준이라 모바일에서도 안 흔들린다.
    <div className="h-dvh flex flex-col relative">
      <TopBar
        crumb={crumb}
        onOpenDictionary={() => { setDictQuery(null); setDictOpen(true); }}
        onGoHome={onGoHome}
        onOpenNav={() => setNavOpen(true)}
      />
      <div className="flex flex-1 min-h-0">
        {/* PC: 접을 수 있는 사이드바 (localStorage: ai-students-sidebar-collapsed) / 모바일: ☰ 드로어 */}
        {sidebarCollapsed ? (
          // 접힘 — 얇은 레일 + 펼치기 버튼 (집중 모드)
          <div className="hidden md:flex self-stretch w-10 shrink-0 border-r border-[color:var(--border)] bg-[color:var(--paper-0)] flex-col items-center pt-3">
            <button
              onClick={toggleSidebar}
              aria-label="차례 펼치기"
              aria-expanded={false}
              title="차례 펼치기"
              className="h-9 w-9 rounded-[var(--r-sm)] flex items-center justify-center hover:bg-[color:var(--paper-2)]"
              style={{ color: 'var(--accent)' }}
            ><Icon name="chevron-right" size={20} /></button>
          </div>
        ) : (
          <div className="hidden md:flex self-stretch flex-col bg-[color:var(--paper-0)] border-r border-[color:var(--border)]">
            <div className="flex justify-end px-2 pt-2">
              <button
                onClick={toggleSidebar}
                aria-label="차례 접기"
                aria-expanded
                title="차례 접기 (집중 모드)"
                className="h-9 px-2 rounded-[var(--r-sm)] inline-flex items-center gap-1 text-sm font-semibold hover:bg-[color:var(--paper-2)]"
                style={{ color: 'var(--muted)' }}
              ><Icon name="chevron-left" size={18} /> 접기</button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <SidebarTree currentLessonId={lessonId} onPickLesson={onPickLesson} />
            </div>
          </div>
        )}
        {navOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setNavOpen(false)}
          >
            <div
              className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto"
              style={{ background: 'var(--paper-0)', boxShadow: 'var(--e-2)' }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="차례"
            >
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setNavOpen(false)}
                  aria-label="차례 닫기"
                  className="h-10 w-10 rounded-[var(--r-sm)] hover:bg-[color:var(--paper-2)] flex items-center justify-center"
                ><Icon name="close" size={22} /></button>
              </div>
              <SidebarTree
                currentLessonId={lessonId}
                onPickLesson={(id) => { setNavOpen(false); onPickLesson(id); }}
              />
            </div>
          </div>
        )}
        {/* pb-20: 교사 도구 도크(약 53px, absolute·footer 위 부상)가 스크롤 최하단 콘텐츠·버튼을
            가리지 않도록 확보한 하단 여백. 도크는 프레임에 absolute라 흐름 밖 → main 여백으로만 비켜준다. */}
        <main className="flex-1 min-w-0 p-4 pb-20 md:px-8 md:py-10 md:pb-20 overflow-y-auto" data-open-term={undefined}>
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
      <ClassroomDock lessonId={lessonId} />
      <footer className="comic-frame-footer h-20 shrink-0 px-3 md:px-6 flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          onClick={onPrev}
          disabled={currentStep === 0}
          className="px-4 md:px-6"
        ><Icon name="chevron-left" size={20} /> 이전</Button>
        <div
          className="comic-cut-progress min-w-0"
          aria-label={debugPageId
            ? `디버그 페이지 ${debugPageId}`
            : `전체 ${totalSteps}컷 중 ${currentStep + 1}번째 컷`}
          data-debug-page-id={debugPageId ?? undefined}
        >
          {debugPageId ? (
            <code className="block max-w-[48vw] overflow-x-auto whitespace-nowrap font-mono text-[10px] leading-tight select-text md:max-w-none md:text-xs">
              {debugPageId}
            </code>
          ) : (
            <span>{String(currentStep + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}</span>
          )}
          <ProgressDots total={totalSteps} current={currentStep} />
        </div>
        <Button
          onClick={onNext}
          className="px-4 md:px-6"
        >{currentStep + 1 >= totalSteps
          ? <><Icon name="sparkles" size={20} filled /> 다 했습니다!</>
          : <>다음 <Icon name="chevron-right" size={20} /></>}</Button>
      </footer>
    </div>
  );
}
