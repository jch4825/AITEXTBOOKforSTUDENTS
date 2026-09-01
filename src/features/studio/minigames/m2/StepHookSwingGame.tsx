import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, dist, panel, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l6 · 단계 재료 모으기 (팩맨 형식)
 *
 * 갈고리로 매달려 가는 놀이는 손맛은 좋았지만 너무 어려웠다. 여기서는 미로를 돌며
 * 재료를 모은다. 조작은 방향 하나뿐이라 배우기 쉽고, 바이러스를 피하는 긴장만 남는다.
 *
 * 다음 차례의 재료만 빛난다. 큰 부탁을 작은 단계로 나눠 **순서대로** 이어 간다는
 * 규칙이 조작에 그대로 들어 있다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  goal: string;
  steps: string[];
  /** '#' 벽, '.' 길, 'P' 시작, 'V' 바이러스 시작, 숫자는 재료 순서 */
  map: string[];
}

const STAGES: StageConfig[] = [
  {
    id: 'poster',
    label: '기본',
    spoken: '포스터 만들기를 단계대로 모아요.',
    goal: '포스터 만들기',
    steps: ['무엇을 만들지 정하기', '재료 목록 받기', '차례 만들기', '마무리 문장 받기'],
    map: [
      '###############',
      '#P....#....1..#',
      '#.###.#.###.#.#',
      '#...#...#.....#',
      '#.#.#####.###.#',
      '#2#....V....#3#',
      '#.#.#####.#.#.#',
      '#....#...4..#.#',
      '###############',
    ],
  },
  {
    id: 'video',
    label: '1단계',
    spoken: '영상 만들기를 단계대로 모아요.',
    goal: '영상 만들기',
    steps: ['주제 정하기', '장면 나누기', '대사 받기', '순서 맞추기', '확인하기'],
    map: [
      '###############',
      '#P...1#...2...#',
      '#.###.#.#.###.#',
      '#...#...#...#.#',
      '#.#.#####V#.#.#',
      '#3#.....#...#4#',
      '#.#####.#.###.#',
      '#....5......#.#',
      '###############',
    ],
  },
  {
    id: 'booth',
    label: '2단계',
    spoken: '부스 준비를 단계대로 모아요.',
    goal: '부스 준비',
    steps: ['자리 정하기', '물건 목록 받기', '값 정하기', '당번 짜기', '안내문 받기', '마지막 확인'],
    map: [
      '###############',
      '#P..1#..V..2..#',
      '#.##.#.###.##.#',
      '#..#...#.#..3.#',
      '#.##.###.###.##',
      '#4....#V#....5#',
      '#.####.#.####.#',
      '#....6...#....#',
      '###############',
    ],
  },
];

interface Ghost {
  c: number;
  r: number;
  dc: number;
  dr: number;
  timer: number;
}

interface World {
  c: number;
  r: number;
  dc: number;
  dr: number;
  wantC: number;
  wantR: number;
  timer: number;
  ghosts: Ghost[];
  taken: number;
  lives: number;
  hitCool: number;
  phase: 'ready' | 'play';
  finished: boolean;
}

