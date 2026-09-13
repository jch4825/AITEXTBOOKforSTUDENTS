import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, createRandom, drawBar, drawPanel, drawPop,
  drawShape, drawTag, paintBoard, shuffle,
} from '../engine';
import type { ShapeKind } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m6-l5 · 가로세로 준비물 (장르 43 · 가로세로 낱말 퍼즐)
 *
 * 가로줄은 날씨, 세로줄은 가는 곳이다. 준비물 딱지 하나가 나오면 그 딱지에 그려진 두
 * 기호 — 왼쪽은 줄(날씨), 오른쪽은 칸(장소) — 가 만나는 자리를 누른다. 한 줄이나 한 칸이
 * 다 차면 머리가 켜지며 "한 줄!"이 튀어나온다. 빙고를 채우는 맛이 이 판의 재미다.
 *
 * **글을 못 읽어도 기호로 맞춘다.** 딱지의 두 기호와 줄·칸 머리의 기호가 같은 모양·같은
 * 색이다. 준비물 이름은 차시와 잇는 소재일 뿐, 판을 푸는 열쇠는 모양이다.
 *
 * 누르기 하나로 끝난다. 딱지를 끌어다 놓게 하면 잡은 것을 손에 들고 있어야 하고, 놓을
 * 자리를 놓치면 처음부터 다시 잡아야 한다.
 *
 * 같은 장르를 쓰는 m4-l7(가로세로 낱말)과 조작이 다르다. m4-l7은 글자를 끌어 가로·세로
 * 낱말을 만드는 판이라 철자를 읽고 조합하는 손이다. 여기는 글자를 만들지 않고, 두 줄이
 * 만나는 칸을 찾아 누르는 좌표 찾기다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

/** 줄(날씨) 기호는 노랑, 칸(장소) 기호는 파랑. 모양과 색, 딱지 안의 왼쪽·오른쪽 자리가
    함께 축을 가른다 — 색을 못 가려도 자리와 모양으로 읽는다. */
const ROW_SHAPES: ShapeKind[] = ['ring', 'semicircle', 'cross', 'diamond'];
const COL_SHAPES: ShapeKind[] = ['bar', 'quarter', 'ring', 'semicircle'];
const ROW_TONE = B.yellow;
const COL_TONE = B.blue;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  rows: string[];
  cols: string[];
  /** items[row][col] — 그 자리에 들어갈 준비물 */
  items: string[][];
}

/*
 * 판 셋은 조작이 같고 크기가 다르다. 3x3에서 3x4, 4x4로 넓혀 가며 찾을 칸이 늘어난다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'three',
    label: '기본',
    scene: '소풍 준비',
    spoken: '딱지의 두 기호가 만나는 칸을 눌러요.',
    rows: ['비', '해', '추위'],
    cols: ['운동장', '정류장', '교실'],
    items: [
      ['비옷', '우산', '마른 양말'],
      ['물병', '모자', '부채'],
      ['장갑', '목도리', '담요'],
    ],
  },
  {
    id: 'wide',
    label: '1단계',
    scene: '체험 학습 준비',
    spoken: '딱지의 두 기호가 만나는 칸을 눌러요.',
    rows: ['비', '해', '바람'],
    cols: ['운동장', '정류장', '교실', '바닷가'],
    items: [
      ['비옷', '우산', '마른 양말', '장화'],
      ['물병', '모자', '부채', '선크림'],
      ['바람막이', '머리끈', '누름돌', '모래 안경'],
    ],
  },
  {
    id: 'full',
    label: '2단계',
    scene: '일주일 준비',
    spoken: '딱지의 두 기호가 만나는 칸을 눌러요.',
    rows: ['비', '해', '추위', '바람'],
    cols: ['운동장', '정류장', '교실', '바닷가'],
    items: [
      ['비옷', '우산', '마른 양말', '장화'],
      ['물병', '모자', '부채', '선크림'],
      ['장갑', '목도리', '담요', '두꺼운 옷'],
      ['바람막이', '머리끈', '누름돌', '모래 안경'],
    ],
  },
];

const GRID_X = 196;
const GRID_Y = 104;
const GRID_W = 470;
const GRID_H = 404;
const HEADER_W = 170;
const HEADER_H = 78;

interface Pick {
  row: number;
  col: number;
}

interface World {
  queue: Pick[];
  filled: boolean[][];
  lives: number;
  finished: boolean;
  flash: { row: number; col: number; t: number } | null;
  /** 막 다 찬 줄과 칸. 머리를 잠깐 켠다. */
  lit: { rows: number[]; cols: number[]; t: number };
  pop: { text: string; x: number; y: number; t: number } | null;
}

