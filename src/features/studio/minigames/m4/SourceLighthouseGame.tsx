import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'notice', label: '기본', topic: '행사 시간' },
  { id: 'route', label: '1단계', topic: '버스 우회' },
  { id: 'weather', label: '2단계', topic: '오늘 예보' },
];
const SOURCES = [
  { name: '이름 없는 게시글', author: false, fresh: true, official: false },
  { name: '작년 공식 공지', author: true, fresh: false, official: true },
  { name: '오늘 공식 공지', author: true, fresh: true, official: true },
];

export default function SourceLighthouseGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const [scanned, setScanned] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  useEffect(() => {
    setScanned([]);
    setChosen(null);
  }, [game.round, game.stageIndex]);

  const choose = () => {
    if (chosen === null || scanned.length < SOURCES.length) return;
    const source = SOURCES[chosen];
    if (source.author && source.fresh && source.official) game.succeed('작성자·날짜·공식 표시가 모두 밝은 등대를 골랐어요!');
    else game.fail('등불 하나가 어두워요. 세 렌즈가 모두 밝은 자료를 골라요.');
  };

  return (
    <MiniGameFrame
      badge="자료 등대 비추기"
      instruction="각 등대를 눌러 작성자·날짜·공식 표시 렌즈를 비춘 뒤 세 불이 모두 밝은 등대를 고르세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].topic)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={choose} disabled={chosen === null || scanned.length < 3} emoji="🔦" label="이 등대 사용" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 비교" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 items-end gap-2">
        {SOURCES.map((source, index) => {
          const seen = scanned.includes(index);
          return (
            <button
              key={source.name}
              type="button"
              onClick={() => {
                setScanned((items) => (items.includes(index) ? items : [...items, index]));
                setChosen(index);
              }}
              className={`flex min-h-[190px] flex-1 flex-col items-center justify-end rounded-t-[42px] border-4 p-2 text-[14px] font-black text-white ${
                chosen === index ? 'border-amber-300 bg-slate-700' : 'border-slate-500 bg-slate-900'
              }`}
            >
              <span className="mb-auto text-[38px]" aria-hidden="true">
                {seen ? '🔆' : '🌑'}
              </span>
              {seen && (
                <span className="mb-2 flex flex-col gap-1">
                  <span>{source.author ? '🟢 작성자' : '🔴 작성자 없음'}</span>
                  <span>{source.fresh ? '🟢 최신' : '🔴 오래됨'}</span>
                  <span>{source.official ? '🟢 공식' : '🔴 비공식'}</span>
                </span>
              )}
              {source.name}
            </button>
          );
        })}
      </div>
    </MiniGameFrame>
  );
}
