import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, shuffle } from '../engine';
import { publicAssetUrl } from '../../../../utils/publicAssetUrl';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m3-l8 · 같은 그림 카드 (장르 42 · 카드 짝맞추기)
 *
 * 이 차시가 다루는 것은 "먼저 스스로 떠올리고 나중에 확인하는 순서"다. 그래서 판을 열면
 * 카드를 잠깐 다 보여 주고 덮는다. 그 뒤에 짝을 찾는 일이 곧 회상이다.
 *
 * 짝을 맞추는 것만으로는 끝나지 않는다. 헛짚지 않고 이어서 찾은 짝에만 금색 도장이 남는다.
 * "전에 본 카드인가"로 판정하려 했더니, 처음에 다 보여 주는 판이라 모든 짝이 금색이 되어
 * 도장이 아무것도 가리키지 못했다. 기억이 남아 있는 동안은 연달아 맞고, 잊으면 끊긴다.
 *
 * 앞선 판은 문제 카드와 정답 카드를 짝지었다. 서로 다른 긴 글 두 줄을 읽고 뜻으로 이어야
 * 해서 기억 놀이가 아니라 읽기 시험이 되어 있었다. 지금은 같은 그림 두 장을 찾는다.
 */

interface CardSpec {
  key: string;
  src: string;
  label: string;
}

const DECK: CardSpec[] = [
  { key: 'data', src: '/images/games/card-data.jpg', label: '자료로 배워요' },
  { key: 'official', src: '/images/games/card-official.jpg', label: '공식 자료로 확인' },
  { key: 'when', src: '/images/games/card-when.jpg', label: '언제까지인지 말하기' },
  { key: 'password', src: '/images/games/card-password.jpg', label: '비밀번호는 안 보내기' },
  { key: 'facecover', src: '/images/games/card-facecover.jpg', label: '사진은 얼굴 가리기' },
  { key: 'calculator', src: '/images/games/card-calculator.jpg', label: '계산기로 다시 확인' },
  { key: 'adult', src: '/images/games/card-adult.jpg', label: '믿을 만한 어른에게' },
  { key: 'stoptime', src: '/images/games/card-stoptime.jpg', label: '멈출 시간 먼저 정하기' },
];

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  pairs: number;
  cols: number;
}

const STAGES: StageConfig[] = [
  { id: 'small', label: '기본', spoken: '네 쌍의 그림 카드를 찾아 봐요.', pairs: 4, cols: 4 },
  { id: 'mid', label: '1단계', spoken: '여섯 쌍의 그림 카드를 찾아 봐요.', pairs: 6, cols: 4 },
  { id: 'big', label: '2단계', spoken: '여덟 쌍의 그림 카드를 찾아 봐요.', pairs: 8, cols: 4 },
];

interface Card {
  id: number;
  pair: number;
  spec: CardSpec;
  open: boolean;
  cleared: boolean;
  gold: boolean;
}

function buildCards(stage: StageConfig, seed: number): Card[] {
  const chosen = DECK.slice(0, stage.pairs);
  const cards: Card[] = [];
  let id = 0;
  chosen.forEach((spec, index) => {
    /* 같은 그림 두 장. 짝인지 아닌지가 글이 아니라 그림으로 바로 보여야 한다. */
    cards.push({ id: id++, pair: index, spec, open: false, cleared: false, gold: false });
    cards.push({ id: id++, pair: index, spec, open: false, cleared: false, gold: false });
  });
  return shuffle(createRandom(seed), cards);
}

