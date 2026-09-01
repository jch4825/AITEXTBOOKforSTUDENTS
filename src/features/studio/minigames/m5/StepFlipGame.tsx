import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m5-l7 · 한 단계씩 뒤집기 (장르 7 · 중력 반전)
 *
 * "한 단계 실행하고 끝났는지 확인한 다음 넘어간다"를 뒤집기 잠금으로 만든다.
 * 뒤집기는 한 번 쓰면 잠기고, 끝남 표시 발판을 밟아야 다시 열린다.
 *
 * 그래서 학생은 아무 때나 뒤집을 수 없고, 다음 확인 발판까지의 길을 먼저 본다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const TOP = 70;
const BOTTOM = WORLD_H - 40;
const HERO_R = 18;

interface Spike {
  x: number;
  top: boolean;
  w: number;
}

interface Check {
  x: number;
  top: boolean;
  label: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  goalX: number;
  spikes: Spike[];
  checks: Check[];
}

const STAGES: StageConfig[] = [
  {
    id: 'poster',
    label: '기본',
    spoken: '포스터 만들기를 한 단계씩 확인하며 가요.',
    goalX: 1560,
    spikes: [
      { x: 320, top: false, w: 120 },
      { x: 640, top: true, w: 140 },
      { x: 980, top: false, w: 140 },
      { x: 1300, top: true, w: 120 },
    ],
    checks: [
      { x: 240, top: true, label: '1 무엇을 만들지 정하기' },
      { x: 560, top: false, label: '2 재료 목록 받기' },
      { x: 900, top: true, label: '3 차례 만들기' },
      { x: 1220, top: false, label: '4 확인 목록 받기' },
    ],
  },
  {
    id: 'video',
    label: '1단계',
    spoken: '영상 만들기를 한 단계씩 확인하며 가요.',
    goalX: 1880,
    spikes: [
      { x: 300, top: true, w: 130 },
      { x: 580, top: false, w: 150 },
      { x: 860, top: true, w: 150 },
      { x: 1160, top: false, w: 150 },
      { x: 1480, top: true, w: 140 },
    ],
    checks: [
      { x: 220, top: false, label: '1 주제 정하기' },
      { x: 500, top: true, label: '2 장면 나누기' },
      { x: 780, top: false, label: '3 대사 받기' },
      { x: 1080, top: true, label: '4 순서 맞추기' },
      { x: 1400, top: false, label: '5 확인하기' },
    ],
  },
  {
    id: 'booth',
    label: '2단계',
    spoken: '부스 준비를 한 단계씩 확인하며 가요.',
    goalX: 2140,
    spikes: [
      { x: 280, top: false, w: 140 },
      { x: 540, top: true, w: 150 },
      { x: 800, top: false, w: 160 },
      { x: 1080, top: true, w: 160 },
      { x: 1360, top: false, w: 160 },
      { x: 1660, top: true, w: 150 },
    ],
    checks: [
      { x: 200, top: true, label: '1 자리 정하기' },
      { x: 470, top: false, label: '2 물건 목록 받기' },
      { x: 730, top: true, label: '3 값 정하기' },
      { x: 1010, top: false, label: '4 당번 짜기' },
      { x: 1290, top: true, label: '5 안내문 받기' },
      { x: 1580, top: false, label: '6 마지막 확인' },
    ],
  },
];

interface World {
  x: number;
  y: number;
  vy: number;
  up: boolean;
  canFlip: boolean;
  lives: number;
  done: number;
  camera: number;
  phase: 'ready' | 'walk';
  finished: boolean;
  armed: boolean;
}

