import React, { useEffect, useMemo, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, PLAY, createRandom, shuffle, useCountdown, useGameKeys, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m1-l7 · 요약 다른 곳 찾기 (장르 12 · 틀린 그림 찾기)
 *
 * 아이미의 요약은 1초 만에 나오지만 그 안에서 숫자가 바뀌고 조건이 빠진다. 눈으로만
 * 훑으면 그 자리가 보이지 않으므로, 원문 줄을 실제로 끌어다 요약 줄 위에 포개게 했다.
 * 포개는 순간 같은 글자는 두 겹으로 흐려지고 다른 글자만 붉게 남는다. 확인하는 일
 * 자체가 조작이 되게 하려는 배치다.
 *
 * 겹쳐 보는 것은 몇 번이든 자유롭지만, 확정은 겹친 상태에서 뜨는 '다름' 도장을 눌러야
 * 된다. 같은 줄에 도장을 찍으면 기회가 줄어 아무 줄에나 찍고 지나가는 길이 막힌다.
 */

const LINE_COUNT = 6;

interface LinePair {
  /** 사람이 쓴 원문 줄 */
  text: string;
  /** 아이미가 잘못 옮길 수 있는 줄. 없는 줄은 어떤 판에서도 늘 같게 남는다. */
  alt?: string;
}

interface StageConfig {
  id: string;
  label: string;
  title: string;
  spoken: string;
  lines: LinePair[];
}

/* 세 판 모두 조작과 줄 수가 같고 안내문의 종류와 어긋나는 자리만 다르다.
   숫자·장소·빠진 조건 세 가지가 각 판에 고루 들어가도록 후보를 넷씩 두었다. */
const STAGES: StageConfig[] = [
  {
    id: 'lunch',
    label: '기본',
    title: '급식 안내',
    spoken: '급식 안내문으로 바꿨어요.',
    lines: [
      { text: '오늘 급식은 3층 식당입니다.', alt: '오늘 급식은 2층 식당입니다.' },
      { text: '점심시간은 12시에 시작합니다.' },
      { text: '우유는 한 개씩 받습니다.', alt: '우유는 받습니다.' },
      { text: '국은 미역국이 나옵니다.' },
      { text: '식판은 반납대에 놓습니다.', alt: '식판은 정리함에 놓습니다.' },
      { text: '남은 반찬은 그릇에 모읍니다.', alt: '남은 반찬은 봉지에 모읍니다.' },
    ],
  },
  {
    id: 'trip',
    label: '1단계',
    title: '현장학습 안내',
    spoken: '현장학습 안내문으로 바꿨어요.',
    lines: [
      { text: '현장학습은 목요일에 갑니다.', alt: '현장학습은 금요일에 갑니다.' },
      { text: '버스는 9시에 출발합니다.' },
      { text: '비가 오면 우산을 챙깁니다.', alt: '우산을 챙깁니다.' },
      { text: '도시락은 각자 준비합니다.' },
      { text: '모둠은 네 명씩 모입니다.', alt: '모둠은 세 명씩 모입니다.' },
      { text: '돌아오는 시간은 4시입니다.', alt: '돌아오는 시간은 5시입니다.' },
    ],
  },
  {
    id: 'library',
    label: '2단계',
    title: '도서관 규칙',
    spoken: '도서관 규칙으로 바꿨어요.',
    lines: [
      { text: '도서관은 4층에 있습니다.', alt: '도서관은 3층에 있습니다.' },
      { text: '책은 두 권까지 빌립니다.', alt: '책은 네 권까지 빌립니다.' },
      { text: '독서 모임은 도서관에서 합니다.', alt: '독서 모임은 체육관에서 합니다.' },
      { text: '늦게 내면 이틀 동안 못 빌립니다.' },
      { text: '다 읽은 뒤에 수레에 놓습니다.', alt: '수레에 놓습니다.' },
      { text: '물은 뚜껑을 닫고 마십니다.' },
    ],
  },
];

interface DiffParts {
  head: string;
  /** 원문에만 있는 가운데 토막 */
  from: string;
  /** 요약이 그 자리에 대신 넣은 토막. 비면 통째로 빠진 것이다. */
  to: string;
  tail: string;
  same: boolean;
}

/**
 * 앞뒤로 같은 부분을 걷어 내고 어긋난 가운데 토막만 남긴다.
 * 낱말 단위 비교가 아니라 글자 단위라서 '3층'과 '2층'처럼 한 글자만 바뀐 자리도 그
 * 한 글자만 붉어진다. 학생이 봐야 할 곳이 정확히 그 한 글자이기 때문이다.
 */
function diffParts(source: string, summary: string): DiffParts {
  let head = 0;
  while (head < source.length && head < summary.length && source[head] === summary[head]) head += 1;
  let tail = 0;
  while (
    tail < source.length - head
    && tail < summary.length - head
    && source[source.length - 1 - tail] === summary[summary.length - 1 - tail]
  ) tail += 1;
  const from = source.slice(head, source.length - tail);
  const to = summary.slice(head, summary.length - tail);
  return {
    head: source.slice(0, head),
    from,
    to,
    tail: tail === 0 ? '' : source.slice(source.length - tail),
    same: from === '' && to === '',
  };
}

/** 후보 줄 가운데 몇 개를 실제로 어긋나게 할지 씨앗으로 고른다. 같은 판은 늘 같게 나온다. */
function buildSummary(stage: StageConfig, seed: number, diffCount: number): string[] {
  const candidates = stage.lines
    .map((line, index) => (line.alt ? index : -1))
    .filter((index) => index >= 0);
  const chosen = new Set(shuffle(createRandom(seed), candidates).slice(0, diffCount));
  return stage.lines.map((line, index) => (chosen.has(index) && line.alt ? line.alt : line.text));
}

/** 같은 부분을 두 겹으로 그려 "포개졌다"를 보이게 한다. 글자를 흐리는 것이 아니라 겹친다. */
function Ghost({ text }: { text: string }) {
  if (!text) return null;
  return (
    <span className="relative inline-block" style={{ whiteSpace: 'pre', color: 'rgba(226, 232, 240, 0.9)' }}>
      {text}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 inline-block"
        style={{ whiteSpace: 'pre', color: 'rgba(148, 163, 184, 0.55)', transform: 'translate(2px, 2px)' }}
      >
        {text}
      </span>
    </span>
  );
}

/** 겹친 줄 한 줄. 같은 자리는 포개져 물러나고 어긋난 자리만 붉게 앞으로 나온다. */
function OverlayLine({ diff }: { diff: DiffParts }) {
  return (
    <span className="text-[16px] font-black leading-snug">
      <Ghost text={diff.head} />
      {diff.from !== '' && (
        <span
          className="inline-block text-[18px]"
          style={{
            whiteSpace: 'pre',
            color: '#FECACA',
            borderBottom: `3px solid ${PLAY.hazard}`,
            transform: 'translateY(-2px)',
          }}
        >
          {diff.from}
        </span>
      )}
      <Ghost text={diff.tail} />
    </span>
  );
}

export default function SummaryDiffGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 요구 수준은 줄 수가 아니라 "찾을 자리 수·줄 높이·기회·시간·머무는 시간"으로 벌린다.
     같은 안내문, 같은 조작에서 눈이 할 일만 늘어난다. */
  const diffCount = Math.max(3, Math.min(4, Math.round(3 * tuning.density)));
  const rowH = Math.max(30, Math.round(34 * tuning.size));
  const totalTime = Math.round(75 * tuning.time);
  const holdMs = Math.round(900 * tuning.tolerance);
  const dropPad = 5 * tuning.tolerance;

  const summaryLines = useMemo(
    () => buildSummary(stage, game.seed, diffCount),
    [stage, game.seed, diffCount],
  );
  const diffs = useMemo(
    () => stage.lines.map((line, index) => diffParts(line.text, summaryLines[index])),
    [stage, summaryLines],
  );

  const [found, setFound] = useState<number[]>([]);
  const [overlay, setOverlay] = useState<number | null>(null);
  const [drag, setDrag] = useState<{ index: number; dx: number; dy: number } | null>(null);
  const [hoverRow, setHoverRow] = useState(-1);
  const [cursor, setCursor] = useState(0);
  const [lives, setLives] = useState(tuning.lives);
  const [started, setStarted] = useState(false);
  const [note, setNote] = useState({ text: '원문 줄을 잡아 아래로 끌면 시작합니다.', tone: PLAY.info as string });

  const summaryRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragRef = useRef<{ index: number; x: number; y: number; moved: boolean } | null>(null);
  const holdRef = useRef(0);
  const finishedRef = useRef(false);
  const keys = useGameKeys(game.playing);

  /** 성공·실패는 한 판에 한 번만. 시간·기회·도장 세 길에서 모두 여기로 모인다. */
  const finish = (ok: boolean, message: string) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    window.clearTimeout(holdRef.current);
    if (ok) game.succeed(message);
    else game.fail(message);
  };

  // 시간은 첫 조작 뒤에야 흐른다. 화면을 읽는 동안 초가 사라지면 읽기를 포기하게 된다.
  const timeLeft = useCountdown(game.playing && started, totalTime, game.round, () => {
    finish(false, '시간이 끝났어요. 숫자와 장소, 빠진 말을 먼저 견주어 보세요.');
  });

  useEffect(() => {
    setFound([]);
    setOverlay(null);
    setDrag(null);
    setHoverRow(-1);
    setCursor(0);
    setLives(tuning.lives);
    setStarted(false);
    setNote({ text: '원문 줄을 잡아 아래로 끌면 시작합니다.', tone: PLAY.info });
    dragRef.current = null;
    finishedRef.current = false;
    window.clearTimeout(holdRef.current);
  }, [game.round, game.stageIndex, tuning.lives]);

  useEffect(() => () => window.clearTimeout(holdRef.current), []);

  /** 놓은 자리에서 가장 가까운 요약 줄. 여유 폭은 지원 수준을 따른다. */
  const resolveDropRow = (clientY: number) => {
    let best = -1;
    let bestGap = Number.POSITIVE_INFINITY;
    for (let index = 0; index < LINE_COUNT; index += 1) {
      const element = summaryRefs.current[index];
      if (!element) continue;
      const box = element.getBoundingClientRect();
      if (clientY < box.top - dropPad || clientY > box.bottom + dropPad) continue;
      const gap = Math.abs(clientY - (box.top + box.bottom) / 2);
      if (gap < bestGap) {
        bestGap = gap;
        best = index;
      }
    }
    return best;
  };

  const overlayRow = (index: number) => {
    if (!game.playing || finishedRef.current || found.includes(index)) return;
    window.clearTimeout(holdRef.current);
    playSound('select');
    setOverlay(index);
    setCursor(index);
    setStarted(true);
    if (diffs[index].same) {
      setNote({ text: '이 줄은 원문과 같아요. 다른 줄도 겹쳐 보세요.', tone: PLAY.goal });
      // 같은 줄은 초록으로 잠깐 빛나고 스스로 제자리로 돌아간다. 정리하는 손이 하나 줄어든다.
      holdRef.current = window.setTimeout(() => {
        setOverlay((current) => (current === index ? null : current));
      }, holdMs);
    } else {
      setNote({ text: '붉은 글자가 원문과 다른 곳이에요. 다름 도장을 눌러 표시하세요.', tone: PLAY.hazard });
    }
  };

  const stamp = () => {
    if (overlay === null || !game.playing || finishedRef.current) return;
    const index = overlay;
    window.clearTimeout(holdRef.current);
    setOverlay(null);
    if (diffs[index].same) {
      const left = lives - 1;
      setLives(left);
      setNote({ text: '이 줄은 원문과 같은 줄이었어요. 기회가 하나 줄었어요.', tone: PLAY.hazard });
      if (left <= 0) finish(false, '기회를 모두 썼어요. 겹쳐서 붉은 글자가 보이는 줄에만 도장을 찍어요.');
      return;
    }
    const next = [...found, index];
    setFound(next);
    setNote({ text: `${index + 1}번 줄을 원문대로 고쳤어요.`, tone: PLAY.goal });
    if (next.length >= diffCount) {
      finish(true, `아이미 요약에서 다른 곳 ${diffCount}군데를 찾아 원문대로 고쳤어요!`);
    }
  };

  // 마우스를 쥐고 끌기 어려운 학생을 위해 같은 조작을 위아래 화살표와 스페이스로도 연다.
  useGameLoop(game.playing, () => {
    if (keys.consumePress('down')) setCursor((value) => Math.min(LINE_COUNT - 1, value + 1));
    if (keys.consumePress('up')) setCursor((value) => Math.max(0, value - 1));
    if (keys.consumePress('action')) {
      if (overlay === cursor) stamp();
      else overlayRow(cursor);
    }
  });

  const onRowDown = (event: React.PointerEvent<HTMLButtonElement>, index: number) => {
    if (!game.playing || found.includes(index)) return;
    try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* 무시 */ }
    dragRef.current = { index, x: event.clientX, y: event.clientY, moved: false };
    setCursor(index);
    setDrag({ index, dx: 0, dy: 0 });
  };

  const onRowMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (!current) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) current.moved = true;
    setDrag({ index: current.index, dx, dy });
    setHoverRow(resolveDropRow(event.clientY));
  };

  const onRowUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (!current) return;
    dragRef.current = null;
    setDrag(null);
    setHoverRow(-1);
    // 끌지 않고 눌렀다 뗀 것도 제자리에 겹치는 뜻으로 받는다. 조작을 두 갈래로 열어 둔다.
    const target = current.moved ? resolveDropRow(event.clientY) : current.index;
    if (target < 0) {
      setNote({ text: '아래 요약 줄 위에 겹쳐 주세요.', tone: PLAY.info });
      return;
    }
    if (target !== current.index) {
      setNote({ text: `${current.index + 1}번 줄은 요약 ${current.index + 1}번 줄 위에 겹쳐 주세요.`, tone: PLAY.info });
      return;
    }
    overlayRow(current.index);
  };

  const cardStyle = { background: 'var(--board-surface)', border: '2px solid var(--board-line)' };

  return (
    <MiniGameFrame
      badge="요약 다른 곳 찾기"
      instruction="원문 줄을 잡아 아래 요약의 같은 자리 줄 위에 겹치세요. 붉은 글자가 보이면 다름 도장을 누릅니다. 위아래 화살표와 스페이스로도 됩니다."
      progress={{ label: '찾은 다른 곳', value: found.length, max: diffCount }}
      hud={<GameHud lives={lives} maxLives={tuning.lives} timeLeft={timeLeft} timeTotal={totalTime} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 찾기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 읽을 글은 이 띠 한 곳에만 둔다. 줄마다 안내가 붙으면 어디를 읽어야 할지 흩어진다. */}
        <div
          role="status"
          className="rounded-xl px-3 py-1.5 text-[15px] font-black leading-snug"
          style={{ background: 'var(--board-overlay)', border: `2px solid ${note.tone}`, color: 'var(--board-ink)' }}
        >
          {note.text}
        </div>

        {/* 원문 카드 — 끌어 내리는 쪽 */}
        <div className="flex flex-col gap-1 rounded-xl p-1.5" style={cardStyle}>
          <p className="px-1 text-[14px] font-black" style={{ color: 'var(--board-ink)' }}>
            <span aria-hidden="true">📄 </span>원문 · {stage.title}
          </p>
          {stage.lines.map((line, index) => {
            const isDone = found.includes(index);
            const isDown = overlay === index;
            const dragging = drag?.index === index;
            return (
              <button
                key={line.text}
                type="button"
                disabled={!game.playing || isDone}
                onPointerDown={(event) => onRowDown(event, index)}
                onPointerMove={onRowMove}
                onPointerUp={onRowUp}
                onPointerCancel={onRowUp}
                aria-label={`원문 ${index + 1}번 줄, ${line.text}. 아래 요약 ${index + 1}번 줄 위로 끌어 겹칩니다.`}
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors disabled:cursor-default"
                style={{
                  minHeight: rowH,
                  position: 'relative',
                  zIndex: dragging ? 20 : undefined,
                  touchAction: 'none',
                  opacity: isDown ? 0.3 : 1,
                  background: 'var(--board-overlay)',
                  border: `2px solid ${cursor === index && game.playing ? PLAY.hero : 'var(--board-line)'}`,
                  transform: dragging ? `translate(${drag.dx}px, ${drag.dy}px)` : undefined,
                }}
              >
                <span className="w-5 shrink-0 text-[15px] font-black" style={{ color: 'var(--board-ink)' }}>
                  {index + 1}
                </span>
                <span className="flex-1 text-[16px] font-black leading-snug" style={{ color: 'var(--board-ink)' }}>
                  {line.text}
                </span>
                <span aria-hidden="true" className="text-[15px]">{isDone ? '✅' : '⇕'}</span>
              </button>
            );
          })}
        </div>

        {/* 아이미 요약 카드 — 겹쳐 받는 쪽 */}
        <div className="flex flex-col gap-1 rounded-xl p-1.5" style={cardStyle}>
          <p className="px-1 text-[14px] font-black" style={{ color: 'var(--board-ink)' }}>
            <span aria-hidden="true">🤖 </span>아이미가 1초 만에 만든 요약
          </p>
          {summaryLines.map((text, index) => {
            const diff = diffs[index];
            const isDone = found.includes(index);
            const isOver = overlay === index;
            const edge = isDone || (isOver && diff.same)
              ? PLAY.goal
              : isOver ? PLAY.hazard
                : hoverRow === index ? PLAY.info : 'var(--board-line)';
            return (
              <div
                key={`${text}-${index}`}
                ref={(element) => { summaryRefs.current[index] = element; }}
                className="flex items-center gap-2 rounded-lg px-2 py-1"
                style={{
                  minHeight: isOver ? Math.round(rowH * 1.6) : rowH,
                  background: 'var(--board-overlay)',
                  border: `2px solid ${edge}`,
                }}
              >
                <span className="w-5 shrink-0 text-[15px] font-black" style={{ color: 'var(--board-ink)' }}>
                  {index + 1}
                </span>
                {isDone ? (
                  <span className="flex-1 text-[16px] font-black leading-snug" style={{ color: 'var(--board-ink)' }}>
                    {diff.head}
                    <span style={{ color: PLAY.goal }}>{diff.from}</span>
                    {diff.tail}
                  </span>
                ) : isOver ? (
                  <span className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                    <OverlayLine diff={diff} />
                    {!diff.same && (
                      <span
                        className="rounded-md px-2 py-0.5 text-[14px] font-black"
                        style={{ background: 'var(--board-surface)', border: `2px solid ${PLAY.hazard}`, color: 'var(--board-ink)' }}
                      >
                        {diff.to === ''
                          ? `빠짐 · ${diff.from.trim()}`
                          : `바뀜 · ${diff.to.trim()} → ${diff.from.trim()}`}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="flex-1 text-[16px] font-black leading-snug" style={{ color: 'var(--board-ink)' }}>
                    {text}
                  </span>
                )}
                {isDone && <span aria-hidden="true" className="text-[16px]">✅</span>}
                {isOver && (
                  <button
                    type="button"
                    onClick={stamp}
                    aria-label={`${index + 1}번 줄을 원문과 다른 줄로 표시하기`}
                    className="min-h-11 shrink-0 rounded-lg px-3 text-[15px] font-black"
                    style={{ background: 'var(--board-surface)', border: `2px solid ${PLAY.hazard}`, color: 'var(--board-ink)' }}
                  >
                    <span aria-hidden="true">🔴 </span>다름
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </MiniGameFrame>
  );
}
