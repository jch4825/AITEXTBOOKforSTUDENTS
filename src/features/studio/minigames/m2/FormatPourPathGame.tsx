import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l8 · 형식 틀로 흘리기 (장르 6 · 경로 그리기)
 *
 * "할 일에 맞는 형식을 고른다"를 두 손동작으로 나눈다. 먼저 통에 붙일 형식을 고르고,
 * 그다음 구슬이 그 통까지 굴러가도록 미끄럼틀을 직접 그린다.
 *
 * 통은 하나뿐이다. 통이 여럿이면 "어디에 넣을까"를 고르는 놀이가 되어, 정작 이 차시가
 * 묻는 "이 할 일은 어떤 모양이어야 하나"가 뒤로 밀린다. 형식을 먼저 정하고 그 형식이
 * 맞았는지 구슬이 굴러가 확인해 준다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const BIN_Y = WORLD_H - 108;
const BIN_W = 260;
const BIN_X = (WORLD_W - BIN_W) / 2;
const BALL_R = 15;

type Format = '표' | '번호 목록' | '한 문장';
const FORMATS: Format[] = ['표', '번호 목록', '한 문장'];

interface Job {
  label: string;
  format: Format;
  /** 구슬이 떨어지는 자리 */
  x: number;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  jobs: Job[];
  ink: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'class',
    label: '기본',
    spoken: '할 일에 맞는 형식을 골라 흘려 보내요.',
    ink: 1000,
    jobs: [
      { label: '친구 12명 이름과 번호', format: '표', x: 190 },
      { label: '라면 끓이는 차례', format: '번호 목록', x: 760 },
      { label: '오늘 날씨 한마디', format: '한 문장', x: 300 },
    ],
  },
  {
    id: 'trip',
    label: '1단계',
    spoken: '현장학습 준비를 형식에 맞춰 흘려 보내요.',
    ink: 880,
    jobs: [
      { label: '모둠별 준비물과 개수', format: '표', x: 800 },
      { label: '버스 타는 차례', format: '번호 목록', x: 160 },
      { label: '오늘 목표 한마디', format: '한 문장', x: 660 },
    ],
  },
  {
    id: 'fair',
    label: '2단계',
    spoken: '축제 준비를 형식에 맞춰 흘려 보내요.',
    ink: 760,
    jobs: [
      { label: '부스 물건과 가격', format: '표', x: 150 },
      { label: '정리하는 차례', format: '번호 목록', x: 820 },
      { label: '손님께 드릴 인사말', format: '한 문장', x: 480 },
    ],
  },
];

interface Seg {
  ax: number;
  ay: number;
  bx: number;
  by: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
  landed: boolean;
}

/** 점에서 선분까지의 가장 가까운 점. 구슬이 선을 타고 미끄러지게 하는 데 쓴다. */
function closestOnSeg(px: number, py: number, seg: Seg) {
  const dx = seg.bx - seg.ax;
  const dy = seg.by - seg.ay;
  const len2 = dx * dx + dy * dy;
  if (len2 < 0.01) return { x: seg.ax, y: seg.ay, tx: 1, ty: 0 };
  const t = clamp(((px - seg.ax) * dx + (py - seg.ay) * dy) / len2, 0, 1);
  const len = Math.sqrt(len2);
  return { x: seg.ax + dx * t, y: seg.ay + dy * t, tx: dx / len, ty: dy / len };
}

