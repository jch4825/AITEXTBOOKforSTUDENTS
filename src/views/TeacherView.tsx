import { useState, type FormEvent } from 'react';
import { isTeacherSessionActive, tryUnlock, logout } from '../utils/teacherMode';
import { getApiKey, setApiKey, clearApiKey, maskApiKey } from '../utils/apiKey';
import { askGemini, GeminiError, MODEL_FALLBACK } from '../utils/gemini';
import ErrorMessage from '../components/ErrorMessage';

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
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
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

      <ApiKeyPanel />
    </main>
  );
}

function ApiKeyPanel() {
  const [saved, setSaved] = useState<string | null>(getApiKey());
  const [draft, setDraft] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ text: string; modelUsed: string; safe: boolean; attemptLog: string[] } | null>(null);
  const [testError, setTestError] = useState<{ studentMessage: string; technicalDetail: string } | null>(null);

  function handleSave() {
    setApiKey(draft);
    setSaved(getApiKey());
    setDraft('');
    setTestResult(null);
    setTestError(null);
  }

  function handleClear() {
    clearApiKey();
    setSaved(null);
    setDraft('');
    setTestResult(null);
    setTestError(null);
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    setTestError(null);
    try {
      const r = await askGemini('안녕! 오늘 날씨 어때?');
      setTestResult(r);
    } catch (err) {
      if (err instanceof GeminiError) {
        setTestError({ studentMessage: err.studentMessage, technicalDetail: err.technicalDetail });
      } else {
        setTestError({
          studentMessage: '무언가 잘못됐어요.',
          technicalDetail: String(err),
        });
      }
    } finally {
      setTesting(false);
    }
  }

  return (
    <section className="p-6 bg-white rounded-lg border mb-6">
      <h2 className="text-xl font-bold mb-2">Gemini API 키</h2>
      <p className="text-sm text-[color:var(--muted)] mb-4">
        키는 이 브라우저의 localStorage에만 저장돼요. 다른 사람 컴퓨터에서는 사용되지 않아요.
        <br />
        폴백 순서: {MODEL_FALLBACK.join(' → ')}
      </p>

      {saved ? (
        <div className="mb-4 p-3 rounded border-2 border-green-300 bg-green-50">
          <p className="font-semibold text-green-800">✅ 저장된 키: <code>{maskApiKey(saved)}</code></p>
        </div>
      ) : (
        <div className="mb-4 p-3 rounded border-2 border-orange-300 bg-orange-50">
          <p className="font-semibold text-orange-800">아직 저장된 키가 없어요. AI 차시는 준비된 답변으로만 동작합니다.</p>
        </div>
      )}

      <label className="block mb-2 font-semibold">새 키 입력 (또는 교체)</label>
      <input
        type="password"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Gemini API 키 붙여넣기"
        className="w-full p-3 border-2 rounded mb-3 font-mono text-sm"
      />
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSave}
          disabled={draft.trim().length === 0}
          className="px-4 py-2 rounded font-semibold text-white disabled:opacity-40"
          style={{ background: 'var(--accent)' }}
        >저장</button>
        <button
          onClick={handleClear}
          disabled={!saved}
          className="px-4 py-2 rounded border-2 font-semibold text-red-700 border-red-300 disabled:opacity-40"
        >지우기</button>
        <button
          onClick={handleTest}
          disabled={!saved || testing}
          className="ml-auto px-4 py-2 rounded font-semibold border-2 disabled:opacity-40"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
        >{testing ? '호출 중…' : '테스트 호출'}</button>
      </div>

      {testResult && (
        <div className="p-3 rounded border-2 border-green-300 bg-green-50">
          <p className="text-sm text-green-800 mb-1">
            <strong>모델:</strong> {testResult.modelUsed}{!testResult.safe && ' (안전필터에 걸려 대체 답변 표시)'}
          </p>
          <p className="text-base mb-2">{testResult.text}</p>
          <details className="text-xs text-green-800">
            <summary className="cursor-pointer">폴백 시도 로그</summary>
            <pre className="mt-1 whitespace-pre-wrap">{testResult.attemptLog.join('\n')}</pre>
          </details>
        </div>
      )}
      {testError && (
        <ErrorMessage
          studentMessage={testError.studentMessage}
          technicalDetail={testError.technicalDetail}
        />
      )}
    </section>
  );
}
