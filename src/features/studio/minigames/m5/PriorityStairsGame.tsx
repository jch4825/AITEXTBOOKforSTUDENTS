import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, createRandom, drawBar, drawShape,
} from '../engine';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m5-l4 · 먼저 할 일 계단 (장르 2 · 무한 계단)
 *
 * 우선순위는 한 번에 하나씩 무엇을 먼저 할지 되풀이하는 일이라 한 칸씩 오르는 계단과
 * 모양이 같다. 일 카드 둘 가운데 먼저 할 쪽을 누르면 그것이 다음 계단이 되어 한 칸
 * 오르고, 고르지 않은 일의 게이지는 계속 찬다.
 *
 * 배우는 것이 "정답 고르기"가 아니라 **미룬 것이 어떻게 되는가**다. 안전(빨강 삼각)이
 * 가장 빨리 차고 마감(파랑 사각)이 그다음, 도움(회색 막대)이 가장 느리다. 그래서 "안전을
 * 먼저"가 설명이 아니라 판의 규칙으로 몸에 남는다.
 *
 * 기준은 색이 아니라 도형이 진다. 판 위에서 빨강과 파랑의 대비는 1.22라 색만으로 나누면
 * 색을 구별 못 하는 학생에게는 둘이 같은 회색이다.
 *
 * 같은 장르를 쓰는 m3-l1(질문 계단 오르기)과 조작이 다르다. m3-l1은 이미 놓인 계단의
 * 방향을 보고 그대로 누르는 반응 조작이라 고를 것이 없다. 여기서는 계단이 아직 없고
 * 내가 고른 쪽에만 계단이 생겨, 카드를 읽지 않으면 밟을 칸 자체가 나타나지 않는다.
 *
 * 카드를 직접 누르게 한다. 좌우 화살표 키로 고르게 하면 "왼쪽이 어느 카드였더라"를
 * 머리에 들고 있어야 해서, 고를 것과 누를 것이 어긋난다. 키보드도 함께 받되 판단의
 * 기본은 카드를 짚는 손이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

const CARD_W = 372;
const CARD_H = 188;
const CARD_Y = 52;
const cardX = (side: number) => (side === 0 ? 66 : 522);

const GOAL_STEPS = 12;
/** 계단은 왼쪽 아래에서 오른쪽 위로 오른다. 오른 칸 수가 곧 남은 거리다. */
const stepBox = (index: number) => ({
  x: 54 + index * 72,
  y: 486 - index * 15,
  w: 64,
  h: 15 + index * 15,
});

/** 일의 종류. 도형이 기준을 지고, 차는 빠르기가 그 기준의 무게를 진다. */
type Kind = 'safety' | 'deadline' | 'help';

const KIND_SHAPE: Record<Kind, 'triangle' | 'square' | 'bar'> = {
  safety: 'triangle',
  deadline: 'square',
  help: 'bar',
};
const KIND_COLOR: Record<Kind, string> = {
  safety: B.red,
  deadline: B.blue,
  help: B.grey,
};
const KIND_LABEL: Record<Kind, string> = {
  safety: '안전',
  deadline: '마감',
  help: '도움',
};
/** 게이지가 가득 차기까지의 초. 안전이 가장 빠르다. */
const KIND_SECONDS: Record<Kind, number> = {
  safety: 5,
  deadline: 8,
  help: 14,
};

/**
 * 한쪽을 고르면 반대쪽이 올라서는 눈금.
 *
 * 시간만으로 차오르게 했더니 고르는 일이 한가했다. 하나를 고르는 것은 곧 다른 하나를
 * 미루는 것이므로, 미룬 쪽이 그 자리에서 한 눈금 올라선다. 절반으로, 다시 4분의 3으로,
 * 그다음 9할로 — 같은 일을 세 번 미루면 터진다. 밀리는 것이 눈에 띄게 보여야 "먼저"라는
 * 말이 무게를 가진다.
 */
const PUSH_STEPS = [0.5, 0.75, 0.9, 1];

const pushed = (fill: number) => PUSH_STEPS.find((step) => step > fill + 0.001) ?? 1;

interface JobSpec {
  label: string;
  kind: Kind;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  jobs: JobSpec[];
}

