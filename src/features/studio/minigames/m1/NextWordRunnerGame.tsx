import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../../components/Icon';
import { useSpeak } from '../../../../hooks/useSpeak';
import { BAUHAUS, BauhausMark, CANVAS_FONT, STROKE, drawBar, drawShape } from '../engine';
import { GAME_STAGES, type StageConfig } from './nextWordStages';
import {
  BALLOON_FACES,
  STRING_LENGTH,
  SWAY_X,
  SWAY_Y,
  commonScale,
  heroX,
  inkOnFace,
  labelRows,
  layoutBalloons,
  type MeasureText,
} from './nextWordBalloons';

/**
 * 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다.
 *
 * 이 게임만은 공통 프레임(MiniGameFrame)을 쓰지 않고 제 프레임을 지닌다(사용자 결정).
 * 그래도 어휘는 같은 것을 쓴다 — 색·모서리·마크가 다른 61개와 같아야 학생이 여기서
 * 배운 신호를 저기서도 그대로 읽는다.
 */
const B = BAUHAUS.board;

interface Balloon {
  id: string;
  word: string;
  probability: number; // 0 to 100
  /** 그려지는 중심. 들어오는 거리와 흔들림이 얹힌 값이라 누르기 판정도 이 값을 쓴다. */
  x: number;
  y: number;
  /** 자리 잡은 중심 */
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  borderColor: string;
  /** 면 색 위에서 읽히는 글자 색 */
  ink: string;
  /** 낱말을 줄바꿈한 결과와 글자 크기. 풍선 안에 다 들어오게 정해진 값이다. */
  lines: string[];
  wordFont: number;
  pctFont: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number;
  maxLife: number;
}

/* 세 단계의 모든 풍선 묶음. 판 크기마다 이 전체가 담기는 배율을 정해 모든 단계가 같이 쓴다. */
const ALL_BALLOON_GROUPS = GAME_STAGES.flatMap((s) => s.steps.map((step) => step.balloons));

/* 글자 너비를 재는 캔버스. 그림 그리는 캔버스와 따로 둬서 재는 일이 판 그림에 끼어들지 않는다. */
let measureContext: CanvasRenderingContext2D | null = null;
const widthCache = new Map<string, number>();

const measureText: MeasureText = (text, fontPx) => {
  const key = `${fontPx}|${text}`;
  const cached = widthCache.get(key);
  if (cached !== undefined) return cached;
  measureContext ??= document.createElement('canvas').getContext('2d');
  /* 잴 수 없으면 한 글자를 1em으로 잡는다. 실제보다 넓어서 풍선이 커질 뿐 글자가 넘치지는 않는다. */
  let width = text.length * fontPx;
  if (measureContext) {
    measureContext.font = `800 ${fontPx}px ${CANVAS_FONT}`;
    width = measureContext.measureText(text).width;
  }
  widthCache.set(key, width);
  return width;
};

