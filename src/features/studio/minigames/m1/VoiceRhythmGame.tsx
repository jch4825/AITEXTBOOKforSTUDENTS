import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, panel, pick, shuffle, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m1-l5 · 말 받아쓰기 리듬 (장르 23 · 리듬 액션)
 *
 * "시끄러운 곳에서는 아이미가 잘못 받아 적는다"를 리듬으로 만든다. 내려오는 파란 낱말은
 * 아이미가 제대로 들은 말이고, 붉은 노트는 옆에서 끼어든 소음이다. 소음을 받아 버리면
 * 문장에 엉뚱한 낱말이 박히고("도서관"이 "도시락"이 된다), 낱말을 놓치면 빈칸이 남는다.
 *
 * 왼쪽 스위치 둘은 "조건을 바꾸는 일"이다. 하나만 켜면 소음이 절반으로 줄고, 둘을 함께
 * 켜면 그 동안 소음이 아예 오지 않는다. 쿨타임이 있어서 아무 때나 켤 수 없고, 소음이
 * 몰려오는 구간을 미리 보고 켜야 한다. 그것이 이 차시의 학습 그 자체다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
/** 판정선. 낱말이 이 선에 닿을 때 그 줄의 키를 누른다. */
const LINE_Y = 420;
const SPAWN_Y = -50;
const LANE_X = [337, 579, 821];
const LANE_W = 242;
const LANE_LEFT = 216;
const LANE_KEYS = ['A', 'S', 'D'];

/** 스위치는 4초 켜지고, 꺼진 뒤 8초 동안 다시 켤 수 없다. */
const SWITCH_ON = 4;
const SWITCH_COOL = 8;
const SWITCH_BOX = [
  { x: 20, y: 146, w: 180, h: 112, top: '마이크', bottom: '가까이', hint: '위쪽 키' },
  { x: 20, y: 270, w: 180, h: 112, top: '창문', bottom: '닫기', hint: '스페이스' },
];

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  /** 받아써야 할 문장을 낱말 칸으로 끊어 둔 것 */
  words: string[];
  /** 소음 노트에 실리는 잘못 들은 낱말들 */
  noiseWords: string[];
  baseNoise: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'short',
    label: '기본',
    spoken: '짧은 문장부터 받아써요.',
    words: ['내일', '도서관', '앞에서', '만나요'],
    noiseWords: ['도시락', '내년', '만두', '도로'],
    baseNoise: 3,
  },
  {
    id: 'middle',
    label: '1단계',
    spoken: '낱말이 여섯 개인 문장이에요.',
    words: ['수요일', '세시', '체육관', '앞에서', '같이', '운동해요'],
    noiseWords: ['수영장', '네시', '체육복', '운동화'],
    baseNoise: 5,
  },
  {
    id: 'long',
    label: '2단계',
    spoken: '낱말이 여덟 개인 긴 문장이에요.',
    words: ['금요일', '아침', '아홉시', '학교', '정문', '앞에서', '버스를', '타요'],
    noiseWords: ['목요일', '학원', '정류장', '버섯을', '아홉장'],
    baseNoise: 7,
  },
];

type SlotState = 'empty' | 'ok' | 'miss' | 'noise';
interface Slot { state: SlotState; text: string; }
interface Queued { t: number; lane: number; word: string; noise: boolean; slot: number; }
interface Note extends Queued { id: number; y: number; }

interface World {
  clock: number;
  queue: Queued[];
  notes: Note[];
  slots: Slot[];
  lives: number;
  shake: number;
  flash: number[];
  finished: boolean;
  /** ready면 아무것도 내려오지 않는다. 첫 조작 전과 실수 직후의 숨 고르는 자리다. */
  phase: 'ready' | 'falling';
  /** 손을 떼었다가 다시 눌러야 재출발한다. 누른 채로 실수하면 곧바로 또 실수하기 때문이다. */
  armed: boolean;
  nextId: number;
  noiseSeen: number;
  switches: { active: number; cool: number }[];
  dirty: boolean;
}

