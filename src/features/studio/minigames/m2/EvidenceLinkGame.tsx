import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, randInt, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l9 · 주장과 근거 쌓기 (장르 14 → 낙하 블록 퍼즐)
 *
 * "아이미에게 다시 묻지 말고 공지와 대조하라"를 줄 맞추기로 만든다. 위에서 주장
 * 조각이 떨어지고, 아래 공지 줄과 나란히 한 줄이 꽉 차면 그 줄이 "확인 완료"로 지워진다.
 *
 * 조각을 아무 데나 쌓으면 판이 금세 천장에 닿는다. 어디를 채워야 줄이 완성되는지
 * 보고 넣는 것이 곧 "무엇과 대조할지 고르는 일"이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const COLS = 10;
const ROWS = 15;
const CELL = 28;
/* 위쪽 공지 띠와 겹치지 않게 판을 아래로 내리고, 왼쪽 안내 칸을 피해 오른쪽으로 민다. */
const BOARD_X = (WORLD_W - COLS * CELL) / 2 + 100;
const BOARD_Y = 80;

/** 일곱 조각. 각 회전은 [행, 열] 목록으로 적어 둔다. */
const SHAPES: number[][][][] = [
  // I
  [[[1, 0], [1, 1], [1, 2], [1, 3]], [[0, 2], [1, 2], [2, 2], [3, 2]]],
  // O
  [[[0, 1], [0, 2], [1, 1], [1, 2]]],
  // T
  [[[0, 1], [1, 0], [1, 1], [1, 2]], [[0, 1], [1, 1], [1, 2], [2, 1]],
   [[1, 0], [1, 1], [1, 2], [2, 1]], [[0, 1], [1, 0], [1, 1], [2, 1]]],
  // S
  [[[0, 1], [0, 2], [1, 0], [1, 1]], [[0, 1], [1, 1], [1, 2], [2, 2]]],
  // Z
  [[[0, 0], [0, 1], [1, 1], [1, 2]], [[0, 2], [1, 1], [1, 2], [2, 1]]],
  // J
  [[[0, 0], [1, 0], [1, 1], [1, 2]], [[0, 1], [0, 2], [1, 1], [2, 1]],
   [[1, 0], [1, 1], [1, 2], [2, 2]], [[0, 1], [1, 1], [2, 0], [2, 1]]],
  // L
  [[[0, 2], [1, 0], [1, 1], [1, 2]], [[0, 1], [1, 1], [2, 1], [2, 2]],
   [[1, 0], [1, 1], [1, 2], [2, 0]], [[0, 0], [0, 1], [1, 1], [2, 1]]],
];

const COLORS = ['#38BDF8', '#FBBF24', '#C4B5FD', '#4ADE80', '#FB7185', '#60A5FA', '#FB923C'];

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  notice: string;
  claims: string[];
  need: number;
  fall: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'trip',
    label: '기본',
    spoken: '현장학습 공지와 대조해요.',
    notice: '현장학습 공지 · 금요일 9시 · 체육관 앞 · 물병',
    claims: ['9시에 모여요', '체육관 앞이에요', '물병을 챙겨요', '금요일이에요'],
    need: 2,
    fall: 0.38,
  },
  {
    id: 'library',
    label: '1단계',
    spoken: '도서관 공지와 대조해요.',
    notice: '도서관 공지 · 2층 · 2권까지 · 7일 · 월요일 휴관',
    claims: ['2층에 있어요', '두 권 빌려요', '일주일 빌려요', '월요일 쉬어요'],
    need: 3,
    fall: 0.32,
  },
  {
    id: 'sports',
    label: '2단계',
    spoken: '운동회 공지와 대조해요.',
    notice: '운동회 공지 · 운동장 · 체육복 · 2교시 · 급식',
    claims: ['운동장에서 해요', '체육복을 입어요', '2교시에 시작해요', '점심은 급식이에요'],
    need: 3,
    fall: 0.27,
  },
];

interface Piece {
  kind: number;
  rot: number;
  r: number;
  c: number;
  claim: string;
}

interface World {
  grid: number[][];
  piece: Piece | null;
  next: number;
  timer: number;
  cleared: number;
  lives: number;
  phase: 'ready' | 'play';
  finished: boolean;
  banner: string;
  /** 빨리 내리기가 남은 시간. 버튼 한 번이 한 프레임만 듣던 문제를 막는다. */
  soft: number;
}

