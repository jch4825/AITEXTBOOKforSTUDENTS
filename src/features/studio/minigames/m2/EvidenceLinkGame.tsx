import React, { useEffect, useMemo, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import { GameHud, clamp, createRandom, shuffle, useCountdown } from '../engine';
import { playSound } from '../../../../utils/sound';
import type { MiniGameProps } from '../types';

/**
 * m2-l9 · 주장과 근거 잇기 (장르 43 · 사천성)
 *
 * "아이미에게 다시 묻지 말고 공지와 대조하라"를 패 잇기로 만든다. 주장 패는 혼자서는
 * 지워지지 않고, 같은 사실을 말하는 공지 근거 패와 이어져야 사라진다.
 *
 * 판에는 일부러 짝이 없는 주장을 남겨 둔다. 다 지우고 나면 그 패만 남아, 확인할 수
 * 없는 주장이 무엇인지 눈으로 보인다.
 */

const COLS = 6;
const ROWS = 5;

interface PairSpec {
  claim: string;
  proof: string;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  pairs: PairSpec[];
  lonely: string[];
  seconds: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'trip',
    label: '기본',
    spoken: '현장학습 공지와 아이미의 말을 맞춰 봐요.',
    seconds: 150,
    pairs: [
      { claim: '9시에 모여요', proof: '공지 · 모임 9시' },
      { claim: '체육관 앞이에요', proof: '공지 · 체육관 앞' },
      { claim: '물병을 챙겨요', proof: '공지 · 물병 필수' },
      { claim: '금요일이에요', proof: '공지 · 금요일' },
      { claim: '비 오면 미뤄요', proof: '공지 · 우천 연기' },
    ],
    lonely: ['간식이 나와요', '3시에 끝나요'],
  },
  {
    id: 'library',
    label: '1단계',
    spoken: '도서관 공지와 아이미의 말을 맞춰 봐요.',
    seconds: 135,
    pairs: [
      { claim: '2층에 있어요', proof: '공지 · 2층' },
      { claim: '두 권 빌려요', proof: '공지 · 2권까지' },
      { claim: '일주일 빌려요', proof: '공지 · 7일' },
      { claim: '월요일 쉬어요', proof: '공지 · 월요일 휴관' },
      { claim: '학생증이 필요해요', proof: '공지 · 학생증 지참' },
      { claim: '조용히 읽어요', proof: '공지 · 정숙' },
    ],
    lonely: ['간식을 먹어도 돼요', '밤 9시까지 열어요'],
  },
  {
    id: 'sports',
    label: '2단계',
    spoken: '운동회 공지와 아이미의 말을 맞춰 봐요.',
    seconds: 120,
    pairs: [
      { claim: '운동장에서 해요', proof: '공지 · 운동장' },
      { claim: '체육복을 입어요', proof: '공지 · 체육복' },
      { claim: '모자를 써요', proof: '공지 · 모자 착용' },
      { claim: '2교시에 시작해요', proof: '공지 · 2교시' },
      { claim: '가족도 와요', proof: '공지 · 가족 참관' },
      { claim: '점심은 급식이에요', proof: '공지 · 급식 제공' },
    ],
    lonely: ['상품을 줘요', '오후에도 계속해요'],
  },
];

interface Tile {
  id: number;
  text: string;
  /** 같은 값이면 짝. 짝 없는 주장은 -1 */
  pair: number;
  claim: boolean;
  cleared: boolean;
}

function buildBoard(stage: StageConfig, seed: number): (Tile | null)[][] {
  const tiles: Tile[] = [];
  let id = 0;
  stage.pairs.forEach((pair, index) => {
    tiles.push({ id: id++, text: pair.claim, pair: index, claim: true, cleared: false });
    tiles.push({ id: id++, text: pair.proof, pair: index, claim: false, cleared: false });
  });
  for (const text of stage.lonely) {
    tiles.push({ id: id++, text, pair: -1, claim: true, cleared: false });
  }

  const random = createRandom(seed);
  const slots = shuffle(random, Array.from({ length: COLS * ROWS }, (_, i) => i)).slice(0, tiles.length);
  const board: (Tile | null)[][] = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
  slots.forEach((slot, index) => {
    board[Math.floor(slot / COLS)][slot % COLS] = tiles[index];
  });
  return board;
}

/** 빈 칸(또는 판 바깥 한 칸)만 지나서 두 번 이하로 꺾여 이어지는가. */
function canLink(board: (Tile | null)[][], a: [number, number], b: [number, number]): boolean {
  const free = (r: number, c: number) => {
    if (r < -1 || r > ROWS || c < -1 || c > COLS) return false;
    if (r === -1 || r === ROWS || c === -1 || c === COLS) return true;
    return board[r][c] === null;
  };
  const target = `${b[0]}-${b[1]}`;
  const start: [number, number] = a;
  // [행, 열, 방향, 꺾은 횟수]
  const best = new Map<string, number>();
  const queue: [number, number, number, number][] = [];
  const DR = [-1, 0, 1, 0];
  const DC = [0, 1, 0, -1];
  for (let d = 0; d < 4; d += 1) {
    const nr = start[0] + DR[d];
    const nc = start[1] + DC[d];
    if (`${nr}-${nc}` === target) return true;
    if (free(nr, nc)) queue.push([nr, nc, d, 0]);
  }
  while (queue.length > 0) {
    const [r, c, dir, turns] = queue.shift() as [number, number, number, number];
    const key = `${r}-${c}-${dir}`;
    if ((best.get(key) ?? 9) <= turns) continue;
    best.set(key, turns);
    for (let d = 0; d < 4; d += 1) {
      const nextTurns = d === dir ? turns : turns + 1;
      if (nextTurns > 2) continue;
      const nr = r + DR[d];
      const nc = c + DC[d];
      if (`${nr}-${nc}` === target) return true;
      if (!free(nr, nc)) continue;
      queue.push([nr, nc, d, nextTurns]);
    }
  }
  return false;
}