/**
 * 악보를 만든다.
 *
 * 낱말은 정해진 박자로 순서대로 내려오고, 소음은 그 사이사이에 끼워 넣는다. 같은 줄에서
 * 소음과 낱말이 너무 가까우면 바르게 눌러도 소음이 잡혀 억울해진다. 그래서 판정 창의
 * 3.2배만큼은 떨어지도록 줄을 고른다. 판정 창이 넓은 충분한 지원에서는 이 간격이 커져
 * 소음이 자연히 다른 줄로 밀려나고, 고등에서는 같은 줄에도 소음이 들어온다.
 */
function buildChart(
  stage: StageConfig, seed: number, beat: number, fallSpeed: number, win: number, noiseCount: number,
): Queued[] {
  const random = createRandom(seed);
  const lanes = [0, 1, 2];
  const chart: Queued[] = [];
  let prevLane = -1;

  stage.words.forEach((word, index) => {
    // 같은 줄이 연달아 나오면 손이 한자리에 굳는다. 바로 앞 줄은 뺀다.
    const lane = shuffle(random, lanes).filter((item) => item !== prevLane)[0];
    prevLane = lane;
    chart.push({ t: index * beat, lane, word, noise: false, slot: index });
  });

  const minGap = (3.2 * win) / fallSpeed;
  const span = Math.max(1, stage.words.length - 0.6);
  for (let k = 0; k < noiseCount; k += 1) {
    const t = beat * (0.55 + (k * span) / noiseCount);
    const free = shuffle(random, lanes).filter((lane) => chart.every(
      (note) => note.lane !== lane || Math.abs(note.t - t) >= minGap,
    ));
    if (free.length === 0) continue;
    chart.push({ t, lane: free[0], word: pick(random, stage.noiseWords), noise: true, slot: -1 });
  }
  return chart;
}

function buildWorld(stage: StageConfig, chart: Queued[], lives: number): World {
  return {
    clock: 0,
    queue: chart.slice(),
    notes: [],
    slots: stage.words.map(() => ({ state: 'empty', text: '' })),
    lives,
    shake: 0,
    flash: [0, 0, 0],
    finished: false,
    phase: 'ready',
    armed: false,
    nextId: 1,
    noiseSeen: 0,
    switches: [{ active: 0, cool: 0 }, { active: 0, cool: 0 }],
    dirty: true,
  };
}

