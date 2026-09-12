import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, BauhausMark, GameCanvas, GameHud, STROKE,
  centerText, clamp, dist, drawBar, drawMark, drawShape, useCountdown,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';
import type { BauhausMarkKind, ShapeKind } from '../engine';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

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

/**
 * 도구는 이름과 도형을 함께 가진다.
 *
 * 판 안의 짚을 곳에는 이름을 적을 자리가 없어 어떤 도구를 쓰는지는 모양 하나로만
 * 전해진다. 그림 문자는 기기와 글꼴마다 다르게 그려져 그 구실을 못 하므로 도형으로
 * 바꾼다. 판 밖 단추에서 고른 모양을 판 안 짚을 곳에서 다시 만나야 짝이 읽히므로
 * 캔버스와 DOM이 함께 쓰는 도형만 고른다.
 */
type ToolShape = Extract<ShapeKind, BauhausMarkKind>;

const TOOL_INFO: Record<Tool, { name: string; shape: ToolShape }> = {
  thermo: { name: '체온계', shape: 'bar' },
  lens: { name: '돋보기', shape: 'circle' },
  hand: { name: '손', shape: 'semicircle' },
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
    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    /* 몸은 짚을 곳을 얹어 두는 중립 구조물이라 회색 테를 두른 면으로만 그린다.
       모서리를 둥글리지 않아도 머리는 원, 몸통과 팔다리는 막대라 사람으로 읽힌다. */
    drawShape(ctx, 'circle', 480, 130, 124, { fill: B.surface, stroke: B.grey, width: STROKE.base });
    drawBar(ctx, 410, 196, 140, 190, { fill: B.surface, stroke: B.grey, width: STROKE.base });
    drawBar(ctx, 356, 210, 48, 130, { fill: B.surface, stroke: B.grey, width: STROKE.base });
    drawBar(ctx, 556, 210, 48, 130, { fill: B.surface, stroke: B.grey, width: STROKE.base });
    drawBar(ctx, 424, 386, 48, 120, { fill: B.surface, stroke: B.grey, width: STROKE.base });
    drawBar(ctx, 488, 386, 48, 120, { fill: B.surface, stroke: B.grey, width: STROKE.base });

    for (const spot of stage.spots) {
      const done = marked.includes(spot.id);
      const radius = spot.r * radiusScale;
      /* 아직 짚지 않은 곳은 끊긴 붉은 테에 그 곳이 요구하는 도구 모양,
         짚은 곳은 이어진 파란 테에 확인 표시다. 판 위에서 빨강과 파랑은 밝기가
         거의 같아 색만으로는 갈리지 않으므로 안쪽 모양이 뜻을 함께 진다. */
      ctx.setLineDash(done ? [] : [10, 8]);
      drawShape(ctx, 'circle', spot.x, spot.y, radius * 2, {
        stroke: done ? B.blue : B.red,
        width: done ? STROKE.base : STROKE.hair,
      });
      ctx.setLineDash([]);
      if (done) {
        drawMark(ctx, 'check', spot.x, spot.y, 30, B.blue);
      } else {
        drawShape(ctx, TOOL_INFO[spot.tool].shape, spot.x, spot.y, 28, {
          fill: B.red, stroke: B.keyline, width: STROKE.hair,
        });
      }
      /* 부위 이름은 읽어야 하는 글자라 회색이 아니라 ink로 적는다. 판 위에서 회색은
         7:1에 못 미쳐 면과 테두리에만 쓴다. */
      centerText(ctx, spot.part, spot.x, spot.y + radius + 18, 20, B.ink);
    }

    // 알림 카드
    drawBar(ctx, 640, 90, 300, 240, { fill: B.surface, stroke: B.grey, width: STROKE.base });
    centerText(ctx, '어른에게 보낼 알림', 790, 118, 22, B.ink);
    stage.spots.forEach((spot, index) => {
      const done = marked.includes(spot.id);
      const y = 160 + index * 56;
      /* 채운 칸은 면을 파랑으로 뒤집고 글자를 판 색으로 판다. 반투명 덮개를 얹으면
         그 위의 긴 문장이 흐려져 무엇을 적었는지 읽히지 않는다. */
      drawBar(ctx, 660, y - 22, 260, 44, {
        fill: done ? B.blue : B.ground,
        stroke: done ? B.blue : B.grey,
        width: STROKE.hair,
      });
      if (done) drawMark(ctx, 'check', 651, y, 14, B.blue);
      centerText(
        ctx,
        done ? `${spot.when} ${spot.part} ${spot.how}` : '아직 비었습니다',
        790, y, 19, done ? B.ground : B.ink,
      );
    });

    const pointer = pointerRef.current;
    if (pointer) {
      /* 손끝은 학생이 움직이는 것이므로 노랑 원이다. */
      drawShape(ctx, 'circle', pointer.x, pointer.y, 24, { stroke: B.yellow, width: STROKE.hair });
    }

    /* 지금 쥔 도구도 노랑이다. 짚을 곳의 붉은 도형과 같은 모양일 때가 짚을 때다. */
    drawShape(ctx, TOOL_INFO[tool].shape, 96, 470, 30, {
      fill: B.yellow, stroke: B.keyline, width: STROKE.hair,
    });
    centerText(ctx, `고른 도구 · ${TOOL_INFO[tool].name}`, 240, 470, 22, B.ink);
    if (sent) centerText(ctx, '어른에게 보냈습니다', 790, 380, 24, B.blue);
  };

  return (
    <MiniGameFrame
      badge="아픈 곳 짚기"
      instruction="아픈 곳 안에 그려진 모양과 같은 도구를 고른 다음, 동그라미 한가운데를 가만히 짚어 보세요."
      progress={{ label: '적은 알림', value: marked.length, max: stage.spots.length }}
      hud={(
        <GameHud lives={shakes} maxLives={maxShakes} timeLeft={timeLeft} timeTotal={seconds} />
      )}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" />
          <MiniGameButton
            onClick={send}
            disabled={!game.playing || marked.length < stage.spots.length}
            mark="arrow"
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
              className="flex min-h-11 items-center gap-1.5 px-3 text-[15px] font-black transition"
              style={{
                /* 고른 도구는 면이 통째로 노랑으로 뒤집힌다. 테두리만 달라지면
                   판을 보는 동안 무엇을 쥐고 있는지 놓친다. */
                background: tool === key ? 'var(--game-board-yellow)' : 'var(--game-board)',
                color: tool === key ? 'var(--game-board)' : 'var(--game-board-ink)',
                border: 'var(--game-line) solid var(--game-board-yellow)',
              }}
            >
              <BauhausMark kind={TOOL_INFO[key].shape} size={15} />
              {TOOL_INFO[key].name}
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
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>
          {note}
        </p>
      </div>
    </MiniGameFrame>
  );
}
