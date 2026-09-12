import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, createRandom, drawBar, drawMark,
  drawShape, useGameKeys,
} from '../engine';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m6-l6 · 위험 단계 깨기 (장르 26 · 벽돌깨기)
 *
 * 아이미의 조리 초안이 아래에서 위로 네 층 벽으로 서 있다. 빨강 삼각(위험 단계·알레르기
 * 재료)을 깨면 그 자리에 파랑 사각(대체 단계)이 내려와 메운다. 초안 고치기는 빼고 그 자리에
 * 바꿔 넣는 일이라, 벽의 모양이 그대로 결과물이 되게 했다. 무엇이 빠지고 무엇이 들어왔는지가
 * 글이 아니라 그림으로 남는다.
 *
 * 같은 장르를 쓰는 m3-l3(어려운 말 벽 깨기)과 조작이 다른 자리는 셋이다.
 *  - m3-l3은 깬 자리가 빈칸으로 남고 "안 치는 것"이 실력이다. 여기서는 깬 자리가 대체
 *    단계로 채워지고, 네 층이 모두 안전한 단계로 차야 이긴다.
 *  - 층이 조리 순서를 맡는다. 공은 남은 층 가운데 늘 맨 아래를 때리므로 아래층부터 손대게
 *    되고, 그래서 순서 재구성이 승리 조건 안으로 들어온다.
 *  - 칼을 쓰는 층은 [어른 부르기]를 누르기 전에는 공이 튕겨 나온다. 성인 도움이 한 번 하고
 *    마는 절차가 아니라 층을 여는 규칙이 된다.
 *
 * 겨냥과 순서가 한 판에 겹치면 무거워서 조준은 통째로 덜어 냈다. 공은 받침대 한가운데에서
 * 곧장 위로만 날아가고, 받침대가 선 칸이 곧 겨눈 칸이다. 학생이 하는 일은 "어느 칸 아래에
 * 설까"와 "돌아오는 공을 받아 내기" 둘뿐이다. 각도를 맞춰야 이기는 판이면 무엇을 빼고
 * 무엇을 넣을지 고르는 학습이 손끝 정확도에 가린다.
 *
 * 안전한 단계(파랑)는 잘못 맞아도 금만 가고 깨지지 않으며, 그때 기회도 잃지 않는다. 손 씻기나
 * 어른 도움을 사고로 잃는 판이면 안전이 운에 걸린다. 기회는 공을 놓칠 때만 준다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const ROW_COUNT = 4;
const COL_COUNT = 3;

/* 왼쪽에는 층 번호 칩, 오른쪽에는 조리 판. 칩을 판 밖에 두면 공이 다니는 자리와
   읽는 자리가 갈려 층 번호를 찾을 때 판을 훑지 않아도 된다. */
const CHIP_X = 24;
const CHIP_W = 142;
const CELL_X = 186;
const CELL_W = 244;
const CELL_GAP = 8;
const PITCH = CELL_W + CELL_GAP;
/* 판의 좌우 끝은 칸 셋을 빈틈없이 나눈 폭이다. 칸 사이 틈에도 주인을 두어야
   곧장 위로 쏜 공이 "아무것도 안 맞는" 일이 생기지 않는다. */
const FIELD_L = CELL_X - CELL_GAP / 2;
const FIELD_R = FIELD_L + PITCH * COL_COUNT;

const WALL_TOP = 70;
const ROW_H = 64;
const ROW_GAP = 8;
const DONE_H = 26;
const LOCK_H = 14;
const PADDLE_Y = 478;
const PADDLE_H = 18;
const BALL_R = 13;
const BALL_REST_Y = 452;

/** 층 0이 맨 아래(첫 단계)다. 화면에서는 위아래를 뒤집어 그린다. */
const rowTop = (index: number) => WALL_TOP + (ROW_COUNT - 1 - index) * (ROW_H + ROW_GAP);
const cellLeft = (col: number) => CELL_X + col * PITCH;
const colAt = (x: number) => clamp(Math.floor((x - FIELD_L) / PITCH), 0, COL_COUNT - 1);

