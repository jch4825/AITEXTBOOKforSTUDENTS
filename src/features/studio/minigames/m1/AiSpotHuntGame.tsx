import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  GameHud, GameStage, clamp, createRandom, randRange, shuffle,
  useCountdown, useGameKeys, useGameLoop,
} from '../engine';
import type { GameTuning } from '../engine';
import { playSound } from '../../../../utils/sound';
import { publicAssetUrl } from '../../../../utils/publicAssetUrl';
import type { MiniGameProps } from '../types';

/**
 * m1-l1 · 생활 속 AI 찾기 (장르 11 · 숨은 그림 찾기)
 *
 * 학습목표가 "AI의 뜻과 AI가 돕는 일을 내 말로 소개하기"이므로, 게임의 규칙도
 * "AI인지 아닌지를 물건 하나하나에 직접 대 보는 일"이 되어야 한다. 그래서 보기 넷 중
 * 하나를 고르게 하지 않고, 생활 장면에 물건을 흩어 놓고 학생이 눈으로 훑어 골라내게 했다.
 *
 * 판단 기준은 하나다 — 스스로 보고 듣고 알아보는가. 그냥 기계를 누르면 그 물건이 흔들리며
 * "누르면 그대로 도는 기계"라는 쪽지가 뜬다. 틀린 것도 설명이 붙는 한 번의 학습이 된다.
 * 찾아낸 물건에는 이름표와 "무엇을 도와주는지" 한 줄이 붙어, 마지막에 학생이 소개할
 * 문장 다섯 개가 판 위에 그대로 남는다.
 */

/**
 * 물건 그림. 이모지 대신 실제 그림을 쓰면 "우리 집에 있는 그것"으로 읽힌다.
 *
 * 스테이지마다 이름이 조금씩 달라서(얼굴 잠금·얼굴 사물함·얼굴 도어록) 이름이 아니라
 * 이모지를 열쇠로 삼는다. 이모지는 같은 물건이면 스테이지가 달라도 같게 적어 두었다.
 * 그림이 없는 물건은 이모지가 그대로 남는다.
 */
const ART: Record<string, string> = {
  '🎧': '/images/games/ai-music.jpg',
  '🎵': '/images/games/ai-music.jpg',
  '🔐': '/images/games/ai-facelock.jpg',
  '🔊': '/images/games/ai-speaker.jpg',
  '📷': '/images/games/ai-translate.jpg',
  '🤖': '/images/games/ai-vacuum.jpg',
  '🌀': '/images/games/plain-fan.jpg',
  '💡': '/images/games/plain-switch.jpg',
  '⏰': '/images/games/plain-clock.jpg',
  '🫖': '/images/games/plain-kettle.jpg',
  '🚪': '/images/games/plain-handle.jpg',
};

const AI_TARGET = 5;
const BASE_SECONDS = 62;
/** 판 가로 기준 물건 크기(%) — 크기를 제각각으로 만들어 눈으로 훑게 한다. */
const BASE_SIZE = 9.4;
/** 떠다니는 속도(%/초). 판을 가로지르는 데 40초가 넘게 걸릴 만큼 느리다. */
const BASE_DRIFT = 1.7;
const MIN_X = 13;
const MAX_X = 87;
const MIN_Y = 17;
const MAX_Y = 83;

interface Thing {
  name: string;
  emoji: string;
  /** AI인 물건만 쓰는 "무엇을 도와주는지" 한 줄 */
  help: string;
}

interface Decor {
  x: number; y: number; w: number; h: number;
  fill: string; edge: string; radius: number;
}

interface StageConfig {
  id: string;
  label: string;
  scene: string;
  sceneEmoji: string;
  ai: Thing[];
  /** 그냥 기계 후보. 실제로 몇 개를 꺼낼지는 tuning.density가 정한다. */
  plain: Thing[];
  plainCount: number;
  decor: Decor[];
}

const WALL = { fill: 'rgba(30, 41, 59, 0.9)', edge: 'rgba(100, 116, 139, 0.45)' };
const FLOOR = { fill: 'rgba(56, 189, 248, 0.1)', edge: 'rgba(100, 116, 139, 0.4)' };
const WARM = { fill: 'rgba(251, 191, 36, 0.12)', edge: 'rgba(100, 116, 139, 0.45)' };

