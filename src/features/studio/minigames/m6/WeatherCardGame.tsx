import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, shuffle } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m6-l5 · 날씨 옷 카드 (장르 39 · 카드 배틀)
 *
 * "공식 예보의 기온·비·바람을 확인하고 준비물을 고른다"를 턴제 카드로 만든다.
 * 예보 카드가 한 장씩 열리고, 학생은 손패에서 그 조건의 요구 수치를 넘기는 카드를 낸다.
 *
 * 옆에서 아이미가 한마디를 던지는데 수치를 보면 늘 모자라다. 한마디가 아니라
 * 숫자를 보고 고르는 것이 이 차시의 판단이다.
 */

type Need = 'warm' | 'rain' | 'wind';

const NEED_LABEL: Record<Need, string> = { warm: '보온', rain: '방수', wind: '바람막이' };

interface Card {
  id: string;
  name: string;
  emoji: string;
  warm: number;
  rain: number;
  wind: number;
}

interface Turn {
  forecast: string;
  need: Need;
  amount: number;
  aimi: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  turns: Turn[];
  deck: Card[];
  hand: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'cold',
    label: '기본',
    spoken: '오늘 예보를 보고 준비물을 골라요.',
    hand: 4,
    turns: [
      { forecast: '기온 8도 · 쌀쌀합니다', need: 'warm', amount: 4, aimi: '그냥 반팔 어때요?' },
      { forecast: '비 올 확률 70퍼센트', need: 'rain', amount: 4, aimi: '우산은 없어도 될 것 같아요.' },
      { forecast: '바람이 셉니다', need: 'wind', amount: 3, aimi: '바람은 금방 그쳐요.' },
    ],
    deck: [
      { id: 'tee', name: '반팔 티', emoji: '👕', warm: 1, rain: 0, wind: 0 },
      { id: 'coat', name: '두꺼운 외투', emoji: '🧥', warm: 5, rain: 2, wind: 4 },
      { id: 'umbrella', name: '우산', emoji: '☂️', warm: 0, rain: 5, wind: 0 },
      { id: 'raincoat', name: '비옷', emoji: '🧥', warm: 2, rain: 5, wind: 3 },
      { id: 'scarf', name: '목도리', emoji: '🧣', warm: 4, rain: 0, wind: 2 },
      { id: 'cap', name: '모자', emoji: '🧢', warm: 1, rain: 1, wind: 3 },
      { id: 'sandal', name: '샌들', emoji: '🩴', warm: 0, rain: 0, wind: 0 },
      { id: 'boots', name: '장화', emoji: '👢', warm: 2, rain: 4, wind: 1 },
    ],
  },
  {
    id: 'hot',
    label: '1단계',
    spoken: '더운 날 예보를 보고 준비물을 골라요.',
    hand: 4,
    turns: [
      { forecast: '햇볕이 아주 강합니다', need: 'wind', amount: 4, aimi: '모자는 없어도 돼요.' },
      { forecast: '소나기가 옵니다', need: 'rain', amount: 5, aimi: '금방 그칠 거예요.' },
      { forecast: '저녁에는 서늘해집니다', need: 'warm', amount: 4, aimi: '집에 금방 가니까 괜찮아요.' },
    ],
    deck: [
      { id: 'tee', name: '반팔 티', emoji: '👕', warm: 1, rain: 0, wind: 1 },
      { id: 'cap', name: '챙 넓은 모자', emoji: '👒', warm: 0, rain: 1, wind: 5 },
      { id: 'umbrella', name: '우산', emoji: '☂️', warm: 0, rain: 5, wind: 0 },
      { id: 'raincoat', name: '얇은 비옷', emoji: '🧥', warm: 1, rain: 5, wind: 2 },
      { id: 'water', name: '물병', emoji: '🧴', warm: 1, rain: 0, wind: 0 },
      { id: 'coat', name: '두꺼운 외투', emoji: '🧥', warm: 5, rain: 2, wind: 4 },
      { id: 'towel', name: '수건', emoji: '🧻', warm: 2, rain: 2, wind: 0 },
      { id: 'fan', name: '휴대용 부채', emoji: '🪭', warm: 0, rain: 0, wind: 2 },
    ],
  },
  {
    id: 'mixed',
    label: '2단계',
    spoken: '변덕스러운 날 예보를 보고 준비물을 골라요.',
    hand: 5,
    turns: [
      { forecast: '아침 기온 4도', need: 'warm', amount: 5, aimi: '얇게 입어도 괜찮아요.' },
      { forecast: '낮에 비가 옵니다', need: 'rain', amount: 5, aimi: '비는 안 올 것 같아요.' },
      { forecast: '저녁에 바람이 셉니다', need: 'wind', amount: 5, aimi: '바람은 상관없어요.' },
      { forecast: '길이 젖어 미끄럽습니다', need: 'rain', amount: 4, aimi: '운동화면 충분해요.' },
      { forecast: '해가 지면 더 춥습니다', need: 'warm', amount: 4, aimi: '집에 금방 가요.' },
    ],
    deck: [
      { id: 'coat', name: '두꺼운 외투', emoji: '🧥', warm: 5, rain: 2, wind: 5 },
      { id: 'scarf', name: '목도리', emoji: '🧣', warm: 5, rain: 0, wind: 3 },
      { id: 'umbrella', name: '우산', emoji: '☂️', warm: 0, rain: 5, wind: 0 },
      { id: 'raincoat', name: '비옷', emoji: '🧥', warm: 3, rain: 5, wind: 5 },
      { id: 'boots', name: '장화', emoji: '👢', warm: 3, rain: 5, wind: 1 },
      { id: 'gloves', name: '장갑', emoji: '🧤', warm: 4, rain: 1, wind: 4 },
      { id: 'tee', name: '반팔 티', emoji: '👕', warm: 1, rain: 0, wind: 0 },
      { id: 'sandal', name: '샌들', emoji: '🩴', warm: 0, rain: 0, wind: 0 },
      { id: 'cap', name: '모자', emoji: '🧢', warm: 1, rain: 1, wind: 5 },
      { id: 'sweater', name: '스웨터', emoji: '🧶', warm: 4, rain: 0, wind: 2 },
    ],
  },
];

