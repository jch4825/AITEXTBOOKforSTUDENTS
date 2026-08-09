import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../../components/Icon';
import { useSpeak } from '../../../../hooks/useSpeak';

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

    const colors = [
      { bg: '#FDE047', border: '#EAB308' }, // High probability: Amber Gold
      { bg: '#38BDF8', border: '#0284C7' }, // Mid probability: Sky Blue
      { bg: '#F472B6', border: '#DB2777' }, // Low probability: Rose Pink
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

      // 1. Draw Slate Canvas Background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Moving Floor & Grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
      ctx.lineWidth = 1.5;
      const gridOffset = (time * 30) % 40;
      for (let x = -gridOffset; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Track floor line
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 30);
      ctx.lineTo(canvas.width, canvas.height - 30);
      ctx.stroke();

      // 3. Draw Aimi Robot Hero (Hovering at x=80)
      const aimiX = 80;
      const aimiY = canvas.height / 2 - 5 + Math.sin(time * 2) * 6;

      ctx.save();
      ctx.translate(aimiX, aimiY);

      // Aura
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fill();

      // Body (Pale Pink White)
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#F8FAFC';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#F472B6';
      ctx.stroke();

      // Face Screen (Dark Navy)
      ctx.beginPath();
      ctx.roundRect(-15, -9, 30, 18, 7);
      ctx.fillStyle = '#090D16';
      ctx.fill();

      // Glowing Eyes (Cyan LED)
      ctx.fillStyle = '#38BDF8';
      const eyeH = Math.sin(time * 3) > 0.96 ? 1 : 4.5;
      ctx.beginPath();
      ctx.ellipse(-6, 0, 3, eyeH, 0, 0, Math.PI * 2);
      ctx.ellipse(6, 0, 3, eyeH, 0, 0, Math.PI * 2);
      ctx.fill();

      // Antenna & Orb
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(0, -33);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, -35, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();

      // Thruster Ring
      ctx.beginPath();
      ctx.ellipse(0, 24, 10, 3.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.fill();

      ctx.restore();

      // 4. Update and Draw Particles
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
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
        // Balloon String
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.radius);
        ctx.quadraticCurveTo(b.x + Math.sin(time * 2.5) * 5, b.y + b.radius + 14, b.x, b.y + b.radius + 26);
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Balloon Outer Body
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = b.borderColor;
        ctx.stroke();

        // High Probability Badge (e.g. 95% / 80%)
        ctx.fillStyle = '#0F172A';
        ctx.font = 'black 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${b.probability}%`, b.x, b.y - b.radius * 0.42);

        // Word Label inside Balloon
        ctx.fillStyle = '#0F172A';
        ctx.font = 'black 15px sans-serif';
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

  return (
    <div
      className="relative flex h-full flex-col justify-between rounded-2xl p-4 md:p-5 text-white depth-overlay overflow-hidden border-2 border-slate-700"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏃‍♂️</span>
          <div>
            <h3 className="font-extrabold text-base leading-tight text-amber-300">
              아이미의 횡스크롤 다음 단어 잇기 런너
            </h3>
            <p className="text-[14px] text-slate-300 font-medium">{stage.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-[14px] px-2.5 py-1 rounded-full font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 hover:bg-indigo-500/50 cursor-pointer"
          >
            💡 힌트
          </button>
          <button
            type="button"
            onClick={() => startStage(currentStageIdx)}
            className="text-[14px] px-2.5 py-1 rounded-full font-bold bg-slate-800 text-slate-200 border border-slate-600 hover:bg-slate-700 cursor-pointer"
          >
            🔄 다시 시작
          </button>
        </div>
      </div>

      {/* Built Sentence Bar above Character */}
      <div className="my-2 p-3 rounded-xl bg-slate-900/90 border-2 border-amber-400/70 depth-overlay flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">🤖</span>
          <p className="text-[15px] sm:text-base font-extrabold text-amber-300 truncate">
            "{builtSentence}"
          </p>
        </div>
        <button
          type="button"
          onClick={() => speakNow(builtSentence)}
          className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 cursor-pointer shrink-0 text-[14px] flex items-center gap-1"
          title="문장 소리 들려주기"
        >
          <Icon name="speaker" size={14} />
          <span>듣기</span>
        </button>
      </div>

      {/* Hint Alert */}
      {showHint && (
        <div className="mb-2 p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-[14px] font-bold leading-relaxed">
          💡 <strong>게임 방법:</strong> 오른쪽에서 천천히 다가오는 말풍선 중 더 그럴듯한 단어(큰 풍선, 높은 % 수치)를 손으로 눌러 터뜨려 보세요!
        </div>
      )}

      {/* Game Canvas Viewport */}
      <div className="relative flex-1 min-h-[240px] w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-950 depth-overlay">
        <canvas
          ref={canvasRef}
          width={540}
          height={270}
          onClick={handleCanvasClick}
          aria-label="움직이는 말풍선 장면. 아래 낱말 버튼으로도 고를 수 있어요."
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-[color:var(--board-overlay)] p-4 text-center">
            <span className="text-4xl animate-bounce">🎈</span>
            <h4 className="text-lg font-black text-white">다음 단어를 잇는 횡스크롤 런너 미니 게임</h4>
            <p className="text-[14px] text-slate-300 max-w-xs font-medium leading-relaxed">
              아이미에게 다가오는 말풍선 중 가장 그럴듯한 단어 풍선을 눌러 터뜨리고, 멋진 문장을 이어 완성해 봐요!
            </p>
            <button
              type="button"
              onClick={() => startStage(0)}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[15px] rounded-xl depth-overlay cursor-pointer transform transition hover:scale-105 active:scale-95"
            >
              🚀 게임 시작하기
            </button>
          </div>
        )}

        {/* Completion & Fact Check Overlay */}
        {gameState === 'completed' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-3 bg-[color:var(--board-overlay)] p-4 text-center">
            <span className="text-4xl animate-bounce">✨🎉</span>
            <h4 className="text-base sm:text-lg font-black text-amber-300">
              아이미의 완성된 당당한 문장!
            </h4>
            <p className="text-[15px] font-extrabold text-white bg-slate-800/90 px-4 py-2 rounded-xl border border-amber-400/50 max-w-sm">
              "{builtSentence}"
            </p>
            <p className="text-[14px] text-slate-300 max-w-xs font-medium leading-relaxed">
              아이미가 가장 그럴듯한 다음 단어들을 이어 당당히 답을 만들었습니다! 그렇지만 이 대답이 진짜 사실인지 <strong>{stage.factCheckSource}</strong>에서 확인해야 할까요?
            </p>

            <button
              type="button"
              onClick={() => setGameState('fact_check')}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 font-black text-[14px] sm:text-[15px] rounded-xl depth-paper cursor-pointer transform transition hover:scale-105"
            >
              🔍 {stage.factCheckSource} 대조해보기!
            </button>
          </div>
        )}

        {/* Fact Check Celebration Overlay */}
        {gameState === 'fact_check' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center space-y-3 bg-[color:var(--board-overlay)] p-4 text-center">
            <span className="text-4xl">🌟🎯</span>
            <h4 className="text-lg font-black text-emerald-400">팩트 체크 완료!</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-[14px] text-left space-y-1.5 max-w-xs">
              <p className="text-amber-300 font-bold">🤖 아이미의 당당한 문장:</p>
              <p className="text-slate-200">"{builtSentence}"</p>
              <p className="text-emerald-400 font-bold mt-2">📋 진짜 {stage.factCheckSource} 정보:</p>
              <p className="text-slate-200">"{stage.realFact}"</p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {currentStageIdx < GAME_STAGES.length - 1 ? (
                <button
                  type="button"
                  onClick={() => startStage(currentStageIdx + 1)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[14px] rounded-xl cursor-pointer"
                >
                  ▶ 다음 단계 ({GAME_STAGES[currentStageIdx + 1].title.split('·')[0]})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => startStage(0)}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-[14px] rounded-xl cursor-pointer"
                >
                  🔄 처음부터 다시 하기
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div className="mt-2 rounded-xl border border-sky-400/50 bg-sky-950/50 p-2" aria-label="말풍선 선택 대체 버튼">
          <p className="mb-1 text-[14px] font-black text-sky-200">캔버스를 누르기 어렵다면 낱말 버튼을 사용하세요.</p>
          <div className="flex flex-wrap gap-1.5">
            {stage.steps[currentStepIdx]?.balloons.map((balloon) => (
              <button key={balloon.word} type="button" onClick={() => chooseWordByButton(balloon.word)} className="min-h-11 rounded-lg border-2 border-sky-300 bg-slate-900 px-2.5 text-[14px] font-black text-white">
                🎈 {balloon.word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stage Selector Buttons */}
      <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
        {GAME_STAGES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => startStage(idx)}
            className={`text-[14px] font-bold px-3 py-1 rounded-lg border transition cursor-pointer ${
              idx === currentStageIdx
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {s.title.split('·')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
