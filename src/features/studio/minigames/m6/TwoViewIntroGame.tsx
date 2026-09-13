import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, BauhausMark, GameCanvas, GameHud, STROKE,
  centerText, clamp, drawBar, drawShape, useCountdown, paintBoard,
} from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m6-l11 · 두 방향 소개 (장르 22 · 시점 조작 퍼즐)
 *
 * "같은 자기소개를 교실용과 온라인용 두 버전으로 만든다"를 시점 돌리기로 만든다.
 * 조각 하나에는 두 면이 있다. 교실 쪽에서 보면 이렇게, 온라인 쪽에서 보면 저렇게 읽힌다.
 *
 * 한쪽만 맞추면 반대쪽이 깨진다. 시점을 돌려 두 창을 번갈아 보며 양쪽에서 모두
 * 읽히는 조각을 찾아 끼우는 것이 이 게임이다.
 */

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

const WORLD_W = 960;
const WORLD_H = 540;

type SlotId = 'greet' | 'about' | 'ask';

const SLOT_LABEL: Record<SlotId, string> = {
  greet: '인사',
  about: '나에 대한 것',
  ask: '부탁',
};

interface Piece {
  id: string;
  slot: SlotId;
  classText: string;
  onlineText: string;
  classOk: boolean;
  onlineOk: boolean;
  /** 어긋날 때 학생에게 알려 줄 까닭 */
  why: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  pieces: Piece[];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'basic',
    label: '기본',
    spoken: '교실용과 온라인용 소개를 함께 맞춰요.',
    seconds: 120,
    pieces: [
      { id: 'g1', slot: 'greet', classText: '안녕하세요, 저는 하늘이입니다', onlineText: '안녕하세요, 저는 하늘이입니다', classOk: true, onlineOk: true, why: '' },
      { id: 'g2', slot: 'greet', classText: '3학년 2반 김하늘입니다', onlineText: '3학년 2반 김하늘입니다', classOk: true, onlineOk: false, why: '온라인 창에서는 반과 이름이 그대로 보입니다' },
      { id: 'a1', slot: 'about', classText: '그림 그리기를 좋아합니다', onlineText: '그림 그리기를 좋아합니다', classOk: true, onlineOk: true, why: '' },
      { id: 'a2', slot: 'about', classText: '제 자리는 창가입니다', onlineText: '제 자리는 창가입니다', classOk: true, onlineOk: false, why: '온라인에서는 어디 있는지 알려 주는 말이 됩니다' },
      { id: 's1', slot: 'ask', classText: '쉬는 시간에 같이 그려요', onlineText: '댓글로 그림 이야기해요', classOk: true, onlineOk: true, why: '' },
      { id: 's2', slot: 'ask', classText: '우리 집에 놀러 오세요', onlineText: '우리 집에 놀러 오세요', classOk: false, onlineOk: false, why: '만나자는 말은 두 창 모두에서 조심할 말입니다' },
    ],
  },
  {
    id: 'club',
    label: '1단계',
    spoken: '동아리 소개를 두 창에 맞춰요.',
    seconds: 110,
    pieces: [
      { id: 'g1', slot: 'greet', classText: '안녕하세요, 그림 동아리입니다', onlineText: '안녕하세요, 그림 동아리입니다', classOk: true, onlineOk: true, why: '' },
      { id: 'g2', slot: 'greet', classText: '반갑습니다. 제 번호는 010입니다', onlineText: '반갑습니다. 제 번호는 010입니다', classOk: false, onlineOk: false, why: '전화번호는 어느 창에도 적지 않습니다' },
      { id: 'a1', slot: 'about', classText: '매주 수요일에 모입니다', onlineText: '매주 수요일에 모입니다', classOk: true, onlineOk: true, why: '' },
      { id: 'a2', slot: 'about', classText: '학교 후문 앞 미술실입니다', onlineText: '학교 후문 앞 미술실입니다', classOk: true, onlineOk: false, why: '온라인 창에는 정확한 장소를 적지 않습니다' },
      { id: 's1', slot: 'ask', classText: '관심 있으면 저에게 말해 주세요', onlineText: '관심 있으면 선생님께 문의해 주세요', classOk: true, onlineOk: true, why: '' },
      { id: 's2', slot: 'ask', classText: '아무 때나 찾아오세요', onlineText: '아무 때나 찾아오세요', classOk: false, onlineOk: false, why: '언제든 오라는 말은 조건이 없어 지키기 어렵습니다' },
    ],
  },
  {
    id: 'work',
    label: '2단계',
    spoken: '체험 활동 소개를 두 창에 맞춰요.',
    seconds: 100,
    pieces: [
      { id: 'g1', slot: 'greet', classText: '안녕하세요, 도서 도우미입니다', onlineText: '안녕하세요, 도서 도우미입니다', classOk: true, onlineOk: true, why: '' },
      { id: 'g2', slot: 'greet', classText: '저는 3반 열여섯 번입니다', onlineText: '저는 3반 열여섯 번입니다', classOk: true, onlineOk: false, why: '온라인 창에서는 반과 번호가 나를 가리킵니다' },
      { id: 'a1', slot: 'about', classText: '책 정리를 꾸준히 합니다', onlineText: '책 정리를 꾸준히 합니다', classOk: true, onlineOk: true, why: '' },
      { id: 'a2', slot: 'about', classText: '매일 4시에 혼자 남습니다', onlineText: '매일 4시에 혼자 남습니다', classOk: false, onlineOk: false, why: '혼자 있는 시간을 알리는 말은 조심합니다' },
      { id: 'a3', slot: 'about', classText: '번호 순서를 잘 맞춥니다', onlineText: '번호 순서를 잘 맞춥니다', classOk: true, onlineOk: true, why: '' },
      { id: 's1', slot: 'ask', classText: '도움이 필요하면 불러 주세요', onlineText: '도움이 필요하면 사서 선생님께 남겨 주세요', classOk: true, onlineOk: true, why: '' },
      { id: 's2', slot: 'ask', classText: '개인 메시지로 연락 주세요', onlineText: '개인 메시지로 연락 주세요', classOk: true, onlineOk: false, why: '온라인에서 개인 메시지를 권하지 않습니다' },
    ],
  },
];

