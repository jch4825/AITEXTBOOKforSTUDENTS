import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m1-l10 · 박자 맞춰 북치기 (장르 34 · 리듬 북치기)
 *
 * 아이미가 만든 '댄스 타임' 곡 목록이 오른쪽에서 한 곡씩 흘러온다. 밝은 띠 안에 들어오는
 * 순간에 결정한다 — 그대로 쓸 곡은 초록 북, 고쳐 쓸 곡은 주황 북, 쓸 수 없는 곡은
 * 치지 않고 보낸다. 이 차시가 가르치는 "쓰기·고치기·안 쓰기"가 그대로 세 가지 반응이다.
 *
 * **안 치는 것도 답이다.** 아무 북이나 두드리면 자장가까지 써 버리게 되므로, 손을 멈추는
 * 일이 이 판에서 가장 중요한 조작이다.
 *
 * 앞선 게임은 곡 카드를 짝맞추는 판이었다. 무엇과 무엇을 왜 짝지어야 하는지가 카드에
 * 드러나지 않아 "메커니즘을 이해하기 어렵다"가 됐다. 여기서는 카드 한 장에 곡 이름과
 * 그 곡의 성격이 함께 적혀 있어, 읽는 즉시 무엇을 할지가 정해진다.
 *
 * m1-l5도 리듬이지만 조작이 다르다. 그쪽은 세로 세 줄로 떨어지는 노트를 줄별 키로 받고,
 * 여기는 가로 한 줄로 흘러오는 곡을 북 둘 중 하나로 받거나 아예 받지 않는다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
/** 곡이 흐르는 줄. */
const LANE_Y = 196;
const CARD_W = 180;
const CARD_H = 112;
/** 판정 띠의 한가운데. 곡 카드의 중심이 이 근처에 있을 때 북이 통한다. */
const BAND_X = 380;
/* 첫 곡이 화면 오른쪽에 이미 보이는 자리에서 출발한다. 화면 밖에서 시작하면 판을 연 뒤
   대여섯 초 동안 빈 띠만 보게 되어, 무엇을 기다리는 판인지 알 수 없다. */
const SPAWN_X = 900;

type Kind = 'use' | 'fix' | 'skip';

interface Song {
  title: string;
  tag: string;
  kind: Kind;
}

/* 곡 이름과 성격을 한 장에 함께 적는다. 읽는 즉시 무엇을 할지가 정해져야 한다.
   카드 안쪽 폭은 164px이고 제목은 22px, 성격은 20px로 그리므로 각 줄은 여섯 자를 넘기지 않는다. */
const USE_SONGS: Song[] = [
  { title: '봄바람', tag: '빠른 춤곡', kind: 'use' },
  { title: '점프 점프', tag: '빠른 춤곡', kind: 'use' },
  { title: '박수 노래', tag: '빠른 춤곡', kind: 'use' },
  { title: '달려라', tag: '빠른 춤곡', kind: 'use' },
];
const FIX_SONGS: Song[] = [
  { title: '민수의 노래', tag: '이름이 있어요', kind: 'fix' },
  { title: '지호 생일곡', tag: '이름이 있어요', kind: 'fix' },
  { title: '소연이 곡', tag: '이름이 있어요', kind: 'fix' },
];
const SKIP_SONGS: Song[] = [
  { title: '잘 자라', tag: '느린 자장가', kind: 'skip' },
  { title: '밤 인사', tag: '느린 자장가', kind: 'skip' },
  { title: '꿈나라', tag: '느린 자장가', kind: 'skip' },
];

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  /** 이 판에 흐르는 곡 차례. 스테이지마다 곡 수와 섞임이 달라진다. */
  order: Song[];
  /** 곡과 곡 사이 거리. 속도가 같으므로 이 값이 곧 박자가 된다. */
  gapBase: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'two', label: '기본', spoken: '쓸 곡에만 초록 북을 쳐 봐요.', gapBase: 400,
    /* 첫 판은 초록 북과 손 멈추기 둘뿐이다. 고칠 곡은 아직 오지 않는다. */
    order: [USE_SONGS[0], SKIP_SONGS[0], USE_SONGS[1], SKIP_SONGS[1], USE_SONGS[2], SKIP_SONGS[2]],
  },
  {
    id: 'three', label: '1단계', spoken: '고쳐 쓸 곡에는 주황 북을 쳐 봐요.', gapBase: 350,
    order: [
      USE_SONGS[0], FIX_SONGS[0], SKIP_SONGS[0], USE_SONGS[1],
      FIX_SONGS[1], SKIP_SONGS[1], USE_SONGS[2], FIX_SONGS[2],
    ],
  },
  {
    id: 'four', label: '2단계', spoken: '세 가지가 섞여 옵니다. 박자를 놓치지 말아요.', gapBase: 300,
    order: [
      USE_SONGS[0], SKIP_SONGS[0], FIX_SONGS[0], USE_SONGS[1], FIX_SONGS[1],
      SKIP_SONGS[1], USE_SONGS[2], FIX_SONGS[2], SKIP_SONGS[2], USE_SONGS[3],
    ],
  },
];

