import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, dist, panel } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m5-l4 · 먼저 할 일 보내기 (장르 40 · 진지 점령)
 *
 * "안전·마감·도움 기준으로 먼저 할 일을 정한다"를 사람 보내기로 만든다.
 * 세 곳이 동시에 차오르지만 차오르는 속도가 다르다. 안전 문제가 가장 빠르다.
 *
 * 사람은 한정돼 있고 걸어가는 데 시간이 걸린다. 그래서 "어디부터"가 유일한 조작이고,
 * 늦게 보낸 곳이 어떻게 되는지가 눈으로 보인다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const BASE = { x: WORLD_W / 2, y: WORLD_H - 90 };

interface Site {
  x: number;
  y: number;
  emoji: string;
  name: string;
  detail: string;
  /** 초당 차오르는 양 */
  rate: number;
  gauge: number;
  workers: number;
  cleared: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  sites: Omit<Site, 'gauge' | 'workers' | 'cleared'>[];
  crew: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'class',
    label: '기본',
    spoken: '한꺼번에 온 세 가지 일에 사람을 보내요.',
    crew: 6,
    sites: [
      { x: 180, y: 180, emoji: '🔥', name: '안전 문제', detail: '물이 새서 바닥이 미끄럽습니다', rate: 8.5 },
      { x: 480, y: 130, emoji: '⏰', name: '마감 문제', detail: '오늘까지 내야 하는 신청서', rate: 5 },
      { x: 780, y: 190, emoji: '🙋', name: '도움 요청', detail: '친구가 상자를 못 듭니다', rate: 3.2 },
    ],
  },
  {
    id: 'fair',
    label: '1단계',
    spoken: '축제 준비 중에 생긴 일에 사람을 보내요.',
    crew: 6,
    sites: [
      { x: 150, y: 160, emoji: '🔥', name: '안전 문제', detail: '전선이 바닥에 늘어져 있습니다', rate: 9.5 },
      { x: 420, y: 220, emoji: '⏰', name: '마감 문제', detail: '30분 뒤에 손님이 옵니다', rate: 6 },
      { x: 690, y: 140, emoji: '🙋', name: '도움 요청', detail: '간판을 혼자 들지 못합니다', rate: 3.8 },
      { x: 850, y: 250, emoji: '📦', name: '정리할 일', detail: '빈 상자가 쌓여 있습니다', rate: 2.4 },
    ],
  },
  {
    id: 'trip',
    label: '2단계',
    spoken: '현장학습 중에 생긴 일에 사람을 보내요.',
    crew: 5,
    sites: [
      { x: 140, y: 200, emoji: '🔥', name: '안전 문제', detail: '길이 미끄러워 넘어질 수 있습니다', rate: 11 },
      { x: 380, y: 130, emoji: '⏰', name: '마감 문제', detail: '버스가 10분 뒤에 떠납니다', rate: 7.5 },
      { x: 620, y: 210, emoji: '🙋', name: '도움 요청', detail: '친구가 가방을 잃어버렸습니다', rate: 4.5 },
      { x: 840, y: 150, emoji: '📦', name: '정리할 일', detail: '자리를 치워야 합니다', rate: 2.6 },
    ],
  },
];

interface Worker {
  x: number;
  y: number;
  target: number;
  arrived: boolean;
}

