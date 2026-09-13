import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, circleHit, clamp, createRandom, dist,
  drawBar, drawShape, randRange, useGameKeys,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m5-l6 · 표지 모아 보내기 (장르 24 · 탄막 피하기)
 *
 * **더 모을까, 지금 보낼까.** 판 전체가 이 물음 하나로 돈다.
 *
 * 복도에 놓인 파랑 사각형(단서)을 몸으로 주우면 윤아(노랑 원)가 한 뼘씩 커진다. 커질수록
 * 가로지르는 빨강 삼각형에 닿기 쉬워지고, 닿으면 들고 있던 단서를 모두 잃는다. 위쪽 보내기
 * 문에 몸을 대면 들고 있던 것이 한꺼번에 부탁 칸으로 날아가고 몸은 도로 작아진다.
 * 욕심낸 만큼 위험해지는 판이라 두 칸 남았을 때 저절로 숨을 참게 된다.
 *
 * 이 차시는 처음에 지뢰 찾기로 만들었다. 학습목표에 맞추느라 추론을 걷어내고 규칙을 하나씩
 * 덧대다 보니 "조심해서 누르기"만 남았고, 사용자가 해 보고 매우 재미없다고 했다. 게임을
 * 교육에 너무 빡빡하게 묶었다는 지적도 받았다. 그래서 이번 판은 **먼저 놀이다.** 차시와의
 * 연결은 소재 수준으로만 건다 — 줍는 것에는 길을 설명하는 말이, 피하는 것에는 보내면 안 되는
 * 개인정보가 붙어 있다. 그뿐이다.
 *
 * 움직이는 삼각형 위에는 글자를 적지 않는다. m4-l6에서 조각 안에 이름을 적었더니 글자가
 * 도형 밖으로 한참 삐져나왔다. 무엇을 뜻하는지는 판 아래 띠에서 한 번 읽으면 된다.
 *
 * 같은 장르를 쓰는 m4-l6(불편한 화면 피하기)과 조작이 다르다. m4-l6은 자리를 옮기는
 * 안전지대에 3초 머무는 판이라 멈춰 있는 것이 정답이고, 모으는 것도 몸 크기의 변화도 없다.
 * 여기는 안전지대가 없고 멈추면 아무 일도 일어나지 않는다. 줍고, 나르고, 비우는 왕복이
 * 조작의 전부다. 겉그림이 같아 보이지 않도록 바닥에 복도 줄을 긋고 위쪽에 큰 문을 둔다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

/** 부탁 칸. 이만큼 보내면 이긴다. */
const GOAL = 8;
const slotBox = (index: number) => ({ x: 64 + index * 104, y: 8, w: 96, h: 46 });

/** 보내기 문. 위쪽 가운데 고정이다 — 문이 움직이면 "어디로 가져가지"를 또 찾아야 한다. */
const DOOR = { x: 350, y: 62, w: 260, h: 44 };

/**
 * 삼각형이 지나가는 가로 줄.
 *
 * 줄과 줄 사이를 110씩 띄웠다. 가장 커진 몸(반지름 38)과 삼각형 판정(15)을 더해도 53이라,
 * 줄 사이에는 늘 멈춰 서서 틈을 기다릴 자리가 남는다. 틈이 없는 판은 피하기가 아니라 운이다.
 */
const LANES = [190, 300, 410];
/** 단서가 놓이는 가로 띠. 삼각형 줄 사이다. */
const CLUE_BANDS = [245, 355, 468];

/** 한 번에 켜 두는 단서 수. 여럿이 한꺼번에 보이면 어디로 갈지 못 정한다. */
const CLUES_VISIBLE = 2;
/** 한 번에 들 수 있는 단서 수. 가득 차면 문으로 가야 한다. */
const CARRY_MAX = 4;

const HERO_R = 18;
const GROW = 5;
const TRI_SIZE = 56;
/** 삼각형 판정 반지름. 도형 안쪽에 드는 원이라 모서리 끝을 스친 것은 봐준다. */
const TRI_HIT = 15;
const INVULN = 1.3;

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  /** 줍는 단서 — 보내도 되는 말 */
  clues: string[];
  /** 삼각형이 뜻하는 것 — 보내면 안 되는 말. 판 아래 띠에만 적는다. */
  privates: string[];
  /** 기본 삼각형 수. 지원 수준의 밀도가 곱해진다. */
  hazards: number;
  /** 삼각형 속도 배율 */
  pace: number;
}

