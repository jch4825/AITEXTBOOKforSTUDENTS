import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, BauhausMark, GameCanvas, GameHud, STROKE, centerText, clamp, createRandom, drawBar,
  drawMark, drawShape, pick, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m6-l4 · 버스 타는 순간 (장르 30 · 타이밍 액션)
 *
 * "번호와 방향을 오늘 공지와 함께 확인한다"를 문 열림 창으로 만든다. 차가 서면
 * 파란 막대가 짧게 줄어들고, 그 막대가 남아 있는 동안에 눌러야 탄다.
 *
 * 그런데 아무 차나 타면 안 된다. 번호와 방향이 공지와 같아야 한다. 눌러야 할지
 * 말아야 할지를 짧은 시간 안에 정하는 것이 이 게임의 판단이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

interface Bus {
  number: string;
  dir: string;
  x: number;
  state: 'coming' | 'open' | 'leaving';
  timer: number;
  handled: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  notice: string;
  number: string;
  dir: string;
  decoys: { number: string; dir: string }[];
  need: number;
  openSeconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'bus',
    label: '기본',
    spoken: '오늘 공지에 맞는 버스를 타요.',
    notice: '오늘 21번 · 동쪽 방향',
    number: '21',
    dir: '동쪽',
    decoys: [
      { number: '12', dir: '동쪽' },
      { number: '21', dir: '서쪽' },
      { number: '2', dir: '동쪽' },
    ],
    need: 3,
    openSeconds: 2.4,
  },
  {
    id: 'metro',
    label: '1단계',
    spoken: '오늘 공지에 맞는 열차를 타요.',
    notice: '오늘 3호선 · 서쪽 방향',
    number: '3',
    dir: '서쪽',
    decoys: [
      { number: '3', dir: '동쪽' },
      { number: '8', dir: '서쪽' },
      { number: '13', dir: '서쪽' },
      { number: '3', dir: '남쪽' },
    ],
    need: 3,
    openSeconds: 2.1,
  },
  {
    id: 'shuttle',
    label: '2단계',
    spoken: '오늘 공지에 맞는 우회 차를 타요.',
    notice: '오늘 우회 12번 · 북쪽 방향',
    number: '12',
    dir: '북쪽',
    decoys: [
      { number: '21', dir: '북쪽' },
      { number: '12', dir: '남쪽' },
      { number: '2', dir: '북쪽' },
      { number: '12', dir: '동쪽' },
      { number: '112', dir: '북쪽' },
    ],
    need: 4,
    openSeconds: 1.8,
  },
];

