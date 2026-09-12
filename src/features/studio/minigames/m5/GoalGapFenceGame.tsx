import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, drawBar, drawMark, drawShape, particleFor,
} from '../engine';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m5-l1 · 지금과 바람 두르기 (장르 35 · 땅따먹기)
 *
 * 문제를 정의하는 일은 무엇이 문제 안이고 무엇이 밖인지 **경계를 긋는 일**이다. 지금
 * 모습과 바라는 모습을 따로 두르면 둘이 눈에 보이는 두 덩어리가 되고, 둘 다에 들지 않고
 * 남는 것이 그대로 "아직 모르는 것 · 필요한 도움"이 된다.
 *
 * 짐작·감정·남 탓 조각은 어느 구역에도 들지 못한다. "관찰 가능한 말로 구분한다"가
 * 설명이 아니라 판정이 되는 자리다. 한 번 걸러진 조각에는 가위표가 남아, 다음 구역을
 * 두를 때 다시 집어 들지 않게 된다.
 *
 * 울타리를 손으로 긋게 하지 않았다. 조각을 눌러 구역에 넣고 [이 구역 다 둘렀어요]로
 * 판정한다. 흩어진 조각을 정확히 둘러싸는 선을 그으라고 하면 판단이 아니라 손끝이
 * 관문이 되고, 조각이 판 위 어디에 놓였는지가 정답을 좌우한다. 두른다는 것은 여기서
 * **무엇을 안에 넣었는가**다.
 *
 * 구역은 하나씩 차례로 두른다. 두 구역을 한꺼번에 열어 두면 "지금 무엇을 고르는 중인가"를
 * 학생이 머리에 들고 있어야 한다. 지금 두르는 것이 무엇인지는 판 위에 늘 적혀 있다.
 *
 * 틀린 구역은 그 구역만 풀린다. 이미 끝낸 구역은 남는다 — 한 번 잘못 짚었다고 처음부터
 * 다시 하게 하면 실패가 벌이 된다.
 *
 * 같은 장르를 쓰는 m4-l10(광고 구역 두르기)과 조작이 다르다. m4-l10은 움직이는 광고를
 * 피하며 버릴 쪽 구역 하나를 넓게 두르고, 판정하는 것은 두른 넓이다. 여기서는 쫓아오는
 * 것이 없고 구역을 둘 두르며, 판정하는 것은 넓이가 아니라 무엇을 안에 넣었는가다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

const COLS = 4;
const CELL_W = 200;
const CELL_H = 104;
const cellBox = (index: number) => ({
  x: 62 + (index % COLS) * 212,
  y: 84 + Math.floor(index / COLS) * 116,
  w: CELL_W,
  h: CELL_H,
});

/** 조각의 갈래. now=지금 모습, want=바라는 모습, guess=짐작·감정·남 탓, unknown=모르는 것 */
type Kind = 'now' | 'want' | 'guess' | 'unknown';

interface PhaseSpec {
  kind: Kind;
  title: string;
  hint: string;
}

const PHASES: PhaseSpec[] = [
  { kind: 'now', title: '① 지금 모습을 두르세요', hint: '눈으로 볼 수 있는 지금의 일만 고릅니다' },
  { kind: 'want', title: '② 바라는 모습을 두르세요', hint: '이렇게 되면 좋겠다는 모습만 고릅니다' },
  { kind: 'unknown', title: '③ 남은 조각을 집으세요', hint: '아직 모르는 것과 필요한 도움입니다' },
];

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  /** 다 두르고 나면 드러나는 문제 한 문장.
      조각을 이어 붙여 문장을 지으면 "지금은 빈 자리인데 놓인 책상이면"처럼 한국어가
      어그러진다. 차시마다 제대로 쓴 문장을 두고, 학생이 한 일은 그 문장의 두 덩어리를
      갈라 놓은 것이다. */
  problem: string;
  pieces: { text: string; kind: Kind }[];
}

