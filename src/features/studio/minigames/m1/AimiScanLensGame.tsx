import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m1-l1 「아이미와 처음 만난 날」 — 아이미 스캔 렌즈.
 *
 * 돋보기를 끌어 장면을 훑으면 지나간 자리의 자료가 아이미에게 들어간다. 목표 결과를 만들 수
 * 있는 입력만 결과가 되고, 엉뚱한 입력은 물음표로 바뀔 뿐 점수가 깎이거나 판이 초기화되지 않는다.
 *
 * 차시 핵심은 "AI는 말·글·사진 같은 입력을 받아 번역·추천·분류를 한다"이다. 그래서 장면에
 * 입력 종류를 섞어 두되 무엇이 맞는 입력인지는 알려 주지 않는다. 맞는 자료를 목표보다 하나
 * 더 깔아 두어 어느 것을 어떤 경로로 훑든 완주할 수 있게 한다.
 */

type InputKind = 'speech' | 'record' | 'photo';
type Mark = 'taken' | 'rejected';

interface Item {
  id: string;
  kind: InputKind;
  emoji: string;
  /** 보드가 좁아도 겹치지 않도록 5자를 넘기지 않는다. */
  label: string;
  /** 보드 기준 퍼센트 좌표. 한 줄에 둘씩, x는 24~76% 안에 둔다(390px에서 밖으로 나가지 않는 한계). */
  x: number;
  y: number;
  /** 목표에 맞는 입력일 때 결과 띠에 쌓이는 조각 */
  result?: string;
}

interface Stage {
  id: string;
  label: string;
  goalEmoji: string;
  goalName: string;
  want: InputKind;
  goal: number;
  done: string;
  items: Item[];
}

/** 훑기 판정 반경(px). 조준 정확도를 요구하지 않도록 넉넉히 잡는다. */
const SCAN_RADIUS = 56;

const STAGES: Stage[] = [
  {
    id: 'translate',
    label: '번역',
    goalEmoji: '🌏',
    goalName: '다른 나라 말로 바꾸기',
    want: 'speech',
    goal: 3,
    done: '아이미가 친구 말을 알아듣고 다른 나라 말로 바꿨어요!',
    items: [
      { id: 't1', kind: 'speech', emoji: '🗣️', label: '“안녕”', x: 26, y: 12, result: 'Hello' },
      { id: 't2', kind: 'photo', emoji: '📷', label: '가방', x: 74, y: 12 },
      { id: 't3', kind: 'speech', emoji: '🗣️', label: '“고마워”', x: 24, y: 37, result: 'Thank you' },
      { id: 't4', kind: 'record', emoji: '🎵', label: '들은 곡', x: 70, y: 37 },
      { id: 't5', kind: 'speech', emoji: '🗣️', label: '“어디야”', x: 30, y: 62, result: 'Where are you?' },
      { id: 't6', kind: 'photo', emoji: '📷', label: '모자', x: 76, y: 62 },
      { id: 't7', kind: 'speech', emoji: '🗣️', label: '“잘 가”', x: 26, y: 87, result: 'Goodbye' },
      { id: 't8', kind: 'record', emoji: '🎵', label: '좋아요', x: 72, y: 87 },
    ],
  },
  {
    id: 'recommend',
    label: '추천',
    goalEmoji: '🎵',
    goalName: '내가 좋아할 노래 고르기',
    want: 'record',
    goal: 3,
    done: '아이미가 내가 들은 기록을 보고 노래를 골라 줬어요!',
    items: [
      { id: 'r1', kind: 'record', emoji: '🎵', label: '어제 노래', x: 26, y: 12, result: '비슷한 느린 노래' },
      { id: 'r2', kind: 'speech', emoji: '🗣️', label: '“배고파”', x: 74, y: 12 },
      { id: 'r3', kind: 'record', emoji: '🎵', label: '좋아요', x: 24, y: 37, result: '신나는 노래' },
      { id: 'r4', kind: 'photo', emoji: '📷', label: '신발', x: 70, y: 37 },
      { id: 'r5', kind: 'record', emoji: '🎵', label: '끝까지', x: 30, y: 62, result: '자주 듣던 노래' },
      { id: 'r6', kind: 'speech', emoji: '🗣️', label: '“안녕”', x: 76, y: 62 },
      { id: 'r7', kind: 'record', emoji: '🎵', label: '자주 듣기', x: 26, y: 87, result: '새로 나온 노래' },
      { id: 'r8', kind: 'photo', emoji: '📷', label: '우산', x: 72, y: 87 },
    ],
  },
  {
    id: 'sort',
    label: '분류',
    goalEmoji: '📦',
    goalName: '사진 속 물건 종류대로 나누기',
    want: 'photo',
    goal: 3,
    done: '아이미가 사진에서 물건을 찾아 종류대로 나눴어요!',
    items: [
      { id: 's1', kind: 'photo', emoji: '📷', label: '가방', x: 26, y: 12, result: '학용품' },
      { id: 's2', kind: 'record', emoji: '🎵', label: '들은 곡', x: 74, y: 12 },
      { id: 's3', kind: 'photo', emoji: '📷', label: '모자', x: 24, y: 37, result: '입는 것' },
      { id: 's4', kind: 'speech', emoji: '🗣️', label: '“고마워”', x: 70, y: 37 },
      { id: 's5', kind: 'photo', emoji: '📷', label: '신발', x: 30, y: 62, result: '신는 것' },
      { id: 's6', kind: 'speech', emoji: '🗣️', label: '“어디야”', x: 76, y: 62 },
      { id: 's7', kind: 'photo', emoji: '📷', label: '우산', x: 26, y: 87, result: '비 올 때' },
      { id: 's8', kind: 'record', emoji: '🎵', label: '자주 듣기', x: 72, y: 87 },
    ],
  },
];

