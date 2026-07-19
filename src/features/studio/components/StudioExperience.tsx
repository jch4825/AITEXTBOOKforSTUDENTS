import { useState } from 'react';
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
import type { AiDecision, StudioAction, StudioChoice, StudioDefinition, StudioExpression, StudioSessionState } from '../types';

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
  if (!isMeaningfulStudioExpression(expression)) return '내가 물어보고 싶은 말을 여기에 써보세요.';
  if (expression.mode === 'choice' || expression.mode === 'aac') {
    const labels = expression.choiceIds
      ?.map((id) => choices.find((choice) => choice.id === id)?.label)
      .filter((label): label is string => Boolean(label));
    return labels?.join(' / ') || '내가 물어보고 싶은 말을 여기에 써보세요.';
  }
  if (expression.mode === 'draw') return '그림으로 생각을 표현했습니다.';
  return expression.text?.trim() || '내가 물어보고 싶은 말을 여기에 써보세요.';
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
  const [hintOpen, setHintOpen] = useState(false);
  const { speakNow } = useSpeak();
  const profile = definition.supportProfiles[state.supportLevel];
  const firstChoices = profile.choiceLimit
    ? definition.firstAttempt.choices.slice(0, profile.choiceLimit)
    : definition.firstAttempt.choices;
  const changedFacts = definition.conditionChange.facts;
  const showingChangedContext = ['condition-change', 'ai-compare', 'decision', 'artifact', 'complete'].includes(state.stage);
  const contextDescription = state.stage === 'transfer'
    ? definition.transfer.description
    : showingChangedContext
      ? definition.conditionChange.description
      : definition.encounter.description;
  const contextFacts = state.stage === 'transfer'
    ? []
    : showingChangedContext
      ? changedFacts
      : definition.encounter.facts;
  const contextStimuli = state.stage === 'transfer' || state.stage === 'complete'
    ? undefined
    : showingChangedContext
      ? definition.conditionChange.stimuli
      : definition.encounter.stimuli;

  function toggleHint() {
    if (!hintOpen) dispatch({ type: 'record-support-mode', value: 'hint' });
    setHintOpen((value) => !value);
  }

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

  const left = (
    <div
      className="p-5 md:p-7 rounded-2xl flex flex-col justify-between h-full bg-no-repeat bg-cover bg-bottom-right"
      style={{
        backgroundImage: definition.lessonId === 'm1-l1'
          ? `url(${import.meta.env.BASE_URL}lessons/webtoon/m1-l1.webp)`
          : 'none',
        minHeight: definition.lessonId === 'm1-l1' ? '600px' : 'auto',
      }}
    >
      <div className="space-y-5">
        <div>
          <p className="studio-kicker text-lg font-extrabold" style={{ color: secondary }}>생활 장면</p>
          <h2 className="mt-1 text-3xl font-extrabold" style={{ color: 'var(--brand-ink)' }}>
            {state.stage === 'transfer' ? definition.transfer.title : definition.encounter.title}
          </h2>
          <p className="mt-4 leading-relaxed text-xl font-extrabold text-[color:var(--brand-ink)]">{contextDescription}</p>
        </div>

        {contextStimuli?.length ? (
          <PreparedStimulusPanel stimuli={contextStimuli} accent={accent} />
        ) : null}

        {contextFacts.length > 0 && (
          <ul className="space-y-3" aria-label="상황의 중요한 정보">
            {contextFacts.map((fact, index) => (
              <li
                key={fact}
                className="studio-fact-card flex items-start gap-4 p-4 rounded-xl border backdrop-blur-xs"
                style={{
                  borderColor: 'var(--editorial-line)',
                  background: 'rgba(255, 255, 255, 0.85)',
                }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-white"
                  style={{ background: index % 2 === 0 ? accent : secondary }}
                  aria-hidden
                >
                  {index + 1}
                </span>
                <span className="font-extrabold leading-relaxed text-xl text-[color:var(--brand-ink)]">{fact}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-5">
        {definition.safetyNote && (
          <p className="studio-margin-note text-xs leading-relaxed mb-3">
            <strong>안전 약속:</strong> {definition.safetyNote}
          </p>
        )}
      </div>
    </div>
  );

  let right;
  if (state.stage === 'encounter') {
    right = (
      <div className="space-y-6 p-5 md:p-7">
        <div>
          <p className="studio-kicker" style={{ color: accent }}>먼저 장면을 살펴봅니다</p>
          <h2 className="mt-1 text-xl font-extrabold">아직 방법을 배우기 전입니다</h2>
          <p className="mt-3 leading-relaxed">다음 화면에서 지금 떠오르는 첫 생각을 표현합니다. 지원 수준은 위의 네비게이션에서 조절할 수 있습니다.</p>
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
    const spokenText = [definition.aiContribution.role, definition.aiContribution.text, definition.aiContribution.question]
      .filter(Boolean)
      .join('. ');
    right = (
      <div className="space-y-5 p-5 md:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="studio-kicker" style={{ color: accent }}>AI에게 물어보는 방법</p>
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
        {definition.aiContribution.question && (
          <p className="font-bold leading-relaxed" style={{ color: accent }}>{definition.aiContribution.question}</p>
        )}
        {definition.lessonId === 'm1-l1' && (
          <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'var(--editorial-line)', background: 'var(--editorial-paper)' }}>
            <p className="text-xs font-bold text-[color:var(--muted)] mb-2">💡 쉽게 물어보는 방법 예시</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm" style={{ color: 'var(--ink-1)' }}>
              <li>“토스터가 뭐하는 물건인지 누구나 이해하기 쉽게 설명해 줘.”</li>
              <li>“토스터의 뜻을 어려운 과학 단어 없이 간단하게 말해 줘.”</li>
              <li>“토스터가 하는 일을 한 문장으로 짧게 알려 줘.”</li>
              <li>“빵을 굽는 토스터에 대해 쉬운 말로 설명해 줄래?”</li>
            </ul>
            <div className="mt-4 flex justify-center">
              <img
                src="/AITEXTBOOKforSTUDENTS/lessons/toaster.png"
                alt="귀여운 토스터 캐릭터"
                className="max-h-72 w-auto rounded-xl border object-contain shadow-sm"
                style={{ borderColor: 'var(--editorial-line)' }}
              />
            </div>
          </div>
        )}
      </div>
    );
  } else if (state.stage === 'decision') {
    if (definition.lessonId === 'm1-l1') {
      right = (
        <div className="space-y-5 p-5 md:p-7">
          {/* 상단 시나리오 요약 */}
          <div className="rounded-2xl border p-4 bg-[color:var(--editorial-paper)]" style={{ borderColor: 'var(--editorial-line)' }}>
            <p className="studio-kicker text-xs font-bold" style={{ color: secondary }}>아이미와의 대화 결과</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-1)]">
              진우가 <strong>“토스터는 뭐하는 거야? 쉽게 말해줘.”</strong>라고 다시 물었습니다.
              그러자 아이미는 <strong>“식빵을 맛있고 바삭하게 구워 주는 기계입니다.”</strong>라고 알맞게 설명해 주었습니다.
              진우는 마침내 토스터가 무엇인지 알게 되었습니다.
            </p>
          </div>

          {/* 에어컨 질문 문제 상황 */}
          <div>
            <p className="studio-kicker" style={{ color: secondary }}>생각하고 고르기</p>
            <h2 className="mt-1 text-xl font-extrabold">에어컨이 하는 일 질문하기</h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
              진우는 이번엔 <strong>에어컨</strong>이 하는 일을 알고 싶어합니다. 아이미에게 어떻게 물어보면 알아듣기 쉽게 답변해 줄까요?
            </p>
          </div>

          {/* 지원 수준별 분기 */}
          {state.supportLevel === 'full' && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-[color:var(--muted)]">💡 아래의 그림 카드를 눌러 질문을 완성해 보십시오.</p>
              
              {/* AAC 카드 목록 */}
              <div className="flex flex-wrap justify-center gap-5">
                {[
                  { id: 'aircon', label: '에어컨', img: 'aircon.webp' },
                  { id: 'cool', label: '시원하게', img: 'cool_clothes.webp' },
                  { id: 'easy', label: '쉽게 설명하기', img: 'easy_explain.webp' }
                ].map((card) => {
                  const selectedIds = state.finalExpression?.choiceIds ?? [];
                  const isSelected = selectedIds.includes(card.id);
                  function toggleCard() {
                    const nextIds = isSelected 
                      ? selectedIds.filter(id => id !== card.id)
                      : [...selectedIds, card.id];
                    speakNow(card.label);
                    dispatch({
                      type: 'set-final-expression',
                      value: { mode: 'aac', choiceIds: nextIds }
                    });
                    if (state.aiDecision !== 'accept') {
                      dispatch({ type: 'set-ai-decision', value: 'accept' });
                    }
                  }
                  return (
                    <button
                      type="button"
                      key={card.id}
                      onClick={toggleCard}
                      className="card3d flex flex-col items-center p-4 rounded-2xl border-2 text-center cursor-pointer transition-all hover:scale-105"
                      style={{
                        borderColor: isSelected ? accent : 'var(--editorial-line)',
                        background: isSelected ? 'var(--editorial-paper)' : 'white',
                        width: '144px',
                      }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}lessons/pecs/${card.img}`}
                        alt={card.label}
                        className="h-28 w-28 object-contain mb-2 rounded-lg"
                      />
                      <span className="text-sm font-extrabold text-[color:var(--ink-1)] leading-tight">{card.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 완성된 질문 보기 */}
              {state.finalExpression?.choiceIds && state.finalExpression.choiceIds.length > 0 && (
                <div className="p-3 rounded-xl border border-dashed flex items-center justify-between" style={{ borderColor: accent, background: 'var(--editorial-paper)' }}>
                  <p className="text-sm font-bold text-[color:var(--ink-1)]">
                    완성된 질문: “
                    {state.finalExpression.choiceIds.map(id => {
                      if (id === 'aircon') return '에어컨';
                      if (id === 'cool') return '시원하게';
                      if (id === 'easy') return '쉽게 설명해줘';
                      return '';
                    }).join(' ')}
                    ”
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const text = state.finalExpression?.choiceIds?.map(id => {
                        if (id === 'aircon') return '에어컨';
                        if (id === 'cool') return '시원하게';
                        if (id === 'easy') return '쉽게 설명해줘';
                        return '';
                      }).join(' ') ?? '';
                      speakNow(text);
                    }}
                    className="h-8 w-8 rounded-full border flex items-center justify-center animate-pulse"
                    style={{ borderColor: accent, color: accent }}
                  >
                    <Icon name="speaker" size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {state.supportLevel === 'light' && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-[color:var(--muted)]">💡 알맞은 질문 문장을 선택해 보십시오.</p>
              {[
                { id: 'light-easy', label: '“에어컨은 어떻게 시원하게 해 주는지 쉬운 단어로 말해줘.”', isCorrect: true, emoji: '💬' },
                { id: 'light-hard', label: '“에어컨 열역학 기화 사이클의 냉각 효율 메커니즘을 상세히 기술하라.”', isCorrect: false, emoji: '🙋' },
                { id: 'light-vague', label: '“에어컨에 대해 말해.”', isCorrect: false, emoji: '🤖' }
              ].map((opt) => {
                const selected = state.finalExpression?.choiceIds?.includes(opt.id) ?? false;
                function selectOption() {
                  speakNow(opt.label);
                  dispatch({
                    type: 'set-final-expression',
                    value: { mode: 'choice', choiceIds: [opt.id] }
                  });
                  if (state.aiDecision !== 'accept') {
                    dispatch({ type: 'set-ai-decision', value: 'accept' });
                  }
                }
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={selectOption}
                    className="card3d w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left font-bold cursor-pointer"
                    style={{
                      borderColor: selected ? accent : 'var(--editorial-line)',
                      background: selected ? 'var(--editorial-paper)' : 'white',
                    }}
                  >
                    <span className="text-2xl shrink-0">{opt.emoji}</span>
                    <span className="text-sm text-[color:var(--ink-1)] leading-snug">{opt.label}</span>
                    {selected && <Icon name="check" size={18} color={accent} className="ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {state.supportLevel === 'challenge' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-dashed flex items-center gap-2" style={{ borderColor: 'var(--editorial-line)', background: 'var(--editorial-paper)' }}>
                <span className="text-sm font-bold text-[color:var(--muted)]">📢 단어 힌트:</span>
                <span className="text-sm font-semibold text-[color:var(--ink-1)]">시원하다, 기계, 에어컨</span>
              </div>
              <textarea
                value={state.finalExpression?.text ?? ''}
                onChange={(event) => {
                  dispatch({
                    type: 'set-final-expression',
                    value: { mode: 'text', text: event.target.value }
                  });
                  if (state.aiDecision !== 'accept') {
                    dispatch({ type: 'set-ai-decision', value: 'accept' });
                  }
                }}
                placeholder="에어컨이 하는 일을 어떻게 물어볼지 적어 보십시오."
                maxLength={300}
                rows={4}
                className="w-full resize-y rounded-xl border-2 p-3 text-sm leading-relaxed"
                style={{ borderColor: accent, background: 'white' }}
              />
            </div>
          )}
        </div>
      );
    } else {
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
    }
  } else if (state.stage === 'artifact') {
    const suggestion = isMeaningfulStudioExpression(state.finalExpression)
      ? expressionSummary(state.finalExpression, definition.firstAttempt.choices)
      : null;
    right = (
      <div className="space-y-5 p-5 md:p-7">
        <div>
          <p className="studio-kicker" style={{ color: secondary }}>{definition.artifact.title}</p>
          <h2 className="mt-1 text-xl font-extrabold">내가 물어보고 싶은 말을 한 번 써봅니다.</h2>
          <p className="mt-2 leading-relaxed text-sm text-[color:var(--muted)]">{definition.artifact.prompt}</p>
        </div>
        <div className="studio-artifact-sheet">
          <label className="block font-bold text-sm text-[color:var(--ink-1)]" htmlFor="studio-artifact-summary">카드에 담길 최종 내용</label>
          <textarea
            id="studio-artifact-summary"
            value={state.artifactSummary ?? ''}
            onChange={(event) => dispatch({ type: 'set-artifact', value: event.target.value })}
            placeholder="내가 물어보고 싶은 말을 여기에 써보세요."
            maxLength={300}
            rows={4}
            className="mt-2 w-full resize-y rounded-xl border-2 p-3 text-sm leading-relaxed"
            style={{ borderColor: accent, background: 'var(--editorial-paper)' }}
          />
          {!state.artifactSummary?.trim() && suggestion && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'set-artifact', value: suggestion })}
              className="mt-3 rounded-full border-2 px-4 py-2 text-sm font-bold cursor-pointer transition-all hover:scale-105"
              style={{ borderColor: accent, color: accent }}
            >
              내가 고른 카드로 채우기
            </button>
          )}
        </div>
      </div>
    );
  } else if (state.stage === 'transfer') {
    if (definition.lessonId === 'm1-l1') {
      const selectedId = state.transferExpression?.choiceIds?.[0];
      const textValue = state.transferExpression?.text ?? '';
      right = (
        <div className="space-y-5 p-5 md:p-7">
          <div>
            <p className="studio-kicker" style={{ color: secondary }}>배운 내용 정리하기</p>
            <h2 className="mt-1 text-xl font-extrabold">인공지능은 무엇일까요?</h2>
            <p className="mt-3 text-lg font-extrabold leading-relaxed text-[color:var(--ink-1)]">
              오늘 배운 인공지능(AI)의 뜻을 생각하며, 아래 질문에 알맞은 답을 골라보세요.
            </p>
          </div>

          {state.supportLevel === 'full' && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-[color:var(--muted)]">💡 아래 그림 카드에서 '인공지능'을 나타내는 알맞은 카드를 골라 보세요.</p>
              
              <div className="flex flex-wrap justify-center gap-5">
                {[
                  { id: 'ai-definition-correct', label: '인공지능', img: 'ai_aimi.webp' },
                  { id: 'ai-definition-toaster', label: '토스터', img: 'toaster.webp' },
                  { id: 'ai-definition-aircon', label: '에어컨', img: 'aircon.webp' }
                ].map((card) => {
                  const isSelected = selectedId === card.id;
                  function selectCard() {
                    speakNow(card.label);
                    dispatch({
                      type: 'set-transfer',
                      value: { mode: 'aac', choiceIds: [card.id] }
                    });
                  }
                  return (
                    <button
                      type="button"
                      key={card.id}
                      onClick={selectCard}
                      className="card3d flex flex-col items-center p-4 rounded-2xl border-2 text-center cursor-pointer transition-all hover:scale-105"
                      style={{
                        borderColor: isSelected ? accent : 'var(--editorial-line)',
                        background: isSelected ? 'var(--editorial-paper)' : 'white',
                        width: '144px',
                      }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}lessons/pecs/${card.img}`}
                        alt={card.label}
                        className="h-28 w-28 object-contain mb-2 rounded-lg"
                      />
                      <span className="text-sm font-extrabold text-[color:var(--ink-1)] leading-tight">{card.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedId && (
                <div className="p-4 rounded-xl border leading-relaxed text-sm font-semibold"
                     style={{
                       borderColor: selectedId === 'ai-definition-correct' ? '#32cd32' : 'var(--editorial-line)',
                       background: selectedId === 'ai-definition-correct' ? '#f0fff0' : 'var(--paper-1)'
                     }}>
                  {selectedId === 'ai-definition-correct' ? (
                    <p style={{ color: '#008000' }}>🎉 정답입니다! 인공지능은 사람처럼 공부하고 대답을 해 주는 똑똑한 프로그램이에요.</p>
                  ) : selectedId === 'ai-definition-toaster' ? (
                    <p style={{ color: 'var(--muted)' }}>💡 토스터는 맛있는 식빵을 굽는 기계예요. 사람처럼 대답해 주는 프로그램은 무엇일까요?</p>
                  ) : (
                    <p style={{ color: 'var(--muted)' }}>💡 에어컨은 시원한 바람을 내보내는 기계예요. 사람처럼 대답해 주는 프로그램은 무엇일까요?</p>
                  )}
                </div>
              )}
            </div>
          )}

          {state.supportLevel === 'light' && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-[color:var(--muted)]">💡 인공지능의 뜻으로 가장 알맞은 설명을 선택해 보세요.</p>
              
              <div className="space-y-3">
                {[
                  { id: 'ai-definition-correct', label: '“사람처럼 배우고 대답해 주는 똑똑한 컴퓨터 프로그램”', emoji: '🤖' },
                  { id: 'ai-definition-toaster', label: '“식빵을 맛있고 바삭하게 구워 주는 토스터 기계”', emoji: '🍞' },
                  { id: 'ai-definition-aircon', label: '“바람을 불어 방 안을 시원하게 해 주는 에어컨 기계”', emoji: '❄️' }
                ].map((opt) => {
                  const isSelected = selectedId === opt.id;
                  function selectOption() {
                    speakNow(opt.label);
                    dispatch({
                      type: 'set-transfer',
                      value: { mode: 'choice', choiceIds: [opt.id] }
                    });
                  }
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={selectOption}
                      className="card3d w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left font-bold cursor-pointer"
                      style={{
                        borderColor: isSelected ? accent : 'var(--editorial-line)',
                        background: isSelected ? 'var(--editorial-paper)' : 'white',
                      }}
                    >
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <span className="text-sm text-[color:var(--ink-1)] leading-snug">{opt.label}</span>
                      {isSelected && <Icon name="check" size={18} color={accent} className="ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {selectedId && (
                <div className="p-4 rounded-xl border leading-relaxed text-sm font-semibold"
                     style={{
                       borderColor: selectedId === 'ai-definition-correct' ? '#32cd32' : 'var(--editorial-line)',
                       background: selectedId === 'ai-definition-correct' ? '#f0fff0' : 'var(--paper-1)'
                     }}>
                  {selectedId === 'ai-definition-correct' ? (
                    <p style={{ color: '#008000' }}>🎉 정답입니다! 인공지능은 사람처럼 공부하고 대답을 해 주는 똑똑한 프로그램이에요.</p>
                  ) : (
                    <p style={{ color: 'var(--muted)' }}>💡 아쉽습니다. 골라주신 것은 일반 기계예요. 사람처럼 대답해 주는 것은 무엇일까요?</p>
                  )}
                </div>
              )}
            </div>
          )}

          {state.supportLevel === 'challenge' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl border border-dashed flex items-center gap-2" style={{ borderColor: 'var(--editorial-line)', background: 'var(--editorial-paper)' }}>
                <span className="text-sm font-bold text-[color:var(--muted)]">📢 단어 힌트:</span>
                <span className="text-sm font-semibold text-[color:var(--ink-1)]">사람, 컴퓨터, 대답</span>
              </div>
              <textarea
                value={textValue}
                onChange={(event) => {
                  dispatch({
                    type: 'set-transfer',
                    value: { mode: 'text', text: event.target.value }
                  });
                }}
                placeholder="인공지능(AI)은 무엇인지 내 생각을 쉬운 단어로 적어 보세요."
                maxLength={300}
                rows={4}
                className="w-full resize-y rounded-xl border-2 p-3 text-sm leading-relaxed"
                style={{ borderColor: accent, background: 'white' }}
              />
            </div>
          )}
        </div>
      );
    } else {
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
    }
  } else {
    if (definition.lessonId === 'm1-l1') {
      right = (
        <div className="space-y-5 p-5 md:p-7">
          <div>
            <p className="studio-kicker" style={{ color: secondary }}>오늘의 학습 정리</p>
            <h2 className="mt-1 text-xl font-extrabold">인공지능 친구와 대화하는 법</h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
              인공지능에게 질문을 하고 도움을 받을 때 꼭 기억해야 하는 세 가지 방법입니다.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { num: '1', title: '쉽게 물어보기', desc: '인공지능에게 질문할 때는 복잡하고 어려운 과학 단어 대신 누구나 알 수 있는 쉬운 단어를 사용해 보세요.' },
              { num: '2', title: '구체적으로 말하기', desc: '내가 진짜 알고 싶은 것(예: 토스터나 에어컨이 하는 일)을 콕 집어서 자세하게 이야기해 보세요.' },
              { num: '3', title: '한 번 더 물어보기', desc: '인공지능의 설명이 잘 이해되지 않거나 어려울 때는 “더 쉽게 말해줘”라고 다시 물어보세요.' }
            ].map((item) => (
              <div key={item.num} className="studio-fact-card p-4 rounded-xl border border-dashed flex gap-3 bg-[color:var(--editorial-paper)]" style={{ borderColor: 'var(--editorial-line)' }}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white" style={{ background: accent }}>
                  {item.num}
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-[color:var(--ink-1)]">{item.title}</h3>
                  <p className="mt-1 text-xs text-[color:var(--muted)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border text-center text-sm font-bold bg-[#f0fff0]" style={{ borderColor: '#32cd32', color: '#008000' }}>
            🎉 참 잘했습니다! 인공지능과 지혜롭게 대화하는 방법을 모두 배웠습니다.
          </div>
        </div>
      );
    } else {
      right = (
        <div className="space-y-5 p-5 md:p-7">
          <div>
            <p className="studio-kicker" style={{ color: accent }}>나의 학습 과정</p>
            <h2 className="mt-1 text-xl font-extrabold">처음부터 새 상황까지 돌아봅니다</h2>
          </div>
          <dl className="grid gap-3">
            <div className="studio-fact-card"><dt className="font-bold" style={{ color: accent }}>처음에는</dt><dd>{expressionSummary(state.firstAttempt, definition.firstAttempt.choices)}</dd></div>
            <div className="studio-fact-card"><dt className="font-bold" style={{ color: accent }}>AI 의견을 보고</dt><dd>{state.aiDecision ? AI_DECISION_SUMMARY[state.aiDecision] : '내 판단을 살펴봤습니다.'}</dd></div>
            <div className="studio-fact-card"><dt className="font-bold" style={{ color: accent }}>나는 이렇게 판단했습니다</dt><dd>{expressionSummary(state.finalExpression, definition.firstAttempt.choices)}</dd></div>
            <div className="studio-fact-card"><dt className="font-bold" style={{ color: accent }}>다른 상황에서는</dt><dd>{expressionSummary(state.transferExpression, definition.transfer.choices)}</dd></div>
          </dl>
          <p className="studio-margin-note">선택을 바꾸지 않았더라도 달라진 정보를 살펴보고 이유 있게 판단했다면 좋은 과정입니다.</p>
        </div>
      );
    }
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
