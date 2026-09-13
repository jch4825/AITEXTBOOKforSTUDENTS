import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, createRandom, drawBar, drawShape,
  shuffle, toRadians, useGameKeys, paintBoard,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m4-l2 · 자료 탑 무너뜨리기 (장르 28 · 포탄 각도)
 *
 * "같은 소식이라도 어디서 왔고 언제 것인지 보고 고른다"를 부수기로 만든다. 탑에는 출처와
 * 날짜가 적힌 자료가 쌓여 있고, 믿기 어려운 자료만 골라 부순다. 믿을 만한 자료를 맞히면
 * 튕겨 나오고 기회가 준다 — 아무 데나 쏘아서는 탑이 정리되지 않는다.
 *
 * m3-l6도 대포를 쏘지만 그쪽은 한 발로 숫자 눈금의 한 자리를 맞힌다. 여기서는 여러 발로
 * 쌓인 것 가운데 골라 맞히고, 부순 자리 위의 자료가 아래로 내려앉는다. 무엇을 먼저 부술지가
 * 이 놀이의 판단이다.
 */

const W = 960;
const H = 540;
const GROUND = 470;
const GUN_X = 92;
const BLOCK_W = 140;
const BLOCK_H = 62;
const COL_X = [520, 666, 812];

interface Source {
  from: string;
  when: string;
}

/** 믿을 만한 자료 — 누가 언제 냈는지 분명하다. */
const TRUSTED: Source[] = [
  { from: '학교 누리집', when: '오늘' },
  { from: '선생님 안내문', when: '어제' },
  { from: '교육청 누리집', when: '어제' },
  { from: '학교 알림장', when: '오늘' },
  { from: '시청 누리집', when: '이번 주' },
];

/** 믿기 어려운 자료 — 누가 썼는지 모르거나 너무 오래됐다. */
const SHAKY: Source[] = [
  { from: '출처 없음', when: '날짜 없음' },
  { from: '떠도는 말', when: '날짜 없음' },
  { from: '누가 쓴 글', when: '3년 전' },
  { from: '들은 이야기', when: '언제인지 몰라요' },
  { from: '이름 없는 글', when: '2년 전' },
  { from: '베낀 글', when: '4년 전' },
];

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  title: string;
  rows: number;
  /** 믿기 어려운 자료의 수 */
  shaky: number;
}

const STAGES: StageConfig[] = [
  { id: 'lunch', label: '기본', spoken: '급식 소식 자료를 살펴봐요.', title: '오늘 급식이 바뀌었다는 소식', rows: 3, shaky: 5 },
  { id: 'sports', label: '1단계', spoken: '운동회 소식 자료를 살펴봐요.', title: '운동회 날짜가 옮겨졌다는 소식', rows: 4, shaky: 7 },
  { id: 'bus', label: '2단계', spoken: '버스 시간 소식 자료를 살펴봐요.', title: '버스 시간이 달라졌다는 소식', rows: 5, shaky: 9 },
];

interface Block {
  col: number;
  row: number;
  source: Source;
  weak: boolean;
  gone: boolean;
  /** 맞은 직후 흔들리는 시간 */
  shake: number;
}

interface Shot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  live: boolean;
}

interface World {
  blocks: Block[];
  shot: Shot | null;
  broken: number;
  left: number;
  lives: number;
  finished: boolean;
  note: string;
  noteT: number;
}

function blockX(col: number) { return COL_X[col]; }
function blockY(row: number) { return GROUND - BLOCK_H * (row + 1); }

/**
 * 탑을 쌓는다.
 *
 * 믿기 어려운 자료를 줄마다 위쪽에 둔다. 포탄은 줄의 맨 위 자료만 맞힐 수 있어서, 믿을
 * 만한 자료가 위를 막으면 그 아래는 영영 못 맞힌다. 무작위로 섞었더니 실제로 그런 판이
 * 나왔다. 위에서부터 읽어 내려가는 것이 자료를 살피는 순서이기도 하다.
 */
function buildBlocks(stage: StageConfig, seed: number): Block[] {
  const random = createRandom(seed);
  const cols = COL_X.length;
  const shakyCount = Math.min(stage.shaky, cols * stage.rows - 1);
  // 믿기 어려운 자료를 줄에 고르게 나눈다
  const perCol = Array.from({ length: cols }, (_, i) => Math.floor(shakyCount / cols) + (i < shakyCount % cols ? 1 : 0));
  const trusted = shuffle(random, TRUSTED.slice());
  const shaky = shuffle(random, SHAKY.slice());
  let t = 0;
  let s = 0;
  const blocks: Block[] = [];
  for (let col = 0; col < cols; col += 1) {
    for (let row = 0; row < stage.rows; row += 1) {
      // row 0이 바닥이다. 위쪽 perCol[col]개가 믿기 어려운 자료다.
      const weak = row >= stage.rows - perCol[col];
      blocks.push({
        col,
        row,
        source: weak ? shaky[s++ % shaky.length] : trusted[t++ % trusted.length],
        weak,
        gone: false,
        shake: 0,
      });
    }
  }
  return blocks;
}

