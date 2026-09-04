import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel, useGameKeys,
} from '../engine';
import type { MiniGameProps } from '../types';

/**
 * m3-l4 · 낱말 세기 비행 (장르 8 · 비행/플래피)
 *
 * 낱말의 세기를 고르는 일을 "고도를 맞추는 일"로 만든다. 장면마다 열린 틈의 높이가
 * 다르고, 그 높이가 그 장면에 어울리는 말의 세기다. 살짝 부딪힌 장면에서 아주 센 말을
 * 고르면 위쪽 벽에 부딪힌다.
 *
 * 조작은 하나뿐이다 — 누르면 오른다, 놓으면 내린다. 조작이 하나라서 학생은 규칙이 아니라
 * "어느 높이로 가야 하나"만 생각한다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const HERO_X = 250;

/** 위에서 아래로 3단계. 인덱스가 곧 세기이며 틈의 중심 높이가 된다. */
const STRENGTH_BANDS = ['아주 세게', '보통', '살짝'];
const BAND_Y = [150, 270, 400];

interface Scene {
  text: string;
  band: number;
}

interface StageConfig {
  id: string;
  label: string;
  title: string;
  word: string;
  scenes: Scene[];
}

const STAGES: StageConfig[] = [
  {
    id: 'hurt',
    label: '기본',
    title: '아프다',
    word: '아프다',
    scenes: [
      { text: '책상에 살짝 쓸렸어요', band: 2 },
      { text: '무릎이 까져 피가 나요', band: 1 },
      { text: '넘어져서 걷지 못해요', band: 0 },
      { text: '손톱이 조금 눌렸어요', band: 2 },
      { text: '배가 계속 심하게 아파요', band: 0 },
    ],
  },
  {
    id: 'happy',
    label: '1단계',
    title: '좋다',
    word: '좋다',
    scenes: [
      { text: '급식에 좋아하는 반찬이 나왔어요', band: 1 },
      { text: '연필 색이 마음에 들어요', band: 2 },
      { text: '오래 기다린 소풍 날이에요', band: 0 },
      { text: '친구가 자리를 비켜 줬어요', band: 1 },
      { text: '가고 싶던 반에 배정됐어요', band: 0 },
    ],
  },
  {
    id: 'busy',
    label: '2단계',
    title: '바쁘다',
    word: '바쁘다',
    scenes: [
      { text: '숙제가 한 장 남았어요', band: 2 },
      { text: '내일까지 발표를 준비해요', band: 1 },
      { text: '오늘 안에 세 가지를 끝내야 해요', band: 0 },
      { text: '가방만 챙기면 돼요', band: 2 },
      { text: '수업과 청소가 겹쳤어요', band: 1 },
    ],
  },
];

interface Pillar {
  x: number;
  band: number;
  text: string;
  passed: boolean;
}

interface World {
  y: number;
  vy: number;
  pillars: Pillar[];
  cleared: number;
  lives: number;
  shake: number;
  finished: boolean;
  /** ready면 눌러서 시작하기를 기다린다. 준비도 안 된 채로 떨어지지 않게 한다. */
  phase: 'ready' | 'flying';
  bob: number;
  /** 손을 뗐다가 다시 눌러야 출발한다. 누른 채로 부딪히면 곧바로 또 떨어지기 때문이다. */
  armed: boolean;
}

function buildWorld(stage: StageConfig, lives: number, gapSpacing: number): World {
  return {
    y: WORLD_H / 2,
    vy: 0,
    pillars: stage.scenes.map((scene, index) => ({
      x: 900 + index * gapSpacing,
      band: scene.band,
      text: scene.text,
      passed: false,
    })),
    cleared: 0,
    lives,
    shake: 0,
    finished: false,
    phase: 'ready',
    bob: 0,
    armed: false,
  };
}

