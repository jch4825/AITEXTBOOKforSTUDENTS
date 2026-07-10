import { useEffect, useRef } from 'react';
import { useProgress } from '../context/ProgressContext';
import { MODULES, lessonIdsForModule } from '../data/modules';
import * as THREE from 'three';
import Button from '../components/Button';
import Icon from '../components/Icon';
import ModuleIcon from '../components/ModuleIcon';

import { pickResumeLesson } from '../utils/lessonResume';
import type { LessonId } from '../types';

interface Props {
  onEnter: () => void;
  onEnterLesson?: (id: LessonId) => void;
}

export default function Home({ onEnter, onEnterLesson }: Props) {
  const { completedLessons } = useProgress();
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessonCount, 0);
  const doneCount = completedLessons.length;
  const isResume = doneCount > 0;
  const progressPercent = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0;

  // 배지 획득 계산
  const doneSet = new Set(completedLessons);
  const badges = MODULES.map(m => {
    const lessons = lessonIdsForModule(m.id);
    return {
      module: m,
      earned: lessons.length > 0 && lessons.every(lid => doneSet.has(lid))
    };
  });
  const earnedCount = badges.filter(b => b.earned).length;

  // DOM Refs
  const shaderCanvasRef = useRef<HTMLCanvasElement>(null);
  const threejsContainerRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);

  // 1. WebGL Background Shader Effect
  useEffect(() => {
    const canvas = shaderCanvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    let animationFrameId: number;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
          vec2 uv = v_texCoord;
          vec2 mouse = u_mouse / u_resolution;
          
          vec3 colorBg = vec3(0.97, 0.93, 0.88); // #F8EEE1 기반
          vec3 colorPastelBlue = vec3(0.52, 0.56, 0.78); // primary soft
          vec3 colorNeon = vec3(0.84, 0.99, 0.0); // Neon Accent #D6FD00
          
          float n = noise(uv * 3.0 + u_time * 0.15);
          vec3 finalColor = mix(colorBg, colorPastelBlue, n * 0.12);
          
          float dist = distance(uv, mouse);
          float trail = smoothstep(0.2, 0.0, dist);
          
          float glow = pow(0.015 / dist, 1.1);
          finalColor += colorNeon * glow * 0.35;
          finalColor = mix(finalColor, colorNeon, trail * 0.08);
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = 1.0 - (e.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const syncSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    window.addEventListener('resize', syncSize);
    syncSize();

    const render = (t: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };
    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', syncSize);
    };
  }, []);

  // 2. Three.js Holographic Globe Effect
  useEffect(() => {
    const container = threejsContainerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(4.8, 12);
    const material = new THREE.MeshPhongMaterial({
      color: 0x4f5b90,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      emissive: 0x4f5b90,
      emissiveIntensity: 0.45
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const innerGeo = new THREE.SphereGeometry(4.5, 24, 24);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0xF8EEE1,
      transparent: true,
      opacity: 0.08,
      shininess: 80
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    // 우측 하단 코너에 배치하기 위한 위치 조정
    const updatePosition = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        sphere.position.set(2, -4.5, 0);
      } else {
        sphere.position.set(4.5, -3.2, 0);
      }
      innerSphere.position.copy(sphere.position);
    };
    updatePosition();

    camera.position.z = 8;

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updatePosition();
    };
    window.addEventListener('resize', handleResize);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      sphere.rotation.y += 0.0002;
      sphere.rotation.x += 0.0001;
      sphere.rotation.y += mouseX * 0.001;
      sphere.rotation.x += mouseY * 0.001;

      const scale = 1 + Math.sin(Date.now() * 0.0006) * 0.025;
      sphere.scale.set(scale, scale, scale);
      innerSphere.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 3. Click Ripple Effect
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      ripple.className = 'fixed rounded-full pointer-events-none z-[9998]';
      ripple.style.width = '2px';
      ripple.style.height = '2px';
      ripple.style.backgroundColor = '#D6FD00';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.boxShadow = '0 0 10px #D6FD00';
      document.body.appendChild(ripple);

      ripple.animate([
        { transform: 'scale(1)', opacity: 0.5 },
        { transform: 'scale(50)', opacity: 0 }
      ], {
        duration: 700,
        easing: 'ease-out'
      }).onfinish = () => ripple.remove();
    };
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // 4. Mouse Trail Effect (2 seconds fade out)
  useEffect(() => {
    const canvas = trailCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let points: { x: number; y: number; time: number }[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      points.push({
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      const trailDuration = 2000; // 2 seconds

      // Filter out points older than 2 seconds
      points = points.filter(p => now - p.time < trailDuration);

      if (points.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw custom line with fading alpha per segment
        for (let i = 1; i < points.length; i++) {
          const p1 = points[i - 1];
          const p2 = points[i];

          const age = now - p2.time;
          const alpha = Math.max(0, 1 - age / trailDuration);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          // Low-stimulation, low-saturation pastel green
          ctx.strokeStyle = `rgba(160, 200, 100, ${alpha * 0.45})`;
          ctx.lineWidth = 10; // Slightly thinner line
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(drawTrail);
    };

    drawTrail();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen text-on-surface select-none relative overflow-hidden bg-[#F8EEE1]">

      {/* Mouse Trail Canvas overlay */}
      <canvas
        ref={trailCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-40 bg-transparent"
      />

      {/* WebGL Background Canvas */}
      <div className="fixed inset-0 w-full h-full opacity-40 pointer-events-none">
        <canvas ref={shaderCanvasRef} className="w-full h-full block" />
      </div>

      {/* Three.js Hologram Planet */}
      <div
        ref={threejsContainerRef}
        className="fixed inset-0 w-full h-full pointer-events-none bg-transparent z-0"
      />

      {/* Top Navigation Bar */}
      <nav className="relative z-10 w-full bg-[#fdf8f6]/70 backdrop-blur-xl border-b border-[#4f5b90]/10 shadow-sm h-20">
        <div className="flex justify-between items-center w-full px-6 max-w-[1200px] mx-auto h-full">
          <div className="font-extrabold text-[#4f5b90] tracking-tight text-2xl flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            기본교육과정 중학 선택 교과
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a className="px-4 py-2 text-sm font-bold text-[#546500] border-b-2 border-[#546500]" href="#home">표지 페이지</a>
            <a className="px-4 py-2 text-sm font-semibold text-[#45464f] hover:text-[#4f5b90] transition-colors" href="?teacher=1">교사용 페이지</a>
          </div>
          <button
            onClick={onEnter}
            className="bg-[#4f5b90] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#8490c8] transition-all active:scale-95 shadow-sm"
          >
            목차 페이지
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-20 space-y-16">
        {/* Hero split-layout section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[500px]">
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dde1ff] text-[#081749] text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">school</span>
              기본교육과정 중학 선택
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-[#4f5b90] leading-[1.1] tracking-tight">
              아이미와 배우는<br />
              <span className="text-[#546500]">인공지능 활용</span>
            </h1>
            <p className="text-xl text-[#5C5B5A] leading-relaxed max-w-lg">
              {isResume
                ? '아이미와 친구들이 다시 공부할 준비를 마쳤어요! 이어서 모험을 떠나볼까요?'
                : '진우, 윤아랑 같이 AI 친구 아이미를 만나 여러 가지 신기한 도구와 인공지능의 지식을 배워요.'}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => {
                  if (onEnterLesson) {
                    const resumeId = pickResumeLesson(completedLessons);
                    onEnterLesson(resumeId);
                  } else {
                    onEnter();
                  }
                }}
                className="btn-glow text-xl px-10 py-5 rounded-full shadow-lg flex items-center gap-3 group bg-[#caef00] text-[#181e00] hover:bg-[#ccf200]"
              >
                이어서 학습하기
                <span className="material-symbols-outlined text-2xl group-hover:translate-x-1.5 transition-transform">arrow_forward</span>
              </Button>
            </div>
          </div>

          {/* Right Column (Hero Card with cover image) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 transform rotate-1 hover:rotate-0 transition-transform duration-300 group">
              {/* Cover Image from public/cover.webp */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${import.meta.env.BASE_URL}cover.png')` }}
                aria-label="Aimi, Jinwoo, and Yoona together in a happy future AI society"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B3A55]/85 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-[#caef00] text-[#181e00] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  기본 중학
                </span>
                <h3 className="text-2xl font-black">인공지능 활용(기본교육과정)</h3>
                <p className="text-xs text-white/80">미래 사회와 동반성장하는 첫 단추</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Feature Section */}
        <section id="features" className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#4f5b90]">느린 학습자들을 위한 인공지능 학습서</h2>
            <p className="text-sm text-[#5C5B5A]">발달장애학생들을 위한 첫 인공지능 수업 자료</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card: Progress & Badge shelf */}
            <div className="md:col-span-2 glass-panel p-8 rounded-2xl border border-[#4f5b90]/10 flex flex-col justify-between min-h-[300px]">
              <div>
                <span className="bg-[#4f5b90]/10 text-[#4f5b90] px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">
                  수집 보상
                </span>
                <h3 className="text-2xl font-bold text-[#4f5b90] mb-2">획득한 모듈 완주 배지</h3>
                <p className="text-sm text-[#5C5B5A] max-w-md">
                  각 모듈의 모든 차시 공부를 완료하면 예쁜 AI 친구들 배지를 모을 수 있어요.
                </p>
              </div>

              {/* Badge shelf area */}
              <div className="mt-6 p-4 rounded-xl bg-white/40 border border-white/50 shadow-inner flex flex-wrap items-center gap-4">
                {badges.map(({ module: m, earned }) => (
                  <div
                    key={m.id}
                    className="h-14 w-14 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                    style={earned
                      ? { background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.06)', border: '2px solid #546500' }
                      : { background: 'rgba(255,255,255,0.3)', border: '2px dashed rgba(0,0,0,0.1)', opacity: 0.65 }}
                    title={earned ? `${m.title} 완주!` : `${m.title} 진행 중`}
                  >
                    <ModuleIcon moduleId={m.id} size={28} muted={!earned} />
                  </div>
                ))}
                <span className="text-xs text-[#5C5B5A] font-bold ml-2">
                  {earnedCount} / 6개 획득
                </span>
              </div>
            </div>

            {/* Small Card: Soft Design */}
            <div className="bg-[#fdf8f6]/60 backdrop-blur-md p-8 rounded-2xl border border-[#4f5b90]/10 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#ccf200]/20 flex items-center justify-center text-[#546500] pulse-soft">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1c1b1b]">생동감 있는 화면</h4>
                <p className="text-xs text-[#5C5B5A] mt-1">
                  밝은 색과 경쾌한 애니메이션으로 즐겁게 몰입하는 학습 경험
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Tracker Section */}
        <section id="progress" className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-[#4f5b90]">나의 학습 성장 기록</h2>
            <p className="text-sm text-[#5C5B5A]">그동안 진우와 윤아랑 함께 쌓아온 아름다운 배움의 길입니다.</p>
          </div>

          <div className="bg-[#fdf8f6]/80 backdrop-blur-md border border-[#4f5b90]/10 rounded-3xl p-8 md:p-10 shadow-sm max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
              {/* Math Mastery (Progress Bar) */}
              <div className="space-y-3">
                <div className="text-3xl font-black text-[#546500]">{progressPercent}%</div>
                <div className="text-xs font-bold text-[#45464f] uppercase tracking-wider">전체 차시 완수율</div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#546500] rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      boxShadow: '0 0 10px rgba(214,253,0,0.5)'
                    }}
                  />
                </div>
              </div>

              {/* Continuous days */}
              <div className="space-y-2 md:border-x md:border-[#4f5b90]/10 py-2">
                <div className="text-3xl font-black text-[#4f5b90]">{isResume ? '학습 중' : '시작 단계'}</div>
                <div className="text-xs font-bold text-[#45464f] uppercase tracking-wider">나의 학습 상태</div>
                <p className="text-xs text-[#5C5B5A]">아이미가 대기하고 있어요</p>
              </div>

              {/* Completed Task Count */}
              <div className="space-y-2">
                <div className="text-3xl font-black text-[#9f402f]">{doneCount} 개</div>
                <div className="text-xs font-bold text-[#45464f] uppercase tracking-wider">완료한 학습 개수</div>
                <p className="text-xs text-[#5C5B5A]">총 {totalLessons}개 학습 차시</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 bg-[#f1edeb] border-t border-[#4f5b90]/10 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <div className="font-black text-lg text-[#1c1b1b] flex items-center justify-center md:justify-start gap-1">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
              인공지능 활용
            </div>
            <p className="text-xs text-[#5C5B5A]">이 전자저작물은 바이브코딩으로 제작되었습니다.</p>
          </div>
          <div className="flex gap-6 text-xs text-[#5C5B5A]">
            <a className="hover:text-[#4f5b90] hover:underline" href="#accessibility">접근성 선언</a>
            <a className="hover:text-[#4f5b90] hover:underline" href="#privacy">개인정보 처리방침</a>
            <a className="hover:text-[#4f5b90] hover:underline" href="#support">고객 센터</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
