import Button from '../../components/Button';
import Icon from '../../components/Icon';
import type { LessonId } from '../../types';
import type { SupportBridgeDefinition } from '../../data/supportBridges/m5';

interface Props {
  bridge: SupportBridgeDefinition;
  accent: string;
  onPickLesson: (id: LessonId) => void;
}

export default function SupportLessonBridge({ bridge, accent, onPickLesson }: Props) {
  return (
    <aside className="mb-5 grid gap-3 md:grid-cols-2" aria-label="핵심 경험과 이번 연습의 연결">
      <section className="rounded-xl border border-[color:var(--editorial-line)] bg-[color:var(--editorial-quiet)] p-4">
        <p className="studio-kicker" style={{ color: accent }}>지난 경험</p>
        <p className="mt-2 text-sm font-semibold leading-relaxed">{bridge.recallPrompt}</p>
        <Button
          variant="ghost"
          accent={accent}
          onClick={() => onPickLesson(bridge.recallLessonId)}
          className="mt-3"
        >
          <Icon name="chevron-left" size={18} /> 지난 경험 다시 보기
        </Button>
      </section>
      <section className="rounded-xl border border-[color:var(--editorial-line)] bg-[color:var(--editorial-paper)] p-4">
        <p className="studio-kicker" style={{ color: accent }}>이번 연습과 다음 경험</p>
        <p className="mt-2 text-sm font-semibold leading-relaxed">{bridge.practicePurpose}</p>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">{bridge.nextPreview}</p>
        <Button
          variant="ghost"
          accent={accent}
          onClick={() => onPickLesson(bridge.nextStudioLessonId)}
          className="mt-3"
        >
          다음 경험 미리 보기 <Icon name="chevron-right" size={18} />
        </Button>
      </section>
    </aside>
  );
}
