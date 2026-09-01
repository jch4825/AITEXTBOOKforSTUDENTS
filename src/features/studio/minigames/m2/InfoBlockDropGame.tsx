import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, pick, useGameKeys,
} from '../engine';
import { useSpeak } from '../../../../hooks/useSpeak';
import type { MiniGameProps } from '../types';

/**
 * m2-l1 · 정보 블록 쌓기 (장르 14 · 낙하 블록 퍼즐)
 *
 * "부탁에서 빠진 정보를 찾아 채운다"를 낙하 블록으로 만든다. 판 아래 네 열은 부탁의 틀
 * (누구에게·무엇을·언제까지·어떤 모양)이고, 위에서 낱말 블록이 하나씩 내려온다. 낱말을
 * 읽고 그 낱말이 들어갈 열로 옮겨야 칸이 채워진다.
 *
 * 고르기가 아니라 옮기기로 만든 이유가 있다. 어느 칸의 정보인지 판단이 끝나기 전에도 블록은
 * 내려오므로, 학생은 "이 말이 무엇을 알려 주는 말인가"를 늘 먼저 생각하게 된다. 그리고
 * 「그거」「적당히」처럼 아무것도 알려 주지 않는 말과 전화번호 같은 개인정보는 어느 열에
 * 놓아도 잡동사니로 쌓인다. 버릴 곳이 따로 없다는 점이 이 차시의 핵심을 몸으로 만든다 —
 * 부탁에 넣지 말아야 할 말은 애초에 넣을 자리가 없다.
 *
 * 정답표 조회가 아니다. 네 칸이 채워지는 순서는 매번 달라지고, 잡동사니를 어느 열에
 * 몰아 둘지도 학생이 정한다. 한 줄이 완성되면 학생이 만든 문장이 그대로 읽힌다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const FIELD_TOP = 84;
const FLOOR_Y = 446;
const SLOT_TOP = 454;
const SLOT_H = 74;
const COL_X0 = 68;
const COL_W = 206;
const COLS = 4;

/** 부탁의 틀. 세 스테이지 내내 같은 네 가지를 쓴다 — 틀이 바뀌면 학습이 처음으로 돌아간다. */
const SLOT_LABELS = ['누구에게', '무엇을', '언제까지', '어떤 모양'];

/** 어느 열에 놓아도 잡동사니가 되는 개인정보 낱말. 다른 안내 문구를 띄우려고 따로 모았다. */
const PRIVATE_WORDS = ['내 전화번호를', '우리 집 주소를'];

interface RequestLine {
  words: string[];
  tail: string;
}

interface StageConfig {
  id: string;
  label: string;
  title: string;
  lines: RequestLine[];
  junkWords: string[];
  junkChance: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'festival',
    label: '기본',
    title: '체험회 안내',
    lines: [
      { words: ['3학년 친구에게', '체험회 안내문을', '금요일까지', '표로'], tail: '만들어 주세요.' },
      { words: ['우리 반에', '준비물 목록을', '오늘 안에', '그림으로'], tail: '정리해 주세요.' },
      { words: ['선생님께', '체험회 소감을', '월요일까지', '짧은 글로'], tail: '써 주세요.' },
    ],
    junkWords: ['그거', '아무거나', '적당히'],
    junkChance: 0.24,
  },
  {
    id: 'library',
    label: '1단계',
    title: '도서관 행사',
    lines: [
      { words: ['1학년 동생에게', '도서관 안내를', '수요일까지', '그림 카드로'], tail: '만들어 주세요.' },
      { words: ['우리 반 친구에게', '읽은 책 목록을', '이번 주 안에', '표로'], tail: '정리해 주세요.' },
      { words: ['사서 선생님께', '고맙다는 인사를', '내일까지', '짧은 편지로'], tail: '써 주세요.' },
    ],
    junkWords: ['그거', '아무거나', '빨리', '내 전화번호를'],
    junkChance: 0.29,
  },
  {
    id: 'sportsday',
    label: '2단계',
    title: '체육대회 준비',
    lines: [
      { words: ['2학년 후배에게', '체육대회 순서를', '목요일까지', '그림 표로'], tail: '만들어 주세요.' },
      { words: ['부모님께', '준비물 안내를', '오늘 저녁까지', '짧은 글로'], tail: '보내 주세요.' },
      { words: ['같은 모둠 친구에게', '나눈 역할을', '내일 아침까지', '목록으로'], tail: '정리해 주세요.' },
    ],
    junkWords: ['그거', '아무거나', '적당히', '알아서', '우리 집 주소를'],
    junkChance: 0.33,
  },
];