interface CellSpec {
  risky: boolean;
  label: string;
  /** 위험 단계를 깼을 때 그 자리를 메우는 안전한 단계 */
  replacement: string;
}

interface RowSpec {
  /** 조리 순서에서 이 층이 맡는 일 */
  step: string;
  /** 칼·불처럼 어른이 함께해야 여는 층 */
  needsAdult: boolean;
  cells: CellSpec[];
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  dish: string;
  /** rows[0]이 맨 아래 층이자 첫 단계다. */
  rows: RowSpec[];
}

const safeStep = (label: string): CellSpec => ({ risky: false, label, replacement: label });
const riskyStep = (label: string, replacement: string): CellSpec => ({
  risky: true, label, replacement,
});

/*
 * 판 셋은 조작이 같고 요리가 다르다. 기본은 차시 이야기의 과일 요거트 컵이고, 1단계는
 * 칼과 가위가 둘 다 걸리는 샌드위치, 2단계는 끓는 물과 불이 걸리는 따뜻한 음료다.
 * 위험의 종류가 도구에서 열로 옮겨 가므로 같은 판정을 새 상황에 다시 적용해 보게 된다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'yogurt',
    label: '기본',
    dish: '과일 요거트 컵',
    spoken: '과일 요거트 컵 초안에서 위험한 단계를 깨 봐요.',
    rows: [
      {
        step: '준비',
        needsAdult: false,
        cells: [
          safeStep('손 씻기'),
          riskyStep('그냥 시작하기', '알레르기 묻기'),
          safeStep('앞치마 입기'),
        ],
      },
      {
        step: '재료',
        needsAdult: false,
        cells: [
          safeStep('요거트 꺼내기'),
          riskyStep('키위 담기', '자른 사과 담기'),
          safeStep('그릇 꺼내기'),
        ],
      },
      {
        step: '손질',
        needsAdult: true,
        cells: [
          riskyStep('칼로 자르기', '미리 자른 과일'),
          safeStep('바나나 까기'),
          riskyStep('칼 혼자 꺼내기', '선생님께 부탁'),
        ],
      },
      {
        step: '담기',
        needsAdult: false,
        cells: [
          safeStep('컵에 담기'),
          riskyStep('먼저 맛보게 주기', '알레르기 묻고 주기'),
          safeStep('숟가락 놓기'),
        ],
      },
    ],
  },
  {
    id: 'sandwich',
    label: '1단계',
    dish: '채소 샌드위치',
    spoken: '채소 샌드위치 초안에서 위험한 단계를 깨 봐요.',
    rows: [
      {
        step: '준비',
        needsAdult: false,
        cells: [
          riskyStep('바로 만들기', '손 씻기'),
          safeStep('식판 닦기'),
          safeStep('장갑 끼기'),
        ],
      },
      {
        step: '재료',
        needsAdult: false,
        cells: [
          safeStep('빵 꺼내기'),
          riskyStep('땅콩 소스 바르기', '확인한 소스'),
          safeStep('상추 씻기'),
        ],
      },
      {
        step: '자르기',
        needsAdult: true,
        cells: [
          riskyStep('칼로 토마토 썰기', '미리 썬 토마토'),
          riskyStep('가위 혼자 쓰기', '선생님과 자르기'),
          safeStep('접시에 올리기'),
        ],
      },
      {
        step: '완성',
        needsAdult: false,
        cells: [
          safeStep('빵 덮기'),
          riskyStep('바로 나눠 주기', '알레르기 묻기'),
          safeStep('이름표 붙이기'),
        ],
      },
    ],
  },
  {
    id: 'cocoa',
    label: '2단계',
    dish: '따뜻한 코코아',
    spoken: '따뜻한 코코아 초안에서 위험한 단계를 깨 봐요.',
    rows: [
      {
        step: '준비',
        needsAdult: false,
        cells: [
          safeStep('손 씻기'),
          riskyStep('깨진 컵 쓰기', '성한 컵 고르기'),
          safeStep('받침 놓기'),
        ],
      },
      {
        step: '재료',
        needsAdult: false,
        cells: [
          riskyStep('우유 그냥 넣기', '우유 괜찮은지'),
          safeStep('코코아 담기'),
          safeStep('숟가락 준비'),
        ],
      },
      {
        step: '데우기',
        needsAdult: true,
        cells: [
          riskyStep('끓는 물 혼자', '선생님이 부어요'),
          riskyStep('불 혼자 켜기', '어른과 함께 켜기'),
          safeStep('컵 잡고 기다리기'),
        ],
      },
      {
        step: '마시기',
        needsAdult: false,
        cells: [
          safeStep('한 김 식히기'),
          riskyStep('뜨거울 때 마시기', '식은 뒤 마시기'),
          safeStep('앉아서 먹기'),
        ],
      },
    ],
  },
];

interface Cell extends CellSpec {
  broken: boolean;
  /** 대체 단계가 위에서 내려와 자리를 메우는 정도 0~1 */
  fill: number;
  cracks: number;
}

