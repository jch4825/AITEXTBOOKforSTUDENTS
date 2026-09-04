import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, fillRoundRect,
  panel, pick, pointInRect, shuffle, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m4-l2 · 출처 절벽 오르기 (장르 5 · 등반 클라이밍)
 *
 * "더 믿을 만한 자료를 고른다"를 몸으로 매달리는 일로 만든다. 고르기만 해서는 아무 일도
 * 없고, 고른 손잡이에 실제로 체중이 실린다. 출처가 없거나 오래된 자료를 잡으면 그 손잡이가
 * 부스러져 몸이 내려간다 — 판단의 결과가 글이 아니라 높이로 먼저 보인다.
 *
 * 팔 힘 막대를 둔 이유는 "천천히 고민하면 늘 이긴다"를 막기 위해서다. 다만 준비 상태에서는
 * 팔 힘이 줄지 않으므로, 읽는 시간이 아니라 매달린 시간에만 값이 매겨진다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
/** 카메라는 늘 오르는 사람을 이 높이에 둔다. 위쪽에 다음 손잡이를 볼 자리를 남긴다. */
const CLIMBER_Y = 366;
const VIEW_TOP = 74;
const VIEW_BOTTOM = 496;
const ROCK_L = 56;
const ROCK_R = 904;
const ARM_MAX = 100;
/** 튼튼한 손잡이를 잡을 때 차오르는 팔 힘. 한 칸에 한 번 쉬어 갈 수 있을 만큼 준다. */
const ARM_GAIN = 34;

interface HoldSpec {
  source: string;
  date: string;
  /** 잡았을 때 판 아래에 뜨는 까닭. 왜 믿을 만한지·왜 못 믿는지를 한 문장으로 남긴다. */
  reason: string;
}

/** 만든 곳이 분명하고 날짜가 가까운 자료 — 절대 부서지지 않는다. */
const SOLID_HOLDS: HoldSpec[] = [
  { source: '학교 공식 누리집', date: '오늘', reason: '학교가 오늘 직접 올린 자료예요' },
  { source: '선생님 안내문', date: '어제', reason: '선생님이 어제 나눠 준 자료예요' },
  { source: '시청 누리집', date: '이번 주', reason: '시청이 이번 주에 올린 자료예요' },
  { source: '학교 알림장', date: '오늘', reason: '학교가 오늘 보낸 알림이에요' },
  { source: '교육청 누리집', date: '어제', reason: '교육청이 어제 올린 자료예요' },
];

/** 만든 곳을 알 수 없거나 날짜가 먼 자료 — 잡는 순간 부스러진다. */
const WEAK_HOLDS: HoldSpec[] = [
  { source: '누가 올린 글', date: '3년 전', reason: '누가 썼는지 모르고 3년이나 지났어요' },
  { source: '출처 없음', date: '날짜 없음', reason: '어디서 왔는지 적혀 있지 않아요' },
  { source: '친구가 들었대요', date: '언제인지 몰라요', reason: '들은 이야기라 확인할 수 없어요' },
  { source: '이름 없는 글', date: '2년 전', reason: '쓴 사람이 없고 2년 전 이야기예요' },
  { source: '떠도는 이야기', date: '날짜 없음', reason: '어디서 시작됐는지 알 수 없어요' },
];

interface Hold extends HoldSpec {
  solid: boolean;
  /** 손잡이의 가로 자리. 칸마다 좌우로 어긋나 지그재그 길이 된다. */
  x: number;
  broken: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  /** 세 자료가 함께 전하는 하나의 소식. 안내 문장에서 읽어 준다. */
  title: string;
  levels: number;
  /** 부서지는 손잡이가 섞이는 칸의 비율. tuning.density가 여기에 곱해진다. */
  crumbleBase: number;
}

const STAGES: StageConfig[] = [
  { id: 'lunch', label: '기본', title: '오늘 급식 반찬이 바뀌었다는 소식입니다.', levels: 4, crumbleBase: 0.7 },
  { id: 'sports', label: '1단계', title: '운동회 날짜가 옮겨졌다는 소식입니다.', levels: 5, crumbleBase: 0.85 },
  { id: 'bus', label: '2단계', title: '학교 앞 버스 시간이 달라졌다는 소식입니다.', levels: 6, crumbleBase: 1 },
];