const STAGES: StageConfig[] = [
  {
    id: 'home',
    label: '기본',
    scene: '우리 집',
    sceneEmoji: '🏠',
    ai: [
      { name: '음악 앱', emoji: '🎧', help: '내가 좋아할 다음 노래를 골라 줘요.' },
      { name: '얼굴 잠금', emoji: '🔐', help: '얼굴을 알아보고 문을 열어 줘요.' },
      { name: '말하는 스피커', emoji: '🔊', help: '말을 알아듣고 불을 켜 줘요.' },
      { name: '번역 앱', emoji: '📷', help: '사진 속 글자를 읽어서 알려 줘요.' },
      { name: '청소 로봇', emoji: '🤖', help: '스스로 길을 찾아 청소해 줘요.' },
    ],
    plain: [
      { name: '선풍기', emoji: '🌀', help: '' },
      { name: '전등', emoji: '💡', help: '' },
      { name: '태엽 시계', emoji: '⏰', help: '' },
      { name: '주전자', emoji: '🫖', help: '' },
      { name: '문손잡이', emoji: '🚪', help: '' },
      { name: '토스터', emoji: '🍞', help: '' },
      { name: '손전등', emoji: '🔦', help: '' },
      { name: '거울', emoji: '🪞', help: '' },
    ],
    plainCount: 7,
    decor: [
      { x: 0, y: 76, w: 100, h: 24, ...FLOOR, radius: 0 },
      { x: 6, y: 8, w: 22, h: 30, ...WALL, radius: 8 },
      { x: 66, y: 56, w: 28, h: 14, ...WARM, radius: 10 },
      { x: 34, y: 80, w: 32, h: 14, ...WARM, radius: 12 },
    ],
  },
  {
    id: 'classroom',
    label: '1단계',
    scene: '교실',
    sceneEmoji: '🏫',
    ai: [
      { name: '음악 앱', emoji: '🎵', help: '다음에 들을 노래를 골라 줘요.' },
      { name: '얼굴 사물함', emoji: '🔐', help: '얼굴을 알아보고 사물함을 열어 줘요.' },
      { name: '말 듣는 스피커', emoji: '🔊', help: '말을 알아듣고 물음에 답해 줘요.' },
      { name: '번역 앱', emoji: '📷', help: '사진 속 글자를 읽어서 옮겨 줘요.' },
      { name: '청소 로봇', emoji: '🤖', help: '스스로 길을 찾아 교실을 치워 줘요.' },
    ],
    plain: [
      { name: '선풍기', emoji: '🌀', help: '' },
      { name: '전등', emoji: '💡', help: '' },
      { name: '태엽 시계', emoji: '⏰', help: '' },
      { name: '주전자', emoji: '🫖', help: '' },
      { name: '문손잡이', emoji: '🚪', help: '' },
      { name: '연필깎이', emoji: '✏️', help: '' },
      { name: '계산기', emoji: '🧮', help: '' },
      { name: '수업 종', emoji: '🔔', help: '' },
      { name: '온풍기', emoji: '♨️', help: '' },
      { name: '자', emoji: '📏', help: '' },
    ],
    plainCount: 9,
    decor: [
      { x: 0, y: 74, w: 100, h: 26, ...FLOOR, radius: 0 },
      { x: 6, y: 7, w: 42, h: 26, ...WALL, radius: 8 },
      { x: 84, y: 8, w: 12, h: 34, ...WALL, radius: 8 },
      { x: 14, y: 78, w: 70, h: 16, ...WARM, radius: 10 },
    ],
  },
  {
    id: 'street',
    label: '2단계',
    scene: '길거리',
    sceneEmoji: '🛣️',
    ai: [
      { name: '음악 앱', emoji: '🎧', help: '걷는 동안 들을 노래를 골라 줘요.' },
      { name: '얼굴 도어록', emoji: '🔐', help: '얼굴을 알아보고 현관을 열어 줘요.' },
      { name: '말 듣는 안내기', emoji: '🗣️', help: '말을 알아듣고 가는 길을 알려 줘요.' },
      { name: '번역 앱', emoji: '📷', help: '간판 글자를 읽어서 우리말로 바꿔 줘요.' },
      { name: '배달 로봇', emoji: '🤖', help: '스스로 길을 찾아 짐을 옮겨 줘요.' },
    ],
    plain: [
      { name: '신호등', emoji: '🚦', help: '' },
      { name: '자판기', emoji: '🥤', help: '' },
      { name: '자전거', emoji: '🚲', help: '' },
      { name: '저울', emoji: '⚖️', help: '' },
      { name: '초인종', emoji: '🔔', help: '' },
      { name: '가로등', emoji: '💡', help: '' },
      { name: '태엽 시계', emoji: '⏰', help: '' },
      { name: '손잡이 문', emoji: '🚪', help: '' },
      { name: '손수레', emoji: '🛒', help: '' },
      { name: '주유기', emoji: '⛽', help: '' },
      { name: '선풍기', emoji: '🌀', help: '' },
      { name: '우체통', emoji: '📮', help: '' },
    ],
    plainCount: 11,
    decor: [
      { x: 0, y: 66, w: 100, h: 34, ...FLOOR, radius: 0 },
      { x: 4, y: 5, w: 24, h: 40, ...WALL, radius: 8 },
      { x: 66, y: 4, w: 30, h: 44, ...WALL, radius: 8 },
      { x: 30, y: 86, w: 40, h: 8, ...WARM, radius: 6 },
    ],
  },
];