export default function SamePictureMemoryGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 처음 보여 주는 시간과 뒤집을 수 있는 횟수로 나타난다. 판과 조작은 같다. */
  const previewSeconds = (1.6 + stage.pairs * 0.25) * clamp(tuning.time, 0.7, 1.8);
  const maxTries = Math.round((stage.pairs * 2 + 6) * clamp(tuning.tolerance, 0.8, 1.6));

  const [cards, setCards] = useState<Card[]>(() => buildCards(stage, game.seed));
  const [tries, setTries] = useState(maxTries);
  const [preview, setPreview] = useState(previewSeconds);
  const [note, setNote] = useState('');
  const [gold, setGold] = useState(0);
  /* 지난 짝을 맞춘 뒤로 헛짚은 적이 없는가. 금색 도장의 조건이다. */
  const cleanRef = useRef(true);
  const doneRef = useRef(false);
  const lockRef = useRef(false);

  useEffect(() => {
    setCards(buildCards(stage, game.seed));
    setTries(maxTries);
    setPreview(previewSeconds);
    setNote('카드를 잠깐 보여 줍니다. 어떤 그림이 어디에 있는지 눈으로 담아 두세요.');
    setGold(0);
    cleanRef.current = true;
    doneRef.current = false;
    lockRef.current = false;
  }, [game.round, game.stageIndex, stage, game.seed, maxTries, previewSeconds]);

  /*
   * 처음 보여 주는 시간은 프레임 루프가 아니라 시계로 잰다.
   *
   * 공용 프레임 루프는 requestAnimationFrame으로 돈다. 그림이 움직이는 게임에는 맞지만
   * 여기서는 "몇 초 뒤에 덮는다"가 전부다. 탭이 뒤로 가 있거나 브라우저가 프레임을
   * 멈춘 상태에서는 rAF가 오지 않아 카드가 영영 덮이지 않는다.
   */
  useEffect(() => {
    if (!game.playing) return;
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const left = Math.max(0, previewSeconds - (Date.now() - startedAt) / 1000);
      setPreview(left);
      if (left === 0) {
        window.clearInterval(timer);
        setNote('이제 같은 그림 두 장을 찾아 보세요.');
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [game.playing, game.round, game.stageIndex, previewSeconds]);

  const flip = (card: Card) => {
    if (!game.playing || preview > 0 || lockRef.current) return;
    if (card.open || card.cleared || doneRef.current) return;
    playSound('select');

    const opened = cards.filter((c) => c.open && !c.cleared);

    if (opened.length === 0) {
      setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, open: true } : c)));
      setNote('짝이 되는 그림이 어디였는지 떠올려 보세요.');
      return;
    }

    const first = opened[0];
    setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, open: true } : c)));

    if (first.pair === card.pair) {
      const isGold = cleanRef.current;
      cleanRef.current = true;
      setCards((prev) => prev.map((c) => (
        c.pair === card.pair ? { ...c, open: false, cleared: true, gold: isGold } : c
      )));
      if (isGold) {
        setGold((n) => n + 1);
        playSound('stamp');
        setNote(card.spec.label + '. 헛짚지 않고 이어서 찾았어요. 금색 도장입니다.');
      } else {
        playSound('confirm');
        setNote(card.spec.label + '. 짝을 찾았어요.');
      }
      const clearedPairs = cards.filter((c) => c.cleared).length / 2 + 1;
      if (clearedPairs >= stage.pairs) {
        doneRef.current = true;
        const stamps = isGold ? gold + 1 : gold;
        game.succeed('같은 그림을 모두 찾았어요. 이어서 바로 찾은 짝이 ' + stamps + '쌍입니다.');
      }
      return;
    }

    lockRef.current = true;
    cleanRef.current = false;
    const left = tries - 1;
    setTries(left);
    setNote('다른 그림이었어요. 두 장이 어디였는지 기억해 두세요.');
    window.setTimeout(() => {
      setCards((prev) => prev.map((c) => (c.cleared ? c : { ...c, open: false })));
      lockRef.current = false;
      if (left <= 0 && !doneRef.current) {
        doneRef.current = true;
        game.fail('뒤집을 횟수를 다 썼어요. 처음 보여 줄 때 그림의 자리를 눈으로 담아 봐요.');
      }
    }, 900);
  };

  const clearedPairs = cards.filter((c) => c.cleared).length / 2;
  const showAll = preview > 0;
  const rows = Math.ceil((stage.pairs * 2) / stage.cols);

  return (
    <MiniGameFrame
      badge="같은 그림 카드"
      instruction="처음에 잠깐 보여 주는 그림의 자리를 기억했다가 같은 그림 두 장을 찾아 보세요. 헛짚지 않고 이어서 찾으면 금색 도장을 받습니다."
      progress={{ label: '맞춘 쌍', value: clearedPairs, max: stage.pairs }}
      hud={
        <GameHud
          lives={tries}
          maxLives={maxTries}
          score={gold}
          scoreLabel="금색 도장"
          timeLeft={preview}
          timeTotal={previewSeconds}
        />
      }
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} mark="retry" label="다시 섞기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div
          className="grid min-h-0 flex-1 gap-2"
          style={{
            gridTemplateColumns: `repeat(${stage.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {cards.map((card) => {
            const face = showAll || card.open || card.cleared;
            /* 짝을 맞춘 카드는 굵은 테두리를 얻는다. 헛짚지 않고 이어서 맞춘 카드는
               노랑, 그렇지 않은 카드는 회색이다. 굵기가 먼저 읽히고 색이 뒤따른다. */
            const edge = card.cleared
              ? (card.gold ? 'var(--game-board-yellow)' : 'var(--game-board-grey)')
              : face ? 'var(--game-board-ink)' : 'var(--game-board-grey)';
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => flip(card)}
                disabled={!game.playing || card.cleared || showAll}
                aria-label={face ? card.spec.label : '뒤집힌 카드'}
                className="relative block min-h-0 overflow-hidden p-1 transition disabled:cursor-default"
                style={{
                  /* 그림이 흰 바탕 위에 그려져 있다. 앞면도 흰 종이여야 그림이 스티커처럼 앉는다. */
                  background: 'var(--game-art-ground)',
                  border: `${card.cleared ? 'var(--game-heavy)' : 'var(--game-line)'} solid ${edge}`,
                  color: 'var(--game-ink)',
                }}
              >
                {/*
                  카드에는 그림만 둔다. 여덟 쌍 판은 한 칸이 110×75까지 좁아지는데, 거기에
                  이름표까지 넣었더니 그림이 36px로 줄어 무엇인지 알아볼 수 없었다.
                  뜻은 짝을 찾은 순간 아래 띠에서 읽는다 — 먼저 찾고 나중에 확인하는
                  이 차시의 순서와도 맞는다.

                  앞면 그림은 뒤집기 전에도 그려 둔다. 처음 뒤집는 순간에 내려받기 시작하면
                  한 박자 빈칸이 보이고, 그 빈칸이 곧 "여기는 아직 안 본 카드"라는 힌트가 된다.
                */}
                <img
                  src={publicAssetUrl(card.spec.src)}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                  style={{ background: 'var(--game-art-ground)' }}
                />
                {card.cleared && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      /* 맞춘 카드에는 도장을 한 귀퉁이에만 찍는다. 면을 통째로 덮으면
                         그림이 가려져 무엇을 맞췄는지 다시 볼 수 없다. */
                      background: card.gold ? 'var(--game-board-yellow)' : 'var(--game-board-grey)',
                      clipPath: 'polygon(100% 0, 100% 42%, 58% 0)',
                    }}
                  />
                )}
                {!face && (
                  /* 뒷면은 판과 같은 결의 어두운 종이다. 앞면 그림이 비쳐 보이면 안 된다. */
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      /* 뒷면은 판과 같은 어두운 면에 점 격자를 얹는다. 격자는 바우하우스의
                         반복 무늬이자, 앞면 그림이 비치지 않는다는 신호다. */
                      background: 'var(--game-board-surface)',
                      backgroundImage:
                        'radial-gradient(circle, var(--game-board-grey) 2px, transparent 2px)',
                      backgroundSize: '18px 18px',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
