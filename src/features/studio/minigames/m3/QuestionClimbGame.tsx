import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, pick, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m3-l1 · 질문 계단 오르기 (무한 계단)
 *
 * 앞선 판은 발판 사이가 멀어 올라가지 못하는 칸이 많았다. 여기서는 계단이 이미 놓여
 * 있고, 다음 칸이 왼쪽인지 오른쪽인지만 보고 그 버튼을 누른다. 조작이 두 개뿐이라
 * 실패의 까닭이 언제나 분명하다.
 *
 * 시간은 계속 줄어들고, 한 칸 오를 때마다 조금 채워진다. 그래서 멈춰 있으면 진다.
 * 계단마다 질문이 적혀 있어 오르는 동안 좋은 질문을 읽게 된다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
/* 캐릭터가 선 높이와 계단 간격.
   간격이 캐릭터 지름보다 좁으면 다음 칸이 머리 위에 겹쳐 그려져, 어느 것이 밟을 칸인지
   알아볼 수 없다. 발밑 계단(HERO_Y + 26)과 캐릭터 반지름 22를 함께 넘도록 잡은 값이다. */
const HERO_Y = WORLD_H - 170;
const HERO_R = 22;
const STEP_H = 88;
const STEP_W = 132;
const CENTER = WORLD_W / 2;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  topic: string;
  /** 목적격 조사까지 붙인 말. 받침에 따라 을·를이 달라 스테이지마다 적어 둔다. */
  topicMark: string;
  goal: number;
  deep: string[];
  seconds: number;
  drain: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'plant',
    label: '기본',
    spoken: '식물 기르기를 깊게 묻는 계단을 올라요.',
    topic: '식물 기르기',
    topicMark: '식물 기르기를',
    goal: 18,
    seconds: 12,
    drain: 1,
    deep: ['왜 잎이 노래질까요', '물은 며칠에 한 번', '햇빛은 얼마나', '흙은 무엇이 좋을까요'],
  },
  {
    id: 'recycle',
    label: '1단계',
    spoken: '분리배출을 깊게 묻는 계단을 올라요.',
    topic: '분리배출',
    topicMark: '분리배출을',
    goal: 24,
    seconds: 11,
    drain: 1.15,
    deep: ['왜 씻어서 버릴까요', '어디에 넣나요', '뚜껑은 따로 버리나요', '언제 내놓나요'],
  },
  {
    id: 'safety',
    label: '2단계',
    spoken: '자전거 안전을 깊게 묻는 계단을 올라요.',
    topic: '자전거 안전',
    topicMark: '자전거 안전을',
    goal: 30,
    seconds: 10,
    drain: 1.3,
    deep: ['왜 안전모를 쓰나요', '밤에는 무엇이 필요한가요', '어디로 다녀야 하나요', '무엇을 먼저 볼까요'],
  },
];

interface Step {
  /** -1 왼쪽, 1 오른쪽 */
  side: number;
  text: string;
}

interface World {
  steps: Step[];
  height: number;
  offset: number;
  time: number;
  lives: number;
  phase: 'ready' | 'climb';
  finished: boolean;
  shake: number;
}

function makeSteps(stage: StageConfig, seed: number): Step[] {
  const random = createRandom(seed);
  const steps: Step[] = [];
  let side = 1;
  for (let i = 0; i < stage.goal + 30; i += 1) {
    // 같은 쪽이 세 번 넘게 이어지지 않게 한다. 무작정 한쪽만 누르면 통하지 않아야 한다.
    const streak = steps.slice(-2).every((s) => s.side === side);
    if (streak || random() < 0.45) side = -side;
    steps.push({ side, text: pick(random, stage.deep) });
  }
  return steps;
}

