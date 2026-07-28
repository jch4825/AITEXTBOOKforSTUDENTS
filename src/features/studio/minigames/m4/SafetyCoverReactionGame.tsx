import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m4-l6 「불편한 내용을 만났을 때 멈추기」 — 반응속도. 조작 버튼이 없다.
 *
 * 화면이 아래로 흘러가고, 불편한 내용이 멈춤 구역에 들어와 있을 때 보드를 누르면 안전 덮개가
 * 덮인다. 성패는 정답표가 아니라 "누른 순간 그 카드가 구역 안에 있었는가"라는 위치·시간으로
 * 정해지고, 구역 안이면 언제 눌러도 되므로 성공 순간은 연속 구간이다.
 *
 * 불편한 카드는 글자를 읽을 수 없게 흐려 두었다. 차시의 핵심이 "내용을 다시 읽지 말고
 * 신호를 보면 곧바로 멈추고 가리기"이므로, 게임에서도 읽어서 판단하게 만들지 않는다.
 */

interface Card {
  id: string;
  bad: boolean;
  emoji: string;
  label: string;
}

interface Stage {
  id: string;
  tab: string;
  name: string;
  speed: number; // 화면 높이 대비 %/초
  cards: Card[];
}

const SAFE_CARDS: Card[] = [
  { id: 'weather', bad: false, emoji: '🌤️', label: '오늘 날씨' },
  { id: 'homework', bad: false, emoji: '📚', label: '숙제 알림' },
  { id: 'draw', bad: false, emoji: '🎨', label: '그림 그리기' },
  { id: 'dog', bad: false, emoji: '🐶', label: '강아지 사진' },
  { id: 'music', bad: false, emoji: '🎵', label: '노래 목록' },
  { id: 'lunch', bad: false, emoji: '🍚', label: '오늘 급식' },
];

const badCard = (n: number): Card => ({
  id: `bad-${n}`,
  bad: true,
  emoji: '⚠️',
  label: '불편한 내용',
});

/**
 * 안전 카드와 불편 카드를 섞되, 순서는 매번 같아 교사가 미리 안내할 수 있게 한다.
 * 불편 카드는 전체 길이를 badCount+1로 나눈 지점에 고르게 놓아 연달아 나오지 않게 한다.
 */
function buildDeck(total: number, badCount: number): Card[] {
  const badAt = new Set<number>();
  for (let k = 1; k <= badCount; k += 1) {
    badAt.add(Math.round((total * k) / (badCount + 1)));
  }
  const deck: Card[] = [];
  let made = 0;
  for (let i = 0; i < total; i += 1) {
    if (badAt.has(i)) {
      made += 1;
      deck.push(badCard(made));
    } else {
      deck.push({ ...SAFE_CARDS[i % SAFE_CARDS.length], id: `safe-${i}` });
    }
  }
  return deck;
}

const STAGES: Stage[] = [
  { id: 's1', tab: '기본', name: '천천히 흘러가요', speed: 17, cards: buildDeck(6, 2) },
  { id: 's2', tab: '1단계', name: '조금 빨라져요', speed: 23, cards: buildDeck(8, 3) },
  { id: 's3', tab: '2단계', name: '빠르게 흘러가요', speed: 30, cards: buildDeck(10, 4) },
];

const START_Y = -16;
const SPACING = 21;
const END_Y = 116;
const ZONE_TOP = 40;
const ZONE_BOTTOM = 76;

