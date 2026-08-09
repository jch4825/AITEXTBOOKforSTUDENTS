import React, { useEffect, useMemo, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

type ToneId = 'friendly' | 'formal' | 'warm';
type DetailId = 'short' | 'clear' | 'full';

interface Audience {
  id: string;
  tab: string;
  emoji: string;
  name: string;
  ask: string;
  tone: ToneId[];
  detail: DetailId[];
  reaction: string;
}

const TONE_CARDS: Array<{ id: ToneId; emoji: string; label: string; text: string }> = [
  { id: 'friendly', emoji: '🙂', label: '편한 말투', text: '친구에게 자연스럽게 말해요.' },
  { id: 'formal', emoji: '🙇', label: '공손한 말투', text: '상대에게 예의를 갖춰 말해요.' },
  { id: 'warm', emoji: '💛', label: '따뜻한 말투', text: '어린 동생이 알아듣게 말해요.' },
];

const DETAIL_CARDS: Array<{ id: DetailId; emoji: string; label: string; text: string }> = [
  { id: 'short', emoji: '🧩', label: '짧은 안내 블록', text: '핵심 한 가지를 짧게 알려요.' },
  { id: 'clear', emoji: '🗒️', label: '알맞은 안내 블록', text: '필요한 정보만 또렷하게 알려요.' },
  { id: 'full', emoji: '📚', label: '자세한 안내 블록', text: '시간·장소·방법을 자세히 알려요.' },
];

const AUDIENCES: Audience[] = [
  {
    id: 'friend',
    tab: '친구',
    emoji: '🧑‍🤝‍🧑',
    name: '같은 반 친구',
    ask: '내일 준비물을 알려 주는 쪽지',
    tone: ['friendly'],
    detail: ['clear', 'full'],
    reaction: '친구가 바로 이해하고 준비물을 챙겨요.',
  },
  {
    id: 'teacher',
    tab: '선생님',
    emoji: '🧑‍🏫',
    name: '담임 선생님',
    ask: '체험회 준비를 여쭤보는 쪽지',
    tone: ['formal'],
    detail: ['clear', 'full'],
    reaction: '선생님이 정중한 질문으로 받아들여요.',
  },
  {
    id: 'kid',
    tab: '동생',
    emoji: '🧒',
    name: '1학년 동생',
    ask: '체험회 오는 길을 알려 주는 쪽지',
    tone: ['warm', 'friendly'],
    detail: ['short', 'clear'],
    reaction: '동생이 길을 쉽게 떠올리고 따라와요.',
  },
];

export default function AudienceToneGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({
    supportLevel,
    stageCount: AUDIENCES.length,
    autoResetOnFailMs: 0,
  });
  const person = AUDIENCES[game.stageIndex];
  const [toneId, setToneId] = useState<ToneId | null>(null);
  const [detailId, setDetailId] = useState<DetailId | null>(null);

  useEffect(() => {
    setToneId(null);
    setDetailId(null);
  }, [game.round, game.stageIndex]);

  const tone = useMemo(() => TONE_CARDS.find((card) => card.id === toneId), [toneId]);
  const detail = useMemo(() => DETAIL_CARDS.find((card) => card.id === detailId), [detailId]);
  const toneOk = toneId !== null && person.tone.includes(toneId);
  const detailOk = detailId !== null && person.detail.includes(detailId);
  const ready = Boolean(tone && detail);

  const send = () => {
    if (game.status !== 'playing') return;
    if (!tone || !detail) {
      game.fail('말투 카드와 안내 블록을 하나씩 골라 쪽지 판에 올려 보세요.');
      return;
    }
    if (toneOk && detailOk) {
      game.succeed(`${person.name}의 장면이 열렸어요. ${person.reaction}`);
      return;
    }
    if (!toneOk) {
      game.fail(`${person.name}에게는 ${TONE_CARDS.find((card) => person.tone.includes(card.id))?.label ?? '다른 말투'}가 더 잘 맞아요.`);
      return;
    }
    game.fail(`${person.name}에게는 ${DETAIL_CARDS.find((card) => person.detail.includes(card.id))?.label ?? '다른 정보 블록'}이 더 알맞아요.`);
  };

  const handleHint = () => {
    setToneId(person.tone[0]);
    setDetailId(person.detail[0]);
  };

  return (
    <MiniGameFrame
      badge="상대에게 맞는 쪽지 만들기"
      instruction="받는 사람 카드를 보고, 말투 카드와 안내 블록을 쪽지 판에 차례로 올려 보세요. 슬라이더 대신 실제 카드의 조합으로 장면이 달라집니다."
      accent="var(--brand-ink)"
      progress={{ label: '쪽지에 놓은 카드', value: (tone ? 1 : 0) + (detail ? 1 : 0), max: 2 }}
      stages={AUDIENCES.slice(0, game.visibleStageCount).map((a) => ({ id: a.id, label: a.tab }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${AUDIENCES[index].name}에게 쪽지 만들기`)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 만들기" />
          {game.hintAllowed && <MiniGameButton onClick={handleHint} disabled={game.isLocked} emoji="💡" label="힌트" />}
          <MiniGameButton onClick={send} disabled={game.status !== 'playing'} emoji="📨" label="쪽지 보내기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        <section className="rounded-xl border-2 border-amber-400/60 bg-amber-950/45 p-2.5" aria-label="받는 사람 장면">
          <p className="text-[14px] font-black text-amber-300">받는 사람</p>
          <p className="text-[16px] font-black text-white">{person.emoji} {person.name}</p>
          <p className="text-[14px] font-bold leading-relaxed text-amber-100">{person.ask}</p>
        </section>

        <div className="grid gap-2 sm:grid-cols-2">
          <section className="rounded-xl border-2 border-sky-300/60 bg-sky-950/45 p-2" aria-label="말투 카드 고르기">
            <h3 className="mb-1 text-[14px] font-black text-sky-200">말투 카드</h3>
            <div className="grid gap-1.5">
              {TONE_CARDS.map((card) => {
                const selected = toneId === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={game.status !== 'playing'}
                    onClick={() => setToneId(card.id)}
                    className="flex min-h-14 items-center gap-2 rounded-lg border-2 px-2 text-left text-white transition disabled:opacity-45"
                    style={{ borderColor: selected ? '#7dd3fc' : 'rgba(148,163,184,0.45)', background: selected ? 'rgba(14,116,144,0.55)' : 'rgba(15,23,42,0.55)' }}
                  >
                    <span className="text-xl" aria-hidden="true">{card.emoji}</span>
                    <span><strong className="block text-[14px] font-black">{card.label}</strong><span className="text-[14px] font-bold text-slate-300">{card.text}</span></span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border-2 border-violet-300/60 bg-violet-950/45 p-2" aria-label="안내 블록 고르기">
            <h3 className="mb-1 text-[14px] font-black text-violet-200">정보 블록</h3>
            <div className="grid gap-1.5">
              {DETAIL_CARDS.map((card) => {
                const selected = detailId === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={game.status !== 'playing'}
                    onClick={() => setDetailId(card.id)}
                    className="flex min-h-14 items-center gap-2 rounded-lg border-2 px-2 text-left text-white transition disabled:opacity-45"
                    style={{ borderColor: selected ? '#c4b5fd' : 'rgba(148,163,184,0.45)', background: selected ? 'rgba(109,40,217,0.55)' : 'rgba(15,23,42,0.55)' }}
                  >
                    <span className="text-xl" aria-hidden="true">{card.emoji}</span>
                    <span><strong className="block text-[14px] font-black">{card.label}</strong><span className="text-[14px] font-bold text-slate-300">{card.text}</span></span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <section className="rounded-xl border-2 border-emerald-300/60 bg-emerald-950/45 p-2.5" aria-live="polite">
          <p className="text-[14px] font-black text-emerald-200">쪽지 판 · 보내기 전 장면</p>
          <div className="mt-1 flex min-h-16 flex-wrap items-center gap-1.5 rounded-lg border-2 border-dashed border-emerald-200/60 bg-slate-950/45 p-2">
            {tone ? <span className="rounded-lg border border-sky-300 bg-sky-900/70 px-2 py-1 text-[14px] font-black text-white">{tone.emoji} {tone.label}</span> : <span className="text-[14px] font-bold text-slate-400">말투 카드를 올려요</span>}
            <span className="text-lg text-emerald-300" aria-hidden="true">＋</span>
            {detail ? <span className="rounded-lg border border-violet-300 bg-violet-900/70 px-2 py-1 text-[14px] font-black text-white">{detail.emoji} {detail.label}</span> : <span className="text-[14px] font-bold text-slate-400">정보 블록을 올려요</span>}
          </div>
          <p className="mt-1 text-center text-[14px] font-black text-emerald-100">{ready ? (toneOk && detailOk ? person.reaction : '카드 조합을 바꾸어 상대의 표정을 살펴보세요.') : '두 카드를 올리면 상대의 반응이 나타나요.'}</p>
        </section>
      </div>
    </MiniGameFrame>
  );
}
