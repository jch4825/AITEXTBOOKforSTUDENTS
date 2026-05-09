import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, PlayCircle, Clock, ArrowRight, Copy, Info, FileText, Lock, Check, School, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GoogleGenAI } from "@google/genai";
import { modules, lessons, Lesson } from '../data/tutorialData';
import { DiagnosticPurpose, Module, Persona } from '../types';
import { friendlyApiError } from '../utils/apiError';
import { getTheme } from '../utils/moduleThemes';
import SpeakButton from '../components/SpeakButton';
import { runWithGeminiModelFallback } from '../utils/gemini';
import PersonaRecommendCard from '../components/onboarding/PersonaRecommendCard';
import { getModuleVisibility } from '../data/moduleVisibility';
import { applyFontScale } from '../utils/a11y';
import { DIAGNOSTIC_STORAGE_KEYS, loadPersona } from '../hooks/useDiagnostic';
import {
  Lesson01Interactive,
  Lesson02Interactive,
  Lesson03Interactive,
  Lesson04Interactive,
  Lesson05Interactive,
  Lesson06Interactive
} from './Module0Components';
import {
  Lesson41Interactive,
  Lesson42Interactive,
  Lesson43Interactive,
  Lesson44Interactive,
  Lesson45Interactive,
  Lesson46Interactive,
  Lesson47Interactive,
  Lesson48Interactive
} from './Module4Components';
import {
  Lesson51Interactive,
  Lesson52Interactive,
  Lesson53Interactive,
  Lesson54Interactive,
  Lesson55Interactive,
  Lesson56Interactive,
  Lesson57Interactive
} from './Module5Components';

let module4PrinciplesShown = false;

const M0_WELCOME_KEY = 'ai-bridge-m0-welcome-shown';