interface Row {
  step: string;
  needsAdult: boolean;
  opened: boolean;
  cells: Cell[];
}

interface World {
  rows: Row[];
  paddle: number;
  bx: number;
  by: number;
  vx: number;
  vy: number;
  phase: 'ready' | 'play';
  armed: boolean;
  lives: number;
  /** 잠긴 층에 튕긴 뒤 안내를 띄워 두는 남은 시간 */
  blocked: number;
  /** 어른을 부른 직후 층이 열렸다고 알리는 남은 시간 */
  opened: number;
  finished: boolean;
}

const buildRows = (stage: StageConfig): Row[] => stage.rows.map((row) => ({
  step: row.step,
  needsAdult: row.needsAdult,
  opened: false,
  cells: row.cells.map((cell) => ({ ...cell, broken: false, fill: 0, cracks: 0 })),
}));

const rowDone = (row: Row) => row.cells.every((cell) => !cell.risky || cell.broken);
/** 남은 층 가운데 맨 아래. -1이면 네 층이 모두 안전한 단계로 찼다는 뜻이다. */
const activeIndex = (rows: Row[]) => rows.findIndex((row) => !rowDone(row));
const countFixed = (rows: Row[]) => rows.reduce(
  (sum, row) => sum + row.cells.filter((cell) => cell.risky && cell.broken).length, 0,
);

