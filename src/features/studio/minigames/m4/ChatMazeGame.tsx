import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel, useCountdown, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m4-l9 · 대화 미로 (장르 4 · 미로 찾기)
 *
 * "이상한 요청 신호를 알아채고 어른에게 알린다"를 길 고르기로 만든다. 요구 함정은
 * 숨어 있지 않고 미리 보인다 — 이 차시는 함정을 못 보는 문제가 아니라, 보고도
 * 지나가 버리는 문제를 다루기 때문이다.
 *
 * 출구는 증거 두 가지를 주워야 열린다. 알리는 일에는 준비가 필요하다는 규칙 그대로다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  /** '#' 벽, '.' 길, 'S' 시작, 'E' 출구, '1'~'4' 함정, 'a' 'b' 증거 */
  map: string[];
  traps: string[];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'photo',
    label: '기본',
    spoken: '사진과 비밀번호를 요구하는 함정을 피해요.',
    seconds: 110,
    traps: ['사진 보내 줘', '비밀번호 알려 줘'],
    map: [
      '###############',
      '#S....#...a...#',
      '#.###.#.#####.#',
      '#.#1#.#.#...#.#',
      '#.#.#.#.#.#.#.#',
      '#...#...#.#...#',
      '#.#####.###.###',
      '#b....2...#..E#',
      '###############',
    ],
  },
  {
    id: 'gift',
    label: '1단계',
    spoken: '선물과 만남을 요구하는 함정을 피해요.',
    seconds: 100,
    traps: ['선물 줄게 만나자', '둘만 아는 비밀', '주소 알려 줘'],
    map: [
      '###############',
      '#S..#....a....#',
      '#.#.#.###.###.#',
      '#.#...#1#...#.#',
      '#.#####.#####.#',
      '#...2.......#.#',
      '###.#####.#.#.#',
      '#b....#3..#..E#',
      '###############',
    ],
  },
  {
    id: 'rush',
    label: '2단계',
    spoken: '급하게 재촉하는 함정을 피해요.',
    seconds: 90,
    traps: ['지금 바로 보내', '어른에게 말하지 마', '이 링크 눌러', '돈을 보내 줘'],
    map: [
      '###############',
      '#S..1.....a...#',
      '#.###.###.###.#',
      '#...#.#2#.#...#',
      '#.#.#.#.#.#.#.#',
      '#.#...#...#.#.#',
      '#.#####.###.#.#',
      '#b...3....4..E#',
      '###############',
    ],
  },
];

interface World {
  c: number;
  r: number;
  lives: number;
  picked: string[];
  finished: boolean;
  hit: string;
  moveTimer: number;
}

