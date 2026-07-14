import { useMemo, useState, type CSSProperties } from 'react';
import { MODULES, lessonIdsForModule, moduleIdFromLessonId } from '../data/modules';
import { getLesson } from '../data/lessons';
import { MODULE_EPISODES } from '../data/story';
import { themeFor } from '../utils/moduleThemes';
import { useProgress } from '../context/ProgressContext';
import ComicPanel from '../components/ComicPanel';
import SeasonMap from '../components/SeasonMap';
import Icon from '../components/Icon';
import Button from '../components/Button';
import type { LessonId, ModuleId } from '../types';
import { pickResumeLesson } from '../utils/lessonResume';

interface Props { onPickLesson: (id: LessonId) => void; onGoHome: () => void; }

/** AI 동아리의 여섯 모듈을 연재 에피소드와 차시 컷으로 보여 주는 학습 허브. */
export default function ContentsView({ onPickLesson, onGoHome }: Props) {
  const { completedLessons, isCompleted } = useProgress();
  const resume = pickResumeLesson(completedLessons);
  const resumeModule = moduleIdFromLessonId(resume) ?? 'm1';
  const [activeId, setActiveId] = useState<ModuleId | null>(resumeModule);
  const activeTheme = themeFor(activeId ?? resumeModule);
  const resumeTitle = getLesson(resume)?.title ?? 'AI는 우리 곁에 있어요';
  const episodes = useMemo(() => MODULES.map((module) => {
    const ids = lessonIdsForModule(module.id);
    return {
      id: module.id,
      number: module.number,
      title: module.title,
      synopsis: MODULE_EPISODES[module.id].synopsis,
      done: ids.filter(isCompleted).length,
      total: ids.length,
      complete: ids.every(isCompleted),
    };
  }), [completedLessons, isCompleted]);

  const handlePickModule = (moduleId: ModuleId) => {
    setActiveId((current) => (current === moduleId ? null : moduleId));
  };

  return <main className="min-h-screen comic-contents">
    <header className="comic-contents-header">
      <button onClick={onGoHome} className="comic-home-link" aria-label="처음 화면으로"><Icon name="home" size={21} /> AI 교과서</button>
      <span className="comic-header-caption">AI 동아리 · 시즌 1</span>
    </header>
    <div className="comic-contents-inner mx-auto px-4 md:px-8 py-6 md:py-10">
      <ComicPanel accent={activeTheme.accent} className="comic-resume" label="이어서 배우기">
        <div><p className="comic-kicker">{completedLessons.length ? '다음 컷에서 이어서' : '첫 번째 이야기를 시작해요'}</p><h1>{resumeTitle}</h1><p>한 장면씩 천천히, 아이미와 함께 배워요.</p></div>
        <Button size="lg" accent={activeTheme.accent} onClick={() => onPickLesson(resume)}><Icon name="book" size={22} /> {completedLessons.length ? '이어서 하기' : '첫 컷 보기'}</Button>
      </ComicPanel>
      <section className="mt-9"><p className="comic-kicker mb-3">SEASON MAP</p><SeasonMap episodes={episodes} activeId={activeId} onPick={handlePickModule} renderLessons={(moduleId) => {
  const module = MODULES.find((item) => item.id === moduleId)!;
  const moduleTheme = themeFor(moduleId);
  return <div className="comic-lesson-list" style={{ '--comic-accent': moduleTheme.accent } as CSSProperties}>
    <div className="comic-list-heading">
      <div>
        <p className="comic-kicker">{String(module.number).padStart(2, '0')} MODULE</p>
        <h2>{module.title}</h2>
      </div>
      <span className="comic-count">{lessonIdsForModule(moduleId).filter(isCompleted).length}/{lessonIdsForModule(moduleId).length}</span>
    </div>
    <ol className="comic-lesson-cuts">{lessonIdsForModule(moduleId).map((id, index) => {
      const lesson = getLesson(id); const done = isCompleted(id);
      return <li key={id}><button onClick={() => lesson && onPickLesson(id)} disabled={!lesson} className="comic-lesson-cut"><span className="comic-cut-number">{done ? <Icon name="star" size={18} filled color={moduleTheme.accent} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{lesson?.title ?? '곧 열려요'}</strong>{lesson && <small>{lesson.wrapUpEasy}</small>}</span><Icon name="chevron-right" size={20} /></button></li>;
    })}</ol>
  </div>;
}} /></section>

    </div>
  </main>;
}
