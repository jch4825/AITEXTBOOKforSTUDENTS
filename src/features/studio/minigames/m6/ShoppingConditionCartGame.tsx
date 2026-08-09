import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m6-l1 「조건에 맞는 장보기」 — 장면 드래그 + 실시간 게이지.
 *
 * AI가 만든 초안 목록이 카트에 담긴 채로 시작한다. 학생은 물건을 선반과 카트 사이로 끌어
 * 옮기며 예산·알레르기·재고·개수 조건을 동시에 맞춘다. 조건 충족 여부는 담긴 물건들로부터
 * 매 순간 계산되고, 조건을 만족하는 조합은 여러 가지다.
 *
 * 차시가 "계산기로 합계를 확인"하도록 안내하므로 마지막 확인도 계산기 버튼으로 둔다.
 */

interface Product {
  id: string;
  emoji: string;
  name: string;
  price: number;
  allergen?: boolean;
  atHome?: boolean;
}

interface Stage {
  id: string;
  tab: string;
  name: string;
  budget: number;
  needCount: number;
  allergyLabel: string;
  products: Product[];
  /** AI 초안 — 시작할 때 카트에 들어 있는 물건 */
  draft: string[];
}

const STAGES: Stage[] = [
  {
    id: 'snack',
    tab: '기본',
    name: '간식 사기',
    budget: 5000,
    needCount: 3,
    allergyLabel: '견과류',
    products: [
      { id: 'banana', emoji: '🍌', name: '바나나', price: 1200, atHome: true },
      { id: 'nuts', emoji: '🥜', name: '견과류', price: 2000, allergen: true },
      { id: 'apple', emoji: '🍎', name: '사과', price: 1500 },
      { id: 'milk', emoji: '🥛', name: '우유', price: 1300 },
      { id: 'cookie', emoji: '🍪', name: '과자', price: 1800 },
      { id: 'juice', emoji: '🧃', name: '주스', price: 1400 },
    ],
    draft: ['banana', 'nuts', 'apple'],
  },
  {
    id: 'picnic',
    tab: '1단계',
    name: '소풍 준비물 사기',
    budget: 6000,
    needCount: 4,
    allergyLabel: '우유',
    products: [
      { id: 'milk', emoji: '🥛', name: '우유', price: 1300, allergen: true },
      { id: 'cheese', emoji: '🧀', name: '치즈', price: 1900, allergen: true },
      { id: 'water', emoji: '💧', name: '생수', price: 800 },
      { id: 'bread', emoji: '🍞', name: '빵', price: 1600 },
      { id: 'apple', emoji: '🍎', name: '사과', price: 1500 },
      { id: 'towel', emoji: '🧻', name: '물티슈', price: 1200, atHome: true },
      { id: 'egg', emoji: '🥚', name: '삶은 달걀', price: 1400 },
      { id: 'juice', emoji: '🧃', name: '주스', price: 1400 },
    ],
    draft: ['milk', 'cheese', 'towel', 'bread'],
  },
  {
    id: 'supply',
    tab: '2단계',
    name: '학용품 사기',
    budget: 5500,
    needCount: 4,
    allergyLabel: '없음',
    products: [
      { id: 'note', emoji: '📓', name: '공책', price: 1200 },
      { id: 'pencil', emoji: '✏️', name: '연필', price: 900 },
      { id: 'glue', emoji: '🧴', name: '풀', price: 1100, atHome: true },
      { id: 'color', emoji: '🖍️', name: '색연필', price: 2600 },
      { id: 'ruler', emoji: '📏', name: '자', price: 800 },
      { id: 'eraser', emoji: '🧽', name: '지우개', price: 600 },
      { id: 'scissors', emoji: '✂️', name: '가위', price: 1500, atHome: true },
      { id: 'tape', emoji: '📼', name: '테이프', price: 1000 },
    ],
    draft: ['note', 'color', 'glue', 'scissors'],
  },
];

