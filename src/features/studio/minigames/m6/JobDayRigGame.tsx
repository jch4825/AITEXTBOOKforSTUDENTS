import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m6-l10 · 직업 하루 조립 (장르 48 · 조립 개조)
 *
 * m5-l1의 수레가 "문제 진술"이었다면, 이 수레는 **직업의 하루**다. 흥미·강점·필요한
 * 도움 세 자리에 부품을 끼우고 하루 코스(출근·업무·쉼·퇴근)를 달린다.
 *
 * 부품 상자에는 아이미가 예상한 막연한 이미지와 실제 직업인의 이야기에서 나온
 * 구체적인 부품이 섞여 있다. 막연한 부품은 코스 중간에 부서진다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

type Slot = 'like' | 'strong' | 'help';

const SLOT_LABEL: Record<Slot, string> = {
  like: '흥미',
  strong: '강점',
  help: '필요한 도움',
};

interface Part {
  id: string;
  text: string;
  slot: Slot | 'vague';
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  job: string;
  legs: string[];
  parts: Part[];
}

const STAGES: StageConfig[] = [
  {
    id: 'cafe',
    label: '기본',
    spoken: '카페 일하는 사람의 하루를 조립해요.',
    job: '카페에서 일하는 사람',
    legs: ['출근', '준비', '손님 응대', '정리', '퇴근'],
    parts: [
      { id: 'l1', text: '사람과 이야기하기를 좋아합니다', slot: 'like' },
      { id: 's1', text: '순서를 잘 기억합니다', slot: 'strong' },
      { id: 'h1', text: '주문을 그림 메뉴로 확인합니다', slot: 'help' },
      { id: 'v1', text: '멋있어 보입니다', slot: 'vague' },
      { id: 'v2', text: '편해 보입니다', slot: 'vague' },
      { id: 's2', text: '무거운 상자를 옮길 수 있습니다', slot: 'strong' },
    ],
  },
  {
    id: 'library',
    label: '1단계',
    spoken: '도서관에서 일하는 사람의 하루를 조립해요.',
    job: '도서관에서 일하는 사람',
    legs: ['출근', '책 정리', '안내', '점검', '퇴근'],
    parts: [
      { id: 'l1', text: '책 정리하기를 좋아합니다', slot: 'like' },
      { id: 'l2', text: '조용한 곳이 편합니다', slot: 'like' },
      { id: 's1', text: '번호 순서를 잘 맞춥니다', slot: 'strong' },
      { id: 'h1', text: '높은 칸은 사다리를 함께 씁니다', slot: 'help' },
      { id: 'v1', text: '하루 종일 책만 읽습니다', slot: 'vague' },
      { id: 'v2', text: '쉬워 보입니다', slot: 'vague' },
      { id: 'v3', text: '아무 말도 안 해도 됩니다', slot: 'vague' },
    ],
  },
  {
    id: 'garden',
    label: '2단계',
    spoken: '화원에서 일하는 사람의 하루를 조립해요.',
    job: '화원에서 일하는 사람',
    legs: ['출근', '물 주기', '손질', '판매', '정리', '퇴근'],
    parts: [
      { id: 'l1', text: '식물 돌보기를 좋아합니다', slot: 'like' },
      { id: 's1', text: '같은 일을 꾸준히 합니다', slot: 'strong' },
      { id: 's2', text: '색을 잘 구분합니다', slot: 'strong' },
      { id: 'h1', text: '무거운 화분은 수레로 옮깁니다', slot: 'help' },
      { id: 'h2', text: '오전에 손님이 몰리면 함께 봅니다', slot: 'help' },
      { id: 'v1', text: '늘 향기롭습니다', slot: 'vague' },
      { id: 'v2', text: '앉아서만 합니다', slot: 'vague' },
      { id: 'v3', text: '재미만 있습니다', slot: 'vague' },
    ],
  },
];

interface Rig {
  progress: number;
  running: boolean;
  breakAt: number;
  finished: boolean;
}

