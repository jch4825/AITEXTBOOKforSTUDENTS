import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { diagnosticQuestions } from '../../data/diagnosticQuestions';
import { modules } from '../../data/tutorialData';
import { DiagnosticAnswers, DiagnosticPurpose, Module } from '../../types';
import { calculateDiagnosticResult, saveDiagnostic, skipDiagnostic } from '../../services/diagnostic';
import PersonaRecommendCard from './PersonaRecommendCard';

interface DiagnosticModalProps {
  onClose: () => void;
  onStartModule: (module: Module) => void;
  onOpenTools: () => void;
  onOpenResources: () => void;
}

function isComplete(answers: DiagnosticAnswers): answers is Required<DiagnosticAnswers> {
  return (
    answers.q1 !== undefined &&
    answers.q2 !== undefined &&
    answers.q3 !== undefined &&
    answers.q4 !== undefined &&
    answers.q5 !== undefined &&
    answers.q6 !== undefined
  );
}

export default function DiagnosticModal({ onClose, onStartModule, onOpenTools, onOpenResources }: DiagnosticModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const result = useMemo(() => {
    return isComplete(answers) ? calculateDiagnosticResult(answers) : null;
  }, [answers]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const finish = () => {
    if (!isComplete(answers)) return;
    saveDiagnostic(answers);
    setStep(7);
  };

  const handleSkip = () => {
    skipDiagnostic();
    onClose();
  };

  const handleStartModule = (moduleId: string) => {
    const module = modules.find(item => item.id === moduleId);
    if (module) {
      onStartModule(module);
      onClose();
    }
  };

  const question = step >= 1 && step <= 6 ? diagnosticQuestions[step - 1] : null;
  const progressPct = question ? (step / diagnosticQuestions.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/55 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="diagnostic-title"
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={handleSkip}
          aria-label="진단 닫기"
          className="absolute right-3 top-3 z-10 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          {step === 0 && (
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-canva-teal">AI Bridge 진단</p>
              <h1 id="diagnostic-title" className="text-2xl font-black text-canva-ink">선생님께 맞는 시작점을 찾아드릴게요</h1>
              <p className="mt-4 text-sm font-medium leading-7 text-canva-gray">
                1분 정도 걸리는 6개의 질문입니다. 정답이나 오답은 없고, 답변은 이 브라우저 안에만 저장됩니다.
              </p>
              <div className="mt-6 rounded-xl bg-canva-bg p-4 text-sm leading-7 text-canva-ink">
                <p>처음이시면 모듈 0부터, 이미 익숙하시면 필요한 자료와 도구부터 볼 수 있도록 학습 경로를 조정합니다.</p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-canva-purple px-5 py-3 text-sm font-extrabold text-white hover:bg-canva-purple/90"
                >
                  시작하기
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="rounded-xl border border-canva-border px-5 py-3 text-sm font-bold text-canva-gray hover:bg-gray-50"
                >
                  건너뛰기
                </button>
              </div>
            </div>
          )}

          {question && (
            <div>
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-xs font-bold text-canva-gray">
                  <span>{step} / {diagnosticQuestions.length}</span>
                  <span>자가 진단</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-canva-purple transition-all" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
              <h1 id="diagnostic-title" className="text-xl font-black leading-8 text-canva-ink">
                Q{step}. {question.title}
              </h1>
              <div className="mt-6 space-y-3">
                {question.options.map((option, index) => {
                  const selected = answers[question.id] === option.value;
                  return (
                    <button
                      key={`${question.id}-${index}`}
                      type="button"
                      onClick={() => setAnswers(prev => ({ ...prev, [question.id]: option.value }))}
                      className={`w-full rounded-xl border px-4 py-4 text-left text-sm font-bold leading-6 transition-all ${
                        selected
                          ? 'border-canva-purple bg-canva-purple/8 text-canva-purple ring-2 ring-canva-purple/15'
                          : 'border-canva-border bg-white text-canva-ink hover:border-canva-purple/50 hover:bg-canva-bg'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(current => Math.max(0, current - 1))}
                  className="inline-flex items-center gap-2 rounded-xl border border-canva-border px-4 py-3 text-sm font-bold text-canva-gray hover:bg-gray-50"
                >
                  <ArrowLeft size={16} />
                  이전
                </button>
                <button
                  type="button"
                  disabled={answers[question.id] === undefined}
                  onClick={() => {
                    if (step < 6) setStep(step + 1);
                    else finish();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-canva-purple px-5 py-3 text-sm font-extrabold text-white hover:bg-canva-purple/90 disabled:opacity-40"
                >
                  {step < 6 ? '다음' : '결과 보기'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 7 && result && (
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-canva-teal">추천 결과</p>
              <PersonaRecommendCard
                persona={result.persona}
                purpose={result.purpose as DiagnosticPurpose}
                onStartModule={handleStartModule}
                onOpenTools={() => { onOpenTools(); onClose(); }}
                onOpenResources={() => { onOpenResources(); onClose(); }}
              />
              <button
                type="button"
                onClick={onClose}
                className="mt-4 w-full rounded-xl border border-canva-border px-5 py-3 text-sm font-bold text-canva-gray hover:bg-gray-50"
              >
                나중에 직접 둘러보기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
