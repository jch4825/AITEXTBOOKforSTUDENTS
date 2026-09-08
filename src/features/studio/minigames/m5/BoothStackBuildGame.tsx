import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, BauhausMark, GameCanvas, GameHud, STROKE, centerText, clamp, drawBar,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m5-l3 · 부스 세우기 (장르 47 · 마을 건설)
 *
 * "이유가 있는 순서"를 무게로 만든다. 기둥 없이 지붕을 놓으면 떨어지고, 바닥판보다
 * 먼저 깐 전선은 밟혀 끊어진다. 순서를 지켜야 서 있는다.
 *
 * 왜 그 순서인지 설명을 읽는 대신, 잘못 놓으면 무너지는 것을 눈으로 본다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const GROUND = WORLD_H - 70;

interface Part {
  id: string;
  name: string;
  w: number;
  h: number;
  /** 이 부품보다 먼저 놓여 있어야 하는 부품들 */
  needs: string[];
  color: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  parts: Part[];
  holdSeconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'small',
    label: '기본',
    spoken: '작은 부스를 순서대로 세워요.',
    holdSeconds: 3,
    parts: [
      { id: 'floor', name: '바닥판', w: 300, h: 34, needs: [], color: B.grey },
      { id: 'postL', name: '왼쪽 기둥', w: 40, h: 130, needs: ['floor'], color: B.grey },
      { id: 'postR', name: '오른쪽 기둥', w: 40, h: 130, needs: ['floor'], color: B.grey },
      { id: 'roof', name: '지붕', w: 320, h: 40, needs: ['postL', 'postR'], color: B.blue },
      { id: 'sign', name: '간판', w: 180, h: 48, needs: ['roof'], color: B.yellow },
    ],
  },
  {
    id: 'wired',
    label: '1단계',
    spoken: '전선까지 있는 부스를 순서대로 세워요.',
    holdSeconds: 3,
    parts: [
      { id: 'floor', name: '바닥판', w: 320, h: 34, needs: [], color: B.grey },
      { id: 'wire', name: '전선', w: 240, h: 22, needs: ['floor'], color: B.surface },
      { id: 'postL', name: '왼쪽 기둥', w: 40, h: 140, needs: ['floor'], color: B.grey },
      { id: 'postR', name: '오른쪽 기둥', w: 40, h: 140, needs: ['floor'], color: B.grey },
      { id: 'roof', name: '지붕', w: 340, h: 40, needs: ['postL', 'postR'], color: B.blue },
      { id: 'sign', name: '간판', w: 190, h: 48, needs: ['roof'], color: B.yellow },
    ],
  },
  {
    id: 'full',
    label: '2단계',
    spoken: '큰 부스를 순서대로 세워요.',
    holdSeconds: 4,
    parts: [
      { id: 'floor', name: '바닥판', w: 340, h: 34, needs: [], color: B.grey },
      { id: 'wire', name: '전선', w: 250, h: 22, needs: ['floor'], color: B.surface },
      { id: 'postL', name: '왼쪽 기둥', w: 40, h: 150, needs: ['floor'], color: B.grey },
      { id: 'postR', name: '오른쪽 기둥', w: 40, h: 150, needs: ['floor'], color: B.grey },
      { id: 'shelf', name: '선반', w: 220, h: 26, needs: ['postL', 'postR'], color: B.blue },
      { id: 'roof', name: '지붕', w: 360, h: 40, needs: ['postL', 'postR'], color: B.blue },
      { id: 'sign', name: '간판', w: 200, h: 48, needs: ['roof'], color: B.yellow },
    ],
  },
];

interface Placed {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  name: string;
  falling: boolean;
  vy: number;
}