export default function QuestionClimbGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시간 여유와 줄어드는 속도, 기회로 나타난다. 계단과 질문은 같다.
     기준은 "한 칸에 몇 초를 쓸 수 있는가"(gain / drain)다. 이 값이 0.4초 아래로
     내려가면 다음 칸이 어느 쪽인지 읽을 틈이 없어 아무도 끝까지 오르지 못한다.
     지금은 충분한 지원 1.9초, 중학 0.9초, 고등 0.5~0.65초다. */
  const maxTime = stage.seconds * clamp(tuning.time, 0.85, 1.6);
  const drain = stage.drain / clamp(tuning.time, 0.85, 1.5);
  const gain = 0.9 * clamp(tuning.tolerance, 0.85, 1.4);
  const maxLives = tuning.lives;

  const worldRef = useRef<World>({
    steps: makeSteps(stage, game.seed), height: 0, offset: 0, time: maxTime,
    lives: maxLives, phase: 'ready', finished: false, shake: 0,
  });
  const [hud, setHud] = useState({ height: 0, lives: maxLives, time: maxTime, text: '' });
  const keys = useGameKeys(game.playing);
  const nudgeRef = useRef<number>(0);

  useEffect(() => {
    worldRef.current = {
      steps: makeSteps(stage, game.seed), height: 0, offset: 0, time: maxTime,
      lives: maxLives, phase: 'ready', finished: false, shake: 0,
    };
    setHud({ height: 0, lives: maxLives, time: maxTime, text: '' });
    nudgeRef.current = 0;
  }, [game.round, game.stageIndex, stage, game.seed, maxTime, maxLives]);

  const climb = (side: number) => {
    const w = worldRef.current;
    if (!game.playing || w.finished) return;
    if (w.phase === 'ready') { w.phase = 'climb'; }

    const next = w.steps[w.height];
    if (!next) return;
    if (next.side !== side) {
      w.lives -= 1;
      w.shake = 0.5;
      w.time = Math.max(0, w.time - 0.9);
      playSound('select');
      if (w.lives <= 0) {
        w.finished = true;
        game.fail('계단 방향과 다른 쪽을 눌렀어요. 다음 칸이 어느 쪽인지 보고 눌러 봐요.');
      }
      return;
    }
    w.height += 1;
    w.offset = 1;
    w.time = Math.min(maxTime, w.time + gain);
    playSound('fill');
    if (w.height >= stage.goal) {
      w.finished = true;
      game.succeed(`${stage.topicMark} 깊게 묻는 질문 계단을 ${stage.goal}칸 올랐어요!`);
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      if (nudgeRef.current !== 0) { climb(nudgeRef.current); nudgeRef.current = 0; }
      if (keys.consumePress('left')) climb(-1);
      if (keys.consumePress('right')) climb(1);

      if (w.phase === 'climb') {
        w.time = Math.max(0, w.time - drain * dt);
        w.offset = Math.max(0, w.offset - dt * 6);
        w.shake = Math.max(0, w.shake - dt * 2);
        if (w.time <= 0) {
          w.finished = true;
          game.fail('시간이 다 되었어요. 쉬지 않고 다음 칸 쪽 버튼을 눌러 올라가 봐요.');
        }
      }

      const nextText = w.steps[w.height]?.text ?? '';
      if (w.height !== hud.height || w.lives !== hud.lives
        || Math.abs(w.time - hud.time) > 0.09 || nextText !== hud.text) {
        setHud({ height: w.height, lives: w.lives, time: w.time, text: nextText });
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    /* 계단은 학생을 화면 한가운데 두고 세상이 흘러 내려오는 방식으로 그린다.
       칸의 절대 자리를 그대로 쓰면 좌우 이동이 계속 쌓여, 열 칸쯤 오른 뒤에는 계단과
       학생이 함께 화면 밖으로 걸어 나갔다. 그래서 지금 밟고 선 칸을 원점으로 삼고
       거기서 얼마나 떨어졌는지만 그린다.

       한 칸 오른 직후에는 세상이 한 칸 뒤에 있다가 제자리로 돌아온다(offset). 세로로
       내려오는 만큼 가로로도 되돌아와야 계단이 툭 끊기지 않는다. */
    const DX = STEP_W * 0.46;
    const walkTo = (index: number) => {
      let px = 0;
      for (let k = 0; k <= index; k += 1) px += w.steps[k].side * DX;
      return px;
    };
    const base = w.height === 0 ? 0 : walkTo(w.height - 1);
    const posOf = (index: number) => CENTER + walkTo(index) - base;
    const heroX = CENTER;
    const lastSide = w.height > 0 ? w.steps[w.height - 1].side : 0;
    const slide = w.offset * lastSide * DX;
    const shift = w.offset * STEP_H;

    const shakeX = w.shake > 0 ? Math.sin(w.shake * 46) * 7 : 0;
    ctx.save();
    ctx.translate(shakeX + slide, 0);

    // 이미 밟고 지나온 계단. 발밑만 그리면 계단이 아니라 허공에 뜬 판으로 보인다.
    for (let back = 1; back <= 3; back += 1) {
      const index = w.height - 1 - back;
      if (index < 0) break;
      const by = HERO_Y + 26 + back * STEP_H + shift;
      if (by > WORLD_H + 40) break;
      panel(ctx, posOf(index) - STEP_W / 2, by, STEP_W, 34, '#1E293B', BOARD.line, 8);
    }

    // 발밑 계단(또는 시작 바닥)
    panel(ctx, heroX - STEP_W / 2, HERO_Y + 26 + shift, STEP_W, 34, '#334155', BOARD.line, 8);

    for (let i = 0; i <= 7; i += 1) {
      const index = w.height + i;
      if (index >= w.steps.length) break;
      const sx = posOf(index);
      const sy = HERO_Y + 26 - (i + 1) * STEP_H + shift;
      // 위 두 띠(남은 시간·다음 질문)를 침범하는 칸은 그리지 않는다. 겹쳐 그리면
      // 글자와 계단이 서로를 갉아먹어 어느 쪽이 눌러야 할 칸인지 알아볼 수 없다.
      if (sy < 118 || sy > WORLD_H + 60) continue;
      const isNext = i === 0;
      panel(ctx, sx - STEP_W / 2, sy, STEP_W, 34,
        isNext ? '#065F46' : '#1E293B', isNext ? PLAY.goal : BOARD.line, 8);
      if (isNext) {
        centerText(ctx, w.steps[index].side < 0 ? '◀ 왼쪽' : '오른쪽 ▶', sx, sy + 17, 22, BOARD.ink);
      }
    }

    // 캐릭터 — 발밑 계단 바로 위에 선다
    const hy = HERO_Y + shift;
    ctx.beginPath();
    ctx.arc(heroX, hy, HERO_R, 0, Math.PI * 2);
    ctx.fillStyle = PLAY.hero;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.stroke();
    centerText(ctx, '❓', heroX, hy + 1, 22, '#3B2100');
    ctx.restore();

    // 남은 시간 막대
    const ratio = clamp(w.time / maxTime, 0, 1);
    panel(ctx, 40, 22, WORLD_W - 80, 30, BOARD.overlay, BOARD.line, 10);
    ctx.fillStyle = ratio < 0.3 ? PLAY.hazard : PLAY.goal;
    ctx.fillRect(44, 26, (WORLD_W - 88) * ratio, 22);
    centerText(ctx, `남은 시간 ${w.time.toFixed(1)}초 · ${w.height} / ${stage.goal}칸`, WORLD_W / 2, 37, 21, BOARD.ink);

    panel(ctx, 40, 62, WORLD_W - 80, 42, BOARD.overlay, PLAY.info, 10);
    centerText(ctx, `다음 계단의 질문 · ${w.steps[w.height]?.text ?? ''}`, WORLD_W / 2, 84, 21, BOARD.ink);

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 250, WORLD_H - 60, 500, 46, BOARD.overlay, PLAY.hero, 12);
      centerText(ctx, '← → 를 누르면 오르기가 시작됩니다', WORLD_W / 2, WORLD_H - 37, 22, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="질문 계단 오르기"
      instruction="계단이 놓인 방향에 맞추어 왼쪽 또는 오른쪽을 눌러 보세요. 한 칸씩 올라갈 때마다 시간이 늘어납니다."
      progress={{ label: '오른 칸', value: hud.height, max: stage.goal }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} timeLeft={hud.time} timeTotal={maxTime} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => { nudgeRef.current = -1; }} emoji="⬅️" label="왼쪽" variant="primary" />
          <MiniGameButton onClick={() => { nudgeRef.current = 1; }} emoji="➡️" label="오른쪽" variant="primary" />
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시" />
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
              nudgeRef.current = pointer.x < WORLD_W / 2 ? -1 : 1;
            }}
            ariaLabel={`질문 계단을 오르는 놀이. 오른 칸 ${hud.height}, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
