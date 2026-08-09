import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

type JudgmentLane = 'fact' | 'ai-judgment' | 'human-decision';

interface JudgmentCard {
  id: string;
  emoji: string;
  text: string;
  lane: JudgmentLane;
  reason: string;
}

const LANES: Array<{
  id: JudgmentLane;
  label: '사실 확인' | 'AI의 1차 판단' | '사람의 최종 판단';
  shortLabel: string;
  owner: string;
  scene: string;
  emoji: string;
  color: string;
  background: string;
}> = [
  {
    id: 'fact',
    label: '사실 확인',
    shortLabel: '공식 근거로 다시 보기',
    owner: '공식 기록과 자료',
    scene: '게시판·문서를 열어 표시를 맞춰 봐요.',
    emoji: '📌',
    color: '#7dd3fc',
    background: '#082f49',
  },
  {
    id: 'ai-judgment',
    label: 'AI의 1차 판단',
    shortLabel: 'AI가 먼저, 사람이 검토',
    owner: 'AI가 먼저 고르고 사람 검토',
    scene: 'AI 카드가 놓인 뒤 원문과 비교해요.',
    emoji: '🤖',
    color: '#fcd34d',
    background: '#451a03',
  },
  {
    id: 'human-decision',
    label: '사람의 최종 판단',
    shortLabel: '사람이 결정하고 책임',
    owner: '보호자·교사·담당자',
    scene: '사람이 상황을 살펴 최종 결정을 해요.',
    emoji: '🧑',
    color: '#86efac',
    background: '#052e16',
  },
];

const STAGES: Array<{
  id: string;
  label: string;
  name: string;
  cards: JudgmentCard[];
}> = [
  {
    id: 'event',
    label: '기본',
    name: '체험회 카드',
    cards: [
      {
        id: 'event-time',
        emoji: '🏛️',
        text: '학교 공식 게시판에 “체험회는 오후 2시 시작”이라고 적혀 있어요.',
        lane: 'fact',
        reason: '공식 기록으로 참인지 확인하는 사실이에요.',
      },
      {
        id: 'event-summary',
        emoji: '📝',
        text: '긴 체험회 안내문에서 중요한 문장을 먼저 골라요.',
        lane: 'ai-judgment',
        reason: 'AI가 먼저 요약해도 사람이 원문과 비교해 바로 고칠 수 있어요.',
      },
      {
        id: 'medicine-choice',
        emoji: '💊',
        text: '아픈 학생이 지금 이 약을 먹어도 되는지 정해요.',
        lane: 'human-decision',
        reason: '건강과 책임이 걸린 결정은 보호자나 전문가와 해야 해요.',
      },
    ],
  },
  {
    id: 'box-and-heart',
    label: '1단계',
    name: '상자와 마음 카드',
    cards: [
      {
        id: 'box-weight',
        emoji: '📦',
        text: '상자 겉면에 무게가 8kg이라고 표시되어 있어요.',
        lane: 'fact',
        reason: '상자에 적힌 표시를 근거로 확인하는 사실이에요.',
      },
      {
        id: 'box-sort',
        emoji: '🗂️',
        text: '상자 사진을 보고 작은 상자와 큰 상자로 먼저 나눠요.',
        lane: 'ai-judgment',
        reason: '기준이 분명하고 사람이 결과를 다시 확인할 수 있는 1차 판단이에요.',
      },
      {
        id: 'friend-help',
        emoji: '💗',
        text: '속상한 친구에게 지금 어떤 말을 할지 정해요.',
        lane: 'human-decision',
        reason: '친구의 마음과 관계에 영향을 주므로 사람이 직접 결정해야 해요.',
      },
    ],
  },
  {
    id: 'rain',
    label: '2단계',
    name: '비 오는 날 카드',
    cards: [
      {
        id: 'rain-percent',
        emoji: '🌧️',
        text: '공식 일기예보에 비 올 확률이 70%라고 나와요.',
        lane: 'fact',
        reason: '공식 자료에 기록된 내용을 확인하는 사실이에요.',
      },
      {
        id: 'rain-plan',
        emoji: '☂️',
        text: '비 오는 날 필요한 준비물과 실내 활동을 추천해요.',
        lane: 'ai-judgment',
        reason: 'AI가 먼저 제안하고 사람이 상황에 맞게 고칠 수 있어요.',
      },
      {
        id: 'cancel-event',
        emoji: '🧑‍🏫',
        text: '안전과 현장 상황을 보고 체험회를 열지 정해요.',
        lane: 'human-decision',
        reason: '안전과 책임이 걸린 최종 결정은 담당 사람이 해야 해요.',
      },
    ],
  },
];