/*
 * 판 셋은 조작이 같고 상황이 다르다. 물건이 안 온 날, 사람이 모자란 날, 시간이 모자란
 * 날로 옮겨 가면서 같은 가르기(지금·바람·짐작·모름)를 세 번 해 보게 한다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'missing',
    label: '기본',
    scene: '주문한 상자가 안 왔어요',
    spoken: '지금 모습과 바라는 모습을 갈라 두르세요.',
    problem: '지금은 자리가 비어 있는데, 내일 체험회를 열려면 책상과 안내판이 놓여 있어야 합니다.',
    pieces: [
      { text: '텅 빈 자리', kind: 'now' },
      { text: '완전히 망함', kind: 'guess' },
      { text: '놓인 책상', kind: 'want' },
      { text: '도착 시각 모름', kind: 'unknown' },
      { text: '안 온 상자', kind: 'now' },
      { text: '게으른 택배', kind: 'guess' },
      { text: '걸린 안내판', kind: 'want' },
      { text: '안 돕는 사람들', kind: 'guess' },
      { text: '없는 책상', kind: 'now' },
      { text: '열리는 체험회', kind: 'want' },
      { text: '못 하는 나', kind: 'guess' },
      { text: '도울 사람 필요', kind: 'unknown' },
    ],
  },
  {
    id: 'shorthand',
    label: '1단계',
    scene: '도와줄 사람이 모자라요',
    spoken: '지금 모습과 바라는 모습을 갈라 두르세요.',
    problem: '지금은 둘뿐인데, 오늘 안에 짐을 다 옮기려면 도와줄 사람과 손수레가 있어야 합니다.',
    pieces: [
      { text: '둘만 남은 자리', kind: 'now' },
      { text: '게으른 친구들', kind: 'guess' },
      { text: '넷이 함께', kind: 'want' },
      { text: '올 사람 모름', kind: 'unknown' },
      { text: '아직 많은 짐', kind: 'now' },
      { text: '나만 손해', kind: 'guess' },
      { text: '다 옮긴 짐', kind: 'want' },
      { text: '어차피 안 옴', kind: 'guess' },
      { text: '없는 손수레', kind: 'now' },
      { text: '수레로 나르기', kind: 'want' },
      { text: '괜히 맡은 일', kind: 'guess' },
      { text: '선생님 도움 필요', kind: 'unknown' },
    ],
  },
  {
    id: 'clock',
    label: '2단계',
    scene: '시간이 모자라요',
    spoken: '지금 모습과 바라는 모습을 갈라 두르세요.',
    problem: '지금은 자료가 안 나왔는데, 삼십 분 뒤에 문을 열려면 자료와 의자가 모두 갖춰져야 합니다.',
    pieces: [
      { text: '남은 삼십 분', kind: 'now' },
      { text: '벌써 틀림', kind: 'guess' },
      { text: '제시간에 열기', kind: 'want' },
      { text: '올 사람 수 모름', kind: 'unknown' },
      { text: '안 나온 자료', kind: 'now' },
      { text: '미운 기계', kind: 'guess' },
      { text: '다 나온 자료', kind: 'want' },
      { text: '나쁜 운', kind: 'guess' },
      { text: '덜 놓인 의자', kind: 'now' },
      { text: '다 놓인 의자', kind: 'want' },
      { text: '내 탓 아님', kind: 'guess' },
      { text: '인쇄 도움 필요', kind: 'unknown' },
    ],
  },
];

interface World {
  /** 지금 고르는 중인 조각 자리번호 */
  picked: number[];
  /** 구역이 끝난 갈래 */
  settled: Record<string, number[]>;
  /** 짐작이라 걸러진 조각. 가위표가 남는다. */
  crossed: number[];
  phase: number;
  lives: number;
  flash: number;
  flashCell: number;
  finished: boolean;
}

