import { useState } from 'react';
import { MODULES, lessonIdsForModule } from '../../data/modules';
import { AI_ACHIEVEMENT_STANDARDS } from '../../data/aiAchievementStandards';
import { loadProgress } from '../../utils/storage';
import { countAlignedStudioObjectives, getTeacherLessonAlignmentRows } from './lessonAlignment';

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
  const alignmentRows = getTeacherLessonAlignmentRows();

  return (
    <section className="studio-editorial p-6 md:p-8 space-y-5">
      <div>
        <p className="studio-kicker font-bold text-[color:var(--accent)]">거제애광학교 학교 자율 교과</p>
        <h2 className="text-2xl font-extrabold text-[color:var(--brand-ink)]">실제 수업과 맞춘 차시별 지도·평가 기준</h2>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
          아래 인공지능 성취기준은 2022 국가 교육과정에 실린 기준이 아니라 거제애광학교가 만든 학교 자체 기준입니다.
          {` `}학생 화면과 같은 데이터에서 시나리오와 AI 역할, 산출물, 전이 활동을 불러오므로 수업 설명이 서로 어긋나지 않습니다.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3"><strong className="text-lg">68</strong><p className="text-xs text-slate-600">전체 차시</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-3"><strong className="text-lg">{countAlignedStudioObjectives()}</strong><p className="text-xs text-slate-600">실제 스튜디오·목표 일치</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-3"><strong className="text-lg">6</strong><p className="text-xs text-slate-600">성장 포트폴리오</p></div>
        </div>
      </div>

      {MODULES.map((module) => {
        const lessons = alignmentRows.filter((lesson) => lesson.moduleId === module.id);
        const aiMeta = AI_ACHIEVEMENT_STANDARDS[module.id];

        return (
          <details key={module.id} className="group border-2 border-[color:var(--line)] rounded-2xl bg-[color:var(--paper-0)] overflow-hidden depth-paper mb-3">
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
                  <div className="border-b border-indigo-800 pb-2">
                    <p className="font-extrabold text-amber-300 text-sm">
                      영역 {aiMeta.domainNumber}. {aiMeta.domainName} · 학교 자체 인공지능 성취기준
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 text-xs">
                    <div className="bg-indigo-900/60 p-2.5 rounded-lg border border-indigo-700/60">
                      <p className="font-bold text-sky-300 mb-1">중학교 단계 학교 자체 기준</p>
                      <ul className="space-y-1 text-slate-200 leading-snug">
                        {aiMeta.middleSchool.map((s) => (
                          <li key={s.code}>
                            <strong className="text-amber-300 mr-1">{s.code}</strong> {s.statement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-indigo-900/60 p-2.5 rounded-lg border border-indigo-700/60">
                      <p className="font-bold text-emerald-300 mb-1">고등학교 단계 학교 자체 기준</p>
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

              {lessons.map((lesson) => (
                <details key={lesson.lessonId} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <summary className="flex cursor-pointer list-none items-center gap-2 p-3 hover:bg-slate-50">
                    <span className="rounded bg-slate-800 px-2.5 py-0.5 text-xs font-black text-white">{lesson.lessonNumber}차시</span>
                    <strong className="min-w-0 flex-1 text-sm text-[color:var(--brand-ink)] sm:text-base">{lesson.lessonTitle}</strong>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${lesson.kind === 'studio' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'}`}>
                      {lesson.kind === 'studio' ? '수업 일치' : '성장 포트폴리오'}
                    </span>
                  </summary>
                  <div className="space-y-3 border-t border-slate-200 p-4 text-sm leading-relaxed">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-extrabold text-amber-900">학생에게 보이는 오늘의 목표</p>
                      <p className="mt-1 font-semibold text-slate-900">{lesson.studentMission}</p>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-extrabold text-slate-700">교사가 관찰할 수행</p>
                        <p className="mt-1">{lesson.teacherObjective}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-extrabold text-slate-700">실제 시작 시나리오</p>
                        <p className="mt-1 font-bold">{lesson.scenarioTitle}</p>
                        <p className="mt-1 text-xs text-slate-600">{lesson.scenarioDescription}</p>
                      </div>
                      <div className="rounded-xl bg-indigo-50 p-3">
                        <p className="text-xs font-extrabold text-indigo-900">이 차시의 AI 역할</p>
                        <p className="mt-1">{lesson.aiRole}</p>
                        <p className="mt-2 text-xs text-indigo-800">화면의 AI 의견: {lesson.aiContribution}</p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 p-3">
                        <p className="text-xs font-extrabold text-emerald-900">학생 산출물 · 새 상황 전이</p>
                        <p className="mt-1 font-bold">{lesson.artifactTitle}</p>
                        <p className="text-xs text-slate-700">{lesson.artifactPrompt}</p>
                        <p className="mt-2 font-bold">{lesson.transferTitle}</p>
                        <p className="text-xs text-slate-700">{lesson.transferDescription}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                      <span className="text-xs font-extrabold text-slate-700">학교 자체 인공지능 성취기준</span>
                      {lesson.standards.map((standard) => (
                        <code key={standard} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-800">{standard}</code>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </details>
        );
      })}
    </section>
  );
}