export default function CookStepBreakGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 공 속도·받침대 폭·받아 내는 여유로만 나타난다. 층과 칸은 셋 모두 같다. */
  const speed = 250 * clamp(tuning.speed, 0.65, 1.35);
  const paddleW = 196 * clamp(tuning.size, 0.78, 1.3);
  const catchPad = 12 * clamp(tuning.tolerance, 0.7, 1.8);
  const maxLives = tuning.lives;

  const riskyTotal = stage.rows.reduce(
    (sum, row) => sum + row.cells.filter((cell) => cell.risky).length, 0,
  );

  const worldRef = useRef<World>({
    rows: buildRows(stage),
    paddle: WORLD_W / 2,
    bx: WORLD_W / 2, by: BALL_REST_Y, vx: 0, vy: 0,
    phase: 'ready', armed: true, lives: maxLives, blocked: 0, opened: 0, finished: false,
  });
  /* 돌아오는 공이 옆으로 흩어지는 정도. 씨앗을 두면 같은 판의 같은 시도는 늘 같게 흩어져,
     학생이 "또 저기로 오겠구나"를 배울 수 있다. */
  const randomRef = useRef<() => number>(createRandom(game.seed));
  const pointerX = useRef<number | null>(null);
  const keys = useGameKeys(game.playing);

  const [view, setView] = useState({
    fixed: 0, lives: maxLives, row: 0, locked: false, ready: true,
  });

  useEffect(() => {
    worldRef.current = {
      rows: buildRows(stage),
      paddle: WORLD_W / 2,
      bx: WORLD_W / 2, by: BALL_REST_Y, vx: 0, vy: 0,
      phase: 'ready', armed: true, lives: maxLives, blocked: 0, opened: 0, finished: false,
    };
    randomRef.current = createRandom(game.seed);
    pointerX.current = null;
    setView({
      fixed: 0, lives: maxLives, row: 0, locked: stage.rows[0].needsAdult, ready: true,
    });
  }, [game.round, game.stageIndex, game.seed, stage, maxLives]);

  const launch = () => {
    const w = worldRef.current;
    if (w.finished || w.phase !== 'ready') return;
    w.phase = 'play';
    w.armed = false;
    w.bx = w.paddle;
    w.by = BALL_REST_Y;
    w.vx = 0;
    w.vy = -speed;
  };

  /* 벽돌이나 잠금 막대를 맞고 되돌아오는 길. 옆으로 흩어 놓아야 받침대를 옮겨 받는
     일이 조작이 된다. 곧장 제자리로 떨어지면 받침대는 놓아두기만 해도 된다. */
  const bounceDown = (w: World) => {
    const random = randomRef.current;
    w.vy = speed;
    w.vx = (0.22 + random() * 0.5) * speed * (random() < 0.5 ? -1 : 1);
  };

  const callAdult = () => {
    const w = worldRef.current;
    const index = activeIndex(w.rows);
    if (index < 0) return;
    const row = w.rows[index];
    if (!row.needsAdult || row.opened) return;
    row.opened = true;
    w.opened = 1.6;
    w.blocked = 0;
    setView((prev) => ({ ...prev, locked: false }));
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && !w.finished) {
      const dir = (keys.held.current.left ? -1 : 0) + (keys.held.current.right ? 1 : 0);
      // 방향키를 잡는 순간 마우스 자리를 놓는다. 그러지 않으면 한 번 움직인 마우스가
      // 받침대를 붙잡고 있어 자판만 쓰는 학생이 판을 이어 갈 수 없다.
      if (dir !== 0) pointerX.current = null;
      if (pointerX.current !== null) w.paddle = pointerX.current;
      else w.paddle += dir * 520 * dt;
      w.paddle = clamp(w.paddle, FIELD_L + paddleW / 2, FIELD_R - paddleW / 2);

      if (w.blocked > 0) w.blocked -= dt;
      if (w.opened > 0) w.opened -= dt;
      for (const row of w.rows) {
        for (const cell of row.cells) {
          if (cell.broken && cell.fill < 1) cell.fill = Math.min(1, cell.fill + dt * 2.6);
        }
      }

      const shoot = keys.held.current.action || keys.held.current.up;
      if (w.phase === 'ready') {
        w.bx = w.paddle;
        w.by = BALL_REST_Y;
        if (!shoot) w.armed = true;
        if (shoot && w.armed) launch();
      } else {
        w.bx += w.vx * dt;
        w.by += w.vy * dt;

        if (w.bx < FIELD_L + BALL_R) { w.bx = FIELD_L + BALL_R; w.vx = Math.abs(w.vx); }
        if (w.bx > FIELD_R - BALL_R) { w.bx = FIELD_R - BALL_R; w.vx = -Math.abs(w.vx); }
        if (w.by < WALL_TOP - 26) { w.by = WALL_TOP - 26; w.vy = Math.abs(w.vy); }

        const index = activeIndex(w.rows);
        if (w.vy < 0 && index >= 0) {
          const row = w.rows[index];
          const top = rowTop(index);
          const barY = top + ROW_H + 4;
          if (row.needsAdult && !row.opened
            && w.by - BALL_R <= barY + LOCK_H && w.by + BALL_R >= barY) {
            // 어른을 부르기 전에는 층에 손댈 수 없다. 공이 막대에 맞고 되돌아온다.
            w.by = barY + LOCK_H + BALL_R;
            bounceDown(w);
            w.blocked = 2;
          } else if (w.by - BALL_R <= top + ROW_H && w.by + BALL_R >= top) {
            const cell = row.cells[colAt(w.bx)];
            if (cell.risky && !cell.broken) {
              cell.broken = true;
              cell.fill = 0;
            } else {
              // 안전한 단계는 금만 간다. 사고로 손 씻기나 어른 도움을 잃으면 안 된다.
              cell.cracks = Math.min(3, cell.cracks + 1);
            }
            w.by = top + ROW_H + BALL_R;
            bounceDown(w);
          }
        }

        // 받아 내면 다시 준비 상태로 돌아간다. 고르기 · 쏘기 · 받기가 한 번씩 도는
        // 박자를 만들어, 다음에 어느 칸을 칠지 고를 틈을 늘 남긴다.
        if (w.vy > 0 && w.by > PADDLE_Y - BALL_R && w.by < PADDLE_Y + PADDLE_H + BALL_R
          && w.bx > w.paddle - paddleW / 2 - catchPad
          && w.bx < w.paddle + paddleW / 2 + catchPad) {
          w.phase = 'ready';
          w.armed = false;
          w.vx = 0;
          w.vy = 0;
          w.bx = w.paddle;
          w.by = BALL_REST_Y;
        }

        if (w.by > WORLD_H + 24) {
          w.lives -= 1;
          w.phase = 'ready';
          w.armed = false;
          w.vx = 0;
          w.vy = 0;
        }
      }

      const fixed = countFixed(w.rows);
      const index = activeIndex(w.rows);
      const locked = index >= 0 && w.rows[index].needsAdult && !w.rows[index].opened;
      const row = index < 0 ? ROW_COUNT - 1 : index;
      if (fixed !== view.fixed || w.lives !== view.lives || row !== view.row
        || locked !== view.locked || (w.phase === 'ready') !== view.ready) {
        setView({ fixed, lives: w.lives, row, locked, ready: w.phase === 'ready' });
      }

      if (w.lives <= 0) {
        w.finished = true;
        game.fail('공을 모두 놓쳤어요. 받침대로 공을 받아 내면서 빨강 삼각을 깨 보세요.');
      } else if (index < 0) {
        w.finished = true;
        game.succeed('위험한 단계를 빼고 안전한 단계로 채웠어요. 아래에서 위로 순서가 맞아 요리 판이 완성되었어요!');
      }
    }

    const active = activeIndex(w.rows);
    const won = active < 0;

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    /* 조리 판의 양쪽 벽. 뜻이 없는 구조물이라 회색 막대다. */
    drawBar(ctx, FIELD_L - 8, WALL_TOP - 12, 8, WORLD_H - WALL_TOP + 12, { fill: B.grey });
    drawBar(ctx, FIELD_R, WALL_TOP - 12, 8, WORLD_H - WALL_TOP + 12, { fill: B.grey });

    /* 머리띠 — 지금 고치는 층이 어디인지 한 줄로 알린다. */
    const locked = !won && w.rows[active].needsAdult && !w.rows[active].opened;
    const bandStroke = won ? B.blue : (locked ? B.yellow : B.keyline);
    drawBar(ctx, CHIP_X, 12, WORLD_W - CHIP_X - 22, 44,
      { fill: B.ground, stroke: bandStroke, width: STROKE.base });
    if (won) {
      drawMark(ctx, 'check', CHIP_X + 30, 34, 22, B.blue);
      centerText(ctx, `${stage.dish} 요리 판 완성 — 네 층이 모두 안전한 단계입니다`,
        WORLD_W / 2, 34, 22, B.ink);
    } else if (locked) {
      drawMark(ctx, 'bang', CHIP_X + 30, 34, 22, B.yellow);
      centerText(ctx, '어른이 함께해야 여는 층입니다. 어른 부르기를 눌러 주세요',
        WORLD_W / 2, 34, 22, B.ink);
    } else {
      drawMark(ctx, 'arrow', CHIP_X + 30, 34, 22, B.yellow, -Math.PI / 2);
      centerText(ctx, `${stage.dish} · 지금 고치는 층은 ${active + 1}번 ${w.rows[active].step}입니다`,
        WORLD_W / 2, 34, 22, B.ink);
    }

    for (let i = 0; i < ROW_COUNT; i += 1) {
      const row = w.rows[i];
      const top = rowTop(i);
      const done = rowDone(row);
      const isActive = i === active;

      /* 층 번호 칩. 다 고친 층은 파랑 면으로 뒤집어 확인 표시를 얹는다. 성공을
         알리려고 다섯째 색을 들이지 않고 그 층 자신의 색으로 뒤집는다. */
      drawBar(ctx, CHIP_X, top, CHIP_W, ROW_H, {
        fill: done ? B.blue : B.surface,
        stroke: isActive ? B.yellow : B.keyline,
        width: isActive ? STROKE.heavy : STROKE.hair,
      });
      centerText(ctx, `${i + 1} ${row.step}`, CHIP_X + (CHIP_W - 30) / 2, top + ROW_H / 2, 22,
        done ? B.ground : B.ink);
      if (done) drawMark(ctx, 'check', CHIP_X + CHIP_W - 24, top + ROW_H / 2, 22, B.ground);

      /* 대체 단계가 위에서 내려오는 동안 윗 층을 덮지 않도록 층 칸 안으로 잘라 그린다. */
      ctx.save();
      ctx.beginPath();
      ctx.rect(FIELD_L, top - 4, FIELD_R - FIELD_L, ROW_H + 8);
      ctx.clip();

      for (let c = 0; c < COL_COUNT; c += 1) {
        const cell = row.cells[c];
        const x = cellLeft(c);
        /* 다 고친 층은 낮게 접어 공이 지나갈 길을 낸다. 그대로 세워 두면 이미 안전해진
           층이 다음 층을 막아 학생이 더 갈 데가 없어진다. */
        const h = done ? DONE_H : ROW_H;
        const y = done ? top + ROW_H - DONE_H : top;
        const textX = x + CELL_W / 2 + 14;
        const size = done ? 20 : 21;

        if (cell.broken) {
          const slide = (1 - cell.fill) * -(ROW_H + ROW_GAP);
          drawBar(ctx, x, y + slide, CELL_W, h,
            { fill: B.blue, stroke: B.keyline, width: STROKE.hair });
          drawShape(ctx, 'square', x + 28, y + slide + h / 2, 20, { fill: B.ground });
          centerText(ctx, cell.replacement, textX, y + slide + h / 2, size, B.ground);
        } else if (cell.risky) {
          // 위험은 빨강 삼각이다. 판 위에서 빨강과 파랑의 밝기는 거의 같아 색만으로는
          // 갈리지 않으므로, 뜻은 언제나 모양이 함께 진다.
          drawBar(ctx, x, y, CELL_W, h, { fill: B.surface, stroke: B.red, width: STROKE.base });
          drawShape(ctx, 'triangle', x + 28, y + h / 2, 24,
            { fill: B.red, stroke: B.red, width: STROKE.hair });
          centerText(ctx, cell.label, textX, y + h / 2, size, B.ink);
        } else {
          const cracked = cell.cracks > 0;
          drawBar(ctx, x, y, CELL_W, h, {
            fill: B.surface,
            stroke: cracked ? B.yellow : B.blue,
            width: cracked ? STROKE.base : STROKE.hair,
          });
          drawShape(ctx, 'square', x + 28, y + h / 2, 20, { fill: B.blue });
          centerText(ctx, cell.label, textX, y + h / 2, size, B.ink);
          if (!done) {
            for (let k = 0; k < cell.cracks; k += 1) {
              drawMark(ctx, 'cross', x + CELL_W - 22 - k * 22, y + h - 14, 14, B.yellow);
            }
          }
        }
      }
      ctx.restore();
    }

    if (!won) {
      const row = w.rows[active];
      const barY = rowTop(active) + ROW_H + 4;
      if (row.needsAdult && !row.opened) {
        /* 잠금 막대. 맞은 직후에는 면을 통째로 노랑으로 뒤집어 "여기서 막혔다"를 알린다. */
        const hit = w.blocked > 0;
        drawBar(ctx, FIELD_L, barY, FIELD_R - FIELD_L, LOCK_H,
          { fill: hit ? B.yellow : B.grey, stroke: B.keyline, width: STROKE.hair });
        drawMark(ctx, 'bang', FIELD_L + 28, barY + LOCK_H / 2, 14, hit ? B.ground : B.yellow);
        drawMark(ctx, 'bang', FIELD_R - 28, barY + LOCK_H / 2, 14, hit ? B.ground : B.yellow);
      } else if (row.needsAdult && w.opened > 0) {
        drawBar(ctx, FIELD_L, barY, FIELD_R - FIELD_L, LOCK_H,
          { fill: B.blue, stroke: B.keyline, width: STROKE.hair });
        drawMark(ctx, 'check', WORLD_W / 2, barY + LOCK_H / 2, 16, B.ground);
      }

      if (w.phase === 'ready' && !w.finished) {
        /* 겨눈 칸은 받침대가 선 자리로 정해진다. 공은 곧장 위로만 날아가므로 받침대를
           옮기는 것이 곧 고르는 일이고, 각도를 맞출 일이 없다. */
        const col = colAt(w.paddle);
        const top = rowTop(active);
        drawBar(ctx, cellLeft(col) - 6, top - 6, CELL_W + 12, ROW_H + 12,
          { stroke: B.yellow, width: STROKE.heavy });
        for (let y = top + ROW_H + 34; y < BALL_REST_Y - 24; y += 34) {
          drawMark(ctx, 'dot', w.paddle, y, 12, B.yellow);
        }
        drawMark(ctx, 'arrow', w.paddle, top + ROW_H + 30, 26, B.yellow, -Math.PI / 2);
      }
    }

    /* 받침대와 공은 둘 다 학생의 것이라 노랑이다. 뜻은 모양이 가른다 — 막대는 받는 것,
       원은 날아가는 것이다. */
    drawBar(ctx, w.paddle - paddleW / 2, PADDLE_Y, paddleW, PADDLE_H,
      { fill: B.yellow, stroke: B.keyline, width: STROKE.hair });
    drawShape(ctx, 'circle', w.bx, w.by, BALL_R * 2,
      { fill: B.yellow, stroke: B.keyline, width: STROKE.hair });

    if (w.phase === 'ready' && !w.finished && !won) {
      centerText(ctx, w.armed ? '받침대를 옮기고 스페이스를 누르세요' : '손을 떼었다가 다시 누르세요',
        WORLD_W / 2, WORLD_H - 20, 22, B.ink);
    }
  };

  const activeRow = stage.rows[Math.min(view.row, stage.rows.length - 1)];
  const footerText = game.status === 'success'
    ? `${stage.dish} 요리 판이 아래에서 위로 완성되었어요.`
    : (view.locked
      ? '칼과 불을 쓰는 층입니다. 어른 부르기를 먼저 눌러 주세요.'
      : `${view.row + 1}번 ${activeRow.step} 층을 고치는 중입니다. `
        + '빨강 삼각 아래에 받침대를 두고 공을 쏘세요.');

  return (
    <MiniGameFrame
      badge="위험 단계 깨기"
      instruction="아이미의 조리 초안이 네 층으로 서 있어요. 빨강 삼각(위험한 단계) 아래로 받침대를 옮겨 공을 쏘면, 그 자리에 파랑 사각(안전한 단계)이 내려와 메웁니다. 맨 아래 층부터 차례로 고쳐 보세요."
      progress={{ label: '안전해진 단계', value: view.fixed, max: riskyTotal }}
      hud={<GameHud lives={view.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={(
        <p className="px-1 text-[15px] font-bold leading-relaxed" style={{ color: 'var(--game-ink)' }}>
          {footerText}
        </p>
      )}
      actions={(
        <>
          <MiniGameButton
            onClick={callAdult}
            disabled={!view.locked || game.status !== 'playing'}
            mark="bang"
            label="어른 부르기"
            variant={view.locked ? 'primary' : 'quiet'}
          />
          <MiniGameButton
            onClick={launch}
            disabled={!view.ready || game.status !== 'playing'}
            mark="arrow"
            markRotate={-90}
            label="공 쏘기"
          />
          <MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" />
        </>
      )}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              pointerX.current = pointer.x;
              // 고치고 싶은 칸을 그냥 누르면 받침대가 그 아래로 가서 공을 쏜다.
              // 누르는 곳과 일어나는 일이 같은 자리라 설명이 한 단계 줄어든다.
              if (pointer.phase === 'down') {
                const w = worldRef.current;
                w.paddle = clamp(pointer.x, FIELD_L + paddleW / 2, FIELD_R - paddleW / 2);
                launch();
              }
              if (pointer.phase === 'up') {
                const w = worldRef.current;
                if (w.phase === 'ready') w.armed = true;
              }
            }}
            ariaLabel={`아이미의 조리 초안 네 층을 고치는 놀이. 안전해진 단계 ${view.fixed}개, 남은 기회 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
