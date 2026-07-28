import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m3-l4 「낱말을 문장에서 써 보기」 — 낱말 강도 다이얼.
 *
 * 낱말을 빈칸에 넣는 문제가 아니라 **얼마나 센 말인지**를 맞추는 문제로 바꿨다.
 * 다이얼은 반대말에서 낱말로 이어지는 연속된 눈금이고, 장면마다 어울리는 구간이 있다.
 * 정답이 한 점이 아니라 구간이라 같은 장면에도 여러 표현이 어울린다.
 */

interface Scene {
  id: string;
  emoji: string;
  text: string;
  band: [number, number];
}

interface Stage {
  id: string;
  tab: string;
  /** 반대말 → 낱말로 이어지는 눈금. 각 구간의 이름 */
  words: string[];
  lowLabel: string;
  highLabel: string;
  scenes: Scene[];
}

const STAGES: Stage[] = [
  {
    id: 'temp',
    tab: '온도',
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
    tab: '소리',
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
    tab: '아픔',
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

function wordAt(stage: Stage, value: number): string {
  const i = Math.min(stage.words.length - 1, Math.floor((value / 100) * stage.words.length));
  return stage.words[i];
}

export default function WordIntensityDialGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    hintAllowed,
    status,
    message,
    round,
    isLocked,
    goToStage,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length });

  const stage = STAGES[stageIndex];
  const [sceneIdx, setSceneIdx] = useState(0);
  const [value, setValue] = useState(50);

  useEffect(() => {
    setSceneIdx(0);
    setValue(50);
  }, [round, stageIndex]);

  const scene = stage.scenes[sceneIdx];
  const inBand = value >= scene.band[0] && value <= scene.band[1];
  const center = (scene.band[0] + scene.band[1]) / 2;
  const closeness = 1 - Math.min(1, Math.abs(value - center) / 50);

  const handleHint = () => setValue(Math.round(center));

  const handleConfirm = () => {
    if (status !== 'playing') return;
    if (!inBand) {
      fail(
        value < scene.band[0]
          ? '너무 약한 말이라 장면과 안 어울려요.'
          : '너무 센 말이라 장면과 안 어울려요.',
      );
      return;
    }
    if (sceneIdx + 1 >= stage.scenes.length) {
      succeed('세 장면 모두 어울리는 말로 표현했어요!');
      return;
    }
    setSceneIdx((i) => i + 1);
    setValue(50);
  };

  return (
    <MiniGameFrame
      badge="낱말 강도 맞추기"
      instruction="같은 뜻이라도 센 말과 약한 말이 있어요. 다이얼을 움직여 장면에 어울리는 세기를 찾아 보세요. 어울리는 구간은 넓어서 딱 한 점만 정답은 아니에요."
      accent="var(--brand-ink)"
      progress={{ label: '맞춘 장면', value: sceneIdx, max: stage.scenes.length }}
      stages={STAGES.slice(0, visibleStageCount).map((s) => ({ id: s.id, label: s.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, `${STAGES[index].lowLabel} 다이얼`)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="다시" />
          {hintAllowed && (
            <MiniGameButton onClick={handleHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={handleConfirm}
            disabled={status !== 'playing'}
            emoji="✅"
            label="이 말로 하기"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        {/* 장면 */}
        <div className="rounded-xl border-2 border-slate-600/50 bg-slate-900/60 px-3 py-3 text-center">
          <span className="text-4xl leading-none" aria-hidden="true">
            {scene.emoji}
          </span>
          <p className="mt-1 text-[14px] font-bold text-slate-100">{scene.text}</p>
        </div>

        {/* 만들어지는 문장 */}
        <div
          className="rounded-xl border-2 px-3 py-2 text-center transition-colors"
          style={{
            borderColor: inBand ? '#4ade80' : 'rgba(148,163,184,0.45)',
            background: inBand ? 'rgba(22,163,74,0.22)' : 'rgba(30,41,59,0.9)',
          }}
        >
          <p className="text-[14px] font-black text-slate-400">내 문장</p>
          <p className="text-[15px] font-black text-slate-50">
            {scene.text} — <span className="text-amber-300">{wordAt(stage, value)}</span> 느낌
          </p>
        </div>

        {/* 다이얼 */}
        <div>
          <div className="mb-1 flex justify-between text-[14px] font-black text-slate-400">
            <span>← {stage.lowLabel}</span>
            <span>{stage.highLabel} →</span>
          </div>
          <div className="relative">
            {/* 어울리는 구간 표시는 힌트를 쓸 수 있을 때만 보여 준다 */}
            {hintAllowed && (
              <div
                className="pointer-events-none absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-emerald-400/25"
                style={{
                  left: `${scene.band[0]}%`,
                  width: `${scene.band[1] - scene.band[0]}%`,
                }}
                aria-hidden="true"
              />
            )}
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={value}
              disabled={status !== 'playing'}
              onChange={(e: any) => setValue(Number(e.target.value))}
              aria-label="낱말 강도"
              className="relative w-full"
              style={{ accentColor: inBand ? '#34d399' : '#4FC3E8' }}
            />
          </div>
          <div className="mt-1 flex justify-between">
            {stage.words.map((w) => (
              <span key={w} className="flex-1 text-center text-[14px] font-bold text-slate-500">
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* 어울림 반응 */}
        <p className="text-center text-2xl leading-none" aria-hidden="true">
          {inBand ? '😊' : closeness > 0.6 ? '🙂' : '😐'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
