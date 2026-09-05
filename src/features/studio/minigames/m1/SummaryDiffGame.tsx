import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, shuffle, useCountdown } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m1-l7 · 같은 말 짝짓기 (장르 12 · 대조)
 *
 * "원문과 요약을 나란히 놓고 달라진 곳을 찾는다"를 짝짓기로 만든다. 왼쪽 원문 줄을
 * 끌어다 오른쪽 요약 줄 위에 겹치면, 같은 말이면 붙고 다르면 붉게 튀어 오른다.
 *
 * 짝이 없는 원문 줄이 남는다. 그것이 요약에서 빠진 내용이므로, 마지막에 '빠짐' 칸으로
 * 끌어다 놓아야 끝난다. 찾기만 하는 것이 아니라 무엇이 빠졌는지까지 말하게 된다.
 */

interface Pair {
  source: string;
  summary: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  title: string;
  pairs: Pair[];
  /** 요약에서 통째로 빠진 원문 줄 */
  missing: string[];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'lunch',
    label: '기본',
    spoken: '급식 안내의 원문과 요약을 맞춰 봐요.',
    title: '급식 안내',
    seconds: 120,
    pairs: [
      { source: '오늘 급식은 12시 30분에 시작합니다', summary: '12시 30분에 시작합니다' },
      { source: '메뉴는 제육볶음과 미역국입니다', summary: '제육볶음과 미역국이 나옵니다' },
      { source: '급식실은 1층 오른쪽입니다', summary: '1층 오른쪽 급식실입니다' },
    ],
    missing: ['우유 알레르기가 있으면 미리 알려 주세요'],
  },
  {
    id: 'trip',
    label: '1단계',
    spoken: '현장학습 안내의 원문과 요약을 맞춰 봐요.',
    title: '현장학습 안내',
    seconds: 110,
    pairs: [
      { source: '금요일 아침 9시에 모입니다', summary: '금요일 9시에 모입니다' },
      { source: '학교 체육관 앞에서 출발합니다', summary: '체육관 앞에서 출발합니다' },
      { source: '점심 도시락을 각자 준비합니다', summary: '도시락을 준비합니다' },
    ],
    missing: ['물병을 꼭 챙겨 주세요', '비가 오면 다음 주로 미룹니다'],
  },
  {
    id: 'library',
    label: '2단계',
    spoken: '도서관 안내의 원문과 요약을 맞춰 봐요.',
    title: '도서관 이용 안내',
    seconds: 100,
    pairs: [
      { source: '도서관은 2층에 있습니다', summary: '2층에 있습니다' },
      { source: '한 번에 두 권까지 빌릴 수 있습니다', summary: '두 권까지 빌립니다' },
      { source: '빌린 책은 일주일 안에 돌려줍니다', summary: '일주일 안에 돌려줍니다' },
      { source: '월요일은 문을 닫습니다', summary: '월요일은 쉽니다' },
    ],
    missing: ['들어갈 때 학생증을 보여 주세요', '음식은 가지고 들어갈 수 없습니다'],
  },
];

interface Card {
  id: string;
  text: string;
  /** 짝이 되는 요약 줄의 id. 빠진 줄은 null */
  match: string | null;
  done: boolean;
}

