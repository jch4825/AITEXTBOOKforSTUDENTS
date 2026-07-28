import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'schedule', label: '기본', job: '오늘 버스 시간', icon: '🚌' },
  { id: 'health', label: '1단계', job: '몸이 아플 때 도움', icon: '🩹' },
  { id: 'safety', label: '2단계', job: '안전한 길 확인', icon: '🗺️' },
];

export default function HumanHandoffStampGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    status,
    message,
    round,
    goToStage,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[stageIndex];
  const [drafted, setDrafted] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setDrafted(false);
    setVerified(false);
  }, [round, stageIndex]);

  const verify = () => {
    if (!drafted) {
      fail('확인할 초안이 아직 없어요. AI 도움 도장을 먼저 찍어요.');
      return;
    }
    setVerified(true);
  };

  const useResult = () => {
    if (!verified) {
      fail('사람·공식 정보 확인 도장이 없어요. 바통을 넘겨 확인해요.');
      return;
    }
    succeed('AI의 초안을 사람과 공식 정보로 확인한 뒤 안전하게 사용했어요!');
  };

  return (
    <MiniGameFrame
      badge="AI-사람 바통 잇기"
      instruction="AI가 초안을 만들면 바통을 사람·공식 정보 쪽으로 넘겨 확인 도장을 찍고 사용하세요."
      stages={STAGES.slice(0, visibleStageCount)}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].job)}
      status={status}
      message={message}
      actions={
        status === 'playing' ? (
          <MiniGameButton onClick={useResult} emoji="🏁" label="결과 사용하기" variant="primary" />
        ) : (
          <MiniGameButton onClick={retry} emoji="🔁" label="다시 이어 보기" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4">
        <div className="mx-auto flex items-center gap-2">
          <div className="grid h-24 w-24 place-items-center rounded-2xl border-4 border-sky-400 bg-sky-950 text-center text-[14px] font-black text-sky-100">
            <span className="block text-[28px]" aria-hidden="true">
              🤖
            </span>
            AI 도움
          </div>
          <div className="flex min-w-20 flex-col items-center text-[27px] text-amber-300" aria-hidden="true">
            <span>{drafted ? '🏃‍➡️' : '···'}</span>
            <span>{verified ? '✅' : '🏷️'}</span>
          </div>
          <div className="grid h-24 w-24 place-items-center rounded-2xl border-4 border-emerald-400 bg-emerald-950 text-center text-[14px] font-black text-emerald-100">
            <span className="block text-[28px]" aria-hidden="true">
              👩‍🏫
            </span>
            사람·공식 정보
          </div>
        </div>

        <div className="mx-auto flex min-h-20 w-[88%] items-center justify-center gap-3 rounded-xl border-2 border-slate-500 bg-slate-800 px-4">
          <span className="text-[30px]" aria-hidden="true">
            {stage.icon}
          </span>
          <span className="text-[17px] font-black text-white">{stage.job}</span>
          <span className="ml-auto text-[28px]" aria-hidden="true">
            {verified ? '✅' : drafted ? '📝' : '⬜'}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDrafted(true)}
            disabled={drafted || status !== 'playing'}
            className="min-h-14 flex-1 rounded-xl border-2 border-sky-400 bg-sky-950 text-[15px] font-black text-sky-100 disabled:opacity-50"
          >
            🤖 초안 도장
          </button>
          <button
            type="button"
            onClick={verify}
            disabled={verified || status !== 'playing'}
            className="min-h-14 flex-1 rounded-xl border-2 border-emerald-400 bg-emerald-950 text-[15px] font-black text-emerald-100 disabled:opacity-50"
          >
            👩‍🏫 확인 도장
          </button>
        </div>
      </div>
    </MiniGameFrame>
  );
}
