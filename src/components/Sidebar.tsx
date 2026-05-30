import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Wrench, GraduationCap, CheckCircle2, Key, X, LogOut, RotateCcw, ChevronLeft, Info } from 'lucide-react';
import { ViewType, Module, Persona } from '../types';
import { modules, lessons } from '../data/tutorialData';
import { motion } from 'motion/react';
import { GEMINI_MODEL_GUIDE } from '../utils/gemini';
import { getModuleVisibility } from '../data/moduleVisibility';
import { loadPersona } from '../hooks/useDiagnostic';
import { clearGeminiApiKey, hasGeminiApiKey, isValidGeminiApiKey, saveGeminiApiKey } from '../services/storage';
import { useExternalStorageState } from '../hooks/useExternalStorageState';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedModule: Module | null;
  onSelectModule: (module: Module | null) => void;
  completedLessons: string[];
  isOpen?: boolean;
  onClose?: () => void;
  onRestartDiagnostic?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ currentView, onViewChange, selectedModule, onSelectModule, completedLessons, isOpen, onClose, onRestartDiagnostic, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const persona = useExternalStorageState<Persona | null>(loadPersona, 'ai-bridge-persona-changed');
  const hasApiKey = useExternalStorageState(hasGeminiApiKey, 'api-key-changed');

  const saveApiKey = () => {
    // 내부 공백·줄바꿈·탭까지 모두 제거 (복사 과정에서 끼어드는 문자 차단)
    const cleaned = apiKeyInput.replace(/\s+/g, '');

    if (!isValidGeminiApiKey(cleaned)) {
      setApiKeyError('"AIza" 또는 "AQ."로 시작하는 키인지 확인해 주세요.');
      return;
    }

    if (!saveGeminiApiKey(cleaned)) {
      setApiKeyError('브라우저 저장 공간이 부족해 키를 저장할 수 없습니다.');
      return;
    }
    setShowApiModal(false);
    setApiKeyInput('');
    setApiKeyError('');
  };

  // 저장 버튼 활성화 조건 (saveApiKey와 동일 기준)
  const isApiKeyValid = isValidGeminiApiKey(apiKeyInput);

  const totalLessons = lessons.length;
  const completedCount = completedLessons.filter(id => lessons.some(l => l.id === id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const menuItems = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'tutorial', label: '인공지능 배워보기', icon: GraduationCap },
    { id: 'tools', label: 'AI 도구 모음', icon: Wrench },
    { id: 'resources', label: '링크 도서관', icon: BookOpen },
  ] as const;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={onClose}
        />
      )}
      <aside className={`w-64 md:w-52 lg:w-64 h-screen bg-white border-r border-canva-border flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'md:-translate-x-full' : 'md:translate-x-0'}`}>
        <div className="p-6 pb-4 shrink-0 relative">
          <h1 className="leading-none">
            <span className="bg-gradient-to-r from-canva-purple to-canva-teal bg-clip-text text-2xl font-black tracking-tighter text-transparent">
              AI Bridge
            </span>
            <span className="mt-0.5 block text-xs font-medium tracking-wide text-canva-gray">
              Zero-Gap Toolkit
            </span>
          </h1>
          <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
            <span className="block h-2.5 w-2.5 bg-canva-ink" />
            <span className="block h-px w-7 bg-canva-purple" />
            <span className="block h-2 w-2 rounded-full bg-canva-teal" />
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              aria-label="사이드바 접기"
              title="사이드바 접기"
              className="hidden md:flex absolute top-5 right-3 w-7 h-7 items-center justify-center rounded-full border border-canva-border bg-white text-canva-gray hover:text-canva-purple hover:border-canva-purple transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

      <nav className="flex-1 min-h-0 px-4 flex flex-col overflow-y-auto webkit-scrollbar-hide">
        <div className="space-y-2 shrink-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id as ViewType);
                  onClose?.();
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-canva-bg text-canva-purple'
                    : 'text-canva-ink opacity-70 hover:opacity-100 hover:bg-canva-bg'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-canva-purple' : ''} />
                {item.label}
              </button>
            );
          })}
        </div>

        {currentView === 'tutorial' && (
          <div className="mt-4 border-t border-canva-border pt-4 shrink-0">
            <p className="text-[10px] font-bold text-canva-gray uppercase tracking-wider px-2 mb-2">모듈 이동</p>
            <div className="space-y-1">
              {modules.map((mod) => {
                const visibility = getModuleVisibility(persona, mod.id);
                if (visibility === 'hidden') return null;
                const isRecommended = visibility === 'recommended';
                const isCollapsed = visibility === 'collapsed';

                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      onSelectModule(selectedModule?.id === mod.id ? null : mod);
                      onClose?.();
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs transition-all duration-200 text-left ${
                      selectedModule?.id === mod.id
                        ? 'bg-canva-purple/10 text-canva-purple font-bold'
                        : isRecommended
                          ? 'bg-canva-teal/10 text-canva-ink font-bold hover:bg-canva-teal/15'
                          : isCollapsed
                            ? 'text-gray-600 hover:text-canva-ink hover:bg-canva-bg'
                            : 'text-gray-700 hover:text-canva-ink hover:bg-canva-bg'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold flex-shrink-0 ${
                      selectedModule?.id === mod.id
                        ? 'bg-canva-purple text-white'
                        : isRecommended
                          ? 'bg-canva-teal text-white'
                          : 'bg-canva-border text-canva-gray'
                    }`}>
                      {mod.order}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{mod.title.replace(/^모듈 \d+: /, '')}</span>
                    {isRecommended && <span className="ml-auto shrink-0 whitespace-nowrap rounded-full bg-white px-1.5 py-0.5 text-[9px] font-black leading-none text-canva-teal">추천</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="p-6 mt-auto border-t border-canva-border flex flex-col gap-4 shrink-0">
        <button
          onClick={() => setShowRestartConfirm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold border border-canva-border text-canva-ink hover:bg-canva-bg transition-colors w-full"
        >
          <RotateCcw size={16} />
          학습 경로 다시 추천
        </button>
        <button
          onClick={() => setShowApiModal(true)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold border transition-colors w-full ${
            hasApiKey
              ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
          }`}
        >
          <Key size={16} />
          {hasApiKey ? 'API 연결됨' : 'API 키 등록'}
        </button>
        {hasApiKey && (
          <button
            onClick={() => setShowExitModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors w-full"
          >
            <LogOut size={16} />
            나가기
          </button>
        )}
        <div className="bg-canva-bg rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-canva-gray uppercase tracking-wider">학습 진도</span>
            <span className="text-xs font-bold text-canva-purple">{progressPercent}%</span>
          </div>
          <div className="w-full bg-canva-border rounded-full h-1.5 overflow-hidden">
            <div className="bg-canva-purple h-1.5 rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-gray-600" />
          <div className="leading-relaxed">
            <p className="text-[11px] font-bold text-gray-700">
              로그인 없이 모든 정보는 이 브라우저에만 저장됩니다.
            </p>
            <p className="mt-1 text-[10px] text-gray-500">
              이어서 학습하시려면 같은 기기·브라우저로 접속해 주세요.
            </p>
          </div>
        </div>
      </div>
      </aside>

      {showExitModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <LogOut size={20} className="text-red-500" />
              </div>
              <h3 className="font-bold text-base text-canva-ink">나가기 전에 확인해 주세요</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              공용 PC에서 사용 중이라면 저장된 <span className="font-bold text-red-600">API 키를 삭제</span>하고 나가세요.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              개인 PC라면 '삭제 없이 나가기'를 눌러도 됩니다.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  clearGeminiApiKey();
                  setShowExitModal(false);
                  window.close();
                  // window.close() may be blocked; show a friendly fallback
                  setTimeout(() => {
                    alert('API 키가 삭제되었습니다.\n브라우저 탭을 직접 닫아주세요.');
                  }, 300);
                }}
                className="w-full py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
              >
                API 키 삭제 후 나가기
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  window.close();
                  setTimeout(() => {
                    alert('브라우저 탭을 직접 닫아주세요.');
                  }, 300);
                }}
                className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                삭제 없이 나가기
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestartConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                <RotateCcw size={20} className="text-amber-500" />
              </div>
              <h3 className="font-bold text-base text-canva-ink">학습 경로 다시 추천</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              다시 추천받으면 지금까지 완료 표시한 <span className="font-bold text-amber-600">학습 기록이 모두 초기화</span>됩니다.
            </p>
            <p className="text-xs text-gray-400 mb-6">계속 진행할까요?</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setShowRestartConfirm(false); onRestartDiagnostic?.(); }}
                className="w-full py-3 bg-canva-teal text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-colors"
              >
                초기화 후 다시 추천받기
              </button>
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {showApiModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base">Gemini API 키 등록</h3>
              <button onClick={() => { setShowApiModal(false); setApiKeyError(''); setShowDeleteConfirm(false); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-canva-purple font-bold hover:underline">Google AI Studio</a>에서 발급한 API 키를 입력하세요.<br />
              키는 브라우저에만 저장되며 서버로 전송되지 않습니다.
            </p>
            <p className="text-[11px] text-gray-400 mb-3">{`\uC774 \uC571\uC740 ${GEMINI_MODEL_GUIDE} \uC21C\uC11C\uB85C \uC2DC\uB3C4\uD569\uB2C8\uB2E4.`}</p>
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => {
                  window.location.href = '?lesson=l1-4';
                }}
                className="text-[11px] font-bold text-canva-purple bg-canva-purple/10 px-2.5 py-1 rounded hover:bg-canva-purple/20 transition-colors"
              >
                💡 API 등록 방법 안내
              </button>
            </div>
            <input
              type="password"
              value={apiKeyInput}
              onChange={e => { setApiKeyInput(e.target.value); setApiKeyError(''); }}
              onKeyDown={e => e.key === 'Enter' && isApiKeyValid && saveApiKey()}
              placeholder="AIza... 또는 AQ...."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              name="gemini-api-key-input"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono mb-2 focus:outline-none focus:ring-2 focus:ring-canva-purple/30"
              autoFocus
            />
            <p className="text-[11px] text-gray-400 mb-1">
              "AIza" 또는 "AQ."로 시작하는 키입니다. 앞뒤 공백·따옴표가 섞이지 않도록 주의하세요.
            </p>
            {apiKeyError && (
              <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">{apiKeyError}</p>
            )}
            {!apiKeyError && <div className="mb-3" />}
            <button
              onClick={saveApiKey}
              disabled={!isApiKeyValid}
              className="w-full py-3 bg-canva-purple text-white rounded-xl font-bold text-sm disabled:opacity-40 transition-opacity mb-3"
            >
              저장하기
            </button>
            {hasApiKey && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-500 mb-2">
                  공용 PC를 사용 중이라면 사용 후 키를 꼭 해제해 주세요.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors"
                  >
                    API 연결 끊기
                  </button>
                ) : (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                    <p className="mb-2 text-xs font-bold text-red-700">저장된 API 키를 삭제할까요?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          clearGeminiApiKey();
                          setShowApiModal(false);
                          setShowDeleteConfirm(false);
                        }}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