export default function HumanHandoffStampGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    hintAllowed,
    status,
    message,
    round,
    goToStage,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({
    supportLevel,
    stageCount: STAGES.length,
    // 틀린 카드를 어디에 놓았는지 읽고 다시 분류할 시간을 보장한다.
    autoResetOnFailMs: 0,
  });
  const stage = STAGES[stageIndex];
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [sortedCards, setSortedCards] = useState<JudgmentCard[]>([]);

  useEffect(() => {
    setSelectedCardId(null);
    setSortedCards([]);
  }, [round, stageIndex]);

  const availableCards = stage.cards.filter((card) => !sortedCards.some((sorted) => sorted.id === card.id));
  const selectedCard = stage.cards.find((card) => card.id === selectedCardId);

  const chooseCard = (card: JudgmentCard) => {
    if (status !== 'playing') return;
    setSelectedCardId(card.id);
  };

  const placeCard = (lane: JudgmentLane) => {
    if (status !== 'playing' || !selectedCard) return;
    if (selectedCard.lane !== lane) {
      const correctLane = LANES.find((item) => item.id === selectedCard.lane);
      fail(`${correctLane?.label ?? '알맞은 범주'} 칸이에요. ${selectedCard.reason}`);
      return;
    }

    const nextSorted = [...sortedCards, selectedCard];
    setSortedCards(nextSorted);
    setSelectedCardId(null);
    if (nextSorted.length === stage.cards.length) {
      succeed('카드를 세 갈래 칸에 모두 놓았어요. 사실은 확인하고, AI 판단은 검토하고, 중요한 결정은 사람이 책임져요!');
    }
  };

  const cardsForLane = (lane: JudgmentLane) => sortedCards.filter((card) => card.lane === lane);

  return (
    <MiniGameFrame
      badge="세 갈래 책임 레일"
      instruction="카드 하나를 눌러 잡은 뒤, 알맞은 칸을 눌러 놓으세요. 카드가 놓인 자리가 판단의 책임을 보여 줍니다."
      progress={{ label: '분류한 카드', value: sortedCards.length, max: stage.cards.length }}
      stages={STAGES.slice(0, visibleStageCount)}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].name)}
      status={status}
      message={message}
      actions={
        status === 'success' || status === 'fail' ? (
          <MiniGameButton onClick={retry} emoji="🔁" label="다시 분류하기" />
        ) : undefined
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        <section className="rounded-xl border-2 border-amber-300/60 bg-amber-950/45 p-2.5" aria-label="분류할 카드 더미">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-black text-amber-100">카드 더미</h3>
            <span className="text-[14px] font-bold text-amber-200">{availableCards.length}장 남음</span>
          </div>
          <div className="grid gap-1.5">
            {availableCards.length > 0 ? availableCards.map((card) => {
              const selected = selectedCardId === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => chooseCard(card)}
                  disabled={status !== 'playing'}
                  aria-pressed={selected}
                  className="flex min-h-16 items-center gap-2 rounded-xl border-2 px-3 py-2 text-left text-white transition disabled:opacity-50"
                  style={{
                    borderColor: selected ? '#fbbf24' : 'rgba(148,163,184,0.55)',
                    background: selected ? 'rgba(146,64,14,0.85)' : 'rgba(30,41,59,0.9)',
                    boxShadow: selected ? '0 0 0 2px rgba(251,191,36,0.35)' : 'none',
                  }}
                >
                  <span className="text-[28px]" aria-hidden="true">{card.emoji}</span>
                  <span className="flex-1 text-[15px] font-black leading-relaxed">{card.text}</span>
                  <span className="text-[14px] font-black text-amber-200">{selected ? '잡았어요' : '잡기'}</span>
                </button>
              );
            }) : (
              <p className="rounded-lg border border-emerald-300/50 bg-emerald-950/60 px-2 py-2 text-center text-[15px] font-black text-emerald-100">
                카드 더미를 모두 비웠어요.
              </p>
            )}
          </div>
          {selectedCard && hintAllowed && (
            <p className="mt-1.5 text-[14px] font-bold leading-relaxed text-amber-200">
              힌트: 근거로 다시 볼까요, AI가 먼저 골라도 될까요, 사람이 책임져야 할까요?
            </p>
          )}
        </section>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-3" role="group" aria-label="카드를 놓을 세 가지 판단 칸">
          {LANES.map((lane) => {
            const laneCards = cardsForLane(lane.id);
            const canPlace = Boolean(selectedCard) && status === 'playing';
            return (
              <section
                key={lane.id}
                className="flex min-h-28 flex-col gap-1.5 rounded-xl border-2 p-2 transition-colors"
                style={{ borderColor: lane.color, background: lane.background }}
                aria-label={`${lane.label} 칸`}
              >
                <div className="flex items-center gap-1.5" style={{ color: lane.color }}>
                  <span className="text-[23px]" aria-hidden="true">{lane.emoji}</span>
                  <div>
                    <h3 className="text-[14px] font-black leading-tight">{lane.label}</h3>
                    <p className="text-[14px] font-bold leading-tight">{lane.shortLabel}</p>
                  </div>
                </div>
                <div className="rounded-md border border-white/15 bg-slate-950/35 px-1.5 py-1 text-[14px] font-bold leading-tight text-slate-200">
                  <span className="block">담당: {lane.owner}</span>
                  <span className="block text-slate-300">장면: {lane.scene}</span>
                </div>
                <button
                  type="button"
                  onClick={() => placeCard(lane.id)}
                  disabled={!canPlace}
                  aria-label={selectedCard ? `${lane.label}에 ${selectedCard.text} 놓기` : `${lane.label} 칸`}
                  className="min-h-14 rounded-lg border-2 border-dashed px-2 py-1 text-[14px] font-black text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ borderColor: canPlace ? lane.color : 'rgba(148,163,184,0.45)' }}
                >
                  {canPlace ? `${lane.emoji} 여기에 놓기` : '카드를 먼저 눌러 잡기'}
                </button>
                <div className="relative flex flex-1 flex-col gap-1 border-l-2 border-dashed border-white/20 pl-1.5" aria-live="polite">
                  {laneCards.map((card) => (
                    <div
                      key={card.id}
                      className="rounded-lg border px-2 py-1 text-[14px] font-black leading-tight text-white"
                      style={{ borderColor: lane.color, background: 'rgba(15,23,42,0.6)' }}
                    >
                      {card.emoji} {card.text}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="rounded-xl border-2 border-slate-500/60 bg-slate-900/70 px-3 py-2 text-center">
          <p className="text-[14px] font-black text-slate-400">지금 하는 일</p>
          <p className="text-[15px] font-black text-white">
            {status === 'success'
              ? '세 갈래 책임 지도를 완성했어요.'
              : selectedCard
                ? '잡은 카드를 알맞은 판단 칸에 놓아 보세요.'
                : '카드 하나를 눌러 잡아 보세요.'}
          </p>
        </div>
      </div>
    </MiniGameFrame>
  );
}
