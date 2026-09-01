import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l2 · 한 창구 안내소 (장르 49 · 손님 안내)
 *
 * "한 번에 한 가지씩, 마감이 빠른 것부터"를 창구 하나로 만든다. 창구가 하나뿐이라
 * 여러 부탁을 한꺼번에 넣을 수 없고, 넣는 순서가 곧 성패다.
 *
 * 묶음 부탁은 가위 자리를 눌러 낱개로 나눠야 창구에 들어간다. 나누지 않으면
 * 창구가 받지 않는다 — 한 문장에 여러 부탁이 섞이면 아이미가 못 알아듣는 일 그대로다.
 */

interface BundleSpec {
  parts: { text: string; deadline: number }[];
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  bundles: BundleSpec[];
  /** 창구가 하나를 처리하는 데 걸리는 초 */
  serviceSeconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'class',
    label: '기본',
    spoken: '교실 부탁을 하나씩 나눠 보내요.',
    serviceSeconds: 2.2,
    bundles: [
      { parts: [
        { text: '포스터 문구 만들기', deadline: 34 },
        { text: '안내문 쓰기', deadline: 52 },
      ] },
      { parts: [
        { text: '사진 고르기', deadline: 40 },
        { text: '제목 정하기', deadline: 66 },
      ] },
    ],
  },
  {
    id: 'club',
    label: '1단계',
    spoken: '동아리 부탁을 하나씩 나눠 보내요.',
    serviceSeconds: 2.4,
    bundles: [
      { parts: [
        { text: '준비물 목록 만들기', deadline: 30 },
        { text: '역할 나누기', deadline: 48 },
        { text: '초대 글 쓰기', deadline: 70 },
      ] },
      { parts: [
        { text: '자리 배치 정하기', deadline: 40 },
        { text: '순서표 만들기', deadline: 62 },
      ] },
    ],
  },
  {
    id: 'fair',
    label: '2단계',
    spoken: '축제 부탁을 하나씩 나눠 보내요.',
    serviceSeconds: 2.6,
    bundles: [
      { parts: [
        { text: '부스 이름 정하기', deadline: 26 },
        { text: '가격표 만들기', deadline: 44 },
        { text: '안내 방송 글 쓰기', deadline: 64 },
      ] },
      { parts: [
        { text: '재료 목록 만들기', deadline: 34 },
        { text: '당번 짜기', deadline: 54 },
        { text: '정리 순서 쓰기', deadline: 76 },
      ] },
    ],
  },
];

interface Card {
  id: number;
  text: string;
  left: number;
  total: number;
  done: boolean;
}

interface Bundle {
  id: number;
  parts: { text: string; deadline: number }[];
  /** 아직 나누지 않은 묶음 */
  split: boolean;
}

