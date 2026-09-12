import React from 'react';
import BauhausMark from './BauhausMark';

interface HudProps {
  /** 남은 기회. 0이면 표시하지 않는다. */
  lives?: number;
  maxLives?: number;
  /** 점수. 연속값이라 "몇 개 맞혔나"가 아니라 "얼마나 잘했나"를 보여 준다. */
  score?: number;
  scoreLabel?: string;
  /** 남은 시간(초). 있으면 막대로 그린다. */
  timeLeft?: number;
  timeTotal?: number;
}

/** 기회 칩을 낱개로 늘어놓는 상한. 이보다 많으면 칩 하나와 숫자로 바꾼다. */
const CHIP_CAP = 8;

/**
 * 게임 상단 상태 표시.
 *
 * 남은 기회·점수·남은 시간은 거의 모든 게임에 필요한데, 게임마다 다른 자리에 다른
 * 모양으로 그리면 학생이 매번 새로 찾아야 한다. 한 곳에 두고 늘 같은 자리에 둔다.
 *
 * 남은 시간은 숫자보다 막대가 먼저 읽힌다. 숫자를 못 읽어도 줄어드는 막대는 보인다.
 */
export default function GameHud({
  lives,
  maxLives,
  score,
  scoreLabel = '점수',
  timeLeft,
  timeTotal,
}: HudProps) {
  const showLives = typeof lives === 'number' && typeof maxLives === 'number' && maxLives > 0;
  const showTime = typeof timeLeft === 'number' && typeof timeTotal === 'number' && timeTotal > 0;
  const timeRatio = showTime ? Math.max(0, Math.min(1, timeLeft / timeTotal)) : 0;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {showLives && (
        <span
          className="flex items-center gap-1 text-[15px] font-black"
          style={{ color: 'var(--game-board-yellow)' }}
        >
          <span className="sr-only">남은 기회 {lives}개</span>
          {/*
            칩은 여덟 개까지만 늘어놓는다. 뒤집기 횟수처럼 기회가 서른 번 넘게 주어지는
            게임에서는 칩이 줄을 가득 채우고 두 줄로 접혀 판을 눌렀다. 그때는 칩 하나와
            숫자로 바꿔 같은 자리에 같은 뜻을 남긴다.
          */}
          {maxLives <= CHIP_CAP ? (
            Array.from({ length: maxLives }).map((_, index) => (
              <span key={index} aria-hidden="true" style={{ opacity: index < (lives ?? 0) ? 1 : 0.25 }}>
                <BauhausMark kind="life" size={15} />
              </span>
            ))
          ) : (
            <span aria-hidden="true" className="inline-flex items-center gap-1">
              <BauhausMark kind="life" size={15} />
              <strong className="text-[18px]">{lives}</strong> / {maxLives}
            </span>
          )}
        </span>
      )}
      {typeof score === 'number' && (
        <span className="text-[15px] font-black" style={{ color: 'var(--game-board-ink)' }}>
          {scoreLabel} <strong className="text-[18px]">{Math.round(score)}</strong>
        </span>
      )}
      {showTime && (
        <span className="flex min-w-[120px] flex-1 items-center gap-2">
          <span className="sr-only">남은 시간 {Math.ceil(timeLeft)}초</span>
          <BauhausMark kind="bar" size={15} />
          <span
            aria-hidden="true"
            className="h-3 flex-1 overflow-hidden"
            style={{
              background: 'var(--game-board)',
              border: 'var(--game-hair) solid var(--game-board-grey)',
            }}
          >
            <span
              className="block h-full transition-[width] duration-100"
              style={{
                width: `${timeRatio * 100}%`,
                /* 얼마 안 남았을 때만 붉어진다. 먼저 읽히는 것은 줄어드는 길이다. */
                background: timeRatio < 0.25 ? 'var(--game-board-red)' : 'var(--game-board-blue)',
              }}
            />
          </span>
          <span
            className="w-9 text-right text-[15px] font-black"
            style={{ color: 'var(--game-board-ink)' }}
          >
            {Math.ceil(timeLeft)}
          </span>
        </span>
      )}
    </div>
  );
}
