import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l8 · 형식 틀로 흘리기 (장르 6 · 경로 그리기)
 *
 * "할 일에 맞는 형식을 고른다"를 길을 그리는 일로 만든다. 어떤 통에 넣을지 고르는 것이
 * 아니라, 구슬이 그 통까지 굴러가도록 학생이 직접 미끄럼틀을 그린다.
 *
 * 잉크가 한정돼 있어 아무렇게나 길게 그릴 수 없다. 어디를 받쳐야 굴러가는지 보고
 * 짧게 긋는 것이 실력이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const BIN_Y = WORLD_H - 96;
const BIN_W = 250;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bin: number;
  label: string;
  landed: number;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  bins: string[];
  balls: { x: number; label: string; bin: number }[];
  ink: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'class',
    label: '기본',
    spoken: '할 일에 맞는 형식 통으로 흘려 보내요.',
    ink: 900,
    bins: ['표', '번호 목록', '한 문장'],
    balls: [
      { x: 200, label: '친구 12명 이름과 번호', bin: 0 },
      { x: 480, label: '라면 끓이는 차례', bin: 1 },
      { x: 760, label: '오늘 날씨 한마디', bin: 2 },
    ],
  },
  {
    id: 'trip',
    label: '1단계',
    spoken: '현장학습 준비를 형식 통으로 흘려 보내요.',
    ink: 780,
    bins: ['한 문장', '표', '번호 목록'],
    balls: [
      { x: 250, label: '모둠별 준비물 표', bin: 1 },
      { x: 500, label: '버스 타는 차례', bin: 2 },
      { x: 740, label: '오늘 목표 한마디', bin: 0 },
    ],
  },
  {
    id: 'fair',
    label: '2단계',
    spoken: '축제 준비를 형식 통으로 흘려 보내요.',
    ink: 660,
    bins: ['번호 목록', '한 문장', '표'],
    balls: [
      { x: 170, label: '부스 물건과 가격 표', bin: 2 },
      { x: 470, label: '정리하는 차례', bin: 0 },
      { x: 800, label: '손님께 드릴 인사말', bin: 1 },
    ],
  },
];

interface Seg {
  ax: number;
  ay: number;
  bx: number;
  by: number;
}

