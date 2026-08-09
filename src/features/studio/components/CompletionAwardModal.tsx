import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultName?: string;
  lessonTitle: string;
  inquirySummary?: string;
}

export default function CompletionAwardModal({
  isOpen,
  onClose,
  defaultName = '자랑스러운 AI 탐구 학생',
  lessonTitle,
  inquirySummary,
}: Props) {
  const [name, setName] = useState(defaultName);
  const [teacherName, setTeacherName] = useState('');

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const modalContent = (
    <div className="award-print-wrapper fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[color:var(--board-overlay)] p-4 sm:p-6 print:static print:bg-white print:p-0 print:overflow-visible">
      <div className="surface-paper completion-award-sheet relative my-auto w-full max-w-4xl rounded-3xl p-6 print:m-0 print:max-w-none print:border-none print:bg-white print:p-0 print:shadow-none">
        {/* Modal Top Bar (hidden in print) */}
        <div className="print-hide no-print mb-4 flex items-center justify-between border-b-2 border-[color:var(--line)] pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <div>
              <h3 className="text-xl font-black text-[color:var(--brand-ink)]">학습 완료 상장 인쇄 미리보기</h3>
              <p className="text-xs text-[color:var(--ink-2)]">차시 탐구를 모두 마친 학생에게 주어지는 화려한 공식 수여 상장입니다.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="surface-choice flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-lg font-bold transition hover:bg-[color:var(--paper-2)]"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* Controls: Student Name, Teacher Name, Print Button (hidden in print) */}
        <div className="print-hide no-print mb-6 space-y-3 rounded-2xl border-2 border-[color:var(--line)] bg-[color:var(--paper-1)] p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label htmlFor="completion-award-name" className="shrink-0 text-sm font-extrabold text-[color:var(--brand-ink)] sm:w-36">
              상장에 새길 이름:
            </label>
            <input
              id="completion-award-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="학생 이름"
              className="h-10 w-full rounded-xl border-2 border-[color:var(--brand-ink)] bg-[color:var(--paper-0)] px-3.5 text-sm font-bold text-[color:var(--brand-ink)] outline-none focus:ring-2 focus:ring-[color:var(--brand-ink)] sm:flex-1"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label htmlFor="completion-award-teacher" className="shrink-0 text-sm font-extrabold text-[color:var(--brand-ink)] sm:w-36">
              담당 선생님 성명:
            </label>
            <input
              id="completion-award-teacher"
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="선생님 이름"
              className="h-10 w-full rounded-xl border-2 border-[color:var(--brand-ink)] bg-[color:var(--paper-0)] px-3.5 text-sm font-bold text-[color:var(--brand-ink)] outline-none focus:ring-2 focus:ring-[color:var(--brand-ink)] sm:flex-1"
            />
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={handlePrint}
              className="surface-choice is-primary flex h-11 cursor-pointer items-center gap-2 rounded-xl px-6 text-sm font-black transition hover:bg-[color:var(--ink-1)]"
            >
              <span>🖨️</span> A4 상장 인쇄하기
            </button>
            <button
              type="button"
              onClick={onClose}
              className="surface-choice h-11 cursor-pointer rounded-xl px-4 text-sm font-bold transition hover:bg-[color:var(--paper-2)]"
            >
              닫기
            </button>
          </div>
        </div>

        {/* Printable Award Diploma Container (Visible on screen preview & media print) */}
        <div className="completion-award-preview max-h-[70vh] overflow-auto rounded-2xl border-2 border-[color:var(--line)] bg-[color:var(--paper-2)] p-2 print:max-h-none print:overflow-visible print:border-none print:bg-white print:p-0">
          <div
            id="completion-award-printable"
            className="surface-a4 completion-award-printable relative mx-auto my-0 rounded-xl border-8 border-double border-amber-600 p-8 font-serif leading-relaxed text-slate-900 print:m-0 print:w-full print:border-8 print:shadow-none md:p-12"
            style={{
              width: '100%',
              maxWidth: '210mm',
              minHeight: '270mm',
              background: 'linear-gradient(135deg, #fffdfa 0%, #fef8ec 50%, #fffdfa 100%)',
              boxSizing: 'border-box',
            }}
          >
            {/* Corner Ornaments */}
            <div className="absolute top-3 left-3 text-amber-600/60 text-2xl select-none">⚜️</div>
            <div className="absolute top-3 right-3 text-amber-600/60 text-2xl select-none">⚜️</div>
            <div className="absolute bottom-3 left-3 text-amber-600/60 text-2xl select-none">⚜️</div>
            <div className="absolute bottom-3 right-3 text-amber-600/60 text-2xl select-none">⚜️</div>

            {/* Inner Golden Border Line */}
            <div className="h-full border-2 border-amber-500/80 p-6 md:p-10 flex flex-col justify-between relative rounded-lg">
              {/* Header Title */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-3 text-amber-600">
                  <span className="h-0.5 w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></span>
                  <span className="text-3xl">👑</span>
                  <span className="h-0.5 w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></span>
                </div>
                <h1 className="my-2 font-serif text-4xl font-extrabold tracking-[0.3em] text-amber-900 md:text-5xl">
                  상 장
                </h1>
                <p className="text-xs tracking-widest text-amber-800 font-sans font-extrabold uppercase">
                  AI Inquiry Excellence Award
                </p>
                <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mt-2"></div>
              </div>

              {/* Awardee Info */}
              <div className="my-6 space-y-2 text-left pl-4 border-l-4 border-amber-500">
                <p className="text-sm font-bold text-amber-800">제 2026-AI-EXCELLENCE 호</p>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-wide font-sans">
                  성 명 : <span className="text-amber-900 underline underline-offset-8 decoration-amber-500">{name || '자랑스러운 AI 탐구 학생'}</span>
                </p>
              </div>

              {/* Citation (수여문) */}
              <div className="my-6 space-y-4 text-center px-4">
                <h2 className="text-xl md:text-2xl font-bold text-amber-900 tracking-wider font-sans">
                  상목: 인공지능(AI) 탐구 학습 최고상
                </h2>
                <p className="text-lg md:text-xl font-medium text-slate-800 leading-loose break-keep font-serif">
                  위 학생은 특수교육 인공지능 탐구 학습 <br />
                  <strong className="text-amber-900 font-bold font-sans">『{lessonTitle}』</strong> 탐구 과정을 성실하게 이수하고, <br />
                  인공지능의 원리를 주도적으로 탐구하여 훌륭한 성찰 기록을 남겼으므로 이 상장을 수여합니다.
                </p>

                {inquirySummary && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-100/60 border border-amber-300/80 text-sm font-sans text-slate-800 text-left max-h-28 overflow-hidden">
                    <span className="font-bold text-amber-900 block mb-1">📜 탐구 성찰 요약:</span>
                    <p className="italic line-clamp-3 leading-relaxed">“{inquirySummary}”</p>
                  </div>
                )}
              </div>

              {/* Date & Official Gold Foil Stamp */}
              <div className="mt-8 pt-6 border-t border-amber-400/50 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="text-center md:text-left space-y-1 font-sans">
                  <p className="text-base font-bold text-slate-700">{todayStr}</p>
                  <p className="text-sm text-slate-500 mt-3">담당 선생님</p>
                  <p className="text-lg font-black text-slate-800 mt-1 min-w-[8rem] border-b-2 border-slate-400 pb-1">
                    {teacherName || '\u00A0'}
                  </p>
                </div>

                {/* Decorative Gold Star Ornament */}
                <div className="surface-stamp relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-amber-700 bg-amber-300 p-1 text-amber-900">
                  <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-amber-700 bg-amber-50">
                    <span className="text-4xl select-none">🌟</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
