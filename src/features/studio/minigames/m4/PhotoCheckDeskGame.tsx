import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, dist, panel, pointInRect, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m4-l5 · 사진 검사대 (장르 11 · 숨은 그림 찾기)
 *
 * "보내기 전에 확인한다"를 눈으로 하는 일로 만든다. 사진은 처음부터 또렷하지 않다.
 * 돋보기를 끌어 안쪽을 또렷하게 만들어야 얼굴·이름표·간판·다른 사람이 드러나고,
 * 확인하지 않은 곳은 덮이지도 않는다. 그래서 학생은 반드시 먼저 살펴보게 된다.
 *
 * 가리기에는 값이 있다. 스티커를 크게 만들면 덮기는 쉬워지지만 무엇을 찍은 사진인지
 * 알 수 없어진다. 정답 크기가 하나로 정해져 있지 않고 "덮을 만큼만 덮는 크기"를
 * 학생이 손으로 찾아야 하며, 알아볼 수 있는 면이 절반 아래로 내려가면 기회가 줄어든다.
 * 이것이 이 차시의 세 번째 선택지인 "보내지 않기"를 몸으로 겪게 하는 자리다.
 */

const W = 960;
const H = 540;
const TOP = { x: 24, y: 10, w: 912, h: 52 };
const PHOTO = { x: 24, y: 72, w: 912, h: 330 };
const DRAWER = { x: 24, y: 412, w: 912, h: 116 };
const SOURCE = { x: 46, y: 434, w: 170, h: 76 };
const BAR = { x: 628, y: 462, w: 286, h: 32 };
const GROUND_Y = PHOTO.y + PHOTO.h * 0.6;
const MIN_W = 54;
const MIN_H = 42;
const MAX_W = 360;
const MAX_H = 260;
/** 사진이 사진으로 남으려면 알아볼 수 있는 면이 절반은 있어야 한다. */
const VISIBLE_FLOOR = 0.5;

/** 사진 속 색. 어두운 판 위에 얹히는 한 장이라 형광 없이 서로만 구분되면 된다. */
const TONE = {
  sky: '#3B5A7A', ground: '#3F6B45', wall: '#475569', wallEdge: '#94A3B8',
  sign: '#F1F5F9', signEdge: '#0369A1', signInk: '#0F172A',
  skin: '#E8B98C', skinEdge: '#7C4A15', tag: '#FDE68A', tagEdge: '#B45309',
  trunk: '#78350F', leaf: '#166534', ball: '#F8FAFC', bench: '#92400E',
  ink: '#1F2937', sticker: '#1E293B',
};

interface Person { x: number; footY: number; s: number; coat: string }
interface Prop { kind: 'tree' | 'ball' | 'bench'; x: number; y: number; s: number }
interface Clue { id: string; name: string; x: number; y: number; w: number; h: number; found: boolean; covered: boolean }
interface Sticker { x: number; y: number; w: number; h: number }

interface StageConfig {
  id: string;
  label: string;
  title: string;
  spoken: string;
  building: { x: number; y: number; w: number; h: number };
  sign: { x: number; y: number; w: number; h: number; text: string; size: number; name: string };
  me: Person;
  other: Person;
  extras: Person[];
  props: Prop[];
  tagText: string;
}

