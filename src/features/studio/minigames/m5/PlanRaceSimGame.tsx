import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m5-l9 · 두 방법 시험 경주 (장르 38 · 오토배틀러)
 *
 * "대안을 두 가지 넘게 만들고 기준으로 비교한다"를 편성과 자동 경주로 만든다.
 * 학생은 달리지 않는다. 두 방법에 카드를 배치하는 것이 유일한 조작이고,
 * 출발을 누르면 코스가 두 방법을 대신 시험해 준다.
 *
 * 이번 판의 기준(안전·시간·도움)에 맞는 쪽이 이겨야 성공이다. 그냥 빨리 도착한
 * 쪽이 아니라, 기준을 만족하며 도착한 쪽이 이긴다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

interface Card {
  id: string;
  name: string;
  time: number;
  safe: number;
  help: number;
}

interface Gate {
  at: number;
  emoji: string;
  name: string;
  key: 'time' | 'safe' | 'help';
  need: number;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  criterion: 'safe' | 'time' | 'help';
  cards: Card[];
  gates: Gate[];
  slots: number;
}

const CRITERION_LABEL: Record<'time' | 'safe' | 'help', string> = {
  time: '시간',
  safe: '안전',
  help: '도움',
};

const STAGES: StageConfig[] = [
  {
    id: 'goto',
    label: '기본',
    spoken: '안전을 가장 중요하게 두고 두 방법을 겨뤄요.',
    criterion: 'safe',
    slots: 2,
    cards: [
      { id: 'bus', name: '버스로 가기', time: 3, safe: 4, help: 2 },
      { id: 'walk', name: '걸어서 가기', time: 1, safe: 3, help: 1 },
      { id: 'adult', name: '어른과 함께', time: 2, safe: 5, help: 5 },
      { id: 'run', name: '뛰어가기', time: 5, safe: 1, help: 0 },
      { id: 'map', name: '지도 보며 가기', time: 2, safe: 4, help: 1 },
      { id: 'call', name: '전화로 묻기', time: 1, safe: 3, help: 4 },
    ],
    gates: [
      { at: 0.3, emoji: '🌧️', name: '비가 옵니다', key: 'safe', need: 7 },
      { at: 0.62, emoji: '⏳', name: '시간이 촉박합니다', key: 'time', need: 3 },
      { at: 0.86, emoji: '🧗', name: '짐이 무겁습니다', key: 'help', need: 5 },
    ],
  },
  {
    id: 'fix',
    label: '1단계',
    spoken: '시간을 가장 중요하게 두고 두 방법을 겨뤄요.',
    criterion: 'time',
    slots: 3,
    cards: [
      { id: 'self', name: '혼자 고치기', time: 2, safe: 2, help: 0 },
      { id: 'guide', name: '설명서 보기', time: 3, safe: 4, help: 1 },
      { id: 'ask', name: '선생님께 묻기', time: 4, safe: 5, help: 5 },
      { id: 'tool', name: '도구 빌리기', time: 3, safe: 3, help: 3 },
      { id: 'video', name: '영상 보고 따라 하기', time: 2, safe: 3, help: 2 },
      { id: 'wait', name: '내일로 미루기', time: 0, safe: 4, help: 0 },
    ],
    gates: [
      { at: 0.28, emoji: '⏳', name: '오늘까지 끝내야 합니다', key: 'time', need: 6 },
      { at: 0.58, emoji: '🌧️', name: '물이 흘러 미끄럽습니다', key: 'safe', need: 8 },
      { at: 0.84, emoji: '🧗', name: '혼자 들 수 없습니다', key: 'help', need: 4 },
    ],
  },
  {
    id: 'carry',
    label: '2단계',
    spoken: '도움을 가장 중요하게 두고 두 방법을 겨뤄요.',
    criterion: 'help',
    slots: 3,
    cards: [
      { id: 'cart', name: '수레 쓰기', time: 3, safe: 4, help: 2 },
      { id: 'two', name: '둘이 나눠 들기', time: 2, safe: 4, help: 5 },
      { id: 'many', name: '여러 번 나눠 가기', time: 1, safe: 5, help: 1 },
      { id: 'once', name: '한 번에 들기', time: 5, safe: 1, help: 0 },
      { id: 'teacher', name: '선생님께 알리기', time: 2, safe: 5, help: 5 },
      { id: 'box', name: '상자에 담기', time: 3, safe: 3, help: 2 },
    ],
    gates: [
      { at: 0.26, emoji: '🧗', name: '짐이 아주 무겁습니다', key: 'help', need: 7 },
      { at: 0.56, emoji: '🌧️', name: '바닥이 젖었습니다', key: 'safe', need: 9 },
      { at: 0.84, emoji: '⏳', name: '10분 안에 옮겨야 합니다', key: 'time', need: 5 },
    ],
  },
];

interface Racer {
  pos: number;
  stopped: boolean;
  stopGate: number;
}

