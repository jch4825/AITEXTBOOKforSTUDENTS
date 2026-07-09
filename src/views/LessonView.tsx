import type { JSX, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import MicroLessonFrame from '../components/MicroLessonFrame';
import DictionaryTerm from '../components/DictionaryTerm';
import OXGame from '../components/games/OXGame';
import type { OXQuestion } from '../components/games/OXGame';
import CardPick from '../components/games/CardPick';
import type { CardChoice } from '../components/games/CardPick';
import Matching from '../components/games/Matching';
import type { MatchingPair } from '../components/games/Matching';
import Sequence from '../components/games/Sequence';
import type { SequenceItem } from '../components/games/Sequence';
import RealAIStep from '../components/RealAIStep';
import Stage from '../components/Stage';
import SpeechBubble from '../components/SpeechBubble';
import Button from '../components/Button';
import Icon from '../components/Icon';
import ModuleIcon from '../components/ModuleIcon';
import { getLessonStory, MODULE_EPISODES } from '../data/story';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../context/ProgressContext';
import { useSpeak } from '../hooks/useSpeak';
import { getLesson } from '../data/lessons';
import { getModule, moduleIdFromLessonId, MODULES, lessonIdsForModule } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import type { LessonContent, LessonId } from '../types';

interface Props {
  lessonId: LessonId;
  onGoHome: () => void;
  onPickLesson: (id: LessonId) => void;
}

export default function LessonView({ lessonId, onGoHome, onPickLesson }: Props) {
  const lesson = getLesson(lessonId);
  if (!lesson) {
    return <ComingSoonLesson lessonId={lessonId} onGoHome={onGoHome} onPickLesson={onPickLesson} />;
  }
  return (
    <ImplementedLesson
      lesson={lesson}
      onGoHome={onGoHome}
      onPickLesson={onPickLesson}
    />
  );
}

interface ImplementedProps {
  lesson: LessonContent;
  onGoHome: () => void;
  onPickLesson: (id: LessonId) => void;
}

function ImplementedLesson({ lesson, onGoHome, onPickLesson }: ImplementedProps) {
  const { difficulty } = useSettings();
  const { markCompleted } = useProgress();
  const { speak } = useSpeak();
  const [step, setStep] = useState(0);
  const [simRevealed, setSimRevealed] = useState(false);

  // Reset per-lesson state whenever the lesson changes (e.g. sidebar navigation).
  useEffect(() => {
    setStep(0);
    setSimRevealed(false);
  }, [lesson.id]);

  const mod = getModule(lesson.moduleId)!;
  const theme = themeFor(lesson.moduleId);
  // 마지막은 항상 정리(wrap-up) 화면 — 도입·활동·정리의 수업 3단 구조.
  const totalSteps = lesson.steps.length + 1;
  const isWrapUp = step === lesson.steps.length;
  const currentStep = lesson.steps[step];
  const body = difficulty === 'easy' ? lesson.bodyEasy : lesson.bodyNormal;
  const wrapUpText = difficulty === 'easy' ? lesson.wrapUpEasy : lesson.wrapUpNormal;
  const story = getLessonStory(lesson.id);
  const storyIntro = story ? (difficulty === 'easy' ? story.introEasy : story.introNormal) : null;

  // 정리 화면에 들어오면 자동으로 한 번 읽어준다.
  useEffect(() => {
    if (isWrapUp) speak(wrapUpText);
    // eslint 없음 — speak는 설정만 바뀌지 않으면 안정적.
  }, [isWrapUp, wrapUpText]);

  function handleNext() {
    if (step + 1 >= totalSteps) {
      markCompleted(lesson.id);
      onGoHome();
    } else {
      setStep(s => s + 1);
      setSimRevealed(false);
    }
  }

  function handlePrev() {
    if (step > 0) {
      setStep(s => s - 1);
      setSimRevealed(false);
    }
  }

  function renderText() {
    const data = currentStep.data as { dictionaryTerms?: string[]; imagePlaceholder?: boolean };
    const terms = data.dictionaryTerms ?? [];
    // 무대 위(전폭 히어로) → 책상 위(본문) 2단 구성 — §4.1
    if (story && storyIntro) {
      return (
        <>
          <Stage
            lessonId={lesson.id}
            title={lesson.title}
            scene={story.scene}
            text={storyIntro}
            episodeTitle={lesson.number === 1 ? MODULE_EPISODES[lesson.moduleId].title : undefined}
            accent={theme.accent}
            accentText={theme.accentText}
            accentSoft={theme.accentSoft}
            className="-mx-4 -mt-4 md:-mx-8 md:-mt-10 mb-6"
          />
          <div className="max-w-2xl mx-auto">
            <p className="t-body-lg">{wrapDictionaryTerms(body, terms)}</p>
            <Button accent={theme.accent} onClick={() => speak(body)} className="mt-4">
              <Icon name="speaker" size={20} /> 읽어줘
            </Button>
          </div>
        </>
      );
    }
    // 스토리가 없는 예외 차시 — 기존 단일 칼럼 유지
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="t-h1 mb-4" style={{ color: theme.accent }}>{lesson.title}</h1>
        {data.imagePlaceholder && (
          <div
            className="w-full aspect-video rounded-[var(--r-lg)] border-2 border-dashed flex items-center justify-center text-[color:var(--muted)] mb-4"
            style={{ borderColor: 'var(--border)', background: 'var(--paper-2)' }}
            aria-label="이미지 자리"
          >
            <span className="text-base">(여기에 그림)</span>
          </div>
        )}
        <p className="t-body-lg">{wrapDictionaryTerms(body, terms)}</p>
        <Button accent={theme.accent} onClick={() => speak(body)} className="mt-4">
          <Icon name="speaker" size={20} /> 읽어줘
        </Button>
      </div>
    );
  }

  function renderOX() {
    const data = currentStep.data as { questions: OXQuestion[] };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="t-h2 mb-2" style={{ color: theme.accent }}>같이 풀어봐요!</h2>
        <div className="card p-4 md:p-6">
          <OXGame questions={data.questions} onComplete={handleNext} />
        </div>
      </div>
    );
  }

  function renderCardPick() {
    const data = currentStep.data as { question: string; choices: CardChoice[] };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="t-h2 mb-2" style={{ color: theme.accent }}>골라봐요!</h2>
        <div className="card p-4 md:p-6">
          <CardPick question={data.question} choices={data.choices} difficulty={difficulty} onComplete={handleNext} />
        </div>
      </div>
    );
  }

  function renderMatching() {
    const data = currentStep.data as { pairs: MatchingPair[] };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="t-h2 mb-2" style={{ color: theme.accent }}>짝을 맞춰봐요!</h2>
        <div className="card p-4 md:p-6">
          <Matching pairs={data.pairs} difficulty={difficulty} onComplete={handleNext} />
        </div>
      </div>
    );
  }

  function renderSequence() {
    const data = currentStep.data as { instruction: string; items: SequenceItem[] };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="t-h2 mb-2" style={{ color: theme.accent }}>순서대로 눌러봐요!</h2>
        <div className="card p-4 md:p-6">
          <Sequence instruction={data.instruction} items={data.items} difficulty={difficulty} onComplete={handleNext} />
        </div>
      </div>
    );
  }

  function renderSimAI() {
    const data = currentStep.data as { prompt: string; userInput: string; aiResponse: string };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="t-h2 mb-4" style={{ color: theme.accent }}>AI랑 이야기해봐요</h2>
        <p className="text-lg mb-4">{data.prompt}</p>
        {!simRevealed ? (
          <Button
            variant="choice"
            accent={theme.accent}
            onClick={() => { setSimRevealed(true); speak(data.aiResponse); }}
            className="px-6 text-xl font-bold"
            style={{ color: theme.accent, background: theme.accentSoft }}
          ><Icon name="chat" size={22} /> "{data.userInput}" 보내기</Button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded-[var(--r-sm)] bg-[color:var(--paper-2)] text-right">내가: {data.userInput}</div>
            <SpeechBubble
              speaker="aimi"
              expression="cheer"
              text={data.aiResponse}
              accent={theme.accent}
              accentText={theme.accentText}
              accentSoft={theme.accentSoft}
              showSpeakButton
            />
          </div>
        )}
      </div>
    );
  }

  function renderRealAI() {
    const data = currentStep.data as { prompt: string; userInput: string; fallbackResponse: string; allowFreeInput?: boolean };
    // Wrapper span carries the key so the child fully remounts (fresh state) on step change.
    return (
      <span key={`real-ai-${step}`}>
        <RealAIStep
          prompt={data.prompt}
          userInput={data.userInput}
          fallbackResponse={data.fallbackResponse}
          allowFreeInput={data.allowFreeInput}
          accent={theme.accent}
          accentText={theme.accentText}
          accentSoft={theme.accentSoft}
          onDone={() => { /* footer's "다음 ▶" is how the student advances */ }}
        />
      </span>
    );
  }

  function renderWrapUp() {
    const next = nextLessonInfo(lesson.id);
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        {/* 배움 도장 — 오늘의 별이 찍히는 순간 (1회성 250ms, §4.2) */}
        <div className="flex justify-center mb-4" aria-hidden>
          <span
            className="stamp-in inline-flex items-center justify-center rounded-full h-[88px] w-[88px]"
            style={{ background: theme.accentSoft, boxShadow: 'var(--e-1)' }}
          >
            <Icon name="star" size={48} filled color={theme.accent} />
          </span>
        </div>
        <h2 className="t-h2 mb-4" style={{ color: theme.accent }}>오늘 배운 것</h2>
        <p className="text-xl leading-relaxed mb-6">{wrapUpText}</p>
        {story && (
          <div className="text-left max-w-md mx-auto mb-6">
            <SpeechBubble
              speaker={story.reaction.speaker}
              text={story.reaction.text}
              expression="happy"
              accent={theme.accent}
              accentText={theme.accentText}
              accentSoft={theme.accentSoft}
            />
          </div>
        )}
        {next && (
          <p className="t-label mb-5 text-[color:var(--muted)]">
            다음 시간: {next.title}
          </p>
        )}
        <div className="flex flex-col items-center gap-3">
          <Button variant="secondary" accent={theme.accent} onClick={() => speak(wrapUpText)}>
            <Icon name="speaker" size={20} /> 읽어줘
          </Button>
          <Button size="lg" accent={theme.accent} onClick={handleNext} className="text-xl">
            <Icon name="sparkles" size={22} filled /> 다 했어요!
          </Button>
        </div>
      </div>
    );
  }

  let body_el: JSX.Element;
  if (isWrapUp) body_el = renderWrapUp();
  else if (currentStep.kind === 'text') body_el = renderText();
  else if (currentStep.kind === 'ox') body_el = renderOX();
  else if (currentStep.kind === 'card-pick') body_el = renderCardPick();
  else if (currentStep.kind === 'matching') body_el = renderMatching();
  else if (currentStep.kind === 'sequence') body_el = renderSequence();
  else if (currentStep.kind === 'sim-ai') body_el = renderSimAI();
  else if (currentStep.kind === 'real-ai') body_el = renderRealAI();
  else body_el = <p>(아직 만들지 않은 단계 종류: {currentStep.kind})</p>;

  return (
    <MicroLessonFrame
      lessonId={lesson.id}
      crumb={`모듈 ${mod.number} > ${lesson.number}. ${lesson.title}`}
      totalSteps={totalSteps}
      currentStep={step}
      onPrev={handlePrev}
      onNext={handleNext}
      onGoHome={onGoHome}
      onPickLesson={onPickLesson}
    >
      {body_el}
    </MicroLessonFrame>
  );
}

