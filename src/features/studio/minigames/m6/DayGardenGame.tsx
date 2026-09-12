import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { BauhausMark, GameHud, clamp, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';
import type { BauhausMarkKind } from '../engine';

/**
 * m6-l7 · 하루 텃밭 (장르 45 · 농장 경영)
 *
 * "빽빽한 일정에 쉬는 시간과 도움 시간을 넣어 고친다"를 심고 기르기로 만든다.
 * 활동을 칸에 심으면 자라지만, 쉬지 않고 세 칸을 이어 심으면 시든다.
 *
 * 중간에 "출발이 늦어졌습니다" 같은 일이 생겨 한 구역이 밀린다. 그때 이미 심은
 * 활동을 끌어다 옮겨야 한다 — 계획을 다시 맞추는 일이 여기서 조작이다.
 */

const COLS = 4;

type Seed = 'work' | 'move' | 'rest' | 'help';

/*
 * 활동 이름 옆의 그림 문자를 걷었다.
 *
 * 이름이 늘 바로 붙어 있어 그림 문자는 뜻을 더하지 않으면서, 기기와 글꼴마다 다른
 * 모양으로 보이는 값만 치렀다. 소파와 악수는 '쉼'과 '도움 받기'라는 낱말을 배우는 데
 * 오히려 한 겹을 덧대기도 한다.
 */
const SEED_INFO: Record<Seed, { name: string; energy: number }> = {
  work: { name: '공부', energy: -2 },
  move: { name: '이동', energy: -1 },
  rest: { name: '쉼', energy: 3 },
  help: { name: '도움 받기', energy: 2 },
};

/*
 * 심은 것의 모양은 힘의 부호를 그대로 따른다.
 *
 * 힘을 쓰는 일(공부·이동)은 하루를 채우는 뼈대라 막대, 힘을 채우는 일(쉼·도움 받기)은
 * 이 판이 넣게 하려는 것이라 사각형이다. 시드는 조건을 가르는 값과 모양을 가르는 값이
 * 같아야, 칸에 보이는 것과 실제로 시드는 까닭이 어긋나지 않는다. 이름표를 못 읽어도
 * 막대 셋이 나란히 선 줄은 눈에 걸린다.
 */
const seedMark = (key: Seed): BauhausMarkKind => (SEED_INFO[key].energy < 0 ? 'bar' : 'square');

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  zones: string[];
  /** 반드시 심어야 하는 활동과 개수 */
  quota: { seed: Seed; count: number }[];
  eventAt: number;
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'school',
    label: '기본',
    spoken: '학교 하루를 쉼과 함께 심어요.',
    zones: ['아침', '낮', '저녁'],
    quota: [{ seed: 'work', count: 4 }, { seed: 'move', count: 2 }],
    eventAt: 18,
    seconds: 95,
  },
  {
    id: 'weekend',
    label: '1단계',
    spoken: '주말 하루를 쉼과 함께 심어요.',
    zones: ['아침', '낮', '저녁'],
    quota: [{ seed: 'work', count: 4 }, { seed: 'move', count: 3 }, { seed: 'help', count: 1 }],
    eventAt: 16,
    seconds: 90,
  },
  {
    id: 'busy',
    label: '2단계',
    spoken: '바쁜 하루를 쉼과 함께 심어요.',
    zones: ['아침', '낮', '저녁'],
    quota: [{ seed: 'work', count: 5 }, { seed: 'move', count: 3 }, { seed: 'help', count: 2 }],
    eventAt: 14,
    seconds: 85,
  },
];

interface Cell {
  seed: Seed | null;
  wilted: boolean;
}

