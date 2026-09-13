import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, CANVAS_FONT, GameCanvas, GameHud, STROKE, centerText, clamp, drawBar, drawPanel, drawPop, drawSegments,
  drawShape, drawTag, paintBoard, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m6-l7 · 하루 길 달리기 (장르 1 · 횡스크롤 점프맵)
 *
 * **도장을 챙길까, 쉬어 갈까.** 노랑 원은 저절로 달리고 학생은 누르기 하나로 뛴다. 달리는
 * 만큼 힘이 줄고, 바닥의 쉬는 자리를 지나가면 힘이 다시 찬다. 갈림길에서는 위 발판에 체험
 * 도장이, 그 아래 바닥에 쉬는 자리가 겹쳐 있어 둘 중 하나만 고른다.
 *
 * 수치는 규칙 한 줄로 읽히게 맞췄다 — **쉬는 자리를 한 번 건너뛰는 것은 괜찮고, 연달아 두 번
 * 건너뛰면 힘이 모자란다.** 모아야 할 도장은 늘 "그냥 달려도 줍는 도장 + 한두 개"라서, 한
 * 번은 욕심을 내야 이긴다. 뛰기 솜씨가 좋으면 발판 위에서 한 번 더 뛰어야 닿는 높은 도장으로
 * 그 욕심을 대신한다.
 *
 * 차시와의 연결은 소재 수준이다. 도장에는 축제 체험의 이름이, 쉬는 자리에는 휴식·점심·도움
 * 시간이 적혀 있다. 판을 푸는 열쇠는 글이 아니라 모양과 자리다.
 *
 * 같은 장르를 쓰는 m3-l5(이야기 길 뛰기)와 조작이 다르다. m3-l5는 학생이 좌우로 걸으며 발판의
 * 글을 읽고 결말로 이어지는 쪽을 고르는 판이다. 여기는 달리기가 저절로라 누르기 하나만 남고,
 * 고르는 것은 글이 아니라 "힘을 얼마나 남겨 둘까"다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

/** 바닥 윗면과 떠 있는 발판 윗면 */
const GROUND_Y = 410;
const PLAT_Y = 290;
const PLAT_H = 22;
const HERO_R = 22;
/** 화면에서 노랑 원이 머무는 자리. 앞이 넉넉히 보여야 미리 고른다. */
const HERO_SCREEN_X = 220;

const RUN = 240;
const GRAVITY = 1500;
const JUMP_V = 680;
/** 발판 끝을 막 지난 뒤에도 뛰기를 받아 주는 시간. 손이 조금 늦은 것을 구덩이로 벌하지 않는다. */
const COYOTE = 0.08;
/** 내려앉기 직전에 누른 것을 기억하는 시간 */
const JUMP_BUFFER = 0.14;
const INVULN = 1.2;

/** 힘이 가득일 때 달릴 수 있는 거리. 쉬는 자리 사이는 약 1500이다. */
const TANK = 4400;
/** 쉬는 자리에서 1px 지날 때 차는 힘(가득 100). 쉬는 자리 한 곳이면 거의 가득 찬다. */
const REST_RATE = 0.5;

const STAMP_SIZE = 40;
const STAMP_HIT = 24;
const SPIKE_SIZE = 48;

type Piece =
  | { kind: 'flat'; w: number }
  | { kind: 'stamp'; label: string }
  | { kind: 'gap'; g: number }
  | { kind: 'spike' }
  | { kind: 'rest'; label: string }
  | { kind: 'high'; label: string }
  | { kind: 'bonus'; label: string }
  | { kind: 'fork'; label: string; rest: string };

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  start: string;
  need: number;
  /** 흐르는 시간의 배율. 늦게 출발한 날은 서두른다. */
  pace: number;
  pieces: Piece[];
}

