import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, drawBar, drawMark, drawShape,
  useCountdown, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m6-l3 · 지도와 표지 미로 (장르 4 · 미로 찾기)
 *
 * m4-l9의 미로가 "함정을 알아보고 피하기"였다면, 이 미로의 문제는 **정보의 어긋남**이다.
 * 왼쪽 작은 지도에 계획한 길이 점선으로 그려져 있는데, 현장에는 공사 구간이 있어
 * 지도대로 가면 막힌다.
 *
 * 표지판을 밟으면 그 자리에서 실제로 갈 수 있는 방향이 드러난다. 지도를 믿을지
 * 표지를 믿을지 고르는 것이 이 차시의 판단이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  /** '#' 벽, '.' 길, 'S' 시작, 'E' 도착, 'X' 공사(지도에는 길로 보임), '!' 표지판 */
  map: string[];
  /** 지도에만 그려지는 계획 경로 */
  planned: [number, number][];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'library',
    label: '기본',
    spoken: '도서관까지 가는 길을 지도와 표지로 확인해요.',
    seconds: 110,
    map: [
      '#############',
      '#S..!...X..E#',
      '#.#.#.#.#.#.#',
      '#...#.#.#.#.#',
      '#.###.#.#.#.#',
      '#.....#...#.#',
      '#.#########.#',
      '#!.........!#',
      '#############',
    ],
    planned: [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [1, 11]],
  },
  {
    id: 'market',
    label: '1단계',
    spoken: '시장까지 가는 길을 지도와 표지로 확인해요.',
    seconds: 100,
    map: [
      '#############',
      '#S...X....E.#',
      '#.#.#.#.#.#.#',
      '#!..#.#.#.#!#',
      '#.#.#.#.#.#.#',
      '#.#.....#...#',
      '#.#######.#.#',
      '#!........!.#',
      '#############',
    ],
    planned: [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10]],
  },
  {
    id: 'station',
    label: '2단계',
    spoken: '역까지 가는 길을 지도와 표지로 확인해요.',
    seconds: 90,
    map: [
      '#############',
      '#S..!..#..!E#',
      '#.#.#.#.#.#.#',
      '#.#.#.#.#.#.#',
      '#.#.#X#.#.#.#',
      '#.#.#.#.#.#.#',
      '#.#.#.#.#.#.#',
      '#!..!..!..!.#',
      '#############',
    ],
    planned: [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [7, 6], [7, 7], [7, 8], [7, 9], [6, 9], [5, 9], [4, 9], [3, 9], [2, 9], [1, 9], [1, 10], [1, 11]],
  },
];

interface World {
  c: number;
  r: number;
  lives: number;
  signs: number;
  finished: boolean;
  note: string;
  moveTimer: number;
}

