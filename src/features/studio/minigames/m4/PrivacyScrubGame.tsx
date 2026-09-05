import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m4-l3 · 개인정보 지우기 (장르 21 · 정돈 클리닝)
 *
 * "나를 알아볼 수 있는 정보는 가리고, 부탁에 꼭 필요한 조건은 남긴다"를 문질러 지우는
 * 일로 만든다. 지우기가 버튼 한 번이면 "어디까지 지울까"라는 판단이 사라지므로,
 * 지우개를 끌고 다니며 칸을 채우게 했다. 손이 넓게 지나가면 옆에 있는 조건까지 함께
 * 뭉개진다 — 이 게임의 어려움은 고르는 일이 아니라 손끝을 조절하는 일이다.
 *
 * 결과는 정답표 조회가 아니라 학생이 실제로 지운 칸에서 나온다. 같은 얼룩을 지우는
 * 길은 여러 가지이고, 조건을 얼마나 스치는지도 학생마다 다르다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
/** 메시지 카드 — 왼쪽 넓은 자리. 오른쪽에는 무엇을 가리고 무엇을 남길지 목록을 둔다. */
const CARD_X = 40;
const CARD_Y = 78;
const CARD_W = 660;
const CARD_H = 422;
const COLS = 40;
const ROWS = 24;
const CELL_W = CARD_W / COLS;
const CELL_H = CARD_H / ROWS;
const LINE_Y0 = CARD_Y + 44;
const LINE_STEP = 68;
/** 표시 영역 높이. 격자 세 줄이 들어가야 85%·40% 같은 비율이 뜻을 가진다. */
const MARK_H = 52;
const TEXT_SIZE = 26;
const SIDE_X = 716;
const SIDE_W = 204;
const BASE_TIME = 50;
const BASE_NOTICE = '붉은 곳을 문질러 지우고, 초록 밑줄은 남겨 주세요.';

type MarkKind = 'private' | 'need';

interface Token {
  text: string;
  kind?: MarkKind;
  /** 오른쪽 목록에 쓰는 짧은 이름 */
  label?: string;
}

interface StageConfig {
  id: string;
  label: string;
  title: string;
  lines: Token[][];
}

/**
 * 세 판은 같은 조작에 같은 구조다. 뒤로 갈수록 개인정보와 조건이 같은 줄에서
 * 바짝 붙어, 넓게 문지르면 조건까지 삼키게 된다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'homework',
    label: '기본',
    title: '숙제 부탁 글',
    lines: [
      [{ text: '아이미, 저는 ' }, { text: '김지우', kind: 'private', label: '이름' }, { text: '예요.' }],
      [{ text: '한들중학교', kind: 'private', label: '학교' }, { text: ' 2학년입니다.' }],
      [{ text: '수요일', kind: 'need', label: '요일' }, { text: '에 ' }, { text: '국어', kind: 'need', label: '과목' }, { text: ' 숙제를 도와주세요.' }],
      [{ text: '우리 반 ' }, { text: '네 명', kind: 'need', label: '인원' }, { text: '이 함께 합니다.' }],
      [{ text: '제 번호는 ' }, { text: '010-2345-6789', kind: 'private', label: '전화' }, { text: '예요.' }],
      [{ text: '우리 집 ' }, { text: '파란 대문 사진', kind: 'private', label: '사진' }, { text: '도 보내요.' }],
    ],
  },
  {
    id: 'artclass',
    label: '1단계',
    title: '준비물 부탁 글',
    lines: [
      [{ text: '아이미, 저는 ' }, { text: '박서준', kind: 'private', label: '이름' }, { text: '입니다.' }],
      [{ text: '금요일', kind: 'need', label: '요일' }, { text: ' ' }, { text: '미술', kind: 'need', label: '과목' }, { text: ' 준비를 도와주세요.' }],
      [{ text: '새싹고등학교', kind: 'private', label: '학교' }, { text: ' 1반 ' }, { text: '다섯 명', kind: 'need', label: '인원' }, { text: '이에요.' }],
      [{ text: '연락은 ' }, { text: '010-8765-4321', kind: 'private', label: '전화' }, { text: '로 주세요.' }],
      [{ text: '학교 정문 사진', kind: 'private', label: '사진' }, { text: '을 같이 보냅니다.' }],
    ],
  },
  {
    id: 'science',
    label: '2단계',
    title: '마감 있는 부탁 글',
    lines: [
      [{ text: '아이미, 저는 ' }, { text: '이하람', kind: 'private', label: '이름' }, { text: '입니다.' }],
      [{ text: '목요일', kind: 'need', label: '요일' }, { text: ' ' }, { text: '과학', kind: 'need', label: '과목' }, { text: ' 숙제를 도와주세요.' }],
      [{ text: '누리중학교', kind: 'private', label: '학교' }, { text: ' 3반 학생이에요.' }],
      [{ text: '010-1122-3344', kind: 'private', label: '전화' }, { text: ' ' }, { text: '금요일까지', kind: 'need', label: '마감' }, { text: '예요.' }],
      [{ text: '우리 집 대문 사진', kind: 'private', label: '사진' }, { text: '도 넣었어요.' }],
    ],
  },
];

interface Mark {
  kind: MarkKind;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  cells: number[];
  /** 개인정보를 다 가렸는지 */
  done: boolean;
  /** 조건이 흐려지기 시작했는지 */
  warn: boolean;
}

