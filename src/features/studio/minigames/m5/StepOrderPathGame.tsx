import React, { useCallback, useEffect, useRef, useState } from 'react';
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
 * 순서를 세우고 모의 실행으로 검증해 고치는 일이 그리기·굴려 보기·고쳐 그리기 세 박자와
 * 그대로 같다. 그래서 단계를 고르는 퀴즈가 아니라 단계를 잇는 선을 그리게 했다.
 *
 * 구슬이 멈춘 자리가 곧 빠뜨린 선행 조건이다. 어디가 틀렸는지 글로 알려 주지 않아도
 * 보이고, 안전 단계를 건너뛴 구슬은 튕겨 나온다. 학습목표의 두 조건(선행·안전)이 모두
 * 판정이 되는 자리다.
 *
 * 같은 장르를 쓰는 m2-l8(형식 틀로 흘리기)과 조작이 다른 자리는 셋이다.
 *  - m2-l8은 잉크를 자원 삼아 자유 곡선 미끄럼틀을 그린다. 여기서는 정해진 발판끼리만
 *    잇는다. 곡선을 그리는 손이 아니라 무엇 다음에 무엇인지 고르는 손이다.
 *  - 자원이 잉크가 아니라 실행 횟수다. 한 번에 잘 그리는 것이 아니라 굴려 보고 막힌
 *    구간만 고쳐 다시 굴리는 되풀이가 이 판의 중심이다.
 *  - m2-l8의 통은 하나뿐이고 여기서는 발판이 다섯이다. m2-l8이 묻는 것은 "어떤 모양인가"
 *    하나지만, 여기서 묻는 것은 다섯 사이의 앞뒤 관계다.
 *
 * 실패해도 그은 선을 지우지 않는다. `game.resume()`이 이를 위해 있다 — 판을 새로 만드는
 * `retry`를 쓰면 고칠 대상 자체가 사라져 "고쳐 다시 굴린다"가 성립하지 않는다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

const PAD_W = 214;
const PAD_H = 70;
const START = { x: 58, y: 265, r: 36 };
const GOAL = { x: 852, y: 200, w: 96, h: 130 };

/** 발판이 놓이는 다섯 자리. 왼쪽에서 오른쪽으로 늘어놓지 않는다 —
    자리가 곧 순서라는 오해를 주면 앞뒤를 따질 일이 없어진다. */
const SLOTS = [
  { x: 265, y: 100 },
  { x: 265, y: 440 },
  { x: 505, y: 265 },
  { x: 745, y: 100 },
  { x: 745, y: 440 },
];

interface StepSpec {
  id: string;
  label: string;
  /** 이 단계보다 먼저 끝나 있어야 하는 단계들 */
  needs: string[];
  /** 안전 때문에 앞서야 하는 단계. 건너뛰면 구슬이 튕겨 나온다. */
  safety?: boolean;
  /** SLOTS의 몇 번째 자리에 놓을지 */
  slot: number;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  steps: StepSpec[];
}

