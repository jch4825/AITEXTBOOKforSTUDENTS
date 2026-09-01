import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, approach, centerText, clamp, fillRoundRect, panel, useGameKeys,
} from '../engine';
import type { MiniGameProps } from '../types';

/**
 * m1-l4 · 카메라 각도 돌리기 (장르 22 · 시점 조작 퍼즐)
 *
 * "아이미가 왜 못 알아봤을까"를 말로 설명하는 대신 손으로 만들어 보게 한다. 학생이
 * 돌린 각도, 옮긴 빛, 치운 가림막에서 곧바로 아이미의 대답이 나온다. 정답표를 뒤지는
 * 것이 아니라 학생이 만든 사진에서 결과가 파생되므로, 답이 달라진 까닭이 손에 남는다.
 *
 * 세 손잡이의 몫을 일부러 겹치지 않게 나눠 두었다. 하나만 고쳐서는 목표선을 넘지
 * 못하고 둘 이상을 손봐야 넘는다. 그래서 "가려서 그렇구나"로 끝나지 않고 "가림도
 * 있었고 빛도 어두웠다"까지 간다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

/** 사진 틀과 그 안 물체의 자리. 가림막이 얼마나 가렸는지는 이 네모로 잰다. */
const FRAME = { x: 60, y: 104, w: 580, h: 344 };
const OBJ = { x: 350, y: 268, r: 96 };
const BOX = { x: OBJ.x - OBJ.r, y: OBJ.y - OBJ.r, w: OBJ.r * 2, h: OBJ.r * 2 };

/** 위·아래 손잡이가 함께 쓰는 가로 자. 두 줄의 눈금이 같아야 손이 헷갈리지 않는다. */
const TRACK_X0 = 132;
const TRACK_X1 = 578;
const TRACK_MID = (TRACK_X0 + TRACK_X1) / 2;
const TRACK_HALF = (TRACK_X1 - TRACK_X0) / 2;
const LIGHT_Y = 58;
const DIAL_Y = 496;

/** 오른쪽 세로 막대 — 아이미가 알아본 정도가 실시간으로 오르내린다. */
const BAR = { x: 770, y: 176, w: 100, h: 316 };

type ObjectKind = 'cup' | 'scissors' | 'book';

interface StageConfig {
  id: string;
  label: string;
  kind: ObjectKind;
  /** 학생에게 보이는 물건 이름 */
  name: string;
  /** 목적격 조사까지 붙인 말. 성공 문구에서 조사가 어긋나지 않게 미리 적어 둔다. */
  mark: string;
  /** 아이미가 확신할 때 하는 말. 받침에 따라 조사가 달라 스테이지마다 적는다. */
  sure: string;
  startAngle: number;
  startLight: number;
  clothX: number;
  clothY: number;
  target: number;
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'cup', label: '기본', kind: 'cup', name: '컵', mark: '컵을', sure: '컵이에요!',
    startAngle: 62, startLight: 0.62, clothX: 398, clothY: 186, target: 0.58, seconds: 50,
  },
  {
    id: 'scissors', label: '1단계', kind: 'scissors', name: '가위', mark: '가위를', sure: '가위예요!',
    startAngle: 105, startLight: 0.24, clothX: 452, clothY: 250, target: 0.64, seconds: 60,
  },
  {
    id: 'book', label: '2단계', kind: 'book', name: '책', mark: '책을', sure: '책이에요!',
    startAngle: 143, startLight: 0.86, clothX: 350, clothY: 349, target: 0.70, seconds: 70,
  },
];

interface World {
  dialX: number;
  dialTarget: number;
  light: number;
  clothX: number;
  clothY: number;
  hold: number;
  timeLeft: number;
  /** 첫 조작 전에는 시간이 흐르지 않는다. 화면을 보기도 전에 시간이 줄면 억울하다. */
  started: boolean;
  finished: boolean;
}

function buildWorld(stage: StageConfig, seconds: number): World {
  return {
    dialX: TRACK_MID + (stage.startAngle / 180) * TRACK_HALF,
    dialTarget: TRACK_MID + (stage.startAngle / 180) * TRACK_HALF,
    light: stage.startLight,
    clothX: stage.clothX,
    clothY: stage.clothY,
    hold: 0,
    timeLeft: seconds,
    started: false,
    finished: false,
  };
}

