import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, createRandom, drawBar, drawShape,
  particleFor, shuffle,
} from '../engine';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m5-l6 · 보낼 단서 칸 열기 (장르 20 · 지뢰 찾기)
 *
 * 아이미가 다르게 알아들은 까닭은 단서가 모자라서다. 칸을 열수록 요청이 촘촘해지고,
 * 열면 안 되는 칸이 바로 개인정보다. 무엇을 보내고 무엇을 보내지 않을지 가르는 일이
 * 이 차시의 판단과 같은 모양이다.
 *
 * **한 번 연 칸은 되돌아가지 않는다.** 개인정보 칸을 열면 경고등이 켜지고 그 칸은 잠긴
 * 채로 남는다. "보낸 것은 되돌릴 수 없다"를 말로 설명하지 않고 규칙으로 전한다.
 *
 * 힌트는 숫자가 아니라 **점의 개수**다. 옆에 붙은 여덟 칸 가운데 보내면 안 되는 것이
 * 몇 개인지 점으로 찍는다. 숫자를 읽지 못하는 학생도 점은 센다.
 *
 * 깃발 모드를 두지 않았다. 여는 모드와 표시하는 모드를 오가면 "지금 어느 모드인가"를
 * 학생이 머리에 들고 있어야 하고, 그 상태는 화면 어디에도 드러나지 않는다. 누르면
 * 열린다 — 그것 하나뿐이다. 대신 되돌릴 수 없으니 누르기 전에 세어 보게 된다.
 *
 * 씨앗 칸 셋은 처음부터 열려 있고 안전이 보장된다. 아무 단서도 없이 첫 칸을 누르면
 * 그것은 판단이 아니라 찍기다. 그 셋의 점이 나머지를 읽어 나가는 실마리가 된다.
 *
 * 같은 장르를 쓰는 m2-l4(예시 지뢰 찾기)와 조작이 다르다. m2-l4는 [예시 보여 주기]가
 * 안전한 칸을 대신 열어 주고 힌트가 숫자라, 여는 쪽을 돕는다. 여기서는 열어 주는 도움이
 * 없고 힌트도 점이며, 연 단서가 아래에 쌓여 다시 부탁하는 문장이 자라난다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

const COLS = 6;
const ROWS = 4;
const CELL_W = 118;
const CELL_H = 76;
const GRID_X = 70;
const GRID_Y = 148;
const cellBox = (index: number) => ({
  x: GRID_X + (index % COLS) * (CELL_W + 6),
  y: GRID_Y + Math.floor(index / COLS) * (CELL_H + 6),
  w: CELL_W,
  h: CELL_H,
});

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  /** 아이미가 잘못 알아들은 첫 요청 */
  asked: string;
  /** 보내도 되는 단서. 칸에 하나씩 들어간다. */
  clues: string[];
  /** 보내면 안 되는 개인정보 */
  privates: string[];
}

/*
 * 판 셋은 조작이 같고 부탁이 다르다. 길 찾기·물건 찾기·약속 잡기로 옮겨 가면서, 개인정보의
 * 종류도 주소에서 이름으로, 다시 시간표로 옮겨 간다. 무엇이 개인정보인지가 상황마다
 * 달라진다는 것을 판이 대신 말한다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'way',
    label: '기본',
    scene: '학교 안에서 길 묻기',
    spoken: '보내도 되는 단서만 열어 다시 부탁해요.',
    asked: '아이미가 "학교 이름과 집 주소를 알려 주세요"라고 답했어요.',
    clues: [
      '건물 삼 층', '계단 옆', '도서실 맞은편', '초록 문',
      '급식실 위층', '복도 끝', '창문 쪽', '엘리베이터 옆',
      '동아리실 근처', '게시판 앞', '화장실 지나서', '나무 화분 옆',
      '체육관 반대편', '보건실 아래', '교무실 옆', '노란 표지판',
      '자판기 앞', '우산꽂이 옆',
    ],
    privates: ['우리 학교 이름', '집 주소', '내 전화번호', '우리 반 명단', '아빠 직장', '내 생년월일'],
  },
  {
    id: 'thing',
    label: '1단계',
    scene: '잃어버린 물건 찾기',
    spoken: '보내도 되는 단서만 열어 다시 부탁해요.',
    asked: '아이미가 "이름과 학년 반을 적어 주세요"라고 답했어요.',
    clues: [
      '파란 물통', '뚜껑이 헐거움', '스티커 두 장', '손잡이 있음',
      '점심때 잃음', '급식실에서', '가방 옆주머니', '바닥에 떨어짐',
      '긁힌 자국', '빨간 끈', '오백 밀리', '금 간 뚜껑',
      '이름표 없음', '뚜껑만 흰색', '바깥 주머니', '체육 시간 뒤',
      '운동장 쪽', '벤치 근처',
    ],
    privates: ['내 이름', '우리 반', '내 사진', '집 전화번호', '누나 이름', '우리 집 층수'],
  },
  {
    id: 'plan',
    label: '2단계',
    scene: '만날 약속 정하기',
    spoken: '보내도 되는 단서만 열어 다시 부탁해요.',
    asked: '아이미가 "학교 시간표를 통째로 올려 주세요"라고 답했어요.',
    clues: [
      '목요일 오후', '두 시간쯤', '실내에서', '앉을 자리 필요',
      '조용한 곳', '넷이 모임', '간식은 각자', '전기 콘센트',
      '가까운 곳', '비 와도 됨', '버스로 갈 수 있음', '한 시 이후',
      '네 시 전에', '큰 책상', '화이트보드', '조명 밝은 곳',
      '계단 없는 곳', '주차 필요 없음',
    ],
    privates: ['학교 시간표', '집 가는 길', '내 이름', '엄마 번호', '우리 동네', '학원 시간'],
  },
];

interface Cell {
  text: string;
  danger: boolean;
  open: boolean;
  /** 옆 여덟 칸 가운데 보내면 안 되는 칸의 수 */
  near: number;
}

