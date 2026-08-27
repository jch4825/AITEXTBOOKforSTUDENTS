import React, { Suspense } from 'react';
import Icon from '../../../components/Icon';
import StepErrorBoundary from '../../../components/StepErrorBoundary';
import { getMiniGame } from './registry';
import { useMiniGamePlayable } from './useMiniGameViewport';
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
 * 휴대전화에서 놀이 대신 나오는 안내.
 *
 * 놀이가 열리지 않는 이유를 학생이 바로 알 수 있게 화면 크기 이야기로만 설명한다.
 * 고장이 아니라는 것이 전해져야 해서 오류 문구나 기술 용어는 쓰지 않는다.
 */
function MiniGameSizeNotice() {
  return (
    <div
      role="note"
      className="flex flex-col items-center justify-center gap-2 rounded-2xl px-5 py-6 text-center"
      style={{ background: 'var(--paper-1)', border: '2.5px dashed var(--line)' }}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ background: 'var(--paper-0)', color: 'var(--ink-2)' }}
        aria-hidden
      >
        <Icon name="warning" size={22} />
      </span>
      <p className="text-[16px] font-black" style={{ color: 'var(--brand-ink)' }}>
        놀이는 태블릿과 컴퓨터에서 열립니다
      </p>
      <p className="max-w-[32ch] text-[15px] font-semibold leading-relaxed" style={{ color: 'var(--ink-2)' }}>
        휴대전화 화면은 좁아서 손으로 정확히 움직이기 어렵습니다. 태블릿이나 컴퓨터로 다시 열면 바로 할 수 있어요.
      </p>
    </div>
  );
}

/**
 * 마무리 단계 왼쪽 패널의 미니게임 자리.
 *
 * 게임은 lazy 청크라서 해당 차시를 실제로 열 때만 내려받는다.
 * 게임 하나가 깨져도 StepErrorBoundary가 막아 차시 전체가 백지가 되지 않는다.
 *
 * 태블릿·PC 크기에서만 연다. 휴대전화에서는 게임을 그리지 않고 안내로 대신하므로
 * 청크도 내려받지 않는다. 대신 정리 패널(fallback)을 그대로 이어 붙여, 놀이가 빠져도
 * 핵심 학습이 끝까지 완료되게 한다.
 */
export default function MiniGameSlot({ lessonId, supportLevel, phase = 'complete', fallback }: Props) {
  const playable = useMiniGamePlayable();
  const Game = getMiniGame(lessonId);
  if (!Game) return <>{fallback}</>;

  if (!playable) {
    return (
      <div
        data-minigame-phase={phase}
        data-minigame-blocked="viewport"
        className="flex h-full min-h-0 flex-col gap-3"
      >
        <MiniGameSizeNotice />
        <div className="min-h-0 flex-1">{fallback}</div>
      </div>
    );
  }

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
