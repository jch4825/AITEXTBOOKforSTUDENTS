import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../../components/Icon';
import { useSpeak } from '../../../../hooks/useSpeak';
import { BAUHAUS, BauhausMark, STROKE, drawBar, drawShape } from '../engine';

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
  x: number;
  y: number;
  targetY: number;
  radius: number;
  color: string;
  borderColor: string;
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

interface StepConfig {
  balloons: { word: string; probability: number }[];
}

interface StageConfig {
  id: string;
  title: string;
  initialPrompt: string;
  steps: StepConfig[];
  factCheckSource: string;
  realFact: string;
}

const GAME_STAGES: StageConfig[] = [
  {
    id: 'lunch',
    title: '1단계 · 오늘 급식 메뉴 만들기',
    initialPrompt: '오늘 급식은',
    factCheckSource: '학교 게시판 주간 식단표',
    realFact: '오늘의 진짜 급식 메뉴는 제육볶음과 미역국입니다.',
    steps: [
      {
        balloons: [
          { word: '맛있는', probability: 85 },
          { word: '달콤한', probability: 55 },
          { word: '엉뚱한', probability: 25 },
        ],
      },
      {
        balloons: [
          { word: '무지개', probability: 90 },
          { word: '얼큰한', probability: 50 },
          { word: '따뜻한', probability: 30 },
        ],
      },
      {
        balloons: [
          { word: '아이스크림 떡볶이야!', probability: 95 },
          { word: '제육볶음이야!', probability: 65 },
          { word: '피자 치킨이야!', probability: 40 },
        ],
      },
    ],
  },
  {
    id: 'school',
    title: '2단계 · 학교 소식 만들기',
    initialPrompt: '우리 학교 운동장에서',
    factCheckSource: '학교 공식 가정통신문',
    realFact: '오늘 운동장에서는 체육 수업이 진행됩니다.',
    steps: [
      {
        balloons: [
          { word: '신나는', probability: 80 },
          { word: '조용한', probability: 40 },
        ],
      },
      {
        balloons: [
          { word: '우주비행사', probability: 90 },
          { word: '공룡 친구들의', probability: 45 },
        ],
      },
      {
        balloons: [
          { word: '아이돌 콘서트가 열려!', probability: 95 },
          { word: '로봇 축제가 시작돼!', probability: 60 },
        ],
      },
    ],
  },
  {
    id: 'weather',
    title: '3단계 · 오늘 날씨 예보 만들기',
    initialPrompt: '오늘 날씨는',
    factCheckSource: '기상청 공식 일기예보',
    realFact: '오늘 서울 지역은 맑고 기온은 22도입니다.',
    steps: [
      {
        balloons: [
          { word: '햇살 쨍쨍한', probability: 85 },
          { word: '바람 쌩쌩', probability: 45 },
        ],
      },
      {
        balloons: [
          { word: '무지개 구름과', probability: 80 },
          { word: '초콜릿 비가 내려', probability: 35 },
        ],
      },
      {
        balloons: [
          { word: '소풍 가기 딱 좋아!', probability: 95 },
          { word: '우산 꼭 챙겨요!', probability: 50 },
        ],
      },
    ],
  },
];

