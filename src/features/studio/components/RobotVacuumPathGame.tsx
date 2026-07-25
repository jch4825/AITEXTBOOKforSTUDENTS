import React, { useState, useEffect } from 'react';
import { useSpeak } from '../../../hooks/useSpeak';

interface Position {
  r: number;
  c: number;
}

const GRID_SIZE = 4; // 4x4 = 16 tiles
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

export default function RobotVacuumPathGame() {
  const { speakNow } = useSpeak();
  
  // Path of positions [{r: 0, c: 0}, ...]
  const [path, setPath] = useState<Position[]>([{ r: 0, c: 0 }]);
  const [simulatingIndex, setSimulatingIndex] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'drawing' | 'running' | 'success' | 'fail'>('drawing');
  const [isMouseDown, setIsMouseDown] = useState(false);

  const startPos = { r: 0, c: 0 };

  // Reset path to start
  const handleReset = () => {
    setPath([{ r: 0, c: 0 }]);
    setSimulatingIndex(null);
    setGameState('drawing');
    speakNow('처음부터 경로를 다시 그려봐요.');
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

    const last = path[path.length - 1];
    
    // If clicking the current last tile, do nothing
    if (last.r === r && last.c === c) return;

    // Check if clicked tile is already in path
    const existingIndex = getPathIndex(r, c);
    if (existingIndex !== -1) {
      // If clicking a previous tile in path, trim path back to that tile
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
    speakNow('로봇청소기 청소를 시작합니다!');
  };

  // Step-by-step animation loop
  useEffect(() => {
    if (gameState !== 'running' || simulatingIndex === null) return;

    if (simulatingIndex < path.length - 1) {
      const timer = setTimeout(() => {
        setSimulatingIndex(simulatingIndex + 1);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      // Finished moving through path
      if (path.length === TOTAL_TILES) {
        setGameState('success');
        speakNow('성공! 방 전체를 빠짐없이 깨끗하게 청소했습니다!');
      } else {
        setGameState('fail');
        speakNow(`청소하지 않은 바닥이 ${TOTAL_TILES - path.length}칸 남았어요. 처음으로 돌아갑니다.`);
        const resetTimer = setTimeout(() => {
          handleReset();
        }, 2000);
        return () => clearTimeout(resetTimer);
      }
    }
  }, [gameState, simulatingIndex, path]);

  // Current vacuum display position during simulation or drawing
  const currentPos =
    gameState === 'running' && simulatingIndex !== null
      ? path[simulatingIndex]
      : path[path.length - 1];

  const cleanedCount = path.length;
  const isAllClean = cleanedCount === TOTAL_TILES;

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
          <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-black">
            🤖 로봇청소기 한 붓 그리기 게임
          </span>
          <span className="text-xs font-black text-amber-200">
            청소한 바닥: <strong className="text-base text-amber-400">{cleanedCount}</strong> / {TOTAL_TILES} 칸
          </span>
        </div>
        <h3 className="text-lg font-black text-white tracking-tight">
          거실 바닥 전체를 한 붓 달리기로 구석구석 청소해 봐요!
        </h3>
        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          충전소(시작점)에서 출발해 이웃한 바닥 칸을 차례대로 눌러 경로를 만드세요. 모든 칸을 건드리지 않으면 처음으로 되돌아갑니다!
        </p>
      </div>

      {/* House Floor Plan Grid (집 조감도 그리드) */}
      <div className="my-3 mx-auto w-full max-w-[280px] sm:max-w-[320px] aspect-square bg-slate-800/90 border-4 border-amber-500/50 rounded-2xl p-2.5 shadow-2xl relative grid grid-cols-4 gap-2 backdrop-blur-md">
        {Array.from({ length: GRID_SIZE }).map((_, r) =>
          Array.from({ length: GRID_SIZE }).map((_, c) => {
            const isStart = r === 0 && c === 0;
            const inPath = isTileInPath(r, c);
            const pathIdx = getPathIndex(r, c);
            const isRobotHere = currentPos.r === r && currentPos.c === c;

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => handleTileClick(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                disabled={gameState === 'running'}
                className={`relative rounded-xl border-2 transition-all flex flex-col items-center justify-center font-extrabold select-none cursor-pointer overflow-hidden ${
                  isRobotHere
                    ? 'border-amber-400 bg-amber-400/30 shadow-lg scale-105 z-20'
                    : inPath
                      ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200 shadow-md'
                      : 'border-slate-700 bg-slate-900/80 text-slate-500 hover:border-amber-400/60 hover:bg-slate-800'
                }`}
              >
                {/* Robot Vacuum Icon */}
                {isRobotHere ? (
                  <div className="text-2xl sm:text-3xl animate-bounce">🤖</div>
                ) : isStart ? (
                  <div className="flex flex-col items-center">
                    <span className="text-xl sm:text-2xl">🔌</span>
                    <span className="text-[10px] font-black text-amber-300">시작</span>
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
        <div className="p-3 bg-emerald-500/20 border border-emerald-400/60 rounded-xl text-center text-emerald-200 text-xs font-black animate-pulse">
          🎉 성공! 방 전체 16칸을 빠짐없이 깨끗하게 청소했습니다! 🏆
        </div>
      )}

      {gameState === 'fail' && (
        <div className="p-3 bg-rose-500/20 border border-rose-400/60 rounded-xl text-center text-rose-200 text-xs font-black animate-bounce">
          ⚠️ 실패! 청소 안 한 바닥이 남아 처음으로 다시 돌아갑니다! 🔄
        </div>
      )}

      {/* Control Action Buttons */}
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={handleReset}
          disabled={gameState === 'running'}
          className="flex-1 h-11 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1"
        >
          <span>🔄</span> 처음부터 그리기
        </button>

        <button
          type="button"
          onClick={handleStartSimulation}
          disabled={gameState === 'running' || path.length < 2}
          className={`flex-1 h-11 font-black text-xs rounded-xl transition flex items-center justify-center gap-1 shadow-lg cursor-pointer ${
            isAllClean
              ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:scale-102 active:scale-98'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
          } ${gameState === 'running' || path.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>🚀</span> {gameState === 'running' ? '청소 작동 중...' : '로봇청소기 출발!'}
        </button>
      </div>
    </div>
  );
}
