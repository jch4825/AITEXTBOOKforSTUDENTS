import { useState, type FormEvent } from 'react';
import { isTeacherSessionActive, tryUnlock, logout } from '../utils/teacherMode';

interface Props {
  onExit: () => void;
}

export default function TeacherView({ onExit }: Props) {
  const [active, setActive] = useState<boolean>(isTeacherSessionActive());
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleUnlock(e: FormEvent) {
    e.preventDefault();
    if (tryUnlock(password)) {
      setActive(true);
      setError(null);
    } else {
      setError('비밀번호가 맞지 않아요.');
    }
  }

  if (!active) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={handleUnlock} className="max-w-sm w-full bg-white p-8 rounded-lg shadow border">
          <h1 className="text-2xl font-bold mb-4">교사 모드</h1>
          <label className="block mb-2 font-semibold">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 rounded mb-4"
            autoFocus
          />
          {error && <p className="text-red-700 mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 rounded font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >들어가기</button>
          <button
            type="button"
            onClick={onExit}
            className="w-full mt-2 px-4 py-2 text-[color:var(--muted)]"
          >학생 화면으로 돌아가기</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">교사 화면</h1>
        <div className="flex gap-2">
          <button
            onClick={onExit}
            className="px-4 py-2 rounded border-2 font-semibold"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >학생 화면으로</button>
          <button
            onClick={() => { logout(); setActive(false); }}
            className="px-4 py-2 rounded border-2 font-semibold text-red-700 border-red-300"
          >로그아웃</button>
        </div>
      </header>
      <section className="p-6 bg-white rounded-lg border">
        <p className="text-lg">교사용 설정·통계·API 키 관리는 M3 단계에서 추가됩니다.</p>
        <p className="text-sm text-[color:var(--muted)] mt-2">M1에서는 진입 동작만 검증합니다.</p>
      </section>
    </main>
  );
}
