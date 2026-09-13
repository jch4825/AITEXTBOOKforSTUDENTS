import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, CANVAS_FONT, GameCanvas, GameHud, STROKE, centerText, clamp, createRandom, drawBar, drawPop,
  drawShape, drawTag, paintBoard, shuffle, useGameKeys,
} from '../engine';
import type { ShapeKind } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m6-l10 · 세 줄 카드 맞추기 (장르 42 · 카드 짝맞추기)
 *
 * 카드가 세 줄로 놓이고, 직업 하나가 줄마다 한 장씩 들어 있다. 판을 열면 잠깐 다 보여 주고
 * 덮는다. 그 뒤 **윗줄에서 한 장, 가운데 줄에서 같은 직업, 아랫줄에서 같은 직업**을 차례로
 * 뒤집어 세 장을 모으면 직업 카드 하나가 완성된다.
 *
 * 줄을 내려가며 한 장씩 고르게 한 것은 조작을 한 가지로 좁히기 위해서다. 아무 두 장이나 뒤집는
 * 판은 "지금 몇 장째인지"를 머리에 들고 있어야 하는데, 여기서는 불이 들어온 줄이 곧 차례다.
 * 틀린 카드만 다시 덮이고 이미 맞춘 윗줄 카드는 그대로 남아, 무엇을 찾는 중인지가 판에 보인다.
 *
 * 차시와의 연결은 소재 수준이다. 한 직업을 AI 예상·자료·직업인 이야기로 세 번 확인하는 차시라
 * 줄 이름을 예상·자료·만남으로 붙였다. 카드 앞면은 줄마다 같다 — 줄마다 다른 글을 적으면
 * 기억 놀이가 아니라 읽기 시험이 된다(m3-l8에서 겪은 일이다).
 *
 * 같은 장르를 쓰는 m3-l8(같은 그림 카드)과 조작이 다르다. m3-l8은 그림 카드 두 장을 아무 데서나
 * 뒤집는 판이다. 여기는 세 장을 줄 순서대로 모으고, 맞춘 카드가 사슬처럼 남는다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

interface JobSpec {
  name: string;
  shape: ShapeKind;
  tone: 'yellow' | 'blue';
}

const JOBS: Record<string, JobSpec> = {
  cook: { name: '요리사', shape: 'semicircle', tone: 'yellow' },
  nurse: { name: '간호사', shape: 'cross', tone: 'blue' },
  librarian: { name: '사서', shape: 'square', tone: 'blue' },
  firefighter: { name: '소방관', shape: 'diamond', tone: 'yellow' },
  baker: { name: '제빵사', shape: 'ring', tone: 'blue' },
  courier: { name: '택배 기사', shape: 'quarter', tone: 'yellow' },
};

const ROW_NAMES = ['예상', '자료', '만남'];

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  jobs: string[];
  /** 지원 수준 '중학'에서의 헛짚기 허용 수. 지원 수준의 기회 수만큼 더하고 뺀다. */
  misses: number;
  /** 처음에 다 보여 주는 시간(초) */
  preview: number;
}

/*
 * 헛짚기 허용 수는 시뮬레이션으로 정했다. 뒤집은 카드를 모두 기억하는 학생은 세 종류 판에서
 * 3번, 네 종류에서 5번, 다섯 종류에서 6번 안에 열 판 중 여덟 판을 끝낸다. 전혀 기억하지 않고
 * 찍으면 평균 6·12·20번을 헛짚는다. 허용 수는 그 사이에 둔다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'three',
    label: '기본',
    spoken: '윗줄부터 한 장씩, 같은 직업 카드를 찾아요.',
    jobs: ['cook', 'nurse', 'librarian'],
    misses: 4,
    preview: 4,
  },
  {
    id: 'four',
    label: '1단계',
    spoken: '직업이 네 가지예요. 뒤집었던 자리를 기억해요.',
    jobs: ['baker', 'firefighter', 'courier', 'librarian'],
    misses: 6,
    preview: 5,
  },
  {
    id: 'five',
    label: '2단계',
    spoken: '직업이 다섯 가지예요. 윗줄에서 아는 카드부터 골라요.',
    jobs: ['cook', 'nurse', 'firefighter', 'courier', 'baker'],
    misses: 8,
    preview: 6,
  },
];

const ROW_Y = [70, 222, 374];
const CARD_H = 132;
const AREA_L = 150;
const AREA_R = 910;
const GAP = 16;

interface Card {
  row: number;
  col: number;
  job: string;
  x: number;
  y: number;
  w: number;
  h: number;
  up: boolean;
  done: boolean;
  /** 0 = 덮임, 1 = 펼침. up을 향해 조금씩 돈다. */
  turn: number;
  /** 틀려서 붉게 보여 주는 남은 시간. 끝나면 덮는다. */
  wrong: number;
}

