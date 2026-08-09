import { useMemo, useState } from 'react';
import {
  getFilteredLinkedStandards,
  LINKED_STANDARD_SUBJECTS,
  type LinkedStandard,
  type LinkedStandardAlignment,
} from '../../data/linkedStandards';
import { ALL_LESSONS } from '../../data/lessons';
import { MODULES } from '../../data/modules';
import type { ModuleId } from '../../types';

const ALIGNMENT_LABELS: Record<LinkedStandardAlignment, { label: string; className: string; explanation: string }> = {
  direct: {
    label: '직접 연계',
    className: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    explanation: '현재 차시에서 성취기준의 핵심 수행을 직접 관찰할 수 있습니다.',
  },
  supporting: {
    label: '보조 연계',
    className: 'bg-sky-100 text-sky-900 border-sky-300',
    explanation: '관련 기능을 연습하지만 이 앱 활동만으로 기준 달성을 판단하지 않습니다.',
  },
  deferred: {
    label: '연계 보류',
    className: 'bg-slate-100 text-slate-700 border-slate-300',
    explanation: '현재 수업에 필요한 수행이 없어 연계 실적으로 기록하지 않습니다.',
  },
};

const LESSON_TITLE_BY_ID = new Map(ALL_LESSONS.map((lesson) => [lesson.id, `${lesson.number}차시 ${lesson.title}`]));

function groupBySubject(standards: LinkedStandard[]): Array<{ subject: string; standards: LinkedStandard[] }> {
  const groups = new Map<string, LinkedStandard[]>();
  for (const standard of standards) {
    const current = groups.get(standard.subject) ?? [];
    current.push(standard);
    groups.set(standard.subject, current);
  }
  return [...groups].map(([subject, subjectStandards]) => ({ subject, standards: subjectStandards }));
}

export default function LinkedStandardsGuide() {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedModule, setSelectedModule] = useState<'all' | ModuleId>('all');
  const [selectedAlignment, setSelectedAlignment] = useState<'all' | LinkedStandardAlignment>('all');

  const filteredStandards = useMemo(() => getFilteredLinkedStandards({
    subjectCode: selectedSubject === 'all' ? undefined : selectedSubject,
    moduleId: selectedModule === 'all' ? undefined : selectedModule,
    alignment: selectedAlignment === 'all' ? undefined : selectedAlignment,
  }), [selectedAlignment, selectedModule, selectedSubject]);
  const groupedStandards = groupBySubject(filteredStandards);
  const totals = getFilteredLinkedStandards().reduce<Record<LinkedStandardAlignment, number>>((counts, standard) => {
    counts[standard.alignment] += 1;
    return counts;
  }, { direct: 0, supporting: 0, deferred: 0 });

  return (
    <div className="space-y-6 text-slate-800">
      <section className="rounded-2xl border border-indigo-800/60 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-6 text-white depth-overlay md:p-8">
        <span className="inline-block rounded-full bg-sky-400 px-3 py-1 text-xs font-black text-slate-950">
          2022 개정 특수교육 기본 교육과정 타 교과
        </span>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-amber-300 sm:text-3xl">근거가 보이는 교과 연계 검토표</h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-200">
          성취기준 코드와 문장은 국가 교육과정 원문을 따릅니다. 다만 어느 차시에 연결할지는 학교의 수업 설계 판단이므로,
          모듈 전체를 한꺼번에 연결하지 않고 실제 학생 활동이 확인되는 차시와 근거만 표시했습니다.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {(Object.keys(ALIGNMENT_LABELS) as LinkedStandardAlignment[]).map((alignment) => (
            <button
              key={alignment}
              type="button"
              onClick={() => setSelectedAlignment(selectedAlignment === alignment ? 'all' : alignment)}
              aria-pressed={selectedAlignment === alignment}
              className={`rounded-xl border p-3 text-left transition ${selectedAlignment === alignment ? 'border-amber-300 bg-white/15' : 'border-indigo-700 bg-indigo-900/50 hover:bg-indigo-900'}`}
            >
              <strong className="text-lg text-white">{totals[alignment]}개 · {ALIGNMENT_LABELS[alignment].label}</strong>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">{ALIGNMENT_LABELS[alignment].explanation}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 depth-paper">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
          <label className="text-xs font-extrabold text-slate-700">
            교과
            <select value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)} className="mt-1 block w-full rounded-lg border-2 border-slate-300 bg-white p-2.5 text-sm font-semibold">
              <option value="all">전체 교과</option>
              {LINKED_STANDARD_SUBJECTS.map((subject) => <option key={subject.subjectCode} value={subject.subjectCode}>{subject.subject}</option>)}
            </select>
          </label>
          <label className="text-xs font-extrabold text-slate-700">
            단원
            <select value={selectedModule} onChange={(event) => setSelectedModule(event.target.value as 'all' | ModuleId)} className="mt-1 block w-full rounded-lg border-2 border-slate-300 bg-white p-2.5 text-sm font-semibold">
              <option value="all">전체 단원</option>
              {MODULES.map((module) => <option key={module.id} value={module.id}>{module.number}단원 · {module.title}</option>)}
            </select>
          </label>
          <button
            type="button"
            onClick={() => { setSelectedSubject('all'); setSelectedModule('all'); setSelectedAlignment('all'); }}
            className="self-end rounded-lg border-2 border-slate-300 px-4 py-2.5 text-sm font-bold hover:bg-slate-50"
          >
            필터 초기화
          </button>
        </div>
      </section>

      {groupedStandards.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="font-extrabold">이 조건에 해당하는 연계가 없습니다.</h2>
          <p className="mt-1 text-sm text-slate-600">연계가 없는 것은 오류가 아니라, 근거 없는 연결을 표시하지 않은 결과입니다.</p>
        </section>
      ) : groupedStandards.map((group) => {
        const first = group.standards[0];
        return (
          <section key={group.subject} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 depth-paper md:p-7">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md border px-2.5 py-1 text-xs font-black ${first.badgeColor}`}>{group.subject}</span>
                <h2 className="text-xl font-extrabold text-slate-900">{group.subject} 성취기준</h2>
              </div>
              <p className="mt-2 text-sm text-slate-600">{first.subjectDescription}</p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {group.standards.map((standard) => {
                const alignment = ALIGNMENT_LABELS[standard.alignment];
                return (
                  <article key={standard.code} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 depth-paper">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <code className="rounded bg-slate-900 px-2.5 py-1 text-xs font-black text-amber-300">{standard.code}</code>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${alignment.className}`}>{alignment.label}</span>
                    </div>
                    <p className="mt-3 text-sm font-extrabold leading-relaxed text-slate-900">{standard.statement}</p>

                    {standard.alignment === 'deferred' ? (
                      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                        <strong>보류 이유</strong>
                        <p className="mt-1">{standard.deferredReason}</p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-extrabold text-indigo-900">정확한 연계 차시와 수업 근거</p>
                        {standard.lessonLinks.map((link) => (
                          <div key={link.lessonId} className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                            <p className="text-xs font-black text-indigo-950">{link.lessonId} · {LESSON_TITLE_BY_ID.get(link.lessonId) ?? '차시 제목 확인 필요'}</p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-700">{link.evidence}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-700">
                      <strong>수업 적용 원칙</strong>
                      <p className="mt-1">{standard.guidanceNote}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
