import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'friend', label: '기본', audience: '친구 한 명' },
  { id: 'class', label: '1단계', audience: '학급 게시판' },
  { id: 'online', label: '2단계', audience: '온라인 공개' },
];
const HOTSPOTS = [
  { x: 18, y: 28, label: '친구 얼굴' },
  { x: 72, y: 22, label: '이름표' },
  { x: 37, y: 72, label: '차량 번호' },
  { x: 78, y: 70, label: '집 위치' },
];

export default function PhotoMagnifierGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const [lens, setLens] = useState({ x: 50, y: 50 });
  const [found, setFound] = useState<number[]>([]);
  useEffect(() => setFound([]), [game.round, game.stageIndex]);

  const visible = (spot: (typeof HOTSPOTS)[number]) =>
    Math.hypot(spot.x - lens.x, spot.y - lens.y) < 24;
  const focusSpot = (spot: (typeof HOTSPOTS)[number]) => setLens({ x: spot.x, y: spot.y });

  return (
    <MiniGameFrame
      badge="사진 돋보기 검사"
      instruction="사진 위에서 돋보기를 움직여 숨은 단서를 찾고, 보이는 단서를 눌러 가리세요. 끌기 어렵다면 아래 단서 버튼으로 돋보기를 옮길 수 있어요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].audience)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton
            onClick={() =>
              found.length === HOTSPOTS.length
                ? game.succeed('사진 전체를 훑어 공유 전에 필요한 단서를 모두 가렸어요!')
                : game.fail('돋보기로 사진 구석까지 더 살펴봐요.')
            }
            emoji="📤"
            label="보내기 전 확인"
            variant="primary"
          />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 검사" />
        )
      }
    >
      <div
        className="relative min-h-[255px] flex-1 touch-none overflow-hidden rounded-xl border-4 border-slate-400 bg-gradient-to-br from-rose-900 via-sky-900 to-emerald-900"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setLens({
            x: ((event.clientX - rect.left) / rect.width) * 100,
            y: ((event.clientY - rect.top) / rect.height) * 100,
          });
        }}
        onPointerDown={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setLens({
            x: ((event.clientX - rect.left) / rect.width) * 100,
            y: ((event.clientY - rect.top) / rect.height) * 100,
          });
        }}
      >
        <span className="absolute left-[45%] top-[40%] text-[42px]" aria-hidden="true">
          🧑‍🤝‍🧑
        </span>
        {HOTSPOTS.map((spot, index) => (
          <button
            key={spot.label}
            type="button"
            onClick={() => visible(spot) && setFound((items) => (items.includes(index) ? items : [...items, index]))}
            className={`absolute min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 px-2 text-[14px] font-black transition-opacity ${
              found.includes(index)
                ? 'border-fuchsia-200 bg-fuchsia-600 text-white opacity-100'
                : visible(spot)
                  ? 'border-amber-200 bg-amber-900 text-white opacity-100'
                  : 'border-transparent bg-transparent text-transparent opacity-0'
            }`}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          >
            {found.includes(index) ? '⭐ 가림' : spot.label}
          </button>
        ))}
        <div
          className="board-spotlight-mask is-soft pointer-events-none absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-white/10"
          style={{ left: `${lens.x}%`, top: `${lens.y}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5" aria-label="돋보기 위치 대체 버튼">
        {HOTSPOTS.map((spot) => <button key={spot.label} type="button" onClick={() => focusSpot(spot)} className="min-h-11 rounded-lg border-2 border-sky-300 bg-sky-950 px-2 text-[14px] font-black text-white">🔎 {spot.label}로 이동</button>)}
      </div>
    </MiniGameFrame>
  );
}
