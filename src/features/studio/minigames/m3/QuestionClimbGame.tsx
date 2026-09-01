import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, pick, randRange,
  useGameKeys,
} from '../engine';
import type { MiniGameProps } from '../types';

/**
 * m3-l1 · 질문 발판 오르기 (장르 2 · 수직 상승 플랫포머)
 *
 * "같은 주제를 더 나은 질문으로 바꿔 묻는다"를 발판의 단단함으로 만든다.
 * 얕은 질문은 밟는 순간 바스러져 아래로 떨어지고, 깊은 질문만 몸을 위로 올려 준다.
 *
 * 학생은 좌우로만 움직이고 점프는 자동이다. 조작이 하나라 규칙이 아니라
 * "어느 발판을 밟을까"에만 집중하게 된다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const HERO_R = 22;

interface Plank {
  x: number;
  y: number;
  w: number;
  deep: boolean;
  text: string;
  broken: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  topic: string;
  spoken: string;
  deep: string[];
  shallow: string[];
  goalHeight: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'plant',
    label: '기본',
    topic: '식물 기르기',
    spoken: '식물 기르기를 더 깊게 물어 봐요.',
    goalHeight: 1500,
    deep: ['왜 잎이 노래질까요', '물은 며칠에 한 번', '햇빛은 얼마나'],
    shallow: ['응?', '그거 뭐예요', '아무거나'],
  },
  {
    id: 'recycle',
    label: '1단계',
    topic: '분리배출',
    spoken: '분리배출을 더 깊게 물어 봐요.',
    goalHeight: 2000,
    deep: ['왜 씻어서 버릴까요', '어디에 넣어야 하나요', '뚜껑은 따로 버리나요'],
    shallow: ['몰라요', '그냥요', '대충 알려 줘요'],
  },
  {
    id: 'safety',
    label: '2단계',
    topic: '자전거 안전',
    spoken: '자전거 안전을 더 깊게 물어 봐요.',
    goalHeight: 2500,
    deep: ['왜 안전모를 쓰나요', '밤에는 무엇이 필요한가요', '어디로 다녀야 하나요'],
    shallow: ['그거요', '아무 데나', '빨리요'],
  },
];

interface World {
  x: number;
  y: number;
  vy: number;
  height: number;
  planks: Plank[];
  lives: number;
  phase: 'ready' | 'climb';
  armed: boolean;
  finished: boolean;
  current: string;
}

function makePlanks(stage: StageConfig, seed: number, width: number, shallowRate: number): Plank[] {
  const random = createRandom(seed);
  const planks: Plank[] = [];
  for (let i = 0; i < 90; i += 1) {
    const deep = i < 2 ? true : random() > shallowRate;
    planks.push({
      x: randRange(random, 60, WORLD_W - 60 - width),
      y: WORLD_H - 80 - i * 95,
      w: width,
      deep,
      text: deep ? pick(random, stage.deep) : pick(random, stage.shallow),
      broken: false,
    });
  }
  return planks;
}

export default function QuestionClimbGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 발판 폭·얕은 질문의 비율·중력으로 나타난다. 오르는 방법은 같다. */
  const plankW = 190 * clamp(tuning.size, 0.78, 1.3);
  const shallowRate = clamp(0.34 * tuning.density, 0.16, 0.55);
  const gravity = 900 * clamp(tuning.speed, 0.7, 1.3);
  const jumpV = -520 * clamp(tuning.speed, 0.78, 1.2);
  const maxLives = tuning.lives;

  const worldRef = useRef<World>({
    x: WORLD_W / 2, y: WORLD_H - 120, vy: 0, height: 0,
    planks: makePlanks(stage, game.seed, plankW, shallowRate),
    lives: maxLives, phase: 'ready', armed: true, finished: false, current: '',
  });
  const [hud, setHud] = useState({ height: 0, lives: maxLives, current: '' });
  const keys = useGameKeys(game.playing);
  const moveRef = useRef(0);

  useEffect(() => {
    worldRef.current = {
      x: WORLD_W / 2, y: WORLD_H - 120, vy: 0, height: 0,
      planks: makePlanks(stage, game.seed, plankW, shallowRate),
      lives: maxLives, phase: 'ready', armed: true, finished: false, current: '',
    };
    setHud({ height: 0, lives: maxLives, current: '' });
    moveRef.current = 0;
  }, [game.round, game.stageIndex, stage, game.seed, plankW, shallowRate, maxLives]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    const pressing = keys.held.current.action || keys.held.current.up;

    if (dt > 0 && !w.finished && w.phase === 'ready') {
      if (!pressing && moveRef.current === 0) w.armed = true;
      if ((pressing || moveRef.current !== 0) && w.armed) {
        w.phase = 'climb';
        w.armed = false;
        w.vy = jumpV;
      }
    } else if (dt > 0 && !w.finished) {
      const dir = (keys.held.current.left ? -1 : 0) + (keys.held.current.right ? 1 : 0) + moveRef.current;
      w.x += clamp(dir, -1, 1) * 340 * dt;
      if (w.x < -HERO_R) w.x = WORLD_W + HERO_R;
      if (w.x > WORLD_W + HERO_R) w.x = -HERO_R;

      w.vy += gravity * dt;
      w.y += w.vy * dt;

      // 화면이 따라 올라간다 — 캐릭터가 위쪽 1/3을 넘으면 세상을 아래로 민다
      if (w.y < WORLD_H * 0.36) {
        const lift = WORLD_H * 0.36 - w.y;
        w.y += lift;
        w.height += lift;
        for (const plank of w.planks) plank.y += lift;
      }

      // 내려올 때만 발판을 밟는다
      if (w.vy > 0) {
        for (const plank of w.planks) {
          if (plank.broken) continue;
          if (w.y + HERO_R < plank.y || w.y + HERO_R > plank.y + 22) continue;
          if (w.x < plank.x - HERO_R || w.x > plank.x + plank.w + HERO_R) continue;
          if (plank.deep) {
            w.vy = jumpV;
            w.current = plank.text;
          } else {
            plank.broken = true;
            w.vy = jumpV * 0.42;
            w.current = plank.text;
          }
          break;
        }
      }

      if (w.y > WORLD_H + 40) {
        w.lives -= 1;
        w.phase = 'ready';
        w.armed = false;
        w.vy = 0;
        w.y = WORLD_H - 120;
        w.x = WORLD_W / 2;
        // 떨어지면 조금 아래에서 다시 시작한다 — 처음부터는 아니다
        const back = Math.min(w.height, 300);
        w.height -= back;
        for (const plank of w.planks) plank.y -= back;
      }

      if (Math.round(w.height) !== hud.height || w.lives !== hud.lives || w.current !== hud.current) {
        setHud({ height: Math.round(w.height), lives: w.lives, current: w.current });
      }

      if (w.lives <= 0) {
        w.finished = true;
        game.fail('아래로 떨어졌어요. 이유를 묻는 깊은 질문 발판을 밟아 올라가 봐요.');
      } else if (w.height >= stage.goalHeight) {
        w.finished = true;
        game.succeed(`${stage.topic}을 깊게 묻는 질문으로 과제에 도움이 되는 답까지 올라갔어요!`);
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 목표 높이 표시
    const goalY = WORLD_H - 80 - (stage.goalHeight - w.height);
    if (goalY > -60 && goalY < WORLD_H) {
      panel(ctx, 0, goalY - 26, WORLD_W, 52, '#064E3B', PLAY.goal, 0);
      centerText(ctx, '과제에 도움이 되는 답', WORLD_W / 2, goalY, 26, BOARD.ink);
    }

    for (const plank of w.planks) {
      if (plank.y < -40 || plank.y > WORLD_H + 40) continue;
      if (plank.broken) continue;
      panel(
        ctx, plank.x, plank.y, plank.w, 22,
        plank.deep ? '#065F46' : '#334155',
        plank.deep ? PLAY.goal : BOARD.line, 8,
      );
      centerText(ctx, plank.text, plank.x + plank.w / 2, plank.y + 11, 20, BOARD.ink);
    }

    ctx.beginPath();
    ctx.arc(w.x, w.y, HERO_R, 0, Math.PI * 2);
    ctx.fillStyle = PLAY.hero;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.stroke();
    centerText(ctx, '❓', w.x, w.y + 1, 22, '#3B2100');

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 220, WORLD_H - 96, 440, 60, BOARD.overlay, PLAY.hero, 14);
      centerText(
        ctx,
        w.armed ? '스페이스나 ← → 를 누르면 오릅니다' : '손을 떼었다가 다시 누르세요',
        WORLD_W / 2, WORLD_H - 66, 24, BOARD.ink,
      );
    }
  };

  return (
    <MiniGameFrame
      badge="질문 발판 오르기"
      instruction={`${stage.topic}을 깊게 묻는 초록 발판을 밟아 위로 오르세요. 회색 발판은 밟으면 바스러집니다.`}
      progress={{ label: '오른 높이', value: Math.min(hud.height, stage.goalHeight), max: stage.goalHeight }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => { moveRef.current = -1; window.setTimeout(() => { moveRef.current = 0; }, 220); }} emoji="⬅️" label="왼쪽" />
          <MiniGameButton onClick={() => { moveRef.current = 1; window.setTimeout(() => { moveRef.current = 0; }, 220); }} emoji="➡️" label="오른쪽" />
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 오르기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <p
          className="rounded-xl px-3 py-1.5 text-[15px] font-black"
          style={{ background: 'var(--board-surface)', border: '2px solid #38BDF8', color: 'var(--board-ink)' }}
        >
          지금 밟은 질문 · {hud.current || '아직 없습니다'}
        </p>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="aspect-video max-h-full w-full max-w-[760px]">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                if (pointer.phase === 'up') { moveRef.current = 0; return; }
                moveRef.current = pointer.x < WORLD_W / 2 ? -1 : 1;
              }}
              ariaLabel={`깊은 질문 발판을 밟아 오르는 놀이. 오른 높이 ${hud.height}, 남은 기회 ${hud.lives}개.`}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
