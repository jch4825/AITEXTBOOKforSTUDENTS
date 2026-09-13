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
/** 시간 막대의 눈금 수. 레퍼런스의 박자 막대처럼 칸을 나눠 줄어드는 양을 셀 수 있게 한다. */
const TIME_TICKS = 8;

/**
 * 게임 상단 상태 표시.
 *
 * 남은 기회·점수·남은 시간은 거의 모든 게임에 필요한데, 게임마다 다른 자리에 다른
 * 모양으로 그리면 학생이 매번 새로 찾아야 한다. 한 곳에 두고 늘 같은 자리에 둔다.
 *
 * 레퍼런스를 따라 셋 모두 테두리 두른 딱지에 담는다. 딱지의 이름(기회·점수·시간)은
 * 작게, 값은 크게 적어 눈이 값으로 먼저 간다. 남은 시간은 숫자보다 막대가 먼저 읽힌다.
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

  const chip: React.CSSProperties = {
    background: 'var(--game-board)',
    border: 'var(--game-hair) solid var(--game-board-line)',
  };

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
      {showLives && (
        <span className="game-lift-1 flex items-center gap-2 px-2 py-1" style={chip}>
          <span className="game-label" style={{ color: 'var(--game-board-muted)' }}>기회</span>
          <span className="sr-only">남은 기회 {lives}개</span>
          {/*
            칩은 여덟 개까지만 늘어놓는다. 뒤집기 횟수처럼 기회가 서른 번 넘게 주어지는
            게임에서는 칩이 줄을 가득 채우고 두 줄로 접혀 판을 눌렀다. 그때는 칩 하나와
            숫자로 바꿔 같은 자리에 같은 뜻을 남긴다.
          */}
          {maxLives <= CHIP_CAP ? (
            <span aria-hidden="true" className="flex items-center gap-[3px]">
              {Array.from({ length: maxLives }).map((_, index) => {
                const on = index < (lives ?? 0);
                return (
                  <span
                    key={index}
                    className="block h-3.5 w-3.5"
                    style={{
                      background: on ? 'var(--game-board-yellow)' : 'var(--game-board-high)',
                      border: on ? 'none' : '1px solid var(--game-board-line)',
                    }}
                  />
                );
              })}
            </span>
          ) : (
            <span aria-hidden="true" className="game-display inline-flex items-baseline gap-1 font-bold"
              style={{ color: 'var(--game-board-yellow)' }}>
              <BauhausMark kind="life" size={14} />
              <strong className="text-[20px] leading-none">{lives}</strong>
              <span className="text-[14px]" style={{ color: 'var(--game-board-muted)' }}>/{maxLives}</span>
            </span>
          )}
        </span>
      )}
      {typeof score === 'number' && (
        <span className="game-lift-1 flex items-baseline gap-2 px-2 py-1" style={chip}>
          <span className="game-label" style={{ color: 'var(--game-board-muted)' }}>{scoreLabel}</span>
          <strong className="game-display text-[22px] font-bold leading-none" style={{ color: 'var(--game-board-ink)' }}>
            {Math.round(score)}
          </strong>
        </span>
      )}
      {showTime && (
        <span className="game-lift-1 flex min-w-[160px] flex-1 items-center gap-2 px-2 py-1" style={chip}>
          <span className="game-label" style={{ color: 'var(--game-board-muted)' }}>시간</span>
          <span className="sr-only">남은 시간 {Math.ceil(timeLeft)}초</span>
          <span
            aria-hidden="true"
            className="relative h-3.5 flex-1 overflow-hidden"
            style={{ background: 'var(--game-shadow)', border: '1px solid var(--game-board-line)' }}
          >
            <span
              className="block h-full transition-[width] duration-100"
              style={{
                width: `${timeRatio * 100}%`,
                /* 얼마 안 남았을 때만 붉어진다. 먼저 읽히는 것은 줄어드는 길이다. */
                background: timeRatio < 0.25 ? 'var(--game-board-red)' : 'var(--game-board-yellow)',
              }}
            />
            {/* 칸 나눔 눈금. 줄어드는 양을 셀 수 있게 막대를 여덟 칸으로 가른다. */}
            <span className="absolute inset-0 flex justify-between">
              {Array.from({ length: TIME_TICKS + 1 }).map((_, index) => (
                <span key={index} className="block h-full w-[2px]" style={{ background: 'var(--game-shadow)' }} />
              ))}
            </span>
          </span>
          <span className="game-display w-9 text-right text-[18px] font-bold leading-none"
            style={{ color: 'var(--game-board-ink)' }}>
            {Math.ceil(timeLeft)}
          </span>
        </span>
      )}
    </div>
  );
}