/** 가림막 네모와 물체 네모가 겹친 넓이의 비율. 학생이 옮긴 그대로에서 나온다. */
function coverOf(cx: number, cy: number, cw: number, ch: number): number {
  const ox = Math.max(0, Math.min(cx + cw / 2, BOX.x + BOX.w) - Math.max(cx - cw / 2, BOX.x));
  const oy = Math.max(0, Math.min(cy + ch / 2, BOX.y + BOX.h) - Math.max(cy - ch / 2, BOX.y));
  return clamp((ox * oy) / (BOX.w * BOX.h), 0, 1);
}

/** 컵 — 손잡이가 옆으로 튀어나와야 컵인 줄 안다. 돌리면 몸통 뒤로 숨는다. */
function drawCup(ctx: CanvasRenderingContext2D, cosA: number): void {
  const side = cosA >= 0 ? 1 : -1;
  ctx.beginPath();
  ctx.arc(side * 54, 4, 30, -Math.PI / 2, Math.PI / 2, side < 0);
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#94A3B8';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-56, -58);
  ctx.lineTo(56, -58);
  ctx.lineTo(44, 64);
  ctx.lineTo(-44, 64);
  ctx.closePath();
  ctx.fillStyle = '#CBD5E1';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#F8FAFC';
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, -58, 56, 14, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#64748B';
  ctx.fill();
  ctx.stroke();
}

/** 가위 — 두 날이 엇갈린 모양과 아래 고리 두 개가 알아보는 단서다. */
function drawScissors(ctx: CanvasRenderingContext2D): void {
  ctx.lineCap = 'round';
  ctx.lineWidth = 15;
  ctx.strokeStyle = '#CBD5E1';
  ctx.beginPath();
  ctx.moveTo(-26, 52);
  ctx.lineTo(30, -70);
  ctx.moveTo(26, 52);
  ctx.lineTo(-30, -70);
  ctx.stroke();

  ctx.lineWidth = 10;
  ctx.strokeStyle = '#94A3B8';
  ctx.beginPath();
  ctx.arc(-40, 70, 20, 0, Math.PI * 2);
  ctx.moveTo(60, 70);
  ctx.arc(40, 70, 20, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -5, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#F8FAFC';
  ctx.fill();
  ctx.lineCap = 'butt';
}

/** 책 — 펼친 두 쪽과 글줄. 옆으로 돌리면 그냥 막대가 된다. */
function drawBook(ctx: CanvasRenderingContext2D): void {
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#94A3B8';
  ctx.fillStyle = '#E2E8F0';
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(dir * 76, -46);
    ctx.lineTo(dir * 6, -34);
    ctx.lineTo(dir * 6, 58);
    ctx.lineTo(dir * 76, 44);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i < 4; i += 1) {
    const y = -16 + i * 17;
    ctx.moveTo(-66, y);
    ctx.lineTo(-18, y + 3);
    ctx.moveTo(66, y);
    ctx.lineTo(18, y + 3);
  }
  ctx.stroke();
}

/** 아이미의 말. 값이 오를수록 확신이 커지는 것이 곧 비텍스트 피드백의 짝이다. */
function bubbleLines(value: number, target: number, stage: StageConfig): [string, string] {
  if (value < target * 0.35) return ['무엇인지', '모르겠어요'];
  if (value < target * 0.7) return ['조금 보여요', '더 고쳐 주세요'];
  if (value < target) return [`${stage.name} 같아요`, '거의 다 왔어요'];
  return [stage.sure, '이제 잘 보여요'];
}

