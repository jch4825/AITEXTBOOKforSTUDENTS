import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, createRandom, dist, panel, pick,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m4-l1 · 확인 탑 세우기 (장르 34 · 타워 디펜스)
 *
 * "자신 있는 답도 확인한다"를 길목 막기로 만든다. 자신만만한 주장이 교실로 걸어오고,
 * 학생은 그 주장을 확인할 수 있는 탑을 길목에 세운다.
 *
 * 탑마다 확인하는 것이 다르다. 시각 주장은 시간표 탑이, 날짜 주장은 날짜 탑이 막는다.
 * 아무 탑이나 많이 세워서는 막히지 않는다 — 무엇으로 확인할지가 이 게임의 판단이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

type Kind = 'time' | 'date' | 'place';

const TOWER_INFO: Record<Kind, { emoji: string; name: string; color: string }> = {
  time: { emoji: '🕘', name: '시간표 탑', color: '#38BDF8' },
  date: { emoji: '📅', name: '날짜 탑', color: '#FBBF24' },
  place: { emoji: '🏫', name: '장소 탑', color: '#4ADE80' },
};

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  path: { x: number; y: number }[];
  slots: { x: number; y: number }[];
  claims: { kind: Kind; text: string }[];
  waveSize: number;
  total: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'timetable',
    label: '기본',
    spoken: '오늘 시간표를 확인하는 탑을 세워요.',
    path: [{ x: -40, y: 150 }, { x: 300, y: 150 }, { x: 300, y: 380 }, { x: 660, y: 380 }, { x: 660, y: 200 }, { x: 1000, y: 200 }],
    slots: [{ x: 190, y: 250 }, { x: 420, y: 250 }, { x: 420, y: 470 }, { x: 780, y: 300 }, { x: 560, y: 130 }],
    claims: [
      { kind: 'time', text: '4교시는 체육이에요' },
      { kind: 'date', text: '오늘은 금요일이에요' },
      { kind: 'place', text: '3층에서 모여요' },
      { kind: 'time', text: '2시에 끝나요' },
    ],
    waveSize: 2,
    total: 10,
  },
  {
    id: 'notice',
    label: '1단계',
    spoken: '학교 공지를 확인하는 탑을 세워요.',
    path: [{ x: -40, y: 420 }, { x: 240, y: 420 }, { x: 240, y: 140 }, { x: 560, y: 140 }, { x: 560, y: 400 }, { x: 1000, y: 400 }],
    slots: [{ x: 130, y: 280 }, { x: 380, y: 250 }, { x: 380, y: 470 }, { x: 700, y: 260 }, { x: 700, y: 480 }, { x: 460, y: 60 }],
    claims: [
      { kind: 'date', text: '내일은 쉬는 날이에요' },
      { kind: 'place', text: '급식실은 1층이에요' },
      { kind: 'time', text: '조회는 8시 40분이에요' },
      { kind: 'date', text: '이번 주에 시험이 있어요' },
      { kind: 'place', text: '보건실은 2층이에요' },
    ],
    waveSize: 3,
    total: 12,
  },
  {
    id: 'event',
    label: '2단계',
    spoken: '행사 안내를 확인하는 탑을 세워요.',
    path: [{ x: -40, y: 260 }, { x: 200, y: 260 }, { x: 200, y: 90 }, { x: 480, y: 90 }, { x: 480, y: 440 }, { x: 780, y: 440 }, { x: 780, y: 240 }, { x: 1000, y: 240 }],
    slots: [{ x: 110, y: 400 }, { x: 330, y: 210 }, { x: 340, y: 480 }, { x: 620, y: 300 }, { x: 640, y: 90 }, { x: 880, y: 400 }],
    claims: [
      { kind: 'time', text: '2교시에 시작해요' },
      { kind: 'place', text: '운동장에서 해요' },
      { kind: 'date', text: '토요일에 열려요' },
      { kind: 'time', text: '점심 전에 끝나요' },
      { kind: 'place', text: '강당에서 모여요' },
      { kind: 'date', text: '비 오면 다음 주예요' },
    ],
    waveSize: 3,
    total: 14,
  },
];

interface Enemy {
  t: number;
  kind: Kind;
  text: string;
  hp: number;
  slowed: number;
  gone: boolean;
}

interface Tower {
  x: number;
  y: number;
  kind: Kind;
  cool: number;
}

