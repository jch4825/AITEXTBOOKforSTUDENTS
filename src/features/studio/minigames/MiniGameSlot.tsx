import React, { Suspense } from 'react';
import StepErrorBoundary from '../../../components/StepErrorBoundary';
import { getMiniGame } from './registry';
import type { LessonId } from '../../../types';
import type { SupportLevel } from '../types';

interface Props {
  lessonId: LessonId | undefined;
  supportLevel: SupportLevel;
  phase?: 'intro' | 'complete';
  /** 미니게임이 아직 없는 차시에 보여줄 기존 정리 패널 */
  fallback: React.ReactNode;
}

/** 게임 청크를 내려받는 동안 자리를 지켜 레이아웃이 튀지 않게 한다. */
function MiniGameLoading() {
  return (
    <div
      className="flex h-full items-center justify-center rounded-2xl"
      style={{ background: 'var(--paper-1)', border: '2.5px dashed var(--line)' }}
    >
      <p className="text-[15px] font-bold" style={{ color: 'var(--ink-2)' }}>
        놀이를 준비하고 있어요…
      </p>
    </div>
  );
}

/**
 * 마무리 단계 왼쪽 패널의 미니게임 자리.
 *
 * 게임은 lazy 청크라서 해당 차시를 실제로 열 때만 내려받는다.
 * 게임 하나가 깨져도 StepErrorBoundary가 막아 차시 전체가 백지가 되지 않는다.
 */
export default function MiniGameSlot({ lessonId, supportLevel, phase = 'complete', fallback }: Props) {
  const Game = getMiniGame(lessonId);
  if (!Game) return <>{fallback}</>;

  return (
    <StepErrorBoundary>
      <div data-minigame-phase={phase} className="flex h-full min-h-0 flex-col gap-2">
        {phase === 'complete' && (
          <div className="rounded-xl border border-amber-300/70 bg-amber-50 px-3 py-2 text-[14px] font-black leading-relaxed text-amber-950" role="note">
            마무리 변형 도전 · 처음과 다른 조건·목표·역할로 다시 적용해 보세요.
          </div>
        )}
        <div className="min-h-0 flex-1">
          <Suspense fallback={<MiniGameLoading />}>
            <Game supportLevel={supportLevel} session={phase} />
          </Suspense>
        </div>
      </div>
    </StepErrorBoundary>
  );
}
