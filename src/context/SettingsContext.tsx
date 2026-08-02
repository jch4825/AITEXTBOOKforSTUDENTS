import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Difficulty, FontSize, SettingsState } from '../types';
import { primeSounds, setSoundEnabled as applySoundEnabled } from '../utils/sound';
import { loadSettings, saveSettings } from '../utils/storage';

interface SettingsContextValue extends SettingsState {
  setDifficulty: (d: Difficulty) => void;
  setFontSize: (f: FontSize) => void;
  setTTSEnabled: (v: boolean) => void;
  setSoundEnabled: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SettingsState>(() => loadSettings());

  useEffect(() => { saveSettings(state); }, [state]);

  useEffect(() => {
    document.documentElement.dataset.fontSize = state.fontSize;
    document.documentElement.dataset.difficulty = state.difficulty;
  }, [state.fontSize, state.difficulty]);

  useEffect(() => { applySoundEnabled(state.soundEnabled); }, [state.soundEnabled]);

  // 브라우저는 사용자가 화면을 한 번 건드리기 전에는 소리를 내주지 않는다.
  // 첫 조작에서 음원을 미리 받아 두어야 첫 소리가 늦지 않는다.
  useEffect(() => {
    const prime = () => { if (state.soundEnabled) primeSounds(); };
    window.addEventListener('pointerdown', prime, { once: true });
    return () => window.removeEventListener('pointerdown', prime);
  }, [state.soundEnabled]);

  const setDifficulty = useCallback((d: Difficulty) => setState(s => ({ ...s, difficulty: d })), []);
  const setFontSize = useCallback((f: FontSize) => setState(s => ({ ...s, fontSize: f })), []);
  const setTTSEnabled = useCallback((v: boolean) => setState(s => ({ ...s, ttsEnabled: v })), []);
  const setSoundEnabled = useCallback((v: boolean) => {
    setState(s => ({ ...s, soundEnabled: v }));
    if (v) primeSounds();
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ ...state, setDifficulty, setFontSize, setTTSEnabled, setSoundEnabled }),
    [state, setDifficulty, setFontSize, setTTSEnabled, setSoundEnabled],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
