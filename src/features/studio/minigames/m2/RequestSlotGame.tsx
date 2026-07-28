import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m2-l1 「빠진 정보를 찾아요」 — 말풍선 칸 채우기.
 *
 * 담을 수 있는 칸이 정보 조각보다 적다. 그래서 "무엇을 넣을까"가 아니라 **무엇을 포기할까**가
 * 문제가 되고, 한 조각을 넣을지는 남은 칸과 이미 넣은 조각에 달린다.
 *
 * 개인정보 조각은 ⚠로 대놓고 표시한다(판단은 공짜). 넣으면 선명도는 오르지만 안전등이 꺼져
 * 실패한다 — 차시의 "필요한 정보만 안전하게 더한다"를 손으로 겪게 하려는 구성이다.
 */

interface Chip {
  id: string;
  emoji: string;
  label: string;
  clarity: number;
  personal?: boolean;
}

interface Stage {
  id: string;
  tab: string;
  request: string;
  preview: string;
  slots: number;
  target: number;
  chips: Chip[];
}

const STAGES: Stage[] = [
  {
    id: 'poster',
    tab: '포스터',
    request: '포스터를 만들어 줘',
    preview: '🖼️',
    slots: 4,
    target: 10,
    chips: [
      { id: 'what', emoji: '🎪', label: '행사 이름', clarity: 3 },
      { id: 'when', emoji: '📅', label: '날짜', clarity: 3 },
      { id: 'where', emoji: '📍', label: '장소', clarity: 2 },
      { id: 'who', emoji: '🙋', label: '보는 사람', clarity: 2 },
      { id: 'mood', emoji: '✨', label: '분위기', clarity: 2 },
      { id: 'color', emoji: '🎨', label: '좋아하는 색', clarity: 1 },
      { id: 'phone', emoji: '📞', label: '내 전화번호', clarity: 1, personal: true },
      { id: 'home', emoji: '🏠', label: '우리 집 주소', clarity: 1, personal: true },
    ],
  },
  {
    id: 'letter',
    tab: '편지',
    request: '편지를 써 줘',
    preview: '💌',
    slots: 4,
    target: 11,
    chips: [
      { id: 'to', emoji: '🙋', label: '받는 사람', clarity: 3 },
      { id: 'why', emoji: '💬', label: '쓰는 까닭', clarity: 3 },
      { id: 'tone', emoji: '🎈', label: '말투', clarity: 3 },
      { id: 'len', emoji: '📏', label: '길이', clarity: 2 },
      { id: 'when', emoji: '📅', label: '언제 줄지', clarity: 2 },
      { id: 'pen', emoji: '🖊️', label: '글씨체', clarity: 1 },
      { id: 'id', emoji: '🪪', label: '내 학번', clarity: 2, personal: true },
      { id: 'photo', emoji: '🤳', label: '내 얼굴 사진', clarity: 2, personal: true },
    ],
  },
  {
    id: 'plan',
    tab: '계획표',
    request: '주말 계획표를 짜 줘',
    preview: '🗓️',
    slots: 4,
    target: 12,
    chips: [
      { id: 'goal', emoji: '🎯', label: '하고 싶은 일', clarity: 4 },
      { id: 'time', emoji: '⏰', label: '가능한 시간', clarity: 3 },
      { id: 'with', emoji: '👫', label: '함께할 사람', clarity: 3 },
      { id: 'money', emoji: '💰', label: '쓸 수 있는 돈', clarity: 2 },
      { id: 'move', emoji: '🚌', label: '이동 방법', clarity: 2 },
      { id: 'weather', emoji: '🌤️', label: '날씨', clarity: 1 },
      { id: 'card', emoji: '💳', label: '부모님 카드 번호', clarity: 3, personal: true },
      { id: 'addr', emoji: '🏠', label: '친구 집 주소', clarity: 2, personal: true },
    ],
  },
];

