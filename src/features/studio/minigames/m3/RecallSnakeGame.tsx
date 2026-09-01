import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, shuffle, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m3-l10 · 떠올린 순서 뱀 (장르 36 · 뱀 키우기)
 *
 * "자료를 덮고 먼저 떠올린다"를 순서대로 먹기로 만든다. 다음 차례의 조각만 빛나고
 * 나머지는 어둡다. 어두운 조각을 먹으면 순서가 뒤엉켜 기회가 준다.
 *
 * 조각을 먹을수록 몸이 길어져 판이 좁아진다 — 뒤로 갈수록 어려워지는 것이 자연스럽다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const COLS = 16;
const ROWS = 9;
const CELL_W = WORLD_W / COLS;
const CELL_H = (WORLD_H - 60) / ROWS;

interface Piece {
  c: number;
  r: number;
  text: string;
  eaten: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  topic: string;
  steps: string[];
}

const STAGES: StageConfig[] = [
  {
    id: 'ask',
    label: '기본',
    spoken: '오늘 배운 부탁하기 차례를 떠올려요.',
    topic: '좋은 부탁 만들기',
    steps: ['무엇을', '언제까지', '누구에게', '어떤 모양'],
  },
  {
    id: 'check',
    label: '1단계',
    spoken: '오늘 배운 확인하기 차례를 떠올려요.',
    topic: 'AI 답 확인하기',
    steps: ['답을 읽기', '사실 고르기', '공식 자료 보기', '다른 점 찾기', '고쳐 쓰기'],
  },
  {
    id: 'safe',
    label: '2단계',
    spoken: '오늘 배운 안전 차례를 떠올려요.',
    topic: '안전하게 쓰기',
    steps: ['개인정보 지우기', '조건만 남기기', '보내기', '결과 확인', '어른께 알리기', '기록 남기기'],
  },
];

interface World {
  body: { c: number; r: number }[];
  dir: { c: number; r: number };
  nextDir: { c: number; r: number };
  timer: number;
  pieces: Piece[];
  index: number;
  lives: number;
  phase: 'ready' | 'move';
  finished: boolean;
}

function buildWorld(stage: StageConfig, seed: number, lives: number, count: number): World {
  const random = createRandom(seed);
  const cells = shuffle(
    random,
    Array.from({ length: COLS * ROWS }, (_, i) => i).filter((i) => {
      const c = i % COLS;
      const r = Math.floor(i / COLS);
      return c > 4 || r > 2;
    }),
  ).slice(0, count);

  return {
    body: [{ c: 3, r: 1 }, { c: 2, r: 1 }, { c: 1, r: 1 }],
    dir: { c: 1, r: 0 },
    nextDir: { c: 1, r: 0 },
    timer: 0,
    pieces: cells.map((cell, index) => ({
      c: cell % COLS,
      r: Math.floor(cell / COLS),
      text: stage.steps[index],
      eaten: false,
    })),
    index: 0,
    lives,
    phase: 'ready',
    finished: false,
  };
}

