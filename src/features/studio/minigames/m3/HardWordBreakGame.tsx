import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel, useGameKeys,
} from '../engine';
import type { MiniGameProps } from '../types';

/**
 * m3-l3 · 어려운 말 벽 깨기 (장르 26 · 벽돌깨기)
 *
 * "쉽게 다시 설명하되 사실은 남긴다"를 두 종류의 벽돌로 만든다. 회색 벽돌(어려운 말)은
 * 깨야 하고, 초록 강철 벽돌(꼭 남을 사실)은 깨지지 않는다. 다만 자꾸 때리면 금이 가고,
 * 금이 다 가면 그 사실이 설명에서 사라진다.
 *
 * 그래서 세게 치는 것이 아니라 어디를 치지 않을지가 실력이다.
 */

const WORLD_W = 960;
const WORLD_H = 540;
const COLS = 6;
const ROWS = 3;

interface Brick {
  col: number;
  row: number;
  steel: boolean;
  text: string;
  easy: string;
  broken: boolean;
  cracks: number;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  /** COLS*ROWS 만큼. steel이면 사실 */
  cells: { text: string; easy: string; steel: boolean }[];
}

function hard(text: string, easy: string) { return { text, easy, steel: false }; }
function fact(text: string) { return { text, easy: text, steel: true }; }

const STAGES: StageConfig[] = [
  {
    id: 'notice',
    label: '기본',
    spoken: '안내문의 어려운 말을 깨 봐요.',
    cells: [
      hard('상충', '서로 부딪힘'), fact('금요일'), hard('유의', '조심'),
      hard('소정의', '정해진'), fact('3층'), hard('해당', '그'),
      hard('임의로', '마음대로'), fact('우산'), hard('지참', '가져오기'),
      hard('요망', '바람'), fact('9시'), hard('사전', '미리'),
      hard('필히', '꼭'), hard('당해', '그해'), hard('추후', '나중에'),
      hard('통보', '알림'), hard('제반', '여러'), hard('명기', '적기'),
    ],
  },
  {
    id: 'library',
    label: '1단계',
    spoken: '도서관 규칙의 어려운 말을 깨 봐요.',
    cells: [
      hard('연체', '늦게 냄'), fact('2권'), hard('반납', '돌려주기'),
      hard('열람', '읽기'), fact('7일'), hard('대출', '빌리기'),
      hard('정숙', '조용히'), fact('월요일'), hard('훼손', '망가뜨림'),
      hard('비치', '갖춰 둠'), hard('상시', '늘'), hard('구비', '갖춤'),
      hard('개관', '문 엶'), hard('휴관', '문 닫음'), fact('학생증'),
      hard('열외', '빼기'), hard('경유', '거쳐 감'), hard('일괄', '한꺼번에'),
    ],
  },
  {
    id: 'health',
    label: '2단계',
    spoken: '건강 안내의 어려운 말을 깨 봐요.',
    cells: [
      hard('섭취', '먹기'), fact('하루 2번'), hard('복용', '약 먹기'),
      hard('증상', '아픈 모습'), fact('식후'), hard('경과', '지나감'),
      hard('내원', '병원에 옴'), fact('보건실'), hard('처방', '약 정하기'),
      hard('금기', '하면 안 됨'), hard('과다', '너무 많음'), hard('휴식', '쉬기'),
      hard('권장', '권함'), hard('경미', '가벼움'), fact('10시'),
      hard('악화', '더 나빠짐'), hard('상비', '늘 갖춤'), hard('용법', '쓰는 법'),
    ],
  },
];

interface World {
  bx: number;
  by: number;
  vx: number;
  vy: number;
  paddle: number;
  bricks: Brick[];
  lives: number;
  phase: 'ready' | 'play';
  armed: boolean;
  finished: boolean;
}

function buildBricks(stage: StageConfig): Brick[] {
  return stage.cells.map((cell, index) => ({
    col: index % COLS,
    row: Math.floor(index / COLS),
    steel: cell.steel,
    text: cell.text,
    easy: cell.easy,
    broken: false,
    cracks: 0,
  }));
}

