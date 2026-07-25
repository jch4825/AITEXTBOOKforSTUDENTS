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
    <div className="certificate-print-wrapper fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto print:static print:p-0 print:bg-white print:overflow-visible">
      {/* Container Box for Screen & Print */}
      <div className="w-full max-w-4xl space-y-4 my-auto print:m-0 print:p-0 print:max-w-none print:w-[210mm] print:h-[297mm]">
        
        {/* Screen Header Actions (hidden in print) */}
        <div className="print-hide flex items-center justify-between gap-3 p-4 bg-slate-900/90 border border-slate-700 text-white rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2.5 font-extrabold text-sm sm:text-base">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="leading-tight">A4 탐구 증서 미리보기 (상장 양식)</h3>
              <p className="text-xs text-amber-300/80 font-medium">실제 프린터의 안전 여백(상하 12mm, 좌우 15mm)이 자동 적용되어 테마가 잘리지 않고 출력됩니다.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <span className="text-base">🖨️</span>
              <span>탐구 증서 인쇄 / PDF 저장</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>

        {/* Printable Award-Style Certificate Sheet (A4 Portrait with Safe Printer Margins) */}
        <div
          ref={certificateRef}
          className="printable-certificate mx-auto bg-[#FFFDF9] text-slate-900 border-[12px] border-double border-amber-600 rounded-2xl p-8 sm:p-12 shadow-2xl relative flex flex-col justify-between w-full max-w-[210mm] min-h-[297mm] box-border print:w-full print:h-full print:p-[8mm_10mm] print:m-0 print:border-[10px] print:shadow-none print:rounded-none"
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
                AI DIGITAL TEXTBOOK CERTIFICATE
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-amber-950 tracking-[0.3em] font-serif pt-2">
                탐 구 증 서
              </h1>
              <p className="text-sm font-extrabold text-amber-900/80">
                특수교육 AI 디지털교과서 성찰 및 활동 기록
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
            <div className="space-y-3 bg-amber-50/60 border-2 border-amber-300/80 p-6 rounded-2xl shadow-2xs">
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
                    className="max-h-40 mx-auto rounded-xl border border-amber-300 bg-[#064E3B] object-contain shadow-xs"
                  />
                </div>
              )}
            </div>

            {/* Official Commendation Citation */}
            <div className="text-center space-y-2 px-4 py-4">
              <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed font-serif">
                위 학생은 특수교육 인공지능(AI) 디지털교과서 탐구 활동에 적극적으로 참여하여 인공지능의 원리를 바르게 이해하고, 자신만의 깊이 있는 탐구 기록을 올바르게 완성하였으므로 이 증서를 수여합니다.
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
              <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border-4 border-amber-200 shadow-xl flex items-center justify-center rotate-[-6deg]">
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
