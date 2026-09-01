import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, shuffle, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m3-l8 · 양면 퀴즈 카드 (장르 42 · 카드 짝맞추기)
 *
 * "먼저 풀고 나중에 정답을 본다"를 뒤집는 순서로 만든다. 문제 카드를 먼저 열면
 * 모래시계가 돌고, 그 안에 정답을 찾으면 금색 도장이 찍힌다. 시간이 지난 뒤에
 * 맞히면 은색이고, 정답 카드를 먼저 열면 도장이 없다.
 *
 * 짝을 맞추는 것만으로는 끝나지 않는다. 어떤 순서로 뒤집었는지가 남는다.
 */

interface PairSpec {
  q: string;
  a: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  pairs: PairSpec[];
  cols: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'small',
    label: '기본',
    spoken: '네 쌍의 퀴즈 카드를 맞춰 봐요.',
    cols: 4,
    pairs: [
      { q: 'AI는 무엇으로 배우나요', a: '자료로 배웁니다' },
      { q: '답을 확인하는 곳은', a: '공식 자료' },
      { q: '부탁에 꼭 넣을 것은', a: '언제까지' },
      { q: '보내면 안 되는 것은', a: '비밀번호' },
    ],
  },
  {
    id: 'mid',
    label: '1단계',
    spoken: '여섯 쌍의 퀴즈 카드를 맞춰 봐요.',
    cols: 4,
    pairs: [
      { q: 'AI는 무엇으로 배우나요', a: '자료로 배웁니다' },
      { q: '답을 확인하는 곳은', a: '공식 자료' },
      { q: '부탁에 꼭 넣을 것은', a: '언제까지' },
      { q: '보내면 안 되는 것은', a: '비밀번호' },
      { q: '사진 보내기 전에는', a: '얼굴을 가립니다' },
      { q: '계산은 무엇으로', a: '계산기로 확인' },
    ],
  },
  {
    id: 'big',
    label: '2단계',
    spoken: '여덟 쌍의 퀴즈 카드를 맞춰 봐요.',
    cols: 4,
    pairs: [
      { q: 'AI는 무엇으로 배우나요', a: '자료로 배웁니다' },
      { q: '답을 확인하는 곳은', a: '공식 자료' },
      { q: '부탁에 꼭 넣을 것은', a: '언제까지' },
      { q: '보내면 안 되는 것은', a: '비밀번호' },
      { q: '사진 보내기 전에는', a: '얼굴을 가립니다' },
      { q: '계산은 무엇으로', a: '계산기로 확인' },
      { q: '이상한 요청은 누구에게', a: '믿을 만한 어른' },
      { q: '멈출 시간은 언제 정하나요', a: '시작하기 전에' },
    ],
  },
];

interface Card {
  id: number;
  pair: number;
  question: boolean;
  text: string;
  open: boolean;
  cleared: boolean;
  gold: boolean;
}

function buildCards(stage: StageConfig, seed: number): Card[] {
  const cards: Card[] = [];
  let id = 0;
  stage.pairs.forEach((pair, index) => {
    cards.push({ id: id++, pair: index, question: true, text: pair.q, open: false, cleared: false, gold: false });
    cards.push({ id: id++, pair: index, question: false, text: pair.a, open: false, cleared: false, gold: false });
  });
  return shuffle(createRandom(seed), cards);
}

