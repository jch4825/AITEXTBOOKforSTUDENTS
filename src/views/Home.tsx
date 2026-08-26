import { useEffect, useState } from 'react';
import Button from '../components/Button';
import ModuleIcon from '../components/ModuleIcon';
import { useProgress } from '../context/ProgressContext';
import { useSettings } from '../context/SettingsContext';
import { SUPPORT_LABELS, SUPPORT_TO_DIFFICULTY } from '../features/studio/supportLevel';
import type { SupportLevel } from '../features/studio/types';
import { getLesson } from '../data/lessons';
import { lessonIdsForModule, MODULES } from '../data/modules';
import type { LessonId } from '../types';
import { pickResumeLesson } from '../utils/lessonResume';

interface Props {
  onEnter: () => void;
  onEnterLesson?: (id: LessonId) => void;
}

/**
 * 표지에서 고르는 학년군.
 * 같은 68차시를 중·고가 공통으로 쓰되 중학은 9학년군, 고등은 12학년군 성취기준으로
 * 평가한다(src/data/aiAchievementLevels.ts). 충분한 지원은 두 학년군 모두에서
 * 더 많은 도움이 필요한 학생에게 쓰는 단계다.
 * 라벨은 supportLevel.ts 한 곳에서 가져온다.
 */
const LEVEL_ORDER: SupportLevel[] = ['full', 'light', 'challenge'];

