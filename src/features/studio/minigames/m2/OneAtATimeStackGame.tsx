import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m2-l2 「한 번에 한 가지 부탁」 — 흔들림 쌓기.
 *
 * 부탁을 하나 얹을 때마다 아이미가 흔들리고, 흔들림은 시간이 지나면 가라앉는다.
 * 가라앉기 전에 다음 부탁을 얹으면 흔들림이 겹쳐 무너진다. "한 번에 한 가지"를
 * 설명이 아니라 손끝의 기다림으로 겪게 하려는 구성이다.
 *
 * 언제 얹을지가 답이고 그 답은 지금 흔들림과 남은 시간에 함께 달려 있다.
 */

interface Task {
  id: string;
  emoji: string;
  label: string;
  /** 얹었을 때 더해지는 흔들림 */
  shake: number;
}

interface Stage {
  id: string;
  tab: string;
  name: string;
  limit: number;
  /** 초당 가라앉는 흔들림 */
  calm: number;
  tasks: Task[];
}

const LIMIT_SHAKE = 100;

const STAGES: Stage[] = [
  {
    id: 's1',
    tab: '기본',
    name: '부탁 4가지',
    limit: 30,
    calm: 30,
    tasks: [
      { id: 'a', emoji: '📝', label: '제목 지어 줘', shake: 55 },
      { id: 'b', emoji: '🎨', label: '그림 그려 줘', shake: 55 },
      { id: 'c', emoji: '📋', label: '목록 만들어 줘', shake: 55 },
      { id: 'd', emoji: '🔤', label: '쉽게 바꿔 줘', shake: 55 },
    ],
  },
  {
    id: 's2',
    tab: '1단계',
    name: '부탁 5가지',
    limit: 36,
    calm: 28,
    tasks: [
      { id: 'a', emoji: '📝', label: '제목 지어 줘', shake: 55 },
      { id: 'b', emoji: '🎨', label: '그림 그려 줘', shake: 58 },
      { id: 'c', emoji: '📋', label: '목록 만들어 줘', shake: 55 },
      { id: 'd', emoji: '🔤', label: '쉽게 바꿔 줘', shake: 55 },
      { id: 'e', emoji: '🔊', label: '읽어 줘', shake: 55 },
    ],
  },
  {
    id: 's3',
    tab: '2단계',
    name: '부탁 6가지',
    limit: 44,
    calm: 26,
    tasks: [
      { id: 'a', emoji: '📝', label: '제목 지어 줘', shake: 55 },
      { id: 'b', emoji: '🎨', label: '그림 그려 줘', shake: 58 },
      { id: 'c', emoji: '📋', label: '목록 만들어 줘', shake: 55 },
      { id: 'd', emoji: '🔤', label: '쉽게 바꿔 줘', shake: 55 },
      { id: 'e', emoji: '🔊', label: '읽어 줘', shake: 55 },
      { id: 'f', emoji: '🔍', label: '찾아 줘', shake: 55 },
    ],
  },
];

