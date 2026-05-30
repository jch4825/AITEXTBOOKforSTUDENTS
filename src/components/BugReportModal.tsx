import { Bug, X } from 'lucide-react';
import React, { useState } from 'react';
import { submitBugReport } from '../services/bugReport';

interface BugReportModalProps {
  onClose: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function BugReportModal({ onClose }: BugReportModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const canSubmit = description.trim().length >= 5 && status !== 'submitting';

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus('submitting');
    setError('');
    try {
      await submitBugReport({
        title: title.trim(),
        description: description.trim(),
        contact: contact.trim() || undefined,
      });
      setStatus('success');
      window.setTimeout(onClose, 1800);
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
              <Bug size={20} className="text-rose-500" />
            </div>
            <h3 className="font-bold text-base text-canva-ink">버그 신고</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-6 text-center">
            <p className="text-sm font-bold text-emerald-800">신고가 접수되었습니다. 감사합니다!</p>
            <p className="mt-1 text-xs text-emerald-700">소중한 의견은 다음 업데이트에 반영됩니다.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-4">
              문제 상황을 알려주시면 빠르게 확인하고 수정하겠습니다. 자동으로 브라우저 정보와 현재 페이지가 함께 전송됩니다.
            </p>

            <label className="block mb-2 text-xs font-bold text-gray-600">제목 (선택)</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예: API 키 등록이 안 됨"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-canva-purple/30"
              maxLength={100}
            />

            <label className="block mb-2 text-xs font-bold text-gray-600">
              상세 내용 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="언제, 어디서, 어떤 동작을 했을 때 어떤 문제가 생겼는지 자유롭게 적어주세요."
              rows={5}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-canva-purple/30 resize-none"
              maxLength={2000}
            />

            <label className="block mb-2 text-xs font-bold text-gray-600">회신 받을 이메일 (선택)</label>
            <input
              type="email"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="답변이 필요하면 입력해 주세요"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-canva-purple/30"
              maxLength={120}
            />

            {status === 'error' && (
              <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
                전송 실패: {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex-1 py-2.5 bg-canva-purple text-white rounded-xl font-bold text-sm disabled:opacity-40 transition-opacity"
              >
                {status === 'submitting' ? '전송 중…' : '신고 보내기'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
