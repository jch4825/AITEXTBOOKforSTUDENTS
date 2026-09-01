import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, GameStage, clamp, createRandom, shuffle, useCountdown } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m1-l8 · 같은 모양 상자 옮기기 (장르 17 · 분류 매치)
 *
 * 앞선 판은 상자를 미는 소코반이었는데, 상자가 구석에 박혀 학습이 아니라 길 찾기가
 * 되어 버렸다. 여기서는 상자를 끌어 **같은 모양이 그려진 자리**에 놓는다.
 *
 * 세 자리에는 서로 다른 모양이 크게 그려져 있고, 상자에도 같은 모양이 붙어 있다.
 * 글을 읽기 어려운 학생도 모양만 보고 옮길 수 있고, 옮기는 동안 위쪽 띠에서
 * 그 부탁을 왜 그 자리에 두는지 읽게 된다.
 */

type Zone = 'fact' | 'ai' | 'human';

const ZONE_INFO: Record<Zone, { name: string; shape: string; color: string; why: string }> = {
  fact: { name: '사실 확인', shape: '●', color: '#38BDF8', why: '찾아보면 바로 알 수 있는 일이에요.' },
  ai: { name: '아이미의 첫 판단', shape: '▲', color: '#FBBF24', why: '아이미가 먼저 해 보고 사람이 확인할 일이에요.' },
  human: { name: '사람의 마지막 판단', shape: '■', color: '#FB7185', why: '사람이 반드시 마지막에 정해야 하는 일이에요.' },
};

interface Crate {
  id: string;
  text: string;
  zone: Zone;
  x: number;
  y: number;
  placed: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  items: { text: string; zone: Zone }[];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'school',
    label: '기본',
    spoken: '학교에서 온 부탁을 세 자리로 나눠요.',
    seconds: 110,
    items: [
      { text: '오늘 몇 교시까지인가요?', zone: 'fact' },
      { text: '이 사진 속 글자를 옮겨 주세요', zone: 'ai' },
      { text: '친구와 다퉜는데 누가 잘못했나요?', zone: 'human' },
      { text: '급식 메뉴가 무엇인가요?', zone: 'fact' },
    ],
  },
  {
    id: 'home',
    label: '1단계',
    spoken: '집에서 온 부탁을 세 자리로 나눠요.',
    seconds: 105,
    items: [
      { text: '내일 날씨가 어떤가요?', zone: 'fact' },
      { text: '이 글을 짧게 줄여 주세요', zone: 'ai' },
      { text: '이 약을 먹어도 되나요?', zone: 'human' },
      { text: '버스는 몇 번인가요?', zone: 'fact' },
      { text: '사진에서 글자를 읽어 주세요', zone: 'ai' },
    ],
  },
  {
    id: 'town',
    label: '2단계',
    spoken: '동네에서 온 부탁을 세 자리로 나눠요.',
    seconds: 100,
    items: [
      { text: '도서관은 몇 층인가요?', zone: 'fact' },
      { text: '이 안내문을 표로 만들어 주세요', zone: 'ai' },
      { text: '이 사람을 믿어도 되나요?', zone: 'human' },
      { text: '가게 문 여는 시각은?', zone: 'fact' },
      { text: '초대 글을 다듬어 주세요', zone: 'ai' },
      { text: '어디로 이사할지 정해 주세요', zone: 'human' },
    ],
  },
];

const ZONES: Zone[] = ['fact', 'ai', 'human'];

