import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, pick, randRange,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

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
const HOLE_ROWS = 3;

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
    spoken: '공원 그림에서 추측만 두드려요.',
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
    spoken: '교실 그림에서 추측만 두드려요.',
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
    spoken: '정류장 그림에서 추측만 두드려요.',
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

  const holeBox = (index: number) => {
    const col = index % HOLE_COLS;
    const row = Math.floor(index / HOLE_COLS);
    const w = 250;
    const h = 108;
    const gapX = (WORLD_W - HOLE_COLS * w) / (HOLE_COLS + 1);
    const gapY = 24;
    return {
      x: gapX + col * (w + gapX),
      y: 96 + row * (h + gapY),
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
          game.succeed('추측만 골라 두드리고 근거 있는 설명으로 고쳤어요!');
        }
        return { ...prev, caught };
      });
    } else {
      setHud((prev) => {
        const lives = prev.lives - 1;
        if (lives <= 0 && !finishedRef.current) {
          finishedRef.current = true;
          game.fail('눈으로 보이는 사실을 두드렸어요. 눈 표시가 있는 말은 그대로 두어요.');
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
                game.fail('추측을 놓쳤어요. 물음표가 붙은 말은 두드려 고쳐 봐요.');
              }
              return { ...prev, lives };
            });
          }
        }
      }
      molesRef.current = molesRef.current.filter((m) => !m.hit || m.life > -0.4);
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    panel(ctx, 20, 14, WORLD_W - 40, 46, BOARD.overlay, PLAY.info, 12);
    centerText(ctx, `${stage.scene} 그림 · 물음표는 추측, 눈은 사실입니다`, WORLD_W / 2, 37, 22, BOARD.ink);

    for (let i = 0; i < HOLE_COLS * HOLE_ROWS; i += 1) {
      const box = holeBox(i);
      panel(ctx, box.x, box.y, box.w, box.h, '#0B1220', BOARD.line, 12);
      const mole = molesRef.current.find((m) => m.hole === i && !m.hit);
      if (!mole) continue;
      const rise = clamp(1 - Math.abs(mole.life / mole.total - 0.5) * 2, 0.25, 1);
      const h = box.h * 0.82 * rise;
      const y = box.y + box.h - h - 6;
      panel(
        ctx, box.x + 10, y, box.w - 20, h,
        mole.guess ? '#4C1D95' : '#064E3B',
        mole.guess ? PLAY.extra : PLAY.goal, 12,
      );
      if (h > 40) {
        centerText(ctx, mole.guess ? '💭' : '👁️', box.x + box.w / 2, y + 20, 22, BOARD.ink);
        centerText(ctx, mole.text, box.x + box.w / 2, y + h / 2 + 12, 20, BOARD.ink);
      }
    }

    if (readyRef.current) {
      panel(ctx, WORLD_W / 2 - 230, WORLD_H - 96, 460, 60, BOARD.overlay, PLAY.hero, 14);
      centerText(ctx, '판을 누르면 시작합니다', WORLD_W / 2, WORLD_H - 66, 24, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="추측만 두드리기"
      instruction="짐작해서 쓴 말(물음표 표시)만 톡톡 두드려 보세요. 직접 눈으로 확인한 사실(눈 표시)은 그대로 남겨 둡니다."
      progress={{ label: '고친 추측', value: hud.caught, max: GOAL }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
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
              ariaLabel={`${stage.scene} 그림에서 추측 말풍선을 두드리는 놀이. 고친 추측 ${hud.caught}개, 남은 기회 ${hud.lives}개.`}
            />
          </div>
        </div>
        <p
          className="min-h-[40px] rounded-xl px-3 py-1.5 text-[15px] font-bold leading-snug"
          style={{ background: 'var(--board-surface)', border: '2px solid #4ADE80', color: 'var(--board-ink)' }}
        >
          {fixedList.length > 0 ? `근거 있는 설명 · ${fixedList.join(' / ')}` : '두드린 추측이 여기에서 근거 있는 설명으로 바뀝니다.'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