export default function QuizCardMemoryGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 '먼저 풀 시간'과 시도 횟수로 나타난다. 카드 내용은 스테이지가 정한다. */
  const thinkSeconds = 3.5 * clamp(tuning.time, 0.8, 1.6);
  const maxTries = Math.round((stage.pairs.length + 4) * clamp(tuning.tolerance, 0.7, 1.5));

  const [cards, setCards] = useState<Card[]>(() => buildCards(stage, game.seed));
  const [tries, setTries] = useState(maxTries);
  const [think, setThink] = useState(0);
  const [note, setNote] = useState('');
  const [gold, setGold] = useState(0);
  const doneRef = useRef(false);
  const lockRef = useRef(false);

  useEffect(() => {
    setCards(buildCards(stage, game.seed));
    setTries(maxTries);
    setThink(0);
    setNote('');
    setGold(0);
    doneRef.current = false;
    lockRef.current = false;
  }, [game.round, game.stageIndex, stage, game.seed, maxTries]);

  useGameLoop(game.playing && think > 0, (dt) => {
    setThink((value) => Math.max(0, value - dt));
  });

  const flip = (card: Card) => {
    if (!game.playing || lockRef.current || card.open || card.cleared || doneRef.current) return;
    playSound('select');
    const opened = cards.filter((c) => c.open && !c.cleared);

    if (opened.length === 0) {
      setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, open: true } : c)));
      if (card.question) {
        setThink(thinkSeconds);
        setNote('먼저 스스로 답을 떠올려 보세요. 모래시계 안에 맞히면 금색 도장입니다.');
      } else {
        setThink(0);
        setNote('정답 카드를 먼저 열었어요. 이번에는 도장을 받을 수 없습니다.');
      }
      return;
    }

    const first = opened[0];
    setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, open: true } : c)));

    if (first.pair === card.pair && first.question !== card.question) {
      const isGold = first.question && think > 0;
      setCards((prev) => prev.map((c) => (
        c.pair === card.pair ? { ...c, open: false, cleared: true, gold: isGold } : c
      )));
      setThink(0);
      if (isGold) {
        setGold((n) => n + 1);
        playSound('stamp');
        setNote('스스로 먼저 떠올려 맞혔어요. 금색 도장을 받았습니다.');
      } else {
        playSound('confirm');
        setNote('짝을 맞췄어요. 다음에는 먼저 떠올려 보세요.');
      }
      const clearedPairs = cards.filter((c) => c.cleared).length / 2 + 1;
      if (clearedPairs >= stage.pairs.length) {
        doneRef.current = true;
        game.succeed(`퀴즈 카드를 모두 맞췄어요. 먼저 떠올려 맞힌 것이 ${isGold ? gold + 1 : gold}개입니다.`);
      }
      return;
    }

    lockRef.current = true;
    const left = tries - 1;
    setTries(left);
    setNote('짝이 아니에요. 카드 자리를 기억해 두세요.');
    window.setTimeout(() => {
      setCards((prev) => prev.map((c) => (c.cleared ? c : { ...c, open: false })));
      setThink(0);
      lockRef.current = false;
      if (left <= 0 && !doneRef.current) {
        doneRef.current = true;
        game.fail('뒤집을 횟수를 다 썼어요. 문제 카드를 먼저 열고 답을 떠올려 봐요.');
      }
    }, 900);
  };

  const clearedPairs = cards.filter((c) => c.cleared).length / 2;

  return (
    <MiniGameFrame
      badge="양면 퀴즈 카드"
      instruction="문제 카드를 먼저 열고 스스로 답을 떠올린 다음, 모래시계가 도는 동안 정답 카드를 찾으세요."
      progress={{ label: '맞춘 쌍', value: clearedPairs, max: stage.pairs.length }}
      hud={
        <GameHud
          lives={tries}
          maxLives={maxTries}
          score={gold}
          scoreLabel="금색 도장"
          timeLeft={think}
          timeTotal={thinkSeconds}
        />
      }
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 섞기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div
          className="grid min-h-0 flex-1 gap-1.5"
          style={{ gridTemplateColumns: `repeat(${stage.cols}, minmax(0, 1fr))` }}
        >
          {cards.map((card) => {
            const face = card.open || card.cleared;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => flip(card)}
                disabled={!game.playing || card.cleared}
                aria-label={face ? card.text : '뒤집힌 카드'}
                className="flex min-h-16 flex-col items-center justify-center rounded-xl px-1.5 py-1 text-[14px] font-black leading-tight transition"
                style={{
                  background: card.cleared
                    ? (card.gold ? 'rgba(251, 191, 36, 0.2)' : 'rgba(148, 163, 184, 0.16)')
                    : face ? 'var(--board-surface)' : 'var(--board-overlay)',
                  border: `2px solid ${
                    card.cleared ? (card.gold ? '#FBBF24' : '#94A3B8')
                      : card.question ? '#38BDF8' : '#D6A347'
                  }`,
                  color: 'var(--board-ink)',
                }}
              >
                {face ? (
                  <>
                    <span className="text-[15px]" aria-hidden="true">{card.question ? '❓' : '💡'}</span>
                    <span>{card.text}</span>
                    {card.cleared && <span aria-hidden="true">{card.gold ? '🥇' : '🥈'}</span>}
                  </>
                ) : (
                  <span className="text-[22px]" aria-hidden="true">🂠</span>
                )}
              </button>
            );
          })}
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
