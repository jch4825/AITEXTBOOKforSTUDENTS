import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m1-l9 「AI 도구 선택 스튜디오」 — 미리 준비하기(스케줄링).
 *
 * 어떤 일에 어떤 도구가 필요한지는 예고에 대놓고 적어 준다(판단은 공짜).
 * 난이도는 **한 번에 한 도구만 예열할 수 있다**는 제약에 있다. 지금 그림 도구를 데우면
 * 글 도구는 식는다. 그래서 "무엇을 준비할까"의 답이 혼자 정해지지 않고 다음에 올 일에 달린다.
 *
 * 같은 도구가 연달아 필요하면 다시 데울 필요가 없다 — 차시의 "일마다 맞는 도구를 나눠 쓴다"를
 * 손으로 겪게 하려는 구성이다.
 */

type ToolId = 'text' | 'image' | 'audio';

interface Tool {
  id: ToolId;
  emoji: string;
  name: string;
}

interface Task {
  at: number; // 초
  tool: ToolId;
  label: string;
}

interface Stage {
  id: string;
  tab: string;
  name: string;
  warm: number; // 예열에 걸리는 시간(초)
  limit: number;
  tasks: Task[];
}

const TOOLS: Tool[] = [
  { id: 'text', emoji: '✍️', name: '글 도구' },
  { id: 'image', emoji: '🎨', name: '그림 도구' },
  { id: 'audio', emoji: '🎧', name: '소리 도구' },
];

const STAGES: Stage[] = [
  {
    id: 's1',
    tab: '기본',
    name: '여유 있게 와요',
    warm: 2,
    limit: 11,
    tasks: [
      { at: 3.0, tool: 'text', label: '행사 안내 요약' },
      { at: 6.0, tool: 'image', label: '포스터 그림' },
      { at: 9.0, tool: 'audio', label: '영상 자막' },
    ],
  },
  {
    id: 's2',
    tab: '1단계',
    name: '쉴 틈이 적어요',
    warm: 2,
    limit: 12,
    tasks: [
      { at: 2.5, tool: 'image', label: '포스터 그림' },
      { at: 5.0, tool: 'text', label: '안내 문구' },
      { at: 7.5, tool: 'audio', label: '영상 자막' },
      { at: 10.0, tool: 'text', label: '초대 글' },
    ],
  },
  {
    id: 's3',
    tab: '2단계',
    name: '같은 도구가 이어지기도 해요',
    warm: 2,
    limit: 13,
    tasks: [
      { at: 2.2, tool: 'audio', label: '영상 자막' },
      { at: 4.4, tool: 'audio', label: '음성 안내' },
      { at: 6.6, tool: 'image', label: '포스터 그림' },
      { at: 8.8, tool: 'text', label: '안내 문구' },
      { at: 11.0, tool: 'image', label: '사진 설명 그림' },
    ],
  },
];

export default function ToolWarmupSchedulingGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    status,
    message,
    round,
    goToStage,
    run,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length });

  const stage = STAGES[stageIndex];

  const [clock, setClock] = useState(0);
  const [ready, setReady] = useState<ToolId | null>(null);
  const [warming, setWarming] = useState<{ tool: ToolId; from: number } | null>(null);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const clockRef = useRef(0);
  const readyRef = useRef<ToolId | null>(null);
  const warmingRef = useRef<{ tool: ToolId; from: number } | null>(null);
  const handledRef = useRef<Set<number>>(new Set());
  const rafRef = useRef<number | null>(null);
  // 결과를 ref로도 들고 있는다. 이 값을 아래 rAF 이펙트의 의존성에 넣으면 일이 하나
  // 처리될 때마다 이펙트가 다시 붙어 게임 시계가 0으로 되돌아간다.
  const resultsRef = useRef<Record<number, boolean>>({});

  readyRef.current = ready;
  warmingRef.current = warming;
  resultsRef.current = results;

  useEffect(() => {
    setClock(0);
    setReady(null);
    setWarming(null);
    setResults({});
    clockRef.current = 0;
    handledRef.current = new Set();
  }, [round, stageIndex]);

  useEffect(() => {
    if (status !== 'running') return;
    const startedAt = performance.now();
    let stopped = false;

    const frame = (now: number) => {
      if (stopped) return;
      const t = (now - startedAt) / 1000;
      clockRef.current = t;
      setClock(t);

      // 예열 완료 처리
      const w = warmingRef.current;
      if (w && t - w.from >= stage.warm) {
        readyRef.current = w.tool;
        warmingRef.current = null;
        setReady(w.tool);
        setWarming(null);
      }

      // 도착한 일 처리
      const arrived: Record<number, boolean> = {};
      stage.tasks.forEach((task, i) => {
        if (t >= task.at && !handledRef.current.has(i)) {
          handledRef.current.add(i);
          arrived[i] = readyRef.current === task.tool;
        }
      });
      if (Object.keys(arrived).length > 0) setResults((prev) => ({ ...prev, ...arrived }));

      if (t >= stage.limit) {
        // 남은 일은 전부 놓친 것으로 본다
        const finalResults = { ...resultsRef.current, ...arrived };
        const okCount = stage.tasks.filter((_, i) => finalResults[i]).length;
        if (okCount === stage.tasks.length) {
          succeed(`일 ${stage.tasks.length}가지를 모두 알맞은 도구로 해냈어요!`);
        } else {
          fail(`${stage.tasks.length - okCount}가지를 놓쳤어요. 미리 데워 두면 돼요.`);
        }
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      stopped = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [status, stage, succeed, fail]);

  const startWarm = (tool: ToolId) => {
    if (status === 'playing') {
      run('일이 순서대로 들어옵니다. 미리 도구를 데워 두세요!');
      warmingRef.current = { tool, from: 0 };
      setWarming({ tool, from: 0 });
      return;
    }
    if (status !== 'running') return;
    if (readyRef.current === tool) return; // 이미 준비된 도구는 다시 데우지 않는다

    // 한 번에 하나만 — 새로 데우면 준비돼 있던 도구는 식는다.
    readyRef.current = null;
    setReady(null);
    warmingRef.current = { tool, from: clockRef.current };
    setWarming({ tool, from: clockRef.current });
  };

  const doneCount = stage.tasks.filter((_, i) => results[i]).length;
  const nextTask = stage.tasks.find((t, i) => !handledRef.current.has(i) && t.at >= clock);

  return (
    <MiniGameFrame
      badge="도구 미리 데우기"
      instruction="일이 도착했을 때 알맞은 도구가 준비돼 있어야 해요. 데우는 데 시간이 걸리고, 한 번에 한 도구만 데울 수 있습니다. 예고를 보고 미리 준비하세요."
      accent="var(--brand-glow)"
      progress={{ label: '해낸 일', value: doneCount, max: stage.tasks.length }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].name)}
      status={status}
      message={message}
      actions={
        status === 'success' || status === 'fail' ? (
          <button
            type="button"
            onClick={retry}
            className="h-11 w-full rounded-xl border-2 text-[14px] font-black"
            style={{
              background: 'var(--paper-1)',
              borderColor: 'var(--line)',
              color: 'var(--ink-1)',
            }}
          >
            🔁 한 번 더
          </button>
        ) : (
          <>
            {TOOLS.map((tool) => {
              const isReady = ready === tool.id;
              const isWarming = warming?.tool === tool.id;
              const pct = isWarming
                ? Math.min(100, ((clock - warming!.from) / stage.warm) * 100)
                : 0;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => startWarm(tool.id)}
                  aria-label={`${tool.name} 데우기${isReady ? ', 준비됨' : ''}`}
                  className="relative flex h-14 flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border-2 text-[14px] font-black transition"
                  style={{
                    background: isReady ? 'var(--ok-bg)' : 'var(--paper-1)',
                    borderColor: isReady ? 'var(--ok)' : 'var(--line)',
                    color: isReady ? '#14532d' : 'var(--ink-2)',
                  }}
                >
                  {isWarming && (
                    <span
                      className="absolute inset-y-0 left-0 bg-sky-300/40"
                      style={{ width: `${pct}%` }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative text-lg leading-none">{tool.emoji}</span>
                  <span className="relative">
                    {isReady ? '준비됨' : isWarming ? '데우는 중' : tool.name}
                  </span>
                </button>
              );
            })}
          </>
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 앞으로 올 일 예고 */}
        <div>
          <p className="mb-1 text-[14px] font-black text-slate-400">들어올 일 예고</p>
          <div className="flex flex-col gap-1">
            {stage.tasks.map((task, i) => {
              const handled = handledRef.current.has(i);
              const ok = results[i];
              const inSec = task.at - clock;
              const tool = TOOLS.find((t) => t.id === task.tool)!;
              return (
                <div
                  key={`${task.label}-${i}`}
                  className="flex items-center gap-2 rounded-lg border-2 px-2 py-1.5 transition-colors"
                  style={{
                    background: handled
                      ? ok
                        ? 'rgba(22,163,74,0.28)'
                        : 'rgba(234,88,12,0.28)'
                      : 'rgba(30,41,59,0.9)',
                    borderColor: handled
                      ? ok
                        ? '#4ade80'
                        : '#fb923c'
                      : nextTask === task
                        ? '#fbbf24'
                        : 'rgba(148,163,184,0.4)',
                  }}
                >
                  <span className="text-base leading-none" aria-hidden="true">
                    {tool.emoji}
                  </span>
                  <span className="flex-1 text-[14px] font-bold text-slate-100">{task.label}</span>
                  <span className="text-[14px] font-black text-slate-300">
                    {handled
                      ? ok
                        ? '✅ 해냄'
                        : '⚠️ 놓침'
                      : inSec > 0
                        ? `${inSec.toFixed(1)}초 뒤`
                        : '지금!'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 지금 준비 상태 */}
        <div className="mt-auto rounded-lg border-2 border-slate-600/50 bg-slate-900/70 px-2 py-2 text-center">
          <p className="text-[14px] font-black text-slate-400">지금 준비된 도구</p>
          <p className="text-[15px] font-black text-slate-100">
            {ready
              ? `${TOOLS.find((t) => t.id === ready)!.emoji} ${TOOLS.find((t) => t.id === ready)!.name}`
              : warming
                ? `${TOOLS.find((t) => t.id === warming.tool)!.emoji} 데우는 중…`
                : '없음'}
          </p>
        </div>

        {status === 'playing' && (
          <p className="text-center text-[14px] font-black text-amber-300">
            아래에서 도구를 하나 눌러 시작해요
          </p>
        )}
      </div>
    </MiniGameFrame>
  );
}
