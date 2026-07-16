import { useState, type FormEvent } from 'react';
import Button from '../components/Button';
import TeacherHub from '../features/teacher/TeacherHub';
import { isTeacherSessionActive, logout, tryUnlock } from '../utils/teacherMode';

interface Props {
  onExit: () => void;
}

export default function TeacherView({ onExit }: Props) {
  const [active, setActive] = useState<boolean>(isTeacherSessionActive());
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleUnlock(event: FormEvent) {
    event.preventDefault();
    if (tryUnlock(password)) {
      setActive(true);
      setError(null);
    } else {
      setError('비밀번호가 맞지 않아요.');
    }
  }

  if (!active) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={handleUnlock} className="card w-full max-w-sm border border-[color:var(--border)] p-8">
          <h1 className="mb-4 text-2xl font-bold">교사 모드</h1>
          <label className="mb-2 block font-semibold" htmlFor="teacher-password">비밀번호</label>
          <input
            id="teacher-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mb-4 w-full rounded-[var(--r-sm)] border-2 border-[color:var(--border)] p-3"
            autoFocus
          />
          {error && <p className="mb-3 text-red-700">{error}</p>}
          <Button type="submit" className="w-full">들어가기</Button>
          <Button type="button" variant="ghost" onClick={onExit} className="mt-2 w-full">학생 화면으로 돌아가기</Button>
        </form>
      </main>
    );
  }

  return (
    <TeacherHub
      onExit={onExit}
      onLogout={() => {
        logout();
        setActive(false);
      }}
    />
  );
}
