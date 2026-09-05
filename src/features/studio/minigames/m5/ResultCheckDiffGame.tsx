import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, GameStage, clamp, useCountdown } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m5-l8 · 조건표와 대조 (장르 12 · 틀린 그림 찾기)
 *
 * "완성했다는 결과를 처음 조건표와 나란히 대조한다"를 두 단계로 만든다.
 * 어긋난 곳을 찾는 것만으로는 끝나지 않고, 트레이에서 맞는 부품을 끌어다 채워야 고쳐진다.
 *
 * 찾기와 고치기를 나눠 둔 이유는, 이 차시가 "빠진 것을 찾아 채운다"까지를 요구하기 때문이다.
 */

interface Spot {
  id: string;
  x: number;
  y: number;
  emoji: string;
  /** 결과에서 무엇이 어긋났는지 */
  wrong: string;
  /** 채워야 할 부품 id */
  fix: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  title: string;
  conditions: { emoji: string; text: string }[];
  spots: Spot[];
  parts: { id: string; emoji: string; name: string }[];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'booth',
    label: '기본',
    spoken: '부스 조건표와 완성 사진을 대조해요.',
    title: '축제 부스',
    seconds: 110,
    conditions: [
      { emoji: '🪧', text: '간판을 답니다' },
      { emoji: '🪑', text: '의자 두 개를 놓습니다' },
      { emoji: '🔌', text: '전선을 바닥에 깝니다' },
      { emoji: '🧴', text: '손 세정제를 둡니다' },
      { emoji: '📋', text: '가격표를 붙입니다' },
    ],
    spots: [
      { id: 's1', x: 50, y: 22, emoji: '❔', wrong: '간판이 없습니다', fix: 'sign' },
      { id: 's2', x: 26, y: 62, emoji: '🪑', wrong: '의자가 하나뿐입니다', fix: 'chair' },
      { id: 's3', x: 72, y: 74, emoji: '❔', wrong: '전선이 깔리지 않았습니다', fix: 'wire' },
    ],
    parts: [
      { id: 'sign', emoji: '🪧', name: '간판' },
      { id: 'chair', emoji: '🪑', name: '의자' },
      { id: 'wire', emoji: '🔌', name: '전선' },
      { id: 'plant', emoji: '🪴', name: '화분' },
      { id: 'lamp', emoji: '💡', name: '전등' },
    ],
  },
  {
    id: 'lunch',
    label: '1단계',
    spoken: '도시락 조건표와 완성 사진을 대조해요.',
    title: '나눔 도시락',
    seconds: 100,
    conditions: [
      { emoji: '🍚', text: '밥을 담습니다' },
      { emoji: '🥕', text: '채소를 넣습니다' },
      { emoji: '🥚', text: '단백질을 넣습니다' },
      { emoji: '🧊', text: '아이스팩을 넣습니다' },
      { emoji: '🏷️', text: '알레르기 표시를 붙입니다' },
    ],
    spots: [
      { id: 's1', x: 30, y: 30, emoji: '❔', wrong: '채소가 빠졌습니다', fix: 'veg' },
      { id: 's2', x: 68, y: 34, emoji: '❔', wrong: '아이스팩이 없습니다', fix: 'ice' },
      { id: 's3', x: 48, y: 74, emoji: '❔', wrong: '알레르기 표시가 없습니다', fix: 'tag' },
    ],
    parts: [
      { id: 'veg', emoji: '🥕', name: '채소' },
      { id: 'ice', emoji: '🧊', name: '아이스팩' },
      { id: 'tag', emoji: '🏷️', name: '알레르기 표시' },
      { id: 'candy', emoji: '🍬', name: '사탕' },
      { id: 'fork', emoji: '🍴', name: '포크' },
    ],
  },
  {
    id: 'board',
    label: '2단계',
    spoken: '게시판 조건표와 완성 사진을 대조해요.',
    title: '알림 게시판',
    seconds: 90,
    conditions: [
      { emoji: '📅', text: '날짜를 크게 적습니다' },
      { emoji: '📍', text: '장소를 적습니다' },
      { emoji: '🕘', text: '시각을 적습니다' },
      { emoji: '🎒', text: '준비물을 적습니다' },
      { emoji: '☎️', text: '문의할 곳을 적습니다' },
    ],
    spots: [
      { id: 's1', x: 26, y: 26, emoji: '❔', wrong: '날짜가 빠졌습니다', fix: 'date' },
      { id: 's2', x: 70, y: 44, emoji: '❔', wrong: '준비물이 빠졌습니다', fix: 'bag' },
      { id: 's3', x: 40, y: 76, emoji: '❔', wrong: '문의할 곳이 빠졌습니다', fix: 'call' },
      { id: 's4', x: 78, y: 74, emoji: '❔', wrong: '시각이 빠졌습니다', fix: 'clock' },
    ],
    parts: [
      { id: 'date', emoji: '📅', name: '날짜' },
      { id: 'bag', emoji: '🎒', name: '준비물' },
      { id: 'call', emoji: '☎️', name: '문의' },
      { id: 'clock', emoji: '🕘', name: '시각' },
      { id: 'star', emoji: '⭐', name: '장식' },
    ],
  },
];