export default function DayGardenGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시간·시들기 허용·에너지 여유로 나타난다. 하루의 칸과 할 일은 같다. */
  const seconds = Math.round(stage.seconds * tuning.time);
  const maxWilt = tuning.lives;
  const energyMax = Math.round(10 * clamp(tuning.tolerance, 0.85, 1.4));

  const rows = stage.zones.length;
  const [grid, setGrid] = useState<Cell[][]>(
    () => Array.from({ length: rows }, () => Array.from({ length: COLS }, () => ({ seed: null, wilted: false }))),
  );
  const [seed, setSeed] = useState<Seed>('work');
  const [energy, setEnergy] = useState(energyMax);
  const [wilt, setWilt] = useState(maxWilt);
  const [left, setLeft] = useState(seconds);
  const [note, setNote] = useState('');
  const [eventRow, setEventRow] = useState(-1);
  const doneRef = useRef(false);
  const eventedRef = useRef(false);

  useEffect(() => {
    setGrid(Array.from({ length: rows }, () => Array.from({ length: COLS }, () => ({ seed: null, wilted: false }))));
    setSeed('work');
    setEnergy(energyMax);
    setWilt(maxWilt);
    setLeft(seconds);
    setNote('');
    setEventRow(-1);
    doneRef.current = false;
    eventedRef.current = false;
  }, [game.round, game.stageIndex, stage, rows, energyMax, maxWilt, seconds]);

  useGameLoop(game.playing && !doneRef.current, (dt) => {
    setLeft((value) => {
      const next = Math.max(0, value - dt);
      if (!eventedRef.current && seconds - next >= stage.eventAt) {
        eventedRef.current = true;
        // 사건 — 한 구역이 통째로 밀린다. 이미 심은 것을 옮겨야 한다.
        setEventRow(0);
        setGrid((prev) => prev.map((row, r) => (r === 0
          ? row.map(() => ({ seed: null, wilted: false }))
          : row)));
        setNote('출발이 늦어졌어요. 아침 구역을 다시 심어야 합니다.');
        playSound('select');
      }
      if (next <= 0 && !doneRef.current) {
        doneRef.current = true;
        game.fail('하루가 끝났어요. 공부 사이에 쉼을 넣어 시들지 않게 심어 봐요.');
      }
      return next;
    });
  });

  const plant = (r: number, c: number) => {
    if (!game.playing || doneRef.current) return;
    const info = SEED_INFO[seed];
    if (grid[r][c].seed) {
      // 다시 누르면 뽑는다. 계획을 고치는 조작이다.
      const old = SEED_INFO[grid[r][c].seed as Seed];
      setGrid((prev) => prev.map((row, ri) => row.map((cell, ci) => (
        ri === r && ci === c ? { seed: null, wilted: false } : cell
      ))));
      setEnergy((value) => clamp(value - old.energy, 0, energyMax));
      setNote(`${old.name}을 뺐어요.`);
      return;
    }

    // 쉼 없이 세 칸을 이어 심으면 시든다
    const row = grid[r];
    const before = [c - 1, c - 2].every((i) => i >= 0 && row[i]?.seed && SEED_INFO[row[i].seed as Seed].energy < 0);
    const hard = info.energy < 0;
    if (hard && before) {
      setGrid((prev) => prev.map((rowCells, ri) => rowCells.map((cell, ci) => (
        ri === r && ci === c ? { seed, wilted: true } : cell
      ))));
      setWilt((value) => {
        const next = value - 1;
        if (next <= 0 && !doneRef.current) {
          doneRef.current = true;
          game.fail('쉬지 않고 이어 심어 시들었어요. 두 칸마다 쉼을 넣어 봐요.');
        }
        return next;
      });
      setNote('쉬지 않고 세 칸을 이어 심어 시들었어요.');
      return;
    }

    const nextEnergy = clamp(energy + info.energy, 0, energyMax);
    if (hard && nextEnergy <= 0) {
      setNote('힘이 다 떨어졌어요. 쉼이나 도움 받기를 먼저 심으세요.');
      return;
    }

    playSound('fill');
    setGrid((prev) => prev.map((rowCells, ri) => rowCells.map((cell, ci) => (
      ri === r && ci === c ? { seed, wilted: false } : cell
    ))));
    setEnergy(nextEnergy);
    setNote(`${stage.zones[r]}에 ${info.name}을 심었어요.`);
  };

  const counts = () => {
    const map: Record<string, number> = {};
    for (const row of grid) {
      for (const cell of row) {
        if (!cell.seed || cell.wilted) continue;
        map[cell.seed] = (map[cell.seed] ?? 0) + 1;
      }
    }
    return map;
  };

  const finish = () => {
    if (!game.playing || doneRef.current) return;
    const map = counts();
    const missing = stage.quota.find((q) => (map[q.seed] ?? 0) < q.count);
    if (missing) {
      setNote(`${SEED_INFO[missing.seed].name}이 아직 ${missing.count - (map[missing.seed] ?? 0)}칸 모자랍니다.`);
      return;
    }
    const restCount = map.rest ?? 0;
    if (restCount < rows) {
      setNote('구역마다 쉼을 적어도 한 칸씩 넣어야 합니다.');
      return;
    }
    doneRef.current = true;
    game.succeed('빽빽한 하루에 쉼과 도움 시간을 넣어 시들지 않는 계획을 만들었어요!');
  };

  const filled = grid.flat().filter((cell) => cell.seed && !cell.wilted).length;

  return (
    <MiniGameFrame
      bauhaus
      badge="하루 텃밭"
      instruction="오늘 할 일을 골라 시간표 칸에 알맞게 넣어 보세요. 너무 무리하지 않도록 중간에 휴식 시간도 꼭 챙겨야 해요."
      progress={{ label: '심은 칸', value: filled, max: rows * COLS }}
      hud={<GameHud bauhaus lives={wilt} maxLives={maxWilt} score={energy} scoreLabel="힘" timeLeft={left} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} mark="retry" label="다시 심기" />
          <MiniGameButton onClick={finish} disabled={!game.playing} mark="check" label="하루 마치기" variant="primary" />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(SEED_INFO) as Seed[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSeed(key)}
              aria-pressed={seed === key}
              disabled={!game.playing}
              className="flex min-h-11 items-center gap-1.5 px-2.5 text-[15px] font-black transition"
              style={{
                /* 지금 손에 쥔 것은 노랑 면으로 뒤집는다. 고른 것과 안 고른 것을 테두리
                   색으로만 가르면, 넷이 나란히 붙어 있는 줄에서 어느 것을 쥐고 있는지
                   한눈에 잡히지 않는다. 밝기가 통째로 갈리면 색을 못 가려도 읽힌다. */
                background: seed === key ? 'var(--game-board-yellow)' : 'var(--game-board)',
                color: seed === key ? 'var(--game-board)' : 'var(--game-board-ink)',
                border: `var(--game-line) solid ${
                  seed === key ? 'var(--game-board-yellow)' : 'var(--game-board-grey)'}`,
              }}
            >
              {/* 고르는 자리의 모양과 심긴 칸의 모양이 같다. 학생이 무엇을 심었는지
                  칸을 보고 되짚을 수 있어야 계획을 고칠 수 있다. */}
              <BauhausMark kind={seedMark(key)} size={14} />
              {SEED_INFO[key].name}
            </button>
          ))}
          <span className="text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>
            해야 할 일 · {stage.quota.map((q) => `${SEED_INFO[q.seed].name} ${q.count}`).join(', ')} · 구역마다 쉼 1
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-1.5">
          {stage.zones.map((zone, r) => (
            <div key={zone} className="flex min-h-0 flex-1 items-stretch gap-1.5">
              <span
                className="flex w-16 shrink-0 flex-col items-center justify-center gap-0.5 text-[15px] font-black"
                style={{
                  /* 밀린 구역은 면을 노랑으로 뒤집고 느낌표를 얹는다. 반투명 덮개를
                     씌우던 자리인데, 그러면 아래 글자가 흐려져 어느 구역을 다시 심어야
                     하는지가 오히려 덜 읽혔다. */
                  background: eventRow === r ? 'var(--game-board-yellow)' : 'var(--game-board)',
                  border: `var(--game-line) solid ${
                    eventRow === r ? 'var(--game-board-yellow)' : 'var(--game-board-grey)'}`,
                  color: eventRow === r ? 'var(--game-board)' : 'var(--game-board-ink)',
                }}
              >
                {eventRow === r && <BauhausMark kind="bang" size={13} />}
                {zone}
              </span>
              {grid[r].map((cell, c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => plant(r, c)}
                  disabled={!game.playing}
                  aria-label={`${zone} ${c + 1}번 칸`}
                  className="flex min-h-0 flex-1 flex-col items-center justify-center gap-0.5 text-[14px] font-black"
                  style={{
                    /* 칸의 상태는 테두리가, 심은 것의 종류는 모양이 진다. 시든 칸은
                       굵은 테두리와 붉은 세모를 함께 얻는다 — 판 위에서 붉은색과 푸른색은
                       밝기가 거의 같아, 색만으로 가르면 색을 구별하지 못하는 학생에게
                       시든 칸과 잘 자란 칸이 같은 회색이 된다. */
                    background: cell.seed && !cell.wilted
                      ? 'var(--game-board-surface)' : 'var(--game-board)',
                    border: `${cell.wilted ? 'var(--game-heavy)' : 'var(--game-line)'} solid ${
                      cell.wilted ? 'var(--game-board-red)'
                        : cell.seed ? 'var(--game-board-blue)' : 'var(--game-board-grey)'}`,
                    color: 'var(--game-board-ink)',
                  }}
                >
                  <span
                    style={{
                      color: cell.wilted ? 'var(--game-board-red)'
                        : cell.seed ? 'var(--game-board-blue)' : 'var(--game-board-grey)',
                    }}
                  >
                    <BauhausMark
                      kind={cell.wilted ? 'triangle' : cell.seed ? seedMark(cell.seed) : 'dot'}
                      size={20}
                    />
                  </span>
                  {cell.seed && <span>{SEED_INFO[cell.seed].name}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--game-board-ink)' }}>{note}</p>
      </div>
    </MiniGameFrame>
  );
}