/*
 * 판 셋은 조작이 같고 소재와 밀도가 다르다. 뒤로 갈수록 삼각형이 하나씩 늘고 조금 빨라진다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'way',
    label: '기본',
    scene: '학교 안에서 길 묻기',
    spoken: '길을 설명하는 표지를 모아 보내기 문으로 가져가요.',
    clues: ['삼 층', '계단 옆', '초록 문', '복도 끝', '도서실 앞', '창문 쪽', '급식실 위', '게시판 앞', '화분 옆', '교무실 옆'],
    privates: ['학교 이름', '집 주소', '전화번호'],
    hazards: 3,
    pace: 1,
  },
  {
    id: 'thing',
    label: '1단계',
    scene: '잃어버린 물건 찾기',
    spoken: '물건을 설명하는 표지를 모아 보내기 문으로 가져가요.',
    clues: ['파란 물통', '빨간 끈', '손잡이', '스티커', '흰 뚜껑', '긁힌 자국', '점심때', '급식실', '벤치 옆', '옆주머니'],
    privates: ['내 이름', '우리 반', '내 사진'],
    hazards: 4,
    pace: 1.1,
  },
  {
    id: 'plan',
    label: '2단계',
    scene: '만날 약속 정하기',
    spoken: '약속을 설명하는 표지를 모아 보내기 문으로 가져가요.',
    clues: ['목요일', '오후 두 시', '실내', '조용한 곳', '넷이서', '큰 책상', '버스 타고', '두 시간', '밝은 곳', '콘센트'],
    privates: ['시간표', '집 가는 길', '엄마 번호'],
    hazards: 5,
    pace: 1.2,
  },
];

interface Tri {
  x: number;
  vx: number;
  lane: number;
}

interface Clue {
  x: number;
  y: number;
  text: string;
}

interface World {
  x: number;
  y: number;
  carry: string[];
  sent: string[];
  clues: Clue[];
  tris: Tri[];
  lives: number;
  invuln: number;
  /** 문에 보냈을 때 퍼지는 고리. 0이면 없다. */
  pulse: number;
  /** 다음에 내놓을 단서의 자리 */
  cursor: number;
  phase: 'ready' | 'play';
  finished: boolean;
}