export default function AimiScanLensGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];

  const boardRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  // 포인터 이동 콜백은 렌더 클로저보다 자주 실행되므로 판정 원본은 ref로 읽는다.
  const marksRef = useRef<Record<string, Mark>>({});
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [hinting, setHinting] = useState(false);

  useEffect(() => {
    marksRef.current = {};
    setMarks({});
    setLens(null);
    setHinting(false);
  }, [game.round, game.stageIndex]);

  useEffect(() => {
    if (!hinting) return;
    const timer = setTimeout(() => setHinting(false), 1200);
    return () => clearTimeout(timer);
  }, [hinting]);

  const applyMark = (item: Item) => {
    if (game.status !== 'playing') return;
    if (marksRef.current[item.id]) return;
    const ok = item.kind === stage.want;
    const next: Record<string, Mark> = {
      ...marksRef.current,
      [item.id]: ok ? 'taken' : 'rejected',
    };
    marksRef.current = next;
    setMarks(next);
    if (!ok) return;
    const taken = Object.values(next).filter((mark) => mark === 'taken').length;
    if (taken >= stage.goal) game.succeed(stage.done);
  };

  const sweep = (clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setLens({ x, y });
    for (const item of stage.items) {
      const itemX = (item.x / 100) * rect.width;
      const itemY = (item.y / 100) * rect.height;
      if (Math.hypot(itemX - x, itemY - y) <= SCAN_RADIUS) applyMark(item);
    }
  };

  // 포인터 캡처는 쓰지 않는다. 캡처하면 자료 버튼의 click이 막혀 탭·키보드 조작이 죽는다.
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (game.status !== 'playing') return;
    draggingRef.current = true;
    sweep(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    sweep(event.clientX, event.clientY);
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  const takenItems = stage.items.filter((item) => marks[item.id] === 'taken');
  const results = takenItems.map((item) => item.result).filter(Boolean) as string[];

  return (
    <MiniGameFrame
      badge="아이미 스캔 렌즈"
      instruction="돋보기를 끌어 장면을 훑어 보세요. 위에 적힌 결과를 만들 수 있는 자료만 아이미에게 들어갑니다. 자료를 눌러도 됩니다."
      accent="var(--brand-glow)"
      progress={{ label: '모은 결과', value: takenItems.length, max: stage.goal }}
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].goalName)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시" />
          {game.hintAllowed && (
            <MiniGameButton
              onClick={() => setHinting(true)}
              disabled={game.status !== 'playing'}
              emoji="💡"
              label="힌트"
            />
          )}
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="rounded-lg border-2 border-amber-400/50 bg-amber-400/10 px-2 py-1.5">
          <p className="text-[14px] font-black text-amber-300">오늘의 목표</p>
          <p className="text-[14px] font-bold text-slate-100">
            {stage.goalEmoji} {stage.goalName}
          </p>
        </div>

        <div
          ref={boardRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          style={{ touchAction: 'none' }}
          className="relative min-h-[250px] flex-1 overflow-hidden rounded-xl border-4 border-slate-500 bg-slate-950"
        >
          {stage.items.map((item) => {
            const mark = marks[item.id];
            const wanted = item.kind === stage.want;
            const flash = hinting && wanted && !mark;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => applyMark(item)}
                disabled={Boolean(mark) || game.status !== 'playing'}
                aria-label={
                  mark === 'rejected'
                    ? `${item.label} — 이 결과에는 쓰이지 않는 자료`
                    : `${item.label} 훑기`
                }
                className={`absolute flex min-h-12 min-w-12 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center leading-tight rounded-xl border-2 px-2 py-1 text-[14px] font-black transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${
                  mark === 'taken'
                    ? 'scale-0 border-transparent opacity-0'
                    : mark === 'rejected'
                      ? 'border-slate-600 bg-slate-800 text-slate-500 opacity-60'
                      : flash
                        ? 'border-amber-300 bg-amber-500/30 text-white motion-safe:animate-pulse'
                        : 'border-sky-300/70 bg-slate-800 text-white'
                }`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                <span aria-hidden="true">{mark === 'rejected' ? '❔' : item.emoji}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute grid h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-sky-300 bg-sky-400/15 text-2xl"
            style={{
              left: lens ? `${lens.x}px` : '50%',
              top: lens ? `${lens.y}px` : '50%',
            }}
          >
            🔍
          </span>
        </div>

        <div
          aria-live="polite"
          className="rounded-lg border-2 border-slate-500/60 bg-slate-900 px-2 py-1.5"
        >
          <p className="text-[14px] font-black text-slate-300">
            아이미가 만든 결과 {takenItems.length} / {stage.goal}
          </p>
          <p className="text-[14px] font-bold text-emerald-300">
            {results.length > 0 ? results.join(' · ') : '아직 없어요. 자료를 훑어 보세요.'}
          </p>
        </div>
      </div>
    </MiniGameFrame>
  );
}