export default function PriorityDispatchGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 차오르는 속도와 사람 수, 걷는 속도로 나타난다. 급한 차례는 같다. */
  const rateScale = clamp(tuning.speed, 0.6, 1.35);
  const crew = clamp(Math.round(stage.crew * tuning.density), 3, 9);
  const walk = 160 * clamp(tuning.speed, 0.8, 1.3);

  const sitesRef = useRef<Site[]>([]);
  const workersRef = useRef<Worker[]>([]);
  const finishedRef = useRef(false);
  const readyRef = useRef(true);
  const [hud, setHud] = useState({ cleared: 0, idle: crew });

  useEffect(() => {
    sitesRef.current = stage.sites.map((site) => ({ ...site, gauge: 0, workers: 0, cleared: false }));
    workersRef.current = Array.from({ length: crew }, () => ({
      x: BASE.x, y: BASE.y, target: -1, arrived: false,
    }));
    finishedRef.current = false;
    readyRef.current = true;
    setHud({ cleared: 0, idle: crew });
  }, [game.round, game.stageIndex, stage, crew]);

  const send = (siteIndex: number) => {
    if (!game.playing) return;
    const free = workersRef.current.find((worker) => worker.target < 0);
    if (!free) return;
    free.target = siteIndex;
    free.arrived = false;
    playSound('select');
  };

  const recall = (siteIndex: number) => {
    if (!game.playing) return;
    const one = workersRef.current.find((worker) => worker.target === siteIndex);
    if (!one) return;
    one.target = -1;
    one.arrived = false;
    playSound('select');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const sites = sitesRef.current;
    const workers = workersRef.current;

    if (dt > 0 && game.playing && !finishedRef.current && !readyRef.current) {
      for (const worker of workers) {
        const target = worker.target >= 0 ? sites[worker.target] : null;
        const goal = target && !target.cleared ? target : null;
        const gx = goal ? goal.x : BASE.x;
        const gy = goal ? goal.y : BASE.y;
        const d = dist(worker.x, worker.y, gx, gy);
        if (d > 4) {
          worker.x += ((gx - worker.x) / d) * walk * dt;
          worker.y += ((gy - worker.y) / d) * walk * dt;
          worker.arrived = false;
        } else {
          worker.arrived = true;
          if (!goal) worker.target = -1;
        }
      }

      for (let i = 0; i < sites.length; i += 1) {
        const site = sites[i];
        if (site.cleared) continue;
        site.workers = workers.filter((w) => w.target === i && w.arrived).length;
        const change = site.rate * rateScale - site.workers * 14;
        site.gauge = clamp(site.gauge + change * dt, 0, 100);
        if (site.gauge <= 0 && site.workers > 0) {
          site.cleared = true;
          for (const worker of workers) if (worker.target === i) { worker.target = -1; worker.arrived = false; }
          playSound('stamp');
        }
        if (site.gauge >= 100 && !finishedRef.current) {
          finishedRef.current = true;
          game.fail(`${site.name}이 한계를 넘었어요. 가장 빨리 차오르는 안전 문제부터 보내 봐요.`);
        }
      }

      const cleared = sites.filter((site) => site.cleared).length;
      const idle = workers.filter((worker) => worker.target < 0).length;
      if (cleared !== hud.cleared || idle !== hud.idle) setHud({ cleared, idle });
      if (cleared >= sites.length && !finishedRef.current) {
        finishedRef.current = true;
        game.succeed('급한 곳부터 사람을 보내 세 가지 일을 모두 해결했어요!');
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    for (const site of sites) {
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(BASE.x, BASE.y);
      ctx.lineTo(site.x, site.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (const site of sites) {
      const danger = site.gauge > 65;
      panel(ctx, site.x - 128, site.y - 62, 256, 124,
        site.cleared ? '#064E3B' : danger ? '#7F1D1D' : BOARD.surface,
        site.cleared ? PLAY.goal : danger ? PLAY.hazard : PLAY.info, 14);
      centerText(ctx, `${site.emoji} ${site.name}`, site.x, site.y - 38, 22, BOARD.ink);
      centerText(ctx, site.detail, site.x, site.y - 12, 19, BOARD.inkDim);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(site.x - 100, site.y + 6, 200, 16);
      ctx.fillStyle = site.cleared ? PLAY.goal : danger ? PLAY.hazard : PLAY.hero;
      ctx.fillRect(site.x - 100, site.y + 6, 200 * (site.cleared ? 0 : site.gauge / 100), 16);
      centerText(ctx, site.cleared ? '해결' : `사람 ${site.workers}명`, site.x, site.y + 42, 20, BOARD.ink);
    }

    panel(ctx, BASE.x - 90, BASE.y - 34, 180, 68, BOARD.surface, PLAY.hero, 12);
    centerText(ctx, '본부', BASE.x, BASE.y - 12, 22, BOARD.ink);
    centerText(ctx, `대기 ${workers.filter((w) => w.target < 0).length}명`, BASE.x, BASE.y + 14, 20, BOARD.inkDim);

    for (const worker of workers) {
      ctx.beginPath();
      ctx.arc(worker.x, worker.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = PLAY.hero;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = PLAY.heroEdge;
      ctx.stroke();
    }

    if (readyRef.current) {
      panel(ctx, WORLD_W / 2 - 250, WORLD_H / 2 - 30, 500, 60, BOARD.overlay, PLAY.hero, 14);
      centerText(ctx, '아래 버튼으로 사람을 보내면 시작합니다', WORLD_W / 2, WORLD_H / 2, 24, BOARD.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="먼저 할 일 보내기"
      instruction="세 곳의 막대가 차오릅니다. 가장 빨리 차오르는 곳부터 사람을 보내 해결하세요."
      progress={{ label: '해결한 일', value: hud.cleared, max: stage.sites.length }}
      hud={<GameHud score={hud.idle} scoreLabel="본부 대기" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
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
              onPointer={(pointer) => {
                if (pointer.phase !== 'down') return;
                readyRef.current = false;
                const index = sitesRef.current.findIndex(
                  (site) => Math.abs(pointer.x - site.x) < 128 && Math.abs(pointer.y - site.y) < 62,
                );
                if (index >= 0) send(index);
              }}
              ariaLabel={`급한 곳부터 사람을 보내는 놀이. 해결한 일 ${hud.cleared}개.`}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {stage.sites.map((site, index) => (
            <span key={site.name} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => { readyRef.current = false; send(index); }}
                disabled={!game.playing}
                className="min-h-11 rounded-xl px-2.5 text-[15px] font-black"
                style={{ background: 'var(--board-surface)', border: '2px solid #38BDF8', color: 'var(--board-ink)' }}
              >
                {site.emoji} 보내기
              </button>
              <button
                type="button"
                onClick={() => recall(index)}
                disabled={!game.playing}
                aria-label={`${site.name}에서 한 명 부르기`}
                className="min-h-11 rounded-xl px-2 text-[15px] font-black"
                style={{ background: 'var(--board-overlay)', border: '2px solid var(--board-line)', color: 'var(--board-ink)' }}
              >
                ↩
              </button>
            </span>
          ))}
        </div>
      </div>
    </MiniGameFrame>
  );
}
