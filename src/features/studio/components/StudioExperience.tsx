import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import type { HardLessonContent, LessonContent } from '../../../types';
import AiDecisionPanel from './AiDecisionPanel';
import EditorialStudioFrame from './EditorialStudioFrame';
import PreparedStimulusPanel from './PreparedStimulusPanel';
import StudioExplanationPanel from './StudioExplanationPanel';
import StudioExpressionInput from './StudioExpressionInput';
import VisualNovelExperience from './VisualNovelExperience';
import { isMeaningfulStudioExpression } from '../studioCompletion';
import { wrapDictionaryTerms } from '../../../views/lessonTextUtils';
import { STUDENT_DICTIONARY } from '../../../data/studentDictionary';
import type {
  AiDecision,
  StudioAction,
  StudioChoice,
  StudioDefinition,
  StudioExpression,
  StudioSessionState,
} from '../types';

interface Props {
  definition: StudioDefinition;
  lesson: LessonContent;
  hard?: HardLessonContent;
  state: StudioSessionState;
  dispatch: (action: StudioAction) => void;
  accent: string;
  secondary: string;
  sceneIndex: number;
  onSceneIndexChange: (index: number) => void;
}

const AI_DECISION_SUMMARY: Record<AiDecision, string> = {
  accept: 'AI 의견을 받아들였습니다.',
  modify: 'AI 의견을 내 생각에 맞게 고쳤습니다.',
  reject: 'AI 의견을 사용하지 않고 내 방법을 선택했습니다.',
};

function expressionSummary(expression: StudioExpression | undefined, choices: StudioChoice[]): string {
  if (!isMeaningfulStudioExpression(expression)) return '아직 표현을 남기지 않았습니다.';
  if (expression.mode === 'choice' || expression.mode === 'aac') {
    const labels = expression.choiceIds
      ?.map((id) => choices.find((choice) => choice.id === id)?.label)
      .filter((label): label is string => Boolean(label));
    return labels?.join(' / ') || '선택으로 생각을 표현했습니다.';
  }
  if (expression.mode === 'draw') return '그림으로 생각을 표현했습니다.';
  return expression.text?.trim() || '아직 표현을 남기지 않았습니다.';
}

