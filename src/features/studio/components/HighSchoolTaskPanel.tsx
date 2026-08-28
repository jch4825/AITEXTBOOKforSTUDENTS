import React from 'react';
import type { HighSchoolTask } from '../../../data/highSchoolTasks';

interface Props {
  task: HighSchoolTask;
  accent: string;
  secondary: string;
}

/**
 * 고등학교 학년군에서만 나타나는 심화 수행 과제.
 * 전이 단계 아래에 붙어 같은 이야기를 더 높은 요구 수준으로 다시 다루게 한다.
 * 지원 수준이 `고등`일 때만 렌더링된다(StudioExperience의 transfer 단계).
 */
export default function HighSchoolTaskPanel({ task, accent, secondary }: Props) {
  return (
    <section
      className="rounded-2xl border-2 p-4 md:p-5 depth-paper"
      style={{ borderColor: accent, background: 'var(--editorial-paper)' }}
      aria-label="고등 심화 과제"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-xs font-black"
          style={{ background: accent, color: 'var(--editorial-paper)' }}
        >
          고등 심화 과제
        </span>
        <h3 className="text-base font-extrabold" style={{ color: 'var(--brand-ink)' }}>
          {task.title}
        </h3>
      </div>

      <p className="mt-3 text-sm font-semibold leading-relaxed" style={{ color: 'var(--brand-ink)' }}>
        {task.task}
      </p>

      {task.community ? (
        <p className="mt-3 rounded-xl border border-dashed p-3 text-sm font-bold leading-relaxed"
          style={{ borderColor: secondary, color: 'var(--muted)' }}
        >
          <span className="mr-1" aria-hidden>🏫</span>
          교실 밖에서 해요 · {task.community}
        </p>
      ) : null}
    </section>
  );
}
