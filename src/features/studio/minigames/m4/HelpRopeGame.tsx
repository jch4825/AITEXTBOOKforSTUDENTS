import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

const STAGES = [
  { id: 'gift', label: '기본', danger: '선물과 비밀을 말한 메시지', response: '믿을 만한 어른이 메시지를 함께 살펴봐요.' },
  { id: 'photo', label: '1단계', danger: '사진을 보내라는 메시지', response: '선생님이 사진을 보내지 않아도 된다고 알려 줘요.' },
  { id: 'meet', label: '2단계', danger: '혼자 만나자는 메시지', response: '보호자가 곁에 와서 안전한 장소로 이동해요.' },
];
const STEPS = [
  { id: 'stop', label: '멈춤', icon: '✋', scene: '메시지 화면을 닫아요.' },
  { id: 'block', label: '차단', icon: '🛡️', scene: '상대의 연락이 더 오지 않게 막아요.' },
  { id: 'tell', label: '어른에게 알림', icon: '🛟', scene: '믿을 만한 어른에게 화면을 보여 줘요.' },
];

export default function HelpRopeGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const stage = STAGES[game.stageIndex];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [passed, setPassed] = useState<string[]>([]);
  useEffect(() => { setSelectedId(null); setPassed([]); }, [game.round, game.stageIndex]);
  const selected = STEPS.find((item) => item.id === selectedId);

  const passToAdult = () => {
    if (game.status !== 'playing' || !selected) return;
    const expected = STEPS[passed.length];
    if (selected.id !== expected.id) {
      game.fail(`${expected.label} 카드를 먼저 어른에게 전달해요. 밧줄이 끊기지 않게 순서를 살펴보세요.`);
      return;
    }
    const next = [...passed, selected.id];
    setPassed(next);
    setSelectedId(null);
    if (next.length === STEPS.length) game.succeed(`위험한 메시지를 멈추고 어른에게 알렸어요. ${stage.response}`);
  };

  return (
    <MiniGameFrame
      badge="도움 밧줄 전달하기"
      instruction="위험한 메시지에서 행동 카드를 하나 골라 밧줄을 따라 어른에게 전달하세요. 카드가 전달될 때마다 화면과 상대의 반응이 달라집니다."
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].danger)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} disabled={game.isLocked} emoji="🪢" label="밧줄 다시 잇기" />
          <MiniGameButton onClick={passToAdult} disabled={!selected || game.status !== 'playing'} emoji="➡️" label="어른에게 전달" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        <section className="rounded-xl border-4 border-red-400 bg-red-950 px-3 py-2 text-center" aria-label="위험한 메시지 장면">
          <p className="text-[14px] font-black text-red-200">📱 위험 신호</p>
          <p className="text-[16px] font-black text-white">{stage.danger}</p>
          <p className="mt-1 text-[13px] font-bold text-red-100">화면을 닫고 믿을 만한 어른에게 연결해요.</p>
        </section>

        <section className="rounded-xl border-2 border-sky-300/60 bg-sky-950/40 p-2.5" aria-label="행동 카드 더미">
          <h3 className="mb-1 text-[14px] font-black text-sky-100">행동 카드 더미</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {STEPS.map((item) => {
              const done = passed.includes(item.id);
              const picked = selectedId === item.id;
              return <button key={item.id} type="button" aria-pressed={picked} disabled={done || game.status !== 'playing'} onClick={() => setSelectedId(item.id)} className="min-h-20 rounded-xl border-2 px-1 py-1 text-center text-white transition disabled:opacity-45" style={{ borderColor: picked ? '#fbbf24' : done ? '#86efac' : 'rgba(148,163,184,0.55)', background: picked ? 'rgba(146,64,14,0.8)' : done ? 'rgba(22,101,52,0.65)' : 'rgba(15,23,42,0.65)' }}><span className="block text-2xl" aria-hidden="true">{item.icon}</span><strong className="block text-[13px] font-black">{done ? '전달됨' : item.label}</strong></button>;
            })}
          </div>
        </section>

        <section className="rounded-xl border-2 border-emerald-300/60 bg-emerald-950/45 p-2.5" aria-label="도움 밧줄 장면">
          <div className="flex min-h-20 items-center gap-1.5 overflow-x-auto rounded-lg border-2 border-dashed border-emerald-200/60 bg-slate-950/45 p-2">
            <span className="shrink-0 rounded-lg border-2 border-red-300 bg-red-950 px-2 py-2 text-[13px] font-black text-white">📱 나</span>
            {passed.map((id) => { const item = STEPS.find((step) => step.id === id)!; return <React.Fragment key={id}><span className="text-lg text-emerald-300" aria-hidden="true">→</span><div className="min-w-24 shrink-0 rounded-lg border-2 border-emerald-300 bg-emerald-900/70 px-2 py-2 text-center text-[12px] font-black text-white"><span className="block text-lg" aria-hidden="true">{item.icon}</span>{item.label}</div></React.Fragment>; })}
            <span className="text-lg text-emerald-300" aria-hidden="true">→</span><span className="shrink-0 rounded-lg border-2 border-violet-300 bg-violet-950 px-2 py-2 text-[13px] font-black text-white">👩‍🏫 어른</span>
          </div>
          <p className="mt-1 text-center text-[13px] font-bold text-emerald-100">{selected ? `${selected.icon} ${selected.scene}` : passed.length === STEPS.length ? stage.response : '카드를 골라 밧줄 위에 전달해 보세요.'}</p>
        </section>
      </div>
    </MiniGameFrame>
  );
}
