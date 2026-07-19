import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { getStudioDefinition } from '../../data/studios';
import { SUPPORT_LABELS } from '../studio/supportLevel';
import {
  deleteStudioEvidence,
  loadStudioEvidence,
  STUDIO_EVIDENCE_CHANGED,
  updateStudioObservation,
} from '../studio/evidenceStorage';
import { isMeaningfulStudioExpression } from '../studio/studioCompletion';
import type { ObservationLevel, StudioChoice, StudioEvidenceV2, StudioExpression, StudioObservation } from '../studio/types';

interface Props {
  mode: 'teacher' | 'portfolio';
}

const OBSERVATION_LABELS: Record<ObservationLevel, string> = {
  'not-observed': '관찰하지 못함',
  'with-support': '지원을 받아 수행',
  independent: '스스로 수행',
};

const OBSERVATION_FIELDS: Array<{ key: keyof Omit<StudioObservation, 'note'>; label: string }> = [
  { key: 'importantInformation', label: '중요한 정보 찾기' },
  { key: 'firstAttempt', label: '스스로 시도하기' },
  { key: 'aiComparison', label: 'AI 의견 비교하기' },
  { key: 'conditionAdjustment', label: '조건에 맞게 조정하기' },
];

const DECISION_LABELS = {
  accept: '받아들임',
  modify: '수정함',
  reject: '사용하지 않음',
} as const;

function expressionText(expression: StudioExpression | undefined, choices: StudioChoice[] | undefined): string {
  if (!expression) return '기록 없음';
  if (!isMeaningfulStudioExpression(expression)) return '기록 없음';
  if (expression.mode === 'choice' || expression.mode === 'aac') {
    const labels = expression.choiceIds
      ?.map((id) => choices?.find((choice) => choice.id === id)?.label)
      .filter((label): label is string => Boolean(label));
    return labels?.join(' / ') || '카드로 표현함';
  }
  if (expression.mode === 'draw') return '그림으로 표현함';
  return expression.text || '말이나 글로 표현함';
}

function observationSummary(observation: StudioObservation): string {
  const independent = OBSERVATION_FIELDS.filter(({ key }) => observation[key] === 'independent').length;
  const supported = OBSERVATION_FIELDS.filter(({ key }) => observation[key] === 'with-support').length;
  return `스스로 수행 ${independent}개 · 지원을 받아 수행 ${supported}개`;
}

