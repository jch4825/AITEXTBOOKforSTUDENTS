import { useCallback, useEffect, useState } from 'react';
import Home from './views/Home';
import ContentsView from './views/ContentsView';
import LessonView from './views/LessonView';
import TeacherView from './views/TeacherView';
import type { LessonId, ViewName } from './types';
import { isTeacherUrlRequested, isLogoutRequested, logout } from './utils/teacherMode';

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
  window.history.pushState({}, '', url.toString());
}

export default function App() {
  const [state, setState] = useState(() => readViewFromUrl());

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

  if (state.view === 'teacher') return <TeacherView onExit={goHome} />;
  if (state.view === 'lesson' && state.lessonId) {
    // 차시의 "홈"은 학습 허브인 목차로 — 완료 후에도 목차로 돌아온다.
    return <LessonView lessonId={state.lessonId} onGoHome={goContents} onPickLesson={goLesson} />;
  }
  if (state.view === 'contents') {
    return <ContentsView onPickLesson={goLesson} onGoHome={goHome} />;
  }
  return <Home onEnter={goContents} onEnterLesson={goLesson} />;
}