interface World {
  cells: Cell[];
  warnings: number;
  finished: boolean;
  flash: number;
  flashCell: number;
}

const TOTAL = COLS * ROWS;
/**
 * 보내면 안 되는 칸의 수.
 *
 * 다섯으로 두었더니 확실히 안전한 칸이 평균 여덟 개밖에 나오지 않았다. 나머지는
 * 지뢰 찾기식 제약 추론(이 칸이 1인데 모르는 이웃이 하나면 그것이 위험하다)을 해야
 * 열리는데, 그 추론은 이 교재의 학생에게 기대할 것이 못 된다.
 *
 * 셋으로 낮추면 확실히 안전한 칸이 평균 열셋이 되어, 목표를 채우고도 남는다.
 * 판 사백 개를 흉내 내어 고른 값이다.
 */
const DANGER_COUNT = 3;
/**
 * 이기는 데 필요한 단서 수.
 *
 * 처음에는 안전한 칸을 **모두** 열어야 이기게 했다가 걷어냈다. 마지막 한두 칸은 점만으로
 * 가려낼 수 없어 찍어야 하는 자리가 생기고, 조심한 학생이 운으로 지는 판이 된다.
 *
 * 게다가 "다 보내야 이긴다"는 이 차시가 말리려는 바로 그 행동이다. 필요한 만큼 모았으면
 * 거기서 멈추는 것이 옳다.
 *
 * 안전한 칸 스물하나 가운데 열넷이면 여러 번 스스로 고르게 되고, 남는 일곱 칸이
 * 위험한 칸과 애매한 칸을 품을 자리가 된다. 지원 수준이 이 수를 낮춰 준다.
 *
 * 판 사백 개를 흉내 내어 재 보니, 확실한 수만 두어 이기는 판이 충분한 지원(열한 개)에서
 * 95%, 도전(열넷)에서 86%다. 나머지는 한 번쯤 판단해야 하는 판이다.
 */
const REQUIRED = 14;

/** 처음부터 열려 있는 씨앗 칸. 셋이면 점을 견줄 거리가 생기고, 그보다 많으면 판이
    시작하자마자 절반쯤 끝나 버린다. */
const SEEDS = [0, 2, 4];

/** 그 칸이 위험한 칸에 맞닿아 있는가. 맞닿지 않은 칸은 점이 없어 발판이 된다. */
function touches(index: number, spots: number[]): boolean {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return spots.some((spot) => {
    const dc = Math.abs((spot % COLS) - col);
    const dr = Math.abs(Math.floor(spot / COLS) - row);
    return dc <= 1 && dr <= 1;
  });
}