export default function StudioExperience({
  definition,
  lesson,
  hard,
  state,
  dispatch,
  accent,
  secondary,
  sceneIndex,
  onSceneIndexChange,
}: Props) {
  const { speakNow } = useSpeak();
  const allDictTerms = STUDENT_DICTIONARY.flatMap((entry) => [
    entry.term,
    ...(entry.aliases ?? []),
  ]);
  const profile = definition.supportProfiles[state.supportLevel];
  const firstChoices = profile.choiceLimit
    ? definition.firstAttempt.choices.slice(0, profile.choiceLimit)
    : definition.firstAttempt.choices;
  const showingChangedContext = ['condition-change', 'ai-compare', 'decision', 'artifact', 'complete'].includes(state.stage);
  const contextDescription = state.stage === 'transfer'
    ? definition.transfer.description
    : showingChangedContext
      ? definition.conditionChange.description
      : definition.encounter.description;
  const contextFacts = state.stage === 'transfer'
    ? []
    : showingChangedContext
      ? definition.conditionChange.facts
      : definition.encounter.facts;
  const contextStimuli = state.stage === 'transfer' || state.stage === 'complete'
    ? undefined
    : showingChangedContext
      ? definition.conditionChange.stimuli
      : definition.encounter.stimuli;

  if (state.stage === 'encounter' && definition.visualNovel) {
    return (
      <VisualNovelExperience
        definition={definition}
        story={definition.visualNovel}
        supportLevel={state.supportLevel}
        accent={accent}
        secondary={secondary}
        onSupportMode={(value) => dispatch({ type: 'record-support-mode', value })}
        sceneIndex={sceneIndex}
        onSceneIndexChange={onSceneIndexChange}
      />
    );
  }

  const contextTitle = state.stage === 'transfer'
    ? definition.transfer.title
    : definition.encounter.title;

  const left = (
    <div className="flex h-full flex-col justify-between rounded-2xl p-5 md:p-7">
      <div className="space-y-5">
        <div>
          <p className="studio-kicker" style={{ color: secondary }}>
            {state.stage === 'transfer' ? '새 상황에 적용하기' : '생활 속 이야기'}
          </p>
          <div className="flex items-center justify-between gap-3">
            <h2 className="mt-1 text-xl font-extrabold" style={{ color: 'var(--brand-ink)' }}>
              {contextTitle}
            </h2>
            <button
              type="button"
              onClick={() => speakNow(`${contextTitle}. ${contextDescription}`)}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border shadow-xs transition-all hover:scale-110"
              style={{ borderColor: accent, color: accent, background: 'rgba(255, 255, 255, 0.9)' }}
              title="설명 듣기"
            >
              <Icon name="speaker" size={16} />
            </button>
          </div>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-[color:var(--brand-ink)]">
            {contextDescription}
          </p>
        </div>

        {contextStimuli?.length ? (
          <PreparedStimulusPanel stimuli={contextStimuli} accent={accent} />
        ) : null}

        {contextFacts.length > 0 ? (
          <ul className="space-y-2" aria-label="상황의 중요한 정보">
            {contextFacts.map((fact, index) => (
              <li
                key={fact}
                className="studio-fact-card flex items-start justify-between gap-3 rounded-xl border border-dashed bg-[color:var(--editorial-paper)]/50 p-2.5"
                style={{ borderColor: 'var(--editorial-line)' }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                    style={{ background: index % 2 === 0 ? accent : secondary }}
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold leading-relaxed text-[color:var(--brand-ink)]">
                    {wrapDictionaryTerms(fact, allDictTerms)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => speakNow(fact)}
                  className="mt-0.5 ml-2 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-white shadow-xs transition-all hover:scale-110"
                  style={{ borderColor: accent, color: accent }}
                  title="내용 듣기"
                >
                  <Icon name="speaker" size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {state.supportLevel !== 'full' && definition.safetyNote ? (
        <div
          className="studio-margin-note mt-5 flex items-center justify-between gap-2 rounded-lg border border-dashed bg-white p-3 text-xs leading-relaxed"
          style={{ borderColor: 'var(--editorial-line)' }}
        >
          <span><strong>안전 약속:</strong> {definition.safetyNote}</span>
          <button
            type="button"
            onClick={() => speakNow(`안전 약속. ${definition.safetyNote}`)}
            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-white transition-all hover:scale-110"
            style={{ borderColor: accent, color: accent }}
            title="안전 약속 듣기"
          >
            <Icon name="speaker" size={12} />
          </button>
        </div>
      ) : null}
    </div>
  );

  let right;
  if (state.stage === 'encounter') {
    right = (
      <div className="space-y-6 p-5 md:p-7">
        <div>
          <p className="studio-kicker" style={{ color: accent }}>먼저 장면을 살펴봅니다</p>
          <h2 className="mt-1 text-xl font-extrabold">아직 방법을 배우기 전입니다</h2>
          <p className="mt-3 leading-relaxed">
            다음 화면에서 지금 떠오르는 첫 생각을 표현합니다. 지원 수준은 위의 네비게이션에서 조절할 수 있습니다.
          </p>
        </div>
      </div>
    );
  } else if (state.stage === 'first-attempt') {
    right = (
      <div className="space-y-5 p-5 md:p-7">
        <StudioExpressionInput
          value={state.firstAttempt}
          choices={firstChoices}
          modes={definition.firstAttempt.modes}
          prompt={definition.firstAttempt.prompt}
          accent={accent}
          onChange={(value) => dispatch({ type: 'set-first-attempt', value })}
        />
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[color:var(--muted)]">
            {definition.firstAttempt.reasonPrompt} · 선택 사항
          </span>
          <input
            value={state.reason ?? ''}
            onChange={(event) => dispatch({ type: 'set-reason', value: event.target.value })}
            maxLength={300}
            placeholder="작성해 보세요."
            className="min-h-12 w-full rounded-xl border-2 px-4"
            style={{ borderColor: 'var(--editorial-line)', background: 'var(--editorial-paper)' }}
          />
        </label>
      </div>
    );
  } else if (state.stage === 'condition-change') {
    right = (
      <div className="p-5 md:p-7">
        <p className="studio-kicker" style={{ color: secondary }}>생각 넓히기</p>
        <h2 className="mt-1 text-xl font-extrabold">새로운 사실을 알게 된 지금, 내 생각은 어떤가요?</h2>
        <StudioExplanationPanel
          lesson={lesson}
          hard={hard}
          supportLevel={state.supportLevel}
          accent={accent}
          onOpened={(value) => dispatch({ type: 'record-support-mode', value })}
        />
      </div>
    );
  } else if (state.stage === 'ai-compare') {
    const spokenText = [
      definition.aiContribution.role,
      definition.aiContribution.text,
      definition.aiContribution.question,
    ].filter(Boolean).join('. ');
    right = (
      <div className="space-y-5 p-5 md:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="studio-kicker" style={{ color: accent }}>AI의 제안과 비교하기</p>
            <h2 className="mt-1 text-xl font-extrabold">{definition.aiContribution.role}</h2>
          </div>
          <button
            type="button"
            onClick={() => speakNow(spokenText)}
            aria-label="AI 의견 읽어주기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2"
            style={{ borderColor: accent, color: accent, background: 'var(--editorial-paper)' }}
          >
            <Icon name="speaker" size={20} />
          </button>
        </div>
        <blockquote className="studio-margin-note text-lg font-semibold leading-relaxed">
          {definition.aiContribution.text}
        </blockquote>
        {definition.aiContribution.question ? (
          <p className="font-bold leading-relaxed" style={{ color: accent }}>
            {definition.aiContribution.question}
          </p>
        ) : null}
      </div>
    );
  } else if (state.stage === 'decision') {
    right = (
      <div className="p-5 md:p-7">
        <AiDecisionPanel
          role={definition.aiContribution.role}
          text={definition.aiContribution.text}
          question={definition.aiContribution.question}
          decision={state.aiDecision}
          finalExpression={state.finalExpression}
          choices={definition.firstAttempt.choices}
          modes={definition.firstAttempt.modes}
          accent={accent}
          onDecision={(value) => dispatch({ type: 'set-ai-decision', value })}
          onExpression={(value) => dispatch({ type: 'set-final-expression', value })}
        />
      </div>
    );
  } else if (state.stage === 'artifact') {
    const suggestion = isMeaningfulStudioExpression(state.finalExpression)
      ? expressionSummary(state.finalExpression, definition.firstAttempt.choices)
      : null;
    right = (
      <div className="space-y-5 p-5 md:p-7">
        <div>
          <p className="studio-kicker" style={{ color: secondary }}>{definition.artifact.title}</p>
          <h2 className="mt-1 text-xl font-extrabold">이번 차시의 탐구 기록을 완성해요</h2>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">{definition.artifact.prompt}</p>
        </div>
        <div className="studio-artifact-sheet">
          <label className="block text-sm font-bold text-[color:var(--ink-1)]" htmlFor="studio-artifact-summary">
            {definition.artifact.title}에 남길 내용
          </label>
          <textarea
            id="studio-artifact-summary"
            value={state.artifactSummary ?? ''}
            onChange={(event) => dispatch({ type: 'set-artifact', value: event.target.value })}
            placeholder={definition.artifact.prompt}
            maxLength={300}
            rows={4}
            className="mt-2 w-full resize-y rounded-xl border-2 p-3 text-sm leading-relaxed"
            style={{ borderColor: accent, background: 'var(--editorial-paper)' }}
          />
          {!state.artifactSummary?.trim() && suggestion && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'set-artifact', value: suggestion })}
              className="mt-3 cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-bold transition-all hover:scale-105"
              style={{ borderColor: accent, color: accent }}
            >
              앞에서 표현한 내용으로 시작하기
            </button>
          )}
        </div>
      </div>
    );
  } else if (state.stage === 'transfer') {
    right = (
      <div className="p-5 md:p-7">
        <StudioExpressionInput
          value={state.transferExpression}
          choices={definition.transfer.choices}
          modes={definition.firstAttempt.modes}
          prompt="이 장면에서는 어떤 방법을 써 보겠습니까?"
          accent={accent}
          onChange={(value) => dispatch({ type: 'set-transfer', value })}
        />
      </div>
    );
  } else {
    right = (
      <div className="space-y-5 p-5 md:p-7">
        <div>
          <p className="studio-kicker" style={{ color: accent }}>나의 학습 과정</p>
          <h2 className="mt-1 text-xl font-extrabold">처음 생각부터 새 상황까지 돌아봅니다</h2>
        </div>
        <dl className="grid gap-3">
          <div className="studio-fact-card">
            <dt className="font-bold" style={{ color: accent }}>처음에는</dt>
            <dd>{expressionSummary(state.firstAttempt, definition.firstAttempt.choices)}</dd>
          </div>
          <div className="studio-fact-card">
            <dt className="font-bold" style={{ color: accent }}>AI 의견을 보고</dt>
            <dd>{state.aiDecision ? AI_DECISION_SUMMARY[state.aiDecision] : '내 판단을 살펴봤습니다.'}</dd>
          </div>
          <div className="studio-fact-card">
            <dt className="font-bold" style={{ color: accent }}>나는 이렇게 판단했습니다</dt>
            <dd>{expressionSummary(state.finalExpression, definition.firstAttempt.choices)}</dd>
          </div>
          <div className="studio-fact-card">
            <dt className="font-bold" style={{ color: accent }}>다른 상황에서는</dt>
            <dd>{expressionSummary(state.transferExpression, definition.transfer.choices)}</dd>
          </div>
          <div className="studio-fact-card">
            <dt className="font-bold" style={{ color: accent }}>{definition.artifact.title}</dt>
            <dd>{state.artifactSummary?.trim() || '탐구 기록을 완성했습니다.'}</dd>
          </div>
        </dl>
        <p className="studio-margin-note">
          선택을 바꾸지 않았더라도 달라진 정보를 살펴보고 이유 있게 판단했다면 좋은 과정입니다.
        </p>
      </div>
    );
  }

  return (
    <EditorialStudioFrame
      definition={definition}
      stage={state.stage}
      accent={accent}
      secondary={secondary}
      left={left}
      right={right}
    />
  );
}