/*
 * 판 셋의 도장 수와 쉬는 자리의 간격은 계산으로 맞췄다(쉬는 자리 하나를 건너뛰면 힘이 8~60%
 * 남고, 연달아 둘을 건너뛰면 모자란다). 조각을 옮기면 이 균형이 깨지니 함께 다시 잰다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'festival',
    label: '기본',
    scene: '축제 가는 날',
    start: '9:00',
    spoken: '누르면 뛰어요. 도장을 모으고 쉬는 자리에서 힘을 채워요.',
    need: 4,
    pace: 1,
    pieces: [
      { kind: 'flat', w: 420 },
      { kind: 'stamp', label: '부스 체험' },
      { kind: 'gap', g: 130 },
      { kind: 'rest', label: '휴식' },
      { kind: 'high', label: '만들기' },
      { kind: 'bonus', label: '사진' },
      { kind: 'spike' },
      { kind: 'fork', label: '공연', rest: '물 마시기' },
      { kind: 'stamp', label: '놀이' },
      { kind: 'gap', g: 150 },
      { kind: 'spike' },
      { kind: 'fork', label: '먹거리', rest: '점심' },
      { kind: 'gap', g: 140 },
      { kind: 'flat', w: 480 },
    ],
  },
  {
    id: 'busy',
    label: '1단계',
    scene: '체험이 많은 날',
    start: '9:00',
    spoken: '도장이 다섯 개 필요해요. 쉬는 자리를 연달아 건너뛰지 말아요.',
    need: 5,
    pace: 1,
    pieces: [
      { kind: 'flat', w: 420 },
      { kind: 'stamp', label: '부스 체험' },
      { kind: 'spike' },
      { kind: 'gap', g: 140 },
      { kind: 'rest', label: '휴식' },
      { kind: 'high', label: '만들기' },
      { kind: 'bonus', label: '사진' },
      { kind: 'fork', label: '공연', rest: '물 마시기' },
      { kind: 'gap', g: 150 },
      { kind: 'stamp', label: '놀이' },
      { kind: 'spike' },
      { kind: 'fork', label: '먹거리', rest: '점심' },
      { kind: 'high', label: '그리기' },
      { kind: 'gap', g: 160 },
      { kind: 'fork', label: '악기', rest: '도움 시간' },
      { kind: 'bonus', label: '인형극' },
      { kind: 'spike' },
      { kind: 'flat', w: 480 },
    ],
  },
  {
    id: 'late',
    label: '2단계',
    scene: '출발이 늦은 날',
    start: '9:30',
    spoken: '늦게 출발해서 조금 빨라요. 도장이 여섯 개 필요해요.',
    need: 6,
    pace: 1.15,
    pieces: [
      { kind: 'flat', w: 420 },
      { kind: 'stamp', label: '부스 체험' },
      { kind: 'spike' },
      { kind: 'gap', g: 140 },
      { kind: 'fork', label: '공연', rest: '물 마시기' },
      { kind: 'high', label: '만들기' },
      { kind: 'bonus', label: '사진' },
      { kind: 'fork', label: '먹거리', rest: '점심' },
      { kind: 'gap', g: 150 },
      { kind: 'stamp', label: '놀이' },
      { kind: 'high', label: '그리기' },
      { kind: 'fork', label: '악기', rest: '도움 시간' },
      { kind: 'gap', g: 160 },
      { kind: 'bonus', label: '인형극' },
      { kind: 'flat', w: 420 },
    ],
  },
];

interface Seg { x: number; w: number }
interface Stamp { x: number; y: number; label: string; got: boolean }
interface Rest { x: number; w: number; label: string }

interface Level {
  grounds: Seg[];
  plats: Seg[];
  spikes: number[];
  stamps: Stamp[];
  rests: Rest[];
  home: number;
}

function buildLevel(stage: StageConfig, gapScale: number): Level {
  const level: Level = { grounds: [], plats: [], spikes: [], stamps: [], rests: [], home: 0 };
  let x = 0;
  for (const piece of stage.pieces) {
    switch (piece.kind) {
      case 'flat':
        level.grounds.push({ x, w: piece.w });
        x += piece.w;
        break;
      case 'stamp':
        level.grounds.push({ x, w: 360 });
        level.stamps.push({ x: x + 180, y: GROUND_Y - 30, label: piece.label, got: false });
        x += 360;
        break;
      case 'gap': {
        const g = Math.round(piece.g * gapScale);
        level.grounds.push({ x, w: 180 }, { x: x + 180 + g, w: 180 });
        x += 360 + g;
        break;
      }
      case 'spike':
        level.grounds.push({ x, w: 360 });
        level.spikes.push(x + 180);
        x += 360;
        break;
      case 'rest':
        level.grounds.push({ x, w: 520 });
        level.rests.push({ x: x + 100, w: 320, label: piece.label });
        x += 520;
        break;
      case 'high':
        /* 삼각형을 넘으면 저절로 발판에 내려앉고, 발판 위 도장을 지나간다. */
        level.grounds.push({ x, w: 600 });
        level.spikes.push(x + 300);
        level.plats.push({ x: x + 160, w: 320 });
        level.stamps.push({ x: x + 340, y: PLAT_Y - 30, label: piece.label, got: false });
        x += 600;
        break;
      case 'bonus':
        /* 높은 도장. 바닥에서 뛰어서는 닿지 않고, 발판에 올라가 한 번 더 뛰어야 닿는다.
           처음에는 구덩이 한가운데 꼭대기에 두었는데, 뛰기의 꼭대기가 넓고 평평해서 구덩이만
           넘어도 저절로 먹혔다. 솜씨 도장이 아니라 공짜 도장이 되어 있었다. */
        level.grounds.push({ x, w: 540 });
        level.plats.push({ x: x + 100, w: 340 });
        level.stamps.push({ x: x + 330, y: PLAT_Y - HERO_R - 120, label: piece.label, got: false });
        x += 540;
        break;
      case 'fork':
        /* 발판 첫머리의 도장과 발판 아래 쉬는 자리가 겹친다. 도장을 따러 뛰어오르면 발판을
           타고 쉬는 자리 위를 지나가 버린다. */
        level.grounds.push({ x, w: 680 });
        level.plats.push({ x: x + 140, w: 420 });
        level.stamps.push({ x: x + 210, y: PLAT_Y - 30, label: piece.label, got: false });
        level.rests.push({ x: x + 160, w: 420, label: piece.rest });
        x += 680;
        break;
      default:
        break;
    }
  }
  level.home = x - 160;
  return level;
}

