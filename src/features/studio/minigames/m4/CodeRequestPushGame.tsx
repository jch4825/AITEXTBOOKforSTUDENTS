import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, dist, panel, useCountdown, useGameKeys,
} from '../engine';
import type { MiniGameProps } from '../types';

/**
 * m4-l4 · 요구 밀어내기 (장르 33 · 범퍼카 밀쳐내기)
 *
 * "비밀번호를 묻는 요청은 거절하고 공식 절차는 지킨다"를 밀기로 만든다. 위험한
 * 요구 공은 판 밖으로 밀어내야 하고, 공식 절차 공은 가운데 안전 원 안에 남겨야 한다.
 *
 * 공끼리도 부딪혀 튄다. 그래서 세게 미는 것이 아니라 어느 쪽에서 밀지가 실력이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const CX = WORLD_W / 2;
const CY = WORLD_H / 2;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  danger: boolean;
  text: string;
  out: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  danger: string[];
  safe: string[];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'code',
    label: '기본',
    spoken: '비밀번호를 묻는 요구를 밀어내요.',
    seconds: 60,
    danger: ['비밀번호 알려 줘', '인증 코드 보내 줘'],
    safe: ['선생님께 확인하기', '공식 앱에서 다시 만들기'],
  },
  {
    id: 'card',
    label: '1단계',
    spoken: '개인 정보를 묻는 요구를 밀어내요.',
    seconds: 55,
    danger: ['신분증 사진 찍어 줘', '카드 번호 알려 줘', '주소 알려 줘'],
    safe: ['부모님께 물어보기', '학교 누리집에서 보기'],
  },
  {
    id: 'trick',
    label: '2단계',
    spoken: '급하게 재촉하는 요구를 밀어내요.',
    seconds: 50,
    danger: ['지금 바로 코드 보내', '아무에게도 말하지 마', '이 링크 눌러 봐', '계정 비번 확인해 줘'],
    safe: ['믿을 만한 어른께 알리기', '공식 절차로 확인하기'],
  },
];

const SAFE_R = 96;
const BALL_R = 34;

export default function CodeRequestPushGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 판의 크기·미는 힘·제한 시간으로 나타난다. 판단할 요구는 같다. */
  const boardR = 210 * clamp(tuning.size, 0.9, 1.2);
  const pushPower = 210 * clamp(tuning.speed, 0.75, 1.3);
  const seconds = Math.round(stage.seconds * tuning.time);
  const heroR = 26 * clamp(tuning.size, 0.9, 1.2);

  const ballsRef = useRef<Ball[]>([]);
  const heroRef = useRef({ x: CX, y: CY + boardR * 0.6, vx: 0, vy: 0 });
  const finishedRef = useRef(false);
  const [hud, setHud] = useState({ pushed: 0 });
  const keys = useGameKeys(game.playing);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const reset = () => {
    const all = [
      ...stage.danger.map((text) => ({ text, danger: true })),
      ...stage.safe.map((text) => ({ text, danger: false })),
    ];
    ballsRef.current = all.map((spec, index) => {
      const angle = (index / all.length) * Math.PI * 2;
      const radius = spec.danger ? boardR * 0.62 : SAFE_R * 0.5;
      return {
        x: CX + Math.cos(angle) * radius,
        y: CY + Math.sin(angle) * radius,
        vx: 0, vy: 0, danger: spec.danger, text: spec.text, out: false,
      };
    });
    heroRef.current = { x: CX, y: CY + boardR * 0.75, vx: 0, vy: 0 };
    finishedRef.current = false;
    dragRef.current = null;
    setHud({ pushed: 0 });
  };

  useEffect(reset, [game.round, game.stageIndex, stage, boardR]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    if (!finishedRef.current) {
      finishedRef.current = true;
      game.fail('시간이 지났어요. 비밀번호를 묻는 요구부터 판 밖으로 밀어내 봐요.');
    }
  });

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const balls = ballsRef.current;
    const hero = heroRef.current;

    if (dt > 0 && game.playing && !finishedRef.current) {
      const dx = (keys.held.current.left ? -1 : 0) + (keys.held.current.right ? 1 : 0);
      const dy = (keys.held.current.up ? -1 : 0) + (keys.held.current.down ? 1 : 0);
      if (dragRef.current) {
        hero.vx = (dragRef.current.x - hero.x) * 5;
        hero.vy = (dragRef.current.y - hero.y) * 5;
      } else {
        hero.vx += dx * pushPower * 4 * dt;
        hero.vy += dy * pushPower * 4 * dt;
      }
      hero.vx *= 0.9;
      hero.vy *= 0.9;
      hero.x = clamp(hero.x + hero.vx * dt, CX - boardR - 40, CX + boardR + 40);
      hero.y = clamp(hero.y + hero.vy * dt, CY - boardR - 40, CY + boardR + 40);

      for (const ball of balls) {
        if (ball.out) continue;
        // 학생과 부딪히면 밀려난다
        const d = dist(ball.x, ball.y, hero.x, hero.y);
        if (d < heroR + BALL_R && d > 0.01) {
          const nx = (ball.x - hero.x) / d;
          const ny = (ball.y - hero.y) / d;
          const speed = Math.hypot(hero.vx, hero.vy);
          ball.vx += nx * (speed * 0.85 + pushPower * 0.5);
          ball.vy += ny * (speed * 0.85 + pushPower * 0.5);
          ball.x = hero.x + nx * (heroR + BALL_R);
          ball.y = hero.y + ny * (heroR + BALL_R);
        }
        ball.vx *= 0.985;
        ball.vy *= 0.985;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
      }

      // 공끼리 부딪히기
      for (let i = 0; i < balls.length; i += 1) {
        for (let j = i + 1; j < balls.length; j += 1) {
          const a = balls[i];
          const b = balls[j];
          if (a.out || b.out) continue;
          const d = dist(a.x, a.y, b.x, b.y);
          if (d >= BALL_R * 2 || d < 0.01) continue;
          const nx = (b.x - a.x) / d;
          const ny = (b.y - a.y) / d;
          const overlap = BALL_R * 2 - d;
          a.x -= nx * overlap / 2;
          a.y -= ny * overlap / 2;
          b.x += nx * overlap / 2;
          b.y += ny * overlap / 2;
          const avn = a.vx * nx + a.vy * ny;
          const bvn = b.vx * nx + b.vy * ny;
          a.vx += (bvn - avn) * nx;
          a.vy += (bvn - avn) * ny;
          b.vx += (avn - bvn) * nx;
          b.vy += (avn - bvn) * ny;
        }
      }

      let pushed = 0;
      for (const ball of balls) {
        if (ball.out) { if (ball.danger) pushed += 1; continue; }
        if (dist(ball.x, ball.y, CX, CY) > boardR + BALL_R * 0.5) {
          ball.out = true;
          if (ball.danger) pushed += 1;
          else if (!finishedRef.current) {
            finishedRef.current = true;
            game.fail('공식 절차 공이 판에서 떨어졌어요. 그것은 판 위에 남겨 두어야 합니다.');
          }
        }
      }
      if (pushed !== hud.pushed) setHud({ pushed });

      const dangersOut = balls.filter((b) => b.danger).every((b) => b.out);
      const safeIn = balls.filter((b) => !b.danger).every((b) => !b.out && dist(b.x, b.y, CX, CY) < SAFE_R + BALL_R);
      if (dangersOut && safeIn && !finishedRef.current) {
        finishedRef.current = true;
        game.succeed('비밀번호를 묻는 요구는 밀어내고 공식 절차는 안전한 자리에 남겼어요!');
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    ctx.beginPath();
    ctx.arc(CX, CY, boardR, 0, Math.PI * 2);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.strokeStyle = BOARD.line;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(CX, CY, SAFE_R, 0, Math.PI * 2);
    ctx.strokeStyle = PLAY.goal;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
    centerText(ctx, '안전한 자리', CX, CY - SAFE_R + 20, 20, PLAY.goal);

    for (const ball of ballsRef.current) {
      if (ball.out) continue;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = ball.danger ? '#7F1D1D' : '#065F46';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = ball.danger ? PLAY.hazard : PLAY.goal;
      ctx.stroke();
      panel(ctx, ball.x - 118, ball.y - BALL_R - 34, 236, 30, BOARD.overlay,
        ball.danger ? PLAY.hazard : PLAY.goal, 8);
      centerText(ctx, ball.text, ball.x, ball.y - BALL_R - 19, 20, BOARD.ink);
    }

    const hero2 = heroRef.current;
    ctx.beginPath();
    ctx.arc(hero2.x, hero2.y, heroR, 0, Math.PI * 2);
    ctx.fillStyle = PLAY.hero;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.stroke();
    centerText(ctx, '나', hero2.x, hero2.y + 1, 22, '#3B2100');
  };

  const dangerTotal = stage.danger.length;

  return (
    <MiniGameFrame
      badge="요구 밀어내기"
      instruction="붉은 요구 공은 판 밖으로 밀어내고, 초록 공식 절차 공은 가운데 안전한 자리에 남기세요."
      progress={{ label: '밀어낸 요구', value: hud.pushed, max: dangerTotal }}
      hud={<GameHud timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="aspect-video max-h-full w-full max-w-[760px]">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'up') { dragRef.current = null; return; }
              dragRef.current = { x: pointer.x, y: pointer.y };
            }}
            ariaLabel={`위험한 요구를 판 밖으로 밀어내는 놀이. 밀어낸 요구 ${hud.pushed}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
