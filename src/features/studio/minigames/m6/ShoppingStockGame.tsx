import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, useCountdown } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m6-l1 · 조건 맞춰 담기 (장르 46 · 매장 재고 관리)
 *
 * "재고·가격·예산·알레르기와 견주어 목록을 고친다"를 진열대에서 담기로 만든다.
 * 아이미의 목록이 처음부터 카트에 들어 있고, 그중에는 품절이거나 알레르기가 있거나
 * 예산을 넘기는 것이 섞여 있다.
 *
 * 담는 것뿐 아니라 **빼는 것**이 조작이다. 조건에 맞을 때까지 카트를 고친다.
 */

interface Item {
  id: string;
  name: string;
  emoji: string;
  price: number;
  stock: number;
  allergen: string | null;
  kind: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  budget: number;
  avoid: string;
  needKinds: string[];
  items: Item[];
  aimiCart: string[];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'snack',
    label: '기본',
    spoken: '간식 목록을 조건에 맞게 고쳐요.',
    budget: 8000,
    avoid: '우유',
    needKinds: ['음료', '과자', '과일'],
    seconds: 120,
    items: [
      { id: 'milk', name: '우유', emoji: '🥛', price: 1200, stock: 4, allergen: '우유', kind: '음료' },
      { id: 'juice', name: '오렌지 주스', emoji: '🧃', price: 1800, stock: 3, allergen: null, kind: '음료' },
      { id: 'water', name: '생수', emoji: '💧', price: 800, stock: 9, allergen: null, kind: '음료' },
      { id: 'cheese', name: '치즈 과자', emoji: '🧀', price: 2200, stock: 2, allergen: '우유', kind: '과자' },
      { id: 'cracker', name: '쌀 과자', emoji: '🍘', price: 1500, stock: 5, allergen: null, kind: '과자' },
      { id: 'cookie', name: '초코 쿠키', emoji: '🍪', price: 3900, stock: 0, allergen: '우유', kind: '과자' },
      { id: 'apple', name: '사과', emoji: '🍎', price: 1600, stock: 6, allergen: null, kind: '과일' },
      { id: 'banana', name: '바나나', emoji: '🍌', price: 2600, stock: 0, allergen: null, kind: '과일' },
    ],
    aimiCart: ['milk', 'cookie', 'banana'],
  },
  {
    id: 'party',
    label: '1단계',
    spoken: '잔치 목록을 조건에 맞게 고쳐요.',
    budget: 12000,
    avoid: '땅콩',
    needKinds: ['음료', '빵', '과일', '접시'],
    seconds: 110,
    items: [
      { id: 'cola', name: '탄산음료', emoji: '🥤', price: 2400, stock: 5, allergen: null, kind: '음료' },
      { id: 'tea', name: '보리차', emoji: '🍵', price: 1500, stock: 6, allergen: null, kind: '음료' },
      { id: 'nutbread', name: '땅콩 빵', emoji: '🥜', price: 3200, stock: 3, allergen: '땅콩', kind: '빵' },
      { id: 'plainbread', name: '식빵', emoji: '🍞', price: 2600, stock: 4, allergen: null, kind: '빵' },
      { id: 'grape', name: '포도', emoji: '🍇', price: 4200, stock: 2, allergen: null, kind: '과일' },
      { id: 'pear', name: '배', emoji: '🍐', price: 2800, stock: 0, allergen: null, kind: '과일' },
      { id: 'plate', name: '종이 접시', emoji: '🍽️', price: 1800, stock: 7, allergen: null, kind: '접시' },
      { id: 'goldplate', name: '고급 접시', emoji: '🏵️', price: 6500, stock: 2, allergen: null, kind: '접시' },
    ],
    aimiCart: ['nutbread', 'pear', 'goldplate', 'cola'],
  },
  {
    id: 'trip',
    label: '2단계',
    spoken: '나들이 목록을 조건에 맞게 고쳐요.',
    budget: 15000,
    avoid: '새우',
    needKinds: ['음료', '주먹밥', '과일', '물티슈', '봉지'],
    seconds: 100,
    items: [
      { id: 'water', name: '생수', emoji: '💧', price: 900, stock: 9, allergen: null, kind: '음료' },
      { id: 'sport', name: '이온 음료', emoji: '🥤', price: 2100, stock: 4, allergen: null, kind: '음료' },
      { id: 'shrimp', name: '새우 주먹밥', emoji: '🍙', price: 3400, stock: 3, allergen: '새우', kind: '주먹밥' },
      { id: 'tuna', name: '참치 주먹밥', emoji: '🍙', price: 3100, stock: 5, allergen: null, kind: '주먹밥' },
      { id: 'melon', name: '멜론', emoji: '🍈', price: 7800, stock: 1, allergen: null, kind: '과일' },
      { id: 'orange', name: '귤', emoji: '🍊', price: 2400, stock: 6, allergen: null, kind: '과일' },
      { id: 'wipe', name: '물티슈', emoji: '🧻', price: 1700, stock: 5, allergen: null, kind: '물티슈' },
      { id: 'bag', name: '쓰레기 봉지', emoji: '🛍️', price: 1200, stock: 8, allergen: null, kind: '봉지' },
      { id: 'soldout', name: '샌드위치', emoji: '🥪', price: 3600, stock: 0, allergen: null, kind: '주먹밥' },
    ],
    aimiCart: ['shrimp', 'melon', 'soldout', 'sport', 'wipe'],
  },
];

