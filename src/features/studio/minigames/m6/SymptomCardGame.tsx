import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, createRandom, drawBar, drawMark, drawShape,
  particleFor, shuffle, paintBoard,
} from '../engine';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m6-l8 · 아픈 곳 카드 채우기 (장르 17 · 분류 매치)
 *
 * 병명 대신 위치·느낌·시작 시점 셋을 갖춰 사람에게 건네는 것이 이 차시다. 칸이 그 셋이고
 * 카드가 그중 하나에만 맞는 구조가 학습의 모양 그대로다.
 *
 * 넷째 칸을 따로 둔 것이 이 판의 핵심이다. 병 이름 카드(장염·맹장염)는 위치도 느낌도
 * 시점도 아니어서 어느 칸에도 들어가지 않고 빼는 칸으로 간다. **병명을 몰라도 알릴 수
 * 있다**가 설명이 아니라 규칙이 된다.
 *
 * 마지막 조작이 어른 벨이다. 세 칸이 다 차야 벨에 불이 들어오고, 그 벨을 눌러야 끝난다.
 * AI에게 묻는 것이 아니라 믿을 만한 어른에게 먼저 알린다는 절차가 승리 조건 안에 있다.
 *
 * 같은 장르를 쓰는 m1-l8(같은 모양 상자 옮기기)과 조작이 다르다. m1-l8은 상자를 같은
 * 모양 자리로 밀어 옮기는 판이라 짝이 모양 하나로 정해진다. 여기서는 카드가 한 장씩
 * 나오고 칸을 눌러 보내며, 어느 칸에도 안 맞는 카드가 섞여 있다. 짝을 찾는 손이 아니라
 * 무엇이 말할 거리이고 무엇이 아닌지 가르는 손이다.
 *
 * 카드를 끌지 않고 칸을 누르게 한다. 끌기는 잡은 것이 무엇인지를 손에 들고 있어야 하고,
 * 놓을 자리를 놓치면 처음부터 다시 잡아야 한다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

const CARD = { x: 268, y: 24, w: 424, h: 92 };

const COL_W = 210;
const COL_H = 302;
const COL_Y = 142;
const colX = (index: number) => 39 + index * 224;

const BELL = { x: 318, y: 470, w: 324, h: 50 };

/** 카드가 갈 곳. none은 병 이름처럼 어느 칸에도 맞지 않는 것이다. */
type Slot = 'where' | 'how' | 'when' | 'none';

const COLUMNS: { slot: Slot; label: string; hint: string }[] = [
  { slot: 'where', label: '어디가', hint: '몸의 자리' },
  { slot: 'how', label: '어떻게', hint: '아픈 느낌' },
  { slot: 'when', label: '언제부터', hint: '시작한 때' },
  { slot: 'none', label: '병 이름 빼기', hint: '말 안 해도 돼요' },
];

interface CardSpec {
  text: string;
  slot: Slot;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  cards: CardSpec[];
}

/*
 * 판 셋은 조작이 같고 아픈 곳이 다르다. 배·머리·다리로 옮겨 가면서 같은 셋(위치·느낌·시점)을
 * 다른 몸에 다시 대어 보게 한다. 병 이름은 판마다 바뀌지만 언제나 빼는 칸으로 간다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'tummy',
    label: '기본',
    scene: '배가 아파요',
    spoken: '아픈 곳을 알리는 카드를 칸에 넣어 봐요.',
    cards: [
      { text: '배 안쪽', slot: 'where' },
      { text: '배꼽 아래', slot: 'where' },
      { text: '쥐어짜듯이', slot: 'how' },
      { text: '욱신욱신', slot: 'how' },
      { text: '어제 저녁부터', slot: 'when' },
      { text: '오늘 아침부터', slot: 'when' },
      { text: '장염', slot: 'none' },
      { text: '맹장염', slot: 'none' },
      { text: '식중독', slot: 'none' },
    ],
  },
  {
    id: 'head',
    label: '1단계',
    scene: '머리가 아파요',
    spoken: '아픈 곳을 알리는 카드를 칸에 넣어 봐요.',
    cards: [
      { text: '이마 쪽', slot: 'where' },
      { text: '뒷목 위', slot: 'where' },
      { text: '지끈지끈', slot: 'how' },
      { text: '무겁게 눌려요', slot: 'how' },
      { text: '점심 먹고부터', slot: 'when' },
      { text: '어젯밤부터', slot: 'when' },
      { text: '편두통', slot: 'none' },
      { text: '축농증', slot: 'none' },
      { text: '뇌진탕', slot: 'none' },
    ],
  },
  {
    id: 'leg',
    label: '2단계',
    scene: '다리를 다쳤어요',
    spoken: '아픈 곳을 알리는 카드를 칸에 넣어 봐요.',
    cards: [
      { text: '무릎 아래', slot: 'where' },
      { text: '발목 바깥쪽', slot: 'where' },
      { text: '따끔따끔', slot: 'how' },
      { text: '디디면 아파요', slot: 'how' },
      { text: '체육 시간부터', slot: 'when' },
      { text: '넘어진 다음', slot: 'when' },
      { text: '골절', slot: 'none' },
      { text: '인대 파열', slot: 'none' },
      { text: '염좌', slot: 'none' },
    ],
  },
];

interface World {
  deck: CardSpec[];
  /** 칸마다 들어간 카드 글자 */
  placed: Record<Slot, string[]>;
  lives: number;
  wrong: number;
  /** 방금 틀린 칸. 잠깐 붉게 짚어 준다. */
  flash: number;
  flashCol: number;
  finished: boolean;
}