interface World {
  level: Level;
  x: number;
  y: number;
  vy: number;
  /** 마지막으로 발을 디딘 뒤 흐른 시간 */
  airTime: number;
  jumpBuffer: number;
  jumped: boolean;
  onPlat: boolean;
  resting: string;
  stamina: number;
  lives: number;
  invuln: number;
  pop: { text: string; x: number; y: number; t: number } | null;
  phase: 'ready' | 'run';
  finished: boolean;
}

const POP_TIME = 0.8;

function freshWorld(level: Level, lives: number): World {
  return {
    level, x: 120, y: GROUND_Y - HERO_R, vy: 0, airTime: 0, jumpBuffer: 0, jumped: false,
    onPlat: false, resting: '', stamina: 100, lives, invuln: 0, pop: null, phase: 'ready', finished: false,
  };
}

const over = (seg: Seg, x: number) => x >= seg.x && x <= seg.x + seg.w;

/** 가까운 앞일을 말로 적는다. 화면 읽기 도구로 판을 따라가는 학생에게 필요하다. */
function aheadText(w: World): string {
  const { level } = w;
  const within = (x: number) => x > w.x && x - w.x < 520;
  const events: Array<{ x: number; text: string }> = [];
  level.spikes.filter(within).forEach((x) => events.push({ x, text: '삼각형' }));
  level.grounds.forEach((seg, i) => {
    const next = level.grounds[i + 1];
    if (next && next.x > seg.x + seg.w && within(seg.x + seg.w)) events.push({ x: seg.x + seg.w, text: '구덩이' });
  });
  level.rests.filter((r) => within(r.x)).forEach((r) => events.push({ x: r.x, text: `쉬는 자리(${r.label})` }));
  level.stamps.filter((s) => !s.got && within(s.x)).forEach((s) => events.push({ x: s.x, text: `도장(${s.label})` }));
  events.sort((a, b) => a.x - b.x);
  return events.length > 0 ? `앞에 ${events.slice(0, 2).map((e) => e.text).join(', ')}` : '앞이 평평해요';
}