interface SpotItem extends Thing {
  id: string;
  ai: boolean;
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  found: boolean;
  /** 그냥 기계를 눌렀을 때의 흔들림 남은 시간 */
  shake: number;
  /** 찾은 순간 커졌다가 가라앉는 시간 */
  pop: number;
}

/**
 * 판 배치를 만든다.
 *
 * 자리는 씨앗 난수로 흩고, 이미 놓인 물건과 겹치지 않을 자리를 찾다가 자리가 없으면
 * 조건을 조금씩 낮춘다. 물건이 많은 3단계에서도 배치가 실패하지 않게 하려는 것이다.
 */
function buildItems(stage: StageConfig, tuning: GameTuning, seed: number): SpotItem[] {
  const random = createRandom(seed);
  const plainCount = clamp(Math.round(stage.plainCount * tuning.density), 4, stage.plain.length);
  const pool: Array<Thing & { ai: boolean; id: string }> = [
    ...stage.ai.map((thing, index) => ({ ...thing, ai: true, id: `ai-${index}` })),
    ...shuffle(random, stage.plain)
      .slice(0, plainCount)
      .map((thing, index) => ({ ...thing, ai: false, id: `plain-${index}` })),
  ];

  const placed: SpotItem[] = [];
  for (const thing of shuffle(random, pool)) {
    const size = clamp(BASE_SIZE * randRange(random, 0.76, 1.3) * tuning.size, 6.4, 17);
    let x = 50;
    let y = 50;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      x = randRange(random, MIN_X, MAX_X);
      y = randRange(random, MIN_Y, MAX_Y);
      // 세로는 판이 짧아 같은 1%라도 더 가깝게 보인다. 그래서 세로 거리를 줄여서 잰다.
      const need = 16 - attempt * 0.22;
      if (placed.every((other) => Math.hypot(other.x - x, (other.y - y) * 0.62) > need)) break;
    }
    const angle = randRange(random, 0, Math.PI * 2);
    const speed = BASE_DRIFT * randRange(random, 0.55, 1.35) * tuning.speed;
    placed.push({
      ...thing,
      x, y, size,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.72,
      found: false, shake: 0, pop: 0,
    });
  }
  return placed;
}

