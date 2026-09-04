import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel, toRadians, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m3-l6 · 합계 대포 (장르 28 · 포탄 각도 맞추기)
 *
 * "먼저 예상하고 계산기로 확인한다"를 사격으로 만든다. 과녁까지의 거리가 곧 합계다.
 * 첫 발은 눈대중으로 쏘고, 빗나가면 계산기를 열어 정확한 자리를 눈금에 표시한다.
 *
 * 계산기를 열면 아이미 풀이에서 틀린 줄도 함께 붉어진다 — 확인이 곧 오류 찾기다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const GROUND = WORLD_H - 70;
const GUN_X = 90;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  items: { name: string; price: number; count: number }[];
  /** 아이미 풀이 — 틀린 줄이 하나 있다 */
  lines: string[];
  wrongLine: number;
  wind: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'snack',
    label: '기본',
    spoken: '간식 합계를 예상해 쏴 봐요.',
    items: [
      { name: '사탕', price: 400, count: 2 },
      { name: '우유', price: 900, count: 1 },
    ],
    lines: ['사탕 400원 × 2 = 800원', '우유 900원', '합계 1,600원'],
    wrongLine: 2,
    wind: 0,
  },
  {
    id: 'stationery',
    label: '1단계',
    spoken: '학용품 합계를 예상해 쏴 봐요.',
    items: [
      { name: '공책', price: 1200, count: 2 },
      { name: '연필', price: 300, count: 3 },
    ],
    lines: ['공책 1,200원 × 2 = 2,400원', '연필 300원 × 3 = 800원', '합계 3,200원'],
    wrongLine: 1,
    wind: 0,
  },
  {
    id: 'party',
    label: '2단계',
    spoken: '잔치 준비물 합계를 예상해 쏴 봐요.',
    items: [
      { name: '풍선', price: 250, count: 4 },
      { name: '종이컵', price: 1100, count: 2 },
      { name: '주스', price: 1500, count: 1 },
    ],
    lines: ['풍선 250원 × 4 = 1,000원', '종이컵 1,100원 × 2 = 2,200원', '주스 1,500원', '합계 4,200원'],
    wrongLine: 3,
    wind: 34,
  },
];

interface Shot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  done: boolean;
  landX: number;
}

/** 금액을 화면 가로 자리로 바꾼다. 1원 = 0.13픽셀 정도로 잡아 5천 원이 판에 들어온다. */
const SCALE = 0.135;
const priceToX = (won: number) => GUN_X + won * SCALE;

