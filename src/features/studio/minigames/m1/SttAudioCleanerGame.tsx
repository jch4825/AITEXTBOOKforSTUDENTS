import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';
import MicButton from '../../../../components/MicButton';

type InputMode = 'speech' | 'text' | 'picture';

interface PictureCard {
  id: string;
  icon: string;
  label: string;
}

interface Stage {
  id: string;
  label: string;
  place: string;
  target: string;
  noisy: string;
  pictureCards: PictureCard[];
}

const STAGES: Stage[] = [
  {
    id: 'hallway',
    label: '기본',
    place: '시끄러운 복도',
    target: '체험회에 놀러 오세요!',
    noisy: '채소회 오이 사세요…',
    pictureCards: [
      { id: 'event', icon: '🎪', label: '체험회' },
      { id: 'welcome', icon: '📣', label: '놀러 오세요' },
    ],
  },
  {
    id: 'gym',
    label: '1단계',
    place: '울리는 체육관',
    target: '다음 장소는 강당 2층입니다!',
    noisy: '다 앙동 장소는 가 당 이 층…',
    pictureCards: [
      { id: 'next-place', icon: '📍', label: '다음 장소' },
      { id: 'gym-floor', icon: '🏫', label: '강당 2층' },
    ],
  },
  {
    id: 'field',
    label: '2단계',
    place: '바람 부는 운동장',
    target: '파란색 모자를 준비하세요!',
    noisy: '바른 모자 준 비…',
    pictureCards: [
      { id: 'blue', icon: '🔵', label: '파란색' },
      { id: 'hat', icon: '🧢', label: '모자 준비' },
    ],
  },
];

const INPUT_MODES: { id: InputMode; icon: string; label: string }[] = [
  { id: 'speech', icon: '🗣️', label: '말하기' },
  { id: 'text', icon: '⌨️', label: '글자' },
  { id: 'picture', icon: '🖼️', label: '그림 카드' },
];

const WAVEFORM = [34, 62, 44, 82, 52, 74, 38, 92, 48, 70, 42, 58, 30, 78, 46, 66];

