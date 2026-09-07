import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, randInt, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m4-l1 · 틀린 답 쏘기 (장르 27 · 레이저 슈팅)
 *
 * "자신 있게 말해도 맞는 것은 아니다"를 대조로 만든다. 왼쪽 위에 오늘의 공식 자료가
 * 붙어 있고, 아이미가 자신 있게 내놓은 답이 오른쪽에서 날아온다. 공식 자료와 다른 답만
 * 쏘고, 같은 답은 지나가게 둔다.
 *
 * 답에 글자를 쓰지 않는다. 날아오는 것에 문장을 적으면 읽는 동안 이미 지나가 버린다.
 * 그래서 시계 바늘, 달력의 동그라미, 건물의 밝은 층으로 값을 그린다. 학생은 글을 읽는
 * 대신 왼쪽 위와 눈으로 견준다 — 대조라는 일 자체는 그대로다.
 *
 * m2-l3도 레이저를 쏘지만 그쪽은 제자리에서 내려오는 것을 조준한다. 여기서는 비행기를
 * 위아래로 몰면서 옆에서 오는 것을 맞힌다.
 */

const W = 960;
const H = 540;
/* 답이 날아오는 줄. 비행기도 이 줄에만 선다.
   처음에는 비행기를 자유롭게 움직이게 했더니, 시작 자리가 어느 줄에도 걸치지 않아
   가만히 있으면 영원히 못 맞혔다. 조준이 아니라 고르기가 이 놀이의 일이다. */
const LANES = [130, 243, 357, 470];
const SHIP_X = 92;

type Kind = 'clock' | 'calendar' | 'floor';
const KINDS: Kind[] = ['clock', 'calendar', 'floor'];

const KIND_COLOR: Record<Kind, string> = {
  clock: '#38BDF8',
  calendar: '#FBBF24',
  floor: '#4ADE80',
};

/** 오늘의 공식 자료. 이 값과 다른 답이 틀린 답이다. */
interface Official {
  clock: number;    // 1~12시
  calendar: number; // 0~6 (월~일)
  floor: number;    // 1~5층
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  official: Official;
  /** 맞혀야 하는 틀린 답 수 */
  goal: number;
  /** 답이 날아오는 간격(초) */
  gap: number;
  speed: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'timetable',
    label: '기본',
    spoken: '오늘 시간표와 다른 답만 쏘아요.',
    official: { clock: 2, calendar: 4, floor: 3 },
    goal: 8,
    gap: 1.5,
    speed: 150,
  },
  {
    id: 'notice',
    label: '1단계',
    spoken: '학교 공지와 다른 답만 쏘아요.',
    official: { clock: 9, calendar: 2, floor: 1 },
    goal: 10,
    gap: 1.25,
    speed: 180,
  },
  {
    id: 'event',
    label: '2단계',
    spoken: '행사 안내와 다른 답만 쏘아요.',
    official: { clock: 11, calendar: 5, floor: 4 },
    goal: 12,
    gap: 1.05,
    speed: 215,
  },
];

interface Card {
  kind: Kind;
  value: number;
  x: number;
  y: number;
  hit: boolean;
  /** 맞은 뒤 사라지기까지 남은 시간 */
  fade: number;
}

interface Shot {
  x: number;
  y: number;
}

interface World {
  /** 비행기가 선 줄 (LANES의 자리) */
  lane: number;
  cards: Card[];
  shots: Shot[];
  timer: number;
  fired: number;
  lives: number;
  down: number;
  phase: 'ready' | 'fly';
  finished: boolean;
  flash: number;
  /** 마지막으로 무슨 일이 있었는지 */
  note: string;
  noteT: number;
}

const DAY_COUNT = 7;
const FLOOR_COUNT = 5;

/** 시계. 바늘로 몇 시인지 그린다. */
function drawClock(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, hour: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#F8FAFC';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1F2937';
  ctx.stroke();
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (r - 7), cy + Math.sin(a) * (r - 7));
    ctx.lineTo(cx + Math.cos(a) * (r - 3), cy + Math.sin(a) * (r - 3));
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  const a = ((hour % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(a) * (r * 0.58), cy + Math.sin(a) * (r * 0.58));
  ctx.strokeStyle = '#1F2937';
  ctx.lineWidth = 5;
  ctx.stroke();
  // 분침은 늘 12를 가리켜 정각만 읽으면 되게 한다
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - r * 0.8);
  ctx.lineWidth = 3;
  ctx.stroke();
}

