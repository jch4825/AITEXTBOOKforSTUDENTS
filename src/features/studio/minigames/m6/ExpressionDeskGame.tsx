import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { BauhausMark, GameHud, clamp, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m6-l9 · 표현 교환대 (장르 49 · 손님 안내)
 *
 * "인사·도움 요청·거절·다시 말해 달라기를 편한 방법으로 표현한다"를 응대로 만든다.
 * 손님마다 상황이 다르고, 편한 방법(말·글·그림)도 다르다.
 *
 * 표현이 맞아도 방법이 맞지 않으면 전해지지 않는다. 무엇을 말하느냐와
 * 어떻게 전하느냐를 함께 고르는 것이 이 차시다.
 */

type Way = 'speak' | 'write' | 'picture';

/*
 * 방법 이름 옆의 그림 문자를 걷었다.
 *
 * 그림 문자는 늘 '말로·글로·그림 카드로' 바로 옆에만 나타나 뜻을 더하지 않으면서,
 * 기기와 글꼴마다 다른 모양으로 보이는 값만 치렀다. 방법 셋을 가르는 것은 이름이고,
 * 지금 고른 방법은 아래 단추에서 면과 표시로 알린다.
 */
const WAY_INFO: Record<Way, { name: string }> = {
  speak: { name: '말로' },
  write: { name: '글로' },
  picture: { name: '그림 카드로' },
};

type Kind = 'greet' | 'help' | 'refuse' | 'again';

const KIND_LABEL: Record<Kind, string> = {
  greet: '인사',
  help: '도움 요청',
  refuse: '거절',
  again: '다시 말해 주기',
};

interface Guest {
  id: number;
  situation: string;
  kind: Kind;
  way: Way;
  patience: number;
  max: number;
}

interface Card {
  kind: Kind;
  text: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  guests: { situation: string; kind: Kind; way: Way }[];
  cards: Card[];
  need: number;
  patience: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'class',
    label: '기본',
    spoken: '교실 손님에게 알맞은 표현을 건네요.',
    need: 4,
    patience: 16,
    guests: [
      { situation: '처음 만난 친구가 인사합니다', kind: 'greet', way: 'speak' },
      { situation: '문이 무거워 열지 못합니다', kind: 'help', way: 'speak' },
      { situation: '귀가 불편한 친구가 인사합니다', kind: 'greet', way: 'picture' },
      { situation: '지금은 같이 놀기 어렵습니다', kind: 'refuse', way: 'speak' },
      { situation: '말이 너무 빨라 못 들었습니다', kind: 'again', way: 'write' },
    ],
    cards: [
      { kind: 'greet', text: '안녕하세요' },
      { kind: 'help', text: '도와주시겠어요?' },
      { kind: 'refuse', text: '지금은 어려워요' },
      { kind: 'again', text: '다시 말해 주시겠어요?' },
    ],
  },
  {
    id: 'shop',
    label: '1단계',
    spoken: '가게 손님에게 알맞은 표현을 건네요.',
    need: 5,
    patience: 14,
    guests: [
      { situation: '가게에 들어서며 인사합니다', kind: 'greet', way: 'speak' },
      { situation: '높은 선반의 물건이 필요합니다', kind: 'help', way: 'speak' },
      { situation: '시끄러워 말이 들리지 않습니다', kind: 'again', way: 'write' },
      { situation: '권하는 물건이 필요하지 않습니다', kind: 'refuse', way: 'speak' },
      { situation: '말이 잘 나오지 않습니다', kind: 'help', way: 'picture' },
      { situation: '떠날 때 인사합니다', kind: 'greet', way: 'picture' },
    ],
    cards: [
      { kind: 'greet', text: '안녕하세요' },
      { kind: 'help', text: '도와주시겠어요?' },
      { kind: 'refuse', text: '괜찮습니다' },
      { kind: 'again', text: '다시 말해 주시겠어요?' },
    ],
  },
  {
    id: 'public',
    label: '2단계',
    spoken: '바깥에서 만난 사람에게 알맞은 표현을 건네요.',
    need: 6,
    patience: 12,
    guests: [
      { situation: '길에서 아는 어른을 만났습니다', kind: 'greet', way: 'speak' },
      { situation: '버스 번호가 보이지 않습니다', kind: 'help', way: 'speak' },
      { situation: '안내 방송을 놓쳤습니다', kind: 'again', way: 'write' },
      { situation: '모르는 사람이 따라오라고 합니다', kind: 'refuse', way: 'speak' },
      { situation: '목이 아파 말하기 어렵습니다', kind: 'help', way: 'picture' },
      { situation: '창구 직원이 인사합니다', kind: 'greet', way: 'write' },
      { situation: '설명이 너무 빨랐습니다', kind: 'again', way: 'picture' },
    ],
    cards: [
      { kind: 'greet', text: '안녕하세요' },
      { kind: 'help', text: '도와주시겠어요?' },
      { kind: 'refuse', text: '싫어요. 가지 않겠습니다' },
      { kind: 'again', text: '다시 말해 주시겠어요?' },
    ],
  },
];

