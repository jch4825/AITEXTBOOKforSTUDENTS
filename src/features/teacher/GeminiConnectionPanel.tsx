import { useState } from 'react';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import { clearApiKey, getApiKey, maskApiKey, setApiKey } from '../../utils/apiKey';
import { askGemini, GeminiError, MODEL_FALLBACK } from '../../utils/gemini';
import { publicAssetUrl } from '../../utils/publicAssetUrl';

const VIDEO_GUIDE_URL = 'https://www.youtube.com/watch?v=EaKwM8-2JH0';
const GOOGLE_AI_STUDIO_KEY_URL = 'https://aistudio.google.com/app/apikey';
const GEMINI_PRICING_URL = 'https://ai.google.dev/gemini-api/docs/pricing';

export default function GeminiConnectionPanel() {
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
      setTestResult(await askGemini('AI가 할 수 있는 일을 학생에게 한 문장으로 설명해 주세요.'));
    } catch (error) {
      if (error instanceof GeminiError) {
        setTestError({ studentMessage: error.studentMessage, technicalDetail: error.technicalDetail });
      } else {
        setTestError({ studentMessage: '연결을 확인하지 못했습니다.', technicalDetail: String(error) });
      }
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="card border border-[color:var(--border)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">이 브라우저에 API 키 연결</h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">키는 이 브라우저의 localStorage에만 저장되며 앱 소스나 학생 기록에는 들어가지 않습니다.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${saved ? 'bg-emerald-100 text-emerald-900' : 'bg-orange-100 text-orange-900'}`}>
            {saved ? '연결 설정됨' : '준비 답변 모드'}
          </span>
        </div>

        {saved ? (
          <div className="mt-4 rounded-xl border-2 border-green-300 bg-green-50 p-3">
            <p className="font-semibold text-green-800">저장된 키: <code>{maskApiKey(saved)}</code></p>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border-2 border-orange-300 bg-orange-50 p-3">
            <p className="font-semibold text-orange-900">아직 키가 없습니다. 학생 수업은 검수된 준비 답변으로 안전하게 동작합니다.</p>
          </div>
        )}

        <label className="mb-2 mt-5 block font-semibold" htmlFor="teacher-api-key">새 키 입력 또는 교체</label>
        <input
          id="teacher-api-key"
          type="password"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="Gemini API 키 붙여넣기"
          className="mb-3 w-full rounded-[var(--r-sm)] border-2 border-[color:var(--border)] p-3 font-mono text-sm"
        />
        <div className="mb-4 flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={draft.trim().length === 0}>저장</Button>
          <button onClick={handleClear} disabled={!saved} className="btn border-red-300 bg-[color:var(--paper-0)] px-4 text-red-700">지우기</button>
          <Button variant="secondary" onClick={handleTest} disabled={!saved || testing} className="sm:ml-auto">
            {testing ? '호출 중…' : '테스트 호출'}
          </Button>
        </div>
        <p className="text-xs text-slate-500">현재 앱의 모델 폴백 순서: {MODEL_FALLBACK.join(' → ')}</p>

        {testResult && (
          <div className="mt-4 rounded-xl border-2 border-green-300 bg-green-50 p-3">
            <p className="mb-1 text-sm text-green-800"><strong>연결 성공 · 모델:</strong> {testResult.modelUsed}{!testResult.safe && ' (안전필터 대체 답변)'}</p>
            <p className="mb-2 text-base">{testResult.text}</p>
            <details className="text-xs text-green-800"><summary className="cursor-pointer">폴백 시도 로그</summary><pre className="mt-1 whitespace-pre-wrap">{testResult.attemptLog.join('\n')}</pre></details>
          </div>
        )}
        {testError && <div className="mt-4"><ErrorMessage studentMessage={testError.studentMessage} technicalDetail={testError.technicalDetail} /></div>}
      </section>

      <section className="overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-indigo-950 to-violet-900 p-6 text-white md:p-8">
          <p className="text-xs font-extrabold text-amber-300">선택 연결 · 교사만 설정</p>
          <h2 className="mt-1 text-2xl font-black">Gemini를 연결하면 실시간 AI 활동이 열립니다</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-indigo-100">
            연결하지 않아도 62개 스튜디오는 준비된 AI 예시로 끝까지 수업할 수 있습니다. 키를 연결하면 각 스튜디오의
            ‘나의 판단’ 화면 아래에 질문·음성·사진을 활용하는 실시간 Gemini 영역이 추가됩니다.
          </p>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2 md:p-7">
          <figure className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <figcaption className="border-b border-slate-200 p-3">
              <strong className="text-sm text-slate-900">연결 전</strong>
              <p className="mt-1 text-xs text-slate-600">검수된 준비 답변을 보고 학생이 사용·수정·거절을 판단합니다.</p>
            </figcaption>
            <img src={publicAssetUrl('/images/teacher/gemini-before-connection.png')} alt="Gemini 연결 전, 준비된 AI 의견을 판단하는 학생 화면" className="h-auto w-full bg-white" />
          </figure>
          <figure className="overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50">
            <figcaption className="border-b border-emerald-200 p-3">
              <strong className="text-sm text-emerald-950">연결 후</strong>
              <p className="mt-1 text-xs text-emerald-900">기존 판단 활동은 유지되고 실시간 질문·말하기·사진 첨부가 더해집니다.</p>
            </figcaption>
            <img src={publicAssetUrl('/images/teacher/gemini-after-connection.png')} alt="Gemini 연결 후, 실시간 질문과 응답 기능이 추가된 학생 화면" className="h-auto w-full bg-white" />
          </figure>
        </div>
      </section>

      <section className="studio-editorial p-6 md:p-8">
        <h2 className="text-xl font-extrabold text-slate-950">무료 한도 안에서 시작할 수 있어요</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Google은 일부 Gemini API 모델에 무료 사용 한도를 제공합니다. 따라서 결제 없이도 지원되는 모델과 계정별 한도 안에서
          이 앱의 실시간 AI를 사용할 수 있습니다. 무료 한도·지원 모델·지역 정책은 바뀔 수 있으며, 무제한 무료 서비스는 아닙니다.
        </p>
        <a href={GEMINI_PRICING_URL} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-lg border-2 border-indigo-300 bg-white px-4 py-2 text-sm font-extrabold text-indigo-900 hover:bg-indigo-50">
          Google 공식 요금·무료 한도 확인
        </a>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-950 font-black text-white">1</span>
            <h3 className="mt-3 font-extrabold">영상으로 순서 보기</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">키를 발급받고 이 앱에 붙여넣는 순서를 먼저 확인합니다.</p>
            <a href={VIDEO_GUIDE_URL} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-extrabold text-indigo-800 underline underline-offset-4">Gemini API 키 받기 영상</a>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-950 font-black text-white">2</span>
            <h3 className="mt-3 font-extrabold">Google AI Studio에서 키 만들기</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">Google 계정으로 로그인한 뒤 ‘API 키 만들기’를 선택하고 발급된 키를 복사합니다.</p>
            <a href={GOOGLE_AI_STUDIO_KEY_URL} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-extrabold text-indigo-800 underline underline-offset-4">Google AI Studio 열기</a>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-950 font-black text-white">3</span>
            <h3 className="mt-3 font-extrabold">맨 위 연결 박스에 붙여넣기</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">맨 위 입력란에 키를 붙여넣고 저장한 뒤 ‘테스트 호출’을 눌러 실제 응답이 오는지 확인합니다.</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-5 text-rose-950">
        <h2 className="font-extrabold">학생 개인정보는 Gemini에 보내지 마세요</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
          <li>실시간 질문과 첨부한 사진은 답변 생성을 위해 Google 서버로 전송됩니다.</li>
          <li>학생 이름·얼굴·학교명·연락처·건강 정보가 든 문장이나 사진은 입력하지 않습니다.</li>
          <li>Google의 무료 등급 데이터는 제품 개선에 사용될 수 있으므로 수업용 비식별 예시만 사용합니다.</li>
          <li>API 키는 비밀번호처럼 관리하고, 공유 PC 수업이 끝나면 이 화면의 ‘지우기’를 누릅니다.</li>
        </ul>
      </section>
    </div>
  );
}
