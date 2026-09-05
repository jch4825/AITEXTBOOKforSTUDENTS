import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m5-l11 · 계획 바꿔 달리기 (장르 3 · 무한 달리기)
 *
 * "조건이 바뀌면 계획도 바꾼다"를 달리기로 만든다. 표지를 지나면 그다음 구간의
 * 장애물 종류가 통째로 바뀐다. 점프하던 자리가 슬라이드 자리가 된다.
 *
 * 계획대로만 달리면 반드시 부딪힌다. 화면 위 '지금 계획' 띠가 바뀌는 것을 읽고
 * 손을 바꿔야 지나간다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const GROUND = WORLD_H - 96;
const HERO_X = 190;

type Mode = 'jump' | 'slide';

interface Obstacle {
  x: number;
  /** 이 장애물을 넘기려면 필요한 조작 */
  need: Mode;
  passed: boolean;
}

interface Sign {
  x: number;
  text: string;
  next: Mode;
  passed: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  plan: string;
  obstacles: { x: number; need: Mode }[];
  signs: { x: number; text: string; next: Mode }[];
  goalX: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'walk',
    label: '기본',
    spoken: '길이 바뀌면 계획도 바꿔요.',
    plan: '낮은 담 → 뛰어넘기',
    goalX: 3200,
    obstacles: [
      { x: 700, need: 'jump' }, { x: 1100, need: 'jump' },
      { x: 1750, need: 'slide' }, { x: 2150, need: 'slide' },
      { x: 2750, need: 'jump' },
    ],
    signs: [
      { x: 1450, text: '길이 막혀 낮은 굴로 갑니다', next: 'slide' },
      { x: 2450, text: '굴이 끝나고 담이 나옵니다', next: 'jump' },
    ],
  },
  {
    id: 'tool',
    label: '1단계',
    spoken: '도구가 없으면 계획도 바꿔요.',
    plan: '상자 → 뛰어넘기',
    goalX: 3600,
    obstacles: [
      { x: 640, need: 'jump' }, { x: 1000, need: 'jump' },
      { x: 1600, need: 'slide' }, { x: 1950, need: 'slide' },
      { x: 2550, need: 'jump' }, { x: 2900, need: 'jump' },
      { x: 3250, need: 'slide' },
    ],
    signs: [
      { x: 1320, text: '발판이 없어 낮게 지나갑니다', next: 'slide' },
      { x: 2280, text: '발판을 찾았습니다', next: 'jump' },
      { x: 3050, text: '천장이 낮아집니다', next: 'slide' },
    ],
  },
  {
    id: 'rain',
    label: '2단계',
    spoken: '비가 오면 계획도 바꿔요.',
    plan: '웅덩이 → 뛰어넘기',
    goalX: 4000,
    obstacles: [
      { x: 620, need: 'jump' }, { x: 940, need: 'jump' },
      { x: 1480, need: 'slide' }, { x: 1800, need: 'slide' },
      { x: 2360, need: 'jump' }, { x: 2680, need: 'jump' },
      { x: 3200, need: 'slide' }, { x: 3520, need: 'slide' },
    ],
    signs: [
      { x: 1220, text: '비가 와서 미끄럽습니다', next: 'slide' },
      { x: 2100, text: '비가 그쳤습니다', next: 'jump' },
      { x: 2950, text: '바람이 세게 붑니다', next: 'slide' },
    ],
  },
];

interface World {
  x: number;
  y: number;
  vy: number;
  sliding: number;
  mode: Mode;
  plan: string;
  obstacles: Obstacle[];
  signs: Sign[];
  lives: number;
  passedSigns: number;
  phase: 'ready' | 'run';
  armed: boolean;
  finished: boolean;
  stun: number;
}