/** 부순 자리 위의 자료를 아래로 내려앉힌다. */
function settle(blocks: Block[]) {
  for (let col = 0; col < COL_X.length; col += 1) {
    const stack = blocks
      .filter((b) => b.col === col && !b.gone)
      .sort((a, b) => a.row - b.row);
    stack.forEach((block, index) => { block.row = index; });
  }
}

export default function SourceTowerGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 쏠 수 있는 포탄 수와 기회로 나타난다. 탑과 자료는 셋 모두 같다. */
  const shells = Math.round((stage.shaky + 5) * clamp(tuning.tolerance, 0.85, 1.5));
  const maxLives = tuning.lives;

  const worldRef = useRef<World>({
    blocks: buildBlocks(stage, game.seed),
    shot: null,
    broken: 0,
    left: shells,
    lives: maxLives,
    finished: false,
    note: '',
    noteT: 0,
  });
  const [angle, setAngle] = useState(38);
  const [power, setPower] = useState(66);
  const [hud, setHud] = useState({ broken: 0, left: shells, lives: maxLives });
  const keys = useGameKeys(game.playing);
  const fireRef = useRef(false);

  useEffect(() => {
    worldRef.current = {
      blocks: buildBlocks(stage, game.seed),
      shot: null,
      broken: 0,
      left: shells,
      lives: maxLives,
      finished: false,
      note: '',
      noteT: 0,
    };
    setAngle(38);
    setPower(66);
    setHud({ broken: 0, left: shells, lives: maxLives });
    fireRef.current = false;
  }, [game.round, game.stageIndex, stage, game.seed, shells, maxLives]);

  const notice = (w: World, text: string) => {
    w.note = text;
    w.noteT = 2.6;
  };

  const fire = () => {
    const w = worldRef.current;
    if (!game.playing || w.finished || w.shot || w.left <= 0) return;
    const rad = toRadians(-angle);
    const v = power * 9.6;
    w.shot = { x: GUN_X, y: GROUND - 26, vx: Math.cos(rad) * v, vy: Math.sin(rad) * v, live: true };
    w.left -= 1;
    playSound('confirm');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;

    if (dt > 0 && game.playing && !w.finished) {
      if (keys.held.current.up) setAngle((a) => clamp(a + 32 * dt, 8, 78));
      if (keys.held.current.down) setAngle((a) => clamp(a - 32 * dt, 8, 78));
      if (keys.held.current.right) setPower((p) => clamp(p + 24 * dt, 24, 100));
      if (keys.held.current.left) setPower((p) => clamp(p - 24 * dt, 24, 100));
      if (keys.consumePress('action') || fireRef.current) fire();
      fireRef.current = false;

      const shot = w.shot;
      if (shot && shot.live) {
        shot.vy += 640 * dt;
        shot.x += shot.vx * dt;
        shot.y += shot.vy * dt;

        for (const block of w.blocks) {
          if (block.gone) continue;
          const bx = blockX(block.col);
          const by = blockY(block.row);
          if (shot.x < bx - 8 || shot.x > bx + BLOCK_W + 8) continue;
          if (shot.y < by - 8 || shot.y > by + BLOCK_H + 8) continue;
          shot.live = false;
          if (block.weak) {
            block.gone = true;
            w.broken += 1;
            settle(w.blocks);
            playSound('fill');
            notice(w, `${block.source.from} · ${block.source.when} — 믿기 어려운 자료를 치웠어요.`);
            if (w.broken >= w.blocks.filter((b) => b.weak).length) {
              w.finished = true;
              game.succeed('믿기 어려운 자료를 모두 치웠어요. 남은 것은 어디서 언제 왔는지 분명한 자료입니다!');
            }
          } else {
            block.shake = 0.6;
            w.lives -= 1;
            playSound('select');
            notice(w, `${block.source.from} · ${block.source.when} — 믿을 만한 자료예요. 그대로 둡니다.`);
            if (w.lives <= 0) {
              w.finished = true;
              game.fail('기회를 다 썼어요. 출처와 날짜를 먼저 읽고 믿기 어려운 것만 겨눠 보세요.');
            }
          }
          break;
        }

        if (shot.live && (shot.y > GROUND + 20 || shot.x > W + 40)) {
          shot.live = false;
          notice(w, '빗나갔어요. 각도와 힘을 조금 바꿔 보세요.');
        }
        if (!shot.live) {
          window.setTimeout(() => { if (worldRef.current === w) w.shot = null; }, 400);
        }
      }

      for (const block of w.blocks) {
        if (block.shake > 0) block.shake = Math.max(0, block.shake - dt);
      }
      w.noteT = Math.max(0, w.noteT - dt);

      if (!w.finished && w.left <= 0 && !w.shot) {
        w.finished = true;
        game.fail('포탄을 다 썼어요. 믿기 어려운 자료부터 골라 겨눠 보세요.');
      }

      if (w.broken !== hud.broken || w.left !== hud.left || w.lives !== hud.lives) {
        setHud({ broken: w.broken, left: w.left, lives: w.lives });
      }
    }

    // ── 그리기 ────────────────────────────────────────────
    paintBoard(ctx, W, H);

    drawBar(ctx, 20, 14, W - 40, 44, { fill: B.ground, stroke: B.blue, width: STROKE.base });
    centerText(ctx, `${stage.title} · 믿기 어려운 자료만 무너뜨려요`, W / 2, 37, 22, B.ink);

    ctx.fillStyle = B.surface;
    ctx.fillRect(0, GROUND, W, H - GROUND);

    for (const block of w.blocks) {
      if (block.gone) continue;
      const shakeX = block.shake > 0 ? Math.sin(block.shake * 44) * 6 : 0;
      const bx = blockX(block.col) + shakeX;
      const by = blockY(block.row);
      /* 자료를 색으로 미리 나누지 않는다. 붉고 푸른 것을 보고 쏘면 출처와 날짜를 읽을
         까닭이 없어진다. 맞은 뒤에만 어느 쪽이었는지 잠깐 물든다. */
      const tell = block.shake > 0 ? B.red : B.grey;
      drawBar(ctx, bx, by, BLOCK_W, BLOCK_H, { fill: B.surface, stroke: tell, width: STROKE.base });
      centerText(ctx, block.source.from, bx + BLOCK_W / 2, by + 22, 18, B.ink);
      centerText(ctx, block.source.when, bx + BLOCK_W / 2, by + 44, 18, B.grey);
    }

    // 대포
    ctx.save();
    ctx.translate(GUN_X, GROUND - 26);
    ctx.rotate(toRadians(-angle));
    drawBar(ctx, 0, -9, 30 + power * 0.5, 18,
      { fill: B.yellow, stroke: B.keyline, width: STROKE.hair });
    ctx.restore();
    drawShape(ctx, 'circle', GUN_X, GROUND - 20, 48,
      { fill: B.surface, stroke: B.grey, width: STROKE.base });

    const shot = w.shot;
    if (shot) {
      drawShape(ctx, 'circle', shot.x, shot.y, 22,
        { fill: shot.live ? B.blue : B.grey, stroke: B.keyline, width: 1 });
    }

    centerText(ctx, `각도 ${Math.round(angle)}도 · 힘 ${Math.round(power)}`, 200, GROUND + 42, 22, B.ink);
    if (w.noteT > 0 && w.note) {
      drawBar(ctx, W / 2 - 330, H - 46, 660, 36,
        { fill: B.ground, stroke: B.blue, width: STROKE.hair });
      centerText(ctx, w.note, W / 2, H - 27, 20, B.ink);
    }
  };

  const weakLeft = worldRef.current.blocks.filter((b) => b.weak && !b.gone).length;

  return (
    <MiniGameFrame
      badge="자료 탑 무너뜨리기"
      instruction="탑에 쌓인 자료의 출처와 날짜를 읽어 보세요. 어디서 왔는지 알 수 없거나 너무 오래된 자료만 각도와 힘을 맞추어 무너뜨립니다. 포탄은 줄의 맨 위 자료부터 맞습니다."
      progress={{ label: '치운 자료', value: hud.broken, max: hud.broken + weakLeft }}
      hud={<GameHud lives={hud.lives} maxLives={maxLives} score={hud.left} scoreLabel="남은 포탄" />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={() => setAngle((a) => clamp(a + 6, 8, 78))} mark="arrow" markRotate={270} label="위로" />
          <MiniGameButton onClick={() => setAngle((a) => clamp(a - 6, 8, 78))} mark="arrow" markRotate={90} label="아래로" />
          <MiniGameButton onClick={() => setPower((p) => clamp(p - 6, 24, 100))} mark="bar" label="약하게" />
          <MiniGameButton onClick={() => setPower((p) => clamp(p + 6, 24, 100))} mark="plus" label="세게" />
          <MiniGameButton
            onClick={() => { fireRef.current = true; }}
            mark="arrow"
            markRotate={315}
            label="쏘기"
            variant="primary"
          />
          <MiniGameButton onClick={game.retry} mark="retry" label="다시" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={W}
            height={H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase !== 'down') return;
              // 누른 자리를 겨눈다. 각도만 바꾸고 쏘는 것은 따로 누른다.
              const dx = pointer.x - GUN_X;
              const dy = GROUND - 26 - pointer.y;
              if (dx > 20) setAngle(clamp((Math.atan2(dy, dx) * 180) / Math.PI, 8, 78));
            }}
            ariaLabel={`출처와 날짜를 보고 믿기 어려운 자료만 무너뜨리는 놀이. 치운 자료 ${hud.broken}개, 남은 포탄 ${hud.left}개, 남은 기회 ${hud.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
