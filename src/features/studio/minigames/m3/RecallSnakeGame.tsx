import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, createRandom, drawBar, shuffle,
  useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

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
/* 칸 수. 16x9로 두었더니 한 칸이 60x47이라 "어떤 모양" 같은 글자가 칸을 넘쳐
   옆 조각과 겹쳐 읽혔다. 12x7로 줄여 한 칸을 80x61로 넓힌다. */
const COLS = 12;
const ROWS = 7;
const CELL_W = WORLD_W / COLS;
/* 위 44px는 떠올린 차례를 적는 띠, 아래 56px는 속도 게이지 자리다. */
const BOARD_TOP = 60;
const BOARD_BOTTOM = 56;
const CELL_H = (WORLD_H - BOARD_TOP - BOARD_BOTTOM) / ROWS;
const PACE_MIN = 0.6;
const PACE_MAX = 1.8;

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
  /* 학생이 스스로 고르는 속도. 지원 수준이 정한 값 위에 얹는다.
     손이 느린 학생은 늦추고, 익숙해지면 올려 쓴다. */
  const [pace, setPace] = useState(1);
  const step = 0.5 / (clamp(tuning.speed, 0.7, 1.35) * pace);
  const maxLives = tuning.lives;
  const count = stage.steps.length;

  const worldRef = useRef<World>(buildWorld(stage, game.seed, maxLives, count));
  const [hud, setHud] = useState({ index: 0, lives: maxLives });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    worldRef.current = buildWorld(stage, game.seed, maxLives, count);
    setHud({ index: 0, lives: maxLives });
    setPace(1);
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
            game.fail('생명력을 다 썼어요. 초록색 조각만 차례대로 먹어 보아요.');
          } else if (w.index >= w.pieces.length) {
            w.finished = true;
            game.succeed(`${stage.topic}의 차례를 처음부터 끝까지 내 힘으로 떠올렸어요!`);
          }
        }
      }
    }

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 지금까지 떠올린 차례
    const recalled = w.pieces.filter((p) => p.eaten).map((p) => p.text).join(' → ');
    drawBar(ctx, 12, 8, WORLD_W - 24, 44, { fill: B.ground, stroke: B.blue, width: STROKE.base });
    centerText(ctx, recalled ? `떠올린 차례 · ${recalled}` : `${stage.topic} · 파란 조각부터 먹으세요`,
      WORLD_W / 2, 30, 22, B.ink);

    const top = BOARD_TOP;

    /* 벽을 붉게 두른다. 어디까지가 판인지 눈에 보이지 않으면 왜 부딪혔는지 알 수 없다. */
    ctx.strokeStyle = B.red;
    ctx.lineWidth = STROKE.heavy;
    ctx.strokeRect(3, top + 3, COLS * CELL_W - 6, ROWS * CELL_H - 6);

    // 판 눈금
    /* 눈금은 바탕보다 한 겹만 뜬다. 뱀과 조각을 읽는 데 방해가 되면 안 된다. */
    ctx.strokeStyle = B.surface;
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
      /* 다음에 먹을 조각만 파랑으로 꽉 차고 테두리도 굵다. 나머지는 회색 면이다.
         채움과 굵기가 함께 달라져 색을 못 가려도 다음 차례가 보인다. */
      drawBar(ctx, piece.c * CELL_W + 2, top + piece.r * CELL_H + 2, CELL_W - 4, CELL_H - 4, {
        fill: active ? B.blue : B.surface,
        stroke: active ? B.keyline : B.grey,
        width: active ? STROKE.base : STROKE.hair,
      });
      centerText(ctx, `${index + 1}`, piece.c * CELL_W + CELL_W / 2, top + piece.r * CELL_H + 17, 18,
        active ? B.ground : B.grey);
      centerText(ctx, piece.text, piece.c * CELL_W + CELL_W / 2, top + piece.r * CELL_H + CELL_H / 2 + 12, 16,
        active ? B.ground : B.ink);
    });

    w.body.forEach((seg, index) => {
      /* 머리는 노랑, 몸통은 회색이다. 학생이 모는 것의 앞머리가 늘 노랑이다. */
      drawBar(ctx, seg.c * CELL_W + 3, top + seg.r * CELL_H + 3, CELL_W - 6, CELL_H - 6, {
        fill: index === 0 ? B.yellow : B.grey,
        stroke: B.keyline,
        width: STROKE.hair,
      });
    });

    // 속도 게이지 — 판 아래에 둔다
    const gaugeY = WORLD_H - BOARD_BOTTOM + 12;
    centerText(ctx, '느리게', 66, gaugeY + 16, 20, B.grey);
    centerText(ctx, '빠르게', WORLD_W - 66, gaugeY + 16, 20, B.grey);
    drawBar(ctx, 130, gaugeY, WORLD_W - 260, 32, { fill: B.ground, stroke: B.grey, width: STROKE.hair });
    const ratio = (pace - PACE_MIN) / (PACE_MAX - PACE_MIN);
    drawBar(ctx, 134, gaugeY + 4, (WORLD_W - 268) * ratio, 24, { fill: B.yellow });
    centerText(ctx, `뱀 속도 ${pace.toFixed(1)}배 · 눌러서 바꾸기`, WORLD_W / 2, gaugeY + 17, 20, B.ink);

    if (w.phase === 'ready' && !w.finished) {
      drawBar(ctx, WORLD_W / 2 - 230, WORLD_H - BOARD_BOTTOM - 62, 460, 52,
        { fill: B.ground, stroke: B.yellow, width: STROKE.base });
      centerText(ctx, '방향키를 누르면 움직입니다', WORLD_W / 2, WORLD_H - BOARD_BOTTOM - 36, 24, B.ink);
    }
  };

  return (
    <MiniGameFrame
      bauhaus
      badge="떠올린 순서 뱀"
      instruction="파란 조각을 차례대로 잡아먹어 보아요. 회색 상자를 먼저 먹으면 생명력이 떨어집니다. 붉은 벽에 부딪혀도 떨어집니다."
      progress={{ label: '떠올린 차례', value: hud.index, max: count }}
      hud={<GameHud bauhaus lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => turn(0, -1)} mark="arrow" markRotate={270} label="위" />
          <MiniGameButton onClick={() => turn(0, 1)} mark="arrow" markRotate={90} label="아래" />
          <MiniGameButton onClick={() => turn(-1, 0)} mark="arrow" markRotate={180} label="왼쪽" />
          <MiniGameButton onClick={() => turn(1, 0)} mark="arrow" label="오른쪽" />
          <MiniGameButton onClick={game.retry} mark="retry" label="다시" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase !== 'down') return;
              /* 아래 게이지를 누르면 그 자리만큼 속도가 정해진다. 단추를 따로 두면
                 조작 줄이 일곱 개가 되어 좁은 화면에서 글자가 접힌다. */
              if (pointer.y >= WORLD_H - BOARD_BOTTOM) {
                const ratio = clamp((pointer.x - 134) / (WORLD_W - 268), 0, 1);
                setPace(Number((PACE_MIN + (PACE_MAX - PACE_MIN) * ratio).toFixed(1)));
                return;
              }
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
