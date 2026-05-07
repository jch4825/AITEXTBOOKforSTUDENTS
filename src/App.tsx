import React, { Suspense, lazy, useState } from 'react';
import Sidebar from './components/Sidebar';
import { Menu } from 'lucide-react';
import AccessibilityWidget from './components/AccessibilityWidget';
import DiagnosticModal from './components/onboarding/DiagnosticModal';
import { ViewType, Module } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { DIAGNOSTIC_STORAGE_KEYS } from './hooks/useDiagnostic';

const Home = lazy(() => import('./views/Home'));
const Tutorial = lazy(() => import('./views/Tutorial'));
const QuickTools = lazy(() => import('./views/QuickTools'));
const Resources = lazy(() => import('./views/Resources'));

function ViewFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canva-bg px-4">
      <div className="flex items-center gap-3 rounded-xl border border-canva-border bg-white px-4 py-3 text-sm font-bold text-canva-gray shadow-sm">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-canva-purple/30 border-t-canva-purple" />
        화면을 불러오는 중입니다
      </div>
    </div>
  );
}

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('lesson') ? 'tutorial' : 'home';
  });
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(() => {
    try {
      return localStorage.getItem(DIAGNOSTIC_STORAGE_KEYS.onboarded) !== 'true';
    } catch {
      return false;
    }
  });
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ai-teachers-progress');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    if (view !== 'tutorial') setSelectedModule(null);
  };

  const restartDiagnosticWithProgressReset = () => {
    setCompletedLessons([]);
    localStorage.removeItem('ai-teachers-progress');
    setShowDiagnostic(true);
    setIsMobileMenuOpen(false);
  };

  const toggleComplete = (lessonId: string) => {
    setCompletedLessons(prev => {
      const next = prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem('ai-teachers-progress', JSON.stringify(next));
      return next;
    });
  };

  const markComplete = (lessonId: string) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      localStorage.setItem('ai-teachers-progress', JSON.stringify(next));
      return next;
    });
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onViewChange={setCurrentView} onStartDiagnostic={() => setShowDiagnostic(true)} />;
      case 'resources':
        return <Resources />;
      case 'tools':
        return <QuickTools />;
      case 'tutorial':
        return <Tutorial
          selectedModule={selectedModule}
          onSelectModule={setSelectedModule}
          completedLessons={completedLessons}
          onToggleComplete={toggleComplete}
          onMarkComplete={markComplete}
          onOpenTools={() => {
            setCurrentView('tools');
            setSelectedModule(null);
          }}
        />;
      default:
        return <Home onViewChange={setCurrentView} onStartDiagnostic={() => setShowDiagnostic(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-canva-bg font-sans text-canva-ink">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-12 landscape:h-10 bg-white border-b border-canva-border z-40 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-canva-teal tracking-tighter">AI Bridge</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2">
          <Menu size={22} className="text-canva-ink" />
        </button>
      </div>

      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        selectedModule={selectedModule}
        onSelectModule={(mod) => {
          setCurrentView('tutorial');
          setSelectedModule(mod);
        }}
        completedLessons={completedLessons}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onRestartDiagnostic={restartDiagnosticWithProgressReset}
      />

      <main
        className={`md:pl-52 lg:pl-64 min-h-screen transition-[padding] duration-300 ${
          currentView === 'tutorial' ? 'pt-0' : 'pt-12 landscape:pt-10 md:pt-0'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<ViewFallback />}>
              {renderView()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <AccessibilityWidget />
      {showDiagnostic && (
        <DiagnosticModal
          onClose={() => setShowDiagnostic(false)}
          onStartModule={(module) => {
            setCurrentView('tutorial');
            setSelectedModule(module);
          }}
          onOpenTools={() => {
            setCurrentView('tools');
            setSelectedModule(null);
          }}
          onOpenResources={() => {
            setCurrentView('resources');
            setSelectedModule(null);
          }}
        />
      )}
    </div>
  );
}
