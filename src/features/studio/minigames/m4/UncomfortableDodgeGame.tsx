import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, circleHit, clamp, createRandom, dist, panel,
  pick, randRange, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m4-l6 · 불편한 화면 피하기 (장르 24 · 탄막 피하기)
 *
 * "불편한 화면을 만나면 거리를 두고 믿을 만한 사람에게 알린다"를 몸으로 만든다.
 * 조각은 느리고 크며 피할 길이 늘 있다. 맞서 없애는 것이 아니라 닿지 않는 것이 규칙이다.
 *
 * 한 파도를 넘기려면 안전지대에 3초 머물러야 한다. 안전지대는 파도마다 자리를 옮긴다 —
 * 어른에게 알리는 일이 한 번으로 끝나지 않음을 조작으로 남긴다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  text: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  signals: string[];
  waves: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'scary',
    label: '기본',
    spoken: '무서운 화면에서 거리를 두어요.',
    waves: 3,
    signals: ['무서운 그림', '큰 소리', '갑자기 뜬 창'],
  },
  {
    id: 'mean',
    label: '1단계',
    spoken: '놀리는 말에서 거리를 두어요.',
    waves: 3,
    signals: ['놀리는 말', '욕이 섞인 글', '괴롭히는 사진', '이상한 별명'],
  },
  {
    id: 'ask',
    label: '2단계',
    spoken: '이상한 요구에서 거리를 두어요.',
    waves: 3,
    signals: ['이상한 요구', '비밀로 하라는 말', '만나자는 말', '돈을 달라는 말', '사진을 보내라는 말'],
  },
];

interface World {
  x: number;
  y: number;
  shards: Shard[];
  wave: number;
  safeX: number;
  safeY: number;
  hold: number;
  lives: number;
  timer: number;
  phase: 'ready' | 'dodge';
  finished: boolean;
  named: string[];
}

const HOLD_NEED = 3;