/**
 * 단계가 오를수록 사람과 간판이 작아진다. 조작은 그대로이고 "찾아내야 하는 크기"만
 * 줄어든다 — 단계마다 다른 게임이 되지 않게 하려는 제약이다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'field', label: '기본',
    title: '운동장에서 찍은 우리 반 사진',
    spoken: '운동장 사진을 검사합니다.',
    building: { x: 56, y: 108, w: 236, h: 162 },
    sign: { x: 70, y: 140, w: 210, h: 48, text: '햇살중학교', size: 30, name: '학교 간판' },
    me: { x: 452, footY: 372, s: 1, coat: '#C4B5FD' },
    other: { x: 792, footY: 336, s: 0.82, coat: '#FBBF24' },
    extras: [
      { x: 336, footY: 368, s: 0.92, coat: '#38BDF8' },
      { x: 566, footY: 366, s: 0.94, coat: '#FB7185' },
    ],
    props: [
      { kind: 'tree', x: 672, y: 300, s: 1 },
      { kind: 'ball', x: 250, y: 378, s: 1 },
      { kind: 'bench', x: 880, y: 352, s: 0.9 },
    ],
    tagText: '하늘',
  },
  {
    id: 'trip', label: '1단계',
    title: '소풍 가서 찍은 사진',
    spoken: '소풍 사진을 검사합니다.',
    building: { x: 646, y: 120, w: 214, h: 150 },
    sign: { x: 664, y: 150, w: 178, h: 42, text: '가온공원', size: 28, name: '장소 간판' },
    me: { x: 300, footY: 372, s: 0.86, coat: '#C4B5FD' },
    other: { x: 520, footY: 344, s: 0.76, coat: '#FBBF24' },
    extras: [
      { x: 196, footY: 370, s: 0.82, coat: '#38BDF8' },
      { x: 398, footY: 366, s: 0.8, coat: '#FB7185' },
    ],
    props: [
      { kind: 'tree', x: 96, y: 300, s: 1.1 },
      { kind: 'bench', x: 640, y: 360, s: 1 },
      { kind: 'ball', x: 452, y: 386, s: 0.9 },
    ],
    tagText: '민서',
  },
  {
    id: 'gate', label: '2단계',
    title: '학교 정문 앞에서 찍은 사진',
    spoken: '정문 사진을 검사합니다.',
    building: { x: 60, y: 126, w: 224, h: 144 },
    sign: { x: 80, y: 150, w: 154, h: 38, text: '별빛중학교', size: 26, name: '학교 간판' },
    me: { x: 520, footY: 372, s: 0.74, coat: '#C4B5FD' },
    other: { x: 766, footY: 340, s: 0.66, coat: '#FBBF24' },
    extras: [
      { x: 440, footY: 368, s: 0.72, coat: '#38BDF8' },
      { x: 596, footY: 366, s: 0.7, coat: '#FB7185' },
      { x: 344, footY: 362, s: 0.68, coat: '#34D399' },
    ],
    props: [
      { kind: 'tree', x: 880, y: 302, s: 0.95 },
      { kind: 'ball', x: 180, y: 384, s: 0.85 },
      { kind: 'bench', x: 250, y: 356, s: 0.85 },
    ],
    tagText: '지우',
  },
];

/** 그리는 자리와 판정하는 자리를 한 함수에서 함께 낸다. 둘이 어긋나면 게임이 거짓말을 한다. */
function personBox(p: Person) {
  const height = 120 * p.s;
  const r = 20 * p.s;
  const cy = p.footY - height + r;
  const tw = Math.max(46, 56 * p.s);
  const th = Math.max(22, 26 * p.s);
  return {
    cx: p.x, cy, r,
    head: { x: p.x - (r + 4), y: cy - (r + 4), w: (r + 4) * 2, h: (r + 4) * 2 },
    body: { x: p.x - 24 * p.s, y: cy + r, w: 48 * p.s, h: p.footY - cy - r },
    tag: { x: p.x - tw / 2, y: cy + r + 18 * p.s - th / 2, w: tw, h: th },
  };
}

function buildClues(stage: StageConfig): Clue[] {
  const me = personBox(stage.me);
  const other = personBox(stage.other);
  const s = stage.sign;
  return [
    { id: 'face', name: '내 얼굴', ...me.head, found: false, covered: false },
    { id: 'tag', name: '이름표', ...me.tag, found: false, covered: false },
    { id: 'sign', name: s.name, x: s.x - 4, y: s.y - 4, w: s.w + 8, h: s.h + 8, found: false, covered: false },
    { id: 'other', name: '다른 사람 얼굴', ...other.head, found: false, covered: false },
  ];
}

