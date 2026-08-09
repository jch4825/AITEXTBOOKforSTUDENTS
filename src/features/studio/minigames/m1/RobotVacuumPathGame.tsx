import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { useSpeak } from '../../../../hooks/useSpeak';
import type { MiniGameProps } from '../types';

interface Position {
  r: number;
  c: number;
}

interface Obstacle {
  r: number;
  c: number;
  emoji: string;
  label: string;
}

interface RoomLayout {
  id: string;
  name: string;
  tab: string;
  obstacles: Obstacle[];
  solution: Position[];
}

const GRID_SIZE = 4; // 4x4 = 16칸

// 모든 배치는 한 붓 그리기로 완주 가능함이 검증된 해를 함께 보관한다(힌트용).
const ROOM_LAYOUTS: RoomLayout[] = [
  {
    id: 'open_room',
    name: '탁 트인 넓은 방',
    tab: '기본',
    obstacles: [],
    solution: [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 },
      { r: 1, c: 3 }, { r: 1, c: 2 }, { r: 1, c: 1 }, { r: 1, c: 0 },
      { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 2, c: 3 },
      { r: 3, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 1 }, { r: 3, c: 0 },
    ],
  },
  {
    id: 'living_room',
    name: '거실 (소파·테이블 피하기)',
    tab: '1단계',
    obstacles: [
      { r: 0, c: 1, emoji: '🛋️', label: '소파' },
      { r: 2, c: 2, emoji: '🪵', label: '테이블' },
    ],
    solution: [
      { r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 },
      { r: 3, c: 1 }, { r: 2, c: 1 }, { r: 1, c: 1 }, { r: 1, c: 2 },
      { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 1, c: 3 }, { r: 2, c: 3 },
      { r: 3, c: 3 }, { r: 3, c: 2 },
    ],
  },
  {
    id: 'bedroom',
    name: '침실 (침대·옷장 피하기)',
    tab: '2단계',
    obstacles: [
      { r: 0, c: 2, emoji: '🛏️', label: '침대' },
      { r: 0, c: 3, emoji: '🚪', label: '옷장' },
    ],
    solution: [
      { r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 },
      { r: 3, c: 1 }, { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 3, c: 2 },
      { r: 3, c: 3 }, { r: 2, c: 3 }, { r: 1, c: 3 }, { r: 1, c: 2 },
      { r: 1, c: 1 }, { r: 0, c: 1 },
    ],
  },
  {
    id: 'toy_room',
    name: '아이방 (곰인형·화분 피하기)',
    tab: '3단계',
    obstacles: [
      { r: 0, c: 1, emoji: '🧸', label: '곰인형' },
      { r: 2, c: 0, emoji: '🪴', label: '화분' },
    ],
    solution: [
      { r: 0, c: 0 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 1 },
      { r: 2, c: 2 }, { r: 1, c: 2 }, { r: 0, c: 2 }, { r: 0, c: 3 },
      { r: 1, c: 3 }, { r: 2, c: 3 }, { r: 3, c: 3 }, { r: 3, c: 2 },
      { r: 3, c: 1 }, { r: 3, c: 0 },
    ],
  },
];

function CircularRobotVacuumIcon({ isRunning = false }: { isRunning?: boolean }) {
  return (
    <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-cyan-400 bg-gradient-to-tr from-slate-900 via-cyan-950 to-slate-800 depth-paper sm:h-8 sm:w-8">
      <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-white bg-cyan-400">
        <div className="h-1 w-1 rounded-full bg-white" />
      </div>
      <div
        className={`absolute inset-0 rounded-full border border-dashed border-cyan-300/60 ${isRunning ? 'animate-spin' : ''}`}
        style={{ animationDuration: '3s' }}
      />
      <div className="absolute top-0.5 h-1 w-4 rounded-t-full bg-cyan-300/40" />
      <span className="sr-only">원형 로봇청소기</span>
    </div>
  );
}