export default function RequestSlotGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    hintAllowed,
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
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    setPicked([]);
  }, [round, stageIndex]);

  const chipById = (id: string) => stage.chips.find((c) => c.id === id)!;
  const clarity = picked.reduce((sum, id) => sum + chipById(id).clarity, 0);
  const hasPersonal = picked.some((id) => chipById(id).personal);
  const ratio = Math.min(1, clarity / stage.target);

  const toggle = (id: string) => {
    if (status !== 'playing') return;
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= stage.slots) return prev; // 칸이 다 찼다
      return [...prev, id];
    });
  };

  const handleHint = () => {
    // 개인정보를 뺀 조각 중 선명도가 높은 것부터 칸만큼 담는다.
    const best = stage.chips
      .filter((c) => !c.personal)
      .sort((a, b) => b.clarity - a.clarity)
      .slice(0, stage.slots)
      .map((c) => c.id);
    setPicked(best);
  };

  const handleSend = () => {
    if (hasPersonal) {
      fail('개인정보가 들어갔어요. 그 조각은 빼야 해요.');
      return;
    }
    if (clarity < stage.target) {
      fail('결과가 아직 흐릿해요. 더 꼭 필요한 정보 조각으로 바꿔 보세요.');
      return;
    }
    succeed('흐리던 결과가 또렷해졌어요. 필요한 정보만 안전하게 담았어요!');
  };

  return (
    <MiniGameFrame
      badge="말풍선 칸 채우기"
      instruction={`요청 말풍선에는 ${stage.slots}칸만 담깁니다. 조각을 눌러 담고 빼면서 결과가 또렷해지게 만들어요. ⚠ 표시는 개인정보라 담으면 안 됩니다.`}
      accent="var(--brand-ink)"
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].request)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="다시" />
          {hintAllowed && (
            <MiniGameButton onClick={handleHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={handleSend}
            disabled={status !== 'playing'}
            emoji="📨"
            label="요청 보내기"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 결과 미리보기 — 선명도가 오르면 또렷해진다 */}
        <div className="flex items-center gap-3 rounded-lg border-2 border-slate-600/50 bg-slate-900/60 px-3 py-2">
          <span
            className="text-4xl leading-none transition-all duration-300"
            style={{ filter: `blur(${(1 - ratio) * 7}px)`, opacity: 0.5 + ratio * 0.5 }}
            aria-hidden="true"
          >
            {stage.preview}
          </span>
          <span className="flex flex-1 flex-col">
            <span className="text-[14px] font-black text-slate-400">아이미가 만들 결과</span>
            <span className="text-[14px] font-bold text-slate-100">“{stage.request}”</span>
          </span>
        </div>

        {/* 말풍선 칸 */}
        <div>
          <p className="mb-1 text-[14px] font-black text-slate-400">
            말풍선 ({picked.length}/{stage.slots}칸)
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {Array.from({ length: stage.slots }).map((_, i) => {
              const id = picked[i];
              const chip = id ? chipById(id) : null;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => chip && toggle(chip.id)}
                  disabled={!chip || status !== 'playing'}
                  className="flex min-h-11 items-center gap-1 rounded-lg border-2 border-dashed px-1.5 py-1 text-left"
                  style={{
                    borderColor: chip
                      ? chip.personal
                        ? '#fb7185'
                        : '#4ade80'
                      : 'rgba(148,163,184,0.4)',
                    background: chip ? 'rgba(30,41,59,0.95)' : 'transparent',
                  }}
                >
                  {chip ? (
                    <>
                      <span className="text-[15px] leading-none">{chip.emoji}</span>
                      <span className="text-[14px] font-bold text-slate-100">{chip.label}</span>
                    </>
                  ) : (
                    <span className="w-full text-center text-[14px] font-bold text-slate-500">
                      빈 칸
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 고를 수 있는 조각 */}
        <div className="flex-1">
          <p className="mb-1 text-[14px] font-black text-slate-400">더할 수 있는 정보</p>
          <div className="flex flex-wrap gap-1">
            {stage.chips
              .filter((c) => !picked.includes(c.id))
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  disabled={status !== 'playing' || picked.length >= stage.slots}
                  className="flex min-h-11 items-center gap-1 rounded-lg border-2 px-1.5 py-1 disabled:opacity-40"
                  style={{
                    borderColor: c.personal ? '#fb7185' : 'rgba(148,163,184,0.45)',
                    background: c.personal ? 'rgba(190,24,93,0.25)' : 'rgba(30,41,59,0.9)',
                  }}
                >
                  <span className="text-[15px] leading-none">{c.emoji}</span>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-[14px] font-bold text-slate-100">
                      {c.personal && <span className="text-rose-300">⚠ </span>}
                      {c.label}
                    </span>
                    <span className="text-[14px] font-bold text-slate-400">
                      {c.clarity >= 3 ? '또렷한 단서' : c.clarity === 2 ? '도움 되는 단서' : '작은 단서'}
                    </span>
                  </span>
                </button>
              ))}
          </div>
        </div>

        {hasPersonal && (
          <p className="rounded-md bg-rose-500/20 px-2 py-1 text-center text-[14px] font-black text-rose-200">
            ⚠ 개인정보가 담겼어요
          </p>
        )}
      </div>
    </MiniGameFrame>
  );
}
