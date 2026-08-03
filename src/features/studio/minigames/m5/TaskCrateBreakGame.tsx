import React, { useEffect, useMemo, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

interface TaskPiece {
  id: string;
  label: string;
  emoji: string;
}

interface Stage {
  id: string;
  label: string;
  task: string;
  pieces: TaskPiece[];
  order: string[];
}

const STAGES: Stage[] = [
  {
    id: 'booth',
    label: '기본',
    task: '부스 설치',
    pieces: [
      { id: 'floor', label: '바닥 자리 정하기', emoji: '⬜' },
      { id: 'desk', label: '책상 놓기', emoji: '🪑' },
      { id: 'power', label: '전원 연결하기', emoji: '🔌' },
      { id: 'sign', label: '표지 붙이기', emoji: '🏷️' },
      { id: 'check', label: '안전 점검하기', emoji: '🔎' },
    ],
    order: ['floor', 'desk', 'power', 'sign', 'check'],
  },
  {
    id: 'show',
    label: '1단계',
    task: '학급 발표',
    pieces: [
      { id: 'topic', label: '주제 정하기', emoji: '🎯' },
      { id: 'material', label: '자료 모으기', emoji: '📚' },
      { id: 'role', label: '역할 나누기', emoji: '🧑‍🤝‍🧑' },
      { id: 'practice', label: '발표 연습하기', emoji: '🎤' },
      { id: 'check', label: '마지막 확인하기', emoji: '✅' },
    ],
    order: ['topic', 'material', 'role', 'practice', 'check'],
  },
  {
    id: 'trip',
    label: '2단계',
    task: '체험 준비',
    pieces: [
      { id: 'place', label: '장소 확인하기', emoji: '📍' },
      { id: 'time', label: '시간 확인하기', emoji: '🕑' },
      { id: 'supply', label: '준비물 챙기기', emoji: '🎒' },
      { id: 'help', label: '도움 요청하기', emoji: '🙋' },
      { id: 'safety', label: '안전 약속하기', emoji: '🛡️' },
    ],
    order: ['place', 'time', 'supply', 'help', 'safety'],
  },
];

export default function TaskCrateBreakGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const stage = STAGES[game.stageIndex];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placedIds, setPlacedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedId(null);
    setPlacedIds([]);
  }, [game.round, game.stageIndex]);

  const availablePieces = useMemo(() => stage.pieces.filter((piece) => !placedIds.includes(piece.id)), [stage.pieces, placedIds]);
  const selectedPiece = stage.pieces.find((piece) => piece.id === selectedId);

  const placePiece = () => {
    if (game.status !== 'playing' || !selectedPiece) return;
    const expectedId = stage.order[placedIds.length];
    if (selectedPiece.id !== expectedId) {
      const expected = stage.pieces.find((piece) => piece.id === expectedId);
      game.fail(`${expected?.label ?? '다음 조각'}부터 놓아야 큰 일을 안전하게 나눌 수 있어요.`);
      return;
    }
    const next = [...placedIds, selectedPiece.id];
    setPlacedIds(next);
    setSelectedId(null);
    if (next.length === stage.order.length) game.succeed(`${stage.task}을 작은 과제 조각으로 나누고 순서까지 세웠어요!`);
  };

  const handleHint = () => setSelectedId(stage.order[placedIds.length] ?? null);

  return (
    <MiniGameFrame
      badge="큰 일 조각 순서 세우기"
      instruction="큰 일 상자에서 작은 과제 조각을 하나씩 골라 순서판에 놓으세요. 망치 횟수가 아니라 다음에 할 일을 눈으로 정하는 게임입니다."
      progress={{ label: '순서판에 놓은 조각', value: placedIds.length, max: stage.order.length }}
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].task)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 나누기" />
          {game.hintAllowed && <MiniGameButton onClick={handleHint} disabled={game.isLocked} emoji="💡" label="다음 조각 힌트" />}
          <MiniGameButton onClick={placePiece} disabled={!selectedPiece || game.status !== 'playing'} emoji="📌" label="순서판에 놓기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        <section className="rounded-xl border-2 border-amber-300/60 bg-amber-950/45 p-2.5" aria-label="큰 일 상자 장면">
          <div className="flex items-center gap-2">
            <span className="text-4xl" aria-hidden="true">{availablePieces.length ? '📦' : '✅'}</span>
            <div><p className="text-[14px] font-black text-amber-300">큰 일 상자</p><p className="text-[16px] font-black text-white">{stage.task}</p></div>
          </div>
          <p className="mt-1 text-[13px] font-bold text-amber-100">상자 안에 해야 할 일이 {availablePieces.length}개 남아 있어요.</p>
        </section>

        <section className="rounded-xl border-2 border-sky-300/60 bg-sky-950/45 p-2.5" aria-label="작은 과제 조각">
          <h3 className="mb-1 text-[14px] font-black text-sky-100">작은 과제 조각 고르기</h3>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {availablePieces.map((piece) => {
              const selected = selectedId === piece.id;
              return <button key={piece.id} type="button" aria-pressed={selected} disabled={game.status !== 'playing'} onClick={() => setSelectedId(piece.id)} className="flex min-h-14 items-center gap-2 rounded-lg border-2 px-2 text-left text-white transition disabled:opacity-45" style={{ borderColor: selected ? '#fbbf24' : 'rgba(148,163,184,0.5)', background: selected ? 'rgba(146,64,14,0.8)' : 'rgba(15,23,42,0.62)' }}><span className="text-xl" aria-hidden="true">{piece.emoji}</span><span className="flex-1 text-[14px] font-black">{piece.label}</span><span className="text-[12px] font-black text-amber-200">{selected ? '잡았어요' : '고르기'}</span></button>;
            })}
          </div>
        </section>

        <section className="rounded-xl border-2 border-emerald-300/60 bg-emerald-950/45 p-2.5" aria-label="과제 순서판">
          <div className="mb-1 flex items-center justify-between"><h3 className="text-[14px] font-black text-emerald-100">과제 순서판</h3><span className="text-[13px] font-bold text-emerald-200">{placedIds.length} / {stage.order.length}</span></div>
          <div className="flex min-h-20 items-center gap-1.5 overflow-x-auto rounded-lg border-2 border-dashed border-emerald-200/60 bg-slate-950/45 p-2">
            <span className="shrink-0 rounded-lg border-2 border-rose-300 bg-rose-950 px-2 py-2 text-[13px] font-black text-white">🚩 시작</span>
            {placedIds.map((id, index) => { const piece = stage.pieces.find((item) => item.id === id)!; return <React.Fragment key={id}><span className="text-lg text-emerald-300" aria-hidden="true">→</span><div className="min-w-24 shrink-0 rounded-lg border-2 border-emerald-300 bg-emerald-900/70 px-2 py-2 text-center text-[13px] font-black text-white"><span className="block text-lg" aria-hidden="true">{piece.emoji}</span>{index + 1}. {piece.label}</div></React.Fragment>; })}
            <span className="text-xl text-slate-400" aria-hidden="true">{placedIds.length === stage.order.length ? '🏁' : '…'}</span>
          </div>
          <p className="mt-1 text-center text-[13px] font-bold text-emerald-100">{selectedPiece ? `${selectedPiece.emoji} ${selectedPiece.label}을(를) 다음 칸에 놓아 보세요.` : '조각 하나를 골라 순서판으로 옮겨요.'}</p>
        </section>
      </div>
    </MiniGameFrame>
  );
}