/*
 * 판 셋은 조작이 같고 상황이 다르다. 세우는 일, 차리는 일, 걷는 일 순서로 놓아
 * 같은 따지기를 세 번 다른 자리에서 해 보게 한다. 특히 2단계는 걷어 내는 일이라
 * 앞뒤가 세우기와 뒤집히는데, 순서를 외운 학생과 이유를 따진 학생이 여기서 갈린다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'booth',
    label: '기본',
    scene: '체험회 부스 세우기',
    spoken: '부스를 세우는 순서를 이어 굴려 봐요.',
    steps: [
      { id: 'cable', label: '전원선 깔기', needs: [], safety: true, slot: 3 },
      { id: 'desk', label: '책상 놓기', needs: ['cable'], slot: 1 },
      { id: 'laptop', label: '노트북 올리기', needs: ['desk'], slot: 4 },
      { id: 'sign', label: '안내판 걸기', needs: ['desk'], slot: 0 },
      { id: 'chair', label: '의자 놓기', needs: ['cable'], slot: 2 },
    ],
  },
  {
    id: 'table',
    label: '1단계',
    scene: '체험 자리 차리기',
    spoken: '체험 자리를 차리는 순서를 이어 굴려 봐요.',
    steps: [
      { id: 'mat', label: '바닥 매트 깔기', needs: [], safety: true, slot: 2 },
      { id: 'bench', label: '작업대 놓기', needs: ['mat'], slot: 4 },
      { id: 'box', label: '재료 상자 올리기', needs: ['bench'], slot: 0 },
      { id: 'name', label: '이름표 붙이기', needs: ['bench'], slot: 3 },
      { id: 'bin', label: '쓰레기통 두기', needs: ['mat'], slot: 1 },
    ],
  },
  {
    id: 'pack',
    label: '2단계',
    scene: '마치고 정리하기',
    spoken: '정리하는 순서를 이어 굴려 봐요.',
    steps: [
      { id: 'power', label: '전원 끄기', needs: [], safety: true, slot: 1 },
      { id: 'laptop', label: '노트북 걷기', needs: ['power'], slot: 3 },
      { id: 'deco', label: '장식 떼기', needs: [], slot: 0 },
      { id: 'cable', label: '전원선 걷기', needs: ['power'], slot: 4 },
      { id: 'desk', label: '책상 접기', needs: ['laptop', 'deco'], slot: 2 },
    ],
  },
];

const START_ID = 'start';
const GOAL_ID = 'goal';

interface NodeBox {
  id: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
}

function nodesOf(stage: StageConfig): NodeBox[] {
  const pads = stage.steps.map((step) => ({
    id: step.id,
    cx: SLOTS[step.slot].x,
    cy: SLOTS[step.slot].y,
    w: PAD_W,
    h: PAD_H,
  }));
  return [
    { id: START_ID, cx: START.x, cy: START.y, w: START.r * 2, h: START.r * 2 },
    ...pads,
    { id: GOAL_ID, cx: GOAL.x + GOAL.w / 2, cy: GOAL.y + GOAL.h / 2, w: GOAL.w, h: GOAL.h },
  ];
}

/** 출발에서 링크를 따라 걸어 나온 마디 차례. 고리가 생겨도 한 바퀴에서 멈춘다. */
function chainOf(links: Record<string, string>): string[] {
  const out = [START_ID];
  const seen = new Set([START_ID]);
  let cur = START_ID;
  while (links[cur] && !seen.has(links[cur])) {
    cur = links[cur];
    seen.add(cur);
    out.push(cur);
    if (cur === GOAL_ID) break;
  }
  return out;
}

/** edit=선을 고치는 중, roll=굴러가는 중, drop=떨어지는 중, done=통에 들어가 멈춤 */
type RunPhase = 'edit' | 'roll' | 'drop' | 'done';

interface Runner {
  phase: RunPhase;
  /** 지금 지나는 구간. chain[leg] → chain[leg + 1] */
  leg: number;
  /** 구간 안에서의 진행(0~1) */
  t: number;
  chain: string[];
  visited: string[];
  x: number;
  y: number;
  /** 떨어질 때의 낙하 속도 */
  fall: number;
  /** 구슬이 멈춘 발판. 그 자리를 붉게 짚어 준다. */
  stuck: string | null;
}

