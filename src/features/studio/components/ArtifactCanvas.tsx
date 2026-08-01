import Icon from '../../../components/Icon';
import { STUDIO_STAGES } from '../studioReducer';
import { isMeaningfulStudioExpression } from '../studioCompletion';
import type { StudioDefinition, StudioSessionState, StudioStage } from '../types';

interface Props {
  definition: StudioDefinition;
  state: StudioSessionState;
  accent: string;
}

interface CanvasSlot {
  stage: StudioStage;
  label: string;
  filled: boolean;
}

function stageReached(current: StudioStage, target: StudioStage): boolean {
  return STUDIO_STAGES.indexOf(current) >= STUDIO_STAGES.indexOf(target);
}

/**
 * 포맷 E의 진행형 캔버스 (05-ENGINE-SPEC §1-E).
 *
 * 오늘 만들 결과물의 빈 틀을 첫 화면부터 띄워 두고, 단계를 지날 때마다 해당 칸이 채워진다.
 * 새 데이터 모델을 만들지 않는다 — 이미 세션에 있는 값을 그대로 비춘 것뿐이라
 * artifact 스키마도 기록 스키마도 그대로다.
 *
 * 지면 오른쪽은 학생이 실제로 입력하는 자리라, 캔버스는 참고 면인 왼쪽에 고정한다.
 */
export default function ArtifactCanvas({ definition, state, accent }: Props) {
  const slots: CanvasSlot[] = [
    {
      stage: 'first-attempt',
      label: '첫 생각',
      filled: isMeaningfulStudioExpression(state.firstAttempt),
    },
    {
      stage: 'condition-change',
      label: '달라진 조건 확인',
      filled: stageReached(state.stage, 'ai-compare'),
    },
    {
      stage: 'decision',
      label: 'AI 제안에 대한 내 판단',
      filled: Boolean(state.aiDecision),
    },
    {
      stage: 'artifact',
      label: '기록으로 남길 내용',
      filled: Boolean(state.artifactSummary?.trim()),
    },
    {
      stage: 'transfer',
      label: '새 상황에 적용',
      filled: isMeaningfulStudioExpression(state.transferExpression),
    },
  ];

  const filledCount = slots.filter((slot) => slot.filled).length;

  return (
    <section
      className="rounded-2xl border-2 p-4"
      style={{ borderColor: accent, background: 'var(--editorial-paper)' }}
      aria-label="오늘 만들 결과물"
    >
      <p className="studio-kicker" style={{ color: accent }}>오늘 만들 것</p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <h3 className="text-base font-extrabold" style={{ color: 'var(--brand-ink)' }}>
          {definition.artifact.title}
        </h3>
        <span className="shrink-0 text-xs font-black" style={{ color: accent }}>
          {filledCount} / {slots.length}
        </span>
      </div>

      <ul className="mt-3 space-y-1.5">
        {slots.map((slot) => (
          <li
            key={slot.label}
            className="flex items-center gap-2.5 rounded-lg border border-dashed px-2.5 py-2"
            style={{
              borderColor: slot.filled ? accent : 'var(--editorial-line)',
              background: slot.filled ? 'white' : 'transparent',
            }}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: slot.filled ? accent : 'var(--editorial-line)' }}
              aria-hidden
            >
              {slot.filled ? <Icon name="check" size={13} /> : null}
            </span>
            <span
              className="text-sm font-bold leading-snug"
              style={{ color: slot.filled ? 'var(--brand-ink)' : 'var(--muted)' }}
            >
              {slot.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