export default function BoothStackBuildGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 기회·부품 크기·서 있어야 하는 시간으로 나타난다. 순서 규칙은 같다. */
  const sizeScale = clamp(tuning.size, 0.85, 1.2);
  const maxLives = tuning.lives;
  const holdNeed = stage.holdSeconds / clamp(tuning.speed, 0.8, 1.3);

  const placedRef = useRef<Placed[]>([]);
  const holdRef = useRef(0);
  const finishedRef = useRef(false);
  const [selected, setSelected] = useState<string>(stage.parts[0].id);
  const [hud, setHud] = useState({ built: 0, lives: maxLives, hold: 0 });
  const [note, setNote] = useState('');

  useEffect(() => {
    placedRef.current = [];
    holdRef.current = 0;
    finishedRef.current = false;
    setSelected(stage.parts[0].id);
    setHud({ built: 0, lives: maxLives, hold: 0 });
    setNote('');
  }, [game.round, game.stageIndex, stage, maxLives]);

  const topAt = (x: number, w: number) => {
    let top = GROUND;
    for (const item of placedRef.current) {
      if (item.falling) continue;
      if (x + w / 2 < item.x - item.w / 2 + 6) continue;
      if (x - w / 2 > item.x + item.w / 2 - 6) continue;
      top = Math.min(top, item.y - item.h);
    }
    return top;
  };

  const drop = (x: number) => {
    if (!game.playing || finishedRef.current) return;
    const part = stage.parts.find((p) => p.id === selected);
    if (!part) return;
    if (placedRef.current.some((p) => p.id === part.id)) {
      setNote('그 부품은 이미 놓았어요.');
      return;
    }
    const w = part.w * sizeScale;
    const h = part.h * sizeScale;
    const missing = part.needs.filter((need) => !placedRef.current.some((p) => p.id === need && !p.falling));
    const y = topAt(x, w);

    if (missing.length > 0) {
      // 받쳐 줄 것이 없으면 떨어져 부서진다
      placedRef.current.push({
        id: part.id, x, y: y - 200, w, h, color: part.color, name: part.name, falling: true, vy: 0,
      });
      const names = missing.map((id) => stage.parts.find((p) => p.id === id)?.name ?? id).join('과 ');
      setNote(`${names}을 먼저 놓아야 ${part.name}이 섭니다.`);
      setHud((prev) => {
        const lives = prev.lives - 1;
        if (lives <= 0 && !finishedRef.current) {
          finishedRef.current = true;
          game.fail('부스가 무너졌어요. 바닥부터 기둥, 지붕 순서로 세워 봐요.');
        }
        return { ...prev, lives };
      });
      return;
    }

    // 받침 위에 충분히 걸치지 않으면 기울어져 떨어진다
    const support = placedRef.current.filter((p) => !p.falling && Math.abs(p.y - p.h - y) < 2);
    if (y < GROUND && support.length > 0) {
      const covered = support.some(
        (p) => x > p.x - p.w / 2 - w * 0.2 && x < p.x + p.w / 2 + w * 0.2,
      );
      if (!covered) {
        placedRef.current.push({
          id: part.id, x, y: y - 40, w, h, color: part.color, name: part.name, falling: true, vy: 0,
        });
        setNote(`${part.name}이 받침 밖으로 나갔어요.`);
        setHud((prev) => {
          const lives = prev.lives - 1;
          if (lives <= 0 && !finishedRef.current) {
            finishedRef.current = true;
            game.fail('부스가 무너졌어요. 받침 위에 올려 놓아야 섭니다.');
          }
          return { ...prev, lives };
        });
        return;
      }
    }

    placedRef.current.push({
      id: part.id, x, y, w, h, color: part.color, name: part.name, falling: false, vy: 0,
    });
    playSound('stamp');
    holdRef.current = 0;
    setNote(`${part.name}을 세웠어요.`);
    setHud((prev) => ({ ...prev, built: placedRef.current.filter((p) => !p.falling).length }));

    const next = stage.parts.find((p) => !placedRef.current.some((q) => q.id === p.id && !q.falling));
    if (next) setSelected(next.id);
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const placed = placedRef.current;

    if (dt > 0 && game.playing && !finishedRef.current) {
      for (const item of placed) {
        if (!item.falling) continue;
        item.vy += 1400 * dt;
        item.y += item.vy * dt;
      }
      placedRef.current = placed.filter((item) => !item.falling || item.y < WORLD_H + 200);

      const standing = placedRef.current.filter((item) => !item.falling);
      if (standing.length >= stage.parts.length) {
        holdRef.current += dt;
        if (holdRef.current >= holdNeed) {
          finishedRef.current = true;
          game.succeed('바닥부터 순서대로 세워 부스가 무너지지 않고 섰어요!');
        }
        if (Math.abs(holdRef.current - hud.hold) > 0.12) {
          setHud((prev) => ({ ...prev, hold: holdRef.current }));
        }
      }
    }

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    ctx.fillStyle = B.surface;
    ctx.fillRect(0, GROUND, WORLD_W, WORLD_H - GROUND);
    ctx.strokeStyle = B.grey;
    ctx.lineWidth = STROKE.hair;
    ctx.beginPath();
    ctx.moveTo(0, GROUND);
    ctx.lineTo(WORLD_W, GROUND);
    ctx.stroke();

    for (const item of placedRef.current) {
      /* 무너지는 부품은 붉은 테두리를 얻는다. 색이 아니라 테두리가 바뀌므로
         부품 자체의 색(무엇인지)은 그대로 남는다. */
      drawBar(ctx, item.x - item.w / 2, item.y - item.h, item.w, item.h, {
        fill: item.color,
        stroke: item.falling ? B.red : B.keyline,
        width: item.falling ? STROKE.heavy : STROKE.base,
      });
      if (item.h > 30) centerText(ctx, item.name, item.x, item.y - item.h / 2, 20, B.ground);
    }

    const part = stage.parts.find((p) => p.id === selected);
    if (part && game.playing) {
      drawBar(ctx, WORLD_W / 2 - 250, 14, 500, 44, { fill: B.ground, stroke: B.blue, width: STROKE.base });
      centerText(ctx, `${part.name} · 판을 눌러 놓습니다`, WORLD_W / 2, 36, 22, B.ink);
    }

    const standing = placedRef.current.filter((item) => !item.falling).length;
    if (standing >= stage.parts.length && !finishedRef.current) {
      drawBar(ctx, WORLD_W / 2 - 180, 70, 360, 44,
        { fill: B.ground, stroke: B.blue, width: STROKE.base });
      centerText(ctx, `${Math.max(0, holdNeed - holdRef.current).toFixed(1)}초만 더 버티세요`, WORLD_W / 2, 92, 22, B.ink);
    }
  };

  return (
    <MiniGameFrame
      bauhaus
      badge="부스 세우기"
      instruction="알맞은 부품을 골라 바닥 판에 차례대로 쌓아 보세요. 아래에 받쳐 주는 부품이 없으면 무너질 수 있어요."
      progress={{ label: '세운 부품', value: hud.built, max: stage.parts.length }}
      hud={<GameHud bauhaus lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} mark="retry" label="다시 세우기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {stage.parts.map((part) => {
            const used = placedRef.current.some((p) => p.id === part.id && !p.falling);
            const on = selected === part.id;
            return (
              <button
                key={part.id}
                type="button"
                onClick={() => setSelected(part.id)}
                disabled={!game.playing || used}
                aria-pressed={on}
                className="flex min-h-11 items-center gap-1.5 px-2.5 text-[15px] font-black transition"
                style={{
                  /* 이미 쓴 부품은 파랑으로 꽉 차고 확인 표시가 붙는다. 고른 부품은
                     노랑 — 지금 손에 쥔 것은 판마다 늘 노랑이다. */
                  background: used ? 'var(--game-board-blue)'
                    : on ? 'var(--game-board-yellow)' : 'var(--game-board)',
                  color: used || on ? 'var(--game-board)' : 'var(--game-board-ink)',
                  border: `var(--game-line) solid ${
                    used ? 'var(--game-board-blue)' : 'var(--game-board-grey)'}`,
                }}
              >
                {part.name}
                {used && <BauhausMark kind="check" size={14} />}
              </button>
            );
          })}
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="game-canvas-fit">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                if (pointer.phase === 'down') drop(clamp(pointer.x, 120, WORLD_W - 120));
              }}
              ariaLabel={`부스를 순서대로 세우는 놀이. 세운 부품 ${hud.built}개, 남은 기회 ${hud.lives}개.`}
            />
          </div>
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
