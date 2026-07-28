import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

/**
 * m2-l5 「누구에게 보여 줄 답인지 말해요」 — 두 다이얼 맞추기.
 *
 * 높임 정도와 자세함을 각각 다이얼로 조절해 상대에게 어울리는 자리에 맞춘다.
 * 어울리는 곳이 점이 아니라 넓은 구역이라 같은 상대에게도 여러 말투가 통한다.
 * 상대가 바뀌면 구역이 통째로 옮겨 가므로, 한 축의 정답이 혼자 정해지지 않는다.
 */

interface Audience {
  id: string;
  tab: string;
  emoji: string;
  name: string;
  ask: string;
  /** 어울리는 구역 [최소, 최대] */
  polite: [number, number];
  detail: [number, number];
  sample: (p: number, d: number) => string;
}

const AUDIENCES: Audience[] = [
  {
    id: 'friend',
    tab: '친구',
    emoji: '🧑‍🤝‍🧑',
    name: '같은 반 친구',
    ask: '내일 준비물을 알려 주는 쪽지',
    polite: [10, 45],
    detail: [30, 65],
    sample: (p, d) =>
      `${p < 45 ? '내일 준비물은' : '내일 준비물을 안내드립니다.'} 색연필${d > 55 ? '이랑 가위, 풀까지 챙겨 와' : ' 가져와'}${p < 45 ? '!' : '.'}`,
  },
  {
    id: 'teacher',
    tab: '선생님',
    emoji: '🧑‍🏫',
    name: '담임 선생님',
    ask: '체험회 준비를 여쭤보는 쪽지',
    polite: [65, 100],
    detail: [55, 95],
    sample: (p, d) =>
      `${p > 65 ? '선생님, 안녕하세요.' : '쌤'} 체험회 준비물${d > 55 ? '과 모이는 시간, 장소를' : '을'} ${p > 65 ? '여쭤봐도 될까요?' : '뭐야?'}`,
  },
  {
    id: 'kid',
    tab: '동생',
    emoji: '🧒',
    name: '1학년 동생',
    ask: '체험회 오는 길을 알려 주는 쪽지',
    polite: [25, 60],
    detail: [5, 40],
    sample: (p, d) =>
      `${p > 30 ? '내일' : '야 내일'} 강당으로 와${d > 45 ? '. 2층 계단 오른쪽 복도 끝 문으로 들어오면 돼' : '!'}`,
  },
];

export default function AudienceToneGame({ supportLevel }: MiniGameProps) {
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
  } = useMiniGameStage({ supportLevel, stageCount: AUDIENCES.length });

  const person = AUDIENCES[stageIndex];
  const [polite, setPolite] = useState(50);
  const [detail, setDetail] = useState(50);

  useEffect(() => {
    setPolite(50);
    setDetail(50);
  }, [round, stageIndex]);

  const politeOk = polite >= person.polite[0] && polite <= person.polite[1];
  const detailOk = detail >= person.detail[0] && detail <= person.detail[1];
  const bothOk = politeOk && detailOk;

  const handleHint = () => {
    setPolite(Math.round((person.polite[0] + person.polite[1]) / 2));
    setDetail(Math.round((person.detail[0] + person.detail[1]) / 2));
  };

  const send = () => {
    if (status !== 'playing') return;
    if (bothOk) {
      succeed(`${person.name}에게 딱 맞는 말투예요!`);
      return;
    }
    const parts: string[] = [];
    if (!politeOk) parts.push(polite < person.polite[0] ? '너무 편한 말투' : '너무 딱딱한 말투');
    if (!detailOk) parts.push(detail < person.detail[0] ? '설명이 너무 짧아요' : '설명이 너무 길어요');
    fail(parts.join(' · '));
  };

  const dial = (
    label: string,
    lowLabel: string,
    highLabel: string,
    value: number,
    setValue: (v: number) => void,
    band: [number, number],
    ok: boolean,
  ) => (
    <div>
      <div className="mb-1 flex items-center justify-between text-[14px] font-black">
        <span className="text-slate-400">{label}</span>
        <span className={ok ? 'text-emerald-300' : 'text-slate-400'}>{ok ? '알맞아요' : '조절해요'}</span>
      </div>
      <div className="relative">
        {hintAllowed && (
          <div
            className="pointer-events-none absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-emerald-400/25"
            style={{ left: `${band[0]}%`, width: `${band[1] - band[0]}%` }}
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
          aria-label={label}
          className="relative w-full"
          style={{ accentColor: ok ? '#34d399' : '#4FC3E8' }}
        />
      </div>
      <div className="flex justify-between text-[14px] font-bold text-slate-500">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );

  return (
    <MiniGameFrame
      badge="상대에 맞춰 말하기"
      instruction="같은 내용도 누구에게 보여 주느냐에 따라 말투가 달라져요. 두 다이얼을 움직여 상대에게 어울리는 자리를 찾아 보세요."
      accent="var(--brand-ink)"
      progress={{ label: '맞은 다이얼', value: (politeOk ? 1 : 0) + (detailOk ? 1 : 0), max: 2 }}
      stages={AUDIENCES.slice(0, visibleStageCount).map((a) => ({ id: a.id, label: a.tab }))}
      activeStageIndex={stageIndex}
      onStageSelect={(i) => goToStage(i, `${AUDIENCES[i].name}에게 쓰기`)}
      status={status}
      message={message}
      actions={
        <>
          <MiniGameButton onClick={retry} disabled={isLocked} emoji="🔄" label="다시" />
          {hintAllowed && (
            <MiniGameButton onClick={handleHint} disabled={isLocked} emoji="💡" label="힌트" />
          )}
          <MiniGameButton
            onClick={send}
            disabled={status !== 'playing'}
            emoji="📨"
            label="이렇게 보내기"
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        <div className="rounded-lg border-2 border-amber-400/50 bg-amber-400/10 px-2 py-1.5">
          <p className="text-[14px] font-black text-amber-300">받는 사람</p>
          <p className="text-[14px] font-bold text-slate-100">
            {person.emoji} {person.name} · {person.ask}
          </p>
        </div>

        {/* 지금 말투로 쓰면 이렇게 나온다 */}
        <div
          className="rounded-xl border-2 px-3 py-2 transition-colors"
          style={{
            borderColor: bothOk ? '#4ade80' : 'rgba(148,163,184,0.45)',
            background: bothOk ? 'rgba(22,163,74,0.2)' : 'rgba(30,41,59,0.9)',
          }}
        >
          <p className="text-[14px] font-black text-slate-400">내 쪽지</p>
          <p className="text-[14px] font-bold leading-relaxed text-slate-50">
            {person.sample(polite, detail)}
          </p>
        </div>

        {dial('높임 정도', '편하게', '공손하게', polite, setPolite, person.polite, politeOk)}
        {dial('자세함', '짧게', '자세하게', detail, setDetail, person.detail, detailOk)}

        <p className="text-center text-2xl leading-none" aria-hidden="true">
          {bothOk ? '😊' : politeOk || detailOk ? '🙂' : '😐'}
        </p>
      </div>
    </MiniGameFrame>
  );
}