function buildCells(stage: StageConfig, seed: number): Cell[] {
  const random = createRandom(seed);
  const clues = shuffle(random, stage.clues);
  const privates = shuffle(random, stage.privates);
  /* 위험한 칸은 씨앗 칸에만 놓지 않는다. 처음에는 첫 줄을 통째로 비워 두었는데, 그러면
     첫 줄만 눌러도 판이 끝나 판단할 것이 없었다.

     그리고 씨앗 셋 가운데 적어도 둘은 점이 없어야 한다. 점 없는 씨앗이 곧 "이 둘레는
     안전하다"는 발판이고, 그런 발판이 없으면 조심한 학생도 첫 수부터 찍어야 한다.
     자리를 스무 번까지 다시 골라 그런 판을 찾는다. */
  const pickSpots = (): number[] => {
    const pool = Array.from({ length: TOTAL }, (_, i) => i).filter((i) => !SEEDS.includes(i));
    let best = shuffle(random, pool).slice(0, DANGER_COUNT);
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const tryout = shuffle(random, pool).slice(0, DANGER_COUNT);
      const footholds = SEEDS.filter((seed) => !touches(seed, tryout)).length;
      if (footholds >= 2) return tryout;
      if (footholds > SEEDS.filter((seed) => !touches(seed, best)).length) best = tryout;
    }
    return best;
  };
  const spots = pickSpots();

  const cells: Cell[] = [];
  let clueAt = 0;
  let privateAt = 0;
  for (let i = 0; i < TOTAL; i += 1) {
    const danger = spots.includes(i);
    cells.push({
      text: danger ? privates[privateAt++ % privates.length] : clues[clueAt++ % clues.length],
      danger,
      open: false,
      near: 0,
    });
  }
  for (let i = 0; i < TOTAL; i += 1) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    let near = 0;
    for (let dc = -1; dc <= 1; dc += 1) {
      for (let dr = -1; dr <= 1; dr += 1) {
        if (dc === 0 && dr === 0) continue;
        const c = col + dc;
        const r = row + dr;
        if (c < 0 || c >= COLS || r < 0 || r >= ROWS) continue;
        if (cells[r * COLS + c].danger) near += 1;
      }
    }
    cells[i].near = near;
  }

  /* 씨앗만 열어 둔다. 나머지는 학생이 하나씩 누른 것만 열린다. */
  for (const seed of SEEDS) cells[seed].open = true;

  return cells;
}