const SLOTS: SlotId[] = ['greet', 'about', 'ask'];

export default function TwoViewIntroGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시간·확인 기회·시점이 도는 속도로 나타난다. 조각과 두 창은 같다. */
  const seconds = Math.round(stage.seconds * tuning.time);
  const maxChecks = tuning.lives;
  const turnSpeed = 2.4 * clamp(tuning.speed, 0.8, 1.4);

  const [placed, setPlaced] = useState<Record<SlotId, string | null>>({ greet: null, about: null, ask: null });
  const [view, setView] = useState<0 | 1>(0);
  const [checks, setChecks] = useState(maxChecks);
  const [note, setNote] = useState('');
  const angleRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    setPlaced({ greet: null, about: null, ask: null });
    setView(0);
    setChecks(maxChecks);
    setNote('');
    angleRef.current = 0;
    doneRef.current = false;
  }, [game.round, game.stageIndex, stage, maxChecks]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    if (!doneRef.current) {
      doneRef.current = true;
      game.fail('시간이 지났어요. 시점을 돌려 두 창에서 모두 읽히는 조각을 찾아 봐요.');
    }
  });

  const pieceById = (id: string | null) => stage.pieces.find((p) => p.id === id) ?? null;

  const put = (piece: Piece) => {
    if (!game.playing || doneRef.current) return;
    playSound('select');
    setPlaced((prev) => ({ ...prev, [piece.slot]: prev[piece.slot] === piece.id ? null : piece.id }));
    setNote('');
  };

  const turn = () => {
    if (!game.playing) return;
    setView((value) => (value === 0 ? 1 : 0));
    playSound('confirm');
  };

  const check = () => {
    if (!game.playing || doneRef.current) return;
    const missing = SLOTS.find((slot) => !placed[slot]);
    if (missing) {
      setNote(`${SLOT_LABEL[missing]} 자리가 비었어요.`);
      return;
    }
    const bad = SLOTS.map((slot) => pieceById(placed[slot]) as Piece)
      .find((piece) => !piece.classOk || !piece.onlineOk);
    if (!bad) {
      doneRef.current = true;
      game.succeed('두 창 모두에서 바르게 읽히는 소개를 만들었어요. 교실용과 온라인용이 함께 완성됐습니다.');
      return;
    }
    const left = checks - 1;
    setChecks(left);
    setNote(`${bad.why} 시점을 돌려 다시 확인해 보세요.`);
    if (left <= 0) {
      doneRef.current = true;
      game.fail('한쪽 창에서 깨지는 조각이 남았어요. 두 창 모두에서 읽히는 조각을 골라 봐요.');
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const target = view === 0 ? 0 : 1;
    if (dt > 0) {
      const step = turnSpeed * dt;
      angleRef.current += clamp(target - angleRef.current, -step, step);
    }
    const t = angleRef.current;

    paintBoard(ctx, WORLD_W, WORLD_H);

    /*
     * 두 창 — 시점이 돌면서 한쪽이 앞으로 나온다.
     *
     * 창 이름 옆의 그림 문자를 걷었다. 이름이 바로 옆에 있어 뜻을 더하지 않으면서,
     * 기기와 글꼴마다 다른 모양으로 보이는 값만 치렀다.
     */
    const windows: { label: string; online: boolean }[] = [
      { label: '교실 창', online: false },
      { label: '온라인 창', online: true },
    ];

    windows.forEach((win, index) => {
      const focus = index === 0 ? 1 - t : t;
      const width = 300 + focus * 280;
      const x = index === 0 ? 40 + (1 - focus) * 40 : WORLD_W - 40 - width - (1 - focus) * 40;
      const y = 70;
      const height = 400;
      /*
       * 뒤쪽 창을 반투명으로 밀어 두던 것을 걷었다. 덮개가 글자까지 흐려 놓는데,
       * 두 창의 문장을 나란히 견주는 것이 이 놀이의 조작 그 자체다. 앞뒤는
       * 창 크기와 테두리 굵기, 이름의 색으로 가른다.
       */
      const front = focus > 0.5;
      drawBar(ctx, x, y, width, height, {
        fill: B.surface,
        stroke: front ? B.blue : B.grey,
        width: front ? STROKE.heavy : STROKE.hair,
      });
      centerText(ctx, win.label, x + width / 2, y + 30, 24, front ? B.ink : B.grey);

      SLOTS.forEach((slot, si) => {
        const piece = pieceById(placed[slot]);
        const ok = piece ? (win.online ? piece.onlineOk : piece.classOk) : false;
        const sy = y + 72 + si * 108;
        /*
         * 칸을 상태 색으로 꽉 채우지 않는다. 판 위에서 빨강에 얹은 글자는 대비가
         * 5.85까지 내려가는데, 학생이 읽어야 하는 것이 바로 그 문장이다. 면은
         * 중립으로 두고 테두리와 도형이 상태를 진다.
         */
        drawBar(ctx, x + 18, sy, width - 36, 92, {
          fill: B.ground,
          stroke: piece ? (ok ? B.blue : B.red) : B.grey,
          width: piece ? STROKE.base : STROKE.hair,
        });
        /* 이 창에서 읽히면 파랑 사각형, 깨지면 빨강 삼각형이다. 판 위에서 빨강과
           파랑의 대비는 1.22라 색만으로 나누면 둘이 같은 회색이 된다. */
        if (piece && ok) drawShape(ctx, 'square', x + 40, sy + 24, 22, { fill: B.blue });
        if (piece && !ok) drawShape(ctx, 'triangle', x + 40, sy + 24, 24, { fill: B.red });
        centerText(ctx, SLOT_LABEL[slot], x + width / 2, sy + 24, 20, B.grey);
        const text = piece ? (win.online ? piece.onlineText : piece.classText) : '비었습니다';
        /* 뒤쪽 창의 글자도 20 가상 단위 아래로 내리지 않는다. 읽히지 않는 글은
           견줄 거리가 되지 못한다. */
        centerText(ctx, text, x + width / 2, sy + 58, front ? 22 : 20, B.ink);
      });
    });

    drawBar(ctx, WORLD_W / 2 - 150, WORLD_H - 52, 300, 40,
      { fill: B.ground, stroke: B.yellow, width: STROKE.base });
    centerText(ctx, '시점 돌리기로 두 창을 견주세요', WORLD_W / 2, WORLD_H - 32, 20, B.ink);
  };

  const filled = SLOTS.filter((slot) => placed[slot]).length;

  return (
    <MiniGameFrame
      badge="두 방향 소개"
      instruction="나를 소개하는 글 조각을 알맞게 넣은 뒤, 내가 볼 때와 다른 사람이 볼 때 모두 마음이 잘 전해지는지 살펴보세요."
      progress={{ label: '채운 자리', value: filled, max: SLOTS.length }}
      hud={<GameHud lives={checks} maxLives={maxChecks} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          {/* 시점 돌리기는 화살표 하나를 돌려 쓴다. 오른쪽 창으로 갈 때는 오른쪽,
              왼쪽 창으로 돌아올 때는 왼쪽을 가리킨다. 방향마다 다른 그림을 두면
              학생이 같은 뜻의 그림을 둘 익혀야 한다. */}
          <MiniGameButton
            onClick={turn}
            mark="arrow"
            markRotate={view === 0 ? 0 : 180}
            label={view === 0 ? '온라인 창으로' : '교실 창으로'}
          />
          <MiniGameButton onClick={game.retry} mark="retry" label="다시 놓기" />
          <MiniGameButton onClick={check} disabled={!game.playing} mark="check" label="두 창 확인" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="game-canvas-fit">
            <GameCanvas
              active
              width={WORLD_W}
              height={WORLD_H}
              onFrame={frame}
              onPointer={(pointer) => {
                if (pointer.phase !== 'down') return;
                setView(pointer.x < WORLD_W / 2 ? 0 : 1);
              }}
              ariaLabel={`교실 창과 온라인 창에서 자기소개를 견주는 놀이. 채운 자리 ${filled}개.`}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {stage.pieces.map((piece) => {
            const on = placed[piece.slot] === piece.id;
            return (
              <button
                key={piece.id}
                type="button"
                onClick={() => put(piece)}
                disabled={!game.playing}
                className="min-h-12 px-2 text-left text-[14px] font-black leading-tight transition"
                style={{
                  /*
                   * 놓은 조각은 노랑 면으로 뒤집는다. 판 위의 파랑과 빨강은 "이 창에서
                   * 읽히는가"를 이미 지고 있어, 고른 조각까지 파랑으로 칠하면 놓기만
                   * 해도 맞은 것으로 읽힌다. 지금 손에 쥔 것은 노랑이다.
                   */
                  background: on ? 'var(--game-board-yellow)' : 'var(--game-board)',
                  color: on ? 'var(--game-board)' : 'var(--game-board-ink)',
                  border: `var(--game-line) solid ${
                    on ? 'var(--game-board-yellow)' : 'var(--game-board-grey)'}`,
                }}
              >
                <span
                  className="flex items-center gap-1"
                  style={{ color: on ? 'var(--game-board)' : 'var(--game-board-grey)' }}
                >
                  {/* 노랑 원 — 학생이 조종하는 것의 짝이다. 색을 못 가려도 모양으로 읽는다. */}
                  {on && <BauhausMark kind="circle" size={12} />}
                  {SLOT_LABEL[piece.slot]}
                </span>
                {piece.classText}
              </button>
            );
          })}
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