export default function SumCannonGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const total = stage.items.reduce((sum, item) => sum + item.price * item.count, 0);
  /* 지원 수준은 과녁 폭과 발수, 바람으로 나타난다. */
  const targetW = 96 * clamp(tuning.tolerance, 0.7, 1.7);
  const maxShots = tuning.lives;
  const wind = stage.wind * clamp(tuning.speed, 0.6, 1.4);

  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(60);
  const [shots, setShots] = useState(maxShots);
  const [calcOpen, setCalcOpen] = useState(false);
  const shotRef = useRef<Shot | null>(null);
  const marksRef = useRef<number[]>([]);
  const finishedRef = useRef(false);
  const keys = useGameKeys(game.playing);
  const [, tick] = useState(0);

  useEffect(() => {
    setAngle(45);
    setPower(60);
    setShots(maxShots);
    setCalcOpen(false);
    shotRef.current = null;
    marksRef.current = [];
    finishedRef.current = false;
  }, [game.round, game.stageIndex, stage, maxShots]);

  const targetX = priceToX(total);

  const fire = () => {
    if (!game.playing || shotRef.current) return;
    const rad = toRadians(-angle);
    const v = power * 9.4;
    shotRef.current = { x: GUN_X, y: GROUND - 26, vx: Math.cos(rad) * v, vy: Math.sin(rad) * v, done: false, landX: 0 };
    playSound('confirm');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const shot = shotRef.current;

    if (dt > 0 && game.playing) {
      if (keys.held.current.up) setAngle((a) => clamp(a + 34 * dt, 10, 80));
      if (keys.held.current.down) setAngle((a) => clamp(a - 34 * dt, 10, 80));
      if (keys.held.current.right) setPower((p) => clamp(p + 26 * dt, 20, 100));
      if (keys.held.current.left) setPower((p) => clamp(p - 26 * dt, 20, 100));
      if (keys.consumePress('action')) fire();
    }

    if (shot && !shot.done && dt > 0) {
      shot.vy += 620 * dt;
      shot.vx += wind * dt;
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      if (shot.y >= GROUND) {
        shot.done = true;
        shot.landX = shot.x;
        marksRef.current = [...marksRef.current, shot.x].slice(-4);
        const hit = Math.abs(shot.x - targetX) <= targetW / 2;
        const left = shots - 1;
        setShots(left);
        if (hit && !finishedRef.current) {
          finishedRef.current = true;
          game.succeed(`합계 ${total.toLocaleString()}원 자리에 정확히 맞혔어요. 계산기로 확인한 값이 맞습니다.`);
        } else if (!hit) {
          setCalcOpen(true);
          if (left <= 0 && !finishedRef.current) {
            finishedRef.current = true;
            game.fail(`아직 빗나갔어요. 계산기로 확인한 합계 ${total.toLocaleString()}원 자리를 다시 겨눠 봐요.`);
          }
        }
        window.setTimeout(() => {
          if (shotRef.current === shot) {
            shotRef.current = null;
            tick((n) => n + 1);
          }
        }, 700);
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 땅과 금액 눈금
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, GROUND, WORLD_W, WORLD_H - GROUND);
    ctx.strokeStyle = BOARD.line;
    ctx.lineWidth = 2;
    for (let won = 0; won <= 6000; won += 500) {
      const x = priceToX(won);
      if (x > WORLD_W) break;
      ctx.beginPath();
      ctx.moveTo(x, GROUND);
      ctx.lineTo(x, GROUND + (won % 1000 === 0 ? 20 : 11));
      ctx.stroke();
      if (won % 1000 === 0) centerText(ctx, `${won / 1000}천`, x, GROUND + 38, 20, BOARD.inkDim);
    }

    // 과녁 — 계산기를 열면 정확한 자리가 드러난다
    panel(ctx, targetX - targetW / 2, GROUND - 76, targetW, 76, calcOpen ? '#065F46' : '#334155',
      calcOpen ? PLAY.goal : BOARD.line, 10);
    centerText(ctx, calcOpen ? `${total.toLocaleString()}원` : '합계?', targetX, GROUND - 38, 24, BOARD.ink);

    // 지난 탄착점
    for (const mark of marksRef.current) {
      ctx.fillStyle = PLAY.hazard;
      ctx.fillRect(mark - 3, GROUND - 8, 6, 8);
    }

    // 대포
    ctx.save();
    ctx.translate(GUN_X, GROUND - 26);
    ctx.rotate(toRadians(-angle));
    ctx.fillStyle = PLAY.hero;
    ctx.fillRect(0, -8, 26 + power * 0.5, 16);
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.lineWidth = 3;
    ctx.strokeRect(0, -8, 26 + power * 0.5, 16);
    ctx.restore();
    panel(ctx, GUN_X - 30, GROUND - 26, 60, 26, BOARD.surface, PLAY.heroEdge, 8);

    if (shot && !shot.done) {
      ctx.beginPath();
      ctx.arc(shot.x, shot.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = BOARD.ink;
      ctx.fill();
    }

    // 아이미 풀이
    panel(ctx, 20, 14, 470, 30 + stage.lines.length * 30, BOARD.overlay, PLAY.info, 12);
    centerText(ctx, '아이미의 풀이', 255, 34, 22, BOARD.inkDim);
    stage.lines.forEach((text, index) => {
      const wrong = calcOpen && index === stage.wrongLine;
      centerText(ctx, text, 255, 62 + index * 30, 22, wrong ? PLAY.hazard : BOARD.ink);
    });

    centerText(ctx, `각도 ${Math.round(angle)}도 · 힘 ${Math.round(power)}`, WORLD_W - 170, 34, 22, BOARD.ink);
    if (wind !== 0) centerText(ctx, `옆바람 ${wind > 0 ? '→' : '←'}`, WORLD_W - 170, 62, 22, PLAY.extra);
  };

  return (
    <MiniGameFrame
      badge="합계 대포"
      instruction="간식 합계를 예상해 각도와 힘을 맞춰 쏘세요. 빗나가면 계산기로 정확한 자리를 확인할 수 있습니다."
      progress={{ label: '쏜 횟수', value: maxShots - shots, max: maxShots }}
      hud={<GameHud lives={shots} maxLives={maxShots} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 쏘기" />
          <MiniGameButton
            onClick={() => { setCalcOpen(true); playSound('select'); }}
            disabled={!game.playing}
            emoji="🧮"
            label="계산기"
          />
          <MiniGameButton onClick={fire} disabled={!game.playing} emoji="💥" label="쏘기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {stage.items.map((item) => (
            <span
              key={item.name}
              className="rounded-lg px-2 py-1 text-[15px] font-black"
              style={{ background: 'var(--board-surface)', border: '2px solid var(--board-line)', color: 'var(--board-ink)' }}
            >
              {item.name} {item.price.toLocaleString()}원 × {item.count}
            </span>
          ))}
          <span className="text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
            {calcOpen ? `계산기 · 합계 ${total.toLocaleString()}원` : '↑↓ 각도 · ←→ 힘 · 스페이스 발사'}
          </span>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="game-canvas-fit">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                if (!game.playing) return;
                if (pointer.phase === 'down') fire();
                else if (pointer.phase === 'move') {
                  const dx = pointer.x - GUN_X;
                  const dy = GROUND - 26 - pointer.y;
                  if (dx > 20) setAngle(clamp((Math.atan2(dy, dx) * 180) / Math.PI, 10, 80));
                }
              }}
              ariaLabel={`간식 합계 자리에 포탄을 맞히는 놀이. 남은 발수 ${shots}번.`}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