type CardState = 'flow' | 'right' | 'wrong';

interface Card {
  song: Song;
  x: number;
  state: CardState;
  /** 판정 뒤 카드에 남는 표시가 사라지기까지의 시간 */
  mark: number;
}

interface World {
  cards: Card[];
  lives: number;
  correct: number;
  finished: boolean;
  greenFlash: number;
  orangeFlash: number;
  note: string;
}

export default function SongDrumCheckGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 흐르는 빠르기·판정 띠 폭·곡 간격·북 크기·기회로 나타난다. 곡 차례는 같다. */
  const flow = 130 * clamp(tuning.speed, 0.7, 1.4);
  const hitHalf = 74 * clamp(tuning.tolerance, 0.7, 1.6);
  const gap = stage.gapBase / clamp(tuning.density, 0.75, 1.3);
  const drumR = 76 * clamp(tuning.size, 0.85, 1.25);
  const maxLives = tuning.lives + 2;

  const GREEN_X = 250;
  const ORANGE_X = 520;
  const DRUM_Y = 404;

  const build = (): World => ({
    cards: stage.order.map((song, i) => ({ song, x: SPAWN_X + i * gap, state: 'flow', mark: 0 })),
    lives: maxLives,
    correct: 0,
    finished: false,
    greenFlash: 0,
    orangeFlash: 0,
    note: '',
  });

  const worldRef = useRef<World>(build());
  const [hud, setHud] = useState({ lives: maxLives, correct: 0, note: '' });
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    worldRef.current = build();
    setHud({ lives: maxLives, correct: 0, note: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.round, game.stageIndex]);

  /** 북을 친다. 띠 안에 있는 곡 하나만 받는다. */
  const strike = (drum: 'green' | 'orange') => {
    const w = worldRef.current;
    if (!game.playing || w.finished) return;
    if (drum === 'green') w.greenFlash = 0.22; else w.orangeFlash = 0.22;

    const target = w.cards
      .filter((c) => c.state === 'flow' && Math.abs(c.x - BAND_X) <= hitHalf)
      .sort((a, b) => Math.abs(a.x - BAND_X) - Math.abs(b.x - BAND_X))[0];

    if (!target) {
      /* 빈 박자에 친 것은 틀린 판단이 아니다. 기회를 깎지 않고 무엇을 볼지만 알린다. */
      w.note = '지금은 띠 안에 곡이 없어요. 곡이 들어올 때 쳐 보세요.';
      return;
    }

    const want: Kind = drum === 'green' ? 'use' : 'fix';
    if (target.song.kind === want) {
      target.state = 'right';
      target.mark = 1.1;
      w.correct += 1;
      playSound('confirm');
      w.note = drum === 'green'
        ? `${target.song.title} — 조건에 맞아 그대로 씁니다.`
        : `${target.song.title} — 이름을 빼고 고쳐 씁니다.`;
    } else {
      target.state = 'wrong';
      target.mark = 1.1;
      w.lives -= 1;
      playSound('select');
      w.note = target.song.kind === 'skip'
        ? `${target.song.tag}는 댄스 타임에 쓸 수 없어요. 치지 말고 보내 주세요.`
        : target.song.kind === 'use'
          ? `${target.song.title}는 그대로 쓸 수 있어요. 초록 북입니다.`
          : `${target.song.title}는 고쳐 써야 해요. 주황 북입니다.`;
    }
    settle(w);
  };

  /** 남은 곡이 없으면 끝낸다. */
  const settle = (w: World) => {
    if (w.finished) return;
    if (w.lives <= 0) {
      w.finished = true;
      game.fail('곡을 다시 살펴봐요. 느린 자장가는 치지 말고 보내 주세요.');
      return;
    }
    if (!w.cards.every((c) => c.state !== 'flow' && c.x < BAND_X - hitHalf)) return;

    w.finished = true;
    /*
     * 곡을 하나라도 놓쳤으면 성공이 아니다.
     *
     * 기회가 남았다는 것만으로 성공을 주면, 아무것도 하지 않고 가만히 있어도 첫 판을
     * 넘길 수 있었다(쓸 곡 셋을 놓치고 자장가 셋을 보내면 기회가 남는다). 이 차시는
     * 결과를 하나씩 확인하는 것이 전부라, 확인하지 않은 판을 성공이라 할 수 없다.
     */
    if (w.correct >= w.cards.length) {
      game.succeed(`아이미가 만든 곡 ${w.cards.length}개를 하나씩 확인했어요. 쓸지 고칠지 안 쓸지는 사람이 정합니다.`);
    } else {
      game.fail(`${w.cards.length}곡 가운데 ${w.correct}곡만 확인했어요. 곡이 띠 안에 있을 때 결정해 봐요.`);
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      if (keys.consumePress('left') || keys.consumePress('action')) strike('green');
      if (keys.consumePress('right')) strike('orange');

      w.greenFlash = Math.max(0, w.greenFlash - dt);
      w.orangeFlash = Math.max(0, w.orangeFlash - dt);

      for (const card of w.cards) {
        card.x -= flow * dt;
        if (card.mark > 0) card.mark = Math.max(0, card.mark - dt);
        /* 띠를 빠져나가는 순간이 "치지 않기"의 판정 시점이다. */
        if (card.state === 'flow' && card.x < BAND_X - hitHalf) {
          if (card.song.kind === 'skip') {
            card.state = 'right';
            card.mark = 1.1;
            w.correct += 1;
            playSound('fill');
            w.note = `${card.song.tag}는 쓰지 않고 보냈어요.`;
          } else {
            card.state = 'wrong';
            card.mark = 1.1;
            w.lives -= 1;
            w.note = `${card.song.title}를 놓쳤어요. 띠 안에 있을 때 쳐 보세요.`;
          }
        }
      }
      settle(w);

      if (w.lives !== hud.lives || w.correct !== hud.correct || w.note !== hud.note) {
        setHud({ lives: w.lives, correct: w.correct, note: w.note });
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    panel(ctx, 20, 14, WORLD_W - 40, 44, BOARD.overlay, PLAY.info, 12);
    centerText(ctx, '아이미가 만든 댄스 타임 곡 목록', WORLD_W / 2, 36, 24, BOARD.ink);

    // 곡이 흐르는 줄
    ctx.fillStyle = BOARD.overlay;
    ctx.fillRect(0, LANE_Y - CARD_H / 2 - 12, WORLD_W, CARD_H + 24);

    // 판정 띠 — 이 안에 있을 때만 북이 통한다
    ctx.fillStyle = 'rgba(250, 204, 21, 0.16)';
    ctx.fillRect(BAND_X - hitHalf, LANE_Y - CARD_H / 2 - 12, hitHalf * 2, CARD_H + 24);
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 4;
    ctx.strokeRect(BAND_X - hitHalf, LANE_Y - CARD_H / 2 - 12, hitHalf * 2, CARD_H + 24);

    for (const card of w.cards) {
      if (card.x < -CARD_W || card.x > WORLD_W + CARD_W) continue;
      const x = card.x - CARD_W / 2;
      const y = LANE_Y - CARD_H / 2;
      const settled = card.state !== 'flow';
      ctx.fillStyle = settled ? (card.state === 'right' ? '#14532D' : '#4C1D24') : BOARD.surface;
      ctx.beginPath();
      ctx.roundRect(x, y, CARD_W, CARD_H, 14);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = settled
        ? (card.state === 'right' ? PLAY.goal : PLAY.hazard)
        : card.song.kind === 'skip' ? '#94A3B8' : BOARD.line;
      ctx.stroke();
      centerText(ctx, card.song.title, card.x, LANE_Y - 18, 22, BOARD.ink);
      centerText(ctx, card.song.tag, card.x, LANE_Y + 20, 20, '#CBD5E1');
      if (card.mark > 0) {
        centerText(ctx, card.state === 'right' ? '✓' : '✕', card.x, LANE_Y - 62, 34,
          card.state === 'right' ? PLAY.goal : PLAY.hazard);
      }
    }

    drawDrum(ctx, GREEN_X, DRUM_Y, drumR, w.greenFlash, '#22C55E', '#14532D', '써요', '← 왼쪽 · 스페이스');
    drawDrum(ctx, ORANGE_X, DRUM_Y, drumR, w.orangeFlash, '#FB923C', '#7C2D12', '고쳐요', '→ 오른쪽');

    // 세 번째 답 — 치지 않기
    panel(ctx, 700, DRUM_Y - 74, 236, 148, BOARD.overlay, '#94A3B8', 14);
    centerText(ctx, '느린 자장가는', 818, DRUM_Y - 34, 22, '#CBD5E1');
    centerText(ctx, '치지 않고', 818, DRUM_Y + 2, 22, BOARD.ink);
    centerText(ctx, '보냅니다', 818, DRUM_Y + 38, 22, BOARD.ink);
  };

  const drawDrum = (
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number, r: number, flash: number,
    skin: string, edge: string, label: string, keyHint: string,
  ) => {
    const grow = 1 + flash * 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * grow, 0, Math.PI * 2);
    ctx.fillStyle = skin;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = edge;
    ctx.stroke();
    // 북 가죽의 안쪽 테. 두드리는 면이라는 것을 모양으로 알린다.
    ctx.beginPath();
    ctx.arc(cx, cy, r * grow * 0.68, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = edge;
    ctx.stroke();
    centerText(ctx, label, cx, cy, 26, '#0F172A');
    centerText(ctx, keyHint, cx, cy + r + 26, 20, '#CBD5E1');
  };

  const onPointer = (pointer: { x: number; y: number; phase: 'down' | 'move' | 'up' }) => {
    if (pointer.phase !== 'down') return;
    if (Math.hypot(pointer.x - GREEN_X, pointer.y - DRUM_Y) <= drumR * 1.15) strike('green');
    else if (Math.hypot(pointer.x - ORANGE_X, pointer.y - DRUM_Y) <= drumR * 1.15) strike('orange');
  };

  return (
    <MiniGameFrame
      badge="박자 맞춰 북치기"
      instruction="곡이 노란 띠 안에 들어올 때 알맞은 북을 쳐 보세요. 댄스 타임에 쓸 수 없는 곡은 치지 않고 보냅니다."
      progress={{ label: '고른 곡', value: hud.correct, max: stage.order.length }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="text-[15px] font-bold leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          초록 북은 그대로 쓰는 곡, 주황 북은 이름을 빼고 고쳐 쓰는 곡입니다. 치지 않고 보내는 것도 하나의 답입니다.
        </p>
      }
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
              onPointer={onPointer}
              ariaLabel={`아이미가 만든 곡을 확인해 북을 치는 놀이. 고른 곡 ${hud.correct}개, 남은 기회 ${hud.lives}개.`}
            />
          </div>
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{hud.note}</p>
      </div>
    </MiniGameFrame>
  );
}