const emptyPlaced = (): Record<Slot, string[]> => ({ where: [], how: [], when: [], none: [] });

export default function SymptomCardGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 기회 수로만 나타난다. 카드와 칸은 셋 모두 같다. */
  const maxLives = tuning.lives;
  const total = stage.cards.length;

  const worldRef = useRef<World>({
    deck: [], placed: emptyPlaced(), lives: maxLives, wrong: 0, flash: 0, flashCol: -1, finished: false,
  });
  /* 지금 카드의 글자도 상태로 든다. 캔버스에 그린 글자는 화면 읽기 도구가 못 읽으므로
     이것이 없으면 무엇을 나눠야 하는지 알 길이 없다. */
  const [view, setView] = useState({ done: 0, lives: maxLives, ready: false, card: '' });
  const [note, setNote] = useState('카드를 읽고 알맞은 칸을 누르세요.');

  useEffect(() => {
    const random = createRandom(game.seed);
    const deck = shuffle(random, stage.cards);
    worldRef.current = {
      deck,
      placed: emptyPlaced(),
      lives: maxLives,
      wrong: 0,
      flash: 0,
      flashCol: -1,
      finished: false,
    };
    setView({ done: 0, lives: maxLives, ready: false, card: deck[0]?.text ?? '' });
    setNote('카드를 읽고 알맞은 칸을 누르세요.');
  }, [game.round, game.stageIndex, maxLives, stage, game.seed]);

  /** 세 칸이 모두 찼는가. 빼는 칸은 세지 않는다 — 알릴 거리가 갖춰졌는지가 조건이다. */
  const bellReady = (world: World) =>
    world.placed.where.length > 0 && world.placed.how.length > 0 && world.placed.when.length > 0;

  const sortCard = (colIndex: number) => {
    const w = worldRef.current;
    if (!game.playing || w.finished || w.deck.length === 0) return;
    const card = w.deck[0];
    const column = COLUMNS[colIndex];
    if (card.slot === column.slot) {
      w.placed[column.slot] = [...w.placed[column.slot], card.text];
      w.deck = w.deck.slice(1);
      setNote(
        card.slot === 'none'
          ? '병 이름은 몰라도 괜찮아요. 빼 두었어요.'
          : `${column.label} 칸에 넣었어요.`,
      );
    } else {
      w.lives -= 1;
      w.wrong += 1;
      w.flash = 0.6;
      w.flashCol = colIndex;
      // 틀린 카드는 맨 뒤로 보낸다. 같은 카드를 곧바로 다시 만나면 고르기가 아니라
      // 찍기가 되고, 아예 사라지면 그 카드를 판단할 기회가 없어진다.
      w.deck = [...w.deck.slice(1), card];
      setNote(`"${card.text}"${particleFor(card.text, '은', '는')} ${column.label} 칸이 아니에요. 다시 살펴봐요.`);
      if (w.lives <= 0) {
        w.finished = true;
        game.fail('카드를 다 넣지 못했어요. 어디가·어떻게·언제부터 셋으로 나누어 봐요.');
      }
    }
    const done = total - w.deck.length;
    setView({ done, lives: w.lives, ready: bellReady(w), card: w.deck[0]?.text ?? '' });
  };

  const ringBell = () => {
    const w = worldRef.current;
    if (!game.playing || w.finished || !bellReady(w)) return;
    if (w.deck.length > 0) {
      setNote('아직 남은 카드가 있어요. 다 넣고 나서 알려요.');
      return;
    }
    w.finished = true;
    game.succeed('어디가·어떻게·언제부터를 갖춰 선생님께 알렸어요. 병 이름은 몰라도 괜찮아요!');
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    if (dt > 0 && w.flash > 0) w.flash = Math.max(0, w.flash - dt);

    paintBoard(ctx, WORLD_W, WORLD_H);

    // 지금 보는 카드
    const card = w.deck[0];
    drawBar(ctx, CARD.x, CARD.y, CARD.w, CARD.h, {
      fill: B.surface, stroke: card ? B.yellow : B.grey, width: STROKE.heavy,
    });
    centerText(
      ctx,
      card ? card.text : '카드를 모두 넣었어요',
      CARD.x + CARD.w / 2,
      CARD.y + CARD.h / 2,
      card ? 30 : 24,
      B.ink,
    );
    centerText(ctx, `남은 카드 ${w.deck.length}장`, CARD.x + CARD.w / 2, CARD.y + CARD.h + 16, 20, B.grey);

    // 칸 넷
    for (let i = 0; i < COLUMNS.length; i += 1) {
      const column = COLUMNS[i];
      const x = colX(i);
      const wrong = w.flash > 0 && w.flashCol === i;
      const filled = column.slot !== 'none' && w.placed[column.slot].length > 0;
      drawBar(ctx, x, COL_Y, COL_W, COL_H, {
        fill: B.ground,
        stroke: wrong ? B.red : (filled ? B.blue : B.grey),
        width: wrong || filled ? STROKE.heavy : STROKE.base,
      });
      /* 칸의 뜻은 도형도 함께 진다. 갖춰야 할 셋은 파랑 사각, 빼는 칸은 회색 막대다. */
      drawShape(ctx, column.slot === 'none' ? 'bar' : 'square', x + 26, COL_Y + 26, 14, {
        fill: column.slot === 'none' ? B.grey : B.blue, stroke: B.keyline, width: 1,
      });
      centerText(ctx, column.label, x + COL_W / 2 + 12, COL_Y + 26, 22, B.ink);
      centerText(ctx, column.hint, x + COL_W / 2, COL_Y + 54, 20, B.grey);

      const chips = w.placed[column.slot];
      for (let k = 0; k < chips.length; k += 1) {
        const cy = COL_Y + 82 + k * 50;
        drawBar(ctx, x + 14, cy, COL_W - 28, 42, {
          fill: column.slot === 'none' ? B.ground : B.blue,
          stroke: column.slot === 'none' ? B.grey : B.keyline,
          width: STROKE.hair,
        });
        centerText(ctx, chips[k], x + COL_W / 2, cy + 21, 20,
          column.slot === 'none' ? B.grey : B.ground);
      }
    }

    // 어른 벨 — 셋이 다 차야 불이 들어온다
    const ready = bellReady(w) && w.deck.length === 0;
    drawBar(ctx, BELL.x, BELL.y, BELL.w, BELL.h, {
      fill: ready ? B.yellow : B.ground,
      stroke: ready ? B.keyline : B.grey,
      width: ready ? STROKE.heavy : STROKE.base,
    });
    centerText(ctx, '선생님께 알리기', BELL.x + BELL.w / 2, BELL.y + BELL.h / 2, 22,
      ready ? B.ground : B.grey);
    if (ready) drawMark(ctx, 'bang', BELL.x + 28, BELL.y + BELL.h / 2, 22, B.ground);
  };

  const handleTap = (x: number, y: number) => {
    if (y >= BELL.y && y <= BELL.y + BELL.h && x >= BELL.x && x <= BELL.x + BELL.w) {
      ringBell();
      return;
    }
    if (y < COL_Y || y > COL_Y + COL_H) return;
    for (let i = 0; i < COLUMNS.length; i += 1) {
      if (x >= colX(i) && x <= colX(i) + COL_W) {
        sortCard(i);
        return;
      }
    }
  };

  return (
    <MiniGameFrame
      badge="아픈 곳 카드 채우기"
      instruction="위에 나온 카드를 읽고 알맞은 칸을 누르세요. 병 이름 카드는 빼는 칸으로 보냅니다. 어디가·어떻게·언제부터가 다 차면 선생님께 알리기를 누릅니다."
      progress={{ label: '넣은 카드', value: view.done, max: total }}
      hud={<GameHud lives={view.lives} maxLives={maxLives} />}
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
            ariaLabel={`아픈 곳을 알리는 카드를 나누는 놀이. 지금 카드는 "${view.card || '없음'}". 넣은 카드 ${view.done}장, 남은 기회 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