function ObservationEditor({ record }: { record: StudioEvidenceV2 }) {
  const [draft, setDraft] = useState(record.observation);
  const [saved, setSaved] = useState(false);

  function updateLevel(key: keyof Omit<StudioObservation, 'note'>, value: ObservationLevel) {
    setSaved(false);
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function save() {
    setSaved(updateStudioObservation(record.id, draft));
  }

  return (
    <section className="mt-5 border-t border-[color:var(--editorial-line)] pt-4">
      <h4 className="font-extrabold">교사 관찰기록</h4>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {OBSERVATION_FIELDS.map(({ key, label }) => (
          <label key={key} className="text-sm font-bold">
            {label}
            <select
              value={draft[key]}
              onChange={(event) => updateLevel(key, event.target.value as ObservationLevel)}
              className="mt-1 min-h-11 w-full rounded-lg border px-3 font-normal"
            >
              {(Object.keys(OBSERVATION_LABELS) as ObservationLevel[]).map((value) => (
                <option key={value} value={value}>{OBSERVATION_LABELS[value]}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <label className="mt-3 block text-sm font-bold">
        관찰 메모
        <textarea
          value={draft.note}
          onChange={(event) => { setSaved(false); setDraft((current) => ({ ...current, note: event.target.value.slice(0, 300) })); }}
          maxLength={300}
          rows={3}
          className="mt-1 w-full rounded-lg border p-3 font-normal"
        />
      </label>
      <div className="mt-3 flex items-center gap-3">
        <Button onClick={save}>관찰기록 저장</Button>
        {saved && <span className="text-sm font-bold text-green-700">저장했습니다.</span>}
      </div>
    </section>
  );
}

export default function StudioEvidencePanel({ mode }: Props) {
  const [records, setRecords] = useState<StudioEvidenceV2[]>(() => loadStudioEvidence());

  useEffect(() => {
    const refresh = () => setRecords(loadStudioEvidence());
    window.addEventListener(STUDIO_EVIDENCE_CHANGED, refresh);
    return () => window.removeEventListener(STUDIO_EVIDENCE_CHANGED, refresh);
  }, []);

  const ordered = [...records].sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  if (records.length === 0) {
    return (
      <section className="studio-editorial p-6">
        <h2 className="text-xl font-extrabold">{mode === 'teacher' ? '학생 과정기록' : '핵심 경험 포트폴리오'}</h2>
        <p className="studio-margin-note mt-4">이 브라우저에는 저장된 과정기록이 없습니다. 기록 기능을 사용하지 않아도 학습 활동은 정상적으로 진행됩니다.</p>
      </section>
    );
  }

  return (
    <section className="studio-editorial p-6 print:shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold">{mode === 'teacher' ? '학생 과정기록' : '핵심 경험 포트폴리오'}</h2>
          <p className="mt-1 text-sm text-[color:var(--muted)]">한 브라우저를 여러 학생이 함께 쓰면 별칭별 기록이 섞일 수 있으므로 수업 전에 별칭을 확인하세요.</p>
        </div>
        {mode === 'portfolio' && <Button variant="secondary" onClick={() => window.print()} className="teacher-hub-chrome">포트폴리오 인쇄·PDF</Button>}
      </div>

      {mode === 'teacher' && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead><tr>{['학생·경험', '첫 생각', 'AI와 비교', '최종 판단', '새 상황에 적용'].map((label) => <th key={label} className="border p-2 text-left">{label}</th>)}</tr></thead>
            <tbody>
              {ordered.map((record) => {
                const definition = getStudioDefinition(record.lessonId);
                return (
                  <tr key={record.id}>
                    <td className="border p-2 font-bold">{record.learnerAlias}<br />{definition?.title ?? record.lessonId}</td>
                    <td className="border p-2">{expressionText(record.firstAttempt, definition?.firstAttempt.choices)}</td>
                    <td className="border p-2">{record.aiDecision ? DECISION_LABELS[record.aiDecision] : '기록 없음'}</td>
                    <td className="border p-2">{expressionText(record.finalExpression, definition?.firstAttempt.choices)}</td>
                    <td className="border p-2">{expressionText(record.transferExpression, definition?.transfer.choices)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 space-y-5">
        {ordered.map((record) => {
          const definition = getStudioDefinition(record.lessonId);
          const first = expressionText(record.firstAttempt, definition?.firstAttempt.choices);
          const final = expressionText(record.finalExpression, definition?.firstAttempt.choices);
          const transfer = expressionText(record.transferExpression, definition?.transfer.choices);
          return (
            <article key={record.id} className="studio-artifact-sheet break-inside-avoid">
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="studio-kicker text-[color:var(--accent)]">{record.learnerAlias}</p>
                  <h3 className="text-lg font-extrabold">{definition?.title ?? record.lessonId}</h3>
                  <p className="text-sm text-[color:var(--muted)]">{new Date(record.completedAt).toLocaleString('ko-KR')} · {SUPPORT_LABELS[record.supportLevel]}</p>
                </div>
                {mode === 'teacher' && (
                  <button
                    type="button"
                    onClick={() => { if (window.confirm('이 과정기록 한 건을 삭제할까요?')) deleteStudioEvidence(record.id); }}
                    className="rounded-full border border-red-300 px-3 py-1 text-sm font-bold text-red-700"
                  >
                    이 기록 삭제
                  </button>
                )}
              </header>

              {mode === 'portfolio' ? (
                <dl className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="studio-fact-card"><dt className="font-bold">처음에는</dt><dd>{first}</dd></div>
                  <div className="studio-fact-card"><dt className="font-bold">AI는</dt><dd>{definition?.aiContribution.text ?? record.aiRole}</dd></div>
                  <div className="studio-fact-card"><dt className="font-bold">나는 이렇게 판단</dt><dd>{final}</dd></div>
                  <div className="studio-fact-card"><dt className="font-bold">다른 상황에서는</dt><dd>{transfer}</dd></div>
                </dl>
              ) : (
                <>
                  <dl className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="studio-fact-card"><dt className="font-bold">첫 생각</dt><dd>{first}</dd></div>
                    <div className="studio-fact-card"><dt className="font-bold">AI와 비교</dt><dd>{record.aiSource === 'prepared' ? '준비된 AI 예시' : '실제 AI'} · {record.aiDecision ? DECISION_LABELS[record.aiDecision] : '기록 없음'}</dd></div>
                    <div className="studio-fact-card"><dt className="font-bold">최종 판단</dt><dd>{final}</dd></div>
                    <div className="studio-fact-card"><dt className="font-bold">새 상황에 적용</dt><dd>{transfer}</dd></div>
                    <div className="studio-fact-card"><dt className="font-bold">사용한 지원</dt><dd>{record.supportModesUsed.join(', ') || '추가 지원 기록 없음'}</dd></div>
                    <div className="studio-fact-card"><dt className="font-bold">관찰 요약</dt><dd>{observationSummary(record.observation)}</dd></div>
                  </dl>
                  <ObservationEditor record={record} />
                </>
              )}
              {record.artifactSummary?.trim() && (
                <dl className="mt-3">
                  <div className="studio-fact-card">
                    <dt className="font-bold">결과물</dt>
                    <dd>{record.artifactSummary}</dd>
                  </div>
                </dl>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