/**
 * Renders the body with each occurrence of a listed term wrapped in a
 * DictionaryTerm (dotted-underline, opens the right-hand panel on click).
 */
function wrapDictionaryTerms(text: string, terms: string[]): ReactNode[] {
  if (terms.length === 0) return [text];
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'g');
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    terms.includes(part)
      ? <span key={i}><DictionaryTerm term={part}>{part}</DictionaryTerm></span>
      : <span key={i}>{part}</span>
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 정리 화면의 "다음 차시 예고" 한 줄 — 전체 차시 순서에서 다음으로 구현된 차시.
 * (아직 콘텐츠가 없는 차시는 건너뛴다 — "곧 열려요"를 예고하지 않기 위해.)
 */
function nextLessonInfo(currentId: LessonId): { id: LessonId; title: string } | null {
  const all: LessonId[] = MODULES.flatMap(m => lessonIdsForModule(m.id));
  const idx = all.indexOf(currentId);
  if (idx < 0) return null;
  for (let i = idx + 1; i < all.length; i++) {
    const l = getLesson(all[i]);
    if (l) return { id: all[i], title: l.title };
  }
  return null;
}

interface ComingSoonProps {
  lessonId: LessonId;
  onGoHome: () => void;
  onPickLesson: (id: LessonId) => void;
}

function ComingSoonLesson({ lessonId, onGoHome, onPickLesson }: ComingSoonProps) {
  const modId = moduleIdFromLessonId(lessonId);
  const mod = modId ? getModule(modId) : undefined;
  const theme = themeFor(modId ?? 'm1');
  const crumb = mod ? `모듈 ${mod.number} > ${mod.title}` : lessonId;

  return (
    <MicroLessonFrame
      lessonId={lessonId}
      crumb={crumb}
      totalSteps={1}
      currentStep={0}
      onPrev={() => {}}
      onNext={onGoHome}
      onGoHome={onGoHome}
      onPickLesson={onPickLesson}
    >
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="flex justify-center mb-4" aria-hidden>
          <ModuleIcon moduleId={modId ?? 'm1'} size={64} />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: theme.accent }}>
          곧 열려요!
        </h1>
        <p className="text-lg text-[color:var(--muted)] mb-8">
          이 차시는 아직 준비 중이에요. 첫 번째 차시부터 시작해봐요.
        </p>
        <Button size="lg" accent={theme.accent} onClick={() => onPickLesson('m1-l1')}>
          <Icon name="rocket" size={24} /> 첫 차시로 가기
        </Button>
      </div>
    </MicroLessonFrame>
  );
}
