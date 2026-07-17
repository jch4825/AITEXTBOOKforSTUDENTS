import type { CSSProperties, ReactNode } from 'react';
import LessonSpread from '../../../components/lesson/LessonSpread';
import type { StudioDefinition, StudioStage } from '../types';

interface Props {
  definition: StudioDefinition;
  stage: StudioStage;
  accent: string;
  secondary: string;
  left: ReactNode;
  right: ReactNode;
}

export const STAGE_LABELS: Record<StudioStage, string> = {
  encounter: '상황 만나기',
  'first-attempt': '첫 생각',
  'condition-change': '조건이 달라졌습니다',
  'ai-compare': 'AI의 다른 관점',
  decision: '내가 판단하기',
  artifact: '생각을 결과물로',
  transfer: '다른 상황에 적용하기',
  complete: '과정 돌아보기',
};

export default function EditorialStudioFrame({
  definition,
  stage,
  accent,
  secondary,
  left,
  right,
}: Props) {
  return (
    <article
      className="mx-auto w-full max-w-[1220px] space-y-4"
      style={{ '--accent': accent, '--studio-secondary': secondary } as CSSProperties}
    >
      <header className="flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <p className="studio-kicker" style={{ color: secondary }}>{STAGE_LABELS[stage]}</p>
          <h1 className="text-2xl font-extrabold leading-tight md:text-3xl" style={{ color: accent }}>
            {definition.title}
          </h1>
          <p className="mt-1 text-base text-[color:var(--muted)]">{definition.subtitle}</p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-sm font-bold"
          style={{ color: accent, background: 'var(--editorial-quiet)' }}
        >
          핵심 경험 스튜디오
        </span>
      </header>

      <LessonSpread
        left={left}
        right={right}
        label={`${definition.title} · ${STAGE_LABELS[stage]}`}
        accent={accent}
        className="studio-editorial"
      />
    </article>
  );
}