export default function RecallSnakeGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 한 칸 움직이는 간격과 기회로 나타난다. 떠올릴 차례는 스테이지가 정한다. */
  const step = 0.5 / clamp(tuning.speed, 0.7, 1.35);
  const maxLives = tuning.lives;
  const count = stage.steps.length;

  const worldRef = useRef<World>(buildWorld(stage, game.seed, maxLives, count));
  const [hud, setHud] = useState({ index: 0, lives: maxLives });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    worldRef.current = buildWorld(stage, game.seed, maxLives, count);
    setHud({ index: 0, lives: maxLives });
  }, [game.round, game.stageIndex, stage, game.seed, maxLives, count]);

  const turn = (c: number, r: number) => {
    const w = worldRef.current;
    if (w.dir.c === -c && w.dir.r === -r) return;
    w.nextDir = { c, r };
    if (w.phase === 'ready') w.phase = 'move';
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && !w.finished && game.playing) {
      if (keys.held.current.left) turn(-1, 0);
      if (keys.held.current.right) turn(1, 0);
      if (keys.held.current.up) turn(0, -1);
      if (keys.held.current.down) turn(0, 1);

      if (w.phase === 'move') {
        w.timer += dt;
        if (w.timer >= step) {
          w.timer = 0;
          w.dir = w.nextDir;
          const head = w.body[0];
          const next = { c: head.c + w.dir.c, r: head.r + w.dir.r };

          const hitWall = next.c < 0 || next.c >= COLS || next.r < 0 || next.r >= ROWS;
          const hitSelf = w.body.some((seg) => seg.c === next.c && seg.r === next.r);
          if (hitWall || hitSelf) {
            w.lives -= 1;
            w.body = [{ c: 3, r: 1 }, { c: 2, r: 1 }, { c: 1, r: 1 }];
            w.dir = { c: 1, r: 0 };
            w.nextDir = { c: 1, r: 0 };
            w.phase = 'ready';
          } else {
            w.body.unshift(next);
            const piece = w.pieces.find((p) => !p.eaten && p.c === next.c && p.r === next.r);
            if (piece) {
              const wanted = w.pieces[w.index];
              if (piece === wanted) {
                piece.eaten = true;
                w.index += 1;
                playSound('fill');
              } else {
                // 순서를 건너뛰면 몸이 짧아지고 기회가 준다
                w.lives -= 1;
                w.body = w.body.slice(0, Math.max(3, w.body.length - 2));
                w.phase = 'ready';
              }
            } else {
              w.body.pop();
            }
          }

          if (w.index !== hud.index || w.lives !== hud.lives) {
            setHud({ index: w.index, lives: w.lives });
          }
          if (w.lives <= 0) {
            w.finished = true;
            game.fail('벽이나 순서를 놓쳤어요. 다음 차례로 빛나는 조각만 먹어 봐요.');
          } else if (w.index >= w.pieces.length) {
            w.finished = true;
            game.succeed(`${stage.topic}의 차례를 처음부터 끝까지 내 힘으로 떠올렸어요!`);
          }
        }
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 지금까지 떠올린 차례
    const recalled = w.pieces.filter((p) => p.eaten).map((p) => p.text).join(' → ');
    panel(ctx, 12, 8, WORLD_W - 24, 44, BOARD.overlay, PLAY.info, 10);
    centerText(ctx, recalled ? `떠올린 차례 · ${recalled}` : `${stage.topic} · 빛나는 조각부터 먹으세요`, WORLD_W / 2, 30, 22, BOARD.ink);

    const top = 60;
    // 판 눈금
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.28)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= COLS; c += 1) {
      ctx.beginPath();
      ctx.moveTo(c * CELL_W, top);
      ctx.lineTo(c * CELL_W, top + ROWS * CELL_H);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r += 1) {
      ctx.beginPath();
      ctx.moveTo(0, top + r * CELL_H);
      ctx.lineTo(COLS * CELL_W, top + r * CELL_H);
      ctx.stroke();
    }

    w.pieces.forEach((piece, index) => {
      if (piece.eaten) return;
      const active = index === w.index;
      panel(
        ctx, piece.c * CELL_W + 2, top + piece.r * CELL_H + 2, CELL_W - 4, CELL_H - 4,
        active ? '#065F46' : '#1E293B',
        active ? PLAY.goal : 'rgba(100, 116, 139, 0.6)', 8,
      );
      centerText(ctx, `${index + 1}`, piece.c * CELL_W + CELL_W / 2, top + piece.r * CELL_H + 16, 20,
        active ? BOARD.ink : BOARD.inkDim);
      centerText(ctx, piece.text, piece.c * CELL_W + CELL_W / 2, top + piece.r * CELL_H + CELL_H / 2 + 8, 20,
        active ? BOARD.ink : 'rgba(203, 213, 225, 0.55)');
    });

    w.body.forEach((seg, index) => {
      panel(
        ctx, seg.c * CELL_W + 3, top + seg.r * CELL_H + 3, CELL_W - 6, CELL_H - 6,
        index === 0 ? PLAY.hero : '#B45309',
        index === 0 ? PLAY.heroEdge : '#7C2D12', 8,
      );
    });

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 230, WORLD_H - 62, 460, 52, BOARD.overlay, PLAY.hero, 12);
      centerText(ctx, '방향키를 누르면 움직입니다', WORLD_W / 2, WORLD_H - 36, 24, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="떠올린 순서 뱀"
      instruction="다음 차례로 빛나는 조각만 순서대로 먹으세요. 벽이나 몸에 부딪히면 기회가 줄어듭니다."
      progress={{ label: '떠올린 차례', value: hud.index, max: count }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => turn(0, -1)} emoji="⬆️" label="위" />
          <MiniGameButton onClick={() => turn(0, 1)} emoji="⬇️" label="아래" />
          <MiniGameButton onClick={() => turn(-1, 0)} emoji="⬅️" label="왼쪽" />
          <MiniGameButton onClick={() => turn(1, 0)} emoji="➡️" label="오른쪽" />
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시" variant="primary" />
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
              if (pointer.phase !== 'down') return;
              const w = worldRef.current;
              const head = w.body[0];
              const hx = head.c * CELL_W + CELL_W / 2;
              const hy = 60 + head.r * CELL_H + CELL_H / 2;
              const dx = pointer.x - hx;
              const dy = pointer.y - hy;
              if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0);
              else turn(0, dy > 0 ? 1 : -1);
            }}
            ariaLabel={`오늘 배운 차례를 순서대로 먹는 놀이. 떠올린 차례 ${hud.index}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
