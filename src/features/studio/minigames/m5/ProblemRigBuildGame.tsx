import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m5-l1 · 문제 수레 조립 (장르 48 · 조립 개조)
 *
 * "지금 모습과 원하는 모습을 나눠 적어 진짜 문제를 만든다"를 수레 조립으로 만든다.
 * 세 자리에 알맞은 조각을 끼워야 바퀴가 둥글게 굴러 언덕을 넘는다.
 *
 * 원인을 단정하거나 감정을 적은 조각은 모난 바퀴가 되어 중턱에서 멈춘다 —
 * 고르기만 해서는 알 수 없고 굴려 봐야 보인다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

type Slot = 'now' | 'want' | 'gap';

const SLOT_LABEL: Record<Slot, string> = {
  now: '지금 모습',
  want: '원하는 모습',
  gap: '사이의 차이',
};

interface Chunk {
  id: string;
  text: string;
  slot: Slot | 'bad';
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  chunks: Chunk[];
}

const STAGES: StageConfig[] = [
  {
    id: 'delivery',
    label: '기본',
    spoken: '물품이 오지 않은 상황의 문제를 조립해요.',
    scene: '주문한 상자가 오지 않았습니다',
    chunks: [
      { id: 'n1', text: '상자가 아직 오지 않았습니다', slot: 'now' },
      { id: 'w1', text: '오후 수업 전에 도착해 있어야 합니다', slot: 'want' },
      { id: 'g1', text: '도착까지 두 시간이 모자랍니다', slot: 'gap' },
      { id: 'b1', text: '배달하는 사람이 게을러요', slot: 'bad' },
      { id: 'b2', text: '운이 나빠요', slot: 'bad' },
      { id: 'n2', text: '오늘 오후에 써야 합니다', slot: 'now' },
    ],
  },
  {
    id: 'print',
    label: '1단계',
    spoken: '인쇄가 안 되는 상황의 문제를 조립해요.',
    scene: '발표 자료가 인쇄되지 않았습니다',
    chunks: [
      { id: 'n1', text: '인쇄기에서 종이가 나오지 않습니다', slot: 'now' },
      { id: 'n2', text: '발표는 3교시입니다', slot: 'now' },
      { id: 'w1', text: '3교시 전에 열 장이 준비돼야 합니다', slot: 'want' },
      { id: 'g1', text: '한 장도 나오지 않아 열 장이 비었습니다', slot: 'gap' },
      { id: 'b1', text: '인쇄기가 저를 싫어해요', slot: 'bad' },
      { id: 'b2', text: '누가 일부러 껐어요', slot: 'bad' },
      { id: 'b3', text: '오늘은 되는 일이 없어요', slot: 'bad' },
    ],
  },
  {
    id: 'group',
    label: '2단계',
    spoken: '모둠 준비가 늦어진 상황의 문제를 조립해요.',
    scene: '모둠 준비가 늦어지고 있습니다',
    chunks: [
      { id: 'n1', text: '다섯 가지 중 두 가지만 끝났습니다', slot: 'now' },
      { id: 'n2', text: '남은 시간은 20분입니다', slot: 'now' },
      { id: 'w1', text: '수업이 끝나기 전에 다섯 가지가 끝나야 합니다', slot: 'want' },
      { id: 'w2', text: '모두가 맡은 일을 알고 있어야 합니다', slot: 'want' },
      { id: 'g1', text: '세 가지가 남았는데 시간이 20분뿐입니다', slot: 'gap' },
      { id: 'b1', text: '친구들이 열심히 안 해요', slot: 'bad' },
      { id: 'b2', text: '제 잘못이에요', slot: 'bad' },
      { id: 'b3', text: '시간이 원래 부족해요', slot: 'bad' },
    ],
  },
];

interface Rig {
  x: number;
  progress: number;
  running: boolean;
  stuckWheel: number;
  finished: boolean;
}