/*
 * 판 셋은 조작이 같고 들어오는 일이 다르다. 준비·당일·정리로 옮겨 가면서 같은 기준
 * 셋을 다른 상황에 다시 대어 보게 한다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'prepare',
    label: '기본',
    scene: '체험회 준비 중',
    spoken: '먼저 할 일을 눌러 계단을 오르세요.',
    jobs: [
      { label: '통로 전원선 정리', kind: 'safety' },
      { label: '포스터 인쇄 마감', kind: 'deadline' },
      { label: '간식 바구니 진열', kind: 'help' },
      { label: '젖은 바닥 닦기', kind: 'safety' },
      { label: '이름표 나눠 주기', kind: 'help' },
      { label: '신청서 10분 뒤 제출', kind: 'deadline' },
      { label: '넘어진 의자 세우기', kind: 'safety' },
      { label: '사진 파일 보내기', kind: 'deadline' },
      { label: '물컵 채워 두기', kind: 'help' },
    ],
  },
  {
    id: 'open',
    label: '1단계',
    scene: '체험회 여는 날',
    spoken: '먼저 할 일을 눌러 계단을 오르세요.',
    jobs: [
      { label: '문 앞 상자 치우기', kind: 'safety' },
      { label: '안내 방송 시간 맞추기', kind: 'deadline' },
      { label: '손님께 자리 안내', kind: 'help' },
      { label: '뜨거운 주전자 옮기기', kind: 'safety' },
      { label: '체험 순서표 붙이기', kind: 'help' },
      { label: '5분 뒤 시작 알림', kind: 'deadline' },
      { label: '전선에 걸린 발판', kind: 'safety' },
      { label: '설문지 걷어 제출', kind: 'deadline' },
      { label: '빈 의자 채워 놓기', kind: 'help' },
    ],
  },
  {
    id: 'close',
    label: '2단계',
    scene: '마치고 정리하는 중',
    spoken: '먼저 할 일을 눌러 계단을 오르세요.',
    jobs: [
      { label: '깨진 컵 조각 줍기', kind: 'safety' },
      { label: '대여 장비 반납 마감', kind: 'deadline' },
      { label: '책상 줄 맞추기', kind: 'help' },
      { label: '콘센트 뽑아 두기', kind: 'safety' },
      { label: '남은 간식 나누기', kind: 'help' },
      { label: '정리 보고서 제출', kind: 'deadline' },
      { label: '미끄러운 물기 닦기', kind: 'safety' },
      { label: '사진 선생님께 전달', kind: 'deadline' },
      { label: '쓰레기봉투 묶기', kind: 'help' },
    ],
  },
];

interface Card {
  job: JobSpec;
  /** 0~1. 1이 되면 계단이 무너진다. */
  fill: number;
}

interface World {
  cards: (Card | null)[];
  climbed: number;
  /** 다음에 내보낼 일의 자리 */
  cursor: number;
  finished: boolean;
  /** 무너진 직후의 흔들림. 어느 쪽이 무너졌는지 잠깐 붉게 남긴다. */
  shake: number;
  shakeSide: number;
}