export default function StepOrderPathGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 실행 횟수와 구슬 속도로만 나타난다. 단계와 앞뒤 관계는 셋 모두 같다. */
  const maxRuns = tuning.lives;
  const rollSpeed = 330 * clamp(tuning.speed, 0.7, 1.3);

  const nodes = nodesOf(stage);
  const stepById = new Map(stage.steps.map((s) => [s.id, s]));

  const [links, setLinks] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [runsLeft, setRunsLeft] = useState(maxRuns);
  const [note, setNote] = useState('발판을 눌러 앞뒤로 이어 보세요.');

  const linksRef = useRef(links);
  linksRef.current = links;

  const runner = useRef<Runner>({
    phase: 'edit', leg: 0, t: 0, chain: [], visited: [], x: START.x, y: START.y, fall: 0, stuck: null,
  });

  useEffect(() => {
    setLinks({});
    setOrder([]);
    setSelected(null);
    setRunsLeft(maxRuns);
    setNote('발판을 눌러 앞뒤로 이어 보세요.');
    runner.current = {
      phase: 'edit', leg: 0, t: 0, chain: [], visited: [], x: START.x, y: START.y, fall: 0, stuck: null,
    };
  }, [game.round, game.stageIndex, maxRuns]);

  const nodeAt = (x: number, y: number) =>
    nodes.find((n) => Math.abs(x - n.cx) <= n.w / 2 + 6 && Math.abs(y - n.cy) <= n.h / 2 + 6) ?? null;

  const centerOf = useCallback(
    (id: string) => {
      const node = nodes.find((n) => n.id === id);
      return node ? { x: node.cx, y: node.cy } : { x: START.x, y: START.y };
    },
    [nodes],
  );

  /** 발판 잇기. 한 발판에서 나가는 선도, 들어오는 선도 하나씩만 둔다.
      여러 갈래를 허용하면 "다음은 무엇인가"라는 물음이 흐려진다. */
  const link = (from: string, to: string) => {
    /* 이 저장소에는 @types/react가 없어 갱신 함수의 인자가 좁혀지지 않는다.
       인자 타입을 직접 적어 두지 않으면 값이 unknown으로 새어 나온다. */
    setLinks((prev: Record<string, string>) => {
      const next: Record<string, string> = {};
      for (const key of Object.keys(prev)) {
        if (key === from) continue;
        if (prev[key] === to) continue;
        next[key] = prev[key];
      }
      next[from] = to;
      return next;
    });
    setOrder((prev: string[]) => [...prev.filter((k) => k !== from), from]);
  };

  const undoLink = () => {
    if (runner.current.phase !== 'edit') return;
    const last = order[order.length - 1];
    if (!last) return;
    setLinks((prev: Record<string, string>) => {
      const next = { ...prev };
      delete next[last];
      return next;
    });
    setOrder((prev: string[]) => prev.slice(0, -1));
    setSelected(null);
    setNote('마지막에 이은 선을 지웠어요.');
  };

  const startRun = () => {
    if (runner.current.phase !== 'edit') return;
    const chain = chainOf(linksRef.current);
    if (chain.length < 2) {
      setNote('아직 이은 선이 없어요. 출발에서 발판으로 이어 보세요.');
      return;
    }
    const from = centerOf(chain[0]);
    runner.current = {
      phase: 'roll', leg: 0, t: 0, chain, visited: [], x: from.x, y: from.y, fall: 0, stuck: null,
    };
    setSelected(null);
    game.run('구슬을 굴려 볼게요.');
  };

  /** 굴리기가 끝났을 때. 실행 횟수가 남으면 그은 선을 그대로 두고 조작만 돌려준다. */
  const stumble = (message: string, stuckId: string | null) => {
    const left = runsLeft - 1;
    setRunsLeft(left);
    runner.current.phase = 'drop';
    runner.current.stuck = stuckId;
    if (left <= 0) {
      game.fail(`${message} 실행할 수 있는 횟수를 다 썼어요.`);
    } else {
      setNote(message);
      game.resume();
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const r = runner.current;

    if (dt > 0 && r.phase === 'roll') {
      const fromId = r.chain[r.leg];
      const toId = r.chain[r.leg + 1];
      if (!toId) {
        // 이은 선이 끊긴 자리. 마지막 발판에서 떨어진다.
        stumble('선이 끊겨 구슬이 멈췄어요. 다음 발판까지 이어 보세요.', fromId);
      } else {
        const a = centerOf(fromId);
        const b = centerOf(toId);
        const span = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
        r.t = Math.min(1, r.t + (rollSpeed * dt) / span);
        r.x = a.x + (b.x - a.x) * r.t;
        r.y = a.y + (b.y - a.y) * r.t;

        if (r.t >= 1) {
          if (toId === GOAL_ID) {
            if (r.visited.length >= stage.steps.length) {
              // 통에 들어간 구슬은 통 안에 남는다. 이겼는데 구슬이 사라지면
              // 무엇을 해냈는지가 화면에서 지워진다.
              r.phase = 'done';
              game.succeed('앞 단계가 모두 받쳐 준 순서였어요. 구슬이 완성 통까지 굴러갔어요!');
            } else {
              stumble('아직 안 한 단계를 두고 통으로 갔어요. 다섯 발판을 모두 지나야 해요.', null);
            }
          } else {
            const step = stepById.get(toId);
            const missing = step ? step.needs.filter((n) => !r.visited.includes(n)) : [];
            if (missing.length > 0) {
              const blocker = stepById.get(missing[0]);
              const blocked = blocker?.label ?? '앞 단계';
              if (blocker?.safety) {
                stumble(`${blocked}를 아직 안 해서 구슬이 튕겨 나왔어요.`, toId);
              } else {
                stumble(`${blocked}가 아직 없어서 구슬이 떨어졌어요.`, toId);
              }
            } else {
              r.visited = [...r.visited, toId];
              r.leg += 1;
              r.t = 0;
            }
          }
        }
      }
    } else if (dt > 0 && r.phase === 'drop') {
      r.fall += 1400 * dt;
      r.y += r.fall * dt;
      /* 판 밖으로 나가면 굴리기가 끝난 것이다. 선은 그대로 두고 고칠 수 있게 돌아간다.
         지나간 자국(visited)은 지우되 멈춘 발판 표시는 남긴다 — 어디를 고쳐야 하는지가
         다음 손의 출발점이다. */
      if (r.y > WORLD_H + 60) {
        r.phase = 'edit';
        r.visited = [];
        r.leg = 0;
      }
    }

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 그은 선 — 지나간 구간은 파랑, 아직 안 간 구간은 회색이다.
    const passed = new Set<string>();
    for (let i = 0; i < r.leg; i += 1) passed.add(`${r.chain[i]}>${r.chain[i + 1]}`);
    for (const [from, to] of Object.entries(links)) {
      const a = centerOf(from);
      const b = centerOf(to);
      const done = passed.has(`${from}>${to}`);
      ctx.strokeStyle = done ? B.blue : B.grey;
      ctx.lineWidth = done ? STROKE.heavy : STROKE.base;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      // 어느 쪽으로 가는 선인지 화살표 하나를 돌려 쓴다.
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      drawMark(ctx, 'arrow', (a.x + b.x) / 2, (a.y + b.y) / 2, 22, done ? B.blue : B.grey, angle);
    }

    // 출발
    drawShape(ctx, 'circle', START.x, START.y, START.r, {
      fill: B.yellow, stroke: B.keyline, width: STROKE.base,
    });
    centerText(ctx, '출발', START.x, START.y, 20, B.keyline);

    // 발판
    for (const step of stage.steps) {
      const slot = SLOTS[step.slot];
      const done = r.visited.includes(step.id);
      const stuck = r.stuck === step.id;
      const chosen = selected === step.id;
      drawBar(ctx, slot.x - PAD_W / 2, slot.y - PAD_H / 2, PAD_W, PAD_H, {
        fill: done ? B.blue : B.surface,
        stroke: stuck ? B.red : (chosen ? B.yellow : B.keyline),
        width: stuck || chosen ? STROKE.heavy : STROKE.base,
      });
      centerText(ctx, step.label, slot.x, slot.y + 4, 22, done ? B.ground : B.ink);
      /* 안전 때문에 앞서야 하는 단계는 빨강 삼각을 단다. 색만으로 나누면 판 위에서
         빨강과 파랑의 대비가 1.22라 구별되지 않는다. */
      if (step.safety) {
        drawShape(ctx, 'triangle', slot.x - PAD_W / 2 + 24, slot.y - PAD_H / 2 + 20, 13, {
          fill: B.red, stroke: B.keyline, width: 1,
        });
      }
      if (stuck) drawMark(ctx, 'bang', slot.x + PAD_W / 2 - 24, slot.y - PAD_H / 2 + 20, 20, B.red);
    }

    // 완성 통
    drawBar(ctx, GOAL.x, GOAL.y, GOAL.w, GOAL.h, {
      fill: B.surface, stroke: B.blue, width: STROKE.heavy,
    });
    drawShape(ctx, 'square', GOAL.x + GOAL.w / 2, GOAL.y + 40, 22, {
      fill: B.blue, stroke: B.keyline, width: 1,
    });
    centerText(ctx, '완성', GOAL.x + GOAL.w / 2, GOAL.y + GOAL.h - 34, 20, B.ink);

    // 구슬
    if (r.phase !== 'edit') {
      drawShape(ctx, 'circle', r.x, r.y, 16, { fill: B.yellow, stroke: B.keyline, width: STROKE.hair });
    }
  };

  const handlePointer = (x: number, y: number) => {
    if (!game.playing) return;
    const hit = nodeAt(x, y);
    if (!hit) {
      setSelected(null);
      return;
    }
    if (selected === null) {
      if (hit.id === GOAL_ID) {
        setNote('완성 통은 마지막에 이어요. 먼저 발판을 고르세요.');
        return;
      }
      setSelected(hit.id);
      setNote('이어질 다음 발판을 누르세요.');
      return;
    }
    if (selected === hit.id) {
      setSelected(null);
      return;
    }
    if (hit.id === START_ID) {
      setNote('출발로는 이을 수 없어요. 출발에서 나가는 선만 있어요.');
      return;
    }
    link(selected, hit.id);
    setSelected(null);
    // 고치기 시작하면 멈췄던 자리 표시를 거둔다. 고친 뒤에도 붉게 남아 있으면
    // 아직 틀린 자리인지 지난 자국인지 알 수 없다.
    runner.current.stuck = null;
    setNote('이었어요. 다 이으면 굴려 보세요.');
  };

  const linkedCount = Object.keys(links).length;

  return (
    <MiniGameFrame
      badge="순서 미끄럼틀"
      instruction="발판을 두 번 눌러 앞뒤로 이어 보세요. 다 이으면 굴려 보기를 눌러 구슬이 끝까지 가는지 봅니다. 빨강 삼각이 붙은 발판은 안전 때문에 먼저 해야 합니다."
      progress={{ label: '이은 선', value: linkedCount, max: stage.steps.length + 1 }}
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
          <MiniGameButton
            onClick={undoLink}
            disabled={!game.playing || order.length === 0}
            mark="cross"
            label="선 지우기"
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
              if (pointer.phase === 'down') handlePointer(pointer.x, pointer.y);
            }}
            ariaLabel={`설치 단계를 순서대로 잇는 놀이. 이은 선 ${linkedCount}개, 남은 실행 ${runsLeft}번.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
