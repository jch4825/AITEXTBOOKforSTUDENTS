import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, GameStage, clamp, useCountdown } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m3-l2 · 낱말 자물쇠 방 (장르 18 · 방탈출 퍼즐)
 *
 * "뜻을 먼저 짐작한 다음 사전과 견준다"를 방탈출로 만든다. 사전을 바로 열 수 없고,
 * 방 안 물건에서 그 낱말이 쓰인 문장을 세 개 이상 모아야 자물쇠가 돌아간다.
 *
 * 자물쇠는 뜻을 세 조각으로 나눠 놓았다. 조각을 돌려 맞추는 동안 학생은
 * "이 낱말은 무엇을 무엇 하는 마음인가"를 스스로 조립하게 된다.
 */

interface Clue {
  x: number;
  y: number;
  emoji: string;
  name: string;
  sentence: string;
}

interface StageConfig {
  id: string;
  label: string;
  word: string;
  spoken: string;
  clues: Clue[];
  dials: string[][];
  answer: number[];
  meaning: string;
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'humble',
    label: '기본',
    word: '겸손',
    spoken: '겸손이라는 낱말의 뜻을 풀어 봐요.',
    seconds: 150,
    meaning: '자기를 낮추는 마음',
    clues: [
      { x: 16, y: 26, emoji: '🏆', name: '상장', sentence: '상을 받고도 자랑하지 않았습니다.' },
      { x: 46, y: 18, emoji: '🪑', name: '의자', sentence: '먼저 자리를 내주었습니다.' },
      { x: 76, y: 30, emoji: '🖼️', name: '그림', sentence: '자기 이야기를 길게 하지 않았습니다.' },
      { x: 28, y: 60, emoji: '🪴', name: '화분', sentence: '도와준 사람을 먼저 말했습니다.' },
      { x: 68, y: 62, emoji: '📦', name: '상자', sentence: '잘한 일을 조용히 넘겼습니다.' },
    ],
    dials: [['자기를', '남을', '물건을'], ['낮추는', '높이는', '숨기는'], ['마음', '소리', '물건']],
    answer: [0, 0, 0],
  },
  {
    id: 'thrift',
    label: '1단계',
    word: '절약',
    spoken: '절약이라는 낱말의 뜻을 풀어 봐요.',
    seconds: 135,
    meaning: '아껴서 덜 쓰는 일',
    clues: [
      { x: 18, y: 22, emoji: '💡', name: '전등', sentence: '나갈 때 불을 껐습니다.' },
      { x: 50, y: 16, emoji: '🚰', name: '수도', sentence: '물을 잠그고 이를 닦았습니다.' },
      { x: 80, y: 28, emoji: '📄', name: '종이', sentence: '뒷면에도 글을 썼습니다.' },
      { x: 30, y: 62, emoji: '👕', name: '옷', sentence: '작아진 옷을 동생에게 주었습니다.' },
      { x: 70, y: 64, emoji: '🍚', name: '밥', sentence: '먹을 만큼만 담았습니다.' },
    ],
    dials: [['아껴서', '많이', '빨리'], ['덜 쓰는', '더 쓰는', '버리는'], ['일', '사람', '자리']],
    answer: [0, 0, 0],
  },
  {
    id: 'yield',
    label: '2단계',
    word: '양보',
    spoken: '양보라는 낱말의 뜻을 풀어 봐요.',
    seconds: 120,
    meaning: '남에게 먼저 내주는 일',
    clues: [
      { x: 20, y: 24, emoji: '🚌', name: '버스', sentence: '어른께 자리를 내드렸습니다.' },
      { x: 52, y: 18, emoji: '🚪', name: '문', sentence: '뒷사람을 위해 문을 잡아 주었습니다.' },
      { x: 82, y: 30, emoji: '🍰', name: '간식', sentence: '큰 조각을 친구에게 주었습니다.' },
      { x: 26, y: 64, emoji: '🎮', name: '차례', sentence: '순서를 친구에게 먼저 주었습니다.' },
      { x: 72, y: 62, emoji: '☂️', name: '우산', sentence: '우산을 함께 쓰자고 했습니다.' },
    ],
    dials: [['남에게', '나에게', '아무에게'], ['먼저', '나중에', '몰래'], ['내주는 일', '받는 일', '숨기는 일']],
    answer: [0, 0, 0],
  },
];