export default function VoiceRhythmGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 화면 높이를 내려오는 데 최소 1.5초. 기본 150이면 판정선까지 약 3초가 걸리고,
     충분한 지원에서는 4.6초로 늘어난다. 흔한 리듬 게임의 절반 속도다. */
  const fallSpeed = 150 * tuning.speed;
  const win = 60 * tuning.tolerance;
  const beat = 2.8 / Math.max(0.8, tuning.density);
  const noiseCount = Math.max(2, Math.round(stage.baseNoise * tuning.density));
  const noteW = 210 * Math.min(1.12, tuning.size);
  const noteH = 54 * Math.min(1.18, tuning.size);
  const padW = 170 * Math.min(1.12, tuning.size);

  const worldRef = useRef<World>(buildWorld(stage, [], tuning.lives));
  const inputRef = useRef({ lane: [false, false, false], sw: [false, false], down: false });
  const [view, setView] = useState<{ lives: number; ok: number; slots: Slot[] }>({
    lives: tuning.lives, ok: 0, slots: stage.words.map(() => ({ state: 'empty', text: '' })),
  });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    const chart = buildChart(stage, game.seed, beat, fallSpeed, win, noiseCount);
    worldRef.current = buildWorld(stage, chart, tuning.lives);
    inputRef.current = { lane: [false, false, false], sw: [false, false], down: false };
    setView({ lives: tuning.lives, ok: 0, slots: stage.words.map(() => ({ state: 'empty', text: '' })) });
  }, [game.round, game.stageIndex, game.seed, stage, beat, fallSpeed, win, noiseCount, tuning.lives]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const world = worldRef.current;
    const input = inputRef.current;

    // 키 입력은 프레임 앞에서 한 번만 꺼낸다. 여러 곳에서 consume하면 한 번 누른 것이 사라진다.
    if (keys.consumePress('left')) input.lane[0] = true;
    if (keys.consumePress('down')) input.lane[1] = true;
    if (keys.consumePress('right')) input.lane[2] = true;
    if (keys.consumePress('up')) input.sw[0] = true;
    if (keys.consumePress('action')) input.sw[1] = true;

    const held = input.down || keys.held.current.left || keys.held.current.right
      || keys.held.current.down || keys.held.current.up || keys.held.current.action;
    const anyPress = input.lane.some(Boolean) || input.sw.some(Boolean);

    /** 기회를 하나 잃는다. 남은 노트를 판정선 위로 물려 두어야 다시 시작하자마자 또 놓치지 않는다. */
    const loseLife = () => {
      world.lives -= 1;
      world.phase = 'ready';
      world.armed = false;
      world.shake = 0.7;
      world.dirty = true;
      let step = 0;
      for (const other of world.notes) {
        other.y = Math.min(other.y, LINE_Y - 180 - step);
        step += 120;
      }
    };

    if (dt > 0 && !world.finished && world.phase === 'ready') {
      world.shake = Math.max(0, world.shake - dt);
      if (!held) world.armed = true;
      if (anyPress && world.armed && world.shake <= 0) {
        world.phase = 'falling';
        world.armed = false;
      }
      input.lane[0] = false;
      input.lane[1] = false;
      input.lane[2] = false;
      input.sw[0] = false;
      input.sw[1] = false;
    } else if (dt > 0 && !world.finished) {
      world.clock += dt;
      for (let i = 0; i < 2; i += 1) {
        const sw = world.switches[i];
        if (sw.active > 0) {
          sw.active = Math.max(0, sw.active - dt);
          if (sw.active === 0) sw.cool = SWITCH_COOL;
        } else if (sw.cool > 0) {
          sw.cool = Math.max(0, sw.cool - dt);
        }
        if (input.sw[i] && sw.active === 0 && sw.cool === 0) {
          sw.active = SWITCH_ON;
          playSound('select');
        }
      }

      // 하나 켜면 소음 절반, 둘을 겹쳐 켜면 그 동안 소음이 오지 않는다. 겹쳐 쓸지 나눠 쓸지가 전략이다.
      const reduction = world.switches.filter((sw) => sw.active > 0).length;
      for (let i = world.queue.length - 1; i >= 0; i -= 1) {
        const item = world.queue[i];
        if (item.t > world.clock) continue;
        world.queue.splice(i, 1);
        if (item.noise) {
          world.noiseSeen += 1;
          if (reduction >= 2) continue;
          if (reduction === 1 && world.noiseSeen % 2 === 0) continue;
        }
        world.notes.push({ ...item, id: world.nextId, y: SPAWN_Y });
        world.nextId += 1;
      }

      for (const note of world.notes) note.y += fallSpeed * dt;

      for (let lane = 0; lane < 3 && world.phase === 'falling'; lane += 1) {
        if (!input.lane[lane]) continue;
        world.flash[lane] = 0.28;
        let best = -1;
        let bestGap = win + 1;
        world.notes.forEach((note, index) => {
          const gap = Math.abs(note.y - LINE_Y);
          if (note.lane !== lane || gap > win || gap >= bestGap) return;
          bestGap = gap;
          best = index;
        });
        if (best < 0) continue;
        const note = world.notes[best];
        world.notes.splice(best, 1);
        if (note.noise) {
          // 소음을 받으면 아직 바르지 않은 칸에 엉뚱한 낱말이 박힌다. 그 칸의 낱말은 뒤에 다시 온다.
          const target = world.slots.findIndex((slot) => slot.state !== 'ok');
          if (target >= 0) world.slots[target] = { state: 'noise', text: note.word };
          loseLife();
        } else {
          world.slots[note.slot] = { state: 'ok', text: note.word };
          world.dirty = true;
        }
      }

      for (let i = world.notes.length - 1; i >= 0; i -= 1) {
        const note = world.notes[i];
        if (note.y <= LINE_Y + win + 4) continue;
        world.notes.splice(i, 1);
        if (note.noise) continue;
        // 놓친 낱말은 빈칸으로 남되 잠시 뒤 다시 내려온다. 한 번 놓쳤다고 문장이 끝나지 않게 한다.
        world.slots[note.slot] = { state: 'miss', text: '○○' };
        world.queue.push({ ...note, t: world.clock + 2.2, lane: (note.lane + 1) % 3 });
        loseLife();
        break;
      }

      for (let lane = 0; lane < 3; lane += 1) world.flash[lane] = Math.max(0, world.flash[lane] - dt);

      /* 이번 프레임에 쓴 누름을 반드시 비운다. 비우지 않으면 한 번 누른 레인이 계속
         눌린 것으로 남아 매 프레임 판정이 터지고, 손을 떼도 풀리지 않는다. */
      input.lane[0] = false;
      input.lane[1] = false;
      input.lane[2] = false;
      input.sw[0] = false;
      input.sw[1] = false;

      const done = world.slots.filter((slot) => slot.state === 'ok').length;
      if (world.dirty) {
        world.dirty = false;
        setView({ lives: world.lives, ok: done, slots: world.slots.map((slot) => ({ ...slot })) });
      }
      if (world.lives <= 0) {
        world.finished = true;
        game.fail('소음이 섞여 문장이 다 전해지지 않았어요. 왼쪽 스위치로 소음을 줄이고 파란 낱말만 받아 보세요.');
      } else if (done >= world.slots.length) {
        world.finished = true;
        game.succeed(`빈칸 없이 "${stage.words.join(' ')}"라고 바르게 전했어요!`);
      }
    }

    // ── 그리기 ─────────────────────────────────────────────
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 받아쓴 문장 띠 — 읽을 글은 이 한 곳에만 둔다.
    panel(ctx, 16, 8, 928, 96, BOARD.overlay, PLAY.info, 14);
    centerText(ctx, '받아쓴 문장', 104, 30, 24, BOARD.inkDim);
    const count = world.slots.length;
    const slotW = (908 - 6 * (count - 1)) / count;
    world.slots.forEach((slot, index) => {
      const x = 26 + index * (slotW + 6);
      const fill = slot.state === 'ok' ? '#14532D' : slot.state === 'noise' ? PLAY.hazardEdge : BOARD.surface;
      const edge = slot.state === 'ok' ? PLAY.goal
        : slot.state === 'noise' ? PLAY.hazard
          : slot.state === 'miss' ? PLAY.hero : BOARD.line;
      panel(ctx, x, 46, slotW, 46, fill, edge, 10);
      if (slot.text) {
        centerText(ctx, slot.text, x + slotW / 2, 70, 24, slot.state === 'miss' ? PLAY.hero : BOARD.ink);
      }
    });

    // 소음 줄이기 스위치
    centerText(ctx, '소음 줄이기', 110, 126, 26, BOARD.inkDim);
    SWITCH_BOX.forEach((box, index) => {
      const sw = world.switches[index];
      const on = sw.active > 0;
      const cooling = sw.cool > 0;
      panel(
        ctx, box.x, box.y, box.w, box.h,
        on ? PLAY.infoEdge : BOARD.surface,
        on ? PLAY.info : cooling ? BOARD.line : PLAY.extra, 14,
      );
      centerText(ctx, box.top, box.x + box.w / 2, box.y + 30, 26, BOARD.ink);
      centerText(ctx, box.bottom, box.x + box.w / 2, box.y + 58, 26, BOARD.ink);
      const state = on ? `켜짐 ${Math.ceil(sw.active)}초`
        : cooling ? `${Math.ceil(sw.cool)}초 뒤에` : box.hint;
      centerText(ctx, state, box.x + box.w / 2, box.y + 88, 24, on ? BOARD.ink : BOARD.inkDim);
    });

    // 줄 세 개와 판정 구간
    for (let lane = 0; lane < 3; lane += 1) {
      panel(ctx, LANE_X[lane] - LANE_W / 2 + 4, 116, LANE_W - 8, LINE_Y - 116, BOARD.surface, BOARD.line, 14);
    }
    ctx.fillStyle = 'rgba(52, 211, 153, 0.18)';
    ctx.fillRect(LANE_LEFT, LINE_Y - win, WORLD_W - LANE_LEFT - 16, win * 2);
    ctx.strokeStyle = PLAY.goal;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(LANE_LEFT, LINE_Y);
    ctx.lineTo(WORLD_W - 16, LINE_Y);
    ctx.stroke();

    for (const note of world.notes) {
      if (note.y < SPAWN_Y - 40 || note.y > WORLD_H) continue;
      panel(
        ctx, LANE_X[note.lane] - noteW / 2, note.y - noteH / 2, noteW, noteH,
        note.noise ? PLAY.hazardEdge : PLAY.infoEdge,
        note.noise ? PLAY.hazard : PLAY.info, 14,
      );
      centerText(ctx, note.noise ? `🔊 ${note.word}` : note.word, LANE_X[note.lane], note.y, 26, BOARD.ink);
    }

    for (let lane = 0; lane < 3; lane += 1) {
      const lit = world.flash[lane] > 0;
      panel(
        ctx, LANE_X[lane] - padW / 2, 440, padW, 68,
        lit ? PLAY.goalEdge : BOARD.surface, lit ? PLAY.goal : PLAY.info, 14,
      );
      centerText(ctx, LANE_KEYS[lane], LANE_X[lane], 474, 34, BOARD.ink);
    }

    if (world.shake > 0) {
      ctx.strokeStyle = PLAY.hazard;
      ctx.lineWidth = 6;
      ctx.strokeRect(LANE_LEFT, 116, WORLD_W - LANE_LEFT - 16, LINE_Y - 116);
    }

    if (world.phase === 'ready' && !world.finished) {
      const first = world.lives === tuning.lives;
      const readyText = world.shake > 0 ? '잠깐 기다려요'
        : world.armed ? (first ? '아무 키나 누르면 시작합니다' : '누르면 다시 시작합니다')
          : '손을 떼었다가 다시 누르세요';
      panel(ctx, WORLD_W / 2 - 250, 236, 500, 76, BOARD.overlay, PLAY.hero, 16);
      centerText(ctx, readyText, WORLD_W / 2, 274, 26, BOARD.ink);
    }
  };

  const spoken = view.slots.map((slot) => (slot.state === 'empty' ? '□' : slot.text)).join(' ');

  return (
    <MiniGameFrame
      badge="말 받아쓰기 리듬"
      instruction="파란 낱말이 초록 선에 닿을 때 알맞은 자리를 눌러 보세요. 빨간 소음은 누르지 않고 지나가게 두면 됩니다."
      progress={{ label: '바르게 받아쓴 낱말', value: view.ok, max: stage.words.length }}
      hud={<GameHud lives={view.lives} maxLives={tuning.lives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 받아쓰기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'up') inputRef.current.down = false;
              if (pointer.phase !== 'down') return;
              inputRef.current.down = true;
              const box = SWITCH_BOX.findIndex((item) => pointer.x >= item.x && pointer.x <= item.x + item.w
                && pointer.y >= item.y && pointer.y <= item.y + item.h);
              if (box >= 0) {
                inputRef.current.sw[box] = true;
                return;
              }
              if (pointer.x < LANE_LEFT) return;
              inputRef.current.lane[clamp(Math.floor((pointer.x - LANE_LEFT) / LANE_W), 0, 2)] = true;
            }}
            ariaLabel={`세 줄로 내려오는 낱말을 받아쓰는 놀이. 남은 기회 ${view.lives}개, 바르게 받아쓴 낱말 ${view.ok}개.`}
          />
        </div>
      </div>
      {/* 캔버스는 그림이라 낭독기가 읽지 못한다. 지금까지 받아쓴 문장을 글로도 남긴다. */}
      <p className="text-[15px] font-bold leading-relaxed" style={{ color: 'var(--board-ink)' }}>
        지금까지 받아쓴 문장: {spoken}
      </p>
    </MiniGameFrame>
  );
}
