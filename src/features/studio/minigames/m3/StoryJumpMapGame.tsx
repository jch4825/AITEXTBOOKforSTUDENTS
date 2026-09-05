import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m3-l5 · 이야기 길 뛰기 (장르 1 · 횡스크롤 점프맵)
 *
 * "결말을 먼저 정하고 제안을 골라 고친다"를 길 고르기로 만든다. 학생이 먼저 결말
 * 깃발을 정하면, 그 결말로 이어지는 발판만 끝까지 이어지고 나머지는 도중에 끊긴다.
 *
 * 끊긴 것이 미리 보이지는 않는다. 발판에 적힌 제안을 읽어야 어느 쪽이 내 결말로
 * 이어지는지 알 수 있다 — 그것이 이 차시의 읽기다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const HERO_R = 20;
const GROUND = WORLD_H - 60;

interface Plank {
  x: number;
  y: number;
  w: number;
  text: string;
  /** 이 발판이 이어지는 결말 번호. -1이면 어느 결말에서나 안전한 공용 발판 */
  ending: number;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  endings: string[];
  planks: Plank[];
  goalX: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'friend',
    label: '기본',
    spoken: '내가 정한 결말까지 이야기 길을 달려요.',
    goalX: 1720,
    endings: ['친구와 화해한다', '혼자 해낸다'],
    planks: [
      { x: 120, y: GROUND - 70, w: 180, text: '다툰 날 저녁', ending: -1 },
      { x: 400, y: GROUND - 130, w: 170, text: '먼저 말을 건다', ending: 0 },
      { x: 400, y: GROUND - 250, w: 170, text: '혼자 연습한다', ending: 1 },
      { x: 700, y: GROUND - 150, w: 170, text: '사과를 적는다', ending: 0 },
      { x: 700, y: GROUND - 280, w: 170, text: '계획을 세운다', ending: 1 },
      { x: 990, y: GROUND - 110, w: 170, text: '함께 웃는다', ending: 0 },
      { x: 990, y: GROUND - 300, w: 170, text: '끝까지 해낸다', ending: 1 },
      { x: 1280, y: GROUND - 90, w: 200, text: '나란히 걷는다', ending: 0 },
      { x: 1280, y: GROUND - 320, w: 200, text: '혼자 웃는다', ending: 1 },
      { x: 1560, y: GROUND - 70, w: 220, text: '이야기의 끝', ending: -1 },
    ],
  },
  {
    id: 'help',
    label: '1단계',
    spoken: '내가 정한 결말까지 이야기 길을 달려요.',
    goalX: 1900,
    endings: ['도움을 청한다', '방법을 바꾼다'],
    planks: [
      { x: 110, y: GROUND - 70, w: 180, text: '무거운 상자 앞', ending: -1 },
      { x: 390, y: GROUND - 140, w: 160, text: '손을 든다', ending: 0 },
      { x: 390, y: GROUND - 260, w: 160, text: '수레를 찾는다', ending: 1 },
      { x: 660, y: GROUND - 170, w: 160, text: '이유를 말한다', ending: 0 },
      { x: 660, y: GROUND - 300, w: 160, text: '작게 나눈다', ending: 1 },
      { x: 930, y: GROUND - 120, w: 160, text: '함께 든다', ending: 0 },
      { x: 930, y: GROUND - 330, w: 160, text: '한 번에 옮긴다', ending: 1 },
      { x: 1200, y: GROUND - 100, w: 180, text: '고맙다고 한다', ending: 0 },
      { x: 1200, y: GROUND - 350, w: 180, text: '기록을 남긴다', ending: 1 },
      { x: 1480, y: GROUND - 80, w: 180, text: '정리한다', ending: -1 },
      { x: 1740, y: GROUND - 70, w: 220, text: '이야기의 끝', ending: -1 },
    ],
  },
  {
    id: 'lost',
    label: '2단계',
    spoken: '내가 정한 결말까지 이야기 길을 달려요.',
    goalX: 2080,
    endings: ['어른께 알린다', '표지를 찾는다'],
    planks: [
      { x: 100, y: GROUND - 70, w: 170, text: '길을 잃은 날', ending: -1 },
      { x: 360, y: GROUND - 140, w: 150, text: '가게로 들어간다', ending: 0 },
      { x: 360, y: GROUND - 270, w: 150, text: '지도를 편다', ending: 1 },
      { x: 610, y: GROUND - 180, w: 150, text: '도와 달라고 한다', ending: 0 },
      { x: 610, y: GROUND - 310, w: 150, text: '표지판을 읽는다', ending: 1 },
      { x: 860, y: GROUND - 130, w: 150, text: '이름을 말한다', ending: 0 },
      { x: 860, y: GROUND - 350, w: 150, text: '방향을 정한다', ending: 1 },
      { x: 1110, y: GROUND - 110, w: 150, text: '기다린다', ending: 0 },
      { x: 1110, y: GROUND - 300, w: 150, text: '걸어간다', ending: 1 },
      { x: 1370, y: GROUND - 90, w: 170, text: '가족을 만난다', ending: 0 },
      { x: 1370, y: GROUND - 260, w: 170, text: '집에 닿는다', ending: 1 },
      { x: 1650, y: GROUND - 70, w: 180, text: '한숨 돌린다', ending: -1 },
      { x: 1900, y: GROUND - 70, w: 220, text: '이야기의 끝', ending: -1 },
    ],
  },
];