export default function PlanChangeRunGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 달리는 속도·장애물 크기·기회로 나타난다. 표지와 코스는 같다. */
  const runSpeed = 235 * clamp(tuning.speed, 0.62, 1.32);
  const obstacleScale = clamp(2 - tuning.size, 0.78, 1.25);
  const maxLives = tuning.lives;

  const build = (): World => ({
    x: 0, y: GROUND, vy: 0, sliding: 0, mode: 'jump', plan: stage.plan,
    obstacles: stage.obstacles.map((o) => ({ ...o, passed: false })),
    signs: stage.signs.map((s) => ({ ...s, passed: false })),
    lives: maxLives, passedSigns: 0, phase: 'ready', armed: true, finished: false, stun: 0,
  });

  const worldRef = useRef<World>(build());
  const [hud, setHud] = useState({ lives: maxLives, signs: 0, plan: stage.plan, progress: 0 });
  const keys = useGameKeys(game.playing);
  const jumpRef = useRef(false);
  const slideRef = useRef(false);

  useEffect(() => {
    worldRef.current = build();
    setHud({ lives: maxLives, signs: 0, plan: stage.plan, progress: 0 });
    jumpRef.current = false;
    slideRef.current = false;
  }, [game.round, game.stageIndex, stage, maxLives]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    const wantJump = keys.held.current.up || keys.held.current.action || jumpRef.current;
    const wantSlide = keys.held.current.down || slideRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      if (w.phase === 'ready') {
        if (!wantJump && !wantSlide) w.armed = true;
        if ((wantJump || wantSlide) && w.armed) { w.phase = 'run'; w.armed = false; }
      } else {
        w.x += runSpeed * dt;
        w.stun = Math.max(0, w.stun - dt);

        if (wantJump && w.y >= GROUND - 0.5 && w.sliding <= 0) {
          w.vy = -620;
          playSound('select');
        }
        if (wantSlide && w.y >= GROUND - 0.5) w.sliding = 0.55;
        w.sliding = Math.max(0, w.sliding - dt);

        w.vy += 1500 * dt;
        w.y = Math.min(GROUND, w.y + w.vy * dt);
        if (w.y >= GROUND) { w.y = GROUND; w.vy = 0; }

        for (const sign of w.signs) {
          if (sign.passed || w.x < sign.x) continue;
          sign.passed = true;
          w.mode = sign.next;
          w.plan = sign.next === 'jump' ? '담 → 뛰어넘기' : '낮은 굴 → 낮게 지나가기';
          w.passedSigns += 1;
          playSound('confirm');
        }

        for (const obstacle of w.obstacles) {
          if (obstacle.passed) continue;
          if (Math.abs(w.x - obstacle.x) > 34 * obstacleScale) continue;
          const jumped = w.y < GROUND - 40;
          const slid = w.sliding > 0;
          const ok = obstacle.need === 'jump' ? jumped : slid;
          obstacle.passed = true;
          if (!ok && w.stun <= 0) {
            w.lives -= 1;
            w.stun = 1;
            w.x = Math.max(0, w.x - 150);
          }
        }

        const progress = Math.round(clamp((w.x / stage.goalX) * 100, 0, 100));
        if (w.lives !== hud.lives || w.passedSigns !== hud.signs
          || w.plan !== hud.plan || progress !== hud.progress) {
          setHud({ lives: w.lives, signs: w.passedSigns, plan: w.plan, progress });
        }

        if (w.lives <= 0) {
          w.finished = true;
          game.fail('부딪혔어요. 표지가 지나가면 지금 계획이 바뀝니다. 띠를 보고 손을 바꿔 봐요.');
        } else if (w.x >= stage.goalX) {
          w.finished = true;
          game.succeed('조건이 바뀔 때마다 계획을 고쳐 결승선까지 갔어요!');
        }
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    const camera = w.x - HERO_X;
    ctx.save();
    ctx.translate(-camera, 0);

    ctx.fillStyle = '#1E293B';
    ctx.fillRect(camera - 40, GROUND + 22, WORLD_W + 120, WORLD_H);
    ctx.strokeStyle = BOARD.line;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(camera - 40, GROUND + 22);
    ctx.lineTo(camera + WORLD_W + 80, GROUND + 22);
    ctx.stroke();

    for (const sign of w.signs) {
      if (sign.x - camera < -140 || sign.x - camera > WORLD_W + 140) continue;
      panel(ctx, sign.x - 150, GROUND - 232, 300, 58, sign.passed ? '#064E3B' : '#4C1D95',
        sign.passed ? PLAY.goal : PLAY.extra, 12);
      centerText(ctx, sign.text, sign.x, GROUND - 203, 21, BOARD.ink);
      ctx.strokeStyle = sign.passed ? PLAY.goal : PLAY.extra;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(sign.x, GROUND - 174);
      ctx.lineTo(sign.x, GROUND + 20);
      ctx.stroke();
    }

    for (const obstacle of w.obstacles) {
      if (obstacle.x - camera < -100 || obstacle.x - camera > WORLD_W + 100) continue;
      const width = 56 * obstacleScale;
      if (obstacle.need === 'jump') {
        panel(ctx, obstacle.x - width / 2, GROUND - 64, width, 86, '#7F1D1D', PLAY.hazard, 8);
        centerText(ctx, '담', obstacle.x, GROUND - 22, 20, BOARD.ink);
      } else {
        panel(ctx, obstacle.x - width / 2, GROUND - 210, width, 120, '#7F1D1D', PLAY.hazard, 8);
        centerText(ctx, '굴', obstacle.x, GROUND - 150, 20, BOARD.ink);
      }
    }

    panel(ctx, stage.goalX - 20, GROUND - 180, 130, 202, '#064E3B', PLAY.goal, 12);
    centerText(ctx, '결승선', stage.goalX + 45, GROUND - 80, 24, BOARD.ink);

    const bodyH = w.sliding > 0 ? 26 : 52;
    ctx.globalAlpha = w.stun > 0 ? 0.5 : 1;
    panel(ctx, w.x - 20, w.y - bodyH, 40, bodyH, PLAY.hero, PLAY.heroEdge, 10);
    ctx.globalAlpha = 1;
    ctx.restore();

    panel(ctx, 20, 12, WORLD_W - 40, 46, BOARD.overlay, PLAY.info, 12);
    centerText(ctx, `지금 계획 · ${w.plan}`, WORLD_W / 2, 35, 24, BOARD.ink);

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 240, WORLD_H - 92, 480, 58, BOARD.overlay, PLAY.hero, 14);
      centerText(ctx, w.armed ? '스페이스를 누르면 출발합니다' : '손을 떼었다가 다시 누르세요',
        WORLD_W / 2, WORLD_H - 63, 24, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="계획 바꿔 달리기"
      instruction="스페이스 키를 눌러 뛰거나 아래 방향키로 웅크려 장애물을 피하세요. 표지판을 지나면 계획이 바뀌니 위의 안내를 잘 살펴보세요."
      progress={{ label: '나아간 길', value: hud.progress, max: 100 }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} score={hud.signs} scoreLabel="지난 표지" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton
            onClick={() => { jumpRef.current = true; window.setTimeout(() => { jumpRef.current = false; }, 150); }}
            emoji="⬆️" label="뛰기"
          />
          <MiniGameButton
            onClick={() => { slideRef.current = true; window.setTimeout(() => { slideRef.current = false; }, 260); }}
            emoji="⬇️" label="낮게"
          />
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 달리기" variant="primary" />
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
              if (pointer.phase === 'up') { jumpRef.current = false; slideRef.current = false; return; }
              if (pointer.y < WORLD_H / 2) jumpRef.current = true;
              else slideRef.current = true;
            }}
            ariaLabel={`조건이 바뀌는 길을 달리는 놀이. 나아간 길 ${hud.progress}퍼센트, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