interface World {
  rows: Hold[][];
  /** 지금 몸이 있는 칸. 0은 바닥이고 rows.length가 정상이다. */
  level: number;
  cursor: number;
  arm: number;
  lives: number;
  cam: number;
  bodyX: number;
  /** 칸마다 실제로 잡았던 자리. 미끄러질 때 몸이 돌아갈 곳을 안다. */
  xs: number[];
  phase: 'ready' | 'climbing';
  /** 손을 뗐다가 다시 눌러야 잡힌다. 누른 채로 미끄러지면 연달아 부서지기 때문이다. */
  armed: boolean;
  lock: number;
  note: string;
  noteTimer: number;
  shake: number;
  finished: boolean;
}

/** 칸마다 튼튼한 손잡이를 반드시 하나 남긴다. 그래서 어떤 판도 끝까지 오를 수 있다. */
function buildRows(stage: StageConfig, seed: number, density: number): Hold[][] {
  const random = createRandom(seed);
  const ratio = clamp(stage.crumbleBase * density, 0.3, 1);
  const rows: Hold[][] = [];

  for (let i = 0; i < stage.levels; i += 1) {
    const xs = i % 2 === 0 ? [258, 606] : [360, 708];
    const solid = pick(random, SOLID_HOLDS);
    // 첫 칸에는 늘 부서지는 손잡이를 하나 둔다. 규칙을 말로 설명하지 않고 한 번에 보여 준다.
    const withWeak = i === 0 || random() < ratio;
    const partner = withWeak
      ? pick(random, WEAK_HOLDS)
      : pick(random, SOLID_HOLDS.filter((item) => item !== solid));
    const ordered = shuffle(random, [solid, partner]);
    rows.push(ordered.map((spec, index) => ({
      ...spec,
      solid: SOLID_HOLDS.includes(spec),
      x: xs[index],
      broken: false,
    })));
  }
  return rows;
}

function buildWorld(rows: Hold[][], lives: number): World {
  return {
    rows,
    level: 0,
    cursor: 0,
    arm: ARM_MAX,
    lives,
    cam: -CLIMBER_Y,
    bodyX: WORLD_W / 2,
    xs: [WORLD_W / 2],
    phase: 'ready',
    armed: true,
    lock: 0,
    note: '',
    noteTimer: 0,
    shake: 0,
    finished: false,
  };
}

/** 부서진 손잡이는 고를 수 없으므로 커서를 성한 손잡이로 옮긴다. */
function firstOpen(row?: Hold[]): number {
  if (!row) return 0;
  const index = row.findIndex((hold) => !hold.broken);
  return index < 0 ? 0 : index;
}

