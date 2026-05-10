import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
  Layers,
  Lightbulb,
  MousePointer2,
  Wand2,
  Wrench,
} from 'lucide-react';
import { ViewType } from '../types';

interface HomeProps {
  onViewChange: (view: ViewType) => void;
  onStartDiagnostic: () => void;
}

const WORK_MODES = [
  {
    id: 'tutorial' as ViewType,
    title: '인공지능 배워보기',
    description: 'LLM 이해부터 윤리 점검까지, 초등교사를 위한 체계적인 로드맵입니다.',
    stats: '5모듈 · 34강',
    action: '기초부터 익히기',
    icon: GraduationCap,
    accent: 'text-canva-purple',
    iconBg: 'bg-violet-100',
    glow: 'from-violet-100/90 via-fuchsia-50/50 to-transparent',
    bar: 'bg-canva-purple',
    button: 'bg-canva-purple hover:bg-canva-purple/90',
    chipStyle: 'bg-violet-100 text-violet-700',
    chips: ['AI 기초', '윤리 체크', '수업 적용'],
  },
  {
    id: 'tools' as ViewType,
    title: 'AI 도구 모음',
    description: '생기부 초안, 수업안 생성 등 지금 당장 쓸 수 있는 AI 도구 모음입니다.',
    stats: '19가지 도구',
    action: '바로 만들기',
    icon: Wrench,
    accent: 'text-canva-teal',
    iconBg: 'bg-cyan-100',
    glow: 'from-cyan-100/90 via-emerald-50/50 to-transparent',
    bar: 'bg-canva-teal',
    button: 'bg-canva-teal hover:bg-canva-teal/90',
    chipStyle: 'bg-cyan-100 text-cyan-700',
    chips: ['교안', '평가문항', '안내문'],
  },
  {
    id: 'resources' as ViewType,
    title: '자료실',
    description: 'AI 디지털 교재, 심의 서류 등 실무 자료를 즉시 활용하세요.',
    stats: '즉시 다운로드',
    action: '자료 가져오기',
    icon: BookOpen,
    accent: 'text-canva-ink',
    iconBg: 'bg-slate-100',
    glow: 'from-slate-100/90 via-slate-50/50 to-transparent',
    bar: 'bg-canva-ink',
    button: 'bg-canva-ink hover:bg-canva-ink/90',
    chipStyle: 'bg-slate-200 text-slate-600',
    chips: ['AI 도구', '교육 포털', '정책 지침'],
  },
] as const;

const TEACHING_TIPS = [
  '막막한 빈 문서 앞에서 멈추지 마세요. 첫 문장은 AI에게 맡기고, 좋은 수업은 선생님이 완성합니다.',
  '수업 준비의 시작을 0에서 60으로 끌어올리세요. 남은 40은 우리 반 아이들에 맞게 다듬으면 됩니다.',
  '“이걸 어떻게 설명하지?” 싶은 순간, AI는 옆자리 연구부장처럼 다른 표현을 꺼내줍니다.',
  '교과서 한 쪽을 넣고 활동 세 가지를 받아보세요. 평범한 진도가 작은 탐구 장면으로 바뀝니다.',
  '좋은 AI 활용은 빠른 복사가 아니라 빠른 초안입니다. 교사의 눈으로 고칠 때 진짜 수업이 됩니다.',
  '아이들이 어려워하는 지점을 먼저 물어보세요. AI는 예상 오개념을 찾아 수업의 함정을 줄여줍니다.',
  '수업안이 너무 얌전하다면 “아이들이 몸을 움직이는 활동으로 바꿔줘”라고 말해보세요.',
  '평가 문항도 분위기가 있습니다. 확인용, 토론용, 도전용을 나누면 수업 리듬이 살아납니다.',
  '학부모 안내문은 딱딱하지 않아도 됩니다. 정확한 정보에 따뜻한 한 문장을 더해보세요.',
  'AI에게 “우리 반에 말이 느린 학생도 있어”라고 알려주면 설명의 속도와 계단이 달라집니다.',
  '생활지도 문구가 고민될 때는 단호함과 존중을 함께 요청하세요. 말의 온도가 달라집니다.',
  '수업 도입 3분이 바뀌면 아이들의 눈빛이 바뀝니다. AI에게 호기심을 여는 질문부터 맡겨보세요.',
  '자료를 더 만드는 것보다 덜어내는 것이 필요할 때가 있습니다. AI에게 핵심만 남겨달라고 하세요.',
  '한 가지 활동을 세 수준으로 나누면 같은 교실 안의 다른 속도를 품을 수 있습니다.',
  'AI 윤리는 겁주는 수업이 아닙니다. “이럴 땐 어떻게 판단할까?”를 묻는 연습입니다.',
  '좋은 프롬프트는 주문이 아니라 대화의 첫 줄입니다. 학년, 상황, 목표를 말하면 길이 열립니다.',
  '이미 만든 수업안을 넣고 더 재미있는 도입만 다시 받아보세요. 전부 갈아엎을 필요는 없습니다.',
  '발문이 막히면 AI에게 학생 답변을 예상해 달라고 하세요. 다음 질문이 자연스럽게 보입니다.',
  '루브릭은 채점표를 넘어 약속입니다. 아이들이 무엇을 잘하면 되는지 먼저 보여주세요.',
  'AI는 시간을 아껴주는 도구입니다. 아낀 시간은 아이 얼굴을 더 오래 보는 데 쓰면 됩니다.',
] as const;

