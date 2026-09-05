import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, shuffle, useCountdown } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m1-l10 · 노래 짝 맞추기 (장르 42 · 카드 짝맞추기)
 *
 * 이 차시가 가르치는 것은 "아이미가 준 결과를 부탁과 견주어 쓸지 고칠지 안 쓸지 고르는 일"이다.
 * 앞선 판은 주문대를 돌리는 경영 게임이라 손님을 처리하는 속도가 앞에 서고, 정작 결과와 부탁을
 * 견주는 일은 마지막 한 번으로 밀려 있었다. 그래서 견주는 일 자체를 조작으로 만든다.
 *
 * 판에는 부탁 카드 여러 장과 아이미가 만들어 온 노래 카드가 함께 있다. 노래 한 장을 끌어
 * 부탁 카드 위에 놓으면 짝이 맞고, 어떤 부탁에도 맞지 않는 노래는 안 써요 상자로 간다.
 * 분위기는 맞는데 길이나 가사 한 가지가 어긋난 노래는 고쳐서 써요 자리로 간다.
 * 그래서 세 갈래(그대로 쓰기·고쳐 쓰기·안 쓰기)가 모두 학생의 손끝에서 갈린다.
 *
 * 카드 앞면을 가리지 않는다. 뒤집어 외우는 놀이로 만들면 기억력 시험이 되고, 이 차시가
 * 요구하는 "읽고 견주는 일"이 통째로 사라진다(m3-l8이 뒤집는 쪽을 맡는다).
 *
 * 조작은 끌어놓기와 누르기 둘 다 된다. 마우스를 쥐기 어려운 학생도 카드를 누르고 자리를
 * 눌러 한 판을 끝까지 할 수 있다.
 */

type CardKind = 'fit' | 'fix' | 'drop';

interface Ask {
  id: string;
  emoji: string;
  /** 언제 쓸 노래인지 */
  when: string;
  /** 어떤 노래를 부탁했는지 */
  want: string;
}