interface Block {
  word: string;
  /** 이 낱말이 들어갈 열. -1이면 어느 열에도 들어가지 않는 잡동사니다. */
  slot: number;
  personal: boolean;
}

interface World {
  /** ready면 블록이 멈춰 있다. 첫 조작 전과 실수한 뒤에 학생이 판을 읽을 시간을 준다. */
  phase: 'ready' | 'dropping';
  /** 손을 뗐다가 다시 눌러야 출발한다. 누른 채로 실수하면 같은 실수가 연달아 난다. */
  armed: boolean;
  note: string;
  col: number;
  y: number;
  block: Block;
  junk: string[][];
  locked: (string | null)[];
  line: number;
  linesDone: number;
  shake: number;
  flash: number;
  finished: boolean;
  junkStreak: number;
  random: () => number;
}

/**
 * 다음 블록을 고른다.
 *
 * 이미 잠긴 열의 낱말은 다시 내보내지 않는다. 놓을 자리가 없는 블록이 내려오면 학생이
 * 아무리 잘해도 잡동사니가 늘어 판이 이길 수 없는 판이 되기 때문이다. 같은 이유로 남은
 * 칸이 하나뿐일 때와 잡동사니가 두 번 연달아 나온 뒤에는 잡동사니를 내보내지 않는다.
 */
function nextBlock(world: World, stage: StageConfig, junkChance: number): Block {
  const open: number[] = [];
  for (let i = 0; i < COLS; i += 1) {
    if (!world.locked[i]) open.push(i);
  }
  if (open.length > 1 && world.junkStreak < 2 && world.random() < junkChance) {
    const word = pick(world.random, stage.junkWords);
    world.junkStreak += 1;
    return { word, slot: -1, personal: PRIVATE_WORDS.includes(word) };
  }
  world.junkStreak = 0;
  const slot = pick(world.random, open);
  return { word: stage.lines[world.line].words[slot], slot, personal: false };
}

function buildWorld(stage: StageConfig, seed: number, junkChance: number): World {
  const world: World = {
    phase: 'ready',
    armed: false,
    note: '',
    col: 1,
    y: FIELD_TOP + 4,
    block: { word: '', slot: -1, personal: false },
    junk: [[], [], [], []],
    locked: [null, null, null, null],
    line: 0,
    linesDone: 0,
    shake: 0,
    flash: 0,
    finished: false,
    junkStreak: 0,
    random: createRandom(seed),
  };
  world.block = nextBlock(world, stage, junkChance);
  return world;
}

/** 지금까지 채운 부탁 문장. 칸이 비어 있으면 밑줄로 남겨 무엇이 빠졌는지 보이게 한다. */
function sentenceParts(world: World, stage: StageConfig): string[] {
  const line = stage.lines[world.line];
  return world.locked.map((word) => word ?? '＿＿').concat([line.tail]);
}