const POP_TIME = 0.7;

function cellBox(stage: StageConfig, row: number, col: number) {
  const w = GRID_W / stage.cols.length;
  const h = GRID_H / stage.rows.length;
  return { x: GRID_X + col * w, y: GRID_Y + row * h, w, h };
}

export default function WeatherCrossGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 기회 수로만 나타난다. 판의 크기와 준비물은 셋 모두 같다. */
  const maxLives = tuning.lives;
  const total = stage.rows.length * stage.cols.length;

  const build = (): World => {
    const picks: Pick[] = [];
    stage.rows.forEach((_, row) => stage.cols.forEach((__, col) => picks.push({ row, col })));
    return {
      queue: shuffle(createRandom(game.seed), picks),
      filled: stage.rows.map(() => stage.cols.map(() => false)),
      lives: maxLives,
      finished: false,
      flash: null,
      lit: { rows: [], cols: [], t: 0 },
      pop: null,
    };
  };

  const worldRef = useRef<World>(build());
  const [view, setView] = useState({ done: 0, lives: maxLives, item: '' });

  useEffect(() => {
    const w = build();
    worldRef.current = w;
    const first = w.queue[0];
    setView({ done: 0, lives: maxLives, item: first ? stage.items[first.row][first.col] : '' });
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  const tapCell = (row: number, col: number) => {
    const w = worldRef.current;
    if (!game.playing || w.finished || w.filled[row][col]) return;
    const current = w.queue[0];
    if (!current) return;
    const box = cellBox(stage, row, col);

    if (current.row === row && current.col === col) {
      w.filled[row][col] = true;
      w.queue = w.queue.slice(1);
      playSound('fill');
      const rowDone = w.filled[row].every(Boolean);
      const colDone = w.filled.every((line) => line[col]);
      if (rowDone || colDone) {
        w.lit = { rows: rowDone ? [row] : [], cols: colDone ? [col] : [], t: 0.9 };
        w.pop = { text: rowDone && colDone ? '두 줄!' : '한 줄!', x: box.x + box.w / 2, y: box.y + box.h / 2, t: POP_TIME };
        playSound('stamp');
      } else {
        w.pop = { text: '딱!', x: box.x + box.w / 2, y: box.y + box.h / 2, t: POP_TIME * 0.7 };
      }
      if (w.queue.length === 0) {
        w.finished = true;
        game.succeed('날씨와 장소가 만나는 칸마다 알맞은 준비물을 모두 넣었어요!');
      }
    } else {
      w.lives -= 1;
      w.flash = { row, col, t: 0.6 };
      if (w.lives <= 0) {
        w.finished = true;
        game.fail('칸이 자꾸 어긋났어요. 딱지의 왼쪽 기호는 줄, 오른쪽 기호는 칸이에요.');
      }
    }
    const next = w.queue[0];
    setView({ done: total - w.queue.length, lives: w.lives, item: next ? stage.items[next.row][next.col] : '' });
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    if (dt > 0) {
      if (w.flash) { w.flash.t -= dt; if (w.flash.t <= 0) w.flash = null; }
      if (w.lit.t > 0) w.lit.t = Math.max(0, w.lit.t - dt);
      if (w.pop) { w.pop.t -= dt; if (w.pop.t <= 0) w.pop = null; }
    }

    paintBoard(ctx, WORLD_W, WORLD_H);

    // 칸 머리 — 장소. 파랑 기호.
    for (let col = 0; col < stage.cols.length; col += 1) {
      const box = cellBox(stage, 0, col);
      const lit = w.lit.t > 0 && w.lit.cols.includes(col);
      drawBar(ctx, box.x + 4, GRID_Y - HEADER_H - 6, box.w - 8, HEADER_H, {
        fill: lit ? COL_TONE : B.surface, stroke: B.line, width: STROKE.hair, lift: 3,
      });
      drawShape(ctx, COL_SHAPES[col], box.x + box.w / 2, GRID_Y - HEADER_H + 18, 24, {
        fill: lit ? B.ink : COL_TONE, stroke: B.keyline, width: 1,
      });
      centerText(ctx, stage.cols[col], box.x + box.w / 2, GRID_Y - 34, 20, B.ink);
    }

    // 줄 머리 — 날씨. 노랑 기호.
    for (let row = 0; row < stage.rows.length; row += 1) {
      const box = cellBox(stage, row, 0);
      const lit = w.lit.t > 0 && w.lit.rows.includes(row);
      drawBar(ctx, GRID_X - HEADER_W - 6, box.y + 4, HEADER_W, box.h - 8, {
        fill: lit ? ROW_TONE : B.surface, stroke: B.line, width: STROKE.hair, lift: 3,
      });
      drawShape(ctx, ROW_SHAPES[row], GRID_X - HEADER_W + 30, box.y + box.h / 2, 26, {
        fill: lit ? B.ground : ROW_TONE, stroke: B.keyline, width: 1,
      });
      centerText(ctx, stage.rows[row], GRID_X - HEADER_W / 2 + 14, box.y + box.h / 2, 24, lit ? B.ground : B.ink);
    }

    // 칸
    const current = w.queue[0];
    for (let row = 0; row < stage.rows.length; row += 1) {
      for (let col = 0; col < stage.cols.length; col += 1) {
        const box = cellBox(stage, row, col);
        const wrong = w.flash && w.flash.row === row && w.flash.col === col;
        if (w.filled[row][col]) {
          drawBar(ctx, box.x + 6, box.y + 6, box.w - 12, box.h - 12, {
            fill: B.blue, stroke: B.keyline, width: 2, lift: 4,
          });
          centerText(ctx, stage.items[row][col], box.x + box.w / 2, box.y + box.h / 2, 21, B.ink);
        } else {
          ctx.save();
          ctx.setLineDash([8, 6]);
          drawBar(ctx, box.x + 6, box.y + 6, box.w - 12, box.h - 12, {
            stroke: wrong ? B.red : B.line, width: wrong ? STROKE.base : 2,
          });
          ctx.restore();
          if (wrong) centerText(ctx, '여기가 아니에요', box.x + box.w / 2, box.y + box.h / 2, 20, B.redInk);
        }
      }
    }

    // 오른쪽 패널 — 지금 넣을 딱지
    drawPanel(ctx, 700, 26, 236, 300, { header: '지금 넣을 준비물', accent: B.yellow });
    if (current) {
      drawBar(ctx, 722, 86, 192, 150, { fill: B.yellow, stroke: B.shadow, width: 2, lift: 5 });
      centerText(ctx, stage.items[current.row][current.col], 818, 120, 28, B.ground);
      // 왼쪽 = 줄(날씨), 오른쪽 = 칸(장소)
      drawBar(ctx, 740, 150, 72, 70, { fill: B.ground, stroke: B.shadow, width: 2 });
      drawShape(ctx, ROW_SHAPES[current.row], 776, 185, 34, { fill: ROW_TONE, stroke: B.keyline, width: 1 });
      drawBar(ctx, 824, 150, 72, 70, { fill: B.ground, stroke: B.shadow, width: 2 });
      drawShape(ctx, COL_SHAPES[current.col], 860, 185, 34, { fill: COL_TONE, stroke: B.keyline, width: 1 });
      centerText(ctx, '줄', 776, 256, 20, B.grey);
      centerText(ctx, '칸', 860, 256, 20, B.grey);
      centerText(ctx, `남은 딱지 ${w.queue.length}장`, 818, 300, 20, B.grey);
    } else {
      centerText(ctx, '다 넣었어요', 818, 170, 26, B.ink);
    }
    drawTag(ctx, stage.scene, 818, 360, { fill: B.surface, ink: B.grey, align: 'center' });

    if (w.pop) {
      const grow = Math.min(1, (POP_TIME - Math.min(POP_TIME, w.pop.t)) * 8);
      drawPop(ctx, w.pop.text, w.pop.x, w.pop.y - 36, { scale: 0.8 + grow * 0.2 });
    }
  };

  const handleTap = (x: number, y: number) => {
    for (let row = 0; row < stage.rows.length; row += 1) {
      for (let col = 0; col < stage.cols.length; col += 1) {
        const box = cellBox(stage, row, col);
        if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
          tapCell(row, col);
          return;
        }
      }
    }
  };

  return (
    <MiniGameFrame
      badge="가로세로 준비물"
      instruction="오른쪽 딱지의 두 기호를 보세요. 왼쪽 기호는 가로줄(날씨), 오른쪽 기호는 세로줄(장소)입니다. 두 줄이 만나는 칸을 누르면 준비물이 들어갑니다."
      progress={{ label: '넣은 칸', value: view.done, max: total }}
      hud={<GameHud lives={view.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="px-1 text-[15px] font-bold" style={{ color: 'var(--game-ink)' }}>
          {stage.scene} · 한 줄이 다 차면 줄 머리에 불이 들어와요.
        </p>
      }
      actions={<MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') handleTap(pointer.x, pointer.y);
            }}
            ariaLabel={`날씨와 장소가 만나는 칸에 준비물을 넣는 놀이. 지금 준비물은 "${view.item || '없음'}". 넣은 칸 ${view.done}개, 남은 기회 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