export default function OneCounterQueueGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시간의 여유로 나타난다. 마감이 길고 창구가 빠르면 순서를 고칠 틈이 생긴다. */
  const deadlineScale = tuning.time;
  const service = stage.serviceSeconds / clamp(tuning.speed, 0.7, 1.4);
  const maxLives = tuning.lives;

  const totalParts = stage.bundles.reduce((sum, b) => sum + b.parts.length, 0);

  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [serving, setServing] = useState<{ card: Card; left: number } | null>(null);
  const [donePart, setDonePart] = useState(0);
  const [lives, setLives] = useState(maxLives);
  const [note, setNote] = useState('');
  const finishedRef = useRef(false);
  const nextId = useRef(1);

  const reset = () => {
    nextId.current = 1;
    setBundles(stage.bundles.map((bundle, index) => ({ id: index + 1, parts: bundle.parts, split: false })));
    setCards([]);
    setServing(null);
    setDonePart(0);
    setLives(maxLives);
    setNote('');
    finishedRef.current = false;
  };

  useEffect(reset, [game.round, game.stageIndex, stage, maxLives]);

  useGameLoop(game.playing, (dt) => {
    // 창구 처리
    setServing((current) => {
      if (!current) return null;
      const left = current.left - dt;
      if (left > 0) return { ...current, left };
      setDonePart((n) => {
        const next = n + 1;
        if (next >= totalParts && !finishedRef.current) {
          finishedRef.current = true;
          game.succeed('부탁을 하나씩 나눠 마감이 빠른 것부터 보냈어요. 모두 제때 끝났습니다.');
        }
        return next;
      });
      return null;
    });

    // 마감 흐르기
    setCards((prev) => {
      let lost = 0;
      const next = prev.map((card) => {
        if (card.done) return card;
        const left = card.left - dt;
        if (left <= 0) {
          lost += 1;
          return { ...card, left: 0, done: true };
        }
        return { ...card, left };
      });
      if (lost > 0) {
        setLives((value) => {
          const remain = value - lost;
          if (remain <= 0 && !finishedRef.current) {
            finishedRef.current = true;
            game.fail('마감이 지난 부탁이 있어요. 마감이 빠른 것부터 창구에 넣어 봐요.');
          }
          return remain;
        });
        setNote('마감이 지난 부탁이 있어요.');
      }
      return next;
    });
  });

  const splitBundle = (bundleId: number) => {
    if (!game.playing) return;
    playSound('select');
    setBundles((prev) => prev.map((b) => (b.id === bundleId ? { ...b, split: true } : b)));
    setBundles((prev) => {
      const target = prev.find((b) => b.id === bundleId);
      if (target) {
        setCards((old) => [
          ...old,
          ...target.parts.map((part) => ({
            id: nextId.current++,
            text: part.text,
            left: part.deadline * deadlineScale,
            total: part.deadline * deadlineScale,
            done: false,
          })),
        ]);
      }
      return prev.filter((b) => b.id !== bundleId);
    });
    setNote('부탁을 하나씩으로 나눴어요. 마감이 빠른 것부터 창구에 넣으세요.');
  };

  const sendToCounter = (card: Card) => {
    if (!game.playing || card.done) return;
    if (serving) {
      setNote('창구는 하나뿐이에요. 지금 것이 끝나면 다음을 넣으세요.');
      return;
    }
    playSound('confirm');
    setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, done: true } : c)));
    setServing({ card, left: service });
    setNote(`"${card.text}"를 창구에 넣었어요.`);
  };

  const waiting = cards.filter((c) => !c.done).sort((a, b) => a.left - b.left);

  return (
    <MiniGameFrame
      badge="한 창구 안내소"
      instruction="묶음 부탁을 눌러 하나씩으로 나누고, 마감이 빠른 것부터 창구에 넣으세요. 창구는 하나뿐입니다."
      progress={{ label: '끝낸 부탁', value: donePart, max: totalParts }}
      hud={<GameHud lives={lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 받기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 묶음 부탁 */}
        <div className="flex flex-wrap gap-1.5">
          {bundles.map((bundle) => (
            <button
              key={bundle.id}
              type="button"
              onClick={() => splitBundle(bundle.id)}
              disabled={!game.playing}
              className="min-h-12 rounded-xl px-3 py-1 text-left text-[15px] font-black leading-tight transition"
              style={{ background: 'var(--board-surface)', border: '2px solid #C4B5FD', color: 'var(--board-ink)' }}
            >
              ✂️ {bundle.parts.map((p) => p.text).join(' 그리고 ')}
            </button>
          ))}
          {bundles.length === 0 && (
            <span className="text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
              묶음 부탁을 모두 나눴어요.
            </span>
          )}
        </div>

        {/* 창구 */}
        <div
          className="flex min-h-[58px] items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: 'var(--board-overlay)', border: `2px solid ${serving ? '#FBBF24' : 'var(--board-line)'}` }}
        >
          <span className="text-[20px]" aria-hidden="true">🪟</span>
          {serving ? (
            <>
              <span className="text-[15px] font-black" style={{ color: 'var(--board-ink)' }}>{serving.card.text}</span>
              <span className="ml-auto h-3 w-28 overflow-hidden rounded-full" style={{ background: '#1E293B', border: '2px solid #64748B' }}>
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${100 - (serving.left / service) * 100}%`, background: '#FBBF24' }}
                />
              </span>
            </>
          ) : (
            <span className="text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>창구가 비었습니다. 하나를 넣으세요.</span>
          )}
        </div>

        {/* 대기 카드 — 마감이 빠른 것이 위로 온다 */}
        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-auto">
          {waiting.map((card) => {
            const ratio = clamp(card.left / card.total, 0, 1);
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => sendToCounter(card)}
                disabled={!game.playing}
                className="flex min-h-12 items-center gap-2 rounded-xl px-3 text-[15px] font-black transition"
                style={{
                  background: 'var(--board-surface)',
                  border: `2px solid ${ratio < 0.3 ? '#FB7185' : '#38BDF8'}`,
                  color: 'var(--board-ink)',
                }}
              >
                <span>{card.text}</span>
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="h-3 w-24 overflow-hidden rounded-full" style={{ background: '#0F172A', border: '2px solid #64748B' }}>
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${ratio * 100}%`, background: ratio < 0.3 ? '#FB7185' : '#4ADE80' }}
                    />
                  </span>
                  <span className="w-8 text-right">{Math.ceil(card.left)}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
