import { useState } from 'react';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import { ALL_LESSONS } from '../../data/lessons';
import { MODULES, lessonIdsForModule } from '../../data/modules';
import { clearApiKey, getApiKey, maskApiKey, setApiKey } from '../../utils/apiKey';
import { askGemini, GeminiError, MODEL_FALLBACK } from '../../utils/gemini';
import { loadProgress } from '../../utils/storage';

export function ProgressPanel() {
  const [progress] = useState(() => loadProgress());
  const completed = new Set(progress.completedLessons);
  const totalLessons = MODULES.reduce((sum, module) => sum + module.lessonCount, 0);
  const totalDone = MODULES.reduce(
    (sum, module) => sum + lessonIdsForModule(module.id).filter((id) => completed.has(id)).length,
    0,
  );
  const pct = totalLessons === 0 ? 0 : Math.round((totalDone / totalLessons) * 100);

  return (
    <section className="card mb-6 border border-[color:var(--border)] p-6">
      <h2 className="mb-2 text-xl font-bold">학생 진도 (이 기기 기준)</h2>
      <p className="mb-4 text-sm text-[color:var(--muted)]">
        진도는 이 브라우저의 localStorage에만 저장돼요. 다른 컴퓨터의 진도는 여기 보이지 않아요.
      </p>
      <p className="mb-3 text-lg font-semibold">전체 {totalDone} / {totalLessons}차시 완료 ({pct}%)</p>
      <ul className="space-y-1">
        {MODULES.map((module) => {
          const done = lessonIdsForModule(module.id).filter((id) => completed.has(id)).length;
          return (
            <li key={module.id} className="flex justify-between border-b py-1 text-sm">
              <span>단원 {module.number}. {module.title}</span>
              <span className="font-mono">{done} / {module.lessonCount}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ObjectivesPanel() {
  return (
    <section className="card mb-6 border border-[color:var(--border)] p-6">
      <h2 className="mb-2 text-xl font-bold">차시별 학습목표 · 성취기준</h2>
      <p className="mb-4 text-sm text-[color:var(--muted)]">
        성취기준은 2022 개정 특수교육 기본교육과정 기준이에요. 단원을 눌러 펼쳐보세요.
      </p>
      {MODULES.map((module) => {
        const lessons = ALL_LESSONS.filter((lesson) => lesson.moduleId === module.id);
        return (
          <details key={module.id} className="mb-2 rounded border">
            <summary className="cursor-pointer bg-[color:var(--paper-1)] p-3 font-semibold">
              단원 {module.number}. {module.title} ({lessons.length}/{module.lessonCount}차시 구현)
            </summary>
            <div className="space-y-3 p-3">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="border-b pb-2">
                  <p className="font-semibold">{lesson.number}. {lesson.title}</p>
                  <p className="text-sm">🎯 {lesson.objective}</p>
                  {lesson.standards && lesson.standards.length > 0 && (
                    <ul className="mt-1 list-inside list-disc text-xs text-[color:var(--muted)]">
                      {lesson.standards.map((standard) => <li key={standard}>{standard}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </details>
        );
      })}
    </section>
  );
}

export function ApiKeyPanel() {
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
      setTestResult(await askGemini('안녕! 오늘 날씨 어때?'));
    } catch (error) {
      if (error instanceof GeminiError) {
        setTestError({ studentMessage: error.studentMessage, technicalDetail: error.technicalDetail });
      } else {
        setTestError({ studentMessage: '무언가 잘못됐어요.', technicalDetail: String(error) });
      }
    } finally {
      setTesting(false);
    }
  }

  return (
    <section className="card mb-6 border border-[color:var(--border)] p-6">
      <h2 className="mb-2 text-xl font-bold">Gemini API 키</h2>
      <p className="mb-4 text-sm text-[color:var(--muted)]">
        키는 이 브라우저의 localStorage에만 저장돼요. 다른 사람 컴퓨터에서는 사용되지 않아요.
        <br />폴백 순서: {MODEL_FALLBACK.join(' → ')}
      </p>
      {saved ? (
        <div className="mb-4 rounded border-2 border-green-300 bg-green-50 p-3">
          <p className="font-semibold text-green-800">저장된 키: <code>{maskApiKey(saved)}</code></p>
        </div>
      ) : (
        <div className="mb-4 rounded border-2 border-orange-300 bg-orange-50 p-3">
          <p className="font-semibold text-orange-800">아직 저장된 키가 없어요. AI 차시는 준비된 답변으로만 동작합니다.</p>
        </div>
      )}
      <label className="mb-2 block font-semibold" htmlFor="teacher-api-key">새 키 입력 (또는 교체)</label>
      <input
        id="teacher-api-key"
        type="password"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Gemini API 키 붙여넣기"
        className="mb-3 w-full rounded-[var(--r-sm)] border-2 border-[color:var(--border)] p-3 font-mono text-sm"
      />
      <div className="mb-4 flex gap-2">
        <Button onClick={handleSave} disabled={draft.trim().length === 0}>저장</Button>
        <button onClick={handleClear} disabled={!saved} className="btn bg-[color:var(--paper-0)] px-4 text-red-700 border-red-300">지우기</button>
        <Button variant="secondary" onClick={handleTest} disabled={!saved || testing} className="ml-auto">
          {testing ? '호출 중…' : '테스트 호출'}
        </Button>
      </div>
      {testResult && (
        <div className="rounded border-2 border-green-300 bg-green-50 p-3">
          <p className="mb-1 text-sm text-green-800"><strong>모델:</strong> {testResult.modelUsed}{!testResult.safe && ' (안전필터 대체 답변)'}</p>
          <p className="mb-2 text-base">{testResult.text}</p>
          <details className="text-xs text-green-800"><summary className="cursor-pointer">폴백 시도 로그</summary><pre className="mt-1 whitespace-pre-wrap">{testResult.attemptLog.join('\n')}</pre></details>
        </div>
      )}
      {testError && <ErrorMessage studentMessage={testError.studentMessage} technicalDetail={testError.technicalDetail} />}
    </section>
  );
}