export default function WordStrengthFlyGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const gapHalf = 92 * tuning.size;
  const heroR = 24 * Math.min(1.15, tuning.size);
  const scrollSpeed = 175 * tuning.speed;
  const gapSpacing = 470 / Math.max(0.75, tuning.density);
  /* 낙하는 발달장애 학생이 반응할 수 있을 만큼 느려야 한다. 흔한 플래피 감각(1초 안에 바닥)은
     "무슨 일이 일어났는지" 보이기도 전에 끝난다. 화면 높이를 내려오는 데 1.5초 넘게 걸리도록
     중력과 최고 속도를 낮추고, 지원 수준에 따라 다시 한 번 느려지게 한다. */
  const gravity = 330 * tuning.speed;
  const liftAccel = -640 * tuning.speed;
  const vyMax = 265 * tuning.speed;

  const worldRef = useRef<World>(buildWorld(stage, tuning.lives, gapSpacing));
  const [hud, setHud] = useState({ cleared: 0, lives: tuning.lives });
  const keys = useGameKeys(game.playing);
  const liftRef = useRef(false);

  useEffect(() => {
    worldRef.current = buildWorld(stage, tuning.lives, gapSpacing);
    setHud({ cleared: 0, lives: tuning.lives });
    liftRef.current = false;
  }, [game.round, game.stageIndex, stage, tuning.lives, gapSpacing]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;

    const lifting = liftRef.current || keys.held.current.up || keys.held.current.action;

    if (dt > 0 && !world.finished && world.phase === 'ready') {
      // 준비 자세 — 가운데에서 천천히 오르내리며 학생이 누를 때까지 기다린다.
      world.bob += dt * 2.4;
      world.y = WORLD_H / 2 + Math.sin(world.bob) * 14;
      world.shake = Math.max(0, world.shake - dt * 1.4);
      if (!lifting) world.armed = true;
      if (lifting && world.armed && world.shake <= 0) {
        world.phase = 'flying';
        world.armed = false;
        world.vy = -0.7 * vyMax;
      }
    } else if (dt > 0 && !world.finished) {
      world.vy += (lifting ? liftAccel : gravity) * dt;
      world.vy = clamp(world.vy, -vyMax, vyMax);
      world.y += world.vy * dt;

      let bumped = false;
      if (world.y < heroR + 6) {
        world.y = heroR + 6;
        world.vy = 0;
        bumped = true;
      }
      if (world.y > WORLD_H - heroR - 6) {
        world.y = WORLD_H - heroR - 6;
        world.vy = 0;
        bumped = true;
      }

      for (const pillar of world.pillars) {
        pillar.x -= scrollSpeed * dt;
        const gapCenter = BAND_Y[pillar.band];
        const overlapX = Math.abs(pillar.x - HERO_X) < 46 + heroR;
        if (overlapX && Math.abs(world.y - gapCenter) > gapHalf - heroR) bumped = true;
        if (!pillar.passed && pillar.x < HERO_X - 46 - heroR) {
          pillar.passed = true;
          world.cleared += 1;
        }
      }

      if (bumped) {
        world.lives -= 1;
        // 부딪히면 준비 자세로 돌아가고, 다가오던 장면을 뒤로 물려 다시 높이를 맞추게 한다.
        world.phase = 'ready';
        world.shake = 0.7;
        world.bob = 0;
        world.vy = 0;
        world.armed = false;
        for (const pillar of world.pillars) {
          if (!pillar.passed) pillar.x = Math.max(pillar.x, HERO_X + 420);
        }
      }

      if (world.cleared !== hud.cleared || world.lives !== hud.lives) {
        setHud({ cleared: world.cleared, lives: world.lives });
      }

      if (world.lives <= 0) {
        world.finished = true;
        game.fail('벽에 닿았어요. 장면을 보고 말의 세기를 다시 골라 날아가요.');
      } else if (world.cleared >= world.pillars.length) {
        world.finished = true;
        game.succeed(`장면마다 어울리는 ${stage.word}의 세기를 골라 모두 지나갔어요!`);
      }
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    for (let band = 0; band < 3; band += 1) {
      const y = BAND_Y[band];
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 12]);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(WORLD_W, y);
      ctx.stroke();
      ctx.setLineDash([]);
      panel(ctx, 10, y - 20, 132, 40, BOARD.overlay, BOARD.line, 10);
      centerText(ctx, STRENGTH_BANDS[band], 76, y, 22, BOARD.inkDim);
    }

    for (const pillar of world.pillars) {
      if (pillar.x < -140 || pillar.x > WORLD_W + 200) continue;
      const gapCenter = BAND_Y[pillar.band];
      const done = pillar.passed;
      const fill = done ? '#14532D' : PLAY.hazardEdge;
      const edge = done ? PLAY.goal : PLAY.hazard;
      panel(ctx, pillar.x - 46, -20, 92, gapCenter - gapHalf + 20, fill, edge, 10);
      panel(ctx, pillar.x - 46, gapCenter + gapHalf, 92, WORLD_H - gapCenter - gapHalf + 20, fill, edge, 10);
      // 틈 자리에 화살표만 둔다. 장면 글은 위쪽 띠에 한 번만 크게 적는다.
      centerText(ctx, done ? '✓' : '▶', pillar.x, gapCenter, 30, done ? PLAY.goal : PLAY.hero);
    }

    // 다가오는 장면 — 학생이 읽고 높이를 정하는 유일한 글이다.
    const next = world.pillars.find((pillar) => !pillar.passed);
    if (next) {
      panel(ctx, WORLD_W / 2 - 330, 12, 660, 56, BOARD.overlay, PLAY.info, 14);
      centerText(ctx, next.text, WORLD_W / 2, 40, 28, BOARD.ink);
    }

    if (world.phase === 'ready' && !world.finished) {
      panel(ctx, WORLD_W / 2 - 210, WORLD_H - 96, 420, 62, BOARD.overlay, PLAY.hero, 16);
      centerText(
        ctx,
        world.armed
          ? (world.lives < tuning.lives ? '누르면 다시 출발합니다' : '누르면 출발합니다')
          : '손을 떼었다가 다시 누르세요',
        WORLD_W / 2, WORLD_H - 65, 26, BOARD.ink,
      );
    }

    const shakeX = world.shake > 0 ? Math.sin(world.shake * 42) * 8 : 0;
    ctx.save();
    ctx.translate(HERO_X + shakeX, world.y);
    ctx.rotate(clamp(world.vy / (vyMax * 2.2), -0.5, 0.6));
    ctx.fillStyle = PLAY.hero;
    ctx.beginPath();
    ctx.arc(0, 0, heroR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.lineWidth = 4;
    ctx.stroke();
    centerText(ctx, stage.word, 0, 1, 20, '#3B2100');
    ctx.restore();
  };

  return (
    <MiniGameFrame
      badge="낱말 세기 비행"
      instruction={`장면에 어울리는 '${stage.word}'의 세기 높이로 날아 틈을 지나가세요. 화면을 누르거나 스페이스를 누르면 올라가고, 놓으면 내려갑니다.`}
      progress={{ label: '지나간 장면', value: hud.cleared, max: stage.scenes.length }}
      hud={<GameHud lives={hud.lives} maxLives={tuning.lives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].title} 낱말로 바꿨어요.`)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 날기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') liftRef.current = true;
              if (pointer.phase === 'up') liftRef.current = false;
            }}
            ariaLabel={`${stage.word} 낱말의 세기를 골라 장면 사이를 날아가는 놀이. 남은 기회 ${hud.lives}개, 지나간 장면 ${hud.cleared}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
