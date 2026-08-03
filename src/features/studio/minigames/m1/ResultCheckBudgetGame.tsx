import React, { useEffect, useMemo, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

interface Card {
  id: string;
  emoji: string;
  label: string;
  note: string;
  scene: string;
  risk: 'low' | 'high';
}

interface Stage {
  id: string;
  tab: string;
  name: string;
  cards: Card[];
}

const STAGES: Stage[] = [
  {
    id: 's1', tab: '기본', name: '결과 3개 확인하기', cards: [
      { id: 'song', emoji: '🎵', label: '추천 곡 목록', note: '공식 목록과 맞나?', scene: '음악 목록 출처를 게시판과 대조해요.', risk: 'low' },
      { id: 'time', emoji: '🕐', label: '행사 시간', note: '확인 안 된 정보!', scene: '행사 담당자에게 시간을 다시 물어봐요.', risk: 'high' },
      { id: 'title', emoji: '📝', label: '안내 문구 제목', note: '가볍게 훑기', scene: '제목과 본문 뜻이 맞는지 살펴봐요.', risk: 'low' },
    ],
  },
  {
    id: 's2', tab: '1단계', name: '결과 4개 확인하기', cards: [
      { id: 'song', emoji: '🎵', label: '추천 곡 목록', note: '공식 목록과 맞나?', scene: '음악 목록 출처를 게시판과 대조해요.', risk: 'low' },
      { id: 'time', emoji: '🕐', label: '행사 시간', note: '확인 안 된 정보!', scene: '행사 담당자에게 시간을 다시 물어봐요.', risk: 'high' },
      { id: 'title', emoji: '📝', label: '안내 문구 제목', note: '가볍게 훑기', scene: '제목과 본문 뜻이 맞는지 살펴봐요.', risk: 'low' },
      { id: 'place', emoji: '📍', label: '행사 장소', note: '바뀌었을 수 있음', scene: '현장 안내판과 장소를 대조해요.', risk: 'high' },
    ],
  },
  {
    id: 's3', tab: '2단계', name: '결과 5개 확인하기', cards: [
      { id: 'song', emoji: '🎵', label: '추천 곡 목록', note: '공식 목록과 맞나?', scene: '음악 목록 출처를 게시판과 대조해요.', risk: 'low' },
      { id: 'time', emoji: '🕐', label: '행사 시간', note: '확인 안 된 정보!', scene: '행사 담당자에게 시간을 다시 물어봐요.', risk: 'high' },
      { id: 'title', emoji: '📝', label: '안내 문구 제목', note: '가볍게 훑기', scene: '제목과 본문 뜻이 맞는지 살펴봐요.', risk: 'low' },
      { id: 'place', emoji: '📍', label: '행사 장소', note: '바뀌었을 수 있음', scene: '현장 안내판과 장소를 대조해요.', risk: 'high' },
      { id: 'who', emoji: '🙋', label: '담당 선생님 이름', note: '사람에게 확인', scene: '담당 선생님에게 직접 확인해요.', risk: 'high' },
    ],
  },
];

export default function ResultCheckBudgetGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const stage = STAGES[game.stageIndex];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openedIds, setOpenedIds] = useState<string[]>([]);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  useEffect(() => { setSelectedId(null); setOpenedIds([]); setCheckedIds([]); }, [game.round, game.stageIndex]);

  const selected = useMemo(() => stage.cards.find((card) => card.id === selectedId), [stage.cards, selectedId]);
  const review = () => {
    if (game.status !== 'playing' || !selected) return;
    if (!openedIds.includes(selected.id)) {
      setOpenedIds((ids) => [...ids, selected.id]);
      return;
    }
    const next = checkedIds.includes(selected.id) ? checkedIds : [...checkedIds, selected.id];
    setCheckedIds(next);
    if (next.length === stage.cards.length) game.succeed('결과 카드를 모두 열어 보고 사람이 확인 도장을 찍었어요!');
    setSelectedId(null);
  };

  const handleHint = () => setSelectedId(stage.cards.find((card) => !checkedIds.includes(card.id))?.id ?? null);
  const selectedOpened = Boolean(selected && openedIds.includes(selected.id));

  return (
    <MiniGameFrame
      badge="확인하고 내보내기"
      instruction="기다리는 결과 카드를 하나 골라 자료를 열고, 장면을 확인한 뒤 사람 확인 도장을 찍으세요. 오래 기다리는 숫자 대신 카드와 실제 확인 장면으로 판단합니다."
      accent="var(--brand-ink)"
      progress={{ label: '확인 도장을 찍은 결과', value: checkedIds.length, max: stage.cards.length }}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].name)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 확인하기" />
          {game.hintAllowed && <MiniGameButton onClick={handleHint} disabled={game.isLocked} emoji="💡" label="다음 카드 힌트" />}
          <MiniGameButton onClick={review} disabled={!selected || game.status !== 'playing'} emoji={selectedOpened ? '✅' : '🔍'} label={selectedOpened ? '확인 도장 찍기' : '자료 열어 보기'} variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        <section className="rounded-xl border-2 border-amber-300/60 bg-amber-950/45 p-2.5" aria-label="검토실 장면">
          <p className="text-[14px] font-black text-amber-200">🔍 검토실</p>
          <p className="text-[15px] font-black text-white">{selected ? selected.scene : '결과 카드를 고르면 확인할 자료 장면이 열려요.'}</p>
          <p className="mt-1 text-[13px] font-bold text-amber-100">빨간 표시가 있는 카드는 사람에게 꼭 다시 물어봐요.</p>
        </section>

        <section className="grid flex-1 gap-1.5 sm:grid-cols-2" aria-label="확인할 결과 카드">
          {stage.cards.map((card) => {
            const selectedCard = selectedId === card.id;
            const checked = checkedIds.includes(card.id);
            const opened = openedIds.includes(card.id);
            return <button key={card.id} type="button" aria-pressed={selectedCard} disabled={checked || game.status !== 'playing'} onClick={() => setSelectedId(card.id)} className="flex min-h-16 items-center gap-2 rounded-xl border-2 px-2 text-left text-white transition disabled:opacity-50" style={{ borderColor: selectedCard ? '#fbbf24' : checked ? '#86efac' : card.risk === 'high' ? '#fb7185' : 'rgba(148,163,184,0.5)', background: checked ? 'rgba(22,101,52,0.6)' : selectedCard ? 'rgba(146,64,14,0.78)' : 'rgba(15,23,42,0.65)' }}><span className="text-2xl" aria-hidden="true">{card.emoji}</span><span className="flex-1"><strong className="block text-[14px] font-black">{card.label}</strong><span className="text-[12px] font-bold text-slate-300">{checked ? '사람 확인 완료' : opened ? card.note : '자료를 열어 보기'}</span></span><span className="text-[13px] font-black text-amber-200">{checked ? '✅' : selectedCard ? '선택됨' : '고르기'}</span></button>;
          })}
        </section>

        <div className="rounded-xl border-2 border-emerald-300/60 bg-emerald-950/55 px-3 py-2 text-center" aria-live="polite">
          <p className="text-[14px] font-black text-emerald-200">내보내기 장면</p>
          <p className="text-[15px] font-black text-white">{checkedIds.length === stage.cards.length ? '📤 확인 도장이 모두 찍혀 안전하게 내보낼 수 있어요.' : `${checkedIds.length}장의 결과가 확인 도장을 기다리고 있어요.`}</p>
        </div>
      </div>
    </MiniGameFrame>
  );
}