export default function SafetyCoverReactionGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
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
  const badTotal = stage.cards.filter((c) => c.bad).length;

  const [covered, setCovered] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  const nodesRef = useRef<Record<string, HTMLDivElement | null>>({});
  const yRef = useRef<Record<string, number>>({});
  const rafRef = useRef<number | null>(null);
  const coveredRef = useRef<string[]>([]);
  const missedRef = useRef<string[]>([]);

  coveredRef.current = covered;
  missedRef.current = missed;

  useEffect(() => {
    setCovered([]);
    setMissed([]);
    setFlash(null);
    yRef.current = {};
    stage.cards.forEach((card, i) => {
      yRef.current[card.id] = START_Y - i * SPACING;
    });
  }, [round, stageIndex, stage.cards]);

  // 카드를 아래로 흘려보낸다. 좌표는 ref에 두고 DOM을 직접 움직여 매 프레임 리렌더를 피한다.
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

      let allPassed = true;
      const newlyMissed: string[] = [];

      stage.cards.forEach((card) => {
        const y = (yRef.current[card.id] ?? START_Y) + speed * dt;
        yRef.current[card.id] = y;

        const node = nodesRef.current[card.id];
        if (node) node.style.top = `${y}%`;

        if (y < END_Y) {
          allPassed = false;
        } else if (
          card.bad &&
          !coveredRef.current.includes(card.id) &&
          !missedRef.current.includes(card.id)
        ) {
          newlyMissed.push(card.id);
        }
      });

      if (newlyMissed.length > 0) setMissed((prev) => [...prev, ...newlyMissed]);

      if (allPassed) {
        const missedNow = missedRef.current.length + newlyMissed.length;
        if (missedNow === 0) {
          succeed(`불편한 내용 ${badTotal}개를 모두 바로 덮었어요!`);
        } else {
          fail(`${missedNow}개를 놓쳤어요. 표시가 보이면 바로 눌러요.`);
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
  }, [status, stage, badTotal, succeed, fail]);

  /** 보드를 누르면 지금 멈춤 구역 안에 있는 카드를 덮는다. */
  const handleBoardPress = () => {
    if (status === 'playing') {
      run('화면이 흘러갑니다. 표시가 보이면 바로 눌러요!');
      return;
    }
    if (status !== 'running') return;

    const candidates = stage.cards.filter((card) => {
      const y = yRef.current[card.id] ?? START_Y;
      return y >= ZONE_TOP && y <= ZONE_BOTTOM && !covered.includes(card.id);
    });
    // 구역에 안전 카드와 불편 카드가 함께 들어와 있을 수 있다. 학생은 경고 표시를 보고
    // 누른 것이므로 불편 카드를 먼저 덮어 준다. 그러지 않으면 제때 눌러도 엉뚱한 게 덮인다.
    const inZone = candidates.find((card) => card.bad) ?? candidates[0];
    if (!inZone) return;

    setCovered((prev) => [...prev, inZone.id]);
    if (!inZone.bad) {
      setFlash(inZone.id);
      setTimeout(() => setFlash(null), 600);
    }
  };

  const coveredBad = covered.filter((id) => stage.cards.find((c) => c.id === id)?.bad).length;

  return (
    <MiniGameFrame
      badge="안전 덮개 — 바로 멈추기"
      instruction="화면이 아래로 흘러갑니다. ⚠️ 표시가 가운데 멈춤 구역에 들어오면 화면을 눌러 덮개를 덮어요. 내용은 읽지 않아도 됩니다."
      accent="var(--warn)"
      progress={{ label: '바로 덮음', value: coveredBad, max: badTotal }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].name)}
      status={status}
      message={message}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={
          status === 'playing' ? '눌러서 시작하기' : '지금 멈춤 구역에 있는 내용을 덮기'
        }
        onPointerDown={handleBoardPress}
        onKeyDown={(e: any) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleBoardPress();
          }
        }}
        style={{ touchAction: 'none' }}
        className="relative min-h-[268px] flex-1 cursor-pointer select-none overflow-hidden rounded-xl border-2 border-slate-600/40 bg-slate-950/70"
      >
        {/* 멈춤 구역 */}
        <div
          className="pointer-events-none absolute inset-x-0 border-y-2 border-dashed border-amber-400/70 bg-amber-400/10"
          style={{ top: `${ZONE_TOP}%`, height: `${ZONE_BOTTOM - ZONE_TOP}%` }}
        >
          <span className="absolute right-1.5 top-1 text-[14px] font-black text-amber-300">
            멈춤 구역
          </span>
        </div>

        {stage.cards.map((card) => {
          const isCovered = covered.includes(card.id);
          const isMissed = missed.includes(card.id);
          return (
            <div
              key={card.id}
              ref={(el: HTMLDivElement | null) => {
                nodesRef.current[card.id] = el;
              }}
              className="absolute left-1/2 flex w-[80%] max-w-[190px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border-2 px-2 py-2"
              style={{
                top: `${yRef.current[card.id] ?? START_Y}%`,
                background: isCovered
                  ? 'rgba(22,163,74,0.4)'
                  : card.bad
                    ? 'rgba(190,24,93,0.35)'
                    : 'rgba(30,41,59,0.95)',
                borderColor: isCovered
                  ? '#4ade80'
                  : isMissed
                    ? '#fb923c'
                    : card.bad
                      ? '#f472b6'
                      : 'rgba(148,163,184,0.45)',
              }}
            >
              {isCovered ? (
                <>
                  <span className="text-lg leading-none">🛡️</span>
                  <span className="text-[14px] font-black text-emerald-100">안전 덮개</span>
                </>
              ) : (
                <>
                  <span
                    className={`text-lg leading-none ${card.bad ? 'animate-pulse' : ''}`}
                    aria-hidden="true"
                  >
                    {card.emoji}
                  </span>
                  {card.bad ? (
                    // 내용은 일부러 읽을 수 없게 둔다 — 읽지 말고 표시만 보고 멈추는 연습.
                    <span className="flex flex-1 flex-col gap-1" aria-label="불편한 내용">
                      <span className="h-1.5 w-4/5 rounded-full bg-pink-200/50" />
                      <span className="h-1.5 w-3/5 rounded-full bg-pink-200/40" />
                    </span>
                  ) : (
                    <span className="text-[14px] font-bold text-slate-100">{card.label}</span>
                  )}
                </>
              )}
              {flash === card.id && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-1.5 py-0.5 text-[14px] font-bold text-slate-200">
                  괜찮은 내용이에요
                </span>
              )}
            </div>
          );
        })}

        {status === 'playing' && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-950/75">
            <p className="text-[15px] font-black text-amber-200">화면을 눌러 시작해요</p>
          </div>
        )}

        {(status === 'success' || status === 'fail') && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-950/75">
            <p className="text-[15px] font-black text-slate-100">
              {status === 'success' ? '🛡️ 모두 바로 덮었어요' : '다시 해 볼까요?'}
            </p>
          </div>
        )}
      </div>

      {status !== 'running' && status !== 'playing' && (
        <button
          type="button"
          onClick={retry}
          disabled={isLocked}
          className="mt-2 h-11 w-full rounded-xl border-2 border-slate-500/50 bg-slate-800 text-[14px] font-black text-slate-100"
        >
          🔄 다시 하기
        </button>
      )}
    </MiniGameFrame>
  );
}