export default function DayPlanJumpGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 흐르는 빠르기·힘의 크기·구덩이 폭·기회로 나타난다. 길의 차례와 도장 수는 셋 모두 같다. */
  const timeScale = clamp(tuning.speed, 0.65, 1.32) * stage.pace;
  const tank = TANK * clamp(tuning.tolerance, 0.92, 1.3);
  const gapScale = clamp(1 / tuning.size, 0.8, 1.1);
  const maxLives = tuning.lives;

  const keys = useGameKeys(game.playing);
  const tapRef = useRef(false);
  const worldRef = useRef<World>(freshWorld(buildLevel(stage, gapScale), maxLives));
  const [view, setView] = useState({ got: 0, lives: maxLives, cells: 10, ahead: '' });

  useEffect(() => {
    const w = freshWorld(buildLevel(stage, gapScale), maxLives);
    worldRef.current = w;
    tapRef.current = false;
    setView({ got: 0, lives: maxLives, cells: 10, ahead: aheadText(w) });
  }, [game.round, game.stageIndex, stage, gapScale, maxLives]);

  const step = (w: World, dt: number) => {
    const { level } = w;
    const jumpPressed = tapRef.current || keys.consumePress('action') || keys.consumePress('up');
    tapRef.current = false;

    if (w.phase === 'ready') {
      /* 학생이 처음 누를 때까지 멈춰 있다. 규칙을 읽는 사이에 구덩이에 빠지면 실패가 벌이 된다. */
      if (jumpPressed) { w.phase = 'run'; playSound('confirm'); }
      return;
    }

    if (jumpPressed) w.jumpBuffer = JUMP_BUFFER;
    else w.jumpBuffer = Math.max(0, w.jumpBuffer - dt);

    const prevBottom = w.y + HERO_R;
    const dx = RUN * dt;
    w.x += dx;
    w.vy += GRAVITY * dt;
    w.y += w.vy * dt;
    w.airTime += dt;

    // 내려앉기 — 발판과 바닥은 아래에서 뚫고 올라가고, 위에서만 밟힌다.
    let landed = false;
    let onPlat = false;
    if (w.vy >= 0) {
      const bottom = w.y + HERO_R;
      for (const plat of level.plats) {
        if (over(plat, w.x) && prevBottom <= PLAT_Y + 1 && bottom >= PLAT_Y) {
          w.y = PLAT_Y - HERO_R; landed = true; onPlat = true; break;
        }
      }
      if (!landed) {
        for (const seg of level.grounds) {
          /* 바닥 모서리에 조금 모자라게 닿은 것은 끌어올린다. */
          if (over(seg, w.x) && prevBottom <= GROUND_Y + 14 && bottom >= GROUND_Y) {
            w.y = GROUND_Y - HERO_R; landed = true; break;
          }
        }
      }
    }
    if (landed) {
      w.vy = 0;
      w.airTime = 0;
      w.jumped = false;
    }
    w.onPlat = onPlat;

    if (w.jumpBuffer > 0 && !w.jumped && w.airTime <= COYOTE) {
      w.vy = -JUMP_V;
      w.jumped = true;
      w.jumpBuffer = 0;
      w.airTime = COYOTE + 0.01;
    }

    // 힘 — 바닥의 쉬는 자리에 발을 딛고 있으면 차고, 아니면 달린 만큼 준다.
    const grounded = landed && !onPlat;
    const rest = grounded ? level.rests.find((r) => over(r, w.x)) : undefined;
    if (rest) {
      w.stamina = Math.min(100, w.stamina + REST_RATE * dx);
      w.resting = rest.label;
    } else {
      w.stamina -= (100 / tank) * dx;
      w.resting = '';
    }

    // 도장
    for (const stamp of level.stamps) {
      if (stamp.got) continue;
      if (Math.hypot(stamp.x - w.x, stamp.y - w.y) < HERO_R + STAMP_HIT) {
        stamp.got = true;
        w.pop = { text: '도장!', x: stamp.x, y: stamp.y - 40, t: POP_TIME };
        playSound('stamp');
      }
    }

    // 삼각형
    w.invuln = Math.max(0, w.invuln - dt);
    if (w.invuln <= 0) {
      for (const sx of level.spikes) {
        if (Math.hypot(sx - w.x, GROUND_Y - 14 - w.y) < HERO_R + 12) {
          w.lives -= 1;
          w.invuln = INVULN;
          w.pop = { text: '앗!', x: w.x, y: w.y - 50, t: POP_TIME };
          playSound('select');
          break;
        }
      }
    }

    // 구덩이 — 빠지면 기회 하나를 쓰고 건너편에 내려 준다.
    if (w.y + HERO_R > GROUND_Y + 30) {
      const next = level.grounds.find((seg) => seg.x + seg.w > w.x && seg.x >= w.x - HERO_R * 2);
      w.lives -= 1;
      w.x = Math.max(w.x, next ? next.x : w.x) + 40;
      w.y = GROUND_Y - HERO_R;
      w.vy = 0;
      w.airTime = 0;
      w.jumped = false;
      w.invuln = INVULN;
      w.pop = { text: '앗!', x: w.x, y: w.y - 50, t: POP_TIME };
      playSound('select');
    }

    if (w.pop) { w.pop.t -= dt; if (w.pop.t <= 0) w.pop = null; }

    const got = level.stamps.filter((s) => s.got).length;
    const reachable = level.stamps.filter((s) => !s.got && s.x > w.x - HERO_R * 2).length;
    if (w.lives <= 0) {
      w.finished = true;
      game.fail('구덩이와 삼각형에 너무 많이 걸렸어요. 조금 일찍 눌러 뛰어 봐요.');
    } else if (w.stamina <= 0) {
      w.stamina = 0;
      w.finished = true;
      game.fail('힘이 다 떨어졌어요. 쉬는 자리를 연달아 건너뛰지 말아요.');
    } else if (got + reachable < stage.need) {
      w.finished = true;
      game.fail(`도장을 너무 많이 놓쳤어요. 이 길에서는 도장이 ${stage.need}개 필요해요.`);
    } else if (w.x >= level.home) {
      w.finished = true;
      if (got >= stage.need) {
        game.succeed(`체험 도장 ${got}개를 모으고 쉬는 시간도 챙겨서 집까지 왔어요!`);
      } else {
        game.fail(`집에 왔지만 도장이 ${stage.need - got}개 모자라요.`);
      }
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    const { level } = w;
    if (dt > 0 && game.playing && !w.finished) {
      /* 한 프레임이 길면 나눠 돈다. 구덩이 모서리를 건너뛰어 발이 바닥을 뚫지 않게 한다. */
      const total = dt * timeScale;
      const parts = Math.ceil(total / 0.02);
      for (let i = 0; i < parts && !w.finished; i += 1) step(w, total / parts);

      const got = level.stamps.filter((s) => s.got).length;
      const cells = Math.ceil(w.stamina / 10);
      const ahead = aheadText(w);
      if (got !== view.got || w.lives !== view.lives || cells !== view.cells || ahead !== view.ahead) {
        setView({ got, lives: w.lives, cells, ahead });
      }
    }

    const cam = w.x - HERO_SCREEN_X;
    const sx = (x: number) => x - cam;
    const visible = (x: number, width = 0) => sx(x) + width > -80 && sx(x) < WORLD_W + 80;

    paintBoard(ctx, WORLD_W, WORLD_H);

    // 쉬는 자리 — 바닥 위 긴 의자와 이름표
    for (const rest of level.rests) {
      if (!visible(rest.x, rest.w)) continue;
      const left = sx(rest.x);
      drawBar(ctx, left + 16, GROUND_Y - 30, rest.w - 32, 12, { fill: B.grey, stroke: B.shadow, width: 2, lift: 3 });
      drawBar(ctx, left + 36, GROUND_Y - 18, 10, 18, { fill: B.grey });
      drawBar(ctx, left + rest.w - 46, GROUND_Y - 18, 10, 18, { fill: B.grey });
      const active = w.resting === rest.label && w.x >= rest.x && w.x <= rest.x + rest.w;
      drawTag(ctx, rest.label, left + rest.w / 2, GROUND_Y - 58, {
        fill: active ? B.yellow : B.high, ink: active ? B.ground : B.ink, align: 'center',
      });
    }

    // 바닥
    for (const seg of level.grounds) {
      if (!visible(seg.x, seg.w)) continue;
      drawBar(ctx, sx(seg.x), GROUND_Y, seg.w, 80, { fill: B.surface, stroke: B.line, width: STROKE.hair, lift: 4 });
    }

    // 떠 있는 발판
    for (const plat of level.plats) {
      if (!visible(plat.x, plat.w)) continue;
      drawBar(ctx, sx(plat.x), PLAT_Y, plat.w, PLAT_H, { fill: B.high, stroke: B.grey, width: STROKE.hair, lift: 4 });
    }

    // 삼각형
    for (const x of level.spikes) {
      if (!visible(x)) continue;
      drawShape(ctx, 'triangle', sx(x), GROUND_Y - SPIKE_SIZE / 2 + 4, SPIKE_SIZE, {
        fill: B.red, stroke: B.keyline, width: STROKE.hair,
      });
    }

    // 도장
    for (const stamp of level.stamps) {
      if (stamp.got || !visible(stamp.x)) continue;
      drawShape(ctx, 'square', sx(stamp.x), stamp.y, STAMP_SIZE, {
        fill: B.blue, stroke: B.keyline, width: STROKE.hair, lift: 3,
      });
      /* 높은 도장은 이름을 아래에 적는다. 위에 적으면 위 띠의 패널에 가려진다. */
      centerText(ctx, stamp.label, sx(stamp.x), stamp.y < 200 ? stamp.y + 38 : stamp.y - 38, 20, B.ink);
    }

    // 집
    if (visible(level.home, 140)) {
      drawBar(ctx, sx(level.home), GROUND_Y - 150, 140, 150, { fill: B.blue, stroke: B.keyline, width: STROKE.base, lift: 5 });
      centerText(ctx, '집', sx(level.home) + 70, GROUND_Y - 75, 30, B.ink);
    }

    // 노랑 원
    const blink = w.invuln > 0 && Math.floor(w.invuln * 10) % 2 === 0;
    if (!blink) {
      drawShape(ctx, 'circle', HERO_SCREEN_X, w.y, HERO_R * 2, { fill: B.yellow, stroke: B.keyline, width: STROKE.base, lift: 3 });
    }
    if (w.resting) centerText(ctx, '쉬는 중', HERO_SCREEN_X, w.y - 42, 20, B.yellow);

    if (w.pop) {
      const grow = Math.min(1, (POP_TIME - w.pop.t) * 8);
      drawPop(ctx, w.pop.text, sx(w.pop.x), w.pop.y, { scale: 0.8 + grow * 0.2, size: 26 });
    }

    // 위 띠 — 왼쪽은 힘, 오른쪽은 하루 길
    const low = w.stamina <= 30;
    drawPanel(ctx, 24, 16, 300, 82, { header: low ? '힘 · 쉬어 가요!' : '힘', accent: low ? B.red : B.yellow });
    drawSegments(ctx, 38, 64, 272, 22, w.stamina / 10, 10, { fill: low ? B.red : B.yellow });

    drawPanel(ctx, 344, 16, 592, 82, { header: stage.scene, accent: B.blue });
    const trackL = 372;
    const trackR = 900;
    const toTrack = (x: number) => trackL + clamp(x / level.home, 0, 1) * (trackR - trackL);
    drawBar(ctx, trackL, 72, trackR - trackL, 6, { fill: B.line });
    for (const rest of level.rests) {
      drawBar(ctx, toTrack(rest.x), 66, Math.max(8, toTrack(rest.x + rest.w) - toTrack(rest.x)), 18, { fill: B.grey });
    }
    for (const stamp of level.stamps) {
      const tx = toTrack(stamp.x);
      if (stamp.got) drawShape(ctx, 'square', tx, 75, 14, { fill: B.blue, stroke: B.keyline, width: 1 });
      else drawShape(ctx, 'square', tx, 75, 12, { stroke: stamp.x < w.x ? B.line : B.blueInk, width: 2 });
    }
    drawShape(ctx, 'square', trackR + 14, 75, 20, { fill: B.blue, stroke: B.keyline, width: 2 });
    drawShape(ctx, 'circle', toTrack(w.x), 75, 18, { fill: B.yellow, stroke: B.keyline, width: 2 });
    ctx.font = `700 20px ${CANVAS_FONT}`;
    ctx.fillStyle = B.grey;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(stage.start, 920, 36);

    // 아래 띠 — 무엇이 무엇인지
    drawShape(ctx, 'triangle', 40, 516, 20, { fill: B.red, stroke: B.keyline, width: 1 });
    centerText(ctx, '뛰어넘기', 100, 516, 20, B.grey);
    drawShape(ctx, 'square', 190, 516, 18, { fill: B.blue, stroke: B.keyline, width: 1 });
    centerText(ctx, `도장 ${stage.need}개 모으기`, 276, 516, 20, B.grey);
    drawBar(ctx, 380, 510, 30, 10, { fill: B.grey });
    centerText(ctx, '지나가면 힘이 차요 · 연달아 건너뛰면 모자라요', 620, 516, 20, B.grey);

    if (w.phase === 'ready' && !w.finished) {
      drawBar(ctx, WORLD_W / 2 - 250, 180, 500, 64, { fill: B.ground, stroke: B.yellow, width: STROKE.base, lift: 4 });
      centerText(ctx, '누르면 달리기 시작 · 누를 때마다 뛰어요', WORLD_W / 2, 212, 24, B.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="하루 길 달리기"
      instruction="화면이나 스페이스를 누르면 노랑 원이 뜁니다. 파랑 도장을 모으고 빨강 삼각형과 구덩이는 뛰어넘어 보세요. 달리면 힘이 줄고, 쉬는 자리를 지나가면 힘이 다시 찹니다."
      progress={{ label: '모은 도장', value: view.got, max: stage.need }}
      hud={<GameHud lives={view.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="px-1 text-[15px] font-bold" style={{ color: 'var(--game-ink)' }}>
          {stage.scene} · 갈림길에서는 위의 도장과 아래 쉬는 자리 가운데 하나만 챙길 수 있어요.
        </p>
      }
      actions={
        <>
          <MiniGameButton onClick={() => { tapRef.current = true; }} mark="arrow" markRotate={270} label="뛰기" />
          <MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" variant="primary" />
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
              if (pointer.phase === 'down') tapRef.current = true;
            }}
            ariaLabel={`하루 길을 달리는 놀이. ${view.ahead}. 힘 ${view.cells}칸, 모은 도장 ${view.got}개, 남은 기회 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
