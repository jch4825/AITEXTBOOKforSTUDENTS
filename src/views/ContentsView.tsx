import { useState } from 'react';
import { MODULES, lessonIdsForModule, moduleIdFromLessonId } from '../data/modules';
import { getLesson } from '../data/lessons';
import { MODULE_EPISODES } from '../data/story';
import { themeFor } from '../utils/moduleThemes';
import { useProgress } from '../context/ProgressContext';
import ModuleIcon from '../components/ModuleIcon';
import Icon from '../components/Icon';
import Button from '../components/Button';
import type { LessonId, ModuleId } from '../types';
import { pickResumeLesson } from '../utils/lessonResume';

interface Props {
  onPickLesson: (id: LessonId) => void;
  onGoHome: () => void; // 프론트(환영) 페이지로
}



/**
 * 목차(차례) — 프론트 페이지 다음의 학습 허브.
 * 링크 도서관 형식: 모듈명을 누르면 아래로 차시들이 열리고, 각 차시는 바로가기.
 * 상단에 큰 "이어서 하기" 버튼.
 */
export default function ContentsView({ onPickLesson, onGoHome }: Props) {
  const { completedLessons, isCompleted } = useProgress();
  const doneCount = completedLessons.length;
  const totalLessons = MODULES.reduce((s, m) => s + m.lessonCount, 0);
  const resume = pickResumeLesson(completedLessons);
  const resumeMod = moduleIdFromLessonId(resume);
  const isResume = doneCount > 0;

  // 이어서 할 차시가 속한 모듈을 기본으로 펼쳐 둔다.
  const [open, setOpen] = useState<Set<ModuleId>>(() => new Set(resumeMod ? [resumeMod] : ['m1']));

  function toggle(id: ModuleId) {
    setOpen(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  const resumeTitle = getLesson(resume)?.title;

  return (
    <main className="min-h-screen">
      {/* 헤더 — 브랜드(프론트로) + 제목 */}
      <header className="h-16 border-b border-[color:var(--border)] bg-[color:var(--paper-0)] px-4 md:px-8 flex items-center gap-3">
        <button
          onClick={onGoHome}
          className="inline-flex items-center gap-1.5 min-h-11 px-2 -ml-2 rounded-[var(--r-sm)] text-lg font-bold hover:bg-[color:var(--paper-2)]"
          style={{ color: 'var(--accent)' }}
          aria-label="처음 화면으로"
        ><Icon name="home" size={22} /> AI 교과서</button>
        <span className="text-base text-[color:var(--muted)]">차례</span>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* 이어서 하기 — 크게, 상단 */}
        <section
          className="card p-5 md:p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ background: 'var(--paper-0)' }}
        >
          <div className="flex-1 min-w-0">
            <p className="t-label text-[color:var(--muted)] mb-1">
              {isResume ? '이어서 배울 차시' : '첫 차시부터 시작해요'}
            </p>
            <p className="text-xl font-bold truncate" style={{ color: 'var(--accent)' }}>
              {resumeTitle ?? 'AI는 우리 곁에 있어요'}
            </p>
            <p className="text-sm text-[color:var(--muted)] mt-1 nums">
              지금까지 {doneCount} / {totalLessons} 차시 끝났어요
            </p>
          </div>
          <Button size="lg" onClick={() => onPickLesson(resume)} className="shrink-0 text-xl">
            {isResume ? <><Icon name="book" size={24} /> 이어서 하기</> : <><Icon name="rocket" size={24} /> 시작하기</>}
          </Button>
        </section>

        {/* 링크 도서관 — 모듈 아코디언 */}
        <ol className="space-y-3">
          {MODULES.map(mod => {
            const theme = themeFor(mod.id);
            const lessons = lessonIdsForModule(mod.id);
            const doneInModule = lessons.filter(isCompleted).length;
            const moduleDone = doneInModule === lessons.length;
            const isOpen = open.has(mod.id);
            const ep = MODULE_EPISODES[mod.id];
            return (
              <li key={mod.id} className="card overflow-hidden" style={{ background: 'var(--paper-0)' }}>
                {/* 모듈 헤더 — 누르면 아래로 차시가 열린다 */}
                <button
                  onClick={() => toggle(mod.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-4 md:px-5 py-4 flex items-center gap-3 hover:bg-[color:var(--paper-1)]"
                >
                  <span
                    className="h-11 w-11 shrink-0 rounded-[var(--r-md)] flex items-center justify-center"
                    style={{ background: theme.accentSoft }}
                  >
                    <ModuleIcon moduleId={mod.id} size={26} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-lg" style={{ color: theme.accentText }}>
                        모듈 {mod.number}. {mod.title}
                      </span>
                      {moduleDone && <Icon name="star" size={16} filled color={theme.accent} />}
                    </span>
                    <span className="block text-sm text-[color:var(--muted)] truncate">{ep.synopsis}</span>
                  </span>
                  <span className="shrink-0 flex items-center gap-2 text-sm font-semibold text-[color:var(--muted)]">
                    <span className="nums">{doneInModule}/{lessons.length}</span>
                    <span
                      className="transition-transform"
                      style={{ transform: isOpen ? 'rotate(90deg)' : 'none', color: theme.accent }}
                      aria-hidden
                    >
                      <Icon name="chevron-right" size={20} />
                    </span>
                  </span>
                </button>

                {/* 차시 목록 — 하이퍼링크(누르면 그 차시로 이동) */}
                {isOpen && (
                  <ul className="border-t border-[color:var(--border)] divide-y divide-[color:var(--border)]">
                    {lessons.map((lid, i) => {
                      const l = getLesson(lid);
                      const done = isCompleted(lid);
                      return (
                        <li key={lid}>
                          <button
                            onClick={() => l && onPickLesson(lid)}
                            disabled={!l}
                            aria-label={`${mod.number}모듈 ${i + 1}차시 ${l?.title ?? '준비 중'}${done ? ' (완료)' : ''}`}
                            className="w-full text-left px-4 md:px-5 py-3 flex items-center gap-3 hover:bg-[color:var(--paper-1)] disabled:opacity-45 disabled:cursor-not-allowed"
                          >
                            {/* 완료 별 도장 / 차시 번호 */}
                            <span className="h-8 w-8 shrink-0 flex items-center justify-center">
                              {done ? (
                                <Icon name="star" size={22} filled color={theme.accent} />
                              ) : (
                                <span
                                  className="h-7 w-7 rounded-full border-2 flex items-center justify-center text-sm font-bold nums"
                                  style={{ borderColor: theme.accent, color: theme.accentText }}
                                >{i + 1}</span>
                              )}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block font-semibold truncate">
                                {l?.title ?? '곧 열려요'}
                              </span>
                              {l && (
                                <span className="block text-sm text-[color:var(--muted)] line-clamp-1">
                                  {l.wrapUpEasy}
                                </span>
                              )}
                            </span>
                            {l && (
                              <span className="shrink-0" style={{ color: theme.accent }} aria-hidden>
                                <Icon name="chevron-right" size={20} />
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
