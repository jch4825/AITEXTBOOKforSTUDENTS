import React, { useEffect, useMemo, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, useGameKeys, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m1-l8 · 부탁 상자 밀기 (장르 17 · 소코반)
 *
 * "무엇을 AI에게 맡기고 무엇을 사람이 정하는가"를 상자를 미는 일로 만든다.
 * 고르기만 하는 문제였다면 잘못 골라도 한 번 더 누르면 끝이지만, 소코반에서는
 * 잘못 민 상자가 그 자리에 남는다. 되돌릴 수 없는 결정이 무엇인지 몸으로 겪게
 * 하려고 "밀 수만 있고 당길 수 없다"는 규칙을 그대로 학습 규칙으로 쓴다.
 *
 * 상자는 오른쪽 벽의 세 구역 중 하나로 들어간다. 구역은 줄로 나뉘어 있어서
 * 학생은 "어느 구역인가"를 먼저 정하고 나서야 어느 줄로 밀지 정할 수 있다.
 * 판단이 먼저이고 조작이 나중이라, 아무렇게나 밀어서는 맞출 수 없다.
 */

const COLS = 8;
const ROWS = 6;
/** 목표 구역은 오른쪽 끝 한 줄이다. 벽면이라는 인상을 주려고 한 칸만 쓴다. */
const GOAL_COL = COLS - 1;

type ZoneId = 'fact' | 'ai' | 'human';

interface Zone {
  id: ZoneId;
  label: string;
  color: string;
  /** 이 구역이 차지하는 가로줄. 두 줄이라 같은 구역에 상자 둘이 들어갈 수 있다. */
  rows: number[];
}

const ZONES: Zone[] = [
  { id: 'fact', label: '사실 확인', color: '#38BDF8', rows: [0, 1] },
  { id: 'ai', label: '아이미의 첫 판단', color: '#C4B5FD', rows: [2, 3] },
  { id: 'human', label: '사람의 마지막 판단', color: '#FBBF24', rows: [4, 5] },
];

interface Spot {
  x: number;
  y: number;
}

interface Crate {
  ask: string;
  emoji: string;
  zone: ZoneId;
  start: Spot;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  hero: Spot;
  crates: Crate[];
  /** 기둥 후보. 앞에서부터 필요한 수만큼 쓴다. 전부 놓아도 풀리도록 손으로 확인한 자리다. */
  pillars: Spot[];
  pillarBase: number;
}

/*
 * 세 판은 모두 같은 조작이고 부탁 내용과 기둥 수만 다르다. 상자의 시작 줄은
 * 목표 구역의 줄과 일부러 어긋나게 두었다. 줄이 맞아 있으면 오른쪽으로만 밀면
 * 끝나 버려서 "어느 구역인가"를 생각할 일이 사라지기 때문이다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'ask-basic',
    label: '기본',
    spoken: '아이미가 받은 부탁 네 가지를 옮깁니다.',
    hero: { x: 0, y: 0 },
    crates: [
      { ask: '오늘 몇 교시까지인가요?', emoji: '🕐', zone: 'fact', start: { x: 2, y: 4 } },
      { ask: '이 사진 속 글자를 옮겨 주세요', emoji: '📷', zone: 'ai', start: { x: 2, y: 1 } },
      { ask: '친구와 다퉜는데 누가 잘못했나요?', emoji: '😟', zone: 'human', start: { x: 5, y: 1 } },
      { ask: '이 약을 먹어도 되나요?', emoji: '💊', zone: 'human', start: { x: 3, y: 5 } },
    ],
    pillars: [{ x: 4, y: 0 }, { x: 6, y: 3 }, { x: 3, y: 3 }, { x: 0, y: 4 }],
    pillarBase: 3,
  },
  {
    id: 'ask-more',
    label: '1단계',
    spoken: '새 부탁 네 가지가 들어왔습니다.',
    hero: { x: 0, y: 0 },
    crates: [
      { ask: '다음 주 수요일은 며칠인가요?', emoji: '📅', zone: 'fact', start: { x: 3, y: 4 } },
      { ask: '이 긴 글을 세 줄로 줄여 주세요', emoji: '✂️', zone: 'ai', start: { x: 5, y: 1 } },
      { ask: '이 사진을 인터넷에 올려도 되나요?', emoji: '🖼️', zone: 'human', start: { x: 2, y: 2 } },
      { ask: '혼자 있고 싶은데 어떻게 말할까요?', emoji: '💬', zone: 'human', start: { x: 6, y: 1 } },
    ],
    pillars: [{ x: 4, y: 3 }, { x: 1, y: 1 }, { x: 1, y: 3 }, { x: 0, y: 2 }, { x: 0, y: 4 }],
    pillarBase: 4,
  },
  {
    id: 'ask-hard',
    label: '2단계',
    spoken: '기둥이 늘어난 창고에서 부탁을 옮깁니다.',
    hero: { x: 0, y: 0 },
    crates: [
      { ask: '오늘 우리 지역 날씨는 어떤가요?', emoji: '🌤️', zone: 'fact', start: { x: 4, y: 4 } },
      { ask: '이 문장을 영어로 바꿔 주세요', emoji: '🌐', zone: 'ai', start: { x: 2, y: 4 } },
      { ask: '동아리를 그만두는 게 나을까요?', emoji: '🤔', zone: 'human', start: { x: 3, y: 1 } },
      { ask: '모르는 사람에게 내 사진을 보내도 되나요?', emoji: '🔒', zone: 'human', start: { x: 6, y: 2 } },
    ],
    pillars: [
      { x: 2, y: 2 }, { x: 6, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 },
      { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 1, y: 0 },
    ],
    pillarBase: 5,
  },
];

function zoneOf(id: ZoneId): Zone {
  return ZONES.find((zone) => zone.id === id) ?? ZONES[0];
}

/** 그 줄이 어느 구역인지. 목표 칸을 칠할 때와 상자 판정에 함께 쓴다. */
function zoneOfRow(y: number): Zone {
  return ZONES.find((zone) => zone.rows.includes(y)) ?? ZONES[ZONES.length - 1];
}

function isWall(walls: Spot[], x: number, y: number): boolean {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
  return walls.some((wall) => wall.x === x && wall.y === y);
}

function isPlaced(spot: Spot, crate: Crate): boolean {
  return spot.x === GOAL_COL && zoneOf(crate.zone).rows.includes(spot.y);
}

/**
 * 상자가 다시는 제자리로 갈 수 없게 됐는지 본다.
 *
 * 상자를 세로로 옮기려면 위 칸과 아래 칸이 모두 비어야 한다(한쪽에 사람이 서고
 * 반대쪽으로 밀린다). 가로도 같다. 그래서 세로와 가로가 함께 막히면 그 상자는
 * 영영 움직이지 않는다. 왼쪽 끝 칸도 마찬가지다. 더 왼쪽에 설 자리가 없어
 * 오른쪽으로 밀 수 없기 때문이다.
 */
function isStuck(spot: Spot, crate: Crate, walls: Spot[]): boolean {
  if (isPlaced(spot, crate)) return false;
  const rows = zoneOf(crate.zone).rows;
  if (spot.x === 0) return true;
  if ((spot.y === 0 || spot.y === ROWS - 1) && !rows.includes(spot.y)) return true;
  const verticalBlocked = isWall(walls, spot.x, spot.y - 1) || isWall(walls, spot.x, spot.y + 1);
  const horizontalBlocked = isWall(walls, spot.x - 1, spot.y) || isWall(walls, spot.x + 1, spot.y);
  return verticalBlocked && horizontalBlocked;
}

interface Scene {
  hero: Spot;
  boxes: Spot[];
  /** 어느 판의 몇 번째 시도인지. 판이 바뀐 직후 옛 배치로 성패를 매기지 않게 하는 표다. */
  token: string;
}

export default function JudgmentCratePushGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;
  const token = `${stage.id}#${game.round}`;

  // 칸 크기·기둥 수·되돌리기 횟수·제한 시간을 지원 수준에 따라 함께 움직인다.
  const cell = Math.round(38 * tuning.size);
  const totalTime = Math.round(240 * tuning.time);
  const walls = useMemo(() => {
    const count = Math.max(1, Math.round(stage.pillarBase * tuning.density));
    return stage.pillars.slice(0, Math.min(stage.pillars.length, count));
  }, [stage, tuning.density]);

  const [scene, setScene] = useState<Scene>(() => ({
    hero: { ...stage.hero },
    boxes: stage.crates.map((crate) => ({ ...crate.start })),
    token,
  }));
  const [undoLeft, setUndoLeft] = useState(tuning.lives);
  const [blocked, setBlocked] = useState('');
  const [started, setStarted] = useState(false);
  const [hintOn, setHintOn] = useState(false);
  const [timeShown, setTimeShown] = useState(totalTime);

  const historyRef = useRef<Scene[]>([]);
  const finishedRef = useRef(false);
  const timeRef = useRef(totalTime);
  const repeatRef = useRef<{ key: string; wait: number }>({ key: '', wait: 0 });
  const keys = useGameKeys(game.playing);

  // 판을 바꾸거나 다시 할 때 처음 자리로 되돌린다. 아래 판정 훅보다 먼저 선언해야
  // 새 판의 배치가 먼저 들어가고 그다음에 성패를 본다.
  useEffect(() => {
    setScene({
      hero: { ...stage.hero },
      boxes: stage.crates.map((crate) => ({ ...crate.start })),
      token,
    });
    setUndoLeft(tuning.lives);
    setBlocked('');
    setStarted(false);
    setHintOn(false);
    setTimeShown(totalTime);
    historyRef.current = [];
    finishedRef.current = false;
    timeRef.current = totalTime;
    repeatRef.current = { key: '', wait: 0 };
  }, [token, stage, tuning.lives, totalTime]);

  const placedCount = useMemo(
    () => scene.boxes.filter((spot, index) => isPlaced(spot, stage.crates[index])).length,
    [scene, stage],
  );

  /** 한 칸 움직인다. 앞에 상자가 있으면 그 상자도 한 칸 밀린다. 당기기는 없다. */
  const step = (dx: number, dy: number) => {
    if (!game.playing || finishedRef.current || blocked) return;
    const nx = scene.hero.x + dx;
    const ny = scene.hero.y + dy;
    if (isWall(walls, nx, ny)) return;

    const hitIndex = scene.boxes.findIndex((spot) => spot.x === nx && spot.y === ny);
    let nextBoxes = scene.boxes;
    if (hitIndex >= 0) {
      const bx = nx + dx;
      const by = ny + dy;
      if (isWall(walls, bx, by)) return;
      if (scene.boxes.some((spot) => spot.x === bx && spot.y === by)) return;
      nextBoxes = scene.boxes.map((spot, index) => (index === hitIndex ? { x: bx, y: by } : spot));
    }

    historyRef.current.push(scene);
    if (historyRef.current.length > 120) historyRef.current.shift();
    setStarted(true);
    playSound('select');
    setScene({ hero: { x: nx, y: ny }, boxes: nextBoxes, token });
  };

  /** 칸을 누르면 그쪽으로 한 칸. 멀리 눌러도 한 걸음만 가야 어디로 갈지 예상된다. */
  const walkToward = (x: number, y: number) => {
    const dx = x - scene.hero.x;
    const dy = y - scene.hero.y;
    if (dx === 0 && dy === 0) return;
    if (Math.abs(dx) >= Math.abs(dy)) step(Math.sign(dx), 0);
    else step(0, Math.sign(dy));
  };

  const undo = () => {
    if (finishedRef.current || undoLeft <= 0) return;
    const previous = historyRef.current.pop();
    if (!previous) return;
    playSound('stamp');
    setScene(previous);
    setUndoLeft((left) => left - 1);
    setBlocked('');
  };

  // 방향키 조작과 남은 시간을 한 루프에서 본다. 누른 채로 두면 천천히 이어 걷도록
  // 첫 걸음 뒤에 0.34초를 쉬는데, 손을 떼는 속도가 느린 학생이 두 칸씩 가지 않게 하려는 것이다.
  useGameLoop(game.playing, (dt) => {
    const moves: [string, number, number][] = [
      ['left', -1, 0], ['right', 1, 0], ['up', 0, -1], ['down', 0, 1],
    ];
    let pressed = false;
    for (const [key, dx, dy] of moves) {
      if (keys.consumePress(key as 'left')) {
        step(dx, dy);
        repeatRef.current = { key, wait: 0.34 };
        pressed = true;
      }
    }
    if (!pressed) {
      const holding = moves.find(([key]) => keys.held.current[key as 'left']);
      if (!holding) repeatRef.current = { key: '', wait: 0 };
      else if (repeatRef.current.key === holding[0]) {
        repeatRef.current.wait -= dt;
        if (repeatRef.current.wait <= 0) {
          step(holding[1], holding[2]);
          repeatRef.current.wait = 0.18;
        }
      }
    }

    if (!started || finishedRef.current) return;
    timeRef.current -= dt;
    const left = Math.max(0, Math.ceil(timeRef.current));
    if (left !== timeShown) setTimeShown(left);
    if (timeRef.current <= 0) {
      finishedRef.current = true;
      game.fail('시간이 다 되었어요. 상자 하나를 먼저 정하고 그 상자의 길만 비워 보세요.');
    }
  });

  // 성패 판정. 옛 판의 배치로 성공이 두 번 울리지 않도록 token이 맞을 때만 본다.
  useEffect(() => {
    if (scene.token !== token || finishedRef.current) return;
    if (placedCount === stage.crates.length) {
      finishedRef.current = true;
      playSound('confirm');
      game.succeed('네 부탁을 모두 알맞은 구역으로 밀어 넣었어요. 왜 그 구역으로 보냈는지 말해 봅니다.');
      return;
    }
    const jammedIndex = scene.boxes.findIndex((spot, index) => isStuck(spot, stage.crates[index], walls));
    if (jammedIndex < 0) {
      setBlocked('');
      return;
    }
    const crate = stage.crates[jammedIndex];
    if (undoLeft <= 0) {
      finishedRef.current = true;
      game.fail(`${crate.emoji} 상자가 벽에 갇혔고 되돌리기도 남지 않았어요. 다시 하기를 눌러 처음부터 밀어 보세요.`);
    } else {
      setBlocked(`${crate.emoji} 상자가 벽에 막혔어요. 되돌리기를 눌러 한 걸음 물러나세요.`);
    }
  }, [scene, token, placedCount, stage, walls, undoLeft, game]);

  const nextAsk = stage.crates.find((crate, index) => !isPlaced(scene.boxes[index], crate));
  const bandColor = blocked ? '#FB7185' : started ? '#38BDF8' : '#FBBF24';
  const bandText = blocked
    || (started
      ? `${nextAsk ? `${nextAsk.emoji} ${nextAsk.ask}` : '모두 옮겼어요.'}`
      : '방향키를 누르거나 칸을 누르면 움직입니다. 아직 시간은 흐르지 않습니다.');

  return (
    <MiniGameFrame
      badge="부탁 상자 밀기"
      instruction="방향키나 칸을 눌러 움직이며 부탁 상자를 오른쪽 벽의 알맞은 구역으로 밉니다. 상자는 밀 수만 있고 당길 수 없으니 길을 미리 살펴봅니다."
      progress={{ label: '알맞게 놓은 상자', value: placedCount, max: stage.crates.length }}
      hud={<GameHud lives={undoLeft} maxLives={tuning.lives} timeLeft={timeShown} timeTotal={totalTime} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" />
          {game.hintAllowed && (
            <MiniGameButton
              onClick={() => setHintOn((on) => !on)}
              emoji="💡"
              label={hintOn ? '힌트 끄기' : '힌트'}
            />
          )}
          <MiniGameButton
            onClick={undo}
            disabled={undoLeft <= 0 || historyRef.current.length === 0}
            emoji="↩️"
            label={`되돌리기 ${undoLeft}`}
            variant="primary"
          />
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 읽을 글은 이 띠 한 곳에만 둔다. 상자마다 긴 글을 붙이면 판이 글자로 덮인다. */}
        <div
          className="rounded-xl px-2.5 py-1.5 text-[15px] font-black leading-snug"
          style={{ background: 'var(--board-surface)', border: `2px solid ${bandColor}`, color: 'var(--board-ink)' }}
        >
          {bandText}
        </div>

        <div className="flex items-start gap-2 overflow-auto">
          <div
            className="grid gap-[3px] rounded-xl p-1.5"
            style={{
              gridTemplateColumns: `repeat(${COLS}, ${cell}px)`,
              gridTemplateRows: `repeat(${ROWS}, ${cell}px)`,
              background: 'var(--board-overlay)',
              border: '2px solid var(--board-line)',
            }}
          >
            {Array.from({ length: ROWS }).map((_, y) => Array.from({ length: COLS }).map((_, x) => {
              const wall = walls.some((spot) => spot.x === x && spot.y === y);
              const goalZone = x === GOAL_COL ? zoneOfRow(y) : null;
              const boxIndex = scene.boxes.findIndex((spot) => spot.x === x && spot.y === y);
              const crate = boxIndex >= 0 ? stage.crates[boxIndex] : null;
              const done = crate ? isPlaced(scene.boxes[boxIndex], crate) : false;
              const hero = scene.hero.x === x && scene.hero.y === y;

              let background = 'var(--board-surface)';
              let border = '2px solid rgba(100, 116, 139, 0.45)';
              if (wall) {
                background = '#020617';
                border = '2px solid #475569';
              } else if (goalZone) {
                background = 'rgba(148, 163, 184, 0.12)';
                border = `2px dashed ${goalZone.color}`;
              }
              if (crate) {
                background = done ? 'rgba(52, 211, 153, 0.22)' : 'rgba(203, 213, 225, 0.16)';
                border = `2px solid ${done ? '#34D399' : '#CBD5E1'}`;
              }
              if (hero) border = '2px solid #34D399';

              const label = wall
                ? '기둥'
                : crate
                  ? `${crate.ask} 상자${done ? ', 제자리' : ''}`
                  : goalZone
                    ? `${goalZone.label} 구역`
                    : '빈 칸';

              return (
                <button
                  key={`${x}-${y}`}
                  type="button"
                  onClick={() => walkToward(x, y)}
                  disabled={wall || !game.playing}
                  aria-label={`${y + 1}줄 ${x + 1}칸, ${label}`}
                  className="relative flex items-center justify-center rounded-lg disabled:cursor-default"
                  style={{ background, border }}
                >
                  {hero && (
                    <span aria-hidden="true" style={{ fontSize: Math.round(cell * 0.52) }}>🧍</span>
                  )}
                  {crate && !hero && (
                    <span aria-hidden="true" style={{ fontSize: Math.round(cell * 0.5) }}>{crate.emoji}</span>
                  )}
                  {crate && done && (
                    <span
                      aria-hidden="true"
                      className="absolute right-0 top-0 text-[14px] font-black leading-none"
                      style={{ color: '#34D399' }}
                    >
                      ✓
                    </span>
                  )}
                  {crate && hintOn && !done && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b"
                      style={{ background: zoneOf(crate.zone).color }}
                    />
                  )}
                </button>
              );
            }))}
          </div>

          {/* 구역 이름표. 격자와 같은 줄 눈금에 맞춰야 어느 줄이 어느 구역인지 보인다. */}
          <div
            className="grid w-[96px] shrink-0 gap-[3px] py-1.5"
            style={{ gridTemplateRows: `repeat(${ROWS}, ${cell}px)` }}
          >
            {ZONES.map((zone) => (
              <div
                key={zone.id}
                className="flex flex-col items-center justify-center rounded-xl px-1 text-center"
                style={{
                  gridRow: `${zone.rows[0] + 1} / span ${zone.rows.length}`,
                  background: 'var(--board-surface)',
                  border: `2px solid ${zone.color}`,
                } as React.CSSProperties}
              >
                <span className="text-[14px] font-black leading-tight" style={{ color: 'var(--board-ink)' }}>
                  {zone.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 어떤 상자가 어떤 부탁인지 짝지어 읽는 자리 */}
        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          {stage.crates.map((crate, index) => {
            const done = isPlaced(scene.boxes[index], crate);
            return (
              <div
                key={crate.ask}
                className="flex items-center gap-1.5 rounded-xl px-2 py-1.5"
                style={{
                  background: 'var(--board-surface)',
                  border: `2px solid ${done ? '#34D399' : 'var(--board-line)'}`,
                }}
              >
                <span aria-hidden="true" className="text-[18px] leading-none">{crate.emoji}</span>
                <span className="text-[14px] font-bold leading-snug" style={{ color: 'var(--board-ink)' }}>
                  {crate.ask}
                </span>
                {hintOn && !done && (
                  <span
                    className="ml-auto shrink-0 text-[14px] font-black leading-tight"
                    style={{ color: zoneOf(crate.zone).color }}
                  >
                    {zoneOf(crate.zone).label}
                  </span>
                )}
                {done && <span aria-hidden="true" className="ml-auto text-[15px]">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </MiniGameFrame>
  );
}
