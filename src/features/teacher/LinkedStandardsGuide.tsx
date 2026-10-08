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
    explanation: '이 차시에서 성취기준의 핵심 수행을 직접 볼 수 있습니다.',
  },
  supporting: {
    label: '보조 연계',
    className: 'bg-sky-100 text-sky-900 border-sky-300',
    explanation: '관련 기능을 연습하기는 하지만, 이 앱 활동만으로 도달 여부를 판단하지는 않습니다.',
  },
  deferred: {
    label: '연계 보류',
    className: 'bg-slate-100 text-slate-700 border-slate-300',
    explanation: '이 수업에는 해당 수행이 없어 연계 실적으로 적지 않습니다.',
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

  // 짙은 남색 배너와 슬레이트·인디고 색 카드 더미를 종이 면 하나로 맞췄다. 연계 종류 세 가지는 곧 필터라
  // 선택 카드로 두고(누르면 그 종류만), 성취기준 카드는 칸 폭에 맞춰 두세 열로 놓는다.
  return (
    <div className="hub-stack">
      <section className="studio-editorial p-6 md:p-8" aria-labelledby="linked-title">
        <span className="hub-chip">2022 개정 특수교육 기본 교육과정 타 교과</span>
        <h3 id="linked-title" className="mt-3 text-2xl font-extrabold">근거가 보이는 교과 연계 검토표</h3>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-[color:var(--muted)]">
          성취기준 코드와 문장은 국가 교육과정 원문을 따릅니다. 다만 어느 차시에 연결할지는 학교의 수업 설계 판단이므로,
          모듈 전체를 한꺼번에 연결하지 않고 실제 학생 활동이 확인되는 차시와 근거만 표시했습니다.
        </p>
        <div className="hub-grid hub-grid--stats mt-5">
          {(Object.keys(ALIGNMENT_LABELS) as LinkedStandardAlignment[]).map((alignment) => (
            <button
              key={alignment}
              type="button"
              onClick={() => setSelectedAlignment(selectedAlignment === alignment ? 'all' : alignment)}
              aria-pressed={selectedAlignment === alignment}
              className="hub-stat"
            >
              <strong className="text-lg">{totals[alignment]}개 · {ALIGNMENT_LABELS[alignment].label}</strong>
              <span className="mt-1 block text-sm leading-relaxed text-[color:var(--muted)]">{ALIGNMENT_LABELS[alignment].explanation}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="studio-editorial p-5 md:p-6" aria-label="연계 성취기준 필터">
        <div className="hub-filter-row">
          <label className="text-sm font-extrabold">
            교과
            <select value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)} className="mt-1 block w-full rounded-lg border-2 border-[color:var(--line)] bg-white p-2.5 text-sm font-semibold">
              <option value="all">전체 교과</option>
              {LINKED_STANDARD_SUBJECTS.map((subject) => <option key={subject.subjectCode} value={subject.subjectCode}>{subject.subject}</option>)}
            </select>
          </label>
          <label className="text-sm font-extrabold">
            단원
            <select value={selectedModule} onChange={(event) => setSelectedModule(event.target.value as 'all' | ModuleId)} className="mt-1 block w-full rounded-lg border-2 border-[color:var(--line)] bg-white p-2.5 text-sm font-semibold">
              <option value="all">전체 단원</option>
              {MODULES.map((module) => <option key={module.id} value={module.id}>{module.number}단원 · {module.title}</option>)}
            </select>
          </label>
          <button
            type="button"
            onClick={() => { setSelectedSubject('all'); setSelectedModule('all'); setSelectedAlignment('all'); }}
            className="btn btn-secondary"
          >
            필터 초기화
          </button>
        </div>
      </section>

      {groupedStandards.length === 0 ? (
        <section className="studio-editorial p-8 text-center">
          <h3 className="font-extrabold">이 조건에 해당하는 연계가 없습니다.</h3>
          <p className="mt-1 text-sm text-[color:var(--muted)]">연계가 없는 것은 오류가 아니라, 근거 없는 연결을 표시하지 않은 결과입니다.</p>
        </section>
      ) : groupedStandards.map((group) => {
        const first = group.standards[0];
        return (
          <section key={group.subject} className="studio-editorial p-6 md:p-8">
            <div className="border-b border-[color:var(--editorial-line)] pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md border px-2.5 py-1 text-xs font-black ${first.badgeColor}`}>{group.subject}</span>
                <h3 className="text-xl font-extrabold">{group.subject} 성취기준</h3>
              </div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{first.subjectDescription}</p>
            </div>

            <div className="hub-grid hub-grid--standards mt-5">
              {group.standards.map((standard) => {
                const alignment = ALIGNMENT_LABELS[standard.alignment];
                return (
                  <article key={standard.code} className="studio-fact-card hub-standard">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <code className="hub-code">{standard.code}</code>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${alignment.className}`}>{alignment.label}</span>
                    </div>
                    <p className="mt-3 text-sm font-extrabold leading-relaxed">{standard.statement}</p>

                    {standard.alignment === 'deferred' ? (
                      <div className="hub-link-box mt-4 text-xs leading-relaxed">
                        <strong>보류 이유</strong>
                        <p className="mt-1">{standard.deferredReason}</p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-extrabold text-[color:var(--brand-ink)]">정확한 연계 차시와 수업 근거</p>
                        {standard.lessonLinks.map((link) => (
                          <div key={link.lessonId} className="hub-link-box">
                            <p className="text-xs font-black text-[color:var(--brand-ink)]">{link.lessonId} · {LESSON_TITLE_BY_ID.get(link.lessonId) ?? '차시 제목 확인 필요'}</p>
                            <p className="mt-1 text-xs leading-relaxed">{link.evidence}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto border-t border-[color:var(--editorial-line)] pt-3 text-xs leading-relaxed">
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