export default function WordLockRoomGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시간·기회와, 자물쇠를 여는 데 필요한 단서 수로 나타난다. */
  const seconds = Math.round(stage.seconds * tuning.time);
  const maxLives = tuning.lives;
  const needClues = clamp(Math.round(3 / Math.max(0.8, tuning.tolerance)), 2, 4);

  const [found, setFound] = useState<number[]>([]);
  const [dials, setDials] = useState<number[]>([1, 2, 1]);
  const [lives, setLives] = useState(maxLives);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setFound([]);
    setDials([1, 2, 1]);
    setLives(maxLives);
    setNote('');
    setDone(false);
  }, [game.round, game.stageIndex, stage, maxLives]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    if (!done) game.fail('시간이 지났어요. 방 안 물건에서 낱말이 쓰인 문장을 먼저 모아 봐요.');
  });

  const unlocked = found.length >= needClues;

  const openClue = (index: number) => {
    if (!game.playing) return;
    if (found.includes(index)) {
      setNote(stage.clues[index].sentence);
      return;
    }
    playSound('select');
    setFound((prev) => [...prev, index]);
    setNote(stage.clues[index].sentence);
  };

  const turnDial = (index: number, delta: number) => {
    if (!game.playing || !unlocked) return;
    playSound('select');
    setDials((prev) => prev.map((value, i) => (
      i === index ? (value + delta + stage.dials[i].length) % stage.dials[i].length : value
    )));
  };

  const tryOpen = () => {
    if (!game.playing || !unlocked) return;
    const ok = dials.every((value, index) => value === stage.answer[index]);
    if (ok) {
      setDone(true);
      game.succeed(`문이 열렸어요. ${stage.word}은 ${stage.meaning}입니다.`);
      return;
    }
    const left = lives - 1;
    setLives(left);
    setNote('아직 열리지 않아요. 모은 문장을 다시 읽고 조각을 맞춰 보세요.');
    if (left <= 0) game.fail(`문이 열리지 않았어요. ${stage.word}이 쓰인 문장을 다시 읽어 봐요.`);
  };

  const hint = () => {
    if (!game.playing || !unlocked) return;
    const wrong = dials.findIndex((value, index) => value !== stage.answer[index]);
    if (wrong < 0) return;
    setDials((prev) => prev.map((value, i) => (i === wrong ? stage.answer[i] : value)));
    setNote('학생 사전이 조각 하나를 맞춰 주었어요.');
  };

  return (
    <MiniGameFrame
      badge="낱말 자물쇠 방"
      instruction={`방 안의 물건들을 눌러 '${stage.word}' 낱말이 들어간 문장을 찾아보세요. 단서를 모두 찾으면 자물쇠가 열립니다.`}
      progress={{ label: '모은 문장', value: found.length, max: stage.clues.length }}
      hud={<GameHud lives={lives} maxLives={maxLives} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 찾기" />
          {game.hintAllowed && (
            <MiniGameButton onClick={hint} disabled={!unlocked} emoji="📖" label="학생 사전" />
          )}
          <MiniGameButton onClick={tryOpen} disabled={!unlocked} emoji="🔓" label="문 열기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <GameStage ariaLabel={`${stage.word}의 뜻을 찾는 방. 모은 문장 ${found.length}개.`}>
          {stage.clues.map((clue, index) => {
            const opened = found.includes(index);
            return (
              <button
                key={clue.name}
                type="button"
                onClick={() => openClue(index)}
                disabled={!game.playing}
                aria-label={`${clue.name} 살펴보기`}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl px-2 py-1 transition"
                style={{
                  left: `${clue.x}%`,
                  top: `${clue.y}%`,
                  background: opened ? 'rgba(74, 222, 128, 0.18)' : 'var(--board-overlay)',
                  border: `2px solid ${opened ? '#4ADE80' : 'var(--board-line)'}`,
                }}
              >
                <span className="text-[26px]" aria-hidden="true">{clue.emoji}</span>
                <span className="text-[14px] font-black" style={{ color: 'var(--board-ink)' }}>{clue.name}</span>
              </button>
            );
          })}
        </GameStage>

        <p
          className="min-h-[44px] rounded-xl px-3 py-1.5 text-[15px] font-bold leading-snug"
          style={{ background: 'var(--board-surface)', border: '2px solid #38BDF8', color: 'var(--board-ink)' }}
        >
          {note || '물건을 눌러 문장을 모으세요.'}
        </p>

        {/* 자물쇠 다이얼 */}
        <div className="flex items-stretch gap-1.5">
          {stage.dials.map((options, index) => (
            <div
              key={index}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-xl p-1"
              style={{
                background: unlocked ? 'var(--board-surface)' : 'var(--board-overlay)',
                border: `2px solid ${unlocked ? '#FBBF24' : 'var(--board-line)'}`,
                opacity: unlocked ? 1 : 0.55,
              }}
            >
              <button
                type="button"
                onClick={() => turnDial(index, -1)}
                disabled={!unlocked || !game.playing}
                aria-label={`${index + 1}번 자물쇠 위로`}
                className="min-h-8 text-[16px]"
                style={{ color: 'var(--board-ink)' }}
              >
                ▲
              </button>
              <span className="text-[16px] font-black" style={{ color: 'var(--board-ink)' }}>
                {options[dials[index]]}
              </span>
              <button
                type="button"
                onClick={() => turnDial(index, 1)}
                disabled={!unlocked || !game.playing}
                aria-label={`${index + 1}번 자물쇠 아래로`}
                className="min-h-8 text-[16px]"
                style={{ color: 'var(--board-ink)' }}
              >
                ▼
              </button>
            </div>
          ))}
        </div>
      </div>
    </MiniGameFrame>
  );
}
