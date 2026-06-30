import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Difficulty, FontSize, SettingsState } from '../types';
import { loadSettings, saveSettings } from '../utils/storage';

interface SettingsContextValue extends SettingsState {
  setDifficulty: (d: Difficulty) => void;
  setFontSize: (f: FontSize) => void;
  setTTSEnabled: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SettingsState>(() => loadSettings());

  useEffect(() => { saveSettings(state); }, [state]);

  useEffect(() => {
    document.documentElement.dataset.fontSize = state.fontSize;
    document.documentElement.dataset.difficulty = state.difficulty;
  }, [state.fontSize, state.difficulty]);

  const setDifficulty = useCallback((d: Difficulty) => setState(s => ({ ...s, difficulty: d })), []);
  const setFontSize = useCallback((f: FontSize) => setState(s => ({ ...s, fontSize: f })), []);
  const setTTSEnabled = useCallback((v: boolean) => setState(s => ({ ...s, ttsEnabled: v })), []);

  const value = useMemo<SettingsContextValue>(
    () => ({ ...state, setDifficulty, setFontSize, setTTSEnabled }),
    [state, setDifficulty, setFontSize, setTTSEnabled],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
