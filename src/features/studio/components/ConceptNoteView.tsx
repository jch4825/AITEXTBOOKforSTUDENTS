import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import { wrapDictionaryTerms } from '../../../views/lessonTextUtils';
import ConceptNotes from './ConceptNotes';
import EditorialStudioFrame from './EditorialStudioFrame';
import type { StudioDefinition, SupportLevel, VisualNovelStory } from '../types';

interface Props {
  definition: StudioDefinition;
  story: VisualNovelStory;
  supportLevel: SupportLevel;
  accent: string;
  secondary: string;
  dictionaryTerms: string[];
}

/**
 * 정리 노트 화면 (05-ENGINE-SPEC §5).
 *
 * 개념 카드를 이야기 옆에 늘 띄워 두면 이야기를 읽기도 전에 답이 보인다.
 * 그래서 포맷 A~E에서는 첫 시도를 남긴 **뒤에** 이 화면으로 개념을 순차 제시한다.
 */
export default function ConceptNoteView({
  definition,
  story,
  supportLevel,
  accent,
  secondary,
  dictionaryTerms,
}: Props) {
  const { speakNow } = useSpeak();

  const left = (
    <section className="visual-novel-knowledge-page" aria-label="오늘의 개념 정리">
      <div className="visual-novel-page-heading">
        <p className="studio-kicker" style={{ color: accent }}>정리 노트</p>
        <div className="flex items-center justify-between gap-3 w-full">
          <h2>오늘의 개념 정리</h2>
          <button
            type="button"
            onClick={() => speakNow(`오늘의 개념 정리. 학습 목표: ${story.objective}`)}
            className="h-8 w-8 rounded-full border flex items-center justify-center cursor-pointer transition-all hover:scale-110 shrink-0 depth-paper bg-white"
            style={{ borderColor: accent, color: accent }}
            title="학습목표 듣기"
          >
            <Icon name="speaker" size={16} />
          </button>
        </div>
      </div>
      <div className="visual-novel-goal">
        <strong>학습목표</strong>
        <p>{wrapDictionaryTerms(story.objective, dictionaryTerms)}</p>
      </div>
      <p className="mt-4 text-sm font-semibold leading-relaxed text-[color:var(--muted)]">
        방금 남긴 내 생각과 아래 개념을 견주어 봅니다. 생각이 달랐다면 무엇이 달랐는지 살펴봅니다.
      </p>
    </section>
  );

  const right = (
    <section className="visual-novel-knowledge-page" aria-label="개념 카드">
      <h3>오늘 배우는 개념</h3>
      <ConceptNotes
        knowledge={story.knowledge}
        supportLevel={supportLevel}
        accent={accent}
        dictionaryTerms={dictionaryTerms}
      />
    </section>
  );

  return (
    <EditorialStudioFrame
      definition={definition}
      stage="first-attempt"
      viewLabel="정리 노트"
      accent={accent}
      secondary={secondary}
      left={left}
      right={right}
    />
  );
}
