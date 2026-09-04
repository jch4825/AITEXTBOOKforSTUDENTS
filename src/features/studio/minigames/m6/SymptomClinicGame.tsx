import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, dist, panel, useCountdown,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m6-l8 · 아픈 곳 짚기 (장르 51 · 진료 놀이)
 *
 * "몸이 불편할 때 상태를 표현하고 어른에게 먼저 알린다"를 짚기로 만든다.
 * 아픈 곳에 알맞은 도구를 골라 손이 떨리지 않게 정확히 놓아야 한다.
 *
 * 짚을 때마다 위쪽 알림 카드에 언제·어디가·얼마나가 채워진다. 세 칸이 다 차야
 * 어른에게 보내기 버튼이 열린다 — 표현이 갖춰져야 알릴 수 있다는 뜻이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

type Tool = 'thermo' | 'lens' | 'hand';

const TOOL_INFO: Record<Tool, { emoji: string; name: string }> = {
  thermo: { emoji: '🌡️', name: '체온계' },
  lens: { emoji: '🔍', name: '돋보기' },
  hand: { emoji: '🤲', name: '손' },
};

interface Spot {
  id: string;
  x: number;
  y: number;
  r: number;
  tool: Tool;
  part: string;
  when: string;
  how: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  spots: Spot[];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'cold',
    label: '기본',
    spoken: '감기 증상을 짚어 어른에게 알려요.',
    seconds: 90,
    spots: [
      { id: 'head', x: 480, y: 130, r: 46, tool: 'thermo', part: '이마', when: '아침부터', how: '뜨거워요' },
      { id: 'throat', x: 480, y: 216, r: 38, tool: 'lens', part: '목', when: '어제 저녁부터', how: '따끔해요' },
      { id: 'belly', x: 480, y: 330, r: 44, tool: 'hand', part: '배', when: '점심 뒤부터', how: '살살 아파요' },
    ],
  },
  {
    id: 'hurt',
    label: '1단계',
    spoken: '다친 곳을 짚어 어른에게 알려요.',
    seconds: 80,
    spots: [
      { id: 'knee', x: 430, y: 400, r: 38, tool: 'lens', part: '무릎', when: '방금 전에', how: '까졌어요' },
      { id: 'hand', x: 620, y: 300, r: 34, tool: 'hand', part: '손목', when: '체육 시간에', how: '욱신거려요' },
      { id: 'head', x: 480, y: 130, r: 40, tool: 'thermo', part: '이마', when: '조금 전부터', how: '조금 뜨거워요' },
    ],
  },
  {
    id: 'tummy',
    label: '2단계',
    spoken: '배탈 증상을 짚어 어른에게 알려요.',
    seconds: 70,
    spots: [
      { id: 'belly', x: 480, y: 320, r: 34, tool: 'hand', part: '배', when: '아침 먹고부터', how: '계속 아파요' },
      { id: 'throat', x: 480, y: 212, r: 30, tool: 'lens', part: '목', when: '조금 전부터', how: '메스꺼워요' },
      { id: 'head', x: 480, y: 128, r: 32, tool: 'thermo', part: '이마', when: '어제 밤부터', how: '많이 뜨거워요' },
    ],
  },
];