export default function ProblemRigBuildGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시험 주행 횟수와 언덕 경사·속도로 나타난다. 조각과 자리는 같다. */
  const maxTries = tuning.lives;
  const slope = 1 / clamp(tuning.tolerance, 0.7, 1.6);
  const driveSpeed = 0.34 * clamp(tuning.speed, 0.75, 1.3);

  const [slots, setSlots] = useState<Record<Slot, string | null>>({ now: null, want: null, gap: null });
  const [tries, setTries] = useState(maxTries);
  const [note, setNote] = useState('');
  const rigRef = useRef<Rig>({ x: 0, progress: 0, running: false, stuckWheel: -1, finished: false });

  useEffect(() => {
    setSlots({ now: null, want: null, gap: null });
    setTries(maxTries);
    setNote('');
    rigRef.current = { x: 0, progress: 0, running: false, stuckWheel: -1, finished: false };
  }, [game.round, game.stageIndex, stage, maxTries]);

  const chunkById = (id: string | null) => stage.chunks.find((c) => c.id === id) ?? null;

  const place = (chunk: Chunk, slot: Slot) => {
    if (!game.playing || rigRef.current.running) return;
    playSound('select');
    setSlots((prev) => {
      const next: Record<Slot, string | null> = { ...prev };
      (Object.keys(next) as Slot[]).forEach((key) => {
        if (next[key] === chunk.id) next[key] = null;
      });
      next[slot] = chunk.id;
      return next;
    });
    setNote('');
  };

  const ready = slots.now && slots.want && slots.gap;

  const drive = () => {
    if (!game.playing || !ready || rigRef.current.running) return;
    const order: Slot[] = ['now', 'want', 'gap'];
    const wrong = order.findIndex((slot) => {
      const chunk = chunkById(slots[slot]);
      return !chunk || chunk.slot !== slot;
    });
    rigRef.current = { x: 0, progress: 0, running: true, stuckWheel: wrong, finished: false };
    game.run('시험 주행을 시작합니다.');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const rig = rigRef.current;

    if (dt > 0 && rig.running && !rig.finished) {
      const limit = rig.stuckWheel < 0 ? 1.02 : 0.3 + rig.stuckWheel * 0.2;
      rig.progress = Math.min(limit, rig.progress + driveSpeed * dt);
      if (rig.progress >= 1) {
        rig.running = false;
        rig.finished = true;
        game.succeed('세 자리를 바르게 채워 문제 수레가 언덕을 넘었어요. 진짜 문제 한 문장이 완성됐습니다.');
      } else if (rig.progress >= limit - 0.001 && rig.stuckWheel >= 0) {
        rig.running = false;
        const left = tries - 1;
        setTries(left);
        const order: Slot[] = ['now', 'want', 'gap'];
        const slot = order[rig.stuckWheel];
        const chunk = chunkById(slots[slot]);
        if (left <= 0) {
          rig.finished = true;
          game.fail('수레가 언덕을 넘지 못했어요. 원인을 단정한 조각을 빼고 보이는 것만 적어 봐요.');
        } else {
          setNote(
            chunk && chunk.slot === 'bad'
              ? `'${SLOT_LABEL[slot]}' 자리에 원인을 단정한 조각이 들어갔어요. 눈에 보이는 것만 적어 봐요.`
              : `'${SLOT_LABEL[slot]}' 자리의 조각이 그 자리에 맞지 않아요.`,
          );
          game.resume();
        }
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 언덕
    const groundY = (t: number) => WORLD_H - 90 - Math.sin(t * Math.PI) * 150 * slope;
    ctx.beginPath();
    ctx.moveTo(0, WORLD_H);
    for (let i = 0; i <= 60; i += 1) {
      const t = i / 60;
      ctx.lineTo(60 + t * (WORLD_W - 200), groundY(t));
    }
    ctx.lineTo(WORLD_W, WORLD_H);
    ctx.closePath();
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.strokeStyle = BOARD.line;
    ctx.lineWidth = 3;
    ctx.stroke();

    panel(ctx, WORLD_W - 150, groundY(1) - 84, 116, 84, '#064E3B', PLAY.goal, 12);
    centerText(ctx, '문제 한 문장', WORLD_W - 92, groundY(1) - 42, 22, BOARD.ink);

    // 수레
    const t = clamp(rig.progress, 0, 1);
    const x = 60 + t * (WORLD_W - 200);
    const y = groundY(t);
    ctx.save();
    ctx.translate(x, y - 34);
    panel(ctx, -56, -30, 112, 44, BOARD.surface, PLAY.hero, 10);
    centerText(ctx, '문제', 0, -8, 22, BOARD.ink);
    const order: Slot[] = ['now', 'want', 'gap'];
    order.forEach((slot, index) => {
      const chunk = chunkById(slots[slot]);
      const ok = chunk && chunk.slot === slot;
      const wx = -38 + index * 38;
      ctx.beginPath();
      if (ok) {
        ctx.arc(wx, 22, 15, 0, Math.PI * 2);
      } else {
        // 모난 바퀴 — 맞지 않는 조각은 굴러가지 않는다
        for (let k = 0; k < 5; k += 1) {
          const a = (k / 5) * Math.PI * 2;
          const px = wx + Math.cos(a) * 16;
          const py = 22 + Math.sin(a) * 16;
          if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }
      ctx.fillStyle = ok ? PLAY.goal : PLAY.hazard;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = ok ? PLAY.goalEdge : PLAY.hazardEdge;
      ctx.stroke();
    });
    ctx.restore();

    panel(ctx, 20, 14, WORLD_W - 40, 42, BOARD.overlay, PLAY.info, 10);
    centerText(ctx, `상황 · ${stage.scene}`, WORLD_W / 2, 35, 22, BOARD.ink);
  };

  return (
    <MiniGameFrame
      badge="문제 수레 조립"
      instruction="조각을 눌러 세 자리에 끼운 다음 시험 주행을 누르세요. 자리에 맞지 않는 조각은 모난 바퀴가 됩니다."
      progress={{ label: '채운 자리', value: (['now', 'want', 'gap'] as Slot[]).filter((s) => slots[s]).length, max: 3 }}
      hud={<GameHud lives={tries} maxLives={maxTries} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 조립" />
          <MiniGameButton onClick={drive} disabled={game.isLocked || !ready} emoji="🛻" label="시험 주행" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex gap-1.5">
          {(['now', 'want', 'gap'] as Slot[]).map((slot) => {
            const chunk = chunkById(slots[slot]);
            return (
              <div
                key={slot}
                className="flex min-h-[62px] flex-1 flex-col justify-center rounded-xl px-2 py-1"
                style={{
                  background: 'var(--board-surface)',
                  border: `2px solid ${chunk ? '#38BDF8' : 'var(--board-line)'}`,
                }}
              >
                <span className="text-[14px] font-black" style={{ color: '#94A3B8' }}>{SLOT_LABEL[slot]}</span>
                <span className="text-[15px] font-black leading-tight" style={{ color: 'var(--board-ink)' }}>
                  {chunk ? chunk.text : '조각을 넣으세요'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {stage.chunks.map((chunk) => {
            const used = (['now', 'want', 'gap'] as Slot[]).some((slot) => slots[slot] === chunk.id);
            return (
              <div key={chunk.id} className="flex items-center gap-1">
                <span
                  className="rounded-lg px-2 py-1 text-[14px] font-black"
                  style={{
                    background: used ? 'rgba(56, 189, 248, 0.2)' : 'var(--board-overlay)',
                    border: '2px solid var(--board-line)',
                    color: 'var(--board-ink)',
                  }}
                >
                  {chunk.text}
                </span>
                {(['now', 'want', 'gap'] as Slot[]).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => place(chunk, slot)}
                    disabled={!game.playing}
                    aria-label={`${chunk.text}를 ${SLOT_LABEL[slot]} 자리에 넣기`}
                    className="min-h-8 rounded px-1.5 text-[14px] font-black"
                    style={{ background: 'var(--board-surface)', border: '2px solid var(--board-line)', color: 'var(--board-ink)' }}
                  >
                    {SLOT_LABEL[slot][0]}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {note && (
          <p className="text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>
        )}

        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="aspect-video max-h-full w-full max-w-[640px]">
            <GameCanvas
              active={game.playing || game.status === 'running'}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              ariaLabel={`문제 수레를 조립해 언덕을 넘는 놀이. 남은 시험 주행 ${tries}번.`}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
