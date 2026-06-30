import type { JSX } from 'react';
import { useState } from 'react';
import MicroLessonFrame from '../components/MicroLessonFrame';
import DictionaryTerm from '../components/DictionaryTerm';
import OXGame from '../components/games/OXGame';
import type { OXQuestion } from '../components/games/OXGame';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../context/ProgressContext';
import { useSpeak } from '../hooks/useSpeak';
import { DEMO_LESSON } from '../data/demoLesson';
import { getModule } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import type { LessonId } from '../types';

interface Props {
  lessonId: LessonId;
  onGoHome: () => void;
  onPickLesson: (id: LessonId) => void;
}

export default function LessonView({ lessonId, onGoHome, onPickLesson }: Props) {
  const { difficulty } = useSettings();
  const { markCompleted } = useProgress();
  const { speak } = useSpeak();
  const [step, setStep] = useState(0);
  const [simRevealed, setSimRevealed] = useState(false);

  const lesson = DEMO_LESSON; // M1: only the demo lesson exists
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
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4" style={{ color: theme.accent }}>{lesson.title}</h1>
        <p className="text-xl leading-relaxed">
          {/* split body so we can wrap key words in DictionaryTerm */}
          {body.split('인공지능').reduce<(string | JSX.Element)[]>((acc, part, i, arr) => {
            acc.push(part);
            if (i < arr.length - 1) {
              acc.push(<span key={`d-${i}`}><DictionaryTerm term="인공지능">인공지능</DictionaryTerm></span>);
            }
            return acc;
          }, [])}
        </p>
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

  function renderSimAI() {
    const data = currentStep.data as { prompt: string; userInput: string; aiResponse: string };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.accent }}>AI한테 인사해봐요</h2>
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
  else if (currentStep.kind === 'sim-ai') body_el = renderSimAI();
  else body_el = <p>(아직 만들지 않은 단계 종류: {currentStep.kind})</p>;

  return (
    <MicroLessonFrame
      lessonId={lesson.id}
      crumb={`모듈 ${mod.number} > ${lesson.title}`}
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