export default function PriorityStairsGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 게이지가 차는 빠르기와 기회로만 나타난다. 들어오는 일은 셋 모두 같다. */
  const fillScale = clamp(tuning.speed, 0.6, 1.25);
  const maxLives = tuning.lives;

  const worldRef = useRef<World>({
    cards: [null, null], climbed: 0, cursor: 0, finished: false, shake: 0, shakeSide: -1,
  });
  const [view, setView] = useState({ climbed: 0, lives: maxLives });
  const livesRef = useRef(maxLives);
  /* 뽑기는 판마다 같은 차례로 나와야 한다. 다시 하기를 누르면 seed가 바뀌어 새 차례가
     되지만, 같은 시도 안에서는 늘 같다. */
  const randomRef = useRef<() => number>(createRandom(game.seed));

  /** 다음 일을 뽑는다. 반대쪽이 터지기 직전인데 새 카드까지 급하면 아무리 잘 골라도
      한쪽을 잃는다. 그때만 느린 일을 내보내 숨통을 틔운다 — 눈금이 올라선 판에서는
      대부분의 카드가 절반을 넘으므로, 기준을 낮게 잡으면 느린 일만 나온다. */
  const dealCard = (world: World, side: number, random: () => number): void => {
    const other = world.cards[1 - side];
    const tight = other !== null
      && other.job.kind !== 'help'
      && other.fill > 0.82;
    const pool = stage.jobs.filter((job) => (tight ? job.kind === 'help' : true));
    const list = pool.length > 0 ? pool : stage.jobs;
    const pick = list[(world.cursor + Math.floor(random() * list.length)) % list.length];
    world.cursor += 1;
    world.cards[side] = { job: pick, fill: 0 };
  };

  useEffect(() => {
    const random = createRandom(game.seed);
    const world: World = {
      cards: [null, null], climbed: 0, cursor: 0, finished: false, shake: 0, shakeSide: -1,
    };
    dealCard(world, 0, random);
    dealCard(world, 1, random);
    worldRef.current = world;
    livesRef.current = maxLives;
    setView({ climbed: 0, lives: maxLives });
    randomRef.current = random;
  }, [game.round, game.stageIndex, maxLives, stage, game.seed]);

  const choose = (side: number) => {
    const world = worldRef.current;
    if (!game.playing || world.finished || !world.cards[side]) return;
    world.climbed += 1;
    dealCard(world, side, randomRef.current);

    // 고른 것은 곧 미룬 것이다. 반대쪽이 그 자리에서 한 눈금 올라선다.
    const other = world.cards[1 - side];
    if (other) other.fill = pushed(other.fill);

    setView({ climbed: world.climbed, lives: livesRef.current });
    if (world.climbed >= GOAL_STEPS) {
      world.finished = true;
      game.succeed('급한 일부터 차례로 해냈어요. 하루의 꼭대기까지 올라갔어요!');
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && !w.finished) {
      if (w.shake > 0) w.shake = Math.max(0, w.shake - dt);
      for (let side = 0; side < 2; side += 1) {
        const card = w.cards[side];
        if (!card) continue;
        card.fill += (dt * fillScale) / KIND_SECONDS[card.job.kind];
        if (card.fill >= 1) {
          // 미룬 일이 터졌다. 계단이 한 칸 무너지고 그 일은 지나간다.
          w.climbed = Math.max(0, w.climbed - 1);
          livesRef.current -= 1;
          w.shake = 0.6;
          w.shakeSide = side;
          dealCard(w, side, randomRef.current);
          setView({ climbed: w.climbed, lives: livesRef.current });
          if (livesRef.current <= 0) {
            w.finished = true;
            game.fail('미룬 일이 쌓여 계단이 무너졌어요. 빨강 삼각이 붙은 안전한 일을 먼저 해 봐요.');
          }
        }
      }
    }

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 계단 — 오른 칸은 파랑, 남은 칸은 회색 윤곽이다.
    for (let i = 0; i < GOAL_STEPS; i += 1) {
      const box = stepBox(i);
      const climbed = i < w.climbed;
      drawBar(ctx, box.x, box.y, box.w, box.h, {
        fill: climbed ? B.blue : B.ground,
        stroke: climbed ? B.blue : B.grey,
        width: STROKE.hair,
      });
    }
    // 학생이 선 자리 — 조종하는 것은 노랑 원이다.
    const here = stepBox(Math.min(w.climbed, GOAL_STEPS - 1));
    drawShape(ctx, 'circle', here.x + here.w / 2, here.y - 20, 18, {
      fill: B.yellow, stroke: B.keyline, width: STROKE.base,
    });
    centerText(ctx, `${w.climbed} / ${GOAL_STEPS}`, WORLD_W - 92, 512, 22, B.grey);

    // 일 카드 둘
    for (let side = 0; side < 2; side += 1) {
      const card = w.cards[side];
      if (!card) continue;
      const x = cardX(side);
      const shaking = w.shake > 0 && w.shakeSide === side;
      drawBar(ctx, x, CARD_Y, CARD_W, CARD_H, {
        fill: B.surface,
        stroke: shaking ? B.red : B.keyline,
        width: shaking ? STROKE.heavy : STROKE.base,
      });
      // 기준 도형과 이름표
      drawShape(ctx, KIND_SHAPE[card.job.kind], x + 44, CARD_Y + 44, 22, {
        fill: KIND_COLOR[card.job.kind], stroke: B.keyline, width: 1,
      });
      centerText(ctx, KIND_LABEL[card.job.kind], x + 44, CARD_Y + 82, 20, B.grey);
      centerText(ctx, card.job.label, x + CARD_W / 2 + 24, CARD_Y + 52, 24, B.ink);

      // 미룬 만큼 차오르는 띠
      const barX = x + 26;
      const barW = CARD_W - 52;
      drawBar(ctx, barX, CARD_Y + 116, barW, 30, {
        fill: B.ground, stroke: B.grey, width: STROKE.hair,
      });
      drawBar(ctx, barX, CARD_Y + 116, Math.max(2, barW * Math.min(1, card.fill)), 30, {
        fill: KIND_COLOR[card.job.kind], stroke: B.keyline, width: 1,
      });
      centerText(ctx, '누르면 이 일을 먼저 합니다', x + CARD_W / 2, CARD_Y + 168, 20, B.grey);
    }
  };

  const handleTap = (x: number, y: number) => {
    if (y < CARD_Y || y > CARD_Y + CARD_H) return;
    for (let side = 0; side < 2; side += 1) {
      if (x >= cardX(side) && x <= cardX(side) + CARD_W) {
        choose(side);
        return;
      }
    }
  };

  return (
    <MiniGameFrame
      badge="먼저 할 일 계단"
      instruction="일 카드 두 장 가운데 먼저 할 일을 누르세요. 누른 일이 다음 계단이 되어 한 칸 오릅니다. 고르지 않은 일은 그 자리에서 확 밀리고, 세 번 미루면 띠가 가득 차 계단이 무너집니다."
      progress={{ label: '오른 칸', value: view.climbed, max: GOAL_STEPS }}
      hud={<GameHud lives={view.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="px-1 text-[15px] font-bold" style={{ color: 'var(--game-ink)' }}>
          {stage.scene} · 빨강 삼각(안전)이 가장 빨리 차오르고, 미룬 일은 고를 때마다 확 밀립니다.
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
            ariaLabel={`먼저 할 일을 골라 계단을 오르는 놀이. 오른 칸 ${view.climbed}개, 남은 기회 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