export default function StepHookSwingGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const rows = stage.map.length;
  const cols = stage.map[0].length;
  const cell = Math.min((WORLD_W - 40) / cols, (WORLD_H - 110) / rows);
  const originX = (WORLD_W - cell * cols) / 2;
  const originY = 84;

  /* 지원 수준은 걷는 속도·바이러스 속도·기회로 나타난다. 미로와 단계는 같다. */
  const stepDelay = 0.17 / clamp(tuning.speed, 0.7, 1.35);
  const ghostDelay = 0.34 / clamp(tuning.speed, 0.6, 1.3);
  const maxLives = tuning.lives;

  const at = (c: number, r: number) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return '#';
    return stage.map[r][c];
  };
  const open = (c: number, r: number) => at(c, r) !== '#';

  const build = (): World => {
    let start = { c: 1, r: 1 };
    const ghosts: Ghost[] = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        if (at(c, r) === 'P') start = { c, r };
        if (at(c, r) === 'V') ghosts.push({ c, r, dc: 1, dr: 0, timer: 0 });
      }
    }
    return {
      c: start.c, r: start.r, dc: 0, dr: 0, wantC: 0, wantR: 0, timer: 0,
      ghosts, taken: 0, lives: maxLives, hitCool: 0, phase: 'ready', finished: false,
    };
  };

  const worldRef = useRef<World>(build());
  const [hud, setHud] = useState({ taken: 0, lives: maxLives });
  const keys = useGameKeys(game.playing);
  const nudgeRef = useRef<{ c: number; r: number } | null>(null);

  useEffect(() => {
    worldRef.current = build();
    setHud({ taken: 0, lives: maxLives });
    nudgeRef.current = null;
    // build는 stage와 maxLives만 읽는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.round, game.stageIndex, stage, maxLives]);

  const pelletAt = (c: number, r: number) => {
    const ch = at(c, r);
    if (ch < '1' || ch > '9') return -1;
    return Number(ch) - 1;
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      const nudge = nudgeRef.current;
      if (nudge) { w.wantC = nudge.c; w.wantR = nudge.r; nudgeRef.current = null; }
      if (keys.held.current.left) { w.wantC = -1; w.wantR = 0; }
      if (keys.held.current.right) { w.wantC = 1; w.wantR = 0; }
      if (keys.held.current.up) { w.wantC = 0; w.wantR = -1; }
      if (keys.held.current.down) { w.wantC = 0; w.wantR = 1; }

      if (w.phase === 'ready') {
        if (w.wantC !== 0 || w.wantR !== 0) w.phase = 'play';
      } else {
        w.hitCool = Math.max(0, w.hitCool - dt);
        w.timer += dt;
        if (w.timer >= stepDelay) {
          w.timer = 0;
          if ((w.wantC || w.wantR) && open(w.c + w.wantC, w.r + w.wantR)) {
            w.dc = w.wantC;
            w.dr = w.wantR;
          }
          if (open(w.c + w.dc, w.r + w.dr)) {
            w.c += w.dc;
            w.r += w.dr;
          }
          const pellet = pelletAt(w.c, w.r);
          if (pellet === w.taken) {
            w.taken += 1;
            playSound('fill');
            if (w.taken >= stage.steps.length) {
              w.finished = true;
              game.succeed(`${stage.goal}을 작은 단계로 나눠 순서대로 모두 모았어요!`);
            }
          }
        }

        for (const ghost of w.ghosts) {
          ghost.timer += dt;
          if (ghost.timer < ghostDelay) continue;
          ghost.timer = 0;
          const options = [[1, 0], [-1, 0], [0, 1], [0, -1]]
            .filter(([dc, dr]) => open(ghost.c + dc, ghost.r + dr))
            .filter(([dc, dr]) => !(dc === -ghost.dc && dr === -ghost.dr) || Math.random() < 0.2);
          if (options.length > 0) {
            // 학생 쪽으로 조금 기운다. 완전히 쫓아오면 이 학생들에게 너무 어렵다.
            options.sort((a, b) =>
              dist(ghost.c + a[0], ghost.r + a[1], w.c, w.r) - dist(ghost.c + b[0], ghost.r + b[1], w.c, w.r));
            const pick = Math.random() < 0.55 ? options[0] : options[Math.floor(Math.random() * options.length)];
            ghost.dc = pick[0];
            ghost.dr = pick[1];
          }
          if (open(ghost.c + ghost.dc, ghost.r + ghost.dr)) {
            ghost.c += ghost.dc;
            ghost.r += ghost.dr;
          }
        }

        if (w.hitCool <= 0 && w.ghosts.some((g) => g.c === w.c && g.r === w.r)) {
          w.lives -= 1;
          w.hitCool = 1.6;
          const start = build();
          w.c = start.c;
          w.r = start.r;
          w.dc = 0; w.dr = 0; w.wantC = 0; w.wantR = 0;
          playSound('select');
          if (w.lives <= 0) {
            w.finished = true;
            game.fail('바이러스에 닿았어요. 길목을 살펴 돌아가며 재료를 모아 봐요.');
          }
        }

        if (w.taken !== hud.taken || w.lives !== hud.lives) setHud({ taken: w.taken, lives: w.lives });
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    panel(ctx, 16, 14, WORLD_W - 32, 52, BOARD.overlay, PLAY.info, 12);
    const nextStep = stage.steps[Math.min(w.taken, stage.steps.length - 1)];
    centerText(ctx, `${stage.goal} · 다음 단계 ${w.taken + 1} · ${nextStep}`, WORLD_W / 2, 40, 22, BOARD.ink);

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = originX + c * cell;
        const y = originY + r * cell;
        if (at(c, r) === '#') {
          panel(ctx, x, y, cell, cell, '#1E293B', 'rgba(100,116,139,0.5)', 4);
          continue;
        }
        const pellet = pelletAt(c, r);
        if (pellet < 0 || pellet < w.taken) continue;
        const active = pellet === w.taken;
        ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, active ? cell * 0.3 : cell * 0.16, 0, Math.PI * 2);
        ctx.fillStyle = active ? PLAY.goal : 'rgba(148,163,184,0.45)';
        ctx.fill();
        if (active) {
          centerText(ctx, `${pellet + 1}`, x + cell / 2, y + cell / 2, Math.min(22, cell * 0.42), '#0F172A');
        }
      }
    }

    for (const ghost of w.ghosts) {
      const gx = originX + ghost.c * cell + cell / 2;
      const gy = originY + ghost.r * cell + cell / 2;
      ctx.beginPath();
      ctx.arc(gx, gy, cell * 0.34, 0, Math.PI * 2);
      ctx.fillStyle = PLAY.hazard;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = PLAY.hazardEdge;
      ctx.stroke();
      centerText(ctx, '🦠', gx, gy, Math.min(22, cell * 0.5), '#3B0A18');
    }

    const px = originX + w.c * cell + cell / 2;
    const py = originY + w.r * cell + cell / 2;
    ctx.globalAlpha = w.hitCool > 0 ? 0.45 : 1;
    ctx.beginPath();
    ctx.arc(px, py, cell * 0.36, 0, Math.PI * 2);
    ctx.fillStyle = PLAY.hero;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 240, WORLD_H - 46, 480, 40, BOARD.overlay, PLAY.hero, 10);
      centerText(ctx, '방향키를 누르면 움직입니다', WORLD_W / 2, WORLD_H - 26, 22, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="단계 재료 모으기"
      instruction="바이러스를 피해 미로를 돌며 빛나는 재료를 순서대로 모으세요. 방향키나 아래 버튼으로 움직입니다."
      progress={{ label: '모은 단계', value: hud.taken, max: stage.steps.length }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
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
        <div className="aspect-video max-h-full w-full max-w-[760px]">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase !== 'down') return;
              const w = worldRef.current;
              const px = originX + w.c * cell + cell / 2;
              const py = originY + w.r * cell + cell / 2;
              const dx = pointer.x - px;
              const dy = pointer.y - py;
              if (Math.abs(dx) > Math.abs(dy)) nudgeRef.current = { c: dx > 0 ? 1 : -1, r: 0 };
              else nudgeRef.current = { c: 0, r: dy > 0 ? 1 : -1 };
            }}
            ariaLabel={`바이러스를 피해 단계 재료를 모으는 놀이. 모은 단계 ${hud.taken}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