export default function ResultCheckDiffGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 제한 시간·기회·표시 크기로 나타난다. 대조할 조건은 셋 모두 같다. */
  const seconds = Math.round(stage.seconds * tuning.time);
  const maxLives = tuning.lives;
  const spotSize = 46 * clamp(tuning.size, 0.85, 1.25);

  const [found, setFound] = useState<string[]>([]);
  const [fixed, setFixed] = useState<string[]>([]);
  const [holding, setHolding] = useState<string | null>(null);
  const [lives, setLives] = useState(maxLives);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setFound([]);
    setFixed([]);
    setHolding(null);
    setLives(maxLives);
    setNote('');
    setDone(false);
  }, [game.round, game.stageIndex, stage, maxLives]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    if (!done) game.fail('시간이 지났어요. 조건표와 사진을 한 줄씩 견주어 봐요.');
  });

  const loseLife = (message: string) => {
    setNote(message);
    setLives((value) => {
      const left = value - 1;
      if (left <= 0 && !done) {
        setDone(true);
        game.fail('어긋난 곳을 찾지 못했어요. 조건표의 그림과 사진을 하나씩 견주어 봐요.');
      }
      return left;
    });
  };

  const tapSpot = (spot: Spot) => {
    if (!game.playing || done) return;
    if (fixed.includes(spot.id)) return;

    if (!found.includes(spot.id)) {
      playSound('select');
      setFound((prev) => [...prev, spot.id]);
      setNote(`${spot.wrong} 트레이에서 맞는 부품을 눌러 채우세요.`);
      return;
    }
    if (!holding) {
      setNote('아래 트레이에서 채울 부품을 먼저 고르세요.');
      return;
    }
    if (holding !== spot.fix) {
      setHolding(null);
      loseLife('그 부품은 이 자리에 맞지 않아요.');
      return;
    }
    playSound('stamp');
    const next = [...fixed, spot.id];
    setFixed(next);
    setHolding(null);
    setNote('빠진 것을 채웠어요.');
    if (next.length >= stage.spots.length) {
      setDone(true);
      game.succeed('조건표와 결과를 대조해 빠진 것을 모두 찾아 채웠어요!');
    }
  };

  const tapEmpty = () => {
    if (!game.playing || done) return;
    loseLife('그 자리는 조건표와 같아요. 다른 곳을 살펴봐요.');
  };

  return (
    <MiniGameFrame
      badge="조건표와 대조"
      instruction="완성된 그림에서 조건과 다른 부분을 찾아 누른 뒤, 아래 상자에서 알맞은 물건을 골라 바꾸어 보세요."
      progress={{ label: '고친 곳', value: fixed.length, max: stage.spots.length }}
      hud={<GameHud lives={lives} maxLives={maxLives} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 대조하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          {stage.conditions.map((cond) => (
            <span
              key={cond.text}
              className="rounded-lg px-2 py-1 text-[14px] font-black"
              style={{ background: 'var(--board-surface)', border: '2px solid #38BDF8', color: 'var(--board-ink)' }}
            >
              {cond.emoji} {cond.text}
            </span>
          ))}
        </div>

        <GameStage
          ariaLabel={`${stage.title} 완성 사진. 조건표와 어긋난 곳 ${stage.spots.length}군데를 찾습니다.`}
          onPointer={(pointer) => {
            if (pointer.phase !== 'down') return;
            const hit = stage.spots.find(
              (spot) => Math.abs(pointer.x - spot.x) < 9 && Math.abs(pointer.y - spot.y) < 12,
            );
            if (hit) tapSpot(hit);
            else tapEmpty();
          }}
        >
          <span
            className="absolute left-1/2 top-2 -translate-x-1/2 rounded-lg px-2 py-0.5 text-[15px] font-black"
            style={{ background: 'var(--board-overlay)', border: '2px solid var(--board-line)', color: 'var(--board-ink)' }}
          >
            {stage.title} 완성 사진
          </span>
          {stage.spots.map((spot) => {
            const isFound = found.includes(spot.id);
            const isFixed = fixed.includes(spot.id);
            if (!isFound && !isFixed) return null;
            return (
              <span
                key={spot.id}
                className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[20px]"
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  width: spotSize,
                  height: spotSize,
                  background: isFixed ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 113, 133, 0.2)',
                  border: `3px solid ${isFixed ? '#4ADE80' : '#FB7185'}`,
                  color: 'var(--board-ink)',
                }}
              >
                {isFixed ? stage.parts.find((p) => p.id === spot.fix)?.emoji : spot.emoji}
              </span>
            );
          })}
        </GameStage>

        <div className="flex flex-wrap gap-1.5">
          {stage.parts.map((part) => {
            const on = holding === part.id;
            const used = fixed.some((id) => stage.spots.find((s) => s.id === id)?.fix === part.id);
            return (
              <button
                key={part.id}
                type="button"
                onClick={() => setHolding(on ? null : part.id)}
                disabled={!game.playing || used}
                aria-pressed={on}
                className="min-h-11 rounded-xl px-2.5 text-[15px] font-black transition"
                style={{
                  background: used ? 'rgba(74, 222, 128, 0.16)' : on ? '#FBBF24' : 'var(--board-surface)',
                  color: on ? '#3B2100' : 'var(--board-ink)',
                  border: `2px solid ${used ? '#4ADE80' : '#FBBF24'}`,
                }}
              >
                {part.emoji} {part.name}
              </button>
            );
          })}
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