export default function LensAngleTurnGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 허용 오차를 그대로 곱하면 충분한 지원에서는 아무 데나 두어도 넘어가 버려 "왜 달라졌나"가
     사라진다. 절반만 반영해서, 쉬워지되 두 곳을 고쳐야 하는 성질은 남긴다. */
  const easedTol = 1 + (tuning.tolerance - 1) * 0.5;
  const frontWindow = 120 * easedTol;
  const lightHalf = 0.24 * easedTol;
  const target = clamp(stage.target + (1 - easedTol) * 0.12, 0.3, 0.92);
  const holdNeed = 1.2 / Math.max(0.75, tuning.tolerance);
  const totalSeconds = Math.round(stage.seconds * tuning.time);

  const clothW = 200 * tuning.size;
  const clothH = 150 * tuning.size;
  const handleR = 24 * clamp(tuning.size, 0.9, 1.25);
  const dialRate = 620 * tuning.speed;
  const dialKeyRate = 300 * tuning.speed;

  const worldRef = useRef<World>(buildWorld(stage, totalSeconds));
  const dragRef = useRef<'light' | 'dial' | 'cloth' | null>(null);
  const grabRef = useRef({ x: 0, y: 0 });
  const [view, setView] = useState({ seconds: totalSeconds, fixed: 0, tier: 0 });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    worldRef.current = buildWorld(stage, totalSeconds);
    dragRef.current = null;
    setView({ seconds: totalSeconds, fixed: 0, tier: 0 });
  }, [game.round, game.stageIndex, stage, totalSeconds]);

  const clampCloth = (x: number, y: number) => ({
    x: clamp(x, FRAME.x - clothW / 2 + 26, FRAME.x + FRAME.w + clothW / 2 - 26),
    y: clamp(y, FRAME.y - clothH / 2 + 26, FRAME.y + FRAME.h + clothH / 2 - 26),
  });

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;

    if (dt > 0 && !world.finished) {
      const held = keys.held.current;
      // 마우스를 한 손으로 쥐기 어려운 학생을 위해 세 손잡이 모두 자판으로도 움직인다.
      if (held.left) world.dialTarget -= dialKeyRate * dt;
      if (held.right) world.dialTarget += dialKeyRate * dt;
      if (held.up) world.light += 0.42 * dt;
      if (held.down) world.light -= 0.42 * dt;
      if (keys.consumePress('action')) {
        const moved = clampCloth(world.clothX + 56, world.clothY);
        world.clothX = moved.x;
        world.clothY = moved.y;
        world.started = true;
      }
      if (held.left || held.right || held.up || held.down) world.started = true;
      world.dialTarget = clamp(world.dialTarget, TRACK_X0, TRACK_X1);
      world.light = clamp(world.light, 0, 1);
      world.dialX = approach(world.dialX, world.dialTarget, dialRate * dt);
    }

    const angle = ((world.dialX - TRACK_MID) / TRACK_HALF) * 180;
    const norm = ((((angle + 180) % 360) + 360) % 360) - 180;
    const radians = (norm * Math.PI) / 180;
    const frontness = clamp(1 - Math.abs(norm) / frontWindow, 0, 1);
    const lightScore = clamp(1 - Math.abs(world.light - 0.5) / lightHalf, 0, 1);
    const cover = coverOf(world.clothX, world.clothY, clothW, clothH);
    const value = clamp(0.5 * frontness + 0.5 * lightScore - 0.6 * cover, 0, 1);
    const lines = bubbleLines(value, target, stage);
    const fixed = (frontness >= 0.62 ? 1 : 0) + (lightScore >= 0.62 ? 1 : 0) + (cover <= 0.12 ? 1 : 0);
    const tier = value >= target ? 3 : value < target * 0.35 ? 0 : value < target * 0.7 ? 1 : 2;

    if (dt > 0 && world.started && !world.finished) {
      world.timeLeft = Math.max(0, world.timeLeft - dt);
      // 잠깐 흔들렸다고 처음부터 다시 채우게 하면 손이 떨리는 학생에게 너무 가혹하다.
      world.hold = value >= target ? world.hold + dt : Math.max(0, world.hold - dt * 0.8);

      const seconds = Math.ceil(world.timeLeft);
      if (seconds !== view.seconds || fixed !== view.fixed || tier !== view.tier) {
        setView({ seconds, fixed, tier });
      }

      if (world.hold >= holdNeed) {
        world.finished = true;
        game.succeed(`아이미가 ${stage.mark} 알아봤어요! 각도와 빛과 가림막을 함께 고쳤기 때문입니다.`);
      } else if (world.timeLeft <= 0) {
        world.finished = true;
        game.fail('시간이 다 되었어요. 각도와 빛과 가림막 가운데 두 가지를 함께 바꿔 보세요.');
      }
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 빛 손잡이
    centerText(ctx, '어두움', 66, LIGHT_Y, 22, BOARD.inkDim);
    centerText(ctx, '밝음', 644, LIGHT_Y, 22, BOARD.inkDim);
    panel(ctx, TRACK_X0 - 6, LIGHT_Y - 11, TRACK_X1 - TRACK_X0 + 12, 22, BOARD.overlay, BOARD.line, 11);
    const lightX = TRACK_X0 + world.light * (TRACK_X1 - TRACK_X0);
    ctx.fillStyle = PLAY.hero;
    ctx.beginPath();
    ctx.arc(lightX, LIGHT_Y, handleR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.lineWidth = 4;
    ctx.stroke();
    centerText(ctx, '☀', lightX, LIGHT_Y + 1, 26, '#3B2100');

    // 사진 틀 — 이 안이 아이미가 보는 그림이다
    ctx.save();
    ctx.beginPath();
    fillRoundRect(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, 18);
    ctx.clip();
    ctx.fillStyle = BOARD.surface;
    ctx.fillRect(FRAME.x, FRAME.y, FRAME.w, FRAME.h);

    ctx.save();
    ctx.translate(OBJ.x, OBJ.y);
    // 옆으로 돌수록 실루엣이 납작해져 알아보기 어려워진다. 각도가 왜 중요한지가 눈에 보인다.
    ctx.scale(0.24 + 0.76 * Math.abs(Math.cos(radians)), 1);
    if (stage.kind === 'cup') drawCup(ctx, Math.cos(radians));
    else if (stage.kind === 'scissors') drawScissors(ctx);
    else drawBook(ctx);
    ctx.restore();

    // 가림막
    ctx.fillStyle = PLAY.extraEdge;
    fillRoundRect(ctx, world.clothX - clothW / 2, world.clothY - clothH / 2, clothW, clothH, 16);
    ctx.strokeStyle = PLAY.extra;
    ctx.lineWidth = 4;
    ctx.stroke();
    centerText(ctx, '가림막', world.clothX, world.clothY, 26, '#F5F3FF');

    // 밝기 — 어두우면 검게 덮이고 지나치게 밝으면 하얗게 날아간다
    const over = world.light - 0.5;
    ctx.fillStyle = over > 0
      ? `rgba(248, 250, 252, ${Math.min(0.7, over * 1.5)})`
      : `rgba(2, 6, 23, ${Math.min(0.74, -over * 1.55)})`;
    ctx.fillRect(FRAME.x, FRAME.y, FRAME.w, FRAME.h);

    if (!world.started && !world.finished) {
      panel(ctx, FRAME.x + 74, FRAME.y + 268, 432, 52, BOARD.overlay, PLAY.info, 14);
      centerText(ctx, '손잡이를 잡으면 시작합니다', FRAME.x + 290, FRAME.y + 294, 26, BOARD.ink);
    }
    ctx.restore();
    ctx.strokeStyle = BOARD.line;
    ctx.lineWidth = 4;
    ctx.beginPath();
    fillRoundRect(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, 18);
    ctx.stroke();

    // 회전 다이얼
    centerText(ctx, '돌리기', 66, DIAL_Y, 22, BOARD.inkDim);
    panel(ctx, TRACK_X0 - 6, DIAL_Y - 11, TRACK_X1 - TRACK_X0 + 12, 22, BOARD.overlay, BOARD.line, 11);
    ctx.strokeStyle = BOARD.line;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(TRACK_MID, DIAL_Y - 18);
    ctx.lineTo(TRACK_MID, DIAL_Y + 18);
    ctx.stroke();
    ctx.fillStyle = PLAY.info;
    ctx.beginPath();
    ctx.arc(world.dialX, DIAL_Y, handleR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PLAY.infoEdge;
    ctx.lineWidth = 4;
    ctx.stroke();
    centerText(ctx, '⟳', world.dialX, DIAL_Y + 1, 26, '#04263B');
    centerText(ctx, '방향키로도 됩니다', 355, DIAL_Y + 32, 20, BOARD.inkDim);

    // 아이미 말풍선
    panel(ctx, 676, 16, 270, 100, BOARD.overlay, PLAY.goal, 16);
    centerText(ctx, lines[0], 811, 48, 26, BOARD.ink);
    centerText(ctx, lines[1], 811, 86, 24, BOARD.inkDim);

    // 알아본 정도 막대
    centerText(ctx, '아이미가 알아봄', 811, 148, 22, BOARD.inkDim);
    panel(ctx, BAR.x, BAR.y, BAR.w, BAR.h, BOARD.overlay, BOARD.line, 14);
    const fillH = value * (BAR.h - 8);
    ctx.fillStyle = value >= target ? PLAY.goal : PLAY.info;
    fillRoundRect(ctx, BAR.x + 4, BAR.y + BAR.h - 4 - fillH, BAR.w - 8, fillH, 10);
    const targetY = BAR.y + BAR.h - 4 - target * (BAR.h - 8);
    ctx.strokeStyle = PLAY.hero;
    ctx.lineWidth = 5;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.moveTo(BAR.x - 16, targetY);
    ctx.lineTo(BAR.x + BAR.w + 16, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
    centerText(ctx, '목표', 724, targetY, 22, PLAY.hero);

    // 목표선 위에서 버틴 시간
    panel(ctx, 676, 504, 270, 32, BOARD.overlay, BOARD.line, 12);
    centerText(ctx, '맞춘 시간', 730, 520, 20, BOARD.inkDim);
    ctx.fillStyle = BOARD.surface;
    fillRoundRect(ctx, 786, 511, 148, 18, 9);
    ctx.fillStyle = PLAY.goal;
    fillRoundRect(ctx, 786, 511, 148 * clamp(world.hold / holdNeed, 0, 1), 18, 9);
  };

  const onPointer = (pointer: { x: number; y: number; phase: 'down' | 'move' | 'up' }) => {
    const world = worldRef.current;
    if (world.finished) return;
    if (pointer.phase === 'up') {
      dragRef.current = null;
      return;
    }
    if (pointer.phase === 'down') {
      world.started = true;
      // 손잡이 알맹이가 아니라 띠 전체를 받는다. 작은 원을 정확히 집을 필요가 없게 한다.
      if (pointer.y < 96) dragRef.current = 'light';
      else if (pointer.y > 456) dragRef.current = 'dial';
      else if (
        Math.abs(pointer.x - world.clothX) <= clothW / 2 + 10
        && Math.abs(pointer.y - world.clothY) <= clothH / 2 + 10
      ) {
        dragRef.current = 'cloth';
        grabRef.current = { x: pointer.x - world.clothX, y: pointer.y - world.clothY };
      } else dragRef.current = null;
    }
    if (dragRef.current === 'light') {
      world.light = clamp((pointer.x - TRACK_X0) / (TRACK_X1 - TRACK_X0), 0, 1);
    } else if (dragRef.current === 'dial') {
      world.dialTarget = clamp(pointer.x, TRACK_X0, TRACK_X1);
    } else if (dragRef.current === 'cloth') {
      const moved = clampCloth(pointer.x - grabRef.current.x, pointer.y - grabRef.current.y);
      world.clothX = moved.x;
      world.clothY = moved.y;
    }
  };

  return (
    <MiniGameFrame
      badge="카메라 각도 돌리기"
      instruction={`위 손잡이로 빛을, 아래 손잡이로 각도를 바꾸고 ${stage.name}을 덮은 가림막은 끌어서 치우세요. 오른쪽 막대가 목표선을 넘은 채로 잠깐 기다리면 아이미가 알아봅니다.`}
      progress={{ label: '고친 곳', value: view.fixed, max: 3 }}
      hud={<GameHud timeLeft={view.seconds} timeTotal={totalSeconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].name} 사진으로 바꿨어요.`)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 찍기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="aspect-video max-h-full w-full max-w-[760px]">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={onPointer}
            ariaLabel={`${stage.name} 사진의 각도와 빛과 가림막을 바꾸어 아이미가 알아보게 하는 놀이. 고친 곳 ${view.fixed}개, 남은 시간 ${view.seconds}초.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