export default function StepFlipGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 걷는 속도와 가시 폭, 기회로 나타난다. 확인 순서는 셋 모두 같다. */
  const walk = 150 * clamp(tuning.speed, 0.65, 1.3);
  const spikeScale = clamp(2 - tuning.size, 0.8, 1.2);
  const maxLives = tuning.lives;

  const worldRef = useRef<World>({
    x: 90, y: BOTTOM - HERO_R, vy: 0, up: false, canFlip: true, lives: maxLives,
    done: 0, camera: 0, phase: 'ready', finished: false, armed: true,
  });
  const [hud, setHud] = useState({ lives: maxLives, done: 0, canFlip: true });
  const keys = useGameKeys(game.playing);
  const flipRef = useRef(false);

  useEffect(() => {
    worldRef.current = {
      x: 90, y: BOTTOM - HERO_R, vy: 0, up: false, canFlip: true, lives: maxLives,
      done: 0, camera: 0, phase: 'ready', finished: false, armed: true,
    };
    setHud({ lives: maxLives, done: 0, canFlip: true });
    flipRef.current = false;
  }, [game.round, game.stageIndex, stage, maxLives]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    const pressing = keys.held.current.up || keys.held.current.action || flipRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      if (w.phase === 'ready') {
        if (!pressing) w.armed = true;
        if (pressing && w.armed) { w.phase = 'walk'; w.armed = false; }
      } else {
        if (!pressing) w.armed = true;
        if (pressing && w.armed && w.canFlip) {
          w.up = !w.up;
          w.canFlip = false;
          w.armed = false;
          w.vy = 0;
          playSound('select');
        }

        w.x += walk * dt;
        const gravity = w.up ? -1500 : 1500;
        w.vy += gravity * dt;
        w.y += w.vy * dt;
        if (w.up && w.y < TOP + HERO_R) { w.y = TOP + HERO_R; w.vy = 0; }
        if (!w.up && w.y > BOTTOM - HERO_R) { w.y = BOTTOM - HERO_R; w.vy = 0; }

        for (const spike of stage.spikes) {
          const width = spike.w * spikeScale;
          if (w.x < spike.x || w.x > spike.x + width) continue;
          const onTop = w.y < WORLD_H / 2;
          if (onTop === spike.top) {
            w.lives -= 1;
            w.x = Math.max(90, w.x - 220);
            w.canFlip = true;
            w.phase = 'ready';
            w.armed = false;
            break;
          }
        }

        for (const check of stage.checks) {
          if (Math.abs(w.x - check.x) > 34) continue;
          const onTop = w.y < WORLD_H / 2;
          if (onTop !== check.top) continue;
          const index = stage.checks.indexOf(check);
          if (index === w.done) {
            w.done += 1;
            w.canFlip = true;
            playSound('fill');
          }
        }

        w.camera = clamp(w.x - WORLD_W * 0.32, 0, stage.goalX - WORLD_W + 200);

        if (w.lives !== hud.lives || w.done !== hud.done || w.canFlip !== hud.canFlip) {
          setHud({ lives: w.lives, done: w.done, canFlip: w.canFlip });
        }

        if (w.lives <= 0) {
          w.finished = true;
          game.fail('가시에 닿았어요. 확인 발판을 밟아야 다시 뒤집을 수 있습니다.');
        } else if (w.x >= stage.goalX) {
          if (w.done >= stage.checks.length) {
            w.finished = true;
            game.succeed('한 단계씩 실행하고 끝난 것을 확인하며 끝까지 갔어요!');
          } else {
            w.x = stage.goalX - 4;
          }
        }
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    ctx.save();
    ctx.translate(-w.camera, 0);

    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, TOP - 26, stage.goalX + 300, 26);
    ctx.fillRect(0, BOTTOM, stage.goalX + 300, 26);

    for (const spike of stage.spikes) {
      const width = spike.w * spikeScale;
      const baseY = spike.top ? TOP : BOTTOM;
      const dir = spike.top ? 1 : -1;
      ctx.beginPath();
      for (let i = 0; i < Math.max(2, Math.round(width / 30)); i += 1) {
        const sx = spike.x + i * 30;
        ctx.moveTo(sx, baseY);
        ctx.lineTo(sx + 15, baseY + dir * 26);
        ctx.lineTo(sx + 30, baseY);
      }
      ctx.closePath();
      ctx.fillStyle = PLAY.hazard;
      ctx.fill();
    }

    stage.checks.forEach((check, index) => {
      const y = check.top ? TOP : BOTTOM - 30;
      const done = index < w.done;
      panel(ctx, check.x - 96, y, 192, 30, done ? '#064E3B' : '#334155', done ? PLAY.goal : PLAY.info, 8);
      centerText(ctx, `${done ? '✅ ' : ''}${check.label}`, check.x, y + 15, 20, BOARD.ink);
    });

    panel(ctx, stage.goalX, BOTTOM - 120, 150, 120, '#064E3B', PLAY.goal, 12);
    centerText(ctx, '끝', stage.goalX + 75, BOTTOM - 60, 28, BOARD.ink);

    ctx.beginPath();
    ctx.arc(w.x, w.y, HERO_R, 0, Math.PI * 2);
    ctx.fillStyle = PLAY.hero;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.stroke();
    ctx.restore();

    panel(ctx, WORLD_W - 250, 12, 236, 42, BOARD.overlay, w.canFlip ? PLAY.goal : BOARD.line, 10);
    centerText(ctx, w.canFlip ? '뒤집기 열림' : '뒤집기 잠김 · 확인 발판을 밟으세요',
      WORLD_W - 132, 33, 20, BOARD.ink);

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 220, WORLD_H / 2 - 30, 440, 60, BOARD.overlay, PLAY.hero, 14);
      centerText(ctx, w.armed ? '스페이스를 누르면 출발합니다' : '손을 떼었다가 다시 누르세요',
        WORLD_W / 2, WORLD_H / 2, 24, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="한 단계씩 뒤집기"
      instruction="스페이스로 위아래를 뒤집어 가시를 피하세요. 뒤집기는 확인 발판을 밟아야 다시 열립니다."
      progress={{ label: '끝낸 단계', value: hud.done, max: stage.checks.length }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton
            onClick={() => { flipRef.current = true; window.setTimeout(() => { flipRef.current = false; }, 150); }}
            emoji="🔃"
            label="뒤집기"
          />
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="aspect-video max-h-full w-full max-w-[760px]">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') flipRef.current = true;
              if (pointer.phase === 'up') flipRef.current = false;
            }}
            ariaLabel={`한 단계씩 확인하며 중력을 뒤집는 놀이. 끝낸 단계 ${hud.done}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
