import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, pick, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m6-l4 · 버스 타는 순간 (장르 30 · 타이밍 액션)
 *
 * "번호와 방향을 오늘 공지와 함께 확인한다"를 문 열림 창으로 만든다. 차가 서면
 * 초록 막대가 짧게 지나가고, 그 안에 눌러야 탄다.
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
                game.fail('맞는 차를 놓쳤어요. 문이 열린 초록 동안에 눌러 봐요.');
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

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 전광판 공지
    panel(ctx, WORLD_W / 2 - 280, 18, 560, 56, BOARD.overlay, PLAY.hero, 12);
    centerText(ctx, `📢 ${stage.notice}`, WORLD_W / 2, 46, 26, BOARD.ink);

    // 정류장
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, WORLD_H - 92, WORLD_W, 92);
    panel(ctx, WORLD_W / 2 - 210, WORLD_H - 92, 420, 12, PLAY.info, PLAY.infoEdge, 4);
    centerText(ctx, '정류장', WORLD_W / 2, WORLD_H - 46, 24, BOARD.inkDim);

    if (bus) {
      const y = 210;
      const right = bus.number === stage.number && bus.dir === stage.dir;
      panel(ctx, bus.x, y, 380, 160, '#334155', right ? PLAY.info : PLAY.extra, 16);
      centerText(ctx, `${bus.number}번`, bus.x + 130, y + 62, 46, BOARD.ink);
      centerText(ctx, bus.dir, bus.x + 290, y + 62, 32, BOARD.ink);
      centerText(ctx, '🚌', bus.x + 190, y + 122, 34, BOARD.ink);

      if (bus.state === 'open') {
        const ratio = clamp(1 - bus.timer / openSeconds, 0, 1);
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(bus.x + 30, y + 142, 320, 16);
        ctx.fillStyle = PLAY.goal;
        ctx.fillRect(bus.x + 30, y + 142, 320 * ratio, 16);
        centerText(ctx, '문이 열렸습니다', bus.x + 190, y - 18, 24, PLAY.goal);
      }
    } else {
      centerText(ctx, '다음 차를 기다립니다', WORLD_W / 2, 280, 26, BOARD.inkDim);
    }

    centerText(ctx, '스페이스나 타기 버튼으로 탑니다', WORLD_W / 2, WORLD_H - 16, 20, BOARD.inkDim);
  };

  return (
    <MiniGameFrame
      badge="버스 타는 순간"
      instruction="전광판 공지와 번호·방향이 같은 차가 서서 문이 열린 동안에만 타세요. 다른 차는 그냥 보냅니다."
      progress={{ label: '바르게 탄 차', value: hud.boarded, max: stage.need }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={ask} disabled={hud.ask <= 0} emoji="🙋" label={`물어보기 ${hud.ask}`} />
          <MiniGameButton onClick={board} disabled={!game.playing} emoji="🚌" label="타기" variant="primary" />
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {hud.peek && (
          <p
            className="rounded-xl px-3 py-1.5 text-[15px] font-black"
            style={{ background: 'var(--board-surface)', border: '2px solid #4ADE80', color: 'var(--board-ink)' }}
          >
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
