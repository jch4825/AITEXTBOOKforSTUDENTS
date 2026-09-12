import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, drawBar, drawMark, drawShape,
} from '../engine';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m5-l3 · 순서 미끄럼틀 (장르 6 · 경로 그리기)
 *
 * 순서를 세우고 모의 실행으로 검증해 고치는 일이 놓기·굴려 보기·바꿔 놓기 세 박자와
 * 그대로 같다. 그래서 단계를 고르는 퀴즈가 아니라 미끄럼틀을 직접 조립하게 했다.
 *
 * 처음에는 발판 다섯을 흩어 놓고 두 번 눌러 선을 잇게 만들었다가 걷어냈다. 누른 발판이
 * 어디에 있는지가 화면에 남지 않아 "지금 무엇을 고른 상태인가"를 학생이 머리에 들고
 * 있어야 했고, 자리가 흩어져 있으니 그은 선이 서로 엇갈려 판이 실타래가 됐다.
 *
 * 지금은 칸이 왼쪽 위에서 오른쪽 아래로 한 줄로 내려간다. **순서가 곧 읽는 방향이다.**
 * 카드를 한 번 누르면 다음 빈 칸에 놓이고, 놓인 카드를 누르면 도로 내려온다. 고른 상태를
 * 기억할 일이 없고 선이 엇갈릴 일도 없다. 학생이 하는 판단은 "이번엔 무엇을 놓지?" 하나뿐이고,
 * 그 판단을 다섯 번 되풀이하는 것이 곧 순서 세우기다.
 *
 * 구슬이 멈춘 칸이 곧 빠뜨린 선행 조건이다. 어디가 틀렸는지 글로 알려 주지 않아도 보이고,
 * 안전 단계를 건너뛴 구슬은 튕겨 나온다. 학습목표의 두 조건이 모두 판정이 되는 자리다.
 *
 * 같은 장르를 쓰는 m2-l8(형식 틀로 흘리기)과 조작이 다른 자리는 셋이다.
 *  - m2-l8은 잉크를 자원 삼아 자유 곡선 미끄럼틀을 그린다. 여기서는 미끄럼틀 조각을
 *    칸에 놓아 잇는다. 손이 그리는 손에서 놓는 손으로 바뀐다.
 *  - 자원이 잉크가 아니라 실행 횟수다. 한 번에 잘 그리는 것이 아니라 굴려 보고 틀린
 *    칸만 바꿔 다시 굴리는 되풀이가 이 판의 중심이다.
 *  - m2-l8의 통은 하나뿐이고 묻는 것도 "어떤 모양인가" 하나다. 여기서 묻는 것은 다섯
 *    사이의 앞뒤 관계다.
 *
 * 실패해도 놓은 카드를 쓸어 내지 않는다. `game.resume()`이 이를 위해 있다 — 판을 새로
 * 만드는 `retry`를 쓰면 고칠 대상 자체가 사라져 "고쳐 다시 굴린다"가 성립하지 않는다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

const SLOT_COUNT = 5;
/* 칸 너비는 글자가 정한다. 가장 긴 이름이 일곱 자이고 캔버스 글자는 20 가상 단위
   아래로 내려갈 수 없으므로, 번호 칸까지 더해 200이 하한이다. */
const SLOT_W = 200;
const SLOT_H = 58;
/** 칸은 왼쪽 위에서 오른쪽 아래로 한 칸씩 내려간다. 내려가는 방향이 곧 시간의 방향이다. */
const slotCenter = (index: number) => ({ x: 140 + index * 130, y: 96 + index * 50 });

const TRAY_Y = 462;
const TRAY_W = 178;
const TRAY_H = 56;
const trayCenter = (index: number) => ({ x: 108 + index * 182, y: TRAY_Y });

/* 통은 마지막 칸의 오른쪽 아래다. 계단이 끝나는 자리에 두어야 "여기까지 가면 끝"이
   길의 모양으로 보인다. 카드 판과는 세로로 갈라 놓아 서로 겹치지 않는다. */
