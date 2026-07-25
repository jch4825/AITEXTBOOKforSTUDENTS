import React, { useState, useEffect } from 'react';
import { useSpeak } from '../../../hooks/useSpeak';

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
  obstacles: Obstacle[];
  solution: Position[];
}

const GRID_SIZE = 4; // 4x4 = 16 tiles

// 100% 수학적으로 해결 가능한 검증된 배치들
const ROOM_LAYOUTS: RoomLayout[] = [
  {
    id: 'open_room',
    name: '기본: 탁 트인 넓은 방 (16칸 전체)',
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
    name: '1단계: 거실 (소파·테이블 피하기)',
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
    name: '2단계: 침실 (침대·옷장 피하기)',
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
    name: '3단계: 아이방 (곰인형·화분 피하기)',
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
    <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-slate-900 via-cyan-950 to-slate-800 border-2 border-cyan-400 shadow-md flex items-center justify-center">
      {/* Laser LiDAR Bump */}
      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-white" />
      </div>
      {/* Rotating brushes animation */}
      <div className={`absolute inset-0 rounded-full border border-dashed border-cyan-300/60 ${isRunning ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
      {/* Front Bumper */}
      <div className="absolute top-0.5 w-4 h-1 rounded-t-full bg-cyan-300/40" />
      <span className="sr-only">원형 로봇청소기</span>
    </div>
  );
}

export default function RobotVacuumPathGame() {
  const { speakNow } = useSpeak();
  
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const currentRoom = ROOM_LAYOUTS[selectedRoomIdx];

  const totalCleanable = 16 - currentRoom.obstacles.length;

  const [path, setPath] = useState<Position[]>([{ r: 0, c: 0 }]);
  const [simulatingIndex, setSimulatingIndex] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'drawing' | 'running' | 'success' | 'fail'>('drawing');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Check if position is an obstacle
  const getObstacleAt = (r: number, c: number) => {
    return currentRoom.obstacles.find((o) => o.r === r && o.c === c);
  };

  // Reset path to start
  const handleReset = (roomIdx = selectedRoomIdx) => {
    setSelectedRoomIdx(roomIdx);
    setPath([{ r: 0, c: 0 }]);
    setSimulatingIndex(null);
    setGameState('drawing');
    setShowHint(false);
  };

  // Switch room
  const handleSwitchRoom = (idx: number) => {
    handleReset(idx);
    speakNow(`${ROOM_LAYOUTS[idx].name}로 방을 바꿨어요. 바닥을 구석구석 청소해 봐요.`);
  };

  // Auto fill solution path when hint is clicked
  const handleUseHint = () => {
    setPath(currentRoom.solution);
    setShowHint(true);
    speakNow('정답 경로가 완성되었습니다! 원형 로봇청소기 출발 버튼을 눌러보세요.');
  };

  // Check if position is in path
  const isTileInPath = (r: number, c: number) => {
    return path.some((p) => p.r === r && p.c === c);
  };

  // Get index of position in path
  const getPathIndex = (r: number, c: number) => {
    return path.findIndex((p) => p.r === r && p.c === c);
  };

  // Try adding a tile to the path
  const tryAddTile = (r: number, c: number) => {
    if (gameState !== 'drawing') return;

    // Obstacles cannot be stepped on
    if (getObstacleAt(r, c)) return;

    const last = path[path.length - 1];
    
    // If clicking current last tile, do nothing
    if (last.r === r && last.c === c) return;

    // Check if clicked tile is already in path
    const existingIndex = getPathIndex(r, c);
    if (existingIndex !== -1) {
      // Trim path back to that tile
      setPath(path.slice(0, existingIndex + 1));
      return;
    }

    // Must be adjacent (up, down, left, right)
    const isAdjacent =
      (Math.abs(last.r - r) === 1 && last.c === c) ||
      (Math.abs(last.c - c) === 1 && last.r === r);

    if (isAdjacent) {
      const newPath = [...path, { r, c }];
      setPath(newPath);
    }
  };

  // Handle cell click / tap
  const handleTileClick = (r: number, c: number) => {
    tryAddTile(r, c);
  };

  // Handle mouse enter for drag drawing
  const handleMouseEnter = (r: number, c: number) => {
    if (isMouseDown) {
      tryAddTile(r, c);
    }
  };

  // Run simulation animation
  const handleStartSimulation = () => {
    if (path.length === 0) return;

    setGameState('running');
    setSimulatingIndex(0);
    speakNow('원형 로봇청소기 청소를 시작합니다!');
  };

  // Step-by-step animation loop
  useEffect(() => {
    if (gameState !== 'running' || simulatingIndex === null) return;

    if (simulatingIndex < path.length - 1) {
      const timer = setTimeout(() => {
        setSimulatingIndex(simulatingIndex + 1);
      }, 230);
      return () => clearTimeout(timer);
    } else {
      // Finished moving through path
      if (path.length === totalCleanable) {
        setGameState('success');
        speakNow('성공! 장애물을 피하고 모든 바닥을 완벽히 청소했습니다!');
      } else {
        setGameState('fail');
        speakNow(`청소 안 한 바닥이 ${totalCleanable - path.length}칸 남았어요. 처음으로 되돌아갑니다.`);
        const resetTimer = setTimeout(() => {
          handleReset(selectedRoomIdx);
        }, 2000);
        return () => clearTimeout(resetTimer);
      }
    }
  }, [gameState, simulatingIndex, path, totalCleanable, selectedRoomIdx]);

  // Current vacuum display position during simulation or drawing
  const currentPos =
    gameState === 'running' && simulatingIndex !== null
      ? path[simulatingIndex]
      : path[path.length - 1];

  const cleanedCount = path.length;
  const isAllClean = cleanedCount === totalCleanable;

  return (
    <div
      className="flex flex-col h-full justify-between rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white border border-amber-500/30 shadow-2xl overflow-y-auto"
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-black flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            원형 로봇청소기 한 붓 그리기 퍼즐
          </span>
          <span className="text-xs font-black text-amber-200">
            청소한 바닥: <strong className="text-base text-amber-400">{cleanedCount}</strong> / {totalCleanable} 칸
          </span>
        </div>

        {/* Room Stage Tabs */}
        <div className="flex items-center gap-1 pt-1 overflow-x-auto">
          {ROOM_LAYOUTS.map((room, idx) => (
            <button
              key={room.id}
              type="button"
              onClick={() => handleSwitchRoom(idx)}
              disabled={gameState === 'running'}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0 ${
                selectedRoomIdx === idx
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {room.name.split(':')[0]}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-300 font-semibold leading-relaxed pt-1">
          충전소(시작점 🔌)에서 출발해 이웃한 바닥 칸을 차례대로 눌러 경로를 만드세요. <strong>장애물은 지나갈 수 없으며, 모든 바닥 칸을 빠짐없이 청소해야 성공합니다!</strong>
        </p>
      </div>

      {/* House Floor Plan Grid (집 조감도 그리드) */}
      <div className="my-3 mx-auto w-full max-w-[280px] sm:max-w-[320px] aspect-square bg-slate-800/90 border-4 border-amber-500/50 rounded-2xl p-2.5 shadow-2xl relative grid grid-cols-4 gap-2 backdrop-blur-md">
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
                  className="relative rounded-xl border-2 border-slate-800 bg-slate-950/90 flex flex-col items-center justify-center select-none shadow-inner opacity-90"
                  title={obstacle.label}
                >
                  <span className="text-xl sm:text-2xl">{obstacle.emoji}</span>
                  <span className="text-[9px] font-bold text-slate-400 mt-0.5">{obstacle.label}</span>
                </div>
              );
            }

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => handleTileClick(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                disabled={gameState === 'running'}
                className={`relative rounded-xl border-2 transition-colors flex flex-col items-center justify-center font-extrabold select-none cursor-pointer overflow-hidden ${
                  isRobotHere
                    ? 'border-amber-400 bg-amber-400/30 shadow-md ring-2 ring-amber-400/80'
                    : inPath
                      ? 'border-cyan-400 bg-cyan-500/30 text-cyan-200 shadow-md'
                      : 'border-slate-700 bg-slate-900/80 text-slate-500 hover:border-amber-400/60 hover:bg-slate-800'
                }`}
              >
                {/* Robot Vacuum Icon */}
                {isRobotHere ? (
                  <CircularRobotVacuumIcon isRunning={gameState === 'running'} />
                ) : isStart ? (
                  <div className="flex flex-col items-center">
                    <span className="text-xl sm:text-2xl">🔌</span>
                    <span className="text-[10px] font-black text-amber-300">충전소</span>
                  </div>
                ) : inPath ? (
                  <div className="flex flex-col items-center">
                    <span className="text-sm sm:text-base">✨</span>
                    <span className="text-[10px] font-bold text-cyan-300">{pathIdx + 1}</span>
                  </div>
                ) : (
                  <span className="text-xs opacity-40">🧹</span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Game Status Feedback */}
      {gameState === 'success' && (
        <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/60 rounded-xl text-center text-emerald-200 text-xs font-black animate-pulse">
          🎉 성공! 장애물을 피하고 바닥 {totalCleanable}칸을 빠짐없이 완벽하게 청소했습니다! 🏆
        </div>
      )}

      {gameState === 'fail' && (
        <div className="p-2.5 bg-rose-500/20 border border-rose-400/60 rounded-xl text-center text-rose-200 text-xs font-black animate-bounce">
          ⚠️ 실패! 청소하지 않은 바닥이 남아서 처음으로 돌아갑니다! 🔄
        </div>
      )}

      {/* Control Action Buttons */}
      <div className="mt-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleReset(selectedRoomIdx)}
          disabled={gameState === 'running'}
          className="flex-1 h-11 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-bold text-[11px] rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1"
        >
          <span>🔄</span> 다시 그리기
        </button>

        <button
          type="button"
          onClick={handleUseHint}
          disabled={gameState === 'running'}
          className="flex-1 h-11 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/40 font-bold text-[11px] rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
        >
          <span>💡</span> 힌트(정답)
        </button>

        <button
          type="button"
          onClick={handleStartSimulation}
          disabled={gameState === 'running' || path.length < 2}
          className={`flex-1 h-11 font-black text-[11px] rounded-xl transition flex items-center justify-center gap-1 shadow-lg cursor-pointer ${
            isAllClean
              ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:scale-102 active:scale-98'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
          } ${gameState === 'running' || path.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>🚀</span> {gameState === 'running' ? '청소 중...' : '청소 출발!'}
        </button>
      </div>
    </div>
  );
}
