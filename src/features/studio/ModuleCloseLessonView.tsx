import { useMemo, useState } from 'react';
import MicroLessonFrame from '../../components/MicroLessonFrame';
import ScreentoneBackdrop from '../../components/lesson/ScreentoneBackdrop';
import { useProgress } from '../../context/ProgressContext';
import type { ModulePortfolioDefinition } from '../../data/modulePortfolios/types';
import { getStudioDefinition } from '../../data/studios';
import type { LessonId } from '../../types';
import { themeFor } from '../../utils/moduleThemes';
import StudioExpressionInput from './components/StudioExpressionInput';
import { loadStudioEvidence } from './evidenceStorage';
import { formatPersistedStudioExpression, isMeaningfulStudioExpression } from './studioCompletion';
import type { ExpressionMode, StudioEvidenceV2, StudioExpression } from './types';

interface Props {
  key?: string;
  definition: ModulePortfolioDefinition;
  onGoHome: () => void;
  onPickLesson: (id: LessonId) => void;
}

const CRITERIA = [
  '상황의 중요한 정보를 찾았습니다.',
  '내 방법을 먼저 시도했습니다.',
  'AI 의견을 비교하고 판단했습니다.',
  '조건이 달라졌을 때 방법을 조정했습니다.',
];

const NEXT_MODES: ExpressionMode[] = ['choice', 'text', 'speech'];

function expressionText(record: StudioEvidenceV2, field: 'firstAttempt' | 'finalExpression' | 'transferExpression'): string {
  const value = record[field];
  const definition = getStudioDefinition(record.lessonId);
  const choices = field === 'transferExpression' ? definition?.transfer.choices : definition?.firstAttempt.choices;
  return formatPersistedStudioExpression(value, choices) ?? '표현 기록 없음';
}

