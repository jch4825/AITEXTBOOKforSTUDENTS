import React, { useState } from 'react';
import Icon from '../../../components/Icon';
import MicButton from '../../../components/MicButton';
import { useSpeak } from '../../../hooks/useSpeak';
import type { HardLessonContent, LessonContent } from '../../../types';
import AiDecisionPanel from './AiDecisionPanel';
import EditorialStudioFrame from './EditorialStudioFrame';
import PreparedStimulusPanel from './PreparedStimulusPanel';
import StudioExplanationPanel from './StudioExplanationPanel';
import StudioExpressionInput from './StudioExpressionInput';
import VisualNovelExperience from './VisualNovelExperience';
import LiveGeminiInteraction from '../../../components/LiveGeminiInteraction';
import InquiryCertificateModal from './InquiryCertificateModal';
import CompletionAwardModal from './CompletionAwardModal';
import { getScopedChoices } from '../studioChoiceUtils';
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

function renderExpressionDetail(
  expression: StudioExpression | undefined,
  choices: StudioChoice[],
  accent: string
) {
  if (!expression) return <span className="text-[color:var(--muted)] font-medium">아직 표현을 남기지 않았습니다.</span>;

  if (expression.mode === 'draw' && expression.drawing) {
    return (
      <div className="space-y-1.5 mt-1">
        <span className="text-xs font-bold text-emerald-800 block">🎨 칠판에 그린 나만의 표현:</span>
        <img
          src={expression.drawing}
          alt="학생이 그린 그림"
          className="max-h-36 max-w-full rounded-xl border-2 border-emerald-400 bg-[#064E3B] object-contain p-1.5 shadow-sm"
        />
      </div>
    );
  }

  if (expression.mode === 'choice' || expression.mode === 'aac') {
    const selectedChoices = choices.filter((c) => expression.choiceIds?.includes(c.id));
    if (selectedChoices.length > 0) {
      return (
        <div className="space-y-1 mt-1">
          {selectedChoices.map((c) => (
            <div key={c.id} className="flex items-start gap-2 font-extrabold text-sm text-slate-800">
              <span className="text-xl shrink-0 leading-none">{c.emoji}</span>
              <span className="leading-tight">{c.label}</span>
            </div>
          ))}
        </div>
      );
    }
  }

  if (expression.text && expression.text.trim()) {
    return <p className="font-extrabold text-sm text-slate-800 leading-relaxed mt-1">“{expression.text.trim()}”</p>;
  }

  return <span className="text-[color:var(--muted)] font-medium">선택으로 생각을 표현했습니다.</span>;
}