export default function AiSpotHuntGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;
  const timeTotal = Math.round(BASE_SECONDS * tuning.time);

  const itemsRef = useRef<SpotItem[]>(buildItems(stage, tuning, game.seed));
  const cursorRef = useRef({ x: 50, y: 50, visible: false });
  const paintRef = useRef(0);
  const livesRef = useRef(tuning.lives);
  const finishedRef = useRef(false);

  const [, setTick] = useState(0);
  const [phase, setPhase] = useState<'ready' | 'hunt'>('ready');
  const [lives, setLives] = useState(tuning.lives);
  const [foundCount, setFoundCount] = useState(0);
  const [note, setNote] = useState<{ text: string; tone: 'info' | 'good' | 'warn' }>({
    text: 'AI는 스스로 보고 듣고 알아보는 기계예요.',
    tone: 'info',
  });

  const keys = useGameKeys(game.playing);

  useEffect(() => {
    itemsRef.current = buildItems(stage, tuning, game.seed);
    cursorRef.current = { x: 50, y: 50, visible: false };
    livesRef.current = tuning.lives;
    finishedRef.current = false;
    setPhase('ready');
    setLives(tuning.lives);
    setFoundCount(0);
    setNote({ text: 'AI는 스스로 보고 듣고 알아보는 기계예요.', tone: 'info' });
  }, [game.round, game.stageIndex, stage, tuning, game.seed]);

  const timeLeft = useCountdown(
    game.playing && phase === 'hunt',
    timeTotal,
    game.round * 8 + game.stageIndex,
    () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      game.fail('시간이 다 됐어요. 스스로 보고 듣고 알아보는 물건부터 찾아보세요.');
    },
  );

  /** 물건 하나를 누른다. 마우스 클릭과 돋보기 조작이 모두 여기로 모인다. */
  const press = (id: string) => {
    if (finishedRef.current || !game.playing) return;
    const item = itemsRef.current.find((candidate) => candidate.id === id);
    if (!item || item.found) return;

    if (item.ai) {
      item.found = true;
      item.vx = 0;
      item.vy = 0;
      item.pop = 0.5;
      playSound('confirm');
      const next = itemsRef.current.filter((candidate) => candidate.ai && candidate.found).length;
      setFoundCount(next);
      setNote({ text: `${item.name} — ${item.help}`, tone: 'good' });
      if (next >= AI_TARGET) {
        finishedRef.current = true;
        game.succeed('AI가 든 물건 다섯 개를 모두 찾았어요. AI는 스스로 알아보고 도와주는 기계예요.');
      }
      return;
    }

    item.shake = 0.7;
    playSound('select');
    setNote({
      text: `${item.name} — 이건 누르면 그대로 도는 기계예요. 스스로 알아보지는 않아요.`,
      tone: 'warn',
    });
    const left = livesRef.current - 1;
    livesRef.current = left;
    setLives(Math.max(0, left));
    if (left <= 0) {
      finishedRef.current = true;
      game.fail('기회를 다 썼어요. 스스로 보고 듣고 골라 주는 물건인지 먼저 살펴보세요.');
    }
  };

  /** 돋보기 자리에서 가장 가까운 물건을 누른다. 허용 거리는 지원 수준을 따른다. */
  const pressNearCursor = () => {
    const cursor = cursorRef.current;
    let best: SpotItem | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const item of itemsRef.current) {
      if (item.found) continue;
      const distance = Math.hypot(item.x - cursor.x, (item.y - cursor.y) * 0.62);
      const reach = (item.size / 2 + 3.5) * tuning.tolerance;
      if (distance <= reach && distance < bestDistance) {
        best = item;
        bestDistance = distance;
      }
    }
    if (best) press(best.id);
  };

  useGameLoop(game.playing, (dt) => {
    // 준비 상태에서는 아무것도 움직이지 않는다. 화면을 다 훑어본 뒤 학생이 직접 시작한다.
    if (phase === 'ready') {
      if (keys.consumePress('action')) setPhase('hunt');
      return;
    }

    const held = keys.held.current;
    const cursor = cursorRef.current;
    const move = 34 * dt;
    if (held.left || held.right || held.up || held.down) {
      cursor.visible = true;
      if (held.left) cursor.x -= move;
      if (held.right) cursor.x += move;
      if (held.up) cursor.y -= move * 1.6;
      if (held.down) cursor.y += move * 1.6;
      cursor.x = clamp(cursor.x, 4, 96);
      cursor.y = clamp(cursor.y, 6, 94);
    }
    if (keys.consumePress('action')) pressNearCursor();

    for (const item of itemsRef.current) {
      if (item.shake > 0) item.shake = Math.max(0, item.shake - dt);
      if (item.pop > 0) item.pop = Math.max(0, item.pop - dt);
      if (item.found) continue;
      item.x += item.vx * dt;
      item.y += item.vy * dt;
      if (item.x < MIN_X) { item.x = MIN_X; item.vx = Math.abs(item.vx); }
      if (item.x > MAX_X) { item.x = MAX_X; item.vx = -Math.abs(item.vx); }
      if (item.y < MIN_Y) { item.y = MIN_Y; item.vy = Math.abs(item.vy); }
      if (item.y > MAX_Y) { item.y = MAX_Y; item.vy = -Math.abs(item.vy); }
    }

    // 자리 갱신은 매 프레임 다시 그릴 필요가 없다. 20fps로 낮춰 판이 무거워지지 않게 한다.
    paintRef.current += dt;
    if (paintRef.current >= 0.05) {
      paintRef.current = 0;
      setTick((value) => value + 1);
    }
  });

  const items = itemsRef.current;
  const cursor = cursorRef.current;
  /* 설명 띠가 보드 밖 종이 면으로 내려왔다. 보드용 형광 톤을 종이에 얹으면 글자 대비가
     무너지므로 프레임의 성공·실패 배너와 같은 시맨틱 피드백 색을 쓴다. */
  const noteSkin = note.tone === 'good'
    ? { edge: 'var(--ok)', fill: 'var(--ok-bg)', ink: '#14532D' }
    : note.tone === 'warn'
      ? { edge: 'var(--warn)', fill: 'var(--warn-bg)', ink: '#7C2D12' }
      : { edge: 'var(--line)', fill: 'var(--paper-0)', ink: 'var(--ink-1)' };

  return (
    <MiniGameFrame
      badge="생활 속 AI 찾기"
      instruction="그림 속에서 스스로 보고 듣고 알아보는 인공지능 물건을 찾아 눌러 보세요. 돋보기를 움직여 5개를 모두 찾아봅시다."
      progress={{ label: '찾은 AI', value: foundCount, max: AI_TARGET }}
      hud={(
        <GameHud
          lives={lives}
          maxLives={tuning.lives}
          timeLeft={timeLeft}
          timeTotal={timeTotal}
        />
      )}
      stages={STAGES.slice(0, game.visibleStageCount).map((item) => ({ id: item.id, label: item.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, `${STAGES[index].scene} 장면으로 옮겼어요.`)}
      status={game.status}
      message={game.message}
      /* 읽을 글은 이 띠 한 곳에만 둔다. 물건마다 긴 글이 붙으면 판을 가려서 읽을 수 없다. */
      footer={(
        <div
          className="flex items-center gap-2 rounded-xl px-2.5 py-2"
          style={{ background: noteSkin.fill, border: `2px solid ${noteSkin.edge}` }}
        >
          <span aria-hidden="true" className="text-[22px]">{stage.sceneEmoji}</span>
          <span role="status" className="text-[15px] font-black leading-snug" style={{ color: noteSkin.ink }}>
            {note.text}
          </span>
          <span className="ml-auto shrink-0 text-[15px] font-black" style={{ color: noteSkin.ink }}>
            {stage.scene}
          </span>
        </div>
      )}
      actions={<MiniGameButton onClick={game.retry} emoji="🔄" label="다시 찾기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <GameStage ariaLabel={`${stage.scene} 장면에서 AI가 든 물건을 찾는 놀이. 찾은 물건 ${foundCount}개, 남은 기회 ${lives}개.`}>
          {/* 장면 얼개 — 눌리는 것이 아니므로 조작을 받지 않는다 */}
          {stage.decor.map((piece, index) => (
            <div
              key={`decor-${index}`}
              aria-hidden="true"
              className="pointer-events-none absolute"
              style={{
                left: `${piece.x}%`, top: `${piece.y}%`,
                width: `${piece.w}%`, height: `${piece.h}%`,
                background: piece.fill,
                border: `2px solid ${piece.edge}`,
                borderRadius: `${piece.radius}px`,
              }}
            />
          ))}

          {items.map((item) => {
            const wobble = item.shake > 0 ? Math.sin(item.shake * 46) * 7 : 0;
            const scale = item.found ? 1.22 + item.pop * 0.3 : 1;
            const edge = item.found ? '#34D399' : item.shake > 0 ? '#FB7185' : 'var(--board-line)';
            return (
              <div
                key={item.id}
                className="absolute"
                style={{
                  left: `${item.x}%`, top: `${item.y}%`, width: `${item.size}%`,
                  transform: `translate(-50%, -50%) rotate(${wobble}deg) scale(${scale})`,
                  zIndex: item.found ? 6 : 3,
                }}
              >
                <button
                  type="button"
                  onClick={() => (phase === 'ready' ? setPhase('hunt') : press(item.id))}
                  disabled={!game.playing || item.found}
                  aria-label={item.found ? `${item.name}. ${item.help}` : `${item.name} 누르기`}
                  className="grid aspect-square w-full place-items-center rounded-full leading-none disabled:cursor-default"
                  style={{
                    /* 그림과 이모지가 한 가족으로 보이게 모두 흰 종이 위에 얹는다.
                       받은 그림이 흰 바탕이라, 면을 흰색으로 맞추면 네모난 바탕이 사라진다. */
                    background: item.found ? 'rgba(52, 211, 153, 0.28)' : '#FFFFFF',
                    border: `2px solid ${edge}`,
                    color: '#0F172A',
                    fontSize: `${Math.round(clamp(item.size * 2.6, 18, 42))}px`,
                  }}
                >
                  {ART[item.emoji] ? (
                    /* 그림은 흰 바탕 위에 그려져 있다. 흰 동그란 종이 위에 얹으면
                       네모난 바탕이 보이지 않고 스티커처럼 읽힌다. */
                    <img
                      src={publicAssetUrl(ART[item.emoji])}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="h-full w-full rounded-full object-contain"
                      style={{ background: '#FFFFFF' }}
                    />
                  ) : (
                    <span aria-hidden="true">{item.emoji}</span>
                  )}
                </button>
                {/*
                  이름표는 찾았든 아니든 같은 크기다. 찾은 것만 크게 만들었더니 옆 물건을
                  덮어 다음에 무엇을 고를지 볼 수 없었다. 무엇을 찾았는지는 색으로 알리고,
                  설명은 판 밖 아래 띠에서 읽는다.
                  못 찾은 물건의 이름표는 충분한 지원·중학에서만 붙인다. 고등은 그림만 보고 고른다.
                */}
                {(item.found || game.hintAllowed) && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-full mt-0.5 block -translate-x-1/2 whitespace-nowrap rounded px-1 text-[14px] leading-tight"
                    style={{
                      background: item.found ? 'rgba(52, 211, 153, 0.32)' : 'var(--board-overlay)',
                      color: 'var(--board-ink)',
                      fontWeight: item.found ? 900 : 700,
                    }}
                  >
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}

          {/* 키보드용 돋보기. 방향키를 쓰기 시작할 때만 나타나 화면을 어지럽히지 않는다. */}
          {cursor.visible && phase === 'hunt' && game.playing && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute grid place-items-center rounded-full text-[20px]"
              style={{
                left: `${cursor.x}%`, top: `${cursor.y}%`,
                width: '13%', aspectRatio: '1 / 1',
                transform: 'translate(-50%, -50%)',
                border: '3px solid #FBBF24',
                zIndex: 8,
              }}
            >
              🔍
            </div>
          )}

          {/* 준비 상태 — 첫 조작 전까지 물건이 움직이지 않고 시간도 흐르지 않는다. */}
          {phase === 'ready' && game.playing && (
            <div className="absolute inset-x-0 top-1/2 grid -translate-y-1/2 place-items-center" style={{ zIndex: 9 }}>
              <button
                type="button"
                onClick={() => setPhase('hunt')}
                className="rounded-xl px-4 py-3 text-[16px] font-black"
                style={{ background: 'var(--board-overlay)', border: '2px solid #FBBF24', color: 'var(--board-ink)' }}
              >
                🔍 누르면 찾기를 시작합니다
              </button>
            </div>
          )}
        </GameStage>
      </div>
    </MiniGameFrame>
  );
}
