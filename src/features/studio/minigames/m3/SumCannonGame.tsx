import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, createRandom, drawBar, drawMark,
  drawShape, randInt, toRadians, useGameKeys, paintBoard,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m3-l6 · 합계 대포 (장르 28 · 포탄 각도 맞추기)
 *
 * "먼저 예상하고 계산기로 확인한다"를 사격으로 만든다. 과녁까지의 거리가 곧 합계다.
 * 첫 발은 눈대중으로 쏘고, 빗나가면 계산기를 열어 정확한 자리를 눈금에 표시한다.
 *
 * 계산기를 열면 아이미 풀이에서 틀린 줄도 함께 붉어진다 — 확인이 곧 오류 찾기다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const GROUND = WORLD_H - 70;
const GUN_X = 90;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  /** 물건 이름만 스테이지가 정한다. 값과 개수는 판마다 새로 뽑는다. */
  names: string[];
  wind: number;
}

interface Basket {
  items: { name: string; price: number; count: number }[];
  total: number;
  /** 아이미 풀이. 한 줄이 틀려 있다. */
  lines: string[];
  wrongLine: number;
}

const STAGES: StageConfig[] = [
  { id: 'snack', label: '기본', spoken: '간식 합계를 예상해 쏴 봐요.', names: ['사탕', '우유'], wind: 0 },
  { id: 'stationery', label: '1단계', spoken: '학용품 합계를 예상해 쏴 봐요.', names: ['공책', '연필'], wind: 0 },
  { id: 'party', label: '2단계', spoken: '잔치 준비물 합계를 예상해 쏴 봐요.', names: ['풍선', '종이컵', '주스'], wind: 34 },
];

/**
 * 이번 판에 살 물건과 값을 뽑는다.
 *
 * 값을 스테이지에 적어 두었더니 몇 번을 다시 해도 합계가 늘 같았다. 한 번 외우면 계산할
 * 일이 없어진다. 그래서 판마다 새로 뽑되, 합계는 1,500원에서 6,000원 사이에 100원 단위로
 * 떨어지게 한다. 발사 자리로 옮기는 눈금이 그 범위에 맞춰져 있고, 100원 아래 자리는
 * 학생이 셈하기에 잔가지가 된다.
 */
function buildBasket(stage: StageConfig, seed: number): Basket {
  const random = createRandom(seed);
  let items = stage.names.map((name) => ({ name, price: 0, count: 0 }));
  let total = 0;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    items = stage.names.map((name) => ({
      name,
      price: randInt(random, 2, 13) * 100,
      count: randInt(random, 1, 4),
    }));
    total = items.reduce((sum, item) => sum + item.price * item.count, 0);
    if (total >= 1500 && total <= 6000) break;
  }
  // 200번을 뽑아도 범위 밖이면 마지막 물건 값으로 맞춘다. 판이 열리지 않는 일은 없어야 한다.
  if (total < 1500 || total > 6000) {
    const last = items[items.length - 1];
    const others = total - last.price * last.count;
    last.count = 1;
    last.price = clamp(Math.round((3000 - others) / 100) * 100, 200, 3000);
    total = others + last.price;
  }

  const lines = items.map((item) => (item.count > 1
    ? `${item.name} ${item.price.toLocaleString()}원 × ${item.count} = ${(item.price * item.count).toLocaleString()}원`
    : `${item.name} ${item.price.toLocaleString()}원`));
  lines.push(`합계 ${total.toLocaleString()}원`);

  /* 아이미 풀이에는 늘 틀린 줄이 하나 있다. 어느 줄이 틀렸는지도 판마다 바뀌어야
     "합계만 보면 된다"는 요령이 통하지 않는다. */
  const wrongLine = randInt(random, 0, lines.length);
  if (wrongLine === lines.length - 1) {
    const off = (randInt(random, 1, 5) + 1) * 100 * (random() < 0.5 ? -1 : 1);
    lines[wrongLine] = `합계 ${Math.max(100, total + off).toLocaleString()}원`;
  } else {
    const item = items[wrongLine];
    const off = (randInt(random, 1, 4) + 1) * 100;
    const shown = item.price * item.count + off;
    lines[wrongLine] = item.count > 1
      ? `${item.name} ${item.price.toLocaleString()}원 × ${item.count} = ${shown.toLocaleString()}원`
      : `${item.name} ${shown.toLocaleString()}원`;
  }

  return { items, total, lines, wrongLine };
}