export default function EvidenceLinkGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  const maxLives = tuning.lives;
  const seconds = Math.round(stage.seconds * tuning.time);

  const [board, setBoard] = useState<(Tile | null)[][]>(() => buildBoard(stage, game.seed));
  const [picked, setPicked] = useState<[number, number] | null>(null);
  const [lives, setLives] = useState(maxLives);
  const [cleared, setCleared] = useState(0);
  const [marked, setMarked] = useState<number[]>([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    setBoard(buildBoard(stage, game.seed));
    setPicked(null);
    setLives(maxLives);
    setCleared(0);
    setMarked([]);
    setNote('');
  }, [game.round, game.stageIndex, stage, game.seed, maxLives]);

  const timeLeft = useCountdown(game.playing, seconds, game.round * 100 + game.stageIndex, () => {
    game.fail('시간이 지났어요. 짝이 되는 공지 근거를 먼저 찾아 봐요.');
  });

  const lonelyIds = useMemo(
    () => board.flat().filter((tile): tile is Tile => !!tile && tile.pair === -1).map((tile) => tile.id),
    [board],
  );
  const allPairsCleared = cleared >= stage.pairs.length;

  const pick = (r: number, c: number) => {
    if (!game.playing) return;
    const tile = board[r][c];
    if (!tile) return;

    // 짝을 다 지운 뒤에는 남은 주장에 확인 도장을 찍는 단계다.
    if (allPairsCleared && tile.pair === -1) {
      if (marked.includes(tile.id)) return;
      playSound('stamp');
      const next = [...marked, tile.id];
      setMarked(next);
      setNote(`"${tile.text}"는 공지에 없어요. 어른에게 확인하기로 표시했습니다.`);
      if (next.length === lonelyIds.length) {
        game.succeed('공지와 맞는 말은 모두 잇고, 공지에 없는 말은 확인하기로 표시했어요.');
      }
      return;
    }

    if (!picked) {
      playSound('select');
      setPicked([r, c]);
      setNote('');
      return;
    }
    if (picked[0] === r && picked[1] === c) {
      setPicked(null);
      return;
    }

    const first = board[picked[0]][picked[1]];
    if (!first) {
      setPicked([r, c]);
      return;
    }

    if (first.pair === -1 || tile.pair === -1 || first.pair !== tile.pair || first.claim === tile.claim) {
      setPicked(null);
      const left = lives - 1;
      setLives(left);
      setNote('짝이 아니에요. 같은 사실을 말하는 공지 근거를 찾아 봐요.');
      if (left <= 0) game.fail('짝을 찾지 못했어요. 주장 옆에 같은 사실이 적힌 공지를 찾아 이어 봐요.');
      return;
    }

    if (!canLink(board, picked, [r, c])) {
      setPicked(null);
      setNote('지금은 길이 막혔어요. 다른 짝을 먼저 지워 길을 내 봐요.');
      return;
    }

    playSound('confirm');
    const next = board.map((row) => row.slice());
    next[picked[0]][picked[1]] = null;
    next[r][c] = null;
    setBoard(next);
    setPicked(null);
    setCleared((n) => n + 1);
    setNote(`"${first.claim ? first.text : tile.text}"를 공지로 확인했어요.`);
  };

  return (
    <MiniGameFrame
      badge="주장과 근거 잇기"
      instruction="아이미의 말과 같은 사실이 적힌 공지 쪽지를 눌러 이으세요. 두 번까지만 꺾이는 길로 이어집니다."
      progress={{ label: '확인한 말', value: cleared, max: stage.pairs.length }}
      hud={<GameHud lives={lives} maxLives={maxLives} timeLeft={timeLeft} timeTotal={seconds} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 놓기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {allPairsCleared && (
          <p
            className="rounded-xl px-3 py-1.5 text-[15px] font-black"
            style={{ background: 'var(--board-surface)', border: '2px solid #FBBF24', color: 'var(--board-ink)' }}
          >
            남은 말은 공지에 없어요. 눌러서 어른에게 확인하기로 표시하세요.
          </p>
        )}
        <div
          className="grid min-h-0 flex-1 gap-1 rounded-xl p-1.5"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
            background: 'var(--board-overlay)',
            border: '2px solid var(--board-line)',
          }}
        >
          {board.map((row, r) => row.map((tile, c) => {
            if (!tile) return <div key={`${r}-${c}`} />;
            const isPicked = picked?.[0] === r && picked?.[1] === c;
            const isMarked = marked.includes(tile.id);
            const claim = tile.claim;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => pick(r, c)}
                disabled={!game.playing || isMarked}
                className="min-h-0 rounded-lg px-1 py-0.5 text-[14px] font-black leading-tight transition"
                style={{
                  background: isMarked
                    ? '#78350F'
                    : isPicked ? '#0EA5E9' : claim ? 'var(--board-surface)' : '#3F3410',
                  color: isPicked ? '#0F172A' : 'var(--board-ink)',
                  border: `2px solid ${isMarked ? '#FBBF24' : isPicked ? '#38BDF8' : claim ? '#60A5FA' : '#D6A347'}`,
                }}
              >
                {isMarked ? '🔔 ' : ''}{tile.text}
              </button>
            );
          }))}
        </div>
        <p className="min-h-[22px] text-[15px] font-bold" style={{ color: 'var(--board-ink)' }}>
          {note || (picked ? '이을 쪽지를 하나 더 누르세요.' : '파란 쪽지는 아이미의 말, 노란 쪽지는 학교 공지입니다.')}
        </p>
      </div>
    </MiniGameFrame>
  );
}