export default function ExpressionDeskGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 손님의 참을성과 동시 손님 수, 허용 실수로 나타난다. 표현은 같다. */
  const patience = stage.patience * clamp(tuning.time, 0.85, 1.6);
  const maxGuests = clamp(Math.round(2 * tuning.density), 1, 3);
  const maxLives = tuning.lives;

  const [guests, setGuests] = useState<Guest[]>([]);
  const [served, setServed] = useState(0);
  const [lives, setLives] = useState(maxLives);
  const [way, setWay] = useState<Way>('speak');
  const [note, setNote] = useState('');
  const nextId = useRef(1);
  const queueRef = useRef<number[]>([]);
  const spawnRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    nextId.current = 1;
    queueRef.current = stage.guests.map((_, index) => index);
    spawnRef.current = 0;
    doneRef.current = false;
    setGuests([]);
    setServed(0);
    setLives(maxLives);
    setWay('speak');
    setNote('');
  }, [game.round, game.stageIndex, stage, maxLives]);

  useGameLoop(game.playing && !doneRef.current, (dt) => {
    spawnRef.current -= dt;
    setGuests((prev) => {
      let list = prev.map((guest) => ({ ...guest, patience: guest.patience - dt }));
      const left = list.filter((guest) => guest.patience <= 0);
      if (left.length > 0) {
        list = list.filter((guest) => guest.patience > 0);
        setLives((value) => {
          const remain = value - left.length;
          if (remain <= 0 && !doneRef.current) {
            doneRef.current = true;
            game.fail('손님이 기다리다 떠났어요. 상황에 맞는 표현과 방법을 함께 골라 봐요.');
          }
          return remain;
        });
        setNote('손님이 기다리다 떠났어요.');
      }
      if (spawnRef.current <= 0 && list.length < maxGuests && queueRef.current.length > 0) {
        spawnRef.current = 2.4;
        const index = queueRef.current.shift() as number;
        const spec = stage.guests[index];
        list = [...list, {
          id: nextId.current++, situation: spec.situation, kind: spec.kind, way: spec.way,
          patience, max: patience,
        }];
      }
      return list;
    });
  });

  const serve = (card: Card) => {
    if (!game.playing || doneRef.current) return;
    const guest = guests[0];
    if (!guest) {
      setNote('아직 손님이 오지 않았어요.');
      return;
    }
    if (guest.kind !== card.kind) {
      setLives((value) => {
        const left = value - 1;
        if (left <= 0 && !doneRef.current) {
          doneRef.current = true;
          game.fail('상황과 다른 표현을 건넸어요. 손님의 상황을 먼저 읽어 봐요.');
        }
        return left;
      });
      setNote(`이 손님에게는 ${KIND_LABEL[guest.kind]} 표현이 필요해요.`);
      return;
    }
    if (guest.way !== way) {
      setNote(`이 손님에게는 ${WAY_INFO[guest.way].name} 전하는 것이 편해요.`);
      return;
    }
    playSound('confirm');
    setGuests((prev) => prev.filter((g) => g.id !== guest.id));
    setNote(`${WAY_INFO[way].name} "${card.text}"를 전했어요.`);
    setServed((value) => {
      const next = value + 1;
      if (next >= stage.need && !doneRef.current) {
        doneRef.current = true;
        game.succeed('상황에 맞는 표현을 손님이 편한 방법으로 전했어요!');
      }
      return next;
    });
  };

  const front = guests[0];

  return (
    <MiniGameFrame
      badge="표현 교환대"
      instruction="도움을 청하는 손님의 마음을 살피고, 손님이 편안해하는 방법(말·글·그림)에 맞추어 알맞은 표현 카드를 골라 보세요."
      progress={{ label: '응대한 손님', value: served, max: stage.need }}
      hud={<GameHud lives={lives} maxLives={maxLives} timeLeft={front?.patience ?? 0} timeTotal={patience} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-auto">
          {guests.length === 0 && (
            <p className="text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>손님을 기다립니다.</p>
          )}
          {guests.map((guest, index) => {
            const isFront = index === 0;
            const urgent = guest.patience / guest.max < 0.3;
            return (
              <div
                key={guest.id}
                className="flex items-center gap-2 px-3 py-2"
                style={{
                  /* 지금 응대할 손님만 뜬 면과 노랑 테두리를 얻고, 기다리는 손님은
                     회색 구조물로 남는다. 차례는 화살표와 점으로도 갈리므로 색을
                     가리지 못해도 어느 줄이 내 차례인지 읽힌다. */
                  background: isFront ? 'var(--game-board-surface)' : 'var(--game-board)',
                  border: `var(--game-line) solid ${
                    isFront ? 'var(--game-board-yellow)' : 'var(--game-board-grey)'}`,
                }}
              >
                <span
                  style={{ color: isFront ? 'var(--game-board-yellow)' : 'var(--game-board-grey)' }}
                >
                  <BauhausMark kind={isFront ? 'arrow' : 'dot'} size={18} />
                </span>
                <span className="flex-1 text-[15px] font-black leading-tight" style={{ color: 'var(--game-board-ink)' }}>
                  {guest.situation}
                  <span className="block text-[14px]" style={{ color: 'var(--game-board-grey)' }}>
                    편한 방법 · {WAY_INFO[guest.way].name}
                  </span>
                </span>
                {/* 참을성이 바닥나 가는 것은 붉은 세모가 함께 알린다. 막대 색만으로
                    나누면 색을 구별하지 못하는 학생에게 붉은 막대와 노란 막대가
                    같은 회색이 된다. */}
                {urgent && (
                  <span style={{ color: 'var(--game-board-red-ink)' }}>
                    <BauhausMark kind="triangle" size={14} />
                  </span>
                )}
                <span
                  className="h-3 w-20 overflow-hidden"
                  style={{
                    background: 'var(--game-board)',
                    border: 'var(--game-hair) solid var(--game-board-grey)',
                  }}
                >
                  <span
                    className="block h-full"
                    style={{
                      width: `${clamp((guest.patience / guest.max) * 100, 0, 100)}%`,
                      /* 초록을 쓰던 자리다. 남은 참을성은 학생이 쥐고 쓰는 값이라 노랑이고,
                         바닥나 갈 때만 붉어진다. 먼저 읽히는 것은 줄어드는 길이다. */
                      background: urgent ? 'var(--game-board-red)' : 'var(--game-board-yellow)',
                    }}
                  />
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(WAY_INFO) as Way[]).map((key) => {
            const picked = way === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setWay(key)}
                aria-pressed={picked}
                disabled={!game.playing}
                className="flex min-h-11 items-center gap-1.5 px-3 text-[15px] font-black transition"
                style={{
                  /* 지금 쥔 방법이므로 노랑이다. 테두리만 바꾸면 셋 가운데 무엇을
                     들고 있는지 한눈에 들어오지 않아, 고른 것은 면을 통째로 뒤집는다. */
                  background: picked ? 'var(--game-board-yellow)' : 'var(--game-board)',
                  color: picked ? 'var(--game-board)' : 'var(--game-board-ink)',
                  border: `var(--game-line) solid ${
                    picked ? 'var(--game-board-yellow)' : 'var(--game-board-grey)'}`,
                }}
              >
                {/* 고른 것은 확인 표시, 나머지는 점이다. 자리를 늘 같이 차지하므로
                    누를 때마다 단추 너비가 흔들리지 않는다. */}
                <BauhausMark kind={picked ? 'check' : 'dot'} size={14} />
                {WAY_INFO[key].name}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {stage.cards.map((card) => (
            <button
              key={card.kind}
              type="button"
              onClick={() => serve(card)}
              disabled={!game.playing}
              className="min-h-12 flex-1 px-2 text-[15px] font-black"
              style={{
                /* 손님에게 건네는 표현이 이 판의 목표다. 목표는 파랑이다. */
                background: 'var(--game-board)',
                border: 'var(--game-line) solid var(--game-board-blue)',
                color: 'var(--game-board-ink)',
              }}
            >
              {card.text}
            </button>
          ))}
        </div>

        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
