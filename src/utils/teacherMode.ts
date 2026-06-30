import { loadTeacherMode, setTeacherMode } from './storage';

/**
 * Teacher mode rules:
 * 1. URL `?teacher=1` shows the teacher login form
 * 2. If the entered password matches `VITE_TEACHER_MODE_PASSWORD`, persist `teacherMode=1` in localStorage
 * 3. Subsequent visits without the URL flag stay in student mode
 *    — `?teacher=1` is required each time to re-enter the teacher view
 * 4. `?teacher=logout` clears the flag
 */

const ENV_PASSWORD = (import.meta.env.VITE_TEACHER_MODE_PASSWORD as string | undefined) ?? '';

export function isTeacherUrlRequested(search: string = window.location.search): boolean {
  const params = new URLSearchParams(search);
  return params.get('teacher') === '1';
}

export function isLogoutRequested(search: string = window.location.search): boolean {
  const params = new URLSearchParams(search);
  return params.get('teacher') === 'logout';
}

export function isTeacherSessionActive(): boolean {
  return loadTeacherMode();
}

export function tryUnlock(password: string): boolean {
  if (!ENV_PASSWORD) {
    // Dev convenience: when no env password is set, accept literal "teacher"
    if (password === 'teacher') { setTeacherMode(true); return true; }
    return false;
  }
  if (password === ENV_PASSWORD) { setTeacherMode(true); return true; }
  return false;
}

export function logout(): void {
  setTeacherMode(false);
}
