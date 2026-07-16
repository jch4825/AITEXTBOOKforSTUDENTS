import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import MicroLessonFrame from '../components/MicroLessonFrame';
import OXGame from '../components/games/OXGame';
import type { OXQuestion } from '../components/games/OXGame';
import CardPick from '../components/games/CardPick';
import type { CardChoice } from '../components/games/CardPick';
import Matching from '../components/games/Matching';
import type { MatchingPair } from '../components/games/Matching';
import Sequence from '../components/games/Sequence';
import type { SequenceItem } from '../components/games/Sequence';
import RealAIStep from '../components/RealAIStep';
import StepErrorBoundary from '../components/StepErrorBoundary';
import ScreentoneBackdrop from '../components/lesson/ScreentoneBackdrop';
import EpisodeHeroSpread from '../components/lesson/EpisodeHeroSpread';
import ActivitySpread from '../components/lesson/ActivitySpread';
import EpisodeEnding from '../components/lesson/EpisodeEnding';
import SpeechBubble from '../components/SpeechBubble';
import Button from '../components/Button';
import Icon from '../components/Icon';
import PhoneFrame from '../components/PhoneFrame';
import type { PhoneMessage } from '../components/PhoneFrame';
import MissionStep from '../components/mission/MissionStep';
import type { MissionContent } from '../types';
import ModuleIcon from '../components/ModuleIcon';
import { getLessonStory, MODULE_EPISODES } from '../data/story';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../context/ProgressContext';
import { useSpeak } from '../hooks/useSpeak';
import { getLesson } from '../data/lessons';
import { getHardContent } from '../data/lessons/hard';
import { getStudioDefinition } from '../data/studios';
import StudioLessonView from '../features/studio/StudioLessonView';
import { getSupportBridge } from '../data/supportBridges';
import { getModulePortfolioDefinition } from '../data/modulePortfolios';
import SupportLessonBridge from '../features/studio/SupportLessonBridge';
import ModuleCloseLessonView from '../features/studio/ModuleCloseLessonView';
import LessonGoal from '../components/LessonGoal';
import HardLessonBody from '../components/HardLessonBody';
import { getModule, moduleIdFromLessonId, MODULES, lessonIdsForModule } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import { wrapDictionaryTerms } from './lessonTextUtils';
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
  const studioDefinition = getStudioDefinition(lessonId);
  if (studioDefinition) {
    return (
      <StudioLessonView
        definition={studioDefinition}
        lesson={lesson}
        hard={getHardContent(lesson.id)}
        onGoHome={onGoHome}
        onPickLesson={onPickLesson}
      />
    );
  }
  const portfolioDefinition = getModulePortfolioDefinition(lessonId);
  if (portfolioDefinition) {
    return (
      <ModuleCloseLessonView
        definition={portfolioDefinition}
        onGoHome={onGoHome}
        onPickLesson={onPickLesson}
      />
    );
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
  const { speakNow } = useSpeak();
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
  const hard = getHardContent(lesson.id);
  // 어려움인데 hard 콘텐츠가 없으면 보통으로 폴백 (spec §4 — 절대 깨지지 않음)
  const effectiveHard = difficulty === 'hard' && hard ? hard : null;
  const body = difficulty === 'easy' ? lesson.bodyEasy : lesson.bodyNormal;
  const wrapUpText = effectiveHard
    ? effectiveHard.wrapUpHard
    : difficulty === 'easy' ? lesson.wrapUpEasy : lesson.wrapUpNormal;
  const goalText = hard ? hard.goal[difficulty] : null; // 전 난이도 노출 (hard 데이터에서)
  const story = getLessonStory(lesson.id);
  // 스토리는 난이도와 직교 — 어려움은 introNormal 사용 (spec §5)
  const storyIntro = story ? (difficulty === 'easy' ? story.introEasy : story.introNormal) : null;

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

    const goalNode = step === 0 && goalText ? (
      <LessonGoal text={goalText} accent={theme.accent} />
    ) : null;

    const bodyNode = effectiveHard ? (
      <HardLessonBody content={effectiveHard} accent={theme.accent} dictionaryTerms={terms} />
    ) : (
      <>
        <p className="t-body-lg">{wrapDictionaryTerms(body, terms)}</p>
        <Button accent={theme.accent} onClick={() => speakNow(body)} className="mt-4">
          <Icon name="speaker" size={20} /> 읽어줘
        </Button>
      </>
    );
    const supportBridge = step === 0 ? getSupportBridge(lesson.id) : undefined;
    const connectedBody = (
      <>
        {supportBridge && (
          <SupportLessonBridge
            bridge={supportBridge}
            accent={theme.accent}
            onPickLesson={onPickLesson}
          />
        )}
        {bodyNode}
      </>
    );

    return (
      <EpisodeHeroSpread
        lessonId={lesson.id}
        title={lesson.title}
        scene={story?.scene ?? []}
        text={storyIntro ?? ''}
        bodyText={connectedBody}
        goalText={goalNode}
        episodeTitle={lesson.number === 1 ? MODULE_EPISODES[lesson.moduleId].title : undefined}
        accent={theme.accent}
        accentText={theme.accentText}
        accentSoft={theme.accentSoft}
        isHardMode={effectiveHard !== null}
      />
    );
  }

  function renderOX() {
    const data = currentStep.data as { questions: OXQuestion[] };
    return <OXGame questions={data.questions} onComplete={handleNext} />;
  }

  function renderCardPick() {
    const data = currentStep.data as { question: string; choices: CardChoice[] };
    return <CardPick question={data.question} choices={data.choices} difficulty={difficulty} onComplete={handleNext} />;
  }

  function renderMatching() {
    const data = currentStep.data as { pairs: MatchingPair[] };
    return <Matching pairs={data.pairs} difficulty={difficulty} onComplete={handleNext} />;
  }

  function renderSequence() {
    const data = currentStep.data as { instruction: string; items: SequenceItem[] };
    return <Sequence instruction={data.instruction} items={data.items} difficulty={difficulty} onComplete={handleNext} />;
  }

  function renderSimAI() {
    const data = currentStep.data as { prompt: string; userInput: string; aiResponse: string };
    return (
      <SimAIStep
        prompt={data.prompt}
        userInput={data.userInput}
        aiResponse={data.aiResponse}
        accent={theme.accent}
        accentSoft={theme.accentSoft}
        accentText={theme.accentText}
        onDone={handleNext}
      />
    );
  }

  function renderRealAI() {
    const data = currentStep.data as { prompt: string; userInput: string; fallbackResponse: string; allowFreeInput?: boolean; systemInstruction?: string };
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
          // 응답을 자동으로 넘기지 않는다 — 학생이 AI 답을 읽고(들은 뒤) 하단 '다음'으로 진행.
          // (handleNext로 두면 응답이 오는 즉시 스텝이 넘어가 답이 화면에 안 보인다.)
          onDone={() => { /* no-op: 하단 푸터의 '다음'이 진행을 담당 */ }}
          systemInstruction={data.systemInstruction}
        />
      </span>
    );
  }

  function renderMission() {
    const data = currentStep.data as unknown as MissionContent;
    return (
      <MissionStep
        mission={data}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        moduleTitle={mod.title}
        accent={theme.accent}
        accentSoft={theme.accentSoft}
        accentText={theme.accentText}
      />
    );
  }

  function renderWrapUp() {
    const next = nextLessonInfo(lesson.id);
    return (
      <EpisodeEnding
        wrapUpText={wrapUpText}
        goalText={goalText}
        reaction={story?.reaction}
        next={next}
        theme={theme}
        onSpeak={speakNow}
        onFinish={handleNext}
      />
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
  else if (currentStep.kind === 'mission') body_el = renderMission();
  else body_el = <p>(아직 만들지 않은 단계 종류: {currentStep.kind})</p>;

  return (
    <MicroLessonFrame
      lessonId={lesson.id}
      crumb={`단원 ${mod.number} > ${lesson.number}. ${lesson.title}`}
      totalSteps={totalSteps}
      currentStep={step}
      onPrev={handlePrev}
      onNext={handleNext}
      onGoHome={onGoHome}
      onPickLesson={onPickLesson}
    >
      <ScreentoneBackdrop moduleId={lesson.moduleId}>
        <StepErrorBoundary key={step}>{body_el}</StepErrorBoundary>
      </ScreentoneBackdrop>
    </MicroLessonFrame>
  );
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
  const crumb = mod ? `단원 ${mod.number} > ${mod.title}` : lessonId;

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

interface SimAIStepProps {
  prompt: string;
  userInput: string;
  aiResponse: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  onDone: () => void;
}

function SimAIStep({ prompt, userInput, aiResponse, accent, accentSoft, accentText, onDone }: SimAIStepProps) {
  const { speakNow } = useSpeak();
  const [stage, setStage] = useState<'idle' | 'typing' | 'revealed'>('idle');

  function handleSend() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setStage('revealed');
      speakNow(aiResponse);
    } else {
      setStage('typing');
      setTimeout(() => {
        setStage('revealed');
        speakNow(aiResponse);
      }, 1000);
    }
  }

  const messages: PhoneMessage[] = [];
  if (stage === 'typing' || stage === 'revealed') {
    messages.push({ id: 'user-1', sender: 'user', text: userInput });
  }
  if (stage === 'revealed') {
    messages.push({ id: 'aimi-1', sender: 'aimi', text: aiResponse, expression: 'cheer' });
  }

  const footer = stage === 'idle' ? (
    <Button
      variant="choice"
      accent={accent}
      onClick={handleSend}
      className="w-full text-base font-bold justify-center"
      style={{ color: accent, background: accentSoft }}
    >
      <Icon name="chat" size={18} /> "{userInput}" 보내기
    </Button>
  ) : stage === 'revealed' ? (
    <Button
      size="lg"
      accent={accent}
      onClick={onDone}
      className="w-full justify-center font-bold"
    >
      다음 <Icon name="chevron-right" size={20} />
    </Button>
  ) : null;

  const characterReaction = {
    id: 'aimi' as const,
    expression: stage === 'typing' ? 'thinking' as const : (stage === 'revealed' ? 'cheer' as const : 'curious' as const),
    text: stage === 'idle'
      ? '나에게 하고 싶은 말을 입력하고 전송 버튼을 눌러줘!'
      : (stage === 'typing' ? '어떤 말인지 열심히 생각하고 있어. 잠시만 기다려줘!' : '너와 대화하니까 정말 기뻐!')
  };

  return (
    <ActivitySpread
      kicker="AI랑 이야기해봐요"
      title={prompt}
      accent={accent}
      character={characterReaction}
    >
      <PhoneFrame
        messages={messages}
        typing={stage === 'typing'}
        accent={accent}
        accentSoft={accentSoft}
        accentText={accentText}
        onSpeak={speakNow}
        footer={footer}
      />
    </ActivitySpread>
  );
}
