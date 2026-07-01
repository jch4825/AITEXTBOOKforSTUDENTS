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
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../context/ProgressContext';
import { useSpeak } from '../hooks/useSpeak';
import { getLesson } from '../data/lessons/m1';
import { getModule, moduleIdFromLessonId } from '../data/modules';
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
  const totalSteps = lesson.steps.length;
  const currentStep = lesson.steps[step];
  const body = difficulty === 'easy' ? lesson.bodyEasy : lesson.bodyNormal;

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
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4" style={{ color: theme.accent }}>{lesson.title}</h1>
        {data.imagePlaceholder && (
          <div
            className="w-full aspect-video rounded-lg border-2 border-dashed flex items-center justify-center text-[color:var(--muted)] mb-4"
            style={{ borderColor: 'var(--border)', background: 'rgba(0,0,0,0.03)' }}
            aria-label="이미지 자리"
          >
            <span className="text-base">(여기에 그림)</span>
          </div>
        )}
        <p className="text-xl leading-relaxed">{wrapDictionaryTerms(body, terms)}</p>
        <button
          onClick={() => speak(body)}
          className="mt-4 px-4 py-3 rounded font-semibold text-white"
          style={{ background: theme.accent }}
        >🔊 읽어줘</button>
      </div>
    );
  }

  function renderOX() {
    const data = currentStep.data as { questions: OXQuestion[] };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.accent }}>같이 풀어봐요!</h2>
        <OXGame questions={data.questions} onComplete={handleNext} />
      </div>
    );
  }

  function renderCardPick() {
    const data = currentStep.data as { question: string; choices: CardChoice[] };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.accent }}>골라봐요!</h2>
        <CardPick question={data.question} choices={data.choices} onComplete={handleNext} />
      </div>
    );
  }

  function renderMatching() {
    const data = currentStep.data as { pairs: MatchingPair[] };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.accent }}>짝을 맞춰봐요!</h2>
        <Matching pairs={data.pairs} onComplete={handleNext} />
      </div>
    );
  }

  function renderSimAI() {
    const data = currentStep.data as { prompt: string; userInput: string; aiResponse: string };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.accent }}>AI랑 이야기해봐요</h2>
        <p className="text-lg mb-4">{data.prompt}</p>
        {!simRevealed ? (
          <button
            onClick={() => { setSimRevealed(true); speak(data.aiResponse); }}
            className="px-6 py-4 rounded-lg border-4 text-xl font-bold"
            style={{ borderColor: theme.accent, color: theme.accent, background: theme.accentSoft }}
          >💬 "{data.userInput}" 보내기</button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded bg-gray-100 text-right">내가: {data.userInput}</div>
            <div className="p-4 rounded text-lg" style={{ background: theme.accentSoft }}>
              <strong style={{ color: theme.accent }}>AI:</strong> {data.aiResponse}
            </div>
          </div>
        )}
      </div>
    );
  }

  let body_el: JSX.Element;
  if (currentStep.kind === 'text') body_el = renderText();
  else if (currentStep.kind === 'ox') body_el = renderOX();
  else if (currentStep.kind === 'card-pick') body_el = renderCardPick();
  else if (currentStep.kind === 'matching') body_el = renderMatching();
  else if (currentStep.kind === 'sim-ai') body_el = renderSimAI();
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
        <div className="text-6xl mb-4" aria-hidden>{theme.emoji}</div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: theme.accent }}>
          곧 열려요!
        </h1>
        <p className="text-lg text-[color:var(--muted)] mb-8">
          이 차시는 아직 준비 중이에요. 첫 번째 차시부터 시작해봐요.
        </p>
        <button
          onClick={() => onPickLesson('m1-l1')}
          className="px-6 py-3 rounded-lg text-lg font-bold text-white"
          style={{ background: theme.accent }}
        >
          🚀 첫 차시로 가기
        </button>
      </div>
    </MicroLessonFrame>
  );
}