function getChoiceSummaryText(expression: StudioExpression | undefined, choices: StudioChoice[]): string {
  if (!expression) return '';
  if (expression.text?.trim()) return expression.text.trim();
  if (expression.choiceIds?.length) {
    const selected = choices.filter((c) => expression.choiceIds?.includes(c.id));
    return selected.map((c) => c.label).join(' / ');
  }
  return '';
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
  const [studentName, setStudentName] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const allDictTerms = STUDENT_DICTIONARY.flatMap((entry) => [
    entry.term,
    ...(entry.aliases ?? []),
  ]);
  const profile = definition.supportProfiles[state.supportLevel];
  const firstChoices = getScopedChoices(definition.firstAttempt.choices, profile.choiceLimit);
  const transferChoices = getScopedChoices(definition.transfer.choices, profile.choiceLimit);
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
  const contextStimuli = state.stage === 'complete'
    ? undefined
    : state.stage === 'transfer'
      ? definition.transfer.stimuli
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
    right = (
      <div className="p-5 md:p-7">
        <AiDecisionPanel
          lessonId={definition.lessonId}
          role={definition.aiContribution.role}
          text={definition.aiContribution.text}
          question={definition.aiContribution.question}
          finalExpression={state.finalExpression}
          accent={accent}
          onExpression={(value) => dispatch({ type: 'set-final-expression', value })}
        />
      </div>
    );
  } else if (state.stage === 'decision') {
    right = (
      <div className="space-y-4 p-5 md:p-7">
        <div>
          <span className="studio-kicker" style={{ color: accent }}>5단계 · 실시간 AI 체험</span>
          <h2 className="text-xl font-extrabold">실시간 AI 아이미와 직접 이야기해요</h2>
          <p className="mt-1 text-sm text-[color:var(--muted)] font-medium">
            인공지능(Gemini)에게 궁금한 점을 물어보고, 음성이나 사진/파일을 전달하며 답변을 탐구해 봐요.
          </p>
        </div>
        <LiveGeminiInteraction
          lessonId={definition.lessonId}
          accent={accent}
          promptHint="학습한 내용을 바탕으로 AI 아이미에게 질문하고 함께 탐구해 보세요!"
          suggestedQuestions={
            definition.lessonId === 'm1-l1'
              ? ['AI는 어떤 일들을 할 수 있니?', 'AI와 일반 프로그램은 어떻게 달라?', '번역기 앱도 AI 기능이야?']
              : undefined
          }
        />
      </div>
    );
  } else if (state.stage === 'artifact') {
    const suggestion = isMeaningfulStudioExpression(state.finalExpression)
      ? getChoiceSummaryText(state.finalExpression, definition.firstAttempt.choices)
      : null;
    right = (
      <div className="space-y-5 p-5 md:p-7">
        <div>
          <p className="studio-kicker" style={{ color: secondary }}>탐구 기록 남기기</p>
          <h2 className="mt-1 text-xl font-extrabold">이번 차시의 탐구 기록을 완성해요</h2>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">{definition.artifact.prompt}</p>
        </div>
        <div className="studio-artifact-sheet space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="block text-base font-extrabold text-[color:var(--ink-1)]" htmlFor="studio-artifact-summary">
              탐구 기록으로 남길 내용
            </label>
            <MicButton
              accent={accent}
              onResult={(speechText) => {
                const current = state.artifactSummary ?? '';
                const updated = current ? `${current} ${speechText}` : speechText;
                dispatch({ type: 'set-artifact', value: updated });
              }}
            />
          </div>
          <textarea
            id="studio-artifact-summary"
            value={state.artifactSummary ?? ''}
            onChange={(event) => dispatch({ type: 'set-artifact', value: event.target.value })}
            placeholder="탐구 기록으로 남길 내용을 자유롭게 적어 보세요."
            maxLength={600}
            rows={8}
            className="w-full min-h-[14rem] resize-y rounded-2xl border-2 p-4 text-base font-semibold leading-relaxed shadow-2xs"
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

          {/* 탐구 증서 인쇄 영역 */}
          <div className="pt-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/70 shadow-2xs">
              <div className="flex items-center gap-2 flex-1">
                <label htmlFor="student-certificate-name" className="text-sm font-extrabold text-amber-900 shrink-0">
                  👤 학생 이름 (선택):
                </label>
                <input
                  id="student-certificate-name"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="이름을 적으면 탐구 증서에 인쇄돼요"
                  className="flex-1 min-w-0 h-10 px-3.5 rounded-xl border border-amber-300 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="h-10 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0 hover:scale-102 active:scale-98"
              >
                <span>🏆</span> 탐구 증서로 인쇄하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (state.stage === 'transfer') {
    right = (
      <div className="p-5 md:p-7">
        <StudioExpressionInput
          value={state.transferExpression}
          choices={transferChoices}
          modes={definition.firstAttempt.modes}
          prompt="나만의 표현으로 도서관의 인공지능 추천 기계를 친구에게 설명해보자."
          accent={accent}
          onChange={(value) => dispatch({ type: 'set-transfer', value })}
        />
      </div>
    );
  } else {
    right = (
      <div className="space-y-5 p-5 md:p-7">
        <div>
          <p className="studio-kicker" style={{ color: accent }}>나의 학습 성찰 기록</p>
          <h2 className="mt-1 text-xl font-extrabold">오늘 차시에서 내가 한 생각과 탐구 기록을 한눈에 돌아봐요</h2>
        </div>
        <dl className="grid gap-3">
          <div className="studio-fact-card p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <dt className="font-extrabold text-sm" style={{ color: accent }}>1. 처음 내 생각 (P02)</dt>
            <dd>{renderExpressionDetail(state.firstAttempt, definition.firstAttempt.choices, accent)}</dd>
          </div>
          <div className="studio-fact-card p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <dt className="font-extrabold text-sm" style={{ color: accent }}>2. 실시간 AI 아이미와 대화 & 내 판단 (P04-P05)</dt>
            <dd>{renderExpressionDetail(state.finalExpression, definition.firstAttempt.choices, accent)}</dd>
          </div>
          <div className="studio-fact-card p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <dt className="font-extrabold text-sm" style={{ color: accent }}>3. 나의 탐구 성찰 기록 (P06)</dt>
            <dd>
              {state.artifactSummary && state.artifactSummary.trim() ? (
                <p className="font-extrabold text-sm text-slate-800 whitespace-pre-wrap leading-relaxed mt-1">
                  “{state.artifactSummary.trim()}”
                </p>
              ) : (
                <span className="text-[color:var(--muted)] font-medium">아직 탐구 성찰 기록을 작성하지 않았습니다.</span>
              )}
            </dd>
          </div>
          <div className="studio-fact-card p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <dt className="font-extrabold text-sm" style={{ color: accent }}>4. 새로운 도서관 AI 추천 기계 적용 (P07)</dt>
            <dd>{renderExpressionDetail(state.transferExpression, definition.transfer.choices, accent)}</dd>
          </div>
        </dl>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAwardModal(true)}
            className="w-full h-12 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-base rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 active:scale-98"
          >
            <span>👑</span> 나의 차시 학습 완료 상장 보기 및 인쇄하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <EditorialStudioFrame
        definition={definition}
        stage={state.stage}
        accent={accent}
        secondary={secondary}
        left={left}
        right={right}
      />
      <InquiryCertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        studentName={studentName}
        lessonTitle={definition.title}
        inquiryText={state.artifactSummary ?? ''}
      />
      <CompletionAwardModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        defaultName={studentName}
        lessonTitle={definition.title}
        inquirySummary={state.artifactSummary}
      />
    </>
  );
}