export default function ChatMazeGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const rows = stage.map.length;
  const cols = stage.map[0].length;
  const cell = Math.min((WORLD_W - 40) / cols, (WORLD_H - 96) / rows);
  const originX = (WORLD_W - cell * cols) / 2;
  const originY = 74;

  /* 지원 수준은 걷는 속도·기회·제한 시간으로 나타난다. 미로와 함정은 같다. */
  const stepDelay = 0.16 / clamp(tuning.speed, 0.7, 1.4);
  const maxLives = tuning.lives;
  const seconds = Math.round(stage.seconds * tuning.time);

  const startPos = (() => {
    for (let r = 0; r < rows; r += 1) {
      const c = stage.map[r].indexOf('S');
      if (c >= 0) return { c, r };
    }
    return { c: 1, r: 1 };
  })();

  const worldRef = useRef<World>({
    c: startPos.c, r: startPos.r, lives: maxLives, picked: [], finished: false, hit: '', moveTimer: 0,
  });
  const takenRef = useRef<string[]>([]);
  const [hud, setHud] = useState({ lives: maxLives, picked: 0, hit: '' });
  const keys = useGameKeys(game.playing);
  const nudgeRef = useRef<{ c: number; r: number } | null>(null);

  useEffect(() => {
    worldRef.current = {
      c: startPos.c, r: startPos.r, lives: maxLives, picked: [], finished: false, hit: '', moveTimer: 0,
    };
    takenRef.current = [];
    setHud({ lives: maxLives, picked: 0, hit: '' });
    nudgeRef.current = null;
  }, [game.round, game.stageIndex, stage, maxLives, startPos.c, startPos.r]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    const w = worldRef.current;
    if (!w.finished) {
      w.finished = true;
      game.fail('시간이 지났어요. 함정을 피해 증거를 먼저 주워 봐요.');
    }
  });

  const at = (c: number, r: number) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return '#';
    return stage.map[r][c];
  };

  const tryMove = (dc: number, dr: number) => {
    const w = worldRef.current;
    if (w.finished) return;
    const nc = w.c + dc;
    const nr = w.r + dr;
    const tile = at(nc, nr);
    if (tile === '#') return;

    if (tile >= '1' && tile <= '9') {
      const index = Number(tile) - 1;
      w.hit = stage.traps[index % stage.traps.length];
      w.lives -= 1;
      playSound('select');
      // 함정을 밟으면 두 칸 뒤로 밀린다
      const backC = clamp(w.c - dc * 2, 1, cols - 2);
      const backR = clamp(w.r - dr * 2, 1, rows - 2);
      if (at(backC, backR) !== '#') { w.c = backC; w.r = backR; }
      if (w.lives <= 0) {
        w.finished = true;
        game.fail('요구 함정에 걸렸어요. 붉은 칸의 말을 읽고 돌아가는 길을 찾아 봐요.');
      }
      return;
    }

    w.c = nc;
    w.r = nr;

    if ((tile === 'a' || tile === 'b') && !takenRef.current.includes(tile)) {
      takenRef.current.push(tile);
      w.picked = [...takenRef.current];
      playSound('fill');
    }

    if (tile === 'E') {
      if (takenRef.current.length >= 2) {
        w.finished = true;
        game.succeed('요구 함정을 알아보고 피한 뒤, 증거를 모아 어른에게 알렸어요!');
      } else {
        w.hit = '증거 두 가지를 먼저 모아야 문이 열립니다.';
      }
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      w.moveTimer = Math.max(0, w.moveTimer - dt);
      if (w.moveTimer <= 0) {
        let moved = false;
        if (nudgeRef.current) {
          tryMove(nudgeRef.current.c, nudgeRef.current.r);
          nudgeRef.current = null;
          moved = true;
        } else if (keys.held.current.left) { tryMove(-1, 0); moved = true; }
        else if (keys.held.current.right) { tryMove(1, 0); moved = true; }
        else if (keys.held.current.up) { tryMove(0, -1); moved = true; }
        else if (keys.held.current.down) { tryMove(0, 1); moved = true; }
        if (moved) w.moveTimer = stepDelay;
      }
      if (w.lives !== hud.lives || w.picked.length !== hud.picked || w.hit !== hud.hit) {
        setHud({ lives: w.lives, picked: w.picked.length, hit: w.hit });
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    panel(ctx, 20, 12, WORLD_W - 40, 46, BOARD.overlay, PLAY.info, 12);
    centerText(
      ctx,
      w.hit || '붉은 칸은 요구 함정입니다. 증거 두 가지를 모아 출구로 가세요.',
      WORLD_W / 2, 35, 22, BOARD.ink,
    );

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const tile = at(c, r);
        const x = originX + c * cell;
        const y = originY + r * cell;
        if (tile === '#') {
          panel(ctx, x, y, cell, cell, '#0B1220', 'rgba(100, 116, 139, 0.5)', 4);
          continue;
        }
        panel(ctx, x, y, cell, cell, '#1E293B', 'rgba(100, 116, 139, 0.25)', 4);
        if (tile >= '1' && tile <= '9') {
          panel(ctx, x + 2, y + 2, cell - 4, cell - 4, '#7F1D1D', PLAY.hazard, 6);
          centerText(ctx, '⚠️', x + cell / 2, y + cell / 2, Math.min(26, cell * 0.6), BOARD.ink);
        } else if ((tile === 'a' || tile === 'b') && !takenRef.current.includes(tile)) {
          centerText(ctx, tile === 'a' ? '📸' : '📝', x + cell / 2, y + cell / 2, Math.min(26, cell * 0.62), BOARD.ink);
        } else if (tile === 'E') {
          const open = takenRef.current.length >= 2;
          panel(ctx, x + 2, y + 2, cell - 4, cell - 4, open ? '#065F46' : '#334155', open ? PLAY.goal : BOARD.line, 6);
          centerText(ctx, open ? '🚪' : '🔒', x + cell / 2, y + cell / 2, Math.min(26, cell * 0.6), BOARD.ink);
        }
      }
    }

    const hx = originX + w.c * cell + cell / 2;
    const hy = originY + w.r * cell + cell / 2;
    ctx.beginPath();
    ctx.arc(hx, hy, cell * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = PLAY.hero;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.stroke();
  };

  return (
    <MiniGameFrame
      badge="대화 미로"
      instruction="수상한 요구를 피해 증거 두 가지를 모은 뒤, 믿을 수 있는 어른이 계신 출구로 이동해 보세요."
      progress={{ label: '모은 증거', value: hud.picked, max: 2 }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => { nudgeRef.current = { c: 0, r: -1 }; }} emoji="⬆️" label="위" />
          <MiniGameButton onClick={() => { nudgeRef.current = { c: 0, r: 1 }; }} emoji="⬇️" label="아래" />
          <MiniGameButton onClick={() => { nudgeRef.current = { c: -1, r: 0 }; }} emoji="⬅️" label="왼쪽" />
          <MiniGameButton onClick={() => { nudgeRef.current = { c: 1, r: 0 }; }} emoji="➡️" label="오른쪽" />
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
              const w = worldRef.current;
              const hx = originX + w.c * cell + cell / 2;
              const hy = originY + w.r * cell + cell / 2;
              const dx = pointer.x - hx;
              const dy = pointer.y - hy;
              if (Math.abs(dx) > Math.abs(dy)) nudgeRef.current = { c: dx > 0 ? 1 : -1, r: 0 };
              else nudgeRef.current = { c: 0, r: dy > 0 ? 1 : -1 };
            }}
            ariaLabel={`대화 미로에서 요구 함정을 피하는 놀이. 모은 증거 ${hud.picked}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