interface Layout {
  draws: { text: string; x: number; y: number }[];
  marks: Mark[];
}

interface World {
  erased: Uint8Array;
  layout: Layout | null;
  covered: number;
  lives: number;
  timeLeft: number;
  ex: number;
  ey: number;
  lastX: number;
  lastY: number;
  pressing: boolean;
  /** ready면 아직 시간이 흐르지 않는다. 첫 조작 전에는 판이 움직이지 않아야 한다. */
  phase: 'ready' | 'scrub';
  /** 손을 뗐다가 다시 눌러야 이어 한다. 누른 채로 조건을 또 뭉개는 일을 막는다. */
  armed: boolean;
  finished: boolean;
  notice: string;
  noticeTimer: number;
  hint: number;
  pulse: number;
}

function buildWorld(lives: number, seconds: number): World {
  return {
    erased: new Uint8Array(COLS * ROWS),
    layout: null,
    covered: 0,
    lives,
    timeLeft: seconds,
    ex: CARD_X + CARD_W / 2,
    ey: CARD_Y + CARD_H / 2,
    lastX: CARD_X + CARD_W / 2,
    lastY: CARD_Y + CARD_H / 2,
    pressing: false,
    phase: 'ready',
    armed: false,
    finished: false,
    notice: '',
    noticeTimer: 0,
    hint: 0,
    pulse: 0,
  };
}

/** 표시 영역이 덮는 격자 칸. 칸 가운데가 영역 안에 있으면 그 칸으로 센다. */
function cellsIn(x: number, y: number, w: number, h: number): number[] {
  const out: number[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    const cy = CARD_Y + (row + 0.5) * CELL_H;
    if (cy < y || cy > y + h) continue;
    for (let col = 0; col < COLS; col += 1) {
      const cx = CARD_X + (col + 0.5) * CELL_W;
      if (cx < x || cx > x + w) continue;
      out.push(row * COLS + col);
    }
  }
  return out;
}

/**
 * 글자 폭은 글꼴이 정하므로 캔버스가 준비된 뒤에야 잴 수 있다. 그래서 배치는
 * 첫 프레임에서 한 번 만들고 그대로 둔다.
 */
