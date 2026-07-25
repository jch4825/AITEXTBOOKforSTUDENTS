import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';

interface Balloon {
  id: string;
  word: string;
  probability: number; // 0 to 100
  x: number;
  y: number;
  radius: number;
  color: string;
  borderColor: string;
  isPopping?: boolean;
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
          { word: '맛있는', probability: 80 },
          { word: '달콤한', probability: 55 },
          { word: '엉뚱한', probability: 25 },
        ],
      },
      {
        balloons: [
          { word: '무지개', probability: 85 },
          { word: '얼큰한', probability: 50 },
          { word: '따뜻한', probability: 30 },
        ],
      },
      {
        balloons: [
          { word: '아이스크림 떡볶이야!', probability: 90 },
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
          { word: '신나는', probability: 75 },
          { word: '조용한', probability: 40 },
        ],
      },
      {
        balloons: [
          { word: '우주비행사', probability: 85 },
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
          { word: '햇살 쨍쨍한', probability: 80 },
          { word: '바람 쌩쌩', probability: 45 },
        ],
      },
      {
        balloons: [
          { word: '무지개 구름과', probability: 75 },
          { word: '초콜릿 비가 내려', probability: 35 },
        ],
      },
      {
        balloons: [
          { word: '소풍 가기 딱 좋아!', probability: 90 },
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
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showHint, setShowHint] = useState(false);

  const stage = GAME_STAGES[currentStageIdx];

  // Sound synthesizer using Web Audio API for balloon pops
  const playPopSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio context fallback
    }
  };

  const startStage = (stageIndex: number) => {
    const s = GAME_STAGES[stageIndex];
    setCurrentStageIdx(stageIndex);
    setCurrentStepIdx(0);
    setBuiltSentence(s.initialPrompt);
    setGameState('playing');
    setShowHint(false);
    spawnBalloonsForStep(s, 0);
  };

  const spawnBalloonsForStep = (s: StageConfig, stepIdx: number) => {
    if (stepIdx >= s.steps.length) return;
    const stepConfig = s.steps[stepIdx];
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 500;
    const height = canvas ? canvas.height : 320;

    const colors = [
      { bg: '#FDE047', border: '#EAB308' }, // Amber / Gold for high prob
      { bg: '#38BDF8', border: '#0284C7' }, // Sky / Blue for mid prob
      { bg: '#F472B6', border: '#DB2777' }, // Rose / Pink for low prob
    ];

    const count = stepConfig.balloons.length;
    const verticalGap = height / (count + 1);

    const newBalloons: Balloon[] = stepConfig.balloons.map((b, idx) => {
      // Radius scale based on probability: 85% prob -> radius 42, 30% prob -> radius 28
      const radius = 26 + (b.probability / 100) * 20;
      const colorScheme = colors[idx % colors.length];

      return {
        id: `${stepIdx}-${idx}-${Date.now()}`,
        word: b.word,
        probability: b.probability,
        x: width + 60 + idx * 85, // staggered approach
        y: verticalGap * (idx + 1),
        radius,
        color: colorScheme.bg,
        borderColor: colorScheme.border,
      };
    });

    setBalloons(newBalloons);
  };

  const handlePopBalloon = (targetBalloon: Balloon) => {
    if (gameState !== 'playing') return;

    playPopSound();
    speakNow(targetBalloon.word);

    // Create particle explosion
    const newParticles: Particle[] = [];
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18;
      const speed = 2 + Math.random() * 3.5;
      newParticles.push({
        x: targetBalloon.x,
        y: targetBalloon.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: targetBalloon.color,
        radius: 3 + Math.random() * 3,
        life: 0,
        maxLife: 20 + Math.random() * 10,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);

    // Append word to sentence
    const updatedSentence = `${builtSentence} ${targetBalloon.word}`;
    setBuiltSentence(updatedSentence);

    const nextStep = currentStepIdx + 1;
    if (nextStep < stage.steps.length) {
      setCurrentStepIdx(nextStep);
      spawnBalloonsForStep(stage, nextStep);
    } else {
      setBalloons([]);
      setGameState('completed');
    }
  };

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.05;

      // 1. Clear background
      ctx.fillStyle = '#0F172A'; // Dark slate
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw moving speed lines / floor grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1.5;
      const lineOffset = (time * 60) % 40;
      for (let x = -lineOffset; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw floor path line
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 35);
      ctx.lineTo(canvas.width, canvas.height - 35);
      ctx.stroke();

      // 3. Draw Aimi Robot Hero (Hovering at x=80)
      const aimiX = 85;
      const aimiY = canvas.height / 2 - 10 + Math.sin(time * 2) * 8;

      // Aimi Body (pinkish white round body)
      ctx.save();
      ctx.translate(aimiX, aimiY);

      // Glowing aura
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fill();

      // Robot Outer Body
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#F8FAFC';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#F472B6';
      ctx.stroke();

      // LED Face Screen (Dark Navy)
      ctx.beginPath();
      ctx.roundRect(-16, -10, 32, 20, 8);
      ctx.fillStyle = '#090D16';
      ctx.fill();

      // LED Eyes (Glowing Cyan, blinking)
      ctx.fillStyle = '#38BDF8';
      const eyeHeight = Math.sin(time * 3) > 0.95 ? 1 : 5;
      ctx.beginPath();
      ctx.ellipse(-7, 0, 3.5, eyeHeight, 0, 0, Math.PI * 2);
      ctx.ellipse(7, 0, 3.5, eyeHeight, 0, 0, Math.PI * 2);
      ctx.fill();

      // Antenna
      ctx.beginPath();
      ctx.moveTo(0, -26);
      ctx.lineTo(0, -36);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Antenna Orb
      ctx.beginPath();
      ctx.arc(0, -38, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();

      // Hovering thruster ring underneath
      ctx.beginPath();
      ctx.ellipse(0, 26, 12, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.fill();

      ctx.restore();

      // 4. Draw Particles (popping sparks)
      setParticles((prevParticles) =>
        prevParticles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life + 1,
          }))
          .filter((p) => p.life < p.maxLife)
      );

      particles.forEach((p) => {
        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 5. Update and Draw Approaching Word Balloons
      if (gameState === 'playing') {
        setBalloons((prevBalloons) =>
          prevBalloons.map((b) => {
            let nextX = b.x - 2.8; // Moving speed towards left
            // Recycle balloon if it passes Aimi without click
            if (nextX < -50) {
              nextX = canvas.width + 80;
            }
            return { ...b, x: nextX };
          })
        );
      }

      balloons.forEach((b) => {
        // Draw Balloon String
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.radius);
        ctx.quadraticCurveTo(b.x + Math.sin(time * 3) * 6, b.y + b.radius + 15, b.x, b.y + b.radius + 30);
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw Balloon Body
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = b.borderColor;
        ctx.stroke();

        // Probability Label Badge (e.g. 85%)
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${b.probability}%`, b.x, b.y - b.radius * 0.45);

        // Word Label inside Balloon
        ctx.fillStyle = '#0F172A';
        ctx.font = 'extrabold 12px sans-serif';
        ctx.fillText(b.word, b.x, b.y + 6);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [gameState, balloons, particles]);

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

    // Check hit test against balloons
    const clickedBalloon = balloons.find((b) => {
      const dist = Math.hypot(clickX - b.x, clickY - b.y);
      return dist <= b.radius + 10; // Generous hit radius for accessibility
    });

    if (clickedBalloon) {
      handlePopBalloon(clickedBalloon);
    }
  };

  return (
    <div
      className="relative flex h-full flex-col justify-between rounded-2xl p-4 md:p-5 text-white shadow-xl overflow-hidden border-2 border-slate-700"
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
            <p className="text-xs text-slate-300 font-medium">{stage.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs px-2.5 py-1 rounded-full font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 hover:bg-indigo-500/50 cursor-pointer"
          >
            💡 힌트
          </button>
          <button
            type="button"
            onClick={() => startStage(currentStageIdx)}
            className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-800 text-slate-200 border border-slate-600 hover:bg-slate-700 cursor-pointer"
          >
            🔄 다시 시작
          </button>
        </div>
      </div>

      {/* Built Sentence Bar above Character */}
      <div className="my-2 p-3 rounded-xl bg-slate-900/90 border-2 border-amber-400/70 shadow-inner flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">🤖</span>
          <p className="text-sm sm:text-base font-extrabold text-amber-300 truncate">
            "{builtSentence}"
          </p>
        </div>
        <button
          type="button"
          onClick={() => speakNow(builtSentence)}
          className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 cursor-pointer shrink-0 text-xs flex items-center gap-1"
          title="문장 소리 들려주기"
        >
          <Icon name="speaker" size={14} />
          <span>듣기</span>
        </button>
      </div>

      {/* Hint Alert */}
      {showHint && (
        <div className="mb-2 p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-bold leading-relaxed">
          💡 <strong>게임 방법:</strong> 오른쪽에서 다가오는 말풍선 중 더 그럴듯한 단어(큰 풍선, 높은 % 수치)를 클릭하여 터뜨려 보세요!
        </div>
      )}

      {/* Game Canvas Viewport */}
      <div className="relative flex-1 min-h-[220px] w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner">
        <canvas
          ref={canvasRef}
          width={520}
          height={260}
          onClick={handleCanvasClick}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-3">
            <span className="text-4xl animate-bounce">🎈</span>
            <h4 className="text-lg font-black text-white">다음 단어를 잇는 횡스크롤 런너 미니 게임</h4>
            <p className="text-xs text-slate-300 max-w-xs font-medium leading-relaxed">
              아이미에게 다가오는 말풍선 중 가장 그럴듯한 단어 풍선을 눌러 터뜨리고, 멋진 문장을 이어 완성해 봐요!
            </p>
            <button
              type="button"
              onClick={() => startStage(0)}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg cursor-pointer transform transition hover:scale-105 active:scale-95"
            >
              🚀 게임 시작하기
            </button>
          </div>
        )}

        {/* Completion & Fact Check Overlay */}
        {gameState === 'completed' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-3 z-20">
            <span className="text-4xl animate-bounce">✨🎉</span>
            <h4 className="text-base sm:text-lg font-black text-amber-300">
              아이미의 완성된 당당한 문장!
            </h4>
            <p className="text-sm font-extrabold text-white bg-slate-800/90 px-4 py-2 rounded-xl border border-amber-400/50 max-w-sm">
              "{builtSentence}"
            </p>
            <p className="text-xs text-slate-300 max-w-xs font-medium leading-relaxed">
              아이미가 가장 그럴듯한 다음 단어들을 이어 당당히 답을 만들었습니다! 그렇지만 이 대답이 진짜 사실인지 <strong>{stage.factCheckSource}</strong>에서 확인해야 할까요?
            </p>

            <button
              type="button"
              onClick={() => setGameState('fact_check')}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transform transition hover:scale-105"
            >
              🔍 {stage.factCheckSource} 대조해보기!
            </button>
          </div>
        )}

        {/* Fact Check Celebration Overlay */}
        {gameState === 'fact_check' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center space-y-3 z-30">
            <span className="text-4xl">🌟🎯</span>
            <h4 className="text-lg font-black text-emerald-400">팩트 체크 완료!</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-left space-y-1.5 max-w-xs">
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
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer"
                >
                  ▶ 다음 단계 ({GAME_STAGES[currentStageIdx + 1].title})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => startStage(0)}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                >
                  🔄 처음부터 다시 하기
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stage Selector Buttons */}
      <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
        {GAME_STAGES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => startStage(idx)}
            className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition cursor-pointer ${
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
