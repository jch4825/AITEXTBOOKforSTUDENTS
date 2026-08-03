import React, { useEffect, useMemo, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

interface Stage {
  id: string;
  tab: string;
  task: string;
  goal: number;
  jump: number;
  minLearn: number;
}

const STAGES: Stage[] = [
  { id: 's1', tab: '기본', task: '어려운 문제 풀기', goal: 80, jump: 30, minLearn: 18 },
  { id: 's2', tab: '1단계', task: '발표 대본 쓰기', goal: 85, jump: 28, minLearn: 22 },
  { id: 's3', tab: '2단계', task: '실험 계획 세우기', goal: 90, jump: 26, minLearn: 26 },
];

const HELP_CARDS = [
  { id: 'clue', emoji: '🧩', label: '작은 단서', amount: 15, text: '첫 단서만 받아요.' },
  { id: 'question', emoji: '❓', label: '과정 질문', amount: 25, text: '어디서 막혔는지 함께 찾아요.' },
  { id: 'example', emoji: '📄', label: '부분 예시', amount: 35, text: '일부 예시를 보고 나머지는 내가 해요.' },
  { id: 'answer', emoji: '📢', label: '완성 예시', amount: 50, text: '완성된 예시를 먼저 봐요.' },
];

export default function HelpLadderGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const stage = STAGES[game.stageIndex];
  const [selectedHelpId, setSelectedHelpId] = useState<string | null>(null);
  const [climbed, setClimbed] = useState(false);

  useEffect(() => {
    setSelectedHelpId(null);
    setClimbed(false);
  }, [game.round, game.stageIndex]);

  const selectedHelp = useMemo(() => HELP_CARDS.find((card) => card.id === selectedHelpId), [selectedHelpId]);
  const height = selectedHelp?.amount ?? 0;
  const learn = Math.max(0, stage.goal - height);
  const reach = height + stage.jump >= stage.goal;
  const enoughLearn = learn >= stage.minLearn;
  const good = reach && enoughLearn;
  const bandLow = Math.max(0, stage.goal - stage.jump);
  const bandHigh = Math.max(0, stage.goal - stage.minLearn);

  const handleHint = () => {
    const card = HELP_CARDS.find((item) => item.amount >= bandLow && item.amount <= bandHigh) ?? HELP_CARDS[1];
    setSelectedHelpId(card.id);
  };

  const tryClimb = () => {
    if (game.status !== 'playing') return;
    if (!selectedHelp) {
      game.fail('도움 카드를 하나 골라 사다리 아래에 놓아 보세요.');
      return;
    }
    setClimbed(true);
    if (!reach) {
      game.fail('사다리가 낮아 목표에 닿지 못했어요. 한 칸 더 큰 도움을 골라 보세요.');
    } else if (!enoughLearn) {
      game.fail('도움이 너무 커서 내가 오를 몫이 없어요. 조금 작은 카드를 골라 보세요.');
    } else {
      game.succeed(`목표에 닿았고 내가 ${learn}만큼 스스로 올랐어요!`);
    }
  };

  return (
    <MiniGameFrame
      badge="도움 카드로 사다리 놓기"
      instruction="도움 카드를 사다리 아래에 놓고, 내가 올라갈 수 있는 만큼 남겨 보세요. 카드가 바뀌면 학생이 도착하는 장면도 달라집니다."
      accent="var(--brand-ink)"
      progress={{ label: '내가 오를 몫', value: Math.round(learn), max: stage.goal }}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(i) => game.goToStage(i, STAGES[i].task)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 놓기" />
          {game.hintAllowed && <MiniGameButton onClick={handleHint} disabled={game.isLocked} emoji="💡" label="알맞은 카드" />}
          <MiniGameButton onClick={tryClimb} disabled={game.status !== 'playing'} emoji="🧗" label={climbed ? '도착 장면 보기' : '올라가 보기'} variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <section className="rounded-xl border-2 border-amber-300/60 bg-amber-950/45 p-2.5" aria-label="오늘 할 일">
          <p className="text-[14px] font-black text-amber-300">오늘 할 일</p>
          <p className="text-[16px] font-black text-white">📌 {stage.task}</p>
        </section>

        <div className="relative min-h-[190px] flex-1 overflow-hidden rounded-xl border-2 border-slate-600/40 bg-slate-950/60" aria-label="도움 사다리 장면">
          <div className="absolute inset-x-0 border-t-2 border-dashed border-amber-300" style={{ bottom: `${stage.goal}%` }}>
            <span className="absolute right-1 -top-4 text-[14px] font-black text-amber-300">🎯 목표</span>
          </div>
          {game.hintAllowed && <div className="absolute inset-x-0 bg-emerald-400/15" style={{ bottom: `${bandLow}%`, height: `${Math.max(0, bandHigh - bandLow)}%` }} aria-hidden="true" />}
          {selectedHelp && <div className="absolute bottom-0 left-1/2 w-12 -translate-x-1/2 rounded-t-sm border-x-4 border-t-2 border-cyan-400/80 bg-cyan-500/15 transition-[height] duration-300" style={{ height: `${height}%` }} aria-label={`${selectedHelp.label}로 만든 사다리`} />}
          <div className="absolute left-1/2 -translate-x-1/2 text-2xl leading-none transition-all duration-700" style={{ bottom: `${climbed ? Math.min(stage.goal, height + stage.jump) : 0}%` }} aria-hidden="true">🧑</div>
          <div className="absolute bottom-2 left-2 rounded-lg border border-cyan-200/60 bg-slate-900/80 px-2 py-1 text-[13px] font-black text-cyan-100">
            {selectedHelp ? `${selectedHelp.emoji} ${selectedHelp.label}` : '도움 카드를 아래에 놓아요'}
          </div>
        </div>

        <section className="rounded-xl border-2 border-sky-300/60 bg-sky-950/45 p-2" aria-label="도움 카드 더미">
          <h3 className="mb-1 text-[14px] font-black text-sky-100">도움 카드 더미</h3>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {HELP_CARDS.map((card) => {
              const selected = selectedHelpId === card.id;
              return (
                <button key={card.id} type="button" aria-pressed={selected} disabled={game.status !== 'playing'} onClick={() => setSelectedHelpId(card.id)} className="min-h-16 rounded-lg border-2 px-2 py-1 text-center text-white transition disabled:opacity-45" style={{ borderColor: selected ? '#fbbf24' : 'rgba(148,163,184,0.5)', background: selected ? 'rgba(146,64,14,0.8)' : 'rgba(15,23,42,0.6)' }}>
                  <span className="block text-xl" aria-hidden="true">{card.emoji}</span>
                  <strong className="block text-[13px] font-black">{card.label}</strong>
                  <span className="text-[11px] font-bold text-slate-300">{card.text}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-1 text-center text-[13px] font-bold text-sky-100">{good ? '이 카드면 도착하고 내 몫도 남아요.' : '카드를 바꿔 학생의 도착 장면을 비교해 보세요.'}</p>
        </section>
      </div>
    </MiniGameFrame>
  );
}