interface World {
  cards: Card[];
  chain: number[];
  lives: number;
  phase: 'preview' | 'play';
  preview: number;
  lock: number;
  cursor: number;
  sets: number;
  missesThisSet: number;
  pops: Array<{ text: string; x: number; y: number; t: number; hint: boolean }>;
  finished: boolean;
}

const POP_TIME = 0.9;
const TURN_SPEED = 7;
const WRONG_SHOW = 0.9;

function buildCards(stage: StageConfig, seed: number): Card[] {
  const random = createRandom(seed);
  const n = stage.jobs.length;
  const w = Math.min(150, (AREA_R - AREA_L - GAP * (n - 1)) / n);
  const left = AREA_L + (AREA_R - AREA_L - (w * n + GAP * (n - 1))) / 2;
  const cards: Card[] = [];
  ROW_Y.forEach((y, row) => {
    shuffle(random, stage.jobs).forEach((job, col) => {
      cards.push({
        row, col, job, x: left + col * (w + GAP), y, w, h: CARD_H, up: true, done: false, turn: 1, wrong: 0,
      });
    });
  });
  return cards;
}

export default function JobCompareCardGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 헛짚기 허용 수와 미리 보는 시간으로 나타난다. 카드의 수와 줄은 셋 모두 같다. */
  const maxLives = Math.max(2, stage.misses + tuning.lives - 3);
  const previewTime = stage.preview * clamp(tuning.time, 0.8, 1.5);
  const total = stage.jobs.length;

  const keys = useGameKeys(game.playing);

  const fresh = (): World => ({
    cards: buildCards(stage, game.seed),
    chain: [],
    lives: maxLives,
    phase: 'preview',
    preview: previewTime,
    lock: 0,
    cursor: 0,
    sets: 0,
    missesThisSet: 0,
    pops: [],
    finished: false,
  });

  const worldRef = useRef<World>(fresh());
  const [view, setView] = useState({ sets: 0, lives: maxLives, row: 0, preview: true, chain: '' });

  const sync = (w: World) => {
    const chain = w.chain.map((i) => JOBS[w.cards[i].job].name).join(', ');
    setView({ sets: w.sets, lives: w.lives, row: w.chain.length, preview: w.phase === 'preview', chain });
  };

  useEffect(() => {
    const w = fresh();
    worldRef.current = w;
    sync(w);
  }, [game.round, game.stageIndex, stage, game.seed, maxLives, previewTime]);

  const flip = (w: World, index: number) => {
    const card = w.cards[index];
    const row = w.chain.length;
    if (card.row !== row) {
      const nearTop = card.y < 120;
      w.pops.push({ text: `지금은 ${row + 1}줄이에요`, x: card.x + card.w / 2, y: nearTop ? card.y + card.h + 10 : card.y - 8, t: POP_TIME, hint: true });
      return;
    }
    card.up = true;
    w.cursor = card.col;
    if (row === 0) {
      w.chain = [index];
      playSound('select');
    } else if (card.job === w.cards[w.chain[0]].job) {
      w.chain = [...w.chain, index];
      playSound('fill');
      if (w.chain.length === 3) {
        w.chain.forEach((i) => { w.cards[i].done = true; });
        w.sets += 1;
        w.pops.push({
          text: w.missesThisSet === 0 ? '한 번에 완성!' : `${JOBS[card.job].name} 완성!`,
          x: card.x + card.w / 2, y: card.y - 8, t: POP_TIME, hint: false,
        });
        playSound('stamp');
        w.chain = [];
        w.missesThisSet = 0;
        if (w.sets >= total) {
          w.finished = true;
          game.succeed('세 줄에서 같은 직업 카드를 모두 찾아 직업 카드를 완성했어요!');
        }
      }
    } else {
      card.wrong = WRONG_SHOW;
      w.lock = WRONG_SHOW;
      w.lives -= 1;
      w.missesThisSet += 1;
      playSound('select');
    }
    sync(w);
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    if (dt > 0 && game.playing && !w.finished) {
      if (w.phase === 'preview') {
        w.preview -= dt;
        if (w.preview <= 0) {
          w.phase = 'play';
          w.cards.forEach((card) => { card.up = false; });
          sync(w);
        }
      } else {
        if (w.lock > 0) w.lock = Math.max(0, w.lock - dt);
        const row = w.chain.length;
        const inRow = w.cards.filter((c) => c.row === row && !c.done && !c.up);
        if (w.lock <= 0 && inRow.length > 0) {
          const cols = inRow.map((c) => c.col).sort((a, b) => a - b);
          if (!cols.includes(w.cursor)) w.cursor = cols[0];
          const at = cols.indexOf(w.cursor);
          if (keys.consumePress('left')) w.cursor = cols[Math.max(0, at - 1)];
          if (keys.consumePress('right')) w.cursor = cols[Math.min(cols.length - 1, at + 1)];
          if (keys.consumePress('action')) {
            const index = w.cards.findIndex((c) => c.row === row && c.col === w.cursor);
            if (index >= 0) flip(w, index);
          }
        }
      }
      for (const card of w.cards) {
        if (card.wrong > 0) {
          card.wrong -= dt;
          if (card.wrong <= 0) { card.wrong = 0; card.up = false; }
        }
        const goal = card.up ? 1 : 0;
        card.turn = card.turn < goal ? Math.min(goal, card.turn + TURN_SPEED * dt) : Math.max(goal, card.turn - TURN_SPEED * dt);
      }
      w.pops = w.pops.filter((pop) => { pop.t -= dt; return pop.t > 0; });
      if (w.lives <= 0 && w.lock <= 0) {
        w.finished = true;
        game.fail('헛짚은 카드가 너무 많아요. 뒤집었던 카드의 자리를 기억해 봐요.');
      }
    }

    paintBoard(ctx, WORLD_W, WORLD_H);
    const activeRow = w.phase === 'play' ? w.chain.length : -1;

    // 줄 이름 — 차례인 줄은 노랑으로 켠다.
    ROW_Y.forEach((y, row) => {
      const active = row === activeRow;
      drawBar(ctx, 40, y + 16, 88, CARD_H - 32, {
        fill: active ? B.yellow : B.surface, stroke: active ? B.shadow : B.line, width: 2, lift: 3,
      });
      ctx.font = `700 34px ${CANVAS_FONT}`;
      ctx.fillStyle = active ? B.ground : B.grey;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(row + 1), 84, y + CARD_H / 2 - 14);
      centerText(ctx, ROW_NAMES[row], 84, y + CARD_H / 2 + 20, 20, active ? B.ground : B.grey);
    });

    // 카드
    for (let i = 0; i < w.cards.length; i += 1) {
      const card = w.cards[i];
      const job = JOBS[card.job];
      const cx = card.x + card.w / 2;
      const cy = card.y + card.h / 2;
      const face = card.turn > 0.5;
      const squash = Math.max(0.04, Math.abs(card.turn * 2 - 1));
      const inChain = w.chain.includes(i);
      const pickable = activeRow === card.row && !card.up && !card.done && w.lock <= 0;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(squash, 1);
      ctx.translate(-cx, -cy);
      if (face) {
        const fill = card.done ? (job.tone === 'blue' ? B.blue : B.yellow) : B.surface;
        const stroke = card.wrong > 0 ? B.red : inChain ? B.yellow : B.line;
        drawBar(ctx, card.x, card.y, card.w, card.h, {
          fill, stroke, width: card.wrong > 0 || inChain ? STROKE.base : STROKE.hair, lift: card.done ? 2 : 5,
        });
        const iconFill = card.done ? B.ground : job.tone === 'blue' ? B.blue : B.yellow;
        drawShape(ctx, job.shape, cx, card.y + 52, 50, { fill: iconFill, stroke: B.keyline, width: 2 });
        const ink = card.done ? (job.tone === 'blue' ? B.ink : B.ground) : B.ink;
        centerText(ctx, job.name, cx, card.y + card.h - 26, 20, ink);
      } else {
        drawBar(ctx, card.x, card.y, card.w, card.h, {
          fill: B.high, stroke: pickable ? B.grey : B.line, width: STROKE.hair, lift: 5,
        });
        /* 뒷면 무늬. 칸마다 같은 모양이라 뒷면으로는 아무것도 알 수 없다. */
        drawShape(ctx, 'quarter', cx - 12, cy - 12, 28, { fill: B.line });
        drawShape(ctx, 'quarter', cx + 12, cy + 12, 28, { fill: B.line, rotate: Math.PI });
      }
      ctx.restore();

      if (pickable && card.col === w.cursor && card.turn < 0.05) {
        // 방향키 자리 표시 — 카드 아래 노랑 막대
        drawBar(ctx, card.x + 12, card.y + card.h + 6, card.w - 24, 6, { fill: B.yellow });
      }
    }

    // 위 띠 — 지금 할 일
    if (w.phase === 'preview') {
      drawTag(ctx, `잘 봐 두세요 · ${Math.ceil(Math.max(0, w.preview))}`, WORLD_W / 2, 34, { align: 'center' });
    } else if (!w.finished) {
      const lead = w.chain.length > 0 ? JOBS[w.cards[w.chain[0]].job].name : '';
      const text = w.chain.length === 0 ? '1줄에서 한 장을 뒤집어요' : `${w.chain.length + 1}줄에서 ${lead} 카드를 찾아요`;
      drawTag(ctx, text, WORLD_W / 2, 34, { fill: B.surface, ink: B.ink, align: 'center' });
    }

    for (const pop of w.pops) {
      const grow = Math.min(1, (POP_TIME - pop.t) * 8);
      drawPop(ctx, pop.text, clamp(pop.x, 140, 820), pop.y, {
        scale: 0.8 + grow * 0.2, size: pop.hint ? 22 : 28,
        fill: pop.hint ? B.surface : B.yellow, ink: pop.hint ? B.ink : B.ground,
      });
    }
  };

  const handleTap = (x: number, y: number) => {
    const w = worldRef.current;
    if (!game.playing || w.finished || w.phase !== 'play' || w.lock > 0) return;
    const index = w.cards.findIndex((c) => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);
    if (index < 0) return;
    const card = w.cards[index];
    if (card.up || card.done) return;
    flip(w, index);
  };

  return (
    <MiniGameFrame
      badge="세 줄 카드 맞추기"
      instruction="처음에 보여 주는 카드를 잘 봐 두세요. 불이 들어온 줄에서 한 장씩, 윗줄과 같은 직업 카드를 뒤집어 세 장을 모으면 직업 카드가 완성됩니다."
      progress={{ label: '완성한 직업', value: view.sets, max: total }}
      hud={<GameHud lives={view.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="px-1 text-[15px] font-bold" style={{ color: 'var(--game-ink)' }}>
          한 직업을 예상·자료·만남으로 세 번 확인하듯, 세 줄에서 같은 직업을 찾아요. 틀린 카드만 다시 덮여요.
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
            ariaLabel={view.preview
              ? `세 줄 카드 맞추기 놀이. 카드를 기억하는 시간입니다. 남은 기회 ${view.lives}개.`
              : `세 줄 카드 맞추기 놀이. 지금은 ${view.row + 1}줄 차례. ${view.chain ? `뒤집어 둔 카드는 ${view.chain}. ` : ''}완성한 직업 ${view.sets}개, 남은 기회 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
