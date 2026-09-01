import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, dist, panel, randRange, shuffle,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l2 · 급한 부탁 풍선 (풍선 터뜨리기)
 *
 * 창구를 지키는 놀이는 글을 읽지 못하면 아무것도 할 수 없었다. 여기서는 부탁이
 * 풍선을 타고 떠다니고, 급한 것일수록 풍선이 크고 빨갛게 부푼다.
 *
 * 글을 읽지 못해도 **가장 크고 빨간 풍선부터** 터뜨리면 된다. 글을 읽는 학생은
 * 풍선에 적힌 마감을 보고 같은 판단을 한다. 두 길이 같은 답으로 모인다.
 *
 * 한 번에 하나씩만 터진다. 터뜨리는 동안 다른 풍선은 계속 부풀어, 순서를 잘못
 * 고르면 뒤에 있던 것이 먼저 터져 버린다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

interface Balloon {
  id: number;
  text: string;
  /** 0이면 여유, 1에 가까울수록 급하다 */
  urgency: number;
  rate: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  popped: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  bundle: string;
  tasks: { text: string; rate: number }[];
  need: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'class',
    label: '기본',
    spoken: '교실 부탁을 급한 것부터 터뜨려요.',
    bundle: '포스터도 만들고 안내문도 쓰고 사진도 골라 주세요',
    need: 3,
    tasks: [
      { text: '포스터 문구', rate: 0.055 },
      { text: '안내문 쓰기', rate: 0.036 },
      { text: '사진 고르기', rate: 0.024 },
    ],
  },
  {
    id: 'club',
    label: '1단계',
    spoken: '동아리 부탁을 급한 것부터 터뜨려요.',
    bundle: '준비물도 적고 역할도 나누고 초대 글도 써 주세요',
    need: 4,
    tasks: [
      { text: '준비물 목록', rate: 0.062 },
      { text: '역할 나누기', rate: 0.045 },
      { text: '초대 글 쓰기', rate: 0.032 },
      { text: '자리 배치', rate: 0.024 },
    ],
  },
  {
    id: 'fair',
    label: '2단계',
    spoken: '축제 부탁을 급한 것부터 터뜨려요.',
    bundle: '부스 이름도 정하고 가격표도 만들고 당번도 짜 주세요',
    need: 5,
    tasks: [
      { text: '부스 이름', rate: 0.07 },
      { text: '가격표 만들기', rate: 0.056 },
      { text: '안내 방송 글', rate: 0.043 },
      { text: '당번 짜기', rate: 0.033 },
      { text: '정리 순서', rate: 0.025 },
    ],
  },
];

interface World {
  balloons: Balloon[];
  done: number;
  lives: number;
  popping: { id: number; left: number } | null;
  phase: 'ready' | 'play';
  finished: boolean;
}