export default function JudgmentCratePushGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시간·기회·상자 크기로 나타난다. 나눌 부탁은 스테이지가 정한다. */
  const seconds = Math.round(stage.seconds * tuning.time);
  const maxLives = tuning.lives;
  const crateW = 26 * clamp(tuning.size, 0.9, 1.2);

  const [crates, setCrates] = useState<Crate[]>([]);
  const [held, setHeld] = useState<string | null>(null);
  const [lives, setLives] = useState(maxLives);
  const [note, setNote] = useState('');
  const doneRef = useRef(false);

  useEffect(() => {
    const random = createRandom(game.seed);
    const spots = shuffle(random, [
      [14, 22], [38, 16], [62, 22], [86, 18], [22, 40], [76, 40],
    ]);
    setCrates(stage.items.map((item, index) => ({
      id: `c${index}`,
      text: item.text,
      zone: item.zone,
      x: spots[index % spots.length][0],
      y: spots[index % spots.length][1],
      placed: false,
    })));
    setHeld(null);
    setLives(maxLives);
    setNote('');
    doneRef.current = false;
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    if (!doneRef.current) {
      doneRef.current = true;
      game.fail('시간이 지났어요. 상자의 모양과 같은 모양이 그려진 자리로 옮겨 봐요.');
    }
  });

  const put = (zone: Zone) => {
    if (!game.playing || doneRef.current) return;
    if (!held) { setNote('먼저 옮길 상자를 고르세요.'); return; }
    const crate = crates.find((item) => item.id === held);
    if (!crate) return;

    if (crate.zone !== zone) {
      setHeld(null);
      setNote(`모양이 달라요. ${ZONE_INFO[crate.zone].shape} 모양이 그려진 자리를 찾아 보세요.`);
      setLives((value) => {
        const left = value - 1;
        if (left <= 0 && !doneRef.current) {
          doneRef.current = true;
          game.fail('모양이 자꾸 어긋났어요. 상자에 붙은 모양과 같은 자리를 찾아 봐요.');
        }
        return left;
      });
      return;
    }

    playSound('stamp');
    const next = crates.map((item) => (item.id === crate.id ? { ...item, placed: true } : item));
    setCrates(next);
    setHeld(null);
    setNote(`${ZONE_INFO[zone].name} 자리로 옮겼어요. ${ZONE_INFO[zone].why}`);
    if (next.every((item) => item.placed)) {
      doneRef.current = true;
      game.succeed('부탁을 사실 확인·아이미의 첫 판단·사람의 마지막 판단으로 모두 나눴어요!');
    }
  };

  const placed = crates.filter((item) => item.placed).length;
  const heldCrate = crates.find((item) => item.id === held) ?? null;

  return (
    <MiniGameFrame
      badge="같은 모양 상자 옮기기"
      instruction="상자를 하나 고른 다음, 상자에 붙은 것과 같은 모양이 그려진 자리를 누르세요."
      progress={{ label: '옮긴 상자', value: placed, max: stage.items.length }}
      hud={<GameHud lives={lives} maxLives={maxLives} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <p
          className="min-h-[42px] rounded-xl px-3 py-1.5 text-[15px] font-black leading-snug"
          style={{ background: 'var(--board-surface)', border: '2px solid #38BDF8', color: 'var(--board-ink)' }}
        >
          {heldCrate ? `${ZONE_INFO[heldCrate.zone].shape} ${heldCrate.text}` : note || '옮길 상자를 고르세요.'}
        </p>

        <GameStage ariaLabel={`부탁 상자를 같은 모양 자리로 옮기는 놀이. 옮긴 상자 ${placed}개.`}>
          {crates.filter((crate) => !crate.placed).map((crate) => {
            const info = ZONE_INFO[crate.zone];
            const on = held === crate.id;
            return (
              <button
                key={crate.id}
                type="button"
                onClick={() => { setHeld(crate.id); playSound('select'); setNote(''); }}
                disabled={!game.playing}
                aria-label={`${crate.text} 상자 고르기`}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl transition"
                style={{
                  left: `${crate.x}%`,
                  top: `${crate.y}%`,
                  width: `${crateW}%`,
                  minHeight: 62,
                  background: on ? info.color : 'var(--board-surface)',
                  border: `3px solid ${info.color}`,
                  color: on ? '#0F172A' : 'var(--board-ink)',
                }}
              >
                <span className="text-[26px] leading-none" aria-hidden="true">{info.shape}</span>
                <span className="px-1 text-[14px] font-black leading-tight">{crate.text}</span>
              </button>
            );
          })}
        </GameStage>

        <div className="flex gap-1.5">
          {ZONES.map((zone) => {
            const info = ZONE_INFO[zone];
            const done = crates.filter((c) => c.zone === zone && c.placed).length;
            const need = crates.filter((c) => c.zone === zone).length;
            return (
              <button
                key={zone}
                type="button"
                onClick={() => put(zone)}
                disabled={!game.playing}
                className="flex min-h-[74px] flex-1 flex-col items-center justify-center rounded-xl px-1 transition"
                style={{
                  background: done >= need ? 'rgba(74, 222, 128, 0.16)' : 'var(--board-overlay)',
                  border: `3px solid ${done >= need ? '#4ADE80' : info.color}`,
                  color: 'var(--board-ink)',
                }}
              >
                <span className="text-[30px] leading-none" aria-hidden="true">{info.shape}</span>
                <span className="text-[14px] font-black leading-tight">{info.name}</span>
                <span className="text-[14px] font-bold" style={{ color: '#94A3B8' }}>{done} / {need}</span>
              </button>
            );
          })}
        </div>
      </div>
    </MiniGameFrame>
  );
}
