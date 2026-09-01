import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, useGameLoop } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m1-l10 · 음악 주문대 (장르 44 · 요리 타이쿤)
 *
 * "개인정보 없이 부탁하고, 받은 결과를 확인해서 고른다"를 주문대 일로 만든다.
 * 손님 쪽지에는 쓸 수 있는 조건과 개인정보가 섞여 있다. 개인정보를 남긴 채 보내면
 * 아이미가 만든 노래 가사에 그 낱말이 그대로 박혀 돌아온다. 정답표를 뒤지는 것이 아니라
 * 학생이 쪽지를 어떻게 정리했는지가 결과를 만든다.
 *
 * 결과를 받은 뒤가 이 차시의 핵심이다. 결과 카드와 학생이 직접 채운 주문판을 나란히 두고,
 * 두 장을 견주어 그대로 쓰기·고쳐 쓰기·쓰지 않기 세 칸 중 하나로 옮기게 한다. 그래서 옳은
 * 칸은 미리 정해진 값이 아니라 "내가 부탁한 것"과 "받은 것"의 차이에서 나온다.
 *
 * 조각에 자물쇠나 빨간 테두리를 미리 붙이지 않는다. 무엇이 개인정보인지 읽고 판단하는 일이
 * 이 게임의 알맹이인데, 색으로 미리 표시하면 그 판단이 통째로 사라진다.
 *
 * 조작은 전부 버튼 위에 있다. 끌어다 놓아도 되고, 조각을 누른 뒤 칸을 눌러도 놓인다.
 * 그래서 마우스를 쥐기 어려운 학생도 Tab과 Enter만으로 한 판을 끝까지 할 수 있다.
 */

type ChipKind = 'private' | 'mood' | 'length';

interface Chip {
  id: string;
  label: string;
  kind: ChipKind;
}

interface Customer {
  emoji: string;
  ask: string;
  mood: string;
  length: string;
  /** 쪽지에 섞인 개인정보 조각. 지원 수준에 따라 앞에서부터 몇 개만 쓴다. */
  privates: string[];
  /** 아이미가 만들어 오는 결과에 미리 정해 둔 흠. length면 부탁한 길이와 다르게 온다. */
  flaw: 'none' | 'length';
}

interface StageConfig {
  id: string;
  label: string;
  title: string;
  /** 바르게 처리해야 하는 손님 수 */
  target: number;
  /** 쪽지에 섞는 개인정보 조각의 기준 개수 */
  junk: number;
  /** 손님 한 명이 기다려 주는 기준 시간(초) */
  patience: number;
  customers: Customer[];
}