/** 달력. 일곱 칸 가운데 하나에 동그라미를 친다. */
function drawCalendar(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, day: number) {
  const w = s * 2.1;
  const h = s * 1.6;
  panel(ctx, cx - w / 2, cy - h / 2, w, h, '#F8FAFC', '#1F2937', 6);
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(cx - w / 2 + 3, cy - h / 2 + 3, w - 6, h * 0.24);
  const cell = (w - 10) / DAY_COUNT;
  for (let i = 0; i < DAY_COUNT; i += 1) {
    const x = cx - w / 2 + 5 + cell * (i + 0.5);
    const y = cy + h * 0.12;
    ctx.beginPath();
    ctx.arc(x, y, cell * 0.30, 0, Math.PI * 2);
    ctx.fillStyle = i === day ? '#FB7185' : '#E2E8F0';
    ctx.fill();
  }
}

/** 건물. 층 가운데 하나만 밝게 그린다. */
function drawFloor(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, floor: number) {
  const w = s * 1.5;
  const h = s * 2.0;
  panel(ctx, cx - w / 2, cy - h / 2, w, h, '#F8FAFC', '#1F2937', 6);
  const band = (h - 10) / FLOOR_COUNT;
  for (let i = 0; i < FLOOR_COUNT; i += 1) {
    // 아래가 1층이다
    const y = cy + h / 2 - 5 - band * (i + 1);
    ctx.fillStyle = i === floor - 1 ? '#FBBF24' : '#E2E8F0';
    ctx.fillRect(cx - w / 2 + 5, y + 2, w - 10, band - 4);
  }
}

