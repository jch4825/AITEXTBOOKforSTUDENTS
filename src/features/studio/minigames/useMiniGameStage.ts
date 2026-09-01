import { useCallback, useEffect, useState } from 'react';
import { useSpeak } from '../../../hooks/useSpeak';
import { tuningFor } from './engine/difficulty';
import type { SupportLevel } from '../types';
import type { MiniGameStatus } from './types';

/**
 * 지원 수준별 스테이지 노출 수.
 * 충분한 지원(full)은 첫 스테이지만 반복해도 학습이 완료되고,
 * 도전적(challenge)은 준비된 스테이지를 전부 연다.
 */
const STAGE_BUDGET: Record<SupportLevel, number> = {
  full: 1,
  light: 2,
  challenge: Number.POSITIVE_INFINITY,
};

/** 힌트(정답 경로 보여주기) 버튼 노출 정책. 도전적 수준에서는 숨긴다. */
const HINT_POLICY: Record<SupportLevel, boolean> = {
  full: true,
  light: true,
  challenge: false,
};

interface Options {
  supportLevel: SupportLevel;
  /** 게임이 준비한 전체 스테이지 수 */
  stageCount: number;
  /** 실패 후 자동으로 되돌리기까지의 시간. 0이면 학생이 직접 다시 한다. */
  autoResetOnFailMs?: number;
}

/**
 * 미니게임 공통 진행 상태.
 *
 * 스테이지 이동·성공·실패·재시도를 한곳에서 관리해서 게임마다 다시 짜지 않게 한다.
 * `round`는 리셋 횟수 카운터로, 게임 내부 상태를 초기화할 때 `key={round}` 또는
 * useEffect 의존성으로 쓰면 된다.
 */
export function useMiniGameStage({ supportLevel, stageCount, autoResetOnFailMs = 0 }: Options) {
  const { speakNow } = useSpeak();
  const [stageIndex, setStageIndex] = useState(0);
  const [status, setStatus] = useState<MiniGameStatus>('playing');
  const [message, setMessage] = useState('');
  const [round, setRound] = useState(0);

  const visibleStageCount = Math.max(1, Math.min(stageCount, STAGE_BUDGET[supportLevel]));
  const hintAllowed = HINT_POLICY[supportLevel];
  const isLocked = status === 'running';

  /** 같은 스테이지를 처음부터 다시. 실패 후 재시도와 "다시 하기" 버튼 공용. */
  const retry = useCallback(() => {
    setStatus('playing');
    setMessage('');
    setRound((n) => n + 1);
  }, []);

  /**
   * 시뮬레이션이 끝난 뒤 조작 가능한 상태로만 돌아온다.
   *
   * retry는 round를 올려 판을 새로 만든다. 그런데 "실행해 보고 틀린 곳만 고쳐 다시
   * 실행하는" 게임에서는 학생이 만든 배치가 그대로 남아야 한다. 그 자리에 retry를
   * 쓰면 고칠 대상 자체가 사라진다.
   */
  const resume = useCallback(() => {
    setStatus('playing');
    setMessage('');
  }, []);

  /** 스테이지 전환. 범위를 벗어나면 무시한다. */
  const goToStage = useCallback(
    (index: number, spoken?: string) => {
      if (index < 0 || index >= visibleStageCount) return;
      setStageIndex(index);
      setStatus('playing');
      setMessage('');
      setRound((n) => n + 1);
      if (spoken) speakNow(spoken);
    },
    [visibleStageCount, speakNow],
  );

  /** 시뮬레이션 재생 시작 — 조작을 잠근다. */
  const run = useCallback(
    (spoken?: string) => {
      setStatus('running');
      setMessage('');
      if (spoken) speakNow(spoken);
    },
    [speakNow],
  );

  const succeed = useCallback(
    (spoken: string) => {
      setStatus('success');
      setMessage(spoken);
      speakNow(spoken);
    },
    [speakNow],
  );

  const fail = useCallback(
    (spoken: string) => {
      setStatus('fail');
      setMessage(spoken);
      speakNow(spoken);
    },
    [speakNow],
  );

  // 실패 메시지는 읽기·음성 안내가 끝날 때까지 유지한다. 학생이 직접 다시 하기를 눌러야 한다.
  useEffect(() => {
    if (status !== 'fail' || autoResetOnFailMs <= 0) return;
    const timer = setTimeout(retry, autoResetOnFailMs);
    return () => clearTimeout(timer);
  }, [status, autoResetOnFailMs, retry]);

  // 지원 수준이 낮아지면 열려 있던 스테이지 밖으로 벗어나 있을 수 있다.
  useEffect(() => {
    if (stageIndex >= visibleStageCount) setStageIndex(visibleStageCount - 1);
  }, [stageIndex, visibleStageCount]);

  return {
    stageIndex,
    visibleStageCount,
    hintAllowed,
    status,
    message,
    round,
    isLocked,
    goToStage,
    run,
    succeed,
    fail,
    retry,
    resume,
    /** 지원 수준별 속도·크기·허용 오차 배율. 같은 게임의 요구 수준만 바꾼다. */
    tuning: tuningFor(supportLevel),
    /**
     * 판 배치를 만드는 씨앗. 스테이지와 시도 횟수로 만들어, 다시 하기를 누르면
     * 새 배치가 나오면서도 같은 스테이지의 같은 시도는 늘 같은 배치가 된다.
     */
    seed: (stageIndex + 1) * 7919 + round * 104729,
    /** 조작을 받아도 되는 상태인지. status !== 'playing'을 게임마다 다시 쓰지 않게 한다. */
    playing: status === 'playing',
  };
}
