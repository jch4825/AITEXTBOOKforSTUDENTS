import React, { useEffect, useMemo, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

interface Part {
  id: string;
  label: string;
  emoji: string;
}

interface Stage {
  id: string;
  tab: string;
  task: string;
  parts: Part[];
  order: string[];
}

const STAGES: Stage[] = [
  {
    id: 'poster',
    tab: '기본',
    task: '체험회 포스터 만들기',
    parts: [
      { id: 'title', label: '제목 짓기', emoji: '🏷️' },
      { id: 'message', label: '문구 쓰기', emoji: '✍️' },
      { id: 'picture', label: '그림 넣기', emoji: '🖼️' },
      { id: 'color', label: '색 고르기', emoji: '🎨' },
    ],
    order: ['title', 'message', 'picture', 'color'],
  },
  {
    id: 'show',
    tab: '1단계',
    task: '학급 발표 준비하기',
    parts: [
      { id: 'topic', label: '주제 정하기', emoji: '🎯' },
      { id: 'source', label: '자료 모으기', emoji: '📚' },
      { id: 'script', label: '대본 쓰기', emoji: '📝' },
      { id: 'picture', label: '그림 준비', emoji: '🖼️' },
      { id: 'order', label: '순서 짜기', emoji: '🧭' },
    ],
    order: ['topic', 'source', 'script', 'picture', 'order'],
  },
  {
    id: 'trip',
    tab: '2단계',
    task: '현장 체험 안내문 만들기',
    parts: [
      { id: 'schedule', label: '일정 정리', emoji: '🗓️' },
      { id: 'supplies', label: '준비물 정리', emoji: '🎒' },
      { id: 'notice', label: '안내 문구', emoji: '💬' },
      { id: 'map', label: '지도 넣기', emoji: '🗺️' },
      { id: 'contact', label: '연락 방법', emoji: '☎️' },
    ],
    order: ['schedule', 'supplies', 'notice', 'map', 'contact'],
  },
];

export default function RelayRequestGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const stage = STAGES[game.stageIndex];
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [placedIds, setPlacedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedPartId(null);
    setPlacedIds([]);
  }, [game.round, game.stageIndex]);

  const availableParts = useMemo(() => stage.parts.filter((part) => !placedIds.includes(part.id)), [stage.parts, placedIds]);
  const selectedPart = stage.parts.find((part) => part.id === selectedPartId);

  const placeSelected = () => {
    if (game.status !== 'playing' || !selectedPart) return;
    const expectedId = stage.order[placedIds.length];
    if (selectedPart.id !== expectedId) {
      const expected = stage.parts.find((part) => part.id === expectedId);
      game.fail(`${expected?.label ?? '다음 단계'}를 먼저 놓아야 요청이 이어져요. 작은 단계부터 한 칸씩 연결해 보세요.`);
      return;
    }
    const next = [...placedIds, selectedPart.id];
    setPlacedIds(next);
    setSelectedPartId(null);
    if (next.length === stage.order.length) {
      game.succeed(`${stage.task}의 작은 요청 ${next.length}칸이 한 줄로 이어졌어요!`);
    }
  };

  const handleHint = () => setSelectedPartId(stage.order[placedIds.length] ?? null);

  return (
    <MiniGameFrame
      badge="요청 카드 이어 붙이기"
      instruction="작은 과제 카드를 하나 눌러 잡고 요청 레일에 놓으세요. 앞 단계가 끝나야 다음 요청이 자연스럽게 이어집니다."
      accent="var(--brand-ink)"
      progress={{ label: '레일에 놓은 카드', value: placedIds.length, max: stage.order.length }}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.tab }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].task)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 만들기" />
          {game.hintAllowed && <MiniGameButton onClick={handleHint} disabled={game.isLocked} emoji="💡" label="다음 카드 힌트" />}
          <MiniGameButton onClick={placeSelected} disabled={!selectedPart || game.status !== 'playing'} emoji="📨" label="레일에 놓기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        <section className="rounded-xl border-2 border-amber-300/60 bg-amber-950/45 p-2.5" aria-label="큰 과제 장면">
          <p className="text-[14px] font-black text-amber-300">큰 과제 장면</p>
          <p className="text-[16px] font-black text-white">📋 {stage.task}</p>
          <p className="mt-1 text-[14px] font-bold text-amber-100">작업자가 한 번에 한 카드씩 전달할 수 있어요.</p>
        </section>

        <section className="rounded-xl border-2 border-sky-300/60 bg-sky-950/40 p-2.5" aria-label="요청 카드 더미">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-[14px] font-black text-sky-100">요청 카드 더미</h3>
            <span className="text-[14px] font-bold text-sky-200">{availableParts.length}장 남음</span>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {availableParts.map((part) => {
              const selected = part.id === selectedPartId;
              return (
                <button
                  key={part.id}
                  type="button"
                  aria-pressed={selected}
                  disabled={game.status !== 'playing'}
                  onClick={() => setSelectedPartId(part.id)}
                  className="flex min-h-14 items-center gap-2 rounded-lg border-2 px-2 text-left text-white transition disabled:opacity-45"
                  style={{ borderColor: selected ? '#fbbf24' : 'rgba(148,163,184,0.5)', background: selected ? 'rgba(146,64,14,0.78)' : 'rgba(15,23,42,0.6)' }}
                >
                  <span className="text-xl" aria-hidden="true">{part.emoji}</span>
                  <span className="flex-1 text-[14px] font-black">{part.label}</span>
                  <span className="text-[14px] font-black text-amber-200">{selected ? '잡았어요' : '잡기'}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border-2 border-emerald-300/60 bg-emerald-950/45 p-2.5" aria-label="요청 레일">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="text-[14px] font-black text-emerald-100">요청 레일</h3>
            <span className="text-[14px] font-bold text-emerald-200">{placedIds.length} / {stage.order.length}</span>
          </div>
          <div className="flex min-h-20 items-center gap-1.5 overflow-x-auto rounded-lg border-2 border-dashed border-emerald-200/60 bg-slate-950/45 p-2">
            <span className="shrink-0 rounded-lg border-2 border-rose-300 bg-rose-950 px-2 py-2 text-[14px] font-black text-white">🙋 요청하는 사람</span>
            {placedIds.map((id, index) => {
              const part = stage.parts.find((item) => item.id === id)!;
              return (
                <React.Fragment key={id}>
                  <span className="text-lg text-emerald-300" aria-hidden="true">→</span>
                  <div className="min-w-24 shrink-0 rounded-lg border-2 border-emerald-300 bg-emerald-900/70 px-2 py-2 text-center text-[14px] font-black text-white">
                    <span className="block text-lg" aria-hidden="true">{part.emoji}</span>
                    {index + 1}. {part.label}
                  </div>
                </React.Fragment>
              );
            })}
            <span className="text-xl text-slate-400" aria-hidden="true">{placedIds.length === stage.order.length ? '✅' : '…'}</span>
          </div>
          <p className="mt-1 text-center text-[14px] font-bold text-emerald-100">
            {selectedPart ? `${selectedPart.emoji} ${selectedPart.label} 카드를 레일에 놓아 보세요.` : '카드 하나를 눌러 다음 요청을 준비하세요.'}
          </p>
        </section>
      </div>
    </MiniGameFrame>
  );
}
