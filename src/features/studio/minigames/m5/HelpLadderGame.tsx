import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m5-l5 「답 대신 필요한 만큼 도움받기」 — 도움 사다리.
 *
 * 사다리가 낮으면 목표에 닿지 못하고, 높으면 닿기는 하지만 내가 올라간 몫이 없어진다.
 * 두 조건이 서로 반대로 걸려 있어서 알맞은 높이가 구간으로 생긴다.
 * "도움을 받을까 말까"가 아니라 "얼마나 받을까"의 문제다.
 */

interface Stage {
  id: string;
  tab: string;
  task: string;
  /** 목표 높이 */
  goal: number;
  /** 사다리 위에서 내가 더 오를 수 있는 만큼 */
  jump: number;
  /** 스스로 오른 몫이 이만큼은 되어야 배움이 남는다 */
  minLearn: number;
}

const STAGES: Stage[] = [
  { id: 's1', tab: '기본', task: '어려운 문제 풀기', goal: 80, jump: 30, minLearn: 18 },
  { id: 's2', tab: '1단계', task: '발표 대본 쓰기', goal: 85, jump: 28, minLearn: 22 },
  { id: 's3', tab: '2단계', task: '실험 계획 세우기', goal: 90, jump: 26, minLearn: 26 },
];

const HELPS = [
  { at: 0.25, emoji: '🧩', label: '작은 단서만' },
  { at: 0.5, emoji: '❓', label: '과정 질문' },
  { at: 0.75, emoji: '📄', label: '부분 예시' },
  { at: 1, emoji: '📢', label: '답을 통째로' },
];

export default function HelpLadderGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    hintAllowed,
    status,
    message,
    round,
    isLocked,
    goToStage,
    run,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length });

  const stage = STAGES[stageIndex];
  const [height, setHeight] = useState(0);
  const [climbed, setClimbed] = useState(false);

  useEffect(() => {
    setHeight(0);
    setClimbed(false);
  }, [round, stageIndex]);

  const learn = Math.max(0, stage.goal - height);
  const reach = height + stage.jump >= stage.goal;
  const enoughLearn = learn >= stage.minLearn;
  const good = reach && enoughLearn;

  // 알맞은 구간 — 닿으면서 배움도 남는 높이
  const bandLow = Math.max(0, stage.goal - stage.jump);
  const bandHigh = Math.max(0, stage.goal - stage.minLearn);

  const handleHint = () => setHeight(Math.round((bandLow + bandHigh) / 2));

  const tryClimb = () => {
    if (status !== 'playing') return;
    setClimbed(true);
    run('사다리를 놓고 올라가 봅니다!');
  };

  useEffect(() => {
    if (status !== 'running') return;
    const timer = setTimeout(() => {
      if (!reach) {
        fail('사다리가 낮아 목표에 닿지 못했어요. 조금 더 도움을 받아요.');
      } else if (!enoughLearn) {
        fail('도움이 너무 커서 내가 오른 몫이 없어요. 조금 줄여요.');
      } else {
        succeed(`목표에 닿았고 내가 ${Math.round(learn)}만큼 스스로 올랐어요!`);
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [status, reach, enoughLearn, learn, succeed, fail]);

  useEffect(() => {
    if (status === 'playing') setClimbed(false);
  }, [status]);

  const helpLabel = HELPS.find((h) => height <= stage.goal * h.at) ?? HELPS[HELPS.length - 1];

  return (
    <MiniGameFrame
      badge="도움 사다리 높이"
      instruction="사다리가 낮으면 목표에 못 닿고, 너무 높으면 내가 오를 몫이 없어요. 닿으면서도 스스로 오를 수 있는 높이를 찾아 보세요."
      accent="var(--brand-ink)"
      progress={{ label: '스스로 오름', value: Math.round(learn), max: stage.goal }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, STAGES[i].task)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="다시" />
          {hintAllowed && (
            <MiniGameButton onClick={handleHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={tryClimb}
            disabled={status !== 'playing'}
            emoji="🧗"
            label={status === 'running' ? '올라가는 중…' : '올라가 보기'}
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="rounded-lg border-2 border-amber-400/50 bg-amber-400/10 px-2 py-1.5">
          <p className="text-[14px] font-black text-amber-300">오늘 할 일</p>
          <p className="text-[14px] font-bold text-slate-100">📌 {stage.task}</p>
        </div>

        {/* 사다리와 목표 */}
        <div className="relative min-h-[190px] flex-1 overflow-hidden rounded-xl border-2 border-slate-600/40 bg-slate-950/60">
          {/* 목표선 */}
          <div
            className="absolute inset-x-0 border-t-2 border-dashed border-amber-300"
            style={{ bottom: `${stage.goal}%` }}
          >
            <span className="absolute right-1 -top-4 text-[14px] font-black text-amber-300">
              🎯 목표
            </span>
          </div>

          {/* 알맞은 높이 구간 */}
          {hintAllowed && (
            <div
              className="absolute inset-x-0 bg-emerald-400/15"
              style={{ bottom: `${bandLow}%`, height: `${Math.max(0, bandHigh - bandLow)}%` }}
              aria-hidden="true"
            />
          )}

          {/* 사다리 */}
          <div
            className="absolute left-1/2 w-10 -translate-x-1/2 rounded-t-sm border-x-4 border-t-2 border-cyan-400/80 bg-cyan-500/15 transition-[height] duration-200"
            style={{ bottom: 0, height: `${height}%` }}
          />

          {/* 학생 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 text-2xl leading-none transition-all duration-700"
            style={{ bottom: `${climbed ? Math.min(stage.goal, height + stage.jump) : 0}%` }}
            aria-hidden="true"
          >
            🧑
          </div>
        </div>

        {/* 높이 조절 */}
        <div>
          <div className="mb-1 flex items-center justify-between text-[14px] font-black">
            <span className="text-slate-400">받을 도움</span>
            <span className={good ? 'text-emerald-300' : 'text-slate-300'}>
              {helpLabel.emoji} {helpLabel.label}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={height}
            disabled={status !== 'playing'}
            onChange={(e: any) => setHeight(Number(e.target.value))}
            aria-label="도움 사다리 높이"
            className="w-full"
            style={{ accentColor: good ? '#34d399' : '#4FC3E8' }}
          />
          <div className="flex justify-between text-[14px] font-bold text-slate-500">
            <span>도움 적게</span>
            <span>도움 많이</span>
          </div>
        </div>
      </div>
    </MiniGameFrame>
  );
}
