import React, { useState } from 'react';
import { useSpeak } from '../../../hooks/useSpeak';

interface Stage {
  id: string;
  location: string;
  noiseType: string;
  emoji: string;
  targetText: string;
  noisyText: string;
  hint: string;
  options: {
    id: string;
    label: string;
    emoji: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const STAGES: Stage[] = [
  {
    id: 'hallway',
    location: '1단계 · 시끄러운 복도',
    noiseType: '친구들의 왁자지껄 복도 대화 소음',
    emoji: '🏫',
    targetText: '체험회에 놀러 오세요!',
    noisyText: '채소회 오이 사세요...',
    hint: '소음이 심해서 말소리 특징이 뭉개졌어요. 소음을 피하거나 입력 환경을 바꿔요!',
    options: [
      {
        id: 'quiet-mic',
        label: '조용한 교실로 가고 마이크를 가까이 대기',
        emoji: '🎙️',
        isCorrect: true,
        feedback: '정답! 복도 소음이 사라지고 마이크가 가까워져 소리가 선명하게 입력되었습니다!',
      },
      {
        id: 'text-card',
        label: '글자판으로 직접 써서 보여주기',
        emoji: '⌨️',
        isCorrect: true,
        feedback: '정답! 소음 환경에서는 글자 직접 입력이 아주 명확하고 확실해요!',
      },
      {
        id: 'shout-loud',
        label: '소음 속에서 무작정 소리만 크게 지르기',
        emoji: '📢',
        isCorrect: false,
        feedback: '아쉬워요! 소음이 섞인 상태에서 크게 지르면 여전히 소리가 뭉개져요.',
      },
    ],
  },
  {
    id: 'gym',
    location: '2단계 · 울리는 체육관',
    noiseType: '넓은 체육관의 웅웅대는 스피커 울림',
    emoji: '🏀',
    targetText: '다음 장소는 강당 2층입니다!',
    noisyText: '다 앙동 장소는 가 당 이 층...',
    hint: '스피커 소리가 벽에 반사되어 웅웅 울려요. 어떤 표현 방법이 좋을까요?',
    options: [
      {
        id: 'picture-card',
        label: '그림 카드로 장소 위치 보여주기',
        emoji: '🖼️',
        isCorrect: true,
        feedback: '정답! 그림 카드는 소리 울림과 상관없이 정확하게 뜻을 전달합니다!',
      },
      {
        id: 'listen-check',
        label: '안내판 글자와 비교하며 다시 확인하기',
        emoji: '📜',
        isCorrect: true,
        feedback: '정답! 음성 자막만 믿지 않고 사람이나 안내판 표지로 직접 확인해요!',
      },
      {
        id: 'guess-wrong',
        label: '울려서 엉킨 자막 글자만 믿고 바로 가기',
        emoji: '🏃',
        isCorrect: false,
        feedback: '아쉬워요! 울림 소음으로 잘려 나간 글자를 확인 없이 믿으면 길을 잃을 수 있어요.',
      },
    ],
  },
  {
    id: 'playground',
    location: '3단계 · 바람 부는 운동장',
    noiseType: '강한 바람 소리와 운동장 체육 소음',
    emoji: '⚽',
    targetText: '파란색 모자를 준비하세요!',
    noisyText: '바른 모자 준 비...',
    hint: '바람이 마이크에 들어가 소리 특징을 가렸어요. 어떻게 해결할까요?',
    options: [
      {
        id: 'wind-shield',
        label: '마이크 바람막이를 가리고 천천히 말하기',
        emoji: '🛡️',
        isCorrect: true,
        feedback: '정답! 바람을 막아주고 천천히 말하면 마이크가 소리를 또렷하게 찾아내요!',
      },
      {
        id: 'combo-input',
        label: '글자판과 그림 카드로 함께 보여주기',
        emoji: '💬',
        isCorrect: true,
        feedback: '정답! 바람 소리가 심할 때 글자와 그림 카드는 최고의 의사소통 방법입니다!',
      },
      {
        id: 'blame-speaker',
        label: '말한 사람 발음이 틀렸다고 탓하기',
        emoji: '😠',
        isCorrect: false,
        feedback: '아쉬워요! 음성 인식 오류는 환경 소음 때문이지 말한 사람 때문이 아니에요.',
      },
    ],
  },
];

export default function SttAudioCleanerGame() {
  const { speakNow } = useSpeak();
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [clearedStages, setClearedStages] = useState<number[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [isFixedText, setIsFixedText] = useState(false);

  const stage = STAGES[currentStageIdx];
  const isCompletedAll = clearedStages.length === STAGES.length;

  const handleSelectOption = (opt: Stage['options'][0]) => {
    setSelectedOptionId(opt.id);
    setFeedback({ text: opt.feedback, isCorrect: opt.isCorrect });
    speakNow(opt.feedback);

    if (opt.isCorrect) {
      setIsFixedText(true);
      if (!clearedStages.includes(currentStageIdx)) {
        setClearedStages((prev) => [...prev, currentStageIdx]);
      }
    } else {
      setIsFixedText(false);
    }
  };

  const handleNextStage = () => {
    setSelectedOptionId(null);
    setFeedback(null);
    setIsFixedText(false);
    if (currentStageIdx < STAGES.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStageIdx(0);
    setClearedStages([]);
    setSelectedOptionId(null);
    setFeedback(null);
    setIsFixedText(false);
  };

  return (
    <div className="relative flex h-full flex-col justify-between rounded-2xl border-2 border-pink-400/50 bg-slate-900 p-5 md:p-6 text-white shadow-xl overflow-y-auto">
      {/* 상단 뷰 타이틀 및 단계 헤더 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-500 text-lg font-black shadow-md">
              🎙️
            </span>
            <div>
              <span className="text-[11px] font-black tracking-widest text-pink-300 uppercase">
                AI 음성 인식 실험 미니게임
              </span>
              <h2 className="text-lg font-black text-white leading-tight">
                소음 제거 & 정확한 입력 마스터
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            {STAGES.map((_, idx) => (
              <span
                key={idx}
                className={`text-xs ${clearedStages.includes(idx) ? 'text-amber-400 font-bold' : 'text-slate-500'}`}
              >
                {clearedStages.includes(idx) ? '★' : '☆'}
              </span>
            ))}
          </div>
        </div>

        {/* 미니게임 전체 완료 축하 화면 */}
        {isCompletedAll ? (
          <div className="my-auto flex flex-col items-center justify-center space-y-4 py-8 text-center bg-slate-800/90 rounded-2xl border-2 border-amber-400 p-6 shadow-2xl animate-fade-in">
            <div className="text-5xl animate-bounce">🏆</div>
            <h3 className="text-2xl font-black text-amber-300">
              축하합니다! 음성 인식 마스터!
            </h3>
            <p className="text-xs font-semibold text-slate-200 leading-relaxed max-w-xs">
              복도, 체육관, 운동장의 모든 소음 환경을 극복하고 나에게 맞는 최적의 입력 방법을 찾아냈어요!
            </p>
            <div className="p-3 bg-pink-950/60 rounded-xl border border-pink-500/40 text-pink-200 text-xs font-bold">
              💡 핵심 배움: 음성 인식 오류가 생기면 소음을 피하고, 마이크를 가까이대거나 글자·그림 카드를 함께 활용해요!
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 cursor-pointer rounded-full bg-gradient-to-r from-pink-500 to-amber-500 px-6 py-2.5 text-sm font-black text-slate-950 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              🔄 미니게임 다시 도전하기
            </button>
          </div>
        ) : (
          <>
            {/* Stage Location Badge */}
            <div className="flex items-center justify-between rounded-xl bg-slate-800/90 p-3 border border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xl">{stage.emoji}</span>
                <div>
                  <h3 className="text-sm font-extrabold text-pink-300">{stage.location}</h3>
                  <p className="text-[11px] text-slate-400">{stage.noiseType}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => speakNow(`${stage.location}. ${stage.noiseType}. 원래 말한 문장: ${stage.targetText}`)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/20 text-pink-300 hover:bg-pink-500/40 transition cursor-pointer"
                title="설명 듣기"
              >
                🔊
              </button>
            </div>

            {/* AI Aimi Audio Screen Simulation */}
            <div className="relative rounded-2xl border-2 border-pink-500/40 bg-slate-950 p-4 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 text-pink-400">
                  <span>🌸</span> 아이미 화면 (STT 음성 인식)
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${isFixedText ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' : 'bg-rose-500/30 text-rose-300 border border-rose-500/50'}`}>
                  {isFixedText ? '🟢 선명한 변환 성공' : '🔴 소음으로 왜곡됨'}
                </span>
              </div>

              {/* Sound Wave Animation Visualizer */}
              <div className="flex items-center justify-center gap-1 h-8 my-2 px-4 bg-slate-900/80 rounded-lg border border-slate-800">
                {[40, 70, 30, 90, 50, 80, 40, 60, 30, 85, 45, 75, 55, 35].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-300 ${isFixedText ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400 animate-ping'}`}
                    style={{ height: `${isFixedText ? Math.min(h * 0.5, 20) : h * 0.3}px` }}
                  />
                ))}
              </div>

              {/* Speech Output Box */}
              <div className="mt-2 rounded-xl p-3 bg-slate-900 border border-slate-800 text-center">
                <div className="text-[11px] font-bold text-slate-400 mb-1">
                  원래 말소리: <span className="text-amber-300">"{stage.targetText}"</span>
                </div>
                <div className={`text-base font-black tracking-wide transition-all ${isFixedText ? 'text-emerald-300 scale-105' : 'text-rose-400 line-through decoration-rose-500/60'}`}>
                  {isFixedText ? `✨ ${stage.targetText}` : `❌ "${stage.noisyText}"`}
                </div>
              </div>
            </div>

            {/* Hint Box */}
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs text-amber-200 font-medium leading-relaxed flex items-start gap-2">
              <span className="shrink-0 text-base">💡</span>
              <span>{stage.hint}</span>
            </div>

            {/* Interactive Options */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-300">
                👇 어떻게 해결할까요? (해결 방법을 클릭해 보세요)
              </p>
              <div className="grid gap-2">
                {stage.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left text-xs font-extrabold transition-all cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-md ring-2 ring-emerald-400/40'
                            : 'bg-rose-950/80 border-rose-400 text-rose-200 shadow-md'
                          : 'bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 hover:border-slate-600 text-slate-100'
                      }`}
                    >
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <span className="flex-1 leading-snug">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Message */}
            {feedback && (
              <div className={`p-3 rounded-xl border-2 text-xs font-bold leading-relaxed animate-fade-in ${feedback.isCorrect ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200' : 'bg-rose-950/90 border-rose-400 text-rose-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm flex items-center gap-1">
                    {feedback.isCorrect ? '🎉 피드백 성공!' : '⚠️ 피드백 다시 시도'}
                  </span>
                  {feedback.isCorrect && currentStageIdx < STAGES.length - 1 && (
                    <button
                      type="button"
                      onClick={handleNextStage}
                      className="cursor-pointer px-3 py-1 bg-emerald-400 text-slate-950 font-black rounded-lg text-xs hover:bg-emerald-300 transition"
                    >
                      다음 단계 ▶
                    </button>
                  )}
                </div>
                <p>{feedback.text}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
