import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { LessonId, ProgressState } from '../types';
import { loadProgress, saveProgress } from '../utils/storage';

interface ProgressContextValue extends ProgressState {
  isCompleted: (id: LessonId) => boolean;
  markCompleted: (id: LessonId) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadProgress());

  useEffect(() => { saveProgress(state); }, [state]);

  const isCompleted = useCallback(
    (id: LessonId) => state.completedLessons.includes(id),
    [state.completedLessons],
  );

  const markCompleted = useCallback((id: LessonId) => {
    setState(s => s.completedLessons.includes(id)
      ? s
      : { completedLessons: [...s.completedLessons, id] });
  }, []);

  const reset = useCallback(() => setState({ completedLessons: [] }), []);

  const value = useMemo<ProgressContextValue>(
    () => ({ ...state, isCompleted, markCompleted, reset }),
    [state, isCompleted, markCompleted, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