export default function OneAtATimeStackGame({ supportLevel }: MiniGameProps) {
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

  const [placed, setPlaced] = useState(0);
  const [shake, setShake] = useState(0);
  const [left, setLeft] = useState(stage.limit);

  const startedAtRef = useRef(0);
  const shakeRef = useRef(0);
  const placedRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  // 흔들림은 프레임 간 dt를 더해 줄이지 않는다. 매 프레임 리렌더가 무거워지면 dt 클램프에
  // 걸려 실제보다 훨씬 느리게 가라앉는다. 마지막으로 얹은 시점과 그때 값만 저장해 두고
  // 절대 경과 시간으로 계산한다.
  const shakeAtRef = useRef(0);
  const shakeTimeRef = useRef(0);

  placedRef.current = placed;

  useEffect(() => {
    setPlaced(0);
    setShake(0);
    setLeft(stage.limit);
    shakeRef.current = 0;
    startedAtRef.current = 0;
    shakeAtRef.current = 0;
    shakeTimeRef.current = 0;
  }, [round, stageIndex, stage.limit]);

  useEffect(() => {
    if (status !== 'running') return;
    if (startedAtRef.current === 0) startedAtRef.current = performance.now();
    let stopped = false;

    const frame = (now: number) => {
      if (stopped) return;
      const elapsed = (now - startedAtRef.current) / 1000;

      // 흔들림은 시간이 지나면 가라앉는다.
      shakeRef.current = Math.max(
        0,
        shakeAtRef.current - stage.calm * (elapsed - shakeTimeRef.current),
      );
      setShake(shakeRef.current);

      const remaining = Math.max(0, stage.limit - elapsed);
      setLeft(remaining);

      if (remaining <= 0) {
        fail(`${stage.tasks.length - placedRef.current}가지를 못 전했어요.`);
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

  // 완료 판정은 rAF 프레임이 아니라 상태 변화에서 한다. 프레임 안에서 ref를 읽으면
  // 마지막 배치가 커밋되기 전에 루프가 끝나 성공이 뜨지 않는 경우가 있다.
  useEffect(() => {
    if (status !== 'running') return;
    if (placed >= stage.tasks.length) {
      succeed(`부탁 ${stage.tasks.length}가지를 하나씩 차분히 전했어요!`);
    }
  }, [status, placed, stage.tasks.length, succeed]);

  const next = stage.tasks[placed];

  const place = () => {
    if (status === 'playing') {
      run('부탁을 하나씩 얹어요. 흔들림이 가라앉기를 기다려요!');
      return;
    }
    if (status !== 'running' || !next) return;

    const after = shakeRef.current + next.shake;
    if (after >= LIMIT_SHAKE) {
      shakeRef.current = LIMIT_SHAKE;
      setShake(LIMIT_SHAKE);
      fail('한꺼번에 얹어서 무너졌어요. 하나씩 기다렸다 얹어요.');
      return;
    }
    shakeRef.current = after;
    shakeAtRef.current = after;
    shakeTimeRef.current = (performance.now() - startedAtRef.current) / 1000;
    setShake(after);
    setPlaced((n) => n + 1);
  };

  const ratio = Math.min(1, shake / LIMIT_SHAKE);
  // "가라앉았어요"는 지금 얹어도 안 무너진다는 뜻이어야 한다. 다음 부탁의 무게까지 넣어
  // 판정하지 않으면 신호를 믿고 눌렀는데 무너지는 일이 생긴다.
  const danger = next ? shake + next.shake >= LIMIT_SHAKE : false;

  return (
    <MiniGameFrame
      badge="한 번에 하나씩 얹기"
      instruction="부탁을 하나 얹으면 아이미가 흔들려요. 흔들림이 가라앉기를 기다렸다가 다음을 얹습니다. 한꺼번에 얹으면 무너져요."
      accent="var(--brand-ink)"
      progress={{ label: '전한 부탁', value: placed, max: stage.tasks.length }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, STAGES[i].name)}
      status={status}
      message={message}
      actions={
        status === 'success' || status === 'fail' ? (
          <button
            type="button"
            onClick={retry}
            className="h-11 w-full rounded-xl border-2 text-[14px] font-black"
            style={{ background: 'var(--paper-1)', borderColor: 'var(--line)', color: 'var(--ink-1)' }}
          >
            🔁 한 번 더
          </button>
        ) : (
          <button
            type="button"
            onClick={place}
            // 흔들리는 동안은 아예 못 누르게 막는다. 신호를 믿고 눌렀는데 무너지는 일이
            // 없어야 하고, 서두름의 대가는 무너짐이 아니라 줄어드는 시간으로 준다.
            disabled={status === 'running' && danger}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 text-[15px] font-black disabled:opacity-60"
            style={{
              background: danger ? 'var(--warn-bg)' : 'var(--brand-ink)',
              borderColor: danger ? 'var(--warn)' : 'var(--brand-ink)',
              color: danger ? '#7c2d12' : 'var(--paper-0)',
            }}
          >
            {status === 'playing' ? '▶️ 시작하기' : `${next ? next.emoji : ''} 이 부탁 얹기`}
          </button>
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between text-[14px] font-black text-slate-400">
          <span>남은 시간</span>
          <span className={left < 4 ? 'text-rose-300' : 'text-slate-300'}>{left.toFixed(1)}초</span>
        </div>

        {/* 흔들리는 아이미와 쌓인 부탁 */}
        <div className="relative flex flex-1 flex-col items-center justify-end overflow-hidden rounded-xl border-2 border-slate-600/40 bg-slate-950/60 pb-2">
          <div
            className="flex flex-col-reverse items-center gap-1"
            style={{
              transform: `rotate(${(ratio - 0.5) * 14}deg)`,
              transformOrigin: 'bottom center',
              transition: 'transform 120ms linear',
            }}
          >
            <span className="text-3xl leading-none" aria-hidden="true">
              🤖
            </span>
            {stage.tasks.slice(0, placed).map((t) => (
              <span
                key={t.id}
                className="rounded-md border-2 border-cyan-300/70 bg-cyan-500/25 px-2 py-0.5 text-[14px] font-black text-cyan-100"
              >
                {t.emoji} {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* 흔들림 미터 */}
        <div>
          <div className="mb-1 flex items-center justify-between text-[14px] font-black">
            <span className="text-slate-400">흔들림</span>
            <span className={danger ? 'text-rose-300' : 'text-slate-300'}>
              {danger ? '아직 흔들려요' : '가라앉았어요'}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full"
              style={{
                width: `${ratio * 100}%`,
                background: danger ? '#fb7185' : '#34d399',
              }}
            />
          </div>
        </div>

        {next && (
          <p className="text-center text-[14px] font-bold text-slate-200">
            다음 부탁 · {next.emoji} {next.label}
          </p>
        )}
      </div>
    </MiniGameFrame>
  );
}