export default function SummaryDiffGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시간·기회로 나타난다. 원문과 요약은 셋 모두 같다. */
  const seconds = Math.round(stage.seconds * tuning.time);
  const maxLives = tuning.lives;
  const rowMin = Math.round(52 * clamp(tuning.size, 0.9, 1.2));

  const [sources, setSources] = useState<Card[]>([]);
  const [summaries, setSummaries] = useState<{ id: string; text: string; filled: boolean }[]>([]);
  const [held, setHeld] = useState<string | null>(null);
  const [lives, setLives] = useState(maxLives);
  const [note, setNote] = useState('');
  const doneRef = useRef(false);

  const total = stage.pairs.length + stage.missing.length;

  useEffect(() => {
    const random = createRandom(game.seed);
    const cards: Card[] = [
      ...stage.pairs.map((pair, index) => ({
        id: `p${index}`, text: pair.source, match: `s${index}`, done: false,
      })),
      ...stage.missing.map((text, index) => ({
        id: `m${index}`, text, match: null, done: false,
      })),
    ];
    setSources(shuffle(random, cards));
    setSummaries(shuffle(random, stage.pairs.map((pair, index) => ({
      id: `s${index}`, text: pair.summary, filled: false,
    }))));
    setHeld(null);
    setLives(maxLives);
    setNote('');
    doneRef.current = false;
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    if (!doneRef.current) {
      doneRef.current = true;
      game.fail('시간이 지났어요. 같은 말을 찾아 짝을 지어 봐요.');
    }
  });

  const loseLife = (message: string) => {
    setNote(message);
    setLives((value) => {
      const left = value - 1;
      if (left <= 0 && !doneRef.current) {
        doneRef.current = true;
        game.fail('짝이 자꾸 어긋났어요. 두 줄을 소리 내어 읽고 같은 말을 찾아 봐요.');
      }
      return left;
    });
  };

  const finishIfDone = (next: Card[]) => {
    if (next.some((card) => !card.done)) return;
    doneRef.current = true;
    game.succeed('같은 말은 짝을 짓고, 요약에서 빠진 줄까지 찾아냈어요!');
  };

  const dropOnSummary = (summaryId: string) => {
    if (!game.playing || doneRef.current) return;
    if (!held) { setNote('왼쪽 원문 줄을 먼저 고르세요.'); return; }
    const card = sources.find((item) => item.id === held);
    if (!card) return;

    if (card.match !== summaryId) {
      setHeld(null);
      loseLife(card.match === null
        ? '이 줄은 요약에 없는 내용이에요. 아래 빠짐 칸으로 옮겨 보세요.'
        : '두 줄이 같은 말이 아니에요. 다시 읽어 보세요.');
      return;
    }
    playSound('confirm');
    const next = sources.map((item) => (item.id === card.id ? { ...item, done: true } : item));
    setSources(next);
    setSummaries((prev) => prev.map((item) => (item.id === summaryId ? { ...item, filled: true } : item)));
    setHeld(null);
    setNote('같은 말이라 짝이 되었어요.');
    finishIfDone(next);
  };

  const dropOnMissing = () => {
    if (!game.playing || doneRef.current) return;
    if (!held) { setNote('왼쪽 원문 줄을 먼저 고르세요.'); return; }
    const card = sources.find((item) => item.id === held);
    if (!card) return;
    if (card.match !== null) {
      setHeld(null);
      loseLife('이 줄은 요약에 짝이 있어요. 오른쪽에서 같은 말을 찾아 보세요.');
      return;
    }
    playSound('stamp');
    const next = sources.map((item) => (item.id === card.id ? { ...item, done: true } : item));
    setSources(next);
    setHeld(null);
    setNote(`"${card.text}"가 요약에서 빠졌어요.`);
    finishIfDone(next);
  };

  const matched = sources.filter((card) => card.done).length;

  return (
    <MiniGameFrame
      badge="같은 말 짝짓기"
      instruction="왼쪽 글을 먼저 누르고, 오른쪽 요약에서 같은 뜻을 가진 말을 찾아 짝지어 보세요. 요약에서 빠진 글은 아래 빠짐 칸으로 옮겨 봅시다."
      progress={{ label: '짝지은 줄', value: matched, max: total }}
      hud={<GameHud lives={lives} maxLives={maxLives} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <p className="text-[15px] font-black" style={{ color: 'var(--board-ink)' }}>
          {stage.title} · 왼쪽은 원문, 오른쪽은 아이미의 요약입니다
        </p>

        <div className="flex min-h-0 flex-1 gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-auto">
            {sources.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => { if (!card.done) { setHeld(card.id); playSound('select'); setNote(''); } }}
                disabled={!game.playing || card.done}
                style={{
                  minHeight: rowMin,
                  background: card.done ? 'rgba(74, 222, 128, 0.16)'
                    : held === card.id ? '#38BDF8' : 'var(--board-surface)',
                  border: `2px solid ${card.done ? '#4ADE80' : '#38BDF8'}`,
                  color: held === card.id ? '#0F172A' : 'var(--board-ink)',
                }}
                className="rounded-xl px-2 text-left text-[15px] font-black leading-tight transition"
              >
                {card.done ? '✅ ' : ''}{card.text}
              </button>
            ))}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-auto">
            {summaries.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => dropOnSummary(item.id)}
                disabled={!game.playing || item.filled}
                style={{
                  minHeight: rowMin,
                  background: item.filled ? 'rgba(74, 222, 128, 0.16)' : 'var(--board-overlay)',
                  border: `2px solid ${item.filled ? '#4ADE80' : '#D6A347'}`,
                  color: 'var(--board-ink)',
                }}
                className="rounded-xl px-2 text-left text-[15px] font-black leading-tight transition"
              >
                {item.filled ? '✅ ' : ''}{item.text}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={dropOnMissing}
          disabled={!game.playing}
          className="min-h-12 rounded-xl px-3 text-[15px] font-black"
          style={{ background: 'var(--board-overlay)', border: '2px solid #FB7185', color: 'var(--board-ink)' }}
        >
          🕳️ 요약에서 빠진 줄은 여기로
        </button>

        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
          {note || (held ? '오른쪽에서 같은 말을 찾아 누르세요.' : '왼쪽 원문 줄을 하나 고르세요.')}
        </p>
      </div>
    </MiniGameFrame>
  );
}
