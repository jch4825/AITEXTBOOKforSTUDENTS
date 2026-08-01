import SpeakerDialogue from './SpeakerDialogue';
import type { StudioChoice, StudioExpression } from '../types';

interface Props {
  choices: StudioChoice[];
  expression: StudioExpression | undefined;
  accent: string;
  dictionaryTerms: string[];
}

/**
 * 선택 직후의 반응 컷 (05-ENGINE-SPEC §3, 01-FORMATS '반응 컷 규칙').
 *
 * 오답이어도 벌점이나 잠금이 없다. 인물이 결과를 한 줄 연기하고, 학생은 그대로
 * 다른 선택지를 눌러 볼 수 있다. 반응은 화면에만 뜨고 기록에는 남기지 않는다 —
 * evidence에 저장되는 것은 지금까지처럼 최종 선택뿐이다.
 */
export default function ChoiceReactionPanel({
  choices,
  expression,
  accent,
  dictionaryTerms,
}: Props) {
  const picked = choices.filter(
    (choice) => choice.reaction && expression?.choiceIds?.includes(choice.id),
  );
  if (picked.length === 0) return null;

  // isCorrect를 아예 두지 않은 열린 선택지는 맞고 틀림을 따지지 않는다.
  const retryable = picked.some((choice) => choice.isCorrect === false);

  return (
    <section
      className="studio-choice-reaction rounded-2xl border-2 border-dashed p-4"
      style={{ borderColor: accent, background: 'var(--editorial-paper)' }}
      aria-live="polite"
    >
      <p className="studio-kicker mb-2" style={{ color: accent }}>그때 무슨 일이 일어났을까요</p>
      <div className="space-y-2.5">
        {picked.map((choice) => (
          <div key={choice.id}>
            <SpeakerDialogue
              text={choice.reaction as string}
              dictionaryTerms={dictionaryTerms}
              tone="light"
            />
          </div>
        ))}
      </div>
      {retryable ? (
        <p className="mt-3 text-sm font-bold" style={{ color: 'var(--muted)' }}>
          다른 선택지를 눌러 결과를 더 살펴봐도 좋아요.
        </p>
      ) : null}
    </section>
  );
}
