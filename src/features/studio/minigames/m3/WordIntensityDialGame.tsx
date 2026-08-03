import React, { useEffect, useMemo, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

interface Scene {
  id: string;
  emoji: string;
  text: string;
  band: [number, number];
}

interface Stage {
  id: string;
  tab: string;
  words: string[];
  lowLabel: string;
  highLabel: string;
  scenes: Scene[];
}

const STAGES: Stage[] = [
  {
    id: 'temp',
    tab: '기본',
    lowLabel: '차갑다',
    highLabel: '뜨겁다',
    words: ['아주 차가운', '차가운', '미지근한', '따뜻한', '뜨거운'],
    scenes: [
      { id: 't1', emoji: '☀️', text: '한여름 운동장에서 마시는 물', band: [0, 26] },
      { id: 't2', emoji: '🌸', text: '봄날 교실 안 공기', band: [38, 62] },
      { id: 't3', emoji: '☕', text: '겨울에 들어와 마시는 코코아', band: [72, 100] },
    ],
  },
  {
    id: 'sound',
    tab: '1단계',
    lowLabel: '조용하다',
    highLabel: '시끄럽다',
    words: ['아주 조용한', '조용한', '보통인', '시끄러운', '아주 시끄러운'],
    scenes: [
      { id: 's1', emoji: '📚', text: '책 읽는 도서관 안', band: [0, 26] },
      { id: 's2', emoji: '🏫', text: '수업 중인 교실', band: [30, 55] },
      { id: 's3', emoji: '🏃', text: '쉬는 시간 복도', band: [72, 100] },
    ],
  },
  {
    id: 'pain',
    tab: '2단계',
    lowLabel: '조금 아프다',
    highLabel: '많이 아프다',
    words: ['거의 안 아픈', '조금 아픈', '아픈', '많이 아픈', '너무 아픈'],
    scenes: [
      { id: 'p1', emoji: '🦟', text: '모기 물린 자리', band: [0, 26] },
      { id: 'p2', emoji: '🩹', text: '넘어져 무릎이 까짐', band: [34, 60] },
      { id: 'p3', emoji: '🤒', text: '열이 나고 어지러움', band: [74, 100] },
    ],
  },
];

function wordValue(index: number): number {
  return index * 25;
}

export default function WordIntensityDialGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const stage = STAGES[game.stageIndex];
  const [sceneIdx, setSceneIdx] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setSceneIdx(0);
    setSelectedIndex(null);
  }, [game.round, game.stageIndex]);

  const scene = stage.scenes[sceneIdx];
  const allowedIndexes = useMemo(
    () => stage.words.map((_, index) => index).filter((index) => wordValue(index) >= scene.band[0] && wordValue(index) <= scene.band[1]),
    [scene, stage.words],
  );
  const selectedWord = selectedIndex === null ? null : stage.words[selectedIndex];
  const inBand = selectedIndex !== null && allowedIndexes.includes(selectedIndex);

  const chooseWord = (index: number) => {
    if (game.status !== 'playing') return;
    setSelectedIndex(index);
  };

  const handleHint = () => setSelectedIndex(allowedIndexes[0] ?? 0);

  const handleConfirm = () => {
    if (game.status !== 'playing') return;
    if (selectedIndex === null) {
      game.fail('장면을 보고 낱말 카드를 하나 골라 문장 칸에 붙여 보세요.');
      return;
    }
    if (!inBand) {
      game.fail(selectedIndex < allowedIndexes[0] ? '장면보다 약한 낱말이에요. 조금 더 선명한 카드를 골라 보세요.' : '장면보다 센 낱말이에요. 조금 부드러운 카드를 골라 보세요.');
      return;
    }
    if (sceneIdx + 1 >= stage.scenes.length) {
      game.succeed('세 장면에 알맞은 낱말 카드를 모두 붙였어요!');
      return;
    }
    setSceneIdx((index) => index + 1);
    setSelectedIndex(null);
  };

  return (
    <MiniGameFrame
      badge="장면에 낱말 카드 붙이기"
      instruction="장면을 살펴보고 낱말 카드를 하나 골라 문장 칸에 붙이세요. 다이얼 대신 카드의 세기가 장면의 표정을 바꿉니다."
      accent="var(--brand-ink)"
      progress={{ label: '완성한 장면', value: sceneIdx, max: stage.scenes.length }}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].lowLabel}부터 낱말 카드 붙이기`)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🔄" label="다시 붙이기" />
          {game.hintAllowed && <MiniGameButton onClick={handleHint} disabled={game.isLocked} emoji="💡" label="알맞은 카드" />}
          <MiniGameButton onClick={handleConfirm} disabled={game.status !== 'playing'} emoji="📌" label="문장에 붙이기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        <section className="rounded-xl border-2 border-amber-300/60 bg-amber-950/45 p-2.5 text-center" aria-label="장면 카드">
          <span className="text-4xl" aria-hidden="true">{scene.emoji}</span>
          <p className="mt-1 text-[15px] font-black text-white">{scene.text}</p>
          <p className="text-[13px] font-bold text-amber-100">{stage.lowLabel} ← 장면의 세기 → {stage.highLabel}</p>
        </section>

        <section className="rounded-xl border-2 border-sky-300/60 bg-sky-950/45 p-2.5" aria-label="낱말 카드 더미">
          <h3 className="mb-1 text-[14px] font-black text-sky-100">낱말 카드 더미</h3>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
            {stage.words.map((word, index) => {
              const selected = selectedIndex === index;
              return (
                <button
                  key={word}
                  type="button"
                  aria-pressed={selected}
                  disabled={game.status !== 'playing'}
                  onClick={() => chooseWord(index)}
                  className="min-h-16 rounded-lg border-2 px-2 py-1 text-[14px] font-black text-white transition disabled:opacity-45"
                  style={{ borderColor: selected ? '#fbbf24' : 'rgba(148,163,184,0.5)', background: selected ? 'rgba(146,64,14,0.8)' : 'rgba(15,23,42,0.62)' }}
                >
                  <span className="block text-lg" aria-hidden="true">{['🧊', '🌿', '🌤️', '🔥', '🌋'][index]}</span>
                  {word}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border-2 border-emerald-300/60 bg-emerald-950/45 p-2.5" aria-live="polite">
          <p className="text-[14px] font-black text-emerald-200">문장 카드</p>
          <div className="mt-1 flex min-h-16 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-emerald-200/60 bg-slate-950/45 px-2 text-center">
            <span className="text-[15px] font-bold text-white">{scene.text} —</span>
            {selectedWord ? <span className={`rounded-lg border-2 px-2 py-1 text-[15px] font-black ${inBand ? 'border-emerald-300 bg-emerald-900 text-emerald-100' : 'border-orange-300 bg-orange-950 text-orange-100'}`}>{selectedWord}</span> : <span className="text-[13px] font-bold text-slate-400">낱말 카드를 붙여요</span>}
          </div>
          <p className="mt-1 text-center text-[13px] font-bold text-emerald-100">{selectedWord ? (inBand ? '장면과 잘 어울리는 카드예요.' : '장면을 다시 보고 카드를 바꿔 보세요.') : '카드를 누르면 장면의 말이 바뀌어요.'}</p>
        </section>
      </div>
    </MiniGameFrame>
  );
}