interface Shot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  done: boolean;
  landX: number;
}

/** 금액을 화면 가로 자리로 바꾼다. */
/* 1원을 몇 픽셀로 놓을지. 합계가 최대 6,000원이므로 6,000 x 0.12 + 90 = 810px에 선다.
   과녁 상자가 최대 163px이라 여기서 더 키우면 상자가 판 오른쪽(960px) 밖으로 나간다. */
const SCALE = 0.12;
const priceToX = (won: number) => GUN_X + won * SCALE;

export default function SumCannonGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const basket = React.useMemo(() => buildBasket(stage, game.seed), [stage, game.seed]);
  const total = basket.total;
  /* 지원 수준은 과녁 폭과 발수, 바람으로 나타난다. */
  const targetW = 96 * clamp(tuning.tolerance, 0.7, 1.7);
  const maxShots = tuning.lives;
  const wind = stage.wind * clamp(tuning.speed, 0.6, 1.4);

  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(60);
  const [shots, setShots] = useState(maxShots);
  const [calcOpen, setCalcOpen] = useState(false);
  const shotRef = useRef<Shot | null>(null);
  const marksRef = useRef<number[]>([]);
  const finishedRef = useRef(false);
  const keys = useGameKeys(game.playing);
  const [, tick] = useState(0);

  useEffect(() => {
    setAngle(45);
    setPower(60);
    setShots(maxShots);
    setCalcOpen(false);
    shotRef.current = null;
    marksRef.current = [];
    finishedRef.current = false;
  }, [game.round, game.stageIndex, stage, maxShots]);

  const targetX = priceToX(total);

  const fire = () => {
    if (!game.playing || shotRef.current) return;
    const rad = toRadians(-angle);
    const v = power * 9.4;
    shotRef.current = { x: GUN_X, y: GROUND - 26, vx: Math.cos(rad) * v, vy: Math.sin(rad) * v, done: false, landX: 0 };
    playSound('confirm');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const shot = shotRef.current;

    if (dt > 0 && game.playing) {
      if (keys.held.current.up) setAngle((a) => clamp(a + 34 * dt, 10, 80));
      if (keys.held.current.down) setAngle((a) => clamp(a - 34 * dt, 10, 80));
      if (keys.held.current.right) setPower((p) => clamp(p + 26 * dt, 20, 100));
      if (keys.held.current.left) setPower((p) => clamp(p - 26 * dt, 20, 100));
      if (keys.consumePress('action')) fire();
    }

    if (shot && !shot.done && dt > 0) {
      shot.vy += 620 * dt;
      shot.vx += wind * dt;
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      if (shot.y >= GROUND) {
        shot.done = true;
        shot.landX = shot.x;
        marksRef.current = [...marksRef.current, shot.x].slice(-4);
        const hit = Math.abs(shot.x - targetX) <= targetW / 2;
        const left = shots - 1;
        setShots(left);
        if (hit && !finishedRef.current) {
          finishedRef.current = true;
          game.succeed(`합계 ${total.toLocaleString()}원 자리에 정확히 맞혔어요. 계산기로 확인한 값이 맞습니다.`);
        } else if (!hit) {
          setCalcOpen(true);
          if (left <= 0 && !finishedRef.current) {
            finishedRef.current = true;
            game.fail(`아직 빗나갔어요. 계산기로 확인한 합계 ${total.toLocaleString()}원 자리를 다시 겨눠 봐요.`);
          }
        }
        window.setTimeout(() => {
          if (shotRef.current === shot) {
            shotRef.current = null;
            tick((n) => n + 1);
          }
        }, 700);
      }
    }

    paintBoard(ctx, WORLD_W, WORLD_H);

    // 땅과 금액 눈금
    ctx.fillStyle = B.surface;
    ctx.fillRect(0, GROUND, WORLD_W, WORLD_H - GROUND);
    ctx.strokeStyle = B.grey;
    ctx.lineWidth = STROKE.hair;
    for (let won = 0; won <= 6000; won += 500) {
      const x = priceToX(won);
      if (x > WORLD_W) break;
      ctx.beginPath();
      ctx.moveTo(x, GROUND);
      ctx.lineTo(x, GROUND + (won % 1000 === 0 ? 20 : 11));
      ctx.stroke();
      if (won % 1000 === 0) centerText(ctx, `${won / 1000}천`, x, GROUND + 38, 20, B.grey);
    }

    // 과녁 — 계산기를 열면 정확한 자리가 드러난다
    /* 계산기를 열면 과녁이 파랑으로 꽉 찬다. 어림한 자리와 확인한 자리가 채움으로 갈린다. */
    drawBar(ctx, targetX - targetW / 2, GROUND - 76, targetW, 76, {
      fill: calcOpen ? B.blue : B.surface,
      stroke: calcOpen ? B.blue : B.grey,
      width: STROKE.base,
    });
    centerText(ctx, calcOpen ? `${total.toLocaleString()}원` : '합계?',
      targetX, GROUND - 38, 24, calcOpen ? B.ground : B.ink);

    // 지난 탄착점
    for (const mark of marksRef.current) {
      ctx.fillStyle = B.red;
      ctx.fillRect(mark - 3, GROUND - 8, 6, 8);
    }

    // 대포
    ctx.save();
    ctx.translate(GUN_X, GROUND - 26);
    ctx.rotate(toRadians(-angle));
    drawBar(ctx, 0, -8, 26 + power * 0.5, 16,
      { fill: B.yellow, stroke: B.keyline, width: STROKE.hair });
    ctx.restore();
    drawBar(ctx, GUN_X - 30, GROUND - 26, 60, 26,
      { fill: B.surface, stroke: B.keyline, width: STROKE.hair });

    if (shot && !shot.done) {
      drawShape(ctx, 'circle', shot.x, shot.y, 20, { fill: B.ink, stroke: B.keyline, width: 1 });
    }

    // 아이미 풀이
    drawBar(ctx, 20, 14, 470, 30 + basket.lines.length * 30,
      { fill: B.ground, stroke: B.blue, width: STROKE.base });
    centerText(ctx, '아이미의 풀이', 255, 34, 22, B.grey);
    basket.lines.forEach((text, index) => {
      const wrong = calcOpen && index === basket.wrongLine;
      centerText(ctx, text, 255, 62 + index * 30, 22, wrong ? B.redInk : B.ink);
    });

    centerText(ctx, `각도 ${Math.round(angle)}도 · 힘 ${Math.round(power)}`, WORLD_W - 170, 34, 22, B.ink);
    if (wind !== 0) {
      centerText(ctx, '옆바람', WORLD_W - 186, 62, 22, B.grey);
      drawMark(ctx, 'arrow', WORLD_W - 130, 62, 22, B.grey, wind > 0 ? 0 : Math.PI);
    }
  };

  return (
    <MiniGameFrame
      badge="합계 대포"
      instruction="간식의 전체 금액을 먼저 어림해 본 뒤, 각도와 힘을 맞추어 발사해 보세요. 계산기로 정확한 금액을 확인할 수도 있어요."
      progress={{ label: '쏜 횟수', value: maxShots - shots, max: maxShots }}
      hud={<GameHud lives={shots} maxLives={maxShots} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} mark="retry" label="다시 쏘기" />
          <MiniGameButton
            onClick={() => { setCalcOpen(true); playSound('select'); }}
            disabled={!game.playing}
            mark="square"
            label="계산기"
          />
          <MiniGameButton
            onClick={fire}
            disabled={!game.playing}
            mark="arrow"
            markRotate={315}
            label="쏘기"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {basket.items.map((item) => (
            <span
              key={item.name}
              className="px-2 py-1 text-[15px] font-black"
              style={{
                background: 'var(--game-board)',
                border: 'var(--game-hair) solid var(--game-board-grey)',
                color: 'var(--game-board-ink)',
              }}
            >
              {item.name} {item.price.toLocaleString()}원 × {item.count}
            </span>
          ))}
          <span className="text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>
            {calcOpen ? `계산기 · 합계 ${total.toLocaleString()}원` : '↑↓ 각도 · ←→ 힘 · 스페이스 발사'}
          </span>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="game-canvas-fit">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                if (!game.playing) return;
                if (pointer.phase === 'down') fire();
                else if (pointer.phase === 'move') {
                  const dx = pointer.x - GUN_X;
                  const dy = GROUND - 26 - pointer.y;
                  if (dx > 20) setAngle(clamp((Math.atan2(dy, dx) * 180) / Math.PI, 10, 80));
                }
              }}
              ariaLabel={`간식 합계 자리에 포탄을 맞히는 놀이. 남은 발수 ${shots}번.`}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