const STAGES: StageConfig[] = [
  {
    id: 'party', label: '기본', title: '축하 노래 주문', target: 3, junk: 2, patience: 34,
    customers: [
      { emoji: '🎂', ask: '생일에 틀 노래를 만들어 주세요.', mood: '신나게', length: '1분',
        privates: ['김○○', '3학년 2반', '집 전화번호', '우리 집 주소'], flaw: 'none' },
      { emoji: '🎈', ask: '반 잔치에서 쓸 노래가 필요해요.', mood: '따뜻하게', length: '2분',
        privates: ['박○○', '출석 번호 7번', '엄마 전화번호', '태어난 날'], flaw: 'length' },
      { emoji: '🎁', ask: '친구에게 줄 노래를 부탁해요.', mood: '조용하게', length: '30초',
        privates: ['이○○', '다니는 학교 이름', '사는 아파트 이름', '동생 이름'], flaw: 'none' },
    ],
  },
  {
    id: 'school', label: '1단계', title: '학교 행사 주문', target: 4, junk: 2, patience: 32,
    customers: [
      { emoji: '🏃', ask: '운동회 응원 노래를 부탁해요.', mood: '힘차게', length: '1분',
        privates: ['최○○', '5반 12번', '휴대전화 번호', '우리 집 주소'], flaw: 'none' },
      { emoji: '🎧', ask: '쉬는 시간에 들을 노래가 필요해요.', mood: '편안하게', length: '3분',
        privates: ['정○○', '우리 반 대화방 이름', '아빠 전화번호', '다니는 학원 이름'], flaw: 'length' },
      { emoji: '🎤', ask: '노래 자랑에 쓸 반주를 부탁해요.', mood: '신나게', length: '2분',
        privates: ['한○○', '2학년 4반', '태어난 날', '집 전화번호'], flaw: 'none' },
      { emoji: '🌧️', ask: '비 오는 날 들을 노래를 부탁해요.', mood: '차분하게', length: '1분',
        privates: ['오○○', '다니는 학교 이름', '보호자 전화번호', '사는 동네 이름'], flaw: 'length' },
    ],
  },
  {
    id: 'town', label: '2단계', title: '동네 가게 주문', target: 4, junk: 3, patience: 30,
    customers: [
      { emoji: '🎓', ask: '졸업식에서 틀 노래를 부탁해요.', mood: '따뜻하게', length: '2분',
        privates: ['윤○○', '졸업하는 학교 이름', '집 전화번호', '우리 집 주소'], flaw: 'none' },
      { emoji: '🚌', ask: '체험 학습 영상에 넣을 노래예요.', mood: '즐겁게', length: '3분',
        privates: ['강○○', '3반 9번', '보호자 전화번호', '태어난 날'], flaw: 'length' },
      { emoji: '📚', ask: '공부할 때 들을 노래를 부탁해요.', mood: '조용하게', length: '30초',
        privates: ['서○○', '다니는 학원 시간표', '사는 아파트 이름', '휴대전화 번호'], flaw: 'none' },
      { emoji: '🏅', ask: '상 받은 날 들을 노래를 부탁해요.', mood: '힘차게', length: '1분',
        privates: ['문○○', '1학년 3반', '집 전화번호', '다니는 학교 이름'], flaw: 'none' },
      { emoji: '🍰', ask: '가게 문 여는 날 틀 노래를 부탁해요.', mood: '밝게', length: '2분',
        privates: ['남○○', '가게 주소', '가게 전화번호', '가족 이름'], flaw: 'length' },
    ],
  },
];

const LENGTHS = ['30초', '1분', '2분', '3분'];
/** 흠이 있는 결과는 부탁한 길이에서 두 칸 떨어진 값으로 온다. 한 칸 차이는 눈에 잘 안 띈다. */
function otherLength(label: string): string {
  const index = LENGTHS.indexOf(label);
  return LENGTHS[(Math.max(0, index) + 2) % LENGTHS.length];
}

/** 조건 조각을 개인정보 사이에 끼워 둔다. 늘 같은 자리에 있으면 읽지 않고 손이 먼저 간다. */
function chipsFor(customer: Customer, junk: number): Chip[] {
  const chips: Chip[] = customer.privates
    .slice(0, Math.max(1, junk))
    .map((label, index) => ({ id: `p${index}`, label, kind: 'private' as const }));
  chips.splice(1, 0, { id: 'mood', label: customer.mood, kind: 'mood' });
  chips.push({ id: 'len', label: customer.length, kind: 'length' });
  return chips;
}

interface Waiting {
  index: number;
  patience: number;
  max: number;
}

interface Result {
  mood: string;
  length: string;
  problem: 'none' | 'length' | 'name';
  leaked: string | null;
}

interface World {
  queue: Waiting[];
  nextIndex: number;
  served: number;
  lives: number;
  phase: 'order' | 'making' | 'judge';
  makeTimer: number;
  trashed: string[];
  moodChip: string | null;
  lengthChip: string | null;
  result: Result | null;
  hint: boolean;
  flash: string;
  flashTimer: number;
  finished: boolean;
}

const QUEUE_CAP = 2;
const MAKE_SECONDS = 2.4;

function refill(world: World, stage: StageConfig, patienceMax: number): void {
  while (world.queue.length < QUEUE_CAP) {
    const index = world.nextIndex % stage.customers.length;
    world.queue.push({ index, patience: patienceMax, max: patienceMax });
    world.nextIndex += 1;
  }
}

