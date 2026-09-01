import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, randInt,
  useCountdown, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m5-l5 · 매듭 풀기 (장르 37 · 키우기 클리커)
 *
 * "완성 답 대신 필요한 만큼만 힌트를 받는다"를 힌트 경제로 만든다. 매듭마다 푸는
 * 방향이 있는데 보이지 않는다. 방향을 맞추고 두드리면 내 힘 게이지가 찬다.
 *
 * 힌트를 쓰면 방향이 잠깐 보이지만 '내 힘' 점수가 준다. 다 받아도 풀리기는 하지만
 * 끝에 남는 점수가 다르다 — 얼마나 스스로 했는지가 결과에 남는다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

const DIRS = [
  { c: 0, r: -1, name: '위', arrow: '↑' },
  { c: 1, r: 0, name: '오른쪽', arrow: '→' },
  { c: 0, r: 1, name: '아래', arrow: '↓' },
  { c: -1, r: 0, name: '왼쪽', arrow: '←' },
];

interface Knot {
  dir: number;
  fill: number;
  need: number;
  done: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  problem: string;
  count: number;
  seconds: number;
  need: number;
}

const STAGES: StageConfig[] = [
  { id: 'easy', label: '기본', spoken: '막힌 문제의 매듭을 풀어요.', problem: '풀칠한 종이가 서로 붙었습니다', count: 3, seconds: 75, need: 100 },
  { id: 'mid', label: '1단계', spoken: '막힌 문제의 매듭을 풀어요.', problem: '줄이 엉켜 상자가 열리지 않습니다', count: 4, seconds: 80, need: 110 },
  { id: 'hard', label: '2단계', spoken: '막힌 문제의 매듭을 풀어요.', problem: '전선이 얽혀 기계가 켜지지 않습니다', count: 5, seconds: 85, need: 120 },
];

