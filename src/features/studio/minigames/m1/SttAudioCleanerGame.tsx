import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

interface Stage {
  id: string;
  label: string;
  place: string;
  target: string;
  noisy: string;
  noises: { id: string; icon: string; label: string }[];
  alternatives: { icon: string; label: string }[];
}

const STAGES: Stage[] = [
  {
    id: 'hallway',
    label: '기본',
    place: '시끄러운 복도',
    target: '체험회에 놀러 오세요!',
    noisy: '채소회 오이 사세요…',
    noises: [
      { id: 'talk', icon: '🗯️', label: '친구들 말소리' },
      { id: 'steps', icon: '👟', label: '발걸음 소리' },
      { id: 'door', icon: '🚪', label: '문 닫는 소리' },
    ],
    alternatives: [{ icon: '⌨️', label: '글자판 꽂기' }, { icon: '🖼️', label: '그림 카드 꽂기' }],
  },
  {
    id: 'gym',
    label: '1단계',
    place: '울리는 체육관',
    target: '다음 장소는 강당 2층입니다!',
    noisy: '다 앙동 장소는 가 당 이 층…',
    noises: [
      { id: 'echo', icon: '📢', label: '스피커 울림' },
      { id: 'ball', icon: '🏀', label: '공 튀는 소리' },
      { id: 'crowd', icon: '👥', label: '사람들 소리' },
    ],
    alternatives: [{ icon: '📜', label: '안내판 꽂기' }, { icon: '🖼️', label: '그림 카드 꽂기' }],
  },
  {
    id: 'field',
    label: '2단계',
    place: '바람 부는 운동장',
    target: '파란색 모자를 준비하세요!',
    noisy: '바른 모자 준 비…',
    noises: [
      { id: 'wind', icon: '💨', label: '바람 소리' },
      { id: 'whistle', icon: '📣', label: '호루라기' },
      { id: 'run', icon: '🏃', label: '운동 소리' },
    ],
    alternatives: [{ icon: '⌨️', label: '글자판 꽂기' }, { icon: '🛡️', label: '마이크 가리개' }],
  },
];

export default function SttAudioCleanerGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const [cleared, setCleared] = useState<string[]>([]);
  const [alternative, setAlternative] = useState('');
  useEffect(() => {
    setCleared([]);
    setAlternative('');
  }, [game.round, game.stageIndex]);

  const clearNoise = (id: string) => {
    if (game.status !== 'playing' || alternative) return;
    const next = [...cleared, id];
    setCleared(next);
    if (next.length === stage.noises.length) {
      game.succeed('소음 덩어리를 모두 치워 말소리가 또렷한 글자로 바뀌었어요!');
    }
  };

  const plugAlternative = (label: string) => {
    if (game.status !== 'playing') return;
    setAlternative(label);
    game.succeed(`${label} 방법으로 바꾸자 소음과 상관없이 뜻이 또렷하게 전달됐어요!`);
  };

  const clearRatio = alternative ? 1 : cleared.length / stage.noises.length;

  return (
    <MiniGameFrame
      badge="소음 덩어리 치우기"
      instruction="파형 위 소음 덩어리를 눌러 치우세요. 또는 글자·그림 입력 도구를 꽂아 나에게 편한 길로 바꿔도 됩니다."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].place)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <span className="w-full text-center text-[15px] font-black" style={{ color: 'var(--ink-2)' }}>
            소음을 치우거나 다른 입력 도구를 꽂아 보세요
          </span>
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다른 방법 써 보기" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="rounded-xl border-2 border-pink-300/60 bg-pink-950/60 px-3 py-2">
          <p className="text-[15px] font-black text-pink-200">🎙️ {stage.place}</p>
          <p className="text-[14px] font-bold text-slate-300">원래 말: “{stage.target}”</p>
        </div>

        <div className="relative min-h-[150px] flex-1 overflow-hidden rounded-xl border-4 border-slate-500 bg-slate-950">
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 items-center justify-center gap-1" aria-hidden="true">
            {[35, 70, 42, 88, 52, 76, 38, 64, 46, 82, 55, 68].map((height, index) => (
              <span
                key={index}
                className={`w-2 rounded-full transition-all ${clearRatio >= 1 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                style={{ height: `${clearRatio >= 1 ? height * 0.45 : height * 0.75}px` }}
              />
            ))}
          </div>
          {stage.noises.map((noise, index) => {
            const gone = cleared.includes(noise.id) || Boolean(alternative);
            return (
              <button
                key={noise.id}
                type="button"
                onClick={() => clearNoise(noise.id)}
                disabled={gone || game.status !== 'playing'}
                className={`absolute min-h-14 min-w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 px-3 text-[14px] font-black transition-all ${
                  gone
                    ? 'scale-0 border-transparent opacity-0'
                    : 'border-rose-300 bg-rose-900 text-white motion-safe:animate-pulse'
                }`}
                style={{ left: `${22 + index * 28}%`, top: `${30 + (index % 2) * 42}%` }}
              >
                {noise.icon} {noise.label}
              </button>
            );
          })}
        </div>

        <div className={`rounded-xl border-2 p-3 text-center transition-all ${clearRatio >= 1 ? 'border-emerald-300 bg-emerald-950' : 'border-rose-300 bg-rose-950'}`}>
          <p className="text-[14px] font-black text-slate-300">아이미가 적은 글자</p>
          <p className={`text-[17px] font-black ${clearRatio >= 1 ? 'text-emerald-200' : 'text-rose-200 line-through'}`}>
            {clearRatio >= 1 ? `✨ ${stage.target}` : `❌ ${stage.noisy}`}
          </p>
        </div>

        <div className="flex gap-2">
          {stage.alternatives.map((tool) => (
            <button
              key={tool.label}
              type="button"
              onClick={() => plugAlternative(tool.label)}
              disabled={game.status !== 'playing'}
              className="min-h-12 flex-1 rounded-xl border-2 border-sky-300 bg-sky-900 text-[14px] font-black text-white disabled:opacity-45"
            >
              {tool.icon} {tool.label}
            </button>
          ))}
        </div>
      </div>
    </MiniGameFrame>
  );
}
