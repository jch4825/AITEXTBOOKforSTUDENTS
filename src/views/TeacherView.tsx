import { useState, type FormEvent } from 'react';
import { isTeacherSessionActive, tryUnlock, logout } from '../utils/teacherMode';
import { getApiKey, setApiKey, clearApiKey, maskApiKey } from '../utils/apiKey';
import { askGemini, GeminiError, MODEL_FALLBACK } from '../utils/gemini';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { ALL_LESSONS } from '../data/lessons';
import { MODULES, lessonIdsForModule } from '../data/modules';
import { loadProgress } from '../utils/storage';
import GeneralizationRecordsPanel from '../components/mission/GeneralizationRecordsPanel';

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
        <form onSubmit={handleUnlock} className="max-w-sm w-full card border border-[color:var(--border)] p-8">
          <h1 className="text-2xl font-bold mb-4">교사 모드</h1>
          <label className="block mb-2 font-semibold">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-[color:var(--border)] rounded-[var(--r-sm)] mb-4"
            autoFocus
          />
          {error && <p className="text-red-700 mb-3">{error}</p>}
          <Button type="submit" className="w-full">들어가기</Button>
          <Button type="button" variant="ghost" onClick={onExit} className="w-full mt-2">
            학생 화면으로 돌아가기
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">교사 화면</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onExit}>학생 화면으로</Button>
          <button
            onClick={() => { logout(); setActive(false); }}
            className="btn px-4 text-red-700 border-red-300 bg-[color:var(--paper-0)]"
          >로그아웃</button>
        </div>
      </header>

      <ApiKeyPanel />
      <ProgressPanel />
      <GeneralizationRecordsPanel />
      <ObjectivesPanel />
    </main>
  );
}

/** 이 기기(브라우저)의 학생 진도 — localStorage 기반. */
function ProgressPanel() {
  const [progress] = useState(() => loadProgress());
  const completed = new Set(progress.completedLessons);
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessonCount, 0);
  const totalDone = MODULES.reduce(
    (sum, m) => sum + lessonIdsForModule(m.id).filter(id => completed.has(id)).length,
    0,
  );
  const pct = totalLessons === 0 ? 0 : Math.round((totalDone / totalLessons) * 100);

  return (
    <section className="p-6 card border border-[color:var(--border)] mb-6">
      <h2 className="text-xl font-bold mb-2">학생 진도 (이 기기 기준)</h2>
      <p className="text-sm text-[color:var(--muted)] mb-4">
        진도는 이 브라우저의 localStorage에만 저장돼요. 다른 컴퓨터의 진도는 여기 보이지 않아요.
      </p>
      <p className="text-lg font-semibold mb-3">
        전체 {totalDone} / {totalLessons}차시 완료 ({pct}%)
      </p>
      <ul className="space-y-1">
        {MODULES.map(m => {
          const done = lessonIdsForModule(m.id).filter(id => completed.has(id)).length;
          return (
            <li key={m.id} className="flex justify-between border-b py-1 text-sm">
              <span>단원 {m.number}. {m.title}</span>
              <span className="font-mono">{done} / {m.lessonCount}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** 차시별 학습목표·성취기준 열람 — 교사용. 학생 화면에는 노출되지 않는다. */
function ObjectivesPanel() {
  return (
    <section className="p-6 card border border-[color:var(--border)] mb-6">
      <h2 className="text-xl font-bold mb-2">차시별 학습목표 · 성취기준</h2>
      <p className="text-sm text-[color:var(--muted)] mb-4">
        성취기준은 2022 개정 특수교육 기본교육과정 기준이에요. 단원을 눌러 펼쳐보세요.
      </p>
      {MODULES.map(m => {
        const lessons = ALL_LESSONS.filter(l => l.moduleId === m.id);
        return (
          <details key={m.id} className="mb-2 border rounded">
            <summary className="cursor-pointer p-3 font-semibold bg-[color:var(--paper-1)]">
              단원 {m.number}. {m.title} ({lessons.length}/{m.lessonCount}차시 구현)
            </summary>
            <div className="p-3 space-y-3">
              {lessons.map(l => (
                <div key={l.id} className="border-b pb-2">
                  <p className="font-semibold">{l.number}. {l.title}</p>
                  <p className="text-sm">🎯 {l.objective}</p>
                  {l.standards && l.standards.length > 0 && (
                    <ul className="text-xs text-[color:var(--muted)] mt-1 list-disc list-inside">
                      {l.standards.map(s => <li key={s}>{s}</li>)}
                    </ul>
                  )}
                </div>
              ))}
              {lessons.length === 0 && (
                <p className="text-sm text-[color:var(--muted)]">아직 구현된 차시가 없어요.</p>
              )}
            </div>
          </details>
        );
      })}
    </section>
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
    <section className="p-6 card border border-[color:var(--border)] mb-6">
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
        className="w-full p-3 border-2 border-[color:var(--border)] rounded-[var(--r-sm)] mb-3 font-mono text-sm"
      />
      <div className="flex gap-2 mb-4">
        <Button onClick={handleSave} disabled={draft.trim().length === 0}>저장</Button>
        <button
          onClick={handleClear}
          disabled={!saved}
          className="btn px-4 text-red-700 border-red-300 bg-[color:var(--paper-0)]"
        >지우기</button>
        <Button variant="secondary" onClick={handleTest} disabled={!saved || testing} className="ml-auto">
          {testing ? '호출 중…' : '테스트 호출'}
        </Button>
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