export default function ClueGridGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /*
   * 개인정보를 한 번 보내면 그 판은 거기서 끝난다.
   *
   * 처음에는 경고를 두세 번 주었다가 걷어냈다. 위험한 칸이 셋뿐이라 마구 눌러도 목표에
   * 먼저 닿았고, 여덟 판을 흉내 내 보니 여덟 판 모두 이겼다. 질 수 없는 판은 조심할
   * 까닭이 없다.
   *
   * 무엇보다 이 차시에서 실패는 "많이 보낸 것"이 아니라 "보낸 것" 자체다. 한 번이면
   * 충분하다는 것이 규칙이 되어야 주제와 어긋나지 않는다.
   */
  const maxWarnings = 1;

  /* 지원 수준은 모아야 하는 단서 수로 나타난다. 판과 규칙은 셋 모두 같다. */
  const required = Math.round(REQUIRED / clamp(tuning.tolerance, 0.85, 1.25));

  const worldRef = useRef<World>({ cells: [], warnings: 0, finished: false, flash: 0, flashCell: -1 });
  const [view, setView] = useState({ opened: 0, left: maxWarnings });
  const [note, setNote] = useState('점은 옆에 붙은 칸 가운데 보내면 안 되는 것의 수입니다.');

  useEffect(() => {
    const cells = buildCells(stage, game.seed);
    worldRef.current = { cells, warnings: 0, finished: false, flash: 0, flashCell: -1 };
    setView({ opened: cells.filter((cell) => cell.open && !cell.danger).length, left: maxWarnings });
    setNote('점은 옆에 붙은 칸 가운데 보내면 안 되는 것의 수입니다.');
  }, [game.round, game.stageIndex, maxWarnings, stage, game.seed]);

  const openCell = (index: number) => {
    const w = worldRef.current;
    if (!game.playing || w.finished) return;
    const cell = w.cells[index];
    if (!cell || cell.open) return;
    cell.open = true;
    w.flash = 0.7;
    w.flashCell = index;

    /*
     * 번지기를 두지 않는다.
     *
     * 지뢰 찾기의 오랜 규칙대로 점 없는 칸을 열면 둘레가 함께 열리게 했다가 두 번 고쳐
     * 끝내 걷어냈다. 재귀로 번지게 하니 한 번 누른 것만으로 판이 통째로 열렸고, 한 겹으로
     * 끊어도 첫 줄에서 고리 두 개만 터지면 목표에 닿았다. 흉내 내어 열 판을 돌려 보니
     * 아무 데나 눌러도 열 판 모두 이겼다.
     *
     * 칸 하나가 곧 단서 하나이고 보낸 것은 되돌릴 수 없다는 것이 이 판의 전부다. 덤으로
     * 여러 칸이 열리면 "보낸다"는 감각이 흐려진다. 누른 것만 열린다.
     */

    if (cell.danger) {
      // 보낸 것은 되돌릴 수 없다. 칸은 열린 채로 남고 경고등이 켜진다.
      w.warnings += 1;
      setNote(`"${cell.text}"까지 보내 버렸어요. 한 번 보낸 것은 되돌릴 수 없어요.`);
    } else {
      setNote(`"${cell.text}"${particleFor(cell.text, '을', '를')} 부탁에 더했어요.`);
    }

    /* 진행 수치는 안전하게 모은 단서만 센다. 개인정보 칸까지 세면 실수가 진행으로
       보여 "잘하고 있다"는 잘못된 신호를 준다. */
    const safeOpened = w.cells.filter((item) => item.open && !item.danger).length;
    setView({ opened: safeOpened, left: maxWarnings - w.warnings });

    if (w.warnings >= maxWarnings) {
      w.finished = true;
      game.fail('개인정보를 보내 버렸어요. 점을 세어 위험한 칸을 피해 다시 해 봐요.');
    } else if (safeOpened >= required) {
      w.finished = true;
      game.succeed('개인정보 없이 필요한 단서만 모았어요. 이만큼이면 아이미가 알아들어요!');
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    if (dt > 0 && w.flash > 0) w.flash = Math.max(0, w.flash - dt);

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 잘못 알아들은 첫 요청
    drawBar(ctx, 48, 16, 864, 46, { fill: B.surface, stroke: B.red, width: STROKE.base });
    centerText(ctx, stage.asked, WORLD_W / 2, 39, 21, B.ink);

    // 모은 단서로 자라나는 부탁
    const gathered = w.cells.filter((cell) => cell.open && !cell.danger).map((cell) => cell.text);
    drawBar(ctx, 48, 72, 864, 60, { fill: B.ground, stroke: B.blue, width: STROKE.base });
    const shown = gathered.slice(-5).join(' · ');
    centerText(ctx, shown ? `다시 부탁 · ${shown}` : '다시 부탁 · 칸을 열어 단서를 모으세요',
      WORLD_W / 2, 102, 21, B.ink);

    for (let i = 0; i < w.cells.length; i += 1) {
      const cell = w.cells[i];
      const box = cellBox(i);
      const lit = w.flash > 0 && w.flashCell === i;
      if (!cell.open) {
        drawBar(ctx, box.x, box.y, box.w, box.h, {
          fill: B.surface, stroke: B.grey, width: STROKE.base,
        });
        centerText(ctx, '?', box.x + box.w / 2, box.y + box.h / 2, 28, B.grey);
        continue;
      }
      if (cell.danger) {
        /* 보내면 안 되는 칸은 빨강 삼각이다. 색만으로 나누면 판 위에서 빨강과 파랑의
           대비가 1.22라 구별되지 않는다. */
        drawBar(ctx, box.x, box.y, box.w, box.h, {
          fill: B.ground, stroke: B.red, width: lit ? STROKE.heavy : STROKE.base,
        });
        drawShape(ctx, 'triangle', box.x + box.w / 2, box.y + 26, 15, {
          fill: B.red, stroke: B.keyline, width: 1,
        });
        centerText(ctx, cell.text, box.x + box.w / 2, box.y + box.h - 20, 20, B.red);
        continue;
      }
      drawBar(ctx, box.x, box.y, box.w, box.h, {
        fill: B.blue, stroke: lit ? B.yellow : B.keyline, width: lit ? STROKE.heavy : STROKE.hair,
      });
      centerText(ctx, cell.text, box.x + box.w / 2, box.y + 28, 20, B.ground);
      // 힌트는 숫자가 아니라 점의 개수다
      for (let k = 0; k < cell.near; k += 1) {
        drawShape(ctx, 'circle', box.x + box.w / 2 - (cell.near - 1) * 11 + k * 22, box.y + box.h - 20, 7, {
          fill: B.ground, stroke: B.ground, width: 1,
        });
      }
      if (cell.near === 0) {
        centerText(ctx, '옆은 안전', box.x + box.w / 2, box.y + box.h - 18, 20, B.ground);
      }
    }

    centerText(ctx, `점 하나 = 옆에 보내면 안 되는 칸 하나 · 단서 ${required}개를 모으면 끝납니다`,
      WORLD_W / 2, 522, 20, B.grey);
  };

  const handleTap = (x: number, y: number) => {
    for (let i = 0; i < worldRef.current.cells.length; i += 1) {
      const box = cellBox(i);
      if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
        openCell(i);
        return;
      }
    }
  };

  return (
    <MiniGameFrame
      badge="보낼 단서 칸 열기"
      instruction="보내도 되는 단서 칸만 열어 부탁을 촘촘하게 만드세요. 열린 칸의 점은 옆에 붙은 칸 가운데 보내면 안 되는 것의 수입니다. 한 번 연 칸은 되돌릴 수 없습니다."
      progress={{ label: '모은 단서', value: Math.min(view.opened, required), max: required }}
      hud={<GameHud lives={view.left} maxLives={maxWarnings} />}
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
      actions={<MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') handleTap(pointer.x, pointer.y);
            }}
            ariaLabel={`보낼 단서를 고르는 놀이. 모은 단서 ${view.opened}개, 남은 경고 ${view.left}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