function emptyGrid() {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => -1));
}

function cellsOf(piece: Piece) {
  const rots = SHAPES[piece.kind];
  return rots[piece.rot % rots.length].map(([r, c]) => [piece.r + r, piece.c + c]);
}

function fits(grid: number[][], piece: Piece) {
  return cellsOf(piece).every(([r, c]) =>
    c >= 0 && c < COLS && r < ROWS && (r < 0 || grid[r][c] < 0));
}

export default function EvidenceLinkGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 떨어지는 간격과 기회로 나타난다. 지워야 할 줄 수는 스테이지가 정한다. */
  const fallStep = stage.fall / clamp(tuning.speed, 0.7, 1.3);
  const maxLives = tuning.lives;

  const worldRef = useRef<World>({
    grid: emptyGrid(), piece: null, next: 0, timer: 0, cleared: 0,
    lives: maxLives, phase: 'ready', finished: false, banner: '', soft: 0,
  });
  const randomRef = useRef(createRandom(game.seed));
  const [hud, setHud] = useState({ cleared: 0, lives: maxLives, claim: '' });
  const keys = useGameKeys(game.playing);
  const nudgeRef = useRef<'left' | 'right' | 'down' | 'rot' | null>(null);

  useEffect(() => {
    randomRef.current = createRandom(game.seed);
    worldRef.current = {
      grid: emptyGrid(), piece: null, next: randInt(randomRef.current, 0, SHAPES.length),
      timer: 0, cleared: 0, lives: maxLives, phase: 'ready', finished: false, banner: '', soft: 0,
    };
    setHud({ cleared: 0, lives: maxLives, claim: '' });
    nudgeRef.current = null;
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  const spawn = (w: World) => {
    const random = randomRef.current;
    const kind = w.next;
    w.next = randInt(random, 0, SHAPES.length);
    const claim = stage.claims[randInt(random, 0, stage.claims.length)];
    const piece: Piece = { kind, rot: 0, r: -2, c: Math.floor(COLS / 2) - 2, claim };
    if (!fits(w.grid, piece)) {
      w.finished = true;
      game.fail('조각이 천장까지 쌓였어요. 빈 곳을 채워 줄을 지워 봐요.');
      return;
    }
    w.piece = piece;
  };

  const lockPiece = (w: World) => {
    const piece = w.piece;
    if (!piece) return;
    for (const [r, c] of cellsOf(piece)) {
      if (r >= 0) w.grid[r][c] = piece.kind;
    }
    w.piece = null;

    let removed = 0;
    for (let r = ROWS - 1; r >= 0; r -= 1) {
      if (w.grid[r].some((v) => v < 0)) continue;
      w.grid.splice(r, 1);
      w.grid.unshift(Array.from({ length: COLS }, () => -1));
      removed += 1;
      r += 1;
    }
    if (removed > 0) {
      w.cleared += removed;
      w.banner = `공지와 대조해 ${removed}줄을 확인했어요.`;
      playSound('confirm');
      if (w.cleared >= stage.need) {
        w.finished = true;
        game.succeed('주장을 공지와 나란히 놓고 확인해 모두 지웠어요!');
        return;
      }
    }
    spawn(w);
  };

  const move = (w: World, dc: number, dr: number) => {
    if (!w.piece) return false;
    const test = { ...w.piece, c: w.piece.c + dc, r: w.piece.r + dr };
    if (!fits(w.grid, test)) return false;
    w.piece = test;
    return true;
  };

  const rotate = (w: World) => {
    if (!w.piece) return;
    const rots = SHAPES[w.piece.kind];
    const test = { ...w.piece, rot: (w.piece.rot + 1) % rots.length };
    if (fits(w.grid, test)) { w.piece = test; return; }
    for (const shift of [-1, 1, -2, 2]) {
      const shifted = { ...test, c: test.c + shift };
      if (fits(w.grid, shifted)) { w.piece = shifted; return; }
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      const nudge = nudgeRef.current;
      nudgeRef.current = null;

      if (w.phase === 'ready') {
        if (nudge || keys.consumePress('action') || keys.consumePress('left')
          || keys.consumePress('right') || keys.consumePress('down')) {
          w.phase = 'play';
          spawn(w);
        }
      } else {
        if (nudge === 'left' || keys.consumePress('left')) move(w, -1, 0);
        if (nudge === 'right' || keys.consumePress('right')) move(w, 1, 0);
        if (nudge === 'rot' || keys.consumePress('up') || keys.consumePress('action')) rotate(w);
        if (nudge === 'down') w.soft = 0.5;
        w.soft = Math.max(0, w.soft - dt);
        const soft = w.soft > 0 || keys.held.current.down;

        w.timer += dt * (soft ? 8 : 1);
        if (w.timer >= fallStep) {
          w.timer = 0;
          if (!move(w, 0, 1)) lockPiece(w);
        }
      }

      if (w.cleared !== hud.cleared || w.lives !== hud.lives || (w.piece?.claim ?? '') !== hud.claim) {
        setHud({ cleared: w.cleared, lives: w.lives, claim: w.piece?.claim ?? '' });
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    panel(ctx, 14, 16, WORLD_W - 28, 42, BOARD.overlay, PLAY.goal, 10);
    centerText(ctx, `📢 ${stage.notice}`, WORLD_W / 2, 37, 21, BOARD.ink);

    panel(ctx, BOARD_X - 6, BOARD_Y - 6, COLS * CELL + 12, ROWS * CELL + 12, BOARD.overlay, BOARD.line, 10);
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        const v = w.grid[r][c];
        const x = BOARD_X + c * CELL;
        const y = BOARD_Y + r * CELL;
        if (v < 0) {
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.22)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, CELL, CELL);
        } else {
          panel(ctx, x + 1, y + 1, CELL - 2, CELL - 2, COLORS[v], BOARD.ink, 5);
        }
      }
    }

    if (w.piece) {
      for (const [r, c] of cellsOf(w.piece)) {
        if (r < 0) continue;
        panel(ctx, BOARD_X + c * CELL + 1, BOARD_Y + r * CELL + 1, CELL - 2, CELL - 2,
          COLORS[w.piece.kind], BOARD.ink, 5);
      }
    }

    // 왼쪽 안내 — 지금 떨어지는 주장과 다음 조각
    panel(ctx, 18, 100, 250, 120, BOARD.surface, PLAY.info, 12);
    centerText(ctx, '지금 주장', 143, 126, 20, BOARD.inkDim);
    centerText(ctx, w.piece?.claim ?? '준비 중', 143, 160, 21, BOARD.ink);
    centerText(ctx, `지운 줄 ${w.cleared} / ${stage.need}`, 143, 196, 21, PLAY.goal);

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, 18, 246, 250, 88, BOARD.overlay, PLAY.hero, 12);
      centerText(ctx, '방향키나 아래 버튼을', 143, 276, 21, BOARD.ink);
      centerText(ctx, '누르면 시작합니다', 143, 304, 21, BOARD.ink);
    }
    if (w.banner) centerText(ctx, w.banner, 143, 370, 20, PLAY.goal);
  };

  return (
    <MiniGameFrame
      badge="주장과 근거 잇기"
      instruction="위에서 떨어지는 조각을 움직여 한 줄을 빈틈없이 채워 보세요. 줄을 맞추면 학교 공지와 확인을 마친 줄이 되어 사라집니다."
      progress={{ label: '확인한 줄', value: hud.cleared, max: stage.need }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => { nudgeRef.current = 'left'; }} emoji="⬅️" label="왼쪽" />
          <MiniGameButton onClick={() => { nudgeRef.current = 'rot'; }} emoji="🔃" label="돌리기" />
          <MiniGameButton onClick={() => { nudgeRef.current = 'right'; }} emoji="➡️" label="오른쪽" />
          <MiniGameButton onClick={() => { nudgeRef.current = 'down'; }} emoji="⬇️" label="빨리" />
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시" variant="primary" />
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
              if (pointer.y > WORLD_H * 0.72) { nudgeRef.current = 'down'; return; }
              if (pointer.x < BOARD_X) { nudgeRef.current = 'left'; return; }
              if (pointer.x > BOARD_X + COLS * CELL) { nudgeRef.current = 'right'; return; }
              nudgeRef.current = 'rot';
            }}
            ariaLabel={`주장 조각을 쌓아 줄을 지우는 놀이. 확인한 줄 ${hud.cleared}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
