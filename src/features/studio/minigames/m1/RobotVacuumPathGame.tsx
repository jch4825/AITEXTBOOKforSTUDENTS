import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { useSpeak } from '../../../../hooks/useSpeak';
import { BauhausMark } from '../engine';
import type { MiniGameProps } from '../types';

interface Position {
  r: number;
  c: number;
}

interface Obstacle {
  r: number;
  c: number;
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
      { r: 0, c: 1, label: '소파' },
      { r: 2, c: 2, label: '테이블' },
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
      { r: 0, c: 2, label: '침대' },
      { r: 0, c: 3, label: '옷장' },
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
      { r: 0, c: 1, label: '곰인형' },
      { r: 2, c: 0, label: '화분' },
    ],
    solution: [
      { r: 0, c: 0 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 1 },
      { r: 2, c: 2 }, { r: 1, c: 2 }, { r: 0, c: 2 }, { r: 0, c: 3 },
      { r: 1, c: 3 }, { r: 2, c: 3 }, { r: 3, c: 3 }, { r: 3, c: 2 },
      { r: 3, c: 1 }, { r: 3, c: 0 },
    ],
  },
];

/**
 * 청소기.
 *
 * 학생이 움직이는 것은 판마다 늘 노랑 동그라미다. 여기서는 그 규칙이 마침 사물의
 * 생김새와도 맞는다 — 로봇청소기는 실제로 동그랗다. 청소하는 동안에는 테두리가
 * 돌아 "지금 움직이는 중"을 글자 없이 알린다.
 */
function CircularRobotVacuumIcon({ isRunning = false }: { isRunning?: boolean }) {
  return (
    <div
      className="relative grid h-7 w-7 place-items-center rounded-full sm:h-8 sm:w-8"
      style={{
        background: 'var(--game-board-yellow)',
        border: 'var(--game-line) solid var(--game-board-keyline)',
      }}
    >
      <div
        className="h-2 w-2 rounded-full"
        style={{ background: 'var(--game-board)' }}
      />
      <div
        className={`absolute inset-[-5px] rounded-full${isRunning ? ' animate-spin' : ''}`}
        style={{
          border: 'var(--game-hair) dashed var(--game-board-yellow)',
          animationDuration: '3s',
        }}
      />
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
      instruction="파란 네모가 그려진 충전소에서 출발해 바닥 칸을 차례대로 눌러 청소 길을 만들어 보세요. 붉은 세모는 가구이니 피해서 모든 바닥을 빠짐없이 청소해 봅시다."
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
          <MiniGameButton onClick={retry} disabled={isLocked} mark="retry" label="다시 그리기" />
          {hintAllowed && (
            <MiniGameButton onClick={handleUseHint} disabled={isLocked} mark="bang" label="힌트" />
          )}
          <MiniGameButton
            onClick={handleStart}
            disabled={isLocked || path.length < 2}
            mark="arrow"
            label={status === 'running' ? '청소 중…' : '청소 출발!'}
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2">
        <p className="text-[14px] font-bold" style={{ color: 'var(--game-board-grey)' }}>
          {currentRoom.name}
        </p>
        <div
          ref={gridRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerLeave={stopDrawing}
          className="grid aspect-square w-full max-w-[268px] grid-cols-4 grid-rows-4 gap-2 p-2.5 sm:max-w-[300px]"
          style={{
            touchAction: 'none',
            background: 'var(--game-board)',
            border: 'var(--game-heavy) solid var(--game-board-grey)',
          }}
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
                    className="flex aspect-square h-full w-full select-none flex-col items-center justify-center gap-0.5"
                    style={{
                      background: 'var(--game-board)',
                      border: 'var(--game-line) solid var(--game-board-red)',
                      color: 'var(--game-board-red-ink)',
                    }}
                  >
                    <BauhausMark kind="triangle" size={22} />
                    <span className="pointer-events-none text-[14px] font-bold">
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
                  className="relative aspect-square h-full w-full select-none overflow-hidden transition-colors"
                  style={{
                    /* 지나온 칸은 파랑으로 꽉 찬다. 청소기가 선 칸만 노랑 테두리를 두르고,
                       아직 밟지 않은 칸은 회색 테두리로 남는다. 색이 아니라 이 세 상태가
                       각각 다른 굵기와 채움으로 갈린다. */
                    background: inPath ? 'var(--game-board-blue)' : 'var(--game-board)',
                    border: `var(--game-line) solid ${
                      isRobotHere ? 'var(--game-board-yellow)'
                        : inPath ? 'var(--game-board-blue)' : 'var(--game-board-grey)'}`,
                    color: inPath ? 'var(--game-board)' : 'var(--game-board-grey)',
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-1">
                    {isRobotHere ? (
                      <CircularRobotVacuumIcon isRunning={status === 'running'} />
                    ) : isStart ? (
                      <div
                        className="flex flex-col items-center gap-0.5 leading-none"
                        style={{ color: inPath ? 'var(--game-board)' : 'var(--game-board-blue)' }}
                      >
                        <BauhausMark kind="square" size={18} />
                        <span className="text-[14px] font-black">충전소</span>
                      </div>
                    ) : inPath ? (
                      <span className="text-[17px] font-black">{pathIdx + 1}</span>
                    ) : (
                      <BauhausMark kind="dot" size={12} />
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
