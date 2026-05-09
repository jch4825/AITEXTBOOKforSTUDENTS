import React, { useState, useEffect } from 'react';
import { Home, BookOpen, GraduationCap, Key, X } from 'lucide-react';
import { ViewType } from '../types';
import { GEMINI_MODEL_GUIDE } from '../utils/gemini';

interface TopNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function TopNav({ currentView, onViewChange }: TopNavProps) {
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasApiKey, setHasApiKey] = useState(() => {
    const key = localStorage.getItem('gemini-api-key');
    return !!(key && key.length > 10);
  });

  useEffect(() => {
    const refresh = () => {
      const key = localStorage.getItem('gemini-api-key');
      setHasApiKey(!!(key && key.length > 10));
    };
    window.addEventListener('storage', refresh);
    window.addEventListener('api-key-changed', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('api-key-changed', refresh);
    };
  }, []);

  const saveApiKey = () => {
    const cleaned = apiKeyInput.replace(/\s+/g, '');
    if (!cleaned.startsWith('AIza') || cleaned.length < 30) {
      alert(
        '올바른 형식의 Gemini API 키가 아닙니다.\n\n' +
        'Google AI Studio에서 발급한 키는 "AIza"로 시작하며 약 39자입니다.'
      );
      return;
    }
    localStorage.setItem('gemini-api-key', cleaned);
    window.dispatchEvent(new Event('api-key-changed'));
    setShowApiModal(false);
    setApiKeyInput('');
    window.location.reload();
  };

  const navItems = [
    { id: 'home' as ViewType, label: '홈', icon: Home },
    { id: 'resources' as ViewType, label: '자료실', icon: BookOpen },
    { id: 'tutorial' as ViewType, label: '인공지능 배워보기', icon: GraduationCap },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange('tools')}
            className="font-bold text-canva-purple text-sm"
          >
            AI Bridge
          </button>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-sm font-bold text-gray-500">AI 도구 모음</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowApiModal(true)}
            className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-full font-bold border transition-colors mr-2 ${
              hasApiKey
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            <Key size={11} />
            {hasApiKey ? 'API 연결됨' : 'API 키 등록'}
          </button>

          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hidden sm:flex items-center gap-1.5 ${
                currentView === id
                  ? 'bg-canva-purple/10 text-canva-purple'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </header>

      {showApiModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base">Gemini API 키 등록</h3>
              <button onClick={() => setShowApiModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Google AI Studio에서 발급한 API 키를 입력하세요.<br />
              키는 브라우저에만 저장되며 서버로 전송되지 않습니다.
            </p>
            <p className="text-[11px] text-gray-400 mb-3">{`\uC774 \uC571\uC740 ${GEMINI_MODEL_GUIDE} \uC21C\uC11C\uB85C \uC2DC\uB3C4\uD569\uB2C8\uB2E4.`}</p>

            <input
              type="password"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveApiKey()}
              placeholder="AIza..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono mb-4 focus:outline-none focus:ring-2 focus:ring-canva-purple/30"
              autoFocus
            />
            <button
              onClick={saveApiKey}
              disabled={apiKeyInput.trim().length <= 10}
              className="w-full py-3 bg-canva-purple text-white rounded-xl font-bold text-sm disabled:opacity-40 transition-opacity mb-3"
            >
              저장하기
            </button>
            {hasApiKey && (
              <>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500 mb-2">
                    공용 PC를 사용 중이라면 사용 후 키를 꼭 해제해 주세요.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm('저장된 API 키를 삭제하시겠습니까?\n브라우저에서 완전히 제거됩니다.')) {
                        localStorage.removeItem('gemini-api-key');
                        window.dispatchEvent(new Event('api-key-changed'));
                        setShowApiModal(false);
                        window.location.reload();
                      }
                    }}
                    className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors"
                  >
                    API 연결 끊기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
