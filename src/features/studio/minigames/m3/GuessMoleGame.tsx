import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, createRandom, drawBar, drawShape, pick,
  randRange,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m3-l9 · 추측만 두드리기 (장르 32 · 두더지 잡기)
 *
 * "그림에서 보이는 사실과 덧붙인 추측을 나눈다"를 순발력으로 만든다. 추측 풍선은
 * 두드려야 하고, 사실 풍선은 그대로 두어야 한다. 둘 다 같은 구멍에서 같은 모습으로
 * 올라오므로 글을 읽고 판단해야 손이 나간다.
 *
 * 두드린 추측은 아래 띠에서 근거를 붙인 말로 바뀐다 — 없애는 것이 아니라 고치는 것이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const HOLE_COLS = 3;
/* 아홉 칸을 250x108로 두었더니 말풍선 하나가 판 너비의 4분의 1뿐이라, 실제 화면에서는
   글자와 표시가 손톱만 하게 보였다. 여섯 칸으로 줄여 하나를 290x150으로 키운다. */
const HOLE_ROWS = 2;
const HOLE_W = 290;
const HOLE_H = 150;

interface StageConfig {
  id: string;
  label: string;
  scene: string;
  spoken: string;
  guesses: { text: string; fixed: string }[];
  facts: string[];
}

const STAGES: StageConfig[] = [
  {
    id: 'park',
    label: '기본',
    scene: '공원',
    spoken: '공원에서 물음표만 눌러요.',
    guesses: [
      { text: '가방 주인은 급했나 봐요', fixed: '가방이 열려 있어서 급했을 수 있습니다' },
      { text: '곧 비가 올 거예요', fixed: '우산을 든 사람이 있어 비를 대비했을 수 있습니다' },
      { text: '모두 기분이 좋아요', fixed: '웃는 얼굴이 보여 즐거워 보입니다' },
      { text: '아이는 배가 고파요', fixed: '간식 봉지를 들고 있습니다' },
      { text: '오늘은 휴일이에요', fixed: '사람이 많아 붐빕니다' },
    ],
    facts: ['빨간 가방이 있어요', '의자가 두 개예요', '나무가 세 그루예요', '우산을 들었어요'],
  },
  {
    id: 'class',
    label: '1단계',
    scene: '교실',
    spoken: '교실에서 물음표만 눌러요.',
    guesses: [
      { text: '시험을 봤나 봐요', fixed: '책상에 연필과 종이가 놓여 있습니다' },
      { text: '선생님이 화났어요', fixed: '선생님이 앞에 서 있습니다' },
      { text: '수업이 곧 끝나요', fixed: '시계가 벽에 걸려 있습니다' },
      { text: '친구가 지루해해요', fixed: '한 사람이 창밖을 봅니다' },
      { text: '숙제가 어려웠어요', fixed: '공책이 펼쳐져 있습니다' },
    ],
    facts: ['칠판에 글씨가 있어요', '창문이 열려 있어요', '책상이 여섯 개예요', '가방이 걸려 있어요'],
  },
  {
    id: 'stop',
    label: '2단계',
    scene: '정류장',
    spoken: '정류장에서 물음표만 눌러요.',
    guesses: [
      { text: '버스가 늦었어요', fixed: '사람들이 서서 기다립니다' },
      { text: '저 사람은 학생이에요', fixed: '가방을 메고 있습니다' },
      { text: '날씨가 추워요', fixed: '외투를 입은 사람이 있습니다' },
      { text: '곧 차가 와요', fixed: '전광판에 글자가 떠 있습니다' },
      { text: '모두 바빠요', fixed: '여러 사람이 서 있습니다' },
    ],
    facts: ['의자가 하나예요', '표지판이 있어요', '사람이 네 명이에요', '전광판이 켜졌어요'],
  },
];

interface Mole {
  hole: number;
  guess: boolean;
  text: string;
  fixed: string;
  life: number;
  total: number;
  hit: boolean;
}

const GOAL = 10;