const BIN = { x: 800, y: 300, w: 78, h: 90 };
const START = { x: 60, y: 52 };

interface StepSpec {
  id: string;
  label: string;
  /** 이 단계보다 먼저 끝나 있어야 하는 단계들 */
  needs: string[];
  /** 안전 때문에 앞서야 하는 단계. 건너뛰면 구슬이 튕겨 나온다. */
  safety?: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  /** 카드가 처음 놓이는 차례. 정답 순서대로 늘어놓지 않는다. */
  steps: StepSpec[];
}

/*
 * 판 셋은 조작이 같고 상황이 다르다. 세우는 일, 차리는 일, 걷는 일 순서로 놓아 같은
 * 따지기를 세 번 다른 자리에서 해 보게 한다. 특히 2단계는 걷어 내는 일이라 앞뒤가
 * 세우기와 뒤집히는데, 순서를 외운 학생과 이유를 따진 학생이 여기서 갈린다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'booth',
    label: '기본',
    scene: '체험회 부스 세우기',
    spoken: '부스를 세우는 순서대로 카드를 놓아 봐요.',
    steps: [
      { id: 'sign', label: '안내판 걸기', needs: ['desk'] },
      { id: 'cable', label: '전원선 깔기', needs: [], safety: true },
      { id: 'laptop', label: '노트북 올리기', needs: ['desk'] },
      { id: 'chair', label: '의자 놓기', needs: ['cable'] },
      { id: 'desk', label: '책상 놓기', needs: ['cable'] },
    ],
  },
  {
    id: 'table',
    label: '1단계',
    scene: '체험 자리 차리기',
    spoken: '체험 자리를 차리는 순서대로 카드를 놓아 봐요.',
    steps: [
      { id: 'box', label: '재료 상자 놓기', needs: ['bench'] },
      { id: 'name', label: '이름표 붙이기', needs: ['bench'] },
      { id: 'mat', label: '바닥 매트 깔기', needs: [], safety: true },
      { id: 'bin', label: '쓰레기통 두기', needs: ['mat'] },
      { id: 'bench', label: '작업대 놓기', needs: ['mat'] },
    ],
  },
  {
    id: 'pack',
    label: '2단계',
    scene: '마치고 정리하기',
    spoken: '정리하는 순서대로 카드를 놓아 봐요.',
    steps: [
      { id: 'desk', label: '책상 접기', needs: ['laptop', 'deco'] },
      { id: 'cable', label: '전원선 걷기', needs: ['power'] },
      { id: 'deco', label: '장식 떼기', needs: [] },
      { id: 'power', label: '전원 끄기', needs: [], safety: true },
      { id: 'laptop', label: '노트북 걷기', needs: ['power'] },
    ],
  },
];

/** edit=카드를 놓는 중, roll=굴러가는 중, drop=떨어지는 중, done=통에 들어가 멈춤 */
type RunPhase = 'edit' | 'roll' | 'drop' | 'done';

interface Runner {
  phase: RunPhase;
  /** 지금 지나는 구간. 길의 leg번째 마디에서 leg+1번째로 간다. */
  leg: number;
  t: number;
  /** 구슬이 지나온 칸 수. 이만큼이 앞 단계로 인정된다. */
  passed: number;
  x: number;
  y: number;
  fall: number;
  /** 구슬이 멈춘 칸. 그 자리를 붉게 짚어 준다. */
  stuck: number | null;
}