export default function ClueCarryDodgeGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 삼각형의 수·속도와 기회로 나타난다. 모을 개수와 문의 자리는 셋 모두 같다. */
  const maxLives = tuning.lives;
  const triSpeed = 72 * stage.pace * clamp(tuning.speed, 0.6, 1.35);
  const triCount = clamp(Math.round(stage.hazards * tuning.density), 2, 6);

  const keys = useGameKeys(game.playing);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const randomRef = useRef<() => number>(createRandom(game.seed));

  const worldRef = useRef<World>({
    x: WORLD_W / 2, y: 470, carry: [], sent: [], clues: [], tris: [], lives: maxLives,
    invuln: 0, pulse: 0, cursor: 0, phase: 'ready', finished: false,
  });
  const [view, setView] = useState({ sent: 0, carry: 0, lives: maxLives });

  const radiusOf = (w: World) => HERO_R + w.carry.length * GROW;

  /** 새 단서 하나를 놓는다. 몸에서 멀리, 다른 단서와도 겹치지 않게. */
  const placeClue = (w: World) => {
    const random = randomRef.current;
    let best: Clue | null = null;
    for (let tries = 0; tries < 16; tries += 1) {
      const candidate = {
        x: randRange(random, 110, WORLD_W - 110),
        y: CLUE_BANDS[Math.floor(random() * CLUE_BANDS.length)],
        text: stage.clues[w.cursor % stage.clues.length],
      };
      const farFromHero = dist(candidate.x, candidate.y, w.x, w.y) > 180;
      const apart = w.clues.every((clue) => dist(clue.x, clue.y, candidate.x, candidate.y) > 200);
      best = candidate;
      if (farFromHero && apart) break;
    }
    if (best) {
      w.clues.push(best);
      w.cursor += 1;
    }
  };

  useEffect(() => {
    randomRef.current = createRandom(game.seed);
    const random = randomRef.current;
    const w: World = {
      x: WORLD_W / 2, y: 470, carry: [], sent: [], clues: [], tris: [], lives: maxLives,
      invuln: 0, pulse: 0, cursor: 0, phase: 'ready', finished: false,
    };
    for (let i = 0; i < triCount; i += 1) {
      const lane = i % LANES.length;
      w.tris.push({
        x: randRange(random, 80, WORLD_W - 80),
        vx: (random() < 0.5 ? -1 : 1) * triSpeed * randRange(random, 0.8, 1.2),
        lane,
      });
    }
    for (let i = 0; i < CLUES_VISIBLE; i += 1) placeClue(w);
    worldRef.current = w;
    setView({ sent: 0, carry: 0, lives: maxLives });
    dragRef.current = null;
  }, [game.round, game.stageIndex, stage, game.seed, maxLives, triCount, triSpeed]);

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      const moving = keys.held.current.left || keys.held.current.right
        || keys.held.current.up || keys.held.current.down || dragRef.current !== null;
      /* 학생이 처음 움직일 때까지 판은 멈춰 있다. 규칙을 읽는 사이에 맞으면 실패가 벌이 된다. */
      if (w.phase === 'ready' && moving) w.phase = 'play';

      if (w.phase === 'play') {
        const r = radiusOf(w);
        if (dragRef.current) {
          w.x += (dragRef.current.x - w.x) * Math.min(1, dt * 8);
          w.y += (dragRef.current.y - w.y) * Math.min(1, dt * 8);
        } else {
          const dx = (keys.held.current.left ? -1 : 0) + (keys.held.current.right ? 1 : 0);
          const dy = (keys.held.current.up ? -1 : 0) + (keys.held.current.down ? 1 : 0);
          w.x += dx * 290 * dt;
          w.y += dy * 290 * dt;
        }
        w.x = clamp(w.x, r, WORLD_W - r);
        w.y = clamp(w.y, DOOR.y + r, WORLD_H - 40 - r);

        // 삼각형 — 제 줄을 따라 오가며 벽에서 튕긴다
        for (const tri of w.tris) {
          tri.x += tri.vx * dt;
          if (tri.x < 40) { tri.x = 40; tri.vx = Math.abs(tri.vx); }
          if (tri.x > WORLD_W - 40) { tri.x = WORLD_W - 40; tri.vx = -Math.abs(tri.vx); }
          /* 문에 보낸 순간 퍼지는 고리가 가까운 삼각형을 옆으로 밀어낸다. 모은 것을 무사히
             보낸 보상이자, 문 앞에서 곧바로 맞는 억울함을 막는 장치다. */
          if (w.pulse > 0 && Math.abs(tri.x - (DOOR.x + DOOR.w / 2)) < 260 && LANES[tri.lane] < 250) {
            tri.vx = (tri.x < DOOR.x + DOOR.w / 2 ? -1 : 1) * Math.abs(tri.vx) * 1.6;
          }
          if (w.invuln <= 0 && circleHit(w.x, w.y, r, tri.x, LANES[tri.lane], TRI_HIT)) {
            // 들고 있던 것을 모두 잃는다. 욕심낸 만큼이 한 번에 사라진다.
            const lost = w.carry.length;
            w.carry = [];
            w.lives -= 1;
            w.invuln = INVULN;
            playSound('select');
            if (w.lives <= 0) {
              w.finished = true;
              game.fail('빨강 삼각형에 너무 많이 닿았어요. 조금만 모아서 자주 보내 봐요.');
            } else if (lost > 0) {
              setView({ sent: w.sent.length, carry: 0, lives: w.lives });
            }
          }
        }
        w.invuln = Math.max(0, w.invuln - dt);
        w.pulse = Math.max(0, w.pulse - dt);

        // 단서 줍기
        for (let i = w.clues.length - 1; i >= 0; i -= 1) {
          const clue = w.clues[i];
          if (w.carry.length >= CARRY_MAX) break;
          if (circleHit(w.x, w.y, radiusOf(w), clue.x, clue.y, 20)) {
            w.carry.push(clue.text);
            w.clues.splice(i, 1);
            placeClue(w);
            playSound('fill');
          }
        }

        // 보내기 문에 몸을 대면 들고 있던 것을 한꺼번에 보낸다
        const touchingDoor = w.y - radiusOf(w) <= DOOR.y + DOOR.h + 4
          && w.x >= DOOR.x - radiusOf(w) && w.x <= DOOR.x + DOOR.w + radiusOf(w);
        if (touchingDoor && w.carry.length > 0) {
          const room = GOAL - w.sent.length;
          w.sent.push(...w.carry.slice(0, room));
          w.carry = [];
          w.pulse = 0.6;
          playSound('stamp');
          if (w.sent.length >= GOAL) {
            w.finished = true;
            game.succeed('개인정보는 하나도 안 보내고 길을 설명하는 표지만 모아 보냈어요!');
          }
        }

        if (w.sent.length !== view.sent || w.carry.length !== view.carry || w.lives !== view.lives) {
          setView({ sent: w.sent.length, carry: w.carry.length, lives: w.lives });
        }
      }
    }

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    /* 복도 바닥 줄. m4-l6과 겉그림이 같아 보이지 않게 하는 장치이자, 삼각형이 어느 줄을
       다니는지 미리 알려 주는 표시다. */
    for (const laneY of LANES) {
      drawBar(ctx, 0, laneY - 1, WORLD_W, 2, { fill: B.surface, stroke: B.surface, width: 1 });
    }

    // 부탁 칸
    for (let i = 0; i < GOAL; i += 1) {
      const box = slotBox(i);
      const text = w.sent[i];
      drawBar(ctx, box.x, box.y, box.w, box.h, {
        fill: text ? B.blue : B.ground,
        stroke: text ? B.keyline : B.grey,
        width: STROKE.hair,
      });
      if (text) centerText(ctx, text, box.x + box.w / 2, box.y + box.h / 2, 20, B.ground);
    }

    // 보내기 문 — 문에 보낸 순간 고리가 퍼진다
    drawBar(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, { fill: B.blue, stroke: B.keyline, width: STROKE.base });
    centerText(ctx, '보내기 문', DOOR.x + DOOR.w / 2, DOOR.y + DOOR.h / 2, 22, B.ground);
    if (w.pulse > 0) {
      const grown = (0.6 - w.pulse) / 0.6;
      const ring = 120 + grown * 360;
      /* 고리의 굵기는 지름에 비례하므로, 선 굵기 세 단 가운데 heavy가 되도록 비율을 되짚어 준다. */
      drawShape(ctx, 'ring', DOOR.x + DOOR.w / 2, DOOR.y + DOOR.h / 2, ring, {
        stroke: B.blue, thickness: STROKE.heavy / ring,
      });
    }

    // 단서
    for (const clue of w.clues) {
      drawShape(ctx, 'square', clue.x, clue.y, 34, { fill: B.blue, stroke: B.keyline, width: STROKE.hair });
      centerText(ctx, clue.text, clue.x, clue.y + 36, 20, B.ink);
    }

    // 삼각형
    for (const tri of w.tris) {
      drawShape(ctx, 'triangle', tri.x, LANES[tri.lane], TRI_SIZE, {
        fill: B.red, stroke: B.keyline, width: STROKE.hair,
      });
    }

    // 윤아 — 들고 있는 단서가 둘레에 붙어 따라다닌다. 무엇을 걸고 있는지가 눈에 보여야
    // "지금 보낼까"를 고를 수 있다.
    const r = radiusOf(w);
    const blink = w.invuln > 0 && Math.floor(w.invuln * 10) % 2 === 0;
    if (!blink) {
      drawShape(ctx, 'circle', w.x, w.y, r * 2, { fill: B.yellow, stroke: B.keyline, width: STROKE.base });
      for (let i = 0; i < w.carry.length; i += 1) {
        const angle = (i / CARRY_MAX) * Math.PI * 2 - Math.PI / 2;
        drawShape(ctx, 'square', w.x + Math.cos(angle) * (r + 10), w.y + Math.sin(angle) * (r + 10), 14, {
          fill: B.blue, stroke: B.keyline, width: 1,
        });
      }
    }
    if (w.carry.length >= CARRY_MAX) {
      centerText(ctx, '가득 찼어요 · 문으로', w.x, w.y - r - 24, 20, B.yellow);
    }

    // 판 아래 띠 — 삼각형이 무엇인지는 여기서 한 번 읽는다
    drawShape(ctx, 'triangle', 40, 518, 20, { fill: B.red, stroke: B.keyline, width: 1 });
    centerText(ctx, `닿으면 안 돼요 · ${stage.privates.join(' · ')}`, 250, 518, 20, B.grey);
    drawShape(ctx, 'square', 540, 518, 18, { fill: B.blue, stroke: B.keyline, width: 1 });
    centerText(ctx, `주워서 문으로 · 한 번에 ${CARRY_MAX}개까지`, 740, 518, 20, B.grey);

    if (w.phase === 'ready' && !w.finished) {
      drawBar(ctx, WORLD_W / 2 - 230, 250, 460, 56, { fill: B.ground, stroke: B.yellow, width: STROKE.base });
      centerText(ctx, '움직이면 시작합니다', WORLD_W / 2, 278, 24, B.ink);
    }
  };

  return (
    <MiniGameFrame
      badge="표지 모아 보내기"
      instruction="노랑 원을 움직여 파랑 표지를 주우세요. 주울수록 몸이 커집니다. 위쪽 보내기 문에 닿으면 들고 있던 표지가 한꺼번에 보내져요. 빨강 삼각형에 닿으면 들고 있던 것을 모두 잃습니다."
      progress={{ label: '보낸 표지', value: view.sent, max: GOAL }}
      hud={<GameHud lives={view.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="px-1 text-[15px] font-bold" style={{ color: 'var(--game-ink)' }}>
          {stage.scene} · 들고 있는 표지 {view.carry}개 — 더 모을까요, 지금 보낼까요?
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
              if (pointer.phase === 'up') { dragRef.current = null; return; }
              dragRef.current = { x: pointer.x, y: pointer.y };
            }}
            ariaLabel={`표지를 모아 보내는 놀이. 보낸 표지 ${view.sent}개, 들고 있는 표지 ${view.carry}개, 남은 기회 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