export default function SymptomClinicGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 허용 반경·시간·흔들림 허용으로 나타난다. 짚을 곳은 셋 모두 같다. */
  const radiusScale = clamp(tuning.size, 0.85, 1.3);
  const seconds = Math.round(stage.seconds * tuning.time);
  const maxShakes = tuning.lives;

  const [tool, setTool] = useState<Tool>('thermo');
  const [marked, setMarked] = useState<string[]>([]);
  const [shakes, setShakes] = useState(maxShakes);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    setTool('thermo');
    setMarked([]);
    setShakes(maxShakes);
    setNote('');
    setSent(false);
    pointerRef.current = null;
    doneRef.current = false;
  }, [game.round, game.stageIndex, stage, maxShakes]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    if (!doneRef.current) {
      doneRef.current = true;
      game.fail('시간이 지났어요. 아픈 곳에 알맞은 도구를 골라 가운데를 짚어 봐요.');
    }
  });

  const press = (x: number, y: number) => {
    if (!game.playing || doneRef.current) return;
    const spot = stage.spots.find((s) => dist(s.x, s.y, x, y) < s.r * radiusScale + 26);
    if (!spot) {
      setNote('아픈 곳을 찾아 그 위를 짚어 보세요.');
      return;
    }
    if (marked.includes(spot.id)) {
      setNote(`${spot.part}은 이미 짚었어요.`);
      return;
    }
    if (spot.tool !== tool) {
      setNote(`${spot.part}에는 ${TOOL_INFO[spot.tool].name}을 씁니다.`);
      return;
    }
    const away = dist(spot.x, spot.y, x, y);
    if (away > spot.r * radiusScale) {
      // 가장자리에 닿으면 손이 흔들린 것으로 본다
      setShakes((value) => {
        const left = value - 1;
        if (left <= 0 && !doneRef.current) {
          doneRef.current = true;
          game.fail('손이 여러 번 흔들렸어요. 아픈 곳 가운데를 천천히 짚어 봐요.');
        }
        return left;
      });
      setNote('가장자리에 닿았어요. 가운데를 천천히 짚어 보세요.');
      return;
    }
    playSound('stamp');
    setMarked((prev) => [...prev, spot.id]);
    setNote(`${spot.when} ${spot.part}이 ${spot.how}라고 적었어요.`);
  };

  const send = () => {
    if (!game.playing || doneRef.current) return;
    if (marked.length < stage.spots.length) {
      setNote('아픈 곳을 모두 짚어야 어른에게 보낼 수 있어요.');
      return;
    }
    doneRef.current = true;
    setSent(true);
    game.succeed('언제·어디가·얼마나를 적어 믿을 만한 어른에게 먼저 알렸어요!');
  };

  const frame = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 몸 그림 — 도형으로만 그린다
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = BOARD.line;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(480, 130, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    panel(ctx, 410, 196, 140, 190, '#334155', BOARD.line, 24);
    panel(ctx, 356, 210, 48, 130, '#334155', BOARD.line, 20);
    panel(ctx, 556, 210, 48, 130, '#334155', BOARD.line, 20);
    panel(ctx, 424, 386, 48, 120, '#334155', BOARD.line, 18);
    panel(ctx, 488, 386, 48, 120, '#334155', BOARD.line, 18);

    for (const spot of stage.spots) {
      const done = marked.includes(spot.id);
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r * radiusScale, 0, Math.PI * 2);
      ctx.strokeStyle = done ? PLAY.goal : PLAY.hazard;
      ctx.lineWidth = 4;
      ctx.setLineDash(done ? [] : [8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      centerText(ctx, done ? '✅' : TOOL_INFO[spot.tool].emoji, spot.x, spot.y, 26, BOARD.ink);
      centerText(ctx, spot.part, spot.x, spot.y + spot.r * radiusScale + 18, 20, BOARD.inkDim);
    }

    // 알림 카드
    panel(ctx, 640, 90, 300, 240, BOARD.surface, PLAY.info, 14);
    centerText(ctx, '어른에게 보낼 알림', 790, 118, 22, BOARD.ink);
    stage.spots.forEach((spot, index) => {
      const done = marked.includes(spot.id);
      const y = 160 + index * 56;
      panel(ctx, 660, y - 22, 260, 44, done ? '#064E3B' : BOARD.overlay, done ? PLAY.goal : BOARD.line, 10);
      centerText(
        ctx,
        done ? `${spot.when} ${spot.part} ${spot.how}` : '아직 비었습니다',
        790, y, 19, BOARD.ink,
      );
    });

    const pointer = pointerRef.current;
    if (pointer) {
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 12, 0, Math.PI * 2);
      ctx.strokeStyle = PLAY.hero;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    centerText(ctx, `고른 도구 · ${TOOL_INFO[tool].emoji} ${TOOL_INFO[tool].name}`, 240, 470, 22, BOARD.ink);
    if (sent) centerText(ctx, '어른에게 보냈습니다', 790, 380, 24, PLAY.goal);
  };

  return (
    <MiniGameFrame
      badge="아픈 곳 짚기"
      instruction="아픈 곳에 알맞은 도구를 고르고 원 가운데를 짚으세요. 가장자리에 닿으면 손이 흔들린 것으로 봅니다."
      progress={{ label: '적은 알림', value: marked.length, max: stage.spots.length }}
      hud={<GameHud lives={shakes} maxLives={maxShakes} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" />
          <MiniGameButton
            onClick={send}
            disabled={!game.playing || marked.length < stage.spots.length}
            emoji="📨"
            label="어른에게 보내기"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(TOOL_INFO) as Tool[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTool(key)}
              aria-pressed={tool === key}
              disabled={!game.playing}
              className="min-h-11 rounded-xl px-3 text-[15px] font-black transition"
              style={{
                background: tool === key ? '#FBBF24' : 'var(--board-surface)',
                color: tool === key ? '#3B2100' : 'var(--board-ink)',
                border: '2px solid #FBBF24',
              }}
            >
              {TOOL_INFO[key].emoji} {TOOL_INFO[key].name}
            </button>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="game-canvas-fit">
            <GameCanvas
              active={game.playing}
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                pointerRef.current = { x: pointer.x, y: pointer.y };
                if (pointer.phase === 'down') press(pointer.x, pointer.y);
              }}
              ariaLabel={`아픈 곳을 짚어 어른에게 알리는 놀이. 적은 알림 ${marked.length}개.`}
            />
          </div>
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
