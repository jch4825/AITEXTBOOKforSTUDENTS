import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, drawBar, drawMark, drawShape,
  particleFor, paintBoard,
} from '../engine';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m5-l2 · 큰 일 잘라 나누기 (장르 25 · 슬라이싱)
 *
 * 과제 분해는 큰 하나를 여럿으로 나누는 일 그 자체다. 그래서 "부스 설치"라는 한 덩어리를
 * 손끝으로 그어 조각내고, 잘린 조각이 완성 사진의 빈칸으로 날아가 앉는다.
 *
 * 목표가 조각 수라는 맨숫자가 아니라 **완성 사진의 빈칸**이라서 "완성 모습을 근거로"가
 * 규칙 안에 들어온다. 빈칸이 남으면 누락이고, 필요 없는 조각을 자르면 부스러기가 쌓여
 * 불필요·중복이 눈에 보인다. 점검 세 가지가 한 손동작에서 나온다.
 *
 * 필요 없는 조각은 자르지 않고 그냥 두면 된다. 무엇을 하지 않을지가 실력인 자리를 남겨
 * 두었다 — 할 일을 늘리는 것은 쉽고, 덜어 내는 것이 어렵다.
 *
 * 같은 장르를 쓰는 m2-l7(모호한 말 베기)과 조작이 다르다. m2-l7은 튀어 오르는 구름을
 * 베고 자물쇠는 지키는 판이라 벤 것이 사라진다. 여기서는 덩어리가 제자리에 서 있고, 벤
 * 것이 사라지지 않고 완성 사진의 빈칸으로 옮겨 간다. 베는 손이 지우는 손이 아니라
 * **옮기는 손**이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

/** 완성 사진의 빈칸. 다섯 칸이 다 차면 이긴다. */
const SLOT_COUNT = 5;
const SLOT_W = 168;
const SLOT_H = 74;
const slotBox = (index: number) => ({ x: 36 + index * 180, y: 34, w: SLOT_W, h: SLOT_H });

/** 잘라 낼 덩어리. 세 줄 세 칸으로 쌓아 둔다. */
const CHUNK_W = 210;
const CHUNK_H = 76;
const chunkBox = (index: number) => ({
  x: 138 + (index % 3) * 228,
  y: 168 + Math.floor(index / 3) * 92,
  w: CHUNK_W,
  h: CHUNK_H,
});

const BIN = { x: 700, y: 444, w: 224, h: 62 };

interface ChunkSpec {
  text: string;
  /** 채울 빈칸의 자리번호. -1이면 필요 없는 일이라 자르면 부스러기가 된다. */
  slot: number;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  /** 완성 사진의 빈칸 이름 다섯 */
  slots: string[];
  chunks: ChunkSpec[];
}

/*
 * 판 셋은 조작이 같고 큰 일이 다르다. 세우는 일, 여는 일, 걷는 일로 옮겨 가면서 같은
 * 가르기(이 일에 드는가 / 안 드는가)를 세 번 해 보게 한다. 필요 없는 조각은 판마다
 * 성격이 다르다 — 중복, 남의 일, 오늘 할 일이 아닌 것.
 */
const STAGES: StageConfig[] = [
  {
    id: 'build',
    label: '기본',
    scene: '부스 설치',
    spoken: '부스 설치에 드는 일만 잘라 내세요.',
    slots: ['상자 열기', '책상 펴기', '전원 잇기', '안내판 걸기', '의자 놓기'],
    chunks: [
      { text: '상자 열기', slot: 0 },
      { text: '새 현수막 주문', slot: -1 },
      { text: '책상 펴기', slot: 1 },
      { text: '전원 잇기', slot: 2 },
      { text: '간식 사 오기', slot: -1 },
      { text: '안내판 걸기', slot: 3 },
      { text: '책상 또 펴기', slot: -1 },
      { text: '의자 놓기', slot: 4 },
      { text: '체육관 청소', slot: -1 },
    ],
  },
  {
    id: 'open',
    label: '1단계',
    scene: '체험 열기',
    spoken: '체험을 여는 데 드는 일만 잘라 내세요.',
    slots: ['순서표 붙이기', '재료 나누기', '앞치마 입기', '손님 맞기', '이름 적기'],
    chunks: [
      { text: '순서표 붙이기', slot: 0 },
      { text: '재료 나누기', slot: 1 },
      { text: '옆 반 도와주기', slot: -1 },
      { text: '앞치마 입기', slot: 2 },
      { text: '재료 또 나누기', slot: -1 },
      { text: '손님 맞기', slot: 3 },
      { text: '내일 표 만들기', slot: -1 },
      { text: '이름 적기', slot: 4 },
      { text: '사진관 예약', slot: -1 },
    ],
  },
  {
    id: 'pack',
    label: '2단계',
    scene: '마치고 정리',
    spoken: '정리에 드는 일만 잘라 내세요.',
    slots: ['전원 끄기', '자료 걷기', '책상 접기', '쓰레기 묶기', '열쇠 반납'],
    chunks: [
      { text: '전원 끄기', slot: 0 },
      { text: '새 의자 사기', slot: -1 },
      { text: '자료 걷기', slot: 1 },
      { text: '책상 접기', slot: 2 },
      { text: '전원 또 끄기', slot: -1 },
      { text: '쓰레기 묶기', slot: 3 },
      { text: '다음 축제 기획', slot: -1 },
      { text: '열쇠 반납', slot: 4 },
      { text: '운동장 정리', slot: -1 },
    ],
  },
];

