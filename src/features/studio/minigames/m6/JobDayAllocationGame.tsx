import React, { useEffect, useMemo, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

interface Work {
  id: string;
  emoji: string;
  name: string;
  fit: number;
  scene: string;
  aiGuess?: boolean;
}

interface Job {
  id: string;
  tab: string;
  name: string;
  emoji: string;
  aiSays: string;
  works: Work[];
}

const JOBS: Job[] = [
  {
    id: 'librarian',
    tab: '기본',
    name: '도서관 사서',
    emoji: '📚',
    aiSays: '사서는 하루 종일 책만 정리해요.',
    works: [
      { id: 'shelf', emoji: '📚', name: '책 정리', fit: 1, scene: '책을 주제별로 제자리에 꽂아요.', aiGuess: true },
      { id: 'help', emoji: '🙋', name: '이용자 안내', fit: 3, scene: '찾는 책을 물어보는 사람에게 길을 알려 줘요.' },
      { id: 'event', emoji: '🎉', name: '행사 준비', fit: 2, scene: '작가 초청 행사 의자와 자료를 준비해요.' },
      { id: 'digital', emoji: '💻', name: '디지털 자료 관리', fit: 2, scene: '전자책과 검색 자료를 확인해요.' },
    ],
  },
  {
    id: 'cafe',
    tab: '1단계',
    name: '카페 일하는 사람',
    emoji: '☕',
    aiSays: '카페 직원은 커피만 만들어요.',
    works: [
      { id: 'drink', emoji: '☕', name: '음료 만들기', fit: 2, scene: '주문받은 음료를 안전하게 만들어요.', aiGuess: true },
      { id: 'order', emoji: '🧾', name: '주문 받기', fit: 3, scene: '손님의 주문을 듣고 확인해요.' },
      { id: 'clean', emoji: '🧽', name: '자리 정리', fit: 1, scene: '다음 손님이 앉을 자리를 깨끗하게 해요.' },
      { id: 'stock', emoji: '📦', name: '재료 챙기기', fit: 2, scene: '필요한 컵과 재료가 있는지 살펴봐요.' },
    ],
  },
  {
    id: 'petcare',
    tab: '2단계',
    name: '반려동물 돌보는 사람',
    emoji: '🐶',
    aiSays: '동물 돌봄은 놀아 주기만 하면 돼요.',
    works: [
      { id: 'play', emoji: '🎾', name: '놀아 주기', fit: 3, scene: '동물의 상태에 맞춰 놀아 줘요.', aiGuess: true },
      { id: 'feed', emoji: '🥣', name: '밥 챙기기', fit: 2, scene: '시간에 맞춰 물과 밥을 준비해요.' },
      { id: 'clean', emoji: '🧼', name: '청소·목욕', fit: 1, scene: '생활 공간을 깨끗하게 관리해요.' },
      { id: 'record', emoji: '📝', name: '건강 기록', fit: 3, scene: '먹은 양과 기분을 기록해요.' },
    ],
  },
];

export default function JobDayAllocationGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: JOBS.length, autoResetOnFailMs: 0 });
  const job = JOBS[game.stageIndex];
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [placedWorkIds, setPlacedWorkIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedWorkId(null);
    setPlacedWorkIds([]);
  }, [game.round, game.stageIndex]);

  const availableWorks = useMemo(() => job.works.filter((work) => !placedWorkIds.includes(work.id)), [job.works, placedWorkIds]);
  const selectedWork = job.works.find((work) => work.id === selectedWorkId);
  const strongestFit = placedWorkIds.reduce((best, id) => Math.max(best, job.works.find((work) => work.id === id)?.fit ?? 0), 0);

  const placeWork = () => {
    if (game.status !== 'playing' || !selectedWork) return;
    const next = [...placedWorkIds, selectedWork.id];
    setPlacedWorkIds(next);
    setSelectedWorkId(null);
    if (next.length === job.works.length) game.succeed(`${job.name}의 하루 장면을 네 가지 일로 완성했어요. 한 직업에도 여러 역할이 있어요!`);
  };

  const handleHint = () => setSelectedWorkId(availableWorks[0]?.id ?? null);

  return (
    <MiniGameFrame
      badge="직업 하루 장면 만들기"
      instruction="일 카드 하나를 골라 하루 일정판에 놓아 보세요. 직업을 숫자로 나누지 않고, 실제 사람이 하는 여러 장면을 연결합니다."
      accent="var(--ok)"
      progress={{ label: '일정판에 놓은 장면', value: placedWorkIds.length, max: job.works.length }}
      stages={JOBS.slice(0, game.visibleStageCount).map((j) => ({ id: j.id, label: j.tab }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, JOBS[index].name)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 체험하기" />
          {game.hintAllowed && <MiniGameButton onClick={handleHint} disabled={game.isLocked} emoji="💡" label="다음 장면 힌트" />}
          <MiniGameButton onClick={placeWork} disabled={!selectedWork || game.status !== 'playing'} emoji="📍" label="하루 일정에 놓기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        <section className="rounded-xl border-2 border-slate-500/60 bg-slate-900/70 p-2.5" aria-label="아이미의 예상과 실제 장면">
          <p className="text-[14px] font-black text-slate-300">🤖 아이미의 예상 · {job.emoji} {job.name}</p>
          <p className="text-[14px] font-bold text-slate-100">“{job.aiSays}”</p>
          <p className="mt-1 text-[14px] font-black text-amber-300">일 카드를 놓아 실제 하루를 열어 보세요.</p>
        </section>

        <section className="rounded-xl border-2 border-sky-300/60 bg-sky-950/45 p-2.5" aria-label="직업 일 카드 더미">
          <h3 className="mb-1 text-[14px] font-black text-sky-100">일 카드 더미</h3>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {availableWorks.map((work) => {
              const selected = selectedWorkId === work.id;
              return <button key={work.id} type="button" aria-pressed={selected} disabled={game.status !== 'playing'} onClick={() => setSelectedWorkId(work.id)} className="flex min-h-16 items-center gap-2 rounded-lg border-2 px-2 text-left text-white transition disabled:opacity-45" style={{ borderColor: selected ? '#fbbf24' : 'rgba(148,163,184,0.5)', background: selected ? 'rgba(146,64,14,0.8)' : 'rgba(15,23,42,0.62)' }}><span className="text-2xl" aria-hidden="true">{work.emoji}</span><span className="flex-1"><strong className="block text-[14px] font-black">{work.name}{work.aiGuess && <span className="ml-1 text-[12px] text-slate-400">AI 예상</span>}</strong><span className="text-[12px] font-bold text-slate-300">{work.scene}</span></span><span className="text-[12px] font-black text-amber-200">{selected ? '잡았어요' : '고르기'}</span></button>;
            })}
          </div>
        </section>

        <section className="rounded-xl border-2 border-emerald-300/60 bg-emerald-950/45 p-2.5" aria-label="하루 일정판">
          <div className="mb-1 flex items-center justify-between"><h3 className="text-[14px] font-black text-emerald-100">{job.emoji} {job.name} 하루 일정판</h3><span className="text-[13px] font-bold text-emerald-200">{placedWorkIds.length} / {job.works.length}</span></div>
          <div className="flex min-h-20 items-center gap-1.5 overflow-x-auto rounded-lg border-2 border-dashed border-emerald-200/60 bg-slate-950/45 p-2">
            <span className="shrink-0 rounded-lg border-2 border-rose-300 bg-rose-950 px-2 py-2 text-[13px] font-black text-white">🌅 시작</span>
            {placedWorkIds.map((id, index) => { const work = job.works.find((item) => item.id === id)!; return <React.Fragment key={id}><span className="text-lg text-emerald-300" aria-hidden="true">→</span><div className="min-w-28 shrink-0 rounded-lg border-2 border-emerald-300 bg-emerald-900/70 px-2 py-2 text-center text-[13px] font-black text-white"><span className="block text-lg" aria-hidden="true">{work.emoji}</span>{index + 1}. {work.name}</div></React.Fragment>; })}
            <span className="text-xl text-slate-400" aria-hidden="true">{placedWorkIds.length === job.works.length ? '✅' : '…'}</span>
          </div>
          <p className="mt-1 text-center text-[13px] font-bold text-emerald-100">{selectedWork ? `${selectedWork.emoji} ${selectedWork.scene}` : strongestFit > 0 ? '다음 일 카드를 골라 다른 장면도 열어 보세요.' : '일 카드를 골라 하루 일정판에 놓아 보세요.'}</p>
        </section>
      </div>
    </MiniGameFrame>
  );
}
