import { useCallback, useEffect, useState } from 'react';
import Home from './views/Home';
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
  return { view: 'home', lessonId: null };
}

function updateUrl(view: ViewName, lessonId: LessonId | null) {
  const url = new URL(window.location.href);
  url.searchParams.delete('lesson');
  url.searchParams.delete('teacher');
  if (view === 'lesson' && lessonId) url.searchParams.set('lesson', lessonId);
  if (view === 'teacher') url.searchParams.set('teacher', '1');
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

  const goLesson = useCallback((id: LessonId) => {
    setState({ view: 'lesson', lessonId: id });
    updateUrl('lesson', id);
  }, []);

  if (state.view === 'teacher') return <TeacherView onExit={goHome} />;
  if (state.view === 'lesson' && state.lessonId) {
    return <LessonView lessonId={state.lessonId} onGoHome={goHome} onPickLesson={goLesson} />;
  }
  return <Home onStart={goLesson} />;
}