export default function SourceClimbGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const holdW = clamp(220 * tuning.size, 206, 292);
  const holdH = clamp(62 * tuning.size, 58, 76);
  const gap = clamp(118 * tuning.size, 112, 140);
  const heroR = clamp(26 * tuning.size, 24, 30);
  /* 팔 힘은 천천히 줄어야 한다. 이 학생들에게 필요한 것은 다급함이 아니라 "머뭇거리면
     조금 손해"라는 감각이다. 기준값에서 100이 다 닳기까지 18초쯤 걸린다. */
  const drain = 5.5 * tuning.speed;

  const worldRef = useRef<World>(buildWorld(buildRows(stage, game.seed, tuning.density), tuning.lives));
  const pointerDownRef = useRef(false);
  const [hud, setHud] = useState({ level: 0, lives: tuning.lives });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    worldRef.current = buildWorld(buildRows(stage, game.seed, tuning.density), tuning.lives);
    pointerDownRef.current = false;
    setHud({ level: 0, lives: tuning.lives });
  }, [game.round, game.stageIndex, stage, game.seed, tuning.lives, tuning.density]);

  const holdRect = (hold: Hold, level: number, cam: number) => ({
    x: hold.x - holdW / 2,
    y: -level * gap - cam - holdH / 2,
    w: holdW,
    h: holdH,
  });

  const moveCursor = (direction: number) => {
    const world = worldRef.current;
    const row = world.rows[world.level];
    if (!row || world.finished) return;
    for (let step = 1; step <= row.length; step += 1) {
      const next = (world.cursor + direction * step + row.length * 4) % row.length;
      if (row[next].broken || next === world.cursor) continue;
      world.cursor = next;
      playSound('select');
      return;
    }
  };

  const grab = (index: number) => {
    const world = worldRef.current;
    if (world.finished || !game.playing || world.lock > 0 || !world.armed) return;
    const row = world.rows[world.level];
    const hold = row?.[index];
    if (!hold || hold.broken) return;

    world.armed = false;
    world.cursor = index;

    if (hold.solid) {
      world.level += 1;
      world.xs[world.level] = hold.x;
      world.arm = Math.min(ARM_MAX, world.arm + ARM_GAIN);
      world.phase = 'climbing';
      world.note = `✓ ${hold.reason}`;
      world.noteTimer = 2.4;
      playSound('confirm');
    } else {
      // 부서지는 손잡이는 한 번 부서지면 사라진다. 같은 실수를 반복해서 기회를 잃지 않게 한다.
      hold.broken = true;
      world.lives -= 1;
      world.level = Math.max(0, world.level - 1);
      world.phase = 'ready';
      world.lock = 0.5;
      world.shake = 0.7;
      world.note = `💥 ${hold.reason}`;
      world.noteTimer = 4.5;
    }
    world.cursor = firstOpen(world.rows[world.level]);
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    const topLevel = world.rows.length;

    // 손과 키를 모두 뗀 순간에만 다시 잡을 수 있게 무장한다.
    if (!pointerDownRef.current && !keys.held.current.action && !keys.held.current.up) {
      world.armed = true;
    }

    if (dt > 0 && !world.finished) {
      world.lock = Math.max(0, world.lock - dt);
      world.shake = Math.max(0, world.shake - dt * 1.6);
      world.noteTimer = Math.max(0, world.noteTimer - dt);
      if (world.noteTimer === 0) world.note = '';

      if (keys.consumePress('left')) moveCursor(-1);
      if (keys.consumePress('right')) moveCursor(1);
      if (keys.consumePress('action') || keys.consumePress('up')) grab(world.cursor);

      // 준비 상태에서는 팔 힘이 줄지 않는다. 읽는 시간에 벌을 주지 않기 위해서다.
      if (world.phase === 'climbing') {
        world.arm -= drain * dt;
        if (world.arm <= 0) {
          if (world.level <= 0) {
            world.finished = true;
            game.fail('팔 힘이 다 떨어져 바닥까지 미끄러졌어요. 출처와 날짜를 빨리 견주어 잡아요.');
          } else {
            world.arm = ARM_MAX * 0.45;
            world.level -= 1;
            world.phase = 'ready';
            world.armed = false;
            world.lock = 0.5;
            world.shake = 0.7;
            world.cursor = firstOpen(world.rows[world.level]);
            world.note = '팔 힘이 떨어져 한 칸 미끄러졌어요. 다음 손잡이를 조금 더 빨리 고릅니다.';
            world.noteTimer = 3.6;
          }
        }
      }

      if (!world.finished && world.lives <= 0) {
        world.finished = true;
        game.fail('부서지는 손잡이를 너무 여러 번 잡았어요. 누가 만든 자료인지와 날짜를 먼저 봅니다.');
      } else if (!world.finished && world.level >= topLevel) {
        world.finished = true;
        game.succeed('만든 곳이 분명하고 날짜가 가까운 자료만 잡아 정상까지 올랐어요!');
      }

      if (world.level !== hud.level || world.lives !== hud.lives) {
        setHud({ level: world.level, lives: world.lives });
      }
    }

    // 카메라와 몸은 따라붙듯 움직인다. 한 칸 오르는 데 0.5초쯤 걸려 "올랐다"가 눈에 남는다.
    const targetCam = -world.level * gap - CLIMBER_Y;
    world.cam += (targetCam - world.cam) * Math.min(1, dt * 3.2);
    world.bodyX += ((world.xs[world.level] ?? WORLD_W / 2) - world.bodyX) * Math.min(1, dt * 4.5);

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    const shakeX = world.shake > 0 ? Math.sin(world.shake * 38) * 7 : 0;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, VIEW_TOP, WORLD_W, VIEW_BOTTOM - VIEW_TOP);
    ctx.clip();
    ctx.translate(shakeX, 0);

    ctx.fillStyle = BOARD.surface;
    ctx.fillRect(ROCK_L, VIEW_TOP, ROCK_R - ROCK_L, VIEW_BOTTOM - VIEW_TOP);

    // 바위 결이 아래로 흘러야 "오르고 있다"가 글자 없이 보인다.
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.32)';
    ctx.lineWidth = 2;
    const seamStart = Math.floor((world.cam + VIEW_TOP) / 64) * 64;
    for (let wy = seamStart; wy < world.cam + VIEW_BOTTOM; wy += 64) {
      const sy = wy - world.cam;
      ctx.beginPath();
      ctx.moveTo(ROCK_L, sy);
      ctx.lineTo(ROCK_R, sy);
      ctx.stroke();
    }
    ctx.strokeStyle = BOARD.line;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(ROCK_L, VIEW_TOP);
    ctx.lineTo(ROCK_L, VIEW_BOTTOM);
    ctx.moveTo(ROCK_R, VIEW_TOP);
    ctx.lineTo(ROCK_R, VIEW_BOTTOM);
    ctx.stroke();

    const groundY = -world.cam;
    panel(ctx, ROCK_L - 8, groundY + 30, ROCK_R - ROCK_L + 16, 240, BOARD.overlay, BOARD.line, 10);
    centerText(ctx, '바닥', WORLD_W / 2, groundY + 66, 24, BOARD.inkDim);

    const flagY = -topLevel * gap - world.cam;
    panel(ctx, WORLD_W / 2 - 180, flagY - 40, 360, 78, BOARD.overlay, PLAY.goal, 16);
    centerText(ctx, '🚩 정상', WORLD_W / 2, flagY - 1, 32, BOARD.ink);

    world.rows.forEach((row, rowIndex) => {
      const level = rowIndex + 1;
      const isChoice = level === world.level + 1;
      const passed = level <= world.level;
      row.forEach((hold, index) => {
        const rect = holdRect(hold, level, world.cam);
        if (rect.y > VIEW_BOTTOM + 60 || rect.y + rect.h < VIEW_TOP - 60) return;
        const cx = rect.x + rect.w / 2;
        const cy = rect.y + rect.h / 2;

        if (hold.broken) {
          panel(ctx, rect.x, rect.y, rect.w, rect.h, BOARD.bg, BOARD.line, 12);
          centerText(ctx, '💨 부서졌어요', cx, cy, 22, BOARD.inkDim);
          return;
        }
        if (isChoice) {
          // 고르고 있는 손잡이는 테두리를 한 겹 더 두른다. 색만으로도 어디를 잡을지 보인다.
          const selected = index === world.cursor;
          if (selected) panel(ctx, rect.x - 8, rect.y - 8, rect.w + 16, rect.h + 16, BOARD.overlay, PLAY.hero, 18);
          panel(ctx, rect.x, rect.y, rect.w, rect.h, BOARD.overlay, selected ? PLAY.hero : PLAY.info, 12);
          centerText(ctx, hold.source, cx, cy - 13, 23, BOARD.ink);
          centerText(ctx, hold.date, cx, cy + 15, 21, BOARD.inkDim);
          if (selected) centerText(ctx, '▲', cx, rect.y + rect.h + 22, 26, PLAY.hero);
          return;
        }
        // 아직 멀거나 이미 지나간 칸은 글자 없이 둔다. 읽을 글은 고를 손잡이에만 있어야 한다.
        const used = passed && Math.abs((world.xs[level] ?? -999) - hold.x) < 4;
        panel(ctx, rect.x + rect.w * 0.22, rect.y + 13, rect.w * 0.56, rect.h - 26,
          BOARD.overlay, used ? PLAY.goal : BOARD.line, 10);
      });
    });

    const bodyY = -world.level * gap - world.cam;
    const aimed = world.rows[world.level]?.[world.cursor];
    if (aimed && !world.finished) {
      ctx.strokeStyle = PLAY.hero;
      ctx.lineWidth = 4;
      ctx.setLineDash([9, 9]);
      ctx.beginPath();
      ctx.moveTo(world.bodyX, bodyY);
      ctx.lineTo(aimed.x, -(world.level + 1) * gap - world.cam);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = PLAY.hero;
    ctx.beginPath();
    ctx.arc(world.bodyX, bodyY, heroR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.lineWidth = 4;
    ctx.stroke();
    centerText(ctx, '🧗', world.bodyX, bodyY + 2, 34, BOARD.ink);

    ctx.restore();

    // 위쪽 띠 — 지금 고른 손잡이를 크게 한 번 더 읽어 준다.
    panel(ctx, 24, 8, WORLD_W - 48, 58, BOARD.overlay, PLAY.info, 14);
    centerText(
      ctx,
      aimed ? `고른 손잡이 · ${aimed.source} · ${aimed.date}` : '정상에 닿았어요',
      WORLD_W / 2, 37, 26, BOARD.ink,
    );

    const lines: string[] = [];
    if (world.note) lines.push(world.note);
    if (world.phase === 'ready') {
      lines.push(world.armed
        ? (world.level === 0 && world.lives === tuning.lives
          ? '손잡이를 눌러 오르기를 시작합니다'
          : '손잡이를 눌러 이어서 올라갑니다')
        : '손을 떼었다가 다시 누르세요');
    }
    if (lines.length > 0 && !world.finished) {
      const boxH = 30 + lines.length * 32;
      panel(ctx, WORLD_W / 2 - 340, 404, 680, boxH,
        BOARD.overlay, world.phase === 'ready' ? PLAY.hero : PLAY.info, 16);
      lines.forEach((line, index) => {
        centerText(ctx, line, WORLD_W / 2, 434 + index * 32, 24,
          index === 0 && world.note ? BOARD.ink : BOARD.inkDim);
      });
    }

    // 팔 힘 — 숫자가 아니라 줄어드는 막대와 색으로 먼저 읽힌다.
    const ratio = clamp(world.arm / ARM_MAX, 0, 1);
    centerText(ctx, '팔 힘', 62, 517, 22, BOARD.ink);
    panel(ctx, 108, 502, WORLD_W - 132, 30, BOARD.overlay, BOARD.line, 10);
    ctx.fillStyle = ratio > 0.5 ? PLAY.goal : ratio > 0.22 ? PLAY.hero : PLAY.hazard;
    fillRoundRect(ctx, 114, 508, (WORLD_W - 144) * ratio, 18, 8);
  };

  return (
    <MiniGameFrame
      badge="출처 절벽 오르기"
      instruction={`${stage.title} 손잡이에 적힌 출처와 날짜를 보고 더 믿을 만한 쪽을 잡으세요. 손잡이를 누르거나, 좌우 방향키로 고르고 스페이스를 누릅니다.`}
      progress={{ label: '오른 칸', value: hud.level, max: stage.levels }}
      hud={<GameHud lives={hud.lives} maxLives={tuning.lives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].title)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 오르기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'up') {
                pointerDownRef.current = false;
                return;
              }
              if (pointer.phase !== 'down') return;
              pointerDownRef.current = true;
              const world = worldRef.current;
              const row = world.rows[world.level];
              if (!row) return;
              // 손이 조금 빗나가도 잡히도록 판정을 넓힌다. 지원 수준이 낮을수록 더 넓다.
              const pad = 14 * tuning.tolerance;
              for (let index = 0; index < row.length; index += 1) {
                if (row[index].broken) continue;
                const rect = holdRect(row[index], world.level + 1, world.cam);
                const wide = { x: rect.x - pad, y: rect.y - pad, w: rect.w + pad * 2, h: rect.h + pad * 2 };
                if (pointInRect(pointer.x, pointer.y, wide)) {
                  grab(index);
                  return;
                }
              }
            }}
            ariaLabel={`출처와 날짜를 보고 손잡이를 골라 절벽을 오르는 놀이. ${hud.level}칸 올랐고 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