interface Song {
  id: string;
  title: string;
  /** 분위기와 길이를 한 줄로 */
  note: string;
  kind: CardKind;
  /** kind가 fit일 때 짝이 되는 부탁 */
  askId?: string;
  /** 제자리에 놓았을 때 알려 줄 까닭 */
  why: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  asks: Ask[];
  songs: Song[];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'ready',
    label: '기본',
    spoken: '체험회에 틀 노래를 부탁과 짝지어요.',
    scene: '체험회 준비',
    seconds: 110,
    asks: [
      { id: 'dance', emoji: '💃', when: '댄스 타임', want: '다 같이 춤출 신나는 노래' },
      { id: 'rest', emoji: '🌿', when: '쉬는 시간', want: '조용히 쉴 잔잔한 노래' },
    ],
    songs: [
      {
        id: 's1', title: '쿵쿵 신나는 댄스곡', note: '빠르고 신나요 · 3분',
        kind: 'fit', askId: 'dance', why: '빠르고 신나서 춤추기에 맞아요.',
      },
      {
        id: 's2', title: '살랑살랑 산책 노래', note: '느리고 편안해요 · 4분',
        kind: 'fit', askId: 'rest', why: '느리고 편안해서 쉬는 시간에 맞아요.',
      },
      {
        id: 's3', title: '조용한 아기 자장가', note: '아기를 재우는 노래예요',
        kind: 'drop', why: '재우는 노래라 어느 부탁에도 맞지 않아요.',
      },
      {
        id: 's4', title: '신나는 응원가', note: '신나지만 10분이나 돼요',
        kind: 'fix', why: '분위기는 맞아요. 짧게 잘라서 쓰면 됩니다.',
      },
    ],
  },
  {
    id: 'event',
    label: '1단계',
    spoken: '학급 행사에 틀 노래를 부탁과 짝지어요.',
    scene: '학급 행사',
    seconds: 130,
    asks: [
      { id: 'enter', emoji: '🚪', when: '입장', want: '짧고 밝은 노래' },
      { id: 'photo', emoji: '📸', when: '사진 찍을 때', want: '잔잔한 노래' },
      { id: 'close', emoji: '🎤', when: '마무리', want: '다 같이 부르는 노래' },
    ],
    songs: [
      {
        id: 's1', title: '반짝 인사 노래', note: '밝고 짧아요 · 1분',
        kind: 'fit', askId: 'enter', why: '짧고 밝아서 들어올 때에 맞아요.',
      },
      {
        id: 's2', title: '구름 위 피아노', note: '잔잔해요 · 3분',
        kind: 'fit', askId: 'photo', why: '잔잔해서 사진 찍을 때에 맞아요.',
      },
      {
        id: 's3', title: '우리 반 다 같이', note: '따라 부르기 쉬워요 · 3분',
        kind: 'fit', askId: 'close', why: '다 같이 부르기 좋아서 마무리에 맞아요.',
      },
      {
        id: 's4', title: '무서운 이야기 배경음악', note: '어둡고 무거워요',
        kind: 'drop', why: '행사 분위기와 아주 달라서 쓰지 않아요.',
      },
      {
        id: 's5', title: '빠른 랩', note: '밝지만 가사에 친구 이름이 있어요',
        kind: 'fix', why: '이름을 빼고 고치면 쓸 수 있어요.',
      },
      {
        id: 's6', title: '긴 연주곡', note: '잔잔하지만 30분이나 돼요',
        kind: 'fix', why: '분위기는 맞아요. 짧게 잘라서 쓰면 됩니다.',
      },
      {
        id: 's7', title: '과자 광고 노래', note: '광고에 나오는 노래예요',
        kind: 'drop', why: '행사에 쓰려고 만든 노래가 아니라 쓰지 않아요.',
      },
    ],
  },
  {
    id: 'festival',
    label: '2단계',
    spoken: '체험회 본 행사에 틀 노래를 부탁과 짝지어요.',
    scene: '체험회 본 행사',
    seconds: 150,
    asks: [
      { id: 'welcome', emoji: '🙌', when: '손님 맞이', want: '밝고 조용한 노래' },
      { id: 'dance', emoji: '💃', when: '댄스 타임', want: '빠른 노래' },
      { id: 'meal', emoji: '🍪', when: '먹는 시간', want: '이야기를 방해하지 않는 노래' },
      { id: 'bye', emoji: '👋', when: '끝인사', want: '따뜻한 노래' },
    ],
    songs: [
      {
        id: 's1', title: '햇살 인사', note: '밝고 조용해요 · 2분',
        kind: 'fit', askId: 'welcome', why: '밝고 조용해서 손님 맞이에 맞아요.',
      },
      {
        id: 's2', title: '점프 점프', note: '아주 빨라요 · 3분',
        kind: 'fit', askId: 'dance', why: '빨라서 춤추기에 맞아요.',
      },
      {
        id: 's3', title: '작은 기타 연주', note: '노랫말이 없어요 · 5분',
        kind: 'fit', askId: 'meal', why: '노랫말이 없어서 이야기를 방해하지 않아요.',
      },
      {
        id: 's4', title: '고마워 안녕', note: '따뜻해요 · 3분',
        kind: 'fit', askId: 'bye', why: '따뜻해서 끝인사에 맞아요.',
      },
      {
        id: 's5', title: '큰 소리 행진곡', note: '따뜻하지만 소리가 너무 커요',
        kind: 'fix', why: '소리를 줄여서 고치면 쓸 수 있어요.',
      },
      {
        id: 's6', title: '우리 학교 노래', note: '밝지만 학교 이름이 들어 있어요',
        kind: 'fix', why: '학교 이름을 빼고 고치면 쓸 수 있어요.',
      },
      {
        id: 's7', title: '천둥 빗소리', note: '노래가 아니라 소리예요',
        kind: 'drop', why: '노래가 아니라서 어느 부탁에도 맞지 않아요.',
      },
      {
        id: 's8', title: '아기 상어 율동', note: '아주 어린 아이들 노래예요',
        kind: 'drop', why: '손님 나이와 맞지 않아서 쓰지 않아요.',
      },
      {
        id: 's9', title: '시험 안내 방송', note: '노래가 아니라 안내예요',
        kind: 'drop', why: '안내 방송이라 행사에 쓰지 않아요.',
      },
    ],
  },
];