function drawProp(ctx: CanvasRenderingContext2D, p: Prop) {
  if (p.kind === 'tree') {
    ctx.fillStyle = TONE.trunk;
    ctx.fillRect(p.x - 7 * p.s, p.y - 54 * p.s, 14 * p.s, 54 * p.s);
    ctx.fillStyle = TONE.leaf;
    ctx.beginPath();
    ctx.arc(p.x, p.y - 68 * p.s, 34 * p.s, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (p.kind === 'ball') {
    ctx.fillStyle = TONE.ball;
    ctx.beginPath();
    ctx.arc(p.x, p.y - 13 * p.s, 13 * p.s, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.stroke();
    return;
  }
  panel(ctx, p.x - 42 * p.s, p.y - 30 * p.s, 84 * p.s, 16 * p.s, TONE.bench, '#451A03', 5);
  ctx.fillStyle = '#451A03';
  ctx.fillRect(p.x - 34 * p.s, p.y - 16 * p.s, 8 * p.s, 16 * p.s);
  ctx.fillRect(p.x + 26 * p.s, p.y - 16 * p.s, 8 * p.s, 16 * p.s);
}

/**
 * detail이 false면 얼굴 생김새·간판 글자·이름표 글자를 그리지 않는다. 흐릿한 바깥에서는
 * "사람이 있다"까지만 보이고, 돋보기 안에서만 "누구인지"가 보이게 하려는 구분이다.
 */
function drawPerson(ctx: CanvasRenderingContext2D, p: Person, detail: boolean, tagText: string | null) {
  const b = personBox(p);
  panel(ctx, b.body.x, b.body.y, b.body.w, b.body.h, p.coat, '#0F172A', 10);
  ctx.fillStyle = TONE.skin;
  ctx.beginPath();
  ctx.arc(b.cx, b.cy, b.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = TONE.skinEdge;
  ctx.lineWidth = 3;
  ctx.stroke();
  if (detail) {
    const eye = Math.max(2.4, b.r * 0.13);
    ctx.fillStyle = TONE.ink;
    ctx.beginPath();
    ctx.arc(b.cx - b.r * 0.34, b.cy - b.r * 0.14, eye, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b.cx + b.r * 0.34, b.cy - b.r * 0.14, eye, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = TONE.ink;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(b.cx, b.cy + b.r * 0.1, b.r * 0.42, 0.22 * Math.PI, 0.78 * Math.PI);
    ctx.stroke();
  }
  if (tagText) {
    panel(ctx, b.tag.x, b.tag.y, b.tag.w, b.tag.h, TONE.tag, TONE.tagEdge, 5);
    if (detail) centerText(ctx, tagText, b.tag.x + b.tag.w / 2, b.tag.y + b.tag.h / 2, 20, '#3B2100');
  }
}

function drawScene(ctx: CanvasRenderingContext2D, stage: StageConfig, detail: boolean) {
  ctx.fillStyle = TONE.sky;
  ctx.fillRect(PHOTO.x, PHOTO.y, PHOTO.w, GROUND_Y - PHOTO.y);
  ctx.fillStyle = TONE.ground;
  ctx.fillRect(PHOTO.x, GROUND_Y, PHOTO.w, PHOTO.y + PHOTO.h - GROUND_Y);
  const b = stage.building;
  panel(ctx, b.x, b.y, b.w, b.h, TONE.wall, TONE.wallEdge, 10);
  const s = stage.sign;
  panel(ctx, s.x, s.y, s.w, s.h, TONE.sign, TONE.signEdge, 8);
  if (detail) centerText(ctx, s.text, s.x + s.w / 2, s.y + s.h / 2, s.size, TONE.signInk);
  for (const prop of stage.props) drawProp(ctx, prop);
  for (const person of stage.extras) drawPerson(ctx, person, detail, null);
  drawPerson(ctx, stage.other, detail, null);
  drawPerson(ctx, stage.me, detail, stage.tagText);
}

/**
 * 알아볼 수 있는 면의 비율. 스티커끼리 겹칠 수 있어 넓이를 더하면 두 번 세어진다.
 * 격자 점을 찍어 세면 겹쳐도 한 번만 세어지고, 1320점이면 매 프레임 돌려도 가볍다.
 */
function visibleRatio(rects: Sticker[]): number {
  if (rects.length === 0) return 1;
  const gx = 60;
  const gy = 22;
  const cw = PHOTO.w / gx;
  const ch = PHOTO.h / gy;
  let hidden = 0;
  for (let i = 0; i < gx; i += 1) {
    const px = PHOTO.x + (i + 0.5) * cw;
    for (let j = 0; j < gy; j += 1) {
      const py = PHOTO.y + (j + 0.5) * ch;
      for (const r of rects) {
        if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) { hidden += 1; break; }
      }
    }
  }
  return 1 - hidden / (gx * gy);
}

interface World {
  lensX: number; lensY: number;
  clues: Clue[];
  stickers: Sticker[];
  held: Sticker | null;
  drag: 'none' | 'lens' | 'move' | 'resize';
  grabX: number; grabY: number;
  lives: number;
  time: number;
  /** ready면 시간이 흐르지 않는다. 학생이 준비되기 전에 초가 줄지 않게 한다. */
  phase: 'ready' | 'play';
  /** 손을 뗐다가 다시 눌러야 다시 시작한다. 누른 채로는 기회가 연달아 줄지 않는다. */
  armed: boolean;
  finished: boolean;
  notice: string;
  noticeT: number;
  visible: number;
}

function buildWorld(stage: StageConfig, lives: number, seconds: number): World {
  return {
    lensX: PHOTO.x + PHOTO.w / 2,
    lensY: PHOTO.y + PHOTO.h / 2,
    clues: buildClues(stage),
    stickers: [],
    held: null,
    drag: 'none',
    grabX: 0, grabY: 0,
    lives,
    time: seconds,
    phase: 'ready',
    armed: true,
    finished: false,
    notice: '',
    noticeT: 0,
    visible: 1,
  };
}

export default function PhotoCheckDeskGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const lensR = 78 * tuning.size;
  const slack = 7 * tuning.tolerance;
  const seedW = 116 * tuning.size;
  const seedH = 88 * tuning.size;
  const totalTime = Math.round(78 * tuning.time);

  const worldRef = useRef<World>(buildWorld(stage, tuning.lives, totalTime));
  const [hud, setHud] = useState({ lives: tuning.lives, covered: 0, found: 0, time: totalTime, held: false });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    worldRef.current = buildWorld(stage, tuning.lives, totalTime);
    setHud({ lives: tuning.lives, covered: 0, found: 0, time: totalTime, held: false });
  }, [game.round, game.stageIndex, stage, tuning.lives, totalTime]);

  const notice = (world: World, text: string) => { world.notice = text; world.noticeT = 3.2; };

  const clampSticker = (s: Sticker) => {
    s.w = clamp(s.w, MIN_W, MAX_W);
    s.h = clamp(s.h, MIN_H, MAX_H);
    s.x = clamp(s.x, PHOTO.x, PHOTO.x + PHOTO.w - s.w);
    s.y = clamp(s.y, PHOTO.y, PHOTO.y + PHOTO.h - s.h);
  };

  /** 가운데를 붙잡고 늘린다. 모서리 기준으로 키우면 스티커가 옆으로 달아난다. */
  const grow = (s: Sticker, dw: number, dh: number) => {
    const nw = clamp(s.w + dw, MIN_W, MAX_W);
    const nh = clamp(s.h + dh, MIN_H, MAX_H);
    s.x -= (nw - s.w) / 2;
    s.y -= (nh - s.h) / 2;
    s.w = nw;
    s.h = nh;
    clampSticker(s);
  };

  const takeSticker = (world: World) => {
    if (world.held) return;
    world.held = { x: world.lensX - seedW / 2, y: world.lensY - seedH / 2, w: seedW, h: seedH };
    clampSticker(world.held);
    playSound('select');
    notice(world, '스티커를 옮기고 모서리를 끌어 크기를 맞추세요.');
  };

  const commit = (world: World) => {
    const s = world.held;
    if (!s || world.finished || world.phase !== 'play') return;
    const targets = world.clues.filter((c) => c.found && !c.covered
      && s.x <= c.x + slack && s.y <= c.y + slack
      && s.x + s.w >= c.x + c.w - slack && s.y + s.h >= c.y + c.h - slack);
    if (targets.length === 0) {
      playSound('select');
      notice(world, world.clues.some((c) => c.found && !c.covered)
        ? '아직 보여요. 스티커를 조금 더 크게 만들어 덮어 주세요.'
        : '먼저 돋보기로 위험한 곳을 찾아 주세요.');
      return;
    }
    if (visibleRatio(world.stickers.concat([s])) < VISIBLE_FLOOR) {
      world.lives -= 1;
      world.held = null;
      world.phase = 'ready';
      world.armed = false;
      notice(world, '너무 많이 가려서 무슨 사진인지 알 수 없어요. 스티커를 작게 만들어 주세요.');
      if (world.lives <= 0) {
        world.finished = true;
        game.fail('사진이 다 가려졌어요. 이럴 때는 보내지 않는 것도 방법이에요. 다음에는 딱 그 자리만 덮어 주세요.');
      }
      return;
    }
    world.stickers.push({ ...s });
    for (const c of targets) c.covered = true;
    world.held = null;
    playSound('stamp');
    notice(world, `가렸어요: ${targets.map((c) => c.name).join(', ')}`);
    if (world.clues.every((c) => c.covered)) {
      world.finished = true;
      game.succeed('얼굴과 이름표, 간판과 다른 사람까지 가렸어요. 이 사진은 이제 보낼 수 있어요!');
    }
  };

  const hint = () => {
    const world = worldRef.current;
    if (!game.playing || world.finished) return;
    const target = world.clues.find((c) => !c.found);
    if (!target) return;
    world.lensX = target.x + target.w / 2;
    world.lensY = target.y + target.h / 2;
    world.phase = 'play';
    playSound('confirm');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    const pressed = keys.consumePress('action');
    const held = keys.held.current;

    if (dt > 0 && !world.finished) {
      if (world.phase === 'ready') {
        if (pressed) { world.phase = 'play'; world.armed = true; playSound('confirm'); }
      } else {
        world.time = Math.max(0, world.time - dt);
        const move = 300 * dt;
        if (world.held) {
          if (held.left) world.held.x -= move;
          if (held.right) world.held.x += move;
          if (held.up) grow(world.held, 180 * dt, 132 * dt);
          if (held.down) grow(world.held, -180 * dt, -132 * dt);
          clampSticker(world.held);
          if (pressed) commit(world);
        } else {
          if (held.left) world.lensX -= move;
          if (held.right) world.lensX += move;
          if (held.up) world.lensY -= move;
          if (held.down) world.lensY += move;
          if (pressed) takeSticker(world);
        }
        world.lensX = clamp(world.lensX, PHOTO.x, PHOTO.x + PHOTO.w);
        world.lensY = clamp(world.lensY, PHOTO.y, PHOTO.y + PHOTO.h);
        for (const clue of world.clues) {
          if (clue.found) continue;
          if (dist(world.lensX, world.lensY, clue.x + clue.w / 2, clue.y + clue.h / 2) <= lensR * 0.92) {
            clue.found = true;
            playSound('select');
            notice(world, `찾았어요: ${clue.name}. 스티커로 덮어 주세요.`);
          }
        }
        if (world.time <= 0 && !world.finished) {
          world.finished = true;
          game.fail('검사 시간이 지났어요. 다음에는 얼굴과 이름표부터 먼저 찾아보세요.');
        }
      }
      world.noticeT = Math.max(0, world.noticeT - dt);
    }

    world.visible = visibleRatio(world.held ? world.stickers.concat([world.held]) : world.stickers);
    const covered = world.clues.filter((c) => c.covered).length;
    const found = world.clues.filter((c) => c.found).length;
    if (covered !== hud.covered || found !== hud.found || world.lives !== hud.lives
      || !!world.held !== hud.held || Math.abs(world.time - hud.time) >= 0.12) {
      setHud({ lives: world.lives, covered, found, time: world.time, held: !!world.held });
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, W, H);

    const line = world.noticeT > 0 && world.notice ? world.notice : stage.title;
    panel(ctx, TOP.x, TOP.y, TOP.w, TOP.h, BOARD.overlay, world.noticeT > 0 ? PLAY.hero : PLAY.info, 14);
    centerText(ctx, line, TOP.x + TOP.w / 2, TOP.y + TOP.h / 2, world.noticeT > 0 ? 26 : 28, BOARD.ink);

    ctx.save();
    ctx.beginPath();
    ctx.rect(PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h);
    ctx.clip();
    drawScene(ctx, stage, false);
    // 같은 그림을 살짝 밀어 겹쳐 그리면 초점이 안 맞은 사진처럼 보인다. 흐림 필터는
    // 브라우저마다 무겁고 지원이 갈려서 그림 두 겹으로 대신한다.
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.translate(5, 4);
    drawScene(ctx, stage, false);
    ctx.restore();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
    ctx.fillRect(PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h);

    ctx.save();
    ctx.beginPath();
    ctx.arc(world.lensX, world.lensY, lensR, 0, Math.PI * 2);
    ctx.clip();
    drawScene(ctx, stage, true);
    ctx.restore();

    for (const clue of world.clues) {
      if (!clue.found || clue.covered) continue;
      ctx.fillStyle = 'rgba(251, 113, 133, 0.2)';
      ctx.fillRect(clue.x - 5, clue.y - 5, clue.w + 10, clue.h + 10);
      ctx.save();
      ctx.setLineDash([9, 7]);
      ctx.strokeStyle = PLAY.hazard;
      ctx.lineWidth = 4;
      ctx.strokeRect(clue.x - 5, clue.y - 5, clue.w + 10, clue.h + 10);
      ctx.restore();
    }

    for (const s of world.stickers) panel(ctx, s.x, s.y, s.w, s.h, TONE.sticker, PLAY.goal, 10);
    for (const clue of world.clues) {
      if (clue.covered) centerText(ctx, '✓', clue.x + clue.w / 2, clue.y + clue.h / 2, 30, PLAY.goal);
    }

    if (world.held) {
      const s = world.held;
      panel(ctx, s.x, s.y, s.w, s.h, TONE.sticker, PLAY.hero, 10);
      centerText(ctx, '가림', s.x + s.w / 2, s.y + s.h / 2, 24, BOARD.ink);
      panel(ctx, s.x + s.w - 32, s.y + s.h - 32, 34, 34, PLAY.hero, PLAY.heroEdge, 7);
      centerText(ctx, '↘', s.x + s.w - 15, s.y + s.h - 15, 24, '#3B2100');
    }

    ctx.strokeStyle = PLAY.hero;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(world.lensX, world.lensY, lensR, 0, Math.PI * 2);
    ctx.stroke();
    centerText(ctx, '🔍', world.lensX - lensR * 0.72, world.lensY - lensR * 0.72, 32, BOARD.ink);

    if (world.phase === 'ready' && !world.finished) {
      panel(ctx, W / 2 - 260, 200, 520, 78, BOARD.overlay, PLAY.hero, 16);
      centerText(
        ctx,
        world.armed ? '누르면 사진 검사를 시작합니다' : '손을 떼었다가 다시 누르세요',
        W / 2, 239, 26, BOARD.ink,
      );
    }
    ctx.restore();

    panel(ctx, DRAWER.x, DRAWER.y, DRAWER.w, DRAWER.h, BOARD.overlay, BOARD.line, 14);
    panel(ctx, SOURCE.x, SOURCE.y, SOURCE.w, SOURCE.h, TONE.sticker, world.held ? BOARD.line : PLAY.hero, 10);
    centerText(ctx, '가림 스티커', SOURCE.x + SOURCE.w / 2, SOURCE.y + SOURCE.h / 2, 24, BOARD.ink);
    centerText(ctx, '스티커를 끌어다 덮으세요', 420, 452, 24, BOARD.inkDim);
    centerText(ctx, '모서리를 끌면 커집니다', 420, 492, 24, BOARD.inkDim);
    centerText(ctx, '사진이 보이는 정도', BAR.x + BAR.w / 2, 440, 24, BOARD.inkDim);
    panel(ctx, BAR.x, BAR.y, BAR.w, BAR.h, BOARD.surface, BOARD.line, 8);
    const low = world.visible < VISIBLE_FLOOR;
    ctx.fillStyle = low ? PLAY.hazard : PLAY.goal;
    ctx.fillRect(BAR.x + 4, BAR.y + 4, (BAR.w - 8) * clamp(world.visible, 0, 1), BAR.h - 8);
    ctx.strokeStyle = BOARD.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(BAR.x + BAR.w / 2, BAR.y);
    ctx.lineTo(BAR.x + BAR.w / 2, BAR.y + BAR.h);
    ctx.stroke();
  };

  const onPointer = (p: { x: number; y: number; phase: 'down' | 'move' | 'up' }) => {
    const world = worldRef.current;
    if (world.finished) return;
    if (p.phase === 'up') { world.drag = 'none'; world.armed = true; return; }
    if (world.phase === 'ready') {
      if (p.phase === 'down' && world.armed) { world.phase = 'play'; world.armed = false; playSound('confirm'); }
      return;
    }
    if (p.phase === 'down') {
      if (!world.held && pointInRect(p.x, p.y, SOURCE)) {
        takeSticker(world);
        if (world.held) {
          world.held.x = p.x - world.held.w / 2;
          world.held.y = p.y - world.held.h / 2;
          clampSticker(world.held);
          world.grabX = world.held.w / 2;
          world.grabY = world.held.h / 2;
          world.drag = 'move';
        }
        return;
      }
      const s = world.held;
      if (s) {
        const grip = { x: s.x + s.w - 42, y: s.y + s.h - 42, w: 54, h: 54 };
        if (pointInRect(p.x, p.y, grip)) { world.drag = 'resize'; return; }
        if (pointInRect(p.x, p.y, s)) {
          world.drag = 'move';
          world.grabX = p.x - s.x;
          world.grabY = p.y - s.y;
          return;
        }
      }
      if (pointInRect(p.x, p.y, PHOTO)) {
        world.drag = 'lens';
        world.lensX = p.x;
        world.lensY = p.y;
      }
      return;
    }
    if (world.drag === 'lens') {
      world.lensX = clamp(p.x, PHOTO.x, PHOTO.x + PHOTO.w);
      world.lensY = clamp(p.y, PHOTO.y, PHOTO.y + PHOTO.h);
      return;
    }
    const s = world.held;
    if (!s) return;
    if (world.drag === 'move') { s.x = p.x - world.grabX; s.y = p.y - world.grabY; clampSticker(s); }
    if (world.drag === 'resize') { s.w = p.x - s.x; s.h = p.y - s.y; clampSticker(s); }
  };

  return (
    <MiniGameFrame
      badge="사진 검사대"
      instruction="돋보기를 끌어 사진을 살펴보세요. 위험한 곳을 찾으면 아래 서랍에서 스티커를 끌어다 덮고, 붙이기를 누릅니다."
      progress={{ label: '가린 곳', value: hud.covered, max: 4 }}
      hud={<GameHud lives={hud.lives} maxLives={tuning.lives} timeLeft={hud.time} timeTotal={totalTime} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 검사" />
          {game.hintAllowed && (
            <MiniGameButton onClick={hint} disabled={!game.playing} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={() => commit(worldRef.current)}
            disabled={!game.playing || !hud.held}
            emoji="🩹"
            label="붙이기"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={W}
            height={H}
            onFrame={frame}
            onPointer={onPointer}
            ariaLabel={`${stage.title}을 돋보기로 검사하는 놀이. 찾은 곳 ${hud.found}개, 가린 곳 ${hud.covered}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