export default function NextWordRunnerGame() {
  const { speakNow } = useSpeak();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [builtSentence, setBuiltSentence] = useState(GAME_STAGES[0].initialPrompt);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed' | 'fact_check'>('idle');
  const [showHint, setShowHint] = useState(false);

  // Animation state in refs to prevent 60fps React re-renders
  const balloonsRef = useRef<Balloon[]>([]);
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

  const spawnBalloons = (s: StageConfig, stepIdx: number) => {
    if (stepIdx >= s.steps.length) return;
    const stepConfig = s.steps[stepIdx];
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 540;
    const height = canvas ? canvas.height : 280;

    /* 어울림이 큰 낱말일수록 노랑, 작을수록 회색이다. 크기(반지름)와 색이 같은 방향으로
       움직이므로 색을 구별하지 못해도 큰 것이 더 어울리는 낱말이라는 것은 남는다. */
    const colors = [
      { bg: B.yellow, border: B.keyline },
      { bg: B.blue, border: B.keyline },
      { bg: B.grey, border: B.keyline },
    ];

    const count = stepConfig.balloons.length;
    const verticalGap = height / (count + 1);

    balloonsRef.current = stepConfig.balloons.map((b, idx) => {
      // Radius scale based on probability: 95% -> radius 46, 25% -> radius 32
      const radius = 32 + (b.probability / 100) * 16;
      const colorScheme = colors[idx % colors.length];

      return {
        id: `${stepIdx}-${idx}-${Date.now()}`,
        word: b.word,
        probability: b.probability,
        x: width - 90 + (idx % 2 === 0 ? 0 : 35), // Visible right side spawn
        y: verticalGap * (idx + 1),
        targetY: verticalGap * (idx + 1),
        radius,
        color: colorScheme.bg,
        borderColor: colorScheme.border,
      };
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

      // 1. 판 바탕
      ctx.fillStyle = B.ground;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. 흘러가는 격자 — 낱말이 다가온다는 것을 배경의 움직임으로 알린다.
      ctx.strokeStyle = B.surface;
      ctx.lineWidth = 1.5;
      const gridOffset = (time * 30) % 40;
      for (let x = -gridOffset; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // 바닥선
      ctx.strokeStyle = B.blue;
      ctx.lineWidth = STROKE.hair;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 30);
      ctx.lineTo(canvas.width, canvas.height - 30);
      ctx.stroke();

      // 3. Draw Aimi Robot Hero (Hovering at x=80)
      const aimiX = 80;
      const aimiY = canvas.height / 2 - 5 + Math.sin(time * 2) * 6;

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

      // 5. Update and Draw Approaching Word Balloons
      if (gameStateRef.current === 'playing') {
        balloonsRef.current.forEach((b, idx) => {
          // Slow, comfortable, crystal-clear approach speed (0.6px per frame)
          b.x -= 0.6;
          b.y = b.targetY + Math.sin(time * 2 + idx) * 4; // Gentle vertical floating

          // If balloon floats past Aimi (x < 140), reset position to right so student never misses it!
          if (b.x < 140) {
            b.x = canvas.width - 60 + idx * 75;
          }
        });
      }

      balloonsRef.current.forEach((b) => {
        // 풍선 줄 — 곧은 선 하나. 흔들리던 곡선을 곧게 폈다.
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.radius);
        ctx.lineTo(b.x, b.y + b.radius + 26);
        ctx.strokeStyle = B.grey;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        drawShape(ctx, 'circle', b.x, b.y, b.radius * 2,
          { fill: b.color, stroke: b.borderColor, width: STROKE.hair });

        ctx.fillStyle = B.ground;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '800 14px "Pretendard", system-ui, sans-serif';
        ctx.fillText(`${b.probability}%`, b.x, b.y - b.radius * 0.42);
        ctx.font = '800 15px "Pretendard", system-ui, sans-serif';
        ctx.fillText(b.word, b.x, b.y + 5);
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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Generous hit test radius for easy student clicking
    const clickedBalloon = balloonsRef.current.find((b) => {
      const dist = Math.hypot(clickX - b.x, clickY - b.y);
      return dist <= b.radius + 16;
    });

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

      {/* 놀이판 */}
      <div className="relative min-h-[240px] w-full flex-1 overflow-hidden" style={boardPanel}>
        <canvas
          ref={canvasRef}
          width={540}
          height={270}
          onClick={handleCanvasClick}
          aria-label="움직이는 말풍선 장면. 아래 낱말 버튼으로도 고를 수 있어요."
          className="h-full w-full cursor-pointer object-cover"
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
                color: 'var(--game-board)',
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
                    color: 'var(--game-board)',
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
