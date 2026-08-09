import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m1-l9 「AI 도구 선택 스튜디오」 — 필요한 도구 깨우기.
 *
 * 복잡한 예열 스케줄 대신, 한 장면의 일을 보고 알맞은 도구 버튼을 고른 뒤
 * 제한 시간 안에 여러 번 눌러 도구를 깨운다. 학생은
 * "일 카드 → 도구 버튼 → 연속 탭 → 장면 변화"를 한 번에 볼 수 있다.
 */

type ToolId = 'text' | 'image' | 'audio';

interface Tool {
  id: ToolId;
  emoji: string;
  name: string;
  output: string;
}

interface Stage {
  id: string;
  tab: string;
  name: string;
  taskEmoji: string;
  task: string;
  tool: ToolId;
  taps: number;
  limit: number;
  scene: string;
}

const TOOLS: Tool[] = [
  { id: 'text', emoji: '✍️', name: '글 도구', output: '글·문장을 만들어요' },
  { id: 'image', emoji: '🎨', name: '그림 도구', output: '사진·그림을 만들어요' },
  { id: 'audio', emoji: '🎧', name: '소리 도구', output: '소리·자막을 만들어요' },
];

const STAGES: Stage[] = [
  {
    id: 's1',
    tab: '기본',
    name: '천천히 찾아요',
    taskEmoji: '🖼️',
    task: '포스터에 넣을 그림을 만들어요',
    tool: 'image',
    taps: 5,
    limit: 5,
    scene: '포스터 그림이 화면에 차곡차곡 나타나요.',
  },
  {
    id: 's2',
    tab: '1단계',
    name: '조금 빠르게 찾아요',
    taskEmoji: '📝',
    task: '친구에게 보낼 안내 글을 만들어요',
    tool: 'text',
    taps: 7,
    limit: 4.5,
    scene: '친구에게 보낼 안내 문장이 완성돼요.',
  },
  {
    id: 's3',
    tab: '2단계',
    name: '빠르게 찾아요',
    taskEmoji: '🔊',
    task: '영상에 넣을 소리와 자막을 만들어요',
    tool: 'audio',
    taps: 9,
    limit: 4,
    scene: '영상에 소리와 자막이 함께 켜져요.',
  },
];

export default function ToolWarmupSchedulingGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    hintAllowed,
    status,
    message,
    round,
    goToStage,
    run,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });

  const stage = STAGES[stageIndex];
  const [tapCount, setTapCount] = useState(0);
  const [remaining, setRemaining] = useState(stage.limit);
  const [feedback, setFeedback] = useState('필요한 도구 버튼을 골라요.');
  const tapCountRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    setTapCount(0);
    tapCountRef.current = 0;
    setRemaining(stage.limit);
    setFeedback('필요한 도구 버튼을 골라요.');
    startedAtRef.current = null;
  }, [round, stage]);

  useEffect(() => {
    if (status !== 'running') return;

    startedAtRef.current = performance.now();
    let stopped = false;

    const frame = (now: number) => {
      if (stopped || startedAtRef.current === null) return;
      const elapsed = (now - startedAtRef.current) / 1000;
      const nextRemaining = Math.max(0, stage.limit - elapsed);
      setRemaining(nextRemaining);

      if (nextRemaining <= 0) {
        fail(stage.limit + '초 안에 ' + stage.taps + '번을 누르지 못했어요. 필요한 도구를 다시 찾아요.');
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      stopped = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [status, stage, fail]);

  const startGame = () => {
    if (status !== 'playing') return;
    run(stage.limit + '초 안에 알맞은 도구 버튼을 ' + stage.taps + '번 눌러요.');
    setFeedback('“' + stage.task + '”에 맞는 버튼을 찾아 연속으로 눌러요.');
  };

  const tapTool = (tool: Tool) => {
    if (status !== 'running') return;

    if (tool.id !== stage.tool) {
      tapCountRef.current = 0;
      setTapCount(0);
      setFeedback(tool.name + ' 버튼은 지금 일과 달라요. 다른 버튼을 찾아요.');
      return;
    }

    const nextCount = tapCountRef.current + 1;
    tapCountRef.current = nextCount;
    setTapCount(nextCount);
    setFeedback(tool.name + ' 버튼을 누르는 중이에요. ' + nextCount + '번 눌렀어요.');

    if (nextCount >= stage.taps) {
      succeed(stage.scene + ' 필요한 도구를 알맞게 골랐어요.');
    }
  };

  const progressPercent = Math.min(100, (tapCount / stage.taps) * 100);
  const timePercent = status === 'running' ? Math.max(0, (remaining / stage.limit) * 100) : 100;
  const targetTool = TOOLS.find((tool) => tool.id === stage.tool)!;

  return (
    <MiniGameFrame
      badge="AI 도구 고르기 — 연타 미션"
      instruction="일 카드를 보고 알맞은 도구 버튼을 골라요. 제한 시간 안에 그 버튼을 여러 번 눌러 도구를 깨우면 장면이 완성돼요."
      accent="var(--brand-glow)"
      progress={{ label: '연타 진행', value: tapCount, max: stage.taps }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].name)}
      status={status}
      message={message}
      actions={
        status === 'playing' ? (
          <MiniGameButton onClick={startGame} emoji="▶️" label="연타 시작" variant="primary" />
        ) : status === 'success' || status === 'fail' ? (
          <MiniGameButton onClick={retry} emoji="🔁" label="한 번 더" variant="primary" />
        ) : (
          <MiniGameButton onClick={retry} emoji="↩️" label="처음부터" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <section className="rounded-xl border-2 border-amber-300/70 bg-amber-100/10 p-3 text-center">
          <p className="text-[14px] font-black text-amber-200">지금 할 일</p>
          <p className="mt-1 text-[19px] font-black leading-relaxed text-white">
            <span aria-hidden="true">{stage.taskEmoji}</span> {stage.task}
          </p>
          <p className="mt-1 text-[14px] font-bold text-slate-300">
            {status === 'running'
              ? remaining.toFixed(1) + '초 안에 ' + stage.taps + '번 눌러요'
              : status === 'playing'
                ? '시작을 누른 뒤 버튼을 연속으로 눌러요'
                : feedback}
          </p>
        </section>

        <div className="space-y-1" aria-label="남은 시간">
          <div className="flex items-center justify-between text-[14px] font-black text-slate-400">
            <span>남은 시간</span>
            <span>
              {status === 'running' ? remaining.toFixed(1) + '초' : stage.limit.toFixed(1) + '초'}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-700" aria-hidden="true">
            <div
              className="h-full rounded-full bg-amber-300 transition-[width] duration-75"
              style={{ width: timePercent + '%' }}
            />
          </div>
        </div>

        <section className="grid grid-cols-1 gap-2 sm:grid-cols-3" aria-label="AI 도구 버튼">
          {TOOLS.map((tool) => {
            const isTarget = tool.id === stage.tool;
            const isActive = status === 'running';
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => tapTool(tool)}
                disabled={!isActive}
                aria-label={tool.name + ' 버튼' + (isTarget ? ', 현재 일에 필요한 도구' : '')}
                className="flex min-h-[84px] flex-col items-center justify-center rounded-2xl border-2 px-2 py-2 text-center font-black transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-55"
                style={{
                  background: isActive ? 'rgba(14,116,144,0.55)' : 'rgba(51,65,85,0.75)',
                  borderColor: isActive ? '#67e8f9' : 'rgba(148,163,184,0.45)',
                  color: '#f8fafc',
                }}
              >
                <span className="text-3xl leading-none" aria-hidden="true">
                  {tool.emoji}
                </span>
                <span className="mt-1 text-[15px]">{tool.name}</span>
                <span className="text-[14px] font-bold text-cyan-100">{tool.output}</span>
              </button>
            );
          })}
        </section>

        <div className="rounded-xl border border-slate-600/70 bg-slate-900/70 p-3 text-center">
          <div className="flex items-center justify-between gap-2 text-[14px] font-black text-slate-300">
            <span>{feedback}</span>
            <span className="shrink-0 text-cyan-200">
              {tapCount} / {stage.taps}
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-700" aria-label="연타 진행률">
            <div
              className="h-full rounded-full bg-cyan-300 transition-[width] duration-100"
              style={{ width: progressPercent + '%' }}
            />
          </div>
          {hintAllowed && status === 'running' && (
            <button
              type="button"
              onClick={() => setFeedback('힌트: ' + targetTool.name + ' 버튼을 연속으로 눌러요.')}
              className="mt-2 min-h-11 rounded-lg border border-amber-300/70 px-3 text-[14px] font-black text-amber-200"
            >
              💡 필요한 도구 보기
            </button>
          )}
        </div>
      </div>
    </MiniGameFrame>
  );
}