export default function FormatPourPathGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 잉크와 통의 넓이, 그리고 떨어지는 속도로 나타난다. */
  const inkTotal = Math.round(stage.ink * clamp(tuning.tolerance, 0.75, 1.6));
  const binW = BIN_W * clamp(tuning.size, 0.8, 1.25);
  const gravity = 620 * clamp(tuning.speed, 0.7, 1.35);
  const maxTries = tuning.lives;

  const segsRef = useRef<Seg[]>([]);
  const drawRef = useRef<{ x: number; y: number } | null>(null);
  const ballsRef = useRef<Ball[]>([]);
  const finishedRef = useRef(false);
  const [ink, setInk] = useState(inkTotal);
  const [tries, setTries] = useState(maxTries);
  const [landed, setLanded] = useState(0);

  const reset = () => {
    segsRef.current = [];
    drawRef.current = null;
    ballsRef.current = [];
    finishedRef.current = false;
    setInk(inkTotal);
    setTries(maxTries);
    setLanded(0);
  };

  useEffect(reset, [game.round, game.stageIndex, stage, inkTotal, maxTries]);

  const binX = (index: number) => {
    const gap = (WORLD_W - stage.bins.length * binW) / (stage.bins.length + 1);
    return gap + index * (binW + gap);
  };

  const pour = () => {
    if (!game.playing || ballsRef.current.length > 0) return;
    ballsRef.current = stage.balls.map((spec) => ({
      x: spec.x, y: 96, vx: 0, vy: 0, bin: spec.bin, label: spec.label, landed: -1,
    }));
    setLanded(0);
    playSound('confirm');
    game.run('구슬을 흘려 봅니다.');
  };

  const clearLast = () => {
    if (!game.playing) return;
    const last = segsRef.current.pop();
    if (last) {
      setInk((value) => Math.min(inkTotal, value + Math.hypot(last.bx - last.ax, last.by - last.ay)));
      playSound('select');
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const balls = ballsRef.current;

    if (dt > 0 && game.status === 'running' && !finishedRef.current) {
      let allLanded = true;
      for (const ball of balls) {
        if (ball.landed >= 0) continue;
        allLanded = false;
        ball.vy += gravity * dt;
        ball.vy = clamp(ball.vy, -600, 620);
        let nx = ball.x + ball.vx * dt;
        let ny = ball.y + ball.vy * dt;

        // 그린 선분과의 충돌 — 선분에 닿으면 선을 따라 미끄러진다
        for (const seg of segsRef.current) {
          const dx = seg.bx - seg.ax;
          const dy = seg.by - seg.ay;
          const len2 = dx * dx + dy * dy;
          if (len2 < 1) continue;
          const t = clamp(((nx - seg.ax) * dx + (ny - seg.ay) * dy) / len2, 0, 1);
          const px = seg.ax + dx * t;
          const py = seg.ay + dy * t;
          if (Math.hypot(nx - px, ny - py) > 15) continue;
          const nlen = Math.hypot(dx, dy);
          const tx = dx / nlen;
          const ty = dy / nlen;
          const along = ball.vx * tx + ball.vy * ty;
          ball.vx = tx * along * 0.98;
          ball.vy = ty * along * 0.98;
          const normalX = -ty;
          const normalY = tx;
          const push = (nx - px) * normalX + (ny - py) * normalY >= 0 ? 1 : -1;
          nx = px + normalX * 15 * push;
          ny = py + normalY * 15 * push;
        }

        if (nx < 14) { nx = 14; ball.vx = Math.abs(ball.vx) * 0.5; }
        if (nx > WORLD_W - 14) { nx = WORLD_W - 14; ball.vx = -Math.abs(ball.vx) * 0.5; }
        ball.x = nx;
        ball.y = ny;

        if (ball.y >= BIN_Y) {
          let index = -1;
          for (let i = 0; i < stage.bins.length; i += 1) {
            const x = binX(i);
            if (ball.x >= x && ball.x <= x + binW) index = i;
          }
          ball.landed = index;
          setLanded((n) => n + 1);
        }
      }

      if (allLanded && balls.length > 0) {
        const ok = balls.every((ball) => ball.landed === ball.bin);
        if (ok) {
          finishedRef.current = true;
          game.succeed('세 구슬이 모두 알맞은 형식 통에 들어갔어요. 할 일에 맞는 모양을 골랐습니다.');
        } else {
          const left = tries - 1;
          setTries(left);
          const wrong = balls.find((ball) => ball.landed !== ball.bin);
          if (left <= 0) {
            finishedRef.current = true;
            game.fail('형식이 어긋난 구슬이 있어요. 할 일의 모양을 보고 길을 다시 그려 봐요.');
          } else {
            ballsRef.current = [];
            game.resume();
            if (wrong) playSound('select');
          }
        }
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 통
    for (let i = 0; i < stage.bins.length; i += 1) {
      const x = binX(i);
      panel(ctx, x, BIN_Y, binW, 84, BOARD.surface, PLAY.goal, 12);
      centerText(ctx, stage.bins[i], x + binW / 2, BIN_Y + 42, 28, BOARD.ink);
    }

    // 그린 선
    ctx.strokeStyle = PLAY.info;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    for (const seg of segsRef.current) {
      ctx.beginPath();
      ctx.moveTo(seg.ax, seg.ay);
      ctx.lineTo(seg.bx, seg.by);
      ctx.stroke();
    }

    // 구슬
    for (const ball of balls.length > 0 ? balls : stage.balls.map((s) => ({
      x: s.x, y: 96, label: s.label, bin: s.bin, landed: -1, vx: 0, vy: 0,
    }))) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = ball.landed >= 0 && ball.landed === ball.bin ? PLAY.goal : PLAY.hero;
      ctx.fill();
      ctx.strokeStyle = ball.landed >= 0 && ball.landed !== ball.bin ? PLAY.hazard : PLAY.heroEdge;
      ctx.lineWidth = 4;
      ctx.stroke();
      panel(ctx, ball.x - 132, ball.y - 52, 264, 34, BOARD.overlay, PLAY.info, 10);
      centerText(ctx, ball.label, ball.x, ball.y - 35, 20, BOARD.ink);
    }

    if (game.playing) {
      centerText(ctx, '판을 끌어 미끄럼틀을 그리세요', WORLD_W / 2, 22, 22, BOARD.inkDim);
    }
  };

  return (
    <MiniGameFrame
      badge="형식 틀로 흘리기"
      instruction="판을 끌어 미끄럼틀을 그린 다음 쏟기를 누르세요. 구슬에 적힌 할 일에 맞는 형식 통으로 보내야 합니다."
      progress={{ label: '들어간 구슬', value: landed, max: stage.balls.length }}
      hud={<GameHud lives={tries} maxLives={maxTries} score={Math.round(ink)} scoreLabel="남은 잉크" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 그리기" />
          <MiniGameButton onClick={clearLast} disabled={game.isLocked} emoji="↩️" label="한 줄 지우기" />
          <MiniGameButton onClick={pour} disabled={game.isLocked || !game.playing} emoji="🫗" label="쏟기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="aspect-video max-h-full w-full max-w-[760px]">
          <GameCanvas
            active={game.playing || game.status === 'running'}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (!game.playing) return;
              if (pointer.phase === 'down') {
                drawRef.current = { x: pointer.x, y: pointer.y };
                return;
              }
              if (pointer.phase === 'up') { drawRef.current = null; return; }
              const from = drawRef.current;
              if (!from) return;
              const len = Math.hypot(pointer.x - from.x, pointer.y - from.y);
              if (len < 16) return;
              if (ink - len <= 0) return;
              segsRef.current.push({ ax: from.x, ay: from.y, bx: pointer.x, by: pointer.y });
              setInk((value) => Math.max(0, value - len));
              drawRef.current = { x: pointer.x, y: pointer.y };
            }}
            ariaLabel={`답 구슬을 알맞은 형식 통으로 보내는 놀이. 들어간 구슬 ${landed}개, 남은 기회 ${tries}번.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
