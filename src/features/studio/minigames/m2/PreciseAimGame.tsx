import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel, toRadians, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l3 · 좁혀서 조준하기 (장르 27 · 조준 슈팅)
 *
 * "구체적으로 말하기"를 조준의 폭으로 만든다. 아무 말도 붙이지 않으면 빔이 넓게 퍼져
 * 엉뚱한 물건까지 한꺼번에 맞고, 이름·종류·개수를 붙일수록 부채꼴이 좁아진다.
 *
 * 그래서 이 게임은 "맞히기"가 아니라 "덜 맞히기"가 실력이다. 넓은 빔으로도 목표는
 * 맞지만, 함께 맞은 것들 때문에 아이미가 엉뚱한 것을 가져온다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const GUN_X = WORLD_W / 2;
const GUN_Y = WORLD_H - 62;

interface Thing {
  x: number;
  y: number;
  kind: string;
  color: string;
  label: string;
}

interface Chip {
  id: string;
  text: string;
  /** 이 말을 붙이면 빔이 몇 도까지 좁아지는가 */
  spread: number;
  /** 이 말이 걸러 내는 물건의 조건 */
  keeps: (thing: Thing) => boolean;
}

interface StageConfig {
  id: string;
  label: string;
  goal: string;
  spoken: string;
  things: Thing[];
  chips: Chip[];
  /** 목표에 해당하는 물건의 kind */
  targetKind: string;
  targetCount: number;
}

const RED = '#F87171';
const BLUE = '#60A5FA';
const GREEN = '#4ADE80';
const YELLOW = '#FCD34D';

function line(x: number, y: number, kind: string, color: string, label: string): Thing {
  return { x, y, kind, color, label };
}

const STAGES: StageConfig[] = [
  {
    id: 'pencil',
    label: '기본',
    goal: '빨간 색연필 3자루',
    spoken: '빨간 색연필 세 자루만 가져오게 해요.',
    targetKind: 'red-pencil',
    targetCount: 3,
    things: [
      line(150, 120, 'red-pencil', RED, '빨간 색연필'),
      line(300, 90, 'red-pencil', RED, '빨간 색연필'),
      line(470, 130, 'red-pencil', RED, '빨간 색연필'),
      line(620, 95, 'blue-pencil', BLUE, '파란 색연필'),
      line(770, 135, 'blue-pencil', BLUE, '파란 색연필'),
      line(220, 215, 'crayon', GREEN, '크레파스'),
      line(560, 210, 'crayon', GREEN, '크레파스'),
      line(390, 195, 'eraser', YELLOW, '지우개'),
      line(700, 220, 'eraser', YELLOW, '지우개'),
      line(90, 205, 'ruler', '#C4B5FD', '자'),
      line(840, 200, 'ruler', '#C4B5FD', '자'),
      line(480, 60, 'eraser', YELLOW, '지우개'),
    ],
    chips: [
      { id: 'kind', text: '색연필', spread: 30, keeps: (t) => t.kind.endsWith('pencil') },
      { id: 'color', text: '빨간', spread: 15, keeps: (t) => t.kind === 'red-pencil' },
      { id: 'count', text: '3자루', spread: 7, keeps: () => true },
    ],
  },
  {
    id: 'snack',
    label: '1단계',
    goal: '작은 우유 2개',
    spoken: '작은 우유 두 개만 가져오게 해요.',
    targetKind: 'small-milk',
    targetCount: 2,
    things: [
      line(180, 110, 'small-milk', '#E2E8F0', '작은 우유'),
      line(420, 85, 'small-milk', '#E2E8F0', '작은 우유'),
      line(640, 120, 'big-milk', '#94A3B8', '큰 우유'),
      line(810, 100, 'big-milk', '#94A3B8', '큰 우유'),
      line(120, 205, 'juice', '#FB923C', '주스'),
      line(330, 215, 'juice', '#FB923C', '주스'),
      line(540, 200, 'bread', '#D6A347', '빵'),
      line(730, 215, 'bread', '#D6A347', '빵'),
      line(260, 55, 'bread', '#D6A347', '빵'),
      line(880, 190, 'juice', '#FB923C', '주스'),
    ],
    chips: [
      { id: 'kind', text: '우유', spread: 26, keeps: (t) => t.kind.endsWith('milk') },
      { id: 'size', text: '작은', spread: 13, keeps: (t) => t.kind === 'small-milk' },
      { id: 'count', text: '2개', spread: 6, keeps: () => true },
    ],
  },
  {
    id: 'book',
    label: '2단계',
    goal: '노란 그림책 2권',
    spoken: '노란 그림책 두 권만 가져오게 해요.',
    targetKind: 'yellow-picture',
    targetCount: 2,
    things: [
      line(210, 95, 'yellow-picture', YELLOW, '노란 그림책'),
      line(560, 75, 'yellow-picture', YELLOW, '노란 그림책'),
      line(380, 120, 'blue-picture', BLUE, '파란 그림책'),
      line(720, 110, 'blue-picture', BLUE, '파란 그림책'),
      line(110, 195, 'yellow-note', YELLOW, '노란 공책'),
      line(470, 205, 'yellow-note', YELLOW, '노란 공책'),
      line(840, 185, 'yellow-note', YELLOW, '노란 공책'),
      line(300, 200, 'story', '#C4B5FD', '이야기책'),
      line(650, 195, 'story', '#C4B5FD', '이야기책'),
      line(890, 95, 'story', '#C4B5FD', '이야기책'),
    ],
    chips: [
      { id: 'kind', text: '그림책', spread: 24, keeps: (t) => t.kind.endsWith('picture') },
      { id: 'color', text: '노란', spread: 12, keeps: (t) => t.kind === 'yellow-picture' },
      { id: 'count', text: '2권', spread: 6, keeps: () => true },
    ],
  },
];

