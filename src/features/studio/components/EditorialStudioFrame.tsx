import type { CSSProperties, ReactNode } from 'react';
import LessonSpread from '../../../components/lesson/LessonSpread';
import type { StudioDefinition, StudioStage } from '../types';

interface Props {
  definition: StudioDefinition;
  stage: StudioStage;
  accent: string;
  secondary: string;
  left: ReactNode;
  /** 비우면 왼쪽 면이 지면 전체를 쓴다. */
  right?: ReactNode;
  /** 한 단계에 화면이 여럿일 때 쓸 이름. 없으면 단계 이름을 쓴다. */
  viewLabel?: string;
}

export const STAGE_LABELS: Record<StudioStage, string> = {
  encounter: '상황 만나기',
  'first-attempt': '첫 생각',
  'condition-change': '조건이 달라졌습니다',
  'ai-compare': 'AI의 제안과 내 판단',
  decision: '실시간 AI 아이미와 대화하기',
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
  viewLabel,
}: Props) {
  const label = viewLabel ?? STAGE_LABELS[stage];
  return (
    <article
      className="mx-auto w-full max-w-[min(96vw,110rem)] 2xl:max-w-[min(94vw,148rem)] 3xl:max-w-[min(92vw,175rem)] space-y-4"
      style={{ '--accent': accent, '--studio-secondary': secondary } as CSSProperties}
    >
      <header className="flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <p className="studio-kicker" style={{ color: secondary }}>{label}</p>
          <h1 className="text-2xl font-extrabold leading-tight md:text-3xl" style={{ color: accent }}>
            {definition.title}
          </h1>
          <p className="mt-1 text-base text-[color:var(--muted)]">{definition.subtitle}</p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-sm font-bold"
          style={{ color: accent, background: 'var(--editorial-quiet)' }}
        >
          생생한 이야기로 만나기
        </span>
      </header>

      <LessonSpread
        left={left}
        right={right}
        label={`${definition.title} · ${label}`}
        accent={accent}
        className="studio-editorial"
      />
    </article>
  );
}