export default function HardWordBreakGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 공 속도와 패들 폭으로 나타난다. 벽돌 배치는 셋 모두 같다. */
  const speed = 260 * clamp(tuning.speed, 0.65, 1.35);
  const paddleW = 190 * clamp(tuning.size, 0.75, 1.35);
  const maxLives = tuning.lives;
  const crackLimit = Math.max(2, Math.round(3 * tuning.tolerance));

  const brickW = (WORLD_W - 60) / COLS;
  const brickH = 52;
  const topY = 100;

  const worldRef = useRef<World>({
    bx: WORLD_W / 2, by: WORLD_H - 90, vx: 0, vy: 0, paddle: WORLD_W / 2,
    bricks: buildBricks(stage), lives: maxLives, phase: 'ready', armed: true, finished: false,
  });
  const [hud, setHud] = useState({ broken: 0, lives: maxLives });
  const keys = useGameKeys(game.playing);
  const pointerX = useRef<number | null>(null);

  const hardTotal = stage.cells.filter((c) => !c.steel).length;

  useEffect(() => {
    worldRef.current = {
      bx: WORLD_W / 2, by: WORLD_H - 90, vx: 0, vy: 0, paddle: WORLD_W / 2,
      bricks: buildBricks(stage), lives: maxLives, phase: 'ready', armed: true, finished: false,
    };
    setHud({ broken: 0, lives: maxLives });
    pointerX.current = null;
  }, [game.round, game.stageIndex, stage, maxLives]);

  const brickBox = (brick: Brick) => ({
    x: 30 + brick.col * brickW + 3,
    y: topY + brick.row * (brickH + 8),
    w: brickW - 6,
    h: brickH,
  });

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    const launch = keys.held.current.action || keys.held.current.up;

    if (dt > 0 && !w.finished) {
      // 패들
      const dir = (keys.held.current.left ? -1 : 0) + (keys.held.current.right ? 1 : 0);
      if (pointerX.current !== null) w.paddle = pointerX.current;
      else w.paddle += dir * 520 * dt;
      w.paddle = clamp(w.paddle, paddleW / 2, WORLD_W - paddleW / 2);

      if (w.phase === 'ready') {
        w.bx = w.paddle;
        w.by = WORLD_H - 90;
        if (!launch) w.armed = true;
        if (launch && w.armed) {
          w.phase = 'play';
          w.armed = false;
          w.vx = speed * 0.55;
          w.vy = -speed;
        }
      } else {
        w.bx += w.vx * dt;
        w.by += w.vy * dt;

        if (w.bx < 14) { w.bx = 14; w.vx = Math.abs(w.vx); }
        if (w.bx > WORLD_W - 14) { w.bx = WORLD_W - 14; w.vx = -Math.abs(w.vx); }
        if (w.by < 14) { w.by = 14; w.vy = Math.abs(w.vy); }

        // 패들
        if (w.vy > 0 && w.by > WORLD_H - 62 && w.by < WORLD_H - 34
          && w.bx > w.paddle - paddleW / 2 - 12 && w.bx < w.paddle + paddleW / 2 + 12) {
          w.vy = -Math.abs(w.vy);
          w.vx = clamp(((w.bx - w.paddle) / (paddleW / 2)) * speed, -speed, speed);
        }

        // 벽돌
        for (const brick of w.bricks) {
          if (brick.broken) continue;
          const box = brickBox(brick);
          if (w.bx < box.x - 12 || w.bx > box.x + box.w + 12) continue;
          if (w.by < box.y - 12 || w.by > box.y + box.h + 12) continue;
          if (brick.steel) {
            brick.cracks += 1;
            if (brick.cracks >= crackLimit) {
              w.lives -= 1;
              brick.cracks = 0;
            }
          } else {
            brick.broken = true;
          }
          // 어느 면으로 들어왔는지에 따라 튕긴다
          const fromSide = w.bx < box.x || w.bx > box.x + box.w;
          if (fromSide) w.vx = -w.vx; else w.vy = -w.vy;
          break;
        }

        if (w.by > WORLD_H + 20) {
          w.lives -= 1;
          w.phase = 'ready';
          w.armed = false;
          w.vx = 0;
          w.vy = 0;
        }
      }

      const broken = w.bricks.filter((b) => b.broken).length;
      if (broken !== hud.broken || w.lives !== hud.lives) setHud({ broken, lives: w.lives });

      if (w.lives <= 0) {
        w.finished = true;
        game.fail('공을 놓치거나 사실이 흔들렸어요. 초록 벽돌은 남기고 회색 말만 깨 봐요.');
      } else if (broken >= hardTotal) {
        w.finished = true;
        game.succeed('어려운 말은 모두 쉬운 말로 바뀌고 꼭 남을 사실은 그대로 남았어요!');
      }
    }

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 아래에 만들어지는 쉬운 설명
    const easyText = w.bricks.filter((b) => b.broken).slice(-5).map((b) => b.easy).join(' · ');
    panel(ctx, 20, 16, WORLD_W - 40, 46, BOARD.overlay, PLAY.info, 12);
    centerText(ctx, easyText ? `쉬운 말 · ${easyText}` : '회색 벽돌을 깨면 쉬운 말이 됩니다', WORLD_W / 2, 39, 22, BOARD.ink);

    for (const brick of w.bricks) {
      if (brick.broken) continue;
      const box = brickBox(brick);
      const cracked = brick.cracks > 0;
      panel(
        ctx, box.x, box.y, box.w, box.h,
        brick.steel ? '#065F46' : '#334155',
        brick.steel ? (cracked ? PLAY.hero : PLAY.goal) : BOARD.line, 8,
      );
      centerText(ctx, brick.text, box.x + box.w / 2, box.y + box.h / 2, 24, BOARD.ink);
      if (cracked) centerText(ctx, '⚡'.repeat(brick.cracks), box.x + box.w / 2, box.y + box.h - 10, 20, PLAY.hero);
    }

    panel(ctx, w.paddle - paddleW / 2, WORLD_H - 54, paddleW, 18, PLAY.hero, PLAY.heroEdge, 9);
    ctx.beginPath();
    ctx.arc(w.bx, w.by, 12, 0, Math.PI * 2);
    ctx.fillStyle = BOARD.ink;
    ctx.fill();

    if (w.phase === 'ready' && !w.finished) {
      panel(ctx, WORLD_W / 2 - 210, WORLD_H - 132, 420, 56, BOARD.overlay, PLAY.hero, 14);
      centerText(
        ctx, w.armed ? '스페이스를 누르면 공이 나갑니다' : '손을 떼었다가 다시 누르세요',
        WORLD_W / 2, WORLD_H - 104, 24, BOARD.ink,
      );
    }
  };

  return (
    <MiniGameFrame
      badge="어려운 말 벽 깨기"
      instruction="회색 벽돌(어려운 말)만 깨세요. 초록 벽돌은 꼭 남을 사실이라 자꾸 때리면 흔들립니다."
      progress={{ label: '쉬워진 말', value: hud.broken, max: hardTotal }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 치기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="aspect-video max-h-full w-full max-w-[760px]">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              pointerX.current = pointer.x;
              if (pointer.phase === 'down') {
                const w = worldRef.current;
                if (w.phase === 'ready' && w.armed) {
                  w.phase = 'play';
                  w.armed = false;
                  w.vx = speed * 0.55;
                  w.vy = -speed;
                }
              }
              if (pointer.phase === 'up') {
                const w = worldRef.current;
                if (w.phase === 'ready') w.armed = true;
              }
            }}
            ariaLabel={`어려운 말 벽돌을 깨는 놀이. 쉬워진 말 ${hud.broken}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
