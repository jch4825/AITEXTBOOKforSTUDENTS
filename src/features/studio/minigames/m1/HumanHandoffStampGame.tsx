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
  emoji: string;
  color: string;
  background: string;
}> = [
  {
    id: 'fact',
    label: '사실 확인',
    shortLabel: '근거로 확인',
    emoji: '📌',
    color: '#7dd3fc',
    background: '#082f49',
  },
  {
    id: 'ai-judgment',
    label: 'AI의 1차 판단',
    shortLabel: 'AI가 먼저, 사람이 검토',
    emoji: '🤖',
    color: '#fcd34d',
    background: '#451a03',
  },
  {
    id: 'human-decision',
    label: '사람의 최종 판단',
    shortLabel: '사람이 결정하고 책임',
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
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[stageIndex];
  const [cardIndex, setCardIndex] = useState(0);
  const [sortedCards, setSortedCards] = useState<JudgmentCard[]>([]);

  useEffect(() => {
    setCardIndex(0);
    setSortedCards([]);
  }, [round, stageIndex]);

  const card = stage.cards[cardIndex];

  const chooseLane = (lane: JudgmentLane) => {
    if (status !== 'playing' || !card) return;
    if (card.lane !== lane) {
      const correctLane = LANES.find((item) => item.id === card.lane);
      fail(`${correctLane?.label ?? '알맞은 범주'}예요. ${card.reason}`);
      return;
    }

    const nextSorted = [...sortedCards, card];
    setSortedCards(nextSorted);
    if (cardIndex === stage.cards.length - 1) {
      succeed('사실은 확인하고, AI 판단은 검토하고, 중요한 결정은 사람이 책임지도록 모두 구분했어요!');
      return;
    }
    setCardIndex((index) => index + 1);
  };

  return (
    <MiniGameFrame
      badge="세 갈래 판단 분류대"
      instruction="카드를 읽고 사실 확인, AI의 1차 판단, 사람의 최종 판단 중 알맞은 통로를 누르세요."
      progress={{ label: '구분한 카드', value: sortedCards.length, max: stage.cards.length }}
      stages={STAGES.slice(0, visibleStageCount)}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].name)}
      status={status}
      message={message}
      actions={
        status === 'success' || status === 'fail' ? (
          <MiniGameButton onClick={retry} emoji="🔁" label="다시 구분하기" />
        ) : undefined
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        {card && status !== 'success' ? (
          <article
            className="mx-auto flex min-h-24 w-full max-w-xl items-center gap-3 rounded-2xl border-2 border-slate-400 bg-slate-800 px-4 py-3 text-white"
            aria-live="polite"
          >
            <span className="text-[34px]" aria-hidden="true">
              {card.emoji}
            </span>
            <div className="min-w-0">
              <p className="text-[16px] font-black leading-relaxed sm:text-[18px]">{card.text}</p>
              {hintAllowed && (
                <p className="mt-1 text-[14px] font-bold leading-relaxed text-slate-300">
                  힌트: 근거 확인, 바로 수정, 사람에게 미치는 영향을 살펴봐요.
                </p>
              )}
            </div>
          </article>
        ) : (
          <div className="mx-auto grid min-h-24 w-full max-w-xl place-items-center rounded-2xl border-2 border-emerald-400 bg-emerald-950 px-4 text-center text-[18px] font-black text-emerald-100">
            세 가지 역할을 모두 바르게 구분했어요!
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="group" aria-label="판단 범주 선택">
          {LANES.map((lane) => (
            <button
              key={lane.id}
              type="button"
              onClick={() => chooseLane(lane.id)}
              disabled={status !== 'playing'}
              className="flex min-h-16 items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition disabled:opacity-50 sm:min-h-24 sm:flex-col sm:justify-center sm:text-center"
              style={{ borderColor: lane.color, background: lane.background, color: lane.color }}
            >
              <span className="text-[27px]" aria-hidden="true">
                {lane.emoji}
              </span>
              <span>
                <strong className="block text-[15px] font-black leading-tight">{lane.label}</strong>
                <span className="mt-1 block text-[14px] font-bold leading-tight">{lane.shortLabel}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex min-h-10 flex-wrap justify-center gap-2" aria-label="구분을 마친 카드">
          {sortedCards.map((sortedCard) => {
            const lane = LANES.find((item) => item.id === sortedCard.lane);
            return (
              <span
                key={sortedCard.id}
                className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[14px] font-black"
                style={{ borderColor: lane?.color, color: lane?.color }}
              >
                {sortedCard.emoji} {lane?.label}
              </span>
            );
          })}
        </div>
      </div>
    </MiniGameFrame>
  );
}