function normalizeText(value: string) {
  return value.replace(/[\s.,!?。！？，、'"“”‘’]/g, '').toLowerCase();
}

export default function SttAudioCleanerGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({
    supportLevel,
    stageCount: STAGES.length,
    // 실패 문장을 읽고 다른 입력 방법으로 바꿀 시간을 보장한다.
    autoResetOnFailMs: 0,
  });
  const stage = STAGES[game.stageIndex];
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [quiet, setQuiet] = useState(false);
  const [text, setText] = useState('');
  const [speechText, setSpeechText] = useState('');
  const [selectedPictures, setSelectedPictures] = useState<string[]>([]);

  useEffect(() => {
    setInputMode('text');
    setQuiet(false);
    setText('');
    setSpeechText('');
    setSelectedPictures([]);
  }, [game.round, game.stageIndex]);

  const chooseMode = (mode: InputMode) => {
    if (game.status === 'success') return;
    if (game.status === 'fail') game.retry();
    setInputMode(mode);
  };

  const togglePicture = (id: string) => {
    if (game.status !== 'playing') return;
    setSelectedPictures((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const send = () => {
    if (game.status !== 'playing') return;

    if (inputMode === 'picture') {
      if (selectedPictures.length !== stage.pictureCards.length) {
        game.fail('그림 카드 두 장을 모두 골라 뜻을 완성해 보세요.');
        return;
      }
      game.succeed(`그림 카드로 “${stage.target}” 뜻을 또렷하게 전했어요!`);
      return;
    }

    const received = inputMode === 'speech' ? speechText : text;
    if (!received.trim()) {
      game.fail(inputMode === 'speech'
        ? '마이크로 말한 뒤, 아이미가 받은 글자를 확인해 보세요.'
        : '전할 문장을 글자로 적어 보세요.');
      return;
    }

    if (inputMode === 'speech' && !quiet) {
      game.fail('복도 소음이 아직 남아 있어요. 조용한 곳으로 옮기거나 글자·그림 카드를 써 보세요.');
      return;
    }

    if (normalizeText(received) !== normalizeText(stage.target)) {
      game.fail(`받은 글자 “${received}”가 원래 안내와 달라요. 글자·그림 카드로 바꿔도 좋아요.`);
      return;
    }

    game.succeed(`${inputMode === 'speech' ? '말' : '글자'}로 “${stage.target}” 뜻을 정확히 전했어요!`);
  };

  const receivedSpeech = speechText || (quiet ? '아직 받은 글자가 없어요' : stage.noisy);
  const selectedLabels = stage.pictureCards
    .filter((card) => selectedPictures.includes(card.id))
    .map((card) => card.label)
    .join(' · ');

  return (
    <MiniGameFrame
      badge="소음 속 입력 방법 실험"
      instruction="원래 안내와 받은 글자를 비교한 뒤, 말·글자·그림 카드 중 편하고 정확한 방법으로 뜻을 전하세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].place)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={send} emoji="📨" label="이 뜻으로 전달하기" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다른 방법으로 다시 하기" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        <div className={`rounded-xl border-2 px-3 py-2 ${quiet ? 'border-emerald-300/70 bg-emerald-950/70' : 'border-pink-300/60 bg-pink-950/60'}`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className={`text-[15px] font-black ${quiet ? 'text-emerald-200' : 'text-pink-200'}`}>
                {quiet ? '🔇 조용한 교실' : `🎙️ ${stage.place}`}
              </p>
              <p className="text-[14px] font-bold text-slate-200">원래 안내: “{stage.target}”</p>
            </div>
            <button
              type="button"
              onClick={() => setQuiet(true)}
              disabled={quiet || game.status !== 'playing'}
              className="min-h-11 shrink-0 rounded-lg border-2 border-emerald-300 bg-emerald-900 px-2 text-[14px] font-black text-white disabled:opacity-50"
            >
              {quiet ? '조건 바꿈' : '조용한 곳으로 옮기기'}
            </button>
          </div>
        </div>

        <div className="rounded-xl border-2 border-slate-500 bg-slate-950 p-2.5">
          <div className="flex h-14 items-center justify-center gap-1" aria-hidden="true">
            {WAVEFORM.map((height, index) => (
              <span
                key={index}
                className={`w-1.5 rounded-full transition-all duration-300 ${quiet ? 'bg-emerald-400' : 'bg-rose-400 motion-safe:animate-pulse'}`}
                style={{ height: `${height * (quiet ? 0.6 : 0.85)}%` }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between gap-2 text-[14px] font-black text-slate-300">
            <span>{quiet ? '소리가 선명해졌어요' : '소음이 섞인 입력'}</span>
            <span>{inputMode === 'speech' ? '말' : inputMode === 'text' ? '글자' : '그림 카드'} 경로</span>
          </div>
        </div>

        <div role="tablist" aria-label="입력 방법 선택" className="grid grid-cols-3 gap-1.5">
          {INPUT_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={inputMode === mode.id}
              onClick={() => chooseMode(mode.id)}
              className="min-h-11 rounded-lg border-2 px-1 py-1 text-[14px] font-black transition"
              style={{
                borderColor: inputMode === mode.id ? '#38bdf8' : 'rgba(148,163,184,0.5)',
                background: inputMode === mode.id ? 'rgba(14,116,144,0.75)' : 'rgba(30,41,59,0.9)',
                color: '#fff',
              }}
            >
              {mode.icon} {mode.label}
            </button>
          ))}
        </div>

        {inputMode === 'speech' && (
          <div className="flex flex-col gap-2 rounded-xl border-2 border-sky-300/60 bg-sky-950/40 p-2.5">
            <div className="flex items-center gap-2">
              <MicButton
                accent="#38bdf8"
                disabled={game.status !== 'playing'}
                onStart={() => setSpeechText('')}
                onResult={setSpeechText}
              />
              <div>
                <p className="text-[15px] font-black text-sky-100">말로 입력하기</p>
                <p className="text-[14px] font-bold text-slate-300">마이크는 선택 사항이에요. 안 되면 글자나 그림 카드를 써요.</p>
              </div>
            </div>
            <div role="status" className="rounded-lg border border-slate-500/60 bg-slate-900/80 px-2 py-1.5 text-[15px] font-black text-white">
              아이미가 받은 글자: “{receivedSpeech}”
            </div>
          </div>
        )}

        {inputMode === 'text' && (
          <label className="flex flex-col gap-1 rounded-xl border-2 border-sky-300/60 bg-sky-950/40 p-2.5 text-[14px] font-black text-sky-100">
            글자로 입력하기
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={game.status !== 'playing'}
              aria-label="전할 문장 글자로 입력하기"
              placeholder={stage.target}
              className="min-h-12 rounded-lg border-2 border-sky-300 bg-white px-3 text-[16px] font-bold text-slate-900 outline-none"
            />
          </label>
        )}

        {inputMode === 'picture' && (
          <div className="flex flex-col gap-2 rounded-xl border-2 border-sky-300/60 bg-sky-950/40 p-2.5">
            <p className="text-[14px] font-black text-sky-100">그림 카드를 골라 뜻을 완성하세요.</p>
            <div className="grid grid-cols-2 gap-1.5">
              {stage.pictureCards.map((card) => {
                const selected = selectedPictures.includes(card.id);
                return (
                  <button
                    key={card.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => togglePicture(card.id)}
                    disabled={game.status !== 'playing'}
                    className="min-h-16 rounded-xl border-2 px-2 py-1 text-[15px] font-black text-white transition disabled:opacity-50"
                    style={{
                      borderColor: selected ? '#34d399' : 'rgba(148,163,184,0.6)',
                      background: selected ? 'rgba(6,95,70,0.8)' : 'rgba(30,41,59,0.9)',
                    }}
                  >
                    <span className="mr-1 text-xl" aria-hidden="true">{card.icon}</span>
                    {card.label}
                  </button>
                );
              })}
            </div>
            <div role="status" className="rounded-lg border border-slate-500/60 bg-slate-900/80 px-2 py-1.5 text-[14px] font-black text-white">
              {selectedLabels ? `내가 만든 뜻: ${selectedLabels}` : '아직 고른 그림 카드가 없어요.'}
            </div>
          </div>
        )}

        <div className={`rounded-xl border-2 px-3 py-2 text-center transition-colors ${game.status === 'success' ? 'border-emerald-300 bg-emerald-950' : 'border-slate-500/60 bg-slate-900/70'}`}>
          <p className="text-[14px] font-black text-slate-400">입력 결과 확인</p>
          <p className="text-[15px] font-black text-white">
            {game.status === 'success' ? `✅ “${stage.target}”로 전달됨` : '원래 안내와 같은 뜻인지 확인한 뒤 보내세요.'}
          </p>
        </div>
      </div>
    </MiniGameFrame>
  );
}