/**
 * 노래 제목 뒤에 붙일 조사를 고른다.
 *
 * 제목이 데이터라 어느 조사가 맞는지 미리 적어 둘 수 없다. 받침이 있으면 은/을,
 * 없으면 는/를이다. 한글이 아닌 글자로 끝나면 받침 없는 쪽으로 읽는다.
 */
function mark(word: string, withBatchim: string, without: string): string {
  const last = word.charCodeAt(word.length - 1);
  if (Number.isNaN(last) || last < 0xac00 || last > 0xd7a3) return without;
  return (last - 0xac00) % 28 === 0 ? without : withBatchim;
}

/** 노래가 가야 할 자리의 이름. 틀린 자리에 놓았을 때 무엇을 다시 볼지 알려 준다. */
const SPOT_NAME: Record<string, string> = {
  fix: '고쳐서 써요',
  drop: '안 써요',
};

interface Placed {
  /** 놓인 자리. 부탁 id이거나 'fix' | 'drop' */
  spot: string;
  right: boolean;
}

export default function SongMatchGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 시간·기회와 판에 함께 놓이는 노래 수로 나타난다. 부탁과 정답 짝은 그대로다.
     density를 줄이면 아직 안 맞는 노래(고쳐 쓰기·안 쓰기)만 몇 장 빠져, 견주는 일 자체는
     세 수준에서 똑같이 일어난다. */
  const seconds = Math.round(stage.seconds * clamp(tuning.time, 0.8, 1.5));
  const maxLives = tuning.lives;

  const songs = React.useMemo(() => {
    const random = createRandom(game.seed);
    const need = stage.songs.filter((song) => song.kind === 'fit');
    const extra = stage.songs.filter((song) => song.kind !== 'fit');
    const keep = clamp(Math.round(extra.length * clamp(tuning.density, 0.6, 1.2)), 2, extra.length);
    return shuffle(random, [...need, ...shuffle(random, extra).slice(0, keep)]);
  }, [stage, game.seed, tuning.density]);

  const [placed, setPlaced] = useState<Record<string, Placed>>({});
  const [held, setHeld] = useState<string | null>(null);
  const [lives, setLives] = useState(maxLives);
  const [note, setNote] = useState('');
  const [drag, setDrag] = useState<{ id: string; x: number; y: number; over: string | null } | null>(null);
  const dragRef = useRef<{ id: string; moved: boolean } | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    setPlaced({});
    setHeld(null);
    setLives(maxLives);
    setNote('');
    setDrag(null);
    dragRef.current = null;
    doneRef.current = false;
  }, [game.round, game.stageIndex, stage, maxLives, songs]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 40 + game.stageIndex, () => {
    if (doneRef.current) return;
    doneRef.current = true;
    game.fail('시간이 다 되었어요. 부탁에 적힌 조건과 노래 설명을 나란히 읽어 보세요.');
  });

  const rightSpot = (song: Song) => (song.kind === 'fit' ? (song.askId as string) : song.kind);
  const doneCount = Object.keys(placed).filter((id) => placed[id].right).length;

  /** 노래 한 장을 자리에 놓는다. 끌어놓기와 누르기가 모두 여기로 모인다. */
  const put = (songId: string, spot: string) => {
    if (!game.playing || doneRef.current) return;
    const song = songs.find((item) => item.id === songId);
    if (!song || placed[songId]?.right) return;

    if (rightSpot(song) !== spot) {
      playSound('select');
      setHeld(null);
      const askedFor = stage.asks.find((ask) => ask.id === spot);
      setNote(
        askedFor
          ? `「${song.title}」${mark(song.title, '은', '는')} ${askedFor.when} 부탁과 맞지 않아요. ${song.note}.`
          : `「${song.title}」${mark(song.title, '을', '를')} ${SPOT_NAME[spot] ?? '그 자리'}에 두면 안 돼요. ${song.note}.`,
      );
      const left = lives - 1;
      setLives(Math.max(0, left));
      if (left <= 0) {
        doneRef.current = true;
        game.fail('기회를 다 썼어요. 부탁의 조건을 먼저 읽고 같은 조건의 노래를 찾아보세요.');
      }
      return;
    }

    playSound('fill');
    setHeld(null);
    setNote(song.why);
    const next = { ...placed, [songId]: { spot, right: true } };
    setPlaced(next);
    if (Object.keys(next).filter((id) => next[id].right).length >= songs.length) {
      doneRef.current = true;
      game.succeed('부탁과 노래를 모두 짝지었어요. 결과가 부탁에 맞는지 견주어 보고 골랐습니다.');
    }
  };

  /* ── 끌어놓기 ────────────────────────────────────────────────
     놓을 자리는 data-drop으로 표시하고, 손을 뗀 자리 밑에 무엇이 있는지 찾아 옮긴다.
     자리마다 ref를 들고 좌표를 재는 것보다 짧고, 판이 스크롤되어도 어긋나지 않는다. */
  const spotUnder = (x: number, y: number) => {
    const element = document.elementFromPoint(x, y) as HTMLElement | null;
    return element?.closest('[data-drop]')?.getAttribute('data-drop') ?? null;
  };

  const onCardDown = (event: React.PointerEvent<HTMLButtonElement>, songId: string) => {
    if (!game.playing || placed[songId]?.right) return;
    dragRef.current = { id: songId, moved: false };
    setHeld(songId);
    setDrag({ id: songId, x: event.clientX, y: event.clientY, over: null });
    // 합성 이벤트에는 이 함수가 없다. 없다고 조작이 멈추면 안 된다.
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* 없어도 된다 */ }
  };

  const onCardMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    dragRef.current.moved = true;
    setDrag({
      id: dragRef.current.id,
      x: event.clientX,
      y: event.clientY,
      over: spotUnder(event.clientX, event.clientY),
    });
  };

  const onCardUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!current) return;
    const spot = spotUnder(event.clientX, event.clientY);
    // 제자리에서 뗐으면 "고른 것"으로 둔다. 그다음 자리를 눌러 놓을 수 있다.
    if (spot) put(current.id, spot);
  };

  const trayCards = songs.filter((song) => !placed[song.id]?.right);
  const dragging = drag ? songs.find((song) => song.id === drag.id) : null;

  /** 놓을 자리 한 칸. 부탁 카드와 두 상자가 같은 손짓을 받는다. */
  const dropStyle = (spot: string, filled: boolean, accent: string) => ({
    background: filled ? 'rgba(74, 222, 128, 0.18)' : 'var(--board-overlay)',
    border: `3px solid ${filled ? '#4ADE80' : drag?.over === spot ? '#FBBF24' : accent}`,
    color: 'var(--board-ink)',
  });

  return (
    <MiniGameFrame
      badge="노래 짝 맞추기"
      instruction="인공지능이 만든 노래를 어울리는 부탁 카드 위로 옮겨 보세요. 고쳐서 쓸 노래와 안 쓸 노래도 알맞은 상자에 나누어 담아 봅시다."
      progress={{ label: '짝지은 노래', value: doneCount, max: songs.length }}
      hud={<GameHud lives={lives} maxLives={maxLives} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={(
        <div
          className="flex items-center gap-2 rounded-xl px-2.5 py-2"
          style={{ background: 'var(--paper-0)', border: '2px solid var(--line)' }}
        >
          <span aria-hidden="true" className="text-[22px]">🎧</span>
          <span role="status" className="text-[15px] font-black leading-snug" style={{ color: 'var(--ink-1)' }}>
            {note || '부탁 카드에 적힌 조건과 노래 설명을 나란히 읽어 보세요.'}
          </span>
          <span className="ml-auto shrink-0 text-[15px] font-black" style={{ color: 'var(--ink-1)' }}>
            {stage.scene}
          </span>
        </div>
      )}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {/* 부탁 카드 — 노래가 가야 할 자리다 */}
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${stage.asks.length}, minmax(0, 1fr))` }}>
          {stage.asks.map((ask) => {
            const owner = songs.find((song) => placed[song.id]?.spot === ask.id && placed[song.id]?.right);
            return (
              <button
                key={ask.id}
                type="button"
                data-drop={ask.id}
                onClick={() => held && put(held, ask.id)}
                disabled={!game.playing}
                aria-label={`${ask.when} 부탁. ${ask.want}. ${owner ? `${owner.title}을 놓았습니다.` : '아직 비어 있습니다.'}`}
                className="flex min-h-[92px] flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1.5 text-center"
                style={dropStyle(ask.id, !!owner, '#38BDF8')}
              >
                <span aria-hidden="true" className="text-[24px] leading-none">{ask.emoji}</span>
                <span className="text-[15px] font-black leading-tight">{ask.when}</span>
                <span className="text-[14px] font-bold leading-tight" style={{ color: '#CBD5E1' }}>{ask.want}</span>
                {owner && (
                  <span className="mt-0.5 rounded px-1 text-[14px] font-black leading-tight" style={{ background: 'rgba(74, 222, 128, 0.28)' }}>
                    {owner.title}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 아이미가 만들어 온 노래 */}
        <div
          className="flex min-h-0 flex-1 flex-wrap content-start gap-1.5 overflow-auto rounded-xl p-1.5"
          style={{ background: 'var(--board-surface)', border: '2px solid var(--board-line)' }}
        >
          {trayCards.length === 0 && (
            <p className="w-full py-4 text-center text-[15px] font-black" style={{ color: 'var(--board-ink)' }}>
              노래를 모두 옮겼습니다.
            </p>
          )}
          {trayCards.map((song) => {
            const on = held === song.id;
            return (
              <button
                key={song.id}
                type="button"
                onPointerDown={(event) => onCardDown(event, song.id)}
                onPointerMove={onCardMove}
                onPointerUp={onCardUp}
                onPointerCancel={() => { dragRef.current = null; setDrag(null); }}
                /* Tab과 Enter로도 고를 수 있어야 한다. Enter는 click만 일으키고
                   pointerdown을 일으키지 않아, 끌어놓기 쪽 처리만으로는 손이 닿지 않는다. */
                onClick={() => { if (game.playing) { setHeld(song.id); setNote(''); } }}
                disabled={!game.playing}
                aria-label={`${song.title}. ${song.note}. 고른 뒤 자리를 누르면 옮겨집니다.`}
                className="flex min-w-[150px] flex-1 touch-none flex-col items-start justify-center rounded-xl px-2 py-1.5 text-left"
                style={{
                  background: on ? 'rgba(251, 191, 36, 0.24)' : 'var(--board-overlay)',
                  border: `3px solid ${on ? '#FBBF24' : 'var(--board-line)'}`,
                  color: 'var(--board-ink)',
                  opacity: drag?.id === song.id ? 0.45 : 1,
                }}
              >
                <span className="text-[15px] font-black leading-tight">🎵 {song.title}</span>
                <span className="text-[14px] font-bold leading-tight" style={{ color: '#CBD5E1' }}>{song.note}</span>
              </button>
            );
          })}
        </div>

        {/* 고쳐 쓰기·안 쓰기 상자 */}
        <div className="grid grid-cols-2 gap-1.5">
          {(['fix', 'drop'] as const).map((spot) => {
            const owned = songs.filter((song) => placed[song.id]?.spot === spot && placed[song.id]?.right);
            const need = songs.filter((song) => song.kind === spot).length;
            return (
              <button
                key={spot}
                type="button"
                data-drop={spot}
                onClick={() => held && put(held, spot)}
                disabled={!game.playing}
                aria-label={`${SPOT_NAME[spot]} 자리. ${owned.length}개 놓았습니다.`}
                className="flex min-h-[64px] flex-col items-center justify-center rounded-xl px-1.5 py-1"
                style={dropStyle(spot, need > 0 && owned.length >= need, spot === 'fix' ? '#FBBF24' : '#FB7185')}
              >
                <span className="text-[15px] font-black leading-tight">
                  {spot === 'fix' ? '🛠️ 고쳐서 써요' : '🗑️ 안 써요'}
                </span>
                <span className="text-[14px] font-bold" style={{ color: '#CBD5E1' }}>
                  {owned.length} / {need}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 끌고 다니는 동안 손끝을 따라오는 카드 */}
      {dragging && drag && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl px-2 py-1.5"
          style={{
            left: drag.x,
            top: drag.y,
            background: 'var(--board-overlay)',
            border: '3px solid #FBBF24',
            color: 'var(--board-ink)',
          }}
        >
          <span className="text-[15px] font-black leading-tight">🎵 {dragging.title}</span>
        </div>
      )}
    </MiniGameFrame>
  );
}
