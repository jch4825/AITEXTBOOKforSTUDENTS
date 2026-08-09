import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';

interface Package {
  id: number;
  bad: boolean;
}

const STAGES = [
  { id: 'summary', label: '기본', name: '요약 결과', pattern: 'GGBGGBGG' },
  { id: 'translate', label: '1단계', name: '번역 결과', pattern: 'GBGGBGBGG' },
  { id: 'notice', label: '2단계', name: '안내문 결과', pattern: 'GGBBGBGGBG' },
];

export default function ConveyorQualityGame({ supportLevel }: MiniGameProps) {
  const {
    stageIndex,
    visibleStageCount,
    status,
    message,
    round,
    goToStage,
    run,
    succeed,
    fail,
    retry,
  } = useMiniGameStage({ supportLevel, stageCount: STAGES.length, autoResetOnFailMs: 0 });
  const stage = STAGES[stageIndex];
  const [fast, setFast] = useState(false);
  const [current, setCurrent] = useState<Package | null>(null);
  const [passed, setPassed] = useState<Package[]>([]);
  const [caught, setCaught] = useState<number[]>([]);
  const indexRef = useRef(0);
  const currentRef = useRef<Package | null>(null);
  // 벨트 타이머는 잡아낸 목록을 읽어야 하지만, 그 목록을 의존성에 넣으면 상자를 잡을 때마다
  // 타이머가 다시 시작돼 박자가 흐트러진다. 그래서 ref로 읽는다.
  const caughtRef = useRef<number[]>([]);

  useEffect(() => {
    setFast(false);
    setCurrent(null);
    setPassed([]);
    setCaught([]);
    indexRef.current = 0;
    currentRef.current = null;
    caughtRef.current = [];
  }, [round, stageIndex]);

  useEffect(() => {
    if (status !== 'running') return;
    const delay = fast ? 520 : 900;
    const timer = window.setInterval(() => {
      const leaving = currentRef.current;
      if (leaving) {
        if (leaving.bad && !caughtRef.current.includes(leaving.id)) {
          window.clearInterval(timer);
          fail('불량 결과가 그대로 지나갔어요. 벨트를 늦추거나 빨간 상자를 잡아내요.');
          return;
        }
        setPassed((items) => [...items, leaving]);
      }

      if (indexRef.current >= stage.pattern.length) {
        window.clearInterval(timer);
        currentRef.current = null;
        setCurrent(null);
        succeed('빠른 결과를 눈으로 확인하며 안전하게 골라냈어요!');
        return;
      }

      const next: Package = {
        id: indexRef.current,
        bad: stage.pattern[indexRef.current] === 'B',
      };
      indexRef.current += 1;
      currentRef.current = next;
      setCurrent(next);
    }, delay);
    return () => window.clearInterval(timer);
  }, [status, fast, stage.pattern, fail, succeed]);

  const start = () => {
    indexRef.current = 0;
    run('벨트가 움직입니다. 빨간 불량 상자를 눌러 빼내세요!');
  };

  const catchBad = () => {
    // 상자를 지역 변수로 붙잡아 둔다. setCaught의 업데이터는 다음 렌더에서 실행되므로
    // 그 안에서 currentRef를 읽으면 아래에서 이미 null로 비운 뒤라 터진다.
    const target = currentRef.current;
    if (status !== 'running' || !target) return;
    if (!target.bad) {
      fail('멀쩡한 결과를 버렸어요. 빨간 금이 간 상자만 빼내요.');
      return;
    }
    caughtRef.current = [...caughtRef.current, target.id];
    setCaught(caughtRef.current);
    currentRef.current = null;
    setCurrent(null);
  };

  return (
    <MiniGameFrame
      badge="빠른 결과 검수 벨트"
      instruction="속도 레버를 정하고 벨트를 돌리세요. 빨간 금이 간 결과는 지나가기 전에 눌러 빼냅니다."
      stages={STAGES.slice(0, visibleStageCount)}
      activeStageIndex={stageIndex}
      onStageSelect={(index) => goToStage(index, STAGES[index].name)}
      status={status}
      message={message}
      actions={
        status === 'playing' ? (
          <MiniGameButton onClick={start} emoji="▶️" label="벨트 돌리기" variant="primary" />
        ) : status === 'running' ? (
          <MiniGameButton
            onClick={catchBad}
            disabled={!current}
            emoji="🖐️"
            label="불량 상자 빼기"
            variant="primary"
          />
        ) : (
          <MiniGameButton onClick={retry} emoji="🔁" label="다시 검수" />
        )
      }
    >
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4">
        <button
          type="button"
          onClick={() => status === 'playing' && setFast((value) => !value)}
          disabled={status !== 'playing'}
          className="mx-auto flex min-h-14 w-52 items-center justify-between rounded-full border-2 border-slate-500 bg-slate-800 px-3 text-[15px] font-black text-white"
          aria-label={`벨트 속도 ${fast ? '빠르게' : '천천히'}`}
        >
          <span>천천히</span>
          <span
            className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-[22px] transition-transform"
            style={{ transform: fast ? 'translateX(64px)' : 'translateX(0)' }}
            aria-hidden="true"
          >
            🕹️
          </span>
          <span>빠르게</span>
        </button>

        <div className="relative min-h-[150px] overflow-hidden rounded-xl border-2 border-slate-500 bg-slate-900">
          <div className="absolute inset-x-0 bottom-5 h-9 border-y-4 border-slate-500 bg-slate-700" />
          <div className="absolute inset-x-3 bottom-0 flex justify-between text-[22px]" aria-hidden="true">
            <span>⚙️</span>
            <span>⚙️</span>
            <span>⚙️</span>
          </div>
          {current && (
            <button
              type="button"
              onClick={catchBad}
              className={`absolute bottom-14 left-1/2 grid h-20 w-20 -translate-x-1/2 place-items-center rounded-xl border-4 text-[30px] depth-overlay ${
                current.bad
                  ? 'border-red-400 bg-red-900 text-red-100'
                  : 'border-emerald-400 bg-emerald-900 text-emerald-100'
              }`}
              aria-label={current.bad ? '금이 간 불량 결과' : '확인된 좋은 결과'}
            >
              {current.bad ? '📦⚡' : '📦✓'}
            </button>
          )}
        </div>

        <div className="flex min-h-11 flex-wrap justify-center gap-1" aria-label="통과한 결과">
          {passed.map((item) => (
            <span key={item.id} className="text-[25px]" aria-hidden="true">
              {item.bad ? '📦' : '✅'}
            </span>
          ))}
          {caught.map((id) => (
            <span key={`caught-${id}`} className="text-[25px]" aria-hidden="true">
              🗑️
            </span>
          ))}
        </div>
      </div>
    </MiniGameFrame>
  );
}