/** 판 폭을 넘지 않을 때까지 글자를 줄인다. 낱말 길이가 스테이지마다 달라 고정 크기로는 잘린다. */
function fitSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  base: number,
  min: number,
): number {
  let size = base;
  while (size > min) {
    ctx.font = `800 ${size}px "Pretendard", system-ui, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  return min;
}

export default function InfoBlockDropGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;
  const { speak } = useSpeak();

  /* 칸 크기와 쌓임 한계는 함께 정해야 한다. 칸이 커지면 같은 높이에 덜 쌓이므로,
     허용 높이를 따로 두면 충분한 지원 수준에서 잡동사니가 화면 위로 넘친다. */
  const cellH = 46 * tuning.size;
  const maxStack = tuning.lives >= 5 ? 5 : tuning.lives >= 3 ? 4 : 3;
  const dangerY = FLOOR_Y - maxStack * cellH;
  /* 화면을 가로지르는 데 3초 넘게 걸리는 속도다. 흔한 낙하 퍼즐의 절반이며,
     낱말을 읽고 열을 정하는 시간이 조작 시간보다 길어야 한다. */
  /* 학생이 읽고 고를 시간이 있어야 한다. 처음 속도의 절반으로 낮춘다. */
  const fallSpeed = 52 * tuning.speed;
  const junkChance = clamp(stage.junkChance * tuning.density, 0.12, 0.42);

  const worldRef = useRef<World>(buildWorld(stage, game.seed, junkChance));
  const [hud, setHud] = useState({ room: maxStack, lines: 0 });
  const keys = useGameKeys(game.playing);
  const pressRef = useRef(false);
  const pointerColRef = useRef<number | null>(null);

  useEffect(() => {
    worldRef.current = buildWorld(stage, game.seed, junkChance);
    setHud({ room: maxStack, lines: 0 });
    pressRef.current = false;
    pointerColRef.current = null;
  }, [game.round, game.stageIndex, stage, game.seed, junkChance, maxStack]);

  /** 블록이 바닥이나 잡동사니 위에 닿았을 때. 성패는 여기서 한 번만 정해진다. */
  const land = (world: World) => {
    const block = world.block;
    if (block.slot === world.col && !world.locked[world.col]) {
      world.locked[world.col] = block.word;
      if (world.locked.every((word) => word !== null)) {
        const sentence = sentenceParts(world, stage).join(' ');
        world.linesDone += 1;
        world.flash = 1;
        if (world.linesDone >= 3) {
          world.finished = true;
          game.succeed(`${sentence} 빠진 정보를 모두 채웠어요!`);
          return;
        }
        speak(sentence);
        world.line += 1;
        world.locked = [null, null, null, null];
        world.junk = [[], [], [], []];
        world.phase = 'ready';
        world.armed = false;
        world.note = '부탁 하나를 완성했어요';
      }
    } else {
      world.junk[world.col].push(block.word);
      world.phase = 'ready';
      world.armed = false;
      world.shake = 0.6;
      world.note = block.personal
        ? '개인정보는 부탁에 넣지 않아요'
        : block.slot < 0
          ? '무엇인지 모를 말은 잡동사니가 됩니다'
          : '그 낱말은 다른 이름표의 정보예요';
      if (world.junk[world.col].length >= maxStack) {
        world.finished = true;
        game.fail('잡동사니가 빨간 줄까지 쌓였어요. 낱말을 먼저 읽고 어느 이름표의 정보인지 정한 다음 내려 보내세요.');
        return;
      }
    }
    world.block = nextBlock(world, stage, junkChance);
    world.y = FIELD_TOP + 4;
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    const pressing = pressRef.current || keys.held.current.action || keys.held.current.down;

    /* 좌우는 누를 때마다 한 칸씩 옮긴다. 누르고 있는 동안 계속 움직이면 목표 열을 지나쳐
       다시 되돌아오게 되고, 그러는 사이 블록이 엉뚱한 열에 닿는다. */
    if (keys.consumePress('left')) world.col = Math.max(0, world.col - 1);
    if (keys.consumePress('right')) world.col = Math.min(COLS - 1, world.col + 1);
    if (pointerColRef.current !== null) {
      world.col = pointerColRef.current;
      pointerColRef.current = null;
    }

    if (dt > 0 && !world.finished) {
      world.shake = Math.max(0, world.shake - dt * 1.6);
      world.flash = Math.max(0, world.flash - dt * 1.2);
      if (world.phase === 'ready') {
        if (!pressing) world.armed = true;
        if (pressing && world.armed) {
          world.phase = 'dropping';
          world.armed = false;
          world.y = FIELD_TOP + 4;
        }
      } else {
        const fast = keys.held.current.down || pressRef.current;
        world.y += fallSpeed * (fast ? 3.6 : 1) * dt;
        const target = FLOOR_Y - world.junk[world.col].length * cellH - cellH;
        if (world.y >= target) {
          world.y = target;
          land(world);
        }
      }
      let tallest = 0;
      for (const column of world.junk) tallest = Math.max(tallest, column.length);
      const room = maxStack - tallest;
      if (room !== hud.room || world.linesDone !== hud.lines) {
        setHud({ room, lines: world.linesDone });
      }
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 지금 부탁 띠 — 읽을 글은 여기 한 곳에만 크게 둔다.
    panel(ctx, 20, 8, 920, 62, BOARD.overlay, world.flash > 0 ? PLAY.goal : PLAY.info, 14);
    const parts = sentenceParts(world, stage);
    const whole = parts.join(' ');
    const headSize = fitSize(ctx, whole, 872, 28, 22);
    ctx.font = `800 ${headSize}px "Pretendard", system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let cursor = WORLD_W / 2 - ctx.measureText(whole).width / 2;
    for (let i = 0; i < parts.length; i += 1) {
      const chunk = i < parts.length - 1 ? `${parts[i]} ` : parts[i];
      ctx.fillStyle = i < COLS && world.locked[i] ? PLAY.goal : BOARD.inkDim;
      ctx.fillText(chunk, cursor, 39);
      cursor += ctx.measureText(chunk).width;
    }
    ctx.textAlign = 'center';

    // 판. 실수한 직후에는 테두리가 붉어져 글을 읽기 전에도 무슨 일이 났는지 보인다.
    panel(
      ctx, COL_X0 - 8, FIELD_TOP - 6, COLS * COL_W + 16, FLOOR_Y - FIELD_TOP + 12,
      BOARD.surface, world.shake > 0 ? PLAY.hazard : BOARD.line, 12,
    );
    for (let col = 1; col < COLS; col += 1) {
      const x = COL_X0 + col * COL_W;
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.55)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 10]);
      ctx.beginPath();
      ctx.moveTo(x, FIELD_TOP);
      ctx.lineTo(x, FLOOR_Y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 고른 열을 통째로 밝힌다. 블록만 움직이면 어느 이름표로 가는지 한눈에 안 보인다.
    const aimX = COL_X0 + world.col * COL_W;
    ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
    ctx.fillRect(aimX + 2, FIELD_TOP, COL_W - 4, FLOOR_Y - FIELD_TOP);

    // 쌓임 한계선
    ctx.strokeStyle = PLAY.hazard;
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 10]);
    ctx.beginPath();
    ctx.moveTo(COL_X0, dangerY);
    ctx.lineTo(COL_X0 + COLS * COL_W, dangerY);
    ctx.stroke();
    ctx.setLineDash([]);

    for (let col = 0; col < COLS; col += 1) {
      const x = COL_X0 + col * COL_W;
      const cx = x + COL_W / 2;
      world.junk[col].forEach((word, index) => {
        const top = FLOOR_Y - (index + 1) * cellH;
        panel(ctx, x + 12, top + 3, COL_W - 24, cellH - 6, BOARD.overlay, PLAY.hazardEdge, 8);
        const size = fitSize(ctx, word, COL_W - 44, 24, 20);
        centerText(ctx, word, cx, top + cellH / 2, size, BOARD.inkDim);
      });
    }

    // 내려오는 블록과 착지 자리 안내선
    if (!world.finished) {
      const landTop = FLOOR_Y - world.junk[world.col].length * cellH - cellH;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 10]);
      ctx.beginPath();
      ctx.moveTo(aimX + COL_W / 2, world.y + cellH);
      ctx.lineTo(aimX + COL_W / 2, landTop + cellH);
      ctx.stroke();
      ctx.setLineDash([]);
      panel(ctx, aimX + 12, world.y + 3, COL_W - 24, cellH - 6, BOARD.surface, PLAY.hero, 10);
      const size = fitSize(ctx, world.block.word, COL_W - 40, 26, 20);
      centerText(ctx, world.block.word, aimX + COL_W / 2, world.y + cellH / 2, size, BOARD.ink);
    }

    // 부탁 틀 — 네 열의 이름표. 채워진 칸은 초록으로 잠긴다.
    for (let col = 0; col < COLS; col += 1) {
      const x = COL_X0 + col * COL_W;
      const cx = x + COL_W / 2;
      const word = world.locked[col];
      const aiming = col === world.col;
      panel(
        ctx, x + 6, SLOT_TOP, COL_W - 12, SLOT_H,
        word ? '#14532D' : BOARD.overlay,
        word ? PLAY.goal : aiming ? PLAY.hero : PLAY.info, 12,
      );
      centerText(ctx, SLOT_LABELS[col], cx, SLOT_TOP + 25, 24, word ? BOARD.inkDim : BOARD.ink);
      if (word) {
        const size = fitSize(ctx, word, COL_W - 40, 24, 20);
        centerText(ctx, word, cx, SLOT_TOP + 52, size, PLAY.goal);
      } else {
        centerText(ctx, '＿＿', cx, SLOT_TOP + 52, 24, BOARD.inkDim);
      }
    }

    if (world.phase === 'ready' && !world.finished) {
      panel(ctx, WORLD_W / 2 - 350, 208, 700, world.note ? 88 : 62, BOARD.overlay, PLAY.hero, 16);
      const prompt = world.armed ? '누르면 블록이 내려옵니다' : '손을 떼었다가 다시 누르세요';
      if (world.note) {
        centerText(ctx, world.note, WORLD_W / 2, 238, fitSize(ctx, world.note, 660, 26, 22), BOARD.ink);
        centerText(ctx, prompt, WORLD_W / 2, 272, 24, BOARD.inkDim);
      } else {
        centerText(ctx, prompt, WORLD_W / 2, 239, 26, BOARD.ink);
      }
    }
  };

  const columnAt = (x: number) => {
    const raw = Math.floor((x - COL_X0) / COL_W);
    return clamp(raw, 0, COLS - 1);
  };

  const currentSentence = sentenceParts(worldRef.current, stage).join(' ');

  return (
    <MiniGameFrame
      badge="정보 블록 쌓기"
      instruction="내려오는 낱말을 읽고 좌우 방향키나 화면 누르기로 알맞은 이름표 열을 고르세요. 아래 방향키를 누르면 빨리 내려갑니다. 빨간 줄까지 잡동사니가 쌓이면 판이 끝납니다."
      progress={{ label: '완성한 부탁', value: hud.lines, max: 3 }}
      hud={<GameHud lives={hud.room} maxLives={maxStack} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].title} 부탁으로 바꿨어요.`)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 쌓기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="aspect-video max-h-full w-full max-w-[760px]">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') {
                pressRef.current = true;
                pointerColRef.current = columnAt(pointer.x);
              }
              if (pointer.phase === 'up') pressRef.current = false;
            }}
            ariaLabel={`부탁의 네 칸에 알맞은 낱말 블록을 내려 쌓는 놀이. 완성한 부탁 ${hud.lines}개.`}
          />
        </div>
      </div>
      {/* 캔버스는 그림이라 낭독기에 아무 정보도 주지 않는다. 지금 문장을 글로도 남긴다. */}
      <p className="sr-only" role="status">{currentSentence}</p>
    </MiniGameFrame>
  );
}
