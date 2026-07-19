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
import type { ExpressionMode, StudioEvidenceV2, StudioExpression } from './types';

interface Props {
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
  if (!value) return '표현 기록 없음';
  const definition = getStudioDefinition(record.lessonId);
  const choices = field === 'transferExpression' ? definition?.transfer.choices : definition?.firstAttempt.choices;
  if (value.mode === 'choice' || value.mode === 'aac') {
    const labels = value.choiceIds
      ?.map((id) => choices?.find((choice) => choice.id === id)?.label)
      .filter((label): label is string => Boolean(label));
    return labels?.join(' / ') || '카드로 표현함';
  }
  if (value.mode === 'draw') return '그림으로 표현함';
  return value.text || '말이나 글로 표현함';
}

export default function ModuleCloseLessonView({ definition, onGoHome, onPickLesson }: Props) {
  const { markCompleted } = useProgress();
  const theme = themeFor(definition.moduleId);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [nextMethod, setNextMethod] = useState<StudioExpression>();
  const evidence = useMemo(
    () => loadStudioEvidence().filter((record) => definition.studioLessonIds.includes(record.lessonId)),
    [definition.studioLessonIds],
  );

  function toggleCriterion(criterion: string) {
    setSelectedCriteria((current) => current.includes(criterion)
      ? current.filter((item) => item !== criterion)
      : [...current, criterion]);
  }

  function finish() {
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

          <section className="studio-editorial p-6">
            <h2 className="text-xl font-extrabold">나의 세 경험</h2>
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
                      </dl>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="studio-editorial p-6">
            <h2 className="text-xl font-extrabold">내가 잘한 과정</h2>
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
            <h2 className="mb-4 text-xl font-extrabold">다음에 써 볼 방법</h2>
            <StudioExpressionInput
              value={nextMethod}
              choices={definition.nextChoices}
              modes={NEXT_MODES}
              prompt="다른 문제가 생기면 어떤 방법을 다시 써 보겠습니까?"
              accent={theme.accent}
              onChange={setNextMethod}
            />
          </section>
        </main>
      </ScreentoneBackdrop>
    </MicroLessonFrame>
  );
}