interface World {
  x: number;
  y: number;
  vx: number;
  vy: number;
  camera: number;
  lives: number;
  onGround: boolean;
  finished: boolean;
  phase: 'ready' | 'run';
  armed: boolean;
  current: string;
}

export default function StoryJumpMapGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 발판 폭·달리는 속도·기회로 나타난다. 길과 이야기는 셋 모두 같다. */
  const plankScale = clamp(tuning.size, 0.78, 1.3);
  const runSpeed = 250 * clamp(tuning.speed, 0.7, 1.3);
  const jumpV = -560 * clamp(tuning.speed, 0.8, 1.2);
  const gravity = 1180 * clamp(tuning.speed, 0.75, 1.25);
  const maxLives = tuning.lives;

  const [ending, setEnding] = useState<number | null>(null);
  const worldRef = useRef<World>({
    x: 160, y: GROUND - 110, vx: 0, vy: 0, camera: 0, lives: maxLives,
    onGround: false, finished: false, phase: 'ready', armed: true, current: '',
  });
  const [hud, setHud] = useState({ lives: maxLives, progress: 0, current: '' });
  const keys = useGameKeys(game.playing && ending !== null);
  const moveRef = useRef(0);
  const jumpRef = useRef(false);

  const resetWorld = () => {
    worldRef.current = {
      x: 160, y: GROUND - 110, vx: 0, vy: 0, camera: 0, lives: maxLives,
      onGround: false, finished: false, phase: 'ready', armed: true, current: '',
    };
    setHud({ lives: maxLives, progress: 0, current: '' });
    moveRef.current = 0;
    jumpRef.current = false;
  };

  useEffect(() => {
    setEnding(null);
    resetWorld();
  }, [game.round, game.stageIndex, stage, maxLives]);

  const planksFor = (chosen: number) => stage.planks.filter(
    (plank) => plank.ending === -1 || plank.ending === chosen,
  );

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    const chosen = ending ?? 0;
    const planks = stage.planks;
    const jumping = keys.held.current.up || keys.held.current.action || jumpRef.current;

    if (dt > 0 && ending !== null && !w.finished) {
      if (w.phase === 'ready') {
        if (!jumping && moveRef.current === 0) w.armed = true;
        if ((jumping || moveRef.current !== 0) && w.armed) {
          w.phase = 'run';
          w.armed = false;
        }
      } else {
        const dir = (keys.held.current.left ? -1 : 0) + (keys.held.current.right ? 1 : 0) + moveRef.current;
        w.vx = clamp(dir, -1, 1) * runSpeed;
        w.x += w.vx * dt;
        w.vy += gravity * dt;
        w.y += w.vy * dt;

        w.onGround = false;
        if (w.vy > 0) {
          for (const plank of planks) {
            // 내 결말로 이어지지 않는 발판은 밟히지 않는다 — 끊긴 길이다
            if (plank.ending !== -1 && plank.ending !== chosen) continue;
            const width = plank.w * plankScale;
            if (w.y + HERO_R < plank.y || w.y + HERO_R > plank.y + 26) continue;
            if (w.x < plank.x - HERO_R || w.x > plank.x + width + HERO_R) continue;
            w.y = plank.y - HERO_R;
            w.vy = 0;
            w.onGround = true;
            w.current = plank.text;
            break;
          }
        }
        if (w.onGround && jumping && w.armed) {
          w.vy = jumpV;
          w.armed = false;
        }
        if (!jumping) w.armed = true;

        if (w.x < 30) w.x = 30;
        w.camera = clamp(w.x - WORLD_W * 0.35, 0, stage.goalX - WORLD_W + 240);

        if (w.y > WORLD_H + 40) {
          w.lives -= 1;
          w.phase = 'ready';
          w.armed = false;
          w.vy = 0;
          // 마지막으로 밟은 안전 발판 근처로 되돌린다
          const back = planks.filter((p) => (p.ending === -1 || p.ending === chosen) && p.x < w.x - 40).pop();
          w.x = back ? back.x + 30 : 160;
          w.y = (back ? back.y : GROUND - 110) - 90;
        }

        const progress = Math.round(clamp((w.x / stage.goalX) * 100, 0, 100));
        if (progress !== hud.progress || w.lives !== hud.lives || w.current !== hud.current) {
          setHud({ lives: w.lives, progress, current: w.current });
        }

        if (w.lives <= 0) {
          w.finished = true;
          game.fail('구덩이에 빠졌어요. 내가 정한 결말로 이어지는 제안을 읽고 밟아 봐요.');
        } else if (w.x >= stage.goalX) {
          w.finished = true;
          game.succeed(`'${stage.endings[chosen]}' 결말까지 내 이야기를 이어 갔어요!`);
        }
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    ctx.save();
    ctx.translate(-w.camera, 0);

    for (const plank of planks) {
      const usable = plank.ending === -1 || plank.ending === chosen;
      const width = plank.w * plankScale;
      if (plank.x - w.camera > WORLD_W + 60 || plank.x + width - w.camera < -60) continue;
      panel(
        ctx, plank.x, plank.y, width, 26,
        usable ? '#1E3A5F' : '#3F2937',
        usable ? PLAY.info : '#7F1D1D', 8,
      );
      centerText(ctx, plank.text, plank.x + width / 2, plank.y + 13, 20, BOARD.ink);
    }

    // 결말 깃발
    panel(ctx, stage.goalX, GROUND - 170, 210, 100, '#064E3B', PLAY.goal, 12);
    centerText(ctx, ending !== null ? stage.endings[ending] : '결말', stage.goalX + 105, GROUND - 120, 24, BOARD.ink);

    ctx.beginPath();
    ctx.arc(w.x, w.y, HERO_R, 0, Math.PI * 2);
    ctx.fillStyle = PLAY.hero;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = PLAY.heroEdge;
    ctx.stroke();
    ctx.restore();

    if (ending !== null && w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 220, WORLD_H - 92, 440, 56, BOARD.overlay, PLAY.hero, 14);
      centerText(
        ctx, w.armed ? '→ 나 스페이스를 누르면 출발합니다' : '손을 떼었다가 다시 누르세요',
        WORLD_W / 2, WORLD_H - 64, 24, BOARD.ink,
      );
    }
  };

  return (
    <MiniGameFrame
      badge="이야기 길 뛰기"
      instruction="이야기의 결말을 먼저 고르고, 그 결말로 이어지는 파란 발판을 밟아 힘차게 달려가 보세요."
      progress={{ label: '나아간 길', value: hud.progress, max: 100 }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => { moveRef.current = 1; window.setTimeout(() => { moveRef.current = 0; }, 380); }} emoji="➡️" label="달리기" />
          <MiniGameButton onClick={() => { jumpRef.current = true; window.setTimeout(() => { jumpRef.current = false; }, 180); }} emoji="⬆️" label="뛰기" />
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {ending === null ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2">
            <p className="text-[17px] font-black" style={{ color: 'var(--board-ink)' }}>내 이야기의 결말을 먼저 골라 보세요</p>
            {stage.endings.map((text, index) => (
              <button
                key={text}
                type="button"
                onClick={() => { setEnding(index); resetWorld(); playSound('confirm'); }}
                className="min-h-14 w-full max-w-[420px] rounded-xl px-4 text-[17px] font-black"
                style={{ background: 'var(--board-surface)', border: '2px solid #4ADE80', color: 'var(--board-ink)' }}
              >
                🏁 {text}
              </button>
            ))}
          </div>
        ) : (
          <>
            <p
              className="rounded-xl px-3 py-1.5 text-[15px] font-black"
              style={{ background: 'var(--board-surface)', border: '2px solid #4ADE80', color: 'var(--board-ink)' }}
            >
              내 결말 · {stage.endings[ending]} {hud.current ? `／ 지금 발판 · ${hud.current}` : ''}
            </p>
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <div className="game-canvas-fit">
                <GameCanvas
                  active={game.playing}
                  width={WORLD_W}
                  height={WORLD_H}
                  onFrame={frame}
                  onPointer={(pointer) => {
                    if (pointer.phase === 'up') { moveRef.current = 0; jumpRef.current = false; return; }
                    if (pointer.y < WORLD_H * 0.5) jumpRef.current = true;
                    else moveRef.current = pointer.x < WORLD_W / 2 ? -1 : 1;
                  }}
                  ariaLabel={`${stage.endings[ending]} 결말까지 이야기 발판을 밟는 놀이. 남은 기회 ${hud.lives}개.`}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </MiniGameFrame>
  );
}
