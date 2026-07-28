import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m4-l4 「비밀번호와 인증 코드는 보내지 않기」 — 분기 게이트.
 *
 * 메시지가 흘러 내려와 갈림길에 닿는 순간, 그때 게이트가 향한 쪽으로 나간다.
 * 무엇이 위험한지는 🔑 표시로 대놓고 알려 준다(판단은 공짜). 난이도는 전부 실행에 있다 —
 * 다음 메시지가 닿기 전에 게이트를 제때 돌려놓아야 하고, 게이트는 한 번에 한쪽만 향한다.
 *
 * 인증 코드가 한 번이라도 밖으로 나가면 실패다. 차시가 "인증 코드는 보내지 마세요"라고
 * 못 박으므로 부분 점수를 주지 않는다.
 */

type Lane = 'send' | 'guard';

interface Msg {
  id: string;
  danger: boolean;
  emoji: string;
  label: string;
}

interface Stage {
  id: string;
  tab: string;
  name: string;
  speed: number; // 화면 높이 대비 %/초
  msgs: Msg[];
}

const SAFE: Omit<Msg, 'id'>[] = [
  { danger: false, emoji: '📷', label: '사진 보내 줘' },
  { danger: false, emoji: '❓', label: '숙제 뭐야?' },
  { danger: false, emoji: '🎂', label: '생일 초대' },
  { danger: false, emoji: '🕐', label: '몇 시에 만나?' },
];

const DANGER: Omit<Msg, 'id'>[] = [
  { danger: true, emoji: '🔑', label: '인증 코드 알려 줘' },
  { danger: true, emoji: '🔒', label: '비밀번호 알려 줘' },
];

function buildDeck(total: number, dangerCount: number): Msg[] {
  const at = new Set<number>();
  for (let k = 1; k <= dangerCount; k += 1) at.add(Math.round((total * k) / (dangerCount + 1)));
  const deck: Msg[] = [];
  let d = 0;
  for (let i = 0; i < total; i += 1) {
    if (at.has(i)) {
      deck.push({ ...DANGER[d % DANGER.length], id: `d-${i}` });
      d += 1;
    } else {
      deck.push({ ...SAFE[i % SAFE.length], id: `s-${i}` });
    }
  }
  return deck;
}

const STAGES: Stage[] = [
  { id: 's1', tab: '기본', name: '천천히 와요', speed: 16, msgs: buildDeck(6, 2) },
  { id: 's2', tab: '1단계', name: '조금 빨라요', speed: 22, msgs: buildDeck(8, 3) },
  { id: 's3', tab: '2단계', name: '쉴 새 없이 와요', speed: 29, msgs: buildDeck(10, 4) },
];

const START_Y = -14;
const SPACING = 22;
const FORK_Y = 62;
const END_Y = 108;