export default function RobotVacuumPathGame({ supportLevel }: MiniGameProps) {
  const { speakNow } = useSpeak();
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
  } = useMiniGameStage({ supportLevel, stageCount: ROOM_LAYOUTS.length });

  const currentRoom = ROOM_LAYOUTS[stageIndex];
  const totalCleanable = GRID_SIZE * GRID_SIZE - currentRoom.obstacles.length;

  const [path, setPath] = useState<Position[]>([{ r: 0, c: 0 }]);
  const [simIndex, setSimIndex] = useState<number | null>(null);
  const [drawing, setDrawing] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // 스테이지가 바뀌거나 다시 하기를 누르면 충전소에서 새로 시작한다.
  useEffect(() => {
    setPath([{ r: 0, c: 0 }]);
    setSimIndex(null);
    setDrawing(false);
  }, [round, stageIndex]);

  const getObstacleAt = (r: number, c: number) =>
    currentRoom.obstacles.find((o) => o.r === r && o.c === c);

  const isTileInPath = (r: number, c: number) => path.some((p) => p.r === r && p.c === c);
  const getPathIndex = (r: number, c: number) => path.findIndex((p) => p.r === r && p.c === c);

  const tryAddTile = (r: number, c: number) => {
    if (status !== 'playing') return;
    if (getObstacleAt(r, c)) return;

    setPath((prev) => {
      const last = prev[prev.length - 1];
      if (last.r === r && last.c === c) return prev;

      // 이미 지나온 칸을 다시 누르면 거기까지 되감는다 — 지우개 없이 고쳐 그릴 수 있게.
      const existing = prev.findIndex((p) => p.r === r && p.c === c);
      if (existing !== -1) return prev.slice(0, existing + 1);

      const adjacent =
        (Math.abs(last.r - r) === 1 && last.c === c) ||
        (Math.abs(last.c - c) === 1 && last.r === r);
      return adjacent ? [...prev, { r, c }] : prev;
    });
  };

  /**
   * 손가락·마우스 위치에서 칸을 찾는다.
   * 터치는 처음 닿은 요소가 포인터를 붙잡아 onPointerEnter가 오지 않으므로,
   * 좌표로 직접 조회해야 끌어서 그리기가 모바일에서도 동작한다.
   */
  const cellFromPoint = (x: number, y: number): Position | null => {
    const el = document.elementFromPoint(x, y);
    const cell = el && (el as HTMLElement).closest?.('[data-cell]');
    if (!cell) return null;
    const r = Number((cell as HTMLElement).dataset.r);
    const c = Number((cell as HTMLElement).dataset.c);
    return Number.isFinite(r) && Number.isFinite(c) ? { r, c } : null;
  };

  const handlePointerDown = (e: any) => {
    if (status !== 'playing') return;
    setDrawing(true);
    const pos = cellFromPoint(e.clientX, e.clientY);
    if (pos) tryAddTile(pos.r, pos.c);
  };

  const handlePointerMove = (e: any) => {
    if (!drawing || status !== 'playing') return;
    const pos = cellFromPoint(e.clientX, e.clientY);
    if (pos) tryAddTile(pos.r, pos.c);
  };

  const stopDrawing = () => setDrawing(false);

  const handleUseHint = () => {
    setPath(currentRoom.solution);
    speakNow('길이 완성되었어요. 청소 출발 버튼을 눌러 보세요.');
  };

  const handleStart = () => {
    if (path.length < 2) return;
    setSimIndex(0);
    run('청소를 시작합니다!');
  };

  // 경로를 따라 한 칸씩 이동하고, 끝에서 모두 청소했는지 확인한다.
  useEffect(() => {
    if (status !== 'running' || simIndex === null) return;

    if (simIndex < path.length - 1) {
      const timer = setTimeout(() => setSimIndex(simIndex + 1), 230);
      return () => clearTimeout(timer);
    }

    if (path.length === totalCleanable) {
      succeed(`장애물을 피하고 바닥 ${totalCleanable}칸을 모두 청소했어요!`);
    } else {
      fail(`청소 안 한 바닥이 ${totalCleanable - path.length}칸 남았어요. 다시 그려 봐요.`);
    }
  }, [status, simIndex, path, totalCleanable, succeed, fail]);

  const currentPos =
    status === 'running' && simIndex !== null ? path[simIndex] : path[path.length - 1];

  return (
    <MiniGameFrame
      badge="로봇청소기 한 붓 그리기"
      instruction="충전소(🔌)에서 출발해 옆 칸을 이어서 눌러 길을 그려요. 끌기 대신 칸을 차례로 눌러도 됩니다. 장애물은 지나갈 수 없고, 바닥을 하나도 남기지 않아야 성공합니다."
      progress={{ label: '청소한 바닥', value: path.length, max: totalCleanable }}
      stages={ROOM_LAYOUTS.slice(0, visibleStageCount).map((room) => ({
        id: room.id,
        label: room.tab,
      }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) =>
        goToStage(index, `${ROOM_LAYOUTS[index].name}으로 바꿨어요. 구석구석 청소해 봐요.`)
      }
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="다시 그리기" />
          {hintAllowed && (
            <MiniGameButton onClick={handleUseHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={handleStart}
            disabled={isLocked || path.length < 2}
            emoji="🚀"
            label={status === 'running' ? '청소 중…' : '청소 출발!'}
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2">
        <p className="text-[14px] font-bold text-slate-300">{currentRoom.name}</p>
        <div
          ref={gridRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerLeave={stopDrawing}
          style={{ touchAction: 'none' }}
          className="grid aspect-square w-full max-w-[268px] grid-cols-4 grid-rows-4 gap-2 rounded-2xl border-4 border-slate-600/50 bg-slate-800/90 p-2.5 depth-overlay sm:max-w-[300px]"
        >
          {Array.from({ length: GRID_SIZE }).map((_, r) =>
            Array.from({ length: GRID_SIZE }).map((_, c) => {
              const isStart = r === 0 && c === 0;
              const obstacle = getObstacleAt(r, c);
              const inPath = isTileInPath(r, c);
              const pathIdx = getPathIndex(r, c);
              const isRobotHere = currentPos.r === r && currentPos.c === c;

              if (obstacle) {
                return (
                  <div
                    key={`${r}-${c}`}
                    data-cell
                    data-r={r}
                    data-c={c}
                    title={obstacle.label}
                    className="flex aspect-square h-full w-full select-none flex-col items-center justify-center rounded-xl border-2 border-slate-800 bg-slate-950/90 opacity-90 depth-overlay"
                  >
                    <span className="pointer-events-none text-xl sm:text-2xl">{obstacle.emoji}</span>
                    <span className="pointer-events-none mt-0.5 text-[14px] font-bold text-slate-400">
                      {obstacle.label}
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  data-cell
                  data-r={r}
                  data-c={c}
                  disabled={isLocked}
                  onClick={() => tryAddTile(r, c)}
                  aria-label={`${r + 1}행 ${c + 1}열${inPath ? ', 청소함' : ''}`}
                  className={`relative aspect-square h-full w-full select-none overflow-hidden rounded-xl border-2 transition-colors ${
                    isRobotHere
                      ? 'border-amber-400 bg-amber-400/30 ring-2 ring-amber-400/80'
                      : inPath
                        ? 'border-cyan-400 bg-cyan-500/30 text-cyan-200'
                        : 'border-slate-700 bg-slate-900/80 text-slate-500 hover:border-amber-400/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-1">
                    {isRobotHere ? (
                      <CircularRobotVacuumIcon isRunning={status === 'running'} />
                    ) : isStart ? (
                      <div className="flex flex-col items-center leading-none">
                        <span className="text-lg sm:text-xl">🔌</span>
                        <span className="mt-0.5 text-[14px] font-black text-amber-300">충전소</span>
                      </div>
                    ) : inPath ? (
                      <div className="flex flex-col items-center leading-none">
                        <span className="text-[14px] sm:text-[15px]">✨</span>
                        <span className="mt-0.5 text-[14px] font-bold text-cyan-300">
                          {pathIdx + 1}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[14px] opacity-40">🧹</span>
                    )}
                  </div>
                </button>
              );
            }),
          )}
        </div>
      </div>
    </MiniGameFrame>
  );
}
