import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { BauhausMark, GameHud, clamp, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m6-l6 · 안전 요리 주방 (장르 44 · 요리 타이쿤)
 *
 * "재료·알레르기·도구·도움 조건을 확인해 순서를 고친다"를 실시간 주방으로 만든다.
 * 정해진 차례대로 재료를 도구에 넣어야 하고, 칼을 쓰는 단계는 어른을 부르고
 * 기다려야 열린다.
 *
 * 알레르기 재료를 쓰면 그 자리에서 끝난다. 시간 안에 끝내되 안전을 건너뛸 수 없다 —
 * 두 요구가 부딪히는 것이 이 게임의 긴장이다.
 */

interface Step {
  ingredient: string;
  tool: string;
  seconds: number;
  needAdult: boolean;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  dish: string;
  allergen: string;
  steps: Step[];
  extras: { name: string; allergen: boolean }[];
  tools: string[];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'sandwich',
    label: '기본',
    spoken: '우유 알레르기를 피해 샌드위치를 만들어요.',
    dish: '채소 샌드위치',
    allergen: '우유',
    seconds: 75,
    tools: ['도마', '칼', '전자레인지', '접시'],
    steps: [
      { ingredient: '식빵', tool: '도마', seconds: 2, needAdult: false },
      { ingredient: '오이', tool: '칼', seconds: 3, needAdult: true },
      { ingredient: '달걀', tool: '전자레인지', seconds: 3, needAdult: false },
      { ingredient: '완성', tool: '접시', seconds: 2, needAdult: false },
    ],
    extras: [
      { name: '치즈', allergen: true },
      { name: '버터', allergen: true },
      { name: '양상추', allergen: false },
    ],
  },
  {
    id: 'rice',
    label: '1단계',
    spoken: '땅콩 알레르기를 피해 주먹밥을 만들어요.',
    dish: '참치 주먹밥',
    allergen: '땅콩',
    seconds: 70,
    tools: ['도마', '칼', '전자레인지', '접시'],
    steps: [
      { ingredient: '밥', tool: '전자레인지', seconds: 3, needAdult: false },
      { ingredient: '김', tool: '도마', seconds: 2, needAdult: false },
      { ingredient: '참치', tool: '도마', seconds: 2, needAdult: false },
      { ingredient: '당근', tool: '칼', seconds: 3, needAdult: true },
      { ingredient: '완성', tool: '접시', seconds: 2, needAdult: false },
    ],
    extras: [
      { name: '땅콩버터', allergen: true },
      { name: '견과 토핑', allergen: true },
      { name: '깨', allergen: false },
    ],
  },
  {
    id: 'soup',
    label: '2단계',
    spoken: '새우 알레르기를 피해 국을 만들어요.',
    dish: '채소 된장국',
    allergen: '새우',
    seconds: 65,
    tools: ['도마', '칼', '전자레인지', '접시'],
    steps: [
      { ingredient: '물', tool: '전자레인지', seconds: 3, needAdult: false },
      { ingredient: '된장', tool: '도마', seconds: 2, needAdult: false },
      { ingredient: '애호박', tool: '칼', seconds: 3, needAdult: true },
      { ingredient: '두부', tool: '칼', seconds: 3, needAdult: true },
      { ingredient: '파', tool: '도마', seconds: 2, needAdult: false },
      { ingredient: '완성', tool: '접시', seconds: 2, needAdult: false },
    ],
    extras: [
      { name: '새우', allergen: true },
      { name: '새우젓', allergen: true },
      { name: '버섯', allergen: false },
    ],
  },
];

