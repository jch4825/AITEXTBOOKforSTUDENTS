import React, { useRef } from 'react';

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

  const displayName = studentName.trim() || '자랑스러운 AI 탐구자';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Container Box */}
      <div className="w-full max-w-3xl space-y-4 my-auto print:m-0 print:w-full print:max-w-none">
        {/* Action Header Bar (hidden in print) */}
        <div className="flex items-center justify-between gap-3 p-4 bg-slate-800 text-white rounded-2xl shadow-xl print:hidden">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="text-xl">🏆</span>
            <span>탐구 증서 미리보기 (상장 형태)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>🖨️</span> 탐구 증서 인쇄 / PDF 저장
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm rounded-xl transition cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>

        {/* Printable Award-Style Certificate Card */}
        <div
          ref={certificateRef}
          className="printable-certificate bg-[#FFFDF9] text-slate-900 border-[12px] border-double border-amber-500 rounded-3xl p-8 sm:p-12 shadow-2xl relative space-y-6 print:m-0 print:border-[12px] print:shadow-none print:w-full print:rounded-none"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 text-amber-500 text-2xl font-serif select-none pointer-events-none">
            ❖
          </div>
          <div className="absolute top-3 right-3 text-amber-500 text-2xl font-serif select-none pointer-events-none">
            ❖
          </div>
          <div className="absolute bottom-3 left-3 text-amber-500 text-2xl font-serif select-none pointer-events-none">
            ❖
          </div>
          <div className="absolute bottom-3 right-3 text-amber-500 text-2xl font-serif select-none pointer-events-none">
            ❖
          </div>

          {/* Certificate Header */}
          <div className="text-center space-y-2 pt-2">
            <div className="inline-block px-4 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-xs tracking-wider uppercase border border-amber-300 mb-1">
              AI DIGITAL TEXTBOOK CERTIFICATE
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-amber-950 tracking-[0.25em] font-serif">
              탐 구 증 서
            </h1>
            <p className="text-sm font-bold text-amber-800/80">
              초등학교 AI 디지털교과서 성찰 및 활동 기록
            </p>
          </div>

          {/* Student Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-y-2 border-amber-200 py-3 text-sm font-bold text-slate-800">
            <div>
              <span className="text-amber-800 font-extrabold mr-2">성 명:</span>
              <span className="text-lg font-black text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-4">
                {displayName}
              </span>
            </div>
            <div>
              <span className="text-amber-800 font-extrabold mr-2">주 제:</span>
              <span className="text-slate-800">{lessonTitle}</span>
            </div>
          </div>

          {/* Inquiry Record Content Box */}
          <div className="space-y-3 bg-amber-50/50 border-2 border-amber-300/80 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm border-b border-amber-200 pb-2">
              <span className="text-base">📝</span>
              <span>나의 탐구 성찰 기록</span>
            </div>
            <p className="text-base font-semibold leading-relaxed text-slate-800 whitespace-pre-wrap min-h-[5rem]">
              {inquiryText.trim() || '(작성된 탐구 기록이 없습니다)'}
            </p>
            {drawingUrl && (
              <div className="mt-3 pt-3 border-t border-amber-200/80">
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
          <div className="text-center space-y-2 px-4 py-2">
            <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed font-serif">
              위 학생은 초등학교 AI 디지털교과서 탐구 활동에 적극적으로 참여하여 인공지능의 원리를 바르게 이해하고, 자신만의 깊이 있는 탐구 기록을 올바르게 완성하였으므로 이 증서를 수여합니다.
            </p>
          </div>

          {/* Footer & Official Stamp */}
          <div className="flex items-end justify-between pt-6 border-t border-amber-200">
            <div className="text-xs text-amber-900/80 font-bold space-y-1">
              <p>수여 일자: {todayStr}</p>
              <p>발행 기관: 초등학교 AI 디지털교과서 탐구센터</p>
            </div>

            {/* Official Gold Seal Badge */}
            <div className="relative shrink-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-4 border-amber-200 shadow-xl flex flex-col items-center justify-center text-center p-1 text-slate-950 rotate-[-6deg]">
                <span className="text-xs font-black tracking-tighter">AI 탐구</span>
                <span className="text-base sm:text-xl font-black">인 증</span>
                <span className="text-[10px] font-extrabold text-amber-950">공식 성찰 기록</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