export default function KnotUntieGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시간·힌트 수·한 번 두드릴 때 차는 양으로 나타난다. 매듭 수는 스테이지가 정한다. */
  const seconds = Math.round(stage.seconds * tuning.time);
  const hints = Math.max(1, tuning.lives - 1);
  const tapGain = 9 * clamp(tuning.speed, 0.8, 1.4);
  const holdGain = 12 * clamp(tuning.speed, 0.8, 1.4);

  const knotsRef = useRef<Knot[]>([]);
  const indexRef = useRef(0);
  const dirRef = useRef(0);
  const revealRef = useRef(0);
  const finishedRef = useRef(false);
  const [hud, setHud] = useState({ index: 0, fill: 0, hints, power: 100, dir: 0, reveal: false });
  const keys = useGameKeys(game.playing);
  const holdRef = useRef(false);

  useEffect(() => {
    const random = createRandom(game.seed);
    knotsRef.current = Array.from({ length: stage.count }, () => ({
      dir: randInt(random, 0, 4), fill: 0, need: stage.need, done: false,
    }));
    indexRef.current = 0;
    dirRef.current = 0;
    revealRef.current = 0;
    finishedRef.current = false;
    holdRef.current = false;
    setHud({ index: 0, fill: 0, hints, power: 100, dir: 0, reveal: false });
  }, [game.round, game.stageIndex, stage, game.seed, hints]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    if (!finishedRef.current) {
      finishedRef.current = true;
      game.fail('시간이 지났어요. 방향을 바꿔 가며 두드려 보고, 막히면 힌트를 한 칸만 받아 봐요.');
    }
  });

  const knock = () => {
    if (!game.playing || finishedRef.current) return;
    const knots = knotsRef.current;
    const knot = knots[indexRef.current];
    if (!knot) return;
    if (dirRef.current === knot.dir) {
      knot.fill += tapGain;
      playSound('fill');
    } else {
      knot.fill = Math.max(0, knot.fill - 2);
    }
    if (knot.fill >= knot.need) {
      knot.done = true;
      indexRef.current += 1;
      revealRef.current = 0;
      playSound('stamp');
      if (indexRef.current >= knots.length) {
        finishedRef.current = true;
        game.succeed('매듭을 모두 풀었어요. 필요한 만큼만 힌트를 받고 나머지는 내 힘으로 했습니다.');
      }
    }
    setHud((prev) => ({
      ...prev,
      index: indexRef.current,
      fill: knots[indexRef.current]?.fill ?? 0,
      dir: dirRef.current,
    }));
  };

  const useHint = () => {
    if (!game.playing || hud.hints <= 0 || finishedRef.current) return;
    const knot = knotsRef.current[indexRef.current];
    if (!knot) return;
    revealRef.current = 2.2;
    setHud((prev) => ({ ...prev, hints: prev.hints - 1, power: Math.max(0, prev.power - 18), reveal: true }));
    playSound('select');
  };

  const setDir = (index: number) => {
    dirRef.current = index;
    setHud((prev) => ({ ...prev, dir: index }));
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const knots = knotsRef.current;
    const knot = knots[indexRef.current];

    if (dt > 0 && game.playing && !finishedRef.current) {
      if (keys.held.current.up) setDir(0);
      if (keys.held.current.right) setDir(1);
      if (keys.held.current.down) setDir(2);
      if (keys.held.current.left) setDir(3);
      if (keys.consumePress('action')) knock();

      // 누르고 있어도 조금씩 찬다. 연타가 어려운 학생도 끝까지 갈 수 있어야 한다.
      const holding = keys.held.current.action || holdRef.current;
      if (holding && knot && dirRef.current === knot.dir) {
        knot.fill += holdGain * dt;
        if (knot.fill >= knot.need) {
          knot.done = true;
          indexRef.current += 1;
          revealRef.current = 0;
          playSound('stamp');
          if (indexRef.current >= knots.length) {
            finishedRef.current = true;
            game.succeed('매듭을 모두 풀었어요. 필요한 만큼만 힌트를 받고 나머지는 내 힘으로 했습니다.');
          }
        }
        setHud((prev) => ({ ...prev, index: indexRef.current, fill: knots[indexRef.current]?.fill ?? 0 }));
      }

      if (revealRef.current > 0) {
        revealRef.current = Math.max(0, revealRef.current - dt);
        if (revealRef.current === 0) setHud((prev) => ({ ...prev, reveal: false }));
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    panel(ctx, 20, 14, WORLD_W - 40, 44, BOARD.overlay, PLAY.info, 12);
    centerText(ctx, `막힌 문제 · ${stage.problem}`, WORLD_W / 2, 36, 22, BOARD.ink);

    // 줄과 매듭
    const y = 300;
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(80, y);
    ctx.lineTo(WORLD_W - 80, y);
    ctx.stroke();

    const gap = (WORLD_W - 220) / Math.max(1, knots.length - 1 || 1);
    knots.forEach((item, index) => {
      const x = knots.length === 1 ? WORLD_W / 2 : 110 + index * gap;
      const active = index === indexRef.current;
      ctx.beginPath();
      ctx.arc(x, y, item.done ? 22 : 40, 0, Math.PI * 2);
      ctx.fillStyle = item.done ? '#065F46' : active ? '#4C1D95' : '#334155';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = item.done ? PLAY.goal : active ? PLAY.extra : BOARD.line;
      ctx.stroke();
      centerText(ctx, item.done ? '✓' : `${index + 1}`, x, y, 26, BOARD.ink);
      if (active && revealRef.current > 0) {
        centerText(ctx, DIRS[item.dir].arrow, x, y - 68, 40, PLAY.hero);
      }
    });

    // 내 힘 게이지
    if (knot) {
      const ratio = clamp(knot.fill / knot.need, 0, 1);
      panel(ctx, WORLD_W / 2 - 220, 400, 440, 46, BOARD.overlay, PLAY.hero, 12);
      ctx.fillStyle = PLAY.hero;
      ctx.fillRect(WORLD_W / 2 - 214, 406, 428 * ratio, 34);
      centerText(ctx, `${indexRef.current + 1}번 매듭 · 내 힘`, WORLD_W / 2, 423, 22, ratio > 0.5 ? '#3B2100' : BOARD.ink);
    }

    centerText(ctx, `고른 방향 ${DIRS[dirRef.current].arrow} ${DIRS[dirRef.current].name}`, WORLD_W / 2, 480, 24, BOARD.ink);
    centerText(ctx, '방향키로 방향을 고르고 스페이스를 누르세요', WORLD_W / 2, 512, 20, BOARD.inkDim);
  };

  return (
    <MiniGameFrame
      badge="매듭 풀기"
      instruction="방향을 고르고 두드리세요. 맞는 방향이면 내 힘이 찹니다. 막히면 힌트를 한 칸만 받을 수 있습니다."
      progress={{ label: '푼 매듭', value: hud.index, max: stage.count }}
      hud={<GameHud score={hud.power} scoreLabel="내 힘" timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={knock} disabled={!game.playing} emoji="✊" label="두드리기" variant="primary" />
          {game.hintAllowed && (
            <MiniGameButton onClick={useHint} disabled={hud.hints <= 0} emoji="💡" label={`힌트 ${hud.hints}`} />
          )}
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {DIRS.map((dir, index) => (
            <button
              key={dir.name}
              type="button"
              onClick={() => setDir(index)}
              aria-pressed={hud.dir === index}
              disabled={!game.playing}
              className="min-h-11 rounded-xl px-3 text-[16px] font-black transition"
              style={{
                background: hud.dir === index ? '#C4B5FD' : 'var(--board-surface)',
                color: hud.dir === index ? '#0F172A' : 'var(--board-ink)',
                border: '2px solid #C4B5FD',
              }}
            >
              {dir.arrow} {dir.name}
            </button>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="aspect-video max-h-full w-full max-w-[760px]">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                if (pointer.phase === 'down') { holdRef.current = true; knock(); }
                if (pointer.phase === 'up') holdRef.current = false;
              }}
              ariaLabel={`매듭을 방향에 맞춰 푸는 놀이. 푼 매듭 ${hud.index}개, 남은 힌트 ${hud.hints}개.`}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
