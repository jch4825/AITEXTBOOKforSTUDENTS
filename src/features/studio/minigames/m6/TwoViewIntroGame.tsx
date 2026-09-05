import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BOARD, PLAY, GameCanvas, GameHud, centerText, clamp, panel, useCountdown,
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

    ctx.fillStyle = BOARD.bg;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 두 창 — 시점이 돌면서 한쪽이 앞으로 나온다
    const windows: { label: string; emoji: string; online: boolean }[] = [
      { label: '교실 창', emoji: '🏫', online: false },
      { label: '온라인 창', emoji: '💻', online: true },
    ];

    windows.forEach((win, index) => {
      const focus = index === 0 ? 1 - t : t;
      const width = 300 + focus * 280;
      const x = index === 0 ? 40 + (1 - focus) * 40 : WORLD_W - 40 - width - (1 - focus) * 40;
      const y = 70;
      const height = 400;
      ctx.globalAlpha = 0.45 + focus * 0.55;
      panel(ctx, x, y, width, height, BOARD.surface, focus > 0.5 ? PLAY.info : BOARD.line, 16);
      centerText(ctx, `${win.emoji} ${win.label}`, x + width / 2, y + 30, 24, BOARD.ink);

      SLOTS.forEach((slot, si) => {
        const piece = pieceById(placed[slot]);
        const ok = piece ? (win.online ? piece.onlineOk : piece.classOk) : false;
        const sy = y + 72 + si * 108;
        panel(
          ctx, x + 18, sy, width - 36, 92,
          piece ? (ok ? '#064E3B' : '#7F1D1D') : BOARD.overlay,
          piece ? (ok ? PLAY.goal : PLAY.hazard) : BOARD.line, 12,
        );
        centerText(ctx, SLOT_LABEL[slot], x + width / 2, sy + 24, 20, BOARD.inkDim);
        const text = piece ? (win.online ? piece.onlineText : piece.classText) : '비었습니다';
        centerText(ctx, text, x + width / 2, sy + 58, focus > 0.5 ? 21 : 18, BOARD.ink);
      });
      ctx.globalAlpha = 1;
    });

    panel(ctx, WORLD_W / 2 - 150, WORLD_H - 52, 300, 40, BOARD.overlay, PLAY.hero, 10);
    centerText(ctx, '시점 돌리기로 두 창을 견주세요', WORLD_W / 2, WORLD_H - 32, 20, BOARD.ink);
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
          <MiniGameButton onClick={turn} emoji="🔄" label={view === 0 ? '온라인 창으로' : '교실 창으로'} />
          <MiniGameButton onClick={game.retry} emoji="↩️" label="다시 놓기" />
          <MiniGameButton onClick={check} disabled={!game.playing} emoji="✅" label="두 창 확인" variant="primary" />
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
                className="min-h-12 rounded-xl px-2 text-left text-[14px] font-black leading-tight transition"
                style={{
                  background: on ? '#38BDF8' : 'var(--board-surface)',
                  color: on ? '#0F172A' : 'var(--board-ink)',
                  border: '2px solid #38BDF8',
                }}
              >
                <span className="block" style={{ color: on ? '#0F172A' : '#94A3B8' }}>{SLOT_LABEL[piece.slot]}</span>
                {piece.classText}
              </button>
            );
          })}
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