function resetCounter(world: World): void {
  world.phase = 'order';
  world.makeTimer = 0;
  world.trashed = [];
  world.moodChip = null;
  world.lengthChip = null;
  world.result = null;
  world.hint = false;
}

function buildWorld(stage: StageConfig, patienceMax: number, lives: number): World {
  const world: World = {
    queue: [], nextIndex: 0, served: 0, lives,
    phase: 'order', makeTimer: 0, trashed: [], moodChip: null, lengthChip: null,
    result: null, hint: false, flash: '', flashTimer: 0, finished: false,
  };
  refill(world, stage, patienceMax);
  return world;
}

const VERDICTS = [
  { key: 'use', emoji: '✅', label: '그대로 쓰기' },
  { key: 'fix', emoji: '✏️', label: '고쳐 쓰기' },
  { key: 'drop', emoji: '🚫', label: '쓰지 않기' },
];
const RIGHT_SLOT: Record<Result['problem'], string> = { none: 'use', length: 'fix', name: 'drop' };

export default function MusicOrderCounterGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const patienceMax = stage.patience * tuning.time;
  const junkCount = Math.max(1, Math.round(stage.junk * tuning.density));
  const drain = tuning.speed;
  const maxLives = tuning.lives;

  const worldRef = useRef<World>(buildWorld(stage, patienceMax, maxLives));
  const boardRef = useRef<HTMLDivElement | null>(null);
  const zonesRef = useRef<Record<string, HTMLElement | null>>({});
  const grabRef = useRef({ x: 0, y: 0, moved: false });
  const suppressClick = useRef(false);

  const [, setFrame] = useState(0);
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; label: string; x: number; y: number } | null>(null);

  const redraw = () => setFrame((n) => n + 1);

  useEffect(() => {
    worldRef.current = buildWorld(stage, patienceMax, maxLives);
    setStarted(false);
    setSelected(null);
    setDrag(null);
    redraw();
  }, [game.round, game.stageIndex, stage, patienceMax, maxLives]);

  const endGame = (world: World, ok: boolean, text: string) => {
    if (world.finished) return;
    world.finished = true;
    if (ok) game.succeed(text);
    else game.fail(text);
  };

  /** 손님 한 명을 보낸다. 옳게 골랐으면 판매 한 건, 틀렸으면 기회 하나를 잃는다. */
  const closeCustomer = (world: World, ok: boolean, text: string) => {
    world.flash = text;
    world.flashTimer = 2.6;
    if (ok) {
      world.served += 1;
      playSound('stamp');
    } else {
      world.lives -= 1;
      playSound('select');
    }
    world.queue.shift();
    resetCounter(world);
    if (world.served >= stage.target) {
      endGame(world, true, `개인정보를 지우고 주문 ${stage.target}개를 끝까지 확인해서 보냈습니다!`);
      return;
    }
    if (world.lives <= 0) {
      endGame(world, false, '주문대가 밀렸어요. 개인정보 조각을 먼저 버리고, 결과와 주문판을 견주어 고릅니다.');
      return;
    }
    refill(world, stage, patienceMax);
  };

  const tick = (dt: number) => {
    const world = worldRef.current;
    if (world.finished) return;

    /* 앞 손님의 기다림은 주문을 받는 동안에만 줄어든다. 아이미가 만드는 시간과 결과를 살피는
       시간까지 재촉하면 이 차시의 알맹이인 "확인하기"를 할 수 없게 된다. 대신 뒤에서 기다리는
       손님은 늘 조금씩 줄어들어, 오래 머뭇거리면 줄이 무너진다. */
    for (let i = 0; i < world.queue.length; i += 1) {
      const rate = i === 0 ? (world.phase === 'order' ? 1 : 0) : 0.22;
      world.queue[i].patience = Math.max(0, world.queue[i].patience - dt * rate * drain);
    }

    if (world.phase === 'making') {
      world.makeTimer -= dt;
      if (world.makeTimer <= 0) {
        world.phase = 'judge';
        playSound('confirm');
      }
    }
    if (world.flashTimer > 0) world.flashTimer = Math.max(0, world.flashTimer - dt);

    const gone = world.queue.findIndex((waiting) => waiting.patience <= 0);
    if (gone === 0) {
      closeCustomer(world, false, '기다리다 지쳐 그냥 갔어요. 조각을 조금 더 빠르게 정리합니다.');
    } else if (gone > 0) {
      world.queue.splice(gone, 1);
      world.lives -= 1;
      world.flash = '줄에서 기다리던 손님이 갔어요. 앞 손님을 먼저 끝냅니다.';
      world.flashTimer = 2.6;
      if (world.lives <= 0) {
        endGame(world, false, '줄이 무너졌어요. 앞 손님의 조각부터 하나씩 정리해서 보냅니다.');
      } else {
        refill(world, stage, patienceMax);
      }
    }
    redraw();
  };

  useGameLoop(game.playing && started, tick);

  const world = worldRef.current;
  const front = world.queue[0];
  const customer = front ? stage.customers[front.index] : null;
  const chips = customer ? chipsFor(customer, junkCount) : [];
  const onSlip = chips.filter(
    (chip) => !world.trashed.includes(chip.id) && chip.id !== world.moodChip && chip.id !== world.lengthChip,
  );
  const ordering = game.playing && started && world.phase === 'order';
  const judging = game.playing && started && world.phase === 'judge';
  const canSend = ordering && world.moodChip !== null && world.lengthChip !== null;

  const chipById = (id: string) => chips.find((chip) => chip.id === id) ?? null;

  /** 보내기 — 쪽지에 남은 개인정보가 있으면 그 낱말이 결과 가사에 그대로 실려 온다. */
  const send = () => {
    if (!canSend || !customer) return;
    const leaked = onSlip.find((chip) => chip.kind === 'private') ?? null;
    const problem: Result['problem'] = leaked ? 'name' : customer.flaw === 'length' ? 'length' : 'none';
    world.result = {
      mood: customer.mood,
      length: problem === 'length' ? otherLength(customer.length) : customer.length,
      problem,
      leaked: leaked ? leaked.label : null,
    };
    world.phase = 'making';
    world.makeTimer = MAKE_SECONDS;
    setSelected(null);
    playSound('confirm');
    redraw();
  };

  const placeChip = (chipId: string, zone: string) => {
    const chip = chipById(chipId);
    if (!chip || !ordering) return;
    if (zone === 'trash') {
      world.trashed = [...world.trashed, chip.id];
      playSound('select');
    } else if (zone === 'mood' && chip.kind === 'mood') {
      world.moodChip = chip.id;
      playSound('fill');
    } else if (zone === 'length' && chip.kind === 'length') {
      world.lengthChip = chip.id;
      playSound('fill');
    } else {
      return;
    }
    setSelected(null);
    redraw();
  };

  const placeCard = (zone: string) => {
    if (!judging || !world.result) return;
    const right = RIGHT_SLOT[world.result.problem];
    setSelected(null);
    if (zone === right) {
      closeCustomer(world, true, '손님이 웃으며 받아 갔습니다.');
    } else if (world.result.problem === 'name') {
      closeCustomer(world, false, '가사에 이름이 남아 있었어요. 그런 결과는 쓰지 않습니다.');
    } else if (world.result.problem === 'length') {
      closeCustomer(world, false, '부탁한 길이와 달랐어요. 그럴 때는 고쳐 씁니다.');
    } else {
      closeCustomer(world, false, '부탁한 대로 잘 나온 결과였어요. 그럴 때는 그대로 씁니다.');
    }
    redraw();
  };

  const localPoint = (clientX: number, clientY: number) => {
    const box = boardRef.current?.getBoundingClientRect();
    return { x: clientX - (box?.left ?? 0), y: clientY - (box?.top ?? 0) };
  };

  const zoneAt = (clientX: number, clientY: number): string | null => {
    for (const key of Object.keys(zonesRef.current)) {
      const element = zonesRef.current[key];
      if (!element) continue;
      const box = element.getBoundingClientRect();
      if (clientX >= box.left && clientX <= box.right && clientY >= box.top && clientY <= box.bottom) return key;
    }
    return null;
  };

  const registerZone = (key: string) => (element: HTMLButtonElement | null) => {
    zonesRef.current[key] = element;
  };

  /* 끌기와 누르기를 한 손잡이에 모은다. 8px 넘게 움직였으면 놓은 자리로 옮기고,
     제자리에서 뗐으면 그저 고른 것으로 본다. 고른 뒤 칸을 누르면 같은 일이 일어나므로
     자판만으로도 같은 판을 할 수 있다. */
  const dragHandlers = (id: string, label: string, allowed: boolean) => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!allowed) return;
      try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* 무시 */ }
      grabRef.current = { x: event.clientX, y: event.clientY, moved: false };
      setDrag({ id, label, ...localPoint(event.clientX, event.clientY) });
    },
    onPointerMove: (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!allowed || !drag || drag.id !== id) return;
      const moved = Math.abs(event.clientX - grabRef.current.x) + Math.abs(event.clientY - grabRef.current.y);
      if (moved > 8) grabRef.current.moved = true;
      setDrag({ id, label, ...localPoint(event.clientX, event.clientY) });
    },
    onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!allowed) return;
      setDrag(null);
      if (!grabRef.current.moved) return;
      suppressClick.current = true;
      const zone = zoneAt(event.clientX, event.clientY);
      if (!zone) return;
      if (id === 'card') placeCard(zone);
      else placeChip(id, zone);
    },
    onPointerCancel: () => setDrag(null),
  });

  const takeClick = (id: string, allowed: boolean) => () => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (!allowed) return;
    setSelected((current) => (current === id ? null : id));
    playSound('select');
  };

  const zoneClick = (zone: string) => () => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (selected === 'card') placeCard(zone);
    else if (selected) placeChip(selected, zone);
    else if (zone === 'trash' && ordering && world.trashed.length > 0) {
      // 잘못 버렸을 때 되돌릴 길이 없으면 그 손님은 손도 못 대고 떠난다. 벌 대신 되돌리기를 둔다.
      world.trashed = world.trashed.slice(0, -1);
      redraw();
    } else if (zone === 'mood' && ordering && world.moodChip) { world.moodChip = null; redraw(); }
    else if (zone === 'length' && ordering && world.lengthChip) { world.lengthChip = null; redraw(); }
  };

  let bandEmoji = '🎧';
  let bandText = '주문대를 열면 손님이 들어옵니다.';
  if (world.flashTimer > 0) { bandEmoji = '💬'; bandText = world.flash; }
  else if (world.phase === 'making') { bandEmoji = '🎼'; bandText = '아이미가 노래를 만들고 있습니다. 잠시 기다립니다.'; }
  else if (world.phase === 'judge') { bandEmoji = '🔍'; bandText = '받은 결과와 주문판을 견주어 보고 오른쪽 칸으로 옮깁니다.'; }
  else if (customer) { bandEmoji = customer.emoji; bandText = `손님: “${customer.ask}”`; }

  const slotBox = (kind: 'mood' | 'length', title: string) => {
    const chip = chipById(kind === 'mood' ? world.moodChip ?? '' : world.lengthChip ?? '');
    return (
      <button
        key={kind}
        type="button"
        ref={registerZone(kind)}
        onClick={zoneClick(kind)}
        className="min-h-[62px] flex-1 rounded-xl px-2 py-1.5 text-center"
        style={{
          background: chip ? 'rgba(52, 211, 153, 0.18)' : 'var(--board-overlay)',
          border: `2px solid ${chip ? '#34D399' : 'var(--board-line)'}`,
        }}
      >
        <span className="block text-[14px] font-black" style={{ color: 'var(--board-ink)', opacity: 0.75 }}>{title}</span>
        <span className="block text-[16px] font-black" style={{ color: 'var(--board-ink)' }}>
          {chip ? chip.label : '비어 있음'}
        </span>
      </button>
    );
  };

  return (
    <MiniGameFrame
      badge="음악 주문대"
      instruction="쪽지에서 개인정보 조각을 휴지통으로 옮기고, 남은 조각을 주문판의 분위기·길이 칸에 끼운 뒤 아이미에게 보냅니다. 돌아온 결과 카드는 오른쪽 세 칸 중 하나로 옮기세요."
      progress={{ label: '보낸 주문', value: world.served, max: stage.target }}
      hud={<GameHud lives={world.lives} maxLives={maxLives} timeLeft={front ? front.patience : 0} timeTotal={patienceMax} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].title}으로 바꿨습니다.`)}
      status={game.status}
      message={game.message}
      actions={
        <>
          <MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" />
          {game.hintAllowed && (
            <MiniGameButton
              onClick={() => { world.hint = true; redraw(); }}
              disabled={!ordering}
              emoji="💡"
              label="힌트"
            />
          )}
          <MiniGameButton onClick={send} disabled={!canSend} emoji="📮" label="아이미에게 보내기" variant="primary" />
        </>
      }
    >
      <div ref={boardRef} className="relative flex min-h-0 flex-1 flex-col gap-2">
        <div
          className="flex items-center gap-2 rounded-xl px-2.5 py-1.5"
          style={{ background: 'var(--board-surface)', border: '2px solid #38BDF8' }}
        >
          <span className="text-[22px]" aria-hidden="true">{bandEmoji}</span>
          <span className="text-[15px] font-black leading-snug" style={{ color: 'var(--board-ink)' }}>{bandText}</span>
        </div>

        <div className="flex min-h-0 flex-1 items-stretch gap-2">
          {/* 손님 줄 — 막대가 줄어드는 모습이 시간 압박의 유일한 신호다 */}
          <div className="flex w-[118px] shrink-0 flex-col gap-1.5">
            {world.queue.map((waiting, index) => {
              const person = stage.customers[waiting.index];
              const ratio = waiting.max > 0 ? waiting.patience / waiting.max : 0;
              return (
                <div
                  key={`${waiting.index}-${index}`}
                  className="rounded-xl p-1.5 text-center"
                  style={{
                    background: 'var(--board-surface)',
                    border: `2px solid ${index === 0 ? '#FBBF24' : 'var(--board-line)'}`,
                  }}
                >
                  <span className="block text-[26px] leading-none" aria-hidden="true">{person.emoji}</span>
                  <span className="block text-[14px] font-black" style={{ color: 'var(--board-ink)' }}>
                    {index === 0 ? '주문 중' : '기다리는 중'}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 block h-3 overflow-hidden rounded-full"
                    style={{ background: 'var(--board-overlay)', border: '2px solid var(--board-line)' }}
                  >
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${ratio * 100}%`, background: ratio < 0.3 ? '#FB923C' : '#34D399' }}
                    />
                  </span>
                </div>
              );
            })}
          </div>

          {/* 작업대 — 쪽지, 휴지통, 주문판. 결과가 오면 쪽지 자리에 결과 카드가 놓인다 */}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div
              className="flex min-h-[92px] flex-1 flex-wrap content-start items-start gap-1.5 rounded-xl p-2"
              style={{ background: 'var(--board-overlay)', border: '2px solid var(--board-line)' }}
            >
              {world.phase === 'order' && onSlip.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  disabled={!ordering}
                  {...dragHandlers(chip.id, chip.label, ordering)}
                  onClick={takeClick(chip.id, ordering)}
                  className="min-h-11 rounded-xl px-2.5 py-1 text-[15px] font-black"
                  style={{
                    background: selected === chip.id ? 'rgba(251, 191, 36, 0.28)' : 'var(--board-surface)',
                    color: 'var(--board-ink)',
                    border: `2px solid ${
                      selected === chip.id ? '#FBBF24' : world.hint && chip.kind === 'private' ? '#FB7185' : 'var(--board-line)'
                    }`,
                  }}
                >
                  {chip.label}
                </button>
              ))}
              {world.phase === 'making' && (
                <span className="w-full py-4 text-center text-[16px] font-black" style={{ color: 'var(--board-ink)' }}>
                  🎼 아이미가 만드는 중…
                </span>
              )}
              {world.phase === 'judge' && world.result && (
                <button
                  type="button"
                  {...dragHandlers('card', '🎵 결과 카드', judging)}
                  onClick={takeClick('card', judging)}
                  className="w-full rounded-xl px-2.5 py-2 text-left"
                  style={{
                    background: selected === 'card' ? 'rgba(251, 191, 36, 0.28)' : 'var(--board-surface)',
                    border: `2px solid ${selected === 'card' ? '#FBBF24' : '#C4B5FD'}`,
                  }}
                >
                  <span className="block text-[15px] font-black" style={{ color: 'var(--board-ink)', opacity: 0.8 }}>
                    🎵 아이미가 만든 노래
                  </span>
                  <span className="block text-[17px] font-black" style={{ color: 'var(--board-ink)' }}>
                    분위기 {world.result.mood} · 길이 {world.result.length}
                  </span>
                  <span className="block text-[15px] font-black leading-snug" style={{ color: 'var(--board-ink)' }}>
                    {world.result.leaked
                      ? `가사에 ‘${world.result.leaked}’이(가) 들어 있습니다.`
                      : '가사에 개인정보는 없습니다.'}
                  </span>
                </button>
              )}
            </div>

            <div className="flex items-stretch gap-1.5">
              <button
                type="button"
                ref={registerZone('trash')}
                onClick={zoneClick('trash')}
                className="min-h-[62px] w-[92px] shrink-0 rounded-xl px-1 py-1.5 text-center"
                style={{ background: 'var(--board-overlay)', border: '2px solid #FB7185' }}
              >
                <span className="block text-[22px] leading-none" aria-hidden="true">🗑️</span>
                <span className="block text-[14px] font-black" style={{ color: 'var(--board-ink)' }}>
                  버리기 {world.trashed.length}
                </span>
              </button>
              {slotBox('mood', '분위기')}
              {slotBox('length', '길이')}
            </div>
          </div>

          {/* 처리 슬롯 — 결과 카드를 옮겨 놓는 세 칸 */}
          <div className="flex w-[136px] shrink-0 flex-col gap-1.5">
            {VERDICTS.map((verdict) => (
              <button
                key={verdict.key}
                type="button"
                ref={registerZone(verdict.key)}
                onClick={zoneClick(verdict.key)}
                className="flex flex-1 flex-col items-center justify-center rounded-xl p-1 text-center"
                style={{
                  background: 'var(--board-surface)',
                  border: `2px solid ${judging ? '#C4B5FD' : 'var(--board-line)'}`,
                  opacity: judging ? 1 : 0.55,
                }}
              >
                <span className="text-[22px] leading-none" aria-hidden="true">{verdict.emoji}</span>
                <span className="text-[15px] font-black leading-tight" style={{ color: 'var(--board-ink)' }}>
                  {verdict.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {drag && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-xl px-2.5 py-1 text-[15px] font-black"
            style={{ left: drag.x, top: drag.y, background: '#FBBF24', color: '#3B2100', border: '2px solid #B45309' }}
          >
            {drag.label}
          </span>
        )}

        {/* 준비 상태 — 문을 열기 전에는 어떤 막대도 줄지 않는다 */}
        {!started && game.playing && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-xl p-4"
            style={{ background: 'rgba(2, 6, 23, 0.94)', border: '2px solid #FBBF24' }}
          >
            <p className="max-w-[440px] text-center text-[16px] font-black leading-relaxed" style={{ color: 'var(--board-ink)' }}>
              문을 열면 손님이 들어옵니다. 쪽지에서 개인정보 조각을 버리고, 분위기와 길이를 채워 보냅니다.
            </p>
            <button
              type="button"
              onClick={() => { setStarted(true); playSound('confirm'); }}
              className="min-h-12 rounded-xl px-5 text-[16px] font-black"
              style={{ background: '#FBBF24', color: '#3B2100', border: '2px solid #B45309' }}
            >
              🔔 주문대 열기
            </button>
          </div>
        )}
      </div>
    </MiniGameFrame>
  );
}