export default function SecureRoutingGateGame({ supportLevel }: MiniGameProps) {
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
  const dangerTotal = stage.msgs.filter((m) => m.danger).length;

  const [gate, setGate] = useState<Lane>('guard');
  const [routed, setRouted] = useState<Record<string, Lane>>({});
  const gateRef = useRef<Lane>('guard');
  const routedRef = useRef<Record<string, Lane>>({});
  const yRef = useRef<Record<string, number>>({});
  const nodesRef = useRef<Record<string, HTMLDivElement | null>>({});
  const rafRef = useRef<number | null>(null);

  gateRef.current = gate;
  routedRef.current = routed;

  useEffect(() => {
    setGate('guard');
    setRouted({});
    yRef.current = {};
    stage.msgs.forEach((m, i) => {
      yRef.current[m.id] = START_Y - i * SPACING;
    });
  }, [round, stageIndex, stage.msgs]);

  useEffect(() => {
    if (status !== 'running') return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const speed = reduced ? stage.speed * 0.6 : stage.speed;

    let last = performance.now();
    let stopped = false;

    const frame = (now: number) => {
      if (stopped) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      let allDone = true;
      const newlyRouted: Record<string, Lane> = {};

      stage.msgs.forEach((m) => {
        const y = (yRef.current[m.id] ?? START_Y) + speed * dt;
        yRef.current[m.id] = y;

        const lane = routedRef.current[m.id] ?? newlyRouted[m.id];
        // 갈림길에 닿는 순간의 게이트 방향으로 확정된다.
        if (!lane && y >= FORK_Y) newlyRouted[m.id] = gateRef.current;

        const node = nodesRef.current[m.id];
        if (node) {
          node.style.top = `${y}%`;
          const settled = lane ?? newlyRouted[m.id];
          if (settled) node.style.left = settled === 'send' ? '24%' : '76%';
        }

        if (y < END_Y) allDone = false;
      });

      if (Object.keys(newlyRouted).length > 0) {
        setRouted((prev) => ({ ...prev, ...newlyRouted }));
      }

      if (allDone) {
        const final = { ...routedRef.current, ...newlyRouted };
        const leaked = stage.msgs.filter((m) => m.danger && final[m.id] === 'send').length;
        const delivered = stage.msgs.filter((m) => !m.danger && final[m.id] === 'send').length;
        const safeTotal = stage.msgs.length - dangerTotal;

        if (leaked > 0) {
          fail(`인증 코드가 ${leaked}번 밖으로 나갔어요. 절대 보내면 안 돼요.`);
        } else if (delivered < safeTotal - 1) {
          fail('보통 메시지가 너무 많이 막혔어요. 게이트를 다시 돌려 봐요.');
        } else {
          succeed(`위험한 요구 ${dangerTotal}개를 모두 막았어요!`);
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
  }, [status, stage, dangerTotal, succeed, fail]);

  const blocked = stage.msgs.filter((m) => m.danger && routed[m.id] === 'guard').length;

  const setLane = (lane: Lane) => {
    if (status === 'playing') {
      setGate(lane);
      gateRef.current = lane;
      run('메시지가 내려옵니다. 게이트를 제때 돌려요!');
      return;
    }
    if (status !== 'running') return;
    setGate(lane);
    gateRef.current = lane;
  };

  return (
    <MiniGameFrame
      badge="게이트 돌리기 — 코드는 못 보내"
      instruction="메시지가 갈림길에 닿는 순간의 게이트 방향으로 나갑니다. 🔑 🔒 표시는 어른에게 알리기 쪽으로, 보통 메시지는 답장 쪽으로 미리 돌려 두세요."
      accent="var(--warn)"
      progress={{ label: '막은 요구', value: blocked, max: dangerTotal }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].name)}
      status={status}
      message={message}
      actions={
        <>
          <button
            type="button"
            onClick={() => setLane('send')}
            aria-pressed={gate === 'send'}
            className="flex h-14 flex-1 flex-col items-center justify-center rounded-xl border-2 text-[14px] font-black transition"
            style={{
              background: gate === 'send' ? 'var(--ok-bg)' : 'var(--paper-1)',
              borderColor: gate === 'send' ? 'var(--ok)' : 'var(--line)',
              color: gate === 'send' ? '#14532d' : 'var(--ink-2)',
            }}
          >
            <span className="text-lg leading-none">📤</span>
            답장 보내기
          </button>
          <button
            type="button"
            onClick={() => setLane('guard')}
            aria-pressed={gate === 'guard'}
            className="flex h-14 flex-1 flex-col items-center justify-center rounded-xl border-2 text-[14px] font-black transition"
            style={{
              background: gate === 'guard' ? 'var(--warn-bg)' : 'var(--paper-1)',
              borderColor: gate === 'guard' ? 'var(--warn)' : 'var(--line)',
              color: gate === 'guard' ? '#7c2d12' : 'var(--ink-2)',
            }}
          >
            <span className="text-lg leading-none">🛡️</span>
            어른에게 알리기
          </button>
        </>
      }
    >
      <div className="relative min-h-[270px] flex-1 overflow-hidden rounded-xl border-2 border-slate-600/40 bg-slate-950/70">
        {/* 갈림길 */}
        <div
          className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-slate-400/60"
          style={{ top: `${FORK_Y}%` }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 flex justify-between px-3 text-[14px] font-black"
          style={{ top: `${FORK_Y + 2}%` }}
        >
          <span className="text-emerald-300">📤 답장</span>
          <span className="text-amber-300">🛡️ 어른에게</span>
        </div>

        {/* 게이트 화살표 — 지금 어디로 향하는지 */}
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-2xl transition-transform duration-200"
          style={{
            top: `${FORK_Y - 9}%`,
            transform: `translateX(-50%) rotate(${gate === 'send' ? -38 : 38}deg)`,
          }}
          aria-hidden="true"
        >
          ⬇️
        </div>

        {stage.msgs.map((m) => {
          const lane = routed[m.id];
          return (
            <div
              key={m.id}
              ref={(el: HTMLDivElement | null) => {
                nodesRef.current[m.id] = el;
              }}
              className="absolute flex w-[112px] -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-lg border-2 px-1.5 py-1 transition-[left] duration-300"
              style={{
                top: `${yRef.current[m.id] ?? START_Y}%`,
                left: '50%',
                background: m.danger ? 'rgba(190,24,93,0.35)' : 'rgba(30,41,59,0.95)',
                borderColor:
                  lane === 'guard' && m.danger
                    ? '#4ade80'
                    : lane === 'send' && m.danger
                      ? '#fb7185'
                      : m.danger
                        ? '#f472b6'
                        : 'rgba(148,163,184,0.45)',
              }}
            >
              <span className="text-[15px] leading-none" aria-hidden="true">
                {m.emoji}
              </span>
              <span className="text-[14px] font-bold leading-tight text-slate-100">{m.label}</span>
            </div>
          );
        })}

        {status === 'playing' && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-950/75">
            <p className="px-4 text-center text-[15px] font-black text-amber-200">
              아래 버튼으로 게이트를 돌리면 시작해요
            </p>
          </div>
        )}
        {(status === 'success' || status === 'fail') && (
          <div className="absolute inset-0 grid place-items-center bg-slate-950/80">
            <button
              type="button"
              onClick={retry}
              className="rounded-xl border-2 border-slate-400/60 bg-slate-800 px-4 py-2 text-[14px] font-black text-slate-100"
            >
              🔁 한 번 더
            </button>
          </div>
        )}
      </div>
    </MiniGameFrame>
  );
}