export default function GoalGapFenceGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 기회 수로만 나타난다. 조각과 갈래는 셋 모두 같다. */
  const maxLives = tuning.lives;

  const worldRef = useRef<World>({
    picked: [], settled: {}, crossed: [], phase: 0, lives: maxLives, flash: 0, flashCell: -1, finished: false,
  });
  const [view, setView] = useState({ phase: 0, picked: 0, lives: maxLives });
  const [note, setNote] = useState('지금 모습인 조각을 눌러 구역에 넣으세요.');

  useEffect(() => {
    worldRef.current = {
      picked: [], settled: {}, crossed: [], phase: 0, lives: maxLives, flash: 0, flashCell: -1, finished: false,
    };
    setView({ phase: 0, picked: 0, lives: maxLives });
    setNote('지금 모습인 조각을 눌러 구역에 넣으세요.');
  }, [game.round, game.stageIndex, maxLives, stage]);

  const togglePiece = (index: number) => {
    const w = worldRef.current;
    if (!game.playing || w.finished) return;
    if (w.crossed.includes(index)) {
      setNote('이 조각은 짐작이라 어느 구역에도 들어가지 않아요.');
      return;
    }
    /* Object.values는 이 설정에서 unknown[]으로 풀려 값을 못 본다. 갈래 이름이 셋뿐이니
       직접 훑는 편이 타입도 맞고 읽기도 쉽다. */
    const already = (['now', 'want', 'unknown'] as Kind[])
      .some((kind) => (w.settled[kind] ?? []).includes(index));
    if (already) {
      setNote('이미 두른 구역에 든 조각이에요.');
      return;
    }
    w.picked = w.picked.includes(index)
      ? w.picked.filter((i) => i !== index)
      : [...w.picked, index];
    setView({ phase: w.phase, picked: w.picked.length, lives: w.lives });
  };

  /** 지금 구역을 판정한다. 맞으면 다음 구역으로, 틀리면 이 구역만 풀린다. */
  const submitRegion = () => {
    const w = worldRef.current;
    if (!game.playing || w.finished) return;
    const phase = PHASES[w.phase];
    const wanted = stage.pieces
      .map((piece, index) => ({ piece, index }))
      .filter(({ piece }) => piece.kind === phase.kind)
      .map(({ index }) => index);

    if (w.picked.length === 0) {
      setNote('아직 고른 조각이 없어요.');
      return;
    }
    const wrong = w.picked.filter((index) => !wanted.includes(index));
    const missing = wanted.filter((index) => !w.picked.includes(index));

    if (wrong.length === 0 && missing.length === 0) {
      w.settled[phase.kind] = [...w.picked];
      w.picked = [];
      w.phase += 1;
      if (w.phase >= PHASES.length) {
        w.finished = true;
        game.succeed(`${stage.problem} 문제가 한 문장으로 보여요!`);
      } else {
        setNote(PHASES[w.phase].hint);
      }
      setView({ phase: w.phase, picked: 0, lives: w.lives });
      return;
    }

    // 틀린 구역은 그 구역만 풀린다. 이미 끝낸 구역은 남는다.
    w.lives -= 1;
    w.flash = 0.7;
    w.flashCell = wrong[0] ?? missing[0];
    // 짐작 조각을 집었다면 그 자리에 가위표를 남긴다. 다음 구역에서 다시 집지 않게 된다.
    for (const index of wrong) {
      if (stage.pieces[index].kind === 'guess' && !w.crossed.includes(index)) {
        w.crossed = [...w.crossed, index];
      }
    }
    w.picked = [];
    if (wrong.length > 0) {
      const text = stage.pieces[wrong[0]].text;
      setNote(
        stage.pieces[wrong[0]].kind === 'guess'
          ? `"${text}"${particleFor(text, '은', '는')} 짐작이라 구역에 넣을 수 없어요.`
          : `"${text}"${particleFor(text, '은', '는')} 이 구역이 아니에요.`,
      );
    } else {
      setNote('아직 이 구역에 넣을 조각이 남았어요.');
    }
    if (w.lives <= 0) {
      w.finished = true;
      game.fail('구역을 다 두르지 못했어요. 눈으로 볼 수 있는 일만 골라 봐요.');
    }
    setView({ phase: w.phase, picked: 0, lives: w.lives });
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    if (dt > 0 && w.flash > 0) w.flash = Math.max(0, w.flash - dt);

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    const phase = PHASES[Math.min(w.phase, PHASES.length - 1)];
    centerText(ctx, phase.title, WORLD_W / 2, 34, 26, B.ink);

    for (let i = 0; i < stage.pieces.length; i += 1) {
      const piece = stage.pieces[i];
      const box = cellBox(i);
      const picked = w.picked.includes(i);
      const crossed = w.crossed.includes(i);
      const inNow = w.settled.now?.includes(i);
      const inWant = w.settled.want?.includes(i);
      const wrongFlash = w.flash > 0 && w.flashCell === i;

      /* 두른 구역은 면을 통째로 뒤집는다. 지금 모습은 회색(있는 그대로의 사실),
         바라는 모습은 파랑(목표), 고르는 중인 것은 노랑 테두리다. */
      /* 팔레트 값은 문자열 리터럴 타입이라, 갈래에 따라 갈아 끼우려면 string으로 넓혀
         둬야 한다. 그러지 않으면 첫 대입의 색 하나만 허용된다. */
      let fill: string = B.surface;
      let stroke: string = B.grey;
      let ink: string = B.ink;
      if (inNow) { fill = B.grey; stroke = B.keyline; ink = B.ground; }
      if (inWant) { fill = B.blue; stroke = B.keyline; ink = B.ground; }
      if (crossed) { fill = B.ground; stroke = B.red; ink = B.grey; }
      if (picked) { stroke = B.yellow; }

      drawBar(ctx, box.x, box.y, box.w, box.h, {
        fill,
        stroke: wrongFlash ? B.red : stroke,
        width: picked || wrongFlash ? STROKE.heavy : STROKE.base,
      });
      centerText(ctx, piece.text, box.x + box.w / 2, box.y + box.h / 2, 21, ink);
      if (crossed) drawMark(ctx, 'cross', box.x + box.w - 24, box.y + 22, 22, B.red);
      if (picked) drawMark(ctx, 'dot', box.x + 22, box.y + 22, 16, B.yellow);
      if (inNow || inWant) {
        drawShape(ctx, inWant ? 'square' : 'bar', box.x + 22, box.y + 22, 13, {
          fill: B.ground, stroke: B.ground, width: 1,
        });
      }
    }

    // 아래 띠 — 두른 구역이 무엇인지 늘 보인다
    const summary = [
      { label: '지금 모습', done: Boolean(w.settled.now), tone: B.grey },
      { label: '바라는 모습', done: Boolean(w.settled.want), tone: B.blue },
      { label: '모르는 것', done: Boolean(w.settled.unknown), tone: B.yellow },
    ];
    for (let i = 0; i < summary.length; i += 1) {
      const x = 62 + i * 282;
      drawBar(ctx, x, 444, 270, 52, {
        fill: summary[i].done ? summary[i].tone : B.ground,
        stroke: summary[i].done ? B.keyline : B.grey,
        width: STROKE.base,
      });
      centerText(ctx, summary[i].label, x + 135, 470, 21,
        summary[i].done ? (i === 2 ? B.keyline : B.ground) : B.grey);
    }
    centerText(ctx, phase.hint, WORLD_W / 2, 516, 20, B.grey);
  };

  const handleTap = (x: number, y: number) => {
    for (let i = 0; i < stage.pieces.length; i += 1) {
      const box = cellBox(i);
      if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
        togglePiece(i);
        return;
      }
    }
  };

  return (
    <MiniGameFrame
      badge="지금과 바람 두르기"
      instruction="지금 모습인 조각을 눌러 모으고, 다 모았으면 아래 버튼으로 구역을 두르세요. 그다음 바라는 모습을 두릅니다. 짐작이나 기분을 적은 조각은 어느 구역에도 들어가지 않습니다."
      progress={{ label: '두른 구역', value: view.phase, max: PHASES.length }}
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
      actions={
        <>
          <MiniGameButton
            onClick={submitRegion}
            disabled={!game.playing || view.picked === 0}
            mark="check"
            label={`이 구역 다 둘렀어요 (${view.picked}개)`}
            variant="primary"
          />
          <MiniGameButton onClick={game.retry} mark="retry" label="처음부터" />
        </>
      }
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
            ariaLabel={`지금 모습과 바라는 모습을 갈라 두르는 놀이. ${PHASES[Math.min(view.phase, PHASES.length - 1)].title}, 고른 조각 ${view.picked}개, 남은 기회 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