function getRandomTipIndex(currentIndex: number) {
  if (TEACHING_TIPS.length < 2) return 0;

  let nextIndex = currentIndex;
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * TEACHING_TIPS.length);
  }
  return nextIndex;
}

function FloatingCard({
  className,
  delay,
  children,
}: {
  className: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay, duration: 0.55, ease: 'easeOut' }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{
          duration: 3.2 + delay * 0.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay + 0.9,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Home({ onViewChange, onStartDiagnostic }: HomeProps) {
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TEACHING_TIPS.length));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTipIndex((currentIndex) => getRandomTipIndex(currentIndex));
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="moholy-page min-h-screen overflow-hidden">
      <section className="moholy-hero relative min-h-[520px] overflow-hidden px-5 py-10 text-white sm:px-8 lg:px-12 lg:py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="moholy-shape moholy-band-primary" />
        <div className="moholy-shape moholy-band-secondary" />
        <div className="moholy-shape moholy-ring" />
        <div className="moholy-shape moholy-disc" />
        <div className="moholy-shape moholy-line-stack" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/16 px-4 py-2 text-xs font-bold tracking-wide backdrop-blur-md">
              <Wand2 size={15} />
              교사를 위한 AI 격차 Zer0 마중물 꾸러미
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              AI Bridge
              <span className="mt-2 block text-2xl font-semibold text-white/82 sm:text-3xl">
                Zero-Gap Toolkit
              </span>
            </h1>
            <p className="mt-6 text-base font-medium leading-8 text-white/84 sm:text-lg">
              AI 활용 수업, 어떻게 시작하는지 아무도 제대로 안 알려줬죠.
              <br />
              여기서 시작하세요.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onStartDiagnostic}
                className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-extrabold text-canva-ink shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
              >
                나의 학습 경로 추천 받기
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          <div className="relative min-h-[360px] lg:min-h-[420px]" aria-hidden="true">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="moholy-preview-panel absolute inset-x-0 top-4 mx-auto h-[330px] max-w-[620px] rounded-[28px] border border-white/24 p-4 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl sm:h-[390px]"
            >
              <div className="flex items-center justify-between border-b border-white/14 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                </div>
                <span className="rounded-full bg-white/16 px-3 py-1 text-[11px] font-bold text-white/82">
                  lesson-canvas.ai
                </span>
              </div>
              <div className="relative h-full">
                <FloatingCard
                  delay={0.22}
                  className="absolute left-2 top-8 w-[58%] rounded-2xl bg-white p-4 text-canva-ink shadow-xl shadow-slate-900/12 sm:left-5 sm:top-10"
                >
                  <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-canva-purple">
                    <MousePointer2 size={14} />
                    교사 입력
                  </div>
                  <p className="text-sm font-bold leading-6">
                    “3학년 과학, 자석의 성질을 탐구형 수업으로 바꿔줘.”
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['탐구', '모둠활동', '평가포함'].map((chip) => (
                      <span key={chip} className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-canva-purple">
                        {chip}
                      </span>
                    ))}
                  </div>
                </FloatingCard>

                <FloatingCard
                  delay={0.34}
                  className="absolute right-1 top-24 w-[48%] rounded-2xl bg-cyan-50 p-4 text-canva-ink shadow-xl shadow-slate-900/12 sm:right-4 sm:top-28"
                >
                  <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-canva-teal">
                    <FileText size={14} />
                    수업안 생성
                  </div>
                  <div className="space-y-2">
                    <span className="block h-2 rounded-full bg-cyan-200" />
                    <span className="block h-2 w-5/6 rounded-full bg-cyan-100" />
                    <span className="block h-2 w-2/3 rounded-full bg-cyan-100" />
                  </div>
                </FloatingCard>

                <FloatingCard
                  delay={0.46}
                  className="absolute bottom-10 left-10 w-[45%] rounded-2xl bg-white p-4 text-canva-ink shadow-xl shadow-slate-900/12"
                >
                  <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-emerald-600">
                    <Layers size={14} />
                    활동지 묶음
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['Q1', 'Q2', 'Q3'].map((item) => (
                      <span key={item} className="rounded-lg bg-emerald-50 py-3 text-center text-xs font-black text-emerald-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </FloatingCard>

                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-20 right-8 rounded-full bg-canva-ink px-4 py-2 text-xs font-extrabold text-white shadow-lg"
                >
                  AI가 자료를 연결 중
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-7xl px-5 pb-14 sm:px-8 lg:px-12">
        <section className="relative -mt-8 overflow-hidden rounded-2xl border border-canva-border bg-white px-5 py-4 shadow-lg shadow-slate-900/7 sm:px-6">
          <div className="absolute bottom-0 left-0 top-0 w-1 rounded-l-2xl bg-amber-400" />
          <div className="flex min-h-[48px] items-center gap-4">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Lightbulb size={21} />
            </span>
            <div className="relative min-h-[32px] flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="text-sm font-bold leading-7 text-canva-ink sm:text-base"
                >
                  {TEACHING_TIPS[tipIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="pt-10">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-canva-ink sm:text-3xl">오늘 필요한 방식으로 시작하세요</h2>
            </div>
            <p className="max-w-xl text-sm font-medium leading-6 text-canva-gray">
              학습, 제작, 자료 탐색을 분리해 두되 첫 화면에서는 하나의 제작 흐름처럼 이어지게 구성했습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {WORK_MODES.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  onClick={() => onViewChange(card.id)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                  className="group relative flex min-h-[292px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-canva-border bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/12 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-canva-purple/25"
                >
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${card.bar}`} />
                  {/* Top gradient wash */}
                  <div className={`absolute inset-x-0 top-0 h-36 bg-gradient-to-b ${card.glow}`} />
                  <div className="relative mb-7 flex items-start justify-between">
                    <div className={`rounded-2xl p-3 shadow-sm ${card.iconBg} ${card.accent}`}>
                      <Icon size={24} />
                    </div>
                    <span className="rounded-full border border-canva-border/60 bg-white/90 px-3 py-1 text-xs font-black text-canva-gray shadow-sm">
                      {card.stats}
                    </span>
                  </div>
                  <div className="relative">
                    <h3 className="text-lg font-black text-canva-ink">{card.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-7 text-canva-gray">{card.description}</p>
                    <div className="mt-5 mb-8 flex flex-wrap gap-2">
                      {card.chips.map((chip) => (
                        <span key={chip} className={`rounded-full px-3 py-1 text-xs font-bold ${card.chipStyle}`}>
                          #{chip}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span
                    className={`relative mt-auto flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold text-white shadow-md transition-all group-hover:shadow-lg ${card.button}`}
                  >
                    {card.action}
                    <ArrowRight size={16} />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