const LEVEL_NOTE: Record<SupportLevel, string> = {
  full: '도움이 더 필요할 때',
  light: '중학교 학년군',
  challenge: '고등학교 학년군',
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

export default function Home({ onEnter, onEnterLesson }: Props) {
  const { completedLessons } = useProgress();
  const { difficulty, setDifficulty } = useSettings();
  const reducedMotion = useReducedMotion();
  const totalLessons = MODULES.reduce((sum, module) => sum + module.lessonCount, 0);
  const doneCount = completedLessons.length;
  const isResume = doneCount > 0;
  const progressPercent = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0;
  const resumeLessonId = pickResumeLesson(completedLessons);
  const resumeLesson = getLesson(resumeLessonId);
  const doneSet = new Set(completedLessons);
  const badges = MODULES.map((module) => {
    const lessons = lessonIdsForModule(module.id);
    return {
      module,
      earned: lessons.length > 0 && lessons.every((lessonId) => doneSet.has(lessonId)),
    };
  });
  const earnedCount = badges.filter((badge) => badge.earned).length;

  function startLearning() {
    if (onEnterLesson) onEnterLesson(resumeLessonId);
    else onEnter();
  }

  return (
    <div
      className="min-h-screen select-none bg-[color:var(--paper-1)] text-[color:var(--ink-1)]"
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
    >
      <nav className="surface-paper relative z-10 min-h-20 rounded-none border-x-0 border-t-0 py-3">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[color:var(--brand-ink)] sm:text-2xl">
            <span className="material-symbols-outlined text-3xl" aria-hidden="true">auto_awesome</span>
            기본교육과정 중·고 선택 교과
          </div>
          {/*
            교사용 페이지는 화면 크기와 상관없이 보여야 한다. 예전에는 md 미만에서 이 묶음을
            통째로 숨겨서, 태블릿과 휴대전화로 수업할 때 교사 모드로 들어갈 길이 없었다.
            교사 모드에 못 들어가면 교실 도크의 교사 자료도 계속 잠긴 채로 남는다.
            좁은 화면에서는 안내 문구만 접고 링크는 남긴다.
          */}
          <div className="flex items-center gap-2">
            <span className="hidden px-4 py-2 text-sm font-bold text-[color:var(--brand-ink)] md:inline">학생 학습 화면</span>
            <a
              className="min-h-11 rounded-[var(--r-sm)] border-2 border-[color:var(--brand-ink)] px-4 py-2 text-sm font-semibold whitespace-nowrap text-[color:var(--brand-ink)] transition-colors hover:bg-[color:var(--paper-2)]"
              href="?teacher=1"
            >
              교사용 페이지
            </a>
          </div>
          <button
            type="button"
            onClick={onEnter}
            className="surface-choice is-primary min-h-11 rounded-[var(--r-pill)] px-6 py-2.5 text-sm font-bold transition-colors hover:bg-[color:var(--ink-1)]"
          >
            목차 페이지
          </button>
        </div>
      </nav>

      <main className="relative mx-auto max-w-[1200px] space-y-16 px-6 pb-20 pt-10">
        <section className="grid min-h-[500px] grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 text-left lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border-2 border-[color:var(--brand-ink)] bg-[color:var(--paper-0)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[color:var(--brand-ink)]">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">school</span>
              기본교육과정 중·고 선택
            </div>
            <h1 className="text-[clamp(1.85rem,9vw,3rem)] font-black leading-[1.1] tracking-tight text-[color:var(--brand-ink)] md:text-6xl">
              <span className="block whitespace-nowrap">아이미와 배우는</span>
              <span className="block whitespace-nowrap">인공지능 활용</span>
            </h1>
            <p className="max-w-lg text-xl leading-relaxed text-[color:var(--ink-2)]">
              {isResume
                ? '아이미와 친구들이 다시 공부할 준비를 마쳤습니다! 이어서 모험을 떠나 보겠습니까?'
                : '진우, 윤아랑 같이 AI 도우미 아이미를 만나 여러 가지 신기한 도구와 인공지능의 지식을 배웁니다.'}
            </p>

            <div className="pt-2" role="group" aria-label="학년군 고르기">
              <p className="mb-2 text-sm font-bold text-[color:var(--ink-2)]">누가 공부할까요?</p>
              <div className="flex flex-wrap gap-2">
                {LEVEL_ORDER.map((level) => {
                  const value = SUPPORT_TO_DIFFICULTY[level];
                  const active = difficulty === value;
                  return (
                    <button
                      key={level}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setDifficulty(value)}
                      className={`surface-choice min-h-14 rounded-[var(--r-sm)] px-5 py-2.5 text-left transition-colors${active ? ' is-primary' : ''}`}
                    >
                      <span className="block text-base font-extrabold">{SUPPORT_LABELS[level]}</span>
                      <span className="block text-xs font-semibold opacity-80">{LEVEL_NOTE[level]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                onClick={startLearning}
                className="surface-choice is-primary group gap-3 px-10 py-5 text-xl"
              >
                {isResume ? '이어서 학습하기' : '학습 시작하기'}
                <span
                  className={`material-symbols-outlined text-2xl ${reducedMotion ? '' : 'transition-transform group-hover:translate-x-1'}`}
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-5">
            <figure className="surface-a4 relative aspect-[7/10] w-full max-w-[420px] overflow-hidden rounded-[var(--r-md)] border-[color:var(--brand-ink)]">
              <img
                src={`${import.meta.env.BASE_URL}cover.png`}
                alt="아이미, 진우, 윤아가 함께 있는 인공지능 활용 교과서 표지"
                className="h-full w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-[color:var(--brand-ink)] p-6 text-[color:var(--paper-0)]">
                <span className="inline-flex rounded-[var(--r-pill)] border-2 border-[color:var(--paper-0)] px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  기본 중·고
                </span>
                <p className="mt-2 text-2xl font-black">인공지능 활용(기본교육과정)</p>
                <p className="mt-1 text-xs">미래 사회와 동반성장하는 첫 단추</p>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="features" className="space-y-8">
          <div className="mx-auto max-w-xl space-y-2 text-center">
            <h2 className="text-3xl font-extrabold text-[color:var(--brand-ink)]">내 속도로 배우는 인공지능 학습서</h2>
            <p className="text-sm text-[color:var(--ink-2)]">발달장애학생들을 위한 첫 인공지능 수업 자료</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <article className="surface-paper flex min-h-[300px] flex-col justify-between rounded-[var(--r-md)] p-8 md:col-span-2">
              <div>
                <span className="mb-4 inline-block rounded-[var(--r-pill)] border-2 border-[color:var(--brand-ink)] bg-[color:var(--paper-1)] px-3 py-1 text-xs font-bold text-[color:var(--brand-ink)]">
                  단원 기록
                </span>
                <h3 className="mb-2 text-2xl font-bold text-[color:var(--brand-ink)]">단원 학습 기록</h3>
                <p className="max-w-md text-sm text-[color:var(--ink-2)]">
                  차시를 마칠 때마다 단원 기록이 채워집니다. 완료한 학습을 한눈에 확인할 수 있습니다.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-[var(--r-sm)] border-2 border-dashed border-[color:var(--line)] bg-[color:var(--paper-1)] p-4">
                {badges.map(({ module, earned }) => (
                  <div
                    key={module.id}
                    className={`grid h-14 w-14 place-items-center rounded-full ${earned ? 'surface-stamp text-[color:var(--brand-ink)]' : 'border-2 border-dashed border-[color:var(--line)] bg-[color:var(--paper-0)] opacity-60'}`}
                    title={earned ? `${module.title} 완주!` : `${module.title} 진행 중`}
                    aria-label={earned ? `${module.title} 완주 도장` : `${module.title} 진행 중`}
                  >
                    <ModuleIcon moduleId={module.id} size={28} muted={!earned} />
                  </div>
                ))}
                <span className="ml-2 text-xs font-bold text-[color:var(--ink-2)]">
                  {earnedCount} / 6개 획득
                </span>
              </div>
            </article>

            <article className="surface-paper flex flex-col items-start justify-center space-y-4 rounded-[var(--r-md)] p-8 text-left">
              <div className="surface-stamp grid h-14 w-14 place-items-center rounded-[var(--r-sm)] text-[color:var(--brand-ink)]">
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">menu_book</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[color:var(--ink-1)]">{isResume ? '이어서 할 차시' : '오늘 배울 내용'}</h3>
                <p className="text-base font-extrabold text-[color:var(--brand-ink)]">
                  {resumeLesson?.title ?? 'AI는 우리 곁에 있습니다'}
                </p>
                <p className="text-sm leading-relaxed text-[color:var(--ink-2)]">
                  {resumeLesson?.objective ?? '아이미와 함께 인공지능이 하는 일을 알아봅니다.'}
                </p>
              </div>
            </article>
          </div>
        </section>

        <section id="progress" className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-extrabold text-[color:var(--brand-ink)]">나의 학습 성장 기록</h2>
            <p className="text-sm text-[color:var(--ink-2)]">그동안 진우와 윤아랑 함께 쌓아온 아름다운 배움의 길입니다.</p>
          </div>

          <div className="surface-paper mx-auto max-w-3xl rounded-[var(--r-md)] p-8 md:p-10">
            <div className="grid grid-cols-1 items-center gap-8 text-center md:grid-cols-3">
              <div className="space-y-3">
                <div className="text-3xl font-black text-[color:var(--brand-ink)]">{progressPercent}%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--ink-1)]">전체 차시 완수율</div>
                <div
                  className="h-3 w-full overflow-hidden rounded-[var(--r-pill)] border-2 border-[color:var(--brand-ink)] bg-[color:var(--paper-2)]"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progressPercent}
                  aria-label="전체 차시 완수율"
                >
                  <div
                    className="h-full bg-[color:var(--brand-ink)] transition-[width] duration-500 motion-reduce:transition-none"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 py-2 md:border-x-2 md:border-[color:var(--line)]">
                <div className="text-3xl font-black text-[color:var(--brand-ink)]">{isResume ? '학습 중' : '시작 단계'}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--ink-1)]">나의 학습 상태</div>
                <p className="text-xs text-[color:var(--ink-2)]">아이미가 대기하고 있습니다</p>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-black text-[color:var(--brand-ink)]">{doneCount}개</div>
                <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--ink-1)]">완료한 학습 개수</div>
                <p className="text-xs text-[color:var(--ink-2)]">총 {totalLessons}개 학습 차시</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative w-full border-t-2 border-[color:var(--brand-ink)] bg-[color:var(--paper-2)] py-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center gap-1 text-lg font-black text-[color:var(--brand-ink)] md:justify-start">
              <span className="material-symbols-outlined text-xl" aria-hidden="true">auto_awesome</span>
              인공지능 활용
            </div>
            <p className="text-xs text-[color:var(--ink-2)]">발달장애 학생을 위한 인공지능 학습 온라인 교과서입니다.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-[color:var(--ink-2)]">
            <span>접근성 기능 제공</span>
            <span>학습 기록은 이 기기에 저장됩니다</span>
            <span>도움이 필요하면 선생님께 알려 주십시오</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