export default function ShoppingConditionCartGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    status,
    message,
    round,
    isLocked,
    goToStage,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length });

  const stage = STAGES[stageIndex];
  const [inCart, setInCart] = useState<string[]>(stage.draft);
  const [dragId, setDragId] = useState<string | null>(null);
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const cartRef = useRef<HTMLDivElement | null>(null);
  // 끌고 있는 물건은 ref로도 들고 있는다. 상태만 쓰면 누르자마자 떼는 빠른 탭에서
  // pointerup 핸들러가 아직 갱신 전 값을 읽어 조작이 사라진다.
  const dragIdRef = useRef<string | null>(null);

  useEffect(() => {
    setInCart(STAGES[stageIndex].draft);
    dragIdRef.current = null;
    setDragId(null);
    setGhost(null);
  }, [round, stageIndex]);

  const productById = (id: string) => stage.products.find((p) => p.id === id)!;
  const cartItems = inCart.map(productById);
  const total = cartItems.reduce((sum, p) => sum + p.price, 0);

  const checks = [
    { key: 'count', label: `${stage.needCount}개 담기`, ok: cartItems.length === stage.needCount },
    { key: 'budget', label: `${stage.budget.toLocaleString()}원 이내`, ok: total <= stage.budget },
    {
      key: 'allergy',
      label: `${stage.allergyLabel} 빼기`,
      ok: !cartItems.some((p) => p.allergen),
    },
    { key: 'home', label: '집에 있는 것 빼기', ok: !cartItems.some((p) => p.atHome) },
  ];
  const allOk = checks.every((c) => c.ok);

  const setLocation = (id: string, toCart: boolean) => {
    if (status !== 'playing') return;
    setInCart((prev) => {
      const has = prev.includes(id);
      if (toCart && !has) return [...prev, id];
      if (!toCart && has) return prev.filter((x) => x !== id);
      return prev;
    });
  };

  const handlePointerDown = (id: string) => (e: any) => {
    if (status !== 'playing') return;
    dragIdRef.current = id;
    setDragId(id);
    startPos.current = { x: e.clientX, y: e.clientY };
    setGhost({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: any) => {
    if (!dragIdRef.current) return;
    setGhost({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: any) => {
    const activeId = dragIdRef.current;
    if (!activeId) return;
    const start = startPos.current;
    const moved =
      start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8;

    if (moved) {
      const rect = cartRef.current?.getBoundingClientRect();
      const overCart =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      setLocation(activeId, !!overCart);
    } else {
      // 끌지 않고 톡 누르면 자리를 바꿔 준다 — 끌기가 어려운 학생을 위한 대안 조작.
      setLocation(activeId, !inCart.includes(activeId));
    }

    dragIdRef.current = null;
    setDragId(null);
    setGhost(null);
    startPos.current = null;
  };

  const handleCheck = () => {
    if (allOk) {
      succeed(`합계 ${total.toLocaleString()}원, 조건을 모두 맞췄어요!`);
    } else {
      const first = checks.find((c) => !c.ok);
      fail(`${first?.label} 조건이 아직 안 맞아요.`);
    }
  };

  const dragged = dragId ? productById(dragId) : null;

  const renderChip = (p: Product, inCartNow: boolean) => (
    <button
      key={p.id}
      type="button"
      disabled={isLocked}
      onPointerDown={handlePointerDown(p.id)}
      style={{ touchAction: 'none' }}
      aria-label={`${p.name} ${p.price}원${inCartNow ? ', 카트에 있음' : ''}`}
      className={`flex min-h-11 items-center gap-1 rounded-lg border-2 px-1.5 py-1 text-left transition ${
        dragId === p.id ? 'opacity-40' : ''
      } ${
        inCartNow
          ? 'border-emerald-400/70 bg-emerald-500/20'
          : 'border-slate-600/60 bg-slate-800/80'
      }`}
    >
      <span className="text-base leading-none">{p.emoji}</span>
      <span className="flex flex-col leading-tight">
        <span className="text-[14px] font-bold text-slate-100">
          {p.name}
          {p.allergen && <span className="ml-0.5 text-pink-300">⚠</span>}
          {p.atHome && <span className="ml-0.5 text-amber-300">🏠</span>}
        </span>
        <span className="text-[14px] font-bold text-slate-400">
          {p.price.toLocaleString()}원
        </span>
      </span>
    </button>
  );

  return (
    <MiniGameFrame
      badge="조건 맞춰 장보기"
      instruction="AI가 만든 목록이 이미 카트에 담겨 있어요. 물건을 끌어(또는 눌러) 카트에 넣고 빼면서 아래 조건 네 가지를 모두 맞춘 뒤 계산기로 확인해요."
      accent="var(--ok)"
      progress={{ label: '맞은 조건', value: checks.filter((c) => c.ok).length, max: 4 }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].name)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="처음으로" />
          <MiniGameButton
            onClick={handleCheck}
            disabled={isLocked}
            emoji="🧮"
            label="계산기로 확인"
            variant="primary"
          />
        </>
      }
    >
      <div
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex min-h-0 flex-1 flex-col gap-2"
      >
        {/* 예산 게이지 — 담을 때마다 즉시 움직인다 */}
        <div>
          <div className="mb-1 flex items-baseline justify-between text-[14px] font-black">
            <span className="text-slate-300">합계</span>
            <span className={total > stage.budget ? 'text-rose-300' : 'text-emerald-300'}>
              {total.toLocaleString()} / {stage.budget.toLocaleString()}원
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (total / stage.budget) * 100)}%`,
                background: total > stage.budget ? '#fb7185' : '#34d399',
              }}
            />
          </div>
        </div>

        {/* 선반 */}
        <div>
          <p className="mb-1 text-[14px] font-black text-slate-400">🏪 가게 선반</p>
          <div className="grid grid-cols-2 gap-1.5">
            {stage.products
              .filter((p) => !inCart.includes(p.id))
              .map((p) => renderChip(p, false))}
          </div>
        </div>

        {/* 카트 */}
        <div
          ref={cartRef}
          className={`flex-1 rounded-xl border-2 border-dashed p-2 transition ${
            dragId ? 'border-emerald-300 bg-emerald-500/10' : 'border-slate-500/60 bg-slate-900/50'
          }`}
        >
          <p className="mb-1 text-[14px] font-black text-slate-300">
            🛒 내 카트 ({cartItems.length}/{stage.needCount})
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {cartItems.map((p) => renderChip(p, true))}
          </div>
          {cartItems.length === 0 && (
            <p className="py-3 text-center text-[14px] font-bold text-slate-500">
              여기로 끌어다 놓아요
            </p>
          )}
        </div>

        {/* 조건 표 */}
        <div className="grid grid-cols-2 gap-1">
          {checks.map((c) => (
            <div
              key={c.key}
              className={`flex items-center gap-1 rounded-md px-1.5 py-1 text-[14px] font-bold ${
                c.ok ? 'bg-emerald-500/20 text-emerald-200' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <span aria-hidden="true">{c.ok ? '✅' : '⬜'}</span>
              {c.label}
            </div>
          ))}
        </div>
      </div>

      {/* 끌고 있는 물건이 손가락을 따라온다 */}
      {dragged && ghost && (
        <div
          className="pointer-events-none fixed z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-lg border-2 border-emerald-300 bg-slate-900 px-2 py-1 depth-overlay"
          style={{ left: ghost.x, top: ghost.y }}
        >
          <span className="text-base leading-none">{dragged.emoji}</span>
          <span className="text-[14px] font-black text-slate-100">{dragged.name}</span>
        </div>
      )}
    </MiniGameFrame>
  );
}