interface World {
  /** 이미 잘린 조각 */
  cut: number[];
  /** 채워진 빈칸의 글자 */
  filled: (string | null)[];
  crumbs: string[];
  lives: number;
  flash: number;
  flashChunk: number;
  finished: boolean;
  /** 손끝이 지나간 자리. 벤 자국을 잠깐 남긴다. */
  trail: { x: number; y: number; life: number }[];
}

export default function TaskSliceGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 기회 수로만 나타난다. 덩어리와 빈칸은 셋 모두 같다. */
  const maxLives = tuning.lives;
  /* 손끝 판정의 너그러움. 덩어리를 살짝 스쳐도 베이게 한다. */
  const reach = 10 * clamp(tuning.tolerance, 0.9, 1.6);

  const worldRef = useRef<World>({
    cut: [], filled: Array(SLOT_COUNT).fill(null), crumbs: [], lives: maxLives,
    flash: 0, flashChunk: -1, finished: false, trail: [],
  });
  const [view, setView] = useState({ filled: 0, lives: maxLives });
  const [note, setNote] = useState('완성 사진의 빈칸을 보고, 그 일만 손끝으로 그어 잘라 내세요.');
  const dragging = useRef(false);

  useEffect(() => {
    worldRef.current = {
      cut: [], filled: Array(SLOT_COUNT).fill(null), crumbs: [], lives: maxLives,
      flash: 0, flashChunk: -1, finished: false, trail: [],
    };
    setView({ filled: 0, lives: maxLives });
    setNote('완성 사진의 빈칸을 보고, 그 일만 손끝으로 그어 잘라 내세요.');
    dragging.current = false;
  }, [game.round, game.stageIndex, maxLives, stage]);

  const sliceChunk = (index: number) => {
    const w = worldRef.current;
    if (w.finished || w.cut.includes(index)) return;
    const chunk = stage.chunks[index];
    w.cut = [...w.cut, index];

    if (chunk.slot >= 0) {
      w.filled = w.filled.map((value, i) => (i === chunk.slot ? chunk.text : value));
      setNote(`"${chunk.text}"${particleFor(chunk.text, '을', '를')} 잘라 완성 사진에 넣었어요.`);
    } else {
      // 필요 없는 일을 자르면 부스러기가 된다. 자르지 않고 두는 것이 옳았다.
      w.crumbs = [...w.crumbs, chunk.text];
      w.lives -= 1;
      w.flash = 0.7;
      w.flashChunk = index;
      setNote(`"${chunk.text}"${particleFor(chunk.text, '은', '는')} 이 일에 들지 않아요. 부스러기가 되었어요.`);
    }

    const filled = w.filled.filter(Boolean).length;
    setView({ filled, lives: w.lives });

    if (w.lives <= 0) {
      w.finished = true;
      game.fail('부스러기가 너무 쌓였어요. 완성 사진에 없는 일은 자르지 않아도 돼요.');
    } else if (filled >= SLOT_COUNT) {
      w.finished = true;
      game.succeed('완성 사진의 빈칸이 모두 찼어요. 큰 일을 할 수 있는 크기로 나누었어요!');
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    if (dt > 0) {
      if (w.flash > 0) w.flash = Math.max(0, w.flash - dt);
      for (const point of w.trail) point.life -= dt;
      w.trail = w.trail.filter((point) => point.life > 0);
    }

    paintBoard(ctx, WORLD_W, WORLD_H);

    // 완성 사진의 빈칸
    centerText(ctx, '완성 사진', WORLD_W / 2, 18, 20, B.grey);
    for (let i = 0; i < SLOT_COUNT; i += 1) {
      const box = slotBox(i);
      const text = w.filled[i];
      drawBar(ctx, box.x, box.y, box.w, box.h, {
        fill: text ? B.blue : B.ground,
        stroke: text ? B.keyline : B.grey,
        width: text ? STROKE.heavy : STROKE.base,
      });
      centerText(ctx, text ?? stage.slots[i], box.x + box.w / 2, box.y + box.h / 2 - 8, 20,
        text ? B.ground : B.grey);
      if (!text) centerText(ctx, '비어 있어요', box.x + box.w / 2, box.y + box.h / 2 + 18, 20, B.grey);
      else drawShape(ctx, 'square', box.x + 20, box.y + 18, 11, { fill: B.ground, stroke: B.ground, width: 1 });
    }

    // 큰 덩어리 — 아직 안 잘린 조각들
    for (let i = 0; i < stage.chunks.length; i += 1) {
      if (w.cut.includes(i)) continue;
      const box = chunkBox(i);
      const wrongFlash = w.flash > 0 && w.flashChunk === i;
      drawBar(ctx, box.x, box.y, box.w, box.h, {
        fill: B.surface,
        stroke: wrongFlash ? B.red : B.yellow,
        width: wrongFlash ? STROKE.heavy : STROKE.base,
      });
      centerText(ctx, stage.chunks[i].text, box.x + box.w / 2, box.y + box.h / 2, 21, B.ink);
    }

    // 부스러기 통
    drawBar(ctx, BIN.x, BIN.y, BIN.w, BIN.h, {
      fill: B.ground, stroke: w.crumbs.length > 0 ? B.red : B.grey, width: STROKE.base,
    });
    centerText(ctx, `부스러기 ${w.crumbs.length}개`, BIN.x + BIN.w / 2, BIN.y + BIN.h / 2, 21,
      w.crumbs.length > 0 ? B.red : B.grey);
    if (w.crumbs.length > 0) {
      drawShape(ctx, 'triangle', BIN.x + 26, BIN.y + BIN.h / 2, 13, {
        fill: B.red, stroke: B.keyline, width: 1,
      });
    }

    // 벤 자국 — 손끝이 지나간 길
    for (let i = 1; i < w.trail.length; i += 1) {
      const a = w.trail[i - 1];
      const b = w.trail[i];
      ctx.strokeStyle = B.yellow;
      ctx.lineWidth = STROKE.base;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    centerText(ctx, '손끝으로 그어 자릅니다', 180, BIN.y + BIN.h / 2, 20, B.grey);
    drawMark(ctx, 'arrow', 336, BIN.y + BIN.h / 2, 22, B.grey);
  };

  const handlePointer = (x: number, y: number, phase: 'down' | 'move' | 'up') => {
    const w = worldRef.current;
    if (!game.playing || w.finished) return;
    if (phase === 'down') dragging.current = true;
    if (phase === 'up') { dragging.current = false; return; }
    if (!dragging.current) return;

    w.trail = [...w.trail.slice(-14), { x, y, life: 0.35 }];
    for (let i = 0; i < stage.chunks.length; i += 1) {
      if (w.cut.includes(i)) continue;
      const box = chunkBox(i);
      if (x >= box.x - reach && x <= box.x + box.w + reach
        && y >= box.y - reach && y <= box.y + box.h + reach) {
        sliceChunk(i);
        return;
      }
    }
  };

  return (
    <MiniGameFrame
      badge="큰 일 잘라 나누기"
      instruction="위의 완성 사진에 빈칸이 다섯 개 있습니다. 그 빈칸을 채울 일만 손끝으로 그어 잘라 내세요. 완성 사진에 없는 일은 자르지 말고 그대로 둡니다."
      progress={{ label: '채운 빈칸', value: view.filled, max: SLOT_COUNT }}
      hud={<GameHud lives={view.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="px-1 text-[15px] font-bold" style={{ color: 'var(--game-ink)' }}>
          {stage.scene} · {note}
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
            onPointer={(pointer) => handlePointer(pointer.x, pointer.y, pointer.phase)}
            ariaLabel={`큰 일을 잘라 나누는 놀이. 채운 빈칸 ${view.filled}개, 남은 기회 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