export default function OneCounterQueueGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 부푸는 속도·처리 시간·기회로 나타난다. 부탁과 급한 차례는 같다. */
  const rateScale = clamp(tuning.speed, 0.55, 1.3);
  const popSeconds = 1.2 / clamp(tuning.speed, 0.8, 1.3);
  const maxLives = tuning.lives;
  const baseR = 46 * clamp(tuning.size, 0.9, 1.25);

  const worldRef = useRef<World>({
    balloons: [], done: 0, lives: maxLives, popping: null, phase: 'ready', finished: false,
  });
  const [hud, setHud] = useState({ done: 0, lives: maxLives, note: '' });

  useEffect(() => {
    const random = createRandom(game.seed);
    const spots = shuffle(random, [
      [200, 190], [470, 150], [740, 200], [300, 330], [640, 340], [470, 260],
    ]);
    worldRef.current = {
      balloons: stage.tasks.map((task, index) => ({
        id: index,
        text: task.text,
        urgency: 0.18 + index * 0.04,
        rate: task.rate,
        x: spots[index % spots.length][0],
        y: spots[index % spots.length][1],
        vx: randRange(random, -22, 22),
        vy: randRange(random, -16, 16),
        popped: false,
      })),
      done: 0, lives: maxLives, popping: null, phase: 'ready', finished: false,
    };
    setHud({ done: 0, lives: maxLives, note: '' });
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  const radiusOf = (b: Balloon) => baseR * (0.72 + b.urgency * 0.75);

  const pop = (x: number, y: number) => {
    const w = worldRef.current;
    if (!game.playing || w.finished) return;
    if (w.phase === 'ready') { w.phase = 'play'; return; }
    if (w.popping) {
      setHud((prev) => ({ ...prev, note: '한 번에 하나씩만 보낼 수 있어요.' }));
      return;
    }
    const alive = w.balloons.filter((b) => !b.popped);
    const hit = alive.find((b) => dist(b.x, b.y, x, y) <= radiusOf(b));
    if (!hit) return;

    // 지금 가장 급한 풍선인지 본다. 크기와 색이 이미 그것을 말해 준다.
    const mostUrgent = alive.reduce((a, b) => (a.urgency >= b.urgency ? a : b));
    if (hit.id !== mostUrgent.id) {
      w.lives -= 1;
      setHud((prev) => ({ ...prev, lives: w.lives, note: '더 크고 빨간 풍선이 남아 있어요. 급한 것부터 보내세요.' }));
      playSound('select');
      if (w.lives <= 0) {
        w.finished = true;
        game.fail('급하지 않은 부탁을 먼저 보냈어요. 가장 크고 빨간 풍선부터 눌러 봐요.');
      }
      return;
    }

    playSound('confirm');
    w.popping = { id: hit.id, left: popSeconds };
    setHud((prev) => ({ ...prev, note: `"${hit.text}"를 보내는 중입니다.` }));
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && game.playing && !w.finished && w.phase === 'play') {
      if (w.popping) {
        w.popping.left -= dt;
        if (w.popping.left <= 0) {
          const target = w.balloons.find((b) => b.id === w.popping?.id);
          if (target) target.popped = true;
          w.popping = null;
          w.done += 1;
          setHud((prev) => ({ ...prev, done: w.done, note: '' }));
          if (w.done >= stage.need) {
            w.finished = true;
            game.succeed('부탁을 하나씩 나눠 급한 것부터 차례로 보냈어요!');
          }
        }
      }

      for (const b of w.balloons) {
        if (b.popped) continue;
        b.urgency = Math.min(1.35, b.urgency + b.rate * rateScale * dt);
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        const r = radiusOf(b);
        if (b.x < r) { b.x = r; b.vx = Math.abs(b.vx); }
        if (b.x > WORLD_W - r) { b.x = WORLD_W - r; b.vx = -Math.abs(b.vx); }
        if (b.y < r + 74) { b.y = r + 74; b.vy = Math.abs(b.vy); }
        if (b.y > WORLD_H - r - 16) { b.y = WORLD_H - r - 16; b.vy = -Math.abs(b.vy); }

        if (b.urgency >= 1.3) {
          // 너무 부풀면 터져 버린다 — 마감을 넘긴 부탁이다
          b.popped = true;
          w.lives -= 1;
          setHud((prev) => ({ ...prev, lives: w.lives, note: `"${b.text}"의 마감이 지났어요.` }));
          if (w.lives <= 0 && !w.finished) {
            w.finished = true;
            game.fail('마감이 지난 부탁이 있어요. 가장 크고 빨간 풍선부터 보내 봐요.');
          }
        }
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    panel(ctx, 16, 14, WORLD_W - 32, 48, BOARD.overlay, PLAY.info, 12);
    centerText(ctx, `묶음 부탁 · ${stage.bundle}`, WORLD_W / 2, 38, 22, BOARD.ink);

    for (const b of w.balloons) {
      if (b.popped) continue;
      const r = radiusOf(b);
      const hot = clamp(b.urgency, 0, 1);
      const fill = `rgb(${Math.round(56 + hot * 195)}, ${Math.round(189 - hot * 76)}, ${Math.round(248 - hot * 115)})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = hot > 0.72 ? '#7F1D1D' : '#0369A1';
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + r);
      ctx.lineTo(b.x, b.y + r + 22);
      ctx.strokeStyle = BOARD.line;
      ctx.lineWidth = 3;
      ctx.stroke();
      centerText(ctx, b.text, b.x, b.y, Math.max(20, Math.round(r * 0.34)), '#0F172A');

      if (w.popping?.id === b.id) {
        const ratio = 1 - w.popping.left / popSeconds;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r + 10, -Math.PI / 2, -Math.PI / 2 + ratio * Math.PI * 2);
        ctx.strokeStyle = PLAY.goal;
        ctx.lineWidth = 6;
        ctx.stroke();
      }
    }

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 250, WORLD_H - 84, 500, 58, BOARD.overlay, PLAY.hero, 14);
      centerText(ctx, '풍선을 누르면 시작합니다', WORLD_W / 2, WORLD_H - 55, 24, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="급한 부탁 풍선"
      instruction="묶음 부탁이 풍선 여러 개로 떠 있어요. 가장 크고 빨간 풍선부터 하나씩 눌러 보내세요."
      progress={{ label: '보낸 부탁', value: hud.done, max: stage.need }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="aspect-video max-h-full w-full max-w-[760px]">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => { if (pointer.phase === 'down') pop(pointer.x, pointer.y); }}
              ariaLabel={`급한 부탁 풍선부터 터뜨리는 놀이. 보낸 부탁 ${hud.done}개, 남은 기회 ${hud.lives}개.`}
            />
          </div>
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{hud.note}</p>
      </div>
    </MiniGameFrame>
  );
}