function Module0WelcomePopup({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ backgroundColor: 'rgba(30, 20, 10, 0.65)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[520px] mx-auto px-7 py-12 sm:px-11"
          style={{
            background: 'linear-gradient(160deg, #f5e6c0 0%, #ede0b0 40%, #e8d8a0 70%, #f0e2b8 100%)',
            borderRadius: '4px',
            boxShadow: '0 0 0 1px #c8a96e, 0 0 0 4px #e8d8a0, 0 0 0 5px #b8945a, 0 8px 48px rgba(80,50,10,0.45), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(160,120,40,0.3)',
          }}
        >
          {/* 양피지 노이즈 질감 */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[4px] opacity-[0.18]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />

          {/* 상단 장식선 */}
          <div className="absolute top-[18px] left-[20px] right-[20px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #a07830, transparent)' }} />
          <div className="absolute top-[22px] left-[28px] right-[28px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #c8a050 60%, transparent)' }} />

          {/* 하단 장식선 */}
          <div className="absolute bottom-[18px] left-[20px] right-[20px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #a07830, transparent)' }} />
          <div className="absolute bottom-[22px] left-[28px] right-[28px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #c8a050 60%, transparent)' }} />

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
            style={{ color: '#8a6030', background: 'rgba(160,100,30,0.1)' }}
            aria-label="닫기"
          >
            <X size={15} />
          </button>

          {/* 본문 */}
          <div className="relative text-center">
            {/* 제목 */}
            <p
              className="font-serif mb-6 leading-snug"
              style={{ fontSize: '25px', color: '#4a2e0a', letterSpacing: '-0.01em' }}
            >
              선생님, 어서 오세요
            </p>

            {/* 구분 장식 */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, #b08040)' }} />
              <span style={{ fontSize: '14px', color: '#b08040' }}>✦</span>
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, #b08040, transparent)' }} />
            </div>

            {/* 본문 텍스트 */}
            <div className="text-center space-y-4 mb-8 font-serif" style={{ color: '#5a3a12', wordBreak: 'keep-all' }}>
              <p style={{ fontSize: '17px', lineHeight: '1.85' }}>
                살아온 모든 것이 이야기입니다.<br />
                가르쳐온 교실도, 걸어온 날들도.
              </p>
              <p style={{ fontSize: '17px', lineHeight: '1.85' }}>
                선생님은 지금 그 이야기의 새 챕터를 시작하려 하십니다.
              </p>
              <p style={{ fontSize: '17px', lineHeight: '1.85' }}>
                AI Bridge는 선생님이 AI와 함께 써내려갈 이야기의 첫 문장이 되고 싶습니다.
              </p>
              <p style={{ fontSize: '17px', lineHeight: '1.85' }}>
                선생님의 용기를 응원합니다.
              </p>
            </div>

            {/* 버튼 */}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 font-serif transition-all"
              style={{
                fontSize: '15px',
                color: '#3a2008',
                background: 'linear-gradient(135deg, #d4a84b 0%, #c49030 50%, #b87e20 100%)',
                padding: '11px 28px',
                borderRadius: '3px',
                boxShadow: '0 1px 0 rgba(255,255,255,0.3) inset, 0 2px 8px rgba(100,60,0,0.3)',
                letterSpacing: '0.02em',
                fontWeight: 600,
              }}
            >
              새 챕터를 시작합니다 →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const MODULE_COMPLETE_COPY: Record<string, { title: string; lines: string[]; button: string }> = {
  m0: {
    title: '첫 걸음을 내딛으셨습니다',
    lines: [
      '낯선 길 앞에서 선뜻 발을 내민다는 것,',
      '쉬운 일이 아닙니다.',
      '선생님은 오늘 그 일을 해내셨습니다.',
    ],
    button: '다음 챕터로',
  },
  m1: {
    title: 'AI의 언어를 읽기 시작하셨습니다',
    lines: [
      '어렵게 느껴졌던 개념들이 조금은 익숙해지셨을 것입니다.',
      '그 변화가 이미 대단한 성취입니다.',
    ],
    button: '계속 나아갑니다',
  },
  m2: {
    title: 'AI와 대화하는 법을 아십니다',
    lines: [
      '같은 질문도 어떻게 묻느냐에 따라 전혀 다른 답이 돌아온다는 것,',
      '선생님은 이제 그 비결을 갖고 계십니다.',
    ],
    button: '계속 나아갑니다',
  },
  m3: {
    title: '교실이 한 뼘 넓어졌습니다',
    lines: [
      '배운 것을 수업으로 옮기는 일은 용기가 필요한 일입니다.',
      '선생님은 그 용기를 보여주셨습니다.',
    ],
    button: '계속 나아갑니다',
  },
  m4: {
    title: '소중한 시간을 되찾으셨습니다',
    lines: [
      '반복되던 서류 작업이 조금 가벼워졌을 것입니다.',
      '그 시간만큼, 선생님은 더 중요한 것에 집중할 수 있게 되셨습니다.',
    ],
    button: '마지막 챕터로',
  },
  m5: {
    title: '이야기책이 완성되었습니다',
    lines: [
      '처음 AI 앞에서 느꼈던 막막함을 기억하시나요?',
      '그 자리에서 여기까지 오셨습니다.',
      '선생님의 이야기책, 정말 아름답습니다.',
    ],
    button: '더 멋진 챕터로 출발',
  },
};

function ModuleCompletePopup({ moduleId, onClose }: { moduleId: string; onClose: () => void }) {
  const copy = MODULE_COMPLETE_COPY[moduleId] ?? MODULE_COMPLETE_COPY['m1'];
  const isLast = moduleId === 'm5';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ backgroundColor: 'rgba(30, 20, 10, 0.65)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[520px] mx-auto px-7 py-12 sm:px-11"
          style={{
            background: 'linear-gradient(160deg, #f5e6c0 0%, #ede0b0 40%, #e8d8a0 70%, #f0e2b8 100%)',
            borderRadius: '4px',
            boxShadow: '0 0 0 1px #c8a96e, 0 0 0 4px #e8d8a0, 0 0 0 5px #b8945a, 0 8px 48px rgba(80,50,10,0.45), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(160,120,40,0.3)',
          }}
        >
          {/* 양피지 노이즈 질감 */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[4px] opacity-[0.18]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />

          {/* 상단 장식선 */}
          <div className="absolute top-[18px] left-[20px] right-[20px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #a07830, transparent)' }} />
          <div className="absolute top-[22px] left-[28px] right-[28px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #c8a050 60%, transparent)' }} />

          {/* 하단 장식선 */}
          <div className="absolute bottom-[18px] left-[20px] right-[20px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #a07830, transparent)' }} />
          <div className="absolute bottom-[22px] left-[28px] right-[28px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #c8a050 60%, transparent)' }} />

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
            style={{ color: '#8a6030', background: 'rgba(160,100,30,0.1)' }}
            aria-label="닫기"
          >
            <X size={15} />
          </button>

          <div className="relative text-center">
            {/* 완료 뱃지 */}
            <div className="mb-4 flex justify-center">
              <span style={{ fontSize: '32px' }}>{isLast ? '📖' : '✦'}</span>
            </div>

            {/* 제목 */}
            <p
              className="font-serif mb-6 leading-snug"
              style={{ fontSize: '25px', color: '#4a2e0a', letterSpacing: '-0.01em' }}
            >
              {copy.title}
            </p>

            {/* 구분 장식 */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, #b08040)' }} />
              <span style={{ fontSize: '14px', color: '#b08040' }}>✦</span>
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, #b08040, transparent)' }} />
            </div>

            {/* 본문 */}
            <div className="text-center space-y-3 mb-8 font-serif" style={{ color: '#5a3a12', wordBreak: 'keep-all' }}>
              {copy.lines.map((line, i) => (
                <p key={i} style={{ fontSize: '17px', lineHeight: '1.85' }}>{line}</p>
              ))}
            </div>

            {/* 버튼 */}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 font-serif transition-all"
              style={{
                fontSize: '15px',
                color: '#3a2008',
                background: 'linear-gradient(135deg, #d4a84b 0%, #c49030 50%, #b87e20 100%)',
                padding: '11px 28px',
                borderRadius: '3px',
                boxShadow: '0 1px 0 rgba(255,255,255,0.3) inset, 0 2px 8px rgba(100,60,0,0.3)',
                letterSpacing: '0.02em',
                fontWeight: 600,
              }}
            >
              {copy.button}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface LessonViewerProps {
  lesson: Lesson;
  onBack: () => void;
  onModuleComplete: () => void;
  onToggleComplete: (lessonId: string) => void;
  onMarkComplete: (lessonId: string) => void;
  isCompleted: boolean;
  onNavigateToLesson: (lessonId: string) => void;
  completedLessons: string[];
  onNavigateToNextModule?: () => void;
}

const LEARNING_POINTS: Record<string, string[]> = {
  'l1-4': [
    "**보안의 핵심:** API 키는 여러분의 인공지능 계정에 접속하는 '비밀번호'와 같습니다. 절대로 타인에게 공유하지 마세요.",
    "**비용 관리:** API 사용량에 따라 비용이 발생할 수 있으므로(무료 티어 제외), 사용량을 주기적으로 확인하는 습관이 필요합니다.",
    "**연결의 힘:** API를 활용하면 챗봇뿐만 아니라 엑셀, 구글 문서 등 다양한 도구에서 AI의 힘을 빌릴 수 있습니다.",
    "**API는 무엇:** API 키는 전자 출입증과 같습니다. API키를 통해 여러분이 누구인지 서버가 인식합니다.",
    "**무료 티어 활용:** Google AI Studio는 교육용으로 충분한 무료 한도를 제공하므로, 부담 없이 실습해볼 수 있습니다."
  ],
  'l1-5': [
    "**실시간 상호작용:** 지금 여러분은 API를 통해 전 세계에서 가장 강력한 AI 중 하나와 실시간으로 대화하고 있습니다.",
    "**프롬프트의 중요성:** 질문을 어떻게 하느냐에 따라 AI의 답변 품질이 달라집니다. 다음 모듈에서 이를 자세히 배울 예정입니다.",
    "**기술적 연결:** 여러분이 입력한 텍스트가 API를 통해 구글 서버로 전달되고, 다시 답변이 돌아오는 과정을 직접 체험하신 것입니다.",
    "**활용의 시작:** 이제 여러분은 자신만의 AI 도구를 만들 수 있는 첫 번째 열쇠(API 키)를 손에 넣으셨습니다.",
    "**데이터 보안:** API를 통한 대화는 학습에 사용되지 않도록 설정할 수 있어, 개인정보 보호 측면에서 유리할 수 있습니다."
  ],
  'default': [
    "**도구로서의 AI:** AI는 도구일 뿐입니다. 최종적인 판단과 책임은 항상 사용자(교사)에게 있음을 잊지 마세요.",
    "**구체적인 지시:** 프롬프트를 구체적으로 작성할수록 AI는 더 정확하고 유용한 답변을 제공합니다.",
    "**교차 검증 필수:** AI의 답변에는 '할루시네이션(환각)'이 있을 수 있으니, 중요한 정보는 반드시 교차 검증하세요.",
    "**개인정보 보호:** 인공지능에게 무심코 학생의 개인정보나 기밀을 넘기고 있지는 않나요?",
    "**지속적인 학습:** AI 기술은 빠르게 발전합니다. 새로운 기능과 업데이트 소식에 관심을 가져보세요."
  ]
};

type AiResponse = { type: 'compare'; before: string; after: string } | { type: 'text'; content: string } | string;
type L11TourStep = 'input' | 'reset' | 'run' | 'response' | 'complete' | 'next';
const L11_TOUR_DELAY_MS = 30000;

const L11_TOUR_COPY: Record<L11TourStep, string> = {
  input: '프롬프트 입력칸입니다. 이 칸은 타이핑을 지원합니다.',
  reset: '초기화 버튼은 입력과 답변을 처음 상태로 되돌립니다.',
  run: '실행 버튼을 누르면 아래 AI Response에 답변이 출력됩니다.',
  response: 'AI Response 영역입니다. 실행 결과가 이곳에 표시됩니다.',
  complete: '답변이 출력되면 학습 완료로 인식됩니다. 직접 완료 버튼을 눌러도 됩니다.',
  next: '다음 레슨 버튼으로 이어서 학습합니다.',
};

const LESSON_DIFFICULTY: Record<string, { label: string; className: string }> = {
  basic: {
    label: '기초',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  practice: {
    label: '실습',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  advanced: {
    label: '심화',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  caution: {
    label: '주의 필요',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

function getLessonDifficulty(lesson: Lesson) {
  if (lesson.moduleId === 'm1') {
    return lesson.id === 'l1-4' ? LESSON_DIFFICULTY.caution : LESSON_DIFFICULTY.basic;
  }

  if (lesson.moduleId === 'm0') {
    return LESSON_DIFFICULTY.basic;
  }

  if (lesson.moduleId === 'm2') {
    return ['l2-6', 'l2-7', 'l2-8'].includes(lesson.id)
      ? LESSON_DIFFICULTY.advanced
      : LESSON_DIFFICULTY.practice;
  }

  if (lesson.moduleId === 'm3') {
    return LESSON_DIFFICULTY.practice;
  }

  if (lesson.moduleId === 'm4') {
    return ['l4-5', 'l4-6', 'l4-7', 'l4-8'].includes(lesson.id)
      ? LESSON_DIFFICULTY.advanced
      : LESSON_DIFFICULTY.practice;
  }

  if (lesson.moduleId === 'm5') {
    return ['l5-1', 'l5-2', 'l5-3', 'l5-4', 'l5-6', 'l5-7'].includes(lesson.id)
      ? LESSON_DIFFICULTY.caution
      : LESSON_DIFFICULTY.practice;
  }

  return LESSON_DIFFICULTY.practice;
}

function LessonViewer({ lesson, onBack, onModuleComplete, onToggleComplete, onMarkComplete, isCompleted, onNavigateToLesson, completedLessons, onNavigateToNextModule }: LessonViewerProps) {
  const theme = getTheme(lesson.moduleId);
  const currentModule = modules.find(m => m.id === lesson.moduleId);
  const difficulty = getLessonDifficulty(lesson);
  const [userInput, setUserInput] = useState(lesson.interactive?.initialInput || '');
  const [aiResponse, setAiResponse] = useState<AiResponse>('');
  const aiResponseLessonRef = useRef<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [learningPoint, setLearningPoint] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(lesson.id === 'l0-1');
  const [hasApiKey, setHasApiKey] = useState(() => {
    const key = localStorage.getItem('gemini-api-key');
    return !!(key && key.length > 10);
  });
  const [metaPromptCopied, setMetaPromptCopied] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const [showDict, setShowDict] = useState(false);
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false);
  const [dictWord, setDictWord] = useState('');
  const [dictResult, setDictResult] = useState('');
  const [isDictLoading, setIsDictLoading] = useState(false);
  const [manualCompleteRequested, setManualCompleteRequested] = useState(false);
  const [showModuleComplete, setShowModuleComplete] = useState(false);
  const [l11TourStep, setL11TourStep] = useState<L11TourStep | null>(null);
  const [l11GuideStyle, setL11GuideStyle] = useState<React.CSSProperties>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runIdRef = useRef(0);
  const leftScrollRef = useRef<HTMLDivElement | null>(null);
  const l11InputRef = useRef<HTMLTextAreaElement | null>(null);
  const l11ResetRef = useRef<HTMLButtonElement | null>(null);
  const l11RunRef = useRef<HTMLButtonElement | null>(null);
  const l11ResponseRef = useRef<HTMLDivElement | null>(null);
  const l11CompleteRef = useRef<HTMLButtonElement | null>(null);
  const l11NextRef = useRef<HTMLButtonElement | null>(null);
  const isL11 = lesson.id === 'l1-1';
  const hasCompactM5InputPanel = lesson.id === 'l5-2' || lesson.id === 'l5-5';

  const l11TourClass = (step: L11TourStep) =>
    isL11 && l11TourStep === step ? 'l1-tour-highlight' : '';

  useEffect(() => {
    setManualCompleteRequested(false);
    setL11TourStep(null);
  }, [lesson.id]);

  useEffect(() => {
    const hasCompletionSignal = (!!aiResponse && !isTyping && aiResponseLessonRef.current === lesson.id) || manualCompleteRequested;
    if (!isCompleted && hasCompletionSignal) {
      onMarkComplete(lesson.id);
    }
  }, [
    aiResponse,
    isCompleted,
    isTyping,
    lesson.id,
    manualCompleteRequested,
    onMarkComplete,
  ]);

  useEffect(() => {
    if (!isL11 || !l11TourStep) return;

    const targetMap: Record<L11TourStep, React.RefObject<HTMLElement | null>> = {
      input: l11InputRef,
      reset: l11ResetRef,
      run: l11RunRef,
      response: l11ResponseRef,
      complete: l11CompleteRef,
      next: l11NextRef,
    };

    const target = targetMap[l11TourStep].current;
    if (!target) return;

    const positionGuide = () => {
      const rect = target.getBoundingClientRect();
      const margin = 12;
      const width = Math.min(window.innerWidth - margin * 2, 360);
      const guideHeight = 96;
      const top = rect.bottom + margin + guideHeight < window.innerHeight
        ? rect.bottom + margin
        : Math.max(margin, rect.top - guideHeight - margin);

      setL11GuideStyle({
        left: window.innerWidth < 768 ? margin : undefined,
        right: window.innerWidth < 768 ? margin : 24,
        top,
        width: window.innerWidth < 768 ? width : undefined,
        maxWidth: window.innerWidth < 768 ? undefined : 384,
      });
    };

    positionGuide();

    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      window.setTimeout(positionGuide, 350);
    });

    window.addEventListener('resize', positionGuide);
    window.addEventListener('scroll', positionGuide, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', positionGuide);
      window.removeEventListener('scroll', positionGuide, true);
    };
  }, [isL11, l11TourStep]);

  // 현재 모듈의 레슨 순서에서 다음 레슨 계산 (l1-4 숏컷 제외)
  const nextLesson = (() => {
    const moduleLessons = lessons
      .filter(l => l.moduleId === lesson.moduleId)
      .sort((a, b) => a.order - b.order);
    const currentIndex = moduleLessons.findIndex(l => l.id === lesson.id);
    return currentIndex >= 0 ? moduleLessons[currentIndex + 1] ?? null : null;
  })();

  // M4 Popup State
  const [m4PopupData, setM4PopupData] = useState<{title: string, content: React.ReactNode, point: string, hideDocsButton?: boolean} | null>(null);

  const handleM4Execute = (data: {title: string, content: React.ReactNode, point: string, hideDocsButton?: boolean}) => {
    setM4PopupData(data);
    if (!isCompleted) {
      onMarkComplete(lesson.id);
    }
  };

  const closeM4Popup = () => {
    setM4PopupData(null);
  };

  const completeAndContinue = () => {
    onMarkComplete(lesson.id);
    if (nextLesson) {
      onNavigateToLesson(nextLesson.id);
    } else {
      setShowModuleComplete(true);
    }
  };

  useEffect(() => {
    if (lesson.moduleId === 'm4' && !module4PrinciplesShown) {
      setShowOverlay(true);
    }
  }, [lesson.moduleId]);

  useEffect(() => {
    setShowWelcomePopup(lesson.id === 'l0-1');
  }, [lesson.id]);

  const handleCloseOverlay = () => {
    module4PrinciplesShown = true;
    setShowOverlay(false);
  };

  const DICT_SYSTEM_PROMPT = `너는 교사를 위한 AI·디지털 교육 용어 해설 전문가야. 초등 교사가 AI를 배우다가 모르는 단어나 개념을 물어보면 다음 형식으로 설명해.

## 한 줄 설명
교사가 바로 이해할 수 있는 쉬운 말 1~2문장.

## 학교에서 비유하면?
학교 현장이나 일상생활의 익숙한 것으로 비유. 1~2문장.

## 실제 예시
교사 업무나 수업에서 어떻게 쓰이는지 구체적인 예시 1~2개.

규칙: 전문 용어 최대한 피하기. 짧고 명확하게. 한국어로만.`;

  const handleDictSearch = async () => {
    if (!dictWord.trim() || isDictLoading) return;
    const apiKey = localStorage.getItem('gemini-api-key');
    if (!apiKey) {
      setDictResult('API 키가 필요합니다. [1-4. API 키 발급] 레슨에서 먼저 등록해 주세요.');
      return;
    }
    setIsDictLoading(true);
    setDictResult('');
    try {
      const ai = new GoogleGenAI({ apiKey });
      await runWithGeminiModelFallback(async (modelName) => {
        const response = await ai.models.generateContentStream({
          model: modelName,
          config: { systemInstruction: DICT_SYSTEM_PROMPT },
          contents: [{ role: 'user', parts: [{ text: `"${dictWord.trim()}"` }] }],
        });
        let accumulated = '';
        for await (const chunk of response) {
          accumulated += chunk.text ?? '';
          setDictResult(accumulated);
        }
      });
    } catch (err) {
      setDictResult(`오류가 발생했습니다: ${friendlyApiError(err)}`);
    } finally {
      setIsDictLoading(false);
    }
  };

  useEffect(() => {
    // Cancel any in-progress typing animation before switching lessons
    runIdRef.current++;
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const points = LEARNING_POINTS[lesson.id] || LEARNING_POINTS['default'];
    const randomPoint = points[Math.floor(Math.random() * points.length)];
    setLearningPoint(randomPoint);

    // Reset state when navigating to a different lesson
    setUserInput(lesson.interactive?.initialInput || '');
    setAiResponse('');
    aiResponseLessonRef.current = '';
    setIsTyping(false);

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      leftScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, [lesson.id, lesson.interactive?.initialInput]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      runIdRef.current++;
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleRun = async (forcedInput?: string) => {
    if (!lesson.interactive) return;
    const inputToUse = forcedInput !== undefined ? forcedInput : userInput;

    // Cancel any previous typing animation
    runIdRef.current++;
    const myRunId = runIdRef.current;
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsTyping(true);
    setAiResponse('');
    aiResponseLessonRef.current = lesson.id;

    // Helper: starts a character-by-character typing animation.
    // Cancels itself if a newer run has started (runIdRef > myRunId).
    const startTyping = (text: string, speed = 15) => {
      let i = 0;
      intervalRef.current = setInterval(() => {
        // Stale-run guard: stop if a newer handleRun or lesson change occurred
        if (myRunId !== runIdRef.current) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return;
        }
        if (i < text.length) {
          const char = text.charAt(i);
          if (char) setAiResponse(prev => (typeof prev === 'string' ? prev : '') + char);
          i++;
        }
        if (i >= text.length) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsTyping(false);
        }
      }, speed);
    };

    if (inputToUse.trim() === '') {
      startTyping('입력창에 내용을 작성해 주세요.');
      return;
    }

    // Special handling for lesson 1-4: Save API Key
    if (lesson.id === 'l1-4') {
      const apiKey = inputToUse.replace(/\s+/g, '');
      if (apiKey.startsWith('AIza') && apiKey.length >= 30) {
        localStorage.setItem('gemini-api-key', apiKey);
        setHasApiKey(true);
        // 사이드바·상단 네비 등 다른 곳의 hasApiKey 상태가 즉시 반영되도록
        window.dispatchEvent(new Event('api-key-changed'));
      }
    }

    // Special handling for lessons that call Gemini API
    if (lesson.id === 'l1-5' || lesson.interactive?.systemPrompt) {
      const savedKey = localStorage.getItem('gemini-api-key');
      let fullText = "";

      if (!savedKey || savedKey.length < 10) {
        if (lesson.interactive.simulationAnswer) {
          fullText = lesson.interactive.simulationAnswer;
        } else {
          fullText = "(API키가 제대로 작동하지 않아, default 답변을 생성합니다.) API키를 입력한 후 실습을 진행해 보세요.";
        }
      } else {
        // 모든 AI 답변에 공통 적용되는 가독성 포맷 규칙
        const FORMAT_RULE = "\n\n[형식 규칙] 가독성을 위해 ① 글자 색깔 변경(HTML 태그·인라인 스타일 포함)은 절대 사용하지 않습니다. ② 표(마크다운 테이블 포함)는 만들지 않습니다.";

        let systemInstruction = "";

        if (lesson.interactive.systemPrompt) {
          systemInstruction = lesson.interactive.systemPrompt + FORMAT_RULE;
        } else if (lesson.id === 'l1-5') {
          systemInstruction = "답변은 반드시 5줄 이내로 간결하게 작성해주세요." + FORMAT_RULE;
        }

        const callOnce = async () => {
          const ai = new GoogleGenAI({ apiKey: savedKey });
          return await runWithGeminiModelFallback(model =>
            ai.models.generateContent({
              model,
              contents: inputToUse,
              config: systemInstruction ? { systemInstruction } : undefined
            })
          );
        };

        // 신규 키 전파 지연(Google 측) 대응: API_KEY_INVALID 만 1회 자동 재시도
        const isPropagationError = (e: any) => {
          const msg = (e?.message ?? '').toString();
          return /API_KEY_INVALID|API key expired|API key not valid|key expired/i.test(msg);
        };

        try {
          let response;
          try {
            response = await callOnce();
          } catch (firstErr) {
            if (isPropagationError(firstErr)) {
              // 1.8초 대기 후 재시도 (Google 인증 서버 전파 시간)
              await new Promise(r => setTimeout(r, 1800));
              response = await callOnce();
            } else {
              throw firstErr;
            }
          }

          fullText = response.text?.trim() || "답변을 생성할 수 없습니다.";

          // Save l2-6 meta-prompt output so l3-8 can reuse it
          if (lesson.id === 'l2-6' && response.text) {
            try {
              localStorage.setItem('meta-prompt-l2-6', response.text);
            } catch {}
          }
        } catch (error: any) {
          console.error("Gemini API Error:", error);
          fullText = friendlyApiError(error);
        }
      }

      // Guard: if lesson changed while awaiting the API response, abort
      if (myRunId !== runIdRef.current) return;

      startTyping(fullText, 10);
      return;
    }

    // Determine the answer based on user input for dynamic lessons
    let fullText = lesson.interactive?.answer ?? '';
    if (lesson.interactive?.answers) {
      const trimmedInput = inputToUse.trim();
      // Case-insensitive check
      const matchedKey = Object.keys(lesson.interactive.answers).find(
        key => key.toLowerCase() === trimmedInput.toLowerCase()
      );
      if (matchedKey) {
        fullText = lesson.interactive.answers[matchedKey];
      } else if (lesson.interactive.answers["default"]) {
        fullText = lesson.interactive.answers["default"];
      } else {
        fullText = "정확한 값을 입력하거나 버튼을 클릭해주세요.";
      }
    }

    startTyping(fullText);
  };

  const advanceL11Tour = () => {
    if (!isL11 || !l11TourStep) return;

    if (l11TourStep === 'input') {
      setL11TourStep('reset');
      return;
    }

    if (l11TourStep === 'reset') {
      setL11TourStep('run');
      return;
    }

    if (l11TourStep === 'run') {
      handleRun();
      setL11TourStep('complete');
      return;
    }

    if (l11TourStep === 'complete') {
      setManualCompleteRequested(true);
      setL11TourStep('next');
      return;
    }

    if (l11TourStep === 'next') {
      setL11TourStep(null);
    }
  };

  useEffect(() => {
    if (!isL11 || !l11TourStep) return;
    const timer = window.setTimeout(advanceL11Tour, L11_TOUR_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isL11, l11TourStep]);

  return (
    <div
      className="flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 60% 50% at 100% 0%, ${theme.glowA}, transparent 60%), radial-gradient(ellipse 50% 50% at 0% 100%, ${theme.glowB}, transparent 60%), #0e1318`,
      }}
    >
      {showWelcomePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto"
          style={{ minHeight: '100vh', background: 'rgba(30, 20, 10, 0.72)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              fontSize: '16px',
              background: 'linear-gradient(160deg, #fdf6e3 0%, #f5e8c8 60%, #ede0b0 100%)',
              border: '2px solid #c8a96e',
              boxShadow: '0 0 0 6px #e8d5a0, 0 8px 40px rgba(80,50,10,0.35), inset 0 0 60px rgba(200,160,80,0.08)',
              maxWidth: 480,
              width: '100%',
              borderRadius: 4,
              padding: '40px 44px 36px',
              position: 'relative',
              fontFamily: '"Georgia", "Batang", serif',
            }}
          >
            {/* 모서리 장식 */}
            {(['top-left','top-right','bottom-left','bottom-right'] as const).map((pos) => (
              <span
                key={pos}
                style={{
                  position: 'absolute',
                  ...(pos.includes('top') ? { top: 8 } : { bottom: 8 }),
                  ...(pos.includes('left') ? { left: 8 } : { right: 8 }),
                  color: '#b8965a',
                  fontSize: 18,
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                ✦
              </span>
            ))}

            {/* 내부 이중 테두리 */}
            <div style={{
              border: '1px solid #c8a96e',
              borderRadius: 2,
              padding: '28px 24px 24px',
              position: 'relative',
            }}>
              {/* 제목 */}
              <h2 style={{
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 700,
                color: '#5c3d11',
                letterSpacing: '0.04em',
                marginBottom: 20,
                lineHeight: 1.5,
              }}>
                선생님의 방문을 진심으로 환영합니다.
              </h2>

              {/* 구분선 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #c8a96e)' }} />
                <span style={{ color: '#b8965a', fontSize: 14 }}>✦</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #c8a96e)' }} />
              </div>

              {/* 본문 */}
              <div style={{
                fontSize: '15px',
                color: '#4a3010',
                lineHeight: 1.95,
                textAlign: 'center',
                whiteSpace: 'pre-line',
              }}>
                {'모든 이야기는 첫 페이지에서 시작됩니다.\n지금 선생님이 바로 그 첫 페이지를 펼쳤습니다.'}
              </div>

              <div style={{
                margin: '18px 0',
                fontSize: '14px',
                color: '#6b4c1e',
                lineHeight: 2,
                textAlign: 'center',
                whiteSpace: 'pre-line',
                fontStyle: 'italic',
              }}>
                {'선생님이 만들어갈 이야기가 더욱 풍성해질 수 있도록,\nAI Bridge가 그 첫 문장을 함께 써내려가려고 합니다.'}
              </div>

              {/* 구분선 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 22px' }}>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #c8a96e)' }} />
                <span style={{ color: '#b8965a', fontSize: 14 }}>✦</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #c8a96e)' }} />
              </div>

              {/* 닫기 버튼 */}
              <button
                onClick={() => setShowWelcomePopup(false)}
                style={{
                  display: 'block',
                  margin: '0 auto',
                  padding: '9px 32px',
                  background: 'transparent',
                  border: '1.5px solid #b8965a',
                  borderRadius: 2,
                  color: '#5c3d11',
                  fontSize: '14px',
                  fontFamily: '"Georgia", "Batang", serif',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#c8a96e';
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#5c3d11';
                }}
              >
                시작하겠습니다
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 overflow-y-auto" style={{ minHeight: '100vh' }}>
          <div className="bg-white rounded-xl max-w-[480px] w-full p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 text-center flex-1">모듈 4를 시작하기 전에</h3>
              <SpeakButton
                text="모듈 4를 시작하기 전에. 첫째, 개인정보는 AI에 넣지 않습니다. 학생 이름, 주민번호, 연락처, 교사 인사 정보는 절대 AI에 입력하지 않고, 가명 혹은 익명화하여 사용합니다. 둘째, AI 결과물은 반드시 교사가 검토합니다. 공문, 가정통신문 등은 법적 효력이 발생할 수 있습니다. AI는 어디까지나 초안을 제시할 뿐 최종 책임은 작성자 본인에게 있습니다. 셋째, 학교 공식 시스템 연동은 승인이 필요합니다. 나이스나 업무관리시스템 등 학교 자체 공식망에 AI를 직접 연결하는 행위는 교육청 승인 없이 개인이 임의로 해선 안 됩니다."
                label="원칙 전체 듣기"
              />
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start p-4 border-b border-gray-100">
                <div className="text-2xl mt-1">🔒</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">개인정보는 AI에 넣지 않습니다</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">학생 이름·주민번호·연락처, 교사 인사 정보는 절대 AI에 입력하지 않고, 가명 혹은 익명화하여 사용합니다.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 border-b border-gray-100">
                <div className="text-2xl mt-1">✅</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">AI 결과물은 반드시 교사가 검토합니다</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">공문, 가정통신문 등은 법적 효력이 발생할 수 있습니다. AI는 어디까지나 초안을 제시할 뿐 최종 책임은 작성자 본인에게 있습니다.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 border-b border-gray-100">
                <div className="text-2xl mt-1"><School size={24} className="text-canva-purple" /></div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">학교 공식 시스템 연동은 승인이 필요합니다</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">나이스(NEIS)나 업무관리시스템 등 학교 자체 공식망에 AI를 직접 연결하는 행위는 교육청 승인 없이 개인이 임의로 해선 안 됩니다.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCloseOverlay}
              className="w-full mt-8 py-3 bg-canva-purple text-white font-bold rounded-lg hover:bg-opacity-90 transition-all text-sm"
            >
              확인했습니다
            </button>
          </div>
        </div>
      )}
      {/* Left Side (1 & 4): Explanation */}
      <div className="w-full lg:w-1/2 lg:border-r border-gray-800 flex flex-col bg-canva-ivory min-w-0 md:min-h-auto lg:h-full lg:overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pr-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center py-1">
              {(() => {
                let moduleLessons = lessons
                  .filter(l => l.moduleId === lesson.moduleId)
                  .sort((a, b) => a.order - b.order);

                if (lesson.moduleId === 'm2' || lesson.moduleId === 'm3' || lesson.moduleId === 'm5') {
                  const apiLesson = lessons.find(l => l.id === 'l1-4');
                  if (apiLesson) {
                    moduleLessons = [apiLesson, ...moduleLessons];
                  }
                }

                return moduleLessons.map((ml, idx) => {
                  const isCurrent = ml.id === lesson.id;
                  const isDone = completedLessons.includes(ml.id);
                  const isShortcut = ml.id === 'l1-4' && lesson.moduleId !== 'm1';
                  const filled = isCurrent || isDone;
                  return (
                    <React.Fragment key={ml.id}>
                      {idx > 0 && (
                        <div
                          className="w-3 h-px transition-colors"
                          style={{ backgroundColor: filled ? theme.accent + '60' : '#e5e7eb' }}
                        />
                      )}
                      <button
                        onClick={() => onNavigateToLesson(ml.id)}
                        title={ml.title}
                        className={`relative h-7 px-2.5 min-w-[2.25rem] rounded-full flex items-center justify-center gap-1 text-[10px] font-bold transition-all flex-shrink-0 ${
                          isCurrent ? 'text-white scale-105 shadow-md ring-2 ring-offset-1' :
                          isDone ? 'text-white hover:scale-105' :
                          'bg-white border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'
                        }`}
                        style={
                          isCurrent
                            ? { backgroundColor: theme.accent, boxShadow: `0 4px 14px ${theme.accentSoft}` }
                            : isDone
                              ? { backgroundColor: theme.accent + 'cc' }
                              : undefined
                        }
                      >
                        <span className="relative flex items-center gap-1">
                          {isShortcut ? (
                            <><Lock size={10} /> 1.4</>
                          ) : (
                            <>
                              {isDone && !isCurrent && <Check size={10} />}
                              {ml.id.replace('l', '').replace('-', '.')}
                            </>
                          )}
                        </span>
                      </button>
                    </React.Fragment>
                  );
                });
              })()}
              {onNavigateToNextModule && (() => {
                const currentIndex = modules.findIndex(m => m.id === lesson.moduleId);
                const nextModule = modules[currentIndex + 1];
                if (nextModule) {
                  return (
                    <React.Fragment>
                      <div className="w-3 h-px transition-colors ml-1" style={{ backgroundColor: '#e5e7eb' }} />
                      <button
                        onClick={onNavigateToNextModule}
                        title={`다음 모듈: ${nextModule.title}`}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors flex-shrink-0 ml-1"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </React.Fragment>
                  );
                }
                return null;
              })()}
            </div>
          </div>
          <span className="text-[10px] font-bold text-canva-purple uppercase tracking-widest flex-shrink-0 ml-2 hidden md:inline">Explanation</span>
          <button
            onClick={() => { setShowDict(true); setDictResult(''); setDictWord(''); }}
            className="hidden md:flex items-center gap-1.5 ml-auto mr-2 px-3 py-1.5 rounded-full bg-lime-600 hover:bg-lime-700 text-white text-[11px] font-bold shadow-sm hover:shadow-md transition-all shrink-0"
            title="모르는 단어를 쉽게 설명해 드립니다"
          >
            📖 단어 사전
          </button>
        </div>
        <div ref={leftScrollRef} className="flex-1 overflow-y-auto min-w-0 bg-canva-ivory relative">
          <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
          <div
            className={`relative px-5 lg:px-16 pt-10 pb-8 mb-2 overflow-hidden bg-gradient-to-br ${theme.gradient}`}
          >
            <div
              className="pointer-events-none absolute -top-10 -right-6 text-[160px] font-black select-none leading-none"
              style={{ color: theme.accent, opacity: 0.10 }}
            >
              {lesson.id.replace('l', '').replace('-', '.')}
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
              backgroundSize: '18px 18px',
            }} />
            <div className="relative" style={{ maxWidth: '40em' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{theme.emoji}</span>
                <span
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: theme.accent }}
                >
                  Module {currentModule?.order ?? '·'} · Lesson {lesson.order}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${difficulty.className}`}>
                  {difficulty.label}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-3xl font-bold text-canva-ink break-words flex-1 leading-tight">{lesson.title}</h2>
                <SpeakButton text={`${lesson.title}. ${lesson.content}`} label="레슨 본문 듣기" />
              </div>
              <div className="mt-5 h-1 w-16 rounded-full" style={{ backgroundColor: theme.accent }} />
            </div>
          </div>
          <div className="w-full px-5 lg:px-16 pb-20">
            <div className="markdown-container text-canva-ink leading-relaxed text-base">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, href, children, ...props }) => {
                    if (href && href.startsWith('#lesson:')) {
                      const lessonId = href.replace('#lesson:', '');
                      return (
                        <a
                          {...props}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigateToLesson(lessonId);
                          }}
                          className="text-canva-purple font-semibold hover:underline cursor-pointer"
                        >
                          {children}
                        </a>
                      );
                    }
                    return <a {...props} href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
                  },
                }}
              >
                {lesson.content.replace(/^[ \t]+/gm, '')}
              </ReactMarkdown>
            </div>
            {lesson.visuals && lesson.visuals.length > 0 && (
              <div className="mt-8 mb-8 space-y-4">
                {lesson.visuals.map((visual, index) => {
                  const visualSrc = visual.image.startsWith('/')
                    ? `${import.meta.env.BASE_URL}${visual.image.replace(/^\/+/, '')}`
                    : visual.image;

                  return (
                    <figure
                      key={`${lesson.id}-visual-${index}`}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                    >
                      <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-canva-purple">
                          Visual Aid
                        </div>
                        <div className="mt-1 text-sm font-semibold text-canva-ink">{visual.title}</div>
                      </div>
                      {imgErrors.has(`${lesson.id}-${index}`) ? (
                        <div className="flex flex-col items-center justify-center gap-3 bg-gray-50 px-6 py-10 text-center">
                          <div className="text-4xl">🖼️</div>
                          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">{visual.alt}</p>
                          <p className="text-[11px] text-gray-400">이미지를 준비 중입니다.</p>
                        </div>
                      ) : (
                        <a
                          href={visualSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                          title="새 창에서 이미지 보기"
                        >
                          <img
                            src={visualSrc}
                            alt={visual.alt}
                            className="block h-auto w-full object-cover transition-opacity hover:opacity-95"
                            loading="lazy"
                            onError={() => setImgErrors(prev => new Set(prev).add(`${lesson.id}-${index}`))}
                          />
                        </a>
                      )}
                      {visual.caption && (
                        <figcaption className="px-4 py-3 text-sm leading-relaxed text-gray-600">
                          {visual.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>
            )}
            <button
              onClick={() => { setShowDict(true); setDictResult(''); setDictWord(''); }}
              className="mt-5 mb-2 w-full flex items-center gap-3 pl-0 pr-4 py-0 rounded-xl overflow-hidden bg-lime-600 hover:bg-lime-700 text-left transition-all shadow-md hover:shadow-lg group"
            >
              <span className="flex items-center justify-center w-12 h-12 bg-lime-700 text-2xl shrink-0">📖</span>
              <span className="flex-1 text-xs text-white leading-snug py-3">
                <span className="font-bold text-sm block">단어가 어려우신가요?</span>
                <span className="text-lime-100">MCP, RAG, 에이전트… 모르는 용어는 쉬운 단어 사전에서 바로 찾아보세요.</span>
              </span>
              <span className="text-white/80 text-xs font-bold shrink-0 group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
            {lesson.tip && (
              <div className="mt-10 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl shadow-sm">
                <div className="flex items-center gap-2 mb-3 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-100 p-1.5 rounded-md">
                      <Info size={16} className="text-amber-600" />
                    </div>
                    <span className="text-sm font-bold text-amber-700">현명하게 활용하기</span>
                  </div>
                  <SpeakButton text={lesson.tip} label="팁 듣기" />
                </div>
                <p className="text-[13px] text-gray-800 leading-relaxed font-medium">
                  {lesson.tip}
                </p>
              </div>
            )}
          </div>
          
          {/* Technique Connection Feature (Spec Requirement) */}
          {lesson.technique && (
            <div className="sticky bottom-0 left-0 right-0 p-6 bg-canva-ivory border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-4">
                <div className="bg-canva-purple/10 text-canva-purple p-2 rounded-lg flex-shrink-0">
                  <Info size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-canva-ink mb-1">기법 연결: {lesson.technique.label}</h4>
                  <p className="text-xs text-canva-gray leading-relaxed">{lesson.technique.description}</p>
                </div>
                <SpeakButton text={`기법 연결 ${lesson.technique.label}. ${lesson.technique.description}`} label="기법 설명 듣기" />
              </div>
            </div>
          )}
        </motion.div>
        </AnimatePresence>
        </div>
      </div>

      {/* Right Side (2 & 3) */}
      <div className="w-full lg:w-1/2 flex flex-col lg:h-full lg:overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {/* Main interactive area: full height for m4, otherwise top half */}
          <div className={`flex flex-col border-gray-800 min-h-0 ${
            lesson.moduleId === 'm4'
              ? 'flex-1'
              : lesson.moduleId === 'm0'
              ? 'lg:flex-[7] lg:border-b md:flex-1'
              : hasCompactM5InputPanel
              ? 'lg:flex-[3.5] lg:border-b md:flex-1'
              : 'lg:flex-[3] lg:border-b md:flex-1'
          }`}>
            <div className="p-4 border-b border-gray-800 flex items-center justify-between shrink-0 hidden md:flex">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{lesson.moduleId === 'm0' ? '시뮬레이션' : '문제 입력'}</span>
              {(lesson.id === 'l1-5' || lesson.id === 'l2-6' || lesson.id === 'l2-7' || lesson.id === 'l2-8' || (lesson.moduleId === 'm3' && lesson.id !== 'l3-1') || lesson.id === 'l5-5') && (
                <div className="flex items-center gap-2">
                  <div className={`text-[10px] px-2 py-1 rounded-full font-bold ${hasApiKey ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {hasApiKey ? '● API 연결됨' : '○ API 키 미등록'}
                  </div>
                  {hasApiKey && (
                    <button
                      onClick={() => {
                        if (window.confirm('저장된 API 키를 삭제하시겠습니까?\n공용 PC에서는 사용 후 꼭 해제해 주세요.')) {
                          localStorage.removeItem('gemini-api-key');
                          setHasApiKey(false);
                          window.dispatchEvent(new Event('api-key-changed'));
                        }
                      }}
                      className="text-[10px] px-2 py-1 rounded-full font-bold border border-red-500/40 text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      연결 끊기
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className={`flex-1 ${lesson.moduleId === 'm0' ? 'p-2' : 'p-8 lg:pt-0'} flex flex-col overflow-y-auto no-scrollbar`}>
              {lesson.interactive ? (
                <>
                  {lesson.moduleId !== 'm4' && lesson.moduleId !== 'm0' && (
                    <div className="mb-6">
                      <span className="text-canva-teal font-bold text-sm mb-3 block">{lesson.interactive.prompt}</span>
                      <div className="bg-[#1c232b] rounded-xl p-5 border border-gray-800 text-gray-300 font-mono text-sm">
                        {lesson.id === 'l1-3' ? (
                          <div className="flex gap-4">
                            {['ChatGPT', 'Gemini', 'Claude'].map(model => (
                              <button
                                key={model}
                                disabled={isTyping}
                                onClick={() => {
                                  setUserInput(model);
                                  handleRun(model);
                                }}
                                className="px-4 py-2 bg-[#0e1318] hover:bg-canva-teal/20 border border-gray-700 rounded-lg text-canva-teal font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {model}
                              </button>
                            ))}
                          </div>
                        ) : lesson.interactive.predefinedInputs ? (
                          <div className="flex flex-col gap-3">
                            {lesson.interactive.predefinedInputs.map((input, idx) => (
                              <button
                                key={idx}
                                disabled={isTyping}
                                onClick={() => {
                                  setUserInput(input);
                                  handleRun(input);
                                }}
                                className="text-left px-4 py-3 bg-[#0e1318] hover:bg-canva-teal/20 border border-gray-700 rounded-lg text-canva-teal font-bold transition-all text-xs leading-relaxed disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {input}
                              </button>
                            ))}
                          </div>
                        ) : (
                          lesson.interactive.initialInput
                        )}
                      </div>
                    </div>
                  )}
                  {lesson.moduleId === 'm0' ? (
                    <>
                      {lesson.id === 'l0-1' && <Lesson01Interactive onComplete={() => onMarkComplete(lesson.id)} onContinue={completeAndContinue} isCompleted={isCompleted} />}
                      {lesson.id === 'l0-2' && <Lesson02Interactive onComplete={() => onMarkComplete(lesson.id)} onContinue={completeAndContinue} isCompleted={isCompleted} />}
                      {lesson.id === 'l0-3' && <Lesson03Interactive onComplete={() => onMarkComplete(lesson.id)} onContinue={completeAndContinue} isCompleted={isCompleted} />}
                      {lesson.id === 'l0-4' && <Lesson04Interactive onComplete={() => onMarkComplete(lesson.id)} onContinue={completeAndContinue} isCompleted={isCompleted} />}
                      {lesson.id === 'l0-5' && <Lesson05Interactive onComplete={() => onMarkComplete(lesson.id)} onContinue={completeAndContinue} isCompleted={isCompleted} />}
                      {lesson.id === 'l0-6' && <Lesson06Interactive onComplete={() => onMarkComplete(lesson.id)} onContinue={completeAndContinue} isCompleted={isCompleted} />}
                    </>
                  ) : lesson.moduleId === 'm4' ? (
                    <>
                      {lesson.id === 'l4-1' && <Lesson41Interactive onExecute={handleM4Execute} />}
                      {lesson.id === 'l4-2' && <Lesson42Interactive onExecute={handleM4Execute} />}
                      {lesson.id === 'l4-3' && <Lesson43Interactive onExecute={handleM4Execute} />}
                      {lesson.id === 'l4-4' && <Lesson44Interactive onExecute={handleM4Execute} />}
                      {lesson.id === 'l4-5' && <Lesson45Interactive onExecute={handleM4Execute} />}
                      {lesson.id === 'l4-6' && <Lesson47Interactive onExecute={handleM4Execute} />}
                      {lesson.id === 'l4-7' && <Lesson46Interactive onExecute={handleM4Execute} />}
                      {lesson.id === 'l4-8' && <Lesson48Interactive onExecute={handleM4Execute} />}
                    </>
                  ) : lesson.moduleId === 'm5' ? (
                    <>
                      {lesson.id === 'l5-1' && <Lesson51Interactive onComplete={() => onMarkComplete(lesson.id)} />}
                      {lesson.id === 'l5-2' && <Lesson52Interactive onComplete={() => onMarkComplete(lesson.id)} />}
                      {lesson.id === 'l5-3' && <Lesson53Interactive onComplete={() => onMarkComplete(lesson.id)} />}
                      {lesson.id === 'l5-4' && <Lesson54Interactive onComplete={() => onMarkComplete(lesson.id)} />}
                      {lesson.id === 'l5-5' && <Lesson55Interactive onRun={handleRun} setUserInput={setUserInput} onNavigateToLesson={onNavigateToLesson} />}
                      {/* l5-6 = AI Slop (Lesson57Interactive), l5-7 = 가이드라인 (Lesson56Interactive) — 원래 코드 만들 때 순서가 반대였어서 매핑이 cross-됨 */}
                      {lesson.id === 'l5-6' && <Lesson57Interactive onComplete={() => onMarkComplete(lesson.id)} />}
                      {lesson.id === 'l5-7' && <Lesson56Interactive onComplete={() => onMarkComplete(lesson.id)} />}
                    </>
                  ) : lesson.id !== 'l2-1' && lesson.id !== 'l2-2' && lesson.id !== 'l2-3' && lesson.id !== 'l2-4' && lesson.id !== 'l2-5' && lesson.id !== 'l3-1' && (
                    <div
                      className="flex-1 rounded-xl p-[1px] relative group min-h-[200px]"
                      style={{ background: `linear-gradient(135deg, ${theme.accent}55, transparent 40%, ${theme.accent}30)` }}
                    >
                    <div className="w-full h-full bg-[#1c232b] rounded-[11px] p-5 relative flex flex-col gap-4">
                      <textarea
                        ref={isL11 ? l11InputRef : undefined}
                        value={userInput}
                        onChange={(e) => {
                          setUserInput(e.target.value);
                          if (l11TourStep === 'input') setL11TourStep('reset');
                        }}
                        onFocus={() => {
                          if (l11TourStep === 'input') setL11TourStep('reset');
                        }}
                        className={`w-full flex-1 min-h-[150px] bg-transparent text-white font-mono text-sm outline-none resize-none ${l11TourClass('input')}`}
                        placeholder={
                          lesson.id === 'l1-1'
                            ? "위 문장을 따라 써보세요..."
                            : lesson.id === 'l1-5'
                            ? "아무런 질문이나 작성해 보세요..."
                            : lesson.id === 'l2-8'
                            ? "[상황] 학교 상황을 구체적으로 적어주세요.\n\n[역할] 특수교사, 행동중재 전문가, 학교장"
                            : "여기에 질문을 입력하거나 위 문장을 따라 써보세요..."
                        }
                      />
                      <div className="static flex gap-3 flex-wrap justify-end md:absolute md:bottom-5 md:right-5">
                        {lesson.id === 'l3-8' && localStorage.getItem('meta-prompt-l2-6') && (
                          <button
                            onClick={async () => {
                              const saved = localStorage.getItem('meta-prompt-l2-6') || '';
                              try {
                                await navigator.clipboard.writeText(saved);
                                setMetaPromptCopied(true);
                                setTimeout(() => setMetaPromptCopied(false), 2500);
                              } catch {
                                alert('클립보드 복사에 실패했습니다. 브라우저 권한을 확인해 주세요.');
                              }
                            }}
                            className="px-4 py-3 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-all shadow-lg"
                            title="2-6에서 생성한 메타 프롬프트를 클립보드에 복사합니다. Gems의 요청 사항 칸에 붙여넣으세요."
                          >
                            {metaPromptCopied ? '✓ 복사됨! Gems 요청 사항에 붙여넣기' : '2-6에서 만든 프롬프트 복사'}
                          </button>
                        )}
                        {(lesson.id === 'l2-6' || lesson.id === 'l2-7' || lesson.id === 'l2-8' || lesson.moduleId === 'm3') && (
                          <button
                            onClick={() => setShowApiKeyInfo(true)}
                            className="px-6 py-3 bg-canva-purple text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg"
                          >
                            API 키 입력
                          </button>
                        )}
                        <button
                          ref={isL11 ? l11ResetRef : undefined}
                          onClick={() => {
                            setUserInput(lesson.interactive?.initialInput || '');
                            setAiResponse('');
                            aiResponseLessonRef.current = '';
                            if (isL11 && l11TourStep === 'reset') setL11TourStep('run');
                          }}
                          disabled={isTyping}
                          className={`px-6 py-3 bg-gray-700 text-white rounded-xl font-bold text-sm hover:bg-gray-600 transition-all disabled:opacity-50 shadow-lg ${l11TourClass('reset')}`}
                        >
                          초기화
                        </button>
                        <button
                          ref={isL11 ? l11RunRef : undefined}
                          onClick={() => {
                            if (isL11 && !l11TourStep) {
                              setL11TourStep('input');
                              return;
                            }
                            if (isL11 && l11TourStep === 'run') {
                              handleRun();
                              setL11TourStep('complete');
                              return;
                            }
                            if (isL11 && l11TourStep) return;
                            handleRun();
                          }}
                          disabled={isTyping}
                          className={`px-8 py-3 bg-canva-teal text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-teal-900/20 ${l11TourClass('run')}`}
                        >
                          실행 (Run)
                        </button>
                      </div>
                    </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 italic">
                  이 레슨은 실습이 포함되어 있지 않습니다.
                </div>
              )}
            </div>
          </div>

          {/* AI Response area (Hidden for M4 because it uses popup, hidden for M0 because it uses SimWizard) */}
          {lesson.moduleId !== 'm4' && lesson.moduleId !== 'm0' && (
            <div className={`${hasCompactM5InputPanel ? 'lg:flex-[1.75] max-h-[220px]' : 'lg:flex-[2]'} flex flex-col min-h-0 md:hidden lg:flex border-t border-gray-800`}>
              <div className="p-4 border-b border-gray-800 flex items-center justify-center shrink-0 hidden md:flex">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">답변 안내</span>
              </div>
              <div className={`${lesson.moduleId === 'm0' ? 'p-3' : hasCompactM5InputPanel ? 'px-8 py-4' : 'p-8'} flex-1 overflow-y-auto overflow-x-hidden no-scrollbar min-w-0`}>
                <div
                  className={`${lesson.moduleId === 'm0' ? 'min-h-[125px]' : hasCompactM5InputPanel ? 'min-h-[110px]' : 'min-h-[160px]'} rounded-xl p-[1px] relative`}
                  style={{ background: `linear-gradient(135deg, ${theme.accent}55, transparent 45%, ${theme.accent}25)` }}
                >
                <div
                  ref={isL11 ? l11ResponseRef : undefined}
                  className={`${lesson.moduleId === 'm0' ? 'p-3' : hasCompactM5InputPanel ? 'p-4' : 'p-8'} bg-[#1c232b] rounded-[11px] relative ${l11TourClass('response')}`}
                >
                  <div className={`flex items-center justify-between ${lesson.moduleId === 'm0' ? 'mb-1' : hasCompactM5InputPanel ? 'mb-3' : 'mb-5'}`}>
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span
                          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <span
                          className="relative inline-flex rounded-full h-2.5 w-2.5"
                          style={{ backgroundColor: theme.accent }}
                        />
                      </span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: theme.accent }}
                      >AI Response</span>
                      {lesson.id !== 'l2-1' && (
                        <span className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(to right, ${theme.accent}80, transparent)` }} />
                      )}
                    </div>
                    {(lesson.id === 'l2-6' || lesson.id === 'l2-7' || (lesson.moduleId === 'm3' && lesson.id !== 'l3-1') || lesson.id === 'l4-1' || lesson.id === 'l4-2' || lesson.id === 'l5-5') && aiResponse && !isTyping && (
                      <button
                        onClick={async () => {
                          if (!localStorage.getItem('gemini-api-key')) {
                            alert('구글 Docs 문서로 내보낼 수 없습니다.\n\n이유: 사용자의 API 키가 저장되어 있지 않습니다. [1-4. API 키 발급 및 입력] 레슨에서 API 키를 먼저 등록해주세요.');
                            return;
                          }

                          try {
                            await navigator.clipboard.writeText(typeof aiResponse === 'string' ? aiResponse : '');
                            window.open('https://docs.new', '_blank');
                          } catch (err) {
                            alert('클립보드 자동 복사에 실패했습니다. 수동으로 텍스트를 복사해주세요.');
                          }
                        }}
                        className="text-xs text-white hover:bg-blue-600 transition-colors flex items-center gap-1 bg-blue-500 px-3 py-1.5 rounded-lg font-medium shadow-sm"
                      >
                        <FileText size={14} /> 구글Docs에 ctrl+v 하세요.
                      </button>
                    )}
                  </div>
                  <div className={`${lesson.moduleId === 'm0' ? 'text-[11px]' : 'text-sm'} text-gray-300 font-mono leading-relaxed markdown-container dark-markdown ${lesson.id === 'l2-1' ? 'no-response-underlines' : ''}`}>
                    {typeof aiResponse === 'object' && aiResponse?.type === 'compare' ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex-1 border border-gray-700 bg-gray-800 rounded-lg p-3 relative">
                          <pre className="text-xs text-gray-400 whitespace-pre-wrap">{aiResponse.before}</pre>
                        </div>
                        <div className="flex-1 border border-canva-teal/50 bg-canva-teal/10 rounded-lg p-3 relative">
                          <pre className="text-xs text-gray-200 whitespace-pre-wrap">{aiResponse.after}</pre>
                        </div>
                      </div>
                    ) : typeof aiResponse === 'object' && aiResponse?.type === 'text' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                        }}
                      >
                        {aiResponse.content}
                      </ReactMarkdown>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                        }}
                      >
                        {aiResponse as string}
                      </ReactMarkdown>
                    )}
                    {isTyping && <span className="inline-block w-2 h-4 bg-canva-teal ml-1 animate-pulse"></span>}
                    {!aiResponse && !isTyping && (
                      <span className="text-gray-400 italic">
                        {lesson.interactive?.answer || '실행 버튼을 눌러 AI의 답변을 확인하세요.'}
                      </span>
                    )}
                  </div>
                </div>
                </div>

                {aiResponse && !isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-canva-purple/10 border border-canva-purple/20 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-white font-bold text-xs uppercase tracking-wider">학습 포인트</h5>
                      <SpeakButton text={learningPoint} label="학습 포인트 듣기" />
                    </div>
                    <div className="text-sm text-white leading-relaxed markdown-container dark-markdown white-markdown">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                        }}
                      >
                        {learningPoint}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation / Completion Buttons */}
        <div className={`sticky bottom-0 p-6 border-t border-gray-800 flex justify-end gap-3 bg-[#0e1318] shrink-0 ${isL11 && (l11TourStep === 'complete' || l11TourStep === 'next') ? 'z-[65]' : 'z-10'}`}>
          <button
            ref={isL11 ? l11CompleteRef : undefined}
            onClick={() => {
              setManualCompleteRequested(true);
              if (isL11 && l11TourStep === 'complete') setL11TourStep('next');
            }}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isCompleted
                ? 'bg-canva-teal text-white'
                : 'bg-canva-purple text-white hover:bg-opacity-90'
            } ${l11TourClass('complete')}`}
          >
            {isCompleted ? (
              <><CheckCircle2 size={18} /> 학습 완료됨</>
            ) : (
              '학습 완료하기'
            )}
          </button>
          <button
            ref={isL11 ? l11NextRef : undefined}
            onClick={() => {
              if (!isCompleted && ((!!aiResponse && !isTyping) || manualCompleteRequested)) {
                onMarkComplete(lesson.id);
              }
              if (nextLesson) {
                onNavigateToLesson(nextLesson.id);
              } else {
                setShowModuleComplete(true);
              }
            }}
            className={`px-6 py-3 bg-gray-800 text-white rounded-xl font-bold text-sm hover:bg-gray-700 transition-all flex items-center gap-2 ${l11TourClass('next')}`}
          >
            {nextLesson ? <><span>다음 레슨</span><ArrowRight size={18} /></> : <><span>모듈 완료</span><CheckCircle2 size={18} /></>}
          </button>
        </div>
      </div>

      {isL11 && l11TourStep && (
        <>
          <div className="pointer-events-none fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]" />
          <div
            className="pointer-events-none fixed z-[70]"
            style={l11GuideStyle}
          >
            <div className="rounded-xl border border-canva-teal/50 bg-[#0e1318]/95 px-4 py-3 text-sm font-bold leading-relaxed text-white shadow-2xl shadow-canva-teal/20">
              <div className="mb-1 text-[10px] uppercase tracking-widest text-canva-teal">
                L1-1 Guide
              </div>
              {L11_TOUR_COPY[l11TourStep]}
            </div>
          </div>
        </>
      )}

      {/* M4 Result Popup Overlay */}
      {m4PopupData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" style={{ minHeight: '100vh' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full bg-[#1c232b] rounded-2xl shadow-2xl flex flex-col border border-gray-700 my-auto shadow-canva-purple/10"
          >
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-2xl">✨</span> {m4PopupData.title}
              </h3>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh] no-scrollbar">
              {typeof m4PopupData.content === 'string' ? (
                <div className="relative">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {!m4PopupData.hideDocsButton && (
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(m4PopupData.content as string);
                            window.open('https://docs.new', '_blank');
                          } catch (err) {
                            alert('클립보드 자동 복사에 실패했습니다. 수동으로 텍스트를 복사해주세요.');
                          }
                        }}
                        className="text-xs text-white hover:bg-blue-600 transition-colors flex items-center gap-1 bg-blue-500 px-3 py-1.5 rounded-lg font-medium shadow-sm"
                      >
                        <FileText size={14} /> 구글Docs에 ctrl+v 하세요.
                      </button>
                    )}
                    <div className="text-gray-400 hover:text-white cursor-pointer px-2 py-1.5 bg-[#0e1318] hover:bg-gray-800 transition-colors rounded-lg flex items-center justify-center border border-gray-700" onClick={() => navigator.clipboard.writeText(m4PopupData.content as string)} title="클립보드에 복사">
                      <Copy size={16} />
                    </div>
                  </div>
                  <pre className={`text-sm text-gray-300 font-mono whitespace-pre-wrap bg-[#0e1318] p-6 ${!m4PopupData.hideDocsButton ? 'pt-14' : 'pt-14'} rounded-xl border border-gray-800 leading-relaxed max-w-full`}>
                    {m4PopupData.content}
                  </pre>
                </div>
              ) : (
                m4PopupData.content
              )}
              
              <div className="mt-8 bg-canva-purple/10 border border-canva-purple/20 p-5 rounded-xl flex gap-4 items-start">
                <div className="text-xl mt-1">💡</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-bold text-sm">학습 포인트</h4>
                    <SpeakButton text={m4PopupData.point} label="학습 포인트 듣기" />
                  </div>
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{m4PopupData.point}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-800 bg-[#141a21] rounded-b-2xl">
              <button
                onClick={closeM4Popup}
                className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all shadow-lg text-lg flex items-center justify-center gap-2"
              >
                창 닫기
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 모듈 완료 팝업 */}
      {showModuleComplete && (
        <ModuleCompletePopup
          moduleId={lesson.moduleId}
          onClose={() => {
            setShowModuleComplete(false);
            onModuleComplete();
          }}
        />
      )}

      {/* 단어 사전 모달 */}
      {showDict && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowDict(false); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
            style={{ maxHeight: '85vh' }}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
              <span className="text-xl">📖</span>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-sm">쉬운 단어 사전</div>
                <div className="text-[11px] text-gray-400">모르는 AI·디지털 용어를 쉽게 풀어드립니다</div>
              </div>
              <button onClick={() => setShowDict(false)} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-gray-100 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dictWord}
                  onChange={e => setDictWord(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleDictSearch()}
                  placeholder="예) MCP, 에이전트, RAG, API, 바이브코딩…"
                  autoFocus
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-lime-400 placeholder-gray-400"
                />
                <button
                  onClick={handleDictSearch}
                  disabled={isDictLoading || !dictWord.trim()}
                  className="px-4 py-2 bg-lime-600 hover:bg-lime-700 disabled:opacity-40 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  {isDictLoading ? '…' : '찾기'}
                </button>
              </div>
              {!hasApiKey && (
                <p className="mt-2 text-[11px] text-amber-600">
                  ⚠️ API 키가 없으면 검색이 안 됩니다.{' '}
                  <button
                    onClick={() => { setShowDict(false); onNavigateToLesson('l1-4'); }}
                    className="underline font-bold"
                  >
                    1-4에서 등록하기
                  </button>
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {isDictLoading && !dictResult && (
                <div className="flex items-center gap-2 text-lime-600 text-sm">
                  <span className="animate-spin inline-block">⟳</span> 설명을 생성하고 있습니다…
                </div>
              )}
              {dictResult ? (
                <div className="markdown-container text-sm text-gray-700 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{dictResult}</ReactMarkdown>
                </div>
              ) : !isDictLoading && (
                <div className="text-center text-gray-400 text-sm py-8">
                  <div className="text-3xl mb-2">🔍</div>
                  단어를 입력하고 찾기를 눌러보세요
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 shrink-0 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">AI 설명은 참고용입니다. 중요한 내용은 교차 확인하세요.</span>
              <button onClick={() => setShowDict(false)} className="text-xs text-gray-500 hover:text-gray-700 font-medium">닫기</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

interface TutorialProps {
  selectedModule: Module | null;
  onSelectModule: (module: Module | null) => void;
  completedLessons: string[];
  onToggleComplete: (lessonId: string) => void;
  onMarkComplete: (lessonId: string) => void;
  onOpenTools: () => void;
}

export default function Tutorial({ selectedModule, onSelectModule, completedLessons, onToggleComplete, onMarkComplete, onOpenTools }: TutorialProps) {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [showM0Welcome, setShowM0Welcome] = useState(false);
  const [persona, setPersona] = useState<Persona | null>(() => loadPersona());
  const [purpose, setPurpose] = useState<DiagnosticPurpose | null>(() => {
    try {
      const value = localStorage.getItem(DIAGNOSTIC_STORAGE_KEYS.purpose);
      return value === 'class' || value === 'admin' || value === 'share' || value === 'ethics' || value === 'explore' ? value : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const refresh = () => {
      setPersona(loadPersona());
      const value = localStorage.getItem(DIAGNOSTIC_STORAGE_KEYS.purpose);
      setPurpose(value === 'class' || value === 'admin' || value === 'share' || value === 'ethics' || value === 'explore' ? value : null);
    };
    window.addEventListener('storage', refresh);
    window.addEventListener('ai-bridge-persona-changed', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('ai-bridge-persona-changed', refresh);
    };
  }, []);

  useEffect(() => {
    if (!currentLesson) return;
    if (currentLesson.moduleId === 'm0') {
      applyFontScale('large');
      window.dispatchEvent(new StorageEvent('storage', { key: 'ai-bridge-font-scale', newValue: 'large' }));
    }
  }, [currentLesson?.moduleId]);

  // URL 파라미터에서 레슨 ID를 읽어서 초기화
  useEffect(() => {
    if (initialLoadDone) return;

    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lesson');

    if (lessonId) {
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson) {
        const module = modules.find(m => m.id === lesson.moduleId);
        if (module && getModuleVisibility(loadPersona(), module.id) !== 'hidden') {
          onSelectModule(module);
          setCurrentLesson(lesson);
        }
      }
    }

    setInitialLoadDone(true);
  }, [initialLoadDone, onSelectModule]);

  // 사이드바에서 모듈이 바뀌면 현재 레슨 초기화
  useEffect(() => {
    if (!initialLoadDone) return;

    // 초기 로딩으로 인해 App.tsx의 selectedModule이 뒤늦게 업데이트되었을 때
    // 화면이 튕기는 현상 방지
    if (currentLesson && selectedModule?.id === currentLesson.moduleId) {
      return;
    }

    setCurrentLesson(null);
  }, [selectedModule?.id, initialLoadDone]);

  // 모듈0 첫 진입 시 환영 팝업
  useEffect(() => {
    if (selectedModule?.id !== 'm0') return;
    if (localStorage.getItem(M0_WELCOME_KEY)) return;
    setShowM0Welcome(true);
  }, [selectedModule?.id]);

  const toggleComplete = onToggleComplete;
  const markComplete = onMarkComplete;

  const renderModuleList = () => (
    <div className="max-w-4xl mx-auto p-10">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-canva-ink mb-4">인공지능 배워보기</h1>
        <p className="text-canva-ink">LLM 이해부터 윤리 점검까지, 초등교사를 위한 5단계 로드맵입니다.</p>
      </header>

      {persona && purpose && (
        <div className="mb-8">
          <PersonaRecommendCard
            persona={persona}
            purpose={purpose}
            onStartModule={(moduleId) => {
              const module = modules.find(item => item.id === moduleId);
              if (module) onSelectModule(module);
            }}
            onOpenTools={onOpenTools}
          />
        </div>
      )}

      <div className="space-y-5">
        {modules.map((module, index) => {
          const moduleLessons = lessons.filter(l => l.moduleId === module.id);
          const completedInModule = moduleLessons.filter(l => completedLessons.includes(l.id)).length;
          const isCompleted = completedInModule === module.lessonsCount && module.lessonsCount > 0;
          const progressPct = module.lessonsCount ? (completedInModule / module.lessonsCount) * 100 : 0;
          const theme = getTheme(module.id);
          const visibility = getModuleVisibility(persona, module.id);
          if (visibility === 'hidden') return null;
          const isRecommended = visibility === 'recommended';
          const isCollapsed = visibility === 'collapsed';

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => onSelectModule(module)}
              className={`bg-white border rounded-2xl overflow-hidden cursor-pointer group flex transition-shadow hover:shadow-xl ${
                isRecommended
                  ? 'border-canva-teal shadow-md shadow-cyan-900/5'
                  : isCollapsed
                    ? 'border-canva-border opacity-55'
                    : 'border-canva-border'
              }`}
              style={{ ['--accent' as any]: theme.accent } as React.CSSProperties}
            >
              {/* Left colored panel (1/4) */}
              <div
                className={`relative w-1/4 min-w-[140px] p-5 flex flex-col justify-between bg-gradient-to-br ${theme.gradient} overflow-hidden`}
              >
                <div
                  className="pointer-events-none absolute -bottom-6 -right-2 text-[110px] font-black select-none leading-none"
                  style={{ color: theme.accent, opacity: 0.18 }}
                >
                  {module.order}
                </div>
                <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
                  backgroundSize: '14px 14px',
                }} />
                <div className="relative flex items-center gap-2">
                  <span className="text-2xl">{theme.emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.accent }}>
                    Module {module.order}
                  </span>
                  {isRecommended && (
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-canva-teal">
                      추천
                    </span>
                  )}
                </div>
                <div className="relative">
                  {isCompleted ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 text-[10px] font-bold" style={{ color: theme.accent }}>
                      <CheckCircle2 size={12} /> 완료
                    </div>
                  ) : completedInModule > 0 ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 text-[10px] font-bold" style={{ color: theme.accent }}>
                      진행 중 · {completedInModule}/{module.lessonsCount}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 text-[10px] font-bold text-canva-gray">
                      시작 전
                    </div>
                  )}
                </div>
              </div>

              {/* Right content panel (2/3) */}
              <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
                <div>
                  <h3
                    className="text-lg font-bold text-canva-ink mb-1.5 leading-snug transition-colors"
                    style={{ color: undefined }}
                  >
                    <span className="group-hover:opacity-80 transition-opacity">{module.title}</span>
                  </h3>
                  <p className="text-sm text-canva-gray leading-relaxed">{module.description}</p>
                  <div className="mt-2" onClick={e => e.stopPropagation()}>
                    <SpeakButton
                      text={`${module.title}. ${module.description}`}
                      label="모듈 설명 듣기"
                      stopPropagation
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] font-bold text-canva-gray uppercase flex items-center gap-1">
                        <BookOpen size={12} /> {module.lessonsCount} 레슨
                      </span>
                      <span className="text-[11px] font-bold text-canva-gray uppercase flex items-center gap-1">
                        <Clock size={12} /> {module.estimatedTime}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.08 + 0.2 }}
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                  </div>
                  <ChevronRight
                    className="group-hover:translate-x-1 transition-transform flex-shrink-0"
                    style={{ color: theme.accent }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderLessonList = (module: Module) => {
    const moduleLessons = lessons.filter(l => l.moduleId === module.id).sort((a, b) => a.order - b.order);
    const theme = getTheme(module.id);
    const completedCount = moduleLessons.filter(l => completedLessons.includes(l.id)).length;
    const progressPct = moduleLessons.length ? (completedCount / moduleLessons.length) * 100 : 0;

    const getPreview = (content: string) => {
      const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
      const firstProse = lines.find(l => !l.startsWith('#') && !l.startsWith('-') && !l.startsWith('*') && !l.startsWith('>') && !l.startsWith('!'));
      if (!firstProse) return '';
      const cleaned = firstProse.replace(/\*\*/g, '').replace(/`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      return cleaned.length > 90 ? cleaned.slice(0, 90).trim() + '…' : cleaned;
    };

    return (
      <div className="max-w-4xl mx-auto p-10">
        <button
          onClick={() => onSelectModule(null)}
          className="flex items-center gap-2 text-canva-gray hover:text-canva-ink mb-8 font-bold text-sm transition-colors"
        >
          <ArrowLeft size={16} /> 모듈 목록으로 돌아가기
        </button>

        <header
          className={`relative mb-12 p-8 rounded-2xl bg-gradient-to-br ${theme.gradient} overflow-hidden border border-gray-100`}
        >
          <div
            className="pointer-events-none absolute -top-8 -right-4 text-[140px] font-black select-none leading-none"
            style={{ color: theme.accent, opacity: 0.10 }}
          >
            {module.order}
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
            backgroundSize: '18px 18px',
          }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{theme.emoji}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: theme.accent }}>
                Module {module.order}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-canva-ink mb-3 leading-tight">{module.title}</h1>
            <p className="text-canva-gray mb-4 max-w-2xl">{module.description}</p>
            <SpeakButton text={`${module.title}. ${module.description}`} label="모듈 설명 듣기" />
            {moduleLessons.length > 0 && (
              <div className="mt-6 max-w-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-canva-ink/70">진행도</span>
                  <span className="text-xs font-bold" style={{ color: theme.accent }}>
                    {completedCount} / {moduleLessons.length}
                  </span>
                </div>
                <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
              </div>
            )}
          </div>
        </header>

        {moduleLessons.length > 0 ? (
          <div className="relative pl-14">
            <div
              className="absolute left-[22px] top-4 bottom-4 w-0.5 rounded-full"
              style={{ background: `linear-gradient(to bottom, ${theme.accent}55, ${theme.accent}10)` }}
            />
            <div className="space-y-4">
              {moduleLessons.map((lesson, idx) => {
                const isDone = completedLessons.includes(lesson.id);
                const preview = getPreview(lesson.content);
                const lessonNum = lesson.id.replace('l', '').replace('-', '.');
                const titleNoNum = lesson.title.replace(/^\d+-\d+\.\s*/, '');
                const difficulty = getLessonDifficulty(lesson);
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    className="relative group"
                  >
                    <div
                      className="absolute -left-[46px] top-5 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-transform group-hover:scale-110"
                      style={
                        isDone
                          ? { backgroundColor: theme.accent, color: 'white', boxShadow: `0 0 0 4px var(--color-canva-bg, #f7f5fb)` }
                          : { backgroundColor: 'white', border: `2px solid ${theme.accent}55`, color: theme.accent, boxShadow: `0 0 0 4px var(--color-canva-bg, #f7f5fb)` }
                      }
                    >
                      {isDone ? <CheckCircle2 size={18} /> : lesson.order}
                    </div>

                    <div
                      onClick={() => setCurrentLesson(lesson)}
                      className="bg-white border border-canva-border rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
                      style={{ borderLeft: `3px solid ${theme.accent}` }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: theme.accent }}
                            >
                              Lesson {lessonNum}
                            </span>
                            {isDone && (
                              <span className="text-[10px] font-bold text-canva-teal flex items-center gap-1">
                                <CheckCircle2 size={10} /> 완료
                              </span>
                            )}
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${difficulty.className}`}>
                              {difficulty.label}
                            </span>
                          </div>
                          <h3 className="font-bold text-canva-ink mb-1.5 leading-snug group-hover:opacity-80 transition-opacity">
                            {titleNoNum}
                          </h3>
                          {preview && (
                            <p className="text-xs text-canva-gray leading-relaxed line-clamp-2">{preview}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0 pt-0.5">
                          <span className="text-[11px] text-canva-gray font-medium flex items-center gap-1 whitespace-nowrap">
                            <Clock size={11} /> {lesson.estimatedMinutes}분
                          </span>
                          <ChevronRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                            style={{ color: theme.accent }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-canva-bg rounded-2xl border border-dashed border-canva-border">
            <p className="text-canva-gray">이 모듈의 레슨은 준비 중입니다.</p>
          </div>
        )}
      </div>
    );
  };


  const handleM0WelcomeClose = () => {
    localStorage.setItem(M0_WELCOME_KEY, '1');
    setShowM0Welcome(false);
  };

  return (
    <div className="min-h-screen bg-canva-bg">
      {showM0Welcome && <Module0WelcomePopup onClose={handleM0WelcomeClose} />}
      <AnimatePresence mode="wait">
        {currentLesson ? (
          <motion.div
            key={currentLesson.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <LessonViewer
              lesson={currentLesson}
              onBack={() => setCurrentLesson(null)}
              onModuleComplete={() => {
                setCurrentLesson(null);
                onSelectModule(null);
              }}
              onToggleComplete={toggleComplete}
              onMarkComplete={markComplete}
              isCompleted={completedLessons.includes(currentLesson.id)}
              completedLessons={completedLessons}
              onNavigateToLesson={(id) => {
                const lesson = lessons.find(l => l.id === id);
                if (lesson) {
                  setCurrentLesson(lesson);
                }
              }}
              onNavigateToNextModule={() => {
                const currentIndex = modules.findIndex(m => m.id === currentLesson.moduleId);
                const nextModule = modules[currentIndex + 1];
                if (nextModule) {
                  setCurrentLesson(null);
                  onSelectModule(nextModule);
                }
              }}
            />
          </motion.div>
        ) : selectedModule ? (
          <motion.div
            key="lessons"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderLessonList(selectedModule)}
          </motion.div>
        ) : (
          <motion.div
            key="modules"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {renderModuleList()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