export default function BusBoardTimingGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 문 열림 시간·차 속도·기회로 나타난다. 공지와 차의 종류는 같다. */
  const openSeconds = stage.openSeconds * clamp(tuning.tolerance, 0.8, 1.7);
  const busSpeed = 210 * clamp(tuning.speed, 0.65, 1.3);
  const maxLives = tuning.lives;

  const busRef = useRef<Bus | null>(null);
  const randomRef = useRef(createRandom(game.seed));
  const gapRef = useRef(1.2);
  const finishedRef = useRef(false);
  const askRef = useRef(1);
  const [hud, setHud] = useState({ boarded: 0, lives: maxLives, ask: 1, peek: '' });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    busRef.current = null;
    randomRef.current = createRandom(game.seed);
    gapRef.current = 1.2;
    finishedRef.current = false;
    askRef.current = 1;
    setHud({ boarded: 0, lives: maxLives, ask: 1, peek: '' });
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  const spawn = () => {
    const random = randomRef.current;
    const correct = random() < 0.4;
    const spec = correct
      ? { number: stage.number, dir: stage.dir }
      : pick(random, stage.decoys);
    busRef.current = {
      number: spec.number, dir: spec.dir, x: WORLD_W + 240,
      state: 'coming', timer: 0, handled: false,
    };
  };

  const board = () => {
    const bus = busRef.current;
    if (!game.playing || !bus || bus.handled || bus.state !== 'open' || finishedRef.current) return;
    bus.handled = true;
    const right = bus.number === stage.number && bus.dir === stage.dir;
    if (right) {
      playSound('confirm');
      setHud((prev) => {
        const boarded = prev.boarded + 1;
        if (boarded >= stage.need && !finishedRef.current) {
          finishedRef.current = true;
          game.succeed('번호와 방향을 공지와 함께 확인하고 문이 열린 동안 탔어요!');
        }
        return { ...prev, boarded };
      });
    } else {
      setHud((prev) => {
        const lives = prev.lives - 1;
        if (lives <= 0 && !finishedRef.current) {
          finishedRef.current = true;
          game.fail('공지와 다른 차에 탔어요. 번호와 방향을 함께 보고 눌러 봐요.');
        }
        return { ...prev, lives };
      });
    }
    bus.state = 'leaving';
  };

  const ask = () => {
    if (!game.playing || askRef.current <= 0) return;
    askRef.current -= 1;
    const bus = busRef.current;
    setHud((prev) => ({
      ...prev,
      ask: askRef.current,
      peek: bus ? `다가오는 차 · ${bus.number}번 ${bus.dir}` : '다음 차를 기다립니다',
    }));
    playSound('select');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const bus = busRef.current;

    if (dt > 0 && game.playing && !finishedRef.current) {
      if (keys.consumePress('action')) board();

      if (!bus) {
        gapRef.current -= dt;
        if (gapRef.current <= 0) {
          spawn();
          gapRef.current = 1.6;
        }
      } else if (bus.state === 'coming') {
        bus.x -= busSpeed * dt;
        if (bus.x <= WORLD_W / 2 - 190) {
          bus.x = WORLD_W / 2 - 190;
          bus.state = 'open';
          bus.timer = 0;
        }
      } else if (bus.state === 'open') {
        bus.timer += dt;
        if (bus.timer >= openSeconds) {
          bus.state = 'leaving';
          if (!bus.handled && bus.number === stage.number && bus.dir === stage.dir) {
            // 맞는 차를 놓치는 것도 기회를 쓴다
            setHud((prev) => {
              const lives = prev.lives - 1;
              if (lives <= 0 && !finishedRef.current) {
                finishedRef.current = true;
                game.fail('맞는 차를 놓쳤어요. 파란 막대가 줄어드는 동안에 눌러 봐요.');
              }
              return { ...prev, lives };
            });
          }
        }
      } else {
        bus.x -= busSpeed * 1.4 * dt;
        if (bus.x < -420) {
          busRef.current = null;
          setHud((prev) => ({ ...prev, peek: '' }));
        }
      }
    }

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    /* 전광판 공지 — 오늘 학생이 손에 쥐고 다니는 값이라 노랑으로 두른다.
       확성기 그림 문자 자리에는 같은 뜻의 소리 마크를 직접 그린다. */
    drawBar(ctx, WORLD_W / 2 - 280, 18, 560, 56,
      { fill: B.ground, stroke: B.yellow, width: STROKE.base });
    drawMark(ctx, 'sound', WORLD_W / 2 - 238, 46, 30, B.yellow);
    centerText(ctx, stage.notice, WORLD_W / 2 + 16, 46, 26, B.ink);

    // 정류장 — 밟고 서 있는 중립 구조물이므로 회색 막대다.
    drawBar(ctx, 0, WORLD_H - 92, WORLD_W, 92, { fill: B.surface });
    drawBar(ctx, WORLD_W / 2 - 210, WORLD_H - 92, 420, 12, { fill: B.grey });
    centerText(ctx, '정류장', WORLD_W / 2, WORLD_H - 46, 24, B.grey);

    if (bus) {
      const y = 210;
      const right = bus.number === stage.number && bus.dir === stage.dir;
      /* 공지와 맞는 차만 파랑으로 두르고 나머지는 회색 구조물로 둔다. 빨강을 쓰면
         "타면 안 되는 차"가 도형 없이도 멀리서 읽혀, 번호와 방향을 견주어 보는
         이 놀이의 판단 자체가 사라진다. 답을 지는 것은 어디까지나 숫자와 방향이다. */
      drawBar(ctx, bus.x, y, 380, 160, {
        fill: B.surface,
        stroke: right ? B.blue : B.grey,
        width: STROKE.base,
      });
      centerText(ctx, `${bus.number}번`, bus.x + 130, y + 62, 46, B.ink);
      centerText(ctx, bus.dir, bus.x + 290, y + 62, 32, B.ink);
      /* 버스 그림 문자를 걷어낸 자리다. 네모 몸통 아래에 바퀴 두 개를 붙여
         "굴러가는 것"으로 읽히게 한다. 글꼴마다 달라지는 그림 대신 도형이 뜻을 진다. */
      for (const wheelX of [bus.x + 96, bus.x + 284]) {
        drawShape(ctx, 'circle', wheelX, y + 176, 44,
          { fill: B.grey, stroke: B.keyline, width: STROKE.hair });
      }

      if (bus.state === 'open') {
        const ratio = clamp(1 - bus.timer / openSeconds, 0, 1);
        drawBar(ctx, bus.x + 30, y + 142, 320, 16, { fill: B.ground });
        drawBar(ctx, bus.x + 30, y + 142, 320 * ratio, 16, { fill: B.blue });
        centerText(ctx, '문이 열렸습니다', bus.x + 190, y - 18, 24, B.blue);
      }
    } else {
      centerText(ctx, '다음 차를 기다립니다', WORLD_W / 2, 280, 26, B.grey);
    }

    centerText(ctx, '스페이스나 타기 버튼으로 탑니다', WORLD_W / 2, WORLD_H - 16, 20, B.grey);
  };

  return (
    <MiniGameFrame
      bauhaus
      badge="버스 타는 순간"
      instruction="안내판에 나온 번호와 방향이 같은 버스가 멈추어 문이 열렸을 때 타 보세요. 번호가 다른 버스는 그냥 보내세요."
      progress={{ label: '바르게 탄 차', value: hud.boarded, max: stage.need }}
      hud={<GameHud bauhaus lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          {/* 물어보기는 힌트라 주의 마크, 타기는 몸이 옮겨 가는 일이라 화살표를 쓴다. */}
          <MiniGameButton onClick={ask} disabled={hud.ask <= 0} mark="bang" label={`물어보기 ${hud.ask}`} />
          <MiniGameButton onClick={board} disabled={!game.playing} mark="arrow" label="타기" variant="primary" />
          <MiniGameButton onClick={game.retry} mark="retry" label="다시" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {hud.peek && (
          /* 물어봐서 얻은 값이라 노랑으로 두른다 — 지금 학생이 손에 쥔 정보다.
             물어보기 버튼과 같은 마크를 달아 어디서 온 줄인지 붙여 읽힌다. */
          <p
            className="flex items-center gap-1.5 px-3 py-1.5 text-[15px] font-black"
            style={{
              background: 'var(--game-board)',
              border: 'var(--game-line) solid var(--game-board-yellow)',
              color: 'var(--game-board-ink)',
            }}
          >
            <span style={{ color: 'var(--game-board-yellow)' }}>
              <BauhausMark kind="bang" size={15} />
            </span>
            {hud.peek}
          </p>
        )}
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="game-canvas-fit">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => { if (pointer.phase === 'down') board(); }}
              ariaLabel={`공지에 맞는 차를 골라 타는 놀이. 바르게 탄 차 ${hud.boarded}대, 남은 기회 ${hud.lives}개.`}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
