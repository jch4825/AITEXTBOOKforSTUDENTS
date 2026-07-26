import { useState } from 'react';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import { ALL_LESSONS } from '../../data/lessons';
import { MODULES, lessonIdsForModule } from '../../data/modules';
import { AI_ACHIEVEMENT_STANDARDS } from '../../data/aiAchievementStandards';
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
    <section className="studio-editorial p-6 md:p-8 space-y-5">
      <div>
        <p className="studio-kicker text-[color:var(--accent)] font-bold">2022 개정 특수교육 기본교육과정 연동</p>
        <h2 className="text-2xl font-extrabold text-[color:var(--brand-ink)]">차시별 정식 학습목표 · 성취기준</h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          2022 개정 특수교육 기본교육과정 인공지능(인지) 정식 성취기준 및 연계 성취기준 명세입니다.
        </p>
      </div>

      {MODULES.map((module) => {
        const lessons = ALL_LESSONS.filter((lesson) => lesson.moduleId === module.id);
        const aiMeta = AI_ACHIEVEMENT_STANDARDS[module.id];

        return (
          <details key={module.id} className="group border-2 border-[color:var(--line)] rounded-2xl bg-[color:var(--paper-0)] overflow-hidden shadow-xs mb-3">
            <summary className="cursor-pointer bg-[color:var(--paper-1)] p-4 font-extrabold text-base flex items-center justify-between hover:bg-slate-100 transition">
              <span className="text-[color:var(--brand-ink)]">단원 {module.number}. {module.title} ({aiMeta.domainName})</span>
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-extrabold">
                {lessons.length}개 차시 완성
              </span>
            </summary>
            <div className="divide-y divide-slate-200 p-4 space-y-4">
              {/* Module Level AI Achievement Standards Summary */}
              {aiMeta && (
                <div className="p-3.5 rounded-xl bg-indigo-950 text-white space-y-2 mb-2">
                  <div className="flex items-center justify-between border-b border-indigo-800 pb-2">
                    <p className="font-extrabold text-amber-300 text-sm">
                      🤖 영역 {aiMeta.domainNumber}. {aiMeta.domainName} 정식 AI 성취기준
                    </p>
                    <a
                      href="/data/achievement_standards.csv"
                      download="특수교육_인공지능_성취기준.csv"
                      className="text-[11px] font-bold px-2.5 py-1 rounded bg-indigo-800 hover:bg-indigo-700 text-indigo-100 transition flex items-center gap-1"
                    >
                      📥 CSV 내보내기
                    </a>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 text-xs">
                    <div className="bg-indigo-900/60 p-2.5 rounded-lg border border-indigo-700/60">
                      <p className="font-bold text-sky-300 mb-1">🏫 중학교 성취기준 (9학년군)</p>
                      <ul className="space-y-1 text-slate-200 leading-snug">
                        {aiMeta.middleSchool.map((s) => (
                          <li key={s.code}>
                            <strong className="text-amber-300 mr-1">{s.code}</strong> {s.statement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-indigo-900/60 p-2.5 rounded-lg border border-indigo-700/60">
                      <p className="font-bold text-emerald-300 mb-1">🏫 고등학교 성취기준 (12학년군)</p>
                      <ul className="space-y-1 text-slate-200 leading-snug">
                        {aiMeta.highSchool.map((s) => (
                          <li key={s.code}>
                            <strong className="text-amber-300 mr-1">{s.code}</strong> {s.statement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Detail Cards */}
              {lessons.map((lesson) => (
                <div key={lesson.id} className="pt-4 first:pt-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded bg-slate-800 text-white">
                      {lesson.number}차시
                    </span>
                    <strong className="text-base font-extrabold text-[color:var(--brand-ink)]">
                      {lesson.title}
                    </strong>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-400/50 rounded-xl p-3 my-2 text-sm text-slate-800 space-y-1">
                    <p className="font-extrabold text-amber-900 flex items-center gap-1.5">
                      <span>🎯</span> <span>공통 학습 목표:</span>
                    </p>
                    <p className="font-bold text-slate-900 leading-relaxed pl-5">
                      {lesson.objective}
                    </p>
                  </div>

                  {(lesson.wrapUpNormal || lesson.wrapUpEasy) && (
                    <div className="text-xs text-slate-700 font-semibold pl-1 mb-2">
                      💡 <strong>차시 핵심 정리 (보통 지원):</strong> {lesson.wrapUpNormal || lesson.wrapUpEasy}
                    </div>
                  )}

                  {lesson.standards && lesson.standards.length > 0 && (
                    <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                      <p className="font-extrabold text-slate-700 mb-1">📋 연계 성취기준:</p>
                      <ul className="list-inside list-disc space-y-1 text-slate-800 font-medium">
                        {lesson.standards.map((standard) => (
                          <li key={standard}>{standard}</li>
                        ))}
                      </ul>
                    </div>
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