export default function FormatPourPathGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 잉크·통 너비·기회로 나타난다. 할 일과 형식은 셋 모두 같다. */
  const inkTotal = Math.round(stage.ink * clamp(tuning.tolerance, 0.8, 1.5));
  const binW = BIN_W * clamp(tuning.size, 0.85, 1.25);
  const binX = (WORLD_W - binW) / 2;
  const maxLives = tuning.lives;
  const gravity = 700 * clamp(tuning.speed, 0.75, 1.25);

  const segsRef = useRef<Seg[]>([]);
  const drawRef = useRef<{ x: number; y: number } | null>(null);
  const ballRef = useRef<Ball | null>(null);
  const finishedRef = useRef(false);
  const settleRef = useRef(0);

  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<Format | null>(null);
  const [ink, setInk] = useState(inkTotal);
  const [lives, setLives] = useState(maxLives);
  const [note, setNote] = useState('');

  const job = stage.jobs[Math.min(round, stage.jobs.length - 1)];

  const resetRound = () => {
    segsRef.current = [];
    drawRef.current = null;
    ballRef.current = null;
    settleRef.current = 0;
    setPicked(null);
    setInk(inkTotal);
  };

  useEffect(() => {
    setRound(0);
    setLives(maxLives);
    setNote('');
    finishedRef.current = false;
    resetRound();
    // resetRound는 ref와 이 컴포넌트 상태만 건드려 의존성에 넣을 필요가 없다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.round, game.stageIndex, stage, inkTotal, maxLives]);

  const clearLast = () => {
    if (!game.playing) return;
    const last = segsRef.current.pop();
    if (last) {
      setInk((value) => Math.min(inkTotal, value + Math.hypot(last.bx - last.ax, last.by - last.ay)));
      playSound('select');
    }
  };

  const pour = () => {
    if (!game.playing || ballRef.current) return;
    if (!picked) {
      setNote('먼저 통에 붙일 형식을 고르세요.');
      return;
    }
    ballRef.current = { x: job.x, y: 150, vx: 0, vy: 0, alive: true, landed: false };
    settleRef.current = 0;
    playSound('confirm');
    game.run('구슬을 흘려 봅니다.');
  };

  const judge = (inBin: boolean) => {
    const ball = ballRef.current;
    if (ball) ball.alive = false;

    if (inBin && picked === job.format) {
      const next = round + 1;
      if (next >= stage.jobs.length) {
        finishedRef.current = true;
        game.succeed('할 일마다 알맞은 형식을 골라 세 구슬을 모두 흘려보냈어요!');
        return;
      }
      setRound(next);
      resetRound();
      setNote('알맞은 형식이었어요. 다음 할 일로 넘어갑니다.');
      game.resume();
      return;
    }

    const left = lives - 1;
    setLives(left);
    if (left <= 0) {
      finishedRef.current = true;
      game.fail(
        inBin
          ? '형식이 할 일과 맞지 않았어요. 할 일의 모양을 보고 형식을 골라 봐요.'
          : '구슬이 통에 들어가지 않았어요. 통까지 이어지는 미끄럼틀을 그려 봐요.',
      );
      return;
    }
    setNote(
      inBin
        ? `'${picked}'은 이 할 일과 맞지 않아요. 형식을 다시 골라 보세요.`
        : '통에 들어가지 않았어요. 미끄럼틀을 고쳐 다시 쏟아 보세요.',
    );
    ballRef.current = null;
    game.resume();
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const ball = ballRef.current;

    if (dt > 0 && game.status === 'running' && ball && ball.alive && !finishedRef.current) {
      // 작은 걸음으로 여러 번 나눠 풀어야 얇은 선을 뚫고 지나가지 않는다.
      const steps = 5;
      const h = dt / steps;
      for (let i = 0; i < steps; i += 1) {
        ball.vy += gravity * h;
        ball.x += ball.vx * h;
        ball.y += ball.vy * h;

        // 가장 가까운 선 하나만 푼다. 여러 선을 한 걸음에 풀면 속도가 겹쳐 깎여 멈춘다.
        let best: { x: number; y: number; tx: number; ty: number; d: number } | null = null;
        for (const seg of segsRef.current) {
          const p = closestOnSeg(ball.x, ball.y, seg);
          const d = Math.hypot(ball.x - p.x, ball.y - p.y);
          if (d > BALL_R + 5) continue;
          if (!best || d < best.d) best = { ...p, d };
        }
        if (best) {
          const nx = -best.ty;
          const ny = best.tx;
          const side = (ball.x - best.x) * nx + (ball.y - best.y) * ny >= 0 ? 1 : -1;
          // 선을 파고든 만큼만 밀어낸다. 통째로 옮기면 구슬이 튀어 오른다.
          const push = BALL_R + 1 - best.d;
          if (push > 0) {
            ball.x += nx * side * push;
            ball.y += ny * side * push;
          }
          // 선을 따라가는 성분만 남긴다. 마찰은 아주 약하게 두어야 끝까지 굴러간다.
          const along = ball.vx * best.tx + ball.vy * best.ty;
          ball.vx = best.tx * along * 0.999;
          ball.vy = best.ty * along * 0.999;
        }

        if (ball.x < BALL_R) { ball.x = BALL_R; ball.vx = Math.abs(ball.vx) * 0.5; }
        if (ball.x > WORLD_W - BALL_R) { ball.x = WORLD_W - BALL_R; ball.vx = -Math.abs(ball.vx) * 0.5; }
      }

      const speed = Math.hypot(ball.vx, ball.vy);
      settleRef.current = speed < 26 ? settleRef.current + dt : 0;

      if (ball.y >= BIN_Y + 10 && !ball.landed) {
        ball.landed = true;
        judge(ball.x > binX && ball.x < binX + binW);
      } else if (ball.y > WORLD_H + 60 && !ball.landed) {
        ball.landed = true;
        judge(false);
      } else if (settleRef.current > 1.4 && !ball.landed) {
        // 선 위에 얹혀 멈춰 버린 구슬도 판정한다. 영원히 기다리게 두지 않는다.
        ball.landed = true;
        judge(false);
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 통 하나 — 학생이 고른 형식이 이름표가 된다
    panel(ctx, binX, BIN_Y, binW, 96, BOARD.surface, picked ? PLAY.goal : BOARD.line, 14);
    centerText(ctx, picked ?? '형식을 고르세요', binX + binW / 2, BIN_Y + 48, 28, BOARD.ink);

    ctx.strokeStyle = PLAY.info;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    for (const seg of segsRef.current) {
      ctx.beginPath();
      ctx.moveTo(seg.ax, seg.ay);
      ctx.lineTo(seg.bx, seg.by);
      ctx.stroke();
    }

    const bx = ball ? ball.x : job.x;
    const by = ball ? ball.y : 150;
    ctx.beginPath();
    ctx.arc(bx, by, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = PLAY.hero;
    ctx.fill();
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.lineWidth = 4;
    ctx.stroke();

    panel(ctx, WORLD_W / 2 - 300, 18, 600, 52, BOARD.overlay, PLAY.info, 12);
    centerText(ctx, `할 일 · ${job.label}`, WORLD_W / 2, 44, 26, BOARD.ink);

    if (game.playing && segsRef.current.length === 0) {
      centerText(ctx, '마우스로 드래그하면 미끄럼틀을 만들 수 있어요', WORLD_W / 2, 100, 22, BOARD.inkDim);
    }
  };

  return (
    <MiniGameFrame
      badge="형식 틀로 흘리기"
      instruction="할 일에 맞는 형식을 골라 통에 붙이고, 마우스로 드래그하면 미끄럼틀을 만들 수 있어요. 구슬이 통에 들어가면 성공입니다."
      progress={{ label: '보낸 구슬', value: round, max: stage.jobs.length }}
      hud={<GameHud lives={lives} maxLives={maxLives} score={Math.round(ink)} scoreLabel="남은 잉크" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="처음부터" />
          <MiniGameButton onClick={clearLast} disabled={game.isLocked} emoji="↩️" label="한 줄 지우기" />
          <MiniGameButton onClick={pour} disabled={game.isLocked || !game.playing} emoji="🫗" label="쏟기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {FORMATS.map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => { setPicked(format); setNote(''); playSound('select'); }}
              aria-pressed={picked === format}
              disabled={game.isLocked}
              className="min-h-11 flex-1 rounded-xl px-2 text-[16px] font-black transition"
              style={{
                background: picked === format ? '#4ADE80' : 'var(--board-surface)',
                color: picked === format ? '#0F172A' : 'var(--board-ink)',
                border: '2px solid #4ADE80',
              }}
            >
              {format}
            </button>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="aspect-video max-h-full w-full max-w-[760px]">
            <GameCanvas
              active={game.playing || game.status === 'running'}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                if (!game.playing) return;
                if (pointer.phase === 'down') { drawRef.current = { x: pointer.x, y: pointer.y }; return; }
                if (pointer.phase === 'up') { drawRef.current = null; return; }
                const from = drawRef.current;
                if (!from) return;
                const len = Math.hypot(pointer.x - from.x, pointer.y - from.y);
                if (len < 14) return;
                if (ink - len <= 0) return;
                segsRef.current.push({ ax: from.x, ay: from.y, bx: pointer.x, by: pointer.y });
                setInk((value) => Math.max(0, value - len));
                drawRef.current = { x: pointer.x, y: pointer.y };
              }}
              ariaLabel={`${job.label}을 알맞은 형식 통으로 보내는 놀이. 보낸 구슬 ${round}개, 남은 기회 ${lives}개.`}
            />
          </div>
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