export default function StepOrderPathGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 실행 횟수와 구슬 속도로만 나타난다. 단계와 앞뒤 관계는 셋 모두 같다. */
  const maxRuns = tuning.lives;
  const rollSpeed = 300 * clamp(tuning.speed, 0.7, 1.3);

  /** 칸에 놓인 카드. 값은 stage.steps의 자리번호, 비었으면 -1. */
  const [slots, setSlots] = useState<number[]>(() => Array(SLOT_COUNT).fill(-1));
  const [runsLeft, setRunsLeft] = useState(maxRuns);
  const [note, setNote] = useState('아래 카드를 눌러 먼저 할 일부터 놓아 보세요.');

  const slotsRef = useRef(slots);
  slotsRef.current = slots;

  const runner = useRef<Runner>({
    phase: 'edit', leg: 0, t: 0, passed: 0, x: START.x, y: START.y, fall: 0, stuck: null,
  });

  useEffect(() => {
    setSlots(Array(SLOT_COUNT).fill(-1));
    setRunsLeft(maxRuns);
    setNote('아래 카드를 눌러 먼저 할 일부터 놓아 보세요.');
    runner.current = {
      phase: 'edit', leg: 0, t: 0, passed: 0, x: START.x, y: START.y, fall: 0, stuck: null,
    };
  }, [game.round, game.stageIndex, maxRuns]);

  /** 구슬이 지나는 길. 출발 → 칸 다섯 → 완성 통. */
  const pathPoint = (leg: number) => {
    if (leg <= 0) return { x: START.x, y: START.y };
    if (leg <= SLOT_COUNT) return slotCenter(leg - 1);
    return { x: BIN.x + BIN.w / 2, y: BIN.y + 34 };
  };

  const placedCount = slots.filter((s) => s >= 0).length;

  const placeCard = (cardIndex: number) => {
    if (!game.playing) return;
    const current = slotsRef.current;
    if (current.includes(cardIndex)) return;
    const empty = current.indexOf(-1);
    if (empty < 0) {
      setNote('칸이 다 찼어요. 바꾸려면 놓은 카드를 누르세요.');
      return;
    }
    const next = [...current];
    next[empty] = cardIndex;
    setSlots(next);
    // 고치기 시작하면 멈췄던 자리 표시를 거둔다. 고친 뒤에도 붉게 남아 있으면
    // 아직 틀린 자리인지 지난 자국인지 알 수 없다.
    runner.current.stuck = null;
    runner.current.passed = 0;
    setNote(
      next.includes(-1)
        ? `${empty + 1}번 자리에 놓았어요. 다음에 할 일을 고르세요.`
        : '다 놓았어요. 굴려 보기를 눌러 보세요.',
    );
  };

  const takeBack = (slotIndex: number) => {
    if (!game.playing) return;
    const current = slotsRef.current;
    if (current[slotIndex] < 0) return;
    /* 가운데 카드를 빼면 뒤엣것을 한 칸씩 당긴다. 빈 칸이 가운데 남으면 다음에 놓은
       카드가 그리로 들어가 순서가 학생 생각과 어긋난다. */
    const kept = current.filter((v, i) => v >= 0 && i !== slotIndex);
    const next = [...kept, ...Array(SLOT_COUNT - kept.length).fill(-1)];
    setSlots(next);
    runner.current.stuck = null;
    runner.current.passed = 0;
    setNote('카드를 도로 내렸어요.');
  };

  /** 굴리기가 끝났을 때. 실행 횟수가 남으면 놓은 카드를 그대로 두고 조작만 돌려준다. */
  const stumble = (message: string, stuckSlot: number | null) => {
    const left = runsLeft - 1;
    setRunsLeft(left);
    runner.current.phase = 'drop';
    runner.current.stuck = stuckSlot;
    if (left <= 0) {
      game.fail(`${message} 실행할 수 있는 횟수를 다 썼어요.`);
    } else {
      setNote(message);
      game.resume();
    }
  };

  const startRun = () => {
    if (runner.current.phase !== 'edit') return;
    if (slotsRef.current.includes(-1)) {
      setNote('아직 빈 칸이 있어요. 다섯 칸을 모두 채워 주세요.');
      return;
    }
    runner.current = {
      phase: 'roll', leg: 0, t: 0, passed: 0, x: START.x, y: START.y, fall: 0, stuck: null,
    };
    game.run('구슬을 굴려 볼게요.');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const r = runner.current;
    const placed = slotsRef.current;

    if (dt > 0 && r.phase === 'roll') {
      const a = pathPoint(r.leg);
      const b = pathPoint(r.leg + 1);
      const span = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
      r.t = Math.min(1, r.t + (rollSpeed * dt) / span);
      r.x = a.x + (b.x - a.x) * r.t;
      r.y = a.y + (b.y - a.y) * r.t;

      if (r.t >= 1) {
        const arrived = r.leg; // 방금 도착한 칸의 자리번호
        if (arrived >= SLOT_COUNT) {
          r.phase = 'done';
          game.succeed('앞 단계가 모두 받쳐 준 순서였어요. 구슬이 완성 통까지 굴러갔어요!');
        } else {
          const step = stage.steps[placed[arrived]];
          const before = placed.slice(0, arrived).map((i) => stage.steps[i]?.id);
          const missing = step.needs.filter((need) => !before.includes(need));
          if (missing.length > 0) {
            const blocker = stage.steps.find((s) => s.id === missing[0]);
            const name = blocker?.label ?? '앞 단계';
            if (blocker?.safety) {
              stumble(`${name}를 아직 안 해서 구슬이 튕겨 나왔어요.`, arrived);
            } else {
              stumble(`${name}가 아직 없어서 구슬이 떨어졌어요.`, arrived);
            }
          } else {
            r.passed = arrived + 1;
            r.leg += 1;
            r.t = 0;
          }
        }
      }
    } else if (dt > 0 && r.phase === 'drop') {
      r.fall += 1400 * dt;
      r.y += r.fall * dt;
      /* 판 밖으로 나가면 굴리기가 끝난 것이다. 놓은 카드는 그대로 두고 고칠 수 있게
         돌아간다. 지나온 자국은 지우되 멈춘 칸 표시는 남긴다 — 어디를 고쳐야 하는지가
         다음 손의 출발점이다. */
      if (r.y > WORLD_H + 60) {
        r.phase = 'edit';
        r.passed = 0;
        r.leg = 0;
      }
    }

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 출발 표시 — 글자는 동그라미 오른쪽에 둔다. 아래에 두면 1번 칸과 겹친다.
    drawShape(ctx, 'circle', START.x, START.y, 20, {
      fill: B.yellow, stroke: B.keyline, width: STROKE.base,
    });
    centerText(ctx, '출발', START.x + 46, START.y, 20, B.grey);

    // 칸을 잇는 미끄럼틀 — 지나온 구간은 파랑, 아직 안 간 구간은 회색이다.
    for (let i = 0; i <= SLOT_COUNT; i += 1) {
      const a = pathPoint(i);
      const b = pathPoint(i + 1);
      const done = i < r.passed || (r.phase === 'done' && i <= SLOT_COUNT);
      ctx.strokeStyle = done ? B.blue : B.grey;
      ctx.lineWidth = done ? STROKE.heavy : STROKE.base;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // 칸 다섯
    for (let i = 0; i < SLOT_COUNT; i += 1) {
      const c = slotCenter(i);
      const cardIndex = placed[i];
      const step = cardIndex >= 0 ? stage.steps[cardIndex] : null;
      const stuck = r.stuck === i;
      const done = i < r.passed;
      drawBar(ctx, c.x - SLOT_W / 2, c.y - SLOT_H / 2, SLOT_W, SLOT_H, {
        fill: step ? (done ? B.blue : B.surface) : B.ground,
        stroke: stuck ? B.red : (step ? B.keyline : B.grey),
        width: stuck ? STROKE.heavy : STROKE.base,
      });
      // 자리 번호는 늘 보인다. 몇 번째로 할 일인지가 칸의 정체다.
      centerText(ctx, `${i + 1}`, c.x - SLOT_W / 2 + 24, c.y, 22, step && done ? B.ground : B.grey);
      if (step) {
        centerText(ctx, step.label, c.x + 18, c.y, 21, done ? B.ground : B.ink);
        /* 안전 때문에 앞서야 하는 단계는 빨강 삼각을 단다. 색만으로 나누면 판 위에서
           빨강과 파랑의 대비가 1.22라 구별되지 않는다. */
        if (step.safety) {
          drawShape(ctx, 'triangle', c.x + SLOT_W / 2 - 18, c.y - SLOT_H / 2 + 16, 11, {
            fill: B.red, stroke: B.keyline, width: 1,
          });
        }
      }
      if (stuck) drawMark(ctx, 'bang', c.x + SLOT_W / 2 - 18, c.y + SLOT_H / 2 - 16, 20, B.red);
    }

    // 완성 통
    drawBar(ctx, BIN.x, BIN.y, BIN.w, BIN.h, {
      fill: B.surface, stroke: B.blue, width: STROKE.heavy,
    });
    drawShape(ctx, 'square', BIN.x + BIN.w / 2, BIN.y + 30, 20, {
      fill: B.blue, stroke: B.keyline, width: 1,
    });
    centerText(ctx, '완성', BIN.x + BIN.w / 2, BIN.y + BIN.h - 24, 20, B.ink);

    // 아직 안 놓은 카드 — 놓인 카드는 자리를 비워 둔다.
    for (let i = 0; i < stage.steps.length; i += 1) {
      if (placed.includes(i)) continue;
      const c = trayCenter(i);
      const step = stage.steps[i];
      drawBar(ctx, c.x - TRAY_W / 2, c.y - TRAY_H / 2, TRAY_W, TRAY_H, {
        fill: B.surface, stroke: B.yellow, width: STROKE.base,
      });
      centerText(ctx, step.label, c.x, c.y, 21, B.ink);
      if (step.safety) {
        drawShape(ctx, 'triangle', c.x + TRAY_W / 2 - 18, c.y - TRAY_H / 2 + 15, 11, {
          fill: B.red, stroke: B.keyline, width: 1,
        });
      }
    }

    // 구슬
    if (r.phase !== 'edit') {
      drawShape(ctx, 'circle', r.x, r.y, 16, {
        fill: B.yellow, stroke: B.keyline, width: STROKE.hair,
      });
    }
  };

  const handleTap = (x: number, y: number) => {
    if (!game.playing) return;
    for (let i = 0; i < SLOT_COUNT; i += 1) {
      const c = slotCenter(i);
      if (Math.abs(x - c.x) <= SLOT_W / 2 && Math.abs(y - c.y) <= SLOT_H / 2) {
        takeBack(i);
        return;
      }
    }
    for (let i = 0; i < stage.steps.length; i += 1) {
      if (slotsRef.current.includes(i)) continue;
      const c = trayCenter(i);
      if (Math.abs(x - c.x) <= TRAY_W / 2 && Math.abs(y - c.y) <= TRAY_H / 2) {
        placeCard(i);
        return;
      }
    }
  };

  return (
    <MiniGameFrame
      badge="순서 미끄럼틀"
      instruction="아래 카드를 눌러 먼저 할 일부터 1번 칸에 놓아 보세요. 다섯 칸을 채우면 굴려 보기를 눌러 구슬이 끝까지 가는지 봅니다. 빨강 삼각이 붙은 일은 안전 때문에 먼저 해야 합니다."
      progress={{ label: '놓은 단계', value: placedCount, max: SLOT_COUNT }}
      hud={<GameHud lives={runsLeft} maxLives={maxRuns} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="px-1 text-[15px] font-bold" style={{ color: 'var(--game-ink)' }}>
          {stage.scene} · {note}
        </p>
      }
      actions={
        <>
          <MiniGameButton
            onClick={startRun}
            disabled={!game.playing}
            mark="arrow"
            label="굴려 보기"
            variant="primary"
          />
          <MiniGameButton onClick={game.retry} mark="retry" label="처음부터" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing || game.status === 'running'}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') handleTap(pointer.x, pointer.y);
            }}
            ariaLabel={`설치 순서를 놓는 놀이. 놓은 단계 ${placedCount}개, 남은 실행 ${runsLeft}번.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