const BASE_SPREAD = 60;

interface Shot {
  angle: number;
  spread: number;
  life: number;
  hits: Thing[];
}

export default function PreciseAimGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 빔의 너그러움으로 나타난다. 충분한 지원에서는 같은 말을 붙여도
     조금 더 좁게 모여 실수 여유가 크고, 고등에서는 같은 말로도 덜 좁아진다. */
  const spreadScale = 1 / clamp(tuning.tolerance, 0.7, 1.7);
  const thingR = 26 * clamp(tuning.size, 0.85, 1.3);
  const maxShots = tuning.lives;

  const [chips, setChips] = useState<string[]>([]);
  const [shotsLeft, setShotsLeft] = useState(maxShots);
  const angleRef = useRef(-90);
  const shotRef = useRef<Shot | null>(null);
  const finishedRef = useRef(false);
  const keys = useGameKeys(game.playing);

  useEffect(() => {
    setChips([]);
    setShotsLeft(maxShots);
    angleRef.current = -90;
    shotRef.current = null;
    finishedRef.current = false;
  }, [game.round, game.stageIndex, maxShots]);

  const spreadNow = () => {
    let spread = BASE_SPREAD;
    for (const chip of stage.chips) {
      if (chips.includes(chip.id)) spread = Math.min(spread, chip.spread);
    }
    return clamp(spread * spreadScale, 4, 72);
  };

  const toggleChip = (id: string) => {
    if (!game.playing) return;
    playSound('select');
    setChips((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const fire = () => {
    if (!game.playing || shotRef.current) return;
    const spread = spreadNow();
    const half = toRadians(spread / 2);
    const aim = toRadians(angleRef.current);
    const hits = stage.things.filter((thing) => {
      const dx = thing.x - GUN_X;
      const dy = thing.y - GUN_Y;
      const angle = Math.atan2(dy, dx);
      let diff = angle - aim;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      return Math.abs(diff) <= half;
    });
    shotRef.current = { angle: angleRef.current, spread, life: 0, hits };
    playSound('confirm');

    const wanted = stage.things.filter((t) => t.kind === stage.targetKind);
    const exact = hits.length === wanted.length && hits.every((h) => h.kind === stage.targetKind);
    const left = shotsLeft - 1;
    setShotsLeft(left);

    if (exact) {
      finishedRef.current = true;
      game.succeed(`${stage.goal}만 정확히 담았어요. 이름과 개수를 넣으니 아이미가 헷갈리지 않습니다.`);
    } else if (left <= 0) {
      finishedRef.current = true;
      const extra = hits.filter((h) => h.kind !== stage.targetKind);
      game.fail(
        extra.length > 0
          ? `${extra[0].label}까지 함께 담겼어요. 말 조각을 더 붙여 빔을 좁혀 봐요.`
          : '담긴 것이 모자랐어요. 조준을 옮겨 다시 해 봐요.',
      );
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    if (dt > 0 && game.playing && !shotRef.current) {
      const turn = 46 * dt;
      if (keys.held.current.left) angleRef.current -= turn;
      if (keys.held.current.right) angleRef.current += turn;
      angleRef.current = clamp(angleRef.current, -160, -20);
      if (keys.consumePress('action')) fire();
    }
    const shot = shotRef.current;
    if (shot && dt > 0) {
      shot.life += dt;
      if (shot.life > 1.1 && !finishedRef.current) shotRef.current = null;
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 목표 카드 — 학생이 읽고 무엇을 담을지 정하는 유일한 글
    panel(ctx, WORLD_W / 2 - 250, 8, 500, 44, BOARD.overlay, PLAY.goal, 12);
    centerText(ctx, `담을 것 · ${stage.goal}`, WORLD_W / 2, 30, 24, BOARD.ink);

    // 빔 부채꼴
    const spread = shot ? shot.spread : spreadNow();
    const aim = toRadians(shot ? shot.angle : angleRef.current);
    const half = toRadians(spread / 2);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(GUN_X, GUN_Y);
    ctx.arc(GUN_X, GUN_Y, 700, aim - half, aim + half);
    ctx.closePath();
    ctx.fillStyle = shot ? 'rgba(251, 191, 36, 0.32)' : 'rgba(56, 189, 248, 0.16)';
    ctx.fill();
    ctx.strokeStyle = shot ? PLAY.hero : PLAY.info;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // 물건
    for (const thing of stage.things) {
      const hit = shot ? shot.hits.includes(thing) : false;
      const wanted = thing.kind === stage.targetKind;
      ctx.beginPath();
      ctx.arc(thing.x, thing.y, thingR, 0, Math.PI * 2);
      ctx.fillStyle = thing.color;
      ctx.fill();
      ctx.lineWidth = hit ? 6 : 3;
      ctx.strokeStyle = hit ? (wanted ? PLAY.goal : PLAY.hazard) : BOARD.line;
      ctx.stroke();
      centerText(ctx, thing.label, thing.x, thing.y + thingR + 18, 20, BOARD.inkDim);
    }

    // 대포
    panel(ctx, GUN_X - 46, GUN_Y - 12, 92, 40, BOARD.surface, PLAY.hero, 10);
    ctx.save();
    ctx.translate(GUN_X, GUN_Y);
    ctx.rotate(aim);
    ctx.fillStyle = PLAY.hero;
    ctx.fillRect(0, -9, 62, 18);
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.lineWidth = 3;
    ctx.strokeRect(0, -9, 62, 18);
    ctx.restore();

    centerText(ctx, `빔의 폭 ${Math.round(spread)}도`, GUN_X, GUN_Y + 42, 22, BOARD.inkDim);
    if (!shot && game.playing) {
      centerText(ctx, '← → 로 겨누고 스페이스로 보냅니다', GUN_X, WORLD_H - 14, 20, BOARD.inkDim);
    }
  };

  return (
    <MiniGameFrame
      badge="좁혀서 조준하기"
      instruction="말 조각을 붙일수록 빔이 좁아집니다. 담을 것만 정확히 들어오게 겨누고 보내세요."
      progress={{ label: '붙인 말', value: chips.length, max: stage.chips.length }}
      hud={<GameHud lives={shotsLeft} maxLives={maxShots} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 겨누기" />
          <MiniGameButton onClick={fire} disabled={!game.playing} emoji="✨" label="보내기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {stage.chips.map((chip) => {
            const on = chips.includes(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => toggleChip(chip.id)}
                aria-pressed={on}
                disabled={!game.playing}
                className="min-h-11 rounded-xl px-3 text-[15px] font-black transition"
                style={{
                  background: on ? '#38BDF8' : 'var(--board-surface)',
                  color: on ? '#0F172A' : 'var(--board-ink)',
                  border: `2px solid ${on ? '#0EA5E9' : 'var(--board-line)'}`,
                }}
              >
                {on ? '＋ ' : ''}{chip.text}
              </button>
            );
          })}
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="aspect-video max-h-full w-full max-w-[760px]">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                if (!game.playing || shotRef.current) return;
                const dx = pointer.x - GUN_X;
                const dy = pointer.y - GUN_Y;
                angleRef.current = clamp((Math.atan2(dy, dx) * 180) / Math.PI, -160, -20);
                if (pointer.phase === 'down') fire();
              }}
              ariaLabel={`${stage.goal}을 담기 위해 빔을 겨누는 놀이. 붙인 말 ${chips.length}개, 남은 기회 ${shotsLeft}번.`}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
