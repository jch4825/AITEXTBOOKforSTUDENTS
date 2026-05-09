import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Chrome,
  Download,
  ExternalLink,
  FileText,
  Folder,
  Image,
  KeyRound,
  Mail,
  Monitor,
  MousePointerClick,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserPlus,
  X,
} from 'lucide-react';

type Step = {
  title: string;
  instruction: string;
  render: (goNext: () => void) => React.ReactNode;
};

type Module0InteractiveProps = {
  onComplete?: () => void;
  onContinue?: () => void;
  isCompleted?: boolean;
};

const googleColors = ['#4285f4', '#ea4335', '#fbbc04', '#4285f4', '#34a853', '#ea4335'];
const actionClass = 'ring-4 ring-amber-300 shadow-lg shadow-amber-200/60 animate-pulse';

function GoogleWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`} aria-label="Google">
      {'Google'.split('').map((letter, i) => (
        <span key={i} style={{ color: googleColors[i] }}>{letter}</span>
      ))}
    </span>
  );
}

function SimPopup({
  title,
  body,
  onClose,
  onNext,
}: {
  title: string;
  body: React.ReactNode;
  onClose: () => void;
  onNext?: { label: string; action: () => void };
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs overflow-hidden rounded-2xl border border-cyan-400/30 bg-[#1a2436] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-gray-700/60 px-5 py-3">
          <MousePointerClick size={15} className="shrink-0 text-amber-300" />
          <span className="text-base font-bold text-white">{title}</span>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 text-sm leading-relaxed text-gray-300">{body}</div>
        <div className={`flex gap-2 px-5 pb-5 ${onNext ? 'justify-between' : 'justify-end'}`}>
          {onNext && (
            <button
              onClick={() => { onNext.action(); onClose(); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-500 transition-colors"
            >
              {onNext.label}
              <ArrowRight size={13} />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-bold text-gray-200 hover:bg-gray-700 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function StepControls({
  index,
  total,
  onPrev,
  onNext,
  onComplete,
  completed,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete?: () => void;
  completed: boolean;
}) {
  const isLast = index === total - 1;

  return (
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-800 pt-4">
      <button
        onClick={onPrev}
        disabled={index === 0}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-bold text-gray-200 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ArrowLeft size={14} />
        이전
      </button>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, dotIndex) => (
          <span
            key={dotIndex}
            className={`h-2 rounded-full transition-all ${
              dotIndex === index ? 'w-5 bg-cyan-300' : dotIndex < index ? 'w-2 bg-emerald-400' : 'w-2 bg-gray-600'
            }`}
          />
        ))}
      </div>
      {isLast ? (
        <button
          onClick={onComplete}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
            completed
              ? 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800/70'
              : 'bg-emerald-600 text-white hover:bg-emerald-500 ring-4 ring-emerald-300 animate-pulse'
          }`}
        >
          <CheckCircle2 size={14} />
          {completed ? '완료됨' : '완료'}
        </button>
      ) : (
        <button
          onClick={onNext}
          className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-700 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-cyan-600"
        >
          다음
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

function SimWizard({
  steps,
  onComplete,
  onContinue,
  initialCompleted,
  onNavigate,
}: {
  steps: Step[];
  onComplete?: () => void;
  onContinue?: () => void;
  initialCompleted?: boolean;
  onNavigate?: () => void;
}) {
  const [index, setIndex] = useState(() => (initialCompleted ? steps.length - 1 : 0));
  const [completed, setCompleted] = useState(initialCompleted ?? false);
  const step = steps[index];

  const goNext = () => {
    onNavigate?.();
    setIndex((v) => (v === steps.length - 1 ? v : v + 1));
  };
  const goPrev = () => {
    onNavigate?.();
    setIndex((v) => Math.max(0, v - 1));
  };

  const handleComplete = () => {
    setCompleted(true);
    if (onContinue) {
      onContinue();
      return;
    }
    onComplete?.();
  };

  return (
    <div className="flex h-full min-h-[620px] flex-col rounded-xl border border-gray-800 bg-[#0e1318] p-5 text-gray-100">
      {/* 완료 배너 — 완료 후에도 화면에 머무르는 흐름에서 다음 레슨 이동을 제공합니다. */}
      {completed && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3">
          <div className="flex items-center gap-2 text-base font-bold text-emerald-200">
            <CheckCircle2 size={18} />
            곧바로 다음 단계로 넘어가고 싶다면 '다음 레슨' 버튼을 누르세요.
          </div>
          <button
            onClick={() => onContinue?.()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-500"
          >
            다음 레슨
            <ArrowRight size={13} />
          </button>
        </div>
      )}
      <div className="mb-4 rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-4">
        <div className="mb-1 text-sm font-bold uppercase tracking-widest text-cyan-300">
          시뮬레이션 {index + 1}/{steps.length}
        </div>
        <div className="text-base font-bold text-white">{step.title}</div>
        <div className="mt-1 text-sm leading-relaxed text-gray-300">{step.instruction}</div>
      </div>
      <div className="min-h-[400px] flex-1 overflow-y-auto">{step.render(goNext)}</div>
      <StepControls
        index={index}
        total={steps.length}
        onPrev={goPrev}
        onNext={goNext}
        onComplete={handleComplete}
        completed={completed}
      />
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-3 py-1.5 text-sm font-black text-gray-950 shadow-lg ring-4 ring-amber-100 animate-bounce">
      <MousePointerClick size={12} />
      {children}
    </span>
  );
}

function EdgeMark({ className = '', size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-label="Microsoft Edge"
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      <defs>
        {/* 배경 그라디언트 — 짙은 파랑 → 틸 */}
        <linearGradient id="_em_bg" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#1B6FD4" />
          <stop offset="100%" stopColor="#0A9EC8" />
        </linearGradient>
        {/* 호(arc) 그라디언트 — 밝은 틸 → 파랑 */}
        <linearGradient id="_em_arc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#72E8F6" />
          <stop offset="100%" stopColor="#1FC8E4" />
        </linearGradient>
      </defs>

      {/* 배경 둥근 사각형 */}
      <rect width="32" height="32" rx="7" fill="url(#_em_bg)" />

      {/* "e" 본체 — 우측이 열린 큰 호(CCW, large-arc)
          시작: 우상단(~2시 방향), 반시계 방향으로 크게 돌아 우하단(~4:30) */}
      <path
        d="M 25.5 10.5 A 11.5 11.5 0 1 0 20 26"
        fill="none"
        stroke="url(#_em_arc)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* 중간 가로 바 — "e" 모양을 완성하는 핵심 */}
      <line
        x1="5"
        y1="16"
        x2="26.5"
        y2="16"
        stroke="white"
        strokeOpacity="0.92"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BrowserShell({
  browser = 'Chrome',
  url,
  children,
}: {
  browser?: 'Chrome' | 'Edge';
  url: string;
  children: React.ReactNode;
}) {
  const isEdge = browser === 'Edge';
  return (
    <div className="overflow-hidden rounded-xl border border-gray-700 bg-white shadow-2xl">
      <div className={`px-3 pt-2 ${isEdge ? 'bg-[#193a5f]' : 'bg-[#2b2d31]'}`}>
        <div className="flex items-end gap-2">
          <div className={`flex max-w-[220px] items-center gap-2 rounded-t-lg px-3 py-2 ${isEdge ? 'bg-[#27527f]' : 'bg-[#3c4043]'}`}>
            {isEdge ? <EdgeMark size={16} /> : <Chrome size={14} className="text-cyan-200" />}
            <span className="truncate text-sm font-semibold text-white">{browser}</span>
          </div>
          <span className="pb-2 text-gray-400">+</span>
          <div className="ml-auto flex gap-2 pb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-500" />
          </div>
        </div>
      </div>
      <div className={`flex items-center gap-2 px-3 py-2 ${isEdge ? 'bg-[#24466e]' : 'bg-[#35363a]'}`}>
        <ArrowLeft size={14} className="text-gray-400" />
        <ArrowRight size={14} className="text-gray-400" />
        <Search size={14} className="text-gray-400" />
        <div className="flex-1 rounded-full bg-[#111827] px-3 py-1.5 font-mono text-sm text-gray-200">{url}</div>
      </div>
      <div className="text-gray-900">{children}</div>
    </div>
  );
}

function WindowsDesktop({ onEdgeClick }: { onEdgeClick?: () => void }) {
  const desktopIcons = [
    { label: '내 문서', icon: <Folder size={30} /> },
    { label: '수업 자료', icon: <FileText size={30} /> },
    { label: '사진', icon: <Image size={30} /> },
    { label: '내 PC', icon: <Monitor size={30} /> },
    { label: 'Chrome 설치 파일', icon: <Download size={30} /> },
    { label: '휴지통', icon: <div className="text-[28px] leading-none">□</div> },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-700 bg-[#0f172a]">
      <div className="min-h-[220px] bg-gradient-to-br from-sky-800 via-blue-900 to-slate-950 p-5">
        <div className="grid w-[270px] grid-cols-2 gap-x-5 gap-y-4">
          {desktopIcons.map(({ label, icon }) => (
            <div key={label} className="flex h-[78px] w-[112px] flex-col items-center justify-center gap-1.5 rounded-md text-white/80">
              <span className="flex h-9 w-9 items-center justify-center text-sky-100 drop-shadow">{icon}</span>
              <span className="max-w-[98px] truncate text-center text-sm font-semibold drop-shadow">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-white/10 bg-slate-950/90 px-3 py-2">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-blue-600 text-white">
          <div className="grid h-4 w-4 grid-cols-2 gap-0.5">
            <span className="bg-white" /><span className="bg-white" />
            <span className="bg-white" /><span className="bg-white" />
          </div>
        </div>
        <div className="flex h-9 w-44 items-center gap-2 rounded-full bg-white/95 px-3 text-sm font-semibold text-gray-600">
          <Search size={14} />검색
        </div>
        <button
          onClick={onEdgeClick}
          className={`relative grid h-10 w-10 place-items-center rounded-lg bg-slate-800 text-white transition-colors hover:bg-slate-700 ${actionClass}`}
        >
          <EdgeMark size={28} />
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <Hint>Edge 클릭</Hint>
          </div>
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-md bg-slate-800 text-sky-100">
          <Folder size={20} />
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-md bg-slate-800 text-cyan-200">
          <Mail size={19} />
        </div>
        <div className="flex-1" />
        <div className="text-sm text-gray-400">10:30</div>
      </div>
    </div>
  );
}

function InstallDialog({ stage }: { stage: 'download' | 'install' | 'finish' }) {
  const labels = {
    download: ['ChromeSetup.exe', '다운로드가 끝났습니다.'],
    install: ['Chrome 설치 중', '필요한 파일을 복사하고 있습니다.'],
    finish: ['Chrome 설치 완료', '바탕화면에 Chrome 아이콘이 생겼습니다.'],
  };
  const progress = stage === 'download' ? 'w-2/3' : stage === 'install' ? 'w-5/6' : 'w-full';

  return (
    <div className="mx-auto max-w-sm rounded-lg border-2 border-blue-500 bg-gray-50 shadow-2xl">
      <div className="flex items-center justify-between bg-blue-600 px-4 py-2 text-base font-bold text-white">
        <span>{labels[stage][0]}</span>
        <span>×</span>
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <Chrome className="text-blue-500" size={32} />
          <div>
            <div className="text-base font-bold text-gray-900">{labels[stage][1]}</div>
            <div className="text-sm text-gray-500">이 화면은 연습용 시뮬레이션입니다.</div>
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div className={`h-full ${progress} bg-blue-500 transition-all`} />
        </div>
      </div>
    </div>
  );
}

// ─── Lesson 01 ──────────────────────────────────────────────────────────────

export function Lesson01Interactive({ onComplete, onContinue, isCompleted }: Module0InteractiveProps) {
  const steps: Step[] = [
    {
      title: '브라우저가 무엇인지 확인하기',
      instruction: '브라우저는 같은 인터넷 학교에 들어가는 여러 문입니다. 문마다 색깔, 모양, 기본 기능이 조금씩 다릅니다.',
      render: () => (
        <div className="space-y-4">
          <div className="rounded-xl border border-cyan-300/40 bg-cyan-300/10 p-4">
            <div className="mb-2 text-base font-bold text-white">비유로 이해하기</div>
            <p className="text-sm leading-relaxed text-gray-300">
              인터넷은 큰 학교입니다. 그 학교에 들어가는 문은 하나만 있는 것이 아니라 초록색 정문, 파란색 후문, 붉은색 옆문처럼 여러 개가 있습니다.
              이 문들이 바로 브라우저입니다. 모두 같은 인터넷 학교로 들어가는 문이지만 색깔과 모양이 다르고, 기본으로 가진 능력과 기능도 조금씩 다릅니다.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: 'Microsoft Edge', icon: <EdgeMark size={34} />, desc: '윈도우 컴퓨터에 기본으로 있는 파란색 후문입니다. Chrome을 데려올 때 잠깐 사용합니다.', active: false },
              { name: 'Google Chrome', icon: <Chrome size={34} />, desc: 'Google 도구와 잘 맞는 정문입니다. Gemini와 Google AI Studio에 들어갈 때 기본으로 씁니다.', active: true },
              { name: 'Safari', icon: <span className="text-xl font-black">S</span>, desc: '아이폰과 맥에 많이 있는 다른 모양의 문입니다.', active: false },
              { name: 'Naver Whale', icon: <span className="text-xl font-black">W</span>, desc: '네이버 서비스와 친숙한 또 다른 문입니다. 같은 인터넷에 들어가지만 기본 기능이 조금 다릅니다.', active: false },
            ].map((item) => (
              <div key={item.name} className={`rounded-xl border p-4 ${item.active ? 'border-cyan-300 bg-cyan-300/10' : 'border-gray-700 bg-gray-900/60'}`}>
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-xl font-black text-blue-600">{item.icon}</div>
                  <div>
                    <div className="font-bold text-white">{item.name}</div>
                    {item.active && <div className="text-sm font-bold text-cyan-300">이번 모듈에서 사용할 문</div>}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '이번 모듈에서 할 일 보기',
      instruction: '책상 정리, 교실 문 열기, 출입증 만들기, AI 실습실 입장 순서로 생각하면 됩니다.',
      render: () => (
        <div className="space-y-3">
          {[
            '인터넷 학교에 들어가는 문: Chrome 이해하기',
            '임시 안내 데스크: Edge에서 Chrome 데려오기',
            '새 문 달기: Chrome 설치 화면 따라가기',
            '출입증 만들기: Google 계정 만들기',
            'AI 조교 만나기: Gemini에 첫 질문 보내기',
            'AI 실험실 입장하기: Google AI Studio 가입하기',
          ].map((item, i) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-900/60 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-base font-bold text-white">{i + 1}</div>
              <span className="text-base font-semibold text-gray-100">{item}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return <SimWizard steps={steps} onComplete={onComplete} onContinue={onContinue} initialCompleted={isCompleted} />;
}

// ─── Lesson 02 ──────────────────────────────────────────────────────────────

export function Lesson02Interactive({ onComplete, onContinue, isCompleted }: Module0InteractiveProps) {
  const [typed, setTyped] = useState('');
  const [popup, setPopup] = useState<null | 'edge' | 'download'>(null);
  const isChromeAddressReady = typed.trim().toLowerCase() === 'google.com/chrome';

  const steps: Step[] = [
    {
      title: 'Edge 실행하기',
      instruction: '윈도우 작업 표시줄에서 파란 물결 모양 Edge 아이콘을 찾아 클릭합니다.',
      render: (goNext) => (
        <>
          <WindowsDesktop onEdgeClick={() => setPopup('edge')} />
          {popup === 'edge' && (
            <SimPopup
              title="Microsoft Edge를 클릭했어요!"
              body={<span>Edge는 Windows에 <strong className="text-white">기본으로 설치</strong>된 파란 브라우저입니다. Chrome이 없을 때 Edge를 통해 Chrome을 내려받을 수 있습니다. Edge가 열리면 주소창에 <code className="rounded bg-gray-700 px-1 text-amber-200">google.com/chrome</code> 을 입력합니다.</span>}
              onClose={() => setPopup(null)}
              onNext={{ label: '주소 입력하기', action: goNext }}
            />
          )}
        </>
      ),
    },
    {
      title: '주소창에 Chrome 주소 입력하기',
      instruction: '검색창이 아니라 맨 위 긴 주소창에 google.com/chrome 을 직접 입력합니다.',
      render: (goNext) => (
        <div className="space-y-4">
          <BrowserShell browser="Edge" url={typed || 'google.com/chrome을 입력하세요'}>
            <div className="flex min-h-[180px] flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6 text-center">
              <GoogleWordmark className="text-4xl" />
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 font-mono text-base text-gray-500">
                {typed || '주소창에 google.com/chrome 입력'}
              </div>
            </div>
          </BrowserShell>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isChromeAddressReady) {
                e.preventDefault();
                goNext();
              }
            }}
            placeholder="google.com/chrome 을 따라 입력해 보세요"
            className={`w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-base text-white outline-none focus:border-cyan-300 ${actionClass}`}
          />
          {isChromeAddressReady && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300">
              좋습니다! 실제 상황에서는 Enter 키를 누르면 Chrome 다운로드 페이지로 이동합니다.
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Chrome 다운로드 버튼 누르기',
      instruction: '공식 Google Chrome 페이지에서 다운로드 버튼을 클릭합니다.',
      render: () => (
        <>
          <BrowserShell browser="Edge" url="https://www.google.com/chrome/">
            <div className="min-h-[220px] bg-white p-7 text-center">
              <Chrome className="mx-auto mb-4 text-blue-500" size={56} />
              <h3 className="text-xl font-bold text-gray-900">더 빠른 웹을 위한 Chrome</h3>
              <p className="mx-auto mt-2 max-w-sm text-base text-gray-500">Google의 공식 브라우저를 다운로드합니다.</p>
              <div className="relative mt-6 inline-block">
                <button
                  onClick={() => setPopup('download')}
                  className={`inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-base font-bold text-white ${actionClass} cursor-pointer`}
                >
                  <Download size={18} />
                  Chrome 다운로드
                </button>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <Hint>여기 클릭</Hint>
                </div>
              </div>
            </div>
          </BrowserShell>
          {popup === 'download' && (
            <SimPopup
              title="Chrome 다운로드 시작!"
              body={<span><strong className="text-white">ChromeSetup.exe</strong> 파일 다운로드가 시작됩니다. 브라우저 하단 또는 오른쪽 위 다운로드 목록에서 진행 상태를 확인할 수 있습니다. 완료되면 파일을 실행해 설치를 시작합니다.</span>}
              onClose={() => setPopup(null)}
            />
          )}
        </>
      ),
    },
  ];

  return <SimWizard steps={steps} onComplete={onComplete} onContinue={onContinue} initialCompleted={isCompleted} onNavigate={() => setPopup(null)} />;
}

// ─── Lesson 03 ──────────────────────────────────────────────────────────────

export function Lesson03Interactive({ onComplete, onContinue, isCompleted }: Module0InteractiveProps) {
  const steps: Step[] = [
    {
      title: '다운로드된 설치 파일 확인하기',
      instruction: '브라우저 오른쪽 위 또는 아래쪽 다운로드 목록에서 ChromeSetup.exe를 찾습니다.',
      render: () => <InstallDialog stage="download" />,
    },
    {
      title: '설치 파일 실행하기',
      instruction: 'ChromeSetup.exe를 더블클릭하면 설치가 시작됩니다. Windows 확인 창이 나오면 예를 누릅니다.',
      render: () => (
        <div className="space-y-4">
          <InstallDialog stage="install" />
          <div className="mx-auto max-w-sm rounded-lg border border-amber-400/40 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100">
            "이 앱이 디바이스를 변경할 수 있도록 허용하시겠어요?"라는 창이 보이면 Chrome 설치를 계속하기 위해 "예"를 누릅니다.
          </div>
        </div>
      ),
    },
    {
      title: 'Chrome 열기',
      instruction: '설치가 끝나면 바탕화면의 Chrome 아이콘을 더블클릭해 새 브라우저를 엽니다.',
      render: () => (
        <div className="space-y-4">
          <InstallDialog stage="finish" />
          <div className="mx-auto flex max-w-sm items-center gap-3 rounded-xl border border-cyan-300/40 bg-cyan-300/10 p-4">
            <div className="rounded-xl bg-white p-3">
              <Chrome className="text-blue-500" size={34} />
            </div>
            <div>
              <div className="font-bold text-white">Google Chrome</div>
              <div className="text-sm text-gray-300">다음 단계부터는 Chrome 안에서 진행합니다.</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return <SimWizard steps={steps} onComplete={onComplete} onContinue={onContinue} initialCompleted={isCompleted} />;
}

// ─── Lesson 04 ──────────────────────────────────────────────────────────────

export function Lesson04Interactive({ onComplete, onContinue, isCompleted }: Module0InteractiveProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [popup, setPopup] = useState<null | 'signup' | 'next'>(null);

  const steps: Step[] = [
    {
      title: 'Google 계정 만들기 시작',
      instruction: 'Chrome 첫 화면에서 Google 로그인 또는 계정 만들기를 누르는 흐름입니다.',
      render: (goNext) => (
        <>
          <BrowserShell url="accounts.google.com">
            <div className="flex min-h-[240px] items-center justify-center bg-white p-6">
              <div className="w-full max-w-sm rounded-2xl border border-gray-200 p-6 shadow">
                <GoogleWordmark className="text-3xl" />
                <h3 className="mt-5 text-xl font-bold text-gray-900">로그인</h3>
                <p className="mt-1 text-base text-gray-500">Chrome을 사용하려면 Google 계정을 선택하거나 새로 만들 수 있습니다.</p>
                <button
                  onClick={() => setPopup('signup')}
                  className={`mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-base font-bold text-blue-600 ${actionClass}`}
                >
                  <UserPlus size={16} />
                  계정 만들기
                </button>
              </div>
            </div>
          </BrowserShell>
          {popup === 'signup' && (
            <SimPopup
              title="계정 만들기를 클릭했어요!"
              body="이름, Gmail 주소, 비밀번호를 입력하는 화면으로 이동합니다. 학교 이메일이 아닌 개인 Gmail 주소를 새로 만드는 흐름입니다."
              onClose={() => setPopup(null)}
              onNext={{ label: '양식 입력하기', action: goNext }}
            />
          )}
        </>
      ),
    },
    {
      title: '이름과 이메일 연습 입력',
      instruction: '실제 개인정보 대신 연습용 이름과 이메일을 넣어 화면 흐름만 익힙니다.',
      render: (goNext) => (
        <>
          <div className="space-y-4">
            <BrowserShell url="accounts.google.com/signup">
              <div className="min-h-[230px] bg-white p-6">
                <div className="mx-auto max-w-sm">
                  <GoogleWordmark className="text-2xl" />
                  <h3 className="mt-4 text-lg font-bold text-gray-900">Google 계정 만들기</h3>
                  <div className="mt-5 space-y-3">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-base text-gray-800 focus:border-blue-400 focus:outline-none"
                      placeholder="이름 (예: 홍길동 선생님)"
                    />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-base text-gray-800 focus:border-blue-400 focus:outline-none"
                      placeholder="사용할 Gmail 주소 (예: teacher2026)"
                    />
                    <button
                      onClick={() => setPopup('next')}
                      className={`cursor-pointer rounded bg-blue-600 px-4 py-2 text-base font-bold text-white ${actionClass}`}
                    >
                      다음
                    </button>
                  </div>
                </div>
              </div>
            </BrowserShell>
          </div>
          {popup === 'next' && (
            <SimPopup
              title="다음 단계로 이동!"
              body={<span>입력한 이름과 Gmail 주소로 <strong className="text-white">비밀번호 설정</strong> 화면으로 넘어갑니다. 실제로는 입력한 Gmail 주소가 이미 사용 중인지 자동으로 확인됩니다.</span>}
              onClose={() => setPopup(null)}
              onNext={{ label: '보안 설정 보기', action: goNext }}
            />
          )}
        </>
      ),
    },
    {
      title: '보안 설정 확인',
      instruction: '비밀번호, 전화번호, 복구 이메일 같은 보안 단계가 이어질 수 있습니다.',
      render: () => (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            [KeyRound, '비밀번호', '다른 사이트와 같은 비밀번호를 쓰지 않습니다.'],
            [ShieldCheck, '복구 정보', '계정을 잃어버렸을 때 찾기 위한 정보입니다.'],
            [Mail, 'Gmail 준비', '계정이 만들어지면 Gmail 주소가 생깁니다.'],
          ].map(([Icon, title, desc]) => {
            const Component = Icon as typeof KeyRound;
            return (
              <div key={title as string} className="rounded-xl border border-gray-700 bg-gray-900/60 p-4">
                <Component className="mb-3 text-cyan-300" size={28} />
                <div className="font-bold text-white">{title as string}</div>
                <p className="mt-1 text-sm leading-relaxed text-gray-300">{desc as string}</p>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return <SimWizard steps={steps} onComplete={onComplete} onContinue={onContinue} initialCompleted={isCompleted} onNavigate={() => setPopup(null)} />;
}

// ─── Lesson 05 ──────────────────────────────────────────────────────────────

export function Lesson05Interactive({ onComplete, onContinue, isCompleted }: Module0InteractiveProps) {
  const [message, setMessage] = useState('안녕하세요. 초등교사가 Gemini를 처음 배울 때 무엇부터 하면 좋을까요?');
  const [sent, setSent] = useState(false);

  const steps: Step[] = [
    {
      title: 'Gemini 주소 열기',
      instruction: 'Chrome 주소창에 gemini.google.com을 입력합니다.',
      render: () => (
        <BrowserShell url="gemini.google.com">
          <div className="flex min-h-[220px] flex-col items-center justify-center bg-[#101827] p-6 text-center text-white">
            <Sparkles className="mb-4 text-cyan-300" size={46} />
            <h3 className="text-xl font-bold">Gemini</h3>
            <p className="mt-2 text-base text-gray-300">Google 계정으로 로그인하면 Gemini 대화 화면이 열립니다.</p>
          </div>
        </BrowserShell>
      ),
    },
    {
      title: '첫 질문 보내기',
      instruction: '아래 입력창에 질문을 적고 보내기 버튼을 클릭합니다.',
      render: () => (
        <BrowserShell url="gemini.google.com/app">
          <div className="flex min-h-[280px] flex-col bg-[#101827] text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles size={18} className="text-cyan-300" />
                Gemini
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">T</div>
            </div>
            <div className="flex-1 space-y-3 p-5">
              {!sent ? (
                <div className="text-center text-base text-gray-300">무엇이든 물어보세요.</div>
              ) : (
                <>
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3 text-sm leading-relaxed">{message}</div>
                  <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-3 text-sm leading-relaxed text-gray-100">
                    처음에는 짧은 질문부터 시작하세요. 예를 들어 "수업 아이디어 3개", "가정통신문 문장 다듬기"처럼 부탁하면 됩니다.
                  </div>
                </>
              )}
            </div>
            <div className="border-t border-white/10 p-4">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-2">
                <input
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setSent(false); }}
                  className="flex-1 bg-transparent text-sm text-white outline-none"
                />
                <button
                  onClick={() => message.trim() && setSent(true)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-white ${actionClass}`}
                  aria-label="보내기"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </BrowserShell>
      ),
    },
  ];

  return <SimWizard steps={steps} onComplete={onComplete} onContinue={onContinue} initialCompleted={isCompleted} />;
}

// ─── Lesson 06 ──────────────────────────────────────────────────────────────

export function Lesson06Interactive({ onComplete, onContinue, isCompleted }: Module0InteractiveProps) {
  const [accepted, setAccepted] = useState(false);
  const [popup, setPopup] = useState<null | 'login'>(null);

  const steps: Step[] = [
    {
      title: 'Google AI Studio 주소 열기',
      instruction: 'Chrome 주소창에 aistudio.google.com을 입력합니다.',
      render: () => (
        <BrowserShell url="aistudio.google.com">
          <div className="flex min-h-[220px] flex-col items-center justify-center bg-[#0d1117] p-6 text-center text-white">
            <Monitor className="mb-4 text-cyan-300" size={48} />
            <h3 className="text-xl font-bold">Google AI Studio</h3>
            <p className="mt-2 text-base text-gray-400">Gemini API와 AI 실험 기능을 사용할 수 있는 Google의 개발 도구입니다.</p>
          </div>
        </BrowserShell>
      ),
    },
    {
      title: 'Google 계정으로 로그인',
      instruction: '앞에서 만든 Google 계정을 선택해 로그인하는 흐름입니다.',
      render: (goNext) => (
        <>
          <BrowserShell url="aistudio.google.com">
            <div className="flex min-h-[240px] items-center justify-center bg-[#0d1117] p-6">
              <div className="w-full max-w-sm rounded-xl border border-gray-700 bg-[#161b22] p-6 text-center">
                <Monitor className="mx-auto mb-3 text-cyan-300" size={40} />
                <div className="text-lg font-bold text-white">AI Studio 시작하기</div>
                <p className="mt-2 text-sm text-gray-400">Google 계정으로 로그인하면 가입 화면으로 이동합니다.</p>
                <button
                  onClick={() => setPopup('login')}
                  className={`mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-5 py-3 text-base font-bold text-gray-800 ${actionClass}`}
                >
                  <GoogleWordmark />
                  로그인
                </button>
              </div>
            </div>
          </BrowserShell>
          {popup === 'login' && (
            <SimPopup
              title="Google 계정으로 로그인!"
              body="앞에서 만든 Google 계정을 선택하면 AI Studio 약관 동의 화면으로 이동합니다. 계정이 없다면 먼저 소단원 0-4를 완료해 주세요."
              onClose={() => setPopup(null)}
              onNext={{ label: '약관 확인하기', action: goNext }}
            />
          )}
        </>
      ),
    },
    {
      title: '약관 확인 후 가입 완료',
      instruction: '서비스 약관을 확인하고 체크박스를 선택한 뒤 가입 완료 버튼을 누릅니다.',
      render: (goNext) => (
        <BrowserShell url="aistudio.google.com">
          <div className="min-h-[260px] bg-white p-6">
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-bold text-gray-900">Google AI Studio 약관</h3>
              <div className="mt-4 max-h-24 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed text-gray-600">
                이 화면은 가입 흐름을 익히기 위한 시뮬레이션입니다. 실제 가입 시에는 Google의 최신 약관과 개인정보 처리방침을 직접 확인해야 합니다.
              </div>
              <label className="mt-4 flex cursor-pointer items-start gap-3 text-base text-gray-700">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1"
                />
                약관을 확인했습니다.
              </label>
              <button
                disabled={!accepted}
                onClick={() => accepted && goNext()}
                className={`mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300 ${accepted ? actionClass + ' cursor-pointer' : ''}`}
              >
                <Check size={16} />
                가입 완료
              </button>
            </div>
          </div>
        </BrowserShell>
      ),
    },
    {
      title: 'AI Studio 첫 화면 둘러보기',
      instruction: '가입 후 보이는 메뉴 이름만 익힙니다. API 키 발급은 이후 모듈에서 다시 다룰 수 있습니다.',
      render: () => (
        <BrowserShell url="aistudio.google.com">
          <div className="flex min-h-[250px] bg-[#0d1117] text-white">
            <div className="w-44 border-r border-gray-800 bg-[#161b22] p-3">
              <div className="mb-4 flex items-center gap-2 text-base font-bold">
                <Monitor size={17} className="text-cyan-300" />
                AI Studio
              </div>
              {['Playground', 'Build', 'Dashboard', 'Documentation'].map((item) => (
                <div key={item} className="mb-2 rounded-lg px-3 py-2 text-sm text-gray-400">
                  {item}
                </div>
              ))}
              <div className="mt-5 border-t border-gray-800 pt-3">
                {['Search', 'Get API Key'].map((item) => (
                  <div key={item} className={`mb-2 rounded-lg px-3 py-2 text-sm ${item === 'Get API Key' ? 'bg-amber-300/10 text-amber-200' : 'text-gray-400'}`}>
                  {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <ExternalLink className="mb-3 text-cyan-300" size={40} />
              <div className="text-lg font-bold">가입 준비 완료</div>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-400">
                이제 Chrome, Google 계정, Gemini, Google AI Studio의 기본 진입 흐름을 모두 연습했습니다.
              </p>
            </div>
          </div>
        </BrowserShell>
      ),
    },
  ];

  return <SimWizard steps={steps} onComplete={onComplete} onContinue={onContinue} initialCompleted={isCompleted} onNavigate={() => setPopup(null)} />;
}