export default function PlanRaceSimGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시도 횟수·경주 속도·관문의 요구 수치로 나타난다. 기준과 카드는 같다. */
  const maxTries = tuning.lives;
  const raceSpeed = 0.2 * clamp(tuning.speed, 0.75, 1.35);
  const needScale = clamp(tuning.tolerance, 0.75, 1.35);

  const [lanes, setLanes] = useState<string[][]>([[], []]);
  const [pickLane, setPickLane] = useState(0);
  const [tries, setTries] = useState(maxTries);
  const [note, setNote] = useState('');
  const racersRef = useRef<Racer[]>([{ pos: 0, stopped: false, stopGate: -1 }, { pos: 0, stopped: false, stopGate: -1 }]);
  const finishedRef = useRef(false);
  const [, redraw] = useState(0);

  useEffect(() => {
    setLanes([[], []]);
    setPickLane(0);
    setTries(maxTries);
    setNote('');
    racersRef.current = [{ pos: 0, stopped: false, stopGate: -1 }, { pos: 0, stopped: false, stopGate: -1 }];
    finishedRef.current = false;
  }, [game.round, game.stageIndex, stage, maxTries]);

  const cardById = (id: string) => stage.cards.find((c) => c.id === id) as Card;

  const sums = (lane: string[]) => lane.reduce(
    (acc, id) => {
      const card = cardById(id);
      return { time: acc.time + card.time, safe: acc.safe + card.safe, help: acc.help + card.help };
    },
    { time: 0, safe: 0, help: 0 },
  );

  const toggle = (cardId: string) => {
    if (!game.playing) return;
    playSound('select');
    setLanes((prev) => {
      const next = prev.map((lane) => lane.filter((id) => id !== cardId));
      if (prev[pickLane].includes(cardId)) return next;
      if (next[pickLane].length >= stage.slots) {
        setNote(`한 방법에는 카드 ${stage.slots}장까지 넣을 수 있어요.`);
        return prev;
      }
      next[pickLane] = [...next[pickLane], cardId];
      return next;
    });
  };

  const ready = lanes[0].length === stage.slots && lanes[1].length === stage.slots;

  const start = () => {
    if (!game.playing || !ready) return;
    racersRef.current = [{ pos: 0, stopped: false, stopGate: -1 }, { pos: 0, stopped: false, stopGate: -1 }];
    game.run('두 방법을 나란히 시험합니다.');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const racers = racersRef.current;

    if (dt > 0 && game.status === 'running' && !finishedRef.current) {
      racers.forEach((racer, index) => {
        if (racer.stopped) return;
        const stat = sums(lanes[index]);
        const gate = stage.gates.find((g) => g.at > racer.pos - 0.001 && g.at <= racer.pos + raceSpeed * dt);
        if (gate) {
          const value = stat[gate.key];
          if (value < gate.need * needScale) {
            racer.stopped = true;
            racer.stopGate = stage.gates.indexOf(gate);
            racer.pos = gate.at;
            return;
          }
        }
        // 시간 수치가 낮으면 느리게 간다. 기준마다 달리는 모습이 달라진다.
        const pace = 0.6 + clamp(stat.time / 12, 0, 0.8);
        racer.pos = Math.min(1, racer.pos + raceSpeed * pace * dt);
      });

      const done = racers.every((r) => r.stopped || r.pos >= 1);
      if (done) {
        const finished = racers.map((r, i) => ({ index: i, ok: r.pos >= 1 }));
        const arrived = finished.filter((r) => r.ok);
        if (arrived.length === 0) {
          const left = tries - 1;
          setTries(left);
          if (left <= 0) {
            finishedRef.current = true;
            game.fail('두 방법 모두 중간에 멈췄어요. 관문이 바라는 수치를 보고 카드를 바꿔 봐요.');
          } else {
            setNote('두 방법 모두 멈췄어요. 멈춘 관문이 바라는 수치를 채워 봐요.');
            game.resume();
          }
          return;
        }
        // 기준 수치가 더 높은 쪽이 이긴다
        const best = arrived.reduce((a, b) => (
          sums(lanes[a.index])[stage.criterion] >= sums(lanes[b.index])[stage.criterion] ? a : b
        ));
        const bestValue = sums(lanes[best.index])[stage.criterion];
        const otherValue = sums(lanes[1 - best.index])[stage.criterion];
        if (arrived.length === 2 && bestValue === otherValue) {
          const left = tries - 1;
          setTries(left);
          if (left <= 0) {
            finishedRef.current = true;
            game.fail(`두 방법의 ${CRITERION_LABEL[stage.criterion]}이 같아요. 기준이 더 높은 편성을 만들어 봐요.`);
          } else {
            setNote(`두 방법이 비겼어요. ${CRITERION_LABEL[stage.criterion]}이 더 높은 쪽을 만들어 봐요.`);
            game.resume();
          }
          return;
        }
        finishedRef.current = true;
        game.succeed(
          `${best.index === 0 ? '방법 가' : '방법 나'}가 ${CRITERION_LABEL[stage.criterion]} 기준으로 이겼어요. 두 방법을 만들어 기준으로 비교했습니다.`,
        );
      }
      redraw((n) => n + 1);
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    panel(ctx, 20, 12, WORLD_W - 40, 46, BOARD.overlay, PLAY.goal, 12);
    centerText(ctx, `오늘의 기준 · ${CRITERION_LABEL[stage.criterion]}이 가장 중요합니다`, WORLD_W / 2, 35, 24, BOARD.ink);

    const laneY = [190, 360];
    laneY.forEach((y, index) => {
      panel(ctx, 60, y - 54, WORLD_W - 120, 108, BOARD.surface, PLAY.info, 12);
      centerText(ctx, index === 0 ? '방법 가' : '방법 나', 110, y, 22, BOARD.ink);

      for (const gate of stage.gates) {
        const gx = 180 + gate.at * (WORLD_W - 300);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(gx, y - 44);
        ctx.lineTo(gx, y + 44);
        ctx.stroke();
        centerText(ctx, gate.emoji, gx, y - 34, 22, BOARD.ink);
        centerText(ctx, `${CRITERION_LABEL[gate.key]} ${Math.round(gate.need * needScale)}`, gx, y + 36, 19, BOARD.inkDim);
      }

      const racer = racersRef.current[index];
      const rx = 180 + racer.pos * (WORLD_W - 300);
      ctx.beginPath();
      ctx.arc(rx, y, 18, 0, Math.PI * 2);
      ctx.fillStyle = racer.stopped ? PLAY.hazard : PLAY.hero;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = racer.stopped ? PLAY.hazardEdge : PLAY.heroEdge;
      ctx.stroke();

      const stat = sums(lanes[index]);
      centerText(ctx, `시간 ${stat.time} · 안전 ${stat.safe} · 도움 ${stat.help}`, WORLD_W - 160, y, 20, BOARD.inkDim);
      if (racer.stopped && racer.stopGate >= 0) {
        centerText(ctx, `${stage.gates[racer.stopGate].name}에서 멈췄어요`, rx + 10, y - 66, 20, PLAY.hazard);
      }
    });

    panel(ctx, WORLD_W - 100, 120, 34, 300, '#064E3B', PLAY.goal, 8);
    centerText(ctx, '끝', WORLD_W - 83, 270, 22, BOARD.ink);
  };

  return (
    <MiniGameFrame
      badge="두 방법 시험 경주"
      instruction={`카드를 골라 두 방법을 각각 ${stage.slots}장씩 채우고 출발을 누르세요. 기준에 맞는 쪽이 이겨야 합니다.`}
      progress={{ label: '채운 카드', value: lanes[0].length + lanes[1].length, max: stage.slots * 2 }}
      hud={<GameHud lives={tries} maxLives={maxTries} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 짜기" />
          <MiniGameButton onClick={start} disabled={game.isLocked || !ready} emoji="🏁" label="출발" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-1.5">
          {[0, 1].map((index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPickLane(index)}
              aria-pressed={pickLane === index}
              disabled={game.isLocked}
              className="min-h-11 flex-1 rounded-xl px-2 text-[15px] font-black transition"
              style={{
                background: pickLane === index ? '#38BDF8' : 'var(--board-surface)',
                color: pickLane === index ? '#0F172A' : 'var(--board-ink)',
                border: '2px solid #38BDF8',
              }}
            >
              {index === 0 ? '방법 가' : '방법 나'} {lanes[index].length}/{stage.slots}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {stage.cards.map((card) => {
            const inA = lanes[0].includes(card.id);
            const inB = lanes[1].includes(card.id);
            const used = inA || inB;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => toggle(card.id)}
                disabled={game.isLocked}
                className="min-h-12 rounded-xl px-2 text-left text-[14px] font-black leading-tight transition"
                style={{
                  background: used ? 'rgba(56, 189, 248, 0.18)' : 'var(--board-surface)',
                  border: `2px solid ${inA ? '#38BDF8' : inB ? '#C4B5FD' : 'var(--board-line)'}`,
                  color: 'var(--board-ink)',
                }}
              >
                {card.name}
                <span className="block text-[14px]" style={{ color: '#94A3B8' }}>
                  시간 {card.time} · 안전 {card.safe} · 도움 {card.help}{used ? (inA ? ' · 가' : ' · 나') : ''}
                </span>
              </button>
            );
          })}
        </div>

        {note && <p className="text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>}

        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="aspect-video max-h-full w-full max-w-[700px]">
            <GameCanvas
              active={game.playing || game.status === 'running'}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              ariaLabel={`두 방법을 자동으로 겨루는 놀이. 기준은 ${CRITERION_LABEL[stage.criterion]}, 남은 시도 ${tries}번.`}
            />
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