export default function NextWordRunnerGame() {
  const { speakNow } = useSpeak();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  /* 판의 실제 크기(CSS 픽셀)와 화소비. 캔버스를 이 크기로 그려서 잘리거나 늘어나지 않는다. */
  const sizeRef = useRef({ width: 540, height: 270, dpr: 1 });

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [builtSentence, setBuiltSentence] = useState(GAME_STAGES[0].initialPrompt);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed' | 'fact_check'>('idle');
  const [showHint, setShowHint] = useState(false);

  // Animation state in refs to prevent 60fps React re-renders
  const balloonsRef = useRef<Balloon[]>([]);
  /* 풍선 무리가 오른쪽 판 밖에서 자리까지 들어오는 동안 남은 거리. 풍선마다 따로 다가가면
     속도가 달라 들어오는 도중 서로 겹치므로, 무리 전체가 이 값 하나로 같이 움직인다. */
  const enterRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const gameStateRef = useRef(gameState);
  const currentStepRef = useRef(currentStepIdx);
  const currentStageRef = useRef(currentStageIdx);
  const builtSentenceRef = useRef(builtSentence);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { currentStepRef.current = currentStepIdx; }, [currentStepIdx]);
  useEffect(() => { currentStageRef.current = currentStageIdx; }, [currentStageIdx]);
  useEffect(() => { builtSentenceRef.current = builtSentence; }, [builtSentence]);

  const stage = GAME_STAGES[currentStageIdx];

  const playPopSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio fallback
    }
  };

  /* 풍선의 자리·반지름·글자를 지금 판 크기에 맞춘다. 글자가 풍선 안에 다 들어오고 풍선끼리
     겹치지 않는 자리는 nextWordBalloons가 정한다. */
  const arrangeBalloons = () => {
    const balloons = balloonsRef.current;
    if (balloons.length === 0) return;
    const { width, height } = sizeRef.current;
    const board = { width, height };
    const layout = layoutBalloons(
      balloons.map((b) => ({ word: b.word, probability: b.probability })),
      board,
      measureText,
      commonScale(ALL_BALLOON_GROUPS, board, measureText),
    );
    balloons.forEach((b, idx) => {
      const spot = layout.placements[idx];
      b.radius = spot.radius;
      b.lines = spot.lines;
      b.wordFont = spot.wordFont;
      b.pctFont = spot.pctFont;
      b.targetX = spot.x;
      b.targetY = spot.y;
    });
  };

  const spawnBalloons = (s: StageConfig, stepIdx: number) => {
    if (stepIdx >= s.steps.length) return;
    const stepConfig = s.steps[stepIdx];

    balloonsRef.current = stepConfig.balloons.map((b, idx) => {
      const color = BALLOON_FACES[idx % BALLOON_FACES.length];
      return {
        id: `${stepIdx}-${idx}-${Date.now()}`,
        word: b.word,
        probability: b.probability,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        radius: 0,
        color,
        borderColor: B.keyline,
        ink: inkOnFace(color),
        lines: [b.word],
        wordFont: 16,
        pctFont: 14,
      };
    });
    arrangeBalloons();

    // 가장 왼쪽 풍선까지 판 밖에 있도록 멀리서 시작해 오른쪽에서 들어온다.
    const balloons = balloonsRef.current;
    enterRef.current = sizeRef.current.width - Math.min(...balloons.map((b) => b.targetX - b.radius)) + 12;
    balloons.forEach((b) => {
      b.x = b.targetX + enterRef.current;
      b.y = b.targetY;
    });
  };

  const startStage = (stageIndex: number) => {
    const s = GAME_STAGES[stageIndex];
    setCurrentStageIdx(stageIndex);
    setCurrentStepIdx(0);
    setBuiltSentence(s.initialPrompt);
    setGameState('playing');
    setShowHint(false);
    particlesRef.current = [];
    spawnBalloons(s, 0);
  };

  const popBalloon = (b: Balloon) => {
    if (gameStateRef.current !== 'playing') return;

    playPopSound();
    speakNow(b.word);

    // Spawn 20 particle sparks
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = 2.5 + Math.random() * 4;
      particlesRef.current.push({
        x: b.x,
        y: b.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: b.color,
        radius: 3.5 + Math.random() * 3.5,
        life: 0,
        maxLife: 22 + Math.random() * 8,
      });
    }

    const newSentence = `${builtSentenceRef.current} ${b.word}`;
    setBuiltSentence(newSentence);

    const nextStep = currentStepRef.current + 1;
    const currentStage = GAME_STAGES[currentStageRef.current];

    if (nextStep < currentStage.steps.length) {
      setCurrentStepIdx(nextStep);
      spawnBalloons(currentStage, nextStep);
    } else {
      balloonsRef.current = [];
      setGameState('completed');
    }
  };

  /* 캔버스를 판의 실제 크기로 맞춘다. 고정 크기(540×270) 그림을 `object-cover`로 덮어 두면
     판이 좁은 화면(1024px에서 판이 323px)에서 그림의 양옆이 잘려 나가 풍선이 반쯤 가려졌다.
     크기가 바뀌면 풍선도 새 판에 다시 놓는다. */
  useEffect(() => {
    const board = boardRef.current;
    const canvas = canvasRef.current;
    if (!board || !canvas) return;

    const fit = () => {
      const width = Math.max(1, Math.round(board.clientWidth));
      const height = Math.max(1, Math.round(board.clientHeight));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      sizeRef.current = { width, height, dpr };
      /* 놀이 중에 판이 줄거나 늘면(대체 단추가 두 줄이 되는 때) 들어오는 풍선을 멈춰 세우지 않고
         새 자리로 이어서 가게 한다. */
      arrangeBalloons();
    };
    fit();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit);
    observer?.observe(board);

    /* 글꼴이 늦게 들어오면 글자 너비가 달라진다. 다시 재서 놓는다. */
    const remeasure = () => {
      widthCache.clear();
      arrangeBalloons();
    };
    document.fonts?.addEventListener('loadingdone', remeasure);

    return () => {
      observer?.disconnect();
      document.fonts?.removeEventListener('loadingdone', remeasure);
    };
  }, []);

  // Smooth Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.03;
      const { width, height, dpr } = sizeRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 1. 판 바탕
      ctx.fillStyle = B.ground;
      ctx.fillRect(0, 0, width, height);

      // 2. 흘러가는 격자 — 낱말이 다가온다는 것을 배경의 움직임으로 알린다.
      ctx.strokeStyle = B.surface;
      ctx.lineWidth = 1.5;
      const gridOffset = (time * 30) % 40;
      for (let x = -gridOffset; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // 바닥선 — 풍선과 줄 아래, 판 맨 아래에 둔다.
      ctx.strokeStyle = B.blue;
      ctx.lineWidth = STROKE.hair;
      ctx.beginPath();
      ctx.moveTo(0, height - 6);
      ctx.lineTo(width, height - 6);
      ctx.stroke();

      // 3. Draw Aimi Robot Hero (Hovering at the left)
      const aimiX = heroX(width);
      const aimiY = height / 2 - 5 + Math.sin(time * 2) * 6;

      ctx.save();
      ctx.translate(aimiX, aimiY);

      /* 아이미 — 동그란 몸, 네모난 얼굴 화면, 곧은 더듬이와 노란 알.
         빛무리도 분사 고리도 두지 않는다. 바우하우스에서 형태는 형태로만 말한다. */
      drawShape(ctx, 'circle', 0, 0, 48, { fill: B.ink, stroke: B.blue, width: STROKE.hair });
      drawBar(ctx, -15, -9, 30, 18, { fill: B.ground });

      // 눈 — 깜박일 때만 납작해진다.
      const eyeH = Math.sin(time * 3) > 0.96 ? 2 : 9;
      ctx.fillStyle = B.blue;
      ctx.fillRect(-9, -eyeH / 2, 6, eyeH);
      ctx.fillRect(3, -eyeH / 2, 6, eyeH);

      // 더듬이
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(0, -33);
      ctx.strokeStyle = B.grey;
      ctx.lineWidth = STROKE.hair;
      ctx.stroke();
      drawShape(ctx, 'circle', 0, -36, 9, { fill: B.yellow, stroke: B.keyline, width: 1.5 });

      ctx.restore();

      // 4. Update and Draw Particles
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        /* 터진 조각은 네모다. 풍선이 원이라 조각이 네모여야 "깨졌다"가 형태로 읽힌다. */
        ctx.globalAlpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
        ctx.globalAlpha = 1.0;
      });

      // 5. Update and Draw Word Balloons
      if (gameStateRef.current === 'playing') {
        /* 무리가 오른쪽 판 밖에서 자리까지 들어온다. 멀수록 빠르고, 가까워지면 느려진다.
           자리를 잡은 뒤에는 떠 있는 것처럼 살짝 흔들릴 뿐 어디로도 흘러가지 않는다 —
           흘러가다 되돌아가면 글자가 판 가장자리에 걸려 반쯤 가려지는 때가 생긴다. */
        const entering = enterRef.current;
        if (entering > 0) {
          enterRef.current = Math.max(0, entering - Math.min(4.5, Math.max(0.8, entering * 0.06)));
        }
        balloonsRef.current.forEach((b, idx) => {
          b.x = b.targetX + enterRef.current + Math.sin(time * 0.9 + idx * 2.1) * SWAY_X;
          b.y = b.targetY + Math.sin(time * 2 + idx) * SWAY_Y;
        });
      }

      // 풍선 줄 — 곧은 선 하나. 줄은 모두 먼저 그려서 이웃 풍선 위로 올라오지 않게 한다.
      balloonsRef.current.forEach((b) => {
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.radius);
        ctx.lineTo(b.x, b.y + b.radius + STRING_LENGTH);
        ctx.strokeStyle = B.grey;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      balloonsRef.current.forEach((b) => {
        drawShape(ctx, 'circle', b.x, b.y, b.radius * 2,
          { fill: b.color, stroke: b.borderColor, width: STROKE.hair });

        /* 글자는 면 색에 맞는 색으로, 풍선 안에 맞춰 둔 크기와 줄바꿈 그대로 그린다. */
        ctx.fillStyle = b.ink;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const row of labelRows(`${b.probability}%`, b.lines, b.wordFont, b.pctFont)) {
          ctx.font = `800 ${row.font}px ${CANVAS_FONT}`;
          ctx.fillText(row.text, b.x, b.y + row.y);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Handle Canvas Click to Pop Balloon
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const { width, height } = sizeRef.current;
    const clickX = (e.clientX - rect.left) * (width / rect.width);
    const clickY = (e.clientY - rect.top) * (height / rect.height);

    // Generous hit test radius for easy student clicking. 겹쳐 닿으면 눌린 곳에 더 가까운 풍선이다.
    let clickedBalloon: Balloon | null = null;
    let nearest = Infinity;
    for (const b of balloonsRef.current) {
      const outside = Math.hypot(clickX - b.x, clickY - b.y) - b.radius;
      if (outside <= 16 && outside < nearest) {
        nearest = outside;
        clickedBalloon = b;
      }
    }

    if (clickedBalloon) {
      popBalloon(clickedBalloon);
    }
  };

  // 캔버스를 조작하기 어려운 학생을 위한 탭·스위치·키보드 대체 경로.
  const chooseWordByButton = (word: string) => {
    if (gameState !== 'playing') return;
    const balloon = balloonsRef.current.find((item) => item.word === word);
    if (balloon) popBalloon(balloon);
  };

  /* 프레임은 종이, 판은 어두운 면. 다른 61개와 같은 두 겹 구조를 여기서도 지킨다. */
  const paper: React.CSSProperties = {
    background: 'var(--game-paper)',
    border: 'var(--game-line) solid var(--game-ink)',
    color: 'var(--game-ink)',
  };
  const boardPanel: React.CSSProperties = {
    background: 'var(--game-board)',
    border: 'var(--game-line) solid var(--game-board-grey)',
    color: 'var(--game-board-ink)',
  };
  const overlay: React.CSSProperties = {
    background: 'var(--game-board)',
    color: 'var(--game-board-ink)',
  };

  return (
    <div
      className="relative flex h-full flex-col justify-between gap-2 overflow-hidden p-4 md:p-5"
      style={{
        background: 'var(--game-paper)',
        border: 'var(--game-heavy) solid var(--game-ink)',
        color: 'var(--game-ink)',
      }}
    >
      {/* 머리글 */}
      <div
        className="flex items-center justify-between gap-2 pb-3"
        style={{ borderBottom: 'var(--game-line) solid var(--game-ink)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[14px] font-black"
            style={{
              background: 'var(--game-yellow)',
              border: 'var(--game-line) solid var(--game-keyline)',
              color: 'var(--game-ink)',
            }}
          >
            <BauhausMark kind="circle" size={14} />
            다음 낱말 이어 말하기
          </span>
          <p className="text-[14px] font-bold" style={{ color: 'var(--game-grey)' }}>
            {stage.title}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex min-h-11 items-center gap-1.5 px-2.5 text-[14px] font-black"
            style={paper}
          >
            <BauhausMark kind="bang" size={16} />
            힌트
          </button>
          <button
            type="button"
            onClick={() => startStage(currentStageIdx)}
            className="flex min-h-11 items-center gap-1.5 px-2.5 text-[14px] font-black"
            style={paper}
          >
            <BauhausMark kind="retry" size={16} />
            다시 시작
          </button>
        </div>
      </div>

      {/* 아이미가 이어 붙인 문장 */}
      <div
        className="flex items-center justify-between gap-2 p-3"
        style={{
          background: 'var(--game-board)',
          border: 'var(--game-line) solid var(--game-board-yellow)',
        }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0" style={{ color: 'var(--game-board-yellow)' }}>
            <BauhausMark kind="circle" size={18} />
          </span>
          <p
            className="truncate text-[15px] font-black sm:text-base"
            style={{ color: 'var(--game-board-ink)' }}
          >
            “{builtSentence}”
          </p>
        </div>
        <button
          type="button"
          onClick={() => speakNow(builtSentence)}
          className="flex min-h-11 shrink-0 items-center gap-1 px-2 text-[14px] font-black"
          style={{
            background: 'var(--game-board-yellow)',
            border: 'var(--game-line) solid var(--game-board-keyline)',
            color: 'var(--game-board)',
          }}
          title="문장 소리 들려주기"
        >
          <Icon name="speaker" size={14} />
          <span>듣기</span>
        </button>
      </div>

      {showHint && (
        <div
          className="flex items-start gap-2 p-2.5 text-[14px] font-bold leading-relaxed"
          style={paper}
        >
          <span className="shrink-0 pt-0.5"><BauhausMark kind="bang" size={16} /></span>
          <span>
            <strong>놀이 방법:</strong> 오른쪽에서 천천히 다가오는 말풍선 가운데
            더 어울리는 낱말을 눌러 터뜨려 보세요. 큰 풍선일수록 어울리는 정도가 높습니다.
          </span>
        </div>
      )}

      {/* 놀이판. 높이가 정해지지 않은 자리에서는 2:1 비율로 서고, 캔버스는 이 칸을 그대로 채운다. */}
      <div
        ref={boardRef}
        className="relative aspect-[2/1] min-h-[240px] w-full flex-1 overflow-hidden"
        style={boardPanel}
      >
        <canvas
          ref={canvasRef}
          width={540}
          height={270}
          onClick={handleCanvasClick}
          aria-label="움직이는 말풍선 장면. 아래 낱말 버튼으로도 고를 수 있어요."
          className="absolute inset-0 h-full w-full cursor-pointer"
        />

        {gameState === 'idle' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center"
            style={overlay}
          >
            <span style={{ color: 'var(--game-board-yellow)' }}>
              <BauhausMark kind="circle" size={44} />
            </span>
            <h4 className="text-lg font-black">다음 낱말을 이어 문장 만들기</h4>
            <p
              className="max-w-xs text-[14px] font-medium leading-relaxed"
              style={{ color: 'var(--game-board-grey)' }}
            >
              아이미에게 다가오는 말풍선 가운데 가장 어울리는 낱말을 눌러 터뜨리고,
              멋진 문장을 이어 완성해 보세요.
            </p>
            <button
              type="button"
              onClick={() => startStage(0)}
              className="flex min-h-12 items-center gap-2 px-6 text-[15px] font-black"
              style={{
                background: 'var(--game-board-yellow)',
                border: 'var(--game-line) solid var(--game-board-keyline)',
                color: 'var(--game-board)',
              }}
            >
              <BauhausMark kind="arrow" size={18} />
              시작하기
            </button>
          </div>
        )}

        {gameState === 'completed' && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 p-4 text-center"
            style={overlay}
          >
            <span style={{ color: 'var(--game-board-blue-ink)' }}>
              <BauhausMark kind="check" size={40} />
            </span>
            <h4 className="text-base font-black sm:text-lg" style={{ color: 'var(--game-board-yellow)' }}>
              아이미의 완성된 당당한 문장
            </h4>
            <p
              className="max-w-sm px-4 py-2 text-[15px] font-black"
              style={{
                border: 'var(--game-line) solid var(--game-board-yellow)',
                color: 'var(--game-board-ink)',
              }}
            >
              “{builtSentence}”
            </p>
            <p
              className="max-w-xs text-[14px] font-medium leading-relaxed"
              style={{ color: 'var(--game-board-grey)' }}
            >
              아이미가 가장 어울리는 다음 낱말을 이어 당당하게 답을 만들었습니다.
              이 대답이 진짜 사실인지 <strong>{stage.factCheckSource}</strong>에서 확인해 볼까요?
            </p>
            <button
              type="button"
              onClick={() => setGameState('fact_check')}
              className="flex min-h-12 items-center gap-2 px-5 text-[14px] font-black sm:text-[15px]"
              style={{
                background: 'var(--game-board-blue)',
                border: 'var(--game-line) solid var(--game-board-blue)',
                color: 'var(--game-board-ink)',
              }}
            >
              <BauhausMark kind="square" size={18} />
              {stage.factCheckSource} 확인하기
            </button>
          </div>
        )}

        {gameState === 'fact_check' && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 p-4 text-center"
            style={overlay}
          >
            <span style={{ color: 'var(--game-board-blue-ink)' }}>
              <BauhausMark kind="square" size={40} />
            </span>
            <h4 className="text-lg font-black" style={{ color: 'var(--game-board-blue-ink)' }}>
              팩트 체크 완료
            </h4>
            <div
              className="max-w-xs space-y-1.5 p-3 text-left text-[14px]"
              style={{ border: 'var(--game-line) solid var(--game-board-grey)' }}
            >
              <p className="font-bold" style={{ color: 'var(--game-board-yellow)' }}>
                아이미의 당당한 문장
              </p>
              <p style={{ color: 'var(--game-board-ink)' }}>“{builtSentence}”</p>
              <p className="mt-2 font-bold" style={{ color: 'var(--game-board-blue-ink)' }}>
                진짜 {stage.factCheckSource} 정보
              </p>
              <p style={{ color: 'var(--game-board-ink)' }}>“{stage.realFact}”</p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {currentStageIdx < GAME_STAGES.length - 1 ? (
                <button
                  type="button"
                  onClick={() => startStage(currentStageIdx + 1)}
                  className="flex min-h-12 items-center gap-2 px-4 text-[14px] font-black"
                  style={{
                    background: 'var(--game-board-yellow)',
                    border: 'var(--game-line) solid var(--game-board-keyline)',
                    color: 'var(--game-board)',
                  }}
                >
                  <BauhausMark kind="arrow" size={16} />
                  다음 단계 ({GAME_STAGES[currentStageIdx + 1].title.split('·')[0]})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => startStage(0)}
                  className="flex min-h-12 items-center gap-2 px-4 text-[14px] font-black"
                  style={{
                    background: 'var(--game-board-blue)',
                    border: 'var(--game-line) solid var(--game-board-blue)',
                    color: 'var(--game-board-ink)',
                  }}
                >
                  <BauhausMark kind="retry" size={16} />
                  처음부터 다시 하기
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div className="p-2" style={boardPanel} aria-label="말풍선 선택 대체 버튼">
          <p className="mb-1 text-[14px] font-black" style={{ color: 'var(--game-board-grey)' }}>
            판을 누르기 어렵다면 아래 낱말 단추를 쓰세요.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stage.steps[currentStepIdx]?.balloons.map((balloon) => (
              <button
                key={balloon.word}
                type="button"
                onClick={() => chooseWordByButton(balloon.word)}
                className="flex min-h-11 items-center gap-1.5 px-2.5 text-[14px] font-black"
                style={{
                  background: 'var(--game-board)',
                  border: 'var(--game-line) solid var(--game-board-blue)',
                  color: 'var(--game-board-ink)',
                }}
              >
                <span style={{ color: 'var(--game-board-blue-ink)' }}>
                  <BauhausMark kind="circle" size={14} />
                </span>
                {balloon.word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 단계 고르기 — 셋을 붙인 한 덩어리로 둔다. 다른 게임의 난이도 탭과 같은 모양이다. */}
      <div
        className="mt-1 flex items-center self-center overflow-hidden"
        style={{ border: 'var(--game-line) solid var(--game-ink)' }}
      >
        {GAME_STAGES.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => startStage(idx)}
            aria-pressed={idx === currentStageIdx}
            className="min-h-11 shrink-0 px-4 text-[14px] font-black transition"
            style={{
              background: idx === currentStageIdx ? 'var(--game-blue)' : 'var(--game-paper)',
              color: idx === currentStageIdx ? 'var(--game-paper)' : 'var(--game-ink)',
              borderLeft: idx === 0 ? 'none' : 'var(--game-line) solid var(--game-ink)',
            }}
          >
            {item.title.split('·')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
