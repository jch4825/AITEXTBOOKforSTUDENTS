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
  /** 특정 지면의 레이아웃 계약을 좁게 적용할 때 쓰는 클래스. */
  spreadClassName?: string;
  /** 지면과 제목을 같은 읽기 폭으로 묶을 때 쓰는 프레임 클래스. */
  frameClassName?: string;
  /**
   * 좁은 창에서 두 면이 위아래로 쌓일 때 오른쪽(조작) 면을 먼저 놓는다.
   * 왼쪽이 앞 단계에서 이미 읽은 상황의 반복일 때만 쓴다. 세로 태블릿에서 반복되는 상황
   * 1,000px을 지나야 판단 단추가 나왔다.
   */
  taskFirstWhenStacked?: boolean;
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
  spreadClassName,
  frameClassName,
  taskFirstWhenStacked,
}: Props) {
  const label = viewLabel ?? STAGE_LABELS[stage];
  return (
    <article
      className={`mx-auto w-full max-w-[min(96vw,110rem)] 2xl:max-w-[min(94vw,148rem)] 3xl:max-w-[min(92vw,175rem)] space-y-4 ${frameClassName ?? ''}`}
      style={{ '--accent': accent, '--studio-secondary': secondary } as CSSProperties}
    >
      <header className="flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <p className="studio-kicker" style={{ color: secondary }}>{label}</p>
          <h1 className="text-2xl font-extrabold leading-tight md:text-3xl" style={{ color: accent }}>
            {definition.title}
          </h1>
          {/* 낮은 창에서는 부제와 배지를 숨긴다(index.css 「낮은 창」). 모든 화면에서 같은 글이 반복된다. */}
          <p className="studio-frame-subtitle mt-1 text-base text-[color:var(--muted)]">{definition.subtitle}</p>
        </div>
        <span
          className="studio-frame-badge rounded-full px-3 py-1 text-sm font-bold"
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
        className={`studio-editorial ${spreadClassName ?? ''}`}
        taskFirstWhenStacked={taskFirstWhenStacked}
      />
    </article>
  );
}