export default function SafeCookingGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 제한 시간과 조리 시간, 실수 허용으로 나타난다. 안전 규칙은 같다. */
  const seconds = Math.round(stage.seconds * tuning.time);
  const cookScale = 1 / clamp(tuning.speed, 0.8, 1.3);
  const maxLives = tuning.lives;

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [adultCalled, setAdultCalled] = useState(false);
  const [adultWait, setAdultWait] = useState(0);
  const [cooking, setCooking] = useState<{ left: number; total: number } | null>(null);
  const [left, setLeft] = useState(seconds);
  const [lives, setLives] = useState(maxLives);
  const [note, setNote] = useState('');
  const doneRef = useRef(false);

  useEffect(() => {
    setStep(0);
    setPicked(null);
    setAdultCalled(false);
    setAdultWait(0);
    setCooking(null);
    setLeft(seconds);
    setLives(maxLives);
    setNote('');
    doneRef.current = false;
  }, [game.round, game.stageIndex, stage, seconds, maxLives]);

  const current = stage.steps[Math.min(step, stage.steps.length - 1)];

  useGameLoop(game.playing && !doneRef.current, (dt) => {
    setLeft((value) => {
      const next = Math.max(0, value - dt);
      if (next <= 0 && !doneRef.current) {
        doneRef.current = true;
        game.fail('시간이 지났어요. 차례대로 재료를 도구에 넣고, 칼은 어른을 불러 봐요.');
      }
      return next;
    });

    if (adultWait > 0) {
      setAdultWait((value) => {
        const next = Math.max(0, value - dt);
        if (next === 0) {
          setAdultCalled(true);
          setNote('어른이 옆에 오셨어요. 이제 칼을 쓸 수 있습니다.');
        }
        return next;
      });
    }

    if (cooking) {
      setCooking((value) => {
        if (!value) return null;
        const next = value.left - dt;
        if (next > 0) return { ...value, left: next };
        setStep((n) => {
          const advanced = n + 1;
          if (advanced >= stage.steps.length && !doneRef.current) {
            doneRef.current = true;
            game.succeed(`알레르기 재료를 피하고 칼은 어른과 함께 써서 ${stage.dish}를 안전하게 만들었어요!`);
          }
          return advanced;
        });
        setAdultCalled(false);
        setPicked(null);
        playSound('stamp');
        return null;
      });
    }
  });

  const pick = (name: string, allergen: boolean) => {
    if (!game.playing || doneRef.current || cooking) return;
    if (allergen) {
      doneRef.current = true;
      game.fail(`${stage.allergen}가 들어간 재료를 골랐어요. 알레르기 재료는 쓰지 않습니다.`);
      return;
    }
    playSound('select');
    setPicked(name);
    setNote(`${name}을 골랐어요. 알맞은 도구를 누르세요.`);
  };

  const useTool = (tool: string) => {
    if (!game.playing || doneRef.current || cooking) return;
    if (!picked) {
      setNote('재료를 먼저 고르세요.');
      return;
    }
    if (picked !== current.ingredient) {
      setLives((value) => {
        const next = value - 1;
        if (next <= 0 && !doneRef.current) {
          doneRef.current = true;
          game.fail('차례가 어긋났어요. 주문서의 순서대로 재료를 넣어 봐요.');
        }
        return next;
      });
      setNote(`지금은 ${current.ingredient} 차례예요.`);
      setPicked(null);
      return;
    }
    if (tool !== current.tool) {
      setLives((value) => {
        const next = value - 1;
        if (next <= 0 && !doneRef.current) {
          doneRef.current = true;
          game.fail('도구가 달라요. 주문서에 적힌 도구를 써 봐요.');
        }
        return next;
      });
      setNote(`${current.ingredient}은 ${current.tool}을 씁니다.`);
      return;
    }
    if (current.needAdult && !adultCalled) {
      setNote('칼은 혼자 쓰지 않아요. 어른 부르기를 누르고 기다리세요.');
      return;
    }
    playSound('confirm');
    const total = current.seconds * cookScale;
    setCooking({ left: total, total });
    setNote(`${current.ingredient}을 ${current.tool}에서 다루는 중입니다.`);
  };

  const callAdult = () => {
    if (!game.playing || doneRef.current || adultCalled || adultWait > 0) return;
    setAdultWait(3);
    setNote('어른을 불렀어요. 3초만 기다리세요.');
    playSound('select');
  };

  const allIngredients = [
    ...stage.steps.map((s) => ({ name: s.ingredient, allergen: false })),
    ...stage.extras,
  ];

  return (
    <MiniGameFrame
      bauhaus
      badge="안전 요리 주방"
      instruction={`순서에 맞추어 요리 재료와 도구를 골라 보세요. 알레르기를 일으키는 ${stage.allergen} 재료는 빼고, 칼을 쓸 때는 어른의 도움을 받으세요.`}
      progress={{ label: '끝낸 차례', value: Math.min(step, stage.steps.length), max: stage.steps.length }}
      hud={<GameHud bauhaus lives={lives} maxLives={maxLives} timeLeft={left} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton
            onClick={callAdult}
            disabled={!game.playing || adultCalled}
            mark="bang"
            label={adultWait > 0 ? `기다리는 중 ${Math.ceil(adultWait)}` : adultCalled ? '어른 도착' : '어른 부르기'}
          />
          <MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div
          className="px-3 py-1.5"
          style={{
            background: 'var(--game-board)',
            border: 'var(--game-line) solid var(--game-board-blue)',
          }}
        >
          <p
            className="flex items-center gap-1.5 text-[15px] font-black"
            style={{ color: 'var(--game-board-ink)' }}
          >
            주문서 · {stage.dish} ·
            <span style={{ color: 'var(--game-board-red)' }}>
              <BauhausMark kind="triangle" size={14} />
            </span>
            {stage.allergen} 알레르기
          </p>
          <p className="text-[15px] font-black" style={{ color: 'var(--game-board-blue)' }}>
            지금 차례 · {current.ingredient} → {current.tool}
            {current.needAdult ? ' (어른과 함께)' : ''}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allIngredients.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => pick(item.name, item.allergen)}
              disabled={!game.playing || !!cooking}
              className="flex min-h-12 items-center gap-1.5 px-2.5 text-[15px] font-black transition"
              style={{
                /* 고른 재료는 노랑(지금 손에 쥔 것), 알레르기 재료는 붉은 테두리에
                   붉은 세모다. 색만으로 나누지 않는 것은 판 위에서 빨강과 파랑의
                   밝기가 거의 같기 때문이다. */
                background: picked === item.name ? 'var(--game-board-yellow)' : 'var(--game-board)',
                color: picked === item.name ? 'var(--game-board)' : 'var(--game-board-ink)',
                border: `var(--game-line) solid ${
                  item.allergen ? 'var(--game-board-red)' : 'var(--game-board-blue)'}`,
              }}
            >
              {item.allergen && (
                <span
                  style={{
                    color: picked === item.name ? 'var(--game-board)' : 'var(--game-board-red)',
                  }}
                >
                  <BauhausMark kind="triangle" size={14} />
                </span>
              )}
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {stage.tools.map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() => useTool(tool)}
              disabled={!game.playing || !!cooking}
              className="flex min-h-12 flex-1 items-center justify-center gap-1.5 px-2 text-[15px] font-black"
              style={{
                background: 'var(--game-board)',
                border: `var(--game-line) solid ${
                  tool === '칼' && !adultCalled
                    ? 'var(--game-board-red)' : 'var(--game-board-yellow)'}`,
                color: 'var(--game-board-ink)',
              }}
            >
              {tool}
              {tool === '칼' && !adultCalled && (
                <span
                  className="flex items-center gap-1"
                  style={{ color: 'var(--game-board-red)' }}
                >
                  <BauhausMark kind="cross" size={13} />
                  잠김
                </span>
              )}
            </button>
          ))}
        </div>

        {cooking && (
          <span
            className="h-4 w-full overflow-hidden rounded-full"
            style={{
              background: 'var(--game-board)',
              border: 'var(--game-hair) solid var(--game-board-grey)',
            }}
          >
            <span
              className="block h-full rounded-full"
              style={{
                width: `${100 - (cooking.left / cooking.total) * 100}%`,
                background: 'var(--game-board-yellow)',
              }}
            />
          </span>
        )}

        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