export default function ModuleCloseLessonView({ definition, onGoHome, onPickLesson }: Props) {
  const { markCompleted } = useProgress();
  const theme = themeFor(definition.moduleId);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);
  const [guideCopy, setGuideCopy] = useState<Record<string, string>>({});
  const [nextMethod, setNextMethod] = useState<StudioExpression>();
  const [completionMessage, setCompletionMessage] = useState('');
  const evidence = useMemo(
    () => loadStudioEvidence().filter((record) => definition.studioLessonIds.includes(record.lessonId)),
    [definition.studioLessonIds],
  );

  function toggleCriterion(criterion: string) {
    setSelectedCriteria((current) => current.includes(criterion)
      ? current.filter((item) => item !== criterion)
      : [...current, criterion]);
  }

  function toggleArtifact(lessonId: string) {
    setSelectedArtifacts((current) => current.includes(lessonId)
      ? current.filter((item) => item !== lessonId)
      : [...current, lessonId]);
  }

  function finish() {
    const missingArtifacts = Boolean(
      definition.artifactChoices?.length && selectedArtifacts.length < 3,
    );
    const missingGuideSection = Boolean(
      definition.guideSections?.some((section) => !guideCopy[section.id]?.trim()),
    );
    if (
      missingArtifacts
      || missingGuideSection
      || selectedCriteria.length < 1
      || !isMeaningfulStudioExpression(nextMethod)
    ) {
      setCompletionMessage(
        definition.completionRequirement
          ?? '탐구 기록 3개, 설명서 세 칸, 잘한 과정 1개, 새 상황의 방법을 모두 남기면 마칠 수 있어요.',
      );
      return;
    }
    markCompleted(definition.lessonId);
    onGoHome();
  }

  return (
    <MicroLessonFrame
      lessonId={definition.lessonId}
      pageKey="module-close"
      crumb={definition.crumb}
      totalSteps={1}
      currentStep={0}
      onPrev={() => undefined}
      onNext={finish}
      onGoHome={onGoHome}
      onPickLesson={onPickLesson}
    >
      <ScreentoneBackdrop moduleId={definition.moduleId}>
        <main className="mx-auto max-w-6xl space-y-6 py-2">
          <header className="studio-editorial p-6 md:p-8">
            <p className="studio-kicker" style={{ color: theme.secondary }}>{definition.kicker}</p>
            <h1 className="mt-1 text-3xl font-extrabold" style={{ color: theme.accent }}>{definition.title}</h1>
            <p className="mt-3 leading-relaxed">{definition.description}</p>
          </header>

          {definition.closingStory?.length ? (
            <section className="studio-editorial p-6">
              <p className="studio-kicker" style={{ color: theme.secondary }}>마지막 이야기</p>
              <h2 className="mt-1 text-xl font-extrabold">
                {definition.storyHeading ?? '아이미를 처음 쓰는 친구에게'}
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {definition.closingStory.map((scene) => (
                  <article key={scene.id} className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--editorial-line)' }}>
                    {scene.imageSrc ? (
                      <img src={scene.imageSrc} alt={scene.alt} className="aspect-[4/3] w-full object-cover" />
                    ) : (
                      <div
                        className="flex aspect-[4/3] items-center justify-center bg-[color:var(--paper-1)]"
                        role="img"
                        aria-label={`${scene.alt}. 새 장면 이미지를 넣을 자리입니다.`}
                        data-image-slot="pending"
                      >
                        <span className="rounded-full border border-dashed px-4 py-2 text-sm font-bold text-[color:var(--muted)]">
                          장면 이미지 자리
                        </span>
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-xs font-black" style={{ color: theme.accent }}>{scene.label}</p>
                      <p className="mt-2 text-sm font-semibold leading-relaxed">{scene.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {definition.artifactChoices?.length ? (
            <section className="studio-editorial p-6">
              <p className="studio-kicker" style={{ color: theme.secondary }}>1단계 · 탐구 기록 고르기</p>
              <h2 className="mt-1 text-xl font-extrabold">
                {definition.artifactHeading ?? '설명서에 넣을 기록을 3개 이상 골라요'}
              </h2>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                {definition.artifactDescription
                  ?? '경험형 차시뿐 아니라 1차시부터 10차시까지 만든 모든 기록을 사용할 수 있어요.'}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {definition.artifactChoices.map((choice) => {
                  const selected = selectedArtifacts.includes(choice.lessonId);
                  return (
                    <button
                      type="button"
                      key={choice.lessonId}
                      aria-pressed={selected}
                      onClick={() => toggleArtifact(choice.lessonId)}
                      className="min-h-24 rounded-2xl border-2 p-4 text-left transition-transform hover:-translate-y-0.5"
                      style={{
                        borderColor: selected ? theme.accent : 'var(--editorial-line)',
                        background: selected ? theme.accentSoft : 'var(--editorial-paper)',
                      }}
                    >
                      <span className="block text-xs font-black" style={{ color: theme.accent }}>
                        {choice.lessonId.split('-l')[1]}차시
                      </span>
                      <strong className="mt-1 block">{choice.artifact}</strong>
                      <span className="mt-1 block text-xs text-[color:var(--muted)]">{choice.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm font-bold" aria-live="polite" style={{ color: theme.accent }}>
                선택한 탐구 기록: {selectedArtifacts.length}개
              </p>
            </section>
          ) : null}

          <section className="studio-editorial p-6">
            <h2 className="text-xl font-extrabold">저장된 경험형 과정 기록</h2>
            {evidence.length === 0 ? (
              <p className="studio-margin-note mt-4">이 기기에는 과정기록이 없습니다. 활동을 하지 않았다는 뜻은 아닙니다.</p>
            ) : (
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                {evidence.map((record) => {
                  const definition = getStudioDefinition(record.lessonId);
                  return (
                    <article key={record.id} className="studio-artifact-sheet">
                      <p className="studio-kicker" style={{ color: theme.accent }}>{definition?.title ?? record.lessonId}</p>
                      <dl className="mt-3 space-y-3 text-sm">
                        <div><dt className="font-bold">처음에는</dt><dd>{expressionText(record, 'firstAttempt')}</dd></div>
                        <div><dt className="font-bold">AI와 비교한 뒤</dt><dd>{expressionText(record, 'finalExpression')}</dd></div>
                        <div><dt className="font-bold">새 상황에서는</dt><dd>{expressionText(record, 'transferExpression')}</dd></div>
                        {record.artifactSummary?.trim() && (
                          <div><dt className="font-bold">결과물</dt><dd>{record.artifactSummary}</dd></div>
                        )}
                      </dl>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {definition.guideSections?.length ? (
            <section className="studio-editorial p-6">
              <p className="studio-kicker" style={{ color: theme.secondary }}>2단계 · 설명서 작성하기</p>
              <h2 className="mt-1 text-xl font-extrabold">
                {definition.guideHeading ?? '아이미를 사용할 때 기억할 세 가지'}
              </h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                {definition.guideSections.map((section, index) => (
                  <label key={section.id} className="studio-artifact-sheet block">
                    <span
                      className="mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white"
                      style={{ background: index % 2 === 0 ? theme.accent : theme.secondary }}
                    >
                      {index + 1}
                    </span>
                    <strong className="block">{section.title}</strong>
                    <span className="mt-1 block text-sm leading-relaxed text-[color:var(--muted)]">{section.prompt}</span>
                    <textarea
                      value={guideCopy[section.id] ?? ''}
                      onChange={(event) => setGuideCopy((current) => ({
                        ...current,
                        [section.id]: event.target.value,
                      }))}
                      placeholder={section.placeholder}
                      rows={5}
                      maxLength={400}
                      className="mt-3 w-full resize-y rounded-xl border-2 p-3 leading-relaxed"
                      style={{ borderColor: 'var(--editorial-line)', background: 'var(--editorial-paper)' }}
                    />
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-5 rounded-full border-2 px-5 py-2.5 font-bold"
                style={{ borderColor: theme.accent, color: theme.accent, background: 'var(--editorial-paper)' }}
              >
                {definition.printLabel ?? '아이미 사용 설명서 인쇄하기'}
              </button>
            </section>
          ) : null}

          <section className="studio-editorial p-6">
            <h2 className="text-xl font-extrabold">3단계 · 내가 잘한 과정</h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">하나 이상 골라 보십시오.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {CRITERIA.map((criterion) => {
                const selected = selectedCriteria.includes(criterion);
                return (
                  <button
                    type="button"
                    key={criterion}
                    aria-pressed={selected}
                    onClick={() => toggleCriterion(criterion)}
                    className="min-h-16 rounded-xl border-2 p-3 text-left font-bold"
                    style={{
                      borderColor: selected ? theme.accent : 'var(--editorial-line)',
                      background: selected ? theme.accentSoft : 'var(--editorial-paper)',
                    }}
                  >
                    {criterion}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="studio-editorial p-6">
            <h2 className="mb-4 text-xl font-extrabold">4단계 · 새 상황에서 써 볼 방법</h2>
            <StudioExpressionInput
              value={nextMethod}
              choices={definition.nextChoices}
              modes={NEXT_MODES}
              prompt={definition.transferPrompt ?? '다른 문제가 생기면 어떤 방법을 다시 써 보겠습니까?'}
              accent={theme.accent}
              onChange={setNextMethod}
            />
            {completionMessage ? (
              <p
                className="mt-4 rounded-xl border-2 p-4 text-sm font-bold"
                style={{ borderColor: theme.accent, color: theme.accent, background: theme.accentSoft }}
                role="alert"
              >
                {completionMessage}
              </p>
            ) : null}
          </section>
        </main>
      </ScreentoneBackdrop>
    </MicroLessonFrame>
  );
}
