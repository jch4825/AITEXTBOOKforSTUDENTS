import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m2-l6 「요청 공동 제작소」 — 이어 달리기.
 *
 * 큰 과제를 정해진 횟수의 요청으로 나눠 끝낸다. 한 번에 너무 많이 담으면 아이미가 헷갈려
 * 그 요청은 통째로 실패하고, 너무 잘게 나누면 횟수가 모자란다. 그래서 한 요청의 크기가
 * 혼자 정해지지 않고 나머지 요청의 크기와 함께 정해진다.
 */

interface Stage {
  id: string;
  tab: string;
  task: string;
  requests: number;
  needed: number;
  /** 한 요청이 소화할 수 있는 최대 크기. 넘으면 헷갈려서 결과가 0이 된다. */
  cap: number;
  parts: string[];
}

const STAGES: Stage[] = [
  {
    id: 'poster',
    tab: '기본',
    task: '체험회 포스터 만들기',
    requests: 3,
    needed: 8,
    cap: 3,
    parts: ['제목 짓기', '문구 쓰기', '그림 넣기', '색 고르기'],
  },
  {
    id: 'show',
    tab: '1단계',
    task: '학급 발표 준비하기',
    requests: 4,
    needed: 11,
    cap: 3,
    parts: ['주제 정하기', '자료 모으기', '대본 쓰기', '그림 준비', '순서 짜기'],
  },
  {
    id: 'trip',
    tab: '2단계',
    task: '현장 체험 안내문 만들기',
    requests: 4,
    needed: 12,
    cap: 3,
    parts: ['일정 정리', '준비물 정리', '안내 문구', '지도 넣기', '연락 방법'],
  },
];

export default function RelayRequestGame({ supportLevel }: MiniGameProps) {
  const {
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
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length });

  const stage = STAGES[stageIndex];
  const [sizes, setSizes] = useState<number[]>([]);
  const [ranTo, setRanTo] = useState(-1);

  useEffect(() => {
    setSizes(Array.from({ length: STAGES[stageIndex].requests }, () => 0));
    setRanTo(-1);
  }, [round, stageIndex]);

  const usefulOf = (size: number) => (size > stage.cap ? 0 : size);
  const total = sizes.reduce((sum, s) => sum + usefulOf(s), 0);

  const change = (i: number, delta: number) => {
    if (status !== 'playing') return;
    setSizes((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, Math.min(5, next[i] + delta));
      return next;
    });
  };

  const handleHint = () => {
    // 한 요청이 감당할 수 있는 만큼씩 채워 필요한 양을 넘긴다.
    const next = Array.from({ length: stage.requests }, () => 0);
    let remain = stage.needed;
    for (let i = 0; i < next.length && remain > 0; i += 1) {
      next[i] = Math.min(stage.cap, remain);
      remain -= next[i];
    }
    setSizes(next);
  };

  const handleRun = () => {
    if (status !== 'playing') return;
    setRanTo(0);
    run('요청을 차례대로 보냅니다!');
  };

  // 요청을 하나씩 순서대로 실행한다. 앞 결과가 쌓여야 다음이 이어진다.
  useEffect(() => {
    if (status !== 'running' || ranTo < 0) return;
    if (ranTo < sizes.length) {
      const timer = setTimeout(() => setRanTo((n) => n + 1), 520);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      const confused = sizes.filter((s) => s > stage.cap).length;
      if (confused > 0) {
        fail('한 번에 너무 많이 담은 요청이 있어 아이미가 헷갈렸어요.');
      } else if (total < stage.needed) {
        fail('완성 그림에 빈 부분이 남았어요. 남은 요청에 일을 더 나눠 담아요.');
      } else {
        succeed(`이어진 요청으로 ${stage.task} 완성 그림을 만들었어요!`);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [status, ranTo, sizes, total, stage, succeed, fail]);

  return (
    <MiniGameFrame
      badge="요청 이어 달리기"
      instruction={`요청 ${stage.requests}번으로 과제를 끝내야 해요. 한 요청에 ${stage.cap}칸까지만 담깁니다. 그보다 많이 담으면 아이미가 헷갈려서 그 요청은 통째로 날아가요.`}
      accent="var(--brand-ink)"
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].task)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="다시" />
          {hintAllowed && (
            <MiniGameButton onClick={handleHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={handleRun}
            disabled={status !== 'playing'}
            emoji="🚀"
            label={status === 'running' ? '보내는 중…' : '요청 보내기'}
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="rounded-lg border-2 border-amber-400/50 bg-amber-400/10 px-2 py-1.5">
          <p className="text-[14px] font-black text-amber-300">큰 과제</p>
          <p className="text-[14px] font-bold text-slate-100">📋 {stage.task}</p>
          <p className="mt-0.5 text-[14px] font-bold text-slate-400">
            {stage.parts.join(' · ')}
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {sizes.map((size, i) => {
            const confused = size > stage.cap;
            const ran = ranTo > i;
            return (
              <div
                key={i}
                className="rounded-lg border-2 px-2 py-1.5 transition-colors"
                style={{
                  background: ran
                    ? confused
                      ? 'rgba(234,88,12,0.28)'
                      : 'rgba(22,163,74,0.24)'
                    : 'rgba(30,41,59,0.9)',
                  borderColor: confused
                    ? '#fb923c'
                    : ran
                      ? '#4ade80'
                      : 'rgba(148,163,184,0.45)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-black text-slate-400">{i + 1}번째</span>
                  <span className="flex flex-1 items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <span
                        key={k}
                        className="h-3 flex-1 rounded-sm"
                        style={{
                          background:
                            k < size
                              ? confused
                                ? '#fb923c'
                                : '#4FC3E8'
                              : 'rgba(148,163,184,0.25)',
                        }}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                  <button
                    type="button"
                    onClick={() => change(i, -1)}
                    disabled={status !== 'playing'}
                    aria-label={`${i + 1}번째 요청 줄이기`}
                    className="h-11 w-11 rounded-lg border-2 border-slate-500/60 bg-slate-800 text-base font-black text-slate-100 disabled:opacity-40"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => change(i, 1)}
                    disabled={status !== 'playing'}
                    aria-label={`${i + 1}번째 요청 늘리기`}
                    className="h-11 w-11 rounded-lg border-2 border-slate-500/60 bg-slate-800 text-base font-black text-slate-100 disabled:opacity-40"
                  >
                    ＋
                  </button>
                </div>
                {confused && (
                  <p className="mt-0.5 text-[14px] font-black text-orange-300">
                    너무 많아요 — 아이미가 헷갈려요
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </MiniGameFrame>
  );
}