export default function JobDayRigGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시험 주행 횟수와 코스 속도, 코스 길이로 나타난다. 부품은 같다. */
  const maxTries = tuning.lives;
  const driveSpeed = 0.3 * clamp(tuning.speed, 0.75, 1.3);

  const [slots, setSlots] = useState<Record<Slot, string | null>>({ like: null, strong: null, help: null });
  const [tries, setTries] = useState(maxTries);
  const [note, setNote] = useState('');
  const rigRef = useRef<Rig>({ progress: 0, running: false, breakAt: -1, finished: false });

  useEffect(() => {
    setSlots({ like: null, strong: null, help: null });
    setTries(maxTries);
    setNote('');
    rigRef.current = { progress: 0, running: false, breakAt: -1, finished: false };
  }, [game.round, game.stageIndex, stage, maxTries]);

  const partById = (id: string | null) => stage.parts.find((p) => p.id === id) ?? null;
  const ready = slots.like && slots.strong && slots.help;

  const place = (part: Part, slot: Slot) => {
    if (!game.playing || rigRef.current.running) return;
    playSound('select');
    setSlots((prev) => {
      const next: Record<Slot, string | null> = { ...prev };
      (Object.keys(next) as Slot[]).forEach((key) => { if (next[key] === part.id) next[key] = null; });
      next[slot] = part.id;
      return next;
    });
    setNote('');
  };

  const drive = () => {
    if (!game.playing || !ready || rigRef.current.running) return;
    const order: Slot[] = ['like', 'strong', 'help'];
    const wrong = order.findIndex((slot) => {
      const part = partById(slots[slot]);
      return !part || part.slot !== slot;
    });
    rigRef.current = { progress: 0, running: true, breakAt: wrong, finished: false };
    game.run('직업의 하루를 시험해 봅니다.');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const rig = rigRef.current;

    if (dt > 0 && rig.running && !rig.finished) {
      const limit = rig.breakAt < 0 ? 1.02 : 0.26 + rig.breakAt * 0.22;
      rig.progress = Math.min(limit, rig.progress + driveSpeed * dt);
      if (rig.progress >= 1) {
        rig.running = false;
        rig.finished = true;
        game.succeed(`${stage.job}의 하루를 흥미·강점·필요한 도움으로 채워 끝까지 달렸어요!`);
      } else if (rig.progress >= limit - 0.001 && rig.breakAt >= 0) {
        rig.running = false;
        const left = tries - 1;
        setTries(left);
        const order: Slot[] = ['like', 'strong', 'help'];
        const slot = order[rig.breakAt];
        const part = partById(slots[slot]);
        if (left <= 0) {
          rig.finished = true;
          game.fail('막연한 부품이 끼워져 하루를 끝내지 못했어요. 실제 이야기에서 나온 부품을 골라 봐요.');
        } else {
          setNote(
            part && part.slot === 'vague'
              ? `'${SLOT_LABEL[slot]}' 자리에 막연한 이미지가 들어갔어요. 실제 이야기에서 나온 부품을 넣어 봐요.`
              : `'${SLOT_LABEL[slot]}' 자리의 부품이 그 자리에 맞지 않아요.`,
          );
          game.resume();
        }
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    panel(ctx, 20, 14, WORLD_W - 40, 42, BOARD.overlay, PLAY.info, 10);
    centerText(ctx, `${stage.job}의 하루`, WORLD_W / 2, 35, 22, BOARD.ink);

    // 코스
    const y = 330;
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(50, y + 34, WORLD_W - 100, 26);
    stage.legs.forEach((leg, index) => {
      const x = 70 + (index / (stage.legs.length - 1)) * (WORLD_W - 200);
      const passed = rigRef.current.progress >= index / (stage.legs.length - 1);
      panel(ctx, x - 58, y - 46, 116, 44, passed ? '#064E3B' : BOARD.surface, passed ? PLAY.goal : BOARD.line, 10);
      centerText(ctx, leg, x, y - 24, 20, BOARD.ink);
    });

    // 수레
    const t = clamp(rigRef.current.progress, 0, 1);
    const rx = 70 + t * (WORLD_W - 200);
    ctx.save();
    ctx.translate(rx, y + 10);
    panel(ctx, -56, -30, 112, 44, BOARD.surface, PLAY.hero, 10);
    centerText(ctx, '나', 0, -8, 22, BOARD.ink);
    const order: Slot[] = ['like', 'strong', 'help'];
    order.forEach((slot, index) => {
      const part = partById(slots[slot]);
      const ok = part && part.slot === slot;
      const wx = -38 + index * 38;
      ctx.beginPath();
      if (ok) {
        ctx.arc(wx, 22, 15, 0, Math.PI * 2);
      } else {
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

    order.forEach((slot, index) => {
      const part = partById(slots[slot]);
      panel(ctx, 60 + index * 290, 90, 270, 90, BOARD.surface, part ? PLAY.info : BOARD.line, 12);
      centerText(ctx, SLOT_LABEL[slot], 195 + index * 290, 116, 20, BOARD.inkDim);
      centerText(ctx, part ? part.text : '부품을 넣으세요', 195 + index * 290, 150, 19, BOARD.ink);
    });
  };

  return (
    <MiniGameFrame
      badge="직업 하루 조립"
      instruction="내가 좋아하는 것, 잘하는 것, 도움이 필요한 것을 알맞게 골라 채운 다음, 하루 일과를 시작해 보세요."
      progress={{ label: '채운 자리', value: (['like', 'strong', 'help'] as Slot[]).filter((s) => slots[s]).length, max: 3 }}
      hud={<GameHud lives={tries} maxLives={maxTries} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 조립" />
          <MiniGameButton onClick={drive} disabled={game.isLocked || !ready} emoji="🛻" label="하루 시험" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {stage.parts.map((part) => {
            const used = (['like', 'strong', 'help'] as Slot[]).some((slot) => slots[slot] === part.id);
            return (
              <div key={part.id} className="flex items-center gap-1">
                <span
                  className="rounded-lg px-2 py-1 text-[14px] font-black"
                  style={{
                    background: used ? 'rgba(56, 189, 248, 0.2)' : 'var(--board-overlay)',
                    border: '2px solid var(--board-line)',
                    color: 'var(--board-ink)',
                  }}
                >
                  {part.text}
                </span>
                {(['like', 'strong', 'help'] as Slot[]).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => place(part, slot)}
                    disabled={!game.playing}
                    aria-label={`${part.text}를 ${SLOT_LABEL[slot]} 자리에 넣기`}
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

        {note && <p className="text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>}

        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="game-canvas-fit">
            <GameCanvas
              active={game.playing || game.status === 'running'}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              ariaLabel={`직업의 하루를 조립해 시험하는 놀이. 남은 시험 ${tries}번.`}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
