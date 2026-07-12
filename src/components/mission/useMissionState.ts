import { useState, useEffect } from 'react';

export interface MissionStateData {
  studentName: string;
  answers: Record<string, any>;
  currentChapter: number;
}

export function useMissionState(lessonId: string) {
  const storageKey = `ai-students-mission-${lessonId}`;

  const [state, setState] = useState<MissionStateData>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse mission state from localStorage', e);
    }
    return {
      studentName: '',
      answers: {},
      currentChapter: 0,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save mission state to localStorage', e);
    }
  }, [state, storageKey]);

  const setStudentName = (name: string) => {
    setState((prev) => ({ ...prev, studentName: name }));
  };

  const setAnswer = (blockId: string, answer: any) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [blockId]: answer,
      },
    }));
  };

  const setCurrentChapter = (chapter: number) => {
    setState((prev) => ({ ...prev, currentChapter: chapter }));
  };

  const resetMission = () => {
    const newState = {
      studentName: '',
      answers: {},
      currentChapter: 0,
    };
    setState(newState);
    localStorage.removeItem(storageKey);
  };

  return {
    studentName: state.studentName,
    setStudentName,
    answers: state.answers,
    setAnswer,
    currentChapter: state.currentChapter,
    setCurrentChapter,
    resetMission,
  };
}
