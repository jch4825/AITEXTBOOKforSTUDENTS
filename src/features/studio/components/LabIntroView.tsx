import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import EditorialStudioFrame from './EditorialStudioFrame';
import MiniGameSlot from '../minigames/MiniGameSlot';
import type { StudioDefinition, SupportLevel } from '../types';

interface Props {
  definition: StudioDefinition;
  supportLevel: SupportLevel;
  accent: string;
  secondary: string;
}

const INTRO_GUIDE =
  '점수를 재는 자리가 아닙니다. 무엇을 바꾸면 결과가 달라지는지 눈에 담아 두세요. 이야기는 다음 화면에서 이어집니다.';

/**
 * 포맷 B의 도입 실험 (05-ENGINE-SPEC §1-B).
 *
 * 말보다 조작을 먼저 겪게 하려고, 마무리 보상이던 미니게임을 이야기 앞으로 당겨 온다.
 * 도입은 관찰용 `intro` 세션으로, 마무리는 `complete` 세션으로 전달한다.
 * 마무리 슬롯은 변형 조건·목표·역할을 안내해 처음 본 판을 그대로 반복하지 않게 한다.
 */
export default function LabIntroView({ definition, supportLevel, accent, secondary }: Props) {
  const { speakNow } = useSpeak();

  const fallback = (
    <div
      className="flex h-full items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center"
      style={{ borderColor: 'var(--editorial-line)', background: 'var(--editorial-paper)' }}
    >
      <p className="text-sm font-bold" style={{ color: 'var(--muted)' }}>
        이 차시는 이야기부터 시작합니다. 다음으로 넘어가세요.
      </p>
    </div>
  );

  const left = (
    <MiniGameSlot lessonId={definition.lessonId} supportLevel={supportLevel} phase="intro" fallback={fallback} />
  );

  const right = (
    <div className="space-y-5 p-5 md:p-7">
      <div>
        <p className="studio-kicker" style={{ color: accent }}>먼저 겪어 보기</p>
        <div className="flex items-center justify-between gap-3">
          <h2 className="mt-1 text-xl font-extrabold" style={{ color: 'var(--brand-ink)' }}>
            설명을 듣기 전에 직접 해 봅니다
          </h2>
          <button
            type="button"
            onClick={() => speakNow(`먼저 겪어 보기. ${INTRO_GUIDE}`)}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-white depth-paper transition-all hover:scale-110"
            style={{ borderColor: accent, color: accent }}
            title="안내 듣기"
          >
            <Icon name="speaker" size={16} />
          </button>
        </div>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-[color:var(--brand-ink)]">
          {INTRO_GUIDE}
        </p>
      </div>

      <div
        className="rounded-2xl border border-dashed p-4"
        style={{ borderColor: 'var(--editorial-line)', background: 'var(--editorial-paper)' }}
      >
        <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--muted)' }}>
          잘 안 되어도 괜찮습니다. 여기서 겪은 일이 다음 이야기의 재료가 됩니다.
        </p>
      </div>
    </div>
  );

  return (
    <EditorialStudioFrame
      definition={definition}
      stage="encounter"
      viewLabel="먼저 겪어 보기"
      accent={accent}
      secondary={secondary}
      left={left}
      right={right}
    />
  );
}
