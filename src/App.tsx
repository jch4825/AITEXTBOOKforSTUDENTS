import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Home from './views/Home';
import type { LessonId, ViewName } from './types';
import useExitGuard, { pushAppHistory } from './hooks/useExitGuard';
import { isTeacherUrlRequested, isLogoutRequested, logout } from './utils/teacherMode';

// 홈은 첫 화면이라 그대로 둔다. 나머지 셋은 들어갈 때 받아 온다.
// 특히 차시 화면은 62개 스튜디오 데이터를 통째로 끌고 오므로 분리 효과가 가장 크고,
// 교사 화면은 학생이 한 번도 열지 않는다.
const ContentsView = lazy(() => import('./views/ContentsView'));
const LessonView = lazy(() => import('./views/LessonView'));
const TeacherView = lazy(() => import('./views/TeacherView'));

function ViewLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-dvh place-items-center px-6 text-center"
      style={{ color: 'var(--ink-2)' }}
    >
      <p className="text-lg font-extrabold">잠시만 기다려 주세요.</p>
    </div>
  );
}

function readViewFromUrl(): { view: ViewName; lessonId: LessonId | null } {
  const params = new URLSearchParams(window.location.search);
  if (isLogoutRequested()) {
    logout();
    return { view: 'home', lessonId: null };
  }
  if (isTeacherUrlRequested()) return { view: 'teacher', lessonId: null };
  const lessonId = params.get('lesson');
  if (lessonId) return { view: 'lesson', lessonId };
  if (params.has('contents')) return { view: 'contents', lessonId: null };
  return { view: 'home', lessonId: null };
}

function updateUrl(view: ViewName, lessonId: LessonId | null) {
  const url = new URL(window.location.href);
  url.searchParams.delete('lesson');
  url.searchParams.delete('teacher');
  url.searchParams.delete('contents');
  if (view === 'lesson' && lessonId) url.searchParams.set('lesson', lessonId);
  if (view === 'teacher') url.searchParams.set('teacher', '1');
  if (view === 'contents') url.searchParams.set('contents', '1');
  pushAppHistory(url.toString());
}

function ExitGuardNotice() {
  return (
    <div
      role="status"
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex justify-center px-4"
    >
      <p className="max-w-[22rem] rounded-2xl bg-[color:var(--ink-1,#26324a)] px-5 py-4 text-center text-base font-extrabold leading-relaxed text-white depth-overlay">
        한 번 더 누르면 나가요.
      </p>
    </div>
  );
}

export default function App() {
  const [state, setState] = useState(() => readViewFromUrl());
  const showExitNotice = useExitGuard();

  useEffect(() => {
    const handler = () => setState(readViewFromUrl());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const goHome = useCallback(() => {
    setState({ view: 'home', lessonId: null });
    updateUrl('home', null);
  }, []);

  const goContents = useCallback(() => {
    setState({ view: 'contents', lessonId: null });
    updateUrl('contents', null);
  }, []);

  const goLesson = useCallback((id: LessonId) => {
    setState({ view: 'lesson', lessonId: id });
    updateUrl('lesson', id);
  }, []);

  // 뒤로 가기 안내는 어느 화면에서 눌러도 보여야 해서 화면 선택 결과를 감싼다.
  function renderView() {
    if (state.view === 'teacher') {
      return (
        <Suspense fallback={<ViewLoading />}>
          <TeacherView onExit={goHome} />
        </Suspense>
      );
    }
    if (state.view === 'lesson' && state.lessonId) {
      // 차시의 "홈"은 학습 허브인 목차로 — 완료 후에도 목차로 돌아온다.
      return (
        <Suspense fallback={<ViewLoading />}>
          <LessonView
            key={state.lessonId}
            lessonId={state.lessonId}
            onGoHome={goContents}
            onPickLesson={goLesson}
          />
        </Suspense>
      );
    }
    if (state.view === 'contents') {
      return (
        <Suspense fallback={<ViewLoading />}>
          <ContentsView onPickLesson={goLesson} onGoHome={goHome} />
        </Suspense>
      );
    }
    return <Home onEnter={goContents} onEnterLesson={goLesson} />;
  }

  return (
    <>
      {renderView()}
      {showExitNotice && <ExitGuardNotice />}
    </>
  );
}