const TOWER_COST = 3;
const TOWER_RANGE = 130;

export default function CheckTowerGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 걷는 속도·동시에 오는 수·통과 허용으로 나타난다. 확인할 주장은 같다. */
  const walkSpeed = 0.028 * clamp(tuning.speed, 0.6, 1.4);
  const waveGap = 6.5 / clamp(tuning.density, 0.7, 1.4);
  const waveSize = Math.max(1, Math.round(stage.waveSize * clamp(tuning.density, 0.7, 1.35)));
  const range = TOWER_RANGE * clamp(tuning.size, 0.85, 1.25);
  const maxLeaks = tuning.lives;

  const enemiesRef = useRef<Enemy[]>([]);
  const towersRef = useRef<Tower[]>([]);
  const spawnRef = useRef({ timer: 0, sent: 0 });
  const randomRef = useRef(createRandom(game.seed));
  const finishedRef = useRef(false);
  const readyRef = useRef(true);

  const [kind, setKind] = useState<Kind>('time');
  const [hud, setHud] = useState({ stopped: 0, leaked: 0, coins: 6 });

  useEffect(() => {
    enemiesRef.current = [];
    towersRef.current = [];
    spawnRef.current = { timer: 0, sent: 0 };
    randomRef.current = createRandom(game.seed);
    finishedRef.current = false;
    readyRef.current = true;
    setKind('time');
    setHud({ stopped: 0, leaked: 0, coins: 6 });
  }, [game.round, game.stageIndex, stage, game.seed]);

  /** 길 위 진행도 t(0~1)를 좌표로 바꾼다. */
  const pointAt = (t: number) => {
    const path = stage.path;
    const total = path.length - 1;
    const p = clamp(t, 0, 1) * total;
    const i = Math.min(total - 1, Math.floor(p));
    const f = p - i;
    return {
      x: path[i].x + (path[i + 1].x - path[i].x) * f,
      y: path[i].y + (path[i + 1].y - path[i].y) * f,
    };
  };

  const placeTower = (x: number, y: number) => {
    if (!game.playing) return;
    const slot = stage.slots.find((s) => dist(s.x, s.y, x, y) < 46);
    if (!slot) return;
    const existing = towersRef.current.find((t) => t.x === slot.x && t.y === slot.y);
    if (existing) {
      // 이미 있는 탑은 종류를 바꾼다. 무엇으로 확인할지 다시 정하는 일이다.
      existing.kind = kind;
      playSound('select');
      return;
    }
    if (hud.coins < TOWER_COST) return;
    towersRef.current.push({ x: slot.x, y: slot.y, kind, cool: 0 });
    setHud((prev) => ({ ...prev, coins: prev.coins - TOWER_COST }));
    playSound('stamp');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const enemies = enemiesRef.current;
    const towers = towersRef.current;

    if (dt > 0 && game.playing && !finishedRef.current && !readyRef.current) {
      const spawn = spawnRef.current;
      spawn.timer += dt;
      if (spawn.timer > waveGap && spawn.sent < stage.total) {
        spawn.timer = 0;
        for (let i = 0; i < waveSize && spawn.sent < stage.total; i += 1) {
          const claim = pick(randomRef.current, stage.claims);
          enemies.push({ t: -i * 0.06, kind: claim.kind, text: claim.text, hp: 100, slowed: 0, gone: false });
          spawn.sent += 1;
        }
      }

      for (const tower of towers) {
        tower.cool = Math.max(0, tower.cool - dt);
        if (tower.cool > 0) continue;
        const target = enemies.find((enemy) => {
          if (enemy.gone || enemy.t < 0) return false;
          const p = pointAt(enemy.t);
          return dist(p.x, p.y, tower.x, tower.y) <= range;
        });
        if (!target) continue;
        tower.cool = 0.55;
        // 맞는 탑만 실제로 막는다. 틀린 탑은 흔들기만 한다.
        if (target.kind === tower.kind) target.hp -= 42;
        else target.slowed = 0.35;
      }

      for (const enemy of enemies) {
        if (enemy.gone) continue;
        if (enemy.hp <= 0) {
          enemy.gone = true;
          setHud((prev) => ({ ...prev, stopped: prev.stopped + 1, coins: prev.coins + 2 }));
          continue;
        }
        enemy.slowed = Math.max(0, enemy.slowed - dt);
        enemy.t += walkSpeed * dt * (enemy.slowed > 0 ? 0.35 : 1);
        if (enemy.t >= 1) {
          enemy.gone = true;
          setHud((prev) => ({ ...prev, leaked: prev.leaked + 1 }));
        }
      }
      enemiesRef.current = enemies.filter((enemy) => !enemy.gone || enemy.hp > -200);

      if (hud.leaked >= maxLeaks && !finishedRef.current) {
        finishedRef.current = true;
        game.fail('확인하지 못한 답이 교실까지 갔어요. 주장에 맞는 확인 탑을 길목에 세워 봐요.');
      } else if (hud.stopped >= stage.total && !finishedRef.current) {
        finishedRef.current = true;
        game.succeed('자신만만한 답을 모두 공식 자료로 확인해 막았어요!');
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 길
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 46;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    stage.path.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    // 교실
    const end = stage.path[stage.path.length - 1];
    panel(ctx, end.x - 90, end.y - 46, 110, 92, '#064E3B', PLAY.goal, 12);
    centerText(ctx, '교실', end.x - 35, end.y, 24, BOARD.ink);

    // 빈 자리
    for (const slot of stage.slots) {
      const has = towers.find((t) => t.x === slot.x && t.y === slot.y);
      if (has) continue;
      ctx.beginPath();
      ctx.arc(slot.x, slot.y, 24, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (const tower of towers) {
      const info = TOWER_INFO[tower.kind];
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, range, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.lineWidth = 2;
      ctx.stroke();
      panel(ctx, tower.x - 26, tower.y - 26, 52, 52, BOARD.surface, info.color, 10);
      centerText(ctx, info.emoji, tower.x, tower.y, 26, BOARD.ink);
    }

    for (const enemy of enemies) {
      if (enemy.gone || enemy.t < 0) continue;
      const p = pointAt(enemy.t);
      const info = TOWER_INFO[enemy.kind];
      panel(ctx, p.x - 118, p.y - 22, 236, 44, '#3F1D2B', enemy.slowed > 0 ? PLAY.hero : PLAY.hazard, 10);
      centerText(ctx, `${info.emoji} ${enemy.text}`, p.x, p.y - 2, 20, BOARD.ink);
      const ratio = clamp(enemy.hp / 100, 0, 1);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(p.x - 60, p.y + 12, 120, 7);
      ctx.fillStyle = PLAY.goal;
      ctx.fillRect(p.x - 60, p.y + 12, 120 * ratio, 7);
    }

    if (readyRef.current) {
      panel(ctx, WORLD_W / 2 - 250, WORLD_H / 2 - 34, 500, 68, BOARD.overlay, PLAY.hero, 14);
      centerText(ctx, '탑을 세운 뒤 판을 누르면 시작합니다', WORLD_W / 2, WORLD_H / 2, 26, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="확인 탑 세우기"
      instruction="주장에 맞는 확인 탑을 고르고 길목의 빈 자리를 눌러 세우세요. 맞는 탑만 그 주장을 막습니다."
      progress={{ label: '확인한 답', value: hud.stopped, max: stage.total }}
      hud={<GameHud lives={maxLeaks - hud.leaked} maxLives={maxLeaks} score={hud.coins} scoreLabel="확인 시간" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 세우기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(TOWER_INFO) as Kind[]).map((key) => {
            const info = TOWER_INFO[key];
            const on = kind === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setKind(key)}
                aria-pressed={on}
                className="min-h-11 rounded-xl px-3 text-[15px] font-black transition"
                style={{
                  background: on ? info.color : 'var(--board-surface)',
                  color: on ? '#0F172A' : 'var(--board-ink)',
                  border: `2px solid ${info.color}`,
                }}
              >
                {info.emoji} {info.name}
              </button>
            );
          })}
          <span className="text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
            탑 하나에 확인 시간 {TOWER_COST}
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
                if (pointer.phase !== 'down') return;
                if (readyRef.current) {
                  const slot = stage.slots.find((s) => dist(s.x, s.y, pointer.x, pointer.y) < 46);
                  if (slot) { placeTower(pointer.x, pointer.y); return; }
                  readyRef.current = false;
                  return;
                }
                placeTower(pointer.x, pointer.y);
              }}
              ariaLabel={`자신만만한 답을 확인 탑으로 막는 놀이. 확인한 답 ${hud.stopped}개, 놓친 답 ${hud.leaked}개.`}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