export default function UncomfortableDodgeGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 조각의 속도·수·내 몸 크기로 나타난다. 파도 수와 신호는 같다. */
  const shardSpeed = 78 * clamp(tuning.speed, 0.6, 1.35);
  const shardCount = clamp(Math.round(4 * tuning.density), 2, 8);
  const heroR = 20 * clamp(tuning.size, 0.85, 1.3);
  const safeR = 74 * clamp(tuning.size, 0.9, 1.25);
  const maxLives = tuning.lives;

  const worldRef = useRef<World>({
    x: WORLD_W / 2, y: WORLD_H / 2, shards: [], wave: 0, safeX: 140, safeY: 140,
    hold: 0, lives: maxLives, timer: 0, phase: 'ready', finished: false, named: [],
  });
  const randomRef = useRef(createRandom(game.seed));
  const [hud, setHud] = useState({ wave: 0, lives: maxLives, hold: 0, named: [] as string[] });
  const keys = useGameKeys(game.playing);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const spawnWave = (w: World) => {
    const random = randomRef.current;
    w.shards = Array.from({ length: shardCount + w.wave }, () => {
      const side = Math.floor(random() * 4);
      const along = randRange(random, 60, side % 2 === 0 ? WORLD_W - 60 : WORLD_H - 60);
      const x = side === 0 ? along : side === 1 ? WORLD_W + 60 : side === 2 ? along : -60;
      const y = side === 0 ? -60 : side === 1 ? along : side === 2 ? WORLD_H + 60 : along;
      const tx = randRange(random, 200, WORLD_W - 200);
      const ty = randRange(random, 140, WORLD_H - 140);
      const d = Math.max(1, dist(x, y, tx, ty));
      return {
        x, y,
        vx: ((tx - x) / d) * shardSpeed,
        vy: ((ty - y) / d) * shardSpeed,
        r: randRange(random, 42, 58),
        text: pick(random, stage.signals),
      };
    });
    w.safeX = randRange(random, 140, WORLD_W - 140);
    w.safeY = randRange(random, 120, WORLD_H - 120);
    w.hold = 0;
  };

  useEffect(() => {
    randomRef.current = createRandom(game.seed);
    const w: World = {
      x: WORLD_W / 2, y: WORLD_H / 2, shards: [], wave: 0, safeX: 160, safeY: 150,
      hold: 0, lives: maxLives, timer: 0, phase: 'ready', finished: false, named: [],
    };
    spawnWave(w);
    worldRef.current = w;
    setHud({ wave: 0, lives: maxLives, hold: 0, named: [] });
    dragRef.current = null;
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      const moving = keys.held.current.left || keys.held.current.right
        || keys.held.current.up || keys.held.current.down || dragRef.current !== null;
      if (w.phase === 'ready') {
        if (moving) w.phase = 'dodge';
      } else {
        if (dragRef.current) {
          w.x += (dragRef.current.x - w.x) * Math.min(1, dt * 9);
          w.y += (dragRef.current.y - w.y) * Math.min(1, dt * 9);
        } else {
          const dx = (keys.held.current.left ? -1 : 0) + (keys.held.current.right ? 1 : 0);
          const dy = (keys.held.current.up ? -1 : 0) + (keys.held.current.down ? 1 : 0);
          w.x += dx * 300 * dt;
          w.y += dy * 300 * dt;
        }
        w.x = clamp(w.x, heroR, WORLD_W - heroR);
        w.y = clamp(w.y, heroR, WORLD_H - heroR);

        for (const shard of w.shards) {
          shard.x += shard.vx * dt;
          shard.y += shard.vy * dt;
          if (shard.x < -120) shard.x = WORLD_W + 100;
          if (shard.x > WORLD_W + 120) shard.x = -100;
          if (shard.y < -120) shard.y = WORLD_H + 100;
          if (shard.y > WORLD_H + 120) shard.y = -100;
          if (w.timer <= 0 && circleHit(w.x, w.y, heroR, shard.x, shard.y, shard.r * 0.72)) {
            w.lives -= 1;
            w.timer = 1.4;
            playSound('select');
          }
        }
        w.timer = Math.max(0, w.timer - dt);

        if (dist(w.x, w.y, w.safeX, w.safeY) < safeR) {
          w.hold += dt;
          if (w.hold >= HOLD_NEED) {
            const named = w.shards[0]?.text ?? stage.signals[0];
            if (!w.named.includes(named)) w.named.push(named);
            w.wave += 1;
            playSound('stamp');
            if (w.wave >= stage.waves) {
              w.finished = true;
              game.succeed('불편한 화면과 거리를 두고 믿을 만한 어른에게 알렸어요. 위험 신호에 이름도 붙였습니다.');
            } else {
              spawnWave(w);
              w.phase = 'ready';
            }
          }
        } else {
          w.hold = Math.max(0, w.hold - dt * 0.7);
        }

        if (w.lives <= 0 && !w.finished) {
          w.finished = true;
          game.fail('불편한 화면에 닿았어요. 멀리 돌아 안전지대로 가 봐요.');
        }
      }

      if (w.wave !== hud.wave || w.lives !== hud.lives
        || Math.abs(w.hold - hud.hold) > 0.12 || w.named.length !== hud.named.length) {
        setHud({ wave: w.wave, lives: w.lives, hold: w.hold, named: [...w.named] });
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 안전지대
    ctx.beginPath();
    ctx.arc(w.safeX, w.safeY, safeR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 222, 128, 0.14)';
    ctx.fill();
    ctx.strokeStyle = PLAY.goal;
    ctx.lineWidth = 4;
    ctx.stroke();
    centerText(ctx, '믿을 만한 어른', w.safeX, w.safeY - 12, 22, PLAY.goal);
    centerText(ctx, `${Math.max(0, HOLD_NEED - w.hold).toFixed(1)}초`, w.safeX, w.safeY + 16, 22, BOARD.ink);

    for (const shard of w.shards) {
      ctx.beginPath();
      ctx.arc(shard.x, shard.y, shard.r, 0, Math.PI * 2);
      ctx.fillStyle = '#3F1D2B';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = PLAY.hazard;
      ctx.stroke();
      centerText(ctx, '🚫', shard.x, shard.y - 10, 24, BOARD.ink);
      centerText(ctx, shard.text, shard.x, shard.y + 16, 20, BOARD.ink);
    }

    ctx.globalAlpha = w.timer > 0 ? 0.45 : 1;
    ctx.beginPath();
    ctx.arc(w.x, w.y, heroR, 0, Math.PI * 2);
    ctx.fillStyle = PLAY.hero;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 250, WORLD_H - 88, 500, 56, BOARD.overlay, PLAY.hero, 14);
      centerText(ctx, '방향키나 끌기로 움직이면 시작합니다', WORLD_W / 2, WORLD_H - 60, 24, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="불편한 화면 피하기"
      instruction="붉은 화면에 닿지 말고 초록 안전지대로 가서 3초 머무르세요. 파도마다 안전지대 자리가 바뀝니다."
      progress={{ label: '넘긴 파도', value: hud.wave, max: stage.waves }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} timeLeft={Math.max(0, HOLD_NEED - hud.hold)} timeTotal={HOLD_NEED} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="game-canvas-fit">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                if (pointer.phase === 'up') { dragRef.current = null; return; }
                dragRef.current = { x: pointer.x, y: pointer.y };
              }}
              ariaLabel={`불편한 화면을 피해 안전지대로 가는 놀이. 넘긴 파도 ${hud.wave}개, 남은 기회 ${hud.lives}개.`}
            />
          </div>
        </div>
        <p
          className="min-h-[38px] rounded-xl px-3 py-1.5 text-[15px] font-bold"
          style={{ background: 'var(--board-surface)', border: '2px solid #4ADE80', color: 'var(--board-ink)' }}
        >
          {hud.named.length > 0
            ? `어른에게 알린 위험 신호 · ${hud.named.join(' / ')}`
            : '안전지대에 머무르면 만난 위험 신호에 이름을 붙여 기록합니다.'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