export default function ShoppingStockGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시간·기회·예산 여유로 나타난다. 조건과 진열대는 셋 모두 같다. */
  const seconds = Math.round(stage.seconds * tuning.time);
  const maxLives = tuning.lives;
  const budget = Math.round(stage.budget * clamp(tuning.tolerance, 0.9, 1.15));

  const [cart, setCart] = useState<string[]>(stage.aimiCart);
  const [lives, setLives] = useState(maxLives);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setCart(stage.aimiCart);
    setLives(maxLives);
    setNote('');
    setDone(false);
  }, [game.round, game.stageIndex, stage, maxLives]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    if (!done) game.fail('시간이 지났어요. 알레르기와 품절부터 빼고 예산에 맞춰 봐요.');
  });

  const itemById = (id: string) => stage.items.find((item) => item.id === id) as Item;
  const total = cart.reduce((sum, id) => sum + itemById(id).price, 0);

  const problems = () => {
    const list: string[] = [];
    for (const id of cart) {
      const item = itemById(id);
      if (item.allergen === stage.avoid) list.push(`${item.name}에는 ${stage.avoid}가 들어 있습니다`);
      if (item.stock === 0) list.push(`${item.name}은 품절입니다`);
    }
    if (total > budget) list.push(`예산보다 ${(total - budget).toLocaleString()}원 많습니다`);
    for (const kind of stage.needKinds) {
      if (!cart.some((id) => itemById(id).kind === kind)) list.push(`${kind}가 빠졌습니다`);
    }
    return list;
  };

  const toggle = (item: Item) => {
    if (!game.playing || done) return;
    if (cart.includes(item.id)) {
      playSound('select');
      setCart((prev) => prev.filter((id) => id !== item.id));
      setNote(`${item.name}을 뺐어요.`);
      return;
    }
    if (item.stock === 0) {
      setNote(`${item.name}은 품절이라 담을 수 없어요. 같은 종류의 다른 것을 찾아보세요.`);
      return;
    }
    playSound('select');
    setCart((prev) => [...prev, item.id]);
    if (item.allergen === stage.avoid) {
      setNote(`${item.name}에는 ${stage.avoid}가 들어 있어요. 다시 확인해 보세요.`);
    } else {
      setNote(`${item.name}을 담았어요.`);
    }
  };

  const check = () => {
    if (!game.playing || done) return;
    const list = problems();
    if (list.length === 0) {
      setDone(true);
      game.succeed('알레르기와 품절을 빼고 예산 안에서 필요한 종류를 모두 담았어요!');
      return;
    }
    const left = lives - 1;
    setLives(left);
    setNote(`아직 고칠 것이 있어요 · ${list[0]}`);
    if (left <= 0) {
      setDone(true);
      game.fail('조건에 맞지 않는 목록이었어요. 알레르기와 품절을 먼저 빼고 예산을 맞춰 봐요.');
    }
  };

  const over = total > budget;

  return (
    <MiniGameFrame
      badge="조건 맞춰 담기"
      instruction={`장바구니 목록을 살펴보며 알레르기가 있는 ${stage.avoid}와 다 팔린 물건을 빼고, 정해진 금액(${budget.toLocaleString()}원) 안에서 필요한 물건을 골라 담아 보세요.`}
      progress={{
        label: '갖춘 종류',
        value: stage.needKinds.filter((kind) => cart.some((id) => itemById(id).kind === kind)).length,
        max: stage.needKinds.length,
      }}
      hud={<GameHud lives={lives} maxLives={maxLives} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="처음 목록으로" />
          <MiniGameButton onClick={check} disabled={!game.playing} emoji="🧾" label="계산대로 가기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="rounded-lg px-2 py-1 text-[15px] font-black"
            style={{ background: 'var(--board-surface)', border: '2px solid #FB7185', color: 'var(--board-ink)' }}
          >
            ⚠️ {stage.avoid} 알레르기
          </span>
          <span
            className="rounded-lg px-2 py-1 text-[15px] font-black"
            style={{
              background: over ? 'rgba(251, 113, 133, 0.2)' : 'var(--board-surface)',
              border: `2px solid ${over ? '#FB7185' : '#4ADE80'}`,
              color: 'var(--board-ink)',
            }}
          >
            💰 {total.toLocaleString()} / {budget.toLocaleString()}원
          </span>
          <span className="text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
            필요한 종류 · {stage.needKinds.join(', ')}
          </span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-3 gap-1.5 overflow-auto sm:grid-cols-4">
          {stage.items.map((item) => {
            const inCart = cart.includes(item.id);
            const soldOut = item.stock === 0;
            const bad = item.allergen === stage.avoid;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item)}
                disabled={!game.playing || done}
                className="flex min-h-[86px] flex-col items-center justify-center rounded-xl px-1 py-1 text-[14px] font-black leading-tight transition"
                style={{
                  background: inCart ? 'rgba(56, 189, 248, 0.18)' : 'var(--board-surface)',
                  border: `2px solid ${inCart ? '#38BDF8' : soldOut ? '#4B5563' : bad ? '#FB7185' : 'var(--board-line)'}`,
                  color: 'var(--board-ink)',
                  opacity: soldOut ? 0.6 : 1,
                }}
              >
                <span className="text-[22px]" aria-hidden="true">{item.emoji}</span>
                <span>{item.name}</span>
                <span style={{ color: '#94A3B8' }}>{item.price.toLocaleString()}원</span>
                <span style={{ color: soldOut ? '#FB7185' : '#94A3B8' }}>
                  {soldOut ? '품절' : `남은 수 ${item.stock}`}{bad ? ` · ${item.allergen}` : ''}
                </span>
                {inCart && <span aria-hidden="true">🛒 담김</span>}
              </button>
            );
          })}
        </div>

        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
          {note || '담긴 것을 다시 누르면 뺍니다.'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