export default function GuessMoleGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 떠 있는 시간·동시 개수·기회로 나타난다. 판단할 내용은 셋 모두 같다. */
  const showSeconds = 2.4 / clamp(tuning.speed, 0.7, 1.4);
  const maxAlive = clamp(Math.round(2 * tuning.density), 1, 4);
  const spawnEvery = 1.5 / clamp(tuning.density, 0.65, 1.4);
  const maxLives = tuning.lives;

  const molesRef = useRef<Mole[]>([]);
  const timerRef = useRef(0);
  const randomRef = useRef(createRandom(game.seed));
  const finishedRef = useRef(false);
  const readyRef = useRef(true);
  const [hud, setHud] = useState({ caught: 0, lives: maxLives });
  const [fixedList, setFixedList] = useState<string[]>([]);

  useEffect(() => {
    molesRef.current = [];
    timerRef.current = 0;
    randomRef.current = createRandom(game.seed);
    finishedRef.current = false;
    readyRef.current = true;
    setHud({ caught: 0, lives: maxLives });
    setFixedList([]);
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  /**
   * 배경 장면을 그린다.
   *
   * 머리글은 "공원 그림"이라고 말하는데 판에는 검은 구멍만 있었다. 무엇을 보고 사실과
   * 추측을 나누라는 것인지 알 수 없다. 말풍선이 떠오르는 자리가 어떤 곳인지 눈으로
   * 보여 준다.
   */
  const drawScene = (ctx: CanvasRenderingContext2D) => {
    /*
     * 장면 그림.
     *
     * 앞서는 갈색 나무·초록 잎·주황 버스처럼 사물의 색을 그대로 썼다. 색이 열두 가지로
     * 늘면서 정작 눌러야 할 것과 두어야 할 것의 색이 배경에 묻혔다. 여기서는 배경을
     * 두 면(하늘·바닥)과 회색 구조물로만 그리고, 빨강·파랑·노랑은 놀이에만 남긴다.
     * 장면이 무엇인지는 형태가 말한다 — 기둥과 지붕, 둥근 나무, 네모난 칠판.
     */
    const skyH = 300;
    ctx.fillStyle = B.surface;
    ctx.fillRect(0, 64, WORLD_W, skyH - 64);
    ctx.fillStyle = B.ground;
    ctx.fillRect(0, skyH, WORLD_W, WORLD_H - skyH);
    ctx.fillStyle = B.grey;
    ctx.fillRect(0, skyH - 2, WORLD_W, 2);

    if (stage.id === 'park') {
      // 해 하나와 나무 셋, 벤치 하나
      drawShape(ctx, 'circle', 860, 120, 68, { fill: B.yellow, stroke: B.keyline, width: STROKE.hair });
      for (const [x, s] of [[110, 1], [420, 0.8], [720, 0.92]] as [number, number][]) {
        drawBar(ctx, x - 9 * s, skyH - 70 * s, 18 * s, 70 * s, { fill: B.grey });
        drawShape(ctx, 'circle', x, skyH - 92 * s, 92 * s,
          { fill: B.surface, stroke: B.grey, width: STROKE.hair });
      }
      drawBar(ctx, 540, skyH + 34, 150, 20, { fill: B.grey });
      ctx.fillStyle = B.grey;
      ctx.fillRect(556, skyH + 54, 12, 34);
      ctx.fillRect(662, skyH + 54, 12, 34);
    } else if (stage.id === 'classroom') {
      // 칠판 하나와 책상 셋
      drawBar(ctx, 120, 96, 420, 150, { fill: B.ground, stroke: B.grey, width: STROKE.base });
      for (const x of [180, 430, 680]) {
        drawBar(ctx, x, skyH + 20, 160, 18, { fill: B.grey });
        ctx.fillStyle = B.grey;
        ctx.fillRect(x + 12, skyH + 38, 12, 46);
        ctx.fillRect(x + 136, skyH + 38, 12, 46);
      }
    } else {
      // 정류장 표지와 버스
      ctx.fillStyle = B.grey;
      ctx.fillRect(150, skyH - 130, 12, 130);
      drawBar(ctx, 108, skyH - 176, 96, 52, { fill: B.surface, stroke: B.grey, width: STROKE.hair });
      drawBar(ctx, 560, skyH - 118, 300, 118, { fill: B.surface, stroke: B.grey, width: STROKE.base });
      drawShape(ctx, 'circle', 630, skyH, 44, { fill: B.ground, stroke: B.grey, width: STROKE.hair });
      drawShape(ctx, 'circle', 800, skyH, 44, { fill: B.ground, stroke: B.grey, width: STROKE.hair });
    }
  };

  const holeBox = (index: number) => {
    const col = index % HOLE_COLS;
    const row = Math.floor(index / HOLE_COLS);
    const w = HOLE_W;
    const h = HOLE_H;
    const gapX = (WORLD_W - HOLE_COLS * w) / (HOLE_COLS + 1);
    const gapY = 26;
    return {
      x: gapX + col * (w + gapX),
      y: 104 + row * (h + gapY),
      w,
      h,
    };
  };

  const strike = (holeIndex: number) => {
    if (!game.playing || readyRef.current) return;
    const mole = molesRef.current.find((m) => m.hole === holeIndex && !m.hit);
    if (!mole) return;
    mole.hit = true;
    if (mole.guess) {
      playSound('stamp');
      setFixedList((prev) => [...prev.slice(-2), mole.fixed]);
      setHud((prev) => {
        const caught = prev.caught + 1;
        if (caught >= GOAL && !finishedRef.current) {
          finishedRef.current = true;
          game.succeed('물음표만 골라 눌러서 근거 있는 말로 고쳤어요!');
        }
        return { ...prev, caught };
      });
    } else {
      setHud((prev) => {
        const lives = prev.lives - 1;
        if (lives <= 0 && !finishedRef.current) {
          finishedRef.current = true;
          game.fail('눈동자(사실)를 눌러서 터졌어요. 눈동자는 그대로 두세요.');
        }
        return { ...prev, lives };
      });
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const random = randomRef.current;

    if (dt > 0 && game.playing && !finishedRef.current && !readyRef.current) {
      timerRef.current += dt;
      const alive = molesRef.current.filter((m) => !m.hit).length;
      if (timerRef.current > spawnEvery && alive < maxAlive) {
        timerRef.current = 0;
        const used = new Set(molesRef.current.filter((m) => !m.hit).map((m) => m.hole));
        const free: number[] = [];
        for (let i = 0; i < HOLE_COLS * HOLE_ROWS; i += 1) if (!used.has(i)) free.push(i);
        if (free.length > 0) {
          const hole = free[Math.floor(random() * free.length)];
          const isGuess = random() < 0.58;
          const life = showSeconds * randRange(random, 0.9, 1.25);
          if (isGuess) {
            const spec = pick(random, stage.guesses);
            molesRef.current.push({ hole, guess: true, text: spec.text, fixed: spec.fixed, life, total: life, hit: false });
          } else {
            molesRef.current.push({ hole, guess: false, text: pick(random, stage.facts), fixed: '', life, total: life, hit: false });
          }
        }
      }

      for (const mole of molesRef.current) {
        if (mole.hit) continue;
        mole.life -= dt;
        if (mole.life <= 0) {
          mole.hit = true;
          // 추측을 놓치면 기회가 준다. 사실을 놓치는 것은 옳은 행동이라 벌이 없다.
          if (mole.guess) {
            setHud((prev) => {
              const lives = prev.lives - 1;
              if (lives <= 0 && !finishedRef.current) {
                finishedRef.current = true;
                game.fail('물음표(추측)를 놓쳤어요. 사라지기 전에 눌러 보세요.');
              }
              return { ...prev, lives };
            });
          }
        }
      }
      molesRef.current = molesRef.current.filter((m) => !m.hit || m.life > -0.4);
    }

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    drawScene(ctx);

    drawBar(ctx, 20, 12, WORLD_W - 40, 46, { fill: B.ground, stroke: B.blue, width: STROKE.base });
    centerText(
      ctx, `${stage.scene}에서 떠오른 말 · 빨간 세모는 누르기 · 파란 네모는 그대로 두기`,
      WORLD_W / 2, 35, 22, B.ink,
    );

    for (let i = 0; i < HOLE_COLS * HOLE_ROWS; i += 1) {
      const box = holeBox(i);
      const mole = molesRef.current.find((m) => m.hole === i && !m.hit);
      /* 빈 자리는 그리지 않는다. 여섯 상자를 늘 깔아 두었더니 그 상자가 장면을 통째로
         덮어, 배경을 그려도 하늘도 나무도 보이지 않았다. 말은 장면에서 떠오른다. */
      if (!mole) continue;
      const rise = clamp(1 - Math.abs(mole.life / mole.total - 0.5) * 2, 0.25, 1);
      const h = box.h * 0.82 * rise;
      const y = box.y + box.h - h - 6;
      /* 추측은 붉은 세모, 사실은 파란 네모다. 판마다 같은 짝이라 학생은 한 번 배운
         신호를 계속 쓴다. 색만으로 나누지 않는 것은 판 위에서 빨강과 파랑의 밝기가
         거의 같기 때문이다. */
      drawBar(ctx, box.x + 10, y, box.w - 20, h,
        { fill: B.surface, stroke: mole.guess ? B.red : B.blue, width: STROKE.base });
      if (h > 52) {
        if (mole.guess) {
          drawShape(ctx, 'triangle', box.x + box.w / 2, y + 36, 44,
            { fill: B.red, stroke: B.keyline, width: STROKE.hair });
        } else {
          drawShape(ctx, 'square', box.x + box.w / 2, y + 36, 38,
            { fill: B.blue, stroke: B.keyline, width: STROKE.hair });
        }
        centerText(ctx, mole.text, box.x + box.w / 2, y + h / 2 + 30, 22, B.ink);
      }
    }

    if (readyRef.current) {
      drawBar(ctx, WORLD_W / 2 - 230, WORLD_H - 96, 460, 60,
        { fill: B.ground, stroke: B.yellow, width: STROKE.base });
      centerText(ctx, '판을 누르면 시작합니다', WORLD_W / 2, WORLD_H - 66, 24, B.ink);
    }
  };

  return (
    <MiniGameFrame
      bauhaus
      badge="추측만 두드리기"
      instruction="빨간 세모(추측)가 나오면 사라지기 전에 누르세요. 파란 네모(사실)를 잘못 누르면 터집니다."
      progress={{ label: '고친 추측', value: hud.caught, max: GOAL }}
      hud={<GameHud bauhaus lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="game-canvas-fit">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                if (pointer.phase !== 'down') return;
                if (readyRef.current) { readyRef.current = false; return; }
                for (let i = 0; i < HOLE_COLS * HOLE_ROWS; i += 1) {
                  const box = holeBox(i);
                  if (pointer.x >= box.x && pointer.x <= box.x + box.w
                    && pointer.y >= box.y && pointer.y <= box.y + box.h) {
                    strike(i);
                    return;
                  }
                }
              }}
              ariaLabel={`${stage.scene}에서 빨간 세모 말풍선을 누르는 놀이. 고친 추측 ${hud.caught}개, 남은 기회 ${hud.lives}개.`}
            />
          </div>
        </div>
        <p
          className="min-h-[40px] px-3 py-1.5 text-[15px] font-bold leading-snug"
          style={{
            background: 'var(--game-board)',
            border: 'var(--game-line) solid var(--game-board-blue)',
            color: 'var(--game-board-ink)',
          }}
        >
          {fixedList.length > 0
            ? `근거 있는 설명 · ${fixedList.join(' / ')}`
            : '누른 빨간 세모가 여기에서 근거 있는 말로 바뀝니다.'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