export default function WeatherCardGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 요구 수치와 손패 수, 허용 실패로 나타난다. 예보와 카드는 같다. */
  const needScale = clamp(tuning.tolerance, 0.75, 1.25);
  const handSize = clamp(Math.round(stage.hand * clamp(tuning.density, 0.85, 1.2)), 3, 6);
  const maxLives = tuning.lives;

  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [turn, setTurn] = useState(0);
  const [lives, setLives] = useState(maxLives);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const shuffled = shuffle(createRandom(game.seed), stage.deck);
    setHand(shuffled.slice(0, handSize));
    setDeck(shuffled.slice(handSize));
    setTurn(0);
    setLives(maxLives);
    setNote('');
    setDone(false);
  }, [game.round, game.stageIndex, stage, game.seed, handSize, maxLives]);

  const current = stage.turns[Math.min(turn, stage.turns.length - 1)];
  const required = Math.round(current.amount * needScale);

  const play = (card: Card) => {
    if (!game.playing || done) return;
    const value = card[current.need];
    const ok = value >= required;
    playSound(ok ? 'confirm' : 'select');

    setHand((prev) => {
      const rest = prev.filter((c) => c.id !== card.id);
      if (deck.length > 0) {
        const [next, ...remain] = deck;
        setDeck(remain);
        return [...rest, next];
      }
      return rest;
    });

    if (ok) {
      const nextTurn = turn + 1;
      setTurn(nextTurn);
      setNote(`${card.name}의 ${NEED_LABEL[current.need]} ${value}로 ${required}를 넘겼어요.`);
      if (nextTurn >= stage.turns.length) {
        setDone(true);
        game.succeed('공식 예보의 숫자를 보고 준비물을 골라 하루를 끝까지 넘겼어요!');
      }
      return;
    }

    const left = lives - 1;
    setLives(left);
    setNote(`${card.name}의 ${NEED_LABEL[current.need]}는 ${value}뿐이라 ${required}에 모자랍니다.`);
    if (left <= 0) {
      setDone(true);
      game.fail('예보가 바라는 수치를 넘기지 못했어요. 카드에 적힌 숫자를 보고 골라 봐요.');
    }
  };

  return (
    <MiniGameFrame
      badge="날씨 옷 카드"
      instruction="기상청 날씨 안내에 나온 기온과 강수량을 잘 확인하고, 그 조건에 딱 맞는 옷차림과 준비물 카드를 골라 보세요."
      progress={{ label: '넘긴 예보', value: Math.min(turn, stage.turns.length), max: stage.turns.length }}
      hud={<GameHud lives={lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div
          className="rounded-xl px-3 py-2"
          style={{ background: 'var(--board-surface)', border: '2px solid #38BDF8' }}
        >
          <p className="text-[17px] font-black" style={{ color: 'var(--board-ink)' }}>
            📢 공식 예보 · {current.forecast}
          </p>
          <p className="text-[16px] font-black" style={{ color: '#4ADE80' }}>
            필요한 {NEED_LABEL[current.need]} {required} 이상
          </p>
        </div>

        <p
          className="rounded-xl px-3 py-1.5 text-[15px] font-bold"
          style={{ background: 'var(--board-overlay)', border: '2px solid #C4B5FD', color: 'var(--board-ink)' }}
        >
          아이미 · {current.aimi}
        </p>

        <div className="grid min-h-0 flex-1 grid-cols-2 gap-1.5 overflow-auto sm:grid-cols-3">
          {hand.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => play(card)}
              disabled={!game.playing || done}
              className="flex min-h-[92px] flex-col items-center justify-center rounded-xl px-1 text-[14px] font-black leading-tight"
              style={{
                background: 'var(--board-surface)',
                border: `2px solid ${card[current.need] >= required ? '#4ADE80' : 'var(--board-line)'}`,
                color: 'var(--board-ink)',
              }}
            >
              <span className="text-[24px]" aria-hidden="true">{card.emoji}</span>
              <span>{card.name}</span>
              <span style={{ color: '#94A3B8' }}>보온 {card.warm} · 방수 {card.rain}</span>
              <span style={{ color: '#94A3B8' }}>바람막이 {card.wind}</span>
            </button>
          ))}
        </div>

        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