/** 웃는 얼굴. 오늘 자료와 같은 답, 곧 쏘면 안 되는 것이다. */
function drawSmile(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#FDE68A';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1F2937';
  ctx.stroke();
  ctx.fillStyle = '#1F2937';
  ctx.beginPath();
  ctx.arc(cx - r * 0.34, cy - r * 0.20, r * 0.12, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.34, cy - r * 0.20, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.06, r * 0.48, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#1F2937';
  ctx.stroke();
}

function drawValue(ctx: CanvasRenderingContext2D, kind: Kind, value: number, cx: number, cy: number, s: number) {
  if (kind === 'clock') drawClock(ctx, cx, cy, s, value);
  else if (kind === 'calendar') drawCalendar(ctx, cx, cy, s, value);
  else drawFloor(ctx, cx, cy, s, value);
}

function officialOf(stage: StageConfig, kind: Kind): number {
  return kind === 'clock' ? stage.official.clock
    : kind === 'calendar' ? stage.official.calendar
      : stage.official.floor;
}

function buildWorld(lives: number): World {
  return {
    lane: 1,
    cards: [],
    shots: [],
    timer: 0,
    fired: 0,
    lives,
    down: 0,
    phase: 'ready',
    finished: false,
    flash: 0,
    note: '',
    noteT: 0,
  };
}

export default function ClaimShooterGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 날아오는 속도와 간격, 기회로 나타난다. 공식 자료와 답의 종류는 셋 모두 같다. */
  const speed = stage.speed * clamp(tuning.speed, 0.7, 1.3);
  const gap = stage.gap / clamp(tuning.density, 0.75, 1.3);
  const maxLives = tuning.lives;
  const cardSize = 34 * clamp(tuning.size, 0.9, 1.25);

  const worldRef = useRef<World>(buildWorld(maxLives));
  const randomRef = useRef(createRandom(game.seed));
  const [hud, setHud] = useState({ down: 0, lives: maxLives });
  const keys = useGameKeys(game.playing);
  const fireRef = useRef(false);

  useEffect(() => {
    worldRef.current = buildWorld(maxLives);
    randomRef.current = createRandom(game.seed);
    setHud({ down: 0, lives: maxLives });
    fireRef.current = false;
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  const notice = (w: World, text: string) => {
    w.note = text;
    w.noteT = 2.2;
  };

  const spawn = (w: World) => {
    const random = randomRef.current;
    const kind = KINDS[randInt(random, 0, KINDS.length)];
    const right = officialOf(stage, kind);
    /* 오늘 자료와 같은 답은 값을 그리지 않고 웃는 얼굴 하나로 통일한다. 시계 바늘 각도를
       매번 견주게 하면 쏠지 말지 정하기 전에 이미 지나가 버린다. 웃는 얼굴은 멀리서도
       한눈에 보이므로 "이건 그냥 보낸다"가 곧바로 정해진다.
       그리고 웃는 얼굴이 더 자주 온다 — 쏘지 않고 보내는 것도 하나의 답이다. */
    let value = right;
    if (random() < 0.4) {
      const span = kind === 'clock' ? 12 : kind === 'calendar' ? DAY_COUNT : FLOOR_COUNT;
      const base = kind === 'clock' ? 1 : kind === 'calendar' ? 0 : 1;
      for (let tryCount = 0; tryCount < 12; tryCount += 1) {
        value = base + randInt(random, 0, span);
        if (value !== right) break;
      }
    }
    w.cards.push({
      kind,
      value,
      x: W + 60,
      y: LANES[randInt(random, 0, LANES.length)],
      hit: false,
      fade: 0,
    });
  };

  const lose = (w: World, text: string) => {
    w.lives -= 1;
    w.flash = 0.5;
    notice(w, text);
    playSound('select');
    if (w.lives <= 0) {
      w.finished = true;
      game.fail('기회를 다 썼어요. 웃지 않는 답만 쏘아 보세요.');
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    const held = keys.held.current;
    const firing = keys.consumePress('action') || fireRef.current;
    fireRef.current = false;

    if (dt > 0 && game.playing && !w.finished) {
      if (w.phase === 'ready') {
        if (firing || held.up || held.down) w.phase = 'fly';
      } else {
        if (keys.consumePress('up')) w.lane = Math.max(0, w.lane - 1);
        if (keys.consumePress('down')) w.lane = Math.min(LANES.length - 1, w.lane + 1);

        if (firing) {
          w.shots.push({ x: SHIP_X + 30, y: LANES[w.lane] });
          playSound('select');
        }
        for (const shot of w.shots) shot.x += 620 * dt;
        w.shots = w.shots.filter((shot) => shot.x < W + 20);

        w.timer += dt;
        if (w.timer >= gap) {
          w.timer = 0;
          spawn(w);
        }
        for (const card of w.cards) {
          if (card.fade > 0) { card.fade -= dt; continue; }
          card.x -= speed * dt;
        }

        // 맞았는지 본다
        for (const shot of w.shots) {
          for (const card of w.cards) {
            if (card.hit) continue;
            if (Math.abs(shot.x - card.x) > cardSize || Math.abs(shot.y - card.y) > cardSize) continue;
            card.hit = true;
            card.fade = 0.45;
            shot.x = W + 50;
            if (card.value === officialOf(stage, card.kind)) {
              lose(w, '웃는 얼굴은 오늘 자료와 같은 답이에요. 그대로 지나가게 둡니다.');
            } else {
              w.down += 1;
              w.flash = 0;
              notice(w, '오늘 자료와 다른 답을 찾았어요.');
              playSound('fill');
              if (w.down >= stage.goal) {
                w.finished = true;
                game.succeed('자신 있게 말한 답도 오늘 자료와 견주어 골라냈어요!');
              }
            }
            break;
          }
        }

        // 왼쪽 끝을 지난 것 정리
        for (const card of w.cards) {
          if (card.hit || card.x > -50) continue;
          card.hit = true;
          card.fade = 0;
          if (card.value !== officialOf(stage, card.kind)) {
            lose(w, '다른 답을 놓쳤어요. 왼쪽 위 자료와 견주어 보세요.');
          }
        }
        w.cards = w.cards.filter((card) => !card.hit || card.fade > 0);

        w.flash = Math.max(0, w.flash - dt);
        w.noteT = Math.max(0, w.noteT - dt);

        if (w.down !== hud.down || w.lives !== hud.lives) {
          setHud({ down: w.down, lives: w.lives });
        }
      }
    }

    // ── 그리기 ────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, W, H);
    if (w.flash > 0) {
      ctx.fillStyle = `rgba(251, 113, 133, ${w.flash * 0.4})`;
      ctx.fillRect(0, 0, W, H);
    }

    // 오늘의 자료 — 왼쪽 위에 붙여 둔다. 견줄 것이 늘 보여야 한다.
    panel(ctx, 18, 14, 396, 104, BOARD.overlay, PLAY.info, 12);
    centerText(ctx, '오늘의 자료', 96, 40, 22, BOARD.ink);
    drawClock(ctx, 210, 66, 30, stage.official.clock);
    drawCalendar(ctx, 300, 66, 30, stage.official.calendar);
    drawFloor(ctx, 378, 66, 30, stage.official.floor);

    // 날아오는 답
    for (const card of w.cards) {
      ctx.save();
      if (card.fade > 0) ctx.globalAlpha = Math.max(0, card.fade / 0.45);
      const same = card.value === officialOf(stage, card.kind);
      const box = cardSize + 12;
      panel(ctx, card.x - box, card.y - box, box * 2, box * 2, BOARD.surface,
        same ? '#FDE68A' : KIND_COLOR[card.kind], 12);
      if (same) drawSmile(ctx, card.x, card.y, cardSize);
      else drawValue(ctx, card.kind, card.value, card.x, card.y, cardSize);
      ctx.restore();
    }

    // 총알
    ctx.fillStyle = PLAY.goal;
    for (const shot of w.shots) ctx.fillRect(shot.x, shot.y - 3, 22, 6);

    // 비행기
    ctx.beginPath();
    const shipY = LANES[w.lane];
    ctx.moveTo(SHIP_X + 34, shipY);
    ctx.lineTo(SHIP_X - 24, shipY - 22);
    ctx.lineTo(SHIP_X - 10, shipY);
    ctx.lineTo(SHIP_X - 24, shipY + 22);
    ctx.closePath();
    ctx.fillStyle = PLAY.hero;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.stroke();

    if (w.noteT > 0 && w.note) {
      panel(ctx, W / 2 - 300, H - 62, 600, 44, BOARD.overlay, PLAY.info, 10);
      centerText(ctx, w.note, W / 2, H - 38, 22, BOARD.ink);
    }
    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, W / 2 - 250, H / 2 - 30, 500, 60, BOARD.overlay, PLAY.hero, 14);
      centerText(ctx, '위아래 방향키나 스페이스를 누르면 시작합니다', W / 2, H / 2 + 2, 24, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="틀린 답 쏘기"
      instruction="웃는 얼굴은 오늘의 자료와 같은 답이니 그대로 지나가게 두세요. 웃지 않는 답만 스페이스나 마우스 왼쪽 단추로 쏘아 보세요. 왼쪽 위 오늘의 자료와 무엇이 다른지 볼 수 있어요."
      progress={{ label: '찾은 다른 답', value: hud.down, max: stage.goal }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton
            onClick={() => { const w = worldRef.current; w.lane = Math.max(0, w.lane - 1); w.phase = 'fly'; }}
            emoji="⬆️"
            label="위로"
          />
          <MiniGameButton
            onClick={() => { const w = worldRef.current; w.lane = Math.min(LANES.length - 1, w.lane + 1); w.phase = 'fly'; }}
            emoji="⬇️"
            label="아래로"
          />
          <MiniGameButton onClick={() => { fireRef.current = true; }} emoji="🔫" label="쏘기" variant="primary" />
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시" />
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
            onPointer={(pointer) => {
              if (pointer.phase === 'up') return;
              const w = worldRef.current;
              w.phase = 'fly';
              // 누른 자리에서 가장 가까운 줄로 옮긴다
              let best = 0;
              for (let i = 1; i < LANES.length; i += 1) {
                if (Math.abs(pointer.y - LANES[i]) < Math.abs(pointer.y - LANES[best])) best = i;
              }
              w.lane = best;
              if (pointer.phase === 'down') fireRef.current = true;
            }}
            ariaLabel={`오늘의 자료와 다른 답을 쏘는 놀이. 찾은 다른 답 ${hud.down}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
