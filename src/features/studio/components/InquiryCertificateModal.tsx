import React, { useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  lessonTitle: string;
  inquiryText: string;
  drawingUrl?: string;
}

export default function InquiryCertificateModal({
  isOpen,
  onClose,
  studentName,
  lessonTitle,
  inquiryText,
  drawingUrl,
}: Props) {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const displayName = studentName.trim() || '자랑스러운 AI 탐구 학생';

  const handlePrint = () => {
    window.print();
  };

  const modalContent = (
    <div className="certificate-print-wrapper fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[color:var(--board-overlay)] p-4 sm:p-6 print:static print:bg-white print:p-0 print:overflow-visible">
      {/* Container Box for Screen & Print */}
      <div className="w-full max-w-4xl space-y-4 my-auto print:m-0 print:p-0 print:max-w-none print:w-[210mm] print:h-[297mm]">
        
        {/* Screen Header Actions (hidden in print) */}
        <div className="surface-paper print-hide flex items-center justify-between gap-3 rounded-2xl p-4 text-[color:var(--brand-ink)]">
          <div className="flex items-center gap-2.5 font-extrabold text-sm sm:text-base">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="leading-tight">A4 탐구 증서 미리보기 (상장 양식)</h3>
              <p className="text-xs font-medium text-[color:var(--ink-2)]">실제 프린터의 안전 여백(상하 12mm, 좌우 15mm)이 자동 적용되어 테마가 잘리지 않고 출력됩니다.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="surface-choice is-primary flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition hover:bg-[color:var(--ink-1)]"
            >
              <span className="text-base">🖨️</span>
              <span>탐구 증서 인쇄 / PDF 저장</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="surface-choice cursor-pointer rounded-xl px-3.5 py-2.5 text-sm font-bold transition hover:bg-[color:var(--paper-2)]"
            >
              닫기
            </button>
          </div>
        </div>

        {/* Printable Award-Style Certificate Sheet (A4 Portrait with Safe Printer Margins) */}
        <div
          ref={certificateRef}
          className="surface-a4 printable-certificate relative mx-auto flex min-h-[297mm] w-full max-w-[210mm] flex-col justify-between rounded-2xl border-[12px] border-double border-amber-600 p-8 text-slate-900 print:m-0 print:h-full print:w-full print:rounded-none print:border-[10px] print:p-[8mm_10mm] print:shadow-none sm:p-12"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 text-amber-600 text-2xl font-serif select-none pointer-events-none">
            ❖
          </div>
          <div className="absolute top-4 right-4 text-amber-600 text-2xl font-serif select-none pointer-events-none">
            ❖
          </div>
          <div className="absolute bottom-4 left-4 text-amber-600 text-2xl font-serif select-none pointer-events-none">
            ❖
          </div>
          <div className="absolute bottom-4 right-4 text-amber-600 text-2xl font-serif select-none pointer-events-none">
            ❖
          </div>

          {/* Top Section */}
          <div className="space-y-6">
            {/* Certificate Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-block px-4 py-1 bg-amber-100/90 text-amber-950 rounded-full font-bold text-xs tracking-wider uppercase border border-amber-300">
                AI INQUIRY CERTIFICATE
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-amber-950 tracking-[0.3em] font-serif pt-2">
                탐 구 증 서
              </h1>
              <p className="text-sm font-extrabold text-amber-900/80">
                특수교육 인공지능(AI) 성찰 및 탐구 기록
              </p>
            </div>

            {/* Student Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-y-2 border-amber-300/80 py-3 text-sm font-bold text-slate-800">
              <div>
                <span className="text-amber-900 font-extrabold mr-2">성 명:</span>
                <span className="text-lg font-black text-slate-900 underline decoration-amber-500 decoration-2 underline-offset-4">
                  {displayName}
                </span>
              </div>
              <div>
                <span className="text-amber-900 font-extrabold mr-2">주 제:</span>
                <span className="text-slate-900 font-bold">{lessonTitle}</span>
              </div>
            </div>

            {/* Inquiry Record Content Box */}
            <div className="space-y-3 bg-amber-50/60 border-2 border-amber-300/80 p-6 rounded-2xl depth-paper">
              <div className="flex items-center gap-2 text-amber-950 font-extrabold text-sm border-b border-amber-200 pb-2">
                <span className="text-lg">📝</span>
                <span>나의 탐구 성찰 기록</span>
              </div>
              <p className="text-base font-semibold leading-relaxed text-slate-900 whitespace-pre-wrap min-h-[6rem]">
                {inquiryText.trim() || '(작성된 탐구 기록이 없습니다)'}
              </p>
              {drawingUrl && (
                <div className="mt-3 pt-3 border-t border-amber-200">
                  <p className="text-xs font-bold text-amber-900 mb-2">🎨 나만의 그림 표현:</p>
                  <img
                    src={drawingUrl}
                    alt="학생 필기 및 그림"
                    className="max-h-40 mx-auto rounded-xl border border-amber-300 bg-[#064E3B] object-contain depth-paper"
                  />
                </div>
              )}
            </div>

            {/* Official Commendation Citation */}
            <div className="text-center space-y-2 px-4 py-4">
              <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed font-serif">
                위 학생은 특수교육 인공지능(AI) 탐구 활동에 적극적으로 참여하여 인공지능의 원리를 바르게 이해하고, 자신만의 깊이 있는 탐구 기록을 올바르게 완성하였으므로 이 증서를 수여합니다.
              </p>
            </div>
          </div>

          {/* Bottom Footer & Official Stamp */}
          <div className="flex items-end justify-between pt-6 border-t-2 border-amber-300/80 mt-auto">
            <div className="text-xs sm:text-sm text-amber-950 font-bold space-y-2">
              <p>수여 일자: {todayStr}</p>
              <p className="text-slate-500">담당 선생님</p>
              <div className="w-36 border-b-2 border-slate-400" />
            </div>

            {/* Decorative Flower Ornament */}
            <div className="relative shrink-0 flex items-center justify-center">
              <div className="surface-stamp flex h-22 w-22 rotate-[-6deg] items-center justify-center rounded-full border-4 border-amber-700 bg-amber-200 text-amber-900 sm:h-26 sm:w-26">
                <span className="text-3xl sm:text-4xl select-none">🌸</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