function makeLayout(ctx: CanvasRenderingContext2D, stage: StageConfig): Layout {
  ctx.font = `800 ${TEXT_SIZE}px "Pretendard", system-ui, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const draws: Layout['draws'] = [];
  const marks: Mark[] = [];
  stage.lines.forEach((tokens, index) => {
    const y = LINE_Y0 + index * LINE_STEP;
    let x = CARD_X + 24;
    for (const token of tokens) {
      const w = ctx.measureText(token.text).width;
      draws.push({ text: token.text, x, y });
      if (token.kind && token.label) {
        const rx = x - 3;
        const ry = y - MARK_H / 2;
        const rw = w + 6;
        marks.push({
          kind: token.kind,
          label: token.label,
          x: rx,
          y: ry,
          w: rw,
          h: MARK_H,
          cells: cellsIn(rx, ry, rw, MARK_H),
          done: false,
          warn: false,
        });
      }
      x += w;
    }
  });
  return { draws, marks };
}

/** 지우개가 지나간 자리를 칸 단위로 남긴다. 원 안에 가운데가 들어온 칸만 지워진다. */
function stamp(world: World, x: number, y: number, radius: number): void {
  const minCol = Math.max(0, Math.floor((x - radius - CARD_X) / CELL_W));
  const maxCol = Math.min(COLS - 1, Math.floor((x + radius - CARD_X) / CELL_W));
  const minRow = Math.max(0, Math.floor((y - radius - CARD_Y) / CELL_H));
  const maxRow = Math.min(ROWS - 1, Math.floor((y + radius - CARD_Y) / CELL_H));
  for (let row = minRow; row <= maxRow; row += 1) {
    const cy = CARD_Y + (row + 0.5) * CELL_H;
    for (let col = minCol; col <= maxCol; col += 1) {
      const cx = CARD_X + (col + 0.5) * CELL_W;
      const dx = cx - x;
      const dy = cy - y;
      if (dx * dx + dy * dy <= radius * radius) world.erased[row * COLS + col] = 1;
    }
  }
}

function ratioOf(world: World, mark: Mark): number {
  if (mark.cells.length === 0) return 0;
  let count = 0;
  for (const cell of mark.cells) if (world.erased[cell]) count += 1;
  return count / mark.cells.length;
}

export default function PrivacyScrubGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지우개가 크면 한 번에 넓게 지워지지만 옆의 조건까지 함께 삼킨다. 그래서 크기와
     조건 허용치를 함께 움직여, 충분한 지원에서는 넓고 너그럽게, 고등에서는 좁고
     까다롭게 만든다. 같은 게임의 요구 수준만 달라진다. */
  const radius = 26 * tuning.size;
  const moveSpeed = 300 * tuning.speed;
  const totalTime = BASE_TIME * tuning.time;
  const warnRatio = clamp(0.4 * tuning.tolerance, 0.3, 0.6);
  const ruinRatio = clamp(0.6 * tuning.tolerance, 0.5, 0.85);

  const privateTotal = stage.lines.reduce(
    (sum, tokens) => sum + tokens.filter((token) => token.kind === 'private').length, 0,
  );
  const needTotal = stage.lines.reduce(
    (sum, tokens) => sum + tokens.filter((token) => token.kind === 'need').length, 0,
  );

  const worldRef = useRef<World>(buildWorld(tuning.lives, totalTime));
  const [hud, setHud] = useState({
    covered: 0, lives: tuning.lives, time: Math.ceil(totalTime),
  });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    worldRef.current = buildWorld(tuning.lives, totalTime);
    setHud({ covered: 0, lives: tuning.lives, time: Math.ceil(totalTime) });
  }, [game.round, game.stageIndex, stage, tuning.lives, totalTime]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    if (!world.layout) world.layout = makeLayout(ctx, stage);
    const { draws, marks } = world.layout;
    const pressing = world.pressing || keys.held.current.action;

    if (dt > 0 && !world.finished) {
      world.pulse += dt * 2.2;
      if (world.noticeTimer > 0) world.noticeTimer = Math.max(0, world.noticeTimer - dt);
      if (world.hint > 0) world.hint = Math.max(0, world.hint - dt);

      // 방향키로도 지우개를 옮긴다. 마우스를 오래 끌기 어려운 학생에게 게임이 닫히지 않게 한다.
      let mx = 0;
      let my = 0;
      if (keys.held.current.left) mx -= 1;
      if (keys.held.current.right) mx += 1;
      if (keys.held.current.up) my -= 1;
      if (keys.held.current.down) my += 1;
      if (mx !== 0 || my !== 0) {
        const len = Math.hypot(mx, my);
        world.ex += (mx / len) * moveSpeed * dt;
        world.ey += (my / len) * moveSpeed * dt;
      }
      world.ex = clamp(world.ex, CARD_X, CARD_X + CARD_W);
      world.ey = clamp(world.ey, CARD_Y, CARD_Y + CARD_H);

      if (world.phase === 'ready') {
        if (!pressing) world.armed = true;
        if (pressing && world.armed) {
          world.phase = 'scrub';
          world.armed = false;
          world.lastX = world.ex;
          world.lastY = world.ey;
        }
      }

      if (world.phase === 'scrub') {
        world.timeLeft = Math.max(0, world.timeLeft - dt);
        if (pressing) {
          // 프레임 사이에 손이 멀리 갔으면 그 사이를 채운다. 빠르게 문지를 때 점점이 남지 않게 한다.
          const dx = world.ex - world.lastX;
          const dy = world.ey - world.lastY;
          const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (radius * 0.5)));
          for (let i = 1; i <= steps; i += 1) {
            stamp(world, world.lastX + (dx * i) / steps, world.lastY + (dy * i) / steps, radius);
          }
        }
        world.lastX = world.ex;
        world.lastY = world.ey;
      } else {
        world.lastX = world.ex;
        world.lastY = world.ey;
      }

      for (const mark of marks) {
        const ratio = ratioOf(world, mark);
        if (mark.kind === 'private') {
          if (!mark.done && ratio >= 0.85) {
            mark.done = true;
            world.covered += 1;
            world.notice = `${mark.label} 정보를 가렸어요.`;
            world.noticeTimer = 2.2;
            playSound('stamp');
          }
        } else if (ratio > ruinRatio) {
          /* 조건이 못 쓰게 되면 기회 하나를 쓰고 그 조건을 다시 적어 준다. 지워진 채로 두면
             그 판은 이길 수 없는 판이 되어 학생이 끝까지 해 볼 이유가 사라지기 때문이다. */
          for (const cell of mark.cells) world.erased[cell] = 0;
          mark.warn = false;
          world.lives -= 1;
          world.notice = `${mark.label} 조건이 지워져서 다시 적었어요.`;
          world.noticeTimer = 3;
          world.phase = 'ready';
          world.armed = false;
          playSound('select');
        } else if (ratio > warnRatio) {
          if (!mark.warn) {
            mark.warn = true;
            world.notice = `${mark.label} 조건이 흐려지고 있어요.`;
            world.noticeTimer = 2.2;
          }
        } else {
          mark.warn = false;
        }
      }

      const seconds = Math.ceil(world.timeLeft);
      if (world.covered !== hud.covered || world.lives !== hud.lives || seconds !== hud.time) {
        setHud({ covered: world.covered, lives: world.lives, time: seconds });
      }

      if (world.covered >= privateTotal) {
        world.finished = true;
        game.succeed('나를 알아볼 정보를 모두 가리고 필요한 조건은 남겼어요. 안전한 부탁이 되었어요!');
      } else if (world.lives <= 0) {
        world.finished = true;
        game.fail('조건까지 지워졌어요. 초록 밑줄 바깥만 문질러 봐요.');
      } else if (world.timeLeft <= 0) {
        world.finished = true;
        game.fail('시간이 다 되었어요. 붉게 덧칠된 곳부터 먼저 문질러요.');
      }
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 읽을 글은 이 띠 한 곳에만 크게 둔다. 카드 위 글자마다 안내가 붙으면 아무것도 못 읽는다.
    const showNotice = world.noticeTimer > 0;
    panel(ctx, 40, 10, 880, 56, BOARD.overlay, showNotice ? PLAY.hero : PLAY.info, 14);
    centerText(ctx, showNotice ? world.notice : BASE_NOTICE, 480, 38, 26, BOARD.ink);

    panel(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, BOARD.surface, BOARD.line, 16);

    ctx.font = `800 ${TEXT_SIZE}px "Pretendard", system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = BOARD.ink;
    for (const item of draws) ctx.fillText(item.text, item.x, item.y);

    for (const mark of marks) {
      if (mark.kind === 'private' && !mark.done) {
        ctx.fillStyle = 'rgba(251, 113, 133, 0.42)';
        ctx.fillRect(mark.x, mark.y, mark.w, mark.h);
        ctx.strokeStyle = PLAY.hazard;
        ctx.lineWidth = 3;
        ctx.strokeRect(mark.x, mark.y, mark.w, mark.h);
      }
      if (mark.kind === 'need' && mark.warn) {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.28)';
        ctx.fillRect(mark.x, mark.y, mark.w, mark.h);
      }
    }

    // 지워진 칸 — 문지른 자리는 글자가 사라진다. 지운 만큼이 그대로 보여야 판단이 선다.
    ctx.fillStyle = BOARD.overlay;
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        if (!world.erased[row * COLS + col]) continue;
        ctx.fillRect(CARD_X + col * CELL_W, CARD_Y + row * CELL_H, CELL_W + 0.6, CELL_H + 0.6);
      }
    }

    for (const mark of marks) {
      if (mark.kind === 'private') {
        if (!mark.done) continue;
        panel(ctx, mark.x, mark.y, mark.w, mark.h, BOARD.overlay, PLAY.goal, 8);
        centerText(ctx, '✔', mark.x + mark.w / 2, mark.y + mark.h / 2, 30, PLAY.goal);
      } else {
        // 초록 줄은 지워도 남는다. 글자가 흐려져도 "여기는 남길 곳"이라는 표시는 사라지지 않아야 한다.
        ctx.strokeStyle = mark.warn ? PLAY.hero : PLAY.goal;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(mark.x + 4, mark.y + mark.h - 7);
        ctx.lineTo(mark.x + mark.w - 4, mark.y + mark.h - 7);
        ctx.stroke();
      }
    }

    if (world.hint > 0) {
      const target = marks.find((mark) => mark.kind === 'private' && !mark.done);
      if (target) {
        ctx.strokeStyle = PLAY.extra;
        ctx.lineWidth = 5;
        ctx.setLineDash([12, 8]);
        ctx.strokeRect(target.x - 8, target.y - 8, target.w + 16, target.h + 16);
        ctx.setLineDash([]);
      }
    }

    ctx.beginPath();
    ctx.arc(world.ex, world.ey, radius, 0, Math.PI * 2);
    ctx.fillStyle = pressing ? 'rgba(251, 191, 36, 0.30)' : 'rgba(251, 191, 36, 0.14)';
    ctx.fill();
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.lineWidth = 4;
    ctx.stroke();
    centerText(ctx, '🧽', world.ex, world.ey, 30, BOARD.ink);

    // 오른쪽 목록 — 가릴 것과 남길 것을 늘 같은 자리에서 셀 수 있게 한다.
    panel(ctx, SIDE_X, CARD_Y, SIDE_W, CARD_H, BOARD.overlay, BOARD.line, 16);
    centerText(ctx, '가릴 것', SIDE_X + SIDE_W / 2, CARD_Y + 30, 24, BOARD.inkDim);
    let slot = 0;
    for (const mark of marks) {
      if (mark.kind !== 'private') continue;
      const y = CARD_Y + 66 + slot * 44;
      panel(ctx, SIDE_X + 14, y - 18, SIDE_W - 28, 36,
        mark.done ? '#14532D' : BOARD.surface, mark.done ? PLAY.goal : PLAY.hazard, 10);
      centerText(ctx, mark.done ? `${mark.label} 가림` : mark.label, SIDE_X + SIDE_W / 2, y, 24, BOARD.ink);
      slot += 1;
    }
    centerText(ctx, '남길 것', SIDE_X + SIDE_W / 2, CARD_Y + 242, 24, BOARD.inkDim);
    slot = 0;
    for (const mark of marks) {
      if (mark.kind !== 'need') continue;
      const y = CARD_Y + 278 + slot * 44;
      panel(ctx, SIDE_X + 14, y - 18, SIDE_W - 28, 36,
        BOARD.surface, mark.warn ? PLAY.hero : PLAY.goal, 10);
      centerText(ctx, mark.warn ? `${mark.label} 주의` : `${mark.label} 지킴`, SIDE_X + SIDE_W / 2, y, 24, BOARD.ink);
      slot += 1;
    }

    if (world.phase === 'ready' && !world.finished) {
      const boxW = 470;
      const boxH = 76;
      const boxY = CARD_Y + CARD_H / 2 - boxH / 2 + Math.sin(world.pulse) * 4;
      panel(ctx, CARD_X + (CARD_W - boxW) / 2, boxY, boxW, boxH, BOARD.overlay, PLAY.hero, 16);
      centerText(
        ctx,
        world.armed ? '누르면 시작합니다' : '손을 떼었다가 다시 누르세요',
        CARD_X + CARD_W / 2, boxY + boxH / 2, 28, BOARD.ink,
      );
    }
  };

  return (
    <MiniGameFrame
      badge="개인정보 지우기"
      instruction="빨간색으로 표시된 개인정보를 문질러 지우고, 꼭 필요한 요청 조건(초록색 밑줄)만 깨끗하게 남겨 보세요."
      progress={{ label: '가린 정보', value: hud.covered, max: privateTotal }}
      hud={<GameHud lives={hud.lives} maxLives={tuning.lives} timeLeft={hud.time} timeTotal={Math.ceil(totalTime)} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].title}으로 바꿨어요.`)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 지우기" variant="primary" />
          {game.hintAllowed && (
            <MiniGameButton
              onClick={() => { worldRef.current.hint = 3; }}
              disabled={!game.playing}
              emoji="💡"
              label="다음 곳 보기"
            />
          )}
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
              const world = worldRef.current;
              world.ex = clamp(pointer.x, CARD_X, CARD_X + CARD_W);
              world.ey = clamp(pointer.y, CARD_Y, CARD_Y + CARD_H);
              if (pointer.phase === 'down') {
                world.pressing = true;
                world.lastX = world.ex;
                world.lastY = world.ey;
              }
              if (pointer.phase === 'up') world.pressing = false;
            }}
            ariaLabel={`${stage.title}에서 개인정보를 문질러 가리는 놀이. 가린 정보 ${hud.covered}개, 남길 조건 ${needTotal}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