export default function MapSignMazeGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const rows = stage.map.length;
  const cols = stage.map[0].length;
  const mapW = 250;
  const cell = Math.min((WORLD_W - mapW - 70) / cols, (WORLD_H - 100) / rows);
  const originX = mapW + 50;
  const originY = 78;

  /* 지원 수준은 걷는 속도·기회·시간으로 나타난다. 지도와 표지의 어긋남은 같다. */
  const stepDelay = 0.16 / clamp(tuning.speed, 0.7, 1.4);
  const maxLives = tuning.lives;
  const seconds = Math.round(stage.seconds * tuning.time);

  const startPos = (() => {
    for (let r = 0; r < rows; r += 1) {
      const c = stage.map[r].indexOf('S');
      if (c >= 0) return { c, r };
    }
    return { c: 1, r: 1 };
  })();

  const worldRef = useRef<World>({
    c: startPos.c, r: startPos.r, lives: maxLives, signs: 0, finished: false, note: '', moveTimer: 0,
  });
  const seenSigns = useRef<string[]>([]);
  const [hud, setHud] = useState({ lives: maxLives, signs: 0, note: '' });
  const keys = useGameKeys(game.playing);
  const nudgeRef = useRef<{ c: number; r: number } | null>(null);

  const totalSigns = stage.map.join('').split('!').length - 1;

  useEffect(() => {
    worldRef.current = {
      c: startPos.c, r: startPos.r, lives: maxLives, signs: 0, finished: false, note: '', moveTimer: 0,
    };
    seenSigns.current = [];
    setHud({ lives: maxLives, signs: 0, note: '' });
    nudgeRef.current = null;
  }, [game.round, game.stageIndex, stage, maxLives, startPos.c, startPos.r]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    const w = worldRef.current;
    if (!w.finished) {
      w.finished = true;
      game.fail('시간이 지났어요. 표지판을 밟아 지도와 다른 곳을 먼저 확인해 봐요.');
    }
  });

  const at = (c: number, r: number) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return '#';
    return stage.map[r][c];
  };

  const tryMove = (dc: number, dr: number) => {
    const w = worldRef.current;
    if (w.finished) return;
    const nc = w.c + dc;
    const nr = w.r + dr;
    const tile = at(nc, nr);
    if (tile === '#') return;

    if (tile === 'X') {
      // 지도에는 길로 그려져 있지만 실제로는 공사 중이다
      w.lives -= 1;
      w.note = '지도에는 길이지만 공사 중이에요. 표지판을 보고 다른 길을 찾아 봐요.';
      playSound('select');
      if (w.lives <= 0) {
        w.finished = true;
        game.fail('지도만 믿고 갔다가 막혔어요. 현장 표지를 함께 보고 길을 골라 봐요.');
      }
      return;
    }

    w.c = nc;
    w.r = nr;

    if (tile === '!') {
      const key = `${nr}-${nc}`;
      if (!seenSigns.current.includes(key)) {
        seenSigns.current.push(key);
        w.signs += 1;
        playSound('fill');
        /* 지도에 드러나는 공사 구간이 붉은 세모이므로, 무엇을 찾아보라는 말인지 함께 적는다. */
        w.note = '표지판을 확인했어요. 막힌 곳이 지도에 붉은 세모로 표시됩니다.';
      }
    }

    if (tile === 'E') {
      w.finished = true;
      game.succeed('지도와 현장 표지를 함께 보고 안전한 길로 도착했어요!');
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      w.moveTimer = Math.max(0, w.moveTimer - dt);
      if (w.moveTimer <= 0) {
        let moved = false;
        if (nudgeRef.current) {
          tryMove(nudgeRef.current.c, nudgeRef.current.r);
          nudgeRef.current = null;
          moved = true;
        } else if (keys.held.current.left) { tryMove(-1, 0); moved = true; }
        else if (keys.held.current.right) { tryMove(1, 0); moved = true; }
        else if (keys.held.current.up) { tryMove(0, -1); moved = true; }
        else if (keys.held.current.down) { tryMove(0, 1); moved = true; }
        if (moved) w.moveTimer = stepDelay;
      }
      if (w.lives !== hud.lives || w.signs !== hud.signs || w.note !== hud.note) {
        setHud({ lives: w.lives, signs: w.signs, note: w.note });
      }
    }

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    drawBar(ctx, 20, 12, WORLD_W - 40, 46, { fill: B.ground, stroke: B.blue, width: STROKE.base });
    centerText(ctx, w.note || '왼쪽은 계획한 지도, 오른쪽은 지금 있는 곳입니다.', WORLD_W / 2, 35, 22, B.ink);

    // 왼쪽 — 계획 지도
    const mapCell = Math.min(mapW / cols, 220 / rows);
    const mx = 24;
    const my = 120;
    /* 지도는 판을 두르는 회색 틀이다. 길은 바탕보다 한 겹 뜬 면으로 그리고 벽은 바탕에
       그대로 잠기게 둔다. 지도에서 읽어야 하는 것은 벽이 아니라 갈 수 있는 길이다. */
    drawBar(ctx, mx - 8, my - 30, mapW + 16, rows * mapCell + 46,
      { fill: B.ground, stroke: B.grey, width: STROKE.base });
    centerText(ctx, '계획한 지도', mx + mapW / 2, my - 12, 22, B.ink);
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const tile = at(c, r);
        const wall = tile === '#';
        ctx.fillStyle = wall ? B.ground : B.surface;
        ctx.fillRect(mx + c * mapCell, my + r * mapCell, mapCell - 1, mapCell - 1);
      }
    }
    /* 계획한 길은 학생이 손에 쥔 것이므로 노랑이다. 점선인 것은 그것이 아직 계획일 뿐,
       현장에서 확인한 길이 아니라는 뜻이다. */
    ctx.strokeStyle = B.yellow;
    ctx.lineWidth = STROKE.hair;
    ctx.lineCap = 'butt';
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    stage.planned.forEach(([r, c], index) => {
      const px = mx + c * mapCell + mapCell / 2;
      const py = my + r * mapCell + mapCell / 2;
      if (index === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    // 확인한 표지판이 알려 준 공사 구간을 지도에도 표시한다
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        if (at(c, r) !== 'X' || seenSigns.current.length === 0) continue;
        /* 현장에서 본 것과 같은 붉은 세모다. 지도와 현장이 같은 모양으로 말해야
           둘을 견주는 일이 성립한다. */
        drawShape(ctx, 'triangle', mx + c * mapCell + mapCell / 2, my + r * mapCell + mapCell / 2,
          mapCell * 0.96, { fill: B.red });
      }
    }

    // 오른쪽 — 실제 길
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const tile = at(c, r);
        const x = originX + c * cell;
        const y = originY + r * cell;
        if (tile === '#') {
          drawBar(ctx, x, y, cell, cell, { fill: B.ground, stroke: B.grey, width: STROKE.hair });
          continue;
        }
        drawBar(ctx, x, y, cell, cell, { fill: B.surface, stroke: B.ground, width: STROKE.hair });
        if (tile === 'X') {
          /* 공사 구간은 붉은 세모다. 판마다 위험은 늘 붉은 세모이므로 글자를 읽지 않아도 안다. */
          drawShape(ctx, 'triangle', x + cell / 2, y + cell / 2, cell * 0.74,
            { fill: B.red, stroke: B.keyline, width: STROKE.hair });
        } else if (tile === '!') {
          /* 표지판은 읽기 전과 읽은 뒤가 색과 마크로 함께 갈린다. 판 위에서 붉음과 푸름의
             대비는 1.22라, 색만 뒤집으면 색을 구별하지 못하는 학생에게는 아무 일도 없다. */
          const seen = seenSigns.current.includes(`${r}-${c}`);
          drawBar(ctx, x + 3, y + 3, cell - 6, cell - 6, {
            fill: seen ? B.blue : B.surface,
            stroke: seen ? B.blue : B.grey,
            width: STROKE.base,
          });
          drawMark(ctx, seen ? 'check' : 'bang', x + cell / 2, y + cell / 2,
            Math.min(24, cell * 0.5), seen ? B.ground : B.grey);
        } else if (tile === 'E') {
          /* 도착은 속이 꽉 찬 파랑 사각형 하나뿐이다. 확인한 표지판도 파랑이지만 그쪽은
             확인 표시를 얹고, 이쪽은 가운데를 비운 과녁이라 둘이 섞이지 않는다. */
          drawBar(ctx, x + 2, y + 2, cell - 4, cell - 4,
            { fill: B.blue, stroke: B.keyline, width: STROKE.hair });
          drawShape(ctx, 'square', x + cell / 2, y + cell / 2, cell * 0.34, { fill: B.ground });
        }
      }
    }

    const hx = originX + w.c * cell + cell / 2;
    const hy = originY + w.r * cell + cell / 2;
    drawShape(ctx, 'circle', hx, hy, cell * 0.64,
      { fill: B.yellow, stroke: B.keyline, width: STROKE.base });
  };

  return (
    <MiniGameFrame
      badge="지도와 표지 미로"
      instruction="왼쪽 지도의 점선만 믿지 말고, 길가의 표지판을 직접 밟아 확인하며 걸어가세요. 공사 중인 붉은 세모 칸은 피해서 안전하게 가야 해요."
      progress={{ label: '확인한 표지', value: hud.signs, max: totalSigns }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => { nudgeRef.current = { c: 0, r: -1 }; }} mark="arrow" markRotate={270} label="위" />
          <MiniGameButton onClick={() => { nudgeRef.current = { c: 0, r: 1 }; }} mark="arrow" markRotate={90} label="아래" />
          <MiniGameButton onClick={() => { nudgeRef.current = { c: -1, r: 0 }; }} mark="arrow" markRotate={180} label="왼쪽" />
          <MiniGameButton onClick={() => { nudgeRef.current = { c: 1, r: 0 }; }} mark="arrow" label="오른쪽" />
          <MiniGameButton onClick={game.retry} mark="retry" label="다시" variant="primary" />
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
              if (pointer.phase !== 'down') return;
              const w = worldRef.current;
              const hx = originX + w.c * cell + cell / 2;
              const hy = originY + w.r * cell + cell / 2;
              const dx = pointer.x - hx;
              const dy = pointer.y - hy;
              if (Math.abs(dx) > Math.abs(dy)) nudgeRef.current = { c: dx > 0 ? 1 : -1, r: 0 };
              else nudgeRef.current = { c: 0, r: dy > 0 ? 1 : -1 };
            }}
            ariaLabel={`지도와 현장 표지를 견주며 길을 찾는 놀이. 확인한 표지 ${hud.signs}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
